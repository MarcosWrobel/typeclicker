import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';

export const BiosLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  overlays
}) => {
  return (
    <div className="min-h-screen bg-[#0000aa] text-white font-mono select-none overflow-x-hidden p-1 sm:p-2 md:p-3 flex flex-col justify-between">
      {overlays}

      {/* Moldura ASCII Superior da BIOS */}
      <div className="w-full max-w-7xl mx-auto flex flex-col flex-shrink-0 min-w-0">
        <div className="text-[#ffff55] text-xs sm:text-sm font-bold truncate leading-tight select-none overflow-hidden">
          ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
        </div>
        <div className="bg-[#000088] px-2 sm:px-3 py-1 flex items-center justify-between border-x border-[#ffff55] text-[11px] sm:text-xs">
          <span className="text-[#ffff55] font-black uppercase tracking-wider truncate">
            ROM PCI/ISA BIOS (2A69KC0) • CMOS SETUP UTILITY • LEOPOLDINA
          </span>
          <span className="text-white hidden sm:inline font-bold flex-shrink-0 ml-2">
            AWARD SOFTWARE, INC.
          </span>
        </div>
        <div className="text-[#ffff55] text-xs sm:text-sm font-bold truncate leading-tight select-none overflow-hidden">
          ╠══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
        </div>
      </div>

      {/* Header do Jogo adaptado */}
      <div className="w-full max-w-7xl mx-auto border-x border-[#ffff55] bg-[#0000aa] flex-shrink-0 min-w-0">
        {header}
      </div>

      {/* Layout Principal de 3 Colunas com bordas ASCII em volta dos módulos */}
      <main className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col lg:flex-row items-stretch border-x border-[#ffff55] bg-[#0000aa] min-w-0">
        {/* Coluna 1: Diagnóstico de Hardware (Sidebar) */}
        <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 border-b lg:border-b-0 lg:border-r border-[#55ffff]/40">
          <div className="bg-[#00aaaa] text-black px-2 py-0.5 text-xs font-black uppercase flex-shrink-0">
            [ SYSTEM DIAGNOSTICS & TELEMETRY ]
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {sidebar}
          </div>
        </div>

        {/* Coluna 2: Arena Central de Instruções (Arena) */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto border-b lg:border-b-0 lg:border-r border-[#55ffff]/40">
          <div className="bg-[#00aaaa] text-black px-2 py-0.5 text-xs font-black uppercase flex-shrink-0">
            [ CPU INSTRUCTION BUFFER EXECUTION ]
          </div>
          <div className="flex-1 min-h-0 flex flex-col justify-center">
            {arena}
          </div>
        </div>

        {/* Coluna 3: Módulos de Expansão e Chips (Shop) */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0">
          <div className="bg-[#00aaaa] text-black px-2 py-0.5 text-xs font-black uppercase flex-shrink-0">
            [ CO-PROCESSOR & CACHE EXPANSION ]
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {shop}
          </div>
        </div>
      </main>

      {/* Barra de Status e Teclas de Atalho Inferior da BIOS */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col flex-shrink-0 min-w-0">
        <div className="text-[#ffff55] text-xs sm:text-sm font-bold truncate leading-tight select-none overflow-hidden">
          ╠══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣
        </div>
        <div className="bg-[#000088] px-2 sm:px-3 py-1 border-x border-b border-[#ffff55] flex flex-wrap items-center justify-between gap-1 sm:gap-2 text-[10px] sm:text-[11px]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[#ffff55]">
            <span><strong className="text-white">ESC</strong>: Pause</span>
            <span><strong className="text-white">ENTER</strong>: Confirm</span>
            <span><strong className="text-white">F10</strong>: Save & Exit</span>
          </div>
          <div className="text-white/80 font-bold truncate">
            CHIPSET: 82430VX • SYSTEM RAM: 640K OK
          </div>
        </div>
        <div className="text-[#ffff55] text-xs sm:text-sm font-bold truncate leading-tight select-none overflow-hidden">
          ╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝
        </div>
      </footer>
    </div>
  );
};
