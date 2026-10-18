import { RpgClassType } from './rpgClass';

export type EquipmentSlot = 'head' | 'chest' | 'weapon' | 'boots' | 'accessory' | 'relic';

export type ItemRarity = 'common' | 'rare' | 'epic' | 'quantum';

export interface RpgAttributeBonus {
  damage?: number;
  accuracy?: number;
  critRate?: number;
  defense?: number;
  speedBps?: number;
  health?: number;
}

export interface ItemPassiveEffect {
  id: string;
  name: string;
  description: string;
  trigger: 'on_crit' | 'on_kill' | 'on_hit_taken' | 'on_low_hp' | 'on_mobility' | 'on_word_complete';
  type:
    | 'lightning_strike'
    | 'frost_nova'
    | 'rage_burst'
    | 'quantum_shield'
    | 'vampirism'
    | 'speed_surge'
    | 'mobility_fire_trail'
    | 'mobility_shock_nova'
    | 'summon_spirit';
  chancePercent: number;
  value: number;
}

export interface RpgItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: ItemRarity;
  requiredLevel: number;
  requiredClass?: RpgClassType;
  stats: RpgAttributeBonus;
  passiveAbility?: ItemPassiveEffect;
  visualAssetKey: string;
  description: string;
  flavorText?: string;
  upgradeLevel?: number; // Nível de refinamento na forja (+1 a +5)
}

export interface HeroLoadout {
  head?: RpgItem;
  chest?: RpgItem;
  weapon?: RpgItem;
  boots?: RpgItem;
  accessory?: RpgItem;
  relic?: RpgItem;
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

export type BiomeId = 'crypt' | 'forge' | 'quantum_core';

export interface BiomeConfig {
  id: BiomeId;
  name: string;
  floorTitle: string;
  description: string;
  floorColor: string;
  gridLineColor: string;
  runeColor: string;
  obstacleColor: string;
  ambientLight: string;
  durationSeconds: number;
}

export const BIOMES_DATA: Record<BiomeId, BiomeConfig> = {
  crypt: {
    id: 'crypt',
    name: 'Cripta de Dados',
    floorTitle: 'Andar 1: Cripta Antiga dos Servidores',
    description: 'Catacumbas subterrâneas com ruínas de servidores antigos e gárgulas digitais.',
    floorColor: '#0b0f19',
    gridLineColor: 'rgba(56, 189, 248, 0.12)',
    runeColor: '#38BDF8',
    obstacleColor: '#1E293B',
    ambientLight: 'rgba(14, 165, 233, 0.08)',
    durationSeconds: 90
  },
  forge: {
    id: 'forge',
    name: 'Forja de Silício',
    floorTitle: 'Andar 2: Forja Vulcânica de Silício',
    description: 'Fornalha incandescente com fissuras de lava e elementais de fogo corrompidos.',
    floorColor: '#1a0b0b',
    gridLineColor: 'rgba(249, 115, 22, 0.14)',
    runeColor: '#F97316',
    obstacleColor: '#381616',
    ambientLight: 'rgba(239, 68, 68, 0.08)',
    durationSeconds: 90
  },
  quantum_core: {
    id: 'quantum_core',
    name: 'Núcleo Quântico',
    floorTitle: 'Andar 3: Núcleo Quântico Corrompido',
    description: 'Singularidade dimensional onde o Guardião Rúnico Supremo guarda o código-fonte.',
    floorColor: '#120b1f',
    gridLineColor: 'rgba(168, 85, 247, 0.15)',
    runeColor: '#C084FC',
    obstacleColor: '#27173e',
    ambientLight: 'rgba(168, 85, 247, 0.1)',
    durationSeconds: 120
  }
};

export interface BiomePortal {
  x: number;
  y: number;
  radius: number;
  active: boolean;
  targetBiome: BiomeId;
  pulseTimer: number;
}

export type EnemyType =
  | 'slime'
  | 'skeleton'
  | 'gargoyle'
  | 'fire_elemental'
  | 'magma_golem'
  | 'void_wraith'
  | 'quantum_orb'
  | 'treasure_goblin'
  | 'miniboss'
  | 'boss';

export type ObstacleStructureType =
  | 'pillar'
  | 'monolith'
  | 'wall_segment'
  | 'altar'
  | 'data_terminal'
  | 'magma_crucible'
  | 'quantum_resonator';

export interface DungeonObstacle {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: 'pillar' | 'obelisk' | 'monolith' | 'wall' | 'structure';
  structureType?: ObstacleStructureType;
  shape?: 'circle' | 'rect';
  width?: number;
  height?: number;
  runeColor?: string;
  label?: string;
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
  wordErrorShakeTimer?: number; // tremor visual ao errar uma letra
  hazardCooldownTimer?: number; // recarga para ataque telegrafado no chão
  firewallTriggered?: boolean; // se o Boss já ativou o escudo de criptografia em 50% HP
  firewallActiveTimer?: number; // segundos restantes do escudo invulnerável do Boss
  stunTimer?: number; // segundos de atordoamento após quebrar firewall
  escapeTimer?: number; // segundos até o Goblin do Tesouro escapar por portal
  bossPhase?: 1 | 2 | 3;
  bossHomingCooldown?: number;
  bossLaserCooldown?: number;
  bossMeteorCooldown?: number;
}

export interface CodeShrine {
  id: string;
  x: number;
  y: number;
  radius: number;
  shrineType: 'overclock' | 'restore' | 'fortune' | 'aegis' | 'frenzy' | 'magnet';
  name: string;
  word: string;
  wordTyped: string;
  active: boolean;
  color: string;
  pulseTimer: number;
  errorShakeTimer?: number;
}

export interface CombatPickup {
  id: string;
  x: number;
  y: number;
  pickupType: 'health_battery' | 'global_magnet' | 'plasma_cell' | 'loot_chest';
  radius: number;
  life: number;
  pulseTimer: number;
}

export interface ActiveTurret {
  id: string;
  x: number;
  y: number;
  life: number;
  maxLife: number;
  shootTimer: number;
  angle: number;
  isEvolved: boolean;
}

export interface BoomerangBlade {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  radius: number;
  life: number;
  maxLife: number;
  returning: boolean;
  angle: number;
  isEvolved: boolean;
  hitIds: Set<string>;
}

export interface FireTrailPatch {
  id: string;
  x: number;
  y: number;
  radius: number;
  life: number;
  maxLife: number;
  damagePerSec: number;
  tickTimer: number;
}

export interface BossHazardZone {
  id: string;
  x: number;
  y: number;
  radius: number;
  progress: number; // 0 to 1
  duration: number;
  damage: number;
  color: string;
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

export interface ArrowRainDrop {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  progress: number; // 0 to 1
  speed: number;
  damage: number;
}

export interface ArrowRainEffect {
  id: string;
  centerX: number;
  centerY: number;
  radius: number;
  duration: number;
  life: number;
  arrows: ArrowRainDrop[];
}

export interface CycloneEffect {
  id: string;
  duration: number;
  life: number;
  angle: number;
  radius: number;
  damagePerTick: number;
  tickTimer: number;
}

export interface GroundTrapEffect {
  id: string;
  x: number;
  y: number;
  radius: number;
  life: number;
  duration: number;
  active: boolean;
  color: string;
}

export interface ChainLightningBolt {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  alpha: number;
  points: Array<{ x: number; y: number }>;
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
  projectileType?: 'normal' | 'fireball' | 'pierce_volley' | 'cyclone_blade' | 'homing_missile' | 'turret_bolt' | 'spirit_wisp';
  targetEnemyId?: string;
  isEvolved?: boolean;
  life?: number;
}

export interface CombatGem {
  id: string;
  x: number;
  y: number;
  xpValue: number;
  color: string;
  magnetized?: boolean; // Puxada pelo ímã global
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
  | 'typing_power'
  | 'mobility_distance'
  | 'mobility_charges'
  | 'mobility_cooldown'
  | 'class_warrior_quake'
  | 'class_warrior_spin'
  | 'class_archer_multishot'
  | 'class_archer_explosive'
  | 'class_mage_nova'
  | 'class_mage_conductor'
  // ─── ARMAS AUTÔNOMAS EVOLUÍVEIS (PILAR 1) ───
  | 'weapon_boomerang'
  | 'weapon_turret'
  | 'weapon_fire_aura'
  | 'weapon_homing_missiles';

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
  requiredClass?: RpgClassType;
  isEvolution?: boolean;
  catalystEffect?: UpgradeEffectType;
  evolutionName?: string;
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
  isHoming?: boolean;
  turnSpeed?: number;
  speed?: number;
  life?: number;
  maxLife?: number;
  projectileType?: 'standard' | 'homing_missile' | 'quantum_orb' | 'meteor';
}

export interface BossLaserTelegraph {
  id: string;
  startX: number;
  startY: number;
  angle: number;
  length: number;
  chargeTimer: number;
  duration: number;
  firingTimer?: number;
  width: number;
  damage: number;
  color: string;
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
    id: 'mage_fireball',
    name: 'Bola de Fogo Devastadora',
    command: '/fogo',
    cooldownSeconds: 8,
    energyCost: 35,
    description: 'Conjura uma esfera colossal em chamas que rasga em linha reta perfurando e incinerando monstros.',
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

// ─────────────────────────────────────────────────────────────
// PILAR 3: SUBCLASSES (ASCENSÕES), TALENTOS PERMANENTES & CHIPS DE IA
// ─────────────────────────────────────────────────────────────

export type HeroSubclassId =
  | 'warrior_berserker'
  | 'warrior_paladin'
  | 'archer_sniper'
  | 'archer_engineer'
  | 'mage_archmage'
  | 'mage_voidwalker';

export interface HeroSubclassDef {
  id: HeroSubclassId;
  rpgClass: RpgClassType;
  name: string;
  tagline: string;
  description: string;
  color: string;
  startingWeapon?: UpgradeEffectType;
}

export const SUBCLASS_DEFS: HeroSubclassDef[] = [
  {
    id: 'warrior_berserker',
    rpgClass: 'warrior',
    name: 'Berserker Carmesim',
    tagline: 'Fúria Sanguinária & Velocidade',
    description: 'Ganha até +45% de Velocidade de Ataque conforme perde HP e recupera +3 HP a cada inimigo abatido.',
    color: '#EF4444'
  },
  {
    id: 'warrior_paladin',
    rpgClass: 'warrior',
    name: 'Paladino do Firewall',
    tagline: 'Bastião Sagrado & Chakrams',
    description: 'Gera automaticamente +30 de Escudo a cada 12s e já inicia a partida com Lâminas Boomerang Nv.1.',
    color: '#38BDF8',
    startingWeapon: 'weapon_boomerang'
  },
  {
    id: 'archer_sniper',
    rpgClass: 'archer',
    name: 'Franco-Atirador Orbital',
    tagline: 'Crítico Letal & Perfuração',
    description: '+18% de Chance Crítica base, +2 de Perfuração em todas as flechas e +35% de dano em Elites/Chefes.',
    color: '#10B981'
  },
  {
    id: 'archer_engineer',
    rpgClass: 'archer',
    name: 'Engenheiro Tático',
    tagline: 'Artilharia & Sentinela',
    description: 'Inicia a partida com a Torreta Sentinela Nv.1 ativa e reduz o tempo de recarga das habilidades em 20%.',
    color: '#F59E0B',
    startingWeapon: 'weapon_turret'
  },
  {
    id: 'mage_archmage',
    rpgClass: 'mage',
    name: 'Arquimago Elemental',
    tagline: 'Piromancia & Sobrecarga',
    description: 'Inicia a partida com Aura Solar Nv.1, regenera +40% mais Energia e reduz o custo de feitiços em 20%.',
    color: '#F97316',
    startingWeapon: 'weapon_fire_aura'
  },
  {
    id: 'mage_voidwalker',
    rpgClass: 'mage',
    name: 'Feiticeiro do Vazio',
    tagline: 'Mísseis Arcanos & Singularidade',
    description: 'Inicia a partida com Mísseis Teleguiados Nv.1 e acertos críticos criam micro-implosões gravitacionais.',
    color: '#A855F7',
    startingWeapon: 'weapon_homing_missiles'
  }
];

export type TalentId =
  | 'vitality'
  | 'might'
  | 'haste'
  | 'crit_mastery'
  | 'magnetism'
  | 'energy_flow'
  | 'bounty_hunter'
  | 'phoenix_protocol';

export interface TalentDef {
  id: TalentId;
  name: string;
  description: string;
  maxLevel: number;
  baseCost: number;
  costStep: number;
  bonusPerLevelLabel: string;
}

export const TALENT_DEFS: TalentDef[] = [
  {
    id: 'vitality',
    name: 'Núcleo de Vitalidade',
    description: 'Aumenta permanentemente o HP máximo inicial de todos os arquétipos.',
    maxLevel: 5,
    baseCost: 250,
    costStep: 200,
    bonusPerLevelLabel: '+25 HP Máx / nível'
  },
  {
    id: 'might',
    name: 'Calibragem de Força',
    description: 'Amplifica o dano base de ataques automáticos, armas secundárias e palavras.',
    maxLevel: 5,
    baseCost: 300,
    costStep: 250,
    bonusPerLevelLabel: '+10% Dano Global / nível'
  },
  {
    id: 'haste',
    name: 'Overclock de Movimento',
    description: 'Aumenta a velocidade de deslocamento e a cadência de tiro base.',
    maxLevel: 5,
    baseCost: 250,
    costStep: 200,
    bonusPerLevelLabel: '+6% Velocidade / nível'
  },
  {
    id: 'crit_mastery',
    name: 'Precisão Cirúrgica',
    description: 'Eleva a chance de acerto crítico base de todas as armas e magias.',
    maxLevel: 5,
    baseCost: 300,
    costStep: 250,
    bonusPerLevelLabel: '+5% Chance Crítica / nível'
  },
  {
    id: 'magnetism',
    name: 'Trator Gravitacional',
    description: 'Expande o raio de coleta de gemas de XP e baterias na arena.',
    maxLevel: 5,
    baseCost: 200,
    costStep: 150,
    bonusPerLevelLabel: '+45px Raio de Coleta / nível'
  },
  {
    id: 'energy_flow',
    name: 'Condutor de Mana',
    description: 'Aumenta a Energia máxima e a regeneração passiva de Energia por segundo.',
    maxLevel: 5,
    baseCost: 250,
    costStep: 200,
    bonusPerLevelLabel: '+15 Energia & +25% Regen / nível'
  },
  {
    id: 'bounty_hunter',
    name: 'Minerador de Bytes',
    description: 'Multiplica todos os Bytes ganhos ao derrotar monstros, Goblins e Chefes.',
    maxLevel: 5,
    baseCost: 350,
    costStep: 300,
    bonusPerLevelLabel: '+15% Bytes Ganhos / nível'
  },
  {
    id: 'phoenix_protocol',
    name: 'Protocolo Fênix',
    description: 'Ao sofrer dano fatal na masmorra, revive automaticamente com 60% de HP e detona uma onda de choque.',
    maxLevel: 1,
    baseCost: 1200,
    costStep: 1200,
    bonusPerLevelLabel: '1 Revive Supremo por Partida'
  }
];

export type AiChipId =
  | 'chip_auto_shield_low_hp'
  | 'chip_auto_ult_full_energy'
  | 'chip_auto_mobility_danger'
  | 'chip_goblin_hunter'
  | 'chip_shrine_resonator';

export interface AiChipDef {
  id: AiChipId;
  name: string;
  conditionLabel: string;
  actionLabel: string;
  description: string;
  unlockCost: number;
}

export const AI_CHIP_DEFS: AiChipDef[] = [
  {
    id: 'chip_auto_shield_low_hp',
    name: 'Reflexo de Sobrevivência',
    conditionLabel: 'SE [HP < 40%]',
    actionLabel: 'ATIVAR DEFESA DE EMERGÊNCIA',
    description: 'Quando a vida cai abaixo de 40%, aciona automaticamente um pulso de escudo protetor (+50 Escudo, 15s CD).',
    unlockCost: 0
  },
  {
    id: 'chip_auto_ult_full_energy',
    name: 'Descarregador Arcano',
    conditionLabel: 'SE [ENERGIA >= 90%]',
    actionLabel: 'CONJURAR SKILL PRINCIPAL',
    description: 'Quando a Energia atinge 90%, conjura automaticamente a 1ª magia da sua classe sem precisar digitar o comando.',
    unlockCost: 0
  },
  {
    id: 'chip_auto_mobility_danger',
    name: 'Evasão de Cerco',
    conditionLabel: 'SE [>= 5 INIMIGOS MUITO PRÓXIMOS]',
    actionLabel: 'DISPARAR ONDA REPULSORA',
    description: 'Se 5 ou mais monstros cercarem o herói a curta distância, emite uma onda cinética que os empurra para longe (10s CD).',
    unlockCost: 300
  },
  {
    id: 'chip_goblin_hunter',
    name: 'Rastreador de Tesouro',
    conditionLabel: 'SE [GOBLIN OU CHEFE NA ARENA]',
    actionLabel: 'SOBRECARREGAR DANO (+30%)',
    description: 'Enquanto houver um Goblin do Tesouro ou Chefe vivo na arena, o herói recebe +30% de dano e mira prioritária.',
    unlockCost: 400
  },
  {
    id: 'chip_shrine_resonator',
    name: 'Sincronizador de Santuário',
    conditionLabel: 'SE [PASSAR PERTO DE SANTUÁRIO]',
    actionLabel: 'AUTO-DECIFRAR 50% DAS LETRAS',
    description: 'Ao se aproximar de um Santuário de Código, preenche metade das letras automaticamente e dobra sua duração.',
    unlockCost: 500
  }
];

// ─────────────────────────────────────────────────────────────
// PILAR 4: PROTOCOLOS DE CORRUPÇÃO (HEAT / TORMENTO) & CONQUISTAS
// ─────────────────────────────────────────────────────────────

export interface CorruptionTierDef {
  tier: number;
  name: string;
  subtitle: string;
  enemyHpMult: number;
  enemySpeedMult: number;
  spawnRateMult: number;
  bytesMultiplier: number;
  color: string;
}

export const CORRUPTION_TIERS: CorruptionTierDef[] = [
  {
    tier: 0,
    name: 'Protocolo Padrão',
    subtitle: 'Ameaça Normal',
    enemyHpMult: 1.0,
    enemySpeedMult: 1.0,
    spawnRateMult: 1.0,
    bytesMultiplier: 1.0,
    color: 'text-zinc-300'
  },
  {
    tier: 1,
    name: 'Tormento I: Sobrecarga',
    subtitle: '+40% Bytes & Sorte de Loot',
    enemyHpMult: 1.25,
    enemySpeedMult: 1.15,
    spawnRateMult: 1.2,
    bytesMultiplier: 1.4,
    color: 'text-cyan-400'
  },
  {
    tier: 2,
    name: 'Tormento II: Fenda Crítica',
    subtitle: '+85% Bytes & Dobro de Elites',
    enemyHpMult: 1.55,
    enemySpeedMult: 1.25,
    spawnRateMult: 1.4,
    bytesMultiplier: 1.85,
    color: 'text-purple-400'
  },
  {
    tier: 3,
    name: 'Tormento III: Apocalipse Quântico',
    subtitle: '+150% Bytes & Baús Lendários',
    enemyHpMult: 2.0,
    enemySpeedMult: 1.35,
    spawnRateMult: 1.65,
    bytesMultiplier: 2.5,
    color: 'text-amber-400'
  }
];

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  rewardBytes: number;
  rewardLabel: string;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: 'ach_first_blood',
    title: 'Caçador de Bugs',
    description: 'Derrote 50 inimigos em uma única partida na masmorra.',
    rewardBytes: 300,
    rewardLabel: '+300 Bytes + +5% Dano Permanente'
  },
  {
    id: 'ach_goblin_slayer',
    title: 'Auditoria Dourada',
    description: 'Capture e derrote um Goblin do Tesouro antes que ele escape pelo portal.',
    rewardBytes: 500,
    rewardLabel: '+500 Bytes + +10% Sorte de Baús'
  },
  {
    id: 'ach_weapon_evolver',
    title: 'Arquiteto de Armas Supremas',
    description: 'Evolua qualquer Arma Autônoma até a sua Evolução Suprema (Nível 5).',
    rewardBytes: 600,
    rewardLabel: '+600 Bytes + +10% XP Ganho'
  },
  {
    id: 'ach_boss_conqueror',
    title: 'Exterminador de Guardiões',
    description: 'Vença o Guardião Supremo e conquiste a masmorra.',
    rewardBytes: 800,
    rewardLabel: '+800 Bytes + Desbloqueia Modo Infinito'
  },
  {
    id: 'ach_torment_victor',
    title: 'Senhor do Tormento',
    description: 'Sobreviva por pelo menos 3 minutos em Tormento I ou superior.',
    rewardBytes: 1000,
    rewardLabel: '+1000 Bytes + +25 HP Permanente'
  }
];

// ─────────────────────────────────────────────────────────────
// ESTRUTURA DE RUN, CÂMARAS ESPECIALIZADAS & DRONES ALIADOS
// ─────────────────────────────────────────────────────────────

export type ChamberType =
  | 'start'      // Câmara 1: Iniciação e Aquecimento
  | 'merchant'   // 🪙 Mercante de Bytes
  | 'drones'     // 🤖 Oficina de Drones Aliados
  | 'treasure'   // 💎 Câmara de Tesouros e Relíquias
  | 'elite'      // ☠️ Câmara de Elite com Baú Lendário
  | 'repair'     // 🩺 Estação de Reparo e Cura
  | 'boss';      // 🔥 Arena do Chefe Supremo

export interface ChamberPortal {
  id: string;
  x: number;
  y: number;
  targetChamberType: ChamberType;
  label: string;
  sublabel: string;
  icon: string;
  color: string;
  radius: number;
  activationWord: string;
  activationProgress: string;
  active: boolean;
}

export type AllyDroneModel = 'combat' | 'medic' | 'hacker';

export interface AllyDrone {
  id: string;
  model: AllyDroneModel;
  name: string;
  orbitAngle: number;
  orbitDistance: number;
  orbitSpeed: number;
  actionTimer: number;
  level: number;
  color: string;
  hp?: number;
  maxHp?: number;
}

export type TerminalRewardType =
  | 'heal'
  | 'shield'
  | 'drone_combat'
  | 'drone_medic'
  | 'drone_hacker'
  | 'overclock'
  | 'weapon_upgrade'
  | 'max_hp'
  | 'bytes_boost';

export interface ChamberTerminalOffer {
  id: string;
  title: string;
  description: string;
  byteCost: number;
  activationWord: string;
  activationWordTyped: string;
  rewardType: TerminalRewardType;
  color: string;
  purchased: boolean;
}

export interface ChamberTerminal {
  id: string;
  x: number;
  y: number;
  type: 'merchant' | 'drone_station' | 'repair_station';
  title: string;
  subtitle: string;
  offers: ChamberTerminalOffer[];
  active: boolean;
  radius: number;
}



