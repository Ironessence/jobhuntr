"use client";

import shuriken from "@/assets/icons/icon-applyninja.png";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { usePageTracking } from "@/hooks/usePageTracking";
import { ArrowRight, Briefcase, Building, FileText, MessageSquare, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSection({
  setIsLoginDialogOpen,
}: {
  setIsLoginDialogOpen: (open: boolean) => void;
}) {
  const { user } = useUserContext();
  const router = useRouter();
  // Track page view
  usePageTracking("landing_hero");

  return (
    <section className="relative text-foreground overflow-hidden py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left content */}
          <div className="z-10 ">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-archivo font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-400 to-blue-800 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] filter-none"
              style={{ lineHeight: "1.2" }}
            >
              Land Your Dream Job{" "}
              <span className="text-4xl md:text-5xl lg:text-6xl font-archivo font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-400 to-blue-800 px-4 py-1 rounded relative inline-block transform -skew-y-2">
                <span className="inline-block transform ">5x Faster</span>
              </span>
            </h1>

            <p className="text-lg md:text-xl mb-8 max-w-lg font-sans">
              AI-powered tools that create personalized cover letters, company insights, and
              interview prep tailored to your specific job applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="flex items-center justify-center gap-1  bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-600 font-bold text-black self-center"
                onClick={() => {
                  if (user) {
                    router.push("/dashboard");
                  } else {
                    setIsLoginDialogOpen(true);
                  }
                }}
              >
                <Image
                  src={shuriken}
                  alt="shuriken"
                  width={25}
                  height={25}
                />
                Try for free
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-background"
                  >
                    <Image
                      src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${i + 1}.jpg`}
                      alt={`User ${i + 1}`}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
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
                <p className="text-sm font-medium">
                  Trusted by <span className="font-extrabold ">200+ </span>job applicants
                </p>
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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                    <span
                      className="text-3xl"
                      role="img"
                      aria-label="Pointing at you"
                    >
                      🫵🏼
                    </span>
                  </div>
                  <p className="font-extrabold font-archivo mt-2">You</p>
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
                  <span
                    className="text-xl"
                    role="img"
                    aria-label="Confetti"
                  >
                    🎉
                  </span>
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
                  <span
                    className="text-xl transform scale-x-[-1]"
                    role="img"
                    aria-label="Confetti"
                  >
                    🎉
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
