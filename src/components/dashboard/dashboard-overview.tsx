"use client";

import { useQuests } from "@/hooks/useQuests";
import { useUser } from "@/hooks/useUser";
import { useAchievements } from "@/hooks/useAchievements";
import { QuestType } from "@/types/quest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuestItem } from "@/components/quests/quest-item";
import { AchievementCard } from "@/components/achievements/achievement-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  PlusCircle,
  Sparkles,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { CreateQuestDialog } from "@/components/quests/create-quest-dialog";
import { calculateLevelInfo } from "@/lib/utils";

export function DashboardOverview() {
  const { user } = useUser();
  const { quests } = useQuests();
  const { userAchievements } = useAchievements();
  const [createQuestOpen, setCreateQuestOpen] = useState(false);
  const [showAchievements, setShowAchievements] = useState(true);

  const levelInfo = user
    ? calculateLevelInfo(user.level, user.experience)
    : {
        level: 1,
        currentXp: 0,
        nextLevelXp: 100,
        progress: 0,
      };

  // Filter quests
  const dailyQuests = quests.filter(
    (quest) => quest.quest_type === QuestType.DAILY
  );
  const pendingQuests = quests.filter((quest) => !quest.is_completed);
  const completedQuests = quests.filter((quest) => quest.is_completed);

  // Sort by priority and due date
  const sortedDailyQuests = [...dailyQuests].sort((a, b) => {
    if (a.is_completed === b.is_completed) {
      if (a.priority === b.priority) {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      return b.priority - a.priority;
    }
    return a.is_completed ? 1 : -1;
  });

  // Get recent achievements
  const recentAchievements = [...(userAchievements || [])]
    .sort(
      (a, b) =>
        new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime()
    )
    .slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <Button
          size="sm"
          className="h-8 px-2 sm:h-10 sm:px-4"
          onClick={() => setCreateQuestOpen(true)}
        >
          <PlusCircle className="h-4 w-4 mr-1 sm:h-5 sm:w-5 sm:mr-2" />
          <span className="sm:inline">New Quest</span>
        </Button>
      </div>

      {/* Stats overview - 2x2 grid on mobile */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-2 sm:p-4 pb-0 sm:pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">
              Level
            </CardTitle>
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </CardHeader>
          <CardContent className="p-2 sm:p-4 pt-0">
            <div className="text-xl font-bold sm:text-2xl">
              {levelInfo.level || 1}
            </div>
            <div className="mt-1 sm:mt-2 space-y-1">
              <Progress value={levelInfo.progress} className="h-1.5 sm:h-2" />
              <div className="flex justify-between text-xs">
                <span>{levelInfo.currentXp}XP</span>
                <span>{levelInfo.nextLevelXp}XP</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-2 sm:p-4 pb-0 sm:pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">
              Daily
            </CardTitle>
            <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="p-2 sm:p-4 pt-0">
            <div className="text-xl font-bold sm:text-2xl">
              {dailyQuests.filter((q) => q.is_completed).length}/
              {dailyQuests.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {dailyQuests.filter((q) => q.is_completed).length ===
              dailyQuests.length
                ? "All complete!"
                : `${
                    dailyQuests.length -
                    dailyQuests.filter((q) => q.is_completed).length
                  } remaining`}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-2 sm:p-4 pb-0 sm:pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">
              Completion
            </CardTitle>
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
          </CardHeader>
          <CardContent className="p-2 sm:p-4 pt-0">
            <div className="text-xl font-bold sm:text-2xl">
              {quests.length
                ? Math.round((completedQuests.length / quests.length) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {completedQuests.length}/{quests.length} complete
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between p-2 sm:p-4 pb-0 sm:pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">
              Achievements
            </CardTitle>
            <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
          </CardHeader>
          <CardContent className="p-2 sm:p-4 pt-0">
            <div className="text-xl font-bold sm:text-2xl">
              {userAchievements?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {userAchievements?.length
                ? "Great work!"
                : "Complete quests to earn"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily quests - Always shown */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Daily Quests</CardTitle>
          <div className="flex items-center">
            <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 mr-1" />
            <span className="font-medium text-sm">
              {dailyQuests.filter((q) => q.is_completed).length}/
              {dailyQuests.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
          {sortedDailyQuests.length === 0 ? (
            <div className="flex items-center justify-center py-3 text-center">
              <div>
                <Clock className="h-8 w-8 text-muted-foreground mb-2 opacity-20 mx-auto" />
                <Button
                  className="mt-1"
                  size="sm"
                  onClick={() => setCreateQuestOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Daily Quest
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1 sm:space-y-2">
              {sortedDailyQuests.map((quest) => (
                <QuestItem key={quest.id} quest={quest} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Collapsible Achievements Section for Mobile */}
      <div className="sm:hidden">
        <button
          onClick={() => setShowAchievements(!showAchievements)}
          className="flex w-full items-center justify-between p-2 text-sm font-medium"
        >
          Recent Achievements
          {showAchievements ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {showAchievements && (
          <Card className="shadow-sm mt-1">
            <CardContent className="p-3">
              {recentAchievements.length === 0 ? (
                <div className="flex items-center justify-center py-3 text-center">
                  <Award className="h-8 w-8 text-muted-foreground opacity-20" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {recentAchievements.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      unlocked
                      compact={true}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Desktop Achievements Card */}
      <Card className="hidden sm:block shadow-sm">
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAchievements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Award className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
              <h3 className="font-medium text-muted-foreground">
                No achievements yet
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Complete quests to unlock achievements
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {recentAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  unlocked
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All quests */}
      <Card className="shadow-sm">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Ledger</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
          <Tabs defaultValue="active">
            <TabsList className="mb-3">
              <TabsTrigger value="active" className="text-xs sm:text-sm">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                Active ({pendingQuests.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                Completed ({completedQuests.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              {pendingQuests.length === 0 ? (
                <div className="flex items-center justify-center py-4 text-center">
                  <div>
                    <CheckCircle2 className="h-8 w-8 text-muted-foreground mb-2 opacity-20 mx-auto" />
                    <Button
                      className="mt-1"
                      size="sm"
                      onClick={() => setCreateQuestOpen(true)}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add New Quest
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 sm:space-y-2">
                  {pendingQuests
                    .sort((a, b) => {
                      if (a.priority === b.priority) {
                        const aDate = a.due_date
                          ? new Date(a.due_date)
                          : new Date(a.created_at);
                        const bDate = b.due_date
                          ? new Date(b.due_date)
                          : new Date(b.created_at);
                        return aDate.getTime() - bDate.getTime();
                      }
                      return b.priority - a.priority;
                    })
                    .map((quest) => (
                      <QuestItem key={quest.id} quest={quest} expanded />
                    ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed">
              {completedQuests.length === 0 ? (
                <div className="flex items-center justify-center py-4 text-center">
                  <CheckCircle2 className="h-8 w-8 text-muted-foreground opacity-20" />
                </div>
              ) : (
                <div className="space-y-1 sm:space-y-2">
                  {completedQuests
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                    .map((quest) => (
                      <QuestItem key={quest.id} quest={quest} expanded />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreateQuestDialog
        open={createQuestOpen}
        onOpenChange={setCreateQuestOpen}
      />
    </div>
  );
}
