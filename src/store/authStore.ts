// stores/authStore.ts
import { create } from "zustand";

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  authError: string | null;
  setToken: (token: string | null) => void;
  setAuthError: (error: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  authError: null,
  setToken: (token) => {
    localStorage.setItem("token", token || "");
    set({
      token,
      isAuthenticated: !!token,
      authError: null,
    });
  },
  setAuthError: (error) => set({ authError: error }),
}));
