"use client";

import { trackEvent } from "@/lib/analytics";
import { useEffect } from "react";

export function usePageTracking(pageName: string, properties?: Record<string, any>) {
  useEffect(() => {
    // Track page view with specific page name
    trackEvent(`viewed_${pageName}_page`, properties);

    const startTime = Date.now();

    return () => {
      // Track page leave with time spent
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      trackEvent(`left_${pageName}_page`, {
        ...properties,
        time_spent_seconds: timeSpent,
      });
    };
  }, [pageName, properties]);
}
