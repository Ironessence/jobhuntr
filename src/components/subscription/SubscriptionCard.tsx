import { Card } from "@/components/ui/card";
import { SubscriptionTiers } from "@/types/Subscription.types";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";

interface SubscriptionCardProps {
  tier: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  currentTier?: keyof SubscriptionTiers;
  subscriptionStatus?: string | null;
  onSelect: () => void;
}

const tierLevel = {
  Free: "FREE",
  Apprentice: "APPRENTICE",
  Ninja: "NINJA",
} as const;

const tierHierarchy = {
  FREE: 0,
  APPRENTICE: 1,
  NINJA: 2,
} as const;

export function SubscriptionCard({
  tier,
  price,
  features,
  isPopular,
  isCurrentPlan,
  currentTier = "FREE",
  subscriptionStatus,
  onSelect,
}: SubscriptionCardProps) {
  // Convert display tier name to enum tier name
  const enumTier = tierLevel[tier as keyof typeof tierLevel];

  // Check if this tier is lower than current tier
  const isLowerTier = tierHierarchy[enumTier] < tierHierarchy[currentTier];
  const isDisabled = isCurrentPlan || isLowerTier;

  return (
    <Card
      className={`relative p-6 flex flex-col h-full ${
        isPopular ? "border-primary shadow-lg" : ""
      } ${isLowerTier ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
          Most Popular
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">{tier}</h3>
        <div className="mt-4">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </div>

      <ul className="space-y-3 flex-grow">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {subscriptionStatus ? (
        <div className="w-full mt-6 text-center text-sm text-muted-foreground">
          {subscriptionStatus}
        </div>
      ) : (
        <Button
          className="w-full mt-6"
          variant={isPopular ? "default" : "outline"}
          disabled={isDisabled}
          onClick={isLowerTier ? undefined : onSelect}
        >
          {isCurrentPlan ? "Current Plan" : isLowerTier ? "Lower Tier" : "Upgrade"}
        </Button>
      )}
    </Card>
  );
}
