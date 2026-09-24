import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RADAR_UPGRADES_POOL, RadarUpgrade } from '../../../services/radarEngine';
import { HexBadge, getRadarIcon } from './RadarIcons';

interface PassivesPanelProps {
  upgrades: Record<string, number>;
  className?: string;
}

export const PassivesPanel: React.FC<PassivesPanelProps> = ({ upgrades, className = '' }) => {
  // Coletar todas as passivas adquiridas com contagem > 0
  const activeUpgrades: { upgrade: RadarUpgrade; count: number }[] = [];
  
  Object.entries(upgrades).forEach(([id, val]) => {
    const count = typeof val === 'number' ? val : Number(val);
    if (count > 0) {
      const found = RADAR_UPGRADES_POOL.find((u) => u.id === id);
      if (found) {
        activeUpgrades.push({ upgrade: found, count });
      }
    }
  });

  return (
    <div
      className={`bg-[#080b11]/95 backdrop-blur-md border-2 border-zinc-800/90 rounded-2xl p-3 shadow-[0_6px_28px_rgba(0,0,0,0.8)] flex flex-col font-mono select-none relative ${className}`}
    >
      {/* Detalhe de parafusos chanfrados nos cantos */}
      <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-zinc-700/80 border border-zinc-900" />
      <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-zinc-700/80 border border-zinc-900" />
      <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-zinc-700/80 border border-zinc-900" />
      <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-zinc-700/80 border border-zinc-900" />

      {/* Cabeçalho do Painel Lateral */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
            MÓDULOS PASSIVOS
          </span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-750 text-zinc-400 font-bold">
          [{activeUpgrades.length}]
        </span>
      </div>

      {/* Conteúdo: Lista Vertical de Módulos ou Modo Standby */}
      {activeUpgrades.length === 0 ? (
        <div className="py-6 px-3 text-center rounded-xl bg-black/40 border border-zinc-850/60 text-[10px] text-zinc-500 flex flex-col items-center justify-center gap-2 my-auto">
          <span className="w-2 h-2 rounded-full bg-zinc-600 animate-ping mb-1" />
          <span className="font-bold text-zinc-400">STANDBY TÁTICO</span>
          <span className="text-[9px] text-zinc-600 leading-tight max-w-[170px]">
            Conclua a onda para selecionar módulos de upgrade de combate.
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[460px] pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
          <AnimatePresence>
            {activeUpgrades.map(({ upgrade, count }) => {
              const rarityTheme = {
                common: {
                  border: 'border-amber-500/30 hover:border-amber-500/60',
                  bg: 'bg-amber-950/20',
                  text: 'text-amber-300',
                  badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                },
                rare: {
                  border: 'border-sky-500/30 hover:border-sky-500/60',
                  bg: 'bg-sky-950/20',
                  text: 'text-sky-300',
                  badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                },
                epic: {
                  border: 'border-emerald-500/30 hover:border-emerald-500/60',
                  bg: 'bg-emerald-950/20',
                  text: 'text-emerald-300',
                  badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }
              }[upgrade.rarity];

              return (
                <motion.div
                  key={upgrade.id}
                  initial={{ scale: 0.9, opacity: 0, x: -8 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className={`p-2 rounded-xl border ${rarityTheme.border} ${rarityTheme.bg} transition-all duration-200 flex items-start gap-2.5 relative group shadow-sm`}
                >
                  {/* Badge Hexagonal */}
                  <div className="relative shrink-0 pt-0.5">
                    <HexBadge rarity={upgrade.rarity} size={36}>
                      {getRadarIcon(upgrade.icon, { size: 16, color: 'currentColor' })}
                    </HexBadge>

                    {/* Multiplicador se acumulado */}
                    {count > 1 && (
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-black/95 border border-zinc-600 text-[8px] font-bold text-white shadow-md">
                        x{count}
                      </span>
                    )}
                  </div>

                  {/* Informações da Passiva */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[10px] font-bold truncate ${rarityTheme.text}`}>
                        {upgrade.title}
                      </span>
                    </div>

                    <span className="text-[9px] text-zinc-400 leading-snug line-clamp-2 mt-0.5 font-normal">
                      {upgrade.description}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
