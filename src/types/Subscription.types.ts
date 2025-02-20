export interface SubscriptionTier {
  name: string;
  price: number;
  monthlyTokens: number;
  features: string[];
  priceId?: string;
  popular?: boolean;
}

export interface SubscriptionTiers {
  FREE: SubscriptionTier;
  APPRENTICE: SubscriptionTier;
  NINJA: SubscriptionTier;
}

// Type guard to check if a string is a valid tier
export const isValidTier = (tier: string): tier is keyof SubscriptionTiers => {
  return ["FREE", "APPRENTICE", "NINJA"].includes(tier);
};
