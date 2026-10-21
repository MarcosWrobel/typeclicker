import React from 'react';
import { GameCoverArtProps } from './TyperDashArt';

/**
 * Arte vetorial original para SheetQuest: Mestre das Planilhas:
 * Gamificação de Google Planilhas (Fórmulas em Português com separador ;).
 * Retrata uma grade de planilha holográfica tridimensional com células ativas,
 * barra fx com fórmula neon =SOMA(B2:B6), gráfico de barras 3D ascendente
 * e o mascote Bytezinho com visual de analista de dados.
 */
export const SheetQuestArt: React.FC<GameCoverArtProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fundo Cibernético Esmeralda & Ciano */}
        <linearGradient id="sq-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#022c22" />
          <stop offset="45%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#041f2a" />
        </linearGradient>

        {/* Gradiente da Grade da Planilha */}
        <linearGradient id="sq-grid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
        </linearGradient>

        {/* Gradiente da Barra de Fórmulas fx */}
        <linearGradient id="sq-fxbar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#065f46" />
          <stop offset="100%" stopColor="#083344" />
        </linearGradient>

        {/* Gradiente das Barras do Gráfico 3D */}
        <linearGradient id="sq-bar1" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>

        <linearGradient id="sq-bar2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        <linearGradient id="sq-bar3" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>

        {/* Gradiente do Bytezinho */}
        <linearGradient id="sq-byte" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Efeitos de Glow */}
        <filter id="sq-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="sq-pulse" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Fundo Geral */}
      <rect width="400" height="200" fill="url(#sq-bg)" />

      {/* Grade de perspectiva no chão da planilha */}
      <path
        d="M -30 200 L 140 120 M 60 200 L 170 120 M 160 200 L 200 120 M 260 200 L 230 120 M 360 200 L 260 120 M 440 200 L 290 120"
        stroke="#10b981"
        strokeWidth="1"
        strokeOpacity="0.25"
      />
      <line x1="0" y1="150" x2="400" y2="150" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.2" />
      <line x1="0" y1="175" x2="400" y2="175" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" />

      {/* A PLANILHA ELETRÔNICA HOLOGRÁFICA (Perspectiva Isométrica à Esquerda) */}
      <g transform="translate(25, 48)">
        {/* Janela / Moldura da Tabela */}
        <rect width="215" height="135" rx="8" fill="#031813" stroke="#10b981" strokeWidth="1.5" filter="url(#sq-glow)" />

        {/* Barra de Menus / Cabeçalho Verde Sheets */}
        <rect width="215" height="20" rx="8" fill="#047857" />
        <rect y="12" width="215" height="8" fill="#047857" />
        <text x="10" y="14" fill="#ffffff" fontFamily="monospace" fontSize="9" fontWeight="900" letterSpacing="0.5">
          Google Planilhas • Dados_Loja.xlsx
        </text>

        {/* Linha dos Cabeçalhos das Colunas (A, B, C, D) */}
        <g transform="translate(0, 20)">
          <rect width="25" height="16" fill="#064e3b" stroke="#047857" strokeWidth="0.8" />
          <rect x="25" y="0" width="60" height="16" fill="#064e3b" stroke="#047857" strokeWidth="0.8" />
          <rect x="85" y="0" width="65" height="16" fill="#065f46" stroke="#10b981" strokeWidth="1.2" />
          <rect x="150" y="0" width="65" height="16" fill="#064e3b" stroke="#047857" strokeWidth="0.8" />

          <text x="55" y="11" textAnchor="middle" fill="#a7f3d0" fontFamily="monospace" fontSize="8" fontWeight="bold">
            A (Item)
          </text>
          <text x="117" y="11" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="8" fontWeight="900">
            B (Preço)
          </text>
          <text x="182" y="11" textAnchor="middle" fill="#a7f3d0" fontFamily="monospace" fontSize="8" fontWeight="bold">
            C (Total)
          </text>
        </g>

        {/* Linhas da Grade de Dados */}
        {/* Linha 1 */}
        <g transform="translate(0, 36)">
          <rect width="25" height="18" fill="#042f2e" stroke="#065f46" strokeWidth="0.5" />
          <text x="12" y="12" textAnchor="middle" fill="#6ee7b7" fontFamily="monospace" fontSize="8">
            2
          </text>
          <rect x="25" y="0" width="60" height="18" fill="#021f1a" stroke="#065f46" strokeWidth="0.5" />
          <text x="30" y="12" fill="#d1fae5" fontFamily="monospace" fontSize="8">
            Mouse
          </text>
          <rect x="85" y="0" width="65" height="18" fill="#022c22" stroke="#10b981" strokeWidth="0.8" />
          <text x="145" y="12" textAnchor="end" fill="#6ee7b7" fontFamily="monospace" fontSize="8">
            R$ 150
          </text>
          <rect x="150" y="0" width="65" height="18" fill="#021f1a" stroke="#065f46" strokeWidth="0.5" />
          <text x="210" y="12" textAnchor="end" fill="#99f6e4" fontFamily="monospace" fontSize="8">
            OK
          </text>
        </g>

        {/* Linha 2 */}
        <g transform="translate(0, 54)">
          <rect width="25" height="18" fill="#042f2e" stroke="#065f46" strokeWidth="0.5" />
          <text x="12" y="12" textAnchor="middle" fill="#6ee7b7" fontFamily="monospace" fontSize="8">
            3
          </text>
          <rect x="25" y="0" width="60" height="18" fill="#021f1a" stroke="#065f46" strokeWidth="0.5" />
          <text x="30" y="12" fill="#d1fae5" fontFamily="monospace" fontSize="8">
            Teclado
          </text>
          <rect x="85" y="0" width="65" height="18" fill="#022c22" stroke="#10b981" strokeWidth="0.8" />
          <text x="145" y="12" textAnchor="end" fill="#6ee7b7" fontFamily="monospace" fontSize="8">
            R$ 350
          </text>
          <rect x="150" y="0" width="65" height="18" fill="#021f1a" stroke="#065f46" strokeWidth="0.5" />
          <text x="210" y="12" textAnchor="end" fill="#99f6e4" fontFamily="monospace" fontSize="8">
            OK
          </text>
        </g>

        {/* Linha 3 (Célula Alvo com Destaque Neon Pulsante) */}
        <g transform="translate(0, 72)">
          <rect width="25" height="20" fill="#065f46" stroke="#10b981" strokeWidth="1" />
          <text x="12" y="14" textAnchor="middle" fill="#facc15" fontFamily="monospace" fontSize="9" fontWeight="900">
            4
          </text>
          <rect x="25" y="0" width="60" height="20" fill="#042f2e" stroke="#065f46" strokeWidth="0.8" />
          <text x="30" y="14" fill="#fbbf24" fontFamily="monospace" fontSize="8" fontWeight="bold">
            Total SOMA
          </text>
          <rect
            x="85"
            y="0"
            width="65"
            height="20"
            fill="#065f46"
            stroke="#facc15"
            strokeWidth="1.8"
            strokeDasharray="4 2"
            filter="url(#sq-glow)"
          />
          <text x="145" y="14" textAnchor="end" fill="#fef08a" fontFamily="monospace" fontSize="9" fontWeight="900">
            R$ 500
          </text>
          <rect x="150" y="0" width="65" height="20" fill="#042f2e" stroke="#065f46" strokeWidth="0.8" />
          <text x="210" y="14" textAnchor="end" fill="#67e8f9" fontFamily="monospace" fontSize="8">
            APROVADO
          </text>
        </g>
      </g>

      {/* BARRA DE FÓRMULAS FX FLUTUANTE EM DESTAQUE NO TOPO */}
      <g transform="translate(18, 16)" filter="url(#sq-glow)">
        <rect width="245" height="24" rx="6" fill="url(#sq-fxbar)" stroke="#10b981" strokeWidth="1.5" />
        
        {/* Caixa de Coordenada Ativa */}
        <rect x="3" y="3" width="28" height="18" rx="4" fill="#042f2e" stroke="#059669" strokeWidth="1" />
        <text x="17" y="15" textAnchor="middle" fill="#6ee7b7" fontFamily="monospace" fontSize="9" fontWeight="900">
          B4
        </text>

        {/* Divisor */}
        <line x1="36" y1="4" x2="36" y2="20" stroke="#059669" strokeWidth="1" />

        {/* Ícone fx */}
        <text x="47" y="16" fill="#34d399" fontFamily="serif" fontSize="13" fontStyle="italic" fontWeight="bold">
          fx
        </text>

        {/* Fórmula Digitada com Sintaxe Destacada */}
        <text x="65" y="16" fill="#fef08a" fontFamily="monospace" fontSize="11" fontWeight="900">
          =SOMA(B2:B3)
        </text>
      </g>

      {/* GRÁFICO 3D ASCENDENTE HOLOGRÁFICO (À Direita) */}
      <g transform="translate(255, 110)">
        {/* Barra 1 */}
        <g filter="url(#sq-glow)">
          <rect x="0" y="25" width="16" height="45" rx="3" fill="url(#sq-bar1)" stroke="#a7f3d0" strokeWidth="1" />
          <polygon points="0,25 6,19 22,19 16,25" fill="#6ee7b7" />
          <polygon points="16,25 22,19 22,64 16,70" fill="#047857" />
        </g>

        {/* Barra 2 */}
        <g filter="url(#sq-glow)">
          <rect x="25" y="10" width="16" height="60" rx="3" fill="url(#sq-bar2)" stroke="#bae6fd" strokeWidth="1" />
          <polygon points="25,10 31,4 47,4 41,10" fill="#7dd3fc" />
          <polygon points="41,10 47,4 47,64 41,70" fill="#0369a1" />
        </g>

        {/* Barra 3 (Mais Alta com Recorde) */}
        <g filter="url(#sq-pulse)">
          <rect x="50" y="-10" width="18" height="80" rx="3" fill="url(#sq-bar3)" stroke="#fef08a" strokeWidth="1.2" />
          <polygon points="50,-10 56,-16 74,-16 68,-10" fill="#fef08a" />
          <polygon points="68,-10 74,-16 74,64 68,70" fill="#047857" />
        </g>

        {/* Linha de Tendência Crescente com Seta Neon */}
        <path
          d="M 8 28 Q 33 5 62 -18"
          stroke="#facc15"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 2"
          filter="url(#sq-glow)"
        />
        <polygon points="60,-24 67,-19 60,-14" fill="#facc15" />
      </g>

      {/* MASCOTE BYTEZINHO ANALISTA DE DADOS (Flutuando no canto superior direito) */}
      <g transform="translate(325, 45)">
        {/* Antena com esfera brilhante de dados */}
        <line x1="28" y1="8" x2="28" y2="0" stroke="#38bdf8" strokeWidth="2" />
        <circle cx="28" cy="0" r="3.5" fill="#67e8f9" filter="url(#sq-glow)" />

        {/* Cabeça do Robô */}
        <rect x="10" y="8" width="36" height="30" rx="8" fill="url(#sq-byte)" stroke="#e0f2fe" strokeWidth="1.5" filter="url(#sq-glow)" />
        
        {/* Tela interna escura */}
        <rect x="14" y="12" width="28" height="22" rx="5" fill="#031813" />

        {/* Óculos de Analista de Dados Neon (Verde/Ciano) */}
        <rect x="17" y="16" width="9" height="7" rx="2" fill="#34d399" stroke="#ffffff" strokeWidth="0.8" />
        <rect x="28" y="16" width="9" height="7" rx="2" fill="#34d399" stroke="#ffffff" strokeWidth="0.8" />
        <line x1="26" y1="19" x2="28" y2="19" stroke="#ffffff" strokeWidth="1.2" />

        {/* Olhinhos de foco */}
        <circle cx="21" cy="19" r="1.5" fill="#ffffff" />
        <circle cx="32" cy="19" r="1.5" fill="#ffffff" />

        {/* Sorriso simpático de código */}
        <path d="M 23 28 Q 27 31 31 28" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />

        {/* Gravatinha borboleta tech */}
        <polygon points="25,38 28,41 25,44" fill="#10b981" />
        <polygon points="31,38 28,41 31,44" fill="#10b981" />
        <circle cx="28" cy="41" r="1.5" fill="#ffffff" />
      </g>

      {/* Badge Superior "GOOGLE SHEETS PT-BR" */}
      <g transform="translate(285, 16)" filter="url(#sq-glow)">
        <rect width="102" height="22" rx="11" fill="#022c22" fillOpacity="0.95" stroke="#10b981" strokeWidth="1.2" />
        <circle cx="14" cy="11" r="4" fill="#10b981" />
        <circle cx="14" cy="11" r="2" fill="#d1fae5" />
        <text x="58" y="15" textAnchor="middle" fill="#6ee7b7" fontFamily="monospace" fontSize="9" fontWeight="900" letterSpacing="0.8">
          SHEETS PT-BR
        </text>
      </g>
    </svg>
  );
};
