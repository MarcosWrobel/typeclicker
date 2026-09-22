import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, Trash2, X, Clock, AlertTriangle, Users, Search, RefreshCw, BarChart, Database, Download, Upload, CheckCircle2, RotateCcw, FileText, Sliders, Battery, Eye, EyeOff, Filter, Swords, Sparkles, Coins, Zap, Trophy, Award, UserCheck, Plus, History, Gift, ArrowRight, Check, Terminal, Flag, Timer, BookOpen, Flame, GraduationCap, Sword, Activity } from 'lucide-react';
import { fetchFirestoreMetrics, FirestoreMetricsData } from '../services/adminMetricsService';
import {
  auth,
  generateSessionCode,
  clearSessionCode,
  adminUpdateStudentProfile,
  adminAutoBalanceRpgClasses,
  wipeDatabase,
  SystemSettings,
  getSystemSettings,
  getAdminDashboardData,
  LeaderboardEntry,
  updateAllowedTeachers,
  updateAccessibilitySettings,
  createDatabaseBackup,
  listDatabaseBackups,
  getDatabaseBackup,
  restoreDatabaseBackup,
  deleteDatabaseBackup,
  DatabaseBackupSummary,
  FullDatabaseBackup,
  migrateSchemasInFirestore,
  MigrationSummary,
  addTesterEmail,
  removeTesterEmail,
  applyTestResourcesToEmail,
  findUserSaveByEmail,
  TestGrantPayload,
  TestGrantConfig,
  sanitizeStaffFromLeaderboard,
  saveCustomCurricularText,
  deleteCustomCurricularText,
  saveProgressToCloud,
  updateActiveSessionTrack,
  ADMIN_EMAILS
} from '../services/firebaseService';
import { CurricularTrackId } from '../types';
import { CURRICULAR_TRACKS, getCurricularTrack, suggestTrackForTurma } from '../data/tracks';
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
import { formatBytes, calculatePlayerRank } from '../utils/formatting';
import { ALL_LEVELS, calculateMinBytesForLevel } from '../data/levels';
import { GameState, CustomCurricularText } from '../types';
import { DEFAULT_COSMETICS } from '../types/cosmetics';
import { getAllUnlockedCosmetics } from '../constants/cosmeticsCatalog';
import { saveState } from '../utils/storage';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isSuperAdmin?: boolean;
  gameState?: GameState;
  onUpdateGameState?: (updated: GameState) => void;
  userEmail?: string | null;
  onOpenArena?: () => void;
  onOpenCosmetics?: () => void;
  onTriggerChallenge?: (level: number) => void;
  onOpenRaceArena?: () => void;
  onOpenRaidArena?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  isSuperAdmin,
  gameState,
  onUpdateGameState,
  userEmail,
  onOpenArena,
  onOpenCosmetics,
  onTriggerChallenge,
  onOpenRaceArena,
  onOpenRaidArena
}) => {
  const [activeTab, setActiveTab] = useState<'locks' | 'dashboard' | 'corrida' | 'raid' | 'textos' | 'backups' | 'monitoramento' | 'wipe' | 'professores' | 'testes'>('locks');
  const [testActionMessage, setTestActionMessage] = useState<string | null>(null);

  // Estados para Monitoramento de Banco & Cotas do Firestore (Cloud Monitoring)
  const [metricsData, setMetricsData] = useState<FirestoreMetricsData | null>(null);
  const [isMetricsLoading, setIsMetricsLoading] = useState<boolean>(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [autoRefreshMetrics, setAutoRefreshMetrics] = useState<boolean>(false);

  // Estados para Textos Curriculares do Professor
  const [newTextTitle, setNewTextTitle] = useState<string>('');
  const [newTextDiscipline, setNewTextDiscipline] = useState<string>('Português');
  const [newTextTurma, setNewTextTurma] = useState<string>('todas');
  const [newTextContent, setNewTextContent] = useState<string>('');
  const [isSavingText, setIsSavingText] = useState<boolean>(false);
  const [textFeedback, setTextFeedback] = useState<string | null>(null);
  const [selectedPreviewText, setSelectedPreviewText] = useState<CustomCurricularText | null>(null);
  const [textFilterDiscipline, setTextFilterDiscipline] = useState<string>('todas');
  
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [wipeConfirm, setWipeConfirm] = useState('');
  const [wipeStatus, setWipeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Estados para Corrida em Tempo Real da Turma
  const [activeRace, setActiveRace] = useState<ClassroomRace | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_RACE_TEXTS[0].id);
  const [customRaceTitle, setCustomRaceTitle] = useState<string>(PRESET_RACE_TEXTS[0].title);
  const [customRaceText, setCustomRaceText] = useState<string>(PRESET_RACE_TEXTS[0].text);
  const [customRaceSource, setCustomRaceSource] = useState<string>(PRESET_RACE_TEXTS[0].source);
  const [raceTargetTurma, setRaceTargetTurma] = useState<string>('todas');
  const [raceCountdownSec, setRaceCountdownSec] = useState<number>(5);
  const [racePrizeBytes, setRacePrizeBytes] = useState<number>(25000);
  const [isLaunchingRace, setIsLaunchingRace] = useState<boolean>(false);
  const [isCancellingRace, setIsCancellingRace] = useState<boolean>(false);
  const [raceActionFeedback, setRaceActionFeedback] = useState<string | null>(null);

  // Estados para Raid Coletiva contra Chefe
  const [activeRaid, setActiveRaid] = useState<ClassroomRaid | null>(null);
  const [selectedRaidBossId, setSelectedRaidBossId] = useState<string>(PRESET_RAID_BOSSES[0].id);
  const [raidTargetTurma, setRaidTargetTurma] = useState<string>('todas');
  const [raidMaxHp, setRaidMaxHp] = useState<number>(PRESET_RAID_BOSSES[0].maxHp);
  const [raidTimeLimitSec, setRaidTimeLimitSec] = useState<number>(PRESET_RAID_BOSSES[0].timeLimitSeconds);
  const [raidPrizeBytes, setRaidPrizeBytes] = useState<number>(PRESET_RAID_BOSSES[0].prizeBytes);
  const [isLaunchingRaid, setIsLaunchingRaid] = useState<boolean>(false);
  const [isCancellingRaid, setIsCancellingRaid] = useState<boolean>(false);
  const [raidActionFeedback, setRaidActionFeedback] = useState<string | null>(null);

  const [students, setStudents] = useState<LeaderboardEntry[]>([]);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [searchTurma, setSearchTurma] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('todas');
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [targetTurmaForCode, setTargetTurmaForCode] = useState<string>('');
  const [selectedTrackForCode, setSelectedTrackForCode] = useState<CurricularTrackId>('geral');
  const [isChangingLiveTrack, setIsChangingLiveTrack] = useState<boolean>(false);
  const [updatingStudentId, setUpdatingStudentId] = useState<string | null>(null);
  const [isAutoBalancing, setIsAutoBalancing] = useState<boolean>(false);
  
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [isUpdatingTeachers, setIsUpdatingTeachers] = useState(false);
  const [isSanitizingLeaderboard, setIsSanitizingLeaderboard] = useState(false);
  const [sanitizeMessage, setSanitizeMessage] = useState<string | null>(null);

  // Backup & Restore states
  const [backups, setBackups] = useState<DatabaseBackupSummary[]>([]);
  const [isBackupsLoading, setIsBackupsLoading] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupActionMessage, setBackupActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [restoreConfirmId, setRestoreConfirmId] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationSummary | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para Indicação de E-mails e Recursos de Teste
  const [targetEmail, setTargetEmail] = useState<string>(userEmail || 'wrobel.marcos@gmail.com');
  const [newTesterEmailInput, setNewTesterEmailInput] = useState<string>('');
  const [isAddingTester, setIsAddingTester] = useState<boolean>(false);
  const [isRemovingTester, setIsRemovingTester] = useState<boolean>(false);

  // Parâmetros de Recursos de Teste
  const [levelGrantMode, setLevelGrantMode] = useState<'add_levels' | 'set_level'>('add_levels');
  const [levelAmount, setLevelAmount] = useState<number>(1); // padrão: subir +1 nível gradativamente
  const [levelTokensToAdd, setLevelTokensToAdd] = useState<number>(1000);
  const [duelTokensToAdd, setDuelTokensToAdd] = useState<number>(1000);
  const [unlockCosmeticsCheck, setUnlockCosmeticsCheck] = useState<boolean>(true);
  const [maxUpgradesCheck, setMaxUpgradesCheck] = useState<boolean>(false);
  const [resetToLevel1Check, setResetToLevel1Check] = useState<boolean>(false);
  const [grantNotes, setGrantNotes] = useState<string>('');

  const [isApplyingGrant, setIsApplyingGrant] = useState<boolean>(false);
  const [targetAccountInfo, setTargetAccountInfo] = useState<{
    exists: boolean;
    name?: string;
    turma?: string;
    currentLevel?: number;
    currentBytes?: number;
    levelTokens?: number;
    duelTokens?: number;
  } | null>(null);
  const [isLoadingAccountInfo, setIsLoadingAccountInfo] = useState<boolean>(false);
  const [showStudentPicker, setShowStudentPicker] = useState<boolean>(false);

  const loadSettings = async () => {
    setIsLoading(true);
    const data = await getSystemSettings();
    setSettings(data);
    setIsLoading(false);
  };

  const loadStudents = async (turmaToFetch = selectedClassFilter) => {
    setIsStudentsLoading(true);
    try {
      const targetTurma = turmaToFetch === 'todas' ? undefined : turmaToFetch;
      const data = await getAdminDashboardData(targetTurma);
      setStudents(data);
      setLastRefreshedAt(new Date());
    } catch (e) {
      console.error('Error loading students:', e);
    } finally {
      setIsStudentsLoading(false);
    }
  };

  // Fechamento pelo teclado com Escape (compatível com a dica visual do header "Fechar Painel (ESC)")
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

  // Escuta a corrida ativa da turma em tempo real
  useEffect(() => {
    const unsub = subscribeToActiveRace((race) => {
      setActiveRace(race);
    });
    return () => unsub();
  }, []);

  // Escuta a Raid ativa da turma em tempo real
  useEffect(() => {
    const unsub = subscribeToActiveRaid((raid) => {
      setActiveRaid(raid);
    });
    return () => unsub();
  }, []);

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
      setRaceActionFeedback('🚀 Corrida disparada com sucesso para a sessão escolar!');
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
      setRaidActionFeedback(`🔥 Raid contra "${boss.name}" iniciada com sucesso!`);
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

  // Exportação de Boletim Escolar (CSV) 100% In-Browser (0 Reads / Writes)
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

  // Gerenciamento de Textos Curriculares do Professor
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

  // Ações Rápidas de Teste para o Administrador (Marcos Wrobel)
  const handleUnlockAllCosmetics = () => {
    if (!gameState || !onUpdateGameState) return;
    const all = getAllUnlockedCosmetics(gameState.cosmetics);
    onUpdateGameState({
      ...gameState,
      cosmetics: all
    });
    sound.playPrestige();
    setTestActionMessage('Todos os 14 layouts, temas, skins, sons e animações foram desbloqueados com sucesso!');
    setTimeout(() => setTestActionMessage(null), 4000);
  };

  const handleAddMaxTokens = () => {
    if (!gameState || !onUpdateGameState) return;
    onUpdateGameState({
      ...gameState,
      cosmetics: {
        ...gameState.cosmetics,
        levelTokens: (gameState.cosmetics?.levelTokens ?? 0) + 10000,
        duelTokens: (gameState.cosmetics?.duelTokens ?? 0) + 10000,
      }
    });
    sound.playWordComplete();
    setTestActionMessage('+10.000 Level Tokens e +10.000 Moedas de Duelo adicionados ao seu saldo de teste!');
    setTimeout(() => setTestActionMessage(null), 4000);
  };

  const handleSetLevel100 = () => {
    if (!gameState || !onUpdateGameState) return;
    onUpdateGameState({
      ...gameState,
      level: 100,
      points: 35000,
      totalBytesEarned: Math.max(gameState.totalBytesEarned, 5000000)
    });
    sound.playPrestige();
    setTestActionMessage('Nível definido para 100 (Lenda Leopoldina)! Status supremo e acesso à Arena liberados.');
    setTimeout(() => setTestActionMessage(null), 4000);
  };

  const handleSetMaxArenaRank = () => {
    if (!gameState || !onUpdateGameState) return;
    onUpdateGameState({
      ...gameState,
      arenaStats: {
        matchesPlayed: Math.max(gameState.arenaStats?.matchesPlayed ?? 0, 60),
        wins: Math.max(gameState.arenaStats?.wins ?? 0, 55),
        losses: gameState.arenaStats?.losses ?? 5,
        highestWpm: Math.max(gameState.arenaStats?.highestWpm ?? 0, 125),
        duelPoints: 2600,
        currentRankId: 'immortal_legend'
      }
    });
    sound.playPrestige();
    setTestActionMessage('Patente da Arena definida para Lenda Imortal (2.600 Pontos de Duelo)!');
    setTimeout(() => setTestActionMessage(null), 4000);
  };

  const handleMaxAllUpgrades = () => {
    if (!gameState || !onUpdateGameState) return;
    const maxUpgrades: Record<string, number> = {};
    for (const key of Object.keys(gameState.upgrades || {})) {
      maxUpgrades[key] = 50;
    }
    onUpdateGameState({
      ...gameState,
      upgrades: maxUpgrades
    });
    sound.playUpgrade();
    setTestActionMessage('Todos os upgrades de hardware foram definidos para o nível 50!');
    setTimeout(() => setTestActionMessage(null), 4000);
  };

  const handleResetForTesting = () => {
    if (!gameState || !onUpdateGameState) return;
    if (!confirm('Deseja resetar seu perfil para Nível 1 para testar o fluxo de um aluno novo?')) return;
    onUpdateGameState({
      ...gameState,
      level: 1,
      points: 0,
      totalBytesEarned: 0,
      cosmetics: { ...DEFAULT_COSMETICS },
      arenaStats: {
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        highestWpm: 0,
        duelPoints: 0,
        currentRankId: 'recruta'
      }
    });
    sound.playGlitch();
    setTestActionMessage('Perfil resetado para Nível 1 com sucesso.');
    setTimeout(() => setTestActionMessage(null), 4000);
  };

  const checkTargetAccount = async (emailToCheck: string) => {
    const clean = emailToCheck.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      setTargetAccountInfo(null);
      return;
    }

    const isTeacherAccount = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === clean);

    // Se for o próprio admin logado
    if (userEmail && clean === userEmail.trim().toLowerCase() && gameState) {
      const rank = calculatePlayerRank(gameState.totalBytesEarned || 0);
      setTargetAccountInfo({
        exists: true,
        name: gameState.studentName || 'Prof. Marcos Wrobel (Admin)',
        turma: 'Professor',
        currentLevel: rank.level,
        currentBytes: gameState.totalBytesEarned || 0,
        levelTokens: gameState.cosmetics?.levelTokens || 0,
        duelTokens: gameState.cosmetics?.duelTokens || 0
      });
      return;
    }

    setIsLoadingAccountInfo(true);
    try {
      const save = await findUserSaveByEmail(clean);
      if (save) {
        const isStaffAccount = isTeacherAccount || save.data.isStaff;
        const effectiveTurma = isStaffAccount ? 'Professor' : (save.data.turma || 'Sem turma');
        const bytes = save.data.saveState?.totalBytesEarned || save.data.points || 0;
        const rank = calculatePlayerRank(bytes);
        setTargetAccountInfo({
          exists: true,
          name: save.data.nome || save.data.apelido || (isStaffAccount ? 'Prof. Marcos Wrobel' : clean.split('@')[0]),
          turma: effectiveTurma,
          currentLevel: rank.level,
          currentBytes: bytes,
          levelTokens: save.data.saveState?.cosmetics?.levelTokens || 0,
          duelTokens: save.data.saveState?.cosmetics?.duelTokens || 0
        });
      } else {
        setTargetAccountInfo({
          exists: false,
          name: isTeacherAccount ? 'Prof. Marcos Wrobel' : clean.split('@')[0],
          turma: isTeacherAccount ? 'Professor' : 'Conta nova (receberá ao logar)',
          currentLevel: 1,
          currentBytes: 0,
          levelTokens: 0,
          duelTokens: 0
        });
      }
    } catch (e) {
      console.error('Error checking target account:', e);
    } finally {
      setIsLoadingAccountInfo(false);
    }
  };

  const handleAddTester = async () => {
    const clean = newTesterEmailInput.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      alert('Informe um e-mail válido.');
      return;
    }
    setIsAddingTester(true);
    try {
      const updatedList = await addTesterEmail(clean);
      setSettings(prev => prev ? { ...prev, testerEmails: updatedList } : null);
      setTargetEmail(clean);
      setNewTesterEmailInput('');
      sound.playUpgrade();
      setTestActionMessage(`E-mail ${clean} indicado com sucesso para receber recursos de teste!`);
      setTimeout(() => setTestActionMessage(null), 4000);
    } catch (e: any) {
      alert(`Erro ao indicar e-mail: ${e.message}`);
    } finally {
      setIsAddingTester(false);
    }
  };

  const handleRemoveTester = async (emailToRemove: string) => {
    if (!confirm(`Remover ${emailToRemove} da lista de testadores indicados?`)) return;
    setIsRemovingTester(true);
    try {
      const updatedList = await removeTesterEmail(emailToRemove);
      setSettings(prev => prev ? { ...prev, testerEmails: updatedList } : null);
      if (targetEmail.toLowerCase() === emailToRemove.toLowerCase()) {
        setTargetEmail(userEmail || 'wrobel.marcos@gmail.com');
      }
      sound.playGlitch();
    } catch (e: any) {
      alert(`Erro ao remover: ${e.message}`);
    } finally {
      setIsRemovingTester(false);
    }
  };

  const handleApplyGrant = async () => {
    const cleanEmail = targetEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      alert('Por favor, informe ou selecione um e-mail válido.');
      return;
    }

    setIsApplyingGrant(true);
    try {
      const payload: TestGrantPayload = {
        email: cleanEmail,
        addLevelTokens: levelTokensToAdd > 0 ? Number(levelTokensToAdd) : undefined,
        addDuelTokens: duelTokensToAdd > 0 ? Number(duelTokensToAdd) : undefined,
        levelAction: levelGrantMode,
        levelAmount: Number(levelAmount),
        unlockAllCosmetics: unlockCosmeticsCheck,
        maxUpgrades: maxUpgradesCheck,
        resetToLevel1: resetToLevel1Check,
        notes: grantNotes.trim() || undefined
      };

      const res = await applyTestResourcesToEmail(payload);
      sound.playPrestige();
      setTestActionMessage(res.message);

      // Se o alvo for o usuário admin logado na sessão atual, sincroniza o gameState local imediatamente!
      if (
        userEmail &&
        cleanEmail === userEmail.trim().toLowerCase() &&
        res.updatedSaveState &&
        onUpdateGameState
      ) {
        onUpdateGameState(res.updatedSaveState);
      }

      await loadSettings();
      await checkTargetAccount(cleanEmail);
      setTimeout(() => setTestActionMessage(null), 6000);
    } catch (err: any) {
      alert(`Erro ao conceder recursos: ${err.message}`);
    } finally {
      setIsApplyingGrant(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSettings();
      setWipeConfirm('');
      setWipeStatus('idle');
      setBackupActionMessage(null);
      if (activeTab === 'dashboard') {
        loadStudents(selectedClassFilter);
      } else if (activeTab === 'backups') {
        loadBackups();
      } else if (activeTab === 'monitoramento') {
        loadMetrics();
      } else if (activeTab === 'testes') {
        checkTargetAccount(targetEmail);
        if (students.length === 0) loadStudents('todas');
      }
    }
  }, [isOpen, activeTab, selectedClassFilter, targetEmail]);

  // Carregamento de Métricas do Firestore & Cotas Spark
  const loadMetrics = async (forceRefresh: boolean = false) => {
    setIsMetricsLoading(true);
    setMetricsError(null);
    try {
      const data = await fetchFirestoreMetrics(forceRefresh);
      setMetricsData(data);
    } catch (err: any) {
      console.warn('Erro ao carregar métricas do Firestore:', err);
      setMetricsError(err.message || 'Erro ao carregar métricas do Firestore.');
    } finally {
      setIsMetricsLoading(false);
    }
  };

  // Auto-refresh de métricas a cada 30 segundos se ativo (o backend serve do cache de 3 min)
  useEffect(() => {
    if (!isOpen || activeTab !== 'monitoramento' || !autoRefreshMetrics) return;

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      loadMetrics(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen, activeTab, autoRefreshMetrics]);

  // Polling Controlado (60s) para o Dashboard do Professor:
  // Só executa se o painel estiver aberto na aba 'dashboard' E se a janela estiver visível e com foco.
  // Evita leituras desnecessárias quando o professor está em outra aba ou fora da máquina.
  useEffect(() => {
    if (!isOpen || activeTab !== 'dashboard') return;

    const pollInterval = setInterval(() => {
      if (typeof document !== 'undefined' && (document.hidden || !document.hasFocus())) {
        return; // Economiza leituras do Firestore quando a aba está em segundo plano
      }
      loadStudents(selectedClassFilter);
    }, 60000); // 60 segundos controlado

    return () => clearInterval(pollInterval);
  }, [isOpen, activeTab, selectedClassFilter]);

  const loadBackups = async () => {
    setIsBackupsLoading(true);
    try {
      const list = await listDatabaseBackups();
      setBackups(list);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsBackupsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    setBackupActionMessage(null);
    try {
      const now = new Date();
      const label = `Backup Manual - ${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`;
      const backupData = await createDatabaseBackup(label);

      // Gatilho imediato de download de arquivo JSON no navegador do professor
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filenameDate = now.toISOString().slice(0, 10);
      a.href = url;
      a.download = `typeclicker_backup_${filenameDate}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      sound.playUpgrade();
      setBackupActionMessage({
        type: 'success',
        text: `Backup gerado com sucesso! Arquivo JSON baixado e cópia gravada na nuvem (${backupData.totalSaves} saves / ${backupData.totalLeaderboard} no ranking).`
      });
      await loadBackups();
    } catch (e: any) {
      setBackupActionMessage({
        type: 'error',
        text: `Falha ao gerar backup: ${e.message}`
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleRestoreFromCloud = async (backupId: string) => {
    setIsRestoring(true);
    setBackupActionMessage(null);
    try {
      const fullBackup = await getDatabaseBackup(backupId);
      if (!fullBackup) throw new Error('Dados do backup não encontrados na nuvem.');

      const result = await restoreDatabaseBackup(fullBackup);
      sound.playPrestige();
      setBackupActionMessage({
        type: 'success',
        text: `Restauração concluída com êxito! ${result.restoredSaves} saves e ${result.restoredBoard} registros de ranking recuperados.`
      });
      setRestoreConfirmId(null);
      if (activeTab === 'dashboard') loadStudents();
    } catch (e: any) {
      setBackupActionMessage({
        type: 'error',
        text: `Erro na restauração: ${e.message}`
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDownloadCloudBackupJson = async (backupId: string) => {
    try {
      const fullBackup = await getDatabaseBackup(backupId);
      if (!fullBackup) throw new Error('Backup não encontrado.');

      const jsonStr = JSON.stringify(fullBackup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${backupId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(`Erro ao baixar arquivo: ${e.message}`);
    }
  };

  const handleDeleteSnapshot = async (backupId: string) => {
    if (!confirm('Deseja excluir este snapshot do histórico da nuvem?')) return;
    try {
      await deleteDatabaseBackup(backupId);
      await loadBackups();
    } catch (e: any) {
      alert(`Erro ao excluir snapshot: ${e.message}`);
    }
  };

  const handleUploadJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text) as FullDatabaseBackup;

        if (!parsed || !parsed.saves) {
          throw new Error('Arquivo JSON inválido ou incompatível com o TypeClicker.');
        }

        const totalSaves = Object.keys(parsed.saves).length;
        const confirmRestore = confirm(
          `Arquivo válido!\nContém ${totalSaves} saves de alunos criados em ${new Date(parsed.createdAt || Date.now()).toLocaleString()}.\n\nDeseja restaurar agora e sobrescrever dados danificados?`
        );

        if (!confirmRestore) return;

        setIsRestoring(true);
        const res = await restoreDatabaseBackup(parsed);
        sound.playPrestige();
        setBackupActionMessage({
          type: 'success',
          text: `Backup do arquivo local restaurado com sucesso! ${res.restoredSaves} saves recuperados.`
        });
        if (activeTab === 'dashboard') loadStudents();
      } catch (err: any) {
        setBackupActionMessage({
          type: 'error',
          text: `Erro ao importar arquivo: ${err.message}`
        });
      } finally {
        setIsRestoring(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleGenerateCode = async (hours: number) => {
    if (!targetTurmaForCode) {
      alert("Por favor, selecione a Turma antes de gerar o código da sessão.");
      return;
    }
    setIsLoading(true);
    try {
      await generateSessionCode(hours, targetTurmaForCode, selectedTrackForCode);
      await loadSettings();
      sound.playPrestige();
    } catch (e) {
      alert("Erro ao gerar código");
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
      alert("Erro ao alterar a trilha da aula: " + (e.message || e));
    } finally {
      setIsChangingLiveTrack(false);
    }
  };

  const handleUpdateStudentProfile = async (
    studentUserId: string,
    updates: { turma?: string; rpgClass?: RpgClassType }
  ) => {
    setUpdatingStudentId(studentUserId);
    try {
      await adminUpdateStudentProfile(studentUserId, updates);
      setStudents(prev => prev.map(s => {
        if (s.userId === studentUserId) {
          return {
            ...s,
            ...(updates.turma !== undefined ? { turma: updates.turma } : {}),
            ...(updates.rpgClass !== undefined ? { rpgClass: updates.rpgClass } : {})
          };
        }
        return s;
      }));
      sound.playUpgrade();
    } catch (e: any) {
      alert(`Erro ao atualizar aluno: ${e.message || e}`);
    } finally {
      setUpdatingStudentId(null);
    }
  };

  const handleAutoBalanceRpg = async () => {
    if (!selectedClassFilter || selectedClassFilter === 'todas') {
      alert("Selecione uma turma específica no filtro para balancear as classes.");
      return;
    }
    const confirmed = window.confirm(
      `Deseja distribuir automaticamente as classes RPG para os alunos da turma ${selectedClassFilter}? (1/3 Guerreiro, 1/3 Arqueiro, 1/3 Mago)`
    );
    if (!confirmed) return;
    setIsAutoBalancing(true);
    try {
      const res = await adminAutoBalanceRpgClasses(selectedClassFilter);
      await loadStudents(selectedClassFilter);
      sound.playPrestige();
      alert(
        `Balanceamento concluído para ${res.updatedCount} alunos da turma ${selectedClassFilter}!\n⚔️ Guerreiros: ${res.distribution.warrior} | 🏹 Arqueiros: ${res.distribution.archer} | 🔮 Magos: ${res.distribution.mage}`
      );
    } catch (err: any) {
      alert(`Erro ao balancear classes: ${err.message || err}`);
    } finally {
      setIsAutoBalancing(false);
    }
  };

  const handleClearCode = async () => {
    setIsLoading(true);
    try {
      await clearSessionCode();
      await loadSettings();
    } catch (e) {
      alert("Erro ao limpar código");
    } finally {
      setIsLoading(false);
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

  const handleRunMigration = async (dryRun = false) => {
    setIsMigrating(true);
    setMigrationResult(null);
    try {
      const res = await migrateSchemasInFirestore(dryRun);
      setMigrationResult(res);
      if (!dryRun) {
        sound.playPrestige();
        if (activeTab === 'dashboard') loadStudents();
      }
    } catch (err: any) {
      alert(`Erro na migração: ${err.message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleWipe = async () => {
    if (wipeConfirm !== 'CONFIRMAR') return;
    setWipeStatus('loading');
    try {
      await wipeDatabase();
      setWipeStatus('success');
      setWipeConfirm('');
      if (activeTab === 'dashboard') loadStudents();
      sound.playGlitch();
    } catch (e) {
      setWipeStatus('error');
    }
  };

  const handleAddTeacher = async () => {
    if (!newTeacherEmail.includes('@')) return;
    setIsUpdatingTeachers(true);
    try {
      const currentList = settings?.allowedTeachers || [];
      if (!currentList.includes(newTeacherEmail)) {
        const newList = [...currentList, newTeacherEmail.trim().toLowerCase()];
        await updateAllowedTeachers(newList);
        setSettings(prev => prev ? { ...prev, allowedTeachers: newList } : null);
        setNewTeacherEmail('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingTeachers(false);
    }
  };

  const handleRemoveTeacher = async (emailToRemove: string) => {
    setIsUpdatingTeachers(true);
    try {
      const currentList = settings?.allowedTeachers || [];
      const newList = currentList.filter(e => e !== emailToRemove);
      await updateAllowedTeachers(newList);
      setSettings(prev => prev ? { ...prev, allowedTeachers: newList } : null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingTeachers(false);
    }
  };

  const handleSanitizeStaffLeaderboard = async () => {
    setIsSanitizingLeaderboard(true);
    setSanitizeMessage(null);
    try {
      const result = await sanitizeStaffFromLeaderboard();
      sound.playWordComplete();
      setSanitizeMessage(`Higienização concluída! ${result.removedCount} registro(s) de professores/administradores removidos de ${result.checkedCount} analisados.`);
      setTimeout(() => setSanitizeMessage(null), 5000);
      loadStudents();
    } catch (e: any) {
      sound.playChallengeFail();
      setSanitizeMessage(`Erro ao higienizar: ${e.message}`);
    } finally {
      setIsSanitizingLeaderboard(false);
    }
  };

  const isActive = settings?.activeCode && settings?.expiresAt && new Date(settings.expiresAt) > new Date();

  const filteredStudents = students.filter(s => {
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl xl:max-w-6xl bg-zinc-950 border border-purple-500/50 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col overflow-hidden max-h-[92vh]"
          >
            {/* Header Superior: Identificação e Botão Fechar */}
            <div className="px-5 pt-4 pb-3 border-b border-white/10 bg-purple-950/20 flex flex-col gap-3.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-sm flex-shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-black text-white tracking-tight truncate">
                        Painel Administrativo
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 hidden sm:inline-block">
                        {isSuperAdmin ? 'Super Admin' : 'Docente'}
                      </span>
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

              {/* Linha de Navegação Dedicada com Suporte a Overflow Suave */}
              <div className="flex items-center gap-1.5 p-1.5 bg-zinc-900/90 rounded-xl border border-zinc-800/90 overflow-x-auto custom-scrollbar flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => setActiveTab('locks')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === 'locks'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <Key className="w-4 h-4" />
                  <span>Sessões</span>
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <BarChart className="w-4 h-4" />
                  <span>Progresso</span>
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
                <button
                  onClick={() => setActiveTab('backups')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === 'backups'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Backups e Restauração de Segurança"
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Backups</span>
                </button>
                <button
                  onClick={() => setActiveTab('monitoramento')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === 'monitoramento'
                      ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30 font-black'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Monitoramento de Cotas Spark & Saúde do Firestore (Cloud Monitoring)"
                >
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Monitoramento Banco</span>
                </button>
                <button
                  onClick={() => setActiveTab('testes')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === 'testes'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Recursos de Teste e Desbloqueio Rápido (ADM)"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Testes ADM</span>
                </button>

                {isSuperAdmin && (
                  <>
                    <div className="h-4 w-[1px] bg-zinc-700/60 mx-1 hidden sm:block flex-shrink-0" />
                    <button
                      onClick={() => setActiveTab('professores')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                        activeTab === 'professores'
                          ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Professores</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('wipe')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                        activeTab === 'wipe'
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                          : 'text-red-400/80 hover:text-red-300 hover:bg-red-950/40'
                      }`}
                      title="Wipe Total do Banco de Dados"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                      <span>Wipe</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              {activeTab === 'locks' && (
                <section className="space-y-4 max-w-xl mx-auto">
                  <div className="flex items-center gap-2 text-zinc-300 font-bold border-b border-zinc-800 pb-2">
                    <Key className="w-5 h-5" />
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
                                <span className="text-xs px-2.5 py-1 rounded-full font-mono font-bold bg-sky-950 text-sky-300 border border-sky-500/40">
                                  🎒 Turma: {settings.activeTurma}
                                </span>
                              )}
                              {settings?.activeTrack && (
                                <span className="text-xs px-2.5 py-1 rounded-full font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 shadow-sm">
                                  <span>{getCurricularTrack(settings.activeTrack).icon}</span>
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
                            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
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
                                    ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
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
                        <GraduationCap className="w-4 h-4 text-purple-400" />
                        <span>Turma para esta Aula (Obrigatória):</span>
                      </label>
                      {targetTurmaForCode && (
                        <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/40">
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
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-purple-400 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-purple-400/50 transition font-mono font-bold cursor-pointer"
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
                      <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                        {getCurricularTrack(selectedTrackForCode).icon} {getCurricularTrack(selectedTrackForCode).name}
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
                                ? 'bg-purple-950/50 border-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                                : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-900'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 font-bold text-xs">
                                <span className="text-base">{track.icon}</span>
                                <span className={isSelected ? 'text-purple-200' : 'text-zinc-200'}>{track.name}</span>
                              </div>
                              {isSelected && (
                                <span className="text-[9px] font-mono font-black text-purple-300 bg-purple-900/80 px-1.5 py-0.5 rounded border border-purple-400/40">
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
                      className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-zinc-700/50 text-white font-bold rounded-xl transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-purple-500/30 shadow-md"
                    >
                      <Key className="w-4 h-4" />
                      <span>Gerar para {targetTurmaForCode || '...'} (1 Hora)</span>
                    </button>
                    <button
                      onClick={() => handleGenerateCode(2)}
                      disabled={isLoading || !targetTurmaForCode}
                      className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-zinc-700/50 text-white font-bold rounded-xl transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-purple-500/30 shadow-md"
                    >
                      <Key className="w-4 h-4" />
                      <span>Gerar para {targetTurmaForCode || '...'} (2 Horas)</span>
                    </button>
                  </div>

                  {/* Configurações de Acessibilidade Pedagógica */}
                  <div className="mt-8 pt-6 border-t border-zinc-800 space-y-4">
                    <div className="flex items-center gap-2 text-zinc-300 font-bold">
                      <Sliders className="w-5 h-5 text-purple-400" />
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
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
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
                              ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
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
              )}

              {activeTab === 'dashboard' && (
                <section className="space-y-4">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex items-center gap-2 text-zinc-300 font-bold">
                        <Users className="w-5 h-5 text-purple-400" />
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
                      {/* Seletor de Turma Ativa (Reduz consumo Firestore) */}
                      <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5">
                        <Filter className="w-3.5 h-3.5 text-purple-400" />
                        <select
                          value={selectedClassFilter}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedClassFilter(val);
                            loadStudents(val);
                          }}
                          className="bg-transparent text-xs font-semibold text-zinc-200 focus:outline-none cursor-pointer"
                          title="Filtrar por Turma no Firestore (Otimização de Leituras)"
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

                      {/* Busca Rápida por Nome/Turma */}
                      <div className="relative flex-1 sm:w-48">
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Buscar aluno..."
                          value={searchTurma}
                          onChange={(e) => setSearchTurma(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      {/* Botão Explícito de Atualização Sob Demanda */}
                      <button
                        onClick={() => loadStudents(selectedClassFilter)}
                        disabled={isStudentsLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-600/40 rounded-lg text-purple-200 text-xs font-bold transition disabled:opacity-50 shadow-sm cursor-pointer"
                        title="Atualizar Dados da Turma no Firestore"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-purple-300 ${isStudentsLoading ? 'animate-spin' : ''}`} />
                        <span>{isStudentsLoading ? 'Atualizando...' : 'Atualizar Dados'}</span>
                      </button>

                      {/* Exportação de Boletim da Turma em CSV (0 leituras/escritas) */}
                      <button
                        onClick={handleExportCSV}
                        disabled={isStudentsLoading || students.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-600/40 rounded-lg text-emerald-200 text-xs font-bold transition disabled:opacity-50 shadow-sm cursor-pointer"
                        title="Exportar Boletim Escolar com PPM, Nível, Acurácia e Corridas em planilha CSV"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Exportar Boletim (CSV)</span>
                      </button>

                      {/* Equilíbrio de Classes RPG para a Turma Selecionada */}
                      {selectedClassFilter && selectedClassFilter !== 'todas' && (
                        <button
                          onClick={handleAutoBalanceRpg}
                          disabled={isAutoBalancing || isStudentsLoading || students.length === 0}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/40 rounded-lg text-amber-200 text-xs font-bold transition disabled:opacity-50 shadow-sm cursor-pointer"
                          title="Distribuir 1/3 Guerreiro, 1/3 Arqueiro e 1/3 Mago igualmente entre os alunos desta turma"
                        >
                          <Swords className={`w-3.5 h-3.5 text-amber-300 ${isAutoBalancing ? 'animate-spin' : ''}`} />
                          <span>{isAutoBalancing ? 'Equilibrando...' : `Equilibrar Classes (${selectedClassFilter})`}</span>
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
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Carregando dados...
                              </div>
                            </td>
                          </tr>
                        ) : filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                              Nenhum aluno encontrado.
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((s, idx) => (
                            <tr key={s.userId} className={`hover:bg-zinc-800/50 transition-colors ${idx !== filteredStudents.length - 1 ? 'border-b border-zinc-800/50' : ''}`}>
                              <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                                <span className="text-xl leading-none">{s.nome.split(' ')[0] || 'Aluno'}</span>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-1.5">
                                    <span>{s.apelido || s.nome}</span>
                                    {s.flaggedForReview && (
                                      <span
                                        title={s.flagReason || 'Valores anormais detectados na sincronização.'}
                                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 cursor-help"
                                      >
                                        <AlertTriangle className="w-3 h-3" />
                                        Revisar
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-zinc-600 font-mono">{s.userId.slice(0,8)}</span>
                                </div>
                              </td>

                              {/* Turma (Reatribuível pelo Professor) */}
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

                              {/* Classe RPG (Reatribuível pelo Professor) */}
                              <td className="px-3 py-2.5 font-mono">
                                <select
                                  value={s.rpgClass || ''}
                                  disabled={updatingStudentId === s.userId}
                                  onChange={(e) => handleUpdateStudentProfile(s.userId, { rpgClass: (e.target.value as RpgClassType) || undefined })}
                                  className="bg-zinc-950/90 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer disabled:opacity-50"
                                  title="Alterar Classe RPG do Aluno"
                                >
                                  <option value="">Sem Classe</option>
                                  <option value="warrior">⚔️ Guerreiro</option>
                                  <option value="archer">🏹 Arqueiro</option>
                                  <option value="mage">🔮 Mago</option>
                                </select>
                              </td>

                              <td className="px-4 py-3 text-right font-bold text-purple-400">{s.level}</td>
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

              {/* ABA: CORRIDA DA TURMA EM TEMPO REAL */}
              {activeTab === 'corrida' && (
                <section className="space-y-6">
                  {/* Cabeçalho da Aba */}
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

                  {/* MONITOR DA CORRIDA ATIVA (Caso exista) */}
                  {activeRace && activeRace.status !== 'cancelled' && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#181308] to-black border-2 border-amber-500/60 shadow-xl space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🏁</span>
                          <h4 className="text-base font-bold text-white">{activeRace.title}</h4>
                          <span className="text-xs text-zinc-400 font-mono">({activeRace.source})</span>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase font-mono ${
                          activeRace.status === 'countdown'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                            : activeRace.status === 'in_progress'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {activeRace.status === 'countdown'
                            ? '⏳ Em Contagem Regressiva...'
                            : activeRace.status === 'in_progress'
                            ? '🏎️ Corrida em Andamento!'
                            : '🏆 Corrida Concluída!'}
                        </span>
                      </div>

                      {/* Card de Vencedor */}
                      {activeRace.winner && (
                        <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/30 border border-amber-400 flex items-center justify-center text-3xl shadow-md">
                              🏆
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

                      {/* Lista de Concluintes (Pódio ao Vivo) */}
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
                                  <span className="font-bold text-sm">
                                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`}
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

                  {/* FORMULÁRIO DE LANÇAMENTO DE NOVA CORRIDA */}
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

                    {/* Área do Texto da Corrida */}
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
                      {/* Turma Alvo */}
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

                      {/* Tempo de Contagem Regressiva */}
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

                      {/* Prêmio em Bytes */}
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

                    {/* Botão de Lançamento */}
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={handleLaunchRace}
                        disabled={isLaunchingRace || !customRaceText.trim()}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-black font-black text-sm uppercase tracking-wider transition shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Flag className="w-5 h-5 text-black" />
                        <span>{isLaunchingRace ? 'Lançando Corrida...' : '🚀 LANÇAR CORRIDA PARA OS ALUNOS AGORA'}</span>
                      </button>
                      <p className="text-[11px] text-zinc-500 font-mono text-center mt-2">
                        * Ao clicar, todos os alunos conectados receberão o aviso de largada imediatamente em tela cheia.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* ABA: RAID COLETIVA CONTRA CHEFE EM TEMPO REAL */}
              {activeTab === 'raid' && (
                <section className="space-y-6">
                  {/* Cabeçalho da Aba */}
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

                  {/* MONITOR DA RAID ATIVA (se houver uma em andamento) */}
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

                      {/* Barra de HP em Tempo Real */}
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

                  {/* FORMULÁRIO DE LANÇAMENTO DA RAID */}
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

                    {/* Cards de Chefes Pré-definidos */}
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
                              <span>⏱️ {Math.floor(boss.timeLimitSeconds / 60)} min</span>
                              <span className="text-amber-400 font-bold">+{formatBytes(boss.prizeBytes)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Configuração de Parâmetros */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-800">
                      {/* Turma Alvo */}
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

                      {/* Tempo Limite */}
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

                      {/* Prêmio de Vitória por Aluno */}
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

                    {/* Botão de Lançamento */}
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={handleLaunchRaid}
                        disabled={isLaunchingRaid}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:from-rose-500 hover:to-red-400 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Swords className="w-5 h-5 text-white" />
                        <span>{isLaunchingRaid ? 'Iniciando Batalha...' : '🚀 LANÇAR RAID COLETIVA PARA A SALA AGORA'}</span>
                      </button>
                      <p className="text-[11px] text-zinc-500 font-mono text-center mt-2">
                        * Ao clicar, todos os alunos conectados receberão o alerta de batalha com o Chefe Coletivo em tempo real.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'textos' && (
                <section className="space-y-6">
                  {/* Cabeçalho */}
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
                    {/* Formulário de Cadastro (5 colunas) */}
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

                    {/* Acervo de Textos Cadastrados (7 colunas) */}
                    <div className="lg:col-span-7 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-400" />
                          Textos Salvos no Sistema
                        </h4>

                        {/* Filtro por Disciplina */}
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

                      {(!settings?.customTexts || settings.customTexts.length === 0) ? (
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

              {activeTab === 'backups' && (
                <section className="space-y-6">
                  {/* Cabeçalho e Ações Principais */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                        <Database className="w-5 h-5" />
                        <h3>Backup & Recuperação do Banco de Dados</h3>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Proteja o progresso de todos os alunos gerando cópias instantâneas na nuvem e arquivos JSON para download.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleCreateBackup}
                        disabled={isCreatingBackup || isRestoring}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
                        title="Salvar snapshot no Firestore e baixar arquivo .json de backup"
                      >
                        <Download className="w-4 h-4" />
                        <span>{isCreatingBackup ? 'Gerando Backup...' : 'Gerar Backup Completo'}</span>
                      </button>

                      {/* Botão de Upload de JSON para restauração manual */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleUploadJsonFile}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isCreatingBackup || isRestoring}
                        className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Restaurar a partir de um arquivo .json salvo no seu computador"
                      >
                        <Upload className="w-4 h-4 text-sky-400" />
                        <span className="hidden md:inline">Restaurar de Arquivo JSON</span>
                        <span className="md:hidden">Restaurar JSON</span>
                      </button>
                    </div>
                  </div>

                  {/* Feedback Message */}
                  {backupActionMessage && (
                    <div
                      className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs font-medium ${
                        backupActionMessage.type === 'success'
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-red-950/40 border-red-500/40 text-red-200'
                      }`}
                    >
                      {backupActionMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span>{backupActionMessage.text}</span>
                    </div>
                  )}

                  {/* Card Explicativo de Segurança */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5">
                      <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                        <Download className="w-3.5 h-3.5" />
                        Download Local Automático
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Ao clicar em "Gerar Backup", o arquivo JSON é salvo no seu computador com a data exata para contingência offline.
                      </p>
                    </div>

                    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5">
                      <div className="text-purple-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                        <Database className="w-3.5 h-3.5" />
                        Snapshots na Nuvem
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        O Firebase mantém o histórico dos últimos snapshots gerados, permitindo restauração em 1 clique direto pelo painel.
                      </p>
                    </div>

                    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5">
                      <div className="text-sky-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restauração Protegida
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Se qualquer alteração corromper os dados dos alunos, você pode reescrever a base com um estado saudável em segundos.
                      </p>
                    </div>
                  </div>

                  {/* Normalização e Migração Retrocompatível de Schemas */}
                  <div className="bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border border-blue-500/30 rounded-2xl p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                          <span>Normalização Estrutural de Schemas (v2)</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-900/60 text-blue-200 border border-blue-700/50">
                            Retrocompatível
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                          Percorre todos os documentos antigos de alunos do Colégio Leopoldina no Firestore, atualizando para a versão de schema 2 sem alterar progresso, pontos ou conquistas.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleRunMigration(true)}
                          disabled={isMigrating}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold border border-zinc-700 transition cursor-pointer disabled:opacity-50"
                          title="Simular migração sem alterar nada no banco de dados"
                        >
                          Simular (Dry-Run)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRunMigration(false)}
                          disabled={isMigrating}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-blue-950/50 disabled:opacity-50 flex items-center gap-1.5"
                          title="Normalizar todos os documentos no Firestore"
                        >
                          {isMigrating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                          <span>{isMigrating ? 'Normalizando...' : 'Executar Migração v2'}</span>
                        </button>
                      </div>
                    </div>

                    {migrationResult && (
                      <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Resultado da Análise de Schema:
                        </div>
                        <div className="text-zinc-400 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px]">
                          <span>Total analisados: <strong className="text-white">{migrationResult.totalScanned}</strong></span>
                          <span>Atualizados: <strong className="text-emerald-400">{migrationResult.totalMigrated}</strong></span>
                          <span>Já atualizados: <strong className="text-blue-400">{migrationResult.alreadyUpToDate}</strong></span>
                          {migrationResult.errors.length > 0 && (
                            <span className="text-rose-400">Erros: {migrationResult.errors.length}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lista de Histórico de Backups na Nuvem */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Histórico de Snapshots na Nuvem</span>
                        <span className="text-zinc-500 font-normal">({backups.length})</span>
                      </div>
                      <button
                        onClick={loadBackups}
                        disabled={isBackupsLoading}
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
                        title="Recarregar histórico"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isBackupsLoading ? 'animate-spin' : ''}`} />
                        <span>Atualizar</span>
                      </button>
                    </div>

                    {isBackupsLoading ? (
                      <div className="p-8 text-center text-zinc-500 text-sm flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                        <span>Carregando snapshots da nuvem...</span>
                      </div>
                    ) : backups.length === 0 ? (
                      <div className="p-8 rounded-xl border border-dashed border-zinc-800 text-center text-zinc-500 text-sm">
                        Nenhum backup gerado ainda. Clique no botão verde acima para gerar o primeiro snapshot de segurança!
                      </div>
                    ) : (
                      <div className="divide-y divide-zinc-800/80 rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
                        {backups.map((b) => {
                          const isConfirmingThis = restoreConfirmId === b.id;
                          return (
                            <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/70 transition">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-zinc-200">{b.label || b.id}</span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                                    {b.totalSaves} saves
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/50">
                                    {b.totalLeaderboard} no ranking
                                  </span>
                                </div>
                                <div className="text-xs text-zinc-500 flex items-center gap-2 mt-1">
                                  <span>{new Date(b.createdAt).toLocaleString('pt-BR')}</span>
                                  <span>•</span>
                                  <span className="font-mono text-zinc-400">{b.createdBy}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {!isConfirmingThis ? (
                                  <>
                                    <button
                                      onClick={() => handleDownloadCloudBackupJson(b.id)}
                                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                                      title="Baixar cópia .json deste snapshot"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">Baixar JSON</span>
                                    </button>

                                    <button
                                      onClick={() => setRestoreConfirmId(b.id)}
                                      disabled={isRestoring}
                                      className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                                      title="Restaurar este estado no banco de dados"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                      <span>Restaurar</span>
                                    </button>

                                    {isSuperAdmin && (
                                      <button
                                        onClick={() => handleDeleteSnapshot(b.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                                        title="Excluir este snapshot antigo"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <div className="flex items-center gap-2 bg-amber-950/50 border border-amber-500/50 p-1.5 rounded-xl animate-pulse">
                                    <span className="text-[11px] font-bold text-amber-200 px-1">Restaurar {b.totalSaves} saves?</span>
                                    <button
                                      onClick={() => handleRestoreFromCloud(b.id)}
                                      disabled={isRestoring}
                                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded-lg transition cursor-pointer"
                                    >
                                      {isRestoring ? 'Restaurando...' : 'Confirmar'}
                                    </button>
                                    <button
                                      onClick={() => setRestoreConfirmId(null)}
                                      disabled={isRestoring}
                                      className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition cursor-pointer"
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {activeTab === 'monitoramento' && (
                <section className="space-y-6">
                  {/* Cabeçalho e Controles */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
                        <Activity className="w-5 h-5" />
                        <h3>Monitoramento de Banco & Cotas do Firestore</h3>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Acompanhe o consumo diário de leituras, escritas e recursos do Plano Spark fornecido pela infraestrutura do Google Cloud.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                      {/* Toggle Auto-Refresh */}
                      <label className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl cursor-pointer select-none hover:border-zinc-700 transition">
                        <input
                          type="checkbox"
                          checked={autoRefreshMetrics}
                          onChange={(e) => setAutoRefreshMetrics(e.target.checked)}
                          className="rounded border-zinc-700 bg-zinc-800 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="flex items-center gap-1.5">
                          <Timer className="w-3.5 h-3.5 text-cyan-400" />
                          Auto-Refresh (30s)
                        </span>
                      </label>

                      <button
                        onClick={() => loadMetrics(true)}
                        disabled={isMetricsLoading}
                        className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-black text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-cyan-950/40 cursor-pointer"
                        title="Forçar atualização das métricas agora"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isMetricsLoading ? 'animate-spin' : ''}`} />
                        <span>{isMetricsLoading ? 'Carregando...' : 'Atualizar Agora'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Aviso Discreto de Latência GCP */}
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-300/90">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>⏱️ Métricas consolidadas com ~3-5 min de atraso via GCP.</span>
                    </div>
                    {metricsData && (
                      <span className="text-[11px] text-zinc-400 hidden sm:inline">
                        Última leitura: {new Date(metricsData.timestamp).toLocaleTimeString('pt-BR')}
                        {metricsData.isFromCache ? ` (Cache: ${metricsData.cachedSecondsAgo}s)` : ''}
                      </span>
                    )}
                  </div>

                  {metricsError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{metricsError}</span>
                    </div>
                  )}

                  {/* Grid de 4 Cards Explicativos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Leituras Hoje */}
                    <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-zinc-400">Leituras Hoje</span>
                        <Database className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="my-1">
                        <div className="text-2xl font-black text-zinc-100 flex items-baseline gap-1.5">
                          {metricsData ? metricsData.reads.used.toLocaleString('pt-BR') : '---'}
                          <span className="text-xs font-medium text-zinc-500">
                            / {metricsData ? metricsData.reads.quota.toLocaleString('pt-BR') : '50.000'}
                          </span>
                        </div>
                        <div className="text-xs font-bold mt-0.5 text-emerald-400">
                          {metricsData ? `${metricsData.reads.percent}% da cota Spark` : 'Aguardando...'}
                        </div>
                      </div>
                      {/* Barra de Progresso */}
                      <div className="w-full h-2 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            (metricsData?.reads.percent || 0) > 85
                              ? 'bg-rose-500'
                              : (metricsData?.reads.percent || 0) > 60
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, metricsData?.reads.percent || 0)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-2">Limite diário: 50.000 leituras (00:00 UTC)</span>
                    </div>

                    {/* Card 2: Escritas Hoje */}
                    <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-zinc-400">Escritas Hoje</span>
                        <Zap className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="my-1">
                        <div className="text-2xl font-black text-zinc-100 flex items-baseline gap-1.5">
                          {metricsData ? metricsData.writes.used.toLocaleString('pt-BR') : '---'}
                          <span className="text-xs font-medium text-zinc-500">
                            / {metricsData ? metricsData.writes.quota.toLocaleString('pt-BR') : '20.000'}
                          </span>
                        </div>
                        <div className="text-xs font-bold mt-0.5 text-amber-400">
                          {metricsData ? `${metricsData.writes.percent}% da cota Spark` : 'Aguardando...'}
                        </div>
                      </div>
                      {/* Barra de Progresso */}
                      <div className="w-full h-2 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            (metricsData?.writes.percent || 0) > 85
                              ? 'bg-rose-500'
                              : (metricsData?.writes.percent || 0) > 60
                              ? 'bg-amber-500'
                              : 'bg-amber-400'
                          }`}
                          style={{ width: `${Math.min(100, metricsData?.writes.percent || 0)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-2">Limite diário: 20.000 escritas (00:00 UTC)</span>
                    </div>

                    {/* Card 3: Status do Servidor */}
                    <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-zinc-400">Status do Servidor</span>
                        <Terminal className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="my-1">
                        <div className="text-base font-black flex items-center gap-2">
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-zinc-100">
                            {metricsData?.server.status === 'warning' ? 'Atenção (Cotas)' : 'Normal'}
                          </span>
                        </div>
                        <div className="text-xs font-medium mt-1 text-zinc-400">
                          0 msgs pendentes no buffer
                        </div>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-2 space-y-0.5 border-t border-zinc-800/80 pt-2">
                        <div>Memória RSS: <strong className="text-zinc-300">{metricsData?.server.memoryRssMb ?? '--'} MB</strong></div>
                        <div className="truncate">Ambiente: <strong className="text-zinc-300">{metricsData?.server.environment ?? '--'}</strong></div>
                      </div>
                    </div>

                    {/* Card 4: Total de Registros de Alunos */}
                    <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-zinc-400">Total de Alunos</span>
                        <Users className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="my-1">
                        <div className="text-2xl font-black text-indigo-300 flex items-baseline gap-1.5">
                          {metricsData ? metricsData.studentsCount.toLocaleString('pt-BR') : '---'}
                          <span className="text-xs font-normal text-zinc-400">contas</span>
                        </div>
                        <div className="text-xs font-medium mt-0.5 text-zinc-400">
                          Registros na coleção /saves
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-3 pt-2 border-t border-zinc-800/80">
                        Contagem agregada via Firestore count() (1 leitura)
                      </div>
                    </div>
                  </div>

                  {/* Informações Complementares & Boas Práticas do Laboratório */}
                  <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 space-y-2">
                    <h4 className="font-bold text-zinc-200 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      Políticas de Conservação de Quota do TypeClicker
                    </h4>
                    <p>
                      • <strong>Throttling de 60 segundos</strong>: O jogo agrupa todas as teclas e pontuações dos alunos, disparando saves periódicos de 60s para manter o consumo diário seguro abaixo de 20.000 escritas mesmo com mais de 300 alunos em aula simultânea.
                    </p>
                    <p>
                      • <strong>Deduplicação Singleflight</strong>: Consultas simultâneas ao ranking e ao pódio escolar compartilham promessas ativas na nuvem, evitando picos de centenas de leituras simultâneas.
                    </p>
                    <p>
                      • <strong>Cache do Monitoramento</strong>: O backend retém os resultados por 3 minutos em memória para permitir que múltiplos professores acessem o painel administrativo sem consumir requisições adicionais à Cloud Monitoring API.
                    </p>
                  </div>
                </section>
              )}

              {isSuperAdmin && activeTab === 'wipe' && (
                <section className="space-y-4 max-w-xl mx-auto">
                  <div className="flex items-center gap-2 text-red-400 font-bold border-b border-red-900/50 pb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <h3>Zona de Perigo (Wipe)</h3>
                  </div>
                  
                  <p className="text-sm text-zinc-400">
                    Esta ação irá apagar <strong>TODOS OS SAVES</strong> e o <strong>RANKING GERAL</strong> permanentemente. Ideal para reiniciar o semestre.
                  </p>

                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={wipeConfirm}
                      onChange={(e) => setWipeConfirm(e.target.value)}
                      placeholder="Digite CONFIRMAR para habilitar o botão"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                    <button
                      onClick={handleWipe}
                      disabled={wipeConfirm !== 'CONFIRMAR' || wipeStatus === 'loading'}
                      className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      {wipeStatus === 'loading' ? 'APAGANDO...' : 'WIPE TOTAL DO BANCO DE DADOS'}
                    </button>
                    
                    {wipeStatus === 'success' && <div className="text-emerald-400 text-center text-sm font-bold">Banco de dados apagado com sucesso.</div>}
                    {wipeStatus === 'error' && <div className="text-red-400 text-center text-sm font-bold">Erro ao apagar banco de dados.</div>}
                  </div>
                </section>
              )}

              {isSuperAdmin && activeTab === 'professores' && (
                <section className="space-y-4 max-w-xl mx-auto">
                  <div className="flex items-center gap-2 text-sky-400 font-bold border-b border-sky-900/50 pb-2">
                    <Users className="w-5 h-5" />
                    <h3>Acesso de Professores</h3>
                  </div>
                  
                  <p className="text-sm text-zinc-400">
                    Insira o email Google de outros professores. Eles terão acesso a este painel para gerar Códigos de Sessão e visualizar o Progresso dos Alunos.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={newTeacherEmail}
                      onChange={(e) => setNewTeacherEmail(e.target.value)}
                      placeholder="email.do.professor@escola.pr.gov.br"
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500"
                    />
                    <button
                      onClick={handleAddTeacher}
                      disabled={isUpdatingTeachers || !newTeacherEmail.includes('@')}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-lg transition"
                    >
                      Adicionar
                    </button>
                  </div>

                  <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden mt-4">
                    <div className="px-4 py-2 bg-zinc-800/50 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Professores Autorizados
                    </div>
                    {(!settings?.allowedTeachers || settings.allowedTeachers.length === 0) ? (
                      <div className="p-4 text-sm text-zinc-500 text-center">Nenhum professor adicionado ainda.</div>
                    ) : (
                      <ul className="divide-y divide-zinc-800">
                        {settings.allowedTeachers.map(email => (
                          <li key={email} className="p-4 flex items-center justify-between">
                            <span className="text-sm font-mono text-zinc-300">{email}</span>
                            <button
                              onClick={() => handleRemoveTeacher(email)}
                              disabled={isUpdatingTeachers}
                              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition"
                              title="Remover Acesso"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Card de Higienização de Rankings */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-900 via-[#161a22] to-zinc-900 border border-zinc-800 space-y-3 mt-6 shadow-md">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-amber-400" />
                          <h4 className="text-sm font-bold text-zinc-100">Higienização dos Rankings Escolares</h4>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 max-w-md">
                          Remove retroativamente do Firestore qualquer conta de professor ou administrador que ainda conste na coleção de ranking dos alunos.
                        </p>
                      </div>
                      <button
                        onClick={handleSanitizeStaffLeaderboard}
                        disabled={isSanitizingLeaderboard}
                        className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4" />
                        {isSanitizingLeaderboard ? 'Higienizando...' : 'Higienizar Rankings'}
                      </button>
                    </div>
                    {sanitizeMessage && (
                      <p className="text-xs font-semibold text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded-lg">
                        {sanitizeMessage}
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* ABA: RECURSOS DE TESTE E INDICAÇÃO DE E-MAILS (ADM) */}
              {activeTab === 'testes' && (
                <section className="space-y-6">
                  {/* Cabeçalho do Ambiente de Teste */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-black border border-amber-500/50 shadow-lg space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-md">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-black text-white">Painel de Recursos de Teste & Contas Indicadas</h3>
                            <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-mono font-bold text-[10px]">
                              👑 SUPER ADMIN
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400">
                            Indique e-mails que receberão moedas, desbloqueios e progressão gradativa de nível para testes pedagógicos.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {onOpenArena && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenArena();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/70 text-red-200 border border-red-500/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Swords className="w-3.5 h-3.5 text-red-400" />
                            <span>Abrir Arena 1x1</span>
                          </button>
                        )}
                        {onOpenCosmetics && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenCosmetics();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/70 text-purple-200 border border-purple-500/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>Abrir Loja</span>
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (onUpdateGameState && gameState) {
                              const fixed: GameState = {
                                ...gameState,
                                studentClass: 'Professor',
                                isClassLocked: true
                              };
                              onUpdateGameState(fixed);
                              saveState(fixed, auth.currentUser?.uid);
                              if (auth.currentUser) {
                                await saveProgressToCloud(fixed);
                              }
                            }
                            if (targetEmail) {
                              checkTargetAccount(targetEmail);
                            }
                            sound.playPrestige();
                            setTestActionMessage('Turma do Professor ajustada com sucesso para "Professor"!');
                            setTimeout(() => setTestActionMessage(null), 4000);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-200 border border-emerald-500/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                          title="Garante que a conta do professor esteja com a turma 'Professor' no save local e na nuvem"
                        >
                          <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Fixar Turma: Professor</span>
                        </button>
                      </div>
                    </div>

                    {testActionMessage && (
                      <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2.5 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{testActionMessage}</span>
                      </div>
                    )}
                  </div>

                  {/* SEÇÃO 1: INDICAÇÃO E SELEÇÃO DE E-MAIL ALVO */}
                  <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400" />
                        <h4 className="font-bold text-sm text-white">1. E-mails Indicados para Receber Recursos</h4>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {(settings?.testerEmails || []).length} testador(es) cadastrado(s)
                      </span>
                    </div>

                    {/* Barra de Seleção Rápida */}
                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-semibold block">
                        Selecione a conta que receberá os recursos:
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Botão Meu Perfil Admin */}
                        <button
                          onClick={() => {
                            const adminEmail = userEmail || 'wrobel.marcos@gmail.com';
                            setTargetEmail(adminEmail);
                            checkTargetAccount(adminEmail);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                            targetEmail.toLowerCase() === (userEmail || 'wrobel.marcos@gmail.com').toLowerCase()
                              ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-sm'
                              : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-750'
                          }`}
                        >
                          <span>👑</span>
                          <span>Meu Perfil ({userEmail || 'Admin'})</span>
                        </button>

                        {/* Badges de E-mails Cadastrados */}
                        {(settings?.testerEmails || []).map((tEmail) => {
                          const isSelected = targetEmail.toLowerCase() === tEmail.toLowerCase();
                          return (
                            <div
                              key={tEmail}
                              className={`flex items-center rounded-lg border text-xs font-mono transition ${
                                isSelected
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                                  : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:text-zinc-200'
                              }`}
                            >
                              <button
                                onClick={() => {
                                  setTargetEmail(tEmail);
                                  checkTargetAccount(tEmail);
                                }}
                                className="px-2.5 py-1.5 flex items-center gap-1.5 cursor-pointer"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>{tEmail}</span>
                              </button>
                              <button
                                onClick={() => handleRemoveTester(tEmail)}
                                title={`Remover ${tEmail} dos testadores`}
                                disabled={isRemovingTester}
                                className="pr-2 pl-1 py-1.5 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}

                        {/* Botão para buscar aluno existente */}
                        <button
                          onClick={() => setShowStudentPicker(!showStudentPicker)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-750 text-sky-400 border border-sky-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>Selecionar Aluno da Escola ({students.length})</span>
                        </button>
                      </div>
                    </div>

                    {/* Dropdown / Seletor de Alunos da Escola */}
                    {showStudentPicker && (
                      <div className="p-3 rounded-lg bg-zinc-950 border border-sky-500/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                            <Search className="w-3.5 h-3.5" /> Alunos Cadastrados no Banco de Dados
                          </span>
                          <button
                            onClick={() => setShowStudentPicker(false)}
                            className="text-zinc-400 hover:text-white text-xs"
                          >
                            Fechar
                          </button>
                        </div>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {students.length === 0 ? (
                            <p className="text-xs text-zinc-500 py-2">Nenhum aluno com save encontrado no momento.</p>
                          ) : (
                            students.map((st) => (
                              <button
                                key={st.userId}
                                onClick={() => {
                                  const emailChoice = (st as any).email || `${st.nome.toLowerCase().replace(/\s+/g, '.')}@escola.pr.gov.br`;
                                  setTargetEmail(emailChoice);
                                  checkTargetAccount(emailChoice);
                                  setShowStudentPicker(false);
                                }}
                                className="w-full text-left p-2 rounded hover:bg-zinc-800 flex items-center justify-between text-xs transition cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-base">{st.avatar || '🐧'}</span>
                                  <span className="font-bold text-white">{st.nome}</span>
                                  {st.apelido && <span className="text-zinc-400">({st.apelido})</span>}
                                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400">{st.turma}</span>
                                </div>
                                <span className="text-emerald-400 font-mono">Nv. {st.level} • {formatBytes(st.points || 0)}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* Cadastrar / Indicar Novo E-mail */}
                    <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          placeholder="Indicar novo e-mail para testes (ex: aluno.teste@escola.pr.gov.br)..."
                          value={newTesterEmailInput}
                          onChange={(e) => setNewTesterEmailInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTester()}
                          className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <button
                        onClick={handleAddTester}
                        disabled={isAddingTester || !newTesterEmailInput.trim()}
                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Indicar E-mail</span>
                      </button>
                    </div>

                    {/* Cartão de Resumo da Conta Alvo Atualmente Selecionada */}
                    <div className="p-3.5 rounded-lg bg-zinc-950 border border-amber-500/30 font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400">E-mail Selecionado:</span>
                          <span className="font-bold text-amber-300 text-sm">{targetEmail}</span>
                          {isLoadingAccountInfo && <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
                        </div>
                        <div>
                          {targetAccountInfo?.exists ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                              ✅ Save Sincronizado no Firestore
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold">
                              ⏳ Nova Conta (Será criada/injetada ao logar)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        <div className="p-2 rounded bg-zinc-900 border border-white/5">
                          <span className="text-zinc-500 block text-[10px]">Identificação:</span>
                          <span className="font-bold text-white truncate block">
                            {targetAccountInfo?.name || targetEmail.split('@')[0]}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-[10px] text-zinc-400 block truncate font-mono">
                              {targetAccountInfo?.turma || 'Sem turma'}
                            </span>
                            {ADMIN_EMAILS.some((adm) => adm.toLowerCase() === targetEmail.toLowerCase()) && (
                              <span className="text-[9px] font-bold text-purple-300 bg-purple-950/90 px-1.5 py-0.2 rounded border border-purple-500/40">
                                👨‍🏫 Docente
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-2 rounded bg-zinc-900 border border-white/5">
                          <span className="text-zinc-500 block text-[10px]">Nível Atual:</span>
                          <span className="font-bold text-emerald-400 text-sm">
                            Nv. {targetAccountInfo?.currentLevel ?? 1}
                          </span>
                          <span className="text-[10px] text-zinc-400 block truncate">
                            {formatBytes(targetAccountInfo?.currentBytes ?? 0)}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-zinc-900 border border-white/5">
                          <span className="text-zinc-500 block text-[10px]">Level Tokens:</span>
                          <span className="font-bold text-amber-400 text-sm">
                            {targetAccountInfo?.levelTokens ?? 0} 🪙
                          </span>
                        </div>
                        <div className="p-2 rounded bg-zinc-900 border border-white/5">
                          <span className="text-zinc-500 block text-[10px]">Moedas de Duelo:</span>
                          <span className="font-bold text-rose-400 text-sm">
                            {targetAccountInfo?.duelTokens ?? 0} ⚔️
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SEÇÃO 2: CONFIGURAÇÃO DOS RECURSOS A CONCEDER */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Painel A: Subir de Nível de Forma Gradativa */}
                    <div className="p-4 rounded-xl bg-zinc-900/90 border border-emerald-500/30 space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-emerald-400" />
                            <h4 className="font-bold text-sm text-white">Subir de Nível Gradativamente</h4>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                            Curva Pedagógica
                          </span>
                        </div>

                        {/* Modos: Incrementar vs Definir */}
                        <div className="flex rounded-lg bg-zinc-950 p-1 border border-zinc-800 text-xs">
                          <button
                            onClick={() => {
                              setLevelGrantMode('add_levels');
                              if (levelAmount > 25) setLevelAmount(1);
                            }}
                            className={`flex-1 py-1 rounded font-bold transition ${
                              levelGrantMode === 'add_levels'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            + Incrementar Gradativo
                          </button>
                          <button
                            onClick={() => {
                              setLevelGrantMode('set_level');
                              if (levelAmount < 10) setLevelAmount(25);
                            }}
                            className={`flex-1 py-1 rounded font-bold transition ${
                              levelGrantMode === 'set_level'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            Definir Nível Alvo
                          </button>
                        </div>

                        {/* Opções Rápidas de Incremento / Nível */}
                        {levelGrantMode === 'add_levels' ? (
                          <div className="space-y-2">
                            <label className="text-[11px] text-zinc-400">Escolha o salto gradativo:</label>
                            <div className="grid grid-cols-4 gap-1.5">
                              {[
                                { label: '+1 Nível', val: 1, desc: 'Avanço unitário' },
                                { label: '+5 Níveis', val: 5, desc: 'Meio módulo' },
                                { label: '+10 Níveis', val: 10, desc: 'Módulo' },
                                { label: '+25 Níveis', val: 25, desc: 'Tier completo' }
                              ].map((item) => (
                                <button
                                  key={item.val}
                                  onClick={() => setLevelAmount(item.val)}
                                  className={`py-2 px-1 rounded-lg text-xs font-bold border text-center transition cursor-pointer ${
                                    levelAmount === item.val
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                                  }`}
                                >
                                  <div>{item.label}</div>
                                  <div className="text-[9px] text-zinc-500 font-normal">{item.desc}</div>
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[11px] text-zinc-400 font-mono">Personalizado:</span>
                              <input
                                type="number"
                                min="1"
                                max="99"
                                value={levelAmount}
                                onChange={(e) => setLevelAmount(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                                className="w-20 px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 text-center"
                              />
                              <span className="text-[11px] text-zinc-400">níveis a avançar</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <label className="text-[11px] text-zinc-400">Definir nível específico (1 a 100):</label>
                            <div className="grid grid-cols-5 gap-1.5">
                              {[10, 25, 50, 75, 100].map((lvl) => (
                                <button
                                  key={lvl}
                                  onClick={() => setLevelAmount(lvl)}
                                  className={`py-1.5 rounded-lg text-xs font-bold border text-center transition cursor-pointer ${
                                    levelAmount === lvl
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                                  }`}
                                >
                                  Nv. {lvl}
                                </button>
                              ))}
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="100"
                              value={levelAmount}
                              onChange={(e) => setLevelAmount(parseInt(e.target.value))}
                              className="w-full accent-emerald-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                              <span>Nv. 1 (Recruta)</span>
                              <span className="text-emerald-400 font-bold">Nv. {levelAmount} Selecionado</span>
                              <span>Nv. 100 (Lenda)</span>
                            </div>
                          </div>
                        )}

                        {/* Prévia do Resultado do Nível */}
                        {(() => {
                          const currLvl = targetAccountInfo?.currentLevel ?? 1;
                          const targetLvl = levelGrantMode === 'add_levels'
                            ? Math.min(100, currLvl + levelAmount)
                            : Math.min(100, Math.max(1, levelAmount));
                          const levelMeta = ALL_LEVELS[targetLvl - 1] || ALL_LEVELS[0];
                          const requiredBytes = calculateMinBytesForLevel(targetLvl);

                          return (
                            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs space-y-1.5">
                              <div className="flex items-center justify-between font-mono">
                                <span className="text-zinc-500 text-[10px]">Transição Gradativa:</span>
                                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                                  <span>Nv. {currLvl}</span>
                                  <ArrowRight className="w-3 h-3 text-zinc-500" />
                                  <span className="text-emerald-300 text-sm">Nv. {targetLvl}</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-base">{levelMeta.badge}</span>
                                <span className="font-bold text-white text-xs truncate">{levelMeta.title}</span>
                              </div>
                              <div className="text-[10px] text-zinc-400">
                                <span>Bytes atribuídos: </span>
                                <span className="text-amber-400 font-mono font-bold">{formatBytes(requiredBytes)}</span>
                                <span className="text-zinc-500"> (Calculado na curva exponencial de aprendizado)</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Painel B: Adicionar Moedas (Level Tokens & Duelo) */}
                    <div className="p-4 rounded-xl bg-zinc-900/90 border border-amber-500/30 space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-amber-400" />
                            <h4 className="font-bold text-sm text-white">Adicionar Moedas de Teste</h4>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                            Loja & Arena
                          </span>
                        </div>

                        {/* Moedas de Nível (Level Tokens 🪙) */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-300 font-semibold flex items-center gap-1">
                              <span>🪙</span> Level Tokens (Loja de Cosméticos):
                            </span>
                            <span className="text-amber-400 font-mono font-bold">+{levelTokensToAdd.toLocaleString('pt-BR')} 🪙</span>
                          </div>
                          <div className="grid grid-cols-5 gap-1">
                            {[500, 1000, 5000, 10000, 50000].map((amount) => (
                              <button
                                key={amount}
                                onClick={() => setLevelTokensToAdd(amount)}
                                className={`py-1 rounded text-[11px] font-mono border transition cursor-pointer ${
                                  levelTokensToAdd === amount
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm font-bold'
                                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                                }`}
                              >
                                +{amount >= 1000 ? `${amount / 1000}k` : amount}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[10px] text-zinc-500 font-mono">Ou digite:</span>
                            <input
                              type="number"
                              min="0"
                              step="100"
                              value={levelTokensToAdd}
                              onChange={(e) => setLevelTokensToAdd(Math.max(0, parseInt(e.target.value) || 0))}
                              className="flex-1 px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>

                        {/* Moedas de Duelo (Arena Coins ⚔️) */}
                        <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-300 font-semibold flex items-center gap-1">
                              <span>⚔️</span> Moedas de Duelo (Arena de Combate):
                            </span>
                            <span className="text-rose-400 font-mono font-bold">+{duelTokensToAdd.toLocaleString('pt-BR')} ⚔️</span>
                          </div>
                          <div className="grid grid-cols-5 gap-1">
                            {[500, 1000, 5000, 10000, 50000].map((amount) => (
                              <button
                                key={amount}
                                onClick={() => setDuelTokensToAdd(amount)}
                                className={`py-1 rounded text-[11px] font-mono border transition cursor-pointer ${
                                  duelTokensToAdd === amount
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-sm font-bold'
                                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                                }`}
                              >
                                +{amount >= 1000 ? `${amount / 1000}k` : amount}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="text-[10px] text-zinc-500 font-mono">Ou digite:</span>
                            <input
                              type="number"
                              min="0"
                              step="100"
                              value={duelTokensToAdd}
                              onChange={(e) => setDuelTokensToAdd(Math.max(0, parseInt(e.target.value) || 0))}
                              className="flex-1 px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-xs font-mono text-rose-400 focus:outline-none focus:border-rose-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SEÇÃO 3: RECURSOS EXTRAS E NOTAS */}
                  <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                    <h4 className="font-bold text-xs text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-purple-400" />
                      Opções Adicionais de Teste
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-2.5 cursor-pointer hover:border-zinc-700 transition">
                        <input
                          type="checkbox"
                          checked={unlockCosmeticsCheck}
                          onChange={(e) => setUnlockCosmeticsCheck(e.target.checked)}
                          className="mt-0.5 accent-amber-500"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-white block">Desbloquear Cosméticos</span>
                          <span className="text-[10px] text-zinc-400">Libera todos os 14 layouts, temas, sons e animações.</span>
                        </div>
                      </label>

                      <label className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-2.5 cursor-pointer hover:border-zinc-700 transition">
                        <input
                          type="checkbox"
                          checked={maxUpgradesCheck}
                          onChange={(e) => setMaxUpgradesCheck(e.target.checked)}
                          className="mt-0.5 accent-sky-500"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-white block">Maximizar Upgrades</span>
                          <span className="text-[10px] text-zinc-400">Define nível 50 em todos os upgrades de hardware.</span>
                        </div>
                      </label>

                      <label className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-2.5 cursor-pointer hover:border-red-900/50 transition">
                        <input
                          type="checkbox"
                          checked={resetToLevel1Check}
                          onChange={(e) => setResetToLevel1Check(e.target.checked)}
                          className="mt-0.5 accent-red-500"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-red-300 block">Resetar para Nível 1</span>
                          <span className="text-[10px] text-zinc-400">Zera bytes e nível para testar início de novo aluno.</span>
                        </div>
                      </label>
                    </div>

                    <div className="pt-2">
                      <input
                        type="text"
                        placeholder="Nota ou motivo do teste (opcional, ex: 'Teste da turma 3º A - layout BIOS')..."
                        value={grantNotes}
                        onChange={(e) => setGrantNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* BOTÃO DE CONCESSÃO PRIMÁRIO */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-emerald-950/40 to-black border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                    <div>
                      <h4 className="font-black text-sm text-white flex items-center gap-2">
                        <span>🎁</span> Conceder Recursos Pedagógicos
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                        Alvo: <strong className="text-amber-300">{targetEmail}</strong> • Nível: <strong className="text-emerald-300">{levelGrantMode === 'add_levels' ? `+${levelAmount} Nível(is)` : `Nv. ${levelAmount}`}</strong> • Moedas: <strong className="text-amber-300">+{levelTokensToAdd} 🪙</strong> / <strong className="text-rose-300">+{duelTokensToAdd} ⚔️</strong>
                      </p>
                    </div>

                    <button
                      onClick={handleApplyGrant}
                      disabled={isApplyingGrant}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 disabled:opacity-50 text-zinc-950 font-black text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
                    >
                      {isApplyingGrant ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Aplicando Recursos...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 fill-current" />
                          <span>Aplicar Recursos Agora</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* TESTE RÁPIDO DE DESAFIOS (A CADA 10 NÍVEIS) */}
                  {onTriggerChallenge && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-black border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                      <div>
                        <div className="text-xs font-bold text-red-400 flex items-center gap-1.5 font-mono">
                          <Terminal className="w-4 h-4" />
                          <span>TESTE IMEDIATO DE DESAFIOS (A CADA 10 NÍVEIS)</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1">
                          Abra o desafio imediatamente na tela para testar a resposta do teclado, captura de foco ao clicar e recompensas.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => {
                              onClose();
                              onTriggerChallenge(lvl);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 shadow-sm"
                          >
                            <span>Nv. {lvl}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SEÇÃO 4: HISTÓRICO DE RECURSOS CONCEDIDOS (AUDIT TRAIL) */}
                  <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                        <History className="w-3.5 h-3.5 text-zinc-400" />
                        Histórico de Concessões Realizadas
                      </h4>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Últimas {(settings?.testGrantsHistory || []).length} ações
                      </span>
                    </div>

                    {!(settings?.testGrantsHistory && settings.testGrantsHistory.length > 0) ? (
                      <p className="text-xs text-zinc-500 py-3 text-center">
                        Nenhuma concessão registrada até o momento. As novas concessões aparecerão aqui para auditoria.
                      </p>
                    ) : (
                      <div className="max-h-52 overflow-y-auto space-y-1.5 font-mono text-xs">
                        {settings.testGrantsHistory.map((h) => (
                          <div
                            key={h.id}
                            className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-amber-300">{h.email}</span>
                                {h.appliedDirectlyToSave ? (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px]">
                                    Firestore OK
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 text-[9px]">
                                    Pendente no Login
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-zinc-400">
                                {h.levelAction === 'add_levels' ? `+${h.levelAmount} nível(is)` : `Nv. ${h.levelAmount}`}
                                {' • '}+{h.addLevelTokens || 0} 🪙 Tokens
                                {' • '}+{h.addDuelTokens || 0} ⚔️ Duelo
                                {h.unlockAllCosmetics && ' • Cosméticos 100%'}
                                {h.maxUpgrades && ' • Upgrades Máximos'}
                                {h.resetToLevel1 && ' • Reset Nv. 1'}
                                {h.notes && ` (${h.notes})`}
                              </p>
                            </div>
                            <div className="text-right text-[10px] text-zinc-500 flex-shrink-0">
                              <div>Por: {h.grantedBy}</div>
                              <div>{new Date(h.grantedAt).toLocaleString('pt-BR')}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
