import { constants } from "@/constants";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { GoogleGenerativeAI, ResponseSchema, SchemaType } from "@google/generative-ai";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { company, email, jobId, role } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 401 });
    }

    await connectToDatabase();

    // Find user and check tokens
    const user = await User.findOne({ email });
    if (!user || user.tokens < constants.PRICE_COMPANY_INSIGHTS) {
      return NextResponse.json({ error: "Insufficient tokens" }, { status: 400 });
    }

    const schema: ResponseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        rating: {
          type: SchemaType.NUMBER,
          description:
            "Rating from 1 to 5, combining ratings from Glassdoor, LinkedIn, Indeed etc.",
        },
        overview: {
          type: SchemaType.STRING,
          description: "General company overview and market position",
        },
        culture: {
          type: SchemaType.STRING,
          description: "Company culture and work environment details",
        },
        benefits: {
          type: SchemaType.STRING,
          description: "Known benefits and perks",
        },
        interviewProcess: {
          type: SchemaType.STRING,
          description: "Typical interview process description",
        },
        prosAndCons: {
          type: SchemaType.OBJECT,
          properties: {
            pros: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "Array of company pros",
            },
            cons: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "Array of company cons",
            },
          },
          required: ["pros", "cons"],
        },
      },
      required: ["rating", "overview", "culture", "benefits", "interviewProcess", "prosAndCons"],
    };

    const prompt = `
      Analyze the following company on Glassdoor and other similar sources, by browsing the internet:
      Company: ${company}
      Role: ${role}

      Provide a comprehensive analysis with the following requirements:

      1. Rating: Combine ratings from Glassdoor, LinkedIn, Indeed etc. (1-5 scale)
      2. Overview: Provide detailed company overview and market position
      3. Culture: Describe company culture and work environment based on employee reviews
      4. Benefits: List known benefits and perks from employee reviews
      5. Interview Process: Detail the typical interview process
      6. Pros and Cons: List key advantages and disadvantages based on employee reviews

      Make the analysis detailed and insightful, focusing on the specific role and company information.
      Return only valid JSON with no markdown formatting.
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
    const resultText = result.response.text();
    const cleanedResultText = resultText.replace(/```(json)?/g, "").trim();
    const insights = JSON.parse(cleanedResultText);

    // Update user document
    const objectId = ObjectId.createFromHexString(jobId);
    const updatedUser = await User.findOneAndUpdate(
      {
        email,
        "jobs._id": objectId,
      },
      {
        $inc: { tokens: -constants.PRICE_COMPANY_INSIGHTS },
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
