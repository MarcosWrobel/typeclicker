import React from 'react';
import { Trophy, Crown, Sparkles, Lock, ExternalLink, Calendar, Users, ShieldCheck } from 'lucide-react';
import { Level100PioneerSlot } from '../types/leaderboard';

interface Level100PioneersWidgetProps {
  slots: Level100PioneerSlot[];
  variant?: 'sidebar' | 'banner' | 'modal';
  currentUserId?: string;
  onOpenDetails?: () => void;
  onSelectPlayer?: (player: any) => void;
}

const RANK_BADGES = {
  1: {
    icon: '👑',
    title: '1º Pioneiro da História',
    border: 'border-amber-400/80',
    bg: 'bg-gradient-to-b from-amber-500/20 via-amber-950/40 to-black',
    glow: 'shadow-[0_0_25px_rgba(251,191,36,0.35)]',
    text: 'text-amber-300',
    medal: '🥇 Ouro'
  },
  2: {
    icon: '🥈',
    title: '2º Pioneiro da História',
    border: 'border-slate-300/80',
    bg: 'bg-gradient-to-b from-slate-400/20 via-slate-900/40 to-black',
    glow: 'shadow-[0_0_20px_rgba(203,213,225,0.25)]',
    text: 'text-slate-200',
    medal: '🥈 Prata'
  },
  3: {
    icon: '🥉',
    title: '3º Pioneiro da História',
    border: 'border-amber-600/80',
    bg: 'bg-gradient-to-b from-amber-700/20 via-amber-950/30 to-black',
    glow: 'shadow-[0_0_20px_rgba(217,119,6,0.25)]',
    text: 'text-amber-500',
    medal: '🥉 Bronze'
  }
};

export const Level100PioneersWidget: React.FC<Level100PioneersWidgetProps> = ({
  slots,
  variant = 'sidebar',
  currentUserId,
  onOpenDetails,
  onSelectPlayer
}) => {
  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    } catch {
      return '';
    }
  };

  // VARIANTE SIDEBAR (Card Dourado na Barra Lateral)
  if (variant === 'sidebar') {
    return (
      <div
        onClick={onOpenDetails}
        className="w-full rounded-2xl bg-gradient-to-b from-amber-950/40 via-[#0a0c10] to-[#0a0c10] border border-amber-500/50 hover:border-amber-400 p-3 shadow-[0_0_20px_rgba(245,158,11,0.15)] flex flex-col gap-2.5 transition-all duration-200 cursor-pointer group select-none relative overflow-hidden"
      >
        {/* Faixa decorativa no topo */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 opacity-80" />

        {/* Header do Card */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <Crown className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
            <span className="text-xs font-black font-mono text-amber-300 tracking-wider truncate">
              PIONEIROS NV. 100
            </span>
          </div>
          <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Hall</span>
          </span>
        </div>

        {/* Lista dos 3 Slots */}
        <div className="flex flex-col gap-1.5">
          {slots.map((slot) => {
            const badge = RANK_BADGES[slot.rank];
            const isMe = currentUserId && slot.player?.userId === currentUserId;

            if (slot.isFilled && slot.player) {
              const displayName = slot.player.apelido || slot.player.nome;
              return (
                <div
                  key={slot.rank}
                  onClick={(e) => {
                    if (onSelectPlayer && slot.player) {
                      e.stopPropagation();
                      onSelectPlayer(slot.player);
                    }
                  }}
                  className={`flex items-center justify-between gap-2 p-1.5 rounded-xl border ${badge.border} ${badge.bg} text-xs font-mono transition-all ${
                    onSelectPlayer ? 'hover:scale-[1.02] hover:border-amber-400 cursor-pointer' : ''
                  } ${
                    isMe ? 'ring-1 ring-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]' : ''
                  }`}
                  title={
                    onSelectPlayer
                      ? `Clique para ver o Card Colecionável de ${displayName}`
                      : `${badge.title}: ${displayName} (${slot.player.turma}) em ${formatDate(slot.reachedAt)}`
                  }
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-base select-none flex-shrink-0">{slot.player.avatar || badge.icon}</span>
                    <div className="flex flex-col min-w-0">
                      <span className={`font-bold truncate text-[11px] ${isMe ? 'text-amber-300' : 'text-zinc-200'}`}>
                        {displayName} {isMe && '⭐'}
                      </span>
                      <span className="text-[9px] text-zinc-400 truncate">
                        {slot.player.turma || 'Leopoldina'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 text-right">
                    <span className={`text-[10px] font-black ${badge.text}`}>
                      #{slot.rank}
                    </span>
                    <span className="text-[8px] text-zinc-500">
                      {formatDate(slot.reachedAt)}
                    </span>
                  </div>
                </div>
              );
            }

            // Vaga em aberto
            return (
              <div
                key={slot.rank}
                className="flex items-center justify-between gap-2 p-1.5 rounded-xl border border-dashed border-amber-500/30 bg-black/40 text-xs font-mono"
              >
                <div className="flex items-center gap-1.5 min-w-0 text-zinc-500">
                  <Lock className="w-3.5 h-3.5 text-amber-500/50 flex-shrink-0 animate-pulse" />
                  <span className="text-[10px] italic truncate text-amber-300/70">
                    Vaga #{slot.rank} em Aberto
                  </span>
                </div>
                <span className="text-[9px] font-bold text-amber-400/60 bg-amber-500/5 px-1.5 py-0.2 rounded border border-amber-500/20">
                  Nv. 100
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center text-[10px] text-amber-400/70 font-mono group-hover:text-amber-300 transition-colors pt-0.5">
          <span>Ver Hall da Fama Completo →</span>
        </div>
      </div>
    );
  }

  // VARIANTE BANNER / MODAL (Pódio Grande de Destaque)
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-950 to-black border-2 border-amber-500/50 p-4 sm:p-5 shadow-[0_0_35px_rgba(245,158,11,0.2)] flex flex-col gap-4">
      {/* Topo do Banner */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            👑
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black font-mono text-white tracking-wider flex items-center gap-1.5">
              <span>HALL DAS LENDAS • PIONEIROS DO NÍVEL 100</span>
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            </h3>
            <p className="text-[11px] text-zinc-400 font-mono">
              Os 3 primeiros alunos a conquistarem o Nível Máximo na história do Colégio Leopoldina Pedroso.
            </p>
          </div>
        </div>
      </div>

      {/* Grid com os 3 Lugares do Pódio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {slots.map((slot) => {
          const badge = RANK_BADGES[slot.rank];
          const isMe = currentUserId && slot.player?.userId === currentUserId;

          if (slot.isFilled && slot.player) {
            const displayName = slot.player.apelido || slot.player.nome;
            return (
              <div
                key={slot.rank}
                onClick={() => {
                  if (onSelectPlayer && slot.player) {
                    onSelectPlayer(slot.player);
                  }
                }}
                className={`flex flex-col items-center p-3.5 rounded-2xl border ${badge.border} ${badge.bg} ${badge.glow} relative text-center min-w-0 transition-all duration-200 ${
                  onSelectPlayer ? 'hover:scale-[1.03] hover:border-amber-300 cursor-pointer group' : 'hover:scale-[1.02]'
                } ${
                  isMe ? 'ring-2 ring-amber-400' : ''
                }`}
                title={onSelectPlayer ? `Clique para ver o Card Colecionável de ${displayName}` : undefined}
              >
                {/* Badge de Posição */}
                <div className={`absolute -top-2.5 px-3 py-0.5 rounded-full text-[10px] font-black font-mono tracking-wider border shadow-md ${badge.text} bg-black/90 ${badge.border}`}>
                  {badge.medal.toUpperCase()}
                </div>

                <div className="w-12 h-12 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-center text-3xl my-2 shadow-inner">
                  {slot.player.avatar || badge.icon}
                </div>

                <span className="font-black font-mono text-sm text-white truncate max-w-full">
                  {displayName} {isMe && '⭐'}
                </span>

                <span className="text-xs font-mono text-amber-300 font-bold mt-0.5">
                  Turma {slot.player.turma || 'Geral'}
                </span>

                {onSelectPlayer && (
                  <div className="mt-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-mono text-amber-300 group-hover:bg-amber-500/30 transition flex items-center gap-1">
                    <span>Ver Card</span>
                    <span>🎴</span>
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-white/10 w-full flex items-center justify-center gap-1 text-[10px] font-mono text-zinc-400">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  <span>{formatDate(slot.reachedAt)}</span>
                </div>
              </div>
            );
          }

          // Vaga em Aberto
          return (
            <div
              key={slot.rank}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-amber-500/30 bg-black/50 text-center relative"
            >
              <div className="absolute -top-2.5 px-3 py-0.5 rounded-full text-[10px] font-black font-mono tracking-wider border border-amber-500/40 text-amber-400 bg-black/90">
                VAGA #{slot.rank}
              </div>

              <div className="w-12 h-12 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-center text-2xl my-2">
                <Lock className="w-6 h-6 text-amber-400/60 animate-pulse" />
              </div>

              <span className="font-bold font-mono text-xs text-amber-200/90">
                Vaga em Aberto
              </span>

              <span className="text-[10px] font-mono text-zinc-500 mt-1">
                Alcance o Nível 100 para imortalizar seu nome!
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
