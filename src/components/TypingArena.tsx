import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sparkles, Award, Keyboard, HelpCircle, AlertCircle, Zap, Gauge, Trophy, AlertTriangle, Timer, Activity, Pause, Play, Lock, Palette, Coins, Users, Swords, Target, Scroll } from 'lucide-react';
import { CategoryId, FloatingText, DrillSession, KeyTelemetry, AccessibilitySettings, CurricularTrackId, TypingMode } from '../types';
import { BytezinhoSkinId, TerminalThemeId, AnimationEffectId } from '../types/cosmetics';
import { TERMINAL_THEMES } from '../constants/themes';
import { WORD_CATEGORIES, getCurricularTrack, getTrackCategories } from '../data/words';
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
  onOpenQuests?: () => void;
  onOpenDungeon?: () => void;
  questsCount?: { readyToClaim: number; currentFloor: number };
  dungeonKeys?: number;
  maxDungeonKeys?: number;
  wordsTowardKey?: number;
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
  accessibility?: AccessibilitySettings;
  activeTrack?: CurricularTrackId;
  typingMode?: TypingMode;
  onSelectTypingMode?: (mode: TypingMode) => void;
  onOpenTimeAttack?: () => void;
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
  onOpenQuests,
  onOpenDungeon,
  questsCount,
  dungeonKeys = 3,
  maxDungeonKeys = 5,
  wordsTowardKey = 0,
  onMascotClick,
  onOpenArena,
  onOpenConverter,
  levelTokens = 0,
  quantumFragments = 0,
  isAdmin = false,
  drillSession = null,
  onCancelDrill,
  onStartDrill,
  keyTelemetry = {},
  accessibility,
  activeTrack = 'geral',
  typingMode = 'words',
  onSelectTypingMode,
  onOpenTimeAttack
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || internalInputRef;

  const [isFocused, setIsFocused] = useState(true);
  const activeTerminalTheme = TERMINAL_THEMES[equippedTheme || 'matrix'] || TERMINAL_THEMES.matrix;

  // Acessibilidade: Escala de caracteres e Modo Alto Contraste (Baixa Visão)
  const isHighContrast = Boolean(accessibility?.highContrast);
  const contrastTheme = accessibility?.contrastTheme || 'high_contrast_yellow';

  // Estratégia Híbrida: Largura adaptativa suave por modo de digitação
  const outerMaxWidthClass = React.useMemo(() => {
    switch (typingMode) {
      case 'code':
        return 'max-w-4xl xl:max-w-5xl';
      case 'sentences':
        return 'max-w-3xl lg:max-w-4xl';
      case 'words':
      default:
        return 'max-w-2xl md:max-w-3xl';
    }
  }, [typingMode]);

  const cardMaxWidthClass = React.useMemo(() => {
    switch (typingMode) {
      case 'code':
        return 'max-w-4xl xl:max-w-5xl 2xl:max-w-6xl w-full';
      case 'sentences':
        return 'max-w-4xl xl:max-w-5xl w-full';
      case 'words':
      default:
        return 'max-w-2xl md:max-w-3xl w-full';
    }
  }, [typingMode]);

  const trackingClass = React.useMemo(() => {
    switch (typingMode) {
      case 'code':
        return 'tracking-normal';
      case 'sentences':
        return 'tracking-normal';
      case 'words':
      default: {
        const len = currentWord?.length || 0;
        if (len >= 14) return 'tracking-wide';
        if (len >= 9) return 'tracking-wide sm:tracking-wider';
        return 'tracking-wider sm:tracking-widest';
      }
    }
  }, [typingMode, currentWord]);

  const textScaleClass = React.useMemo(() => {
    if (typingMode === 'sentences') {
      switch (accessibility?.textScale) {
        case 'large':
          return 'text-lg sm:text-xl md:text-2xl';
        case 'huge':
          return 'text-xl sm:text-2xl md:text-3xl';
        case 'mega':
          return 'text-2xl sm:text-3xl md:text-4xl';
        case 'normal':
        default:
          return 'text-base sm:text-lg md:text-xl';
      }
    }

    if (typingMode === 'code') {
      switch (accessibility?.textScale) {
        case 'large':
          return 'text-base sm:text-lg md:text-xl';
        case 'huge':
          return 'text-lg sm:text-xl md:text-2xl';
        case 'mega':
          return 'text-xl sm:text-2xl md:text-3xl';
        case 'normal':
        default:
          return 'text-sm sm:text-base md:text-lg';
      }
    }

    // Default 'words' mode: Escalonamento adaptativo inteligente e proeminente baseado no comprimento da palavra
    // Garante palavras grandes, legíveis e com forte coesão no centro do terminal, prevenindo overflow
    const len = currentWord?.length || 0;

    // Palavras ultra-longas (>= 14 letras, ex: semicondutividade, interoperabilidade, otorrinolaringologista)
    if (len >= 14) {
      switch (accessibility?.textScale) {
        case 'mega':
          return 'text-2xl sm:text-3xl md:text-4xl';
        case 'huge':
          return 'text-2xl sm:text-3xl md:text-4xl';
        case 'large':
          return 'text-2xl sm:text-3xl md:text-4xl';
        case 'normal':
        default:
          return 'text-2xl sm:text-3xl md:text-4xl';
      }
    }

    // Palavras médias-longas (9 a 13 letras, ex: tecnologia, computador, programador)
    if (len >= 9) {
      switch (accessibility?.textScale) {
        case 'mega':
          return 'text-4xl sm:text-5xl md:text-6xl';
        case 'huge':
          return 'text-3xl sm:text-4xl md:text-5xl';
        case 'large':
          return 'text-3xl sm:text-4xl md:text-5xl';
        case 'normal':
        default:
          return 'text-3xl sm:text-4xl md:text-5xl';
      }
    }

    // Palavras médias (6 a 8 letras, ex: sistema, codigo, teclado, python)
    if (len >= 6) {
      switch (accessibility?.textScale) {
        case 'mega':
          return 'text-5xl sm:text-6xl md:text-7xl';
        case 'huge':
          return 'text-4xl sm:text-5xl md:text-6xl';
        case 'large':
          return 'text-4xl sm:text-5xl md:text-6xl';
        case 'normal':
        default:
          return 'text-3xl sm:text-4xl md:text-5xl';
      }
    }

    // Palavras curtas (<= 5 letras, ex: byte, web, pixel, dado, rede)
    switch (accessibility?.textScale) {
      case 'mega':
        return 'text-6xl sm:text-7xl md:text-8xl';
      case 'huge':
        return 'text-5xl sm:text-6xl md:text-7xl';
      case 'large':
        return 'text-4xl sm:text-5xl md:text-6xl';
      case 'normal':
      default:
        return 'text-4xl sm:text-5xl md:text-6xl';
    }
  }, [accessibility?.textScale, typingMode, currentWord]);

  // Agrupamento por tokens/palavras para quebra natural de linha (Word-Boundary Wrapping)
  // Garante que uma palavra nunca se quebre no meio da sílaba ao atingir o fim da linha
  const wordTokens = React.useMemo(() => {
    if (!currentWord) return [];

    if (typingMode === 'words') {
      return [{
        chars: currentWord.split('').map((char, index) => ({ char, index }))
      }];
    }

    const tokens: Array<{ chars: Array<{ char: string; index: number }> }> = [];
    let currentChars: Array<{ char: string; index: number }> = [];
    let inWord = false;

    for (let i = 0; i < currentWord.length; i++) {
      const char = currentWord[i];
      const isSpace = char === ' ';

      if (isSpace) {
        if (inWord) {
          // Espaço imediatamente após uma palavra fica ancorado a ela para quebras de linha perfeitas
          currentChars.push({ char, index: i });
          tokens.push({ chars: currentChars });
          currentChars = [];
          inWord = false;
        } else {
          // Espaços múltiplos consecutivos ou no início
          currentChars.push({ char, index: i });
        }
      } else {
        if (!inWord && currentChars.length > 0) {
          tokens.push({ chars: currentChars });
          currentChars = [];
        }
        inWord = true;
        currentChars.push({ char, index: i });
      }
    }

    if (currentChars.length > 0) {
      tokens.push({ chars: currentChars });
    }

    return tokens;
  }, [currentWord, typingMode]);

  const highContrastCardClass = isHighContrast
    ? contrastTheme === 'high_contrast_yellow'
      ? 'bg-black border-4 border-amber-400 shadow-none'
      : contrastTheme === 'high_contrast_cyan'
      ? 'bg-black border-4 border-cyan-400 shadow-none'
      : 'bg-black border-4 border-white shadow-none'
    : '';

  const highContrastCurrentCharClass = isHighContrast
    ? contrastTheme === 'high_contrast_yellow'
      ? 'text-black bg-amber-400 font-black ring-4 ring-white shadow-none'
      : contrastTheme === 'high_contrast_cyan'
      ? 'text-black bg-cyan-400 font-black ring-4 ring-white shadow-none'
      : 'text-black bg-white font-black ring-4 ring-amber-400 shadow-none'
    : '';

  const highContrastDoneCharClass = isHighContrast
    ? 'text-emerald-400 font-black opacity-100'
    : '';

  const highContrastPendingCharClass = isHighContrast
    ? 'text-zinc-500 font-bold'
    : '';

  const cursorClass = accessibility?.thickCursor
    ? 'h-2.5 sm:h-3 rounded-full bg-amber-400 ring-2 ring-white animate-pulse'
    : `h-1 rounded-full animate-cursor-pulse ${activeTerminalTheme.classes.cursor}`;

  const shouldShake = isErrorShaking && !accessibility?.reduceMotion;

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

  // Auto-scroll suave para manter a linha e o caractere ativo sempre visíveis em frases e código
  useEffect(() => {
    if (typingMode === 'words') return;
    const activeSpan = wordContainerRef.current?.querySelector('.char-current') as HTMLElement | null;
    if (activeSpan && wordContainerRef.current) {
      activeSpan.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [charIndex, typingMode]);

  // Reseta o scroll para o topo ao carregar uma nova palavra, frase ou código
  useEffect(() => {
    if (wordContainerRef.current) {
      wordContainerRef.current.scrollTop = 0;
    }
  }, [currentWord]);

  // Desfoca imediatamente o input invisível e suspende o foco quando o jogo estiver pausado
  useEffect(() => {
    if (isPaused) {
      inputRef.current?.blur();
      setIsFocused(false);
    }
  }, [isPaused, inputRef]);

  // Mantém o input focado para captura de digitação direta no laboratório quando o jogo estiver ativo
  useEffect(() => {
    if (isPaused) return;

    const focusInput = () => {
      if (isPaused) return;

      // Salvaguarda extra: se houver qualquer modal ou overlay z-50 ativo no DOM, aborta imediatamente
      const hasActiveModal = Boolean(document.querySelector('.fixed.inset-0.z-50, .fixed.inset-0.z-\\[100\\]'));
      if (hasActiveModal) return;

      if (inputRef.current && document.activeElement !== inputRef.current) {
        // Não rouba foco se o aluno ou professor estiver editando campos, selects ou botões de diálogo
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea' && activeTag !== 'select') {
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
    if (isPaused) return;
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
    if (isPaused) return;

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
      e.preventDefault();
      const resolved = resolveDeadKey(e.nativeEvent, currentWord[charIndex]);
      if (resolved) {
        onDeadKey(resolved);
      }
      return;
    }
  };

  // Calcula progresso até o próximo +0.2x no multiplicador (a cada 5 acertos)
  const hitsInCurrentTier = comboStreak % 5;
  const isMaxMultiplier = multiplier >= 5.0;

  // Trilha Curricular Ativa e categorias dinâmicas
  const activeTrackConfig = getCurricularTrack(activeTrack);
  const currentCategories = getTrackCategories(activeTrack);
  const activeCatObj = currentCategories.find(c => c.id === selectedCategory) || currentCategories[0];
  const currentTheme = THEME_STYLES[activeCatObj.themeColor] || THEME_STYLES.emerald;

  return (
    <div className={`w-full flex-1 min-w-0 flex flex-col items-center justify-start pt-2 sm:pt-3 px-2 sm:px-3 pb-4 ${outerMaxWidthClass} mx-auto relative overflow-x-hidden gap-2 sm:gap-2.5 transition-[max-width] duration-300 ease-in-out`}>
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

      {/* Main Interactive Typing Box */}
      <div className="w-full flex flex-col items-center justify-start my-0.5 relative flex-shrink-0">
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

        {/* Word Display Card */}
        <div
          ref={containerRef}
          onClick={handleCardClick}
          className={`w-full ${cardMaxWidthClass} ${
            isHighContrast ? highContrastCardClass : activeTerminalTheme.classes.cardBg
          } arena-terminal-card border-2 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-start transition-[max-width,border-color,background-color,box-shadow] duration-300 ease-in-out min-w-0 ${
            isHighContrast ? '' : activeTerminalTheme.classes.glowEffect || 'shadow-[0_12px_36px_rgba(0,0,0,0.6)]'
          } relative overflow-hidden cursor-text ${
            isPaused
              ? 'border-amber-500/90 shadow-[0_0_40px_rgba(245,158,11,0.3)] bg-[#0f1219]'
              : shouldShake
              ? 'animate-shake border-red-500/80 shadow-[0_0_24px_rgba(239,68,68,0.3)] bg-red-950/20'
              : !isFocused
              ? 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
              : isHighContrast
              ? highContrastCardClass
              : `${activeTerminalTheme.classes.cardBorder}`
          }`}
        >
          {/* Subtle Cyber Grid Background effect (suprimido em Alto Contraste para máxima nitidez) */}
          {!isHighContrast && (
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          )}

          {/* Animações e Efeitos Atmosféricos do Tema do Terminal */}
          {!isHighContrast && (
            <TerminalThemeEffects themeId={equippedTheme || 'matrix'} isTyping={comboStreak > 0} />
          )}

          {/* 1. Header Unificado (Opção C: Cápsula Dupla Integrada + Fita de Ações e Status) */}
          <div className="w-full flex flex-col gap-2 mb-3 border-b border-[#232838]/70 pb-2.5 select-none">
            {/* Linha Superior: Duas Cápsulas Irmãs Simétricas (Modo à esquerda + Dificuldade à direita) */}
            <div className="w-full flex items-center justify-between gap-2 flex-wrap md:flex-nowrap min-w-0">
              {/* Cápsula 1: Tipo de Digitação (Modo) */}
              <div className="flex items-center gap-1 p-1 bg-[#0b0e14]/90 border border-[#1e2433] rounded-xl shadow-inner flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTypingMode?.('words');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    typingMode === 'words'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Palavras isoladas por dificuldade"
                >
                  <span>🔤</span>
                  <span>Palavras</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTypingMode?.('sentences');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    typingMode === 'sentences'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Frases completas com pontuação real ABNT2"
                >
                  <span>💬</span>
                  <span>Frases</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTypingMode?.('code');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    typingMode === 'code'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.25)]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Código & Símbolos especiais: {}, [], (), <>, ;, ===, =>"
                >
                  <span>💻</span>
                  <span>Código</span>
                </button>
              </div>

              {/* Cápsula 2: Dificuldade (Com a mesma linguagem visual da Cápsula 1) */}
              <div className="flex items-center gap-1 p-1 bg-[#0b0e14]/90 border border-[#1e2433] rounded-xl shadow-inner flex-1 min-w-0 justify-between">
                {currentCategories.map((cat, idx) => {
                  const isSelected = cat.id === selectedCategory;
                  const isAllowed = isCategoryAllowed(cat.id, playerRankLevel);
                  const theme = THEME_STYLES[cat.themeColor] || THEME_STYLES.emerald;
                  const shortNames = ['Inic', 'Básico', 'Médio', 'Avanç', 'Mestre'];
                  const shortName = shortNames[idx] || cat.name;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAllowed) onSelectCategory(cat.id);
                      }}
                      disabled={!isAllowed}
                      className={`group relative flex-1 flex items-center justify-center gap-1 py-1.5 px-1 sm:px-2 rounded-lg text-center transition-all min-w-0 font-mono text-xs ${
                        isSelected
                          ? `${theme.buttonActive} shadow-sm font-bold`
                          : !isAllowed
                          ? 'text-red-900/50 cursor-not-allowed opacity-40'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 cursor-pointer font-medium'
                      }`}
                      title={
                        !isAllowed
                          ? "Nível de rank alto demais para este aquecimento!"
                          : `${cat.name}: ${cat.description} (${cat.bonusMultiplier}x Bytes)`
                      }
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        isSelected ? 'bg-current animate-pulse' : !isAllowed ? 'bg-red-900/60' : 'bg-zinc-600 group-hover:bg-zinc-400'
                      }`} />
                      <span className="truncate">
                        <span className="hidden xl:inline">{cat.name}</span>
                        <span className="xl:hidden">{shortName}</span>
                      </span>
                      <span className="text-[10px] opacity-75 font-bold ml-0.5 hidden sm:inline">
                        {!isAllowed ? <Lock className="w-2.5 h-2.5 inline" /> : `${cat.bonusMultiplier}x`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Linha Secundária: Fita de Contexto e Status */}
            <div className="w-full flex items-center justify-between gap-2 px-1 text-[11px] text-zinc-400 font-mono min-w-0 flex-wrap sm:flex-nowrap">
              {/* Esquerda: Trilha Curricular + Contexto */}
              <div className="flex items-center gap-2 min-w-0 truncate">
                {activeTrack && activeTrack !== 'geral' && (
                  <>
                    <span className="text-[11px] font-mono text-purple-200 bg-purple-950/80 border border-purple-500/40 px-2 py-0.5 rounded-lg flex items-center gap-1 font-bold shadow-sm flex-shrink-0">
                      <span>{activeTrackConfig.icon}</span>
                      <span className="hidden sm:inline">{activeTrackConfig.name}</span>
                    </span>
                    <span className="text-zinc-600 hidden md:inline">|</span>
                  </>
                )}

                {/* Descrição contextual por modo */}
                <div className="truncate text-zinc-400">
                  {typingMode === 'code' ? (
                    <span className="text-purple-300 font-bold flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                      <span>syntax.ts</span>
                      <span className="text-zinc-500 font-normal hidden sm:inline truncate">// símbolos e atalhos ({activeCatObj.name})</span>
                    </span>
                  ) : typingMode === 'sentences' ? (
                    <span className="text-sky-300 font-bold flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                      <span>Fluência ABNT2:</span>
                      <span className="text-zinc-400 font-normal hidden sm:inline truncate">{activeCatObj.description}</span>
                    </span>
                  ) : (
                    <span className="truncate">
                      <strong className="text-zinc-300">{activeCatObj.name}:</strong> {activeCatObj.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Direita: Progresso + Bônus + Status do Teclado */}
              <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 font-bold ml-auto">
                <span className="text-amber-400/90 whitespace-nowrap hidden lg:inline">
                  +{Math.round((activeCatObj.bonusMultiplier - 1) * 100)}% Bônus
                </span>

                <span className="text-zinc-400">
                  {charIndex}/{currentWord.length} CONCLUÍDOS
                </span>

                <span className="text-zinc-600 hidden sm:inline">|</span>

                {/* Status de Foco */}
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-900/80 border border-zinc-800 text-[10px] text-zinc-400 font-normal">
                  <span className={`w-1.5 h-1.5 rounded-full ${isFocused ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{isFocused ? 'ATIVO' : 'DESFOCADO'}</span>
                  <kbd className="px-1 py-0.2 rounded bg-zinc-800 text-zinc-300 text-[9px] font-bold">Esc</kbd>
                </div>

                {isPaused && (
                  <span className="text-[10px] text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold animate-pulse">
                    <span>⏸️</span>
                    <span>Pausa</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Indicador Pedagógico de Acento Pendente (ABNT2 Dead Key Feedback) */}
          {pendingAccent && (
            <div className="mb-2 px-3 py-1.5 rounded-full bg-sky-500/20 border border-sky-500/50 text-sky-300 text-xs font-mono font-bold flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>{getAccentDisplayName(pendingAccent)} ativo! Digite a vogal agora...</span>
            </div>
          )}

          {/* High-Contrast Interactive Characters com suporte a escala de acessibilidade e agrupamento de palavras intactas */}
          <div
            ref={wordContainerRef}
            className={`font-mono ${textScaleClass} ${trackingClass} font-bold my-1 sm:my-2 ${
              typingMode === 'words'
                ? 'h-[105px] sm:h-[125px] 2xl:h-[140px] max-h-[140px] overflow-hidden flex items-center justify-center leading-tight'
                : 'min-h-[130px] max-h-[240px] sm:max-h-[280px] lg:max-h-[320px] overflow-y-auto overflow-x-hidden flex items-start justify-center content-start leading-normal sm:leading-relaxed py-2 scrollbar-thin scrollbar-thumb-zinc-700/60 scrollbar-track-transparent'
            } flex-wrap gap-y-1 sm:gap-y-1.5 select-none w-full max-w-full px-3 sm:px-6 arena-typing-box`}
          >
            {wordTokens.map((token, tokenIdx) => {
              const charPadding = typingMode === 'words'
                ? (currentWord?.length || 0) >= 14
                  ? 'px-0.5 py-0.5'
                  : 'px-0.5 sm:px-1 py-0.5'
                : 'px-0 sm:px-[1px] py-0.5';

              return (
                <span key={tokenIdx} className="inline-flex flex-nowrap items-center max-w-full justify-center">
                  {token.chars.map(({ char, index }) => {
                    const isDone = index < charIndex;
                    const isCurrent = index === charIndex;
                    const isPending = index > charIndex;
                    const isJustTyped = index === charIndex - 1;
                    const animClasses = !isHighContrast ? getLetterVfxClasses(equippedAnimation, isDone, isCurrent, isJustTyped) : '';
                    const isTargetKey = Boolean(drillSession?.targetKeys?.includes(char.toLowerCase()));

                    return (
                      <span
                        key={index}
                        className={`inline-block relative transition-all duration-75 ${charPadding} rounded ${
                        isDone
                          ? isHighContrast
                            ? highContrastDoneCharClass
                            : `char-done ${activeTerminalTheme.classes.charDone} ${animClasses} opacity-90`
                          : isCurrent
                          ? isHighContrast
                            ? highContrastCurrentCharClass
                            : `char-current ${activeTerminalTheme.classes.charCurrent} ${animClasses} bg-zinc-900/60 ring-2 ring-current/80 shadow-[0_0_15px_rgba(255,255,255,0.2)]`
                          : isHighContrast
                          ? highContrastPendingCharClass
                          : 'char-pending text-zinc-600'
                      } ${isJustTyped && !isHighContrast ? animClasses : ''} ${
                        isTargetKey && !isDone
                          ? 'border-b-2 border-amber-400 font-extrabold text-amber-200'
                          : ''
                      }`}
                    >
                      {char === ' ' ? (
                        <span className="inline-block min-w-[0.55em] select-none">&nbsp;</span>
                      ) : (
                        char
                      )}
                      {isCurrent && (
                        <span className={`absolute -bottom-1.5 left-0 right-0 ${cursorClass}`} />
                      )}
                      {isTargetKey && !isDone && (
                        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                      )}
                    </span>
                  );
                })}
              </span>
            );
          })}
          </div>

          {!isFocused && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-mono mt-0.5 bg-amber-500/10 px-3 py-0.5 rounded-md border border-amber-500/20">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Clique no painel para reativar o teclado</span>
            </div>
          )}

          {/* Cronômetro de Cadência & Alertas de Sobrecarga/Vazamento Integrados (Zero Variação de Altura) */}
          <div className="w-full max-w-lg mt-2 sm:mt-2.5 flex flex-col items-center arena-metrics-bar">
            {/* Barra do Cronômetro com Alerta Integrado no Próprio Container */}
            <div className={`w-full p-2 sm:p-2.5 rounded-xl border transition-all ${
              isOverloaded
                ? 'bg-rose-950/70 border-rose-500/90 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-shake'
                : consecutiveErrors === 2
                ? 'bg-amber-950/50 border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.25)] animate-pulse'
                : maxFocusBuffer === 0
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : isDraining
                ? 'bg-rose-950/50 border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.35)] animate-pulse'
                : focusBufferSeconds <= 1.8
                ? 'bg-amber-950/30 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-[#10131a] border-[#222835]'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <div className="flex items-center gap-1.5 font-bold truncate">
                  {isOverloaded ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-ping flex-shrink-0" />
                      <span className="text-rose-300 truncate">⚡ SOBRECARGA! (0.5x) — Acerte 3 teclas p/ estabilizar</span>
                    </>
                  ) : consecutiveErrors === 2 ? (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-bounce flex-shrink-0" />
                      <span className="text-amber-300 truncate">⚠️ 2 Erros Seguidos! Cuidado com a Sobrecarga!</span>
                    </>
                  ) : maxFocusBuffer === 0 ? (
                    <>
                      <Timer className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="text-emerald-300 truncate">Modo Inclusivo: Bateria de Foco Ilimitada</span>
                    </>
                  ) : isDraining ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-spin flex-shrink-0" />
                      <span className="text-rose-300 truncate">VAZAMENTO ATIVO: -{Math.round(drainRatePerSec)} Bytes/s</span>
                    </>
                  ) : (
                    <>
                      <Timer className={`w-3.5 h-3.5 flex-shrink-0 ${focusBufferSeconds <= 1.8 ? 'text-amber-400 animate-bounce' : 'text-emerald-400'}`} />
                      <span className={`truncate ${focusBufferSeconds <= 1.8 ? 'text-amber-300' : 'text-zinc-300'}`}>
                        Buffer de Cadência: {focusBufferSeconds.toFixed(1)}s
                      </span>
                    </>
                  )}
                </div>

                <span className={`text-[10px] flex-shrink-0 ml-1.5 ${
                  isOverloaded
                    ? 'text-rose-300 font-bold underline'
                    : maxFocusBuffer === 0
                    ? 'text-emerald-400 font-bold'
                    : isDraining
                    ? 'text-rose-400 font-bold underline animate-pulse'
                    : focusBufferSeconds <= 1.8
                    ? 'text-amber-400 font-bold'
                    : 'text-zinc-500'
                }`}>
                  {isOverloaded
                    ? 'Recupere o foco!'
                    : maxFocusBuffer === 0
                    ? 'Sem dreno'
                    : isDraining
                    ? 'Digite p/ estancar!'
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

          {/* Combo, Multipliers & Record Feedback */}
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 font-mono">
            {/* Multiplier Badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-bold transition-all ${
              multiplier > 1.0
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_16px_rgba(245,158,11,0.3)]'
                : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60'
            }`}>
              <Flame className={`w-4 h-4 ${multiplier > 1.0 ? 'text-amber-400 animate-bounce' : 'text-zinc-500'}`} />
              <span>Multiplicador: {multiplier.toFixed(1)}x</span>
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
            <div
              onClick={onResume}
              className="absolute inset-0 z-20 bg-[#0d1017]/95 backdrop-blur-sm rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center border-2 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.3)] select-none animate-fadeIn cursor-pointer"
            >
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

        {/* Banner Pedagógico de Treino Corretivo Adaptativo (Modo Estritamente Compacto ~28px) */}
        {drillSession && (
          <div className={`w-full ${cardMaxWidthClass} mt-1.5 px-3 py-1 bg-gradient-to-r from-indigo-950/90 via-purple-950/90 to-indigo-950/90 border border-indigo-500/50 rounded-xl flex items-center justify-between gap-2 shadow-sm font-mono text-xs animate-in fade-in transition-[max-width] duration-300`}>
            <div className="flex items-center gap-2 min-w-0 truncate">
              <Target className="w-3.5 h-3.5 text-indigo-400 animate-pulse flex-shrink-0" />
              <span className="font-bold text-white tracking-wider text-[11px] truncate">
                TREINO CORRETIVO ({drillSession.currentIndex + 1}/{drillSession.totalWords}):
              </span>
              <div className="flex gap-1 flex-shrink-0">
                {drillSession.targetKeys.map(k => (
                  <span key={k} className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded uppercase font-bold text-[10px]">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            {onCancelDrill && (
              <button
                type="button"
                onClick={onCancelDrill}
                className="text-[10px] font-bold text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 transition cursor-pointer flex-shrink-0"
                title="Encerrar treino e retornar ao vocabulário regular"
              >
                Encerrar ✕
              </button>
            )}
          </div>
        )}

        {/* Notificação / Recomendação Espontânea de Treino (Modo Estritamente Compacto ~28px) */}
        {suggestedDrillPrompt && !drillSession && (
          <div className={`w-full ${cardMaxWidthClass} mt-1.5 px-3 py-1 bg-gradient-to-r from-amber-950/95 via-purple-950/90 to-indigo-950/95 border border-amber-500/60 rounded-xl flex items-center justify-between gap-2 shadow-sm font-mono text-xs animate-in fade-in transition-[max-width] duration-300`}>
            <div className="flex items-center gap-2 min-w-0 truncate">
              <Target className="w-3.5 h-3.5 text-amber-400 animate-bounce flex-shrink-0" />
              <span className="text-[11px] text-zinc-300 truncate font-medium">
                💡 Calibrar teclas:
              </span>
              <div className="flex gap-1 flex-shrink-0">
                {suggestedDrillPrompt.keys.map((k) => (
                  <span key={k} className="px-1.5 py-0.2 bg-amber-500/30 text-amber-200 rounded border border-amber-400/50 uppercase font-black text-[10px]">
                    {k}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-amber-300 font-bold hidden sm:inline">(30s +Bônus)</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (onStartDrill) onStartDrill(suggestedDrillPrompt.keys);
                  setSuggestedDrillPrompt(null);
                }}
                className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-mono font-bold text-[11px] shadow-sm transition cursor-pointer flex items-center gap-1"
              >
                <span>Treinar</span>
                <span>→</span>
              </button>
              <button
                type="button"
                onClick={handleDismissSuggestion}
                className="px-1.5 py-0.5 rounded-md text-zinc-500 hover:text-zinc-300 font-mono text-[10px] transition cursor-pointer"
                title="Dispensar sugestão temporariamente"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Botão de Acesso Rápido Permanente na Arena (Modo Estritamente Compacto ~28px) */}
        {weakKeys.length > 0 && !drillSession && !suggestedDrillPrompt && (
          <div className={`w-full ${cardMaxWidthClass} mt-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-950/30 via-purple-950/30 to-indigo-950/30 border border-amber-500/30 flex items-center justify-between gap-2 text-xs font-mono text-amber-300 min-w-0 transition-[max-width] duration-300 animate-in fade-in`}>
            <div className="flex items-center gap-2 min-w-0 truncate">
              <Target className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-pulse" />
              <span className="font-bold text-[11px] truncate">Calibração motora:</span>
              <div className="flex gap-1 flex-shrink-0">
                {weakKeys.map(k => (
                  <span key={k.char} className="px-1.5 py-0.2 bg-amber-500/20 text-amber-200 rounded border border-amber-500/40 uppercase font-black text-[10px]">
                    {k.char}
                  </span>
                ))}
              </div>
            </div>
            {onStartDrill && (
              <button
                type="button"
                onClick={() => onStartDrill(weakKeys.map(k => k.char))}
                className="px-2.5 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold transition flex items-center gap-1 cursor-pointer flex-shrink-0"
              >
                <span>Treinar (+Bônus)</span>
                <span>→</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Mascote Interativo Bytezinho (Mentor & Torcedor reativo posicionado logo abaixo da Arena) */}
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
        className={cardMaxWidthClass}
      />

      {/* 3. Dock de Atividades: MASMORRA, MISSÕES, LOJA, ARENA 1x1, FORJA */}
      <div className={`w-full ${cardMaxWidthClass} arena-dock-bar bg-[#11141c]/95 border border-[#232835] rounded-2xl p-2 sm:p-2.5 text-zinc-400 flex items-center justify-center gap-2 sm:gap-3 flex-wrap shadow-[0_4px_25px_rgba(0,0,0,0.35)] flex-shrink-0 mt-1 transition-[max-width] duration-300 ease-in-out`}>
        {/* MASMORRA RPG (Combate de Texto Inteiro & Chaves de Expedição) */}
        {onOpenDungeon && (
          <button
            type="button"
            onClick={onOpenDungeon}
            className="arena-dock-btn flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-red-950/90 via-rose-950/80 to-amber-950/90 hover:from-red-900/90 hover:to-amber-900/90 text-amber-200 hover:text-white border border-rose-500/60 text-xs sm:text-sm font-bold transition shadow-[0_0_16px_rgba(244,63,94,0.3)] cursor-pointer group transform hover:scale-[1.03] active:scale-[0.98]"
            title={`Masmorra de Digitação • Chaves: ${dungeonKeys}/${maxDungeonKeys}`}
          >
            <Swords className="w-4 h-4 text-rose-400 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide">MASMORRA</span>
            <div className="flex items-center gap-1.5">
              {questsCount && (
                <span className="flex items-center px-1.5 py-0.5 rounded-md bg-rose-950/90 text-rose-300 border border-rose-500/50 text-[10px] sm:text-xs font-mono font-bold">
                  A.{questsCount.currentFloor}
                </span>
              )}
              <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-mono text-[10px] sm:text-xs font-bold border ${
                dungeonKeys > 0
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700'
              }`}>
                <span>🔑</span>
                <span>{dungeonKeys}/{maxDungeonKeys}</span>
              </span>
            </div>
          </button>
        )}

        {/* MISSÕES SEMANAIS */}
        {onOpenQuests && (
          <button
            type="button"
            onClick={onOpenQuests}
            className="arena-dock-btn flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-950/80 via-indigo-950/70 to-cyan-950/80 hover:from-cyan-900/80 hover:to-indigo-900/80 text-cyan-200 hover:text-white border border-cyan-500/50 text-xs sm:text-sm font-bold transition shadow-[0_0_14px_rgba(6,182,212,0.2)] cursor-pointer group transform hover:scale-[1.03] active:scale-[0.98]"
            title="Terminal de Missões Semanais"
          >
            <Scroll className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">MISSÕES</span>
            {questsCount && questsCount.readyToClaim > 0 ? (
              <span className="flex items-center px-2 py-0.5 rounded-full bg-amber-500 text-black font-black text-xs animate-bounce shadow-sm">
                {questsCount.readyToClaim}
              </span>
            ) : null}
          </button>
        )}

        {/* LOJA DE COSMÉTICOS & SKINS */}
        {onOpenCosmetics && (
          <button
            type="button"
            onClick={onOpenCosmetics}
            className="arena-dock-btn flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-purple-950/80 via-indigo-950/70 to-purple-950/80 hover:from-purple-900/80 hover:to-indigo-900/80 text-purple-200 hover:text-white border border-purple-500/60 text-xs sm:text-sm font-bold transition shadow-[0_0_14px_rgba(168,85,247,0.25)] cursor-pointer group transform hover:scale-[1.03] active:scale-[0.98]"
            title="Loja do Laboratório: Temas de Terminal, Skins do Bytezinho, Layouts e Sons de Teclado"
          >
            <Palette className="w-4 h-4 text-purple-300 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">LOJA</span>
            {levelTokens > 0 ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/40 text-[10px] sm:text-xs font-mono font-bold">
                <Coins className="w-3 h-3 text-amber-400" />
                <span>{levelTokens}</span>
              </span>
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-purple-400 opacity-70 group-hover:opacity-100" />
            )}
          </button>
        )}

        {/* ARENA 1x1 (MULTIPLAYER) */}
        {onOpenArena && (() => {
          const isArenaUnlocked = playerRankLevel >= 100 || isAdmin;
          return (
            <button
              type="button"
              onClick={onOpenArena}
              className={`arena-dock-btn flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border text-xs sm:text-sm font-bold transition cursor-pointer group transform hover:scale-[1.03] active:scale-[0.98] ${
                isArenaUnlocked
                  ? 'bg-gradient-to-r from-red-950/80 via-rose-950/70 to-amber-950/80 hover:from-red-900 hover:to-amber-900 text-white border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:text-zinc-200'
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
                <Swords className="w-4 h-4 text-red-400 group-hover:rotate-12 transition-transform" />
              ) : (
                <Lock className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
              )}
              <span>ARENA 1x1</span>
              {isAdmin ? (
                <span className="flex items-center px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                  ADM
                </span>
              ) : playerRankLevel >= 100 ? (
                <span className="flex items-center px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold">
                  100
                </span>
              ) : null}
            </button>
          );
        })()}

        {/* FORJA QUÂNTICA (3ª Moeda • Nível 100) */}
        {onOpenConverter && (() => {
          const isConverterUnlocked = playerRankLevel >= 100 || isAdmin;
          return (
            <button
              type="button"
              onClick={onOpenConverter}
              className={`arena-dock-btn flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border text-xs sm:text-sm font-bold transition cursor-pointer group transform hover:scale-[1.03] active:scale-[0.98] ${
                isConverterUnlocked
                  ? 'bg-gradient-to-r from-cyan-950/80 via-indigo-950/70 to-purple-950/80 hover:from-cyan-900 hover:to-indigo-900 text-cyan-200 hover:text-white border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:text-zinc-200'
              }`}
              title={
                isAdmin
                  ? '🌌 Forja Quântica (Acesso Liberado para ADM: Converter Bytes em Fragmentos Quânticos)'
                  : playerRankLevel >= 100
                  ? '🌌 Forja Quântica (Desbloqueado para Lendas Leopoldina: Converta Bytes em Fragmentos Quânticos!)'
                  : `🔒 Forja Quântica (Requer Nível 100 • Seu Nível: ${playerRankLevel}/100)`
              }
            >
              <span className={`text-sm ${isConverterUnlocked ? 'animate-pulse' : 'opacity-60'}`}>🌌</span>
              <span className="tracking-wide">FORJA</span>
              {quantumFragments > 0 ? (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                  <span>{quantumFragments}</span>
                </span>
              ) : isConverterUnlocked ? (
                <span className="flex items-center px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                  100
                </span>
              ) : (
                <Lock className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
              )}
            </button>
          );
        })()}
      </div>
    </div>
  );
};
