import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  onBuyUpgrade: (upgrade: UpgradeDef) => boolean | void;
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
  const [holdingUpgradeId, setHoldingUpgradeId] = useState<string | null>(null);
  const [holdLevelsBought, setHoldLevelsBought] = useState<number>(0);
  const [floatingAlerts, setFloatingAlerts] = useState<FloatingUpgradeAlert[]>([]);

  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef<boolean>(false);
  const activeHoldingUpgradeRef = useRef<UpgradeDef | null>(null);
  const currentButtonRectRef = useRef<DOMRect | null>(null);
  const hasHandledPointerDownRef = useRef<boolean>(false);
  const stateRef = useRef(state);
  stateRef.current = state;

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

  const stopHolding = useCallback(() => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearTimeout(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    isHoldingRef.current = false;
    activeHoldingUpgradeRef.current = null;
    setHoldingUpgradeId(null);
    setHoldLevelsBought(0);
  }, []);

  // Cleanup on unmount or pause
  useEffect(() => {
    return () => {
      stopHolding();
    };
  }, [stopHolding]);

  // Window-level pointerup / pointercancel ensures holding always releases reliably
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isHoldingRef.current || holdTimeoutRef.current || holdIntervalRef.current) {
        stopHolding();
      }
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [stopHolding]);

  const executePurchase = useCallback((upgrade: UpgradeDef, buttonRect?: DOMRect) => {
    const count = stateRef.current.upgrades[upgrade.id] || 0;
    const cost = getUpgradeCost(upgrade, count);
    if (stateRef.current.bytes < cost) {
      return false;
    }

    // Dispara a compra no estado global
    const success = onBuyUpgrade(upgrade);
    if (success === false) return false;

    const nextCount = count + 1;
    const isMilestone = nextCount % 5 === 0;

    // Marca o ID para animação de pulso no card
    setLastBoughtId(upgrade.id);
    setTimeout(() => {
      setLastBoughtId((curr) => (curr === upgrade.id ? null : curr));
    }, 400);

    // Dispara o efeito visual customizado equipado a cada compra (com boost em marcos de 5 em 5)
    if (buttonRect && (isMilestone || !isHoldingRef.current)) {
      triggerUpgradePurchaseVfx(equippedAnimation, buttonRect, isMilestone);
    }

    // Cria ou atualiza tag flutuante pedagógica
    setFloatingAlerts((prev) => {
      const existing = prev.find((a) => a.upgradeId === upgrade.id);
      if (existing && isHoldingRef.current) {
        return prev.map((a) =>
          a.id === existing.id
            ? {
                ...a,
                text: `Nv. ${nextCount}!`,
                detail: upgrade.type === 'passive' ? `+${upgrade.value}/s` : `+${upgrade.value}/tecla`
              }
            : a
        );
      }

      const newAlert: FloatingUpgradeAlert = {
        id: Date.now() + Math.random(),
        upgradeId: upgrade.id,
        text: `Nv. ${nextCount}!`,
        detail: upgrade.type === 'passive' ? `+${upgrade.value}/s` : `+${upgrade.value}/tecla`,
        type: upgrade.type
      };
      return [...prev.slice(-3), newAlert];
    });

    setTimeout(() => {
      setFloatingAlerts((prev) => prev.filter((a) => a.upgradeId !== upgrade.id || a.id > Date.now() - 700));
    }, 800);

    return true;
  }, [onBuyUpgrade, equippedAnimation]);

  const startHolding = (upgrade: UpgradeDef, e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return; // Apenas botão primário (mouse esquerdo / touch)
    e.preventDefault();

    stopHolding();

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    currentButtonRectRef.current = rect;
    activeHoldingUpgradeRef.current = upgrade;
    hasHandledPointerDownRef.current = true;

    // Compra imediata do primeiro nível com feedback instantâneo
    const bought = executePurchase(upgrade, rect);
    if (!bought) {
      return;
    }

    let boughtInSession = 1;
    setHoldLevelsBought(1);

    // Timeout inicial para detecção de clique pressionado e segurado
    holdTimeoutRef.current = setTimeout(() => {
      isHoldingRef.current = true;
      setHoldingUpgradeId(upgrade.id);

      let intervalMs = 130;
      let tickCount = 0;

      const scheduleNextTick = () => {
        holdIntervalRef.current = setTimeout(() => {
          if (!isHoldingRef.current || !activeHoldingUpgradeRef.current) {
            stopHolding();
            return;
          }

          tickCount++;
          const targetUpgrade = activeHoldingUpgradeRef.current;
          const rect = currentButtonRectRef.current || undefined;
          const success = executePurchase(targetUpgrade, rect);

          if (!success) {
            stopHolding();
            return;
          }

          boughtInSession++;
          setHoldLevelsBought(boughtInSession);

          // Rampa de aceleração gradual conforme o usuário segura por mais tempo
          if (tickCount > 15) {
            intervalMs = 45;
          } else if (tickCount > 8) {
            intervalMs = 65;
          } else if (tickCount > 3) {
            intervalMs = 95;
          }

          scheduleNextTick();
        }, intervalMs);
      };

      scheduleNextTick();
    }, 260); // 260ms para engatar a compra contínua
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Previne duplo disparo caso o pointerdown já tenha executado a compra inicial
    if (hasHandledPointerDownRef.current) {
      hasHandledPointerDownRef.current = false;
      e.preventDefault();
      return;
    }
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

        {/* Aviso de Pausa Compacto / Dica de Compra Contínua */}
        {isPaused ? (
          <div className="mt-1.5 px-2 py-1 rounded bg-amber-500/15 border border-amber-400/40 text-amber-200 text-[10px] font-mono flex items-center justify-between">
            <span className="font-bold flex items-center gap-1 truncate">
              <span>🛒</span>
              <span>Pausa: Loja Liberada!</span>
            </span>
            <span className="text-[9px] text-zinc-400">Sem dreno</span>
          </div>
        ) : (
          <div className="mt-1 px-1.5 py-0.5 rounded bg-zinc-900/60 border border-zinc-800/60 text-[9px] font-mono text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="text-amber-400">⚡</span>
              <span>Segure o clique para compra contínua</span>
            </span>
            <span className="text-emerald-400 text-[8px] font-bold uppercase tracking-wider">Turbo</span>
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

              {/* Lado Direito: Botão de Compra Compacto com Suporte a Pressionar e Segurar */}
              <motion.button
                disabled={!canAfford && holdingUpgradeId !== upgrade.id}
                onPointerDown={(e) => startHolding(upgrade, e)}
                onPointerUp={stopHolding}
                onPointerLeave={stopHolding}
                onPointerCancel={stopHolding}
                onClick={handleButtonClick}
                whileTap={canAfford ? { scale: 0.94 } : {}}
                className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg font-mono text-xs font-bold flex items-center gap-1 flex-shrink-0 transition-all cursor-pointer select-none relative overflow-hidden ${
                  holdingUpgradeId === upgrade.id
                    ? 'bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.6)] ring-2 ring-amber-300 scale-105'
                    : canAfford
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)] active:scale-95'
                    : 'bg-zinc-800/50 text-zinc-500 border border-zinc-800 cursor-not-allowed'
                }`}
                title={
                  canAfford
                    ? `Comprar ${upgrade.name} por ${formatBytes(cost)} (Segure para compra contínua)`
                    : `Necessário ${formatBytes(cost)} (Saldo insuficiente)`
                }
              >
                {holdingUpgradeId === upgrade.id ? (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-950 animate-bounce" />
                    <span className="font-black text-amber-950 text-[11px]">+{holdLevelsBought}</span>
                  </>
                ) : (
                  <>
                    <span className="text-[11px]">🪙</span>
                    <span className={canAfford ? 'text-amber-200' : 'text-zinc-500'}>
                      {formatBytes(cost)}
                    </span>
                  </>
                )}
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
