import React from 'react';
import { EditorSettings } from '../types';
import { THEMES } from '../constants/themes';

interface EditorTabsProps {
  fileName: string;
  isModified?: boolean;
  settings: EditorSettings;
  onResetCode: () => void;
}

export const EditorTabs: React.FC<EditorTabsProps> = ({
  fileName,
  isModified = false,
  settings,
  onResetCode,
}) => {
  const activeTheme = THEMES[settings.theme] || THEMES['vs-dark-modern'];

  return (
    <div 
      id="vscode-tabs-bar"
      className="flex items-center h-9 border-b select-none text-xs"
      style={{
        backgroundColor: activeTheme.ui.tabBarBg,
        borderColor: activeTheme.ui.border,
      }}
    >
      {/* Active Tab */}
      <div
        className="group relative flex items-center gap-2 h-full px-3.5 border-r font-medium cursor-default"
        style={{
          backgroundColor: activeTheme.ui.activeTabBg,
          borderColor: activeTheme.ui.border,
          color: activeTheme.ui.activeTabText,
        }}
      >
        {/* Top Active Indicator Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ backgroundColor: activeTheme.ui.statusBarBg }}
        />

        {/* JS Badge */}
        <span 
          className="text-[10px] font-mono font-bold px-1 py-0.5 rounded tracking-tighter"
          style={{ color: '#f7df1e', backgroundColor: '#f7df1e20' }}
        >
          JS
        </span>

        {/* File Name */}
        <span className="text-[12px] font-mono tracking-tight">
          {fileName}
        </span>

        {/* Modified indicator dot or reset */}
        {isModified ? (
          <span 
            className="w-2 h-2 rounded-full bg-blue-400 inline-block ml-1"
            title="Arquivo modificado" 
          />
        ) : (
          <span className="text-neutral-500 text-[10px] ml-1 font-mono">
            (editável)
          </span>
        )}
      </div>

      <div className="flex-1" />

      {/* Shortcut Tip */}
      <div className="px-3 text-[10px] text-neutral-400 font-mono hidden md:flex items-center gap-1.5 opacity-80">
        <span>Atalho:</span>
        <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">Ctrl</kbd>
        <span>+</span>
        <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">Enter</kbd>
        <span>para testar</span>
      </div>
    </div>
  );
};
