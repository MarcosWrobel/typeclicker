import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldAlert, Sparkles } from 'lucide-react';
import { mathStormAudio } from '../mathStormAudio';

interface BossChallenge {
  question: string;
  answer: number;
  options: number[];
}

const BOSS_CHALLENGES: BossChallenge[] = [
  { question: '7 × 8 = ?', answer: 56, options: [48, 54, 56, 64] },
  { question: '45 ÷ 5 = ?', answer: 9, options: [7, 8, 9, 11] },
  { question: '3x = 21 → x = ?', answer: 7, options: [6, 7, 8, 9] },
  { question: '1/2 de 36 = ?', answer: 18, options: [14, 16, 18, 22] },
  { question: '100 - 37 = ?', answer: 63, options: [63, 67, 73, 53] },
  { question: '9 × 6 = ?', answer: 54, options: [45, 52, 54, 63] }
];

interface StormBossArcadeCanvasProps {
  onBossDefeated: () => void;
  onWrongAnswer: () => void;
  className?: string;
}

export const StormBossArcadeCanvas: React.FC<StormBossArcadeCanvasProps> = ({
  onBossDefeated,
  onWrongAnswer,
  className = 'w-full min-h-[390px]'
}) => {
  const [bossHp, setBossHp] = useState(5);
  const maxHp = 5;
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [hitFlash, setHitFlash] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const currentChallenge = BOSS_CHALLENGES[challengeIdx % BOSS_CHALLENGES.length];

  const handleSelectOption = (val: number) => {
    if (val === currentChallenge.answer) {
      mathStormAudio.playBossHitSound();
      setHitFlash(true);
      setTimeout(() => setHitFlash(false), 350);

      const nextHp = bossHp - 1;
      setBossHp(nextHp);
      setFeedbackMsg('⚡ RAIOS REBATIDOS! DANO CRÍTICO NO CHEFÃO!');

      if (nextHp <= 0) {
        setTimeout(() => {
          onBossDefeated();
        }, 500);
      } else {
        setChallengeIdx((prev) => prev + 1);
      }
    } else {
      mathStormAudio.playRemoveWeight();
      setFeedbackMsg('⚠️ Cálculo incorreto! Tente outra carga do para-raios!');
      onWrongAnswer();
    }
  };

  return (
    <div
      className={`relative select-none flex flex-col justify-between overflow-hidden bg-[#faeac4] border-5 border-[#24140b] rounded-3xl p-6 shadow-[0_10px_0_#24140b] ${className}`}
    >
      {/* TEXTURA VINTAGE */}
      <div className="absolute inset-0 bg-[radial-gradient(#8c5828_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* BARRA DE VIDA DO CHEFÃO ESTILO CUPHEAD ("WALLOP!") */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pb-4 border-b-3 border-[#24140b]/20">
        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 rounded-2xl bg-[#e74c3c] border-3 border-[#24140b] text-white font-serif font-black text-sm uppercase shadow-[0_3px_0_#24140b]">
            ⚡ BOSS FIGHT: SENHOR CUMULONIMBUS
          </span>
        </div>

        {/* Medidor de HP */}
        <div className="flex items-center gap-3 bg-[#fdf5df] px-5 py-2 rounded-2xl border-4 border-[#24140b] shadow-[0_4px_0_#24140b]">
          <span className="font-serif font-black text-sm text-[#24140b]">HP DO CHEFÃO:</span>
          <div className="flex gap-1.5">
            {Array.from({ length: maxHp }).map((_, i) => (
              <div
                key={`hp-${i}`}
                className={`w-7 h-5 rounded-lg border-2 border-[#24140b] transition-all ${
                  i < bossHp ? 'bg-[#e74c3c]' : 'bg-[#edd49e] opacity-40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ARENA CENTRAL: CHEFÃO NUVEM RABUGENTA + PROJÉTIL DE CÁLCULO */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center my-4 flex-1">
        {/* ILUSTRAÇÃO ANIMADA DO CHEFÃO NUVEM ANOS 1930 */}
        <div className="flex flex-col items-center justify-center bg-[#fdf5df] border-4 border-[#24140b] rounded-3xl p-4 shadow-[0_6px_0_#24140b]">
          <motion.svg
            width="280"
            height="200"
            viewBox="0 0 280 200"
            animate={
              hitFlash
                ? { x: [-12, 12, -8, 8, 0], scale: [1, 0.9, 1.08, 1] }
                : { y: [0, -8, 0] }
            }
            transition={{
              duration: hitFlash ? 0.35 : 2,
              repeat: hitFlash ? 0 : Infinity,
              ease: 'easeInOut'
            }}
          >
            {/* Corpo da Grande Nuvem de Tempestade */}
            <path
              d="M 55 125 C 25 125, 10 95, 30 70 C 45 35, 95 25, 125 50 C 150 20, 215 25, 225 65 C 260 75, 255 125, 220 125 Z"
              fill={hitFlash ? '#e74c3c' : '#475569'}
              stroke="#24140b"
              strokeWidth="6"
            />

            {/* Sobrancelhas Grossas Furiosas */}
            <path d="M 75 65 L 115 80" stroke="#24140b" strokeWidth="6" strokeLinecap="round" />
            <path d="M 185 65 L 145 80" stroke="#24140b" strokeWidth="6" strokeLinecap="round" />

            {/* Olhos Pie-Eyes Anos 1930 */}
            <ellipse cx="100" cy="88" rx="14" ry="18" fill="#fdf5df" stroke="#24140b" strokeWidth="4" />
            <circle cx="104" cy="88" r="6" fill="#24140b" />

            <ellipse cx="160" cy="88" rx="14" ry="18" fill="#fdf5df" stroke="#24140b" strokeWidth="4" />
            <circle cx="156" cy="88" r="6" fill="#24140b" />

            {/* Boca Rosnando com Raios */}
            <path
              d="M 95 114 Q 130 100 165 114"
              fill="none"
              stroke="#24140b"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Raios disparados abaixo da nuvem */}
            <polygon
              points="125,125 148,125 135,152 155,152 112,192 124,160 108,160"
              fill="#ffd95a"
              stroke="#24140b"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </motion.svg>

          {feedbackMsg && (
            <span className="font-serif font-black text-xs sm:text-sm text-[#24140b] bg-[#ffd95a] px-4 py-1.5 rounded-xl border-2 border-[#24140b]">
              {feedbackMsg}
            </span>
          )}
        </div>

        {/* PAINEL DE TIRO DO PARA-RAIOS (PERGUNTA E 4 BOTÕES GRANDES) */}
        <div className="flex flex-col justify-between gap-4 bg-[#fdf5df] border-4 border-[#24140b] rounded-3xl p-6 shadow-[0_6px_0_#24140b] h-full">
          <div className="text-center">
            <span className="text-xs font-serif font-black uppercase text-[#7f5326] tracking-wider">
              NEUTRALIZE O RAIO MATEMÁTICO:
            </span>
            <div className="mt-2 py-4 px-6 rounded-2xl bg-[#faeac4] border-4 border-[#24140b] shadow-[0_4px_0_#24140b]">
              <span className="text-3xl sm:text-4xl font-serif font-black text-[#24140b] whitespace-nowrap">
                {currentChallenge.question}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 mt-2">
            {currentChallenge.options.map((opt) => (
              <motion.button
                key={`opt-${challengeIdx}-${opt}`}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectOption(opt)}
                className="py-4 px-6 rounded-2xl bg-[#ffd95a] hover:bg-[#ffe58f] border-4 border-[#24140b] shadow-[0_5px_0_#24140b] active:translate-y-1 active:shadow-none font-serif font-black text-2xl text-[#24140b] cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 fill-[#e67e22] text-[#24140b]" />
                <span>{opt}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
