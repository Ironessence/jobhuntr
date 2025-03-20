import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 60;

// Request validation schema
const generatePdfSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = generatePdfSchema.parse(body);

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    if (!user.cv_full_text) {
      return NextResponse.json({ error: "No resume text found" }, { status: 400 });
    }

    // Return the text content and filename
    return NextResponse.json({
      content: user.cv_full_text,
      filename: `${user.cv_file_name.replace(/\.[^/.]+$/, "")}_improved.pdf`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error("Error retrieving resume:", error);
    return NextResponse.json({ error: "Failed to retrieve resume" }, { status: 500 });
  }
}
