import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Key, Sparkles, Coins, Clock, X, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';
import { formatBytes } from '../utils/formatting';

interface RpgChestMinigameProps {
  isOpen: boolean;
  onClose: () => void;
  floor: number;
  onRewardClaim: (reward: { bytes: number; tokens: number; xp: number; keyGranted: boolean }) => void;
}

const CHEST_CHALLENGE_WORDS = [
  ['DADOS', 'MATRIZ', 'NUCLEO'],
  ['FIREWALL', 'CIRCUITO', 'QUANTUM'],
  ['PROTOCOLO', 'ALGORITMO', 'OVERCLOCK'],
  ['SEGURANCA', 'CRIPTO', 'LEOPOLDINA'],
  ['EXPEDICAO', 'TERMINAL', 'SINTAXE']
];

export const RpgChestMinigame: React.FC<RpgChestMinigameProps> = ({
  isOpen,
  onClose,
  floor,
  onRewardClaim
}) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFailed, setIsFailed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Inicializa o desafio
  useEffect(() => {
    if (!isOpen) return;
    const pool = CHEST_CHALLENGE_WORDS[floor % CHEST_CHALLENGE_WORDS.length];
    setWords(pool);
    setCurrentWordIndex(0);
    setCharIndex(0);
    setIsCompleted(false);
    setIsFailed(false);
    setTimeLeft(30);
  }, [isOpen, floor]);

  // Cronômetro do minigame
  useEffect(() => {
    if (!isOpen || isCompleted || isFailed) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFailed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isCompleted, isFailed]);

  const currentWord = words[currentWordIndex] || '';

  // Captura de teclado
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || isCompleted || isFailed) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      const key = e.key.toUpperCase();
      if (key.length === 1 && key >= 'A' && key <= 'Z') {
        e.preventDefault();
        const expectedChar = currentWord[charIndex];

        if (key === expectedChar) {
          sound.playType();
          const nextCharIndex = charIndex + 1;

          if (nextCharIndex >= currentWord.length) {
            // Palavra concluída
            const nextWordIndex = currentWordIndex + 1;
            if (nextWordIndex >= words.length) {
              // Cofre aberto!
              sound.playChallengeSuccess();
              setIsCompleted(true);
              const reward = {
                bytes: floor * 3000 + 10000,
                tokens: 2,
                xp: 150,
                keyGranted: true
              };
              onRewardClaim(reward);
            } else {
              setCurrentWordIndex(nextWordIndex);
              setCharIndex(0);
            }
          } else {
            setCharIndex(nextCharIndex);
          }
        } else {
          sound.playError();
        }
      }
    },
    [isOpen, isCompleted, isFailed, currentWord, charIndex, currentWordIndex, words.length, floor, onRewardClaim, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-[#181124] via-[#10131d] to-[#090b12] border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.3)] text-zinc-200 text-center overflow-hidden"
        >
          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Ícone do Baú animado */}
          <motion.div
            animate={isCompleted ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : { y: [-3, 3, -3] }}
            transition={{ duration: 2, repeat: isCompleted ? 0 : Infinity }}
            className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500/25 via-rose-500/20 to-purple-600/20 border-2 border-amber-400/60 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(245,158,11,0.35)]"
          >
            {isCompleted ? '🔓' : '🔐'}
          </motion.div>

          <h3 className="text-xl sm:text-2xl font-black text-white mt-4 font-mono">
            {isCompleted ? 'COFRE CRIPTOGRÁFICO ABERTO!' : isFailed ? 'SISTEMA BLOQUEADO!' : 'HACK DE COFRE CRIPTOGRÁFICO'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            {isCompleted
              ? 'Todas as travas de dados foram desativadas com sucesso!'
              : isFailed
              ? 'Tempo esgotado. Tente novamente na próxima expedição.'
              : `Decodifique ${words.length} travas de segurança digitando as palavras no teclado.`}
          </p>

          {/* Estado Normal de Jogo */}
          {!isCompleted && !isFailed && (
            <div className="mt-6 space-y-4">
              {/* Temporizador */}
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-300 bg-amber-950/40 py-1.5 px-3 rounded-full border border-amber-500/40 w-fit mx-auto">
                <Clock className="w-3.5 h-3.5" />
                <span>Tempo Restante: {timeLeft}s</span>
              </div>

              {/* Indicadores de Travas */}
              <div className="flex items-center justify-center gap-3">
                {words.map((w, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                      idx < currentWordIndex
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                        : idx === currentWordIndex
                        ? 'bg-amber-500/20 text-amber-200 border-amber-500 animate-pulse'
                        : 'bg-zinc-900/60 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {idx < currentWordIndex ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3" />}
                    <span>Trava {idx + 1}</span>
                  </div>
                ))}
              </div>

              {/* Palavra Alvo Ativa */}
              <div className="p-4 rounded-2xl bg-black/60 border border-zinc-800 my-4">
                <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-center">
                  {currentWord.split('').map((char, index) => {
                    const isDone = index < charIndex;
                    const isCurrent = index === charIndex;
                    return (
                      <span
                        key={index}
                        className={`inline-block px-1 transition-colors ${
                          isDone
                            ? 'text-emerald-400 font-black'
                            : isCurrent
                            ? 'text-amber-300 underline underline-offset-4 decoration-amber-400 animate-pulse'
                            : 'text-zinc-600'
                        }`}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              </div>

              <span className="text-[11px] font-mono text-zinc-400 block">
                Digite as letras no seu teclado físico para desarmar a trava
              </span>
            </div>
          )}

          {/* Recompensas de Sucesso */}
          {isCompleted && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center">
                  <Sparkles className="w-4 h-4 text-emerald-400 mx-auto" />
                  <span className="text-[10px] font-mono text-zinc-400 block mt-1">Bytes</span>
                  <span className="text-xs font-black text-emerald-300 font-mono">
                    +{formatBytes(floor * 3000 + 10000)}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-center">
                  <Coins className="w-4 h-4 text-amber-400 mx-auto" />
                  <span className="text-[10px] font-mono text-zinc-400 block mt-1">Fichas</span>
                  <span className="text-xs font-black text-amber-300 font-mono">+2</span>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-center">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mx-auto" />
                  <span className="text-[10px] font-mono text-zinc-400 block mt-1">XP Masmorra</span>
                  <span className="text-xs font-black text-cyan-300 font-mono">+150 XP</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-center shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                  <Key className="w-4 h-4 text-rose-400 mx-auto animate-bounce" />
                  <span className="text-[10px] font-mono text-zinc-400 block mt-1">Chave Bônus</span>
                  <span className="text-xs font-black text-rose-300 font-mono">+1 CHAVE</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black font-mono text-sm tracking-wider cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.4)] transition"
              >
                COLETAR E CONTINUAR
              </button>
            </div>
          )}

          {/* Falha */}
          {isFailed && (
            <div className="mt-6 space-y-4">
              <p className="text-sm font-mono text-rose-400">
                O cofre entrou em modo de quarentena. Pratique no terminal principal para recarregar seus dados!
              </p>
              <button
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs font-bold cursor-pointer"
              >
                Voltar à Masmorra
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
