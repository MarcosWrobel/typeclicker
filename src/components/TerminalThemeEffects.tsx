import React from 'react';
import { motion } from 'motion/react';
import { TerminalThemeId } from '../types/cosmetics';

interface TerminalThemeEffectsProps {
  themeId: TerminalThemeId;
  isTyping?: boolean;
}

export const TerminalThemeEffects: React.FC<TerminalThemeEffectsProps> = ({
  themeId,
  isTyping = false,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0">
      {/* 1. MATRIX RAIN EFFECT */}
      {themeId === 'matrix' && (
        <div className="absolute inset-0 opacity-25">
          {/* Colunas verticais de código caindo */}
          <div className="absolute inset-0 flex justify-around text-[10px] font-mono text-emerald-400 select-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="flex flex-col opacity-60"
                initial={{ y: -100 }}
                animate={{ y: ['0%', '100%'] }}
                transition={{
                  duration: 4 + (i % 4) * 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.4,
                }}
              >
                <span>0101</span>
                <span>BYTE</span>
                <span>LEOP</span>
                <span>1010</span>
                <span>LAB</span>
                <span>CODE</span>
                <span>ROOT</span>
              </motion.div>
            ))}
          </div>
          {/* Brilho verde de fósforo na base */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-emerald-500/10 to-transparent" />
        </div>
      )}

      {/* 2. DRACULA MIST EFFECT */}
      {themeId === 'dracula' && (
        <div className="absolute inset-0">
          <motion.div
            className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-purple-600/15 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Névoa gótica sutil */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-black/20" />
        </div>
      )}

      {/* 3. AMBER CRT VINTAGE SCANLINE & FLICKER */}
      {themeId === 'amber' && (
        <div className="absolute inset-0">
          {/* Linha horizontal de varredura CRT que viaja verticalmente */}
          <motion.div
            className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-amber-400/10 to-transparent pointer-events-none"
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          />
          {/* Grade de fósforo e vinheta âmbar */}
          <div className="absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(0deg,#000,#000_2px,transparent_2px,transparent_4px)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(245,158,11,0.06)_100%)]" />
        </div>
      )}

      {/* 4. CYBERPUNK NEON GLITCH & CIRCUITS */}
      {themeId === 'cyberpunk' && (
        <div className="absolute inset-0">
          {/* Circuito neon superior esquerdo */}
          <svg className="absolute top-0 left-0 w-24 h-24 opacity-40 text-cyan-400" viewBox="0 0 100 100" fill="none">
            <path d="M0 20 L40 20 L60 40 L60 70" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="60" cy="70" r="2.5" fill="currentColor" />
          </svg>
          {/* Circuito neon inferior direito */}
          <svg className="absolute bottom-0 right-0 w-24 h-24 opacity-40 text-yellow-400" viewBox="0 0 100 100" fill="none">
            <path d="M100 80 L60 80 L40 60 L40 30" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="40" cy="30" r="2.5" fill="currentColor" />
          </svg>
          {/* Pulso de energia nas bordas */}
          <motion.div
            className="absolute inset-0 border border-cyan-500/30 rounded-2xl"
            animate={{ opacity: isTyping ? [0.4, 0.9, 0.4] : [0.2, 0.5, 0.2] }}
            transition={{ duration: isTyping ? 0.25 : 2, repeat: Infinity }}
          />
        </div>
      )}

      {/* 5. MONOKAI CODE FLOATING TOKENS */}
      {themeId === 'monokai' && (
        <div className="absolute inset-0 opacity-20 flex justify-between px-6 text-xs font-mono select-none">
          {['{ ; }', '<code />', 'const x =', 'fn() =>', 'return !0', '[ 0, 1 ]'].map((token, i) => (
            <motion.div
              key={i}
              className={`font-bold ${i % 2 === 0 ? 'text-lime-400' : 'text-pink-400'}`}
              initial={{ y: 220 }}
              animate={{ y: [-20, 220] }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.8,
              }}
            >
              {token}
            </motion.div>
          ))}
        </div>
      )}

      {/* 6. SYNTHWAVE PERSPECTIVE RETRO GRID */}
      {themeId === 'synthwave' && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Pôr do sol retrô difuso ao fundo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-gradient-to-t from-pink-500/20 via-purple-600/10 to-transparent rounded-t-full blur-xl" />
          
          {/* Grade 3D em perspectiva no chão do terminal */}
          <div className="absolute inset-x-0 bottom-0 h-28 opacity-30 [perspective:200px]">
            <motion.div
              className="w-full h-full border-t border-pink-500/60 bg-[linear-gradient(to_right,rgba(244,63,94,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,63,94,0.3)_1px,transparent_1px)] [background-size:24px_16px]"
              style={{ transform: 'rotateX(55deg)', transformOrigin: 'bottom' }}
              animate={{ backgroundPositionY: ['0px', '32px'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
      )}

      {/* 7. SOLARIZED HARMONIC WAVES */}
      {themeId === 'solarized_dark' && (
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
            <motion.path
              d="M0 100 Q 150 70 300 100 T 600 100 L 600 200 L 0 200 Z"
              fill="#2aa198"
              fillOpacity="0.15"
              animate={{
                d: [
                  "M0 100 Q 150 70 300 100 T 600 100 L 600 200 L 0 200 Z",
                  "M0 100 Q 150 130 300 100 T 600 100 L 600 200 L 0 200 Z",
                  "M0 100 Q 150 70 300 100 T 600 100 L 600 200 L 0 200 Z",
                ]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </div>
      )}

      {/* 8. NORDIC POLAR FROST & SNOW */}
      {themeId === 'nordic_ice' && (
        <div className="absolute inset-0 opacity-30">
          {/* Flocos de gelo geométricos caindo */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-sky-200 rounded-full shadow-[0_0_6px_#88c0d0]"
              style={{ left: `${(i * 10) + 4}%` }}
              initial={{ y: -10 }}
              animate={{
                y: [0, 240],
                x: [0, i % 2 === 0 ? 12 : -12, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 4 + (i % 3) * 1.5,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.35,
              }}
            />
          ))}
          {/* Reflexo de aurora polar no topo */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-sky-400/10 via-teal-400/5 to-transparent blur-md" />
        </div>
      )}

      {/* 9. LAVA MAGMA EMBERS */}
      {themeId === 'lava_terminal' && (
        <div className="absolute inset-0">
          {/* Brasas subindo */}
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full shadow-[0_0_8px_#ea580c]"
              style={{ left: `${(i * 11) + 6}%` }}
              initial={{ y: 220 }}
              animate={{
                y: [220, -10],
                x: [0, (i % 2 === 0 ? 8 : -8), 0],
                opacity: [0, 0.9, 0],
                scale: [0.6, 1.2, 0.3],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                ease: 'easeOut',
                delay: i * 0.4,
              }}
            />
          ))}
          {/* Calor vulcânico na base */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-orange-600/15 via-red-600/5 to-transparent"
            animate={{ opacity: isTyping ? [0.3, 0.7, 0.3] : [0.2, 0.4, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      )}

      {/* 10. GOLDEN LUXURY SPARKLES */}
      {themeId === 'golden_luxury' && (
        <div className="absolute inset-0">
          {/* Partículas de pó de ouro cintilantes */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-[0_0_8px_#eab308]"
              style={{
                left: `${(i * 8) + 5}%`,
                top: `${(i * 7) + 10}%`,
              }}
              animate={{
                scale: [0.5, 1.4, 0.5],
                opacity: [0.2, 0.9, 0.2],
                y: [0, -12, 0],
              }}
              transition={{
                duration: 2.2 + (i % 3) * 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}
          {/* Borda áurea real com brilho sutil */}
          <div className="absolute inset-0 border border-yellow-500/20 rounded-2xl shadow-[inset_0_0_20px_rgba(234,179,8,0.1)]" />
        </div>
      )}

      {/* 11. LABORATÓRIO STEALTH CLI */}
      {themeId === 'stealth_mono' && (
        <div className="absolute inset-0">
          {/* Linha de status do terminal Leopoldina / Laboratório */}
          <div className="absolute top-2 right-4 flex items-center gap-1.5 opacity-30 text-[10px] font-mono text-[#87cf3e]">
            <span>lab@leopoldina:~$</span>
            <span className="w-1.5 h-3 bg-[#87cf3e] animate-pulse" />
          </div>
          {/* Linhas de terminal monocromáticas sutis */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#87cf3e_1px,transparent_1px)] [background-size:12px_12px]" />
        </div>
      )}

      {/* 12. TEMAS QUÂNTICOS / ENDGAME */}
      {themeId === 'infinite_void' && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_50%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.18),transparent_60%)]"
            animate={{ opacity: [0.35, 0.75, 0.35], scale: [1, 1.08, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-20 w-20 rounded-full border border-violet-300/40 bg-violet-400/10 blur-sm"
              style={{ left: `${(i * 7) % 100}%`, top: `${(i * 11) % 100}%` }}
              animate={{
                x: [0, (i % 2 === 0 ? 18 : -18), 0],
                y: [0, (i % 3 === 0 ? -20 : 20), 0],
                scale: [0.9, 1.25, 0.9],
                opacity: [0.2, 0.7, 0.2],
              }}
              transition={{ duration: 4 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
            />
          ))}
        </div>
      )}

      {themeId === 'gear_second' && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -inset-x-8 bottom-0 h-28 bg-gradient-to-t from-amber-500/10 via-red-500/10 to-transparent"
            animate={{ opacity: [0.25, 0.7, 0.25] }}
            transition={{ duration: 2.8, repeat: Infinity }}
          />
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-2 w-24 h-0.5 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent"
              style={{ left: `${i * 10}%` }}
              animate={{
                scaleX: [0.4, 1.3, 0.4],
                opacity: [0.15, 0.8, 0.15],
                y: [0, -12, 0],
              }}
              transition={{ duration: 1.6 + i * 0.15, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
            />
          ))}
        </div>
      )}

      {themeId === 'bad_time_retro' && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_30%,rgba(255,255,255,0.05)_60%,transparent)]"
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 opacity-[0.09] bg-[repeating-linear-gradient(0deg,#000,#000_2px,transparent_2px,transparent_4px)]" />
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-0.5 bg-white/50"
              style={{ left: `${i * 11}%`, top: `${(i * 13) % 100}%` }}
              animate={{
                rotate: [0, 14, -12, 0],
                opacity: [0.15, 0.8, 0.15],
                x: [0, i % 2 === 0 ? 20 : -20, 0],
              }}
              transition={{ duration: 2.5 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {themeId === 'sandevistan_overdrive' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-25 bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.4),transparent)]" />
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.25)_1px,transparent_1px)] [background-size:18px_18px]" />
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-16 h-1 rounded-full bg-cyan-300/70 blur-[1px]"
              style={{ left: `${i * 8}%`, top: `${(i * 9 + 8) % 100}%` }}
              animate={{
                x: [0, 30, 0],
                opacity: [0.2, 0.9, 0.2],
                scaleX: [0.5, 1.4, 0.5],
              }}
              transition={{ duration: 1.8 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {themeId === 'sun_breathing' && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-16 w-16 rounded-full bg-gradient-to-r from-red-500/15 via-orange-400/20 to-yellow-300/0 blur-xl"
              style={{ left: `${(i * 7 + 5) % 100}%`, top: `${(i * 11 + 8) % 100}%` }}
              animate={{
                scale: [0.8, 1.5, 0.8],
                opacity: [0.2, 0.75, 0.2],
                y: [0, -30, 0],
              }}
              transition={{ duration: 2.8 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {themeId === 'electric_thunder' && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-12 w-24 rounded-full bg-gradient-to-r from-cyan-200/0 via-cyan-300/70 to-cyan-200/0"
              style={{
                left: `${(i * 6.5) % 100}%`,
                top: `${(i * 11 + 10) % 100}%`,
                transform: `rotate(${(i % 4) * 18 - 28}deg)`,
              }}
              animate={{
                opacity: [0.1, 0.95, 0.1],
                scaleX: [0.2, 1.2, 0.2],
                scaleY: [0.8, 1.1, 0.8],
              }}
              transition={{ duration: 1.5 + i * 0.08, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {themeId === 'serious_punch' && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/5"
              animate={{
                scale: [0.6, 1.5, 0.8],
                opacity: [0.1, 0.8, 0.1],
              }}
              transition={{ duration: 1.9 + i * 0.18, repeat: Infinity, ease: 'easeOut', delay: i * 0.18 }}
            />
          ))}
        </div>
      )}

      {themeId === 'abyssal_vessel' && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-sky-200/80 shadow-[0_0_12px_rgba(125,211,252,0.9)]"
              style={{ left: `${(i * 11 + 4) % 100}%`, top: `${(i * 9 + 7) % 100}%` }}
              animate={{
                y: [0, -18, 0],
                opacity: [0.2, 0.9, 0.2],
                scale: [0.6, 1.4, 0.6],
              }}
              transition={{ duration: 2.8 + i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {themeId === 'supersonic_speed' && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-yellow-300/50"
              animate={{
                scale: [0.7, 1.8, 0.7],
                opacity: [0.15, 0.9, 0.15],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 2.4 + i * 0.2, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>
      )}

      {themeId === 'dark_detective' && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-1/2 w-48 -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.18),transparent_55%)]"
            animate={{ opacity: [0.15, 0.55, 0.15], scaleX: [0.7, 1.2, 0.7] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-300/80"
              style={{ left: `${(i * 8 + 6) % 100}%`, top: `${(i * 12 + 8) % 100}%` }}
              animate={{
                scale: [0.5, 1.5, 0.5],
                opacity: [0.15, 0.9, 0.15],
                x: [0, i % 2 === 0 ? 16 : -16, 0],
              }}
              transition={{ duration: 2.2 + i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
