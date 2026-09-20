import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Swords,
  Sparkles,
  Coins,
  Layers,
  X,
  Target,
  Trophy,
  Flame,
  Shield,
  Compass
} from 'lucide-react';
import { GameState } from '../types';
import { generateRpgFloor, syncQuestsState } from '../services/questsEngine';
import { formatBytes } from '../utils/formatting';
import { sound } from '../utils/audio';

interface RpgDungeonModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
  onStartBattle: (floor: number) => void;
}

export const RpgDungeonModal: React.FC<RpgDungeonModalProps> = ({
  isOpen,
  onClose,
  state,
  onStartBattle
}) => {
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
  const floorData = generateRpgFloor(quests.rpgDungeonFloor, state.keyTelemetry);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#16101c] via-[#10121a] to-[#090b10] border-2 border-rose-500/50 rounded-2xl shadow-[0_0_60px_rgba(244,63,94,0.25)] overflow-hidden text-zinc-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-[#161220]/90 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/30 via-red-600/25 to-amber-500/20 border border-rose-400/60 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                ⚔️
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>MASMORRA DE DIGITAÇÃO • CRÔNICAS RPG</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40">
                    ANDAR {floorData.floor}
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Digitação contínua em parágrafos literários • Adaptação às suas dificuldades motoras
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

          {/* Conteúdo Principal da Masmorra */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
            {/* Cartão do Andar Atual & Chefe */}
            <div className="relative rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#1c1224] via-[#121622] to-[#0a0d15] border-2 border-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.15)] flex flex-col md:flex-row items-center gap-6">
              {/* Avatar do Chefe com Animação */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-rose-950/80 via-red-950/60 to-purple-950/80 border-2 border-rose-400/60 flex flex-col items-center justify-center text-5xl sm:text-6xl select-none flex-shrink-0 shadow-[0_0_25px_rgba(244,63,94,0.35)] relative"
              >
                <span>{floorData.boss.avatar}</span>
                <span className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-md bg-black/90 border border-rose-400/60 text-[10px] font-mono font-bold text-rose-300">
                  Nv. {floorData.floor}
                </span>
              </motion.div>

              {/* Informações do Andar & Boss */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/50 text-xs font-mono font-bold">
                    Andar {floorData.floor}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/50 text-xs font-mono font-bold">
                    Guardião: {floorData.boss.name}
                  </span>
                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    HP: <strong className="text-rose-400">{floorData.boss.maxHp}</strong>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">
                  {floorData.chapterTitle}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
                  {floorData.boss.lore}
                </p>

                {/* Teclas de Fraqueza Adaptativa */}
                {floorData.boss.weaknessKeys && floorData.boss.weaknessKeys.length > 0 && (
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-3 flex-wrap">
                    <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      <span>Fraquezas Ativas (Motor de Erro):</span>
                    </span>
                    {floorData.boss.weaknessKeys.map((k) => (
                      <span
                        key={k}
                        className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/60 text-amber-300 text-xs font-mono font-black uppercase shadow-sm"
                      >
                        [{k}]
                      </span>
                    ))}
                  </div>
                )}

                {/* Recompensas do Andar */}
                <div className="flex items-center justify-center md:justify-start gap-2.5 mt-3.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-xs font-mono font-black text-emerald-300">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    +{formatBytes(floorData.rewardBytes)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/50 text-xs font-mono font-black text-amber-300">
                    <Coins className="w-3 h-3 text-amber-400" />
                    +{floorData.rewardTokens} Fichas
                  </span>
                  {floorData.rewardFragments && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-xs font-mono font-black text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                      <Layers className="w-3 h-3 text-cyan-400" />
                      +{floorData.rewardFragments} Frag. Quânticos
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Botão Gigante de Iniciar Expedição */}
            <div className="flex flex-col items-center gap-2 pt-1">
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                  onStartBattle(quests.rpgDungeonFloor);
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base font-mono tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_35px_rgba(244,63,94,0.5)] cursor-pointer flex items-center justify-center gap-3 border border-rose-400/50"
              >
                <Swords className="w-5 h-5 animate-pulse" />
                <span>
                  {floorData.isProcedural
                    ? `DESAFIAR ANDAR INFINITO ${floorData.floor}`
                    : `ENTRAR NO COMBATE DO ANDAR ${floorData.floor}`}
                </span>
              </button>
              <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 mt-1">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  Escudo Protetor Ativo
                </span>
                <span>•</span>
                <span>Texto Completo com Acentuação</span>
                <span>•</span>
                <span>Sem Penalidade por Derrota</span>
              </div>
            </div>

            {/* Painel de Estatísticas do Aventureiro */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-[#121520] border border-zinc-800 text-center">
                <span className="text-zinc-400 text-xs font-mono flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  Andar Mais Alto
                </span>
                <h4 className="text-2xl font-black text-white font-mono mt-1">
                  Andar {quests.highestRpgFloor}
                </h4>
              </div>
              <div className="p-4 rounded-xl bg-[#121520] border border-zinc-800 text-center">
                <span className="text-zinc-400 text-xs font-mono flex items-center justify-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  XP de Aventureiro
                </span>
                <h4 className="text-2xl font-black text-cyan-300 font-mono mt-1">
                  {quests.rpgDungeonXp} XP
                </h4>
              </div>
              <div className="p-4 rounded-xl bg-[#121520] border border-zinc-800 text-center">
                <span className="text-zinc-400 text-xs font-mono flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Quests Cumpridas
                </span>
                <h4 className="text-2xl font-black text-amber-300 font-mono mt-1">
                  {quests.totalQuestsCompleted}
                </h4>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
