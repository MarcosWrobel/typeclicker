import React from 'react';
import { Zap } from 'lucide-react';
import { RADAR_COMMANDS } from '../../../data/radarWords';
import { getRadarIcon } from './RadarIcons';

interface TriggerDeckProps {
  currentEnergy: number;
  onExecuteCommand: (keyword: string) => void;
  className?: string;
  nukeDiscount?: boolean;
}

export const TriggerDeck: React.FC<TriggerDeckProps> = ({
  currentEnergy,
  onExecuteCommand,
  className = '',
  nukeDiscount = false
}) => {
  const isEnergyFull = currentEnergy >= 100;

  return (
    <div
      className={`relative bg-[#0b0e15]/98 border-2 transition-all duration-300 rounded-2xl p-2.5 sm:p-3 shadow-[0_8px_32px_rgba(0,0,0,0.85)] flex flex-col items-center gap-2 ${
        isEnergyFull
          ? 'border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.35)]'
          : 'border-zinc-800/90'
      } ${className}`}
    >
      {/* Detalhe de parafusos chanfrados nos 4 cantos do painel físico */}
      <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-zinc-700/80 border border-zinc-900" />
      <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-zinc-700/80 border border-zinc-900" />
      <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-zinc-700/80 border border-zinc-900" />
      <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-zinc-700/80 border border-zinc-900" />

      {/* Faixa de Alerta: Efeito de Energia Completa (100%) */}
      {isEnergyFull && (
        <div className="w-full py-0.5 px-3 rounded-lg bg-amber-500/15 border border-amber-400/40 text-amber-300 font-mono text-[9px] font-black tracking-widest flex items-center justify-center gap-1.5 animate-pulse shadow-sm">
          <Zap className="w-3 h-3 text-amber-400 fill-current animate-bounce" />
          <span>ENERGIA MÁXIMA (100%) • SOBRECARGA PRONTA PARA DISPARO</span>
          <Zap className="w-3 h-3 text-amber-400 fill-current animate-bounce" />
        </div>
      )}

      {/* Grid Centralizado de Gatilhos */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap w-full">
        {RADAR_COMMANDS.map((cmd) => {
          let actualCost = cmd.energyCost;
          if (cmd.keyword === '/NUKE' && nukeDiscount) {
            actualCost = 75;
          }

          const isReady = currentEnergy >= actualCost;

          // Estilos específicos para cada comando
          const theme = {
            '/NUKE': {
              borderReady: isEnergyFull
                ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.8)]'
                : 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
              bgReady: 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300',
              iconColor: '#fbbf24',
              accent: 'text-amber-400'
            },
            '/FREEZE': {
              borderReady: isEnergyFull
                ? 'border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.8)]'
                : 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]',
              bgReady: 'bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300',
              iconColor: '#22d3ee',
              accent: 'text-cyan-400'
            },
            '/SHIELD': {
              borderReady: isEnergyFull
                ? 'border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.8)]'
                : 'border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]',
              bgReady: 'bg-sky-950/40 hover:bg-sky-900/60 text-sky-300',
              iconColor: '#38bdf8',
              accent: 'text-sky-400'
            },
            '/EMP': {
              borderReady: isEnergyFull
                ? 'border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.8)]'
                : 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]',
              bgReady: 'bg-yellow-950/40 hover:bg-yellow-900/60 text-yellow-300',
              iconColor: '#facc15',
              accent: 'text-yellow-400'
            }
          }[cmd.keyword] || {
            borderReady: 'border-emerald-400',
            bgReady: 'bg-emerald-950/40',
            iconColor: '#34d399',
            accent: 'text-emerald-400'
          };

          return (
            <button
              key={cmd.keyword}
              type="button"
              onClick={() => onExecuteCommand(cmd.keyword)}
              disabled={!isReady}
              className={`relative flex flex-col items-center justify-center min-w-[78px] sm:min-w-[92px] px-3 py-2 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                isReady
                  ? `${theme.borderReady} ${theme.bgReady} active:scale-95 ${isReady ? 'animate-pulse' : ''}`
                  : 'border-zinc-800 bg-zinc-950/60 text-zinc-600 cursor-not-allowed opacity-50'
              }`}
              title={`${cmd.name}: ${cmd.description} (${actualCost}% de Energia)`}
            >
              {/* Ícone SVG Próprio */}
              <div className="flex items-center justify-center my-0.5">
                {getRadarIcon(cmd.keyword, {
                  size: 24,
                  color: isReady ? theme.iconColor : '#52525b'
                })}
              </div>

              {/* Keyword do Comando */}
              <span
                className={`font-mono font-black text-xs tracking-tight ${
                  isReady ? 'text-white' : 'text-zinc-500'
                }`}
              >
                {cmd.keyword}
              </span>

              {/* Custo de Energia */}
              <span
                className={`text-[9px] font-mono font-semibold ${
                  isReady ? theme.accent : 'text-zinc-600'
                }`}
              >
                ({actualCost}%)
              </span>

              {/* LED Indicador de Prontidão no topo do gatilho */}
              <div
                className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${
                  isReady ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-zinc-700'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
