import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trophy,
  Loader2,
  Users,
  Search,
  Filter,
  GraduationCap,
  Flag,
  Zap,
  Flame,
  Swords,
  Database,
  Shield,
  Award,
  Star,
  Medal
} from 'lucide-react';
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
import {
  aggregateClassStats,
  sortClassStats,
  ClassStats,
  ClassRankingSortMetric
} from '../utils/turmasAggregator';

export type LeaderboardMetric = 'level' | 'wpm' | 'combo' | 'bytes' | 'pvp' | 'races';

interface MetricTabDef {
  id: LeaderboardMetric;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  activeBorder: string;
  activeGlow: string;
  title: string;
  badgeTag: string;
  description: string;
}

export const METRIC_TABS: MetricTabDef[] = [
  {
    id: 'level',
    label: 'Nível & XP',
    shortLabel: 'Nível',
    icon: Trophy,
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-300',
    activeBorder: 'border-emerald-500/50',
    activeGlow: 'shadow-[0_0_50px_rgba(16,185,129,0.2)]',
    title: 'RANKING ESCOLAR DE NÍVEL',
    badgeTag: '🏆 Progressão Geral',
    description: 'Classificação por nível da conta e experiência acumulada'
  },
  {
    id: 'wpm',
    label: 'Velocidade PPM',
    shortLabel: 'Velocidade',
    icon: Zap,
    color: 'text-sky-400',
    badgeBg: 'bg-sky-500/20',
    badgeBorder: 'border-sky-500/40',
    badgeText: 'text-sky-300',
    activeBorder: 'border-sky-500/50',
    activeGlow: 'shadow-[0_0_50px_rgba(14,165,233,0.2)]',
    title: 'RANKING DE VELOCIDADE (PPM)',
    badgeTag: '⚡ Palavras / Minuto',
    description: 'Alunos com maior taxa de velocidade e agilidade na digitação'
  },
  {
    id: 'combo',
    label: 'Maior Combo',
    shortLabel: 'Combo',
    icon: Flame,
    color: 'text-orange-400',
    badgeBg: 'bg-orange-500/20',
    badgeBorder: 'border-orange-500/40',
    badgeText: 'text-orange-300',
    activeBorder: 'border-orange-500/50',
    activeGlow: 'shadow-[0_0_50px_rgba(249,115,22,0.2)]',
    title: 'RANKING DE MAIOR COMBO',
    badgeTag: '🔥 Teclas Sem Erro',
    description: 'Maior sequência ininterrupta de acertos consecutivos sem falhas'
  },
  {
    id: 'bytes',
    label: 'Total de Bytes',
    shortLabel: 'Bytes',
    icon: Database,
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/20',
    badgeBorder: 'border-purple-500/40',
    badgeText: 'text-purple-300',
    activeBorder: 'border-purple-500/50',
    activeGlow: 'shadow-[0_0_50px_rgba(168,85,247,0.2)]',
    title: 'RANKING TOTAL DE BYTES',
    badgeTag: '💾 Bytes Vitalícios',
    description: 'Classificação pelo total histórico acumulado de bytes digitados'
  },
  {
    id: 'pvp',
    label: 'Duelos PvP',
    shortLabel: 'Coliseu 1x1',
    icon: Swords,
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/20',
    badgeBorder: 'border-rose-500/40',
    badgeText: 'text-rose-300',
    activeBorder: 'border-rose-500/50',
    activeGlow: 'shadow-[0_0_50px_rgba(244,63,94,0.2)]',
    title: 'RANKING DO COLISEU (PVP 1x1)',
    badgeTag: '⚔️ Duelos em Tempo Real',
    description: 'Classificação por vitórias em batalhas 1x1 e pontos de glória'
  },
  {
    id: 'races',
    label: 'Corridas da Turma',
    shortLabel: 'Corridas',
    icon: Flag,
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/20',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-300',
    activeBorder: 'border-amber-500/50',
    activeGlow: 'shadow-[0_0_50px_rgba(245,158,11,0.2)]',
    title: 'RANKING DE CORRIDAS',
    badgeTag: '🏁 Corridas em Sala',
    description: 'Classificação por vitórias nas corridas ao vivo disparadas pelo professor'
  }
];

const normalizeTab = (tab?: string): LeaderboardMetric => {
  if (!tab || tab === 'points') return 'level';
  if (tab === 'level' || tab === 'wpm' || tab === 'combo' || tab === 'bytes' || tab === 'pvp' || tab === 'races') {
    return tab;
  }
  return 'level';
};

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  currentUserClass?: string;
  initialTab?: LeaderboardMetric | 'points';
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  currentUserClass,
  initialTab = 'level'
}) => {
  const [activeRankTab, setActiveRankTab] = useState<LeaderboardMetric>(normalizeTab(initialTab));
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros de Série, Turma e Busca
  const [selectedSerie, setSelectedSerie] = useState<SerieId>('geral');
  const [selectedTurma, setSelectedTurma] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modo de visualização: Individual vs Guerra de Turmas
  const [viewMode, setViewMode] = useState<'individual' | 'guerra_turmas'>('individual');
  const [classSortMetric, setClassSortMetric] = useState<ClassRankingSortMetric>('score');

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

  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveRankTab(normalizeTab(initialTab));
      }
      loadLeaderboard(false);
    }
  }, [isOpen, initialTab]);

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

  const currentMetric = useMemo(() => {
    return METRIC_TABS.find((m) => m.id === activeRankTab) || METRIC_TABS[0];
  }, [activeRankTab]);

  // Ordenação inteligente Client-Side em memória (Zero Leituras Adicionais)
  const sortedRankings = useMemo(() => {
    const list = [...rankings];
    switch (activeRankTab) {
      case 'level':
        return list.sort((a, b) => {
          if ((b.level || 0) !== (a.level || 0)) {
            return (b.level || 0) - (a.level || 0);
          }
          return (b.points || 0) - (a.points || 0);
        });

      case 'wpm':
        return list.sort((a, b) => {
          const wpmA = a.bestWpm || a.wpm || 0;
          const wpmB = b.bestWpm || b.wpm || 0;
          if (wpmB !== wpmA) return wpmB - wpmA;
          return (b.accuracy || 0) - (a.accuracy || 0);
        });

      case 'combo':
        return list.sort((a, b) => {
          const comboA = a.maxCombo || 0;
          const comboB = b.maxCombo || 0;
          if (comboB !== comboA) return comboB - comboA;
          return (b.accuracy || 0) - (a.accuracy || 0);
        });

      case 'bytes':
        return list.sort((a, b) => {
          if ((b.points || 0) !== (a.points || 0)) {
            return (b.points || 0) - (a.points || 0);
          }
          return (b.level || 0) - (a.level || 0);
        });

      case 'pvp':
        return list.sort((a, b) => {
          const winsA = a.pvpWins || 0;
          const winsB = b.pvpWins || 0;
          if (winsB !== winsA) return winsB - winsA;
          const ptsA = a.pvpPoints || 0;
          const ptsB = b.pvpPoints || 0;
          if (ptsB !== ptsA) return ptsB - ptsA;
          return (b.points || 0) - (a.points || 0);
        });

      case 'races':
        return list.sort((a, b) => {
          const winsA = a.raceWins || 0;
          const winsB = b.raceWins || 0;
          if (winsB !== winsA) return winsB - winsA;
          const wpmA = a.bestRaceWpm || 0;
          const wpmB = b.bestRaceWpm || 0;
          if (wpmB !== wpmA) return wpmB - wpmA;
          return (b.racesParticipated || 0) - (a.racesParticipated || 0);
        });

      default:
        return list.sort((a, b) => (b.points || 0) - (a.points || 0));
    }
  }, [rankings, activeRankTab]);

  // Filtragem dos jogadores
  const filteredRankings = useMemo(() => {
    return sortedRankings.filter((player) => {
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
  }, [sortedRankings, selectedSerie, selectedTurma, searchQuery]);

  // Colocação do usuário atual no Geral e na sua Série
  const userGlobalPlacement = useMemo(() => {
    if (!currentUserId) return null;
    const idx = sortedRankings.findIndex((p) => p.userId === currentUserId);
    return idx >= 0 ? idx + 1 : null;
  }, [sortedRankings, currentUserId]);

  const userSeriePlacement = useMemo(() => {
    if (!currentUserId || !currentUserSerie) return null;
    const inSerie = sortedRankings.filter((p) => getSerieIdFromTurma(p.turma) === currentUserSerie);
    const idx = inSerie.findIndex((p) => p.userId === currentUserId);
    return idx >= 0 ? idx + 1 : null;
  }, [sortedRankings, currentUserId, currentUserSerie]);

  // Agregação de estatísticas para a Guerra de Turmas (100% In-Memory, 0 Reads / Writes)
  const classStatsList = useMemo(() => {
    const raw = aggregateClassStats(rankings);
    const filtered = selectedSerie === 'geral' ? raw : raw.filter((c) => c.serieId === selectedSerie);
    const searched = searchQuery.trim()
      ? filtered.filter(
          (c) =>
            c.turma.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
            c.serieLabel.toLowerCase().includes(searchQuery.toLowerCase().trim())
        )
      : filtered;
    return sortClassStats(searched, classSortMetric);
  }, [rankings, selectedSerie, searchQuery, classSortMetric]);

  const userClassRank = useMemo(() => {
    if (!currentUserClass) return null;
    const idx = classStatsList.findIndex((c) => c.turma.toLowerCase() === currentUserClass.trim().toLowerCase());
    return idx >= 0 ? idx + 1 : null;
  }, [classStatsList, currentUserClass]);

  const activeSerieConfig = SERIES_CONFIG.find((s) => s.id === selectedSerie) || SERIES_CONFIG[0];
  const ActiveIcon = currentMetric.icon;

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
            className={`w-full max-w-4xl bg-[#10131a] border-2 rounded-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden transition-all duration-300 ${currentMetric.activeBorder} ${currentMetric.activeGlow}`}
          >
            {/* Top Bar / Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#141822]">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all flex-shrink-0 ${
                    viewMode === 'guerra_turmas'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                      : `${currentMetric.badgeBg} ${currentMetric.badgeBorder} ${currentMetric.color}`
                  }`}
                >
                  {viewMode === 'guerra_turmas' ? (
                    <Shield className="w-5 h-5 text-amber-400" />
                  ) : (
                    <ActiveIcon className={`w-5 h-5 ${currentMetric.color}`} />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2 truncate">
                    <span>
                      {viewMode === 'guerra_turmas'
                        ? 'GUERRA DE TURMAS: CAMPEONATO'
                        : currentMetric.title}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border hidden sm:inline-block ${
                        viewMode === 'guerra_turmas'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : `${currentMetric.badgeBg} ${currentMetric.badgeText} ${currentMetric.badgeBorder}`
                      }`}
                    >
                      {viewMode === 'guerra_turmas' ? '🛡️ Disputa Coletiva' : currentMetric.badgeTag}
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 truncate">
                    {viewMode === 'guerra_turmas'
                      ? 'Classificação inter-classes por rendimento geral, média de nível, velocidade e bytes'
                      : currentMetric.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Alternador de Modo: Individual vs Guerra de Turmas */}
                <div className="flex items-center p-1 bg-zinc-900/90 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setViewMode('individual')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      viewMode === 'individual'
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Individual</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('guerra_turmas')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                      viewMode === 'guerra_turmas'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20'
                        : 'text-amber-400 hover:text-amber-300'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Guerra de Turmas 🛡️</span>
                  </button>
                </div>

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

            {/* Barra de Seleção de Métricas (Individual vs Guerra de Turmas) */}
            <div className="flex-shrink-0 bg-[#0c0e15] border-b border-white/10 px-3 sm:px-6 py-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
                {viewMode === 'individual' ? (
                  METRIC_TABS.map((tab) => {
                    const isSelected = activeRankTab === tab.id;
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveRankTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border select-none ${
                          isSelected
                            ? `${tab.badgeBg} ${tab.badgeText} ${tab.badgeBorder} shadow-sm ring-1 ring-white/10`
                            : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800/60'
                        }`}
                        title={tab.description}
                      >
                        <TabIcon className={`w-3.5 h-3.5 ${isSelected ? tab.color : 'text-zinc-500'}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })
                ) : (
                  <>
                    {[
                      { id: 'score' as ClassRankingSortMetric, label: '🏆 Rendimento Geral', desc: 'Pontuação ponderada de engajamento, nível e velocidade' },
                      { id: 'avgLevel' as ClassRankingSortMetric, label: '📈 Média de Nível', desc: 'Média aritmética do nível dos alunos da sala' },
                      { id: 'avgWpm' as ClassRankingSortMetric, label: '⚡ Velocidade Coletiva (PPM)', desc: 'Média de palavras por minuto de toda a turma' },
                      { id: 'totalBytes' as ClassRankingSortMetric, label: '💾 Volume de Bytes', desc: 'Total acumulado de bytes digitados pela turma' },
                      { id: 'raceWins' as ClassRankingSortMetric, label: '🏁 Vitórias em Corridas', desc: 'Total de vitórias em corridas escolares ao vivo' }
                    ].map((metric) => {
                      const isSelected = classSortMetric === metric.id;
                      return (
                        <button
                          key={metric.id}
                          type="button"
                          onClick={() => setClassSortMetric(metric.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border select-none ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm ring-1 ring-amber-500/20'
                              : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800/60'
                          }`}
                          title={metric.desc}
                        >
                          <span>{metric.label}</span>
                        </button>
                      );
                    })}
                  </>
                )}
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
                          ? `${currentMetric.badgeBg} ${currentMetric.badgeText} ${currentMetric.badgeBorder} shadow-sm`
                          : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800/60'
                      }`}
                      title={serie.description}
                    >
                      <span className="text-sm select-none">{serie.icon}</span>
                      <span>{serie.label}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                          isActive
                            ? `${currentMetric.badgeBg} ${currentMetric.badgeText} ${currentMetric.badgeBorder}`
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

            {/* Barra de Filtro Secundário e Busca */}
            <div className="flex-shrink-0 px-3 sm:px-6 py-2.5 bg-[#12151f] border-b border-white/5 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                {viewMode === 'individual' ? (
                  <>
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
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Disputa Inter-Classes • {classStatsList.length} turmas avaliadas</span>
                  </div>
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
              ) : viewMode === 'guerra_turmas' ? (
                classStatsList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-zinc-500 gap-3 text-center">
                    <Shield className="w-12 h-12 opacity-40 text-amber-400" />
                    <div>
                      <p className="text-sm font-semibold text-zinc-300">
                        Nenhuma turma encontrada nesta seleção.
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {searchQuery
                          ? `Nenhum resultado para "${searchQuery}".`
                          : `Ainda não há turmas com alunos cadastrados nesta série.`}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Pódio das 3 Melhores Turmas */}
                    {classStatsList.length >= 2 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        {/* 2º Lugar (Prata) */}
                        <div className="order-2 sm:order-1 p-4 rounded-2xl bg-gradient-to-b from-slate-400/10 via-zinc-900/60 to-zinc-950 border border-slate-400/30 flex flex-col items-center text-center justify-between">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="text-2xl">🥈</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-400/20 text-slate-200 border border-slate-400/30">
                              2º Lugar • {classStatsList[1].serieLabel}
                            </span>
                            <h4 className="text-base font-black text-white mt-1">{classStatsList[1].turma}</h4>
                            <span className="text-[11px] text-zinc-400">{classStatsList[1].studentCount} alunos</span>
                          </div>
                          <div className="w-full mt-3 pt-3 border-t border-white/5 grid grid-cols-3 gap-1 text-center font-mono">
                            <div>
                              <span className="text-[10px] text-zinc-500 block">Nível</span>
                              <span className="text-xs font-bold text-emerald-400">{classStatsList[1].avgLevel}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-500 block">PPM</span>
                              <span className="text-xs font-bold text-sky-400">{classStatsList[1].avgWpm}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-500 block">Score</span>
                              <span className="text-xs font-bold text-amber-400">{classStatsList[1].compositeScore}</span>
                            </div>
                          </div>
                        </div>

                        {/* 1º Lugar (Ouro - Campeã) */}
                        <div className="order-1 sm:order-2 p-5 rounded-2xl bg-gradient-to-b from-yellow-500/20 via-amber-950/40 to-zinc-950 border-2 border-yellow-500/60 shadow-[0_0_25px_rgba(234,179,8,0.2)] flex flex-col items-center text-center justify-between scale-105 z-10">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="text-3xl animate-bounce">🥇</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-yellow-500/30 text-yellow-300 border border-yellow-500/50 shadow-sm">
                              🏆 Turma Campeã • {classStatsList[0].serieLabel}
                            </span>
                            <h4 className="text-lg font-black text-white mt-1">{classStatsList[0].turma}</h4>
                            <span className="text-xs text-zinc-300 font-semibold">{classStatsList[0].studentCount} alunos ativos</span>
                          </div>
                          <div className="w-full mt-3 pt-3 border-t border-yellow-500/20 grid grid-cols-3 gap-1 text-center font-mono">
                            <div>
                              <span className="text-[10px] text-zinc-400 block">Nível Médio</span>
                              <span className="text-sm font-black text-emerald-400">{classStatsList[0].avgLevel}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-400 block">PPM Médio</span>
                              <span className="text-sm font-black text-sky-400">{classStatsList[0].avgWpm}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-zinc-400 block">Pontos</span>
                              <span className="text-sm font-black text-yellow-400">{classStatsList[0].compositeScore}</span>
                            </div>
                          </div>
                        </div>

                        {/* 3º Lugar (Bronze, se existir) */}
                        {classStatsList[2] ? (
                          <div className="order-3 p-4 rounded-2xl bg-gradient-to-b from-orange-600/10 via-zinc-900/60 to-zinc-950 border border-orange-600/30 flex flex-col items-center text-center justify-between">
                            <div className="flex flex-col items-center gap-1.5">
                              <span className="text-2xl">🥉</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-600/20 text-orange-300 border border-orange-600/30">
                                3º Lugar • {classStatsList[2].serieLabel}
                              </span>
                              <h4 className="text-base font-black text-white mt-1">{classStatsList[2].turma}</h4>
                              <span className="text-[11px] text-zinc-400">{classStatsList[2].studentCount} alunos</span>
                            </div>
                            <div className="w-full mt-3 pt-3 border-t border-white/5 grid grid-cols-3 gap-1 text-center font-mono">
                              <div>
                                <span className="text-[10px] text-zinc-500 block">Nível</span>
                                <span className="text-xs font-bold text-emerald-400">{classStatsList[2].avgLevel}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-zinc-500 block">PPM</span>
                                <span className="text-xs font-bold text-sky-400">{classStatsList[2].avgWpm}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-zinc-500 block">Score</span>
                                <span className="text-xs font-bold text-amber-400">{classStatsList[2].compositeScore}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="hidden sm:block order-3" />
                        )}
                      </div>
                    )}

                    {/* Lista Completa de Classificação das Turmas */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-400" />
                        Classificação Completa das Turmas ({classStatsList.length})
                      </h4>

                      {classStatsList.map((cls, idx) => {
                        const rank = idx + 1;
                        const isUserClass = currentUserClass && currentUserClass.trim().toLowerCase() === cls.turma.toLowerCase();

                        return (
                          <div
                            key={cls.turma}
                            className={`p-3.5 sm:p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                              isUserClass
                                ? 'bg-purple-950/30 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                : rank === 1
                                ? 'bg-yellow-950/20 border-yellow-500/40'
                                : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700'
                            }`}
                          >
                            {/* Esquerda: Posição, Turma e Série */}
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border flex-shrink-0 ${
                                rank === 1
                                  ? 'bg-yellow-500/20 border-yellow-500/60 text-yellow-300'
                                  : rank === 2
                                  ? 'bg-slate-400/20 border-slate-400/60 text-slate-200'
                                  : rank === 3
                                  ? 'bg-orange-600/20 border-orange-600/60 text-orange-300'
                                  : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400'
                              }`}>
                                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}º`}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="text-base font-black text-white">{cls.turma}</h5>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                                    {cls.serieLabel}
                                  </span>
                                  {isUserClass && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/30 text-purple-200 border border-purple-500/50 flex items-center gap-1">
                                      <Star className="w-3 h-3 text-purple-300 fill-current" />
                                      Sua Turma!
                                    </span>
                                  )}
                                </div>
                                {cls.bestPlayer && (
                                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                                    ⭐ Líder: <span className="text-zinc-200 font-bold">{cls.bestPlayer.apelido || cls.bestPlayer.nome}</span> (Nív. {cls.bestPlayer.level} • {cls.bestPlayer.wpm} PPM)
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Direita: Métricas Coletivas */}
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap font-mono text-xs justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-white/5">
                              <div className="text-center px-2 py-1 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                                <span className="text-[9px] text-zinc-500 block uppercase">Alunos</span>
                                <span className="font-bold text-zinc-200">{cls.studentCount}</span>
                              </div>

                              <div className="text-center px-2 py-1 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                                <span className="text-[9px] text-zinc-500 block uppercase">Nível Médio</span>
                                <span className="font-bold text-emerald-400">{cls.avgLevel}</span>
                              </div>

                              <div className="text-center px-2 py-1 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                                <span className="text-[9px] text-zinc-500 block uppercase">PPM Médio</span>
                                <span className="font-bold text-sky-400">{cls.avgWpm}</span>
                              </div>

                              <div className="text-center px-2 py-1 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                                <span className="text-[9px] text-zinc-500 block uppercase">Precisão</span>
                                <span className="font-bold text-indigo-300">{cls.avgAccuracy}%</span>
                              </div>

                              <div className="text-center px-2 py-1 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                                <span className="text-[9px] text-zinc-500 block uppercase">Corridas</span>
                                <span className="font-bold text-amber-400">{cls.totalRaceWins} vitórias</span>
                              </div>

                              <div className="text-center px-2.5 py-1 bg-amber-500/10 rounded-lg border border-amber-500/30">
                                <span className="text-[9px] text-amber-400 block uppercase font-bold">Rendimento</span>
                                <span className="font-black text-amber-300 text-sm">{cls.compositeScore} pts</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
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
                            ? `${currentMetric.activeBorder} ${currentMetric.badgeBg} shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-white/20`
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
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full border ${currentMetric.badgeBg} ${currentMetric.badgeText} ${currentMetric.badgeBorder}`}>
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
                              {activeRankTab === 'races' && (
                                <span className="text-[11px] text-amber-300/90 font-mono">
                                  🏁 {player.raceWins || 0} vitórias
                                </span>
                              )}
                              {activeRankTab === 'pvp' && (
                                <span className="text-[11px] text-rose-300/90 font-mono">
                                  ⚔️ {player.pvpWins || 0} vitórias PvP
                                </span>
                              )}
                              {activeRankTab === 'wpm' && (
                                <span className="text-[11px] text-sky-300/90 font-mono">
                                  ⚡ {Math.round(player.bestWpm || player.wpm || 0)} PPM
                                </span>
                              )}
                              {activeRankTab === 'combo' && (
                                <span className="text-[11px] text-orange-300/90 font-mono">
                                  🔥 {player.maxCombo || 0}x combo
                                </span>
                              )}
                              {activeRankTab === 'bytes' && (
                                <span className="text-[11px] text-purple-300/90 font-mono">
                                  💾 {formatBytes(player.points)}
                                </span>
                              )}
                              {activeRankTab === 'level' && (
                                <span className="text-[11px] text-emerald-300/90 font-mono">
                                  Nv. {player.level}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Estatísticas no Desktop */}
                        {activeRankTab === 'races' ? (
                          <div className="hidden sm:flex items-center gap-4 sm:gap-6 shrink-0">
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Vitórias</span>
                              <span className="font-mono font-black text-amber-300 text-sm flex items-center gap-1">
                                🏁 {player.raceWins || 0}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Melhor PPM</span>
                              <span className="font-mono font-bold text-emerald-400 text-sm">
                                {player.bestRaceWpm ? Math.round(player.bestRaceWpm) : '-'}
                              </span>
                            </div>
                            <div className="flex flex-col items-end w-20">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Corridas</span>
                              <span className="font-mono font-bold text-sky-400 text-sm">
                                {player.racesParticipated || 0}
                              </span>
                            </div>
                          </div>
                        ) : activeRankTab === 'pvp' ? (
                          <div className="hidden sm:flex items-center gap-4 sm:gap-6 shrink-0">
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider">Vitórias</span>
                              <span className="font-mono font-black text-rose-300 text-sm flex items-center gap-1">
                                ⚔️ {player.pvpWins || 0}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Glória</span>
                              <span className="font-mono font-bold text-amber-300 text-sm">
                                {player.pvpPoints || 0} pts
                              </span>
                            </div>
                            <div className="flex flex-col items-end w-20">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Duelos</span>
                              <span className="font-mono font-bold text-zinc-300 text-sm">
                                {player.pvpMatches || 0}
                              </span>
                            </div>
                          </div>
                        ) : activeRankTab === 'wpm' ? (
                          <div className="hidden sm:flex items-center gap-4 sm:gap-6 shrink-0">
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-sky-400 uppercase font-bold tracking-wider">Velocidade</span>
                              <span className="font-mono font-black text-sky-300 text-sm flex items-center gap-1">
                                ⚡ {Math.round(player.bestWpm || player.wpm || 0)} PPM
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Precisão</span>
                              <span className="font-mono font-bold text-emerald-400 text-sm">
                                {Math.round(player.accuracy || 0)}%
                              </span>
                            </div>
                            <div className="flex flex-col items-end w-20">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Nível</span>
                              <span className="font-mono font-bold text-zinc-300 text-sm">
                                Nv. {player.level}
                              </span>
                            </div>
                          </div>
                        ) : activeRankTab === 'combo' ? (
                          <div className="hidden sm:flex items-center gap-4 sm:gap-6 shrink-0">
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-orange-400 uppercase font-bold tracking-wider">Maior Combo</span>
                              <span className="font-mono font-black text-orange-300 text-sm flex items-center gap-1">
                                🔥 {player.maxCombo || 0}x
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Precisão</span>
                              <span className="font-mono font-bold text-emerald-400 text-sm">
                                {Math.round(player.accuracy || 0)}%
                              </span>
                            </div>
                            <div className="flex flex-col items-end w-20">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Nível</span>
                              <span className="font-mono font-bold text-zinc-300 text-sm">
                                Nv. {player.level}
                              </span>
                            </div>
                          </div>
                        ) : activeRankTab === 'bytes' ? (
                          <div className="hidden sm:flex items-center gap-4 sm:gap-6 shrink-0">
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">Total Bytes</span>
                              <span className="font-mono font-black text-purple-300 text-sm flex items-center gap-1">
                                💾 {formatBytes(player.points)}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">PPM</span>
                              <span className="font-mono font-bold text-sky-400 text-sm">
                                {Math.round(player.wpm || 0)}
                              </span>
                            </div>
                            <div className="flex flex-col items-end w-20">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Nível</span>
                              <span className="font-mono font-bold text-amber-300 text-sm">
                                Nv. {player.level}
                              </span>
                            </div>
                          </div>
                        ) : (
                          // Nível / Geral
                          <div className="hidden sm:flex items-center gap-4 sm:gap-6 shrink-0">
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Nível</span>
                              <span className="font-mono font-black text-emerald-300 text-sm">
                                Nv. {player.level}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Precisão</span>
                              <span className="font-mono font-bold text-sky-400 text-sm">
                                {Math.round(player.accuracy || 0)}%
                              </span>
                            </div>
                            <div className="flex flex-col items-end w-24">
                              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Bytes</span>
                              <span className="font-mono font-bold text-amber-300 text-sm">
                                {formatBytes(player.points)}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Estatísticas no Mobile */}
                        {activeRankTab === 'races' ? (
                          <div className="sm:hidden flex flex-col items-end shrink-0 text-right">
                            <span className="font-mono font-black text-amber-400 text-xs">
                              🏁 {player.raceWins || 0} vit.
                            </span>
                            <span className="font-mono font-bold text-emerald-400 text-[11px]">
                              {player.bestRaceWpm ? `${Math.round(player.bestRaceWpm)} PPM` : '-'}
                            </span>
                          </div>
                        ) : activeRankTab === 'pvp' ? (
                          <div className="sm:hidden flex flex-col items-end shrink-0 text-right">
                            <span className="font-mono font-black text-rose-400 text-xs">
                              ⚔️ {player.pvpWins || 0} vit.
                            </span>
                            <span className="font-mono font-bold text-amber-400 text-[11px]">
                              {player.pvpPoints || 0} pts
                            </span>
                          </div>
                        ) : activeRankTab === 'wpm' ? (
                          <div className="sm:hidden flex flex-col items-end shrink-0 text-right">
                            <span className="font-mono font-black text-sky-400 text-xs">
                              ⚡ {Math.round(player.bestWpm || player.wpm || 0)} PPM
                            </span>
                            <span className="font-mono font-bold text-emerald-400 text-[11px]">
                              {Math.round(player.accuracy || 0)}% prec.
                            </span>
                          </div>
                        ) : activeRankTab === 'combo' ? (
                          <div className="sm:hidden flex flex-col items-end shrink-0 text-right">
                            <span className="font-mono font-black text-orange-400 text-xs">
                              🔥 {player.maxCombo || 0}x
                            </span>
                            <span className="font-mono font-bold text-emerald-400 text-[11px]">
                              {Math.round(player.accuracy || 0)}% prec.
                            </span>
                          </div>
                        ) : activeRankTab === 'bytes' ? (
                          <div className="sm:hidden flex flex-col items-end shrink-0 text-right">
                            <span className="font-mono font-black text-purple-400 text-xs">
                              💾 {formatBytes(player.points)}
                            </span>
                            <span className="font-mono font-bold text-amber-300 text-[11px]">
                              Nv. {player.level}
                            </span>
                          </div>
                        ) : (
                          <div className="sm:hidden flex flex-col items-end shrink-0 text-right">
                            <span className="font-mono font-bold text-emerald-400 text-xs">
                              Nv. {player.level}
                            </span>
                            <span className="font-mono font-bold text-amber-300 text-[11px]">
                              {formatBytes(player.points)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer com Estatísticas e Posição do Aluno / Turma */}
            <div className="flex-shrink-0 px-4 sm:px-6 py-3 border-t border-white/10 bg-[#141822] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400">
              {viewMode === 'guerra_turmas' ? (
                <>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      Exibindo <strong>{classStatsList.length}</strong> turmas avaliadas
                    </span>
                    <span className="text-zinc-600 hidden sm:inline">•</span>
                    <span className="text-amber-400 font-bold hidden sm:inline">
                      {selectedSerie === 'geral' ? 'Escola Inteira' : activeSerieConfig.label}
                    </span>
                  </div>

                  {userClassRank && currentUserClass ? (
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span>Sua Turma ({currentUserClass}):</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                        {userClassRank}º Lugar na Guerra de Turmas
                      </span>
                    </div>
                  ) : (
                    <span className="text-zinc-500 text-[11px] font-mono">
                      Defina sua turma no perfil para defender sua sala na Guerra de Turmas!
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span>
                      Exibindo <strong>{filteredRankings.length}</strong> de <strong>{rankings.length}</strong> alunos
                    </span>
                    <span className="text-zinc-600 hidden sm:inline">•</span>
                    <span className={`${currentMetric.color} font-bold hidden sm:inline`}>
                      {selectedSerie === 'geral' ? 'Escola Inteira' : activeSerieConfig.label}
                    </span>
                  </div>

                  {/* Status do próprio aluno */}
                  {userGlobalPlacement ? (
                    <div className="flex items-center gap-2 font-mono text-[11px] flex-wrap justify-end">
                      <span>
                        Sua Colocação ({currentMetric.shortLabel}):
                      </span>
                      {userSeriePlacement && currentUserSerieLabel && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold">
                          {userSeriePlacement}º na Série ({currentUserSerieLabel})
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-md ${currentMetric.badgeBg} border ${currentMetric.badgeBorder} ${currentMetric.badgeText} font-bold`}>
                        {userGlobalPlacement}º no Geral
                      </span>
                    </div>
                  ) : (
                    <span className="text-zinc-500 text-[11px] font-mono">
                      {activeRankTab === 'races'
                        ? 'Participe de corridas em sala de aula para pontuar no ranking!'
                        : activeRankTab === 'pvp'
                        ? 'Participe de duelos na Arena 1x1 para ingressar no ranking!'
                        : 'Pratique no terminal para ingressar no ranking escolar!'}
                    </span>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
