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
  compact?: boolean; // New compact prop for mobile views
}

export function AchievementCard({
  achievement,
  unlocked = false,
  compact = false,
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
        <CardContent className={cn("p-2 px-4", compact && "p-2")}>
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "shrink-0 rounded-full",
                unlocked
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-muted text-muted-foreground",
                compact ? "p-1.5" : "p-2"
              )}
            >
              {unlocked ? (
                <Award className={compact ? "h-5 w-5" : "h-8 w-8"} />
              ) : (
                <Lock className={compact ? "h-5 w-5" : "h-8 w-8"} />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3
                  className={cn(
                    "font-medium leading-none",
                    compact && "text-sm"
                  )}
                >
                  {userAchievement
                    ? userAchievement.achievement.name
                    : (achievement as Achievement).name}
                </h3>
                <Badge
                  variant={unlocked ? "default" : "outline"}
                  className={cn(
                    unlocked ? "bg-yellow-600" : "",
                    compact && "text-xs px-1.5 py-0"
                  )}
                >
                  {userAchievement
                    ? userAchievement.achievement.exp_reward
                    : (achievement as Achievement).exp_reward}
                  XP
                </Badge>
              </div>

              <p
                className={cn(
                  "text-sm text-muted-foreground",
                  compact && "text-xs line-clamp-1"
                )}
              >
                {userAchievement
                  ? userAchievement.achievement.description
                  : (achievement as Achievement).description}
              </p>

              {userAchievement && !compact && (
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
