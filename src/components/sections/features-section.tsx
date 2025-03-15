"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageTracking } from "@/hooks/usePageTracking";
import { CheckCircle, Clock, Database, Sparkles, Target, Zap } from "lucide-react";

export default function FeaturesSection() {
  // Track page view
  usePageTracking("landing_features");

  const features = [
    {
      icon: <Zap className="h-12 w-12 text-blue-500" />,
      title: "Job-Specific AI Training",
      description:
        "Our AI is specifically trained on successful job applications, resumes, and interview techniques to maximize your chances of landing your dream role.",
    },
    {
      icon: <Target className="h-12 w-12 text-blue-400" />,
      title: "Tailored for Each Job",
      description:
        "Every cover letter, resume suggestion, and interview prep is customized for the specific role you're applying to, highlighting your most relevant qualifications.",
    },
    {
      icon: <Sparkles className="h-12 w-12 text-blue-500" />,
      title: "Comprehensive Company Research",
      description:
        "Access insights gathered from employee reviews, company news, social media, and industry reports to understand company culture and values before applying.",
    },
    {
      icon: <Clock className="h-12 w-12 text-blue-400" />,
      title: "Interview Confidence",
      description:
        "Practice with AI-generated interview questions specific to your target role and company, with feedback to help you improve your responses.",
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-blue-500" />,
      title: "Flexible Token System",
      description:
        "Use your tokens across any feature without restrictions—allocate them to cover letters, resume reviews, or interview prep based on your current priorities.",
    },
    {
      icon: <Database className="h-12 w-12 text-blue-400" />,
      title: "Continuous Improvement",
      description:
        "ApplyNinja learns from successful applications and interviews, constantly refining its recommendations to stay current with hiring trends.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-archivo">
            Why Choose ApplyNinja.ai
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform is designed to give you an unfair advantage in your job search
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-muted"
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
