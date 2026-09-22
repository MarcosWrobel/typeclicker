import { LayoutSkinId, AnimationEffectId, CosmeticCurrency, PlayerCosmetics, TerminalThemeId, BytezinhoSkinId, KeySoundThemeId } from '../types/cosmetics';
import { TERMINAL_THEMES, BYTEZINHO_SKINS, KEY_SOUNDS } from './themes';
export { TERMINAL_THEMES, BYTEZINHO_SKINS, KEY_SOUNDS };
export type { TerminalThemeConfig, SkinItemConfig, KeySoundConfig } from './themes';

export interface LayoutConfig {
  id: LayoutSkinId;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  currency?: CosmeticCurrency;
  badge: string;
  icon: string;
  features: string[];
  previewColors: {
    border: string;
    bg: string;
    accent: string;
  };
}

export const LAYOUT_CONFIGS: Record<LayoutSkinId, LayoutConfig> = {
  default_terminal: {
    id: 'default_terminal',
    name: 'Terminal Leopoldina',
    subtitle: 'CLI Clássico 3 Colunas',
    description: 'A disposição clássica do laboratório de informática: Placar à esquerda, Arena central e Loja de Upgrades à direita.',
    price: 0,
    badge: 'Padrão',
    icon: '💻',
    features: ['3 Colunas Equilibradas', 'Visão Geral do Progresso', 'Otimizado para Monitores Escolares'],
    previewColors: {
      border: '#10b981',
      bg: '#0a0d0a',
      accent: '#34d399',
    },
  },
  arcade_cabinet: {
    id: 'arcade_cabinet',
    name: 'Gabinete Arcade 1984',
    subtitle: 'Fliperama Anos 80 & CRT',
    description: 'Transforma sua tela em um gabinete de fliperama curvo com scanlines dinâmicas, letreiro luminoso e botões arcade.',
    price: 3,
    badge: 'Fliperama',
    icon: '🕹️',
    features: ['Curvatura de Tela CRT', 'Scanlines Dinâmicas CSS', 'Letreiro Iluminado & Deck Arcade'],
    previewColors: {
      border: '#f59e0b',
      bg: '#140a08',
      accent: '#fbbf24',
    },
  },
  zen_focus: {
    id: 'zen_focus',
    name: 'Foco Zen Minimalista',
    subtitle: 'Distração Zero & Alta Precisão',
    description: 'Oculta upgrades e elementos secundários, centralizando 100% da sua atenção na arena de digitação e no ritmo.',
    price: 2,
    badge: 'Foco Puro',
    icon: '🧘',
    features: ['Arena Centralizada Ampla', 'Sem Distrações Laterais', 'Ideal para Provas e Treino de Precisão'],
    previewColors: {
      border: '#06b6d4',
      bg: '#080c14',
      accent: '#38bdf8',
    },
  },
  bios_dos: {
    id: 'bios_dos',
    name: 'BIOS DOS Setup Utility',
    subtitle: 'Tela Azul CMOS 1986',
    description: 'Simulação autêntica da tela azul de setup de BIOS com molduras ASCII em traço duplo, atalhos de função e visual retrô.',
    price: 3,
    badge: 'Retro BIOS',
    icon: '💾',
    features: ['Fundo Azul Cobalto BIOS', 'Molduras ASCII Clássicas ╔═╗', 'Barra de Status de Hardware Retrô'],
    previewColors: {
      border: '#ffffff',
      bg: '#0000aa',
      accent: '#ffff55',
    },
  },
  cyber_deck: {
    id: 'cyber_deck',
    name: 'Cyberdeck Neon 2077',
    subtitle: 'HUD Tático Militar & Invasão',
    description: 'Rig militar de infiltração cibernética com cantos angulares chanfrados, molduras holográficas ciano/magenta e telemetria de rede.',
    price: 4,
    badge: 'Cyberpunk',
    icon: '⚡',
    features: ['Moldura Militar Angular', 'HUD Holográfico Neon', 'Telemetria de Rede & Invasão'],
    previewColors: {
      border: '#06b6d4',
      bg: '#0a0d18',
      accent: '#f43f5e',
    },
  },
  ide_developer: {
    id: 'ide_developer',
    name: 'IDE Code Studio',
    subtitle: 'Editor Profissional VS Code',
    description: 'Ambiente de desenvolvimento de software com abas de código ativas, árvore de diretórios na lateral e terminal embutido.',
    price: 3,
    badge: 'Dev Studio',
    icon: '🧑‍💻',
    features: ['Abas de Arquivos de Código', 'Gutter com Números de Linha', 'Terminal Integrado'],
    previewColors: {
      border: '#3b82f6',
      bg: '#181a1f',
      accent: '#60a5fa',
    },
  },
  space_station: {
    id: 'space_station',
    name: 'Painel Espacial HUD',
    subtitle: 'Estação Espacial Orbital',
    description: 'Painel de controle de missão espacial com escotilha hermética reforçada, radar de varredura orbital e telemetria de gravidade.',
    price: 15,
    currency: 'quantum_fragments',
    badge: 'Quântico',
    icon: '🚀',
    features: ['Escotilha Pressurizada', 'Radar Orbital Holográfico', 'Status de Gravidade Zero'],
    previewColors: {
      border: '#38bdf8',
      bg: '#050c18',
      accent: '#7dd3fc',
    },
  },
  steampunk_lab: {
    id: 'steampunk_lab',
    name: 'Oficina Steampunk',
    subtitle: 'Engenharia a Vapor & Latão',
    description: 'Oficina industrial vitoriana ornamentada com tubulações de cobre polido, rebites forjados e manômetros de pressão analógicos.',
    price: 4,
    badge: 'Vapor & Latão',
    icon: '⚙️',
    features: ['Tubulações de Cobre Polido', 'Rebites de Latão Vitoriano', 'Manômetros de Pressão PSI'],
    previewColors: {
      border: '#b45309',
      bg: '#170f08',
      accent: '#f59e0b',
    },
  },
  retro_mac_classic: {
    id: 'retro_mac_classic',
    name: 'Macintosh Clássico 1984',
    subtitle: 'Interface Gráfica Vintage',
    description: 'Computador compacto de 9 polegadas em plástico platina com barra superior de menus, ícone de maçã vintage e estética clássica.',
    price: 3,
    badge: 'Vintage GUI',
    icon: '🍏',
    features: ['Gabinete Platina Compacto', 'Barra Superior com Maçã Clássica', 'Estética 1-bit Nostálgica'],
    previewColors: {
      border: '#94a3b8',
      bg: '#1e2530',
      accent: '#e2e8f0',
    },
  },
  speedrun_arena: {
    id: 'speedrun_arena',
    name: 'Arena Speedrun Esports',
    subtitle: 'Competição & Transmissão',
    description: 'Palco de campeonato eletrônico com velocímetro de palavras por minuto, telemetria de precisão ao vivo e atmosfera gamer.',
    price: 4,
    badge: 'Esports',
    icon: '🏆',
    features: ['Velocímetro WPM Dinâmico', 'Splits de Tempo em Verde/Vermelho', 'Moldura de Transmissão Gamer'],
    previewColors: {
      border: '#e11d48',
      bg: '#0f0c18',
      accent: '#fb7185',
    },
  },
  school_chalkboard: {
    id: 'school_chalkboard',
    name: 'Lousa Escolar Leopoldina',
    subtitle: 'Quadro-Negro Tradicional',
    description: 'Lousa verde clássica do Colégio Estadual Leopoldina com moldura de madeira nobre, traços de giz branco e calha com apagador.',
    price: 2,
    badge: 'Colégio',
    icon: '🏫',
    features: ['Lousa Verde Tradicional', 'Moldura de Madeira Clássica', 'Calha com Giz & Apagador'],
    previewColors: {
      border: '#854d0e',
      bg: '#0e2417',
      accent: '#86efac',
    },
  },
  star_wars_cockpit: {
    id: 'star_wars_cockpit',
    name: 'Cockpit Galáctico',
    subtitle: 'Caça Estelar Sci-Fi',
    description: 'Inspirado em Star Wars: Moldura de caça estelar com HUD tático holográfico, escudo de energia e telemetria de combate.',
    price: 15,
    currency: 'duel_coins',
    badge: 'Galáctico',
    icon: '🌌',
    features: ['HUD Tático Holográfico', 'Mira Central Laser', 'Telemetria de Combate Estelar'],
    previewColors: {
      border: '#ef4444',
      bg: '#0a0812',
      accent: '#38bdf8',
    },
  },
  minecraft_block: {
    id: 'minecraft_block',
    name: 'Mundo de Blocos',
    subtitle: 'Pixel Craft 16-Bit',
    description: 'Inspirado em Minecraft: Molduras texturizadas de terra e pedra 16-bit com barra de vida de corações pixelados.',
    price: 12,
    currency: 'duel_coins',
    badge: 'Blocos',
    icon: '⛏️',
    features: ['Moldura de Terra & Pedra', 'Barra de Corações Pixel', 'Inventário Cúbico 16-Bit'],
    previewColors: {
      border: '#84cc16',
      bg: '#140e0a',
      accent: '#38bdf8',
    },
  },
  shonen_combat: {
    id: 'shonen_combat',
    name: 'Torneio do Poder',
    subtitle: 'Arena Shonen & Ki Flamejante',
    description: 'Inspirado em Dragon Ball: Traços de mangá de combate com aura de energia amarela e onomatopeias dinâmicas.',
    price: 15,
    currency: 'duel_coins',
    badge: 'Anime',
    icon: '⚡',
    features: ['Aura de Ki Flamejante', 'Molduras Estilo Mangá', 'Onomatopeias de Impacto'],
    previewColors: {
      border: '#eab308',
      bg: '#0b0f1a',
      accent: '#f97316',
    },
  },
  mushroom_kingdom: {
    id: 'mushroom_kingdom',
    name: 'Reino dos Cogumelos',
    subtitle: 'Platformer Retrô 1985',
    description: 'Inspirado em Super Mario: Canos verdes vibrantes, tijolos flutuantes 8-bit e nuvens fofas no céu azul.',
    price: 12,
    currency: 'duel_coins',
    badge: 'Reino Retro',
    icon: '🍄',
    features: ['Canos Verdes & Blocos 8-Bit', 'Nuvens & Céu Retrô', 'Moedas Giratórias Arcade'],
    previewColors: {
      border: '#22c55e',
      bg: '#0c1b2a',
      accent: '#eab308',
    },
  },
  // Novos Layouts Míticos / Quânticos de Endgame (3ª Moeda 🌌)
  infinite_void_realm: {
    id: 'infinite_void_realm',
    name: 'Domínio do Vazio Infinito',
    subtitle: 'Horizonte Cósmico & Singularity',
    description: 'Inspirado no Feiticeiro Vendado: Espaço cósmico com horizonte de eventos e cursor levitando como singularidade.',
    price: 52,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '👁️',
    features: ['Singularidade Gravitacional', 'Horizonte de Eventos Estelar', 'Zero Distração Cósmica'],
    previewColors: {
      border: '#38bdf8',
      bg: '#020208',
      accent: '#e0f2fe',
    },
  },
  pirate_deck: {
    id: 'pirate_deck',
    name: 'Convés do Navio Pirata',
    subtitle: 'Madeira Náutica & Segunda Marcha',
    description: 'Inspirado no Pirata Emborrachado: Tabuado de carvalho marítimo com leme dourado e vapor escarlate.',
    price: 44,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '👒',
    features: ['Convés de Carvalho Marítimo', 'Leme de Navegação', 'Vapor Escarlate em Overdrive'],
    previewColors: {
      border: '#f43f5e',
      bg: '#140407',
      accent: '#fb7185',
    },
  },
  judgment_hall: {
    id: 'judgment_hall',
    name: 'Salão do Julgamento',
    subtitle: 'Pilares Dourados & Megalovânia',
    description: 'Inspirado no Esqueleto de Moletom: Vitrais góticos com caixas de diálogo 1-bit e feixes Gaster Blaster.',
    price: 46,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '💀',
    features: ['Vitrais Góticos 1-Bit', 'Caixas de Diálogo Retrô', 'Medidor de Karma Azul'],
    previewColors: {
      border: '#06b6d4',
      bg: '#050505',
      accent: '#ffffff',
    },
  },
  edgerunner_rig: {
    id: 'edgerunner_rig',
    name: 'Terminal Sandevistan 2077',
    subtitle: 'HUD Militar Urbano',
    description: 'Inspirado no Ciborgue Urbano: Janelas de alta saturação amarela com ciano e telemetria neural com rastro.',
    price: 48,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '⚡',
    features: ['HUD Tático Amarelo/Ciano', 'Efeito Sandevistan em Combos', 'Monitor de Sobrecarga Neural'],
    previewColors: {
      border: '#eab308',
      bg: '#0a0d02',
      accent: '#06b6d4',
    },
  },
  slayer_dojo: {
    id: 'slayer_dojo',
    name: 'Dojo do Caçador Solar',
    subtitle: 'Tatame & Biombos Japoneses',
    description: 'Inspirado no Caçador de Quimono: Biombos de papel arroz, tatames e dragões aquáticos e solares desenhados a nanquim.',
    price: 45,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '⚔️',
    features: ['Moldura em Biombos Shoji', 'Efeito Xilogravura Nanquim', 'Trilhas de Água & Fogo'],
    previewColors: {
      border: '#f97316',
      bg: '#120502',
      accent: '#fdba74',
    },
  },
  pocket_console: {
    id: 'pocket_console',
    name: 'Console Portátil 1996',
    subtitle: 'Chassi Cinza & Trovão',
    description: 'Inspirado no Roedor Elétrico: Carcaça clássica de console de bolso com tela esverdeada e arcos elétricos.',
    price: 42,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '⚡',
    features: ['Carcaça Portátil Clássica', 'D-Pad & Botões A/B', 'Faíscas de 100k Volts'],
    previewColors: {
      border: '#facc15',
      bg: '#0c0d06',
      accent: '#fef08a',
    },
  },
  manga_action: {
    id: 'manga_action',
    name: 'Página de Mangá Heroico',
    subtitle: 'Tirinhas & Ondas de Choque',
    description: 'Inspirado no Herói Entediado: Quadros clássicos de história em quadrinhos com onomatopeias e traço hiper-detalhado.',
    price: 50,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '🥊',
    features: ['Quadros Estilo Mangá', 'Onomatopeias Dinâmicas', 'Rachaduras de Onda de Choque'],
    previewColors: {
      border: '#ef4444',
      bg: '#08080a',
      accent: '#fef2f2',
    },
  },
  hollow_ruins: {
    id: 'hollow_ruins',
    name: 'Ruínas Antigas de Hallownest',
    subtitle: 'Caverna Gótica & Alma',
    description: 'Inspirado no Besouro Agulheiro: Rocha entalhada subterrânea com frascos de Alma luminescente.',
    price: 43,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '🗡️',
    features: ['Arquitetura Gótica de Insetos', 'Frasco de Alma Luminosa', 'Partículas de Vaga-Lumes'],
    previewColors: {
      border: '#7dd3fc',
      bg: '#050a12',
      accent: '#f0f9ff',
    },
  },
  green_hills_zone: {
    id: 'green_hills_zone',
    name: 'Zona das Colinas Tropicais',
    subtitle: 'Quadriculado 16-Bit & Anéis',
    description: 'Inspirado no Ouriço Supersônico: Terreno quadriculado verde/marrom com totens tropicais e anéis dourados.',
    price: 41,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '🦔',
    features: ['Padrão Quadriculado Clássico', 'Contador de Anéis Dourados', 'Velocímetro Supersônico'],
    previewColors: {
      border: '#38bdf8',
      bg: '#030a1c',
      accent: '#fde047',
    },
  },
  bat_cave_tactical: {
    id: 'bat_cave_tactical',
    name: 'Batcomputador Tático',
    subtitle: 'Sonar & Monitores Noturnos',
    description: 'Inspirado no Cavaleiro das Sombras: Computador militar subterrâneo com sonar tático e mapas de calor.',
    price: 46,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '🦇',
    features: ['Monitores Múltiplos Táticos', 'Varredura de Sonar Noturno', 'Silhuetas de Morcegos'],
    previewColors: {
      border: '#f59e0b',
      bg: '#08080a',
      accent: '#fbbf24',
    },
  },
  whatsapp_chat_layout: {
    id: 'whatsapp_chat_layout',
    name: 'WhatsApp Web // Mensagens',
    subtitle: 'Chat Criptografado & Status Online',
    description: 'Ambiente de conversa instantânea com barra de status esmeralda, balões de texto e badges de mensagens não lidas.',
    price: 6,
    badge: 'App Teen',
    icon: '💬',
    features: ['Moldura Dark Green #111b21', 'Status Online & Criptografia 🔒', 'Balões de Mensagem Dinâmicos'],
    previewColors: {
      border: '#25d366',
      bg: '#0b141a',
      accent: '#53bdeb',
    },
  },
  instagram_feed_layout: {
    id: 'instagram_feed_layout',
    name: 'Instagram Feed // Stories',
    subtitle: 'Gradiente Sunset & Direct',
    description: 'Moldura moderna com carrossel de Stories iluminado, anéis concêntricos neon e botões interativos de engajamento.',
    price: 6,
    badge: 'App Teen',
    icon: '📸',
    features: ['Stories com Gradiente Neon', 'Direct Messages & Interações', 'Estética Sunset & Ameixa'],
    previewColors: {
      border: '#e1306c',
      bg: '#0c0614',
      accent: '#f77737',
    },
  },
  youtube_theater_layout: {
    id: 'youtube_theater_layout',
    name: 'YouTube Theater // Criador',
    subtitle: 'Sala do Criador & Playback',
    description: 'Visual cinematográfico imersivo com botão de inscrição vermelho rubi, barra de progresso scrubber e painel de criador.',
    price: 5,
    badge: 'App Teen',
    icon: '▶️',
    features: ['Cinema Dark & Botão Inscrever-se', 'Barra Scrubber de Reprodução', 'Painel de Vídeos & Likes'],
    previewColors: {
      border: '#ff0000',
      bg: '#0f0f0f',
      accent: '#ffffff',
    },
  },
  tiktok_stream_layout: {
    id: 'tiktok_stream_layout',
    name: 'TikTok Stream // Para Você',
    subtitle: 'Feed Vertical & Glitch Neon',
    description: 'Experiência rítmica com abas Seguindo / Para Você, disco de música animado 💿 e divisores de glitch neon ciano e magenta.',
    price: 7,
    badge: 'App Teen',
    icon: '🎵',
    features: ['Abas "Para Você" & "Seguindo"', 'Disco de Vinil Giratório 💿', 'Acentos Anáglifos Ciano/Magenta'],
    previewColors: {
      border: '#fe2c55',
      bg: '#010101',
      accent: '#00f2fe',
    },
  },
  roblox_studio_layout: {
    id: 'roblox_studio_layout',
    name: 'Roblox Studio // 3D Blocks',
    subtitle: 'Mundo de Blocos & Studs',
    description: 'Moldura geométrica 3D com chanfros táteis estilo blocos de montar, logotipo clássico vermelho e mostradores de peças/studs.',
    price: 6,
    badge: 'App Teen',
    icon: '🧱',
    features: ['Chanfros 3D Estilo Blocos', 'Logo Clássico Roblox ⛶', 'Mostrador de Peças & Ferramentas'],
    previewColors: {
      border: '#e2231a',
      bg: '#111216',
      accent: '#00a2ff',
    },
  },
};

export interface AnimationConfig {
  id: AnimationEffectId;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  currency?: CosmeticCurrency;
  badge: string;
  icon: string;
  accentColor: string;
  glowColor: string;
  borderClass: string;
  badgeClass: string;
  previewSummary: {
    purchase: string;
    terminal: string;
    levelUp: string;
  };
}

export const ANIMATION_CONFIGS: Record<AnimationEffectId, AnimationConfig> = {
  confetti_classic: {
    id: 'confetti_classic',
    name: 'Festa de Confetes',
    subtitle: 'Comemoração Clássica Alegre',
    description: 'A clássica explosão de confetes multicoloridos e serpentinas festivas para animar cada vitória.',
    price: 0,
    badge: 'Padrão',
    icon: '🎊',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    borderClass: 'border-emerald-500/60',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    previewSummary: {
      purchase: 'Explosão festiva multicolorida de confetes',
      terminal: 'Pop suave com quique elástico nas letras',
      levelUp: 'Canhões duplos de confetes cruzando a tela'
    }
  },
  golden_coins: {
    id: 'golden_coins',
    name: 'Chuva de Ouro & Tesouro',
    subtitle: 'Moedas Douradas & Centelhas',
    description: 'Transforma compras em jatos de moedas reluzentes e dá às letras do terminal um brilho nobre dourado.',
    price: 2,
    badge: 'Tesouro',
    icon: '🪙',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    borderClass: 'border-amber-500/60',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    previewSummary: {
      purchase: 'Chafariz de moedas douradas saltando do botão',
      terminal: 'Brilho dourado metálico intenso (Gold-Glow)',
      levelUp: 'Chuva densa de moedas de ouro e estrelas'
    }
  },
  matrix_stream: {
    id: 'matrix_stream',
    name: 'Cascata Digital Matrix',
    subtitle: 'Código Hacker & Fósforo Verde',
    description: 'Puro estilo hacker anos 90 com colunas de código binário verde e efeito de fósforo CRT nas teclas.',
    price: 3,
    badge: 'Hacker',
    icon: '💻',
    accentColor: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.45)',
    borderClass: 'border-green-500/60',
    badgeClass: 'bg-green-500/20 text-green-300 border-green-500/40',
    previewSummary: {
      purchase: 'Jato vertical de código binário 01 e símbolos',
      terminal: 'Glitch digital fosforescente e cintilação CRT',
      levelUp: 'Cortina completa de chuva de código Matrix'
    }
  },
  supernova_burst: {
    id: 'supernova_burst',
    name: 'Supernova Cósmica',
    subtitle: 'Explosão Estelar Ultravioleta',
    description: 'Ondas gravitacionais violeta e ciano com estrelas cintilantes que pulsam no ritmo da sua digitação.',
    price: 15,
    currency: 'quantum_fragments',
    badge: 'Quântico',
    icon: '🌌',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    borderClass: 'border-purple-500/60',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    previewSummary: {
      purchase: 'Onda de choque circular estelar violeta e ciano',
      terminal: 'Halo estelar cósmico pulsante nas letras',
      levelUp: 'Supernova central com anéis expansivos em tela cheia'
    }
  },
  tesla_lightning: {
    id: 'tesla_lightning',
    name: 'Descarga Elétrica Tesla',
    subtitle: 'Relâmpagos & Alta Voltagem',
    description: 'Faíscas elétricas de alta voltagem e arcos voltaicos azul-turquesa que estalam a cada caractere certo.',
    price: 3,
    badge: 'Elétrico',
    icon: '⚡',
    accentColor: '#0ea5e9',
    glowColor: 'rgba(14, 165, 233, 0.5)',
    borderClass: 'border-sky-500/60',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    previewSummary: {
      purchase: 'Arcos de choque elétrico e faíscas azuis',
      terminal: 'Micro-faíscas elétricas com jitter de voltagem',
      levelUp: 'Tempestade elétrica com relâmpagos cruzando a tela'
    }
  },
  volcano_flame: {
    id: 'volcano_flame',
    name: 'Fogo & Brasas Vulcânicas',
    subtitle: 'Magma Ardente & Chamas',
    description: 'Sinta o calor da velocidade! Labaredas incandescentes e brasas alaranjadas que sobem das teclas.',
    price: 3,
    badge: 'Fogo',
    icon: '🔥',
    accentColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    borderClass: 'border-orange-500/60',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    previewSummary: {
      purchase: 'Labaredas incandescentes e brasas subindo do botão',
      terminal: 'Chamas ardentes e rastro de brasa que sobe suavemente',
      levelUp: 'Erupção vulcânica com jatos de fogo em alta velocidade'
    }
  },
  cyber_neon: {
    id: 'cyber_neon',
    name: 'Pulso Neon Cyberpunk',
    subtitle: 'Synthwave & Laser Rosa/Ciano',
    description: 'Estética futurista anos 80 em tons vibrantes de magenta e ciano laser com ondas sônicas de impacto.',
    price: 4,
    badge: 'Cyberpunk',
    icon: '🌆',
    accentColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.5)',
    borderClass: 'border-pink-500/60',
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    previewSummary: {
      purchase: 'Ondas sônicas e feixes angulares neon ciano/magenta',
      terminal: 'Brilho laser duplo pulsante com rastro futurista',
      levelUp: 'Grade neon laser tridimensional no horizonte'
    }
  },
  pixel_retro: {
    id: 'pixel_retro',
    name: 'Explosão Pixel Art 8-Bit',
    subtitle: 'Arcade Retrô & Chiptune',
    description: 'Quadrados e blocos pixelados saltitantes diretamente dos clássicos do NES e fliperamas arcade.',
    price: 3,
    badge: '8-Bit Retrô',
    icon: '👾',
    accentColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.45)',
    borderClass: 'border-yellow-500/60',
    badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    previewSummary: {
      purchase: 'Cubos de pixel coloridos saltando em física arcade',
      terminal: 'Quique retrô em degraus e contorno pixelado',
      levelUp: 'Chuva arcade de corações e blocos retrô de pixel'
    }
  },
  fireworks_show: {
    id: 'fireworks_show',
    name: 'Fogos de Artifício',
    subtitle: 'Espetáculo Pirotécnico Noturno',
    description: 'Estouros pirotécnicos em flor com estalidos brilhantes em tons de rubi, ouro e safira comemorativa.',
    price: 3,
    badge: 'Pirotecnia',
    icon: '🎆',
    accentColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.5)',
    borderClass: 'border-rose-500/60',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    previewSummary: {
      purchase: 'Estouro pirotécnico floral com estalidos coloridos',
      terminal: 'Brilho radiante cintilante como mini-fogo de artifício',
      levelUp: 'Grande show pirotécnico disparado em múltiplos pontos'
    }
  },
  bubble_magic: {
    id: 'bubble_magic',
    name: 'Bolhas Mágicas Flutuantes',
    subtitle: 'Iridescência Aquática Suave',
    description: 'Bolhas translúcidas multicoloridas que sobem suavemente flutuando antes de estourar em gotículas de luz.',
    price: 2,
    badge: 'Mágico',
    icon: '🫧',
    accentColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    borderClass: 'border-cyan-500/60',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    previewSummary: {
      purchase: 'Enxame de bolhas translúcidas iridescentes com pop',
      terminal: 'Efeito flutuante aquático e pop suave nas letras',
      levelUp: 'Torrente suave de centenas de bolhas de sabão subindo'
    }
  },
  hyperspace_warp: {
    id: 'hyperspace_warp',
    name: 'Dobra Hiperespacial',
    subtitle: 'Salto no Hiperespaço Sci-Fi',
    description: 'Salto estelar com feixes de luz hiperespacial azuis e brancos se projetando do centro da tela.',
    price: 12,
    currency: 'duel_coins',
    badge: 'Hiperespaço',
    icon: '🚀',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    borderClass: 'border-sky-500/60',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    previewSummary: {
      purchase: 'Feixes de salto hiperespacial em alta velocidade',
      terminal: 'Rastro azul de dobra espacial nas letras digitadas',
      levelUp: 'Túnel completo de hiperespaço acelerando em tela cheia'
    }
  },
  kamehameha_energy: {
    id: 'kamehameha_energy',
    name: 'Esfera de Energia Quântica',
    subtitle: 'Rajada de Ki Cósmica',
    description: 'Ondas de choque circulares concêntricas azuis e douradas inspiradas em rajadas cósmicas de anime.',
    price: 14,
    currency: 'duel_coins',
    badge: 'Rajada de Ki',
    icon: '💥',
    accentColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.45)',
    borderClass: 'border-yellow-500/60',
    badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    previewSummary: {
      purchase: 'Esfera de energia concêntrica azul/dourada explodindo',
      terminal: 'Aura de Ki dourada flamejante nas letras acertadas',
      levelUp: 'Mega explosão de Ki cósmica estelar em tela cheia'
    }
  },
  diamond_rain: {
    id: 'diamond_rain',
    name: 'Chuva de Diamantes & Esmeraldas',
    subtitle: 'Gemas Preciosas Pixeladas',
    description: 'Gemas poligonais brilhantes de diamante azul e esmeralda verde caindo em cascata triunfante.',
    price: 12,
    currency: 'duel_coins',
    badge: 'Gemas Raras',
    icon: '💎',
    accentColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    borderClass: 'border-cyan-500/60',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    previewSummary: {
      purchase: 'Chafariz de diamantes e esmeraldas cúbicas cintilantes',
      terminal: 'Brilho facetado de diamante nas letras concluídas',
      levelUp: 'Chuva torrencial de gemas raras cintilantes em tela cheia'
    }
  },
  // Novos Efeitos VFX Míticos / Quânticos de Endgame (3ª Moeda 🌌)
  infinite_void_burst: {
    id: 'infinite_void_burst',
    name: 'Explosão do Vazio Infinito',
    subtitle: 'Singularidade Cósmica Estelar',
    description: 'Vórtice cósmico de estrelas ciano e preto profundo com anéis gravitacionais de distorção.',
    price: 34,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '🌌',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.6)',
    borderClass: 'border-sky-400/70',
    badgeClass: 'bg-sky-500/20 text-sky-200 border-sky-400/50',
    previewSummary: {
      purchase: 'Vórtice cósmico de estrelas ciano com anel gravitacional',
      terminal: 'Cursor de singularidade gravitacional cósmica',
      levelUp: 'Horizonte de eventos estelar em tela cheia com pulso infinito'
    }
  },
  gear_second_steam: {
    id: 'gear_second_steam',
    name: 'Erupção de Vapor Escarlate',
    subtitle: 'Segunda Marcha em Overdrive',
    description: 'Chafariz de vapor carmesim e faíscas escarlates com pulso de alta pressão.',
    price: 30,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '💨',
    accentColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.6)',
    borderClass: 'border-rose-400/70',
    badgeClass: 'bg-rose-500/20 text-rose-200 border-rose-400/50',
    previewSummary: {
      purchase: 'Geiser de vapor rosa e faíscas carmesins',
      terminal: 'Rastro de vapor escarlate acompanhando o texto',
      levelUp: 'Erupção de vapor escarlate e ondas de impacto elástico'
    }
  },
  gaster_bone_barrage: {
    id: 'gaster_bone_barrage',
    name: 'Barragem Gaster Blaster',
    subtitle: 'Ossos & Feixe Laser 1-Bit',
    description: 'Feixes de caveiras mecânicas retrô com faíscas ciano e ossos pixelados.',
    price: 33,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '💀',
    accentColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    borderClass: 'border-cyan-400/70',
    badgeClass: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50',
    previewSummary: {
      purchase: 'Disparo de feixes de blaster e ossos pixelados',
      terminal: 'Chama azul de Karma nas letras acertadas',
      levelUp: 'Mega bombardeio de feixes Gaster Blaster em tela cheia'
    }
  },
  sandevistan_afterimage: {
    id: 'sandevistan_afterimage',
    name: 'Rastro Sandevistan 2077',
    subtitle: 'Clones Holográficos Temporais',
    description: 'Rastro de silhuetas holográficas em amarelo militar e ciano laser desacelerando o tempo.',
    price: 35,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '⚡',
    accentColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.6)',
    borderClass: 'border-yellow-400/70',
    badgeClass: 'bg-yellow-500/20 text-yellow-200 border-yellow-400/50',
    previewSummary: {
      purchase: 'Clones holográficos em câmera lenta amarela e ciano',
      terminal: 'Eco temporal de réplicas nas letras digitadas',
      levelUp: 'Efeito completo de distorção temporal Sandevistan'
    }
  },
  water_flame_dragon: {
    id: 'water_flame_dragon',
    name: 'Dragão de Chamas & Água',
    subtitle: 'Dança das Chamas Solares',
    description: 'Torrentes fluidas de água azul e dragões de fogo solar entrelaçados em nanquim.',
    price: 32,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '🐉',
    accentColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    borderClass: 'border-orange-400/70',
    badgeClass: 'bg-orange-500/20 text-orange-200 border-orange-400/50',
    previewSummary: {
      purchase: 'Dragão de fogo solar e correnteza de água em espiral',
      terminal: 'Trilha fluida de água e faíscas solares nas letras',
      levelUp: 'Dança triunfal do dragão solar cruzando todo o visor'
    }
  },
  thunder_storm_vfx: {
    id: 'thunder_storm_vfx',
    name: 'Tempestade de Raios 100k Volts',
    subtitle: 'Fagulhas Amarelas & Eletrostática',
    description: 'Descargas elétricas estalantes amarelas e arcos voltaicos de console portátil.',
    price: 29,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '⚡',
    accentColor: '#facc15',
    glowColor: 'rgba(250, 204, 21, 0.6)',
    borderClass: 'border-yellow-300/70',
    badgeClass: 'bg-yellow-400/20 text-yellow-100 border-yellow-300/50',
    previewSummary: {
      purchase: 'Explosão de centelhas elétricas amarelas e azuis',
      terminal: 'Arco elétrico saltando entre as palavras',
      levelUp: 'Grande tempestade de trovões de 100k Volts em tela cheia'
    }
  },
  serious_shockwave: {
    id: 'serious_shockwave',
    name: 'Onda de Choque Soco Sério',
    subtitle: 'Impacto Sísmico de Mangá',
    description: 'Onda gravitacional sísmica vermelha com rachaduras de impacto no ar.',
    price: 36,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '👊',
    accentColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    borderClass: 'border-red-400/70',
    badgeClass: 'bg-red-500/20 text-red-200 border-red-400/50',
    previewSummary: {
      purchase: 'Onda de choque em anel expansivo estilhaçando partículas',
      terminal: 'Fissuras de impacto em nanquim nas letras',
      levelUp: 'Mega soco sísmico estilhaçando a tela com onda de choque'
    }
  },
  soul_vessel_burst: {
    id: 'soul_vessel_burst',
    name: 'Cascata de Gotas de Alma',
    subtitle: 'Vazio Místico de Hallownest',
    description: 'Gotículas brancas luminescentes de Alma e vaga-lumes azulados flutuando suavemente.',
    price: 30,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '✨',
    accentColor: '#7dd3fc',
    glowColor: 'rgba(125, 211, 252, 0.6)',
    borderClass: 'border-sky-300/70',
    badgeClass: 'bg-sky-400/20 text-sky-100 border-sky-300/50',
    previewSummary: {
      purchase: 'Gotículas de Alma pura e vaga-lumes cintilantes subindo',
      terminal: 'Brilho etéreo luminescente de Alma nas letras',
      levelUp: 'Inundação mística de Alma sagrada em tela cheia'
    }
  },
  golden_ring_burst: {
    id: 'golden_ring_burst',
    name: 'Chuva de Anéis Dourados',
    subtitle: 'Sprint Supersônico 16-Bit',
    description: 'Anéis dourados cintilantes giratórios e estrelas de aceleração máxima.',
    price: 29,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '🟡',
    accentColor: '#fde047',
    glowColor: 'rgba(253, 224, 71, 0.6)',
    borderClass: 'border-yellow-300/70',
    badgeClass: 'bg-yellow-400/20 text-yellow-100 border-yellow-300/50',
    previewSummary: {
      purchase: 'Chuva de anéis dourados girando em física de arcade',
      terminal: 'Rastro supersônico azul nas letras concluídas',
      levelUp: 'Chuva torrencial de anéis dourados e estrelas de velocidade'
    }
  },
  bat_swarm_vfx: {
    id: 'bat_swarm_vfx',
    name: 'Revoada de Morcegos da Noite',
    subtitle: 'Sonar Tático de Gotham',
    description: 'Revoada de silhuetas pretas de morcego e ondas concêntricas de sonar âmbar.',
    price: 33,
    currency: 'quantum_fragments',
    badge: 'Mítico 🌌',
    icon: '🦇',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    borderClass: 'border-amber-400/70',
    badgeClass: 'bg-amber-500/20 text-amber-200 border-amber-400/50',
    previewSummary: {
      purchase: 'Revoada de morcegos saindo em leque com ondas de sonar',
      terminal: 'Retícula de sonar tático nas palavras completadas',
      levelUp: 'Enxame massivo de morcegos cruzando a noite em tela cheia'
    }
  },
  whatsapp_bubbles_burst: {
    id: 'whatsapp_bubbles_burst',
    name: 'Balões & Confirmações Verdes',
    subtitle: 'Ticks Duplos & Chat Zap',
    description: 'Erupção de balões de mensagens esmeralda, polegares de confirmação 👍 e ticks azuis/verdes de entrega.',
    price: 6,
    badge: 'App Teen',
    icon: '💬',
    accentColor: '#25d366',
    glowColor: 'rgba(37, 211, 102, 0.5)',
    borderClass: 'border-[#25d366]/70',
    badgeClass: 'bg-[#25d366]/20 text-[#25d366] border-[#25d366]/40',
    previewSummary: {
      purchase: 'Explosão de balões de chat e ticks de confirmação',
      terminal: 'Aura esmeralda e pop de mensagem nas palavras',
      levelUp: 'Chuva torrencial de balões verdes, ticks duplos e joinhas'
    }
  },
  instagram_hearts_glow: {
    id: 'instagram_hearts_glow',
    name: 'Corações & Fagulhas Stories',
    subtitle: 'Sunset Magenta & Likes',
    description: 'Cascata vibrante de corações luminosos em gradiente rosa/magenta com anéis giratórios de Stories.',
    price: 6,
    badge: 'App Teen',
    icon: '💖',
    accentColor: '#e1306c',
    glowColor: 'rgba(225, 48, 108, 0.5)',
    borderClass: 'border-[#e1306c]/70',
    badgeClass: 'bg-[#e1306c]/20 text-pink-300 border-[#e1306c]/40',
    previewSummary: {
      purchase: 'Corações magenta pulsantes e faíscas de Stories',
      terminal: 'Pop suave de corações e gradiente pôr-do-sol',
      levelUp: 'Enxame de corações reluzentes com anéis de Stories'
    }
  },
  youtube_play_spark: {
    id: 'youtube_play_spark',
    name: 'Play Rubi & Faíscas de Like',
    subtitle: 'Play Button & Cinema',
    description: 'Explosão de botões de Play vermelhos com centelhas douradas de Like e anéis cinematográficos.',
    price: 5,
    badge: 'App Teen',
    icon: '▶️',
    accentColor: '#ff0000',
    glowColor: 'rgba(255, 0, 0, 0.5)',
    borderClass: 'border-red-500/70',
    badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40',
    previewSummary: {
      purchase: 'Jato de botões play e faíscas rubi com polegares dourados',
      terminal: 'Brilho cinematográfico vermelho com reflexo branco',
      levelUp: 'Chuva de placas de play rubi e faíscas triunfais'
    }
  },
  tiktok_music_glitch: {
    id: 'tiktok_music_glitch',
    name: 'Notas Musicais & Glitch Neon',
    subtitle: 'Batida Sonora Ciano & Magenta',
    description: 'Notas musicais saltitantes em meio a faixas de glitch anáglifo e shockwaves ao ritmo da batida.',
    price: 7,
    badge: 'App Teen',
    icon: '🎵',
    accentColor: '#00f2fe',
    glowColor: 'rgba(0, 242, 254, 0.5)',
    borderClass: 'border-[#00f2fe]/70',
    badgeClass: 'bg-[#00f2fe]/20 text-[#00f2fe] border-[#00f2fe]/40',
    previewSummary: {
      purchase: 'Fagulhas rítmicas de notas musicais e feixes neon',
      terminal: 'Glitch anáglifo estéreo ciano/magenta no acerto',
      levelUp: 'Explosão de notas musicais, ondas de grave e glitch'
    }
  },
  roblox_blocks_fall: {
    id: 'roblox_blocks_fall',
    name: 'Chuva de Blocos & Studs 3D',
    subtitle: 'Blocos de Construção & Peças',
    description: 'Chuva lúdica de blocos cúbicos coloridos (vermelho, azul, amarelo) e studs dourados.',
    price: 6,
    badge: 'App Teen',
    icon: '🧱',
    accentColor: '#e2231a',
    glowColor: 'rgba(226, 35, 26, 0.5)',
    borderClass: 'border-red-600/70',
    badgeClass: 'bg-red-600/20 text-red-300 border-red-600/40',
    previewSummary: {
      purchase: 'Blocos coloridos 3D quicando com studs dourados',
      terminal: 'Efeito tátil de encaixe de blocos nas teclas',
      levelUp: 'Avalanche de cubos 3D coloridos e faíscas de studs'
    }
  }
};

import { CARD_FRAME_CONFIGS, CardFrameId } from '../types/cardFrames';
export { CARD_FRAME_CONFIGS };
export type { CardFrameId };

/**
 * Helper de ADM: Desbloqueia 100% de todos os cosméticos (Layouts, Temas, Skins, Sons, Animações e Molduras de Card)
 * e concede saldo farto de tokens para testes rápidos do Professor Marcos Wrobel.
 */
export function getAllUnlockedCosmetics(current?: PlayerCosmetics): PlayerCosmetics {
  return {
    equippedTheme: current?.equippedTheme || 'matrix',
    equippedSkin: current?.equippedSkin || 'classic',
    equippedSound: current?.equippedSound || 'mechanical',
    equippedLayout: current?.equippedLayout || 'default_terminal',
    equippedAnimation: current?.equippedAnimation || 'confetti_classic',
    equippedCardFrame: current?.equippedCardFrame || 'basic',
    levelTokens: Math.max(current?.levelTokens ?? 0, 9999),
    duelTokens: Math.max(current?.duelTokens ?? 0, 9999),
    quantumFragments: Math.max(current?.quantumFragments ?? 0, 9999),
    unlockedThemes: Object.keys(TERMINAL_THEMES) as TerminalThemeId[],
    unlockedSkins: Object.keys(BYTEZINHO_SKINS) as BytezinhoSkinId[],
    unlockedSounds: Object.keys(KEY_SOUNDS) as KeySoundThemeId[],
    unlockedLayouts: Object.keys(LAYOUT_CONFIGS) as LayoutSkinId[],
    unlockedAnimations: Object.keys(ANIMATION_CONFIGS) as AnimationEffectId[],
    unlockedCardFrames: Object.keys(CARD_FRAME_CONFIGS) as CardFrameId[],
  };
}

