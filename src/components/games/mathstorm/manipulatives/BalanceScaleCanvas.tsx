import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { WeightItem } from '../mathStormLevels';

interface BalanceScaleCanvasProps {
  leftItems: WeightItem[];
  rightItems: WeightItem[];
  onRemoveItem: (side: 'left' | 'right', itemId: string) => void;
  className?: string;
}

export const BalanceScaleCanvas: React.FC<BalanceScaleCanvasProps> = ({
  leftItems,
  rightItems,
  onRemoveItem,
  className = 'w-full h-[400px] sm:h-[430px]'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pesos totais
  const leftTotalWeight = leftItems.reduce((acc, it) => acc + it.value, 0);
  const rightTotalWeight = rightItems.reduce((acc, it) => acc + it.value, 0);

  // Diferença de peso: física angular elástica de desenho animado (máx 15 graus)
  const weightDiff = rightTotalWeight - leftTotalWeight; // > 0: prato direito cai
  const maxTiltAngle = 14;
  const rawTilt = weightDiff * 2.2;
  const tiltAngle = Math.max(-maxTiltAngle, Math.min(maxTiltAngle, rawTilt));

  const isBalanced = leftTotalWeight === rightTotalWeight;

  return (
    <div
      ref={containerRef}
      className={`relative select-none flex items-center justify-center overflow-hidden bg-[#faeac4] border-5 border-[#24140b] rounded-3xl p-6 shadow-[0_10px_0_#24140b] ${className}`}
    >
      {/* TEXTURA DE PAPEL VINTAGE E RUÍDO 1930s */}
      <div className="absolute inset-0 bg-[radial-gradient(#8c5828_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-[#d49742]/10 mix-blend-multiply pointer-events-none" />

      {/* PLACA INDICADORA DE EQUILÍBRIO CENTRAL (EXPANDIDA E ACESSÍVEL) */}
      <motion.div
        animate={{
          scale: isBalanced ? [1, 1.05, 1] : 1
        }}
        transition={{ duration: 1.2, repeat: isBalanced ? Infinity : 0, ease: 'easeInOut' }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-[#fdf5df] border-4 border-[#24140b] shadow-[0_5px_0_#24140b]"
      >
        <span className="font-serif text-sm sm:text-base text-[#24140b] font-black">
          PRATO ESQ: <strong className="text-emerald-700 text-lg sm:text-xl">{leftTotalWeight} kg</strong>
        </span>

        <div className="h-6 w-px bg-[#24140b]/30" />

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#ffd95a] border-3 border-[#24140b] text-[#24140b] font-serif text-xs sm:text-sm font-black uppercase tracking-wider">
          {isBalanced ? (
            <>
              <Sparkles className="w-5 h-5 fill-[#e67e22] text-[#24140b] animate-spin" />
              <span>EQUILÍBRIO PERFEITO!</span>
            </>
          ) : weightDiff > 0 ? (
            <span>⚖️ DIREITA MAIS PESADA (+{weightDiff}kg)</span>
          ) : (
            <span>⚖️ ESQUERDA MAIS PESADA (+{Math.abs(weightDiff)}kg)</span>
          )}
        </div>

        <div className="h-6 w-px bg-[#24140b]/30" />

        <span className="font-serif text-sm sm:text-base text-[#24140b] font-black">
          PRATO DIR: <strong className="text-emerald-700 text-lg sm:text-xl">{rightTotalWeight} kg</strong>
        </span>
      </motion.div>

      {/* SVG DA BALANÇA CARTUNIZADA VINTAGE */}
      <svg
        viewBox="0 0 680 400"
        className="w-full h-full max-h-[420px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="cuphead-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#24140b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#24140b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Sombra da Base no Piso */}
        <ellipse cx="340" cy="375" rx="180" ry="18" fill="url(#cuphead-shadow)" />

        {/* 2. Base e Coluna Central Suporte */}
        <path
          d="M 240 370 C 240 340 300 335 340 335 C 380 335 440 340 440 370 Z"
          fill="#d49742"
          stroke="#24140b"
          strokeWidth="6"
        />
        {/* Haste Vertical Cartum */}
        <polygon
          points="324,355 356,355 350,130 330,130"
          fill="#c68a4c"
          stroke="#24140b"
          strokeWidth="5"
        />

        {/* Arco de Grau / Mostrador Superior */}
        <path
          d="M 290 85 A 55 55 0 0 1 390 85"
          fill="none"
          stroke="#24140b"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <line x1="340" y1="76" x2="340" y2="94" stroke="#d97706" strokeWidth="5" strokeLinecap="round" />

        {/* Articulação / Pivô Central */}
        <circle cx="340" cy="130" r="18" fill="#ffd95a" stroke="#24140b" strokeWidth="5" />
        <circle cx="340" cy="130" r="8" fill="#24140b" />

        {/* 3. CONJUNTO MÓVEL DA BALANÇA */}
        <motion.g
          animate={{ rotate: tiltAngle }}
          transition={{
            type: 'spring',
            stiffness: 90,
            damping: 12,
            mass: 1.4
          }}
          style={{ originX: '340px', originY: '130px' }}
        >
          {/* Ponteiro Indicador da Balança */}
          <polygon
            points="336,130 344,130 340,65"
            fill={isBalanced ? '#27ae60' : '#e67e22'}
            stroke="#24140b"
            strokeWidth="3.5"
          />

          {/* Viga Horizontal Principal Cartunizada */}
          <rect
            x="80"
            y="120"
            width="520"
            height="20"
            rx="10"
            fill="#ffd95a"
            stroke="#24140b"
            strokeWidth="5"
          />

          {/* Pivôs nas pontas da viga */}
          <circle cx="115" cy="130" r="11" fill="#e67e22" stroke="#24140b" strokeWidth="4" />
          <circle cx="565" cy="130" r="11" fill="#e67e22" stroke="#24140b" strokeWidth="4" />

          {/* ================= PRATO ESQUERDO ================= */}
          <motion.g
            animate={{ rotate: -tiltAngle }}
            transition={{
              type: 'spring',
              stiffness: 90,
              damping: 12,
              mass: 1.4
            }}
            style={{ originX: '115px', originY: '130px' }}
          >
            <line x1="115" y1="130" x2="35" y2="265" stroke="#24140b" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="115" y1="130" x2="195" y2="265" stroke="#24140b" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="115" y1="130" x2="115" y2="268" stroke="#24140b" strokeWidth="3" strokeDasharray="5 5" />

            <g transform="translate(115, 268)">
              <path
                d="M -85 0 C -65 40 65 40 85 0 Z"
                fill="#fdf5df"
                stroke="#24140b"
                strokeWidth="5"
              />
              <ellipse cx="0" cy="0" rx="85" ry="15" fill="#edd49e" stroke="#24140b" strokeWidth="4" />
              <ellipse cx="0" cy="3" rx="74" ry="10" fill="#24140b" fillOpacity="0.15" />
            </g>
          </motion.g>

          {/* ================= PRATO DIREITO ================= */}
          <motion.g
            animate={{ rotate: -tiltAngle }}
            transition={{
              type: 'spring',
              stiffness: 90,
              damping: 12,
              mass: 1.4
            }}
            style={{ originX: '565px', originY: '130px' }}
          >
            <line x1="565" y1="130" x2="485" y2="265" stroke="#24140b" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="565" y1="130" x2="645" y2="265" stroke="#24140b" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="565" y1="130" x2="565" y2="268" stroke="#24140b" strokeWidth="3" strokeDasharray="5 5" />

            <g transform="translate(565, 268)">
              <path
                d="M -85 0 C -65 40 65 40 85 0 Z"
                fill="#fdf5df"
                stroke="#24140b"
                strokeWidth="5"
              />
              <ellipse cx="0" cy="0" rx="85" ry="15" fill="#edd49e" stroke="#24140b" strokeWidth="4" />
              <ellipse cx="0" cy="3" rx="74" ry="10" fill="#24140b" fillOpacity="0.15" />
            </g>
          </motion.g>
        </motion.g>
      </svg>

      {/* ELEMENTOS TÁTEIS EXPANDIDOS COM TEXTO GRANDE E ALTO CONTRASTE */}
      {/* PRATO ESQUERDO */}
      <motion.div
        animate={{
          y: tiltAngle * 4.4
        }}
        transition={{
          type: 'spring',
          stiffness: 90,
          damping: 12,
          mass: 1.4
        }}
        className="absolute w-52 min-h-32 flex flex-wrap items-end justify-center gap-2.5 p-2 pointer-events-auto z-20"
        style={{
          left: '8%',
          bottom: '21%'
        }}
      >
        <AnimatePresence>
          {leftItems.map((item) => (
            <motion.button
              key={item.id}
              layout
              initial={{ scale: 0, y: -40, rotate: -10 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0, y: -30, opacity: 0 }}
              whileHover={{ scale: 1.15, y: -5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              onClick={() => onRemoveItem('left', item.id)}
              title="Clique para remover este peso do prato esquerdo"
              className={`group relative flex items-center justify-center font-serif font-black select-none cursor-pointer border-4 border-[#24140b] shadow-[0_5px_0_#24140b] ${
                item.type === 'unknown'
                  ? 'w-18 h-18 rounded-3xl bg-[#9b59b6] text-white text-3xl'
                  : 'w-15 h-15 rounded-2xl bg-[#2ecc71] text-[#24140b] text-base sm:text-lg'
              }`}
            >
              <div className="absolute top-1.5 left-1.5 right-1.5 h-2.5 rounded-t-xl bg-white/40 pointer-events-none" />

              <span>{item.label || (item.type === 'unknown' ? 'x' : `${item.value}kg`)}</span>

              <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#e74c3c] border-3 border-[#24140b] text-white text-sm font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                ×
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* PRATO DIREITO */}
      <motion.div
        animate={{
          y: -tiltAngle * 4.4
        }}
        transition={{
          type: 'spring',
          stiffness: 90,
          damping: 12,
          mass: 1.4
        }}
        className="absolute w-52 min-h-32 flex flex-wrap items-end justify-center gap-2.5 p-2 pointer-events-auto z-20"
        style={{
          right: '8%',
          bottom: '21%'
        }}
      >
        <AnimatePresence>
          {rightItems.map((item) => (
            <motion.button
              key={item.id}
              layout
              initial={{ scale: 0, y: -40, rotate: 10 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0, y: -30, opacity: 0 }}
              whileHover={{ scale: 1.15, y: -5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              onClick={() => onRemoveItem('right', item.id)}
              title="Clique para remover este peso do prato direito"
              className={`group relative flex items-center justify-center font-serif font-black select-none cursor-pointer border-4 border-[#24140b] shadow-[0_5px_0_#24140b] ${
                item.type === 'unknown'
                  ? 'w-18 h-18 rounded-3xl bg-[#9b59b6] text-white text-3xl'
                  : 'w-15 h-15 rounded-2xl bg-[#2ecc71] text-[#24140b] text-base sm:text-lg'
              }`}
            >
              <div className="absolute top-1.5 left-1.5 right-1.5 h-2.5 rounded-t-xl bg-white/40 pointer-events-none" />

              <span>{item.label || (item.type === 'unknown' ? 'x' : `${item.value}kg`)}</span>

              <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-[#e74c3c] border-3 border-[#24140b] text-white text-sm font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                ×
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
