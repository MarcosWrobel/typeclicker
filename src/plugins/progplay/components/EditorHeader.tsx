import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  AlignLeft, 
  WrapText, 
  Copy, 
  Check, 
  RotateCcw, 
  Settings, 
  ChevronDown, 
  Layout, 
  DoorOpen, 
  Cloud, 
  UserCheck,
  Swords,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { DuelUser } from '../services/progplayDuelService';
import { EditorSettings, EditorThemeId } from '../types';
import { THEMES } from '../constants/themes';
import { GAME_LANGUAGES, GameLanguageId } from '../constants/levels';

interface EditorHeaderProps {
  fileName: string;
  codeContent: string;
  settings: EditorSettings;
  onUpdateSettings: (newSettings: Partial<EditorSettings>) => void;
  onRunCode: () => void;
  onFormatCode: () => void;
  onResetCode: () => void;
  isEvaluating?: boolean;
  currentLanguage: GameLanguageId;
  onOpenLanguageModal: () => void;
  activeMobileView: 'editor' | 'door';
  onSelectMobileView: (view: 'editor' | 'door') => void;
  isDoorOpen?: boolean;
  levelNumber: number;
  currentUser: DuelUser | null;
  onExitToHub: () => void;
  appMode?: 'challenges' | 'playground';
  onToggleAppMode?: (mode: 'challenges' | 'playground') => void;
  onOpenCompetitionModal?: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  fileName,
  codeContent,
  settings,
  onUpdateSettings,
  onRunCode,
  onFormatCode,
  onResetCode,
  isEvaluating = false,
  currentLanguage,
  onOpenLanguageModal,
  activeMobileView,
  onSelectMobileView,
  isDoorOpen = false,
  levelNumber,
  currentUser,
  onExitToHub,
  appMode = 'challenges',
  onToggleAppMode,
  onOpenCompetitionModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeTheme = THEMES[settings.theme] || THEMES['vs-dark-modern'];
  const activeLangConfig = GAME_LANGUAGES.find((l) => l.id === currentLanguage) || GAME_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <header 
      id="vscode-header"
      className="min-h-12 px-2.5 sm:px-3 flex items-center justify-between border-b select-none text-xs font-sans transition-colors duration-150 shrink-0 gap-2 overflow-x-auto no-scrollbar"
      style={{ 
        backgroundColor: activeTheme.ui.bg, 
        borderColor: activeTheme.ui.border,
        color: activeTheme.ui.tabText 
      }}
    >
      {/* Left: Hub Return, Language Picker & Mode Switcher */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Hub Return Button */}
        <button
          onClick={onExitToHub}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80 active:scale-95 transition-all cursor-pointer font-bold text-xs shadow-xs"
          title="Salvar progresso e voltar ao Hub do TypeClicker"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Hub</span>
        </button>

        <div className="hidden sm:block h-3.5 w-[1px] bg-neutral-700/40 mx-0.5" />

        {/* Language Picker Trigger Button */}
        <button
          id="btn-choose-language"
          onClick={onOpenLanguageModal}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-neutral-100 hover:border-blue-400/60 active:scale-95 transition-all cursor-pointer font-medium"
          style={{
            backgroundColor: activeLangConfig.bgColor,
            borderColor: activeLangConfig.borderColor,
          }}
          title="Clique para trocar de linguagem"
        >
          <span 
            className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] shadow-xs"
            style={{ backgroundColor: activeLangConfig.color, color: '#090a0f' }}
          >
            {activeLangConfig.badge}
          </span>
          <span className="font-bold tracking-tight text-white text-xs">
            {activeLangConfig.name}
          </span>
          <span className="text-[10px] text-neutral-300 font-mono hidden md:inline">
            (Fase {levelNumber}/{activeLangConfig.totalLevels})
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
        </button>

        {/* Mode Switcher: Desafios (Níveis) vs Playground Livre */}
        <div className="flex items-center bg-neutral-900/90 p-0.5 rounded-lg border border-neutral-700/80 shadow-inner">
          <button
            id="btn-mode-challenges"
            onClick={() => onToggleAppMode?.('challenges')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              appMode === 'challenges'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title={`Modo Fases e Desafios (Níveis 1 a ${activeLangConfig.totalLevels})`}
          >
            <span>🎯</span>
            <span className="hidden sm:inline">Desafios</span>
          </button>

          <button
            id="btn-mode-playground"
            onClick={() => onToggleAppMode?.('playground')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              appMode === 'playground'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Playground Livre de Código e Terminal Python"
          >
            <span>🧪</span>
            <span className="hidden sm:inline">Playground</span>
          </button>
        </div>
      </div>

      {/* Center: Mobile & Tablet View Switcher (Editor vs Door) */}
      <div className="flex lg:hidden items-center bg-neutral-900/90 p-0.5 rounded-lg border border-neutral-700/80 shadow-inner shrink-0">
        <button
          onClick={() => onSelectMobileView('editor')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            activeMobileView === 'editor'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>

        <button
          onClick={() => onSelectMobileView('door')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer relative ${
            activeMobileView === 'door'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <DoorOpen className="w-3.5 h-3.5" />
          <span>Porta</span>
          {isDoorOpen && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
          )}
        </button>
      </div>

      {/* Right: Quick actions bar */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        
        {/* Author Credit Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[10px] text-purple-200">
          <span className="font-bold text-purple-300">ProgPlay</span>
          <span className="text-neutral-400">|</span>
          <span>André Luís - 8º 2</span>
        </div>

        {/* 1v1 Competition Battle Button */}
        {onOpenCompetitionModal && (
          <button
            id="btn-competition"
            onClick={onOpenCompetitionModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-red-500/40 bg-red-500/15 hover:bg-red-500/25 text-red-300 active:scale-95 transition-all cursor-pointer font-bold text-xs min-h-[36px]"
            title="Duelo 1v1: Enfrente Bytezinho ou dispute contra um colega!"
          >
            <Swords className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden md:inline">Duelo 1x1</span>
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          </button>
        )}

        {/* Student Profile Chip */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-neutral-800/90 border-emerald-500/40 text-neutral-200 font-medium text-xs min-h-[36px]"
          title={currentUser ? `Conectado como ${currentUser.displayName}` : 'Aluno conectado'}
        >
          {currentUser?.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt="Avatar" 
              className="w-4 h-4 rounded-full border border-emerald-400 object-cover" 
            />
          ) : (
            <Cloud className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className="font-sans truncate max-w-[110px]">
            {currentUser?.displayName?.split(' ')[0] || 'Aluno'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400 shrink-0" />
        </div>

        {/* Run / Verify Code Button */}
        <button
          id="btn-run-code"
          onClick={onRunCode}
          disabled={isEvaluating}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-neutral-950 transition-all text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50 min-h-[36px]"
          title="Executar Código (Ctrl+Enter)"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Executar</span>
        </button>

        {/* Reset Code button */}
        <button
          id="btn-reset-code"
          onClick={onResetCode}
          className="flex items-center gap-1 p-2 sm:px-2 sm:py-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 active:scale-95 transition-colors cursor-pointer min-h-[36px]"
          title="Reiniciar código para o padrão da fase"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden 2xl:inline text-[11px]">Reiniciar</span>
        </button>

        {/* Format Document Button */}
        <button
          id="btn-format-code"
          onClick={onFormatCode}
          className="hidden md:flex items-center gap-1 p-2 sm:px-2 sm:py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95 transition-colors cursor-pointer"
          title="Formatar Código (Shift+Alt+F)"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>

        {/* Word Wrap Toggle */}
        <button
          id="btn-toggle-wrap"
          onClick={() => onUpdateSettings({ wordWrap: !settings.wordWrap })}
          className={`hidden sm:flex items-center gap-1 p-2 rounded-lg transition-colors cursor-pointer ${
            settings.wordWrap 
              ? 'text-blue-400 bg-blue-500/15' 
              : 'text-neutral-300 hover:text-white hover:bg-white/10'
          }`}
          title="Quebra de Linha Automática (Alt+Z)"
        >
          <WrapText className="w-3.5 h-3.5" />
        </button>

        {/* Copy button */}
        <button
          id="btn-copy-code"
          onClick={handleCopy}
          className="hidden sm:flex p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95 transition-colors cursor-pointer"
          title="Copiar Código"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        {/* Settings menu dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            id="btn-editor-settings"
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 active:scale-95 transition-colors cursor-pointer"
            title="Configurações do Editor"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {showSettingsMenu && (
            <div 
              className="absolute right-0 top-full mt-1 w-60 rounded-xl shadow-2xl border p-3 z-50 text-xs backdrop-blur-md"
              style={{
                backgroundColor: activeTheme.ui.bg,
                borderColor: activeTheme.ui.border,
                color: activeTheme.ui.activeTabText,
              }}
            >
              <div className="px-1 py-1 font-semibold text-neutral-400 border-b border-neutral-700/40 mb-2 flex items-center justify-between">
                <span>Configurações</span>
                <Settings className="w-3 h-3 text-neutral-500" />
              </div>

              {/* Theme selector */}
              <div className="py-1">
                <label className="block text-[11px] text-neutral-400 mb-1 px-1">Tema Visual</label>
                <select
                  value={settings.theme}
                  onChange={(e) => onUpdateSettings({ theme: e.target.value as EditorThemeId })}
                  className="w-full bg-neutral-800/90 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 outline-none cursor-pointer focus:border-blue-500"
                >
                  <option value="vs-dark-modern">Dark Modern (VS Code)</option>
                  <option value="vs-dark">Dark+ (Clássico)</option>
                  <option value="monokai">Monokai</option>
                  <option value="github-dark">GitHub Dark</option>
                  <option value="light">Light Modern</option>
                </select>
              </div>

              {/* Font Size */}
              <div className="py-1.5">
                <div className="flex justify-between items-center text-[11px] text-neutral-400 mb-1 px-1">
                  <span>Tamanho da Fonte</span>
                  <span className="font-mono text-neutral-200">{settings.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="22"
                  step="1"
                  value={settings.fontSize}
                  onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                  className="w-full accent-blue-500 cursor-pointer h-1.5 bg-neutral-700 rounded-lg appearance-none"
                />
              </div>

              {/* Tab Size */}
              <div className="py-1.5 flex items-center justify-between px-1">
                <span className="text-[11px] text-neutral-400">Espaço Tab</span>
                <div className="flex gap-1">
                  {[2, 4].map((size) => (
                    <button
                      key={size}
                      onClick={() => onUpdateSettings({ tabSize: size })}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono cursor-pointer ${
                        settings.tabSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line numbers toggle */}
              <div className="py-1 flex items-center justify-between px-1">
                <span className="text-[11px] text-neutral-400">Numeração de Linhas</span>
                <input
                  type="checkbox"
                  checked={settings.lineNumbers}
                  onChange={(e) => onUpdateSettings({ lineNumbers: e.target.checked })}
                  className="accent-blue-500 cursor-pointer w-4 h-4"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
