import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';
import { LayoutSkinId } from '../../types/cosmetics';
import {
  Eye,
  Sparkles,
  Zap,
  Anchor,
  Flame,
  Skull,
  Crosshair,
  Cpu,
  Activity,
  Swords,
  Droplets,
  Sun,
  Gamepad2,
  BatteryCharging,
  Award,
  FastForward,
  Disc,
  Radar,
  Radio,
  Gauge,
  Heart,
  Search,
  ShieldAlert
} from 'lucide-react';

export interface QuantumMythicLayoutProps extends BaseLayoutProps {
  layoutId: LayoutSkinId;
}

interface LayoutTheming {
  outerGradient: string;
  frameBorder: string;
  frameShadow: string;
  frameBg: string;
  cornerBorder: string;
  topBarBg: string;
  topBarBorder: string;
  topBarText: string;
  titleGradient: string;
  title: string;
  icon: React.ReactNode;
  badges: Array<{
    label: string;
    icon?: React.ReactNode;
    colorClass: string;
  }>;
  divideClass: string;
  sideColBg: string;
  centerColBg: string;
  leftHeader: {
    title: string;
    status: string;
    statusColor: string;
    barBg: string;
    barBorder: string;
    textColor: string;
  };
  centerHeader: {
    title: string;
    status: string;
    icon?: React.ReactNode;
    statusColor: string;
    barBg: string;
    barBorder: string;
    textColor: string;
  };
  rightHeader: {
    title: string;
    status: string;
    statusColor: string;
    barBg: string;
    barBorder: string;
    textColor: string;
  };
  footerBg: string;
  footerBorder: string;
  footerText: string;
  footerTelemetry: string;
  footerColor: string;
}

const THEMES_CONFIG: Record<string, LayoutTheming> = {
  infinite_void_realm: {
    outerGradient: 'from-[#060c22] via-[#020511] to-[#000105]',
    frameBorder: 'border-sky-400/60',
    frameShadow: 'shadow-[0_0_50px_rgba(56,189,248,0.3)]',
    frameBg: 'bg-[#02040d]/90',
    cornerBorder: 'border-sky-400',
    topBarBg: 'bg-[#050c20]',
    topBarBorder: 'border-sky-500/40',
    topBarText: 'text-sky-400',
    titleGradient: 'from-sky-300 via-indigo-300 to-cyan-200',
    title: 'EXPANSÃO DE DOMÍNIO // VAZIO INFINITO 領域展開',
    icon: <Eye className="w-4 h-4 text-sky-300 animate-pulse flex-shrink-0" />,
    badges: [
      {
        label: 'ILIMITADO: 100%',
        icon: <Sparkles className="w-3 h-3 text-sky-300 animate-spin" style={{ animationDuration: '6s' }} />,
        colorClass: 'text-sky-300 bg-sky-950/70 border-sky-500/50'
      },
      {
        label: 'SEIS OLHOS: ATIVO',
        icon: <Eye className="w-3.5 h-3.5 text-cyan-300" />,
        colorClass: 'text-cyan-200 bg-indigo-950/80 border-cyan-400/50'
      }
    ],
    divideClass: 'divide-sky-500/30',
    sideColBg: 'bg-[#030716]/95',
    centerColBg: 'bg-[#01030a]',
    leftHeader: {
      title: '[ FLUXO DE ENERGIA AMALDIÇOADA ]',
      status: 'REVERSÃO ATIVA',
      statusColor: 'text-sky-400',
      barBg: 'bg-sky-950/50',
      barBorder: 'border-sky-500/30',
      textColor: 'text-sky-300'
    },
    centerHeader: {
      title: 'SINGULARIDADE DO VAZIO // EVENT HORIZON',
      status: 'GRAVIDADE ZERO',
      icon: <Sparkles className="w-3.5 h-3.5 text-sky-400" />,
      statusColor: 'text-cyan-300 font-bold',
      barBg: 'bg-sky-950/50',
      barBorder: 'border-sky-500/30',
      textColor: 'text-sky-200'
    },
    rightHeader: {
      title: '[ INVERSÃO DE FEITIÇO (VERMELHO/AZUL) ]',
      status: 'PURÍSSIMO',
      statusColor: 'text-indigo-300 font-bold',
      barBg: 'bg-sky-950/50',
      barBorder: 'border-sky-500/30',
      textColor: 'text-sky-300'
    },
    footerBg: 'bg-[#030716]',
    footerBorder: 'border-sky-500/30',
    footerText: 'DOMÍNIO MÍTICO: O CONHECIMENTO CÓSMICO FLUINDO DIRETAMENTE PARA A MENTE',
    footerTelemetry: 'GRAVIDADE: INFINITA // TAXA DE ACERTO 100%',
    footerColor: 'text-sky-300/80'
  },
  pirate_deck: {
    outerGradient: 'from-[#240608] via-[#120204] to-[#060102]',
    frameBorder: 'border-rose-500/60',
    frameShadow: 'shadow-[0_0_50px_rgba(244,63,94,0.25)]',
    frameBg: 'bg-[#120306]/90',
    cornerBorder: 'border-rose-400',
    topBarBg: 'bg-[#1c0508]',
    topBarBorder: 'border-rose-500/40',
    topBarText: 'text-rose-400',
    titleGradient: 'from-amber-300 via-rose-400 to-red-500',
    title: 'CONVÉS DO THOUSAND // SEGUNDA MARCHA (GEAR SECOND)',
    icon: <Anchor className="w-4 h-4 text-amber-400 animate-bounce flex-shrink-0" />,
    badges: [
      {
        label: 'PRESSÃO: MAX',
        icon: <Flame className="w-3 h-3 text-rose-400 animate-pulse" />,
        colorClass: 'text-rose-300 bg-rose-950/60 border-rose-500/50 font-black'
      },
      {
        label: 'HAKI DO CONQUISTADOR',
        icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
        colorClass: 'text-amber-300 bg-amber-950/60 border-amber-500/50 font-bold'
      }
    ],
    divideClass: 'divide-rose-500/30',
    sideColBg: 'bg-[#160407]/95',
    centerColBg: 'bg-[#0b0103]',
    leftHeader: {
      title: '[ DIÁRIO DE BORDO & LOG POSE ]',
      status: 'ROTA: GRAND LINE',
      statusColor: 'text-amber-400',
      barBg: 'bg-rose-950/50',
      barBorder: 'border-rose-500/30',
      textColor: 'text-rose-300'
    },
    centerHeader: {
      title: 'CONVÉS PRINCIPAL & METRALHADORA DE GOMA',
      status: 'VAPOR ESCARLATE',
      icon: <Flame className="w-3.5 h-3.5 text-rose-400" />,
      statusColor: 'text-rose-400 font-bold',
      barBg: 'bg-rose-950/50',
      barBorder: 'border-rose-500/30',
      textColor: 'text-amber-200'
    },
    rightHeader: {
      title: '[ BANQUETE DO CAPITÃO & SUPRIMENTOS ]',
      status: 'CARNE 100%',
      statusColor: 'text-emerald-400 font-bold',
      barBg: 'bg-rose-950/50',
      barBorder: 'border-rose-500/30',
      textColor: 'text-rose-300'
    },
    footerBg: 'bg-[#160407]',
    footerBorder: 'border-rose-500/30',
    footerText: 'REI DOS DIGITADORES: EU SEREI O REI DESTE OCEANO DE DADOS!',
    footerTelemetry: 'VELOCIDADE: GATLING 120+ PPM',
    footerColor: 'text-rose-300/80'
  },
  judgment_hall: {
    outerGradient: 'from-[#03111b] via-[#02090e] to-[#010305]',
    frameBorder: 'border-cyan-400/60',
    frameShadow: 'shadow-[0_0_50px_rgba(6,182,212,0.25)]',
    frameBg: 'bg-[#030a10]/95',
    cornerBorder: 'border-cyan-400',
    topBarBg: 'bg-[#020e18]',
    topBarBorder: 'border-cyan-500/40',
    topBarText: 'text-cyan-400',
    titleGradient: 'from-cyan-300 via-sky-200 to-white',
    title: 'ÚLTIMO CORREDOR // SALÃO DO JULGAMENTO (BAD TIME)',
    icon: <Skull className="w-4 h-4 text-cyan-300 animate-pulse flex-shrink-0" />,
    badges: [
      {
        label: 'KARMA RETRIBUIÇÃO: ATIVO',
        icon: <Zap className="w-3 h-3 text-cyan-400" />,
        colorClass: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/50 font-bold'
      },
      {
        label: 'HP 1/1 // LV 1',
        icon: <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500" />,
        colorClass: 'text-rose-300 bg-rose-950/60 border-rose-500/50 font-bold'
      }
    ],
    divideClass: 'divide-cyan-500/30',
    sideColBg: 'bg-[#040e16]/95',
    centerColBg: 'bg-[#010508]',
    leftHeader: {
      title: '[ RELATÓRIO DE PECADOS // CHECK ]',
      status: 'DETERMINAÇÃO',
      statusColor: 'text-yellow-400',
      barBg: 'bg-cyan-950/50',
      barBorder: 'border-cyan-500/30',
      textColor: 'text-cyan-300'
    },
    centerHeader: {
      title: 'ARENA 1-BIT // DISPARADORES GASTER BLASTER',
      status: 'CHAMA AZUL',
      icon: <Crosshair className="w-3.5 h-3.5 text-cyan-400" />,
      statusColor: 'text-cyan-400 font-bold',
      barBg: 'bg-cyan-950/50',
      barBorder: 'border-cyan-500/30',
      textColor: 'text-white'
    },
    rightHeader: {
      title: '[ BARRACA DE CACHORRO-QUENTE DO SANS ]',
      status: 'HOT DOG: SALVO',
      statusColor: 'text-emerald-400 font-bold',
      barBg: 'bg-cyan-950/50',
      barBorder: 'border-cyan-500/30',
      textColor: 'text-cyan-300'
    },
    footerBg: 'bg-[#040e16]',
    footerBorder: 'border-cyan-500/30',
    footerText: 'MEGALOVÂNIA: VOCÊ SENTE SEUS ERROS RASTEJANDO PELAS SUAS COSTAS.',
    footerTelemetry: 'MISS RATE: 0.00% // ESQUIVA PERFEITA',
    footerColor: 'text-cyan-300/80'
  },
  edgerunner_rig: {
    outerGradient: 'from-[#1f1d04] via-[#0d0c01] to-[#030300]',
    frameBorder: 'border-yellow-400/80',
    frameShadow: 'shadow-[0_0_50px_rgba(234,179,8,0.3)]',
    frameBg: 'bg-[#0d0f04]/90',
    cornerBorder: 'border-yellow-400',
    topBarBg: 'bg-[#191c04]',
    topBarBorder: 'border-yellow-400/50',
    topBarText: 'text-yellow-400',
    titleGradient: 'from-yellow-300 via-amber-400 to-cyan-300',
    title: 'SANDEVISTAN OVERDRIVE // NEURAL PROTOCOL 2077',
    icon: <Cpu className="w-4 h-4 text-yellow-400 animate-spin flex-shrink-0" style={{ animationDuration: '12s' }} />,
    badges: [
      {
        label: 'TEMPO: -85% DILATAÇÃO',
        icon: <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />,
        colorClass: 'text-cyan-300 bg-cyan-950/60 border-cyan-400/50 font-black'
      },
      {
        label: 'IMUNOSUPRESSOR: ESTÁVEL',
        icon: <Zap className="w-3.5 h-3.5 text-yellow-400" />,
        colorClass: 'text-yellow-300 bg-yellow-950/60 border-yellow-400/50 font-bold'
      }
    ],
    divideClass: 'divide-yellow-400/30',
    sideColBg: 'bg-[#131705]/95',
    centerColBg: 'bg-[#080902]',
    leftHeader: {
      title: '[ TELEMETRIA CIBERMÉDICA RIFFER ]',
      status: 'SISTEMA NEURAL OK',
      statusColor: 'text-emerald-400',
      barBg: 'bg-yellow-950/50',
      barBorder: 'border-yellow-400/30',
      textColor: 'text-yellow-300'
    },
    centerHeader: {
      title: 'ACELERAÇÃO NEURAL // 120+ PPM SANDY BOOST',
      status: 'OVERDRIVE NEON',
      icon: <FastForward className="w-3.5 h-3.5 text-yellow-400" />,
      statusColor: 'text-cyan-300 font-bold',
      barBg: 'bg-yellow-950/50',
      barBorder: 'border-yellow-400/30',
      textColor: 'text-yellow-200'
    },
    rightHeader: {
      title: '[ UPGRADES MILITARES & CHIPS ARASAKA ]',
      status: 'EDGERUNNER CHIP',
      statusColor: 'text-cyan-400 font-bold',
      barBg: 'bg-yellow-950/50',
      barBorder: 'border-yellow-400/30',
      textColor: 'text-yellow-300'
    },
    footerBg: 'bg-[#131705]',
    footerBorder: 'border-yellow-400/30',
    footerText: 'NIGHT CITY LEGEND: VÁ ATÉ O TOPO DA TORRE ARASAKA, NUNCA OLHE PARA TRÁS!',
    footerTelemetry: 'CLONES HOLOGRÁFICOS TEMPORAIS: ATIVOS',
    footerColor: 'text-yellow-300/80'
  },
  slayer_dojo: {
    outerGradient: 'from-[#240c03] via-[#120601] to-[#050200]',
    frameBorder: 'border-orange-500/70',
    frameShadow: 'shadow-[0_0_50px_rgba(249,115,22,0.25)]',
    frameBg: 'bg-[#140602]/90',
    cornerBorder: 'border-orange-400',
    topBarBg: 'bg-[#1c0803]',
    topBarBorder: 'border-orange-500/40',
    topBarText: 'text-orange-400',
    titleGradient: 'from-amber-400 via-orange-400 to-rose-400',
    title: 'DOJO ANCESTRAL // RESPIRAÇÃO DA ÁGUA & DANÇA SOLAR',
    icon: <Swords className="w-4 h-4 text-orange-400 animate-pulse flex-shrink-0" />,
    badges: [
      {
        label: 'KATANA NICHIRIN: CARMESIM',
        icon: <Flame className="w-3 h-3 text-amber-400" />,
        colorClass: 'text-amber-300 bg-amber-950/60 border-amber-500/50 font-bold'
      },
      {
        label: 'MARCA DO CAÇADOR: ATIVA',
        icon: <Sun className="w-3.5 h-3.5 text-orange-400" />,
        colorClass: 'text-orange-200 bg-orange-950/60 border-orange-500/50 font-bold'
      }
    ],
    divideClass: 'divide-orange-500/30',
    sideColBg: 'bg-[#180703]/95',
    centerColBg: 'bg-[#0b0301]',
    leftHeader: {
      title: '[ BIOMBO DE MEDITAÇÃO & OLFATO ]',
      status: 'FIO DE ABERTURA',
      statusColor: 'text-amber-400',
      barBg: 'bg-orange-950/50',
      barBorder: 'border-orange-500/30',
      textColor: 'text-orange-300'
    },
    centerHeader: {
      title: 'DÉCIMA FORMA: DRAGÃO DA MUDANÇA // CHAMA CONSTANTE',
      status: 'FLUIDEZ TOTAL',
      icon: <Droplets className="w-3.5 h-3.5 text-sky-400" />,
      statusColor: 'text-orange-400 font-bold',
      barBg: 'bg-orange-950/50',
      barBorder: 'border-orange-500/30',
      textColor: 'text-amber-200'
    },
    rightHeader: {
      title: '[ CAIXA DE CEDRO & FERRARIA DE KATANAS ]',
      status: 'AÇO TAMAHAGANE',
      statusColor: 'text-emerald-400 font-bold',
      barBg: 'bg-orange-950/50',
      barBorder: 'border-orange-500/30',
      textColor: 'text-orange-300'
    },
    footerBg: 'bg-[#180703]',
    footerBorder: 'border-orange-500/30',
    footerText: 'HINOKAMI KAGURA: ACENDA SEU CORAÇÃO E DIGITE ALÉM DOS SEUS LIMITES!',
    footerTelemetry: 'CONCENTRAÇÃO TOTAL: CONSTANTE',
    footerColor: 'text-orange-300/80'
  },
  pocket_console: {
    outerGradient: 'from-[#262103] via-[#120f01] to-[#050400]',
    frameBorder: 'border-yellow-300/70',
    frameShadow: 'shadow-[0_0_50px_rgba(253,224,71,0.25)]',
    frameBg: 'bg-[#141203]/90',
    cornerBorder: 'border-yellow-300',
    topBarBg: 'bg-[#1c1904]',
    topBarBorder: 'border-yellow-400/40',
    topBarText: 'text-yellow-400',
    titleGradient: 'from-yellow-200 via-amber-300 to-yellow-400',
    title: 'CONSOLE PORTÁTIL 1996 // CARGA 100.000 VOLTS',
    icon: <Gamepad2 className="w-4 h-4 text-yellow-300 animate-pulse flex-shrink-0" />,
    badges: [
      {
        label: 'BATERIA: 99%',
        icon: <BatteryCharging className="w-3 h-3 text-emerald-400" />,
        colorClass: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/50 font-bold'
      },
      {
        label: 'TIPO: ELÉTRICO PURÍSSIMO',
        icon: <Zap className="w-3.5 h-3.5 text-yellow-400" />,
        colorClass: 'text-yellow-200 bg-yellow-950/60 border-yellow-400/50 font-bold'
      }
    ],
    divideClass: 'divide-yellow-400/30',
    sideColBg: 'bg-[#191604]/95',
    centerColBg: 'bg-[#0d0c02]',
    leftHeader: {
      title: '[ POKÉDEX & STATUS DE COMBATE ]',
      status: 'LVL 100 ELITE',
      statusColor: 'text-yellow-400',
      barBg: 'bg-yellow-950/50',
      barBorder: 'border-yellow-400/30',
      textColor: 'text-yellow-300'
    },
    centerHeader: {
      title: 'TELA DOT-MATRIX LCD // CHOQUE DO TROVÃO',
      status: 'FAÍSCA 100kV',
      icon: <Zap className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />,
      statusColor: 'text-yellow-400 font-bold',
      barBg: 'bg-yellow-950/50',
      barBorder: 'border-yellow-400/30',
      textColor: 'text-yellow-100'
    },
    rightHeader: {
      title: '[ MOCHILA DE ITENS & POÇÕES DE COMBATE ]',
      status: 'SLOTS CHEIOS',
      statusColor: 'text-emerald-400 font-bold',
      barBg: 'bg-yellow-950/50',
      barBorder: 'border-yellow-400/30',
      textColor: 'text-yellow-300'
    },
    footerBg: 'bg-[#191604]',
    footerBorder: 'border-yellow-400/30',
    footerText: 'LIGA DOS CAMPEÕES: UMA FAÍSCA DE PRECISÃO DECIDE O CONFRONTO!',
    footerTelemetry: 'LINK CABLE: SINCRONIZADO // 8-BIT STEREO',
    footerColor: 'text-yellow-300/80'
  },
  manga_action: {
    outerGradient: 'from-[#240404] via-[#120202] to-[#040000]',
    frameBorder: 'border-red-500/80',
    frameShadow: 'shadow-[0_0_50px_rgba(239,68,68,0.3)]',
    frameBg: 'bg-[#120303]/90',
    cornerBorder: 'border-red-500',
    topBarBg: 'bg-[#1c0404]',
    topBarBorder: 'border-red-500/50',
    topBarText: 'text-red-400',
    titleGradient: 'from-yellow-300 via-rose-300 to-white',
    title: 'PÁGINA DUPLA DE MANGÁ // SÉRIE DE SOCOS SÉRIOS',
    icon: <Award className="w-4 h-4 text-yellow-400 animate-bounce flex-shrink-0" />,
    badges: [
      {
        label: 'LIMITADOR: QUEBRADO',
        icon: <Zap className="w-3 h-3 text-red-400" />,
        colorClass: 'text-red-300 bg-red-950/60 border-red-500/50 font-black'
      },
      {
        label: 'FORÇA: INCOMENSURÁVEL',
        icon: <Flame className="w-3.5 h-3.5 text-yellow-400" />,
        colorClass: 'text-yellow-200 bg-amber-950/60 border-amber-500/50 font-bold'
      }
    ],
    divideClass: 'divide-red-500/30',
    sideColBg: 'bg-[#170303]/95',
    centerColBg: 'bg-[#0a0101]',
    leftHeader: {
      title: '[ PROMOÇÃO DO SUPERMERCADO NO SÁBADO ]',
      status: 'ECONOMIA 50%',
      statusColor: 'text-yellow-400 font-bold',
      barBg: 'bg-red-950/50',
      barBorder: 'border-red-500/30',
      textColor: 'text-red-300'
    },
    centerHeader: {
      title: 'QUADRO DE IMPACTO DUPLO // SOCO SÉRIO',
      status: 'ONDA DE CHOQUE',
      icon: <Flame className="w-3.5 h-3.5 text-rose-500" />,
      statusColor: 'text-yellow-400 font-bold',
      barBg: 'bg-red-950/50',
      barBorder: 'border-red-500/30',
      textColor: 'text-white'
    },
    rightHeader: {
      title: '[ ASSOCIAÇÃO DE HERÓIS CLASSE-S ]',
      status: 'RANK 1 SECRETO',
      statusColor: 'text-red-400 font-bold',
      barBg: 'bg-red-950/50',
      barBorder: 'border-red-500/30',
      textColor: 'text-red-300'
    },
    footerBg: 'bg-[#170303]',
    footerBorder: 'border-red-500/30',
    footerText: 'HERÓI POR PASSATEMPO: APENAS UM HOMEM QUE DIGITA POR DIVERSÃO.',
    footerTelemetry: '100 FLEXÕES • 100 ABDOMINAIS • 10K DIGITAÇÕES TODO DIA',
    footerColor: 'text-red-300/80'
  },
  hollow_ruins: {
    outerGradient: 'from-[#03111f] via-[#02070e] to-[#000306]',
    frameBorder: 'border-sky-300/60',
    frameShadow: 'shadow-[0_0_50px_rgba(125,211,252,0.25)]',
    frameBg: 'bg-[#030912]/90',
    cornerBorder: 'border-sky-300',
    topBarBg: 'bg-[#040e1b]',
    topBarBorder: 'border-sky-400/40',
    topBarText: 'text-sky-300',
    titleGradient: 'from-sky-200 via-teal-200 to-white',
    title: 'REINO DE HALLOWNEST // ECO DO VAZIO SAGRADO',
    icon: <Sparkles className="w-4 h-4 text-sky-200 animate-pulse flex-shrink-0" />,
    badges: [
      {
        label: 'FRASCO DE ALMA: 100%',
        icon: <Droplets className="w-3 h-3 text-sky-300" />,
        colorClass: 'text-sky-200 bg-sky-950/60 border-sky-400/50 font-bold'
      },
      {
        label: 'AGULHA PURA: FORJADA',
        icon: <Crosshair className="w-3.5 h-3.5 text-white" />,
        colorClass: 'text-teal-200 bg-teal-950/60 border-teal-500/50 font-bold'
      }
    ],
    divideClass: 'divide-sky-400/30',
    sideColBg: 'bg-[#040e1a]/95',
    centerColBg: 'bg-[#010408]',
    leftHeader: {
      title: '[ BANCO DE PEDRA & MAPA DE CORNIFER ]',
      status: 'CANTO DA PENA',
      statusColor: 'text-sky-300',
      barBg: 'bg-sky-950/50',
      barBorder: 'border-sky-400/30',
      textColor: 'text-sky-200'
    },
    centerHeader: {
      title: 'CIDADE DAS LÁGRIMAS // FOCO DE ALMA',
      status: 'VAZIO MÍSTICO',
      icon: <Sparkles className="w-3.5 h-3.5 text-sky-300" />,
      statusColor: 'text-sky-300 font-bold',
      barBg: 'bg-sky-950/50',
      barBorder: 'border-sky-400/30',
      textColor: 'text-white'
    },
    rightHeader: {
      title: '[ AMULETOS DE SALUBRA & GEOS ]',
      status: 'NOTCHES: MAX',
      statusColor: 'text-emerald-400 font-bold',
      barBg: 'bg-sky-950/50',
      barBorder: 'border-sky-400/30',
      textColor: 'text-sky-200'
    },
    footerBg: 'bg-[#040e1a]',
    footerBorder: 'border-sky-400/30',
    footerText: 'SEM VOZ PARA CHORAR SOFRIMENTO: NASCIDO DE DEUS E DO VAZIO.',
    footerTelemetry: 'ALMA LUMINOSA // 100% SINTONIZADA',
    footerColor: 'text-sky-200/80'
  },
  green_hills_zone: {
    outerGradient: 'from-[#041a2e] via-[#020d17] to-[#000408]',
    frameBorder: 'border-sky-400/70',
    frameShadow: 'shadow-[0_0_50px_rgba(56,189,248,0.25)]',
    frameBg: 'bg-[#030e1c]/90',
    cornerBorder: 'border-sky-400',
    topBarBg: 'bg-[#04152a]',
    topBarBorder: 'border-sky-400/40',
    topBarText: 'text-sky-300',
    titleGradient: 'from-sky-300 via-yellow-300 to-emerald-300',
    title: 'ZONA COLINAS TROPICAIS // SPRINT SUPERSÔNICO ACT 1',
    icon: <FastForward className="w-4 h-4 text-yellow-400 animate-spin flex-shrink-0" style={{ animationDuration: '4s' }} />,
    badges: [
      {
        label: 'ANÉIS: 999',
        icon: <Disc className="w-3 h-3 text-yellow-300 animate-pulse" />,
        colorClass: 'text-yellow-200 bg-yellow-950/60 border-yellow-400/50 font-black'
      },
      {
        label: 'VELOCIDADE: MACH 3',
        icon: <Gauge className="w-3.5 h-3.5 text-sky-400" />,
        colorClass: 'text-sky-200 bg-sky-950/60 border-sky-400/50 font-bold'
      }
    ],
    divideClass: 'divide-sky-400/30',
    sideColBg: 'bg-[#041426]/95',
    centerColBg: 'bg-[#020812]',
    leftHeader: {
      title: '[ MONITOR DE CHECKPOINTS 16-BIT ]',
      status: 'TIME: 0\'14"22',
      statusColor: 'text-yellow-400 font-bold',
      barBg: 'bg-sky-950/50',
      barBorder: 'border-sky-400/30',
      textColor: 'text-sky-300'
    },
    centerHeader: {
      title: 'LOOP-DE-LOOP & SPRINT DE DIGITAÇÃO VELOZ',
      status: 'SPIN DASH',
      icon: <Zap className="w-3.5 h-3.5 text-yellow-400" />,
      statusColor: 'text-emerald-400 font-bold',
      barBg: 'bg-sky-950/50',
      barBorder: 'border-sky-400/30',
      textColor: 'text-yellow-200'
    },
    rightHeader: {
      title: '[ ESMERALDAS DO CAOS & ITENS ]',
      status: '7/7 ESMERALDAS',
      statusColor: 'text-emerald-300 font-bold',
      barBg: 'bg-sky-950/50',
      barBorder: 'border-sky-400/30',
      textColor: 'text-sky-300'
    },
    footerBg: 'bg-[#041426]',
    footerBorder: 'border-sky-400/30',
    footerText: 'GOTTA GO FAST: SE VOCÊ PISCAR, VAI PERDER A LINHA DE CHEGADA!',
    footerTelemetry: 'SCORE: 999.999 // RANK S ESCURIDÃO',
    footerColor: 'text-sky-200/80'
  },
  bat_cave_tactical: {
    outerGradient: 'from-[#1c1402] via-[#0d0901] to-[#030200]',
    frameBorder: 'border-amber-500/60',
    frameShadow: 'shadow-[0_0_50px_rgba(245,158,11,0.25)]',
    frameBg: 'bg-[#090703]/90',
    cornerBorder: 'border-amber-400',
    topBarBg: 'bg-[#140e04]',
    topBarBorder: 'border-amber-500/40',
    topBarText: 'text-amber-400',
    titleGradient: 'from-amber-300 via-yellow-400 to-amber-200',
    title: 'BATCOMPUTADOR GOTHAM // SONAR TÁTICO MILITAR',
    icon: <Radar className="w-4 h-4 text-amber-400 animate-spin flex-shrink-0" style={{ animationDuration: '8s' }} />,
    badges: [
      {
        label: 'SONAR 360°: ATIVO',
        icon: <Radio className="w-3 h-3 text-amber-400 animate-pulse" />,
        colorClass: 'text-amber-300 bg-amber-950/60 border-amber-500/50 font-bold'
      },
      {
        label: 'PROTOCOLO: PREPARAÇÃO TOTAL',
        icon: <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" />,
        colorClass: 'text-yellow-200 bg-yellow-950/60 border-yellow-500/50 font-bold'
      }
    ],
    divideClass: 'divide-amber-500/30',
    sideColBg: 'bg-[#110c03]/95',
    centerColBg: 'bg-[#060401]',
    leftHeader: {
      title: '[ ARQUIVOS DA BATCAVERNA & CRIMINAIS ]',
      status: 'SISTEMA TÁTICO',
      statusColor: 'text-amber-400',
      barBg: 'bg-amber-950/50',
      barBorder: 'border-amber-500/30',
      textColor: 'text-amber-300'
    },
    centerHeader: {
      title: 'MONITOR PRINCIPAL 8K // VISÃO DE DETETIVE NOTURNO',
      status: 'INFRAVERMELHO',
      icon: <Search className="w-3.5 h-3.5 text-amber-400" />,
      statusColor: 'text-amber-300 font-bold',
      barBg: 'bg-amber-950/50',
      barBorder: 'border-amber-500/30',
      textColor: 'text-amber-200'
    },
    rightHeader: {
      title: '[ CINTO DE UTILIDADES & GADGETS WAYNE ]',
      status: 'BATARANGS: OK',
      statusColor: 'text-emerald-400 font-bold',
      barBg: 'bg-amber-950/50',
      barBorder: 'border-amber-500/30',
      textColor: 'text-amber-300'
    },
    footerBg: 'bg-[#110c03]',
    footerBorder: 'border-amber-500/30',
    footerText: 'EU SOU A NOITE: JUSTIÇA DIGITADA EM CADA CARACTERE SEM HESITAÇÃO.',
    footerTelemetry: 'DEFCON 1 // VIGILÂNCIA DE GOTHAM 24/7',
    footerColor: 'text-amber-300/80'
  }
};

export const QuantumMythicLayout: React.FC<QuantumMythicLayoutProps> = ({
  layoutId,
  header,
  sidebar,
  arena,
  shop,
  overlays,
  appBgClass = 'bg-[#020208]'
}) => {
  const theme = THEMES_CONFIG[layoutId] || THEMES_CONFIG.infinite_void_realm;

  return (
    <div
      className={`min-h-screen ${appBgClass} text-white flex flex-col font-mono select-none overflow-x-hidden p-1 sm:p-2 md:p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${theme.outerGradient}`}
    >
      {overlays}

      {/* Frame Principal do Layout Mítico */}
      <div
        className={`w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col border-2 ${theme.frameBorder} rounded-2xl ${theme.frameShadow} relative overflow-hidden ${theme.frameBg} backdrop-blur-md min-w-0`}
      >
        {/* Cantoneiras Estilizadas Míticas */}
        <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 ${theme.cornerBorder} z-30 pointer-events-none`} />
        <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 ${theme.cornerBorder} z-30 pointer-events-none`} />
        <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 ${theme.cornerBorder} z-30 pointer-events-none`} />
        <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 ${theme.cornerBorder} z-30 pointer-events-none`} />

        {/* Barra Superior - HUD & Status do Domínio */}
        <div
          className={`${theme.topBarBg} border-b ${theme.topBarBorder} px-3 sm:px-6 py-2 flex items-center justify-between text-[11px] sm:text-xs flex-shrink-0 min-w-0`}
        >
          <div className="flex items-center gap-2.5 min-w-0 truncate">
            {theme.icon}
            <span className={`font-black tracking-widest uppercase truncate text-transparent bg-clip-text bg-gradient-to-r ${theme.titleGradient}`}>
              {theme.title}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-mono flex-shrink-0">
            {theme.badges.map((badge, idx) => (
              <span
                key={idx}
                className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded border font-bold ${badge.colorClass}`}
              >
                {badge.icon}
                <span>{badge.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Header do Jogo */}
        <div className="flex-shrink-0">
          {header}
        </div>

        {/* Grid 3 Colunas: Sidebar, Arena e Shop */}
        <main
          className={`flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y lg:divide-y-0 lg:divide-x ${theme.divideClass} min-w-0`}
        >
          {/* Esquerda: Sidebar */}
          <div className={`w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 ${theme.sideColBg}`}>
            <div
              className={`${theme.leftHeader.barBg} px-3 py-1.5 border-b ${theme.leftHeader.barBorder} text-[10px] font-bold ${theme.leftHeader.textColor} tracking-wider flex items-center justify-between flex-shrink-0`}
            >
              <span className="truncate">{theme.leftHeader.title}</span>
              <span className={`${theme.leftHeader.statusColor} font-bold flex-shrink-0`}>{theme.leftHeader.status}</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
          </div>

          {/* Centro: Arena */}
          <div className={`flex-1 min-w-0 flex flex-col ${theme.centerColBg} overflow-y-auto`}>
            <div
              className={`${theme.centerHeader.barBg} px-4 py-1.5 border-b ${theme.centerHeader.barBorder} text-[10px] font-bold ${theme.centerHeader.textColor} tracking-wider flex items-center justify-between flex-shrink-0`}
            >
              <span className="flex items-center gap-1.5 truncate">
                {theme.centerHeader.icon}
                <span className="truncate">{theme.centerHeader.title}</span>
              </span>
              <span className={`${theme.centerHeader.statusColor} font-bold flex-shrink-0`}>{theme.centerHeader.status}</span>
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-center">{arena}</div>
          </div>

          {/* Direita: Shop */}
          <div className={`w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0 ${theme.sideColBg}`}>
            <div
              className={`${theme.rightHeader.barBg} px-3 py-1.5 border-b ${theme.rightHeader.barBorder} text-[10px] font-bold ${theme.rightHeader.textColor} tracking-wider flex items-center justify-between flex-shrink-0`}
            >
              <span className="truncate">{theme.rightHeader.title}</span>
              <span className={`${theme.rightHeader.statusColor} font-bold flex-shrink-0`}>{theme.rightHeader.status}</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
          </div>
        </main>

        {/* Rodapé Thematic Lore */}
        <footer
          className={`${theme.footerBg} border-t ${theme.footerBorder} px-3 sm:px-6 py-1.5 flex items-center justify-between text-[10px] sm:text-[11px] ${theme.footerColor} font-mono flex-shrink-0`}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold truncate">{theme.footerText}</span>
          </div>
          <div className="font-bold truncate ml-2 hidden sm:block">
            {theme.footerTelemetry}
          </div>
        </footer>
      </div>
    </div>
  );
};
