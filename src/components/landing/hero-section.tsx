"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AppDemoCard } from "@/components/landing/app-demo-card";

export const HeroSection: React.FC = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-950">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900 dark:text-white">
                Turn Your Tasks Into{" "}
                <span className="text-blue-900 dark:text-blue-600">
                  Epic Quests
                </span>
              </h1>
              <p className="max-w-[600px] text-gray-700 dark:text-gray-300 md:text-xl">
                A gamified task tracker specifically designed for people with
                ADHD. Transform your daily to-dos into an RPG adventure with
                rewards, levels, and achievements.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="w-full bg-blue-900 hover:bg-blue-950 dark:bg-blue-900 dark:hover:bg-blue-950 relative group cursor-pointer"
                >
                  <span className="absolute -inset-0.5 bg-gradient-to-r from-blue-800 to-blue-700 dark:from-blue-800 dark:to-blue-700 rounded-md blur opacity-50 group-hover:opacity-75 transition duration-200"></span>
                  <span className="relative flex items-center">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-blue-800 text-blue-800 dark:border-blue-700 dark:text-blue-600 group cursor-pointer"
                >
                  <span className="relative flex items-center">
                    Login
                    <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <AppDemoCard />
          </div>
        </div>
      </div>
    </section>
  );
};
