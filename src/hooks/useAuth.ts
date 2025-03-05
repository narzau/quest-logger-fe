// hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export function useAuth() {
  const queryClient = useQueryClient();
  const { setToken, setAuthError } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      try {
        const authTokens = await api.auth.login(username, password);
        setToken(authTokens.access_token);
        return authTokens.access_token;
      } catch (error) {
        setAuthError(
          error instanceof AxiosError
            ? error?.response?.data.detail
            : "Login failed"
        );
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: {
      email: string;
      password: string;
      username: string;
    }) => api.user.createUser(userData),
  });

  const logout = () => {
    setToken(null);
    queryClient.clear();
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: useAuthStore.getState().authError || registerMutation.error?.message,
  };
}
