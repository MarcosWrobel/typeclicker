import React from 'react';
import { GameCoverArtProps } from './TyperDashArt';

/**
 * Arte vetorial original para Math Storm no Estilo Cuphead (Animação Cartum Anos 1930 / Rubber-hose):
 * Ilha Inkwell com a Balança de Latão viva (sorridente com olhos de pacman),
 * nuvem de tempestade zangada arremessando raios e símbolos matemáticos cartunizados.
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
        {/* Papel Vintage Séria de Fundo */}
        <linearGradient id="ms-cup-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5caec9" />
          <stop offset="60%" stopColor="#96d4e7" />
          <stop offset="100%" stopColor="#faeac4" />
        </linearGradient>

        {/* Textura de Filme Antigo */}
        <filter id="ms-cup-grain" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" />
          <feComposite in="SourceGraphic" in2="noise" operator="over" />
        </filter>
      </defs>

      {/* 1. Céu Vintage de Desenho Animado */}
      <rect width="400" height="200" fill="url(#ms-cup-sky)" />

      {/* 2. Mar com Ondas Clássicas Anos 30 */}
      <rect y="145" width="400" height="55" fill="#3b788c" />
      <path
        d="M 0 150 Q 20 142 40 150 T 80 150 T 120 150 T 160 150 T 200 150 T 240 150 T 280 150 T 320 150 T 360 150 T 400 150"
        stroke="#24140b"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M 0 170 Q 20 164 40 170 T 80 170 T 120 170 T 160 170 T 200 170 T 240 170 T 280 170 T 320 170 T 360 170 T 400 170"
        stroke="#24140b"
        strokeWidth="2.5"
        strokeOpacity="0.4"
        fill="none"
      />

      {/* 3. Colina Verde da Ilha Cartunizada */}
      <path
        d="M 50 200 C 90 120, 310 120, 360 200 Z"
        fill="#98ce69"
        stroke="#24140b"
        strokeWidth="5"
      />
      {/* Camada de terra marrom da colina */}
      <path
        d="M 70 200 C 110 145, 290 145, 340 200 Z"
        fill="#c68a4c"
        stroke="#24140b"
        strokeWidth="4"
      />

      {/* 4. Nuvem Tempestuosa Zangada Estilo Rubber-Hose */}
      <g transform="translate(60, 25)">
        {/* Corpo da Nuvem */}
        <path
          d="M 20 35 C 5 35, -5 20, 5 10 C 15 -5, 40 -5, 50 10 C 60 -5, 90 0, 85 20 C 100 25, 95 45, 75 42 C 65 50, 40 50, 30 42 Z"
          fill="#475569"
          stroke="#24140b"
          strokeWidth="4"
        />
        {/* Olhos Raivosos da Nuvem Anos 30 */}
        <path d="M 30 18 L 42 24" stroke="#24140b" strokeWidth="3" strokeLinecap="round" />
        <path d="M 58 24 L 70 18" stroke="#24140b" strokeWidth="3" strokeLinecap="round" />
        <circle cx="38" cy="26" r="3.5" fill="#24140b" />
        <circle cx="62" cy="26" r="3.5" fill="#24140b" />
        {/* Boca franzida */}
        <path d="M 42 36 Q 50 30 58 36" stroke="#24140b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Raios Cartunizados Amarelos com Contorno Preto */}
      <polygon
        points="105,70 125,70 115,95 132,95 95,135 106,105 92,105"
        fill="#ffd95a"
        stroke="#24140b"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* 5. Balança Viva Cartunizada no Centro da Colina */}
      <g transform="translate(205, 90)">
        {/* Coluna Central com Sorriso Amigável */}
        <polygon points="-8,75 8,75 5,10 -5,10" fill="#d49742" stroke="#24140b" strokeWidth="4" />
        {/* Olhinhos no mastro da balança */}
        <circle cx="-3" cy="40" r="2.5" fill="#24140b" />
        <circle cx="3" cy="40" r="2.5" fill="#24140b" />
        {/* Boca sorrindo */}
        <path d="M -3 48 Q 0 52 3 48" stroke="#24140b" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Haste Horizontal Levemente Inclinada */}
        <rect
          x="-75"
          y="0"
          width="150"
          height="10"
          rx="5"
          fill="#ffd95a"
          stroke="#24140b"
          strokeWidth="3.5"
          transform="rotate(-6)"
        />

        {/* Prato Esquerdo com Caixa [x] */}
        <g transform="translate(-65, 12)">
          <line x1="0" y1="0" x2="-20" y2="40" stroke="#24140b" strokeWidth="2.5" />
          <line x1="0" y1="0" x2="20" y2="40" stroke="#24140b" strokeWidth="2.5" />
          <ellipse cx="0" cy="40" rx="22" ry="5" fill="#edd49e" stroke="#24140b" strokeWidth="3" />
          {/* Caixa Quântica [x] Roxa */}
          <rect
            x="-9"
            y="20"
            width="18"
            height="18"
            rx="4"
            fill="#9b59b6"
            stroke="#24140b"
            strokeWidth="2.5"
          />
          <text x="0" y="34" fill="#ffffff" fontFamily="serif" fontSize="13" fontWeight="bold" textAnchor="middle">
            x
          </text>
        </g>

        {/* Prato Direito com Peso [5kg] */}
        <g transform="translate(65, -2)">
          <line x1="0" y1="0" x2="-20" y2="40" stroke="#24140b" strokeWidth="2.5" />
          <line x1="0" y1="0" x2="20" y2="40" stroke="#24140b" strokeWidth="2.5" />
          <ellipse cx="0" cy="40" rx="22" ry="5" fill="#edd49e" stroke="#24140b" strokeWidth="3" />
          {/* Peso Verde */}
          <rect
            x="-8"
            y="24"
            width="16"
            height="15"
            rx="3"
            fill="#2ecc71"
            stroke="#24140b"
            strokeWidth="2.5"
          />
          <text x="0" y="35" fill="#24140b" fontFamily="serif" fontSize="9" fontWeight="bold" textAnchor="middle">
            5
          </text>
        </g>
      </g>

      {/* 6. Símbolos Matemáticos Anos 30 Flutuando com Luvas Brancas */}
      {/* Símbolo de Somatório ∑ com Expressão Viva */}
      <g transform="translate(320, 45)">
        <text
          x="0"
          y="0"
          fill="#ffd95a"
          stroke="#24140b"
          strokeWidth="3"
          fontFamily="serif"
          fontSize="44"
          fontWeight="bold"
          paintOrder="stroke fill"
        >
          ∑
        </text>
      </g>

      {/* Símbolo Pi π */}
      <g transform="translate(35, 120)">
        <text
          x="0"
          y="0"
          fill="#f39c12"
          stroke="#24140b"
          strokeWidth="2.5"
          fontFamily="serif"
          fontSize="34"
          fontWeight="bold"
          paintOrder="stroke fill"
        >
          π
        </text>
      </g>

      {/* 7. Moldura Externa de Quadrinho Clássico */}
      <rect
        x="3"
        y="3"
        width="394"
        height="194"
        rx="16"
        fill="none"
        stroke="#24140b"
        strokeWidth="6"
      />
    </svg>
  );
};
