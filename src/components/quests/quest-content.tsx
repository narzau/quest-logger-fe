"use client";

import { useState, useEffect } from "react";
import { Quest, QuestRarity, QuestType } from "@/types/quest";
import { useQuests } from "@/hooks/useQuests";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Progress } from "@/components/ui/progress";
import {
  CheckIcon,
  CalendarDays,
  ChevronUp,
  Clock,
  Crown,
  Edit,
  Map,
  MoreHorizontal,
  Sparkles,
  Swords,
  Trash,
  Calendar,
  Bookmark,
  BookmarkMinus,
  Trophy,
  Award,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuestContentProps {
  quest: Quest | null;
  onQuestUpdated?: () => void;
}

export function QuestContent({ quest, onQuestUpdated }: QuestContentProps) {
  const { completeQuest, deleteQuest, updateQuest, isUpdating } = useQuests();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { animationsEnabled } = useSettingsStore();

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  // Animation states
  const [tracking, setTracking] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCompletionBadge, setShowCompletionBadge] = useState(false);
  const [showXpBadge, setShowXpBadge] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Update tracking state and edit values when quest changes
  useEffect(() => {
    if (quest) {
      setTracking(quest.tracked || false);
      setEditedTitle(quest.title);
      setEditedDescription(quest.description || "");
    }
  }, [quest]);

  // Handle completing a quest with animation
  const handleComplete = () => {
    if (quest && !quest.is_completed && !isAnimating) {
      setIsAnimating(true);

      // Show animation effects
      setShowCompletionBadge(true);
      setShowConfetti(true);
      setShowXpBadge(true);

      // Delay quest completion to give time for animation
      setTimeout(() => {
        completeQuest(quest.id);
        if (onQuestUpdated) onQuestUpdated();
      }, 500);

      // Clean up animation states
      setTimeout(() => {
        setShowCompletionBadge(false);
        setShowXpBadge(false);
        setShowConfetti(false);
        setIsAnimating(false);
      }, 4000);
    }
  };

  // Handle deleting a quest
  const handleDelete = () => {
    if (quest) {
      deleteQuest(quest.id);
      setDeleteDialogOpen(false);
      if (onQuestUpdated) onQuestUpdated();
    }
  };

  // Handle saving edited quest
  const handleSaveEdit = () => {
    if (quest) {
      updateQuest(
        {
          questId: quest.id,
          quest: {
            title: editedTitle,
            description: editedDescription,
          },
        },
        {
          onSuccess: () => {
            setIsEditing(false);
            if (onQuestUpdated) onQuestUpdated();
          },
        }
      );
    }
  };

  // Handle toggling tracking status
  const handleToggleTracking = () => {
    if (quest) {
      const newTrackingStatus = !tracking;
      setTracking(newTrackingStatus);
      updateQuest(
        { questId: quest.id, quest: { tracked: newTrackingStatus } },
        { onSuccess: onQuestUpdated }
      );
    }
  };

  // Handle task toggling in the description
  const handleTaskToggle = (lineIndex: number, checked: boolean) => {
    if (!quest || !quest.description) return;

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
      updateQuest(
        { questId: quest.id, quest: { description: newDescription } },
        { onSuccess: onQuestUpdated }
      );
    }
  };

  // Calculate completion percentage based on tasks in description
  const calculateCompletionPercentage = (): number => {
    if (!quest?.description) return 0;

    const lines = quest.description.split("\n");
    const tasks = lines.filter((line) => line.match(/^\s*-\s+\[[x ]\]\s+/));

    if (tasks.length === 0) return 0;

    const completedTasks = tasks.filter((task) =>
      task.match(/^\s*-\s+\[x\]\s+/)
    );
    return (completedTasks.length / tasks.length) * 100;
  };

  // Get type icon
  const getQuestTypeIcon = () => {
    if (!quest) return null;

    switch (quest.quest_type) {
      case QuestType.DAILY:
        return <CalendarDays className="h-5 w-5 text-blue-500" />;
      case QuestType.BOSS:
        return <Swords className="h-5 w-5 text-red-500" />;
      case QuestType.EPIC:
        return <Crown className="h-5 w-5 text-purple-500" />;
      case QuestType.REGULAR:
      default:
        return <Map className="h-5 w-5 text-green-500" />;
    }
  };

  // Get color based on rarity
  const getRarityColor = (rarity: QuestRarity): string => {
    switch (rarity) {
      case QuestRarity.COMMON:
        return "text-gray-500";
      case QuestRarity.UNCOMMON:
        return "text-green-500";
      case QuestRarity.RARE:
        return "text-blue-500";
      case QuestRarity.EPIC:
        return "text-purple-500";
      case QuestRarity.LEGENDARY:
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
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

  // If no quest is selected, show an empty state
  if (!quest) {
    return (
      <Card className="h-full border-muted flex flex-col justify-center items-center">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ChevronUp className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Select a Quest</h2>
          <p className="text-muted-foreground max-w-md">
            Choose a quest from the sidebar to view its details here. You can
            view tasks, track progress, and manage your quests more efficiently.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate completion percentage
  const completionPercentage = calculateCompletionPercentage();
  const hasSubtasks =
    quest.description?.includes("- [ ]") ||
    quest.description?.includes("- [x]");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={quest.id}
        initial={animationsEnabled ? { opacity: 0, x: 20 } : false}
        animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full relative"
      >
        <Card className="h-full border-muted flex flex-col">
          {/* Completion Effects - Absolute positioned for animation */}
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
                y: [0, -5, -5, -15],
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

          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getQuestTypeIcon()}</div>
              <div>
                {isEditing ? (
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-xl font-bold mb-2"
                  />
                ) : (
                  <CardTitle
                    className={cn(
                      "text-xl break-words",
                      quest.is_completed && "line-through text-muted-foreground"
                    )}
                  >
                    {quest.title}
                  </CardTitle>
                )}
                {!isEditing && quest.due_date && (
                  <CardDescription className="mt-1 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      Due{" "}
                      {formatDistanceToNow(new Date(quest.due_date), {
                        addSuffix: true,
                      })}
                    </span>
                  </CardDescription>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  tracking && "text-primary border-primary/50 bg-primary/10"
                )}
                onClick={handleToggleTracking}
                title={tracking ? "Untrack quest" : "Track quest"}
              >
                {tracking ? (
                  <BookmarkMinus className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setIsEditing(!isEditing)}
                    className="cursor-pointer"
                  >
                    {isEditing ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Edits
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Quest
                      </>
                    )}
                  </DropdownMenuItem>

                  {!quest.is_completed && (
                    <DropdownMenuItem
                      onClick={handleComplete}
                      disabled={isUpdating || isAnimating}
                      className="cursor-pointer"
                    >
                      <CheckIcon className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </DropdownMenuItem>
                  )}

                  {quest.google_calendar_event_id && (
                    <DropdownMenuItem
                      onClick={() => {
                        window.open(
                          `https://www.google.com/calendar/render?action=VIEW&eid=${quest.google_calendar_event_id}`,
                          "_blank"
                        );
                      }}
                      className="cursor-pointer"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      View in Calendar
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Quest
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          {/* Progress section - only show if there are subtasks */}
          {hasSubtasks && !quest.is_completed && (
            <div className="px-6 pb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">
                  Task Progress
                </span>
                <span className="text-xs font-medium">
                  {completionPercentage.toFixed(0)}%
                </span>
              </div>
              <Progress value={completionPercentage} className="h-1.5" />
            </div>
          )}

          {/* Details section */}
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full px-6">
              <div className="py-4">
                {/* Quest badges */}
                {!isEditing && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      className={cn(
                        "font-normal",
                        getRarityColor(quest.rarity)
                      )}
                    >
                      {quest.rarity.charAt(0).toUpperCase() +
                        quest.rarity.slice(1)}
                    </Badge>

                    <Badge variant="outline">
                      {quest.quest_type.charAt(0).toUpperCase() +
                        quest.quest_type.slice(1)}
                    </Badge>

                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Trophy className="h-3.5 w-3.5" />
                      {quest.exp_reward} XP
                    </Badge>

                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Priority: {quest.priority}
                    </Badge>

                    {quest.labels && quest.labels.length > 0 && (
                      <>
                        {quest.labels.map((label) => (
                          <Badge key={label} variant="secondary">
                            {label}
                          </Badge>
                        ))}
                      </>
                    )}
                  </div>
                )}

                {/* Description */}
                <div className="mt-4">
                  {isEditing ? (
                    <Textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                      placeholder="Enter quest description (supports Markdown with task lists - use '- [ ]' for tasks)"
                    />
                  ) : quest.description ? (
                    <MarkdownRenderer
                      content={quest.description}
                      onTaskToggle={handleTaskToggle}
                      readOnly={quest.is_completed}
                    />
                  ) : (
                    <p className="text-muted-foreground italic">
                      No description available for this quest.
                    </p>
                  )}
                </div>

                {/* Metadata */}
                {!isEditing && (
                  <div className="mt-6 pt-4 border-t flex flex-col gap-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-muted-foreground">Created:</p>
                        <p>{new Date(quest.created_at).toLocaleDateString()}</p>
                      </div>

                      {quest.due_date && (
                        <div>
                          <p className="text-muted-foreground">Due Date:</p>
                          <p>{new Date(quest.due_date).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    {quest.completed_at && (
                      <div className="mt-2">
                        <p className="text-muted-foreground">Completed:</p>
                        <p>
                          {new Date(quest.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {quest.parent_quest_id && (
                      <div className="mt-2">
                        <p className="text-muted-foreground">Part of Quest:</p>
                        <p>Parent Quest #{quest.parent_quest_id}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Footer actions */}
          <CardFooter className="justify-between border-t p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (isEditing) {
                  handleSaveEdit();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>

            {!quest.is_completed ? (
              <Button
                size="sm"
                onClick={handleComplete}
                disabled={isUpdating || isAnimating}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Complete Quest
              </Button>
            ) : (
              <Badge className="bg-green-600">
                <CheckIcon className="h-4 w-4 mr-1" />
                Completed
              </Badge>
            )}
          </CardFooter>

          {/* Delete confirmation dialog */}
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the quest &ldquo;{quest.title}&ldquo;. This
                  action cannot be undone.
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
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
