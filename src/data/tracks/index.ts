import { CurricularTrackConfig, CurricularTrackId, WordCategory } from '../../types';
import { GERAL_TRACK } from './geral';
import { SCRATCH_TRACK } from './scratch';
import { WEB_TRACK } from './web';
import { EMPRESARIAL_TRACK } from './empresarial';
import { INGLES_TRACK } from './ingles';

export { GERAL_TRACK, SCRATCH_TRACK, WEB_TRACK, EMPRESARIAL_TRACK, INGLES_TRACK };

export const CURRICULAR_TRACKS: CurricularTrackConfig[] = [
  GERAL_TRACK,
  SCRATCH_TRACK,
  WEB_TRACK,
  EMPRESARIAL_TRACK,
  INGLES_TRACK
];

export function getCurricularTrack(trackId?: CurricularTrackId | string | null): CurricularTrackConfig {
  if (!trackId) return GERAL_TRACK;
  return CURRICULAR_TRACKS.find(t => t.id === trackId) || GERAL_TRACK;
}

export function getTrackCategories(trackId?: CurricularTrackId | string | null): WordCategory[] {
  return getCurricularTrack(trackId).categories;
}

export function getRandomWordForTrack(
  categoryId: string,
  excludeWord?: string,
  trackId?: CurricularTrackId | string | null
): string {
  const track = getCurricularTrack(trackId);
  const category = track.categories.find(c => c.id === categoryId) || track.categories[0];
  const list = category.words.filter(w => w !== excludeWord);
  if (list.length === 0) return category.words[0] || 'linux';
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Sugere de forma inteligente a trilha curricular ideal baseada na turma selecionada pelo professor.
 * - 8º e 9º Anos -> Educação Digital (Scratch)
 * - 1º e 2º Anos EM -> Educação Digital (Programação Web HTML/CSS/JS)
 */
export function suggestTrackForTurma(turma?: string | null): CurricularTrackId {
  if (!turma) return 'geral';
  const clean = turma.trim().toLowerCase();
  
  if (clean.includes('8º') || clean.includes('8°') || clean.includes('8o') ||
      clean.includes('9º') || clean.includes('9°') || clean.includes('9o')) {
    return 'scratch';
  }

  if (clean.includes('1º') || clean.includes('1°') || clean.includes('1o') || clean.includes('1ª') ||
      clean.includes('2º') || clean.includes('2°') || clean.includes('2o') || clean.includes('2ª')) {
    return 'web';
  }

  return 'geral';
}
