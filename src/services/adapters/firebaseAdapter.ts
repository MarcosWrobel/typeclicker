import { IDatabaseService, UserProfile, GameSessionPayload } from '../dbInterface';
import {
  db,
  loadProgressFromCloud,
  getGlobalLeaderboard,
  getAdminDashboardData,
  adminUpdateStudentProfile,
  adminAutoBalanceRpgClasses,
  wipeDatabase,
  sanitizeStaffFromLeaderboard
} from '../firebaseService';
import { doc, getDoc, setDoc, updateDoc, collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { GameState } from '../../types';
import { CloudLoadResponse, LeaderboardEntry, SeasonHistoryEntry } from '../../types/leaderboard';

export class FirebaseAdapter implements IDatabaseService {
  async loadGameState(userId: string): Promise<CloudLoadResponse> {
    return loadProgressFromCloud();
  }

  async getGlobalLeaderboard(forceRefresh: boolean = false): Promise<LeaderboardEntry[]> {
    return getGlobalLeaderboard(forceRefresh);
  }
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'leaderboard', userId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    
    const data = snap.data();
    return {
      id: data.userId || userId,
      displayName: data.nome || '',
      nickname: data.nickname,
      avatar: data.avatar,
      turma: data.turma,
      bytes: data.bytes || 0,
      totalBytesEarned: data.totalBytesEarned || 0,
      level: data.level || 1,
      levelTokens: data.levelTokens || 0,
      duelTokens: data.duelTokens || 0,
      quantumFragments: data.quantumFragments || 0,
      prestigeCount: data.prestigeCount || 0,
      rpgClass: data.rpgClass,
      equippedSkin: data.equippedSkin,
      equippedFrame: data.equippedFrame,
      equippedTheme: data.equippedTheme,
      schemaVersion: data.schemaVersion || '1.0.0',
    };
  }

  async saveUserProfile(profile: Partial<UserProfile>): Promise<void> {
    if (!profile.id) throw new Error('UserProfile ID is required for saving.');
    const docRef = doc(db, 'leaderboard', profile.id);
    
    const updateData: Record<string, any> = {};
    if (profile.displayName !== undefined) updateData.nome = profile.displayName;
    if (profile.nickname !== undefined) updateData.nickname = profile.nickname;
    if (profile.avatar !== undefined) updateData.avatar = profile.avatar;
    if (profile.turma !== undefined) updateData.turma = profile.turma;
    if (profile.bytes !== undefined) updateData.bytes = profile.bytes;
    if (profile.totalBytesEarned !== undefined) {
      updateData.totalBytesEarned = profile.totalBytesEarned;
      updateData.points = profile.totalBytesEarned; // legacy compatibility
    }
    if (profile.level !== undefined) updateData.level = profile.level;
    
    // Fallback para save completo ou update
    try {
      await updateDoc(docRef, updateData);
    } catch {
      await setDoc(docRef, { userId: profile.id, ...updateData }, { merge: true });
    }
  }

  async recordGameSession(gameId: string, bytesEarned: number, session: GameSessionPayload): Promise<void> {
    // No firebase legado, delegamos para o saveLegacyGameState via hook
    // Esta implementacao stub permite interoperabilidade se chamado diretamente
    console.warn('recordGameSession via FirebaseAdapter requer chamadas locais ao state e depois sync.');
  }

  async getLeaderboard(limitCount: number = 100): Promise<UserProfile[]> {
    const q = query(collection(db, 'leaderboard'), orderBy('points', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      id: doc.id,
      displayName: doc.data().nome || 'Desconhecido',
      bytes: doc.data().bytes || 0,
      totalBytesEarned: doc.data().points || 0,
      level: doc.data().level || 1,
      levelTokens: doc.data().levelTokens || 0,
      duelTokens: doc.data().duelTokens || 0,
      quantumFragments: doc.data().quantumFragments || 0,
      prestigeCount: doc.data().prestigeCount || 0,
      turma: doc.data().turma,
      avatar: doc.data().avatar,
      schemaVersion: doc.data().schemaVersion || '1.0.0'
    }));
  }

  async getClassroomRanking(turma: string): Promise<UserProfile[]> {
    const q = query(collection(db, 'leaderboard'), where('turma', '==', turma), orderBy('points', 'desc'), limit(100));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      id: doc.id,
      displayName: doc.data().nome || 'Desconhecido',
      bytes: doc.data().bytes || 0,
      totalBytesEarned: doc.data().points || 0,
      level: doc.data().level || 1,
      levelTokens: doc.data().levelTokens || 0,
      duelTokens: doc.data().duelTokens || 0,
      quantumFragments: doc.data().quantumFragments || 0,
      prestigeCount: doc.data().prestigeCount || 0,
      turma: doc.data().turma,
      avatar: doc.data().avatar,
      schemaVersion: doc.data().schemaVersion || '1.0.0'
    }));
  }

  async unlockCosmetic(userId: string, itemId: string, category: string): Promise<void> {
    const docRef = doc(db, 'saves', userId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return;
    const data = snap.data();
    if (!data.saveState?.cosmetics) return;
    
    const cosmetics = data.saveState.cosmetics;
    const categoryMap: Record<string, string> = {
      skin: 'unlockedSkins',
      frame: 'unlockedFrames',
      theme: 'unlockedThemes'
    };
    
    const arrayName = categoryMap[category];
    if (arrayName && !cosmetics[arrayName]?.includes(itemId)) {
      await setDoc(docRef, {
        saveState: {
          ...data.saveState,
          cosmetics: {
            ...cosmetics,
            [arrayName]: [...(cosmetics[arrayName] || []), itemId]
          }
        }
      }, { merge: true });
    }
  }

  async saveLegacyGameState(userId: string, state: GameState): Promise<void> {
    const docRef = doc(db, 'saves', userId);
    await setDoc(docRef, {
      userId,
      saveState: state,
      lastUpdated: Date.now()
    }, { merge: true });
  }

  async getSeasonLeaderboard(forceRefresh: boolean = false): Promise<LeaderboardEntry[]> {
    return this.getGlobalLeaderboard(forceRefresh);
  }

  async getSeasonHistory(seasonId: string): Promise<SeasonHistoryEntry[]> {
    return [];
  }

  async getArchivedSeasonsList(): Promise<{ seasonId: string; seasonName: string; closedAt: string }[]> {
    return [];
  }

  async closeCurrentSeason(seasonId: string, seasonName: string): Promise<number> {
    console.warn('closeCurrentSeason não é suportado no Firestore legado.');
    return 0;
  }

  async getAdminDashboardData(turmaFilter?: string): Promise<LeaderboardEntry[]> {
    return getAdminDashboardData(turmaFilter);
  }

  async adminUpdateStudentProfile(
    studentUserId: string,
    updates: {
      turma?: string;
      rpgClass?: any;
      isClassLocked?: boolean;
      isRpgClassLocked?: boolean;
    }
  ): Promise<void> {
    return adminUpdateStudentProfile(studentUserId, updates);
  }

  async adminAutoBalanceRpgClasses(turma: string): Promise<{ updatedCount: number; distribution: Record<string, number> }> {
    return adminAutoBalanceRpgClasses(turma);
  }

  async wipeDatabase(): Promise<void> {
    return wipeDatabase();
  }

  async sanitizeStaffLeaderboard(): Promise<{ removedCount: number; checkedCount: number }> {
    return sanitizeStaffFromLeaderboard();
  }
}


