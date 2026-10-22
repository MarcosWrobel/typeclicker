import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  Download,
  Filter,
  Clock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Gamepad2,
  ArrowUp,
  ArrowDown,
  Star,
  Sparkles,
  BarChart,
  Shield,
  RotateCcw,
  Zap,
  Radio,
  Swords,
  Timer,
  BookOpen,
  Award,
  Crown,
  X
} from 'lucide-react';
import { StudentAvatarRenderer } from './vectors/StudentAvatarRenderer';
import { dbService } from '../services/dbFactory';
import { LeaderboardEntry } from '../types/leaderboard';
import { SCHOOL_CLASSES_CONFIG } from '../constants/school';
import { formatBytes } from '../utils/formatting';
import { sound } from '../utils/audio';
import { exportToCsv, downloadCsv, buildPedagogicalCsvRows } from '../services/turmasAggregator';
import { SHEET_CAMPAIGN_LEVELS } from './games/sheetquest/sheetLevelsData';
import { INITIAL_GAME_CATALOG, GameMetadata } from '../data/gameCatalog';
import { HubConfig, updateHubConfig, getSystemSettings } from '../services/systemSettingsService';

export interface ConsolidatedMetricsHubProps {
  userEmail?: string | null;
  isAdmin?: boolean;
  activeTurmaFilter?: string;
  onLaunchGameLevel?: (gameId: string, levelIndex: number) => void;
  hubConfig?: HubConfig | null;
  onUpdateHubConfig?: (config: HubConfig) => Promise<void> | void;
}

export type MetricsHubTab = 'overview' | 'sheetquest' | 'hub_manager';

export function formatLastActivity(isoString?: string | null): {
  text: string;
  relative: string;
  status: 'online' | 'today' | 'recent' | 'away';
} {
  if (!isoString) {
    return { text: 'Nunca acessou', relative: 'Sem registro', status: 'away' };
  }
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return { text: 'Data inválida', relative: '-', status: 'away' };
  }
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const text = `${formattedDate} às ${formattedTime}`;

  let relative = '';
  let status: 'online' | 'today' | 'recent' | 'away' = 'away';

  if (diffMinutes < 15) {
    relative = 'Online agora';
    status = 'online';
  } else if (diffMinutes < 60) {
    relative = `Há ${diffMinutes} min`;
    status = 'today';
  } else if (diffHours < 24) {
    relative = `Há ${diffHours}h atrás`;
    status = 'today';
  } else if (diffDays === 1) {
    relative = 'Ontem';
    status = 'recent';
  } else if (diffDays <= 7) {
    relative = `Há ${diffDays} dias`;
    status = 'recent';
  } else {
    relative = `Há ${diffDays} dias`;
    status = 'away';
  }

  return { text, relative, status };
}

export const ConsolidatedMetricsHub: React.FC<ConsolidatedMetricsHubProps> = ({
  userEmail,
  isAdmin = true,
  activeTurmaFilter = 'todas',
  onLaunchGameLevel,
  hubConfig: initialHubConfig,
  onUpdateHubConfig
}) => {
  const [activeTab, setActiveTab] = useState<MetricsHubTab>('overview');

  // Dados de Alunos
  const [students, setStudents] = useState<LeaderboardEntry[]>([]);
  const [isStudentsLoading, setIsStudentsLoading] = useState<boolean>(false);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>(activeTurmaFilter);
  const [searchTurma, setSearchTurma] = useState<string>('');
  const [studentsSortBy, setStudentsSortBy] = useState<'level' | 'bytes' | 'wpm' | 'sheet' | 'dash' | 'last_login' | 'nome'>('bytes');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<LeaderboardEntry | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [updatingStudentId, setUpdatingStudentId] = useState<string | null>(null);

  // Estados de Gestão de Jogos do Hub
  const [hubConfigState, setHubConfigState] = useState<HubConfig>(() => initialHubConfig ?? {});
  const [isSavingHub, setIsSavingHub] = useState<boolean>(false);
  const [hubActionMessage, setHubActionMessage] = useState<string | null>(null);

  // Lista ordenada de jogos do Hub
  const [orderedGameIds, setOrderedGameIds] = useState<string[]>(() => {
    const catalogIds = INITIAL_GAME_CATALOG.map((g) => g.id);
    const existingOrder = initialHubConfig?.gameOrder;
    if (Array.isArray(existingOrder) && existingOrder.length > 0) {
      const merged = [...existingOrder];
      catalogIds.forEach((id) => {
        if (!merged.includes(id)) merged.push(id);
      });
      return merged;
    }
    return catalogIds;
  });

  const [disabledGamesSet, setDisabledGamesSet] = useState<Set<string>>(() => {
    return new Set(initialHubConfig?.disabledGames || []);
  });

  const [featuredGameId, setFeaturedGameId] = useState<string>(() => {
    return initialHubConfig?.featuredGame || 'sheetquest';
  });

  // Atualiza estado quando props mudam ou busca do sistema se não fornecido
  useEffect(() => {
    if (initialHubConfig && Object.keys(initialHubConfig).length > 0) {
      setHubConfigState(initialHubConfig);
      if (Array.isArray(initialHubConfig.disabledGames)) {
        setDisabledGamesSet(new Set(initialHubConfig.disabledGames));
      }
      if (Array.isArray(initialHubConfig.gameOrder) && initialHubConfig.gameOrder.length > 0) {
        const catalogIds = INITIAL_GAME_CATALOG.map((g) => g.id);
        const merged = [...initialHubConfig.gameOrder];
        catalogIds.forEach((id) => {
          if (!merged.includes(id)) merged.push(id);
        });
        setOrderedGameIds(merged);
      }
      if (initialHubConfig.featuredGame) {
        setFeaturedGameId(initialHubConfig.featuredGame);
      }
    } else {
      getSystemSettings().then((settings) => {
        if (settings?.hubConfig) {
          const cfg = settings.hubConfig;
          setHubConfigState(cfg);
          if (Array.isArray(cfg.disabledGames)) {
            setDisabledGamesSet(new Set(cfg.disabledGames));
          }
          if (Array.isArray(cfg.gameOrder) && cfg.gameOrder.length > 0) {
            const catalogIds = INITIAL_GAME_CATALOG.map((g) => g.id);
            const merged = [...cfg.gameOrder];
            catalogIds.forEach((id) => {
              if (!merged.includes(id)) merged.push(id);
            });
            setOrderedGameIds(merged);
          }
          if (cfg.featuredGame) {
            setFeaturedGameId(cfg.featuredGame);
          }
        }
      });
    }
  }, [initialHubConfig]);

  // Carrega alunos
  const loadStudents = useCallback(async (turmaToFetch = selectedClassFilter) => {
    setIsStudentsLoading(true);
    try {
      const targetTurma = turmaToFetch === 'todas' ? undefined : turmaToFetch;
      const data = await dbService.getAdminDashboardData(targetTurma);
      setStudents(data);
      setLastRefreshedAt(new Date());
    } catch (e) {
      console.error('Erro ao carregar métricas dos alunos no ConsolidatedMetricsHub:', e);
    } finally {
      setIsStudentsLoading(false);
    }
  }, [selectedClassFilter]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Alunos Filtrados e Ordenados
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        if (selectedClassFilter !== 'todas' && s.turma !== selectedClassFilter) return false;
        if (!searchTurma.trim()) return true;
        const q = searchTurma.toLowerCase();
        return (
          (s.nome && s.nome.toLowerCase().includes(q)) ||
          (s.apelido && s.apelido.toLowerCase().includes(q)) ||
          (s.email && s.email.toLowerCase().includes(q)) ||
          (s.userId && s.userId.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (studentsSortBy === 'level') return (b.level || 0) - (a.level || 0);
        if (studentsSortBy === 'bytes') return (b.points || 0) - (a.points || 0);
        if (studentsSortBy === 'wpm') return (b.wpm || 0) - (a.wpm || 0);
        if (studentsSortBy === 'sheet') {
          const lvlA = a.sheetQuestCurrentLevel || a.sheetQuestCompletedQuests || 0;
          const lvlB = b.sheetQuestCurrentLevel || b.sheetQuestCompletedQuests || 0;
          return lvlB - lvlA;
        }
        if (studentsSortBy === 'dash') return (b.dashHighScore || 0) - (a.dashHighScore || 0);
        if (studentsSortBy === 'last_login') {
          const timeA = new Date(a.lastLoginAt || a.updatedAt || 0).getTime();
          const timeB = new Date(b.lastLoginAt || b.updatedAt || 0).getTime();
          return timeB - timeA;
        }
        if (studentsSortBy === 'nome') return (a.nome || '').localeCompare(b.nome || '');
        return (b.points || 0) - (a.points || 0);
      });
  }, [students, selectedClassFilter, searchTurma, studentsSortBy]);

  // Resumo Geral
  const metricsSummary = useMemo(() => {
    if (students.length === 0) return { total: 0, avgWpm: 0, avgAcc: 0, level100Count: 0, totalBytes: 0 };
    const total = students.length;
    const avgWpm = Math.round(students.reduce((acc, s) => acc + (s.wpm || 0), 0) / total);
    const avgAcc = Math.round(students.reduce((acc, s) => acc + (s.accuracy || 100), 0) / total);
    const level100Count = students.filter((s) => (s.level || 1) >= 100).length;
    const totalBytes = students.reduce((acc, s) => acc + (s.points || 0), 0);
    return { total, avgWpm, avgAcc, level100Count, totalBytes };
  }, [students]);

  // Resumo Específico do SheetQuest
  const sheetSummary = useMemo(() => {
    const sheetPlayers = students.filter((s) => (s.sheetQuestCurrentLevel || s.sheetQuestCompletedQuests || 0) > 0);
    const totalPlayers = sheetPlayers.length;
    const avgLevel = totalPlayers > 0
      ? Math.round((sheetPlayers.reduce((acc, s) => acc + (s.sheetQuestCurrentLevel || s.sheetQuestCompletedQuests || 1), 0) / totalPlayers) * 10) / 10
      : 0;
    const autonomousCount = sheetPlayers.filter((s) => (s.sheetQuestCurrentLevel || s.sheetQuestCompletedQuests || 0) >= 16).length;
    const completedAllCount = sheetPlayers.filter((s) => (s.sheetQuestCompletedQuests || 0) >= 48).length;
    return { totalPlayers, avgLevel, autonomousCount, completedAllCount };
  }, [students]);

  // Handlers de Perfil
  const handleUpdateStudentProfile = async (studentUserId: string, updates: { turma?: string; rpgClass?: any }) => {
    setUpdatingStudentId(studentUserId);
    try {
      await dbService.adminUpdateStudentProfile(studentUserId, updates);
      setStudents((prev) =>
        prev.map((s) => (s.userId === studentUserId ? { ...s, ...updates } : s))
      );
      sound.playUpgrade();
    } catch (err) {
      console.error('Falha ao atualizar perfil do aluno:', err);
    } finally {
      setUpdatingStudentId(null);
    }
  };

  // Exportações CSV
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return;
    const csvData = exportToCsv(filteredStudents);
    downloadCsv(csvData, `boletim_escolar_${selectedClassFilter}_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleExportTurmasSummary = () => {
    if (students.length === 0) return;
    const rows = buildPedagogicalCsvRows(students);
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]).join(';');
    const body = rows.map((r) => Object.values(r).map(v => typeof v === 'number' ? String(v).replace('.', ',') : `"${v}"`).join(';')).join('\n');
    downloadCsv(`${headers}\n${body}`, `resumo_turmas_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleExportSheetQuestCSV = () => {
    if (filteredStudents.length === 0) return;
    const headers = 'Nome;Apelido;Email;Turma;Nivel_SheetQuest;Demandas_Concluidas;Percentual_Progresso;Ultima_Entrada_Plataforma;Ultima_Sessao_SheetQuest;Pontuacao_SheetQuest';
    const rows = filteredStudents.map((s) => {
      const currentLvl = s.sheetQuestCurrentLevel || (s.sheetQuestCompletedQuests ? Math.min(48, s.sheetQuestCompletedQuests + 1) : 1);
      const completed = s.sheetQuestCompletedQuests || 0;
      const pct = Math.round((completed / 48) * 100);
      const lastLogin = s.lastLoginAt || s.updatedAt ? new Date(s.lastLoginAt || s.updatedAt).toLocaleString('pt-BR') : 'Sem registro';
      const lastSheet = s.sheetQuestLastPlayedAt ? new Date(s.sheetQuestLastPlayedAt).toLocaleString('pt-BR') : 'Nunca jogou';
      return `"${s.nome}";"${s.apelido || ''}";"${s.email || s.userId}";"${s.turma || ''}";${currentLvl};${completed};"${pct}%";"${lastLogin}";"${lastSheet}";${s.sheetQuestHighScore || 0}`;
    }).join('\n');

    downloadCsv(`${headers}\n${rows}`, `relatorio_sheetquest_${selectedClassFilter}_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // ─── GESTÃO DE JOGOS DO HUB (VISIBILIDADE & ORDEM) ─────────
  const gameMetadataMap = useMemo(() => {
    const map = new Map<string, GameMetadata>();
    INITIAL_GAME_CATALOG.forEach((g) => map.set(g.id, g));
    return map;
  }, []);

  const persistHubConfig = async (
    order: string[],
    disabled: Set<string>,
    featured: string | null
  ) => {
    const payload: HubConfig = {
      disabledGames: Array.from(disabled),
      gameOrder: order,
      featuredGame: featured || undefined
    };
    try {
      if (onUpdateHubConfig) {
        await onUpdateHubConfig(payload);
      }
      await updateHubConfig(payload);
      setHubConfigState(payload);
      setHubActionMessage('✅ Alteração salva e aplicada ao Hub!');
      setTimeout(() => setHubActionMessage(null), 3000);
    } catch (err: any) {
      console.error('Erro no auto-save do hub:', err);
    }
  };

  const handleToggleGameVisibility = (gameId: string) => {
    const nextSet = new Set(disabledGamesSet);
    if (nextSet.has(gameId)) {
      nextSet.delete(gameId);
    } else {
      nextSet.add(gameId);
    }
    setDisabledGamesSet(nextSet);
    sound.playClick();
    persistHubConfig(orderedGameIds, nextSet, featuredGameId);
  };

  const handleMoveGame = (gameId: string, direction: 'up' | 'down') => {
    const index = orderedGameIds.indexOf(gameId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === orderedGameIds.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const nextOrder = [...orderedGameIds];
    const [moved] = nextOrder.splice(index, 1);
    nextOrder.splice(targetIndex, 0, moved);
    setOrderedGameIds(nextOrder);
    sound.playClick();
    persistHubConfig(nextOrder, disabledGamesSet, featuredGameId);
  };

  const handleMoveToTop = (gameId: string) => {
    const nextOrder = [gameId, ...orderedGameIds.filter((id) => id !== gameId)];
    setOrderedGameIds(nextOrder);
    sound.playUpgrade();
    persistHubConfig(nextOrder, disabledGamesSet, featuredGameId);
  };

  const handleToggleFeatured = (gameId: string) => {
    const next = featuredGameId === gameId ? '' : gameId;
    setFeaturedGameId(next);
    sound.playUpgrade();
    persistHubConfig(orderedGameIds, disabledGamesSet, next);
  };

  const handleEnableAllGames = () => {
    const emptySet = new Set<string>();
    setDisabledGamesSet(emptySet);
    sound.playUpgrade();
    persistHubConfig(orderedGameIds, emptySet, featuredGameId);
  };

  const handleDisableUnofficial = () => {
    const toDisable = new Set<string>();
    INITIAL_GAME_CATALOG.forEach((g) => {
      if (g.category !== 'Oficiais' && g.id !== 'progplay') {
        toDisable.add(g.id);
      }
    });
    setDisabledGamesSet(toDisable);
    sound.playClick();
    persistHubConfig(orderedGameIds, toDisable, featuredGameId);
  };

  const handleResetHubOrder = () => {
    const catalogIds = INITIAL_GAME_CATALOG.map((g) => g.id);
    const emptySet = new Set<string>();
    setOrderedGameIds(catalogIds);
    setDisabledGamesSet(emptySet);
    sound.playPrestige();
    persistHubConfig(catalogIds, emptySet, featuredGameId);
    setHubActionMessage('Ordem padrão dos jogos restaurada!');
    setTimeout(() => setHubActionMessage(null), 4000);
  };

  const handleSaveHubConfig = async () => {
    setIsSavingHub(true);
    setHubActionMessage(null);
    try {
      const payload: HubConfig = {
        disabledGames: Array.from(disabledGamesSet),
        gameOrder: orderedGameIds,
        featuredGame: featuredGameId
      };
      if (onUpdateHubConfig) {
        await onUpdateHubConfig(payload);
      } else {
        await updateHubConfig(payload);
      }
      setHubConfigState(payload);
      sound.playUpgrade();
      setHubActionMessage('✅ Configuração do Hub salva com sucesso na nuvem!');
      setTimeout(() => setHubActionMessage(null), 5000);
    } catch (err: any) {
      console.error('Erro ao salvar configuração do Hub:', err);
      setHubActionMessage(`❌ Erro ao salvar: ${err.message || 'Falha na rede'}`);
    } finally {
      setIsSavingHub(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── NAVEGAÇÃO DE ABAS CONSOLIDADAS ────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart className="w-4 h-4" />
            <span>Visão Geral Multi-Jogos</span>
          </button>

          <button
            onClick={() => setActiveTab('sheetquest')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'sheetquest'
                ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="flex items-center gap-1.5">
              SheetQuest (Planilhas & Acesso)
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-teal-300 text-[10px] font-mono">
                48 Fases
              </span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('hub_manager')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'hub_manager'
                ? 'bg-purple-600 text-white font-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Gestão dos Jogos do Hub (Ordem & Visibilidade)</span>
          </button>
        </div>

        {lastRefreshedAt && (
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            Atualizado às {lastRefreshedAt.toLocaleTimeString('pt-BR')}
          </span>
        )}
      </div>

      {/* ─── ABA 1: VISÃO GERAL MULTI-JOGOS ───────────────────────── */}
      {activeTab === 'overview' && (
        <section className="space-y-6">
          {/* KPIs Gerais */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Total Alunos</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{metricsSummary.total}</span>
                <span className="text-xs text-emerald-400 font-bold">ativos</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Média de PPM</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-400 font-mono">{metricsSummary.avgWpm}</span>
                <span className="text-xs text-zinc-400">PPM</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Precisão Média</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-cyan-400 font-mono">{metricsSummary.avgAcc}%</span>
                <span className="text-xs text-zinc-400">geral</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Pioneiros Nv. 100</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-amber-400 font-mono">{metricsSummary.level100Count}</span>
                <span className="text-xs text-amber-300">aluno{metricsSummary.level100Count !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Bytes Totais</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-black text-purple-400 font-mono truncate">{formatBytes(metricsSummary.totalBytes)}</span>
              </div>
            </div>
          </div>

          {/* Filtros e Barra de Ações */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              {/* Seletor de Turma */}
              <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                <select
                  value={selectedClassFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedClassFilter(val);
                    loadStudents(val);
                  }}
                  className="bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
                  title="Filtrar por Turma"
                >
                  <option value="todas" className="bg-zinc-900 text-white">Todas as Turmas</option>
                  {SCHOOL_CLASSES_CONFIG.map((group) => (
                    <optgroup key={group.grade} label={group.grade} className="bg-zinc-900 text-zinc-400">
                      {group.classes.map((cls) => (
                        <option key={cls} value={cls} className="bg-zinc-900 text-white font-medium">
                          {cls}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="Professor" className="bg-zinc-900 text-amber-300">Professores / ADM</option>
                </select>
              </div>

              {/* Busca por Nome/Apelido/Email */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nome, apelido ou e-mail..."
                  value={searchTurma}
                  onChange={(e) => setSearchTurma(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Ordenação */}
              <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Ordem:</span>
                <select
                  value={studentsSortBy}
                  onChange={(e) => setStudentsSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-zinc-300 focus:outline-none cursor-pointer"
                >
                  <option value="bytes" className="bg-zinc-900 text-white">Mais Bytes</option>
                  <option value="level" className="bg-zinc-900 text-white">Maior Nível</option>
                  <option value="wpm" className="bg-zinc-900 text-white">Maior PPM</option>
                  <option value="sheet" className="bg-zinc-900 text-white">Mais SheetQuest</option>
                  <option value="dash" className="bg-zinc-900 text-white">Mais TyperDash</option>
                  <option value="last_login" className="bg-zinc-900 text-white">Última Entrada</option>
                  <option value="nome" className="bg-zinc-900 text-white">Nome A-Z</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => loadStudents(selectedClassFilter)}
                disabled={isStudentsLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/40 rounded-lg text-emerald-200 text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-sm"
                title="Recarregar dados do banco"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isStudentsLoading ? 'animate-spin' : ''}`} />
                <span>{isStudentsLoading ? 'Carregando...' : 'Atualizar'}</span>
              </button>

              <button
                onClick={handleExportCSV}
                disabled={isStudentsLoading || filteredStudents.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-950/60 hover:bg-sky-900/80 border border-sky-600/40 rounded-lg text-sky-200 text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-sm"
                title="Baixar planilha CSV com o desempenho geral dos alunos"
              >
                <Download className="w-3.5 h-3.5 text-sky-300" />
                <span>Boletim CSV</span>
              </button>

              <button
                onClick={handleExportTurmasSummary}
                disabled={isStudentsLoading || students.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-600/40 rounded-lg text-indigo-200 text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-sm"
                title="Exportar dados consolidados agrupados por turma"
              >
                <BarChart className="w-3.5 h-3.5 text-indigo-300" />
                <span>Resumo Turmas</span>
              </button>
            </div>
          </div>

          {/* Tabela de Alunos Multi-Jogos */}
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-inner">
            <table className="w-full text-left text-xs text-zinc-400">
              <thead className="bg-zinc-900/90 text-zinc-300 uppercase font-mono font-bold text-[11px] border-b border-zinc-800">
                <tr>
                  <th className="px-3.5 py-3">Aluno</th>
                  <th className="px-3 py-3">Turma</th>
                  <th className="px-3 py-3">Classe</th>
                  <th className="px-3 py-3">Última Entrada</th>
                  <th className="px-3 py-3 text-right">Nv. Geral</th>
                  <th className="px-3 py-3 text-right">Bytes</th>
                  <th className="px-3 py-3 text-right">PPM Médio</th>
                  <th className="px-3 py-3 text-right">Precisão</th>
                  <th className="px-3 py-3 text-center">SheetQuest</th>
                  <th className="px-3 py-3 text-center">TyperDash</th>
                  <th className="px-3 py-3 text-center">Radar</th>
                  <th className="px-3 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {isStudentsLoading ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-12 text-center text-zinc-500">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                        <span>Carregando métricas dos alunos no Supabase...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-12 text-center text-zinc-500">
                      Nenhum aluno encontrado para os critérios selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const isLvl100 = (s.level || 1) >= 100;
                    const lastAct = formatLastActivity(s.lastLoginAt || s.updatedAt);

                    return (
                      <tr key={s.userId} className="hover:bg-zinc-800/40 transition-colors">
                        {/* Aluno */}
                        <td className="px-3.5 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                              <StudentAvatarRenderer
                                avatar={s.avatar || 'robot'}
                                size={28}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white truncate max-w-[150px]">
                                  {s.nome}
                                </span>
                                {isLvl100 && (
                                  <span title="Alcançou o Nível 100!" className="text-amber-400 text-xs">👑</span>
                                )}
                                {s.flaggedForReview && (
                                  <span
                                    title={s.flagReason || 'Valores anormais detectados'}
                                    className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/40 cursor-help"
                                  >
                                    Revisar
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono truncate max-w-[160px]">
                                {s.apelido ? `"${s.apelido}" • ` : ''}{s.email || s.userId.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Turma */}
                        <td className="px-3 py-2.5 font-mono">
                          <select
                            value={s.turma || ''}
                            disabled={updatingStudentId === s.userId}
                            onChange={(e) => handleUpdateStudentProfile(s.userId, { turma: e.target.value })}
                            className="bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 text-emerald-300 text-xs font-bold rounded px-1.5 py-0.5 focus:outline-none cursor-pointer disabled:opacity-50"
                            title="Clique para reatribuir a turma deste aluno"
                          >
                            <option value="">Sem Turma</option>
                            {SCHOOL_CLASSES_CONFIG.flatMap((g) => g.classes).map((c) => (
                              <option key={c} value={c} className="bg-zinc-900 text-white font-medium">
                                {c}
                              </option>
                            ))}
                            <option value="Professor" className="bg-zinc-900 text-amber-300">Professor</option>
                          </select>
                        </td>

                        {/* Classe RPG */}
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                            s.rpgClass === 'mage'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : s.rpgClass === 'archer'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}>
                            {s.rpgClass || 'warrior'}
                          </span>
                        </td>

                        {/* Última Entrada na Plataforma */}
                        <td className="px-3 py-2.5">
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  lastAct.status === 'online'
                                    ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                                    : lastAct.status === 'today'
                                    ? 'bg-amber-400'
                                    : lastAct.status === 'recent'
                                    ? 'bg-sky-400'
                                    : 'bg-zinc-600'
                                }`}
                              />
                              <span className="font-semibold text-zinc-200">{lastAct.relative}</span>
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">{lastAct.text}</span>
                          </div>
                        </td>

                        {/* Nível Geral */}
                        <td className="px-3 py-2.5 text-right font-mono font-bold">
                          <span className={isLvl100 ? 'text-amber-400 font-black' : 'text-white'}>
                            Nv. {s.level || 1}
                          </span>
                        </td>

                        {/* Bytes */}
                        <td className="px-3 py-2.5 text-right font-mono text-zinc-300">
                          {formatBytes(s.points || 0)}
                        </td>

                        {/* PPM */}
                        <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-400">
                          {s.wpm || 0} <span className="text-[10px] text-zinc-500 font-normal">PPM</span>
                        </td>

                        {/* Precisão */}
                        <td className="px-3 py-2.5 text-right font-mono text-cyan-300">
                          {s.accuracy !== undefined ? `${s.accuracy}%` : '-'}
                        </td>

                        {/* SheetQuest */}
                        <td className="px-3 py-2.5 text-center font-mono">
                          {s.sheetQuestCompletedQuests || s.sheetQuestCurrentLevel ? (
                            <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                              Nv. {s.sheetQuestCurrentLevel || s.sheetQuestCompletedQuests} ({s.sheetQuestCompletedQuests || 0}/48)
                            </span>
                          ) : (
                            <span className="text-zinc-600">-</span>
                          )}
                        </td>

                        {/* TyperDash */}
                        <td className="px-3 py-2.5 text-center font-mono">
                          {s.dashHighScore ? (
                            <span className="text-purple-300 font-bold">
                              {s.dashHighScore.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-zinc-600">-</span>
                          )}
                        </td>

                        {/* Radar */}
                        <td className="px-3 py-2.5 text-center font-mono">
                          {s.radarBestWave ? (
                            <span className="text-cyan-300 font-bold">
                              Onda {s.radarBestWave}
                            </span>
                          ) : (
                            <span className="text-zinc-600">-</span>
                          )}
                        </td>

                        {/* Ações */}
                        <td className="px-3 py-2.5 text-center">
                          <button
                            onClick={() => setSelectedStudentDetail(s)}
                            className="px-2 py-1 rounded bg-zinc-800 hover:bg-emerald-950/70 hover:text-emerald-300 hover:border-emerald-500/40 border border-zinc-700 text-zinc-300 font-bold text-[10px] transition cursor-pointer flex items-center gap-1 mx-auto"
                            title="Ver Raio-X completo do Aluno"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Raio-X</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ─── ABA 2: PAINEL DEDICADO DO SHEETQUEST ─────────────────── */}
      {activeTab === 'sheetquest' && (
        <section className="space-y-6">
          {/* Cabeçalho do Painel SheetQuest */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-zinc-950 border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl shadow-inner flex-shrink-0">
                📊
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  Painel de Acompanhamento — SheetQuest: Mestre das Planilhas
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold">
                    48 Demandas
                  </span>
                </h3>
                <p className="text-xs text-zinc-300 mt-0.5">
                  Monitore exatamente em qual nível cada aluna está, o progresso das fórmulas PT-BR e o timestamp da última entrada na plataforma.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportSheetQuestCSV}
                disabled={isStudentsLoading || filteredStudents.length === 0}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
                title="Exportar relatório completo do SheetQuest em planilha CSV"
              >
                <Download className="w-4 h-4 fill-slate-950" />
                <span>Exportar Relatório SheetQuest (CSV)</span>
              </button>
            </div>
          </div>

          {/* Cards de Métricas do SheetQuest */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Alunos no SheetQuest</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-400 font-mono">{sheetSummary.totalPlayers}</span>
                <span className="text-xs text-zinc-400">de {students.length}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Nível Médio da Turma</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white font-mono">TK-{String(Math.round(sheetSummary.avgLevel) || 1).padStart(2, '0')}</span>
                <span className="text-xs text-zinc-400">fase {sheetSummary.avgLevel}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Autonomia Pedagógica (Fase 16+)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-amber-400 font-mono">{sheetSummary.autonomousCount}</span>
                <span className="text-xs text-amber-300">aluna{sheetSummary.autonomousCount !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Mestres das Planilhas (48/48)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-cyan-400 font-mono">{sheetSummary.completedAllCount}</span>
                <span className="text-xs text-cyan-300">concluíram tudo</span>
              </div>
            </div>
          </div>

          {/* Filtros da Tabela do SheetQuest */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                <select
                  value={selectedClassFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedClassFilter(val);
                    loadStudents(val);
                  }}
                  className="bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
                >
                  <option value="todas" className="bg-zinc-900 text-white">Todas as Turmas</option>
                  {SCHOOL_CLASSES_CONFIG.map((group) => (
                    <optgroup key={group.grade} label={group.grade} className="bg-zinc-900 text-zinc-400">
                      {group.classes.map((cls) => (
                        <option key={cls} value={cls} className="bg-zinc-900 text-white font-medium">
                          {cls}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="Professor" className="bg-zinc-900 text-amber-300">Professores / ADM</option>
                </select>
              </div>

              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar aluna por nome ou apelido..."
                  value={searchTurma}
                  onChange={(e) => setSearchTurma(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Ordem:</span>
                <select
                  value={studentsSortBy}
                  onChange={(e) => setStudentsSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-zinc-300 focus:outline-none cursor-pointer"
                >
                  <option value="sheet" className="bg-zinc-900 text-white">Maior Nível SheetQuest</option>
                  <option value="last_login" className="bg-zinc-900 text-white">Última Entrada (Recente)</option>
                  <option value="level" className="bg-zinc-900 text-white">Maior Nível Geral</option>
                  <option value="bytes" className="bg-zinc-900 text-white">Mais Bytes</option>
                  <option value="nome" className="bg-zinc-900 text-white">Nome A-Z</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => loadStudents(selectedClassFilter)}
              disabled={isStudentsLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/40 rounded-lg text-emerald-200 text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isStudentsLoading ? 'animate-spin' : ''}`} />
              <span>{isStudentsLoading ? 'Atualizando...' : 'Atualizar'}</span>
            </button>
          </div>

          {/* Tabela de Acompanhamento Específico do SheetQuest */}
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-inner">
            <table className="w-full text-left text-xs text-zinc-400">
              <thead className="bg-zinc-900/90 text-zinc-300 uppercase font-mono font-bold text-[11px] border-b border-zinc-800">
                <tr>
                  <th className="px-3.5 py-3">Aluna / Aluno</th>
                  <th className="px-3 py-3">Turma</th>
                  <th className="px-3 py-3">Fase Atual no SheetQuest</th>
                  <th className="px-3 py-3">Progresso Visual</th>
                  <th className="px-3 py-3">Status de Aprendizado</th>
                  <th className="px-3 py-3">Última Entrada na Plataforma</th>
                  <th className="px-3 py-3">Último Jogo SheetQuest</th>
                  <th className="px-3 py-3 text-right">Bytes Planilha</th>
                  <th className="px-3 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {isStudentsLoading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-zinc-500">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                        <span>Carregando dados das alunas no SheetQuest...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-zinc-500">
                      Nenhuma aluna encontrada para este filtro.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const completed = s.sheetQuestCompletedQuests || 0;
                    const currentLvl = s.sheetQuestCurrentLevel || (completed > 0 ? Math.min(48, completed + 1) : 1);
                    const hasPlayed = completed > 0 || (s.sheetQuestCurrentLevel && s.sheetQuestCurrentLevel > 1);

                    const levelDef = SHEET_CAMPAIGN_LEVELS.find((l) => l.id === currentLvl) || SHEET_CAMPAIGN_LEVELS[0];
                    const progressPct = Math.min(100, Math.round((completed / 48) * 100));

                    const lastAct = formatLastActivity(s.lastLoginAt || s.updatedAt);
                    const lastSheetAct = formatLastActivity(s.sheetQuestLastPlayedAt);

                    return (
                      <tr key={s.userId} className="hover:bg-zinc-800/40 transition-colors">
                        {/* Aluna */}
                        <td className="px-3.5 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                              <StudentAvatarRenderer avatar={s.avatar || 'robot'} size={28} />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-white block truncate max-w-[150px]">
                                {s.nome}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono truncate block max-w-[160px]">
                                {s.apelido ? `"${s.apelido}" • ` : ''}{s.email || s.userId.slice(0, 8)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Turma */}
                        <td className="px-3 py-2.5 font-mono font-bold text-emerald-300">
                          {s.turma || 'Sem turma'}
                        </td>

                        {/* Fase Atual no SheetQuest */}
                        <td className="px-3 py-2.5">
                          {hasPlayed ? (
                            <div className="flex flex-col">
                              <span className="font-mono font-bold text-xs text-white flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-600/50 text-emerald-300 text-[11px]">
                                  TK-{String(currentLvl).padStart(2, '0')}
                                </span>
                                <span className="truncate max-w-[160px]" title={levelDef.title}>
                                  {levelDef.title}
                                </span>
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[180px]">
                                Mundo {levelDef.world}: {levelDef.worldName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-zinc-600 font-mono">Não iniciou</span>
                          )}
                        </td>

                        {/* Progresso Visual */}
                        <td className="px-3 py-2.5 min-w-[140px]">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-zinc-300 font-bold">{completed} / 48 demandas</span>
                              <span className="text-emerald-400 font-bold">{progressPct}%</span>
                            </div>
                            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status de Aprendizado */}
                        <td className="px-3 py-2.5">
                          {completed >= 48 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                              👑 Mestre 48/48
                            </span>
                          ) : currentLvl >= 16 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                              🧠 Autonomia (Fase {currentLvl})
                            </span>
                          ) : hasPlayed ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold">
                              📘 Aprendendo (Fase {currentLvl})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 text-[10px]">
                              Aguardando início
                            </span>
                          )}
                        </td>

                        {/* Última Entrada na Plataforma */}
                        <td className="px-3 py-2.5">
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  lastAct.status === 'online'
                                    ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                                    : lastAct.status === 'today'
                                    ? 'bg-amber-400'
                                    : lastAct.status === 'recent'
                                    ? 'bg-sky-400'
                                    : 'bg-zinc-600'
                                }`}
                              />
                              <span className="font-semibold text-zinc-200">{lastAct.relative}</span>
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">{lastAct.text}</span>
                          </div>
                        </td>

                        {/* Último Jogo no SheetQuest */}
                        <td className="px-3 py-2.5 font-mono text-[11px]">
                          {s.sheetQuestLastPlayedAt ? (
                            <span className="text-zinc-300" title={lastSheetAct.text}>
                              {lastSheetAct.relative}
                            </span>
                          ) : (
                            <span className="text-zinc-600">Nunca</span>
                          )}
                        </td>

                        {/* Pontuação */}
                        <td className="px-3 py-2.5 text-right font-mono text-zinc-300 font-bold">
                          {s.sheetQuestHighScore ? s.sheetQuestHighScore.toLocaleString() : '0'}
                        </td>

                        {/* Ações */}
                        <td className="px-3 py-2.5 text-center">
                          <button
                            onClick={() => setSelectedStudentDetail(s)}
                            className="px-2 py-1 rounded bg-zinc-800 hover:bg-emerald-950/70 hover:text-emerald-300 hover:border-emerald-500/40 border border-zinc-700 text-zinc-300 font-bold text-[10px] transition cursor-pointer flex items-center gap-1 mx-auto"
                            title="Ver detalhes de desempenho"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Detalhes</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ─── ABA 3: GESTÃO DE JOGOS DO HUB (VISIBILIDADE & ORDEM) ── */}
      {activeTab === 'hub_manager' && (
        <section className="space-y-6">
          {/* Cabeçalho do Gestor do Hub */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-black border border-purple-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 text-2xl shadow-inner flex-shrink-0">
                  🕹️
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    Personalização do Catálogo do Hub
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold">
                      {orderedGameIds.length} Jogos
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Defina quais jogos ficam visíveis para os alunos no Hub principal e reordene as posições dos cards com os botões Subir / Descer.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleSaveHubConfig}
                  disabled={isSavingHub}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50"
                  title="Salvar a visibilidade e a ordem personalizada dos jogos no Supabase"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>{isSavingHub ? 'Salvando...' : 'Salvar Configuração do Hub'}</span>
                </button>
              </div>
            </div>

            {hubActionMessage && (
              <div className="p-3 rounded-lg bg-zinc-950 border border-purple-500/50 text-purple-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
                <span>{hubActionMessage}</span>
              </div>
            )}

            {/* Ações Rápidas de Configuração */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEnableAllGames}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-600/40 text-xs font-bold transition cursor-pointer"
                >
                  ✓ Ativar Todos no Hub
                </button>
                <button
                  onClick={handleDisableUnofficial}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-bold transition cursor-pointer"
                >
                  Ocultar Jogos Não-Oficiais
                </button>
              </div>

              <button
                onClick={handleResetHubOrder}
                className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-700/40 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                <span>Restaurar Ordem Padrão</span>
              </button>
            </div>
          </div>

          {/* Lista de Jogos com Controles de Visibilidade e Ordenação */}
          <div className="space-y-2.5">
            {orderedGameIds.map((gameId, index) => {
              const meta = gameMetadataMap.get(gameId);
              if (!meta) return null;
              const isDisabled = disabledGamesSet.has(gameId);
              const isFeatured = featuredGameId === gameId;

              return (
                <div
                  key={gameId}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isDisabled
                      ? 'bg-zinc-950/60 border-zinc-800/80 opacity-60'
                      : isFeatured
                      ? 'bg-purple-950/30 border-purple-500/60 shadow-md ring-1 ring-purple-500/30'
                      : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Posição no Hub */}
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-black text-xs text-zinc-300 flex-shrink-0">
                      #{index + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">{meta.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          meta.category === 'Oficiais'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}>
                          {meta.category}
                        </span>
                        {isFeatured && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400" />
                            Destaque
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 truncate max-w-lg mt-0.5">{meta.description}</p>
                    </div>
                  </div>

                  {/* Controles de Ordenação e Visibilidade */}
                  <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
                    {/* Botão Destaque */}
                    <button
                      onClick={() => handleToggleFeatured(gameId)}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        isFeatured
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-amber-300 hover:border-amber-500/40'
                      }`}
                      title={isFeatured ? 'Este jogo é o destaque atual do Hub' : 'Definir este jogo como destaque no topo do Hub'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-slate-950' : ''}`} />
                    </button>

                    {/* Botões Reordenar */}
                    <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800 p-0.5">
                      <button
                        onClick={() => handleMoveGame(gameId, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                        title="Subir posição no Hub"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveGame(gameId, 'down')}
                        disabled={index === orderedGameIds.length - 1}
                        className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                        title="Descer posição no Hub"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleMoveToTop(gameId)}
                      disabled={index === 0}
                      className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold border border-zinc-700 transition cursor-pointer disabled:opacity-30"
                      title="Mover diretamente para a 1ª posição"
                    >
                      Topo
                    </button>

                    {/* Toggle Visibilidade */}
                    <button
                      onClick={() => handleToggleGameVisibility(gameId)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                        isDisabled
                          ? 'bg-red-950/50 border-red-700/60 text-red-300 hover:bg-red-900/60'
                          : 'bg-emerald-950/60 border-emerald-600/50 text-emerald-200 hover:bg-emerald-900/70'
                      }`}
                      title={isDisabled ? 'Clique para ativar no Hub dos alunos' : 'Clique para ocultar do Hub dos alunos'}
                    >
                      <span className={`w-2 h-2 rounded-full ${isDisabled ? 'bg-red-500' : 'bg-emerald-400'}`} />
                      <span>{isDisabled ? 'Oculto para Alunos' : 'Visível no Hub'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─── MODAL RAIO-X COMPLETO DO ALUNO ────────────────────────── */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-emerald-500/40 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <StudentAvatarRenderer
                    avatar={selectedStudentDetail.avatar || 'robot'}
                    size={40}
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {selectedStudentDetail.nome}
                    {selectedStudentDetail.apelido && (
                      <span className="text-xs text-emerald-400 font-normal">
                        ({selectedStudentDetail.apelido})
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Turma: <strong className="text-emerald-300">{selectedStudentDetail.turma || 'Sem turma'}</strong> • Classe: <strong className="text-purple-300 uppercase">{selectedStudentDetail.rpgClass || 'Guerreiro'}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corpo com Grid de Estatísticas por Jogo */}
            <div className="overflow-y-auto pr-1 space-y-4 custom-scrollbar text-xs">
              {/* Status de Acesso */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Última Entrada na Plataforma:</span>
                <span className="text-emerald-400 font-bold">
                  {formatLastActivity(selectedStudentDetail.lastLoginAt || selectedStudentDetail.updatedAt).text}
                </span>
              </div>

              {/* SheetQuest */}
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-bold font-mono">
                  <span>📊 SHEETQUEST (MESTRE DAS PLANILHAS)</span>
                  <span>Fase Atual: {selectedStudentDetail.sheetQuestCurrentLevel || 1} / 48</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block">Demandas Resolvidas:</span>
                    <strong className="text-white font-mono">{selectedStudentDetail.sheetQuestCompletedQuests || 0} de 48</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Último Jogo SheetQuest:</span>
                    <strong className="text-cyan-300 font-mono">
                      {selectedStudentDetail.sheetQuestLastPlayedAt ? formatLastActivity(selectedStudentDetail.sheetQuestLastPlayedAt).relative : 'Nunca jogou'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Pontuação Recorde:</span>
                    <strong className="text-emerald-400 font-mono">{selectedStudentDetail.sheetQuestHighScore || 0}</strong>
                  </div>
                </div>
              </div>

              {/* TypeClicker */}
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-bold font-mono">
                  <span>⌨️ TYPECLICKER</span>
                  <span>Nível {selectedStudentDetail.level || 1}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-zinc-500 block">Bytes Totais:</span>
                    <strong className="text-white font-mono">{formatBytes(selectedStudentDetail.points || 0)}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">PPM Médio:</span>
                    <strong className="text-emerald-400 font-mono">{selectedStudentDetail.wpm || 0} PPM</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Precisão:</span>
                    <strong className="text-cyan-300 font-mono">{selectedStudentDetail.accuracy || 100}%</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Combo Máximo:</span>
                    <strong className="text-amber-400 font-mono">{selectedStudentDetail.maxCombo || 0}</strong>
                  </div>
                </div>
              </div>

              {/* TyperDash & Radar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
                  <span className="font-bold font-mono text-purple-400 block">🏃 TYPERDASH</span>
                  <div className="text-[11px] space-y-1">
                    <div>Recorde: <strong className="text-white font-mono">{selectedStudentDetail.dashHighScore || 0}</strong></div>
                    <div>Combo Máx: <strong className="text-purple-300 font-mono">{selectedStudentDetail.dashMaxCombo || 0}</strong></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
                  <span className="font-bold font-mono text-cyan-400 block">📡 TYPE: RADAR</span>
                  <div className="text-[11px] space-y-1">
                    <div>Melhor Onda: <strong className="text-white font-mono">{selectedStudentDetail.radarBestWave || 1}</strong></div>
                    <div>Recorde: <strong className="text-cyan-300 font-mono">{selectedStudentDetail.radarHighScore || 0}</strong></div>
                  </div>
                </div>
              </div>

              {/* Duelo PvP e Corridas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
                  <span className="font-bold font-mono text-rose-400 block">⚔️ ARENA PVP 1x1</span>
                  <div className="text-[11px] space-y-1">
                    <div>Vitórias: <strong className="text-white font-mono">{selectedStudentDetail.pvpWins || 0} / {selectedStudentDetail.pvpMatches || 0}</strong></div>
                    <div>Pontos de Duelo: <strong className="text-rose-300 font-mono">{selectedStudentDetail.pvpPoints || 0}</strong></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1.5">
                  <span className="font-bold font-mono text-amber-400 block">🏁 CORRIDAS ESCOLARES</span>
                  <div className="text-[11px] space-y-1">
                    <div>Vitórias: <strong className="text-white font-mono">{selectedStudentDetail.raceWins || 0}</strong></div>
                    <div>Melhor PPM em Corrida: <strong className="text-amber-300 font-mono">{selectedStudentDetail.bestRaceWpm || 0} PPM</strong></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Fechar Raio-X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
