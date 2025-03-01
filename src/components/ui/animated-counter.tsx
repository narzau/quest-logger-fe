"use client";

import React from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  prevValue: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prevValue,
  className = "",
}) => {
  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formattedValue = formatNumber(value);
  const formattedPrevValue = formatNumber(prevValue);

  // If values are the same, just render the number
  if (formattedValue === formattedPrevValue) {
    return <span className={className}>{formattedValue}</span>;
  }

  // Split into individual characters
  const characters = formattedValue.split("");
  const prevCharacters = formattedPrevValue.split("");

  return (
    <span className={`${className} inline-flex`}>
      {characters.map((char, i) => {
        const prevChar = i < prevCharacters.length ? prevCharacters[i] : "";
        const hasChanged = char !== prevChar;

        // For unchanged characters, render them statically
        if (!hasChanged) {
          return <span key={`${i}-static`}>{char}</span>;
        }

        // For changed characters, animate them
        return (
          <div
            key={`${i}-${char}`}
            className="inline-block relative overflow-hidden"
            style={{ width: char === "," ? "auto" : "auto" }}
          >
            {/* Outgoing number animation */}
            {prevChar && (
              <motion.span
                key={`${i}-${prevChar}-prev`}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute left-0"
              >
                {prevChar}
              </motion.span>
            )}

            {/* Incoming number animation */}
            <motion.span
              key={`${i}-${char}-current`}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative"
            >
              {char}
            </motion.span>
          </div>
        );
      })}
    </span>
  );
};
