// app/api/update-cv/route.ts
"use server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import pdf from "pdf-parse/lib/pdf-parse";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    // Parse the JSON body
    const { fileName, fileData, email } = await request.json();

    if (!fileData) {
      return NextResponse.json({ error: "No file data provided" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "No email provided" }, { status: 400 });
    }

    // Decode the Base64 string back into a Buffer
    const buffer = Buffer.from(fileData, "base64");

    // Extract text from PDF
    const data = await pdf(buffer);
    const fullText = data.text;

    // Update user document in the database
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          cv_full_text: fullText,
          cv_file_name: fileName,
        },
      },
      { new: true }, // This option returns the updated document
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the full text
    return NextResponse.json({
      fileName: fileName,
      fullText: fullText,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the CV" },
      { status: 500 },
    );
  }
}
