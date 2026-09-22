import { LeaderboardEntry } from './firebaseService';
import { GameState } from '../types';
import { RPG_CLASSES } from '../types/rpgClass';
import { calculatePlayerRank, calculatePPM, calculateAccuracy } from '../utils/formatting';

export type BadgeCategory =
  | 'pioneer'
  | 'speed'
  | 'accuracy'
  | 'combo'
  | 'volume'
  | 'pvp'
  | 'races'
  | 'progression'
  | 'achievements'
  | 'class';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface ProfileBadge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  bgClass: string;
  borderClass: string;
  textClass: string;
  glowClass?: string;
  priority: number; // Maior prioridade aparece primeiro na vitrine
}

const RARITY_WEIGHTS: Record<BadgeRarity, number> = {
  mythic: 500,
  legendary: 400,
  epic: 300,
  rare: 200,
  common: 100
};

export interface PlayerStatsForBadges {
  level: number;
  points: number;
  wpm: number;
  bestWpm?: number;
  accuracy?: number;
  maxCombo?: number;
  pvpWins?: number;
  raceWins?: number;
  reachedLevel100At?: string;
  rpgClass?: string;
  achievementsCount?: number;
}

export function extractStatsFromPlayer(
  player: Partial<LeaderboardEntry> | GameState
): PlayerStatsForBadges {
  const isGameState = 'totalBytesEarned' in player;
  
  if (isGameState) {
    const gs = player as GameState;
    const unlockedAch = gs.achievements ? Object.keys(gs.achievements).length : 0;
    const rank = calculatePlayerRank(gs.totalBytesEarned || 0);
    const ppm = calculatePPM(gs.correctKeys || 0, gs.totalActiveSeconds || 0);
    const accuracy = calculateAccuracy(gs.correctKeys || 0, gs.wrongKeys || 0);

    return {
      level: rank.level,
      points: gs.totalBytesEarned || 0,
      wpm: ppm,
      bestWpm: Math.max(gs.bestRaceWpm || 0, ppm),
      accuracy: accuracy,
      maxCombo: gs.maxCombo || 0,
      pvpWins: gs.arenaStats?.wins || 0,
      raceWins: gs.raceWins || 0,
      reachedLevel100At: gs.reachedLevel100At,
      rpgClass: gs.rpgClass,
      achievementsCount: unlockedAch
    };
  }

  const le = player as Partial<LeaderboardEntry>;
  return {
    level: le.level || 1,
    points: le.points || 0,
    wpm: le.wpm || 0,
    bestWpm: Math.max(le.bestWpm || 0, le.wpm || 0),
    accuracy: le.accuracy ?? 100,
    maxCombo: le.maxCombo || 0,
    pvpWins: le.pvpWins || 0,
    raceWins: le.raceWins || 0,
    reachedLevel100At: le.reachedLevel100At,
    rpgClass: le.rpgClass,
    achievementsCount: le.achievementsCount || 0
  };
}

export function calculatePlayerBadges(
  player: Partial<LeaderboardEntry> | GameState,
  pioneerRank?: 1 | 2 | 3
): { allBadges: ProfileBadge[]; featuredBadges: ProfileBadge[] } {
  const stats = extractStatsFromPlayer(player);
  const badges: ProfileBadge[] = [];

  // 1. PIONEIRO DO NÍVEL 100 (A insígnia de maior glória da história)
  if (pioneerRank === 1) {
    badges.push({
      id: 'pioneer_1',
      title: '1º Pioneiro da História',
      subtitle: 'Coroa de Ouro Absoluto',
      description: 'O primeiríssimo aluno a conquistar o Nível 100 em toda a história do Colégio Leopoldina Pedroso.',
      icon: '👑',
      category: 'pioneer',
      rarity: 'mythic',
      bgClass: 'bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-yellow-400/20',
      borderClass: 'border-amber-400',
      textClass: 'text-amber-300',
      glowClass: 'shadow-[0_0_20px_rgba(251,191,36,0.5)]',
      priority: 1000
    });
  } else if (pioneerRank === 2) {
    badges.push({
      id: 'pioneer_2',
      title: '2º Pioneiro da História',
      subtitle: 'Coroa de Prata Cósmica',
      description: 'O segundo aluno a alcançar a glória do Nível 100 na história do colégio.',
      icon: '🥈',
      category: 'pioneer',
      rarity: 'mythic',
      bgClass: 'bg-gradient-to-r from-slate-300/20 via-slate-400/20 to-zinc-200/20',
      borderClass: 'border-slate-300',
      textClass: 'text-slate-200',
      glowClass: 'shadow-[0_0_15px_rgba(203,213,225,0.4)]',
      priority: 950
    });
  } else if (pioneerRank === 3) {
    badges.push({
      id: 'pioneer_3',
      title: '3º Pioneiro da História',
      subtitle: 'Coroa de Bronze Forjado',
      description: 'O terceiro aluno a imortalizar seu nome no pódio de lendas do Nível 100.',
      icon: '🥉',
      category: 'pioneer',
      rarity: 'mythic',
      bgClass: 'bg-gradient-to-r from-amber-700/20 via-orange-800/20 to-amber-600/20',
      borderClass: 'border-amber-600',
      textClass: 'text-amber-400',
      glowClass: 'shadow-[0_0_15px_rgba(217,119,6,0.4)]',
      priority: 900
    });
  }

  // 2. PROGRESSÃO DE NÍVEL
  if (stats.level >= 100) {
    badges.push({
      id: 'level_100',
      title: 'Lenda Suprema',
      subtitle: 'Nível 100 Conquistado',
      description: 'Chegou ao ápice da evolução da digitação escolar completando todos os 100 níveis.',
      icon: '🌟',
      category: 'progression',
      rarity: 'legendary',
      bgClass: 'bg-amber-500/20',
      borderClass: 'border-amber-400/70',
      textClass: 'text-amber-300',
      glowClass: 'shadow-[0_0_15px_rgba(251,191,36,0.4)]',
      priority: 600
    });
  } else if (stats.level >= 75) {
    badges.push({
      id: 'level_75',
      title: 'Grão-Mestre',
      subtitle: 'Nível 75+',
      description: 'Dominou o teclado em velocidade avançada, quebrando a barreira do Nível 75.',
      icon: '💎',
      category: 'progression',
      rarity: 'epic',
      bgClass: 'bg-cyan-500/20',
      borderClass: 'border-cyan-400/60',
      textClass: 'text-cyan-300',
      priority: 450
    });
  } else if (stats.level >= 50) {
    badges.push({
      id: 'level_50',
      title: 'Veterano Escolar',
      subtitle: 'Metade do Caminho (Nv. 50)',
      description: 'Superou a marca histórica do Nível 50 com disciplina e dedicação contínua.',
      icon: '🏆',
      category: 'progression',
      rarity: 'rare',
      bgClass: 'bg-emerald-500/20',
      borderClass: 'border-emerald-400/60',
      textClass: 'text-emerald-300',
      priority: 350
    });
  } else if (stats.level >= 25) {
    badges.push({
      id: 'level_25',
      title: 'Explorador',
      subtitle: 'Nível 25 Alcançado',
      description: 'Passou do primeiro quarto da jornada com digitação firme em todas as fileiras.',
      icon: '🛡️',
      category: 'progression',
      rarity: 'common',
      bgClass: 'bg-zinc-800/80',
      borderClass: 'border-zinc-600',
      textClass: 'text-zinc-300',
      priority: 150
    });
  }

  // 3. VELOCIDADE DE DIGITAÇÃO (PPM)
  const effectiveWpm = stats.bestWpm || stats.wpm;
  if (effectiveWpm >= 100) {
    badges.push({
      id: 'wpm_100',
      title: 'Trovão Sônico',
      subtitle: '100+ Palavras por Minuto',
      description: 'Velocidade hiper-sônica! Digita mais rápido que 99% dos estudantes da região.',
      icon: '⚡',
      category: 'speed',
      rarity: 'legendary',
      bgClass: 'bg-sky-500/20',
      borderClass: 'border-sky-400',
      textClass: 'text-sky-300',
      glowClass: 'shadow-[0_0_15px_rgba(56,189,248,0.4)]',
      priority: 550
    });
  } else if (effectiveWpm >= 70) {
    badges.push({
      id: 'wpm_70',
      title: 'Veloz da Turma',
      subtitle: '70+ Palavras por Minuto',
      description: 'Velocidade excepcional e reflexos afiados nas teclas alfanuméricas.',
      icon: '⚡',
      category: 'speed',
      rarity: 'epic',
      bgClass: 'bg-teal-500/20',
      borderClass: 'border-teal-400/60',
      textClass: 'text-teal-300',
      priority: 400
    });
  } else if (effectiveWpm >= 45) {
    badges.push({
      id: 'wpm_45',
      title: 'Digitador Ágil',
      subtitle: '45+ Palavras por Minuto',
      description: 'Ritmo rápido e consistente, superando a média padrão da sala.',
      icon: '⚡',
      category: 'speed',
      rarity: 'rare',
      bgClass: 'bg-indigo-500/20',
      borderClass: 'border-indigo-400/50',
      textClass: 'text-indigo-300',
      priority: 250
    });
  }

  // 4. PRECISÃO & ACURÁCIA
  if (stats.accuracy && stats.accuracy >= 98 && effectiveWpm >= 30) {
    badges.push({
      id: 'acc_98',
      title: 'Mão de Cirurgião',
      subtitle: '98%+ de Precisão Média',
      description: 'Acurácia quase cirúrgica. Digita com concentração e quase zero erros.',
      icon: '🎯',
      category: 'accuracy',
      rarity: 'epic',
      bgClass: 'bg-emerald-500/20',
      borderClass: 'border-emerald-400/60',
      textClass: 'text-emerald-300',
      priority: 420
    });
  } else if (stats.accuracy && stats.accuracy >= 95) {
    badges.push({
      id: 'acc_95',
      title: 'Tiro Certeiro',
      subtitle: '95%+ de Precisão Média',
      description: 'Alta exatidão nas pontas dos dedos sem perder o foco.',
      icon: '🎯',
      category: 'accuracy',
      rarity: 'rare',
      bgClass: 'bg-zinc-800/80',
      borderClass: 'border-emerald-500/40',
      textClass: 'text-emerald-400',
      priority: 220
    });
  }

  // 5. COMBOS SEM ERRO
  if (stats.maxCombo && stats.maxCombo >= 100) {
    badges.push({
      id: 'combo_100',
      title: 'Combo Lendário',
      subtitle: '100+ Teclas Consecutivas',
      description: 'Sequência astronômica de acertos contínuos sem um único deslize.',
      icon: '🔥',
      category: 'combo',
      rarity: 'epic',
      bgClass: 'bg-orange-500/20',
      borderClass: 'border-orange-400/70',
      textClass: 'text-orange-300',
      glowClass: 'shadow-[0_0_15px_rgba(249,115,22,0.4)]',
      priority: 480
    });
  } else if (stats.maxCombo && stats.maxCombo >= 50) {
    badges.push({
      id: 'combo_50',
      title: 'Foco Inabalável',
      subtitle: '50+ Teclas Consecutivas',
      description: 'Excelente ritmo rítmico sustentado sem errar teclas.',
      icon: '🔥',
      category: 'combo',
      rarity: 'rare',
      bgClass: 'bg-orange-500/15',
      borderClass: 'border-orange-500/40',
      textClass: 'text-orange-300',
      priority: 300
    });
  } else if (stats.maxCombo && stats.maxCombo >= 25) {
    badges.push({
      id: 'combo_25',
      title: 'Ritmo Constante',
      subtitle: '25+ Teclas Consecutivas',
      description: 'Capacidade comprovada de manter sequências limpas.',
      icon: '🔥',
      category: 'combo',
      rarity: 'common',
      bgClass: 'bg-zinc-800/80',
      borderClass: 'border-orange-600/30',
      textClass: 'text-orange-400',
      priority: 180
    });
  }

  // 6. VOLUME DE BYTES VITALÍCIOS
  if (stats.points >= 1000000000) { // 1 GB+
    badges.push({
      id: 'bytes_1gb',
      title: 'Bilionário de Dados',
      subtitle: '1 Gigabyte+ Digitado',
      description: 'Volume gigantesco de dados processados ao longo de sua trajetória escolar.',
      icon: '💾',
      category: 'volume',
      rarity: 'legendary',
      bgClass: 'bg-purple-500/20',
      borderClass: 'border-purple-400',
      textClass: 'text-purple-300',
      glowClass: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
      priority: 520
    });
  } else if (stats.points >= 1000000) { // 1 MB+
    badges.push({
      id: 'bytes_1mb',
      title: 'Milionário de Bytes',
      subtitle: '1 Megabyte+ Digitado',
      description: 'Ultrapassou a respeitável marca de 1 milhão de bytes digitados.',
      icon: '💾',
      category: 'volume',
      rarity: 'rare',
      bgClass: 'bg-purple-500/15',
      borderClass: 'border-purple-500/40',
      textClass: 'text-purple-300',
      priority: 280
    });
  }

  // 7. DUELOS PVP (COLISEU 1x1)
  if (stats.pvpWins && stats.pvpWins >= 20) {
    badges.push({
      id: 'pvp_master',
      title: 'Campeão do Coliseu',
      subtitle: '20+ Vitórias em Duelos 1x1',
      description: 'Temido nas arenas individuais, venceu dezenas de duelos diretos.',
      icon: '⚔️',
      category: 'pvp',
      rarity: 'epic',
      bgClass: 'bg-rose-500/20',
      borderClass: 'border-rose-400/70',
      textClass: 'text-rose-300',
      glowClass: 'shadow-[0_0_15px_rgba(244,63,94,0.4)]',
      priority: 460
    });
  } else if (stats.pvpWins && stats.pvpWins >= 5) {
    badges.push({
      id: 'pvp_veteran',
      title: 'Duelista Notável',
      subtitle: '5+ Vitórias em Duelos',
      description: 'Competidor respeitado com vitórias confirmadas no modo Coliseu.',
      icon: '⚔️',
      category: 'pvp',
      rarity: 'rare',
      bgClass: 'bg-rose-500/15',
      borderClass: 'border-rose-500/40',
      textClass: 'text-rose-300',
      priority: 260
    });
  }

  // 8. CORRIDAS DA TURMA
  if (stats.raceWins && stats.raceWins >= 10) {
    badges.push({
      id: 'race_champ',
      title: 'As das Pistas',
      subtitle: '10+ Vitórias em Corridas',
      description: 'Dominador das corridas ao vivo da turma, cruzando a linha em 1º lugar.',
      icon: '🏁',
      category: 'races',
      rarity: 'epic',
      bgClass: 'bg-amber-500/20',
      borderClass: 'border-amber-400/70',
      textClass: 'text-amber-300',
      priority: 440
    });
  } else if (stats.raceWins && stats.raceWins >= 3) {
    badges.push({
      id: 'race_pilot',
      title: 'Piloto Veloz',
      subtitle: '3+ Vitórias em Corridas',
      description: 'Já subiu ao lugar mais alto do pódio nas corridas com a turma.',
      icon: '🏁',
      category: 'races',
      rarity: 'rare',
      bgClass: 'bg-amber-500/15',
      borderClass: 'border-amber-500/40',
      textClass: 'text-amber-300',
      priority: 240
    });
  }

  // 9. CONQUISTAS DESBLOQUEADAS
  if (stats.achievementsCount && stats.achievementsCount >= 15) {
    badges.push({
      id: 'ach_master',
      title: 'Mestre dos Troféus',
      subtitle: '15+ Conquistas Completas',
      description: 'Explorador incansável que desvendou a maior parte dos troféus do jogo.',
      icon: '🎖️',
      category: 'achievements',
      rarity: 'epic',
      bgClass: 'bg-yellow-500/20',
      borderClass: 'border-yellow-400/60',
      textClass: 'text-yellow-300',
      priority: 410
    });
  } else if (stats.achievementsCount && stats.achievementsCount >= 8) {
    badges.push({
      id: 'ach_hunter',
      title: 'Caçador de Troféus',
      subtitle: '8+ Conquistas Completas',
      description: 'Dedicação em cumprir metas especiais pedagógicas e segredos.',
      icon: '🎖️',
      category: 'achievements',
      rarity: 'rare',
      bgClass: 'bg-zinc-800/80',
      borderClass: 'border-yellow-500/40',
      textClass: 'text-yellow-400',
      priority: 230
    });
  }

  // 10. CLASSE RPG (Vocação)
  if (stats.rpgClass && (RPG_CLASSES as any)[stats.rpgClass]) {
    const classDef = (RPG_CLASSES as any)[stats.rpgClass];
    badges.push({
      id: `class_${stats.rpgClass}`,
      title: classDef.name,
      subtitle: `Vocação ${classDef.role || 'RPG'}`,
      description: classDef.description || 'Classe de herói escolhida pelo aluno no Colégio Leopoldina.',
      icon: classDef.icon || '🛡️',
      category: 'class',
      rarity: 'rare',
      bgClass: classDef.badgeBg || 'bg-zinc-800',
      borderClass: classDef.badgeBorder || 'border-zinc-600',
      textClass: classDef.badgeText || 'text-zinc-200',
      priority: 200
    });
  }

  // Ordena todas as insígnias por prioridade decrescente
  badges.sort((a, b) => b.priority - a.priority);

  // Destaca as 4 a 6 principais para a vitrine frontal do card
  const featuredBadges = badges.slice(0, 4);

  return {
    allBadges: badges,
    featuredBadges
  };
}
