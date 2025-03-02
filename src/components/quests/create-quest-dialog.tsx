"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuests } from "@/hooks/useQuests";
import { createQuestSchema } from "@/lib/validators";
import { QuestRarity, QuestType } from "@/types/quest";
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
import { CalendarIcon, Mic } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AudioRecorder } from "./audio-recorder";
import { toast } from "sonner";
import api from "@/lib/api";

type CreateQuestFormValues = z.infer<typeof createQuestSchema>;

interface CreateQuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultQuestType?: QuestType;
}

export function CreateQuestDialog({
  open,
  onOpenChange,
  defaultQuestType = QuestType.REGULAR,
}: CreateQuestDialogProps) {
  const { createQuest, isCreating } = useQuests();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isUsingVoice, setIsUsingVoice] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);

  const form = useForm<CreateQuestFormValues>({
    resolver: zodResolver(createQuestSchema),
    defaultValues: {
      title: "",
      description: "",
      rarity: QuestRarity.COMMON,
      quest_type: defaultQuestType,
      priority: 3,
    },
  });

  const handleAudioCaptured = async (audioBlob: Blob) => {
    setIsProcessingAudio(true);
    try {
      // Call the API to process the audio
      const result = await api.quest.generateQuestFromAudio(audioBlob);

      // Update the form with the generated quest data
      if (result) {
        // Handle the case where result might have all or some of these fields
        if (result.title) {
          form.setValue("title", result.title);
        }
        if (result.description) {
          form.setValue("description", result.description);
        }
        if (result.rarity) {
          form.setValue("rarity", result.rarity);
        }
        if (result.quest_type) {
          form.setValue("quest_type", result.quest_type);
        }
        if (result.priority) {
          form.setValue("priority", result.priority);
        }
        if (result.due_date) {
          setDate(new Date(result.due_date));
        }

        toast("Quest generated from voice!", {
          description:
            "Your voice recording has been transformed into a quest.",
        });
      } else {
        throw new Error("No data returned from the voice processing service");
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      toast("Error processing audio", {
        description:
          "There was a problem generating a quest from your voice. Please try again or use the form.",
      });
    } finally {
      setIsProcessingAudio(false);
    }
  };

  const onSubmit = (values: CreateQuestFormValues) => {
    const payload = {
      ...values,
      due_date: date ? date.toISOString() : undefined,
    };

    createQuest(payload, {
      onSuccess: () => {
        form.reset();
        setDate(undefined);
        setIsUsingVoice(false);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a new quest</DialogTitle>
        </DialogHeader>

        {!isUsingVoice ? (
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant="default"
              className="w-full"
              onClick={() => setIsUsingVoice(true)}
            >
              <Mic className="h-4 w-4 mr-2" />
              Use Voice
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsUsingVoice(false)}
            >
              Manual Entry
            </Button>
          </div>
        ) : (
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsUsingVoice(false)}
            >
              Switch to Manual Entry
            </Button>
          </div>
        )}

        {isUsingVoice && (
          <div className="space-y-4 mb-4">
            <div className="text-center mb-2">
              <p className="text-sm text-muted-foreground">
                Record your voice to automatically generate a quest
              </p>
            </div>
            <AudioRecorder onAudioCaptured={handleAudioCaptured} />
            {isProcessingAudio && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Processing your voice...
                </p>
              </div>
            )}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quest title" {...field} />
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
                      placeholder="Enter quest details"
                      className="resize-none"
                      {...field}
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
                      onValueChange={(value) => field.onChange(parseInt(value))}
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
                        {date ? format(date, "PPP") : "Select date"}
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isProcessingAudio}>
                {isCreating
                  ? "Creating..."
                  : isProcessingAudio
                  ? "Processing Voice..."
                  : "Create Quest"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
