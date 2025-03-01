"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useQuests } from "@/hooks/useQuests";
import { QuestItem } from "@/components/quests/quest-item";
import { CreateQuestDialog } from "@/components/quests/create-quest-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Search,
  SortAsc,
  ListFilter,
  Calendar,
  Check,
} from "lucide-react";
import { QuestType } from "@/types/quest";

export default function QuestsPage() {
  const { quests } = useQuests();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMethod, setSortMethod] = useState("priority");

  // Filter quests based on filters
  const filteredQuests = quests.filter((quest) => {
    // Apply type filter
    if (filterType !== "all" && quest.quest_type !== filterType) {
      return false;
    }

    // Apply search filter (case insensitive)
    if (
      searchTerm &&
      !quest.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Sort quests
  const sortedQuests = [...filteredQuests].sort((a, b) => {
    switch (sortMethod) {
      case "priority":
        return b.priority - a.priority;
      case "due_date":
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "created":
      default:
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
  });

  // Separate complete and incomplete quests
  const incompleteQuests = sortedQuests.filter((q) => !q.is_completed);
  const completedQuests = sortedQuests.filter((q) => q.is_completed);

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Quest Log</h1>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Quest
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Quests</CardTitle>
              <CardDescription>
                View, filter and manage your quests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search quests..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="w-40">
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                          <div className="flex items-center">
                            <ListFilter className="mr-2 h-4 w-4" />
                            <span>Filter Type</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value={QuestType.DAILY}>
                            Daily Quests
                          </SelectItem>
                          <SelectItem value={QuestType.REGULAR}>
                            Regular Quests
                          </SelectItem>
                          <SelectItem value={QuestType.EPIC}>
                            Epic Quests
                          </SelectItem>
                          <SelectItem value={QuestType.BOSS}>
                            Boss Quests
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-40">
                      <Select value={sortMethod} onValueChange={setSortMethod}>
                        <SelectTrigger>
                          <div className="flex items-center">
                            <SortAsc className="mr-2 h-4 w-4" />
                            <span>Sort By</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="priority">Priority</SelectItem>
                          <SelectItem value="due_date">Due Date</SelectItem>
                          <SelectItem value="alphabetical">
                            Alphabetical
                          </SelectItem>
                          <SelectItem value="created">Creation Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="active">
                <TabsList className="mb-4">
                  <TabsTrigger value="active" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Active ({incompleteQuests.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Completed ({completedQuests.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                  {incompleteQuests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Check className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium">No active quests</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        All quests have been completed or your filters removed
                        all quests
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => setCreateDialogOpen(true)}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add New Quest
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {incompleteQuests.map((quest) => (
                        <QuestItem key={quest.id} quest={quest} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="completed">
                  {completedQuests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <Check className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium">No completed quests</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Complete some quests to see them here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {completedQuests.map((quest) => (
                        <QuestItem key={quest.id} quest={quest} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <CreateQuestDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </DashboardLayout>
    </AuthGuard>
  );
}
