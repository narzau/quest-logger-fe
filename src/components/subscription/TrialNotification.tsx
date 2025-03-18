"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/hooks/useSubscription";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TrialNotification() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState<boolean>(false);
  const { trialNotification } = useSubscription();

  useEffect(() => {
    // Check for stored dismissal in localStorage
    const checkDismissed = () => {
      if (typeof window !== "undefined") {
        const dismissedUntil = localStorage.getItem("trial_notification_dismissed_until");
        
        if (dismissedUntil) {
          const dismissedTime = parseInt(dismissedUntil);
          const now = new Date().getTime();
          
          // If the dismissal time has passed, reset it
          if (now > dismissedTime) {
            localStorage.removeItem("trial_notification_dismissed_until");
            setDismissed(false);
          } else {
            setDismissed(true);
          }
        } else {
          setDismissed(false);
        }
      }
    };
    
    checkDismissed();
  }, []);

  const handleDismiss = () => {
    // Dismiss for 24 hours
    if (typeof window !== "undefined") {
      const now = new Date().getTime();
      const dismissUntil = now + 24 * 60 * 60 * 1000; // 24 hours
      localStorage.setItem("trial_notification_dismissed_until", dismissUntil.toString());
    }
    
    setDismissed(true);
  };

  // Don't show anything while loading or if there's no notification or it's dismissed
  if (!trialNotification || !trialNotification.show || dismissed) {
    return null;
  }

  // Determine the variant based on the status
  const variant = trialNotification.type === "error" ? "destructive" : "warning";

  return (
    <Alert 
      variant={variant} 
      className="relative flex items-center justify-between"
    >
      <div className="flex gap-2 items-center">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {trialNotification.message}
        </AlertDescription>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          onClick={() => router.push("/subscription")} 
          variant={trialNotification.type === "error" ? "secondary" : "outline"}
          className="h-8"
        >
          {trialNotification.type === "error" ? "Subscribe Now" : "View Plans"}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
} 