import { PlayerCosmetics } from './types/cosmetics';
import { ArenaStats } from './types/arena';
import { AchievementDef, AchievementReward, AchievementCategory, AchievementContext } from './types/achievements';

export * from './types/cosmetics';
export * from './types/arena';
export * from './types/achievements';

export type CategoryId = 'iniciante' | 'facil' | 'medio' | 'avancado' | 'expert';

export interface WordCategory {
  id: CategoryId;
  name: string;
  badge: string;
  bonusMultiplier: number;
  bonusLabel: string;
  description: string;
  levelNumber: number;
  themeColor: 'emerald' | 'sky' | 'amber' | 'purple' | 'rose';
  words: string[];
}

export interface UpgradeDef {
  id: string;
  name: string;
  description: string;
  type: 'active' | 'passive';
  baseCost: number;
  costMultiplier: number;
  value: number; // +bytes per char OR +bytes per sec
  icon: string;
  flavor: string;
}

export interface GameState {
  bytes: number;
  totalBytesEarned: number;
  bytesPerChar: number;
  autoBytesPerSec: number;
  comboStreak: number;
  maxCombo: number;
  multiplier: number;
  correctKeys: number;
  wrongKeys: number;
  wordsCompleted: number;
  totalActiveSeconds: number;
  prestigeCores: number;
  prestigeCount: number;
  upgrades: Record<string, number>;
  selectedCategory: CategoryId;
  soundEnabled: boolean;
  studentName: string;
  studentNickname: string;
  studentClass: string;
  studentAvatar: string;
  completedChallenges: number[];
  // Cosméticos e customização do aluno
  cosmetics?: PlayerCosmetics;
  // Estatísticas de Arena 1x1 (Nível 100)
  arenaStats?: ArenaStats;
  // Telemetria por tecla para treino corretivo adaptativo
  keyTelemetry?: Record<string, KeyTelemetry>;
  // Conquistas desbloqueadas (achievementId -> timestamp de desbloqueio)
  achievements?: Record<string, number>;
  // Estatísticas auxiliares de conquistas
  focusDrillsCompleted?: number;
  perfectWordsStreak?: number;
  mascotClicks?: number;
  completedDrillSessions?: number;
  categoriesExplored?: CategoryId[];
  // Novos campos opcionais com retrocompatibilidade garantida
  schemaVersion?: number;
  flaggedForReview?: boolean;
  flagReason?: string;
  lastSyncTimestamp?: number;
}

export interface KeyTelemetry {
  hits: number;
  misses: number;
  totalTimeMs: number;
}

export interface WeakKeyReport {
  char: string;
  hits: number;
  misses: number;
  total: number;
  errorRate: number; // 0 a 1
  avgTimeMs: number;
  idt: number; // Índice de Dificuldade da Tecla
}

export interface DrillSession {
  targetKeys: string[];
  drillWords: string[];
  currentIndex: number;
  totalWords: number;
  startedAt?: number;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  type: 'success' | 'error' | 'bonus' | 'level';
}
