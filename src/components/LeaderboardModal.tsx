import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Medal, Loader2, Users, Search, Filter, Sparkles, GraduationCap } from 'lucide-react';
import { getGlobalLeaderboard, LeaderboardEntry, isStaffMember } from '../services/firebaseService';
import { formatBytes } from '../utils/formatting';
import { ALL_LEVELS } from '../data/levels';
import {
  SERIES_CONFIG,
  SerieId,
  getSerieIdFromTurma,
  getSerieLabelFromTurma,
  SCHOOL_CLASSES_CONFIG
} from '../constants/school';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  currentUserClass?: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  currentUserClass
}) => {
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros de Série, Turma e Busca
  const [selectedSerie, setSelectedSerie] = useState<SerieId>('geral');
  const [selectedTurma, setSelectedTurma] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadLeaderboard(false);
      // Se o aluno possui turma cadastrada, podemos opcionalmente deixá-lo no geral ou manter 'geral'
    }
  }, [isOpen]);

  const loadLeaderboard = async (force: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getGlobalLeaderboard(force);
      // Garantia estrita: nenhum professor ou admin aparece nos rankings
      const cleanStudentsOnly = data.filter((player) => !isStaffMember(player));
      setRankings(cleanStudentsOnly);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar ranking escolar.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeForLevel = (level: number) => {
    const lvl = ALL_LEVELS.find((l) => l.level === level) || ALL_LEVELS[0];
    return lvl.badge;
  };

  // Série do usuário atual para destaque e atalho
  const currentUserSerie = useMemo(() => {
    return currentUserClass ? getSerieIdFromTurma(currentUserClass) : null;
  }, [currentUserClass]);

  const currentUserSerieLabel = useMemo(() => {
    return currentUserClass ? getSerieLabelFromTurma(currentUserClass) : null;
  }, [currentUserClass]);

  // Contagem de alunos por série
  const countsBySerie = useMemo(() => {
    const counts: Record<SerieId, number> = {
      geral: rankings.length,
      '6ano': 0,
      '7ano': 0,
      '8ano': 0,
      '9ano': 0,
      em: 0,
      outras: 0
    };

    rankings.forEach((player) => {
      const sId = getSerieIdFromTurma(player.turma);
      if (counts[sId] !== undefined) {
        counts[sId]++;
      } else {
        counts.outras++;
      }
    });

    return counts;
  }, [rankings]);

  // Turmas disponíveis para a série atualmente selecionada
  const availableTurmasForActiveSerie = useMemo(() => {
    if (selectedSerie === 'geral') {
      // Coleta todas as turmas únicas presentes nos registros
      const set = new Set<string>();
      rankings.forEach((r) => {
        if (r.turma && r.turma.trim()) set.add(r.turma.trim());
      });
      return Array.from(set).sort();
    }

    const serieDef = SERIES_CONFIG.find((s) => s.id === selectedSerie);
    const standard = serieDef?.classes || [];
    const set = new Set<string>(standard);

    rankings.forEach((r) => {
      if (r.turma && getSerieIdFromTurma(r.turma) === selectedSerie) {
        set.add(r.turma.trim());
      }
    });

    return Array.from(set).sort();
  }, [selectedSerie, rankings]);

  // Troca de série redefine o filtro secundário de turma
  const handleSelectSerie = (serieId: SerieId) => {
    setSelectedSerie(serieId);
    setSelectedTurma('todas');
  };

  // Filtragem dos jogadores
  const filteredRankings = useMemo(() => {
    return rankings.filter((player) => {
      // 1. Filtro de Série
      if (selectedSerie !== 'geral') {
        const playerSerie = getSerieIdFromTurma(player.turma);
        if (playerSerie !== selectedSerie) return false;
      }

      // 2. Filtro de Turma
      if (selectedTurma !== 'todas') {
        const cleanTurma = (player.turma || '').trim().toLowerCase();
        if (cleanTurma !== selectedTurma.trim().toLowerCase()) return false;
      }

      // 3. Busca por nome, apelido ou turma
      if (searchQuery.trim()) {
        const term = searchQuery.trim().toLowerCase();
        const nomeMatch = (player.nome || '').toLowerCase().includes(term);
        const apelidoMatch = (player.apelido || '').toLowerCase().includes(term);
        const turmaMatch = (player.turma || '').toLowerCase().includes(term);
        if (!nomeMatch && !apelidoMatch && !turmaMatch) return false;
      }

      return true;
    });
  }, [rankings, selectedSerie, selectedTurma, searchQuery]);

  // Colocação do usuário atual no Geral e na sua Série
  const userGlobalPlacement = useMemo(() => {
    if (!currentUserId) return null;
    const idx = rankings.findIndex((p) => p.userId === currentUserId);
    return idx >= 0 ? idx + 1 : null;
  }, [rankings, currentUserId]);

  const userSeriePlacement = useMemo(() => {
    if (!currentUserId || !currentUserSerie) return null;
    const inSerie = rankings.filter((p) => getSerieIdFromTurma(p.turma) === currentUserSerie);
    const idx = inSerie.findIndex((p) => p.userId === currentUserId);
    return idx >= 0 ? idx + 1 : null;
  }, [rankings, currentUserId, currentUserSerie]);

  const activeSerieConfig = SERIES_CONFIG.find((s) => s.id === selectedSerie) || SERIES_CONFIG[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-[#10131a] border-2 border-emerald-500/40 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)] flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden"
          >
            {/* Top Bar / Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-[#141822]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2">
                    <span>RANKING ESCOLAR</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Leopoldina
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Classificação por desempenho e velocidade de digitação
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                  title="Fechar Ranking"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Seletor de Séries em Abas */}
            <div className="flex-shrink-0 bg-[#0c0e14] border-b border-white/10 px-2 sm:px-6 pt-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-max pb-2">
                {SERIES_CONFIG.map((serie) => {
                  const isActive = selectedSerie === serie.id;
                  const count = countsBySerie[serie.id] || 0;

                  return (
                    <button
                      key={serie.id}
                      type="button"
                      onClick={() => handleSelectSerie(serie.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none border ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-950/80 to-teal-950/80 text-emerald-300 border-emerald-500/60 shadow-[0_0_14px_rgba(16,185,129,0.25)]'
                          : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800/60'
                      }`}
                      title={serie.description}
                    >
                      <span className="text-sm select-none">{serie.icon}</span>
                      <span>{serie.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700/50'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Barra de Filtro de Turma, Busca e Atalho Minha Série */}
            <div className="flex-shrink-0 px-3 sm:px-6 py-2.5 bg-[#12151f] border-b border-white/5 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                {/* Seletor de Turma Específica */}
                <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs">
                  <Filter className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <select
                    value={selectedTurma}
                    onChange={(e) => setSelectedTurma(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
                    title="Filtrar por Turma Específica"
                  >
                    <option value="todas" className="bg-[#12151f] text-white">
                      {selectedSerie === 'geral' ? 'Todas as Turmas' : `Todas do ${activeSerieConfig.shortLabel}`}
                    </option>
                    {availableTurmasForActiveSerie.map((t) => (
                      <option key={t} value={t} className="bg-[#12151f] text-white">
                        Turma {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Atalho Rápido "Minha Série" se disponível */}
                {currentUserSerie && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSerie(currentUserSerie);
                      setSelectedTurma('todas');
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      selectedSerie === currentUserSerie
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.25)]'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                    }`}
                    title={`Ver Ranking do ${currentUserSerieLabel}`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                    <span>Minha Série: {currentUserSerieLabel}</span>
                  </button>
                )}
              </div>

              {/* Campo de Busca de Alunos */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar aluno ou turma..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Conteúdo Principal do Ranking */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 min-h-[300px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-emerald-400 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-sm font-semibold">Carregando classificação escolar...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 text-rose-400 gap-3">
                  <span className="text-sm font-semibold bg-rose-500/10 p-4 rounded-xl border border-rose-500/30">
                    {error}
                  </span>
                  <button
                    type="button"
                    onClick={() => loadLeaderboard(true)}
                    className="px-4 py-2 bg-zinc-800 rounded-lg text-sm hover:bg-zinc-700 text-white font-bold cursor-pointer"
                  >
                    Tentar Novamente
                  </button>
                </div>
              ) : filteredRankings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-zinc-500 gap-3 text-center">
                  <Users className="w-12 h-12 opacity-40" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-300">
                      Nenhum digitador encontrado nesta seleção.
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {searchQuery
                        ? `Nenhum resultado para "${searchQuery}".`
                        : selectedTurma !== 'todas'
                        ? `Nenhum aluno registrado na Turma ${selectedTurma}.`
                        : `Nenhum aluno registrado no ${activeSerieConfig.label} ainda.`}
                    </p>
                  </div>
                  {(selectedSerie !== 'geral' || selectedTurma !== 'todas' || searchQuery) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSerie('geral');
                        setSelectedTurma('todas');
                        setSearchQuery('');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Voltar ao Ranking Geral
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {filteredRankings.map((player, index) => {
                    const isCurrentUser = player.userId === currentUserId;
                    const rankPosition = index + 1;
                    const playerSerieLabel = getSerieLabelFromTurma(player.turma);

                    let rankBadge = (
                      <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-black text-sm border bg-zinc-800/60 border-zinc-700/60 text-zinc-300">
                        {rankPosition}º
                      </div>
                    );

                    if (rankPosition === 1) {
                      rankBadge = (
                        <div
                          className="w-10 h-10 shrink-0 rounded-xl flex flex-col items-center justify-center font-black text-xs border border-yellow-500/70 bg-gradient-to-br from-yellow-500/25 via-amber-500/15 to-transparent text-yellow-300 shadow-[0_0_18px_rgba(245,158,11,0.35)]"
                          title="1º Lugar - Medalha de Ouro"
                        >
                          <span className="text-base leading-none">🥇</span>
                          <span className="text-[9px] font-mono leading-none mt-0.5">1º</span>
                        </div>
                      );
                    } else if (rankPosition === 2) {
                      rankBadge = (
                        <div
                          className="w-10 h-10 shrink-0 rounded-xl flex flex-col items-center justify-center font-black text-xs border border-slate-400/70 bg-gradient-to-br from-slate-400/25 via-zinc-400/15 to-transparent text-slate-200 shadow-[0_0_15px_rgba(203,213,225,0.25)]"
                          title="2º Lugar - Medalha de Prata"
                        >
                          <span className="text-base leading-none">🥈</span>
                          <span className="text-[9px] font-mono leading-none mt-0.5">2º</span>
                        </div>
                      );
                    } else if (rankPosition === 3) {
                      rankBadge = (
                        <div
                          className="w-10 h-10 shrink-0 rounded-xl flex flex-col items-center justify-center font-black text-xs border border-amber-600/70 bg-gradient-to-br from-amber-600/25 via-orange-600/15 to-transparent text-amber-300 shadow-[0_0_15px_rgba(217,119,6,0.25)]"
                          title="3º Lugar - Medalha de Bronze"
                        >
                          <span className="text-base leading-none">🥉</span>
                          <span className="text-[9px] font-mono leading-none mt-0.5">3º</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={player.userId}
                        className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-xl border transition-all ${
                          isCurrentUser
                            ? 'border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                            : 'border-white/5 bg-[#12151e] hover:bg-zinc-800/60'
                        }`}
                      >
                        {/* Posição / Medalha */}
                        {rankBadge}

                        {/* Avatar & Identificação do Aluno */}
                        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 bg-zinc-800 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-inner border border-zinc-700/80">
                            {player.avatar || '👩‍💻'}
                          </div>

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-white truncate text-sm sm:text-base">
                                {player.apelido || player.nome}
                              </span>
                              {isCurrentUser && (
                                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-full border border-emerald-500/40">
                                  Você
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-zinc-400 truncate mt-0.5 flex-wrap">
                              {player.turma && (
                                <span className="bg-zinc-800/90 px-2 py-0.2 rounded-md border border-zinc-700 text-zinc-300 font-mono text-[11px] font-bold">
                                  {player.turma}
                                </span>
                              )}
                              {selectedSerie === 'geral' && (
                                <span className="text-zinc-500 text-[11px] hidden sm:inline">
                                  • {playerSerieLabel}
                                </span>
                              )}
                              <span className="text-[11px] text-amber-300/90 font-mono">
                                Nv. {player.level}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Estatísticas no Desktop */}
                        <div className="hidden sm:flex items-center gap-4 sm:gap-6 shrink-0">
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">PPM</span>
                            <span className="font-mono font-bold text-emerald-400 text-sm">
                              {Math.round(player.wpm)}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Precisão</span>
                            <span className="font-mono font-bold text-sky-400 text-sm">
                              {Math.round(player.accuracy || 0)}%
                            </span>
                          </div>
                          <div className="flex flex-col items-end w-24">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Pontos</span>
                            <span className="font-mono font-bold text-amber-300 text-sm">
                              {formatBytes(player.points)}
                            </span>
                          </div>
                        </div>

                        {/* Estatísticas no Mobile */}
                        <div className="sm:hidden flex flex-col items-end shrink-0 text-right">
                          <span className="font-mono font-bold text-emerald-400 text-xs">
                            {Math.round(player.wpm)} PPM
                          </span>
                          <span className="font-mono font-bold text-amber-300 text-[11px]">
                            {formatBytes(player.points)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer com Estatísticas e Posição do Aluno */}
            <div className="flex-shrink-0 px-4 sm:px-6 py-3 border-t border-white/10 bg-[#141822] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span>
                  Exibindo <strong>{filteredRankings.length}</strong> de <strong>{rankings.length}</strong> digitadores
                </span>
                <span className="text-zinc-600 hidden sm:inline">•</span>
                <span className="text-emerald-400 font-bold hidden sm:inline">
                  {selectedSerie === 'geral' ? 'Escola Inteira' : activeSerieConfig.label}
                </span>
              </div>

              {/* Status do próprio aluno */}
              {userGlobalPlacement ? (
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span>
                    Sua Colocação:
                  </span>
                  {userSeriePlacement && currentUserSerieLabel && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold">
                      {userSeriePlacement}º na Série ({currentUserSerieLabel})
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                    {userGlobalPlacement}º no Geral
                  </span>
                </div>
              ) : (
                <span className="text-zinc-500 text-[11px] font-mono">
                  Pratique no terminal para ingressar no ranking escolar!
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
