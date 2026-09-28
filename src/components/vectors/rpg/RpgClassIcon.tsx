import React from 'react';
import { Zap, Flame, Target, Shield, Sparkles, ScrollText, Swords } from 'lucide-react';
import { RpgClassType } from '../../../types/rpgClass';

export interface RpgClassIconProps {
  rpgClass?: RpgClassType | string;
  className?: string;
  size?: number;
}

export const WarriorVectorIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "w-full h-full",
  size
}) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label="Guerreiro Veloz">
      {/* Espada 1 (diagonal noroeste-sudeste) */}
      <path d="M 5 19 L 9 15 M 8 16 L 19 5 L 20 4 L 19 3 L 18 4 L 7 15 L 8 16 Z" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="#EF4444" fillOpacity="0.2" />
      <line x1="6" y1="14" x2="10" y2="18" stroke="#FCA5A5" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="4.5" cy="19.5" r="1.5" fill="#EF4444" />
      {/* Espada 2 (diagonal nordeste-sudoeste) */}
      <path d="M 19 19 L 15 15 M 16 16 L 5 5 L 4 4 L 5 3 L 6 4 L 17 15 L 16 16 Z" stroke="#F87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="#F87171" fillOpacity="0.2" />
      <line x1="18" y1="14" x2="14" y2="18" stroke="#FEE2E2" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="19.5" cy="19.5" r="1.5" fill="#F87171" />
    </svg>
  );
};

export const ArcherVectorIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "w-full h-full",
  size
}) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label="Arqueiro do Combo">
      {/* Arco Curvo Tecnológico */}
      <path d="M 19 4 C 11 4 5 10 5 19" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="4" x2="5" y2="19" stroke="#34D399" strokeWidth="1" strokeDasharray="1.5 1.5" />
      {/* Flecha Energizada */}
      <line x1="7" y1="17" x2="19" y2="5" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" />
      <polygon points="19,5 15,6 18,9" fill="#10B981" stroke="#34D399" strokeWidth="1" />
      {/* Empunhadura Central */}
      <circle cx="10" cy="10" r="2" fill="#065F46" stroke="#34D399" strokeWidth="1.5" />
      {/* Penas da Flecha */}
      <line x1="6" y1="18" x2="5" y2="16" stroke="#6EE7B7" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="18" x2="8" y2="19" stroke="#6EE7B7" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const MageVectorIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "w-full h-full",
  size
}) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label="Mago Arcano">
      {/* Haste do Cajado Tecnológico */}
      <line x1="6" y1="20" x2="16" y2="7" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
      {/* Garra Superior / Cúpula de Foco */}
      <path d="M 14 9 C 13 5 18 3 19 7 C 20 11 16 12 14 9 Z" fill="#8B5CF6" fillOpacity="0.25" stroke="#C4B5FD" strokeWidth="1.5" />
      {/* Orbe de Energia Quântica Flutuante */}
      <circle cx="17" cy="6" r="3.5" fill="#8B5CF6" stroke="#DDD6FE" strokeWidth="1.5" />
      <circle cx="16" cy="5" r="1.2" fill="#FFFFFF" />
      {/* Partículas Arcanas */}
      <path d="M 19 2 L 20 4 L 22 5 L 20 6 L 19 8 L 18 6 L 16 5 L 18 4 Z" fill="#FDE047" />
      <circle cx="8" cy="14" r="0.8" fill="#C4B5FD" />
      <circle cx="11" cy="17" r="0.8" fill="#DDD6FE" />
    </svg>
  );
};

export const RpgClassIcon: React.FC<RpgClassIconProps> = ({
  rpgClass,
  className = "w-4 h-4 inline-block",
  size
}) => {
  if (!rpgClass) return null;
  const key = rpgClass.toLowerCase();

  if (key === 'warrior' || key === '⚔️' || key === 'guerreiro') {
    return <WarriorVectorIcon className={className} size={size} />;
  }
  if (key === 'archer' || key === '🏹' || key === 'arqueiro') {
    return <ArcherVectorIcon className={className} size={size} />;
  }
  if (key === 'mage' || key === '🧙‍♂️' || key === 'mago' || key === '🧙') {
    return <MageVectorIcon className={className} size={size} />;
  }

  // Fallback defensivo
  return <Swords className={className} />;
};

export interface RpgPassiveIconProps {
  icon?: string;
  className?: string;
  size?: number;
}

export const RpgPassiveIcon: React.FC<RpgPassiveIconProps> = ({
  icon,
  className = "w-3.5 h-3.5 inline-block",
  size
}) => {
  if (!icon) return null;

  switch (icon) {
    case '⚡':
    case 'impulse':
      return <Zap className={`${className} text-amber-400`} size={size} />;
    case '💥':
    case 'flame':
    case 'fury':
      return <Flame className={`${className} text-rose-400`} size={size} />;
    case '🎯':
    case 'target':
    case 'precision':
      return <Target className={`${className} text-emerald-400`} size={size} />;
    case '🛡️':
    case 'shield':
    case 'aegis':
      return <Shield className={`${className} text-sky-400`} size={size} />;
    case '✨':
    case 'sparkles':
    case 'mana':
      return <Sparkles className={`${className} text-purple-400`} size={size} />;
    case '📜':
    case 'scroll':
      return <ScrollText className={`${className} text-yellow-400`} size={size} />;
    default:
      return <Sparkles className={className} size={size} />;
  }
};
