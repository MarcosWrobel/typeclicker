import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Sparkles, X, Coins, Layers } from 'lucide-react';
import { AchievementDef } from '../types/achievements';
import { formatBytes } from '../utils/formatting';

interface AchievementToastProps {
  achievement: AchievementDef | null;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onDismiss
}) => {
  useEffect(() => {
    if (!achievement) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);

    return () => clearTimeout(timer);
  }, [achievement, onDismiss]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9, transition: { duration: 0.25 } }}
          transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
          className="fixed top-16 right-4 sm:right-6 z-50 max-w-[calc(100vw-2rem)] w-96 pointer-events-auto"
        >
          <div
            onClick={onDismiss}
            className="relative overflow-hidden bg-gradient-to-br from-[#1c1917]/95 via-[#141210]/95 to-[#0c0a09]/95 border-2 border-amber-400/80 rounded-2xl p-4 shadow-[0_0_35px_rgba(245,158,11,0.35)] backdrop-blur-md cursor-pointer group transition-transform hover:scale-[1.02]"
          >
            {/* Feixe de luz decorativo */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 p-2 text-zinc-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </div>

            <div className="flex items-start gap-3.5">
              {/* Badge Icon com pulso luminoso */}
              <motion.div
                animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-700/20 border border-amber-400/60 flex items-center justify-center text-3xl select-none flex-shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              >
                {achievement.icon}
              </motion.div>

              {/* Detalhes da Conquista */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold uppercase tracking-wider text-[10px]">
                  <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span>Conquista Desbloqueada!</span>
                </div>

                <h4 className="text-base font-black text-white leading-tight truncate mt-0.5 group-hover:text-amber-300 transition-colors">
                  {achievement.title}
                </h4>

                <p className="text-xs text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                  {achievement.description}
                </p>

                {/* Recompensas Concedidas */}
                <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                  {achievement.reward.bytes !== undefined && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-[11px] font-mono font-black text-emerald-400 shadow-sm">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      +{formatBytes(achievement.reward.bytes)}
                    </span>
                  )}
                  {achievement.reward.levelTokens !== undefined && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-950/80 border border-amber-500/50 text-[11px] font-mono font-black text-amber-300 shadow-sm">
                      <Coins className="w-3 h-3 text-amber-400" />
                      +{achievement.reward.levelTokens} {achievement.reward.levelTokens === 1 ? 'Ficha' : 'Fichas'}
                    </span>
                  )}
                  {achievement.reward.quantumFragments !== undefined && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-[11px] font-mono font-black text-cyan-300 shadow-sm">
                      <Layers className="w-3 h-3 text-cyan-400" />
                      +{achievement.reward.quantumFragments} Frag.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Barra de Progresso de Temporizador no Rodapé */}
            <div className="w-full h-1 bg-zinc-800/80 rounded-full mt-3 overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4.5, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
