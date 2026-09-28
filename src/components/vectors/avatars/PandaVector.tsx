import React from 'react';
import { AvatarVectorProps } from './types';

export const PandaVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Panda" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Orelhas pretas arredondadas */}
      <circle cx="11" cy="11" r="7" fill="#0F172A" />
      <circle cx="37" cy="11" r="7" fill="#0F172A" />
      <circle cx="11" cy="11" r="3.5" fill="#334155" />
      <circle cx="37" cy="11" r="3.5" fill="#334155" />
      {/* Cabeça branca rechonchuda */}
      <circle cx="24" cy="27" r="17" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* Manchas pretas ovais características dos olhos do panda */}
      <ellipse cx="17" cy="24" rx="5" ry="6" fill="#0F172A" transform="rotate(-15 17 24)" />
      <ellipse cx="31" cy="24" rx="5" ry="6" fill="#0F172A" transform="rotate(15 31 24)" />
      {/* Olhos com brilho meigo */}
      <circle cx="17.5" cy="23.5" r="2.2" fill="#FFFFFF" />
      <circle cx="30.5" cy="23.5" r="2.2" fill="#FFFFFF" />
      <circle cx="18" cy="23.5" r="1.5" fill="#0F172A" />
      <circle cx="30" cy="23.5" r="1.5" fill="#0F172A" />
      <circle cx="18.5" cy="23" r="0.6" fill="#FFFFFF" />
      <circle cx="29.5" cy="23" r="0.6" fill="#FFFFFF" />
      {/* Nariz triangular preto e focinho */}
      <ellipse cx="24" cy="32" rx="3" ry="2" fill="#0F172A" />
      <path d="M 21 34 Q 24 37 27 34" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Folha de bambu verde no canto da boca */}
      <path d="M 27 35 C 33 34 38 30 40 28 C 37 34 31 37 27 35 Z" fill="#22C55E" />
    </svg>
  );
};
