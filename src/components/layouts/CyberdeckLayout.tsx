import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';

export const CyberdeckLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  overlays,
  appBgClass = 'bg-[#070a14]'
}) => {
  return (
    <div className={`min-h-screen ${appBgClass} text-cyan-100 flex flex-col font-mono select-none overflow-x-hidden p-1 sm:p-2 md:p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0d162d] via-[#080d1a] to-[#04060d]`}>
      {overlays}

      {/* Cyberdeck Outer Tactical Frame */}
      <div className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col border-2 border-cyan-500/50 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden bg-black/40 backdrop-blur-md min-w-0">
        {/* Cantoneiras HUD Táticas Militares */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-30 pointer-events-none" />

        {/* Top Cyberdeck Banner */}
        <div className="bg-[#0b1326] border-b border-cyan-500/40 px-3 sm:px-6 py-2 flex items-center justify-between text-[11px] sm:text-xs flex-shrink-0 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 text-cyan-300 min-w-0 truncate">
            <span className="w-2.5 h-2.5 bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee] flex-shrink-0" />
            <span className="font-bold tracking-widest uppercase truncate">
              CYBERDECK NET-INTRUDER RIG // MIL-SPEC v4.9
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-pink-400 font-bold flex-shrink-0">
            <span className="hidden sm:inline bg-pink-950/60 px-2 py-0.5 rounded border border-pink-500/40">
              NEURAL SYNC: 99.8%
            </span>
            <span className="text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
              ICE READY
            </span>
          </div>
        </div>

        {/* Header do Jogo */}
        <div className="flex-shrink-0">
          {header}
        </div>

        {/* Grid de 3 Colunas com Bordas de Interface Tática */}
        <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y lg:divide-y-0 lg:divide-x divide-cyan-500/20 min-w-0">
          {/* Coluna 1: Sidebar */}
          <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 bg-black/40">
            <div className="bg-cyan-950/60 px-3 py-1 border-b border-cyan-500/30 text-[10px] font-bold text-cyan-300 tracking-wider flex-shrink-0">
              [ 01 // TELEMETRY & NODES ]
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
          </div>

          {/* Coluna 2: Arena Central */}
          <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
            <div className="bg-cyan-950/60 px-3 py-1 border-b border-cyan-500/30 text-[10px] font-bold text-cyan-300 tracking-wider flex-shrink-0">
              [ 02 // NEURAL INPUT BUFFER ]
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-center">{arena}</div>
          </div>

          {/* Coluna 3: Shop */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0 bg-black/40">
            <div className="bg-cyan-950/60 px-3 py-1 border-b border-cyan-500/30 text-[10px] font-bold text-cyan-300 tracking-wider flex-shrink-0">
              [ 03 // HARDWARE MODULES ]
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
          </div>
        </main>

        {/* Rodapé Tático */}
        <footer className="bg-[#080d1a] border-t border-cyan-500/30 px-3 sm:px-4 py-1.5 flex items-center justify-between text-[10px] text-cyan-400/80 flex-shrink-0">
          <span>PORT: 8080 // FIREWALL STATUS: BYPASSED</span>
          <span className="font-mono text-pink-400 truncate ml-2">TYPECLICKER • LEOPOLDINA RIG</span>
        </footer>
      </div>
    </div>
  );
};
