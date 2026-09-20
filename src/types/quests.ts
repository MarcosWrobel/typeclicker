export type WeeklyQuestCategory = 'volume' | 'accuracy' | 'pedagogy' | 'rpg';

export interface QuestReward {
  bytes: number;
  levelTokens?: number;
  quantumFragments?: number;
}

export interface WeeklyQuestDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: WeeklyQuestCategory;
  target: number;
  unit: string;
  reward: QuestReward;
}

export interface WeeklyQuestProgress {
  questId: string;
  current: number;
  completed: boolean;
  claimed: boolean;
}

export interface RpgBoss {
  name: string;
  title: string;
  avatar: string;
  theme: string;
  maxHp: number;
  lore: string;
  weaknessKeys?: string[];
}

export interface RpgFloorData {
  floor: number;
  chapterTitle: string;
  text: string;
  boss: RpgBoss;
  rewardBytes: number;
  rewardTokens: number;
  rewardFragments?: number;
}

export interface QuestsState {
  currentWeekId: string;
  weeklyQuests: WeeklyQuestProgress[];
  rpgDungeonFloor: number;
  rpgDungeonXp: number;
  totalQuestsCompleted: number;
  highestRpgFloor: number;
}

export interface QuestEvent {
  type:
    | 'word_typed'
    | 'keystroke'
    | 'accuracy_sample'
    | 'drill_completed'
    | 'focus_drill_completed'
    | 'rpg_floor_cleared'
    | 'boss_defeated';
  amount?: number;
  accuracy?: number;
  keys?: string[];
}
