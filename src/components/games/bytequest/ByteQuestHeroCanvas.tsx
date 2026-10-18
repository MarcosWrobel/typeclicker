// ─────────────────────────────────────────────────────────────
// Renderizador Vetorial do Herói — Bytezinho RPG por Classe
// O Mascote Oficial da Plataforma caracterizado como Guerreiro, Arqueiro ou Mago
// 100% SVG nativo, Zero Emojis de Sistema
// ─────────────────────────────────────────────────────────────

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroLoadout, ItemRarity } from '../../../types/byteQuest';
import { RpgClassType } from '../../../types/rpgClass';

export interface ByteQuestHeroCanvasProps {
  loadout?: HeroLoadout;
  rpgClass?: RpgClassType;
  isAttacking?: boolean;
  isTakingDamage?: boolean;
  isVictory?: boolean;
  className?: string;
  size?: number | string;
}

export const ByteQuestHeroCanvas: React.FC<ByteQuestHeroCanvasProps> = ({
  loadout = {},
  rpgClass = 'warrior',
  isAttacking = false,
  isTakingDamage = false,
  isVictory = false,
  className = '',
  size = 220
}) => {
  // Paletas temáticas por classe
  const classPalettes: Record<RpgClassType, {
    primary: string;
    secondary: string;
    glow: string;
    eyeColor: string;
    accent: string;
  }> = {
    warrior: {
      primary: '#EF4444',
      secondary: '#991B1B',
      glow: 'rgba(239, 68, 68, 0.45)',
      eyeColor: '#FCA5A5',
      accent: '#F59E0B'
    },
    archer: {
      primary: '#10B981',
      secondary: '#065F46',
      glow: 'rgba(16, 185, 129, 0.45)',
      eyeColor: '#6EE7B7',
      accent: '#FBBF24'
    },
    mage: {
      primary: '#8B5CF6',
      secondary: '#5B21B6',
      glow: 'rgba(139, 92, 246, 0.45)',
      eyeColor: '#C4B5FD',
      accent: '#38BDF8'
    }
  };

  const palette = classPalettes[rpgClass] || classPalettes.warrior;

  // Determina a raridade máxima equipada para modular a aura
  const rarities: ItemRarity[] = [
    loadout.weapon?.rarity,
    loadout.chest?.rarity,
    loadout.head?.rarity,
    loadout.accessory?.rarity
  ].filter(Boolean) as ItemRarity[];

  const hasQuantum = rarities.includes('quantum');
  const hasEpic = rarities.includes('epic');
  const hasRare = rarities.includes('rare');

  const auraColor = hasQuantum
    ? 'rgba(245, 158, 11, 0.5)'
    : hasEpic
    ? 'rgba(168, 85, 247, 0.45)'
    : hasRare
    ? 'rgba(6, 182, 212, 0.4)'
    : palette.glow;

  // ─── RENDERIZADORES DE ADORNO / ELMO (HEAD) ───
  const renderClassHeadgear = () => {
    if (rpgClass === 'warrior') {
      return (
        <g id="bytezinho-warrior-helm">
          <path d="M 62 48 L 138 48 L 134 32 L 66 32 Z" fill="#3F3F46" stroke="#71717A" strokeWidth="2" />
          <path d="M 94 32 L 94 12 C 94 8, 106 8, 106 12 L 106 32 Z" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
          <line x1="100" y1="32" x2="100" y2="48" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="70" cy="40" r="2" fill="#D4D4D8" />
          <circle cx="130" cy="40" r="2" fill="#D4D4D8" />
        </g>
      );
    }
    if (rpgClass === 'archer') {
      return (
        <g id="bytezinho-archer-hood">
          <path d="M 58 48 C 58 28, 142 28, 142 48 L 136 54 L 64 54 Z" fill="#065F46" stroke="#10B981" strokeWidth="2" />
          <path d="M 126 40 Q 146 18 140 10 Q 130 22 126 36 Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
          <circle cx="100" cy="38" r="3" fill="#34D399" />
        </g>
      );
    }
    return (
      <g id="bytezinho-mage-hat">
        <ellipse cx="100" cy="46" rx="46" ry="10" fill="#4C1D95" stroke="#7C3AED" strokeWidth="2" />
        <path d="M 68 44 Q 96 6 128 14 Q 106 36 132 44 Z" fill="#5B21B6" stroke="#8B5CF6" strokeWidth="2" />
        <rect x="92" y="38" width="16" height="8" rx="2" fill="#F59E0B" stroke="#FDE047" strokeWidth="1" />
        <circle cx="100" cy="42" r="2" fill="#FFFFFF" />
      </g>
    );
  };

  const renderEquippedHead = () => {
    const key = loadout.head?.visualAssetKey;
    if (key === 'head_visor') {
      return (
        <g id="equipped-head-visor">
          {/* Óculos de Realidade Cibernética com HUD Ciano */}
          <rect x="66" y="66" width="68" height="20" rx="6" fill="#0284C7" fillOpacity="0.45" stroke="#38BDF8" strokeWidth="2" />
          <line x1="68" y1="76" x2="132" y2="76" stroke="#7DD3FC" strokeWidth="1" strokeDasharray="4 2" />
          <circle cx="100" cy="76" r="3" fill="#38BDF8" />
          {/* Suportes laterais na carcaça do monitor */}
          <rect x="58" y="70" width="10" height="8" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
          <rect x="132" y="70" width="10" height="8" rx="2" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
        </g>
      );
    }
    if (key === 'head_helm') {
      return (
        <g id="equipped-head-helm">
          {/* Elmo de Redes Gigabit Blindado */}
          <path d="M 58 52 L 142 52 L 136 28 L 64 28 Z" fill="#334155" stroke="#64748B" strokeWidth="2" />
          <path d="M 92 28 L 92 10 L 108 10 L 108 28 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Viseira de Grade Frontal */}
          <rect x="74" y="44" width="52" height="10" rx="2" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="86" y1="44" x2="86" y2="54" stroke="#F59E0B" strokeWidth="1" />
          <line x1="100" y1="44" x2="100" y2="54" stroke="#F59E0B" strokeWidth="1" />
          <line x1="114" y1="44" x2="114" y2="54" stroke="#F59E0B" strokeWidth="1" />
        </g>
      );
    }
    if (key === 'quantum_visor') {
      return (
        <g id="equipped-quantum-visor">
          {/* Visor Quântico de Overclock */}
          <rect x="64" y="62" width="72" height="26" rx="8" fill="#7C3AED" fillOpacity="0.4" stroke="#C084FC" strokeWidth="2.5" />
          {/* Mira Holográfica Quântica */}
          <circle cx="86" cy="75" r="7" stroke="#F43F5E" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
          <circle cx="114" cy="75" r="7" stroke="#F43F5E" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
          <line x1="86" y1="71" x2="86" y2="79" stroke="#FEF08A" strokeWidth="1.5" />
          <line x1="114" y1="71" x2="114" y2="79" stroke="#FEF08A" strokeWidth="1.5" />
          {/* Antena Quântica de Baixa Latência */}
          <line x1="134" y1="64" x2="148" y2="40" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="148" cy="40" r="3.5" fill="#FACC15" />
        </g>
      );
    }
    return renderClassHeadgear();
  };

  // ─── RENDERIZADORES DE PEITORAL (CHEST) ───
  const renderEquippedTorso = () => {
    const key = loadout.chest?.visualAssetKey;
    if (key === 'chest_antistatic') {
      return (
        <g id="equipped-chest-antistatic">
          {/* Colete Antiestático de Malha e Aterramento */}
          <rect x="74" y="112" width="52" height="44" rx="8" fill="#1E293B" stroke="#0EA5E9" strokeWidth="2" />
          {/* Faixas de Aterramento */}
          <line x1="76" y1="126" x2="124" y2="126" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="76" y1="138" x2="124" y2="138" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 2" />
          <rect x="94" y="116" width="12" height="36" rx="2" fill="#0F172A" stroke="#0284C7" strokeWidth="1" />
          <circle cx="100" cy="132" r="3" fill="#38BDF8" />
        </g>
      );
    }
    if (key === 'plate_titan') {
      return (
        <g id="equipped-plate-titan">
          {/* Peitoral de Titânio do Firewall */}
          <rect x="72" y="110" width="56" height="46" rx="8" fill="#334155" stroke="#94A3B8" strokeWidth="2.5" />
          <polygon points="76,114 124,114 116,148 84,148" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.8" />
          {/* Núcleo Blindado com Rebites */}
          <circle cx="86" cy="124" r="2" fill="#E2E8F0" />
          <circle cx="114" cy="124" r="2" fill="#E2E8F0" />
          <circle cx="100" cy="132" r="5" fill="#EF4444" stroke="#F59E0B" strokeWidth="1.5" />
        </g>
      );
    }
    if (key === 'robe_arcane') {
      return (
        <g id="equipped-robe-arcane">
          {/* Manto Arcano da Memória Cache */}
          <rect x="74" y="112" width="52" height="48" rx="8" fill="#4C1D95" stroke="#8B5CF6" strokeWidth="2" />
          <path d="M 84 112 L 100 134 L 116 112 Z" fill="#6D28D9" stroke="#C4B5FD" strokeWidth="1.5" />
          <path d="M 76 136 Q 100 156 124 136 L 120 156 L 80 156 Z" fill="#2E1065" stroke="#A78BFA" strokeWidth="1.2" />
          <circle cx="100" cy="138" r="4.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1" />
        </g>
      );
    }
    if (key === 'aegis_quantum') {
      return (
        <g id="equipped-aegis-quantum">
          {/* Égide do Kernel Imutável Quântica */}
          <rect x="72" y="110" width="56" height="46" rx="8" fill="#0F172A" stroke="#C084FC" strokeWidth="2.5" />
          <polygon points="100,114 122,126 116,148 84,148 78,126" fill="#581C87" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="100" cy="132" r="7" fill="#C084FC" opacity="0.4" />
          <circle cx="100" cy="132" r="4" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
        </g>
      );
    }
    // Peitoral padrão da classe
    return (
      <g id="bytezinho-torso-default">
        <rect x="74" y="112" width="52" height="44" rx="8" fill="#18181B" stroke="#27272A" strokeWidth="1.8" />
        <path d="M 76 120 L 124 120 L 118 152 L 82 152 Z" fill="#22C55E" fillOpacity="0.15" stroke={palette.primary} strokeWidth="1.5" />
        <circle cx="100" cy="132" r="5" fill={palette.primary} stroke="#FFFFFF" strokeWidth="1" />
      </g>
    );
  };

  // ─── RENDERIZADORES DE ARMA (WEAPON) ───
  const renderClassWeapon = () => {
    if (rpgClass === 'warrior') {
      return (
        <g id="bytezinho-weapon-sword">
          <polygon points="144,38 152,50 146,145 140,145 136,50" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="144" y1="42" x2="144" y2="140" stroke="#FCA5A5" strokeWidth="1.5" />
          <rect x="132" y="145" width="24" height="6" rx="2" fill="#27272A" stroke="#EF4444" strokeWidth="1" />
          <line x1="144" y1="151" x2="144" y2="172" stroke="#71717A" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="144" cy="174" r="3" fill="#EF4444" />
        </g>
      );
    }
    if (rpgClass === 'archer') {
      return (
        <g id="bytezinho-weapon-bow">
          <path d="M 144,45 C 168,90 168,135 144,175" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" />
          <line x1="144" y1="45" x2="144" y2="175" stroke="#A7F3D0" strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1="130" y1="110" x2="168" y2="110" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="168,110 160,106 160,114" fill="#10B981" />
        </g>
      );
    }
    return (
      <g id="bytezinho-weapon-staff">
        <line x1="144" y1="45" x2="144" y2="180" stroke="#71717A" strokeWidth="3.5" strokeLinecap="round" />
        <polygon points="144,28 152,40 144,50 136,40" fill="#A78BFA" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="144" cy="39" r="14" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.8" />
      </g>
    );
  };

  const renderEquippedWeapon = () => {
    const key = loadout.weapon?.visualAssetKey;
    if (key === 'blade_iron') {
      return (
        <g id="equipped-blade-iron">
          {/* Lâmina de Ferro Reciclado */}
          <polygon points="144,42 152,54 147,144 141,144 136,54" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
          <line x1="144" y1="46" x2="144" y2="140" stroke="#E2E8F0" strokeWidth="1.2" />
          <rect x="134" y="144" width="20" height="5" rx="1.5" fill="#334155" stroke="#64748B" strokeWidth="1" />
          <line x1="144" y1="149" x2="144" y2="168" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="144" cy="170" r="2.5" fill="#B45309" />
        </g>
      );
    }
    if (key === 'blade_thermal') {
      return (
        <g id="equipped-blade-thermal">
          {/* Cyberblade Térmica Incandescente */}
          <polygon points="144,32 154,48 147,144 141,144 134,48" fill="#EF4444" stroke="#DC2626" strokeWidth="1.8" />
          <line x1="144" y1="36" x2="144" y2="140" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="144" y1="40" x2="144" y2="135" stroke="#F97316" strokeWidth="4" opacity="0.5" strokeLinecap="round" />
          <rect x="132" y="144" width="24" height="6" rx="2" fill="#1E293B" stroke="#F97316" strokeWidth="1.2" />
          <line x1="144" y1="150" x2="144" y2="172" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="144" cy="174" r="3" fill="#EF4444" />
        </g>
      );
    }
    if (key === 'blade_quantum') {
      return (
        <g id="equipped-blade-quantum">
          {/* Mata-Processos Quântica Bifurcada */}
          <polygon points="140,24 148,46 145,144 143,144 140,46" fill="#8B5CF6" stroke="#C084FC" strokeWidth="1.5" />
          <polygon points="148,24 156,46 153,144 151,144 148,46" fill="#A855F7" stroke="#E879F9" strokeWidth="1.5" />
          <line x1="144" y1="28" x2="144" y2="142" stroke="#38BDF8" strokeWidth="2" />
          <rect x="130" y="144" width="28" height="6" rx="2" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="144" y1="150" x2="144" y2="174" stroke="#6D28D9" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="144" cy="176" r="3.5" fill="#FACC15" />
        </g>
      );
    }
    if (key === 'bow_fiber') {
      return (
        <g id="equipped-bow-fiber">
          {/* Arco de Fibra Óptica */}
          <path d="M 144,40 C 172,85 172,135 144,180" stroke="#10B981" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <line x1="144" y1="40" x2="144" y2="180" stroke="#6EE7B7" strokeWidth="1.2" strokeDasharray="3 2" />
          <line x1="128" y1="110" x2="172" y2="110" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
          <polygon points="172,110 164,106 164,114" fill="#6EE7B7" />
        </g>
      );
    }
    if (key === 'bow_plasma') {
      return (
        <g id="equipped-bow-plasma">
          {/* Repetidor de Plasma Sub-Rede */}
          <path d="M 144,34 L 164,74 L 158,110 L 164,146 L 144,186" stroke="#EC4899" strokeWidth="3" fill="none" strokeLinecap="round" />
          <line x1="144" y1="34" x2="144" y2="186" stroke="#F43F5E" strokeWidth="1.5" />
          <circle cx="158" cy="110" r="4.5" fill="#FEF08A" stroke="#F43F5E" strokeWidth="1" />
          <line x1="124" y1="110" x2="174" y2="110" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    }
    if (key === 'staff_compiler') {
      return (
        <g id="equipped-staff-compiler">
          {/* Cajado do Compilador */}
          <line x1="144" y1="40" x2="144" y2="182" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="144,22 154,36 144,48 134,36" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="144" cy="35" r="12" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="2 2" fill="none" />
        </g>
      );
    }
    if (key === 'staff_singularity') {
      return (
        <g id="equipped-staff-singularity">
          {/* Cetro da Singularidade Assíncrona */}
          <line x1="144" y1="38" x2="144" y2="186" stroke="#4338CA" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="144" cy="28" r="10" fill="#0F172A" stroke="#C084FC" strokeWidth="2" />
          <circle cx="144" cy="28" r="5" fill="#C084FC" />
          <ellipse cx="144" cy="28" rx="16" ry="6" fill="none" stroke="#F59E0B" strokeWidth="1.5" transform="rotate(-25 144 28)" />
        </g>
      );
    }
    return renderClassWeapon();
  };

  // ─── RENDERIZADOR DE ACESSÓRIO (ACCESSORY) ───
  const renderEquippedAccessory = () => {
    const key = loadout.accessory?.visualAssetKey;
    if (key === 'ring_quartz') {
      return (
        <g id="equipped-ring-quartz">
          {/* Anel de Quartzo Luminoso na Mão Esquerda */}
          <circle cx="62" cy="144" r="8" fill="none" stroke="#38BDF8" strokeWidth="1.8" strokeDasharray="2 2" />
          <circle cx="62" cy="144" r="3" fill="#E0F2FE" />
        </g>
      );
    }
    if (key === 'amulet_entropy') {
      return (
        <g id="equipped-amulet-entropy">
          {/* Amuleto de Baixa Entropia no Pescoço */}
          <path d="M 88 112 Q 100 126 112 112" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
          <polygon points="100,124 105,132 95,132" fill="#2563EB" stroke="#F59E0B" strokeWidth="1" />
        </g>
      );
    }
    if (key === 'quantum_matrix') {
      return (
        <g id="equipped-quantum-matrix">
          {/* Cubo Holográfico Quântico Orbitando à Esquerda */}
          <polygon points="42,50 52,44 62,50 52,56" fill="#C084FC" opacity="0.8" />
          <polygon points="42,50 52,56 52,68 42,62" fill="#8B5CF6" opacity="0.9" />
          <polygon points="62,50 52,56 52,68 62,62" fill="#7C3AED" opacity="0.9" />
          <circle cx="52" cy="56" r="14" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        </g>
      );
    }
    return null;
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: typeof size === 'number' ? size * 1.15 : size }}
    >
      <AnimatePresence mode="wait">
        <motion.svg
          viewBox="0 0 200 230"
          className="w-full h-full overflow-visible"
          animate={
            isTakingDamage
              ? { x: [-6, 6, -4, 4, 0], filter: ['hue-rotate(0deg)', 'brightness(1.8) drop-shadow(0 0 10px #EF4444)', 'hue-rotate(0deg)'] }
              : isAttacking
              ? { x: [0, 22, -3, 0], scale: [1, 1.06, 1] }
              : isVictory
              ? { y: [0, -12, 0], scale: [1, 1.04, 1] }
              : { y: [0, -3, 0] }
          }
          transition={
            isTakingDamage
              ? { duration: 0.3 }
              : isAttacking
              ? { duration: 0.22, ease: 'easeOut' }
              : isVictory
              ? { duration: 0.6, repeat: 2 }
              : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <defs>
            <filter id="bytezinho-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="bytezinho-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="slash-grad-hero" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#FACC15" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#EF4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Sombra no Chão */}
          <ellipse cx="100" cy="214" rx="46" ry="11" fill="url(#bytezinho-shadow)" />

          {/* Aura Mágica Circular */}
          <circle
            cx="100"
            cy="110"
            r="64"
            fill="none"
            stroke={auraColor}
            strokeWidth={hasQuantum ? 3 : 1.5}
            strokeDasharray={hasQuantum ? '6 3' : undefined}
            opacity={0.65}
            filter="url(#bytezinho-glow)"
          />

          {/* Perninhas Curtas e Botinhas do Bytezinho */}
          <g id="bytezinho-legs">
            <rect x="80" y="152" width="12" height="38" rx="3" fill="#18181B" stroke="#3F3F46" strokeWidth="1.2" />
            <polygon points="76,186 94,186 96,202 74,202" fill={palette.secondary} stroke={palette.primary} strokeWidth="1.2" />

            <rect x="108" y="152" width="12" height="38" rx="3" fill="#18181B" stroke="#3F3F46" strokeWidth="1.2" />
            <polygon points="106,186 124,186 126,202 104,202" fill={palette.secondary} stroke={palette.primary} strokeWidth="1.2" />
          </g>

          {/* Tronco Robótico do Bytezinho com Roupa/Peitoral Equipado */}
          {renderEquippedTorso()}

          {/* Braço Esquerdo do Bytezinho */}
          <g id="bytezinho-arm-left">
            <rect x="56" y="118" width="12" height="28" rx="4" fill="#16A34A" stroke="#15803D" strokeWidth="1.2" transform="rotate(10 56 118)" />
            <circle cx="62" cy="144" r="5" fill={palette.primary} />
          </g>

          {/* Acessório Equipado (Anel, Amuleto, Matriz Quântica) */}
          {renderEquippedAccessory()}

          {/* ─── CABEÇA: MONITOR CRT DO BYTEZINHO ─── */}
          <g id="bytezinho-crt-monitor">
            {/* Carcaça Verde Clássica do Monitor */}
            <rect x="60" y="44" width="80" height="70" rx="14" fill="#22C55E" stroke="#16A34A" strokeWidth="2.5" />

            {/* Tela Escura CRT Curva */}
            <rect x="68" y="52" width="64" height="54" rx="9" fill="#052E16" stroke="#14532D" strokeWidth="1.5" />

            {/* Reflexo de Vidro na Tela CRT */}
            <path d="M 72 56 L 102 56 L 76 86 L 72 86 Z" fill="#FFFFFF" fillOpacity="0.12" />

            {/* Olhos Cibernéticos Expressivos do Bytezinho */}
            <g id="bytezinho-eyes">
              {isAttacking ? (
                // Olhos focados e determinados de ataque
                <g>
                  <polygon points="80,72 94,76 90,83 78,79" fill={palette.eyeColor} />
                  <polygon points="106,76 120,72 122,79 110,83" fill={palette.eyeColor} />
                  <circle cx="86" cy="76" r="2" fill="#FFFFFF" />
                  <circle cx="114" cy="76" r="2" fill="#FFFFFF" />
                </g>
              ) : (
                // Olhos expressivos amigáveis
                <g>
                  <ellipse cx="86" cy="76" rx="7" ry="9" fill={palette.eyeColor} />
                  <circle cx="88" cy="74" r="2.5" fill="#FFFFFF" />
                  <ellipse cx="114" cy="76" rx="7" ry="9" fill={palette.eyeColor} />
                  <circle cx="116" cy="74" r="2.5" fill="#FFFFFF" />
                </g>
              )}
            </g>

            {/* Sorriso Simpático do Bytezinho na Tela */}
            <path
              d={isAttacking ? "M 92 90 L 108 88" : "M 94 92 Q 100 97 106 92"}
              stroke="#4ADE80"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Adorno / Capacete Equipado no Monitor */}
          {renderEquippedHead()}

          {/* Braço Direito Empunhando a Arma com Animação Articulada e Rastro de Corte */}
          <motion.g
            id="bytezinho-arm-and-weapon"
            animate={
              isAttacking
                ? {
                    rotate: [0, -45, 65, 0],
                    x: [0, -8, 22, 0],
                    y: [0, -14, 10, 0]
                  }
                : isVictory
                ? {
                    rotate: [0, -25, -25, 0],
                    y: [0, -18, -18, 0]
                  }
                : {
                    rotate: [0, 4, 0],
                    y: [0, -1.5, 0]
                  }
            }
            transition={
              isAttacking
                ? { duration: 0.28, ease: 'easeOut' }
                : isVictory
                ? { duration: 0.6, repeat: 2 }
                : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            }
            style={{ transformOrigin: '138px 126px' }}
          >
            <g id="bytezinho-arm-right">
              <rect x="132" y="118" width="12" height="28" rx="4" fill="#16A34A" stroke="#15803D" strokeWidth="1.2" transform="rotate(-15 132 118)" />
              <circle cx="138" cy="144" r="5" fill={palette.primary} />
            </g>

            {/* Arma Equipada */}
            {renderEquippedWeapon()}

            {/* Rastro de Energia Incandescente do Golpe (Guerreiro / Espada) */}
            {isAttacking && rpgClass === 'warrior' && (
              <g id="hero-canvas-slash-trail">
                <path
                  d="M 144 38 A 75 75 0 0 1 190 125"
                  fill="none"
                  stroke="url(#slash-grad-hero)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <path
                  d="M 144 40 A 73 73 0 0 1 188 123"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
            )}
          </motion.g>

          {/* Efeito de Dano Sofrido */}
          {isTakingDamage && (
            <g id="damage-vfx">
              <path d="M 75 75 L 125 125 M 125 75 L 75 125" stroke="#EF4444" strokeWidth="5" strokeLinecap="round" />
            </g>
          )}
        </motion.svg>
      </AnimatePresence>
    </div>
  );
};
