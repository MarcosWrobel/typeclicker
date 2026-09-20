import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';
import { Trophy, Zap, Flame, Timer, Activity } from 'lucide-react';

export const SpeedrunLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  overlays,
  appBgClass = 'bg-[#0e0709]'
}) => {
  return (
    <div className={`min-h-screen ${appBgClass} text-zinc-100 flex flex-col font-mono select-none overflow-x-hidden p-1 sm:p-2 md:p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#280c14] via-[#12070a] to-[#080204]`}>
      {overlays}

      {/* Frame Principal do Torneio Esports */}
      <div className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col border-2 border-red-500/50 rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.25)] relative overflow-hidden bg-black/70 backdrop-blur-md min-w-0">
        {/* Faixas Esportivas Chanfradas */}
        <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 z-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 h-1 bg-gradient-to-l from-yellow-500 via-orange-500 to-red-500 z-30 pointer-events-none" />

        {/* Topo do Broadcast Esports */}
        <div className="bg-[#1c080d] border-b-2 border-red-500/40 px-3 sm:px-6 py-2 flex items-center justify-between text-xs flex-shrink-0 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 text-red-400 min-w-0 truncate">
            <span className="flex items-center justify-center w-6 h-6 rounded bg-red-600/30 border border-red-500/60 text-red-300 flex-shrink-0">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            </span>
            <div className="flex items-center gap-2 min-w-0 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping flex-shrink-0" />
              <span className="font-extrabold tracking-widest uppercase truncate text-[11px] sm:text-xs text-white">
                LEOPOLDINA SPEEDRUN ESPORTS // ARENA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] flex-shrink-0">
            <span className="hidden sm:flex items-center gap-1 text-yellow-400 bg-yellow-950/50 px-2 py-0.5 rounded border border-yellow-500/40 font-bold">
              <Zap className="w-3 h-3 text-yellow-400" />
              -0.48s PACE
            </span>
            <span className="flex items-center gap-1 text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40 font-bold">
              <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              TURBO
            </span>
          </div>
        </div>

        {/* Header do Jogo */}
        <div className="flex-shrink-0">
          {header}
        </div>

        {/* Grid dos Setores de Competição */}
        <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y lg:divide-y-0 lg:divide-x-2 divide-red-900/40 min-w-0">
          {/* Setor A: Painel do Jogador & Parciais */}
          <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 bg-[#120508]/90">
            <div className="bg-red-950/60 px-3 py-1.5 border-b border-red-500/30 text-[10px] font-bold text-red-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ SECTOR A: TELEMETRY ]</span>
              <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
          </div>

          {/* Setor B: Pista de Velocidade Central / Arena */}
          <div className="flex-1 min-w-0 flex flex-col bg-[#0b0305] overflow-y-auto">
            <div className="bg-gradient-to-r from-red-950/70 to-orange-950/70 px-4 py-1.5 border-b border-red-500/30 text-[10px] font-bold text-yellow-400 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ SECTOR B: MAIN RUNNER STAGE ]</span>
              <span className="text-orange-400 flex items-center gap-1">
                <Timer className="w-3 h-3" /> TARGET ACTIVE
              </span>
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-center">{arena}</div>
          </div>

          {/* Setor C: Pit Lane & Upgrades */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0 bg-[#120508]/90">
            <div className="bg-red-950/60 px-3 py-1.5 border-b border-red-500/30 text-[10px] font-bold text-red-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ SECTOR C: PIT LANE ]</span>
              <span className="text-yellow-400">READY</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
          </div>
        </main>

        {/* Rodapé da Competição */}
        <footer className="bg-[#120508] border-t-2 border-red-500/40 px-3 sm:px-6 py-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-400 font-mono flex-shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="text-red-400 font-bold">RTA: ACTIVE</span>
            <span className="hidden sm:inline">| ANY% RUN</span>
          </div>
          <div className="text-yellow-400 font-bold truncate">
            🏆 Torneio Interclasses Leopoldina
          </div>
        </footer>
      </div>
    </div>
  );
};
