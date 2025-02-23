"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function VerificationToast() {
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (verified === "true") {
        toast.success("Email verified successfully!", {
          description: "You can now sign in to your account.",
          duration: 5000,
        });
      } else if (verified === "false") {
        toast.error("Verification failed", {
          description: "The verification link is invalid or has expired. Please try again.",
          duration: 5000,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [verified]);

  return null;
}
