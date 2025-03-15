"use client";

import coins1 from "@/assets/images/coins1.png";
import coins2 from "@/assets/images/coins2.png";
import coins3 from "@/assets/images/coins3.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePageTracking } from "@/hooks/usePageTracking";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PricingSection() {
  // Track page view
  usePageTracking("landing_pricing");

  const tokenPackages = [
    {
      name: "Starter",
      tokens: 1000,
      price: 10,
      features: [
        "10+ Cover Letters",
        "20+ Company Insights",
        "50+ CV Suggestions",
        "5+ Interview Preps",
        "No monthly commitment",
      ],
      image: coins1,
      popular: false,
    },
    {
      name: "Professional",
      tokens: 2300,
      price: 20,
      bonus: 300,
      features: [
        "23+ Cover Letters",
        "46+ Company Insights",
        "115+ CV Suggestions",
        "15+ Interview Preps",
        "No monthly commitment",
      ],
      image: coins2,
      popular: true,
    },
    {
      name: "Premium",
      tokens: 3800,
      price: 30,
      bonus: 800,
      features: [
        "38+ Cover Letters",
        "76+ Company Insights",
        "190+ CV Suggestions",
        "25+ Interview Preps",
        "No monthly commitment",
      ],
      image: coins3,
      popular: false,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Flexible Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pay only for what you need with our token-based system. No subscriptions required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tokenPackages.map((pkg, index) => (
            <div
              key={index}
              className="relative"
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <Card
                className={`h-full flex flex-col ${pkg.popular ? "border-pink-500 shadow-lg" : ""}`}
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Image
                      src={pkg.image}
                      alt={`${pkg.name} tokens`}
                      className="h-24 w-auto"
                    />
                  </div>
                  <CardTitle className="text-2xl text-center">{pkg.name}</CardTitle>
                  <CardDescription className="text-center">
                    {pkg.tokens.toLocaleString()} Tokens
                    {pkg.bonus && (
                      <span className="block text-emerald-500 font-semibold">
                        +{pkg.bonus.toLocaleString()} Bonus Tokens!
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">${pkg.price}</span>
                    <span className="text-muted-foreground"> one-time</span>
                  </div>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link
                    href="/auth"
                    className="w-full"
                  >
                    <Button
                      className={`w-full ${pkg.popular ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white" : ""}`}
                      variant={pkg.popular ? "default" : "outline"}
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
            Need more? We also offer subscription plans with monthly token allowances for frequent
            job seekers.
            <Link
              href="/dashboard/upgrade"
              className="text-pink-600 hover:text-pink-700 ml-1 font-medium"
            >
              View subscription options
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
