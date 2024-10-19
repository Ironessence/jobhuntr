// app/api/update-cv/route.ts
"use server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import pdf from "pdf-parse/lib/pdf-parse";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  console.log("Received POST request at /api/update-cv");

  try {
    // Parse the JSON body
    const { fileName, fileType, fileData } = await request.json();

    console.log("Received file:", fileName, "Type:", fileType, "Size:", fileData.length, "bytes");

    if (!fileData) {
      console.error("No file data provided");
      return NextResponse.json({ error: "No file data provided" }, { status: 400 });
    }

    // Decode the Base64 string back into a Buffer
    const buffer = Buffer.from(fileData, "base64");

    console.log("BUFFER:", buffer);

    // Extract text from PDF
    const data = await pdf(buffer);
    const fullText = data.text;

    // Send the extracted text to GPT-4 for summarization
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a professional HR assistant. Provide a brief, professional, corporate summary of the following CV.",
        },
        { role: "user", content: fullText },
      ],
      max_tokens: 15000, // Adjust as needed
    });

    const summary = completion.choices[0].message.content;

    // Return both the full text and the summary
    return NextResponse.json({
      fullText: fullText,
      summary: summary,
    });
  } catch (error) {
    console.error("Error processing CV:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the CV" },
      { status: 500 },
    );
  }
}
