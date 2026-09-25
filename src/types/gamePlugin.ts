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

export type StudentRpgClass = RpgClassType; // alias pedagógico para o guia dos alunos

// ─────────────────────────────────────────────────────────────
// Métricas brutas de uma sessão de jogo.
// O jogo preenche estes campos; o Hub normaliza os bytes finais.
// ─────────────────────────────────────────────────────────────
export interface GameSessionStats {
  /** Pontuação interna do jogo (escala livre por plug-in) */
  score: number;
  /** Acurácia percentual [0–100] */
  accuracyPercentage: number;
  /** Duração total da sessão em segundos */
  timeSpentSeconds: number;
  /** Acertos contabilizados */
  correctAnswers: number;
  /** Erros contabilizados */
  wrongAnswers: number;
  /** Fase/nível atingido (opcional) */
  levelReached?: number;
  /** Métricas extras livres por plug-in (ex.: wave, enemiesDefeated, combo…) */
  extraMetrics?: Record<string, number | string>;
}

// ─────────────────────────────────────────────────────────────
// Payload de saída — único ponto de retorno de todo plug-in.
//
// IMPORTANTE: bytesEarned é uma SUGESTÃO do plug-in.
// O Hub aplica a fórmula de normalização antes de creditar:
//   finalBytes = min(bytesEarned, timeSpentSeconds × BYTES_PER_SEC_CAP × accuracyFactor)
// Isso garante que nenhum jogo infle a economia, independente
// da fórmula interna usada pelo aluno.
// ─────────────────────────────────────────────────────────────
export interface GameExitPayload {
  /** Bytes sugeridos pelo jogo (o Hub pode recortar) */
  bytesEarned: number;
  /** Fichas cosméticas (levelTokens) ganhas na sessão — ex.: 1 ficha por vitória acima de 80% */
  levelTokensEarned?: number;
  /** Moedas de duelo (duelTokens) — apenas para modos versus/arena */
  duelTokensEarned?: number;
  /** Métricas brutas da sessão para histórico e normalização */
  sessionStats: GameSessionStats;
}

// ─────────────────────────────────────────────────────────────
// Contrato de entrada obrigatório para todos os plug-ins.
//
// Regras invioláveis:
//   1. onExitToHub — único ponto de saída; sempre chamado ao encerrar,
//      independente de vitória ou derrota.
//   2. Sem Firebase — PROIBIDO importar firebaseService, db, setDoc ou getDoc.
//      O Hub cuida de toda persistência via useGameSync (throttle 60 s).
//   3. Ciclo de vida limpo — TODO plug-in DEVE limpar no retorno do useEffect:
//        - cancelAnimationFrame / clearInterval / clearTimeout
//        - OscillatorNode.stop() e AudioContext.close()
//        - window.removeEventListener para qualquer listener global
//   4. Sem assets externos — sem .mp3, .ogg, fontes remotas ou CDN.
//      Áudio via Web Audio API procedural; ícones via lucide-react.
// ─────────────────────────────────────────────────────────────
export interface BaseGameProps {
  /** Classe RPG do aluno — pode influenciar bônus in-game */
  studentClass?: StudentRpgClass;
  /**
   * Multiplicador de dificuldade injetado pelo Hub.
   * 0.8 = fácil · 1.0 = normal · 1.25 = desafiador
   */
  difficultyMultiplier?: number;
  /** Callback de encerramento — único ponto de saída do plug-in */
  onExitToHub: (payload: GameExitPayload) => void;
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
  /** Melhor onda/fase atingida (se aplicável) */
  wave?: number;
  /** PPM médio registrado na sessão */
  wpm: number;
  /** Acurácia percentual [0–100] */
  accuracy: number;
  /** Bytes efetivamente creditados em GameState após normalização do Hub */
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
