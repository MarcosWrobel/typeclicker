import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, LayoutGrid, Zap, Target, Award, AlertTriangle } from 'lucide-react';
import { formatBytes } from '../../../utils/formatting';
import { NukeIcon } from './RadarIcons';

interface RadarGameOverModalProps {
  isOpen: boolean;
  wave: number;
  score: number;
  bytesEarned: number;
  enemiesDefeated: number;
  correctChars: number;
  wrongChars: number;
  wpm: number;
  peakWpm: number;
  worstKey: { key: string; count: number } | null;
  onRestart: () => void;
  onExitToHub: () => void;
  onOpenLeaderboard?: () => void;
}

export const RadarGameOverModal: React.FC<RadarGameOverModalProps> = ({
  isOpen,
  wave,
  score,
  bytesEarned,
  enemiesDefeated,
  correctChars,
  wrongChars,
  wpm,
  peakWpm,
  worstKey,
  onRestart,
  onExitToHub,
  onOpenLeaderboard
}) => {
  if (!isOpen) return null;

  const totalChars = correctChars + wrongChars;
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-lg bg-[#12151c] border-2 border-red-500/50 p-6 sm:p-8 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.25)] flex flex-col items-center text-center"
        >
          {/* Header Badge */}
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 font-mono text-2xl mb-4 shadow-lg">
            <NukeIcon size={28} color="#f87171" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Terminal Comprometido
          </h2>
          <p className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider mt-1 mb-5">
            Defesa de Radar Concluída
          </p>

          {/* Destaque de Bytes e Pontuação */}
          <div className="w-full p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 mb-5 flex items-center justify-around gap-2">
            <div>
              <div className="text-[11px] text-zinc-400 font-mono font-semibold">PONTUAÇÃO</div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {score.toLocaleString()}
              </div>
            </div>

            <div className="h-8 w-[1px] bg-zinc-800" />

            <div>
              <div className="text-[11px] text-zinc-400 font-mono font-semibold">BYTES GANHOS</div>
              <div className="text-2xl font-black text-emerald-400 font-mono flex items-center justify-center gap-1">
                <span>+{formatBytes(bytesEarned)}</span>
              </div>
            </div>
          </div>

          {/* Grid de Estatísticas Pedagógicas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mb-4">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center">
              <span className="text-[11px] text-zinc-400 font-mono">WPM Médio</span>
              <span className="text-xl font-bold text-white font-mono mt-0.5">
                {wpm}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center">
              <span className="text-[11px] text-zinc-400 font-mono">Pico WPM</span>
              <span className="text-xl font-bold text-amber-400 font-mono mt-0.5">
                {peakWpm}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center">
              <span className="text-[11px] text-zinc-400 font-mono">Precisão</span>
              <span className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                {accuracy}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center">
              <span className="text-[11px] text-zinc-400 font-mono">Abatidos</span>
              <span className="text-xl font-bold text-sky-400 font-mono mt-0.5">
                {enemiesDefeated}
              </span>
            </div>
          </div>

          {/* Destaque Pedagógico: Letra Vilã (Maior Taxa de Erro) */}
          {worstKey && (
            <div className="w-full p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 mb-5 text-left">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-amber-300 font-mono">
                    Tecla Desafiadora ("Letra Vilã")
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Você errou essa tecla <strong className="text-amber-200">{worstKey.count} vezes</strong> durante a partida.
                  </div>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono text-base font-black">
                {worstKey.key}
              </span>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              type="button"
              onClick={onRestart}
              className="flex-1 w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Jogar Novamente</span>
            </button>

            {onOpenLeaderboard && (
              <button
                type="button"
                onClick={onOpenLeaderboard}
                className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shadow-lg"
                title="Ver Ranking Escolar do Type: Radar"
              >
                <Trophy className="w-4 h-4 text-cyan-400" />
                <span>Ranking</span>
              </button>
            )}

            <button
              type="button"
              onClick={onExitToHub}
              className="flex-1 w-full py-3.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 border border-zinc-700 transition cursor-pointer active:scale-95"
            >
              <LayoutGrid className="w-4 h-4 text-emerald-400" />
              <span>Voltar ao Hub</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
