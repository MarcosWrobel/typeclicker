import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';
import { HardDrive, Monitor, Trash2 } from 'lucide-react';

export const MacClassicLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  overlays,
  appBgClass = 'bg-[#2b2d30]'
}) => {
  return (
    <div className={`min-h-screen ${appBgClass} text-black flex flex-col font-mono select-none overflow-x-hidden p-1 sm:p-2 md:p-4 bg-[#232528]`}>
      {overlays}

      {/* Carcaça Vintage Bege / Platinum do Macintosh 1984 */}
      <div className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col bg-[#e6e2d8] border-4 border-[#59554d] rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] overflow-hidden text-black min-w-0">
        {/* Barra de Menus Superior do Sistema (System 1.0 Top Menu Bar) */}
        <div className="bg-white border-b-2 border-black px-2.5 sm:px-3 py-1 flex items-center justify-between text-xs font-bold select-none text-black flex-shrink-0 min-w-0">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0 truncate">
            <span className="text-base cursor-pointer hover:opacity-75 flex-shrink-0"></span>
            <span className="cursor-pointer hover:underline">File</span>
            <span className="cursor-pointer hover:underline">Edit</span>
            <span className="cursor-pointer hover:underline">View</span>
            <span className="cursor-pointer hover:underline hidden sm:inline">Special</span>
            <span className="hidden md:inline font-normal text-zinc-600">|</span>
            <span className="hidden md:inline font-normal text-zinc-800 text-[11px] truncate">
              TypeClicker Leopoldina // System 1.0
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono text-zinc-800 flex-shrink-0">
            <span className="hidden sm:flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" /> 400K
            </span>
            <span className="bg-black text-white px-2 py-0.5 rounded text-[10px]">
              128K RAM
            </span>
          </div>
        </div>

        {/* Header do Jogo em Envelope Macintosh */}
        <div className="bg-[#f0ece1] border-b-2 border-black flex-shrink-0">
          {header}
        </div>

        {/* Janelas Clássicas do Finder (3 Colunas) */}
        <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-black bg-[#d9d4c7] min-w-0">
          {/* Janela 1: Informações do Aluno */}
          <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 bg-[#f5f2ea]">
            <div className="bg-white border-b-2 border-black px-2 py-1 flex items-center justify-between flex-shrink-0">
              <div className="w-3.5 h-3.5 border-2 border-black bg-white" />
              <div className="font-bold text-[11px] uppercase tracking-wider text-black truncate px-1">
                === Status_Aluno ===
              </div>
              <div className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
          </div>

          {/* Janela 2: Aplicativo de Digitação Principal */}
          <div className="flex-1 min-w-0 flex flex-col bg-white overflow-y-auto">
            <div className="bg-white border-b-2 border-black px-3 py-1 flex items-center justify-between flex-shrink-0">
              <div className="w-3.5 h-3.5 border-2 border-black bg-white" />
              <div className="font-bold text-[11px] uppercase tracking-wider text-black flex items-center gap-1.5 truncate px-1">
                <Monitor className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">=== Arena_Datilografia.app ===</span>
              </div>
              <div className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-center">{arena}</div>
          </div>

          {/* Janela 3: Extensões & Loja */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0 bg-[#f5f2ea]">
            <div className="bg-white border-b-2 border-black px-2 py-1 flex items-center justify-between flex-shrink-0">
              <div className="w-3.5 h-3.5 border-2 border-black bg-white" />
              <div className="font-bold text-[11px] uppercase tracking-wider text-black truncate px-1">
                === Extensoes_Desk ===
              </div>
              <div className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
          </div>
        </main>

        {/* Rodapé do Desktop Mac Clássico */}
        <footer className="bg-white border-t-2 border-black px-3 sm:px-4 py-1 flex items-center justify-between text-[11px] text-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-black" />
            <span className="font-bold">Lixeira</span>
          </div>
          <div className="font-mono text-[10px] text-zinc-600 truncate">
            © 1984 Macintosh // Leopoldina Educa
          </div>
        </footer>
      </div>
    </div>
  );
};
