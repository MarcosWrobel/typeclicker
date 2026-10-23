// ─────────────────────────────────────────────────────────────
// Tipos & Estruturas de Dados: ByteQuest 1v1 Battle Royale (PvP)
// ─────────────────────────────────────────────────────────────

import { RpgClassType } from './rpgClass';

export type ByteQuestPvPRoomStatus =
  | 'waiting'
  | 'countdown'
  | 'in_progress'
  | 'finished'
  | 'abandoned';

export type ByteQuestPvPPhase = 'farm' | 'pvp';

export interface ByteQuestPvPPlayer {
  uid: string;
  name: string;
  nickname?: string;
  turma?: string;
  avatar: string;
  ready: boolean;
  level: number;
  hp: number;
  maxHp: number;
  shieldHp: number;
  isDead: boolean;
}

export interface ByteQuestPvPRoom {
  id: string;
  roomCode: string; // Ex: 'CYB42'
  createdBy: string;
  createdAt: number;
  status: ByteQuestPvPRoomStatus;
  sharedClass: RpgClassType; // Classe espelho idêntica para ambos
  seed: number; // Semente para geração procedimental idêntica
  countdownStartedAt?: number;
  gameStartedAt?: number;
  finishedAt?: number;
  winnerUid?: string | 'draw';
  player1: ByteQuestPvPPlayer;
  player2?: ByteQuestPvPPlayer;
}

/**
 * Estado transmitido a 20Hz por cada jogador via Realtime Broadcast
 */
export interface PvPPlayerSyncPayload {
  uid: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: 'left' | 'right';
  hp: number;
  maxHp: number;
  shieldHp: number;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  isAttacking: boolean;
  attackAngle: number;
  isDashing: boolean;
  wordToHack: string; // Palavra que o oponente pode digitar para causar crítico
}

/**
 * Disparo de projéteis ou magias sincronizados
 */
export interface PvPSyncAttackPayload {
  shooterUid: string;
  attackType: 'slash' | 'arrow' | 'fireball' | 'spell' | 'orbital';
  x: number;
  y: number;
  angle: number;
  speed: number;
  damage: number;
  isCrit: boolean;
}

/**
 * Notificação de dano recebido em PvP
 */
export interface PvPHitPayload {
  attackerUid: string;
  targetUid: string;
  damage: number;
  isCrit: boolean;
  isWordBreak?: boolean;
}
