"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { TestimonialCard } from "@/components/landing/testimonial-card";
import { BackgroundParticles } from "@/components/ui/background-particles";

// Testimonial data type
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Testimonials data - in a real app, this would be fetched from an API
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Alex Thompson",
      role: "Software Developer",
      content:
        "This app completely changed how I manage my ADHD. The gamification makes tasks actually exciting rather than daunting. I've been more productive in the last month than the entire previous year!",
      avatar: "A",
    },
    {
      id: 2,
      name: "Jamie Rivera",
      role: "Graphic Designer",
      content:
        "As someone with ADHD, traditional to-do lists never worked for me. The quest system makes me actually WANT to complete tasks. The dopamine hit from leveling up is real!",
      avatar: "J",
    },
    {
      id: 3,
      name: "Morgan Chen",
      role: "College Student",
      content:
        "I never thought tracking assignments could be fun, but turning them into 'epic quests' with XP rewards has made a huge difference in my studies. My GPA has improved significantly!",
      avatar: "M",
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="w-full py-12 md:py-24 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          What Our Users Say
        </h2>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <TestimonialCard
              key={testimonials[currentTestimonial].id}
              testimonial={testimonials[currentTestimonial]}
            />
          </AnimatePresence>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  currentTestimonial === index
                    ? "bg-blue-800 dark:bg-blue-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Animated background particles */}
      <BackgroundParticles />
    </section>
  );
};
