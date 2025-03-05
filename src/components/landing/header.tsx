"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export const Header: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-200 dark:border-gray-800">
      <Link href="/" className="flex items-center justify-center">
        <Sparkles className="h-6 w-6 mr-2 text-blue-900 dark:text-blue-600" />
        <span className="font-bold text-xl text-gray-900 dark:text-gray-50">
          Quest Log
        </span>
      </Link>
      <nav className="ml-auto flex gap-4 items-center">
        {!isAuthenticated ? (
          <div>
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-gray-700 dark:text-gray-200 group cursor-pointer"
              >
                <span className="relative flex items-center">
                  Login
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </span>
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-blue-900 hover:bg-blue-950 dark:bg-blue-900 dark:hover:bg-blue-950 text-white group relative cursor-pointer">
                <span className="absolute -inset-0.5 bg-gradient-to-r from-blue-800 to-blue-700 dark:from-blue-800 dark:to-blue-700 rounded-md blur opacity-50 group-hover:opacity-75 transition duration-200"></span>
                <span className="relative flex items-center">
                  Sign Up
                  <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Button>
            </Link>
          </div>
        ) : (
          <Link href="/dashboard">
            <Button className="bg-blue-900 hover:bg-blue-950 dark:bg-blue-900 dark:hover:bg-blue-950 text-white group relative cursor-pointer">
              <span className="absolute -inset-0.5 bg-gradient-to-r from-blue-800 to-blue-700 dark:from-blue-800 dark:to-blue-700 rounded-md blur opacity-50 group-hover:opacity-75 transition duration-200"></span>
              <span className="relative flex items-center">
                Go to APP
                <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
};
