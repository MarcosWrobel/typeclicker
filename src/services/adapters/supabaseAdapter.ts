import { SupabaseClient } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { IDatabaseService, UserProfile, GameSessionPayload } from '../dbInterface';
import { GameState } from '../../types';
import { DEFAULT_COSMETICS } from '../../types/cosmetics';
import { CloudLoadResponse, LeaderboardEntry, SeasonHistoryEntry } from '../../types/leaderboard';
import { calculatePlayerRank, calculatePPM, calculateAccuracy } from '../../utils/formatting';

export class SupabaseAdapter implements IDatabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = supabase;
  }

  private mapProfile(row: any): UserProfile {
    const totalBytes = Number(row.total_bytes_earned) || 0;
    const computedLevel = calculatePlayerRank(totalBytes).level;
    const effectiveLevel = Math.max(Number(row.level) || 1, computedLevel);

    return {
      id: row.id,
      displayName: row.display_name,
      email: row.email,
      nickname: row.nickname,
      avatar: row.avatar,
      turma: row.turma,
      role: row.role,
      bytes: Number(row.bytes) || 0,
      totalBytesEarned: totalBytes,
      seasonBytes: Number(row.season_bytes) || 0,
      level: effectiveLevel,
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
    if (!isSupabaseConfigured) return null;
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
    if (!isSupabaseConfigured) return;

    const payload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (profile.displayName !== undefined) payload.display_name = profile.displayName;
    if (profile.email !== undefined) payload.email = profile.email;
    if (profile.nickname !== undefined) payload.nickname = profile.nickname;
    if (profile.avatar !== undefined) payload.avatar = profile.avatar;
    if (profile.turma !== undefined) payload.turma = profile.turma;
    if (profile.role !== undefined) payload.role = profile.role;
    if (profile.bytes !== undefined) payload.bytes = Math.round(Number(profile.bytes) || 0);
    const totalBytes = profile.totalBytesEarned !== undefined ? Math.round(Number(profile.totalBytesEarned) || 0) : undefined;
    if (totalBytes !== undefined) payload.total_bytes_earned = totalBytes;
    if (profile.seasonBytes !== undefined) payload.season_bytes = Math.round(Number(profile.seasonBytes) || 0);
    if (profile.level !== undefined || totalBytes !== undefined) {
      const explicitLevel = Number(profile.level) || 1;
      const computed = totalBytes !== undefined ? calculatePlayerRank(totalBytes).level : 1;
      payload.level = Math.max(explicitLevel, computed);
    }
    if (profile.levelTokens !== undefined) payload.level_tokens = Math.round(Number(profile.levelTokens) || 0);
    if (profile.duelTokens !== undefined) payload.duel_tokens = Math.round(Number(profile.duelTokens) || 0);
    if (profile.quantumFragments !== undefined) payload.quantum_fragments = Math.round(Number(profile.quantumFragments) || 0);
    if (profile.prestigeCount !== undefined) payload.prestige_count = Math.round(Number(profile.prestigeCount) || 0);
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
    if (!isSupabaseConfigured) return;
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
    if (!isSupabaseConfigured) return [];
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .order('total_bytes_earned', { ascending: false })
      .limit(limitCount);

    if (error || !data) return [];
    return data.map(this.mapProfile);
  }

  private async enrichProfilesWithProgress(profiles: any[]): Promise<LeaderboardEntry[]> {
    if (!profiles || profiles.length === 0) return [];

    const userIds = profiles.map((p: any) => p.id).filter(Boolean);
    const progressMap = new Map<string, any[]>();

    if (userIds.length > 0) {
      try {
        // Busca paralela em lotes de 100 para respeitar limites do PostgREST
        for (let i = 0; i < userIds.length; i += 100) {
          const slice = userIds.slice(i, i + 100);
          const { data: progressRows, error: pErr } = await this.client
            .from('game_progress')
            .select('user_id, game_id, high_score, current_floor, highest_floor, metrics, state_payload, updated_at')
            .in('user_id', slice);

          if (!pErr && progressRows) {
            for (const row of progressRows) {
              const list = progressMap.get(row.user_id) || [];
              list.push(row);
              progressMap.set(row.user_id, list);
            }
          }
        }
      } catch (err) {
        console.warn('Aviso ao carregar game_progress para leaderboard:', err);
      }
    }

    return profiles.map((row: any): LeaderboardEntry => {
      const points = Number(row.total_bytes_earned) || 0;
      const computedLevel = calculatePlayerRank(points).level;
      const level = Math.max(Number(row.level) || 1, computedLevel);
      const isStaff = row.role === 'teacher' || row.role === 'admin';

      const userProgress = progressMap.get(row.id) || [];
      const tcRow = userProgress.find((p) => p.game_id === 'typeclicker');
      const tcState = (tcRow?.state_payload && typeof tcRow.state_payload === 'object') ? tcRow.state_payload : {};

      const correctKeys = Number(tcState.correctKeys) || 0;
      const wrongKeys = Number(tcState.wrongKeys) || 0;
      const totalActiveSeconds = Number(tcState.totalActiveSeconds) || 0;
      const computedPpm = calculatePPM(correctKeys, totalActiveSeconds);
      const computedAccuracy = calculateAccuracy(correctKeys, wrongKeys);
      const maxCombo = Number(tcState.maxCombo) || 0;

      const arenaStats = tcState.arenaStats || {};
      const pvpWins = Number(arenaStats.wins) || 0;
      const pvpMatches = Number(arenaStats.matchesPlayed) || 0;
      const pvpPoints = Number(arenaStats.duelPoints) || 0;

      const raceWins = Number(tcState.raceWins) || 0;
      const racesParticipated = Number(tcState.racesParticipated) || 0;
      const bestRaceWpm = Number(tcState.bestRaceWpm) || 0;
      const bestWpm = Math.max(computedPpm, bestRaceWpm, Number(arenaStats.highestWpm) || 0);

      // Métricas do Type: Radar
      const radarRow = userProgress.find((p) => p.game_id === 'radar' || p.game_id === 'type_radar');
      const radarStateStats = tcState.radarStats || {};
      const radarBestWave = Math.max(
        Number(radarStateStats.bestWave) || 1,
        Number(radarRow?.metrics?.extraMetrics?.bestWave || radarRow?.metrics?.levelReached || radarRow?.current_floor || 1)
      );
      const radarHighScore = Math.max(
        Number(radarStateStats.highScore) || 0,
        Number(radarRow?.high_score) || 0,
        Number(radarRow?.metrics?.score) || 0
      );
      const radarMaxWpm = Math.max(
        Number(radarStateStats.maxWpm) || 0,
        Number(radarRow?.metrics?.extraMetrics?.maxWpm) || 0
      );

      // Métricas do TyperDash
      const dashRow = userProgress.find((p) => p.game_id === 'dash' || p.game_id === 'typerdash');
      const dashStateStats = tcState.dashStats || {};
      const dashHighScore = Math.max(
        Number(dashStateStats.highScore) || 0,
        Number(dashRow?.high_score) || 0,
        Number(dashRow?.metrics?.score) || 0
      );
      const dashMaxDistance = Math.max(
        Number(dashStateStats.maxDistance) || 0,
        Number(dashRow?.metrics?.extraMetrics?.distanceMeters) || 0
      );
      const dashMaxCombo = Math.max(
        Number(dashStateStats.maxCombo) || 0,
        Number(dashRow?.metrics?.extraMetrics?.maxCombo) || 0
      );
      const dashBestClass = dashStateStats.bestClass || dashRow?.metrics?.extraMetrics?.studentClass || undefined;

      // Minijogos Adicionais do Hub (ByteQuest, SheetQuest, ScratchBot, ProgPlay)
      const bqRow = userProgress.find((p) => p.game_id === 'bytequest');
      const byteQuestHighScore = Math.max(Number(bqRow?.high_score) || 0, Number(bqRow?.metrics?.score) || 0);
      const byteQuestMaxFloor = Math.max(
        Number(bqRow?.highest_floor || bqRow?.current_floor) || 0,
        Number(bqRow?.metrics?.extraMetrics?.maxFloor || bqRow?.metrics?.levelReached) || 0
      );

      const sqRow = userProgress.find((p) => p.game_id === 'sheetquest');
      const sheetQuestHighScore = Math.max(Number(sqRow?.high_score) || 0, Number(sqRow?.metrics?.score) || 0);
      const sheetQuestCompletedQuests = Number(
        sqRow?.metrics?.extraMetrics?.completedQuests ||
        sqRow?.metrics?.extraMetrics?.levelsCompleted ||
        0
      );
      const sheetQuestCurrentLevel = Number(
        sqRow?.current_floor ||
        sqRow?.highest_floor ||
        sqRow?.metrics?.levelReached ||
        sqRow?.metrics?.extraMetrics?.levelReached ||
        (sheetQuestCompletedQuests > 0 ? sheetQuestCompletedQuests : 0)
      );
      const sheetQuestLastPlayedAt = sqRow?.updated_at || undefined;
      const lastLoginAt = row.updated_at || undefined;

      const sbRow = userProgress.find((p) => p.game_id === 'scratchbot');
      const scratchBotHighScore = Math.max(Number(sbRow?.high_score) || 0, Number(sbRow?.metrics?.score) || 0);

      const ppRow = userProgress.find((p) => p.game_id === 'progplay');
      const progPlayHighScore = Math.max(Number(ppRow?.high_score) || 0, Number(ppRow?.metrics?.score) || 0);

      // Data de Conquista do Nível 100
      let reachedLevel100At = tcState.reachedLevel100At;
      if (!reachedLevel100At && level >= 100) {
        reachedLevel100At = tcRow?.updated_at || row.updated_at || new Date().toISOString();
      }

      return {
        userId: row.id,
        nome: row.display_name || 'Aluno',
        email: row.email,
        apelido: row.nickname,
        turma: row.turma || '',
        level,
        points,
        seasonBytes: Number(row.season_bytes) || 0,
        wpm: computedPpm,
        bestWpm,
        accuracy: computedAccuracy,
        maxCombo,
        raceWins,
        racesParticipated,
        bestRaceWpm,
        pvpWins,
        pvpMatches,
        pvpPoints,
        radarBestWave,
        radarHighScore,
        radarMaxWpm,
        dashHighScore,
        dashMaxDistance,
        dashMaxCombo,
        dashBestClass,
        byteQuestHighScore,
        byteQuestMaxFloor,
        sheetQuestHighScore,
        sheetQuestCompletedQuests,
        sheetQuestCurrentLevel,
        sheetQuestLastPlayedAt,
        lastLoginAt,
        scratchBotHighScore,
        progPlayHighScore,
        reachedLevel100At,
        achievementsCount: tcState.achievements ? Object.keys(tcState.achievements).length : 0,
        avatar: row.avatar,
        updatedAt: row.updated_at || new Date().toISOString(),
        rpgClass: row.rpg_class,
        cardFrame: row.equipped_frame,
        isStaff
      };
    });
  }

  async getGlobalLeaderboard(forceRefresh: boolean = false): Promise<LeaderboardEntry[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .order('total_bytes_earned', { ascending: false })
      .limit(250);

    if (error || !data) return [];
    return this.enrichProfilesWithProgress(data);
  }

  async getSeasonLeaderboard(forceRefresh: boolean = false): Promise<LeaderboardEntry[]> {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .order('season_bytes', { ascending: false })
      .limit(250);

    if (error || !data) return [];
    return this.enrichProfilesWithProgress(data);
  }

  async getSeasonHistory(seasonId: string): Promise<SeasonHistoryEntry[]> {
    if (!isSupabaseConfigured) return [];
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
    if (!isSupabaseConfigured) return [];
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
    if (!isSupabaseConfigured) return 0;
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
    if (!isSupabaseConfigured) return [];
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
    if (!isSupabaseConfigured) return;
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
      let progressData: any = null;
      let profile: UserProfile | null = null;

      if (isSupabaseConfigured) {
        // 1. Tenta carregar o estado persistido completo da tabela game_progress
        const { data: pData, error: progressErr } = await this.client
          .from('game_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('game_id', 'typeclicker')
          .single();

        progressData = pData;
        const progressBytes = Number(progressData?.state_payload?.totalBytesEarned || progressData?.high_score || 0);

        if (!progressErr && progressData?.state_payload && Object.keys(progressData.state_payload).length > 0 && progressBytes > 0) {
          return {
            success: true,
            message: 'Save carregado do Supabase com sucesso!',
            saveState: progressData.state_payload,
            savedAt: new Date(progressData.updated_at).toLocaleString('pt-BR'),
            points: progressBytes
          };
        }

        // 2. Fallback: carrega os dados principais da tabela profiles
        profile = await this.getUserProfile(userId);
        const profileBytes = Number(profile?.totalBytesEarned || profile?.bytes || 0);
        if (profile && profileBytes > 0) {
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
      }

      // 3. Fallback Resiliente de Migração: se não encontrou no Supabase ou se o save estava com 0 bytes,
      // verifica se o aluno possui save histórico preservado no Cloud Firestore
      try {
        const { db } = await import('../firebaseService');
        const { doc, getDoc } = await import('firebase/firestore');
        const fsDoc = await getDoc(doc(db, 'saves', userId));
        if (fsDoc.exists()) {
          const fsData = fsDoc.data();
          const rawSave = (fsData?.saveState || {}) as Partial<GameState>;
          const fsTotalBytes = Math.round(Number(rawSave.totalBytesEarned || fsData?.points || 0));
          if (fsTotalBytes > 0) {
            if (isSupabaseConfigured) {
              console.log(`[SupabaseAdapter] Save legado recuperado do Firestore para ${userId}: ${fsTotalBytes} bytes. Sincronizando para Supabase...`);
              this.saveLegacyGameState(userId, rawSave as GameState).catch((err) => {
                console.warn('Erro ao salvar no Supabase após recuperar do Firestore:', err);
              });
            }
            return {
              success: true,
              message: 'Save recuperado da nuvem legada com sucesso!',
              saveState: rawSave,
              savedAt: new Date().toLocaleString('pt-BR'),
              points: fsTotalBytes
            };
          }
        }
      } catch (fsErr) {
        console.warn('Aviso: Fallback Firestore indisponível:', fsErr);
      }

      // 4. Se encontrou perfil ou progress com 0 bytes no Supabase, retorna como última opção
      if (progressData?.state_payload && Object.keys(progressData.state_payload).length > 0) {
        return {
          success: true,
          message: 'Save carregado do Supabase!',
          saveState: progressData.state_payload,
          savedAt: new Date(progressData.updated_at).toLocaleString('pt-BR'),
          points: 0
        };
      }

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
            quantumFragments: profile.quantumFragments
          }
        };
        return {
          success: true,
          message: 'Perfil Supabase carregado!',
          saveState: fallbackSaveState,
          points: 0
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
    if (!isSupabaseConfigured) return;
    const totalBytes = Math.round(Number(state.totalBytesEarned) || 0);
    const computedLevel = calculatePlayerRank(totalBytes).level;
    const effectiveLevel = Math.max(Number(state.level) || 1, computedLevel);

    // 1. Atualiza dados relacionais do perfil
    await this.saveUserProfile({
      id: userId,
      displayName: state.studentName || '',
      nickname: state.studentNickname,
      avatar: state.studentAvatar,
      turma: state.studentClass,
      bytes: state.bytes,
      totalBytesEarned: totalBytes,
      level: effectiveLevel,
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
      let stateToSave = state;
      if (effectiveLevel >= 100 && !stateToSave.reachedLevel100At) {
        stateToSave = {
          ...stateToSave,
          reachedLevel100At: new Date().toISOString()
        };
      }

      await this.client
        .from('game_progress')
        .upsert({
          user_id: userId,
          game_id: 'typeclicker',
          high_score: totalBytes,
          state_payload: stateToSave,
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

    const studentsOnly = data.filter((row: any) => row.role !== 'teacher' && row.role !== 'admin');
    return this.enrichProfilesWithProgress(studentsOnly);
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
    await this.client.from('user_achievements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
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

