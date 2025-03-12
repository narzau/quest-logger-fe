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
import {
  Search,
  Filter,
  CheckCircle2,
  CalendarDays,
  Map,
  Crown,
  Swords,
  Bookmark,
  Tags,
  ArrowUpDown,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { SortableQuestItem2 } from "./sortable-quest-item";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface QuestSidebarProps {
  quests: Quest[];
  selectedQuestId?: number | null;
  onQuestSelect: (quest: Quest) => void;
  onQuestsReorder?: (newOrder: Quest[]) => void;
  isLoading?: boolean;
}

export function QuestSidebar({
  quests,
  selectedQuestId,
  onQuestSelect,
  onQuestsReorder,
  isLoading = false,
}: QuestSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  const [completedFilter, setCompletedFilter] =
    useState<string>("not-completed");
  const [trackingFilter, setTrackingFilter] = useState<string>("all");
  const [labelFilter, setLabelFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("type");
  const [showFilters, setShowFilters] = useState(false);

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

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

    // Tracking status filter
    const matchesTracking =
      trackingFilter === "all" ||
      (trackingFilter === "tracked" && quest.tracked) ||
      (trackingFilter === "not-tracked" && !quest.tracked);

    // Label filter
    const matchesLabel =
      labelFilter === "all" ||
      (quest.labels && quest.labels.includes(labelFilter));

    // Search term filter
    const matchesSearch =
      !searchTerm ||
      quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quest.description &&
        quest.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
      matchesType &&
      matchesRarity &&
      matchesCompletion &&
      matchesTracking &&
      matchesLabel &&
      matchesSearch
    );
  });

  // Sort and group quests based on selected sort option
  const sortedQuests = [...filteredQuests].sort((a, b) => {
    switch (sortBy) {
      case "type":
        // Sort by type, then by title
        if (a.quest_type === b.quest_type) {
          return a.title.localeCompare(b.title);
        }
        // Custom type order: daily, boss, epic, regular
        const typeOrder = {
          [QuestType.DAILY]: 0,
          [QuestType.BOSS]: 1,
          [QuestType.EPIC]: 2,
          [QuestType.REGULAR]: 3,
        };
        return (
          typeOrder[a.quest_type as QuestType] -
          typeOrder[b.quest_type as QuestType]
        );

      case "rarity":
        // Sort by rarity (legendary to common), then by title
        if (a.rarity === b.rarity) {
          return a.title.localeCompare(b.title);
        }
        // Custom rarity order: legendary, epic, rare, uncommon, common
        const rarityOrder = {
          [QuestRarity.LEGENDARY]: 0,
          [QuestRarity.EPIC]: 1,
          [QuestRarity.RARE]: 2,
          [QuestRarity.UNCOMMON]: 3,
          [QuestRarity.COMMON]: 4,
        };
        return (
          rarityOrder[a.rarity as QuestRarity] -
          rarityOrder[b.rarity as QuestRarity]
        );

      case "priority":
        // Sort by priority (high to low), then by title
        if (a.priority === b.priority) {
          return a.title.localeCompare(b.title);
        }
        return b.priority - a.priority;

      case "due_date":
        // Sort by due date (soonest first)
        if (!a.due_date && !b.due_date) return a.title.localeCompare(b.title);
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();

      case "tracking":
        // Sort by tracked status (tracked first)
        if ((a.tracked && b.tracked) || (!a.tracked && !b.tracked)) {
          return a.title.localeCompare(b.title);
        }
        return a.tracked ? -1 : 1;

      case "labels":
        // Sort by label count, then alphabetically
        const aLabels = a.labels || [];
        const bLabels = b.labels || [];
        if (aLabels.length === bLabels.length) {
          return a.title.localeCompare(b.title);
        }
        return bLabels.length - aLabels.length;

      case "alphabetical":
      default:
        // Sort alphabetically by title
        return a.title.localeCompare(b.title);
    }
  });

  // Get quest type icon
  const getQuestTypeIcon = (type: string) => {
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

  // Get rarity color class
  const getRarityColorClass = (rarity: string): string => {
    switch (rarity) {
      case QuestRarity.COMMON:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case QuestRarity.UNCOMMON:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case QuestRarity.RARE:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case QuestRarity.EPIC:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case QuestRarity.LEGENDARY:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Helper function to get available labels from quests
  const getAvailableLabels = (quests: Quest[]): string[] => {
    const labelsSet = new Set<string>();

    quests.forEach((quest) => {
      if (quest.labels && Array.isArray(quest.labels)) {
        quest.labels.forEach((label) => labelsSet.add(label));
      }
    });

    return Array.from(labelsSet).sort();
  };

  // Helper function to get sort label
  const getSortLabel = (sortBy: string): string => {
    switch (sortBy) {
      case "type":
        return "Type";
      case "rarity":
        return "Rarity";
      case "priority":
        return "Priority";
      case "due_date":
        return "Due Date";
      case "tracking":
        return "Tracking";
      case "labels":
        return "Labels";
      case "alphabetical":
        return "A-Z";
      default:
        return "Type";
    }
  };

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = sortedQuests.findIndex((q) => q.id === active.id);
      const overIndex = sortedQuests.findIndex((q) => q.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        // Create a new array with the item moved
        const newOrder = [...sortedQuests];
        const [movedItem] = newOrder.splice(activeIndex, 1);
        newOrder.splice(overIndex, 0, movedItem);

        // Call the callback if provided
        if (onQuestsReorder) {
          onQuestsReorder(newOrder);
        }
      }
    }
  };

  return (
    <Card className="h-full border-muted flex flex-col">
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
              completedFilter !== "all" ||
              trackingFilter !== "all" ||
              labelFilter !== "all") && (
              <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {
                  [
                    typeFilter,
                    rarityFilter,
                    completedFilter,
                    trackingFilter,
                    labelFilter,
                  ].filter((f) => f !== "all").length
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
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 text-xs">
                <div className="flex items-center">
                  <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                  <span>Sort: {getSortLabel(sortBy)}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="type">By Type</SelectItem>
                <SelectItem value="rarity">By Rarity</SelectItem>
                <SelectItem value="priority">By Priority</SelectItem>
                <SelectItem value="due_date">By Due Date</SelectItem>
                <SelectItem value="tracking">By Tracking Status</SelectItem>
                <SelectItem value="labels">By Labels</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>

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

            <Select value={trackingFilter} onValueChange={setTrackingFilter}>
              <SelectTrigger className="h-8 text-xs">
                <div className="flex items-center">
                  <Bookmark className="mr-2 h-3.5 w-3.5" />
                  <span>
                    {trackingFilter === "all"
                      ? "All Tracking"
                      : trackingFilter === "tracked"
                      ? "Tracked Only"
                      : "Untracked Only"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tracking</SelectItem>
                <SelectItem value="tracked">Tracked Only</SelectItem>
                <SelectItem value="not-tracked">Untracked Only</SelectItem>
              </SelectContent>
            </Select>

            {getAvailableLabels(quests).length > 0 && (
              <Select value={labelFilter} onValueChange={setLabelFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <div className="flex items-center">
                    <Tags className="mr-2 h-3.5 w-3.5" />
                    <span>
                      {labelFilter === "all"
                        ? "All Labels"
                        : `Label: ${labelFilter}`}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Labels</SelectItem>
                  {getAvailableLabels(quests).map((label) => (
                    <SelectItem key={label} value={label}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
                completedFilter !== "all" ||
                trackingFilter !== "all" ||
                labelFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("all");
                    setRarityFilter("all");
                    setCompletedFilter("not-completed");
                    setTrackingFilter("all");
                    setLabelFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            // Quest list with drag and drop
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedQuests.map((quest) => quest.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1.5">
                  {sortedQuests.map((quest) => (
                    <SortableQuestItem2
                      key={quest.id}
                      quest={quest}
                      isSelected={selectedQuestId === quest.id}
                      onSelect={() => onQuestSelect(quest)}
                      getTypeIcon={getQuestTypeIcon}
                      getRarityColorClass={getRarityColorClass}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
