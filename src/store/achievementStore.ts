import { create } from "zustand";
import { UserAchievement } from "@/types/achievement";

interface AchievementState {
  recentUnlocked: UserAchievement | null;
  isLoading: boolean;
  error: string | null;

  clearRecentUnlocked: () => void;
}

export const useAchievementStore = create<AchievementState>((set) => ({
  recentUnlocked: null,
  isLoading: false,
  error: null,

  clearRecentUnlocked: () => {
    set({ recentUnlocked: null });
  },
}));
