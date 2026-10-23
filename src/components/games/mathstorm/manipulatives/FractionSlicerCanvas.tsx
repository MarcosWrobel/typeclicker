import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Scissors, Plus, Minus } from 'lucide-react';
import { FractionLevel } from '../mathStormLevels';
import { mathStormAudio } from '../mathStormAudio';

interface FractionSlicerCanvasProps {
  level: FractionLevel;
  currentDenominator: number;
  selectedSlices: number;
  onChangeDenominator: (denom: number) => void;
  onChangeSelectedSlices: (slices: number) => void;
  className?: string;
}

export const FractionSlicerCanvas: React.FC<FractionSlicerCanvasProps> = ({
  level,
  currentDenominator,
  selectedSlices,
  onChangeDenominator,
  onChangeSelectedSlices,
  className = 'w-full min-h-[380px]'
}) => {
  // Valor numérico da fração atual vs fração alvo
  const currentRatio = selectedSlices / currentDenominator;
  const targetRatio = level.targetNumerator / level.targetDenominator;
  const isValueMatched = Math.abs(currentRatio - targetRatio) < 0.001;
  const isDenominatorMatched =
    !level.requiredDenominator || currentDenominator === level.requiredDenominator;
  const isPerfectMatch = isValueMatched && isDenominatorMatched;

  // Coordenadas polares para fatias de torta SVG
  const renderPieSlices = (
    totalSlices: number,
    filledCount: number,
    interactive: boolean,
    onToggleSlice?: (idx: number) => void
  ) => {
    const cx = 130;
    const cy = 130;
    const r = 105;

    return Array.from({ length: totalSlices }).map((_, idx) => {
      const startAngle = (idx * 360) / totalSlices - 90;
      const endAngle = ((idx + 1) * 360) / totalSlices - 90;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);

      const largeArcFlag = 360 / totalSlices > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const isFilled = idx < filledCount;

      return (
        <motion.path
          key={`slice-${totalSlices}-${idx}`}
          d={pathData}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{
            scale: isFilled ? 1 : 0.96,
            opacity: 1
          }}
          whileHover={interactive ? { scale: 1.04 } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={() => interactive && onToggleSlice && onToggleSlice(idx)}
          fill={isFilled ? '#e67e22' : '#faeac4'}
          stroke="#24140b"
          strokeWidth="4"
          className={interactive ? 'cursor-pointer' : ''}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      );
    });
  };

  const handleToggleSlice = (idx: number) => {
    mathStormAudio.playSliceSound();
    if (idx < selectedSlices) {
      // Se clicou numa fatia já selecionada, reduz até ela
      onChangeSelectedSlices(idx);
    } else {
      // Se clicou numa fatia vazia, preenche até ela (+1)
      onChangeSelectedSlices(idx + 1);
    }
  };

  return (
    <div
      className={`relative select-none flex flex-col justify-between overflow-hidden bg-[#faeac4] border-5 border-[#24140b] rounded-3xl p-6 shadow-[0_10px_0_#24140b] ${className}`}
    >
      {/* TEXTURA DE PAPEL VINTAGE 1930s */}
      <div className="absolute inset-0 bg-[radial-gradient(#8c5828_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* PLACA DE STATUS NO TOPO */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pb-4 border-b-3 border-[#24140b]/20">
        <div className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-[#fdf5df] border-4 border-[#24140b] shadow-[0_4px_0_#24140b]">
          <Scissors className="w-6 h-6 text-[#e67e22]" />
          <span className="font-serif font-black text-sm sm:text-base text-[#24140b] uppercase">
            CORTADOR ATUAL: <strong className="text-[#d35400] text-lg">÷{currentDenominator} FATIAS</strong>
          </span>
        </div>

        <motion.div
          animate={{ scale: isPerfectMatch ? [1, 1.06, 1] : 1 }}
          transition={{ duration: 1.2, repeat: isPerfectMatch ? Infinity : 0 }}
          className={`flex items-center gap-2 px-5 py-2 rounded-2xl border-4 border-[#24140b] shadow-[0_4px_0_#24140b] font-serif font-black text-sm sm:text-base uppercase ${
            isPerfectMatch ? 'bg-[#2ecc71] text-[#24140b]' : 'bg-[#ffd95a] text-[#24140b]'
          }`}
        >
          {isPerfectMatch ? (
            <>
              <Sparkles className="w-5 h-5 fill-white text-[#24140b] animate-spin" />
              <span>RECEITA EXATA NA BANDEJA! ({selectedSlices}/{currentDenominator})</span>
            </>
          ) : (
            <span>
              NA BANDEJA: <strong>{selectedSlices} / {currentDenominator}</strong> • META:{' '}
              <strong>{level.targetNumerator} / {level.targetDenominator}</strong>
            </span>
          )}
        </motion.div>
      </div>

      {/* ÁREA CENTRAL: TORTA INTERATIVA + BARRA COMPARADORA DE EQUIVALÊNCIA */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center my-4">
        {/* LADO ESQUERDO: TORTA CARTUNIZADA PARA CLICAR NAS FATIAS */}
        <div className="flex flex-col items-center justify-center bg-[#fdf5df] border-4 border-[#24140b] rounded-3xl p-4 shadow-[0_6px_0_#24140b]">
          <span className="font-serif font-black text-xs sm:text-sm uppercase text-[#7f5326] mb-1">
            CLIQUE NAS FATIAS DA TORTA PARA SERVIR OU RETIRAR:
          </span>

          <div className="relative flex items-center justify-center">
            <svg width="260" height="260" viewBox="0 0 260 260">
              {/* Forma Assadeira Metálica de Fundo */}
              <circle cx="130" cy="130" r="118" fill="#d49742" stroke="#24140b" strokeWidth="5" />
              <circle cx="130" cy="130" r="108" fill="#edd49e" stroke="#24140b" strokeWidth="3" />

              {/* Fatias Interativas */}
              {renderPieSlices(currentDenominator, selectedSlices, true, handleToggleSlice)}

              {/* Centro da Torta */}
              <circle cx="130" cy="130" r="10" fill="#fdf5df" stroke="#24140b" strokeWidth="3" />
            </svg>

            {/* Botões Rápidos +/- Fatia */}
            <div className="flex flex-col gap-3 ml-4">
              <button
                onClick={() => {
                  if (selectedSlices < currentDenominator) {
                    mathStormAudio.playPlaceWeight(1);
                    onChangeSelectedSlices(selectedSlices + 1);
                  }
                }}
                disabled={selectedSlices >= currentDenominator}
                className="w-14 h-14 rounded-2xl bg-[#2ecc71] hover:bg-[#27ae60] disabled:opacity-40 border-4 border-[#24140b] shadow-[0_4px_0_#24140b] active:translate-y-1 active:shadow-none flex items-center justify-center cursor-pointer transition-all"
                title="Adicionar 1 fatia"
              >
                <Plus className="w-8 h-8 text-[#24140b] stroke-[3]" />
              </button>

              <button
                onClick={() => {
                  if (selectedSlices > 0) {
                    mathStormAudio.playRemoveWeight();
                    onChangeSelectedSlices(selectedSlices - 1);
                  }
                }}
                disabled={selectedSlices <= 0}
                className="w-14 h-14 rounded-2xl bg-[#e74c3c] hover:bg-[#c0392b] disabled:opacity-40 border-4 border-[#24140b] shadow-[0_4px_0_#24140b] active:translate-y-1 active:shadow-none flex items-center justify-center cursor-pointer transition-all"
                title="Remover 1 fatia"
              >
                <Minus className="w-8 h-8 text-white stroke-[3]" />
              </button>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: MEDIDOR VISUAL DE EQUIVALÊNCIA (ESTILO BARRAS DE FRAÇÃO MATIFIC) */}
        <div className="flex flex-col justify-center gap-5 bg-[#fdf5df] border-4 border-[#24140b] rounded-3xl p-5 shadow-[0_6px_0_#24140b] h-full">
          <h3 className="font-serif font-black text-base sm:text-lg uppercase text-[#24140b] text-center">
            ⚖️ COMPARADOR DE EQUIVALÊNCIA VISUAL
          </h3>

          {/* Barra 1: Receita Pedida pelo Cliente (Alvo) */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-serif font-black text-sm text-[#7f5326]">
              <span>META DA RECEITA:</span>
              <span className="text-base text-[#24140b]">
                {level.targetNumerator} / {level.targetDenominator}
              </span>
            </div>
            <div className="w-full h-12 rounded-2xl bg-[#faeac4] border-4 border-[#24140b] overflow-hidden flex">
              {Array.from({ length: level.targetDenominator }).map((_, i) => (
                <div
                  key={`target-bar-${i}`}
                  className={`flex-1 h-full border-r-3 last:border-r-0 border-[#24140b] transition-colors ${
                    i < level.targetNumerator ? 'bg-[#9b59b6]' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Barra 2: Sua Bandeja Atual */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-serif font-black text-sm text-[#7f5326]">
              <span>SUA BANDEJA ATUAL:</span>
              <span className="text-base text-[#d35400]">
                {selectedSlices} / {currentDenominator}
              </span>
            </div>
            <div className="w-full h-12 rounded-2xl bg-[#faeac4] border-4 border-[#24140b] overflow-hidden flex">
              {Array.from({ length: currentDenominator }).map((_, i) => (
                <motion.div
                  key={`user-bar-${currentDenominator}-${i}`}
                  onClick={() => handleToggleSlice(i)}
                  className={`flex-1 h-full border-r-3 last:border-r-0 border-[#24140b] cursor-pointer transition-colors ${
                    i < selectedSlices ? 'bg-[#e67e22]' : 'hover:bg-[#e67e22]/20'
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-xs sm:text-sm font-serif font-bold text-[#5c3e21] text-center bg-[#faeac4] py-2 px-3 rounded-xl border-2 border-[#24140b]">
            {isPerfectMatch
              ? '✨ As duas barras têm exatamente o mesmo comprimento! As frações são equivalentes!'
              : level.requiredDenominator && currentDenominator !== level.requiredDenominator
              ? `⚠️ Atenção: Esta missão pede que a torta seja cortada em ÷${level.requiredDenominator} fatias!`
              : 'Dica: Iguale o tamanho da barra laranja ao tamanho da barra roxa!'}
          </p>
        </div>
      </div>
    </div>
  );
};
