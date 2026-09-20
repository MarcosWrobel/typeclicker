import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ShieldAlert, CheckCircle2, Zap, Keyboard, X } from 'lucide-react';
import { sound } from '../utils/audio';
import { formatBytes } from '../utils/formatting';

interface ChallengeArenaProps {
  level: number;
  isOpen: boolean;
  reducedAlerts?: boolean;
  onSuccess: (reward: number) => void;
  onFail: () => void;
}

const CHALLENGE_WORDS = [
  "CIBERNETICA", "CRIPTOGRAFIA", "ALGORITMO", "OVERCLOCK", "SINTETIZADOR",
  "PROTOCOLOS", "MAINFRAME", "TECLADO", "VELOCIDADE", "PRECISAO",
  "NEUROMANCER", "METAVERSO", "VIRTUAL", "SISTEMA", "BACKUP",
  "FIREWALL", "PROCESSADOR", "BANCO", "MEMORIA", "COMPILADOR",
  "ROTEADOR", "CONEXAO", "SERVIDOR", "SEGURANCA", "TERMINAL",
  "INTERNET", "PROGRAMA", "EXECUTAVEL", "SCRIPT", "HARDWARE",
  "DIGITACAO", "TECNOLOGIA", "DESENVOLVEDOR", "OPERACIONAL", "SATELITE"
];

export const ChallengeArena: React.FC<ChallengeArenaProps> = ({
  level,
  isOpen,
  reducedAlerts = false,
  onSuccess,
  onFail
}) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [status, setStatus] = useState<'intro' | 'playing' | 'success' | 'fail'>('intro');
  const [isFocused, setIsFocused] = useState(true);
  const [isErrorShaking, setIsErrorShaking] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<'intro' | 'playing' | 'success' | 'fail'>(status);
  const wordsRef = useRef<string[]>(words);
  const currentWordIndexRef = useRef<number>(currentWordIndex);
  const charIndexRef = useRef<number>(charIndex);
  const lastProcessedRef = useRef<{ char: string; time: number }>({ char: '', time: 0 });

  // Sincroniza refs para evitar qualquer problema de closure stale durante digitação rápida
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

  const totalWords = 3;
  // Tempo adaptativo justo para ambiente escolar: 25s em níveis iniciais, até 16s em níveis mais avançados
  const initialTime = Math.max(16, 25 - Math.floor(level / 20));
  const reward = level * 1000;

  // Função central para focar o input com garantia de foco nativo
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
      setIsFocused(true);
    }
  }, []);

  // Inicialização do desafio quando aberto
  useEffect(() => {
    if (isOpen) {
      const shuffled = [...CHALLENGE_WORDS].sort(() => 0.5 - Math.random());
      const selectedWords = shuffled.slice(0, totalWords);
      setWords(selectedWords);
      wordsRef.current = selectedWords;

      setCurrentWordIndex(0);
      currentWordIndexRef.current = 0;

      setCharIndex(0);
      charIndexRef.current = 0;

      setTimeLeft(initialTime);
      setStatus('intro');
      statusRef.current = 'intro';

      // Garante foco inicial
      const focusTimer = setTimeout(() => {
        focusInput();
      }, 100);

      // Inicia a rodada jogável após a contagem de introdução de 3 segundos
      const timer = setTimeout(() => {
        setStatus('playing');
        statusRef.current = 'playing';
        sound.playPrestige();
        focusInput();
      }, 3000);

      return () => {
        clearTimeout(focusTimer);
        clearTimeout(timer);
      };
    }
  }, [isOpen, initialTime, focusInput]);

  // Processa caractere digitado (usado tanto pelo input nativo quanto pelo listener global)
  const processChar = useCallback((typedChar: string) => {
    if (statusRef.current !== 'playing') return;

    // Deduplicação caso ocorra duplo disparo de evento dentro de 35ms
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

    // Normalização para comparar caracteres sem distinção de acentos/cedilha (ex: C vs Ç, A vs Ã)
    const normalizeChar = (c: string) =>
      c.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const isMatch =
      typedChar.toUpperCase() === expectedChar.toUpperCase() ||
      normalizeChar(typedChar) === normalizeChar(expectedChar);

    if (isMatch) {
      sound.playKeyStroke(chIdx + 1);

      if (chIdx + 1 >= currentWord.length) {
        sound.playWordComplete();
        if (wordIdx + 1 >= currentWords.length) {
          setStatus('success');
          statusRef.current = 'success';
          sound.playPrestige();
          setTimeout(() => {
            onSuccess(reward);
          }, 2000);
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
      setTimeout(() => setIsErrorShaking(false), 250);
    }
  }, [onSuccess, reward]);

  // Listener global de teclado (Window KeyDown com Capture Phase)
  // Isso garante que mesmo se o input invisível perder o foco, a digitação CONTINUA FUNCIONANDO 100%!
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (statusRef.current !== 'playing') return;

      // Se pressionar Escape, não faz nada no desafio
      if (e.key === 'Escape') return;

      // Ignora teclas modificadoras e de controle
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

      // Reafirma o foco no input
      if (document.activeElement !== inputRef.current) {
        focusInput();
      }

      // Caractere digitável
      if (e.key.length === 1 || e.key === 'Space') {
        e.preventDefault();
        const rawChar = e.key === ' ' || e.key === 'Space' ? ' ' : e.key;
        processChar(rawChar);
      }
    };

    window.addEventListener('keydown', handleWindowKeyDown, true);
    return () => window.removeEventListener('keydown', handleWindowKeyDown, true);
  }, [isOpen, focusInput, processChar]);

  // Cronômetro do desafio
  useEffect(() => {
    if (status === 'playing') {
      focusInput();
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStatus('fail');
            statusRef.current = 'fail';
            sound.playGlitch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, focusInput]);

  // Monitor de foco periódica durante o modo 'playing'
  useEffect(() => {
    if (status !== 'playing') return;

    const checkFocus = () => {
      if (document.activeElement === inputRef.current) {
        setIsFocused(true);
      } else {
        setIsFocused(false);
      }
    };

    const interval = setInterval(checkFocus, 500);
    return () => clearInterval(interval);
  }, [status]);

  // Input Change handler para mobile/virtual keyboard e IME
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (statusRef.current !== 'playing') return;
    const val = e.target.value;
    if (!val) return;
    for (const ch of val) {
      processChar(ch);
    }
    e.target.value = '';
  };

  // Clique em qualquer lugar da tela recaptura o foco imediatamente
  const handleContainerClick = (e: React.MouseEvent) => {
    // Não interrompe se for clique em botões interativos
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'button' || target.closest('button')) {
      return;
    }
    focusInput();
  };

  const renderWord = (word: string, index: number) => {
    if (index < currentWordIndex) {
      return (
        <span key={index} className="text-emerald-500/60 line-through select-none font-bold">
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

    // Palavra atual ativa
    return (
      <span key={index} className="text-white relative font-black select-none tracking-wider">
        <span className="text-emerald-400">{word.substring(0, charIndex)}</span>
        <span className="text-white bg-emerald-500/30 border-b-2 border-emerald-400 animate-pulse px-0.5 rounded-sm">
          {word.substring(charIndex, charIndex + 1)}
        </span>
        <span className="text-zinc-500">{word.substring(charIndex + 1)}</span>
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
          {/* Input invisível sempre montado na raiz do modal para garantir foco consistente */}
          <input
            ref={inputRef}
            type="text"
            value=""
            onChange={handleInputChange}
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
            onClick={handleContainerClick}
            className={`w-full max-w-2xl bg-zinc-950 border-2 ${
              isErrorShaking ? 'border-red-500 shadow-[0_0_80px_rgba(239,68,68,0.4)]' : 'border-red-500/60 shadow-[0_0_100px_rgba(239,68,68,0.25)]'
            } rounded-2xl flex flex-col overflow-hidden relative transition-all duration-200 cursor-default`}
          >
            {/* Grade decorativa hacker */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #ef4444 2px, #ef4444 4px)',
                backgroundSize: '100% 4px'
              }}
            />

            {/* Topbar com Botão de Desistir / Pular */}
            <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-red-500/20 bg-red-950/20">
              <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-xs">
                <Terminal className="w-4 h-4" />
                <span>TERMINAL_DESAFIO_NV_{level}.EXE</span>
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

            <div className="relative p-6 sm:p-10 flex flex-col items-center text-center">
              {status === 'intro' && (
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4 py-8"
                >
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30">
                    <ShieldAlert className={`w-16 h-16 text-red-500 ${reducedAlerts ? '' : 'animate-pulse'}`} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-widest text-red-500 font-mono">
                    DESAFIO DO NÍVEL {level}
                  </h2>
                  <p className="text-zinc-300 max-w-md text-xs sm:text-sm font-mono">
                    Invasão do sistema detectada! Digite as 3 palavras-chave de segurança antes do cronômetro zerar para conquistar <strong className="text-amber-300">+{formatBytes(reward)} Bytes</strong>!
                  </p>
                  <div className={`mt-6 text-4xl sm:text-5xl font-mono font-black text-white ${reducedAlerts ? '' : 'animate-bounce'}`}>
                    PREPARE-SE
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">O teclado será ativado automaticamente em instantes...</span>
                </motion.div>
              )}

              {status === 'playing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center w-full gap-6"
                >
                  <div className="flex justify-between w-full items-center border-b border-red-500/30 pb-4">
                    <div className="flex items-center gap-2 text-zinc-300 font-mono text-xs">
                      <span className="font-bold text-red-400">Palavra:</span>
                      <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-mono font-bold">
                        {currentWordIndex + 1} / {totalWords}
                      </span>
                    </div>
                    <div className={`text-3xl sm:text-4xl font-black font-mono flex items-center gap-2 ${
                      timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-emerald-400'
                    }`}>
                      <span>00:{timeLeft.toString().padStart(2, '0')}</span>
                    </div>
                  </div>

                  {/* Palavras a descriptografar com efeito de tremor no erro */}
                  <div className={`flex flex-wrap justify-center gap-3 sm:gap-6 text-2xl sm:text-4xl font-mono font-black tracking-widest leading-relaxed my-4 transition-transform duration-100 ${
                    isErrorShaking ? 'translate-x-1.5' : ''
                  }`}>
                    {words.map((w, i) => renderWord(w, i))}
                  </div>

                  {/* Barra de Status do Foco / Teclado */}
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
                      <span className="font-bold">TECLADO ATIVO • DIGITE AS LETRAS DESTACADAS</span>
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
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                    <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">SISTEMA RECUPERADO!</h2>
                  <p className="text-zinc-300 font-mono text-xs sm:text-sm">
                    Desafio do Nível {level} superado com precisão impecável.
                  </p>
                  <div className="text-emerald-300 font-mono font-bold text-lg sm:text-xl flex items-center gap-2 bg-emerald-500/20 px-6 py-3 rounded-xl border border-emerald-500/40 mt-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span>+{formatBytes(reward)} BYTES BÔNUS</span>
                  </div>
                </motion.div>
              )}

              {status === 'fail' && (
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4 py-8"
                >
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30">
                    <ShieldAlert className="w-16 h-16 sm:w-20 sm:h-20 text-red-500" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-mono">TEMPO ESGOTADO!</h2>
                  <p className="text-zinc-400 font-mono text-xs sm:text-sm max-w-md">
                    Não desanime! Continue treinando e você poderá tentar novos desafios a cada 10 níveis!
                  </p>
                  <button
                    type="button"
                    onClick={onFail}
                    className="mt-4 px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black font-mono text-sm rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.5)] cursor-pointer transition transform hover:scale-105 active:scale-95"
                  >
                    VOLTAR AO JOGO
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
