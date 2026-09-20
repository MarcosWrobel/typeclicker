import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';
import { Crosshair, Shield, Zap, Radio, Compass, AlertCircle } from 'lucide-react';

export const StarWarsCockpitLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  overlays,
  appBgClass = 'bg-[#030712]'
}) => {
  return (
    <div className={`min-h-screen ${appBgClass} text-amber-100 flex flex-col font-mono select-none overflow-x-hidden p-1 sm:p-2 md:p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a0f1d] via-[#050811] to-[#010206]`}>
      {overlays}

      {/* Cockpit Canopy Frame */}
      <div className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col border-2 border-amber-500/40 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.15)] relative overflow-hidden bg-stone-950/70 backdrop-blur-md min-w-0">
        {/* Canopy Struts & Crosshairs */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-400 z-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-400 z-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-400 z-30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-400 z-30 pointer-events-none" />

        {/* Cockpit Top Targeting HUD */}
        <div className="bg-[#0e121e] border-b border-amber-500/30 px-3 sm:px-6 py-2 flex items-center justify-between text-[11px] sm:text-xs flex-shrink-0 min-w-0">
          <div className="flex items-center gap-2.5 text-amber-400 min-w-0 truncate">
            <Crosshair className="w-4 h-4 text-amber-300 animate-spin flex-shrink-0" style={{ animationDuration: '20s' }} />
            <span className="font-bold tracking-widest uppercase truncate">
              T-65 COCKPIT HUD // TARGETING SYSTEM ARMED
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-mono flex-shrink-0">
            <span className="hidden sm:flex items-center gap-1.5 text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              S-FOILS: ATTACK
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
              <Zap className="w-3 h-3 text-amber-400" />
              HYPERDRIVE: READY
            </span>
            <span className="flex items-center gap-1 text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              DEFLECTORS 100%
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="flex-shrink-0">
          {header}
        </div>

        {/* 3-Column Flight Station */}
        <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y lg:divide-y-0 lg:divide-x divide-amber-500/20 min-w-0">
          {/* Left: Navicomputer & Astromech */}
          <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 bg-[#080d1a]/80">
            <div className="bg-amber-950/40 px-3 py-1.5 border-b border-amber-500/30 text-[10px] font-bold text-amber-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ ASTROMECH R2 TELEMETRY ]</span>
              <span className="text-cyan-400">SYNC OK</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
          </div>

          {/* Center: Main Viewport & Targeting Console */}
          <div className="flex-1 min-w-0 flex flex-col bg-[#050711] overflow-y-auto">
            <div className="bg-amber-950/40 px-4 py-1.5 border-b border-amber-500/30 text-[10px] font-bold text-amber-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ CANOPY TARGETING COMPUTER ]</span>
              <span className="text-amber-400 flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-400" /> LOCK ON TARGET
              </span>
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-center">{arena}</div>
          </div>

          {/* Right: Munitions & Torpedo Bay */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0 bg-[#080d1a]/80">
            <div className="bg-amber-950/40 px-3 py-1.5 border-b border-amber-500/30 text-[10px] font-bold text-amber-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ PROTON TORPEDO BAY ]</span>
              <span className="text-emerald-400">LOADED</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
          </div>
        </main>

        {/* Cockpit Lower Bar */}
        <footer className="bg-[#070b16] border-t border-amber-500/30 px-3 sm:px-6 py-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-amber-300/70 font-mono flex-shrink-0">
          <div className="flex items-center gap-3">
            <span>GALACTIC COORDINATES: 0-0-0</span>
            <span className="hidden sm:inline">SUB-LIGHT: SUB-SONIC SPEED</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-amber-400 animate-pulse" />
            <span className="text-amber-400 truncate">MAY THE FORCE BE WITH YOU</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
