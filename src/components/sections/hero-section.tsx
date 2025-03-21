"use client";

import shuriken from "@/assets/icons/icon-applyninja.png";
import heroBlack from "@/assets/images/hero-black.png";
import heroWhite from "@/assets/images/hero-white.png";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Left content */}
          <div className="z-10 md:ml-6">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-archivo font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-400 to-blue-800 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] filter-none"
              style={{ lineHeight: "1.2" }}
            >
              Land Your Dream Job{" "}
              <span className="text-4xl md:text-5xl lg:text-6xl font-archivo font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-400 to-blue-800 px-4 py-1 rounded relative inline-block transform -skew-y-2">
                <span className="inline-block transform ">5x Faster</span>
              </span>
            </h1>

            <p className="text-lg md:text-xl mb-8 max-w-lg font-semibold">
              AI-powered tools that create personalized cover letters, company insights, and
              interview prep tailored to your specific job applications.
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

          {/* Right visual representation - made larger */}
          <div className="relative md:-ml-4 md:scale-100">
            {!imageLoaded && (
              <div className="absolute inset-0">
                <Skeleton className="w-[100%] sm:w-full h-full rounded-lg" />
              </div>
            )}
            <Image
              src={currentTheme === "dark" ? heroBlack : heroWhite}
              alt="hero-image"
              className={`w-[120%] sm:w-full h-full  scale-110 sm:scale-100 aspect-auto ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              priority
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
