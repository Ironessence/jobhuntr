"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-background flex flex-col py-8 md:py-16">
      {/* Back to Home button */}
      <div className="container mx-auto px-4 mb-4">
        <Link href="/">
          <Button
            variant="ghost"
            className="flex items-center gap-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-card rounded-lg shadow-md p-6 border">
            <h1 className="text-2xl font-semibold text-center mb-6">Welcome to ApplyNinja</h1>
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}
