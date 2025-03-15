"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePageTracking } from "@/hooks/usePageTracking";
import { Building2, DollarSign, FileSpreadsheet, FileText, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function HowItWorks() {
  // Track page view
  usePageTracking("landing_how_it_works");

  const [activeTab, setActiveTab] = useState("cover-letter");

  const features = {
    "cover-letter": {
      title: "AI Cover Letters",
      description:
        "Generate tailored cover letters in seconds that highlight your relevant skills and experience for each specific job application. Our AI analyzes the job description and your resume to create personalized, compelling content that gets you noticed by hiring managers.",
      icon: <FileText className="h-6 w-6" />,
      videoTime: 0,
    },
    "cv-suggestions": {
      title: "CV Suggestions",
      description:
        "Get personalized recommendations to optimize your resume for each job application and increase your chances of getting an interview. Our AI identifies missing keywords, suggests improvements to your experience descriptions, and helps you highlight the most relevant skills for each position.",
      icon: <FileSpreadsheet className="h-6 w-6" />,
      videoTime: 60,
    },
    "company-insights": {
      title: "Company Insights",
      description:
        "Access detailed information about potential employers, including culture, values, and what they look for in candidates. Gain competitive intelligence on company priorities, recent news, and specific traits they value in employees to tailor your application and interview responses accordingly.",
      icon: <Building2 className="h-6 w-6" />,
      videoTime: 120,
    },
    "salary-insights": {
      title: "Salary Insights",
      description:
        "Get accurate salary estimates based on your experience, location, and industry to help you negotiate better offers. Our data is sourced from millions of job postings and employee reports to provide you with the most up-to-date compensation information for your specific role and market.",
      icon: <DollarSign className="h-6 w-6" />,
      videoTime: 180,
    },
    "interview-prep": {
      title: "Interview Preparation",
      description:
        "Practice with AI-generated interview questions tailored to the specific role and company you're applying to. Receive feedback on your answers, suggestions for improvement, and insider tips on what recruiters are looking for in candidates for your target position.",
      icon: <MessageSquare className="h-6 w-6" />,
      videoTime: 240,
    },
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // In a real implementation, you would control the YouTube player to jump to specific timestamps
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-archivo">How ApplyNinja Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform streamlines your job application process from start to finish
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Video section */}
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="ApplyNinja Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Tabs section */}
          <div className="h-full flex flex-col justify-center">
            <Tabs
              defaultValue="cover-letter"
              value={activeTab}
              onValueChange={handleTabChange}
              className="h-full flex flex-col"
            >
              <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8 h-[40px]">
                {Object.entries(features).map(([key, feature]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex items-center gap-2"
                  >
                    {feature.icon}
                    <span className="hidden md:inline">{feature.title.split(" ")[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex-grow">
                {Object.entries(features).map(([key, feature]) => (
                  <TabsContent
                    key={key}
                    value={key}
                    className="space-y-4 h-full"
                  >
                    <div className="bg-background p-6 rounded-lg shadow-sm border h-full">
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        {feature.icon}
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
