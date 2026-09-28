import React from 'react';
import { AvatarVectorProps } from './types';

export const TigerVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Tigre" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Orelhas arredondadas pretas com pontas brancas */}
      <circle cx="10" cy="12" r="6" fill="#F97316" stroke="#0F172A" strokeWidth="2" />
      <circle cx="38" cy="12" r="6" fill="#F97316" stroke="#0F172A" strokeWidth="2" />
      <circle cx="10" cy="12" r="3" fill="#0F172A" />
      <circle cx="38" cy="12" r="3" fill="#0F172A" />
      {/* Cabeça do tigre */}
      <circle cx="24" cy="26" r="17" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />
      {/* Listras pretas na testa */}
      <polygon points="24,11 22,17 26,17" fill="#0F172A" />
      <polygon points="20,12 18,16 22,16" fill="#0F172A" />
      <polygon points="28,12 26,16 30,16" fill="#0F172A" />
      {/* Listras laterais nas bochechas */}
      <polygon points="8,24 15,25 9,28" fill="#0F172A" />
      <polygon points="8,30 14,31 9,34" fill="#0F172A" />
      <polygon points="40,24 33,25 39,28" fill="#0F172A" />
      <polygon points="40,30 34,31 39,34" fill="#0F172A" />
      {/* Bochechas brancas */}
      <ellipse cx="18" cy="33" rx="5" ry="3.5" fill="#F8FAFC" />
      <ellipse cx="30" cy="33" rx="5" ry="3.5" fill="#F8FAFC" />
      {/* Olhos âmbar com pupilas rasgadas */}
      <ellipse cx="17" cy="23" rx="3.5" ry="2.5" fill="#FBBF24" />
      <ellipse cx="31" cy="23" rx="3.5" ry="2.5" fill="#FBBF24" />
      <ellipse cx="17" cy="23" rx="1.2" ry="2.5" fill="#0F172A" />
      <ellipse cx="31" cy="23" rx="1.2" ry="2.5" fill="#0F172A" />
      <circle cx="17.5" cy="22" r="0.75" fill="#FFFFFF" />
      <circle cx="31.5" cy="22" r="0.75" fill="#FFFFFF" />
      {/* Nariz rosa escuro e focinho */}
      <polygon points="24,30 21.5,27 26.5,27" fill="#E11D48" />
      <path d="M 21 33 Q 24 36 27 33" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
};
