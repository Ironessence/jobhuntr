"use client";

import { usePageTracking } from "@/hooks/usePageTracking";
import {
  ArrowRight,
  BarChart4,
  Brain,
  Building2,
  CheckCircle,
  DollarSign,
  FileSpreadsheet,
  FileText,
  MessageSquare,
  Trophy,
  Zap,
} from "lucide-react";

export default function HowItWorks() {
  // Track page view
  usePageTracking("landing_how_it_works");

  return (
    <section className="py-24 relative">
      <div
        className="bg-muted/30 inset-0 absolute"
        style={{
          clipPath: "polygon(0 0, 100% 5%, 100% 100%, 0% 100%)",
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-archivo">How ApplyNinja Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform streamlines your entire job application process
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left side: AI Engine visualization */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-card border border-border rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full">
                    <Brain className="h-10 w-10 text-blue-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Job Application AI Engine</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Specialized AI trained on thousands of successful job applications and industry
                  best practices
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-background/50 p-2 rounded-lg">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <span className="text-sm">Real-time analysis</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 p-2 rounded-lg">
                    <BarChart4 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Industry benchmarks</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">Best practices</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 p-2 rounded-lg">
                    <Trophy className="h-5 w-5 text-purple-500" />
                    <span className="text-sm">Gamified experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Feature flow */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* CV Suggestions */}
              <div className="relative">
                <div className="flex flex-col md:flex-row gap-4 bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0 flex justify-center md:justify-start mb-2 md:mb-0">
                    <div className="p-3 bg-blue-500/10 rounded-full self-start">
                      <FileSpreadsheet className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-center md:text-left">
                      CV Suggestions & Automatic Fixes
                    </h3>
                    <p className="text-muted-foreground mb-3 text-center md:text-left">
                      Our AI analyzes your resume against job descriptions to identify missing
                      keywords, suggest improvements, and automatically fix formatting issues.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                        Keyword optimization
                      </span>
                      <span className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                        ATS compatibility
                      </span>
                      <span className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                        Industry-specific formatting
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                </div>
              </div>

              {/* Cover Letter Generation */}
              <div className="relative">
                <div className="flex flex-col md:flex-row gap-4 bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0 flex justify-center md:justify-start mb-2 md:mb-0">
                    <div className="p-3 bg-purple-500/10 rounded-full self-start">
                      <FileText className="h-8 w-8 text-purple-500 " />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-center md:text-left">
                      Personalized Cover Letters
                    </h3>
                    <p className="text-muted-foreground mb-3 text-center md:text-left">
                      Generate tailored cover letters that highlight your relevant skills and
                      experience for each specific job application, saving hours of writing time.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                        Job-specific content
                      </span>
                      <span className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                        Skill highlighting
                      </span>
                      <span className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                        Professional tone
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                </div>
              </div>

              {/* Company Insights */}
              <div className="relative">
                <div className="flex flex-col md:flex-row gap-4 bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0 flex justify-center md:justify-start mb-2 md:mb-0">
                    <div className="p-3 bg-green-500/10 rounded-full self-start">
                      <Building2 className="h-8 w-8 text-green-500 " />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-center md:text-left">
                      Company Insights
                    </h3>
                    <p className="text-muted-foreground mb-3 text-center md:text-left">
                      Access detailed information about potential employers, including culture,
                      values, and interview processes, aggregated from employee reviews across
                      platforms.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                        Company culture
                      </span>
                      <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                        Employee reviews
                      </span>
                      <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                        Interview tips
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                </div>
              </div>

              {/* Salary Estimator */}
              <div className="relative">
                <div className="flex flex-col md:flex-row gap-4 bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0 flex justify-center md:justify-start mb-2 md:mb-0">
                    <div className="p-3 bg-amber-500/10 rounded-full self-start">
                      <DollarSign className="h-8 w-8 text-amber-500 " />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-center md:text-left">
                      Salary Estimator
                    </h3>
                    <p className="text-muted-foreground mb-3 text-center md:text-left">
                      Get accurate salary estimates based on your experience, location, and
                      industry, powered by data from millions of employee-submitted salaries.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full">
                        Market rates
                      </span>
                      <span className="text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full">
                        Location-based
                      </span>
                      <span className="text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full">
                        Experience level
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                </div>
              </div>

              {/* Interview Prep */}
              <div>
                <div className="flex flex-col md:flex-row gap-4 bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex-shrink-0 flex justify-center md:justify-start mb-2 md:mb-0">
                    <div className="p-3 bg-red-500/10 rounded-full self-start">
                      <MessageSquare className="h-8 w-8 text-red-500 " />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-center md:text-left">
                      Interview Preparation
                    </h3>
                    <p className="text-muted-foreground mb-3 text-center md:text-left">
                      Practice with AI-generated technical questions tailored to your role and
                      company, based on real interview experiences and industry standards.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="text-xs bg-red-500/10 text-red-700 dark:text-red-300 px-2 py-1 rounded-full">
                        Technical questions
                      </span>
                      <span className="text-xs bg-red-500/10 text-red-700 dark:text-red-300 px-2 py-1 rounded-full">
                        Role-specific scenarios
                      </span>
                      <span className="text-xs bg-red-500/10 text-red-700 dark:text-red-300 px-2 py-1 rounded-full">
                        Answer feedback
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
