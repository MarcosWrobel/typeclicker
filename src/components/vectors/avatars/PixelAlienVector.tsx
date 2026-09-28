import React from 'react';
import { AvatarVectorProps } from './types';

export const PixelAlienVector: React.FC<AvatarVectorProps> = ({ className = "w-full h-full", size, title = "Pixel Alien" }) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style} role="img" aria-label={title}>
      {/* Moldura CRT arcade escura */}
      <rect x="4" y="4" width="40" height="40" rx="8" fill="#18181B" stroke="#A855F7" strokeWidth="2" />
      {/* Grid de pixels do Alien Space Invaders (renderizado em blocos SVG nítidos) */}
      <g fill="#C084FC">
        {/* Antenas */}
        <rect x="14" y="10" width="3" height="4" />
        <rect x="31" y="10" width="3" height="4" />
        <rect x="17" y="14" width="3" height="3" />
        <rect x="28" y="14" width="3" height="3" />
        {/* Topo da cabeça */}
        <rect x="14" y="17" width="20" height="3" />
        {/* Linha dos olhos */}
        <rect x="11" y="20" width="26" height="3" />
        {/* Olhos (vazados) */}
        {/* Linha central da face */}
        <rect x="11" y="23" width="26" height="6" />
        {/* Boca e tentáculos superiores */}
        <rect x="8" y="23" width="3" height="9" />
        <rect x="37" y="23" width="3" height="9" />
        <rect x="14" y="29" width="6" height="3" />
        <rect x="28" y="29" width="6" height="3" />
        {/* Pernas / tentáculos inferiores */}
        <rect x="11" y="32" width="3" height="4" />
        <rect x="34" y="32" width="3" height="4" />
        <rect x="17" y="32" width="3" height="3" />
        <rect x="28" y="32" width="3" height="3" />
        <rect x="20" y="35" width="3" height="3" />
        <rect x="25" y="35" width="3" height="3" />
      </g>
      {/* Olhos brancos/pretos */}
      <rect x="17" y="20" width="3" height="3" fill="#18181B" />
      <rect x="28" y="20" width="3" height="3" fill="#18181B" />
    </svg>
  );
};
