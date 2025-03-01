// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Quest, QuestRarity, QuestType } from "@/types/quest";

// Utility for conditional class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to calculate XP reward based on quest details
export function calculateXpReward(
  questType: QuestType,
  rarity: QuestRarity,
  priority: number
): number {
  // Base XP values for different quest types
  const typeMultiplier = {
    [QuestType.DAILY]: 5,
    [QuestType.REGULAR]: 10,
    [QuestType.EPIC]: 25,
    [QuestType.BOSS]: 50,
  };

  // Multipliers for rarity
  const rarityMultiplier = {
    [QuestRarity.COMMON]: 1,
    [QuestRarity.UNCOMMON]: 1.5,
    [QuestRarity.RARE]: 2,
    [QuestRarity.EPIC]: 3,
    [QuestRarity.LEGENDARY]: 5,
  };

  // Calculate base XP
  const baseXp = typeMultiplier[questType] || 10;

  // Apply rarity multiplier
  const rarityBonus = rarityMultiplier[rarity] || 1;

  // Apply priority multiplier (1-5)
  const priorityBonus = priority / 3;

  // Calculate total XP (rounded to nearest whole number)
  return Math.round(baseXp * rarityBonus * priorityBonus);
}

// Function to get color for quest rarity
export function getRarityColor(rarity: QuestRarity): string {
  switch (rarity) {
    case QuestRarity.COMMON:
      return "gray";
    case QuestRarity.UNCOMMON:
      return "green";
    case QuestRarity.RARE:
      return "blue";
    case QuestRarity.EPIC:
      return "purple";
    case QuestRarity.LEGENDARY:
      return "yellow";
    default:
      return "gray";
  }
}

// Function to get accent color class for quest rarity
export function getRarityColorClass(rarity: QuestRarity): string {
  switch (rarity) {
    case QuestRarity.COMMON:
      return "border-gray-400 bg-gray-50 text-gray-700";
    case QuestRarity.UNCOMMON:
      return "border-green-400 bg-green-50 text-green-700";
    case QuestRarity.RARE:
      return "border-blue-400 bg-blue-50 text-blue-700";
    case QuestRarity.EPIC:
      return "border-purple-400 bg-purple-50 text-purple-700";
    case QuestRarity.LEGENDARY:
      return "border-yellow-400 bg-yellow-50 text-yellow-700";
    default:
      return "border-gray-400 bg-gray-50 text-gray-700";
  }
}

// Function to format dates in a user-friendly way
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Calculate level and experience needed for next level
export interface LevelInfo {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  progress: number;
}

export function calculateLevelInfo(experience: number): LevelInfo {
  // Level calculation formula (can be adjusted)
  // This formula makes level 1 at 0 XP, level 2 at 100 XP, level 3 at 300 XP, etc.
  // The required XP increases with each level
  let level = 1;
  let xpForNextLevel = 100;
  let accumulatedXp = 0;

  // Calculate level based on XP
  while (accumulatedXp + xpForNextLevel <= experience) {
    accumulatedXp += xpForNextLevel;
    level += 1;
    // Next level requires more XP
    xpForNextLevel = 100 * level;
  }

  // Calculate progress to next level (as percentage)
  const currentLevelXp = experience - accumulatedXp;
  const progress = Math.min(100, (currentLevelXp / xpForNextLevel) * 100);

  return {
    level,
    currentXp: currentLevelXp,
    nextLevelXp: xpForNextLevel,
    progress,
  };
}

// Function to determine if the date is today
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Function to limit strings to a certain length with ellipsis
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

// Function to determine the color for priority (1-5)
export function getPriorityColor(priority: number): string {
  switch (priority) {
    case 1:
      return "text-green-500";
    case 2:
      return "text-blue-500";
    case 3:
      return "text-yellow-500";
    case 4:
      return "text-orange-500";
    case 5:
      return "text-red-500";
    default:
      return "text-blue-500";
  }
}

// Group quests by day for better visualization
export function groupQuestsByDay(quests: Quest[]) {
  const grouped = new Map();

  quests.forEach((quest) => {
    const dueDate = quest.due_date
      ? new Date(quest.due_date).toDateString()
      : "No Due Date";

    if (!grouped.has(dueDate)) {
      grouped.set(dueDate, []);
    }

    grouped.get(dueDate).push(quest);
  });

  return grouped;
}
