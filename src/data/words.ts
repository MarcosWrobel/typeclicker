import { WordCategory, CurricularTrackId } from '../types';
import { GERAL_TRACK } from './tracks/geral';
import { getRandomWordForTrack } from './tracks';

export * from './tracks';

export const WORD_CATEGORIES: WordCategory[] = GERAL_TRACK.categories;

export function getRandomWord(
  categoryId: string,
  excludeWord?: string,
  trackId?: CurricularTrackId | string | null
): string {
  return getRandomWordForTrack(categoryId, excludeWord, trackId);
}
