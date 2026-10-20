import React from 'react';
import { GameCoverArtProps } from './TyperDashArt';

/**
 * Arte vetorial original para Raid Coletiva da Sala:
 * Batalha cooperativa MMO contra um chefão invasor do sistema.
 * Retrata um Mech Titã cibernético colossal com chifres e olhos vermelhos furiosos,
 * barra de HP de raid no topo e múltiplos feixes de energia coloridos convergindo
 * de todos os alunos em um ponto de impacto crítico massivo.
 */
export const ClassroomRaidArt: React.FC<GameCoverArtProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fundo Apocalíptico / Vermelho Escuro */}
        <radialGradient id="rd-bg" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor="#380512" />
          <stop offset="50%" stopColor="#20040b" />
          <stop offset="100%" stopColor="#0a0104" />
        </radialGradient>

        {/* Gradiente do Chefe Titã */}
        <linearGradient id="rd-boss" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4c0519" />
          <stop offset="50%" stopColor="#881337" />
          <stop offset="100%" stopColor="#1f020a" />
        </linearGradient>

        {/* Gradiente da Explosão de Impacto Crítico */}
        <radialGradient id="rd-blast" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
        </radialGradient>

        {/* Efeitos de Glow */}
        <filter id="rd-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="rd-fury" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Fundo */}
      <rect width="400" height="200" fill="url(#rd-bg)" />

      {/* Círculo de invocação / Alerta de Invasão de Sistema */}
      <circle cx="200" cy="85" r="75" stroke="#f43f5e" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="6 4" fill="none" />
      <circle cx="200" cy="85" r="105" stroke="#be123c" strokeWidth="0.8" strokeOpacity="0.15" fill="none" />

      {/* O CHEFE TITÃ CIBERNÉTICO COLOSSAL */}
      <g transform="translate(200, 75)" filter="url(#rd-glow)">
        {/* Chifres / Spikes Mecânicos nas Costas */}
        <polygon points="-50,-35 -35,-8 -45,-5" fill="#e11d48" />
        <polygon points="-75,-25 -45,-5 -60,10" fill="#9f1239" />
        <polygon points="50,-35 35,-8 45,-5" fill="#e11d48" />
        <polygon points="75,-25 45,-5 60,10" fill="#9f1239" />

        {/* Ombreiras Gigantes de Aço */}
        <polygon points="-80,0 -35,-20 -25,25 -70,35" fill="url(#rd-boss)" stroke="#f43f5e" strokeWidth="1.5" />
        <polygon points="80,0 35,-20 25,25 70,35" fill="url(#rd-boss)" stroke="#f43f5e" strokeWidth="1.5" />

        {/* Cabeça / Capacete Mech Ameaçador */}
        <polygon points="-25,-30 0,-42 25,-30 30,5 0,20 -30,5" fill="#1f020a" stroke="#fb7185" strokeWidth="2" />
        
        {/* Olhos e Visor Vermelho Feroz */}
        <polygon points="-18,-15 -6,-10 -6,-16" fill="#f43f5e" filter="url(#rd-fury)" />
        <polygon points="18,-15 6,-10 6,-16" fill="#f43f5e" filter="url(#rd-fury)" />
        <line x1="-18" y1="-12" x2="-6" y2="-12" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="18" y1="-12" x2="6" y2="-12" stroke="#ffffff" strokeWidth="1.5" />

        {/* Núcleo de Dados no Peito (Ponto Fraco) */}
        <circle cx="0" cy="30" r="14" fill="#9f1239" stroke="#fda4af" strokeWidth="2" />
        <circle cx="0" cy="30" r="8" fill="#f43f5e" filter="url(#rd-fury)" />
        <circle cx="0" cy="30" r="3" fill="#ffffff" />
      </g>

      {/* IMPACTO CRÍTICO CENTRAL (Onde todos os ataques dos alunos colidem) */}
      <circle cx="200" cy="105" r="28" fill="url(#rd-blast)" filter="url(#rd-fury)" />

      {/* FEIXES COOPERATIVOS DOS ALUNOS CONVERGINDO */}
      {/* Aluno 1: Feixe Ciano */}
      <line x1="40" y1="200" x2="200" y2="105" stroke="#38bdf8" strokeWidth="3" filter="url(#rd-glow)" />
      {/* Aluno 2: Feixe Verde Esmeralda */}
      <line x1="120" y1="200" x2="200" y2="105" stroke="#10b981" strokeWidth="3" filter="url(#rd-glow)" />
      {/* Aluno 3: Feixe Amarelo Ouro */}
      <line x1="280" y1="200" x2="200" y2="105" stroke="#facc15" strokeWidth="3.5" filter="url(#rd-glow)" />
      {/* Aluno 4: Feixe Roxo Elétrico */}
      <line x1="360" y1="200" x2="200" y2="105" stroke="#c084fc" strokeWidth="3" filter="url(#rd-glow)" />

      {/* DANO FLUTUANTE (Números de Acerto Crítico) */}
      <g filter="url(#rd-glow)">
        <text x="145" y="85" fill="#fef08a" fontFamily="monospace" fontSize="13" fontWeight="900">
          9,999!
        </text>
        <text x="235" y="78" fill="#fda4af" fontFamily="monospace" fontSize="11" fontWeight="bold">
          CRITICAL
        </text>
      </g>

      {/* BARRA DE HP DO CHEFÃO NO TOPO */}
      <g transform="translate(110, 18)" filter="url(#rd-glow)">
        {/* Fundo da barra */}
        <rect width="180" height="14" rx="4" fill="#18040a" stroke="#881337" strokeWidth="1.2" />
        {/* HP Restante (75%) */}
        <rect x="2" y="2" width="130" height="10" rx="3" fill="#f43f5e" />
        <line x1="2" y1="4" x2="132" y2="4" stroke="#fecdd3" strokeWidth="1" strokeOpacity="0.8" />
        {/* Caveira e Nome */}
        <text x="90" y="10" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="8" fontWeight="900" letterSpacing="0.5">
          BOSS: CYBER TITAN (68%)
        </text>
      </g>

      {/* Ícone de Dano Coletivo */}
      <g transform="translate(15, 18)" filter="url(#rd-glow)">
        <rect width="84" height="22" rx="11" fill="#4c0519" fillOpacity="0.9" stroke="#f43f5e" strokeWidth="1.2" />
        <circle cx="14" cy="11" r="4" fill="#ef4444" className="animate-pulse" />
        <circle cx="14" cy="11" r="2" fill="#fca5a5" />
        <text x="48" y="15" textAnchor="middle" fill="#fda4af" fontFamily="monospace" fontSize="10" fontWeight="900" letterSpacing="1">
          COOP RAID
        </text>
      </g>
    </svg>
  );
};
