"use server";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { email: string } }) => {
  const { email } = params;

  try {
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (user) {
      // User found, return the user document
      return new NextResponse(JSON.stringify(user), { status: 200 });
    } else {
      // User not found, return a response indicating not found
      return new NextResponse("User not found", { status: 404 });
    }
  } catch (err) {
    return new NextResponse("Error fetching user", { status: 500 });
  }
};
