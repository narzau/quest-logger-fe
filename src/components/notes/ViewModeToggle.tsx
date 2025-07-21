"use client";

import { useSettingsStore, type NotesViewMode } from "@/store/settingsStore";
import { Button } from "@/components/ui/button";
import { 
  List, 
  Columns3, 
  AlignJustify 
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ViewOption {
  mode: NotesViewMode;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const viewOptions: ViewOption[] = [
  {
    mode: "list",
    icon: <List size={18} />,
    label: "List View",
    description: "Traditional list with details"
  },
  {
    mode: "board",
    icon: <Columns3 size={18} />,
    label: "Board View",
    description: "Kanban-style columns by folder"
  },
  {
    mode: "compact",
    icon: <AlignJustify size={18} />,
    label: "Compact List",
    description: "Dense list to see more notes"
  }
];

export default function ViewModeToggle() {
  const { notesViewMode, setNotesViewMode } = useSettingsStore();

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-lg">
        {viewOptions.map((option) => (
          <Tooltip key={option.mode}>
            <TooltipTrigger asChild>
              <Button
                variant={notesViewMode === option.mode ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  notesViewMode === option.mode && "shadow-sm"
                )}
                onClick={() => setNotesViewMode(option.mode)}
                aria-label={option.label}
              >
                {option.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <div className="font-medium">{option.label}</div>
                <div className="text-muted-foreground text-xs">
                  {option.description}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
} 