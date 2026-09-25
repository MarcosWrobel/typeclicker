/**
 * turmasAggregator.ts
 *
 * Módulo de agregação pedagógica in-memory (ZERO leituras/gravações ao Firestore).
 *
 * Recebe o array de LeaderboardEntry já carregado no AdminPanel e calcula métricas
 * agregadas por turma para todos os gêneros de jogo presentes na plataforma.
 *
 * Regra de Ouro: nenhuma função deste módulo chama o Firestore.
 */

import type { LeaderboardEntry } from './firebaseService';

// ─────────────────────────────────────────────────────────────
// Tipos de saída
// ─────────────────────────────────────────────────────────────

export interface TurmaAggregated {
  turma: string;
  totalAlunos: number;
  // TypeClicker
  avgLevel: number;
  avgWpm: number;
  avgAccuracy: number;
  maxLevel: number;
  maxWpm: number;
  // Type: Radar
  radarPlayers: number;        // alunos que jogaram ao menos uma partida
  radarAvgBestWave: number;
  radarAvgHighScore: number;
  radarMaxWpm: number;
  // Arena PvP
  pvpPlayers: number;
  pvpAvgWins: number;
  pvpTotalMatches: number;
  // Corridas Escolares
  raceAvgWins: number;
  raceTotalParticipations: number;
  raceBestWpm: number;
  // Conquistas
  avgAchievements: number;
  // Combo
  avgMaxCombo: number;
  maxCombo: number;
  // Anti-cheat
  flaggedCount: number;
}

export interface PedagogicalCsvRow {
  turma: string;
  nome: string;
  apelido: string;
  rpgClass: string;
  level: number;
  totalBytes: number;
  wpm: number;
  accuracy: number;
  maxCombo: number;
  achievements: number;
  radarBestWave: number;
  radarHighScore: number;
  radarMaxWpm: number;
  pvpWins: number;
  pvpMatches: number;
  pvpPoints: number;
  raceWins: number;
  racesParticipated: number;
  raceBestWpm: number;
  flaggedForReview: boolean;
  flagReason: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────
// Funções
// ─────────────────────────────────────────────────────────────

/**
 * Agrega as métricas de alunos por turma.
 * Operação puramente em memória — O(n).
 */
export function aggregateByTurma(students: LeaderboardEntry[]): TurmaAggregated[] {
  if (!students || students.length === 0) return [];

  const map = new Map<string, LeaderboardEntry[]>();
  for (const s of students) {
    const turma = s.turma || 'Sem turma';
    if (!map.has(turma)) map.set(turma, []);
    map.get(turma)!.push(s);
  }

  const result: TurmaAggregated[] = [];

  for (const [turma, list] of map.entries()) {
    const n = list.length;
    const avg = (fn: (s: LeaderboardEntry) => number) =>
      Math.round(list.reduce((acc, s) => acc + (fn(s) || 0), 0) / n);
    const max = (fn: (s: LeaderboardEntry) => number) =>
      Math.max(...list.map(fn).map(v => v || 0));

    const radarPlayers = list.filter(s => (s.radarBestWave ?? 0) > 0);
    const pvpPlayers   = list.filter(s => (s.pvpMatches ?? 0) > 0);

    result.push({
      turma,
      totalAlunos: n,
      // TypeClicker
      avgLevel:    avg(s => s.level),
      avgWpm:      avg(s => s.wpm),
      avgAccuracy: avg(s => s.accuracy ?? 100),
      maxLevel:    max(s => s.level),
      maxWpm:      max(s => s.bestWpm ?? s.wpm),
      // Type: Radar
      radarPlayers: radarPlayers.length,
      radarAvgBestWave: radarPlayers.length > 0
        ? Math.round(radarPlayers.reduce((a, s) => a + (s.radarBestWave ?? 0), 0) / radarPlayers.length)
        : 0,
      radarAvgHighScore: radarPlayers.length > 0
        ? Math.round(radarPlayers.reduce((a, s) => a + (s.radarHighScore ?? 0), 0) / radarPlayers.length)
        : 0,
      radarMaxWpm: max(s => s.radarMaxWpm ?? 0),
      // Arena PvP
      pvpPlayers: pvpPlayers.length,
      pvpAvgWins: pvpPlayers.length > 0
        ? Math.round(pvpPlayers.reduce((a, s) => a + (s.pvpWins ?? 0), 0) / pvpPlayers.length)
        : 0,
      pvpTotalMatches: list.reduce((a, s) => a + (s.pvpMatches ?? 0), 0),
      // Corridas Escolares
      raceAvgWins: avg(s => s.raceWins ?? 0),
      raceTotalParticipations: list.reduce((a, s) => a + (s.racesParticipated ?? 0), 0),
      raceBestWpm: max(s => s.bestRaceWpm ?? 0),
      // Conquistas
      avgAchievements: avg(s => s.achievementsCount ?? 0),
      // Combo
      avgMaxCombo: avg(s => s.maxCombo ?? 0),
      maxCombo: max(s => s.maxCombo ?? 0),
      // Anti-cheat
      flaggedCount: list.filter(s => s.flaggedForReview).length
    });
  }

  // Ordena por turma alfabeticamente
  return result.sort((a, b) => a.turma.localeCompare(b.turma, 'pt-BR'));
}

/**
 * Converte uma lista de alunos em linhas de CSV pedagógico multi-gênero.
 * Inclui métricas de TypeClicker, Type: Radar, Arena PvP e Corridas Escolares.
 */
export function buildPedagogicalCsvRows(students: LeaderboardEntry[]): PedagogicalCsvRow[] {
  return students.map(s => ({
    turma:              s.turma || '',
    nome:               s.nome || '',
    apelido:            s.apelido || '',
    rpgClass:           s.rpgClass || '',
    level:              s.level ?? 1,
    totalBytes:         s.points ?? 0,
    wpm:                s.wpm ?? 0,
    accuracy:           s.accuracy ?? 100,
    maxCombo:           s.maxCombo ?? 0,
    achievements:       s.achievementsCount ?? 0,
    radarBestWave:      s.radarBestWave ?? 0,
    radarHighScore:     s.radarHighScore ?? 0,
    radarMaxWpm:        s.radarMaxWpm ?? 0,
    pvpWins:            s.pvpWins ?? 0,
    pvpMatches:         s.pvpMatches ?? 0,
    pvpPoints:          s.pvpPoints ?? 0,
    raceWins:           s.raceWins ?? 0,
    racesParticipated:  s.racesParticipated ?? 0,
    raceBestWpm:        s.bestRaceWpm ?? 0,
    flaggedForReview:   s.flaggedForReview ?? false,
    flagReason:         s.flagReason || '',
    updatedAt:          s.updatedAt ? new Date(s.updatedAt).toLocaleString('pt-BR') : ''
  }));
}

const CSV_HEADERS_PEDAGOGICAL: (keyof PedagogicalCsvRow)[] = [
  'turma', 'nome', 'apelido', 'rpgClass', 'level', 'totalBytes',
  'wpm', 'accuracy', 'maxCombo', 'achievements',
  'radarBestWave', 'radarHighScore', 'radarMaxWpm',
  'pvpWins', 'pvpMatches', 'pvpPoints',
  'raceWins', 'racesParticipated', 'raceBestWpm',
  'flaggedForReview', 'flagReason', 'updatedAt'
];

const CSV_HEADERS_TURMA: (keyof TurmaAggregated)[] = [
  'turma', 'totalAlunos', 'avgLevel', 'maxLevel', 'avgWpm', 'maxWpm', 'avgAccuracy',
  'radarPlayers', 'radarAvgBestWave', 'radarAvgHighScore', 'radarMaxWpm',
  'pvpPlayers', 'pvpAvgWins', 'pvpTotalMatches',
  'raceAvgWins', 'raceTotalParticipations', 'raceBestWpm',
  'avgAchievements', 'avgMaxCombo', 'maxCombo', 'flaggedCount'
];

/**
 * Gera uma string CSV (com BOM UTF-8) pronta para download.
 * Separador ponto-e-vírgula para compatibilidade com Excel pt-BR.
 */
export function exportToCsv(
  students: LeaderboardEntry[],
  mode: 'pedagogical' | 'turmas' = 'pedagogical',
  selectedTurma?: string
): string {
  const esc = (val: unknown) => `"${String(val ?? '').replace(/"/g, '""')}"`;

  if (mode === 'turmas') {
    const turmaData = selectedTurma && selectedTurma !== 'todas'
      ? aggregateByTurma(students).filter(t => t.turma === selectedTurma)
      : aggregateByTurma(students);

    const header = CSV_HEADERS_TURMA.join(';');
    const rows = turmaData.map(row =>
      CSV_HEADERS_TURMA.map(k => esc(row[k])).join(';')
    );
    return '\uFEFF' + [header, ...rows].join('\r\n');
  }

  // modo 'pedagogical' — uma linha por aluno
  const list = selectedTurma && selectedTurma !== 'todas'
    ? students.filter(s => s.turma === selectedTurma)
    : students;
  const rows = buildPedagogicalCsvRows(list);
  const header = CSV_HEADERS_PEDAGOGICAL.join(';');
  const csvRows = rows.map(row =>
    CSV_HEADERS_PEDAGOGICAL.map(k => esc(row[k])).join(';')
  );
  return '\uFEFF' + [header, ...csvRows].join('\r\n');
}

/**
 * Aciona o download de um CSV no navegador (sem nenhuma chamada ao Firestore).
 */
export function downloadCsv(
  content: string,
  filename: string
): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
