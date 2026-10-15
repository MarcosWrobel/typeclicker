// ─────────────────────────────────────────────────────────────
// Banco de Palavras do ByteQuest: Masmorra de Sobrevivência
// Progressão Estrita por Tamanho de Palavra:
//   - Tier 1 (3-4 letras): Monstros iniciais e slimes
//   - Tier 2 (5-6 letras): Esqueletos e combatentes médios
//   - Tier 3 (7-8 letras): Gárgulas e mini-chefes
//   - Tier 4 (9-10+ letras com acentuação ABNT2): Chefes e monstros de elite
// ─────────────────────────────────────────────────────────────

export const BYTE_QUEST_WORDS_TIER1: string[] = [
  'sol', 'lua', 'mar', 'paz', 'ceu', 'rei', 'eco', 'voz',
  'runa', 'arco', 'fogo', 'raio', 'dado', 'lama', 'alma', 'cura',
  'nano', 'ouro', 'gelo', 'dano', 'vida', 'onda', 'muro', 'chip',
  'base', 'luz', 'flux', 'seta', 'fio', 'byte', 'link', 'core',
  'puro', 'nodo', 'alvo', 'asa', 'pes', 'teia', 'sala', 'vale'
];

export const BYTE_QUEST_WORDS_TIER2: string[] = [
  'espada', 'escudo', 'plasma', 'espect', 'trovao', 'portal',
  'lamina', 'flecha', 'mestre', 'nucleo', 'crista', 'armada',
  'feitiço', 'magico', 'sombras', 'abismo', 'gargula', 'cajado',
  'filtro', 'codigo', 'matriz', 'pacote', 'buffer', 'thread',
  'prisma', 'reparo', 'torre', 'força', 'impact', 'flecha',
  'anel', 'rubi', 'safira', 'esfera', 'troféu', 'blind'
];

export const BYTE_QUEST_WORDS_TIER3: string[] = [
  'guerreiro', 'arqueiro', 'feiticeiro', 'cavaleiro', 'sentinela',
  'fortaleza', 'tempestade', 'catacumba', 'guardiao', 'overclock',
  'protocolo', 'segurança', 'firewall', 'algoritmo', 'interface',
  'conector', 'terminal', 'retaliação', 'disciplina', 'explosivo',
  'pesadelo', 'muralhas', 'ancestral', 'corrompido', 'titanico'
];

export const BYTE_QUEST_WORDS_TIER4: string[] = [
  'criptografia', 'singularidade', 'ressurreição', 'encantamento',
  'indestrutivel', 'superaquecimento', 'vulnerabilidade', 'processamento',
  'leopoldina', 'transmissão', 'sincronização', 'computacional',
  'invulneravel', 'convergencia', 'infraestrutura', 'autenticação',
  'desenvolvimento', 'interoperavel', 'programadores', 'revolucionario'
];

/**
 * Retorna uma palavra aleatória adequada para a fase/minuto atual
 */
export function getWordForDifficulty(phase: number): string {
  let pool = BYTE_QUEST_WORDS_TIER1;
  if (phase >= 4) {
    // Fase final / chefão: prioriza palavras longas
    pool = Math.random() < 0.7 ? BYTE_QUEST_WORDS_TIER4 : BYTE_QUEST_WORDS_TIER3;
  } else if (phase === 3) {
    // Fase 3 / gárgulas: tier 3 e tier 2
    pool = Math.random() < 0.65 ? BYTE_QUEST_WORDS_TIER3 : BYTE_QUEST_WORDS_TIER2;
  } else if (phase === 2) {
    // Fase 2: tier 2 e tier 1
    pool = Math.random() < 0.6 ? BYTE_QUEST_WORDS_TIER2 : BYTE_QUEST_WORDS_TIER1;
  } else {
    // Fase 1: tier 1
    pool = BYTE_QUEST_WORDS_TIER1;
  }

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
