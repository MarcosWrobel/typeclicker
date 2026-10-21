// ─────────────────────────────────────────────────────────────
// Definições de Tipos para o SheetQuest: Mestre das Planilhas
// ─────────────────────────────────────────────────────────────

export type CellFormat = 'text' | 'number' | 'currency' | 'percent' | 'badge';

export interface SheetCellData {
  /** Valor bruto ou fórmula (ex: '=SOMA(B2:B6)' ou '500') */
  raw: string | number;
  /** Valor calculado exibido */
  display?: string | number;
  /** Formatação visual */
  format?: CellFormat;
  /** Se a célula é apenas para leitura (dados prévios) */
  readOnly?: boolean;
  /** Se esta célula é uma célula-alvo do desafio que o aluno precisa calcular */
  isTarget?: boolean;
  /** Estilo de alinhamento */
  align?: 'left' | 'center' | 'right';
  /** Cor de destaque ou categoria (opcional) */
  badgeColor?: string;
}

/** Tabela bidirecional: linha -> coluna -> célula */
export type SheetGridData = Record<string, SheetCellData>; // chave é 'A1', 'B2', etc.

export interface TargetCellRule {
  /** Coordenada da célula (ex: 'B7' ou 'C10') */
  coord: string;
  /** Título do objetivo (ex: 'Faturamento Total da Loja') */
  label: string;
  /** Dica pedagógica curta */
  hint: string;
  /** Explicação didática detalhada caso erre */
  explanation: string;
  /** Valor numérico ou string exato esperado */
  expectedValue: number | string;
  /** Função recomendada para 3 estrelas (ex: 'SOMA', 'MÉDIA', 'PROCV', 'SE') */
  requiredFunction?: string;
  /** Referências esperadas que devem ser mencionadas na fórmula (ex: ['B2:B6']) */
  expectedReferences?: string[];
  /** Se permite operadores matemáticos diretos (+, -, *, /) como alternativa */
  allowArithmetic?: boolean;
  /** Fórmula exata recomendada para resolver este alvo (ex: '=SOMA(B2:B6)') */
  solutionFormula?: string;
}

export type SheetGameMode = 'campaign' | 'bug_hunter' | 'infinite';

export interface SheetLevel {
  id: number;
  world: number;
  worldName: string;
  title: string;
  scenario: string;
  clientName: string;
  clientRole: string;
  clientAvatar: string;
  briefing: string;
  tipTitle: string;
  tipContent: string;
  cheatSheetFormula: string;
  numColumns: number; // ex: 5 (A-E)
  numRows: number;    // ex: 8 (1-8)
  initialGrid: SheetGridData;
  targets: TargetCellRule[];
  /** Valores de teste para a mutação anti-hardcode (coluna -> valor mutado) */
  mutationTest?: {
    mutations: Record<string, number | string>;
    expectedRecalculations: Record<string, number | string>;
  };
}

export interface SheetBugLevel {
  id: number;
  title: string;
  errorCode: string; // ex: '#DIV/0!', '#NOME?', '#VALOR!', '#ERRO!'
  clientName: string;
  scenario: string;
  briefing: string;
  buggyCoord: string;
  initialBuggyFormula: string;
  tip: string;
  numColumns: number;
  numRows: number;
  initialGrid: SheetGridData;
  target: TargetCellRule;
}

export interface FormulaEvaluationResult {
  value: number | string;
  error?: string; // '#ERRO!', '#NOME?', '#DIV/0!', '#VALOR!', '#REF!', '#N/D'
  errorMessage?: string;
  referencedCoords: string[];
}
