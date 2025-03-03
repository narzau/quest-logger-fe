"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useQuests } from "@/hooks/useQuests";
import { QuestCategory } from "@/components/quests/quest-category";
import { CreateQuestDialog } from "@/components/quests/create-quest-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
} from "lucide-react";
import { QuestType, QuestRarity } from "@/types/quest";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";

export default function QuestsPage() {
  const { quests } = useQuests();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  const [completedFilter, setCompletedFilter] = useState({
    completed: false,
    notCompleted: true,
  });
  const [trackedFilter, setTrackedFilter] = useState({
    tracked: true,
    notTracked: false,
  });
  const { animationsEnabled } = useSettingsStore();

  const handleCompletedChange = (
    checked: boolean | "indeterminate",
    type: "completed" | "notCompleted"
  ) => {
    if (checked === "indeterminate") return;
    setCompletedFilter((prev) => ({ ...prev, [type]: checked }));
  };

  const handleTrackedChange = (
    checked: boolean | "indeterminate",
    type: "tracked" | "notTracked"
  ) => {
    if (checked === "indeterminate") return;
    setTrackedFilter((prev) => ({ ...prev, [type]: checked }));
  };

  const filteredQuests = quests.filter((quest) => {
    // Existing search and rarity filters
    const matchesSearch =
      !searchTerm ||
      quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quest.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRarity =
      rarityFilter === "all" || quest.rarity === rarityFilter;

    // New filters
    const matchesCompleted =
      (quest.is_completed && completedFilter.completed) ||
      (!quest.is_completed && completedFilter.notCompleted);

    const matchesTracked =
      (quest.tracked && trackedFilter.tracked) ||
      (!quest.tracked && trackedFilter.notTracked);

    return matchesSearch && matchesRarity && matchesCompleted && matchesTracked;
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

          <div className="gap-4">
            {/* Quest Logger */}

            {/* Main Quest Log */}
            <motion.div
              initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
              animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="md:col-span-2"
            >
              <Card className="border-accent/20">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row gap-4">
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
                  {/* New checkboxes */}
                  <div className="flex flex-wrap gap-6 mt-3">
                    <div className="space-y-2">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="not-completed"
                            checked={completedFilter.notCompleted}
                            onCheckedChange={(checked) =>
                              handleCompletedChange(checked, "notCompleted")
                            }
                          />
                          <Label htmlFor="not-completed">Not Completed</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="tracked"
                            checked={trackedFilter.tracked}
                            onCheckedChange={(checked) =>
                              handleTrackedChange(checked, "tracked")
                            }
                          />
                          <Label htmlFor="tracked">Tracked</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="completed"
                            checked={completedFilter.completed}
                            onCheckedChange={(checked) =>
                              handleCompletedChange(checked, "completed")
                            }
                          />
                          <Label htmlFor="completed">Completed</Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="not-tracked"
                            checked={trackedFilter.notTracked}
                            onCheckedChange={(checked) =>
                              handleTrackedChange(checked, "notTracked")
                            }
                          />
                          <Label htmlFor="not-tracked">Not Tracked</Label>
                        </div>
                      </div>
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
                        Start by adding a quest to your log. Quests can be daily
                        tasks, regular to-dos, epic projects, or major boss
                        challenges!
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => setCreateDialogOpen(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Quest
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
