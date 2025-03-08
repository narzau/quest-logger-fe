// src/store/settingsStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultPalettes, ColorPalette } from "@/lib/color-config";

interface SettingsState {
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  colorPaletteName: keyof typeof defaultPalettes;
  colorPalette: ColorPalette;
  autoCreateQuestsFromVoice: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setColorPalette: (paletteName: keyof typeof defaultPalettes) => void;
  setAutoCreateQuestsFromVoice: (enabled: boolean) => void; // New setter
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      animationsEnabled: true,
      notificationsEnabled: true,
      colorPaletteName: "arctic",
      colorPalette: defaultPalettes.arctic,
      autoCreateQuestsFromVoice: false, // Default to false (review mode)
      setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),
      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),
      setColorPalette: (paletteName) => {
        set({
          colorPaletteName: paletteName,
          colorPalette: defaultPalettes[paletteName],
        });
      },
      setAutoCreateQuestsFromVoice: (enabled) =>
        set({ autoCreateQuestsFromVoice: enabled }),
    }),
    {
      name: "adhd-quest-settings",
      partialize: (state) => ({
        animationsEnabled: state.animationsEnabled,
        notificationsEnabled: state.notificationsEnabled,
        colorPaletteName: state.colorPaletteName,
        colorPalette: state.colorPalette,
        autoCreateQuestsFromVoice: state.autoCreateQuestsFromVoice,
      }),
    }
  )
);
