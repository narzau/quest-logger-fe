"use client";

import { useState } from "react";
import { Quest } from "@/types/quest";
import { WowQuestItem } from "./wow-quest-item";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";

interface QuestCategoryProps {
  title: string;
  quests: Quest[];
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  emptyMessage?: string;
}

export function QuestCategory({
  title,
  quests,
  icon,
  defaultOpen = true,
  emptyMessage = "No quests in this category",
}: QuestCategoryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { animationsEnabled } = useSettingsStore();

  const hasQuests = quests.length > 0;

  return (
    <motion.div
      initial={animationsEnabled ? { opacity: 0 } : false}
      animate={animationsEnabled ? { opacity: 1 } : false}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div
        className={cn(
          "flex items-center py-2 px-1 cursor-pointer border-b hover:bg-accent/10 transition-colors",
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
        <div className="mt-2 pl-6">
          {hasQuests ? (
            quests.map((quest) => <WowQuestItem key={quest.id} quest={quest} />)
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
