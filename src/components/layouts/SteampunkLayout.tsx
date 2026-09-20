import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';
import { Cog, Flame, Gauge, Wrench } from 'lucide-react';

export const SteampunkLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  overlays,
  appBgClass = 'bg-[#150e0a]'
}) => {
  return (
    <div className={`min-h-screen ${appBgClass} text-amber-100 flex flex-col font-serif select-none overflow-x-hidden p-1 sm:p-2 md:p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2a170d] via-[#170e08] to-[#0d0704]`}>
      {overlays}

      {/* Chassi de Cobre e Latão Rebitado */}
      <div className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col border-4 border-amber-700/70 rounded-2xl shadow-[0_0_40px_rgba(217,119,6,0.25)] relative overflow-hidden bg-[#1a110a]/90 backdrop-blur-md min-w-0">
        {/* Rebites Decorativos de Latão nos Cantos */}
        <div className="absolute top-2 left-2 flex gap-1 z-30 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-amber-400/80 shadow-inner" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-amber-400/80 shadow-inner" />
        </div>
        <div className="absolute top-2 right-2 flex gap-1 z-30 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-amber-400/80 shadow-inner" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-amber-400/80 shadow-inner" />
        </div>
        <div className="absolute bottom-2 left-2 flex gap-1 z-30 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-amber-400/80 shadow-inner" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-amber-400/80 shadow-inner" />
        </div>
        <div className="absolute bottom-2 right-2 flex gap-1 z-30 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-amber-400/80 shadow-inner" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 border border-amber-400/80 shadow-inner" />
        </div>

        {/* Topo Mecânico Industrial */}
        <div className="bg-[#24150b] border-b-2 border-amber-700/60 px-3 sm:px-6 py-2 flex items-center justify-between text-xs flex-shrink-0 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 text-amber-300 min-w-0 truncate">
            <Cog className="w-4 sm:w-5 h-4 sm:h-5 text-amber-500 animate-spin flex-shrink-0" style={{ animationDuration: '10s' }} />
            <span className="font-bold tracking-widest uppercase truncate font-mono text-[10px] sm:text-xs">
              OFICINA MECÂNICA A VAPOR // PATENTE 1889
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-mono flex-shrink-0">
            <span className="hidden sm:flex items-center gap-1 text-amber-200 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40">
              <Gauge className="w-3 h-3 text-amber-400" />
              142 PSI
            </span>
            <span className="flex items-center gap-1 text-orange-300 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-600/40 font-bold">
              <Flame className="w-3 h-3 text-orange-400 animate-pulse" />
              CALDEIRA OK
            </span>
          </div>
        </div>

        {/* Header do Jogo */}
        <div className="flex-shrink-0">
          {header}
        </div>

        {/* Grid dos Módulos Industriais */}
        <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y lg:divide-y-0 lg:divide-x-2 divide-amber-800/40 min-w-0">
          {/* Manômetros & Engrenagens / Sidebar */}
          <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 bg-[#160d07]">
            <div className="bg-amber-950/40 px-3 py-1.5 border-b border-amber-700/40 text-[10px] font-bold font-mono text-amber-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>⚙ ENGRENAGENS</span>
              <span className="text-amber-400">180 RPM</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
          </div>

          {/* Câmara Principal: Pistões de Digitação / Arena */}
          <div className="flex-1 min-w-0 flex flex-col bg-[#1d120a] overflow-y-auto">
            <div className="bg-amber-950/40 px-4 py-1.5 border-b border-amber-700/40 text-[10px] font-bold font-mono text-amber-200 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>⚡ CÂMARA DE TIPOGRAFIA A VAPOR</span>
              <span className="text-amber-400 flex items-center gap-1">
                <Wrench className="w-3 h-3 text-amber-400" /> AJUSTE FINO
              </span>
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-center">{arena}</div>
          </div>

          {/* Depósito de Peças / Loja */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0 bg-[#160d07]">
            <div className="bg-amber-950/40 px-3 py-1.5 border-b border-amber-700/40 text-[10px] font-bold font-mono text-amber-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>🔧 OFICINA DE VÁLVULAS</span>
              <span className="text-amber-400">OK</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
          </div>
        </main>

        {/* Rodapé Industrial */}
        <footer className="bg-[#1a0f08] border-t-2 border-amber-700/60 px-3 sm:px-6 py-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-amber-400/80 font-mono flex-shrink-0">
          <div className="flex items-center gap-2">
            <span>REGULADOR: NOMINAL</span>
            <span className="hidden sm:inline">VAPOR ATIVO</span>
          </div>
          <div className="font-serif italic text-amber-300 truncate">
            Fundição Leopoldina & Cia.
          </div>
        </footer>
      </div>
    </div>
  );
};
