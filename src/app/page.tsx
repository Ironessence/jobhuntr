"use client";

import HeroSection from "@/components/hero/hero-section";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/navbar/Navbar";
import CtaSection from "@/components/sections/cta-section";
import FeaturesSection from "@/components/sections/features-section";
import HowItWorks from "@/components/sections/how-it-works";
import PricingSection from "@/components/sections/pricing-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
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
      <HowItWorks />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
