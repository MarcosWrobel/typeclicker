import React, { useMemo } from 'react';
import { Cpu, Trophy, ChevronRight, Users, Shield } from 'lucide-react';
import { GameState } from '../types';
import { RPG_CLASSES } from '../types/rpgClass';
import { formatBytes, formatRate, calculatePlayerRank } from '../utils/formatting';
import { TopPodiumWidget } from './TopPodiumWidget';
import { LeaderboardMetric } from './LeaderboardModal';
import { Level100PioneersWidget } from './Level100PioneersWidget';
import { useLeaderboardPodium } from '../hooks/useLeaderboardPodium';
import { Level100PioneerSlot } from '../services/firebaseService';

interface StatsSidebarProps {
  state: GameState;
  onOpenPrestige: () => void;
  onOpenLevels: () => void;
  onOpenStudentModal?: () => void;
  onOpenAchievements?: () => void;
  achievementsCount?: { unlocked: number; total: number };
  onOpenLeaderboard?: () => void;
  onOpenLeaderboardTab?: (metric: LeaderboardMetric) => void;
  currentUserId?: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  pioneers?: Level100PioneerSlot[];
}

export const StatsSidebar: React.FC<StatsSidebarProps> = ({
  state,
  onOpenPrestige,
  onOpenLevels,
  onOpenStudentModal,
  onOpenAchievements,
  achievementsCount,
  onOpenLeaderboard,
  onOpenLeaderboardTab,
  currentUserId,
  isAdmin = false,
  isSuperAdmin = false,
  pioneers
}) => {
  const { pioneers: hookPioneers } = useLeaderboardPodium();
  const effectivePioneers = pioneers || hookPioneers;
  const myPioneerSlot = useMemo(() => {
    if (!currentUserId) return null;
    return effectivePioneers.find((s) => s.isFilled && s.player?.userId === currentUserId);
  }, [effectivePioneers, currentUserId]);

  const prestigeBonusPercent = state.prestigeCores * 20;
  const playerRank = calculatePlayerRank(state.totalBytesEarned);

  return (
    <aside className="w-full h-full flex flex-col p-3 sm:p-4 gap-3 sm:gap-4 overflow-y-auto min-w-0 scrollbar-thin">
      
      {/* Perfil do Aluno (Acima dos saldos) */}
      {onOpenStudentModal && (
        <button
          type="button"
          onClick={onOpenStudentModal}
          className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#10171a] to-emerald-950/40 hover:from-emerald-900/70 hover:to-zinc-800 border border-emerald-500/40 hover:border-emerald-400 transition cursor-pointer shadow-sm group flex items-center justify-between text-left"
          title="Alterar perfil (Apelido, Turma e Avatar)"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-300 text-2xl select-none flex-shrink-0 group-hover:scale-105 transition-transform shadow-inner">
              {state.studentAvatar || '🐧'}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors truncate">
                  {state.studentNickname || state.studentName || 'Definir Apelido'}
                </span>
                {isSuperAdmin ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-500/20 border border-red-500/30 text-[9px] font-bold text-red-400 whitespace-nowrap">👑 ADM</span>
                ) : isAdmin ? (
                  <span className="px-1.5 py-0.2 rounded-full bg-sky-500/20 border border-sky-500/30 text-[9px] font-bold text-sky-400 whitespace-nowrap">👨‍🏫 Prof</span>
                ) : myPioneerSlot ? (
                  <span
                    className="px-1.5 py-0.2 rounded-full bg-amber-500/20 border border-amber-400/60 text-[9px] font-mono font-bold text-amber-300 whitespace-nowrap flex items-center gap-0.5 shadow-sm"
                    title={`Pioneiro do Nível 100 • #${myPioneerSlot.rank} na história do colégio`}
                  >
                    <span>{myPioneerSlot.rank === 1 ? '🥇' : myPioneerSlot.rank === 2 ? '🥈' : '🥉'}</span>
                    <span>Pioneiro #{myPioneerSlot.rank}</span>
                  </span>
                ) : null}
                {state.rpgClass && RPG_CLASSES[state.rpgClass] && (
                  <span className={`px-1.5 py-0.2 rounded-full ${RPG_CLASSES[state.rpgClass].badgeBg} border ${RPG_CLASSES[state.rpgClass].badgeBorder} text-[9px] font-bold ${RPG_CLASSES[state.rpgClass].badgeText} whitespace-nowrap flex items-center gap-0.5`}>
                    <span>{RPG_CLASSES[state.rpgClass].icon}</span>
                    <span>{RPG_CLASSES[state.rpgClass].name}</span>
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-emerald-400/90 leading-tight truncate mt-0.5">
                {state.studentClass ? `Turma: ${state.studentClass}` : 'Toque p/ escolher turma'}
              </span>
            </div>
          </div>
          <div className="text-zinc-500 group-hover:text-emerald-300 transition-colors pl-1 flex-shrink-0">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      )}

      {/* Saldo de Bytes */}
      <div className="bg-[#0a0c10] border border-[#232833] rounded-2xl p-4 shadow-inner flex flex-col items-center text-center gap-1">
        <span className="text-3xl select-none animate-pulse mb-1">🪙</span>
        <span className="text-xs text-zinc-400 font-sans font-bold uppercase tracking-widest leading-none">Saldo de Bytes</span>
        <span className="text-2xl font-black text-emerald-400 break-all leading-none mt-1">
          {formatBytes(state.bytes)}
        </span>
      </div>

      {/* Stats Menores */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#0a0c10] border border-[#232833] rounded-xl p-3 flex flex-col items-center text-center">
          <span className="text-[10px] text-zinc-400 font-sans font-bold uppercase tracking-wider mb-1">Por Tecla</span>
          <span className="text-sm font-bold text-sky-300">
            +{formatBytes(state.bytesPerChar)}
          </span>
        </div>
        
        <div className="bg-[#0a0c10] border border-[#232833] rounded-xl p-3 flex flex-col items-center text-center">
          <span className="text-[10px] text-zinc-400 font-sans font-bold uppercase tracking-wider mb-1">Prod. Auto</span>
          <span className="text-sm font-bold text-amber-300">
            {formatRate(state.autoBytesPerSec)}
          </span>
        </div>
      </div>

      {/* Prestige Cores */}
      {state.prestigeCores > 0 && (
        <button
          onClick={onOpenPrestige}
          className="flex items-center justify-center gap-2 p-3 rounded-xl bg-purple-950/40 text-purple-300 border border-purple-500/30 hover:bg-purple-900/60 transition cursor-pointer"
          title="Bônus de Núcleos Quânticos"
        >
          <Cpu className="w-5 h-5 text-purple-400 animate-pulse" />
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase font-bold tracking-wider">Overclock Quântico</span>
            <span className="text-sm font-black">+{prestigeBonusPercent}%</span>
          </div>
        </button>
      )}

      {/* Level Progress */}
      <button
        onClick={onOpenLevels}
        className="flex flex-col gap-2 bg-[#0b0e14] hover:bg-[#121622] border border-[#222834] hover:border-amber-500/50 p-4 rounded-2xl shadow-sm transition-all duration-200 cursor-pointer group text-left"
        title="Clique para ver todos os Níveis do 1 ao 100!"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl select-none group-hover:scale-110 transition-transform" title={`Rank: ${playerRank.title}`}>
            {playerRank.badge}
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-zinc-200 group-hover:text-amber-300 transition-colors flex items-center gap-1 text-sm">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Nv. {playerRank.level}</span>
            </span>
            <span className="text-xs text-amber-400 font-black leading-tight">
              {playerRank.title}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 mt-1 w-full">
          <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
            <span>Progresso</span>
            <span>{playerRank.progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-zinc-800/90 rounded-full overflow-hidden border border-zinc-700/40">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 rounded-full transition-all duration-300 relative"
              style={{ width: `${playerRank.progressPercent}%` }}
            >
               <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 blur-[2px]" />
            </div>
          </div>
        </div>
      </button>

      {/* Card Dourado de Destaque: Pioneiros Nível 100 */}
      <Level100PioneersWidget
        slots={effectivePioneers}
        variant="sidebar"
        currentUserId={currentUserId}
        onOpenDetails={() => {
          if (onOpenLeaderboardTab) {
            onOpenLeaderboardTab('level');
          } else if (onOpenLeaderboard) {
            onOpenLeaderboard();
          }
        }}
      />

      {/* Pódio Top 3 Escolar (Destaque sem entrar em menu) */}
      <TopPodiumWidget
        currentUserId={currentUserId}
        onOpenLeaderboardTab={onOpenLeaderboardTab || (onOpenLeaderboard ? () => onOpenLeaderboard() : undefined)}
      />

      {/* Atalhos de Reconhecimento & Comunidade (Abaixo do Nível do Jogador) */}
      {(onOpenAchievements || onOpenLeaderboard) && (
        <div className="grid grid-cols-2 gap-2 mt-auto pt-1">
          {onOpenAchievements && (
            <button
              type="button"
              onClick={onOpenAchievements}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#0b0e14] hover:bg-[#151a26] border border-[#222834] hover:border-amber-500/60 transition-all duration-200 cursor-pointer group shadow-sm text-center"
              title="Quadro e Galeria de Conquistas do Colégio Leopoldina"
            >
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-zinc-200 group-hover:text-amber-300 transition-colors">
                  CONQUISTAS
                </span>
              </div>
              {achievementsCount && (
                <span className="text-[10px] font-mono text-amber-400 font-bold mt-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                  {achievementsCount.unlocked}/{achievementsCount.total}
                </span>
              )}
            </button>
          )}

          {onOpenLeaderboard && (
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#0b0e14] hover:bg-[#151a26] border border-[#222834] hover:border-purple-500/60 transition-all duration-200 cursor-pointer group shadow-sm text-center"
              title="Ranking Geral das Turmas e Alunos do Colégio Leopoldina"
            >
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-zinc-200 group-hover:text-purple-300 transition-colors">
                  RANKING
                </span>
              </div>
              <span className="text-[10px] font-mono text-purple-300 mt-1 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/30">
                Turmas
              </span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
};

