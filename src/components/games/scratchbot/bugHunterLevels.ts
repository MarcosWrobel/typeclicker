// ─────────────────────────────────────────────────────────────
// Níveis de Depuração — Modo Caça aos Bugs (Bug Hunter)
// O jogador recebe um código pré-montado com defeito para corrigir.
// ─────────────────────────────────────────────────────────────
import { ScratchLevelDef } from '../../../types/scratchBot';

export const BUG_HUNTER_LEVELS: ScratchLevelDef[] = [
  {
    id: 1,
    world: 1,
    title: 'Bug 1: A Curva Invertida',
    subtitle: 'Erro de Orientação Espacial',
    description: 'Um desenvolvedor júnior trocou o primeiro comando de giro e o Bytezinho está colidindo no firewall!',
    tip: 'Execute o código com o botão PASSO para ver em qual linha o robô vira para o lado errado. Substitua o primeiro "Gire direita" por "Gire esquerda"!',
    bugDescription: 'O primeiro giro vira o robô para a direita (para baixo) em vez da esquerda (para cima).',
    gridSize: { width: 5, height: 5 },
    startPos: { x: 1, y: 3 },
    startDir: 'RIGHT',
    targetPos: { x: 3, y: 1 },
    obstacles: [
      { x: 2, y: 3 },
      { x: 3, y: 2 },
    ],
    maxBlocksFor3Stars: 7, // Bandeira (1) + GireEsq (1) + Mova 2x (2) + GireDir (1) + Mova 2x (2) = 7
    maxBlocksFor2Stars: 9,
    baseRewardBytes: 180,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right'],
    initialScript: [
      { id: 'flag-start', type: 'when_flag_clicked', category: 'events' },
      { id: 'b1-turn-err', type: 'turn_right', category: 'motion' }, // BUG: deveria ser turn_left!
      { id: 'b1-m1', type: 'move_forward', category: 'motion' },
      { id: 'b1-m2', type: 'move_forward', category: 'motion' },
      { id: 'b1-turn2', type: 'turn_right', category: 'motion' },
      { id: 'b1-m3', type: 'move_forward', category: 'motion' },
      { id: 'b1-m4', type: 'move_forward', category: 'motion' },
    ],
  },
  {
    id: 2,
    world: 2,
    title: 'Bug 2: Loop Extrapolado',
    subtitle: 'Erro de Limite de Laço (Off-by-One)',
    description: 'O laço de repetição tem iterações demais e faz o Bytezinho colidir no firewall antes de fazer a curva!',
    tip: 'Conte quantas casas existem até a esquina (4,2) antes de virar para baixo. Altere o número do bloco "repita" de 5 para 3!',
    bugDescription: 'O laço "repita" está configurado para 5 vezes, mas a esquina fica a apenas 3 passos de distância.',
    gridSize: { width: 6, height: 6 },
    startPos: { x: 1, y: 2 },
    startDir: 'RIGHT',
    targetPos: { x: 4, y: 4 },
    obstacles: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 },
      { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 4 },
    ],
    maxBlocksFor3Stars: 6, // Bandeira (1) + Repita 3x [Mova] (2) + GireDir (1) + Mova 2x (2) = 6
    maxBlocksFor2Stars: 8,
    baseRewardBytes: 200,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat'],
    initialScript: [
      { id: 'flag-start', type: 'when_flag_clicked', category: 'events' },
      {
        id: 'b2-rep',
        type: 'repeat',
        category: 'control',
        paramValue: 5, // BUG: São apenas 3 passos até a esquina (4,2)! Com 5 bate no firewall em (5,2).
        children: [
          { id: 'b2-m1', type: 'move_forward', category: 'motion' },
        ],
      },
      { id: 'b2-turn', type: 'turn_right', category: 'motion' },
      { id: 'b2-m2', type: 'move_forward', category: 'motion' },
      { id: 'b2-m3', type: 'move_forward', category: 'motion' },
    ],
  },
  {
    id: 3,
    world: 3,
    title: 'Bug 3: Choque no Piso EMP',
    subtitle: 'Interrupção em Área Perigosa',
    description: 'O algoritmo faz o Bytezinho encerrar um ciclo do laço exatamente sobre os pisos de descarga elétrica!',
    tip: 'O robô não pode terminar uma repetição sobre um piso EMP. Mude o laço para "repita 2 vezes" e coloque DOIS blocos "mova 1 passo" dentro dele para saltar os EMPs!',
    bugDescription: 'Com apenas 1 passo por repetição, o robô descansa sobre o piso EMP em (1,2) logo no fim do 1º ciclo.',
    gridSize: { width: 6, height: 5 },
    startPos: { x: 0, y: 2 },
    startDir: 'RIGHT',
    targetPos: { x: 4, y: 2 },
    obstacles: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
      { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 },
    ],
    hazards: [
      { x: 1, y: 2 },
      { x: 3, y: 2 },
    ],
    maxBlocksFor3Stars: 4, // Bandeira (1) + Repita 2x (1) + Mova (1) + Mova (1) = 4
    maxBlocksFor2Stars: 6,
    baseRewardBytes: 240,
    availableBlockTypes: ['move_forward', 'repeat'],
    initialScript: [
      { id: 'flag-start', type: 'when_flag_clicked', category: 'events' },
      {
        id: 'b3-rep',
        type: 'repeat',
        category: 'control',
        paramValue: 4, // BUG: Repetir 4x com 1 passo faz o ciclo parar em (1,2) e (3,2) que são pisos EMP! Deve ser Repita 2x com 2 blocos Mova.
        children: [
          { id: 'b3-m1', type: 'move_forward', category: 'motion' },
        ],
      },
    ],
  },
  {
    id: 4,
    world: 4,
    title: 'Bug 4: A Gema Esquecida',
    subtitle: 'Instrução de Coleta Ausente',
    description: 'O Bytezinho passa direto pelo cristal de dados em (1,1) sem coletá-lo. O portal permanece fechado!',
    tip: 'Encaixe o bloco roxo "coletar gema" exatamente após o 3º bloco "mova 1 passo" (antes do giro à direita).',
    bugDescription: 'O robô chega ao portal, mas não consegue ativá-lo porque esqueceu de minerar a gema na esquina (1,1).',
    gridSize: { width: 6, height: 6 },
    startPos: { x: 1, y: 4 },
    startDir: 'UP',
    targetPos: { x: 4, y: 1 },
    obstacles: [
      { x: 2, y: 4 }, { x: 2, y: 3 }, { x: 2, y: 2 },
    ],
    gems: [
      { x: 1, y: 1 },
    ],
    maxBlocksFor3Stars: 9, // Bandeira (1) + Mova 3x (3) + Coletar (1) + GireDir (1) + Mova 3x (3) = 9
    maxBlocksFor2Stars: 11,
    baseRewardBytes: 280,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'collect_gem'],
    initialScript: [
      { id: 'flag-start', type: 'when_flag_clicked', category: 'events' },
      { id: 'b4-m1', type: 'move_forward', category: 'motion' },
      { id: 'b4-m2', type: 'move_forward', category: 'motion' },
      { id: 'b4-m3', type: 'move_forward', category: 'motion' },
      // BUG: Faltou coletar a gema aqui antes de girar!
      { id: 'b4-turn', type: 'turn_right', category: 'motion' },
      { id: 'b4-m4', type: 'move_forward', category: 'motion' },
      { id: 'b4-m5', type: 'move_forward', category: 'motion' },
      { id: 'b4-m6', type: 'move_forward', category: 'motion' },
    ],
  },
  {
    id: 5,
    world: 4,
    title: 'Bug 5: Chave Inacessível',
    subtitle: 'Ordem de Operações Invertida',
    description: 'O robô girou para a direita cedo demais, antes de dar o segundo passo para alcançar a chave em (1,1)!',
    tip: 'Use a seta ▲ ou arraste o segundo bloco "mova 1 passo" para CIMA do bloco "gire para a direita", para que o robô suba 2 casas até a chave antes de virar!',
    bugDescription: 'O bloco "gire para a direita" foi colocado antes do segundo passo, desviando o robô para o firewall antes de pegar a chave.',
    gridSize: { width: 7, height: 6 },
    startPos: { x: 1, y: 3 },
    startDir: 'UP',
    targetPos: { x: 5, y: 1 },
    obstacles: [
      { x: 2, y: 2 },
      { x: 3, y: 0 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 },
    ],
    gates: [
      { gateCoord: { x: 3, y: 1 }, keyCoord: { x: 1, y: 1 } },
    ],
    maxBlocksFor3Stars: 6, // Bandeira (1) + Mova 2x (2) + GireDir (1) + Repita 4x [Mova] (2) = 6
    maxBlocksFor2Stars: 9,
    baseRewardBytes: 320,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat'],
    initialScript: [
      { id: 'flag-start', type: 'when_flag_clicked', category: 'events' },
      { id: 'b5-m1', type: 'move_forward', category: 'motion' },
      { id: 'b5-turn', type: 'turn_right', category: 'motion' }, // BUG: Girou cedo demais! Precisa subir mais 1 passo até (1,1) antes de girar.
      { id: 'b5-m2', type: 'move_forward', category: 'motion' },
      {
        id: 'b5-rep',
        type: 'repeat',
        category: 'control',
        paramValue: 4,
        children: [
          { id: 'b5-m3', type: 'move_forward', category: 'motion' },
        ],
      },
    ],
  },
  {
    id: 6,
    world: 5,
    title: 'Bug 6: O Paradoxo da Esteira',
    subtitle: 'Física de Movimento Não Compensada',
    description: 'A esteira em (1,3) já impulsiona o Bytezinho 1 casa para cima, mas o autor do código programou 3 passos e bateu no firewall!',
    tip: 'Como a esteira empurra o robô de (1,3) para (1,2), você só precisa de 2 blocos "mova 1 passo" antes de girar à direita. Exclua 1 bloco de movimento antes do giro!',
    bugDescription: 'Há 1 bloco "mova 1 passo" a mais antes do giro porque o autor não descontou o impulso automático da esteira.',
    gridSize: { width: 7, height: 6 },
    startPos: { x: 1, y: 4 },
    startDir: 'UP',
    targetPos: { x: 4, y: 1 },
    obstacles: [
      { x: 1, y: 0 },
      { x: 2, y: 4 }, { x: 2, y: 3 }, { x: 2, y: 2 },
      { x: 3, y: 2 }, { x: 4, y: 2 },
    ],
    conveyors: [
      { coord: { x: 1, y: 3 }, direction: 'UP' },
    ],
    maxBlocksFor3Stars: 7, // Bandeira (1) + Mova 2x (2) + GireDir (1) + Mova 3x (3) = 7
    maxBlocksFor2Stars: 10,
    baseRewardBytes: 360,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat'],
    initialScript: [
      { id: 'flag-start', type: 'when_flag_clicked', category: 'events' },
      { id: 'b6-m1', type: 'move_forward', category: 'motion' }, // pisa na esteira em (1,3) e é arremessado para (1,2)
      { id: 'b6-m2', type: 'move_forward', category: 'motion' }, // chega em (1,1)
      { id: 'b6-m-extra', type: 'move_forward', category: 'motion' }, // BUG: Passo extra que faz bater no firewall em (1,0)!
      { id: 'b6-turn', type: 'turn_right', category: 'motion' },
      { id: 'b6-m3', type: 'move_forward', category: 'motion' },
      { id: 'b6-m4', type: 'move_forward', category: 'motion' },
      { id: 'b6-m5', type: 'move_forward', category: 'motion' },
    ],
  },
];
