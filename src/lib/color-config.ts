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
  // Soft Pastel Dream Palette
  pastelDream: {
    primary: createOklch(0.75, 0.1, 280), // Soft lavender
    secondary: createOklch(0.78, 0.1, 350), // Blush pink
    background: createOklch(0.95, 0.02, 280), // Frosted lilac
    foreground: createOklch(0.15, 0.05, 280), // Deep twilight
    muted: createOklch(0.8, 0.05, 280), // Misty lavender
    accent: createOklch(0.7, 0.15, 160), // Seafoam mint
    destructive: createOklch(0.7, 0.1, 20), // Soft coral
  },

  // Cool Ocean Breeze Palette
  oceanBreeze: {
    primary: createOklch(0.5, 0.2, 200), // Deep teal
    secondary: createOklch(0.55, 0.15, 170), // Seafoam green
    background: createOklch(0.12, 0.1, 240), // Abyssal blue
    foreground: createOklch(0.9, 0, 0), // Foam white
    muted: createOklch(0.3, 0.08, 200), // Stormy sea
    accent: createOklch(0.6, 0.2, 190), // Tropical cyan
    destructive: createOklch(0.5, 0.15, 20), // Coral reef
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

  // Retro Neon Palette
  retroNeon: {
    primary: createOklch(0.5, 0.3, 200), // Electric cyan
    secondary: createOklch(0.6, 0.3, 330), // Hot pink
    background: createOklch(0.1, 0.2, 240), // Deep synthwave
    foreground: createOklch(0.95, 0, 0), // Neon white
    muted: createOklch(0.3, 0.2, 200), // Cyber teal
    accent: createOklch(0.7, 0.3, 90), // Laser lemon
    destructive: createOklch(0.6, 0.3, 10), // Neon red
  },

  // Earthy Clay Palette
  earthenClay: {
    primary: createOklch(0.5, 0.15, 30), // Terracotta
    secondary: createOklch(0.45, 0.1, 80), // Olive grove
    background: createOklch(0.15, 0.1, 40), // Dark umber
    foreground: createOklch(0.9, 0.05, 50), // Sandstone
    muted: createOklch(0.3, 0.08, 30), // Mudstone
    accent: createOklch(0.55, 0.15, 60), // Mustard seed
    destructive: createOklch(0.45, 0.15, 20), // Rust metal
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
