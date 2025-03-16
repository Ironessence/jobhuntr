"use client";

import { Button } from "@/components/ui/button";
import { usePageTracking } from "@/hooks/usePageTracking";
import Link from "next/link";

export default function CtaSection() {
  // Track page view
  usePageTracking("landing_final_cta");

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-blue-400/10 to-blue-700/10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-archivo">
          Ready to Land Your Dream Job?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of successful job seekers who have accelerated their career with
          ApplyNinja.ai
        </p>

        <Link href="/auth">
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-light font-archivo"
          >
            Get Started for Free
          </Button>
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">
          No credit card required. Start with <span className="font-bold">400 free tokens</span>.
        </p>
      </div>
    </section>
  );
}
