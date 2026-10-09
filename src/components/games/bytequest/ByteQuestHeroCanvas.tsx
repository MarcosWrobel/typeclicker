import React from 'react';
import { motion,AnimatePresence } from 'motion/react';
import { HeroLoadout,ItemRarity } from '../../../types/byteQuest';
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
  // Paletas de cor por classe
  const classPalettes: Record<RpgClassType, {
    primary: string;
    secondary: string;
    glow: string;
    eyeColor: string;
    skinTone: string;
  }> = {
    warrior: {
      primary: '#EF4444',
      secondary: '#991B1B',
      glow: 'rgba(239, 68, 68, 0.4)',
      eyeColor: '#FCA5A5',
      skinTone: '#3F3F46'
    },
    archer: {
      primary: '#10B981',
      secondary: '#065F46',
      glow: 'rgba(16, 185, 129, 0.4)',
      eyeColor: '#6EE7B7',
      skinTone: '#27272A'
    },
    mage: {
      primary: '#8B5CF6',
      secondary: '#5B21B6',
      glow: 'rgba(139, 92, 246, 0.4)',
      eyeColor: '#C4B5FD',
      skinTone: '#18181B'
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
    ? 'rgba(245, 158, 11, 0.45)'
    : hasEpic
    ? 'rgba(168, 85, 247, 0.4)'
    : hasRare
    ? 'rgba(6, 182, 212, 0.35)'
    : palette.glow;

  // Renderizador do elmo / cabeça
  const renderHeadgear = () => {
    const headKey = loadout.head?.visualAssetKey;
    if (headKey === 'quantum_visor' || hasQuantum) {
      return (
        <g id="head-quantum">
          {/* Visor holográfico quântico */}
          <polygon points="85,62 115,62 120,72 80,72" fill="#F59E0B" fillOpacity="0.85" />
          <line x1="78" y1="67" x2="122" y2="67" stroke="#FEF08A" strokeWidth="1.5" />
          {/* Chifres de antena quântica */}
          <path d="M 75 55 L 70 42 L 78 48 Z" fill="#F59E0B" />
          <path d="M 125 55 L 130 42 L 122 48 Z" fill="#F59E0B" />
        </g>
      );
    }
    if (headKey === 'arcane_hood' || rpgClass === 'mage') {
      return (
        <g id="head-mage-hood">
          {/* Capuz Místico */}
          <path d="M 72 75 C 72 45, 128 45, 128 75 C 134 85, 124 95, 120 90 C 115 70, 85 70, 80 90 C 76 95, 66 85, 72 75 Z" fill={palette.secondary} stroke={palette.primary} strokeWidth="1.5" />
          {/* Runa frontal */}
          <circle cx="100" cy="56" r="3" fill="#A78BFA" />
        </g>
      );
    }
    if (headKey === 'scout_headband' || rpgClass === 'archer') {
      return (
        <g id="head-archer-band">
          {/* Bandana Tática */}
          <rect x="76" y="60" width="48" height="8" rx="2" fill={palette.secondary} stroke={palette.primary} strokeWidth="1.2" />
          <polygon points="74,62 66,58 70,68" fill={palette.primary} />
          <circle cx="100" cy="64" r="2.5" fill="#34D399" />
        </g>
      );
    }
    // Default Guerreiro: Elmo com Crista
    return (
      <g id="head-warrior-helm">
        {/* Elmo blindado com fendas */}
        <path d="M 75 75 C 75 48, 125 48, 125 75 L 122 88 L 78 88 Z" fill="#3F3F46" stroke="#71717A" strokeWidth="1.5" />
        {/* Crista de combate */}
        <path d="M 97 45 L 103 45 L 102 65 L 98 65 Z" fill={palette.primary} />
        {/* Placa frontal em T */}
        <path d="M 85 68 L 115 68 L 103 82 L 97 82 Z" fill="#18181B" stroke={palette.primary} strokeWidth="1.2" />
      </g>
    );
  };

  // Renderizador da armadura de peito
  const renderChestArmor = () => {
    const chestKey = loadout.chest?.visualAssetKey;
    const isHeavy = chestKey === 'plate_titan' || rpgClass === 'warrior';

    return (
      <g id="chest-armor">
        {/* Peitoral Central */}
        <path
          d={isHeavy ? "M 75 92 L 125 92 L 118 140 L 82 140 Z" : "M 78 92 L 122 92 L 115 138 L 85 138 Z"}
          fill={isHeavy ? "#27272A" : "#18181B"}
          stroke={palette.primary}
          strokeWidth="1.8"
        />
        {/* Núcleo de Energia no Peito */}
        <polygon
          points="100,105 108,115 100,125 92,115"
          fill={hasQuantum ? '#F59E0B' : palette.primary}
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.8"
        />
        {/* Ombreiras */}
        <path d="M 68 90 C 60 85, 60 105, 72 108 Z" fill={palette.secondary} stroke={palette.primary} strokeWidth="1.5" />
        <path d="M 132 90 C 140 85, 140 105, 128 108 Z" fill={palette.secondary} stroke={palette.primary} strokeWidth="1.5" />
      </g>
    );
  };

  // Renderizador da arma principal
  const renderWeapon = () => {
    if (rpgClass === 'mage') {
      return (
        <g id="weapon-mage-staff">
          {/* Cajado Arcano */}
          <line x1="145" y1="50" x2="145" y2="185" stroke="#71717A" strokeWidth="3" strokeLinecap="round" />
          {/* Cristal flutuante no topo */}
          <polygon points="145,35 152,47 145,55 138,47" fill="#A78BFA" stroke="#FFFFFF" strokeWidth="1.2" />
          {/* Anéis orbitais mágicos */}
          <circle cx="145" cy="45" r="14" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.8" />
        </g>
      );
    }
    if (rpgClass === 'archer') {
      return (
        <g id="weapon-archer-bow">
          {/* Arco Curvo de Precisão */}
          <path d="M 148 55 C 168 95, 168 135, 148 175" stroke={palette.primary} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <line x1="148" y1="55" x2="148" y2="175" stroke="#6EE7B7" strokeWidth="1" strokeDasharray="2 2" />
          {/* Flecha acoplada */}
          <line x1="135" y1="115" x2="165" y2="115" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
          <polygon points="165,115 159,112 159,118" fill="#10B981" />
        </g>
      );
    }
    // Default Guerreiro: Espada Larga / Cyberblade
    return (
      <g id="weapon-warrior-blade">
        {/* Lâmina */}
        <polygon points="145,45 153,60 148,155 142,155 137,60" fill="#EF4444" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="1.2" />
        {/* Fio de Energia Neon */}
        <line x1="145" y1="50" x2="145" y2="150" stroke="#FCA5A5" strokeWidth="1.5" />
        {/* Guarda-mão */}
        <rect x="135" y="155" width="20" height="5" rx="1.5" fill="#27272A" stroke="#EF4444" strokeWidth="1" />
        {/* Empunhadura e Pomo */}
        <line x1="145" y1="160" x2="145" y2="180" stroke="#71717A" strokeWidth="3" strokeLinecap="round" />
        <circle cx="145" cy="182" r="2.5" fill="#EF4444" />
      </g>
    );
  };

  // Renderizador do acessório / relíquia orbital
  const renderAccessory = () => {
    if (!loadout.accessory) return null;
    return (
      <g id="accessory-orbital">
        <motion.circle
          cx="55"
          cy="75"
          r="9"
          fill={hasQuantum ? '#F59E0B' : palette.primary}
          fillOpacity="0.4"
          stroke={hasQuantum ? '#FDE047' : '#FFFFFF'}
          strokeWidth="1.5"
          animate={{
            y: [0, -6, 0],
            scale: [1, 1.08, 1]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <circle cx="55" cy="75" r="3.5" fill="#FFFFFF" />
      </g>
    );
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: typeof size === 'number' ? size * 1.2 : size }}
    >
      <AnimatePresence mode="wait">
        <motion.svg
          viewBox="0 0 200 240"
          className="w-full h-full overflow-visible"
          animate={
            isTakingDamage
              ? { x: [-6, 6, -4, 4, 0], filter: ['hue-rotate(0deg)', 'brightness(1.8) drop-shadow(0 0 10px #EF4444)', 'hue-rotate(0deg)'] }
              : isAttacking
              ? { x: [0, 24, -4, 0], scale: [1, 1.08, 1] }
              : isVictory
              ? { y: [0, -14, 0], scale: [1, 1.05, 1] }
              : { y: [0, -3, 0] }
          }
          transition={
            isTakingDamage
              ? { duration: 0.3 }
              : isAttacking
              ? { duration: 0.25, ease: 'easeOut' }
              : isVictory
              ? { duration: 0.6, repeat: 2 }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <defs>
            {/* Filtro de Brilho Dinâmico da Aura */}
            <filter id="hero-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Gradiente da Sombra de Base */}
            <radialGradient id="ground-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sombra no Chão */}
          <ellipse cx="100" cy="218" rx="48" ry="12" fill="url(#ground-shadow)" />

          {/* Halo / Aura Vetorial Externa de Poder */}
          <circle
            cx="100"
            cy="110"
            r="65"
            fill="none"
            stroke={auraColor}
            strokeWidth={hasQuantum ? 3 : 1.5}
            strokeDasharray={hasQuantum ? "6 3" : undefined}
            opacity={0.65}
            filter="url(#hero-glow)"
          />

          {/* Pernas e Botas */}
          <g id="hero-legs">
            {/* Perna Esquerda */}
            <rect x="83" y="140" width="12" height="52" rx="3" fill="#18181B" stroke="#3F3F46" strokeWidth="1.2" />
            <polygon points="80,188 95,188 96,204 78,204" fill={palette.secondary} stroke={palette.primary} strokeWidth="1.2" />
            {/* Perna Direita */}
            <rect x="105" y="140" width="12" height="52" rx="3" fill="#18181B" stroke="#3F3F46" strokeWidth="1.2" />
            <polygon points="104,188 119,188 122,204 103,204" fill={palette.secondary} stroke={palette.primary} strokeWidth="1.2" />
          </g>

          {/* Braço Esquerdo / Escudo de Mão */}
          <g id="arm-left">
            <rect x="62" y="105" width="10" height="35" rx="3" fill="#27272A" stroke="#3F3F46" strokeWidth="1" transform="rotate(12 62 105)" />
            <circle cx="68" cy="138" r="5" fill={palette.primary} />
          </g>

          {/* Tronco / Armadura de Peito */}
          {renderChestArmor()}

          {/* Cabeça / Elmo / Capuz */}
          <g id="hero-head-base">
            {/* Base do Rosto */}
            <circle cx="100" cy="72" r="22" fill={palette.skinTone} stroke="#3F3F46" strokeWidth="1" />
            {/* Olhos Cibernéticos / Brilho */}
            <ellipse cx="93" cy="72" rx="3" ry="2" fill={palette.eyeColor} />
            <ellipse cx="107" cy="72" rx="3" ry="2" fill={palette.eyeColor} />
          </g>
          {renderHeadgear()}

          {/* Braço Direito Empunhando a Arma */}
          <g id="arm-right">
            <rect x="126" y="105" width="10" height="36" rx="3" fill="#27272A" stroke="#3F3F46" strokeWidth="1" transform="rotate(-15 126 105)" />
            <circle cx="134" cy="140" r="5" fill={palette.primary} />
          </g>

          {/* Arma Primária */}
          {renderWeapon()}

          {/* Acessório Orbital */}
          {renderAccessory()}

          {/* Efeito Visual de Impacto de Dano */}
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
