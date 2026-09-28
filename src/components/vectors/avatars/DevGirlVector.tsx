import React from 'react';
import { AvatarVectorProps } from './types';

export const DevGirlVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Dev Girl" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Círculo de fundo tech */}
      <circle cx="24" cy="24" r="20" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1.5" />
      {/* Rabo de cavalo atrás para a esquerda */}
      <path d="M 16 16 C 8 16 6 28 8 32 C 12 30 14 26 16 22 Z" fill="#431407" />
      <circle cx="16" cy="18" r="2.5" fill="#EC4899" />
      {/* Cabelo base e cabeça */}
      <circle cx="24" cy="20" r="11" fill="#FED7AA" />
      <path d="M 13 18 C 13 9 35 9 35 18 C 35 18 31 13 24 13 C 17 13 13 18 13 18 Z" fill="#78350F" />
      <path d="M 13 18 C 13 18 16 23 16 25 L 14 25 C 13 22 13 18 13 18 Z" fill="#78350F" />
      <path d="M 35 18 C 35 18 32 23 32 25 L 34 25 C 35 22 35 18 35 18 Z" fill="#78350F" />
      {/* Headset gamer rosa neon */}
      <path d="M 13 18 C 13 10 35 10 35 18" stroke="#F43F5E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="11.5" y="16" width="3" height="7" rx="1.5" fill="#E11D48" />
      <rect x="33.5" y="16" width="3" height="7" rx="1.5" fill="#E11D48" />
      {/* Olhos amigáveis e sorriso */}
      <circle cx="20" cy="20" r="1.8" fill="#1E293B" />
      <circle cx="28" cy="20" r="1.8" fill="#1E293B" />
      <circle cx="20.5" cy="19.5" r="0.6" fill="#FFFFFF" />
      <circle cx="28.5" cy="19.5" r="0.6" fill="#FFFFFF" />
      <path d="M 22 24 Q 24 26 26 24" stroke="#EA580C" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Óculos retangulares tech ciano */}
      <rect x="17" y="17" width="6" height="5" rx="1.5" fill="none" stroke="#06B6D4" strokeWidth="1.2" />
      <rect x="25" y="17" width="6" height="5" rx="1.5" fill="none" stroke="#06B6D4" strokeWidth="1.2" />
      <line x1="23" y1="19.5" x2="25" y2="19.5" stroke="#06B6D4" strokeWidth="1.2" />
      {/* Laptop aberto na base */}
      <polygon points="10,43 38,43 36,36 12,36" fill="#475569" stroke="#64748B" strokeWidth="1" />
      <polygon points="12,36 36,36 34,28 14,28" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
      {/* Logo brilhante de código </> na tela do laptop */}
      <path d="M 22 31 L 20 32 L 22 33 M 26 31 L 28 32 L 26 33 M 24.5 30.5 L 23.5 33.5" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
