import { useState, useEffect } from 'react';

export interface CaseMismatchResult {
  isMismatch: boolean;
  expectedType?: 'uppercase' | 'lowercase';
  targetChar?: string;
  message?: string;
}

/**
 * Hook React que escuta e rastreia o estado da tecla Caps Lock no sistema operacional.
 * Compatível com Windows, Linux, macOS, Android e Chromebooks.
 */
export function useCapsLock(): boolean {
  const [isCapsLock, setIsCapsLock] = useState<boolean>(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (typeof e.getModifierState === 'function') {
        const caps = e.getModifierState('CapsLock');
        setIsCapsLock(caps);
      }
    };

    window.addEventListener('keydown', handleKey, true);
    window.addEventListener('keyup', handleKey, true);

    return () => {
      window.removeEventListener('keydown', handleKey, true);
      window.removeEventListener('keyup', handleKey, true);
    };
  }, []);

  return isCapsLock;
}

/**
 * Analisa se um caractere digitado diverge do esperado exclusivamente por sua caixa (maiúscula vs minúscula).
 * Fornece mensagem e orientação pedagógica imediata para o aluno.
 */
export function checkCaseMismatch(typedChar: string, expectedChar: string): CaseMismatchResult {
  if (!typedChar || !expectedChar) {
    return { isMismatch: false };
  }

  // Se são idênticos, não há erro
  if (typedChar === expectedChar) {
    return { isMismatch: false };
  }

  const typedLower = typedChar.toLocaleLowerCase('pt-BR');
  const expectedLower = expectedChar.toLocaleLowerCase('pt-BR');

  // Se as representações minúsculas são idênticas, o erro é EXCLUSIVAMENTE de caixa (Case Mismatch)!
  if (typedLower === expectedLower) {
    const isExpectedUpper = expectedChar !== expectedLower;

    if (isExpectedUpper) {
      return {
        isMismatch: true,
        expectedType: 'uppercase',
        targetChar: expectedChar,
        message: `🔠 Letra MAIÚSCULA necessária! Pressione Shift + ${expectedChar.toUpperCase()}`
      };
    } else {
      return {
        isMismatch: true,
        expectedType: 'lowercase',
        targetChar: expectedChar,
        message: `🔡 Letra MINÚSCULA necessária! Desative o Caps Lock ou solte o Shift`
      };
    }
  }

  return { isMismatch: false };
}
