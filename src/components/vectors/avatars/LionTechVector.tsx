import React from 'react';
import { AvatarVectorProps } from './types';

export const LionTechVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Leão Tech" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Juba geométrica facetada dourada */}
      <polygon points="24,3 32,8 41,8 43,18 47,26 42,35 34,42 24,46 14,42 6,35 1,26 5,18 7,8 16,8" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
      <polygon points="24,6 30,10 38,10 39,18 43,24 39,32 32,38 24,42 16,38 9,32 5,24 9,18 10,10 18,10" fill="#D97706" />
      {/* Orelhas redondas espreitando na juba */}
      <circle cx="13" cy="14" r="3.5" fill="#F59E0B" />
      <circle cx="35" cy="14" r="3.5" fill="#F59E0B" />
      <circle cx="13" cy="14" r="2" fill="#78350F" />
      <circle cx="35" cy="14" r="2" fill="#78350F" />
      {/* Rosto central do leão */}
      <polygon points="17,14 31,14 34,26 24,36 14,26" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
      {/* Olhos cibernéticos azul-turquesa */}
      <polygon points="17,21 21,21 20,24 16,24" fill="#06B6D4" />
      <polygon points="27,21 31,21 32,24 28,24" fill="#06B6D4" />
      <circle cx="18.5" cy="22.5" r="0.75" fill="#FFFFFF" />
      <circle cx="29.5" cy="22.5" r="0.75" fill="#FFFFFF" />
      {/* Nariz triangular grande marrom */}
      <polygon points="21,28 27,28 24,32" fill="#451A03" />
      {/* Focinho e queixo */}
      <path d="M 24 32 L 24 34 M 22 34 Q 24 35 26 34" stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
