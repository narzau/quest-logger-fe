"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { isWithinInterval, startOfMonth, endOfMonth } from "date-fns";
import {
  TimeTrackingTable,
  TimeTrackingStats,
  CreateTimeEntryDialog,
  TimeTrackingActiveSession,
  TimeTrackingSettings,
  InvoiceSummaryDialog,
  TimeTrackingDetailedMetrics,
  ImportDataDialog,
  TimeTrackingMonthFilter,
  BatchPaymentStatus,
} from "@/components/time-tracking";
import { Button } from "@/components/ui/button";
import { Plus, Settings as SettingsIcon, FileSpreadsheet, Upload, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/settingsStore";

export default function TimeTrackingPage() {
  const { animationsEnabled } = useSettingsStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isBatchStatusOpen, setIsBatchStatusOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthFilter, setMonthFilter] = useState<{ start: Date; end: Date }>({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });
  
  const {
    entries,
    activeSession,
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

  // Filter entries by selected month and sort by start_time
  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    return entries
      .filter(entry => {
        // Parse date string as local date, not UTC
        // entry.date is "YYYY-MM-DD" format
        const [year, month, day] = entry.date.split('-').map(Number);
        const entryDate = new Date(year, month - 1, day); // month is 0-indexed in JS
        return isWithinInterval(entryDate, { start: monthFilter.start, end: monthFilter.end });
      })
      .sort((a, b) => {
        // Sort by start_time in descending order (most recent first)
        return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
      });
  }, [entries, monthFilter]);

  // Calculate stats for filtered month
  const filteredStats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Get start of week (Sunday)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    // Filter entries for today
    const todayEntries = filteredEntries.filter(e => e.date === todayStr);
    const todayHours = todayEntries.reduce((sum, e) => sum + (e.total_hours || 0), 0);
    const todayEarned = todayEntries.reduce((sum, e) => sum + (e.total_earned || 0), 0);
    
    // Filter entries for this week
    const weekEntries = filteredEntries.filter(e => {
      const [year, month, day] = e.date.split('-').map(Number);
      const entryDate = new Date(year, month - 1, day);
      return entryDate >= weekStart && entryDate <= today;
    });
    const weekHours = weekEntries.reduce((sum, e) => sum + (e.total_hours || 0), 0);
    const weekEarned = weekEntries.reduce((sum, e) => sum + (e.total_earned || 0), 0);
    
    // Month totals (all filtered entries)
    const monthHours = filteredEntries.reduce((sum, e) => sum + (e.total_hours || 0), 0);
    const monthEarned = filteredEntries.reduce((sum, e) => sum + (e.total_earned || 0), 0);
    
    return {
      total_hours_today: todayHours,
      total_earned_today: todayEarned,
      total_hours_week: weekHours,
      total_earned_week: weekEarned,
      total_hours_month: monthHours,
      total_earned_month: monthEarned,
      unpaid_amount: filteredEntries.filter(e => e.payment_status === "not_paid").reduce((sum, e) => sum + (e.total_earned || 0), 0),
      invoiced_amount: filteredEntries.filter(e => e.payment_status.includes("invoiced")).reduce((sum, e) => sum + (e.total_earned || 0), 0),
      paid_amount: filteredEntries.filter(e => e.payment_status === "paid").reduce((sum, e) => sum + (e.total_earned || 0), 0),
    };
  }, [filteredEntries]);

  const handleMonthChange = useCallback((start: Date, end: Date) => {
    setMonthFilter({ start, end });
  }, []);

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
                onClick={() => setIsImportDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsInvoiceDialogOpen(true)}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Invoice Summary
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsBatchStatusOpen(true)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Update Status
              </Button>
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

          {/* Month Filter */}
          <TimeTrackingMonthFilter
            currentMonth={currentMonth}
            onCurrentMonthChange={setCurrentMonth}
            onMonthChange={handleMonthChange}
          />

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
            <TimeTrackingStats stats={filteredStats} isLoading={isStatsLoading} />
          </motion.div>

          {/* Detailed Metrics */}
          <motion.div
            initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
            animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <TimeTrackingDetailedMetrics />
          </motion.div>

          {/* Time Entries Table */}
          <motion.div
            initial={animationsEnabled ? { opacity: 0, y: 20 } : false}
            animate={animationsEnabled ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <TimeTrackingTable entries={filteredEntries} isLoading={isLoading} />
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
          
          <InvoiceSummaryDialog
            open={isInvoiceDialogOpen}
            onOpenChange={setIsInvoiceDialogOpen}
          />
          
          <ImportDataDialog
            open={isImportDialogOpen}
            onOpenChange={setIsImportDialogOpen}
            defaultHourlyRate={settings?.default_hourly_rate || 50}
          />
          
          <BatchPaymentStatus
            open={isBatchStatusOpen}
            onOpenChange={setIsBatchStatusOpen}
          />
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}