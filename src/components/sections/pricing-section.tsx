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
import { constants } from "@/constants";
import { usePageTracking } from "@/hooks/usePageTracking";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PricingSection() {
  // Track page view
  usePageTracking("landing_pricing");
  const router = useRouter();
  return (
    <section
      className="py-16 md:py-24 bg-muted/30"
      id="pricing"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-archivo">
            Flexible Subscription Plans
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Use your tokens on any feature you want.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.values(constants.SUBSCRIPTION.TIERS).map((plan, index) => (
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
                  <Link
                    href="/auth"
                    className="w-full"
                  >
                    <Button
                      className={`w-full ${plan.popular ? "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => router.push("/auth")}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center max-w-2xl mx-auto">
          <p className="text-muted-foreground">
            All plans allow you to use your tokens on any feature you prefer. Allocate them based on
            your job search priorities.
          </p>
        </div>
      </div>
    </section>
  );
}
