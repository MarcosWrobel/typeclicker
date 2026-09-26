import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Trash2,
  X,
  AlertTriangle,
  Users,
  Search,
  RefreshCw,
  Database,
  Download,
  Upload,
  CheckCircle2,
  RotateCcw,
  Sliders,
  Sparkles,
  Coins,
  Zap,
  Trophy,
  Plus,
  History,
  Gift,
  ArrowRight,
  Terminal,
  Activity,
  Calendar,
  Timer,
  Swords
} from 'lucide-react';
import { fetchSupabaseMetrics, SupabaseMetricsData } from '../services/supabaseMetricsService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import {
  createSupabaseBackup,
  downloadSupabaseBackupFile,
  restoreSupabaseBackup,
  FullSupabaseBackup
} from '../services/supabaseBackupService';
import {
  findTargetAccount,
  applyTestGrantToSupabase,
  TargetAccountData,
  SupabaseTestGrantPayload
} from '../services/supabaseTestService';
import { dbService } from '../services/dbFactory';
import { LeaderboardEntry } from '../types/leaderboard';
import { isStaffMember, ADMIN_EMAILS } from '../utils/leaderboardUtils';
import {
  auth,
  SystemSettings,
  getSystemSettings,
  updateAllowedTeachers,
  wipeDatabase as wipeLegacyFirestoreDatabase,
  addTesterEmail,
  removeTesterEmail
} from '../services/firebaseService';
import { sound } from '../utils/audio';
import { formatBytes, calculatePlayerRank } from '../utils/formatting';
import { ALL_LEVELS, calculateMinBytesForLevel } from '../data/levels';
import { GameState } from '../types';
import { DEFAULT_COSMETICS } from '../types/cosmetics';
import { getAllUnlockedCosmetics } from '../constants/cosmeticsCatalog';
import { saveState } from '../utils/storage';

export interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isSuperAdmin?: boolean;
  gameState?: GameState;
  onUpdateGameState?: (updated: GameState) => void;
  userEmail?: string | null;
  onOpenArena?: () => void;
  onOpenCosmetics?: () => void;
  onTriggerChallenge?: (level: number) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  isSuperAdmin = true,
  gameState,
  onUpdateGameState,
  userEmail,
  onOpenArena,
  onOpenCosmetics,
  onTriggerChallenge
}) => {
  const [activeTab, setActiveTab] = useState<'temporadas' | 'backups' | 'monitoramento' | 'testes' | 'professores' | 'wipe'>('temporadas');
  const [testActionMessage, setTestActionMessage] = useState<string | null>(null);

  // Estados para Gestão de Trimestres e Temporadas (Supabase / Hall da Fama)
  const [seasonStudents, setSeasonStudents] = useState<LeaderboardEntry[]>([]);
  const [archivedSeasonsAdmin, setArchivedSeasonsAdmin] = useState<{ seasonId: string; seasonName: string; closedAt: string }[]>([]);
  const [isSeasonLoading, setIsSeasonLoading] = useState<boolean>(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState<boolean>(false);
  const [closeSeasonId, setCloseSeasonId] = useState<string>('2026_T3');
  const [closeSeasonName, setCloseSeasonName] = useState<string>('3º Trimestre 2026');
  const [closeConfirmInput, setCloseConfirmInput] = useState<string>('');
  const [isClosingSeason, setIsClosingSeason] = useState<boolean>(false);
  const [seasonActionMessage, setSeasonActionMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Estados para Monitoramento de Banco & Infraestrutura do Supabase
  const [metricsData, setMetricsData] = useState<SupabaseMetricsData | null>(null);
  const [isMetricsLoading, setIsMetricsLoading] = useState<boolean>(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [autoRefreshMetrics, setAutoRefreshMetrics] = useState<boolean>(false);

  // Configurações e Wipe
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [wipeConfirm, setWipeConfirm] = useState('');
  const [wipeStatus, setWipeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Professores & Sanitização
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [isUpdatingTeachers, setIsUpdatingTeachers] = useState(false);
  const [isSanitizingLeaderboard, setIsSanitizingLeaderboard] = useState(false);
  const [sanitizeMessage, setSanitizeMessage] = useState<string | null>(null);

  // Backup & Restore states (Supabase)
  const [lastBackup, setLastBackup] = useState<FullSupabaseBackup | null>(null);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupActionMessage, setBackupActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para Indicação de E-mails e Recursos de Teste (Supabase)
  const [targetEmail, setTargetEmail] = useState<string>(userEmail || 'wrobel.marcos@gmail.com');
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [newTesterEmailInput, setNewTesterEmailInput] = useState<string>('');
  const [isAddingTester, setIsAddingTester] = useState<boolean>(false);
  const [isRemovingTester, setIsRemovingTester] = useState<boolean>(false);

  // Parâmetros de Recursos de Teste
  const [levelGrantMode, setLevelGrantMode] = useState<'add_levels' | 'set_level'>('add_levels');
  const [levelAmount, setLevelAmount] = useState<number>(1);
  const [levelTokensToAdd, setLevelTokensToAdd] = useState<number>(1000);
  const [duelTokensToAdd, setDuelTokensToAdd] = useState<number>(1000);
  const [unlockCosmeticsCheck, setUnlockCosmeticsCheck] = useState<boolean>(true);
  const [maxUpgradesCheck, setMaxUpgradesCheck] = useState<boolean>(false);
  const [resetToLevel1Check, setResetToLevel1Check] = useState<boolean>(false);
  const [grantNotes, setGrantNotes] = useState<string>('');

  const [isApplyingGrant, setIsApplyingGrant] = useState<boolean>(false);
  const [targetAccountInfo, setTargetAccountInfo] = useState<TargetAccountData | null>(null);
  const [isLoadingAccountInfo, setIsLoadingAccountInfo] = useState<boolean>(false);
  const [showStudentPicker, setShowStudentPicker] = useState<boolean>(false);
  const [studentsForPicker, setStudentsForPicker] = useState<LeaderboardEntry[]>([]);

  const loadSettings = async () => {
    const data = await getSystemSettings();
    setSettings(data);
  };

  const loadStudentsForPicker = async () => {
    try {
      const data = await dbService.getAdminDashboardData();
      setStudentsForPicker(data);
    } catch (e) {
      console.error('Error loading students for picker:', e);
    }
  };

  // Fechamento pelo teclado com Escape
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

  // Ações Rápidas de Teste para o Administrador
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

  const checkTargetAccount = async (identifierToCheck: string, userIdToCheck?: string) => {
    const clean = identifierToCheck.trim();
    if (!clean && !userIdToCheck) {
      setTargetAccountInfo(null);
      return;
    }

    const isCurrentAdmin = (userEmail && clean.toLowerCase() === userEmail.trim().toLowerCase()) ||
      (auth.currentUser?.uid && userIdToCheck === auth.currentUser.uid);

    if (isCurrentAdmin && gameState) {
      const rank = calculatePlayerRank(gameState.totalBytesEarned || 0);
      setTargetAccountInfo({
        exists: true,
        userId: auth.currentUser?.uid,
        name: gameState.studentName || 'Prof. Marcos Wrobel (Admin)',
        turma: 'Professor',
        email: userEmail || 'wrobel.marcos@gmail.com',
        role: 'admin',
        currentLevel: rank.level,
        currentBytes: gameState.totalBytesEarned || 0,
        levelTokens: gameState.cosmetics?.levelTokens || 0,
        duelTokens: gameState.cosmetics?.duelTokens || 0,
        quantumFragments: gameState.cosmetics?.quantumFragments || 0
      });
      return;
    }

    setIsLoadingAccountInfo(true);
    try {
      const data = await findTargetAccount(clean, userIdToCheck);
      setTargetAccountInfo(data);
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
      setSettings((prev) => (prev ? { ...prev, testerEmails: updatedList } : null));
      setTargetEmail(clean);
      setTargetUserId(null);
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
      setSettings((prev) => (prev ? { ...prev, testerEmails: updatedList } : null));
      if (targetEmail.toLowerCase() === emailToRemove.toLowerCase()) {
        const defaultAdmin = userEmail || 'wrobel.marcos@gmail.com';
        setTargetEmail(defaultAdmin);
        setTargetUserId(auth.currentUser?.uid || null);
        checkTargetAccount(defaultAdmin, auth.currentUser?.uid);
      }
      sound.playGlitch();
    } catch (e: any) {
      alert(`Erro ao remover: ${e.message}`);
    } finally {
      setIsRemovingTester(false);
    }
  };

  const handleApplyGrant = async () => {
    const cleanTarget = targetEmail.trim();
    if (!cleanTarget && !targetUserId) {
      alert('Por favor, informe ou selecione um aluno ou e-mail válido.');
      return;
    }

    setIsApplyingGrant(true);
    try {
      const resolvedUserId = targetUserId || targetAccountInfo?.userId;
      const payload: SupabaseTestGrantPayload = {
        userId: resolvedUserId,
        email: cleanTarget.includes('@') ? cleanTarget : targetAccountInfo?.email,
        identifier: cleanTarget || resolvedUserId || 'aluno_teste',
        addLevelTokens: levelTokensToAdd > 0 ? Number(levelTokensToAdd) : undefined,
        addDuelTokens: duelTokensToAdd > 0 ? Number(duelTokensToAdd) : undefined,
        addQuantumFragments: 0,
        levelAction: levelGrantMode,
        levelAmount: Number(levelAmount),
        unlockAllCosmetics: unlockCosmeticsCheck,
        maxUpgrades: maxUpgradesCheck,
        resetToLevel1: resetToLevel1Check,
        notes: grantNotes.trim() || undefined
      };

      const res = await applyTestGrantToSupabase(payload);
      sound.playPrestige();
      setTestActionMessage(res.message);

      const isTargetLoggedInUser =
        (userEmail && cleanTarget.toLowerCase() === userEmail.trim().toLowerCase()) ||
        (auth.currentUser?.uid && resolvedUserId === auth.currentUser.uid);

      if (isTargetLoggedInUser && res.updatedSaveState && onUpdateGameState) {
        onUpdateGameState(res.updatedSaveState);
      }

      await loadSettings();
      await checkTargetAccount(cleanTarget, resolvedUserId);
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
      if (activeTab === 'temporadas') {
        loadSeasonAdminData();
      } else if (activeTab === 'monitoramento') {
        loadMetrics();
      } else if (activeTab === 'testes') {
        checkTargetAccount(targetEmail, targetUserId || undefined);
        if (studentsForPicker.length === 0) loadStudentsForPicker();
      }
    }
  }, [isOpen, activeTab, targetEmail]);

  const loadSeasonAdminData = async () => {
    setIsSeasonLoading(true);
    setSeasonActionMessage(null);
    try {
      const [seasonLeaderboard, archivedList] = await Promise.all([
        dbService.getSeasonLeaderboard(true),
        dbService.getArchivedSeasonsList()
      ]);
      const cleanStudents = seasonLeaderboard.filter((s) => !isStaffMember(s));
      setSeasonStudents(cleanStudents);
      setArchivedSeasonsAdmin(archivedList);
    } catch (err: any) {
      setSeasonActionMessage({ type: 'error', message: err.message || 'Erro ao carregar dados do trimestre.' });
    } finally {
      setIsSeasonLoading(false);
    }
  };

  const handleExecuteCloseSeason = async () => {
    if (closeConfirmInput.trim() !== 'CONFIRMAR') return;
    setIsClosingSeason(true);
    setSeasonActionMessage(null);
    try {
      const targetName = closeSeasonName.trim();
      const archivedCount = await dbService.closeCurrentSeason(closeSeasonId.trim(), targetName);
      sound.playPrestige();
      setSeasonActionMessage({
        type: 'success',
        message: `Trimestre "${targetName}" encerrado com sucesso! ${archivedCount} alunos foram imortalizados no Hall da Fama e as pontuações foram renovadas.`
      });
      setIsCloseModalOpen(false);
      setCloseConfirmInput('');
      await loadSeasonAdminData();
    } catch (err: any) {
      setSeasonActionMessage({
        type: 'error',
        message: `Falha ao encerrar trimestre: ${err.message || err}`
      });
    } finally {
      setIsClosingSeason(false);
    }
  };

  const loadMetrics = async (forceRefresh: boolean = false) => {
    setIsMetricsLoading(true);
    setMetricsError(null);
    try {
      const data = await fetchSupabaseMetrics(forceRefresh);
      setMetricsData(data);
    } catch (err: any) {
      console.warn('Erro ao carregar métricas do Supabase:', err);
      setMetricsError(err.message || 'Erro ao carregar métricas do Supabase.');
    } finally {
      setIsMetricsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || activeTab !== 'monitoramento' || !autoRefreshMetrics) return;

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      loadMetrics(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen, activeTab, autoRefreshMetrics]);

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    setBackupActionMessage(null);
    try {
      const now = new Date();
      const label = `Backup Supabase - ${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`;
      const backupData = await createSupabaseBackup(label, userEmail || 'admin');

      downloadSupabaseBackupFile(backupData);
      setLastBackup(backupData);

      sound.playUpgrade();
      setBackupActionMessage({
        type: 'success',
        text: `Backup exportado e baixado com sucesso! (${backupData.counts.profiles} perfis, ${backupData.counts.game_progress} progressos, ${backupData.counts.user_cosmetics} cosméticos, ${backupData.counts.user_achievements} conquistas, ${backupData.counts.season_history} temporadas).`
      });
    } catch (e: any) {
      setBackupActionMessage({
        type: 'error',
        text: `Falha ao gerar backup: ${e.message}`
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleUploadJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text) as FullSupabaseBackup;

        if (!parsed || !parsed.tables || !parsed.counts) {
          throw new Error('Arquivo JSON inválido ou incompatível com o formato de backup do Supabase.');
        }

        const confirmRestore = confirm(
          `Arquivo de backup válido!\n\n` +
          `• Perfis: ${parsed.counts.profiles || 0}\n` +
          `• Progresso de Jogos: ${parsed.counts.game_progress || 0}\n` +
          `• Cosméticos: ${parsed.counts.user_cosmetics || 0}\n` +
          `• Conquistas: ${parsed.counts.user_achievements || 0}\n` +
          `• Temporadas: ${parsed.counts.season_history || 0}\n` +
          `• Criado em: ${new Date(parsed.createdAt || Date.now()).toLocaleString('pt-BR')}\n\n` +
          `Deseja restaurar agora e aplicar upsert nas tabelas do Supabase?`
        );

        if (!confirmRestore) return;

        setIsRestoring(true);
        const res = await restoreSupabaseBackup(parsed);
        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors.join('; '));
        }

        sound.playPrestige();
        setBackupActionMessage({
          type: 'success',
          text: `Restauração concluída! Restaurados: ${res.restoredCounts.profiles} perfis, ${res.restoredCounts.game_progress} progressos, ${res.restoredCounts.user_cosmetics} cosméticos, ${res.restoredCounts.user_achievements} conquistas.`
        });
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

  const handleWipe = async () => {
    if (wipeConfirm !== 'CONFIRMAR') return;
    setWipeStatus('loading');
    try {
      await dbService.wipeDatabase();

      try {
        await wipeLegacyFirestoreDatabase();
      } catch (legacyErr) {
        console.warn('Wipe de coleções legadas do Firestore ignorado ou falhou:', legacyErr);
      }

      setWipeStatus('success');
      setWipeConfirm('');
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
        setSettings((prev) => (prev ? { ...prev, allowedTeachers: newList } : null));
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
      const newList = currentList.filter((e) => e !== emailToRemove);
      await updateAllowedTeachers(newList);
      setSettings((prev) => (prev ? { ...prev, allowedTeachers: newList } : null));
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
      const result = await dbService.sanitizeStaffLeaderboard();
      sound.playWordComplete();
      setSanitizeMessage(`Higienização concluída! ${result.removedCount} registro(s) de professores/administradores removidos de ${result.checkedCount} analisados.`);
      setTimeout(() => setSanitizeMessage(null), 5000);
    } catch (e: any) {
      sound.playChallengeFail();
      setSanitizeMessage(`Erro ao higienizar: ${e.message}`);
    } finally {
      setIsSanitizingLeaderboard(false);
    }
  };

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
            className="w-full max-w-5xl xl:max-w-6xl bg-zinc-950 border border-purple-500/50 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col overflow-hidden max-h-[92vh]"
          >
            {/* Header Superior: Identificação e Botão Fechar */}
            <div className="px-5 pt-4 pb-3 border-b border-white/10 bg-gradient-to-r from-purple-950/40 via-zinc-950 to-amber-950/20 flex flex-col gap-3.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-sm flex-shrink-0">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-black text-white tracking-tight truncate">
                        Administração do Sistema
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        Super Admin
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

              {/* Linha de Navegação Dedicada para Abas Administrativas */}
              <div className="flex items-center gap-1.5 p-1.5 bg-zinc-900/90 rounded-xl border border-zinc-800/90 overflow-x-auto custom-scrollbar flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => setActiveTab('temporadas')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === 'temporadas'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-black'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Gestão de Trimestres Letivos e Hall da Fama"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Trimestres & Temporadas</span>
                </button>

                <button
                  onClick={() => setActiveTab('backups')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === 'backups'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Backups e Restauração de Segurança (JSON Supabase)"
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
                  title="Monitoramento de Cotas e Saúde do PostgreSQL Supabase"
                >
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Monitoramento Banco</span>
                </button>

                <button
                  onClick={() => setActiveTab('testes')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === 'testes'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Recursos de Teste e Concessão de Tokens/Níveis"
                >
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  <span>Recursos de Teste</span>
                </button>

                <div className="h-4 w-[1px] bg-zinc-700/60 mx-1 hidden sm:block flex-shrink-0" />

                <button
                  onClick={() => setActiveTab('professores')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === 'professores'
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                  title="Autorização de Novos Professores e Higienização de Ranking"
                >
                  <Users className="w-4 h-4 text-sky-300" />
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
              </div>
            </div>

            {/* Conteúdo com Scroll */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
              {/* ABA: GESTÃO DE TRIMESTRES & TEMPORADAS (SUPABASE / HALL DA FAMA) */}
              {activeTab === 'temporadas' && (
                <section className="space-y-6">
                  {/* Cabeçalho da Aba */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
                        <Trophy className="w-5 h-5 text-amber-400" />
                        <h3>Gestão de Trimestres Letivos & Hall da Fama</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Supabase
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Acompanhe o rendimento do 3º Trimestre letivo, veja o pódio provisório e realize o encerramento seguro do ciclo para consagrar os campeões no Hall da Fama.
                      </p>
                    </div>

                    <button
                      onClick={() => loadSeasonAdminData()}
                      disabled={isSeasonLoading}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer border border-zinc-700 disabled:opacity-50"
                      title="Atualizar dados do trimestre"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSeasonLoading ? 'animate-spin' : ''}`} />
                      <span>{isSeasonLoading ? 'Atualizando...' : 'Atualizar Dados'}</span>
                    </button>
                  </div>

                  {/* Feedback de Ação */}
                  {seasonActionMessage && (
                    <div
                      className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                        seasonActionMessage.type === 'success'
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-red-950/40 border-red-500/40 text-red-300'
                      }`}
                    >
                      {seasonActionMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      )}
                      <span>{seasonActionMessage.message}</span>
                    </div>
                  )}

                  {/* Grid de 4 Cards de Resumo do Trimestre Atual */}
                  {(() => {
                    const activeStudentsCount = seasonStudents.filter((s) => (s.seasonBytes || 0) > 0).length;
                    const totalSeasonBytes = seasonStudents.reduce((acc, s) => acc + (s.seasonBytes || 0), 0);
                    const leader = seasonStudents[0];

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Card 1: Trimestre Ativo */}
                        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-zinc-400">Trimestre Letivo</span>
                            <Calendar className="w-4 h-4 text-amber-400" />
                          </div>
                          <div>
                            <div className="text-xl font-black text-white">3º Trimestre 2026</div>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              ● Ciclo Atual em Disputa
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 mt-2">Calendário escolar SEED-PR</span>
                        </div>

                        {/* Card 2: Alunos Pontuando */}
                        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-zinc-400">Alunos Ativos no Trimestre</span>
                            <Users className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="text-2xl font-black text-white flex items-baseline gap-1.5">
                              {activeStudentsCount}
                              <span className="text-xs font-medium text-zinc-500">/ {seasonStudents.length} cadastrados</span>
                            </div>
                            <div className="text-xs font-bold text-purple-400 mt-0.5">
                              {seasonStudents.length > 0 ? `${Math.round((activeStudentsCount / seasonStudents.length) * 100)}% de participação` : '---'}
                            </div>
                          </div>
                          <span className="text-[10px] text-zinc-500 mt-2">Alunos com season_bytes &gt; 0</span>
                        </div>

                        {/* Card 3: Total de Bytes do Trimestre */}
                        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-zinc-400">Produção no Trimestre</span>
                            <Database className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-xl font-black text-emerald-400">
                              {formatBytes(totalSeasonBytes)}
                            </div>
                            <span className="text-xs text-zinc-400 mt-0.5 block">
                              Volume consolidado nesta temporada
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 mt-2">Somatório de season_bytes</span>
                        </div>

                        {/* Card 4: Líder Provisório */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 via-zinc-900 to-zinc-950 border border-yellow-500/30 flex flex-col justify-between shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-yellow-400 flex items-center gap-1">
                              <span>👑</span> Líder Provisório
                            </span>
                            <Trophy className="w-4 h-4 text-yellow-400" />
                          </div>
                          {leader ? (
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{leader.avatar || '👩‍💻'}</span>
                                <div className="min-w-0">
                                  <div className="text-sm font-black text-white truncate">{leader.apelido || leader.nome}</div>
                                  <div className="text-[11px] text-zinc-400 font-mono">Turma {leader.turma}</div>
                                </div>
                              </div>
                              <div className="text-xs font-mono font-bold text-yellow-300 mt-1.5">
                                {formatBytes(leader.seasonBytes || 0)} conquistados
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-500">Nenhum aluno pontuando ainda.</span>
                          )}
                          <span className="text-[10px] text-zinc-500 mt-2">1º Colocado no ranking de temporada</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Pódio Provisório dos Top 3 do Trimestre */}
                  {seasonStudents.length >= 2 && (
                    <div className="p-5 rounded-2xl bg-[#12151e] border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <h4 className="text-sm font-bold text-white">Pódio Provisório do 3º Trimestre</h4>
                        </div>
                        <span className="text-xs text-zinc-500 font-mono">Candidatos ao Hall da Fama</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {seasonStudents.slice(0, 3).map((st, idx) => (
                          <div
                            key={st.userId}
                            className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                              idx === 0
                                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200'
                                : idx === 1
                                ? 'bg-slate-400/10 border-slate-400/30 text-slate-200'
                                : 'bg-orange-600/10 border-orange-500/30 text-orange-200'
                            }`}
                          >
                            <span className="text-2xl font-black">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-white text-xs truncate">{st.apelido || st.nome}</div>
                              <div className="text-[10px] text-zinc-400 font-mono">Turma {st.turma}</div>
                            </div>
                            <div className="text-right font-mono font-bold text-xs">
                              <div>{formatBytes(st.seasonBytes || 0)}</div>
                              <div className="text-[10px] text-zinc-500 font-normal">Nv. {st.level}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Seção de Ação: Encerrar Trimestre com Modal Seguro */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-black border-2 border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-400" />
                        <h4 className="font-black text-white text-base">Encerramento Oficial do Trimestre Letivo</h4>
                      </div>
                      <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
                        Ao encerrar a temporada, o pódio e o ranking consolidado serão imortalizados permanentemente na tabela <code className="text-amber-300 font-mono">season_history</code> do Supabase, disponíveis para consulta eterna no Hall da Fama pelos alunos. As pontuações <code className="text-amber-300 font-mono">season_bytes</code> serão reiniciadas para o próximo trimestre, preservando níveis e cosméticos conquistados.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setCloseConfirmInput('');
                        setIsCloseModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
                    >
                      <Trophy className="w-4 h-4 text-black" />
                      <span>Encerrar Trimestre Agora</span>
                    </button>
                  </div>

                  {/* Histórico de Temporadas Já Arquivadas */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-zinc-400" />
                        <h4 className="text-sm font-bold text-zinc-200">Ciclos Anteriores Gravados no Hall da Fama</h4>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">{archivedSeasonsAdmin.length} arquivada(s)</span>
                    </div>

                    {archivedSeasonsAdmin.length === 0 ? (
                      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center text-xs text-zinc-500">
                        Nenhuma temporada foi encerrada ainda. O 3º Trimestre 2026 é o primeiro ciclo a ser arquivado no novo banco relacional!
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {archivedSeasonsAdmin.map((s) => (
                          <div key={s.seasonId} className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1 font-mono text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-300">{s.seasonName}</span>
                              <span className="text-[10px] text-zinc-500">ID: {s.seasonId}</span>
                            </div>
                            <div className="text-[11px] text-zinc-400">
                              Encerrado em: {new Date(s.closedAt).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Modal de Confirmação Segura do Fechamento de Trimestre */}
                  <AnimatePresence>
                    {isCloseModalOpen && (
                      <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        onClick={() => !isClosingSeason && setIsCloseModalOpen(false)}
                      >
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.95, opacity: 0 }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full max-w-lg bg-zinc-950 border-2 border-amber-500/60 rounded-2xl p-6 shadow-2xl space-y-4"
                        >
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                                <Trophy className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-base font-black text-white">Confirmar Encerramento do Trimestre</h3>
                                <p className="text-xs text-zinc-400 font-mono">Operação Irreversível no Hall da Fama</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setIsCloseModalOpen(false)}
                              disabled={isClosingSeason}
                              className="p-1 rounded-lg text-zinc-500 hover:text-white"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-xs text-zinc-300">
                            <span className="font-bold text-amber-300 block">
                              Resumo do Pódio que será Imortalizado:
                            </span>
                            <div className="space-y-1.5 text-xs font-mono">
                              {seasonStudents[0] && (
                                <div className="text-yellow-300 flex items-center justify-between">
                                  <span>🥇 1º {seasonStudents[0].apelido || seasonStudents[0].nome} (Turma {seasonStudents[0].turma})</span>
                                  <span className="font-bold">{formatBytes(seasonStudents[0].seasonBytes || 0)}</span>
                                </div>
                              )}
                              {seasonStudents[1] && (
                                <div className="text-slate-300 flex items-center justify-between">
                                  <span>🥈 2º {seasonStudents[1].apelido || seasonStudents[1].nome} (Turma {seasonStudents[1].turma})</span>
                                  <span className="font-bold">{formatBytes(seasonStudents[1].seasonBytes || 0)}</span>
                                </div>
                              )}
                              {seasonStudents[2] && (
                                <div className="text-orange-300 flex items-center justify-between">
                                  <span>🥉 3º {seasonStudents[2].apelido || seasonStudents[2].nome} (Turma {seasonStudents[2].turma})</span>
                                  <span className="font-bold">{formatBytes(seasonStudents[2].seasonBytes || 0)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Inputs de Configuração da Temporada */}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="text-zinc-400 font-semibold block mb-1">ID da Temporada:</label>
                              <input
                                type="text"
                                value={closeSeasonId}
                                onChange={(e) => setCloseSeasonId(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <label className="text-zinc-400 font-semibold block mb-1">Nome de Exibição:</label>
                              <input
                                type="text"
                                value={closeSeasonName}
                                onChange={(e) => setCloseSeasonName(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-amber-500"
                              />
                            </div>
                          </div>

                          {/* Campo de Confirmação Segura */}
                          <div className="space-y-1.5">
                            <label className="text-xs text-zinc-300 font-bold block">
                              Para autorizar, digite <span className="text-yellow-400 font-mono">CONFIRMAR</span> no campo abaixo:
                            </label>
                            <input
                              type="text"
                              value={closeConfirmInput}
                              onChange={(e) => setCloseConfirmInput(e.target.value)}
                              placeholder="CONFIRMAR"
                              className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-xl px-4 py-2 text-white font-mono font-bold tracking-wider focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          {/* Botões do Modal */}
                          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                            <button
                              onClick={() => setIsCloseModalOpen(false)}
                              disabled={isClosingSeason}
                              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={handleExecuteCloseSeason}
                              disabled={closeConfirmInput.trim() !== 'CONFIRMAR' || isClosingSeason}
                              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black text-xs cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-500/20"
                            >
                              {isClosingSeason ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                                  <span>Gravando Hall da Fama...</span>
                                </>
                              ) : (
                                <>
                                  <Trophy className="w-4 h-4 text-black" />
                                  <span>Encerrar e Imortalizar</span>
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </section>
              )}

              {/* ABA: BACKUPS E RECUPERAÇÃO DO SUPABASE */}
              {activeTab === 'backups' && (
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                        <Database className="w-5 h-5" />
                        <h3>Backup & Recuperação do Supabase (PostgreSQL)</h3>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Exporte snapshots completos em formato JSON ou restaure o estado das tabelas do Supabase com validação de integridade.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleCreateBackup}
                        disabled={isCreatingBackup || isRestoring}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
                        title="Extrair dados de profiles, game_progress, user_cosmetics, user_achievements, season_history e baixar .json"
                      >
                        <Download className="w-4 h-4" />
                        <span>{isCreatingBackup ? 'Exportando...' : 'Exportar Snapshot JSON'}</span>
                      </button>

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

                  {!isSupabaseConfigured && (
                    <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Supabase Não Conectado neste Ambiente</span>
                      </div>
                      <p>
                        A exportação e restauração de snapshots do PostgreSQL exigem a conexão com o Supabase. No momento, o sistema está utilizando o banco de contingência (Firebase Firestore) porque as credenciais não foram encontradas.
                      </p>
                      <div className="bg-black/50 rounded-xl p-3 font-mono text-[11px] text-zinc-300 space-y-1">
                        <div className="text-zinc-400 font-bold mb-1">Como resolver no Google AI Studio / Cloud Run:</div>
                        <div>1. No painel de configuração/secrets da aplicação, confira o nome da variável: use <span className="text-emerald-400">VITE_SUPABASE_URL</span> (com &quot;E&quot;, e não <span className="text-rose-400">VITA_</span>).</div>
                        <div>2. Adicione <span className="text-emerald-400">VITE_SUPABASE_ANON_KEY</span> com a chave pública do Supabase.</div>
                        <div>3. Defina <span className="text-emerald-400">VITE_DB_PROVIDER=supabase</span>.</div>
                        <div className="mt-2 text-zinc-400">Alternativa: adicione o arquivo <code className="text-cyan-300">supabase-applet-config.json</code> na raiz do projeto (veja modelo em <code className="text-cyan-300">supabase-applet-config.example.json</code>).</div>
                      </div>
                    </div>
                  )}

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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5">
                      <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                        <Download className="w-3.5 h-3.5" />
                        Snapshot Relacional Completo
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Exporta diretamente as tabelas <code className="text-emerald-300">profiles</code>, <code className="text-emerald-300">game_progress</code>, <code className="text-emerald-300">user_cosmetics</code>, <code className="text-emerald-300">user_achievements</code> e <code className="text-emerald-300">season_history</code>.
                      </p>
                    </div>

                    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5">
                      <div className="text-purple-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                        <Database className="w-3.5 h-3.5" />
                        Download JSON Imediato
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        O arquivo é baixado instantaneamente pelo navegador, garantindo cópia física local e independente da nuvem para contingência total.
                      </p>
                    </div>

                    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5">
                      <div className="text-sky-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Restauração com Upsert
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Ao subir um JSON de backup, o sistema valida a integridade do schema v2 e executa upsert seguro sem duplicar chaves primárias.
                      </p>
                    </div>
                  </div>

                  {lastBackup && (
                    <div className="p-4 bg-zinc-900/80 border border-emerald-500/30 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Último Snapshot Exportado nesta Sessão</span>
                        </div>
                        <button
                          onClick={() => downloadSupabaseBackupFile(lastBackup)}
                          className="px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Download className="w-3 h-3 text-emerald-400" />
                          Baixar novamente
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                        <div className="p-2.5 bg-black/40 rounded-xl border border-zinc-800/80">
                          <div className="text-lg font-black text-white">{lastBackup.counts.profiles}</div>
                          <div className="text-[10px] text-zinc-400 uppercase font-bold">Perfis</div>
                        </div>
                        <div className="p-2.5 bg-black/40 rounded-xl border border-zinc-800/80">
                          <div className="text-lg font-black text-emerald-400">{lastBackup.counts.game_progress}</div>
                          <div className="text-[10px] text-zinc-400 uppercase font-bold">Progressos</div>
                        </div>
                        <div className="p-2.5 bg-black/40 rounded-xl border border-zinc-800/80">
                          <div className="text-lg font-black text-purple-400">{lastBackup.counts.user_cosmetics}</div>
                          <div className="text-[10px] text-zinc-400 uppercase font-bold">Cosméticos</div>
                        </div>
                        <div className="p-2.5 bg-black/40 rounded-xl border border-zinc-800/80">
                          <div className="text-lg font-black text-amber-400">{lastBackup.counts.user_achievements}</div>
                          <div className="text-[10px] text-zinc-400 uppercase font-bold">Conquistas</div>
                        </div>
                        <div className="p-2.5 bg-black/40 rounded-xl border border-zinc-800/80">
                          <div className="text-lg font-black text-sky-400">{lastBackup.counts.season_history}</div>
                          <div className="text-[10px] text-zinc-400 uppercase font-bold">Temporadas</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 space-y-2">
                    <h4 className="font-bold text-zinc-200 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      Boas Práticas de Contingência Escolar
                    </h4>
                    <p>
                      • <strong>Recomendação de Frequência</strong>: Exporte um snapshot antes de fechamentos de bimestres, viradas de temporada ou antes de executar a limpeza na Zona de Perigo (Wipe).
                    </p>
                    <p>
                      • <strong>Integridade Relacional</strong>: Durante a restauração, a tabela <code className="text-zinc-300">profiles</code> é restaurada prioritariamente como entidade principal, seguida pelas tabelas de progresso e cosméticos associadas aos IDs dos alunos.
                    </p>
                  </div>
                </section>
              )}

              {/* ABA: MONITORAMENTO DE BANCO & INFRAESTRUTURA SUPABASE */}
              {activeTab === 'monitoramento' && (
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
                        <Activity className="w-5 h-5" />
                        <h3>Monitoramento de Banco & Infraestrutura Supabase</h3>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Acompanhe o status da conexão PostgreSQL, a contagem exata de registros por tabela e as cotas do Plano Gratuito.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
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

                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-300/90">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        metricsData?.status === 'online'
                          ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                          : metricsData?.status === 'degraded'
                          ? 'bg-amber-400 shadow-sm shadow-amber-400'
                          : 'bg-rose-500'
                      }`} />
                      <span className="font-semibold">
                        PostgreSQL {metricsData ? metricsData.status.toUpperCase() : 'CONECTANDO'}
                      </span>
                      {metricsData && (
                        <span className="text-zinc-400">
                          • Latência: <strong className="text-white font-mono">{metricsData.latencyMs} ms</strong>
                        </span>
                      )}
                    </div>
                    {metricsData && (
                      <span className="text-[11px] text-zinc-400 hidden sm:inline">
                        Última leitura: {new Date(metricsData.timestamp).toLocaleTimeString('pt-BR')}
                        {metricsData.isFromCache ? ' (Cache em memória)' : ''}
                      </span>
                    )}
                  </div>

                  {metricsError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{metricsError}</span>
                    </div>
                  )}

                  {!isSupabaseConfigured && (
                    <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Supabase Não Conectado neste Ambiente</span>
                      </div>
                      <p>
                        O sistema está operando com o banco de dados de contingência (Firebase Firestore) porque a URL de conexão do Supabase não foi encontrada no build ou no runtime do servidor.
                      </p>
                      <div className="bg-black/50 rounded-xl p-3 font-mono text-[11px] text-zinc-300 space-y-1">
                        <div className="text-zinc-400 font-bold mb-1">Passo a passo para conectar no Google AI Studio / Cloud Run:</div>
                        <div>1. No painel de publicação/secrets do AI Studio, adicione a variável:</div>
                        <div className="pl-4 text-emerald-400 font-bold">VITE_SUPABASE_URL=https://seu-projeto.supabase.co</div>
                        <div className="text-[10px] text-zinc-400 pl-4">(Atenção: verifique se não foi digitado &quot;VITA_&quot; em vez de &quot;VITE_&quot;)</div>
                        <div>2. Adicione a chave anônima pública:</div>
                        <div className="pl-4 text-emerald-400 font-bold">VITE_SUPABASE_ANON_KEY=eyJhbGci...</div>
                        <div>3. Ative o provedor Supabase:</div>
                        <div className="pl-4 text-emerald-400 font-bold">VITE_DB_PROVIDER=supabase</div>
                        <div className="mt-2 text-zinc-400">Alternativa com arquivo: salve suas credenciais em <code className="text-cyan-300">supabase-applet-config.json</code> na raiz.</div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-zinc-400">Banco de Dados (Storage)</span>
                        <Database className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="my-1">
                        <div className="text-2xl font-black text-zinc-100 flex items-baseline gap-1.5">
                          {metricsData ? `${metricsData.storage.estimatedUsedMb} MB` : '---'}
                          <span className="text-xs font-medium text-zinc-500">
                            / {metricsData ? `${metricsData.storage.databaseLimitMb} MB` : '500 MB'}
                          </span>
                        </div>
                        <div className="text-xs font-bold mt-0.5 text-emerald-400">
                          {metricsData ? `${metricsData.storage.percentUsed}% do Plano Free` : 'Aguardando...'}
                        </div>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            (metricsData?.storage.percentUsed || 0) > 85
                              ? 'bg-rose-500'
                              : (metricsData?.storage.percentUsed || 0) > 60
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, metricsData?.storage.percentUsed || 0)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-2">Limite do plano gratuito: 500 MB</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-zinc-400">Usuários Ativos (MAU)</span>
                        <Users className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="my-1">
                        <div className="text-2xl font-black text-zinc-100 flex items-baseline gap-1.5">
                          {metricsData ? metricsData.mau.activeUsers.toLocaleString('pt-BR') : '---'}
                          <span className="text-xs font-medium text-zinc-500">
                            / {metricsData ? metricsData.mau.limitUsers.toLocaleString('pt-BR') : '50.000'}
                          </span>
                        </div>
                        <div className="text-xs font-bold mt-0.5 text-indigo-400">
                          {metricsData ? `${metricsData.mau.percentUsed}% da cota mensal` : 'Aguardando...'}
                        </div>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            (metricsData?.mau.percentUsed || 0) > 85
                              ? 'bg-rose-500'
                              : (metricsData?.mau.percentUsed || 0) > 60
                              ? 'bg-amber-500'
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${Math.min(100, metricsData?.mau.percentUsed || 0)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-2">Limite mensal: 50.000 usuários ativos</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-zinc-400">Alunos no Sistema</span>
                        <Shield className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="my-1">
                        <div className="text-2xl font-black text-cyan-300 flex items-baseline gap-1.5">
                          {metricsData ? metricsData.studentsCount.toLocaleString('pt-BR') : '---'}
                          <span className="text-xs font-normal text-zinc-400">alunos</span>
                        </div>
                        <div className="text-xs font-medium mt-0.5 text-zinc-400">
                          {metricsData ? `${metricsData.teachersCount} professores/staff` : '---'}
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-3 pt-2 border-t border-zinc-800/80">
                        Contagem exata na tabela <code className="text-zinc-400">profiles</code>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-zinc-400">Total de Registros</span>
                        <Zap className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="my-1">
                        <div className="text-2xl font-black text-amber-300 flex items-baseline gap-1.5">
                          {metricsData ? metricsData.totalRows.toLocaleString('pt-BR') : '---'}
                          <span className="text-xs font-normal text-zinc-400">linhas</span>
                        </div>
                        <div className="text-xs font-medium mt-0.5 text-zinc-400">
                          Soma de todas as tabelas
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-3 pt-2 border-t border-zinc-800/80">
                        Consultas HEAD com custo zero de tráfego
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
                    <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Censo de Linhas por Tabela (Supabase PostgreSQL)</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="p-3 bg-zinc-900/90 border border-zinc-800/80 rounded-xl">
                        <div className="text-xs text-zinc-400 font-mono">profiles</div>
                        <div className="text-xl font-bold text-white mt-1">
                          {metricsData ? metricsData.tables.profiles.toLocaleString('pt-BR') : '---'}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Perfis de usuários</div>
                      </div>

                      <div className="p-3 bg-zinc-900/90 border border-zinc-800/80 rounded-xl">
                        <div className="text-xs text-zinc-400 font-mono">game_progress</div>
                        <div className="text-xl font-bold text-emerald-400 mt-1">
                          {metricsData ? metricsData.tables.game_progress.toLocaleString('pt-BR') : '---'}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Progresso nos jogos</div>
                      </div>

                      <div className="p-3 bg-zinc-900/90 border border-zinc-800/80 rounded-xl">
                        <div className="text-xs text-zinc-400 font-mono">user_cosmetics</div>
                        <div className="text-xl font-bold text-purple-400 mt-1">
                          {metricsData ? metricsData.tables.user_cosmetics.toLocaleString('pt-BR') : '---'}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Itens desbloqueados</div>
                      </div>

                      <div className="p-3 bg-zinc-900/90 border border-zinc-800/80 rounded-xl">
                        <div className="text-xs text-zinc-400 font-mono">user_achievements</div>
                        <div className="text-xl font-bold text-amber-400 mt-1">
                          {metricsData ? metricsData.tables.user_achievements.toLocaleString('pt-BR') : '---'}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Conquistas obtidas</div>
                      </div>

                      <div className="p-3 bg-zinc-900/90 border border-zinc-800/80 rounded-xl">
                        <div className="text-xs text-zinc-400 font-mono">season_history</div>
                        <div className="text-xl font-bold text-sky-400 mt-1">
                          {metricsData ? metricsData.tables.season_history.toLocaleString('pt-BR') : '---'}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">Registros históricos</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 space-y-2">
                    <h4 className="font-bold text-zinc-200 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      Políticas de Performance e Eficiência da Infraestrutura
                    </h4>
                    <p>
                      • <strong>Consultas HEAD com Consumo Zero</strong>: As métricas de monitoramento utilizam o parâmetro HTTP <code className="text-cyan-300">head: true</code> com <code className="text-cyan-300">count: 'exact'</code>. Isso significa que apenas a contagem é calculada pelo PostgreSQL, sem transferir dados de linhas pela rede (egress 0).
                    </p>
                    <p>
                      • <strong>Cache de 30 Segundos</strong>: O painel armazena os números em memória durante 30 segundos para evitar disparos concorrentes caso vários administradores acessem a aba simultaneamente.
                    </p>
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
                                await dbService.saveLegacyGameState(auth.currentUser.uid, fixed);
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
                          <Shield className="w-3.5 h-3.5 text-emerald-400" />
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

                    {/* Ações Rápidas no Perfil do Próprio Admin */}
                    {gameState && (
                      <div className="pt-2 border-t border-white/10">
                        <div className="text-[11px] font-mono text-amber-400 font-bold mb-2 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>Ações Instantâneas no Perfil Local ({userEmail || 'Admin'}):</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                          <button
                            onClick={handleUnlockAllCosmetics}
                            className="p-2 rounded-lg bg-zinc-900/80 hover:bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer flex flex-col items-center text-center gap-1"
                          >
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>Desbloquear 100% Cosméticos</span>
                          </button>
                          <button
                            onClick={handleAddMaxTokens}
                            className="p-2 rounded-lg bg-zinc-900/80 hover:bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer flex flex-col items-center text-center gap-1"
                          >
                            <Coins className="w-4 h-4 text-yellow-400" />
                            <span>+10k Tokens & Duelo</span>
                          </button>
                          <button
                            onClick={handleSetLevel100}
                            className="p-2 rounded-lg bg-zinc-900/80 hover:bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer flex flex-col items-center text-center gap-1"
                          >
                            <Trophy className="w-4 h-4 text-emerald-400" />
                            <span>Nível 100 Máximo</span>
                          </button>
                          <button
                            onClick={handleSetMaxArenaRank}
                            className="p-2 rounded-lg bg-zinc-900/80 hover:bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer flex flex-col items-center text-center gap-1"
                          >
                            <Swords className="w-4 h-4 text-rose-400" />
                            <span>Lenda Imortal Arena</span>
                          </button>
                          <button
                            onClick={handleMaxAllUpgrades}
                            className="p-2 rounded-lg bg-zinc-900/80 hover:bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer flex flex-col items-center text-center gap-1"
                          >
                            <Sliders className="w-4 h-4 text-cyan-400" />
                            <span>Upgrades Nv. 50</span>
                          </button>
                          <button
                            onClick={handleResetForTesting}
                            className="p-2 rounded-lg bg-zinc-900/80 hover:bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-bold transition cursor-pointer flex flex-col items-center text-center gap-1"
                          >
                            <RotateCcw className="w-4 h-4 text-red-400" />
                            <span>Resetar para Nv. 1</span>
                          </button>
                        </div>
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

                    <div className="space-y-2">
                      <label className="text-xs text-zinc-400 font-semibold block">
                        Selecione a conta que receberá os recursos:
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            const adminEmail = userEmail || 'wrobel.marcos@gmail.com';
                            const adminUid = auth.currentUser?.uid || null;
                            setTargetUserId(adminUid);
                            setTargetEmail(adminEmail);
                            checkTargetAccount(adminEmail, adminUid);
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
                                  setTargetUserId(null);
                                  setTargetEmail(tEmail);
                                  checkTargetAccount(tEmail, null);
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

                        <button
                          onClick={() => setShowStudentPicker(!showStudentPicker)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-750 text-sky-400 border border-sky-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>Selecionar Aluno da Escola ({studentsForPicker.length})</span>
                        </button>
                      </div>
                    </div>

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
                          {studentsForPicker.length === 0 ? (
                            <p className="text-xs text-zinc-500 py-2">Nenhum aluno com save encontrado no momento.</p>
                          ) : (
                            studentsForPicker.map((st) => (
                              <button
                                key={st.userId}
                                onClick={() => {
                                  const displayIdentifier = st.email || st.nome;
                                  setTargetUserId(st.userId);
                                  setTargetEmail(st.email || `${st.nome} (${st.turma})`);
                                  checkTargetAccount(displayIdentifier, st.userId);
                                  setShowStudentPicker(false);
                                }}
                                className="w-full text-left p-2 rounded hover:bg-zinc-800 flex items-center justify-between text-xs transition cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-base">{st.avatar || '🐧'}</span>
                                  <span className="font-bold text-white">{st.nome}</span>
                                  {st.apelido && <span className="text-zinc-400">({st.apelido})</span>}
                                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400">{st.turma}</span>
                                  {st.email && <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[150px]">{st.email}</span>}
                                </div>
                                <span className="text-emerald-400 font-mono">Nv. {st.level} • {formatBytes(st.points || 0)}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}

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

                    <div className="p-3.5 rounded-lg bg-zinc-950 border border-amber-500/30 font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400">Conta Selecionada:</span>
                          <span className="font-bold text-amber-300 text-sm">{targetEmail}</span>
                          {isLoadingAccountInfo && <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
                        </div>
                        <div>
                          {targetAccountInfo?.exists ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                              ✅ Perfil Sincronizado no Supabase {targetAccountInfo.userId ? `(${targetAccountInfo.userId.slice(0, 8)}...)` : ''}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold">
                              ⏳ Nova Conta (Será aplicada ao entrar/vincular)
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

                  {/* TESTE RÁPIDO DE DESAFIOS */}
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

                  {/* SEÇÃO 4: HISTÓRICO DE RECURSOS CONCEDIDOS */}
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

              {/* ABA: GESTÃO DE PROFESSORES */}
              {isSuperAdmin && activeTab === 'professores' && (
                <section className="space-y-4 max-w-xl mx-auto">
                  <div className="flex items-center gap-2 text-sky-400 font-bold border-b border-sky-900/50 pb-2">
                    <Users className="w-5 h-5" />
                    <h3>Acesso de Professores</h3>
                  </div>

                  <p className="text-sm text-zinc-400">
                    Insira o email Google de outros professores. Eles terão acesso ao Painel Pedagógico para gerar Códigos de Sessão, visualizar o Progresso dos Alunos e lançar Corridas e Raids da Turma.
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
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-lg transition cursor-pointer"
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
                        {settings.allowedTeachers.map((email) => (
                          <li key={email} className="p-4 flex items-center justify-between">
                            <span className="text-sm font-mono text-zinc-300">{email}</span>
                            <button
                              onClick={() => handleRemoveTeacher(email)}
                              disabled={isUpdatingTeachers}
                              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
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

              {/* ABA: ZONA DE PERIGO (WIPE) */}
              {isSuperAdmin && activeTab === 'wipe' && (
                <section className="space-y-4 max-w-xl mx-auto">
                  <div className="flex items-center gap-2 text-red-400 font-bold border-b border-red-900/50 pb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <h3>Zona de Perigo (Wipe do Banco de Dados)</h3>
                  </div>

                  <div className="space-y-2 text-sm text-zinc-400">
                    <p>
                      Esta ação irá reiniciar o progresso de <strong>TODOS OS ALUNOS</strong>, limpando as tabelas do Supabase (<code className="text-red-300">game_sessions</code>, <code className="text-red-300">season_history</code>, <code className="text-red-300">game_progress</code>, <code className="text-red-300">user_cosmetics</code>, <code className="text-red-300">user_achievements</code>) e zerando bytes e pontuações na tabela <code className="text-red-300">profiles</code>.
                    </p>
                    <p>
                      Para evitar inconsistências ou dados fantasmas, também realizará a limpeza sincronizada das coleções legadas do Firestore (<code className="text-zinc-300">saves</code>, <code className="text-zinc-300">leaderboard</code>).
                    </p>
                    <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                      <Shield className="w-4 h-4 flex-shrink-0 text-amber-400" />
                      <span>As contas de <strong>professores e administradores</strong> serão preservadas com acesso intacto.</span>
                    </div>
                  </div>

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
                      className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-5 h-5" />
                      {wipeStatus === 'loading' ? 'APAGANDO DADOS...' : 'WIPE SINCRONIZADO (SUPABASE + FIRESTORE)'}
                    </button>

                    {wipeStatus === 'success' && (
                      <div className="text-emerald-400 text-center text-sm font-bold">
                        Banco de dados Supabase e registros legados limpos com sucesso.
                      </div>
                    )}
                    {wipeStatus === 'error' && (
                      <div className="text-red-400 text-center text-sm font-bold">
                        Erro ao apagar banco de dados.
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
