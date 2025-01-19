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
};
