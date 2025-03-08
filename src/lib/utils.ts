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

export function calculateLevelInfo(level: number, totalXp: number): LevelInfo {
  // Calculate threshold XP for current level
  const currentLevelThreshold =
    level > 1 ? Math.floor(100 * (level - 1) ** 1.5) : 0;

  // Calculate XP needed for the next level
  const nextLevelThreshold = Math.floor(100 * level ** 1.5);

  // Current XP is the amount beyond the threshold for the current level
  const currentXp = totalXp - currentLevelThreshold;

  // XP needed to reach next level is the gap between thresholds
  const nextLevelXp = nextLevelThreshold - currentLevelThreshold;

  // Calculate progress percentage toward the next level
  const progress = Math.min(100, Math.floor((currentXp / nextLevelXp) * 100));

  return {
    level,
    currentXp,
    nextLevelXp,
    progress,
  };
}

// Function to limit strings to a certain length with ellipsis
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
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
