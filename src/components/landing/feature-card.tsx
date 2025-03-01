"use client";

import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  color,
}) => {
  // Map color names to actual color classes
  const colorClasses = {
    blue: {
      bg: "bg-blue-300 dark:bg-blue-950",
      text: "text-blue-900 dark:text-blue-600",
    },
    purple: {
      bg: "bg-purple-300 dark:bg-purple-950",
      text: "text-purple-900 dark:text-purple-600",
    },
    green: {
      bg: "bg-green-300 dark:bg-green-950",
      text: "text-green-900 dark:text-green-600",
    },
  };

  const classes =
    colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div className={`rounded-full p-4 ${classes.bg}`}>{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  );
};
