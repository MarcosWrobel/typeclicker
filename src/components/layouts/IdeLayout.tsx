import React from 'react';
import { BaseLayoutProps } from './TerminalLayout';
import { Code2, FileCode, FolderGit2, Terminal, Cpu } from 'lucide-react';

export const IdeLayout: React.FC<BaseLayoutProps> = ({
  header,
  sidebar,
  arena,
  shop,
  overlays,
  appBgClass = 'bg-[#181a1f]'
}) => {
  return (
    <div className={`min-h-screen ${appBgClass} text-zinc-200 flex flex-col font-sans select-none overflow-x-hidden bg-[#181a1f]`}>
      {overlays}

      {/* Barra de Título da Janela do Editor (Window Top Title) */}
      <div className="bg-[#131518] border-b border-[#2d3139] px-3 py-1.5 flex items-center justify-between text-xs text-zinc-400 select-none flex-shrink-0 min-w-0">
        <div className="flex items-center gap-2 min-w-0 truncate">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-zinc-300 font-mono text-[11px] ml-2 flex items-center gap-1.5 truncate">
            <Code2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span className="truncate">TypeClicker Studio - Leopoldina [Workspace]</span>
          </span>
        </div>

        <div className="text-[11px] font-mono text-zinc-500 hidden sm:inline flex-shrink-0 ml-2">
          typing_arena.tsx
        </div>
      </div>

      {/* Header do Jogo */}
      <div className="flex-shrink-0">
        {header}
      </div>

      {/* Barra de Abas de Arquivos de Código */}
      <div className="bg-[#131518] border-b border-[#2d3139] flex items-center px-2 gap-1 text-xs font-mono overflow-x-auto flex-shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e222b] text-blue-300 border-t-2 border-blue-500 rounded-t flex-shrink-0">
          <FileCode className="w-3.5 h-3.5 text-blue-400" />
          <span>TypingArena.tsx</span>
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 text-zinc-400 hover:bg-[#181b22] transition rounded-t flex-shrink-0">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>student_stats.ts</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 text-zinc-400 hover:bg-[#181b22] transition rounded-t flex-shrink-0">
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span>upgrades.json</span>
        </div>
      </div>

      {/* Breadcrumb Path Bar */}
      <div className="bg-[#181b22] border-b border-[#282c34] px-4 py-1 text-[11px] font-mono text-zinc-400 flex items-center gap-1.5 flex-shrink-0">
        <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
        <span>src</span>
        <span>&gt;</span>
        <span>components</span>
        <span>&gt;</span>
        <span className="text-zinc-200 font-bold">TypingArena.tsx</span>
      </div>

      {/* Grid Principal do Editor: Explorer Lateral + Área de Código + Módulos */}
      <main className="flex-1 min-h-0 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-stretch border-x border-[#282c34] bg-[#1e222b] min-w-0">
        {/* Coluna 1: Explorer de Variáveis / Sidebar */}
        <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-[#282c34] bg-[#14171d] min-w-0">
          <div className="px-3 py-1.5 text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider bg-[#101318] border-b border-[#282c34] flex-shrink-0">
            EXPLORER: STUDENT METRICS
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">{sidebar}</div>
        </div>

        {/* Coluna 2: Arena Central de Código */}
        <div className="flex-1 min-w-0 flex flex-col bg-[#1e222b] overflow-y-auto">
          <div className="px-4 py-1 text-[11px] font-mono text-zinc-400 border-b border-[#282c34] flex items-center justify-between flex-shrink-0">
            <span>ACTIVE BUFFER // WORDS_STREAM</span>
            <span className="text-blue-400 font-bold">Ln 14, Col 28</span>
          </div>
          <div className="flex-1 min-h-0 flex flex-col justify-center">{arena}</div>
        </div>

        {/* Coluna 3: Painel de Dependências & Upgrades */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col border-t lg:border-t-0 lg:border-l border-[#282c34] bg-[#14171d] min-w-0">
          <div className="px-3 py-1.5 text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider bg-[#101318] border-b border-[#282c34] flex-shrink-0">
            NPM PACKAGES & UPGRADES
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">{shop}</div>
        </div>
      </main>

      {/* Rodapé da IDE (VS Code Status Bar) */}
      <footer className="bg-[#007acc] text-white px-3 py-1 flex items-center justify-between text-[11px] font-mono flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-bold">
            <span>🌿 main*</span>
          </span>
          <span className="hidden sm:inline">0 errors, 0 warnings</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden md:inline">TypeScript 5.8</span>
          <span>UTF-8</span>
          <span className="font-bold truncate">Colégio Leopoldina</span>
        </div>
      </footer>
    </div>
  );
};
