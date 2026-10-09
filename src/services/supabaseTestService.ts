import { supabase, isSupabaseConfigured } from './supabaseClient';
import { calculateMinBytesForLevel } from '../data/levels';
import { calculatePlayerRank } from '../utils/formatting';
import { UPGRADES } from '../data/upgrades';
import { INITIAL_STATE } from '../utils/storage';
import { DEFAULT_COSMETICS } from '../types/cosmetics';
import { getAllUnlockedCosmetics } from '../constants/cosmeticsCatalog';
import {
  auth,
  getSystemSettings,
  updateSystemSettings,
  saveSystemSettings,
  checkIsAdminAsync,
  ADMIN_EMAILS,
  TestGrantConfig
} from './firebaseService';
import { GameState } from '../types';

export interface TargetAccountData {
  exists: boolean;
  userId?: string;
  name: string;
  turma: string;
  email?: string;
  role?: string;
  currentLevel: number;
  currentBytes: number;
  levelTokens: number;
  duelTokens: number;
  quantumFragments: number;
}

export interface SupabaseTestGrantPayload {
  userId?: string;
  email?: string;
  identifier: string; // e-mail, ID ou nome do aluno
  addLevelTokens?: number;
  addDuelTokens?: number;
  addQuantumFragments?: number;
  levelAction?: 'add_levels' | 'set_level';
  levelAmount?: number;
  unlockAllCosmetics?: boolean;
  maxUpgrades?: boolean;
  resetToLevel1?: boolean;
  notes?: string;
}

export interface SupabaseTestGrantResult {
  success: boolean;
  message: string;
  record: TestGrantConfig;
  updatedSaveState?: GameState;
  resultingLevel: number;
  resultingTokens: number;
  resultingDuelTokens: number;
}

/**
 * Busca uma conta de aluno ou professor diretamente no Supabase (PostgreSQL).
 * Aceita busca direta por ID primário do Supabase ou por e-mail/nome.
 */
export async function findTargetAccount(
  identifier: string,
  userId?: string
): Promise<TargetAccountData> {
  const cleanId = (userId || '').trim();
  const cleanIdentifier = identifier.trim().toLowerCase();
  const isTeacher = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanIdentifier);

  if (!isSupabaseConfigured) {
    return {
      exists: false,
      name: identifier.split('@')[0],
      turma: 'Sem turma',
      currentLevel: 1,
      currentBytes: 0,
      levelTokens: 0,
      duelTokens: 0,
      quantumFragments: 0
    };
  }

  try {
    let profileData: any = null;

    // 1. Busca prioritária por ID unívoco (se fornecido)
    if (cleanId) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', cleanId)
        .maybeSingle();

      if (!error && data) {
        profileData = data;
      }
    }

    // 2. Busca por e-mail, ID ou nome de exibição
    if (!profileData && cleanIdentifier) {
      // Tenta busca exata por ID ou e-mail
      const { data: exactMatches } = await supabase
        .from('profiles')
        .select('*')
        .or(`id.eq.${cleanIdentifier},email.eq.${cleanIdentifier}`)
        .limit(1);

      if (exactMatches && exactMatches.length > 0) {
        profileData = exactMatches[0];
      } else {
        // Tenta busca por nome
        const { data: nameMatches } = await supabase
          .from('profiles')
          .select('*')
          .ilike('display_name', `%${cleanIdentifier}%`)
          .limit(1);

        if (nameMatches && nameMatches.length > 0) {
          profileData = nameMatches[0];
        }
      }
    }

    if (profileData) {
      const isStaffAccount = isTeacher || profileData.role === 'teacher' || profileData.role === 'admin';
      const effectiveTurma = isStaffAccount
        ? 'Professor'
        : (profileData.turma || 'Sem turma');

      const bytes = Number(profileData.total_bytes_earned) || Number(profileData.bytes) || 0;
      const rank = calculatePlayerRank(bytes);

      return {
        exists: true,
        userId: profileData.id,
        name: profileData.display_name || profileData.nickname || cleanIdentifier.split('@')[0],
        turma: effectiveTurma,
        email: profileData.email || (cleanIdentifier.includes('@') ? cleanIdentifier : undefined),
        role: profileData.role || 'student',
        currentLevel: Number(profileData.level) || rank.level,
        currentBytes: bytes,
        levelTokens: Number(profileData.level_tokens) || 0,
        duelTokens: Number(profileData.duel_tokens) || 0,
        quantumFragments: Number(profileData.quantum_fragments) || 0
      };
    }
  } catch (err) {
    console.error('Erro ao buscar conta no Supabase:', err);
  }

  // Conta ainda não criada no Supabase
  return {
    exists: false,
    name: isTeacher ? 'Prof. Marcos Wrobel' : (cleanIdentifier.includes('@') ? cleanIdentifier.split('@')[0] : cleanIdentifier),
    turma: isTeacher ? 'Professor' : 'Conta nova (será criada ao logar)',
    email: cleanIdentifier.includes('@') ? cleanIdentifier : undefined,
    role: isTeacher ? 'teacher' : 'student',
    currentLevel: 1,
    currentBytes: 0,
    levelTokens: 0,
    duelTokens: 0,
    quantumFragments: 0
  };
}

/**
 * Concede recursos pedagógicos e de teste diretamente no Supabase:
 * - Atualiza profiles (level, bytes, level_tokens, duel_tokens, quantum_fragments)
 * - Se unlockAllCosmetics: insere todos os itens em user_cosmetics
 * - Se game_progress existir: atualiza o snapshot do jogo (state_payload)
 * - Registra no histórico de auditoria do sistema
 */
export async function applyTestGrantToSupabase(
  grant: SupabaseTestGrantPayload
): Promise<SupabaseTestGrantResult> {
  const user = auth.currentUser;
  const isAdmin = await checkIsAdminAsync(user);
  if (!isAdmin) {
    throw new Error('Não autorizado: Somente administradores podem conceder recursos de teste.');
  }

  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado.');
  }

  // 1. Localiza a conta no Supabase
  const account = await findTargetAccount(grant.identifier, grant.userId);
  const cleanEmail = (grant.email || account.email || grant.identifier).trim().toLowerCase();

  // 2. Garante que o e-mail/identificador está na lista de testadores cadastrados
  const settings = await getSystemSettings();
  const currentTesters = [...(settings?.testerEmails || [])];
  if (cleanEmail && !currentTesters.map(e => e.toLowerCase()).includes(cleanEmail)) {
    currentTesters.push(cleanEmail);
  }

  let resultingLevel = 1;
  let resultingBytes = 0;
  let resultingTotalBytes = 0;
  let resultingTokens = 0;
  let resultingDuelTokens = 0;
  let resultingQuantumFragments = 0;
  let updatedGameState: GameState | undefined;
  let appliedDirectly = false;

  if (account.exists && account.userId) {
    appliedDirectly = true;
    const targetUserId = account.userId;

    // A. Cálculo de nível e bytes
    if (grant.resetToLevel1) {
      resultingLevel = 1;
      resultingBytes = 0;
      resultingTotalBytes = 0;
      resultingTokens = 0;
      resultingDuelTokens = 0;
      resultingQuantumFragments = 0;
    } else {
      const currentLevel = account.currentLevel || 1;
      if (grant.levelAction === 'add_levels') {
        const increment = Math.max(1, grant.levelAmount || 1);
        resultingLevel = Math.min(100, currentLevel + increment);
      } else if (grant.levelAction === 'set_level') {
        resultingLevel = Math.min(100, Math.max(1, grant.levelAmount || 1));
      } else {
        resultingLevel = currentLevel;
      }

      const minBytes = calculateMinBytesForLevel(resultingLevel);
      resultingTotalBytes = Math.max(account.currentBytes || 0, minBytes);
      resultingBytes = resultingTotalBytes;

      resultingTokens = (account.levelTokens || 0) + (grant.addLevelTokens || 0);
      resultingDuelTokens = (account.duelTokens || 0) + (grant.addDuelTokens || 0);
      resultingQuantumFragments = (account.quantumFragments || 0) + (grant.addQuantumFragments || 0);
    }

    // B. Atualização na tabela profiles
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({
        level: resultingLevel,
        bytes: resultingBytes,
        total_bytes_earned: resultingTotalBytes,
        level_tokens: resultingTokens,
        duel_tokens: resultingDuelTokens,
        quantum_fragments: resultingQuantumFragments,
        updated_at: new Date().toISOString()
      })
      .eq('id', targetUserId);

    if (profileErr) {
      throw new Error(`Falha ao atualizar perfil no Supabase: ${profileErr.message}`);
    }

    // C. Desbloqueio de cosméticos na tabela user_cosmetics (se solicitado)
    if (grant.unlockAllCosmetics && !grant.resetToLevel1) {
      const allCosmetics = getAllUnlockedCosmetics();
      const cosmeticRows: { user_id: string; item_id: string; item_category: string }[] = [];

      allCosmetics.unlockedThemes.forEach(id => cosmeticRows.push({ user_id: targetUserId, item_id: id, item_category: 'theme' }));
      allCosmetics.unlockedSkins.forEach(id => cosmeticRows.push({ user_id: targetUserId, item_id: id, item_category: 'skin' }));
      allCosmetics.unlockedSounds.forEach(id => cosmeticRows.push({ user_id: targetUserId, item_id: id, item_category: 'sound' }));
      allCosmetics.unlockedLayouts.forEach(id => cosmeticRows.push({ user_id: targetUserId, item_id: id, item_category: 'layout' }));
      allCosmetics.unlockedAnimations.forEach(id => cosmeticRows.push({ user_id: targetUserId, item_id: id, item_category: 'animation' }));
      allCosmetics.unlockedCardFrames.forEach(id => cosmeticRows.push({ user_id: targetUserId, item_id: id, item_category: 'cardFrame' }));

      if (cosmeticRows.length > 0) {
        await supabase
          .from('user_cosmetics')
          .upsert(cosmeticRows, { onConflict: 'user_id, item_id, item_category' });
      }
    }

    // D. Atualização do payload do jogo na tabela game_progress
    try {
      const { data: progressRow } = await supabase
        .from('game_progress')
        .select('*')
        .eq('user_id', targetUserId)
        .eq('game_id', 'typeclicker')
        .maybeSingle();

      let currentPayload: GameState = progressRow?.state_payload && Object.keys(progressRow.state_payload).length > 0
        ? { ...INITIAL_STATE, ...progressRow.state_payload }
        : {
            ...INITIAL_STATE,
            studentName: account.name,
            studentClass: account.turma,
            cosmetics: { ...DEFAULT_COSMETICS }
          };

      if (grant.resetToLevel1) {
        currentPayload = {
          ...INITIAL_STATE,
          studentName: account.name,
          studentClass: account.turma,
          cosmetics: { ...DEFAULT_COSMETICS }
        };
      } else {
        currentPayload.level = resultingLevel;
        currentPayload.bytes = resultingBytes;
        currentPayload.totalBytesEarned = resultingTotalBytes;

        const cosm = currentPayload.cosmetics ? { ...currentPayload.cosmetics } : { ...DEFAULT_COSMETICS };
        cosm.levelTokens = resultingTokens;
        cosm.duelTokens = resultingDuelTokens;
        cosm.quantumFragments = resultingQuantumFragments;

        if (grant.unlockAllCosmetics) {
          currentPayload.cosmetics = getAllUnlockedCosmetics(cosm);
        } else {
          currentPayload.cosmetics = cosm;
        }

        if (grant.maxUpgrades) {
          const maxed: Record<string, number> = {};
          for (const u of UPGRADES) maxed[u.id] = 50;
          currentPayload.upgrades = maxed;
        }
      }

      await supabase
        .from('game_progress')
        .upsert({
          user_id: targetUserId,
          game_id: 'typeclicker',
          high_score: Math.round(Number(resultingTotalBytes) || 0),
          state_payload: currentPayload,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, game_id' });

      updatedGameState = currentPayload;
    } catch (progressErr) {
      console.warn('Aviso: save de game_progress não pôde ser sincronizado:', progressErr);
    }
  }

  // 3. Monta registro de concessão para auditoria
  const grantRecord: TestGrantConfig = {
    id: `grant_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail || account.userId || 'usuario_teste',
    addLevelTokens: grant.addLevelTokens,
    addDuelTokens: grant.addDuelTokens,
    addQuantumFragments: grant.addQuantumFragments,
    levelAction: grant.levelAction,
    levelAmount: grant.levelAmount,
    unlockAllCosmetics: grant.unlockAllCosmetics,
    maxUpgrades: grant.maxUpgrades,
    resetToLevel1: grant.resetToLevel1,
    notes: grant.notes,
    grantedAt: new Date().toISOString(),
    grantedBy: user?.email || 'admin',
    appliedDirectlyToSave: appliedDirectly,
    resultingLevel,
    resultingLevelTokens: resultingTokens,
    resultingDuelTokens: resultingDuelTokens,
    resultingQuantumFragments: resultingQuantumFragments
  };

  // 4. Salva histórico e pendências (caso a conta ainda não exista no Supabase)
  try {
    const currentHistory = settings?.testGrantsHistory || [];
    const updatedHistory = [grantRecord, ...currentHistory].slice(0, 50);
    const pendingGrants = { ...(settings?.pendingTestGrants || {}) };

    if (!appliedDirectly && cleanEmail) {
      pendingGrants[cleanEmail] = grantRecord;
    }

    await updateSystemSettings({
      testerEmails: currentTesters,
      pendingTestGrants: pendingGrants,
      testGrantsHistory: updatedHistory
    });
  } catch (settingsErr) {
    console.warn('Aviso: falha ao registrar auditoria em system/settings:', settingsErr);
  }

  let message = `Recursos de teste concedidos com sucesso para ${account.name}!`;
  if (appliedDirectly) {
    message += ` Gravado no Supabase (Nível: ${resultingLevel}, Tokens: ${resultingTokens} 🪙, Duelo: ${resultingDuelTokens} ⚔️).`;
  } else {
    message += ` Concessão agendada na nuvem. Os recursos serão atribuídos no Supabase assim que ${cleanEmail} efetuar login.`;
  }

  return {
    success: true,
    message,
    record: grantRecord,
    updatedSaveState: updatedGameState,
    resultingLevel,
    resultingTokens,
    resultingDuelTokens
  };
}

/**
 * Aplica concessões pendentes para o aluno assim que ele loga ou conecta ao Supabase.
 */
export async function claimPendingTestGrantsSupabase(
  userId: string,
  userEmail: string,
  currentState: GameState
): Promise<{ claimed: boolean; updatedState: GameState; message?: string }> {
  if (!userId && !userEmail) return { claimed: false, updatedState: currentState };

  if (!isSupabaseConfigured) {
    return { claimed: false, updatedState: currentState };
  }

  const cleanEmail = (userEmail || '').trim().toLowerCase();
  const cleanUserId = (userId || '').trim();

  try {
    const settings = await getSystemSettings();
    const pendingGrants = settings?.pendingTestGrants || {};
    const grant = (cleanEmail && pendingGrants[cleanEmail]) || (cleanUserId && pendingGrants[cleanUserId]);
    if (!grant) return { claimed: false, updatedState: currentState };

    const claimedGrantIds: string[] = Array.isArray(currentState.claimedGrantIds)
      ? currentState.claimedGrantIds
      : [];

    if (grant.id && claimedGrantIds.includes(grant.id)) {
      return { claimed: false, updatedState: currentState };
    }

    const updatedState: GameState = {
      ...currentState,
      claimedGrantIds: grant.id ? [...claimedGrantIds, grant.id] : claimedGrantIds,
      cosmetics: currentState.cosmetics ? { ...currentState.cosmetics } : { ...DEFAULT_COSMETICS }
    };

    let modified = false;

    // Tokens
    if (grant.addLevelTokens && grant.addLevelTokens > 0) {
      updatedState.cosmetics!.levelTokens = (updatedState.cosmetics!.levelTokens || 0) + grant.addLevelTokens;
      modified = true;
    }
    if (grant.addDuelTokens && grant.addDuelTokens > 0) {
      updatedState.cosmetics!.duelTokens = (updatedState.cosmetics!.duelTokens || 0) + grant.addDuelTokens;
      modified = true;
    }
    if (grant.addQuantumFragments && grant.addQuantumFragments > 0) {
      updatedState.cosmetics!.quantumFragments = (updatedState.cosmetics!.quantumFragments || 0) + grant.addQuantumFragments;
      modified = true;
    }

    // Nível
    if (grant.levelAction === 'add_levels') {
      const currentRank = calculatePlayerRank(updatedState.totalBytesEarned || 0);
      const targetLevel = Math.min(100, currentRank.level + (grant.levelAmount || 1));
      const requiredBytes = calculateMinBytesForLevel(targetLevel);
      updatedState.level = targetLevel;
      updatedState.totalBytesEarned = Math.max(updatedState.totalBytesEarned || 0, requiredBytes);
      updatedState.bytes = Math.max(updatedState.bytes || 0, requiredBytes);
      modified = true;
    } else if (grant.levelAction === 'set_level') {
      const targetLevel = Math.min(100, Math.max(1, grant.levelAmount || 1));
      const requiredBytes = calculateMinBytesForLevel(targetLevel);
      updatedState.level = targetLevel;
      updatedState.totalBytesEarned = Math.max(updatedState.totalBytesEarned || 0, requiredBytes);
      updatedState.bytes = Math.max(updatedState.bytes || 0, requiredBytes);
      modified = true;
    }

    if (grant.resetToLevel1) {
      updatedState.level = 1;
      updatedState.totalBytesEarned = 0;
      updatedState.bytes = 0;
      updatedState.cosmetics = { ...DEFAULT_COSMETICS };
      modified = true;
    }

    // Cosméticos
    if (grant.unlockAllCosmetics && !grant.resetToLevel1) {
      updatedState.cosmetics = getAllUnlockedCosmetics(updatedState.cosmetics);
      modified = true;
    }

    // Upgrades
    if (grant.maxUpgrades && !grant.resetToLevel1) {
      const maxUpgrades: Record<string, number> = {};
      for (const u of UPGRADES) {
        maxUpgrades[u.id] = 50;
      }
      updatedState.upgrades = maxUpgrades;
      modified = true;
    }

    // Persiste no Supabase caso userId esteja disponível
    if (cleanUserId) {
      try {
        await supabase
          .from('game_progress')
          .upsert({
            user_id: cleanUserId,
            game_id: 'typeclicker',
            high_score: Math.round(Number(updatedState.totalBytesEarned) || 0),
            state_payload: updatedState,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id, game_id' });
      } catch (errSupabase) {
        console.warn('Aviso: save de game_progress no Supabase falhou:', errSupabase);
      }
    }

    // Remove das pendências se tiver permissão
    try {
      const updatedPending = { ...(settings?.pendingTestGrants || {}) };
      if (cleanEmail) delete updatedPending[cleanEmail];
      if (cleanUserId) delete updatedPending[cleanUserId];

      await saveSystemSettings({
        pendingTestGrants: updatedPending
      });
    } catch {
      // Ignora erro de permissão caso o usuário conectado seja aluno sem privilégio de SuperAdmin
    }

    return {
      claimed: modified,
      updatedState,
      message: `Recursos de teste atribuídos pelo professor foram ativados na sua conta!`
    };
  } catch (err) {
    console.error('Erro ao resgatar concessões pendentes no Supabase:', err);
    return { claimed: false, updatedState: currentState };
  }
}
