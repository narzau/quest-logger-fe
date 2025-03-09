"use client";

import { useState, useEffect, useRef } from "react";
import { Quest } from "@/types/quest";
import { SortableQuestItem } from "./sortable-quest-item";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface QuestCategoryProps {
  title: string;
  quests: Quest[];
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  emptyMessage?: string;
  onQuestsReorder?: (newQuests: Quest[]) => void;
}

export function QuestCategory({
  title,
  quests: initialQuests,
  icon,
  defaultOpen = true,
  emptyMessage = "No quests in this category",
  onQuestsReorder,
}: QuestCategoryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { animationsEnabled } = useSettingsStore();

  // State to manage the sorted quests
  const [quests, setQuests] = useState<Quest[]>([]);

  // Keep track of quest IDs to maintain custom ordering
  const questOrderRef = useRef<number[]>([]);

  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(true);

  // Handle scroll prevention during drag
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventScroll = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    // Add touch event listeners to prevent scroll during drag
    container.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      container.removeEventListener("touchmove", preventScroll);
    };
  }, [isDragging]);

  // Initial sort and updating quests while preserving order
  useEffect(() => {
    if (initialLoadRef.current) {
      // For the very first load, sort by created_at (newest first)
      const sortedQuests = [...initialQuests].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setQuests(sortedQuests);

      // Store the initial order of IDs
      questOrderRef.current = sortedQuests.map((quest) => quest.id);
      initialLoadRef.current = false;
    } else {
      // For subsequent updates, maintain the user's custom order
      const currentIds = questOrderRef.current;

      // Create a map of quests for quick lookup
      const questMap = new Map(initialQuests.map((quest) => [quest.id, quest]));

      // First, handle quests that already exist in our order
      const updatedQuests = currentIds
        .filter((id) => questMap.has(id))
        .map((id) => questMap.get(id)!);

      // Now find any new quests that weren't in our previous order
      const newQuests = initialQuests.filter(
        (quest) => !currentIds.includes(quest.id)
      );

      if (newQuests.length > 0) {
        // Sort new quests by created_at (newest first) before adding them
        newQuests.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Add the new quests at the beginning of the list, not the end
        updatedQuests.unshift(...newQuests);

        // Update the order reference with new IDs
        questOrderRef.current = updatedQuests.map((quest) => quest.id);
      }

      setQuests(updatedQuests);
    }
  }, [initialQuests]);

  const hasQuests = quests.length > 0;

  // Setup DnD sensors - separate mouse and touch sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Lower activation distance for mouse
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Configuration for better touch detection
      activationConstraint: {
        delay: 150, // Short delay to better detect intentional drags on mobile
        tolerance: 5,
      },
    })
  );

  // Handle drag start event
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent): void => {
    setIsDragging(false);

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setQuests((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);

      // Update the order reference
      questOrderRef.current = newItems.map((quest) => quest.id);

      // Notify parent component if callback is provided
      if (onQuestsReorder) {
        onQuestsReorder(newItems);
      }

      return newItems;
    });
  };

  return (
    <motion.div
      initial={animationsEnabled ? { opacity: 0 } : false}
      animate={animationsEnabled ? { opacity: 1 } : false}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div
        className={cn(
          "flex items-center py-2 cursor-pointer border-b hover:bg-accent/10 transition-colors",
          hasQuests ? "border-accent/30" : "border-muted/30"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="mr-2">
          {isOpen ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        {icon && <div className="mr-2">{icon}</div>}

        <h3
          className={cn(
            "text-md font-semibold",
            hasQuests ? "" : "text-muted-foreground"
          )}
        >
          {title}
        </h3>

        <div className="ml-2 text-sm text-muted-foreground">
          {quests.length} {quests.length === 1 ? "quest" : "quests"}
        </div>
      </div>

      {isOpen && (
        <div ref={containerRef} className="mt-2">
          {hasQuests ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={quests.map((quest) => quest.id)}
                strategy={verticalListSortingStrategy}
              >
                {quests.map((quest) => (
                  <SortableQuestItem key={quest.id} quest={quest} />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-sm text-muted-foreground italic py-2">
              {emptyMessage}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
