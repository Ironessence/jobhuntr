"use client";

import Navbar from "@/components/navbar/Navbar";
import CtaSection from "@/components/sections/cta-section";
import FAQSection from "@/components/sections/faq-section";
import FeaturesSection from "@/components/sections/features-section";
import Footer from "@/components/sections/footer";
import HeroSection from "@/components/sections/hero-section";
import HowItWorks from "@/components/sections/how-it-works";
import PricingSection from "@/components/sections/pricing-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import { ResetPasswordToast } from "@/components/verification/ResetPasswordToast";
import { VerificationToast } from "@/components/verification/VerificationToast";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function Home() {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  // Add page tracking
  usePageTracking("home");

  return (
    <div className="min-h-screen flex flex-col">
      <VerificationToast />
      <ResetPasswordToast />
      <Navbar
        setIsLoginDialogOpen={setIsLoginDialogOpen}
        isLoginDialogOpen={isLoginDialogOpen}
      />
      <HeroSection setIsLoginDialogOpen={setIsLoginDialogOpen} />
      <HowItWorks />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
