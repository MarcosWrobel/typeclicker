import React, { useState, useMemo, useEffect } from 'react';
import { Trophy, X, CheckCircle2, Lock, Sparkles, Search, Coins, Layers, HelpCircle } from 'lucide-react';
import { GameState } from '../types';
import { AchievementCategory, AchievementDef } from '../types/achievements';
import { ACHIEVEMENTS_CATALOG } from '../constants/achievementsCatalog';
import { getAchievementProgress, getOverallAchievementsStats } from '../services/achievementEngine';
import { formatBytes } from '../utils/formatting';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
}

const CATEGORY_TABS: { id: 'all' | AchievementCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'Todas', icon: '🏆' },
  { id: 'speed', label: 'Velocidade & Combo', icon: '⚡' },
  { id: 'volume', label: 'Volume & Dedicação', icon: '📚' },
  { id: 'economy', label: 'Economia & Upgrades', icon: '💰' },
  { id: 'pedagogy', label: 'Pedagógico & Foco', icon: '🎯' },
  { id: 'collection', label: 'Cosméticos & Duelos', icon: '🎨' },
  { id: 'secret', label: 'Secretas', icon: '🔮' }
];

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  state
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | AchievementCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ESC para fechar modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const stats = useMemo(() => getOverallAchievementsStats(state), [state]);

  const filteredAchievements = useMemo(() => {
    return ACHIEVEMENTS_CATALOG.filter((ach) => {
      // Filtro de Categoria
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'secret') {
          if (!ach.isSecret) return false;
        } else {
          if (ach.category !== selectedCategory) return false;
        }
      }

      // Filtro de Busca
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = ach.title.toLowerCase().includes(q);
        const matchesDesc = ach.description.toLowerCase().includes(q);
        const matchesCat = ach.category.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesCat;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="bg-[#0e121a] border-2 border-amber-500/50 rounded-3xl max-w-4xl w-full h-[92vh] max-h-[850px] shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col text-zinc-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800/80 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-emerald-950/30 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-400/50 flex items-center justify-center text-amber-400 text-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] flex-shrink-0">
              🏆
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  Hall da Fama • Conquistas
                </span>
                <span className="text-[11px] text-zinc-400 font-mono font-semibold hidden md:inline">
                  Colégio Estadual Leopoldina
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5 truncate">
                <span>Galeria de Conquistas</span>
                <span className="text-xs font-mono font-normal text-zinc-400">
                  ({stats.unlocked}/{stats.total})
                </span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-400 hover:text-white transition cursor-pointer flex-shrink-0"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumo Global de Progresso */}
        <div className="px-4 sm:px-6 py-3 bg-[#0a0d13] border-b border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="text-xs text-zinc-400 font-medium">
              Progresso Geral:
            </div>
            <div className="text-sm font-black font-mono text-amber-400">
              {stats.unlocked} de {stats.total} ({stats.percent}%)
            </div>
          </div>

          <div className="w-full sm:w-64 h-2.5 bg-zinc-800/80 rounded-full overflow-hidden border border-zinc-700/50">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>

        {/* Barra de Filtros & Pesquisa */}
        <div className="p-3 sm:px-6 sm:py-3 border-b border-zinc-800/80 bg-zinc-950/40 flex flex-col sm:flex-row gap-2.5 items-center justify-between flex-shrink-0">
          {/* Abas com overflow horizontal */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const count = tab.id === 'all'
                ? ACHIEVEMENTS_CATALOG.length
                : tab.id === 'secret'
                ? ACHIEVEMENTS_CATALOG.filter(a => a.isSecret).length
                : ACHIEVEMENTS_CATALOG.filter(a => a.category === tab.id).length;

              const isSelected = selectedCategory === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border-zinc-800'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Campo de Busca */}
          <div className="relative w-full sm:w-56 flex-shrink-0">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conquista..."
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-900/90 border border-zinc-700/60 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/70 transition"
            />
          </div>
        </div>

        {/* Lista de Conquistas com Grid Responsivo */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 min-w-0 scrollbar-thin">
          {filteredAchievements.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-zinc-500 gap-2">
              <HelpCircle className="w-8 h-8 text-zinc-600" />
              <p className="text-sm">Nenhuma conquista encontrada com esse filtro.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredAchievements.map((def) => {
                const prog = getAchievementProgress(def, state);
                const isSecretLocked = def.isSecret && !prog.isUnlocked;

                return (
                  <div
                    key={def.id}
                    className={`relative overflow-hidden rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                      prog.isUnlocked
                        ? 'bg-gradient-to-br from-amber-950/20 via-[#131720] to-[#0c0f16] border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                        : isSecretLocked
                        ? 'bg-[#0f0c18]/80 border-purple-900/40 text-zinc-400'
                        : 'bg-[#10141d]/70 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {/* Linha Superior: Ícone, Título e Categoria */}
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl select-none flex-shrink-0 border ${
                          prog.isUnlocked
                            ? 'bg-gradient-to-br from-amber-500/25 to-amber-600/10 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-3xl'
                            : isSecretLocked
                            ? 'bg-purple-950/30 border-purple-800/40 text-purple-400 text-xl'
                            : 'bg-zinc-800/50 border-zinc-700/50 grayscale opacity-70'
                        }`}
                      >
                        {isSecretLocked ? '🔮' : def.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.2 rounded-full border ${
                            prog.isUnlocked
                              ? 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                              : isSecretLocked
                              ? 'bg-purple-950/60 text-purple-400 border-purple-800/40'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700/40'
                          }`}>
                            {isSecretLocked ? 'Secreta' : def.category}
                          </span>

                          {prog.isUnlocked && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Conquistado!</span>
                            </span>
                          )}
                        </div>

                        <h4 className={`text-sm font-black mt-1 truncate ${
                          prog.isUnlocked ? 'text-white' : isSecretLocked ? 'text-purple-300' : 'text-zinc-300'
                        }`}>
                          {isSecretLocked ? 'Conquista Misteriosa' : def.title}
                        </h4>

                        <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                          {isSecretLocked
                            ? (def.hint ? `💡 Dica: ${def.hint}` : 'Continue praticando para desvendar este segredo.')
                            : def.description}
                        </p>
                      </div>
                    </div>

                    {/* Linha Inferior: Progresso e Recompensas */}
                    <div className="mt-3.5 pt-3 border-t border-zinc-800/60 flex flex-col gap-2">
                      {!prog.isUnlocked && (
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-1">
                            <span>Progresso</span>
                            <span>{prog.current} / {prog.max} ({prog.percent}%)</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden border border-zinc-700/30">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 rounded-full"
                              style={{ width: `${prog.percent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {/* Recompensas */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-zinc-500 font-mono uppercase">Recompensa:</span>
                          {def.reward.bytes !== undefined && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-400">
                              <Sparkles className="w-2.5 h-2.5" />
                              +{formatBytes(def.reward.bytes)}
                            </span>
                          )}
                          {def.reward.levelTokens !== undefined && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300">
                              <Coins className="w-2.5 h-2.5" />
                              +{def.reward.levelTokens} {def.reward.levelTokens === 1 ? 'Ficha' : 'Fichas'}
                            </span>
                          )}
                          {def.reward.quantumFragments !== undefined && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300">
                              <Layers className="w-2.5 h-2.5" />
                              +{def.reward.quantumFragments} Frag.
                            </span>
                          )}
                        </div>

                        {/* Status ou Data de Desbloqueio */}
                        {prog.isUnlocked && prog.unlockedAt && (
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {new Date(prog.unlockedAt).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
