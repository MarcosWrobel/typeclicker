/**
 * Catálogo de caminhos vetoriais nativos (Path2D) normalizados em viewBox 24x24
 * com ponto de ancoragem no centro (12, 12).
 *
 * Zero-Asset & Custo Zero:
 * - Independente de fontes tipográficas ou pacotes de emoji do SO.
 * - Renderização com vértices idênticos no Linux Mint, Windows, macOS e Android.
 * - Suporta preenchimento direto, gradientes lineares/radiais e sombras (shadowBlur).
 */

const createPath = (d: string): Path2D => {
  if (typeof window !== 'undefined' && typeof Path2D === 'function') {
    try {
      return new Path2D(d);
    } catch {
      // Fallback silencioso
    }
  }
  // Em ambientes de teste ou sem Path2D nativo
  return {} as Path2D;
};

export const VECTOR_PATHS = {
  // Morcego gótico com asas anguladas
  bat: 'M12 4c-1.5 0-2.5 1.5-3 3C7 5 3 6 1 10c3 0 5 2 6 5 2-1 4-1 5 1 1-2 3-2 5-1 1-3 3-5 6-5-2-4-6-5-8-3-.5-1.5-1.5-3-3-3z',

  // Caveira Gaster estilizada com órbitas marcadas
  skull: 'M12 2C7 2 3 6 3 11c0 3 1.5 5.5 3 7v3h12v-3c1.5-1.5 3-4 3-7 0-5-4-9-9-9zm-3.5 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',

  // Osso de Undertale
  bone: 'M4 6a2.5 2.5 0 0 0 2.5 2.5c.3 0 .6-.1.8-.2l9.4 0c.2.1.5.2.8.2A2.5 2.5 0 1 0 15 6a2.5 2.5 0 0 0-2.5-2.5c-.3 0-.6.1-.8.2H7.3c-.2-.1-.5-.2-.8-.2A2.5 2.5 0 0 0 4 6z',

  // Relâmpago elétrico cinemático
  lightning: 'M13 1L3 13h7l-2 10 11-13h-7l2-9z',

  // Anel supersônico com furo concêntrico
  ring: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12z',

  // Diamante facetado
  diamond: 'M6 2l12 0 6 7-12 13-12-13 6-7z',

  // Punho de impacto (Soco Sério)
  fist: 'M7 6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a3 3 0 0 1-3-3v-7a2 2 0 0 1 2-2z',

  // Adaga / Agulha Pura de Hollow Knight
  sword: 'M12 2l2 4-1 12 2 2-2 2-1-2-1 2-2-2 2-2-1-12z',

  // Labareda de fogo viva
  flame: 'M12 2c1 3 4 5 4 9a6 6 0 0 1-12 0c0-3 2-6 4-8 0 3 2 5 4 5 0-2 0-4 0-6z',

  // Estrela cósmica de 4 pontas
  star: 'M12 1l2.5 7.5L22 11l-7.5 2.5L12 21l-2.5-7.5L2 11l7.5-2.5z',

  // Jato / Nuvem de vapor
  steam: 'M6 14a4 4 0 0 1 4-4 5 5 0 0 1 7 1 3 3 0 0 1 3 3 4 4 0 0 1-4 4H8a4 4 0 0 1-2-4z',

  // Espiral de domínio
  spiral: 'M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 8 8 0 0 0 8-8 6 6 0 0 0-6-6 4 4 0 0 0-4 4 2 2 0 0 0 2 2',
} as const;

export const VECTOR_SHAPES: Record<keyof typeof VECTOR_PATHS, Path2D> = {
  bat: createPath(VECTOR_PATHS.bat),
  skull: createPath(VECTOR_PATHS.skull),
  bone: createPath(VECTOR_PATHS.bone),
  lightning: createPath(VECTOR_PATHS.lightning),
  ring: createPath(VECTOR_PATHS.ring),
  diamond: createPath(VECTOR_PATHS.diamond),
  fist: createPath(VECTOR_PATHS.fist),
  sword: createPath(VECTOR_PATHS.sword),
  flame: createPath(VECTOR_PATHS.flame),
  star: createPath(VECTOR_PATHS.star),
  steam: createPath(VECTOR_PATHS.steam),
  spiral: createPath(VECTOR_PATHS.spiral),
};
