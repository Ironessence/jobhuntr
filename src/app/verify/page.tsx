import { connectToDatabase } from "@/lib/mongodb";
import { verifyToken } from "@/lib/tokens";
import User from "@/models/User";
import { redirect } from "next/navigation";

export default async function VerifyPage({ searchParams }: { searchParams: { token: string } }) {
  // TODO: Need to fix this
  const email = await verifyToken(searchParams.token);

  if (email) {
    try {
      await connectToDatabase();
      await User.findOneAndUpdate({ email }, { emailVerified: true });
      redirect("/?verified=true");
    } catch (error) {
      console.error("Verification error:", error);
      redirect("/?verified=false");
    }
  } else {
    redirect("/?verified=false");
  }
}
