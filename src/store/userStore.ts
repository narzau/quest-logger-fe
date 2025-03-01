import { create } from "zustand";
import { User } from "@/types/user";
import api from "@/lib/api";

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: api.auth.isAuthenticated(),

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.auth.login(email, password);
      set({ isAuthenticated: true });
      await get().fetchCurrentUser();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Login failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    api.auth.logout();
    set({ user: null, isAuthenticated: false });
  },

  fetchCurrentUser: async () => {
    if (!api.auth.isAuthenticated()) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const user = await api.user.getCurrentUser();
      set({ user, isAuthenticated: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch user",
        isAuthenticated: false,
      });
      api.auth.logout();
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (userData: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await api.user.updateUser(userData);
      set({ user: updatedUser });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update user",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
