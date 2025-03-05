import React, { useMemo } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { defaultPalettes, colorToString } from "@/lib/color-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Moon, Sun } from "lucide-react";

export function ColorPaletteSelector() {
  const { colorPaletteName, setColorPalette } = useSettingsStore();

  // Categorize palettes into light and dark
  const { lightPalettes, darkPalettes } = useMemo(() => {
    const light: Array<keyof typeof defaultPalettes> = [];
    const dark: Array<keyof typeof defaultPalettes> = [];

    (
      Object.keys(defaultPalettes) as Array<keyof typeof defaultPalettes>
    ).forEach((name) => {
      // Check if the background color is light or dark
      // Using the L value from Oklch to determine light/dark
      // L value above 0.5 is generally considered "light"
      const bgLightness = defaultPalettes[name].background.l;
      if (bgLightness > 0.5) {
        light.push(name);
      } else {
        dark.push(name);
      }
    });

    return { lightPalettes: light, darkPalettes: dark };
  }, []);

  // Convert color to a visible representation
  const getPalettePreview = (paletteName: keyof typeof defaultPalettes) => {
    const palette = defaultPalettes[paletteName];
    return (
      <div className="flex space-x-1">
        {Object.values(palette)
          .slice(0, 5)
          .map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: colorToString(color) }}
            />
          ))}
      </div>
    );
  };

  // Render a palette button
  const renderPaletteButton = (name: keyof typeof defaultPalettes) => (
    <Button
      key={name}
      variant={colorPaletteName === name ? "default" : "outline"}
      className="flex flex-col h-auto p-3 space-y-2"
      onClick={() => setColorPalette(name)}
    >
      <div className="flex justify-between w-full items-center">
        <span className="capitalize">
          {name.replace(/([A-Z])/g, " $1").trim()}
        </span>
        {colorPaletteName === name && <Check className="h-4 w-4" />}
      </div>
      <div className="flex space-x-1">{getPalettePreview(name)}</div>
    </Button>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Palette</CardTitle>
        <CardDescription>
          Choose a color theme that suits your style
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Light Palettes Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sun className="h-5 w-5" />
              <h3 className="text-lg font-medium">Light Themes</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {lightPalettes.map(renderPaletteButton)}
            </div>
          </div>

          {/* Dark Palettes Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Moon className="h-5 w-5" />
              <h3 className="text-lg font-medium">Dark Themes</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {darkPalettes.map(renderPaletteButton)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
