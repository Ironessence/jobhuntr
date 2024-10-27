import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cvText } = await request.json();

    console.log("~~~~~CV:", cvText);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a professional CV reviewer. Analyze the CV and provide specific, actionable suggestions for improvement. Focus on content, structure, and impact. Limit to 5 key suggestions. RESPOND IN JSON FORMAT WITH A SINGLE FIELD 'tips' CONTAINING AN ARRAY OF STRINGS.",
        },
        {
          role: "user",
          content: `Please analyze this CV and provide improvement suggestions: ${cvText}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const response = JSON.parse(completion.choices[0]?.message?.content || '{"tips": []}');
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error analyzing CV:", error);
    return NextResponse.json({ error: "Failed to analyze CV" }, { status: 500 });
  }
}
