export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon?: string;
  exp_reward: number;
}

export interface UserAchievement {
  id: number;
  user_id: number;
  achievement_id: number;
  unlocked_at: string; // ISO datetime
  achievement: Achievement;
}
