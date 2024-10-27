import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobId = params.jobId;
    const userEmail = session.user.email;

    await connectToDatabase();

    const user = await User.findOne({ email: userEmail, "jobs._id": jobId });

    if (!user) {
      return NextResponse.json(
        { error: "You don't have permission to view this job" },
        { status: 403 },
      );
    }

    const job = user.jobs.id(jobId);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
