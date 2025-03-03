// src/components/ui/audio-processing-animation.tsx
"use client";

import { motion } from "framer-motion";
import { Loader2, Wand2 } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";

interface AudioProcessingAnimationProps {
  isVisible: boolean;
}

export function AudioProcessingAnimation({
  isVisible,
}: AudioProcessingAnimationProps) {
  const { animationsEnabled } = useSettingsStore();

  if (!isVisible) return null;

  // Use simpler animation if animations are disabled
  if (!animationsEnabled) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium mb-2">Processing your voice</h3>
          <p className="text-sm text-muted-foreground">
            Turning your voice into a quest...
          </p>
        </div>
      </div>
    );
  }

  // Audio wave animation for the full effect
  const waveVariants = {
    hidden: {
      opacity: 0,
      pathLength: 0,
    },
    visible: (i: number) => ({
      opacity: 1,
      pathLength: 1,
      transition: {
        pathLength: {
          delay: i * 0.1,
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
        opacity: {
          delay: i * 0.1,
          duration: 0.3,
        },
      },
    }),
  };

  // Particle effect for magic visual
  const particles = Array.from({ length: 10 }, (_, i) => i);

  return (
    <motion.div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-card px-8 py-12 rounded-lg shadow-lg max-w-md w-full"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 300,
          delay: 0.1,
        }}
      >
        {/* Magic wand and audio visualization */}
        <div className="relative h-24 mb-8 flex items-center justify-center">
          {/* Audio wave animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 200 100"
              width="200"
              height="100"
              className="text-primary/30"
            >
              {/* Audio waves */}
              <motion.path
                d="M 0,50 Q 25,10 50,50 Q 75,90 100,50 Q 125,10 150,50 Q 175,90 200,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                custom={0}
                variants={waveVariants}
                initial="hidden"
                animate="visible"
              />
              <motion.path
                d="M 0,50 Q 25,30 50,50 Q 75,70 100,50 Q 125,30 150,50 Q 175,70 200,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                custom={1}
                variants={waveVariants}
                initial="hidden"
                animate="visible"
              />
              <motion.path
                d="M 0,50 Q 25,40 50,50 Q 75,60 100,50 Q 125,40 150,50 Q 175,60 200,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                custom={2}
                variants={waveVariants}
                initial="hidden"
                animate="visible"
              />
            </svg>
          </div>

          {/* Magic wand with spinning indicator */}
          <motion.div
            className="relative z-10 bg-primary/10 rounded-full p-6"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(147, 51, 234, 0)",
                "0 0 0 15px rgba(147, 51, 234, 0.1)",
                "0 0 0 0 rgba(147, 51, 234, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Wand2 className="h-12 w-12 text-primary" />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/80"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          {/* Particle effects */}
          {particles.map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full w-1 h-1 bg-primary/60"
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
              }}
              animate={{
                x:
                  Math.random() > 0.5
                    ? Math.random() * 100
                    : Math.random() * -100,
                y:
                  Math.random() > 0.5
                    ? Math.random() * 100
                    : Math.random() * -100,
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: i * 0.2,
                repeatDelay: Math.random(),
              }}
            />
          ))}
        </div>

        <motion.h3
          className="text-lg font-medium mb-2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Processing your voice
        </motion.h3>

        <motion.p
          className="text-sm text-muted-foreground text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Turning your voice into a quest...
        </motion.p>

        <motion.div
          className="h-1 bg-primary/10 rounded-full overflow-hidden"
          initial={{ width: "100%", opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 5,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <div className="flex justify-center mt-4 space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/60"
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
