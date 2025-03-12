"use client";

import { useState } from "react";
import { Quest, QuestType } from "@/types/quest";
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
  Sparkles,
  Swords,
  Trash,
  MoreHorizontal,
  Calendar,
  Bookmark,
  BookmarkMinus,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
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
  const [tracking, setTracking] = useState(quest?.tracked || false);

  // Handle completing a quest
  const handleComplete = () => {
    if (quest && !quest.is_completed) {
      completeQuest(quest.id);
      if (onQuestUpdated) onQuestUpdated();
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
    <Card className="h-full border-muted flex flex-col bg-muted/30">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{getQuestTypeIcon()}</div>
          <div>
            <CardTitle
              className={cn(
                "text-xl break-words",
                quest.is_completed && "line-through text-muted-foreground"
              )}
            >
              {quest.title}
            </CardTitle>
            {quest.due_date && (
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
              "h-8 w-8 bg-muted/30",
              tracking && "text-primary border-primary/50 bg-muted"
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
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-muted/30"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => console.log("Edit quest - add implementation")}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Quest
              </DropdownMenuItem>

              {!quest.is_completed && (
                <DropdownMenuItem
                  onClick={handleComplete}
                  disabled={isUpdating}
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
            <span className="text-xs text-muted-foreground">Task Progress</span>
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
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={cn("bg-muted text-foreground")}>
                {quest.rarity.charAt(0).toUpperCase() + quest.rarity.slice(1)}
              </Badge>

              <Badge variant="outline" className="bg-muted text-foreground">
                {quest.quest_type.charAt(0).toUpperCase() +
                  quest.quest_type.slice(1)}
              </Badge>

              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-muted text-foreground"
              >
                <Trophy className="h-3.5 w-3.5" />
                {quest.exp_reward} XP
              </Badge>

              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-muted text-foreground"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Priority: {quest.priority}
              </Badge>
            </div>

            {/* Description */}
            <div className="mt-4">
              {quest.description ? (
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
                  <p>{new Date(quest.completed_at).toLocaleDateString()}</p>
                </div>
              )}

              {quest.parent_quest_id && (
                <div className="mt-2">
                  <p className="text-muted-foreground">Part of Quest:</p>
                  <p>Parent Quest #{quest.parent_quest_id}</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>

      {/* Footer actions */}
      <CardFooter className="justify-between border-t p-4">
        <Button
          variant="outline"
          size="sm"
          className="bg-muted/20"
          onClick={() => console.log("Edit quest - add implementation")}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>

        {!quest.is_completed ? (
          <Button
            size="sm"
            onClick={handleComplete}
            disabled={isUpdating}
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
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the quest &ldquo;{quest.title}
              &ldquo;. This action cannot be undone.
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
  );
}
