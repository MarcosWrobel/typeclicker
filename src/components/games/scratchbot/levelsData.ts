// ─────────────────────────────────────────────────────────────
// Níveis Artesanais Pedagógicos — ScratchBot: Logic Quest
// ─────────────────────────────────────────────────────────────
import { ScratchLevelDef } from '../../../types/scratchBot';

export const PEDAGOGICAL_LEVELS: ScratchLevelDef[] = [
  {
    id: 1,
    title: 'Fase 1: Primeiros Passos',
    subtitle: 'Sequência Linear',
    description: 'Ajude Bytezinho a chegar ao portal de dados programando passos em linha reta.',
    tip: 'Use os blocos azuis "Mova 1 passo para frente" para avançar até o portal.',
    gridSize: { width: 5, height: 5 },
    startPos: { x: 1, y: 2 },
    startDir: 'RIGHT',
    targetPos: { x: 3, y: 2 },
    obstacles: [],
    maxBlocksFor3Stars: 3,
    maxBlocksFor2Stars: 4,
    baseRewardBytes: 100,
    availableBlockTypes: ['move_forward'],
  },
  {
    id: 2,
    title: 'Fase 2: Curvas e Orientação',
    subtitle: 'Mudança de Direção',
    description: 'O portal está na parte superior do circuito. Vire o robô para navegar pela curva.',
    tip: 'Lembre-se: virar não move o robô, apenas altera a direção para onde ele está olhando!',
    gridSize: { width: 5, height: 5 },
    startPos: { x: 1, y: 3 },
    startDir: 'RIGHT',
    targetPos: { x: 3, y: 1 },
    obstacles: [{ x: 3, y: 3 }, { x: 1, y: 1 }],
    maxBlocksFor3Stars: 5,
    maxBlocksFor2Stars: 7,
    baseRewardBytes: 150,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right'],
  },
  {
    id: 3,
    title: 'Fase 3: O Poder da Repetição e Esteiras',
    subtitle: 'Laço Repita N Vezes & Esteira Aceleradora',
    description: 'Um corredor longo com esteira aceleradora de impulsão. Aproveite o impulso para otimizar os blocos!',
    tip: 'Pise na esteira cibernética para ser impulsionado 1 casa à frente sem gastar bloco de movimento extra!',
    gridSize: { width: 6, height: 5 },
    startPos: { x: 0, y: 2 },
    startDir: 'RIGHT',
    targetPos: { x: 5, y: 2 },
    obstacles: [{ x: 2, y: 1 }, { x: 2, y: 3 }],
    conveyors: [
      { coord: { x: 2, y: 2 }, direction: 'RIGHT' }
    ],
    maxBlocksFor3Stars: 3, // when_flag + repeat + move_forward
    maxBlocksFor2Stars: 6,
    baseRewardBytes: 200,
    availableBlockTypes: ['move_forward', 'repeat'],
  },
  {
    id: 4,
    title: 'Fase 4: Salto Quântico no Setor',
    subtitle: 'Warp Pad & Repetição',
    description: 'Um abismo de firewalls impede a passagem direta. Utilize o Teletransportador Quântico para saltar o bloqueio!',
    tip: 'O Warp Pad te transporta instantaneamente para o ponto de saída mantendo sua orientação.',
    gridSize: { width: 6, height: 6 },
    startPos: { x: 0, y: 4 },
    startDir: 'RIGHT',
    targetPos: { x: 5, y: 1 },
    obstacles: [
      { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 },
    ],
    teleporters: [
      { from: { x: 1, y: 4 }, to: { x: 3, y: 2 } }
    ],
    maxBlocksFor3Stars: 6,
    maxBlocksFor2Stars: 10,
    baseRewardBytes: 250,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat'],
  },
  {
    id: 5,
    title: 'Fase 5: Sobrecarga Elétrica e Serpentina',
    subtitle: 'EMP Hazards & Laços Precisos',
    description: 'Pisos condutores emitem pulsos de sobrecarga (EMP). Atravesse-os, mas NUNCA termine sua execução parado neles!',
    tip: 'O robô pode passar pelos pisos elétricos, mas sofrerá curto-circuito se parar sobre um deles no fim do código.',
    gridSize: { width: 6, height: 6 },
    startPos: { x: 0, y: 0 },
    startDir: 'RIGHT',
    targetPos: { x: 5, y: 5 },
    obstacles: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 },
      { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
    ],
    hazards: [
      { x: 2, y: 0 },
      { x: 3, y: 2 },
      { x: 2, y: 4 },
    ],
    maxBlocksFor3Stars: 10,
    maxBlocksFor2Stars: 16,
    baseRewardBytes: 300,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat'],
  },
  {
    id: 6,
    title: 'Fase 6: Portão Laser Criptografado',
    subtitle: 'Chave de Acesso & Desbloqueio',
    description: 'Um portão laser intransponível bloqueia o centro. Colete a Chave Criptográfica no terminal para abrir o portão!',
    tip: 'Passe pela chave para desativar a barreira laser do portão e permitir o acesso ao portal.',
    gridSize: { width: 7, height: 7 },
    startPos: { x: 0, y: 0 },
    startDir: 'RIGHT',
    targetPos: { x: 3, y: 3 },
    obstacles: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 4, y: 5 }, { x: 3, y: 5 }, { x: 2, y: 5 },
      { x: 1, y: 5 }, { x: 1, y: 4 }, { x: 1, y: 3 },
      { x: 4, y: 3 }
    ],
    gates: [
      { gateCoord: { x: 2, y: 3 }, keyCoord: { x: 5, y: 5 } }
    ],
    maxBlocksFor3Stars: 14,
    maxBlocksFor2Stars: 20,
    baseRewardBytes: 350,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat'],
  },
  {
    id: 7,
    title: 'Fase 7: Coleta de Dados Multidimensional',
    subtitle: 'Ação, Warp & Gemas Cripto',
    description: 'Colete todas as gemas criptográficas espalhadas entre zonas isoladas usando o teletransportador.',
    tip: 'Planeje sua rota: colete a primeira gema, use o Warp Pad para a outra área e colete as restantes!',
    gridSize: { width: 7, height: 7 },
    startPos: { x: 1, y: 5 },
    startDir: 'UP',
    targetPos: { x: 5, y: 1 },
    obstacles: [
      { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 },
    ],
    gems: [
      { x: 1, y: 1 },
      { x: 5, y: 5 },
      { x: 5, y: 3 }
    ],
    teleporters: [
      { from: { x: 1, y: 2 }, to: { x: 4, y: 5 } }
    ],
    conveyors: [
      { coord: { x: 5, y: 4 }, direction: 'UP' }
    ],
    maxBlocksFor3Stars: 14,
    maxBlocksFor2Stars: 20,
    baseRewardBytes: 400,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat', 'collect_gem'],
  },
  {
    id: 8,
    title: 'Fase 8: Grande Desafio do Mainframe',
    subtitle: 'Mestrado em Algoritmos e Obstáculos',
    description: 'O teste definitivo! Combina Firewalls, Portão Laser, Piso Elétrico, Esteiras de Impulso e Coleta de Gemas.',
    tip: 'Desbloqueie o portão coletando a chave, cuidado com os pisos de choque e use as esteiras para maximizar sua eficiência!',
    gridSize: { width: 8, height: 8 },
    startPos: { x: 0, y: 7 },
    startDir: 'UP',
    targetPos: { x: 7, y: 0 },
    obstacles: [
      { x: 2, y: 7 }, { x: 2, y: 6 }, { x: 2, y: 5 }, { x: 2, y: 4 },
      { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 },
      { x: 6, y: 7 }, { x: 6, y: 6 }, { x: 6, y: 5 }
    ],
    gates: [
      { gateCoord: { x: 4, y: 3 }, keyCoord: { x: 1, y: 2 } }
    ],
    hazards: [
      { x: 0, y: 4 },
      { x: 3, y: 6 },
      { x: 5, y: 1 }
    ],
    conveyors: [
      { coord: { x: 3, y: 4 }, direction: 'RIGHT' }
    ],
    gems: [
      { x: 0, y: 3 },
      { x: 3, y: 5 },
      { x: 5, y: 2 },
      { x: 7, y: 4 }
    ],
    maxBlocksFor3Stars: 18,
    maxBlocksFor2Stars: 26,
    baseRewardBytes: 500,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat', 'collect_gem'],
  },
];
