export interface SchoolGradeGroup {
  grade: string;
  classes: string[];
}

export const SCHOOL_CLASSES_CONFIG: SchoolGradeGroup[] = [
  {
    grade: '6º Ano',
    classes: ['6º 1', '6º 2', '6º 3', '6º 4']
  },
  {
    grade: '7º Ano',
    classes: ['7º 1', '7º 2', '7º 3', '7º 4']
  },
  {
    grade: '8º Ano',
    classes: ['8º 1', '8º 2', '8º 3']
  },
  {
    grade: '9º Ano',
    classes: ['9º 1', '9º 2', '9º 3']
  },
  {
    grade: 'Ens. Médio',
    classes: ['1º 3', '1º ADM', '2º ADM']
  }
];

export const ALL_STANDARD_CLASSES = SCHOOL_CLASSES_CONFIG.flatMap((g) => g.classes);

export type SerieId = 'geral' | '6ano' | '7ano' | '8ano' | '9ano' | 'em' | 'outras';

export interface SerieDefinition {
  id: SerieId;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  classes: string[];
}

export const SERIES_CONFIG: SerieDefinition[] = [
  {
    id: 'geral',
    label: 'Geral (Todos)',
    shortLabel: 'Geral',
    icon: '🏆',
    description: 'Ranking geral com todos os alunos do colégio',
    classes: []
  },
  {
    id: '6ano',
    label: '6º Ano',
    shortLabel: '6º Ano',
    icon: '🎒',
    description: 'Turmas do 6º Ano Fundamental',
    classes: ['6º 1', '6º 2', '6º 3', '6º 4']
  },
  {
    id: '7ano',
    label: '7º Ano',
    shortLabel: '7º Ano',
    icon: '📘',
    description: 'Turmas do 7º Ano Fundamental',
    classes: ['7º 1', '7º 2', '7º 3', '7º 4']
  },
  {
    id: '8ano',
    label: '8º Ano',
    shortLabel: '8º Ano',
    icon: '📙',
    description: 'Turmas do 8º Ano Fundamental',
    classes: ['8º 1', '8º 2', '8º 3']
  },
  {
    id: '9ano',
    label: '9º Ano',
    shortLabel: '9º Ano',
    icon: '📗',
    description: 'Turmas do 9º Ano Fundamental',
    classes: ['9º 1', '9º 2', '9º 3']
  },
  {
    id: 'em',
    label: 'Ens. Médio',
    shortLabel: 'Médio',
    icon: '🎓',
    description: 'Turmas do Ensino Médio e Técnico ADM',
    classes: ['1º 3', '1º ADM', '2º ADM']
  },
  {
    id: 'outras',
    label: 'Outras Turmas',
    shortLabel: 'Outras',
    icon: '✨',
    description: 'Projetos especiais, robótica e turmas personalizadas',
    classes: []
  }
];

/**
 * Retorna o ID da série correspondente a uma turma
 */
export function getSerieIdFromTurma(turma?: string): SerieId {
  if (!turma || !turma.trim()) return 'outras';
  const clean = turma.trim().toLowerCase();

  if (clean.includes('6º') || clean.startsWith('6')) {
    return '6ano';
  }
  if (clean.includes('7º') || clean.startsWith('7')) {
    return '7ano';
  }
  if (clean.includes('8º') || clean.startsWith('8')) {
    return '8ano';
  }
  if (clean.includes('9º') || clean.startsWith('9')) {
    return '9ano';
  }
  if (
    clean.includes('adm') ||
    clean.includes('médio') ||
    clean.includes('medio') ||
    clean.includes('1º') ||
    clean.includes('2º') ||
    clean.includes('3º') ||
    clean.includes('em')
  ) {
    return 'em';
  }

  return 'outras';
}

/**
 * Retorna o nome amigável da série a partir da turma
 */
export function getSerieLabelFromTurma(turma?: string): string {
  const serieId = getSerieIdFromTurma(turma);
  const found = SERIES_CONFIG.find((s) => s.id === serieId);
  return found ? found.label : 'Geral';
}

/**
 * Verifica se um aluno em determinada turma pertence à série selecionada
 */
export function matchesSerie(turma: string | undefined, serieId: SerieId): boolean {
  if (serieId === 'geral') return true;
  const playerSerie = getSerieIdFromTurma(turma);
  return playerSerie === serieId;
}
