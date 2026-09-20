import { GameState } from '../types';
import { calculatePPM } from '../utils/formatting';

export interface AntiCheatValidationResult {
  flagged: boolean;
  reason?: string;
  ppm: number;
}

/**
 * Validação de sanidade e anomalias estatísticas para digitação e economia de bytes.
 * - PPM humanamente impossível (> 200 PPM contínuo com mais de 30 segundos de jogo)
 * - Bytes ganhos desproporcionais em relação ao tempo e palavras digitadas
 * - Bytes negativos ou não numéricos
 */
export function validateStateSanity(
  state: GameState,
  previousState?: GameState | null,
  elapsedSecondsSinceLastSync?: number
): AntiCheatValidationResult {
  const ppm = calculatePPM(state.correctKeys, state.totalActiveSeconds);

  // 1. Verificação de velocidade de digitação humana (PPM > 200 com volume estatístico)
  if (state.totalActiveSeconds >= 30 && ppm > 200) {
    return {
      flagged: true,
      reason: `Velocidade anormal detectada: ${ppm} PPM contínuo em ${state.totalActiveSeconds}s.`,
      ppm
    };
  }

  // 2. Verificação de integridade numérica
  if (!Number.isFinite(state.bytes) || !Number.isFinite(state.totalBytesEarned) || state.bytes < 0 || state.totalBytesEarned < 0) {
    return {
      flagged: true,
      reason: `Inconsistência de valores numéricos de bytes ou saldo negativo.`,
      ppm
    };
  }

  // 3. Verificação de ganho de bytes vs taxa teórica máxima entre sincronizações
  if (previousState && elapsedSecondsSinceLastSync && elapsedSecondsSinceLastSync > 0) {
    const bytesDelta = state.totalBytesEarned - previousState.totalBytesEarned;
    const wordsDelta = Math.max(0, state.wordsCompleted - previousState.wordsCompleted);
    const charsDelta = Math.max(0, state.correctKeys - previousState.correctKeys);

    // Estimativa máxima generosa:
    // Passivo máximo com prestígio + bônus de combo máximo (x3) + bônus de desafios
    const prestigeMult = 1 + (state.prestigeCores || 0) * 0.2;
    const maxPassivePerSec = (state.autoBytesPerSec || 0) * prestigeMult;
    const maxPossiblePassive = maxPassivePerSec * (elapsedSecondsSinceLastSync * 1.5);

    // Ativo máximo: cada tecla com combo e multiplicador
    const maxActivePerChar = (state.bytesPerChar || 1) * 4 * prestigeMult;
    const maxPossibleActive = charsDelta * maxActivePerChar + wordsDelta * 10000;

    const theoreticalMax = maxPossiblePassive + maxPossibleActive + 50000; // margem generosa para bônus de nível

    if (bytesDelta > theoreticalMax && bytesDelta > 100000) {
      return {
        flagged: true,
        reason: `Salto de bytes suspeito: Ganho de ${Math.round(bytesDelta)} B excede o limite teórico (${Math.round(theoreticalMax)} B).`,
        ppm
      };
    }
  }

  return {
    flagged: false,
    ppm
  };
}
