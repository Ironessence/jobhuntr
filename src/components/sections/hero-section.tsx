"use client";

import shuriken from "@/assets/icons/icon-applyninja.png";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { usePageTracking } from "@/hooks/usePageTracking";
import { Star } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const { user } = useUserContext();
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string | undefined>("light");
  const [imageLoaded, setImageLoaded] = useState(false);

  // Track page view
  usePageTracking("landing_hero");

  useEffect(() => {
    setCurrentTheme(resolvedTheme || theme);
  }, [theme, resolvedTheme]);

  return (
    <section className="relative text-foreground overflow-hidden py-16 md:py-24 min-h-[95vh] ">
      <div className="container mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Left content */}
          <div className="z-10 md:ml-6">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-archivo font-bold mb-6 text-foreground text-center sm:text-left"
              style={{ lineHeight: "1.2" }}
            >
              Land your dream job{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 font-bold">
                faster
              </span>{" "}
              and{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 font-bold">
                better
              </span>{" "}
              with{" "}
              <span className="relative inline-block">
                <span className="text-4xl md:text-5xl lg:text-6xl font-archivo font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 px-4 py-1 rounded border border-blue-300 dark:border-blue-700">
                  <span className="relative z-10">AI</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-violet-400 opacity-30 blur-sm rounded"></span>
                <span className="absolute inset-0 bg-grid-pattern opacity-20"></span>
                <style jsx>{`
                  .bg-grid-pattern {
                    background-image: linear-gradient(
                        to right,
                        rgba(255, 255, 255, 0.2) 1px,
                        transparent 1px
                      ),
                      linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
                    background-size: 8px 8px;
                  }
                `}</style>
                <span className="absolute top-0 left-0 w-full h-full overflow-hidden">
                  <span className="absolute top-0 left-0 w-full h-[2px] bg-blue-300 animate-[scan_3s_ease-in-out_infinite]"></span>
                </span>
                <style jsx>{`
                  @keyframes scan {
                    0%,
                    100% {
                      transform: translateY(0);
                      opacity: 0.8;
                    }
                    50% {
                      transform: translateY(3500%);
                      opacity: 0.4;
                    }
                  }
                `}</style>
              </span>
            </h1>

            <p className="text-lg md:text-xl mb-8 max-w-lg font-semibold text-left">
              Apply to jobs faster and more accurately with our AI-powered platform that turns the
              job hunt into a rewarding game. Craft winning applications, gain insider company
              knowledge, and ace interviews while earning rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="flex items-center justify-center gap-1 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-600 font-bold text-black self-center group"
                onClick={() => {
                  if (user) {
                    router.push("/dashboard");
                  } else {
                    router.push("/auth");
                  }
                }}
              >
                <div className="transition-transform duration-500 group-hover:rotate-180">
                  <Image
                    src={shuriken}
                    alt="shuriken"
                    width={25}
                    height={25}
                  />
                </div>
                Try for free
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start">
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

          {/* Right visual representation - made larger */}
          <div className="relative md:-ml-4 md:scale-100 bg-card rounded-xl shadow-lg overflow-hidden border border-border">
            <div className="p-6 flex flex-col gap-6">
              {/* Platform visualization */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
                    <Image
                      src={shuriken}
                      alt="ApplyNinja"
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">ApplyNinja.ai</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                        Level 5
                      </span>
                      <span className="text-xs text-muted-foreground">Apprentice</span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                  <span className="text-amber-500">★</span> 350 XP
                </div>
              </div>

              {/* Application tools showcase */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-lg border border-border">
                  <div className="text-blue-500 mb-2">✓ AI Cover Letter</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[85%]"></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Personalized for Google</div>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <div className="text-green-500 mb-2">✓ CV Optimization</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 w-[90%]"></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">+40% match improvement</div>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <div className="text-purple-500 mb-2">✓ Company Insights</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 w-[75%]"></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">5 key culture points</div>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <div className="text-amber-500 mb-2">✓ Interview Prep</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 w-[60%]"></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">12 practice questions</div>
                </div>
              </div>

              {/* Gamification elements */}
              <div className="bg-background p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">Weekly Challenges</h4>
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
                    2/3 Complete
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                    <span className="text-sm">Apply to 5 jobs</span>
                    <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                      +100 XP
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                    <span className="text-sm">Complete 3 mock interviews</span>
                    <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                      +150 XP
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs">
                      !
                    </div>
                    <span className="text-sm">Research 2 companies</span>
                    <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                      +75 XP
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-auto">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress to Level 6</span>
                  <span>350/500 XP</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 w-[70%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
