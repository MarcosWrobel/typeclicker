import { GameState, KeyTelemetry } from '../types';
import {
  QuestsState,
  WeeklyQuestDef,
  WeeklyQuestProgress,
  QuestEvent,
  QuestReward,
  RpgFloorData,
  RpgBoss
} from '../types/quests';
import { RPG_BOSSES, RPG_BASE_CHAPTERS, ADAPTIVE_RPG_LORE } from '../data/rpgChronicles';
import { identificarTeclasFracas } from './adaptiveDrillEngine';
import { DEFAULT_COSMETICS } from '../types/cosmetics';

/**
 * Retorna o identificador de ciclo semanal no formato ISO (ex: "2026-W38")
 */
export function getCurrentWeekId(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Retorna milissegundos restantes até a próxima segunda-feira às 00:00 UTC
 */
export function getMsUntilNextWeeklyReset(): number {
  const now = new Date();
  const nextMonday = new Date(now.getTime());
  const currentDay = now.getUTCDay(); // 0 = Domingo, 1 = Segunda, ...
  const daysUntilMonday = ((8 - currentDay) % 7) || 7;
  nextMonday.setUTCDate(now.getUTCDate() + daysUntilMonday);
  nextMonday.setUTCHours(0, 0, 0, 0);
  return Math.max(0, nextMonday.getTime() - now.getTime());
}

/**
 * Catálogo mestre de possíveis missões semanais
 */
export const WEEKLY_QUEST_CATALOG: WeeklyQuestDef[] = [
  // --- VOLUME ---
  {
    id: 'weekly_words_350',
    title: 'Datilógrafo Dedicado',
    description: 'Digite 350 palavras no terminal principal durante a semana.',
    icon: '📚',
    category: 'volume',
    target: 350,
    unit: 'palavras',
    reward: { bytes: 12000, levelTokens: 2 }
  },
  {
    id: 'weekly_keystrokes_2000',
    title: 'Torrente de Bytes',
    description: 'Acumule 2.000 teclas corretas digitadas no laboratório.',
    icon: '⌨️',
    category: 'volume',
    target: 2000,
    unit: 'teclas',
    reward: { bytes: 15000, levelTokens: 2 }
  },
  // --- PRECISÃO ---
  {
    id: 'weekly_accuracy_streak',
    title: 'Precisão Impecável',
    description: 'Complete 40 palavras mantendo precisão superior a 96%.',
    icon: '🎯',
    category: 'accuracy',
    target: 40,
    unit: 'palavras perfeitas',
    reward: { bytes: 18000, levelTokens: 3 }
  },
  {
    id: 'weekly_high_combo',
    title: 'Ritmo Absoluto',
    description: 'Atinja ou renove 15 vezes um combo mínimo de 50 caracteres.',
    icon: '⚡',
    category: 'accuracy',
    target: 15,
    unit: 'combos 50x',
    reward: { bytes: 16000, levelTokens: 2, quantumFragments: 1 }
  },
  // --- PEDAGOGIA & REABILITAÇÃO ---
  {
    id: 'weekly_drills_purify',
    title: 'Purificação de Vícios',
    description: 'Complete 3 sessões de Treino Corretivo ou Modo Foco.',
    icon: '🧬',
    category: 'pedagogy',
    target: 3,
    unit: 'treinos',
    reward: { bytes: 20000, levelTokens: 3, quantumFragments: 2 }
  },
  {
    id: 'weekly_explore_cats',
    title: 'Poliglota Escolar',
    description: 'Digite pelo menos 50 palavras em categorias de nível Fácil ou superior.',
    icon: '🌐',
    category: 'pedagogy',
    target: 50,
    unit: 'palavras avançadas',
    reward: { bytes: 14000, levelTokens: 2 }
  },
  // --- RPG & DESAFIO ÉPICO ---
  {
    id: 'weekly_rpg_floors',
    title: 'Expedição ao Mainframe',
    description: 'Vença 3 andares nas Crônicas RPG com textos inteiros.',
    icon: '⚔️',
    category: 'rpg',
    target: 3,
    unit: 'andares RPG',
    reward: { bytes: 25000, levelTokens: 4, quantumFragments: 3 }
  },
  {
    id: 'weekly_boss_slayer',
    title: 'Caçador Lendário',
    description: 'Derrote 2 Chefes de Nível ou Guardiões de Crônica RPG.',
    icon: '👑',
    category: 'rpg',
    target: 2,
    unit: 'chefes',
    reward: { bytes: 30000, levelTokens: 5, quantumFragments: 4 }
  }
];

/**
 * Função simples de hash determinístico a partir de uma string de semana
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Gera deterministicamente 4 missões semanais para a semana atual
 */
export function generateWeeklyQuestsForCycle(weekId: string): WeeklyQuestProgress[] {
  const seed = hashString(weekId);
  const volumeQuests = WEEKLY_QUEST_CATALOG.filter((q) => q.category === 'volume');
  const accuracyQuests = WEEKLY_QUEST_CATALOG.filter((q) => q.category === 'accuracy');
  const pedagogyQuests = WEEKLY_QUEST_CATALOG.filter((q) => q.category === 'pedagogy');
  const rpgQuests = WEEKLY_QUEST_CATALOG.filter((q) => q.category === 'rpg');

  const selectedDefs: WeeklyQuestDef[] = [
    volumeQuests[seed % volumeQuests.length],
    accuracyQuests[(seed >> 2) % accuracyQuests.length],
    pedagogyQuests[(seed >> 4) % pedagogyQuests.length],
    rpgQuests[(seed >> 6) % rpgQuests.length]
  ];

  return selectedDefs.map((def) => ({
    questId: def.id,
    current: 0,
    completed: false,
    claimed: false
  }));
}

/**
 * Inicializa ou valida o estado de Quests, rotacionando a semana se necessário
 */
export function syncQuestsState(raw?: QuestsState | null): QuestsState {
  const currentWeek = getCurrentWeekId();

  if (!raw || typeof raw !== 'object') {
    return {
      currentWeekId: currentWeek,
      weeklyQuests: generateWeeklyQuestsForCycle(currentWeek),
      rpgDungeonFloor: 1,
      rpgDungeonXp: 0,
      totalQuestsCompleted: 0,
      highestRpgFloor: 1
    };
  }

  const stateFloor = Number.isFinite(raw.rpgDungeonFloor) && raw.rpgDungeonFloor >= 1 ? raw.rpgDungeonFloor : 1;
  const stateHighest = Number.isFinite(raw.highestRpgFloor) && raw.highestRpgFloor >= 1 ? raw.highestRpgFloor : stateFloor;
  const stateXp = Number.isFinite(raw.rpgDungeonXp) && raw.rpgDungeonXp >= 0 ? raw.rpgDungeonXp : 0;
  const stateTotal = Number.isFinite(raw.totalQuestsCompleted) && raw.totalQuestsCompleted >= 0 ? raw.totalQuestsCompleted : 0;

  // Se virou a semana, regenera a lista semanal preservando o progresso da masmorra
  if (raw.currentWeekId !== currentWeek || !Array.isArray(raw.weeklyQuests) || raw.weeklyQuests.length === 0) {
    return {
      currentWeekId: currentWeek,
      weeklyQuests: generateWeeklyQuestsForCycle(currentWeek),
      rpgDungeonFloor: stateFloor,
      rpgDungeonXp: stateXp,
      totalQuestsCompleted: stateTotal,
      highestRpgFloor: stateHighest
    };
  }

  // Sanitiza a lista existente
  const validMap = new Map(WEEKLY_QUEST_CATALOG.map((q) => [q.id, q]));
  const sanitizedWeekly = raw.weeklyQuests
    .filter((q) => validMap.has(q.questId))
    .map((q) => {
      const def = validMap.get(q.questId)!;
      const cur = Math.max(0, Number.isFinite(q.current) ? q.current : 0);
      return {
        questId: q.questId,
        current: cur,
        completed: !!q.completed || cur >= def.target,
        claimed: !!q.claimed
      };
    });

  return {
    currentWeekId: currentWeek,
    weeklyQuests: sanitizedWeekly.length > 0 ? sanitizedWeekly : generateWeeklyQuestsForCycle(currentWeek),
    rpgDungeonFloor: stateFloor,
    rpgDungeonXp: stateXp,
    totalQuestsCompleted: stateTotal,
    highestRpgFloor: stateHighest
  };
}

/**
 * Atualiza o progresso das missões ativas mediante um evento do jogo
 */
export function processQuestEvent(
  quests: QuestsState,
  event: QuestEvent
): { updatedQuests: QuestsState; newlyCompleted: WeeklyQuestDef[] } {
  let hasChanges = false;
  const newlyCompleted: WeeklyQuestDef[] = [];
  const defMap = new Map(WEEKLY_QUEST_CATALOG.map((q) => [q.id, q]));

  const updatedWeekly = quests.weeklyQuests.map((item) => {
    if (item.completed) return item;

    const def = defMap.get(item.questId);
    if (!def) return item;

    let increment = 0;

    switch (item.questId) {
      case 'weekly_words_350':
        if (event.type === 'word_typed') increment = event.amount || 1;
        break;
      case 'weekly_keystrokes_2000':
        if (event.type === 'keystroke') increment = event.amount || 1;
        break;
      case 'weekly_accuracy_streak':
        if (event.type === 'accuracy_sample' && (event.accuracy ?? 0) >= 96) increment = 1;
        break;
      case 'weekly_high_combo':
        if (event.type === 'keystroke' && (event.amount ?? 0) >= 50) increment = 1;
        break;
      case 'weekly_drills_purify':
        if (event.type === 'drill_completed' || event.type === 'focus_drill_completed') increment = 1;
        break;
      case 'weekly_explore_cats':
        if (event.type === 'word_typed' && event.keys?.includes('advanced_category')) increment = 1;
        break;
      case 'weekly_rpg_floors':
        if (event.type === 'rpg_floor_cleared') increment = 1;
        break;
      case 'weekly_boss_slayer':
        if (event.type === 'boss_defeated' || event.type === 'rpg_floor_cleared') increment = 1;
        break;
      default:
        break;
    }

    if (increment > 0) {
      hasChanges = true;
      const nextCurrent = item.current + increment;
      const isNowCompleted = nextCurrent >= def.target;
      if (isNowCompleted && !item.completed) {
        newlyCompleted.push(def);
      }
      return {
        ...item,
        current: nextCurrent,
        completed: isNowCompleted
      };
    }

    return item;
  });

  if (!hasChanges) {
    return { updatedQuests: quests, newlyCompleted: [] };
  }

  return {
    updatedQuests: {
      ...quests,
      weeklyQuests: updatedWeekly
    },
    newlyCompleted
  };
}

/**
 * Resgata a recompensa de uma missão semanal
 */
export function claimWeeklyQuestReward(
  state: GameState,
  questId: string
): { updatedState: GameState; reward: QuestReward } | null {
  const quests = syncQuestsState(state.quests);
  const targetQuest = quests.weeklyQuests.find((q) => q.questId === questId);
  if (!targetQuest || !targetQuest.completed || targetQuest.claimed) {
    return null;
  }

  const def = WEEKLY_QUEST_CATALOG.find((q) => q.id === questId);
  if (!def) return null;

  const reward = def.reward;
  const updatedQuests: QuestsState = {
    ...quests,
    totalQuestsCompleted: quests.totalQuestsCompleted + 1,
    weeklyQuests: quests.weeklyQuests.map((q) => (q.questId === questId ? { ...q, claimed: true } : q))
  };

  const currentCosmetics = { ...(state.cosmetics || DEFAULT_COSMETICS) };
  if (reward.levelTokens) {
    currentCosmetics.levelTokens = (currentCosmetics.levelTokens || 0) + reward.levelTokens;
  }
  if (reward.quantumFragments) {
    currentCosmetics.quantumFragments = (currentCosmetics.quantumFragments || 0) + reward.quantumFragments;
  }

  const updatedState: GameState = {
    ...state,
    bytes: state.bytes + reward.bytes,
    totalBytesEarned: state.totalBytesEarned + reward.bytes,
    cosmetics: currentCosmetics,
    quests: updatedQuests
  };

  return { updatedState, reward };
}

/**
 * Gera os dados de um andar da Masmorra RPG (Crônicas com Textos Inteiros)
 * Injeta fraquezas adaptadas às teclas fracas do aluno!
 */
export function generateRpgFloor(floor: number, telemetry?: Record<string, KeyTelemetry>): RpgFloorData {
  const weakReports = identificarTeclasFracas(telemetry, 3);
  const weakKeys = weakReports.map((r) => r.char.toLowerCase());

  // Andares 1 a 10: Capítulos de introdução com progressão artesanal
  if (floor <= RPG_BASE_CHAPTERS.length) {
    const chapter = RPG_BASE_CHAPTERS[floor - 1];
    const baseBoss = RPG_BOSSES[chapter.bossIndex % RPG_BOSSES.length];

    // Se o aluno tem fraquezas identificadas, adiciona-as à fraqueza do Boss!
    const bossWeaknesses = Array.from(new Set([...(baseBoss.weaknessKeys || []), ...weakKeys])).slice(0, 5);

    // Ajusta o HP de acordo com a extensão do texto (aproximadamente 1.1x o total de caracteres)
    const calculatedHp = Math.max(baseBoss.maxHp, Math.round(chapter.text.length * 1.15));

    const isMilestone = floor % 5 === 0;
    return {
      floor,
      chapterTitle: chapter.title,
      text: chapter.text,
      boss: {
        ...baseBoss,
        maxHp: calculatedHp,
        weaknessKeys: bossWeaknesses
      },
      rewardBytes: floor * 2000 + 5000,
      rewardTokens: isMilestone ? 3 : 1,
      rewardFragments: isMilestone ? (floor >= 10 ? 3 : 1) : undefined,
      isProcedural: false
    };
  }

  // Andares 11+ (Modo Procedural Infinito):
  // Gera narrativa combinando sentenças de lore ricas nas teclas fracas do aluno
  const bossIndex = (floor - 1) % RPG_BOSSES.length;
  const baseBoss = RPG_BOSSES[bossIndex];
  const hpMultiplier = 1 + (floor - 10) * 0.08;

  let adaptiveSentence = '';
  if (weakKeys.some((k) => ['p', 'c', 'ç'].includes(k))) {
    const list = ADAPTIVE_RPG_LORE.p_c_ç;
    adaptiveSentence = list[floor % list.length];
  } else if (weakKeys.some((k) => ['q', 'a', 'z'].includes(k))) {
    const list = ADAPTIVE_RPG_LORE.q_a_z;
    adaptiveSentence = list[floor % list.length];
  } else if (weakKeys.some((k) => ['á', 'é', 'í', 'ó', 'ú', 'ã', 'õ', 'â', 'ê'].includes(k))) {
    const list = ADAPTIVE_RPG_LORE.accents;
    adaptiveSentence = list[floor % list.length];
  } else {
    const list = ADAPTIVE_RPG_LORE.speed_flow;
    adaptiveSentence = list[floor % list.length];
  }

  const epicPreamble = `No andar ${floor} do Mainframe Ancestral, o ar vibrava com energia quântica. O operador enfrentou ${baseBoss.name}, determinado a restaurar os setores corrompidos do sistema escolar.`;
  const epicConclusion = `Com golpes ritmados sobre o teclado, a barreira de ruído começou a ruir diante da perseverança de um futuro mestre do Colégio Leopoldina.`;

  const fullText = `${epicPreamble} ${adaptiveSentence} ${epicConclusion}`;
  const bossWeaknesses = Array.from(new Set([...(baseBoss.weaknessKeys || []), ...weakKeys])).slice(0, 5);
  const isMilestone = floor % 5 === 0;

  return {
    floor,
    chapterTitle: `Andar ${floor}: Domínio de ${baseBoss.name}`,
    text: fullText,
    boss: {
      ...baseBoss,
      name: `${baseBoss.name} Nv.${Math.floor(floor / 2)}`,
      maxHp: Math.round(fullText.length * 1.25 * hpMultiplier),
      weaknessKeys: bossWeaknesses
    },
    rewardBytes: Math.round(floor * 2500 + 8000),
    rewardTokens: isMilestone ? 4 : 2,
    rewardFragments: isMilestone ? Math.min(6, 2 + Math.floor(floor / 10)) : undefined,
    isProcedural: true
  };
}

/**
 * Concede as recompensas ao vencer um andar na Masmorra RPG e avança para o próximo andar
 */
export function completeRpgFloor(
  state: GameState,
  floorData: RpgFloorData
): { updatedState: GameState; reward: QuestReward } {
  const currentQuests = syncQuestsState(state.quests);
  const nextFloor = floorData.floor + 1;
  const nextHighest = Math.max(currentQuests.highestRpgFloor, nextFloor);

  const reward: QuestReward = {
    bytes: floorData.rewardBytes,
    levelTokens: floorData.rewardTokens,
    quantumFragments: floorData.rewardFragments
  };

  const currentCosmetics = { ...(state.cosmetics || DEFAULT_COSMETICS) };
  if (reward.levelTokens) {
    currentCosmetics.levelTokens = (currentCosmetics.levelTokens || 0) + reward.levelTokens;
  }
  if (reward.quantumFragments) {
    currentCosmetics.quantumFragments = (currentCosmetics.quantumFragments || 0) + reward.quantumFragments;
  }

  const updatedQuestsState: QuestsState = {
    ...currentQuests,
    rpgDungeonFloor: nextFloor,
    highestRpgFloor: nextHighest,
    rpgDungeonXp: currentQuests.rpgDungeonXp + Math.round(floorData.text.length * 2)
  };

  // Processa o evento de andar RPG completado para as missões semanais
  const { updatedQuests } = processQuestEvent(updatedQuestsState, { type: 'rpg_floor_cleared' });

  const updatedState: GameState = {
    ...state,
    bytes: state.bytes + reward.bytes,
    totalBytesEarned: state.totalBytesEarned + reward.bytes,
    cosmetics: currentCosmetics,
    quests: updatedQuests
  };

  return { updatedState, reward };
}
