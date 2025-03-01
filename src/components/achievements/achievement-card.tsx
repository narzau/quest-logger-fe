"use client";

import { Achievement, UserAchievement } from "@/types/achievement";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useSettingsStore } from "@/store/settingsStore";

interface AchievementCardProps {
  achievement: Achievement | UserAchievement;
  unlocked?: boolean;
}

export function AchievementCard({
  achievement,
  unlocked = false,
}: AchievementCardProps) {
  const { animationsEnabled } = useSettingsStore();
  const userAchievement = "unlocked_at" in achievement ? achievement : null;

  return (
    <motion.div
      initial={animationsEnabled ? { opacity: 0, scale: 0.9 } : false}
      animate={animationsEnabled ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-200",
          unlocked
            ? "border-yellow-400/30 bg-gradient-to-br from-card to-yellow-950/10"
            : "border-border bg-card opacity-70 hover:opacity-100"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "shrink-0 rounded-full p-2",
                unlocked
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {unlocked ? (
                <Award className="h-6 w-6" />
              ) : (
                <Lock className="h-6 w-6" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium leading-none">
                  {(achievement as Achievement).name}
                </h3>
                <Badge
                  variant={unlocked ? "default" : "outline"}
                  className={unlocked ? "bg-yellow-600" : ""}
                >
                  {(achievement as Achievement).exp_reward} XP
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {(achievement as Achievement).description}
              </p>

              {userAchievement && (
                <p className="text-xs text-muted-foreground">
                  Unlocked:{" "}
                  {format(new Date(userAchievement.unlocked_at), "PPP")}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
