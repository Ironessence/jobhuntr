"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

function ResetPasswordToastContent() {
  const searchParams = useSearchParams();
  const reset = searchParams.get("reset");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (reset === "success") {
        toast.success("Password reset successfully!", {
          description: "You can now sign in with your new password.",
          duration: 5000,
        });
      } else if (reset === "failed") {
        toast.error("Password reset failed", {
          description: "Please try again or contact support if the problem persists.",
          duration: 5000,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [reset]);

  return null;
}

export function ResetPasswordToast() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordToastContent />
    </Suspense>
  );
}
