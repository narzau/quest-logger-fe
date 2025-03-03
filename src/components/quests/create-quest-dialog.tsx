"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuests } from "@/hooks/useQuests";
import { createQuestSchema } from "@/lib/validators";
import { CreateQuestPayload, QuestRarity, QuestType } from "@/types/quest";
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
import { CalendarIcon, Mic, Wand, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AudioRecorder } from "./audio-recorder";
import { AudioProcessingAnimation } from "@/components/ui/audio-processing-animation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settingsStore";
// Import the mock API instead of the real one
import { Switch } from "@/components/ui/switch";

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
  const {
    isCreating,
    createQuest,
    generateQuestFromAudio,
    suggestQuestFromAudio,
  } = useQuests();
  const {
    autoCreateQuestsFromVoice,
    setAutoCreateQuestsFromVoice,
    animationsEnabled,
  } = useSettingsStore();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [mode, setMode] = useState<"voice" | "manual">("voice");
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

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

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setMode("voice");
      setIsProcessingAudio(false);
      setSuccessAnimation(false);
      form.reset({
        title: "",
        description: "",
        rarity: QuestRarity.COMMON,
        quest_type: defaultQuestType,
        priority: 3,
      });
      setDate(undefined);
    }
  }, [open, form, defaultQuestType]);

  const handleAudioCaptured = async (audioBlob: Blob) => {
    if (!audioBlob?.size) {
      toast.error("No audio recorded");
      return;
    }

    try {
      setIsProcessingAudio(true);

      if (autoCreateQuestsFromVoice) {
        // Auto-create using hook mutation
        generateQuestFromAudio(audioBlob, {
          onSuccess: (createdQuest) => {
            setSuccessAnimation(true);
            setTimeout(() => onOpenChange(false), 5000);
            toast(
              <div className="flex flex-col">
                <div className="font-medium text-base">Quest Created!</div>
                <div className="text-sm mt-1">{createdQuest.title}</div>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {createdQuest.quest_type}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {createdQuest.rarity}
                  </span>
                </div>
                {createdQuest.description && (
                  <div className="text-xs mt-2 text-muted-foreground line-clamp-2">
                    {createdQuest.description}
                  </div>
                )}
              </div>,
              {
                description: "Your voice has been turned into a new quest.",
                duration: Infinity,
                action: {
                  label: "View Details",
                  onClick: () =>
                    console.log("Navigate to quest:", createdQuest),
                },
              }
            );
          },
          onSettled: () => setIsProcessingAudio(false),
        });
      } else {
        // Use suggestion mutation from hook
        suggestQuestFromAudio(audioBlob, {
          onSuccess: (suggestedQuest) => {
            populateForm(suggestedQuest);
            setMode("manual");
            setIsProcessingAudio(false);
            toast.success("Quest generated from voice!", {
              description: "Review and make changes before creating.",
            });
          },
          onError: () => handleAudioError(),
          onSettled: () => setIsProcessingAudio(false),
        });
      }
    } catch (error) {
      handleAudioError(error);
    }
  };

  // Helper functions
  const populateForm = (suggestedQuest: CreateQuestPayload) => {
    form.setValue("title", suggestedQuest.title || "");
    form.setValue("description", suggestedQuest.description || "");
    if (suggestedQuest.rarity) form.setValue("rarity", suggestedQuest.rarity);
    if (suggestedQuest.quest_type)
      form.setValue("quest_type", suggestedQuest.quest_type);
    if (suggestedQuest.priority)
      form.setValue("priority", suggestedQuest.priority);
    if (suggestedQuest.due_date) setDate(new Date(suggestedQuest.due_date));
  };

  const handleAudioError = (error?: Error) => {
    setIsProcessingAudio(false);
    toast.error("Error processing audio", {
      description: error?.message || "Please try again or use the form.",
    });
  };

  const onSubmit = (values: CreateQuestFormValues) => {
    const payload = {
      ...values,
      due_date: date ? date.toISOString() : undefined,
    };

    const loadingToast = toast.loading("Creating quest...");

    createQuest(payload, {
      onSuccess: (createdQuest) => {
        toast.success(
          <div className="flex flex-col">
            <div className="font-medium text-base">Quest Created!</div>
            <div className="text-sm mt-1">{createdQuest.title}</div>
            <div className="mt-1 flex items-center space-x-2">
              <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                {createdQuest.quest_type}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                {createdQuest.rarity}
              </span>
            </div>
            {createdQuest.description && (
              <div className="text-xs mt-2 text-muted-foreground line-clamp-2">
                {createdQuest.description}
              </div>
            )}
          </div>,
          {
            description: "Your quest has been added to your quest log.",
            duration: 5000,
            action: {
              label: "View Details",
              onClick: () => console.log("Navigate to quest:", createdQuest),
            },
          }
        );

        form.reset();
        setDate(undefined);
        setMode("voice");
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error("Failed to create quest", {
          description: error?.message || "Please try again later.",
        });
      },
      onSettled: () => {
        toast.dismiss(loadingToast);
      },
    });
  };

  // Render the form for manual entry
  const renderManualForm = () => (
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
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quest type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={QuestType.DAILY}>Daily</SelectItem>
                    <SelectItem value={QuestType.REGULAR}>Regular</SelectItem>
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
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rarity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={QuestRarity.COMMON}>Common</SelectItem>
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
                  value={field.value.toString()}
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
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Quest"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );

  // Render voice mode content
  const renderVoiceMode = () => (
    <>
      <div className="text-center mb-2">
        <p className="text-sm text-muted-foreground">
          Record your voice to generate a quest
          {autoCreateQuestsFromVoice ? "" : " draft"}
        </p>
      </div>
      <AudioRecorder
        onAudioCaptured={handleAudioCaptured}
        onProcessingStateChange={setIsProcessingAudio}
        onCancel={() => {
          // If user cancels recording, don't do anything special
          console.log("Recording cancelled");
        }}
      />
      <div className="mt-6 flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => setMode("manual")}
          className="flex items-center"
        >
          <Edit className="h-4 w-4 mr-2" />
          Switch to Manual Entry
        </Button>

        <div className="flex flex-row items-center justify-between rounded-lg border p-1 gap-4 px-4">
          <div className="flex items-center text-sm font-medium">
            <Mic className="h-4 w-4 mr-2 text-pink-500" />
            Auto Create
          </div>
          <Switch
            checked={autoCreateQuestsFromVoice}
            onCheckedChange={(checked) => setAutoCreateQuestsFromVoice(checked)}
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create a new quest</DialogTitle>
          </DialogHeader>

          {/* If we're showing success animation, show only that */}
          {successAnimation ? (
            <div className="flex flex-col items-center justify-center py-6">
              <motion.div
                key="success"
                className="flex flex-col items-center text-center"
                initial={
                  animationsEnabled
                    ? { opacity: 0, scale: 0.8 }
                    : { opacity: 1, scale: 1 }
                }
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <motion.div
                  className="rounded-full bg-green-100 dark:bg-green-900/30 p-6 mb-4"
                  initial={animationsEnabled ? { scale: 0 } : { scale: 1 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12, delay: 0.1 }}
                >
                  <motion.div
                    initial={
                      animationsEnabled
                        ? { rotate: -90, opacity: 0 }
                        : { rotate: 0, opacity: 1 }
                    }
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <Wand className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </motion.div>
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Quest Created!</h3>
                <p className="text-muted-foreground">
                  Your voice has been transformed into a new quest
                </p>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Mode toggle button - always show if in manual mode */}
              {mode === "manual" && (
                <div className="flex gap-2 mb-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setMode("voice")}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Switch to Voice Mode
                  </Button>
                </div>
              )}

              {/* Content based on mode */}
              <AnimatePresence mode="wait">
                {mode === "voice" ? (
                  <motion.div
                    key="voice-mode"
                    className="space-y-4 mb-4"
                    initial={
                      animationsEnabled
                        ? { opacity: 0, y: 10 }
                        : { opacity: 1, y: 0 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      animationsEnabled
                        ? { opacity: 0, y: -10 }
                        : { opacity: 0, y: 0 }
                    }
                    transition={{ duration: 0.2 }}
                  >
                    {renderVoiceMode()}
                  </motion.div>
                ) : (
                  <motion.div
                    key="manual-mode"
                    initial={
                      animationsEnabled
                        ? { opacity: 0, y: 10 }
                        : { opacity: 1, y: 0 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      animationsEnabled
                        ? { opacity: 0, y: -10 }
                        : { opacity: 0, y: 0 }
                    }
                    transition={{ duration: 0.2 }}
                  >
                    {renderManualForm()}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Full-screen processing animation */}
      <AudioProcessingAnimation isVisible={isProcessingAudio} />
    </>
  );
}
