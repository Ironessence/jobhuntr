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
        "ApplyNinja is an AI-powered platform that helps you optimize your job applications. Our system analyzes job descriptions and your resume to generate tailored cover letters, provide company insights, suggest resume improvements, and prepare you for interviews. And because we know how hard it is to be consistent, we've added gamification to help you stay on track and feel rewarded & motivated.",
    },
    {
      question: "How many tokens do I need for each feature?",
      answer: (
        <div className="space-y-2">
          <p>
            Token usage varies by feature. Here&apos;s a breakdown of how many tokens each feature
            uses:
          </p>
          <ul className="list-none space-y-1.5 pl-1">
            <li>
              1. CV Suggestions: <span className="font-medium">10 Tokens</span>
            </li>
            <li>
              2. CV Auto-fix w/ AI suggestions: <span className="font-medium">200 Tokens</span>
            </li>
            <li>
              3. Cover Letter Generation: <span className="font-medium">10 Tokens</span>
            </li>
            <li>
              4. Company Insights: <span className="font-medium">10 Tokens</span>
            </li>
            <li>
              5. Salary Range Estimation: <span className="font-medium">10 Tokens</span>
            </li>
            <li>
              6. Interview Prep: <span className="font-medium">20 Tokens</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "How many jobs can I apply to?",
      answer:
        "You can apply to an unlimited number of jobs. However, we can only store 100 jobs for you to apply to at a time. If you need to apply to more jobs, you can remove some jobs from your list and add new ones.",
    },
    {
      question: "How accurate is the AI-generated content?",
      answer:
        "We pride ourselves on the quality of our AI-generated content. We use the latest and most advanced AI models to ensure that the content is accurate and up to date. However, just like with any AI, there might be times where the content is not 100% accurate. We recommend using our content as a starting point for your own research.",
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
