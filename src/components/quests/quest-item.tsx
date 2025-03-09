import React, { useState, useEffect } from "react";
import { useQuests } from "@/hooks/useQuests";
import { Quest, QuestRarity } from "@/types/quest";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  ChevronDown,
  Clock,
  Info,
  MoreHorizontal,
  Trash,
  Award,
  Calendar,
  ExternalLink,
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
import { useSettingsStore } from "@/store/settingsStore";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

// Animation configurations
const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, height: 0, marginBottom: 0 },
};

const dropdownVariants = {
  closed: { opacity: 0, y: -10 },
  open: { opacity: 1, y: 0 },
};

// Confetti particles component for the completion animation
const Confetti = () => {
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100 - 50, // Between -50 and 50
    y: Math.random() * -50 - 10, // Start above the component
    rotation: Math.random() * 360,
    duration: Math.random() * 1 + 1.5,
    color: i % 3 === 0 ? "#4f46e5" : i % 3 === 1 ? "#38bdf8" : "#818cf8",
  }));

  return (
    <div className="absolute inset-0 overflow-visible pointer-events-none z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            x: particle.x,
            y: particle.y,
            rotate: particle.rotation,
          }}
          animate={{
            y: [particle.y, particle.y + 100 + Math.random() * 50],
            x: [particle.x, particle.x + (Math.random() * 100 - 50)],
            opacity: [1, 0],
            rotate: [
              particle.rotation,
              particle.rotation + (Math.random() * 360 - 180),
            ],
          }}
          transition={{
            duration: particle.duration,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
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
  // Make a local copy of the quest to manipulate for animations
  const [localQuest, setLocalQuest] = useState<Quest>({ ...quest });
  const { completeQuest, deleteQuest, updateQuest } = useQuests();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const { animationsEnabled } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCompletionBadge, setShowCompletionBadge] = useState(false);
  const [showXpBadge, setShowXpBadge] = useState(false);
  const [showStrikethrough, setShowStrikethrough] = useState(
    quest.is_completed
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGlow, setShowGlow] = useState(false);

  // Update local quest when the prop changes
  useEffect(() => {
    if (!isAnimating) {
      setLocalQuest({ ...quest });
      setShowStrikethrough(quest.is_completed);
    }
  }, [quest, isAnimating]);

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

  const rarityColor = getRarityColor(localQuest.rarity);

  // Run the completion animation sequence - simplified to avoid position shifts
  const runCompletionAnimation = () => {
    if (localQuest.is_completed || isAnimating) return;

    setIsAnimating(true);

    // Immediately update the local state for a smoother transition
    setLocalQuest((prev) => ({ ...prev, is_completed: true }));

    // Show strikethrough immediately
    setShowStrikethrough(true);

    // Show completion effects
    setTimeout(() => {
      setShowCompletionBadge(true);
      setShowConfetti(true);
      setShowXpBadge(true);
    }, 100);

    // Delay quest completion to give time animation to play
    setTimeout(() => {
      completeQuest(quest.id);
    }, 500);

    // Update backend after animations finish
    setTimeout(() => {
      // Hide all visual effects
      setShowCompletionBadge(false);
      setShowXpBadge(false);
      setShowConfetti(false);
      setShowGlow(false);
      setIsAnimating(false);
    }, 4000);
  };

  const handleComplete = () => {
    if (!localQuest.is_completed && !isAnimating) {
      runCompletionAnimation();
    }
  };

  const handleDelete = () => {
    deleteQuest(quest.id);
    setDeleteDialogOpen(false);
  };

  const handleTaskToggle = (lineIndex: number, checked: boolean) => {
    // Only proceed if we have a description
    if (!quest.description) return;

    // Split the description into lines
    const lines = quest.description.split("\n");

    // Ensure lineIndex is valid
    if (lineIndex < 0 || lineIndex >= lines.length) return;

    // Get the line and check if it's a task
    const line = lines[lineIndex];
    const taskMatch = line.match(/^(\s*-\s+\[)([x ])(\]\s+.*)$/);

    if (taskMatch) {
      // Update the checkbox state
      lines[lineIndex] = `${taskMatch[1]}${checked ? "x" : " "}${taskMatch[3]}`;

      // Join the lines back together
      const newDescription = lines.join("\n");

      // Update the quest
      updateQuest({
        questId: quest.id,
        quest: { description: newDescription },
      });
    }
  };

  // Open Google Calendar event
  const openGoogleCalendarEvent = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the quest item from toggling open/closed

    // Generate URL from event ID if available
    if (quest.google_calendar_event_id) {
      // The event ID may need to be encoded first, and the correct format is to use 'eventedit' rather than 'event'
      const calendarUrl = `https://www.google.com/calendar/render?action=VIEW&eid=${quest.google_calendar_event_id}`;
      window.open(calendarUrl, "_blank");
    }
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
          "group flex flex-col px-2 rounded-lg border cursor-pointer relative",
          localQuest.is_completed
            ? "bg-muted/60 border-muted"
            : "bg-muted/20 border-border hover:border-primary/20",
          showGlow && "shadow-[0_0_15px_rgba(59,130,246,0.3)]" // Glow effect
        )}
        style={{
          transform: showGlow ? "scale(1.02)" : "scale(1)",
          transition: "transform 0.3s, box-shadow 0.3s",
        }}
        onClick={(e) => {
          if (
            !(e.target instanceof HTMLButtonElement) &&
            !expanded &&
            !isAnimating
          ) {
            setIsOpen(!isOpen);
          }
        }}
      >
        {/* Completion Effects */}
        {showCompletionBadge && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1.2, 1],
              y: [0, -20, -20, -40],
            }}
            transition={{
              duration: 1.6,
              times: [0, 0.2, 0.8, 1],
              ease: "easeOut",
            }}
          >
            <div className="bg-primary/80 text-primary-foreground px-3 py-1 rounded-full flex items-center shadow-md">
              <Award className="mr-1.5 h-4 w-4" />
              <span className="font-semibold text-sm">Quest Complete!</span>
            </div>
          </motion.div>
        )}

        {/* Floating XP reward */}
        {showXpBadge && (
          <motion.div
            className="absolute top-3 right-5 pointer-events-none z-10"
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1.2, 1],
              y: [0, -5, -5, -15], // Reduced vertical movement to stay in bounds
            }}
            transition={{
              duration: 1.5,
              times: [0, 0.2, 0.8, 1],
              ease: "easeOut",
            }}
          >
            <div className="bg-primary/80 text-primary-foreground px-2 py-0.5 rounded-full text-xs font-medium shadow-md">
              +{quest.exp_reward} XP
            </div>
          </motion.div>
        )}

        {/* Confetti effect */}
        {showConfetti && <Confetti />}

        {/* Main content row - single row layout */}
        <div className="flex items-center w-full">
          {/* Checkbox aligned with the text */}
          <div className="flex-shrink-0 flex items-center">
            <Checkbox
              checked={localQuest.is_completed}
              onCheckedChange={handleComplete}
              className="h-5 w-5 border-2"
              disabled={localQuest.is_completed || isAnimating}
            />
          </div>

          {/* Title with adjusted vertical positioning */}
          <div className="ml-2 mr-auto flex-grow overflow-hidden">
            <div className="flex items-center">
              <div className="relative overflow-hidden">
                <div
                  className={cn(
                    "font-medium text-sm sm:text-base leading-5 sm:max-w-full max-w-40 whitespace-normal",
                    (localQuest.is_completed || showStrikethrough) &&
                      "text-muted-foreground"
                  )}
                >
                  {/* We'll wrap each word in a span to apply the strikethrough effect correctly */}
                  {quest.title.split(" ").map((word, i) => (
                    <React.Fragment key={i}>
                      <span className="relative inline-block">
                        {word}
                        {showStrikethrough && (
                          <motion.div
                            className="absolute left-0 h-0.5 bg-primary/50 origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: 0.4,
                              ease: "easeInOut",
                              delay: i * 0.03,
                            }}
                            style={{
                              width: "100%",
                              top: "50%",
                            }}
                          />
                        )}
                      </span>
                      {i < quest.title.split(" ").length - 1 && " "}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            {/* Action buttons */}
            <div className="flex items-center gap-x-1 flex-shrink-0 self-end place-self-end">
              {!expanded && (
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-muted-foreground flex items-center justify-center"
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailsDialogOpen(true);
                      }}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>

                    {quest.google_calendar_event_id && (
                      <DropdownMenuItem onClick={openGoogleCalendarEvent}>
                        <Calendar className="mr-2 h-4 w-4" />
                        View in Calendar
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex self-end place-self-end pb-2 items-center justify-end text-xs text-muted-foreground flex-shrink-0">
              <Clock className="h-3 w-3 mr-0.5 " />
              <p className="flex place-self-end self-end justify-end">
                {formatDistanceToNowStrict(new Date(quest.due_date), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Expandable content */}
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
              className="overflow-hidden border-t border-border/40"
            >
              <div className="mt-1">
                <motion.div initial={{ y: -10 }} animate={{ y: 0 }}>
                  <MarkdownRenderer
                    content={quest.description || ""}
                    onTaskToggle={handleTaskToggle}
                    readOnly={quest.is_completed || isAnimating}
                  />
                </motion.div>

                <motion.div
                  className="mt-2 pb-3 flex flex-wrap gap-2 text-xs sm:text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">Priority:</span>
                    <AnimatedProgress
                      value={quest.priority}
                      className="w-20 sm:w-24 mt-1"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-1">Reward:</span>
                    <span className="text-muted-foreground">
                      {quest.exp_reward} XP
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-1">Rarity:</span>
                    <span className={cn(rarityColor)}>{quest.rarity}</span>
                  </div>

                  {/* Google Calendar Link in expanded view */}
                  {quest.google_calendar_event_id && (
                    <div className="flex items-center">
                      <span className="font-semibold mr-1">Calendar:</span>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-blue-500"
                        onClick={openGoogleCalendarEvent}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View event
                      </Button>
                    </div>
                  )}
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
