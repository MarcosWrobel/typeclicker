import React from 'react';
import { AvatarVectorProps } from './types';

export const TRexVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "T-Rex" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Círculo de selva jurássica */}
      <circle cx="24" cy="24" r="20" fill="#14532D" stroke="#16A34A" strokeWidth="1.5" />
      {/* Cabeça maciça de T-Rex voltada para o perfil/3/4 */}
      <path d="M 12 12 C 18 8 36 8 38 12 C 40 15 42 22 41 27 L 27 27 L 27 31 L 36 31 C 36 37 32 40 26 40 L 16 38 C 11 36 10 24 12 12 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Mandíbula inferior */}
      <path d="M 27 34 L 38 34 C 37 39 31 41 24 41 L 18 39" fill="#16A34A" />
      {/* Dentes triangulares brancos superiores e inferiores */}
      <polygon points="28,27 29,30 30,27" fill="#F8FAFC" />
      <polygon points="31,27 32,30 33,27" fill="#F8FAFC" />
      <polygon points="34,27 35,30 36,27" fill="#F8FAFC" />
      <polygon points="37,27 38,30 39,27" fill="#F8FAFC" />
      <polygon points="29,34 30,31 31,34" fill="#F8FAFC" />
      <polygon points="32,34 33,31 34,34" fill="#F8FAFC" />
      <polygon points="35,34 36,31 37,34" fill="#F8FAFC" />
      {/* Olho ameaçador amarelo com pupila vertical */}
      <circle cx="20" cy="16" r="3.5" fill="#FACC15" />
      <ellipse cx="20" cy="16" rx="1" ry="3" fill="#0F172A" />
      <circle cx="19.5" cy="15" r="0.75" fill="#FFFFFF" />
      {/* Sobrancelha óssea proeminente */}
      <path d="M 16 13 Q 21 11 25 15" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Narina */}
      <circle cx="37" cy="17" r="1.2" fill="#14532D" />
      {/* Escamas nas costas */}
      <polygon points="12,12 8,14 11,18" fill="#15803D" />
      <polygon points="10,21 6,23 9,27" fill="#15803D" />
    </svg>
  );
};
