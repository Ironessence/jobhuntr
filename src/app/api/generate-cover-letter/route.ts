import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Get the job data and user email from request body
    const { jobDescription, email, jobId } = await req.json();

    console.log("~~~~~~~~~JOB ID FROM REQ:", jobId);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 401 });
    }

    await connectToDatabase();

    // Find user and check tokens
    const user = await User.findOne({ email });
    if (!user || user.tokens < 100) {
      return NextResponse.json({ error: "Insufficient tokens" }, { status: 400 });
    }

    if (!user.cv_full_text) {
      return NextResponse.json({ error: "No CV found" }, { status: 400 });
    }

    // Generate cover letter using OpenAI
    const prompt = `Create a professional cover letter for the following job description, using the candidate's experience from their CV: ${user.cv_full_text}\n\nJob Description: ${jobDescription}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a professional cover letter writer. Create a compelling cover letter that highlights relevant experience and skills from the CV that match the job description.",
        },
        { role: "user", content: prompt },
      ],
    });

    const coverLetter = completion.choices[0].message.content;

    // Convert string jobId to ObjectId using the correct constructor
    const objectId = ObjectId.createFromHexString(jobId);

    // Update user document: deduct tokens and update cover letter
    const updatedUser = await User.findOneAndUpdate(
      {
        email,
        "jobs._id": objectId,
      },
      {
        $inc: { tokens: -100 },
        $set: { "jobs.$.coverLetter": coverLetter },
      },
      { new: true },
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update job" }, { status: 400 });
    }

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json({ error: "Failed to generate cover letter" }, { status: 500 });
  }
}
