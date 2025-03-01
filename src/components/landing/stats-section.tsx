"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Users, CheckCircle2, Sparkles, Trophy } from "lucide-react";

interface StatsData {
  activeUsers: number;
  tasksCompleted: number;
  totalXpEarned: number;
  achievementsUnlocked: number;
}

interface StatsSectionProps {
  initialStats: StatsData;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ initialStats }) => {
  const [stats, setStats] = useState<StatsData>(initialStats);

  // Maintain a reference to previous stats for animation
  const prevStatsRef = useRef<StatsData>(initialStats);

  // Simulate live updates - would be replaced with actual API calls in a real app
  useEffect(() => {
    // Store initial values
    prevStatsRef.current = initialStats;

    const interval = setInterval(() => {
      // Store previous values before updating
      prevStatsRef.current = { ...stats };

      // Update with random increments
      setStats((prev) => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
        tasksCompleted: prev.tasksCompleted + Math.floor(Math.random() * 10),
        totalXpEarned: prev.totalXpEarned + Math.floor(Math.random() * 100),
        achievementsUnlocked:
          prev.achievementsUnlocked + Math.floor(Math.random() * 2),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [stats, initialStats]);

  return (
    <section className="w-full py-12 bg-blue-900 dark:bg-blue-950 text-white">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Join Our Growing Community
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {/* Active Users Stat */}
          <StatCard
            icon={
              <Users className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform duration-200" />
            }
            value={stats.activeUsers}
            prevValue={prevStatsRef.current.activeUsers}
            label="Active Users"
          />

          {/* Completed Quests Stat */}
          <StatCard
            icon={
              <CheckCircle2 className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform duration-200" />
            }
            value={stats.tasksCompleted}
            prevValue={prevStatsRef.current.tasksCompleted}
            label="Quests Completed"
          />

          {/* XP Earned Stat */}
          <StatCard
            icon={
              <Sparkles className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform duration-200" />
            }
            value={stats.totalXpEarned}
            prevValue={prevStatsRef.current.totalXpEarned}
            label="XP Earned"
          />

          {/* Achievements Stat */}
          <StatCard
            icon={
              <Trophy className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform duration-200" />
            }
            value={stats.achievementsUnlocked}
            prevValue={prevStatsRef.current.achievementsUnlocked}
            label="Achievements Unlocked"
          />
        </div>
      </div>
    </section>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  prevValue: number;
  label: string;
}

// Extracted StatCard component for better reusability
const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  prevValue,
  label,
}) => (
  <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-colors duration-200 group cursor-pointer">
    {icon}
    <AnimatedCounter
      value={value}
      prevValue={prevValue}
      className="text-2xl md:text-3xl font-bold"
    />
    <span className="text-sm text-blue-100">{label}</span>
  </div>
);
