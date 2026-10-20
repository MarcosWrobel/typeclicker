import React from 'react';
import { GameCoverArtProps } from './TyperDashArt';

/**
 * Arte vetorial original para Type: Radar:
 * Roguelite de Defesa Cibernética & Digitação Tática.
 * Retrata uma tela de radar tático militar holográfica em verde e ciano,
 * com retículo de escaneamento em rotação, mísseis/drones balísticos caindo
 * com alvos de digitação travados, explosão EMP e ativação dos poderes /NUKE e /FREEZE.
 */
export const TypeRadarArt: React.FC<GameCoverArtProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fundo Tático Sci-fi */}
        <radialGradient id="tr-bg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#082f49" />
          <stop offset="40%" stopColor="#041f33" />
          <stop offset="100%" stopColor="#020c14" />
        </radialGradient>

        {/* Gradiente da Varredura do Sonar */}
        <linearGradient id="tr-sweep" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#0891b2" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0e7490" stopOpacity="0" />
        </linearGradient>

        {/* Gradiente do Míssil Inimigo */}
        <linearGradient id="tr-missile" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>

        {/* Gradiente do Alvo Travado */}
        <linearGradient id="tr-target" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Filtros de Glow Tático */}
        <filter id="tr-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="tr-pulse" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Fundo do Radar */}
      <rect width="400" height="200" fill="url(#tr-bg)" />

      {/* Grade Tática Hexagonal / Coordenadas */}
      <g stroke="#0ea5e9" strokeWidth="0.8" strokeOpacity="0.15">
        <line x1="0" y1="50" x2="400" y2="50" />
        <line x1="0" y1="100" x2="400" y2="100" />
        <line x1="0" y1="150" x2="400" y2="150" />
        <line x1="80" y1="0" x2="80" y2="200" />
        <line x1="160" y1="0" x2="160" y2="200" />
        <line x1="240" y1="0" x2="240" y2="200" />
        <line x1="320" y1="0" x2="320" y2="200" />
      </g>

      {/* Círculos Concêntricos do Radar Central */}
      <g transform="translate(200, 100)">
        <circle cx="0" cy="0" r="25" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.3" fill="none" />
        <circle cx="0" cy="0" r="55" stroke="#06b6d4" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="4 4" fill="none" />
        <circle cx="0" cy="0" r="85" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
        <circle cx="0" cy="0" r="115" stroke="#0284c7" strokeWidth="1" strokeOpacity="0.25" fill="none" />

        {/* Linhas de Cruzamento dos Quadrantes */}
        <line x1="-120" y1="0" x2="120" y2="0" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.35" />
        <line x1="0" y1="-95" x2="0" y2="95" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.35" />

        {/* Feixe Rotativo de Varredura do Radar (Sonar Sweep) */}
        <path d="M 0 0 L 85 -70 A 115 115 0 0 1 115 0 Z" fill="url(#tr-sweep)" />
        <line x1="0" y1="0" x2="85" y2="-70" stroke="#38bdf8" strokeWidth="2" filter="url(#tr-glow)" />

        {/* Centro de Comando do Radar */}
        <circle cx="0" cy="0" r="5" fill="#38bdf8" filter="url(#tr-glow)" />
        <circle cx="0" cy="0" r="2" fill="#ffffff" />
      </g>

      {/* MÍSSIL BALÍSTICO 1 - DESCENDO COM ALVO TRAVADO */}
      <g transform="translate(100, 30) rotate(25)" filter="url(#tr-glow)">
        {/* Rastro de Fogo/Plasma */}
        <path d="M -4 -30 Q 0 -50 4 -30 L 0 -15 Z" fill="#fb923c" opacity="0.8" />
        <path d="M -2 -25 Q 0 -40 2 -25 L 0 -10 Z" fill="#fef08a" />
        {/* Corpo do Míssil */}
        <rect x="-4" y="-15" width="8" height="24" rx="2" fill="url(#tr-missile)" stroke="#fda4af" strokeWidth="1" />
        {/* Ogiva cônica */}
        <polygon points="-4,9 4,9 0,18" fill="#e11d48" />
        {/* Aletas */}
        <polygon points="-4,-10 -9,-14 -4,-6" fill="#be123c" />
        <polygon points="4,-10 9,-14 4,-6" fill="#be123c" />
      </g>

      {/* RETÍCULO DE MIRA HOLOGRÁFICA TRAVADA SOBRE O MÍSSIL 1 */}
      <g transform="translate(110, 48)" filter="url(#tr-glow)">
        <circle cx="0" cy="0" r="18" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 3" fill="none" />
        <line x1="-22" y1="0" x2="-14" y2="0" stroke="#38bdf8" strokeWidth="2" />
        <line x1="14" y1="0" x2="22" y2="0" stroke="#38bdf8" strokeWidth="2" />
        <line x1="0" y1="-22" x2="0" y2="-14" stroke="#38bdf8" strokeWidth="2" />
        <line x1="0" y1="14" x2="0" y2="22" stroke="#38bdf8" strokeWidth="2" />
        {/* Caixa de Texto da Palavra para Digitar */}
        <rect x="-32" y="24" width="64" height="18" rx="4" fill="#082f49" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1.2" />
        <text x="0" y="37" textAnchor="middle" fill="#38bdf8" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="1">
          FIREWALL
        </text>
      </g>

      {/* MÍSSIL BALÍSTICO 2 - ROTA DE COLISÃO À DIREITA */}
      <g transform="translate(295, 45) rotate(-20)" filter="url(#tr-glow)">
        {/* Rastro */}
        <path d="M -3 -25 Q 0 -45 3 -25 L 0 -12 Z" fill="#fb7185" opacity="0.8" />
        {/* Corpo */}
        <rect x="-4" y="-12" width="8" height="22" rx="2" fill="url(#tr-missile)" stroke="#f43f5e" strokeWidth="1" />
        <polygon points="-4,10 4,10 0,17" fill="#f43f5e" />
      </g>

      {/* RETÍCULO DE MIRA 2 */}
      <g transform="translate(295, 60)" filter="url(#tr-glow)">
        <circle cx="0" cy="0" r="16" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="5 3" fill="none" />
        {/* Caixa de Texto */}
        <rect x="-26" y="22" width="52" height="18" rx="4" fill="#4c0519" fillOpacity="0.9" stroke="#f43f5e" strokeWidth="1.2" />
        <text x="0" y="35" textAnchor="middle" fill="#fda4af" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="1">
          SHIELD
        </text>
      </g>

      {/* EXPLOSÃO EMP / CONGELAMENTO NO FUNDO INFERIOR */}
      <g transform="translate(200, 155)" filter="url(#tr-pulse)">
        <circle cx="0" cy="0" r="14" fill="#38bdf8" fillOpacity="0.2" />
        <line x1="-18" y1="-8" x2="18" y2="8" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="-18" y1="8" x2="18" y2="-8" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="0" y1="-20" x2="0" y2="20" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="4" fill="#e0f2fe" />
      </g>

      {/* PODERES TÁTICOS NA BASE: /NUKE e /FREEZE */}
      <g transform="translate(18, 158)" filter="url(#tr-glow)">
        <rect width="68" height="26" rx="6" fill="#881337" fillOpacity="0.85" stroke="#f43f5e" strokeWidth="1.5" />
        <text x="34" y="17" textAnchor="middle" fill="#ffe4e6" fontFamily="monospace" fontSize="10" fontWeight="900">
          /NUKE 💥
        </text>
      </g>

      <g transform="translate(314, 158)" filter="url(#tr-glow)">
        <rect width="68" height="26" rx="6" fill="#0c4a6e" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="34" y="17" textAnchor="middle" fill="#e0f2fe" fontFamily="monospace" fontSize="10" fontWeight="900">
          /FREEZE ❄️
        </text>
      </g>

      {/* Badge de Alerta Superior */}
      <g transform="translate(15, 18)" filter="url(#tr-glow)">
        <rect width="90" height="22" rx="11" fill="#082f49" fillOpacity="0.9" stroke="#06b6d4" strokeWidth="1.2" />
        <circle cx="14" cy="11" r="4" fill="#ef4444" className="animate-pulse" />
        <circle cx="14" cy="11" r="2" fill="#fca5a5" />
        <text x="52" y="15" textAnchor="middle" fill="#67e8f9" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="1">
          DEFESA ATIVA
        </text>
      </g>
    </svg>
  );
};
