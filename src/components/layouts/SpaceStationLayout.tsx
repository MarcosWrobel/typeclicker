import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';
import { Satellite, Radio, ShieldCheck, Compass, Gauge } from 'lucide-react';

export const SpaceStationLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  overlays,
  appBgClass = 'bg-[#060913]'
}) => {
  return (
    <div className={`min-h-screen ${appBgClass} text-slate-100 flex flex-col font-mono select-none overflow-x-hidden p-1 sm:p-2 md:p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0b1329] via-[#060a17] to-[#020307]`}>
      {overlays}

      {/* Frame Principal da Estação Orbital */}
      <div className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col border border-indigo-500/40 rounded-2xl shadow-[0_0_35px_rgba(99,102,241,0.18)] relative overflow-hidden bg-slate-950/60 backdrop-blur-md min-w-0">
        {/* Cantoneiras HUD Pressurizadas */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-indigo-400 z-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-indigo-400 z-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-indigo-400 z-30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-indigo-400 z-30 pointer-events-none" />

        {/* Top Telemetry & Life Support Bar */}
        <div className="bg-[#0b1124] border-b border-indigo-500/30 px-3 sm:px-6 py-2 flex items-center justify-between text-[11px] sm:text-xs flex-shrink-0 min-w-0">
          <div className="flex items-center gap-2.5 text-indigo-300 min-w-0 truncate">
            <Satellite className="w-4 h-4 text-cyan-400 animate-pulse flex-shrink-0" />
            <span className="font-bold tracking-widest uppercase truncate">
              LEOPOLDINA ORBITAL // DOCKING MODULE A-07
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-mono flex-shrink-0">
            <span className="hidden sm:flex items-center gap-1.5 text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
              <Radio className="w-3 h-3 text-cyan-400 animate-ping" />
              142.8 MHz
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-emerald-300 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
              <Gauge className="w-3 h-3 text-emerald-400" />
              O2: 99%
            </span>
            <span className="flex items-center gap-1 text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/40 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              SHIELDS UP
            </span>
          </div>
        </div>

        {/* Header do Jogo */}
        <div className="flex-shrink-0">
          {header}
        </div>

        {/* Grid de Módulos da Estação */}
        <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y lg:divide-y-0 lg:divide-x divide-indigo-500/20 min-w-0">
          {/* Módulo 01: Telemetria & Sensores */}
          <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 bg-[#080d1e]/80">
            <div className="bg-indigo-950/50 px-3 py-1.5 border-b border-indigo-500/30 text-[10px] font-bold text-indigo-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ MOD-01: TELEMETRY ]</span>
              <span className="text-cyan-400">SYNC OK</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
          </div>

          {/* Módulo 02: Computador Central de Voo / Arena */}
          <div className="flex-1 min-w-0 flex flex-col bg-[#050917] overflow-y-auto">
            <div className="bg-indigo-950/50 px-4 py-1.5 border-b border-indigo-500/30 text-[10px] font-bold text-cyan-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ MOD-02: FLIGHT COMPUTATION & INPUT ]</span>
              <span className="text-indigo-400 flex items-center gap-1">
                <Compass className="w-3 h-3 animate-spin" style={{ animationDuration: '8s' }} /> ORBIT 340 KM
              </span>
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-center">{arena}</div>
          </div>

          {/* Módulo 03: Compartimento de Carga & Requisitos / Loja */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0 bg-[#080d1e]/80">
            <div className="bg-indigo-950/50 px-3 py-1.5 border-b border-indigo-500/30 text-[10px] font-bold text-indigo-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ MOD-03: PAYLOAD & REQUISITIONS ]</span>
              <span className="text-emerald-400">ONLINE</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
          </div>
        </main>

        {/* Rodapé HUD de Voo */}
        <footer className="bg-[#070c1b] border-t border-indigo-500/30 px-3 sm:px-6 py-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-indigo-300/70 font-mono flex-shrink-0">
          <div className="flex items-center gap-3">
            <span>ORBIT: GEO-STATIONARY</span>
            <span className="hidden sm:inline">VELOCITY: 7.66 KM/S</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 truncate">LEOPOLDINA CONTROL</span>
            <span>NOMINAL</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
