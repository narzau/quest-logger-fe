import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useAchievements() {
  const userAchievementsQuery = useQuery({
    queryKey: ["achievements", "user"],
    queryFn: () => api.achievement.getUserAchievements(),
    enabled: api.auth.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const availableAchievementsQuery = useQuery({
    queryKey: ["achievements", "available"],
    queryFn: () => api.achievement.getAvailableAchievements(),
    enabled: api.auth.isAuthenticated(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    userAchievements: userAchievementsQuery.data || [],
    availableAchievements: availableAchievementsQuery.data || [],
    isLoading:
      userAchievementsQuery.isLoading || availableAchievementsQuery.isLoading,
    error:
      userAchievementsQuery.error?.message ||
      availableAchievementsQuery.error?.message,
  };
}
