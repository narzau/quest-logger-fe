import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  CreateTimeEntryPayload, 
  UpdateTimeEntryPayload,
  PaymentStatus,
  TimeEntry 
} from "@/types/time-tracking";
import { toast } from "sonner";

export function useTimeTracking(filters?: {
  start_date?: string;
  end_date?: string;
  payment_status?: PaymentStatus;
  skip?: number;
  limit?: number;
}) {
  const queryClient = useQueryClient();
  
  // Get time entries
  const entriesQuery = useQuery({
    queryKey: ["timeEntries", filters],
    queryFn: async () => {
      // Add a high limit to ensure we get all entries
      const paramsWithLimit = { ...filters, limit: 1000 };
      const response = await api.timeTracking.getTimeEntries(paramsWithLimit);
      console.log("Time entries API response:", response);
      return response;
    },
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Get active session
  const activeSessionQuery = useQuery({
    queryKey: ["activeSession"],
    queryFn: api.timeTracking.getActiveSession,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds to update ongoing session
  });
  
  // Get statistics
  const statsQuery = useQuery({
    queryKey: ["timeTrackingStats"],
    queryFn: () => api.timeTracking.getStats(),
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Get settings
  const settingsQuery = useQuery({
    queryKey: ["timeTrackingSettings"],
    queryFn: api.timeTracking.getSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Create time entry
  const createEntryMutation = useMutation({
    mutationFn: (entry: CreateTimeEntryPayload) => api.timeTracking.createTimeEntry(entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      queryClient.invalidateQueries({ queryKey: ["timeTrackingStats"] });
      toast.success("Time entry created successfully");
    },
    onError: () => {
      toast.error("Failed to create time entry");
    },
  });
  
  // Update time entry
  const updateEntryMutation = useMutation({
    mutationFn: ({ entryId, data }: { entryId: number; data: UpdateTimeEntryPayload }) => 
      api.timeTracking.updateTimeEntry(entryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      queryClient.invalidateQueries({ queryKey: ["timeTrackingStats"] });
      toast.success("Time entry updated successfully");
    },
    onError: () => {
      toast.error("Failed to update time entry");
    },
  });
  
  // Delete time entry
  const deleteEntryMutation = useMutation({
    mutationFn: (entryId: number) => api.timeTracking.deleteTimeEntry(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      queryClient.invalidateQueries({ queryKey: ["timeTrackingStats"] });
      toast.success("Time entry deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete time entry");
    },
  });
  
  // Start session
  const startSessionMutation = useMutation({
    mutationFn: ({ hourlyRate, timezone }: { hourlyRate: number; timezone?: string }) => 
      api.timeTracking.startSession(hourlyRate, timezone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeSession"] });
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      toast.success("Time tracking started");
    },
    onError: () => {
      toast.error("Failed to start time tracking");
    },
  });
  
  // Stop session
  const stopSessionMutation = useMutation({
    mutationFn: (entryId: number) => api.timeTracking.stopSession(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeSession"] });
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      queryClient.invalidateQueries({ queryKey: ["timeTrackingStats"] });
      toast.success("Time tracking stopped");
    },
    onError: () => {
      toast.error("Failed to stop time tracking");
    },
  });
  
  // Update settings
  const updateSettingsMutation = useMutation({
    mutationFn: (settings: { default_hourly_rate?: number; currency?: string }) => 
      api.timeTracking.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeTrackingSettings"] });
      toast.success("Settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update settings");
    },
  });
  
  // Batch update payment status
  const batchUpdatePaymentStatusMutation = useMutation({
    mutationFn: ({ entryIds, paymentStatus }: { entryIds: number[]; paymentStatus: PaymentStatus }) =>
      api.timeTracking.batchUpdatePaymentStatus({
        entry_ids: entryIds,
        payment_status: paymentStatus,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
      queryClient.invalidateQueries({ queryKey: ["timeTrackingStats"] });
      toast.success("Payment status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update payment status");
    },
  });
  
  // Handle different response formats from backend
  type PaginatedResponse = { items?: TimeEntry[]; results?: TimeEntry[] };
  const entriesData = entriesQuery.data as TimeEntry[] | PaginatedResponse | undefined;
  const entries: TimeEntry[] = Array.isArray(entriesData) 
    ? entriesData 
    : (entriesData as PaginatedResponse)?.items || (entriesData as PaginatedResponse)?.results || [];

  return {
    // Data
    entries,
    activeSession: activeSessionQuery.data,
    stats: statsQuery.data,
    settings: settingsQuery.data,
    
    // Loading states
    isLoading: entriesQuery.isLoading,
    isActiveSessionLoading: activeSessionQuery.isLoading,
    isStatsLoading: statsQuery.isLoading,
    isSettingsLoading: settingsQuery.isLoading,
    
    // Error states
    error: entriesQuery.error,
    activeSessionError: activeSessionQuery.error,
    statsError: statsQuery.error,
    settingsError: settingsQuery.error,
    
    // Actions
    createEntry: createEntryMutation.mutate,
    updateEntry: updateEntryMutation.mutate,
    deleteEntry: deleteEntryMutation.mutate,
    startSession: (hourlyRate: number) => startSessionMutation.mutate({ 
      hourlyRate, 
      timezone: settingsQuery.data?.timezone 
    }),
    stopSession: stopSessionMutation.mutate,
    updateSettings: updateSettingsMutation.mutate,
    batchUpdatePaymentStatus: batchUpdatePaymentStatusMutation.mutate,
    
    // Action loading states
    isCreating: createEntryMutation.isPending,
    isUpdating: updateEntryMutation.isPending,
    isDeleting: deleteEntryMutation.isPending,
    isStartingSession: startSessionMutation.isPending,
    isStoppingSession: stopSessionMutation.isPending,
    isUpdatingSettings: updateSettingsMutation.isPending,
    isBatchUpdating: batchUpdatePaymentStatusMutation.isPending,
    
    // Refetch functions
    refetchEntries: () => queryClient.invalidateQueries({ queryKey: ["timeEntries"] }),
    refetchStats: () => queryClient.invalidateQueries({ queryKey: ["timeTrackingStats"] }),
    refetchActiveSession: () => queryClient.invalidateQueries({ queryKey: ["activeSession"] }),
  };
} 