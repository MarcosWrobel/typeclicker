import React from 'react';
import { AvatarVectorProps } from './types';

export const RobotVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Robô Byte" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Antena com esfera brilhante */}
      <line x1="24" y1="4" x2="24" y2="10" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="4" r="2.5" fill="#22D3EE" stroke="#0891B2" strokeWidth="1" />
      {/* Orelhas / parafusos laterais */}
      <rect x="5" y="21" width="3" height="8" rx="1.5" fill="#0891B2" />
      <rect x="40" y="21" width="3" height="8" rx="1.5" fill="#0891B2" />
      {/* Cabeça do robô */}
      <rect x="8" y="10" width="32" height="28" rx="6" fill="#1E293B" stroke="#06B6D4" strokeWidth="2" />
      {/* Visor digital escuro */}
      <rect x="12" y="15" width="24" height="12" rx="4" fill="#0F172A" stroke="#0891B2" strokeWidth="1" />
      {/* Olhos neon ciano */}
      <circle cx="18" cy="21" r="3" fill="#22D3EE" />
      <circle cx="30" cy="21" r="3" fill="#22D3EE" />
      <circle cx="17.5" cy="20" r="1" fill="#FFFFFF" />
      <circle cx="29.5" cy="20" r="1" fill="#FFFFFF" />
      {/* Grade de áudio / boca */}
      <line x1="16" y1="32" x2="32" y2="32" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
      {/* Rebites nos cantos */}
      <circle cx="11" cy="13" r="1" fill="#64748B" />
      <circle cx="37" cy="13" r="1" fill="#64748B" />
      <circle cx="11" cy="35" r="1" fill="#64748B" />
      <circle cx="37" cy="35" r="1" fill="#64748B" />
    </svg>
  );
};
