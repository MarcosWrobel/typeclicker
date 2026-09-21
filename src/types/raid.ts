import { RpgClassType } from './rpgClass';

export type RaidStatus = 'waiting' | 'in_progress' | 'victory' | 'defeat' | 'cancelled';

export interface RaidParticipant {
  userId: string;
  nome: string;
  apelido: string;
  avatar: string;
  turma: string;
  rpgClass?: RpgClassType;
  damageDealt: number;
  wordsTyped: number;
  wpm: number;
  lastUpdatedMs: number;
}

export interface PresetRaidBoss {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  themeColor: 'rose' | 'purple' | 'cyan' | 'amber';
  maxHp: number;
  timeLimitSeconds: number;
  prizeBytes: number;
  weaknessHint?: string;
  quote: string;
}

export interface ClassroomRaidConfig {
  bossId: string;
  bossName: string;
  bossSubtitle?: string;
  bossIcon?: string;
  maxHp: number;
  timeLimitSeconds: number;
  prizeBytes: number;
  targetTurma?: string; // 'todas' or specific school class
  customWords?: string[];
}

export interface ClassroomRaid {
  id: string;
  bossId: string;
  bossName: string;
  bossSubtitle: string;
  bossIcon: string;
  maxHp: number;
  currentHp: number;
  timeLimitSeconds: number;
  startsAtMs: number;
  expiresAtMs: number;
  createdAtMs: number;
  status: RaidStatus;
  prizeBytes: number;
  targetTurma: string;
  createdBy: string;
  teacherEmail: string;
  participants: Record<string, RaidParticipant>;
  totalDamageDealt: number;
  mvp?: RaidParticipant;
}

export const PRESET_RAID_BOSSES: PresetRaidBoss[] = [
  {
    id: 'temis_ia',
    name: 'Têmis: IA Corrompida',
    subtitle: 'Supercomputador de Vigilância Neural',
    description: 'O núcleo cognitivo da rede escolar entrou em colapso recursivo! Digitem em equipe para sobrecarregar seus nós centrais.',
    icon: '🤖',
    themeColor: 'cyan',
    maxHp: 30000,
    timeLimitSeconds: 180,
    prizeBytes: 50000,
    weaknessHint: 'Guerreiros de alta cadência e Arqueiros precisos',
    quote: 'Vocês não podem superar a velocidade de clock do meu núcleo quântico.'
  },
  {
    id: 'devorador_memoria',
    name: 'Devorador de Memória',
    subtitle: 'Anomalia Quântica de Alocação (Memory Leak)',
    description: 'Um vazamento catastrófico de ponteiros está consumindo toda a memória do cluster. Purifiquem a memória antes do estouro da pilha!',
    icon: '👾',
    themeColor: 'purple',
    maxHp: 65000,
    timeLimitSeconds: 240,
    prizeBytes: 100000,
    weaknessHint: 'Magos restauradores e ataques sincronizados',
    quote: '0xDEADBEEF: Toda a memória alocada pertence ao abismo.'
  },
  {
    id: 'tita_quantico',
    name: 'Titã Quântico do Zero Absoluto',
    subtitle: 'Entidade Criogênica de Superprocessamento',
    description: 'O maior desafio colaborativo de digitação! Exige união total e esforço concentrado de todos os alunos da sala para descongelar o servidor.',
    icon: '❄️',
    themeColor: 'rose',
    maxHp: 120000,
    timeLimitSeconds: 300,
    prizeBytes: 250000,
    weaknessHint: 'Combinação perfeita das três classes RPG',
    quote: 'A entropia e o zero absoluto são o destino inalterável do silício.'
  }
];
