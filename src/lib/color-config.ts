// src/lib/color-config.ts
import { Oklch, formatRgb, convertOklabToRgb } from "culori";

export interface ColorPalette {
  primary: Oklch;
  secondary: Oklch;
  background: Oklch;
  foreground: Oklch;
  muted: Oklch;
  accent: Oklch;
  destructive: Oklch;
}

// Convert Oklch to Oklab (manual conversion)
function oklchToOklab(color: Oklch) {
  return {
    mode: "oklab",
    l: color.l,
    a: color.c * Math.cos(((color.h as number) * Math.PI) / 180),
    b: color.c * Math.sin(((color.h as number) * Math.PI) / 180),
  };
}

// Helper function to create an Oklch color
export function createOklch(l: number, c: number, h: number): Oklch {
  return { mode: "oklch", l, c, h };
}

// Convert color to RGB string
export function colorToString(color: Oklch): string {
  try {
    // Convert Oklch to Oklab
    const oklabColor = oklchToOklab(color);

    // Convert Oklab to RGB
    const rgbColor = convertOklabToRgb(oklabColor);

    // Fallback to a default if conversion fails
    if (!rgbColor) {
      console.warn("Color conversion failed, using fallback", color);
      return "rgb(255,255,255)";
    }

    // Use formatRgb to convert to CSS RGB string
    const rgbString = formatRgb(rgbColor);

    // Fallback to a default if formatRgb returns undefined
    return rgbString || "rgb(255,255,255)";
  } catch (error) {
    console.error("Color conversion error", error, color);
    return "rgb(255,255,255)";
  }
}

export const defaultPalettes = {
  // Deep, Sophisticated Technology-Inspired Palette
  midnight: {
    primary: createOklch(0.3, 0.2, 260), // Deep blue-purple
    secondary: createOklch(0.4, 0.15, 40), // Muted copper
    background: createOklch(0.12, 0.05, 240), // Deep navy
    foreground: createOklch(0.9, 0, 0), // Soft white
    muted: createOklch(0.3, 0.05, 270), // Soft slate blue
    accent: createOklch(0.5, 0.2, 200), // Vibrant teal
    destructive: createOklch(0.45, 0.2, 20), // Deep rust
  },

  // Warm, Earthy Natural Palette
  woodland: {
    primary: createOklch(0.4, 0.15, 100), // Warm olive green
    secondary: createOklch(0.45, 0.1, 50), // Soft terracotta
    background: createOklch(0.15, 0.05, 80), // Deep forest green
    foreground: createOklch(0.9, 0, 0), // Cream
    muted: createOklch(0.3, 0.08, 70), // Muted sage
    accent: createOklch(0.5, 0.15, 140), // Moss green
    destructive: createOklch(0.45, 0.2, 30), // Deep auburn
  },

  // Cool, Minimalist Nordic Palette
  arctic: {
    primary: createOklch(0.4, 0.1, 240), // Soft blue-gray
    secondary: createOklch(0.5, 0.05, 200), // Pale blue
    background: createOklch(0.15, 0.03, 250), // Deep slate
    foreground: createOklch(0.9, 0, 0), // Soft white
    muted: createOklch(0.3, 0.05, 230), // Muted blue-gray
    accent: createOklch(0.5, 0.1, 190), // Cool turquoise
    destructive: createOklch(0.45, 0.15, 20), // Muted brick red
  },

  // Vibrant, Energetic Design Palette
  electric: {
    primary: createOklch(0.4, 0.25, 280), // Deep purple
    secondary: createOklch(0.5, 0.2, 40), // Bright orange
    background: createOklch(0.1, 0.1, 260), // Very dark purple
    foreground: createOklch(0.9, 0, 0), // Soft white
    muted: createOklch(0.3, 0.15, 270), // Muted lavender
    accent: createOklch(0.5, 0.25, 200), // Bright teal
    destructive: createOklch(0.45, 0.2, 10), // Deep crimson
  },

  // Warm, Inviting Sunset Palette
  sunset: {
    primary: createOklch(0.4, 0.2, 30), // Warm terracotta
    secondary: createOklch(0.5, 0.15, 50), // Soft peach
    background: createOklch(0.15, 0.1, 40), // Deep rust
    foreground: createOklch(0.9, 0, 0), // Soft cream
    muted: createOklch(0.3, 0.1, 20), // Muted clay
    accent: createOklch(0.5, 0.2, 60), // Golden ochre
    destructive: createOklch(0.45, 0.2, 10), // Deep maroon
  },

  // Soft, Pastel-Inspired Digital Palette
  digital: {
    primary: createOklch(0.4, 0.15, 260), // Soft periwinkle
    secondary: createOklch(0.5, 0.1, 180), // Muted mint
    background: createOklch(0.15, 0.05, 250), // Deep blue-gray
    foreground: createOklch(0.9, 0, 0), // Soft white
    muted: createOklch(0.3, 0.08, 230), // Soft slate
    accent: createOklch(0.5, 0.15, 200), // Cool aqua
    destructive: createOklch(0.45, 0.15, 10), // Soft brick
  },
};

export function generateColorCSS(palette: ColorPalette) {
  // Use an object to ensure we're generating valid CSS
  const cssVars: Record<string, string> = {
    "--background": colorToString(palette.background),
    "--foreground": colorToString(palette.foreground),
    "--card": colorToString(palette.background),
    "--card-foreground": colorToString(palette.foreground),
    "--popover": colorToString(palette.background),
    "--popover-foreground": colorToString(palette.foreground),
    "--primary": colorToString(palette.primary),
    "--primary-foreground": colorToString(createOklch(1, 0, 0)),
    "--secondary": colorToString(palette.secondary),
    "--secondary-foreground": colorToString(palette.foreground),
    "--muted": colorToString(palette.muted),
    "--muted-foreground": colorToString(createOklch(0.556, 0, 0)),
    "--accent": colorToString(palette.accent),
    "--accent-foreground": colorToString(palette.foreground),
    "--destructive": colorToString(palette.destructive),
    "--destructive-foreground": colorToString(createOklch(1, 0, 0)),
    "--border": colorToString(palette.muted),
    "--input": colorToString(palette.muted),
    "--ring": colorToString(palette.primary),
  };

  // Log the generated CSS variables for debugging
  console.log("Generated CSS Variables:", cssVars);

  // Convert to CSS string
  return Object.entries(cssVars)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");
}
