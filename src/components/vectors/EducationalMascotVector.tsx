import React from 'react';

export type MascotMood = 'neutral' | 'happy' | 'thinking' | 'victory';

export interface EducationalMascotVectorProps {
  className?: string;
  size?: number | string;
  mood?: MascotMood;
  glow?: boolean;
}

/**
 * Vetor icônico nativo otimizado para o ecossistema Educa GameHub
 * Zero dependências de rede, escala responsiva e animações Tailwind nativas.
 */
export const EducationalMascotVector: React.FC<EducationalMascotVectorProps> = ({
  className = "w-12 h-12",
  size,
  mood = 'neutral',
  glow = false,
}) => {
  const dimensions = size ? { width: size, height: size } : {};

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${
        glow ? 'drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]' : ''
      }`}
      style={dimensions}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} transition-transform duration-200 hover:scale-105`}
        role="img"
        aria-label={`Mascote em estado ${mood}`}
      >
        {/* Geometria vetorial do elemento */}
        <rect x="6" y="8" width="36" height="32" rx="6" className="fill-slate-800 stroke-cyan-400" strokeWidth="2.5" />
        <circle cx="18" cy="22" r="3.5" className="fill-cyan-300" />
        <circle cx="30" cy="22" r="3.5" className="fill-cyan-300" />
        
        {/* Expressão contextual baseada no DDA / gamificação */}
        {mood === 'victory' && (
          <path d="M 17 31 Q 24 37 31 31" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}
        {mood === 'thinking' && (
          <line x1="18" y1="32" x2="30" y2="32" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
        )}
        {(mood === 'neutral' || mood === 'happy') && (
          <path d="M 19 30 Q 24 34 29 30" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}
      </svg>
    </div>
  );
};
