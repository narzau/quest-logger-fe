// src/hooks/useGoogleCalendar.ts
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  GoogleCalendarStatusResponse,
  ListGoogleCalendarsResponse,
} from "@/types/google-calendar";

export function useGoogleCalendar() {
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  // Get connection status
  const statusQuery = useQuery({
    queryKey: ["googleCalendarStatus"],
    queryFn: api.googleCalendar.getStatus,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Get available calendars
  const calendarsQuery = useQuery({
    queryKey: ["googleCalendars"],
    queryFn: api.googleCalendar.getCalendars,
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    // Only fetch calendars if connected
    enabled: statusQuery.data?.connected === true,
  });

  // Connect to Google Calendar
  const connectMutation = useMutation({
    mutationFn: async () => {
      setIsConnecting(true);
      try {
        const response = await api.googleCalendar.getAuthUrl();
        console.log("Received auth response:", response);
        return response;
      } catch (error) {
        console.error("Failed to get auth URL:", error);
        toast.error("Failed to start Google authentication");
        throw error;
      }
    },
    onSuccess: (data) => {
      if (data?.authorization_url) {
        // Store the auth URL
        setAuthUrl(data.authorization_url);

        // Open in a new tab
        const newWindow = window.open(data.authorization_url, "_blank");

        // Check if window was blocked by popup blocker
        if (
          !newWindow ||
          newWindow.closed ||
          typeof newWindow.closed === "undefined"
        ) {
          toast.error(
            "Popup blocked! Please allow popups for this site or use the direct link to connect with Google Calendar."
          );
        } else {
          toast.info(
            "Please complete Google authentication in the new window",
            {
              description:
                "You'll need to allow access to your Google Calendar",
              duration: 10000,
            }
          );
        }
      } else {
        console.error("Invalid response format:", data);
        toast.error("No authorization URL received from server");
      }
    },
    onError: () => {
      toast.error("Failed to connect to Google Calendar");
      setIsConnecting(false);
    },
  });

  // Disconnect from Google Calendar
  const disconnectMutation = useMutation({
    mutationFn: api.googleCalendar.disconnect,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["googleCalendarStatus"] });
      queryClient.invalidateQueries({ queryKey: ["googleCalendars"] });
      toast.success(
        data.message || "Google Calendar disconnected successfully"
      );
    },
    onError: (error: Error) => {
      toast.error(`Failed to disconnect: ${error.message}`);
    },
  });

  // Select a calendar
  const selectCalendarMutation = useMutation({
    mutationFn: (calendarId: string) =>
      api.googleCalendar.selectCalendar(calendarId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["googleCalendars"] });
      toast.success(data.message || "Calendar selected successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to select calendar: ${error.message}`);
    },
  });

  // Setup polling for connection status when we're in connecting state
  useEffect(() => {
    let pollInterval: number | null = null;

    if (isConnecting) {
      // Start polling every 3 seconds
      pollInterval = window.setInterval(() => {
        console.log("Polling for Google Calendar connection status...");
        queryClient.invalidateQueries({ queryKey: ["googleCalendarStatus"] });
      }, 2000);

      // Setup cleanup
      return () => {
        if (pollInterval !== null) {
          window.clearInterval(pollInterval);
        }
      };
    }
  }, [isConnecting, queryClient]);

  // Reset connecting state when connection is detected
  useEffect(() => {
    if (isConnecting && statusQuery.data?.connected) {
      console.log("Google Calendar connection detected!");
      setIsConnecting(false);
      setAuthUrl(null);
      toast.success("Google Calendar connected successfully!");

      // Also refresh calendars data
      queryClient.invalidateQueries({ queryKey: ["googleCalendars"] });
    }
  }, [isConnecting, statusQuery.data?.connected, queryClient]);

  return {
    // States
    status: statusQuery.data as GoogleCalendarStatusResponse | undefined,
    calendars: calendarsQuery.data as ListGoogleCalendarsResponse | undefined,
    isConnected: statusQuery.data?.connected === true,
    isConnecting,
    authUrl,

    // Loading states
    isStatusLoading: statusQuery.isLoading,
    isCalendarsLoading: calendarsQuery.isLoading,
    isDisconnecting: disconnectMutation.isPending,
    isSelectingCalendar: selectCalendarMutation.isPending,

    // Actions
    connect: connectMutation.mutate,
    disconnect: disconnectMutation.mutate,
    selectCalendar: selectCalendarMutation.mutate,
    refreshStatus: () =>
      queryClient.invalidateQueries({ queryKey: ["googleCalendarStatus"] }),
    clearAuthUrl: () => setAuthUrl(null),
    setIsConnecting: (connecting: boolean) => setIsConnecting(connecting),

    // Errors
    error:
      statusQuery.error ||
      calendarsQuery.error ||
      connectMutation.error ||
      disconnectMutation.error ||
      selectCalendarMutation.error,
  };
}
