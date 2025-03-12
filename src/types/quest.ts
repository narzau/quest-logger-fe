export enum QuestRarity {
  COMMON = "common",
  UNCOMMON = "uncommon",
  RARE = "rare",
  EPIC = "epic",
  LEGENDARY = "legendary",
}

export enum QuestType {
  DAILY = "daily",
  REGULAR = "regular",
  EPIC = "epic",
  BOSS = "boss",
}

export interface Quest {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string; // ISO datetime
  due_date: string; // ISO datetime
  rarity: QuestRarity;
  quest_type: QuestType;
  priority: number; // 1-100
  exp_reward: number;
  owner_id: number;
  parent_quest_id?: number; // For quest chains/dependencies
  tracked: boolean;
  google_calendar_event_id: string;
  completed_at: string;
}

export interface CreateQuestPayload {
  title: string;
  description?: string;
  due_date?: string;
  rarity: QuestRarity;
  quest_type: QuestType;
  priority: number;
  parent_quest_id?: number;
}

export interface UpdateQuestPayload {
  title?: string;
  description?: string;
  is_completed?: boolean;
  due_date?: string;
  rarity?: QuestRarity;
  tracked?: boolean;
  quest_type?: QuestType;
  priority?: number;
  parent_quest_id?: number;
}
