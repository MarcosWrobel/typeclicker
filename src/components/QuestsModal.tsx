import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scroll,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Coins,
  Layers,
  X,
  Trophy,
  Swords
} from 'lucide-react';
import { GameState } from '../types';
import {
  WEEKLY_QUEST_CATALOG,
  getMsUntilNextWeeklyReset,
  syncQuestsState
} from '../services/questsEngine';
import { formatBytes } from '../utils/formatting';
import { sound } from '../utils/audio';

interface QuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
  onClaimWeeklyQuest: (questId: string) => void;
  onOpenDungeon?: () => void;
}

export const QuestsModal: React.FC<QuestsModalProps> = ({
  isOpen,
  onClose,
  state,
  onClaimWeeklyQuest,
  onOpenDungeon
}) => {
  const [timeLeftMs, setTimeLeftMs] = useState<number>(getMsUntilNextWeeklyReset());

  // Atualiza o relógio de contagem regressiva a cada 1 minuto
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeftMs(getMsUntilNextWeeklyReset());
    }, 60000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Tecla ESC para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quests = syncQuestsState(state.quests);
  const defMap = new Map(WEEKLY_QUEST_CATALOG.map((q) => [q.id, q]));

  // Quantidade de quests prontas para resgatar
  const readyToClaimCount = quests.weeklyQuests.filter((q) => q.completed && !q.claimed).length;

  // Formata o tempo restante
  const days = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
  const timeFormatted = `${days}d ${hours}h ${minutes}m`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#10141d] via-[#0d1017] to-[#090c12] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden text-zinc-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-[#121622]/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/25 to-indigo-600/20 border border-cyan-400/50 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                📜
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>TERMINAL DE MISSÕES SEMANAIS</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                    CICLO {quests.currentWeekId}
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Colégio Estadual Leopoldina • Objetivos semanais uniformes com reset toda segunda-feira às 00:00 UTC
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-4">
            {/* Banner de Status Semanal */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#131824]/90 border border-cyan-500/30">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-zinc-300">
                  Expira em: <strong className="text-cyan-300">{timeFormatted}</strong> (Segunda-feira 00:00 UTC)
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-zinc-400">Concluídas na Semana:</span>
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                  {quests.weeklyQuests.filter((q) => q.completed).length} / {quests.weeklyQuests.length}
                </span>
                {readyToClaimCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black font-black text-xs animate-bounce">
                    {readyToClaimCount} p/ resgatar
                  </span>
                )}
              </div>
            </div>

            {/* Lista das 4 Quests Semanais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {quests.weeklyQuests.map((item) => {
                const def = defMap.get(item.questId);
                if (!def) return null;

                const percent = Math.min(100, Math.round((item.current / def.target) * 100));

                return (
                  <div
                    key={item.questId}
                    className={`relative rounded-xl p-4 border transition-all flex flex-col justify-between gap-3 ${
                      item.claimed
                        ? 'bg-[#0f131a]/60 border-zinc-800/60 opacity-70'
                        : item.completed
                        ? 'bg-gradient-to-br from-amber-950/30 via-[#131922] to-[#0c1017] border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                        : 'bg-[#10151f]/80 border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl select-none flex-shrink-0 border ${
                          item.completed
                            ? 'bg-gradient-to-br from-amber-500/25 to-amber-700/20 border-amber-400/60 text-amber-300'
                            : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300'
                        }`}
                      >
                        {def.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.2 rounded-full border border-cyan-500/30">
                            {def.category}
                          </span>

                          {item.claimed ? (
                            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Resgatado</span>
                            </span>
                          ) : item.completed ? (
                            <span className="text-[11px] font-mono text-amber-400 font-bold animate-pulse">
                              ✨ Concluída!
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-zinc-400">
                              {item.current} / {def.target} {def.unit}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-black text-white mt-1 truncate">{def.title}</h4>
                        <p className="text-xs text-zinc-300 mt-0.5 line-clamp-2 leading-relaxed">
                          {def.description}
                        </p>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                        <span>Progresso</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className={`h-full ${
                            item.completed
                              ? 'bg-gradient-to-r from-amber-400 to-emerald-400'
                              : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Rodapé: Recompensas & Botão de Resgate */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/60 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                          +{formatBytes(def.reward.bytes)}
                        </span>
                        {def.reward.levelTokens && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300">
                            <Coins className="w-2.5 h-2.5 text-amber-400" />
                            +{def.reward.levelTokens}
                          </span>
                        )}
                        {def.reward.quantumFragments && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300">
                            <Layers className="w-2.5 h-2.5 text-cyan-400" />
                            +{def.reward.quantumFragments} Frag.
                          </span>
                        )}
                      </div>

                      {item.claimed ? (
                        <span className="text-xs font-mono text-zinc-500 font-bold px-2 py-1">✓ Concluída</span>
                      ) : item.completed ? (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onClaimWeeklyQuest(item.questId);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs font-mono transition shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer flex items-center gap-1"
                        >
                          <Trophy className="w-3.5 h-3.5" />
                          <span>RESGATAR</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-zinc-500 italic">Em andamento...</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Banner de Atalho Direto para a Masmorra */}
            {onOpenDungeon && (
              <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-rose-950/40 via-[#121622] to-amber-950/40 border border-rose-500/30 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">⚔️</span>
                  <div>
                    <span className="text-xs font-bold text-white block">Quer encarar a Masmorra de Digitação?</span>
                    <span className="text-[11px] text-zinc-400 block">
                      Enfrente chefes em textos completos e treine suas teclas fracas no botão MASMORRA da tela principal.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                    onOpenDungeon();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>ABRIR MASMORRA</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
