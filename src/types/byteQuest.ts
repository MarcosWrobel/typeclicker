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
  materials?: number;
  stats: {
    bossesDefeated: number;
    roomsCleared: number;
    itemsFound: number;
    totalDamageDealt: number;
    highestWave?: number;
    runsCompleted?: number;
    runsAttempted?: number;
  };
  currentRoomId?: string;
  rooms?: DungeonRoom[];
  runSeed?: number;
}

// ─────────────────────────────────────────────────────────────
// Tipos para o Combat Runner em Tempo Real (Vampire Survivors style)
// ─────────────────────────────────────────────────────────────

export type EnemyType = 'slime' | 'skeleton' | 'gargoyle' | 'miniboss' | 'boss';

export interface DungeonObstacle {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: 'pillar' | 'obelisk' | 'monolith';
  runeColor?: string;
}

export interface CombatEnemy {
  id: string;
  type: EnemyType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  maxHp: number;
  hp: number;
  damage: number;
  xpValue: number;
  word: string;
  wordTyped: string;
  isBoss: boolean;
  isElite?: boolean;
  color: string;
  glowColor: string;
  hitFlash?: number; // timestamp ms
  hitFlashTimer?: number; // segundos restantes do flash branco
  specialPower?: 'shoot' | 'dash' | 'shield';
  shootTimer?: number;
}

export interface ShockwaveEffect {
  id: string;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  lineWidth: number;
}

export interface CombatProjectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  color: string;
  radius: number;
  pierceCount: number;
  isCrit?: boolean;
}

export interface CombatGem {
  id: string;
  x: number;
  y: number;
  xpValue: number;
  color: string;
}

export interface FloatingDamageText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
  isCrit?: boolean;
}

export type UpgradeEffectType =
  | 'damage'
  | 'speed'
  | 'crit'
  | 'max_hp'
  | 'shield'
  | 'orbitals'
  | 'lightning'
  | 'magnet'
  | 'typing_power';

export interface RunUpgradeCard {
  id: string;
  title: string;
  description: string;
  effectType: UpgradeEffectType;
  value: number;
  level: number;
  maxLevel: number;
  icon: string;
  rarity: ItemRarity;
}

export interface EnemyProjectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  color: string;
  radius: number;
}

export interface SpellDefinition {
  id: string;
  name: string;
  command: string; // Ex: "/furia", "/chuva", "/meteoro"
  cooldownSeconds: number;
  energyCost: number;
  description: string;
  color: string;
  rpgClass: RpgClassType;
}

export const WARRIOR_SPELLS: SpellDefinition[] = [
  {
    id: 'warrior_rage',
    name: 'Fúria de Batalha',
    command: '/furia',
    cooldownSeconds: 14,
    energyCost: 35,
    description: 'Amplia o alcance do golpe e dobra a velocidade e o dano melee por 7s.',
    color: '#EF4444',
    rpgClass: 'warrior'
  },
  {
    id: 'warrior_cyclone',
    name: 'Golpe Ciclone',
    command: '/ciclone',
    cooldownSeconds: 12,
    energyCost: 30,
    description: 'Desfere um ataque giratório de 360° que decepa e repele todos os monstros ao redor.',
    color: '#F97316',
    rpgClass: 'warrior'
  },
  {
    id: 'warrior_charge',
    name: 'Investida de Escudo',
    command: '/investida',
    cooldownSeconds: 10,
    energyCost: 25,
    description: 'Avança com força total para a frente atropelando e atordoando a linha de inimigos.',
    color: '#EAB308',
    rpgClass: 'warrior'
  },
  {
    id: 'warrior_shield',
    name: 'Fortitude de Aço',
    command: '/escudo',
    cooldownSeconds: 16,
    energyCost: 45,
    description: 'Ergue uma muralha blindada impenetrável que absorve todo o dano por 6 segundos.',
    color: '#38BDF8',
    rpgClass: 'warrior'
  }
];

export const ARCHER_SPELLS: SpellDefinition[] = [
  {
    id: 'archer_arrow_rain',
    name: 'Chuva de Flechas',
    command: '/chuva',
    cooldownSeconds: 13,
    energyCost: 45,
    description: 'Faz chover dezenas de flechas de plasma sobre todos os inimigos da tela.',
    color: '#10B981',
    rpgClass: 'archer'
  },
  {
    id: 'archer_pierce_volley',
    name: 'Rajada Perfurante',
    command: '/rajada',
    cooldownSeconds: 9,
    energyCost: 25,
    description: 'Dispara uma salva de 5 flechas velozes que atravessam todos os alvos em linha reta.',
    color: '#34D399',
    rpgClass: 'archer'
  },
  {
    id: 'archer_trap',
    name: 'Armadilha de Espinhos',
    command: '/armadilha',
    cooldownSeconds: 15,
    energyCost: 30,
    description: 'Planta armadilhas no chão que enraízam e imobilizam os monstros por 4 segundos.',
    color: '#F59E0B',
    rpgClass: 'archer'
  },
  {
    id: 'archer_evasion',
    name: 'Passo Fantasma',
    command: '/esquiva',
    cooldownSeconds: 11,
    energyCost: 20,
    description: 'Salto acrobático que concede invulnerabilidade por 2.5s e +40% de velocidade.',
    color: '#6EE7B7',
    rpgClass: 'archer'
  }
];

export const MAGE_SPELLS: SpellDefinition[] = [
  {
    id: 'mage_meteor',
    name: 'Meteoro Arcano',
    command: '/meteoro',
    cooldownSeconds: 18,
    energyCost: 50,
    description: 'Invoca uma explosão estelar elemental que aniquila grupos de monstros na tela.',
    color: '#F97316',
    rpgClass: 'mage'
  },
  {
    id: 'mage_blizzard',
    name: 'Nevasca Gélida',
    command: '/nevasca',
    cooldownSeconds: 14,
    energyCost: 40,
    description: 'Congela instantaneamente toda a horda por 4s causando dano contínuo de gelo.',
    color: '#A78BFA',
    rpgClass: 'mage'
  },
  {
    id: 'mage_thunder',
    name: 'Trovoada em Cadeia',
    command: '/trovao',
    cooldownSeconds: 11,
    energyCost: 30,
    description: 'Descarga elétrica de alta voltagem que salta e atinge até 7 alvos simultâneos.',
    color: '#FACC15',
    rpgClass: 'mage'
  },
  {
    id: 'mage_barrier',
    name: 'Barreira Elemental',
    command: '/barreira',
    cooldownSeconds: 16,
    energyCost: 45,
    description: 'Cria uma esfera de mana com pulso de retaliação que absorve todo o dano por 6s.',
    color: '#38BDF8',
    rpgClass: 'mage'
  }
];

export function getClassSpells(rpgClass: RpgClassType): SpellDefinition[] {
  switch (rpgClass) {
    case 'warrior':
      return WARRIOR_SPELLS;
    case 'archer':
      return ARCHER_SPELLS;
    case 'mage':
    default:
      return MAGE_SPELLS;
  }
}

export const BYTE_QUEST_SPELLS: SpellDefinition[] = [
  ...WARRIOR_SPELLS,
  ...ARCHER_SPELLS,
  ...MAGE_SPELLS
];

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

