import { GameState } from '../types';
import { LeaderboardEntry, CloudLoadResponse } from '../types/leaderboard';

export interface UserProfile {
  id: string;
  displayName: string;
  nickname?: string;
  avatar?: string;
  turma?: string;
  role?: string;
  bytes: number;
  totalBytesEarned: number;
  level: number;
  levelTokens: number;
  duelTokens: number;
  quantumFragments: number;
  prestigeCount: number;
  rpgClass?: string;
  equippedSkin?: string;
  equippedFrame?: string;
  equippedTheme?: string;
  schemaVersion: string;
  updatedAt?: string;
}

export interface GameSessionPayload {
  score: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
  correctAnswers: number;
  wrongAnswers: number;
  extraMetrics?: Record<string, any>;
}

export interface IDatabaseService {
  getUserProfile(userId: string): Promise<UserProfile | null>;
  saveUserProfile(profile: Partial<UserProfile>): Promise<void>;
  recordGameSession(gameId: string, bytesEarned: number, session: GameSessionPayload): Promise<void>;
  getLeaderboard(limitCount?: number): Promise<UserProfile[]>;
  getClassroomRanking(turma: string): Promise<UserProfile[]>;
  unlockCosmetic(userId: string, itemId: string, category: string): Promise<void>;
  
  // Persistência completa do GameState (hidratar e salvar)
  loadGameState(userId: string): Promise<CloudLoadResponse>;
  saveLegacyGameState(userId: string, state: GameState): Promise<void>;

  // Leaderboard global tipado para rankings e pódios
  getGlobalLeaderboard(forceRefresh?: boolean): Promise<LeaderboardEntry[]>;
}
