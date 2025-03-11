import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, token } = await req.json();

    await connectToDatabase();

    const user = await User.findOne({
      email,
      verificationToken: token,
      emailVerified: false,
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    await User.findByIdAndUpdate(user._id, {
      emailVerified: true,
      $unset: { verificationToken: "" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Error verifying email" }, { status: 500 });
  }
}
