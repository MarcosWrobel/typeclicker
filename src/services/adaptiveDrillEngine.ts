import { KeyTelemetry, WeakKeyReport, DrillSession, CategoryId } from '../types';
import { WORD_CATEGORIES } from '../data/words';

/**
 * Constantes e Parâmetros Pedagógicos
 */
const MIN_KEY_ATTEMPTS = 3; // Amostragem mínima para evitar falsos positivos
const WEIGHT_ERROR_RATE = 0.7; // 70% do peso para taxa de erro
const WEIGHT_LATENCY = 0.3; // 30% do peso para tempo de reação (ms)
const IDT_ALERT_THRESHOLD = 0.25; // Limiar para considerar a tecla fraca/crítica

/**
 * Calcula o Índice de Dificuldade da Tecla (IDT)
 * IDT = (Erros / Total) * 0.7 + (TempoMédioMs / 1000) * 0.3
 */
export function calcularIDT(hits: number, misses: number, totalTimeMs: number): number {
  const total = hits + misses;
  if (total === 0) return 0;

  const errorRate = misses / total;
  const avgTimeMs = totalTimeMs / total;

  const idt = (errorRate * WEIGHT_ERROR_RATE) + ((avgTimeMs / 1000) * WEIGHT_LATENCY);
  return Math.round(idt * 1000) / 1000;
}

/**
 * Analisa a telemetria do aluno e identifica as teclas com maior dificuldade motora
 */
export function identificarTeclasFracas(
  telemetry?: Record<string, KeyTelemetry> | null,
  maxKeys: number = 3
): WeakKeyReport[] {
  if (!telemetry || typeof telemetry !== 'object') {
    return [];
  }

  const reports: WeakKeyReport[] = [];

  for (const [rawChar, stats] of Object.entries(telemetry)) {
    const char = rawChar.toLowerCase();
    // Ignora espaços ou entradas inválidas
    if (!char || char === ' ' || char === '␣') continue;

    const hits = Number.isFinite(stats.hits) ? stats.hits : 0;
    const misses = Number.isFinite(stats.misses) ? stats.misses : 0;
    const totalTimeMs = Number.isFinite(stats.totalTimeMs) ? stats.totalTimeMs : 0;
    const total = hits + misses;

    // Amostragem mínima
    if (total < MIN_KEY_ATTEMPTS) continue;

    const errorRate = misses / total;
    const avgTimeMs = Math.round(totalTimeMs / total);
    const idt = calcularIDT(hits, misses, totalTimeMs);

    // Considera fraca se houver taxa de erro relevante ou latência excessiva
    if (idt >= IDT_ALERT_THRESHOLD || errorRate >= 0.15 || avgTimeMs > 650) {
      reports.push({
        char,
        hits,
        misses,
        total,
        errorRate: Math.round(errorRate * 100) / 100,
        avgTimeMs,
        idt
      });
    }
  }

  // Ordena decrescente pelo IDT (maior dificuldade primeiro)
  reports.sort((a, b) => b.idt - a.idt);

  return reports.slice(0, maxKeys);
}

/**
 * Gera blocos procedurais mecânicos para consolidação de memória muscular
 * Ex: tecla 't' -> ['ttt', 'tat', 'tet', 'tot']
 */
export function gerarPadraoRepeticao(tecla: string): string[] {
  const t = tecla.toLowerCase();
  const vowels = ['a', 'e', 'o', 'i', 'u'];

  // Se a tecla alvo for vogal, alterna com consoantes base
  if (vowels.includes(t)) {
    return [
      `${t}${t}${t}`,
      `d${t}d`,
      `s${t}s`,
      `f${t}f`
    ];
  }

  // Se a tecla for acento ou cedilha
  if (t === 'ç') {
    return ['aça', 'aço', 'peça', 'laço'];
  }

  // Consoante padrão: tríade + alternância com vogais
  return [
    `${t}${t}${t}`,
    `${t}a${t}`,
    `${t}e${t}`,
    `${t}o${t}`
  ];
}

/**
 * Seleciona palavras reais do currículo pedagógico que contenham as teclas críticas
 */
export function encontrarPalavrasRelevantes(
  teclasAlvo: string[],
  categoryId: CategoryId = 'iniciante',
  maxWords: number = 6
): string[] {
  if (teclasAlvo.length === 0) return [];

  const targets = teclasAlvo.map(k => k.toLowerCase());

  // Coleta vocabulário prioritário: categoria ativa + iniciante/fácil para foco motor sem sobrecarga
  const availableCategories = WORD_CATEGORIES.filter(
    c => c.id === categoryId || c.id === 'iniciante' || c.id === 'facil'
  );

  const wordPool: string[] = [];
  for (const cat of availableCategories) {
    wordPool.push(...cat.words);
  }

  // Remove duplicatas
  const uniqueWords = Array.from(new Set(wordPool));

  // Filtra palavras que contenham ao menos uma das teclas-alvo
  const scoredWords: { word: string; score: number }[] = [];

  for (const word of uniqueWords) {
    const lower = word.toLowerCase();
    let score = 0;
    for (const t of targets) {
      // Conta quantas vezes a letra alvo aparece na palavra
      const occurrences = lower.split(t).length - 1;
      score += occurrences * 2;
    }

    if (score > 0) {
      // Favorece palavras mais curtas e diretas para treino de reabilitação (3 a 7 letras)
      if (word.length >= 3 && word.length <= 7) {
        score += 3;
      }
      scoredWords.push({ word, score });
    }
  }

  // Ordena por pontuação com leve variação
  scoredWords.sort((a, b) => b.score - a.score);

  return scoredWords.slice(0, maxWords).map(item => item.word);
}

/**
 * Orquestra e sintetiza uma sessão completa de Treino Corretivo Adaptativo
 */
export function gerarTreinoAdaptativo(
  telemetry: Record<string, KeyTelemetry>,
  categoryId: CategoryId = 'iniciante',
  customTargetKeys?: string[]
): DrillSession | null {
  let targetKeys: string[] = [];

  if (customTargetKeys && customTargetKeys.length > 0) {
    targetKeys = customTargetKeys.map(k => k.toLowerCase());
  } else {
    const weakReports = identificarTeclasFracas(telemetry, 3);
    targetKeys = weakReports.map(r => r.char);
  }

  if (targetKeys.length === 0) {
    return null;
  }

  // 1. Gera blocos mecânicos de memória muscular (1 a 2 padrões por tecla)
  const mechanicalBlocks: string[] = [];
  for (const key of targetKeys) {
    const patterns = gerarPadraoRepeticao(key);
    mechanicalBlocks.push(...patterns.slice(0, 2));
  }

  // 2. Se houver mais de uma tecla, gera padrão cruzado (ex: t e p -> 'tpt')
  if (targetKeys.length >= 2) {
    const k1 = targetKeys[0];
    const k2 = targetKeys[1];
    mechanicalBlocks.push(`${k1}${k2}${k1}`);
  }

  // 3. Encontra palavras reais contextualizadas no vocabulário pedagógico
  const contextualWords = encontrarPalavrasRelevantes(targetKeys, categoryId, 6);

  // 4. Concatena: blocos motores de calibração primeiro, seguidos de palavras reais
  const drillWords = [...mechanicalBlocks, ...contextualWords];

  if (drillWords.length === 0) {
    return null;
  }

  return {
    targetKeys,
    drillWords,
    currentIndex: 0,
    totalWords: drillWords.length,
    startedAt: Date.now()
  };
}
