import { PlayerCosmetics } from './types/cosmetics';
import { ArenaStats } from './types/arena';
import { AchievementDef, AchievementReward, AchievementCategory, AchievementContext } from './types/achievements';
import { QuestsState } from './types/quests';
import { ClassroomRace, ClassroomRaceFinisher } from './types/race';
import { RpgClassType } from './types/rpgClass';

export * from './types/cosmetics';
export * from './types/arena';
export * from './types/achievements';
export * from './types/quests';
export * from './types/race';
export * from './types/curricular';
export * from './types/curricularTracks';
export * from './types/rpgClass';
export * from './types/raid';

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
  // Sistema de Quests Semanais & Crônicas RPG Infinitas
  quests?: QuestsState;
  // Sistema de Corridas Escolares em Tempo Real
  raceWins?: number;
  racesParticipated?: number;
  bestRaceWpm?: number;
  // Sistema de Acessibilidade & Baixa Visão
  accessibility?: AccessibilitySettings;
  // Classe RPG de Especialização (Guerreiro, Arqueiro, Mago)
  rpgClass?: RpgClassType;
  // Travas escolares gerenciadas pelo professor
  isClassLocked?: boolean;
  isRpgClassLocked?: boolean;
  // Novos campos opcionais com retrocompatibilidade garantida
  schemaVersion?: number;
  flaggedForReview?: boolean;
  flagReason?: string;
  lastSyncTimestamp?: number;
}

export type TextScale = 'normal' | 'large' | 'huge' | 'mega';
export type UiScale = 'normal' | 'large' | 'extra';
export type ContrastTheme = 'standard' | 'high_contrast_yellow' | 'high_contrast_cyan' | 'high_contrast_white';

export interface AccessibilitySettings {
  textScale: TextScale;
  uiScale: UiScale;
  highContrast: boolean;
  contrastTheme?: ContrastTheme;
  thickCursor: boolean;
  highlightActiveWord: boolean;
  fontFamily?: 'mono' | 'sans' | 'dyslexic';
  reduceMotion?: boolean;
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
