// src/lib/validators.ts
import { z } from "zod";
import { QuestRarity, QuestType } from "@/types/quest";
import { defaultPalettes } from "@/lib/color-config";

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Registration validation schema
export const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid email."),
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
    .max(99999, "Description must be at most 99999 characters")
    .optional(),
  due_date: z.string().optional(),
  rarity: z.nativeEnum(QuestRarity, {
    errorMap: () => ({ message: "Please select a valid rarity" }),
  }),
  quest_type: z.nativeEnum(QuestType, {
    errorMap: () => ({ message: "Please select a valid quest type" }),
  }),
  priority: z.number().min(1).max(100),
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
    .max(99999, "Description must be at most 99999 characters")
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
  priority: z.number().min(1).max(100).optional(),
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

// Updated settings validation schema to include color palette
export const settingsSchema = z.object({
  animationsEnabled: z.boolean(),
  notificationsEnabled: z.boolean(),
  colorPalette: z
    .enum(Object.keys(defaultPalettes) as [string, ...string[]])
    .optional(),
  autoCreateQuestsFromVoice: z.boolean(),
});

// Optional: Color validation schema for custom color picking
export const colorSchema = z.object({
  hue: z.number().min(0).max(360),
  saturation: z.number().min(0).max(100),
  lightness: z.number().min(0).max(100),
});
