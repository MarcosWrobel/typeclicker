import { CurricularTrackId } from '../types';
import { getRandomRadarWord, getRandomBossSequence, RADAR_COMMANDS } from '../data/radarWords';

export type RadarEnemyType = 'scout' | 'drone' | 'tank' | 'glitch' | 'boss';

export type RadarWaveType = 'normal' | 'swarm' | 'boss';

export interface RadarEnemy {
  id: string;
  angle: number; // Ângulo em radianos (0 a 2*PI)
  distance: number; // Distância do centro em pixels
  maxDistance: number;
  speed: number; // Pixels por segundo
  type: RadarEnemyType;
  word: string;
  typedLength: number;
  scoreValue: number;
  byteValue: number;
  isParalyzedUntilMs?: number;
  // Propriedades do Chefe Multi-fases
  bossHp?: number;
  bossMaxHp?: number;
  bossStages?: string[];
  bossCurrentStageIndex?: number;
}

export interface RadarParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number; // 0 a 1
  decay: number;
}

export interface RadarLaser {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  life: number;
}

export interface RadarFloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  subText?: string;
  color: string;
  life: number;
  decay: number;
  vy: number;
  size?: number;
}

export interface RadarShockwave {
  id: string;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  life: number;
  decay: number;
}

export interface RadarUpgrade {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic';
}

export interface RadarRunState {
  wave: number;
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  energy: number;
  maxEnergy: number;
  score: number;
  bytesEarned: number;
  enemiesDefeated: number;
  waveEnemiesDefeated: number;
  wordsTyped: number;
  correctChars: number;
  wrongChars: number;
  combo: number;
  maxCombo: number;
  startTimeMs: number;
  peakWpm: number;
  errorHeatmap: Record<string, number>;
  activeTargetId: string | null;
  isCommandMode: boolean;
  commandBuffer: string;
  freezeUntilMs: number;
  shockwaveActiveUntilMs: number;
  screenShakeIntensity: number;
  upgrades: Record<string, number>;
  isGameOver: boolean;
  isWaveClear: boolean;
  waveType: RadarWaveType;
}

export function getWaveType(wave: number): RadarWaveType {
  if (wave > 0 && wave % 5 === 0) return 'boss';
  if (wave === 3 || wave === 7 || (wave > 10 && wave % 5 === 2)) return 'swarm';
  return 'normal';
}

export const RADAR_UPGRADES_POOL: RadarUpgrade[] = [
  {
    id: 'laser_overcharge',
    title: 'Laser de Alta Potência',
    tagline: 'Sobrecarga de fótons',
    description: 'Aumenta a pontuação e bytes obtidos ao abater qualquer ameaça em +35%.',
    icon: 'laser_overcharge',
    rarity: 'common'
  },
  {
    id: 'cryo_dampeners',
    title: 'Amortecedores Criogênicos',
    tagline: 'Fricção de ar',
    description: 'Reduz a velocidade de aproximação de todas as ameaças no radar em 15%.',
    icon: 'cryo_dampeners',
    rarity: 'common'
  },
  {
    id: 'shield_generator',
    title: 'Bateria de Escudo Reforçada',
    tagline: 'Proteção perimetral',
    description: 'Aumenta o escudo máximo em +30 e regenera 10 de escudo no início de cada onda.',
    icon: 'shield_generator',
    rarity: 'common'
  },
  {
    id: 'kinetic_capacitor',
    title: 'Capacitor Cinético',
    tagline: 'Recarga acelerada',
    description: 'Gera +50% a mais de Energia Cibernética a cada palavra digitada.',
    icon: 'kinetic_capacitor',
    rarity: 'common'
  },
  {
    id: 'nuke_frequency',
    title: 'Silo Atômico Otimizado',
    tagline: 'Comando /NUKE',
    description: 'Reduz o custo de energia do comando /NUKE de 100 para 75.',
    icon: 'nuke_frequency',
    rarity: 'rare'
  },
  {
    id: 'reactive_barrier',
    title: 'Barreira Reativa de Emergência',
    tagline: 'Salva-vidas',
    description: 'A base ganha imunidade ao próximo míssil que colidir diretamente (recarrega por onda).',
    icon: 'reactive_barrier',
    rarity: 'rare'
  },
  {
    id: 'quantum_scanner',
    title: 'Scanner Quântico de Precisão',
    tagline: 'Bônus de Acurácia',
    description: 'Ao manter sequência de 3 palavras sem errar, a pontuação recebe multiplicador 2x.',
    icon: 'quantum_scanner',
    rarity: 'rare'
  },
  {
    id: 'nano_repair',
    title: 'Nanorobôs de Reparo',
    tagline: 'Regeneração celular',
    description: 'Cura +25 de Integridade (HP) da base central imediatamente e no início de cada onda.',
    icon: 'nano_repair',
    rarity: 'rare'
  },
  {
    id: 'terminal_overclock',
    title: 'Overclock de Terminal Militar',
    tagline: 'Poder máximo',
    description: 'O comando /FREEZE dura 8 segundos (em vez de 5s) e congela completamente os alvos.',
    icon: 'terminal_overclock',
    rarity: 'epic'
  },
  {
    id: 'byte_multiplier',
    title: 'Mineração Criptográfica em Massa',
    tagline: 'Recompensa escolar',
    description: 'Dobra (+100%) todos os Bytes creditados na sua conta do colégio nesta partida!',
    icon: 'byte_multiplier',
    rarity: 'epic'
  }
];

export function createInitialRadarState(): RadarRunState {
  return {
    wave: 1,
    health: 100,
    maxHealth: 100,
    shield: 50,
    maxShield: 50,
    energy: 40,
    maxEnergy: 100,
    score: 0,
    bytesEarned: 0,
    enemiesDefeated: 0,
    waveEnemiesDefeated: 0,
    wordsTyped: 0,
    correctChars: 0,
    wrongChars: 0,
    combo: 0,
    maxCombo: 0,
    startTimeMs: Date.now(),
    peakWpm: 0,
    errorHeatmap: {},
    activeTargetId: null,
    isCommandMode: false,
    commandBuffer: '',
    freezeUntilMs: 0,
    shockwaveActiveUntilMs: 0,
    screenShakeIntensity: 0,
    upgrades: {},
    isGameOver: false,
    isWaveClear: false,
    waveType: 'normal'
  };
}

/**
 * Calcula WPM oficial em tempo real: (teclasCorretas / 5) / tempoEmMinutos
 */
export function calculateCurrentWpm(correctChars: number, startTimeMs: number): number {
  const elapsedMinutes = (Date.now() - startTimeMs) / 60000;
  if (elapsedMinutes <= 0.04) return 0;
  return Math.round((correctChars / 5) / elapsedMinutes);
}

/**
 * Identifica a letra com maior taxa de erro no heatmap pedagógico ("Letra Vilã")
 */
export function getWorstKey(heatmap: Record<string, number>): { key: string; count: number } | null {
  let worstKey: string | null = null;
  let maxCount = 0;
  for (const [key, count] of Object.entries(heatmap)) {
    if (count > maxCount) {
      maxCount = count;
      worstKey = key;
    }
  }
  return worstKey ? { key: worstKey, count: maxCount } : null;
}

/**
 * Calcula a recompensa final de Bytes ponderada pela taxa de acurácia do estudante
 */
export function calculateFinalBytes(
  score: number,
  accuracy: number,
  wave: number,
  hasMultiplier: boolean = false
): number {
  const accuracyFactor = Math.max(0.3, accuracy / 100);
  const baseBytes = Math.round(score * 0.12 * accuracyFactor) + (wave * 60);
  return hasMultiplier ? baseBytes * 2 : baseBytes;
}

/**
 * Cria um novo inimigo no perímetro exterior do radar com DDA (Dynamic Difficulty Adjustment)
 */
export function spawnRadarEnemy(
  wave: number,
  activeTrack: CurricularTrackId | null,
  activeEnemies: RadarEnemy[],
  currentAccuracy: number = 100,
  isSwarm: boolean = false
): RadarEnemy {
  const usedWords = new Set(activeEnemies.map(e => e.word.toUpperCase()));
  const rand = Math.random();

  // DDA: no modo enxame prioriza scouts rápidos; se acurácia < 60%, reduz velocidade; se > 95%, aumenta desafio
  let tier: RadarEnemyType = 'scout';
  let speedMultiplier = 1.0;

  if (isSwarm) {
    tier = rand < 0.8 ? 'scout' : 'drone';
    speedMultiplier = 1.25;
  } else if (currentAccuracy < 60) {
    speedMultiplier = 0.82;
    if (rand < 0.65) tier = 'scout';
    else if (rand < 0.9) tier = 'drone';
    else tier = 'tank';
  } else if (currentAccuracy > 95 && wave >= 2) {
    speedMultiplier = 1.15;
    if (rand < 0.3) tier = 'tank';
    else if (rand < 0.6) tier = 'glitch';
    else tier = 'drone';
  } else {
    // Padrão equilibrado
    if (wave >= 4 && rand < 0.25) {
      tier = 'glitch';
    } else if (wave >= 3 && rand < 0.45) {
      tier = 'tank';
    } else if (wave >= 2 && rand < 0.75) {
      tier = 'drone';
    } else {
      tier = 'scout';
    }
  }

  const word = getRandomRadarWord({ tier, activeTrack, usedWords });
  const angle = Math.random() * Math.PI * 2;
  const maxDistance = 330 + Math.random() * 40;

  // Escala de velocidade (pixels por segundo) conforme a onda e o tipo
  let baseSpeed = 18;
  let scoreVal = 50;
  let byteVal = 10;

  switch (tier) {
    case 'scout':
      baseSpeed = 24 + Math.min(wave * 2.2, 28);
      scoreVal = 40;
      byteVal = 8;
      break;
    case 'drone':
      baseSpeed = 16 + Math.min(wave * 1.8, 20);
      scoreVal = 80;
      byteVal = 18;
      break;
    case 'tank':
      baseSpeed = 10 + Math.min(wave * 1.2, 14);
      scoreVal = 160;
      byteVal = 40;
      break;
    case 'glitch':
      baseSpeed = 18 + Math.min(wave * 2, 22);
      scoreVal = 200;
      byteVal = 50;
      break;
  }

  baseSpeed = Math.round(baseSpeed * speedMultiplier);

  return {
    id: `enemy_${Date.now()}_${Math.random()}`,
    angle,
    distance: maxDistance,
    maxDistance,
    speed: baseSpeed,
    type: tier,
    word,
    typedLength: 0,
    scoreValue: scoreVal,
    byteValue: byteVal
  };
}

/**
 * Cria o Dreadnought Chefão Multi-fases no perímetro exterior do radar
 */
export function spawnBossEnemy(
  wave: number,
  _activeTrack: CurricularTrackId | null
): RadarEnemy {
  const stages = getRandomBossSequence(wave);
  const angle = Math.random() * Math.PI * 2;
  const maxDistance = 360;

  return {
    id: `boss_${Date.now()}`,
    angle,
    distance: maxDistance,
    maxDistance,
    speed: 6 + Math.min(wave * 0.4, 5), // Lento e ameaçador
    type: 'boss',
    word: stages[0],
    typedLength: 0,
    scoreValue: 600 + wave * 60,
    byteValue: 150 + wave * 25,
    bossHp: stages.length,
    bossMaxHp: stages.length,
    bossStages: stages,
    bossCurrentStageIndex: 0
  };
}

/**
 * Retorna 3 cartas de upgrades aleatórias
 */
export function getRandomUpgradeCards(currentUpgrades: Record<string, number>): RadarUpgrade[] {
  const shuffled = [...RADAR_UPGRADES_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}
