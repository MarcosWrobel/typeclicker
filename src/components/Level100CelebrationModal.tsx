import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, Trophy, Medal, Calendar, Zap, Database, Lock, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { StudentAvatarRenderer } from './vectors/StudentAvatarRenderer';
import { Level100PioneerSlot } from '../types/leaderboard';
import { formatBytes } from '../utils/formatting';

export interface Level100CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rank?: 1 | 2 | 3;
  studentName?: string;
  studentAvatar?: string;
  studentClass?: string;
  reachedAt?: string;
  pioneerSlot?: Level100PioneerSlot;
  isSelfCelebration?: boolean;
}

export const Level100CelebrationModal: React.FC<Level100CelebrationModalProps> = ({
  isOpen,
  onClose,
  rank = 1,
  studentName = 'Digitador Lendário',
  studentAvatar = 'tux',
  studentClass,
  reachedAt,
  pioneerSlot,
  isSelfCelebration = false
}) => {
  // Dispara a celebração de confetes em cascata
  const triggerConfettiBlast = useCallback(() => {
    try {
      sound.playPrestige();
    } catch {
      // Audio fallback silencioso
    }

    // 1. Canhão Lateral Esquerdo
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 70,
      origin: { x: 0.05, y: 0.65 },
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#38bdf8', '#ffffff']
    });

    // 2. Canhão Lateral Direito
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 70,
      origin: { x: 0.95, y: 0.65 },
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#ec4899', '#ffffff']
    });

    // 3. Chuva Dourada Central do Topo
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.2 },
        colors: ['#fbbf24', '#fef08a', '#eab308', '#ffffff']
      });
    }, 250);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    triggerConfettiBlast();

    // Cascata contínua durante 3.5 segundos
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;
    let animId: number | null = null;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#ffffff']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#ffffff']
      });

      if (Date.now() < end) {
        animId = requestAnimationFrame(frame);
      }
    };
    animId = requestAnimationFrame(frame);

    return () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
      }
    };
  }, [isOpen, triggerConfettiBlast]);

  // Se passou pioneerSlot, extrai dados prioritários do slot
  const isFilled = pioneerSlot ? pioneerSlot.isFilled : true;
  const effectivePlayer = pioneerSlot?.player;
  const effectiveRank = pioneerSlot?.rank || rank;

  const displayName = effectivePlayer?.apelido || effectivePlayer?.nome || studentName;
  const displayAvatar = effectivePlayer?.avatar || studentAvatar;
  const displayClass = effectivePlayer?.turma || studentClass || 'Colégio Leopoldina Pedroso';
  const effectiveDate = pioneerSlot?.reachedAt || effectivePlayer?.reachedLevel100At || reachedAt;

  const formatDateDisplay = (iso?: string) => {
    if (!iso) return 'Recentemente';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Data Histórica';
    }
  };

  const rankTitles: Record<number, string> = {
    1: '1º PIONEIRO SUPREMO',
    2: '2º PIONEIRO HISTÓRICO',
    3: '3º PIONEIRO HISTÓRICO'
  };

  const rankMedals: Record<number, string> = {
    1: 'COROA DE OURO PURO',
    2: 'COROA DE PRATA CÓSMICA',
    3: 'COROA DE BRONZE FORJADO'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md select-none overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.85, y: 25, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 25, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg bg-gradient-to-b from-amber-950/70 via-[#0a0d14] to-[#07090e] border-2 border-amber-400/90 rounded-3xl p-5 sm:p-8 shadow-[0_0_90px_rgba(251,191,36,0.45)] flex flex-col items-center text-center relative overflow-hidden my-auto"
          >
            {/* Fechar no canto superior direito */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-300 border border-white/10 transition z-20 cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Brilho radial de fundo rotativo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(251,191,36,0.22),transparent_70%)] pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* CENÁRIO 1: O TRONO ESTÁ VAGO (Nenhum aluno atingiu o Nível 100 ainda) */}
            {!isFilled ? (
              <>
                <div className="relative my-3">
                  <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border-2 border-dashed border-amber-400/60 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.3)] animate-pulse p-4">
                    <Lock className="w-12 h-12 text-amber-400/80" />
                  </div>
                  <Crown className="w-10 h-10 text-amber-400/40 absolute -top-4 -right-3 animate-bounce" />
                </div>

                <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/50 text-amber-300 font-mono text-xs font-black uppercase tracking-widest mt-2 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>TRONO DE OURO EM ABERTO</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-wider mt-3">
                  QUEM SERÁ O 1º PIONEIRO?
                </h2>

                <p className="text-zinc-300 font-mono text-xs sm:text-sm mt-2.5 max-w-md leading-relaxed">
                  O Trono do <strong className="text-amber-300">Nível 100</strong> ainda está vago! Nenhum aluno do <strong>Colégio Estadual Leopoldina Pedroso</strong> alcançou o topo máximo ainda.
                </p>

                <p className="text-amber-200/80 font-mono text-xs mt-2 max-w-sm">
                  Continue digitando, superando chefes e elevando seus bytes para cravar seu nome para sempre no topo do Hall das Lendas!
                </p>

                <div className="w-full flex flex-col sm:flex-row gap-2.5 mt-6 z-10">
                  <button
                    type="button"
                    onClick={triggerConfettiBlast}
                    className="flex-1 py-3 px-4 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-mono font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Chuva de Estrelas</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-mono font-black text-xs tracking-wider transition shadow-[0_0_20px_rgba(251,191,36,0.5)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-98"
                  >
                    <Trophy className="w-4 h-4 text-black" />
                    <span>DISPUTAR O TOPO</span>
                  </button>
                </div>
              </>
            ) : (
              /* CENÁRIO 2: O 1º PIONEIRO HISTÓRICO DO NÍVEL 100 */
              <>
                {/* Ícone Mestre com Avatar e Coroa Triunfal */}
                <div className="relative my-2 sm:my-3">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-b from-amber-500/30 to-amber-950/60 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.6)] p-3 relative">
                    <StudentAvatarRenderer avatar={displayAvatar} className="w-full h-full drop-shadow-md" />
                    <div className="absolute inset-0 rounded-3xl ring-2 ring-amber-300/60 animate-ping pointer-events-none opacity-40" />
                  </div>
                  <Crown className="w-11 h-11 text-amber-300 absolute -top-5 -right-4 drop-shadow-[0_0_15px_rgba(251,191,36,1)] animate-bounce" />
                </div>

                {/* Faixa de Glória */}
                <div className="flex items-center gap-1.5 px-4 py-1.2 rounded-full bg-amber-500/25 border border-amber-400/60 text-amber-300 font-mono text-xs font-black uppercase tracking-widest mt-2 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>{rankTitles[effectiveRank] || 'PIONEIRO LENDÁRIO'}</span>
                </div>

                {/* Título de Celebração */}
                <h2 className="text-2xl sm:text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 tracking-wider mt-2.5">
                  {isSelfCelebration ? 'PARABÉNS! VOCÊ CRAVOU SEU NOME!' : 'LENDA SUPREMA DO COLÉGIO!'}
                </h2>

                {/* Nome do Aluno */}
                <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                  {displayName}
                </div>

                {/* Mensagem Histórica */}
                <p className="text-zinc-300 font-mono text-xs sm:text-sm mt-2 max-w-md leading-relaxed">
                  {isSelfCelebration ? (
                    <>
                      Você alcançou o <strong>Nível 100</strong> e entrou para a eternidade como o <strong>{effectiveRank}º aluno</strong> na história do Colégio Leopoldina Pedroso a atingir o topo máximo do TypeClicker!
                    </>
                  ) : (
                    <>
                      O primeiríssimo aluno em toda a história do Colégio Estadual Leopoldina Pedroso a alcançar o topo máximo do <strong>Nível 100</strong> no TypeClicker! Uma marca histórica imortalizada!
                    </>
                  )}
                </p>

                {/* Grid de Estatísticas Comemorativas */}
                <div className="w-full bg-black/70 border border-amber-500/40 rounded-2xl p-3 sm:p-3.5 my-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="flex flex-col items-center p-1.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Classificação</span>
                    <span className="font-bold text-amber-300 flex items-center gap-1 mt-0.5 text-[11px] truncate">
                      <Medal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      #{effectiveRank} Ouro
                    </span>
                  </div>

                  <div className="flex flex-col items-center p-1.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Turma</span>
                    <span className="font-bold text-white mt-0.5 text-[11px] truncate">
                      {displayClass}
                    </span>
                  </div>

                  <div className="flex flex-col items-center p-1.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Total Bytes</span>
                    <span className="font-bold text-purple-300 flex items-center gap-1 mt-0.5 text-[11px] truncate">
                      <Database className="w-3 h-3 text-purple-400 shrink-0" />
                      {effectivePlayer?.points ? formatBytes(effectivePlayer.points) : 'Nv. 100'}
                    </span>
                  </div>

                  <div className="flex flex-col items-center p-1.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">Data Histórica</span>
                    <span className="font-bold text-sky-300 flex items-center gap-1 mt-0.5 text-[10px] truncate" title={effectiveDate}>
                      <Calendar className="w-3 h-3 text-sky-400 shrink-0" />
                      {formatDateDisplay(effectiveDate)}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação Comemorativa */}
                <div className="w-full flex flex-col sm:flex-row gap-2.5 z-10">
                  <button
                    type="button"
                    onClick={triggerConfettiBlast}
                    className="flex-1 py-3 px-4 rounded-2xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-mono font-bold text-xs tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-98"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>🎉 Mais Confetes!</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-mono font-black text-xs sm:text-sm tracking-wider shadow-[0_0_30px_rgba(251,191,36,0.6)] cursor-pointer transition transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4 text-black" />
                    <span>HONRAR A LENDA</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
