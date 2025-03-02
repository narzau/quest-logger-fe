// src/lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { AuthTokens, User } from "@/types/user";
import { Quest, CreateQuestPayload, UpdateQuestPayload } from "@/types/quest";
import { Achievement, UserAchievement } from "@/types/achievement";

// Create a base axios instance with common configuration
const axiosClient: AxiosInstance = axios.create({
  baseURL: "https://api.questlog.site/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to inject auth token into every request
axiosClient.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");

      if (token && config.headers) {
        // Inject token into Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add a timestamp to prevent caching
      // This can help avoid inconsistent behavior
      const timestamp = new Date().getTime();
      const url = config.url || "";
      const separator = url.includes("?") ? "&" : "?";
      config.url = `${url}${separator}_t=${timestamp}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  console.log("Headers:", config.headers);
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.statusText}`);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error("Headers:", error.response.headers);
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  login: async (username: string, password: string): Promise<AuthTokens> => {
    try {
      const response = await axiosClient.post<AuthTokens>("/access-token", {
        username,
        password,
      });

      // Store token in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", response.data.access_token);
      }

      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("auth_token");
    }
    return false;
  },
};

// User API
export const userApi = {
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosClient.get<User>("/users/me");
    return response.data;
  },

  updateUser: async (userData: Partial<User>): Promise<User> => {
    const response = await axiosClient.put<User>("/users/me", userData);
    return response.data;
  },

  createUser: async (userData: {
    email: string;
    password: string;
    username: string;
  }): Promise<User> => {
    const response = await axiosClient.post<User>("/users/", userData);
    return response.data;
  },
};

// Quest API
export const questApi = {
  getQuests: async (filters?: {
    quest_type?: string;
    is_completed?: boolean;
    priority?: number;
    rarity?: string;
  }): Promise<Quest[]> => {
    const params = filters ? new URLSearchParams() : undefined;

    if (filters) {
      Object.entries(filters)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, value]) => value !== undefined)
        .forEach(([key, value]) => params?.append(key, String(value)));
    }

    const config: AxiosRequestConfig = {};
    if (params) {
      config.params = params;
    }

    const response = await axiosClient.get<Quest[]>("/quests", config);
    return response.data;
  },

  getQuest: async (questId: number): Promise<Quest> => {
    const response = await axiosClient.get<Quest>(`/quests/${questId}`);
    return response.data;
  },

  createQuest: async (quest: CreateQuestPayload): Promise<Quest> => {
    const response = await axiosClient.post<Quest>("/quests/", quest);
    return response.data;
  },

  updateQuest: async (
    questId: number,
    quest: UpdateQuestPayload
  ): Promise<Quest> => {
    const response = await axiosClient.put<Quest>(`/quests/${questId}`, quest);
    return response.data;
  },

  deleteQuest: async (questId: number): Promise<void> => {
    await axiosClient.delete(`/quests/${questId}`);
  },

  completeQuest: async (questId: number): Promise<Quest> => {
    return questApi.updateQuest(questId, { is_completed: true });
  },
  generateQuestFromAudio: async (
    audioBlob: Blob
  ): Promise<CreateQuestPayload> => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "voice-recording.webm");

      // Use a direct fetch call for handling FormData with files properly
      const token = localStorage.getItem("auth_token") || "";
      const apiUrl = "/api/v1/quests/voice-generation";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with correct boundary
        },
        body: formData,
        credentials: "same-origin",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API Error (${response.status}): ${errorText || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error in generateQuestFromAudio:", error);
      throw error;
    }
  },
};

// Achievement API
export const achievementApi = {
  getUserAchievements: async (): Promise<UserAchievement[]> => {
    const response = await axiosClient.get<UserAchievement[]>("/achievements/");
    return response.data;
  },

  getAvailableAchievements: async (): Promise<Achievement[]> => {
    const response = await axiosClient.get<Achievement[]>(
      "/achievements/available"
    );
    return response.data;
  },
};

export const api = {
  auth: authApi,
  user: userApi,
  quest: questApi,
  achievement: achievementApi,
};

export default api;
