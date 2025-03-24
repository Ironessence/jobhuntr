import { constants } from "@/constants";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { GoogleGenerativeAI, ResponseSchema, SchemaType } from "@google/generative-ai";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const schema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    coverLetter: {
      type: SchemaType.STRING,
      description: "A professional cover letter",
    },
  },
  required: ["coverLetter"],
};

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, email, jobId } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user || user.tokens < constants.PRICE_COVER_LETTER) {
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
      6. Important - Do not lie. Do not make up skills or experiences, only write about what is actually in the CV.

      Return only valid JSON with no markdown formatting.
    `;

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
    const { coverLetter } = JSON.parse(cleanedResultText);

    const objectId = ObjectId.createFromHexString(jobId);
    const updatedUser = await User.findOneAndUpdate(
      {
        email,
        "jobs._id": objectId,
      },
      {
        $inc: { tokens: -constants.PRICE_COVER_LETTER },
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
