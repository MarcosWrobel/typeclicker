// Suporte e normalização de acentuação para teclado ABNT2 no laboratório e navegadores modernos
// Suporta teclas mortas (Dead keys), composição IME e digitação sequencial

export const ACCENT_MAP: Record<string, Record<string, string>> = {
  // Acento Agudo (´) e apóstrofo (') para teclados US-Intl
  '´': { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', c: 'ç', A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú', C: 'Ç' },
  "'": { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', c: 'ç', A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú', C: 'Ç' },
  // Til (~)
  '~': { a: 'ã', o: 'õ', n: 'ñ', A: 'Ã', O: 'Õ', N: 'Ñ' },
  // Circunflexo (^)
  '^': { a: 'â', e: 'ê', i: 'î', o: 'ô', u: 'û', A: 'Â', E: 'Ê', I: 'Î', O: 'Ô', U: 'Û' },
  // Crase (`)
  '`': { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù', A: 'À', E: 'È', I: 'Ì', O: 'Ò', U: 'Ù' },
  // Trema (¨)
  '¨': { u: 'ü', U: 'Ü' }
};

export const STANDALONE_ACCENTS = ['´', "'", '~', '^', '`', '¨'];

/**
 * Identifica se a tecla pressionada é uma tecla de acento isolada
 */
export function isAccentKey(key: string): boolean {
  return STANDALONE_ACCENTS.includes(key);
}

/**
 * Resolve qual acento foi pressionado mesmo quando o navegador emite e.key === 'Dead'
 */
export function resolveDeadKey(e: KeyboardEvent, targetChar?: string): string | null {
  if (e.key === 'Dead') {
    // 1. Pelo código físico da tecla ABNT2 / US-Intl
    if (e.code === 'BracketLeft' || e.code === 'Quote') {
      return e.shiftKey ? '`' : '´';
    }
    if (e.code === 'BracketRight' || e.code === 'Backquote') {
      return e.shiftKey ? '^' : '~';
    }
    if (e.code === 'Equal' || e.code === 'Digit6') {
      return '^';
    }

    // 2. Pelo contexto pedagógico da letra esperada na palavra
    if (targetChar) {
      const lower = targetChar.toLocaleLowerCase('pt-BR');
      if (['á', 'é', 'í', 'ó', 'ú'].includes(lower)) return '´';
      if (['ã', 'õ'].includes(lower)) return '~';
      if (['â', 'ê', 'ô'].includes(lower)) return '^';
      if (['à'].includes(lower)) return '`';
    }

    return '´';
  }

  if (isAccentKey(e.key)) {
    return e.key;
  }

  return null;
}

/**
 * Combina o acento pendente com a vogal digitada
 */
export function combineAccent(accent: string, char: string): string {
  const table = ACCENT_MAP[accent];
  if (table && table[char]) {
    return table[char];
  }
  return char;
}

/**
 * Nome legível para orientar estudantes de 12 anos em sala de aula
 */
export function getAccentDisplayName(accent: string): string {
  switch (accent) {
    case '´':
    case "'":
      return 'Acento Agudo ( ´ )';
    case '~':
      return 'Til ( ~ )';
    case '^':
      return 'Circunflexo ( ^ )';
    case '`':
      return 'Crase ( ` )';
    case '¨':
      return 'Trema ( ¨ )';
    default:
      return `Acento ( ${accent} )`;
  }
}
