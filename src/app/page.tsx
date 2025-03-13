"use client";

import HeroSection from "@/components/hero/hero-section";
import Navbar from "@/components/navbar/Navbar";
import { ResetPasswordToast } from "@/components/verification/ResetPasswordToast";
import { VerificationToast } from "@/components/verification/VerificationToast";
import { usePageTracking } from "@/hooks/usePageTracking";

export const dynamic = "force-dynamic";

export default function Home() {
  // Add page tracking
  usePageTracking("home");

  return (
    <div className="min-h-screen flex flex-col">
      <VerificationToast />
      <ResetPasswordToast />
      <Navbar />
      <HeroSection />
    </div>
  );
}
