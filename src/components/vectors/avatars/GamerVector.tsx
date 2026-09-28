import React from 'react';
import { AvatarVectorProps } from './types';

export const GamerVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Gamer Pro" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Fundo de luz sutil */}
      <circle cx="24" cy="24" r="20" fill="#18181B" stroke="#6366F1" strokeWidth="1.5" />
      {/* Chassi do gamepad */}
      <path d="M 12 15 C 20 13 28 13 36 15 C 41 16 44 23 42 32 C 40 38 34 38 31 34 L 27 28 L 21 28 L 17 34 C 14 38 8 38 6 32 C 4 23 7 16 12 15 Z" fill="#27272A" stroke="#4F46E5" strokeWidth="2" />
      {/* D-Pad direcional (cruz à esquerda) */}
      <rect x="13" y="21" width="3" height="7" rx="1" fill="#6366F1" />
      <rect x="11" y="23" width="7" height="3" rx="1" fill="#6366F1" />
      <circle cx="14.5" cy="24.5" r="0.75" fill="#EEF2FF" />
      {/* Botões de ação coloridos à direita */}
      <circle cx="34" cy="20" r="1.8" fill="#EC4899" />
      <circle cx="37.5" cy="23.5" r="1.8" fill="#3B82F6" />
      <circle cx="30.5" cy="23.5" r="1.8" fill="#10B981" />
      <circle cx="34" cy="27" r="1.8" fill="#F59E0B" />
      {/* Botões centrais (Select / Start) */}
      <rect x="20" y="22" width="2" height="4" rx="1" fill="#71717A" />
      <line x1="21.5" y1="23" x2="21.5" y2="25" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26.5" y1="23" x2="26.5" y2="25" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" />
      {/* Luz central de ligado */}
      <circle cx="24" cy="18" r="1" fill="#22C55E" />
    </svg>
  );
};
