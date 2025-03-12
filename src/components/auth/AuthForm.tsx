"use client";

import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { identifyUser, trackEvent } from "@/lib/analytics";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const signUpSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name cannot contain numbers or special characters"),
  email: z
    .string()
    .email("Invalid email format")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address",
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    number: false,
    special: false,
    uppercase: false,
  });
  const [signInError, setSignInError] = useState<string | React.ReactNode>("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        setRegistrationSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [registrationSuccess]);

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
    mode: "onTouched",
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const forgotPasswordForm = useForm<{ email: string }>({
    resolver: zodResolver(
      z.object({
        email: z.string().email("Invalid email address"),
      }),
    ),
  });

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordStrength({
        length: false,
        number: false,
        special: false,
        uppercase: false,
      });
      return;
    }

    setPasswordStrength({
      length: password.length >= 8,
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
      uppercase: /[A-Z]/.test(password),
    });
  };

  async function onSignUp(values: z.infer<typeof signUpSchema>) {
    setIsLoading(true);
    setRegistrationSuccess(false);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email.toLowerCase(),
          password: values.password,
          name: values.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "User already exists") {
          signUpForm.setError("email", {
            type: "manual",
            message: "The email address is already registered",
          });
          return;
        }
        throw new Error(data.error);
      }

      signUpForm.reset();
      setRegistrationSuccess(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function onSignIn(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    setSignInError("");
    try {
      const result = await signIn("credentials", {
        email: values.email.toLowerCase(),
        password: values.password,
        redirect: false,
      });

      if (result?.error === "UNVERIFIED_EMAIL") {
        setSignInError(
          <div className="text-center space-y-2">
            <p className="text-sm text-destructive">Please verify your email to sign in</p>
            <Button
              variant="link"
              className="text-xs"
              onClick={async () => {
                try {
                  const response = await fetch("/api/auth/resend", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: values.email }),
                  });

                  if (!response.ok) throw new Error();
                  toast.success("Verification email sent!");
                } catch (error) {
                  toast.error("Failed to send verification email");
                }
              }}
            >
              Resend verification email
            </Button>
          </div>,
        );
      } else if (result?.error) {
        setSignInError("Invalid credentials");
      } else {
        identifyUser(values.email.toLowerCase());
        window.location.href = "/dashboard";
      }
    } catch (error) {
      setSignInError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function onGoogleSignIn() {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error("Something went wrong with Google sign in");
    } finally {
      setIsLoading(false);
    }
  }

  async function onForgotPassword(values: { email: string }) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email.toLowerCase() }),
      });

      if (!response.ok) throw new Error((await response.json()).error);

      trackEvent("password_reset_requested", {
        success: true,
      });

      toast.success("Password reset email sent!", {
        description: "Please check your email for the reset link",
      });
      setIsForgotPassword(false);
    } catch (error) {
      toast.error("Failed to send reset email", {
        description: error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsLoading(false);
      forgotPasswordForm.reset();
    }
  }

  if (isForgotPassword) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Reset Password</h2>
          <Button
            variant="ghost"
            onClick={() => setIsForgotPassword(false)}
          >
            Back to login
          </Button>
        </div>
        <Form {...forgotPasswordForm}>
          <form
            onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)}
            className="space-y-4"
          >
            <FormField
              control={forgotPasswordForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div>
      {registrationSuccess && (
        <div className="mb-6 p-4 border border-green-200 rounded-md">
          <p className="text-green-600 text-sm text-center">
            A verification email has been sent. Please verify your email.
          </p>
        </div>
      )}
      <Tabs
        defaultValue="signin"
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <Form {...signInForm}>
            <form
              onSubmit={signInForm.handleSubmit(onSignIn)}
              className="space-y-4"
            >
              {signInError && (
                <div className="text-sm font-medium text-red-500 mb-2">{signInError}</div>
              )}
              <FormField
                control={signInForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <Button
                      variant="link"
                      className="px-0 font-normal underline"
                      onClick={() => setIsForgotPassword(true)}
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="signup">
          <Form {...signUpForm}>
            <form
              onSubmit={signUpForm.handleSubmit(onSignUp)}
              className="space-y-4"
            >
              <FormField
                control={signUpForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          validatePassword(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                    <PasswordStrengthIndicator password={field.value} />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I accept the terms of service and privacy policy</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </Form>
        </TabsContent>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={onGoogleSignIn}
            className="w-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Google
          </Button>
        </div>
      </Tabs>
    </div>
  );
}
