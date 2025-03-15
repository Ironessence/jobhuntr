"use client";

import { Button } from "@/components/ui/button";
import { usePageTracking } from "@/hooks/usePageTracking";
import {
  ArrowRight,
  Briefcase,
  Building,
  FileText,
  MessageSquare,
  Star,
  User,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  // Track page view
  usePageTracking("landing_hero");

  return (
    <section className="relative text-foreground overflow-hidden py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="z-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-archivo font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-400 to-blue-800 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] filter-none">
              Land Your Dream Job 3x Faster
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-lg">
              AI-powered tools that create personalized cover letters, company insights, and
              interview prep tailored to your specific job applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
                >
                  Try for free
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center border-2 border-background"
                  >
                    <UserIcon className="h-4 w-4 text-white" />
                  </div>
                ))}
              </div>
              <div className="ml-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm font-medium">Trusted by 200+ job applicants</p>
              </div>
            </div>
          </div>

          {/* Right visual representation */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-30"></div>
            <div className="relative bg-background/80 backdrop-blur-xl border rounded-lg overflow-hidden shadow-xl p-8">
              {/* Visual flow diagram */}
              <div className="flex flex-col items-center">
                {/* User */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center mb-2">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-medium">Job Seeker</p>
                </div>

                {/* Arrow down */}
                <ArrowRight className="h-8 w-8 text-blue-500 rotate-90 mb-4" />

                {/* ApplyNinja */}
                <div className="w-full max-w-xs p-4 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 border border-blue-200 dark:border-blue-800 rounded-lg mb-8 text-center">
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
                    ApplyNinja.ai
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    AI-powered job application tools
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-center p-2 bg-background rounded border">
                      <FileText className="h-5 w-5 text-blue-500 mb-1" />
                      <span className="text-xs">Cover Letters</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-background rounded border">
                      <Building className="h-5 w-5 text-cyan-500 mb-1" />
                      <span className="text-xs">Company Insights</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-background rounded border">
                      <MessageSquare className="h-5 w-5 text-blue-500 mb-1" />
                      <span className="text-xs">Interview Prep</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-background rounded border">
                      <FileText className="h-5 w-5 text-cyan-500 mb-1" />
                      <span className="text-xs">CV Suggestions</span>
                    </div>
                  </div>
                </div>

                {/* Arrow down */}
                <ArrowRight className="h-8 w-8 text-blue-500 rotate-90 mb-4" />

                {/* Job opportunities */}
                <div className="flex justify-center gap-4 flex-wrap">
                  {["Google", "Amazon", "Microsoft"].map((company, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-background border rounded-lg"
                    >
                      <Briefcase
                        className={`h-5 w-5 ${i % 2 === 0 ? "text-blue-500" : "text-cyan-500"}`}
                      />
                      <span className="text-sm font-medium">{company}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
