import posthog from "posthog-js";

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    posthog.capture(eventName, properties);
  } else {
    console.log(`[Analytics] ${eventName}`, properties);
  }
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined") {
    posthog.identify(userId, properties);
  }
};
