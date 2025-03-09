"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuests } from "@/hooks/useQuests";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Mic, Wand, Edit, Calendar } from "lucide-react";
import { AudioRecorder } from "./audio-recorder";
import { AudioProcessingAnimation } from "@/components/ui/audio-processing-animation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSettingsStore } from "@/store/settingsStore";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { SimpleDatePicker } from "@/components/ui/simple-date-picker";
import { MarkdownEditor } from "@/components/markdown/markdown-editor";
import { cn } from "@/lib/utils";
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
  const { isConnected: isGoogleCalendarConnected } = useGoogleCalendar();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [mode, setMode] = useState<"voice" | "manual">("voice");
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [createGoogleCalendarEvent, setCreateGoogleCalendarEvent] =
    useState(false);

  const form = useForm<CreateQuestFormValues>({
    resolver: zodResolver(createQuestSchema),
    defaultValues: {
      title: "",
      description: "",
      rarity: QuestRarity.COMMON,
      quest_type: defaultQuestType,
      priority: 50, // Changed from 3 to 50
    },
  });

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setMode("voice");
      setIsProcessingAudio(false);
      setSuccessAnimation(false);
      setCreateGoogleCalendarEvent(false);
      form.reset({
        title: "",
        description: "",
        rarity: QuestRarity.COMMON,
        quest_type: defaultQuestType,
        priority: 50, // Changed from 3 to 50
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
    } catch {
      handleAudioError();
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
      google_calendar: createGoogleCalendarEvent ? true : undefined,
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
            description: createGoogleCalendarEvent
              ? "Your quest has been added to your quest log and Google Calendar."
              : "Your quest has been added to your quest log.",
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
        setCreateGoogleCalendarEvent(false);
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

  // Google Calendar switch component (used only in manual mode)
  const renderGoogleCalendarOption = () => (
    <div
      className={`flex flex-row h-auto min-h-9 items-center justify-between rounded-lg border p-1 gap-2 px-3 mt-4 ${
        !isGoogleCalendarConnected ? "opacity-60" : ""
      }`}
    >
      <div className="flex flex-col py-1">
        <span className="text-sm font-medium whitespace-nowrap flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Google Calendar
        </span>
        {!isGoogleCalendarConnected && (
          <span className="text-xs text-muted-foreground mt-0.5">
            Not connected
          </span>
        )}
      </div>
      <Switch
        checked={createGoogleCalendarEvent}
        onCheckedChange={(checked) => setCreateGoogleCalendarEvent(checked)}
        disabled={!isGoogleCalendarConnected}
      />
    </div>
  );

  // Render the form for manual entry
  const renderManualForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Title *</FormLabel>
              <FormControl>
                <Input
                  className="text-sm"
                  placeholder="Enter quest title"
                  {...field}
                />
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
              <FormControl>
                <MarkdownEditor
                  value={field.value || ""}
                  onChange={(value) => form.setValue("description", value)}
                  placeholder="Describe your quest..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-3 grid-cols-2 sm:gap-4">
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
        <div className="grid  gap-3 grid-cols-2 sm:gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority ({field.value})</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={100}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem className="flex flex-col">
            <FormLabel>Due Date</FormLabel>
            <FormControl>
              <SimpleDatePicker value={date} onChange={setDate} />
            </FormControl>
          </FormItem>
        </div>
        {renderGoogleCalendarOption()}
        <DialogFooter className="mt-2 sm:mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating} className="h-9">
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
      <div className="mt-6 flex flex-col gap-3">
        {/* First row - full width on desktop, single column on mobile */}
        <Button
          variant="outline"
          onClick={() => setMode("manual")}
          className="flex items-center justify-center w-full md:col-span-2"
        >
          <Edit className="h-4 w-4 mr-2" />
          Switch to Manual Entry
        </Button>

        {/* Two switches - stack on mobile, side by side on desktop */}
        <div className="flex flex-row h-9 items-center justify-between rounded-lg border p-1 gap-2 px-3">
          <div className="flex items-center text-sm font-medium whitespace-nowrap">
            <Mic className="h-4 w-4 mr-2" />
            Create automatically on stop
          </div>
          <Switch
            checked={autoCreateQuestsFromVoice}
            onCheckedChange={(checked) => setAutoCreateQuestsFromVoice(checked)}
          />
        </div>

        <div
          className={`flex flex-row h-auto min-h-9 items-center justify-between rounded-lg border p-1 gap-2 px-3 ${
            !isGoogleCalendarConnected ? "opacity-60" : ""
          }`}
        >
          <div className="flex flex-col py-1">
            <span className="text-sm font-medium whitespace-nowrap flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Google Calendar
            </span>
            {!isGoogleCalendarConnected && (
              <span className="text-xs text-muted-foreground mt-0.5">
                Not connected
              </span>
            )}
          </div>
          <Switch
            checked={createGoogleCalendarEvent}
            onCheckedChange={(checked) => setCreateGoogleCalendarEvent(checked)}
            disabled={!isGoogleCalendarConnected}
          />
        </div>
      </div>
    </>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "max-h-[90vh] md:max-h-[85vh] overflow-y-auto p-4 sm:p-6",
            mode == "voice" ? "sm:max-w-[350px]" : "sm:max-w-[500px]"
          )}
        >
          <DialogHeader className="flex w-full items-center justify-center">
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
