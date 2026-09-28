import React from 'react';
import { AvatarVectorProps } from './types';

export const TeacherVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Professor" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Círculo de fundo acadêmico verde esmeralda */}
      <circle cx="24" cy="24" r="20" fill="#064E3B" stroke="#10B981" strokeWidth="1.5" />
      {/* Ombro e paletó do professor */}
      <path d="M 12 43 C 12 36 17 33 24 33 C 31 33 36 36 36 43 Z" fill="#1E293B" />
      {/* Colarinho de camisa branca e gravata esmeralda */}
      <polygon points="21,33 27,33 24,37" fill="#F8FAFC" />
      <polygon points="23,37 25,37 26,43 22,43" fill="#10B981" />
      {/* Cabeça do professor */}
      <circle cx="24" cy="23" r="10" fill="#FED7AA" />
      {/* Cabelo lateral */}
      <path d="M 14 20 C 14 25 15 27 16 28 C 15 25 15 22 16 20 Z" fill="#334155" />
      <path d="M 34 20 C 34 25 33 27 32 28 C 33 25 33 22 32 20 Z" fill="#334155" />
      {/* Olhos e sobrancelhas sábias */}
      <circle cx="20" cy="22" r="1.5" fill="#1E293B" />
      <circle cx="28" cy="22" r="1.5" fill="#1E293B" />
      <path d="M 18 19 Q 20 18 22 19" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
      <path d="M 26 19 Q 28 18 30 19" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
      {/* Sorriso sereno */}
      <path d="M 21.5 27 Q 24 29 26.5 27" stroke="#EA580C" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Óculos com aro dourado */}
      <circle cx="20" cy="22" r="3.2" fill="none" stroke="#F59E0B" strokeWidth="1.2" />
      <circle cx="28" cy="22" r="3.2" fill="none" stroke="#F59E0B" strokeWidth="1.2" />
      <line x1="23.2" y1="22" x2="24.8" y2="22" stroke="#F59E0B" strokeWidth="1.2" />
      {/* Capelo acadêmico de formatura (topo da cabeça) */}
      <polygon points="24,6 38,12 24,17 10,12" fill="#0F172A" stroke="#1E293B" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M 17 14.5 L 17 19 C 17 21 31 21 31 19 L 31 14.5" fill="#0F172A" />
      {/* Botão e fita/pingente dourado pendurado para a esquerda */}
      <circle cx="24" cy="11.5" r="1.2" fill="#F59E0B" />
      <path d="M 24 11.5 C 19 12 14 16 13 21" stroke="#F59E0B" strokeWidth="1" fill="none" />
      <polygon points="12,21 14,21 13,24" fill="#F59E0B" />
    </svg>
  );
};
