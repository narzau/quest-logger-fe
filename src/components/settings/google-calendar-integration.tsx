// src/components/google-calendar-integration.tsx
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Loader2, Trash, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function GoogleCalendarIntegration() {
  const {
    status,
    calendars,
    isConnected,
    isConnecting,
    isStatusLoading,
    isCalendarsLoading,
    isDisconnecting,
    isSelectingCalendar,
    connect,
    disconnect,
    selectCalendar,
    authUrl,
    clearAuthUrl,
    setIsConnecting,
  } = useGoogleCalendar();

  const handleConnect = async () => {
    try {
      toast.info("Preparing Google authentication...");
      connect();
    } catch (error) {
      console.error("Failed to initiate Google auth:", error);
      toast.error(
        "Failed to initiate Google authentication. Please try again."
      );
    }
  };

  const handleDisconnect = () => {
    if (
      window.confirm("Are you sure you want to disconnect Google Calendar?")
    ) {
      disconnect();
    }
  };

  const handleSelectCalendar = (calendarId: string) => {
    selectCalendar(calendarId);
  };

  if (isStatusLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            Google Calendar Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
            Google Calendar Integration
          </CardTitle>
          <CardDescription>
            Sync your quests with your Google Calendar events
          </CardDescription>
        </div>
        {isConnected && (
          <Badge
            variant="outline"
            className="text-secondary border-secondary p-1 px-2 text-sm"
          >
            <Check className="text-green-500 " />
            Connected
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <>
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Connected to Google Calendar
                </p>
                {status?.email && (
                  <p className="text-xs text-muted-foreground">
                    {status.email}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="text-accent border-primary "
              >
                {isDisconnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4  text-red-500" />
                )}
                <span className="">Disconnect</span>
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Select Calendar</p>
              {isCalendarsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Select
                  value={calendars?.selected_calendar_id || ""}
                  onValueChange={handleSelectCalendar}
                  disabled={isSelectingCalendar || !calendars?.calendars.length}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a calendar" />
                  </SelectTrigger>
                  <SelectContent>
                    {calendars?.calendars.map((calendar) => (
                      <SelectItem key={calendar.id} value={calendar.id}>
                        {calendar.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <p className="text-xs text-muted-foreground">
                Choose which calendar to sync your quests with
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <p className="text-sm text-center text-muted-foreground mb-2">
              Connect your Google Calendar to sync your quests with your
              calendar events
            </p>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full max-w-xs"
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ExternalLink className="h-4 w-4 mr-2" />
              )}
              Connect with Google
            </Button>

            {authUrl && (
              <div className="mt-4 text-center w-full">
                <p className="text-xs text-amber-600 mb-2">
                  If the authentication window didn&apos;t open, try the direct
                  link:
                </p>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(authUrl, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Open Auth Link
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearAuthUrl}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {isConnecting && (
              <div className="mt-4 text-center w-full">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Waiting for authentication...</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setIsConnecting(false);
                    clearAuthUrl();
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
