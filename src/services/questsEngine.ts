import { GameState, KeyTelemetry } from '../types';
import {
  QuestsState,
  WeeklyQuestDef,
  WeeklyQuestProgress,
  QuestEvent,
  QuestReward,
  RpgFloorData,
  RpgBoss,
  DungeonState,
  DungeonEquipment,
  DungeonPerks
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

export const DEFAULT_WEAPON: DungeonEquipment = {
  id: 'weapon_hex_linear',
  name: 'Teclado Linear Hexadecimal',
  slot: 'weapon',
  level: 1,
  maxLevel: 5,
  bonusDmg: 3,
  bonusWeaknessDmgPercent: 25,
  bonusShield: 0,
  effectDesc: '+3 dano base por tecla e +25% de dano em fraquezas',
  icon: '⌨️',
  upgradeCostXp: 120
};

export const DEFAULT_SHIELD: DungeonEquipment = {
  id: 'shield_silicon_wall',
  name: 'Firewall de Silício',
  slot: 'shield',
  level: 1,
  maxLevel: 5,
  bonusDmg: 0,
  bonusWeaknessDmgPercent: 0,
  bonusShield: 35,
  effectDesc: '+35 Escudo Máximo contra falhas de digitação',
  icon: '🛡️',
  upgradeCostXp: 120
};

export const DEFAULT_RELIC: DungeonEquipment = {
  id: 'relic_quantum_core',
  name: 'Diodo de Foco Quântico',
  slot: 'relic',
  level: 1,
  maxLevel: 5,
  bonusDmg: 2,
  bonusWeaknessDmgPercent: 15,
  bonusShield: 20,
  effectDesc: '+2 dano e +20 escudo em expedições contínuas',
  icon: '💎',
  upgradeCostXp: 180
};

export const DEFAULT_PERKS: DungeonPerks = {
  criticalCombo: 0,
  weaknessVampirism: 0,
  rewardMultiplier: 0,
  shieldHardening: 0
};

/**
 * Valida e garante consistência do estado de inventário da masmorra
 */
export function syncDungeonState(raw?: Partial<DungeonState>): DungeonState {
  if (!raw || typeof raw !== 'object') {
    return {
      keys: 3,
      maxKeys: 5,
      wordsProgress: 0,
      wordsTarget: 15,
      weapon: { ...DEFAULT_WEAPON },
      shield: { ...DEFAULT_SHIELD },
      relic: { ...DEFAULT_RELIC },
      perks: { ...DEFAULT_PERKS }
    };
  }

  return {
    keys: typeof raw.keys === 'number' && Number.isFinite(raw.keys) ? Math.min(raw.maxKeys || 5, Math.max(0, Math.floor(raw.keys))) : 3,
    maxKeys: 5,
    wordsProgress: typeof raw.wordsProgress === 'number' && Number.isFinite(raw.wordsProgress) ? Math.max(0, Math.floor(raw.wordsProgress) % 15) : 0,
    wordsTarget: 15,
    weapon: raw.weapon ? { ...DEFAULT_WEAPON, ...raw.weapon } : { ...DEFAULT_WEAPON },
    shield: raw.shield ? { ...DEFAULT_SHIELD, ...raw.shield } : { ...DEFAULT_SHIELD },
    relic: raw.relic ? { ...DEFAULT_RELIC, ...raw.relic } : { ...DEFAULT_RELIC },
    perks: {
      criticalCombo: Math.min(5, Math.max(0, raw.perks?.criticalCombo || 0)),
      weaknessVampirism: Math.min(5, Math.max(0, raw.perks?.weaknessVampirism || 0)),
      rewardMultiplier: Math.min(5, Math.max(0, raw.perks?.rewardMultiplier || 0)),
      shieldHardening: Math.min(5, Math.max(0, raw.perks?.shieldHardening || 0))
    }
  };
}

/**
 * Adiciona progresso de palavras digitadas para sintetizar Chaves de Masmorra
 */
export function addWordProgressToDungeon(
  quests: QuestsState,
  wordsAdded: number = 1
): { updatedQuests: QuestsState; keyEarned: boolean } {
  const currentDungeon = syncDungeonState(quests.dungeon);
  const newProgress = currentDungeon.wordsProgress + wordsAdded;
  let keyEarned = false;
  let remainingProgress = newProgress;
  let newKeys = currentDungeon.keys;

  while (remainingProgress >= currentDungeon.wordsTarget) {
    remainingProgress -= currentDungeon.wordsTarget;
    if (newKeys < currentDungeon.maxKeys) {
      newKeys += 1;
      keyEarned = true;
    }
  }

  return {
    updatedQuests: {
      ...quests,
      dungeon: {
        ...currentDungeon,
        keys: newKeys,
        wordsProgress: remainingProgress
      }
    },
    keyEarned
  };
}

/**
 * Concede chaves diretas (por subir de nível ou concluir treino corretivo)
 */
export function grantDungeonKeys(quests: QuestsState, amount: number = 1): QuestsState {
  const currentDungeon = syncDungeonState(quests.dungeon);
  return {
    ...quests,
    dungeon: {
      ...currentDungeon,
      keys: Math.min(currentDungeon.maxKeys, currentDungeon.keys + amount)
    }
  };
}

/**
 * Consome 1 chave ao iniciar uma expedição na Masmorra
 */
export function consumeDungeonKey(quests: QuestsState): { success: boolean; updatedQuests: QuestsState } {
  const currentDungeon = syncDungeonState(quests.dungeon);
  if (currentDungeon.keys <= 0) {
    return { success: false, updatedQuests: quests };
  }

  return {
    success: true,
    updatedQuests: {
      ...quests,
      dungeon: {
        ...currentDungeon,
        keys: currentDungeon.keys - 1
      }
    }
  };
}

/**
 * Aprimora um equipamento da masmorra usando XP de Aventureiro
 */
export function upgradeDungeonEquipment(
  quests: QuestsState,
  slot: 'weapon' | 'shield' | 'relic'
): { success: boolean; updatedQuests: QuestsState; error?: string } {
  const currentDungeon = syncDungeonState(quests.dungeon);
  const equip = currentDungeon[slot];
  if (!equip) return { success: false, updatedQuests: quests, error: 'Equipamento não encontrado' };

  if (equip.level >= equip.maxLevel) {
    return { success: false, updatedQuests: quests, error: 'Nível máximo atingido!' };
  }

  if (quests.rpgDungeonXp < equip.upgradeCostXp) {
    return { success: false, updatedQuests: quests, error: `Requer ${equip.upgradeCostXp} XP de Aventureiro!` };
  }

  const newLevel = equip.level + 1;
  const upgradedEquip: DungeonEquipment = {
    ...equip,
    level: newLevel,
    bonusDmg: slot === 'weapon' ? equip.bonusDmg + 2 : slot === 'relic' ? equip.bonusDmg + 1 : equip.bonusDmg,
    bonusWeaknessDmgPercent: equip.bonusWeaknessDmgPercent + 10,
    bonusShield: slot === 'shield' ? equip.bonusShield + 20 : slot === 'relic' ? equip.bonusShield + 10 : equip.bonusShield,
    upgradeCostXp: Math.round(equip.upgradeCostXp * 1.5)
  };

  return {
    success: true,
    updatedQuests: {
      ...quests,
      rpgDungeonXp: quests.rpgDungeonXp - equip.upgradeCostXp,
      dungeon: {
        ...currentDungeon,
        [slot]: upgradedEquip
      }
    }
  };
}

/**
 * Aprimora um Perk da Masmorra usando XP de Aventureiro
 */
export function upgradeDungeonPerk(
  quests: QuestsState,
  perkName: keyof DungeonPerks
): { success: boolean; updatedQuests: QuestsState; error?: string } {
  const currentDungeon = syncDungeonState(quests.dungeon);
  const currentLevel = currentDungeon.perks[perkName] || 0;
  const maxLevel = 5;

  if (currentLevel >= maxLevel) {
    return { success: false, updatedQuests: quests, error: 'Perk no nível máximo!' };
  }

  const cost = (currentLevel + 1) * 80;
  if (quests.rpgDungeonXp < cost) {
    return { success: false, updatedQuests: quests, error: `Requer ${cost} XP de Aventureiro!` };
  }

  return {
    success: true,
    updatedQuests: {
      ...quests,
      rpgDungeonXp: quests.rpgDungeonXp - cost,
      dungeon: {
        ...currentDungeon,
        perks: {
          ...currentDungeon.perks,
          [perkName]: currentLevel + 1
        }
      }
    }
  };
}

/**
 * Inicializa ou valida o estado de Quests, rotacionando a semana se necessário
 */
export function syncQuestsState(raw?: QuestsState | null): QuestsState {
  const currentWeek = getCurrentWeekId();
  const dungeon = syncDungeonState(raw?.dungeon);

  if (!raw || typeof raw !== 'object') {
    return {
      currentWeekId: currentWeek,
      weeklyQuests: generateWeeklyQuestsForCycle(currentWeek),
      rpgDungeonFloor: 1,
      rpgDungeonXp: 0,
      totalQuestsCompleted: 0,
      highestRpgFloor: 1,
      dungeon
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
      highestRpgFloor: stateHighest,
      dungeon
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
    highestRpgFloor: stateHighest,
    dungeon
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

    // Dificuldade Mediana a Difícil conforme o avanço na masmorra:
    // Andares 1 a 3: Mediana (exige ~85-95% do texto digitado)
    // Andares 4 a 7: Desafiadora (15% armadura, HP ampliado)
    // Andares 8 a 10: Pesada / Chefes Lendários (25% armadura, HP massivo)
    let calculatedHp = 0;
    let armorPercent = 0;

    if (floor <= 3) {
      calculatedHp = Math.round(chapter.text.length * 2.8 + floor * 100);
      armorPercent = 0;
    } else if (floor <= 7) {
      calculatedHp = Math.round(chapter.text.length * 3.6 + floor * 160);
      armorPercent = 15;
    } else {
      calculatedHp = Math.round(chapter.text.length * 4.4 + floor * 220);
      armorPercent = 25;
    }

    const isMilestone = floor % 5 === 0;
    return {
      floor,
      chapterTitle: chapter.title,
      text: chapter.text,
      boss: {
        ...baseBoss,
        maxHp: calculatedHp,
        armorPercent,
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
  const calculatedHp = Math.round(fullText.length * (4.5 + (floor - 10) * 0.25));
  const armorPercent = Math.min(35, 25 + Math.floor((floor - 10) / 3) * 2);
  const bossWeaknesses = Array.from(new Set([...(baseBoss.weaknessKeys || []), ...weakKeys])).slice(0, 5);
  const isMilestone = floor % 5 === 0;

  return {
    floor,
    chapterTitle: `Andar ${floor}: Domínio de ${baseBoss.name}`,
    text: fullText,
    boss: {
      ...baseBoss,
      name: `${baseBoss.name} Nv.${Math.floor(floor / 2)}`,
      maxHp: calculatedHp,
      armorPercent,
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

  const rewardMultiplierLevel = currentQuests.dungeon?.perks.rewardMultiplier || 0;
  const perkBonusMult = 1 + (rewardMultiplierLevel * 0.15);
  const finalBytes = Math.round(floorData.rewardBytes * perkBonusMult);

  const reward: QuestReward = {
    bytes: finalBytes,
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
