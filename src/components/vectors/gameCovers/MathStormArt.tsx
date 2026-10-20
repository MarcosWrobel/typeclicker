import React from 'react';
import { GameCoverArtProps } from './TyperDashArt';

/**
 * Arte vetorial original para Math Storm:
 * Tempestade de cálculos matemáticos e raciocínio relâmpago!
 * Retrata um vórtice tempestuoso de plasma esmeralda e dourado,
 * símbolos matemáticos gigantes (∑, √x, π, ÷, ×) energizados por raios,
 * prisma numérico e medidor de sobrecarga digital.
 */
export const MathStormArt: React.FC<GameCoverArtProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fundo da Tempestade Verde / Esmeralda */}
        <radialGradient id="ms-bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="50%" stopColor="#022c22" />
          <stop offset="100%" stopColor="#01140e" />
        </radialGradient>

        {/* Gradiente do Raio da Tempestade */}
        <linearGradient id="ms-bolt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* Efeitos de Glow */}
        <filter id="ms-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="ms-storm" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Fundo */}
      <rect width="400" height="200" fill="url(#ms-bg)" />

      {/* Vórtice Circular da Tempestade */}
      <g transform="translate(200, 100)">
        <circle cx="0" cy="0" r="85" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="12 8" fill="none" />
        <circle cx="0" cy="0" r="60" stroke="#34d399" strokeWidth="1.2" strokeOpacity="0.3" strokeDasharray="8 6" fill="none" />
        <circle cx="0" cy="0" r="35" stroke="#6ee7b7" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
      </g>

      {/* RAIOS ELÉTRICOS DA TEMPESTADE */}
      <path
        d="M 120 0 L 150 55 L 135 65 L 180 115"
        stroke="url(#ms-bolt)"
        strokeWidth="2.5"
        filter="url(#ms-storm)"
      />
      <path
        d="M 280 0 L 255 45 L 270 55 L 220 115"
        stroke="url(#ms-bolt)"
        strokeWidth="2.5"
        filter="url(#ms-storm)"
      />

      {/* NÚCLEO / PRISMA MATEMÁTICO CENTRAL */}
      <g transform="translate(200, 105)" filter="url(#ms-storm)">
        {/* Losango / Prisma de Energia */}
        <polygon points="0,-32 28,0 0,32 -28,0" fill="#065f46" stroke="#a7f3d0" strokeWidth="2" />
        <polygon points="0,-32 0,32 28,0" fill="#10b981" fillOpacity="0.5" />
        <circle cx="0" cy="0" r="8" fill="#ffffff" filter="url(#ms-glow)" />
      </g>

      {/* SÍMBOLOS MATEMÁTICOS GIGANTES ENERGIZADOS FLUTUANDO */}
      {/* Símbolo do Somatório (∑) */}
      <g transform="translate(75, 75)" filter="url(#ms-glow)">
        <text x="0" y="0" fill="#34d399" fontFamily="serif" fontSize="38" fontWeight="bold">
          ∑
        </text>
      </g>

      {/* Símbolo de Raiz Quadrada (√x) */}
      <g transform="translate(60, 145)" filter="url(#ms-glow)">
        <text x="0" y="0" fill="#6ee7b7" fontFamily="monospace" fontSize="26" fontWeight="bold">
          √x²
        </text>
      </g>

      {/* Símbolo Pi (π) */}
      <g transform="translate(305, 75)" filter="url(#ms-glow)">
        <text x="0" y="0" fill="#34d399" fontFamily="serif" fontSize="36" fontWeight="bold">
          π
        </text>
      </g>

      {/* Equação / Multiplicação Rápida */}
      <g transform="translate(290, 145)" filter="url(#ms-glow)">
        <text x="0" y="0" fill="#facc15" fontFamily="monospace" fontSize="20" fontWeight="900">
          × 42 ÷
        </text>
      </g>

      {/* EQUAÇÃO RELÂMPAGO CENTRAL */}
      <g transform="translate(200, 168)" filter="url(#ms-glow)">
        <rect x="-65" y="-14" width="130" height="24" rx="12" fill="#022c22" fillOpacity="0.9" stroke="#10b981" strokeWidth="1.2" />
        <text x="0" y="3" textAnchor="middle" fill="#fef08a" fontFamily="monospace" fontSize="11" fontWeight="900">
          7 × 8 + 14 = 70
        </text>
      </g>

      {/* Faíscas elétricas de cálculo */}
      <circle cx="140" cy="110" r="2" fill="#fef08a" filter="url(#ms-glow)" />
      <circle cx="260" cy="110" r="2" fill="#fef08a" filter="url(#ms-glow)" />
      <circle cx="185" cy="50" r="2.5" fill="#a7f3d0" filter="url(#ms-glow)" />
      <circle cx="215" cy="50" r="2.5" fill="#a7f3d0" filter="url(#ms-glow)" />

      {/* Badge Superior "MATH STORM" */}
      <g transform="translate(15, 18)" filter="url(#ms-glow)">
        <rect width="98" height="22" rx="11" fill="#064e3b" fillOpacity="0.9" stroke="#34d399" strokeWidth="1.2" />
        <circle cx="14" cy="11" r="4" fill="#10b981" />
        <circle cx="14" cy="11" r="2" fill="#a7f3d0" />
        <text x="56" y="15" textAnchor="middle" fill="#d1fae5" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="1">
          MATH STORM
        </text>
      </g>
    </svg>
  );
};
