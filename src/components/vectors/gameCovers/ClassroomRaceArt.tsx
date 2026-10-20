import React from 'react';
import { GameCoverArtProps } from './TyperDashArt';

/**
 * Arte vetorial original para Corrida Sincronizada:
 * Disputa de digitação em tempo real em sala de aula.
 * Retrata uma pista suspensa futurista de hipervelocidade, hover-karts/naves
 * disputando roda a roda lado a lado com nitro e faíscas, bandeira quadriculada
 * holográfica e troféu dourado de campeão da turma.
 */
export const ClassroomRaceArt: React.FC<GameCoverArtProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fundo da Pista Noturna */}
        <linearGradient id="cr-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a0c02" />
          <stop offset="50%" stopColor="#2c1404" />
          <stop offset="100%" stopColor="#0d0501" />
        </linearGradient>

        {/* Gradiente da Pista de Corrida */}
        <linearGradient id="cr-track" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>

        {/* Gradiente do Kart 1 (Laranja/Dourado) */}
        <linearGradient id="cr-kart1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Gradiente do Kart 2 (Ciano/Azul) */}
        <linearGradient id="cr-kart2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Efeitos de Glow */}
        <filter id="cr-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="cr-speed" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Fundo Espacial / Pista Noturna */}
      <rect width="400" height="200" fill="url(#cr-bg)" />

      {/* Linhas de Horizonte e Luzes da Cidade Futurista */}
      <g opacity="0.3">
        <polygon points="40,110 55,80 70,110" fill="#f59e0b" />
        <polygon points="75,110 95,65 115,110" fill="#ef4444" />
        <polygon points="280,110 300,70 320,110" fill="#f59e0b" />
        <polygon points="325,110 345,85 365,110" fill="#ef4444" />
      </g>

      {/* Holofotes de Celebração cruzando o céu */}
      <polygon points="120,200 160,0 180,0 140,200" fill="#f59e0b" fillOpacity="0.08" />
      <polygon points="280,200 240,0 220,0 260,200" fill="#38bdf8" fillOpacity="0.08" />

      {/* A PISTA DE CORRIDA SUSPENSA EM PERSPECTIVA */}
      <polygon points="0,200 400,200 250,110 150,110" fill="#120803" stroke="#f59e0b" strokeWidth="2" />

      {/* Linhas de Faixa da Pista */}
      <path d="M 200 110 L 200 200" stroke="#fef08a" strokeWidth="3" strokeDasharray="16 12" />
      <line x1="150" y1="110" x2="0" y2="200" stroke="#f59e0b" strokeWidth="3" filter="url(#cr-glow)" />
      <line x1="250" y1="110" x2="400" y2="200" stroke="#f59e0b" strokeWidth="3" filter="url(#cr-glow)" />

      {/* BANDEIRA QUADRICULADA HOLOGRÁFICA (Linha de Chegada Flutuante) */}
      <g transform="translate(145, 45)" filter="url(#cr-glow)">
        {/* Pórtico da Linha de Chegada */}
        <line x1="0" y1="65" x2="0" y2="5" stroke="#f59e0b" strokeWidth="3" />
        <line x1="110" y1="65" x2="110" y2="5" stroke="#f59e0b" strokeWidth="3" />
        <line x1="0" y1="10" x2="110" y2="10" stroke="#ffffff" strokeWidth="2" />
        
        {/* Bandeira Quadriculada estilizada */}
        <g transform="translate(10, 12)">
          <rect x="0" y="0" width="15" height="10" fill="#ffffff" />
          <rect x="15" y="0" width="15" height="10" fill="#0f172a" />
          <rect x="30" y="0" width="15" height="10" fill="#ffffff" />
          <rect x="45" y="0" width="15" height="10" fill="#0f172a" />
          <rect x="60" y="0" width="15" height="10" fill="#ffffff" />
          <rect x="75" y="0" width="15" height="10" fill="#0f172a" />

          <rect x="0" y="10" width="15" height="10" fill="#0f172a" />
          <rect x="15" y="10" width="15" height="10" fill="#ffffff" />
          <rect x="30" y="10" width="15" height="10" fill="#0f172a" />
          <rect x="45" y="10" width="15" height="10" fill="#ffffff" />
          <rect x="60" y="10" width="15" height="10" fill="#0f172a" />
          <rect x="75" y="10" width="15" height="10" fill="#ffffff" />
        </g>
      </g>

      {/* HOVER-KART 1 (Lado Esquerdo - Cor Dourada / Laranja) */}
      <g transform="translate(90, 135)">
        {/* Rastro de Chamas Nitro do Escape */}
        <polygon points="-25,12 0,6 0,18" fill="#f97316" filter="url(#cr-glow)" />
        <polygon points="-40,12 -10,9 -10,15" fill="#fef08a" filter="url(#cr-speed)" />

        {/* Chassi Aerodinâmico da Nave */}
        <polygon points="0,5 50,0 75,12 50,24 0,19" fill="url(#cr-kart1)" stroke="#fef08a" strokeWidth="1.5" />
        
        {/* Cockpit / Para-brisa Ciano */}
        <polygon points="25,4 45,3 40,12 20,12" fill="#38bdf8" />
        
        {/* Turbina Lateral e Luz */}
        <rect x="10" y="20" width="30" height="5" rx="2" fill="#d97706" />
        <circle cx="70" cy="12" r="3" fill="#ffffff" filter="url(#cr-glow)" />
      </g>

      {/* HOVER-KART 2 (Lado Direito - Cor Ciano / Azul Elétrico disputando na ponta) */}
      <g transform="translate(230, 142)">
        {/* Rastro Nitro Azul */}
        <polygon points="90,12 65,6 65,18" fill="#0284c7" filter="url(#cr-glow)" />
        <polygon points="105,12 75,9 75,15" fill="#bae6fd" filter="url(#cr-speed)" />

        {/* Chassi Espelhado para frente */}
        <polygon points="65,5 15,0 -10,12 15,24 65,19" fill="url(#cr-kart2)" stroke="#bae6fd" strokeWidth="1.5" />
        
        {/* Cockpit */}
        <polygon points="40,4 20,3 25,12 45,12" fill="#fef08a" />
        
        {/* Farol Dianteiro */}
        <circle cx="-5" cy="12" r="3" fill="#ffffff" filter="url(#cr-glow)" />
      </g>

      {/* TROFÉU DOURADO FLUTUANDO NO PÓRTICO */}
      <g transform="translate(200, 32)" filter="url(#cr-glow)">
        <polygon points="-8,-8 8,-8 6,2 -6,2" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
        <line x1="0" y1="2" x2="0" y2="7" stroke="#ca8a04" strokeWidth="2" />
        <rect x="-5" y="7" width="10" height="3" fill="#fde047" />
        <circle cx="0" cy="-3" r="2" fill="#ffffff" />
      </g>

      {/* Badge Superior "SALA AO VIVO" */}
      <g transform="translate(15, 18)" filter="url(#cr-glow)">
        <rect width="96" height="22" rx="11" fill="#451a03" fillOpacity="0.9" stroke="#f59e0b" strokeWidth="1.2" />
        <circle cx="14" cy="11" r="4" fill="#22c55e" className="animate-pulse" />
        <circle cx="14" cy="11" r="2" fill="#86efac" />
        <text x="56" y="15" textAnchor="middle" fill="#fef08a" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="1">
          TEMPO REAL
        </text>
      </g>
    </svg>
  );
};
