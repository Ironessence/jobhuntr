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
};
