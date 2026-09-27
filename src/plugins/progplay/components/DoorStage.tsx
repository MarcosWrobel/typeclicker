import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  ArrowRight, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Layout,
  Globe,
  DoorOpen,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Terminal,
  Database,
  ExternalLink
} from 'lucide-react';
import { GameLevel } from '../constants/levels';
import { sounds } from '../utils/sound';

interface DoorStageProps {
  currentLevel: GameLevel;
  totalLevels: number;
  isDoorOpen: boolean;
  validationMessage: string;
  hasAttempted: boolean;
  onNextLevel: () => void;
  onResetCode: () => void;
  onSelectLevel: (levelId: number) => void;
  unlockedLevel: number;
  onSwitchToEditor?: () => void;
}

export const DoorStage: React.FC<DoorStageProps> = ({
  currentLevel,
  totalLevels,
  isDoorOpen,
  validationMessage,
  hasAttempted,
  onNextLevel,
  onResetCode,
  onSelectLevel,
  unlockedLevel,
  onSwitchToEditor,
}) => {
  const [activeHintIndex, setActiveHintIndex] = useState<number>(0);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    sounds.enabled = next;
    setSoundEnabled(next);
  };

  // Reset hint state on level change
  useEffect(() => {
    setActiveHintIndex(0);
    setShowHints(false);
  }, [currentLevel.id]);

  const isFinalLevel = currentLevel.id === totalLevels;
  const isWebBuilderTheme = currentLevel.themeCategory === 'web-builder' || currentLevel.id > 10;

  // Level ranges of 20 levels each (120 levels = 6 ranges)
  const rangeSize = 20;
  const totalRanges = Math.ceil(totalLevels / rangeSize);
  const [selectedRange, setSelectedRange] = useState<number>(() => Math.floor((currentLevel.id - 1) / rangeSize));

  useEffect(() => {
    setSelectedRange(Math.floor((currentLevel.id - 1) / rangeSize));
  }, [currentLevel.id]);

  const currentRangeStart = selectedRange * rangeSize + 1;
  const currentRangeEnd = Math.min((selectedRange + 1) * rangeSize, totalLevels);
  const activeRangePills = Array.from(
    { length: currentRangeEnd - currentRangeStart + 1 },
    (_, i) => currentRangeStart + i
  );

  const getChapterName = (lvl: number) => {
    if (lvl <= 10) return 'Cap. 1: Portas';
    if (lvl <= 20) return 'Cap. 2: Componentes Web';
    if (lvl <= 40) return 'Cap. 3: Estruturas & Lógica';
    if (lvl <= 60) return 'Cap. 4: Arquitetura & Async';
    if (lvl <= 80) return 'Cap. 5: Padrões de Projeto';
    if (lvl <= 100) return 'Cap. 6: Performance & APIs';
    return 'Cap. 7: Engenharia Fullstack';
  };

  return (
    <div 
      id="door-stage-container"
      className="w-full h-full flex flex-col bg-[#0d0f14] border-l border-[#1f222e] select-none overflow-hidden relative"
    >
      {/* Top Header Bar: Theme Chapter & Level Range Selector */}
      <div className="px-3 sm:px-4 py-2 bg-[#12141a] border-b border-[#20232e] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-[70%]">
          {/* Chapter badge */}
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 font-bold ${
            currentLevel.id > 10 
              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
          }`}>
            {currentLevel.id > 10 ? <Globe className="w-3 h-3" /> : <DoorOpen className="w-3 h-3" />}
            <span>{getChapterName(currentLevel.id)}</span>
          </span>

          {/* Range Dropdown Selector */}
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(Number(e.target.value))}
            className="bg-[#181a24] border border-neutral-700 text-neutral-200 text-[10px] font-mono rounded px-1.5 py-0.5 outline-none cursor-pointer"
            title="Selecione o bloco de fases"
          >
            {Array.from({ length: totalRanges }, (_, idx) => {
              const start = idx * rangeSize + 1;
              const end = Math.min((idx + 1) * rangeSize, totalLevels);
              return (
                <option key={idx} value={idx}>
                  Fases {start} - {end}
                </option>
              );
            })}
          </select>

          <div className="h-3 w-px bg-neutral-700 shrink-0" />

          {/* Level Pills for Active Range */}
          <div className="flex items-center gap-1 shrink-0">
            {activeRangePills.map((lvl) => {
              const isUnlocked = lvl <= unlockedLevel;
              const isCurrent = lvl === currentLevel.id;

              return (
                <button
                  key={lvl}
                  id={`btn-level-pill-${lvl}`}
                  disabled={!isUnlocked}
                  onClick={() => onSelectLevel(lvl)}
                  title={
                    isCurrent 
                      ? `Fase ${lvl} (Atual)` 
                      : isUnlocked 
                        ? `Fase ${lvl} (Liberada)` 
                        : `Fase ${lvl} (Bloqueada)`
                  }
                  className={`w-6 h-6 rounded-md text-[11px] font-mono flex items-center justify-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30 ring-1 ring-blue-400'
                      : isUnlocked
                        ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                        : 'bg-neutral-900/50 text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {/* Mobile switcher button back to editor */}
          {onSwitchToEditor && (
            <button
              onClick={onSwitchToEditor}
              className="lg:hidden px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1 cursor-pointer font-medium"
              title="Voltar ao Editor"
            >
              <Layout className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Editor</span>
            </button>
          )}

          {/* Hint button */}
          <button
            id="btn-stage-hints"
            onClick={() => setShowHints(!showHints)}
            className={`px-2 py-1 rounded transition-colors text-xs flex items-center gap-1 cursor-pointer font-medium ${
              showHints ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
            title="Dicas da Fase"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] hidden sm:inline">Dicas</span>
            <span className="text-[11px]">({currentLevel.hints.length})</span>
            {showHints ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Reset button */}
          <button
            onClick={onResetCode}
            className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Restaurar código inicial da fase"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Sound toggle */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Áudio'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-500" />}
          </button>
        </div>
      </div>

      {/* Level Info Header */}
      <div className="px-3 sm:px-4 py-2.5 bg-[#14161c] border-b border-[#22242c] flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-2 truncate">
            <span>{currentLevel.title}</span>
          </h2>
          <span 
            className={`text-[10px] sm:text-[11px] font-mono px-2 sm:px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-bold transition-all duration-300 shrink-0 ${
              isDoorOpen 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xs shadow-emerald-500/20' 
                : 'bg-red-500/15 text-red-400 border border-red-500/30'
            }`}
          >
            {isDoorOpen ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-red-400" />}
            <span>{isDoorOpen ? (isWebBuilderTheme ? 'CONSTRUÍDO' : 'ABERTO') : (isWebBuilderTheme ? 'PENDENTE' : 'TRANCADO')}</span>
          </span>
        </div>
        
        <p className="text-xs text-neutral-300 leading-relaxed font-sans">
          {currentLevel.puzzleDescription}
        </p>

        {/* Objective banner */}
        <div className="text-[11px] font-mono px-2.5 py-1 rounded bg-neutral-900/80 border border-neutral-800 text-neutral-300 flex items-center gap-2">
          <span className="text-blue-400 font-bold">🎯 Alvo:</span>
          <span className="truncate">{currentLevel.targetObjective}</span>
        </div>

        {/* Expandable Progressive Hints */}
        {showHints && (
          <div className="mt-1 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Dica {activeHintIndex + 1} de {currentLevel.hints.length}
              </span>
              <div className="flex gap-1.5">
                {currentLevel.hints.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveHintIndex(i)}
                    className={`w-5 h-5 rounded-full text-[10px] font-mono flex items-center justify-center cursor-pointer transition-colors ${
                      activeHintIndex === i 
                        ? 'bg-amber-400 text-neutral-950 font-bold' 
                        : 'bg-amber-500/30 text-amber-300 hover:bg-amber-500/50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            
            <p className="text-amber-200/95 leading-relaxed font-sans bg-amber-950/40 p-2.5 rounded-lg border border-amber-500/20">
              {currentLevel.hints[activeHintIndex]}
            </p>

            <div className="mt-2.5 pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px]">
              <span className="text-neutral-400 font-mono">
                Esperado: <code className="text-amber-300">{currentLevel.expectedConditionText}</code>
              </span>
              {activeHintIndex < currentLevel.hints.length - 1 && (
                <button
                  onClick={() => setActiveHintIndex((prev) => Math.min(prev + 1, currentLevel.hints.length - 1))}
                  className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline underline-offset-2"
                >
                  Próxima dica →
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* STAGE ARENA: THEME 1 (DOOR ENIGMA) VS THEME 2 (WEB BUILDER / SITE SIMULATOR) */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-between p-3 sm:p-5 relative">
        
        {isWebBuilderTheme ? (
          /* ========================================================== */
          /* THEME 2: SIMULADOR WEB AO VIVO & COMPONENT BUILDER (11-20) */
          /* ========================================================== */
          <div className="w-full max-w-lg flex flex-col my-auto animate-in fade-in duration-300">
            
            {/* Mockup Browser Window Frame */}
            <div className={`w-full rounded-2xl overflow-hidden border transition-all duration-300 shadow-2xl bg-[#11141c] ${
              isDoorOpen 
                ? 'border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/30' 
                : 'border-[#262b3a]'
            }`}>
              {/* Browser Titlebar */}
              <div className="px-3.5 py-2.5 bg-[#171b26] border-b border-[#232938] flex items-center justify-between gap-2">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>

                {/* URL Bar */}
                <div className="flex-1 max-w-xs mx-auto flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0d0f15] border border-[#232837] text-[11px] font-mono text-neutral-300 truncate">
                  <span className="text-emerald-400 text-xs">🔒</span>
                  <span className="truncate">https://meu-site.dev/fase-{currentLevel.id}</span>
                </div>

                {/* Viewport controls */}
                <div className="hidden sm:flex items-center gap-1 text-neutral-400">
                  <button 
                    onClick={() => setViewportMode('desktop')} 
                    className={`p-1 rounded cursor-pointer ${viewportMode === 'desktop' ? 'bg-blue-500/20 text-blue-400' : 'hover:text-white'}`}
                    title="Desktop"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setViewportMode('tablet')} 
                    className={`p-1 rounded cursor-pointer ${viewportMode === 'tablet' ? 'bg-blue-500/20 text-blue-400' : 'hover:text-white'}`}
                    title="Tablet"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setViewportMode('mobile')} 
                    className={`p-1 rounded cursor-pointer ${viewportMode === 'mobile' ? 'bg-blue-500/20 text-blue-400' : 'hover:text-white'}`}
                    title="Mobile"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sub-header: Component Meta & Status */}
              <div className="px-4 py-2 bg-[#131620] border-b border-[#202535] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-neutral-300">
                  {currentLevel.previewType === 'terminal' ? (
                    <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  ) : currentLevel.previewType === 'database-table' ? (
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <span className="font-semibold text-white">
                    {currentLevel.previewMeta?.componentTitle || 'Componente Web Interativo'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isDoorOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="text-[11px] text-neutral-400">
                    {isDoorOpen ? (currentLevel.previewMeta?.successBadge || 'Compilado') : 'Aguardando Código'}
                  </span>
                </div>
              </div>

              {/* Live Preview Canvas Body */}
              <div className="p-5 min-h-[220px] flex flex-col justify-center bg-radial from-[#151926] to-[#0d0f17] relative">
                
                {/* Visual Component Render */}
                {currentLevel.previewType === 'terminal' ? (
                  <div className="w-full font-mono text-xs p-3.5 rounded-xl bg-black/70 border border-neutral-800 text-sky-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                    <div className="flex items-center gap-2 text-neutral-500 text-[10px] pb-2 mb-2 border-b border-neutral-800">
                      <span>TERMINAL API REST</span>
                      <span>•</span>
                      <span className="text-emerald-400">HTTP 200/201</span>
                    </div>
                    {currentLevel.previewMeta?.previewSnippet}
                  </div>
                ) : currentLevel.previewType === 'database-table' ? (
                  <div className="w-full font-mono text-xs p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-emerald-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                    <div className="flex items-center gap-2 text-neutral-500 text-[10px] pb-2 mb-2 border-b border-neutral-800">
                      <span>SQL DATABASE ENGINE</span>
                      <span>•</span>
                      <span className="text-blue-400">QUERY EXECUTOR</span>
                    </div>
                    {currentLevel.previewMeta?.previewSnippet}
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center py-2">
                    {/* Render visual mock for site components */}
                    <div 
                      className={`w-full p-4 rounded-xl border transition-all duration-300 ${
                        isDoorOpen 
                          ? 'bg-neutral-900/90 border-emerald-500/40 shadow-xl' 
                          : 'bg-neutral-900/60 border-neutral-800 opacity-90'
                      }`}
                      dangerouslySetInnerHTML={{ 
                        __html: currentLevel.previewMeta?.previewSnippet || '<div class="text-center text-sm font-medium">Renderização do Componente</div>' 
                      }}
                    />
                  </div>
                )}

                {/* Overlay Success Banner when validated */}
                {isDoorOpen && (
                  <div className="mt-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 animate-in zoom-in-95">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-semibold">Código validado com sucesso para este componente web!</span>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                )}
              </div>

              {/* Browser DevTools Footer Drawer */}
              <div className="px-4 py-2 bg-[#0d0f15] border-t border-[#1e2332] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <div className="flex items-center gap-3">
                  <span>Console: 0 Erros</span>
                  <span>•</span>
                  <span>DOM: 100% Renderizado</span>
                </div>
                <div className="text-neutral-500">
                  Fase {currentLevel.id} de {totalLevels}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* ========================================================== */
          /* THEME 1: O ENIGMA DA PORTA MECÂNICA / COFRE / SCI-FI (1-10)*/
          /* ========================================================== */
          <div className="w-full flex flex-col items-center justify-center my-auto">
            
            {/* Atmospheric Wall Glow behind door */}
            <div className={`w-52 sm:w-64 h-52 sm:h-64 rounded-full blur-3xl absolute -z-10 transition-all duration-700 pointer-events-none ${
              isDoorOpen 
                ? 'bg-emerald-500/25 scale-125' 
                : 'bg-blue-600/10'
            }`} />

            {/* DOOR FRAME (Outer Portal Architecture) */}
            <div className="relative p-3 sm:p-4 rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-[#242836] via-[#1a1d27] to-[#12141c] border-2 border-[#33384a] shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
              
              {/* Outer Arch Keystone / Crest */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#2a2e3f] border border-[#3e455e] text-[10px] font-mono font-bold tracking-widest text-neutral-300 shadow-md flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isDoorOpen ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-red-400'}`} />
                <span>NÍVEL {currentLevel.id}</span>
              </div>

              {/* INNER PORTAL PASSAGEWAY */}
              <div className="relative w-56 sm:w-68 md:w-76 h-68 sm:h-80 md:h-92 bg-neutral-950 rounded-t-xl sm:rounded-t-2xl overflow-hidden border border-black/80 flex perspective-[1000px]">
                
                {/* Behind Door Scene (Light & Passage when open) */}
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/20 via-sky-500/10 to-transparent flex flex-col items-center justify-center pointer-events-none">
                  {isDoorOpen && (
                    <div className="flex flex-col items-center gap-2 text-emerald-300 animate-in fade-in zoom-in duration-500">
                      <Sparkles className="w-8 h-8 text-amber-300 animate-bounce" />
                      <span className="font-mono text-xs font-bold tracking-wider text-emerald-200">
                        PASSAGEM LIBERADA!
                      </span>
                    </div>
                  )}
                </div>

                {/* LEFT DOOR LEAF */}
                <div 
                  className={`w-1/2 h-full bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-r border-amber-950/60 shadow-2xl relative transition-transform duration-700 ease-out origin-left flex flex-col justify-between p-3 ${
                    isDoorOpen ? '-rotate-y-85' : 'rotate-y-0'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Left Door Iron Studs */}
                  <div className="flex justify-between">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  </div>
                  {/* Left Panel Emblem */}
                  <div className="w-full h-24 rounded border border-amber-800/40 bg-black/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border border-amber-600/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  </div>
                </div>

                {/* RIGHT DOOR LEAF */}
                <div 
                  className={`w-1/2 h-full bg-gradient-to-l from-amber-950 via-amber-900 to-amber-950 border-l border-amber-950/60 shadow-2xl relative transition-transform duration-700 ease-out origin-right flex flex-col justify-between p-3 ${
                    isDoorOpen ? 'rotate-y-85' : 'rotate-y-0'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Right Door Iron Studs */}
                  <div className="flex justify-between">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  </div>
                  {/* Right Panel Emblem */}
                  <div className="w-full h-24 rounded border border-amber-800/40 bg-black/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border border-amber-600/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  </div>

                  {/* Grip Ring & Keyhole */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-2 flex items-center">
                    <div className="w-3.5 h-7 rounded-r-md border-2 border-neutral-400 bg-neutral-800/80 shadow-md flex items-center justify-center">
                      <div className="w-1 h-2 bg-neutral-950 rounded-xs" />
                    </div>
                  </div>
                </div>

                {/* Center Lock / Padlock Mechanism when Locked */}
                {!isDoorOpen && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-neutral-900 border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center text-red-400 animate-pulse">
                      <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Door Base Threshold & Ground Shadow */}
            <div className="w-64 sm:w-76 md:w-88 h-3.5 bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 rounded-b border-t border-neutral-500 shadow-2xl -mt-0.5" />
            <div className="w-72 sm:w-84 md:w-96 h-2 bg-black/60 blur-xs rounded-full -mt-0.5" />
          </div>
        )}

        {/* Validation Result / Next Level Banner */}
        <div className="w-full max-w-md relative z-20 mt-3 sm:mt-4">
          {isDoorOpen ? (
            <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in zoom-in-95 duration-200 backdrop-blur-md">
              <div className="flex items-center gap-2.5 text-emerald-300">
                <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{isWebBuilderTheme ? 'Desafio concluído com sucesso!' : 'Porta destrancada com sucesso!'}</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-[11px] text-emerald-300/90 font-mono mt-0.5">
                    {validationMessage || 'O caminho para o próximo desafio está livre!'}
                  </div>
                </div>
              </div>

              <button
                id="btn-next-level"
                onClick={onNextLevel}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer shrink-0 min-h-[44px]"
              >
                <span>{isFinalLevel ? 'Concluir Todos os Níveis!' : 'Próxima Fase'}</span>
                {isFinalLevel ? <Trophy className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          ) : hasAttempted ? (
            <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-150 backdrop-blur-md shadow-lg">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-mono text-[11px] leading-relaxed">
                {validationMessage || (isWebBuilderTheme ? 'A validação falhou. Revise o código no editor e tente novamente!' : 'A porta continua fechada. Revise o código no editor e tente novamente!')}
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-neutral-400 text-xs flex items-center justify-between shadow-md">
              <span className="font-mono text-[11px]">
                💡 Edite o código e clique em <strong className="text-emerald-400 font-semibold">&quot;Executar Código&quot;</strong>.
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
