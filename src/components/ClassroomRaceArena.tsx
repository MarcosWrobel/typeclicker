import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Timer,
  Zap,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { formatBytes } from '../utils/formatting';
import { ClassroomRace } from '../types/race';
import { claimRaceFinish } from '../services/raceService';
import { combineAccent, isAccentKey, resolveDeadKey, getAccentDisplayName } from '../utils/keyboardAccents';
import { CapsLockWarning } from './common/CapsLockWarning';
import { checkCaseMismatch } from '../utils/keyboardCase';

interface ClassroomRaceArenaProps {
  isOpen: boolean;
  race: ClassroomRace;
  studentName: string;
  studentNickname?: string;
  studentAvatar?: string;
  studentClass: string;
  userId: string;
  isAdmin?: boolean;
  onClose: () => void;
  onClaimWin: (prizeBytes: number, stats: { wpm: number; timeMs: number }) => void;
  onFinishNonWinner?: (stats: { wpm: number; timeMs: number }) => void;
  onOpenRaceLeaderboard: () => void;
}

export const ClassroomRaceArena: React.FC<ClassroomRaceArenaProps> = ({
  isOpen,
  race,
  studentName,
  studentNickname,
  studentAvatar = '🏎️',
  studentClass,
  userId,
  isAdmin = false,
  onClose,
  onClaimWin,
  onFinishNonWinner,
  onOpenRaceLeaderboard
}) => {
  const [countdown, setCountdown] = useState<number>(5);
  const [isRaceStarted, setIsRaceStarted] = useState<boolean>(false);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [pendingAccent, setPendingAccent] = useState<string | null>(null);
  const [wrongKeyStrike, setWrongKeyStrike] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [finishedPosition, setFinishedPosition] = useState<number | null>(null);
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [prizeClaimed, setPrizeClaimed] = useState<boolean>(false);
  const [caseWarning, setCaseWarning] = useState<string | null>(null);

  // Telemetria
  const [startTimeMs, setStartTimeMs] = useState<number>(0);
  const [elapsedTimeMs, setElapsedTimeMs] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [correctKeyCount, setCorrectKeyCount] = useState<number>(0);

  // Refs para controle ininterrupto e prevenção de descarte de teclas rápidas
  const charIndexRef = useRef<number>(0);
  const isRaceStartedRef = useRef<boolean>(false);
  const isFinishedRef = useRef<boolean>(false);
  const pendingAccentRef = useRef<string | null>(null);
  const startTimeMsRef = useRef<number>(0);
  const hasStartedRef = useRef<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const currentSpanRef = useRef<HTMLSpanElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reseta estados quando abre uma nova corrida
  useEffect(() => {
    if (isOpen) {
      charIndexRef.current = 0;
      setCharIndex(0);
      isFinishedRef.current = false;
      setIsFinished(false);
      setFinishedPosition(null);
      setIsWinner(false);
      setPrizeClaimed(false);
      setTotalErrors(0);
      setCorrectKeyCount(0);
      setElapsedTimeMs(0);
      pendingAccentRef.current = null;
      setPendingAccent(null);
      hasStartedRef.current = false;

      const now = Date.now();
      const diffMs = race.startsAtMs - now;
      if (diffMs <= 0) {
        hasStartedRef.current = true;
        isRaceStartedRef.current = true;
        setIsRaceStarted(true);
        startTimeMsRef.current = now;
        setStartTimeMs(now);
        setCountdown(0);
      } else {
        isRaceStartedRef.current = false;
        setIsRaceStarted(false);
        setCountdown(Math.ceil(diffMs / 1000));
      }
    }
  }, [isOpen, race.id, race.startsAtMs]);

  // Contagem regressiva sincronizada
  useEffect(() => {
    if (!isOpen) return;

    const checkCountdown = () => {
      const now = Date.now();
      const diffMs = race.startsAtMs - now;
      const secondsLeft = Math.max(0, Math.ceil(diffMs / 1000));
      setCountdown(secondsLeft);

      if (diffMs <= 0) {
        if (!hasStartedRef.current) {
          hasStartedRef.current = true;
          isRaceStartedRef.current = true;
          setIsRaceStarted(true);
          const startNow = Date.now();
          startTimeMsRef.current = startNow;
          setStartTimeMs(startNow);
          sound.playPrestige();
        }
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
      }
    };

    checkCountdown();
    countdownIntervalRef.current = setInterval(checkCountdown, 100);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [isOpen, race.startsAtMs]);

  // Cronômetro decorrido
  useEffect(() => {
    if (isRaceStarted && !isFinished) {
      timerIntervalRef.current = setInterval(() => {
        const start = startTimeMsRef.current || Date.now();
        setElapsedTimeMs(Date.now() - start);
      }, 100);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isRaceStarted, isFinished]);

  // Manutenção contínua de foco
  useEffect(() => {
    if (!isOpen) return;

    const focusInput = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    };

    focusInput();
    const interval = setInterval(focusInput, 400);
    return () => clearInterval(interval);
  }, [isOpen, isRaceStarted, isFinished]);

  // Tecla Escape para fechar
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    };

    window.addEventListener('keydown', handleWindowKeyDown);
    return () => window.removeEventListener('keydown', handleWindowKeyDown);
  }, [isOpen, onClose]);

  // Scroll suave instantâneo do cursor
  useEffect(() => {
    if (currentSpanRef.current && textContainerRef.current) {
      currentSpanRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [charIndex]);

  // Telemetria: PPM e Precisão
  const currentWpm = useMemo(() => {
    const minutes = Math.max(0.01, elapsedTimeMs / 60000);
    const words = charIndex / 5;
    return Math.round(words / minutes);
  }, [charIndex, elapsedTimeMs]);

  const currentAccuracy = useMemo(() => {
    const total = correctKeyCount + totalErrors;
    if (total === 0) return 100;
    return Math.max(0, Math.min(100, Math.round((correctKeyCount / total) * 100)));
  }, [correctKeyCount, totalErrors]);

  const progressPercent = useMemo(() => {
    if (!race.text.length) return 0;
    return Math.min(100, Math.round((charIndex / race.text.length) * 100));
  }, [charIndex, race.text.length]);

  // Finalização da corrida
  const handleRaceCompleted = useCallback(async () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsFinished(true);

    const finalTimeMs = Date.now() - (startTimeMsRef.current || Date.now());
    const finalMinutes = Math.max(0.01, finalTimeMs / 60000);
    const finalWpm = Math.round((race.text.length / 5) / finalMinutes);
    const total = correctKeyCount + totalErrors + 1;
    const finalAccuracy = Math.max(0, Math.min(100, Math.round(((correctKeyCount + 1) / total) * 100)));

    const studentData = {
      uid: userId,
      nome: studentName,
      apelido: studentNickname || studentName,
      avatar: studentAvatar,
      turma: studentClass
    };

    const statsData = {
      wpm: finalWpm,
      accuracy: finalAccuracy,
      timeMs: finalTimeMs
    };

    try {
      const result = await claimRaceFinish(race.id, studentData, statsData);
      setFinishedPosition(result.position);
      setIsWinner(result.isWinner);

      if (result.isWinner && !prizeClaimed) {
        setPrizeClaimed(true);
        confetti({
          particleCount: 160,
          spread: 80,
          origin: { y: 0.6 }
        });
        sound.playPrestige();
        onClaimWin(race.prizeBytes, { wpm: finalWpm, timeMs: finalTimeMs });
      } else {
        sound.playWordComplete();
        onFinishNonWinner?.({ wpm: finalWpm, timeMs: finalTimeMs });
      }
    } catch (e) {
      console.error('Erro ao registrar conclusão da corrida:', e);
    }
  }, [
    race,
    correctKeyCount,
    totalErrors,
    userId,
    studentName,
    studentNickname,
    studentAvatar,
    studentClass,
    prizeClaimed,
    onClaimWin,
    onFinishNonWinner
  ]);

  // Processa caractere digitado
  const processChar = useCallback(
    (char: string) => {
      if (!isRaceStartedRef.current || isFinishedRef.current) return;

      const currentIdx = charIndexRef.current;
      const targetChar = race.text[currentIdx];

      if (char === targetChar) {
        setCaseWarning(null);
        sound.playType();
        setCorrectKeyCount((c) => c + 1);
        const nextIdx = currentIdx + 1;
        charIndexRef.current = nextIdx;
        setCharIndex(nextIdx);

        if (nextIdx >= race.text.length) {
          handleRaceCompleted();
        }
      } else {
        const caseResult = checkCaseMismatch(char, targetChar);
        if (caseResult.isMismatch) {
          setCaseWarning(caseResult.message || null);
        } else {
          setCaseWarning(null);
        }
        setTotalErrors((e) => e + 1);
        setWrongKeyStrike(true);
        sound.playError();
        setTimeout(() => setWrongKeyStrike(false), 200);
      }
    },
    [race.text, handleRaceCompleted]
  );

  // Entrada via onChange (composição de acentos ABNT2 / IME do Linux e Chromebooks)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;

    for (const ch of val) {
      if (isAccentKey(ch)) {
        setPendingAccent(ch);
        pendingAccentRef.current = ch;
      } else {
        let finalChar = ch;
        if (pendingAccentRef.current) {
          finalChar = combineAccent(pendingAccentRef.current, ch);
          setPendingAccent(null);
          pendingAccentRef.current = null;
        }
        processChar(finalChar);
      }
    }
    e.target.value = '';
  };

  // Entrada via onKeyDown (teclas diretas, teclas mortas e acentos sequenciais)
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isRaceStartedRef.current || isFinishedRef.current) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      return;
    }

    if (e.key === 'Dead' || isAccentKey(e.key)) {
      e.preventDefault();
      const targetChar = race.text[charIndexRef.current];
      const resolved = resolveDeadKey(e.nativeEvent, targetChar);
      if (resolved) {
        setPendingAccent(resolved);
        pendingAccentRef.current = resolved;
      }
      return;
    }

    if (e.key === 'Backspace') {
      if (pendingAccentRef.current) {
        e.preventDefault();
        setPendingAccent(null);
        pendingAccentRef.current = null;
      }
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      let finalChar = e.key;

      if (pendingAccentRef.current) {
        finalChar = combineAccent(pendingAccentRef.current, e.key);
        setPendingAccent(null);
        pendingAccentRef.current = null;
      }

      processChar(finalChar);
    }
  };

  if (!isOpen) return null;

  const secondsDisplay = (elapsedTimeMs / 1000).toFixed(1);

  return (
    <div
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none font-sans"
    >
      {/* Input invisível com suporte nativo a IME e Dead Keys do laboratório */}
      <input
        ref={inputRef}
        id="classroom-race-input"
        type="text"
        value=""
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className="opacity-0 absolute -left-[9999px] top-0 w-1 h-1 pointer-events-auto"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        aria-label="Área de digitação da corrida"
      />

      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#121722] via-[#0d111a] to-[#080b12] border-2 border-amber-500/50 rounded-3xl shadow-[0_0_80px_rgba(245,158,11,0.25)] flex flex-col overflow-hidden max-h-[92vh]">
        {/* Top Header da Corrida */}
        <div className="px-6 py-4 bg-black/60 border-b border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-2xl shadow-inner text-amber-400">
              🏁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 uppercase tracking-wider font-mono">
                  CORRIDA ESCOLAR EM TEMPO REAL
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  Turma: <strong className="text-zinc-200">{race.targetTurma === 'todas' ? 'Geral (Todas as Turmas)' : race.targetTurma}</strong>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">
                {race.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Prêmio em Bytes */}
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center gap-2 text-amber-300 font-mono text-xs sm:text-sm font-bold shadow-sm">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>+{formatBytes(race.prizeBytes)} B</span>
            </div>

            {/* Botão Ranking de Corridas */}
            <button
              type="button"
              onClick={onOpenRaceLeaderboard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold transition cursor-pointer shadow-sm"
              title="Ver Ranking de Corridas da Sala"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ranking</span>
            </button>

            {/* Botão de Fechar */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
              title="Sair da Corrida"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Banner de Aviso de Vencedor em Tempo Real (Caso outro aluno vença antes) */}
        {race.winner && race.winner.userId !== userId && !isFinished && (
          <div className="px-6 py-2.5 bg-gradient-to-r from-amber-950/80 via-purple-950/80 to-amber-950/80 border-b border-amber-500/40 flex items-center justify-between text-xs font-mono animate-pulse">
            <span className="flex items-center gap-2 text-amber-300 font-bold">
              <span>🏆</span>
              <span>
                <strong>{race.winner.apelido}</strong> ({race.winner.turma}) cruzou a linha de chegada em 1º lugar! ({race.winner.wpm} PPM)
              </span>
            </span>
            <span className="text-zinc-300 hidden sm:inline">
              Continue digitando para concluir e registrar seu tempo! 🚀
            </span>
          </div>
        )}

        {/* Telemetria e Barra de Progresso */}
        <div className="px-6 py-3 bg-[#0a0d14] border-b border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Timer className="w-4 h-4 text-cyan-400" />
              <span>Tempo: <strong className="text-white text-sm">{secondsDisplay}s</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Velocidade: <strong className="text-white text-sm">{currentWpm} PPM</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Precisão: <strong className="text-white text-sm">{currentAccuracy}%</strong></span>
            </div>
          </div>

          {/* Barra de Progresso do Aluno */}
          <div className="flex items-center gap-3 w-full sm:w-64">
            <span className="text-zinc-400 font-bold">{progressPercent}%</span>
            <div className="flex-1 h-2.5 rounded-full bg-zinc-900 border border-zinc-700/60 overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-150"
              />
            </div>
            <span>{studentAvatar}</span>
          </div>
        </div>

        {/* ÁREA CENTRAL: Contagem Regressiva OU Caixa de Texto */}
        <div className="relative flex-1 p-6 sm:p-10 flex flex-col justify-center min-h-[280px]">
          {/* FASE 1: CONTAGEM REGRESSIVA SINCRONIZADA */}
          <AnimatePresence>
            {!isRaceStarted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center p-6 text-center select-none"
              >
                <span className="text-amber-400 text-xs sm:text-sm font-black tracking-widest uppercase font-mono mb-3 animate-pulse">
                  ⚡ O PROFESSOR DISPAROU A CORRIDA DA TURMA!
                </span>

                <motion.div
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-amber-500/20 border-4 border-amber-400 flex items-center justify-center text-6xl sm:text-7xl font-black text-amber-300 shadow-[0_0_80px_rgba(245,158,11,0.6)] font-mono mb-4"
                >
                  {countdown > 0 ? countdown : '🚀'}
                </motion.div>

                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
                  {countdown > 0 ? 'Prepare as mãos no teclado!' : 'ACELERAR! 🏁'}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md font-mono">
                  Todos os alunos estão prontos para digitar o mesmo texto. O primeiro a completar 100% vence a corrida!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Alertas de Teclado: Caps Lock e Case Mismatch */}
          <CapsLockWarning className="mb-2" />

          {caseWarning && (
            <div className="mb-3 py-1.5 px-3 rounded-xl bg-amber-500/25 border border-amber-400 text-amber-200 font-mono text-xs font-bold animate-pulse text-center shadow-lg shadow-amber-950/40">
              {caseWarning}
            </div>
          )}

          {/* FASE 2 & 3: TEXTO DA CORRIDA & DIGITAÇÃO */}
          <div
            ref={textContainerRef}
            className={`font-mono text-lg sm:text-xl md:text-2xl leading-relaxed tracking-wide select-none overflow-y-auto max-h-[380px] p-4 rounded-2xl bg-black/40 border border-zinc-800 custom-scrollbar ${
              wrongKeyStrike ? 'animate-shake' : ''
            }`}
          >
            {pendingAccent && (
              <div className="inline-block px-3 py-1 mb-3 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/50 text-xs font-bold font-mono animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                ⌨️ {getAccentDisplayName(pendingAccent)} (digite a vogal correspondente)
              </div>
            )}

            <div className="break-words whitespace-pre-wrap">
              {race.text.split('').map((char, idx) => {
                const isDone = idx < charIndex;
                const isCurrent = idx === charIndex;

                if (isDone) {
                  return (
                    <span key={idx} className="text-emerald-400 font-semibold">
                      {char}
                    </span>
                  );
                }

                if (isCurrent) {
                  return (
                    <span
                      key={idx}
                      ref={currentSpanRef}
                      className="relative bg-amber-400/30 text-white underline decoration-amber-400 decoration-4 shadow-[0_0_15px_rgba(245,158,11,0.9)] px-0.5 rounded font-black"
                    >
                      {char}
                    </span>
                  );
                }

                return (
                  <span key={idx} className="text-zinc-600">
                    {char}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* FASE 3: MODAL / TELA DE CONCLUSÃO E PÓDIO */}
        <AnimatePresence>
          {isFinished && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-6 bg-gradient-to-t from-black via-[#0c1018] to-black border-t-2 border-amber-500/40 flex flex-col items-center text-center"
            >
              {isWinner ? (
                <div className="space-y-3 max-w-lg">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl mx-auto shadow-[0_0_40px_rgba(245,158,11,0.8)] animate-bounce">
                    🏆
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-amber-300 uppercase tracking-wide">
                    VOCÊ FOI O VENCEDOR DA CORRIDA!
                  </h3>
                  <p className="text-sm text-zinc-300 font-mono">
                    Parabéns, <strong className="text-white">{studentNickname || studentName}</strong>! Você terminou em 1º lugar com velocidade impressionante de <strong className="text-amber-400">{currentWpm} PPM</strong> e tempo de <strong className="text-cyan-400">{secondsDisplay}s</strong>!
                  </p>

                  <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/40 font-mono text-amber-200 text-sm font-bold flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>+{formatBytes(race.prizeBytes)} Bytes Adicionados ao seu saldo!</span>
                    <span>(+1 Vitória no Ranking Geral)</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-w-lg">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
                    {finishedPosition === 2 ? '🥈' : finishedPosition === 3 ? '🥉' : '🏁'}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
                    {finishedPosition === 2
                      ? '🥈 2º LUGAR NA CORRIDA!'
                      : finishedPosition === 3
                      ? '🥉 3º LUGAR NA CORRIDA!'
                      : `🏁 ${finishedPosition || 'Concluído'}º LUGAR NA CORRIDA!`}
                  </h3>
                  <p className="text-sm text-zinc-400 font-mono">
                    Excelente desempenho! Você completou o texto com <strong className="text-white">{currentWpm} PPM</strong> e precisão de <strong className="text-white">{currentAccuracy}%</strong> em <strong className="text-cyan-400">{secondsDisplay}s</strong>.
                  </p>
                </div>
              )}

              {/* Botões de Ação Final */}
              <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
                <button
                  onClick={() => {
                    onClose();
                    onOpenRaceLeaderboard();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm transition flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/30"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Ver Ranking Geral de Corridas</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm transition cursor-pointer"
                >
                  Voltar ao Terminal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
