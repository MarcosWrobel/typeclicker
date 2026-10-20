import React from 'react';
import { GameCoverArtProps } from './TyperDashArt';

/**
 * Arte vetorial original para ProgPlay:
 * Plataforma interativa de programação criada por aluno (André Luís Borato).
 * Retrata "O Enigma das Portas", portais lógicos com símbolos de chaves de código { } e </>,
 * linguagens de programação (JS, Python, SQL, Web) conectando terminais e arena de duelo 1x1.
 */
export const ProgPlayArt: React.FC<GameCoverArtProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fundo Cósmico / Cyber-Azul */}
        <linearGradient id="pp-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0b0f2e" />
          <stop offset="50%" stopColor="#151b47" />
          <stop offset="100%" stopColor="#070a1e" />
        </linearGradient>

        {/* Gradiente da Porta 1 (Azul / Ciano) */}
        <linearGradient id="pp-door1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>

        {/* Gradiente da Porta 2 (Índigo / Roxo) */}
        <linearGradient id="pp-door2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>

        {/* Efeitos de Glow */}
        <filter id="pp-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="pp-hardglow" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Fundo */}
      <rect width="400" height="200" fill="url(#pp-bg)" />

      {/* Grade de perspectiva no chão */}
      <path
        d="M -40 200 L 140 140 M 60 200 L 170 140 M 160 200 L 200 140 M 240 200 L 230 140 M 340 200 L 260 140 M 440 200 L 290 140"
        stroke="#6366f1"
        strokeWidth="1"
        strokeOpacity="0.25"
      />

      {/* Estrelas e Feixes de Dados ao fundo */}
      <circle cx="50" cy="35" r="1.5" fill="#38bdf8" opacity="0.6" />
      <circle cx="110" cy="25" r="1.2" fill="#818cf8" opacity="0.5" />
      <circle cx="290" cy="30" r="1.5" fill="#c084fc" opacity="0.7" />
      <circle cx="360" cy="45" r="1.8" fill="#38bdf8" opacity="0.6" />

      {/* O ENIGMA DAS PORTAS: PORTA 1 (Esquerda - Lógica Web / JS) */}
      <g transform="translate(100, 45)" filter="url(#pp-glow)">
        {/* Arco externo do portal */}
        <path
          d="M 0 95 L 0 35 A 35 35 0 0 1 70 35 L 70 95 Z"
          fill="#0c183d"
          stroke="#38bdf8"
          strokeWidth="2.5"
        />
        {/* Luz interior do portal */}
        <path
          d="M 8 95 L 8 38 A 27 27 0 0 1 62 38 L 62 95 Z"
          fill="url(#pp-door1)"
          fillOpacity="0.5"
        />
        {/* Runas de Código na Porta: </> */}
        <text x="35" y="65" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="22" fontWeight="900" filter="url(#pp-glow)">
          &lt;/&gt;
        </text>
        {/* Fechadura de Dados */}
        <circle cx="35" cy="80" r="4" fill="#38bdf8" />
        <rect x="33" y="80" width="4" height="6" fill="#38bdf8" />
      </g>

      {/* O ENIGMA DAS PORTAS: PORTA 2 (Direita - Python / SQL / Backend) */}
      <g transform="translate(230, 45)" filter="url(#pp-glow)">
        {/* Arco externo */}
        <path
          d="M 0 95 L 0 35 A 35 35 0 0 1 70 35 L 70 95 Z"
          fill="#1e1035"
          stroke="#a855f7"
          strokeWidth="2.5"
        />
        {/* Luz interior */}
        <path
          d="M 8 95 L 8 38 A 27 27 0 0 1 62 38 L 62 95 Z"
          fill="url(#pp-door2)"
          fillOpacity="0.5"
        />
        {/* Símbolo de Chaves Lógicas: { ; } */}
        <text x="35" y="65" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="22" fontWeight="900" filter="url(#pp-glow)">
          &#123; ; &#125;
        </text>
        {/* Fechadura */}
        <circle cx="35" cy="80" r="4" fill="#c084fc" />
        <rect x="33" y="80" width="4" height="6" fill="#c084fc" />
      </g>

      {/* PONTO CENTRAL: CHAVE MESTRA / ARENA DUELO 1x1 */}
      <g transform="translate(200, 32)" filter="url(#pp-hardglow)">
        <polygon points="0,-15 12,0 0,15 -12,0" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="3" fill="#ffffff" />
      </g>

      {/* TAGS DAS 5 LINGUAGENS FLUTUANTES (Estilo Cartões de Código) */}
      {/* Tag Python */}
      <g transform="translate(25, 60)" filter="url(#pp-glow)">
        <rect width="52" height="20" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
        <text x="26" y="14" textAnchor="middle" fill="#38bdf8" fontFamily="monospace" fontSize="9" fontWeight="bold">
          Python
        </text>
      </g>

      {/* Tag JavaScript */}
      <g transform="translate(35, 105)" filter="url(#pp-glow)">
        <rect width="44" height="20" rx="6" fill="#1e293b" stroke="#facc15" strokeWidth="1.2" />
        <text x="22" y="14" textAnchor="middle" fill="#facc15" fontFamily="monospace" fontSize="9" fontWeight="bold">
          JS
        </text>
      </g>

      {/* Tag SQL */}
      <g transform="translate(325, 60)" filter="url(#pp-glow)">
        <rect width="48" height="20" rx="6" fill="#1e293b" stroke="#34d399" strokeWidth="1.2" />
        <text x="24" y="14" textAnchor="middle" fill="#34d399" fontFamily="monospace" fontSize="9" fontWeight="bold">
          SQL
        </text>
      </g>

      {/* Tag CSS/HTML */}
      <g transform="translate(320, 105)" filter="url(#pp-glow)">
        <rect width="56" height="20" rx="6" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.2" />
        <text x="28" y="14" textAnchor="middle" fill="#fb7185" fontFamily="monospace" fontSize="9" fontWeight="bold">
          HTML5
        </text>
      </g>

      {/* FEIXES DE CONEXÃO DE DUELO 1x1 ENTRE TERMINAIS */}
      <path
        d="M 135 140 Q 200 115 265 140"
        stroke="#818cf8"
        strokeWidth="2.5"
        strokeDasharray="4 3"
        filter="url(#pp-glow)"
      />
      <circle cx="200" cy="125" r="7" fill="#6366f1" filter="url(#pp-hardglow)" />
      <text x="200" y="128" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="8" fontWeight="bold">
        VS
      </text>

      {/* Aluno 1 (Terminal Hacker Esquerda) */}
      <g transform="translate(85, 140)">
        <rect x="0" y="0" width="36" height="22" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
        <line x1="6" y1="6" x2="24" y2="6" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="6" y1="11" x2="18" y2="11" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="6" y1="16" x2="28" y2="16" stroke="#38bdf8" strokeWidth="1.5" />
      </g>

      {/* Aluno 2 (Terminal Hacker Direita) */}
      <g transform="translate(280, 140)">
        <rect x="0" y="0" width="36" height="22" rx="4" fill="#0f172a" stroke="#a855f7" strokeWidth="1" />
        <line x1="6" y1="6" x2="24" y2="6" stroke="#a855f7" strokeWidth="1.5" />
        <line x1="6" y1="11" x2="18" y2="11" stroke="#a855f7" strokeWidth="1.5" />
        <line x1="6" y1="16" x2="28" y2="16" stroke="#a855f7" strokeWidth="1.5" />
      </g>

      {/* Badge Superior "100 DESAFIOS" */}
      <g transform="translate(15, 18)" filter="url(#pp-glow)">
        <rect width="105" height="22" rx="11" fill="#1e1b4b" fillOpacity="0.9" stroke="#6366f1" strokeWidth="1.2" />
        <circle cx="14" cy="11" r="4" fill="#6366f1" />
        <circle cx="14" cy="11" r="2" fill="#c7d2fe" />
        <text x="58" y="15" textAnchor="middle" fill="#a5b4fc" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="1">
          100 DESAFIOS
        </text>
      </g>
    </svg>
  );
};
