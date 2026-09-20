import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, CheckCircle2, Zap, Keyboard, X, Target, Sparkles, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';
import { audioSynthesizer } from '../services/audioSynthesizer';
import { formatBytes } from '../utils/formatting';

interface FocusDrillModalProps {
  isOpen: boolean;
  targetKey: string;
  words: string[];
  onComplete: (reward: number) => void;
  onSkip: () => void;
}

export const FocusDrillModal: React.FC<FocusDrillModalProps> = ({
  isOpen,
  targetKey,
  words,
  onComplete,
  onSkip
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [status, setStatus] = useState<'intro' | 'playing' | 'success'>('intro');
  const [isFocused, setIsFocused] = useState(true);
  const [isErrorShaking, setIsErrorShaking] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<'intro' | 'playing' | 'success'>(status);
  const wordsRef = useRef<string[]>(words);
  const currentWordIndexRef = useRef<number>(currentWordIndex);
  const charIndexRef = useRef<number>(charIndex);
  const lastProcessedRef = useRef<{ char: string; time: number }>({ char: '', time: 0 });

  const totalWords = words.length || 3;
  const reward = 150; // Recompensa por estabilizar o circuito

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  useEffect(() => {
    currentWordIndexRef.current = currentWordIndex;
  }, [currentWordIndex]);

  useEffect(() => {
    charIndexRef.current = charIndex;
  }, [charIndex]);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
      setIsFocused(true);
    }
  }, []);

  // Inicialização quando aberto
  useEffect(() => {
    if (isOpen) {
      setCurrentWordIndex(0);
      currentWordIndexRef.current = 0;
      setCharIndex(0);
      charIndexRef.current = 0;
      setStatus('intro');
      statusRef.current = 'intro';

      const focusTimer = setTimeout(() => {
        focusInput();
      }, 100);

      // Inicia o modo jogável após uma breve introdução de 1.2 segundos
      const introTimer = setTimeout(() => {
        setStatus('playing');
        statusRef.current = 'playing';
        focusInput();
      }, 1200);

      return () => {
        clearTimeout(focusTimer);
        clearTimeout(introTimer);
      };
    }
  }, [isOpen, words, focusInput]);

  // Processa caractere digitado
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

    const currentWords = wordsRef.current;
    const wordIdx = currentWordIndexRef.current;
    const chIdx = charIndexRef.current;

    const currentWord = currentWords[wordIdx];
    if (!currentWord) return;

    const expectedChar = currentWord[chIdx];
    if (!expectedChar) return;

    // Normalização para comparação sem quebrar acentos
    const normalizeChar = (c: string) =>
      c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const isMatch =
      typedChar.toLowerCase() === expectedChar.toLowerCase() ||
      normalizeChar(typedChar) === normalizeChar(expectedChar);

    if (isMatch) {
      sound.playKeyStroke(chIdx + 1);

      if (chIdx + 1 >= currentWord.length) {
        sound.playWordComplete();
        if (wordIdx + 1 >= currentWords.length) {
          setStatus('success');
          statusRef.current = 'success';
          sound.playUpgrade();
          audioSynthesizer.playUnlockJingle();
          setTimeout(() => {
            onComplete(reward);
          }, 1600);
        } else {
          setCurrentWordIndex((prev) => prev + 1);
          currentWordIndexRef.current = wordIdx + 1;
          setCharIndex(0);
          charIndexRef.current = 0;
        }
      } else {
        setCharIndex((prev) => prev + 1);
        charIndexRef.current = chIdx + 1;
      }
    } else {
      sound.playError();
      setIsErrorShaking(true);
      setTimeout(() => setIsErrorShaking(false), 260);
    }
  }, [onComplete, reward]);

  // Listener global de teclado com Capture Phase
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (statusRef.current !== 'playing') return;

      if (e.key === 'Escape') {
        onSkip();
        return;
      }

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
  }, [isOpen, focusInput, processChar, onSkip]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (statusRef.current !== 'playing') return;
    const val = e.target.value;
    if (!val) return;
    for (const ch of val) {
      processChar(ch);
    }
    e.target.value = '';
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'button' || target.closest('button')) {
      return;
    }
    focusInput();
  };

  const renderWord = (word: string, index: number) => {
    if (index < currentWordIndex) {
      return (
        <span key={index} className="text-emerald-500/60 line-through select-none font-bold opacity-75">
          {word}
        </span>
      );
    }
    if (index > currentWordIndex) {
      return (
        <span key={index} className="text-zinc-600 select-none">
          {word}
        </span>
      );
    }

    // Palavra atual em foco
    return (
      <span key={index} className="text-white relative font-black select-none tracking-wider bg-zinc-900/60 px-3 py-1 rounded-xl border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
        {word.split('').map((char, cIdx) => {
          const isDone = cIdx < charIndex;
          const isCurrent = cIdx === charIndex;
          const isTarget = char.toLowerCase() === targetKey.toLowerCase();

          return (
            <span
              key={cIdx}
              className={`inline-block relative px-1 py-0.5 ${
                isDone
                  ? 'text-emerald-400'
                  : isCurrent
                  ? 'text-white bg-amber-500/30 border-b-2 border-amber-400 animate-pulse'
                  : 'text-zinc-400'
              } ${isTarget && !isDone ? 'font-extrabold text-amber-300' : ''}`}
            >
              {char}
              {isTarget && !isDone && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
              )}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleContainerClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md cursor-pointer select-none"
        >
          {/* Input invisível para IME / Teclados virtuais */}
          <input
            ref={inputRef}
            type="text"
            value=""
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="opacity-0 absolute -left-[9999px] top-0 w-1 h-1 pointer-events-auto"
            aria-label="Entrada do modo foco"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          <div
            onClick={handleContainerClick}
            className={`w-full max-w-2xl bg-zinc-950 border-2 ${
              isErrorShaking
                ? 'border-red-500 shadow-[0_0_80px_rgba(239,68,68,0.4)]'
                : 'border-amber-500/80 shadow-[0_0_100px_rgba(245,158,11,0.25)]'
            } rounded-2xl flex flex-col overflow-hidden relative transition-all duration-200 cursor-default`}
          >
            {/* Grade decorativa hacker em âmbar */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #f59e0b 2px, #f59e0b 4px)',
                backgroundSize: '100% 4px'
              }}
            />

            {/* Topbar com Botão de Desistir / Pular */}
            <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-amber-500/20 bg-amber-950/20">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>CIRCUITO_BLOQUEADO // MODO_FOCO_CALIBRACAO.EXE</span>
              </div>
              <button
                type="button"
                onClick={onSkip}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono text-zinc-400 hover:text-amber-300 hover:bg-amber-500/20 border border-transparent hover:border-amber-500/30 transition flex items-center gap-1 cursor-pointer"
                title="Pular e destravar o terminal"
              >
                <X className="w-3.5 h-3.5" />
                <span>Pular Calibração (Esc)</span>
              </button>
            </div>

            <div className="relative p-6 sm:p-10 flex flex-col items-center text-center">
              {status === 'intro' && (
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4 py-8"
                >
                  <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                    <Target className="w-16 h-16 animate-pulse" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-widest text-amber-400 font-mono">
                    MODO FOCO: REABILITAÇÃO MOTORA
                  </h2>
                  <p className="text-zinc-300 max-w-md text-xs sm:text-sm font-mono leading-relaxed">
                    O sistema detectou bloqueio na tecla <strong className="text-amber-300 px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded uppercase text-base">{targetKey}</strong>. Digite a sequência de calibração para restabelecer os circuitos do terminal!
                  </p>
                  <div className="mt-4 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SEM LIMITE DE TEMPO • PRIORIZE A PRECISÃO</span>
                  </div>
                </motion.div>
              )}

              {status === 'playing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center w-full gap-6"
                >
                  {/* Status do treino: Progresso e Tecla Alvo */}
                  <div className="flex justify-between w-full items-center border-b border-amber-500/30 pb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-zinc-300 font-mono text-xs">
                      <span className="font-bold text-amber-400">Progresso:</span>
                      <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                        Palavra {currentWordIndex + 1} de {totalWords}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-zinc-400">Tecla Crítica:</span>
                      <span className="w-7 h-7 rounded-md bg-amber-500/30 text-amber-200 border border-amber-400 flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(245,158,11,0.5)] uppercase">
                        {targetKey}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Sem tempo limite</span>
                    </div>
                  </div>

                  {/* Palavras a digitar com animação */}
                  <div className={`flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-2xl sm:text-4xl font-mono font-black tracking-widest leading-relaxed my-6 transition-transform duration-100 ${
                    isErrorShaking ? 'translate-x-1.5' : ''
                  }`}>
                    {words.map((w, i) => renderWord(w, i))}
                  </div>

                  {/* Barra de Status do Teclado */}
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
                      <span className="font-bold">TECLADO PRONTO • DIGITE AS LETRAS DESTACADAS</span>
                    ) : (
                      <span className="font-bold underline">⚠️ CLIQUE AQUI PARA ATIVAR O TECLADO</span>
                    )}
                  </div>
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4 py-8"
                >
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">CIRCUITO ESTABILIZADO!</h2>
                  <p className="text-zinc-300 font-mono text-xs sm:text-sm">
                    Reabilitação concluída com sucesso. O terminal foi desbloqueado!
                  </p>
                  <div className="text-emerald-300 font-mono font-bold text-lg sm:text-xl flex items-center gap-2 bg-emerald-500/20 px-6 py-3 rounded-xl border border-emerald-500/40 mt-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span>+{formatBytes(reward)} BYTES BÔNUS</span>
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
