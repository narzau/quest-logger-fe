"use client";

import { useState } from "react";
import { useQuests } from "@/hooks/useQuests";
import { Quest, QuestRarity, QuestType } from "@/types/quest";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Crown,
  Info,
  MoreHorizontal,
  Swords,
  Trash,
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

interface QuestItemProps {
  quest: Quest;
  expanded?: boolean;
  defaultOpen?: boolean;
}

export function QuestItem({
  quest,
  expanded = false,
  defaultOpen = false,
}: QuestItemProps) {
  const { completeQuest, deleteQuest } = useQuests();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const { animationsEnabled } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Get color based on rarity
  const getRarityColor = (rarity: QuestRarity) => {
    switch (rarity) {
      case QuestRarity.COMMON:
        return "text-gray-400";
      case QuestRarity.UNCOMMON:
        return "text-green-500";
      case QuestRarity.RARE:
        return "text-blue-500";
      case QuestRarity.EPIC:
        return "text-purple-500";
      case QuestRarity.LEGENDARY:
        return "text-yellow-500";
      default:
        return "text-gray-400";
    }
  };

  // Get icon based on quest type
  const getQuestTypeIcon = (type: QuestType) => {
    switch (type) {
      case QuestType.DAILY:
        return CalendarDays;
      case QuestType.REGULAR:
        return Info;
      case QuestType.EPIC:
        return Crown;
      case QuestType.BOSS:
        return Swords;
      default:
        return Info;
    }
  };

  const TypeIcon = getQuestTypeIcon(quest.quest_type);
  const rarityColor = getRarityColor(quest.rarity);

  const handleComplete = () => {
    if (!quest.is_completed) {
      completeQuest(quest.id);
    }
  };

  const handleDelete = () => {
    deleteQuest(quest.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <motion.div
        initial={animationsEnabled ? { opacity: 0, y: 10 } : undefined}
        animate={animationsEnabled ? { opacity: 1, y: 0 } : undefined}
        exit={
          animationsEnabled
            ? { opacity: 0, height: 0, marginBottom: 0 }
            : undefined
        }
        transition={{ duration: 0.2 }}
        className={cn(
          "flex items-center p-3 rounded-lg border",
          quest.is_completed
            ? "bg-muted/30 border-muted"
            : "bg-card border-border hover:border-primary/20"
        )}
        onClick={() => !expanded && setIsOpen(!isOpen)}
      >
        <Checkbox
          checked={quest.is_completed}
          onCheckedChange={handleComplete}
          className="h-5 w-5"
          disabled={quest.is_completed}
        />

        <div className="ml-3 flex-1 min-w-0">
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TypeIcon className={cn("h-4 w-4", rarityColor)} />
                  </TooltipTrigger>
                  <TooltipContent>
                    {quest.quest_type} Quest - {quest.rarity} Rarity
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {quest.due_date && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
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

          {quest.description && (
            <p className="text-sm text-muted-foreground truncate">
              {quest.description}
            </p>
          )}
        </div>

        <div className="flex items-center ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDetailsDialogOpen(true)}
            className="h-8 w-8"
          >
            <Info className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
