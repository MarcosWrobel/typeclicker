import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Award, RotateCw, CheckCircle2, Trophy, Shield } from 'lucide-react';
import { LeaderboardEntry } from '../services/firebaseService';
import { GameState } from '../types';
import { StudentProfileCard } from './StudentProfileCard';
import { calculatePlayerBadges, extractStatsFromPlayer } from '../services/profileBadges';
import { sound } from '../utils/audio';

import { PlayerCosmetics } from '../types/cosmetics';

interface StudentProfileCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Partial<LeaderboardEntry> | GameState | null;
  pioneerRank?: 1 | 2 | 3;
  isCurrentPlayer?: boolean;
  currentCosmetics?: PlayerCosmetics;
}

export const StudentProfileCardModal: React.FC<StudentProfileCardModalProps> = ({
  isOpen,
  onClose,
  player,
  pioneerRank,
  isCurrentPlayer = false,
  currentCosmetics
}) => {
  const [activeView, setActiveView] = useState<'card' | 'badges'>('card');

  useEffect(() => {
    if (isOpen) {
      setActiveView('card');
      sound.playPrestige();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !player) return null;

  const { allBadges } = calculatePlayerBadges(player, pioneerRank);
  const stats = extractStatsFromPlayer(player);

  const isGameState = 'totalBytesEarned' in player;
  const displayName = isGameState
    ? (player as GameState).studentNickname || (player as GameState).studentName || 'Digitador'
    : (player as Partial<LeaderboardEntry>).apelido || (player as Partial<LeaderboardEntry>).nome || 'Digitador';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative max-w-md w-full flex flex-col items-center gap-3 my-auto"
        >
          {/* Barra de Ações Superior */}
          <div className="w-full flex items-center justify-between px-2 text-zinc-300">
            {/* Alternador de Vista (Card / Galeria de Insígnias) */}
            <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl shadow-md">
              <button
                type="button"
                onClick={() => setActiveView('card')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'card'
                    ? 'bg-amber-500 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('badges')}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'badges'
                    ? 'bg-amber-500 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Insígnias ({allBadges.length})</span>
              </button>
            </div>

            {/* Botão Fechar */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* CONTEÚDO: Vista de Card ou Vista de Galeria de Insígnias */}
          {activeView === 'card' ? (
            <motion.div
              key="card-view"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full flex justify-center"
            >
              <StudentProfileCard
                player={player}
                pioneerRank={pioneerRank}
                isCurrentPlayer={isCurrentPlayer}
                currentCosmetics={currentCosmetics}
                onViewAllBadges={() => setActiveView('badges')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="badges-view"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-[370px] bg-gradient-to-b from-[#121520] via-[#0d0f17] to-[#0a0c10] border-2 border-amber-500/40 rounded-3xl p-4 sm:p-5 flex flex-col shadow-2xl max-h-[580px]"
            >
              {/* Header da Galeria */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div>
                  <h4 className="font-mono font-black text-sm text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>GALERIA DE INSÍGNIAS</span>
                  </h4>
                  <p className="text-[10px] font-mono text-zinc-400">
                    Conquistas de {displayName} ({allBadges.length} desbloqueadas)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveView('card')}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-[10px] font-mono hover:text-white transition cursor-pointer border border-zinc-700"
                >
                  ← Voltar
                </button>
              </div>

              {/* Lista Scrollável de Insígnias */}
              <div className="flex flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin max-h-[460px]">
                {allBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-2.5 rounded-2xl border ${badge.borderClass} ${badge.bgClass} flex items-start gap-2.5 transition-all`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-xl shrink-0">
                      {badge.icon}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-black font-mono text-xs ${badge.textClass}`}>
                          {badge.title}
                        </span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-black/40 border border-white/10 text-zinc-400">
                          {badge.rarity}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-zinc-300 font-semibold mt-0.5">
                        {badge.subtitle}
                      </span>

                      <p className="text-[10px] font-mono text-zinc-400 mt-0.5 leading-snug">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
