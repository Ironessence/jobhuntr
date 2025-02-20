export const constants = {
  APP_TITLE: "Apply.ninja",
  STRIPE: {
    PRICES: {
      TOKENS_1000: process.env.NEXT_PUBLIC_STRIPE_PRICE_1000_TOKENS!,
      TOKENS_2300: process.env.NEXT_PUBLIC_STRIPE_PRICE_2300_TOKENS!,
      TOKENS_3800: process.env.NEXT_PUBLIC_STRIPE_PRICE_3800_TOKENS!,
    },
    PRICE_TO_TOKENS: {
      [process.env.NEXT_PUBLIC_STRIPE_PRICE_1000_TOKENS!]: 1000,
      [process.env.NEXT_PUBLIC_STRIPE_PRICE_2300_TOKENS!]: 2300,
      [process.env.NEXT_PUBLIC_STRIPE_PRICE_3800_TOKENS!]: 3800,
    },
  },
  PRICE_CV_SUGGESTIONS: 50,
  PRICE_COMPANY_INSIGHTS: 50,
  PRICE_ESTIMATED_SALARY: 20,
  PRICE_COVER_LETTER: 100,
  PRICE_INTERVIEW_QUESTIONS: 150,
  SUBSCRIPTION: {
    TIERS: {
      FREE: {
        name: "Free",
        price: 0,
        monthlyTokens: 0,
        features: [
          "1,000 one-time tokens",
          "Basic AI assistance",
          "Resume analysis",
          "Cover letter generation",
        ],
      },
      APPRENTICE: {
        name: "Apprentice",
        price: 19,
        monthlyTokens: 2000,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_APPRENTICE!,
        features: [
          "2,000 monthly tokens",
          "Advanced AI assistance",
          "Priority support",
          "Company insights",
          "Salary estimates",
          "Interview preparation",
        ],
      },
      NINJA: {
        name: "Ninja",
        price: 29,
        monthlyTokens: 4000,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_NINJA!,
        popular: true,
        features: [
          "4,000 monthly tokens",
          "Premium AI assistance",
          "24/7 Priority support",
          "Advanced analytics",
          "Custom job alerts",
          "Interview coaching",
          "Unlimited company insights",
        ],
      },
    },
  },
};
