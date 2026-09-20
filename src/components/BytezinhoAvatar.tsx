import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BytezinhoSkinId } from '../types/cosmetics';

export type BytezinhoState = 'idle' | 'typing' | 'combo' | 'error' | 'overload';

export interface BytezinhoAvatarProps {
  skin?: BytezinhoSkinId;
  mood?: 'normal' | 'happy' | 'fire' | 'oops' | 'upgrade' | 'glitch' | 'warning' | 'leak';
  state?: BytezinhoState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isOverloaded?: boolean;
  isOverheating?: boolean;
  isTyping?: boolean;
  interactive?: boolean;
  comboCount?: number;
}

export const BytezinhoAvatar: React.FC<BytezinhoAvatarProps> = ({
  skin = 'classic',
  mood = 'normal',
  state,
  size = 'md',
  className = '',
  isOverloaded = false,
  isOverheating = false,
  isTyping = false,
  interactive = false,
  comboCount = 0
}) => {
  const [isBlinking, setIsBlinking] = useState<boolean>(false);

  // Ciclo natural de piscada de olhos a cada 3.5 a 6 segundos com cancelamento seguro
  useEffect(() => {
    let timer1: ReturnType<typeof setTimeout> | null = null;
    let timer2: ReturnType<typeof setTimeout> | null = null;
    let isMounted = true;

    const scheduleBlink = () => {
      const delay = Math.random() * 2500 + 3500;
      timer1 = setTimeout(() => {
        if (!isMounted) return;
        setIsBlinking(true);
        timer2 = setTimeout(() => {
          if (!isMounted) return;
          setIsBlinking(false);
          scheduleBlink();
        }, 160);
      }, delay);
    };

    scheduleBlink();
    return () => {
      isMounted = false;
      if (timer1) clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
    };
  }, []);

  const sizeDimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16 sm:w-20 sm:h-20',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    xl: 'w-32 h-32 sm:w-36 sm:h-36'
  };

  // Resolução unificada de estado (idle, typing, combo, error, overload)
  const effectiveState: BytezinhoState = state || (
    isOverloaded ? 'overload' :
    mood === 'oops' ? 'error' :
    (comboCount >= 8 || mood === 'fire') ? 'combo' :
    (isTyping || comboCount > 0) ? 'typing' :
    'idle'
  );

  const isGlitch = isOverloaded || mood === 'glitch' || effectiveState === 'overload';
  const isHot = mood === 'fire' || isGlitch || isOverheating || effectiveState === 'combo';
  const isCombo = effectiveState === 'combo' || comboCount >= 8;
  const isTypingActive = isTyping || effectiveState === 'typing' || isCombo;
  const isError = effectiveState === 'error' || mood === 'oops';

  // Nível procedural da aura vetorial baseado no combo (0 a 2.2)
  const auraLevel = Math.min(Math.max((comboCount || 0) / 10, isCombo ? 0.9 : 0), 2.2);

  const getAuraGradient = () => {
    switch (skin) {
      case 'blindfolded_sorcerer':
        return 'radial-gradient(circle, rgba(56,189,248,0.85) 0%, rgba(129,140,248,0.45) 50%, transparent 75%)';
      case 'rubber_pirate':
        return 'radial-gradient(circle, rgba(251,113,133,0.85) 0%, rgba(245,158,11,0.5) 50%, transparent 75%)';
      case 'hoodie_skeleton':
        return 'radial-gradient(circle, rgba(6,182,212,0.85) 0%, rgba(30,58,138,0.5) 50%, transparent 75%)';
      case 'urban_cyborg':
        return 'radial-gradient(circle, rgba(250,204,21,0.85) 0%, rgba(6,182,212,0.5) 50%, transparent 75%)';
      case 'demon_slayer':
        return 'radial-gradient(circle, rgba(249,115,22,0.85) 0%, rgba(56,189,248,0.45) 50%, transparent 75%)';
      case 'electric_rodent':
        return 'radial-gradient(circle, rgba(250,204,21,0.95) 0%, rgba(254,240,138,0.5) 50%, transparent 75%)';
      case 'bored_hero':
        return 'radial-gradient(circle, rgba(239,68,68,0.85) 0%, rgba(234,179,8,0.5) 50%, transparent 75%)';
      case 'needle_knight':
        return 'radial-gradient(circle, rgba(224,242,254,0.85) 0%, rgba(56,189,248,0.5) 50%, transparent 75%)';
      case 'supersonic_hedgehog':
        return 'radial-gradient(circle, rgba(59,130,246,0.9) 0%, rgba(34,197,94,0.5) 50%, transparent 75%)';
      case 'shadow_crusader':
        return 'radial-gradient(circle, rgba(245,158,11,0.8) 0%, rgba(15,23,42,0.65) 50%, transparent 75%)';
      default:
        return 'radial-gradient(circle, rgba(16,185,129,0.75) 0%, rgba(5,150,105,0.4) 50%, transparent 75%)';
    }
  };

  // Cor do fósforo / tela CRT interna
  const getScreenBg = () => {
    if (isGlitch) return '#3b0d14';
    if (isOverheating) return '#2e1308';
    if (mood === 'warning') return '#2b1c09';
    if (mood === 'leak') return '#091c2b';
    switch (skin) {
      case 'cyber': return '#061324';
      case 'retro_8bit': return '#08180c';
      case 'wizard': return '#1a0d2e';
      case 'astronaut': return '#06101e';
      case 'ninja': return '#0f1015';
      case 'steampunk': return '#211508';
      case 'golden_king': return '#1c1504';
      case 'diver': return '#041624';
      case 'robot_mecha': return '#0a141e';
      case 'hoodie_hacker': return '#090d14';
      case 'jedi_master': return '#07151e';
      case 'miner_diamond': return '#081820';
      case 'saiyan_warrior': return '#1a1202';
      case 'arachnid_hero': return '#180407';
      // Míticos / Quânticos
      case 'blindfolded_sorcerer': return '#020617';
      case 'rubber_pirate': return '#1a0505';
      case 'hoodie_skeleton': return '#000000';
      case 'urban_cyborg': return '#0f1406';
      case 'demon_slayer': return '#120502';
      case 'electric_rodent': return '#141405';
      case 'bored_hero': return '#0f0f12';
      case 'needle_knight': return '#050a12';
      case 'supersonic_hedgehog': return '#040d22';
      case 'shadow_crusader': return '#050508';
      case 'classic':
      default: return '#09140c';
    }
  };

  // Cor dos olhos de acordo com humor e skin
  const getEyeColor = () => {
    if (isGlitch) return '#f43f5e';
    if (isOverheating) return '#f59e0b';
    if (mood === 'warning') return '#f59e0b';
    if (mood === 'leak') return '#38bdf8';
    if (mood === 'fire') return '#fbbf24';

    switch (skin) {
      case 'cyber': return '#22d3ee';
      case 'retro_8bit': return '#4ade80';
      case 'wizard': return '#c084fc';
      case 'astronaut': return '#38bdf8';
      case 'ninja': return '#ef4444';
      case 'steampunk': return '#f59e0b';
      case 'golden_king': return '#fde047';
      case 'diver': return '#38bdf8';
      case 'robot_mecha': return '#22d3ee';
      case 'hoodie_hacker': return '#34d399';
      case 'jedi_master': return '#38bdf8';
      case 'miner_diamond': return '#06b6d4';
      case 'saiyan_warrior': return '#22d3ee';
      case 'arachnid_hero': return '#ffffff';
      // Míticos / Quânticos
      case 'blindfolded_sorcerer': return '#38bdf8';
      case 'rubber_pirate': return '#ffffff';
      case 'hoodie_skeleton': return '#06b6d4';
      case 'urban_cyborg': return '#06b6d4';
      case 'demon_slayer': return '#f97316';
      case 'electric_rodent': return '#facc15';
      case 'bored_hero': return '#ffffff';
      case 'needle_knight': return '#e0f2fe';
      case 'supersonic_hedgehog': return '#22c55e';
      case 'shadow_crusader': return '#ffffff';
      case 'classic':
      default: return '#10b981';
    }
  };

  // Carcaça externa do monitor CRT
  const getChassisColor = () => {
    switch (skin) {
      case 'retro_8bit': return '#d1c7b7';
      case 'hoodie_hacker': return '#14161f';
      case 'cyber': return '#0a1424';
      case 'wizard': return '#1e1136';
      case 'astronaut': return '#e2e8f0';
      case 'ninja': return '#111318';
      case 'steampunk': return '#3d2516';
      case 'golden_king': return '#2a1f0a';
      case 'diver': return '#0b2333';
      case 'robot_mecha': return '#1e293b';
      case 'jedi_master': return '#292524';
      case 'miner_diamond': return '#292524';
      case 'saiyan_warrior': return '#1e1b4b';
      case 'arachnid_hero': return '#991b1b';
      // Míticos / Quânticos
      case 'blindfolded_sorcerer': return '#0b0f19';
      case 'rubber_pirate': return '#b91c1c';
      case 'hoodie_skeleton': return '#1e3a8a';
      case 'urban_cyborg': return '#1c1917';
      case 'demon_slayer': return '#0f172a';
      case 'electric_rodent': return '#ca8a04';
      case 'bored_hero': return '#eab308';
      case 'needle_knight': return '#1e293b';
      case 'supersonic_hedgehog': return '#1d4ed8';
      case 'shadow_crusader': return '#09090b';
      case 'classic':
      default: return '#1c2230';
    }
  };

  const getChassisBorder = () => {
    if (isGlitch) return '#e11d48';
    switch (skin) {
      case 'retro_8bit': return '#a89c8a';
      case 'hoodie_hacker': return '#333b52';
      case 'cyber': return '#06b6d4';
      case 'wizard': return '#8b5cf6';
      case 'astronaut': return '#38bdf8';
      case 'ninja': return '#dc2626';
      case 'steampunk': return '#b45309';
      case 'golden_king': return '#eab308';
      case 'diver': return '#0ea5e9';
      case 'robot_mecha': return '#64748b';
      case 'jedi_master': return '#38bdf8';
      case 'miner_diamond': return '#06b6d4';
      case 'saiyan_warrior': return '#eab308';
      case 'arachnid_hero': return '#0284c7';
      // Míticos / Quânticos
      case 'blindfolded_sorcerer': return '#38bdf8';
      case 'rubber_pirate': return '#f59e0b';
      case 'hoodie_skeleton': return '#38bdf8';
      case 'urban_cyborg': return '#eab308';
      case 'demon_slayer': return '#22c55e';
      case 'electric_rodent': return '#facc15';
      case 'bored_hero': return '#ef4444';
      case 'needle_knight': return '#cbd5e1';
      case 'supersonic_hedgehog': return '#38bdf8';
      case 'shadow_crusader': return '#f59e0b';
      case 'classic':
      default: return '#10b981';
    }
  };

  // Configurações de animações dinâmicas personalizadas por Skin
  const getSkinAnimationConfig = () => {
    if (isGlitch) {
      return {
        animate: { x: [-3, 3, -2, 2, 0], y: [1, -1, 1, 0], rotate: [-1.5, 1.5, 0] },
        transition: { duration: 0.14, repeat: Infinity, ease: 'linear' as const }
      };
    }
    if (isHot) {
      return {
        animate: { y: [0, -4, 0], scale: [1, 1.05, 1], rotate: [-1, 1, -1] },
        transition: { duration: 0.35, repeat: Infinity, ease: 'easeInOut' as const }
      };
    }
    if (isTypingActive) {
      switch (skin) {
        case 'blindfolded_sorcerer':
          return {
            animate: { y: [-2, -7, -2], scale: [1, 1.05, 1], rotate: [-1, 1, -1] },
            transition: { duration: 0.32, repeat: Infinity, ease: 'easeInOut' as const }
          };
        case 'rubber_pirate':
          return {
            animate: { y: [0, -5, 0], scaleY: [1, 1.1, 0.95, 1], scaleX: [1, 0.95, 1.05, 1] },
            transition: { duration: 0.2, repeat: Infinity, ease: 'easeInOut' as const }
          };
        case 'urban_cyborg':
          return {
            animate: { x: [-1.5, 1.5, -1, 1, 0], y: [0, -2, 0] },
            transition: { duration: 0.14, repeat: Infinity, ease: 'linear' as const }
          };
        case 'supersonic_hedgehog':
          return {
            animate: { y: [0, -4, 0], rotate: [-2.5, 2.5, -2.5] },
            transition: { duration: 0.12, repeat: Infinity, ease: 'linear' as const }
          };
        case 'ninja':
          return {
            animate: { y: [0, -4, 0], x: [-1.5, 1.5, 0], scale: [1, 1.05, 0.98, 1] },
            transition: { duration: 0.16, repeat: Infinity, ease: 'easeInOut' as const }
          };
        case 'wizard':
          return {
            animate: { y: [-2, -7, -2], rotate: [-2, 2, -2] },
            transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const }
          };
        case 'astronaut':
          return {
            animate: { y: [-1, -6, -1], rotate: [-3, 3, -3], scale: [1, 1.03, 1] },
            transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' as const }
          };
        case 'steampunk':
          return {
            animate: { y: [0, -3, 0], scaleY: [1, 0.95, 1] },
            transition: { duration: 0.16, repeat: Infinity, ease: 'easeInOut' as const }
          };
        case 'retro_8bit':
          return {
            animate: { y: [0, -3, 0] },
            transition: { duration: 0.2, repeat: Infinity, ease: 'linear' as const }
          };
        case 'golden_king':
          return {
            animate: { scale: [1, 1.06, 1], y: [0, -3, 0] },
            transition: { duration: 0.22, repeat: Infinity, ease: 'easeInOut' as const }
          };
        default:
          return {
            animate: { scale: [1, 1.04, 1], y: [0, -2, 0] },
            transition: { duration: 0.2, repeat: Infinity, ease: 'easeInOut' as const }
          };
      }
    }

    // Comportamento IDLE específico por cosmético equipado:
    switch (skin) {
      case 'wizard':
        // Flutuação mística ampla com rotação sinusoidal suave
        return {
          animate: { y: [0, -8, 0], rotate: [-2.5, 2.5, -2.5] },
          transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'astronaut':
        // Deriva lenta orbital em gravidade zero 360°
        return {
          animate: { y: [0, -7, 2, 0], x: [0, 4, -4, 0], rotate: [-4, 4, -4] },
          transition: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'cyber':
        // Jitter de dados e oscilação holográfica de alta tecnologia
        return {
          animate: { x: [0, -1, 1, 0], y: [0, 1, -1, 0], scale: [1, 1.02, 0.99, 1] },
          transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'retro_8bit':
        // Movimento pixelado escalonado (sem interpolação suave)
        return {
          animate: { y: [0, 0, -3, -3, 0], rotate: [0, 0, 1, 1, 0] },
          transition: { duration: 1.6, repeat: Infinity, ease: 'linear' as const }
        };
      case 'steampunk':
        // Pulso mecânico de pistão e válvula
        return {
          animate: { y: [0, -2.5, 0, -1, 0], scaleY: [1, 0.98, 1, 0.985, 1] },
          transition: { duration: 1.0, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'ninja':
        // Furtividade, respiração curta e vigilância constante
        return {
          animate: { y: [0, -1.5, 0], scale: [1, 1.015, 1] },
          transition: { duration: 2.0, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'golden_king':
        // Respiração majestosa com resplendor régio
        return {
          animate: { y: [0, -3.5, 0], scale: [1, 1.03, 1] },
          transition: { duration: 3.0, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'diver':
        // Balanço líquido submarino
        return {
          animate: { y: [0, -4.5, 0], rotate: [-2.5, 2.5, -2.5] },
          transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'robot_mecha':
        // Postura firme de armadura com micro-varredura
        return {
          animate: { y: [0, -1.2, 0], scaleX: [1, 1.015, 1] },
          transition: { duration: 2.0, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'hoodie_hacker':
        return {
          animate: { y: [0, -1.5, 0], scale: [1, 1.01, 1] },
          transition: { duration: 3.0, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'jedi_master':
        // Flutuação meditativa da Força
        return {
          animate: { y: [0, -5, 0], rotate: [-1, 1, -1] },
          transition: { duration: 3.0, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'miner_diamond':
        // Ritmo firme e quadrado de exploração
        return {
          animate: { y: [0, -2, 0] },
          transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'saiyan_warrior':
        // Pulso vibrante de aura Ki
        return {
          animate: { y: [0, -3, 0], scale: [1, 1.03, 1] },
          transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'arachnid_hero':
        // Agilidade aracnídea pronta para o salto
        return {
          animate: { y: [0, -4, 0], rotate: [-2, 2, -2] },
          transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const }
        };
      case 'classic':
      default:
        return {
          animate: { y: [0, -2, 0] },
          transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const }
        };
    }
  };

  const animConfig = getSkinAnimationConfig();
  const screenBg = getScreenBg();
  const eyeColor = getEyeColor();
  const chassisColor = getChassisColor();
  const chassisBorder = getChassisBorder();

  return (
    <motion.div
      className={`relative select-none flex items-center justify-center ${sizeDimensions[size]} ${className}`}
      animate={animConfig.animate}
      transition={animConfig.transition}
      whileHover={interactive ? { scale: 1.1, rotate: [-2, 2, 0] } : undefined}
    >
      {/* ==================================================== */}
      {/* AURA VETORIAL PROCEDURAL (Intensidade modulada por combo) */}
      {/* ==================================================== */}
      {auraLevel > 0 && (
        <motion.div
          className="absolute -inset-3 rounded-full pointer-events-none -z-10 blur-md"
          style={{
            background: getAuraGradient(),
            opacity: Math.min(0.25 + auraLevel * 0.32, 0.9),
          }}
          animate={{
            scale: [1 + auraLevel * 0.08, 1 + auraLevel * 0.16, 1 + auraLevel * 0.08],
            opacity: [0.35 + auraLevel * 0.2, 0.6 + auraLevel * 0.28, 0.35 + auraLevel * 0.2],
          }}
          transition={{ duration: Math.max(0.5, 1.3 - auraLevel * 0.3), repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ==================================================== */}
        {/* ACESSÓRIOS ATRÁS / TOPO DO MONITOR (Antenas, Chapéus, etc) */}
        {/* ==================================================== */}

        {/* 0. FEITICEIRO VENDADO: Cabelo arrepiado prateado */}
        {skin === 'blindfolded_sorcerer' && (
          <g id="sorcerer-hair-back">
            <polygon
              points="20,26 8,10 22,14 30,-6 46,6 58,-12 70,6 86,-6 96,14 112,10 100,26"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <polygon points="34,12 44,-2 52,8 60,-8 68,8 78,-2 86,14" fill="#e2e8f0" />
          </g>
        )}

        {/* 0. PIRATA EMBORRACHADO: Chapéu de palha com fita vermelha */}
        {skin === 'rubber_pirate' && (
          <g id="pirate-straw-hat">
            <ellipse cx="60" cy="24" rx="48" ry="10" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <path d="M38 24 Q38 4 60 4 Q82 4 82 24 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
            <path d="M38 24 Q60 21 82 24 L82 19 Q60 16 38 19 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
          </g>
        )}

        {/* 0. ROEDOR ELÉTRICO: Orelhas longas com pontas pretas e cauda em raio */}
        {skin === 'electric_rodent' && (
          <g id="electric-rodent-ears">
            <polygon points="32,26 14,-10 24,-12 42,22" fill="#facc15" stroke="#ca8a04" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="14,-10 24,-12 21,-2 16,0" fill="#09090b" />
            <polygon points="88,26 106,-10 96,-12 78,22" fill="#facc15" stroke="#ca8a04" strokeWidth="1.8" strokeLinejoin="round" />
            <polygon points="106,-10 96,-12 99,-2 104,0" fill="#09090b" />
            <polygon points="104,78 116,68 110,64 122,50 114,48 126,30 118,34 110,54 114,56 102,72" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
          </g>
        )}

        {/* 0. BESOURO AGULHEIRO: Chifres curvados de cavaleiro */}
        {skin === 'needle_knight' && (
          <g id="needle-knight-horns">
            <path d="M42 26 Q30 4 22 -4 Q28 8 36 24" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.8" />
            <path d="M78 26 Q90 4 98 -4 Q92 8 84 24" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.8" />
          </g>
        )}

        {/* 0. OURIÇO SUPERSÔNICO: Espinhos aerodinâmicos azuis para trás */}
        {skin === 'supersonic_hedgehog' && (
          <g id="hedgehog-quills">
            <polygon points="26,26 4,14 20,38" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="20,40 -2,38 18,58" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="94,26 116,14 100,38" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="100,40 122,38 102,58" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="40,20 60,-6 80,20" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
          </g>
        )}

        {/* 0. CAVALEIRO DAS SOMBRAS: Orelhas pontiagudas de morcego */}
        {skin === 'shadow_crusader' && (
          <g id="bat-ears">
            <polygon points="24,26 18,-4 36,18" fill="#09090b" stroke="#27272a" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="96,26 102,-4 84,18" fill="#09090b" stroke="#27272a" strokeWidth="2" strokeLinejoin="round" />
          </g>
        )}

        {/* 1. CLÁSSICO: Antena única com bolinha pulsante */}
        {skin === 'classic' && (
          <g id="classic-antenna">
            <line x1="60" y1="26" x2="60" y2="10" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <circle cx="60" cy="8" r="4.5" fill={eyeColor} className="animate-pulse" />
            <circle cx="60" cy="8" r="7" fill={eyeColor} opacity="0.25" />
          </g>
        )}

        {/* 2. RETRO 8-BIT: Antena dupla de TV portátil */}
        {skin === 'retro_8bit' && (
          <g id="retro-antennae">
            <line x1="45" y1="26" x2="28" y2="7" stroke="#8c8273" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="28" cy="7" r="3.5" fill="#e2d9cc" />
            <line x1="75" y1="26" x2="92" y2="7" stroke="#8c8273" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="92" cy="7" r="3.5" fill="#e2d9cc" />
          </g>
        )}

        {/* 3. CYBER: Chifre de fibra óptica / Antena neon com sinal */}
        {skin === 'cyber' && (
          <g id="cyber-antenna">
            <path d="M54 26 L60 8 L66 26" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="60" cy="7" r="3.5" fill="#22d3ee" />
            <path d="M50 8 Q60 2 70 8" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <path d="M44 4 Q60 -4 76 4" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          </g>
        )}

        {/* 4. ASTRONAUTA: Anel de acoplamento do capacete e tubo de oxigênio */}
        {skin === 'astronaut' && (
          <g id="astronaut-gear">
            {/* Tubo de oxigênio espiralado saindo da lateral */}
            <path d="M18 65 Q4 70 8 90 Q12 105 44 104" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 2" fill="none" />
            {/* Anel de vedação pressurizada */}
            <ellipse cx="60" cy="26" rx="46" ry="8" fill="#cbd5e1" stroke="#0ea5e9" strokeWidth="1.5" />
          </g>
        )}

        {/* 5. STEAMPUNK: Chaminé de exaustão com vapor subindo e engrenagem */}
        {skin === 'steampunk' && (
          <g id="steampunk-pipe">
            {/* Chaminé de cobre à direita */}
            <rect x="80" y="8" width="10" height="20" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
            <ellipse cx="85" cy="8" rx="6" ry="2" fill="#f59e0b" />
            {/* Fumaça de vapor subindo */}
            <circle cx="86" cy="2" r="3" fill="#e2e8f0" opacity="0.6" className="animate-ping" style={{ animationDuration: '2s' }} />
            <circle cx="89" cy="-5" r="4" fill="#cbd5e1" opacity="0.4" />
          </g>
        )}

        {/* 6. MECHA: Antenas angulares de radar e blindagem */}
        {skin === 'robot_mecha' && (
          <g id="mecha-antennae">
            <polygon points="20,26 14,8 26,16" fill="#475569" stroke="#06b6d4" strokeWidth="1.5" />
            <polygon points="100,26 106,8 94,16" fill="#475569" stroke="#06b6d4" strokeWidth="1.5" />
            <circle cx="14" cy="8" r="2" fill="#22d3ee" />
            <circle cx="106" cy="8" r="2" fill="#22d3ee" />
          </g>
        )}

        {/* 7. DIVER: Tubo do Snorkel aquático com bolhinhas subindo */}
        {skin === 'diver' && (
          <g id="diver-snorkel">
            <path d="M96 70 L98 30 Q98 12 108 12 L110 16" stroke="#facc15" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="110" cy="16" r="3" fill="#ca8a04" />
            {/* Bolhas de ar subindo */}
            <circle cx="108" cy="4" r="2.5" fill="#38bdf8" opacity="0.7" className="animate-bounce" />
            <circle cx="106" cy="-4" r="1.8" fill="#7dd3fc" opacity="0.5" />
          </g>
        )}

        {/* ==================================================== */}
        {/* CARCAÇA PRINCIPAL DO MONITOR CRT */}
        {/* ==================================================== */}
        <g id="monitor-chassis">
          {/* Sombra base */}
          <ellipse cx="60" cy="112" rx="36" ry="6" fill="#000000" opacity="0.35" />

          {/* Pé do monitor CRT */}
          <path d="M46 100 L50 106 L70 106 L74 100 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <rect x="42" y="106" width="36" height="4" rx="2" fill="#1e293b" />

          {/* Caixa do Monitor (Chassis chanfrado) */}
          <rect
            x="18"
            y="26"
            width="84"
            height="74"
            rx="14"
            fill={chassisColor}
            stroke={chassisBorder}
            strokeWidth="3"
          />

          {/* Destaque de reflexo chanfrado superior */}
          <path
            d="M24 30 L96 30"
            stroke={skin === 'retro_8bit' || skin === 'astronaut' ? '#ffffff' : '#475569'}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Detalhes retro: botões e fita de ventilação */}
          {skin === 'retro_8bit' && (
            <g id="retro-details">
              <line x1="22" y1="36" x2="22" y2="50" stroke="#948b7d" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="22" y1="56" x2="22" y2="70" stroke="#948b7d" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="24" y="86" width="22" height="3" rx="1" fill="#4a443a" />
              <rect x="24" y="91" width="16" height="2" rx="0.5" fill="#786f61" />
              <circle cx="49" cy="88" r="1.5" fill={isTyping ? '#22c55e' : '#eab308'} />
            </g>
          )}

          {/* Detalhes Cyber: linhas de circuito impressas na carcaça */}
          {skin === 'cyber' && (
            <g id="cyber-circuits" opacity="0.65">
              <path d="M22 40 L26 40 L30 44" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="30" cy="44" r="1.5" fill="#22d3ee" />
              <path d="M98 70 L94 70 L90 66" stroke="#f43f5e" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="90" cy="66" r="1.5" fill="#fb7185" />
            </g>
          )}

          {/* Detalhes Mecha: parafusos de titânio e reforço */}
          {skin === 'robot_mecha' && (
            <g id="mecha-rivets">
              <circle cx="23" cy="32" r="1.5" fill="#94a3b8" />
              <circle cx="97" cy="32" r="1.5" fill="#94a3b8" />
              <circle cx="23" cy="94" r="1.5" fill="#94a3b8" />
              <circle cx="97" cy="94" r="1.5" fill="#94a3b8" />
            </g>
          )}
        </g>

        {/* ==================================================== */}
        {/* TELA INTERNA CRT (FÓSFORO) */}
        {/* ==================================================== */}
        <g id="crt-screen">
          {/* Vidro abaulado interno */}
          <rect
            x="26"
            y="34"
            width="68"
            height="54"
            rx="9"
            fill={screenBg}
            stroke="#020617"
            strokeWidth="2.5"
          />

          {/* Linhas sutis de varredura CRT (scanlines) */}
          <line x1="28" y1="42" x2="92" y2="42" stroke="#ffffff" strokeWidth="0.5" opacity="0.04" />
          <line x1="28" y1="50" x2="92" y2="50" stroke="#ffffff" strokeWidth="0.5" opacity="0.04" />
          <line x1="28" y1="58" x2="92" y2="58" stroke="#ffffff" strokeWidth="0.5" opacity="0.04" />
          <line x1="28" y1="66" x2="92" y2="66" stroke="#ffffff" strokeWidth="0.5" opacity="0.04" />
          <line x1="28" y1="74" x2="92" y2="74" stroke="#ffffff" strokeWidth="0.5" opacity="0.04" />
          <line x1="28" y1="82" x2="92" y2="82" stroke="#ffffff" strokeWidth="0.5" opacity="0.04" />

          {/* Reflexo curvo no canto superior do vidro */}
          <path
            d="M30 38 Q60 36 86 42 Q56 42 34 50 Z"
            fill="#ffffff"
            opacity="0.08"
          />

          {/* ================================================== */}
          {/* ROSTO DO BYTEZINHO (OLHOS & BOCA EXPRESSIVOS) */}
          {/* ================================================== */}
          <g id="face-elements">
            {/* OLHO ESQUERDO */}
            <g id="left-eye">
              {isGlitch ? (
                <path d="M40 50 L46 56 L42 58 L48 66" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              ) : isBlinking ? (
                <line x1="38" y1="56" x2="48" y2="56" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" />
              ) : mood === 'happy' || mood === 'upgrade' ? (
                <path d="M38 58 Q43 50 48 58" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" fill="none" />
              ) : mood === 'warning' ? (
                <g>
                  <line x1="43" y1="50" x2="43" y2="58" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="43" cy="63" r="1.5" fill="#f59e0b" />
                </g>
              ) : mood === 'oops' ? (
                <circle cx="43" cy="56" r="4.5" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
              ) : skin === 'retro_8bit' ? (
                <rect x="39" y="52" width="7" height="8" rx="1" fill={eyeColor} />
              ) : skin === 'robot_mecha' ? (
                <polygon points="38,52 48,52 45,61 38,61" fill={eyeColor} />
              ) : (
                <g>
                  <rect x="39" y="51" width="8" height="11" rx="4" fill={eyeColor} />
                  <circle cx="41.5" cy="54" r="1.5" fill="#ffffff" opacity="0.9" />
                </g>
              )}
            </g>

            {/* OLHO DIREITO */}
            <g id="right-eye">
              {isGlitch ? (
                <path d="M72 50 L78 56 L74 58 L80 66" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              ) : isBlinking ? (
                <line x1="72" y1="56" x2="82" y2="56" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" />
              ) : mood === 'happy' || mood === 'upgrade' ? (
                <path d="M72 58 Q77 50 82 58" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" fill="none" />
              ) : mood === 'warning' ? (
                <g>
                  <line x1="77" y1="50" x2="77" y2="58" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="77" cy="63" r="1.5" fill="#f59e0b" />
                </g>
              ) : mood === 'oops' ? (
                <circle cx="77" cy="56" r="4.5" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
              ) : skin === 'retro_8bit' ? (
                <rect x="74" y="52" width="7" height="8" rx="1" fill={eyeColor} />
              ) : skin === 'robot_mecha' ? (
                <polygon points="72,52 82,52 82,61 75,61" fill={eyeColor} />
              ) : (
                <g>
                  <rect x="73" y="51" width="8" height="11" rx="4" fill={eyeColor} />
                  <circle cx="75.5" cy="54" r="1.5" fill="#ffffff" opacity="0.9" />
                </g>
              )}
            </g>

            {/* BOCA DO BYTEZINHO (Oculta se ninja ou herói aracnídeo com máscara) */}
            {skin !== 'ninja' && skin !== 'arachnid_hero' && (
              <g id="mouth">
                {isGlitch ? (
                  <path d="M50 72 L55 70 L60 74 L65 70 L70 72" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                ) : isOverheating ? (
                  <path d="M49 74 Q54 68 60 74 Q66 68 71 74" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                ) : mood === 'happy' || mood === 'upgrade' ? (
                  <path d="M52 70 Q60 78 68 70" stroke={eyeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                ) : isTyping ? (
                  <ellipse cx="60" cy="72" rx="4.5" ry="3" fill={eyeColor} />
                ) : mood === 'oops' ? (
                  <path d="M53 74 Q60 69 67 74" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" fill="none" />
                ) : skin === 'retro_8bit' ? (
                  <line x1="53" y1="72" x2="67" y2="72" stroke={eyeColor} strokeWidth="2.5" />
                ) : (
                  <path d="M54 71 Q60 75 66 71" stroke={eyeColor} strokeWidth="2.2" strokeLinecap="round" fill="none" />
                )}
              </g>
            )}
          </g>

          {/* Visor Cyberpunk sobreposto à tela */}
          {skin === 'cyber' && (
            <g id="cyber-visor">
              <path d="M32 46 L88 46 L84 62 L36 62 Z" fill="#06b6d4" fillOpacity="0.2" stroke="#22d3ee" strokeWidth="1.8" />
              <line x1="33" y1="50" x2="87" y2="50" stroke="#a5f3fc" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
              <circle cx="85" cy="54" r="2" fill="#f43f5e" className="animate-pulse" />
            </g>
          )}

          {/* Visor Espacial Espelhado Dourado do Astronauta */}
          {skin === 'astronaut' && (
            <g id="astronaut-visor" opacity="0.4">
              <path d="M30 46 Q60 38 90 46 L86 64 Q60 72 34 64 Z" fill="url(#astroGold)" stroke="#f59e0b" strokeWidth="1.2" />
              <defs>
                <linearGradient id="astroGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </g>
          )}

          {/* Máscara de Mergulho Oval */}
          {skin === 'diver' && (
            <g id="diver-mask">
              <ellipse cx="60" cy="58" rx="28" ry="18" stroke="#0284c7" strokeWidth="2.5" fill="none" opacity="0.8" />
              <ellipse cx="60" cy="58" rx="26" ry="16" fill="#38bdf8" fillOpacity="0.1" />
            </g>
          )}
        </g>

        {/* ==================================================== */}
        {/* ACESSÓRIOS SOBREPOSTOS NA FRENTE DO MONITOR */}
        {/* ==================================================== */}

        {/* 1. HOODIE HACKER: Capuz escuro cobrindo a carcaça */}
        {skin === 'hoodie_hacker' && (
          <g id="hacker-hoodie">
            <path
              d="M14 36 Q18 16 60 14 Q102 16 106 36 Q100 24 60 22 Q20 24 14 36 Z"
              fill="#090a0f"
              stroke="#2e354b"
              strokeWidth="2"
            />
            <path d="M14 36 Q10 60 16 88 Q20 54 22 36 Z" fill="#0d0f17" opacity="0.95" />
            <path d="M106 36 Q110 60 104 88 Q100 54 98 36 Z" fill="#0d0f17" opacity="0.95" />
            <path d="M28 84 Q26 96 30 102" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            <circle cx="30" cy="102" r="2" fill="#94a3b8" />
            <path d="M92 84 Q94 96 90 102" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            <circle cx="90" cy="102" r="2" fill="#94a3b8" />
          </g>
        )}

        {/* 2. WIZARD: Chapéu de Mago pontudo com estrelas douradas */}
        {skin === 'wizard' && (
          <g id="wizard-hat">
            <ellipse cx="60" cy="28" rx="46" ry="10" fill="#2e1065" stroke="#7c3aed" strokeWidth="2.5" />
            <ellipse cx="60" cy="27" rx="38" ry="7" fill="#4c1d95" />
            <path
              d="M34 26 Q46 6 82 -2 Q74 14 86 26 Z"
              fill="#5b21b6"
              stroke="#8b5cf6"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M36 26 Q60 22 84 26 L85 22 Q60 18 35 22 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
            <g fill="#fde047" stroke="#ca8a04" strokeWidth="0.5">
              <polygon points="56,8 58,13 63,14 59,17 60,22 56,19 52,22 53,17 49,14 54,13" />
              <circle cx="82" cy="-2" r="3.5" fill="#fde047" className="animate-pulse" />
            </g>
            <circle cx="28" cy="14" r="1.5" fill="#c084fc" opacity="0.8" />
            <circle cx="94" cy="12" r="2" fill="#facc15" opacity="0.7" />
          </g>
        )}

        {/* 3. NINJA: Bandana com placa de metal e máscara facial inferior */}
        {skin === 'ninja' && (
          <g id="ninja-gear">
            {/* Faixa da bandana vermelha */}
            <path d="M16 32 L104 32 L102 24 L18 24 Z" fill="#b91c1c" stroke="#991b1b" strokeWidth="1.5" />
            {/* Placa de metal frontal com inscrição */}
            <rect x="42" y="24" width="36" height="10" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
            <text x="60" y="32" fontSize="7" fontWeight="bold" fill="#0f172a" textAnchor="middle" fontFamily="monospace">
              &#123;/&#125;
            </text>
            {/* Máscara ninja tapando boca */}
            <path d="M26 66 L94 66 L86 86 L34 86 Z" fill="#090a0f" stroke="#dc2626" strokeWidth="1.5" />
            <line x1="60" y1="67" x2="60" y2="85" stroke="#262626" strokeWidth="1.5" />
          </g>
        )}

        {/* 4. STEAMPUNK: Cartola com óculos goggles de bronze */}
        {skin === 'steampunk' && (
          <g id="steampunk-hat">
            <ellipse cx="60" cy="27" rx="44" ry="8" fill="#451a03" stroke="#92400e" strokeWidth="2" />
            <rect x="34" y="6" width="52" height="20" rx="3" fill="#542304" stroke="#78350f" strokeWidth="2" />
            <rect x="34" y="20" width="52" height="5" fill="#d97706" />
            {/* Óculos Goggles na aba */}
            <circle cx="48" cy="25" r="7" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="48" cy="25" r="5" fill="#14532d" />
            <circle cx="72" cy="25" r="7" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="72" cy="25" r="5" fill="#14532d" />
            <line x1="55" y1="25" x2="65" y2="25" stroke="#f59e0b" strokeWidth="2" />
          </g>
        )}

        {/* 5. REI DOS BYTES: Coroa dourada cravejada com joias reais */}
        {skin === 'golden_king' && (
          <g id="royal-crown">
            {/* Coroa dourada de 5 pontas */}
            <polygon
              points="30,26 34,10 47,20 60,6 73,20 86,10 90,26"
              fill="#eab308"
              stroke="#ca8a04"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Faixa base da coroa */}
            <rect x="28" y="24" width="64" height="6" rx="2" fill="#d97706" stroke="#b45309" strokeWidth="1" />
            {/* Rubis nas pontas */}
            <circle cx="34" cy="11" r="2.5" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
            <circle cx="60" cy="7" r="3.5" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
            <circle cx="86" cy="11" r="2.5" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
            {/* Halo radiante de ouro */}
            <circle cx="60" cy="6" r="8" fill="#fef08a" opacity="0.3" className="animate-pulse" />
          </g>
        )}

        {/* 6. MESTRE JEDI: Capuz da Força e Sabre de Luz azul */}
        {skin === 'jedi_master' && (
          <g id="jedi-gear">
            {/* Capuz marrom estilo túnica Jedi */}
            <path
              d="M14 36 Q18 16 60 14 Q102 16 106 36 Q100 24 60 22 Q20 24 14 36 Z"
              fill="#3e2723"
              stroke="#271406"
              strokeWidth="2"
            />
            <path d="M14 36 Q10 60 16 88 Q20 54 22 36 Z" fill="#4e342e" opacity="0.95" />
            <path d="M106 36 Q110 60 104 88 Q100 54 98 36 Z" fill="#4e342e" opacity="0.95" />
            {/* Sabre de luz aceso erguido na lateral */}
            <rect x="104" y="55" width="6" height="18" rx="2" fill="#64748b" stroke="#334155" strokeWidth="1" />
            <rect x="105.5" y="8" width="3" height="47" rx="1.5" fill="#ffffff" stroke="#38bdf8" strokeWidth="2.5" className="animate-pulse" />
            <circle cx="107" cy="8" r="5" fill="#38bdf8" opacity="0.5" className="animate-ping" style={{ animationDuration: '2.5s' }} />
          </g>
        )}

        {/* 7. MINERADOR DE DIAMANTE: Capacete cúbico e picareta */}
        {skin === 'miner_diamond' && (
          <g id="minecraft-miner-gear">
            {/* Capacete de diamante cúbico */}
            <path d="M26 26 L26 12 L94 12 L94 26 L80 26 L80 20 L40 20 L40 26 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
            <rect x="28" y="14" width="7" height="7" fill="#67e8f9" />
            <rect x="85" y="14" width="7" height="7" fill="#0e7490" />
            <rect x="56" y="13" width="8" height="6" fill="#22d3ee" />
            {/* Picareta de diamante na lateral */}
            <line x1="10" y1="85" x2="22" y2="60" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
            <path d="M16 57 Q23 52 28 66" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="22" cy="57" r="1.5" fill="#a5f3fc" />
          </g>
        )}

        {/* 8. GUERREIRO SAIYAJIN: Cabelo espetado Super Saiyajin e ombreira */}
        {skin === 'saiyan_warrior' && (
          <g id="saiyan-gear">
            {/* Cabelo espetado Super Saiyajin */}
            <polygon
              points="18,26 10,6 28,14 38,-6 54,8 60,-8 76,8 96,0 88,26"
              fill="#facc15"
              stroke="#ca8a04"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Mechas de luz interna */}
            <path d="M28 18 L38 2 L48 14 L58 -2 L68 14 L82 8" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Armadura de combate Saiyajin no peito */}
            <path d="M34 94 L42 102 L78 102 L86 94 Z" fill="#e2e8f0" stroke="#ca8a04" strokeWidth="1.5" />
            <rect x="50" y="96" width="20" height="5" fill="#ca8a04" rx="1" />
          </g>
        )}

        {/* 9. HERÓI ARACNÍDEO: Teias e olhos expressivos da máscara */}
        {skin === 'arachnid_hero' && (
          <g id="arachnid-mask">
            {/* Teia geométrica sutil na carcaça */}
            <line x1="20" y1="28" x2="100" y2="98" stroke="#000000" strokeWidth="1" opacity="0.3" />
            <line x1="100" y1="28" x2="20" y2="98" stroke="#000000" strokeWidth="1" opacity="0.3" />
            <line x1="60" y1="26" x2="60" y2="100" stroke="#000000" strokeWidth="1" opacity="0.3" />
            {/* Lentes angulares grandes estilo Aranha */}
            <polygon points="34,48 50,56 46,65 34,60" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" />
            <polygon points="86,48 70,56 74,65 86,60" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Símbolo de Aranha no centro inferior */}
            <ellipse cx="60" cy="94" rx="2" ry="3" fill="#0f172a" />
            <line x1="56" y1="92" x2="64" y2="96" stroke="#0f172a" strokeWidth="1" />
            <line x1="56" y1="96" x2="64" y2="92" stroke="#0f172a" strokeWidth="1" />
          </g>
        )}

        {/* ==================================================== */}
        {/* ACESSÓRIOS FRONTAIS MÍTICOS / QUÂNTICOS DE ENDGAME */}
        {/* ==================================================== */}

        {/* 10. O FEITICEIRO VENDADO (Gojo / Jujutsu Kaisen) */}
        {skin === 'blindfolded_sorcerer' && (
          <g id="sorcerer-attire">
            {/* Casaco preto com gola alta estruturada */}
            <path d="M24 82 L18 104 L102 104 L96 82 L82 88 L60 80 L38 88 Z" fill="#020617" stroke="#1e293b" strokeWidth="2" />
            <path d="M42 80 L52 94 L68 94 L78 80" stroke="#38bdf8" strokeWidth="1.2" fill="none" opacity="0.8" />
            
            {/* Venda nos Olhos vs. Revelação dos Seis Olhos Azuis no Combo */}
            {(isCombo || comboCount >= 6) ? (
              <g id="sorcerer-unveiled">
                {/* Faixa preta levantada acima da linha dos olhos */}
                <path d="M26 38 L94 38 L92 30 L28 30 Z" fill="#09090b" stroke="#1e293b" strokeWidth="1.8" />
                <line x1="28" y1="34" x2="92" y2="34" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />

                {/* Olhos Azuis Cósmicos Radiantes (Six Eyes) */}
                <g id="cosmic-eyes">
                  {/* Olho Esquerdo */}
                  <ellipse cx="44" cy="54" rx="8" ry="7" fill="#0284c7" />
                  <circle cx="44" cy="54" r="5" fill="#38bdf8" className="animate-pulse" />
                  <circle cx="44" cy="54" r="2" fill="#ffffff" />
                  <circle cx="44" cy="54" r="8.5" stroke="#7dd3fc" strokeWidth="1" opacity="0.8" strokeDasharray="2 2" />

                  {/* Olho Direito */}
                  <ellipse cx="76" cy="54" rx="8" ry="7" fill="#0284c7" />
                  <circle cx="76" cy="54" r="5" fill="#38bdf8" className="animate-pulse" />
                  <circle cx="76" cy="54" r="2" fill="#ffffff" />
                  <circle cx="76" cy="54" r="8.5" stroke="#7dd3fc" strokeWidth="1" opacity="0.8" strokeDasharray="2 2" />

                  {/* Lampejos do Vazio Infinito */}
                  <line x1="44" y1="42" x2="44" y2="66" stroke="#e0f2fe" strokeWidth="1" opacity="0.6" />
                  <line x1="32" y1="54" x2="56" y2="54" stroke="#e0f2fe" strokeWidth="1" opacity="0.6" />
                  <line x1="76" y1="42" x2="76" y2="66" stroke="#e0f2fe" strokeWidth="1" opacity="0.6" />
                  <line x1="64" y1="54" x2="88" y2="54" stroke="#e0f2fe" strokeWidth="1" opacity="0.6" />
                </g>
              </g>
            ) : (
              <g id="sorcerer-blindfold">
                {/* Faixa cobrindo os olhos totalmente */}
                <path d="M24 46 L96 46 L94 64 L26 64 Z" fill="#09090b" stroke="#1e293b" strokeWidth="2" />
                <line x1="26" y1="55" x2="94" y2="55" stroke="#1e293b" strokeWidth="1.2" strokeDasharray="4 2" />
                <circle cx="92" cy="55" r="2" fill="#38bdf8" opacity="0.7" />
              </g>
            )}
          </g>
        )}

        {/* 11. O PIRATA EMBORRACHADO (Luffy / One Piece) */}
        {skin === 'rubber_pirate' && (
          <g id="pirate-vest">
            <path d="M22 84 L18 104 L44 104 L48 88 Z" fill="#b91c1c" stroke="#991b1b" strokeWidth="1.5" />
            <path d="M98 84 L102 104 L76 104 L72 88 Z" fill="#b91c1c" stroke="#991b1b" strokeWidth="1.5" />
            {/* Cicatriz em meia-lua sob o olho esquerdo */}
            <path d="M38 64 Q42 67 46 64" stroke="#7f1d1d" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <line x1="42" y1="63" x2="42" y2="67" stroke="#7f1d1d" strokeWidth="1" />
          </g>
        )}

        {/* 12. O ESQUELETO DE MOLETOM (Sans / Undertale) */}
        {skin === 'hoodie_skeleton' && (
          <g id="skeleton-hoodie">
            <path d="M14 36 Q18 16 60 14 Q102 16 106 36 Q100 24 60 22 Q20 24 14 36 Z" fill="#1e3a8a" stroke="#172554" strokeWidth="2" />
            <path d="M14 36 Q10 60 18 96 Q22 54 22 36 Z" fill="#1e40af" opacity="0.95" />
            <path d="M106 36 Q110 60 102 96 Q98 54 98 36 Z" fill="#1e40af" opacity="0.95" />
            {/* Sorriso esquelético largo com dentes verticais */}
            <path d="M46 72 Q60 76 74 72" stroke="#0f172a" strokeWidth="2" fill="none" />
            <line x1="52" y1="69" x2="52" y2="74" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="60" y1="70" x2="60" y2="75" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="68" y1="69" x2="68" y2="74" stroke="#0f172a" strokeWidth="1.5" />
            {/* Chama azul-ciano espectral na órbita esquerda em combo */}
            {(isCombo || comboCount > 0) && (
              <g id="bad-time-eye">
                <circle cx="44" cy="54" r="5" fill="#06b6d4" className="animate-ping" style={{ animationDuration: '1.2s' }} />
                <circle cx="44" cy="54" r="3.5" fill="#22d3ee" />
                <path d="M44 54 Q40 42 42 36 Q46 44 44 54 Z" fill="#67e8f9" opacity="0.8" />
              </g>
            )}
          </g>
        )}

        {/* 13. O CIBORGUE URBANO (David Martinez / Cyberpunk: Edgerunners) */}
        {skin === 'urban_cyborg' && (
          <g id="cyborg-jacket">
            <path d="M22 84 L16 106 L104 106 L98 84 L80 90 L60 82 L40 90 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
            <line x1="60" y1="82" x2="60" y2="106" stroke="#0f172a" strokeWidth="2" />
            {/* Implante neural com LEDs azuis */}
            <rect x="94" y="44" width="5" height="24" rx="2" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
            <circle cx="96.5" cy="48" r="1.5" fill="#22d3ee" className="animate-pulse" />
            <circle cx="96.5" cy="56" r="1.5" fill="#06b6d4" />
            <circle cx="96.5" cy="64" r="1.5" fill="#22d3ee" className="animate-pulse" />
          </g>
        )}

        {/* 14. O CAÇADOR DO QUIMONO XADREZ (Tanjiro / Demon Slayer) */}
        {skin === 'demon_slayer' && (
          <g id="demon-slayer-gear">
            <path d="M22 86 L18 104 L102 104 L98 86 Z" fill="#0f172a" stroke="#16a34a" strokeWidth="1.5" />
            <rect x="36" y="88" width="12" height="12" fill="#16a34a" />
            <rect x="48" y="88" width="12" height="12" fill="#09090b" />
            <rect x="60" y="88" width="12" height="12" fill="#16a34a" />
            <rect x="72" y="88" width="12" height="12" fill="#09090b" />
            {/* Brincos hanafuda nos dois lados */}
            <rect x="18" y="60" width="6" height="14" rx="1" fill="#f8fafc" stroke="#dc2626" strokeWidth="0.8" />
            <circle cx="21" cy="65" r="1.5" fill="#dc2626" />
            <rect x="96" y="60" width="6" height="14" rx="1" fill="#f8fafc" stroke="#dc2626" strokeWidth="0.8" />
            <circle cx="99" cy="65" r="1.5" fill="#dc2626" />
          </g>
        )}

        {/* 15. O ROEDOR ELÉTRICO (Pikachu / Pokémon) */}
        {skin === 'electric_rodent' && (
          <g id="electric-rodent-cheeks">
            <circle cx="34" cy="66" r="6" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
            <circle cx="86" cy="66" r="6" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
            {(isCombo || isTypingActive) && (
              <g stroke="#fef08a" strokeWidth="1.2" fill="none">
                <path d="M28 66 L22 62 L26 68 L20 68" />
                <path d="M92 66 L98 62 L94 68 L100 68" />
              </g>
            )}
          </g>
        )}

        {/* 16. O HERÓI ENTEDIADO (Saitama / One Punch Man) */}
        {skin === 'bored_hero' && (
          <g id="bored-hero-gear">
            <path d="M22 84 L14 106 L106 106 L98 84 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="32" cy="86" r="4.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            <circle cx="88" cy="86" r="4.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            <ellipse cx="48" cy="30" rx="6" ry="2.5" fill="#ffffff" opacity="0.7" />
          </g>
        )}

        {/* 17. O BESOURO AGULHEIRO (Hollow Knight) */}
        {skin === 'needle_knight' && (
          <g id="needle-knight-cloak">
            <path d="M22 80 Q60 74 98 80 L102 106 L18 106 Z" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
            <line x1="102" y1="96" x2="114" y2="40" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="114" cy="40" rx="1.5" ry="3" fill="#cbd5e1" />
          </g>
        )}

        {/* 18. O CAVALEIRO DAS SOMBRAS (Batman) */}
        {skin === 'shadow_crusader' && (
          <g id="shadow-crusader-gear">
            <path d="M20 84 Q14 106 28 106 Q40 96 60 102 Q80 96 92 106 Q106 106 100 84 Z" fill="#09090b" stroke="#27272a" strokeWidth="2" />
            <polygon points="36,52 48,56 46,62 36,58" fill="#ffffff" />
            <polygon points="84,52 72,56 74,62 84,58" fill="#ffffff" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};
