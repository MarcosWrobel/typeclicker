import React,{ useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
Key,
X,
Clock,
AlertTriangle,
Users,
Search,
RefreshCw,
BarChart,
Download,
CheckCircle2,
FileText,
Sliders,
Battery,
EyeOff,
Filter,
Swords,
Sparkles,
Flag,
BookOpen,
Flame,
GraduationCap,
Eye,
Trash2,
Plus,
Gamepad2,
Keyboard,
Radio,
Timer,
Trophy,
Rocket,
Medal,
School
} from 'lucide-react';
import { dbService } from '../services/dbFactory';
import { LeaderboardEntry } from '../types/leaderboard';
import {
auth,
generateSessionCode,
clearSessionCode,
SystemSettings,
getSystemSettings,
updateAccessibilitySettings,
saveCustomCurricularText,
deleteCustomCurricularText,
updateActiveSessionTrack,
updateHubConfig,
HubConfig
} from '../services/firebaseService';
import { exportToCsv, downloadCsv } from '../services/turmasAggregator';
import { CurricularTrackId, CustomCurricularText } from '../types';
import { CURRICULAR_TRACKS, getCurricularTrack, suggestTrackForTurma } from '../data/tracks';
import { TrackIconRenderer } from './vectors';
import { RpgClassType } from '../types/rpgClass';
import {
launchClassroomRace,
cancelClassroomRace,
subscribeToActiveRace,
PRESET_RACE_TEXTS
} from '../services/raceService';
import {
launchClassroomRaid,
cancelClassroomRaid,
subscribeToActiveRaid
} from '../services/raidService';
import { ClassroomRace, PresetRaceText } from '../types/race';
import { ClassroomRaid, PRESET_RAID_BOSSES, PresetRaidBoss } from '../types/raid';
import { SCHOOL_CLASSES_CONFIG } from './StudentModal';
import { sound } from '../utils/audio';
import { formatBytes } from '../utils/formatting';

export interface PedagogicalPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string | null;
  activeClass?: string;
  onOpenRaceArena?: () => void;
  onOpenRaidArena?: () => void;
}

export const PedagogicalPanel: React.FC<PedagogicalPanelProps> = ({
  isOpen,
  onClose,
  userEmail,
  activeClass,
  onOpenRaceArena,
  onOpenRaidArena
}) => {
  const [activeTab, setActiveTab] = useState<'locks' | 'dashboard' | 'corrida' | 'raid' | 'textos'>('locks');

  // Configurações do Sistema e Acessibilidade
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para Corrida em Tempo Real da Turma
  const [activeRace, setActiveRace] = useState<ClassroomRace | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_RACE_TEXTS[0].id);
  const [customRaceTitle, setCustomRaceTitle] = useState<string>(PRESET_RACE_TEXTS[0].title);
  const [customRaceText, setCustomRaceText] = useState<string>(PRESET_RACE_TEXTS[0].text);
  const [customRaceSource, setCustomRaceSource] = useState<string>(PRESET_RACE_TEXTS[0].source);
  const [raceTargetTurma, setRaceTargetTurma] = useState<string>(activeClass || 'todas');
  const [raceCountdownSec, setRaceCountdownSec] = useState<number>(5);
  const [racePrizeBytes, setRacePrizeBytes] = useState<number>(25000);
  const [isLaunchingRace, setIsLaunchingRace] = useState<boolean>(false);
  const [isCancellingRace, setIsCancellingRace] = useState<boolean>(false);
  const [raceActionFeedback, setRaceActionFeedback] = useState<string | null>(null);

  // Estados para Raid Coletiva contra Chefe
  const [activeRaid, setActiveRaid] = useState<ClassroomRaid | null>(null);
  const [selectedRaidBossId, setSelectedRaidBossId] = useState<string>(PRESET_RAID_BOSSES[0].id);
  const [raidTargetTurma, setRaidTargetTurma] = useState<string>(activeClass || 'todas');
  const [raidMaxHp, setRaidMaxHp] = useState<number>(PRESET_RAID_BOSSES[0].maxHp);
  const [raidTimeLimitSec, setRaidTimeLimitSec] = useState<number>(PRESET_RAID_BOSSES[0].timeLimitSeconds);
  const [raidPrizeBytes, setRaidPrizeBytes] = useState<number>(PRESET_RAID_BOSSES[0].prizeBytes);
  const [isLaunchingRaid, setIsLaunchingRaid] = useState<boolean>(false);
  const [isCancellingRaid, setIsCancellingRaid] = useState<boolean>(false);
  const [raidActionFeedback, setRaidActionFeedback] = useState<string | null>(null);

  // Estados para Textos Curriculares do Professor
  const [newTextTitle, setNewTextTitle] = useState<string>('');
  const [newTextDiscipline, setNewTextDiscipline] = useState<string>('Português');
  const [newTextTurma, setNewTextTurma] = useState<string>(activeClass || 'todas');
  const [newTextContent, setNewTextContent] = useState<string>('');
  const [isSavingText, setIsSavingText] = useState<boolean>(false);
  const [textFeedback, setTextFeedback] = useState<string | null>(null);
  const [selectedPreviewText, setSelectedPreviewText] = useState<CustomCurricularText | null>(null);
  const [textFilterDiscipline, setTextFilterDiscipline] = useState<string>('todas');

  // Estados do Dashboard de Alunos
  const [students, setStudents] = useState<LeaderboardEntry[]>([]);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [searchTurma, setSearchTurma] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>(activeClass || 'todas');
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [targetTurmaForCode, setTargetTurmaForCode] = useState<string>(activeClass || '');
  const [selectedTrackForCode, setSelectedTrackForCode] = useState<CurricularTrackId>(
    activeClass ? suggestTrackForTurma(activeClass) : 'geral'
  );
  const [isChangingLiveTrack, setIsChangingLiveTrack] = useState<boolean>(false);
  const [updatingStudentId, setUpdatingStudentId] = useState<string | null>(null);
  const [isAutoBalancing, setIsAutoBalancing] = useState<boolean>(false);

  // Hub de Jogos
  const [hubConfig, setHubConfig] = useState<HubConfig>(
    () => (settings as any)?.hubConfig ?? {}
  );
  const [isUpdatingHub, setIsUpdatingHub] = useState<boolean>(false);
  const [hubFeedback, setHubFeedback] = useState<string | null>(null);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const data = await getSystemSettings();
      setSettings(data);
      if (data?.hubConfig) {
        setHubConfig(data.hubConfig);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudents = async (turmaToFetch = selectedClassFilter) => {
    setIsStudentsLoading(true);
    try {
      const targetTurma = turmaToFetch === 'todas' ? undefined : turmaToFetch;
      const data = await dbService.getAdminDashboardData(targetTurma);
      setStudents(data);
      setLastRefreshedAt(new Date());
    } catch (e) {
      console.error('Error loading students:', e);
    } finally {
      setIsStudentsLoading(false);
    }
  };

  // Atalho ESC
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

  // Carregamento inicial ao abrir
  useEffect(() => {
    if (isOpen) {
      loadSettings();
      if (activeTab === 'dashboard') {
        loadStudents(selectedClassFilter);
      }
    }
  }, [isOpen, activeTab, selectedClassFilter]);

  // Inscrição em tempo real na corrida e na raid
  useEffect(() => {
    const unsubRace = subscribeToActiveRace((race) => {
      setActiveRace(race);
    });
    const unsubRaid = subscribeToActiveRaid((raid) => {
      setActiveRaid(raid);
    });
    return () => {
      unsubRace();
      unsubRaid();
    };
  }, []);

  // Polling controlado para o dashboard pedagógico (60s)
  useEffect(() => {
    if (!isOpen || activeTab !== 'dashboard') return;

    const pollInterval = setInterval(() => {
      if (typeof document !== 'undefined' && (document.hidden || !document.hasFocus())) {
        return;
      }
      loadStudents(selectedClassFilter);
    }, 60000);

    return () => clearInterval(pollInterval);
  }, [isOpen, activeTab, selectedClassFilter]);

  const handleToggleGame = async (gameId: string) => {
    const current = Array.isArray(hubConfig.disabledGames) ? hubConfig.disabledGames : [];
    const next = current.includes(gameId)
      ? current.filter((g) => g !== gameId)
      : [...current, gameId];
    const newConfig: HubConfig = { ...hubConfig, disabledGames: next };
    setHubConfig(newConfig);
    setIsUpdatingHub(true);
    setHubFeedback(null);
    try {
      await updateHubConfig(newConfig);
      setHubFeedback(`Hub atualizado! Jogo "${gameId}" ${next.includes(gameId) ? 'desativado' : 'reativado'} para os alunos.`);
    } catch (e: any) {
      setHubFeedback(`Erro ao atualizar hub: ${e.message}`);
    } finally {
      setIsUpdatingHub(false);
      setTimeout(() => setHubFeedback(null), 4000);
    }
  };

  const handleGenerateCode = async (hours: number) => {
    if (!targetTurmaForCode) {
      alert('Por favor, selecione a Turma antes de gerar o código da sessão.');
      return;
    }
    setIsLoading(true);
    try {
      await generateSessionCode(hours, targetTurmaForCode, selectedTrackForCode);
      await loadSettings();
      sound.playPrestige();
    } catch (e) {
      alert('Erro ao gerar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCode = async () => {
    setIsLoading(true);
    try {
      await clearSessionCode();
      await loadSettings();
    } catch (e) {
      alert('Erro ao limpar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeLiveTrack = async (newTrack: CurricularTrackId) => {
    setIsChangingLiveTrack(true);
    try {
      await updateActiveSessionTrack(newTrack);
      await loadSettings();
      sound.playUpgrade();
    } catch (e: any) {
      alert('Erro ao alterar a trilha da aula: ' + (e.message || e));
    } finally {
      setIsChangingLiveTrack(false);
    }
  };

  const handleUpdateAccessibility = async (updates: { focusTimeoutSetting?: number; reducedAlerts?: boolean }) => {
    setIsLoading(true);
    try {
      await updateAccessibilitySettings(updates);
      await loadSettings();
      sound.playUpgrade();
    } catch (e: any) {
      alert(`Erro ao salvar configurações de acessibilidade: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers de Corrida
  const handleSelectPreset = (preset: PresetRaceText) => {
    setSelectedPresetId(preset.id);
    setCustomRaceTitle(preset.title);
    setCustomRaceText(preset.text);
    setCustomRaceSource(preset.source);
  };

  const handleLaunchRace = async () => {
    const currentUser = auth.currentUser || {
      uid: 'admin_' + (userEmail ? userEmail.replace(/[^a-zA-Z0-9]/g, '_') : 'teacher'),
      email: userEmail || 'professor@escola.pr.gov.br'
    };
    if (!customRaceText.trim()) {
      setRaceActionFeedback('O texto da corrida não pode estar vazio!');
      return;
    }
    setIsLaunchingRace(true);
    setRaceActionFeedback(null);
    try {
      await launchClassroomRace(
        {
          title: customRaceTitle,
          text: customRaceText,
          source: customRaceSource,
          targetTurma: raceTargetTurma,
          countdownSeconds: raceCountdownSec,
          prizeBytes: racePrizeBytes
        },
        currentUser
      );
      sound.playPrestige();
      setRaceActionFeedback('Corrida disparada com sucesso para a sessão escolar!');
      setTimeout(() => setRaceActionFeedback(null), 5000);
    } catch (err: any) {
      sound.playChallengeFail();
      console.error('Erro ao disparar corrida:', err);
      setRaceActionFeedback(`Erro ao disparar corrida: ${err.message || err}`);
    } finally {
      setIsLaunchingRace(false);
    }
  };

  const handleCancelRace = async () => {
    setIsCancellingRace(true);
    try {
      await cancelClassroomRace();
      sound.playWordComplete();
      setRaceActionFeedback('Corrida ativa cancelada.');
      setTimeout(() => setRaceActionFeedback(null), 3000);
    } catch (err: any) {
      setRaceActionFeedback(`Erro ao cancelar corrida: ${err.message}`);
    } finally {
      setIsCancellingRace(false);
    }
  };

  // Handlers de Raid
  const handleSelectRaidBoss = (boss: PresetRaidBoss) => {
    setSelectedRaidBossId(boss.id);
    setRaidMaxHp(boss.maxHp);
    setRaidTimeLimitSec(boss.timeLimitSeconds);
    setRaidPrizeBytes(boss.prizeBytes);
  };

  const handleLaunchRaid = async () => {
    const currentUser = auth.currentUser || {
      uid: 'admin_' + (userEmail ? userEmail.replace(/[^a-zA-Z0-9]/g, '_') : 'teacher'),
      email: userEmail || 'professor@escola.pr.gov.br'
    };

    const boss = PRESET_RAID_BOSSES.find((b) => b.id === selectedRaidBossId) || PRESET_RAID_BOSSES[0];

    setIsLaunchingRaid(true);
    setRaidActionFeedback(null);
    try {
      await launchClassroomRaid(
        {
          bossId: boss.id,
          bossName: boss.name,
          bossSubtitle: boss.subtitle,
          bossIcon: boss.icon,
          maxHp: raidMaxHp,
          timeLimitSeconds: raidTimeLimitSec,
          prizeBytes: raidPrizeBytes,
          targetTurma: raidTargetTurma
        },
        currentUser
      );
      sound.playChallengeSuccess();
      setRaidActionFeedback(`Raid contra "${boss.name}" iniciada com sucesso!`);
      setTimeout(() => setRaidActionFeedback(null), 5000);
    } catch (err: any) {
      sound.playError();
      setRaidActionFeedback(`Erro ao iniciar Raid: ${err.message || err}`);
    } finally {
      setIsLaunchingRaid(false);
    }
  };

  const handleCancelRaid = async () => {
    setIsCancellingRaid(true);
    try {
      await cancelClassroomRaid();
      sound.playWordComplete();
      setRaidActionFeedback('Raid ativa cancelada.');
      setTimeout(() => setRaidActionFeedback(null), 3000);
    } catch (err: any) {
      setRaidActionFeedback(`Erro ao cancelar Raid: ${err.message}`);
    } finally {
      setIsCancellingRaid(false);
    }
  };

  // Handlers de Exportação
  const handleExportCSV = () => {
    const listToExport = filteredStudents.length > 0 ? filteredStudents : students;
    if (!listToExport || listToExport.length === 0) {
      alert('Nenhum dado de aluno disponível para exportação no momento.');
      return;
    }

    const headers = [
      'Nome',
      'Apelido',
      'Turma',
      'Nivel',
      'Total Bytes',
      'PPM Atual',
      'Melhor PPM',
      'Precisao (%)',
      'Vitorias Corridas',
      'Participacoes Corridas',
      'Vitorias PvP',
      'Pontos PvP',
      'Maior Combo',
      'Alerta Anti-Cheat',
      'Motivo Alerta',
      'Ultima Atividade'
    ];

    const rows = listToExport.map((s) => {
      const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;
      return [
        escape(s.nome),
        escape(s.apelido || ''),
        escape(s.turma || ''),
        s.level ?? 1,
        s.points ?? 0,
        s.wpm ?? 0,
        s.bestWpm || s.wpm || 0,
        s.accuracy ?? 100,
        s.raceWins ?? 0,
        s.racesParticipated ?? 0,
        s.pvpWins ?? 0,
        s.pvpPoints ?? 0,
        s.maxCombo ?? 0,
        s.flaggedForReview ? 'SIM' : 'NAO',
        escape(s.flagReason || ''),
        escape(s.updatedAt ? new Date(s.updatedAt).toLocaleString('pt-BR') : '')
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const turmaSuffix = selectedClassFilter === 'todas' ? 'todas_turmas' : selectedClassFilter.replace(/[^a-zA-Z0-9]/g, '_');
    const dateSuffix = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `boletim_typeclicker_${turmaSuffix}_${dateSuffix}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    sound.playWordComplete();
  };

  const handleExportPedagogicalCSV = (mode: 'pedagogical' | 'turmas' = 'pedagogical') => {
    const list = filteredStudents.length > 0 ? filteredStudents : students;
    if (!list || list.length === 0) {
      alert('Nenhum dado de aluno disponível para exportação.');
      return;
    }
    const csv = exportToCsv(list, mode, selectedClassFilter);
    const turmaSuffix = selectedClassFilter === 'todas' ? 'todas_turmas' : selectedClassFilter.replace(/[^a-zA-Z0-9]/g, '_');
    const dateSuffix = new Date().toISOString().slice(0, 10);
    const label = mode === 'turmas' ? 'resumo_turmas' : 'pedagogico_multigame';
    downloadCsv(csv, `typeclicker_${label}_${turmaSuffix}_${dateSuffix}.csv`);
    sound.playWordComplete();
  };

  // Gerenciamento de Alunos & Classes
  const handleUpdateStudentProfile = async (
    studentUserId: string,
    updates: { turma?: string; rpgClass?: RpgClassType }
  ) => {
    setUpdatingStudentId(studentUserId);
    try {
      await dbService.adminUpdateStudentProfile(studentUserId, updates);
      setStudents((prev) =>
        prev.map((s) => {
          if (s.userId === studentUserId) {
            return {
              ...s,
              ...(updates.turma !== undefined ? { turma: updates.turma } : {}),
              ...(updates.rpgClass !== undefined ? { rpgClass: updates.rpgClass } : {})
            };
          }
          return s;
        })
      );
      sound.playUpgrade();
    } catch (e: any) {
      alert(`Erro ao atualizar aluno: ${e.message || e}`);
    } finally {
      setUpdatingStudentId(null);
    }
  };

  const handleAutoBalanceRpg = async () => {
    if (!selectedClassFilter || selectedClassFilter === 'todas') {
      alert('Selecione uma turma específica no filtro para balancear as classes.');
      return;
    }
    const confirmed = window.confirm(
      `Deseja distribuir automaticamente as classes RPG para os alunos da turma ${selectedClassFilter}? (1/3 Guerreiro, 1/3 Arqueiro, 1/3 Mago)`
    );
    if (!confirmed) return;
    setIsAutoBalancing(true);
    try {
      const res = await dbService.adminAutoBalanceRpgClasses(selectedClassFilter);
      await loadStudents(selectedClassFilter);
      sound.playPrestige();
      alert(
        `Balanceamento concluído para ${res.updatedCount} alunos da turma ${selectedClassFilter}!\nGuerreiros: ${res.distribution.warrior} | Arqueiros: ${res.distribution.archer} | Magos: ${res.distribution.mage}`
      );
    } catch (err: any) {
      alert(`Erro ao balancear classes: ${err.message || err}`);
    } finally {
      setIsAutoBalancing(false);
    }
  };

  // Biblioteca de Textos Curriculares
  const handleSaveCustomText = async () => {
    if (!newTextTitle.trim()) {
      setTextFeedback('Por favor, informe o título do texto curricular.');
      return;
    }
    if (!newTextContent.trim() || newTextContent.trim().length < 20) {
      setTextFeedback('O conteúdo deve ter pelo menos 20 caracteres para ser aproveitado.');
      return;
    }
    setIsSavingText(true);
    setTextFeedback(null);
    try {
      await saveCustomCurricularText({
        title: newTextTitle.trim(),
        discipline: newTextDiscipline,
        targetTurma: newTextTurma,
        content: newTextContent.trim()
      });
      await loadSettings();
      setNewTextTitle('');
      setNewTextContent('');
      sound.playPrestige();
      setTextFeedback('Texto curricular salvo e publicado com sucesso!');
      setTimeout(() => setTextFeedback(null), 4000);
    } catch (err: any) {
      sound.playChallengeFail();
      setTextFeedback(`Erro ao salvar texto: ${err.message || err}`);
    } finally {
      setIsSavingText(false);
    }
  };

  const handleDeleteCustomText = async (textId: string) => {
    if (!confirm('Deseja realmente remover este texto da biblioteca escolar?')) return;
    try {
      await deleteCustomCurricularText(textId);
      await loadSettings();
      sound.playWordComplete();
    } catch (err: any) {
      alert(`Erro ao excluir texto: ${err.message || err}`);
    }
  };

  const handleUseCustomTextInRace = (text: CustomCurricularText) => {
    setSelectedPresetId(text.id);
    setCustomRaceTitle(text.title);
    setCustomRaceText(text.content);
    setCustomRaceSource(`Professor (${text.discipline} - ${text.authorName || 'Docente'})`);
    if (text.targetTurma && text.targetTurma !== 'todas') {
      setRaceTargetTurma(text.targetTurma);
    }
    setActiveTab('corrida');
    sound.playPrestige();
  };

  const isActive = settings?.activeCode && settings?.expiresAt && new Date(settings.expiresAt) > new Date();

  const filteredStudents = students.filter((s) => {
    if (!searchTurma.trim()) return true;
    const term = searchTurma.toLowerCase().trim();
    return (
      (s.nome || '').toLowerCase().includes(term) ||
      (s.apelido || '').toLowerCase().includes(term) ||
      (s.turma || '').toLowerCase().includes(term)
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl xl:max-w-6xl bg-zinc-950 border border-emerald-500/40 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col overflow-hidden max-h-[92vh]"
          >
            {/* Header Superior Esmeralda/Sky */}
            <div className="px-5 pt-4 pb-3 border-b border-white/10 bg-gradient-to-r from-emerald-950/30 via-zinc-950 to-sky-950/20 flex flex-col gap-3.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm flex-shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-black text-white tracking-tight truncate">
                        Painel Pedagógico
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Professor
                      </span>
                      {activeClass && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 inline-flex items-center gap-1">
                          <School className="w-3 h-3" /> {activeClass}
                        </span>
                      )}
                    </div>
                    {userEmail && (
                      <p className="text-xs text-zinc-400 font-mono truncate max-w-xs sm:max-w-md">
                        {userEmail}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-zinc-900/80 hover:bg-white/10 text-zinc-400 hover:text-white border border-zinc-800 transition flex-shrink-0 cursor-pointer"
                  title="Fechar Painel (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Barra de Navegação das Abas Pedagógicas */}
              <div className="flex items-center gap-1.5 p-1.5 bg-zinc-900/90 rounded-xl border border-zinc-800/90 overflow-x-auto custom-scrollbar flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => setActiveTab('locks')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === 'locks'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Controle de Acesso, Código da Aula e Acessibilidade"
                >
                  <Key className="w-4 h-4 text-emerald-300" />
                  <span>Sessões & Códigos</span>
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Boletim, PPM, Turmas e Classes RPG dos Alunos"
                >
                  <BarChart className="w-4 h-4 text-emerald-300" />
                  <span>Desempenho & Boletim</span>
                </button>

                <button
                  onClick={() => setActiveTab('corrida')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === 'corrida'
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 font-black'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Lançador de Corrida da Turma em Tempo Real"
                >
                  <Flag className="w-4 h-4 text-amber-400" />
                  <span>Corrida da Turma</span>
                </button>

                <button
                  onClick={() => setActiveTab('raid')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === 'raid'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-black'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Lançador de Raid Coletiva contra Chefe em Tempo Real"
                >
                  <Swords className="w-4 h-4 text-rose-400" />
                  <span>Raid Coletiva</span>
                </button>

                <button
                  onClick={() => setActiveTab('textos')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === 'textos'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Biblioteca de Textos Curriculares e Pedagógicos do Professor"
                >
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Textos Curriculares</span>
                </button>
              </div>
            </div>

            {/* Conteúdo com Scroll */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
              {/* ABA 1: SESSÕES & TRAVA DE AMBIENTE */}
              {activeTab === 'locks' && (
                <>
                  <section className="space-y-4 max-w-xl mx-auto">
                    <div className="flex items-center gap-2 text-zinc-300 font-bold border-b border-zinc-800 pb-2">
                      <Key className="w-5 h-5 text-emerald-400" />
                      <h3>Trava de Ambiente Escolar (Laboratório)</h3>
                    </div>

                    <p className="text-sm text-zinc-400">
                      Gere um código de aula temporário. Alunos precisarão digitar este código para desbloquear o jogo. Sem um código ativo, o acesso ao jogo fica bloqueado.
                    </p>

                    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Status da Aula</div>
                          {isActive ? (
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-3xl font-black text-emerald-400 tracking-widest">{settings?.activeCode}</span>
                                {settings?.activeTurma && (
                                  <span className="text-xs px-2.5 py-1 rounded-full font-mono font-bold bg-sky-950 text-sky-300 border border-sky-500/40 inline-flex items-center gap-1.5">
                                    <School className="w-3.5 h-3.5 text-sky-400" /> Turma: {settings.activeTurma}
                                  </span>
                                )}
                                {settings?.activeTrack && (
                                  <span className="text-xs px-2.5 py-1 rounded-full font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 shadow-sm">
                                    <TrackIconRenderer trackId={settings.activeTrack} className="w-3.5 h-3.5 text-purple-400" />
                                    <span>{getCurricularTrack(settings.activeTrack).name}</span>
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-emerald-500/70 mt-1.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Expira em: {new Date(settings!.expiresAt!).toLocaleTimeString()}
                              </div>
                            </div>
                          ) : (
                            <div className="text-lg font-bold text-zinc-500">Nenhuma aula ativa</div>
                          )}
                        </div>

                        {isActive && (
                          <button
                            onClick={handleClearCode}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/20 font-bold transition cursor-pointer"
                          >
                            Encerrar
                          </button>
                        )}
                      </div>

                      {/* Alternador Rápido de Trilha em Aula Aberta */}
                      {isActive && (
                        <div className="pt-2.5 border-t border-zinc-800/80 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Mudar Trilha da Aula em Tempo Real:</span>
                            </span>
                            {isChangingLiveTrack && (
                              <span className="text-[10px] text-amber-400 font-mono animate-pulse">Sincronizando...</span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
                            {CURRICULAR_TRACKS.map((t) => {
                              const isCurrent = (settings?.activeTrack || 'geral') === t.id;
                              return (
                                <button
                                  key={t.id}
                                  type="button"
                                  disabled={isChangingLiveTrack}
                                  onClick={() => handleChangeLiveTrack(t.id)}
                                  className={`px-2 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 border text-center ${
                                    isCurrent
                                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800 hover:border-zinc-700'
                                  }`}
                                  title={`${t.discipline} • ${t.targetAudience}`}
                                >
                                  <span>{t.icon}</span>
                                  <span className="truncate">{t.name.split('(')[0].trim()}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Seletor de Turma Obrigatório */}
                    <div className="space-y-2 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-emerald-400" />
                          <span>Turma para esta Aula (Obrigatória):</span>
                        </label>
                        {targetTurmaForCode && (
                          <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                            {targetTurmaForCode}
                          </span>
                        )}
                      </div>
                      <select
                        value={targetTurmaForCode}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTargetTurmaForCode(val);
                          if (val) {
                            const suggested = suggestTrackForTurma(val);
                            setSelectedTrackForCode(suggested);
                          }
                        }}
                        disabled={isLoading}
                        className="w-full bg-zinc-950 border border-zinc-700 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 transition font-mono font-bold cursor-pointer"
                      >
                        <option value="">-- Selecione a Turma que Terá Aula Agora --</option>
                        {SCHOOL_CLASSES_CONFIG.map((group) => (
                          <optgroup key={group.grade} label={group.grade}>
                            {group.classes.map((cls) => (
                              <option key={cls} value={cls}>
                                {cls}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      {!targetTurmaForCode && (
                        <p className="text-[11px] text-amber-400/90 flex items-center gap-1 pt-0.5">
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Selecione a turma para vincular e travar automaticamente nos alunos ao desbloquear.</span>
                        </p>
                      )}
                    </div>

                    {/* Seletor de Trilha Curricular Dinâmica */}
                    <div className="space-y-2 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-emerald-400" />
                          <span>Trilha Curricular da Aula:</span>
                        </label>
                        <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1.5">
                          <TrackIconRenderer trackId={selectedTrackForCode} className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{getCurricularTrack(selectedTrackForCode).name}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {CURRICULAR_TRACKS.map((track) => {
                          const isSelected = selectedTrackForCode === track.id;
                          return (
                            <button
                              key={track.id}
                              type="button"
                              onClick={() => setSelectedTrackForCode(track.id)}
                              className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                                  : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-900'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 font-bold text-xs">
                                  <TrackIconRenderer trackId={track.id} className={`w-4 h-4 ${isSelected ? 'text-emerald-300' : 'text-zinc-400'}`} />
                                  <span className={isSelected ? 'text-emerald-200' : 'text-zinc-200'}>{track.name}</span>
                                </div>
                                {isSelected && (
                                  <span className="text-[9px] font-mono font-black text-emerald-300 bg-emerald-900/80 px-1.5 py-0.5 rounded border border-emerald-400/40">
                                    SELECIONADA
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-zinc-400 line-clamp-1">{track.description}</p>
                              <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                                <span>Público: <strong className="text-zinc-300">{track.targetAudience}</strong></span>
                                <span>{track.discipline}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGenerateCode(1)}
                        disabled={isLoading || !targetTurmaForCode}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-zinc-700/50 text-white font-bold rounded-xl transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-emerald-500/30 shadow-md"
                      >
                        <Key className="w-4 h-4" />
                        <span>Gerar para {targetTurmaForCode || '...'} (1 Hora)</span>
                      </button>
                      <button
                        onClick={() => handleGenerateCode(2)}
                        disabled={isLoading || !targetTurmaForCode}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-zinc-700/50 text-white font-bold rounded-xl transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-emerald-500/30 shadow-md"
                      >
                        <Key className="w-4 h-4" />
                        <span>Gerar para {targetTurmaForCode || '...'} (2 Horas)</span>
                      </button>
                    </div>

                    {/* Parâmetros de Acessibilidade Pedagógica */}
                    <div className="mt-8 pt-6 border-t border-zinc-800 space-y-4">
                      <div className="flex items-center gap-2 text-zinc-300 font-bold">
                        <Sliders className="w-5 h-5 text-emerald-400" />
                        <h3>Parâmetros de Acessibilidade Pedagógica</h3>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Ajuste dinamicamente o ritmo de aula para alunos neurodivergentes ou turmas com ritmo de digitação inicial.
                      </p>

                      {/* Tempo de Inatividade da Bateria de Foco */}
                      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                            <Battery className="w-4 h-4 text-emerald-400" />
                            <span>Duração da Bateria de Foco (Cadência)</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                            {settings?.focusTimeoutSetting === 0 ? 'Desativada (Inclusivo)' : `${settings?.focusTimeoutSetting || 5} segundos`}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">
                          Tempo que o aluno tem para continuar digitando antes que a bateria comece a esgotar o combo.
                        </p>
                        <div className="grid grid-cols-4 gap-2 pt-2">
                          {[
                            { label: '5s (Padrão)', val: 5 },
                            { label: '10s (Suave)', val: 10 },
                            { label: '15s (Amplo)', val: 15 },
                            { label: 'Sem Limite', val: 0 }
                          ].map((opt) => (
                            <button
                              key={opt.val}
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleUpdateAccessibility({ focusTimeoutSetting: opt.val })}
                              className={`py-1.5 px-2 text-xs font-mono font-bold rounded-lg border transition ${(settings?.focusTimeoutSetting ?? 5) === opt.val
                                ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white hover:bg-zinc-700'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Modo Alertas Reduzidos */}
                      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
                            <EyeOff className="w-4 h-4 text-amber-400" />
                            <span>Modo Alertas Reduzidos (Sem Flashes)</span>
                          </div>
                          <p className="text-xs text-zinc-400">
                            Desativa efeitos de luz piscantes e estroboscópicos nas animações dos vírus para alunos fotossensíveis.
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleUpdateAccessibility({ reducedAlerts: !settings?.reducedAlerts })}
                          className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${settings?.reducedAlerts
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'
                          }`}
                        >
                          {settings?.reducedAlerts ? 'ATIVADO' : 'DESATIVADO'}
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Controlo do Hub de Jogos */}
                  <section className="bg-zinc-900/60 border border-zinc-700/60 rounded-xl p-4 space-y-3 max-w-xl mx-auto">
                    <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm mb-1">
                      <Gamepad2 className="w-4 h-4 text-emerald-400" />
                      <span>Controlo do Hub de Jogos</span>
                      <span className="text-[10px] font-mono text-zinc-500 ml-auto">0 leituras Firestore</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Ative ou desative jogos para os alunos da turma. Professores sempre vêem todos os jogos.
                    </p>
                    {hubFeedback && (
                      <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 rounded-lg px-3 py-1.5">
                        {hubFeedback}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { id: 'typeclicker', label: 'TypeClicker', icon: Keyboard },
                        { id: 'type_radar', label: 'Type: Radar', icon: Radio },
                        { id: 'time_attack', label: 'Time Attack', icon: Timer },
                        { id: 'dungeon', label: 'Masmorra RPG', icon: Swords }
                      ] as const).map(({ id, label, icon: IconComponent }) => {
                        const disabled = Array.isArray(hubConfig.disabledGames) && hubConfig.disabledGames.includes(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            disabled={isUpdatingHub}
                            onClick={() => handleToggleGame(id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition ${
                              disabled
                                ? 'bg-red-950/40 border-red-700/50 text-red-300 line-through opacity-70'
                                : 'bg-emerald-950/40 border-emerald-700/50 text-emerald-200 hover:bg-emerald-900/50'
                            }`}
                            title={disabled ? `Reativar ${label} para alunos` : `Desativar ${label} para alunos`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                            <span>{label}</span>
                            <span className="ml-auto flex items-center">
                              {disabled ? (
                                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </>
              )}

              {/* ABA 2: DASHBOARD & DESEMPENHO DOS ALUNOS */}
              {activeTab === 'dashboard' && (
                <section className="space-y-4">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex items-center gap-2 text-zinc-300 font-bold">
                        <Users className="w-5 h-5 text-emerald-400" />
                        <h3>Desempenho dos Alunos</h3>
                      </div>
                      {lastRefreshedAt && (
                        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          Atualizado às {lastRefreshedAt.toLocaleTimeString('pt-BR')}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                      {/* Seletor de Turma */}
                      <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5">
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
                        </select>
                      </div>

                      {/* Busca por Nome/Apelido */}
                      <div className="relative flex-1 sm:w-48">
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Buscar aluno..."
                          value={searchTurma}
                          onChange={(e) => setSearchTurma(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Atualizar */}
                      <button
                        onClick={() => loadStudents(selectedClassFilter)}
                        disabled={isStudentsLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/40 rounded-lg text-emerald-200 text-xs font-bold transition disabled:opacity-50 shadow-sm cursor-pointer"
                        title="Atualizar Dados da Turma"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-emerald-300 ${isStudentsLoading ? 'animate-spin' : ''}`} />
                        <span>{isStudentsLoading ? 'Atualizando...' : 'Atualizar'}</span>
                      </button>

                      {/* Exportar Boletim CSV */}
                      <button
                        onClick={handleExportCSV}
                        disabled={isStudentsLoading || students.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/40 rounded-lg text-emerald-200 text-xs font-bold transition disabled:opacity-50 shadow-sm cursor-pointer"
                        title="Exportar Boletim Escolar em planilha CSV"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Boletim CSV</span>
                      </button>

                      {/* Exportação Pedagógica Multi-Jogo */}
                      <button
                        onClick={() => handleExportPedagogicalCSV('pedagogical')}
                        disabled={isStudentsLoading || students.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-950/60 hover:bg-sky-900/80 border border-sky-600/40 rounded-lg text-sky-200 text-xs font-bold transition disabled:opacity-50 shadow-sm cursor-pointer"
                        title="Exportar dados pedagógicos consolidados de todos os jogos"
                      >
                        <Download className="w-3.5 h-3.5 text-sky-300" />
                        <span>CSV Pedagógico Multi-Jogo</span>
                      </button>

                      <button
                        onClick={() => handleExportPedagogicalCSV('turmas')}
                        disabled={isStudentsLoading || students.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-600/40 rounded-lg text-indigo-200 text-xs font-bold transition disabled:opacity-50 shadow-sm cursor-pointer"
                        title="Exportar resumo agregado por turma"
                      >
                        <BarChart className="w-3.5 h-3.5 text-indigo-300" />
                        <span>Resumo por Turma</span>
                      </button>

                      {/* Equilibrar Classes RPG */}
                      {selectedClassFilter && selectedClassFilter !== 'todas' && (
                        <button
                          onClick={handleAutoBalanceRpg}
                          disabled={isAutoBalancing || isStudentsLoading || students.length === 0}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/40 rounded-lg text-amber-200 text-xs font-bold transition disabled:opacity-50 shadow-sm cursor-pointer"
                          title="Distribuir 1/3 Guerreiro, 1/3 Arqueiro e 1/3 Mago para esta turma"
                        >
                          <Swords className={`w-3.5 h-3.5 text-amber-300 ${isAutoBalancing ? 'animate-spin' : ''}`} />
                          <span>{isAutoBalancing ? 'Equilibrando...' : `Equilibrar RPG (${selectedClassFilter})`}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
                    <table className="w-full text-left text-sm text-zinc-400">
                      <thead className="bg-zinc-900 text-zinc-300 uppercase font-bold text-xs">
                        <tr>
                          <th className="px-4 py-3 border-b border-zinc-800 rounded-tl-xl">Aluno</th>
                          <th className="px-3 py-3 border-b border-zinc-800">Turma</th>
                          <th className="px-3 py-3 border-b border-zinc-800">Classe RPG</th>
                          <th className="px-4 py-3 border-b border-zinc-800 text-right">Nível</th>
                          <th className="px-4 py-3 border-b border-zinc-800 text-right">Bytes</th>
                          <th className="px-4 py-3 border-b border-zinc-800 text-right">PPM</th>
                          <th className="px-4 py-3 border-b border-zinc-800 text-right">Precisão</th>
                          <th className="px-4 py-3 border-b border-zinc-800 text-center rounded-tr-xl">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isStudentsLoading ? (
                          <tr>
                            <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                              <div className="flex items-center justify-center gap-2">
                                <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                                Carregando dados da turma...
                              </div>
                            </td>
                          </tr>
                        ) : filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                              Nenhum aluno encontrado para este filtro.
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((s, idx) => (
                            <tr
                              key={s.userId}
                              className={`hover:bg-zinc-800/50 transition-colors ${
                                idx !== filteredStudents.length - 1 ? 'border-b border-zinc-800/50' : ''
                              }`}
                            >
                              <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                                <span className="text-xl leading-none">{s.nome.split(' ')[0] || 'Aluno'}</span>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-1.5">
                                    <span>{s.apelido || s.nome}</span>
                                    {s.flaggedForReview && (
                                      <span
                                        title={s.flagReason || 'Valores anormais detectados.'}
                                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 cursor-help"
                                      >
                                        <AlertTriangle className="w-3 h-3" />
                                        Revisar
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-zinc-600 font-mono">{s.userId.slice(0, 8)}</span>
                                </div>
                              </td>

                              {/* Turma editável */}
                              <td className="px-3 py-2.5 font-mono">
                                <select
                                  value={s.turma || ''}
                                  disabled={updatingStudentId === s.userId}
                                  onChange={(e) => handleUpdateStudentProfile(s.userId, { turma: e.target.value })}
                                  className="bg-zinc-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer disabled:opacity-50"
                                  title="Alterar Turma do Aluno"
                                >
                                  <option value="">Sem Turma</option>
                                  {SCHOOL_CLASSES_CONFIG.map((group) => (
                                    <optgroup key={group.grade} label={group.grade}>
                                      {group.classes.map((cls) => (
                                        <option key={cls} value={cls}>
                                          {cls}
                                        </option>
                                      ))}
                                    </optgroup>
                                  ))}
                                </select>
                              </td>

                              {/* Classe RPG editável */}
                              <td className="px-3 py-2.5 font-mono">
                                <select
                                  value={s.rpgClass || ''}
                                  disabled={updatingStudentId === s.userId}
                                  onChange={(e) =>
                                    handleUpdateStudentProfile(s.userId, {
                                      rpgClass: (e.target.value as RpgClassType) || undefined
                                    })
                                  }
                                  className="bg-zinc-950/90 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer disabled:opacity-50"
                                  title="Alterar Classe RPG do Aluno"
                                >
                                  <option value="">Sem Classe</option>
                                  <option value="warrior">Guerreiro</option>
                                  <option value="archer">Arqueiro</option>
                                  <option value="mage">Mago</option>
                                </select>
                              </td>

                              <td className="px-4 py-3 text-right font-bold text-emerald-400">{s.level}</td>
                              <td className="px-4 py-3 text-right font-mono text-zinc-300">{formatBytes(s.points)}</td>
                              <td className={`px-4 py-3 text-right font-mono font-bold ${s.wpm > 200 ? 'text-amber-400' : ''}`}>
                                {s.wpm}
                              </td>
                              <td className="px-4 py-3 text-right font-mono">{s.accuracy}%</td>
                              <td className="px-4 py-3 text-center">
                                {s.flaggedForReview ? (
                                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                                    Suspeito
                                  </span>
                                ) : (
                                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Normal
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* ABA 3: CORRIDA DA TURMA */}
              {activeTab === 'corrida' && (
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
                        <Flag className="w-5 h-5" />
                        <h3>Corrida da Turma em Tempo Real</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Sincronizado
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Dispare uma prova de digitação com texto fixo para todos os alunos na sessão. O terminal de todos será interrompido com contagem regressiva e o primeiro a concluir 100% vence!
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {activeRace && activeRace.status !== 'cancelled' && onOpenRaceArena && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenRaceArena();
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                          title="Fechar Painel e Visualizar Corrida como Aluno no Terminal"
                        >
                          <Flag className="w-4 h-4" />
                          <span>Ver Corrida como Aluno</span>
                        </button>
                      )}

                      {activeRace && activeRace.status !== 'cancelled' && (
                        <button
                          type="button"
                          onClick={handleCancelRace}
                          disabled={isCancellingRace}
                          className="px-3.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                        >
                          <X className="w-4 h-4" />
                          <span>{isCancellingRace ? 'Cancelando...' : 'Encerrar Corrida'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {raceActionFeedback && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 font-mono text-xs font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{raceActionFeedback}</span>
                    </div>
                  )}

                  {/* Monitor da Corrida Ativa */}
                  {activeRace && activeRace.status !== 'cancelled' && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#181308] to-black border-2 border-amber-500/60 shadow-xl space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Flag className="w-5 h-5 text-amber-400" />
                          <h4 className="text-base font-bold text-white">{activeRace.title}</h4>
                          <span className="text-xs text-zinc-400 font-mono">({activeRace.source})</span>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase font-mono ${
                            activeRace.status === 'countdown'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                              : activeRace.status === 'in_progress'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {activeRace.status === 'countdown' ? (
                            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Em Contagem Regressiva...</span>
                          ) : activeRace.status === 'in_progress' ? (
                            <span className="inline-flex items-center gap-1.5"><Flag className="w-3.5 h-3.5" /> Corrida em Andamento!</span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> Corrida Concluída!</span>
                          )}
                        </span>
                      </div>

                      {/* Card do Vencedor */}
                      {activeRace.winner && (
                        <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/30 border border-amber-400 flex items-center justify-center shadow-md">
                              <Trophy className="w-6 h-6 text-amber-300" />
                            </div>
                            <div>
                              <span className="text-xs font-black uppercase text-amber-400 tracking-wider font-mono block">
                                VENCEDOR DA CORRIDA
                              </span>
                              <span className="text-base font-black text-white">
                                {activeRace.winner.apelido} ({activeRace.winner.nome})
                              </span>
                              <span className="text-xs text-zinc-300 block font-mono">
                                Turma: {activeRace.winner.turma} • {activeRace.winner.wpm} PPM • {(activeRace.winner.timeMs / 1000).toFixed(1)}s
                              </span>
                            </div>
                          </div>

                          <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-mono font-bold">
                            Prêmio: +{formatBytes(activeRace.prizeBytes)} Bytes
                          </div>
                        </div>
                      )}

                      {/* Pódio de Chegada */}
                      {activeRace.finishers && activeRace.finishers.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                            Pódio de Chegada ({activeRace.finishers.length} aluno{activeRace.finishers.length > 1 ? 's' : ''}):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {activeRace.finishers.map((f, idx) => (
                              <div
                                key={f.userId}
                                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
                                  idx === 0
                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                                    : idx === 1
                                    ? 'bg-zinc-800/60 border-zinc-600 text-zinc-200'
                                    : idx === 2
                                    ? 'bg-amber-950/30 border-amber-700/50 text-amber-300'
                                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm flex items-center">
                                    {idx === 0 ? <Medal className="w-4 h-4 text-amber-400" /> : idx === 1 ? <Medal className="w-4 h-4 text-slate-300" /> : idx === 2 ? <Medal className="w-4 h-4 text-amber-600" /> : `${idx + 1}º`}
                                  </span>
                                  <div>
                                    <span className="font-bold text-white block">{f.apelido}</span>
                                    <span className="text-[10px] text-zinc-400">{f.turma}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-cyan-300 block">{f.wpm} PPM</span>
                                  <span className="text-[10px] text-zinc-400">{(f.timeMs / 1000).toFixed(1)}s</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Lançamento de Nova Corrida */}
                  <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Configurar e Lançar Nova Corrida</span>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">
                        Texto fixo idêntico para todos os participantes
                      </span>
                    </div>

                    {/* Catálogo de Textos Pré-Definidos */}
                    <div className="space-y-3">
                      {settings?.customTexts && settings.customTexts.length > 0 && (
                        <div className="space-y-2 p-3 rounded-xl bg-indigo-950/25 border border-indigo-500/30">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                              Textos Curriculares do Professor ({settings.customTexts.length})
                            </span>
                            <button
                              type="button"
                              onClick={() => setActiveTab('textos')}
                              className="text-[11px] text-indigo-400 hover:text-indigo-200 underline cursor-pointer font-mono"
                            >
                              + Adicionar / Gerenciar
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {settings.customTexts.map((txt) => (
                              <button
                                key={txt.id}
                                type="button"
                                onClick={() => handleUseCustomTextInRace(txt)}
                                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                                  selectedPresetId === txt.id
                                    ? 'bg-indigo-500/25 border-indigo-500/80 shadow-md shadow-indigo-500/20'
                                    : 'bg-zinc-900/70 border-zinc-700/60 hover:bg-zinc-800 text-zinc-300'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-1 mb-1">
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                      {txt.discipline}
                                    </span>
                                    {txt.targetTurma && txt.targetTurma !== 'todas' && (
                                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300">
                                        {txt.targetTurma}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs font-bold text-white line-clamp-1">{txt.title}</span>
                                </div>
                                <span className="text-[10px] text-indigo-400 font-mono mt-1.5 font-semibold">
                                  {txt.content.length} caracteres
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <label className="text-xs font-bold text-zinc-300 block uppercase tracking-wider font-mono">
                        1. Escolha um Texto Literário/Pedagógico ou Crie o Seu:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {PRESET_RACE_TEXTS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                              selectedPresetId === preset.id
                                ? 'bg-amber-500/15 border-amber-500/60 shadow-sm'
                                : 'bg-zinc-800/40 border-zinc-800 hover:bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            <div>
                              <span className="text-xs font-bold text-white line-clamp-1">{preset.title}</span>
                              <span className="text-[10px] text-zinc-400 line-clamp-1">{preset.source}</span>
                            </div>
                            <span className="text-[10px] text-amber-400 font-mono mt-2 font-semibold">
                              {preset.text.length} caracteres
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Campos de Título e Fonte */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-zinc-400 font-mono block mb-1">Título da Prova:</label>
                        <input
                          type="text"
                          value={customRaceTitle}
                          onChange={(e) => setCustomRaceTitle(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 font-mono block mb-1">Fonte / Referência:</label>
                        <input
                          type="text"
                          value={customRaceSource}
                          onChange={(e) => setCustomRaceSource(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Texto da Corrida */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
                        <label>Conteúdo do Texto a ser digitado pelos alunos:</label>
                        <span>
                          {customRaceText.trim().split(/\s+/).filter(Boolean).length} palavras • {customRaceText.length} caracteres
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={customRaceText}
                        onChange={(e) => {
                          setCustomRaceText(e.target.value);
                          setSelectedPresetId('');
                        }}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-sm text-white font-mono leading-relaxed focus:outline-none focus:border-amber-400 custom-scrollbar"
                        placeholder="Digite ou cole aqui o texto que todos os alunos deverão digitar..."
                      />
                    </div>

                    {/* Opções de Turma, Contagem e Prêmio */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800">
                      <div>
                        <label className="text-xs text-zinc-400 font-mono block mb-1">Turma Participante:</label>
                        <select
                          value={raceTargetTurma}
                          onChange={(e) => setRaceTargetTurma(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          <option value="todas">Geral (Todas as Turmas Ativas)</option>
                          {SCHOOL_CLASSES_CONFIG.map((group) => (
                            <optgroup key={group.grade} label={group.grade} className="bg-zinc-900 text-zinc-400">
                              {group.classes.map((cls) => (
                                <option key={cls} value={cls} className="bg-zinc-900 text-white font-medium">
                                  Turma {cls}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 font-mono block mb-1">Contagem Regressiva:</label>
                        <div className="flex gap-2">
                          {[3, 5, 10].map((sec) => (
                            <button
                              key={sec}
                              type="button"
                              onClick={() => setRaceCountdownSec(sec)}
                              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                                raceCountdownSec === sec
                                  ? 'bg-amber-500 text-black border-amber-400'
                                  : 'bg-zinc-950 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                              }`}
                            >
                              {sec}s
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 font-mono block mb-1">Bônus para o Vencedor:</label>
                        <div className="flex gap-1.5">
                          {[10000, 25000, 50000, 100000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setRacePrizeBytes(amt)}
                              className={`flex-1 py-2 rounded-xl text-[11px] font-mono font-bold border transition cursor-pointer ${
                                racePrizeBytes === amt
                                  ? 'bg-emerald-500 text-black border-emerald-400'
                                  : 'bg-zinc-950 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                              }`}
                            >
                              {amt >= 1000 ? `${amt / 1000}k` : amt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={handleLaunchRace}
                        disabled={isLaunchingRace || !customRaceText.trim()}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-black font-black text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Rocket className="w-5 h-5 text-black" />
                        <span>{isLaunchingRace ? 'Lançando Corrida...' : 'LANÇAR CORRIDA PARA OS ALUNOS AGORA'}</span>
                      </button>
                      <p className="text-[11px] text-zinc-500 font-mono text-center mt-2">
                        * Ao clicar, todos os alunos conectados receberão o aviso de largada imediatamente em tela cheia.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* ABA 4: RAID COLETIVA CONTRA CHEFE */}
              {activeTab === 'raid' && (
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
                        <Swords className="w-5 h-5" />
                        <h3>Raid Coletiva contra Chefe em Tempo Real</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          Multiplayer Co-op
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Dispare um evento cooperativo para toda a turma! Um chefe titânico surge na tela dos alunos com HP compartilhado e contagem regressiva. Os alunos digitam juntos acumulando dano e usando as sinergias das classes RPG para derrotá-lo!
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {activeRaid && activeRaid.status === 'in_progress' && onOpenRaidArena && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenRaidArena();
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                          title="Fechar Painel e Entrar na Batalha com os Alunos"
                        >
                          <Swords className="w-4 h-4" />
                          <span>Entrar na Batalha</span>
                        </button>
                      )}

                      {activeRaid && activeRaid.status === 'in_progress' && (
                        <button
                          type="button"
                          onClick={handleCancelRaid}
                          disabled={isCancellingRaid}
                          className="px-3.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                        >
                          <X className="w-4 h-4" />
                          <span>{isCancellingRaid ? 'Cancelando...' : 'Encerrar Raid'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {raidActionFeedback && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 font-mono text-xs font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-400" />
                      <span>{raidActionFeedback}</span>
                    </div>
                  )}

                  {/* Monitor da Raid Ativa */}
                  {activeRaid && activeRaid.status === 'in_progress' && (
                    <div className="p-4 rounded-2xl bg-zinc-950 border-2 border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)] relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl p-2 bg-zinc-900 rounded-xl border border-rose-500/30 animate-pulse">
                            {activeRaid.bossIcon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                                EM ANDAMENTO
                              </span>
                              <span className="text-xs text-zinc-400 font-mono">
                                Turma: <strong className="text-zinc-200 uppercase">{activeRaid.targetTurma}</strong>
                              </span>
                            </div>
                            <h4 className="text-lg font-black text-white font-mono">{activeRaid.bossName}</h4>
                            <p className="text-xs text-zinc-400 font-mono">{activeRaid.bossSubtitle}</p>
                          </div>
                        </div>

                        <div className="text-right font-mono text-xs text-zinc-400">
                          <div>Alunos Ativos: <strong className="text-indigo-400 text-sm">{Object.keys(activeRaid.participants || {}).length}</strong></div>
                          <div>Dano Total: <strong className="text-rose-400 text-sm">{(activeRaid.totalDamageDealt || 0).toLocaleString()} HP</strong></div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-xs font-mono mb-1">
                          <span className="text-rose-400 font-bold">VIDA RESTANTE DO CHEFE:</span>
                          <span className="text-zinc-200">
                            <strong>{activeRaid.currentHp.toLocaleString()}</strong> / {activeRaid.maxHp.toLocaleString()} HP (
                            {Math.max(0, Math.round((activeRaid.currentHp / activeRaid.maxHp) * 100))}%)
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800 p-0.5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-300"
                            style={{
                              width: `${Math.max(0, Math.min(100, Math.round((activeRaid.currentHp / activeRaid.maxHp) * 100)))}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lançamento de Nova Raid */}
                  <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-5">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-200 font-mono flex items-center gap-2">
                        <Flame className="w-4 h-4 text-rose-400" />
                        1. Selecione o Chefe de Raid da Batalha:
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">
                        Cada chefe possui temática própria, atributos de HP calibrados e exigências de cooperação:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {PRESET_RAID_BOSSES.map((boss) => {
                        const isSelected = selectedRaidBossId === boss.id;
                        return (
                          <div
                            key={boss.id}
                            onClick={() => handleSelectRaidBoss(boss)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-rose-950/40 border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
                                : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-2xl">{boss.icon}</span>
                                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] font-mono text-zinc-300">
                                  {boss.maxHp.toLocaleString()} HP
                                </span>
                              </div>
                              <h5 className="font-bold text-white text-sm font-mono">{boss.name}</h5>
                              <p className="text-[11px] text-zinc-400 font-mono mt-0.5 line-clamp-1">{boss.subtitle}</p>
                              <p className="text-xs text-zinc-500 font-mono mt-2 line-clamp-2">{boss.description}</p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                              <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3 text-zinc-400" /> {Math.floor(boss.timeLimitSeconds / 60)} min</span>
                              <span className="text-amber-400 font-bold">+{formatBytes(boss.prizeBytes)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-800">
                      <div>
                        <label className="text-xs text-zinc-400 font-mono block mb-1">Turma Participante:</label>
                        <select
                          value={raidTargetTurma}
                          onChange={(e) => setRaidTargetTurma(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-400 cursor-pointer"
                        >
                          <option value="todas">Geral (Todas as Turmas Ativas)</option>
                          {SCHOOL_CLASSES_CONFIG.map((group) => (
                            <optgroup key={group.grade} label={group.grade} className="bg-zinc-900 text-zinc-400">
                              {group.classes.map((cls) => (
                                <option key={cls} value={cls} className="bg-zinc-900 text-white font-medium">
                                  Turma {cls}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 font-mono block mb-1">Tempo Limite da Batalha:</label>
                        <div className="flex gap-2">
                          {[120, 180, 240, 300].map((sec) => (
                            <button
                              key={sec}
                              type="button"
                              onClick={() => setRaidTimeLimitSec(sec)}
                              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                                raidTimeLimitSec === sec
                                  ? 'bg-rose-500 text-white border-rose-400 shadow-md'
                                  : 'bg-zinc-950 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                              }`}
                            >
                              {sec / 60}m
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 font-mono block mb-1">Prêmio de Vitória por Aluno:</label>
                        <div className="flex gap-2">
                          {[25000, 50000, 100000, 250000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setRaidPrizeBytes(amt)}
                              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                                raidPrizeBytes === amt
                                  ? 'bg-amber-500 text-black border-amber-400 font-black shadow-md'
                                  : 'bg-zinc-950 text-zinc-400 border-zinc-700 hover:border-zinc-500'
                              }`}
                            >
                              {amt >= 1000 ? `${amt / 1000}k` : amt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={handleLaunchRaid}
                        disabled={isLaunchingRaid}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:from-rose-500 hover:to-red-400 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Rocket className="w-5 h-5 text-white" />
                        <span>{isLaunchingRaid ? 'Iniciando Batalha...' : 'LANÇAR RAID COLETIVA PARA A SALA AGORA'}</span>
                      </button>
                      <p className="text-[11px] text-zinc-500 font-mono text-center mt-2">
                        * Ao clicar, todos os alunos conectados receberão o alerta de batalha com o Chefe Coletivo em tempo real.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* ABA 5: TEXTOS CURRICULARES */}
              {activeTab === 'textos' && (
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
                        <BookOpen className="w-5 h-5" />
                        <h3>Biblioteca de Textos Curriculares do Professor</h3>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Cadastre e organize conteúdos de História, Ciências, Geografia, Português e outras matérias para usar em treinos e corridas da turma.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-3 py-1 bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 rounded-lg">
                        {settings?.customTexts?.length || 0} textos ativos
                      </span>
                    </div>
                  </div>

                  {textFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 ${
                        textFeedback.includes('Erro')
                          ? 'bg-red-950/50 border-red-500/40 text-red-300'
                          : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                      }`}
                    >
                      {textFeedback.includes('Erro') ? (
                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                      <span>{textFeedback}</span>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Formulário de Cadastro */}
                    <div className="lg:col-span-5 p-5 rounded-2xl bg-zinc-900/60 border border-indigo-500/30 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                        <Plus className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-sm font-bold text-white">Cadastrar Novo Texto Curricular</h4>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-zinc-300 font-medium block mb-1">Título do Conteúdo:</label>
                          <input
                            type="text"
                            placeholder="Ex: A Chegada do Homem à Lua"
                            value={newTextTitle}
                            onChange={(e) => setNewTextTitle(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-zinc-300 font-medium block mb-1">Disciplina / Matéria:</label>
                            <select
                              value={newTextDiscipline}
                              onChange={(e) => setNewTextDiscipline(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-400 cursor-pointer"
                            >
                              <option value="Português">Português</option>
                              <option value="História">História</option>
                              <option value="Geografia">Geografia</option>
                              <option value="Ciências">Ciências</option>
                              <option value="Matemática">Matemática</option>
                              <option value="Inglês">Inglês</option>
                              <option value="Filosofia">Filosofia</option>
                              <option value="Robótica">Robótica / TI</option>
                              <option value="Geral">Geral / Literatura</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-xs text-zinc-300 font-medium block mb-1">Turma Alvo:</label>
                            <select
                              value={newTextTurma}
                              onChange={(e) => setNewTextTurma(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-400 cursor-pointer"
                            >
                              <option value="todas">Todas as Turmas</option>
                              {SCHOOL_CLASSES_CONFIG.map((group) => (
                                <optgroup key={group.grade} label={group.grade} className="bg-zinc-900 text-zinc-400">
                                  {group.classes.map((cls) => (
                                    <option key={cls} value={cls} className="bg-zinc-900 text-white">
                                      {cls}
                                    </option>
                                  ))}
                                </optgroup>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
                            <label className="text-zinc-300 font-medium font-sans">Texto a Ser Digitado:</label>
                            <span>
                              {newTextContent.trim().split(/\s+/).filter(Boolean).length} palavras • {newTextContent.length} carac.
                            </span>
                          </div>
                          <textarea
                            rows={6}
                            placeholder="Insira o parágrafo ou texto que os alunos irão ler e digitar durante a atividade..."
                            value={newTextContent}
                            onChange={(e) => setNewTextContent(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-sm text-white font-mono leading-relaxed placeholder-zinc-500 focus:outline-none focus:border-indigo-400 custom-scrollbar"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleSaveCustomText}
                          disabled={isSavingText || !newTextTitle.trim() || !newTextContent.trim()}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4 text-white" />
                          <span>{isSavingText ? 'Salvando...' : 'Salvar Texto na Biblioteca'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Acervo de Textos */}
                    <div className="lg:col-span-7 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-400" />
                          Textos Salvos no Sistema
                        </h4>

                        <div className="flex items-center gap-2">
                          <Filter className="w-3.5 h-3.5 text-zinc-400" />
                          <select
                            value={textFilterDiscipline}
                            onChange={(e) => setTextFilterDiscipline(e.target.value)}
                            className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-300 focus:outline-none cursor-pointer"
                          >
                            <option value="todas">Todas as Matérias</option>
                            <option value="Português">Português</option>
                            <option value="História">História</option>
                            <option value="Geografia">Geografia</option>
                            <option value="Ciências">Ciências</option>
                            <option value="Matemática">Matemática</option>
                            <option value="Inglês">Inglês</option>
                            <option value="Filosofia">Filosofia</option>
                            <option value="Robótica">Robótica / TI</option>
                            <option value="Geral">Geral / Literatura</option>
                          </select>
                        </div>
                      </div>

                      {!settings?.customTexts || settings.customTexts.length === 0 ? (
                        <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 text-center space-y-2">
                          <BookOpen className="w-8 h-8 text-zinc-600 mx-auto" />
                          <p className="text-sm font-bold text-zinc-400">Nenhum texto cadastrado ainda.</p>
                          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                            Cadastre seu primeiro texto escolar no formulário ao lado para enriquecer a digitação pedagógica dos alunos.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                          {settings.customTexts
                            .filter((t) => textFilterDiscipline === 'todas' || t.discipline === textFilterDiscipline)
                            .map((t) => (
                              <div
                                key={t.id}
                                className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                      {t.discipline}
                                    </span>
                                    {t.targetTurma && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                        Turma: {t.targetTurma}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-zinc-500 font-mono">
                                      {new Date(t.createdAt).toLocaleDateString('pt-BR')} • por {t.authorName || 'Professor'}
                                    </span>
                                  </div>
                                  <h5 className="text-sm font-bold text-white truncate">{t.title}</h5>
                                  <p className="text-xs text-zinc-400 line-clamp-2 font-mono bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/80">
                                    {t.content}
                                  </p>
                                  <span className="text-[10px] text-zinc-500 font-mono block">
                                    {t.content.trim().split(/\s+/).filter(Boolean).length} palavras • {t.content.length} caracteres
                                  </span>
                                </div>

                                <div className="flex sm:flex-col items-center sm:items-end justify-end gap-1.5 flex-shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleUseCustomTextInRace(t)}
                                    className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                                    title="Carregar este texto imediatamente na Corrida da Turma"
                                  >
                                    <Flag className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Usar em Corrida</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setSelectedPreviewText(t)}
                                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Ler</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCustomText(t.id)}
                                    className="px-2 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-900/40 text-xs font-medium transition flex items-center gap-1 cursor-pointer"
                                    title="Remover texto"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modal de Leitura Completa de Texto */}
                  {selectedPreviewText && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                      onClick={() => setSelectedPreviewText(null)}
                    >
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg bg-zinc-900 border border-indigo-500/50 rounded-2xl p-6 shadow-2xl space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                              {selectedPreviewText.discipline} • Turma {selectedPreviewText.targetTurma || 'todas'}
                            </span>
                            <h3 className="text-lg font-bold text-white">{selectedPreviewText.title}</h3>
                          </div>
                          <button
                            onClick={() => setSelectedPreviewText(null)}
                            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm font-mono leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                          {selectedPreviewText.content}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-zinc-500 font-mono">
                            {selectedPreviewText.content.trim().split(/\s+/).filter(Boolean).length} palavras
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              handleUseCustomTextInRace(selectedPreviewText);
                              setSelectedPreviewText(null);
                            }}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
                          >
                            <Flag className="w-4 h-4 text-black" />
                            <span>Lançar Corrida com Este Texto</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
