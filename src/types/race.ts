export interface ClassroomRaceFinisher {
  userId: string;
  nome: string;
  apelido: string;
  avatar: string;
  turma: string;
  wpm: number;
  accuracy: number;
  timeMs: number;
  finishedAt: number;
  position: number;
}

export interface ClassroomRace {
  id: string; // ID único da corrida (ex: race_1726860000000)
  title: string;
  text: string;
  source?: string;
  targetTurma: string; // 'todas' | '6º A' | etc.
  countdownSeconds: number; // padrão 5
  createdAtMs: number;
  startsAtMs: number; // timestamp em epoch de início oficial da digitação
  status: 'countdown' | 'in_progress' | 'finished' | 'cancelled';
  prizeBytes: number;
  createdBy: string;
  teacherEmail: string;
  winner?: ClassroomRaceFinisher | null;
  finishers?: ClassroomRaceFinisher[];
}

export interface ClassroomRaceConfig {
  title: string;
  text: string;
  source?: string;
  targetTurma?: string;
  countdownSeconds?: number;
  prizeBytes?: number;
}

export interface PresetRaceText {
  id: string;
  title: string;
  category: 'computacao' | 'literatura' | 'ciencia' | 'inovacao';
  text: string;
  source: string;
}
