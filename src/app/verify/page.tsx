import { sendWelcomeEmail } from "@/lib/email";
import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/tokens";
import User from "@/models/User";
import { redirect } from "next/navigation";

export default async function VerifyPage({ searchParams }: { searchParams: { token: string } }) {
  if (!searchParams.token) {
    return redirect("/?verified=false");
  }

  try {
    const email = await verifyToken(searchParams.token);

    if (!email) {
      return redirect("/?verified=false");
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return redirect("/?verified=false");
    }

    await User.findOneAndUpdate({ email }, { emailVerified: true }, { new: true });
    sendWelcomeEmail(email);
    redirect("/?verified=true");
  } catch (error) {
    if (error instanceof Error && !error.message.includes("NEXT_REDIRECT")) {
      return redirect("/?verified=false");
    }
    throw error;
  }
}
