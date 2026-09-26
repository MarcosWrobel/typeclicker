import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap, Trophy, Flame, Play, RotateCcw, X, Target, Award, Sparkles, CheckCircle2, ChevronRight, Gauge } from 'lucide-react';
import { sound } from '../utils/audio';
import { CurricularTrackId, TypingMode } from '../types';
import { getTextForMode } from '../data/words';
import { isAccentKey, resolveDeadKey, combineAccent, getAccentDisplayName } from '../utils/keyboardAccents';
import { CapsLockWarning } from './common/CapsLockWarning';
import { checkCaseMismatch } from '../utils/keyboardCase';

interface TimeAttackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessReward?: (bytes: number, duelTokens: number, wpm: number) => void;
  activeTrack?: CurricularTrackId;
  playerLevel?: number;
}

type Phase = 'select' | 'countdown' | 'playing' | 'result';

export const TimeAttackModal: React.FC<TimeAttackModalProps> = ({
  isOpen,
  onClose,
  onSuccessReward,
  activeTrack = 'geral',
  playerLevel = 1
}) => {
  const [phase, setPhase] = useState<Phase>('select');
  const [duration, setDuration] = useState<30 | 60>(30);
  const [mode, setMode] = useState<TypingMode>('words');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);

  // Fila de palavras/textos da rodada
  const [currentText, setCurrentText] = useState<string>('');
  const [charIndex, setCharIndex] = useState<number>(0);
  const [pendingAccent, setPendingAccent] = useState<string | null>(null);
  const [caseWarning, setCaseWarning] = useState<string | null>(null);

  // Telemetria
  const [keystrokesTotal, setKeystrokesTotal] = useState<number>(0);
  const [keystrokesCorrect, setKeystrokesCorrect] = useState<number>(0);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [completedItemsCount, setCompletedItemsCount] = useState<number>(0);
  const [isErrorShaking, setIsErrorShaking] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const phaseRef = useRef<Phase>(phase);
  const currentTextRef = useRef<string>(currentText);
  const charIndexRef = useRef<number>(charIndex);
  const pendingAccentRef = useRef<string | null>(pendingAccent);
  const streakRef = useRef<number>(streak);

  phaseRef.current = phase;
  currentTextRef.current = currentText;
  charIndexRef.current = charIndex;
  pendingAccentRef.current = pendingAccent;
  streakRef.current = streak;

  // Foco no input nativo
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, []);

  // Reiniciar estado do jogo
  const startCountdown = () => {
    setPhase('countdown');
    setCountdown(3);
  };

  // Contagem 3, 2, 1
  useEffect(() => {
    if (!isOpen) return;
    if (phase !== 'countdown') return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        sound.playKeyStroke(countdown);
        setCountdown(c => c - 1);
      }, 900);
      return () => clearTimeout(timer);
    } else {
      // Inicia a partida jogável
      sound.playUpgrade();
      setTimeLeft(duration);
      setKeystrokesTotal(0);
      setKeystrokesCorrect(0);
      setErrorsCount(0);
      setStreak(0);
      setMaxStreak(0);
      setCompletedItemsCount(0);
      setCharIndex(0);
      setPendingAccent(null);

      const firstText = getTextForMode(mode, 'facil', undefined, activeTrack);
      setCurrentText(firstText);
      setPhase('playing');
      setTimeout(focusInput, 50);
    }
  }, [phase, countdown, duration, mode, activeTrack, isOpen, focusInput]);

  // Cronômetro da partida
  useEffect(() => {
    if (phase !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('result');
          sound.playChallengeSuccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Cálculos de métricas ao vivo
  const elapsedSeconds = Math.max(1, duration - timeLeft);
  const liveWpm = Math.round((keystrokesCorrect / 5) / (elapsedSeconds / 60));
  const liveAccuracy = keystrokesTotal > 0
    ? Math.round((keystrokesCorrect / keystrokesTotal) * 100)
    : 100;

  // Processamento do caractere digitado
  const handleType = useCallback((rawChar: string) => {
    if (phaseRef.current !== 'playing') return;

    let finalChar = rawChar;
    const currentPending = pendingAccentRef.current;
    if (currentPending) {
      finalChar = combineAccent(currentPending, rawChar);
      setPendingAccent(null);
      pendingAccentRef.current = null;
    }

    const text = currentTextRef.current;
    const index = charIndexRef.current;
    const rawExpectedChar = text[index] || '';

    if (!rawExpectedChar) return;

    setKeystrokesTotal(t => t + 1);

    const isMatch = finalChar === rawExpectedChar;

    if (isMatch) {
      setCaseWarning(null);
      // Acerto
      const nextCorrect = keystrokesCorrect + 1;
      setKeystrokesCorrect(nextCorrect);
      const nextStreak = streakRef.current + 1;
      setStreak(nextStreak);
      setMaxStreak(ms => Math.max(ms, nextStreak));
      sound.playKeyStroke(nextStreak);

      const isFinished = index + 1 >= text.length;
      if (isFinished) {
        sound.playWordComplete();
        setCompletedItemsCount(c => c + 1);
        const nextText = getTextForMode(mode, 'medio', text, activeTrack);
        setCurrentText(nextText);
        setCharIndex(0);
      } else {
        setCharIndex(index + 1);
      }
    } else {
      // Erro
      const caseResult = checkCaseMismatch(finalChar, rawExpectedChar);
      if (caseResult.isMismatch) {
        setCaseWarning(caseResult.message || null);
      } else {
        setCaseWarning(null);
      }
      sound.playError();
      setErrorsCount(e => e + 1);
      setStreak(0);
      setIsErrorShaking(true);
      setTimeout(() => setIsErrorShaking(false), 300);
    }
  }, [keystrokesCorrect, mode, activeTrack]);

  // Concessão de recompensas ao concluir
  const hasRewardedRef = useRef<boolean>(false);
  useEffect(() => {
    if (phase === 'result' && !hasRewardedRef.current) {
      hasRewardedRef.current = true;
      const wpm = liveWpm;
      // Cálculo de medalha e moedas de duelo
      let duelTokens = 0;
      if (wpm >= 70) duelTokens = 3;
      else if (wpm >= 50) duelTokens = 2;
      else if (wpm >= 30) duelTokens = 1;

      // Bytes de recompensa escalonados com WPM e acurácia
      const baseReward = Math.round(wpm * 35 * Math.max(1, Math.floor(playerLevel / 5)));
      const accMultiplier = liveAccuracy >= 95 ? 1.5 : liveAccuracy >= 85 ? 1.2 : 1.0;
      const bytesReward = Math.round(baseReward * accMultiplier * (duration === 60 ? 1.8 : 1.0));

      if (onSuccessReward) {
        onSuccessReward(bytesReward, duelTokens, wpm);
      }
    } else if (phase !== 'result') {
      hasRewardedRef.current = false;
    }
  }, [phase, liveWpm, liveAccuracy, playerLevel, duration, onSuccessReward]);

  if (!isOpen) return null;

  // Determinar classificação de medalha
  const getMedalInfo = (wpm: number) => {
    if (wpm >= 70) return { title: 'MÍTICO COSMIC', medal: '💎', color: 'text-cyan-400', border: 'border-cyan-500/60', tokens: 3 };
    if (wpm >= 50) return { title: 'OURO LENDÁRIO', medal: '🥇', color: 'text-amber-400', border: 'border-amber-500/60', tokens: 2 };
    if (wpm >= 30) return { title: 'PRATA VELOZ', medal: '🥈', color: 'text-zinc-300', border: 'border-zinc-400/60', tokens: 1 };
    return { title: 'BRONZE APRENDIZ', medal: '🥉', color: 'text-amber-600', border: 'border-amber-700/60', tokens: 0 };
  };

  const medalInfo = getMedalInfo(liveWpm);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e121a] border border-[#202838] rounded-2xl shadow-2xl overflow-hidden text-zinc-200 flex flex-col">
        {/* Input invisível com foco permanente */}
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 -z-10 pointer-events-none w-0 h-0"
          value=""
          onChange={(e) => {
            const val = e.target.value;
            if (!val) return;
            for (const ch of val) {
              if (isAccentKey(ch)) {
                setPendingAccent(ch);
                pendingAccentRef.current = ch;
              } else {
                handleType(ch);
              }
            }
            e.target.value = '';
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              if (pendingAccent) {
                setPendingAccent(null);
                pendingAccentRef.current = null;
                e.preventDefault();
              }
              return;
            }
            if (e.key === 'Dead' || isAccentKey(e.key)) {
              e.preventDefault();
              const resolved = resolveDeadKey(e.nativeEvent, currentText[charIndex]);
              if (resolved) {
                setPendingAccent(resolved);
                pendingAccentRef.current = resolved;
              }
              return;
            }
          }}
          autoFocus
        />

        {/* Header da Janela */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#202838] bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-[#0e121a]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <span>TIME ATTACK / SPRINT</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ARCADE
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Desafio rápido de velocidade e precisão pura</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo por Fase */}
        <div className="p-6" onClick={focusInput}>
          {/* FASE 1: SELEÇÃO */}
          {phase === 'select' && (
            <div className="flex flex-col gap-6">
              <div>
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  1. Duração do Desafio
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDuration(30)}
                    className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border text-sm font-bold transition font-mono ${
                      duration === 30
                        ? 'bg-amber-500/20 border-amber-500/80 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                    }`}
                  >
                    <Timer className="w-5 h-5 text-amber-400" />
                    <span>30 Segundos (Sprint Rápido)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuration(60)}
                    className={`flex items-center justify-center gap-2.5 p-4 rounded-xl border text-sm font-bold transition font-mono ${
                      duration === 60
                        ? 'bg-purple-500/20 border-purple-500/80 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                    }`}
                  >
                    <Flame className="w-5 h-5 text-purple-400" />
                    <span>60 Segundos (Oficial WPM)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  2. Tipo de Texto
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('words')}
                    className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      mode === 'words'
                        ? 'bg-emerald-500/20 border-emerald-500/80 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">🔤</span>
                    <span className="font-bold text-xs">Palavras</span>
                    <span className="text-[10px] text-zinc-500">Ritmo dinâmico</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('sentences')}
                    className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      mode === 'sentences'
                        ? 'bg-sky-500/20 border-sky-500/80 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">💬</span>
                    <span className="font-bold text-xs">Frases</span>
                    <span className="text-[10px] text-zinc-500">Com pontuação</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('code')}
                    className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      mode === 'code'
                        ? 'bg-purple-500/20 border-purple-500/80 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">💻</span>
                    <span className="font-bold text-xs">Código</span>
                    <span className="text-[10px] text-zinc-500">Símbolos e syntax</span>
                  </button>
                </div>
              </div>

              {/* Tabela de Recompensas */}
              <div className="bg-[#131722] border border-[#202738] rounded-xl p-3.5 text-xs flex items-center justify-between font-mono">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Prêmios por WPM:</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-zinc-400">🥉 30+ (+1 ⚔️)</span>
                  <span className="text-amber-400">🥇 50+ (+2 ⚔️)</span>
                  <span className="text-cyan-400">💎 70+ (+3 ⚔️)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={startCountdown}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold font-mono text-base shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>INICIAR DESAFIO SPRINT</span>
              </button>
            </div>
          )}

          {/* FASE 2: CONTAGEM REGRESSIVA (3, 2, 1) */}
          {phase === 'countdown' && (
            <div className="py-16 flex flex-col items-center justify-center gap-4">
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-8xl font-black font-mono text-amber-400 drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]"
              >
                {countdown > 0 ? countdown : 'VAI!'}
              </motion.div>
              <p className="text-sm font-mono text-zinc-400 uppercase tracking-wider animate-pulse">
                Prepare os dedos no teclado...
              </p>
            </div>
          )}

          {/* FASE 3: JOGANDO */}
          {phase === 'playing' && (
            <div className="flex flex-col gap-5">
              {/* Barra de Telemetria ao Vivo */}
              <div className="grid grid-cols-4 gap-2 font-mono">
                <div className="bg-[#131722] border border-[#202738] p-2.5 rounded-xl text-center">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Tempo</span>
                  <span className={`text-xl font-black ${timeLeft <= 5 ? 'text-red-400 animate-ping' : 'text-amber-300'}`}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="bg-[#131722] border border-[#202738] p-2.5 rounded-xl text-center">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">WPM</span>
                  <span className="text-xl font-black text-cyan-300">{liveWpm}</span>
                </div>
                <div className="bg-[#131722] border border-[#202738] p-2.5 rounded-xl text-center">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Precisão</span>
                  <span className="text-xl font-black text-emerald-300">{liveAccuracy}%</span>
                </div>
                <div className="bg-[#131722] border border-[#202738] p-2.5 rounded-xl text-center">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Combo</span>
                  <span className="text-xl font-black text-purple-300">{streak}x</span>
                </div>
              </div>

              {/* Barra de Progresso do Tempo */}
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-1000 ease-linear"
                  style={{ width: `${(timeLeft / duration) * 100}%` }}
                />
              </div>

              {/* Indicador de Tecla Morta */}
              {pendingAccent && (
                <div className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-500/30 animate-pulse text-center">
                  {getAccentDisplayName(pendingAccent)} ativo! Digite a vogal...
                </div>
              )}

              {/* Alertas de Teclado: Caps Lock e Case Mismatch */}
              <CapsLockWarning className="w-full" />

              {caseWarning && (
                <div className="py-1.5 px-3 rounded-xl bg-amber-500/25 border border-amber-400 text-amber-200 font-mono text-xs font-bold animate-pulse text-center shadow-lg shadow-amber-950/40">
                  {caseWarning}
                </div>
              )}

              {/* Display de Digitação */}
              <div
                className={`p-6 rounded-xl bg-[#090b10] border ${
                  isErrorShaking ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-shake' : 'border-[#222b3d]'
                } font-mono text-xl sm:text-2xl font-bold tracking-wider text-center select-none min-h-[140px] flex items-center justify-center flex-wrap gap-1`}
              >
                {currentText.split('').map((char, i) => {
                  const isDone = i < charIndex;
                  const isCurrent = i === charIndex;

                  return (
                    <span
                      key={i}
                      className={`inline-block relative px-1 py-0.5 rounded transition-colors ${
                        isDone
                          ? 'text-emerald-400 font-extrabold'
                          : isCurrent
                          ? 'text-amber-300 bg-zinc-800 ring-2 ring-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                          : 'text-zinc-600'
                      }`}
                    >
                      {char === ' ' ? (
                        <span className="inline-block min-w-[0.55em] select-none">&nbsp;</span>
                      ) : (
                        char
                      )}
                      {isCurrent && (
                        <span className="absolute -bottom-1 left-0 right-0 h-1 bg-amber-400 rounded-full animate-pulse" />
                      )}
                    </span>
                  );
                })}
              </div>

              <div className="text-center text-xs font-mono text-zinc-500">
                <span>Clique na janela para manter o foco do teclado • {completedItemsCount} concluídos</span>
              </div>
            </div>
          )}

          {/* FASE 4: RESULTADO */}
          {phase === 'result' && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="text-center">
                <span className="text-6xl block mb-2">{medalInfo.medal}</span>
                <span className={`text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${medalInfo.border} ${medalInfo.color} bg-zinc-900/60`}>
                  {medalInfo.title}
                </span>
                <h3 className="text-4xl font-black font-mono text-white mt-3">
                  {liveWpm} <span className="text-lg font-normal text-zinc-400">PPM / WPM</span>
                </h3>
              </div>

              {/* Grid de Estatísticas Finais */}
              <div className="grid grid-cols-3 gap-3 w-full font-mono text-center">
                <div className="bg-[#131722] border border-[#202738] p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Precisão</span>
                  <span className="text-lg font-bold text-emerald-300">{liveAccuracy}%</span>
                </div>
                <div className="bg-[#131722] border border-[#202738] p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Maior Combo</span>
                  <span className="text-lg font-bold text-purple-300">{maxStreak}x</span>
                </div>
                <div className="bg-[#131722] border border-[#202738] p-3 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Textos Finalizados</span>
                  <span className="text-lg font-bold text-sky-300">{completedItemsCount}</span>
                </div>
              </div>

              {/* Recompensas Conquistadas */}
              <div className="w-full bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-[#131722] border border-amber-500/30 rounded-xl p-4 flex items-center justify-between font-mono text-xs">
                <span className="text-zinc-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Recompensas do Desafio:</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    +{Math.round(liveWpm * 35 * (liveAccuracy >= 95 ? 1.5 : 1.0))} Bytes
                  </span>
                  {medalInfo.tokens > 0 && (
                    <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                      +{medalInfo.tokens} Moedas de Duelo ⚔️
                    </span>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center gap-3 w-full font-mono">
                <button
                  type="button"
                  onClick={startCountdown}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tentar Novamente</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-sm transition cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
