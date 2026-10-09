/**
 * Gerador de números pseudo-aleatórios determinístico (PRNG) Mulberry32.
 * Garante que sementes idênticas gerem a exata mesma sequência de obstáculos
 * em todos os computadores dos alunos participantes da corrida multiplayer.
 */
export function createPrng(seed: number): () => number {
  let s = Math.floor(Math.abs(seed)) || 1337;
  return function mulberry32(): number {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Converte qualquer texto de código de sala (ex: "DASH", "RACE") em uma semente numérica determinística.
 */
export function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash) || 12345;
}
