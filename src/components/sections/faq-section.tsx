"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePageTracking } from "@/hooks/usePageTracking";

export default function FAQSection() {
  // Track page view
  usePageTracking("landing_faq");

  const faqs = [
    {
      question: "What is ApplyNinja and how does it work?",
      answer:
        "ApplyNinja is an AI-powered platform that helps you optimize your job applications. Our system analyzes job descriptions and your resume to generate tailored cover letters, provide company insights, suggest resume improvements, and prepare you for interviews.",
    },
    {
      question: "How many tokens do I need for each feature?",
      answer:
        "Token usage varies by feature. Cover letter generation typically uses 50-100 tokens, company insights 30-50 tokens, CV suggestions 40-80 tokens, and interview preparation 100-150 tokens depending on complexity.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. You'll continue to have access to your plan until the end of your current billing period. There are no cancellation fees or long-term commitments.",
    },
    {
      question: "How accurate are the company insights?",
      answer:
        "Our company insights are gathered from multiple sources including employee reviews, company websites, news articles, and social media. While we strive for accuracy, we recommend using our insights as a starting point for your own research.",
    },
    {
      question: "Can I use ApplyNinja for any industry or job type?",
      answer:
        "Yes, ApplyNinja is designed to work across all industries and job types. Our AI adapts to specific job requirements whether you're in tech, healthcare, finance, education, or any other field.",
    },
    {
      question: "What makes ApplyNinja different from other job application tools?",
      answer:
        "ApplyNinja stands out with its comprehensive approach that covers the entire application process. Unlike other tools that focus on just one aspect, we provide cover letters, company research, CV optimization, and interview prep all in one platform with a flexible token system.",
    },
  ];

  return (
    <section
      className="py-16 md:py-24 bg-muted/30"
      id="faq"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left side - Title and description */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-archivo">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Find answers to common questions about ApplyNinja and how it can help with your job
              search.
            </p>
            <p className="text-muted-foreground">
              Have another question? Contact us at{" "}
              <a
                href="mailto:support@applyninja.ai"
                className="text-blue-500 hover:text-blue-600"
              >
                support@applyninja.ai
              </a>
            </p>
          </div>

          {/* Right side - Accordion */}
          <div>
            <Accordion
              type="single"
              collapsible
              className="w-full"
            >
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                >
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
