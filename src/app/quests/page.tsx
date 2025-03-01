"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useQuests } from "@/hooks/useQuests";
import { QuestCategory } from "@/components/quests/quest-category";
import { CreateQuestDialog } from "@/components/quests/create-quest-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  PlusCircle,
  Search,
  Filter,
  CalendarDays,
  Map,
  Crown,
  Swords,
  Flame,
  Sparkles,
  Clock,
} from "lucide-react";
import { QuestType, QuestRarity } from "@/types/quest";
import { WowQuestItem } from "@/components/quests/wow-quest-item";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/lib/utils";

export default function QuestsPage() {
  const { quests } = useQuests();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  const { animationsEnabled } = useSettingsStore();

  // Filter quests based on search and rarity
  const filteredQuests = quests.filter((quest) => {
    // Apply search filter (case insensitive)
    if (
      searchTerm &&
      !quest.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !quest.description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Apply rarity filter
    if (rarityFilter !== "all" && quest.rarity !== rarityFilter) {
      return false;
    }

    return true;
  });

  // Group quests by type
  const dailyQuests = filteredQuests.filter(
    (q) => q.quest_type === QuestType.DAILY
  );
  const bossQuests = filteredQuests.filter(
    (q) => q.quest_type === QuestType.BOSS
  );
  const epicQuests = filteredQuests.filter(
    (q) => q.quest_type === QuestType.EPIC
  );
  const regularQuests = filteredQuests.filter(
    (q) => q.quest_type === QuestType.REGULAR
  );

  // Group active daily quests
  const activeDailyQuests = dailyQuests.filter((q) => !q.is_completed);

  // Extract incomplete quests with due dates
  const incompleteQuestsWithDue = filteredQuests
    .filter((q) => !q.is_completed && q.due_date)
    .sort((a, b) => {
      return new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime();
    });

  // Get nearest due quests (max 3)
  const upcomingQuests = incompleteQuestsWithDue.slice(0, 3);

  // For tracking
  const trackedQuests = filteredQuests
    .filter(
      (q) =>
        !q.is_completed &&
        (q.quest_type === QuestType.BOSS || q.quest_type === QuestType.EPIC) &&
        !upcomingQuests.some((uq) => uq.id === q.id)
    )
    .slice(0, 2);

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Quest Log</h1>
              <p className="text-muted-foreground mt-1">
                {filteredQuests.filter((q) => !q.is_completed).length} active
                quests
              </p>
            </div>

            <Button onClick={() => setCreateDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Quest
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quest Logger */}
            <motion.div
              initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
              animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.3 }}
              className="md:col-span-1 space-y-4"
            >
              {/* Active Daily Quests */}
              <Card
                className={cn(
                  "border-blue-400/30",
                  activeDailyQuests.length > 0 ? "bg-blue-900/5" : ""
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-blue-500" />
                    <CardTitle className="text-lg">Daily Quests</CardTitle>
                  </div>
                  <CardDescription>
                    {activeDailyQuests.length > 0
                      ? `${activeDailyQuests.length} quests remaining today`
                      : "All daily quests completed!"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeDailyQuests.length > 0 ? (
                    activeDailyQuests.map((quest) => (
                      <WowQuestItem key={quest.id} quest={quest} expanded />
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-4 text-muted-foreground">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Come back tomorrow for new dailies!
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Quests */}
              <Card
                className={
                  upcomingQuests.length > 0
                    ? "border-yellow-400/30 bg-yellow-900/5"
                    : ""
                }
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                    <CardTitle className="text-lg">
                      Upcoming Deadlines
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {upcomingQuests.length > 0 ? (
                    upcomingQuests.map((quest) => (
                      <WowQuestItem key={quest.id} quest={quest} expanded />
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-4 text-muted-foreground">
                      <Flame className="h-4 w-4 mr-2" />
                      No upcoming deadlines
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tracked Quests */}
              {trackedQuests.length > 0 && (
                <Card className="border-purple-400/30 bg-purple-900/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                      <CardTitle className="text-lg">Tracked Quests</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {trackedQuests.map((quest) => (
                      <WowQuestItem key={quest.id} quest={quest} expanded />
                    ))}
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Main Quest Log */}
            <motion.div
              initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
              animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="md:col-span-2"
            >
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle>All Quests</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-4 mt-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search quests..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="w-full sm:w-44">
                      <Select
                        value={rarityFilter}
                        onValueChange={setRarityFilter}
                      >
                        <SelectTrigger>
                          <div className="flex items-center">
                            <Filter className="mr-2 h-4 w-4" />
                            <span>Rarity</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Rarities</SelectItem>
                          <SelectItem value={QuestRarity.COMMON}>
                            Common
                          </SelectItem>
                          <SelectItem value={QuestRarity.UNCOMMON}>
                            Uncommon
                          </SelectItem>
                          <SelectItem value={QuestRarity.RARE}>Rare</SelectItem>
                          <SelectItem value={QuestRarity.EPIC}>Epic</SelectItem>
                          <SelectItem value={QuestRarity.LEGENDARY}>
                            Legendary
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  {/* Daily Quests */}
                  <QuestCategory
                    title="Daily Quests"
                    quests={dailyQuests}
                    icon={<CalendarDays className="h-5 w-5 text-blue-500" />}
                    emptyMessage="No daily quests. Create some to build habits!"
                    defaultOpen={dailyQuests.length > 0}
                  />

                  {/* Boss Quests */}
                  <QuestCategory
                    title="Boss Quests"
                    quests={bossQuests}
                    icon={<Swords className="h-5 w-5 text-red-500" />}
                    emptyMessage="No boss quests. Create one for your major tasks!"
                    defaultOpen={bossQuests.length > 0}
                  />

                  {/* Epic Quests */}
                  <QuestCategory
                    title="Epic Quests"
                    quests={epicQuests}
                    icon={<Crown className="h-5 w-5 text-purple-500" />}
                    emptyMessage="No epic quests. Create one for significant projects!"
                    defaultOpen={epicQuests.length > 0}
                  />

                  {/* Regular Quests */}
                  <QuestCategory
                    title="Regular Quests"
                    quests={regularQuests}
                    icon={<Map className="h-5 w-5 text-green-500" />}
                    emptyMessage="No regular quests. Add your everyday tasks!"
                    defaultOpen={regularQuests.length > 0}
                  />

                  {filteredQuests.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Map className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-medium text-lg">
                        Your quest log is empty
                      </h3>
                      <p className="text-muted-foreground mt-2 max-w-sm">
                        Start by adding a new quest to your log. Quests can be
                        daily tasks, regular to-dos, epic projects, or major
                        boss challenges!
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => setCreateDialogOpen(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add First Quest
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <CreateQuestDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </DashboardLayout>
    </AuthGuard>
  );
}
