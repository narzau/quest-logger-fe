"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection: React.FC = () => {
  return (
    <section className="w-full py-12 md:py-24 bg-blue-900 dark:bg-blue-950 text-white">
      <div className="container px-4 md:px-6 mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Level Up Your Productivity?
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-blue-100">
          Join thousands of users who have transformed their task management
          experience with our gamified approach.
        </p>
        <Link href="/auth/register">
          <Button
            size="lg"
            className="bg-white text-blue-900 hover:bg-gray-100 relative group cursor-pointer"
          >
            <span className="absolute -inset-0.5 bg-gradient-to-r from-blue-300 to-white rounded-md blur opacity-50 group-hover:opacity-75 transition duration-200"></span>
            <span className="relative flex items-center">
              Create Your Account
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </Button>
        </Link>
      </div>
    </section>
  );
};
