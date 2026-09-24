import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// 📡 Radar Dish / Antena Militar
export const RadarDishIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 19a7 7 0 1 0-7-7" />
    <path d="M12 15a3 3 0 1 0-3-3" />
    <path d="M12 12l6-6" />
    <circle cx="18" cy="6" r="2" fill={color} />
    <path d="M2 21h20" />
    <path d="M7 21l2-5h6l2 5" />
  </svg>
);

// 💥 /NUKE - Ogiva Atômica / Detonação de Fogo
export const NukeIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3" fill={color} />
    <path d="M12 2v4" />
    <path d="M12 18v4" />
    <path d="M4.93 4.93l2.83 2.83" />
    <path d="M16.24 16.24l2.83 2.83" />
    <path d="M2 12h4" />
    <path d="M18 12h4" />
    <path d="M4.93 19.07l2.83-2.83" />
    <path d="M16.24 7.76l2.83-2.83" />
    <path d="M8 12a4 4 0 0 1 8 0" strokeDasharray="2 2" />
  </svg>
);

// ❄️ /FREEZE - Cristal Criogênico / Dilatação Temporal
export const FreezeIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v20" />
    <path d="M2 12h20" />
    <path d="M4.93 4.93l14.14 14.14" />
    <path d="M19.07 4.93L4.93 19.07" />
    <path d="M12 6l2-2m-2 2l-2-2" />
    <path d="M12 18l2 2m-2-2l-2 2" />
    <path d="M6 12l-2 2m2-2l-2-2" />
    <path d="M18 12l2 2m-2-2l2-2" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);

// 🛡️ /SHIELD - Barreira com Prisma Defensivo
export const ShieldIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2l8 4v6c0 5.25-3.5 10-8 11-4.5-1-8-5.75-8-11V6l8-4z" />
    <path d="M12 6l5 2.5v3.5c0 3.28-2.19 6.25-5 7-2.81-.75-5-3.72-5-7V8.5L12 6z" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1.5" fill={color} />
  </svg>
);

// ⚡ /EMP - Pulso Eletromagnético de Alta Tensão
export const EmpIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    <circle cx="12" cy="12" r="9" strokeDasharray="3 3" strokeWidth="1" />
  </svg>
);

// ⚡ Laser de Alta Potência
export const LaserIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 12h16" />
    <path d="M14 6l6 6-6 6" />
    <path d="M2 12l2-3 2 3-2 3-2-3z" fill={color} />
    <line x1="8" y1="8" x2="8" y2="16" strokeDasharray="2 2" />
  </svg>
);

// 🔋 Capacitor Cinético
export const CapacitorIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="7" width="16" height="10" rx="2" />
    <line x1="22" y1="11" x2="22" y2="13" />
    <line x1="6" y1="10" x2="6" y2="14" />
    <line x1="10" y1="9" x2="10" y2="15" />
    <line x1="14" y1="11" x2="14" y2="13" />
  </svg>
);

// 🎯 Scanner Quântico
export const ScannerIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="8" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);

// 🧪 Nanorobôs de Reparo
export const NanoRepairIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2l3 5h5l-4 4 1.5 5.5L12 14l-5.5 2.5L8 11 4 7h5l3-5z" />
    <circle cx="12" cy="10" r="1.5" fill={color} />
    <path d="M9 19h6M12 16v6" />
  </svg>
);

// 👑 Overclock de Terminal
export const OverclockIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M9 9h6v6H9z" fill={color} fillOpacity="0.2" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
    <path d="M10 12l2-2 2 4" strokeWidth="2" />
  </svg>
);

// 💰 Mineração Criptográfica em Massa
export const CryptoNodeIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);

// 🔰 Barreira Reativa
export const BarrierIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 20 7 20 17 12 22 4 17 4 7 12 2" />
    <line x1="12" y1="6" x2="12" y2="18" />
    <line x1="6" y1="12" x2="18" y2="12" />
  </svg>
);

// 🏆 Troféu / Conquista
export const TrophyIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </svg>
);

// Mapeamento dinâmico de ícones de passivas e habilidades
export const getRadarIcon = (iconId: string, props: IconProps = {}) => {
  switch (iconId) {
    case 'nuke':
    case '/NUKE':
    case 'nuke_frequency':
      return <NukeIcon {...props} />;
    case 'freeze':
    case '/FREEZE':
    case 'cryo_dampeners':
      return <FreezeIcon {...props} />;
    case 'shield':
    case '/SHIELD':
    case 'shield_generator':
      return <ShieldIcon {...props} />;
    case 'emp':
    case '/EMP':
      return <EmpIcon {...props} />;
    case 'laser_overcharge':
      return <LaserIcon {...props} />;
    case 'kinetic_capacitor':
      return <CapacitorIcon {...props} />;
    case 'reactive_barrier':
      return <BarrierIcon {...props} />;
    case 'quantum_scanner':
      return <ScannerIcon {...props} />;
    case 'nano_repair':
      return <NanoRepairIcon {...props} />;
    case 'terminal_overclock':
      return <OverclockIcon {...props} />;
    case 'byte_multiplier':
      return <CryptoNodeIcon {...props} />;
    case 'radar_dish':
      return <RadarDishIcon {...props} />;
    case 'trophy':
      return <TrophyIcon {...props} />;
    default:
      return <LaserIcon {...props} />;
  }
};

// ⬢ Badge Hexagonal com Borda Dupla Tática Militar
interface HexBadgeProps {
  children: React.ReactNode;
  rarity?: 'common' | 'rare' | 'epic';
  size?: number; // em px
  className?: string;
  isPulsing?: boolean;
}

export const HexBadge: React.FC<HexBadgeProps> = ({
  children,
  rarity = 'common',
  size = 54,
  className = '',
  isPulsing = false
}) => {
  // Paletas de raridade
  const colors = {
    common: {
      border: '#f97316',
      innerBorder: '#ea580c',
      bg: 'rgba(234, 88, 12, 0.12)',
      glow: 'rgba(249, 115, 22, 0.4)'
    },
    rare: {
      border: '#38bdf8',
      innerBorder: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.14)',
      glow: 'rgba(56, 189, 248, 0.45)'
    },
    epic: {
      border: '#10b981',
      innerBorder: '#059669',
      bg: 'rgba(5, 150, 105, 0.16)',
      glow: 'rgba(16, 185, 129, 0.5)'
    }
  }[rarity];

  const strokeW = 2;
  const padding = 3;
  const w = size;
  const h = size;

  // Pontos de hexágono regular centrado
  const points = (offset: number) => {
    const r = (size / 2) - offset;
    const cx = size / 2;
    const cy = size / 2;
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${isPulsing ? 'animate-pulse' : ''} ${className}`}
      style={{ width: w, height: h }}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="absolute inset-0 pointer-events-none drop-shadow-[0_0_8px_var(--glow)]"
        style={{ '--glow': colors.glow } as React.CSSProperties}
      >
        {/* Hexágono externo */}
        <polygon
          points={points(padding)}
          fill={colors.bg}
          stroke={colors.border}
          strokeWidth={strokeW}
          strokeLinejoin="round"
        />
        {/* Hexágono interno para efeito de moldura dupla de console */}
        <polygon
          points={points(padding + 4)}
          fill="none"
          stroke={colors.innerBorder}
          strokeWidth={1}
          strokeDasharray="3 2"
          strokeLinejoin="round"
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center text-white">
        {children}
      </div>
    </div>
  );
};
