import React from 'react';
import {
  Trophy,
  Zap,
  Flame,
  Database,
  Swords,
  Flag,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { LeaderboardMetric, METRIC_TABS } from './LeaderboardModal';
import { useLeaderboardPodium } from '../hooks/useLeaderboardPodium';
import { formatBytes } from '../utils/formatting';

export interface TopPodiumWidgetProps {
  currentUserId?: string;
  onOpenLeaderboardTab?: (metric: LeaderboardMetric) => void;
  onSelectPlayer?: (player: any) => void;
}

export const TopPodiumWidget: React.FC<TopPodiumWidgetProps> = ({
  currentUserId,
  onOpenLeaderboardTab,
  onSelectPlayer
}) => {
  const {
    currentMetric,
    top3,
    rotationRemaining,
    rotationProgress,
    syncRemaining,
    isLoading,
    isPaused,
    togglePause,
    nextMetric,
    prevMetric,
    refreshNow
  } = useLeaderboardPodium();

  const metricDef = METRIC_TABS.find((m) => m.id === currentMetric) || METRIC_TABS[0];
  const MetricIcon = metricDef.icon;

  const formatSyncCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMetricValue = (player: any) => {
    switch (currentMetric) {
      case 'level':
        return `Nv. ${player.level}`;
      case 'wpm':
        return `${Math.round(player.bestWpm || player.wpm || 0)} PPM`;
      case 'combo':
        return `${player.maxCombo || 0}x`;
      case 'bytes':
        return formatBytes(player.points);
      case 'pvp':
        return `${player.pvpWins || 0} vit.`;
      case 'races':
        return `${player.raceWins || 0} vit.`;
      default:
        return `${player.points || 0}`;
    }
  };

  return (
    <div className={`w-full rounded-2xl bg-[#090b10] border ${metricDef.badgeBorder} flex flex-col overflow-hidden shadow-lg transition-all duration-300`}>
      {/* Barra de Progresso da Rotação Visual */}
      <div className="w-full h-1 bg-zinc-800/80 overflow-hidden relative">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isPaused ? 'bg-zinc-600' : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400'
          }`}
          style={{ width: `${isPaused ? 100 : rotationProgress}%` }}
        />
      </div>

      {/* Header do Widget */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0e121a] border-b border-white/5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className={`w-6 h-6 rounded-lg ${metricDef.badgeBg} ${metricDef.badgeBorder} border flex items-center justify-center shrink-0`}>
            <MetricIcon className={`w-3.5 h-3.5 ${metricDef.color}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-black text-white tracking-wide truncate flex items-center gap-1">
              <span>TOP 3 • {metricDef.shortLabel.toUpperCase()}</span>
            </span>
          </div>
        </div>

        {/* Controles de Navegação e Cronômetro */}
        <div className="flex items-center gap-1 shrink-0">
          <span
            className="text-[10px] font-mono text-zinc-400 font-bold bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/50"
            title={isPaused ? 'Rotação pausada' : `Próximo ranking em ${rotationRemaining}s`}
          >
            {isPaused ? 'PAUSA' : `${rotationRemaining}s`}
          </span>

          <button
            type="button"
            onClick={togglePause}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            title={isPaused ? 'Retomar rotação automática' : 'Pausar nesta métrica'}
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3" />}
          </button>

          <button
            type="button"
            onClick={prevMetric}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            title="Ranking anterior"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={nextMetric}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            title="Próximo ranking"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Lista do Pódio Top 3 */}
      <div className="flex flex-col p-2 gap-1.5 bg-[#090b10]">
        {isLoading && top3.length === 0 ? (
          <div className="py-4 text-center text-xs text-zinc-500 font-mono flex items-center justify-center gap-1.5">
            <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
            <span>Sintonizando pódio...</span>
          </div>
        ) : top3.length === 0 ? (
          <div className="py-3 text-center text-xs text-zinc-500 font-mono">
            Nenhum competidor registrado ainda.
          </div>
        ) : (
          top3.map((player, idx) => {
            const isUser = player.userId === currentUserId;
            const medals = ['🥇', '🥈', '🥉'];
            const medalGradients = [
              'border-amber-500/50 bg-amber-500/10 text-amber-300',
              'border-slate-400/50 bg-slate-400/10 text-slate-200',
              'border-amber-700/50 bg-amber-700/10 text-amber-500'
            ];

            const displayName = player.apelido || player.nome;
            return (
              <div
                key={player.userId}
                onClick={() => {
                  if (onSelectPlayer) {
                    onSelectPlayer(player);
                  } else if (onOpenLeaderboardTab) {
                    onOpenLeaderboardTab(currentMetric);
                  }
                }}
                className={`flex items-center justify-between px-2 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  isUser
                    ? 'border-emerald-500/60 bg-emerald-500/15 shadow-[0_0_10px_rgba(16,185,129,0.2)] ring-1 ring-emerald-400/30'
                    : 'border-white/5 bg-[#12151f] hover:bg-zinc-800/60 hover:border-amber-500/40'
                }`}
                title={
                  onSelectPlayer
                    ? `Clique para ver o Card Colecionável de ${displayName}`
                    : `Clique para abrir o Ranking de ${metricDef.label}`
                }
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs font-bold shrink-0 ${medalGradients[idx] || ''}`}>
                    {medals[idx] || `${idx + 1}º`}
                  </div>

                  <span className="text-sm shrink-0 select-none">
                    {player.avatar || '👩‍💻'}
                  </span>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1 truncate">
                      <span className="text-xs font-bold text-zinc-200 truncate">
                        {player.apelido || player.nome}
                      </span>
                      {isUser && (
                        <span className="text-[9px] font-mono font-bold bg-emerald-500/30 text-emerald-300 px-1 rounded border border-emerald-500/40 shrink-0">
                          Você
                        </span>
                      )}
                    </div>
                    {player.turma && (
                      <span className="text-[10px] font-mono text-zinc-500 truncate leading-none">
                        Turma {player.turma}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-2">
                  <span className={`text-xs font-mono font-black ${metricDef.color}`}>
                    {getMetricValue(player)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer do Widget: Status de Sincronização Cloud & Atalho */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-[#0b0e14] border-t border-white/5 text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-1.5" title="Sincronização em nuvem segura para o plano gratuito Spark">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sync: {formatSyncCountdown(syncRemaining)}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              refreshNow();
            }}
            className="p-0.5 rounded hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            title="Sincronizar agora da nuvem"
          >
            <RefreshCw className="w-2.5 h-2.5" />
          </button>
        </div>

        {onOpenLeaderboardTab && (
          <button
            type="button"
            onClick={() => onOpenLeaderboardTab(currentMetric)}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition cursor-pointer hover:underline"
            title={`Abrir ranking completo de ${metricDef.label}`}
          >
            <span>Ver Rank</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    </div>
  );
};
