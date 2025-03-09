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
  CheckCircle2,
  BookMarked,
} from "lucide-react";
import { QuestType, QuestRarity } from "@/types/quest";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";

export default function QuestsPage() {
  const { quests } = useQuests();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  const [completionFilter, setCompletionFilter] = useState("not-completed");
  const [trackingFilter, setTrackingFilter] = useState("tracked");
  const [showFilters, setShowFilters] = useState(false);
  const { animationsEnabled } = useSettingsStore();

  const filteredQuests = quests.filter((quest) => {
    // Search and rarity filters
    const matchesSearch =
      !searchTerm ||
      quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quest.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRarity =
      rarityFilter === "all" || quest.rarity === rarityFilter;

    // Completion status filter
    const matchesCompletion =
      completionFilter === "all" ||
      (completionFilter === "completed" && quest.is_completed) ||
      (completionFilter === "not-completed" && !quest.is_completed);

    // Tracking status filter
    const matchesTracking =
      trackingFilter === "all" ||
      (trackingFilter === "tracked" && quest.tracked) ||
      (trackingFilter === "not-tracked" && !quest.tracked);

    return (
      matchesSearch && matchesRarity && matchesCompletion && matchesTracking
    );
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
            {/* Main Quest Log */}
            <motion.div
              initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
              animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="md:col-span-2"
            >
              {/* Fixed height container to prevent content jump when header becomes sticky */}
              <div className="relative">
                <Card className="border-accent/20">
                  {/* Sticky Header */}
                  <CardHeader className="bg-background sticky pt-4 -top-6 z-10 border-b border-border/30 pb-4">
                    <div className="flex flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search quests..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      {/* Desktop filters - only visible on larger screens */}
                      <div className="hidden sm:flex  gap-3">
                        {/* Completion Status Filter */}
                        <div>
                          <Select
                            value={completionFilter}
                            onValueChange={setCompletionFilter}
                          >
                            <SelectTrigger
                              className={`w-full ${
                                completionFilter !== "all"
                                  ? "border-primary/50 bg-primary/5"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center">
                                <CheckCircle2
                                  className={`mr-2 h-4 w-4 ${
                                    completionFilter === "completed"
                                      ? "text-green-500"
                                      : ""
                                  }`}
                                />
                                <span>
                                  {completionFilter === "all" && "Status: All"}
                                  {completionFilter === "completed" &&
                                    "Status: Completed"}
                                  {completionFilter === "not-completed" &&
                                    "Status: Not Completed"}
                                </span>
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="not-completed">
                                Not Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Tracking Status Filter */}
                        <div>
                          <Select
                            value={trackingFilter}
                            onValueChange={setTrackingFilter}
                          >
                            <SelectTrigger
                              className={`${
                                trackingFilter !== "all"
                                  ? "border-primary/50 bg-primary/5"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center">
                                <BookMarked
                                  className={`mr-2 h-4 w-4 ${
                                    trackingFilter === "tracked"
                                      ? "text-blue-500"
                                      : ""
                                  }`}
                                />
                                <span>
                                  {trackingFilter === "all" && "Tracking: All"}
                                  {trackingFilter === "tracked" &&
                                    "Tracking: Tracked"}
                                  {trackingFilter === "not-tracked" &&
                                    "Tracking: Not Tracked"}
                                </span>
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Tracking</SelectItem>
                              <SelectItem value="tracked">Tracked</SelectItem>
                              <SelectItem value="not-tracked">
                                Not Tracked
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Desktop filter - only visible on larger screens */}
                        <div className="">
                          <Select
                            value={rarityFilter}
                            onValueChange={setRarityFilter}
                          >
                            <SelectTrigger
                              className={
                                rarityFilter !== "all"
                                  ? "border-primary/50 bg-primary/5"
                                  : ""
                              }
                            >
                              <div className="flex items-center">
                                <Filter className="mr-2 h-4 w-4" />
                                <span>
                                  {rarityFilter === "all"
                                    ? "Rarity: All"
                                    : `Rarity: ${
                                        rarityFilter.charAt(0).toUpperCase() +
                                        rarityFilter.slice(1)
                                      }`}
                                </span>
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
                              <SelectItem value={QuestRarity.RARE}>
                                Rare
                              </SelectItem>
                              <SelectItem value={QuestRarity.EPIC}>
                                Epic
                              </SelectItem>
                              <SelectItem value={QuestRarity.LEGENDARY}>
                                Legendary
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Filter toggle button for mobile - only visible on small screens */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFilters(!showFilters)}
                          className="sm:hidden relative"
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          Filters
                          {(rarityFilter !== "all" ||
                            completionFilter !== "all" ||
                            trackingFilter !== "all") && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Mobile filters - only visible when showFilters is true */}
                    {showFilters && (
                      <div className="mt-3 sm:hidden space-y-3 border-t pt-3 border-border/30 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">
                            Active Filters
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setRarityFilter("all");
                              setCompletionFilter("not-completed");
                              setTrackingFilter("tracked");
                            }}
                            className="h-8 text-xs"
                          >
                            Reset
                          </Button>
                        </div>

                        <div>
                          <Select
                            value={rarityFilter}
                            onValueChange={setRarityFilter}
                          >
                            <SelectTrigger className="w-full h-9 text-sm">
                              <div className="flex items-center">
                                <Filter className="mr-2 h-4 w-4" />
                                <span className="truncate">
                                  {rarityFilter === "all"
                                    ? "Rarity: All"
                                    : `Rarity: ${
                                        rarityFilter.charAt(0).toUpperCase() +
                                        rarityFilter.slice(1)
                                      }`}
                                </span>
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
                              <SelectItem value={QuestRarity.RARE}>
                                Rare
                              </SelectItem>
                              <SelectItem value={QuestRarity.EPIC}>
                                Epic
                              </SelectItem>
                              <SelectItem value={QuestRarity.LEGENDARY}>
                                Legendary
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Select
                            value={completionFilter}
                            onValueChange={setCompletionFilter}
                          >
                            <SelectTrigger className="w-full h-9 text-sm">
                              <div className="flex items-center">
                                <CheckCircle2
                                  className={`mr-2 h-4 w-4 ${
                                    completionFilter === "completed"
                                      ? "text-green-500"
                                      : ""
                                  }`}
                                />
                                <span className="truncate">
                                  {completionFilter === "all" && "Status: All"}
                                  {completionFilter === "completed" &&
                                    "Status: Completed"}
                                  {completionFilter === "not-completed" &&
                                    "Status: Not Completed"}
                                </span>
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="not-completed">
                                Not Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Select
                            value={trackingFilter}
                            onValueChange={setTrackingFilter}
                          >
                            <SelectTrigger className="w-full h-9 text-sm">
                              <div className="flex items-center">
                                <BookMarked
                                  className={`mr-2 h-4 w-4 ${
                                    trackingFilter === "tracked"
                                      ? "text-blue-500"
                                      : ""
                                  }`}
                                />
                                <span className="truncate">
                                  {trackingFilter === "all" && "Tracking: All"}
                                  {trackingFilter === "tracked" &&
                                    "Tracking: Tracked"}
                                  {trackingFilter === "not-tracked" &&
                                    "Tracking: Not Tracked"}
                                </span>
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Tracking</SelectItem>
                              <SelectItem value="tracked">Tracked</SelectItem>
                              <SelectItem value="not-tracked">
                                Not Tracked
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
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
                          Start by adding a quest to your log. Quests can be
                          daily tasks, regular to-dos, epic projects, or major
                          boss challenges!
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
              </div>
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
