import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { AnimationEffectId } from '../types/cosmetics';
import { ANIMATION_CONFIGS } from '../constants/cosmeticsCatalog';
import { triggerLevelUpCelebrationVfx } from '../services/fxEngine';

interface LevelUpOverlayProps {
  data: { level: number; title: string; badge: string } | null;
  equippedAnimation?: AnimationEffectId;
}

export const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({
  data,
  equippedAnimation = 'confetti_classic'
}) => {
  useEffect(() => {
    if (data) {
      triggerLevelUpCelebrationVfx(equippedAnimation);
    }
  }, [data, equippedAnimation]);

  const animConfig = ANIMATION_CONFIGS[equippedAnimation as AnimationEffectId] || ANIMATION_CONFIGS.confetti_classic;

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0, x: -60, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.85, transition: { duration: 0.3 } }}
          transition={{ type: 'spring', bounce: 0.35, duration: 0.6 }}
          className="fixed bottom-5 left-5 z-50 pointer-events-none w-80 sm:w-88 max-w-[calc(100vw-2.5rem)]"
        >
          <div
            className="relative overflow-hidden bg-gradient-to-r from-[#171c2a]/95 via-[#131722]/95 to-[#0e111a]/95 border-2 rounded-2xl p-3.5 backdrop-blur-md transition-all"
            style={{
              borderColor: animConfig.accentColor,
              boxShadow: `0 8px 32px ${animConfig.glowColor}`
            }}
          >
            <div className="flex items-center gap-3">
              {/* Badge Icon do Nível */}
              <motion.div
                animate={{ rotate: [-4, 4, -4], scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-3xl select-none flex-shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                {data.badge}
              </motion.div>

              {/* Informações do Nível */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 text-amber-400 font-mono font-bold uppercase tracking-wider text-[10px]">
                    <ArrowUp className="w-3 h-3 animate-bounce" />
                    <span>Subiu de Nível!</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded text-zinc-300 bg-zinc-800/80 border border-zinc-700/50 flex items-center gap-1">
                    <span>{animConfig.icon}</span>
                    <span className="hidden sm:inline">{animConfig.name}</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-white leading-tight truncate mt-0.5">
                  Nível {data.level}
                </h3>
                
                <p className="text-xs font-semibold text-amber-300/90 truncate">
                  {data.title}
                </p>
              </div>
            </div>

            {/* Barra de Progresso Animada no Rodapé do Card */}
            <div className="w-full h-1 bg-zinc-800/80 rounded-full mt-2.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3.5, ease: 'linear' }}
                className="h-full"
                style={{ backgroundColor: animConfig.accentColor }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

