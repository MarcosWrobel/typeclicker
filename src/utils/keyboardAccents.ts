import type React from 'react';

// Suporte e normalização de acentuação para teclado ABNT2 no laboratório e navegadores modernos
// Suporta teclas mortas (Dead keys), composição IME e digitação sequencial

export const ACCENT_MAP: Record<string, Record<string, string>> = {
  // Acento Agudo (´) e apóstrofo (') para teclados US-Intl
  '´': { ' ': '´', '´': '´', "'": '´', a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', c: 'ç', A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú', C: 'Ç' },
  "'": { ' ': "'", "'": "'", '´': "'", a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', c: 'ç', A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú', C: 'Ç' },
  // Til (~)
  '~': { ' ': '~', '~': '~', a: 'ã', o: 'õ', n: 'ñ', A: 'Ã', O: 'Õ', N: 'Ñ' },
  // Circunflexo (^)
  '^': { ' ': '^', '^': '^', a: 'â', e: 'ê', i: 'î', o: 'ô', u: 'û', A: 'Â', E: 'Ê', I: 'Î', O: 'Ô', U: 'Û' },
  // Crase (`)
  '`': { ' ': '`', '`': '`', a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù', A: 'À', E: 'È', I: 'Ì', O: 'Ò', U: 'Ù' },
  // Trema (¨)
  '¨': { ' ': '¨', '¨': '¨', u: 'ü', U: 'Ü' }
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
export function resolveDeadKey(e: KeyboardEvent | React.KeyboardEvent | any, targetChar?: string): string | null {
  const evt = e?.nativeEvent || e;
  const key = evt?.key || e?.key;
  const code = evt?.code || e?.code;
  const shiftKey = !!(evt?.shiftKey ?? e?.shiftKey);

  // 1. Pelo contexto pedagógico da letra esperada na palavra (MAIOR PRECISÃO)
  if (targetChar) {
    const lower = targetChar.toLocaleLowerCase('pt-BR');
    if (['á', 'é', 'í', 'ó', 'ú', 'ç', '´', "'"].includes(lower)) return '´';
    if (['ã', 'õ', '~'].includes(lower)) return '~';
    if (['â', 'ê', 'î', 'ô', 'û', '^'].includes(lower)) return '^';
    if (['à', 'è', 'ì', 'ò', 'ù', '`'].includes(lower)) return '`';
    if (['ü', '¨'].includes(lower)) return '¨';
  }

  if (key === 'Dead') {
    // 2. Pelo código físico da tecla ABNT2 / US-Intl no Linux, Windows e macOS
    // ABNT2: tecla ao lado do Ç é [~ / ^] (BracketRight ou Quote no Linux/X11)
    if (code === 'BracketRight') {
      return shiftKey ? '^' : '~';
    }
    // No Linux X11/Wayland com ABNT2, a tecla física [~ / ^] frequentemente emite code: 'Quote'!
    // Com Shift pressionado, é indubitavelmente CIRCUNFLEXO (^)
    if (code === 'Quote') {
      return shiftKey ? '^' : '´';
    }

    // ABNT2: tecla ao lado do P é [´ / `] (BracketLeft)
    if (code === 'BracketLeft') {
      return shiftKey ? '`' : '´';
    }

    // Tecla antes do número 1 (Backquote): no ABNT2 é [' / "], no US-Intl é [` / ~]
    if (code === 'Backquote') {
      return shiftKey ? '~' : '`';
    }

    // Atalhos numéricos com Shift (^ no 6 em teclados US-Intl)
    if (code === 'Digit6') {
      return '^';
    }
    if (code === 'Equal') {
      return shiftKey ? '+' : '=';
    }
    if (code === 'Tilde') {
      return shiftKey ? '^' : '~';
    }

    // Se shiftKey estiver ativo e não foi mapeado antes, grande probabilidade de ser circunflexo
    return shiftKey ? '^' : '´';
  }

  if (isAccentKey(key)) {
    return key;
  }

  return null;
}

/**
 * Combina o acento pendente com a vogal digitada
 */
export function combineAccent(accent: string, char: string): string {
  if (!accent || !char) return char;
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
