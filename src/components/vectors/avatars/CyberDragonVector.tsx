import React from 'react';
import { AvatarVectorProps } from './types';

export const CyberDragonVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Dragão" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Círculo de fundo místico esmeralda */}
      <circle cx="24" cy="24" r="20" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
      {/* Chifres imponentes curvados */}
      <path d="M 17 17 C 14 10 9 6 6 8 C 8 13 13 18 16 20 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
      <path d="M 31 17 C 34 10 39 6 42 8 C 40 13 35 18 32 20 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
      {/* Cabeça do dragão */}
      <path d="M 16 16 L 32 16 L 36 26 L 31 38 L 24 43 L 17 38 L 12 26 Z" fill="#047857" stroke="#059669" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Placas da testa e crista */}
      <polygon points="24,14 28,20 24,24 20,20" fill="#065F46" />
      <polygon points="24,24 27,29 24,33 21,29" fill="#065F46" />
      {/* Olhos de dragão em chamas amarelo/laranja */}
      <polygon points="15,23 21,23 18,27" fill="#FBBF24" />
      <polygon points="33,23 27,23 30,27" fill="#FBBF24" />
      <ellipse cx="18" cy="24.5" rx="0.75" ry="2" fill="#78350F" />
      <ellipse cx="30" cy="24.5" rx="0.75" ry="2" fill="#78350F" />
      {/* Narinas fumegantes com vapor */}
      <circle cx="21" cy="37" r="1" fill="#064E3B" />
      <circle cx="27" cy="37" r="1" fill="#064E3B" />
      {/* Presas inferiores brancas saindo */}
      <polygon points="18,36 20,36 19,39" fill="#F8FAFC" />
      <polygon points="30,36 28,36 29,39" fill="#F8FAFC" />
    </svg>
  );
};
