"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";

export default function SubscriptionCancelPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(8);
  
  // Auto-redirect after 8 seconds
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      router.push("/subscription");
    }
  }, [countdown, router]);
  
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">Subscription Canceled</CardTitle>
            <CardDescription>
              Your subscription process was canceled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">
              The subscription process was canceled, and no charges were made to your account.
              You can try again whenever you&apos;re ready.
            </p>
            <div className="p-4 border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50 rounded-md text-amber-800 dark:text-amber-200 text-sm">
              <p>
                If you encountered any issues during checkout, please contact our support team.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full"
              onClick={() => router.push("/subscription")}
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard
            </Button>
            <div className="text-center text-sm text-muted-foreground mt-2">
              Redirecting in {countdown} seconds...
              <Loader2 className="inline ml-2 h-3 w-3 animate-spin" />
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center">
          <Button 
            variant="link" 
            onClick={() => router.push("/subscription")}
            className="text-sm flex items-center mx-auto"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Return to subscription page
          </Button>
        </div>
      </div>
    </div>
  );
}