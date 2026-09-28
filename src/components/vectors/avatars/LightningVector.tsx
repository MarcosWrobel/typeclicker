import React from 'react';
import { AvatarVectorProps } from './types';

export const LightningVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Raio Turbo" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Disco escuro de fundo com anel de energia */}
      <circle cx="24" cy="24" r="20" fill="#0F172A" stroke="#EAB308" strokeWidth="1.5" />
      {/* Brilho externo do raio */}
      <path d="M 27 4 L 11 25 L 23 25 L 18 44 L 37 20 L 25 20 Z" fill="#CA8A04" opacity="0.4" />
      {/* Corpo principal do raio */}
      <path d="M 26 6 L 13 24 L 23 24 L 19 41 L 35 21 L 25 21 Z" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Núcleo interno de alta voltagem branco */}
      <path d="M 25 9 L 16 23 L 23 23 L 20 37 L 31 22 L 24 22 Z" fill="#FEF08A" />
      {/* Faíscas elétricas ao redor */}
      <line x1="8" y1="12" x2="11" y2="15" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="32" x2="41" y2="35" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="11" x2="39" y2="9" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="35" x2="7" y2="38" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
