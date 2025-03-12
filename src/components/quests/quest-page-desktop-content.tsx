"use client";

import { useState, useEffect } from "react";
import { useQuests } from "@/hooks/useQuests";
import { QuestSidebar } from "@/components/quests/quest-sidebar";
import { QuestContent } from "@/components/quests/quest-content";
import { Quest } from "@/types/quest";
import { CreateQuestDialog } from "@/components/quests/create-quest-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";

export function QuestPageDesktopContent() {
  const { quests, isLoading } = useQuests();
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams.get("id");
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { animationsEnabled } = useSettingsStore();

  useEffect(() => {
    if (questId && quests.length > 0) {
      const quest = quests.find((q) => q.id === parseInt(questId));
      setSelectedQuest(quest || null);
    } else if (quests.length > 0 && !questId) {
      // Optionally select the first quest when no ID is specified
      // setSelectedQuest(quests[0]);
      setSelectedQuest(null);
    }
  }, [questId, quests]);

  const handleQuestSelect = (quest: Quest) => {
    setSelectedQuest(quest);
    // Update URL with the selected quest ID for bookmarking/sharing
    router.push(`/quests?id=${quest.id}`);
  };

  // Handle quest reordering (optional - you can implement persistence if needed)
  const handleQuestsReorder = (newOrder: Quest[]) => {
    console.log(
      "Quests reordered:",
      newOrder.map((q) => q.id)
    );
    // Here you would update your backend if you want to persist the order
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quest Manager</h1>
          <p className="text-muted-foreground mt-1">
            {quests.filter((q) => !q.is_completed).length} active quests
          </p>
        </div>

        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Quest
        </Button>
      </div>
      {/* Split View Layout with adjusted widths */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 h-[calc(100vh-13rem)]">
        {/* Sidebar - significantly larger now (1/3 of screen) */}
        <motion.div
          className="md:col-span-1 lg:col-span-1 overflow-hidden"
          initial={animationsEnabled ? { opacity: 0, x: -20 } : false}
          animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
          transition={{ duration: 0.3 }}
        >
          <QuestSidebar
            quests={quests}
            selectedQuestId={selectedQuest?.id}
            onQuestSelect={handleQuestSelect}
            onQuestsReorder={handleQuestsReorder}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Content - now only 2/3 of screen width */}
        <motion.div
          className="md:col-span-2 lg:col-span-2 overflow-hidden"
          initial={animationsEnabled ? { opacity: 0, x: 20 } : false}
          animate={animationsEnabled ? { opacity: 1, x: 0 } : false}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <QuestContent
            quest={selectedQuest}
            onQuestUpdated={() => {
              // No need to do anything special as the useQuests hook will refresh
            }}
          />
        </motion.div>
      </div>
      <CreateQuestDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
