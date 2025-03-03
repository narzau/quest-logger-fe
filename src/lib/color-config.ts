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

  // Soft Pastel Dream Palette
  pastelDream: {
    primary: createOklch(0.75, 0.1, 280), // Soft lavender
    secondary: createOklch(0.78, 0.1, 350), // Blush pink
    background: createOklch(0.96, 0.02, 220), // Frosted lilac
    foreground: createOklch(0.15, 0.05, 280), // Deep twilight
    muted: createOklch(0.8, 0.05, 280), // Misty lavender
    accent: createOklch(0.7, 0.15, 160), // Seafoam mint
    destructive: createOklch(0.7, 0.1, 20), // Soft coral
  },

  // Mystical Twilight Palette
  mysticTwilight: {
    primary: createOklch(0.4, 0.2, 290), // Royal purple
    secondary: createOklch(0.5, 0.2, 330), // Magenta bloom
    background: createOklch(0.1, 0.1, 280), // Midnight cosmos
    foreground: createOklch(0.9, 0.05, 300), // Pale orchid
    muted: createOklch(0.3, 0.1, 290), // Twilight shadow
    accent: createOklch(0.6, 0.25, 340), // Electric pink
    destructive: createOklch(0.45, 0.2, 10), // Blood garnet
  },

  // Earthy Clay Palette
  earthenClay: {
    primary: createOklch(0.5, 0.15, 30), // Terracotta
    secondary: createOklch(0.45, 0.1, 80), // Olive grove
    background: createOklch(0.19, 0.025, 40), // Dark umber
    foreground: createOklch(0.9, 0.05, 50), // Sandstone
    muted: createOklch(0.3, 0.08, 30), // Mudstone
    accent: createOklch(0.55, 0.15, 60), // Mustard seed
    destructive: createOklch(0.45, 0.15, 20), // Rust metal
  },
  carbon: {
    primary: createOklch(0.35, 0, 280), // Medium gray
    secondary: createOklch(0.3, 0, 280), // Dark gray
    background: createOklch(0.21, 0, 299), // Near-black
    foreground: createOklch(0.85, 0, 280), // Light gray
    muted: createOklch(0.3, 0.01, 280), // Charcoal
    accent: createOklch(0.35, 0.05, 280), // Subtle accent gray
    destructive: createOklch(0.4, 0.1, 20), // Dark red (accessible contrast)
  },

  // Light Monotone Gray Palette
  silver: {
    primary: createOklch(0.5, 0, 280), // Medium gray
    secondary: createOklch(0.6, 0, 280), // Light gray
    background: createOklch(0.85, 0, 280), // Off-white
    foreground: createOklch(0.15, 0.05, 280), // Dark gray
    muted: createOklch(0.7, 0, 280), // Silver
    accent: createOklch(0.65, 0.05, 280), // Subtle accent
    destructive: createOklch(0.4, 0.1, 20), // Accessible red
  },

  // Warm Light Palette
  warmDawn: {
    primary: createOklch(0.45, 0.1, 40), // Warm taupe
    secondary: createOklch(0.55, 0.08, 60), // Soft beige
    background: createOklch(0.9, 0.04, 60), // Warm white
    foreground: createOklch(0.2, 0.1, 40), // Chocolate brown
    muted: createOklch(0.75, 0.06, 50), // Warm gray
    accent: createOklch(0.5, 0.12, 30), // Terracotta
    destructive: createOklch(0.5, 0.15, 20), // Brick red
  },

  // Cool Light Palette
  frost: {
    primary: createOklch(0.4, 0.1, 220), // Steel blue
    secondary: createOklch(0.5, 0.08, 220), // Pale blue
    background: createOklch(0.96, 0.02, 220), // Icy white
    foreground: createOklch(0.18, 0.12, 220), // Deep navy
    muted: createOklch(0.82, 0.05, 220), // Frosted blue
    accent: createOklch(0.6, 0.15, 200), // Arctic teal
    destructive: createOklch(0.5, 0.15, 10), // Cool crimson
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
