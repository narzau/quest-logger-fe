// src/store/questStore.ts
import { create } from "zustand";
import { Quest, QuestType, QuestRarity } from "@/types/quest";
import api from "@/lib/api";

interface QuestState {
  quests: Quest[];
  activeQuest: Quest | null;
  isLoading: boolean;
  error: string | null;
  fetchQuests: (filters?: {
    quest_type?: QuestType;
    is_completed?: boolean;
    priority?: number;
    rarity?: QuestRarity;
  }) => Promise<void>;
  fetchQuest: (questId: number) => Promise<void>;
  createQuest: (quest: {
    title: string;
    description?: string;
    due_date?: string;
    rarity: QuestRarity;
    quest_type: QuestType;
    priority: number;
    parent_quest_id?: number;
  }) => Promise<void>;
  updateQuest: (questId: number, quest: Partial<Quest>) => Promise<void>;
  deleteQuest: (questId: number) => Promise<void>;
  completeQuest: (questId: number) => Promise<void>;
}

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: [],
  activeQuest: null,
  isLoading: false,
  error: null,

  fetchQuests: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const quests = await api.quest.getQuests(filters);
      set({ quests });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch quests",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchQuest: async (questId) => {
    set({ isLoading: true, error: null });
    try {
      const quest = await api.quest.getQuest(questId);
      set({ activeQuest: quest });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch quest",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createQuest: async (quest) => {
    set({ isLoading: true, error: null });
    try {
      const newQuest = await api.quest.createQuest(quest);
      set({ quests: [...get().quests, newQuest] });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create quest",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuest: async (questId, quest) => {
    set({ isLoading: true, error: null });
    try {
      const updatedQuest = await api.quest.updateQuest(questId, quest);
      set({
        quests: get().quests.map((q) => (q.id === questId ? updatedQuest : q)),
        activeQuest:
          get().activeQuest?.id === questId ? updatedQuest : get().activeQuest,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update quest",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteQuest: async (questId) => {
    set({ isLoading: true, error: null });
    try {
      await api.quest.deleteQuest(questId);
      set({
        quests: get().quests.filter((q) => q.id !== questId),
        activeQuest:
          get().activeQuest?.id === questId ? null : get().activeQuest,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete quest",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  completeQuest: async (questId) => {
    set({ isLoading: true, error: null });
    try {
      const updatedQuest = await api.quest.completeQuest(questId);
      set({
        quests: get().quests.map((q) => (q.id === questId ? updatedQuest : q)),
        activeQuest:
          get().activeQuest?.id === questId ? updatedQuest : get().activeQuest,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to complete quest",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
