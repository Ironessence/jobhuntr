import { sendVerificationEmail } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

    // Generate verification token
    const verificationToken = crypto.randomInt(100000, 999999).toString();

    // Create unverified user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      emailVerified: false,
      tokens: 1000,
      tier: "FREE",
    });

    try {
      await sendVerificationEmail(email);
    } catch (emailError) {
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
