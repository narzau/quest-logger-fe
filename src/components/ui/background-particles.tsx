"use client";

import React from "react";
import { motion } from "framer-motion";

interface BackgroundParticlesProps {
  count?: number;
  color?: string;
  darkColor?: string;
}

/**
 * A component that creates animated particles in the background
 * for visual interest.
 */
export const BackgroundParticles: React.FC<BackgroundParticlesProps> = ({
  count = 20,
  color = "bg-blue-700",
  darkColor = "dark:bg-blue-600",
}) => {
  // Generate random particles
  const particles = [...Array(count)].map((_, i) => ({
    key: i,
    size: Math.random() * 50 + 10, // Random size between 10 and 60
    x: Math.random() * 100, // Random x position
    y: Math.random() * 100, // Random y position
    duration: Math.random() * 10 + 10, // Random animation duration
    delay: Math.random() * 10, // Random delay
  }));

  return (
    <div className="absolute inset-0 opacity-10 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.key}
          className={`absolute rounded-full ${color} ${darkColor}`}
          style={{
            width: particle.size,
            height: particle.size,
            top: `${particle.y}%`,
            left: `${particle.x}%`,
          }}
          animate={{
            y: [0, Math.random() * -100 - 50],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};
