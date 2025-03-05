// src/components/providers/theme-provider.tsx
"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import { useSettingsStore } from "@/store/settingsStore";
import { useEffect } from "react";
import { generateColorCSS } from "@/lib/color-config";

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps & { children: React.ReactNode }) {
  const { colorPalette } = useSettingsStore();

  useEffect(() => {
    // Generate color CSS
    const colorCSS = generateColorCSS(colorPalette);

    // Create or update a style tag with the new CSS variables
    let styleTag = document.getElementById("custom-theme-styles");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "custom-theme-styles";
      document.head.appendChild(styleTag);
    }

    // Use the entire color configuration as CSS variables
    styleTag.textContent = `:root {
      ${colorCSS}
    }`;

    // Apply global CSS to force update
    const globalStyleTag =
      document.getElementById("global-theme-override") ||
      document.createElement("style");
    globalStyleTag.id = "global-theme-override";
    document.head.appendChild(globalStyleTag);

    return () => {
      styleTag?.remove();
      globalStyleTag?.remove();
    };
  }, [colorPalette]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
