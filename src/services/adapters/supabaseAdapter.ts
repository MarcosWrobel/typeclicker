import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IDatabaseService, UserProfile, GameSessionPayload } from '../dbInterface';
import { GameState } from '../../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export class SupabaseAdapter implements IDatabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  private mapProfile(row: any): UserProfile {
    return {
      id: row.id,
      displayName: row.display_name,
      nickname: row.nickname,
      avatar: row.avatar,
      turma: row.turma,
      role: row.role,
      bytes: Number(row.bytes) || 0,
      totalBytesEarned: Number(row.total_bytes_earned) || 0,
      level: row.level || 1,
      levelTokens: row.level_tokens || 0,
      duelTokens: row.duel_tokens || 0,
      quantumFragments: row.quantum_fragments || 0,
      prestigeCount: row.prestige_count || 0,
      rpgClass: row.rpg_class,
      equippedSkin: row.equipped_skin,
      equippedFrame: row.equipped_frame,
      equippedTheme: row.equipped_theme,
      schemaVersion: row.schema_version,
      updatedAt: row.updated_at
    };
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return this.mapProfile(data);
  }

  async saveUserProfile(profile: Partial<UserProfile>): Promise<void> {
    if (!profile.id) throw new Error('UserProfile ID is required for saving.');

    const payload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (profile.displayName !== undefined) payload.display_name = profile.displayName;
    if (profile.nickname !== undefined) payload.nickname = profile.nickname;
    if (profile.avatar !== undefined) payload.avatar = profile.avatar;
    if (profile.turma !== undefined) payload.turma = profile.turma;
    if (profile.role !== undefined) payload.role = profile.role;
    if (profile.bytes !== undefined) payload.bytes = profile.bytes;
    if (profile.totalBytesEarned !== undefined) payload.total_bytes_earned = profile.totalBytesEarned;
    if (profile.level !== undefined) payload.level = profile.level;
    if (profile.levelTokens !== undefined) payload.level_tokens = profile.levelTokens;
    if (profile.duelTokens !== undefined) payload.duel_tokens = profile.duelTokens;
    if (profile.quantumFragments !== undefined) payload.quantum_fragments = profile.quantumFragments;
    if (profile.prestigeCount !== undefined) payload.prestige_count = profile.prestigeCount;
    if (profile.rpgClass !== undefined) payload.rpg_class = profile.rpgClass;
    if (profile.equippedSkin !== undefined) payload.equipped_skin = profile.equippedSkin;
    if (profile.equippedFrame !== undefined) payload.equipped_frame = profile.equippedFrame;
    if (profile.equippedTheme !== undefined) payload.equipped_theme = profile.equippedTheme;

    const { error } = await this.client
      .from('profiles')
      .upsert({ id: profile.id, ...payload });

    if (error) {
      console.error('Supabase saveUserProfile error:', error);
      throw error;
    }
  }

  async recordGameSession(gameId: string, bytesEarned: number, session: GameSessionPayload): Promise<void> {
    const { data: userData } = await this.client.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated via Supabase Auth');

    const { error } = await this.client.rpc('record_game_session', {
      p_user_id: userData.user.id,
      p_game_id: gameId,
      p_bytes_earned: bytesEarned,
      p_high_score: session.score,
      p_metrics: session
    });

    if (error) {
      console.error('Supabase recordGameSession error:', error);
      throw error;
    }
  }

  async getLeaderboard(limitCount: number = 100): Promise<UserProfile[]> {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .order('total_bytes_earned', { ascending: false })
      .limit(limitCount);

    if (error || !data) return [];
    return data.map(this.mapProfile);
  }

  async getClassroomRanking(turma: string): Promise<UserProfile[]> {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('turma', turma)
      .order('total_bytes_earned', { ascending: false })
      .limit(100);

    if (error || !data) return [];
    return data.map(this.mapProfile);
  }

  async unlockCosmetic(userId: string, itemId: string, category: string): Promise<void> {
    const { error } = await this.client
      .from('user_cosmetics')
      .upsert({
        user_id: userId,
        item_id: itemId,
        item_category: category,
        unlocked_at: new Date().toISOString()
      }, { onConflict: 'user_id, item_id, item_category' });

    if (error) throw error;
  }

  async saveLegacyGameState(userId: string, state: GameState): Promise<void> {
    // Para manter compatibilidade do loop de sync com Supabase:
    // Mapeamos o GameState (JSON massivo) para os campos relacionais essenciais no Supabase
    
    await this.saveUserProfile({
      id: userId,
      displayName: state.studentName || '',
      nickname: state.studentNickname,
      avatar: state.studentAvatar,
      turma: state.studentClass,
      bytes: state.bytes,
      totalBytesEarned: state.totalBytesEarned,
      level: state.level || 1,
      levelTokens: state.cosmetics?.levelTokens || 0,
      duelTokens: state.cosmetics?.duelTokens || 0,
      quantumFragments: state.cosmetics?.quantumFragments || 0,
      prestigeCount: state.prestigeCount || 0,
      rpgClass: state.rpgClass,
      equippedSkin: state.cosmetics?.equippedSkin,
      equippedFrame: state.cosmetics?.equippedCardFrame,
      equippedTheme: state.cosmetics?.equippedTheme
    });

    // Idealmente, a transição total para Supabase removerá `saveLegacyGameState`,
    // mas isso satisfaz o `useGameSync` sem quebrar a compilação do hub agora.
  }
}
