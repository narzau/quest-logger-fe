// src/lib/validators.ts
import { z } from "zod";
import { QuestRarity, QuestType } from "@/types/quest";

// Login validation schema
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Registration validation schema
export const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Quest creation validation schema
export const createQuestSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  due_date: z.string().optional(),
  rarity: z.nativeEnum(QuestRarity, {
    errorMap: () => ({ message: "Please select a valid rarity" }),
  }),
  quest_type: z.nativeEnum(QuestType, {
    errorMap: () => ({ message: "Please select a valid quest type" }),
  }),
  priority: z.number().min(1).max(5),
  parent_quest_id: z.number().optional(),
});

// Quest update validation schema
export const updateQuestSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .nullable(),
  is_completed: z.boolean().optional(),
  due_date: z.string().optional().nullable(),
  rarity: z
    .nativeEnum(QuestRarity, {
      errorMap: () => ({ message: "Please select a valid rarity" }),
    })
    .optional(),
  quest_type: z
    .nativeEnum(QuestType, {
      errorMap: () => ({ message: "Please select a valid quest type" }),
    })
    .optional(),
  priority: z.number().min(1).max(5).optional(),
  parent_quest_id: z.number().optional().nullable(),
});

// User update validation schema
export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
});

// Settings validation schema
export const settingsSchema = z.object({
  darkMode: z.boolean(),
  animationsEnabled: z.boolean(),
  notificationsEnabled: z.boolean(),
});
