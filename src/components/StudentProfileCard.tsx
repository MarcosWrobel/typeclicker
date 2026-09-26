import React from 'react';
import { Trophy, Zap, Flame, Database, Swords, Flag, Target, Award, Sparkles, Crown, Shield } from 'lucide-react';
import { LeaderboardEntry } from '../types/leaderboard';
import { GameState } from '../types';
import { CARD_FRAME_CONFIGS, CardFrameId } from '../types/cardFrames';
import { calculatePlayerBadges, extractStatsFromPlayer } from '../services/profileBadges';
import { formatBytes, calculatePlayerRank } from '../utils/formatting';
import { RPG_CLASSES } from '../types/rpgClass';
import { getSerieLabelFromTurma } from '../constants/school';

import { PlayerCosmetics } from '../types/cosmetics';

export interface StudentProfileCardProps {
  player: Partial<LeaderboardEntry> | GameState;
  overrideFrameId?: CardFrameId;
  currentCosmetics?: PlayerCosmetics;
  pioneerRank?: 1 | 2 | 3;
  isCurrentPlayer?: boolean;
  onViewAllBadges?: () => void;
  className?: string;
}

export const StudentProfileCard: React.FC<StudentProfileCardProps> = ({
  player,
  overrideFrameId,
  currentCosmetics,
  pioneerRank,
  isCurrentPlayer = false,
  onViewAllBadges,
  className = ''
}) => {
  const stats = extractStatsFromPlayer(player);
  const playerRank = calculatePlayerRank(stats.points);

  // Determina a moldura ativa (prioridade: override > equipado no currentCosmetics > salvo no cardFrame > basic)
  const rawFrameId =
    overrideFrameId ||
    (isCurrentPlayer && currentCosmetics?.equippedCardFrame) ||
    (player as any).cardFrame ||
    (player as any).cosmetics?.equippedCardFrame ||
    'basic';
  const frameConfig = CARD_FRAME_CONFIGS[rawFrameId as CardFrameId] || CARD_FRAME_CONFIGS.basic;

  // Calcula insígnias dinâmicas
  const { allBadges, featuredBadges } = calculatePlayerBadges(player, pioneerRank);

  // Extrai nome, apelido, avatar e turma
  const isGameState = 'totalBytesEarned' in player;
  const gs = isGameState ? (player as GameState) : null;
  const le = !isGameState ? (player as Partial<LeaderboardEntry>) : null;

  const displayName = isGameState
    ? gs?.studentNickname || gs?.studentName || 'Digitador'
    : le?.apelido || le?.nome || 'Digitador';

  const fullRealName = isGameState ? gs?.studentName : le?.nome;
  const avatar = isGameState ? gs?.studentAvatar || '🐧' : le?.avatar || '👩‍💻';
  const turma = isGameState ? gs?.studentClass || 'Sem Turma' : le?.turma || 'Geral';
  const serieLabel = getSerieLabelFromTurma(turma);

  const rpgClassKey = stats.rpgClass;
  const rpgClassDef = rpgClassKey && (RPG_CLASSES as any)[rpgClassKey] ? (RPG_CLASSES as any)[rpgClassKey] : null;

  return (
    <div
      className={`relative w-full max-w-[370px] rounded-3xl overflow-hidden p-[2px] transition-all duration-300 select-none ${
        frameConfig.id === 'foil'
          ? 'bg-gradient-to-tr from-pink-500 via-amber-300 via-cyan-400 to-purple-600 shadow-[0_0_35px_rgba(236,72,153,0.4)]'
          : frameConfig.borderClass
      } ${className}`}
    >
      {/* Container Interno do Card */}
      <div
        className={`relative w-full h-full rounded-[22px] p-4 sm:p-5 flex flex-col justify-between bg-gradient-to-b ${frameConfig.bgGradient} overflow-hidden`}
      >
        {/* EFEITO OVERLAY ESPECIAL: Foil Holográfico (Reflexo de Luz Diagonal) */}
        {frameConfig.overlayEffect === 'foil_shine' && (
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full animate-[shimmer_3.5s_infinite]"
            style={{
              transform: 'skewX(-20deg)',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4) 50%, transparent)'
            }}
          />
        )}

        {/* EFEITO OVERLAY ESPECIAL: Cyber Neon Glow */}
        {frameConfig.overlayEffect === 'neon_pulse' && (
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400 via-transparent to-pink-500 animate-pulse" />
        )}

        {/* EFEITO OVERLAY ESPECIAL: Ouro Imperial Partículas */}
        {frameConfig.overlayEffect === 'gold_sparkle' && (
          <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none bg-amber-400/10 rounded-full blur-2xl animate-pulse" />
        )}

        {/* EFEITO OVERLAY ESPECIAL: Magma Brasas */}
        {frameConfig.overlayEffect === 'magma_glow' && (
          <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none bg-gradient-to-t from-red-600/20 to-transparent" />
        )}

        {/* EFEITO OVERLAY ESPECIAL: Cósmico Nebulosa */}
        {frameConfig.overlayEffect === 'cosmic_stars' && (
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_50%_20%,rgba(168,85,247,0.3),transparent_70%)]" />
        )}

        {/* EFEITO OVERLAY ESPECIAL: Glitch Scanlines */}
        {frameConfig.overlayEffect === 'matrix_scan' && (
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,255,100,0.06)_50%)] bg-[length:100%_4px]" />
        )}

        {/* TOPO: Selo da Moldura & Identificação da Turma */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 relative z-10">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-base select-none">{frameConfig.icon}</span>
            <span className={`text-[10px] font-mono font-black uppercase tracking-wider truncate ${frameConfig.accentText}`}>
              {frameConfig.sealLabel}
            </span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/50 border border-white/10 text-zinc-300">
              {turma}
            </span>
          </div>
        </div>

        {/* IDENTIDADE DO ALUNO: Avatar, Apelido, Nome e Classes */}
        <div className="flex items-center gap-3.5 my-3.5 relative z-10">
          {/* Avatar com moldura temática */}
          <div className="relative shrink-0">
            <div
              className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-inner border-2 ${
                frameConfig.id === 'foil'
                  ? 'border-pink-400 bg-pink-950/40 shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                  : frameConfig.id === 'gold'
                  ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                  : frameConfig.id === 'neon'
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'border-white/20 bg-black/60 shadow-md'
              }`}
            >
              {avatar}
            </div>
            {pioneerRank && (
              <div
                className="absolute -top-2 -right-2 text-lg filter drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                title={`Pioneiro #${pioneerRank} da História do Colégio!`}
              >
                👑
              </div>
            )}
          </div>

          {/* Nome e Badges de Identidade */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-black text-white text-base sm:text-lg tracking-tight truncate leading-tight">
                {displayName}
              </h3>
              {isCurrentPlayer && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Você
                </span>
              )}
            </div>

            {fullRealName && fullRealName !== displayName && (
              <span className="text-[11px] font-mono text-zinc-400 truncate">
                {fullRealName}
              </span>
            )}

            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {/* Badge de Classe RPG */}
              {rpgClassDef && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${rpgClassDef.badgeBg} ${rpgClassDef.badgeBorder} ${rpgClassDef.badgeText}`}
                >
                  <span>{rpgClassDef.icon}</span>
                  <span>{rpgClassDef.name}</span>
                </span>
              )}

              {/* Tag de Série */}
              <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                {serieLabel}
              </span>
            </div>
          </div>
        </div>

        {/* FAIXA DE NÍVEL & PROGRESSO */}
        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 mb-3 relative z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl select-none">{playerRank.badge}</span>
            <div className="flex flex-col">
              <span className="text-xs font-black text-white flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Nv. {stats.level}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-amber-300 font-mono text-[11px]">{playerRank.title}</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {formatBytes(stats.points)} acumulados
              </span>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-[10px] text-zinc-500 block">Progresso</span>
            <span className="text-xs font-black text-emerald-400">{playerRank.progressPercent}%</span>
          </div>
        </div>

        {/* GRID DE ESTATÍSTICAS DO ALUNO (6 Métricas Relevantes) */}
        <div className="grid grid-cols-3 gap-1.5 mb-3 relative z-10 font-mono">
          <div className="p-2 rounded-xl bg-black/50 border border-white/5 text-center">
            <span className="text-[9px] text-sky-400 uppercase font-bold block">PPM Recorde</span>
            <span className="text-xs font-black text-white flex items-center justify-center gap-0.5 mt-0.5">
              <Zap className="w-3 h-3 text-sky-400 shrink-0" />
              <span>{Math.round(stats.bestWpm || stats.wpm)}</span>
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/50 border border-white/5 text-center">
            <span className="text-[9px] text-emerald-400 uppercase font-bold block">Precisão</span>
            <span className="text-xs font-black text-white flex items-center justify-center gap-0.5 mt-0.5">
              <Target className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{stats.accuracy || 100}%</span>
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/50 border border-white/5 text-center">
            <span className="text-[9px] text-orange-400 uppercase font-bold block">Max Combo</span>
            <span className="text-xs font-black text-white flex items-center justify-center gap-0.5 mt-0.5">
              <Flame className="w-3 h-3 text-orange-400 shrink-0" />
              <span>{stats.maxCombo || 0}x</span>
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/50 border border-white/5 text-center">
            <span className="text-[9px] text-purple-400 uppercase font-bold block">Duelos PvP</span>
            <span className="text-xs font-black text-white flex items-center justify-center gap-0.5 mt-0.5">
              <Swords className="w-3 h-3 text-purple-400 shrink-0" />
              <span>{stats.pvpWins || 0} vit.</span>
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/50 border border-white/5 text-center">
            <span className="text-[9px] text-amber-400 uppercase font-bold block">Corridas</span>
            <span className="text-xs font-black text-white flex items-center justify-center gap-0.5 mt-0.5">
              <Flag className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{stats.raceWins || 0} vit.</span>
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/50 border border-white/5 text-center">
            <span className="text-[9px] text-yellow-400 uppercase font-bold block">Conquistas</span>
            <span className="text-xs font-black text-white flex items-center justify-center gap-0.5 mt-0.5">
              <Award className="w-3 h-3 text-yellow-400 shrink-0" />
              <span>{stats.achievementsCount || 0}</span>
            </span>
          </div>
        </div>

        {/* VITRINE DE INSÍGNIAS (BADGES DE DESTAQUE) */}
        <div className="relative z-10 border-t border-white/10 pt-2.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${frameConfig.accentText}`} />
              <span className="text-[10px] font-mono font-black tracking-wider text-zinc-300 uppercase">
                Insígnias de Destaque ({allBadges.length})
              </span>
            </div>

            {onViewAllBadges && (
              <button
                type="button"
                onClick={onViewAllBadges}
                className="text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                Ver Todas →
              </button>
            )}
          </div>

          {featuredBadges.length === 0 ? (
            <div className="p-2 rounded-xl bg-black/40 text-center text-zinc-500 font-mono text-[10px]">
              Continue digitando para desbloquear insígnias de honra!
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {featuredBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-center gap-1.5 p-1.5 rounded-xl border ${badge.borderClass} ${badge.bgClass} ${
                    badge.glowClass || ''
                  } transition-transform hover:scale-[1.02] cursor-default`}
                  title={`${badge.title}: ${badge.description}`}
                >
                  <span className="text-lg select-none shrink-0">{badge.icon}</span>
                  <div className="flex flex-col min-w-0">
                    <span className={`text-[10px] font-bold font-mono truncate leading-tight ${badge.textClass}`}>
                      {badge.title}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-400 truncate leading-tight">
                      {badge.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RODAPÉ DO CARD: Crédito Escolar */}
        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-zinc-500 relative z-10">
          <span>Colégio Leopoldina</span>
          <span className={frameConfig.accentText}>{frameConfig.name}</span>
        </div>
      </div>
    </div>
  );
};
