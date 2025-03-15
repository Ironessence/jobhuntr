"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageTracking } from "@/hooks/usePageTracking";
import { CheckCircle, Clock, Sparkles, Target, Zap } from "lucide-react";

export default function FeaturesSection() {
  // Track page view
  usePageTracking("landing_features");

  const features = [
    {
      icon: <Zap className="h-12 w-12 text-pink-600" />,
      title: "AI-Powered Efficiency",
      description:
        "Save hours on each application with our AI tools that generate personalized content in seconds.",
    },
    {
      icon: <Target className="h-12 w-12 text-purple-600" />,
      title: "Tailored for Each Job",
      description:
        "Every cover letter, resume suggestion, and interview prep is customized for the specific role you're applying to.",
    },
    {
      icon: <Sparkles className="h-12 w-12 text-pink-600" />,
      title: "Insider Knowledge",
      description:
        "Get valuable company insights and salary information to negotiate better and stand out from other candidates.",
    },
    {
      icon: <Clock className="h-12 w-12 text-purple-600" />,
      title: "Interview Confidence",
      description:
        "Practice with AI-generated interview questions specific to your target role and company.",
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-pink-600" />,
      title: "Flexible Token System",
      description:
        "Use tokens however you want across all features, paying only for what you need when you need it.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ApplyNinja.ai</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform is designed to give you an unfair advantage in your job search
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-muted transition-all duration-200 hover:shadow-md hover:border-pink-200 dark:hover:border-pink-900"
            >
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
