"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, Loader2 } from "lucide-react";

// Component that uses useSearchParams
function SubscriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState<number>(5);
  
  // Get session ID from URL params
  const sessionId = searchParams.get("session_id");
  
  // Auto-redirect after 5 seconds
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      router.push("/dashboard");
    }
  }, [countdown, router]);
  
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Subscription Successful</CardTitle>
            <CardDescription>
              Thank you for subscribing to Quest Logger Premium!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">
              Your payment has been processed successfully and your account has been upgraded.
              You now have access to all premium features.
            </p>
            {sessionId && (
              <p className="text-xs text-muted-foreground text-center">
                Transaction ID: {sessionId}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/notes")}
            >
              Try Voice Notes
            </Button>
            <div className="text-center text-sm text-muted-foreground mt-2">
              Redirecting in {countdown} seconds...
              <Loader2 className="inline ml-2 h-3 w-3 animate-spin" />
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Need help with your subscription?
          </p>
          <Button 
            variant="link" 
            onClick={() => router.push("/contact-support")}
            className="text-sm flex items-center mx-auto"
          >
            Contact Support
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Loading fallback
function LoadingSubscription() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
      <div className="max-w-md w-full text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
        <p>Loading subscription details...</p>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<LoadingSubscription />}>
      <SubscriptionContent />
    </Suspense>
  );
} 