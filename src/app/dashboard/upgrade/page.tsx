"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { SubscriptionTierEnum } from "@/types/Subscription.types";
import { handleApiError } from "@/utils/error-handling";
import { formatDate } from "@/utils/formatters";
import { Check, X } from "lucide-react";
import { NextResponse } from "next/server";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function UpgradePageContent() {
  const { user } = useUserContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  // Helper function to determine if a plan is a lower tier than the user's current plan
  const isPlanLowerTier = (planName: string, userTier?: string): boolean => {
    if (!userTier) return false;

    const tierRanking = {
      FREE: 0,
      APPRENTICE: 1,
      NINJA: 2,
    };

    return (
      tierRanking[planName as keyof typeof tierRanking] <
      tierRanking[userTier as keyof typeof tierRanking]
    );
  };

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
      <h1 className="text-3xl font-bold text-center mb-4">Choose Your Plan</h1>
      <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
        Upgrade your plan to access more tokens and advanced features. Use your tokens on any
        feature you prefer.
      </p>

      {user?.stripeSubscriptionId && !user?.cancelAtPeriodEnd && (
        <div className="text-center mb-8 text-muted-foreground">
          <p>You currently have an active subscription.</p>
          <p className="text-sm">To change plans, please cancel your current subscription first.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Object.values(constants.SUBSCRIPTION.TIERS).map((plan, index) => {
          const isCurrentPlan = user?.tier === plan.name && !user?.cancelAtPeriodEnd;
          const subscriptionStatus = getSubscriptionStatus(plan.name);

          return (
            <div
              key={index}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <Card
                className={`h-full flex flex-col ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-center">
                    {plan.name.charAt(0).toUpperCase() + plan.name.slice(1).toLowerCase()}
                  </CardTitle>
                  <CardDescription className="text-center">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">{plan.price > 0 ? "/month" : ""}</span>

                    {subscriptionStatus && (
                      <div className="mt-2 text-sm font-medium text-blue-600">
                        {subscriptionStatus}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {plan.features.included.map((feature, i) => (
                      <div
                        key={`included-${i}`}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: feature }}></span>
                      </div>
                    ))}
                    {plan.features.excluded.map((feature, i) => (
                      <div
                        key={`excluded-${i}`}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: feature }}></span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${plan.popular ? "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    disabled={
                      isCurrentPlan ||
                      !plan.priceId ||
                      (user?.tier === plan.name && user?.cancelAtPeriodEnd) ||
                      isPlanLowerTier(plan.name, user?.tier)
                    }
                    onClick={() => plan.priceId && handleUpgrade(plan.priceId as string)}
                  >
                    {isCurrentPlan
                      ? "Current Plan"
                      : plan.price === 0
                        ? "Free Plan"
                        : user?.tier === plan.name && user?.cancelAtPeriodEnd
                          ? `Ends on ${formatDate(user.currentPeriodEnd)}`
                          : isPlanLowerTier(plan.name, user?.tier)
                            ? "Lower tier"
                            : "Upgrade"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          );
        })}
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
            <Button
              className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"
              onClick={handleConfirmUpgrade}
            >
              Start New Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={<div>Loading subscription options...</div>}>
      <UpgradePageContent />
    </Suspense>
  );
}
