import { trackFacebookEvent } from "@/lib/analytics/facebook";
import { useEffect } from "react";

export const useFacebookTracking = () => {
  useEffect(() => {
    // Track page view on mount
    trackFacebookEvent("PageView");
  }, []);

  const trackFbEvent = async (eventName: string, data?: any) => {
    // Track client-side
    trackFacebookEvent(eventName, data);

    // Track server-side
    try {
      await fetch("/api/facebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName,
          url: window.location.href,
          userAgent: window.navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error("Error tracking Facebook event:", error);
    }
  };

  return { trackFbEvent };
};
