"use client";

import { useState } from "react";
import { useQuests } from "@/hooks/useQuests";
import { Quest, QuestRarity, QuestType } from "@/types/quest";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Crown,
  ChevronRight,
  ChevronDown,
  Info,
  MoreHorizontal,
  Trash,
  Swords,
  MapPin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QuestDetailsDialog } from "./quest-details-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettingsStore } from "@/store/settingsStore";
import { Badge } from "@/components/ui/badge";

interface WowQuestItemProps {
  quest: Quest;
  expanded?: boolean;
  defaultOpen?: boolean;
}

export function WowQuestItem({
  quest,
  expanded = false,
  defaultOpen = false,
}: WowQuestItemProps) {
  const { completeQuest, deleteQuest } = useQuests();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { animationsEnabled } = useSettingsStore();

  // Get color based on rarity
  const getRarityColor = (rarity: QuestRarity) => {
    switch (rarity) {
      case QuestRarity.COMMON:
        return "text-gray-400 border-gray-300";
      case QuestRarity.UNCOMMON:
        return "text-green-500 border-green-400";
      case QuestRarity.RARE:
        return "text-blue-500 border-blue-400";
      case QuestRarity.EPIC:
        return "text-purple-500 border-purple-400";
      case QuestRarity.LEGENDARY:
        return "text-yellow-500 border-yellow-400";
      default:
        return "text-gray-400 border-gray-300";
    }
  };

  const getBgColor = (rarity: QuestRarity) => {
    switch (rarity) {
      case QuestRarity.COMMON:
        return "bg-gray-100/30";
      case QuestRarity.UNCOMMON:
        return "bg-green-100/20";
      case QuestRarity.RARE:
        return "bg-blue-100/20";
      case QuestRarity.EPIC:
        return "bg-purple-100/20";
      case QuestRarity.LEGENDARY:
        return "bg-yellow-100/20";
      default:
        return "bg-gray-100/30";
    }
  };

  // Get icon based on quest type
  const getQuestTypeIcon = (type: QuestType) => {
    switch (type) {
      case QuestType.DAILY:
        return CalendarDays;
      case QuestType.REGULAR:
        return MapPin;
      case QuestType.EPIC:
        return Crown;
      case QuestType.BOSS:
        return Swords;
      default:
        return MapPin;
    }
  };

  const TypeIcon = getQuestTypeIcon(quest.quest_type);
  const rarityColor = getRarityColor(quest.rarity);
  const bgColor = getBgColor(quest.rarity);

  const handleComplete = () => {
    if (!quest.is_completed) {
      completeQuest(quest.id);
    }
  };

  const handleDelete = () => {
    deleteQuest(quest.id);
    setDeleteDialogOpen(false);
  };

  // Generate a quest-type specific label
  const getQuestTypeLabel = () => {
    switch (quest.quest_type) {
      case QuestType.DAILY:
        return "Daily";
      case QuestType.EPIC:
        return "Epic";
      case QuestType.BOSS:
        return "Boss";
      default:
        return null;
    }
  };

  const typeLabel = getQuestTypeLabel();

  return (
    <>
      <motion.div
        initial={animationsEnabled ? { opacity: 0, y: 10 } : false}
        animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.2 }}
        className={cn(
          "border rounded-md overflow-hidden mb-3",
          quest.is_completed ? "border-gray-300 opacity-70" : rarityColor,
          isOpen ? "" : "hover:border-primary/40"
        )}
      >
        <div
          className={cn(
            "flex items-center p-3 cursor-pointer",
            quest.is_completed ? "bg-gray-100/50 dark:bg-gray-800/20" : bgColor
          )}
          onClick={() => !expanded && setIsOpen(!isOpen)}
        >
          {!expanded && (
            <div className="mr-2">
              {isOpen ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          )}

          <div
            className={cn(
              "h-6 w-6 mr-3 flex items-center justify-center rounded-full",
              rarityColor.includes("gray")
                ? "border border-gray-300"
                : rarityColor
            )}
          >
            <TypeIcon className={cn("h-3.5 w-3.5", rarityColor)} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <p
                className={cn(
                  "font-medium",
                  quest.is_completed && "line-through text-muted-foreground"
                )}
              >
                {quest.title}
              </p>

              <div className="ml-2 flex items-center space-x-1">
                {typeLabel && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs py-0 h-5",
                      quest.quest_type === QuestType.DAILY &&
                        "text-blue-500 border-blue-400",
                      quest.quest_type === QuestType.EPIC &&
                        "text-purple-500 border-purple-400",
                      quest.quest_type === QuestType.BOSS &&
                        "text-red-500 border-red-400"
                    )}
                  >
                    {typeLabel}
                  </Badge>
                )}

                {quest.due_date && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {formatDistanceToNow(new Date(quest.due_date), {
                            addSuffix: true,
                          })}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        Due: {new Date(quest.due_date).toLocaleDateString()}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center ml-2 gap-1">
            {!quest.is_completed && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}
                className="h-8 text-xs font-medium"
              >
                Complete
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setDetailsDialogOpen(true);
              }}
              className="h-8 w-8"
            >
              <Info className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setDetailsDialogOpen(true)}>
                  View Details
                </DropdownMenuItem>
                {!quest.is_completed && (
                  <DropdownMenuItem onClick={handleComplete}>
                    Mark as Completed
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {(isOpen || expanded) && quest.description && (
          <div className="p-3 pt-0 border-t border-border/40">
            <div className="mt-3 text-sm text-muted-foreground">
              {quest.description}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="font-semibold mr-1">Priority:</span>{" "}
                {quest.priority}/5
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="font-semibold mr-1">Reward:</span>{" "}
                {quest.exp_reward} XP
              </div>
              <div className={cn("flex items-center text-xs", rarityColor)}>
                <span className="font-semibold mr-1 text-muted-foreground">
                  Rarity:
                </span>{" "}
                {quest.rarity}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the quest &quot;{quest.title}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <QuestDetailsDialog
        quest={quest}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </>
  );
}
