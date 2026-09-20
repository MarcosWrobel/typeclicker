import { GameState } from '../types';

export type AchievementCategory = 'speed' | 'volume' | 'economy' | 'pedagogy' | 'collection' | 'secret';

export interface AchievementReward {
  bytes?: number;
  levelTokens?: number;
  quantumFragments?: number;
}

export interface AchievementContext {
  wpm?: number;
  accuracy?: number;
  focusDrillsCompleted?: number;
  perfectWordStreak?: number;
  mascotClicks?: number;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  reward: AchievementReward;
  maxProgress: number;
  isSecret?: boolean;
  isHardcore?: boolean;
  hint?: string;
  evaluate: (state: GameState, context?: AchievementContext) => { unlocked: boolean; currentProgress: number };
}
