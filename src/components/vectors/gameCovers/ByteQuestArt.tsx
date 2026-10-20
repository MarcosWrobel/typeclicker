import React from 'react';
import { GameCoverArtProps } from './TyperDashArt';

/**
 * Arte vetorial original para ByteQuest:
 * Roguelite Combat Runner (estilo Vampire Survivors + Castlevania).
 * Retrata o herói correndo em alta velocidade no castelo sombrio, fatiando hordas
 * com arco de corte de energia violeta, orbes mágicos orbitando ao redor,
 * relâmpagos caindo e esqueletos espectrais sendo pulverizados em poeira estelar.
 */
export const ByteQuestArt: React.FC<GameCoverArtProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fundo Noturno Gótico Sombrio */}
        <radialGradient id="bq-bg" cx="40%" cy="40%" r="80%">
          <stop offset="0%" stopColor="#2e1065" />
          <stop offset="50%" stopColor="#1e0847" />
          <stop offset="100%" stopColor="#090117" />
        </radialGradient>

        {/* Gradiente da Lua Sangrenta / Mística */}
        <radialGradient id="bq-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="60%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7e22ce" />
        </radialGradient>

        {/* Gradiente do Arco de Corte da Espada */}
        <linearGradient id="bq-slash" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#c084fc" />
          <stop offset="80%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6b21a8" stopOpacity="0" />
        </linearGradient>

        {/* Efeitos de Glow */}
        <filter id="bq-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="bq-slashglow" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Fundo do Castelo Sombrio */}
      <rect width="400" height="200" fill="url(#bq-bg)" />

      {/* Lua Mística Violeta ao Fundo */}
      <circle cx="280" cy="55" r="38" fill="url(#bq-moon)" opacity="0.45" filter="url(#bq-glow)" />
      
      {/* Silhueta de Torres de Castelo Gótico */}
      <g fill="#090117" opacity="0.6">
        <polygon points="210,130 220,70 230,130" />
        <polygon points="250,130 265,50 280,130" />
        <polygon points="310,130 325,65 340,130" />
        <rect x="200" y="110" width="160" height="40" />
      </g>

      {/* Chão de Pedras e Chamas da Masmorra */}
      <polygon points="0,200 400,200 400,150 0,150" fill="#090117" />
      <line x1="0" y1="150" x2="400" y2="150" stroke="#7e22ce" strokeWidth="2" filter="url(#bq-glow)" />

      {/* RELÂMPAGO MÁGICO / FEITIÇO CAINDO DO CÉU */}
      <path
        d="M 230 0 L 220 50 L 235 65 L 215 130"
        stroke="#e879f9"
        strokeWidth="2.5"
        filter="url(#bq-glow)"
      />

      {/* HORDAS INIMIGAS (À Direita - Morcegos e Monstros Sombrios sendo atingidos) */}
      {/* Morcego Sombrio 1 */}
      <g transform="translate(290, 85) scale(0.9)" filter="url(#bq-glow)">
        <path d="M 0 0 Q -15 -12 -25 0 Q -10 5 0 2 Q 10 5 25 0 Q 15 -12 0 0 Z" fill="#86198f" />
        <circle cx="-3" cy="-1" r="1.5" fill="#f43f5e" />
        <circle cx="3" cy="-1" r="1.5" fill="#f43f5e" />
      </g>
      {/* Morcego Sombrio 2 */}
      <g transform="translate(340, 110) scale(1.1)" filter="url(#bq-glow)">
        <path d="M 0 0 Q -15 -12 -25 0 Q -10 5 0 2 Q 10 5 25 0 Q 15 -12 0 0 Z" fill="#701a75" />
        <circle cx="-3" cy="-1" r="1.5" fill="#ef4444" />
        <circle cx="3" cy="-1" r="1.5" fill="#ef4444" />
      </g>
      {/* Esqueleto Sombrio sendo esmagado */}
      <g transform="translate(260, 142)">
        <circle cx="0" cy="0" r="7" fill="#6b21a8" stroke="#d8b4fe" strokeWidth="1" />
        <circle cx="-2" cy="-1" r="1.5" fill="#ef4444" />
        <circle cx="2" cy="-1" r="1.5" fill="#ef4444" />
      </g>

      {/* O HERÓI ROGUELITE EM CORRIDA E ATAQUE (À Esquerda) */}
      <g transform="translate(110, 105)">
        {/* Capa Violeta Esvoaçante ao Vento de Velocidade */}
        <path
          d="M -5 15 Q -40 8 -55 35 Q -30 45 -10 25 Z"
          fill="#9333ea"
          filter="url(#bq-glow)"
        />

        {/* Corpo / Armadura em Posição de Corrida Dinâmica */}
        <polygon points="0,5 18,12 10,38 -8,32" fill="#1e1b4b" stroke="#c084fc" strokeWidth="1.5" />
        
        {/* Cabeça do Herói */}
        <circle cx="12" cy="0" r="9" fill="#0f172a" stroke="#c084fc" strokeWidth="1.5" />
        {/* Cabelo e Faixa de Batalha Neon */}
        <path d="M 5 -3 Q 12 -12 20 -4" stroke="#a855f7" strokeWidth="3" fill="none" />
        <circle cx="15" cy="0" r="2" fill="#38bdf8" filter="url(#bq-glow)" />

        {/* Braço e Empunhadura da Espada */}
        <line x1="8" y1="18" x2="26" y2="12" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />

        {/* Espada Arcana */}
        <line x1="26" y1="12" x2="52" y2="-5" stroke="#ffffff" strokeWidth="2.5" filter="url(#bq-glow)" />

        {/* ORBES MÁGICOS GIRATÓRIOS (Habilidade Passiva Vampire Survivors) */}
        <circle cx="-15" cy="-8" r="6" fill="#38bdf8" filter="url(#bq-glow)" />
        <circle cx="-15" cy="-8" r="2.5" fill="#ffffff" />
        
        <circle cx="28" cy="42" r="6" fill="#f43f5e" filter="url(#bq-glow)" />
        <circle cx="28" cy="42" r="2.5" fill="#ffffff" />
      </g>

      {/* O ARCO DE CORTE DA ESPADA (SLASH DE ENERGIA MASSIVO) */}
      <path
        d="M 140 70 A 70 70 0 0 1 245 130"
        stroke="url(#bq-slash)"
        strokeWidth="9"
        strokeLinecap="round"
        filter="url(#bq-slashglow)"
      />
      <path
        d="M 140 70 A 70 70 0 0 1 245 130"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Partículas de Dano e Fragmentos de Almas Sombrias */}
      <circle cx="230" cy="95" r="2.5" fill="#f472b6" filter="url(#bq-glow)" />
      <circle cx="245" cy="85" r="2" fill="#e879f9" filter="url(#bq-glow)" />
      <circle cx="220" cy="120" r="2" fill="#38bdf8" filter="url(#bq-glow)" />
      <circle cx="255" cy="115" r="3" fill="#facc15" filter="url(#bq-glow)" />

      {/* Badge Superior "COMBAT RUNNER" */}
      <g transform="translate(15, 18)" filter="url(#bq-glow)">
        <rect width="105" height="22" rx="11" fill="#3b0764" fillOpacity="0.9" stroke="#a855f7" strokeWidth="1.2" />
        <circle cx="14" cy="11" r="4" fill="#c084fc" />
        <circle cx="14" cy="11" r="2" fill="#ffffff" />
        <text x="58" y="15" textAnchor="middle" fill="#f3e8ff" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="1">
          COMBAT RUNNER
        </text>
      </g>
    </svg>
  );
};
