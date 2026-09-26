import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ShieldAlert, CheckCircle2, Zap, Keyboard, X, Shield, Flame, RotateCcw, Award, Star, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { formatBytes } from '../utils/formatting';
import { getLevelBoss, LevelBossDef } from '../data/levelBosses';
import { CapsLockWarning } from './common/CapsLockWarning';
import { checkCaseMismatch } from '../utils/keyboardCase';

interface ChallengeArenaProps {
  level: number;
  isOpen: boolean;
  reducedAlerts?: boolean;
  onSuccess: (reward: number, stars?: number, timeSpentSeconds?: number) => void;
  onFail: () => void;
}

interface TargetItem {
  id: string;
  text: string;
  type: 'word' | 'shield' | 'break' | 'branch' | 'finisher';
  damage: number;
  label?: string;
}

interface FloatingText {
  id: number;
  text: string;
  type: 'damage' | 'heal' | 'stun' | 'time';
}

const THEME_STYLES: Record<string, {
  border: string;
  glow: string;
  badge: string;
  hpBar: string;
  bgGrad: string;
  accentText: string;
}> = {
  emerald: {
    border: 'border-emerald-500/60',
    glow: 'shadow-[0_0_60px_rgba(16,185,129,0.3)]',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    hpBar: 'from-emerald-500 via-teal-400 to-emerald-300',
    bgGrad: 'from-emerald-950/40 via-zinc-950 to-black',
    accentText: 'text-emerald-400'
  },
  cyan: {
    border: 'border-cyan-500/60',
    glow: 'shadow-[0_0_60px_rgba(6,182,212,0.3)]',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    hpBar: 'from-cyan-500 via-sky-400 to-blue-400',
    bgGrad: 'from-cyan-950/40 via-zinc-950 to-black',
    accentText: 'text-cyan-400'
  },
  amber: {
    border: 'border-amber-500/60',
    glow: 'shadow-[0_0_60px_rgba(245,158,11,0.3)]',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    hpBar: 'from-amber-500 via-yellow-400 to-orange-400',
    bgGrad: 'from-amber-950/40 via-zinc-950 to-black',
    accentText: 'text-amber-400'
  },
  purple: {
    border: 'border-purple-500/60',
    glow: 'shadow-[0_0_60px_rgba(168,85,247,0.3)]',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    hpBar: 'from-purple-500 via-fuchsia-400 to-indigo-400',
    bgGrad: 'from-purple-950/40 via-zinc-950 to-black',
    accentText: 'text-purple-400'
  },
  blue: {
    border: 'border-blue-500/60',
    glow: 'shadow-[0_0_60px_rgba(59,130,246,0.3)]',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    hpBar: 'from-blue-500 via-sky-400 to-cyan-400',
    bgGrad: 'from-blue-950/40 via-zinc-950 to-black',
    accentText: 'text-blue-400'
  },
  rose: {
    border: 'border-rose-500/60',
    glow: 'shadow-[0_0_60px_rgba(244,63,94,0.3)]',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    hpBar: 'from-rose-500 via-red-400 to-orange-500',
    bgGrad: 'from-rose-950/40 via-zinc-950 to-black',
    accentText: 'text-rose-400'
  },
  fuchsia: {
    border: 'border-fuchsia-500/60',
    glow: 'shadow-[0_0_60px_rgba(217,70,239,0.3)]',
    badge: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    hpBar: 'from-fuchsia-500 via-pink-400 to-purple-400',
    bgGrad: 'from-fuchsia-950/40 via-zinc-950 to-black',
    accentText: 'text-fuchsia-400'
  },
  violet: {
    border: 'border-violet-500/60',
    glow: 'shadow-[0_0_60px_rgba(139,92,246,0.3)]',
    badge: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    hpBar: 'from-violet-500 via-purple-400 to-indigo-400',
    bgGrad: 'from-violet-950/40 via-zinc-950 to-black',
    accentText: 'text-violet-400'
  },
  indigo: {
    border: 'border-indigo-500/60',
    glow: 'shadow-[0_0_60px_rgba(99,102,241,0.3)]',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    hpBar: 'from-indigo-500 via-violet-400 to-blue-400',
    bgGrad: 'from-indigo-950/40 via-zinc-950 to-black',
    accentText: 'text-indigo-400'
  },
  gold: {
    border: 'border-amber-400/80',
    glow: 'shadow-[0_0_80px_rgba(251,191,36,0.4)]',
    badge: 'bg-amber-400/20 text-amber-300 border-amber-400/50',
    hpBar: 'from-amber-400 via-yellow-300 to-amber-500',
    bgGrad: 'from-amber-950/50 via-zinc-950 to-black',
    accentText: 'text-amber-300'
  }
};

export const ChallengeArena: React.FC<ChallengeArenaProps> = ({
  level,
  isOpen,
  reducedAlerts = false,
  onSuccess,
  onFail
}) => {
  const bossDef = React.useMemo<LevelBossDef>(() => getLevelBoss(level), [level]);
  const theme = THEME_STYLES[bossDef.themeColor] || THEME_STYLES.emerald;

  const [status, setStatus] = useState<'intro' | 'playing' | 'success' | 'fail'>('intro');
  const [items, setItems] = useState<TargetItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(bossDef.timeLimitSeconds);
  const [bossHp, setBossHp] = useState(bossDef.baseHp);
  const [castProgress, setCastProgress] = useState(0);
  const [isBossStunned, setIsBossStunned] = useState(false);
  const [isBossDamaged, setIsBossDamaged] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [isErrorShaking, setIsErrorShaking] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [stars, setStars] = useState(3);
  const [finalReward, setFinalReward] = useState(bossDef.baseRewardBytes);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [branchChoice, setBranchChoice] = useState<{ fast: string; heavy: string } | null>(null);
  const [caseWarning, setCaseWarning] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<'intro' | 'playing' | 'success' | 'fail'>(status);
  const itemsRef = useRef<TargetItem[]>(items);
  const currentItemIndexRef = useRef<number>(currentItemIndex);
  const charIndexRef = useRef<number>(charIndex);
  const lastProcessedRef = useRef<{ char: string; time: number }>({ char: '', time: 0 });
  const lastKeystrokeTimeRef = useRef<number>(Date.now());
  const errorCountRef = useRef<number>(0);

  // Sincronização imediata de refs para evitar closure stale
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { currentItemIndexRef.current = currentItemIndex; }, [currentItemIndex]);
  useEffect(() => { charIndexRef.current = charIndex; }, [charIndex]);
  useEffect(() => { errorCountRef.current = errorCount; }, [errorCount]);

  const addFloatingText = useCallback((text: string, type: 'damage' | 'heal' | 'stun' | 'time') => {
    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev.slice(-4), { id, text, type }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
    }, 1200);
  }, []);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
      setIsFocused(true);
    }
  }, []);

  // Constrói a sequência de itens da batalha com base nas mecânicas exclusivas do Boss
  const buildItemsForBoss = useCallback((boss: LevelBossDef): TargetItem[] => {
    const result: TargetItem[] = [];

    switch (boss.mechanicType) {
      case 'shield': {
        const shieldToken = boss.shieldTokens?.[0] || '[OK]';
        result.push({
          id: 'shield_0',
          text: shieldToken,
          type: 'shield',
          damage: Math.round(boss.baseHp * 0.25),
          label: 'ESCUDO DE PROTEÇÃO'
        });
        const words = boss.words.slice(0, 3);
        const perWordDmg = Math.round((boss.baseHp * 0.75) / words.length);
        words.forEach((w, idx) => {
          result.push({
            id: `word_${idx}`,
            text: w,
            type: 'word',
            damage: perWordDmg,
            label: `NÚCLEO ${idx + 1}/${words.length}`
          });
        });
        break;
      }

      case 'loop_break': {
        const words = boss.words.slice(0, 2);
        const breakCmd = boss.breakCommands?.[0] || 'BREAK;';
        words.forEach((w, idx) => {
          result.push({
            id: `word_${idx}`,
            text: w,
            type: 'word',
            damage: Math.round(boss.baseHp * 0.35),
            label: `INSTRUÇÃO ${idx + 1}`
          });
          result.push({
            id: `break_${idx}`,
            text: breakCmd,
            type: 'break',
            damage: Math.round(boss.baseHp * 0.15),
            label: 'QUEBRA DE RECURSÃO'
          });
        });
        break;
      }

      case 'two_phase': {
        const phaseOne = boss.words.slice(0, 2);
        const phaseTwo = boss.phaseTwoWords?.[0] || 'SUCESSO_ZERO_ERROS';
        phaseOne.forEach((w, idx) => {
          result.push({
            id: `p1_${idx}`,
            text: w,
            type: 'word',
            damage: Math.round(boss.baseHp * 0.25),
            label: `FASE 1: BUG #${idx + 1}`
          });
        });
        result.push({
          id: 'p2_finisher',
          text: phaseTwo,
          type: 'finisher',
          damage: Math.round(boss.baseHp * 0.5),
          label: 'FASE 2: FINALIZADOR EXAUSTÃO'
        });
        break;
      }

      case 'supreme_trio': {
        const token = boss.shieldTokens?.[0] || '[LEOPOLDINA]';
        result.push({
          id: 'trio_shield',
          text: token,
          type: 'shield',
          damage: Math.round(boss.baseHp * 0.2),
          label: 'FASE 1: ESCUDO DE DIAMANTE'
        });
        result.push({
          id: 'trio_core',
          text: boss.words[0] || 'DOMINIO_ABSOLUTO',
          type: 'word',
          damage: Math.round(boss.baseHp * 0.3),
          label: 'FASE 2: NÚCLEO SUPREMO'
        });
        result.push({
          id: 'trio_finisher',
          text: boss.phaseThreeWords?.[0] || 'VITORIA_LENDARIA_LEOPOLDINA',
          type: 'finisher',
          damage: Math.round(boss.baseHp * 0.5),
          label: 'FASE 3: GOLPE FINAL LENDÁRIO'
        });
        break;
      }

      case 'branching': {
        const pair = boss.branchPairs?.[0];
        if (pair) {
          result.push({
            id: 'branch_1',
            text: pair.heavy.word,
            type: 'branch',
            damage: pair.heavy.damage,
            label: 'ROTA PRINCIPAL'
          });
          result.push({
            id: 'branch_2',
            text: boss.branchPairs?.[1]?.heavy.word || 'RESOLVER_CONFLITOS',
            type: 'branch',
            damage: 200,
            label: 'GOLPE DECISIVO'
          });
        } else {
          boss.words.slice(0, 3).forEach((w, idx) => {
            result.push({
              id: `w_${idx}`,
              text: w,
              type: 'word',
              damage: Math.round(boss.baseHp / 3),
              label: `ROTA ${idx + 1}`
            });
          });
        }
        break;
      }

      case 'cast_bar':
      case 'heat':
      case 'basic':
      case 'firewall_pulse':
      case 'glitch_decode':
      default: {
        const selected = boss.words.slice(0, 3);
        const perWord = Math.round(boss.baseHp / selected.length);
        selected.forEach((w, idx) => {
          result.push({
            id: `w_${idx}`,
            text: w,
            type: 'word',
            damage: perWord,
            label: `BLOCO ${idx + 1}/${selected.length}`
          });
        });
        break;
      }
    }

    return result;
  }, []);

  // Inicializa o desafio e a batalha do Boss
  const initBattle = useCallback(() => {
    const battleItems = buildItemsForBoss(bossDef);
    setItems(battleItems);
    itemsRef.current = battleItems;

    setCurrentItemIndex(0);
    currentItemIndexRef.current = 0;
    setCharIndex(0);
    charIndexRef.current = 0;

    setTimeLeft(bossDef.timeLimitSeconds);
    setBossHp(bossDef.baseHp);
    setCastProgress(0);
    setIsBossStunned(false);
    setIsBossDamaged(false);
    setErrorCount(0);
    errorCountRef.current = 0;
    lastKeystrokeTimeRef.current = Date.now();

    if (bossDef.mechanicType === 'branching' && bossDef.branchPairs?.[0]) {
      setBranchChoice({
        fast: bossDef.branchPairs[0].fast.word,
        heavy: bossDef.branchPairs[0].heavy.word
      });
    } else {
      setBranchChoice(null);
    }

    setStatus('intro');
    statusRef.current = 'intro';

    const focusTimer = setTimeout(() => {
      focusInput();
    }, 100);

    const startTimer = setTimeout(() => {
      setStatus('playing');
      statusRef.current = 'playing';
      sound.playPrestige();
      focusInput();
    }, 2800);

    return () => {
      clearTimeout(focusTimer);
      clearTimeout(startTimer);
    };
  }, [bossDef, buildItemsForBoss, focusInput]);

  useEffect(() => {
    if (isOpen) {
      return initBattle();
    }
  }, [isOpen, initBattle]);

  // Processamento do caractere digitado
  const processChar = useCallback((typedChar: string) => {
    if (statusRef.current !== 'playing') return;

    const now = Date.now();
    if (
      lastProcessedRef.current.char === typedChar &&
      now - lastProcessedRef.current.time < 35
    ) {
      return;
    }
    lastProcessedRef.current = { char: typedChar, time: now };
    lastKeystrokeTimeRef.current = now;

    const currentItems = itemsRef.current;
    const itemIdx = currentItemIndexRef.current;
    const chIdx = charIndexRef.current;

    const activeItem = currentItems[itemIdx];
    if (!activeItem) return;

    const expectedChar = activeItem.text[chIdx];
    if (!expectedChar) return;

    const isMatch = typedChar === expectedChar;

    if (isMatch) {
      setCaseWarning(null);
      sound.playKeyStroke(chIdx + 1);

      // Dano por caractere no Boss (-1 a -2 HP)
      setBossHp((prev) => Math.max(0, prev - 1));

      // Se completou a palavra / item atual
      if (chIdx + 1 >= activeItem.text.length) {
        sound.playWordComplete();

        // Acerto Crítico e Dano Massivo do item
        const dealtDamage = activeItem.damage;
        setBossHp((prev) => Math.max(0, prev - dealtDamage));
        setIsBossDamaged(true);
        setTimeout(() => setIsBossDamaged(false), 260);

        addFloatingText(`-${dealtDamage} HP!`, 'damage');

        // Bônus de tempo conforme a mecânica do Boss
        if (bossDef.mechanicType === 'basic' || bossDef.mechanicType === 'heat') {
          setTimeLeft((prev) => Math.min(bossDef.timeLimitSeconds + 4, prev + 2));
          addFloatingText('+2s BÔNUS!', 'time');
        }

        // Se for Cast Bar, atordoa o Boss e reseta a barra de invasão
        if (bossDef.mechanicType === 'cast_bar') {
          setCastProgress(0);
          setIsBossStunned(true);
          addFloatingText('⚡ ATORDISSO!', 'stun');
          setTimeout(() => setIsBossStunned(false), 1500);
        }

        // Verifica vitória (último item concluído)
        if (itemIdx + 1 >= currentItems.length) {
          setStatus('success');
          statusRef.current = 'success';
          setBossHp(0);
          sound.playChallengeSuccess();

          // Cálculo de estrelas e recompensa
          const timeSpent = bossDef.timeLimitSeconds - timeLeft;
          const ratio = timeLeft / bossDef.timeLimitSeconds;
          let earnedStars = 1;
          if (ratio >= 0.40 && errorCountRef.current <= 2) {
            earnedStars = 3;
          } else if (ratio >= 0.18 && errorCountRef.current <= 5) {
            earnedStars = 2;
          }

          setStars(earnedStars);

          const mult = earnedStars === 3 ? 1.5 : earnedStars === 2 ? 1.25 : 1.0;
          const calculatedReward = Math.round(bossDef.baseRewardBytes * mult);
          setFinalReward(calculatedReward);

          setTimeout(() => {
            onSuccess(calculatedReward, earnedStars, timeSpent);
          }, 3200);
        } else {
          setCurrentItemIndex((prev) => prev + 1);
          currentItemIndexRef.current = itemIdx + 1;
          setCharIndex(0);
          charIndexRef.current = 0;
        }
      } else {
        setCharIndex((prev) => prev + 1);
        charIndexRef.current = chIdx + 1;
      }
    } else {
      // Erro de digitação
      const caseResult = checkCaseMismatch(typedChar, expectedChar);
      if (caseResult.isMismatch) {
        setCaseWarning(caseResult.message || null);
        addFloatingText(caseResult.message || '', 'damage');
      } else {
        setCaseWarning(null);
      }
      sound.playError();
      setErrorCount((prev) => prev + 1);
      errorCountRef.current += 1;
      setIsErrorShaking(true);
      setTimeout(() => setIsErrorShaking(false), 240);
    }
  }, [bossDef, addFloatingText, onSuccess, timeLeft]);

  // Listener global de teclado com fase de captura
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (statusRef.current !== 'playing') return;
      if (e.key === 'Escape') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (
        e.key === 'Shift' ||
        e.key === 'Control' ||
        e.key === 'Alt' ||
        e.key === 'AltGraph' ||
        e.key === 'CapsLock' ||
        e.key === 'Tab'
      ) {
        return;
      }

      if (document.activeElement !== inputRef.current) {
        focusInput();
      }

      if (e.key.length === 1 || e.key === 'Space') {
        e.preventDefault();
        const rawChar = e.key === ' ' || e.key === 'Space' ? ' ' : e.key;
        processChar(rawChar);
      }
    };

    window.addEventListener('keydown', handleWindowKeyDown, true);
    return () => window.removeEventListener('keydown', handleWindowKeyDown, true);
  }, [isOpen, focusInput, processChar]);

  // Cronômetro da partida
  useEffect(() => {
    if (status === 'playing') {
      focusInput();
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStatus('fail');
            statusRef.current = 'fail';
            sound.playChallengeFail();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, focusInput]);

  // Cronômetro da Cast Bar do Boss (para nível 90 e bosses que usam 'cast_bar')
  useEffect(() => {
    if (status !== 'playing' || bossDef.mechanicType !== 'cast_bar' || isBossStunned) return;

    const intervalMs = 100;
    const totalMs = (bossDef.castBarSeconds || 6) * 1000;
    const step = (intervalMs / totalMs) * 100;

    const castTimer = setInterval(() => {
      setCastProgress((prev) => {
        if (prev + step >= 100) {
          // Contra-ataque do Boss: consome 2s do jogador e causa glitch
          sound.playGlitch();
          setTimeLeft((t) => Math.max(1, t - 2));
          addFloatingText('⚠️ CONTRA-ATAQUE! -2s', 'damage');
          setIsErrorShaking(true);
          setTimeout(() => setIsErrorShaking(false), 300);
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => clearInterval(castTimer);
  }, [status, bossDef, isBossStunned, addFloatingText]);

  // Renderização formatada do item atual
  const renderItemText = (item: TargetItem, itemIdx: number) => {
    const isPast = itemIdx < currentItemIndex;
    const isFuture = itemIdx > currentItemIndex;

    if (isPast) {
      return (
        <span key={item.id} className="text-zinc-600 line-through select-none font-bold opacity-40">
          {item.text}
        </span>
      );
    }

    if (isFuture) {
      return (
        <span key={item.id} className="text-zinc-600 select-none opacity-60">
          {item.text}
        </span>
      );
    }

    // Item ativo
    return (
      <span key={item.id} className="relative font-black select-none tracking-wider text-white">
        <span className={theme.accentText}>{item.text.substring(0, charIndex)}</span>
        <span className="text-white bg-white/20 border-b-2 border-current px-0.5 rounded-sm animate-pulse">
          {item.text.substring(charIndex, charIndex + 1)}
        </span>
        <span className="text-zinc-500">{item.text.substring(charIndex + 1)}</span>
      </span>
    );
  };

  const hpPercent = Math.max(0, Math.min(100, Math.round((bossHp / bossDef.baseHp) * 100)));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => focusInput()}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md cursor-pointer select-none overflow-y-auto"
        >
          {/* Input invisível com foco nativo contínuo */}
          <input
            ref={inputRef}
            type="text"
            value=""
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                for (const ch of val) processChar(ch);
                e.target.value = '';
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="opacity-0 absolute -left-[9999px] top-0 w-1 h-1 pointer-events-auto"
            aria-label="Entrada do desafio de digitação"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          <div
            onClick={(e) => {
              e.stopPropagation();
              focusInput();
            }}
            className={`w-full max-w-2xl bg-[#090b10] border-2 ${theme.border} ${theme.glow} rounded-2xl flex flex-col overflow-hidden relative transition-all duration-200 cursor-default my-auto`}
          >
            {/* Grade de fundo cibernética */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)',
                backgroundSize: '100% 4px'
              }}
            />

            {/* Topbar com identificação do Boss e Botão de Pular */}
            <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-zinc-800/80 bg-zinc-950/60">
              <div className="flex items-center gap-2 font-mono font-bold text-xs">
                <Terminal className={`w-4 h-4 ${theme.accentText}`} />
                <span className="text-zinc-300">PROTOCOLO_GUARDIÃO_NV_{level}.SH</span>
              </div>
              <button
                type="button"
                onClick={onFail}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono text-zinc-400 hover:text-red-300 hover:bg-red-500/20 border border-transparent hover:border-red-500/30 transition flex items-center gap-1 cursor-pointer"
                title="Sair do desafio sem recompensa"
              >
                <X className="w-3.5 h-3.5" />
                <span>Pular Desafio</span>
              </button>
            </div>

            <div className="relative p-5 sm:p-8 flex flex-col items-center text-center">
              {/* TELA DE INTRODUÇÃO */}
              {status === 'intro' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4 py-4 w-full max-w-lg"
                >
                  <div className={`p-4 rounded-3xl bg-zinc-900/80 border-2 ${theme.border} ${theme.glow} text-5xl sm:text-6xl`}>
                    <span className={reducedAlerts ? '' : 'animate-bounce inline-block'}>{bossDef.avatar}</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                      {bossDef.title}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider">
                      {bossDef.name}
                    </h2>
                  </div>

                  <p className="text-zinc-400 text-xs sm:text-sm font-mono leading-relaxed bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60 text-center">
                    {bossDef.lore}
                  </p>

                  {/* Badge de Mecânica Única */}
                  <div className="flex items-center gap-2 text-xs font-mono bg-zinc-900/90 border border-zinc-700/60 px-3 py-1.5 rounded-lg text-zinc-300">
                    <span className="font-bold text-amber-300">{bossDef.mechanicBadge}</span>
                    <span>— {bossDef.mechanicDescription}</span>
                  </div>

                  <div className="mt-4 flex flex-col items-center gap-1">
                    <div className={`text-3xl sm:text-4xl font-mono font-black ${theme.accentText}`}>
                      PREPARE O TECLADO
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">Iniciando combate em instantes...</span>
                  </div>
                </motion.div>
              )}

              {/* TELA DE JOGO / BATALHA ATIVA */}
              {status === 'playing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center w-full gap-5"
                >
                  {/* CABEÇALHO DO CHEFE COM BARRA DE HP */}
                  <div className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl p-3 sm:p-4 flex flex-col gap-2 relative">
                    {/* Linha superior: Avatar, Nome e Cronômetro */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`text-3xl sm:text-4xl transition-transform duration-100 ${
                          isBossDamaged ? 'scale-125 rotate-6' : ''
                        }`}>
                          {bossDef.avatar}
                        </span>
                        <div className="flex flex-col text-left min-w-0">
                          <span className="text-xs sm:text-sm font-mono font-black text-white truncate">
                            {bossDef.name}
                          </span>
                          <span className="text-[10px] sm:text-xs font-mono text-zinc-400 truncate">
                            {bossDef.title}
                          </span>
                        </div>
                      </div>

                      {/* Cronômetro */}
                      <div className={`text-2xl sm:text-3xl font-black font-mono flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 border ${
                        timeLeft <= 5 ? 'text-red-500 border-red-500/50 animate-pulse' : 'text-emerald-400 border-emerald-500/30'
                      }`}>
                        <span>00:{timeLeft.toString().padStart(2, '0')}</span>
                      </div>
                    </div>

                    {/* Barra de Vida (HP) com Gradiente e Percentual */}
                    <div className="w-full flex flex-col gap-1">
                      <div className="flex justify-between text-[11px] font-mono font-bold">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Shield className="w-3 h-3 text-red-400" />
                          <span>INTEGRIDADE DO SISTEMA</span>
                        </span>
                        <span className="text-white">{bossHp} / {bossDef.baseHp} HP ({hpPercent}%)</span>
                      </div>
                      <div className="w-full h-3 bg-black/80 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                        <div
                          className={`h-full bg-gradient-to-r ${theme.hpBar} rounded-full transition-all duration-200`}
                          style={{ width: `${hpPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Cast Bar (quando o Boss possui ataque carregado, ex: Nível 90) */}
                    {bossDef.mechanicType === 'cast_bar' && (
                      <div className="w-full flex flex-col gap-0.5 mt-1 pt-1 border-t border-zinc-800/60">
                        <div className="flex justify-between text-[10px] font-mono text-amber-300">
                          <span>⚡ INVASÃO DA I.A. EM CARGA:</span>
                          <span>{isBossStunned ? 'ATORDOADO!' : `${Math.round(castProgress)}%`}</span>
                        </div>
                        <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-amber-500/30">
                          <div
                            className={`h-full ${isBossStunned ? 'bg-sky-400 animate-pulse' : 'bg-gradient-to-r from-amber-500 to-red-500'} transition-all duration-100`}
                            style={{ width: `${isBossStunned ? 100 : castProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Textos de dano flutuante */}
                    <div className="absolute top-2 right-1/2 translate-x-1/2 pointer-events-none flex flex-col items-center gap-1 z-20">
                      {floatingTexts.map((f) => (
                        <motion.span
                          key={f.id}
                          initial={{ opacity: 1, y: 0, scale: 1 }}
                          animate={{ opacity: 0, y: -25, scale: 1.15 }}
                          transition={{ duration: 0.9 }}
                          className={`text-sm sm:text-base font-black font-mono drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] ${
                            f.type === 'damage' ? 'text-rose-400' : f.type === 'time' ? 'text-emerald-300' : 'text-amber-300'
                          }`}
                        >
                          {f.text}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* INDICADOR DE FASE / ITEM ATUAL */}
                  <div className="w-full flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
                    <span className="font-bold text-zinc-300 flex items-center gap-1">
                      <span>Alvo:</span>
                      <span className={`${theme.accentText} bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800`}>
                        {items[currentItemIndex]?.label || `Fase ${currentItemIndex + 1}/${items.length}`}
                      </span>
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {currentItemIndex + 1} de {items.length} etapas concluídas
                    </span>
                  </div>

                  {/* Alertas de Teclado: Caps Lock e Case Mismatch */}
                  <CapsLockWarning className="w-full mb-1" />

                  {caseWarning && (
                    <div className="w-full max-w-lg py-1.5 px-3 rounded-xl bg-amber-500/25 border border-amber-400 text-amber-200 font-mono text-xs font-bold animate-pulse text-center shadow-lg shadow-amber-950/40">
                      {caseWarning}
                    </div>
                  )}

                  {/* ÁREA DE DIGITAÇÃO DE PALAVRAS / COMANDOS */}
                  <div
                    className={`w-full min-h-[90px] sm:min-h-[110px] bg-black/60 border ${
                      isErrorShaking ? 'border-red-500 animate-shake' : 'border-zinc-800'
                    } rounded-xl p-4 sm:p-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-2xl sm:text-4xl font-mono font-black tracking-widest leading-relaxed transition-all`}
                  >
                    {items.map((it, idx) => renderItemText(it, idx))}
                  </div>

                  {/* BARRA DE FOCO DO TECLADO */}
                  <div
                    onClick={focusInput}
                    className={`w-full max-w-md py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-mono transition-all cursor-pointer ${
                      isFocused
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-500/20 border-amber-500/50 text-amber-200 animate-pulse ring-2 ring-amber-500/30'
                    }`}
                  >
                    <Keyboard className="w-4 h-4 flex-shrink-0" />
                    {isFocused ? (
                      <span className="font-bold">TECLADO ATIVO • DIGITE A LETRA DESTACADA</span>
                    ) : (
                      <span className="font-bold underline">⚠️ CLIQUE AQUI PARA ATIVAR O TECLADO</span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TELA DE VITÓRIA (COM ESTRELAS E BUFF TEMPORÁRIO) */}
              {status === 'success' && (
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4 py-6 w-full max-w-md"
                >
                  <div className="relative">
                    <div className="p-4 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/50 text-6xl shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                      <span>🏆</span>
                    </div>
                    <Sparkles className="w-6 h-6 text-amber-300 absolute -top-1 -right-1 animate-spin" />
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider">
                      GUARDIÃO SUPERADO!
                    </h2>
                    <p className="text-zinc-300 font-mono text-xs">
                      {bossDef.name} foi domado e o sistema foi restaurado.
                    </p>
                  </div>

                  {/* Estrelas de Avaliação */}
                  <div className="flex items-center gap-2 my-1">
                    {[1, 2, 3].map((starNum) => (
                      <motion.div
                        key={starNum}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 * starNum }}
                      >
                        <Star
                          className={`w-8 h-8 ${
                            starNum <= stars
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                              : 'text-zinc-700'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Recompensa em Bytes */}
                  <div className="text-emerald-300 font-mono font-bold text-lg sm:text-xl flex items-center gap-2 bg-emerald-500/20 px-6 py-2.5 rounded-xl border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span>+{formatBytes(finalReward)} BYTES CONQUISTADOS</span>
                  </div>

                  {/* Notificação de Bênção do Guardião (Buff de multiplicador ativo) */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono text-center">
                    <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>
                      <strong>Bênção do Guardião Ativa:</strong> +{stars === 3 ? '0.30x' : stars === 2 ? '0.15x' : '0.05x'} no multiplicador por 15 minutos!
                    </span>
                  </div>

                  <span className="text-xs text-zinc-500 font-mono mt-1">Retornando ao jogo com os bônus aplicados...</span>
                </motion.div>
              )}

              {/* TELA DE DERROTA COM RETENTATIVA IMEDIATA */}
              {status === 'fail' && (
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4 py-6 w-full max-w-md"
                >
                  <div className="p-4 rounded-3xl bg-red-500/10 border-2 border-red-500/40 text-5xl">
                    <span>{bossDef.avatar}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-red-500 font-mono tracking-wider">
                    TEMPO ESGOTADO!
                  </h2>

                  <p className="text-zinc-400 font-mono text-xs sm:text-sm text-center leading-relaxed">
                    O {bossDef.name} manteve suas defesas ativas. Não desanime! Você pode tentar novamente agora mesmo sem perder nada.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full mt-2">
                    <button
                      type="button"
                      onClick={initBattle}
                      className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-mono font-black text-xs sm:text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer transition transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>TENTAR NOVAMENTE</span>
                    </button>

                    <button
                      type="button"
                      onClick={onFail}
                      className="w-full sm:flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono font-bold text-xs sm:text-sm rounded-xl border border-zinc-700 cursor-pointer transition"
                    >
                      VOLTAR AO JOGO
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
