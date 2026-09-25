import { RpgClassType } from './rpgClass';

// ─────────────────────────────────────────────────────────────
// Identificadores canônicos de todos os minijogos da plataforma
// ─────────────────────────────────────────────────────────────
export type GameId =
  | 'typeclicker'
  | 'type_radar'
  | 'byte_logic'
  | 'math_storm'
  | 'syntax_maze';

// ─────────────────────────────────────────────────────────────
// Contrato obrigatório para todos os minijogos do hub.
//
// Regras de uso:
//   1. onExitToHub  — único ponto de saída; sempre chamado ao encerrar,
//      independente de vitória ou derrota. Retorna bytes ganhos na sessão
//      e métricas específicas do jogo (tipadas livremente por cada plugin).
//   2. onLevelTokenEarned — opcional; chamado apenas se o jogo concede
//      Fichas diretamente (ex.: bônus de conclusão de fase).
//   3. Ciclo de vida de recursos — TODO plug-in DEVE limpar:
//        - OscillatorNode / AudioContext (audioContext.close())
//        - requestAnimationFrame (cancelAnimationFrame no cleanup do useEffect)
//   4. Persistência — PROIBIDO chamar setDoc/updateDoc por fase individual.
//      Acumule progresso em memória; o useGameSync global (throttle 60 s)
//      cuidará da sincronização com o Firestore.
// ─────────────────────────────────────────────────────────────
export interface GamePluginProps {
  /** UID e nome de exibição do aluno autenticado */
  user: { uid: string; displayName: string };
  /** Classe RPG escolhida pelo aluno; pode influenciar bônus em-jogo */
  playerClass: RpgClassType;
  /**
   * Callback chamado ao encerrar o minijogo.
   * @param bytesEarned  Bytes ganhos nesta sessão (creditados em GameState.bytes)
   * @param sessionStats Objeto livre com métricas específicas do plug-in
   *                     (ex.: wave, score, accuracy, enemiesDefeated…)
   */
  onExitToHub: (bytesEarned: number, sessionStats: Record<string, unknown>) => void;
  /** Callback opcional para crédito direto de Fichas (levelTokens) */
  onLevelTokenEarned?: (tokens: number) => void;
}

// ─────────────────────────────────────────────────────────────
// Registro de uma partida arcade individual (qualquer minijogo).
// Persistido em GameState.arcadeHistory (array circular, máx 10).
// ─────────────────────────────────────────────────────────────
export interface ArcadeMatchRecord {
  /** Identificador do minijogo que originou o registro */
  gameId: GameId;
  /** Score final da partida (escala varia por jogo) */
  score: number;
  /** Melhor onda/fase atingida na partida (se aplicável) */
  wave?: number;
  /** PPM médio registrado na sessão */
  wpm: number;
  /** Acurácia percentual [0–100] */
  accuracy: number;
  /** Bytes creditados em GameState após a partida */
  bytesEarned: number;
  /** Timestamp epoch (ms) do encerramento da partida */
  playedAt: number;
}

// ─────────────────────────────────────────────────────────────
// Stubs de estatísticas cumulativas por minijogo (opcional;
// campos desconhecidos são ignorados em saves antigos).
// ─────────────────────────────────────────────────────────────
export interface LogicStats {
  totalGames: number;
  highScore: number;
  maxLevelReached: number;
  totalGatesCleared: number;
}

export interface MathStats {
  totalGames: number;
  highScore: number;
  maxWaveReached: number;
  totalEquationsSolved: number;
  bestAccuracy: number;
}

export interface SyntaxStats {
  totalGames: number;
  highScore: number;
  maxRoomsCleared: number;
  totalSnippetsSolved: number;
}
