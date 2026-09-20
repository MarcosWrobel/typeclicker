import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sparkles, Award, Keyboard, HelpCircle, AlertCircle, Zap, Gauge, Trophy, AlertTriangle, Timer, Activity, Pause, Play, Lock, Palette, Coins, Users, Swords, Target } from 'lucide-react';
import { CategoryId, FloatingText, DrillSession, KeyTelemetry } from '../types';
import { BytezinhoSkinId, TerminalThemeId, AnimationEffectId } from '../types/cosmetics';
import { TERMINAL_THEMES } from '../constants/themes';
import { WORD_CATEGORIES } from '../data/words';
import { isAccentKey, resolveDeadKey, getAccentDisplayName } from '../utils/keyboardAccents';
import { BytezinhoMascot } from './BytezinhoMascot';
import { TerminalThemeEffects } from './TerminalThemeEffects';
import { isCategoryAllowed, getMinAllowedCategoryLevel } from '../utils/difficulty';
import { getLetterVfxClasses, triggerKeystrokeImpact } from '../services/fxEngine';
import { identificarTeclasFracas } from '../services/adaptiveDrillEngine';

interface TypingArenaProps {
  playerRankLevel: number;
  currentWord: string;
  charIndex: number;
  isErrorShaking: boolean;
  comboStreak: number;
  multiplier: number;
  maxCombo: number;
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  floatingTexts: FloatingText[];
  pendingAccent?: string | null;
  onTypeChar: (char: string) => void;
  onDeadKey: (accent: string) => void;
  onClearPendingAccent: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  recentWordComplete?: boolean;
  recentUpgradeBought?: string | null;
  focusBufferSeconds?: number;
  isDraining?: boolean;
  consecutiveErrors?: number;
  isOverloaded?: boolean;
  isOverheating?: boolean;
  drainRatePerSec?: number;
  maxFocusBuffer?: number;
  isPaused?: boolean;
  onResume?: () => void;
  onPause?: () => void;
  equippedSkin?: BytezinhoSkinId;
  equippedTheme?: TerminalThemeId;
  equippedAnimation?: AnimationEffectId;
  onOpenCosmetics?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenAchievements?: () => void;
  achievementsCount?: { unlocked: number; total: number };
  onMascotClick?: () => void;
  onOpenArena?: () => void;
  onOpenConverter?: () => void;
  levelTokens?: number;
  quantumFragments?: number;
  isAdmin?: boolean;
  drillSession?: DrillSession | null;
  onCancelDrill?: () => void;
  onStartDrill?: (keys?: string[]) => void;
  keyTelemetry?: Record<string, KeyTelemetry>;
}

const THEME_STYLES: Record<string, {
  buttonActive: string;
  badgeActive: string;
  pillColor: string;
  labelColor: string;
}> = {
  emerald: {
    buttonActive: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-[0_0_14px_rgba(16,185,129,0.25)]',
    badgeActive: 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40',
    pillColor: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    labelColor: 'text-emerald-400'
  },
  sky: {
    buttonActive: 'bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-[0_0_14px_rgba(56,189,248,0.25)]',
    badgeActive: 'bg-sky-500/30 text-sky-200 border border-sky-500/40',
    pillColor: 'text-sky-300 bg-sky-500/15 border-sky-500/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]',
    labelColor: 'text-sky-400'
  },
  amber: {
    buttonActive: 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_14px_rgba(245,158,11,0.25)]',
    badgeActive: 'bg-amber-500/30 text-amber-200 border border-amber-500/40',
    pillColor: 'text-amber-300 bg-amber-500/15 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    labelColor: 'text-amber-400'
  },
  purple: {
    buttonActive: 'bg-purple-500/20 text-purple-300 border-purple-500/60 shadow-[0_0_14px_rgba(168,85,247,0.25)]',
    badgeActive: 'bg-purple-500/30 text-purple-200 border border-purple-500/40',
    pillColor: 'text-purple-300 bg-purple-500/15 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
    labelColor: 'text-purple-400'
  },
  rose: {
    buttonActive: 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-[0_0_14px_rgba(244,63,94,0.25)]',
    badgeActive: 'bg-rose-500/30 text-rose-200 border border-rose-500/40',
    pillColor: 'text-rose-300 bg-rose-500/15 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.2)]',
    labelColor: 'text-rose-400'
  }
};

export const TypingArena: React.FC<TypingArenaProps> = ({
  playerRankLevel,
  currentWord,
  charIndex,
  isErrorShaking,
  comboStreak,
  multiplier,
  maxCombo,
  selectedCategory,
  onSelectCategory,
  floatingTexts,
  pendingAccent,
  onTypeChar,
  onDeadKey,
  onClearPendingAccent,
  inputRef: externalInputRef,
  recentWordComplete = false,
  recentUpgradeBought = null,
  focusBufferSeconds = 5.0,
  maxFocusBuffer = 5.0,
  isDraining = false,
  consecutiveErrors = 0,
  isOverloaded = false,
  isOverheating,
  drainRatePerSec = 0,
  isPaused = false,
  onResume,
  onPause,
  equippedSkin = 'classic',
  equippedTheme = 'matrix',
  equippedAnimation = 'confetti_classic',
  onOpenCosmetics,
  onOpenLeaderboard,
  onOpenAchievements,
  achievementsCount,
  onMascotClick,
  onOpenArena,
  onOpenConverter,
  levelTokens = 0,
  quantumFragments = 0,
  isAdmin = false,
  drillSession = null,
  onCancelDrill,
  onStartDrill,
  keyTelemetry = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || internalInputRef;

  const [isFocused, setIsFocused] = useState(true);
  const activeTerminalTheme = TERMINAL_THEMES[equippedTheme || 'matrix'] || TERMINAL_THEMES.matrix;

  // Análise em tempo real de teclas com dificuldade motora
  const weakKeys = React.useMemo(() => {
    return identificarTeclasFracas(keyTelemetry, 3);
  }, [keyTelemetry]);

  // Gestão de Recomendação Pedagógica Espontânea
  const [suggestedDrillPrompt, setSuggestedDrillPrompt] = useState<{ keys: string[]; idt: number } | null>(null);
  const dismissedUntilRef = useRef<number>(0);

  useEffect(() => {
    if (drillSession) {
      setSuggestedDrillPrompt(null);
      return;
    }

    const now = Date.now();
    if (now < dismissedUntilRef.current) return;

    // Gatilho espontâneo 1: Se o aluno entrar em sobrecarga de erros ou tiver 2 erros seguidos
    if ((consecutiveErrors >= 2 || isOverloaded) && weakKeys.length > 0) {
      setSuggestedDrillPrompt({
        keys: weakKeys.map(k => k.char),
        idt: weakKeys[0].idt
      });
      return;
    }

    // Gatilho espontâneo 2: Ao concluir palavra, se houver tecla com IDT crítico (>= 0.40)
    if (recentWordComplete && weakKeys.length > 0 && weakKeys.some(k => k.idt >= 0.40)) {
      setSuggestedDrillPrompt({
        keys: weakKeys.map(k => k.char),
        idt: weakKeys[0].idt
      });
    }
  }, [consecutiveErrors, isOverloaded, recentWordComplete, weakKeys, drillSession]);

  const handleDismissSuggestion = () => {
    dismissedUntilRef.current = Date.now() + 90000; // 90 segundos de respiro
    setSuggestedDrillPrompt(null);
  };

  // Rastreamento para disparo cinemático de impacto de teclas e finalização de palavras (Arcade VFX)
  const lastCharIndexRef = useRef(charIndex);
  const wordContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Se o jogador avançou na digitação correta da palavra
    if (charIndex > lastCharIndexRef.current) {
      let xPx = window.innerWidth / 2;
      let yPx = window.innerHeight / 2;

      const activeCharSpan = wordContainerRef.current?.querySelector('.char-current') as HTMLElement | null;
      if (activeCharSpan) {
        const rect = activeCharSpan.getBoundingClientRect();
        xPx = rect.left + rect.width / 2;
        yPx = rect.top + rect.height / 2;
      }

      const isWordComplete = charIndex >= currentWord.length;
      const themeColor = activeTerminalTheme.previewColors.accent || '#38bdf8';

      triggerKeystrokeImpact(xPx, yPx, themeColor, equippedAnimation, isWordComplete);
    }
    lastCharIndexRef.current = charIndex;
  }, [charIndex, currentWord, activeTerminalTheme, equippedAnimation]);

  // Mantém o input focado para captura de digitação direta no laboratório
  useEffect(() => {
    if (isPaused) return;

    const focusInput = () => {
      if (isPaused) return;
      if (inputRef.current && document.activeElement !== inputRef.current) {
        // Não rouba foco se o aluno estiver editando campo modal de texto
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          inputRef.current.focus({ preventScroll: true });
        }
      }
    };

    focusInput();
    const interval = setInterval(focusInput, 1500);
    return () => clearInterval(interval);
  }, [inputRef, isPaused]);

  const handleCardClick = () => {
    if (isPaused) return;
    inputRef.current?.focus({ preventScroll: true });
    setIsFocused(true);
  };

  // Processa caracteres digitados no input nativo (suporta composição de acentos ABNT2)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;

    for (const ch of val) {
      if (isAccentKey(ch)) {
        onDeadKey(ch);
      } else {
        onTypeChar(ch);
      }
    }
    // Esvazia para estar pronto para a próxima tecla/combinação
    e.target.value = '';
  };

  // Captura eventos de teclas mortas (Dead) e cancelamento de acentuação
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tecla Escape: se tiver acento pendente, cancela o acento (ABNT2).
    // Se não tiver acento pendente, permite a propagação para o listener unificado do App.tsx.
    if (e.key === 'Escape') {
      if (pendingAccent) {
        e.preventDefault();
        onClearPendingAccent();
        return;
      }
      return;
    }

    if (e.key === 'Backspace') {
      if (pendingAccent) {
        e.preventDefault();
        onClearPendingAccent();
      }
      return;
    }

    // Se o Linux emitir e.key === 'Dead' ou uma tecla de acento isolada
    if (e.key === 'Dead' || isAccentKey(e.key)) {
      const resolved = resolveDeadKey(e.nativeEvent, currentWord[charIndex]);
      if (resolved) {
        onDeadKey(resolved);
      }
    }
  };

  // Calcula progresso até o próximo +0.2x no multiplicador (a cada 5 acertos)
  const hitsInCurrentTier = comboStreak % 5;
  const isMaxMultiplier = multiplier >= 5.0;

  // Dica pedagógica e tema dinâmico baseado na dificuldade selecionada
  const activeCatObj = WORD_CATEGORIES.find(c => c.id === selectedCategory) || WORD_CATEGORIES[0];
  const currentTheme = THEME_STYLES[activeCatObj.themeColor] || THEME_STYLES.emerald;

  return (
    <div className="w-full flex-1 min-w-0 flex flex-col items-center justify-center p-2 sm:p-3 max-w-3xl mx-auto relative overflow-x-hidden gap-1.5 sm:gap-2">
      {/* Input invisível com suporte nativo a IME e Dead Keys do laboratório / Chromium / Firefox */}
      <input
        ref={inputRef}
        id="typing-engine-input"
        type="text"
        value=""
        disabled={isPaused}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="opacity-0 absolute -left-[9999px] top-0 w-1 h-1 pointer-events-auto"
        aria-label="Área de digitação com suporte ABNT2"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* Difficulty Selection Header & Tabs */}
      <div className="w-full flex flex-col items-center gap-1.5 min-w-0 flex-shrink-0">
        <div className="flex items-center justify-between w-full max-w-2xl px-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Gauge className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
              Selecione a Dificuldade
            </span>
            {isPaused && (
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold animate-pulse">
                <span>⏸️</span>
                <span>Pausa Ativa (Ajuste liberado)</span>
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
            Dificuldades maiores rendem mais Bytes!
          </span>
        </div>

        {/* 5 Difficulty Selectors - strictly bounded inside max-w-2xl and 100% accessible within margins */}
        <div className="w-full max-w-2xl px-1 min-w-0">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full">
            {WORD_CATEGORIES.map((cat) => {
              const isSelected = cat.id === selectedCategory;
              const isAllowed = isCategoryAllowed(cat.id, playerRankLevel);
              const theme = THEME_STYLES[cat.themeColor] || THEME_STYLES.emerald;
              
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (isAllowed) onSelectCategory(cat.id);
                  }}
                  disabled={!isAllowed}
                  className={`group relative flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl text-center transition-all border min-w-0 ${
                    isSelected
                      ? `${theme.buttonActive}`
                      : !isAllowed 
                        ? 'bg-[#161214] text-red-900/60 border-red-950/30 cursor-not-allowed opacity-50'
                        : 'bg-[#151922] text-zinc-400 border-[#232833] hover:text-zinc-200 hover:bg-[#1a1f2b] hover:border-zinc-700 cursor-pointer'
                  } ${isPaused ? 'ring-1 ring-amber-500/40' : ''}`}
                  title={
                    !isAllowed
                      ? "Nível de rank alto demais para este aquecimento!"
                      : isPaused
                      ? `Jogo pausado - clique para selecionar ${cat.name}`
                      : `${cat.name} (${cat.bonusMultiplier}x Bytes)`
                  }
                >
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full min-w-0">
                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${
                      isSelected ? 'bg-current animate-pulse' : !isAllowed ? 'bg-red-900/60' : 'bg-zinc-600 group-hover:bg-zinc-400'
                    }`} />
                    <span className={`font-bold text-[11px] sm:text-xs truncate ${!isAllowed ? 'line-through' : ''}`}>
                      {cat.name}
                    </span>
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-full mt-1 transition-all truncate max-w-full ${
                    isSelected
                      ? `${theme.badgeActive}`
                      : !isAllowed
                        ? 'bg-red-950/20 text-red-900/50'
                        : 'bg-zinc-800/90 text-zinc-400 group-hover:text-zinc-300'
                  }`}>
                    {!isAllowed ? (
                      <span className="flex items-center justify-center gap-0.5">
                        <Lock className="w-2.5 h-2.5 inline flex-shrink-0" />
                        <span className="hidden sm:inline">Bloqueado</span>
                        <span className="inline sm:hidden">Bloq.</span>
                      </span>
                    ) : (
                      <>
                        <span className="inline sm:hidden">{cat.bonusMultiplier}x</span>
                        <span className="hidden sm:inline">
                          {cat.bonusMultiplier > 1 ? `+${Math.round((cat.bonusMultiplier - 1) * 100)}%` : '1.0x Base'}
                        </span>
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-2xl bg-[#12151d] border border-[#202530] rounded-xl p-2.5 sm:px-3.5 sm:py-2.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2 text-zinc-300 min-w-0">
            <span className={`px-2.5 py-0.5 rounded-md font-mono font-bold text-[11px] whitespace-nowrap border ${currentTheme.badgeActive}`}>
              {activeCatObj.name} ({activeCatObj.badge})
            </span>
            <span className="text-[11px] text-zinc-400 truncate">
              {activeCatObj.description}
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono font-bold text-[11px] text-amber-300 whitespace-nowrap bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30 self-start sm:self-auto">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Multiplicador: {activeCatObj.bonusMultiplier}x Bytes</span>
          </div>
        </div>
      </div>

      {/* Mascote Interativo Bytezinho (Amigo virtual do aluno) */}
      <BytezinhoMascot
        comboStreak={comboStreak}
        multiplier={multiplier}
        isError={isErrorShaking}
        recentWordComplete={recentWordComplete}
        recentUpgradeBought={recentUpgradeBought}
        consecutiveErrors={consecutiveErrors}
        isDraining={isDraining}
        isOverloaded={isOverloaded}
        isOverheating={isOverheating ?? (isOverloaded || isDraining)}
        skin={equippedSkin}
        weakKeys={weakKeys.map(k => k.char)}
        onMascotClick={onMascotClick}
      />

      {/* Main Interactive Typing Box */}
      <div className="w-full flex flex-col items-center justify-center my-1 relative flex-shrink-0">
        {/* Floating Particle Texts */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingTexts.map((f) => (
            <div
              key={f.id}
              className={`absolute font-mono font-bold text-sm sm:text-base animate-float-up px-2 py-0.5 rounded shadow-lg backdrop-blur-sm z-30 ${
                f.type === 'bonus'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 text-base sm:text-lg'
                  : f.type === 'error'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
              style={{ left: `${f.x}%`, top: `${f.y}%` }}
            >
              {f.text}
            </div>
          ))}
        </div>

        {/* Notificação / Recomendação Espontânea de Treino (Disparada em erros ou hesitação) */}
        {suggestedDrillPrompt && !drillSession && (
          <div className="w-full max-w-2xl mb-2 bg-gradient-to-r from-amber-950/95 via-purple-950/95 to-indigo-950/95 border-2 border-amber-400/90 rounded-xl p-3 sm:px-4 sm:py-3.5 shadow-[0_0_30px_rgba(245,158,11,0.4)] animate-in fade-in zoom-in-95 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-20">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-300 flex-shrink-0 animate-bounce">
                <Target className="w-5 h-5 text-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-amber-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <span>💡 Sugestão Pedagógica</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/30 text-amber-200 border border-amber-500/50 font-bold">
                      Calibração Recomendada
                    </span>
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-200 font-sans mt-0.5 leading-snug">
                  Detectamos hesitação nas teclas{' '}
                  {suggestedDrillPrompt.keys.map((k) => (
                    <strong key={k} className="mx-0.5 px-1.5 py-0.5 bg-amber-500/30 text-amber-200 rounded border border-amber-400/50 font-mono uppercase">
                      {k}
                    </strong>
                  ))}
                  . Recalibre seus dedos em 30s e ganhe bônus de Bytes!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (onStartDrill) onStartDrill(suggestedDrillPrompt.keys);
                  setSuggestedDrillPrompt(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-mono font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.5)] transition cursor-pointer flex items-center gap-1.5"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Iniciar Treino</span>
              </button>
              <button
                type="button"
                onClick={handleDismissSuggestion}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white font-mono text-xs border border-zinc-700 transition cursor-pointer"
                title="Dispensar sugestão temporariamente"
              >
                Depois
              </button>
            </div>
          </div>
        )}

        {/* Botão de Acesso Rápido Permanente na Arena (Sem precisar abrir menus) */}
        {weakKeys.length > 0 && !drillSession && !suggestedDrillPrompt && (
          <div className="w-full max-w-2xl mb-2 flex items-center justify-between p-2 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-indigo-950/40 border border-amber-500/40 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] transition animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-300 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 animate-pulse">
                <Target className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold truncate">Calibração Motora Disponível:</span>
              <span className="text-zinc-400 hidden sm:inline">teclas</span>
              <div className="flex gap-1">
                {weakKeys.map(k => (
                  <span key={k.char} className="px-1.5 py-0.2 bg-amber-500/20 text-amber-200 rounded border border-amber-500/40 uppercase font-black text-[11px]">
                    {k.char}
                  </span>
                ))}
              </div>
            </div>
            {onStartDrill && (
              <button
                type="button"
                onClick={() => onStartDrill(weakKeys.map(k => k.char))}
                className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/50 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ml-2 shadow-sm"
              >
                <span>Calibrar Agora (+Bônus)</span>
                <span>→</span>
              </button>
            )}
          </div>
        )}

        {/* Banner Pedagógico de Treino Corretivo Adaptativo */}
        {drillSession && (
          <div className="w-full max-w-2xl mb-2 bg-gradient-to-r from-indigo-950/90 via-purple-950/90 to-indigo-950/90 border-2 border-indigo-500/60 rounded-xl p-2.5 sm:px-4 sm:py-3 flex items-center justify-between shadow-[0_0_24px_rgba(99,102,241,0.3)] animate-in fade-in">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 flex-shrink-0">
                <Target className="w-4 h-4 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-white font-mono tracking-wider">
                    TREINO CORRETIVO ADAPTATIVO
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 font-bold">
                    {drillSession.currentIndex + 1} / {drillSession.totalWords}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-300 font-mono mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-zinc-400">Teclas em foco:</span>
                  {drillSession.targetKeys.map(k => (
                    <span
                      key={k}
                      className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded uppercase font-bold text-xs shadow-sm"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {onCancelDrill && (
              <button
                type="button"
                onClick={onCancelDrill}
                className="text-[11px] font-mono font-bold text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 transition cursor-pointer whitespace-nowrap ml-2"
                title="Cancelar treino e retornar ao vocabulário regular"
              >
                Encerrar Treino
              </button>
            )}
          </div>
        )}

        {/* Word Display Card */}
        <div
          ref={containerRef}
          onClick={handleCardClick}
          className={`w-full max-w-2xl ${activeTerminalTheme.classes.cardBg} border-2 rounded-2xl p-3.5 sm:p-5 flex flex-col items-center justify-center transition-all min-w-0 ${activeTerminalTheme.classes.glowEffect || 'shadow-[0_12px_36px_rgba(0,0,0,0.6)]'} relative overflow-hidden cursor-text ${
            isPaused
              ? 'border-amber-500/90 shadow-[0_0_40px_rgba(245,158,11,0.3)] bg-[#0f1219]'
              : isErrorShaking
              ? 'animate-shake border-red-500/80 shadow-[0_0_24px_rgba(239,68,68,0.3)] bg-red-950/20'
              : !isFocused
              ? 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
              : `${activeTerminalTheme.classes.cardBorder}`
          }`}
        >
          {/* Subtle Cyber Grid Background effect */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Animações e Efeitos Atmosféricos do Tema do Terminal */}
          <TerminalThemeEffects themeId={equippedTheme || 'matrix'} isTyping={comboStreak > 0} />

          {/* Top Word Label / Progress, Difficulty & Focus Status */}
          <div className="flex flex-wrap items-center justify-between w-full mb-3 text-xs text-zinc-400 font-mono gap-1.5">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isFocused ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isFocused ? 'TECLADO ATIVO' : 'CLIQUE PARA FOCAR'}</span>
            </span>

            {/* Dificuldade Ativa Badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold border transition-all ${currentTheme.pillColor}`}>
              <Zap className="w-3 h-3 text-amber-400" />
              <span>DIFICULDADE: {activeCatObj.name.toUpperCase()} ({activeCatObj.bonusMultiplier}x BÔNUS)</span>
            </div>

            <span>{charIndex}/{currentWord.length} CONCLUÍDOS</span>
          </div>

          {/* Indicador Pedagógico de Acento Pendente (ABNT2 Dead Key Feedback) */}
          {pendingAccent && (
            <div className="mb-2 px-3 py-1.5 rounded-full bg-sky-500/20 border border-sky-500/50 text-sky-300 text-xs font-mono font-bold flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>{getAccentDisplayName(pendingAccent)} ativo! Digite a vogal agora...</span>
            </div>
          )}

          {/* High-Contrast Interactive Characters */}
          <div ref={wordContainerRef} className="font-mono text-3xl sm:text-4xl md:text-5xl tracking-widest font-bold my-2 sm:my-3 flex items-center justify-center flex-wrap gap-1 select-none">
            {currentWord.split('').map((char, index) => {
              const isDone = index < charIndex;
              const isCurrent = index === charIndex;
              const isPending = index > charIndex;
              const isJustTyped = index === charIndex - 1;
              const animClasses = getLetterVfxClasses(equippedAnimation, isDone, isCurrent, isJustTyped);
              const isTargetKey = Boolean(drillSession?.targetKeys?.includes(char.toLowerCase()));

              return (
                <span
                  key={index}
                  className={`inline-block relative transition-all duration-75 px-1 py-0.5 rounded ${
                    isDone
                      ? `char-done ${activeTerminalTheme.classes.charDone} ${animClasses} opacity-90`
                      : isCurrent
                      ? `char-current ${activeTerminalTheme.classes.charCurrent} ${animClasses} bg-zinc-900/60 ring-2 ring-current/80 shadow-[0_0_15px_rgba(255,255,255,0.2)]`
                      : 'char-pending text-zinc-600'
                  } ${isJustTyped ? animClasses : ''} ${
                    isTargetKey && !isDone
                      ? 'border-b-2 border-amber-400 font-extrabold text-amber-200'
                      : ''
                  }`}
                >
                  {char === ' ' ? '␣' : char}
                  {isCurrent && (
                    <span className={`absolute -bottom-1.5 left-0 right-0 h-1 rounded-full animate-cursor-pulse ${activeTerminalTheme.classes.cursor}`} />
                  )}
                  {isTargetKey && !isDone && (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                  )}
                </span>
              );
            })}
          </div>

          {!isFocused && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-mono mt-1 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Clique no painel para reativar o teclado</span>
            </div>
          )}

          {/* Cronômetro de Cadência e Alertas de Sobrecarga/Vazamento */}
          <div className="w-full max-w-lg mt-3 flex flex-col items-center gap-2">
            {/* Alerta de Sobrecarga por Erros Consecutivos */}
            {isOverloaded ? (
              <div className="w-full bg-rose-950/60 border border-rose-500/80 rounded-xl p-2.5 flex items-center justify-between gap-2 text-rose-300 font-mono text-xs shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-shake">
                <span className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-400 animate-ping" />
                  <span>⚡ CIRCUITO EM SOBRECARGA! (0.5x)</span>
                </span>
                <span className="text-[11px] text-rose-300">Acerte 3 teclas consecutivas para estabilizar</span>
              </div>
            ) : consecutiveErrors === 2 ? (
              <div className="w-full bg-amber-950/40 border border-amber-500/60 rounded-xl p-2 flex items-center justify-center gap-2 text-amber-300 font-mono text-xs shadow-sm animate-pulse">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>⚠️ 2 Erros Seguidos! O 3º erro consecutivo causa Sobrecarga e perda de Bytes!</span>
              </div>
            ) : null}

            {/* Barra do Cronômetro de Cadência & Vazamento */}
            <div className={`w-full p-2.5 rounded-xl border transition-all ${
              maxFocusBuffer === 0
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : isDraining
                ? 'bg-rose-950/50 border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.35)] animate-pulse'
                : focusBufferSeconds <= 1.8
                ? 'bg-amber-950/30 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-[#10131a] border-[#222835]'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  {maxFocusBuffer === 0 ? (
                    <>
                      <Timer className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Modo Inclusivo: Bateria de Foco Ilimitada</span>
                    </>
                  ) : isDraining ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                      <span className="text-rose-300">VAZAMENTO ATIVO: -{Math.round(drainRatePerSec)} Bytes/s</span>
                    </>
                  ) : (
                    <>
                      <Timer className={`w-3.5 h-3.5 ${focusBufferSeconds <= 1.8 ? 'text-amber-400 animate-bounce' : 'text-emerald-400'}`} />
                      <span className={focusBufferSeconds <= 1.8 ? 'text-amber-300' : 'text-zinc-300'}>
                        Buffer de Cadência: {focusBufferSeconds.toFixed(1)}s
                      </span>
                    </>
                  )}
                </div>

                <span className={`text-[10px] ${
                  maxFocusBuffer === 0
                    ? 'text-emerald-400 font-bold'
                    : isDraining
                    ? 'text-rose-400 font-bold underline animate-pulse'
                    : focusBufferSeconds <= 1.8
                    ? 'text-amber-400 font-bold'
                    : 'text-zinc-500'
                }`}>
                  {maxFocusBuffer === 0
                    ? 'Sem dreno de inatividade'
                    : isDraining
                    ? 'Digite para estancar o dreno!'
                    : focusBufferSeconds <= 1.8
                    ? 'Atenção ao ritmo!'
                    : `Ritmo estável (${maxFocusBuffer}s)`}
                </span>
              </div>

              {/* Barra de progresso do buffer */}
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className={`h-full transition-all duration-100 rounded-full ${
                    maxFocusBuffer === 0
                      ? 'bg-emerald-400 w-full'
                      : isDraining
                      ? 'bg-rose-500 w-full animate-pulse'
                      : focusBufferSeconds <= 1.8
                      ? 'bg-amber-400'
                      : 'bg-gradient-to-r from-teal-400 to-emerald-400'
                  }`}
                  style={{
                    width: maxFocusBuffer === 0 ? '100%' : isDraining ? '100%' : `${Math.min(100, Math.max(0, (focusBufferSeconds / (maxFocusBuffer || 5.0)) * 100))}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Combo, Multipliers & Difficulty Bonus Feedback */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 font-mono">
            {/* Multiplier Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-bold transition-all ${
              multiplier > 1.0
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_16px_rgba(245,158,11,0.3)]'
                : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60'
            }`}>
              <Flame className={`w-4 h-4 ${multiplier > 1.0 ? 'text-amber-400 animate-bounce' : 'text-zinc-500'}`} />
              <span>Multiplicador: {multiplier.toFixed(1)}x</span>
            </div>

            {/* Difficulty Bonus Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-bold transition-all ${currentTheme.pillColor}`}>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Dificuldade: {activeCatObj.bonusMultiplier}x</span>
            </div>

            {/* Combo Streak Badge com Efeito de Fogo Gamer */}
            <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-bold transition-all ${
              comboStreak >= 15
                ? 'bg-gradient-to-r from-rose-500/30 via-amber-500/30 to-purple-500/30 text-rose-300 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse'
                : comboStreak >= 5
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/80 shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                : 'bg-zinc-800/70 border-zinc-700/80 text-zinc-300'
            }`}>
              {comboStreak >= 15 ? (
                <span className="text-sm select-none">🚀</span>
              ) : comboStreak >= 5 ? (
                <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>
                {comboStreak >= 15 ? 'ULTRA COMBO: ' : comboStreak >= 5 ? 'EM CHAMAS: ' : 'Combo: '}
                <strong className={comboStreak >= 15 ? 'text-rose-300' : comboStreak >= 5 ? 'text-amber-300' : 'text-emerald-400'}>
                  {comboStreak}
                </strong>
              </span>
            </div>

            {maxCombo > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-amber-300/90 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 shadow-sm">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Recorde: {maxCombo}</span>
              </div>
            )}
          </div>

          {/* Tier Progress Bar (5 hits per +0.2x) */}
          <div className="w-full max-w-xs mt-2 flex flex-col items-center gap-0.5">
            <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden border border-zinc-700/40">
              <div
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-150 rounded-full"
                style={{
                  width: isMaxMultiplier ? '100%' : `${(hitsInCurrentTier / 5) * 100}%`
                }}
              />
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              {isMaxMultiplier ? 'Multiplicador Máximo Atingido (5.0x)!' : `${hitsInCurrentTier}/5 para +0.2x`}
            </span>
          </div>

          {/* Pause Shield & Action Overlay */}
          {isPaused && (
            <div className="absolute inset-0 z-20 bg-[#0d1017]/95 backdrop-blur-sm rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center border-2 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.3)] select-none animate-fadeIn">
              {/* Ícone Pulsante de Pausa */}
              <div className="relative mb-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)]">
                  <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-amber-400" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500" />
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide mb-1 flex items-center gap-2">
                <span>DIGITAÇÃO PAUSADA</span>
              </h2>
              <p className="text-xs sm:text-sm text-amber-300/90 font-mono mb-4">
                Cronômetro e dreno congelados • Seu combo está 100% seguro
              </p>

              {/* Caixa de destaque sobre a Loja de Upgrades */}
              <div className="w-full max-w-md bg-amber-500/10 border border-amber-500/40 rounded-xl p-3 sm:p-3.5 mb-5 text-xs font-mono text-amber-200 flex items-center gap-3 text-left shadow-inner">
                <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xl flex-shrink-0">
                  🛒
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-white text-xs sm:text-sm block">A Loja de Upgrades está liberada!</span>
                  <span className="text-[11px] text-zinc-300 block leading-tight mt-0.5">
                    Aproveite a pausa para navegar e comprar melhorias na Loja ao lado com calma.
                  </span>
                </div>
              </div>

              {onResume && (
                <button
                  type="button"
                  onClick={onResume}
                  className="px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-xs sm:text-sm font-mono flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] transition cursor-pointer transform hover:scale-105 active:scale-95 border border-amber-300"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>CONTINUAR DIGITAÇÃO</span>
                </button>
              )}
              <span className="text-[10px] font-mono text-zinc-500 mt-2.5">
                Ou pressione <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold">Esc</kbd>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Ações: LOJA, RANKING, ARENA 1x1 e Atalho ESC */}
      <div className="w-full bg-[#12151c] border border-[#232833] rounded-xl p-2 sm:p-2.5 text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner flex-shrink-0 mt-0.5">
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-center sm:justify-start">
          {/* LOJA */}
          {onOpenCosmetics && (
            <button
              type="button"
              onClick={onOpenCosmetics}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-950/80 via-indigo-950/70 to-purple-950/80 hover:from-purple-900 hover:to-indigo-900 text-purple-200 hover:text-white border border-purple-500/60 text-xs font-bold transition shadow-[0_0_12px_rgba(168,85,247,0.25)] cursor-pointer group"
              title="Loja do Laboratório: Temas de Terminal, Skins do Bytezinho, Layouts e Sons de Teclado"
            >
              <Palette className="w-3.5 h-3.5 text-purple-300 group-hover:scale-110 transition-transform" />
              <span className="tracking-wide">LOJA</span>
              {levelTokens > 0 ? (
                <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                  <Coins className="w-2.5 h-2.5 text-amber-400" />
                  <span>{levelTokens}</span>
                </span>
              ) : (
                <Sparkles className="w-3 h-3 text-purple-400 opacity-70 group-hover:opacity-100" />
              )}
            </button>
          )}

          {/* RANKING */}
          {onOpenLeaderboard && (
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 border border-purple-600/40 text-xs font-semibold transition shadow-sm cursor-pointer"
              title="Ranking Geral das Turmas do Leopoldina"
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>RANKING</span>
            </button>
          )}

          {/* CONQUISTAS */}
          {onOpenAchievements && (
            <button
              type="button"
              onClick={onOpenAchievements}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 border border-amber-600/40 text-xs font-semibold transition shadow-sm cursor-pointer group"
              title="Quadro e Galeria de Conquistas do Colégio Leopoldina"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>CONQUISTAS</span>
              {achievementsCount && (
                <span className="flex items-center px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                  {achievementsCount.unlocked}/{achievementsCount.total}
                </span>
              )}
            </button>
          )}

          {/* FORJA QUÂNTICA (3ª Moeda • Nível 100) */}
          {onOpenConverter && (() => {
            const isConverterUnlocked = playerRankLevel >= 100 || isAdmin;
            return (
              <button
                type="button"
                onClick={onOpenConverter}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer group ${
                  isConverterUnlocked
                    ? 'bg-gradient-to-r from-cyan-950/80 via-indigo-950/70 to-purple-950/80 hover:from-cyan-900 hover:to-indigo-900 text-cyan-200 hover:text-white border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-zinc-900/70 hover:bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:text-zinc-200'
                }`}
                title={
                  isAdmin
                    ? '🌌 Forja Quântica (Acesso Liberado para ADM: Converter Bytes em Fragmentos Quânticos)'
                    : playerRankLevel >= 100
                    ? '🌌 Forja Quântica (Desbloqueado para Lendas Leopoldina: Converta Bytes em Fragmentos Quânticos!)'
                    : `🔒 Forja Quântica (Requer Nível 100 • Seu Nível: ${playerRankLevel}/100)`
                }
              >
                <span className={`text-xs ${isConverterUnlocked ? 'animate-pulse' : 'opacity-60'}`}>🌌</span>
                <span className="tracking-wide">FORJA</span>
                {quantumFragments > 0 ? (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                    <span>{quantumFragments}</span>
                  </span>
                ) : isConverterUnlocked ? (
                  <span className="flex items-center px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono font-bold">
                    100
                  </span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                )}
              </button>
            );
          })()}

          {/* ARENA 1x1 */}
          {onOpenArena && (() => {
            const isArenaUnlocked = playerRankLevel >= 100 || isAdmin;
            return (
              <button
                type="button"
                onClick={onOpenArena}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer group ${
                  isArenaUnlocked
                    ? 'bg-gradient-to-r from-red-950/70 via-rose-950/70 to-amber-950/70 hover:from-red-900/80 hover:to-amber-900/80 text-white border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                    : 'bg-zinc-900/70 hover:bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:text-zinc-200'
                }`}
                title={
                  isAdmin
                    ? '⚔️ Arena 1x1 (Acesso Liberado para ADM: wrobel.marcos@gmail.com)'
                    : playerRankLevel >= 100
                    ? '⚔️ Arena 1x1 Multiplayer (Liberado para Lendas Leopoldina!)'
                    : `🔒 Arena 1x1 (Requer Nível 100 • Seu Nível: ${playerRankLevel}/100)`
                }
              >
                {isArenaUnlocked ? (
                  <Swords className="w-3.5 h-3.5 text-red-400 group-hover:rotate-12 transition-transform" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                )}
                <span>ARENA 1x1</span>
                {isAdmin ? (
                  <span className="flex items-center px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold">
                    ADM
                  </span>
                ) : playerRankLevel >= 100 ? (
                  <span className="flex items-center px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[9px] font-mono font-bold">
                    100
                  </span>
                ) : null}
              </button>
            );
          })()}
        </div>

        {/* Informação sobre Pause (Somente ESC) */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono bg-zinc-900/90 px-3 py-1.5 rounded-lg border border-zinc-800 text-amber-300/90 flex-shrink-0">
          <span>Pausar:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold text-[11px] shadow-sm">ESC</kbd>
        </div>
      </div>
    </div>
  );
};
