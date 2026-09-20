import { GameState } from '../types';
import { AchievementDef, AchievementContext } from '../types/achievements';
import { ACHIEVEMENTS_CATALOG } from '../constants/achievementsCatalog';
import { DEFAULT_COSMETICS } from '../types/cosmetics';

/**
 * Avalia o catálogo e retorna apenas as conquistas que foram atingidas
 * mas que ainda não estão registradas em `state.achievements`.
 */
export function checkPendingAchievements(
  state: GameState,
  context?: AchievementContext
): AchievementDef[] {
  const unlockedMap = state.achievements || {};
  const newlyUnlocked: AchievementDef[] = [];

  for (const def of ACHIEVEMENTS_CATALOG) {
    if (unlockedMap[def.id]) {
      continue; // Já desbloqueada anteriormente
    }

    try {
      const result = def.evaluate(state, context);
      if (result.unlocked) {
        newlyUnlocked.push(def);
      }
    } catch (err) {
      console.warn(`Erro ao avaliar conquista [${def.id}]:`, err);
    }
  }

  return newlyUnlocked;
}

/**
 * Retorna o progresso detalhado de uma conquista para exibição na UI.
 */
export function getAchievementProgress(
  def: AchievementDef,
  state: GameState,
  context?: AchievementContext
): { current: number; max: number; percent: number; isUnlocked: boolean; unlockedAt?: number } {
  const unlockedAt = state.achievements?.[def.id];
  if (unlockedAt !== undefined) {
    return {
      current: def.maxProgress,
      max: def.maxProgress,
      percent: 100,
      isUnlocked: true,
      unlockedAt
    };
  }

  try {
    const res = def.evaluate(state, context);
    const current = Math.min(Math.max(res.currentProgress, 0), def.maxProgress);
    const percent = def.maxProgress > 0 ? Math.min(100, Math.round((current / def.maxProgress) * 100)) : 0;
    return {
      current,
      max: def.maxProgress,
      percent,
      isUnlocked: res.unlocked
    };
  } catch {
    return {
      current: 0,
      max: def.maxProgress,
      percent: 0,
      isUnlocked: false
    };
  }
}

/**
 * Retorna a contagem global de conquistas para badges e resumos.
 */
export function getOverallAchievementsStats(state: GameState): {
  unlocked: number;
  total: number;
  percent: number;
} {
  const total = ACHIEVEMENTS_CATALOG.length;
  const unlockedMap = state.achievements || {};
  const unlocked = ACHIEVEMENTS_CATALOG.filter((def) => !!unlockedMap[def.id]).length;
  const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0;

  return { unlocked, total, percent };
}

export interface RetroactiveSyncResult {
  updatedState: GameState;
  unlockedList: AchievementDef[];
  bonusBytes: number;
  bonusTokens: number;
  bonusFragments: number;
}

/**
 * Varre o histórico acumulado do aluno (nível, palavras, teclas, combos, cosméticos, duelos)
 * e registra retroativamente quaisquer conquistas cujos critérios já foram alcançados,
 * garantindo que alunos antigos ou saves recuperados recebam seus troféus e recompensas.
 */
export function syncRetroactiveAchievements(state: GameState): RetroactiveSyncResult {
  const pending = checkPendingAchievements(state);
  if (pending.length === 0) {
    return {
      updatedState: state,
      unlockedList: [],
      bonusBytes: 0,
      bonusTokens: 0,
      bonusFragments: 0
    };
  }

  let bonusBytes = 0;
  let bonusTokens = 0;
  let bonusFragments = 0;
  const updatedMap = { ...(state.achievements || {}) };
  const now = Date.now();

  pending.forEach((ach) => {
    updatedMap[ach.id] = now;
    if (ach.reward.bytes) bonusBytes += ach.reward.bytes;
    if (ach.reward.levelTokens) bonusTokens += ach.reward.levelTokens;
    if (ach.reward.quantumFragments) bonusFragments += ach.reward.quantumFragments;
  });

  const currentCosmetics = { ...(state.cosmetics || DEFAULT_COSMETICS) };
  currentCosmetics.levelTokens = (currentCosmetics.levelTokens || 0) + bonusTokens;
  currentCosmetics.quantumFragments = (currentCosmetics.quantumFragments || 0) + bonusFragments;

  const updatedState: GameState = {
    ...state,
    bytes: state.bytes + bonusBytes,
    totalBytesEarned: state.totalBytesEarned + bonusBytes,
    achievements: updatedMap,
    cosmetics: currentCosmetics
  };

  return {
    updatedState,
    unlockedList: pending,
    bonusBytes,
    bonusTokens,
    bonusFragments
  };
}

