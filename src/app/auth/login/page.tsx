"use client";

import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { Sparkles, Moon, Sun, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/settingsStore";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const { darkMode, setDarkMode } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  // Handle initial mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Navigation bar */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        <div className="ml-auto flex gap-4 items-center">
          <Link href="/" className="flex items-center justify-center">
            <Sparkles className="h-6 w-6 mr-2 text-blue-900 dark:text-blue-600" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              ADHD Quest Tracker
            </span>
          </Link>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className="ml-4 rounded-full"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-blue-900" />
          )}
        </Button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <LoginForm />
      </div>
    </div>
  );
}
