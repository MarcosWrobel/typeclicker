import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { RadarUpgrade } from '../../../services/radarEngine';
import { radarAudio } from '../../../services/radarAudio';
import { HexBadge, getRadarIcon } from './RadarIcons';

interface RadarUpgradesModalProps {
  isOpen: boolean;
  wave: number;
  cards: RadarUpgrade[];
  onSelectUpgrade: (upgrade: RadarUpgrade) => void;
}

export const RadarUpgradesModal: React.FC<RadarUpgradesModalProps> = ({
  isOpen,
  wave,
  cards,
  onSelectUpgrade
}) => {
  if (!isOpen) return null;

  const handleSelect = (upgrade: RadarUpgrade) => {
    radarAudio.playUpgradeSelected();
    onSelectUpgrade(upgrade);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-4xl bg-[#12151c] border-2 border-emerald-500/50 p-6 sm:p-8 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col items-center"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              ONDA {wave} CONCLUÍDA
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white text-center tracking-tight mt-1 mb-2">
            Escolha um Módulo Cibernético
          </h2>
          <p className="text-sm text-zinc-400 text-center max-w-md mb-6">
            Instale um protocolo militar na sua base de radar para aprimorar suas chances de sobrevivência nas próximas ondas.
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6">
            {cards.map((upgrade, idx) => {
              const isEpic = upgrade.rarity === 'epic';
              const isRare = upgrade.rarity === 'rare';

              const borderStyle = isEpic
                ? 'border-amber-400 hover:border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                : isRare
                ? 'border-purple-500/60 hover:border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                : 'border-emerald-500/50 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]';

              const badgeColor = isEpic
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : isRare
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';

              return (
                <motion.div
                  key={upgrade.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(upgrade)}
                  className={`bg-zinc-900/90 border-2 ${borderStyle} p-5 rounded-2xl flex flex-col justify-between transition-all cursor-pointer group`}
                >
                  <div>
                    {/* Rarity & Icon */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase border ${badgeColor}`}>
                        {upgrade.rarity === 'epic' ? 'ÉPICO' : upgrade.rarity === 'rare' ? 'RARO' : 'COMUM'}
                      </span>
                      <HexBadge rarity={upgrade.rarity} size={48}>
                        {getRadarIcon(upgrade.icon, { size: 22, color: 'currentColor' })}
                      </HexBadge>
                    </div>

                    <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                      {upgrade.title}
                    </h3>
                    <p className="text-xs font-mono text-zinc-400 mb-3">
                      {upgrade.tagline}
                    </p>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {upgrade.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono font-bold text-emerald-400 group-hover:text-emerald-300">
                    <span>INSTALAR</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center text-xs text-zinc-500 font-mono">
            Pressione uma das cartas para continuar a simulação
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
