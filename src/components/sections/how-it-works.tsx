"use client";

import { usePageTracking } from "@/hooks/usePageTracking";
import { Building2, DollarSign, FileSpreadsheet, FileText, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function HowItWorks() {
  // Track page view
  usePageTracking("landing_how_it_works");

  const [activeFeature, setActiveFeature] = useState("cv-suggestions");

  const features = {
    "cv-suggestions": {
      title: "CV Suggestions",
      description:
        "Get personalized recommendations to optimize your resume for each job application and increase your chances of getting an interview. Our AI identifies missing keywords, suggests improvements to your experience descriptions, and helps you highlight the most relevant skills for each position.",
      icon: <FileSpreadsheet className="h-6 w-6" />,
      videoTime: 60,
    },
    "cover-letter": {
      title: "AI Cover Letters",
      description:
        "Generate tailored cover letters in seconds that highlight your relevant skills and experience for each specific job application. Our AI analyzes the job description and your resume to create personalized, compelling content that gets you noticed by hiring managers.",
      icon: <FileText className="h-6 w-6" />,
      videoTime: 0,
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

  const handleFeatureClick = (key: string) => {
    setActiveFeature(key);
    // In a real implementation, you would control the YouTube player to jump to specific timestamps
    // using the features[key].videoTime value
  };

  return (
    <section className="py-24 relative">
      <div
        className="bg-muted/30 inset-0 absolute"
        style={{
          clipPath: "polygon(0 0, 100% 5%, 100% 100%, 0% 100%)",
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-10">
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

          {/* Feature cards section */}
          <div className="space-y-4">
            {Object.entries(features).map(([key, feature]) => (
              <div
                key={key}
                onClick={() => handleFeatureClick(key)}
                className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                  activeFeature === key
                    ? "bg-gradient-to-r from-bg-muted/30 to-bg-muted/50 border-blue-300 shadow-md"
                    : "bg-background hover:bg-muted/30 border-muted-foreground/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${
                      activeFeature === key
                        ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                    <p
                      className={`text-sm ${
                        activeFeature === key ? "text-muted-foreground" : "text-muted-foreground/70"
                      }`}
                    >
                      {activeFeature === key
                        ? feature.description
                        : feature.description.split(".")[0] + "."}
                    </p>
                    {activeFeature === key && (
                      <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        Watch this section <span className="text-xs">▶</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
