// ─────────────────────────────────────────────────────────────
// Níveis Artesanais Pedagógicos — ScratchBot: Logic Quest
// 16 Fases Estruturadas em 6 Mundos com Progressão Gradual
// ─────────────────────────────────────────────────────────────
import { ScratchLevelDef } from '../../../types/scratchBot';

export const PEDAGOGICAL_LEVELS: ScratchLevelDef[] = [
  // ═════════════════════════════════════════════════════════════
  // MUNDO 1: FUNDAMENTOS & SEQUENCIAMENTO ESPACIAL
  // ═════════════════════════════════════════════════════════════
  {
    id: 1,
    world: 1,
    title: 'Fase 1: Primeiros Passos',
    subtitle: 'Sequência Linear',
    description: 'Ajude Bytezinho a chegar ao portal de dados programando passos em linha reta.',
    tip: 'O bloco chapéu "Quando bandeira verde" dá início ao código. Adicione 3 blocos "Mova 1 passo" para alcançar o portal.',
    gridSize: { width: 5, height: 5 },
    startPos: { x: 1, y: 2 },
    startDir: 'RIGHT',
    targetPos: { x: 4, y: 2 },
    obstacles: [],
    maxBlocksFor3Stars: 4, // Bandeira (1) + Mova (3) = 4
    maxBlocksFor2Stars: 5,
    baseRewardBytes: 100,
    availableBlockTypes: ['move_forward'],
  },
  {
    id: 2,
    world: 1,
    title: 'Fase 2: O Primeiro Giro',
    subtitle: 'Mudança de Orientação',
    description: 'Um obstáculo fixo bloqueia a passagem direta. Gire o robô para contorná-lo.',
    tip: 'Lembre-se: os blocos de girar apenas alteram a direção para onde o Bytezinho está olhando, sem deslocá-lo de casa!',
    gridSize: { width: 5, height: 5 },
    startPos: { x: 1, y: 3 },
    startDir: 'RIGHT',
    targetPos: { x: 3, y: 1 },
    obstacles: [
      { x: 2, y: 3 },
      { x: 3, y: 2 },
    ],
    maxBlocksFor3Stars: 7, // Bandeira (1) + GireEsq (1) + Mova (2) + GireDir (1) + Mova (2) = 7
    maxBlocksFor2Stars: 9,
    baseRewardBytes: 130,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right'],
  },
  {
    id: 3,
    world: 1,
    title: 'Fase 3: Zigue-Zague no Firewall',
    subtitle: 'Alternância de Curvas',
    description: 'Navegue pelo labirinto de firewalls alternando giros à direita e à esquerda.',
    tip: 'Aponte o dedo na direção do olhar do robô para nunca se confundir entre a esquerda e a direita dele!',
    gridSize: { width: 5, height: 5 },
    startPos: { x: 0, y: 1 },
    startDir: 'RIGHT',
    targetPos: { x: 3, y: 3 },
    obstacles: [
      { x: 2, y: 0 }, { x: 2, y: 1 },
      { x: 1, y: 3 }, { x: 1, y: 4 },
    ],
    maxBlocksFor3Stars: 9, // Bandeira (1) + Mova + GireDir + Mova + GireEsq + Mova 2x + GireDir + Mova = 9
    maxBlocksFor2Stars: 12,
    baseRewardBytes: 160,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right'],
  },

  // ═════════════════════════════════════════════════════════════
  // MUNDO 2: O PODER DA REPETIÇÃO (LOOPS)
  // ═════════════════════════════════════════════════════════════
  {
    id: 4,
    world: 2,
    title: 'Fase 4: A Reta dos Dados',
    subtitle: 'Introdução ao Laço Repita',
    description: 'Um corredor longo com 6 casas de distância. Use o bloco de repetição para otimizar seu código!',
    tip: 'O estoque de blocos de movimento é limitado! Coloque 1 bloco de mover dentro do "Repita 6 vezes" para bater a meta de 3 estrelas.',
    gridSize: { width: 8, height: 5 },
    startPos: { x: 0, y: 2 },
    startDir: 'RIGHT',
    targetPos: { x: 6, y: 2 },
    obstacles: [
      { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
      { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
    ],
    blockLimits: { move_forward: 2 }, // Limite rigoroso de estoque que força o uso do laço!
    maxBlocksFor3Stars: 3, // Bandeira (1) + Repita 6x (1) + Mova (1) = 3
    maxBlocksFor2Stars: 5,
    baseRewardBytes: 200,
    availableBlockTypes: ['move_forward', 'repeat'],
  },
  {
    id: 5,
    world: 2,
    title: 'Fase 5: A Escadaria Cibernética',
    subtitle: 'Múltiplos Blocos no Loop',
    description: 'Suba os 3 degraus do setor identificando o padrão que se repete a cada lance de escada.',
    tip: 'Um degrau consiste em: mover 1 passo, girar à esquerda (para subir), mover 1 passo e girar à direita. Repita 3 vezes!',
    gridSize: { width: 5, height: 5 },
    startPos: { x: 0, y: 4 },
    startDir: 'RIGHT',
    targetPos: { x: 3, y: 1 },
    obstacles: [
      { x: 2, y: 4 }, { x: 3, y: 3 }, { x: 4, y: 2 },
      { x: 0, y: 2 }, { x: 1, y: 1 }, { x: 2, y: 0 },
    ],
    maxBlocksFor3Stars: 6, // Bandeira (1) + Repita 3x [Mova, GireEsq, Mova, GireDir] = 6 blocos
    maxBlocksFor2Stars: 10,
    baseRewardBytes: 230,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat'],
  },
  {
    id: 6,
    world: 2,
    title: 'Fase 6: O Circuito Quadrado',
    subtitle: 'Geometria Computacional',
    description: 'Contorne o servidor central de firewalls para alcançar o portal no canto oposto.',
    tip: 'Cada lado do contorno tem 2 passos seguidos de um giro à direita. Repita esse padrão 3 vezes!',
    gridSize: { width: 5, height: 5 },
    startPos: { x: 1, y: 3 },
    startDir: 'UP',
    targetPos: { x: 3, y: 3 },
    obstacles: [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
    maxBlocksFor3Stars: 5, // Bandeira (1) + Repita 3x [Mova, Mova, GireDir] = 5 blocos
    maxBlocksFor2Stars: 8,
    baseRewardBytes: 260,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat'],
  },

  // ═════════════════════════════════════════════════════════════
  // MUNDO 3: AÇÕES & MINERAÇÃO DE DADOS (GEMAS)
  // ═════════════════════════════════════════════════════════════
  {
    id: 7,
    world: 3,
    title: 'Fase 7: Mineração na Rede',
    subtitle: 'Bloco Coletar Gema',
    description: 'O portal de saída está energizado e só abrirá se todas as gemas criptográficas forem mineradas.',
    tip: 'Ao parar na mesma casa da gema, utilize o bloco roxo "Coletar Gema" para minerá-la.',
    gridSize: { width: 6, height: 6 },
    startPos: { x: 0, y: 2 },
    startDir: 'RIGHT',
    targetPos: { x: 5, y: 2 },
    obstacles: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
      { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
    ],
    gems: [
      { x: 2, y: 2 },
      { x: 4, y: 2 },
    ],
    maxBlocksFor3Stars: 8, // Bandeira (1) + Mova 2x (2) + Coletar (1) + Mova 2x (2) + Coletar (1) + Mova (1) = 8
    maxBlocksFor2Stars: 10,
    baseRewardBytes: 290,
    availableBlockTypes: ['move_forward', 'collect_gem'],
  },
  {
    id: 8,
    world: 3,
    title: 'Fase 8: Colheita Automatizada',
    subtitle: 'Ação e Movimento em Loop',
    description: 'Três gemas estão distribuídas em intervalos regulares. Crie um loop que mova e colete ritmadamente.',
    tip: 'Descubra a combinação exata: dê 2 passos e colete a gema dentro de um "Repita 3 vezes"!',
    gridSize: { width: 7, height: 7 },
    startPos: { x: 0, y: 3 },
    startDir: 'RIGHT',
    targetPos: { x: 6, y: 3 },
    obstacles: [
      { x: 1, y: 2 }, { x: 3, y: 2 }, { x: 5, y: 2 },
      { x: 1, y: 4 }, { x: 3, y: 4 }, { x: 5, y: 4 },
    ],
    gems: [
      { x: 2, y: 3 },
      { x: 4, y: 3 },
      { x: 6, y: 3 },
    ],
    maxBlocksFor3Stars: 5, // Bandeira (1) + Repita 3x [Mova, Mova, Coletar] = 5 blocos
    maxBlocksFor2Stars: 9,
    baseRewardBytes: 320,
    availableBlockTypes: ['move_forward', 'collect_gem', 'repeat'],
  },

  // ═════════════════════════════════════════════════════════════
  // MUNDO 4: ZONAS DE RISCO & FÍSICA DO GRID (EMP & ESTEIRAS)
  // ═════════════════════════════════════════════════════════════
  {
    id: 9,
    world: 4,
    title: 'Fase 9: Campo Eletromagnético (EMP)',
    subtitle: 'Zonas de Perigo Energizadas',
    description: 'Pisos condutores emitem pulsos de sobrecarga. Você pode atravessá-los, mas NUNCA gire ou termine um ciclo de loop sobre eles!',
    tip: 'Coloque 2 blocos "Mova 1 passo" dentro do laço para saltar sobre os pisos EMP e pousar sempre nas casas seguras!',
    gridSize: { width: 7, height: 7 },
    startPos: { x: 1, y: 1 },
    startDir: 'RIGHT',
    targetPos: { x: 5, y: 5 },
    obstacles: [
      { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 },
    ],
    hazards: [
      { x: 2, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 2 },
      { x: 5, y: 4 },
    ],
    maxBlocksFor3Stars: 8, // Bandeira (1) + Repita 2x [Mova, Mova] (3) + GireDir (1) + Repita 2x [Mova, Mova] (3) = 8 (ou 7 com loop único)
    maxBlocksFor2Stars: 12,
    baseRewardBytes: 350,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat'],
  },
  {
    id: 10,
    world: 4,
    title: 'Fase 10: Turbinas de Aceleração',
    subtitle: 'Esteiras de Impulso',
    description: 'Esteiras de aceleração empurram o robô instantaneamente para a casa seguinte, economizando passos.',
    tip: 'As duas esteiras dão 2 impulsos gratuitos! Você só precisa programar 4 passos (ou usar Repita 4x [Mova]) para cruzar as 6 casas.',
    gridSize: { width: 7, height: 5 },
    startPos: { x: 0, y: 2 },
    startDir: 'RIGHT',
    targetPos: { x: 6, y: 2 },
    obstacles: [
      { x: 2, y: 1 }, { x: 4, y: 1 },
      { x: 2, y: 3 }, { x: 4, y: 3 },
    ],
    conveyors: [
      { coord: { x: 2, y: 2 }, direction: 'RIGHT' },
      { coord: { x: 4, y: 2 }, direction: 'RIGHT' },
    ],
    maxBlocksFor3Stars: 5, // Bandeira (1) + Repita 4x [Mova] (2) = 3 blocos, ou 4x Mova = 5 blocos
    maxBlocksFor2Stars: 7,
    baseRewardBytes: 380,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat'],
  },

  // ═════════════════════════════════════════════════════════════
  // MUNDO 5: SEGURANÇA, WARP & DESAFIOS INTEGRADOS
  // ═════════════════════════════════════════════════════════════
  {
    id: 11,
    world: 5,
    title: 'Fase 11: Salto Quântico no Setor',
    subtitle: 'Warp Pad Unidirecional',
    description: 'Uma muralha de firewalls impede a passagem direta. Utilize o portal Warp para saltar para o outro setor!',
    tip: 'Suba 4 casas, gire à direita e avance até o portal W1A. Ao sair em W1B, avance 2 casas e suba 4 casas até a saída!',
    gridSize: { width: 8, height: 8 },
    startPos: { x: 0, y: 6 },
    startDir: 'UP',
    targetPos: { x: 7, y: 1 },
    obstacles: [
      { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 },
      { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 },
    ],
    teleporters: [
      { from: { x: 1, y: 2 }, to: { x: 5, y: 5 } },
    ],
    maxBlocksFor3Stars: 10, // Bandeira (1) + Repita 4x [Mova] (2) + GireDir (1) + Mova (1) + Mova 2x (2) + GireEsq (1) + Repita 4x [Mova] (2) = 10
    maxBlocksFor2Stars: 14,
    baseRewardBytes: 410,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat'],
  },
  {
    id: 12,
    world: 5,
    title: 'Fase 12: Protocolo Criptográfico',
    subtitle: 'Chave e Portão Laser',
    description: 'O portão a laser bloqueia o acesso ao portal. Colete a chave de acesso no topo antes de cruzar o portão!',
    tip: 'A chave é passiva: basta pisar na casa (1,1) para desativar a barreira laser do portão em (3,2)!',
    gridSize: { width: 8, height: 8 },
    startPos: { x: 1, y: 6 },
    startDir: 'UP',
    targetPos: { x: 6, y: 2 },
    obstacles: [
      { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 },
    ],
    gates: [
      { gateCoord: { x: 3, y: 2 }, keyCoord: { x: 1, y: 1 } },
    ],
    maxBlocksFor3Stars: 10, // Bandeira (1) + Repita 5x [Mova] (2) + GireDir (1) + Mova (1) + GireDir (1) + Mova (1) + GireEsq (1) + Repita 4x [Mova] (2) = 10
    maxBlocksFor2Stars: 15,
    baseRewardBytes: 440,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat'],
  },
  {
    id: 13,
    world: 5,
    title: 'Fase 13: O Desafio dos Guardiões',
    subtitle: 'Integração Chave, EMP & Esteira',
    description: 'Use as esteiras em cascata para subir rapidamente até a chave, atravesse os pisos EMP sem parar sobre eles e cruze o portão!',
    tip: 'Ao dar 1 passo para (1,5), as esteiras lançam o robô até (1,3). Dê mais 2 passos até a chave em (1,1), gire à direita e use Repita 3x [Mova, Mova]!',
    gridSize: { width: 8, height: 8 },
    startPos: { x: 1, y: 6 },
    startDir: 'UP',
    targetPos: { x: 7, y: 1 },
    obstacles: [
      { x: 4, y: 0 }, { x: 4, y: 2 }, { x: 4, y: 3 },
      { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 },
    ],
    gates: [
      { gateCoord: { x: 4, y: 1 }, keyCoord: { x: 1, y: 1 } },
    ],
    hazards: [
      { x: 1, y: 2 },
      { x: 2, y: 1 },
      { x: 6, y: 1 },
    ],
    conveyors: [
      { coord: { x: 1, y: 5 }, direction: 'UP' },
      { coord: { x: 1, y: 4 }, direction: 'UP' },
    ],
    maxBlocksFor3Stars: 9, // Bandeira (1) + 3x Mova (3) + GireDir (1) + Repita 3x [Mova, Mova] (3) = 8 blocos
    maxBlocksFor2Stars: 14,
    baseRewardBytes: 470,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat'],
  },
  {
    id: 14,
    world: 5,
    title: 'Fase 14: Mestre do Mainframe',
    subtitle: 'O Teste Supremo de Otimização',
    description: 'O grande teste do Mundo 5! Combine Chave, Portão Laser, Esteira, Pisos EMP e Coleta de Gemas para vencer.',
    tip: 'Use Repita 3x [Mova, Mova] para subir até (1,1) saltando os EMPs e ativando a chave em (1,3). Colete a gema, gire à direita e repita a dose até (8,1)!',
    gridSize: { width: 9, height: 9 },
    startPos: { x: 1, y: 7 },
    startDir: 'UP',
    targetPos: { x: 8, y: 1 },
    obstacles: [
      { x: 2, y: 7 }, { x: 2, y: 6 }, { x: 2, y: 5 }, { x: 2, y: 4 }, { x: 2, y: 3 }, { x: 2, y: 2 },
      { x: 5, y: 0 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 },
    ],
    gates: [
      { gateCoord: { x: 5, y: 1 }, keyCoord: { x: 1, y: 3 } },
    ],
    hazards: [
      { x: 1, y: 6 },
      { x: 1, y: 2 },
      { x: 7, y: 1 },
    ],
    conveyors: [
      { coord: { x: 3, y: 1 }, direction: 'RIGHT' },
    ],
    gems: [
      { x: 1, y: 1 },
      { x: 8, y: 1 },
    ],
    maxBlocksFor3Stars: 12, // Solução sequencial com loops = 12 blocos; solução com loop aninhado = 8 blocos
    maxBlocksFor2Stars: 18,
    baseRewardBytes: 600,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat', 'collect_gem'],
  },

  // ═════════════════════════════════════════════════════════════
  // MUNDO 6: SENSORES & CONDICIONAIS INTELIGENTES
  // ═════════════════════════════════════════════════════════════
  {
    id: 15,
    world: 6,
    title: 'Fase 15: O Sensor de Caminho',
    subtitle: 'Condicional: Se Caminho à Frente',
    description: 'Aprenda a criar robôs autônomos! Use o bloco condicional para o Bytezinho verificar se o caminho à frente está desimpedido.',
    tip: 'Coloque "Mova 1 passo" dentro do bloco "Se caminho à frente" e repita 4 vezes para avançar com segurança até o portal!',
    gridSize: { width: 7, height: 6 },
    startPos: { x: 1, y: 3 },
    startDir: 'RIGHT',
    targetPos: { x: 5, y: 3 },
    obstacles: [
      { x: 3, y: 1 }, { x: 3, y: 2 },
      { x: 3, y: 4 }, { x: 3, y: 5 },
    ],
    optionalGems: [
      { x: 3, y: 0 },
    ],
    maxBlocksFor3Stars: 4, // Bandeira (1) + Repita 4x (1) + Se Caminho (1) + Mova (1) = 4
    maxBlocksFor2Stars: 8,
    baseRewardBytes: 520,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat', 'collect_gem', 'if_path_ahead'],
  },
  {
    id: 16,
    world: 6,
    title: 'Fase 16: O Minerador Autônomo',
    subtitle: 'Condicional: Se Sobre Gema',
    description: 'Automatize a colheita de dados! Percorra o corredor usando o sensor de gema para minerar sem precisar fixar o ponto exato.',
    tip: 'Dentro do "Repita 5 vezes", coloque "Mova 1 passo" e depois "Se sobre gema então" com "Coletar gema" dentro dele!',
    gridSize: { width: 8, height: 6 },
    startPos: { x: 1, y: 2 },
    startDir: 'RIGHT',
    targetPos: { x: 6, y: 2 },
    obstacles: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 },
      { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 },
    ],
    gems: [
      { x: 2, y: 2 },
      { x: 5, y: 2 },
    ],
    optionalGems: [
      { x: 4, y: 2 },
    ],
    maxBlocksFor3Stars: 5, // Bandeira (1) + Repita 5x (1) + Mova (1) + Se Gema (1) + Coletar (1) = 5
    maxBlocksFor2Stars: 8,
    baseRewardBytes: 580,
    availableBlockTypes: ['move_forward', 'turn_left', 'turn_right', 'repeat', 'collect_gem', 'if_on_gem'],
  },
];
