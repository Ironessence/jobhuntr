import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_TOKENS = 4000; // Adjust based on the model you're using

function chunkText(text: string, maxTokens: number): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];
  let currentChunk = "";

  for (const word of words) {
    if ((currentChunk + word).length > maxTokens) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
    currentChunk += word + " ";
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const { jobId, userEmail } = await req.json();

    await connectToDatabase();

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const job = user.jobs.id(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const cvChunks = chunkText(user.cv_full_text, MAX_TOKENS);
    const jobDescriptionChunks = chunkText(job.jobDescription, MAX_TOKENS);

    let context = "";
    for (let i = 0; i < Math.max(cvChunks.length, jobDescriptionChunks.length); i++) {
      context += `CV Part ${i + 1}: ${cvChunks[i] || ""}\n\n`;
      context += `Job Description Part ${i + 1}: ${jobDescriptionChunks[i] || ""}\n\n`;
    }

    const prompt = `
      Based on the following CV and job description, generate a single, coherent, and tailored cover letter. 
      Use the candidate's actual information and the specific job details provided. 
      Do not use placeholders like [Your Name] or [Company Name].

      Context:
      ${context}

      Instructions:
      1. Create a professional and engaging cover letter.
      2. Highlight relevant skills and experiences from the CV that match the job description.
      3. Demonstrate enthusiasm for the specific role and company.
      4. Keep the tone professional yet personable.
      5. Ensure the letter is concise, typically not exceeding one page.

      Generate the cover letter now:
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 10000, // Adjust as needed
    });

    const coverLetter = response.choices[0].message.content || "";

    job.coverLetter = coverLetter;
    await user.save();

    return NextResponse.json({ coverLetter }, { status: 200 });
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
