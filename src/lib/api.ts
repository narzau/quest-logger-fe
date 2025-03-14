// src/lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { AuthTokens, User } from "@/types/user";
import { Quest, CreateQuestPayload, UpdateQuestPayload } from "@/types/quest";
import { Achievement, UserAchievement } from "@/types/achievement";
import {
  GoogleCalendarStatusResponse,
  ListGoogleCalendarsResponse,
  SelectGoogleCalendarResponse,
  DisconnectResponse,
  GoogleAuthUrlResponse,
} from "@/types/google-calendar";

// Create a base axios instance with common configuration
const axiosClient: AxiosInstance = axios.create({
  baseURL:
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1",
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
  login: async (email: string, password: string): Promise<AuthTokens> => {
    try {
      const response = await axiosClient.post<AuthTokens>("/access-token", {
        email,
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
  createQuestFromAudio: async (audioBlob: Blob): Promise<Quest> => {
    const formData = new FormData();
    formData.append("audio_file", audioBlob, "voice-recording.webm");
    formData.append("language", "multi");

    const response = await axiosClient.post<Quest>(
      "/quests/voice-generation/auto",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  },
  suggestQuestFromAudio: async (
    audioBlob: Blob
  ): Promise<CreateQuestPayload> => {
    const formData = new FormData();
    formData.append("audio_file", audioBlob, "voice-recording.webm");
    formData.append("language", "multi");

    const response = await axiosClient.post<CreateQuestPayload>(
      "/quests/voice-generation/suggest",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
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

// Google Calendar API
export const googleCalendarApi = {
  getAuthUrl: async (): Promise<GoogleAuthUrlResponse> => {
    const response = await axiosClient.get<GoogleAuthUrlResponse>(
      "/auth/google/authorize"
    );
    console.log("Auth URL response:", response.data);
    return response.data;
  },

  getStatus: async (): Promise<GoogleCalendarStatusResponse> => {
    const response = await axiosClient.get<GoogleCalendarStatusResponse>(
      "/auth/google/status"
    );
    return response.data;
  },

  disconnect: async (): Promise<DisconnectResponse> => {
    const response = await axiosClient.delete<DisconnectResponse>(
      "/auth/google/disconnect"
    );
    return response.data;
  },

  getCalendars: async (): Promise<ListGoogleCalendarsResponse> => {
    const response = await axiosClient.get<ListGoogleCalendarsResponse>(
      "/auth/google/calendars"
    );
    return response.data;
  },

  selectCalendar: async (
    calendarId: string
  ): Promise<SelectGoogleCalendarResponse> => {
    const response = await axiosClient.post<SelectGoogleCalendarResponse>(
      "/auth/google/calendars/select",
      {
        calendar_id: calendarId,
      }
    );
    return response.data;
  },
};

export const api = {
  auth: authApi,
  user: userApi,
  quest: questApi,
  achievement: achievementApi,
  googleCalendar: googleCalendarApi,
};

export default api;
