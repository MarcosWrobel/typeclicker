// ─────────────────────────────────────────────────────────────
// Motor de Simulação — ByteQuest: Masmorra de Sobrevivência
// Classes Distintas:
//   - Guerreiro: Ataque Melee em arco frontal, Lento (200 px/s), Robusto (140 HP)
//   - Arqueiro: Flechas perfurantes rápidas, Mais Rápido (300 px/s), Frágil (90 HP)
//   - Mago: Magia elemental à distância, Lento (225 px/s), Muito Frágil (75 HP)
// Curva de Ondas Dinâmica: Começa desafiador, facilita com upgrades, escala novamente
// Minions com poderes especiais (tiros, investidas) e Chefes
// ─────────────────────────────────────────────────────────────

import {
  CombatEnemy,
  CombatProjectile,
  EnemyProjectile,
  CombatGem,
  FloatingDamageText,
  RunUpgradeCard,
  HeroLoadout,
  EnemyType,
  UpgradeEffectType,
  getClassSpells,
  SpellDefinition,
  DungeonObstacle,
  ShockwaveEffect,
  BiomeId,
  BiomeConfig,
  BIOMES_DATA,
  BiomePortal,
  ArrowRainEffect,
  CycloneEffect,
  GroundTrapEffect,
  ChainLightningBolt,
  CodeShrine,
  CombatPickup,
  BossHazardZone,
  ActiveTurret,
  BoomerangBlade,
  FireTrailPatch,
  HeroSubclassId,
  TalentId,
  AiChipId,
  CORRUPTION_TIERS,
  SUBCLASS_DEFS,
  ChamberType,
  ChamberPortal,
  AllyDrone,
  AllyDroneModel,
  ChamberTerminal,
  ChamberTerminalOffer,
  TerminalRewardType
} from '../../../types/byteQuest';
import { RpgClassType } from '../../../types/rpgClass';
import { getWordForDifficulty } from '../../../data/byteQuestWords';
import { byteQuestAudio } from './byteQuestAudio';
import { isAccentKey, combineAccent } from '../../../utils/keyboardAccents';

/**
 * Normaliza e compara caracteres com tolerância total a acentos para fluidez no teclado ABNT2/US-Intl
 */
export function matchChars(typed: string, expected: string): boolean {
  if (!typed || !expected) return false;
  const a = typed.toLowerCase();
  const b = expected.toLowerCase();
  if (a === b) return true;
  const normA = a.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normB = b.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return normA === normB;
}

export interface SimulationOptions {
  subclass?: HeroSubclassId;
  talents?: Partial<Record<TalentId, number>>;
  activeAiChips?: AiChipId[];
  corruptionTier?: number;
  startingBiome?: BiomeId;
}

export interface CombatParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface MeleeSlashWave {
  id: string;
  x: number;
  y: number;
  angle: number;
  radius: number;
  progress: number; // 0 to 1
  duration: number;
  life: number;
  isCrit: boolean;
  color: string;
  weaponKey?: string;
}

export interface EngineStats {
  hp: number;
  maxHp: number;
  shieldHp: number;
  shieldDuration: number;
  freezeDuration: number;
  energy: number;
  maxEnergy: number;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  timeSurvivedSeconds: number;
  enemiesDefeated: number;
  wordsTypedCount: number;
  criticalHits: number;
  damageDealt: number;
  totalDamageTaken: number;
  keysTyped: number;
  keysCorrect: number;
  bonusBytesEarned: number; // Bytes extras obtidos em Santuários da Fortuna, Goblins e Baús
  goblinsDefeated?: number;
  chestsCollected?: number;
  weaponsEvolvedCount?: number;
}

export interface UpgradeState {
  damageBonus: number;
  speedBonus: number;
  critRateBonus: number;
  maxHpBonus: number;
  orbitalCount: number;
  chainLightningLevel: number;
  magnetRadius: number;
  typingCritMultiplier: number;
  rageBuffTimer: number; // Buff de fúria do guerreiro
  speedBuffTimer: number; // Buff de velocidade do arqueiro
  mobilityDistanceBonus: number; // Aumento da distância do dash/teleporte
  mobilityMaxChargesBonus: number; // Cargas adicionais da ação de mobilidade
  mobilityCooldownReduction: number; // Redução percentual do tempo de recarga da mobilidade
  // Upgrades exclusivos de Classe
  warriorQuakeLevel: number;
  warriorSpinLevel: number;
  archerMultishotLevel: number;
  archerExplosiveLevel: number;
  mageNovaLevel: number;
  mageConductorLevel: number;
  // Armas Autônomas Secundárias (Pilar 1)
  weaponBoomerangLevel: number;
  weaponTurretLevel: number;
  weaponFireAuraLevel: number;
  weaponHomingMissilesLevel: number;
}

export class ByteQuestSimulation {
  // ─── DIMENSÕES DO MUNDO EXPANDIDO (5000x3600) ───
  public worldWidth: number = 5000;
  public worldHeight: number = 3600;

  // ─── CÂMERA SUAVE (LERP) ───
  public cameraX: number = 0;
  public cameraY: number = 0;
  public viewportWidth: number = 1000;
  public viewportHeight: number = 640;

  // ─── BIOMA ATIVO & PORTAL DE TRANSIÇÃO ───
  public currentBiome: BiomeId = 'crypt';
  public biomeTimeSurvived: number = 0;
  public biomePortal: BiomePortal | null = null;
  public onBiomeChange?: (newBiome: BiomeId) => void;

  public heroX: number = 2500;
  public heroY: number = 1800;
  public heroVx: number = 0;
  public heroVy: number = 0;
  public heroFacing: 'left' | 'right' = 'right';
  public heroRadius: number = 24;
  public runCycle: number = 0;
  public worldSpeed: number = 100;
  public keysPressed: Record<string, boolean> = {};

  // ─── CÂMERA LENTA TÁTICA (BULLET TIME), OVERCLOCK & FRENESI ───
  public focusTimeScale: number = 1.0;
  public focusStamina: number = 4.5;
  public maxFocusStamina: number = 4.5;
  public typingCombo: number = 0;
  public maxTypingCombo: number = 0;
  public pendingAccent: string | null = null;
  public overclockTimer: number = 0;
  public frenzyTimer: number = 0;

  // ─── AÇÃO DE MOBILIDADE DO ARQUÉTIPO (SPACEBAR) ───
  // Mago: Teleporte instantâneo | Arqueiro: Dash deslizante evasivo | Guerreiro: Investida com empurrão
  public mobilityCharges: number = 1;
  public maxMobilityCharges: number = 1;
  public mobilityCooldownTimer: number = 0;
  public mobilityTrailTimer: number = 0;
  public isDashing: boolean = false;
  public mobilitySlideTimer: number = 0;
  public mobilitySlideDuration: number = 0;
  public mobilitySlideVx: number = 0;
  public mobilitySlideVy: number = 0;
  public mobilityGhostPositions: Array<{ x: number; y: number; alpha: number; facing: 'left' | 'right' }> = [];

  // Efeito de corte corpo-a-corpo do Guerreiro
  public meleeSlashTimer: number = 0;
  public meleeSlashAngle: number = 0;
  public slashWaves: MeleeSlashWave[] = [];

  // Animações de ataque do herói em 360°
  public heroAttackTimer: number = 0;
  public heroAttackDuration: number = 0.22;
  public heroAttackAngle: number = 0;
  public heroHurtTimer: number = 0;

  // Game Feel: Hitstop, Screen Shake, Shockwaves e Partículas de Combate
  public hitstopTimer: number = 0;
  public screenShake = {
    intensity: 0,
    timer: 0,
    offsetX: 0,
    offsetY: 0
  };
  public shockwaves: ShockwaveEffect[] = [];
  public particles: CombatParticle[] = [];

  public enemies: CombatEnemy[] = [];
  public projectiles: CombatProjectile[] = [];
  public enemyProjectiles: EnemyProjectile[] = [];
  public gems: CombatGem[] = [];
  public obstacles: DungeonObstacle[] = [];
  public damageTexts: FloatingDamageText[] = [];

  // Santuários, Drops e Zonas de Perigo Telegrafadas
  public shrines: CodeShrine[] = [];
  public pickups: CombatPickup[] = [];
  public hazardZones: BossHazardZone[] = [];

  // Efeitos visuais dedicados das Skills de Classe
  public arrowRainEffects: ArrowRainEffect[] = [];
  public cycloneEffects: CycloneEffect[] = [];
  public groundTraps: GroundTrapEffect[] = [];
  public chainLightningBolts: ChainLightningBolt[] = [];

  // ─── ENCONTRO DO CHEFÃO SUPREMO & HABILIDADES TELEGUIADAS ───
  public bossLaserTelegraphs: import('../../../types/byteQuest').BossLaserTelegraph[] = [];
  public bossArenaBarrier: { active: boolean; minX: number; maxX: number; minY: number; maxY: number; pulseTimer: number } | null = null;
  public bossWarningMessage: { text: string; subtext: string; timer: number; color: string } | null = null;

  // ─── ESTRUTURA DE RUN, CÂMARAS ESPECIALIZADAS & DRONES ALIADOS ───
  public chamberNumber: number = 1; // 1 a 4
  public chamberType: ChamberType = 'start';
  public chamberTimeSurvived: number = 0;
  public chamberTargetDuration: number = 65.0; // 65 segundos por câmara antes da purga
  public chamberIsPurged: boolean = false;
  public chamberPortals: ChamberPortal[] = [];
  public chamberTerminal: ChamberTerminal | null = null;
  public allyDrones: AllyDrone[] = [];
  public hyperspaceTransitionTimer: number = 0; // Transição visual de salto entre câmaras

  // ─── PILAR 1: ARMAS AUTÔNOMAS ATIVAS & TRILHAS DE FOGO ───
  public boomerangs: BoomerangBlade[] = [];
  public turrets: ActiveTurret[] = [];
  public fireTrails: FireTrailPatch[] = [];
  public fireAuraAngle: number = 0;
  private fireAuraTickTimer: number = 0;
  private boomerangCooldown: number = 1.2;
  private turretDeployCooldown: number = 2.0;
  private homingMissileCooldown: number = 1.5;

  // ─── PILAR 3: SUBCLASSE, TALENTOS PERMANENTES & CHIPS DE IA ───
  public subclass: HeroSubclassId;
  public talents: Partial<Record<TalentId, number>>;
  public activeAiChips: AiChipId[];
  public corruptionTier: number;
  public phoenixUsed: boolean = false;
  private paladinShieldTimer: number = 10.0;
  private chipShieldCooldown: number = 0;
  private chipRepulsorCooldown: number = 0;
  private autoResonatedShrines: Set<string> = new Set();

  // ─── PILAR 4: EVENTOS DINÂMICOS (GOBLIN DO TESOURO, CERCO DA HORDA & MODO INFINITO) ───
  public goblinSpawnTimer: number = 38.0;
  public siegeEventTimer: number = 0;
  public siegeCooldownTimer: number = 55.0;
  public activeEventBanner: { text: string; color: string; timer: number } | null = null;
  public endlessLoopCount: number = 0;
  private endlessBossTimer: number = 65.0;

  public lockedEnemyId: string | null = null;
  public lockedShrineId: string | null = null;
  public spellBuffer: string = '';

  // Rastreio do nível acumulado de cada carta de upgrade durante a corrida
  public upgradeLevels: Partial<Record<UpgradeEffectType, number>> = {};

  public stats: EngineStats;
  public upgrades: UpgradeState;
  public spellCooldowns: Record<string, number> = {};

  private autoAttackCooldown: number = 0;
  private enemySpawnTimer: number = 0;
  private invulnerabilityTimer: number = 0;
  public orbitalAngle: number = 0;

  public isBossSpawned: boolean = false;
  public isMiniBossSpawned: boolean = false;
  public isEndlessMode: boolean = false;
  public isVictoryAchieved: boolean = false;

  public rpgClass: RpgClassType;
  public loadout: HeroLoadout;
  public availableSpells: SpellDefinition[];

  public onLevelUp?: () => void;
  public onVictory?: () => void;
  public onGameOver?: () => void;

  constructor(
    rpgClass: RpgClassType = 'warrior',
    loadout: HeroLoadout = {},
    options: SimulationOptions = {}
  ) {
    this.rpgClass = rpgClass;
    this.loadout = loadout;
    this.availableSpells = getClassSpells(rpgClass);

    const defaultSubclass: HeroSubclassId =
      rpgClass === 'warrior'
        ? 'warrior_berserker'
        : rpgClass === 'archer'
        ? 'archer_sniper'
        : 'mage_archmage';
    this.subclass = options.subclass || defaultSubclass;
    this.talents = options.talents || {};
    this.activeAiChips = options.activeAiChips || ['chip_auto_shield_low_hp', 'chip_auto_ult_full_energy'];
    this.corruptionTier = options.corruptionTier ?? 0;
    if (options.startingBiome) {
      this.currentBiome = options.startingBiome;
    }

    // Multiplicador de refinamento dos itens (+15% por nível de forja)
    const getStatWithUpgrade = (item: import('../../../types/byteQuest').RpgItem | undefined, statVal: number = 0) => {
      if (!item || !statVal) return 0;
      const lvl = item.upgradeLevel || 0;
      return Math.round(statVal * (1 + lvl * 0.15));
    };

    const allSlots = [loadout.weapon, loadout.chest, loadout.head, loadout.boots, loadout.accessory, loadout.relic];
    const totalGearHp = allSlots.reduce((acc, it) => acc + getStatWithUpgrade(it, it?.stats.health || 0), 0);
    const totalGearDmg = allSlots.reduce((acc, it) => acc + getStatWithUpgrade(it, it?.stats.damage || 0), 0) || 8;
    const totalGearSpd = allSlots.reduce((acc, it) => acc + getStatWithUpgrade(it, it?.stats.speedBps || 0), 0) || 2;
    const totalGearCrit = allSlots.reduce((acc, it) => acc + getStatWithUpgrade(it, it?.stats.critRate || 0), 0) || 5;

    // Bônus da Árvore de Talentos Permanente
    const vitalityLvl = this.talents.vitality || 0;
    const mightLvl = this.talents.might || 0;
    const hasteLvl = this.talents.haste || 0;
    const critLvl = this.talents.crit_mastery || 0;
    const magnetLvl = this.talents.magnetism || 0;
    const energyLvl = this.talents.energy_flow || 0;

    // Atributos base calculados com rigor por arquétipo + equipamentos + talentos
    let baseHp = 100;
    if (rpgClass === 'warrior') {
      baseHp = 140 + totalGearHp + vitalityLvl * 25;
    } else if (rpgClass === 'archer') {
      baseHp = 90 + totalGearHp + vitalityLvl * 25;
    } else {
      baseHp = 75 + totalGearHp + vitalityLvl * 25;
    }

    const maxEnergy = 100 + energyLvl * 15;

    this.stats = {
      hp: baseHp,
      maxHp: baseHp,
      shieldHp: 0,
      shieldDuration: 0,
      freezeDuration: 0,
      energy: 40 + energyLvl * 10,
      maxEnergy,
      level: 1,
      currentXp: 0,
      nextLevelXp: 14,
      timeSurvivedSeconds: 0,
      enemiesDefeated: 0,
      wordsTypedCount: 0,
      criticalHits: 0,
      damageDealt: 0,
      totalDamageTaken: 0,
      keysTyped: 0,
      keysCorrect: 0,
      bonusBytesEarned: 0,
      goblinsDefeated: 0,
      chestsCollected: 0,
      weaponsEvolvedCount: 0
    };

    const sniperCritBonus = this.subclass === 'archer_sniper' ? 18 : 0;

    this.upgrades = {
      damageBonus: Math.round(totalGearDmg * (1 + mightLvl * 0.1)),
      speedBonus: totalGearSpd + hasteLvl * 1.5,
      critRateBonus: totalGearCrit + critLvl * 5 + sniperCritBonus,
      maxHpBonus: vitalityLvl * 25,
      orbitalCount: rpgClass === 'mage' ? 2 : 0, // Mago inicia com 2 orbes passivos
      chainLightningLevel: 0,
      magnetRadius: 220 + magnetLvl * 45,
      typingCritMultiplier: 3.0 + mightLvl * 0.2,
      rageBuffTimer: 0,
      speedBuffTimer: 0,
      mobilityDistanceBonus: 0,
      mobilityMaxChargesBonus: 0,
      mobilityCooldownReduction: 0,
      warriorQuakeLevel: 0,
      warriorSpinLevel: 0,
      archerMultishotLevel: 0,
      archerExplosiveLevel: 0,
      mageNovaLevel: 0,
      mageConductorLevel: 0,
      weaponBoomerangLevel: this.subclass === 'warrior_paladin' ? 1 : 0,
      weaponTurretLevel: this.subclass === 'archer_engineer' ? 1 : 0,
      weaponFireAuraLevel: this.subclass === 'mage_archmage' ? 1 : 0,
      weaponHomingMissilesLevel: this.subclass === 'mage_voidwalker' ? 1 : 0
    };

    // Registra o nível inicial da arma da subclasse, se houver
    const subDef = SUBCLASS_DEFS.find((s) => s.id === this.subclass);
    if (subDef?.startingWeapon) {
      this.upgradeLevels[subDef.startingWeapon] = 1;
    }

    // Inicializa cargas da ação de mobilidade
    this.maxMobilityCharges = 1;
    this.mobilityCharges = 1;

    // Inicializa cooldowns dos feitiços do arquétipo
    this.availableSpells.forEach((spell) => {
      this.spellCooldowns[spell.id] = 0;
    });

    // Posição central do mundo gigante e geração das estruturas & baús ancestrais
    this.heroX = this.worldWidth / 2;
    this.heroY = this.worldHeight / 2;
    this.generateObstacles(this.worldWidth, this.worldHeight);
    this.spawnAncientChests();
    this.setupChamber('start', 1);
  }

  /**
   * Velocidade de locomoção adaptada ao arquétipo, botas e talentos
   */
  public getHeroMoveSpeed(): number {
    let speed = 230;
    if (this.rpgClass === 'archer') {
      speed = 310; // Arqueiro: Mais rápido de todos
    } else if (this.rpgClass === 'warrior') {
      speed = 220; // Guerreiro
    } else {
      speed = 245; // Mago
    }

    // Bônus das Botas equipadas e Talento de Velocidade
    const bootsSpd = this.loadout.boots?.stats.speedBps || 0;
    const hasteLvl = this.talents.haste || 0;
    speed += bootsSpd * 1.6 + hasteLvl * 14;

    if (this.upgrades.speedBuffTimer > 0) {
      speed *= 1.45; // Buff temporário
    }
    if (this.frenzyTimer > 0) {
      speed *= 1.25; // Buff do Santuário de Frenesi
    }
    return speed;
  }

  public addScreenShake(intensity: number, duration: number) {
    this.screenShake.intensity = Math.max(this.screenShake.intensity, intensity);
    this.screenShake.timer = Math.max(this.screenShake.timer, duration);
  }

  public addShockwave(x: number, y: number, maxRadius: number, color: string, lineWidth: number = 3) {
    this.shockwaves.push({
      id: `sw_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      x,
      y,
      radius: 4,
      maxRadius,
      color,
      alpha: 0.9,
      lineWidth
    });
  }

  public spawnHitParticles(x: number, y: number, color: string, count: number = 6, speed: number = 180) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (0.4 + Math.random() * 0.6) * speed;
      this.particles.push({
        id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        size: 2 + Math.random() * 3,
        alpha: 1,
        life: 0.25 + Math.random() * 0.15,
        maxLife: 0.35
      });
    }
  }

  /**
   * Gera estruturas arquitetônicas complexas e marcos cenográficos (5000x3600)
   * Composição balanceada com corredores, muretas de cobertura e marcos temáticos
   */
  public generateObstacles(arenaWidth: number = 5000, arenaHeight: number = 3600) {
    const biome = BIOMES_DATA[this.currentBiome];
    const obsList: DungeonObstacle[] = [];
    const centerX = this.worldWidth / 2; // 2500
    const centerY = this.worldHeight / 2; // 1800

    // ─── 1. MARCO CENTRAL DO BIOMA (ALTAR / FORNALHA / RESSONADOR) ───
    if (this.currentBiome === 'crypt') {
      obsList.push({
        id: 'altar_center_crypt',
        x: centerX,
        y: centerY,
        radius: 56,
        type: 'structure',
        structureType: 'altar',
        runeColor: '#38BDF8',
        label: 'Santuário de Memória'
      });
      // 4 Pilares de sustentação ao redor do Santuário Central
      const pillarOffsets = [
        { dx: -130, dy: -130 },
        { dx: 130, dy: -130 },
        { dx: -130, dy: 130 },
        { dx: 130, dy: 130 }
      ];
      pillarOffsets.forEach((p, idx) => {
        obsList.push({
          id: `crypt_inner_pillar_${idx}`,
          x: centerX + p.dx,
          y: centerY + p.dy,
          radius: 28,
          type: 'pillar',
          structureType: 'pillar',
          runeColor: '#38BDF8'
        });
      });
    } else if (this.currentBiome === 'forge') {
      obsList.push({
        id: 'crucible_center_forge',
        x: centerX,
        y: centerY,
        radius: 64,
        type: 'structure',
        structureType: 'magma_crucible',
        runeColor: '#F97316',
        label: 'Cadinho de Magma Primordial'
      });
    } else {
      obsList.push({
        id: 'resonator_center_quantum',
        x: centerX,
        y: centerY,
        radius: 60,
        type: 'structure',
        structureType: 'quantum_resonator',
        runeColor: '#C084FC',
        label: 'Ressonador de Singularidade'
      });
    }

    // ─── 2. ALAS ARQUITETÔNICAS E PAREDES DE COBERTURA (4 QUADRANTES DISTANTES) ───
    // Noroeste: Ala de Arquivos & Câmaras Rúnicas (~1050, 900)
    this.createColonnade(obsList, 950, 900, 6, 'horizontal', 70, biome.runeColor, this.currentBiome === 'crypt' ? 'data_terminal' : 'wall_segment');
    this.createColonnade(obsList, 950, 900, 5, 'vertical', 70, biome.runeColor, 'wall_segment');

    // Nordeste: Bastião Fortificado & Fundição (~3950, 900)
    this.createColonnade(obsList, 4050, 900, 6, 'horizontal', -70, biome.runeColor, 'wall_segment');
    this.createColonnade(obsList, 4050, 900, 5, 'vertical', 70, biome.runeColor, this.currentBiome === 'forge' ? 'pillar' : 'wall_segment');

    // Sudoeste: Barricadas Defensivas & Minas Rúnicas (~1050, 2700)
    this.createColonnade(obsList, 950, 2700, 6, 'horizontal', 70, biome.runeColor, 'wall_segment');
    this.createColonnade(obsList, 950, 2700, 5, 'vertical', -70, biome.runeColor, 'pillar');

    // Sudeste: Complexo de Singularidade Cósmica (~3950, 2700)
    this.createColonnade(obsList, 4050, 2700, 6, 'horizontal', -70, biome.runeColor, 'wall_segment');
    this.createColonnade(obsList, 4050, 2700, 5, 'vertical', -70, biome.runeColor, this.currentBiome === 'quantum_core' ? 'data_terminal' : 'wall_segment');

    // ─── 3. BARRICADAS INTERMEDIÁRIAS AO REDOR DO SANTUÁRIO CENTRAL ───
    this.createColonnade(obsList, centerX - 140, centerY - 380, 5, 'horizontal', 70, biome.runeColor, 'wall_segment');
    this.createColonnade(obsList, centerX - 140, centerY + 380, 5, 'horizontal', 70, biome.runeColor, 'wall_segment');
    this.createColonnade(obsList, centerX - 480, centerY - 140, 5, 'vertical', 70, biome.runeColor, 'wall_segment');
    this.createColonnade(obsList, centerX + 480, centerY - 140, 5, 'vertical', 70, biome.runeColor, 'wall_segment');

    // ─── 4. POSTOS AVANÇADOS DISTANTES (NORTE & SUL) ───
    this.createColonnade(obsList, centerX - 140, 650, 5, 'horizontal', 70, biome.runeColor, 'pillar');
    this.createColonnade(obsList, centerX - 140, 2950, 5, 'horizontal', 70, biome.runeColor, 'pillar');

    this.obstacles = obsList;

    // ─── 5. SANTUÁRIOS RÚNICOS DE CÓDIGO (DISTRIBUÍDOS PELAS CÂMARAS DA MASMORRA) ───
    this.shrines = [
      {
        id: `shrine_overclock_${this.currentBiome}`,
        x: 1050,
        y: 750,
        radius: 40,
        shrineType: 'overclock',
        name: 'Santuário de Overclock',
        word: 'overclock',
        wordTyped: '',
        active: true,
        color: '#F59E0B',
        pulseTimer: 0
      },
      {
        id: `shrine_restore_${this.currentBiome}`,
        x: 3950,
        y: 750,
        radius: 40,
        shrineType: 'restore',
        name: 'Santuário de Restauração',
        word: 'restaurar',
        wordTyped: '',
        active: true,
        color: '#10B981',
        pulseTimer: 1.5
      },
      {
        id: `shrine_fortune_${this.currentBiome}`,
        x: 3950,
        y: 2850,
        radius: 40,
        shrineType: 'fortune',
        name: 'Santuário da Fortuna',
        word: 'compilar',
        wordTyped: '',
        active: true,
        color: '#38BDF8',
        pulseTimer: 3.0
      },
      {
        id: `shrine_aegis_${this.currentBiome}`,
        x: 1050,
        y: 2850,
        radius: 40,
        shrineType: 'aegis',
        name: 'Santuário do Baluarte',
        word: 'baluarte',
        wordTyped: '',
        active: true,
        color: '#6366F1',
        pulseTimer: 4.5
      },
      {
        id: `shrine_frenzy_${this.currentBiome}`,
        x: 2500,
        y: 520,
        radius: 40,
        shrineType: 'frenzy',
        name: 'Santuário do Frenesi',
        word: 'frenesi',
        wordTyped: '',
        active: true,
        color: '#EC4899',
        pulseTimer: 2.0
      },
      {
        id: `shrine_magnet_${this.currentBiome}`,
        x: 2500,
        y: 3080,
        radius: 40,
        shrineType: 'magnet',
        name: 'Santuário do Magnetismo',
        word: 'magnetismo',
        wordTyped: '',
        active: true,
        color: '#A855F7',
        pulseTimer: 3.5
      }
    ];
  }

  /**
   * Spawna baús de relíquia antigos permanentes nas câmaras secretas da masmorra
   */
  public spawnAncientChests() {
    // Remove baús antigos remanescentes de bioma anterior
    this.pickups = this.pickups.filter((p) => !p.id.startsWith('ancient_relic_chest_'));

    const chestPositions = [
      { x: 850, y: 1100 },
      { x: 4150, y: 1100 },
      { x: 850, y: 2500 },
      { x: 4150, y: 2500 },
      { x: 2320, y: 650 },
      { x: 2680, y: 2950 }
    ];

    for (const [idx, pos] of chestPositions.entries()) {
      this.pickups.push({
        id: `ancient_relic_chest_${this.currentBiome}_${idx}`,
        x: pos.x,
        y: pos.y,
        pickupType: 'loot_chest',
        radius: 20,
        life: 999999, // Permanente até ser aberto
        pulseTimer: idx * 0.4
      });
    }
  }

  /**
   * Constrói fileiras contíguas de estruturas arquitetônicas (muralhas, pilastras, terminais)
   */
  private createColonnade(
    list: DungeonObstacle[],
    startX: number,
    startY: number,
    count: number,
    direction: 'horizontal' | 'vertical',
    spacing: number,
    runeColor: string,
    structureType: import('../../../types/byteQuest').ObstacleStructureType
  ) {
    for (let i = 0; i < count; i++) {
      const x = direction === 'horizontal' ? startX + i * spacing : startX;
      const y = direction === 'vertical' ? startY + i * spacing : startY;
      list.push({
        id: `struct_${list.length}_${x}_${y}`,
        x,
        y,
        radius: 28,
        type: structureType === 'wall_segment' ? 'wall' : 'structure',
        structureType,
        runeColor
      });
    }
  }

  /**
   * Ciclo de atualização física e combate a 60 FPS
   */
  public update(dt: number, arenaWidth: number, arenaHeight: number) {
    if (this.stats.hp <= 0) return;

    // ─── HITSTOP (MICRO-CONGELAMENTO DE IMPACTO TÁTIL EM CRÍTICOS) ───
    if (this.hitstopTimer > 0) {
      this.hitstopTimer = Math.max(0, this.hitstopTimer - dt);
      return;
    }

    // Inicialização tardia de obstáculos com base nas dimensões reais
    if (this.obstacles.length === 0 && arenaWidth > 200 && arenaHeight > 200) {
      this.generateObstacles(this.worldWidth, this.worldHeight);
      this.spawnAncientChests();
    }

    this.stats.timeSurvivedSeconds += dt;
    // Animação de caminhada vinculada à velocidade real de deslocamento do herói
    const currentSpeed = Math.hypot(this.heroVx, this.heroVy);
    if (currentSpeed > 5) {
      this.runCycle += dt * (currentSpeed / 18);
    } else {
      // Suave retorno para postura neutra em repouso
      this.runCycle += (0 - (this.runCycle % (Math.PI * 2))) * Math.min(1, 8 * dt);
    }

    if (this.heroHurtTimer > 0) {
      this.heroHurtTimer = Math.max(0, this.heroHurtTimer - dt);
    }

    // Screen Shake dinâmico
    if (this.screenShake.timer > 0) {
      this.screenShake.timer = Math.max(0, this.screenShake.timer - dt);
      const intensity = this.screenShake.intensity * Math.min(1, this.screenShake.timer / 0.15);
      this.screenShake.offsetX = (Math.random() - 0.5) * 2 * intensity;
      this.screenShake.offsetY = (Math.random() - 0.5) * 2 * intensity;
      if (this.screenShake.timer <= 0) {
        this.screenShake.intensity = 0;
        this.screenShake.offsetX = 0;
        this.screenShake.offsetY = 0;
      }
    } else {
      this.screenShake.offsetX = 0;
      this.screenShake.offsetY = 0;
    }

    // Timer de pose de ataque do herói
    if (this.heroAttackTimer > 0) {
      this.heroAttackTimer = Math.max(0, this.heroAttackTimer - dt);
    }

    // Regeneração passiva de energia para conjuração de feitiços
    const passiveRegen = (this.rpgClass === 'mage' ? 3.2 : 2.0) * dt;
    this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + passiveRegen);

    // Atualização de Buffs temporários
    if (this.upgrades.rageBuffTimer > 0) {
      this.upgrades.rageBuffTimer = Math.max(0, this.upgrades.rageBuffTimer - dt);
    }
    if (this.upgrades.speedBuffTimer > 0) {
      this.upgrades.speedBuffTimer = Math.max(0, this.upgrades.speedBuffTimer - dt);
    }
    if (this.meleeSlashTimer > 0) {
      this.meleeSlashTimer = Math.max(0, this.meleeSlashTimer - dt);
    }

    // ─── FÍSICA DE DESLIZAMENTO CONTÍNUO (DASH DO ARQUEIRO & INVESTIDA DO GUERREIRO) ───
    if (this.mobilitySlideTimer > 0) {
      this.mobilitySlideTimer = Math.max(0, this.mobilitySlideTimer - dt);
      const slideProgress = 1 - this.mobilitySlideTimer / Math.max(0.01, this.mobilitySlideDuration);
      // Fator de suavização (arranque rápido e desaceleração aerodinâmica gradual)
      const easeSpeed = Math.sin((1 - slideProgress) * Math.PI * 0.5);

      const stepVx = this.mobilitySlideVx * easeSpeed;
      const stepVy = this.mobilitySlideVy * easeSpeed;

      this.heroX += stepVx * dt;
      this.heroY += stepVy * dt;

      // Amostra posições de rastro fantasma a cada 45ms para desenhar a silhueta em movimento
      if (Math.random() < 0.45) {
        this.mobilityGhostPositions.push({
          x: this.heroX,
          y: this.heroY,
          alpha: 0.65,
          facing: this.heroFacing
        });
        if (this.mobilityGhostPositions.length > 7) {
          this.mobilityGhostPositions.shift();
        }
      }

      // Se for a investida do Guerreiro, atropela e empurra inimigos ao longo do trajeto
      if (this.rpgClass === 'warrior') {
        const rushDmg = 55 + this.upgrades.damageBonus;
        for (const enemy of this.enemies) {
          const d = Math.hypot(enemy.x - this.heroX, enemy.y - this.heroY);
          if (d < this.heroRadius + enemy.width * 0.5 + 15) {
            this.damageEnemy(enemy, rushDmg, true);
            // Empurra o monstro na direção do dash
            const dirLen = Math.hypot(this.mobilitySlideVx, this.mobilitySlideVy) || 1;
            enemy.x += (this.mobilitySlideVx / dirLen) * 55;
            enemy.y += (this.mobilitySlideVy / dirLen) * 55;
            this.spawnHitParticles(enemy.x, enemy.y, '#F59E0B', 4, 120);
          }
        }
      }

      // Ao terminar o tempo de deslizamento
      if (this.mobilitySlideTimer <= 0) {
        this.isDashing = false;
        this.mobilitySlideVx = 0;
        this.mobilitySlideVy = 0;
      }
    } else {
      this.isDashing = false;
    }

    // Dissipa os rastros fantasmas suavemente
    for (let i = this.mobilityGhostPositions.length - 1; i >= 0; i--) {
      this.mobilityGhostPositions[i].alpha -= dt * 2.8;
      if (this.mobilityGhostPositions[i].alpha <= 0) {
        this.mobilityGhostPositions.splice(i, 1);
      }
    }

    // Movimentação normal do herói EXCLUSIVAMENTE com as Setas do Teclado (Arrow Keys)
    let targetVx = 0;
    let targetVy = 0;
    const moveSpeed = this.getHeroMoveSpeed();

    if (this.keysPressed['ArrowUp']) targetVy -= moveSpeed;
    if (this.keysPressed['ArrowDown']) targetVy += moveSpeed;
    if (this.keysPressed['ArrowLeft']) {
      targetVx -= moveSpeed;
      this.heroFacing = 'left';
    }
    if (this.keysPressed['ArrowRight']) {
      targetVx += moveSpeed;
      this.heroFacing = 'right';
    }

    this.heroVx += (targetVx - this.heroVx) * 14 * dt;
    this.heroVy += (targetVy - this.heroVy) * 14 * dt;

    if (this.mobilitySlideTimer <= 0) {
      this.heroX += this.heroVx * dt;
      this.heroY += this.heroVy * dt;
    }

    // Limites de locomoção ampla no mundo expandido de 5000x3600
    this.heroX = Math.max(45, Math.min(this.worldWidth - 45, this.heroX));
    this.heroY = Math.max(55, Math.min(this.worldHeight - 55, this.heroY));

    // Se a Barreira Rúnica da Câmara do Chefe estiver ativa, restringe o herói à arena
    if (this.bossArenaBarrier?.active) {
      this.bossArenaBarrier.pulseTimer += dt * 3.5;
      this.heroX = Math.max(this.bossArenaBarrier.minX + 35, Math.min(this.bossArenaBarrier.maxX - 35, this.heroX));
      this.heroY = Math.max(this.bossArenaBarrier.minY + 45, Math.min(this.bossArenaBarrier.maxY - 45, this.heroY));
    }

    if (this.bossWarningMessage) {
      this.bossWarningMessage.timer -= dt;
      if (this.bossWarningMessage.timer <= 0) {
        this.bossWarningMessage = null;
      }
    }

    // ─── CÂMERA SUAVE COM INTERPOLAÇÃO (LERP) ───
    this.viewportWidth = arenaWidth;
    this.viewportHeight = arenaHeight;
    const targetCamX = this.heroX - arenaWidth / 2;
    const targetCamY = this.heroY - arenaHeight / 2;
    const maxCamX = Math.max(0, this.worldWidth - arenaWidth);
    const maxCamY = Math.max(0, this.worldHeight - arenaHeight);

    const clampedTargetCamX = Math.max(0, Math.min(maxCamX, targetCamX));
    const clampedTargetCamY = Math.max(0, Math.min(maxCamY, targetCamY));

    this.cameraX += (clampedTargetCamX - this.cameraX) * Math.min(1, 10 * dt);
    this.cameraY += (clampedTargetCamY - this.cameraY) * Math.min(1, 10 * dt);

    // Colisão do Herói com os Obstáculos da Arena
    for (const obs of this.obstacles) {
      const dx = this.heroX - obs.x;
      const dy = this.heroY - obs.y;
      const dist = Math.hypot(dx, dy);
      const minDist = this.heroRadius + obs.radius;
      if (dist < minDist && dist > 0.001) {
        const overlap = minDist - dist;
        this.heroX += (dx / dist) * overlap;
        this.heroY += (dy / dist) * overlap;
      }
    }

    // Cooldowns de feitiços e congelamento
    if (this.stats.freezeDuration > 0) {
      this.stats.freezeDuration = Math.max(0, this.stats.freezeDuration - dt);
    }
    if (this.stats.shieldDuration > 0) {
      this.stats.shieldDuration = Math.max(0, this.stats.shieldDuration - dt);
      if (this.stats.shieldDuration === 0) {
        this.stats.shieldHp = 0;
      }
    }
    if (this.invulnerabilityTimer > 0) {
      this.invulnerabilityTimer = Math.max(0, this.invulnerabilityTimer - dt);
    }

    Object.keys(this.spellCooldowns).forEach((id) => {
      if (this.spellCooldowns[id] > 0) {
        this.spellCooldowns[id] = Math.max(0, this.spellCooldowns[id] - dt);
      }
    });

    // ─── RECARGA PROGRESSIVA DAS CARGAS DE MOBILIDADE ───
    if (this.mobilityTrailTimer > 0) {
      this.mobilityTrailTimer = Math.max(0, this.mobilityTrailTimer - dt);
    }
    if (this.mobilityCharges < this.maxMobilityCharges) {
      this.mobilityCooldownTimer -= dt;
      if (this.mobilityCooldownTimer <= 0) {
        this.mobilityCharges = Math.min(this.maxMobilityCharges, this.mobilityCharges + 1);
        if (this.mobilityCharges < this.maxMobilityCharges) {
          const baseCd = this.rpgClass === 'warrior' ? 3.5 : this.rpgClass === 'archer' ? 4.5 : 5.0;
          const effectiveCd = Math.max(1.2, baseCd * (1 - this.upgrades.mobilityCooldownReduction));
          this.mobilityCooldownTimer = effectiveCd;
        } else {
          this.mobilityCooldownTimer = 0;
        }
      }
    } else {
      this.mobilityCooldownTimer = 0;
    }

    // Orbes orbitais (Mago e upgrades)
    if (this.upgrades.orbitalCount > 0) {
      this.orbitalAngle += dt * 3.5;
      this.checkOrbitalCollisions();
    }

    // ─── CÂMERA LENTA TÁTICA (BULLET TIME) & COMBO OVERCLOCK ───
    const isFocusing = (this.lockedEnemyId !== null || this.lockedShrineId !== null || this.spellBuffer.length > 0) && this.focusStamina > 0.1;
    if (isFocusing) {
      this.focusStamina = Math.max(0, this.focusStamina - dt);
      const targetScale = this.focusStamina > 0 ? 0.42 : 1.0;
      this.focusTimeScale += (targetScale - this.focusTimeScale) * Math.min(1, 10 * dt);
    } else {
      this.focusStamina = Math.min(this.maxFocusStamina, this.focusStamina + dt * 0.75);
      this.focusTimeScale += (1.0 - this.focusTimeScale) * Math.min(1, 8 * dt);
    }
    const worldDt = dt * this.focusTimeScale;

    if (this.overclockTimer > 0) {
      this.overclockTimer = Math.max(0, this.overclockTimer - dt);
    }
    if (this.frenzyTimer > 0) {
      this.frenzyTimer = Math.max(0, this.frenzyTimer - dt);
    }

    // Ataque automático do arquétipo (+Bônus Berserker Carmesim conforme HP perdido)
    this.autoAttackCooldown -= dt;
    if (this.autoAttackCooldown <= 0) {
      this.performArchetypeAttack();
      let rate = 0.55 - this.upgrades.speedBonus * 0.035;
      if (this.rpgClass === 'archer') rate = 0.35 - this.upgrades.speedBonus * 0.025; // Arqueiro atira mais rápido
      if (this.subclass === 'warrior_berserker') {
        const missingHpRatio = Math.max(0, 1 - this.stats.hp / Math.max(1, this.stats.maxHp));
        rate *= 1 - missingHpRatio * 0.45;
      }
      if (this.upgrades.rageBuffTimer > 0) rate *= 0.5; // Fúria dobra a velocidade
      if (this.overclockTimer > 0) rate *= 0.68; // Overclock acelera em +35%
      if (this.frenzyTimer > 0) rate *= 0.5; // Frenesi de Combate dobra a velocidade
      this.autoAttackCooldown = Math.max(0.1, rate);
    }

    // ─── PILAR 1 & 3: ARMAS AUTÔNOMAS, PASSIVAS DE SUBCLASSE E CHIPS DE IA ───
    this.updateAutonomousWeapons(dt);
    this.updateSubclassAndAiChips(dt);

    // ─── ESTRUTURA DE CÂMARAS, ROTAS & DRONES ALIADOS ───
    this.updateAllyDrones(dt);
    this.checkChamberProgress(dt);
    if (this.hyperspaceTransitionTimer > 0) {
      this.hyperspaceTransitionTimer = Math.max(0, this.hyperspaceTransitionTimer - dt);
    }

    // Banner de Evento Dinâmico
    if (this.activeEventBanner) {
      this.activeEventBanner.timer -= dt;
      if (this.activeEventBanner.timer <= 0) {
        this.activeEventBanner = null;
      }
    }

    // Spawner com Curva de Dificuldade Ondular + Eventos Dinâmicos
    this.updateSpawning(worldDt, arenaWidth, arenaHeight);

    // Movimentação e Poderes dos Inimigos em 360° em direção ao herói
    const isFrozen = this.stats.freezeDuration > 0;
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.hitFlashTimer && enemy.hitFlashTimer > 0) {
        enemy.hitFlashTimer = Math.max(0, enemy.hitFlashTimer - dt);
      }
      if (enemy.wordErrorShakeTimer && enemy.wordErrorShakeTimer > 0) {
        enemy.wordErrorShakeTimer = Math.max(0, enemy.wordErrorShakeTimer - dt);
      }
      if (enemy.firewallActiveTimer && enemy.firewallActiveTimer > 0) {
        enemy.firewallActiveTimer = Math.max(0, enemy.firewallActiveTimer - dt);
      }
      if (enemy.stunTimer && enemy.stunTimer > 0) {
        enemy.stunTimer = Math.max(0, enemy.stunTimer - dt);
      }

      // ─── GOBLIN DO TESOURO: FOGE DO HERÓI E TENTA ESCAPAR POR PORTAL ───
      if (enemy.type === 'treasure_goblin') {
        enemy.escapeTimer = (enemy.escapeTimer ?? 18.0) - worldDt;
        if (enemy.escapeTimer <= 0) {
          this.addFloatingText(enemy.x, enemy.y - 30, '🌀 GOBLIN ESCAPOU!', '#94A3B8', true);
          this.addShockwave(enemy.x, enemy.y, 75, '#FACC15', 3);
          if (this.lockedEnemyId === enemy.id) this.lockedEnemyId = null;
          this.enemies.splice(i, 1);
          continue;
        }
        if (!isFrozen && (enemy.stunTimer || 0) <= 0) {
          const awayX = enemy.x - this.heroX;
          const awayY = enemy.y - this.heroY;
          const awayDist = Math.hypot(awayX, awayY) || 1;
          // Foge se estiver perto (< 380px), ou circula pela arena deixando faiscas douradas
          const moveAng = awayDist < 380 ? Math.atan2(awayY, awayX) + Math.sin(this.stats.timeSurvivedSeconds * 3) * 0.5 : Math.atan2(-awayY, -awayX) + 1.4;
          enemy.x = Math.max(90, Math.min(this.worldWidth - 90, enemy.x + Math.cos(moveAng) * enemy.speed * worldDt));
          enemy.y = Math.max(90, Math.min(this.worldHeight - 90, enemy.y + Math.sin(moveAng) * enemy.speed * worldDt));
          if (Math.random() < 0.25) {
            this.spawnHitParticles(enemy.x, enemy.y, '#FACC15', 1, 50);
          }
        }
        continue;
      }

      const isStunned = (enemy.stunTimer || 0) > 0;

      if (!isFrozen && !isStunned) {
        const dx = this.heroX - enemy.x;
        const dy = this.heroY - enemy.y;
        const dist = Math.hypot(dx, dy);

        // Perseguição ativa em 360 graus (desacelerada pelo Bullet Time)
        if (dist > 5) {
          enemy.x += (dx / dist) * enemy.speed * worldDt;
          enemy.y += (dy / dist) * enemy.speed * worldDt;
        }

        // Colisão de inimigos com obstáculos
        for (const obs of this.obstacles) {
          const edx = enemy.x - obs.x;
          const edy = enemy.y - obs.y;
          const edist = Math.hypot(edx, edy);
          const eMinDist = enemy.width * 0.45 + obs.radius;
          if (edist < eMinDist && edist > 0.001) {
            const eOverlap = eMinDist - edist;
            enemy.x += (edx / edist) * eOverlap;
            enemy.y += (edy / edist) * eOverlap;
          }
        }

        // ─── COMPORTAMENTO MULTIFÁSICO DO CHEFÃO SUPREMO COM TELEGUIADOS ───
        if (enemy.isBoss) {
          const hpRatio = enemy.hp / enemy.maxHp;
          const newPhase: 1 | 2 | 3 = hpRatio > 0.7 ? 1 : hpRatio > 0.35 ? 2 : 3;
          if (enemy.bossPhase !== newPhase) {
            enemy.bossPhase = newPhase;
            if (newPhase === 2) {
              this.bossWarningMessage = {
                text: '⚠️ FASE 2: CANHÃO LASER RASTREADOR ATIVADO!',
                subtext: 'USE OS PILARES PARA COBERTURA TÁTICA!',
                timer: 4.0,
                color: '#F59E0B'
              };
              this.addScreenShake(7.5, 0.35);
              this.addShockwave(enemy.x, enemy.y, 220, '#F59E0B', 5);
            } else if (newPhase === 3) {
              this.bossWarningMessage = {
                text: '☠️ FASE FINAL: MODO ENFURECIDO ATIVADO!',
                subtext: 'FIREWALL ATIVO! DIGITE A PALAVRA PARA QUEBRAR!',
                timer: 4.5,
                color: '#EF4444'
              };
              enemy.firewallActiveTimer = 18.0;
              enemy.color = '#EF4444';
              this.addScreenShake(9.0, 0.4);
              this.addShockwave(enemy.x, enemy.y, 260, '#EF4444', 6);
            }
          }

          // 1. Mísseis Rúnicos Teleguiados
          enemy.bossHomingCooldown = (enemy.bossHomingCooldown ?? 3.5) - worldDt;
          if (enemy.bossHomingCooldown <= 0) {
            enemy.bossHomingCooldown = newPhase === 3 ? 2.8 : newPhase === 2 ? 3.6 : 4.5;
            this.fireBossHomingMissiles(enemy, newPhase);
          }

          // 2. Canhão Laser Rastreador (Fases 2 e 3)
          if (newPhase >= 2) {
            enemy.bossLaserCooldown = (enemy.bossLaserCooldown ?? 5.5) - worldDt;
            if (enemy.bossLaserCooldown <= 0) {
              enemy.bossLaserCooldown = newPhase === 3 ? 4.5 : 6.5;
              this.startBossLaserTelegraph(enemy);
            }
          }

          // 3. Chuva de Meteoros (Fase 3)
          if (newPhase === 3) {
            enemy.bossMeteorCooldown = (enemy.bossMeteorCooldown ?? 3.0) - worldDt;
            if (enemy.bossMeteorCooldown <= 0) {
              enemy.bossMeteorCooldown = 3.2;
              this.triggerBossMeteorStorm(enemy);
            }
          }
        } else if (enemy.specialPower === 'shoot') {
          // Poder especial: Inimigo Atirador de Plasma comum
          enemy.shootTimer = (enemy.shootTimer || 0) - worldDt;
          if (enemy.shootTimer <= 0) {
            this.enemyShootProjectile(enemy);
            enemy.shootTimer = 3.5;
          }
        }

        // ─── ATAQUES TELEGRAFADOS NO CHÃO (RED ZONES) DE ELITES E CHEFES ───
        if (enemy.isBoss || enemy.isElite) {
          enemy.hazardCooldownTimer = (enemy.hazardCooldownTimer ?? (enemy.isBoss ? 3.5 : 6.0)) - worldDt;
          if (enemy.hazardCooldownTimer <= 0 && dist < 520) {
            enemy.hazardCooldownTimer = enemy.isBoss ? 5.2 : 8.5;
            this.hazardZones.push({
              id: `hz_${Date.now()}_${Math.random()}`,
              x: this.heroX + this.heroVx * 0.18,
              y: this.heroY + this.heroVy * 0.18,
              radius: enemy.isBoss ? 125 : 90,
              progress: 0,
              duration: enemy.isBoss ? 1.35 : 1.5,
              damage: enemy.isBoss ? 45 : 28,
              color: enemy.isBoss ? '#EF4444' : '#F97316'
            });
          }
        }

        // Colisão com o herói
        if (dist < this.heroRadius + enemy.width / 2) {
          this.handleHeroHit(enemy.damage);
        }
      }
    }

    // ─── ATUALIZAÇÃO DAS ZONAS DE PERIGO TELEGRAFADAS (RED ZONES) ───
    for (let i = this.hazardZones.length - 1; i >= 0; i--) {
      const hz = this.hazardZones[i];
      hz.progress += (worldDt / hz.duration);
      if (hz.progress >= 1) {
        // Detonação sísmica da Red Zone!
        this.addShockwave(hz.x, hz.y, hz.radius * 1.15, hz.color, 5);
        this.spawnHitParticles(hz.x, hz.y, hz.color, 18, 220);
        this.addScreenShake(5.0, 0.22);
        const heroDist = Math.hypot(this.heroX - hz.x, this.heroY - hz.y);
        if (heroDist <= hz.radius + this.heroRadius * 0.5) {
          this.handleHeroHit(hz.damage);
          this.addFloatingText(this.heroX, this.heroY - 40, 'IMPACTO SÍSMICO!', '#EF4444', true);
        }
        this.hazardZones.splice(i, 1);
      }
    }

    // ─── ATUALIZAÇÃO DE LASERS TELEGUIADOS DO CHEFE ───
    for (let i = this.bossLaserTelegraphs.length - 1; i >= 0; i--) {
      const laser = this.bossLaserTelegraphs[i];
      const boss = this.enemies.find((e) => e.isBoss);
      if (!boss) {
        this.bossLaserTelegraphs.splice(i, 1);
        continue;
      }
      laser.startX = boss.x;
      laser.startY = boss.y;

      if (laser.chargeTimer > 0) {
        laser.chargeTimer -= worldDt;
        const targetAng = Math.atan2(this.heroY - laser.startY, this.heroX - laser.startX);
        let diff = targetAng - laser.angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        laser.angle += diff * Math.min(1.0, 3.2 * worldDt);

        if (laser.chargeTimer <= 0) {
          this.addScreenShake(7.5, 0.3);
          this.spawnHitParticles(laser.startX, laser.startY, '#EF4444', 16, 260);
          byteQuestAudio.playBossFire();
        }
      } else if (laser.firingTimer && laser.firingTimer > 0) {
        laser.firingTimer -= worldDt;
        this.checkLaserHeroCollision(laser);

        if (laser.firingTimer <= 0) {
          this.bossLaserTelegraphs.splice(i, 1);
        }
      }
    }

    // ─── ATUALIZAÇÃO DE SANTUÁRIOS RÚNICOS DE CÓDIGO ───
    for (const shrine of this.shrines) {
      if (!shrine.active) continue;
      shrine.pulseTimer += dt * 3.0;
      if (shrine.errorShakeTimer && shrine.errorShakeTimer > 0) {
        shrine.errorShakeTimer = Math.max(0, shrine.errorShakeTimer - dt);
      }
      // Chip de IA: Sincronizador de Santuário auto-decifra metade das letras ao se aproximar
      if (
        this.activeAiChips.includes('chip_shrine_resonator') &&
        !this.autoResonatedShrines.has(shrine.id) &&
        Math.hypot(this.heroX - shrine.x, this.heroY - shrine.y) <= 230
      ) {
        this.autoResonatedShrines.add(shrine.id);
        const halfLen = Math.max(1, Math.floor(shrine.word.length / 2));
        if (shrine.wordTyped.length < halfLen) {
          shrine.wordTyped = shrine.word.slice(0, halfLen);
          this.addFloatingText(shrine.x, shrine.y - 35, '🤖 CHIP IA: 50% DECIFRADO!', '#38BDF8', true);
        }
      }
      // Se o herói se afastar muito de um santuário travado, destrava
      if (this.lockedShrineId === shrine.id && Math.hypot(this.heroX - shrine.x, this.heroY - shrine.y) > 280) {
        this.lockedShrineId = null;
        shrine.wordTyped = '';
      }
    }

    // ─── ATUALIZAÇÃO DE DROPS INTERATIVOS (BATERIAS, ÍMÃ GLOBAL, CÉLULAS E BAÚS DE LOOT) ───
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const pk = this.pickups[i];
      pk.life -= dt;
      pk.pulseTimer += dt * 4;
      const dist = Math.hypot(this.heroX - pk.x, this.heroY - pk.y);
      if (dist < this.heroRadius + pk.radius + 10) {
        byteQuestAudio.playPickup();
        if (pk.pickupType === 'health_battery') {
          const heal = 35;
          this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + heal);
          this.addFloatingText(this.heroX, this.heroY - 35, `+${heal} HP (BATERIA NANO)`, '#10B981', true);
          this.addShockwave(pk.x, pk.y, 75, '#10B981', 3);
        } else if (pk.pickupType === 'global_magnet') {
          this.gems.forEach((g) => {
            g.magnetized = true;
          });
          this.addFloatingText(this.heroX, this.heroY - 40, 'ÍMÃ QUÂNTICO GLOBAL!', '#38BDF8', true);
          this.addShockwave(pk.x, pk.y, 160, '#38BDF8', 4);
        } else if (pk.pickupType === 'plasma_cell') {
          this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + 55);
          this.addFloatingText(this.heroX, this.heroY - 35, '+55 ENERGIA!', '#C084FC', true);
          this.addShockwave(pk.x, pk.y, 85, '#C084FC', 3);
        } else if (pk.pickupType === 'loot_chest') {
          byteQuestAudio.playChestOpen();
          const bountyBonus = 1 + (this.talents.bounty_hunter || 0) * 0.15;
          const chestBytes = Math.round(160 * bountyBonus);
          this.stats.bonusBytesEarned += chestBytes;
          this.stats.chestsCollected = (this.stats.chestsCollected || 0) + 1;
          this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + 30);
          this.addXp(18);
          this.addShockwave(pk.x, pk.y, 130, '#FACC15', 4);
          this.spawnHitParticles(pk.x, pk.y, '#FACC15', 18, 220);
          this.addFloatingText(this.heroX, this.heroY - 45, `📦 BAÚ DE ELITE! +${chestBytes} BYTES & +18 XP`, '#FACC15', true);
        }
        this.pickups.splice(i, 1);
        continue;
      }
      if (pk.life <= 0) {
        this.pickups.splice(i, 1);
      }
    }

    // Atualização de Projéteis do Herói (incluindo Mísseis Teleguiados e Espíritos Compilados)
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];

      // Curvatura teleguiada para mísseis e espíritos
      if ((p.projectileType === 'homing_missile' || p.projectileType === 'spirit_wisp') && this.enemies.length > 0) {
        let target = this.enemies.find((e) => e.id === p.targetEnemyId);
        if (!target) {
          target = this.getPriorityEnemy() || undefined;
          if (target) p.targetEnemyId = target.id;
        }
        if (target) {
          const desiredAngle = Math.atan2(target.y - p.y, target.x - p.x);
          const currentSpd = Math.hypot(p.vx, p.vy) || 420;
          const currentAngle = Math.atan2(p.vy, p.vx);
          let diff = desiredAngle - currentAngle;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          const newAngle = currentAngle + diff * Math.min(1, 9 * dt);
          p.vx = Math.cos(newAngle) * currentSpd;
          p.vy = Math.sin(newAngle) * currentSpd;
        }
        if (Math.random() < 0.65) {
          this.spawnHitParticles(p.x, p.y, p.color, 1, 35);
        }
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Se for Bola de Fogo, gera labaredas e fumaça ao longo da trajetória
      if (p.projectileType === 'fireball') {
        if (Math.random() < 0.8) {
          const trailColor = Math.random() < 0.6 ? '#F97316' : '#FEF08A';
          this.spawnHitParticles(
            p.x + (Math.random() - 0.5) * 12,
            p.y + (Math.random() - 0.5) * 12,
            trailColor,
            2,
            60
          );
        }
      }

      let hit = false;
      for (const enemy of this.enemies) {
        if (Math.hypot(p.x - enemy.x, p.y - enemy.y) < p.radius + enemy.width / 2) {
          this.damageEnemy(enemy, p.damage, p.isCrit);
          const energyGain = this.overclockTimer > 0 ? 4.5 : 3.0;
          this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + energyGain);
          p.pierceCount--;
          hit = true;
          if (p.projectileType === 'fireball' || (p.projectileType === 'homing_missile' && p.isEvolved)) {
            this.spawnHitParticles(p.x, p.y, '#EF4444', 8, 130);
            this.addShockwave(p.x, p.y, p.isEvolved ? 75 : 40, p.color, 3);
            if (p.isEvolved) {
              for (const nearE of this.enemies) {
                if (nearE.id !== enemy.id && Math.hypot(nearE.x - enemy.x, nearE.y - enemy.y) <= 75) {
                  this.damageEnemy(nearE, Math.round(p.damage * 0.55), false);
                }
              }
            }
          }
          // Arqueiro: Pontas Explosivas em Críticos
          if (this.rpgClass === 'archer' && p.isCrit && this.upgrades.archerExplosiveLevel > 0) {
            const expRadius = 70 + this.upgrades.archerExplosiveLevel * 20;
            const expDmg = Math.round(p.damage * (0.4 + this.upgrades.archerExplosiveLevel * 0.2));
            this.addShockwave(enemy.x, enemy.y, expRadius, '#F97316', 3);
            this.spawnHitParticles(enemy.x, enemy.y, '#F97316', 10, 150);
            for (const nearE of this.enemies) {
              if (nearE.id !== enemy.id && Math.hypot(nearE.x - enemy.x, nearE.y - enemy.y) <= expRadius) {
                this.damageEnemy(nearE, expDmg, false);
              }
            }
          }
          // Mago: Condutor Elemental salta choque no ataque básico
          if (this.rpgClass === 'mage' && this.upgrades.mageConductorLevel > 0) {
            this.triggerChainLightning(enemy.x, enemy.y, this.upgrades.mageConductorLevel);
          }
          if (p.pierceCount <= 0) break;
        }
      }

      if (hit && p.pierceCount <= 0) {
        if (p.projectileType === 'fireball') {
          this.addShockwave(p.x, p.y, 75, '#F97316', 4);
          this.spawnHitParticles(p.x, p.y, '#FEF08A', 14, 180);
        }
        this.projectiles.splice(i, 1);
      } else if (p.x > this.worldWidth + 80 || p.x < -80 || p.y > this.worldHeight + 80 || p.y < -80) {
        this.projectiles.splice(i, 1);
      }
    }

    // Atualização de Projéteis Inimigos (cobertura tática nos obstáculos e desacelerados no Bullet Time)
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const ep = this.enemyProjectiles[i];

      // Curvatura e perseguição ativa para Mísseis Teleguiados do Boss
      if (ep.isHoming) {
        if (ep.life === undefined) ep.life = ep.maxLife || 5.5;
        ep.life -= worldDt;
        if (ep.life <= 0) {
          this.spawnHitParticles(ep.x, ep.y, ep.color, 6, 90);
          this.enemyProjectiles.splice(i, 1);
          continue;
        }
        const toHeroX = this.heroX - ep.x;
        const toHeroY = this.heroY - ep.y;
        const targetAngle = Math.atan2(toHeroY, toHeroX);
        const currentAngle = Math.atan2(ep.vy, ep.vx);
        let diff = targetAngle - currentAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        const turn = (ep.turnSpeed || 2.4) * worldDt;
        const newAngle = currentAngle + Math.max(-turn, Math.min(turn, diff));
        const speed = ep.speed || Math.hypot(ep.vx, ep.vy) || 280;
        ep.vx = Math.cos(newAngle) * speed;
        ep.vy = Math.sin(newAngle) * speed;

        if (Math.random() < 0.45) {
          this.spawnHitParticles(ep.x - Math.cos(newAngle) * 8, ep.y - Math.sin(newAngle) * 8, ep.color, 1, 40);
        }
      }

      ep.x += ep.vx * worldDt;
      ep.y += ep.vy * worldDt;

      // Colisão com Obstáculos (absorção do tiro)
      let blocked = false;
      for (const obs of this.obstacles) {
        if (Math.hypot(ep.x - obs.x, ep.y - obs.y) < obs.radius + ep.radius) {
          blocked = true;
          this.addFloatingText(ep.x, ep.y, 'ESCUDO', '#64748B');
          break;
        }
      }
      if (blocked) {
        this.enemyProjectiles.splice(i, 1);
        continue;
      }

      // Supernova Solar (Evolução Nv.5 da Aura de Fogo) incinera projéteis inimigos próximos
      if (this.upgrades.weaponFireAuraLevel >= 5 && Math.hypot(ep.x - this.heroX, ep.y - this.heroY) < 120) {
        this.spawnHitParticles(ep.x, ep.y, '#F97316', 4, 80);
        this.enemyProjectiles.splice(i, 1);
        continue;
      }

      // Colisão com o herói
      if (Math.hypot(ep.x - this.heroX, ep.y - this.heroY) < ep.radius + this.heroRadius) {
        this.handleHeroHit(ep.damage);
        this.enemyProjectiles.splice(i, 1);
        continue;
      }

      if (ep.x < -60 || ep.x > this.worldWidth + 60 || ep.y < -60 || ep.y > this.worldHeight + 60) {
        this.enemyProjectiles.splice(i, 1);
      }
    }

    // Gemas de XP atraídas magneticamente pelo herói (ou pelo Ímã Global)
    for (let i = this.gems.length - 1; i >= 0; i--) {
      const gem = this.gems[i];
      const dx = this.heroX - gem.x;
      const dy = this.heroY - gem.y;
      const dist = Math.hypot(dx, dy);

      if (gem.magnetized || dist < this.upgrades.magnetRadius) {
        const pullSpeed = gem.magnetized ? 780 : 480 * Math.max(0.3, 1 - dist / (this.upgrades.magnetRadius + 10));
        gem.x += (dx / (dist || 1)) * pullSpeed * dt;
        gem.y += (dy / (dist || 1)) * pullSpeed * dt;
      }

      if (dist < this.heroRadius + 18) {
        this.addXp(gem.xpValue);
        byteQuestAudio.playXpGem();
        this.gems.splice(i, 1);
      }
    }

    // Textos flutuantes
    for (let i = this.damageTexts.length - 1; i >= 0; i--) {
      const dtText = this.damageTexts[i];
      dtText.y += dtText.vy * dt;
      dtText.alpha -= dt * 1.5;
      if (dtText.alpha <= 0) {
        this.damageTexts.splice(i, 1);
      }
    }

    // Atualização de Partículas de Impacto
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Atualização de Shockwaves expansivas
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += (sw.maxRadius - sw.radius) * 14 * dt;
      sw.alpha -= dt * 2.5;
      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius * 0.98) {
        this.shockwaves.splice(i, 1);
      }
    }

    // Atualização de Ondas de Energia de Corte (Slash Waves)
    for (let i = this.slashWaves.length - 1; i >= 0; i--) {
      const sw = this.slashWaves[i];
      sw.life -= dt;
      sw.progress = 1 - Math.max(0, sw.life) / sw.duration;
      // Projeta o arco de corte para frente
      sw.x += Math.cos(sw.angle) * 70 * dt;
      sw.y += Math.sin(sw.angle) * 70 * dt;
      if (sw.life <= 0) {
        this.slashWaves.splice(i, 1);
      }
    }

    // ─── ATUALIZAÇÃO DE SKILLS ESPECIAIS ───
    // 1. CHUVA DE FLECHAS (ARQUEIRO)
    for (let i = this.arrowRainEffects.length - 1; i >= 0; i--) {
      const rain = this.arrowRainEffects[i];
      rain.life -= dt;

      // Adiciona novas flechas caindo periodicamente
      if (rain.life > 0.2 && Math.random() < 0.65) {
        const dropAngle = Math.random() * Math.PI * 2;
        const dropDist = Math.random() * rain.radius;
        const tx = rain.centerX + Math.cos(dropAngle) * dropDist;
        const ty = rain.centerY + Math.sin(dropAngle) * dropDist;
        rain.arrows.push({
          id: `rain_drop_${Date.now()}_${Math.random()}`,
          startX: tx - 60 - Math.random() * 40,
          startY: ty - 450 - Math.random() * 150,
          targetX: tx,
          targetY: ty,
          progress: 0,
          speed: 3.5 + Math.random() * 1.5,
          damage: 18 + this.upgrades.damageBonus * 0.4
        });
      }

      // Atualiza as flechas caindo
      for (let j = rain.arrows.length - 1; j >= 0; j--) {
        const arrow = rain.arrows[j];
        arrow.progress += arrow.speed * dt;
        if (arrow.progress >= 1) {
          // Impacto no chão: dano aos inimigos próximos do ponto de aterrissagem
          for (const e of this.enemies) {
            if (Math.hypot(e.x - arrow.targetX, e.y - arrow.targetY) < 32 + e.width * 0.5) {
              this.damageEnemy(e, arrow.damage, false);
            }
          }
          this.spawnHitParticles(arrow.targetX, arrow.targetY, '#34D399', 3, 90);
          rain.arrows.splice(j, 1);
        }
      }

      if (rain.life <= 0 && rain.arrows.length === 0) {
        this.arrowRainEffects.splice(i, 1);
      }
    }

    // 2. CICLONE GIRATÓRIO DA ESPADA (GUERREIRO)
    for (let i = this.cycloneEffects.length - 1; i >= 0; i--) {
      const cyc = this.cycloneEffects[i];
      cyc.life -= dt;
      cyc.angle += dt * 14.0; // Giro em altíssima rotação
      cyc.tickTimer -= dt;

      // Dano contínuo fatiando a cada 0.12s
      if (cyc.tickTimer <= 0) {
        cyc.tickTimer = 0.12;
        for (const e of this.enemies) {
          const d = Math.hypot(e.x - this.heroX, e.y - this.heroY);
          if (d < cyc.radius + e.width * 0.5) {
            this.damageEnemy(e, cyc.damagePerTick, false);
            // Vórtice: atrai ligeiramente os monstros e repele com turbulência
            const ang = Math.atan2(e.y - this.heroY, e.x - this.heroX);
            e.x += Math.cos(ang + 0.4) * 20;
            e.y += Math.sin(ang + 0.4) * 20;
            this.spawnHitParticles(e.x, e.y, '#F97316', 2, 70);
          }
        }
      }

      // Partículas de poeira e vento ao redor do herói
      if (Math.random() < 0.7) {
        const pAng = cyc.angle + Math.random() * Math.PI;
        const pRad = cyc.radius * (0.4 + Math.random() * 0.6);
        this.spawnHitParticles(
          this.heroX + Math.cos(pAng) * pRad,
          this.heroY + Math.sin(pAng) * pRad,
          Math.random() < 0.5 ? '#FEF08A' : '#F97316',
          2,
          100
        );
      }

      if (cyc.life <= 0) {
        this.cycloneEffects.splice(i, 1);
      }
    }

    // 3. ARMADILHAS DE ESPINHOS NO CHÃO (ARQUEIRO)
    for (let i = this.groundTraps.length - 1; i >= 0; i--) {
      const trap = this.groundTraps[i];
      trap.life -= dt;

      if (trap.active) {
        // Verifica se algum monstro pisou na armadilha
        for (const e of this.enemies) {
          if (Math.hypot(e.x - trap.x, e.y - trap.y) < trap.radius + e.width * 0.4) {
            trap.active = false;
            // Prende o monstro
            e.speed = 0;
            this.damageEnemy(e, 40 + this.upgrades.damageBonus, true);
            this.addFloatingText(e.x, e.y - 20, 'PRESO!', '#F59E0B', true);
            this.spawnHitParticles(trap.x, trap.y, '#F59E0B', 12, 130);
            this.addShockwave(trap.x, trap.y, 45, '#F59E0B', 3);
            setTimeout(() => {
              e.speed = 65;
            }, 3500);
            break;
          }
        }
      }

      if (trap.life <= 0) {
        this.groundTraps.splice(i, 1);
      }
    }

    // 4. DISSIPAÇÃO DO RAIO EM CADEIA (MAGO)
    for (let i = this.chainLightningBolts.length - 1; i >= 0; i--) {
      this.chainLightningBolts[i].alpha -= dt * 3.5;
      if (this.chainLightningBolts[i].alpha <= 0) {
        this.chainLightningBolts.splice(i, 1);
      }
    }

    // ─── TRANSIÇÃO DE BIOMAS & PORTAL RÚNICO (A CADA 90S) ───
    this.biomeTimeSurvived += dt;
    const currentBiomeCfg = BIOMES_DATA[this.currentBiome];

    // Se chegou ao tempo de bioma e o portal ainda não surgiu
    if (this.biomeTimeSurvived >= currentBiomeCfg.durationSeconds && !this.biomePortal) {
      if (this.currentBiome === 'crypt') {
        this.spawnBiomePortal('forge');
      } else if (this.currentBiome === 'forge') {
        this.spawnBiomePortal('quantum_core');
      } else if (this.isEndlessMode) {
        // No Modo Infinito, o portal faz rodízio contínuo pelos 3 biomas!
        this.spawnBiomePortal('crypt');
      }
    }

    // Atualização e colisão com o Portal Rúnico ativo
    if (this.biomePortal) {
      this.biomePortal.pulseTimer += dt * 3.5;
      const pDist = Math.hypot(this.heroX - this.biomePortal.x, this.heroY - this.biomePortal.y);
      if (pDist <= this.heroRadius + this.biomePortal.radius) {
        this.enterBiomePortal();
      }
    }

    // Verificação de vitória suprema (derrotar o Guardião do Núcleo Quântico)
    if (!this.isEndlessMode && this.currentBiome === 'quantum_core' && this.isBossSpawned && this.enemies.filter((e) => e.isBoss).length === 0) {
      if (!this.isVictoryAchieved) {
        this.isVictoryAchieved = true;
        byteQuestAudio.playVictory();
        this.onVictory?.();
      }
    }
  }

  /**
   * Continua a partida no Modo Infinito (Endless Loop) após vencer o Guardião Supremo
   */
  public continueEndlessMode() {
    this.isEndlessMode = true;
    this.isVictoryAchieved = false;
    this.endlessLoopCount++;
    this.stats.hp = this.stats.maxHp;
    this.stats.energy = this.stats.maxEnergy;
    this.endlessBossTimer = 60.0;
    this.spawnBiomePortal('crypt');
    this.activeEventBanner = {
      text: `♾️ LOOP INFINITO ${this.endlessLoopCount} ATIVADO! RECOMPENSAS MULTIPLICADAS!`,
      color: '#C084FC',
      timer: 5.0
    };
    this.addShockwave(this.heroX, this.heroY, 260, '#C084FC', 6);
  }

  /**
   * PILAR 1: Atualiza as 4 Armas Autônomas Secundárias e suas Evoluções Supremas (Nível 5)
   */
  private updateAutonomousWeapons(dt: number) {
    // 1. LÂMINAS BOOMERANG / ESTRELA DA MORTE QUÂNTICA (Nv. 5)
    if (this.upgrades.weaponBoomerangLevel > 0) {
      this.boomerangCooldown -= dt;
      if (this.boomerangCooldown <= 0 && this.enemies.length > 0) {
        const lvl = this.upgrades.weaponBoomerangLevel;
        const isEvolved = lvl >= 5;
        this.boomerangCooldown = isEvolved ? 1.8 : Math.max(1.6, 2.8 - lvl * 0.25);
        const count = isEvolved ? 3 : lvl >= 3 ? 2 : 1;
        const target = this.getPriorityEnemy();
        const baseAngle = target ? Math.atan2(target.y - this.heroY, target.x - this.heroX) : 0;

        for (let b = 0; b < count; b++) {
          const ang = baseAngle + (b - (count - 1) / 2) * (isEvolved ? (Math.PI * 2) / 3 : 0.45);
          const spd = isEvolved ? 520 : 420;
          this.boomerangs.push({
            id: `boom_${Date.now()}_${b}`,
            x: this.heroX,
            y: this.heroY,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            damage: Math.round((22 + lvl * 12 + this.upgrades.damageBonus * 0.65) * (isEvolved ? 1.6 : 1)),
            radius: isEvolved ? 26 : 16,
            life: 1.9,
            maxLife: 1.9,
            returning: false,
            angle: 0,
            isEvolved,
            hitIds: new Set()
          });
        }
      }
    }

    for (let i = this.boomerangs.length - 1; i >= 0; i--) {
      const bm = this.boomerangs[i];
      bm.life -= dt;
      bm.angle += dt * 18;

      if (!bm.returning && bm.life < bm.maxLife * 0.52) {
        bm.returning = true;
        bm.hitIds.clear(); // Pode atingir novamente na volta!
      }

      if (bm.returning) {
        const dx = this.heroX - bm.x;
        const dy = this.heroY - bm.y;
        const dist = Math.hypot(dx, dy) || 1;
        const returnSpd = bm.isEvolved ? 640 : 520;
        bm.vx = (dx / dist) * returnSpd;
        bm.vy = (dy / dist) * returnSpd;
        if (dist < 28) {
          this.boomerangs.splice(i, 1);
          continue;
        }
      }

      bm.x += bm.vx * dt;
      bm.y += bm.vy * dt;

      for (const e of this.enemies) {
        if (!bm.hitIds.has(e.id) && Math.hypot(bm.x - e.x, bm.y - e.y) < bm.radius + e.width * 0.5) {
          bm.hitIds.add(e.id);
          this.damageEnemy(e, bm.damage, bm.isEvolved);
          this.spawnHitParticles(e.x, e.y, bm.isEvolved ? '#F472B6' : '#38BDF8', 4, 110);
        }
      }

      if (bm.life <= 0) {
        this.boomerangs.splice(i, 1);
      }
    }

    // 2. TORRETA SENTINELA / CANHÃO RAILGUN ORBITAL (Nv. 5)
    if (this.upgrades.weaponTurretLevel > 0) {
      this.turretDeployCooldown -= dt;
      const lvl = this.upgrades.weaponTurretLevel;
      const isEvolved = lvl >= 5;
      const maxTurrets = isEvolved ? 3 : lvl >= 3 ? 2 : 1;
      if (this.turretDeployCooldown <= 0 && this.turrets.length < maxTurrets) {
        this.turretDeployCooldown = 5.5;
        const offsetAng = Math.random() * Math.PI * 2;
        this.turrets.push({
          id: `turret_${Date.now()}_${Math.random()}`,
          x: this.heroX + Math.cos(offsetAng) * 55,
          y: this.heroY + Math.sin(offsetAng) * 55,
          life: 14.0,
          maxLife: 14.0,
          shootTimer: 0.2,
          angle: 0,
          isEvolved
        });
        this.addShockwave(this.heroX, this.heroY, 55, isEvolved ? '#FACC15' : '#10B981', 2);
      }
    }

    for (let i = this.turrets.length - 1; i >= 0; i--) {
      const tur = this.turrets[i];
      tur.life -= dt;
      tur.shootTimer -= dt;
      if (tur.shootTimer <= 0 && this.enemies.length > 0) {
        const lvl = this.upgrades.weaponTurretLevel;
        tur.shootTimer = tur.isEvolved ? 0.32 : Math.max(0.4, 0.75 - lvl * 0.07);
        const nearest = this.enemies
          .slice()
          .sort((a, b) => Math.hypot(a.x - tur.x, a.y - tur.y) - Math.hypot(b.x - tur.x, b.y - tur.y))[0];
        if (nearest && Math.hypot(nearest.x - tur.x, nearest.y - tur.y) <= 460) {
          tur.angle = Math.atan2(nearest.y - tur.y, nearest.x - tur.x);
          const spd = tur.isEvolved ? 780 : 580;
          this.projectiles.push({
            id: `tbolt_${Date.now()}_${Math.random()}`,
            x: tur.x + Math.cos(tur.angle) * 14,
            y: tur.y + Math.sin(tur.angle) * 14,
            vx: Math.cos(tur.angle) * spd,
            vy: Math.sin(tur.angle) * spd,
            damage: Math.round((14 + lvl * 8 + this.upgrades.damageBonus * 0.45) * (tur.isEvolved ? 1.65 : 1)),
            color: tur.isEvolved ? '#FACC15' : '#10B981',
            radius: tur.isEvolved ? 6 : 4,
            pierceCount: tur.isEvolved ? 4 : 1,
            projectileType: 'turret_bolt',
            isEvolved: tur.isEvolved
          });
        }
      }
      if (tur.life <= 0) {
        this.turrets.splice(i, 1);
      }
    }

    // 3. AURA SOLAR / SUPERNOVA SOLAR (Nv. 5)
    if (this.upgrades.weaponFireAuraLevel > 0) {
      const lvl = this.upgrades.weaponFireAuraLevel;
      const isEvolved = lvl >= 5;
      this.fireAuraAngle += dt * (isEvolved ? 4.5 : 2.5);
      this.fireAuraTickTimer -= dt;
      if (this.fireAuraTickTimer <= 0) {
        this.fireAuraTickTimer = isEvolved ? 0.32 : 0.45;
        const auraRadius = isEvolved ? 155 : 85 + lvl * 12;
        const auraDmg = Math.round((10 + lvl * 7 + this.upgrades.damageBonus * 0.35) * (isEvolved ? 1.6 : 1));
        for (const e of this.enemies) {
          if (Math.hypot(e.x - this.heroX, e.y - this.heroY) <= auraRadius + e.width * 0.4) {
            this.damageEnemy(e, auraDmg, false);
          }
        }
      }
    }

    // 4. MÍSSEIS TELEGUIADOS / ENXAME VALQUÍRIA (Nv. 5)
    if (this.upgrades.weaponHomingMissilesLevel > 0) {
      this.homingMissileCooldown -= dt;
      if (this.homingMissileCooldown <= 0 && this.enemies.length > 0) {
        const lvl = this.upgrades.weaponHomingMissilesLevel;
        const isEvolved = lvl >= 5;
        this.homingMissileCooldown = isEvolved ? 1.8 : Math.max(1.9, 3.1 - lvl * 0.22);
        const count = isEvolved ? 5 : 1 + Math.floor(lvl / 2);
        for (let m = 0; m < count; m++) {
          const target = this.enemies[m % this.enemies.length];
          const launchAng = (m * Math.PI * 2) / count + Math.random() * 0.3;
          const spd = isEvolved ? 480 : 390;
          this.projectiles.push({
            id: `missile_${Date.now()}_${m}`,
            x: this.heroX + Math.cos(launchAng) * 18,
            y: this.heroY + Math.sin(launchAng) * 18,
            vx: Math.cos(launchAng) * spd,
            vy: Math.sin(launchAng) * spd,
            damage: Math.round((20 + lvl * 10 + this.upgrades.damageBonus * 0.55) * (isEvolved ? 1.5 : 1)),
            color: isEvolved ? '#F43F5E' : '#C084FC',
            radius: isEvolved ? 7.5 : 5.5,
            pierceCount: 1,
            projectileType: 'homing_missile',
            targetEnemyId: target?.id,
            isEvolved
          });
        }
      }
    }

    // 5. TRILHAS DE FOGO NO CHÃO (Botas Vulcânicas)
    for (let i = this.fireTrails.length - 1; i >= 0; i--) {
      const ft = this.fireTrails[i];
      ft.life -= dt;
      ft.tickTimer -= dt;
      if (ft.tickTimer <= 0) {
        ft.tickTimer = 0.35;
        for (const e of this.enemies) {
          if (Math.hypot(e.x - ft.x, e.y - ft.y) <= ft.radius + e.width * 0.4) {
            this.damageEnemy(e, ft.damagePerSec, false);
          }
        }
      }
      if (ft.life <= 0) {
        this.fireTrails.splice(i, 1);
      }
    }
  }

  /**
   * PILAR 3: Atualiza Passivas de Subclasse e Executa Chips de Automação (Gatilhos de IA)
   */
  private updateSubclassAndAiChips(dt: number) {
    // Subclasse Guerreiro: Paladino do Firewall gera escudo periódico
    if (this.subclass === 'warrior_paladin') {
      this.paladinShieldTimer -= dt;
      if (this.paladinShieldTimer <= 0) {
        this.paladinShieldTimer = 12.0;
        this.stats.shieldHp = Math.min(120, this.stats.shieldHp + 30);
        this.stats.shieldDuration = Math.max(this.stats.shieldDuration, 8.0);
        this.addShockwave(this.heroX, this.heroY, 85, '#38BDF8', 3);
        this.addFloatingText(this.heroX, this.heroY - 40, '🛡️ BASTIÃO DO PALADINO (+30 ESCUDO)', '#38BDF8');
      }
    }

    // Cooldowns dos Chips de IA
    if (this.chipShieldCooldown > 0) this.chipShieldCooldown = Math.max(0, this.chipShieldCooldown - dt);
    if (this.chipRepulsorCooldown > 0) this.chipRepulsorCooldown = Math.max(0, this.chipRepulsorCooldown - dt);

    // Chip 1: SE [HP < 40%] ENTÃO [Ativar Defesa de Emergência]
    if (
      this.activeAiChips.includes('chip_auto_shield_low_hp') &&
      this.chipShieldCooldown <= 0 &&
      this.stats.hp > 0 &&
      this.stats.hp < this.stats.maxHp * 0.4
    ) {
      this.chipShieldCooldown = 15.0;
      this.stats.shieldHp += 50;
      this.stats.shieldDuration = Math.max(this.stats.shieldDuration, 6.0);
      this.addShockwave(this.heroX, this.heroY, 120, '#38BDF8', 4);
      this.addFloatingText(this.heroX, this.heroY - 48, '🤖 CHIP IA: ESCUDO DE EMERGÊNCIA!', '#38BDF8', true);
    }

    // Chip 2: SE [Energia >= 90%] ENTÃO [Conjurar Skill Principal]
    if (
      this.activeAiChips.includes('chip_auto_ult_full_energy') &&
      this.stats.energy >= this.stats.maxEnergy * 0.9 &&
      this.enemies.length > 0
    ) {
      const primarySpell = this.availableSpells[0];
      if (primarySpell && (this.spellCooldowns[primarySpell.id] || 0) <= 0) {
        this.castSpell(primarySpell.id);
      }
    }

    // Chip 3: SE [>= 5 Inimigos Muito Próximos] ENTÃO [Onda Repulsora]
    if (this.activeAiChips.includes('chip_auto_mobility_danger') && this.chipRepulsorCooldown <= 0) {
      const closeEnemies = this.enemies.filter((e) => Math.hypot(e.x - this.heroX, e.y - this.heroY) <= 135);
      if (closeEnemies.length >= 5) {
        this.chipRepulsorCooldown = 10.0;
        this.addShockwave(this.heroX, this.heroY, 175, '#FACC15', 5);
        this.addScreenShake(4.5, 0.2);
        this.addFloatingText(this.heroX, this.heroY - 48, '🤖 CHIP IA: PULSO REPULSOR!', '#FACC15', true);
        for (const ce of closeEnemies) {
          const ang = Math.atan2(ce.y - this.heroY, ce.x - this.heroX);
          ce.x += Math.cos(ang) * 130;
          ce.y += Math.sin(ang) * 130;
          this.damageEnemy(ce, 35 + this.upgrades.damageBonus, false);
        }
      }
    }
  }

  /**
   * Spawna o Portal Rúnico de Transição de Bioma no mundo
   */
  public spawnBiomePortal(targetBiome: BiomeId) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 1200 + Math.random() * 800;
    const px = Math.max(160, Math.min(this.worldWidth - 160, this.heroX + Math.cos(angle) * distance));
    const py = Math.max(160, Math.min(this.worldHeight - 160, this.heroY + Math.sin(angle) * distance));

    this.biomePortal = {
      x: px,
      y: py,
      radius: 46,
      active: true,
      targetBiome,
      pulseTimer: 0
    };

    const targetName = BIOMES_DATA[targetBiome].name;
    this.addFloatingText(this.heroX, this.heroY - 60, `🌀 PORTAL PARA ${targetName.toUpperCase()} ABERTO!`, '#38BDF8', true);
    this.addScreenShake(6.0, 0.35);
    this.addShockwave(px, py, 180, '#38BDF8', 5);
  }

  /**
   * Atravessa o Portal Rúnico e carrega o novo bioma
   */
  public enterBiomePortal() {
    if (!this.biomePortal) return;
    const nextBiome = this.biomePortal.targetBiome;
    this.currentBiome = nextBiome;
    this.biomePortal = null;
    this.biomeTimeSurvived = 0;

    // Cura o herói em 35% de HP
    const healAmount = Math.round(this.stats.maxHp * 0.35);
    this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + healAmount);
    this.addFloatingText(this.heroX, this.heroY - 50, `+${healAmount} HP RECUPERADO!`, '#10B981', true);

    // Shockwave dimensional limpa minions fracos restantes
    this.addScreenShake(8.0, 0.4);
    this.addShockwave(this.heroX, this.heroY, 320, BIOMES_DATA[nextBiome].runeColor, 6);
    this.spawnHitParticles(this.heroX, this.heroY, BIOMES_DATA[nextBiome].runeColor, 28, 280);

    // Gera novos obstáculos e baús ancestrais para o novo bioma
    this.generateObstacles(this.worldWidth, this.worldHeight);
    this.spawnAncientChests();

    // Notifica listeners (UI / HUD)
    this.onBiomeChange?.(nextBiome);
    byteQuestAudio.playVictory();
  }

  /**
   * ATAQUE ESPECÍFICO DO ARQUÉTIPO COM DANO REBALANCEADO E GERAÇÃO DE ENERGIA
   */
  private performArchetypeAttack() {
    if (this.enemies.length === 0) return;

    if (this.rpgClass === 'warrior') {
      // ─── GUERREIRO: ATAQUE MELEE SÓ OCORRE SE HOUVER INIMIGO NO ALCANCE CORPO A CORPO ───
      const reach = this.upgrades.rageBuffTimer > 0 ? 155 : 125;
      const overclockMult = this.overclockTimer > 0 ? 1.2 : 1.0;
      const baseDmg = (18 + this.upgrades.damageBonus) * (this.upgrades.rageBuffTimer > 0 ? 1.6 : 1.0) * overclockMult;
      const isCrit = Math.random() * 100 < this.upgrades.critRateBonus;
      const finalDmg = Math.round(isCrit ? baseDmg * 1.7 : baseDmg);

      // Localiza inimigo mais próximo
      const sortedMelee = this.enemies
        .map((e) => ({ e, dist: Math.hypot(e.x - this.heroX, e.y - this.heroY) }))
        .sort((a, b) => a.dist - b.dist);

      const targetEntry = sortedMelee[0];
      // REGRA: Só desfere o golpe se o inimigo mais próximo estiver no alcance do corte
      if (!targetEntry || targetEntry.dist > reach + targetEntry.e.width * 0.5) {
        return; // Nenhum inimigo no alcance: o guerreiro não golpeia o ar!
      }

      const targetAngle = Math.atan2(targetEntry.e.y - this.heroY, targetEntry.e.x - this.heroX);
      this.heroFacing = Math.cos(targetAngle) >= 0 ? 'right' : 'left';
      this.heroAttackAngle = targetAngle;
      this.heroAttackTimer = 0.24;
      this.heroAttackDuration = 0.24;
      this.meleeSlashTimer = 0.24;
      this.meleeSlashAngle = targetAngle;

      // Cria a Onda de Energia de Corte Célere e Persistente
      this.slashWaves.push({
        id: `sw_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        x: this.heroX,
        y: this.heroY,
        angle: targetAngle,
        radius: reach,
        progress: 0,
        duration: 0.26,
        life: 0.26,
        isCrit,
        color: isCrit ? '#FACC15' : '#EF4444',
        weaponKey: this.loadout.weapon?.visualAssetKey
      });

      const energyGainPerHit = this.overclockTimer > 0 ? 4.5 : 3.0;

      // Aplica dano aos inimigos atingidos pelo arco de corte (160 graus)
      for (const enemy of this.enemies) {
        const dx = enemy.x - this.heroX;
        const dy = enemy.y - this.heroY;
        const dist = Math.hypot(dx, dy);

        if (dist <= reach + enemy.width * 0.45) {
          const enemyAngle = Math.atan2(dy, dx);
          let angleDiff = Math.abs(enemyAngle - targetAngle);
          while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

          if (angleDiff <= 1.45) {
            this.damageEnemy(enemy, finalDmg, isCrit);
            this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + energyGainPerHit);
            // Empurrão físico na direção do golpe
            const pushDist = 36;
            enemy.x += Math.cos(targetAngle) * pushDist;
            enemy.y += Math.sin(targetAngle) * pushDist;
          }
        }
      }

      // Upgrade Exclusivo Guerreiro: Lâmina Sísmica em golpes críticos
      if (isCrit && this.upgrades.warriorQuakeLevel > 0) {
        const quakeRadius = 140 + this.upgrades.warriorQuakeLevel * 25;
        const quakeDmg = Math.round(finalDmg * (0.45 + this.upgrades.warriorQuakeLevel * 0.2));
        this.addShockwave(this.heroX, this.heroY, quakeRadius, '#F97316', 4);
        for (const e of this.enemies) {
          if (Math.hypot(e.x - this.heroX, e.y - this.heroY) <= quakeRadius) {
            this.damageEnemy(e, quakeDmg, false);
          }
        }
      }

      byteQuestAudio.playAttack('blade');
    } else if (this.rpgClass === 'archer') {
      // ─── ARQUEIRO: SÓ DISPARA SE HOUVER INIMIGO NO ALCANCE DE TIRO (480px) ───
      const archerMaxRange = 480;
      const target = this.getPriorityEnemy();
      if (!target) return;

      const dx = target.x - this.heroX;
      const dy = target.y - this.heroY;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist > archerMaxRange) {
        return; // Fora do alcance: não gasta flechas no vazio!
      }

      const angle = Math.atan2(dy, dx);
      const speed = 680;

      this.heroFacing = dx < 0 ? 'left' : 'right';
      this.heroAttackAngle = angle;
      this.heroAttackTimer = 0.18;
      this.heroAttackDuration = 0.18;

      const overclockMult = this.overclockTimer > 0 ? 1.2 : 1.0;
      const isCrit = Math.random() * 100 < this.upgrades.critRateBonus;
      const baseDmg = (13 + this.upgrades.damageBonus) * overclockMult;
      const finalDmg = Math.round(isCrit ? baseDmg * 1.9 : baseDmg);

      // Suporte ao Upgrade Exclusivo: Disparo Multiflecha
      const extraArrows = this.upgrades.archerMultishotLevel;
      const totalArrows = 1 + extraArrows * 2;
      const spreadStep = 0.11;

      for (let i = 0; i < totalArrows; i++) {
        const offsetIndex = i - Math.floor(totalArrows / 2);
        const shotAngle = angle + offsetIndex * spreadStep;
        this.projectiles.push({
          id: `arrow_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 5)}`,
          x: this.heroX + Math.cos(shotAngle) * 18,
          y: this.heroY + Math.sin(shotAngle) * 18,
          vx: Math.cos(shotAngle) * speed,
          vy: Math.sin(shotAngle) * speed,
          damage: offsetIndex === 0 ? finalDmg : Math.round(finalDmg * 0.65),
          color: '#34D399',
          radius: isCrit ? 6.5 : 4.5,
          pierceCount: this.subclass === 'archer_sniper' ? 4 : 2,
          isCrit
        });
      }

      // Partículas de vento do disparo
      this.spawnHitParticles(
        this.heroX + Math.cos(angle) * 18,
        this.heroY + Math.sin(angle) * 18,
        '#6EE7B7',
        4,
        85
      );

      byteQuestAudio.playAttack('bow');
    } else {
      // ─── MAGO: SÓ CONJURA SE HOUVER INIMIGO NO ALCANCE DE FEITIÇO (400px) ───
      const mageMaxRange = 400;
      const target = this.getPriorityEnemy();
      if (!target) return;

      const dx = target.x - this.heroX;
      const dy = target.y - this.heroY;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist > mageMaxRange) {
        return; // Fora do alcance de conjuração!
      }

      const angle = Math.atan2(dy, dx);
      const speed = 460;

      this.heroFacing = dx < 0 ? 'left' : 'right';
      this.heroAttackAngle = angle;
      this.heroAttackTimer = 0.24;
      this.heroAttackDuration = 0.24;

      const overclockMult = this.overclockTimer > 0 ? 1.2 : 1.0;
      const isCrit = Math.random() * 100 < this.upgrades.critRateBonus;
      const baseDmg = (16 + this.upgrades.damageBonus) * overclockMult;
      const finalDmg = Math.round(isCrit ? baseDmg * 1.8 : baseDmg);

      this.projectiles.push({
        id: `orb_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        x: this.heroX + Math.cos(angle) * 22,
        y: this.heroY + Math.sin(angle) * 22,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        damage: finalDmg,
        color: '#A855F7',
        radius: isCrit ? 8.5 : 6,
        pierceCount: 1,
        isCrit
      });

      // Partículas arcanas no cajado
      this.spawnHitParticles(
        this.heroX + Math.cos(angle) * 22,
        this.heroY + Math.sin(angle) * 22,
        '#C084FC',
        5,
        110
      );

      byteQuestAudio.playAttack('staff');
    }
  }

  private getPriorityEnemy(): CombatEnemy | null {
    if (this.enemies.length === 0) return null;
    if (this.activeAiChips.includes('chip_goblin_hunter')) {
      const goblin = this.enemies.find((e) => e.type === 'treasure_goblin');
      if (goblin && Math.hypot(goblin.x - this.heroX, goblin.y - this.heroY) <= 460) {
        return goblin;
      }
    }
    return this.enemies
      .slice()
      .sort((a, b) => Math.hypot(a.x - this.heroX, a.y - this.heroY) - Math.hypot(b.x - this.heroX, b.y - this.heroY))[0];
  }

  /**
   * Disparo de Projétil Inimigo de Plasma
   */
  private enemyShootProjectile(enemy: CombatEnemy) {
    const dx = this.heroX - enemy.x;
    const dy = this.heroY - enemy.y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 160;

    this.enemyProjectiles.push({
      id: `ep_${Date.now()}_${Math.random()}`,
      x: enemy.x,
      y: enemy.y,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      damage: Math.round(enemy.damage * 0.8),
      color: '#EC4899',
      radius: 6
    });
  }

  /**
   * Sistema de Spawn com Ondas, Eventos Dinâmicos (Goblin do Tesouro & Cerco) e Corrupção
   */
  private updateSpawning(dt: number, arenaWidth: number, arenaHeight: number) {
    this.enemySpawnTimer -= dt;
    const phase = this.getCurrentPhase();
    const corruptionCfg = CORRUPTION_TIERS[this.corruptionTier] || CORRUPTION_TIERS[0];

    // Evento Dinâmico 1: Goblin do Tesouro ("Bug Dourado") a cada ~45s
    this.goblinSpawnTimer -= dt;
    if (this.goblinSpawnTimer <= 0) {
      this.goblinSpawnTimer = 46.0;
      if (!this.enemies.some((e) => e.type === 'treasure_goblin')) {
        this.spawnTreasureGoblin(arenaWidth, arenaHeight);
      }
    }

    // Evento Dinâmico 2: Cerco da Horda ("Protocolo de Invasão")
    if (this.siegeEventTimer > 0) {
      this.siegeEventTimer -= dt;
      if (this.siegeEventTimer <= 0) {
        this.siegeEventTimer = 0;
        const bountyMult = 1 + (this.talents.bounty_hunter || 0) * 0.15;
        const rewardBytes = Math.round(140 * bountyMult);
        this.stats.bonusBytesEarned += rewardBytes;
        this.stats.energy = this.stats.maxEnergy;
        this.addShockwave(this.heroX, this.heroY, 220, '#10B981', 5);
        this.addFloatingText(this.heroX, this.heroY - 55, `🏆 CERCO SUPERADO! +${rewardBytes} BYTES & ENERGIA MÁX!`, '#10B981', true);
      }
    } else {
      this.siegeCooldownTimer -= dt;
      if (this.siegeCooldownTimer <= 0) {
        this.siegeCooldownTimer = 70.0;
        this.siegeEventTimer = 18.0;
        this.activeEventBanner = {
          text: '🚨 EVENTO: CERCO DE INVASÃO (18s)! SOBREVIVA PARA GANHAR RECOMPENSA!',
          color: '#EF4444',
          timer: 4.5
        };
        this.addScreenShake(5.0, 0.3);
      }
    }

    // Spawna Mini-Boss aos 120s
    if (this.stats.timeSurvivedSeconds >= 120 && !this.isMiniBossSpawned) {
      this.isMiniBossSpawned = true;
      this.spawnMiniBoss(arenaWidth, arenaHeight);
    }

    // Spawna Boss Supremo aos 270s
    if (this.stats.timeSurvivedSeconds >= 270 && !this.isBossSpawned) {
      this.isBossSpawned = true;
      this.spawnMainBoss(arenaWidth, arenaHeight);
    }

    // No Modo Infinito, spawna um novo Boss Abissal a cada 65 segundos!
    if (this.isEndlessMode) {
      this.endlessBossTimer -= dt;
      if (this.endlessBossTimer <= 0) {
        this.endlessBossTimer = 65.0;
        this.spawnMainBoss(arenaWidth, arenaHeight);
      }
    }

    if (this.enemySpawnTimer <= 0) {
      const siegeExtra = this.siegeEventTimer > 0 ? 6 : 0;
      const maxEnemies = Math.min(34, Math.round((8 + phase * 4 + siegeExtra) * corruptionCfg.spawnRateMult));
      if (this.enemies.length < maxEnemies) {
        this.spawnRandomEnemy(phase, arenaWidth, arenaHeight);
      }
      const baseInterval = Math.max(0.32, (1.6 - phase * 0.22) / corruptionCfg.spawnRateMult);
      this.enemySpawnTimer = this.siegeEventTimer > 0 ? baseInterval * 0.6 : baseInterval;
    }
  }

  private spawnTreasureGoblin(arenaWidth: number, arenaHeight: number) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 280;
    const gx = Math.max(100, Math.min(this.worldWidth - 100, this.heroX + Math.cos(angle) * dist));
    const gy = Math.max(100, Math.min(this.worldHeight - 100, this.heroY + Math.sin(angle) * dist));
    const word = getWordForDifficulty(3);

    this.enemies.push({
      id: `goblin_${Date.now()}`,
      type: 'treasure_goblin',
      name: 'Goblin de Bytes Dourado',
      x: gx,
      y: gy,
      width: 44,
      height: 44,
      speed: 135,
      maxHp: 320 + this.getCurrentPhase() * 80,
      hp: 320 + this.getCurrentPhase() * 80,
      damage: 0,
      xpValue: 35,
      word,
      wordTyped: '',
      isBoss: false,
      isElite: true,
      color: '#FACC15',
      glowColor: 'rgba(250, 204, 21, 0.9)',
      escapeTimer: 18.0
    });

    this.activeEventBanner = {
      text: `💰 GOBLIN DO TESOURO SURGIU! DIGITE "${word.toUpperCase()}" ANTES QUE ELE ESCAPE!`,
      color: '#FACC15',
      timer: 5.0
    };
    this.addShockwave(gx, gy, 140, '#FACC15', 4);
    byteQuestAudio.playOverclock();
  }

  public getCurrentPhase(): number {
    const s = this.stats.timeSurvivedSeconds;
    if (s < 45) return 1;
    if (s < 90) return 2;
    if (s < 160) return 3;
    if (s < 240) return 4;
    return 5 + this.endlessLoopCount;
  }

  /**
   * Spawna inimigos em 360 graus na periferia do viewport da câmera no mundo de 2400x1800.
   * Os tipos de inimigos refletem o bioma ativo (Cripta, Forja, Núcleo Quântico) e o Nível de Corrupção.
   */
  private spawnRandomEnemy(phase: number, arenaWidth: number, arenaHeight: number) {
    const corruptionCfg = CORRUPTION_TIERS[this.corruptionTier] || CORRUPTION_TIERS[0];
    const endlessScale = 1 + this.endlessLoopCount * 0.35;
    const hpMult = corruptionCfg.enemyHpMult * endlessScale;
    const spdMult = corruptionCfg.enemySpeedMult;

    const side = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    const margin = 80;

    // Surge logo após as 4 bordas da visão da câmera
    if (side === 0) { // Topo da tela
      x = this.cameraX + Math.random() * arenaWidth;
      y = this.cameraY - margin;
    } else if (side === 1) { // Direita da tela
      x = this.cameraX + arenaWidth + margin;
      y = this.cameraY + Math.random() * arenaHeight;
    } else if (side === 2) { // Fundo da tela
      x = this.cameraX + Math.random() * arenaWidth;
      y = this.cameraY + arenaHeight + margin;
    } else { // Esquerda da tela
      x = this.cameraX - margin;
      y = this.cameraY + Math.random() * arenaHeight;
    }

    // Mantém coordenadas dentro do mapa mundial
    x = Math.max(30, Math.min(this.worldWidth - 30, x));
    y = Math.max(30, Math.min(this.worldHeight - 30, y));

    const eliteChance = this.corruptionTier >= 2 ? 0.38 : 0.28;
    const isElite = phase >= 2 && Math.random() < eliteChance;

    if (isElite) {
      // ─── INIMIGO ELITE DO BIOMA (TEM PALAVRA PARA DIGITAÇÃO CRÍTICA) ───
      const isRanged = Math.random() < 0.5;
      let eliteName = 'Comandante de Plasma (Elite)';
      let eliteColor = '#38BDF8';
      let eliteGlow = 'rgba(56, 189, 248, 0.7)';

      if (this.currentBiome === 'forge') {
        eliteName = isRanged ? 'Lança-Chamas Vulcânico (Elite)' : 'Titã de Lava (Elite)';
        eliteColor = '#F97316';
        eliteGlow = 'rgba(249, 115, 22, 0.75)';
      } else if (this.currentBiome === 'quantum_core') {
        eliteName = isRanged ? 'Espectro Dimensional (Elite)' : 'Sentinela do Vazio (Elite)';
        eliteColor = '#C084FC';
        eliteGlow = 'rgba(192, 132, 252, 0.8)';
      }

      const hp = Math.round((280 + phase * 45) * hpMult);
      const speed = Math.round((isRanged ? 65 : 85) * spdMult);
      const damage = Math.round((18 + phase * 3) * endlessScale);
      const word = getWordForDifficulty(Math.min(4, phase + 1));

      this.enemies.push({
        id: `elite_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type: this.currentBiome === 'forge' ? 'magma_golem' : this.currentBiome === 'quantum_core' ? 'void_wraith' : 'gargoyle',
        name: eliteName,
        x,
        y,
        width: 52,
        height: 52,
        speed,
        maxHp: hp,
        hp,
        damage,
        xpValue: 14,
        word,
        wordTyped: '',
        isBoss: false,
        isElite: true,
        color: eliteColor,
        glowColor: eliteGlow,
        specialPower: isRanged ? 'shoot' : 'dash',
        shootTimer: 2.2,
        hazardCooldownTimer: 3.5 + Math.random() * 2.5
      });
      return;
    }

    // ─── MINIONS COMUNS TEMÁTICOS DO BIOMA ATIVO ───
    let type: EnemyType = 'slime';
    let name = 'Slime de Dados';
    let hp = 45 + phase * 16;
    let speed = 65 + Math.random() * 20;
    let damage = 9 + phase * 2;
    let width = 36;
    let height = 36;
    let color = '#34D399';
    let glowColor = 'rgba(52, 211, 153, 0.4)';

    if (this.currentBiome === 'forge') {
      const isFire = Math.random() < 0.6;
      type = isFire ? 'fire_elemental' : 'magma_golem';
      name = isFire ? 'Elemental de Fogo' : 'Golem de Sucata';
      hp = 65 + phase * 18;
      speed = isFire ? 85 : 55;
      damage = 13 + phase * 2;
      width = isFire ? 38 : 44;
      height = isFire ? 38 : 44;
      color = isFire ? '#EF4444' : '#F97316';
      glowColor = isFire ? 'rgba(239, 68, 68, 0.5)' : 'rgba(249, 115, 22, 0.5)';
    } else if (this.currentBiome === 'quantum_core') {
      const isOrb = Math.random() < 0.55;
      type = isOrb ? 'quantum_orb' : 'void_wraith';
      name = isOrb ? 'Orbe Quântico' : 'Espectro do Vazio';
      hp = 85 + phase * 20;
      speed = isOrb ? 95 : 70;
      damage = 16 + phase * 3;
      width = 40;
      height = 40;
      color = isOrb ? '#A855F7' : '#EC4899';
      glowColor = isOrb ? 'rgba(168, 85, 247, 0.5)' : 'rgba(236, 72, 153, 0.5)';
    } else {
      // Bioma 1: Cripta
      if (phase >= 3 && Math.random() < 0.35) {
        type = 'gargoyle';
        name = 'Gárgula Minion';
        hp = 75 + phase * 18;
        speed = 90 + Math.random() * 25;
        damage = 14 + phase * 3;
        width = 40;
        height = 40;
        color = '#C084FC';
        glowColor = 'rgba(192, 132, 252, 0.4)';
      } else if (phase >= 2 && Math.random() < 0.45) {
        type = 'skeleton';
        name = 'Esqueleto Minion';
        hp = 60 + phase * 16;
        speed = 60 + Math.random() * 15;
        damage = 11 + phase * 2;
        width = 38;
        height = 38;
        color = '#38BDF8';
        glowColor = 'rgba(56, 189, 248, 0.4)';
      }
    }

    hp = Math.round(hp * hpMult);
    speed = Math.round(speed * spdMult);
    damage = Math.round(damage * endlessScale);

    this.enemies.push({
      id: `minion_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      name,
      x,
      y,
      width,
      height,
      speed,
      maxHp: hp,
      hp,
      damage,
      xpValue: type === 'quantum_orb' || type === 'magma_golem' ? 5 : 3,
      word: '', // Sem palavra para minions comuns!
      wordTyped: '',
      isBoss: false,
      isElite: false,
      color,
      glowColor
    });
  }

  private spawnMiniBoss(arenaWidth: number, arenaHeight: number) {
    const corruptionCfg = CORRUPTION_TIERS[this.corruptionTier] || CORRUPTION_TIERS[0];
    const word = getWordForDifficulty(3);
    const hp = Math.round((950 + this.getCurrentPhase() * 150) * corruptionCfg.enemyHpMult);
    const spawnX = Math.min(this.worldWidth - 60, this.cameraX + arenaWidth + 80);
    const spawnY = Math.min(this.worldHeight - 60, Math.max(60, this.cameraY + arenaHeight / 2));

    this.enemies.push({
      id: `miniboss_${Date.now()}`,
      type: 'miniboss',
      name: 'Gárgula Alfa Cibernética (Mini-Chefe)',
      x: spawnX,
      y: spawnY,
      width: 66,
      height: 66,
      speed: 48,
      maxHp: hp,
      hp,
      damage: 28,
      xpValue: 30,
      word,
      wordTyped: '',
      isBoss: true,
      isElite: true,
      color: '#EC4899',
      glowColor: 'rgba(236, 72, 153, 0.75)',
      specialPower: 'shoot',
      shootTimer: 1.8,
      hazardCooldownTimer: 3.0
    });
    this.addFloatingText(this.heroX, this.heroY - 60, '⚠️ MINI-CHEFE SURGIU!', '#EC4899', true);
  }

  private spawnMainBoss(arenaWidth: number, arenaHeight: number) {
    const corruptionCfg = CORRUPTION_TIERS[this.corruptionTier] || CORRUPTION_TIERS[0];
    const endlessScale = 1 + this.endlessLoopCount * 0.45;
    const word = getWordForDifficulty(4);
    const hp = Math.round(5500 * corruptionCfg.enemyHpMult * endlessScale);
    const centerX = this.worldWidth / 2; // 2500
    const centerY = this.worldHeight / 2; // 1800

    const spawnX = centerX;
    const spawnY = centerY - 140;

    // Ativa barreiras rúnicas de contenção da câmara central
    this.bossArenaBarrier = {
      active: true,
      minX: centerX - 850,
      maxX: centerX + 850,
      minY: centerY - 650,
      maxY: centerY + 650,
      pulseTimer: 0
    };

    // Garante que o herói esteja dentro da arena ao iniciar a luta
    this.heroX = Math.max(this.bossArenaBarrier.minX + 80, Math.min(this.bossArenaBarrier.maxX - 80, this.heroX));
    this.heroY = Math.max(this.bossArenaBarrier.minY + 80, Math.min(this.bossArenaBarrier.maxY - 80, this.heroY));

    this.bossWarningMessage = {
      text: '⚠️ CHEFÃO SUPREMO DESPERTOU!',
      subtext: 'BARREIRAS RÚNICAS SELADAS NA CÂMARA!',
      timer: 4.5,
      color: '#EF4444'
    };

    this.enemies.push({
      id: `boss_${Date.now()}`,
      type: 'boss',
      name: this.isEndlessMode
        ? `Arquiteto Abissal Nv.${this.endlessLoopCount + 1} (Chefe Infinito)`
        : 'Guardião Rúnico do Castelo (Chefe Supremo)',
      x: spawnX,
      y: spawnY,
      width: 92,
      height: 92,
      speed: 42,
      maxHp: hp,
      hp,
      damage: Math.round(44 * endlessScale),
      xpValue: 120,
      word,
      wordTyped: '',
      isBoss: true,
      isElite: true,
      color: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.85)',
      specialPower: 'shoot',
      shootTimer: 2.0,
      hazardCooldownTimer: 3.5,
      bossPhase: 1,
      bossHomingCooldown: 3.5,
      bossLaserCooldown: 6.5,
      bossMeteorCooldown: 5.5
    });

    this.addScreenShake(8.5, 0.45);
    this.addShockwave(spawnX, spawnY, 320, '#EF4444', 7);
    this.spawnHitParticles(spawnX, spawnY, '#EF4444', 35, 300);
    this.addFloatingText(this.heroX, this.heroY - 70, '⚔️ CHEFÃO SUPREMO DESPERTOU!', '#F59E0B', true);
  }

  /**
   * Dispara salva de mísseis rúnicos com física de perseguição teleguiada em tempo real
   */
  private fireBossHomingMissiles(boss: CombatEnemy, phase: 1 | 2 | 3) {
    const missileCount = phase === 3 ? 4 : phase === 2 ? 3 : 2;
    const baseAngle = Math.atan2(this.heroY - boss.y, this.heroX - boss.x);
    for (let m = 0; m < missileCount; m++) {
      const spread = (m - (missileCount - 1) / 2) * 0.45;
      const angle = baseAngle + spread;
      const speed = phase === 3 ? 290 : 250;
      this.enemyProjectiles.push({
        id: `boss_homing_${Date.now()}_${m}`,
        x: boss.x + Math.cos(angle) * 35,
        y: boss.y + Math.sin(angle) * 35,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        damage: Math.round(26 * (1 + this.corruptionTier * 0.15)),
        color: phase === 3 ? '#EF4444' : '#F97316',
        radius: 9,
        isHoming: true,
        turnSpeed: phase === 3 ? 2.5 : 2.0,
        speed,
        life: 5.5,
        maxLife: 5.5,
        projectileType: 'homing_missile'
      });
    }
    this.addFloatingText(boss.x, boss.y - 45, '🚀 MÍSSEIS TELEGUIADOS!', '#F97316', true);
    byteQuestAudio.playAttack('bow');
  }

  /**
   * Inicia a mira telegrafada do Canhão Laser Rastreador
   */
  private startBossLaserTelegraph(boss: CombatEnemy) {
    const angle = Math.atan2(this.heroY - boss.y, this.heroX - boss.x);
    this.bossLaserTelegraphs.push({
      id: `laser_${Date.now()}`,
      startX: boss.x,
      startY: boss.y,
      angle,
      length: 1200,
      chargeTimer: 1.4,
      duration: 1.4,
      firingTimer: 0.55,
      width: 24,
      damage: Math.round(42 * (1 + this.corruptionTier * 0.2)),
      color: '#EF4444'
    });
    this.addFloatingText(boss.x, boss.y - 50, '⚡ TRAVANDO LASER!', '#EF4444', true);
  }

  /**
   * Verifica se o feixe de laser atinge o herói ou se foi bloqueado por algum pilar
   */
  private checkLaserHeroCollision(laser: import('../../../types/byteQuest').BossLaserTelegraph) {
    const endX = laser.startX + Math.cos(laser.angle) * laser.length;
    const endY = laser.startY + Math.sin(laser.angle) * laser.length;

    const ldx = endX - laser.startX;
    const ldy = endY - laser.startY;
    const lenSq = ldx * ldx + ldy * ldy || 1;
    const tHero = Math.max(0, Math.min(1, ((this.heroX - laser.startX) * ldx + (this.heroY - laser.startY) * ldy) / lenSq));
    const closestHeroX = laser.startX + tHero * ldx;
    const closestHeroY = laser.startY + tHero * ldy;
    const distToLine = Math.hypot(this.heroX - closestHeroX, this.heroY - closestHeroY);

    if (distToLine <= laser.width / 2 + this.heroRadius) {
      let blockedByPillar = false;
      for (const obs of this.obstacles) {
        const tObs = Math.max(0, Math.min(1, ((obs.x - laser.startX) * ldx + (obs.y - laser.startY) * ldy) / lenSq));
        if (tObs < tHero) {
          const obsProjX = laser.startX + tObs * ldx;
          const obsProjY = laser.startY + tObs * ldy;
          if (Math.hypot(obs.x - obsProjX, obs.y - obsProjY) <= obs.radius) {
            blockedByPillar = true;
            break;
          }
        }
      }

      if (!blockedByPillar) {
        this.handleHeroHit(laser.damage * 0.08);
        this.spawnHitParticles(this.heroX, this.heroY, '#EF4444', 3, 120);
        this.addScreenShake(2.5, 0.1);
      } else {
        if (Math.random() < 0.2) {
          this.addFloatingText(this.heroX, this.heroY - 30, '🛡️ PROTEGIDO POR PILAR!', '#38BDF8');
        }
      }
    }
  }

  /**
   * Dispara chuva de meteoros nas fases finais do Boss
   */
  private triggerBossMeteorStorm(boss: CombatEnemy) {
    const meteorCount = 3;
    for (let m = 0; m < meteorCount; m++) {
      const offsetX = (Math.random() - 0.5) * 600;
      const offsetY = (Math.random() - 0.5) * 450;
      const minX = this.bossArenaBarrier?.minX || 1700;
      const maxX = this.bossArenaBarrier?.maxX || 3300;
      const minY = this.bossArenaBarrier?.minY || 1200;
      const maxY = this.bossArenaBarrier?.maxY || 2400;
      const mx = Math.max(minX, Math.min(maxX, this.heroX + offsetX));
      const my = Math.max(minY, Math.min(maxY, this.heroY + offsetY));

      this.hazardZones.push({
        id: `meteor_hz_${Date.now()}_${m}`,
        x: mx,
        y: my,
        radius: 110,
        progress: 0,
        duration: 1.25,
        damage: Math.round(38 * (1 + this.corruptionTier * 0.15)),
        color: '#EF4444'
      });
    }
    this.addFloatingText(boss.x, boss.y - 45, '☄️ CHUVA DE METEOROS!', '#EF4444', true);
  }

  /**
   * Checagem de contato dos orbes orbitais mágicos
   */
  private checkOrbitalCollisions() {
    const orbitRadius = 65;
    for (let i = 0; i < this.upgrades.orbitalCount; i++) {
      const angle = this.orbitalAngle + (i * Math.PI * 2) / this.upgrades.orbitalCount;
      const orbX = this.heroX + Math.cos(angle) * orbitRadius;
      const orbY = this.heroY + Math.sin(angle) * orbitRadius;

      for (const enemy of this.enemies) {
        if (Math.hypot(orbX - enemy.x, orbY - enemy.y) < 14 + enemy.width / 2) {
          const orbDmg = 9 + Math.round(this.upgrades.damageBonus * 0.4);
          this.damageEnemy(enemy, orbDmg, false);
        }
      }
    }
  }

  /**
   * Atualiza o estado das teclas direcionais (Setas) para movimentação suave
   */
  public handleDirectionKey(key: string, isDown: boolean) {
    this.keysPressed[key] = isDown;
  }

  /**
   * Registra um acerto no Combo de Digitação e ativa Overclock a cada 15 acertos
   */
  private registerTypingComboHit() {
    this.stats.keysCorrect++;
    this.typingCombo++;
    if (this.typingCombo > this.maxTypingCombo) {
      this.maxTypingCombo = this.typingCombo;
    }

    if (this.typingCombo > 0 && this.typingCombo % 15 === 0) {
      this.overclockTimer = Math.max(this.overclockTimer, 8.0);
      byteQuestAudio.playOverclock();
      this.addShockwave(this.heroX, this.heroY, 150, '#FACC15', 4);
      this.spawnHitParticles(this.heroX, this.heroY, '#FACC15', 16, 220);
      this.addFloatingText(this.heroX, this.heroY - 55, `⚡ OVERCLOCK ATIVO! (${this.typingCombo}x COMBO)`, '#FACC15', true);
    }
  }

  /**
   * Registra um erro de digitação: zera o combo, aplica tremor e som de curto-circuito
   */
  private registerTypingError(targetEnemy?: CombatEnemy) {
    if (this.typingCombo >= 5) {
      this.addFloatingText(this.heroX, this.heroY - 40, 'COMBO QUEBRADO!', '#EF4444');
    }
    this.typingCombo = 0;
    byteQuestAudio.playTypeError();

    if (targetEnemy) {
      targetEnemy.wordErrorShakeTimer = 0.28;
      this.spawnHitParticles(targetEnemy.x, targetEnemy.y - 30, '#EF4444', 6, 120);
    } else {
      this.spawnHitParticles(this.heroX, this.heroY - 25, '#EF4444', 5, 100);
    }
  }

  /**
   * Resolução da entrada de digitação do jogador
   */
  public handleKeyPress(key: string): boolean {
    if (this.stats.hp <= 0) return false;

    // Se a tecla for Escape ou Backspace, limpa acento pendente
    if (key === 'Escape' || key === 'Backspace') {
      this.pendingAccent = null;
    }

    // Se for acento isolado, guarda em pendingAccent e retorna true (absorve sem quebrar combo)
    if (isAccentKey(key)) {
      this.pendingAccent = key;
      return true;
    }

    // Se temos acento pendente e veio um caractere alfanumérico
    let processedKey = key;
    if (this.pendingAccent && key.length === 1) {
      processedKey = combineAccent(this.pendingAccent, key);
      this.pendingAccent = null;
    }

    this.stats.keysTyped++;

    // Verifica modo de comando de feitiço com '/'
    if (processedKey === '/' || this.spellBuffer.length > 0) {
      if (processedKey === 'Backspace') {
        this.spellBuffer = this.spellBuffer.slice(0, -1);
        return true;
      }
      if (processedKey === 'Escape') {
        this.spellBuffer = '';
        return true;
      }
      if (processedKey.length === 1) {
        this.spellBuffer += processedKey.toLowerCase();
        // Checa se corresponde a um feitiço do arquétipo
        const matchedSpell = this.availableSpells.find(
          (s) => s.command.toLowerCase() === this.spellBuffer.toLowerCase()
        );
        if (matchedSpell) {
          this.castSpell(matchedSpell.id);
          this.spellBuffer = '';
          return true;
        }
      }
      return true;
    }

    // Escape destrava o alvo, santuário ou terminal atual
    if (processedKey === 'Escape') {
      if (this.lockedEnemyId) {
        const prev = this.enemies.find((e) => e.id === this.lockedEnemyId);
        if (prev) prev.wordTyped = '';
        this.lockedEnemyId = null;
      }
      if (this.lockedShrineId) {
        const prevS = this.shrines.find((s) => s.id === this.lockedShrineId);
        if (prevS) prevS.wordTyped = '';
        this.lockedShrineId = null;
      }
      if (this.chamberPortals.length > 0) {
        this.chamberPortals.forEach((p) => { p.activationProgress = ''; });
      }
      if (this.chamberTerminal) {
        this.chamberTerminal.offers.forEach((o) => { o.activationWordTyped = ''; });
      }
      return true;
    }

    // 0. Portais de Salto Holográficos Ativos Próximos (< 260px)
    if (this.chamberPortals.length > 0) {
      const nearPortal = this.chamberPortals.find(
        (p) => p.active && Math.hypot(p.x - this.heroX, p.y - this.heroY) <= p.radius + 120
      );
      if (nearPortal) {
        const expectedChar = nearPortal.activationWord[nearPortal.activationProgress.length];
        if (matchChars(processedKey, expectedChar)) {
          this.registerTypingComboHit();
          nearPortal.activationProgress += nearPortal.activationWord[nearPortal.activationProgress.length];
          byteQuestAudio.playTypeHit();
          if (nearPortal.activationProgress.length >= nearPortal.activationWord.length) {
            this.activateChamberPortal(nearPortal);
          }
          return true;
        }
      }
    }

    // 0.5. Terminal Híbrido da Câmara Próximo (< 260px)
    if (this.chamberTerminal && this.chamberTerminal.active && Math.hypot(this.chamberTerminal.x - this.heroX, this.chamberTerminal.y - this.heroY) <= this.chamberTerminal.radius + 120) {
      const matchingOffer = this.chamberTerminal.offers.find(
        (o) => !o.purchased && matchChars(processedKey, o.activationWord[o.activationWordTyped.length])
      );
      if (matchingOffer) {
        this.registerTypingComboHit();
        matchingOffer.activationWordTyped += matchingOffer.activationWord[matchingOffer.activationWordTyped.length];
        byteQuestAudio.playTypeHit();
        if (matchingOffer.activationWordTyped.length >= matchingOffer.activationWord.length) {
          this.executeTerminalPurchase(matchingOffer);
        }
        return true;
      }
    }

    // 1. Se temos um Santuário de Código travado e próximo
    if (this.lockedShrineId) {
      const shrine = this.shrines.find((s) => s.id === this.lockedShrineId && s.active);
      if (shrine && Math.hypot(shrine.x - this.heroX, shrine.y - this.heroY) <= 280) {
        const expectedNextChar = shrine.word[shrine.wordTyped.length];
        if (matchChars(processedKey, expectedNextChar)) {
          this.registerTypingComboHit();
          shrine.wordTyped += shrine.word[shrine.wordTyped.length];
          byteQuestAudio.playTypeHit();

          if (shrine.wordTyped.length >= shrine.word.length) {
            this.activateShrine(shrine);
          }
          return true;
        } else {
          shrine.errorShakeTimer = 0.28;
          this.registerTypingError();
          return false;
        }
      } else {
        if (shrine) shrine.wordTyped = '';
        this.lockedShrineId = null;
      }
    }

    // 2. Se temos um Inimigo travado
    if (this.lockedEnemyId) {
      const target = this.enemies.find((e) => e.id === this.lockedEnemyId);
      if (target) {
        const expectedNextChar = target.word[target.wordTyped.length];
        if (matchChars(processedKey, expectedNextChar)) {
          this.registerTypingComboHit();
          target.wordTyped += target.word[target.wordTyped.length];
          byteQuestAudio.playTypeHit();

          // Animação de ataque engajada a cada acerto rítmico
          const targetAngle = Math.atan2(target.y - this.heroY, target.x - this.heroX);
          this.heroFacing = Math.cos(targetAngle) >= 0 ? 'right' : 'left';
          this.heroAttackAngle = targetAngle;
          this.heroAttackTimer = 0.16;
          this.heroAttackDuration = 0.16;

          if (target.wordTyped.length >= target.word.length) {
            this.executeCriticalWordKill(target);
          }
          return true;
        } else {
          this.registerTypingError(target);
          return false;
        }
      } else {
        this.lockedEnemyId = null;
      }
    }

    // 3. Procura Santuário de Código próximo (< 260px) que comece com a tecla digitada
    const shrineCandidate = this.shrines
      .filter((s) => s.active && Math.hypot(s.x - this.heroX, s.y - this.heroY) <= 260 && matchChars(processedKey, s.word[s.wordTyped.length]))
      .sort((a, b) => Math.hypot(a.x - this.heroX, a.y - this.heroY) - Math.hypot(b.x - this.heroX, b.y - this.heroY))[0];

    if (shrineCandidate) {
      this.registerTypingComboHit();
      this.lockedShrineId = shrineCandidate.id;
      shrineCandidate.wordTyped += shrineCandidate.word[shrineCandidate.wordTyped.length];
      byteQuestAudio.playTypeHit();

      if (shrineCandidate.wordTyped.length >= shrineCandidate.word.length) {
        this.activateShrine(shrineCandidate);
      }
      return true;
    }

    // 4. Procura novo Inimigo que comece com a tecla digitada
    const candidate = this.enemies
      .filter((e) => e.word.length > 0 && matchChars(processedKey, e.word[0]))
      .sort((a, b) => Math.hypot(a.x - this.heroX, a.y - this.heroY) - Math.hypot(b.x - this.heroX, b.y - this.heroY))[0];

    if (candidate) {
      this.registerTypingComboHit();
      this.lockedEnemyId = candidate.id;
      candidate.wordTyped = candidate.word[0];
      byteQuestAudio.playTypeHit();

      // Animação de ataque engajada no travamento do alvo
      const candAngle = Math.atan2(candidate.y - this.heroY, candidate.x - this.heroX);
      this.heroFacing = Math.cos(candAngle) >= 0 ? 'right' : 'left';
      this.heroAttackAngle = candAngle;
      this.heroAttackTimer = 0.16;
      this.heroAttackDuration = 0.16;

      if (candidate.wordTyped.length >= candidate.word.length) {
        this.executeCriticalWordKill(candidate);
      }
      return true;
    }

    return false;
  }

  /**
   * Ativa o Santuário de Código quando o jogador completa sua palavra-chave
   */
  private activateShrine(shrine: CodeShrine) {
    shrine.active = false;
    shrine.wordTyped = '';
    this.lockedShrineId = null;
    this.stats.wordsTypedCount++;
    this.triggerPassives('on_word_complete');

    this.addScreenShake(6.5, 0.3);
    this.addShockwave(shrine.x, shrine.y, 180, shrine.color, 5);
    this.spawnHitParticles(shrine.x, shrine.y, shrine.color, 24, 240);
    byteQuestAudio.playOverclock();

    const durationMult = this.activeAiChips.includes('chip_shrine_resonator') ? 1.5 : 1.0;

    if (shrine.shrineType === 'overclock') {
      const dur = Math.round(12.0 * durationMult);
      this.overclockTimer = Math.max(this.overclockTimer, dur);
      this.addFloatingText(shrine.x, shrine.y - 45, `⚡ SANTUÁRIO DE OVERCLOCK ATIVADO! (${dur}s)`, '#F59E0B', true);
    } else if (shrine.shrineType === 'restore') {
      const heal = Math.round(this.stats.maxHp * 0.5 * durationMult);
      this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + heal);
      this.stats.energy = this.stats.maxEnergy;
      this.addFloatingText(shrine.x, shrine.y - 45, `💚 +${heal} HP & ENERGIA MÁXIMA!`, '#10B981', true);
    } else if (shrine.shrineType === 'fortune') {
      const bonus = Math.round(150 * durationMult);
      this.stats.bonusBytesEarned += bonus;
      this.addXp(25);
      this.addFloatingText(shrine.x, shrine.y - 45, `💎 +${bonus} BYTES & +25 XP!`, '#38BDF8', true);
    } else if (shrine.shrineType === 'aegis') {
      const shieldBonus = Math.round(120 * durationMult);
      this.stats.shieldHp = Math.min(this.stats.maxHp * 1.5, this.stats.shieldHp + shieldBonus);
      this.invulnerabilityTimer = Math.max(this.invulnerabilityTimer, 3.0 * durationMult);
      this.addFloatingText(shrine.x, shrine.y - 45, `🛡️ BALUARTE ATIVADO! +${shieldBonus} ESCUDO RÚNICO!`, '#6366F1', true);
      this.addShockwave(shrine.x, shrine.y, 220, '#6366F1', 4);
    } else if (shrine.shrineType === 'frenzy') {
      const frenzyDur = Math.round(14.0 * durationMult);
      this.frenzyTimer = Math.max(this.frenzyTimer, frenzyDur);
      this.addFloatingText(shrine.x, shrine.y - 45, `🔥 FRENESI DE COMBATE! (+100% CADÊNCIA POR ${frenzyDur}s)`, '#EC4899', true);
      this.addShockwave(shrine.x, shrine.y, 220, '#EC4899', 4);
    } else if (shrine.shrineType === 'magnet') {
      this.gems.forEach((g) => {
        g.magnetized = true;
      });
      this.addFloatingText(shrine.x, shrine.y - 45, '🧲 PULSO MAGNÉTICO GLOBAL! GEMAS ATRAÍDAS!', '#A855F7', true);
      this.addShockwave(shrine.x, shrine.y, 450, '#A855F7', 6);
    }
  }

  private executeCriticalWordKill(enemy: CombatEnemy) {
    this.stats.wordsTypedCount++;
    this.stats.criticalHits++;
    this.lockedEnemyId = null;
    this.triggerPassives('on_word_complete', enemy);

    // Grande animação de ataque crítico no herói
    const critAngle = Math.atan2(enemy.y - this.heroY, enemy.x - this.heroX);
    this.heroFacing = Math.cos(critAngle) >= 0 ? 'right' : 'left';
    this.heroAttackAngle = critAngle;
    this.heroAttackTimer = 0.35;
    this.heroAttackDuration = 0.35;
    if (this.rpgClass === 'warrior') {
      this.meleeSlashTimer = 0.35;
      this.meleeSlashAngle = critAngle;
      // Onda de corte gigante dourada devastadora
      this.slashWaves.push({
        id: `sw_crit_${Date.now()}`,
        x: this.heroX,
        y: this.heroY,
        angle: critAngle,
        radius: 175,
        progress: 0,
        duration: 0.38,
        life: 0.38,
        isCrit: true,
        color: '#FACC15',
        weaponKey: this.loadout.weapon?.visualAssetKey
      });
    }

    const overclockBoost = this.overclockTimer > 0 ? 1.25 : 1.0;

    // ─── CHEFÃO SUPREMO: DIGITAR NÃO O MATA INSTANTANEAMENTE, MAS QUEBRA POSTURA E CANCELA ATAQUES! ───
    if (enemy.isBoss) {
      if (enemy.firewallActiveTimer && enemy.firewallActiveTimer > 0) {
        enemy.firewallActiveTimer = 0;
      }
      // Cancela mísseis teleguiados em curso e miras de laser
      this.enemyProjectiles = this.enemyProjectiles.filter((ep) => !ep.isHoming);
      this.bossLaserTelegraphs = [];

      enemy.stunTimer = 3.5; // Atordoa o Boss por 3.5s
      const staggerDmg = Math.round(enemy.maxHp * 0.14 + (240 + this.upgrades.damageBonus * 6) * this.upgrades.typingCritMultiplier * overclockBoost);
      this.hitstopTimer = 0.12;
      this.addScreenShake(9.0, 0.35);
      this.addShockwave(enemy.x, enemy.y, 220, '#38BDF8', 6);
      this.spawnHitParticles(enemy.x, enemy.y, '#38BDF8', 30, 320);
      this.addFloatingText(enemy.x, enemy.y - 55, `💥 POSTURA QUEBRADA! ATORDOADO! (-${staggerDmg})`, '#38BDF8', true);
      this.damageEnemy(enemy, staggerDmg, true, true);
      byteQuestAudio.playCriticalWordKill();

      if (enemy.hp > 0) {
        enemy.word = getWordForDifficulty(4);
        enemy.wordTyped = '';
      }
      return;
    }

    // Se um Elite comum estava com Firewall Criptográfico ativo
    if (enemy.firewallActiveTimer && enemy.firewallActiveTimer > 0) {
      enemy.firewallActiveTimer = 0;
      enemy.stunTimer = 3.5;
      const firewallBreakDmg = Math.round(enemy.maxHp * 0.22);
      this.hitstopTimer = 0.12;
      this.addScreenShake(9.5, 0.35);
      this.addShockwave(enemy.x, enemy.y, 190, '#38BDF8', 6);
      this.spawnHitParticles(enemy.x, enemy.y, '#38BDF8', 28, 300);
      this.addFloatingText(enemy.x, enemy.y - 50, '💥 FIREWALL QUEBRADO! ATORDOADO!', '#38BDF8', true);
      this.damageEnemy(enemy, firewallBreakDmg, true, true);
      byteQuestAudio.playCriticalWordKill();
      if (enemy.hp > 0) {
        enemy.word = getWordForDifficulty(4);
        enemy.wordTyped = '';
      }
      return;
    }

    // Dano crítico devastador ao digitar a palavra do Elite (+25% em Overclock)
    const critDmg = Math.round((240 + this.upgrades.damageBonus * 6) * this.upgrades.typingCritMultiplier * overclockBoost);
    this.hitstopTimer = 0.09; // 90ms de hitstop tátil
    this.addScreenShake(6.5, 0.24);
    this.addShockwave(enemy.x, enemy.y, 110, '#FACC15', 4);
    this.spawnHitParticles(enemy.x, enemy.y, '#FACC15', 18, 260);

    this.damageEnemy(enemy, critDmg, true, true);
    byteQuestAudio.playCriticalWordKill();

    // Upgrade Exclusivo Guerreiro: Lâmina Sísmica ao finalizar palavra
    if (this.upgrades.warriorQuakeLevel > 0) {
      const quakeRad = 165 + this.upgrades.warriorQuakeLevel * 30;
      const quakeDmg = Math.round(critDmg * (0.35 + this.upgrades.warriorQuakeLevel * 0.15));
      this.addShockwave(enemy.x, enemy.y, quakeRad, '#F97316', 5);
      for (const other of this.enemies) {
        if (other.id !== enemy.id && Math.hypot(other.x - enemy.x, other.y - enemy.y) <= quakeRad) {
          this.damageEnemy(other, quakeDmg, true);
        }
      }
    }

    if (enemy.hp > 0 && (enemy.isBoss || enemy.isElite)) {
      enemy.word = getWordForDifficulty(enemy.isBoss ? 4 : 3);
      enemy.wordTyped = '';
    }
  }

  public damageEnemy(enemy: CombatEnemy, amount: number, isCrit: boolean = false, ignoreFirewall: boolean = false) {
    // Se o Boss está protegido pelo Firewall Criptográfico, bloqueia ataques comuns
    if (enemy.firewallActiveTimer && enemy.firewallActiveTimer > 0 && !ignoreFirewall) {
      if (Math.random() < 0.35) {
        this.addFloatingText(enemy.x, enemy.y - 25, '🛡️ FIREWALL (DIGITE!)', '#38BDF8');
      }
      return;
    }

    let finalAmount = amount;
    // Subclasse Arqueiro Franco-Atirador: +35% dano em Elites e Chefes
    if (this.subclass === 'archer_sniper' && (enemy.isElite || enemy.isBoss)) {
      finalAmount = Math.round(finalAmount * 1.35);
    }
    // Chip de IA: Rastreador de Tesouro (+30% dano quando há Goblin ou Boss na arena)
    if (
      this.activeAiChips.includes('chip_goblin_hunter') &&
      this.enemies.some((e) => e.type === 'treasure_goblin' || e.isBoss)
    ) {
      finalAmount = Math.round(finalAmount * 1.3);
    }

    enemy.hp -= finalAmount;
    enemy.hitFlash = Date.now();
    enemy.hitFlashTimer = 0.12;
    this.stats.damageDealt += finalAmount;

    // Gatilho da Fase de Firewall do Boss ao cair para <= 50% de HP pela primeira vez
    if (enemy.isBoss && !enemy.firewallTriggered && enemy.hp > 0 && enemy.hp <= enemy.maxHp * 0.5) {
      enemy.firewallTriggered = true;
      enemy.firewallActiveTimer = 12.0;
      enemy.word = getWordForDifficulty(4);
      enemy.wordTyped = '';
      this.addShockwave(enemy.x, enemy.y, 160, '#38BDF8', 5);
      this.addFloatingText(enemy.x, enemy.y - 55, '🛡️ FIREWALL CRIPTOGRÁFICO ATIVO!', '#38BDF8', true);
    }

    // Partículas dinâmicas de impacto correspondentes à classe
    const sparkColor = isCrit
      ? '#FACC15'
      : this.rpgClass === 'mage'
      ? '#C084FC'
      : this.rpgClass === 'archer'
      ? '#34D399'
      : '#EF4444';

    this.spawnHitParticles(enemy.x, enemy.y, sparkColor, isCrit ? 9 : 5, isCrit ? 220 : 140);
    byteQuestAudio.playHitCrunch(isCrit);

    if (isCrit) {
      this.stats.criticalHits++;
      this.hitstopTimer = Math.max(this.hitstopTimer, 0.055); // 55ms de micro-pausa
      this.addScreenShake(3.5, 0.16);
      byteQuestAudio.playCritHit();
      this.triggerPassives('on_crit', enemy);

      // Subclasse Feiticeiro do Vazio: Críticos puxam inimigos próximos para perto do alvo
      if (this.subclass === 'mage_voidwalker') {
        for (const other of this.enemies) {
          if (other.id !== enemy.id && Math.hypot(other.x - enemy.x, other.y - enemy.y) <= 130) {
            const pullAng = Math.atan2(enemy.y - other.y, enemy.x - other.x);
            other.x += Math.cos(pullAng) * 24;
            other.y += Math.sin(pullAng) * 24;
          }
        }
      }
    }

    this.addFloatingText(enemy.x, enemy.y - 15, `${finalAmount}${isCrit ? '!' : ''}`, isCrit ? '#FACC15' : '#FFFFFF', isCrit);

    if (enemy.hp <= 0) {
      this.killEnemy(enemy);
    }
  }

  private triggerPassives(
    trigger: 'on_crit' | 'on_kill' | 'on_hit_taken' | 'on_low_hp' | 'on_mobility' | 'on_word_complete',
    targetEnemy?: CombatEnemy
  ) {
    const items = [
      this.loadout.weapon,
      this.loadout.chest,
      this.loadout.head,
      this.loadout.boots,
      this.loadout.accessory,
      this.loadout.relic
    ];
    for (const item of items) {
      if (!item || !item.passiveAbility) continue;
      const passive = item.passiveAbility;
      if (passive.trigger !== trigger) continue;

      if (Math.random() * 100 <= passive.chancePercent) {
        this.executePassiveEffect(passive, targetEnemy);
      }
    }
  }

  private executePassiveEffect(passive: import('../../../types/byteQuest').ItemPassiveEffect, targetEnemy?: CombatEnemy) {
    switch (passive.type) {
      case 'lightning_strike': {
        const originX = targetEnemy ? targetEnemy.x : this.heroX;
        const originY = targetEnemy ? targetEnemy.y : this.heroY;
        const count = Math.round(passive.value || 3);
        this.triggerChainLightning(originX, originY, count);
        this.addShockwave(originX, originY, 90, '#FACC15', 3);
        this.addFloatingText(originX, originY - 30, `⚡ ${passive.name.toUpperCase()}`, '#FACC15', true);
        break;
      }
      case 'frost_nova': {
        const duration = passive.value || 2.5;
        this.stats.freezeDuration = Math.max(this.stats.freezeDuration, duration);
        this.addShockwave(this.heroX, this.heroY, 140, '#38BDF8', 3);
        this.addFloatingText(this.heroX, this.heroY - 45, `❄️ ${passive.name.toUpperCase()}`, '#38BDF8', true);
        break;
      }
      case 'rage_burst': {
        const duration = passive.value || 3.0;
        this.upgrades.rageBuffTimer = Math.max(this.upgrades.rageBuffTimer, duration);
        this.addFloatingText(this.heroX, this.heroY - 45, `🔥 ${passive.name.toUpperCase()}`, '#EF4444', true);
        break;
      }
      case 'speed_surge': {
        const duration = passive.value || 3.0;
        this.upgrades.speedBuffTimer = Math.max(this.upgrades.speedBuffTimer, duration);
        this.addFloatingText(this.heroX, this.heroY - 45, `💨 ${passive.name.toUpperCase()}`, '#34D399', true);
        break;
      }
      case 'vampirism': {
        const heal = Math.round(passive.value || 12);
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + heal);
        this.addFloatingText(this.heroX, this.heroY - 35, `+${heal} HP`, '#10B981', true);
        break;
      }
      case 'quantum_shield': {
        const shieldAmount = Math.round(passive.value || 80);
        this.stats.shieldHp = Math.max(this.stats.shieldHp, shieldAmount);
        this.stats.shieldDuration = 5.0;
        this.addShockwave(this.heroX, this.heroY, 110, '#818CF8', 3);
        this.addFloatingText(this.heroX, this.heroY - 45, `🛡️ ${passive.name.toUpperCase()}`, '#818CF8', true);
        break;
      }
      case 'mobility_fire_trail': {
        const dmg = Math.round(passive.value || 35);
        for (let t = 0; t < 3; t++) {
          this.fireTrails.push({
            id: `ftrail_${Date.now()}_${t}_${Math.random()}`,
            x: this.heroX + (Math.random() - 0.5) * 45,
            y: this.heroY + (Math.random() - 0.5) * 45,
            radius: 42,
            life: 4.0,
            maxLife: 4.0,
            damagePerSec: dmg,
            tickTimer: 0.1
          });
        }
        break;
      }
      case 'mobility_shock_nova': {
        const novaDmg = Math.round((passive.value || 90) + this.upgrades.damageBonus);
        this.addShockwave(this.heroX, this.heroY, 150, '#C084FC', 4);
        this.addFloatingText(this.heroX, this.heroY - 45, `⚡ ${passive.name.toUpperCase()}`, '#C084FC', true);
        for (const e of this.enemies) {
          if (Math.hypot(e.x - this.heroX, e.y - this.heroY) <= 150) {
            this.damageEnemy(e, novaDmg, true);
          }
        }
        break;
      }
      case 'summon_spirit': {
        const spiritCount = Math.round(passive.value || 2);
        this.addFloatingText(this.heroX, this.heroY - 42, `👻 +${spiritCount} ESPÍRITOS COMPILADOS!`, '#34D399', true);
        if (spiritCount >= 4) {
          this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + 10);
        }
        for (let s = 0; s < spiritCount; s++) {
          const ang = (s * Math.PI * 2) / spiritCount;
          this.projectiles.push({
            id: `spirit_${Date.now()}_${s}_${Math.random()}`,
            x: this.heroX + Math.cos(ang) * 24,
            y: this.heroY + Math.sin(ang) * 24,
            vx: Math.cos(ang) * 440,
            vy: Math.sin(ang) * 440,
            damage: 48 + this.upgrades.damageBonus * 1.2,
            color: '#34D399',
            radius: 7,
            pierceCount: 2,
            isCrit: true,
            projectileType: 'spirit_wisp'
          });
        }
        break;
      }
    }
  }

  private killEnemy(enemy: CombatEnemy) {
    const idx = this.enemies.indexOf(enemy);
    if (idx !== -1) {
      this.enemies.splice(idx, 1);
    }
    this.stats.enemiesDefeated++;
    byteQuestAudio.playEnemyDeath();

    // Subclasse Guerreiro Berserker Carmesim: +3 HP por abate
    if (this.subclass === 'warrior_berserker') {
      this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + 3);
    }

    // Recompensa Especial do Goblin do Tesouro!
    if (enemy.type === 'treasure_goblin') {
      this.stats.goblinsDefeated = (this.stats.goblinsDefeated || 0) + 1;
      const bountyMult = 1 + (this.talents.bounty_hunter || 0) * 0.15;
      const goblinBytes = Math.round(250 * bountyMult);
      this.stats.bonusBytesEarned += goblinBytes;
      this.addScreenShake(8.0, 0.35);
      this.addShockwave(enemy.x, enemy.y, 190, '#FACC15', 5);
      this.spawnHitParticles(enemy.x, enemy.y, '#FACC15', 28, 260);
      this.addFloatingText(enemy.x, enemy.y - 45, `💰 GOBLIN ABATIDO! +${goblinBytes} BYTES & BAÚ!`, '#FACC15', true);
      this.pickups.push({
        id: `chest_goblin_${Date.now()}`,
        pickupType: 'loot_chest',
        x: enemy.x,
        y: enemy.y,
        radius: 20,
        life: 25.0,
        pulseTimer: 0
      });
    }

    // Efeito de explosão e shockwave na morte
    this.spawnHitParticles(
      enemy.x,
      enemy.y,
      enemy.isBoss ? '#F59E0B' : enemy.isElite ? '#C084FC' : '#38BDF8',
      enemy.isBoss ? 24 : 10,
      210
    );
    if (enemy.isElite || enemy.isBoss) {
      this.addScreenShake(enemy.isBoss ? 7.5 : 4.2, 0.22);
      this.addShockwave(
        enemy.x,
        enemy.y,
        enemy.isBoss ? 160 : 85,
        enemy.isBoss ? '#F59E0B' : '#C084FC',
        4
      );
    }

    // Geração de Energia ao Abater Inimigos (+30% em Overclock)
    const baseEnergy = enemy.isBoss ? 35 : enemy.isElite ? 22 : 6;
    const energyGained = this.overclockTimer > 0 ? Math.round(baseEnergy * 1.35) : baseEnergy;
    this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + energyGained);

    // Drops Táticos ao abater Elites (45% chance) ou Bosses (100% chance de Baú Lendário Permanente!)
    if (enemy.isBoss) {
      this.bossArenaBarrier = null;
      this.bossLaserTelegraphs = [];
      this.enemyProjectiles = this.enemyProjectiles.filter((p) => !p.isHoming);
      this.addScreenShake(10.0, 0.5);
      this.addShockwave(enemy.x, enemy.y, 360, '#FACC15', 7);
      this.spawnHitParticles(enemy.x, enemy.y, '#FACC15', 36, 360);
      this.bossWarningMessage = {
        text: '🏆 CHEFÃO SUPREMO DERROTADO!',
        subtext: 'BARREIRAS RÚNICAS LIBERADAS! MAPA ABERTO!',
        timer: 5.0,
        color: '#10B981'
      };
      this.pickups.push({
        id: `chest_boss_${Date.now()}`,
        pickupType: 'loot_chest',
        x: enemy.x,
        y: enemy.y,
        radius: 24,
        life: 999999,
        pulseTimer: 0
      });
      byteQuestAudio.playVictory();
    } else if (enemy.isElite && enemy.type !== 'treasure_goblin' && Math.random() < 0.48) {
      const pickupTypes: Array<'health_battery' | 'global_magnet' | 'plasma_cell' | 'loot_chest'> = [
        'health_battery',
        'global_magnet',
        'plasma_cell',
        'loot_chest'
      ];
      const chosenType = pickupTypes[Math.floor(Math.random() * pickupTypes.length)];
      this.pickups.push({
        id: `pickup_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        pickupType: chosenType,
        x: enemy.x + (Math.random() - 0.5) * 24,
        y: enemy.y + (Math.random() - 0.5) * 24,
        radius: 16,
        life: 18.0,
        pulseTimer: 0
      });
    }

    // Efeitos passivos ativados ao abater monstros
    this.triggerPassives('on_kill', enemy);

    if (this.lockedEnemyId === enemy.id) {
      this.lockedEnemyId = null;
    }

    const gemCount = enemy.isBoss ? 10 : enemy.isElite ? 4 : 1;
    for (let i = 0; i < gemCount; i++) {
      const offsetX = (Math.random() - 0.5) * 30;
      const offsetY = (Math.random() - 0.5) * 30;
      this.gems.push({
        id: `gem_${Date.now()}_${Math.random()}`,
        x: enemy.x + offsetX,
        y: enemy.y + offsetY,
        xpValue: enemy.xpValue / gemCount,
        color: enemy.isBoss ? '#F59E0B' : enemy.isElite ? '#C084FC' : '#38BDF8'
      });
    }

    if (this.upgrades.chainLightningLevel > 0) {
      this.triggerChainLightning(enemy.x, enemy.y, this.upgrades.chainLightningLevel);
    }
  }

  private triggerChainLightning(originX: number, originY: number, count: number) {
    const nearby = this.enemies
      .slice()
      .sort((a, b) => Math.hypot(a.x - originX, a.y - originY) - Math.hypot(b.x - originX, b.y - originY))
      .slice(0, count);

    let prevX = originX;
    let prevY = originY;

    nearby.forEach((target) => {
      this.damageEnemy(target, 32 + this.upgrades.damageBonus, true);

      // Gera geometria de raio ziguezagueante e realista entre os alvos
      const points: Array<{ x: number; y: number }> = [{ x: prevX, y: prevY }];
      const segments = 5;
      const dx = target.x - prevX;
      const dy = target.y - prevY;
      const dist = Math.hypot(dx, dy);

      for (let s = 1; s < segments; s++) {
        const t = s / segments;
        const normX = -dy / (dist || 1);
        const normY = dx / (dist || 1);
        const jitter = (Math.random() - 0.5) * 32;
        points.push({
          x: prevX + dx * t + normX * jitter,
          y: prevY + dy * t + normY * jitter
        });
      }
      points.push({ x: target.x, y: target.y });

      this.chainLightningBolts.push({
        startX: prevX,
        startY: prevY,
        endX: target.x,
        endY: target.y,
        alpha: 1.0,
        points
      });

      this.spawnHitParticles(target.x, target.y, '#FACC15', 7, 160);
      prevX = target.x;
      prevY = target.y;
    });
  }

  /**
   * EXECUTA A AÇÃO DE MOBILIDADE EXCLUSIVA DO ARQUÉTIPO (BARRA DE ESPAÇO)
   * - Mago: Teleporte instantâneo arcano com rastro de partículas
   * - Arqueiro: Dash longo evasivo com invulnerabilidade
   * - Guerreiro: Investida curta com impacto nos inimigos
   */
  public executeMobility() {
    if (this.mobilityCharges <= 0) {
      this.addFloatingText(this.heroX, this.heroY - 40, 'SEM CARGAS', '#94A3B8');
      return;
    }

    // Determina o vetor de direção pelo direcional pressionado ou pela orientação do herói
    let dirX = 0;
    let dirY = 0;
    if (this.keysPressed['ArrowUp']) dirY -= 1;
    if (this.keysPressed['ArrowDown']) dirY += 1;
    if (this.keysPressed['ArrowLeft']) dirX -= 1;
    if (this.keysPressed['ArrowRight']) dirX += 1;

    // Se nenhuma tecla direcional estiver pressionada, usa a orientação visual do herói
    if (dirX === 0 && dirY === 0) {
      dirX = this.heroFacing === 'right' ? 1 : -1;
    } else {
      const len = Math.hypot(dirX, dirY);
      dirX /= len;
      dirY /= len;
    }

    // Consome 1 carga
    this.mobilityCharges = Math.max(0, this.mobilityCharges - 1);
    // Se o timer de recarga não estiver rodando, inicia a recarga
    if (this.mobilityCooldownTimer <= 0) {
      const baseCd = this.rpgClass === 'warrior' ? 3.5 : this.rpgClass === 'archer' ? 4.5 : 5.0;
      const effectiveCd = Math.max(1.2, baseCd * (1 - this.upgrades.mobilityCooldownReduction));
      this.mobilityCooldownTimer = effectiveCd;
    }

    const distBonus = this.upgrades.mobilityDistanceBonus;

    // Gatilho de passivas de Botas/Relíquias ao usar Mobilidade
    this.triggerPassives('on_mobility');

    if (this.rpgClass === 'mage') {
      // ─── MAGO: TELEPORTE INSTANTÂNEO ARCANO ───
      const distance = 220 + distBonus;
      const startX = this.heroX;
      const startY = this.heroY;

      // Partículas e shockwave no ponto de partida
      this.spawnHitParticles(startX, startY, '#C084FC', 16, 220);
      this.addShockwave(startX, startY, 90, '#A855F7', 4);

      // Nova posição pretendida
      let targetX = startX + dirX * distance;
      let targetY = startY + dirY * distance;
      targetX = Math.max(60, Math.min(this.worldWidth - 60, targetX));
      targetY = Math.max(70, Math.min(this.worldHeight - 70, targetY));

      // Resolve colisão contra obstáculos
      for (const obs of this.obstacles) {
        const d = Math.hypot(targetX - obs.x, targetY - obs.y);
        const minDist = this.heroRadius + obs.radius;
        if (d < minDist) {
          const pushAngle = Math.atan2(targetY - obs.y, targetX - obs.x);
          targetX = obs.x + Math.cos(pushAngle) * (minDist + 5);
          targetY = obs.y + Math.sin(pushAngle) * (minDist + 5);
        }
      }

      this.heroX = targetX;
      this.heroY = targetY;
      this.invulnerabilityTimer = 0.35; // Frames de invulnerabilidade
      this.mobilityTrailTimer = 0.45;

      // Partículas no ponto de chegada
      this.spawnHitParticles(this.heroX, this.heroY, '#E879F9', 14, 200);
      this.addShockwave(this.heroX, this.heroY, 80, '#E879F9', 3);
      this.addFloatingText(this.heroX, this.heroY - 45, 'TELEPORTE!', '#C084FC', true);
      byteQuestAudio.playMobility('teleport');

      // Upgrade Exclusivo do Mago: Supernova Arcana no Teleporte
      if (this.upgrades.mageNovaLevel > 0) {
        const novaRadius = 125 + this.upgrades.mageNovaLevel * 20;
        const novaDmg = 45 * this.upgrades.mageNovaLevel + this.upgrades.damageBonus;
        this.addShockwave(startX, startY, novaRadius, '#C084FC', 5);
        this.addShockwave(this.heroX, this.heroY, novaRadius, '#E879F9', 5);
        for (const e of this.enemies) {
          const dStart = Math.hypot(e.x - startX, e.y - startY);
          const dEnd = Math.hypot(e.x - this.heroX, e.y - this.heroY);
          if (dStart <= novaRadius || dEnd <= novaRadius) {
            this.damageEnemy(e, novaDmg, true);
          }
        }
      }

    } else if (this.rpgClass === 'archer') {
      // ─── ARQUEIRO: DASH DESLIZANTE EVASIVO (GLIDE CONTÍNUO EM ALTA VELOCIDADE) ───
      const totalDistance = 300 + distBonus;
      const duration = 0.28; // Desliza durante 280ms visivelmente pelo chão
      const speed = totalDistance / duration;

      this.mobilitySlideVx = dirX * speed;
      this.mobilitySlideVy = dirY * speed;
      this.mobilitySlideDuration = duration;
      this.mobilitySlideTimer = duration;
      this.isDashing = true;
      this.invulnerabilityTimer = duration + 0.1;
      this.mobilityTrailTimer = duration + 0.25;

      // Rastro inicial de vento e som
      this.spawnHitParticles(this.heroX, this.heroY, '#34D399', 14, 180);
      this.addShockwave(this.heroX, this.heroY, 65, '#10B981', 3);
      this.addFloatingText(this.heroX, this.heroY - 45, 'DASH EVASIVO!', '#34D399', true);
      byteQuestAudio.playMobility('dash');

    } else {
      // ─── GUERREIRO: INVESTIDA DE IMPACTO (RUSH DESLIZANTE COM ATROPELAMENTO) ───
      const totalDistance = 180 + distBonus;
      const duration = 0.22; // Arrancada pesada de 220ms
      const speed = totalDistance / duration;

      this.mobilitySlideVx = dirX * speed;
      this.mobilitySlideVy = dirY * speed;
      this.mobilitySlideDuration = duration;
      this.mobilitySlideTimer = duration;
      this.isDashing = true;
      this.invulnerabilityTimer = duration + 0.08;
      this.mobilityTrailTimer = duration + 0.2;

      this.addScreenShake(4.5, 0.22);
      this.spawnHitParticles(this.heroX, this.heroY, '#FBBF24', 16, 200);
      this.addShockwave(this.heroX, this.heroY, 85, '#F59E0B', 4);
      this.addFloatingText(this.heroX, this.heroY - 45, 'INVESTIDA!', '#F59E0B', true);
      byteQuestAudio.playMobility('rush');
    }
  }

  /**
   * CONJURAÇÃO DE FEITIÇOS ESPECÍFICOS POR CLASSE COM CUSTO DE ENERGIA E COOLDOWN
   */
  public castSpell(spellId: string) {
    const spell = this.availableSpells.find((s) => s.id === spellId);
    if (!spell) return;

    const costMult = this.subclass === 'mage_archmage' ? 0.8 : 1.0;
    const cdMult = this.subclass === 'archer_engineer' ? 0.8 : 1.0;
    const effectiveCost = Math.round(spell.energyCost * costMult);

    if (this.stats.energy < effectiveCost) {
      this.addFloatingText(this.heroX, this.heroY - 40, `SEM ENERGIA (${Math.round(this.stats.energy)}/${effectiveCost})`, '#38BDF8');
      return;
    }

    if ((this.spellCooldowns[spellId] || 0) > 0) {
      this.addFloatingText(this.heroX, this.heroY - 40, 'EM RECARGA', '#94A3B8');
      return;
    }

    // Consome energia e aplica cooldown
    this.stats.energy -= effectiveCost;
    this.spellCooldowns[spellId] = spell.cooldownSeconds * cdMult;
    byteQuestAudio.playSpellCast(spellId);

    // Efeitos globais de conjuração de magia
    this.addScreenShake(spellId === 'mage_meteor' ? 8.5 : spellId === 'warrior_cyclone' ? 5.5 : 4.0, 0.26);
    this.addShockwave(this.heroX, this.heroY, spellId === 'mage_meteor' ? 220 : 130, spell.color || '#A855F7', 4);
    this.spawnHitParticles(this.heroX, this.heroY, spell.color || '#A855F7', 14, 220);

    // ─── PODERES DO GUERREIRO ───
    if (spellId === 'warrior_rage') {
      this.upgrades.rageBuffTimer = 7.0;
      this.addFloatingText(this.heroX, this.heroY - 45, 'FÚRIA ATIVA! +100% MELEE', '#EF4444', true);
      this.spawnHitParticles(this.heroX, this.heroY, '#EF4444', 20, 240);
      this.addShockwave(this.heroX, this.heroY, 120, '#EF4444', 4);
    } else if (spellId === 'warrior_cyclone') {
      // CICLONE DE ESPADAS: Inicia efeito giratório contínuo com vórtice e vento (+Bônus Vórtice de Aço)
      const spinDur = 2.2 + this.upgrades.warriorSpinLevel * 0.65;
      const spinRad = 145 + this.upgrades.warriorSpinLevel * 28;
      this.cycloneEffects.push({
        id: `cyc_${Date.now()}`,
        duration: spinDur,
        life: spinDur,
        angle: 0,
        radius: spinRad,
        damagePerTick: 38 + this.upgrades.damageBonus * 0.8 + this.upgrades.warriorSpinLevel * 12,
        tickTimer: 0.05
      });
      this.addScreenShake(6.5, 0.4);
      this.addShockwave(this.heroX, this.heroY, spinRad + 10, '#F97316', 5);
      this.addFloatingText(this.heroX, this.heroY - 45, 'GOLPE CICLONE!', '#F97316', true);
    } else if (spellId === 'warrior_charge') {
      // Investida de Escudo: Deslize frontal com impacto nos monstros
      const chargeDirX = this.heroFacing === 'right' ? 1 : -1;
      this.mobilitySlideVx = chargeDirX * 850;
      this.mobilitySlideVy = 0;
      this.mobilitySlideDuration = 0.28;
      this.mobilitySlideTimer = 0.28;
      this.isDashing = true;
      this.invulnerabilityTimer = 0.4;
      this.addScreenShake(5.5, 0.3);
      this.addShockwave(this.heroX, this.heroY, 100, '#EAB308', 4);
      this.addFloatingText(this.heroX, this.heroY - 45, 'INVESTIDA ESMAGADORA!', '#EAB308', true);
    } else if (spellId === 'warrior_shield') {
      this.stats.shieldDuration = 6.5;
      this.stats.shieldHp = 130 + this.upgrades.maxHpBonus * 0.6;
      this.addShockwave(this.heroX, this.heroY, 125, '#38BDF8', 4);
      this.spawnHitParticles(this.heroX, this.heroY, '#38BDF8', 16, 180);
      this.addFloatingText(this.heroX, this.heroY - 45, 'FORTITUDE DE AÇO!', '#38BDF8', true);
    }

    // ─── PODERES DO ARQUEIRO ───
    else if (spellId === 'archer_arrow_rain') {
      // CHUVA DE FLECHAS: Dezenas de flechas caem do céu cobrindo uma ampla área ao redor
      this.arrowRainEffects.push({
        id: `arrow_rain_${Date.now()}`,
        centerX: this.heroX,
        centerY: this.heroY,
        radius: 360,
        duration: 3.2,
        life: 3.2,
        arrows: []
      });
      this.addScreenShake(4.5, 0.3);
      this.addShockwave(this.heroX, this.heroY, 180, '#10B981', 3);
      this.addFloatingText(this.heroX, this.heroY - 50, 'CHUVA DE FLECHAS!', '#10B981', true);
    } else if (spellId === 'archer_pierce_volley') {
      // Salva de 5 flechas em leque orientado na direção de mira em 360°
      const baseAng = this.heroAttackAngle;
      for (let angOffset = -0.32; angOffset <= 0.32; angOffset += 0.16) {
        const finalAng = baseAng + angOffset;
        this.projectiles.push({
          id: `arrow_v_${Date.now()}_${angOffset}`,
          x: this.heroX + Math.cos(finalAng) * 20,
          y: this.heroY + Math.sin(finalAng) * 20,
          vx: Math.cos(finalAng) * 720,
          vy: Math.sin(finalAng) * 720,
          damage: 50 + this.upgrades.damageBonus,
          color: '#34D399',
          radius: 5.5,
          pierceCount: 5,
          isCrit: true,
          projectileType: 'pierce_volley'
        });
      }
      this.addFloatingText(this.heroX, this.heroY - 45, 'RAJADA PERFURANTE!', '#34D399', true);
    } else if (spellId === 'archer_trap') {
      // Planta 4 armadilhas rúnicas de espinho no perímetro ao redor do arqueiro
      for (let a = 0; a < 4; a++) {
        const trapAng = (a * Math.PI) / 2 + Math.random() * 0.4;
        const trapDist = 95 + Math.random() * 45;
        this.groundTraps.push({
          id: `trap_${Date.now()}_${a}`,
          x: this.heroX + Math.cos(trapAng) * trapDist,
          y: this.heroY + Math.sin(trapAng) * trapDist,
          radius: 34,
          life: 14.0, // Fica ativa por 14 segundos
          duration: 14.0,
          active: true,
          color: '#F59E0B'
        });
      }
      this.addFloatingText(this.heroX, this.heroY - 45, 'ARMADILHAS DE ESPINHOS!', '#F59E0B', true);
    } else if (spellId === 'archer_evasion') {
      this.invulnerabilityTimer = 2.5;
      this.upgrades.speedBuffTimer = 4.0;
      this.spawnHitParticles(this.heroX, this.heroY, '#6EE7B7', 16, 200);
      this.addShockwave(this.heroX, this.heroY, 90, '#6EE7B7', 3);
      this.addFloatingText(this.heroX, this.heroY - 45, 'PASSO FANTASMA!', '#6EE7B7', true);
    }

    // ─── PODERES DO MAGO ───
    else if (spellId === 'mage_fireball' || spellId === 'mage_meteor') {
      // BOLA DE FOGO DEVASTADORA: Colossal esfera flamejante em linha reta
      const fireAng = this.heroAttackAngle;
      const fireSpeed = 520;
      this.projectiles.push({
        id: `fireball_${Date.now()}`,
        x: this.heroX + Math.cos(fireAng) * 25,
        y: this.heroY + Math.sin(fireAng) * 25,
        vx: Math.cos(fireAng) * fireSpeed,
        vy: Math.sin(fireAng) * fireSpeed,
        damage: 135 + this.upgrades.damageBonus * 2.2,
        color: '#F97316',
        radius: 18,
        pierceCount: 8, // Rasga através dos monstros
        isCrit: true,
        projectileType: 'fireball'
      });
      this.addScreenShake(6.0, 0.28);
      this.addShockwave(this.heroX, this.heroY, 95, '#F97316', 4);
      this.spawnHitParticles(this.heroX, this.heroY, '#FEF08A', 20, 220);
      this.addFloatingText(this.heroX, this.heroY - 50, 'BOLA DE FOGO!', '#F97316', true);
    } else if (spellId === 'mage_blizzard') {
      this.stats.freezeDuration = 4.5;
      this.enemies.forEach((e) => this.damageEnemy(e, 45, false));
      this.addScreenShake(4.5, 0.3);
      this.addShockwave(this.heroX, this.heroY, 280, '#A78BFA', 5);
      this.spawnHitParticles(this.heroX, this.heroY, '#C084FC', 24, 250);
      this.addFloatingText(this.heroX, this.heroY - 45, 'NEVASCA GÉLIDA!', '#A78BFA', true);
    } else if (spellId === 'mage_thunder') {
      this.triggerChainLightning(this.heroX, this.heroY, 8);
      this.addScreenShake(6.5, 0.3);
      this.addShockwave(this.heroX, this.heroY, 150, '#FACC15', 5);
      this.addFloatingText(this.heroX, this.heroY - 45, 'TROVOADA EM CADEIA!', '#FACC15', true);
    } else if (spellId === 'mage_barrier') {
      this.stats.shieldDuration = 6;
      this.stats.shieldHp = 95;
      this.addShockwave(this.heroX, this.heroY, 110, '#38BDF8', 4);
      this.spawnHitParticles(this.heroX, this.heroY, '#38BDF8', 15, 170);
      this.addFloatingText(this.heroX, this.heroY - 45, 'BARREIRA ELEMENTAL!', '#38BDF8', true);
    }
  }

  public handleHeroHit(rawDamage: number) {
    if (this.invulnerabilityTimer > 0) return;

    let dmg = rawDamage;
    // Guerreiro tem 20% de redução passiva de dano
    if (this.rpgClass === 'warrior') {
      dmg = Math.max(1, Math.round(dmg * 0.8));
    }

    if (this.stats.shieldHp > 0) {
      const absorbed = Math.min(this.stats.shieldHp, dmg);
      this.stats.shieldHp -= absorbed;
      dmg -= absorbed;
      this.addFloatingText(this.heroX, this.heroY - 25, `BLOCKED ${absorbed}`, '#38BDF8');
    }

    if (dmg > 0) {
      this.stats.hp = Math.max(0, this.stats.hp - dmg);
      this.stats.totalDamageTaken += dmg;
      this.invulnerabilityTimer = 0.55;
      this.heroHurtTimer = 0.22;
      byteQuestAudio.playHeroHurt();
      this.addFloatingText(this.heroX, this.heroY - 20, `-${dmg}`, '#EF4444', true);

      // Gatilho de passiva ao sofrer dano
      this.triggerPassives('on_hit_taken');

      if (this.stats.hp <= this.stats.maxHp * 0.3) {
        this.triggerPassives('on_low_hp');
      }

      if (this.stats.hp <= 0) {
        // Talento Permanente: Protocolo Fênix (Revive com 60% HP uma vez por partida!)
        if ((this.talents.phoenix_protocol || 0) > 0 && !this.phoenixUsed) {
          this.phoenixUsed = true;
          this.stats.hp = Math.round(this.stats.maxHp * 0.6);
          this.invulnerabilityTimer = 2.5;
          this.addScreenShake(8.0, 0.35);
          this.addShockwave(this.heroX, this.heroY, 220, '#F97316', 6);
          this.spawnHitParticles(this.heroX, this.heroY, '#FACC15', 28, 260);
          this.addFloatingText(this.heroX, this.heroY - 55, '🔥 PROTOCOLO FÊNIX: RENASCIMENTO SUPREMO!', '#FACC15', true);
          return;
        }
        this.onGameOver?.();
      }
    }
  }

  public addXp(amount: number) {
    this.stats.currentXp += amount;
    if (this.stats.currentXp >= this.stats.nextLevelXp) {
      this.stats.currentXp -= this.stats.nextLevelXp;
      this.stats.level++;
      this.stats.nextLevelXp = Math.round(14 + this.stats.level * 10);
      byteQuestAudio.playLevelUp();
      this.onLevelUp?.();
    }
  }

  public applyUpgrade(effect: UpgradeEffectType, value: number) {
    const nextLvl = (this.upgradeLevels[effect] || 0) + 1;
    this.upgradeLevels[effect] = nextLvl;

    switch (effect) {
      case 'damage':
        this.upgrades.damageBonus += value;
        break;
      case 'speed':
        this.upgrades.speedBonus += value;
        break;
      case 'crit':
        this.upgrades.critRateBonus += value;
        break;
      case 'max_hp':
        this.stats.maxHp += value;
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + value);
        break;
      case 'shield':
        this.stats.shieldHp += value;
        this.stats.shieldDuration = 10;
        break;
      case 'orbitals':
        this.upgrades.orbitalCount += 1;
        break;
      case 'lightning':
        this.upgrades.chainLightningLevel += 1;
        break;
      case 'magnet':
        this.upgrades.magnetRadius += value;
        break;
      case 'typing_power':
        this.upgrades.typingCritMultiplier += 0.8;
        break;
      case 'mobility_distance':
        this.upgrades.mobilityDistanceBonus += value;
        break;
      case 'mobility_charges':
        this.upgrades.mobilityMaxChargesBonus += value;
        this.maxMobilityCharges = 1 + this.upgrades.mobilityMaxChargesBonus;
        this.mobilityCharges = Math.min(this.maxMobilityCharges, this.mobilityCharges + value);
        break;
      case 'mobility_cooldown':
        this.upgrades.mobilityCooldownReduction = Math.min(0.65, this.upgrades.mobilityCooldownReduction + value);
        break;
      case 'class_warrior_quake':
        this.upgrades.warriorQuakeLevel += 1;
        break;
      case 'class_warrior_spin':
        this.upgrades.warriorSpinLevel += 1;
        break;
      case 'class_archer_multishot':
        this.upgrades.archerMultishotLevel += 1;
        break;
      case 'class_archer_explosive':
        this.upgrades.archerExplosiveLevel += 1;
        break;
      case 'class_mage_nova':
        this.upgrades.mageNovaLevel += 1;
        break;
      case 'class_mage_conductor':
        this.upgrades.mageConductorLevel += 1;
        break;
      case 'weapon_boomerang':
        this.upgrades.weaponBoomerangLevel = nextLvl;
        if (nextLvl === 5) {
          this.stats.weaponsEvolvedCount = (this.stats.weaponsEvolvedCount || 0) + 1;
          this.addShockwave(this.heroX, this.heroY, 200, '#F472B6', 5);
          this.addFloatingText(this.heroX, this.heroY - 55, '★ EVOLUÇÃO SUPREMA: ESTRELA DA MORTE QUÂNTICA!', '#F472B6', true);
        }
        break;
      case 'weapon_turret':
        this.upgrades.weaponTurretLevel = nextLvl;
        if (nextLvl === 5) {
          this.stats.weaponsEvolvedCount = (this.stats.weaponsEvolvedCount || 0) + 1;
          this.addShockwave(this.heroX, this.heroY, 200, '#FACC15', 5);
          this.addFloatingText(this.heroX, this.heroY - 55, '★ EVOLUÇÃO SUPREMA: CANHÃO RAILGUN ORBITAL!', '#FACC15', true);
        }
        break;
      case 'weapon_fire_aura':
        this.upgrades.weaponFireAuraLevel = nextLvl;
        if (nextLvl === 5) {
          this.stats.weaponsEvolvedCount = (this.stats.weaponsEvolvedCount || 0) + 1;
          this.addShockwave(this.heroX, this.heroY, 200, '#F97316', 5);
          this.addFloatingText(this.heroX, this.heroY - 55, '★ EVOLUÇÃO SUPREMA: SUPERNOVA SOLAR!', '#F97316', true);
        }
        break;
      case 'weapon_homing_missiles':
        this.upgrades.weaponHomingMissilesLevel = nextLvl;
        if (nextLvl === 5) {
          this.stats.weaponsEvolvedCount = (this.stats.weaponsEvolvedCount || 0) + 1;
          this.addShockwave(this.heroX, this.heroY, 200, '#F43F5E', 5);
          this.addFloatingText(this.heroX, this.heroY - 55, '★ EVOLUÇÃO SUPREMA: ENXAME VALQUÍRIA!', '#F43F5E', true);
        }
        break;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SISTEMA DE CÂMARAS, ROTAS ESCOLHIDAS E TERMINAIS HÍBRIDOS
  // ─────────────────────────────────────────────────────────────

  public getChamberTitle(type: ChamberType): string {
    switch (type) {
      case 'start':
        return 'PROTOCOLO DE DESPERTAR';
      case 'drones':
        return 'OFICINA DE DRONES ALIADOS';
      case 'merchant':
        return 'MERCANTE DE BYTES';
      case 'treasure':
        return 'CÂMARA DE TESOUROS ANCESTRAIS';
      case 'elite':
        return 'CRIPTA DE ELITE (ALTO RISCO)';
      case 'repair':
        return 'ESTAÇÃO DE REPARO & HIPERCARGA';
      case 'boss':
        return 'ARENA DO CHEFE SUPREMO';
      default:
        return 'CÂMARA DO SETOR';
    }
  }

  public setupChamber(type: ChamberType, num: number) {
    this.chamberType = type;
    this.chamberNumber = Math.max(1, Math.min(4, num));
    this.chamberTimeSurvived = 0;
    this.chamberIsPurged = false;
    this.chamberPortals = [];
    this.chamberTerminal = null;

    // Configura a câmara de acordo com o tipo
    switch (type) {
      case 'start':
        this.chamberTargetDuration = 60.0;
        this.activeEventBanner = {
          text: `⚡ CÂMARA 1/4: ${this.getChamberTitle(type)} (SOBREVIVÊNCIA 60s)`,
          color: '#38BDF8',
          timer: 5.0
        };
        break;

      case 'merchant':
        this.chamberTargetDuration = 22.0;
        this.createMerchantTerminal(this.heroX + 130, this.heroY);
        // Limpa minions agressivos para compras seguras
        this.enemies = [];
        this.activeEventBanner = {
          text: `🪙 CÂMARA ${num}/4: ${this.getChamberTitle(type)} — DIGITE AS OFERTAS PARA COMPRAR!`,
          color: '#F59E0B',
          timer: 5.5
        };
        break;

      case 'drones':
        this.chamberTargetDuration = 50.0;
        this.createDroneStationTerminal(this.heroX + 130, this.heroY);
        this.activeEventBanner = {
          text: `🤖 CÂMARA ${num}/4: ${this.getChamberTitle(type)} — CONTRATE DRONES ALIADOS!`,
          color: '#38BDF8',
          timer: 5.5
        };
        break;

      case 'repair':
        this.chamberTargetDuration = 18.0;
        this.createRepairStationTerminal(this.heroX + 130, this.heroY);
        this.enemies = [];
        this.activeEventBanner = {
          text: `🩺 CÂMARA ${num}/4: ${this.getChamberTitle(type)} — RESTAURE VIDA E HIPERCARGA!`,
          color: '#34D399',
          timer: 5.5
        };
        break;

      case 'treasure':
        this.chamberTargetDuration = 45.0;
        this.spawnAncientChests();
        this.activeEventBanner = {
          text: `💎 CÂMARA ${num}/4: ${this.getChamberTitle(type)} — COLETE OS BAÚS ANCESTRAIS!`,
          color: '#FACC15',
          timer: 5.5
        };
        break;

      case 'elite':
        this.chamberTargetDuration = 60.0;
        this.activeEventBanner = {
          text: `☠️ CÂMARA ${num}/4: ${this.getChamberTitle(type)} — DERROTE A HORDA MUTANTE!`,
          color: '#EF4444',
          timer: 5.5
        };
        break;

      case 'boss':
        this.chamberTargetDuration = 99999.0;
        this.activeEventBanner = {
          text: `🔥 CÂMARA 4/4: ${this.getChamberTitle(type)} — CONFRONTO FINAL DO BIOMA!`,
          color: '#DC2626',
          timer: 6.0
        };
        this.spawnMainBoss(this.viewportWidth, this.viewportHeight);
        break;
    }
  }

  public checkChamberProgress(dt: number) {
    if (this.chamberType === 'boss') {
      return; // A câmara do Boss só é purgada quando o Boss é derrotado
    }

    this.chamberTimeSurvived += dt;

    if (this.chamberTimeSurvived >= this.chamberTargetDuration && !this.chamberIsPurged) {
      this.chamberIsPurged = true;
      this.spawnChamberPortals();
      byteQuestAudio.playOverclock();
      this.addShockwave(this.heroX, this.heroY, 260, '#38BDF8', 5);
      this.activeEventBanner = {
        text: `⚡ CÂMARA PURGADA! ESCOLHA UM PORTAL HOLOGRÁFICO PARA SALTAR!`,
        color: '#38BDF8',
        timer: 6.0
      };
    }
  }

  public spawnChamberPortals() {
    this.chamberPortals = [];

    let candidates: Array<{ type: ChamberType; label: string; sublabel: string; icon: string; color: string; word: string }> = [];

    if (this.chamberNumber === 1) {
      candidates = [
        { type: 'drones', label: 'OFICINA DE DRONES', sublabel: 'Resgate Drones Aliados', icon: '🤖', color: '#38BDF8', word: 'DRONES' },
        { type: 'treasure', label: 'CÂMARA DE TESOURO', sublabel: 'Baús Ancestrais', icon: '💎', color: '#FACC15', word: 'TESOURO' },
        { type: 'repair', label: 'ESTAÇÃO DE REPARO', sublabel: 'Cura & Hipercarga', icon: '🩺', color: '#34D399', word: 'REPARO' }
      ];
    } else if (this.chamberNumber === 2) {
      candidates = [
        { type: 'merchant', label: 'MERCANTE DE BYTES', sublabel: 'Comprar Upgrades', icon: '🪙', color: '#F59E0B', word: 'MERCANTE' },
        { type: 'elite', label: 'CÂMARA DE ELITE', sublabel: 'Baú Lendário', icon: '☠️', color: '#EF4444', word: 'ELITE' },
        { type: 'treasure', label: 'CÂMARA DE TESOURO', sublabel: 'Baús & Relíquias', icon: '💎', color: '#A855F7', word: 'TESOURO' }
      ];
    } else {
      // Câmara 3 -> Leva à Câmara 4 (Chefe Supremo)
      candidates = [
        { type: 'boss', label: 'CHEFE SUPREMO', sublabel: 'Confronto Final do Setor', icon: '🔥', color: '#DC2626', word: 'CHEFE' }
      ];
    }

    const total = candidates.length;
    candidates.forEach((cand, idx) => {
      const angle = total === 1 ? 0 : -0.6 + (idx / (total - 1)) * 1.2;
      const dist = 190;
      const px = Math.max(120, Math.min(this.worldWidth - 120, this.heroX + Math.cos(angle) * dist));
      const py = Math.max(120, Math.min(this.worldHeight - 120, this.heroY + Math.sin(angle) * dist));

      this.chamberPortals.push({
        id: `portal_${cand.type}_${Date.now()}_${idx}`,
        x: px,
        y: py,
        targetChamberType: cand.type,
        label: cand.label,
        sublabel: cand.sublabel,
        icon: cand.icon,
        color: cand.color,
        radius: 48,
        activationWord: cand.word,
        activationProgress: '',
        active: true
      });
    });
  }

  public activateChamberPortal(portal: ChamberPortal) {
    this.hyperspaceTransitionTimer = 0.55;
    this.addShockwave(portal.x, portal.y, 280, portal.color, 6);
    this.addScreenShake(6.0, 0.4);
    byteQuestAudio.playOverclock();

    // Limpa projéteis e alvos residuais da sala anterior
    this.enemyProjectiles = [];
    this.projectiles = [];
    this.hazardZones = [];
    this.bossLaserTelegraphs = [];
    this.lockedEnemyId = null;
    this.lockedShrineId = null;

    const nextNum = Math.min(4, this.chamberNumber + 1);
    this.setupChamber(portal.targetChamberType, nextNum);
  }

  // ─── TERMINAIS HÍBRIDOS (MERCANTE, DRONES E REPARO) ───

  public createMerchantTerminal(x: number, y: number) {
    this.chamberTerminal = {
      id: `term_merchant_${Date.now()}`,
      x,
      y,
      type: 'merchant',
      title: 'TERMINAL MERCANTE CYBER',
      subtitle: 'Digite o comando para adquirir as ofertas com seus Bytes:',
      radius: 95,
      active: true,
      offers: [
        {
          id: 'off_heal',
          title: 'KIT DE REPARO NANO',
          description: 'Cura 100% de HP e Energia',
          byteCost: 80,
          activationWord: 'CURAR',
          activationWordTyped: '',
          rewardType: 'heal',
          color: '#10B981',
          purchased: false
        },
        {
          id: 'off_shield',
          title: 'BLINDAGEM PESADA',
          description: '+80 Escudo de Absorção',
          byteCost: 110,
          activationWord: 'ESCUDO',
          activationWordTyped: '',
          rewardType: 'shield',
          color: '#38BDF8',
          purchased: false
        },
        {
          id: 'off_weapon',
          title: 'SOBRECARGA DE ARMAS',
          description: '+1 Nível em Arma Autônoma Aleatória',
          byteCost: 150,
          activationWord: 'ARMAS',
          activationWordTyped: '',
          rewardType: 'weapon_upgrade',
          color: '#F59E0B',
          purchased: false
        }
      ]
    };
    return this.chamberTerminal;
  }

  public createDroneStationTerminal(x: number, y: number) {
    this.chamberTerminal = {
      id: `term_drones_${Date.now()}`,
      x,
      y,
      type: 'drone_station',
      title: 'OFICINA DE DRONES TÁTICOS',
      subtitle: 'Digite o código do modelo para resgatar e integrar o Aliado:',
      radius: 95,
      active: true,
      offers: [
        {
          id: 'off_drone_combat',
          title: 'SENTINELA RAILGUN',
          description: 'Dispara raios de plasma automáticos nos monstros',
          byteCost: 90,
          activationWord: 'SENTINELA',
          activationWordTyped: '',
          rewardType: 'drone_combat',
          color: '#38BDF8',
          purchased: false
        },
        {
          id: 'off_drone_medic',
          title: 'DRONE MÉDICO',
          description: 'Regenera HP/Energia e ergue escudo em emergências',
          byteCost: 90,
          activationWord: 'MEDICO',
          activationWordTyped: '',
          rewardType: 'drone_medic',
          color: '#34D399',
          purchased: false
        },
        {
          id: 'off_drone_hacker',
          title: 'DRONE HACKER',
          description: 'Corta letras de palavras difíceis e anula mísseis',
          byteCost: 90,
          activationWord: 'HACKER',
          activationWordTyped: '',
          rewardType: 'drone_hacker',
          color: '#C084FC',
          purchased: false
        }
      ]
    };
    return this.chamberTerminal;
  }

  public createRepairStationTerminal(x: number, y: number) {
    this.chamberTerminal = {
      id: `term_repair_${Date.now()}`,
      x,
      y,
      type: 'repair_station',
      title: 'ESTAÇÃO DE HIPERCARGA',
      subtitle: 'Procedimento médico rúnico gratuito para a próxima jornada:',
      radius: 95,
      active: true,
      offers: [
        {
          id: 'off_free_heal',
          title: 'PROTOCOLO DE REPARO TOTAL',
          description: 'Restaura 100% de HP e Energia instantaneamente',
          byteCost: 0,
          activationWord: 'REPARAR',
          activationWordTyped: '',
          rewardType: 'heal',
          color: '#34D399',
          purchased: false
        },
        {
          id: 'off_overclock',
          title: 'INJEÇÃO DE OVERCLOCK',
          description: '15 segundos de Flow State em aceleração total',
          byteCost: 40,
          activationWord: 'OVERCLOCK',
          activationWordTyped: '',
          rewardType: 'overclock',
          color: '#FACC15',
          purchased: false
        },
        {
          id: 'off_max_hp',
          title: 'MÓDULO DE VITALIDADE',
          description: '+25 HP Máximo permanente na corrida',
          byteCost: 75,
          activationWord: 'VITALIDADE',
          activationWordTyped: '',
          rewardType: 'max_hp',
          color: '#F43F5E',
          purchased: false
        }
      ]
    };
    return this.chamberTerminal;
  }

  public executeTerminalPurchase(offer: ChamberTerminalOffer) {
    if (this.stats.bonusBytesEarned < offer.byteCost) {
      this.addFloatingText(this.heroX, this.heroY - 45, '⚠️ BYTES INSUFICIENTES!', '#EF4444', true);
      offer.activationWordTyped = '';
      return;
    }

    this.stats.bonusBytesEarned -= offer.byteCost;
    offer.purchased = true;
    byteQuestAudio.playSupremeEvolution();
    this.addShockwave(this.heroX, this.heroY, 180, offer.color, 4);

    switch (offer.rewardType) {
      case 'heal':
        this.stats.hp = this.stats.maxHp;
        this.stats.energy = this.stats.maxEnergy;
        this.addFloatingText(this.heroX, this.heroY - 45, '💚 HP & ENERGIA RESTAURADOS!', '#10B981', true);
        break;
      case 'shield':
        this.stats.shieldHp = 80;
        this.stats.shieldDuration = 30;
        this.addFloatingText(this.heroX, this.heroY - 45, '🛡️ ESCUDO PESADO ATIVADO (+80 HP)!', '#38BDF8', true);
        break;
      case 'drone_combat':
        this.recruitAllyDrone('combat');
        break;
      case 'drone_medic':
        this.recruitAllyDrone('medic');
        break;
      case 'drone_hacker':
        this.recruitAllyDrone('hacker');
        break;
      case 'overclock':
        this.overclockTimer = 15;
        this.addFloatingText(this.heroX, this.heroY - 45, '⚡ OVERCLOCK TURBO ATIVADO (15s)!', '#FACC15', true);
        break;
      case 'weapon_upgrade':
        this.applyRandomWeaponUpgrade();
        break;
      case 'max_hp':
        this.stats.maxHp += 25;
        this.stats.hp += 25;
        this.addFloatingText(this.heroX, this.heroY - 45, '❤️ VIDA MÁXIMA +25!', '#F43F5E', true);
        break;
      case 'bytes_boost':
        this.stats.bonusBytesEarned += 250;
        this.addFloatingText(this.heroX, this.heroY - 45, '💰 +250 BYTES BÔNUS!', '#FACC15', true);
        break;
    }
  }

  public applyRandomWeaponUpgrade() {
    const weaponKeys: UpgradeEffectType[] = [
      'weapon_boomerang',
      'weapon_turret',
      'weapon_fire_aura',
      'weapon_homing_missiles'
    ];
    const chosen = weaponKeys[Math.floor(Math.random() * weaponKeys.length)];
    this.applyUpgrade(chosen, 1);
  }

  // ─── SISTEMA DE DRONES ALIADOS ESPECIALISTAS ───

  public recruitAllyDrone(model: AllyDroneModel) {
    const existing = this.allyDrones.find((d) => d.model === model);
    if (existing) {
      existing.level += 1;
      this.addFloatingText(this.heroX, this.heroY - 50, `★ ${existing.name.toUpperCase()} NÍVEL ${existing.level}!`, existing.color, true);
      return;
    }

    let name = 'Sentinela Railgun';
    let color = '#38BDF8';
    let orbitDist = 65;
    let orbitSpeed = 1.35;
    let actionTimer = 1.6;

    if (model === 'medic') {
      name = 'Drone Médico';
      color = '#34D399';
      orbitDist = 85;
      orbitSpeed = -1.1;
      actionTimer = 4.0;
    } else if (model === 'hacker') {
      name = 'Drone Hacker';
      color = '#C084FC';
      orbitDist = 105;
      orbitSpeed = 0.95;
      actionTimer = 5.0;
    }

    this.allyDrones.push({
      id: `drone_${model}_${Date.now()}`,
      model,
      name,
      orbitAngle: (this.allyDrones.length * Math.PI * 2) / 3,
      orbitDistance: orbitDist,
      orbitSpeed,
      actionTimer,
      level: 1,
      color
    });

    this.addFloatingText(this.heroX, this.heroY - 50, `🤖 ${name.toUpperCase()} INTEGRADO!`, color, true);
  }

  public updateAllyDrones(dt: number) {
    if (this.allyDrones.length === 0) return;

    for (const drone of this.allyDrones) {
      drone.orbitAngle += drone.orbitSpeed * dt;
      const droneX = this.heroX + Math.cos(drone.orbitAngle) * drone.orbitDistance;
      const droneY = this.heroY + Math.sin(drone.orbitAngle) * (drone.orbitDistance * 0.7);

      drone.actionTimer -= dt;

      if (drone.model === 'combat' && drone.actionTimer <= 0) {
        // Dispara railgun no inimigo mais próximo
        const target = this.enemies
          .filter((e) => Math.hypot(e.x - droneX, e.y - droneY) <= 380)
          .sort((a, b) => Math.hypot(a.x - droneX, a.y - droneY) - Math.hypot(b.x - droneX, b.y - droneY))[0];

        if (target) {
          const dmg = 45 + drone.level * 18;
          target.hp -= dmg;
          target.hitFlashTimer = 0.15;
          this.stats.damageDealt += dmg;
          this.addFloatingText(target.x, target.y - 25, `${dmg}`, '#38BDF8');
          this.spawnHitParticles(target.x, target.y, '#38BDF8', 4, 110);
          if (target.hp <= 0) {
            this.killEnemy(target);
          }
        }
        drone.actionTimer = Math.max(0.7, 1.8 - drone.level * 0.2);
      } else if (drone.model === 'medic' && drone.actionTimer <= 0) {
        // Regenera HP e Energia
        const healAmt = 4 + drone.level * 2;
        const energyAmt = 6 + drone.level * 3;
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + healAmt);
        this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + energyAmt);
        this.addFloatingText(this.heroX, this.heroY - 35, `+${healAmt} HP`, '#34D399');

        // Escudo de emergência se vida baixa
        if (this.stats.hp < this.stats.maxHp * 0.35 && this.stats.shieldHp === 0) {
          this.stats.shieldHp = 45 + drone.level * 15;
          this.stats.shieldDuration = 18;
          this.addFloatingText(this.heroX, this.heroY - 55, '🛡️ ESCUDO DO DRONE!', '#38BDF8', true);
        }
        drone.actionTimer = Math.max(2.2, 4.0 - drone.level * 0.3);
      } else if (drone.model === 'hacker' && drone.actionTimer <= 0) {
        // Corta 1 letra da palavra de inimigos com palavras longas ou boss
        const target = this.enemies.find(
          (e) => e.word.length >= 4 && e.wordTyped.length === 0 && Math.hypot(e.x - droneX, e.y - droneY) <= 380
        );
        if (target) {
          target.word = target.word.slice(1);
          this.addFloatingText(target.x, target.y - 35, '⚡ PALAVRA HACKEADA! (-1)', '#C084FC', true);
          this.spawnHitParticles(target.x, target.y, '#C084FC', 5, 80);
        }

        // Anula 1 míssil teleguiado em voo com pulso EMP
        const homingProj = this.enemyProjectiles.find((p) => p.isHoming);
        if (homingProj) {
          this.addShockwave(homingProj.x, homingProj.y, 45, '#C084FC', 2);
          this.addFloatingText(homingProj.x, homingProj.y - 20, 'EMP DETONOU MÍSSIL!', '#C084FC');
          this.enemyProjectiles = this.enemyProjectiles.filter((p) => p.id !== homingProj.id);
        }

        drone.actionTimer = Math.max(2.8, 5.0 - drone.level * 0.4);
      }
    }
  }

  private addFloatingText(x: number, y: number, text: string, color: string, isCrit: boolean = false) {
    this.damageTexts.push({
      id: `text_${Date.now()}_${Math.random()}`,
      x,
      y,
      text,
      color,
      alpha: 1.0,
      vy: -35,
      isCrit
    });
  }
}

