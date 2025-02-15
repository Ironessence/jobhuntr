import { constants } from "@/constants";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { GoogleGenerativeAI, ResponseSchema, SchemaType } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { cvText, email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 401 });
    }

    await connectToDatabase();

    // Find user and check tokens
    const user = await User.findOne({ email });
    if (!user || user.tokens < constants.PRICE_CV_SUGGESTIONS) {
      return NextResponse.json({ error: "Insufficient tokens" }, { status: 400 });
    }

    const schema: ResponseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        tips: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.STRING,
            description: "A specific, actionable suggestion for CV improvement",
          },
          description: "Array of CV improvement suggestions",
        },
      },
      required: ["tips"],
    };

    const prompt = `
      Analyze this CV and provide improvement suggestions:
      ${cvText}

      Return ONLY a valid JSON object with the following structure:
      {
        "tips": [
          "suggestion 1",
          "suggestion 2",
          "suggestion 3",
          "suggestion 4",
          "suggestion 5"
        ]
      }

      Requirements:
      - Provide exactly 5 specific, actionable suggestions
      - Focus on content, structure, and impact
      - Each suggestion should be clear and implementable
      - Do not include any text outside the JSON object
      - Ensure the response is valid JSON
    `;

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;

    let suggestions;
    try {
      suggestions = JSON.parse(response.text());

      // Validate the response structure
      if (!suggestions.tips || !Array.isArray(suggestions.tips) || suggestions.tips.length !== 5) {
        throw new Error("Invalid response format");
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      return NextResponse.json({ error: "Failed to generate valid suggestions" }, { status: 500 });
    }

    // Update user document
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $inc: { tokens: -constants.PRICE_CV_SUGGESTIONS },
        $set: { cv_suggestions: suggestions.tips },
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error("Failed to update user document");
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error analyzing CV:", error);
    return NextResponse.json({ error: "Failed to analyze CV" }, { status: 500 });
  }
}
