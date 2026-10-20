import React from 'react';
import { GameCoverArtProps } from './TyperDashArt';

/**
 * Arte vetorial original para TypeClicker Classic:
 * Modo tático de digitação, mineração de Bytes e terminal cibernético.
 * Retrata o mascote Bytezinho sobre um teclado mecânico futurista de alta precisão,
 * cristais de Bytes flutuantes, códigos binários e rig neon em tons de esmeralda e ciano.
 */
export const TypeClickerArt: React.FC<GameCoverArtProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Gradiente de Fundo Matrix/Cyber */}
        <linearGradient id="tc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#041a14" />
          <stop offset="50%" stopColor="#062e24" />
          <stop offset="100%" stopColor="#02120e" />
        </linearGradient>

        {/* Gradiente do Teclado */}
        <linearGradient id="tc-kb" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f2b23" />
          <stop offset="100%" stopColor="#051712" />
        </linearGradient>

        {/* Gradiente das Teclas */}
        <linearGradient id="tc-key" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Gradiente do Bytezinho */}
        <linearGradient id="tc-byte" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Gradiente do Cristal de Byte */}
        <linearGradient id="tc-gem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Efeito Glow */}
        <filter id="tc-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="tc-pulse" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Fundo Cibernético */}
      <rect width="400" height="200" fill="url(#tc-bg)" />

      {/* Chuva de Códigos / Bits Binários no Fundo */}
      <g opacity="0.2" fontFamily="monospace" fontSize="9" fill="#10b981">
        <text x="30" y="25">01010110</text>
        <text x="30" y="42">const bytes</text>
        <text x="30" y="59">11001010</text>
        <text x="95" y="30">WPM:124</text>
        <text x="95" y="48">01110011</text>
        <text x="300" y="32">npm run mine</text>
        <text x="300" y="50">10101101</text>
        <text x="345" y="24">0100</text>
        <text x="345" y="42">MINE</text>
        <text x="345" y="60">1110</text>
      </g>

      {/* Grade de perspectiva no chão do terminal */}
      <path
        d="M -30 200 L 140 120 M 60 200 L 170 120 M 160 200 L 200 120 M 260 200 L 230 120 M 360 200 L 260 120 M 440 200 L 290 120"
        stroke="#10b981"
        strokeWidth="1"
        strokeOpacity="0.2"
      />

      {/* Feixe de Luz Central holográfico */}
      <polygon points="150,0 250,0 310,170 90,170" fill="#10b981" fillOpacity="0.05" />

      {/* Placa de Circuito / Traces Neon */}
      <g stroke="#34d399" strokeWidth="1.2" strokeOpacity="0.35" fill="none">
        <path d="M 10 90 L 50 90 L 70 110 L 110 110" />
        <circle cx="110" cy="110" r="2.5" fill="#34d399" />
        <path d="M 390 90 L 350 90 L 330 110 L 290 110" />
        <circle cx="290" cy="110" r="2.5" fill="#34d399" />
      </g>

      {/* O TECLADO MECÂNICO CIBERNÉTICO (Perspectiva Isométrica Inferior) */}
      <g transform="translate(45, 125)">
        {/* Carcaça do Teclado */}
        <polygon points="0,35 40,0 270,0 310,35 290,65 20,65" fill="url(#tc-kb)" stroke="#10b981" strokeWidth="1.5" />
        
        {/* Teclas em Linha (fileiras brilhantes estilo RGB tático) */}
        {/* Linha 1 */}
        <polygon points="46,6 64,6 58,16 40,16" fill="#047857" stroke="#34d399" strokeWidth="0.8" />
        <polygon points="68,6 86,6 80,16 62,16" fill="#047857" stroke="#34d399" strokeWidth="0.8" />
        <polygon points="90,6 108,6 102,16 84,16" fill="url(#tc-key)" stroke="#6ee7b7" strokeWidth="1" filter="url(#tc-glow)" />
        <polygon points="112,6 130,6 124,16 106,16" fill="#047857" stroke="#34d399" strokeWidth="0.8" />
        <polygon points="134,6 152,6 146,16 128,16" fill="#047857" stroke="#34d399" strokeWidth="0.8" />
        <polygon points="156,6 174,6 168,16 150,16" fill="url(#tc-key)" stroke="#6ee7b7" strokeWidth="1" filter="url(#tc-glow)" />
        <polygon points="178,6 196,6 190,16 172,16" fill="#047857" stroke="#34d399" strokeWidth="0.8" />
        <polygon points="200,6 218,6 212,16 194,16" fill="#047857" stroke="#34d399" strokeWidth="0.8" />
        <polygon points="222,6 240,6 234,16 216,16" fill="#047857" stroke="#34d399" strokeWidth="0.8" />
        <polygon points="244,6 262,6 256,16 238,16" fill="#047857" stroke="#34d399" strokeWidth="0.8" />

        {/* Linha 2 (Home Row) */}
        <polygon points="36,20 54,20 48,32 30,32" fill="#047857" stroke="#34d399" strokeWidth="0.8" />
        <polygon points="58,20 76,20 70,32 52,32" fill="url(#tc-key)" stroke="#6ee7b7" strokeWidth="1" filter="url(#tc-glow)" />
        <polygon points="80,20 98,20 92,32 74,32" fill="#047857" stroke="#34d399" strokeWidth="0.8" />
        <polygon points="102,20 120,20 114,32 96,32" fill="#047857" stroke="#34d399" strokeWidth="0.8" />
        {/* Barra de Espaço Cyber */}
        <polygon points="126,20 190,20 182,33 118,33" fill="url(#tc-key)" stroke="#a7f3d0" strokeWidth="1.2" filter="url(#tc-glow)" />
        <polygon points="196,20 214,20 208,32 190,32" fill="#047857" stroke="#34d399" strokeWidth="0.8" />
        <polygon points="220,20 238,20 232,32 214,32" fill="url(#tc-key)" stroke="#6ee7b7" strokeWidth="1" filter="url(#tc-glow)" />
        <polygon points="244,20 262,20 256,32 238,32" fill="#047857" stroke="#34d399" strokeWidth="0.8" />

        {/* Faixa LED sob o chassi */}
        <line x1="20" y1="65" x2="290" y2="65" stroke="#10b981" strokeWidth="3" filter="url(#tc-glow)" />
      </g>

      {/* O MASCOTE BYTEZINHO HACKER (Flutuando no centro, digitando com energia) */}
      <g transform="translate(160, 42)">
        {/* Sombra holográfica sob o mascote */}
        <ellipse cx="40" cy="88" rx="28" ry="6" fill="#10b981" fillOpacity="0.3" filter="url(#tc-glow)" />

        {/* Antena com esfera pulsante */}
        <line x1="40" y1="12" x2="40" y2="2" stroke="#6ee7b7" strokeWidth="2.5" />
        <circle cx="40" cy="2" r="4.5" fill="#34d399" stroke="#ecfdf5" strokeWidth="1.5" filter="url(#tc-glow)" />

        {/* Cabeça / Monitor do Bytezinho */}
        <rect x="14" y="12" width="52" height="42" rx="12" fill="url(#tc-byte)" stroke="#a7f3d0" strokeWidth="2.5" filter="url(#tc-glow)" />
        
        {/* Tela interna escura */}
        <rect x="20" y="18" width="40" height="30" rx="8" fill="#022c22" stroke="#059669" strokeWidth="1.2" />

        {/* Olhos cibernéticos expressivos (piscando foco máximo) */}
        <rect x="26" y="26" width="9" height="12" rx="3" fill="#6ee7b7" filter="url(#tc-glow)" />
        <rect x="45" y="26" width="9" height="12" rx="3" fill="#6ee7b7" filter="url(#tc-glow)" />
        <circle cx="30" cy="30" r="1.5" fill="#ffffff" />
        <circle cx="49" cy="30" r="1.5" fill="#ffffff" />

        {/* Sorriso simpático de código :] */}
        <path d="M 34 41 Q 40 44 46 41" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />

        {/* Fone de Ouvido Gamer Neon */}
        <path d="M 12 28 Q 40 4 68 28" stroke="#34d399" strokeWidth="3" fill="none" />
        <rect x="10" y="24" width="5" height="18" rx="2" fill="#047857" stroke="#6ee7b7" strokeWidth="1" />
        <rect x="65" y="24" width="5" height="18" rx="2" fill="#047857" stroke="#6ee7b7" strokeWidth="1" />

        {/* Mãozinhas digitando em ultra velocidade */}
        <ellipse cx="22" cy="62" rx="6" ry="4" fill="#34d399" stroke="#ecfdf5" strokeWidth="1.2" transform="rotate(-15 22 62)" />
        <ellipse cx="58" cy="62" rx="6" ry="4" fill="#34d399" stroke="#ecfdf5" strokeWidth="1.2" transform="rotate(15 58 62)" />

        {/* Linhas de digitação rápida */}
        <line x1="20" y1="68" x2="16" y2="76" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="60" y1="68" x2="64" y2="76" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="2 2" />
      </g>

      {/* CRISTAIS DE BYTES / CRIPTOMOEDA FLUTUANDO */}
      {/* Cristal 1 (Grande, à direita) */}
      <g transform="translate(305, 48)" filter="url(#tc-pulse)">
        <polygon points="20,0 35,16 20,38 5,16" fill="url(#tc-gem)" stroke="#a7f3d0" strokeWidth="1.5" />
        <polygon points="20,0 20,38 35,16" fill="#34d399" fillOpacity="0.6" />
        <polygon points="5,16 20,16 20,38" fill="#059669" fillOpacity="0.7" />
        {/* Letra B de Bytes gravada */}
        <text x="20" y="23" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="12" fontWeight="900">
          B
        </text>
      </g>

      {/* Cristal 2 (Menor, à esquerda) */}
      <g transform="translate(70, 42)" filter="url(#tc-glow)">
        <polygon points="12,0 22,10 12,24 2,10" fill="url(#tc-gem)" stroke="#a7f3d0" strokeWidth="1.2" />
        <polygon points="12,0 12,24 22,10" fill="#34d399" fillOpacity="0.5" />
        <text x="12" y="15" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="8" fontWeight="900">
          b
        </text>
      </g>

      {/* Badge de Nível e Multiplicador */}
      <g transform="translate(15, 18)" filter="url(#tc-glow)">
        <rect width="92" height="22" rx="11" fill="#042f2e" fillOpacity="0.85" stroke="#10b981" strokeWidth="1.2" />
        <circle cx="14" cy="11" r="4" fill="#10b981" />
        <circle cx="14" cy="11" r="2" fill="#a7f3d0" />
        <text x="52" y="15" textAnchor="middle" fill="#6ee7b7" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="1">
          BYTES ×10
        </text>
      </g>
    </svg>
  );
};
