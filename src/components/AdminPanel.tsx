import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, Trash2, X, Clock, AlertTriangle, Users, Search, RefreshCw, BarChart, Database, Download, Upload, CheckCircle2, RotateCcw, FileText, Sliders, Battery, EyeOff, Filter, Swords, Sparkles, Coins, Zap, Trophy, Award, UserCheck, Plus, History, Gift, ArrowRight, Check, Terminal } from 'lucide-react';
import {
  generateSessionCode,
  clearSessionCode,
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
  TestGrantConfig
} from '../services/firebaseService';
import { SCHOOL_CLASSES_CONFIG } from './StudentModal';
import { sound } from '../utils/audio';
import { formatBytes, calculatePlayerRank } from '../utils/formatting';
import { ALL_LEVELS, calculateMinBytesForLevel } from '../data/levels';
import { GameState } from '../types';
import { DEFAULT_COSMETICS } from '../types/cosmetics';
import { getAllUnlockedCosmetics } from '../constants/cosmeticsCatalog';

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
  onTriggerChallenge
}) => {
  const [activeTab, setActiveTab] = useState<'locks' | 'dashboard' | 'backups' | 'wipe' | 'professores' | 'testes'>('locks');
  const [testActionMessage, setTestActionMessage] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [wipeConfirm, setWipeConfirm] = useState('');
  const [wipeStatus, setWipeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [students, setStudents] = useState<LeaderboardEntry[]>([]);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [searchTurma, setSearchTurma] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('todas');
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [isUpdatingTeachers, setIsUpdatingTeachers] = useState(false);

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

    // Se for o próprio admin logado
    if (userEmail && clean === userEmail.trim().toLowerCase() && gameState) {
      const rank = calculatePlayerRank(gameState.totalBytesEarned || 0);
      setTargetAccountInfo({
        exists: true,
        name: gameState.studentName || 'Você (Admin)',
        turma: gameState.studentClass || 'Administração',
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
        const bytes = save.data.saveState?.totalBytesEarned || save.data.points || 0;
        const rank = calculatePlayerRank(bytes);
        setTargetAccountInfo({
          exists: true,
          name: save.data.nome || save.data.apelido || clean.split('@')[0],
          turma: save.data.turma || 'Sem turma',
          currentLevel: rank.level,
          currentBytes: bytes,
          levelTokens: save.data.saveState?.cosmetics?.levelTokens || 0,
          duelTokens: save.data.saveState?.cosmetics?.duelTokens || 0
        });
      } else {
        setTargetAccountInfo({
          exists: false,
          name: clean.split('@')[0],
          turma: 'Conta nova (receberá ao logar)',
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
      } else if (activeTab === 'testes') {
        checkTargetAccount(targetEmail);
        if (students.length === 0) loadStudents('todas');
      }
    }
  }, [isOpen, activeTab, selectedClassFilter, targetEmail]);

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
    setIsLoading(true);
    try {
      await generateSessionCode(hours);
      await loadSettings();
      sound.playPrestige();
    } catch (e) {
      alert("Erro ao gerar código");
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
            className="w-full max-w-4xl bg-zinc-950 border border-purple-500/50 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col overflow-hidden max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-purple-950/20">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Painel Administrativo</h2>
              </div>
              
              <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                <button
                  onClick={() => setActiveTab('locks')}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === 'locks' ? 'bg-purple-600/30 text-purple-300' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Key className="w-4 h-4" />
                  Sessões
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-purple-600/30 text-purple-300' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <BarChart className="w-4 h-4" />
                  Progresso
                </button>
                <button
                  onClick={() => setActiveTab('backups')}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === 'backups' ? 'bg-emerald-600/30 text-emerald-300' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Backups e Restauração de Segurança"
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  Backups
                </button>
                <button
                  onClick={() => setActiveTab('testes')}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === 'testes' ? 'bg-amber-600/30 text-amber-300' : 'text-zinc-500 hover:text-zinc-300'}`}
                  title="Recursos de Teste e Desbloqueio Rápido (ADM)"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Testes ADM
                </button>
                {isSuperAdmin && (
                  <>
                    <button
                      onClick={() => setActiveTab('professores')}
                      className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === 'professores' ? 'bg-sky-600/30 text-sky-300' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      <Users className="w-4 h-4" />
                      Professores
                    </button>
                    <button
                      onClick={() => setActiveTab('wipe')}
                      className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === 'wipe' ? 'bg-red-600/30 text-red-300' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Wipe
                    </button>
                  </>
                )}
              </div>

              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-zinc-400 transition">
                <X className="w-5 h-5" />
              </button>
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

                  <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Status da Aula</div>
                      {isActive ? (
                        <div>
                          <div className="text-3xl font-black text-emerald-400 tracking-widest">{settings?.activeCode}</div>
                          <div className="text-xs text-emerald-500/70 mt-1 flex items-center gap-1">
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
                        className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/20"
                      >
                        Encerrar
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleGenerateCode(1)} disabled={isLoading} className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition disabled:opacity-50">
                      Gerar (1 Hora)
                    </button>
                    <button onClick={() => handleGenerateCode(2)} disabled={isLoading} className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition disabled:opacity-50">
                      Gerar (2 Horas)
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
                        <span>{isStudentsLoading ? 'Atualizando...' : 'Atualizar Dados da Turma'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
                    <table className="w-full text-left text-sm text-zinc-400">
                      <thead className="bg-zinc-900 text-zinc-300 uppercase font-bold text-xs">
                        <tr>
                          <th className="px-4 py-3 border-b border-zinc-800 rounded-tl-xl">Aluno</th>
                          <th className="px-4 py-3 border-b border-zinc-800">Turma</th>
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
                            <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                              <div className="flex items-center justify-center gap-2">
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Carregando dados...
                              </div>
                            </td>
                          </tr>
                        ) : filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
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
                              <td className="px-4 py-3 font-mono font-bold text-emerald-400">{s.turma || '-'}</td>
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
                          <span className="text-[10px] text-zinc-400 block truncate">{targetAccountInfo?.turma || 'Sem turma'}</span>
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
                        {[10, 20, 30, 50, 100].map((lvl) => (
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
