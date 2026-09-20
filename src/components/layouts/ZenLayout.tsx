import React, { useState } from 'react';
import { BaseLayoutProps } from './TerminalLayout';
import { Eye, EyeOff } from 'lucide-react';

export const ZenLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  overlays,
  appBgClass = 'bg-[#080b10]'
}) => {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  return (
    <div className={`min-h-screen ${appBgClass} text-zinc-100 flex flex-col font-sans select-none overflow-x-hidden transition-colors duration-300`}>
      {overlays}

      {/* Top Header */}
      <div className="flex-shrink-0">
        {header}
      </div>

      {/* Faixa Superior Zen de Foco & Precisão */}
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-3 flex items-center justify-between text-xs font-mono text-cyan-400/80 flex-shrink-0 min-w-0">
        <div className="flex items-center gap-2 min-w-0 truncate">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
          <span className="font-bold uppercase tracking-wider truncate">Modo Foco Zen Ativo</span>
          <span className="text-zinc-500 hidden sm:inline">• Distração Zero</span>
        </div>

        <button
          type="button"
          onClick={() => setShowDrawer(prev => !prev)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-700/60 text-zinc-300 hover:text-white hover:border-cyan-500/50 transition text-[11px] cursor-pointer flex-shrink-0"
          title={showDrawer ? 'Ocultar painéis' : 'Exibir painéis de status e upgrades'}
        >
          {showDrawer ? <EyeOff className="w-3.5 h-3.5 text-cyan-400" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{showDrawer ? 'Recolher Painéis' : 'Ver Upgrades & Placar'}</span>
        </button>
      </div>

      {/* Conteúdo Central: Arena de Digitação Centralizada e Ampla */}
      <main className="flex-1 min-h-0 flex flex-col justify-center w-full max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-5 min-w-0">
        <div className="w-full shadow-[0_0_40px_rgba(6,182,212,0.08)] rounded-2xl overflow-hidden border border-cyan-500/20 min-w-0">
          {arena}
        </div>

        {/* Gaveta opcional expansível para Upgrades e Estatísticas */}
        {showDrawer && (
          <div className="mt-4 pt-4 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 animate-in fade-in slide-in-from-top-4 duration-200 min-w-0">
            <div className="bg-zinc-950/60 rounded-xl p-2 border border-zinc-800 flex flex-col h-80 sm:h-96 min-w-0 overflow-hidden">
              <h3 className="text-xs font-bold text-zinc-400 px-2 py-1 font-mono uppercase border-b border-zinc-800/60 flex-shrink-0">
                Estatísticas do Aluno
              </h3>
              <div className="flex-1 min-h-0 overflow-y-auto">
                {sidebar}
              </div>
            </div>

            <div className="bg-zinc-950/60 rounded-xl p-2 border border-zinc-800 flex flex-col h-80 sm:h-96 min-w-0 overflow-hidden">
              <h3 className="text-xs font-bold text-zinc-400 px-2 py-1 font-mono uppercase border-b border-zinc-800/60 flex-shrink-0">
                Loja de Upgrades
              </h3>
              <div className="flex-1 min-h-0 overflow-y-auto">
                {shop}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Rodapé Sutil Zen */}
      <footer className="py-2 text-center text-[11px] font-mono text-zinc-500 flex-shrink-0">
        Respire fundo, relaxe os ombros e foque na fileira guia do teclado.
      </footer>
    </div>
  );
};
