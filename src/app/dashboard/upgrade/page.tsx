"use client";

import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { constants } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { SubscriptionTierEnum, SubscriptionTiers } from "@/types/Subscription.types";
import { handleApiError } from "@/utils/error-handling";
import { formatDate } from "@/utils/formatters";
import { NextResponse } from "next/server";
import { useState } from "react";
import { toast } from "sonner";

export default function UpgradePage() {
  const { user } = useUserContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  const handleUpgrade = async (priceId: string) => {
    // If user has an active subscription (regardless of cancellation status)
    if (user?.stripeSubscriptionId) {
      // If it's not cancelled yet, inform user to cancel first
      if (!user.cancelAtPeriodEnd) {
        toast.info("Change Plan Process", {
          description:
            "Please cancel your current plan in the subscription portal before selecting a new one.",
          action: {
            label: "Manage Subscription",
            onClick: async () => {
              try {
                const response = await fetch("/api/create-portal-session", {
                  method: "POST",
                });
                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.error || "Failed to access subscription portal");
                }

                if (data.url) {
                  window.location.href = data.url;
                }
              } catch (error) {
                toast.error("Unable to access subscription management", {
                  description: "Please try again later or contact support.",
                });
              }
            },
          },
        });
        return;
      }

      // If it's already cancelled, show confirmation dialog
      setSelectedPriceId(priceId);
      setIsDialogOpen(true);
      return;
    }

    // No subscription - proceed directly to Stripe checkout
    try {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      handleApiError(error as NextResponse, "creating subscription");
    }
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPriceId) return;

    try {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: selectedPriceId }),
      });

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      handleApiError(error as NextResponse, "creating subscription");
    }
  };

  const getSubscriptionStatus = (tier: string) => {
    // Free tier case
    if (tier === SubscriptionTierEnum.FREE && tier === user?.tier) {
      return "Current plan";
    }

    // Subscription cases
    if (user?.tier === tier) {
      if (user.stripeSubscriptionId) {
        // If this subscription is being cancelled
        if (user.cancelAtPeriodEnd && user.cancellingSubscriptionId === user.stripeSubscriptionId) {
          return `Ends on ${formatDate(user.currentPeriodEnd)}`;
        }
        // Otherwise it's active
        return "Renews on " + formatDate(user.currentPeriodEnd);
      }
    }

    return null;
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Choose Your Plan</h1>
      {user?.stripeSubscriptionId && !user?.cancelAtPeriodEnd && (
        <div className="text-center mb-8 text-muted-foreground">
          <p>You currently have an active subscription.</p>
          <p className="text-sm">To change plans, please cancel your current subscription first.</p>
        </div>
      )}

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
            isCurrentPlan={user?.tier === key && !user?.cancelAtPeriodEnd}
            currentTier={user?.tier}
            subscriptionStatus={getSubscriptionStatus(key)}
            onSelect={() => tier.priceId && handleUpgrade(tier.priceId)}
          />
        ))}
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm New Subscription</DialogTitle>
            <DialogDescription>
              {user?.cancelAtPeriodEnd ? (
                <>
                  <p>Your current subscription will end on {formatDate(user.currentPeriodEnd)}.</p>
                  <p className="mt-2">
                    Your new subscription will start immediately and you will be billed.
                  </p>
                  <p className="mt-2">
                    Note: You will receive the new subscription benefits immediately after billing.
                  </p>
                </>
              ) : (
                "Are you sure you want to start this subscription?"
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmUpgrade}>Start New Subscription</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
