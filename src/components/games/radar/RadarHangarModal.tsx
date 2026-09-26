import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  X, 
  Shield, 
  Cpu, 
  Zap, 
  BatteryCharging, 
  Flame, 
  Check, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { 
  HANGAR_UPGRADES, 
  RadarPermanentUpgrades 
} from '../../../services/radarEngine';
import { radarAudio } from '../../../services/radarAudio';

interface RadarHangarModalProps {
  isOpen: boolean;
  onClose: () => void;
  scrap: number;
  upgrades: RadarPermanentUpgrades;
  onBuyUpgrade: (id: keyof RadarPermanentUpgrades, cost: number) => void;
  onResetUpgrades: () => void;
}

export const RadarHangarModal: React.FC<RadarHangarModalProps> = ({
  isOpen,
  onClose,
  scrap,
  upgrades,
  onBuyUpgrade,
  onResetUpgrades
}) => {
  if (!isOpen) return null;

  const getUpgradeIcon = (id: keyof RadarPermanentUpgrades) => {
    switch (id) {
      case 'hull_armor':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'shield_battery':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'reactor_core':
        return <BatteryCharging className="w-5 h-5 text-amber-400" />;
      case 'energy_siphon':
        return <Zap className="w-5 h-5 text-purple-400" />;
      case 'cold_start':
        return <Flame className="w-5 h-5 text-rose-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handleBuy = (id: keyof RadarPermanentUpgrades, cost: number) => {
    if (scrap >= cost) {
      radarAudio.playHangarPurchase();
      onBuyUpgrade(id, cost);
    } else {
      radarAudio.playAlarm();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.92, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 15 }}
          className="w-full max-w-3xl max-h-[90vh] bg-[#0c1017] border-2 border-emerald-500/40 p-5 sm:p-7 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.2)] flex flex-col justify-between overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-emerald-500/20 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/40 flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5" />
                  HANGAR DE ENGENHARIA CIBERNÉTICA
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline">
                  [Meta-Progressão Permanente]
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Upgrades Permanentes da Base
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Gaste a Sucata Tecnológica recuperada dos destroços para fortalecer sua base em todas as partidas futuras.
              </p>
            </div>

            {/* Saldo de Sucata & Fechar */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <span className="text-base">⚙️</span>
                <div className="flex flex-col items-end font-mono">
                  <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider">Sucata Total</span>
                  <span className="text-sm font-black text-amber-400">{scrap.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                title="Fechar Hangar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Upgrades List (Scrollable) */}
          <div className="overflow-y-auto pr-1 space-y-3 my-2 max-h-[55vh]">
            {HANGAR_UPGRADES.map((cfg) => {
              const currentLvl = upgrades[cfg.id] || 0;
              const isMax = currentLvl >= cfg.maxLevel;
              const nextCost = isMax ? 0 : cfg.costs[currentLvl];
              const canAfford = !isMax && scrap >= nextCost;

              return (
                <div
                  key={cfg.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isMax
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : canAfford
                      ? 'bg-zinc-900/90 border-zinc-700/80 hover:border-emerald-500/50'
                      : 'bg-zinc-900/40 border-zinc-800/80 opacity-80'
                  }`}
                >
                  {/* Left: Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-700/50 shrink-0">
                      {getUpgradeIcon(cfg.id)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-white">{cfg.title}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {cfg.tagline}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 mt-0.5 max-w-md">
                        {cfg.description}
                      </p>

                      {/* Level Pips */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] font-mono text-zinc-400 mr-1">
                          NÍVEL {currentLvl}/{cfg.maxLevel}:
                        </span>
                        {Array.from({ length: cfg.maxLevel }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-3.5 h-1.5 rounded-sm transition-colors ${
                              idx < currentLvl
                                ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                                : 'bg-zinc-700/50'
                            }`}
                          />
                        ))}
                        <span className="text-[11px] font-mono font-bold text-emerald-400 ml-2">
                          {cfg.getBonusText(currentLvl)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Buy Button / Max Badge */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {isMax ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-black flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        NÍVEL MÁXIMO
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBuy(cfg.id, nextCost)}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded-xl font-mono text-xs font-black flex items-center gap-2 transition-all ${
                          canAfford
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 hover:brightness-110 shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 cursor-pointer'
                            : 'bg-zinc-800/80 text-zinc-500 border border-zinc-700/50 cursor-not-allowed'
                        }`}
                      >
                        <span>APRIMORAR</span>
                        <span className="px-1.5 py-0.5 rounded bg-black/30 text-[11px]">
                          ⚙️ {nextCost}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t border-emerald-500/20 pt-4 mt-2">
            <button
              type="button"
              onClick={onResetUpgrades}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/60 text-zinc-400 hover:text-rose-300 hover:border-rose-500/40 text-xs font-mono flex items-center gap-1.5 transition-colors"
              title="Redefinir upgrades e reembolsar 100% da sucata gasta"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Redistribuir Sucata</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold transition-colors"
            >
              FECHAR E VOLTAR
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
