import { GameState } from '../types';
import { RpgClassType } from '../types/rpgClass';
import { LeaderboardEntry, CloudLoadResponse, SeasonHistoryEntry } from '../types/leaderboard';

export interface UserProfile {
  id: string;
  displayName: string;
  nickname?: string;
  avatar?: string;
  turma?: string;
  role?: string;
  bytes: number;
  totalBytesEarned: number;
  seasonBytes?: number;
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
  recordGameSession(userId: string, gameId: string, bytesEarned: number, session: GameSessionPayload): Promise<void>;
  getLeaderboard(limitCount?: number): Promise<UserProfile[]>;
  getClassroomRanking(turma: string): Promise<UserProfile[]>;
  unlockCosmetic(userId: string, itemId: string, category: string): Promise<void>;
  
  // Persistência completa do GameState (hidratar e salvar)
  loadGameState(userId: string): Promise<CloudLoadResponse>;
  saveLegacyGameState(userId: string, state: GameState): Promise<void>;

  // Leaderboard global tipado para rankings e pódios
  getGlobalLeaderboard(forceRefresh?: boolean): Promise<LeaderboardEntry[]>;

  // Temporadas Trimestrais e Hall da Fama
  getSeasonLeaderboard(forceRefresh?: boolean): Promise<LeaderboardEntry[]>;
  getSeasonHistory(seasonId: string): Promise<SeasonHistoryEntry[]>;
  getArchivedSeasonsList(): Promise<{ seasonId: string; seasonName: string; closedAt: string }[]>;
  closeCurrentSeason(seasonId: string, seasonName: string): Promise<number>;

  // Gestão Administrativa e Dashboard Docente
  getAdminDashboardData(turmaFilter?: string): Promise<LeaderboardEntry[]>;
  adminUpdateStudentProfile(
    studentUserId: string,
    updates: {
      turma?: string;
      rpgClass?: RpgClassType;
      isClassLocked?: boolean;
      isRpgClassLocked?: boolean;
    }
  ): Promise<void>;
  adminAutoBalanceRpgClasses(turma: string): Promise<{ updatedCount: number; distribution: Record<RpgClassType, number> }>;
  wipeDatabase(): Promise<void>;
  sanitizeStaffLeaderboard(): Promise<{ removedCount: number; checkedCount: number }>;
}


