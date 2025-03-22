import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = params.id;
    const { progress, experience, level, tokens } = await req.json();

    // Update user with progress and rewards
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        progress,
        experience,
        level,
        tokens,
      },
      { new: true },
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user progress:", error);
    return NextResponse.json({ error: "Error updating user progress" }, { status: 500 });
  }
}
