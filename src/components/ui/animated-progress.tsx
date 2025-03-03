import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface AnimatedProgressProps {
  value: number;
  className?: string;
  duration?: number;
}

export const AnimatedProgress = ({
  value,
  className,
  duration = 1.0, // Default animation duration in seconds
}: AnimatedProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset progress when value changes significantly (useful for level ups)
    if (Math.abs(value - progress) > 20) {
      setProgress(0);
    }

    // Animate progress to target value
    const timer = setTimeout(() => {
      setProgress(value);
    }, 50); // Small delay to ensure component is mounted

    return () => clearTimeout(timer);
  }, [progress, value]);

  return (
    <div className="relative">
      <Progress value={progress} className={className} />
      <motion.div
        className="absolute top-0 left-0 right-0 h-full"
        initial={{ width: `${Math.max(0, progress - 5)}%` }}
        animate={{ width: `${progress}%` }}
        transition={{
          duration: duration,
          ease: "easeOut",
        }}
      />
    </div>
  );
};

export default AnimatedProgress;
