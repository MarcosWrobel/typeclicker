export type WeeklyQuestCategory = 'volume' | 'accuracy' | 'pedagogy' | 'rpg';

export interface QuestReward {
  bytes: number;
  levelTokens?: number;
  quantumFragments?: number;
}

export interface WeeklyQuestDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: WeeklyQuestCategory;
  target: number;
  unit: string;
  reward: QuestReward;
}

export interface WeeklyQuestProgress {
  questId: string;
  current: number;
  completed: boolean;
  claimed: boolean;
}

export interface RpgBoss {
  name: string;
  title: string;
  avatar: string;
  theme: string;
  maxHp: number;
  lore: string;
  weaknessKeys?: string[];
}

export interface RpgFloorData {
  floor: number;
  chapterTitle: string;
  text: string;
  boss: RpgBoss;
  rewardBytes: number;
  rewardTokens: number;
  rewardFragments?: number;
  isProcedural?: boolean;
}

export interface DungeonEquipment {
  id: string;
  name: string;
  slot: 'weapon' | 'shield' | 'relic';
  level: number;
  maxLevel: number;
  bonusDmg: number;
  bonusWeaknessDmgPercent: number;
  bonusShield: number;
  effectDesc: string;
  icon: string;
  upgradeCostXp: number;
}

export interface DungeonPerks {
  criticalCombo: number; // +Dano em combos
  weaknessVampirism: number; // Regenera escudo em fraquezas
  rewardMultiplier: number; // +Bytes nas recompensas
  shieldHardening: number; // Reduz desgaste do escudo por erros
}

export interface DungeonState {
  keys: number; // Chaves atuais de expedição (0 a 5)
  maxKeys: number; // 5
  wordsProgress: number; // Progresso atual até próxima chave (0 a 15)
  wordsTarget: number; // 15 palavras no terminal para ganhar 1 chave
  weapon: DungeonEquipment;
  shield: DungeonEquipment;
  relic?: DungeonEquipment;
  perks: DungeonPerks;
}

export interface QuestsState {
  currentWeekId: string;
  weeklyQuests: WeeklyQuestProgress[];
  rpgDungeonFloor: number;
  rpgDungeonXp: number;
  totalQuestsCompleted: number;
  highestRpgFloor: number;
  dungeon?: DungeonState;
}

export interface QuestEvent {
  type:
    | 'word_typed'
    | 'keystroke'
    | 'accuracy_sample'
    | 'drill_completed'
    | 'focus_drill_completed'
    | 'rpg_floor_cleared'
    | 'boss_defeated';
  amount?: number;
  accuracy?: number;
  keys?: string[];
}
