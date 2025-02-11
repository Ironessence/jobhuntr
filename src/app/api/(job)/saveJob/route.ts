import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { JobStatus } from "@/types/Job.types";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { jobTitle, company, jobDescription, email } = await req.json();

    if (!jobTitle || !company || !jobDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { email: email },
      {
        $push: {
          jobs: {
            jobTitle,
            company,
            jobDescription,
            status: JobStatus.ADDED,
            createdAt: new Date(),
          },
        },
      },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newJob = user.jobs[user.jobs.length - 1];

    return NextResponse.json(
      {
        message: "Job saved successfully",
        jobId: newJob._id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving job:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
