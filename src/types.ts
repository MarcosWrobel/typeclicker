import { PlayerCosmetics } from './types/cosmetics';
import { ArenaStats } from './types/arena';
import { AchievementDef, AchievementReward, AchievementCategory, AchievementContext } from './types/achievements';
import { QuestsState } from './types/quests';
import { ClassroomRace, ClassroomRaceFinisher } from './types/race';
import { RpgClassType } from './types/rpgClass';
import { ArcadeMatchRecord, LogicStats, MathStats, SyntaxStats } from './types/gamePlugin';

export * from './types/cosmetics';
export * from './types/arena';
export * from './types/achievements';
export * from './types/quests';
export * from './types/race';
export * from './types/curricular';
export * from './types/curricularTracks';
export * from './types/rpgClass';
export * from './types/raid';
export * from './types/gamePlugin';

export type CategoryId = 'iniciante' | 'facil' | 'medio' | 'avancado' | 'expert';
export type TypingMode = 'words' | 'sentences' | 'code';

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
  typingMode?: TypingMode;
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
  // Estatísticas de Defesa Cibernética (Type: Radar)
  radarStats?: {
    bestWave: number;
    highScore: number;
    maxWpm: number;
    totalGames: number;
    totalEnemiesDefeated: number;
  };
  // Estatísticas dos minijogos adicionais (retrocompatíveis)
  logicStats?: LogicStats;   // ByteLogic — Portas Lógicas
  mathStats?: MathStats;     // MathStorm — Aritmética Rogue-lite
  syntaxStats?: SyntaxStats; // SyntaxMaze — Labirinto de Sintaxe
  // Histórico local de partidas arcade (array circular, máx 10 registros)
  arcadeHistory?: ArcadeMatchRecord[];
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
  // Maestria dos Guardiões de Nível a cada 10 níveis (estrelas e tempo)
  bossMastery?: Record<number, BossMasteryRecord>;
  // Buff Temporário da Bênção do Guardião (Vitórias com 2 ou 3 estrelas)
  bossBuffExpiresAt?: number;
  bossBuffMultiplier?: number;
  // Data e hora em que atingiu o Nível 100 pela primeira vez (Pioneiros do Leopoldina)
  reachedLevel100At?: string;
  // Travas escolares gerenciadas pelo professor
  isClassLocked?: boolean;
  isRpgClassLocked?: boolean;
  // Novos campos opcionais com retrocompatibilidade garantida
  schemaVersion?: number;
  flaggedForReview?: boolean;
  flagReason?: string;
  lastSyncTimestamp?: number;
}

export interface Level100Pioneer {
  rank: 1 | 2 | 3;
  userId: string;
  nome: string;
  apelido?: string;
  turma: string;
  avatar?: string;
  reachedAt: string;
  rpgClass?: RpgClassType;
}

export interface BossMasteryRecord {
  stars: number; // 1 a 3
  bestTimeSeconds: number;
  defeatedAt: number;
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
