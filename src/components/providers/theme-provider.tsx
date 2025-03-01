"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import { useSettingsStore } from "@/store/settingsStore";
import { useEffect } from "react";

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps & { children: React.ReactNode }) {
  const { darkMode } = useSettingsStore();

  useEffect(() => {
    // Sync the zustand store with the theme provider
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
