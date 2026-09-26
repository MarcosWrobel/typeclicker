import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IDatabaseService, UserProfile, GameSessionPayload } from '../dbInterface';
import { GameState } from '../../types';
import { DEFAULT_COSMETICS } from '../../types/cosmetics';
import { CloudLoadResponse, LeaderboardEntry, SeasonHistoryEntry } from '../../types/leaderboard';

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
      seasonBytes: Number(row.season_bytes) || 0,
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
    if (profile.seasonBytes !== undefined) payload.season_bytes = profile.seasonBytes;
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

  async recordGameSession(userId: string, gameId: string, bytesEarned: number, session: GameSessionPayload): Promise<void> {
    if (!userId) throw new Error('User ID is required for recordGameSession');
    const safeBytes = Math.max(0, Math.floor(bytesEarned || 0));

    const { error } = await this.client.rpc('record_game_session', {
      p_user_id: userId,
      p_game_id: gameId,
      p_bytes_earned: safeBytes,
      p_high_score: Math.max(0, Math.floor(session.score || 0)),
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

  async getGlobalLeaderboard(forceRefresh: boolean = false): Promise<LeaderboardEntry[]> {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .order('total_bytes_earned', { ascending: false })
      .limit(250);

    if (error || !data) return [];
    return data.map((row: any): LeaderboardEntry => ({
      userId: row.id,
      nome: row.display_name || 'Aluno',
      apelido: row.nickname,
      turma: row.turma || '',
      level: row.level || 1,
      points: Number(row.total_bytes_earned) || 0,
      seasonBytes: Number(row.season_bytes) || 0,
      wpm: 0,
      avatar: row.avatar,
      updatedAt: row.updated_at || new Date().toISOString(),
      rpgClass: row.rpg_class,
      cardFrame: row.equipped_frame,
      isStaff: row.role === 'teacher' || row.role === 'admin'
    }));
  }

  async getSeasonLeaderboard(forceRefresh: boolean = false): Promise<LeaderboardEntry[]> {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .order('season_bytes', { ascending: false })
      .limit(250);

    if (error || !data) return [];
    return data.map((row: any): LeaderboardEntry => ({
      userId: row.id,
      nome: row.display_name || 'Aluno',
      apelido: row.nickname,
      turma: row.turma || '',
      level: row.level || 1,
      points: Number(row.total_bytes_earned) || 0,
      seasonBytes: Number(row.season_bytes) || 0,
      wpm: 0,
      avatar: row.avatar,
      updatedAt: row.updated_at || new Date().toISOString(),
      rpgClass: row.rpg_class,
      cardFrame: row.equipped_frame,
      isStaff: row.role === 'teacher' || row.role === 'admin'
    }));
  }

  async getSeasonHistory(seasonId: string): Promise<SeasonHistoryEntry[]> {
    const { data, error } = await this.client
      .from('season_history')
      .select('*')
      .eq('season_id', seasonId)
      .order('rank_position', { ascending: true });

    if (error || !data) return [];
    return data.map((row: any): SeasonHistoryEntry => ({
      id: row.id,
      seasonId: row.season_id,
      seasonName: row.season_name,
      userId: row.user_id,
      displayName: row.display_name,
      turma: row.turma,
      seasonBytes: Number(row.season_bytes) || 0,
      rankPosition: row.rank_position || 1,
      closedAt: row.closed_at
    }));
  }

  async getArchivedSeasonsList(): Promise<{ seasonId: string; seasonName: string; closedAt: string }[]> {
    const { data, error } = await this.client
      .from('season_history')
      .select('season_id, season_name, closed_at')
      .order('closed_at', { ascending: false });

    if (error || !data) return [];
    const seen = new Set<string>();
    const list: { seasonId: string; seasonName: string; closedAt: string }[] = [];
    for (const item of data) {
      if (!seen.has(item.season_id)) {
        seen.add(item.season_id);
        list.push({
          seasonId: item.season_id,
          seasonName: item.season_name,
          closedAt: item.closed_at
        });
      }
    }
    return list;
  }

  async closeCurrentSeason(seasonId: string, seasonName: string): Promise<number> {
    const { data, error } = await this.client.rpc('close_current_season', {
      p_season_id: seasonId,
      p_season_name: seasonName
    });

    if (error) {
      console.error('Supabase closeCurrentSeason error:', error);
      throw error;
    }

    return Number(data) || 0;
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

  async loadGameState(userId: string): Promise<CloudLoadResponse> {
    try {
      // 1. Tenta carregar o estado persistido completo da tabela game_progress
      const { data: progressData, error: progressErr } = await this.client
        .from('game_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('game_id', 'typeclicker')
        .single();

      if (!progressErr && progressData?.state_payload && Object.keys(progressData.state_payload).length > 0) {
        return {
          success: true,
          message: 'Save carregado do Supabase com sucesso!',
          saveState: progressData.state_payload,
          savedAt: new Date(progressData.updated_at).toLocaleString('pt-BR'),
          points: progressData.high_score
        };
      }

      // 2. Fallback: carrega os dados principais da tabela profiles
      const profile = await this.getUserProfile(userId);
      if (profile) {
        const fallbackSaveState: Partial<GameState> = {
          studentName: profile.displayName,
          studentNickname: profile.nickname,
          studentClass: profile.turma,
          bytes: profile.bytes,
          totalBytesEarned: profile.totalBytesEarned,
          rpgClass: profile.rpgClass as any,
          cosmetics: {
            ...DEFAULT_COSMETICS,
            levelTokens: profile.levelTokens,
            duelTokens: profile.duelTokens,
            quantumFragments: profile.quantumFragments,
            equippedSkin: (profile.equippedSkin as any) || DEFAULT_COSMETICS.equippedSkin,
            equippedCardFrame: (profile.equippedFrame as any) || DEFAULT_COSMETICS.equippedCardFrame,
            equippedTheme: (profile.equippedTheme as any) || DEFAULT_COSMETICS.equippedTheme
          }
        };

        return {
          success: true,
          message: 'Perfil Supabase carregado!',
          saveState: fallbackSaveState,
          points: profile.totalBytesEarned
        };
      }

      return {
        success: false,
        message: 'Nenhum save encontrado no Supabase.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Erro ao carregar do Supabase: ${err.message}`
      };
    }
  }

  async saveLegacyGameState(userId: string, state: GameState): Promise<void> {
    // 1. Atualiza dados relacionais do perfil
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

    // 2. Persiste snapshot integral do jogo no schema game_progress
    try {
      await this.client
        .from('game_progress')
        .upsert({
          user_id: userId,
          game_id: 'typeclicker',
          high_score: state.totalBytesEarned || 0,
          state_payload: state,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, game_id' });
    } catch (err) {
      console.warn('Erro ao salvar snapshot em game_progress:', err);
    }
  }

  async getAdminDashboardData(turmaFilter?: string): Promise<LeaderboardEntry[]> {
    let query = this.client
      .from('profiles')
      .select('*')
      .order('total_bytes_earned', { ascending: false });

    const cleanTurma = (turmaFilter || '').trim();
    if (cleanTurma && cleanTurma.toLowerCase() !== 'todas' && cleanTurma.toLowerCase() !== 'all') {
      query = query.eq('turma', cleanTurma);
    }

    const { data, error } = await query.limit(300);
    if (error || !data) {
      console.error('Supabase getAdminDashboardData error:', error);
      return [];
    }

    return data
      .filter((row: any) => row.role !== 'teacher' && row.role !== 'admin')
      .map((row: any): LeaderboardEntry => ({
        userId: row.id,
        nome: row.display_name || 'Aluno',
        apelido: row.nickname,
        turma: row.turma || '',
        level: row.level || 1,
        points: Number(row.total_bytes_earned) || 0,
        seasonBytes: Number(row.season_bytes) || 0,
        wpm: 0,
        avatar: row.avatar,
        updatedAt: row.updated_at || new Date().toISOString(),
        rpgClass: row.rpg_class,
        cardFrame: row.equipped_frame,
        isStaff: false
      }));
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
    const payload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (updates.turma !== undefined) payload.turma = updates.turma;
    if (updates.rpgClass !== undefined) payload.rpg_class = updates.rpgClass;

    const { error } = await this.client
      .from('profiles')
      .update(payload)
      .eq('id', studentUserId);

    if (error) {
      console.error('Supabase adminUpdateStudentProfile error:', error);
      throw error;
    }

    try {
      const { data: progress } = await this.client
        .from('game_progress')
        .select('state_payload')
        .eq('user_id', studentUserId)
        .eq('game_id', 'typeclicker')
        .single();

      if (progress?.state_payload) {
        const nextPayload = {
          ...progress.state_payload,
          ...(updates.turma !== undefined ? { studentClass: updates.turma } : {}),
          ...(updates.rpgClass !== undefined ? { rpgClass: updates.rpgClass } : {}),
          ...(updates.isClassLocked !== undefined ? { isClassLocked: updates.isClassLocked } : {}),
          ...(updates.isRpgClassLocked !== undefined ? { isRpgClassLocked: updates.isRpgClassLocked } : {})
        };
        await this.client
          .from('game_progress')
          .update({ state_payload: nextPayload, updated_at: new Date().toISOString() })
          .eq('user_id', studentUserId)
          .eq('game_id', 'typeclicker');
      }
    } catch (e) {
      console.warn('Aviso: save de game_progress não pôde ser atualizado:', e);
    }
  }

  async adminAutoBalanceRpgClasses(turma: string): Promise<{ updatedCount: number; distribution: Record<string, number> }> {
    const classes = ['guerreiro', 'mago', 'arqueiro', 'clerigo', 'ladino'];
    const { data: students, error } = await this.client
      .from('profiles')
      .select('id, rpg_class')
      .eq('turma', turma);

    if (error || !students) throw new Error(error?.message || 'Falha ao buscar alunos da turma.');

    const distribution: Record<string, number> = {
      guerreiro: 0,
      mago: 0,
      arqueiro: 0,
      clerigo: 0,
      ladino: 0
    };

    let updatedCount = 0;
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const assignedClass = classes[i % classes.length];
      distribution[assignedClass] = (distribution[assignedClass] || 0) + 1;

      if (student.rpg_class !== assignedClass) {
        await this.client
          .from('profiles')
          .update({ rpg_class: assignedClass, updated_at: new Date().toISOString() })
          .eq('id', student.id);
        updatedCount++;
      }
    }

    return { updatedCount, distribution };
  }

  async wipeDatabase(): Promise<void> {
    await this.client.from('game_sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.client.from('season_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.client.from('game_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.client.from('user_cosmetics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.client
      .from('profiles')
      .update({
        bytes: 0,
        total_bytes_earned: 0,
        season_bytes: 0,
        level: 1,
        level_tokens: 0,
        duel_tokens: 0,
        quantum_fragments: 0,
        prestige_count: 0
      })
      .neq('role', 'admin')
      .neq('role', 'teacher');
  }

  async sanitizeStaffLeaderboard(): Promise<{ removedCount: number; checkedCount: number }> {
    const { data: staffMembers } = await this.client
      .from('profiles')
      .select('id, role')
      .or('role.eq.teacher,role.eq.admin');

    if (!staffMembers || staffMembers.length === 0) {
      return { removedCount: 0, checkedCount: 0 };
    }

    const { error } = await this.client
      .from('profiles')
      .update({
        total_bytes_earned: 0,
        season_bytes: 0
      })
      .or('role.eq.teacher,role.eq.admin');

    return {
      removedCount: error ? 0 : staffMembers.length,
      checkedCount: staffMembers.length
    };
  }
}

