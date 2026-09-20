import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Zap, Lock, ArrowRight, ShieldCheck, RefreshCw, Cpu, Award } from 'lucide-react';
import { formatBytes, formatNumber } from '../utils/formatting';
import { audioSynthesizer } from '../services/audioSynthesizer';
import { triggerLevelUpCelebrationVfx } from '../services/fxEngine';

interface QuantumConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerRankLevel: number;
  currentBytes: number;
  quantumFragments: number;
  onConvertBytes: (bytesSpent: number, fragmentsGained: number) => void;
  isAdmin?: boolean;
}

// Custo base por Fragmento Quântico: 100 GB (107.374.182.400 Bytes)
// Nível 100 requer ~8 TB. Com 100 GB por Fragmento, 1 TB = 10 Fragmentos.
export const QUANTUM_FRAGMENT_BASE_COST = 100 * 1024 * 1024 * 1024; // 100 GB em bytes

export const QuantumConverterModal: React.FC<QuantumConverterModalProps> = ({
  isOpen,
  onClose,
  playerRankLevel,
  currentBytes,
  quantumFragments,
  onConvertBytes,
  isAdmin = false
}) => {
  const isUnlocked = playerRankLevel >= 100 || isAdmin;
  const maxAffordableFragments = Math.floor(currentBytes / QUANTUM_FRAGMENT_BASE_COST);

  // Opções pré-definidas de conversão
  const packageOptions = [
    { count: 1, label: '1 Fragmento', bytesCost: QUANTUM_FRAGMENT_BASE_COST, icon: '🌌' },
    { count: 5, label: '5 Fragmentos', bytesCost: 5 * QUANTUM_FRAGMENT_BASE_COST, icon: '✨' },
    { count: 10, label: '10 Fragmentos', bytesCost: 10 * QUANTUM_FRAGMENT_BASE_COST, icon: '🔮' },
    { count: 25, label: '25 Fragmentos', bytesCost: 25 * QUANTUM_FRAGMENT_BASE_COST, icon: '💎' },
  ];

  const [selectedCount, setSelectedCount] = useState<number>(1);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTotalCost = selectedCount * QUANTUM_FRAGMENT_BASE_COST;
  const canAfford = currentBytes >= currentTotalCost;

  const handleExecuteConversion = (count: number) => {
    if (!isUnlocked) return;
    const cost = count * QUANTUM_FRAGMENT_BASE_COST;
    if (currentBytes < cost) return;

    setIsConverting(true);
    audioSynthesizer.playUnlockJingle();
    triggerLevelUpCelebrationVfx('supernova_burst');

    setTimeout(() => {
      onConvertBytes(cost, count);
      setIsConverting(false);
      setSuccessMessage(`+${count} Fragmento(s) Quântico(s) forjado(s) com sucesso!`);
      setTimeout(() => setSuccessMessage(null), 3500);
    }, 400);
  };

  const handleConvertMax = () => {
    if (maxAffordableFragments <= 0) return;
    handleExecuteConversion(maxAffordableFragments);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-[#0b0c16] border-2 border-cyan-500/50 rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-[0_0_60px_rgba(6,182,212,0.25)] flex flex-col text-zinc-100 overflow-hidden relative"
        >
          {/* Efeito de brilho de fundo estelar */}
          <div className="absolute -top-32 -right-32 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-cyan-950/40 flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                  <div className="w-full h-full bg-[#0d0f1a] rounded-[14px] flex items-center justify-center text-xl">
                    🌌
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white font-mono tracking-wide flex items-center gap-1.5">
                    FORJA QUÂNTICA
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                    3ª Moeda • Nível 100
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-sans">
                  Conversão de Bytes Excedentes em <strong className="text-cyan-300">Fragmentos Quânticos</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer border border-zinc-700/50"
              title="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Bar */}
          <div className="bg-[#101322] border-b border-zinc-800/80 px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
            {/* Saldo de Bytes */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Saldo Atual:</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                {formatBytes(currentBytes)}
              </span>
            </div>

            {/* Saldo de Fragmentos Quânticos */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Fragmentos Quânticos:</span>
              <span className="flex items-center gap-1 text-cyan-300 font-black bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                <span>🌌</span>
                <span>{formatNumber(quantumFragments)}</span>
              </span>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 relative z-10 custom-scrollbar flex-1">
            {/* Bloqueio de Nível (se < 100 e não for admin) */}
            {!isUnlocked ? (
              <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 text-2xl">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-amber-300 text-sm sm:text-base font-mono">
                  SISTEMA DE CONVERSÃO RESTRITO
                </h3>
                <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                  A <strong>Forja Quântica</strong> é uma tecnologia de ponta desbloqueada exclusivamente para as 
                  <strong className="text-amber-300"> Lendas do Colégio Leopoldina (Nível 100)</strong>.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-amber-500/30 text-xs font-mono text-amber-200">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Seu Nível Atual: <strong>{playerRankLevel} / 100</strong></span>
                </div>
              </div>
            ) : (
              <>
                {/* Banner Informativo sobre a Moeda de Endgame */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-indigo-950/30 to-purple-950/30 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold font-mono text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span>O que são Fragmentos Quânticos (🌌)?</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Ao atingir a maestria máxima da digitação (Nível 100), seus Bytes adicionais podem ser condensados em 
                    <strong> Matéria Quântica</strong>. Essa moeda lendária servirá para adquirir cosméticos cósmicos e prestígios especiais na Loja do Laboratório!
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-cyan-200/90">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" /> Taxa de Conversão: <strong>100 GB = 1 🌌</strong>
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-emerald-300">Sem limite de forja</span>
                  </div>
                </div>

                {/* Mensagem de Sucesso */}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{successMessage}</span>
                  </motion.div>
                )}

                {/* Grade de Pacotes de Conversão Rápida */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                      Selecione a Quantidade para Forjar:
                    </span>
                    {maxAffordableFragments > 0 && (
                      <button
                        type="button"
                        onClick={handleConvertMax}
                        className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                      >
                        Converter Máximo Possível ({maxAffordableFragments} 🌌)
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {packageOptions.map((pkg) => {
                      const isSelected = selectedCount === pkg.count;
                      const hasFunds = currentBytes >= pkg.bytesCost;

                      return (
                        <button
                          key={pkg.count}
                          type="button"
                          onClick={() => setSelectedCount(pkg.count)}
                          className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.4)] ring-1 ring-cyan-400/50'
                              : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                          } ${!hasFunds ? 'opacity-60' : ''}`}
                        >
                          <div className="text-2xl mb-1.5">{pkg.icon}</div>
                          <div className="font-mono font-black text-sm text-white">
                            +{pkg.count} 🌌
                          </div>
                          <div className="text-[10px] font-mono text-zinc-400 mt-1">
                            {formatBytes(pkg.bytesCost)}
                          </div>

                          {isSelected && (
                            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Caixa de Resumo e Conversão Selecionada */}
                <div className="p-4 rounded-2xl bg-[#0e111d] border border-cyan-500/30 space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Entrada (Bytes a Consumir):</span>
                    <span className={`font-bold ${canAfford ? 'text-amber-400' : 'text-rose-400'}`}>
                      -{formatBytes(currentTotalCost)}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-3 py-1 text-cyan-400">
                    <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <ArrowRight className="w-4 h-4 text-zinc-500" />
                    <span className="text-base font-black text-cyan-300">
                      +{selectedCount} Fragmento{selectedCount > 1 ? 's' : ''} Quântico{selectedCount > 1 ? 's' : ''} 🌌
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800">
                    <span className="text-zinc-400">Saldo Restante pós-forja:</span>
                    <span className="text-zinc-200">
                      {formatBytes(Math.max(0, currentBytes - currentTotalCost))}
                    </span>
                  </div>

                  {/* Botão de Ação */}
                  <button
                    type="button"
                    disabled={!canAfford || isConverting}
                    onClick={() => handleExecuteConversion(selectedCount)}
                    className={`w-full py-3 px-4 rounded-xl font-mono font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      canAfford && !isConverting
                        ? 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-[0_0_25px_rgba(6,182,212,0.5)] transform hover:scale-[1.01] active:scale-[0.99]'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                    }`}
                  >
                    {isConverting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                        <span>FORJANDO MATÉRIA QUÂNTICA...</span>
                      </>
                    ) : canAfford ? (
                      <>
                        <span>🌌 FORJAR {selectedCount} FRAGMENTO{selectedCount > 1 ? 'S' : ''} QUÂNTICO{selectedCount > 1 ? 'S' : ''}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>BYTES INSUFICIENTES (FALTAM {formatBytes(currentTotalCost - currentBytes)})</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer Informativo */}
          <div className="p-3 sm:p-4 border-t border-zinc-800/80 bg-[#090b14] text-center text-[11px] font-mono text-zinc-500">
            <span>🛡️ Laboratório de Informática • Colégio Estadual Leopoldina Bittencourt Pedroso</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
