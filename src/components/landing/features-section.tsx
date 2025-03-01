"use client";

import React from "react";
import { FeatureCard } from "@/components/landing/feature-card";
import { Award, TrendingUp, Flame } from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: 1,
      title: "Game-Inspired Design",
      description:
        "Modeled after video game quest logs to make task tracking fun and engaging, providing the dopamine hits that ADHD brains crave.",
      icon: Award,
      color: "blue",
    },
    {
      id: 2,
      title: "ADHD-Friendly Features",
      description:
        "Designed specifically for ADHD brains with visual cues, immediate rewards, and a structure that helps maintain focus and motivation.",
      icon: TrendingUp,
      color: "purple",
    },
    {
      id: 3,
      title: "Habit Building",
      description:
        "Transform one-time tasks into lasting habits with daily quests, streaks, and progressive achievement systems.",
      icon: Flame,
      color: "green",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-950">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={
                <feature.icon
                  className={`h-8 w-8 text-${feature.color}-900 dark:text-${feature.color}-600`}
                />
              }
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
