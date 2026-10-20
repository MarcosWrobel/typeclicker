import React from 'react';

export interface GameCoverArtProps {
  className?: string;
  glow?: boolean;
}

/**
 * Arte vetorial original para TyperDash:
 * Rhythm runner no estilo Geometry Dash!
 * Cubo veloz saltando sobre espinhos neon com teclas da linha guia (A S D F J K L),
 * trilha de luz, ondas de som a 130 BPM e estética synthwave eletrizante.
 */
export const TyperDashArt: React.FC<GameCoverArtProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Gradiente de fundo */}
        <linearGradient id="td-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#140826" />
          <stop offset="50%" stopColor="#250d42" />
          <stop offset="100%" stopColor="#0d041c" />
        </linearGradient>

        {/* Gradiente da pista */}
        <linearGradient id="td-floor" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {/* Gradiente do Cubo Herói */}
        <linearGradient id="td-cube" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Gradiente dos Espinhos */}
        <linearGradient id="td-spike" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>

        {/* Teclas Neon */}
        <linearGradient id="td-key" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Brilho Suave */}
        <filter id="td-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="td-hardglow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Fundo Espacial / Synthwave */}
      <rect width="400" height="200" fill="url(#td-bg)" />

      {/* Grade de perspectiva no chão */}
      <path
        d="M -50 200 L 150 145 M 50 200 L 180 145 M 150 200 L 210 145 M 250 200 L 240 145 M 350 200 L 270 145 M 450 200 L 300 145"
        stroke="#8b5cf6"
        strokeWidth="1"
        strokeOpacity="0.25"
      />
      <line x1="0" y1="165" x2="400" y2="165" stroke="#ec4899" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="0" y1="180" x2="400" y2="180" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.25" />

      {/* Sol / Equalizador Neon ao fundo */}
      <circle cx="200" cy="90" r="50" fill="#ec4899" fillOpacity="0.15" filter="url(#td-hardglow)" />
      <g opacity="0.4">
        <rect x="155" y="80" width="5" height="30" rx="2" fill="#ec4899" />
        <rect x="165" y="65" width="5" height="45" rx="2" fill="#f43f5e" />
        <rect x="175" y="50" width="5" height="60" rx="2" fill="#fbbf24" />
        <rect x="185" y="40" width="5" height="70" rx="2" fill="#38bdf8" />
        <rect x="195" y="35" width="5" height="75" rx="2" fill="#38bdf8" />
        <rect x="205" y="45" width="5" height="65" rx="2" fill="#fbbf24" />
        <rect x="215" y="60" width="5" height="50" rx="2" fill="#f43f5e" />
        <rect x="225" y="75" width="5" height="35" rx="2" fill="#ec4899" />
        <rect x="235" y="85" width="5" height="25" rx="2" fill="#a855f7" />
      </g>

      {/* Partículas de velocidade / Estrelas */}
      <circle cx="60" cy="40" r="1.5" fill="#fef08a" opacity="0.6" />
      <circle cx="120" cy="25" r="2" fill="#38bdf8" opacity="0.8" />
      <circle cx="320" cy="35" r="1.5" fill="#f43f5e" opacity="0.7" />
      <circle cx="370" cy="70" r="2" fill="#fbbf24" opacity="0.8" />

      {/* Piso Neon principal */}
      <rect x="0" y="145" width="400" height="55" fill="#090514" />
      <line x1="0" y1="145" x2="400" y2="145" stroke="url(#td-floor)" strokeWidth="3" filter="url(#td-glow)" />

      {/* Padrão de blocos no chão estilo Geometry Dash */}
      <g opacity="0.3">
        <rect x="20" y="152" width="30" height="30" rx="4" stroke="#a855f7" strokeWidth="1.5" />
        <rect x="28" y="160" width="14" height="14" rx="2" fill="#a855f7" />
        <rect x="120" y="152" width="30" height="30" rx="4" stroke="#a855f7" strokeWidth="1.5" />
        <rect x="128" y="160" width="14" height="14" rx="2" fill="#a855f7" />
        <rect x="220" y="152" width="30" height="30" rx="4" stroke="#a855f7" strokeWidth="1.5" />
        <rect x="228" y="160" width="14" height="14" rx="2" fill="#a855f7" />
        <rect x="320" y="152" width="30" height="30" rx="4" stroke="#a855f7" strokeWidth="1.5" />
        <rect x="328" y="160" width="14" height="14" rx="2" fill="#a855f7" />
      </g>

      {/* Espinhos Neon (Obstáculos mortais) */}
      <g filter="url(#td-glow)">
        <polygon points="180,145 192,118 204,145" fill="url(#td-spike)" stroke="#fda4af" strokeWidth="1.5" />
        <polygon points="204,145 216,118 228,145" fill="url(#td-spike)" stroke="#fda4af" strokeWidth="1.5" />
        <polygon points="340,145 352,115 364,145" fill="url(#td-spike)" stroke="#fda4af" strokeWidth="1.5" />
      </g>

      {/* Teclas flutuantes no ritmo (Linha Guia A S D F J K L) */}
      <g filter="url(#td-glow)">
        {/* Tecla F - plataforma de salto */}
        <g transform="translate(70, 110)">
          <rect width="28" height="24" rx="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="2" y="2" width="24" height="18" rx="3" fill="url(#td-key)" opacity="0.5" />
          <text x="14" y="17" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="13" fontWeight="900">
            F
          </text>
        </g>

        {/* Tecla J - ponto rítmico no ar */}
        <g transform="translate(250, 90)">
          <rect width="28" height="24" rx="5" fill="#7c3aed" stroke="#c084fc" strokeWidth="1.5" />
          <rect x="2" y="2" width="24" height="18" rx="3" fill="#9333ea" opacity="0.6" />
          <text x="14" y="17" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="13" fontWeight="900">
            J
          </text>
        </g>
      </g>

      {/* Trilha do Cubo / Rastro de salto hipersônico */}
      <path
        d="M 20 140 Q 60 135 84 110 Q 110 80 145 68"
        stroke="#f59e0b"
        strokeWidth="3"
        strokeDasharray="4 3"
        strokeOpacity="0.7"
      />
      <path
        d="M 145 68 Q 190 60 215 95"
        stroke="#ec4899"
        strokeWidth="3"
        strokeDasharray="4 3"
        strokeOpacity="0.5"
      />

      {/* Fantasmas / Rastro do Cubo */}
      <rect
        x="95"
        y="88"
        width="26"
        height="26"
        rx="5"
        fill="#f59e0b"
        fillOpacity="0.25"
        transform="rotate(-15 108 101)"
      />
      <rect
        x="120"
        y="72"
        width="28"
        height="28"
        rx="5"
        fill="#f59e0b"
        fillOpacity="0.45"
        transform="rotate(-25 134 86)"
      />

      {/* O CUBO HERÓI (em pleno salto aéreo triunfante) */}
      <g transform="translate(142, 54) rotate(-35 18 18)" filter="url(#td-glow)">
        {/* Corpo principal do Cubo */}
        <rect width="36" height="36" rx="7" fill="url(#td-cube)" stroke="#fef08a" strokeWidth="2.5" />
        
        {/* Borda interna geométrica estilo GD */}
        <rect x="5" y="5" width="26" height="26" rx="4" fill="#d97706" stroke="#fbbf24" strokeWidth="1.5" />

        {/* Olhos determinados e boca robô/gamer */}
        <circle cx="13" cy="14" r="3.5" fill="#0f172a" />
        <circle cx="23" cy="14" r="3.5" fill="#0f172a" />
        <circle cx="14" cy="13" r="1.2" fill="#ffffff" />
        <circle cx="24" cy="13" r="1.2" fill="#ffffff" />

        {/* Sorriso confiante / óculos neon */}
        <path d="M 12 24 Q 18 28 24 24" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Fone gamer neon */}
        <rect x="-2" y="11" width="4" height="14" rx="2" fill="#06b6d4" />
        <rect x="34" y="11" width="4" height="14" rx="2" fill="#06b6d4" />
        <path d="M 2 11 Q 18 3 34 11" stroke="#06b6d4" strokeWidth="2.5" fill="none" />
      </g>

      {/* Badge de Batida Rítmica "130 BPM" */}
      <g transform="translate(15, 18)" filter="url(#td-glow)">
        <rect width="82" height="22" rx="11" fill="#0f172a" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1.2" />
        <circle cx="14" cy="11" r="4" fill="#ef4444" />
        <circle cx="14" cy="11" r="2" fill="#fca5a5" />
        <text x="48" y="15" textAnchor="middle" fill="#fbbf24" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="1">
          130 BPM
        </text>
      </g>

      {/* Efeito de Impacto Rítmico / Shockwave */}
      <circle cx="84" cy="122" r="16" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
      <circle cx="84" cy="122" r="24" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" fill="none" />
    </svg>
  );
};
