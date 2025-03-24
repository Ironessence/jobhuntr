"use client";

import { usePageTracking } from "@/hooks/usePageTracking";
import { motion } from "framer-motion";
import { Brain, Building2, Clock, DollarSign, FileText, Target, X } from "lucide-react";

export default function ProblemSection() {
  // Track page view
  usePageTracking("landing_problem");

  const problems = [
    {
      icon: <X className="h-8 w-8 text-red-500" />,
      title: "Auto-applying with no results",
      description:
        "Mass-applying with generic AI tools leads to silence from employers. Your applications get lost in the shuffle.",
    },
    {
      icon: <Clock className="h-8 w-8 text-red-500" />,
      title: "Wasting hours on applications",
      description:
        "Spending 15-30 minutes per application adds up quickly. That's time you could spend preparing for interviews.",
    },
    {
      icon: <Building2 className="h-8 w-8 text-red-500" />,
      title: "Company research black holes",
      description:
        "Without insider knowledge about company culture and values, your application lacks the personal touch that gets noticed.",
    },
    {
      icon: <FileText className="h-8 w-8 text-red-500" />,
      title: "Generic cover letters",
      description:
        "Not knowing how to market yourself in cover letters means missing opportunities to showcase your unique value.",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-red-500" />,
      title: "Salary negotiation anxiety",
      description:
        "Uncertainty about appropriate salary ranges leads to either underselling yourself or pricing yourself out.",
    },
    {
      icon: <Brain className="h-8 w-8 text-red-500" />,
      title: "Interview unpreparedness",
      description:
        "Walking into technical interviews without proper preparation leads to missed opportunities and confidence issues.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-background/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 font-archivo"
          >
            Applying to Jobs Doesn&apos;t Have to Be Hard
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Most job seekers face these frustrating challenges. Are they holding you back?
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="bg-background rounded-lg p-6 shadow-sm border border-muted hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
                  {problem.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{problem.title}</h3>
                  <p className="text-muted-foreground">{problem.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 px-4 py-2 rounded-full font-medium">
            <Target className="inline-block h-5 w-5 mr-2 -mt-1" />
            ApplyNinja solves these problems with precision
          </div>
        </motion.div>
      </div>
    </section>
  );
}
