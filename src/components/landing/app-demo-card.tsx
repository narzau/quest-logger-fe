"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Calendar, CheckCircle2, Trophy } from "lucide-react";

export const AppDemoCard: React.FC = () => {
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 dark:from-blue-950 dark:to-purple-950">
        <div className="absolute inset-0 opacity-20 bg-grid-white dark:bg-grid-dark"></div>
      </div>

      {/* Demo content overlay - would be replaced with actual UI demo */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-xl"
        >
          <UserProgressBar />
          <QuestList />
          <AchievementNotification />
        </motion.div>
      </div>
    </div>
  );
};

// Component for the user level progress bar
const UserProgressBar: React.FC = () => (
  <motion.div
    className="flex items-center mb-3"
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.3, delay: 0.2 }}
  >
    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
      L5
    </div>
    <div className="ml-2">
      <div className="h-2 w-32 bg-white/30 rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "50%" }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="h-2 bg-green-600 rounded-full"
        />
      </div>
    </div>
    <div className="ml-2 text-xs">150/300 XP</div>
  </motion.div>
);

// Component for the quest list
const QuestList: React.FC = () => (
  <div className="space-y-2">
    <QuestItem
      icon={<Flame className="h-4 w-4 text-yellow-400 mr-2" />}
      title="Complete Project Presentation"
      tag={{ text: "EPIC", color: "bg-purple-700" }}
      delay={0.4}
    />
    <QuestItem
      icon={<Calendar className="h-4 w-4 text-blue-400 mr-2" />}
      title="Daily Meditation"
      tag={{ text: "DAILY", color: "bg-green-700" }}
      delay={0.6}
    />
    <QuestItem
      icon={<CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />}
      title="Morning Exercise"
      tag={{ text: "+15 XP" }}
      completed={true}
      delay={0.8}
    />
  </div>
);

// Component for individual quest items
interface QuestItemProps {
  icon: React.ReactNode;
  title: string;
  tag: { text: string; color?: string };
  completed?: boolean;
  delay: number;
}

const QuestItem: React.FC<QuestItemProps> = ({
  icon,
  title,
  tag,
  completed = false,
  delay,
}) => (
  <motion.div
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.3, delay }}
    className="flex items-center p-2 bg-white/20 rounded hover:bg-white/30 transition-colors duration-200"
  >
    {icon}
    <span className={completed ? "line-through opacity-60" : ""}>{title}</span>
    <span
      className={`ml-auto text-xs ${tag.color ? tag.color : ""} ${
        tag.color ? "px-2 py-1 rounded" : ""
      }`}
    >
      {tag.text}
    </span>
  </motion.div>
);

// Component for achievement notification
const AchievementNotification: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay: 1.2,
      repeat: Infinity,
      repeatType: "reverse",
      repeatDelay: 2,
    }}
    className="mt-3 text-center text-sm bg-yellow-600/40 py-1 px-2 rounded-full"
  >
    <span className="flex items-center justify-center">
      <Trophy className="h-4 w-4 mr-1" />
      Achievement Unlocked: Early Bird! +50 XP
    </span>
  </motion.div>
);
