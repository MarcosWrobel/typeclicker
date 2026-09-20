import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Play, Shield, Timer, Keyboard, ShoppingBag, Gauge, Lock } from 'lucide-react';
import { CategoryId } from '../types';
import { WORD_CATEGORIES } from '../data/words';
import { isCategoryAllowed } from '../utils/difficulty';

interface PauseOverlayProps {
  isOpen: boolean;
  onResume: () => void;
  studentName?: string;
  selectedCategory?: CategoryId;
  onSelectCategory?: (cat: CategoryId) => void;
  playerRankLevel?: number;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({
  isOpen,
  onResume,
  studentName,
  selectedCategory,
  onSelectCategory,
  playerRankLevel
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Moldura de Alerta Ambiental em Toda a Janela (Sem bloquear cliques na Loja) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 pointer-events-none border-4 border-amber-500/85 shadow-[inset_0_0_100px_rgba(245,158,11,0.25)]"
          >
            {/* Badges de Canto Estilo Arcade */}
            <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-amber-500 text-black text-[11px] font-black font-mono tracking-widest shadow-lg flex items-center gap-1">
              <span>⏸️</span>
              <span>PAUSA ATIVA</span>
            </div>
            <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-md bg-amber-500 text-black text-[11px] font-black font-mono tracking-widest shadow-lg flex items-center gap-1">
              <span>🛒</span>
              <span>LOJA LIBERADA</span>
            </div>
            <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-amber-500 text-black text-[11px] font-black font-mono tracking-widest shadow-lg hidden sm:flex items-center gap-1">
              <span>⏱️</span>
              <span>CADÊNCIA CONGELADA</span>
            </div>
            <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-md bg-amber-500 text-black text-[11px] font-black font-mono tracking-widest shadow-lg hidden sm:flex items-center gap-1">
              <span>🛡️</span>
              <span>COMBO PROTEGIDO</span>
            </div>
          </motion.div>

          {/* Banner Superior de Alta Evidência (Não bloqueia os painéis abaixo) */}
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full bg-gradient-to-r from-amber-950/95 via-amber-900/95 to-amber-950/95 border-b-2 border-amber-500 px-3 sm:px-6 py-2.5 shadow-[0_6px_30px_rgba(245,158,11,0.35)] relative z-20"
          >
            <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                {/* Esquerda: Identificação e Status */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex items-center justify-center flex-shrink-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center shadow-[0_0_18px_rgba(245,158,11,0.7)] font-black">
                      <Pause className="w-5 h-5 fill-current" />
                    </div>
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-black text-amber-300 font-mono tracking-wider flex items-center gap-1.5">
                        <span>JOGO EM PAUSA</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      </span>
                      {studentName && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold truncate max-w-[140px]">
                          {studentName}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-zinc-300 font-mono leading-tight">
                      Cronômetro congelado • Teclado suspenso • <strong className="text-amber-300">🛒 Loja e Dificuldade liberadas para ajuste!</strong>
                    </p>
                  </div>
                </div>

                {/* Direita: Botão de Ação Imediata para Retomar */}
                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={onResume}
                    className="w-full sm:w-auto px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.6)] transition cursor-pointer transform hover:scale-105 active:scale-95 border border-amber-300"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>RETOMAR JOGO</span>
                    <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-normal">
                      <kbd className="font-bold">Esc</kbd>
                    </span>
                  </button>
                </div>
              </div>

              {/* Seletor de Dificuldade durante a Pausa */}
              {onSelectCategory && (
                <div className="pt-2 border-t border-amber-500/30 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-amber-200 text-xs font-mono font-bold">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dificuldade para a retomada:</span>
                    <span className="text-[11px] text-amber-400/80 font-normal hidden sm:inline">
                      (Alterne os níveis livremente na pausa)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    {WORD_CATEGORIES.map((cat) => {
                      const isSelected = cat.id === selectedCategory;
                      const isAllowed = playerRankLevel !== undefined ? isCategoryAllowed(cat.id, playerRankLevel) : true;
                      
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            if (isAllowed) onSelectCategory(cat.id);
                          }}
                          disabled={!isAllowed}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-105'
                              : !isAllowed
                              ? 'bg-black/40 text-red-900/60 border-red-950/40 cursor-not-allowed opacity-50 line-through'
                              : 'bg-black/40 text-amber-200 border-amber-500/30 hover:bg-amber-500/20 hover:text-white hover:border-amber-400'
                          }`}
                          title={!isAllowed ? "Nível de rank alto demais para este aquecimento!" : `${cat.name} (${cat.bonusMultiplier}x Bytes)`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-black animate-pulse' : !isAllowed ? 'bg-red-800' : 'bg-amber-400'}`} />
                          <span>{cat.name}</span>
                          <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${isSelected ? 'bg-black/20 text-black' : 'bg-amber-500/15 text-amber-300'}`}>
                            {cat.bonusMultiplier}x
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
