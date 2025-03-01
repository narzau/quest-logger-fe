"use client";

import { useAchievements } from "@/hooks/useAchievements";
import { AchievementCard } from "./achievement-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Lock } from "lucide-react";
import { UserAchievement, Achievement } from "@/types/achievement";

export function AchievementGrid() {
  const { userAchievements, availableAchievements, isLoading } =
    useAchievements();

  // Create a map of unlocked achievement IDs for quick lookup
  const unlockedMap = new Map<number, UserAchievement>();
  userAchievements?.forEach((achievement) => {
    unlockedMap.set(achievement.achievement_id, achievement);
  });

  // Separate achievements into unlocked and locked
  const unlockedAchievements = userAchievements || [];

  // Get locked achievements (available but not unlocked)
  const lockedAchievements = (availableAchievements || []).filter(
    (achievement) => !unlockedMap.has(achievement.id)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="unlocked" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="unlocked">
          <Award className="h-4 w-4 mr-2" />
          Unlocked ({unlockedAchievements.length})
        </TabsTrigger>
        <TabsTrigger value="locked">
          <Lock className="h-4 w-4 mr-2" />
          Locked ({lockedAchievements.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="unlocked">
        {unlockedAchievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Award className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
            <h3 className="font-medium text-muted-foreground">
              No achievements unlocked yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Complete quests to earn achievements
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="locked">
        {lockedAchievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Award className="h-16 w-16 text-primary mb-4 opacity-20" />
            <h3 className="font-medium text-muted-foreground">
              All achievements unlocked!
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Impressive! You've unlocked every achievement.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={false}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
