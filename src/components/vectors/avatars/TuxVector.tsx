import React from 'react';
import { AvatarVectorProps } from './types';

export const TuxVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Tux Linux" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Corpo principal do pinguim */}
      <ellipse cx="24" cy="27" rx="14" ry="16" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
      {/* Barriga branca oval */}
      <ellipse cx="24" cy="30" rx="9" ry="11" fill="#F8FAFC" />
      {/* Nadadeiras laterais */}
      <path d="M 10 24 C 6 27 5 35 11 36 C 12 33 12 28 11 25" fill="#0F172A" />
      <path d="M 38 24 C 42 27 43 35 37 36 C 36 33 36 28 37 25" fill="#0F172A" />
      {/* Pés amarelos com garras */}
      <ellipse cx="18" cy="42" rx="5" ry="2.5" fill="#F59E0B" />
      <ellipse cx="30" cy="42" rx="5" ry="2.5" fill="#F59E0B" />
      {/* Olhos expressivos com reflexo */}
      <ellipse cx="19" cy="18" rx="3.5" ry="4.5" fill="#FFFFFF" />
      <ellipse cx="29" cy="18" rx="3.5" ry="4.5" fill="#FFFFFF" />
      <circle cx="20" cy="18" r="2" fill="#0F172A" />
      <circle cx="28" cy="18" r="2" fill="#0F172A" />
      <circle cx="21" cy="17" r="0.75" fill="#FFFFFF" />
      <circle cx="29" cy="17" r="0.75" fill="#FFFFFF" />
      {/* Bico proeminente amarelo/laranja */}
      <path d="M 21 21 Q 24 20 27 21 L 24 26 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
};
