import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

//TODO: Might not need this route anymore

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, suggestions } = await req.json();

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { cv_suggestions: suggestions },
      { new: true },
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
