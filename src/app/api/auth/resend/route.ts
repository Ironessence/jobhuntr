import { sendVerificationEmail } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    await connectToDatabase();

    const user = await User.findOne({ email, emailVerified: false });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await sendVerificationEmail(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Error sending verification email" }, { status: 500 });
  }
}
