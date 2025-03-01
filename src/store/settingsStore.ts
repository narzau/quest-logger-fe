// src/store/settingsStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultPalettes, ColorPalette } from "@/lib/color-config";

interface SettingsState {
  darkMode: boolean;
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  colorPaletteName: keyof typeof defaultPalettes;
  colorPalette: ColorPalette;
  setDarkMode: (enabled: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setColorPalette: (paletteName: keyof typeof defaultPalettes) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: true,
      animationsEnabled: true,
      notificationsEnabled: true,
      colorPaletteName: "arctic",
      colorPalette: defaultPalettes.arctic,

      setDarkMode: (enabled) => set({ darkMode: enabled }),
      setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),
      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),

      setColorPalette: (paletteName) => {
        set({
          colorPaletteName: paletteName,
          colorPalette: defaultPalettes[paletteName],
        });
      },
    }),
    {
      name: "adhd-quest-settings",
      partialize: (state) => ({
        darkMode: state.darkMode,
        animationsEnabled: state.animationsEnabled,
        notificationsEnabled: state.notificationsEnabled,
        colorPaletteName: state.colorPaletteName,
        colorPalette: state.colorPalette,
      }),
    }
  )
);
