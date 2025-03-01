"use client";

import { useEffect, useState } from "react";
import { useAchievementStore } from "@/store/achievementStore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";

export function AchievementUnlockedDialog() {
  const { recentUnlocked, clearRecentUnlocked } = useAchievementStore();
  const [open, setOpen] = useState(false);
  const { animationsEnabled } = useSettingsStore();

  useEffect(() => {
    if (recentUnlocked) {
      setOpen(true);

      // Trigger confetti if animations are enabled
      if (animationsEnabled) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  }, [recentUnlocked, animationsEnabled]);

  const handleClose = () => {
    setOpen(false);
    clearRecentUnlocked();
  };

  if (!recentUnlocked) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Achievement Unlocked!
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="rounded-full bg-yellow-500/20 p-6 mb-6"
          >
            <Award className="h-16 w-16 text-yellow-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h3 className="text-xl font-bold mb-2">
              {recentUnlocked.achievement.name}
            </h3>
            <p className="text-muted-foreground mb-4">
              {recentUnlocked.achievement.description}
            </p>
            <div className="bg-primary/10 text-primary rounded-full px-4 py-2 inline-block">
              +{recentUnlocked.achievement.exp_reward} XP
            </div>
          </motion.div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} className="w-full">
            Awesome!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
