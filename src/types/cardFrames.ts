import { CosmeticCurrency, CosmeticRarity } from './cosmetics';

export type CardFrameId =
  | 'basic'
  | 'foil'
  | 'neon'
  | 'gold'
  | 'magma'
  | 'cosmic'
  | 'matrix'
  | 'steampunk';

export interface CardFrameConfig {
  id: CardFrameId;
  name: string;
  subtitle: string;
  description: string;
  rarity: CosmeticRarity;
  price: number;
  currency: CosmeticCurrency;
  badge: string;
  icon: string;
  // Classes CSS para customização visual
  containerClass: string;
  borderClass: string;
  bgGradient: string;
  headerGlow: string;
  accentText: string;
  overlayEffect?: 'foil_shine' | 'neon_pulse' | 'gold_sparkle' | 'magma_glow' | 'cosmic_stars' | 'matrix_scan';
  cornerDecorations?: string;
  sealLabel: string;
}

export const CARD_FRAME_CONFIGS: Record<CardFrameId, CardFrameConfig> = {
  basic: {
    id: 'basic',
    name: 'Terminal Leopoldina',
    subtitle: 'Clássico & Minimalista',
    description: 'A moldura oficial do laboratório escolar. Acabamento sóbrio em grafite profundo com sutis detalhes em esmeralda.',
    rarity: 'common',
    price: 0,
    currency: 'tokens',
    badge: 'Padrão',
    icon: '💻',
    containerClass: 'bg-[#0d1117] text-zinc-100',
    borderClass: 'border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    bgGradient: 'from-emerald-950/30 via-[#0d1117] to-[#0a0c10]',
    headerGlow: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    accentText: 'text-emerald-400',
    sealLabel: 'OFICIAL LEOPOLDINA'
  },
  foil: {
    id: 'foil',
    name: 'Foil Holográfico',
    subtitle: 'Prisma Iridescente Raro',
    description: 'Inspirado nas cartas colecionáveis mais raras. Reflete a luz em um arco-íris prismático furta-cor diagonal.',
    rarity: 'epic',
    price: 90,
    currency: 'tokens',
    badge: 'Holo Foil',
    icon: '✨',
    containerClass: 'bg-[#0f111a] text-white',
    borderClass: 'border-transparent bg-gradient-to-r from-pink-500 via-cyan-400 to-amber-300 shadow-[0_0_30px_rgba(236,72,153,0.35)]',
    bgGradient: 'from-purple-950/40 via-[#0c0e18] to-cyan-950/40',
    headerGlow: 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 text-pink-200 border-pink-400/40',
    accentText: 'text-pink-300',
    overlayEffect: 'foil_shine',
    sealLabel: 'PRISMATIC ULTRA RARE'
  },
  neon: {
    id: 'neon',
    name: 'Cyberpunk Synthwave',
    subtitle: 'Tubos de Neon Iluminados',
    description: 'Iluminação de rua noturna em alta voltagem com tubos de neon ciano e magenta e estética synthwave anos 80.',
    rarity: 'rare',
    price: 60,
    currency: 'tokens',
    badge: 'Neon 80s',
    icon: '⚡',
    containerClass: 'bg-[#060810] text-zinc-100',
    borderClass: 'border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.4),inset_0_0_15px_rgba(236,72,153,0.25)]',
    bgGradient: 'from-cyan-950/50 via-[#060810] to-pink-950/50',
    headerGlow: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.5)]',
    accentText: 'text-cyan-400',
    overlayEffect: 'neon_pulse',
    sealLabel: 'SYNTH CYBER OVERDRIVE'
  },
  gold: {
    id: 'gold',
    name: 'Ouro Imperial 24K',
    subtitle: 'Nobreza & Realeza Banhada a Ouro',
    description: 'Banhado a ouro maciço com arabescos ornamentais clássicos, brilho áureo e partículas cintilantes de tesouro.',
    rarity: 'legendary',
    price: 130,
    currency: 'tokens',
    badge: 'Royal 24K',
    icon: '👑',
    containerClass: 'bg-[#0f0c05] text-amber-100',
    borderClass: 'border-amber-400/90 shadow-[0_0_40px_rgba(251,191,36,0.45)] ring-2 ring-amber-500/30',
    bgGradient: 'from-amber-950/60 via-[#100d05] to-yellow-950/40',
    headerGlow: 'bg-amber-500/20 text-amber-300 border-amber-400/70 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    accentText: 'text-amber-400',
    overlayEffect: 'gold_sparkle',
    sealLabel: 'ROYAL GOLD 24 KARAT'
  },
  magma: {
    id: 'magma',
    name: 'Nether Magmático',
    subtitle: 'Fogo Ardente do Subterrâneo',
    description: 'Forjado no calor escaldante de fendas de lava com rochas de obsidiana rachadas e brasas incandescentes.',
    rarity: 'rare',
    price: 75,
    currency: 'tokens',
    badge: 'Magma',
    icon: '🔥',
    containerClass: 'bg-[#120606] text-orange-100',
    borderClass: 'border-orange-500/80 shadow-[0_0_35px_rgba(249,115,22,0.4)]',
    bgGradient: 'from-red-950/60 via-[#100505] to-orange-950/40',
    headerGlow: 'bg-orange-500/20 text-orange-300 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.4)]',
    accentText: 'text-orange-400',
    overlayEffect: 'magma_glow',
    sealLabel: 'INCANDESCENT LAVA CORE'
  },
  cosmic: {
    id: 'cosmic',
    name: 'Vazio Quântico Cósmico',
    subtitle: 'Poeira Estelar & Nebulosa',
    description: 'Poeira de galáxias distantes em violeta cósmico profundo, anéis orbitais e energia do infinito espacial.',
    rarity: 'legendary',
    price: 160,
    currency: 'tokens',
    badge: 'Cósmico',
    icon: '🌌',
    containerClass: 'bg-[#080512] text-purple-100',
    borderClass: 'border-purple-500/80 shadow-[0_0_40px_rgba(168,85,247,0.4)]',
    bgGradient: 'from-purple-950/50 via-[#0a0718] to-indigo-950/50',
    headerGlow: 'bg-purple-500/20 text-purple-300 border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    accentText: 'text-purple-400',
    overlayEffect: 'cosmic_stars',
    sealLabel: 'COSMIC VOID HORIZON'
  },
  matrix: {
    id: 'matrix',
    name: 'Glitch Binário',
    subtitle: 'Chuva de Códigos Hacker',
    description: 'Fluxo em cascata de dados binários verde fósforo, estética pura do submundo ciberespacial e terminais UNIX.',
    rarity: 'rare',
    price: 60,
    currency: 'tokens',
    badge: 'Hacker',
    icon: '👾',
    containerClass: 'bg-[#030a05] text-emerald-100',
    borderClass: 'border-green-500/80 shadow-[0_0_30px_rgba(34,197,94,0.35)]',
    bgGradient: 'from-green-950/60 via-[#040e06] to-emerald-950/40',
    headerGlow: 'bg-green-500/20 text-green-300 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.4)]',
    accentText: 'text-green-400',
    overlayEffect: 'matrix_scan',
    sealLabel: 'CIPHER PROTOCOL OVERFLOW'
  },
  steampunk: {
    id: 'steampunk',
    name: 'Forja a Vapor',
    subtitle: 'Engrenagens & Bronze Vitoriano',
    description: 'Rebites industriais em cobre escovado, manômetros analógicos e engrenagens mecânicas da era do vapor.',
    rarity: 'rare',
    price: 65,
    currency: 'tokens',
    badge: 'Steampunk',
    icon: '⚙️',
    containerClass: 'bg-[#100a06] text-amber-100',
    borderClass: 'border-amber-700/80 shadow-[0_0_30px_rgba(180,83,9,0.35)]',
    bgGradient: 'from-yellow-950/50 via-[#100a06] to-amber-950/40',
    headerGlow: 'bg-amber-700/20 text-amber-200 border-amber-600/50 shadow-[0_0_15px_rgba(180,83,9,0.3)]',
    accentText: 'text-amber-500',
    sealLabel: 'CHRONO BRONZE GEAR'
  }
};
