"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { QuestPageDesktopContent } from "@/components/quests/quest-page-desktop-content";
import { QuestPageMobileContent } from "@/components/quests/quest-page-mobile-content";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function QuestsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <Suspense fallback={<QuestManagerSkeleton />}>
          <MobileDetector />
        </Suspense>
      </DashboardLayout>
    </AuthGuard>
  );
}

// Component to detect mobile/desktop
function MobileDetector() {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Tailwind's md breakpoint
  const [isMounted, setIsMounted] = useState(false);

  // Prevent SSR mismatch
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return isMobile ? <QuestPageMobileContent /> : <QuestPageDesktopContent />;
}
function QuestManagerSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-5 w-[150px]" />
        </div>
        <Skeleton className="h-9 w-[130px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[calc(100vh-13rem)]">
        <Skeleton className="h-full md:col-span-1 lg:col-span-1" />
        <Skeleton className="h-full md:col-span-2 lg:col-span-3" />
      </div>
    </div>
  );
}
