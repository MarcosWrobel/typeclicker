import React from 'react';
import { motion } from 'framer-motion';

interface CupheadFilterProps {
  id?: string;
}

/**
 * Filtros SVG para reproduzir a estética rubber-hose anos 1930 / Cuphead:
 * Linhas com granulação de papel vintage, traços pretos expressivos e aberração cromática leve.
 */
export const CupheadFilter: React.FC<CupheadFilterProps> = ({ id = 'cuphead-filter' }) => {
  return (
    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
      <defs>
        {/* Grão de filme antigo e jitter de traço */}
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.5"
            xChannelSelector="R"
            yChannelSelector="G"
            result="distorted"
          />
          <feComposite in="SourceGraphic" in2="distorted" operator="over" />
        </filter>

        {/* Efeito de vinheta amarelada sépia de película */}
        <radialGradient id="cuphead-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#fffbeb" stopOpacity="0" />
          <stop offset="70%" stopColor="#d97706" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#451a03" stopOpacity="0.45" />
        </radialGradient>
      </defs>
    </svg>
  );
};
