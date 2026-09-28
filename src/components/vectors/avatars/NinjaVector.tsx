import React from 'react';
import { AvatarVectorProps } from './types';

export const NinjaVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Ninja" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Capuz externo escuro */}
      <circle cx="24" cy="24" r="19" fill="#0F172A" stroke="#334155" strokeWidth="2" />
      {/* Bandana na testa */}
      <path d="M 6 16 C 14 13 34 13 42 16 L 41 21 C 33 18 15 18 7 21 Z" fill="#EF4444" />
      {/* Nó e fitas da bandana saindo para a direita */}
      <path d="M 41 18 L 47 21 L 43 24 L 46 29 L 39 24 Z" fill="#DC2626" />
      {/* Placa metálica central da bandana */}
      <rect x="20" y="14" width="8" height="5" rx="1.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.75" />
      <circle cx="22" cy="16.5" r="0.6" fill="#475569" />
      <circle cx="26" cy="16.5" r="0.6" fill="#475569" />
      {/* Abertura dos olhos (pele) */}
      <path d="M 12 21 C 18 19 30 19 36 21 C 36 27 34 29 24 29 C 14 29 12 27 12 21 Z" fill="#FBCFE8" />
      {/* Máscara inferior de pano */}
      <path d="M 10 28 C 16 29 32 29 38 28 C 36 40 28 43 24 43 C 20 43 12 40 10 28 Z" fill="#1E293B" stroke="#334155" strokeWidth="1" />
      {/* Olhos focados e sobrancelhas afiadas */}
      <path d="M 15 22 L 20 24" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 33 22 L 28 24" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="18" cy="24.5" rx="2" ry="1.5" fill="#0F172A" />
      <ellipse cx="30" cy="24.5" rx="2" ry="1.5" fill="#0F172A" />
      <circle cx="18.5" cy="24" r="0.6" fill="#FFFFFF" />
      <circle cx="29.5" cy="24" r="0.6" fill="#FFFFFF" />
    </svg>
  );
};
