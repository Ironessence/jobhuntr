import { sendVerificationEmail } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// Add this to prevent static page generation
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const { email, password, name } = await req.json();

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create unverified user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      emailVerified: false,
      tokens: 1000,
      tier: "FREE",
    });

    try {
      await sendVerificationEmail(email);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Clean up user if email fails
      await User.deleteOne({ _id: user._id });
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
