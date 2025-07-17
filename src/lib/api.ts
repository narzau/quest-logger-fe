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
import {
  Note,
  NoteCreate,
  NoteUpdate,
  NoteList,
  VoiceNoteCreate,
  ShareResponse,
} from "@/types/note";
import {
  SubscriptionStatusResponse,
  PricingResponse,
  PaymentHistoryResponse,
  TrialNotificationResponse,
  BillingCycle,
  SubscriptionCreateResponse,
  SubscriptionUpdateResponse,
} from "@/types/subscription";

// Create a base axios instance with common configuration
const apiUrl =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + "/api/v1";
console.log("apiUrl", apiUrl);
const axiosClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
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

// Notes API
export const noteApi = {
  createNote: async (data: NoteCreate): Promise<Note> => {
    const response = await axiosClient.post<Note>("/notes", data);
    return response.data;
  },
  
  getNote: async (noteId: number): Promise<Note> => {
    const response = await axiosClient.get<Note>(`/notes/${noteId}`);
    return response.data;
  },
  
  getSharedNote: async (shareId: string): Promise<Note> => {
    const response = await axiosClient.get<Note>(`/notes/shared/${shareId}`);
    return response.data;
  },
  
  getNotes: async (
    skip: number = 0,
    limit: number = 10,
    folder?: string,
    tag?: string,
    search?: string,
    sortBy: string = "updated_at",
    sortOrder: string = "desc"
  ): Promise<NoteList> => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      sort_by: sortBy,
      sort_order: sortOrder,
    });
    
    if (folder) params.append("folder", folder);
    if (tag) params.append("tag", tag);
    if (search) params.append("search", search);
    
    const response = await axiosClient.get<NoteList>(`/notes?${params.toString()}`);
    return response.data;
  },
  
  updateNote: async (noteId: number, data: NoteUpdate): Promise<Note> => {
    const response = await axiosClient.put<Note>(`/notes/${noteId}`, data);
    return response.data;
  },
  
  deleteNote: async (noteId: number): Promise<void> => {
    await axiosClient.delete(`/notes/${noteId}`);
  },
  
  getFolders: async (): Promise<string[]> => {
    const response = await axiosClient.get<{ folders: string[] }>("/notes/folders/list");
    return response.data.folders || [];
  },
  
  getTags: async (): Promise<string[]> => {
    const response = await axiosClient.get<{ tags: string[] }>("/notes/tags/list");
    return response.data.tags || [];
  },
  
  shareNote: async (noteId: number): Promise<ShareResponse> => {
    const response = await axiosClient.post<ShareResponse>(`/notes/${noteId}/share`);
    return response.data;
  },
  
  unshareNote: async (noteId: number): Promise<void> => {
    await axiosClient.delete(`/notes/${noteId}/share`);
  },
  
  createVoiceNote: async (
    audioFile: File,
    data: VoiceNoteCreate
  ): Promise<Note> => {
    const formData = new FormData();
    formData.append("audio_file", audioFile);
    
    if (data.folder) formData.append("folder", data.folder);
    if (data.note_style) formData.append("note_style", data.note_style);
    if (data.tags && data.tags.length > 0) formData.append("tags", data.tags.join(","));
    
    const response = await axiosClient.post<Note>("/notes/voice", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  
  processNoteAudio: async (noteId: number): Promise<{ status: string }> => {
    const response = await axiosClient.post<{ status: string }>(`/notes/${noteId}/process`);
    return response.data;
  },
  
  exportNote: async (noteId: number, format: string = "text"): Promise<Blob> => {
    const response = await axiosClient.get(`/notes/${noteId}/export?format=${format}`, {
      responseType: "blob",
    });
    return response.data;
  },
  
  appendAudioToNote: async (noteId: number, audioFile: File): Promise<Note> => {
    const formData = new FormData();
    formData.append("file", audioFile);
    
    const response = await axiosClient.post<Note>(`/notes/${noteId}/append-audio`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// Subscription API
export const subscriptionApi = {
  getStatus: async (): Promise<SubscriptionStatusResponse> => {
    const response = await axiosClient.get<SubscriptionStatusResponse>("/subscription/status");
    return response.data;
  },

  getPlans: async (): Promise<PricingResponse> => {
    const response = await axiosClient.get<PricingResponse>("/subscription/pricing");
    return response.data;
  },

  subscribe: async (planId: string): Promise<SubscriptionCreateResponse> => {
    const response = await axiosClient.post<SubscriptionCreateResponse>("/subscription/subscribe", { planId });
    return response.data;
  },

  unsubscribe: async (): Promise<SubscriptionUpdateResponse> => {
    const response = await axiosClient.post<SubscriptionUpdateResponse>("/subscription/unsubscribe");
    return response.data;
  },

  changeBillingCycle: async (cycle: BillingCycle): Promise<SubscriptionUpdateResponse> => {
    const response = await axiosClient.post<SubscriptionUpdateResponse>("/subscription/billing-cycle", { new_cycle: cycle });
    return response.data;
  },

  getPaymentHistory: async (limit: number = 10): Promise<PaymentHistoryResponse> => {
    const response = await axiosClient.get<PaymentHistoryResponse>(`/subscription/payment-history?limit=${limit}`);
    return response.data;
  },

  getTrialNotification: async (): Promise<TrialNotificationResponse> => {
    const response = await axiosClient.get<TrialNotificationResponse>("/subscription/trial-notification");
    return response.data;
  },
};

export const api = {
  auth: authApi,
  user: userApi,
  quest: questApi,
  achievement: achievementApi,
  googleCalendar: googleCalendarApi,
  note: noteApi,
  subscription: subscriptionApi,
};

export default api;
