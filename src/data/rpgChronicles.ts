import { RpgBoss, RpgFloorData } from '../types/quests';

export interface RpgTextSnippet {
  id: string;
  category: 'prologue' | 'exploration' | 'battle' | 'purification' | 'epic';
  text: string;
  focusKeys?: string[];
}

export const RPG_BOSSES: RpgBoss[] = [
  {
    name: 'Glitch Drake',
    title: 'Sentinela dos Primeiros Toques',
    avatar: '🐉',
    theme: 'emerald',
    maxHp: 180,
    lore: 'Uma manifestação reptiliana de ruído digital que assola a fileira base do teclado.',
    weaknessKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l']
  },
  {
    name: 'Devorador de Memória',
    title: 'Parasita do Buffer de Dados',
    avatar: '👾',
    theme: 'cyan',
    maxHp: 240,
    lore: 'Criatura ectoplásmica que drena a memória de trabalho com lentidão e hesitação motora.',
    weaknessKeys: ['m', 'e', 'r', 'o', 't']
  },
  {
    name: 'Espectro dos Acentos',
    title: 'Guardião da Acentuação Perdida',
    avatar: '🔮',
    theme: 'purple',
    maxHp: 310,
    lore: 'Um fantasma ancestral que bloqueia a passagem de qualquer um que erre a pontuação.',
    weaknessKeys: ['ç', 'á', 'ã', 'é', 'ó']
  },
  {
    name: 'Titã de Silício',
    title: 'Autômato do Núcleo Hexadecimal',
    avatar: '🗿',
    theme: 'amber',
    maxHp: 380,
    lore: 'Um colosso forjado nas profundezas do processador da escola que só cede à cadência inabalável.',
    weaknessKeys: ['c', 'p', 'b', 'v', 'x']
  },
  {
    name: 'Hidra Cibernética',
    title: 'Terror dos Algoritmos Corrompidos',
    avatar: '🐍',
    theme: 'rose',
    maxHp: 460,
    lore: 'A cada erro de digitação, uma nova cabeça de código quebrado surge para ameaçar o terminal.',
    weaknessKeys: ['q', 'p', 'z', 'ç']
  },
  {
    name: 'Lorde do Overclock',
    title: 'Soberano das Chamas Binárias',
    avatar: '🔥',
    theme: 'red',
    maxHp: 550,
    lore: 'O monarca incandescente que exige velocidade de elite e precisão cirúrgica.',
    weaknessKeys: ['w', 'k', 'y', 'g', 'h']
  },
  {
    name: 'Entropia Quântica',
    title: 'Vórtice da Singularidade do Vazio',
    avatar: '🌌',
    theme: 'indigo',
    maxHp: 650,
    lore: 'O teste definitivo dos mestres do Colégio Leopoldina antes da transcrição final.',
    weaknessKeys: ['q', 'u', 'a', 'n', 't']
  }
];

export const RPG_BASE_CHAPTERS: { floor: number; title: string; text: string; bossIndex: number }[] = [
  {
    floor: 1,
    title: 'O Despertar do Terminal',
    text: 'Nas entranhas silenciosas do laboratório do Colégio Leopoldina, uma luz verde cintilou na tela do computador. Um operador corajoso posicionou os dedos na fileira central, pronto para dissipar as trevas do código corrompido com a força de sua digitação.',
    bossIndex: 0
  },
  {
    floor: 2,
    title: 'A Trilha dos Dados Perdidos',
    text: 'Pedaços de arquivos antigos flutuavam pelo túnel de fibra óptica. Cada passo exigia firmeza nas mãos e atenção aos sinais luminosos. Apenas aqueles que mantêm o ritmo conseguem avançar sem tropeçar nas pedras do caminho.',
    bossIndex: 0
  },
  {
    floor: 3,
    title: 'O Portal do Buffer Antigo',
    text: 'Um portal de cobre e circuitos bloqueava a passagem para o setor principal. Para destrancar as engrenagens, o escriba digital precisou conjurar palavras de precisão inabalável, alinhando sua mente ao compasso do relógio.',
    bossIndex: 1
  },
  {
    floor: 4,
    title: 'O Eco da Memória Volátil',
    text: 'Vozes mecânicas sussurravam códigos esquecidos pelas paredes da máquina. O operador respirou fundo, confiou na memória de seus dedos e digitou cada letra com calma, restaurando a harmonia dos circuitos.',
    bossIndex: 1
  },
  {
    floor: 5,
    title: 'O Santuário da Cedilha Mística',
    text: 'No coração do labirinto, a mística letra cedilha brilhava sobre o altar de mármore. O guardião exigia respeito à língua portuguesa e à riqueza dos sinais gráficos que dão vida à nossa comunicação.',
    bossIndex: 2
  },
  {
    floor: 6,
    title: 'O Desfiladeiro dos Acentos',
    text: 'Raios de energia cortavam o céu artificial enquanto palavras com til e acento agudo flutuavam como estrelas cadentes. Quem domina o tempo das teclas mortas domina também o destino de toda a expedição.',
    bossIndex: 2
  },
  {
    floor: 7,
    title: 'A Fornalha de Silício',
    text: 'O calor dos processadores em overclock iluminava a sala de operações. O operador sentiu a pressão do teclado aumentar, mas seu foco permaneceu inabalável diante do monólito de ferro fundido.',
    bossIndex: 3
  },
  {
    floor: 8,
    title: 'A Marcha dos Autômatos',
    text: 'Engrenagens pesadas ecoavam pelo corredor subterrâneo. Cada caractere digitado quebrava uma das correntes que mantinham o antigo servidor aprisionado pela ferrugem do esquecimento.',
    bossIndex: 3
  },
  {
    floor: 9,
    title: 'O Ninho da Hidra Digital',
    text: 'Múltiplas linhas de comando tentaram confundir a visão do herói com mensagens enganosas. Com destreza e rapidez, os dedos dançaram sobre as teclas sem cometer nenhuma falha grave.',
    bossIndex: 4
  },
  {
    floor: 10,
    title: 'A Batalha dos Algoritmos Lendários',
    text: 'No décimo andar da masmorra, o ar vibrava com eletricidade estática. Um grande desafio foi superado: o primeiro marco histórico da jornada rumo ao título de Lenda Leopoldina foi conquistado com honra.',
    bossIndex: 4
  }
];

// Sentenças especializadas em grupos de teclas para injeção adaptativa baseada em telemetria
export const ADAPTIVE_RPG_LORE: Record<string, string[]> = {
  p_c_ç: [
    'O paladino purificou a praça com sua lança prateada, quebrando o feitiço do poço com calma e precisão.',
    'Na câmara de pedra, o capitão colocou a taça de cristal sobre a mesa redonda para iniciar a prece da vitória.',
    'Pássaros de fogo cruzaram o céu da praça, espalhando poeira mágica sobre a carruagem do nobre príncipe.'
  ],
  q_a_z: [
    'O arqueiro apontou a flecha mágica para o quadro de cristal azul quando o zumbido ecoou na caverna.',
    'Quinze guardas de armadura azulada guardavam a alameda congelada onde jazia a chave de quartzo puro.',
    'A água da fonte quebrou o silêncio da colina com um som quase inaudível, atraindo a atenção das criaturas.'
  ],
  accents: [
    'O sábio médico da corte reuniu os irmãos para explicar a lição do coração com paciência e dedicação.',
    'A lâmpada do gênio iluminou o túnel úmido onde o baú dourado continha a bússola mágica dos navegantes.',
    'A canção do vento trouxe a notícia da vitória para toda a nação, celebrando a glória dos bravos heróis.'
  ],
  speed_flow: [
    'O relâmpago veloz cruzou o horizonte distante, guiando os viajantes pelas colinas seguras até a fortaleza.',
    'Correndo em ritmo perfeito contra o relógio, o mensageiro levou o decreto imperial antes do pôr do sol.',
    'A energia do terminal fluiu pelos fios dourados em sincronia total com o bater acelerado do coração.'
  ]
};
