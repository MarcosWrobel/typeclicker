import React from 'react';
import { GameCoverArtProps } from './TyperDashArt';

/**
 * Arte vetorial original para SyntaxMaze:
 * Navegue por um labirinto onde cada porta exige corrigir um bug de sintaxe em JS/Python.
 * Retrata muros de labirinto volumétricos em neon carmesim e rosa, scanner holográfico,
 * portas bloqueadas com "SyntaxError" e rota liberada com a chave de correção correta.
 */
export const SyntaxMazeArt: React.FC<GameCoverArtProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fundo do Labirinto Carmesim */}
        <radialGradient id="sm-bg" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor="#4c0519" />
          <stop offset="50%" stopColor="#2b030e" />
          <stop offset="100%" stopColor="#100105" />
        </radialGradient>

        {/* Gradiente das Paredes do Labirinto */}
        <linearGradient id="sm-wall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#be123c" />
          <stop offset="100%" stopColor="#4c0519" />
        </linearGradient>

        {/* Efeitos de Glow */}
        <filter id="sm-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="sm-matrix" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Fundo */}
      <rect width="400" height="200" fill="url(#sm-bg)" />

      {/* Grade de Labirinto Isométrico no Chão */}
      <path
        d="M -30 200 L 140 120 M 60 200 L 170 120 M 160 200 L 200 120 M 260 200 L 230 120 M 360 200 L 260 120 M 440 200 L 290 120"
        stroke="#f43f5e"
        strokeWidth="1"
        strokeOpacity="0.2"
      />

      {/* PAREDES NEON DO LABIRINTO (Perspectiva 3D) */}
      {/* Bloco de Parede Esquerda */}
      <g transform="translate(40, 70)" filter="url(#sm-glow)">
        <polygon points="0,30 25,12 85,12 60,30" fill="#9f1239" stroke="#fda4af" strokeWidth="1" />
        <polygon points="0,30 60,30 60,75 0,75" fill="url(#sm-wall)" stroke="#fda4af" strokeWidth="1" />
        <polygon points="60,30 85,12 85,57 60,75" fill="#881337" stroke="#fda4af" strokeWidth="1" />
        {/* Código gravado na parede */}
        <text x="30" y="55" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="9" fontWeight="bold">
          def bug():
        </text>
      </g>

      {/* Bloco de Parede Direita */}
      <g transform="translate(265, 70)" filter="url(#sm-glow)">
        <polygon points="0,30 25,12 85,12 60,30" fill="#9f1239" stroke="#fda4af" strokeWidth="1" />
        <polygon points="0,30 60,30 60,75 0,75" fill="url(#sm-wall)" stroke="#fda4af" strokeWidth="1" />
        <polygon points="60,30 85,12 85,57 60,75" fill="#881337" stroke="#fda4af" strokeWidth="1" />
        {/* Código */}
        <text x="30" y="55" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="9" fontWeight="bold">
          return ;
        </text>
      </g>

      {/* PORTAL DO LABIRINTO (Centro - Saída com Chave de Correção) */}
      <g transform="translate(160, 48)" filter="url(#sm-glow)">
        {/* Arco do Portal de Saída */}
        <path
          d="M 0 95 L 0 30 A 40 40 0 0 1 80 30 L 80 95 Z"
          fill="#10b981"
          fillOpacity="0.15"
          stroke="#10b981"
          strokeWidth="2.5"
        />
        {/* Chave de Correção de Sintaxe (Chaves Verdes Corretas) */}
        <text x="40" y="60" textAnchor="middle" fill="#34d399" fontFamily="monospace" fontSize="28" fontWeight="900" filter="url(#sm-matrix)">
          &#123; &#125;
        </text>
        <text x="40" y="80" textAnchor="middle" fill="#a7f3d0" fontFamily="monospace" fontSize="8" fontWeight="bold">
          CORRECTED
        </text>
      </g>

      {/* DRONE SCANNER DEPURADOR (Flutuando no Corredor) */}
      <g transform="translate(200, 142)" filter="url(#sm-glow)">
        {/* Feixe de Luz do Scanner iluminando o chão */}
        <polygon points="-8,-4 8,-4 35,32 -35,32" fill="#38bdf8" fillOpacity="0.2" />

        {/* Corpo do Drone */}
        <ellipse cx="0" cy="-6" rx="16" ry="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        
        {/* Lente do Scanner */}
        <circle cx="0" cy="-4" r="3.5" fill="#38bdf8" filter="url(#sm-glow)" />
        <circle cx="0" cy="-4" r="1.5" fill="#ffffff" />

        {/* Pequenas Hélices / Asas */}
        <line x1="-22" y1="-9" x2="-10" y2="-7" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="10" y1="-7" x2="22" y2="-9" stroke="#38bdf8" strokeWidth="1.5" />
      </g>

      {/* ALERTA DE ERRO FLUTUANTE "SyntaxError" */}
      <g transform="translate(200, 24)" filter="url(#sm-glow)">
        <rect x="-65" y="-12" width="130" height="22" rx="6" fill="#881337" fillOpacity="0.9" stroke="#f43f5e" strokeWidth="1.2" />
        <text x="0" y="3" textAnchor="middle" fill="#ffe4e6" fontFamily="monospace" fontSize="9" fontWeight="900">
          SyntaxError: missing &#125;
        </text>
      </g>

      {/* Badge Superior "SYNTAX MAZE" */}
      <g transform="translate(15, 18)" filter="url(#sm-glow)">
        <rect width="102" height="22" rx="11" fill="#4c0519" fillOpacity="0.9" stroke="#f43f5e" strokeWidth="1.2" />
        <circle cx="14" cy="11" r="4" fill="#f43f5e" />
        <circle cx="14" cy="11" r="2" fill="#fecdd3" />
        <text x="58" y="15" textAnchor="middle" fill="#fda4af" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="1">
          SYNTAX MAZE
        </text>
      </g>
    </svg>
  );
};
