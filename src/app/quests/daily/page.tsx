"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useQuests } from "@/hooks/useQuests";
import { QuestItem } from "@/components/quests/quest-item";
import { CreateQuestDialog } from "@/components/quests/create-quest-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuestType } from "@/types/quest";
import { Calendar, CheckCircle2, PlusCircle, Clock, Flame } from "lucide-react";

export default function DailyQuestsPage() {
  const { quests } = useQuests({ quest_type: QuestType.DAILY });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Separate complete and incomplete quests
  const incompleteQuests = quests.filter((q) => !q.is_completed);
  const completedQuests = quests.filter((q) => q.is_completed);

  // Get today's completion rate
  const completionRate =
    quests.length > 0
      ? Math.round((completedQuests.length / quests.length) * 100)
      : 0;

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Daily Quests</h1>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Daily Quest
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Today&apos;s Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    {completedQuests.length}/{quests.length}
                  </div>
                  <div className="flex items-center">
                    <Flame className="h-5 w-5 mr-1 text-orange-500" />
                    <span className="text-lg font-semibold">
                      {completionRate}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daily Quest Log</CardTitle>
              <CardDescription>
                These quests reset every day and help build consistency
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-12 w-12 text-primary mb-4 opacity-20" />
                  <h3 className="font-medium">No daily quests</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Daily quests are perfect for building habits and routines
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create First Daily Quest
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Pending
                  </h3>
                  <div className="space-y-2 mb-6">
                    {incompleteQuests.length > 0 ? (
                      incompleteQuests.map((quest) => (
                        <QuestItem key={quest.id} quest={quest} />
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 text-center">
                        All daily quests completed! Well done! 🎉
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Completed
                  </h3>
                  <div className="space-y-2">
                    {completedQuests.length > 0 ? (
                      completedQuests.map((quest) => (
                        <QuestItem key={quest.id} quest={quest} />
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 text-center">
                        No completed quests yet. Start checking off those daily
                        tasks!
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <CreateQuestDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          defaultQuestType={QuestType.DAILY}
        />
      </DashboardLayout>
    </AuthGuard>
  );
}
