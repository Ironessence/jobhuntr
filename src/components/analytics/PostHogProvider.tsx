"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

// Initialize PostHog
if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com", // Updated to match your env
    capture_pageview: true, // Changed to true to enable automatic pageview tracking
    persistence: "localStorage",
    loaded: (posthog) => {
      // Enable debug mode in development
      if (process.env.NODE_ENV !== "production") {
        posthog.debug();
      }
    },
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      // Manually capture pageview with additional properties
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`;
      }

      // Track pageview with additional metadata
      posthog.capture("$pageview", {
        $current_url: url,
        path: pathname,
        referrer: document.referrer,
        page_title: document.title,
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
      });

      // Set up page leave tracking
      const handleBeforeUnload = () => {
        posthog.capture("$pageleave", {
          $current_url: url,
          path: pathname,
          time_on_page: Date.now() - performance.now(), // Approximate time on page
        });
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [pathname, searchParams]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
