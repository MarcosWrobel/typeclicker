import React from 'react';
import { AvatarVectorProps } from './types';

export const FoxVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Raposa" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Orelhas pontudas de raposa com ponta preta */}
      <polygon points="10,22 6,4 20,14" fill="#EA580C" stroke="#C2410C" strokeWidth="1.5" />
      <polygon points="7.5,7 6,4 12,9" fill="#0F172A" />
      <polygon points="10,18 10,10 16,15" fill="#F8FAFC" />
      <polygon points="38,22 42,4 28,14" fill="#EA580C" stroke="#C2410C" strokeWidth="1.5" />
      <polygon points="40.5,7 42,4 36,9" fill="#0F172A" />
      <polygon points="38,18 38,10 32,15" fill="#F8FAFC" />
      {/* Cabeça geométrica laranja */}
      <polygon points="12,18 36,18 42,28 24,42 6,28" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Bochechas brancas triangulares */}
      <polygon points="6,28 17,28 24,42" fill="#F8FAFC" />
      <polygon points="42,28 31,28 24,42" fill="#F8FAFC" />
      {/* Olhos puxados e atentos */}
      <path d="M 12 24 Q 17 21 21 24" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 36 24 Q 31 21 27 24" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="17" cy="25" r="1.5" fill="#0F172A" />
      <circle cx="31" cy="25" r="1.5" fill="#0F172A" />
      <circle cx="16.5" cy="24.5" r="0.5" fill="#FFFFFF" />
      <circle cx="30.5" cy="24.5" r="0.5" fill="#FFFFFF" />
      {/* Focinho preto pontudo */}
      <polygon points="21.5,39 26.5,39 24,42" fill="#0F172A" />
    </svg>
  );
};
