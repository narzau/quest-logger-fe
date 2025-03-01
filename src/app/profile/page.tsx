"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { UserProfile } from "@/components/profile/user-profile";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          </div>

          <UserProfile />
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
