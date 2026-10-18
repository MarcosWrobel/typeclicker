// ─────────────────────────────────────────────────────────────
// Renderizador de Ícones Vetoriais Canônicos — Itens ByteQuest
// 100% SVG nativo, Zero Emojis de Sistema
// ─────────────────────────────────────────────────────────────

import React from 'react';

export interface ByteQuestItemIconProps {
  assetKey: string;
  rarity?: string;
  className?: string;
  size?: number;
}

export const ByteQuestItemIcon: React.FC<ByteQuestItemIconProps> = ({
  assetKey,
  rarity = 'common',
  className = '',
  size = 36
}) => {
  // Paletas de brilho baseadas na raridade
  const glowColor =
    rarity === 'quantum'
      ? '#C084FC'
      : rarity === 'epic'
      ? '#EC4899'
      : rarity === 'rare'
      ? '#38BDF8'
      : '#94A3B8';

  const renderIconContent = () => {
    switch (assetKey) {
      // ─── ESPADAS (GUERREIRO) ───
      case 'blade_iron':
        return (
          <g>
            {/* Lâmina de ferro reciclado */}
            <path d="M7 29 L11 25 L10 22 L22 10 L25 7 L27 9 L24 12 L12 24 L9 23 Z" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
            <path d="M22 10 L26 6 L28 8 L24 12 Z" fill="#E2E8F0" />
            <line x1="12" y1="22" x2="22" y2="12" stroke="#CBD5E1" strokeWidth="1" />
            {/* Guarda e Empunhadura */}
            <line x1="7" y1="22" x2="13" y2="28" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="6" y1="26" x2="4" y2="28" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
            <circle cx="3.5" cy="28.5" r="1.5" fill="#B45309" />
          </g>
        );

      case 'blade_thermal':
        return (
          <g>
            {/* Cyberblade Térmica incandescente */}
            <path d="M8 28 L12 24 L24 12 L28 5 L21 9 L9 21 Z" fill="#EF4444" stroke="#DC2626" strokeWidth="1.5" />
            {/* Filamento incandescente de plasma */}
            <path d="M11 21 L22 10 L26 6" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 22 L23 11" stroke="#F97316" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
            {/* Guarda cibernética */}
            <rect x="7" y="21" width="6" height="6" rx="1.5" transform="rotate(45 10 24)" fill="#1E293B" stroke="#F97316" strokeWidth="1" />
            <line x1="6" y1="26" x2="3" y2="29" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      case 'blade_quantum':
        return (
          <g>
            {/* Mata-Processos Quântica */}
            <path d="M8 28 L13 23 L25 11 L29 3 L21 7 L9 19 Z" fill="#581C87" stroke="#A855F7" strokeWidth="1.5" />
            {/* Núcleo de Singularidade */}
            <path d="M12 20 L23 9 L27 5" stroke="#E9D5FF" strokeWidth="2" strokeLinecap="round" />
            <circle cx="10" cy="22" r="3.5" fill="#3B0764" stroke="#C084FC" strokeWidth="1" />
            <circle cx="10" cy="22" r="1.5" fill="#F472B6" />
            {/* Runas de dados */}
            <line x1="16" y1="14" x2="18" y2="16" stroke="#C084FC" strokeWidth="1.5" />
            <line x1="20" y1="10" x2="22" y2="12" stroke="#C084FC" strokeWidth="1.5" />
          </g>
        );

      // ─── ARCOS (ARQUEIRO) ───
      case 'bow_fiber':
        return (
          <g>
            {/* Arco de fibra óptica verde */}
            <path d="M7 6 C18 10 24 16 26 27" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="7" y1="6" x2="26" y2="27" stroke="#6EE7B7" strokeWidth="1" strokeDasharray="2 1" />
            {/* Flecha de pulso óptico */}
            <line x1="8" y1="25" x2="25" y2="8" stroke="#34D399" strokeWidth="1.8" />
            <polygon points="25,5 27,9 23,7" fill="#6EE7B7" />
          </g>
        );

      case 'bow_plasma':
        return (
          <g>
            {/* Repetidor de Plasma Sub-Rede */}
            <path d="M6 5 C20 8 26 18 27 28" fill="none" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
            <path d="M8 8 C18 11 23 18 24 26" fill="none" stroke="#F472B6" strokeWidth="1.2" />
            <line x1="6" y1="5" x2="27" y2="28" stroke="#FBCFE8" strokeWidth="1.5" />
            {/* Cristal condensador de plasma */}
            <polygon points="17,16 20,13 20,19" fill="#F43F5E" stroke="#FDA4AF" strokeWidth="1" />
            <circle cx="18" cy="15" r="2.5" fill="#FEF08A" />
          </g>
        );

      // ─── CAJADOS (MAGO) ───
      case 'staff_compiler':
        return (
          <g>
            {/* Cajado de madeira rúnica */}
            <line x1="7" y1="27" x2="23" y2="11" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
            {/* Cabeça do compilador com gema ciano */}
            <circle cx="23" cy="9" r="5" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
            <path d="M21 9 L25 9 M23 7 L23 11" stroke="#E0F2FE" strokeWidth="1.5" />
          </g>
        );

      case 'staff_singularity':
        return (
          <g>
            {/* Cetro da Singularidade Assíncrona */}
            <line x1="6" y1="28" x2="22" y2="12" stroke="#312E81" strokeWidth="3.5" strokeLinecap="round" />
            {/* Anéis orbitais no topo */}
            <circle cx="23" cy="9" r="6.5" fill="none" stroke="#818CF8" strokeWidth="1.5" />
            <ellipse cx="23" cy="9" rx="7.5" ry="3.5" transform="rotate(45 23 9)" fill="none" stroke="#C084FC" strokeWidth="1.5" />
            {/* Núcleo cósmico */}
            <circle cx="23" cy="9" r="3" fill="#FAF5FF" />
          </g>
        );

      // ─── PEITORAIS / ARMADURAS ───
      case 'chest_antistatic':
        return (
          <g>
            {/* Colete antiestático */}
            <path d="M9 7 L13 6 L16 10 L19 6 L23 7 L24 16 L22 25 L10 25 L8 16 Z" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
            <line x1="16" y1="10" x2="16" y2="25" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="16" cy="15" r="1.5" fill="#38BDF8" />
          </g>
        );

      case 'plate_titan':
        return (
          <g>
            {/* Peitoral de titânio firewall */}
            <path d="M8 6 L13 5 L16 9 L19 5 L24 6 L25 15 L22 26 L16 28 L10 26 L7 15 Z" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.8" />
            {/* Placas angulares reforçadas */}
            <polygon points="12,12 16,14 20,12 16,22" fill="#0F172A" stroke="#0284C7" strokeWidth="1.2" />
            <circle cx="16" cy="16" r="2" fill="#38BDF8" />
          </g>
        );

      case 'robe_arcane':
        return (
          <g>
            {/* Manto da Memória Cache L1 */}
            <path d="M9 7 L16 11 L23 7 L25 18 L24 27 L8 27 L7 18 Z" fill="#4C1D95" stroke="#8B5CF6" strokeWidth="1.5" />
            <path d="M12 12 L16 27 L20 12" fill="#2E1065" stroke="#A78BFA" strokeWidth="1" />
            <circle cx="16" cy="11" r="2.5" fill="#C084FC" />
          </g>
        );

      case 'aegis_quantum':
        return (
          <g>
            {/* Égide do Kernel Imutável */}
            <path d="M7 6 L16 4 L25 6 L26 16 L22 26 L16 29 L10 26 L6 16 Z" fill="#1E1B4B" stroke="#A855F7" strokeWidth="2" />
            {/* Brasão hexagonal do Kernel */}
            <polygon points="16,10 21,13 21,19 16,22 11,19 11,13" fill="#3B0764" stroke="#E9D5FF" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="2.5" fill="#F472B6" />
          </g>
        );

      // ─── ELMOS / HEAD ───
      case 'head_visor':
        return (
          <g>
            {/* Óculos de Realidade do Terminal */}
            <rect x="7" y="11" width="18" height="9" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
            <rect x="9" y="13" width="6" height="5" rx="1" fill="#0284C7" />
            <rect x="17" y="13" width="6" height="5" rx="1" fill="#0284C7" />
            <line x1="4" y1="14" x2="7" y2="14" stroke="#64748B" strokeWidth="1.5" />
            <line x1="25" y1="14" x2="28" y2="14" stroke="#64748B" strokeWidth="1.5" />
          </g>
        );

      case 'head_helm':
        return (
          <g>
            {/* Elmo de Redes Gigabit */}
            <path d="M7 16 C7 9 10 6 16 6 C22 6 25 9 25 16 L24 23 L20 25 L16 26 L12 25 L8 23 Z" fill="#1E293B" stroke="#EF4444" strokeWidth="1.8" />
            {/* Fenda em T do cruzado cibernético */}
            <line x1="10" y1="15" x2="22" y2="15" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="15" x2="16" y2="23" stroke="#F87171" strokeWidth="2" />
          </g>
        );

      case 'quantum_visor':
        return (
          <g>
            {/* Visor Quântico de Overclock */}
            <path d="M6 14 L12 9 L20 9 L26 14 L23 20 L16 21 L9 20 Z" fill="#2E1065" stroke="#C084FC" strokeWidth="1.8" />
            <polygon points="8,14 16,11 24,14 16,19" fill="#7E22CE" stroke="#E9D5FF" strokeWidth="1.2" />
            <circle cx="16" cy="15" r="2" fill="#FEF08A" />
          </g>
        );

      // ─── ACESSÓRIOS ───
      case 'ring_quartz':
        return (
          <g>
            {/* Anel do Cristal de Quartzo */}
            <circle cx="16" cy="18" r="8" fill="none" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Cristal facetado no topo */}
            <polygon points="16,6 20,9 18,13 14,13 12,9" fill="#38BDF8" stroke="#E0F2FE" strokeWidth="1.2" />
          </g>
        );

      case 'amulet_entropy':
        return (
          <g>
            {/* Corrente do amuleto */}
            <path d="M10 6 C13 12 19 12 22 6" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
            {/* Pingente de baixa entropia */}
            <polygon points="16,12 22,17 19,25 13,25 10,17" fill="#701A75" stroke="#EC4899" strokeWidth="1.5" />
            <circle cx="16" cy="19" r="3" fill="#F43F5E" />
          </g>
        );

      case 'quantum_matrix':
        return (
          <g>
            {/* Matriz Espectral do Leopoldina (Relíquia) */}
            <rect x="7" y="7" width="18" height="18" rx="4" transform="rotate(45 16 16)" fill="#18181B" stroke="#FACC15" strokeWidth="2" />
            <rect x="10" y="10" width="12" height="12" rx="2" fill="#3B0764" stroke="#C084FC" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="3.5" fill="#FACC15" />
            <circle cx="16" cy="16" r="1.5" fill="#FFFFFF" />
          </g>
        );

      // ─── BOTAS (BOOTS) ───
      case 'boots_kinetic':
        return (
          <g>
            <path d="M9 7 L17 7 L18 19 L25 21 L25 26 L8 26 L8 18 Z" fill="#334155" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="8" y1="24" x2="25" y2="24" stroke="#7DD3FC" strokeWidth="2" />
            <circle cx="13" cy="13" r="1.5" fill="#38BDF8" />
          </g>
        );

      case 'boots_magma':
        return (
          <g>
            <path d="M9 6 L18 6 L19 18 L26 21 L26 26 L8 26 L8 17 Z" fill="#450A0A" stroke="#F97316" strokeWidth="1.8" />
            <path d="M8 24 L26 24" stroke="#FACC15" strokeWidth="2.5" />
            <path d="M12 11 L16 15 L12 19" fill="none" stroke="#FB923C" strokeWidth="1.5" />
          </g>
        );

      case 'boots_quantum':
        return (
          <g>
            <path d="M9 6 L18 6 L19 18 L26 20 L26 26 L7 26 L7 17 Z" fill="#2E1065" stroke="#C084FC" strokeWidth="1.8" />
            <path d="M5 14 L9 14 M4 18 L8 18" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="7" y1="24" x2="26" y2="24" stroke="#F472B6" strokeWidth="2.5" />
          </g>
        );

      // ─── RELÍQUIAS (RELICS) ───
      case 'relic_hourglass':
        return (
          <g>
            <polygon points="9,6 23,6 16,16 23,26 9,26 16,16" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="7" y1="6" x2="25" y2="6" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="7" y1="26" x2="25" y2="26" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="16" cy="16" r="2" fill="#FEF08A" />
          </g>
        );

      case 'relic_codex':
        return (
          <g>
            <rect x="8" y="5" width="16" height="22" rx="2" fill="#3B0764" stroke="#A855F7" strokeWidth="1.8" />
            <line x1="11" y1="5" x2="11" y2="27" stroke="#C084FC" strokeWidth="1.2" />
            <polygon points="17,11 21,16 17,21 13,16" fill="#10B981" stroke="#6EE7B7" strokeWidth="1" />
          </g>
        );

      case 'relic_core':
        return (
          <g>
            <polygon points="16,4 26,11 23,24 9,24 6,11" fill="#4C1D95" stroke="#FACC15" strokeWidth="1.8" />
            <circle cx="16" cy="15" r="5" fill="#F43F5E" stroke="#FEF08A" strokeWidth="1.5" />
            <circle cx="16" cy="15" r="2" fill="#FFFFFF" />
          </g>
        );

      default:
        return (
          <circle cx="16" cy="16" r="8" fill="#3F3F46" stroke={glowColor} strokeWidth="1.5" />
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={`shrink-0 ${className}`}
      style={{ filter: `drop-shadow(0 0 4px ${glowColor}40)` }}
    >
      {renderIconContent()}
    </svg>
  );
};
