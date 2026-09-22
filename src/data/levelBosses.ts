/**
 * Catálogo e Configuração dos Guardiões de Nível (Tier Boss Encounters)
 * Desafios dinâmicos acionados a cada 10 níveis com mecânicas e chefes temáticos únicos.
 */

export type BossMechanicType =
  | 'basic'          // Nv 10: Sentinela ABNT2 (Tempo de Aprendiz, +1s bônus por palavra concluída)
  | 'shield'         // Nv 20: Glitch do Laboratório (Mini-escudo de caracteres antes da palavra)
  | 'heat'           // Nv 30: Sobrecarga de Overclock (Cadência térmica: digitação rápida resfria o sistema)
  | 'loop_break'     // Nv 40: O Loop Infinito (Palavras com finalizador de quebra de fluxo BREAK / EXIT)
  | 'two_phase'      // Nv 50: O Compilador Implacável (Fase 1: Correção de Bugs + Fase 2: Finalizador)
  | 'firewall_pulse' // Nv 60: Worm Zero-Day (Pulsos de pacotes defensivos)
  | 'branching'      // Nv 70: Titã do Merge Conflict (Escolha de rota estratégica: Rápida vs Dano Massivo)
  | 'glitch_decode'  // Nv 80: Kernel Panic Quântico (Descriptografia de sequências de memória)
  | 'cast_bar'       // Nv 90: Superinteligência Sintética (Cast bar de invasão que é interrompida com acertos)
  | 'supreme_trio';  // Nv 100: Guardião Supremo dos Bytes (Confronto lendário em 3 fases climáticas)

export interface LevelBossDef {
  level: number;
  name: string;
  title: string;
  avatar: string;
  themeColor: 'emerald' | 'cyan' | 'amber' | 'purple' | 'blue' | 'rose' | 'fuchsia' | 'violet' | 'indigo' | 'gold';
  lore: string;
  mechanicType: BossMechanicType;
  mechanicBadge: string;
  mechanicDescription: string;
  baseHp: number;
  timeLimitSeconds: number;
  baseRewardBytes: number;
  words: string[];
  // Mecânicas adicionais opcionais
  shieldTokens?: string[];
  breakCommands?: string[];
  phaseTwoWords?: string[];
  phaseThreeWords?: string[];
  branchPairs?: Array<{
    fast: { word: string; damage: number };
    heavy: { word: string; damage: number };
  }>;
  castBarSeconds?: number;
}

export const LEVEL_BOSSES: Record<number, LevelBossDef> = {
  10: {
    level: 10,
    name: 'Sentinela ABNT2',
    title: 'Guardião da Fileira Central',
    avatar: '🛡️',
    themeColor: 'emerald',
    lore: 'O primeiro protetor do laboratório de informática. Testa se você domina a posição base das mãos sem abaixar a cabeça.',
    mechanicType: 'basic',
    mechanicBadge: '⏱️ TEMPO DE APRENDIZ',
    mechanicDescription: 'Cada palavra digitada com perfeição concede +2 segundos extras no cronômetro!',
    baseHp: 100,
    timeLimitSeconds: 24,
    baseRewardBytes: 25000,
    words: ['TECLADO', 'CENTRAL', 'POSTURA', 'CADENCIA', 'ALGORITMO']
  },

  20: {
    level: 20,
    name: 'Glitch do Laboratório',
    title: 'Kernel Rebelde dos Chromebooks',
    avatar: '🐧',
    themeColor: 'cyan',
    lore: 'Um bug travesso nos computadores da escola que cria barreiras de proteção antes dos comandos reais.',
    mechanicType: 'shield',
    mechanicBadge: '🔰 ESCUDO HACKER',
    mechanicDescription: 'O Boss ativa mini-escudos de proteção. Digite o código do escudo para expor o núcleo!',
    baseHp: 150,
    timeLimitSeconds: 22,
    baseRewardBytes: 60000,
    shieldTokens: ['[OK]', '{GO}', '<404>', '[DEV]'],
    words: ['TERMINAL', 'SISTEMA', 'CONEXAO', 'PACOTES', 'ROTEADOR']
  },

  30: {
    level: 30,
    name: 'Sobrecarga de Overclock',
    title: 'Autômato Térmico da Sala 2',
    avatar: '⚡',
    themeColor: 'amber',
    lore: 'As máquinas do laboratório atingiram rotação máxima! Mantenha ritmo constante para não deixar o sistema superaquecer.',
    mechanicType: 'heat',
    mechanicBadge: '🔥 RESFRIAMENTO ATIVO',
    mechanicDescription: 'Pausas longas fazem o tempo evaporar! Digite sem hesitar para aplicar resfriamento de emergência (+1.5s).',
    baseHp: 200,
    timeLimitSeconds: 20,
    baseRewardBytes: 120000,
    words: ['PROCESSADOR', 'RESFRIAMENTO', 'FREQUENCIA', 'CIRCUITO', 'VOLTAGEM']
  },

  40: {
    level: 40,
    name: 'O Loop Infinito',
    title: 'Recursão Incontrolável do Sistema',
    avatar: '🔄',
    themeColor: 'purple',
    lore: 'Um trecho de código preso em laço de repetição eterno. Apenas um comando de quebra cirúrgico pode libertar o buffer.',
    mechanicType: 'loop_break',
    mechanicBadge: '🛑 INTERRUPÇÃO DE FLUXO',
    mechanicDescription: 'Após digitar a palavra técnica, execute imediatamente o comando de quebra BREAK para golpear o Boss!',
    baseHp: 250,
    timeLimitSeconds: 21,
    baseRewardBytes: 250000,
    breakCommands: ['BREAK;', 'EXIT;', 'RETURN;'],
    words: ['ITERACAO', 'RECURSAO', 'CONDICIONAL', 'ENQUANTO', 'VARIAVEL']
  },

  50: {
    level: 50,
    name: 'O Compilador Implacável',
    title: 'Homenagem da Metade da Jornada',
    avatar: '🎓',
    themeColor: 'blue',
    lore: 'O grande juiz de sintaxe do laboratório de informática. Não tolera avisos de compilação e desafia os melhores alunos em 2 fases!',
    mechanicType: 'two_phase',
    mechanicBadge: '⚔️ BATALHA EM 2 FASES',
    mechanicDescription: 'Fase 1: Corrija os erros de compilação. Fase 2: O Compilador entra em exaustão e exige a sequência final!',
    baseHp: 300,
    timeLimitSeconds: 26,
    baseRewardBytes: 500000,
    words: ['SINTAXE', 'SEMANTICA', 'BIBLIOTECA', 'DEPURACAO'],
    phaseTwoWords: ['SUCESSO_ZERO_ERROS', 'BUILD_CONCLUIDA']
  },

  60: {
    level: 60,
    name: 'Worm Zero-Day',
    title: 'Ameaça Cibernética Distribuída',
    avatar: '👾',
    themeColor: 'rose',
    lore: 'Um vírus de rede tentando interceptar os pacotes escolares. Erga a muralha de defesa digital antes da propagação total.',
    mechanicType: 'firewall_pulse',
    mechanicBadge: '📡 PULSO DE FIREWALL',
    mechanicDescription: 'O malware lança pulsos de contaminação. Digite com alta precisão para anular a onda defensiva.',
    baseHp: 350,
    timeLimitSeconds: 20,
    baseRewardBytes: 850000,
    words: ['CRIPTOGRAFIA', 'AUTENTICACAO', 'CERTIFICADO', 'INTRUSAO', 'SENTINELA']
  },

  70: {
    level: 70,
    name: 'Titã do Merge Conflict',
    title: 'Guardião dos Branches Divergentes',
    avatar: '🌿',
    themeColor: 'fuchsia',
    lore: 'Dois ramos de desenvolvimento colidiram no repositório central! Escolha a rota tática correta para reconciliar o código.',
    mechanicType: 'branching',
    mechanicBadge: '🔀 ESCOLHA DE ROTA TÁTICA',
    mechanicDescription: 'Escolha seu golpe: Rota Ágil (palavra curta, 30% dano) ou Rota Massiva (palavra longa, 70% dano fatal)!',
    baseHp: 400,
    timeLimitSeconds: 22,
    baseRewardBytes: 1300000,
    words: ['REPOSITORIO', 'SINCRONIA', 'BRANCH', 'INTEGRACAO'],
    branchPairs: [
      { fast: { word: 'PUSH', damage: 60 }, heavy: { word: 'REBASE_CONTINUE', damage: 140 } },
      { fast: { word: 'FETCH', damage: 60 }, heavy: { word: 'RESOLVER_CONFLITOS', damage: 140 } },
      { fast: { word: 'MERGE', damage: 70 }, heavy: { word: 'INTEGRACAO_CONTINUA', damage: 160 } }
    ]
  },

  80: {
    level: 80,
    name: 'Kernel Panic Quântico',
    title: 'Colapso de Memória dos Servidores',
    avatar: '🔮',
    themeColor: 'violet',
    lore: 'Os registros quânticos do laboratório estão instáveis. As instruções sofrem interferência eletromagnética em tempo real.',
    mechanicType: 'glitch_decode',
    mechanicBadge: '🧩 DECODIFICAÇÃO QUÂNTICA',
    mechanicDescription: 'Os glifos oscilam com interferência digital e revelam sua forma nítida à medida que seus dedos avançam.',
    baseHp: 450,
    timeLimitSeconds: 21,
    baseRewardBytes: 2000000,
    words: ['ENTROPIA', 'SUPERPOSICAO', 'PROBABILIDADE', 'TELEMETRIA', 'PARALELISMO']
  },

  90: {
    level: 90,
    name: 'A.I. Overlord',
    title: 'Rede Neural Autoevolutiva',
    avatar: '🧠',
    themeColor: 'indigo',
    lore: 'Uma inteligência sintética que prevê as teclas que você vai apertar. Ela prepara um ataque de reinicialização a cada 6 segundos!',
    mechanicType: 'cast_bar',
    mechanicBadge: '⚡ ATORDOAMENTO DE CAST',
    mechanicDescription: 'A IA carrega uma barra de sobrecarga ("Invasão iminente!"). Complete palavras rapidamente para interromper o ataque!',
    baseHp: 500,
    timeLimitSeconds: 24,
    castBarSeconds: 6,
    baseRewardBytes: 3200000,
    words: ['TRANSFORMER', 'APRENDIZADO', 'SUPERVISIONADO', 'ALINHAMENTO', 'INTELIGENCIA']
  },

  100: {
    level: 100,
    name: 'O Guardião Supremo dos Bytes',
    title: 'A Lenda Absoluta do Leopoldina',
    avatar: '👑',
    themeColor: 'gold',
    lore: 'O teste definitivo de toda a sua jornada no TypeClicker. Um colosso ancestral forjado no Nível Máximo Escolar que exige maestria em 3 fases épicas!',
    mechanicType: 'supreme_trio',
    mechanicBadge: '🏆 CONFRONTO LENDÁRIO EM 3 FASES',
    mechanicDescription: 'Fase 1: Quebra do Escudo de Diamante. Fase 2: Bateria de Alta Cadência. Fase 3: Golpe de Mestre Supremo!',
    baseHp: 600,
    timeLimitSeconds: 30,
    baseRewardBytes: 5000000,
    shieldTokens: ['[LEOPOLDINA]', '{MESTRE_100}'],
    words: ['DOMINIO_ABSOLUTO', 'LENDA_SUPREMA', 'TITAN_DIGITAL'],
    phaseTwoWords: ['VELOCIDADE_MAXIMA', 'PRECISAO_DIVINA'],
    phaseThreeWords: ['VITORIA_LENDARIA_LEOPOLDINA']
  }
};

/**
 * Retorna o Boss configurado para o nível especificado,
 * ou gera dinamicamente um chefe adaptativo para níveis de prestígio > 100.
 */
export function getLevelBoss(level: number): LevelBossDef {
  const rounded = Math.floor(level / 10) * 10;
  if (LEVEL_BOSSES[rounded]) {
    return LEVEL_BOSSES[rounded];
  }

  // Fallback e prestígio além do nível 100 (ex: 110, 120, etc.)
  const prestigeTier = Math.floor(level / 10);
  return {
    level: rounded,
    name: `Núcleo de Prestígio T-${prestigeTier}`,
    title: `Entidade de Dados Nível ${rounded}`,
    avatar: '🌌',
    themeColor: 'gold',
    lore: `Uma anomalia cósmica de dados gerada após ultrapassar os limites do Nível 100. Apenas digitadores lendários chegam até aqui.`,
    mechanicType: 'cast_bar',
    mechanicBadge: '🌌 SOBRECARGA CÓSMICA',
    mechanicDescription: 'Mantenha a cadência perfeita para conter a anomalia do cluster!',
    baseHp: 500 + (prestigeTier - 10) * 50,
    timeLimitSeconds: 25,
    castBarSeconds: 5,
    baseRewardBytes: rounded * 50000,
    words: ['COSMOLOGIA', 'HIPERESPACO', 'SINGULARIDADE', 'INTERESTELAR', 'INFINITO']
  };
}
