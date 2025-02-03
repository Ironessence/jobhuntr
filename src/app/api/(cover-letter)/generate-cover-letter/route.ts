import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Get the job data and user email from request body
    const { jobDescription, email, jobId } = await req.json();

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

    const prompt = `
      Based on the following CV: ${user.cv_full_text} and job description: ${jobDescription}, generate a single, coherent, and tailored cover letter, using the candidate's actual information and the specific job details provided.
      Do not use placeholders like [Your Name] or [Company Name] or [Job Title] or [Address] or [Phone Number] or [Email Address] or [Date].

      Instructions:
      1. Create a professional and engaging cover letter, making it sound like the candidate is writing it, as human as possible.
      2. Highlight relevant skills and experiences from the CV that match the job description.
      3. Demonstrate enthusiasm for the specific role and company.
      4. Keep the tone professional yet personable.
      5. Ensure the letter is concise, and do not exceed 360 words.

      Generate the cover letter now:
    `;

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
