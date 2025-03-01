"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuests } from "@/hooks/useQuests";
import { updateQuestSchema } from "@/lib/validators";
import { Quest, QuestRarity, QuestType } from "@/types/quest";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Crown, CalendarDays, Info, Swords } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type UpdateQuestFormValues = z.infer<typeof updateQuestSchema>;

interface QuestDetailsDialogProps {
  quest: Quest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestDetailsDialog({
  quest,
  open,
  onOpenChange,
}: QuestDetailsDialogProps) {
  const { updateQuest, completeQuest, isUpdating } = useQuests();
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    quest.due_date ? new Date(quest.due_date) : undefined
  );

  const form = useForm<UpdateQuestFormValues>({
    resolver: zodResolver(updateQuestSchema),
    defaultValues: {
      title: quest.title,
      description: quest.description || "",
      is_completed: quest.is_completed,
      rarity: quest.rarity,
      quest_type: quest.quest_type,
      priority: quest.priority,
    },
  });

  const onSubmit = (values: UpdateQuestFormValues) => {
    const payload = {
      ...values,
      due_date: date ? date.toISOString() : null,
    };

    updateQuest(
      { questId: quest.id, quest: payload },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  // Get color based on rarity
  const getRarityColor = (rarity: QuestRarity) => {
    switch (rarity) {
      case QuestRarity.COMMON:
        return "bg-gray-200 text-gray-800";
      case QuestRarity.UNCOMMON:
        return "bg-green-100 text-green-800";
      case QuestRarity.RARE:
        return "bg-blue-100 text-blue-800";
      case QuestRarity.EPIC:
        return "bg-purple-100 text-purple-800";
      case QuestRarity.LEGENDARY:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-200 text-gray-800";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {!isEditing && <TypeIcon className="h-5 w-5 mr-2" />}
            {isEditing ? "Edit Quest" : quest.title}
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quest_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quest Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quest type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={QuestType.DAILY}>Daily</SelectItem>
                          <SelectItem value={QuestType.REGULAR}>
                            Regular
                          </SelectItem>
                          <SelectItem value={QuestType.EPIC}>Epic</SelectItem>
                          <SelectItem value={QuestType.BOSS}>Boss</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rarity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rarity</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rarity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority (1-5)</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Low (1)</SelectItem>
                          <SelectItem value="2">Medium-Low (2)</SelectItem>
                          <SelectItem value="3">Medium (3)</SelectItem>
                          <SelectItem value="4">Medium-High (4)</SelectItem>
                          <SelectItem value="5">High (5)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "No due date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              </div>

              <FormField
                control={form.control}
                name="is_completed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Completed</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={rarityColor}>{quest.rarity}</Badge>
                <Badge variant="outline">{quest.quest_type}</Badge>
                <Badge variant="outline">Priority: {quest.priority}</Badge>
              </div>

              {quest.description && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {quest.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Created</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(quest.created_at).toLocaleDateString()}
                  </p>
                </div>

                {quest.due_date && (
                  <div>
                    <h4 className="text-sm font-medium">Due Date</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(quest.due_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium">XP Reward</h4>
                <p className="text-sm text-muted-foreground">
                  {quest.exp_reward} XP
                </p>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <div
                  className={cn(
                    "px-2 py-1 rounded-md",
                    quest.is_completed
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  )}
                >
                  {quest.is_completed ? "Completed" : "In Progress"}
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </div>
              {!quest.is_completed && (
                <div>
                  <Button
                    onClick={() => completeQuest(quest.id)}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Complete Quest
                  </Button>
                </div>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
