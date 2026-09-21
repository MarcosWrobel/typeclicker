import { WordCategory } from '../types';

export type CurricularTrackId = 'geral' | 'scratch' | 'web' | 'empresarial' | 'ingles';

export interface CurricularTrackConfig {
  id: CurricularTrackId;
  name: string;
  discipline: string;
  targetAudience: string; // Ex: '8º e 9º Anos', '1º e 2º Anos (EM)', 'Todas as Turmas'
  icon: string; // Emoji
  badgeColor: 'emerald' | 'sky' | 'amber' | 'purple' | 'blue' | 'rose';
  description: string;
  categories: WordCategory[];
}
