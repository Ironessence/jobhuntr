import { sendPasswordResetEmail } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if the email exists
      return NextResponse.json({ success: true });
    }

    await sendPasswordResetEmail(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ error: "Error sending password reset email" }, { status: 500 });
  }
}
