import React from 'react';
import { GameCoverArtProps } from './TyperDashArt';

/**
 * Arte vetorial original para Cyber Dungeon RPG:
 * Masmorra cibernética PVE com classes RPG, chefes a cada 10 andares e baús de tesouro.
 * Retrata guerreiro com capa cibernética e espada laser roxa, baú tech dourado aberto
 * com chaves de masmorra, poções neon e portal do chefe das sombras.
 */
export const CyberDungeonArt: React.FC<GameCoverArtProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fundo de Masmorra Roxo / Sombrio */}
        <radialGradient id="cd-bg" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#2e1065" />
          <stop offset="50%" stopColor="#17072e" />
          <stop offset="100%" stopColor="#090214" />
        </radialGradient>

        {/* Gradiente da Espada de Energia */}
        <linearGradient id="cd-blade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>

        {/* Gradiente do Baú */}
        <linearGradient id="cd-chest" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        {/* Filtros de Glow */}
        <filter id="cd-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="cd-magic" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Fundo */}
      <rect width="400" height="200" fill="url(#cd-bg)" />

      {/* Paredes de Pedra da Masmorra / Runas de Código */}
      <g stroke="#a855f7" strokeWidth="1" strokeOpacity="0.2">
        <rect x="20" y="30" width="60" height="24" rx="2" />
        <rect x="85" y="30" width="70" height="24" rx="2" />
        <rect x="245" y="30" width="70" height="24" rx="2" />
        <rect x="320" y="30" width="60" height="24" rx="2" />
        
        <rect x="50" y="58" width="80" height="24" rx="2" />
        <rect x="270" y="58" width="80" height="24" rx="2" />
      </g>

      {/* Olhos do Chefe Sombrio no Fundo Superior */}
      <g transform="translate(200, 40)" filter="url(#cd-magic)">
        <ellipse cx="-24" cy="0" rx="9" ry="4" fill="#ef4444" transform="rotate(15 -24 0)" />
        <ellipse cx="24" cy="0" rx="9" ry="4" fill="#ef4444" transform="rotate(-15 24 0)" />
        <circle cx="-24" cy="0" r="2.5" fill="#ffffff" />
        <circle cx="24" cy="0" r="2.5" fill="#ffffff" />
      </g>

      {/* Portal / Arco da Masmorra Central */}
      <path
        d="M 140 160 L 140 70 A 60 60 0 0 1 260 70 L 260 160"
        stroke="#9333ea"
        strokeWidth="3"
        strokeDasharray="6 3"
        filter="url(#cd-glow)"
      />

      {/* Chão com Lajes de Pedra Cyber */}
      <polygon points="0,200 400,200 370,150 30,150" fill="#0d041c" stroke="#6b21a8" strokeWidth="1.5" />
      <line x1="80" y1="150" x2="60" y2="200" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="160" y1="150" x2="150" y2="200" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="240" y1="150" x2="250" y2="200" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="320" y1="150" x2="340" y2="200" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.3" />

      {/* O GUERREIRO CIBERNÉTICO (À Esquerda, empunhando espada laser) */}
      <g transform="translate(105, 90)">
        {/* Capa Cibernética Fluindo */}
        <path d="M 18 35 Q 2 55 -5 75 Q 15 65 24 45 Z" fill="#7e22ce" opacity="0.8" />

        {/* Corpo / Armadura de Placas Tech */}
        <rect x="14" y="24" width="22" height="32" rx="4" fill="#1e1b4b" stroke="#c084fc" strokeWidth="1.5" />
        <line x1="18" y1="36" x2="32" y2="36" stroke="#c084fc" strokeWidth="1.5" />

        {/* Cabeça e Visor Gamer Neon */}
        <circle cx="25" cy="14" r="11" fill="#0f172a" stroke="#c084fc" strokeWidth="1.5" />
        {/* Visor Cyberpunk (Luz Ciano) */}
        <rect x="18" y="11" width="15" height="5" rx="2" fill="#38bdf8" filter="url(#cd-glow)" />

        {/* Braço empunhando a Espada Laser */}
        <line x1="32" y1="32" x2="48" y2="24" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />
        
        {/* A ESPADA DE ENERGIA (Grande, brilhante e inclinada) */}
        <g transform="translate(48, 24) rotate(-35)" filter="url(#cd-magic)">
          {/* Cabo e Guarda */}
          <rect x="-3" y="0" width="6" height="14" rx="2" fill="#475569" />
          <line x1="-10" y1="0" x2="10" y2="0" stroke="#f59e0b" strokeWidth="3" />
          {/* Lâmina Laser */}
          <polygon points="-4,-65 0,-74 4,-65 3,0 -3,0" fill="url(#cd-blade)" stroke="#f3e8ff" strokeWidth="1.2" />
        </g>
      </g>

      {/* BAÚ DO TESOURO TECNOLÓGICO (À Direita, aberto e jorrando luz) */}
      <g transform="translate(255, 120)" filter="url(#cd-glow)">
        {/* Feixe de Luz Mística saindo do baú */}
        <polygon points="10,0 45,0 55,-35 0,-35" fill="#facc15" fillOpacity="0.25" filter="url(#cd-magic)" />

        {/* Tampa do Baú Aberta */}
        <polygon points="0,-16 55,-16 50,0 5,0" fill="#b45309" stroke="#f59e0b" strokeWidth="1.5" />

        {/* Base do Baú */}
        <rect x="5" y="0" width="45" height="30" rx="4" fill="url(#cd-chest)" stroke="#fbbf24" strokeWidth="1.5" />
        
        {/* Fechadura Dourada com chave digital */}
        <rect x="23" y="5" width="9" height="12" rx="2" fill="#fde047" stroke="#78350f" strokeWidth="1" />
        <circle cx="27.5" cy="9" r="1.5" fill="#78350f" />

        {/* Poção de Vida Vermelha ao lado do baú */}
        <g transform="translate(-16, 8)">
          <path d="M 4 2 L 8 2 L 8 6 L 12 12 A 6 6 0 0 1 0 12 L 4 6 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" />
          <rect x="4" y="0" width="4" height="2" fill="#78350f" />
        </g>

        {/* Poção de Mana Azul */}
        <g transform="translate(54, 8)">
          <path d="M 4 2 L 8 2 L 8 6 L 12 12 A 6 6 0 0 1 0 12 L 4 6 Z" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" />
          <rect x="4" y="0" width="4" height="2" fill="#78350f" />
        </g>
      </g>

      {/* CHAVE DE MASMORRA FLUTUANTE */}
      <g transform="translate(270, 75)" filter="url(#cd-glow)">
        <circle cx="0" cy="0" r="7" fill="none" stroke="#fde047" strokeWidth="2.5" />
        <line x1="7" y1="0" x2="22" y2="0" stroke="#fde047" strokeWidth="2.5" />
        <line x1="17" y1="0" x2="17" y2="5" stroke="#fde047" strokeWidth="2" />
        <line x1="21" y1="0" x2="21" y2="4" stroke="#fde047" strokeWidth="2" />
      </g>

      {/* Badge Superior "PVE DUNGEON" */}
      <g transform="translate(15, 18)" filter="url(#cd-glow)">
        <rect width="98" height="22" rx="11" fill="#3b0764" fillOpacity="0.9" stroke="#c084fc" strokeWidth="1.2" />
        <circle cx="14" cy="11" r="4" fill="#a855f7" />
        <circle cx="14" cy="11" r="2" fill="#f3e8ff" />
        <text x="56" y="15" textAnchor="middle" fill="#f3e8ff" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="1">
          CYBER DUNGEON
        </text>
      </g>
    </svg>
  );
};
