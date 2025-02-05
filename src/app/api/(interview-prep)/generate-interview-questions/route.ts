import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    await connectToDatabase();

    // Find user and check tokens
    const user = await User.findOne({ email });
    if (!user || user.tokens < 50) {
      return NextResponse.json({ error: "Insufficient tokens" }, { status: 400 });
    }

    const prompt = `
      Create exactly 10 technical interview quizzes that are likely to appear in an interview for a ${jobTitle} position at ${company}. 
      ${currentQuestions.length > 0 ? `Do not repeat questions from the following list: ${currentQuestions.map((q) => q.question).join(", ")}` : ""}
      Generate only technical questions and practical exercises (coding, puzzles, etc.). For each question:
      1. Create 4 possible answers
      2. Indicate which answer is correct (0-3)
      3. Provide a brief explanation of why the correct answer is best

      Format the response as a JSON array with objects containing:
     questions: [
     {
     question: string;
     choices: string[];
     correctAnswer: number;
     explanation: string;
     },
     etc...
     ]
      Make the questions challenging but realistic for the position.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical interviewer. Create realistic interview questions with multiple choice answers.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    if (!completion.choices[0].message.content) {
      throw new Error("No content received from OpenAI");
    }

    const response = JSON.parse(completion.choices[0].message.content);

    // Update user document: deduct tokens and update interview questions
    const objectId = new ObjectId(jobId);
    const updatedUser = await User.findOneAndUpdate(
      {
        email,
        "jobs._id": objectId,
      },
      {
        $inc: { tokens: -50 },
        $set: { "jobs.$.interviewQuestions": response.questions },
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error("Failed to update user document");
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return NextResponse.json({ error: "Failed to generate interview questions" }, { status: 500 });
  }
}
