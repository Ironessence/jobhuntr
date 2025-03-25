export const constants = {
  APP_TITLE: "ApplyNinja.ai",
  PRICE_CV_SUGGESTIONS: 10,
  PRICE_COMPANY_INSIGHTS: 10,
  PRICE_ESTIMATED_SALARY: 10,
  PRICE_COVER_LETTER: 10,
  PRICE_INTERVIEW_QUESTIONS: 20,
  PRICE_CV_FIX: 200,
  LIMIT_JOBS_FREE: 5,
  LIMIT_JOBS: 100,
  STRIPE: {
    PRICES: {
      ONE: {
        name: "3000 Tokens",
        tokenAmount: 3000,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ONE!,
        popular: false,
        bonus: undefined,
        description: "For serious job seekers",
        price: 29,
        features: [
          "CV suggestions",
          "CV auto-fix",
          "Cover letter generation",
          "Company insights",
          "Salary insights",
          "Technical interview prep",
          "<strong>Advanced AI model</strong>",
        ],
      },
      TWO: {
        name: "4500 Tokens",
        tokenAmount: 4500,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_TWO!,
        popular: true,
        bonus: 500,
        description: "For power users and job hunters",
        price: 39,
        features: [
          "CV suggestions",
          "CV auto-fix",
          "Cover letter generation",
          "Company insights",
          "Salary insights",
          "Technical interview prep",
          "<strong>Advanced AI model</strong>",
        ],
      },
      THREE: {
        name: "6500 Tokens",
        tokenAmount: 6500,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_THREE!,
        popular: false,
        bonus: 1500,
        description: "Best value for the money for true ninjas",
        price: 49,
        features: [
          "CV suggestions",
          "CV auto-fix",
          "Cover letter generation",
          "Company insights",
          "Salary insights",
          "Technical interview prep",
          "<strong>Advanced AI model</strong>",
        ],
      },
    },
  },
};
