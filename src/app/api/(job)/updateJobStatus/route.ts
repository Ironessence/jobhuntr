import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { Job } from "@/types/Job.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { jobId, status, email } = await req.json();

    if (!jobId || !status || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOneAndUpdate(
      { email, "jobs._id": jobId },
      { $set: { "jobs.$.status": status } },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const updatedJob = user.jobs.find((job: Job) => job._id.toString() === jobId);

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("Error updating job status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
