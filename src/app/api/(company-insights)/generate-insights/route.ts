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
    const { company, jobDescription, email, jobId, role } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 401 });
    }

    await connectToDatabase();

    // Find user and check tokens
    const user = await User.findOne({ email });
    if (!user || user.tokens < 75) {
      return NextResponse.json({ error: "Insufficient tokens" }, { status: 400 });
    }

    const prompt = `
      Analyze the following company on Glassdoor and other similar sources, by browsing the internet:
      Company: ${company}
      Role: ${role}

      Provide a comprehensive analysis in JSON format with the following structure:
      {
        "rating": "number 1 to 5, 5 being the highest, obtained from combining the ratings from Glassdoor, Linkedin, Indeed etc.",
        "overview": "General company overview and market position",
        "culture": "Company culture and work environment, based on employee reviews and company policies",
        "benefits": "Known benefits and perks, based on employee reviews and company policies",
        "interviewProcess": "Typical interview process and what to expect, based on employee reviews and company policies",
        "salaryRange": {
          "min": "Minimum salary in numbers (no currency symbol)",
          "max": "Maximum salary in numbers (no currency symbol)",
          "currency": "Currency code (e.g., USD, EUR, GBP)"
        },
        "prosAndCons": {
          "pros": ["Array of pros based on employee reviews"],
          "cons": ["Array of cons based on employee reviews"]
        }
      }

      For the salary range:
      1. Use real salary data from Glassdoor, Indeed, and similar sources. Make it as accurate as possible, instead of a generic "90K-130K" range.
      2. Consider the role level, company location, and industry standards
      3. Provide realistic ranges based on market data
      4. Use the most common currency for the company's main location

      Make the analysis detailed and insightful, based on the role and company information.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert company analyst providing detailed insights about companies and their work environment.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    if (!completion.choices[0].message.content) {
      throw new Error("No content received from OpenAI");
    }

    const insights = JSON.parse(completion.choices[0].message.content);

    // Update user document
    const objectId = ObjectId.createFromHexString(jobId);
    const updatedUser = await User.findOneAndUpdate(
      {
        email,
        "jobs._id": objectId,
      },
      {
        $inc: { tokens: -75 },
        $set: { "jobs.$.companyInsights": insights },
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error("Failed to update user document");
    }

    return NextResponse.json(insights);
  } catch (error) {
    console.error("Error generating company insights:", error);
    return NextResponse.json({ error: "Failed to generate company insights" }, { status: 500 });
  }
}
