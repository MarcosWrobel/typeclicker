import React from 'react';
import { 
  GitBranch, 
  RefreshCw, 
  XCircle, 
  AlertTriangle, 
  Terminal, 
  Check, 
  Bell, 
  ChevronUp
} from 'lucide-react';
import { EditorSettings, CursorPosition } from '../types';
import { THEMES } from '../constants/themes';

interface EditorStatusBarProps {
  fileName: string;
  language?: string;
  cursorPos: CursorPosition;
  settings: EditorSettings;
  outputOpen: boolean;
  onToggleOutput: () => void;
  errorCount?: number;
}

export const EditorStatusBar: React.FC<EditorStatusBarProps> = ({
  fileName,
  language = 'JavaScript',
  cursorPos,
  settings,
  outputOpen,
  onToggleOutput,
  errorCount = 0,
}) => {
  const activeTheme = THEMES[settings.theme] || THEMES['vs-dark-modern'];

  return (
    <footer
      id="vscode-statusbar"
      className="h-6 px-2 flex items-center justify-between text-[11px] select-none font-sans transition-colors duration-150 z-20 shrink-0"
      style={{
        backgroundColor: activeTheme.ui.statusBarBg,
        color: activeTheme.ui.statusBarText,
      }}
    >
      {/* Left side items */}
      <div className="flex items-center h-full gap-0.5">
        {/* Source Control branch */}
        <div 
          className="flex items-center gap-1 px-2 h-full hover:bg-black/20 transition-colors cursor-pointer"
          title="Git: Branch jogo"
        >
          <GitBranch className="w-3 h-3" />
          <span className="font-mono">main</span>
        </div>

        {/* Sync */}
        <div 
          className="flex items-center px-1.5 h-full hover:bg-black/20 transition-colors cursor-pointer"
          title="Sincronizado"
        >
          <RefreshCw className="w-3 h-3" />
        </div>

        {/* Errors / Warnings */}
        <div 
          className="flex items-center gap-1.5 px-2 h-full hover:bg-black/20 transition-colors cursor-pointer"
          title="Erros de execução"
        >
          <span className={`flex items-center gap-0.5 ${errorCount > 0 ? 'text-red-200 font-bold' : ''}`}>
            <XCircle className="w-3 h-3" /> {errorCount}
          </span>
          <span className="flex items-center gap-0.5">
            <AlertTriangle className="w-3 h-3" /> 0
          </span>
        </div>

        {/* Toggle Output / Terminal drawer */}
        <button
          id="btn-toggle-terminal-status"
          onClick={onToggleOutput}
          className={`flex items-center gap-1 px-2 h-full transition-colors cursor-pointer ${
            outputOpen ? 'bg-black/30' : 'hover:bg-black/20'
          }`}
          title="Alternar Console de Execução"
        >
          <Terminal className="w-3 h-3" />
          <span>Terminal</span>
          <ChevronUp className={`w-3 h-3 transition-transform ${outputOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Right side items */}
      <div className="flex items-center h-full gap-0.5">
        {/* Cursor Position (Ln, Col) */}
        <div 
          className="px-2 h-full flex items-center hover:bg-black/20 transition-colors cursor-pointer font-mono"
          title="Posição do Cursor"
        >
          Ln {cursorPos.lineNumber}, Col {cursorPos.column}
        </div>

        {/* Tab Size */}
        <div 
          className="px-2 h-full hidden sm:flex items-center hover:bg-black/20 transition-colors cursor-pointer"
          title="Tamanho da Indentação"
        >
          Espaços: {settings.tabSize}
        </div>

        {/* Encoding */}
        <div 
          className="px-2 h-full hidden md:flex items-center hover:bg-black/20 transition-colors cursor-pointer"
          title="Codificação"
        >
          UTF-8
        </div>

        {/* Language */}
        <div
          className="px-2.5 h-full flex items-center gap-1 hover:bg-black/20 transition-colors cursor-pointer font-medium"
          title="Modo de Linguagem"
        >
          <span>{language}</span>
        </div>

        {/* Prettier status */}
        <div 
          className="px-2 h-full hidden lg:flex items-center gap-1 hover:bg-black/20 transition-colors cursor-pointer opacity-90"
          title="Formatador ativo"
        >
          <Check className="w-3 h-3" />
          <span>Prettier</span>
        </div>

        {/* Notifications */}
        <div 
          className="px-1.5 h-full flex items-center hover:bg-black/20 transition-colors cursor-pointer"
          title="Notificações"
        >
          <Bell className="w-3 h-3" />
        </div>
      </div>
    </footer>
  );
};
