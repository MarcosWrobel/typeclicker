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

  // Renderizador do Adorno / Chapéu da Classe no Monitor do Bytezinho
  const renderClassHeadgear = () => {
    if (rpgClass === 'warrior') {
      return (
        <g id="bytezinho-warrior-helm">
          {/* Elmo blindado sobre o monitor */}
          <path d="M 62 48 L 138 48 L 134 32 L 66 32 Z" fill="#3F3F46" stroke="#71717A" strokeWidth="2" />
          {/* Crista de Combate Vermelha */}
          <path d="M 94 32 L 94 12 C 94 8, 106 8, 106 12 L 106 32 Z" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
          {/* Placa Frontal em T com Rebites */}
          <line x1="100" y1="32" x2="100" y2="48" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="70" cy="40" r="2" fill="#D4D4D8" />
          <circle cx="130" cy="40" r="2" fill="#D4D4D8" />
        </g>
      );
    }
    if (rpgClass === 'archer') {
      return (
        <g id="bytezinho-archer-hood">
          {/* Bandana / Capuz Verde de Caçador com pena */}
          <path d="M 58 48 C 58 28, 142 28, 142 48 L 136 54 L 64 54 Z" fill="#065F46" stroke="#10B981" strokeWidth="2" />
          {/* Pena Dourada de Precisão */}
          <path d="M 126 40 Q 146 18 140 10 Q 130 22 126 36 Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1" />
          {/* Runa de Visão Frontal */}
          <circle cx="100" cy="38" r="3" fill="#34D399" />
        </g>
      );
    }
    // Mago: Chapéu Cônico Pontudo Arcano
    return (
      <g id="bytezinho-mage-hat">
        {/* Aba do Chapéu */}
        <ellipse cx="100" cy="46" rx="46" ry="10" fill="#4C1D95" stroke="#7C3AED" strokeWidth="2" />
        {/* Cone Pontudo Inclinado */}
        <path d="M 68 44 Q 96 6 128 14 Q 106 36 132 44 Z" fill="#5B21B6" stroke="#8B5CF6" strokeWidth="2" />
        {/* Fivela Dourada com Runa */}
        <rect x="92" y="38" width="16" height="8" rx="2" fill="#F59E0B" stroke="#FDE047" strokeWidth="1" />
        <circle cx="100" cy="42" r="2" fill="#FFFFFF" />
      </g>
    );
  };

  // Renderizador da Arma na Mãozinha do Bytezinho
  const renderClassWeapon = () => {
    if (rpgClass === 'warrior') {
      return (
        <g id="bytezinho-weapon-sword">
          {/* Espada de Ferro / Lâmina de Combate */}
          <polygon points="144,38 152,50 146,145 140,145 136,50" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="144" y1="42" x2="144" y2="140" stroke="#FCA5A5" strokeWidth="1.5" />
          {/* Guarda-mão e Punho */}
          <rect x="132" y="145" width="24" height="6" rx="2" fill="#27272A" stroke="#EF4444" strokeWidth="1" />
          <line x1="144" y1="151" x2="144" y2="172" stroke="#71717A" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="144" cy="174" r="3" fill="#EF4444" />
        </g>
      );
    }
    if (rpgClass === 'archer') {
      return (
        <g id="bytezinho-weapon-bow">
          {/* Arco Curvo de Precisão */}
          <path d="M 144,45 C 168,90 168,135 144,175" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" />
          <line x1="144" y1="45" x2="144" y2="175" stroke="#A7F3D0" strokeWidth="1.2" strokeDasharray="2 2" />
          {/* Flecha Pronta para Disparo */}
          <line x1="130" y1="110" x2="168" y2="110" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="168,110 160,106 160,114" fill="#10B981" />
        </g>
      );
    }
    // Mago: Cajado Místico com Cristal Flutuante
    return (
      <g id="bytezinho-weapon-staff">
        {/* Haste do Cajado */}
        <line x1="144" y1="45" x2="144" y2="180" stroke="#71717A" strokeWidth="3.5" strokeLinecap="round" />
        {/* Cristal de Mana */}
        <polygon points="144,28 152,40 144,50 136,40" fill="#A78BFA" stroke="#FFFFFF" strokeWidth="1.5" />
        {/* Anel Orbital Mágico */}
        <circle cx="144" cy="39" r="14" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.8" />
      </g>
    );
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

          {/* Tronco Robótico do Bytezinho com Roupa da Classe */}
          <g id="bytezinho-torso">
            <rect x="74" y="112" width="52" height="44" rx="8" fill="#18181B" stroke="#27272A" strokeWidth="1.8" />
            {/* Peitoral / Túnica Temática */}
            <path d="M 76 120 L 124 120 L 118 152 L 82 152 Z" fill="#22C55E" fillOpacity="0.15" stroke={palette.primary} strokeWidth="1.5" />
            {/* Núcleo LED de Energia */}
            <circle cx="100" cy="132" r="5" fill={palette.primary} stroke="#FFFFFF" strokeWidth="1" />
          </g>

          {/* Braço Esquerdo do Bytezinho */}
          <g id="bytezinho-arm-left">
            <rect x="56" y="118" width="12" height="28" rx="4" fill="#16A34A" stroke="#15803D" strokeWidth="1.2" transform="rotate(10 56 118)" />
            <circle cx="62" cy="144" r="5" fill={palette.primary} />
          </g>

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
              {/* Olho Esquerdo */}
              <ellipse cx="86" cy="76" rx="7" ry="9" fill={palette.eyeColor} />
              <circle cx="88" cy="74" r="2.5" fill="#FFFFFF" />

              {/* Olho Direito */}
              <ellipse cx="114" cy="76" rx="7" ry="9" fill={palette.eyeColor} />
              <circle cx="116" cy="74" r="2.5" fill="#FFFFFF" />
            </g>

            {/* Sorriso Simpático do Bytezinho na Tela */}
            <path d="M 94 92 Q 100 97 106 92" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>

          {/* Adorno / Chapéu Temático da Classe montado no Bytezinho */}
          {renderClassHeadgear()}

          {/* Braço Direito Empunhando a Arma */}
          <g id="bytezinho-arm-right">
            <rect x="132" y="118" width="12" height="28" rx="4" fill="#16A34A" stroke="#15803D" strokeWidth="1.2" transform="rotate(-15 132 118)" />
            <circle cx="138" cy="144" r="5" fill={palette.primary} />
          </g>

          {/* Arma da Classe */}
          {renderClassWeapon()}

          {/* Efeito de Dano Sofrido */}
          {isTakingDamage && (
            <g id="damage-vfx">
              <path d="M 80 80 L 120 120 M 120 80 L 80 120" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
            </g>
          )}
        </motion.svg>
      </AnimatePresence>
    </div>
  );
};
