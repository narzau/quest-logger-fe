"use client";

import { useQuests } from "@/hooks/useQuests";
import { useUser } from "@/hooks/useUser";
import { useAchievements } from "@/hooks/useAchievements";
import { QuestType, QuestRarity } from "@/types/quest";
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
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { CreateQuestDialog } from "@/components/quests/create-quest-dialog";

export function DashboardOverview() {
  const { user } = useUser();
  const { quests, isLoading: questsLoading } = useQuests();
  const { userAchievements, isLoading: achievementsLoading } =
    useAchievements();
  const [createQuestOpen, setCreateQuestOpen] = useState(false);

  // Calculate level progress
  const nextLevelExp = (user?.level || 1) * 100;
  const currentExp = user?.experience || 0;
  const progress = Math.min(100, (currentExp / nextLevelExp) * 100);

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

  const isLoading = questsLoading || achievementsLoading || !user;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => setCreateQuestOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Quest
        </Button>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.level || 1}</div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>{currentExp} XP</span>
                <span>{nextLevelExp} XP</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Daily Quests</CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyQuests.filter((q) => q.is_completed).length}/
              {dailyQuests.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {dailyQuests.filter((q) => q.is_completed).length ===
              dailyQuests.length
                ? "All daily quests completed!"
                : `${
                    dailyQuests.length -
                    dailyQuests.filter((q) => q.is_completed).length
                  } quests remaining`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quests.length
                ? Math.round((completedQuests.length / quests.length) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {completedQuests.length} of {quests.length} quests completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userAchievements?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {userAchievements?.length
                ? "Keep up the great work!"
                : "Complete quests to earn achievements"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Daily quests */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Daily Quests</CardTitle>
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium">
                {dailyQuests.filter((q) => q.is_completed).length}/
                {dailyQuests.length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {sortedDailyQuests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
                <h3 className="font-medium text-muted-foreground">
                  No daily quests
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create some daily quests to build habits
                </p>
                <Button
                  className="mt-4"
                  size="sm"
                  onClick={() => setCreateQuestOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Daily Quest
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedDailyQuests.map((quest) => (
                  <QuestItem key={quest.id} quest={quest} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent achievements */}
        <Card className="col-span-1">
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
      </div>

      {/* All quests */}
      <Card>
        <CardHeader>
          <CardTitle>Quest Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">
                <Clock className="h-4 w-4 mr-2" />
                Active ({pendingQuests.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Completed ({completedQuests.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              {pendingQuests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
                  <h3 className="font-medium text-muted-foreground">
                    No active quests
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    All quests have been completed
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setCreateQuestOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Quest
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingQuests
                    .sort((a, b) => {
                      if (a.priority === b.priority) {
                        // Sort by due date if available, otherwise by creation date
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
                      <QuestItem key={quest.id} quest={quest} />
                    ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed">
              {completedQuests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-3 opacity-20" />
                  <h3 className="font-medium text-muted-foreground">
                    No completed quests
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start completing quests to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {completedQuests
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                    .map((quest) => (
                      <QuestItem key={quest.id} quest={quest} />
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
