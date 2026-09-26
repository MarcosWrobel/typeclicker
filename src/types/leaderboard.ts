import { RpgClassType } from './rpgClass';
import { GameState } from '../types';

export interface LeaderboardEntry {
  userId: string;
  nome: string;
  apelido?: string;
  turma: string;
  level: number;
  points: number;
  seasonBytes?: number;
  wpm: number;
  accuracy?: number;
  avatar?: string;
  updatedAt: string;
  rpgClass?: RpgClassType;
  isClassLocked?: boolean;
  isRpgClassLocked?: boolean;
  flaggedForReview?: boolean;
  flagReason?: string;
  email?: string;
  isStaff?: boolean;
  raceWins?: number;
  racesParticipated?: number;
  bestRaceWpm?: number;
  maxCombo?: number;
  pvpWins?: number;
  pvpMatches?: number;
  pvpPoints?: number;
  bestWpm?: number;
  reachedLevel100At?: string;
  cardFrame?: string;
  achievementsCount?: number;
  radarBestWave?: number;
  radarHighScore?: number;
  radarMaxWpm?: number;
}

export interface Level100PioneerSlot {
  rank: 1 | 2 | 3;
  player?: LeaderboardEntry;
  reachedAt?: string;
  isFilled: boolean;
}

export interface CloudResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface CloudLoadResponse {
  success: boolean;
  message: string;
  saveState?: Partial<GameState>;
  savedAt?: string;
  level?: number;
  points?: number;
}

export interface SeasonHistoryEntry {
  id: string;
  seasonId: string;
  seasonName: string;
  userId: string;
  displayName: string;
  turma?: string;
  seasonBytes: number;
  rankPosition: number;
  closedAt: string;
  avatar?: string;
  finalLevel?: number;
  finalWpm?: number;
}

