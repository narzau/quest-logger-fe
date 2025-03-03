"use client";

import { useState } from "react";
import { useQuests } from "@/hooks/useQuests";
import { Quest, QuestRarity, QuestType } from "@/types/quest";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
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
import { AnimatedProgress } from "@/components/ui/animated-progress";

// Animation configurations
const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, height: 0, marginBottom: 0 },
};

// Fixed checkVariants - using only two keyframes for spring animation
const checkVariants = {
  unchecked: { scale: 1 },
  checked: { scale: 1.2 }, // Removed array of keyframes
};

const dropdownVariants = {
  closed: { opacity: 0, y: -10 },
  open: { opacity: 1, y: 0 },
};

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
      setTimeout(() => {
        completeQuest(quest.id);
      }, 300);
    }
  };

  const handleDelete = () => {
    deleteQuest(quest.id);
    setDeleteDialogOpen(false);
  };

  return (
    <LayoutGroup>
      <motion.div
        layout
        initial={animationsEnabled ? "hidden" : undefined}
        animate={animationsEnabled ? "visible" : undefined}
        exit={animationsEnabled ? "exit" : undefined}
        variants={containerVariants}
        transition={{ type: "spring", duration: 0.3 }}
        className={cn(
          "group flex flex-col p-3 rounded-lg border cursor-pointer",
          quest.is_completed
            ? "bg-muted/30 border-muted"
            : "bg-card border-border hover:border-primary/20"
        )}
        onClick={(e) => {
          if (!(e.target instanceof HTMLButtonElement) && !expanded) {
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className="flex items-center">
          <motion.div
            animate={quest.is_completed ? "checked" : "unchecked"}
            variants={checkVariants}
            transition={{
              type: "spring",
              stiffness: 500,
              // Add this to create a bounce effect that mimics the original animation
              damping: 10,
            }}
            className="flex"
          >
            <Checkbox
              checked={quest.is_completed}
              onCheckedChange={handleComplete}
              className="h-5 w-5"
              disabled={quest.is_completed}
            />
          </motion.div>

          <div className="ml-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <motion.div className="overflow-hidden">
                <motion.p
                  layout="position"
                  className={cn(
                    "font-medium",
                    quest.is_completed && "line-through text-muted-foreground"
                  )}
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: quest.is_completed ? 0.6 : 1,
                    x: quest.is_completed ? 4 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {quest.title}
                </motion.p>
              </motion.div>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TypeIcon className={cn("h-4 w-4", rarityColor)} />
                    </TooltipTrigger>
                    <TooltipContent>
                      {quest.quest_type} quest - {quest.rarity} rarity
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {quest.due_date && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          className="flex items-center text-xs text-muted-foreground"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(new Date(quest.due_date), {
                            addSuffix: true,
                          })}
                        </motion.div>
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
              <motion.p
                className="text-sm text-muted-foreground line-clamp-1 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {quest.description}
              </motion.p>
            )}
          </div>

          <div className="flex items-center ml-2 gap-1">
            {!expanded && (
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-muted-foreground"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            )}

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
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <MoreHorizontal className="h-4 w-4" />
                  </motion.div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" asChild>
                <motion.div
                  variants={dropdownVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <AnimatePresence>
          {(isOpen || expanded) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
                transition: { type: "spring", duration: 0.3 },
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: { duration: 0.2 },
              }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-border/40">
                <motion.div
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  className="text-sm text-muted-foreground whitespace-pre-wrap"
                >
                  {quest.description}
                </motion.div>

                <motion.div
                  className="mt-3 flex flex-wrap gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center text-sm gap-2">
                    <span className="font-semibold">Priority:</span>
                    <AnimatedProgress
                      value={quest.priority}
                      className="w-28 mt-1"
                    />
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-semibold mr-2">Reward:</span>
                    <span className="text-muted-foreground">
                      {quest.exp_reward} XP
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-semibold mr-2 ">Rarity:</span>
                    <span className={cn(rarityColor)}>{quest.rarity}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
    </LayoutGroup>
  );
}
