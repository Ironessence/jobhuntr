import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { cv, email } = body;

  try {
    if (req.method !== "POST") {
      return new NextResponse("Only POST Requests allowed", { status: 200 });
    }
    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    try {
      const response = await User.findOneAndUpdate(
        { email: email },
        { $set: { cv: cv } },
        { new: true },
      );
      return NextResponse.json(response);
    } catch (err) {
      return new NextResponse(JSON.stringify(err), { status: 500 });
    }
  } catch (err) {
    return new NextResponse("Error when saving idea", { status: 500 });
  }
};
