import React from "react";
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
import { Check } from "lucide-react";

export function ColorPaletteSelector() {
  const { colorPaletteName, setColorPalette } = useSettingsStore();

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Palette</CardTitle>
        <CardDescription>
          Choose a color theme that suits your style
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {(
            Object.keys(defaultPalettes) as Array<keyof typeof defaultPalettes>
          ).map((name) => (
            <Button
              key={name}
              variant={colorPaletteName === name ? "default" : "outline"}
              className="flex flex-col h-auto p-3 space-y-2"
              onClick={() => setColorPalette(name)}
            >
              <div className="flex justify-between w-full items-center">
                <span className="capitalize">{name}</span>
                {colorPaletteName === name && <Check className="h-4 w-4" />}
              </div>
              <div className="flex space-x-1">{getPalettePreview(name)}</div>
            </Button>
          ))}
        </div>

        {/* Custom Color Palette (Future Enhancement) */}
        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full"
            // onClick={openCustomColorPicker}
          >
            Create Custom Palette
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
