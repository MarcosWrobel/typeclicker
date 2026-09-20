export interface LevelDef {
  level: number;
  title: string;
  badge: string;
  minBytes: number;
  maxBytes: number;
  tier: string;
  tierColor: string;
  description: string;
  isMilestone?: boolean;
}

export interface PlayerRank {
  level: number;
  title: string;
  badge: string;
  minBytes: number;
  nextBytes: number;
  progressPercent: number;
  tier: string;
  tierColor: string;
  description: string;
  isMaxLevel: boolean;
}

export const LEVEL_TIERS = [
  { id: 'all', label: 'Todos (1-100)', range: [1, 100], color: 'text-zinc-300', bg: 'bg-zinc-800/80', border: 'border-zinc-700' },
  { id: 'tier1', label: '1 - 10: Fundamentos', range: [1, 10], color: 'text-emerald-400', bg: 'bg-emerald-950/50', border: 'border-emerald-500/40' },
  { id: 'tier2', label: '11 - 20: Laboratório', range: [11, 20], color: 'text-teal-400', bg: 'bg-teal-950/50', border: 'border-teal-500/40' },
  { id: 'tier3', label: '21 - 30: Ritmo & Foco', range: [21, 30], color: 'text-cyan-400', bg: 'bg-cyan-950/50', border: 'border-cyan-500/40' },
  { id: 'tier4', label: '31 - 40: Algoritmos', range: [31, 40], color: 'text-sky-400', bg: 'bg-sky-950/50', border: 'border-sky-500/40' },
  { id: 'tier5', label: '41 - 50: Programador', range: [41, 50], color: 'text-blue-400', bg: 'bg-blue-950/50', border: 'border-blue-500/40' },
  { id: 'tier6', label: '51 - 60: Redes & Ética', range: [51, 60], color: 'text-indigo-400', bg: 'bg-indigo-950/50', border: 'border-indigo-500/40' },
  { id: 'tier7', label: '61 - 70: Engenharia', range: [61, 70], color: 'text-purple-400', bg: 'bg-purple-950/50', border: 'border-purple-500/40' },
  { id: 'tier8', label: '71 - 80: Arquitetura', range: [71, 80], color: 'text-fuchsia-400', bg: 'bg-fuchsia-950/50', border: 'border-fuchsia-500/40' },
  { id: 'tier9', label: '81 - 90: Ciência Digital', range: [81, 90], color: 'text-rose-400', bg: 'bg-rose-950/50', border: 'border-rose-500/40' },
  { id: 'tier10', label: '91 - 100: Lendas Leopoldina', range: [91, 100], color: 'text-amber-400', bg: 'bg-amber-950/50', border: 'border-amber-500/40' },
];

const RAW_LEVEL_METADATA: Array<{ title: string; badge: string; desc: string; milestone?: boolean }> = [
  // 1 - 10: Fundamentos do Teclado
  { title: 'Recruta do Teclado', badge: '⌨️', desc: 'Primeiros passos no laboratório de informática.', milestone: true },
  { title: 'Teclas Guia A-S-D-F', badge: '🎯', desc: 'Mão esquerda posicionada na fileira central.' },
  { title: 'Posição Base J-K-L-Ç', badge: '✋', desc: 'Mão direita firme com o Ç no ABNT2.' },
  { title: 'Aprendiz ABNT2', badge: '📝', desc: 'Dominando as posições das letras do português.' },
  { title: 'Primeiras Frases', badge: '📄', desc: 'Completando palavras inteiras com fluência.', milestone: true },
  { title: 'Ritmo Cadenciado', badge: '⏱️', desc: 'Batidas regulares e sem interrupções bruscas.' },
  { title: 'Espaço com o Polegar', badge: '👍', desc: 'Usando os dois polegares para a barra de espaço.' },
  { title: 'Sem Olhar pro Teclado', badge: '👀', desc: 'Memória muscular das teclas se consolidando.' },
  { title: 'Olhos Firmes na Tela', badge: '🖥️', desc: 'Visão fixa na palavra sem abaixar a cabeça.' },
  { title: 'Calouro Leopoldina', badge: '🏫', desc: 'Primeira grande conquista no Colégio Leopoldina Pedroso!', milestone: true },

  // 11 - 20: Explorador do Laboratório
  { title: 'Pinguim Curioso', badge: '🐧', desc: 'Familiarizando-se com o sistema do laboratório.' },
  { title: 'Terminal do Sistema', badge: '💻', desc: 'Explorando o poder das linhas de comando.' },
  { title: 'Explorador do Sistema', badge: '🍃', desc: 'Navegando entre pastas e documentos escolares.' },
  { title: 'Comandos Básicos', badge: '📁', desc: 'Compreendendo como computadores organizam dados.' },
  { title: 'Atalhos de Mestre', badge: '🪄', desc: 'Usando Ctrl, Shift e Tab com agilidade.', milestone: true },
  { title: 'Digitador Veloz', badge: '⚡', desc: 'Velocidade de digitação crescendo a cada aula.' },
  { title: 'Foco Imbatível', badge: '🧘', desc: 'Concentração profunda durante os exercícios.' },
  { title: 'Sem Erros de Acento', badge: '✍️', desc: 'Dominando o til (~), agudo (´) e circunflexo (^).' },
  { title: 'Mestre da Acentuação', badge: '🔤', desc: 'Precisão impecável na pontuação da Língua Portuguesa.' },
  { title: 'Veterano do Laboratório', badge: '🎒', desc: 'Referência de boa digitação para os colegas!', milestone: true },

  // 21 - 30: Ritmo & Foco
  { title: 'Digitador Rítmico', badge: '🎵', desc: 'Digitação com música interna e fluidez constante.' },
  { title: 'Combo Ativado', badge: '🔥', desc: 'Sequência ininterrupta de palavras sem errar letras.' },
  { title: 'Teclado Musical', badge: '🎹', desc: 'Os dedos tocam as teclas como num piano clássico.' },
  { title: 'Dedos Relâmpago', badge: '⚡', desc: 'Reflexos rápidos ao identificar as palavras.' },
  { title: '40 Palavras por Minuto', badge: '🏎️', desc: 'Marca excelente para o Ensino Fundamental!', milestone: true },
  { title: 'Mente Sincronizada', badge: '🧠', desc: 'O cérebro lê a palavra e os dedos já digitam.' },
  { title: 'Desbravador de Textos', badge: '📖', desc: 'Encarando palavras longas e desafiadoras.' },
  { title: 'Caçador de Typos', badge: '🏹', desc: 'Acurácia quase perfeita sem apertar Backspace.' },
  { title: 'Precisão Cirúrgica', badge: '🔬', desc: 'Atenção aos detalhes em cada caractere.' },
  { title: 'Destaque da Turma', badge: '🌟', desc: 'Exemplo de dedicação reconhecido pelo professor.', milestone: true },

  // 31 - 40: Algoritmos & Lógica
  { title: 'Entusiasta do Código', badge: '💡', desc: 'Descobrindo como instruções criam programas.' },
  { title: 'Escovador de Bits', badge: '🧮', desc: 'Entendendo que tudo no PC é composto de 0 e 1.' },
  { title: 'Lógica Booleana', badge: '⚙️', desc: 'Pensamento estruturado em Verdadeiro ou Falso.' },
  { title: 'Laço de Repetição', badge: '🔄', desc: 'Automatizando tarefas com inteligência e esforço contínuo.' },
  { title: 'Estrutura Condicional', badge: '🔀', desc: 'Tomando decisões rápidas durante a digitação.', milestone: true },
  { title: 'Criador de Funções', badge: '🧩', desc: 'Organizando blocos de pensamento com clareza.' },
  { title: 'Caçador de Bugs', badge: '🐛', desc: 'Identificando erros e corrigindo imediatamente.' },
  { title: 'Debugger Implacável', badge: '🛠️', desc: 'Paciência e técnica para resolver qualquer desafio.' },
  { title: '60 Palavras por Minuto', badge: '🚀', desc: 'Velocidade profissional impressionante!', milestone: true },
  { title: 'Programador Leopoldina', badge: '🎓', desc: 'Dominando os princípios da ciência da computação.', milestone: true },

  // 41 - 50: Desenvolvedor em Ascensão
  { title: 'Desenvolvedor Front-End', badge: '🎨', desc: 'Criando interfaces bonitas e interativas.' },
  { title: 'Mestre do Back-End', badge: '🗄️', desc: 'Cuidando do motor que processa todos os dados.' },
  { title: 'Operador de Banco de Dados', badge: '📊', desc: 'Guardando e consultando informações organizadas.' },
  { title: 'Código Limpo & Elegante', badge: '🧼', desc: 'Escrevendo com clareza e respeito aos padrões.' },
  { title: 'Compilador Humano', badge: '⚡', desc: 'Processando caracteres em velocidade recorde.', milestone: true },
  { title: 'Velocidade da Luz', badge: '🌠', desc: 'Os dedos voam pelas teclas sem esforço aparente.' },
  { title: 'Mestre do Teclado Mecânico', badge: '⌨️', desc: 'Aproveitamento máximo de cada milímetro da tecla.' },
  { title: 'Refatorador Ágil', badge: '🔧', desc: 'Sempre buscando a forma mais eficiente de digitar.' },
  { title: 'Arquiteto Web', badge: '🌐', desc: 'Conectando conceitos globais à sala de aula.' },
  { title: 'Orgulho do Prof. Marcos', badge: '👨‍🏫', desc: 'Homenagem especial pelo empenho no laboratório!', milestone: true },

  // 51 - 60: Redes & Hacker Ético
  { title: 'Sentinela de Redes', badge: '📡', desc: 'Compreendendo como a internet viaja pelo mundo.' },
  { title: 'Hacker Ético', badge: '🛡️', desc: 'Usando o conhecimento digital para proteger e ajudar.' },
  { title: 'Criptógrafo de Bytes', badge: '🔐', desc: 'Segurança da informação e privacidade protegidas.' },
  { title: 'Defensor Cibernético', badge: '⚔️', desc: 'Cidadão digital consciente contra ameaças virtuais.' },
  { title: 'Analista de Pacotes', badge: '📦', desc: 'Fluxo contínuo e sem perda de dados.', milestone: true },
  { title: 'Roteador Humano', badge: '🔀', desc: 'Encaminhando ideias velozes para o teclado.' },
  { title: 'Fibra Óptica', badge: '💡', desc: 'Tempo de resposta em milissegundos.' },
  { title: 'Servidor Dedicado', badge: '🖥️', desc: 'Potência estável durante toda a aula.' },
  { title: '80 Palavras por Minuto', badge: '🏎️', desc: 'Raro entre estudantes de qualquer idade!', milestone: true },
  { title: 'Especialista do Laboratório', badge: '🐧', desc: 'Dominando o sistema escolar como ninguém.', milestone: true },

  // 61 - 70: Engenharia de Software
  { title: 'Engenheiro de Software', badge: '🏗️', desc: 'Construindo soluções sólidas e duradouras.' },
  { title: 'Git & Versionamento', badge: '🌿', desc: 'Histórico preservado e trabalho colaborativo.' },
  { title: 'Mestre dos Algoritmos', badge: '📐', desc: 'Resolvendo problemas complexos em segundos.' },
  { title: 'Otimizador de Desempenho', badge: '🚀', desc: 'Nenhum Byte ou segundo é desperdiçado.' },
  { title: 'Processamento Paralelo', badge: '⚡', desc: 'As duas mãos trabalhando com harmonia perfeita.', milestone: true },
  { title: 'Inteligência Computacional', badge: '🤖', desc: 'Antecipando as palavras antes mesmo de terminarem.' },
  { title: 'Visão Computacional', badge: '👁️', desc: 'Percepção periférica avançada na tela.' },
  { title: 'Mente Quântica', badge: '🔮', desc: 'Pensamento abstrato de altíssimo nível.' },
  { title: 'Memória Cache Infinita', badge: '🧠', desc: 'Vocabulário rico e retenção imediata.' },
  { title: 'Grande Mestre do Teclado', badge: '🏆', desc: 'Consagrado como referência no colégio.', milestone: true },

  // 71 - 80: Arquitetura de Sistemas
  { title: 'Arquiteto de Sistemas', badge: '🏛️', desc: 'Projetando infraestruturas de escala global.' },
  { title: 'Nuvem Distribuída', badge: '☁️', desc: 'Dados e processos sincronizados perfeitamente.' },
  { title: 'Alta Disponibilidade', badge: '⚙️', desc: 'Resistência e foco que nunca caem.' },
  { title: 'Supercomputador', badge: '🖲️', desc: 'Capacidade de cálculo e digitação estonteantes.' },
  { title: '100 Palavras por Minuto', badge: '🌪️', desc: 'O teclado vira um vendaval de letras certas!', milestone: true },
  { title: 'Dedo Biônico', badge: '🦾', desc: 'Músculos e articulações treinados com postura correta.' },
  { title: 'Teclas Quânticas', badge: '⚛️', desc: 'Transições entre caracteres sem atrito.' },
  { title: 'Mago dos Dados', badge: '🧙', desc: 'Transformando esforço em montanhas de Bytes.' },
  { title: 'Núcleo de Processamento', badge: '💎', desc: 'Coração de cristal e mente serena.' },
  { title: 'Embaixador Digital', badge: '🌐', desc: 'Inspirando novos alunos a praticar digitação.', milestone: true },

  // 81 - 90: Ciência da Computação
  { title: 'Cientista da Computação', badge: '🔬', desc: 'Explorando as fronteiras do conhecimento digital.' },
  { title: 'Teoria dos Grafos', badge: '🕸️', desc: 'Conexões neurais ligadas à ponta dos dedos.' },
  { title: 'Criptografia Pós-Quântica', badge: '🧬', desc: 'Inquebrável diante de qualquer erro de digitação.' },
  { title: 'Nanotecnologia Digital', badge: '🔬', desc: 'Ajuste fino de precisão em cada tecla.' },
  { title: 'Oráculo de Códigos', badge: '📜', desc: 'Sabedoria profunda acumulada no jogo.', milestone: true },
  { title: 'Piloto de Supercluster', badge: '🚀', desc: 'Gerando milhões de Bytes por segundo.' },
  { title: 'Mente Conectada', badge: '🌐', desc: 'União harmônica entre ser humano e computador.' },
  { title: 'Digitador Supersônico', badge: '🛸', desc: 'Mais rápido que a maioria dos adultos no mundo.' },
  { title: 'Sintonia Perfeita', badge: '🎻', desc: 'Arte e tecnologia fundidas em cada frase.' },
  { title: 'Honra ao Mérito Leopoldina', badge: '🏅', desc: 'Medalha virtual de excelência máxima escolar!', milestone: true },

  // 91 - 100: Lendas do Colégio Leopoldina
  { title: 'Guardião da Informática', badge: '🛡️', desc: 'Protetor do legado do laboratório de informática.' },
  { title: 'Mestre Imbatível', badge: '🥋', desc: 'Invicto em desafios de velocidade e acurácia.' },
  { title: 'Teclado de Ouro', badge: '🥇', desc: 'Brilho incomparável em cada sessão de prática.' },
  { title: 'Lenda da Sala de Aula', badge: '🌟', desc: 'Nome gravado nos anais do Colégio Leopoldina.' },
  { title: 'Fenômeno da Digitação', badge: '🌠', desc: 'Talento puro desenvolvido com disciplina.', milestone: true },
  { title: 'Titã dos Bytes', badge: '🗿', desc: 'Montanhas monumentais de dados acumulados.' },
  { title: 'Mestre dos Mestres', badge: '🎖️', desc: 'Nível quase divino de domínio do teclado ABNT2.' },
  { title: 'Patrono da Computação', badge: '🏛️', desc: 'Homenagem aos pioneiros da informática mundial.' },
  { title: 'Guardião Eterno dos Códigos', badge: '🌌', desc: 'A um passo do topo máximo de TypeClicker.', milestone: true },
  { title: 'Lenda Suprema do Leopoldina', badge: '👑', desc: 'O nível máximo absoluto (100). Parabéns, você é lendário!', milestone: true }
];

function getTierForLevel(level: number) {
  if (level <= 10) return { tier: 'Fundamentos do Teclado', tierColor: 'text-emerald-400' };
  if (level <= 20) return { tier: 'Explorador do Laboratório', tierColor: 'text-teal-400' };
  if (level <= 30) return { tier: 'Velocidade & Foco', tierColor: 'text-cyan-400' };
  if (level <= 40) return { tier: 'Algoritmos & Lógica', tierColor: 'text-sky-400' };
  if (level <= 50) return { tier: 'Desenvolvedor Mirim', tierColor: 'text-blue-400' };
  if (level <= 60) return { tier: 'Redes & Hacker Ético', tierColor: 'text-indigo-400' };
  if (level <= 70) return { tier: 'Engenharia de Software', tierColor: 'text-purple-400' };
  if (level <= 80) return { tier: 'Arquitetura de Sistemas', tierColor: 'text-fuchsia-400' };
  if (level <= 90) return { tier: 'Ciência da Computação', tierColor: 'text-rose-400' };
  return { tier: 'Lenda Suprema Leopoldina', tierColor: 'text-amber-400' };
}

/**
 * Generates smooth, challenging exponential-like threshold curves for 100 levels
 * balanced to require consistent practice over an entire school semester.
 * 
 * Level 1: 0 Bytes
 * Level 10: 25 KB (First 1-2 classes: base positions A-S-D-F / J-K-L-Ç)
 * Level 25: 2.5 MB (Weeks 2 to 4: rhythm and initial upgrades)
 * Level 50: 500 MB (Mid-semester: steady cadence, multi-word combos)
 * Level 75: 65 GB (Month 4: advanced Linux & programming vocabulary)
 * Level 100: 8 TB (Semester Milestone: true master typist of Colégio Leopoldina)
 */
export function calculateMinBytesForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level <= 10) {
    // 0 to 25,000 B
    return Math.round(250 * Math.pow(level - 1, 2.1));
  }
  if (level <= 25) {
    // 25 KB to ~2.5 MB
    const base = 25000;
    const progress = (level - 10) / 15;
    return Math.round(base + 2475000 * Math.pow(progress, 2.2));
  }
  if (level <= 50) {
    // 2.5 MB to ~500 MB
    const base = 2500000;
    const progress = (level - 25) / 25;
    return Math.round(base + 497500000 * Math.pow(progress, 2.8));
  }
  if (level <= 75) {
    // 500 MB to ~65 GB
    const base = 500000000;
    const progress = (level - 50) / 25;
    return Math.round(base + 64500000000 * Math.pow(progress, 3.1));
  }
  // Level 76 to 100: 65 GB to 8.0 TB (Supreme Semester Challenge)
  const base = 65000000000;
  const progress = (level - 75) / 25;
  return Math.round(base + 7935000000000 * Math.pow(progress, 3.4));
}

// Pre-build 100 levels list
export const ALL_LEVELS: LevelDef[] = Array.from({ length: 100 }, (_, i) => {
  const level = i + 1;
  const meta = RAW_LEVEL_METADATA[i] || {
    title: `Mestre das Teclas Nv. ${level}`,
    badge: '🏆',
    desc: 'Conquista extraordinária de digitação.',
    milestone: level % 5 === 0
  };
  const { tier, tierColor } = getTierForLevel(level);
  const minBytes = calculateMinBytesForLevel(level);
  const maxBytes = level < 100 ? calculateMinBytesForLevel(level + 1) : minBytes * 2;

  return {
    level,
    title: meta.title,
    badge: meta.badge,
    minBytes,
    maxBytes,
    tier,
    tierColor,
    description: meta.desc,
    isMilestone: meta.milestone ?? (level % 10 === 0)
  };
});

/**
 * Returns player rank information according to cumulative totalBytesEarned.
 */
export function calculatePlayerRankFromLevels(totalBytesEarned: number): PlayerRank {
  if (!Number.isFinite(totalBytesEarned) || totalBytesEarned <= 0) {
    const first = ALL_LEVELS[0];
    return {
      level: 1,
      title: first.title,
      badge: first.badge,
      minBytes: 0,
      nextBytes: first.maxBytes,
      progressPercent: 0,
      tier: first.tier,
      tierColor: first.tierColor,
      description: first.description,
      isMaxLevel: false
    };
  }

  // Find level
  for (let i = ALL_LEVELS.length - 1; i >= 0; i--) {
    const l = ALL_LEVELS[i];
    if (totalBytesEarned >= l.minBytes || i === 0) {
      if (l.level === 100) {
        return {
          level: 100,
          title: l.title,
          badge: l.badge,
          minBytes: l.minBytes,
          nextBytes: l.maxBytes,
          progressPercent: 100,
          tier: l.tier,
          tierColor: l.tierColor,
          description: l.description,
          isMaxLevel: true
        };
      }

      const nextLevel = ALL_LEVELS[i + 1];
      const range = nextLevel.minBytes - l.minBytes;
      const currentInTier = Math.max(0, totalBytesEarned - l.minBytes);
      const progressPercent = range > 0 ? Math.min(100, Math.round((currentInTier / range) * 100)) : 100;

      return {
        level: l.level,
        title: l.title,
        badge: l.badge,
        minBytes: l.minBytes,
        nextBytes: nextLevel.minBytes,
        progressPercent,
        tier: l.tier,
        tierColor: l.tierColor,
        description: l.description,
        isMaxLevel: false
      };
    }
  }

  const first = ALL_LEVELS[0];
  return {
    level: 1,
    title: first.title,
    badge: first.badge,
    minBytes: 0,
    nextBytes: first.maxBytes,
    progressPercent: 0,
    tier: first.tier,
    tierColor: first.tierColor,
    description: first.description,
    isMaxLevel: false
  };
}
