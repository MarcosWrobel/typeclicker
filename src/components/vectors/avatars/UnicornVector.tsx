import React from 'react';
import { AvatarVectorProps } from './types';

export const UnicornVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Unicórnio" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Círculo místico estelar rosa/violeta */}
      <circle cx="24" cy="24" r="20" fill="#4A044E" stroke="#E879F9" strokeWidth="1.5" />
      {/* Crina multicolorida mágica fluida */}
      <path d="M 12 18 C 8 26 10 38 18 42 C 14 36 12 28 16 22 Z" fill="#F472B6" />
      <path d="M 15 14 C 11 22 13 34 22 41 C 18 34 16 24 20 18 Z" fill="#C084FC" />
      <path d="M 19 11 C 16 18 17 28 26 38 C 22 30 21 21 24 16 Z" fill="#38BDF8" />
      {/* Cabeça do unicórnio branca em 3/4 */}
      <path d="M 22 14 C 27 12 35 15 38 22 C 40 27 38 34 32 36 L 24 37 C 20 34 19 28 20 22 Z" fill="#FDF4FF" stroke="#F0ABFC" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Orelha pontuda branca com interior rosa */}
      <polygon points="21,15 20,8 25,12" fill="#FDF4FF" stroke="#F0ABFC" strokeWidth="1" />
      <polygon points="21.5,13 21,9 24,11.5" fill="#F472B6" />
      {/* Chifre mágico espiralado dourado radiante */}
      <polygon points="25,12 37,2 29,15" fill="#FDE047" stroke="#EAB308" strokeWidth="1" strokeLinejoin="round" />
      <line x1="27" y1="12" x2="31" y2="10" stroke="#CA8A04" strokeWidth="1" />
      <line x1="29" y1="9" x2="33" y2="7" stroke="#CA8A04" strokeWidth="1" />
      <line x1="32" y1="6" x2="35" y2="4" stroke="#CA8A04" strokeWidth="1" />
      {/* Olho com cílios expressivos */}
      <ellipse cx="29" cy="22" rx="2.5" ry="3" fill="#A21CAF" />
      <circle cx="28.5" cy="21.5" r="1.5" fill="#F472B6" />
      <circle cx="28" cy="21" r="0.75" fill="#FFFFFF" />
      <path d="M 31 19 L 33 17" stroke="#701A75" strokeWidth="1.2" strokeLinecap="round" />
      {/* Focinho e bochecha rosada */}
      <circle cx="33" cy="27" r="2.5" fill="#FBCFE8" opacity="0.8" />
      <circle cx="36" cy="31" r="1" fill="#E879F9" />
    </svg>
  );
};
