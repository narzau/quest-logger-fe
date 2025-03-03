"use client";

import { Bell, Menu, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateQuestDialog } from "@/components/quests/create-quest-dialog";
import { useState } from "react";

interface TopBarProps {
  onOpenSidebar: () => void;
}

export function TopBar({ onOpenSidebar }: TopBarProps) {
  const [createQuestOpen, setCreateQuestOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onOpenSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative w-full max-w-md ml-4 hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quests..."
              className="w-full bg-background pl-8"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex"
            onClick={() => setCreateQuestOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Quest
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setCreateQuestOpen(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>
        </div>
      </div>

      <CreateQuestDialog
        open={createQuestOpen}
        onOpenChange={setCreateQuestOpen}
      />
    </header>
  );
}
