"use client";

import { constants } from "@/constants";
import { usePageTracking } from "@/hooks/usePageTracking";
import { trackEvent } from "@/lib/analytics";
import { handleApiError } from "@/utils/error-handling";
import { Check } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

export default function PricingSection() {
  // Track page view
  usePageTracking("landing_pricing");
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (priceId: string, tokenAmount: number) => {
    try {
      setIsLoading(true);

      // Track the purchase attempt
      trackEvent("token_purchase_initiated", {
        token_amount: tokenAmount,
      });

      const response = await fetch("/api/purchase-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          tokenAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process purchase");
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (error) {
      handleApiError(error as NextResponse);

      // Track error
      trackEvent("token_purchase_error", {
        token_amount: tokenAmount,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section
      className={`py-16 ${pathname === "/dashboard/buy-tokens" ? "sm:py-8" : "sm:py-24"} ${pathname === "/dashboard/buy-tokens" ? "" : "bg-muted/30"}`}
      id="pricing"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-archivo">
            {pathname === "/dashboard/buy-tokens"
              ? "Purchase Tokens"
              : "Flexible one-time payments"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pay once and focus on your job search, not on your wallet. Use the tokens on any feature
            you want, depending on your job search priorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.values(constants.STRIPE.PRICES).map((plan, index) => (
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
                  <CardTitle className="text-2xl text-center font-extrabold">{plan.name}</CardTitle>
                  <CardDescription className="text-center">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                  </div>
                  <div className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <div
                        key={`included-${i}`}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: feature }}></span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <span className="text-muted-foreground text-center">One-time payment</span>
                  <Link
                    href="/auth"
                    className="w-full"
                  >
                    <Button
                      className={`w-full ${plan.popular ? "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={(e) => {
                        e.preventDefault();
                        if (pathname === "/dashboard/buy-tokens") {
                          handlePurchase(plan.priceId, plan.tokenAmount);
                        } else {
                          router.push("/auth");
                        }
                      }}
                    >
                      {pathname === "/dashboard/buy-tokens" ? "Buy Tokens" : "Get Started"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
