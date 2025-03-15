"use client";

import { Card, CardContent } from "@/components/ui/card";
import { usePageTracking } from "@/hooks/usePageTracking";
import { StarIcon } from "lucide-react";
import Image from "next/image";

export default function TestimonialsSection() {
  // Track page view
  usePageTracking("landing_testimonials");

  const testimonials = [
    {
      name: "Sarah J.",
      role: "Software Engineer",
      content:
        "ApplyNinja helped me land my dream job! The cover letter generator and company insights gave me a huge advantage in the application process.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      name: "Michael C.",
      role: "Product Manager",
      content:
        "I was struggling with interview preparation until I found ApplyNinja. The AI-generated questions were spot on and helped me ace my interviews.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      name: "Emily R.",
      role: "UX Designer",
      content:
        "The salary insights feature helped me negotiate a 15% higher offer than I would have accepted otherwise. This tool pays for itself!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      name: "David K.",
      role: "Data Scientist",
      content:
        "I applied to over 50 jobs using ApplyNinja and got 10 interviews. The personalized cover letters for each application made all the difference.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      name: "Jessica P.",
      role: "Marketing Manager",
      content:
        "As someone switching careers, I needed all the help I could get. ApplyNinja's CV suggestions helped me highlight transferable skills I wouldn't have thought of.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
      name: "Thomas W.",
      role: "Frontend Developer",
      content:
        "The company insights feature gave me talking points that impressed the interviewer. They literally said 'You've really done your research!'",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/6.jpg",
    },
    {
      name: "Olivia M.",
      role: "Project Manager",
      content:
        "I was skeptical about AI-generated content, but ApplyNinja's cover letters are incredibly personalized and well-written. Worth every penny!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/7.jpg",
    },
    {
      name: "James T.",
      role: "DevOps Engineer",
      content:
        "The technical interview prep was a game-changer. It helped me prepare for questions I never would have anticipated. Highly recommend!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/8.jpg",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-archivo">Wall of Love</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what job seekers are saying about their experience with ApplyNinja
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-muted"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="h-4 w-4 fill-blue-400 text-blue-400"
                    />
                  ))}
                </div>

                <p className="mb-4 text-sm">{testimonial.content}</p>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
