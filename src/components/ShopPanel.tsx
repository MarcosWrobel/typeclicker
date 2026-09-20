import React, { useState } from 'react';
import {
  Keyboard,
  Zap,
  Sparkles,
  Cpu,
  Terminal,
  Bot,
  Server,
  HardDrive,
  Activity,
  Layers,
  RotateCcw,
  HandMetal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, UpgradeDef } from '../types';
import { AnimationEffectId } from '../types/cosmetics';
import { UPGRADES, getUpgradeCost } from '../data/upgrades';
import { formatBytes } from '../utils/formatting';
import { triggerUpgradePurchaseVfx } from '../services/fxEngine';

interface ShopPanelProps {
  state: GameState;
  onBuyUpgrade: (upgrade: UpgradeDef) => void;
  onOpenPrestige: () => void;
  isPaused?: boolean;
  equippedAnimation?: AnimationEffectId;
}

interface FloatingUpgradeAlert {
  id: number;
  upgradeId: string;
  text: string;
  detail: string;
  type: 'active' | 'passive';
}

export const ShopPanel: React.FC<ShopPanelProps> = ({
  state,
  onBuyUpgrade,
  onOpenPrestige,
  isPaused = false,
  equippedAnimation = 'confetti_classic'
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'passive'>('all');
  const [lastBoughtId, setLastBoughtId] = useState<string | null>(null);
  const [floatingAlerts, setFloatingAlerts] = useState<FloatingUpgradeAlert[]>([]);

  const getUpgradeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Keyboard': return <Keyboard className="w-3.5 h-3.5 text-sky-400" />;
      case 'Zap': return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      case 'HandMetal': return <HandMetal className="w-3.5 h-3.5 text-purple-400" />;
      case 'Cpu': return <Cpu className="w-3.5 h-3.5 text-purple-400" />;
      case 'Terminal': return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Bot': return <Bot className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Server': return <Server className="w-3.5 h-3.5 text-blue-400" />;
      case 'HardDrive': return <HardDrive className="w-3.5 h-3.5 text-teal-400" />;
      default: return <Activity className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const handleUpgradeClick = (upgrade: UpgradeDef, e: React.MouseEvent<HTMLButtonElement>) => {
    const count = state.upgrades[upgrade.id] || 0;
    const cost = getUpgradeCost(upgrade, count);
    if (state.bytes < cost) return;

    // Dispara a compra no estado global
    onBuyUpgrade(upgrade);

    // Marca o ID para animação de pulso no card
    setLastBoughtId(upgrade.id);
    setTimeout(() => {
      setLastBoughtId((curr) => (curr === upgrade.id ? null : curr));
    }, 500);

    // Dispara o efeito visual customizado equipado a cada compra (com boost em marcos de 5 em 5)
    const rect = e.currentTarget.getBoundingClientRect();
    const isMilestone = (count + 1) % 5 === 0;
    triggerUpgradePurchaseVfx(equippedAnimation, rect, isMilestone);


    // Cria tag flutuante pedagógica
    const newAlert: FloatingUpgradeAlert = {
      id: Date.now() + Math.random(),
      upgradeId: upgrade.id,
      text: `Nv. ${count + 1}!`,
      detail: upgrade.type === 'passive' ? `+${upgrade.value}/s` : `+${upgrade.value}/tecla`,
      type: upgrade.type
    };

    setFloatingAlerts((prev) => [...prev, newAlert]);
    setTimeout(() => {
      setFloatingAlerts((prev) => prev.filter((a) => a.id !== newAlert.id));
    }, 800);
  };

  const filteredUpgrades = UPGRADES.filter((u) => {
    if (filter === 'active') return u.type === 'active';
    if (filter === 'passive') return u.type === 'passive';
    return true;
  });

  const totalUpgradesCount = Object.values(state.upgrades).reduce(
    (a: number, b: number) => a + b,
    0
  );

  return (
    <aside className={`w-full h-full flex flex-col min-w-0 bg-[#11141a]/95 transition-all ${
      isPaused ? 'ring-1 ring-amber-500/40' : ''
    }`}>
      {/* Topo Compacto: Título + Filtros Rápidos */}
      <div className="px-2.5 py-2 border-b border-white/10 bg-[#141720]/90 flex-shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <h2 className="font-black text-xs uppercase tracking-wider text-zinc-100 font-mono flex items-center gap-1">
              <span>Upgrades</span>
              <span className="text-amber-400 text-[10px]">⚡</span>
            </h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-600/40">
            {totalUpgradesCount} Upgrades
          </span>
        </div>

        {/* Abas Rápidas Ultra-Compactas */}
        <div className="grid grid-cols-3 gap-1 p-0.5 bg-[#0b0d11] rounded-lg border border-zinc-800/80 text-[10px] font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`py-0.5 rounded text-center transition-all ${
              filter === 'all'
                ? 'bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/40 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Todos (10)
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`py-0.5 rounded text-center transition-all ${
              filter === 'active'
                ? 'bg-sky-500/25 text-sky-300 font-bold border border-sky-500/40 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tecla (5)
          </button>
          <button
            onClick={() => setFilter('passive')}
            className={`py-0.5 rounded text-center transition-all ${
              filter === 'passive'
                ? 'bg-amber-500/25 text-amber-300 font-bold border border-amber-500/40 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Auto (5)
          </button>
        </div>

        {/* Aviso de Pausa Compacto */}
        {isPaused && (
          <div className="mt-1.5 px-2 py-1 rounded bg-amber-500/15 border border-amber-400/40 text-amber-200 text-[10px] font-mono flex items-center justify-between">
            <span className="font-bold flex items-center gap-1 truncate">
              <span>🛒</span>
              <span>Pausa: Loja Liberada!</span>
            </span>
            <span className="text-[9px] text-zinc-400">Sem dreno</span>
          </div>
        )}
      </div>

      {/* Lista Compacta de Upgrades (Alta Densidade, Sem Necessidade de Rolagem Extensiva) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-1.5 sm:p-2 space-y-1.5 scrollbar-thin">
        {filteredUpgrades.map((upgrade) => {
          const count = state.upgrades[upgrade.id] || 0;
          const cost = getUpgradeCost(upgrade, count);
          const canAfford = state.bytes >= cost;
          const isPassive = upgrade.type === 'passive';
          const isJustBought = lastBoughtId === upgrade.id;

          // Badges flutuantes desse card
          const cardAlerts = floatingAlerts.filter((a) => a.upgradeId === upgrade.id);

          return (
            <div
              key={upgrade.id}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all duration-150 flex items-center justify-between gap-2 relative overflow-hidden ${
                isJustBought
                  ? 'ring-2 ring-emerald-400 border-emerald-400 bg-emerald-950/50'
                  : canAfford
                  ? 'bg-[#161a23] border-[#2b3342] hover:border-emerald-500/60 shadow-xs'
                  : 'bg-[#12141c]/70 border-[#1a1e26] opacity-75'
              }`}
              title={`${upgrade.name} (${upgrade.flavor})`}
            >
              {/* Notificação Flutuante de Compra */}
              <AnimatePresence>
                {cardAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 5, scale: 0.8 }}
                    animate={{ opacity: 1, y: -12, scale: 1.05 }}
                    exit={{ opacity: 0, y: -22, scale: 0.9 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`absolute right-2 top-1 z-30 pointer-events-none px-2 py-0.5 rounded-full text-[9px] font-mono font-black shadow-lg flex items-center gap-1 border ${
                      alert.type === 'active'
                        ? 'bg-sky-500 text-white border-sky-300'
                        : 'bg-amber-500 text-black border-amber-300'
                    }`}
                  >
                    <span>{alert.text}</span>
                    <span>{alert.detail}</span>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Lado Esquerdo: Ícone + Título + Status */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border shadow-inner ${
                  isPassive
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : 'bg-sky-500/15 border-sky-500/30 text-sky-300'
                }`}>
                  {getUpgradeIcon(upgrade.icon)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 leading-none">
                    <h3 className="font-bold text-xs text-zinc-100 truncate">
                      {upgrade.name}
                    </h3>
                    <span className="text-[9px] font-mono font-black text-amber-300 bg-zinc-800/90 px-1 py-0.2 rounded border border-amber-500/30 flex-shrink-0">
                      Nv.{count}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono mt-0.5 leading-none">
                    <span className={`font-bold ${isPassive ? 'text-amber-400' : 'text-sky-400'}`}>
                      {isPassive ? `+${upgrade.value}/s` : `+${upgrade.value}/tecla`}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400 text-[9px] truncate">
                      {isPassive ? 'Automático' : 'Por Tecla'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lado Direito: Botão de Compra Compacto */}
              <motion.button
                disabled={!canAfford}
                whileTap={canAfford ? { scale: 0.92 } : {}}
                onClick={(e) => handleUpgradeClick(upgrade, e)}
                className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg font-mono text-xs font-bold flex items-center gap-1 flex-shrink-0 transition-all cursor-pointer select-none ${
                  canAfford
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-zinc-800/50 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                }`}
                title={canAfford ? `Comprar ${upgrade.name} por ${formatBytes(cost)}` : `Necessário ${formatBytes(cost)} (Saldo insuficiente)`}
              >
                <span className="text-[11px]">🪙</span>
                <span className={canAfford ? 'text-amber-200' : 'text-zinc-500'}>
                  {formatBytes(cost)}
                </span>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Rodapé Compacto: Barra de Reboot Quântico */}
      <div className="p-1.5 border-t border-white/10 bg-[#0d0f14] flex-shrink-0">
        <button
          onClick={onOpenPrestige}
          className="w-full py-1.5 px-2.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold flex items-center justify-between transition cursor-pointer"
          title="Reboot Quântico de Núcleo (+20% de bônus permanente por núcleo)"
        >
          <span className="flex items-center gap-1.5 text-[11px]">
            <RotateCcw className="w-3 h-3 text-purple-400 animate-spin" style={{ animationDuration: '12s' }} />
            <span>Reboot Quântico</span>
          </span>
          <span className="text-[10px] bg-purple-900/60 text-purple-200 px-1.5 py-0.2 rounded border border-purple-500/40 font-bold">
            {state.prestigeCores} Núcleos
          </span>
        </button>
      </div>
    </aside>
  );
};
