"use client";

import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";
import { constants } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { SubscriptionTiers } from "@/types/Subscription.types";
import { handleApiError } from "@/utils/error-handling";
import { NextResponse } from "next/server";

export default function UpgradePage() {
  const { user } = useUserContext();

  const handleUpgrade = async (priceId: string) => {
    try {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();
      window.location.href = data.url; // Redirect to Stripe Checkout
    } catch (error) {
      handleApiError(error as NextResponse, "creating subscription");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Choose Your Plan</h1>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {(
          Object.entries(constants.SUBSCRIPTION.TIERS) as [
            keyof SubscriptionTiers,
            SubscriptionTiers[keyof SubscriptionTiers],
          ][]
        ).map(([key, tier]) => (
          <SubscriptionCard
            key={key}
            tier={tier.name}
            price={tier.price}
            features={tier.features}
            isPopular={tier.popular}
            isCurrentPlan={user?.tier === key}
            currentTier={user?.tier}
            onSelect={() => tier.priceId && handleUpgrade(tier.priceId)}
          />
        ))}
      </div>
    </div>
  );
}
