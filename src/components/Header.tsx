import React from 'react';
import { Volume2, VolumeX, BarChart3, RefreshCw, Trophy, Cloud, Pause, Play, Shield, Eye } from 'lucide-react';
import { GameState } from '../types';
import { calculatePlayerRank } from '../utils/formatting';

interface HeaderProps {
  state: GameState;
  isPaused?: boolean;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  onTogglePause?: () => void;
  onToggleSound: () => void;
  onOpenMetrics: () => void;
  onOpenAccessibility?: () => void;
  onOpenPrestige?: () => void;
  onOpenStudentModal?: () => void;
  onOpenLevels?: () => void;
  onOpenHelp?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenAdmin?: () => void;
  onOpenCosmetics?: () => void;
  onOpenArena?: () => void;
  onResetGame: () => void;
  isSaving: boolean;
  isOnline?: boolean;
  hasPendingChanges?: boolean;
  onSaveProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  isPaused = false,
  isAdmin = false,
  isSuperAdmin = false,
  onTogglePause,
  onToggleSound,
  onOpenMetrics,
  onOpenAccessibility,
  onOpenStudentModal,
  onOpenLevels,
  onOpenLeaderboard,
  onOpenAdmin,
  onOpenCosmetics,
  onOpenArena,
  onResetGame,
  isSaving,
  isOnline = true,
  hasPendingChanges = false,
  onSaveProgress
}) => {
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const playerRank = calculatePlayerRank(state.totalBytesEarned);

  return (
    <header className="border-b border-white/10 bg-[#12151c]/95 backdrop-blur px-3 sm:px-5 py-2.5 sticky top-0 z-40 w-full min-w-0 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 w-full min-w-0 flex-wrap lg:flex-nowrap">
        
        {/* Identidade Institucional & Nível Mobile */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-sky-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-black text-base sm:text-lg shadow-[0_0_15px_rgba(16,185,129,0.25)] flex-shrink-0 select-none">
            ⌨️
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-base sm:text-lg tracking-tight text-white whitespace-nowrap flex items-center">
              <span>TypeClicker</span>
              <span className="text-emerald-400 font-black ml-1.5">- Leopoldina</span>
            </h1>
            <p className="text-[11px] text-zinc-300 flex items-center gap-1.5 leading-tight mt-0.5 truncate max-w-[280px] sm:max-w-md lg:max-w-xl">
              <span className="font-semibold text-emerald-300/90 hidden md:inline">Colégio Estadual Leopoldina Bittencourt Pedroso</span>
              <span className="font-semibold text-emerald-300/90 md:hidden">Colégio Est. Leopoldina. B. Pedroso</span>
            </p>
          </div>

          {/* Badge de Nível Compacto (Mobile) */}
          {onOpenLevels && (
            <button
              type="button"
              onClick={onOpenLevels}
              className="md:hidden flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-500/50 text-xs font-bold shadow-sm cursor-pointer ml-1"
              title="Ver Quadro de Níveis 1 ao 100"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Nv.{playerRank.level}</span>
            </button>
          )}
        </div>

        {/* Navegação e Controles Rápidos */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end flex-shrink-0">
          {/* Métricas Pedagógicas */}
          <button
            type="button"
            onClick={onOpenMetrics}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 text-sky-200 border border-sky-600/40 text-xs font-semibold transition shadow-sm cursor-pointer"
            title="Relatório pedagógico, PPM e precisão"
          >
            <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Métricas</span>
          </button>

          {/* Acessibilidade & Baixa Visão (A+ / A-) */}
          {onOpenAccessibility && (
            <button
              type="button"
              onClick={onOpenAccessibility}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm cursor-pointer ${
                state.accessibility?.highContrast || state.accessibility?.textScale !== 'normal'
                  ? 'bg-amber-500 text-black border-amber-400 font-black shadow-amber-500/20'
                  : 'bg-zinc-900/90 hover:bg-zinc-800 text-amber-300 hover:text-amber-200 border-zinc-800 hover:border-amber-500/40'
              }`}
              title="Acessibilidade e Baixa Visão (Ampliar Texto, Alto Contraste)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px] font-black">A+</span>
            </button>
          )}

          {/* Separador vertical discreto */}
          <div className="h-5 w-[1px] bg-zinc-800 hidden sm:block" />

          {/* Sincronização em Nuvem */}
          <button
            type="button"
            onClick={onSaveProgress}
            disabled={isSaving}
            className={`flex items-center gap-1.5 text-[11px] font-bold px-2 sm:px-2.5 py-1.5 rounded-xl border transition cursor-pointer shadow-sm disabled:opacity-50 ${
              !isOnline
                ? 'bg-amber-950/60 text-amber-200 border-amber-500/50 hover:bg-amber-900'
                : isSaving
                ? 'bg-sky-950/60 text-sky-200 border-sky-500/50'
                : hasPendingChanges
                ? 'bg-sky-950/40 text-sky-300 border-sky-600/40 hover:bg-sky-900'
                : 'bg-zinc-900/60 text-zinc-300 border-zinc-700/50 hover:text-white hover:bg-zinc-800'
            }`}
            title={
              !isOnline
                ? 'Sem internet: dados gravados localmente!'
                : isSaving
                ? 'Sincronizando com Firestore...'
                : hasPendingChanges
                ? 'Salvamento com agendamento ativo (Clique para salvar agora)'
                : 'Progresso sincronizado com a nuvem'
            }
          >
            <Cloud className={`w-3.5 h-3.5 ${isSaving ? 'animate-pulse text-sky-400' : !isOnline ? 'text-amber-400' : 'text-sky-400'}`} />
            <span className="hidden xl:inline">
              {!isOnline ? 'Offline' : isSaving ? 'Salvando...' : hasPendingChanges ? 'Nuvem (Pendente)' : 'Nuvem Ok'}
            </span>
          </button>

          {/* Botão de Pause / Retomar */}
          {onTogglePause && (
            <button
              type="button"
              onClick={onTogglePause}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm cursor-pointer ${
                isPaused
                  ? 'bg-amber-500 text-black border-amber-400 hover:bg-amber-400 animate-pulse'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800'
              }`}
              title={isPaused ? 'Retomar Jogo (ESC)' : 'Pausar Jogo (ESC)'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden sm:inline">{isPaused ? 'Retomar' : 'Pausar'}</span>
              <kbd className="px-1.5 py-0.2 rounded bg-black/40 text-amber-300 border border-white/10 font-mono text-[9px] font-bold">
                ESC
              </kbd>
            </button>
          )}

          {/* Som On/Off */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-1.5 sm:p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition cursor-pointer"
            title={state.soundEnabled ? 'Silenciar Áudio' : 'Ativar Sintetizador de Áudio'}
          >
            {state.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          {/* Admin Panel Button */}
          {isAdmin && onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-200 border border-rose-600/40 text-xs font-semibold transition shadow-sm cursor-pointer"
              title="Painel do Professor / Administrador"
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Admin</span>
            </button>
          )}

          {/* Reiniciar Jogo Local */}
          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-zinc-900 hover:bg-red-950/50 text-zinc-400 hover:text-red-400 border border-zinc-800 transition cursor-pointer"
              title="Reiniciar Progresso Local"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-red-950/40 p-1 rounded-xl border border-red-900/50">
              <span className="text-[10px] text-zinc-300 hidden sm:inline px-1">Zerar?</span>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetGame();
                }}
                className="px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold transition cursor-pointer"
              >
                Sim
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold transition cursor-pointer"
              >
                Não
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

