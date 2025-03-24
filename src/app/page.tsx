"use client";

import Navbar from "@/components/navbar/Navbar";
import CtaSection from "@/components/sections/cta-section";
import FAQSection from "@/components/sections/faq-section";
import FeaturesSection from "@/components/sections/features-section";
import Footer from "@/components/sections/footer";
import HeroSection from "@/components/sections/hero-section";
import HowItWorks from "@/components/sections/how-it-works";
import PricingSection from "@/components/sections/pricing-section";
import ProblemSection from "@/components/sections/problem-section";
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
      <ProblemSection />
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
