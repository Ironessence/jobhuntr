import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "No email provided" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      fullText: user.cv_full_text,
      fileName: user.cv_file_name,
    });
  } catch (error) {
    console.error("Error fetching CV:", error);
    return NextResponse.json({ error: "An error occurred while fetching the CV" }, { status: 500 });
  }
}
