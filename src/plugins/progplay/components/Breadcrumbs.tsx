import React from 'react';
import { ChevronRight, Folder, FileCode, Braces } from 'lucide-react';
import { EditorSettings } from '../types';
import { THEMES } from '../constants/themes';

interface BreadcrumbsProps {
  fileName: string;
  settings: EditorSettings;
  cursorLine?: number;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ fileName, settings, cursorLine = 1 }) => {
  const activeTheme = THEMES[settings.theme] || THEMES['vs-dark-modern'];

  return (
    <div
      id="vscode-breadcrumbs"
      className="h-6 px-3.5 flex items-center gap-1.5 text-[11px] font-sans border-b select-none overflow-hidden text-ellipsis whitespace-nowrap opacity-90"
      style={{
        backgroundColor: activeTheme.ui.breadcrumbsBg,
        borderColor: activeTheme.ui.border,
        color: activeTheme.ui.tabText,
      }}
    >
      <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
        <Folder className="w-3 h-3 text-amber-400" />
        <span>jogo_vscode</span>
      </div>

      <ChevronRight className="w-3 h-3 opacity-40" />

      <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
        <Folder className="w-3 h-3 text-amber-400" />
        <span>fases</span>
      </div>

      <ChevronRight className="w-3 h-3 opacity-40" />

      <div className="flex items-center gap-1 text-neutral-300 font-medium hover:text-white transition-colors cursor-pointer">
        <FileCode className="w-3 h-3 text-blue-400" />
        <span>{fileName}</span>
      </div>

      <ChevronRight className="w-3 h-3 opacity-40" />

      <div className="flex items-center gap-1 text-neutral-400">
        <Braces className="w-3 h-3 text-purple-400" />
        <span>Linha {cursorLine}</span>
      </div>
    </div>
  );
};
