"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AchievementUnlockedDialog } from "@/components/achievements/achievement-unlocked-dialog";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <DashboardOverview />
        <AchievementUnlockedDialog />
      </DashboardLayout>
    </AuthGuard>
  );
}
