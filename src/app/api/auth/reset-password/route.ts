import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/tokens";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    const email = await verifyToken(token);
    if (!email) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    await connectToDatabase();

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Error resetting password" }, { status: 500 });
  }
}
