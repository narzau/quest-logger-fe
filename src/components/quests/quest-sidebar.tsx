"use client";

import { useState } from "react";
import { Quest, QuestType, QuestRarity } from "@/types/quest";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  CheckCircle2,
  CalendarDays,
  Map,
  Crown,
  Swords,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestSidebarProps {
  quests: Quest[];
  selectedQuestId?: number | null;
  onQuestSelect: (quest: Quest) => void;
  isLoading?: boolean;
}

export function QuestSidebar({
  quests,
  selectedQuestId,
  onQuestSelect,
  isLoading = false,
}: QuestSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  const [completedFilter, setCompletedFilter] =
    useState<string>("not-completed");
  const [showFilters, setShowFilters] = useState(false);

  // Filter quests based on selected filters
  const filteredQuests = quests.filter((quest) => {
    // Type filter
    const matchesType = typeFilter === "all" || quest.quest_type === typeFilter;

    // Rarity filter
    const matchesRarity =
      rarityFilter === "all" || quest.rarity === rarityFilter;

    // Completion status filter
    const matchesCompletion =
      completedFilter === "all" ||
      (completedFilter === "completed" && quest.is_completed) ||
      (completedFilter === "not-completed" && !quest.is_completed);

    // Search term filter
    const matchesSearch =
      !searchTerm ||
      quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quest.description &&
        quest.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesRarity && matchesCompletion && matchesSearch;
  });

  // Group quests by type for organization
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

  // Combined array for ordering
  const orderedQuests = [
    ...dailyQuests,
    ...bossQuests,
    ...epicQuests,
    ...regularQuests,
  ];

  // Get quest type icon
  const getQuestTypeIcon = (type: QuestType) => {
    switch (type) {
      case QuestType.DAILY:
        return <CalendarDays className="h-4 w-4 text-blue-500" />;
      case QuestType.BOSS:
        return <Swords className="h-4 w-4 text-red-500" />;
      case QuestType.EPIC:
        return <Crown className="h-4 w-4 text-purple-500" />;
      case QuestType.REGULAR:
      default:
        return <Map className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card className="h-full border-muted flex flex-col bg-muted/30">
      <CardHeader className="px-3 py-3 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quests..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs h-8 px-2"
          >
            <Filter className="h-3.5 w-3.5 mr-1" />
            {showFilters ? "Hide Filters" : "Show Filters"}
            {(typeFilter !== "all" ||
              rarityFilter !== "all" ||
              completedFilter !== "all") && (
              <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {
                  [typeFilter, rarityFilter, completedFilter].filter(
                    (f) => f !== "all"
                  ).length
                }
              </span>
            )}
          </Button>

          <span className="text-xs text-muted-foreground">
            {filteredQuests.length} quest
            {filteredQuests.length !== 1 ? "s" : ""}
          </span>
        </div>

        {showFilters && (
          <div className="space-y-2 animate-in slide-in-from-top-5 duration-150">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 text-xs">
                <div className="flex items-center">
                  <Map className="mr-2 h-3.5 w-3.5" />
                  <span>
                    {typeFilter === "all"
                      ? "All Types"
                      : `${
                          typeFilter.charAt(0).toUpperCase() +
                          typeFilter.slice(1)
                        }`}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={QuestType.DAILY}>Daily</SelectItem>
                <SelectItem value={QuestType.REGULAR}>Regular</SelectItem>
                <SelectItem value={QuestType.EPIC}>Epic</SelectItem>
                <SelectItem value={QuestType.BOSS}>Boss</SelectItem>
              </SelectContent>
            </Select>

            <Select value={rarityFilter} onValueChange={setRarityFilter}>
              <SelectTrigger className="h-8 text-xs">
                <div className="flex items-center">
                  <Filter className="mr-2 h-3.5 w-3.5" />
                  <span>
                    {rarityFilter === "all"
                      ? "All Rarities"
                      : `${
                          rarityFilter.charAt(0).toUpperCase() +
                          rarityFilter.slice(1)
                        }`}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rarities</SelectItem>
                <SelectItem value={QuestRarity.COMMON}>Common</SelectItem>
                <SelectItem value={QuestRarity.UNCOMMON}>Uncommon</SelectItem>
                <SelectItem value={QuestRarity.RARE}>Rare</SelectItem>
                <SelectItem value={QuestRarity.EPIC}>Epic</SelectItem>
                <SelectItem value={QuestRarity.LEGENDARY}>Legendary</SelectItem>
              </SelectContent>
            </Select>

            <Select value={completedFilter} onValueChange={setCompletedFilter}>
              <SelectTrigger className="h-8 text-xs">
                <div className="flex items-center">
                  <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                  <span>
                    {completedFilter === "all"
                      ? "All Statuses"
                      : completedFilter === "completed"
                      ? "Completed"
                      : "Not Completed"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="not-completed">Not Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-1.5">
        <ScrollArea className="h-full pr-2">
          {isLoading ? (
            // Loading state
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-2 border rounded-md">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredQuests.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <Filter className="h-12 w-12 text-muted-foreground opacity-20 mb-2" />
              <p className="text-sm text-muted-foreground">
                No quests match your filters.
              </p>
              {(searchTerm ||
                typeFilter !== "all" ||
                rarityFilter !== "all" ||
                completedFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("all");
                    setRarityFilter("all");
                    setCompletedFilter("not-completed");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            // Quest list
            <div className="space-y-1.5">
              {orderedQuests.map((quest) => (
                <div
                  key={quest.id}
                  className={cn(
                    "flex items-start p-2 rounded-md border cursor-pointer transition-colors gap-2",
                    selectedQuestId === quest.id
                      ? "bg-primary/10 border-primary/30"
                      : "hover:bg-accent/50 border-transparent",
                    quest.is_completed && "opacity-70 bg-muted/90"
                  )}
                  onClick={() => onQuestSelect(quest)}
                >
                  <div className="mt-0.5">
                    {getQuestTypeIcon(quest.quest_type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1.5">
                      <h3
                        className={cn(
                          "text-sm font-medium leading-snug truncate",
                          quest.is_completed &&
                            "line-through text-muted-foreground"
                        )}
                      >
                        {quest.title}
                      </h3>

                      {quest.tracked && (
                        <Bookmark className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1 py-0 h-4 bg-muted text-foreground"
                        )}
                      >
                        {quest.rarity}
                      </Badge>

                      {quest.due_date && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 py-0 h-4 flex items-center gap-0.5 bg-muted text-foreground"
                        >
                          <Clock className="h-2.5 w-2.5" />
                          {new Date(quest.due_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </Badge>
                      )}
                      {quest.is_completed && (
                        <Badge className="bg-muted text-green-700 dark:text-green-400 text-[10px] px-1 py-0 h-4 ">
                          Done
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Clock icon component for due dates
function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
