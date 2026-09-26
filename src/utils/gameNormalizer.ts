import { GameExitPayload } from '../types/gamePlugin';

/**
 * Teto de bytes por segundo padrão da economia do TypeClicker.
 * Evita inflação excessiva por plugins de jogos ou fórmulas customizadas de alunos.
 */
export const DEFAULT_BYTES_PER_SEC_CAP = 350;

/**
 * Normaliza a recompensa de bytes recebida de um plug-in de jogo.
 * Conforme o contrato pedagógico do Hub (src/types/gamePlugin.ts):
 *   finalBytes = min(bytesEarned, timeSpentSeconds × BYTES_PER_SEC_CAP × accuracyFactor)
 */
export function normalizePluginBytes(
  payload: GameExitPayload,
  bytesPerSecCap: number = DEFAULT_BYTES_PER_SEC_CAP
): number {
  const suggestedBytes = Math.max(0, Math.floor(payload.bytesEarned || 0));
  const { sessionStats } = payload;

  if (!sessionStats) {
    return suggestedBytes;
  }

  const timeSpentSeconds = Math.max(1, Math.round(Number(sessionStats.timeSpentSeconds) || 1));
  const accuracy = Math.min(100, Math.max(0, Number(sessionStats.accuracyPercentage) || 0));
  const accuracyFactor = Math.max(0.3, accuracy / 100);

  const maxAllowedBytes = Math.round(timeSpentSeconds * bytesPerSecCap * accuracyFactor);

  return Math.min(suggestedBytes, maxAllowedBytes);
}
