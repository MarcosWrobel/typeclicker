import React, { useEffect } from 'react';
import { X, Cpu, RotateCcw, AlertTriangle, Sparkles, Check } from 'lucide-react';
import { GameState } from '../types';
import { formatBytes } from '../utils/formatting';

interface PrestigeModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
  onConfirmPrestige: (newCores: number) => void;
}

export const PrestigeModal: React.FC<PrestigeModalProps> = ({
  isOpen,
  onClose,
  state,
  onConfirmPrestige
}) => {
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

  if (!isOpen) return null;

  // Fórmula de núcleos baseada no total acumulado
  // Exemplo: 2500 bytes = 1 núcleo, 10000 bytes = 2 núcleos, 22500 = 3 núcleos
  const totalCoresEarned = Math.floor(Math.sqrt(state.totalBytesEarned / 2500));
  const newCoresAvailable = Math.max(0, totalCoresEarned - state.prestigeCores);
  const canPrestige = newCoresAvailable > 0;

  const nextCoreThreshold = Math.pow(state.prestigeCores + 1, 2) * 2500;
  const currentTotal = state.totalBytesEarned;

  const currentBonusPercent = state.prestigeCores * 20;
  const nextBonusPercent = (state.prestigeCores + newCoresAvailable) * 20;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#14121d] border border-purple-500/30 rounded-2xl max-w-lg w-full overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-purple-500/20 flex items-center justify-between bg-purple-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Reboot de Núcleo Quântico</h2>
              <p className="text-xs text-purple-300">Sistema de Prestígio Incremental</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Explanation */}
          <div className="bg-[#191526] border border-purple-500/20 p-4 rounded-xl text-xs text-zinc-300 leading-relaxed space-y-2">
            <p className="flex items-center gap-1.5 text-purple-300 font-bold font-mono">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Como funciona o Overclock de Prestígio?
            </p>
            <p>
              Ao reiniciar o sistema, você sincroniza todo o seu aprendizado com a placa-mãe principal, forjando <strong>Núcleos Quânticos</strong> permanentes.
            </p>
            <p className="text-emerald-300 font-semibold">
              Cada Núcleo concede um bônus PERMANENTE de +20% a todos os Bytes gerados (por tecla e automáticos)!
            </p>
          </div>

          {/* Core Status Cards */}
          <div className="grid grid-cols-2 gap-3 font-mono text-center">
            <div className="bg-[#0f0d17] border border-purple-500/20 p-3 rounded-xl">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-sans">Núcleos Atuais</span>
              <span className="text-2xl font-black text-purple-300">{state.prestigeCores}</span>
              <span className="text-[11px] text-purple-400 block mt-0.5">+{currentBonusPercent}% Bônus</span>
            </div>

            <div className="bg-[#0f0d17] border border-purple-500/30 p-3 rounded-xl">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-sans">Novos Núcleos</span>
              <span className={`text-2xl font-black ${canPrestige ? 'text-emerald-400 animate-bounce' : 'text-zinc-500'}`}>
                +{newCoresAvailable}
              </span>
              <span className="text-[11px] text-emerald-400 block mt-0.5">
                {canPrestige ? `Novo Total: +${nextBonusPercent}%` : 'Indisponível ainda'}
              </span>
            </div>
          </div>

          {/* Progress to next core */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Meta para o próximo núcleo:</span>
              <span className="text-purple-300">{formatBytes(currentTotal)} / {formatBytes(nextCoreThreshold)}</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden border border-zinc-700/50">
              <div
                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${Math.min(100, (currentTotal / nextCoreThreshold) * 100)}%`
                }}
              />
            </div>
          </div>

          {/* Warning Banner */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Atenção:</strong> O Reboot redefine seu saldo atual de Bytes e os upgrades de nível 1 a zero, mas <strong>mantém intactos</strong> seus recordes de digitação, WPM e precisão!
            </p>
          </div>

          {/* Action Button */}
          <button
            disabled={!canPrestige}
            onClick={() => onConfirmPrestige(newCoresAvailable)}
            className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              canPrestige
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer active:scale-[0.98]'
                : 'bg-zinc-800 text-zinc-500 border border-zinc-700/60 cursor-not-allowed'
            }`}
          >
            {canPrestige ? <Sparkles className="w-4 h-4 text-amber-300" /> : <RotateCcw className="w-4 h-4" />}
            <span>
              {canPrestige
                ? `Executar Reboot e Resgatar +${newCoresAvailable} Núcleo(s)`
                : `Acumule mais Bytes para desbloquear Núcleos (${formatBytes(nextCoreThreshold - currentTotal)} restantes)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
