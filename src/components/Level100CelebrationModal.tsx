import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, Trophy, Award, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface Level100CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rank: 1 | 2 | 3;
  studentName: string;
  studentAvatar?: string;
  studentClass?: string;
}

export const Level100CelebrationModal: React.FC<Level100CelebrationModalProps> = ({
  isOpen,
  onClose,
  rank,
  studentName,
  studentAvatar = '🐧',
  studentClass
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playPrestige();

      // Chuva de confetes dourados e triunfais
      const duration = 3.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#fbbf24', '#f59e0b', '#d97706', '#ffffff']
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#fbbf24', '#f59e0b', '#d97706', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  const rankTitles = {
    1: '1º PIONEIRO ABSOLUTO',
    2: '2º PIONEIRO HISTÓRICO',
    3: '3º PIONEIRO HISTÓRICO'
  };

  const rankMedals = {
    1: '🥇 COROA DE OURO PURO',
    2: '🥈 COROA DE PRATA CÓSMICA',
    3: '🥉 COROA DE BRONZE FORJADO'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="w-full max-w-lg bg-gradient-to-b from-amber-950/60 via-[#0a0c10] to-[#0a0c10] border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(251,191,36,0.4)] flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Brilho de fundo rotativo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(251,191,36,0.15),transparent_70%)] pointer-events-none" />

            {/* Ícone Mestre */}
            <div className="relative my-2">
              <div className="w-24 h-24 rounded-3xl bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(251,191,36,0.5)] animate-bounce">
                {studentAvatar}
              </div>
              <Crown className="w-10 h-10 text-amber-400 absolute -top-4 -right-3 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse" />
            </div>

            {/* Faixa de Glória */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono text-xs font-black uppercase tracking-widest mt-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{rankTitles[rank]}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-wider mt-3">
              CONQUISTA LENDÁRIA!
            </h2>

            <p className="text-zinc-300 font-mono text-xs sm:text-sm mt-2 max-w-md leading-relaxed">
              Parabéns, <strong className="text-amber-300">{studentName}</strong>! Você alcançou o Nível 100 e cravou seu nome eternamente como o <strong>{rank}º aluno na história do Colégio Leopoldina Pedroso</strong> a atingir o topo máximo!
            </p>

            <div className="w-full bg-black/60 border border-amber-500/30 rounded-2xl p-3 my-4 flex items-center justify-around text-xs font-mono">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-zinc-400 uppercase">Classificação</span>
                <span className="font-bold text-amber-300">{rankMedals[rank]}</span>
              </div>
              <div className="h-6 w-px bg-zinc-800" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-zinc-400 uppercase">Turma</span>
                <span className="font-bold text-white">{studentClass || 'Leopoldina'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-mono font-black text-sm tracking-wider shadow-[0_0_25px_rgba(251,191,36,0.6)] cursor-pointer transition transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5 text-black" />
              <span>ENTRAR NO HALL DAS LENDAS</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
