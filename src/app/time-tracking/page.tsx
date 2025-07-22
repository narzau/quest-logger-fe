"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import {
  TimeTrackingTable,
  TimeTrackingStats,
  CreateTimeEntryDialog,
  TimeTrackingActiveSession,
  TimeTrackingSettings,
} from "@/components/time-tracking";
import { Button } from "@/components/ui/button";
import { Plus, Settings as SettingsIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";

export default function TimeTrackingPage() {
  const { animationsEnabled } = useSettingsStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const {
    entries,
    activeSession,
    stats,
    settings,
    isLoading,
    isStatsLoading,
    isSettingsLoading,
    startSession,
    stopSession,
    isStartingSession,
    isStoppingSession,
    refetchActiveSession,
  } = useTimeTracking();

  // Refetch active session periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeSession) {
        refetchActiveSession();
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [activeSession, refetchActiveSession]);

  const handleStartSession = () => {
    const defaultRate = settings?.default_hourly_rate || 50;
    startSession(defaultRate);
  };

  const handleStopSession = () => {
    if (activeSession) {
      stopSession(activeSession.id);
    }
  };

  // Show error state if there's an issue
  if (!entries && !isLoading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Unable to load time tracking data</h2>
              <p className="text-muted-foreground">Please check your connection and try again.</p>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Time Tracking</h1>
              <p className="text-muted-foreground mt-1">
                Track your working hours and earnings
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsSettingsOpen(true)}
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </div>

          {/* Active Session */}
          <TimeTrackingActiveSession
            activeSession={activeSession}
            onStart={handleStartSession}
            onStop={handleStopSession}
            isStarting={isStartingSession}
            isStopping={isStoppingSession}
          />

          {/* Statistics */}
          <motion.div
            initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
            animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.3 }}
          >
            <TimeTrackingStats stats={stats} isLoading={isStatsLoading} />
          </motion.div>

          {/* Time Entries Table */}
          <motion.div
            initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
            animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <TimeTrackingTable entries={entries} isLoading={isLoading} />
          </motion.div>

          {/* Dialogs */}
          <CreateTimeEntryDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            defaultHourlyRate={settings?.default_hourly_rate || 50}
          />
          
          <TimeTrackingSettings
            open={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
            settings={settings}
            isLoading={isSettingsLoading}
          />
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}