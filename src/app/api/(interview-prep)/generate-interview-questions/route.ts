import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { GoogleGenerativeAI, ResponseSchema, SchemaType } from "@google/generative-ai";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

interface Question {
  question: string;
  choices: string[];
  correctAnswer: number;
  explanation: string;
}

export async function POST(req: NextRequest) {
  try {
    const {
      jobTitle,
      company,
      jobDescription,
      email,
      jobId,
      currentQuestions,
    }: {
      jobTitle: string;
      company: string;
      jobDescription: string;
      email: string;
      jobId: string;
      currentQuestions: Question[];
    } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 401 });
    }

    // Connect to database
    await connectToDatabase();

    // Validate user and tokens
    const user = await User.findOne({ email });
    if (!user || user.tokens < 50) {
      return NextResponse.json({ error: "Insufficient tokens" }, { status: 400 });
    }

    const prompt = `Generate exactly 10 NEW and UNIQUE technical interview questions for a ${jobTitle} role at ${company}.

${
  currentQuestions?.length > 0
    ? `
IMPORTANT: DO NOT USE OR REPHRASE ANY OF THESE EXISTING QUESTIONS:
${currentQuestions.map((q, i) => `${i + 1}. ${q.question}`).join("\n")}

Generate completely different questions covering other technical aspects or scenarios.
`
    : ""
}

Requirements:
- Questions should be practical coding challenges or technical puzzles
- Focus on real-world problem-solving rather than theoretical concepts
- Each question should test different skills or concepts
- Make questions challenging but realistic for the position level
- Avoid basic definition questions
- Questions should require analytical thinking

Return only valid JSON with no markdown formatting.`;

    const schema: ResponseSchema = {
      description: "List of interview questions",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: {
            type: SchemaType.STRING,
            description: "The interview question text",
            nullable: false,
          },
          choices: {
            type: SchemaType.ARRAY,
            description: "An array of exactly 4 strings representing the possible answers",
            nullable: false,
            items: {
              type: SchemaType.STRING,
            },
          },
          correctAnswer: {
            type: SchemaType.NUMBER,
            description: "The index (0-3) of the correct answer",
            nullable: false,
          },
          explanation: {
            type: SchemaType.STRING,
            description: "A brief explanation for why the answer is correct",
            nullable: false,
          },
        },
        required: ["question", "choices", "correctAnswer", "explanation"],
      },
    };

    // Instantiate the Gemini client using your Google API key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

    // Later, when calling the Gemini model, pass the valid schema:
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
    const parsedQuestions = JSON.parse(cleanedResultText); // This is already an array

    // First update: Deduct tokens.
    await User.findOneAndUpdate({ email }, { $inc: { tokens: -50 } });

    // Second update: Update the interviewQuestions in the matching job using arrayFilters.
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: { "jobs.$[job].interviewQuestions": parsedQuestions }, // Use parsedQuestions directly
      },
      {
        arrayFilters: [{ "job._id": new ObjectId(jobId) }],
        new: true,
      },
    );

    if (!updatedUser) {
      throw new Error("Failed to update user document");
    }

    return NextResponse.json(parsedQuestions);
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return NextResponse.json({ error: "Failed to generate interview questions" }, { status: 500 });
  }
}
