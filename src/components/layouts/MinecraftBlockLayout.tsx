import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';
import { Box, Sparkles, Shield, Heart, Hammer } from 'lucide-react';

export const MinecraftBlockLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  overlays,
  appBgClass = 'bg-[#181412]'
}) => {
  return (
    <div className={`min-h-screen ${appBgClass} text-stone-200 flex flex-col font-mono select-none overflow-x-hidden p-1 sm:p-2 md:p-4 bg-[#14110e]`}>
      {overlays}

      {/* Frame estilo GUI Minecraft com borda de pedra entalhada */}
      <div className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col border-4 border-[#4a423a] shadow-[inset_0_4px_#5e544a,inset_0_-4px_#27221e,0_8px_24px_rgba(0,0,0,0.8)] rounded-none relative overflow-hidden bg-[#24201c] min-w-0">
        {/* Cantoneiras Pixeladas */}
        <div className="absolute top-0 left-0 w-3 h-3 bg-[#5e544a] z-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-3 h-3 bg-[#27221e] z-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#5e544a] z-30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#27221e] z-30 pointer-events-none" />

        {/* Barra Superior - Status & Vida / Armadura */}
        <div className="bg-[#1b1815] border-b-4 border-[#332c26] px-3 sm:px-6 py-2 flex items-center justify-between text-[11px] sm:text-xs flex-shrink-0 min-w-0">
          <div className="flex items-center gap-2 text-emerald-400 font-bold min-w-0 truncate tracking-wide">
            <Box className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="uppercase truncate">
              LEOPOLDINA CRAFT // OVERWORLD TERMINAL
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-mono flex-shrink-0">
            <div className="flex items-center gap-1 text-red-500 font-bold bg-red-950/40 px-2 py-0.5 border-2 border-red-800">
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              <span>20/20</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 border-2 border-cyan-800">
              <Shield className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>DIAMOND</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 border-2 border-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>XP LVL 100</span>
            </div>
          </div>
        </div>

        {/* Header do Jogo */}
        <div className="flex-shrink-0">
          {header}
        </div>

        {/* Grid 3 Colunas Estilo Inventário & Bancada */}
        <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-[#332c26] min-w-0">
          {/* Esquerda: Baú / Inventário */}
          <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 bg-[#211d19]">
            <div className="bg-[#1b1815] px-3 py-1.5 border-b-2 border-[#332c26] text-[10px] font-bold text-stone-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ INVENTÁRIO DO JOGADOR ]</span>
              <span className="text-amber-400">SLOTS: 36/36</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
          </div>

          {/* Centro: Mesa de Trabalho / Bigorna */}
          <div className="flex-1 min-w-0 flex flex-col bg-[#1c1916] overflow-y-auto">
            <div className="bg-[#1b1815] px-4 py-1.5 border-b-2 border-[#332c26] text-[10px] font-bold text-cyan-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span className="flex items-center gap-1.5">
                <Hammer className="w-3.5 h-3.5 text-cyan-400" />
                <span>BANCADA DE CRIAÇÃO & TECLADO</span>
              </span>
              <span className="text-emerald-400 font-bold">RECEITA PRONTA</span>
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-center">{arena}</div>
          </div>

          {/* Direita: Trocas com Aldeões */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0 bg-[#211d19]">
            <div className="bg-[#1b1815] px-3 py-1.5 border-b-2 border-[#332c26] text-[10px] font-bold text-emerald-300 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ MERCADO DE ESMERALDAS ]</span>
              <span className="text-amber-400 font-bold">ESMERALDAS: OK</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
          </div>
        </main>

        {/* Rodapé - Barra de Experiência Verde */}
        <footer className="bg-[#181412] border-t-4 border-[#332c26] px-3 sm:px-6 py-2 flex items-center justify-between text-[10px] sm:text-[11px] text-stone-400 font-mono flex-shrink-0">
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-emerald-400 font-black">EXP:</span>
            <div className="flex-1 h-2.5 bg-black border border-[#4a423a] rounded-none overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-lime-500 to-emerald-400 w-4/5 animate-pulse" />
            </div>
          </div>
          <div className="text-emerald-400 font-bold hidden sm:block">
            BIOMA: MINERADOR DE DIAMANTES
          </div>
        </footer>
      </div>
    </div>
  );
};
