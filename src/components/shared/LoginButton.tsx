"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NinjaLoader from "./NinjaLoader";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <NinjaLoader className="w-20 h-20" />;
  }

  if (session) {
    return null; // Don't show login button if user is already logged in
  }

  return <Button onClick={() => router.push("/auth")}>Login</Button>;
}
