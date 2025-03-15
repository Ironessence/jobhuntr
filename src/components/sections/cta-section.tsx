"use client";

import { Button } from "@/components/ui/button";
import { usePageTracking } from "@/hooks/usePageTracking";
import Link from "next/link";

export default function CtaSection() {
  // Track page view
  usePageTracking("landing_final_cta");

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-pink-600/10 to-purple-600/10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of successful job seekers who have accelerated their career with
          ApplyNinja.ai
        </p>

        <Link href="/auth">
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
          >
            Get Started for Free
          </Button>
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">
          No credit card required. Start with 100 free tokens.
        </p>
      </div>
    </section>
  );
}
