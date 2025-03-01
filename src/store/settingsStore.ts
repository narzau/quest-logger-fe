import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  darkMode: boolean;
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  setDarkMode: (enabled: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: true, // Default to dark mode for ADHD users
      animationsEnabled: true,
      notificationsEnabled: true,

      setDarkMode: (enabled) => set({ darkMode: enabled }),
      setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),
      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),
    }),
    {
      name: "adhd-quest-settings",
    }
  )
);
