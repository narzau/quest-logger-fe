"use client";

import { useState, useEffect, useRef } from "react";
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
    dialogSize,
    setDialogSize,
  } = useSettingsStore();
  const { isConnected: isGoogleCalendarConnected } = useGoogleCalendar();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [mode, setMode] = useState<"voice" | "manual">("voice");
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [errorAnimation, setErrorAnimation] = useState(false);
  const [createGoogleCalendarEvent, setCreateGoogleCalendarEvent] =
    useState(false);

  // Size states for resizable dialog
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState(
    dialogSize || {
      width: mode === "voice" ? 350 : 500,
      height: 600,
    }
  );
  const resizableDivRef = useRef<HTMLDivElement>(null);

  const form = useForm<CreateQuestFormValues>({
    resolver: zodResolver(createQuestSchema),
    defaultValues: {
      title: "",
      description: "",
      rarity: QuestRarity.COMMON,
      quest_type: defaultQuestType,
      priority: 50,
    },
  });

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setMode("voice");
      setIsProcessingAudio(false);
      setSuccessAnimation(false);
      setErrorAnimation(false);
      setCreateGoogleCalendarEvent(false);
      form.reset({
        title: "",
        description: "",
        rarity: QuestRarity.COMMON,
        quest_type: defaultQuestType,
        priority: 50,
      });
      setDate(undefined);
    }
  }, [open, form, defaultQuestType]);

  // Update size when mode changes, respecting stored size preferences
  useEffect(() => {
    if (dialogSize) {
      // Use stored size but update width based on mode if needed
      setSize((prev) => ({
        ...prev,
        width: mode === "voice" ? Math.min(prev.width, 350) : prev.width,
      }));
    } else {
      // Default size if no stored preference
      setSize((prev) => ({
        ...prev,
        width: mode === "voice" ? 350 : 500,
      }));
    }
  }, [mode, dialogSize]);

  // Resize handlers
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onMouseMove = (e: MouseEvent) => {
      // Calculate new width and height
      const newWidth = Math.max(300, startWidth + e.clientX - startX);
      const newHeight = Math.max(400, startHeight + e.clientY - startY);

      const newSize = {
        width: newWidth,
        height: newHeight,
      };

      setSize(newSize);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      setIsResizing(false);

      // Save the new size to settings store
      setDialogSize(size);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };



  const handleAudioSubmit = async (blob: Blob) => {
    if (!blob?.size) {
      toast.error("No audio recorded");
      return;
    }

    try {
      setIsProcessingAudio(true);
      setErrorAnimation(false);

      if (autoCreateQuestsFromVoice) {
        // Auto-create using hook mutation
        generateQuestFromAudio(blob, {
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
          onError: () => {
            setErrorAnimation(true);
          },
          onSettled: () => setIsProcessingAudio(false),
        });
      } else {
        // Use suggestion mutation from hook
        suggestQuestFromAudio(blob, {
          onSuccess: (suggestedQuest) => {
            populateForm(suggestedQuest);
            setMode("manual");
            setIsProcessingAudio(false);
            toast.success("Quest generated from voice!", {
              description: "Review and make changes before creating.",
            });
          },
          onError: () => {
            setErrorAnimation(true);
            toast.error("Error processing audio", {
              description: "Please try again or use the form.",
            });
          },
          onSettled: () => setIsProcessingAudio(false),
        });
      }
    } catch  {
      setErrorAnimation(true);
      setIsProcessingAudio(false);
      toast.error("Error processing audio", {
        description: "Please try again or use the form.",
      });
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
        onSubmit={handleAudioSubmit}
        isProcessing={isProcessingAudio}
        isSuccess={successAnimation}
        isError={errorAnimation}
        submitButtonLabel={autoCreateQuestsFromVoice ? "Create Quest" : "Generate Draft"}
        autoSubmit={false}
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
          className="p-0 overflow-hidden"
          style={{ maxWidth: "none", width: "auto", maxHeight: "none" }}
        >
          <div
            ref={resizableDivRef}
            className={cn(
              "relative overflow-y-auto p-4 sm:p-6",
              isResizing ? "pointer-events-none select-none" : ""
            )}
            style={{
              width: `${size.width}px`,
              height: `${size.height}px`,
              maxHeight: "90vh",
              resize: "both",
              overflow: "auto",
            }}
          >
            <DialogHeader className="flex w-full items-center justify-center">
              <DialogTitle>Create a new quest</DialogTitle>
            </DialogHeader>

            {/* Success Animation or Content */}
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

            {/* Resize handle */}
            <div
              className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize"
              onMouseDown={startResize}
              style={{
                background:
                  "linear-gradient(135deg, transparent 50%, rgba(128, 128, 128, 0.3) 50%)",
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Full-screen processing animation */}
      <AudioProcessingAnimation isVisible={isProcessingAudio} />
    </>
  );
}
