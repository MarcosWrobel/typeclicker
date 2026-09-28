import React from 'react';
import { AvatarVectorProps } from './types';

export const CatCoderVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Gato Coder" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Base da cabeça com orelhas triangulares */}
      <path d="M 12 18 L 8 6 L 20 13 C 22.5 12 25.5 12 28 13 L 40 6 L 36 18 C 41 23 41 33 36 38 C 30 44 18 44 12 38 C 7 33 7 23 12 18 Z" fill="#334155" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
      {/* Interior rosado das orelhas */}
      <polygon points="11,10 13,16 17,14" fill="#F472B6" />
      <polygon points="37,10 35,16 31,14" fill="#F472B6" />
      {/* Arco do headset gamer sobre a cabeça */}
      <path d="M 8 23 C 8 13 40 13 40 23" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Almofadas do fone nas orelhas */}
      <rect x="5" y="21" width="5" height="9" rx="2.5" fill="#059669" />
      <rect x="38" y="21" width="5" height="9" rx="2.5" fill="#059669" />
      {/* Microfone do headset curvado para a boca */}
      <path d="M 8 28 C 8 35 15 36 19 36" stroke="#10B981" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="36" r="1.5" fill="#34D399" />
      {/* Olhos verdes luminosos em fenda */}
      <ellipse cx="18" cy="26" rx="3.5" ry="4" fill="#10B981" />
      <ellipse cx="30" cy="26" rx="3.5" ry="4" fill="#10B981" />
      <ellipse cx="18" cy="26" rx="1.2" ry="3.5" fill="#064E3B" />
      <ellipse cx="30" cy="26" rx="1.2" ry="3.5" fill="#064E3B" />
      <circle cx="19" cy="24.5" r="0.8" fill="#A7F3D0" />
      <circle cx="31" cy="24.5" r="0.8" fill="#A7F3D0" />
      {/* Focinho e bigodes */}
      <polygon points="24,31 22.5,29.5 25.5,29.5" fill="#F472B6" />
      <line x1="24" y1="31" x2="24" y2="33" stroke="#94A3B8" strokeWidth="1" />
      <path d="M 21 34 Q 24 35 27 34" stroke="#94A3B8" strokeWidth="1" fill="none" />
      {/* Bigodes */}
      <line x1="8" y1="30" x2="16" y2="31" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
      <line x1="8" y1="34" x2="16" y2="33" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
      <line x1="40" y1="30" x2="32" y2="31" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
      <line x1="40" y1="34" x2="32" y2="33" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
};
