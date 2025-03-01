import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useUserStore } from "@/store/userStore";

export function useAuth() {
  const queryClient = useQueryClient();
  const { isAuthenticated, login, logout } = useUserStore();
  const [loginError, setLoginError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      try {
        await login(username, password);
        setLoginError(null);
      } catch (error) {
        setLoginError(error instanceof Error ? error.message : "Login failed");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      logout();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: {
      email: string;
      password: string;
      username: string;
    }) => {
      return api.user.createUser(userData);
    },
  });

  return {
    isAuthenticated,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    register: registerMutation.mutate,
    isLoading:
      loginMutation.isPending ||
      logoutMutation.isPending ||
      registerMutation.isPending,
    error: loginError || registerMutation.error?.message,
  };
}
