import React from 'react';
import { AvatarVectorProps } from './types';

export const WizardVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Mago Geek" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Círculo místico de fundo */}
      <circle cx="24" cy="24" r="20" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1.5" />
      {/* Barba branca volumosa pontuda */}
      <path d="M 15 28 C 15 41 24 45 24 45 C 24 45 33 41 33 28 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
      {/* Rosto do mago */}
      <ellipse cx="24" cy="25" rx="8" ry="6" fill="#FDE68A" />
      {/* Óculos redondos tech */}
      <circle cx="20.5" cy="24" r="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.2" />
      <circle cx="27.5" cy="24" r="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.2" />
      <line x1="23.5" y1="24" x2="24.5" y2="24" stroke="#38BDF8" strokeWidth="1.2" />
      <circle cx="21" cy="23.5" r="1" fill="#38BDF8" />
      <circle cx="28" cy="23.5" r="1" fill="#38BDF8" />
      {/* Nariz redondo */}
      <ellipse cx="24" cy="27" rx="1.5" ry="1.2" fill="#F59E0B" />
      {/* Bigode estilizado sobre a barba */}
      <path d="M 24 28 C 20 28 17 31 16 33 C 20 31 24 30 24 30 C 24 30 28 31 32 33 C 31 31 28 28 24 28 Z" fill="#E2E8F0" />
      {/* Chapéu de mago cônico roxo */}
      <path d="M 24 4 L 35 20 L 13 20 Z" fill="#6366F1" stroke="#4F46E5" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Aba larga curvada do chapéu */}
      <ellipse cx="24" cy="20" rx="15" ry="3.5" fill="#4338CA" stroke="#3730A3" strokeWidth="1" />
      {/* Fita dourada no chapéu com estrela */}
      <path d="M 15 18 L 33 18 L 32 20 L 16 20 Z" fill="#F59E0B" />
      <polygon points="24,8 25,11 28,11 25.5,13 26.5,16 24,14 21.5,16 22.5,13 20,11 23,11" fill="#FDE047" />
    </svg>
  );
};
