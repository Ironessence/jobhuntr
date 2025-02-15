import { constants } from "@/constants";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { GoogleGenerativeAI, ResponseSchema, SchemaType } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const schema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    min: {
      type: SchemaType.NUMBER,
      description: "Minimum yearly salary in numbers",
    },
    max: {
      type: SchemaType.NUMBER,
      description: "Maximum yearly salary in numbers",
    },
    currency: {
      type: SchemaType.STRING,
      description: "Currency code (e.g., USD, EUR, RON)",
    },
  },
  required: ["min", "max", "currency"],
};

export async function POST(req: NextRequest) {
  try {
    const { company, role, country, email, jobId } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user || user.tokens < constants.PRICE_ESTIMATED_SALARY) {
      return NextResponse.json({ error: "Insufficient tokens" }, { status: 400 });
    }

    const prompt = `
      Find the YEARLY salary range for the following position:
      Company: ${company}
      Role: ${role}
      Country: ${country}

      Requirements:
      1. Search Glassdoor, Indeed, and similar websites for salary data
      2. Consider the specific country's job market and local salary standards
      3. Use the local currency for the specified country
      4. IMPORTANT: Make sure to convert any monthly salaries to YEARLY amounts
      5. Consider the role level and company's market position
      6. Validate that the range makes sense for the specific country:
         - For Romania, typical IT salaries are often quoted monthly, multiply by 12 for yearly
         - For Western countries, salaries are usually already in yearly amounts
      7. Double-check that the final numbers are yearly salaries, not monthly

      For example:
      - If you find a monthly salary range of 2000-3000 EUR in Romania, return 24000-36000 EUR per year
      - If you find a yearly salary of $80000-$120000 in the US, return as is

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
    const salaryRange = JSON.parse(cleanedResultText);

    const salaryRangeWithCountry = {
      ...salaryRange,
      country,
    };

    const updatedUser = await User.findOneAndUpdate(
      {
        email,
        "jobs.id": jobId,
      },
      {
        $set: {
          "jobs.$.companyInsights.salaryRange": salaryRangeWithCountry,
        },
        $inc: {
          tokens: -constants.PRICE_ESTIMATED_SALARY,
        },
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error("Failed to update user document");
    }

    return NextResponse.json(salaryRangeWithCountry);
  } catch (error) {
    console.error("Error fetching salary range:", error);
    return NextResponse.json({ error: "Failed to fetch salary range" }, { status: 500 });
  }
}
