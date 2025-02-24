"use client";

import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const resetSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
});

function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [currentPassword, setCurrentPassword] = useState("");

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
  });

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error);
      }

      toast.success("Password reset successfully!");
      window.location.href = "/?reset=success";
    } catch (error) {
      toast.error("Failed to reset password", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container max-w-md mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <Input
            type="password"
            placeholder="New password"
            {...form.register("password")}
            onChange={(e) => {
              form.register("password").onChange(e);
              setCurrentPassword(e.target.value);
            }}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.password.message}</p>
          )}
          <div className="mt-3">
            <PasswordStrengthIndicator password={currentPassword} />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
