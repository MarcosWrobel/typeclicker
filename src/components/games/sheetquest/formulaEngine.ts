import { SheetGridData, FormulaEvaluationResult, TargetCellRule } from '../../../types/sheetQuest';

/**
 * Converte índice de coluna (0-based) em letra ('A', 'B', ...)
 */
export function colIndexToLetter(index: number): string {
  let letter = '';
  let temp = index;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

/**
 * Converte letra de coluna ('A', 'B', ...) em índice (0-based)
 */
export function letterToColIndex(letter: string): number {
  let index = 0;
  const upper = letter.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }
  return index - 1;
}

/**
 * Valida e decompõe uma coordenada de célula como 'B4' ou '$B$4'
 */
export function parseCellCoord(coord: string): { colLetter: string; colIndex: number; row: number } | null {
  const clean = coord.replace(/\$/g, '').toUpperCase().trim();
  const match = clean.match(/^([A-Z]+)([1-9][0-9]*)$/);
  if (!match) return null;
  const colLetter = match[1];
  const row = parseInt(match[2], 10);
  return {
    colLetter,
    colIndex: letterToColIndex(colLetter),
    row
  };
}

/**
 * Expande um intervalo como 'B2:B5' ou 'A1:C2' em uma lista de coordenadas individuais
 */
export function expandRange(rangeStr: string): string[] {
  const clean = rangeStr.replace(/\$/g, '').toUpperCase().trim();
  const parts = clean.split(':');
  if (parts.length === 1) {
    return [parts[0]];
  }
  if (parts.length !== 2) return [];

  const start = parseCellCoord(parts[0]);
  const end = parseCellCoord(parts[1]);
  if (!start || !end) return [];

  const minCol = Math.min(start.colIndex, end.colIndex);
  const maxCol = Math.max(start.colIndex, end.colIndex);
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);

  const coords: string[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      coords.push(`${colIndexToLetter(c)}${r}`);
    }
  }
  return coords;
}

/**
 * Extrai todas as referências de célula e intervalos em uma fórmula para color-coding
 */
const REFERENCE_COLORS = ['#38bdf8', '#a855f7', '#f59e0b', '#ec4899', '#10b981'];

export interface HighlightedRange {
  raw: string;
  rangeStr: string;
  coords: string[];
  colorIndex: number;
  color: string;
}

export function extractReferencedRanges(formula: string): HighlightedRange[] {
  if (!formula.startsWith('=')) return [];
  // Regex para capturar B2:B6 ou B2 (com suporte opcional a $)
  const regex = /(\$?[A-Za-z]+\$?[1-9][0-9]*(?::\$?[A-Za-z]+\$?[1-9][0-9]*)?)/g;
  const matches = formula.match(regex) || [];
  
  const ranges: HighlightedRange[] = [];
  const seen = new Set<string>();

  matches.forEach((rawMatch) => {
    const clean = rawMatch.toUpperCase();
    if (seen.has(clean)) return;
    seen.add(clean);

    const coords = expandRange(clean);
    if (coords.length > 0) {
      const colorIndex = ranges.length % REFERENCE_COLORS.length;
      ranges.push({
        raw: rawMatch,
        rangeStr: rawMatch,
        coords,
        colorIndex,
        color: REFERENCE_COLORS[colorIndex]
      });
    }
  });

  return ranges;
}

/**
 * Obtém o valor numérico ou textual bruto de uma célula no grid
 */
export function getCellValue(grid: SheetGridData, coord: string): string | number {
  const cell = grid[coord.toUpperCase()];
  if (!cell) return 0;
  if (cell.display !== undefined && cell.display !== '') {
    if (typeof cell.display === 'number') return cell.display;
    const num = parsePtBrNumber(String(cell.display));
    return isNaN(num) ? String(cell.display) : num;
  }
  if (typeof cell.raw === 'number') return cell.raw;
  const num = parsePtBrNumber(String(cell.raw));
  return isNaN(num) ? String(cell.raw) : num;
}

/**
 * Converte string PT-BR (com vírgula decimal) em número
 */
export function parsePtBrNumber(valStr: string): number {
  if (!valStr) return NaN;
  const trimmed = valStr.trim();
  // Se contiver vírgula como decimal (ex: "10,5" ou "1.250,50")
  if (trimmed.includes(',')) {
    const normalized = trimmed.replace(/\./g, '').replace(',', '.');
    return parseFloat(normalized);
  }
  return parseFloat(trimmed);
}

/**
 * Formata um valor numérico para padrão PT-BR (moeda, percentual, número decimal)
 */
export function formatCellValue(value: number | string, format?: string): string {
  if (typeof value === 'string') return value;
  if (isNaN(value)) return '#VALOR!';

  if (format === 'currency') {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  if (format === 'percent') {
    return (value * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
  }
  if (format === 'number') {
    return value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  }
  return Number.isInteger(value) ? value.toString() : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}

/**
 * Motor central de avaliação de fórmulas do Google Planilhas em Português
 */
export function evaluateFormula(
  formula: string,
  grid: SheetGridData,
  currentCoord?: string
): FormulaEvaluationResult {
  const trimmed = formula.trim();

  // Não é fórmula (número fixo ou texto)
  if (!trimmed.startsWith('=')) {
    const num = parsePtBrNumber(trimmed);
    return {
      value: isNaN(num) ? trimmed : num,
      referencedCoords: []
    };
  }

  const expr = trimmed.slice(1).trim();
  if (!expr) {
    return { value: 0, referencedCoords: [] };
  }

  // Detecta se usou vírgula para separar argumentos no lugar de ponto-e-vírgula
  // Exemplo: =SOMA(A1, B1) ou =SE(A1>0, "Sim", "Não")
  if (/\b[A-Za-zÇçÁáÉéÍíÓóÚúÃãÕõÂâÊêÔô]+\s*\([^)]*,[^)]*\)/.test(expr)) {
    return {
      value: '#ERRO!',
      error: '#ERRO!',
      errorMessage: 'No Google Planilhas em Português, use ponto-e-vírgula (;) para separar os argumentos, e não vírgula (,).',
      referencedCoords: []
    };
  }

  // Verifica funções em inglês comuns para dar aviso amigável
  const upperExpr = expr.toUpperCase();
  const englishToPt: Record<string, string> = {
    SUM: 'SOMA',
    AVERAGE: 'MÉDIA',
    MAX: 'MÁXIMO',
    MIN: 'MÍNIMO',
    COUNT: 'CONT.NÚM',
    COUNTA: 'CONT.VALORES',
    COUNTIF: 'CONT.SE',
    IF: 'SE',
    SUMIF: 'SOMASE',
    VLOOKUP: 'PROCV'
  };

  for (const [enFunc, ptFunc] of Object.entries(englishToPt)) {
    const reg = new RegExp(`\\b${enFunc}\\s*\\(`, 'i');
    if (reg.test(upperExpr)) {
      return {
        value: '#NOME?',
        error: '#NOME?',
        errorMessage: `Função '${enFunc}' em inglês não reconhecida no padrão PT-BR. Use '=${ptFunc}'.`,
        referencedCoords: []
      };
    }
  }

  try {
    const referencedCoords: string[] = [];
    const result = evaluateNode(expr, grid, currentCoord, referencedCoords);
    return {
      value: result,
      referencedCoords
    };
  } catch (err: any) {
    const code = err.message.startsWith('#') ? err.message : '#ERRO!';
    return {
      value: code,
      error: code,
      errorMessage: err.message,
      referencedCoords: []
    };
  }
}

/**
 * Avalia nós e subexpressões
 */
function evaluateNode(
  rawExpr: string,
  grid: SheetGridData,
  currentCoord: string | undefined,
  referencedCoords: string[]
): number | string {
  const expr = rawExpr.trim();

  // Verifica referência circular imediata
  if (currentCoord) {
    const refRegex = new RegExp(`\\b\\$?${currentCoord}\\b`, 'i');
    if (refRegex.test(expr)) {
      throw new Error('#REF!: Referência circular detectada. Uma célula não pode calcular a si mesma.');
    }
  }

  // 1. Funções com nome: NOME(...)
  const funcMatch = expr.match(/^([A-Za-zÇçÁáÉéÍíÓóÚúÃãÕõÂâÊêÔô.]+)\s*\((.*)\)$/s);
  if (funcMatch) {
    const rawFuncName = funcMatch[1].toUpperCase();
    const argsContent = funcMatch[2];
    const funcName = normalizeFunctionName(rawFuncName);

    const args = splitArguments(argsContent);
    return executeFunction(funcName, args, grid, currentCoord, referencedCoords);
  }

  // 2. Operadores de comparação (<, >, <=, >=, =, <>) no nível superior
  const compTokens = splitByTopLevelOperators(expr, ['<=', '>=', '<>', '<', '>', '=']);
  if (compTokens.length === 3) {
    const left = evaluateNode(compTokens[0], grid, currentCoord, referencedCoords);
    const op = compTokens[1];
    const right = evaluateNode(compTokens[2], grid, currentCoord, referencedCoords);
    return compareValues(left, op, right) ? 'VERDADEIRO' : 'FALSO';
  }

  // 3. Operadores aritméticos (+, -)
  const addSubTokens = splitByTopLevelOperators(expr, ['+', '-']);
  if (addSubTokens.length > 1) {
    let acc = evaluateNode(addSubTokens[0], grid, currentCoord, referencedCoords);
    for (let i = 1; i < addSubTokens.length; i += 2) {
      const op = addSubTokens[i];
      const nextVal = evaluateNode(addSubTokens[i + 1], grid, currentCoord, referencedCoords);
      if (typeof acc !== 'number' || typeof nextVal !== 'number') {
        throw new Error('#VALOR!: Operação matemática requer valores numéricos.');
      }
      acc = op === '+' ? acc + nextVal : acc - nextVal;
    }
    return acc;
  }

  // 4. Operadores aritméticos (*, /)
  const mulDivTokens = splitByTopLevelOperators(expr, ['*', '/']);
  if (mulDivTokens.length > 1) {
    let acc = evaluateNode(mulDivTokens[0], grid, currentCoord, referencedCoords);
    for (let i = 1; i < mulDivTokens.length; i += 2) {
      const op = mulDivTokens[i];
      const nextVal = evaluateNode(mulDivTokens[i + 1], grid, currentCoord, referencedCoords);
      if (typeof acc !== 'number' || typeof nextVal !== 'number') {
        throw new Error('#VALOR!: Operação matemática requer valores numéricos.');
      }
      if (op === '/') {
        if (nextVal === 0) throw new Error('#DIV/0!: Divisão por zero detectada.');
        acc = acc / nextVal;
      } else {
        acc = acc * nextVal;
      }
    }
    return acc;
  }

  // 5. Concatenação (&)
  const concatTokens = splitByTopLevelOperators(expr, ['&']);
  if (concatTokens.length > 1) {
    let str = '';
    for (let i = 0; i < concatTokens.length; i += 2) {
      const val = evaluateNode(concatTokens[i], grid, currentCoord, referencedCoords);
      str += String(val);
    }
    return str;
  }

  // 6. Parênteses puros: ( expr )
  if (expr.startsWith('(') && expr.endsWith(')')) {
    const inside = expr.slice(1, -1);
    return evaluateNode(inside, grid, currentCoord, referencedCoords);
  }

  // 7. Texto entre aspas: "texto"
  if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
    return expr.slice(1, -1);
  }

  // 8. Referência a célula individual (ex: B2 ou $B$2)
  const cellCoord = parseCellCoord(expr);
  if (cellCoord) {
    const normalized = `${cellCoord.colLetter}${cellCoord.row}`;
    referencedCoords.push(normalized);
    const val = getCellValue(grid, normalized);
    return val;
  }

  // 9. Número puro com suporte a vírgula decimal PT-BR (ex: "10,5" ou "20")
  const num = parsePtBrNumber(expr);
  if (!isNaN(num)) {
    return num;
  }

  throw new Error(`#NOME?: Termo não reconhecido: '${expr}'`);
}

/**
 * Normaliza nomes de funções aceitando grafias sem acento
 */
function normalizeFunctionName(name: string): string {
  const map: Record<string, string> = {
    MEDIA: 'MÉDIA',
    MAXIMO: 'MÁXIMO',
    MINIMO: 'MÍNIMO',
    'CONT.NUM': 'CONT.NÚM'
  };
  return map[name] || name;
}

/**
 * Divide argumentos no nível superior por ponto-e-vírgula (;)
 */
function splitArguments(content: string): string[] {
  const args: string[] = [];
  let depth = 0;
  let inQuote = false;
  let current = '';

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"' && content[i - 1] !== '\\') {
      inQuote = !inQuote;
    }
    if (!inQuote) {
      if (char === '(') depth++;
      else if (char === ')') depth--;
      else if (char === ';' && depth === 0) {
        args.push(current.trim());
        current = '';
        continue;
      }
    }
    current += char;
  }
  if (current.trim().length > 0) {
    args.push(current.trim());
  }
  return args;
}

/**
 * Divide expressão por operadores fora de parênteses e aspas
 */
function splitByTopLevelOperators(expr: string, operators: string[]): string[] {
  const tokens: string[] = [];
  let depth = 0;
  let inQuote = false;
  let lastIndex = 0;

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    if (char === '"' && expr[i - 1] !== '\\') {
      inQuote = !inQuote;
    }
    if (!inQuote) {
      if (char === '(') depth++;
      else if (char === ')') depth--;
      else if (depth === 0) {
        // Checa operadores ordenados por tamanho decrescente (ex: '<=' antes de '<')
        const matchedOp = operators.find((op) => expr.substr(i, op.length) === op);
        if (matchedOp) {
          const leftPart = expr.substring(lastIndex, i).trim();
          if (leftPart) {
            tokens.push(leftPart);
            tokens.push(matchedOp);
            i += matchedOp.length - 1;
            lastIndex = i + 1;
          }
        }
      }
    }
  }

  const remainder = expr.substring(lastIndex).trim();
  if (tokens.length > 0 && remainder) {
    tokens.push(remainder);
    return tokens;
  }
  return [expr];
}

/**
 * Compara valores para testes lógicos
 */
function compareValues(a: any, op: string, b: any): boolean {
  switch (op) {
    case '=':
      return a == b;
    case '<>':
      return a != b;
    case '>':
      return a > b;
    case '<':
      return a < b;
    case '>=':
      return a >= b;
    case '<=':
      return a <= b;
    default:
      return false;
  }
}

/**
 * Executa funções padrão PT-BR do Google Planilhas
 */
function executeFunction(
  funcName: string,
  args: string[],
  grid: SheetGridData,
  currentCoord: string | undefined,
  referencedCoords: string[]
): number | string {
  // Coleta valores numéricos/mistos de intervalos ou argumentos
  const resolveList = (argList: string[]): (number | string)[] => {
    const values: (number | string)[] = [];
    for (const arg of argList) {
      if (arg.includes(':')) {
        const coords = expandRange(arg);
        coords.forEach((c) => {
          referencedCoords.push(c);
          values.push(getCellValue(grid, c));
        });
      } else {
        const val = evaluateNode(arg, grid, currentCoord, referencedCoords);
        values.push(val);
      }
    }
    return values;
  };

  switch (funcName) {
    case 'SOMA': {
      const vals = resolveList(args);
      return vals.reduce<number>((acc, v) => acc + (typeof v === 'number' ? v : parsePtBrNumber(String(v)) || 0), 0);
    }

    case 'MÉDIA': {
      const vals = resolveList(args);
      const nums = vals
        .map((v) => (typeof v === 'number' ? v : parsePtBrNumber(String(v))))
        .filter((v) => !isNaN(v));
      if (nums.length === 0) throw new Error('#DIV/0!: Sem números no intervalo para média.');
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    case 'MÁXIMO': {
      const vals = resolveList(args);
      const nums = vals
        .map((v) => (typeof v === 'number' ? v : parsePtBrNumber(String(v))))
        .filter((v) => !isNaN(v));
      if (nums.length === 0) return 0;
      return Math.max(...nums);
    }

    case 'MÍNIMO': {
      const vals = resolveList(args);
      const nums = vals
        .map((v) => (typeof v === 'number' ? v : parsePtBrNumber(String(v))))
        .filter((v) => !isNaN(v));
      if (nums.length === 0) return 0;
      return Math.min(...nums);
    }

    case 'MULT': {
      const vals = resolveList(args);
      const nums = vals.map((v) => (typeof v === 'number' ? v : parsePtBrNumber(String(v)) || 0));
      return nums.reduce((a, b) => a * b, 1);
    }

    case 'CONT.NÚM': {
      const vals = resolveList(args);
      return vals.filter((v) => typeof v === 'number' && !isNaN(v)).length;
    }

    case 'CONT.VALORES': {
      const vals = resolveList(args);
      return vals.filter((v) => v !== '' && v !== null && v !== undefined).length;
    }

    case 'CONT.SE': {
      if (args.length < 2) throw new Error('#ERRO!: CONT.SE requer intervalo e critério.');
      const rangeCoords = expandRange(args[0]);
      rangeCoords.forEach((c) => referencedCoords.push(c));
      const rawCrit = evaluateNode(args[1], grid, currentCoord, referencedCoords);
      const crit = String(rawCrit).trim();

      let count = 0;
      for (const c of rangeCoords) {
        const val = getCellValue(grid, c);
        if (matchesCriteria(val, crit)) count++;
      }
      return count;
    }

    case 'SE': {
      if (args.length < 2) throw new Error('#ERRO!: SE requer teste_lógico e valor_se_verdadeiro.');
      const test = evaluateNode(args[0], grid, currentCoord, referencedCoords);
      const isTrue = Boolean(test);
      if (isTrue) {
        return evaluateNode(args[1], grid, currentCoord, referencedCoords);
      }
      if (args.length >= 3) {
        return evaluateNode(args[2], grid, currentCoord, referencedCoords);
      }
      return 'FALSO';
    }

    case 'SOMASE': {
      if (args.length < 2) throw new Error('#ERRO!: SOMASE requer intervalo e critério.');
      const rangeCoords = expandRange(args[0]);
      rangeCoords.forEach((c) => referencedCoords.push(c));
      const crit = String(evaluateNode(args[1], grid, currentCoord, referencedCoords)).trim();

      const sumCoords = args.length >= 3 ? expandRange(args[2]) : rangeCoords;
      if (args.length >= 3) {
        sumCoords.forEach((c) => referencedCoords.push(c));
      }

      let sum = 0;
      for (let i = 0; i < rangeCoords.length; i++) {
        const testVal = getCellValue(grid, rangeCoords[i]);
        if (matchesCriteria(testVal, crit)) {
          const sumCellVal = getCellValue(grid, sumCoords[i] || rangeCoords[i]);
          const num = typeof sumCellVal === 'number' ? sumCellVal : parsePtBrNumber(String(sumCellVal));
          if (!isNaN(num)) sum += num;
        }
      }
      return sum;
    }

    case 'PROCV': {
      if (args.length < 3) throw new Error('#ERRO!: PROCV requer chave, intervalo e índice_coluna.');
      const searchKey = evaluateNode(args[0], grid, currentCoord, referencedCoords);
      const rangeStr = args[1].replace(/\$/g, '').toUpperCase();
      const colIndexNumber = Number(evaluateNode(args[2], grid, currentCoord, referencedCoords));

      const parts = rangeStr.split(':');
      if (parts.length !== 2) throw new Error('#REF!: Intervalo inválido no PROCV.');
      const start = parseCellCoord(parts[0]);
      const end = parseCellCoord(parts[1]);
      if (!start || !end) throw new Error('#REF!: Intervalo inválido no PROCV.');

      const minCol = Math.min(start.colIndex, end.colIndex);
      const maxCol = Math.max(start.colIndex, end.colIndex);
      const totalCols = maxCol - minCol + 1;
      if (colIndexNumber < 1 || colIndexNumber > totalCols) {
        throw new Error('#REF!: Índice de coluna fora dos limites da tabela do PROCV.');
      }

      const targetColIndex = minCol + (colIndexNumber - 1);
      const minRow = Math.min(start.row, end.row);
      const maxRow = Math.max(start.row, end.row);

      for (let r = minRow; r <= maxRow; r++) {
        const lookupCoord = `${colIndexToLetter(minCol)}${r}`;
        referencedCoords.push(lookupCoord);
        const cellVal = getCellValue(grid, lookupCoord);

        if (String(cellVal).trim().toLowerCase() === String(searchKey).trim().toLowerCase()) {
          const returnCoord = `${colIndexToLetter(targetColIndex)}${r}`;
          referencedCoords.push(returnCoord);
          return getCellValue(grid, returnCoord);
        }
      }
      throw new Error('#N/D: Valor não encontrado pelo PROCV.');
    }

    default:
      throw new Error(`#NOME?: Função desconhecida: '=${funcName}'`);
  }
}

/**
 * Avalia se um valor atende a um critério de CONT.SE ou SOMASE
 * (ex: ">100", "<=50", "<>0", "VIP")
 */
function matchesCriteria(val: any, crit: string): boolean {
  const matchOp = crit.match(/^(<=|>=|<>|<|>|=)?(.*)$/);
  if (!matchOp) return val == crit;
  const op = matchOp[1] || '=';
  const targetStr = matchOp[2].trim();
  const targetNum = parsePtBrNumber(targetStr);

  const valNum = typeof val === 'number' ? val : parsePtBrNumber(String(val));

  if (!isNaN(targetNum) && !isNaN(valNum)) {
    return compareValues(valNum, op, targetNum);
  }
  return compareValues(String(val).toLowerCase(), op, targetStr.toLowerCase());
}

/**
 * Validação Pedagógica Completa com Teste de Mutação Anti-Hardcode
 */
export interface TargetValidationResult {
  valid: boolean;
  isCorrect: boolean;
  stars: 1 | 2 | 3;
  message: string;
  feedbackMessage: string;
  evalResult: FormulaEvaluationResult;
  isHardcodedWarning?: boolean;
}

export function validateTargetCell(
  userFormula: string,
  currentGrid: SheetGridData,
  targetRule: TargetCellRule,
  mutationTest?: { mutations: Record<string, number | string>; expectedRecalculations: Record<string, number | string> }
): TargetValidationResult {
  const formula = userFormula.trim();

  // 1. Deve começar com '='
  if (!formula.startsWith('=')) {
    return {
      valid: false,
      isCorrect: false,
      stars: 1,
      message: 'Em uma planilha, toda fórmula deve começar com o sinal de igual (=)!',
      feedbackMessage: 'Em uma planilha, toda fórmula deve começar com o sinal de igual (=)!',
      evalResult: { value: formula, error: '#VALOR!', referencedCoords: [] }
    };
  }

  // 2. Avalia a fórmula no grid atual
  const evalResult = evaluateFormula(formula, currentGrid, targetRule.coord);
  if (evalResult.error) {
    const errText = evalResult.errorMessage || `Erro na fórmula: ${evalResult.error}`;
    return {
      valid: false,
      isCorrect: false,
      stars: 1,
      message: errText,
      feedbackMessage: errText,
      evalResult
    };
  }

  // 3. Compara o valor calculado com o esperado
  const calculated = evalResult.value;
  const expected = targetRule.expectedValue;
  const matches = typeof calculated === 'number' && typeof expected === 'number'
    ? Math.abs(calculated - expected) < 0.01
    : String(calculated).trim().toLowerCase() === String(expected).trim().toLowerCase();

  if (!matches) {
    const mismatchText = `Resultado calculado (${calculated}) difere do esperado (${expected}). Verifique os intervalos ou operadores!`;
    return {
      valid: false,
      isCorrect: false,
      stars: 1,
      message: mismatchText,
      feedbackMessage: mismatchText,
      evalResult
    };
  }

  // 4. Teste Anti-Hardcode: Checa se referenciou células dinâmicas
  if (evalResult.referencedCoords.length === 0) {
    const hardcodeText = `O valor (${calculated}) está certo, mas você digitou números fixos estáticos! Em uma planilha real, os valores mudam dinamicamente. Use as coordenadas das células (ex: ${targetRule.expectedReferences?.[0] || 'B2'}) na sua fórmula.`;
    return {
      valid: false,
      isCorrect: false,
      stars: 1,
      isHardcodedWarning: true,
      message: hardcodeText,
      feedbackMessage: hardcodeText,
      evalResult
    };
  }

  // 5. Teste de Mutação nos Bastidores (Garante que a fórmula funciona quando os dados mudam)
  if (mutationTest && mutationTest.expectedRecalculations[targetRule.coord] !== undefined) {
    const mutatedGrid: SheetGridData = JSON.parse(JSON.stringify(currentGrid));
    for (const [cellCoord, mutVal] of Object.entries(mutationTest.mutations)) {
      if (mutatedGrid[cellCoord]) {
        mutatedGrid[cellCoord].raw = mutVal;
        mutatedGrid[cellCoord].display = mutVal;
      }
    }
    const mutatedEval = evaluateFormula(formula, mutatedGrid, targetRule.coord);
    const expectedMutated = mutationTest.expectedRecalculations[targetRule.coord];
    const mutationMatches = typeof mutatedEval.value === 'number' && typeof expectedMutated === 'number'
      ? Math.abs(mutatedEval.value - expectedMutated) < 0.01
      : String(mutatedEval.value).trim().toLowerCase() === String(expectedMutated).trim().toLowerCase();

    if (!mutationMatches) {
      const mutText = 'Sua fórmula deu certo para estes números, mas falhou quando os dados da planilha mudaram. Verifique se você usou o intervalo de células correto!';
      return {
        valid: false,
        isCorrect: false,
        stars: 1,
        isHardcodedWarning: true,
        message: mutText,
        feedbackMessage: mutText,
        evalResult
      };
    }
  }

  // 6. Cálculo das Estrelas (3⭐ para função recomendada, 2⭐ para abordagem manual funcional)
  let stars: 1 | 2 | 3 = 3;
  if (targetRule.requiredFunction) {
    const hasRequiredFunc = new RegExp(`\\b${targetRule.requiredFunction}\\s*\\(`, 'i').test(formula);
    if (!hasRequiredFunc) {
      stars = 2; // Acertou o cálculo (ex: B2+B3+B4 em vez de SOMA(B2:B4)), ganha 2 estrelas
    }
  }

  const successMessage = stars === 3
    ? 'Excelente! Fórmula perfeita com a função ideal.'
    : `Parabéns pelo resultado! Dica para 3 ⭐: tente usar a função =${targetRule.requiredFunction}(...) para economizar digitação.`;

  return {
    valid: true,
    isCorrect: true,
    stars,
    message: successMessage,
    feedbackMessage: successMessage,
    evalResult
  };
}
