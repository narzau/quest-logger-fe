"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { LoadingScreen } from "@/components/ui/loading-screen";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Skip auth check for auth pages
    if (pathname.startsWith("/auth/") || pathname === "/") {
      setIsChecking(false);
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, pathname, router]);

  if (isChecking) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
