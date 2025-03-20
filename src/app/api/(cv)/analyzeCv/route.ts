import { constants } from "@/constants";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { GoogleGenerativeAI, ResponseSchema, SchemaType } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 60;

// Request validation schema
const cvAnalysisSchema = z.object({
  cvText: z.string().min(1, "CV text is required").max(50000, "CV text is too long"),
  email: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cvText, email } = cvAnalysisSchema.parse(body);

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    if (user.tokens < constants.PRICE_CV_SUGGESTIONS) {
      return NextResponse.json({ error: "Insufficient tokens" }, { status: 400 });
    }

    const prompt = `Analyze this CV and provide improvement suggestions:
${cvText}

Return ONLY a valid JSON object with the following structure:
{
  "suggestions": [
    {
      "highlighted": "specific text from the CV that needs improvement",
      "suggestion": "detailed suggestion for improving this specific part"
    },
    ...
  ]
}

Each suggestion should:
1. Include the exact text from the CV in the "highlighted" field
2. Provide a clear, actionable suggestion in the "suggestion" field
3. Focus on improving the CV's impact, clarity, or presentation

If the CV is already excellent and you have no suggestions, return an empty array.
Limit to a maximum of 10 most important suggestions.`;

    const schema: ResponseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        suggestions: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              highlighted: {
                type: SchemaType.STRING,
                description: "The specific text from the CV that needs improvement",
              },
              suggestion: {
                type: SchemaType.STRING,
                description: "Detailed suggestion for improving this specific part",
              },
            },
            required: ["highlighted", "suggestion"],
          },
          description: "Array of CV improvement suggestions with highlighted text",
        },
      },
      required: ["suggestions"],
    };

    // Instantiate the Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const result = await model.generateContent(prompt);
    const resultText = result.response.text();
    const cleanedResultText = resultText.replace(/```(json)?/g, "").trim();
    const { suggestions } = JSON.parse(cleanedResultText);

    // Update user tokens and suggestions in DB
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $inc: { tokens: -constants.PRICE_CV_SUGGESTIONS },
        $set: { cv_suggestions: suggestions },
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error("Failed to update user document");
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error("Error analyzing CV:", error);
    return NextResponse.json({ error: "Failed to analyze CV" }, { status: 500 });
  }
}
