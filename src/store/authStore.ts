// stores/authStore.ts
import { create } from "zustand";

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  authError: string | null;
  setToken: (token: string | null) => void;
  setAuthError: (error: string | null) => void;
};

const getInitialToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: getInitialToken(),
  isAuthenticated: getInitialToken() !== null,
  authError: null,
  setToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
    set({
      token,
      isAuthenticated: !!token,
      authError: null,
    });
  },
  setAuthError: (error) => set({ authError: error }),
}));
