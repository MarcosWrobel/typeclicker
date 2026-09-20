import { CategoryId } from '../types';

export function getMinAllowedCategoryLevel(level: number): CategoryId {
  if (level >= 80) return 'expert';
  if (level >= 61) return 'avancado';
  if (level >= 41) return 'medio';
  if (level >= 21) return 'facil';
  return 'iniciante';
}

const CAT_ORDER: CategoryId[] = ['iniciante', 'facil', 'medio', 'avancado', 'expert'];

export function isCategoryAllowed(cat: CategoryId, playerRankLevel: number): boolean {
  const minCat = getMinAllowedCategoryLevel(playerRankLevel);
  return CAT_ORDER.indexOf(cat) >= CAT_ORDER.indexOf(minCat);
}
