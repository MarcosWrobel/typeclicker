import { LeaderboardEntry } from '../types/leaderboard';
import { getSerieIdFromTurma, getSerieLabelFromTurma } from '../constants/school';

export interface ClassStats {
  turma: string;
  serieId: string;
  serieLabel: string;
  studentCount: number;
  avgLevel: number;
  avgWpm: number;
  avgAccuracy: number;
  totalBytes: number;
  totalRaceWins: number;
  totalPvPWins: number;
  bestPlayer?: {
    nome: string;
    apelido?: string;
    level: number;
    wpm: number;
  };
  compositeScore: number;
}

export type ClassRankingSortMetric = 'score' | 'avgLevel' | 'avgWpm' | 'totalBytes' | 'raceWins';

/**
 * Agrupa os alunos por turma e calcula estatísticas coletivas ponderadas.
 * Execução 100% in-memory: 0 leituras e 0 escritas no banco de dados.
 */
export function aggregateClassStats(students: LeaderboardEntry[]): ClassStats[] {
  if (!students || students.length === 0) return [];

  const map = new Map<string, {
    turma: string;
    studentCount: number;
    totalLevel: number;
    totalWpm: number;
    totalAccuracy: number;
    accuracyCount: number;
    totalBytes: number;
    totalRaceWins: number;
    totalPvPWins: number;
    bestPlayer?: {
      nome: string;
      apelido?: string;
      level: number;
      wpm: number;
    };
  }>();

  for (const s of students) {
    const rawTurma = (s.turma || '').trim();
    if (!rawTurma) continue; // Alunos sem turma definida não entram na guerra de turmas

    let group = map.get(rawTurma);
    if (!group) {
      group = {
        turma: rawTurma,
        studentCount: 0,
        totalLevel: 0,
        totalWpm: 0,
        totalAccuracy: 0,
        accuracyCount: 0,
        totalBytes: 0,
        totalRaceWins: 0,
        totalPvPWins: 0
      };
      map.set(rawTurma, group);
    }

    group.studentCount += 1;
    group.totalLevel += s.level || 1;
    group.totalWpm += s.wpm || 0;
    if (s.accuracy !== undefined && s.accuracy > 0) {
      group.totalAccuracy += s.accuracy;
      group.accuracyCount += 1;
    }
    group.totalBytes += s.points || 0;
    group.totalRaceWins += s.raceWins || 0;
    group.totalPvPWins += s.pvpWins || 0;

    // Localiza o aluno destaque da turma (maior nível / wpm)
    if (!group.bestPlayer || (s.level || 1) > group.bestPlayer.level || ((s.level || 1) === group.bestPlayer.level && (s.wpm || 0) > group.bestPlayer.wpm)) {
      group.bestPlayer = {
        nome: s.nome,
        apelido: s.apelido,
        level: s.level || 1,
        wpm: s.wpm || 0
      };
    }
  }

  const result: ClassStats[] = [];

  for (const group of map.values()) {
    const count = group.studentCount;
    const avgLevel = count > 0 ? Number((group.totalLevel / count).toFixed(1)) : 1;
    const avgWpm = count > 0 ? Number((group.totalWpm / count).toFixed(1)) : 0;
    const avgAccuracy = group.accuracyCount > 0 ? Number((group.totalAccuracy / group.accuracyCount).toFixed(1)) : 100;
    
    // Pontuação composta (Índice de Rendimento da Turma):
    // Valoriza engajamento, velocidade e precisão média de toda a sala
    const participationBonus = Math.min(count * 50, 600);
    const compositeScore = Math.round(
      (avgLevel * 120) +
      (avgWpm * 15) +
      (avgAccuracy * 5) +
      participationBonus +
      (group.totalRaceWins * 30) +
      (group.totalPvPWins * 20)
    );

    result.push({
      turma: group.turma,
      serieId: getSerieIdFromTurma(group.turma),
      serieLabel: getSerieLabelFromTurma(group.turma),
      studentCount: count,
      avgLevel,
      avgWpm,
      avgAccuracy,
      totalBytes: group.totalBytes,
      totalRaceWins: group.totalRaceWins,
      totalPvPWins: group.totalPvPWins,
      bestPlayer: group.bestPlayer,
      compositeScore
    });
  }

  return result;
}

/**
 * Ordena as turmas pela métrica escolhida.
 */
export function sortClassStats(classes: ClassStats[], metric: ClassRankingSortMetric): ClassStats[] {
  return [...classes].sort((a, b) => {
    switch (metric) {
      case 'score':
        return b.compositeScore - a.compositeScore;
      case 'avgLevel':
        return b.avgLevel !== a.avgLevel ? b.avgLevel - a.avgLevel : b.avgWpm - a.avgWpm;
      case 'avgWpm':
        return b.avgWpm !== a.avgWpm ? b.avgWpm - a.avgWpm : b.avgLevel - a.avgLevel;
      case 'totalBytes':
        return b.totalBytes - a.totalBytes;
      case 'raceWins':
        return b.totalRaceWins !== a.totalRaceWins ? b.totalRaceWins - a.totalRaceWins : b.compositeScore - a.compositeScore;
      default:
        return b.compositeScore - a.compositeScore;
    }
  });
}
