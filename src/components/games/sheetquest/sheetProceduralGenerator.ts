import { SheetLevel, SheetGridData } from '../../../types/sheetQuest';

interface ScenarioTheme {
  name: string;
  avatar: string;
  role: string;
  itemColName: string;
  valColName: string;
  items: string[];
  unitFormat: 'currency' | 'number';
  baseMin: number;
  baseMax: number;
}

const SCENARIO_THEMES: ScenarioTheme[] = [
  {
    name: 'Loja Gamer NeoTech',
    avatar: '🎮',
    role: 'Coordenador de Estoque',
    itemColName: 'Periférico',
    valColName: 'Preço (R$)',
    items: ['Mouse Sem Fio', 'Teclado TKL', 'Headset 7.1', 'Webcam 1080p', 'Microfone USB', 'Mousepad Speed'],
    unitFormat: 'currency',
    baseMin: 80,
    baseMax: 350
  },
  {
    name: 'Campeonato de Valorant',
    avatar: '🏆',
    role: 'Analista de Estatísticas',
    itemColName: 'Jogador',
    valColName: 'Pontos de Combate',
    items: ['ViperX', 'PhoenixPro', 'SageHeal', 'JettDash', 'SovaArrow', 'OmenDark'],
    unitFormat: 'number',
    baseMin: 210,
    baseMax: 540
  },
  {
    name: 'Canal de Live Streaming',
    avatar: '🎥',
    role: 'Gerente de Audiência',
    itemColName: 'Transmissão',
    valColName: 'Novos Subs',
    items: ['Segunda Gamer', 'Terça Co-op', 'Quarta Rankeada', 'Quinta Podcast', 'Sexta Maratona', 'Sábado Torneio'],
    unitFormat: 'number',
    baseMin: 40,
    baseMax: 180
  },
  {
    name: 'Estação Espacial Aurora',
    avatar: '🚀',
    role: 'Engenheiro de Sistemas',
    itemColName: 'Bateria Solar',
    valColName: 'Energia (kW)',
    items: ['Painel Solar 1', 'Painel Solar 2', 'Painel Solar 3', 'Painel Solar 4', 'Reator Auxiliar', 'Célula Térmica'],
    unitFormat: 'number',
    baseMin: 120,
    baseMax: 290
  }
];

export function generateInfiniteSheetLevel(seed: number): SheetLevel {
  const theme = SCENARIO_THEMES[seed % SCENARIO_THEMES.length];
  const numRowsData = 4 + (seed % 3); // 4 a 6 linhas de dados

  // Sorteia os valores
  const values: number[] = [];
  for (let i = 0; i < numRowsData; i++) {
    const val = theme.baseMin + ((seed * (i + 3) * 17) % (theme.baseMax - theme.baseMin));
    values.push(Math.round(val));
  }

  const grid: SheetGridData = {
    A1: { raw: theme.itemColName, align: 'left', format: 'text', readOnly: true },
    B1: { raw: theme.valColName, align: 'right', format: 'text', readOnly: true }
  };

  for (let i = 0; i < numRowsData; i++) {
    const row = i + 2;
    grid[`A${row}`] = {
      raw: theme.items[i % theme.items.length],
      align: 'left',
      format: 'text',
      readOnly: true
    };
    grid[`B${row}`] = {
      raw: values[i],
      display: values[i],
      format: theme.unitFormat,
      align: 'right',
      readOnly: true
    };
  }

  // Define a missão de acordo com a seed
  const missionType = seed % 3;
  const targetRow = numRowsData + 2;
  const rangeStr = `B2:B${numRowsData + 1}`;

  let targetLabel = '';
  let hint = '';
  let requiredFunction = '';
  let expectedValue: number | string = 0;

  if (missionType === 0) {
    // SOMA
    targetLabel = 'Total Consolidado';
    requiredFunction = 'SOMA';
    hint = `Some todo o intervalo: =SOMA(${rangeStr})`;
    expectedValue = values.reduce((a, b) => a + b, 0);
  } else if (missionType === 1) {
    // MÉDIA
    targetLabel = 'Média Geral';
    requiredFunction = 'MÉDIA';
    hint = `Calcule a média aritmética: =MÉDIA(${rangeStr})`;
    expectedValue = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
  } else {
    // MÁXIMO
    targetLabel = 'Pico Máximo Registrado';
    requiredFunction = 'MÁXIMO';
    hint = `Encontre o maior número da coluna: =MÁXIMO(${rangeStr})`;
    expectedValue = Math.max(...values);
  }

  grid[`A${targetRow}`] = {
    raw: targetLabel,
    align: 'left',
    format: 'text',
    readOnly: true,
    badgeColor: missionType === 0 ? 'emerald' : missionType === 1 ? 'sky' : 'purple'
  };

  grid[`B${targetRow}`] = {
    raw: '',
    format: theme.unitFormat,
    align: 'right',
    isTarget: true
  };

  return {
    id: 1000 + seed,
    world: 99,
    worldName: 'Demandas Corporativas Infinitas',
    title: `Demanda #${seed + 1} — ${theme.name}`,
    scenario: `Atenda ao chamado da equipe do ${theme.name} resolvendo a planilha da rodada.`,
    clientName: `Equipe ${theme.name}`,
    clientRole: theme.role,
    clientAvatar: theme.avatar,
    briefing: `Precisamos apurar o "${targetLabel}" dos nossos registros. Calcule o resultado exato na célula B${targetRow} utilizando a função =${requiredFunction}(${rangeStr})!`,
    tipTitle: `Como usar =${requiredFunction}`,
    tipContent: hint,
    cheatSheetFormula: `=${requiredFunction}(${rangeStr})`,
    numColumns: 3,
    numRows: targetRow + 2,
    initialGrid: grid,
    targets: [
      {
        coord: `B${targetRow}`,
        label: targetLabel,
        hint,
        explanation: `O resultado esperado para este intervalo é ${expectedValue}.`,
        expectedValue,
        requiredFunction,
        expectedReferences: [rangeStr],
        solutionFormula: `=${requiredFunction}(${rangeStr})`
      }
    ]
  };
}

export const generateProceduralSheetLevel = generateInfiniteSheetLevel;
