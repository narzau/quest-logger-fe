"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Sparkles className="h-5 w-5 mr-2 text-blue-900 dark:text-blue-600" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Quest Log
            </span>
          </div>

          <div className="flex space-x-6">
            <Link
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-600 text-sm"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-600 text-sm"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-600 text-sm"
            >
              Contact
            </Link>
          </div>

          <div className="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-500">
            © 2025 Quest Log
          </div>
        </div>
      </div>
    </footer>
  );
};
