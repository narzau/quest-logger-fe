"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  Calendar,
  BarChart,
  Award,
  Mic,
  ArrowRight,
  ChevronDown,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

// Fade in animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Create a component for the grid pattern background
const GridBackground = () => (
  <div className="absolute inset-0">
    <svg
      className="absolute left-0 top-0 opacity-20"
      width="100%"
      height="100%"
      viewBox="0 0 800 800"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(96, 165, 250, 0.2)"
            strokeWidth="1"
          ></path>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  </div>
);

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  // Handle initial mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock stats for demonstration - in a real app, these would be fetched from an API
  const stats = {
    activeUsers: 2847,
    tasksCompleted: 124568,
    totalXpEarned: 3842156,
    achievementsUnlocked: 17829,
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-200">
      {/* Header */}
      <header className="border-b border-blue-900/30 backdrop-blur-md bg-[#0f172a]/80 fixed w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="QuestLog Logo"
                width={64}
                height={64}
                className=""
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                QuestLog
              </span>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-200 hover:text-blue-400 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop menu */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-slate-300 hover:text-blue-400 font-medium"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-slate-300 hover:text-blue-400 font-medium"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-slate-300 hover:text-blue-400 font-medium"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="text-slate-300 hover:text-blue-400 font-medium"
              >
                FAQ
              </a>
            </nav>
            {isAuthenticated ? (
              <div className="hidden md:flex space-x-4">
                <a
                  href="/dashboard"
                  className="px-4 py-2 text-center rounded-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium  flex items-center justify-center"
                >
                  GO TO APP
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            ) : (
              <div className="hidden md:flex space-x-4">
                <a
                  href="/auth/login"
                  className="px-4 py-2 text-slate-300 hover:text-blue-400"
                >
                  Login
                </a>
                <a
                  href="/auth/register"
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#131c33] border-b border-blue-900/30">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400"
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400"
              >
                FAQ
              </a>
              <div className="pt-4 flex space-x-4 px-3">
                <a
                  href="/auth/login"
                  className="px-4 py-2 text-slate-300 hover:text-blue-400"
                >
                  Login
                </a>
                <a
                  href="/auth/register"
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="absolute inset-0 bg-[#0f172a] radial-gradient"></div>
          <GridBackground />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center">
              <motion.div
                className="lg:w-1/2 lg:pr-12"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Level Up
                  </span>{" "}
                  Your <br />
                  Productivity Game
                </h1>
                <p className="text-xl text-slate-400 mb-8">
                  A gamified task manager designed specifically for people with
                  ADHD. Turn your to-dos into epic quests and level up your
                  life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/auth/register"
                    className="px-8 py-3 text-center rounded-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium text-lg flex items-center justify-center"
                  >
                    Start Your Adventure
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                  <a
                    href="#how-it-works"
                    className="px-8 py-3 text-center rounded-md border border-blue-500/30 hover:border-blue-400 text-slate-300 font-medium text-lg flex items-center justify-center"
                  >
                    See How It Works
                    <ChevronDown className="ml-2 h-5 w-5" />
                  </a>
                </div>

                <div className="mt-8 flex items-center text-slate-400">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-xs text-white font-bold"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="ml-4">
                    <p>
                      Join 2,800+ users who are leveling up their productivity
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="lg:w-1/2 mt-12 lg:mt-0"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      delay: 0.3,
                    },
                  },
                }}
              >
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur-lg opacity-75"></div>
                  <div className="relative bg-[#131c33] p-4 rounded-lg shadow-xl border border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Image
                          src="/logo.png"
                          alt="QuestLog Logo"
                          width={64}
                          height={64}
                          className=""
                        />
                        <span className="font-bold text-slate-200">
                          Daily Quests
                        </span>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-blue-900/30 text-blue-300">
                        Level 7 Adventurer
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {[
                        {
                          title: "Complete project proposal",
                          rarity: "epic",
                          completed: true,
                        },
                        {
                          title: "Review team documentation",
                          rarity: "rare",
                          completed: true,
                        },
                        {
                          title: "Send weekly update email",
                          rarity: "uncommon",
                          completed: false,
                        },
                        {
                          title: "Prepare for tomorrow's meeting",
                          rarity: "legendary",
                          completed: false,
                        },
                      ].map((quest, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-md flex items-center ${
                            quest.completed
                              ? "bg-blue-900/20 opacity-60"
                              : "bg-blue-900/30"
                          }`}
                        >
                          <div
                            className={`mr-3 h-5 w-5 rounded-full flex items-center justify-center ${
                              quest.completed
                                ? "bg-blue-500/30 text-blue-300"
                                : "bg-blue-500/10 text-blue-400"
                            }`}
                          >
                            {quest.completed ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <span className="h-3 w-3 rounded-full bg-current"></span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm ${
                                quest.completed
                                  ? "line-through text-slate-400"
                                  : "text-slate-200"
                              }`}
                            >
                              {quest.title}
                            </p>
                          </div>
                          <div
                            className={`text-xs px-2 py-1 rounded-full ${
                              quest.rarity === "common"
                                ? "bg-slate-700/60 text-slate-300"
                                : quest.rarity === "uncommon"
                                ? "bg-green-900/30 text-green-300"
                                : quest.rarity === "rare"
                                ? "bg-blue-900/30 text-blue-300"
                                : quest.rarity === "epic"
                                ? "bg-purple-900/30 text-purple-300"
                                : "bg-yellow-900/30 text-yellow-300"
                            }`}
                          >
                            {quest.rarity.charAt(0).toUpperCase() +
                              quest.rarity.slice(1)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#0d1424] p-3 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-400">
                          Experience
                        </span>
                        <span className="text-sm text-blue-400">
                          375 / 500 XP
                        </span>
                      </div>
                      <div className="w-full h-2 bg-blue-900/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2 justify-end">
                      <button className="px-3 py-1.5 rounded-md bg-blue-600/20 text-blue-400 text-sm hover:bg-blue-600/30 transition-colors">
                        View All Quests
                      </button>
                      <button className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-500 transition-colors">
                        Add Quest
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-[#131c33]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              <motion.div
                className="p-6 rounded-lg bg-[#0f172a] border border-blue-900/30"
                variants={fadeIn}
              >
                <h3 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
                  {stats.activeUsers.toLocaleString()}+
                </h3>
                <p className="text-slate-400">Active Adventurers</p>
              </motion.div>

              <motion.div
                className="p-6 rounded-lg bg-[#0f172a] border border-blue-900/30"
                variants={fadeIn}
              >
                <h3 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
                  {stats.tasksCompleted.toLocaleString()}+
                </h3>
                <p className="text-slate-400">Quests Completed</p>
              </motion.div>

              <motion.div
                className="p-6 rounded-lg bg-[#0f172a] border border-blue-900/30"
                variants={fadeIn}
              >
                <h3 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
                  {stats.totalXpEarned.toLocaleString()}+
                </h3>
                <p className="text-slate-400">XP Points Earned</p>
              </motion.div>

              <motion.div
                className="p-6 rounded-lg bg-[#0f172a] border border-blue-900/30"
                variants={fadeIn}
              >
                <h3 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">
                  {stats.achievementsUnlocked.toLocaleString()}+
                </h3>
                <p className="text-slate-400">Achievements Unlocked</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* AI Features Section */}
        <section id="features" className="py-20 relative">
          <div className="absolute inset-0 bg-[#0f172a] radial-gradient-subtle"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  AI-Powered
                </span>{" "}
                Productivity
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Our intelligent assistant helps you stay focused and accomplish
                more with less effort
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                className="bg-[#131c33] p-6 rounded-lg border border-blue-900/30"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: 0.1 },
                  },
                }}
              >
                <div className="bg-blue-600/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <Mic className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-200">
                  Voice to Quest
                </h3>
                <p className="text-slate-400">
                  Speak your tasks naturally and our AI assistant will create
                  perfectly structured quests with appropriate priorities and
                  deadlines.
                </p>
              </motion.div>

              <motion.div
                className="bg-[#131c33] p-6 rounded-lg border border-blue-900/30"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: 0.2 },
                  },
                }}
              >
                <div className="bg-blue-600/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <Brain className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-200">
                  Smart Insights
                </h3>
                <p className="text-slate-400">
                  Get detailed reports and insights generated by AI, summarizing
                  your productivity patterns and suggesting improvements.
                </p>
              </motion.div>

              <motion.div
                className="bg-[#131c33] p-6 rounded-lg border border-blue-900/30"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: 0.3 },
                  },
                }}
              >
                <div className="bg-blue-600/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <BarChart className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-200">
                  Advanced Analytics
                </h3>
                <p className="text-slate-400">
                  Our AI analyzes your completion patterns to recommend optimal
                  quest scheduling and difficulty settings.
                </p>
              </motion.div>

              <motion.div
                className="bg-[#131c33] p-6 rounded-lg border border-blue-900/30"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: 0.4 },
                  },
                }}
              >
                <div className="bg-blue-600/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <Calendar className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-200">
                  Smart Scheduling
                </h3>
                <p className="text-slate-400">
                  Let AI help you organize your day with optimized quest
                  scheduling based on your energy levels and focus patterns.
                </p>
              </motion.div>

              <motion.div
                className="bg-[#131c33] p-6 rounded-lg border border-blue-900/30"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: 0.5 },
                  },
                }}
              >
                <div className="bg-blue-600/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <Award className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-200">
                  Custom Achievements
                </h3>
                <p className="text-slate-400">
                  Our AI creates personalized achievements based on your habits
                  and quest completion patterns.
                </p>
              </motion.div>

              <motion.div
                className="bg-[#131c33] p-6 rounded-lg border border-blue-900/30"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: 0.6 },
                  },
                }}
              >
                <div className="bg-blue-600/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <Sparkles className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-200">
                  Focus Assistance
                </h3>
                <p className="text-slate-400">
                  AI-powered techniques to help with task initiation and focus
                  maintenance, specifically designed for ADHD brains.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-[#131c33]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Adventurers
                </span>{" "}
                Love QuestLog
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                See what our users are saying about their productivity journeys
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex J.",
                  role: "Software Developer",
                  image: "/avatars/user-1.jpg",
                  content:
                    "As someone with ADHD, task management has always been a struggle. QuestLog turns my to-dos into an adventure that my brain actually wants to engage with!",
                  rating: 5,
                },
                {
                  name: "Morgan T.",
                  role: "Marketing Manager",
                  image: "/avatars/user-2.jpg",
                  content:
                    "The gamification is brilliant! I've tried dozens of productivity apps, but this is the first one I've stuck with for more than a month. Level 12 and counting!",
                  rating: 5,
                },
                {
                  name: "Jamie L.",
                  role: "Graphic Designer",
                  image: "/avatars/user-3.jpg",
                  content:
                    "The voice-to-quest feature is a game changer. I can just speak my tasks while I'm working and the AI creates perfectly organized quests for me.",
                  rating: 4,
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-[#0f172a] p-6 rounded-lg border border-blue-900/30"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, delay: 0.1 * index },
                    },
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600/30 rounded-full flex items-center justify-center text-blue-300 font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-slate-200">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-slate-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-4">{testimonial.content}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-yellow-400"
                            : "text-slate-600"
                        }`}
                        fill={i < testimonial.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#131c33]"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready to{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Level Up
                </span>{" "}
                Your Productivity?
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                Join thousands of adventurers who have transformed their task
                management experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/auth/register"
                  className="px-8 py-3 text-center rounded-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium text-lg"
                >
                  Start Your Free Trial
                </a>
                <a
                  href="/demo"
                  className="px-8 py-3 text-center rounded-md border border-blue-500/30 hover:border-blue-400 text-slate-300 font-medium text-lg"
                >
                  Watch Demo
                </a>
              </div>
              <p className="text-sm text-slate-400 mt-4">
                No credit card required. 14-day free trial.
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-[#131c33]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Common
                </span>{" "}
                Questions
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Everything you need to know about QuestLog
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {[
                {
                  question:
                    "How is QuestLog different from other task managers?",
                  answer:
                    "QuestLog is specifically designed for people with ADHD, featuring game-inspired elements that make task management engaging rather than overwhelming. Our AI-powered features help you organize tasks in a way that works with your brain, not against it.",
                },
                {
                  question: "How does the voice-to-quest feature work?",
                  answer:
                    "Simply speak your task naturally, and our AI will interpret it, create a properly formatted quest, assign appropriate priority, difficulty, and even suggest a deadline based on context. It's like having a personal assistant who understands how to organize your thoughts.",
                },
                {
                  question: "Is my data secure and private?",
                  answer:
                    "Absolutely! All your quest data is encrypted and stored securely. We never share your personal information with third parties, and our AI processing is done with privacy in mind. You're in control of your adventure log at all times.",
                },
                {
                  question: "Can I use QuestLog offline?",
                  answer:
                    "Yes! QuestLog is a Progressive Web App (PWA) that works offline. Your quests will sync when you reconnect, so you can manage your tasks anywhere, anytime, with or without an internet connection.",
                },
                {
                  question: "What platforms is QuestLog available on?",
                  answer:
                    "QuestLog works on any device with a modern web browser. As a PWA, you can install it on your phone, tablet, or computer for a native app-like experience, regardless of whether you use iOS, Android, Windows, or Mac.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="mb-6 border border-blue-900/30 rounded-lg overflow-hidden"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, delay: 0.1 * index },
                    },
                  }}
                >
                  <div className="p-6 bg-[#0f172a]">
                    <h3 className="text-lg font-semibold text-slate-200">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="p-6 bg-blue-900/10 border-t border-blue-900/30">
                    <p className="text-slate-300">{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 relative">
          <div className="absolute inset-0 bg-[#0f172a] radial-gradient-subtle"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Simple
                </span>{" "}
                Pricing
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                Start your adventure with a plan that works for you
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <motion.div
                className="bg-[#131c33] rounded-lg border border-blue-900/30 overflow-hidden h-full flex flex-col"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: 0.1 },
                  },
                }}
              ><div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-200 mb-2">
                      Starter
                    </h3>
                    <p className="text-slate-400 mb-6">
                      Perfect for solo adventurers
                    </p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-slate-200">
                        $0
                      </span>
                      <span className="text-slate-400">/month</span>
                    </div>
                    <ul className="space-y-4 mb-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 mr-2 shrink-0 mt-0.5" />
                        <span className="text-slate-300">Unlimited quests</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 mr-2 shrink-0 mt-0.5" />
                        <span className="text-slate-300">Basic gamification</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 mr-2 shrink-0 mt-0.5" />
                        <span className="text-slate-300">5 daily quests</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 mr-2 shrink-0 mt-0.5" />
                        <span className="text-slate-300">Web access</span>
                      </li>
                    </ul>
                  </div>
                  <a
                    href="/auth/register"
                    className="block text-center py-2 px-4 rounded-md border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-medium"
                  >
                    Start Free
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="bg-[#131c33] rounded-lg border-2 border-blue-500 overflow-hidden relative h-full flex flex-col"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, delay: 0.2 },
                  },
                }}
              >
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-400 text-center py-1 text-xs text-white font-medium">
                  MOST POPULAR
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-200 mb-2">Pro</h3>
                    <p className="text-slate-400 mb-6">
                      For serious quest-takers
                    </p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-slate-200">
                        $9.99
                      </span>
                      <span className="text-slate-400">/month</span>
                    </div>
                    <ul className="space-y-4 mb-6">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 mr-2 shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Everything in Starter
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 mr-2 shrink-0 mt-0.5" />
                        <span className="text-slate-300">AI Voice-to-Quest</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 mr-2 shrink-0 mt-0.5" />
                        <span className="text-slate-300">Advanced analytics</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 mr-2 shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Custom achievements
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 mr-2 shrink-0 mt-0.5" />
                        <span className="text-slate-300">
                          Unlimited daily quests
                        </span>
                      </li>
                    </ul>
                  </div>
                  <a
                    href="/auth/register"
                    className="block text-center py-2 px-4 rounded-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium"
                  >
                    Start 14-Day Free Trial
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0d1424] border-t border-blue-900/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center lg:gap-48 sm:gap-20 mb-8">
            <div>
              <h4 className="text-lg font-bold text-slate-200 mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="/changelog"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Changelog
                  </a>
                </li>
                <li>
                  <a
                    href="/roadmap"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-200 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/tos" className="text-slate-400 hover:text-blue-400">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-slate-400 hover:text-blue-400"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-900/30 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src="/logo.png"
                alt="QuestLog Logo"
                width={64}
                height={64}
                className=""
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                QuestLog
              </span>
            </div>

            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-blue-400">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} QuestLog. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Add the CSS for gradient backgrounds */}
      <style jsx global>{`
        .radial-gradient {
          background-image: radial-gradient(
            circle at 50% 50%,
            rgba(56, 189, 248, 0.1) 0%,
            rgba(56, 189, 248, 0) 50%
          );
        }

        .radial-gradient-subtle {
          background-image: radial-gradient(
            circle at 50% 50%,
            rgba(56, 189, 248, 0.05) 0%,
            rgba(56, 189, 248, 0) 50%
          );
        }
      `}</style>
    </div>
  );
}
