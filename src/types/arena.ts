export type ArenaRoomStatus = 'waiting' | 'countdown' | 'in_progress' | 'finished' | 'abandoned';

export interface ArenaPlayer {
  uid: string;
  name: string;
  nickname: string;
  turma: string;
  avatar: string;
  ready: boolean;
  progress: number; // 0 a 100%
  wpm: number;
  accuracy: number;
  wordsCompleted: number;
  finishedAt?: number;
  isBot?: boolean;
}

export interface ArenaRoom {
  id: string;
  roomCode: string; // Ex: 'LEO88'
  createdBy: string;
  createdAt: number;
  status: ArenaRoomStatus;
  words: string[];
  countdownStartedAt?: number;
  gameStartedAt?: number;
  player1: ArenaPlayer;
  player2?: ArenaPlayer;
  winnerUid?: string | 'draw';
}

export interface ArenaStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
  highestWpm: number;
  duelPoints: number; // Pontos de Glória / ELO acumulados
  currentRankId: string; // ID da Patente atual
}

export interface ArenaRankDef {
  id: string;
  name: string;
  minPoints: number;
  badge: string;
  color: string;
  borderColor: string;
  bgColor: string;
  tier: string;
  description: string;
}

export const ARENA_RANKS: ArenaRankDef[] = [
  {
    id: 'recruta',
    name: 'Recruta do Coliseu',
    minPoints: 0,
    badge: '🥋',
    color: 'text-zinc-300',
    borderColor: 'border-zinc-600',
    bgColor: 'bg-zinc-800/60',
    tier: 'Bronze',
    description: 'Primeiros passos nos combates da Arena 1x1.'
  },
  {
    id: 'duelista',
    name: 'Duelista Ágil',
    minPoints: 50,
    badge: '⚔️',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/50',
    bgColor: 'bg-emerald-950/50',
    tier: 'Prata',
    description: 'Agilidade comprovada sob pressão contra colegas de classe.'
  },
  {
    id: 'veterano',
    name: 'Veterano Cibernético',
    minPoints: 150,
    badge: '🛡️',
    color: 'text-sky-400',
    borderColor: 'border-sky-500/50',
    bgColor: 'bg-sky-950/50',
    tier: 'Ouro',
    description: 'Domínio de ritmo, postura e consistência de digitação.'
  },
  {
    id: 'gladiador',
    name: 'Gladiador de Elite',
    minPoints: 300,
    badge: '⚡',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/50',
    bgColor: 'bg-purple-950/50',
    tier: 'Platina',
    description: 'Reflexos sobre-humanos e velocidade acima da média escolar.'
  },
  {
    id: 'mestre',
    name: 'Mestre dos Duelos',
    minPoints: 500,
    badge: '🦾',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/50',
    bgColor: 'bg-amber-950/50',
    tier: 'Diamante',
    description: 'Precisão cirúrgica e maestria lendária no teclado ABNT2.'
  },
  {
    id: 'grao_mestre',
    name: 'Grão-Mestre Supremo',
    minPoints: 800,
    badge: '👑',
    color: 'text-rose-400',
    borderColor: 'border-rose-500/50',
    bgColor: 'bg-rose-950/50',
    tier: 'Mestre',
    description: 'Comandante invicto dos duelos do laboratório de informática.'
  },
  {
    id: 'lenda_viva',
    name: 'Lenda Imortal Leopoldina',
    minPoints: 1200,
    badge: '🌌',
    color: 'text-cyan-300',
    borderColor: 'border-cyan-400/60',
    bgColor: 'bg-cyan-950/60',
    tier: 'Lendário',
    description: 'O ápice absoluto e inalcançável da digitação competitiva.'
  }
];

export function getArenaRank(points: number = 0): ArenaRankDef {
  const safePoints = Math.max(0, points);
  for (let i = ARENA_RANKS.length - 1; i >= 0; i--) {
    if (safePoints >= ARENA_RANKS[i].minPoints) {
      return ARENA_RANKS[i];
    }
  }
  return ARENA_RANKS[0];
}

export function getNextArenaRank(points: number = 0): { nextRank: ArenaRankDef | null; progressPercent: number; pointsRemaining: number } {
  const safePoints = Math.max(0, points);
  const currentRank = getArenaRank(safePoints);
  const currentIndex = ARENA_RANKS.findIndex(r => r.id === currentRank.id);

  if (currentIndex >= ARENA_RANKS.length - 1) {
    return { nextRank: null, progressPercent: 100, pointsRemaining: 0 };
  }

  const nextRank = ARENA_RANKS[currentIndex + 1];
  const range = nextRank.minPoints - currentRank.minPoints;
  const currentInRange = safePoints - currentRank.minPoints;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));
  const pointsRemaining = Math.max(0, nextRank.minPoints - safePoints);

  return { nextRank, progressPercent, pointsRemaining };
}

export type ArenaAiDifficulty = 'mestre' | 'grao_mestre' | 'lendario';

export interface ArenaAiProfile {
  id: ArenaAiDifficulty;
  name: string;
  avatar: string;
  targetWpm: number;
  accuracy: number;
  title: string;
}
