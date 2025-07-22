"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimeEntry } from "@/types/time-tracking";
import { Play, Square, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { formatInTimezone } from "@/lib/timezone-utils";
import { useTimeTracking } from "@/hooks/useTimeTracking";

interface TimeTrackingActiveSessionProps {
  activeSession: TimeEntry | null | undefined;
  onStart: () => void;
  onStop: () => void;
  isStarting: boolean;
  isStopping: boolean;
}

export function TimeTrackingActiveSession({
  activeSession,
  onStart,
  onStop,
  isStarting,
  isStopping,
}: TimeTrackingActiveSessionProps) {
  const [duration, setDuration] = useState<string>("00:00:00");
  const [earned, setEarned] = useState<number>(0);
  const { settings } = useTimeTracking();
  const timezone = settings?.timezone || "UTC-3";

  useEffect(() => {
    if (!activeSession?.start_time) return;
    
    console.log("Active session effect triggered:", activeSession);

    const updateDuration = () => {
      try {
        // Parse the start time - if no timezone indicator, assume it's already UTC
        let start: Date;
        const hasTimezone = activeSession.start_time.endsWith('Z') || 
                           activeSession.start_time.match(/[+-]\d{2}:\d{2}$/) || 
                           activeSession.start_time.match(/[+-]\d{4}$/);
        
        if (hasTimezone) {
          // Has timezone info, parse normally
          start = new Date(activeSession.start_time);
        } else {
          // No timezone info, assume it's UTC and add Z
          start = new Date(activeSession.start_time + 'Z');
        }
        const now = new Date();
        
        // Check if dates are valid
        if (isNaN(start.getTime()) || isNaN(now.getTime())) {
          console.error("Invalid date in active session:", {
            start_time: activeSession.start_time,
            parsed_start: start.toString(),
            now: now.toString()
          });
          return;
        }
        
        // Calculate difference in milliseconds
        const diffMs = now.getTime() - start.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        
        // Log every 10 seconds for debugging
        if (diffSeconds % 10 === 0) {
          console.log("Active session timer update:", {
            start_time: activeSession.start_time,
            start: start.toISOString(),
            now: now.toISOString(),
            diff_ms: diffMs,
            diff_seconds: diffSeconds
          });
        }
        
        // Ensure positive difference
        if (diffSeconds < 0) {
          console.warn("Negative time difference, using 0");
          setDuration("00:00:00");
          setEarned(0);
          return;
        }
        
        const hours = Math.floor(diffSeconds / 3600);
        const minutes = Math.floor((diffSeconds % 3600) / 60);
        const seconds = diffSeconds % 60;
        
        const newDuration = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        
        setDuration(newDuration);
        
        // Calculate earned amount
        const hoursWorked = diffSeconds / 3600;
        const newEarned = hoursWorked * activeSession.hourly_rate;
        setEarned(newEarned);
        
      } catch (error) {
        console.error("Error updating duration:", error, activeSession);
      }
    };

    updateDuration();
    const interval = setInterval(updateDuration, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  return (
    <Card className={cn(
      "border-2 transition-colors",
      activeSession ? "border-green-500/50 bg-green-500/5" : "border-border"
    )}>
      <CardContent className="py-6">
        {activeSession ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Active Session • Started at {formatInTimezone(activeSession.start_time, timezone, "HH:mm")}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-mono font-semibold">
                      {duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <span className="text-xl font-semibold">
                      ${earned.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      @ ${activeSession.hourly_rate}/hr
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={onStop}
                disabled={isStopping}
                variant="destructive"
                size="lg"
                className="gap-2"
              >
                <Square className="h-4 w-4" />
                {isStopping ? "Stopping..." : "Stop"}
              </Button>
            </div>
            
            <motion.div
              className="h-1 bg-green-500/20 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">No Active Session</p>
              <p className="text-lg">Click start to begin tracking time</p>
            </div>
            
            <Button
              onClick={onStart}
              disabled={isStarting}
              size="lg"
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {isStarting ? "Starting..." : "Start Session"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 