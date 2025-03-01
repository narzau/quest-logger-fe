import { create } from "zustand";
import { Achievement, UserAchievement } from "@/types/achievement";
import api from "@/lib/api";

interface AchievementState {
  userAchievements: UserAchievement[];
  availableAchievements: Achievement[];
  recentUnlocked: UserAchievement | null;
  isLoading: boolean;
  error: string | null;
  fetchUserAchievements: () => Promise<void>;
  fetchAvailableAchievements: () => Promise<void>;
  clearRecentUnlocked: () => void;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  userAchievements: [],
  availableAchievements: [],
  recentUnlocked: null,
  isLoading: false,
  error: null,

  fetchUserAchievements: async () => {
    set({ isLoading: true, error: null });
    try {
      const achievements = await api.achievement.getUserAchievements();

      // Check for newly unlocked achievements
      const currentAchievementIds = new Set(
        get().userAchievements.map((a) => a.id)
      );
      const newAchievements = achievements.filter(
        (a) => !currentAchievementIds.has(a.id)
      );

      // If there's a new achievement, set it as recently unlocked
      if (newAchievements.length > 0) {
        set({ recentUnlocked: newAchievements[0] });
      }

      set({ userAchievements: achievements });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch user achievements",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAvailableAchievements: async () => {
    set({ isLoading: true, error: null });
    try {
      const achievements = await api.achievement.getAvailableAchievements();
      set({ availableAchievements: achievements });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch available achievements",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearRecentUnlocked: () => {
    set({ recentUnlocked: null });
  },
}));
