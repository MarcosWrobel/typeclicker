/**
 * Catálogo de Fases da Balança Quântica de Álgebra (Math Storm)
 * Alinhado à BNCC:
 * EF07MA18 - Reconhecer que uma igualdade não se altera ao adicionar/subtrair/multiplicar/dividir termos iguais.
 * EF08MA07 - Resolver equações polinomiais de 1º grau com uma incógnita.
 */

export interface WeightItem {
  id: string;
  type: 'known' | 'unknown'; // 'known' = peso conhecido (número), 'unknown' = incógnita x
  value: number; // Peso real da peça
  label?: string; // Exibição (ex: 'x', '1', '2', '5')
  color?: string;
}

export interface BalanceLevel {
  id: number;
  title: string;
  subtitle: string;
  equationDescription: string;
  targetEquation: string; // Ex: "x + 3 = 7"
  unknownValue: number; // O valor secreto de x
  initialLeftItems: WeightItem[];
  initialRightItems: WeightItem[];
  availableInventory: {
    knownWeights: number[]; // Pesos disponíveis no inventário da bancada (ex: [1, 2, 5])
    unknownWeightsCount: number; // Quantidade de caixas x disponíveis para adicionar
  };
  pedagogicalHint: string;
  scaffoldingSteps: string[];
  bnccCode: string;
}

export const BALANCE_LEVELS: BalanceLevel[] = [
  {
    id: 1,
    title: 'Fase 1: O Princípio da Igualdade',
    subtitle: 'Equilibre a balança para descobrir o peso da Caixa Quântica x',
    equationDescription: 'Uma caixa misteriosa mais 2kg equilibra exatamente com 5kg.',
    targetEquation: 'x + 2 = 5',
    unknownValue: 3,
    initialLeftItems: [
      { id: 'left-x-1', type: 'unknown', value: 3, label: 'x' },
      { id: 'left-k-1', type: 'known', value: 2, label: '2kg' }
    ],
    initialRightItems: [
      { id: 'right-k-1', type: 'known', value: 5, label: '5kg' }
    ],
    availableInventory: {
      knownWeights: [1, 2, 3],
      unknownWeightsCount: 0
    },
    pedagogicalHint: 'Se você retirar 2kg do prato esquerdo, o que deve retirar do prato direito para manter o equilíbrio?',
    scaffoldingSteps: [
      'Observe os dois pratos em equilíbrio inicial.',
      'Clique no peso de 2kg da esquerda para removê-lo.',
      'A balança inclinou! Remova 2kg da direita (ou substitua) para isolar x!'
    ],
    bnccCode: 'EF07MA18'
  },
  {
    id: 2,
    title: 'Fase 2: Isolando a Incógnita',
    subtitle: 'Remova pesos idênticos de ambos os lados simultaneamente',
    equationDescription: 'A caixa x acompanhada de 4kg está em equilíbrio com 9kg.',
    targetEquation: 'x + 4 = 9',
    unknownValue: 5,
    initialLeftItems: [
      { id: 'left-x-1', type: 'unknown', value: 5, label: 'x' },
      { id: 'left-k-1', type: 'known', value: 2, label: '2kg' },
      { id: 'left-k-2', type: 'known', value: 2, label: '2kg' }
    ],
    initialRightItems: [
      { id: 'right-k-1', type: 'known', value: 5, label: '5kg' },
      { id: 'right-k-2', type: 'known', value: 2, label: '2kg' },
      { id: 'right-k-3', type: 'known', value: 2, label: '2kg' }
    ],
    availableInventory: {
      knownWeights: [1, 2, 5],
      unknownWeightsCount: 0
    },
    pedagogicalHint: 'Para deixar o x sozinho, retire 4kg da esquerda e 4kg da direita. O que sobra na direita é o valor exato de x!',
    scaffoldingSteps: [
      'Ambos os pratos têm pesos de 2kg.',
      'Retire 4kg de cada lado para descobrir quanto vale x.'
    ],
    bnccCode: 'EF07MA18'
  },
  {
    id: 3,
    title: 'Fase 3: Multiplicador de Caixas (2x)',
    subtitle: 'Duas caixas idênticas se equilibram com pesos conhecidos',
    equationDescription: 'Duas caixas x mais 1kg equilibram com 7kg.',
    targetEquation: '2x + 1 = 7',
    unknownValue: 3,
    initialLeftItems: [
      { id: 'left-x-1', type: 'unknown', value: 3, label: 'x' },
      { id: 'left-x-2', type: 'unknown', value: 3, label: 'x' },
      { id: 'left-k-1', type: 'known', value: 1, label: '1kg' }
    ],
    initialRightItems: [
      { id: 'right-k-1', type: 'known', value: 5, label: '5kg' },
      { id: 'right-k-2', type: 'known', value: 2, label: '2kg' }
    ],
    availableInventory: {
      knownWeights: [1, 2, 3],
      unknownWeightsCount: 0
    },
    pedagogicalHint: 'Primeiro retire 1kg de cada prato. Ficará 2x = 6. Se duas caixas pesam 6kg, quanto pesa uma só caixa?',
    scaffoldingSteps: [
      'Retire o 1kg que está sobrando com as caixas x.',
      'Veja o peso restante e divida igualmente entre as duas caixas.'
    ],
    bnccCode: 'EF07MA18'
  },
  {
    id: 4,
    title: 'Fase 4: Incógnitas em Ambos os Lados',
    subtitle: 'Equações onde x aparece nos dois pratos da balança',
    equationDescription: '3 caixas x mais 2kg equilibram com 1 caixa x mais 8kg.',
    targetEquation: '3x + 2 = x + 8',
    unknownValue: 3,
    initialLeftItems: [
      { id: 'left-x-1', type: 'unknown', value: 3, label: 'x' },
      { id: 'left-x-2', type: 'unknown', value: 3, label: 'x' },
      { id: 'left-x-3', type: 'unknown', value: 3, label: 'x' },
      { id: 'left-k-1', type: 'known', value: 2, label: '2kg' }
    ],
    initialRightItems: [
      { id: 'right-x-1', type: 'unknown', value: 3, label: 'x' },
      { id: 'right-k-1', type: 'known', value: 5, label: '5kg' },
      { id: 'right-k-2', type: 'known', value: 3, label: '3kg' }
    ],
    availableInventory: {
      knownWeights: [1, 2, 3, 5],
      unknownWeightsCount: 1
    },
    pedagogicalHint: 'Você pode remover 1 caixa x de cada lado sem alterar o equilíbrio! Depois retire 2kg de cada lado.',
    scaffoldingSteps: [
      'Retire a caixa x solitária da direita e uma caixa x da esquerda.',
      'Agora você tem 2x + 2 = 8.',
      'Retire 2kg de ambos os lados e divida o restante por 2!'
    ],
    bnccCode: 'EF08MA07'
  },
  {
    id: 5,
    title: 'Fase 5: Desafio do Núcleo da Tempestade',
    subtitle: 'Resolva a equação quântica completa e estabilize a rede',
    equationDescription: '2 caixas x mais 5kg equilibram com 15kg.',
    targetEquation: '2x + 5 = 15',
    unknownValue: 5,
    initialLeftItems: [
      { id: 'left-x-1', type: 'unknown', value: 5, label: 'x' },
      { id: 'left-x-2', type: 'unknown', value: 5, label: 'x' },
      { id: 'left-k-1', type: 'known', value: 5, label: '5kg' }
    ],
    initialRightItems: [
      { id: 'right-k-1', type: 'known', value: 10, label: '10kg' },
      { id: 'right-k-2', type: 'known', value: 5, label: '5kg' }
    ],
    availableInventory: {
      knownWeights: [1, 2, 5, 10],
      unknownWeightsCount: 0
    },
    pedagogicalHint: 'Retire 5kg de ambos os lados. Depois calcule quanto pesa cada x!',
    scaffoldingSteps: [
      'Retire 5kg de cada prato.',
      'Descubra o valor final da caixa x e confirme a estabilização!'
    ],
    bnccCode: 'EF08MA07'
  }
];

// ============================================================================
// DISTRITO 2: PADARIA DAS FRAÇÕES (Fatiador de Tortas e Equivalências)
// ============================================================================

export interface FractionLevel {
  id: number;
  title: string;
  subtitle: string;
  targetEquation: string; // Ex: "3 / 4" ou "1/2 = ?/6"
  targetNumerator: number;
  targetDenominator: number;
  availableCutters: number[]; // Ex: [2, 3, 4, 6, 8]
  initialCutter: number;
  requiredDenominator?: number; // Se exigir cortar especificamente em N fatias (ex: para equivalência)
  pedagogicalHint: string;
  scaffoldingSteps: string[];
  bnccCode: string;
}

export const FRACTION_LEVELS: FractionLevel[] = [
  {
    id: 1,
    title: 'Padaria 1: A Receita de Três Quartos',
    subtitle: 'Corte a torta em 4 partes iguais e sirva 3 fatias na bandeja',
    targetEquation: '3 / 4',
    targetNumerator: 3,
    targetDenominator: 4,
    availableCutters: [2, 3, 4, 6],
    initialCutter: 4,
    pedagogicalHint: 'O denominador (4) indica em quantos pedaços iguais a torta foi cortada. O numerador (3) indica quantas fatias devemos servir!',
    scaffoldingSteps: [
      'Escolha o cortador de ÷4 fatias.',
      'Clique em 3 fatias da torta para colocá-las na bandeja de entrega.',
      'Confirme o pedido!'
    ],
    bnccCode: 'EF04MA09'
  },
  {
    id: 2,
    title: 'Padaria 2: Equivalência de Meia Torta',
    subtitle: 'Forme exatamente 1/2 da torta usando fatias cortadas em 6 pedaços!',
    targetEquation: '1 / 2 = ? / 6',
    targetNumerator: 3,
    targetDenominator: 6,
    availableCutters: [2, 3, 4, 6, 8],
    initialCutter: 6,
    requiredDenominator: 6,
    pedagogicalHint: 'Se a torta inteira tem 6 fatias iguais, quantas fatias representam exatamente a metade (1/2) da torta?',
    scaffoldingSteps: [
      'Mantenha o cortador em ÷6 fatias.',
      'Adicione fatias na bandeja até preencher metade do círculo (3/6).',
      'Observe na barra de equivalência que 3/6 = 1/2!'
    ],
    bnccCode: 'EF05MA03'
  },
  {
    id: 3,
    title: 'Padaria 3: O Pedido de Dois Terços em Sextos',
    subtitle: 'Descubra quantos sextos (?/6) equivalem a 2/3 de torta',
    targetEquation: '2 / 3 = ? / 6',
    targetNumerator: 4,
    targetDenominator: 6,
    availableCutters: [3, 4, 6, 8],
    initialCutter: 3,
    requiredDenominator: 6,
    pedagogicalHint: 'Cada 1/3 equivale a 2 fatias de 1/6. Portanto, 2/3 equivalem a 4 fatias de 1/6!',
    scaffoldingSteps: [
      'Mude o cortador para ÷6 fatias.',
      'Coloque 4 fatias na bandeja para atingir a marca de 2/3.',
      'Confirme o pedido!'
    ],
    bnccCode: 'EF05MA03'
  },
  {
    id: 4,
    title: 'Padaria 4: Banquete de Cinco Oitavos',
    subtitle: 'Fatie a torta em 8 partes e sirva 5/8 para a mesa real',
    targetEquation: '5 / 8',
    targetNumerator: 5,
    targetDenominator: 8,
    availableCutters: [2, 4, 6, 8],
    initialCutter: 8,
    requiredDenominator: 8,
    pedagogicalHint: 'Selecione o cortador ÷8 e escolha 5 fatias fresquinhas para a bandeja!',
    scaffoldingSteps: [
      'Use o cortador ÷8.',
      'Transfira 5 fatias para a bandeja.',
      'Confirme quando a barra indicar 5/8!'
    ],
    bnccCode: 'EF06MA07'
  }
];

// ============================================================================
// DISTRITO 3: FERROVIA NUMÉRICA (Reta de Saltos, Negativos e Decimais)
// ============================================================================

export interface NumberLineLevel {
  id: number;
  title: string;
  subtitle: string;
  targetEquation: string; // Ex: "3 + 5 + 4 = 12"
  minVal: number;
  maxVal: number;
  stepTick: number;
  startPosition: number;
  targetPosition: number;
  availableJumps: number[]; // Ex: [+5, +2, -1]
  maxJumps?: number;
  pedagogicalHint: string;
  scaffoldingSteps: string[];
  bnccCode: string;
}

export const NUMBERLINE_LEVELS: NumberLineLevel[] = [
  {
    id: 1,
    title: 'Ferrovia 1: Partida na Reta Natural',
    subtitle: 'Conduza a locomotiva do marco 2 até a estação 15 usando saltos exatos',
    targetEquation: '2 + ? = 15',
    minVal: 0,
    maxVal: 20,
    stepTick: 1,
    startPosition: 2,
    targetPosition: 15,
    availableJumps: [1, 2, 5, 10, -1],
    pedagogicalHint: 'De 2 para 15 faltam 13 unidades! Você pode saltar +10, depois +2 e +1!',
    scaffoldingSteps: [
      'Veja onde está a bandeira quadriculada (15).',
      'Use um salto grande de +10 para ir de 2 até 12.',
      'Complete com +2 e +1 para parar cravado no 15!'
    ],
    bnccCode: 'EF03MA04'
  },
  {
    id: 2,
    title: 'Ferrovia 2: Manobra de Subtração',
    subtitle: 'Recue a locomotiva da estação 18 até a estação 7',
    targetEquation: '18 - 11 = 7',
    minVal: 0,
    maxVal: 20,
    stepTick: 1,
    startPosition: 18,
    targetPosition: 7,
    availableJumps: [-5, -3, -1, 2],
    pedagogicalHint: 'Use os cartões de recuo negativo (-5 e -1) para voltar 11 casas até o 7!',
    scaffoldingSteps: [
      'Você começa no 18 e precisa voltar até o 7.',
      'Dê dois saltos de -5 (chegando em 8) e um salto de -1!'
    ],
    bnccCode: 'EF04MA03'
  },
  {
    id: 3,
    title: 'Ferrovia 3: Túnel Abaixo de Zero (Inteiros)',
    subtitle: 'Navegue pelos números negativos: saia de 4 e chegue em -5',
    targetEquation: '4 - 9 = -5',
    minVal: -10,
    maxVal: 10,
    stepTick: 1,
    startPosition: 4,
    targetPosition: -5,
    availableJumps: [-5, -2, -1, 3],
    pedagogicalHint: 'Passando pelo zero! De 4 até 0 são -4 unidades, e de 0 até -5 são mais -5 unidades!',
    scaffoldingSteps: [
      'Salte -5 a partir do 4 para cair em -1.',
      'Depois salte -2 duas vezes até chegar na estação -5!'
    ],
    bnccCode: 'EF07MA04'
  },
  {
    id: 4,
    title: 'Ferrovia 4: Trilho de Precisão Decimal',
    subtitle: 'Use saltos decimais (0.5 e 0.25) para ir de 0.5 até 2.75',
    targetEquation: '0,5 + 2,25 = 2,75',
    minVal: 0,
    maxVal: 4,
    stepTick: 0.25,
    startPosition: 0.5,
    targetPosition: 2.75,
    availableJumps: [1, 0.5, 0.25, -0.25],
    pedagogicalHint: 'Some 2 inteiros (+1 e +1) para chegar em 2.5, e mais +0.25 para cravar 2.75!',
    scaffoldingSteps: [
      'Partindo de 0.5, dê dois saltos de +1 para alcançar 2.5.',
      'Dê um salto de +0.25 para estacionar em 2.75!'
    ],
    bnccCode: 'EF05MA02'
  }
];

// ============================================================================
// DISTRITO 4: FÁBRICA BASE 10 (Unidades, Dezenas, Centenas e Reagrupamento)
// ============================================================================

export interface BaseTenLevel {
  id: number;
  title: string;
  subtitle: string;
  targetEquation: string;
  targetValue: number;
  initialHundreds: number;
  initialTens: number;
  initialUnits: number;
  requireCanonicalForm?: boolean; // Exige que não haja >=10 unidades soltas sem agrupar
  pedagogicalHint: string;
  scaffoldingSteps: string[];
  bnccCode: string;
}

export const BASETEN_LEVELS: BaseTenLevel[] = [
  {
    id: 1,
    title: 'Fábrica 1: Fusão de Dezenas',
    subtitle: 'Temos 14 unidades soltas! Agrupe 10 unidades em 1 dezena para formar 14 organizado',
    targetEquation: '14 = 1 Dezena + 4 Unidades',
    targetValue: 14,
    initialHundreds: 0,
    initialTens: 0,
    initialUnits: 14,
    requireCanonicalForm: true,
    pedagogicalHint: 'Nunca deixe 10 ou mais cubinhos soltos! Clique em "FUNDIR 10 UNIDADES → 1 DEZENA"!',
    scaffoldingSteps: [
      'Veja os 14 cubinhos verdes na bancada.',
      'Clique no botão de Fusão para transformar 10 cubos em 1 barra dourada de dezena.',
      'Confirme a carga organizada (1 dezena e 4 unidades)!'
    ],
    bnccCode: 'EF02MA04'
  },
  {
    id: 2,
    title: 'Fábrica 2: Montando Carga de Centena',
    subtitle: 'Monte exatamente o número 235 na bancada de forma organizada',
    targetEquation: '200 + 30 + 5 = 235',
    targetValue: 235,
    initialHundreds: 1,
    initialTens: 1,
    initialUnits: 2,
    requireCanonicalForm: true,
    pedagogicalHint: '235 precisa de 2 placas de Centena (200), 3 barras de Dezena (30) e 5 cubos de Unidade (5)!',
    scaffoldingSteps: [
      'Adicione +1 Centena para ter 200.',
      'Adicione +2 Dezenas para ter 30.',
      'Adicione +3 Unidades para fechar 235!'
    ],
    bnccCode: 'EF03MA02'
  },
  {
    id: 3,
    title: 'Fábrica 3: Quebra de Dezena (Empréstimo)',
    subtitle: 'Temos 30 (3 dezenas) e precisamos retirar 4 unidades para ficar com 26!',
    targetEquation: '30 - 4 = 26',
    targetValue: 26,
    initialHundreds: 0,
    initialTens: 3,
    initialUnits: 0,
    requireCanonicalForm: true,
    pedagogicalHint: 'Como tirar 4 unidades se só temos barras de 10? Quebre 1 Dezena em 10 Unidades e depois remova 4 unidades!',
    scaffoldingSteps: [
      'Clique em "QUEBRAR 1 DEZENA → 10 UNIDADES".',
      'Agora você tem 2 dezenas e 10 unidades soltas.',
      'Remova 4 unidades até restarem 26!'
    ],
    bnccCode: 'EF04MA03'
  },
  {
    id: 4,
    title: 'Fábrica 4: Super Encomenda Quântica',
    subtitle: 'Some 128 + 35 na bancada e funda as unidades excedentes (Total: 163)',
    targetEquation: '128 + 35 = 163',
    targetValue: 163,
    initialHundreds: 1,
    initialTens: 5,
    initialUnits: 13,
    requireCanonicalForm: true,
    pedagogicalHint: '8 + 5 gerou 13 unidades soltas! Funda 10 unidades em 1 nova dezena para obter 1 centena, 6 dezenas e 3 unidades!',
    scaffoldingSteps: [
      'Clique em "FUNDIR 10 UNIDADES → 1 DEZENA".',
      'Verifique que o total é 163 sem sobras acima de 9.',
      'Confirme o despacho!'
    ],
    bnccCode: 'EF04MA03'
  }
];

