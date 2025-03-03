import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  QuestType,
  QuestRarity,
  CreateQuestPayload,
  UpdateQuestPayload,
} from "@/types/quest";

export function useQuests(filters?: {
  quest_type?: QuestType;
  is_completed?: boolean;
  priority?: number;
  rarity?: QuestRarity;
}) {
  const queryClient = useQueryClient();

  const questsQuery = useQuery({
    queryKey: ["quests", filters],
    queryFn: () => api.quest.getQuests(filters),
    enabled: api.auth.isAuthenticated(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const createQuestMutation = useMutation({
    mutationFn: (quest: CreateQuestPayload) => api.quest.createQuest(quest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });

  const generateQuestFromAudio = useMutation({
    mutationFn: (audioBlob: Blob) => api.quest.createQuestFromAudio(audioBlob),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
    // Add this to handle final state
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });

  const suggestQuestFromAudio = useMutation({
    mutationFn: (audioBlob: Blob) => api.quest.suggestQuestFromAudio(audioBlob),
  });

  const updateQuestMutation = useMutation({
    mutationFn: ({
      questId,
      quest,
    }: {
      questId: number;
      quest: UpdateQuestPayload;
    }) => api.quest.updateQuest(questId, quest),
    onSuccess: (updatedQuest) => {
      queryClient.setQueryData(["quest", updatedQuest.id], updatedQuest);
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });

  const deleteQuestMutation = useMutation({
    mutationFn: (questId: number) => api.quest.deleteQuest(questId),
    onSuccess: (_, questId) => {
      queryClient.removeQueries({ queryKey: ["quest", questId] });
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });

  const completeQuestMutation = useMutation({
    mutationFn: (questId: number) => api.quest.completeQuest(questId),
    onSuccess: (updatedQuest) => {
      queryClient.setQueryData(["quest", updatedQuest.id], updatedQuest);
      queryClient.invalidateQueries({ queryKey: ["quests"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    },
  });

  return {
    quests: questsQuery.data || [],
    isLoading: questsQuery.isLoading,
    error: questsQuery.error?.message,
    createQuest: createQuestMutation.mutate,
    updateQuest: updateQuestMutation.mutate,
    deleteQuest: deleteQuestMutation.mutate,
    completeQuest: completeQuestMutation.mutate,
    generateQuestFromAudio: generateQuestFromAudio.mutate,
    suggestQuestFromAudio: suggestQuestFromAudio.mutate,
    isCreating: createQuestMutation.isPending,
    isUpdating: updateQuestMutation.isPending,
    isDeleting: deleteQuestMutation.isPending,
    isCompleting: completeQuestMutation.isPending,
  };
}

export function useQuest(questId: number) {
  const queryClient = useQueryClient();

  const questQuery = useQuery({
    queryKey: ["quest", questId],
    queryFn: () => api.quest.getQuest(questId),
    enabled: api.auth.isAuthenticated() && !!questId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const updateQuestMutation = useMutation({
    mutationFn: (quest: UpdateQuestPayload) =>
      api.quest.updateQuest(questId, quest),
    onSuccess: (updatedQuest) => {
      queryClient.setQueryData(["quest", questId], updatedQuest);
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });

  const completeQuestMutation = useMutation({
    mutationFn: () => api.quest.completeQuest(questId),
    onSuccess: (updatedQuest) => {
      queryClient.setQueryData(["quest", questId], updatedQuest);
      queryClient.invalidateQueries({ queryKey: ["quests"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    },
  });

  return {
    quest: questQuery.data,
    isLoading: questQuery.isLoading,
    error: questQuery.error?.message,
    updateQuest: updateQuestMutation.mutate,
    completeQuest: completeQuestMutation.mutate,
    isUpdating: updateQuestMutation.isPending,
    isCompleting: completeQuestMutation.isPending,
  };
}
