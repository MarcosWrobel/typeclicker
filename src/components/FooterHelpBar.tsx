import React from 'react';
import { GraduationCap, Keyboard, HelpCircle, Sparkles, BookOpen } from 'lucide-react';

interface FooterHelpBarProps {
  onOpenHelp: () => void;
}

export const FooterHelpBar: React.FC<FooterHelpBarProps> = ({ onOpenHelp }) => {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-[#0d1017]/95 backdrop-blur px-3 sm:px-6 py-2.5 flex-shrink-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Identificação Institucional e Dica de Ergonomia */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap justify-center md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-mono">
              <Keyboard className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-zinc-200 hidden sm:inline">
              Colégio Estadual Leopoldina Bittencourt Pedroso
            </span>
            <span className="font-semibold text-zinc-200 sm:hidden">
              Colégio Est. Leopoldina. B. Pedroso
            </span>
          </div>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800">
            <span className="text-zinc-500">Postura ABNT2:</span>
            <span className="text-emerald-300 font-bold">A S D F</span>
            <span className="text-zinc-600">/</span>
            <span className="text-emerald-300 font-bold">J K L Ç</span>
          </div>
        </div>

        {/* Botão de Ajuda do Professor (Em destaque na parte inferior) */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            type="button"
            onClick={onOpenHelp}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/80 via-zinc-900 to-amber-950/80 hover:from-amber-900/90 hover:to-amber-950 text-amber-200 hover:text-white border border-amber-500/60 hover:border-amber-400 text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer group"
            title="Dúvidas, Teclado ABNT2, Regras de Nível e Apoio Pedagógico"
          >
            <div className="w-5 h-5 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold tracking-wide flex items-center gap-1">
                <span>Ajuda • Prof. Marcos Wrobel</span>
                <HelpCircle className="w-3 h-3 text-amber-400 opacity-80" />
              </span>
              <span className="text-[10px] text-amber-300/70 font-normal hidden sm:inline">
                Dúvidas, acentuação e suporte pedagógico
              </span>
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
};
