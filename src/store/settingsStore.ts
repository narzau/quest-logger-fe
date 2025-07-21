// src/store/settingsStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultPalettes, ColorPalette } from "@/lib/color-config";

interface DialogSize {
  width: number;
  height: number;
}

export type NotesViewMode = "list" | "board" | "compact";

interface SettingsState {
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  colorPaletteName: keyof typeof defaultPalettes;
  colorPalette: ColorPalette;
  autoCreateQuestsFromVoice: boolean;
  dialogSize: DialogSize;
  notesViewMode: NotesViewMode;
  setAnimationsEnabled: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setColorPalette: (paletteName: keyof typeof defaultPalettes) => void;
  setAutoCreateQuestsFromVoice: (enabled: boolean) => void;
  setDialogSize: (size: DialogSize) => void;
  setNotesViewMode: (mode: NotesViewMode) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      animationsEnabled: true,
      notificationsEnabled: true,
      colorPaletteName: "arctic",
      colorPalette: defaultPalettes.arctic,
      autoCreateQuestsFromVoice: false,
      dialogSize: {
        width: 500,
        height: 600,
      },
      notesViewMode: "list",
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
      setDialogSize: (size) => set({ dialogSize: size }),
      setNotesViewMode: (mode) => set({ notesViewMode: mode }),
    }),
    {
      name: "adhd-quest-settings",
      partialize: (state) => ({
        animationsEnabled: state.animationsEnabled,
        notificationsEnabled: state.notificationsEnabled,
        colorPaletteName: state.colorPaletteName,
        colorPalette: state.colorPalette,
        autoCreateQuestsFromVoice: state.autoCreateQuestsFromVoice,
        dialogSize: state.dialogSize,
        notesViewMode: state.notesViewMode,
      }),
    }
  )
);
