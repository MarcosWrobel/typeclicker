import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flag, Undo2 } from 'lucide-react';
import { NumberLineLevel } from '../mathStormLevels';

export interface JumpRecord {
  from: number;
  to: number;
  step: number;
}

interface NumberLineJumperCanvasProps {
  level: NumberLineLevel;
  currentPosition: number;
  jumpHistory: JumpRecord[];
  onUndoJump: () => void;
  className?: string;
}

export const NumberLineJumperCanvas: React.FC<NumberLineJumperCanvasProps> = ({
  level,
  currentPosition,
  jumpHistory,
  onUndoJump,
  className = 'w-full min-h-[360px]'
}) => {
  const { minVal, maxVal, stepTick, targetPosition } = level;
  const range = maxVal - minVal;

  // Converte um valor numérico em coordenada X no SVG (de 60 a 620)
  const valToX = (val: number) => {
    const ratio = (val - minVal) / range;
    return 60 + ratio * 560;
  };

  // Lista de marcos para desenhar na reta
  const ticks: number[] = [];
  for (let v = minVal; v <= maxVal + 0.0001; v += stepTick) {
    ticks.push(Number(v.toFixed(2)));
  }

  const isAtTarget = Math.abs(currentPosition - targetPosition) < 0.001;
  const trainX = valToX(currentPosition);
  const targetX = valToX(targetPosition);

  const formatNum = (n: number) =>
    Number.isInteger(n) ? `${n}` : n.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');

  return (
    <div
      className={`relative select-none flex flex-col justify-between overflow-hidden bg-[#faeac4] border-5 border-[#24140b] rounded-3xl p-6 shadow-[0_10px_0_#24140b] ${className}`}
    >
      {/* TEXTURA DE PAPEL VINTAGE 1930s */}
      <div className="absolute inset-0 bg-[radial-gradient(#8c5828_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* PLACA DE STATUS NO TOPO */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pb-3 border-b-3 border-[#24140b]/20">
        <div className="flex items-center gap-4 px-5 py-2 rounded-2xl bg-[#fdf5df] border-4 border-[#24140b] shadow-[0_4px_0_#24140b]">
          <span className="font-serif font-black text-sm sm:text-base text-[#24140b]">
            POSIÇÃO DO TREM: <strong className="text-[#2980b9] text-lg sm:text-xl">{formatNum(currentPosition)}</strong>
          </span>
          <div className="h-5 w-px bg-[#24140b]/30" />
          <span className="font-serif font-black text-sm sm:text-base text-[#24140b]">
            ESTAÇÃO DESTINO: <strong className="text-[#27ae60] text-lg sm:text-xl">🏁 {formatNum(targetPosition)}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {jumpHistory.length > 0 && (
            <button
              onClick={onUndoJump}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#fdf5df] hover:bg-[#edd49e] border-3 border-[#24140b] shadow-[0_3px_0_#24140b] font-serif font-black text-xs sm:text-sm text-[#24140b] cursor-pointer active:translate-y-0.5"
            >
              <Undo2 className="w-4 h-4" />
              <span>DESFAZER ÚLTIMO SALTO</span>
            </button>
          )}

          <div
            className={`px-4 py-2 rounded-2xl border-4 border-[#24140b] shadow-[0_4px_0_#24140b] font-serif font-black text-xs sm:text-sm uppercase flex items-center gap-1.5 ${
              isAtTarget ? 'bg-[#2ecc71] text-[#24140b]' : 'bg-[#ffd95a] text-[#24140b]'
            }`}
          >
            {isAtTarget ? (
              <>
                <Sparkles className="w-4 h-4 fill-white animate-spin" />
                <span>TREM NA ESTAÇÃO CERTA!</span>
              </>
            ) : (
              <span>DISTÂNCIA RESTANTE: {formatNum(Math.abs(targetPosition - currentPosition))}</span>
            )}
          </div>
        </div>
      </div>

      {/* SVG DA FERROVIA NUMÉRICA COM ARCOS DE SALTO E LOCOMOTIVA CARTUM */}
      <div className="relative z-20 flex-1 flex items-center justify-center my-2">
        <svg viewBox="0 0 680 260" className="w-full h-full max-h-[270px]" preserveAspectRatio="xMidYMid meet">
          {/* Céu / Colinas Suaves de Fundo */}
          <path
            d="M 20 190 Q 170 130 340 190 T 660 190"
            fill="#edd49e"
            stroke="#24140b"
            strokeWidth="3"
            strokeDasharray="6 6"
          />

          {/* 1. ARCOS DOS SALTOS REALIZADOS (ESTILO MATIFIC) */}
          {jumpHistory.map((jmp, idx) => {
            const x1 = valToX(jmp.from);
            const x2 = valToX(jmp.to);
            const midX = (x1 + x2) / 2;
            const dist = Math.abs(x2 - x1);
            const arcHeight = Math.min(95, Math.max(40, dist * 0.45));
            const yBase = 165;
            const ctrlY = yBase - arcHeight;
            const isPositive = jmp.step > 0;

            return (
              <g key={`jump-arc-${idx}`}>
                <path
                  d={`M ${x1} ${yBase} Q ${midX} ${ctrlY} ${x2} ${yBase}`}
                  fill="none"
                  stroke={isPositive ? '#2980b9' : '#c0392b'}
                  strokeWidth="4"
                  strokeDasharray="6 4"
                />
                {/* Etiqueta do valor do salto no topo do arco */}
                <g transform={`translate(${midX}, ${ctrlY + 15})`}>
                  <rect
                    x="-24"
                    y="-14"
                    width="48"
                    height="22"
                    rx="8"
                    fill={isPositive ? '#d6eaf8' : '#fadbd8'}
                    stroke="#24140b"
                    strokeWidth="2.5"
                  />
                  <text
                    x="0"
                    y="1"
                    textAnchor="middle"
                    fontFamily="serif"
                    fontWeight="900"
                    fontSize="12"
                    fill="#24140b"
                  >
                    {jmp.step > 0 ? `+${formatNum(jmp.step)}` : formatNum(jmp.step)}
                  </text>
                </g>
              </g>
            );
          })}

          {/* 2. DORMENTES E TRILHO DE FERRO PRINCIPAL */}
          <line x1="40" y1="190" x2="640" y2="190" stroke="#78472a" strokeWidth="10" strokeLinecap="round" />
          <line x1="40" y1="186" x2="640" y2="186" stroke="#24140b" strokeWidth="5" strokeLinecap="round" />

          {/* 3. MARCADORES E NÚMEROS DA RETA */}
          {ticks.map((tVal, idx) => {
            const x = valToX(tVal);
            const isZero = Math.abs(tVal) < 0.001;
            const isGoal = Math.abs(tVal - targetPosition) < 0.001;
            // Se houver muitos ticks (> 15), exibe o rótulo a cada 2 ticks ou nos especiais
            const showLabel = ticks.length <= 16 || idx % 2 === 0 || isZero || isGoal;

            return (
              <g key={`tick-${tVal}`} transform={`translate(${x}, 186)`}>
                <line
                  x1="0"
                  y1="-10"
                  x2="0"
                  y2="12"
                  stroke="#24140b"
                  strokeWidth={isZero || isGoal ? '4.5' : '3'}
                />
                {showLabel && (
                  <text
                    x="0"
                    y="34"
                    textAnchor="middle"
                    fontFamily="serif"
                    fontWeight="900"
                    fontSize={isZero || isGoal ? '16' : '13'}
                    fill={isGoal ? '#1e8449' : isZero ? '#c0392b' : '#24140b'}
                  >
                    {formatNum(tVal)}
                  </text>
                )}
              </g>
            );
          })}

          {/* 4. BANDEIRA DA ESTAÇÃO DESTINO 🏁 */}
          <g transform={`translate(${targetX}, 180)`}>
            <line x1="0" y1="0" x2="0" y2="-65" stroke="#24140b" strokeWidth="4" />
            <polygon points="0,-65 36,-52 0,-38" fill="#2ecc71" stroke="#24140b" strokeWidth="3" />
            <circle cx="0" cy="-65" r="5" fill="#ffd95a" stroke="#24140b" strokeWidth="2.5" />
          </g>

          {/* 5. LOCOMOTIVA CARTUNIZADA ANOS 1930 (ANIMADA COM SPRING) */}
          <motion.g
            animate={{ x: trainX }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          >
            <g transform="translate(0, 155)">
              {/* Fumaça da chaminé */}
              <circle cx="10" cy="-42" r="7" fill="#fdf5df" stroke="#24140b" strokeWidth="2.5" />
              <circle cx="2" cy="-54" r="9" fill="#fdf5df" stroke="#24140b" strokeWidth="2.5" />

              {/* Chaminé */}
              <polygon points="4,-18 16,-18 19,-34 1,-34" fill="#e67e22" stroke="#24140b" strokeWidth="3" />

              {/* Cabine e Caldeira */}
              <rect x="-24" y="-26" width="24" height="28" rx="4" fill="#c0392b" stroke="#24140b" strokeWidth="3.5" />
              <rect x="0" y="-18" width="22" height="20" rx="5" fill="#2980b9" stroke="#24140b" strokeWidth="3.5" />

              {/* Janelinha com Olhos Estilo Cuphead */}
              <rect x="-18" y="-20" width="12" height="10" rx="2" fill="#fdf5df" stroke="#24140b" strokeWidth="2.5" />
              <circle cx="-11" cy="-15" r="2.5" fill="#24140b" />

              {/* Rodas de Latão */}
              <circle cx="-14" cy="6" r="9" fill="#ffd95a" stroke="#24140b" strokeWidth="3.5" />
              <circle cx="-14" cy="6" r="3" fill="#24140b" />
              <circle cx="11" cy="6" r="8" fill="#ffd95a" stroke="#24140b" strokeWidth="3.5" />
              <circle cx="11" cy="6" r="2.5" fill="#24140b" />
            </g>
          </motion.g>
        </svg>
      </div>
    </div>
  );
};
