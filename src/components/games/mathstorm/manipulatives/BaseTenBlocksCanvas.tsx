import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Hammer, Zap } from 'lucide-react';
import { BaseTenLevel } from '../mathStormLevels';

interface BaseTenBlocksCanvasProps {
  level: BaseTenLevel;
  hundreds: number;
  tens: number;
  units: number;
  onRemoveHundred: () => void;
  onRemoveTen: () => void;
  onRemoveUnit: () => void;
  onFuseTenUnits: () => void;
  onBreakOneTen: () => void;
  className?: string;
}

export const BaseTenBlocksCanvas: React.FC<BaseTenBlocksCanvasProps> = ({
  level,
  hundreds,
  tens,
  units,
  onRemoveHundred,
  onRemoveTen,
  onRemoveUnit,
  onFuseTenUnits,
  onBreakOneTen,
  className = 'w-full min-h-[380px]'
}) => {
  const currentTotal = hundreds * 100 + tens * 10 + units;
  const isValueMatched = currentTotal === level.targetValue;
  const isCanonical = !level.requireCanonicalForm || (units < 10 && tens < 10);
  const isPerfectMatch = isValueMatched && isCanonical;

  return (
    <div
      className={`relative select-none flex flex-col justify-between overflow-hidden bg-[#faeac4] border-5 border-[#24140b] rounded-3xl p-6 shadow-[0_10px_0_#24140b] ${className}`}
    >
      {/* TEXTURA DE PAPEL VINTAGE 1930s */}
      <div className="absolute inset-0 bg-[radial-gradient(#8c5828_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* PLACA DE STATUS NO TOPO */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pb-4 border-b-3 border-[#24140b]/20">
        <div className="flex items-center gap-4 px-5 py-2 rounded-2xl bg-[#fdf5df] border-4 border-[#24140b] shadow-[0_4px_0_#24140b]">
          <span className="font-serif font-black text-sm sm:text-base text-[#24140b]">
            VALOR NA BANCADA: <strong className="text-[#8e44ad] text-xl">{currentTotal}</strong>
          </span>
          <div className="h-5 w-px bg-[#24140b]/30" />
          <span className="font-serif font-black text-sm sm:text-base text-[#24140b]">
            META DO PEDIDO: <strong className="text-[#27ae60] text-xl">{level.targetValue}</strong>
          </span>
        </div>

        {/* BOTÕES ESPECIAIS DE AGRUPAR (FUSÃO) E DESAGRUPAR (QUEBRA) */}
        <div className="flex flex-wrap items-center gap-3">
          {units >= 10 && (
            <motion.button
              initial={{ scale: 0.85 }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              onClick={onFuseTenUnits}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#2ecc71] hover:bg-[#27ae60] border-4 border-[#24140b] shadow-[0_4px_0_#24140b] font-serif font-black text-xs sm:text-sm text-[#24140b] cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-[#ffd95a]" />
              <span>FUNDIR 10 UNIDADES → 1 DEZENA!</span>
            </motion.button>
          )}

          {tens >= 1 && (
            <button
              onClick={onBreakOneTen}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#e67e22] hover:bg-[#d35400] border-4 border-[#24140b] shadow-[0_4px_0_#24140b] font-serif font-black text-xs sm:text-sm text-white cursor-pointer active:translate-y-0.5"
            >
              <Hammer className="w-4 h-4" />
              <span>QUEBRAR 1 DEZENA → 10 UNIDADES</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 COLUNAS DE VALOR POSICIONAL (CENTENAS | DEZENAS | UNIDADES) */}
      <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-4 my-4 flex-1">
        {/* COLUNA 1: CENTENAS (100) */}
        <div className="bg-[#fdf5df] border-4 border-[#24140b] rounded-3xl p-4 flex flex-col justify-between shadow-[0_6px_0_#24140b]">
          <div className="flex items-center justify-between border-b-2 border-[#24140b]/20 pb-2 mb-3">
            <span className="font-serif font-black text-sm uppercase text-[#7f5326]">CENTENAS (×100)</span>
            <span className="px-3 py-0.5 rounded-full bg-[#9b59b6] border-2 border-[#24140b] text-white font-serif font-black text-sm">
              {hundreds} ({hundreds * 100})
            </span>
          </div>

          <div className="flex-1 flex flex-wrap items-center justify-center gap-3 min-h-[160px] p-2">
            <AnimatePresence>
              {Array.from({ length: hundreds }).map((_, i) => (
                <motion.button
                  key={`hundred-${i}`}
                  initial={{ scale: 0, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.08 }}
                  onClick={onRemoveHundred}
                  title="Clique para remover 1 Centena (100)"
                  className="group relative w-22 h-22 rounded-2xl bg-[#9b59b6] border-4 border-[#24140b] shadow-[0_5px_0_#24140b] grid grid-cols-5 grid-rows-5 p-1 gap-0.5 cursor-pointer"
                >
                  {Array.from({ length: 25 }).map((__, cellIdx) => (
                    <div key={cellIdx} className="bg-white/25 rounded-[2px]" />
                  ))}
                  <span className="absolute inset-0 flex items-center justify-center font-serif font-black text-xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    100
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
            {hundreds === 0 && (
              <span className="font-serif text-xs font-bold text-[#7f5326]/50 uppercase">
                Nenhuma Centena
              </span>
            )}
          </div>
        </div>

        {/* COLUNA 2: DEZENAS (10) */}
        <div className="bg-[#fdf5df] border-4 border-[#24140b] rounded-3xl p-4 flex flex-col justify-between shadow-[0_6px_0_#24140b]">
          <div className="flex items-center justify-between border-b-2 border-[#24140b]/20 pb-2 mb-3">
            <span className="font-serif font-black text-sm uppercase text-[#7f5326]">DEZENAS (×10)</span>
            <span className="px-3 py-0.5 rounded-full bg-[#ffd95a] border-2 border-[#24140b] text-[#24140b] font-serif font-black text-sm">
              {tens} ({tens * 10})
            </span>
          </div>

          <div className="flex-1 flex flex-wrap items-center justify-center gap-2.5 min-h-[160px] p-2">
            <AnimatePresence>
              {Array.from({ length: tens }).map((_, i) => (
                <motion.button
                  key={`ten-${i}`}
                  initial={{ scale: 0, y: -25 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.1, y: -4 }}
                  onClick={onRemoveTen}
                  title="Clique para remover 1 Barra de Dezena (10)"
                  className="group relative w-9 h-28 rounded-xl bg-[#ffd95a] border-4 border-[#24140b] shadow-[0_5px_0_#24140b] flex flex-col justify-between p-0.5 cursor-pointer"
                >
                  {Array.from({ length: 5 }).map((__, segIdx) => (
                    <div key={segIdx} className="w-full h-3 border-b-2 border-[#24140b]/30" />
                  ))}
                  <span className="absolute inset-0 flex items-center justify-center font-serif font-black text-sm text-[#24140b] bg-[#ffd95a]/80 rounded-lg m-auto h-7 w-7 border border-[#24140b]">
                    10
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
            {tens === 0 && (
              <span className="font-serif text-xs font-bold text-[#7f5326]/50 uppercase">
                Nenhuma Dezena
              </span>
            )}
          </div>
        </div>

        {/* COLUNA 3: UNIDADES (1) */}
        <div
          className={`bg-[#fdf5df] border-4 rounded-3xl p-4 flex flex-col justify-between shadow-[0_6px_0_#24140b] transition-colors ${
            units >= 10 ? 'border-[#e67e22] bg-[#fef5e7]' : 'border-[#24140b]'
          }`}
        >
          <div className="flex items-center justify-between border-b-2 border-[#24140b]/20 pb-2 mb-3">
            <span className="font-serif font-black text-sm uppercase text-[#7f5326]">UNIDADES (×1)</span>
            <span
              className={`px-3 py-0.5 rounded-full border-2 border-[#24140b] font-serif font-black text-sm ${
                units >= 10 ? 'bg-[#e67e22] text-white animate-bounce' : 'bg-[#2ecc71] text-[#24140b]'
              }`}
            >
              {units} {units >= 10 ? '(AGRUPAR!)' : ''}
            </span>
          </div>

          <div className="flex-1 flex flex-wrap items-center justify-center gap-2 min-h-[160px] p-2">
            <AnimatePresence>
              {Array.from({ length: units }).map((_, i) => (
                <motion.button
                  key={`unit-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.15 }}
                  onClick={onRemoveUnit}
                  title="Clique para remover 1 Unidade"
                  className="w-11 h-11 rounded-xl bg-[#2ecc71] border-3 border-[#24140b] shadow-[0_4px_0_#24140b] flex items-center justify-center font-serif font-black text-base text-[#24140b] cursor-pointer"
                >
                  1
                </motion.button>
              ))}
            </AnimatePresence>
            {units === 0 && (
              <span className="font-serif text-xs font-bold text-[#7f5326]/50 uppercase">
                Nenhuma Unidade
              </span>
            )}
          </div>
        </div>
      </div>

      {/* AVISO DE REAGRUPAMENTO SE HOUVER >= 10 UNIDADES */}
      {isValueMatched && !isCanonical && (
        <div className="relative z-20 p-3 rounded-2xl bg-[#ffd95a] border-3 border-[#24140b] text-center font-serif font-black text-sm text-[#24140b]">
          ⚡ O valor total ({currentTotal}) está certo, mas há <strong>{units} unidades soltas</strong>! Clique em{' '}
          <strong>"FUNDIR 10 UNIDADES → 1 DEZENA"</strong> no topo para organizar a carga!
        </div>
      )}
    </div>
  );
};
