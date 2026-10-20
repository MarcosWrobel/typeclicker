import React from 'react';
import { GameCoverArtProps } from './TyperDashArt';

/**
 * Arte vetorial original para ScratchBot: Logic Quest:
 * Aprenda lógica de programação e algoritmos montando blocos visuais inspirados no Scratch!
 * Retrata o simpático robô Bytezinho navegando em um tabuleiro isométrico flutuante,
 * com blocos magnéticos de código Scratch (Quando Executar, Mova, Repita), esteiras e gemas.
 */
export const ScratchBotArt: React.FC<GameCoverArtProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fundo Espacial Tech Suave */}
        <linearGradient id="sb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1003" />
          <stop offset="50%" stopColor="#2c1a05" />
          <stop offset="100%" stopColor="#0d0801" />
        </linearGradient>

        {/* Gradiente do Robô Bytezinho */}
        <linearGradient id="sb-bot" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Gradiente da Gema */}
        <linearGradient id="sb-gem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Efeitos de Glow */}
        <filter id="sb-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="sb-star" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Fundo */}
      <rect width="400" height="200" fill="url(#sb-bg)" />

      {/* Partículas e Estrelas de Algoritmo */}
      <circle cx="40" cy="40" r="1.5" fill="#facc15" opacity="0.6" />
      <circle cx="110" cy="25" r="2" fill="#38bdf8" opacity="0.7" />
      <circle cx="330" cy="35" r="1.5" fill="#fb923c" opacity="0.8" />
      <circle cx="370" cy="80" r="1.8" fill="#4ade80" opacity="0.6" />

      {/* BLOCOS VISUAIS ESTILO SCRATCH (Flutuando à Esquerda em Pilha Magnética) */}
      <g transform="translate(30, 45)" filter="url(#sb-glow)">
        {/* Bloco 1: Quando Executar (Amarelo Scratch Hat Block) */}
        <g transform="translate(0, 0)">
          <path
            d="M 0 6 C 10 -2, 25 -2, 35 6 L 105 6 A 4 4 0 0 1 109 10 L 109 26 A 4 4 0 0 1 105 30 L 35 30 C 25 38, 10 38, 0 30 Z"
            fill="#eab308"
            stroke="#fef08a"
            strokeWidth="1.2"
          />
          <text x="50" y="20" textAnchor="middle" fill="#0f172a" fontFamily="monospace" fontSize="8" fontWeight="900">
            QUANDO EXECUTAR
          </text>
        </g>

        {/* Bloco 2: Repita 3x (Laranja Scratch C-Block) */}
        <g transform="translate(0, 28)">
          <path
            d="M 0 6 L 15 6 C 22 12, 32 12, 38 6 L 110 6 A 4 4 0 0 1 114 10 L 114 42 A 4 4 0 0 1 110 46 L 40 46 L 40 38 L 15 38 L 15 62 L 110 62 A 4 4 0 0 1 114 66 L 114 74 A 4 4 0 0 1 110 78 L 0 78 Z"
            fill="#f97316"
            stroke="#fed7aa"
            strokeWidth="1.2"
          />
          <text x="60" y="24" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="9" fontWeight="900">
            REPITA 3 VEZES
          </text>

          {/* Bloco Filho Aninhado dentro do Repita: Mova para Frente (Azul Scratch) */}
          <g transform="translate(18, 38)">
            <rect width="84" height="22" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
            <text x="42" y="15" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="8" fontWeight="bold">
              MOVA À FRENTE
            </text>
          </g>
        </g>

        {/* Bloco 3: Coletar Gema (Verde Scratch) */}
        <g transform="translate(0, 110)">
          <rect width="109" height="24" rx="4" fill="#059669" stroke="#6ee7b7" strokeWidth="1.2" />
          <text x="54" y="16" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="8" fontWeight="900">
            COLETAR GEMA 💎
          </text>
        </g>
      </g>

      {/* TABULEIRO ISOMÉTRICO FLUTUANTE (À Direita) */}
      <g transform="translate(255, 105)">
        {/* Tiles Isométricos (Grade 3x3) */}
        {/* Tile (0, 0) */}
        <polygon points="0,-30 35,-12 0,6 -35,-12" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
        {/* Tile (1, 0) */}
        <polygon points="35,-12 70,6 35,24 0,6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
        {/* Tile (0, 1) */}
        <polygon points="-35,-12 0,6 -35,24 -70,6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
        {/* Tile (1, 1) Central */}
        <polygon points="0,6 35,24 0,42 -35,24" fill="#334155" stroke="#f59e0b" strokeWidth="1.5" />
        {/* Tile (2, 1) - Esteira Neon */}
        <polygon points="35,24 70,42 35,60 0,42" fill="#0284c7" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1.5" />
        {/* Setas da Esteira */}
        <path d="M 25 38 L 45 48" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

        {/* PORTAL WARP / CHEGADA (Tile Superior) */}
        <g transform="translate(0, -12)" filter="url(#sb-glow)">
          <ellipse cx="0" cy="0" rx="16" ry="8" fill="#38bdf8" fillOpacity="0.4" />
          <ellipse cx="0" cy="0" rx="10" ry="5" fill="#e0f2fe" />
          <path d="M 0 -15 L 0 5" stroke="#38bdf8" strokeWidth="2" />
        </g>

        {/* GEMA DIAMANTE COLETÁVEL FLUTUANDO (Sobre Tile 1, 0) */}
        <g transform="translate(35, -4)" filter="url(#sb-glow)">
          <polygon points="0,-14 9,-5 0,8 -9,-5" fill="url(#sb-gem)" stroke="#d1fae5" strokeWidth="1" />
          <polygon points="0,-14 9,-5 0,0" fill="#6ee7b7" />
        </g>

        {/* ROBÔ BYTEZINHO EM AÇÃO (Sobre Tile Central 1,1) */}
        <g transform="translate(0, 14)">
          {/* Sombra sob o robô */}
          <ellipse cx="0" cy="18" rx="14" ry="6" fill="#000000" fillOpacity="0.5" />

          {/* Esteiras/Rodas do Robô */}
          <rect x="-14" y="10" width="8" height="12" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
          <rect x="6" y="10" width="8" height="12" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />

          {/* Corpo do Robô */}
          <rect x="-12" y="-12" width="24" height="22" rx="6" fill="url(#sb-bot)" stroke="#bae6fd" strokeWidth="1.5" filter="url(#sb-glow)" />

          {/* Visor / Tela do Robô */}
          <rect x="-9" y="-8" width="18" height="12" rx="4" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1" />

          {/* Olhinhos LED Felizes (Azul Brilhante) */}
          <circle cx="-4" cy="-2" r="2" fill="#38bdf8" filter="url(#sb-glow)" />
          <circle cx="4" cy="-2" r="2" fill="#38bdf8" filter="url(#sb-glow)" />
          <circle cx="-4" cy="-2" r="0.8" fill="#ffffff" />
          <circle cx="4" cy="-2" r="0.8" fill="#ffffff" />

          {/* Antena com esfera dourada de sinal */}
          <line x1="0" y1="-12" x2="0" y2="-19" stroke="#f59e0b" strokeWidth="1.5" />
          <circle cx="0" cy="-20" r="3" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" filter="url(#sb-glow)" />
        </g>
      </g>

      {/* Badge Superior "LÓGICA SCRATCH" */}
      <g transform="translate(15, 18)" filter="url(#sb-glow)">
        <rect width="108" height="22" rx="11" fill="#451a03" fillOpacity="0.9" stroke="#f59e0b" strokeWidth="1.2" />
        <circle cx="14" cy="11" r="4" fill="#f59e0b" />
        <circle cx="14" cy="11" r="2" fill="#fef08a" />
        <text x="60" y="15" textAnchor="middle" fill="#fed7aa" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="1">
          SCRATCH LOGIC
        </text>
      </g>
    </svg>
  );
};
