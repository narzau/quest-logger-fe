"use client";

import React, { useState, useEffect } from "react";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TestimonialsSection } from "@/components/landing/testimonial-section";
import { CTASection } from "@/components/landing/cta-section";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { gridPatternStyles } from "@/components/landing/grid-pattern-styles";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  // Handle initial mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock stats for demonstration - in a real app, these would be fetched from an API
  const initialStats = {
    activeUsers: 2847,
    tasksCompleted: 124568,
    totalXpEarned: 3842156,
    achievementsUnlocked: 17829,
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <StatsSection initialStats={initialStats} />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />

      {/* Add the grid pattern styles */}
      <style jsx global>
        {gridPatternStyles}
      </style>
    </div>
  );
}
