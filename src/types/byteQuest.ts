import { RpgClassType } from './rpgClass';

export type EquipmentSlot = 'head' | 'chest' | 'weapon' | 'accessory';

export type ItemRarity = 'common' | 'rare' | 'epic' | 'quantum';

export interface RpgAttributeBonus {
  damage?: number;
  accuracy?: number;
  critRate?: number;
  defense?: number;
  speedBps?: number;
  health?: number;
}

export interface RpgItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: ItemRarity;
  requiredLevel: number;
  requiredClass?: RpgClassType;
  stats: RpgAttributeBonus;
  visualAssetKey: string;
  description: string;
  flavorText?: string;
}

export interface HeroLoadout {
  head?: RpgItem;
  chest?: RpgItem;
  weapon?: RpgItem;
  accessory?: RpgItem;
}

export type DungeonRoomType = 'combat' | 'puzzle' | 'forge' | 'shrine' | 'boss';

export interface DungeonEnemy {
  name: string;
  title: string;
  maxHp: number;
  currentHp: number;
  words: string[];
  themeColor: string;
  avatarKey?: string;
  timeLimitSeconds: number;
}

export interface DungeonPuzzle {
  prompt: string;
  codeSnippet: string;
  options: string[];
  correctOptionIndex: number;
  rewardTokens: number;
}

export interface DungeonRewards {
  bytes: number;
  items?: RpgItem[];
  levelTokens?: number;
  duelTokens?: number;
}

export interface DungeonRoom {
  id: string;
  roomType: DungeonRoomType;
  floor: number;
  title: string;
  description: string;
  cleared: boolean;
  enemy?: DungeonEnemy;
  puzzle?: DungeonPuzzle;
  rewards?: DungeonRewards;
}

export interface ByteQuestState {
  floor: number;
  maxFloorReached: number;
  heroHp: number;
  heroMaxHp: number;
  inventory: RpgItem[];
  equipped: HeroLoadout;
  stats: {
    bossesDefeated: number;
    roomsCleared: number;
    itemsFound: number;
    totalDamageDealt: number;
  };
  currentRoomId?: string;
  rooms?: DungeonRoom[];
  runSeed?: number;
}

export const RARITY_CONFIG: Record<ItemRarity, {
  name: string;
  color: string;
  border: string;
  glow: string;
  bg: string;
}> = {
  common: {
    name: 'Comum',
    color: 'text-zinc-300',
    border: 'border-zinc-700',
    glow: 'shadow-zinc-900/50',
    bg: 'bg-zinc-900/60'
  },
  rare: {
    name: 'Raro',
    color: 'text-cyan-400',
    border: 'border-cyan-500/50',
    glow: 'shadow-cyan-500/20',
    bg: 'bg-cyan-950/40'
  },
  epic: {
    name: 'Épico',
    color: 'text-purple-400',
    border: 'border-purple-500/50',
    glow: 'shadow-purple-500/30',
    bg: 'bg-purple-950/40'
  },
  quantum: {
    name: 'Quântico',
    color: 'text-amber-400',
    border: 'border-amber-500/60',
    glow: 'shadow-amber-500/40',
    bg: 'bg-amber-950/40'
  }
};
