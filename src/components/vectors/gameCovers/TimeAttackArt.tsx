import React from 'react';
import { GameCoverArtProps } from './TyperDashArt';

/**
 * Arte vetorial original para Sprint Time Attack:
 * Teste puro de velocidade de digitação contra o cronômetro (30s / 60s / 120s).
 * Retrata um cronômetro cibernético superaquecido rachando com chamas e faíscas elétricas,
 * ponteiro em rotação máxima, velocímetro marcando 120+ WPM e linhas de velocidade shonen.
 */
export const TimeAttackArt: React.FC<GameCoverArtProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fundo de Fogo / Alta Energia */}
        <linearGradient id="ta-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f1004" />
          <stop offset="50%" stopColor="#3d1d05" />
          <stop offset="100%" stopColor="#140702" />
        </linearGradient>

        {/* Gradiente do Cronômetro */}
        <linearGradient id="ta-dial" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>

        {/* Gradiente do Fogo Turbo */}
        <linearGradient id="ta-fire" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>

        {/* Filtros de Glow */}
        <filter id="ta-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="ta-heat" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Fundo */}
      <rect width="400" height="200" fill="url(#ta-bg)" />

      {/* Linhas de Velocidade (Speed Lines estilo Anime) */}
      <g stroke="#f59e0b" strokeOpacity="0.25" strokeWidth="1.2">
        <line x1="0" y1="20" x2="140" y2="70" />
        <line x1="0" y1="60" x2="120" y2="85" />
        <line x1="0" y1="140" x2="130" y2="125" />
        <line x1="0" y1="180" x2="150" y2="145" />
        <line x1="400" y1="20" x2="260" y2="70" />
        <line x1="400" y1="60" x2="280" y2="85" />
        <line x1="400" y1="140" x2="270" y2="125" />
        <line x1="400" y1="180" x2="250" y2="145" />
      </g>

      {/* Chamas de Turbina / Nitro nas laterais */}
      <path
        d="M 60 110 Q 90 95 110 115 Q 120 80 140 100 Q 110 130 60 110 Z"
        fill="url(#ta-fire)"
        opacity="0.4"
        filter="url(#ta-glow)"
      />
      <path
        d="M 340 110 Q 310 95 290 115 Q 280 80 260 100 Q 290 130 340 110 Z"
        fill="url(#ta-fire)"
        opacity="0.4"
        filter="url(#ta-glow)"
      />

      {/* O CRONÔMETRO CIBERNÉTICO CENTRAL (Em superaquecimento) */}
      <g transform="translate(200, 105)" filter="url(#ta-glow)">
        {/* Glow de calor intenso */}
        <circle cx="0" cy="0" r="70" fill="#f97316" fillOpacity="0.12" filter="url(#ta-heat)" />

        {/* Botão Superior do Cronômetro */}
        <rect x="-10" y="-76" width="20" height="12" rx="3" fill="#ea580c" stroke="#fed7aa" strokeWidth="1.5" />
        <rect x="-16" y="-84" width="32" height="8" rx="3" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

        {/* Botões Angulares Secundários */}
        <g transform="rotate(-40) translate(0, -68)">
          <rect x="-6" y="-8" width="12" height="8" rx="2" fill="#ea580c" stroke="#f59e0b" strokeWidth="1" />
        </g>
        <g transform="rotate(40) translate(0, -68)">
          <rect x="-6" y="-8" width="12" height="8" rx="2" fill="#ea580c" stroke="#f59e0b" strokeWidth="1" />
        </g>

        {/* Caixa / Corpo do Cronômetro */}
        <circle cx="0" cy="0" r="62" fill="url(#ta-dial)" stroke="#fed7aa" strokeWidth="3" />

        {/* Mostrador Interno de Carbono Escuro */}
        <circle cx="0" cy="0" r="52" fill="#180b03" stroke="#ea580c" strokeWidth="1.5" />

        {/* Marcas de Ticks do Relógio (Minutos/Segundos) */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <line
            key={deg}
            x1="0"
            y1="-48"
            x2="0"
            y2={deg % 90 === 0 ? '-38' : '-44'}
            stroke={deg % 90 === 0 ? '#f59e0b' : '#78350f'}
            strokeWidth={deg % 90 === 0 ? '2.5' : '1.2'}
            transform={`rotate(${deg})`}
          />
        ))}

        {/* Arco de Aceleração Neon no Display */}
        <path
          d="M -35 0 A 35 35 0 1 1 25 -25"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeDasharray="4 2"
          fill="none"
        />

        {/* Display Digital de Tempo: 00:30s */}
        <rect x="-30" y="16" width="60" height="18" rx="4" fill="#0c0502" stroke="#f59e0b" strokeWidth="1" />
        <text x="0" y="29" textAnchor="middle" fill="#fef08a" fontFamily="monospace" fontSize="11" fontWeight="900" letterSpacing="1">
          00:30
        </text>

        {/* PONTEIRO DO CRONÔMETRO (Em alta rotação angular) */}
        <g transform="rotate(55)">
          <polygon points="-3,10 0,-44 3,10" fill="#ef4444" stroke="#ffffff" strokeWidth="1" filter="url(#ta-glow)" />
          <circle cx="0" cy="0" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
        </g>

        {/* Faíscas elétricas de rotação */}
        <path d="M 28 -30 L 35 -24 L 32 -18" stroke="#fef08a" strokeWidth="2" fill="none" />
        <path d="M -30 -25 L -38 -20 L -33 -14" stroke="#fef08a" strokeWidth="2" fill="none" />
      </g>

      {/* PLACA DE WPM RECORD À ESQUERDA */}
      <g transform="translate(30, 75)" filter="url(#ta-glow)">
        <rect width="70" height="42" rx="8" fill="#180b03" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="35" y="20" textAnchor="middle" fill="#fef08a" fontFamily="monospace" fontSize="15" fontWeight="900">
          145
        </text>
        <text x="35" y="34" textAnchor="middle" fill="#ea580c" fontFamily="monospace" fontSize="9" fontWeight="bold">
          WPM PEAK
        </text>
      </g>

      {/* PLACA DE PRECISÃO À DIREITA */}
      <g transform="translate(300, 75)" filter="url(#ta-glow)">
        <rect width="70" height="42" rx="8" fill="#180b03" fillOpacity="0.85" stroke="#f97316" strokeWidth="1.5" />
        <text x="35" y="20" textAnchor="middle" fill="#fed7aa" fontFamily="monospace" fontSize="15" fontWeight="900">
          99.8%
        </text>
        <text x="35" y="34" textAnchor="middle" fill="#ea580c" fontFamily="monospace" fontSize="9" fontWeight="bold">
          PRECISÃO
        </text>
      </g>

      {/* Badge Superior "MODO SPRINT" */}
      <g transform="translate(15, 18)" filter="url(#ta-glow)">
        <rect width="94" height="22" rx="11" fill="#451a03" fillOpacity="0.9" stroke="#f59e0b" strokeWidth="1.2" />
        <circle cx="14" cy="11" r="4" fill="#f59e0b" />
        <circle cx="14" cy="11" r="2" fill="#fef08a" />
        <text x="54" y="15" textAnchor="middle" fill="#fef08a" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="1">
          TIME ATTACK
        </text>
      </g>
    </svg>
  );
};
