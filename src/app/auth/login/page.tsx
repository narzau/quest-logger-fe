"use client";

import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);

  // Handle initial mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      {/* Navigation bar */}
      <header className="border-b border-blue-900/30 backdrop-blur-md bg-[#0f172a]/80 fixed w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/"
              className="flex items-center text-slate-300 hover:text-blue-400"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                QuestLog
              </span>
            </div>
            <div className="w-24">{/* Empty div to balance the header */}</div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <motion.div
        className="flex-1 flex items-center justify-center p-4 py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-[#0f172a] radial-gradient z-0"></div>
        <div className="relative z-10 w-full">
          <LoginForm />
        </div>
      </motion.div>

      {/* Add the CSS for gradient backgrounds */}
      <style jsx global>{`
        .radial-gradient {
          background-image: radial-gradient(
            circle at 50% 50%,
            rgba(56, 189, 248, 0.1) 0%,
            rgba(56, 189, 248, 0) 50%
          );
        }
      `}</style>
    </div>
  );
}
