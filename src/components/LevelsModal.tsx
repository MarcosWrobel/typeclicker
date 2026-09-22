import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Trophy, X, CheckCircle2, Lock, Sparkles, Search, ArrowRight, Target, ChevronRight, Award, GraduationCap, Crown } from 'lucide-react';
import { ALL_LEVELS, LEVEL_TIERS, LevelDef, PlayerRank } from '../data/levels';
import { formatBytes } from '../utils/formatting';
import { Level100PioneerSlot } from '../services/firebaseService';

interface LevelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRank: PlayerRank;
  totalBytesEarned: number;
  studentName?: string;
  studentAvatar?: string;
  pioneers?: Level100PioneerSlot[];
}

export const LevelsModal: React.FC<LevelsModalProps> = ({
  isOpen,
  onClose,
  currentRank,
  totalBytesEarned,
  studentName,
  studentAvatar = '🐧',
  pioneers
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const currentLevelRef = useRef<HTMLDivElement | null>(null);
  const listContainerRef = useRef<HTMLDivElement | null>(null);

  // Filter levels based on selected tier and search
  const filteredLevels = useMemo(() => {
    return ALL_LEVELS.filter((lvl) => {
      // Tier filter
      if (selectedTier !== 'all') {
        const tierObj = LEVEL_TIERS.find((t) => t.id === selectedTier);
        if (tierObj) {
          const [minL, maxL] = tierObj.range;
          if (lvl.level < minL || lvl.level > maxL) {
            return false;
          }
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = lvl.title.toLowerCase().includes(q);
        const matchesLevel = lvl.level.toString() === q || `nv ${lvl.level}`.includes(q) || `nivel ${lvl.level}`.includes(q);
        const matchesDesc = lvl.description.toLowerCase().includes(q);
        const matchesTier = lvl.tier.toLowerCase().includes(q);
        return matchesTitle || matchesLevel || matchesDesc || matchesTier;
      }

      return true;
    });
  }, [selectedTier, searchQuery]);

  // Scroll to current level in list
  const scrollToCurrentLevel = () => {
    // If currently filtered out, reset to all
    setSelectedTier('all');
    setSearchQuery('');
    setTimeout(() => {
      if (currentLevelRef.current) {
        currentLevelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
  };

  // Keyboard escape
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

  if (!isOpen) return null;

  const bytesNeededForNext = Math.max(0, currentRank.nextBytes - totalBytesEarned);
  const globalProgress = ((currentRank.level / 100) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="bg-[#0e121a] border-2 border-amber-500/50 rounded-3xl max-w-4xl w-full h-[92vh] max-h-[850px] shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col text-zinc-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800/80 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-emerald-950/30 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-400/50 flex items-center justify-center text-amber-400 text-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                  Progresso do Aluno • Níveis 1 ao 100
                </span>
                <span className="text-[11px] text-emerald-400 font-mono font-semibold hidden md:inline">
                  {currentRank.level} de 100 Níveis ({globalProgress}%)
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white mt-0.5 flex items-center gap-2">
                <span>Quadro de Níveis &amp; Conquistas</span>
              </h2>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5 flex-wrap">
                <span className="text-emerald-300 font-medium">Colégio Estadual Leopoldina Bittencourt Pedroso</span>
                <span className="text-zinc-600">•</span>
                <span className="text-amber-300 font-medium">Prof. Marcos Wrobel</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer border border-zinc-700/60"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Level Hero Banner */}
        <div className="p-4 sm:p-5 bg-[#090c12] border-b border-zinc-800/80 flex-shrink-0">
          <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900/90 to-emerald-950/30 border border-amber-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Student & Rank info */}
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-md">
                  {currentRank.badge}
                </div>
                <div className="absolute -bottom-1 -right-1 text-xs bg-emerald-500 text-emerald-950 font-black rounded-full px-1.5 py-0.2 border border-emerald-200">
                  Nv.{currentRank.level}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    Seu Nível Atual
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {studentAvatar} {studentName || 'Aluno'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                  Nv. {currentRank.level}: {currentRank.title}
                </h3>
                <p className="text-xs text-zinc-400">
                  {currentRank.description}
                </p>
              </div>
            </div>

            {/* Progress to next level */}
            <div className="w-full md:w-80 flex flex-col justify-end bg-black/40 border border-zinc-800 p-3 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-zinc-400 font-mono">
                  {currentRank.isMaxLevel ? 'Nível Máximo Alcançado!' : `Próximo: Nv. ${currentRank.level + 1}`}
                </span>
                <span className="font-mono font-black text-amber-400">
                  {currentRank.progressPercent}% XP
                </span>
              </div>
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/60">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  style={{ width: `${currentRank.progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1.5 font-mono">
                <span>Total: <strong className="text-emerald-300">{formatBytes(totalBytesEarned)}</strong></span>
                {!currentRank.isMaxLevel && (
                  <span>Faltam: <strong className="text-amber-300">{formatBytes(bytesNeededForNext)}</strong></span>
                )}
              </div>
            </div>

            {/* Quick jump to current level */}
            <button
              onClick={scrollToCurrentLevel}
              className="flex-shrink-0 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold font-mono text-xs flex items-center gap-1.5 transition shadow cursor-pointer w-full md:w-auto justify-center"
            >
              <Target className="w-4 h-4" />
              <span>Ver no Quadro</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="p-3 sm:p-4 bg-[#0a0d14] border-b border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0">
          {/* Tier Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin max-w-full">
            {LEVEL_TIERS.map((tier) => {
              const isActive = selectedTier === tier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition cursor-pointer border ${
                    isActive
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                      : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {tier.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar nível (ex: 50, Linux, Lenda)..."
              className="w-full bg-[#121620] border border-zinc-800 focus:border-amber-400 text-xs text-white rounded-xl pl-9 pr-3 py-2 outline-none transition font-sans placeholder:text-zinc-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Levels Grid (Scrollable) */}
        <div
          ref={listContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 sm:space-y-3 custom-scrollbar bg-[#090b10]"
        >
          {filteredLevels.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <p className="text-sm">Nenhum nível encontrado com a busca "{searchQuery}".</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedTier('all'); }}
                className="mt-3 px-4 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-mono hover:bg-zinc-700"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            filteredLevels.map((lvl) => {
              const isCurrent = lvl.level === currentRank.level;
              const isUnlocked = lvl.level < currentRank.level;
              const isLocked = lvl.level > currentRank.level;
              const bytesToReach = Math.max(0, lvl.minBytes - totalBytesEarned);

              return (
                <div
                  key={lvl.level}
                  ref={isCurrent ? currentLevelRef : null}
                  className={`relative p-3.5 sm:p-4 rounded-2xl transition-all duration-200 border flex flex-col items-start justify-between gap-3 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-950/60 via-zinc-900 to-emerald-950/40 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/20'
                      : isUnlocked
                      ? 'bg-[#0f141e]/70 hover:bg-[#131926] border-emerald-500/30'
                      : 'bg-[#0a0d13]/60 hover:bg-[#0e121a] border-zinc-800/80 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
                    {/* Left: Level Badge & Title */}
                    <div className="flex items-center gap-3.5">
                      {/* Level Number & Badge */}
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl border ${
                          isCurrent
                            ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                            : isUnlocked
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-500'
                        }`}>
                          {lvl.badge}
                        </div>

                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-xs font-black px-2 py-0.5 rounded-md border ${
                              isCurrent
                                ? 'bg-amber-400 text-zinc-950 border-amber-300'
                                : isUnlocked
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                            }`}>
                              #{lvl.level.toString().padStart(2, '0')}
                            </span>
                            <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${lvl.tierColor}`}>
                              {lvl.tier}
                            </span>
                            {lvl.isMilestone && (
                              <span className="text-[9px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40 px-1.5 py-0.2 rounded">
                                ★ Marco
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-0.5">
                            <h4 className={`text-sm sm:text-base font-black ${
                              isCurrent ? 'text-amber-300' : isUnlocked ? 'text-white' : 'text-zinc-300'
                            }`}>
                              {lvl.title}
                            </h4>
                            {isCurrent && (
                              <span className="text-[10px] font-mono font-extrabold bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                Você está aqui!
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
                            {lvl.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Requirements & Status */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800/60">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-mono text-zinc-400 block">
                          Requer no total
                        </span>
                        <span className={`text-xs sm:text-sm font-mono font-black ${
                          isCurrent ? 'text-amber-300' : isUnlocked ? 'text-emerald-400' : 'text-zinc-300'
                        }`}>
                          {formatBytes(lvl.minBytes)}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        {isUnlocked && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Conquistado</span>
                          </div>
                        )}

                        {isCurrent && (
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-zinc-950 text-xs font-mono font-black shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                              <Sparkles className="w-3.5 h-3.5 text-zinc-950 animate-spin" />
                              <span>Nv. Atual ({currentRank.progressPercent}%)</span>
                            </div>
                          </div>
                        )}

                        {isLocked && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
                            <Lock className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Faltam {formatBytes(bytesToReach)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Galeria de Pioneiros da História no Nível 100 */}
                  {lvl.level === 100 && pioneers && pioneers.length > 0 && (
                    <div className="w-full mt-3 pt-3 border-t border-amber-500/30 flex flex-col gap-2">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div className="flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
                          <span className="text-xs font-mono font-black text-amber-300 tracking-wider">
                            PIONEIROS DA HISTÓRIA • TOP 3
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {pioneers.filter((p) => p.isFilled).length} de 3 Vagas Preenchidas
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {pioneers.map((slot) => {
                          if (slot.isFilled && slot.player) {
                            const medal = slot.rank === 1 ? '🥇 1º' : slot.rank === 2 ? '🥈 2º' : '🥉 3º';
                            const borderCol =
                              slot.rank === 1
                                ? 'border-amber-400/70 bg-amber-500/10'
                                : slot.rank === 2
                                ? 'border-slate-400/70 bg-slate-500/10'
                                : 'border-amber-700/70 bg-amber-800/10';
                            return (
                              <div
                                key={slot.rank}
                                className={`p-2.5 rounded-xl border ${borderCol} flex items-center gap-2`}
                              >
                                <span className="text-xl select-none">{slot.player.avatar || '👑'}</span>
                                <div className="flex flex-col min-w-0 text-left font-mono">
                                  <span className="text-xs font-bold text-white truncate">
                                    {medal} {slot.player.apelido || slot.player.nome}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 truncate">
                                    Turma {slot.player.turma || 'Geral'}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div
                              key={slot.rank}
                              className="p-2.5 rounded-xl border border-dashed border-amber-500/30 bg-black/40 flex items-center gap-2 text-zinc-500 font-mono"
                            >
                              <Lock className="w-3.5 h-3.5 text-amber-500/50" />
                              <span className="text-[11px] text-amber-300/70 italic">
                                Vaga #{slot.rank} em Aberto
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-zinc-800/80 bg-[#0c0f16] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 flex-shrink-0">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Dica do Prof. Marcos Wrobel:</strong> Continue digitando no teclado ABNT2 e comprando melhorias na loja para acumular Bytes e desbloquear até a <strong>Lenda Suprema (Nv. 100)</strong>!
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono font-bold text-xs transition cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
