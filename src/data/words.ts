import { WordCategory, CurricularTrackId, TypingMode, CategoryId } from '../types';
import { GERAL_TRACK } from './tracks/geral';
import { getRandomWordForTrack } from './tracks';
import { getRandomSentence } from './sentences';
import { getRandomCodeSnippet } from './codeSnippets';

export * from './tracks';
export * from './sentences';
export * from './codeSnippets';

export const WORD_CATEGORIES: WordCategory[] = GERAL_TRACK.categories;

export function getRandomWord(
  categoryId: string,
  excludeWord?: string,
  trackId?: CurricularTrackId | string | null
): string {
  return getRandomWordForTrack(categoryId, excludeWord, trackId);
}

/**
 * Retorna o próximo texto (palavra, frase ou trecho de código) com base no modo ativo.
 */
export function getTextForMode(
  mode: TypingMode = 'words',
  categoryId: CategoryId | string = 'facil',
  excludeText?: string,
  trackId?: CurricularTrackId | string | null
): string {
  if (mode === 'sentences') {
    return getRandomSentence(trackId, categoryId, excludeText);
  }
  if (mode === 'code') {
    return getRandomCodeSnippet(categoryId, excludeText);
  }
  return getRandomWord(categoryId, excludeText, trackId);
}
