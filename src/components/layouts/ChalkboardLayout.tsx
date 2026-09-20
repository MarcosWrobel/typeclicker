import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';
import { GraduationCap, BookOpen, Sparkles, Pencil } from 'lucide-react';

export const ChalkboardLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  overlays,
  appBgClass = 'bg-[#0a1813]'
}) => {
  return (
    <div className={`min-h-screen ${appBgClass} text-emerald-50 flex flex-col font-mono select-none overflow-x-hidden p-1 sm:p-2 md:p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#132c23] via-[#0b1c16] to-[#050e0b]`}>
      {overlays}

      {/* Moldura de Madeira Nobre da Lousa Escolar */}
      <div className="w-full max-w-7xl mx-auto flex-1 min-h-0 flex flex-col border-[4px] sm:border-[6px] md:border-8 border-[#854d0e] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] relative overflow-hidden bg-[#142920] min-w-0">
        {/* Cabeçalho da Lousa: Escola & Lição do Dia */}
        <div className="bg-[#0f221a] border-b-2 border-dashed border-emerald-500/30 px-3 sm:px-6 py-2 flex items-center justify-between text-xs text-emerald-200 flex-shrink-0 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 truncate">
            <GraduationCap className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-300 flex-shrink-0" />
            <span className="font-bold tracking-wider uppercase truncate text-[11px] sm:text-xs text-yellow-100">
              ESCOLA MUNICIPAL PROFª LEOPOLDINA // LIÇÃO DO DIA
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] flex-shrink-0">
            <span className="hidden sm:flex items-center gap-1.5 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-600/30 text-emerald-300">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              SALA 104
            </span>
            <span className="flex items-center gap-1 text-yellow-300 font-bold bg-yellow-950/40 px-2 py-0.5 rounded border border-yellow-500/30">
              <Sparkles className="w-3 h-3 text-yellow-400" /> GIZ & TECLADO
            </span>
          </div>
        </div>

        {/* Header do Jogo */}
        <div className="flex-shrink-0">
          {header}
        </div>

        {/* Três Seções da Lousa Divididas por Linhas de Giz */}
        <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full items-stretch divide-y lg:divide-y-0 lg:divide-x-2 divide-dashed divide-emerald-500/20 bg-[#12261e] min-w-0">
          {/* Seção 1: Caderno do Aluno / Sidebar */}
          <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col min-w-0 bg-[#0f221a]/80">
            <div className="bg-emerald-950/60 px-3 py-1.5 border-b border-dashed border-emerald-500/30 text-[10px] font-bold text-yellow-200 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ ✎ CADERNO DE NOTAS ]</span>
              <span className="text-emerald-400">PÁG. 1</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
          </div>

          {/* Seção 2: Lousa Principal de Exercícios / Arena */}
          <div className="flex-1 min-w-0 flex flex-col bg-[#142920] overflow-y-auto">
            <div className="bg-emerald-950/60 px-4 py-1.5 border-b border-dashed border-emerald-500/30 text-[10px] font-bold text-emerald-200 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ ✎ EXERCÍCIO DE DIGITAÇÃO PRÁTICA ]</span>
              <span className="text-yellow-300 flex items-center gap-1">
                <Pencil className="w-3 h-3 text-yellow-300" /> ESCREVA NO TECLADO
              </span>
            </div>
            <div className="flex-1 min-h-0 flex flex-col justify-center">{arena}</div>
          </div>

          {/* Seção 3: Materiais e Trocas da Escola / Loja */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col min-w-0 bg-[#0f221a]/80">
            <div className="bg-emerald-950/60 px-3 py-1.5 border-b border-dashed border-emerald-500/30 text-[10px] font-bold text-yellow-200 tracking-wider flex items-center justify-between flex-shrink-0">
              <span>[ ✎ MATERIAIS & MERENDA ]</span>
              <span className="text-emerald-400">DISPONÍVEL</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
          </div>
        </main>

        {/* Calha de Madeira Inferior (Porta-Gizes e Apagador) */}
        <footer className="bg-[#713f12] border-t-4 border-[#562f0d] px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between shadow-inner flex-shrink-0 min-w-0">
          {/* Apagador e Varetas de Giz */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Apagador de Feltro */}
            <div className="flex items-center gap-1 bg-[#451a03] border border-[#78350f] px-2 py-0.5 rounded shadow text-[10px] font-bold text-amber-200">
              <span>Apagador</span>
            </div>

            {/* Bastões de Giz Coloridos */}
            <div className="flex items-center gap-1 sm:gap-1.5 pl-1 sm:pl-2">
              <div className="w-5 sm:w-7 h-2 bg-white rounded-sm shadow-sm" title="Giz Branco" />
              <div className="w-5 sm:w-7 h-2 bg-yellow-300 rounded-sm shadow-sm" title="Giz Amarelo" />
              <div className="w-5 sm:w-7 h-2 bg-blue-300 rounded-sm shadow-sm" title="Giz Azul" />
              <div className="w-5 sm:w-7 h-2 bg-pink-300 rounded-sm shadow-sm" title="Giz Rosa" />
            </div>
          </div>

          <div className="text-[10px] text-amber-200 font-mono hidden sm:inline font-bold truncate ml-2">
            Educação & Tecnologia • Leopoldina
          </div>
        </footer>
      </div>
    </div>
  );
};
