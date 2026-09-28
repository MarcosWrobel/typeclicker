import React from 'react';
import { AvatarVectorProps } from './types';

export const RocketVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Foguete" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Fundo estrelado circular */}
      <circle cx="24" cy="24" r="20" fill="#0B0F19" stroke="#3B82F6" strokeWidth="1.5" />
      {/* Chamas de propulsão */}
      <path d="M 21 34 Q 24 45 24 46 Q 24 45 27 34 Z" fill="#EF4444" />
      <path d="M 22 34 Q 24 41 24 42 Q 24 41 26 34 Z" fill="#FACC15" />
      {/* Aletas laterais vermelhas */}
      <path d="M 17 26 L 11 34 L 17 33 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" strokeLinejoin="round" />
      <path d="M 31 26 L 37 34 L 31 33 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" strokeLinejoin="round" />
      {/* Fuselagem cilíndrica branca */}
      <path d="M 17 33 L 17 19 C 17 10 24 5 24 5 C 24 5 31 10 31 19 L 31 33 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Ponta cônica vermelha */}
      <path d="M 19 14 C 20 8 24 5 24 5 C 24 5 28 8 29 14 Z" fill="#EF4444" />
      {/* Janela de vigia com aro metálico e reflexo */}
      <circle cx="24" cy="20" r="4.5" fill="#0284C7" stroke="#94A3B8" strokeWidth="1.5" />
      <circle cx="24" cy="20" r="3" fill="#38BDF8" />
      <circle cx="23" cy="19" r="1" fill="#FFFFFF" />
      {/* Faixa decorativa na base */}
      <rect x="17" y="30" width="14" height="2" fill="#3B82F6" />
    </svg>
  );
};
