import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';

export const ArcadeLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  overlays,
  appBgClass = 'bg-[#0f0c08]'
}) => {
  return (
    <div className={`min-h-screen ${appBgClass} text-zinc-100 flex flex-col font-mono select-none overflow-x-hidden p-1 sm:p-2 md:p-4 bg-gradient-to-b from-[#140b08] via-[#0d090a] to-[#080506]`}>
      {overlays}

      {/* Gabinete de Fliperama Externo */}
      <div className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col bg-[#181312] border-4 sm:border-6 border-[#3d271d] rounded-2xl sm:rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(0,0,0,0.8)] overflow-hidden min-w-0">
        {/* Letreiro Luminoso do Topo (Arcade Marquee) */}
        <header className="bg-gradient-to-r from-red-950 via-amber-950 to-orange-950 border-b-4 border-[#4a2e22] px-3 sm:px-4 py-2 flex items-center justify-between shadow-inner relative overflow-hidden flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg font-black tracking-widest text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] flex items-center gap-2 truncate">
                <span>★ TYPECLICKER ARCADE 1984 ★</span>
              </h1>
              <span className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider truncate">
                Colégio Leopoldina Pedroso • Edição de Gabinete
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="px-2 sm:px-2.5 py-1 rounded bg-black/60 border border-amber-500/50 text-[10px] sm:text-[11px] text-amber-300 font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              <span className="animate-pulse">🪙</span>
              <span className="hidden sm:inline">INSERT TOKEN:</span>
              <span className="text-emerald-400">1P READY</span>
            </div>
          </div>
        </header>

        {/* Header padrão do jogo integrado */}
        <div className="flex-shrink-0">
          {header}
        </div>

        {/* Tela CRT Curva com Scanlines e Conteúdo do Jogo */}
        <div className="relative flex-1 min-h-0 flex flex-col lg:flex-row items-stretch bg-black/50 overflow-hidden min-w-0">
          {/* Camada de Scanlines Dinâmicas CSS */}
          <div
            className="pointer-events-none absolute inset-0 z-30 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.5) 50%)',
              backgroundSize: '100% 4px'
            }}
          />

          {/* Sombra de Curvatura CRT */}
          <div className="pointer-events-none absolute inset-0 z-30 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]" />

          {/* Áreas do Jogo (Grid de 3 Colunas) */}
          <div className="relative z-20 flex-1 min-h-0 flex flex-col lg:flex-row items-stretch w-full min-w-0 divide-y lg:divide-y-0 lg:divide-x divide-[#3d271d]/60">
            {/* Coluna 1: Sidebar */}
            <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 bg-black/40 overflow-y-auto">
              {sidebar}
            </div>

            {/* Coluna 2: Arena Central */}
            <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
              {arena}
            </div>

            {/* Coluna 3: Loja de Upgrades */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0 bg-black/40 overflow-y-auto">
              {shop}
            </div>
          </div>
        </div>

        {/* Deck de Controle Inferior do Fliperama (Botões e Moedeiro) */}
        <footer className="bg-gradient-to-t from-[#150f0e] to-[#251713] border-t-4 border-[#3d271d] px-3 sm:px-4 py-1.5 sm:py-2.5 flex items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Joystick decorativo */}
            <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-lg border border-zinc-800">
              <span className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-[0_0_8px_#ef4444]" />
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">1P</span>
            </div>

            {/* 4 Botões Arcade Iluminados */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444] border border-red-300" title="Botão A" />
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] border border-amber-200" title="Botão B" />
              <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6] border border-blue-300" title="Botão C" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] border border-emerald-300" title="Botão D" />
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] text-amber-300/80 uppercase font-mono tracking-widest flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
            <span className="truncate">CRÉDITOS ILIMITADOS • MODO ESCOLAR</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
