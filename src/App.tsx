import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, CategoryId, FloatingText, UpgradeDef } from './types';
import { loadSavedState, saveState, clearSavedState, INITIAL_STATE, sanitizeCosmetics, DEFAULT_ARENA_STATS } from './utils/storage';
import { DEFAULT_COSMETICS, PlayerCosmetics } from './types/cosmetics';
import { TERMINAL_THEMES } from './constants/themes';
import { CosmeticsShopModal } from './components/CosmeticsShopModal';
import { getRandomWord, WORD_CATEGORIES } from './data/words';
import { UPGRADES, getUpgradeCost } from './data/upgrades';
import { sound } from './utils/audio';
import { audioSynthesizer } from './services/audioSynthesizer';
import { GameLayoutWrapper } from './components/layouts/GameLayoutWrapper';
import { FooterHelpBar } from './components/FooterHelpBar';
import { combineAccent, isAccentKey, resolveDeadKey } from './utils/keyboardAccents';
import { Header } from './components/Header';
import { StatsSidebar } from './components/StatsSidebar';
import { TypingArena } from './components/TypingArena';
import { ShopPanel } from './components/ShopPanel';
import { MetricsModal } from './components/MetricsModal';
import { PrestigeModal } from './components/PrestigeModal';
import { StudentModal } from './components/StudentModal';
import { LevelsModal } from './components/LevelsModal';
import { HelpModal } from './components/HelpModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ArenaModal } from './components/ArenaModal';
import { ArenaStats, getArenaRank } from './types/arena';
import { AdminPanel } from './components/AdminPanel';
import { SessionLockOverlay } from './components/SessionLockOverlay';
import { LevelUpOverlay } from './components/LevelUpOverlay';
import { PauseOverlay } from './components/PauseOverlay';
import { ChallengeArena } from './components/ChallengeArena';
import { QuantumConverterModal } from './components/QuantumConverterModal';
import { calculatePlayerRank, formatBytes } from './utils/formatting';
import { auth, loginWithGoogle, logoutUser, subscribeToAuthChanges, loadProgressFromCloud, saveProgressToCloud, checkIsAdminAsync, checkIsSuperAdmin, getSystemSettings, subscribeToSystemSettings, claimPendingTestGrants } from './services/firebaseService';
import { isCategoryAllowed, getMinAllowedCategoryLevel } from './utils/difficulty';
import { useGameSync } from './hooks/useGameSync';
import { Loader2 } from 'lucide-react';

export default function App() {
  const suppressLevelUpRef = useRef<boolean>(true);
  const [state, setState] = useState<GameState>(() => loadSavedState());
  const [currentWord, setCurrentWord] = useState<string>(() => getRandomWord(state.selectedCategory));
  const [charIndex, setCharIndex] = useState<number>(0);
  const [isErrorShaking, setIsErrorShaking] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [isMetricsOpen, setIsMetricsOpen] = useState<boolean>(false);
  const [isPrestigeOpen, setIsPrestigeOpen] = useState<boolean>(false);
  const [isLevelsModalOpen, setIsLevelsModalOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false);
  const [isCosmeticsOpen, setIsCosmeticsOpen] = useState<boolean>(false);
  const [isArenaOpen, setIsArenaOpen] = useState<boolean>(false);
  const [isConverterOpen, setIsConverterOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeChallengeLevel, setActiveChallengeLevel] = useState<number | null>(null);
  
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAppLocked, setIsAppLocked] = useState<boolean>(true);
  const [isVerifyingLock, setIsVerifyingLock] = useState<boolean>(false);

  const [user, setUser] = useState(auth.currentUser);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [systemSettingsState, setSystemSettingsState] = useState<any>(null);

  // Verificação da Trava Escolar
  const handleUnlockCode = async (code: string): Promise<boolean> => {
    setIsVerifyingLock(true);
    try {
      const settings = await getSystemSettings();
      const active = settings?.activeCode && settings?.expiresAt && new Date(settings.expiresAt) > new Date();
      if (active && settings.activeCode === code) {
        localStorage.setItem('school_session_unlock', settings.expiresAt);
        localStorage.setItem('school_session_code', code);
        setIsAppLocked(false);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      setIsVerifyingLock(false);
    }
  };
  
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      const adminStatus = await checkIsAdminAsync(currentUser);
      setIsAdmin(adminStatus);
      setAuthLoading(false);
      
      if (currentUser) {
        // Try to load state from cloud automatically upon login
        const res = await loadProgressFromCloud();
        if (res.success && res.saveState) {
          const loadedNickname = res.saveState.studentNickname || '';
          const loadedClass = res.saveState.studentClass || '';
          const loadedState: GameState = {
            ...INITIAL_STATE,
            ...res.saveState,
            studentName: currentUser.displayName || res.saveState.studentName || 'Aluno',
            studentNickname: loadedNickname,
            studentClass: loadedClass,
            cosmetics: sanitizeCosmetics(res.saveState.cosmetics),
            arenaStats: res.saveState.arenaStats || INITIAL_STATE.arenaStats
          };
          let finalState = loadedState;
          if (currentUser.email) {
            try {
              const grantRes = await claimPendingTestGrants(currentUser.email, finalState);
              if (grantRes.claimed && grantRes.updatedState) {
                finalState = grantRes.updatedState;
                await saveProgressToCloud(finalState);
              }
            } catch (e) {
              console.error('Error claiming pending test grants:', e);
            }
          }

          setState(finalState);
          saveState(finalState, currentUser.uid);
          setCharIndex(0);
          setCurrentWord(getRandomWord(finalState.selectedCategory || INITIAL_STATE.selectedCategory));
          
          // Se ainda não definiu apelido ou turma, abre o modal para configurar
          if (!loadedNickname || !loadedClass) {
            setIsStudentModalOpen(true);
          }
        } else {
          // Se falhou ao carregar da nuvem (ex: offline), tenta recuperar do save local isolado do aluno
          const localState = loadSavedState(currentUser.uid);
          const hasLocalData = localState.totalBytesEarned > 0 || (localState.studentNickname && localState.studentNickname.trim() !== '');

          let activeState: GameState;
          if (hasLocalData) {
            activeState = {
              ...localState,
              studentName: currentUser.displayName || localState.studentName || 'Aluno'
            };
          } else {
            activeState = {
              ...INITIAL_STATE,
              studentName: currentUser.displayName || 'Aluno'
            };
            // Primeiro acesso do aluno: abre modal para escolher apelido e turma
            setIsStudentModalOpen(true);
          }

          if (currentUser.email) {
            try {
              const grantRes = await claimPendingTestGrants(currentUser.email, activeState);
              if (grantRes.claimed && grantRes.updatedState) {
                activeState = grantRes.updatedState;
                await saveProgressToCloud(activeState);
              }
            } catch (e) {
              console.error('Error claiming pending test grants:', e);
            }
          }

          setState(activeState);
          saveState(activeState, currentUser.uid);
          setCharIndex(0);
          setCurrentWord(getRandomWord(activeState.selectedCategory || INITIAL_STATE.selectedCategory));
        }
      } else {
        setState({ ...INITIAL_STATE });
        setCharIndex(0);
        setCurrentWord(getRandomWord(INITIAL_STATE.selectedCategory));
        clearSavedState();
        try {
          sessionStorage.removeItem('typeclicker_student_confirmed');
        } catch (e) {}
      }
      setTimeout(() => {
        suppressLevelUpRef.current = false;
      }, 500);
    });
    return () => unsubscribe();
  }, []);

  // Monitora a sessão globalmente em tempo real
  useEffect(() => {
    if (isAdmin) {
      setIsAppLocked(false);
      return;
    }

    const unsubSettings = subscribeToSystemSettings((settings) => {
      setSystemSettingsState(settings);
      const active = settings?.activeCode && settings?.expiresAt && new Date(settings.expiresAt) > new Date();
      
      if (active) {
        // Aula ativa no servidor: verificar se o aluno já destravou com este MESMO código
        const localCode = localStorage.getItem('school_session_code');
        const localUnlock = localStorage.getItem('school_session_unlock');
        
        if (localCode === settings.activeCode && localUnlock) {
          const unlockTime = new Date(localUnlock);
          if (unlockTime > new Date()) {
            setIsAppLocked(false);
            return;
          }
        }
        // Se mudou o código ou expirou o local, trava o app (força a tela de senha)
        setIsAppLocked(true);
      } else {
        // Nenhuma aula ativa (professor encerrou a sessão)
        setIsAppLocked(true);
        localStorage.removeItem('school_session_unlock');
        localStorage.removeItem('school_session_code');
      }
    });

    return () => unsubSettings();
  }, [isAdmin]);

  const [isSavedRecently, setIsSavedRecently] = useState<boolean>(false);
  const [pendingAccent, setPendingAccent] = useState<string | null>(null);
  const [recentWordComplete, setRecentWordComplete] = useState<boolean>(false);
  const [recentUpgradeBought, setRecentUpgradeBought] = useState<string | null>(null);

  // Focus Cadence Timer & Overload Mechanics (Pedagogical progression)
  const maxFocusBuffer = systemSettingsState?.focusTimeoutSetting !== undefined ? systemSettingsState.focusTimeoutSetting : 5.0;
  const isReducedAlerts = !!systemSettingsState?.reducedAlerts;

  const [focusBufferSeconds, setFocusBufferSeconds] = useState<number>(5.0);
  const [isDraining, setIsDraining] = useState<boolean>(false);
  const [consecutiveErrors, setConsecutiveErrors] = useState<number>(0);
  const [isOverloaded, setIsOverloaded] = useState<boolean>(false);
  const [overloadRecoveryCount, setOverloadRecoveryCount] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Hook central de sincronização inteligente com Throttling e Buffer Offline (Cota Spark: 60s)
  const {
    isSyncing,
    hasPendingChanges,
    isOnline,
    syncNow,
    triggerImmediateSync
  } = useGameSync({
    user,
    state,
    throttleIntervalMs: 60000,
    onSyncSuccess: () => {
      setIsSavedRecently(true);
      setTimeout(() => setIsSavedRecently(false), 800);
    },
    onSyncError: (msg) => {
      console.warn('Erro de sincronização:', msg);
    }
  });

  // Keep stateRef in sync to avoid stale closures in event listeners and intervals
  const stateRef = useRef(state);
  stateRef.current = state;

  const maxFocusBufferRef = useRef<number>(5.0);
  maxFocusBufferRef.current = maxFocusBuffer;

  const isPausedRef = useRef<boolean>(false);
  isPausedRef.current = isPaused;

  const focusBufferRef = useRef<number>(5.0);
  focusBufferRef.current = focusBufferSeconds;

  const isDrainingRef = useRef<boolean>(false);
  isDrainingRef.current = isDraining;

  const consecutiveErrorsRef = useRef<number>(0);
  consecutiveErrorsRef.current = consecutiveErrors;

  const isOverloadedRef = useRef<boolean>(false);
  isOverloadedRef.current = isOverloaded;

  const overloadRecoveryRef = useRef<number>(0);
  overloadRecoveryRef.current = overloadRecoveryCount;

  const lastDrainSoundRef = useRef<number>(0);

  const currentWordRef = useRef(currentWord);
  currentWordRef.current = currentWord;

  const charIndexRef = useRef(charIndex);
  charIndexRef.current = charIndex;

  const pendingAccentRef = useRef<string | null>(null);
  pendingAccentRef.current = pendingAccent;

  const typingInputRef = useRef<HTMLInputElement>(null);

  // Sync sound engine preference
  useEffect(() => {
    sound.setEnabled(state.soundEnabled);
  }, [state.soundEnabled]);

  // Spawn floating feedback particle
  const spawnFloatingText = useCallback((text: string, type: 'success' | 'error' | 'bonus' | 'level') => {
    const id = Date.now() + Math.random();
    const x = 50 + (Math.random() * 20 - 10);
    const y = 45 + (Math.random() * 10 - 5);
    setFloatingTexts((prev) => [...prev.slice(-8), { id, text, x, y, type }]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 900);
  }, []);

  // Centralized pause toggling with audio and feedback
  const handleTogglePause = useCallback(() => {
    setIsPaused((p) => {
      const next = !p;
      if (next) sound.playPause();
      else sound.playResume();
      return next;
    });
  }, []);

  const handlePauseGame = useCallback(() => {
    setIsPaused((prev) => {
      if (!prev) sound.playPause();
      return true;
    });
  }, []);

  const handleResumeGame = useCallback(() => {
    setIsPaused((prev) => {
      if (prev) sound.playResume();
      return false;
    });
  }, []);

  // Global keyboard shortcut to pause or resume STRICTLY with Esc or Pause key anywhere on the page
  // (Ignoring when typing inside text inputs, textareas or when modal dialogs are open)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' && e.code !== 'Pause') {
        return;
      }

      // Se houver acento pendente (tecla morta ABNT2 como ~, ´, ^), o Escape cancela o acento e NÃO altera a pausa
      if (pendingAccentRef.current) {
        e.preventDefault();
        setPendingAccent(null);
        return;
      }

      // If user is inside a real text input/textarea (like student modal, admin panel, etc.), don't intercept
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTypingEngineInput = target?.id === 'typing-engine-input';
      
      if (tag === 'textarea' || (tag === 'input' && !isTypingEngineInput) || target?.isContentEditable) {
        return;
      }

      // If any major modal is active, allow Esc to close modal natively (handled by modals)
      if (
        isMetricsOpen ||
        isPrestigeOpen ||
        isLevelsModalOpen ||
        isHelpOpen ||
        isLeaderboardOpen ||
        isStudentModalOpen ||
        isCosmeticsOpen ||
        isArenaOpen ||
        isConverterOpen ||
        isAdminOpen ||
        activeChallengeLevel !== null ||
        (isAppLocked && !isAdmin)
      ) {
        return;
      }

      e.preventDefault();
      handleTogglePause();
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    handleTogglePause,
    isMetricsOpen,
    isPrestigeOpen,
    isLevelsModalOpen,
    isHelpOpen,
    isLeaderboardOpen,
    isStudentModalOpen,
    isCosmeticsOpen,
    isArenaOpen,
    isConverterOpen,
    isAdminOpen,
    activeChallengeLevel,
    isAppLocked,
    isAdmin
  ]);

  // Recalculate base rates from purchased upgrades
  const computeBaseRates = useCallback((upgrades: Record<string, number>) => {
    let activeBonus = 0;
    let passiveBonus = 0;

    UPGRADES.forEach((u) => {
      const count = upgrades[u.id] || 0;
      if (count > 0) {
        if (u.type === 'active') activeBonus += u.value * count;
        if (u.type === 'passive') passiveBonus += u.value * count;
      }
    });

    return {
      bytesPerChar: 1 + activeBonus,
      autoBytesPerSec: passiveBonus
    };
  }, []);

  // Category change
  const handleSelectCategory = useCallback((cat: CategoryId) => {
    setState((prev) => ({ ...prev, selectedCategory: cat }));
    const nextWord = getRandomWord(cat, currentWordRef.current);
    setCurrentWord(nextWord);
    setCharIndex(0);
    setPendingAccent(null);
  }, []);

  // Processador central de caracteres digitados (com suporte a acentos ABNT2 e composição)
  const handleTypeChar = useCallback((rawChar: string) => {
    if (isPausedRef.current) return;

    let finalChar = rawChar;
    const currentPending = pendingAccentRef.current;

    // Se havia acento pendente, combina com a vogal (ou cedilha)
    if (currentPending) {
      finalChar = combineAccent(currentPending, rawChar);
      setPendingAccent(null);
    }

    const typedChar = finalChar.toLocaleLowerCase('pt-BR');
    const word = currentWordRef.current;
    const index = charIndexRef.current;
    const expectedChar = (word[index] || '').toLocaleLowerCase('pt-BR');

    if (!expectedChar) return;

    const currState = stateRef.current;
    const prestigeMult = 1 + currState.prestigeCores * 0.2;

    if (typedChar === expectedChar) {
      // --- HIT (CORRECT KEY) ---
      // Restore Cadence Buffer
      const targetBuffer = maxFocusBufferRef.current === 0 ? 0 : (maxFocusBufferRef.current || 5.0);
      focusBufferRef.current = targetBuffer;
      setFocusBufferSeconds(targetBuffer);
      if (isDrainingRef.current) {
        isDrainingRef.current = false;
        setIsDraining(false);
        spawnFloatingText('BUFFER RESTAURADO! 🟢', 'success');
      }

      // Check Overload state recovery (requires 3 consecutive correct hits)
      let currentOverloaded = isOverloadedRef.current;
      if (currentOverloaded) {
        const nextRecovery = overloadRecoveryRef.current + 1;
        overloadRecoveryRef.current = nextRecovery;
        setOverloadRecoveryCount(nextRecovery);
        if (nextRecovery >= 3) {
          setIsOverloaded(false);
          isOverloadedRef.current = false;
          setOverloadRecoveryCount(0);
          overloadRecoveryRef.current = 0;
          setConsecutiveErrors(0);
          consecutiveErrorsRef.current = 0;
          currentOverloaded = false;
          spawnFloatingText('CIRCUITO ESTABILIZADO! ⚡', 'success');
        }
      } else {
        setConsecutiveErrors(0);
        consecutiveErrorsRef.current = 0;
      }

      const nextCombo = currState.comboStreak + 1;
      const nextMaxCombo = Math.max(currState.maxCombo, nextCombo);

      let nextMultiplier = currentOverloaded ? 0.5 : currState.multiplier;
      if (!currentOverloaded && nextCombo % 5 === 0 && nextMultiplier < 5.0) {
        nextMultiplier = Math.min(5.0, Number((nextMultiplier + 0.2).toFixed(1)));
      }

      // Fator de Dificuldade selecionada (Iniciante 1.0x até Expert 2.5x)
      const activeCategory = WORD_CATEGORIES.find((c) => c.id === currState.selectedCategory) || WORD_CATEGORIES[0];
      const diffBonusMultiplier = activeCategory.bonusMultiplier || 1.0;

      const earned = Math.max(1, Math.round(currState.bytesPerChar * nextMultiplier * prestigeMult * diffBonusMultiplier));
      const activeSoundTheme = currState.cosmetics?.equippedSound || 'mechanical';
      sound.playKeyStroke(nextCombo, activeSoundTheme);
      audioSynthesizer.playKeySound(activeSoundTheme, nextCombo);

      const isWordFinished = index + 1 >= word.length;

      if (isWordFinished) {
        // Word completed bonus escalado com o tamanho da palavra e equilibrado
        const baseWordBonus = Math.round(word.length * (currState.bytesPerChar * 1.5 + 4) * nextMultiplier * prestigeMult);
        const wordBonus = Math.round(baseWordBonus * diffBonusMultiplier);
        const totalEarned = earned + wordBonus;

        sound.playWordComplete();
        const bonusMsg = diffBonusMultiplier > 1.0
          ? `+${wordBonus} BÔNUS [${activeCategory.name.toUpperCase()}]!`
          : `+${wordBonus} BÔNUS DE PALAVRA!`;
        spawnFloatingText(bonusMsg, 'bonus');

        setRecentWordComplete(true);
        setTimeout(() => setRecentWordComplete(false), 1200);

        setState((prev) => ({
          ...prev,
          bytes: prev.bytes + totalEarned,
          totalBytesEarned: prev.totalBytesEarned + totalEarned,
          correctKeys: prev.correctKeys + 1,
          comboStreak: nextCombo,
          maxCombo: nextMaxCombo,
          multiplier: nextMultiplier,
          wordsCompleted: prev.wordsCompleted + 1
        }));

        // Pick next word
        const newWord = getRandomWord(currState.selectedCategory, word);
        setCurrentWord(newWord);
        setCharIndex(0);
        setPendingAccent(null);
      } else {
        // Advance letter
        setState((prev) => ({
          ...prev,
          bytes: prev.bytes + earned,
          totalBytesEarned: prev.totalBytesEarned + earned,
          correctKeys: prev.correctKeys + 1,
          comboStreak: nextCombo,
          maxCombo: nextMaxCombo,
          multiplier: nextMultiplier
        }));
        setCharIndex(index + 1);
      }
    } else {
      // --- MISS (ERROR) ---
      const nextErrors = consecutiveErrorsRef.current + 1;
      consecutiveErrorsRef.current = nextErrors;
      setConsecutiveErrors(nextErrors);
      setOverloadRecoveryCount(0);
      overloadRecoveryRef.current = 0;

      setIsErrorShaking(true);
      setTimeout(() => setIsErrorShaking(false), 380);

      let bytesLost = 0;
      if (nextErrors === 1) {
        // 1º Erro: perda suave de bytes proporcional à força atual
        sound.playError();
        bytesLost = Math.max(1, Math.round(currState.bytesPerChar * 1.5));
        spawnFloatingText(`-${bytesLost} B (Erro)`, 'error');
      } else if (nextErrors === 2) {
        // 2º Erro consecutivo: penalidade moderada
        sound.playError();
        bytesLost = Math.max(5, Math.round(currState.bytesPerChar * 3.5) + Math.round(currState.bytes * 0.005));
        spawnFloatingText(`⚠️ -${bytesLost} B (2 Erros Seguidos)`, 'error');
      } else {
        // 3º Erro consecutivo ou mais: SOBRECARGA / GLITCH NO CIRCUITO
        sound.playGlitch();
        bytesLost = Math.max(15, Math.round(currState.bytesPerChar * 8) + Math.round(currState.bytes * 0.02));
        setIsOverloaded(true);
        isOverloadedRef.current = true;
        spawnFloatingText(`⚡ SOBRECARGA! -${bytesLost} B`, 'error');
      }

      setState((prev) => ({
        ...prev,
        bytes: Math.max(0, prev.bytes - bytesLost),
        wrongKeys: prev.wrongKeys + 1,
        comboStreak: 0,
        multiplier: nextErrors >= 3 ? 0.5 : 1.0
      }));
    }
  }, [spawnFloatingText]);

  const handleDeadKey = useCallback((accent: string) => {
    if (isPausedRef.current) return;
    setPendingAccent(accent);
  }, []);

  const handleClearPendingAccent = useCallback(() => {
    setPendingAccent(null);
  }, []);

  // Global keydown typing listener (ABNT2 Linux fallback)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Se estiver em pausa, a digitação fica suspensa (Escape para despausar é gerido pelo listener unificado)
      if (isPausedRef.current) {
        return;
      }

      // Se o evento vier do input invisível da arena principal, ele mesmo processa via onInput/onKeyDown
      if (e.target === typingInputRef.current) {
        return;
      }

      // Não captura digitação do jogo base se a Arena 1x1 ou outros modais estiverem abertos
      if (
        isArenaOpen ||
        isMetricsOpen ||
        isPrestigeOpen ||
        isLevelsModalOpen ||
        isHelpOpen ||
        isLeaderboardOpen ||
        isStudentModalOpen ||
        isCosmeticsOpen ||
        isConverterOpen ||
        isAdminOpen ||
        activeChallengeLevel !== null
      ) {
        return;
      }

      // Não captura quando o usuário estiver digitando em campos de formulário (ex: nome do aluno)
      const targetElement = e.target as HTMLElement | null;
      const tag = targetElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || targetElement?.isContentEditable) {
        return;
      }

      // Teclas de pausa (Escape / Pause): já processadas de forma unificada no handleGlobalKeyDown
      if (e.key === 'Escape' || e.code === 'Pause') {
        return;
      }

      if (e.key === 'Backspace') {
        if (pendingAccentRef.current) {
          e.preventDefault();
          setPendingAccent(null);
        }
        return;
      }

      // Tratamento de teclas mortas (Dead) ou acentos isolados
      if (e.key === 'Dead' || isAccentKey(e.key)) {
        const word = currentWordRef.current;
        const index = charIndexRef.current;
        const resolved = resolveDeadKey(e, word[index]);
        if (resolved) {
          setPendingAccent(resolved);
        }
        return;
      }

      // Ignora teclas de controle e funções
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.key === 'Shift' ||
        e.key === 'Control' ||
        e.key === 'Alt' ||
        e.key === 'AltGraph' ||
        e.key === 'CapsLock' ||
        e.key === 'Tab' ||
        e.key.startsWith('Arrow') ||
        (e.key.startsWith('F') && e.key.length > 1)
      ) {
        return;
      }

      // Caractere imprimível único ou espaço
      if (e.key.length !== 1 && e.key !== 'Space') return;

      const rawChar = e.key === ' ' || e.key === 'Space' ? ' ' : e.key;
      handleTypeChar(rawChar);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleTypeChar,
    isArenaOpen,
    isMetricsOpen,
    isPrestigeOpen,
    isLevelsModalOpen,
    isHelpOpen,
    isLeaderboardOpen,
    isStudentModalOpen,
    isCosmeticsOpen,
    isConverterOpen,
    isAdminOpen,
    activeChallengeLevel
  ]);

  // 100ms Interval: Cadence Buffer & Idle/Draining Tick Loop
  useEffect(() => {
    let tickCounter = 0;

    const idleTimer = setInterval(() => {
      if (isPausedRef.current) return;

      tickCounter++;
      const currentBuffer = focusBufferRef.current;
      const curr = stateRef.current;
      const isUnlimitedBuffer = maxFocusBufferRef.current === 0;

      // Se o modo inclusivo (sem limite) estiver ativo, gera passivo continuamente sem dreno
      if (isUnlimitedBuffer) {
        if (curr.autoBytesPerSec > 0) {
          const prestigeMult = 1 + curr.prestigeCores * 0.2;
          const tickBytes = (curr.autoBytesPerSec * 0.1) * prestigeMult;

          setState((prev) => ({
            ...prev,
            bytes: prev.bytes + tickBytes,
            totalBytesEarned: prev.totalBytesEarned + tickBytes
          }));
        }
        return;
      }

      if (currentBuffer > 0) {
        const nextBuffer = Math.max(0, Number((currentBuffer - 0.1).toFixed(1)));
        focusBufferRef.current = nextBuffer;
        setFocusBufferSeconds(nextBuffer);

        if (nextBuffer === 0) {
          isDrainingRef.current = true;
          setIsDraining(true);
        }

        // Active typing: passive generation functions normally
        if (curr.autoBytesPerSec > 0) {
          const prestigeMult = 1 + curr.prestigeCores * 0.2;
          const tickBytes = (curr.autoBytesPerSec * 0.1) * prestigeMult;

          setState((prev) => ({
            ...prev,
            bytes: prev.bytes + tickBytes,
            totalBytesEarned: prev.totalBytesEarned + tickBytes
          }));
        }
      } else {
        // BUFFER EXHAUSTED: Idle drain active!
        // Drains bytes once per second (every 10 ticks = 1s)
        if (tickCounter % 10 === 0) {
          const drainRate = Math.max(1, Math.round(curr.bytesPerChar * 1.2) + Math.round(curr.bytes * 0.003));
          if (curr.bytes > 0) {
            const actualDrain = Math.min(curr.bytes, drainRate);
            setState((prev) => ({
              ...prev,
              bytes: Math.max(0, prev.bytes - actualDrain)
            }));

            // Play drain tick audio (throttled every 2s)
            const now = Date.now();
            if (now - lastDrainSoundRef.current > 2000) {
              sound.playDrainTick();
              lastDrainSoundRef.current = now;
            }
          }
        }
      }
    }, 100);

    return () => clearInterval(idleTimer);
  }, []);

  // 1000ms Interval: Active practice time tracker
  useEffect(() => {
    const secTimer = setInterval(() => {
      if (isPausedRef.current || isDrainingRef.current) return;
      setState((prev) => ({
        ...prev,
        totalActiveSeconds: prev.totalActiveSeconds + 1
      }));
    }, 1000);

    return () => clearInterval(secTimer);
  }, []);

  // Auto-save to localStorage periodically (every 2.5s)
  useEffect(() => {
    const saveTimer = setInterval(() => {
      saveState(stateRef.current);
      setIsSavedRecently(true);
      setTimeout(() => setIsSavedRecently(false), 800);
    }, 2500);

    return () => clearInterval(saveTimer);
  }, []);

  // Buy upgrade action
  const handleBuyUpgrade = useCallback((upgrade: UpgradeDef) => {
    const curr = stateRef.current;
    const currentCount = curr.upgrades[upgrade.id] || 0;
    const cost = getUpgradeCost(upgrade, currentCount);

    if (curr.bytes >= cost) {
      sound.playUpgrade();
      const nextUpgrades = {
        ...curr.upgrades,
        [upgrade.id]: currentCount + 1
      };
      const { bytesPerChar, autoBytesPerSec } = computeBaseRates(nextUpgrades);

      setState((prev) => ({
        ...prev,
        bytes: prev.bytes - cost,
        upgrades: nextUpgrades,
        bytesPerChar,
        autoBytesPerSec
      }));

      setRecentUpgradeBought(upgrade.name);
      setTimeout(() => setRecentUpgradeBought(null), 2500);

      spawnFloatingText(`+NÍVEL: ${upgrade.name}`, 'level');
    }
  }, [computeBaseRates, spawnFloatingText]);

  // Prestige confirm action
  const handleConfirmPrestige = useCallback((newCores: number) => {
    if (newCores <= 0) return;

    sound.playPrestige();

    setState((prev) => {
      const nextCores = prev.prestigeCores + newCores;
      return {
        ...prev,
        bytes: 0,
        comboStreak: 0,
        multiplier: 1.0,
        upgrades: {},
        bytesPerChar: 1,
        autoBytesPerSec: 0,
        prestigeCores: nextCores,
        prestigeCount: prev.prestigeCount + 1
      };
    });

    setIsPrestigeOpen(false);
    spawnFloatingText(`OVERCLOCK ATIVADO! +${newCores} NÚCLEOS`, 'bonus');
    if (user) {
      setTimeout(() => {
        syncNow('overclock').catch(() => {});
      }, 50);
    }
  }, [spawnFloatingText, user, syncNow]);

  // Reset entire game
  const handleResetGame = useCallback(() => {
    clearSavedState(auth.currentUser?.uid);
    try {
      sessionStorage.removeItem('typeclicker_student_confirmed');
    } catch (e) {}
    setState({ ...INITIAL_STATE });
    setIsStudentModalOpen(true);
    const newWord = getRandomWord(INITIAL_STATE.selectedCategory);
    setCurrentWord(newWord);
    setCharIndex(0);
  }, []);

  // Save student credentials from onboarding or header
  const handleSaveStudentCredentials = useCallback((avatar: string, nickname: string, studentClass: string) => {
    setState((prev) => {
      const updated: GameState = {
        ...prev,
        studentAvatar: avatar,
        studentNickname: nickname,
        studentClass: studentClass
      };
      saveState(updated, auth.currentUser?.uid);
      if (auth.currentUser) {
        saveProgressToCloud(updated);
      }
      return updated;
    });
    setIsStudentModalOpen(false);
    const displayGreeting = nickname || 'Perfil';
    spawnFloatingText(`${avatar} Olá, ${displayGreeting}! Dados salvos! 🚀`, 'bonus');
    setTimeout(() => {
      typingInputRef.current?.focus();
    }, 120);
  }, [spawnFloatingText]);

  // Import backup state
  const handleImportState = useCallback((imported: Partial<GameState>) => {
    setState((prev) => {
      const next = {
        ...prev,
        ...imported,
        upgrades: imported.upgrades || prev.upgrades
      };
      const { bytesPerChar, autoBytesPerSec } = computeBaseRates(next.upgrades);
      next.bytesPerChar = bytesPerChar;
      next.autoBytesPerSec = autoBytesPerSec;
      saveState(next, auth.currentUser?.uid);
      return next;
    });
  }, [computeBaseRates]);

  // Auto-save silencioso em nuvem (Google Sheets) ao atingir novo nível / marco importante
  const playerRank = calculatePlayerRank(state.totalBytesEarned);
  const prevLevelRef = useRef<number>(playerRank.level);
  const [levelUpData, setLevelUpData] = useState<{level: number, title: string, badge: string} | null>(null);

  useEffect(() => {
    if (playerRank.level < prevLevelRef.current) {
      // Sync silently if level drops (e.g., game reset)
      prevLevelRef.current = playerRank.level;
    } else if (playerRank.level > prevLevelRef.current) {
      const prevLevel = prevLevelRef.current;
      const newLevel = playerRank.level;
      prevLevelRef.current = newLevel;
      
      // Auto-bump category if they are playing on a difficulty that is now locked
      if (!isCategoryAllowed(stateRef.current.selectedCategory, newLevel)) {
        const minAllowed = getMinAllowedCategoryLevel(newLevel);
        setState(prev => ({ ...prev, selectedCategory: minAllowed }));
        spawnFloatingText(`⚠️ Dificuldade mínima aumentada para Nível ${newLevel}!`, 'error');
      }

      if (suppressLevelUpRef.current) {
        return; // Silent level up on initial load
      }

      // Recompensa escolar: +1 Level Token por nível conquistado
      const levelsGained = Math.max(1, newLevel - prevLevel);
      setState(prev => {
        const currCosmetics = prev.cosmetics || { ...DEFAULT_COSMETICS };
        return {
          ...prev,
          cosmetics: {
            ...currCosmetics,
            levelTokens: (currCosmetics.levelTokens ?? 0) + levelsGained
          }
        };
      });
      spawnFloatingText(`+${levelsGained} Level Token${levelsGained > 1 ? 's' : ''}! 🪙`, 'bonus');
      
      setLevelUpData({
        level: playerRank.level,
        title: playerRank.title,
        badge: playerRank.badge
      });
      setTimeout(() => setLevelUpData(null), 3500);
      sound.playPrestige();

      // Check for challenge every 10 levels (handles skipping levels)
      let crossedChallengeLevel = null;
      for (let l = prevLevel + 1; l <= newLevel; l++) {
        if (l % 10 === 0) crossedChallengeLevel = l;
      }

      if (crossedChallengeLevel !== null && !stateRef.current.completedChallenges?.includes(crossedChallengeLevel)) {
        setTimeout(() => {
          setActiveChallengeLevel(crossedChallengeLevel);
        }, 4000); // Wait for level up animation to finish
      }

      if (user) {
        syncNow('levelup').then(() => {
          spawnFloatingText(`☁️ Nv. ${playerRank.level} salvo na nuvem!`, 'bonus');
        }).catch(() => {});
      }
    }
  }, [playerRank.level, playerRank.title, playerRank.badge, user, spawnFloatingText, syncNow]);

  const handleTriggerCloudSave = async () => {
    if (!user) return;
    await syncNow('manual');
    spawnFloatingText(`☁️ Salvo no Google Cloud!`, 'success');
    sound.playUpgrade();
  };

  const handleChallengeSuccess = useCallback((reward: number) => {
    setActiveChallengeLevel(null);
    setState((prev) => {
      const completed = [...(prev.completedChallenges || [])];
      if (activeChallengeLevel && !completed.includes(activeChallengeLevel)) {
        completed.push(activeChallengeLevel);
      }
      return {
        ...prev,
        bytes: prev.bytes + reward,
        totalBytesEarned: prev.totalBytesEarned + reward,
        completedChallenges: completed
      };
    });
    spawnFloatingText(`+${formatBytes(reward)} B (DESAFIO)!`, 'bonus');
  }, [activeChallengeLevel, spawnFloatingText]);

  const handleChallengeFail = useCallback(() => {
    setActiveChallengeLevel(null);
    spawnFloatingText('DESAFIO FALHOU!', 'error');
  }, [spawnFloatingText]);

  // Handler de Conversão de Bytes para Fragmentos Quânticos (3ª Moeda • Nível 100)
  const handleConvertBytesToFragments = useCallback((bytesSpent: number, fragmentsGained: number) => {
    setState((prev) => {
      if (prev.bytes < bytesSpent) return prev;
      const currentCosmetics = prev.cosmetics || { ...DEFAULT_COSMETICS };
      const updatedCosmetics: PlayerCosmetics = {
        ...currentCosmetics,
        quantumFragments: (currentCosmetics.quantumFragments || 0) + fragmentsGained
      };

      const newState: GameState = {
        ...prev,
        bytes: Math.max(0, prev.bytes - bytesSpent),
        cosmetics: updatedCosmetics
      };

      if (user) {
        saveState(newState, user.uid);
      }
      return newState;
    });

    spawnFloatingText(`🌌 +${fragmentsGained} FRAGMENTO${fragmentsGained > 1 ? 'S' : ''} QUÂNTICO${fragmentsGained > 1 ? 'S' : ''}!`, 'bonus');
  }, [user, spawnFloatingText]);

  const handleArenaReward = useCallback((
    isWinner: boolean,
    highestWpm: number,
    earnedPoints: number = 10,
    earnedDuelTokens: number = 2,
    earnedLevelTokens: number = 1
  ) => {
    setState((prev) => {
      const currentStats = prev.arenaStats || { ...DEFAULT_ARENA_STATS };
      const currentCosmetics = prev.cosmetics || { ...DEFAULT_COSMETICS };

      const newDuelPoints = (currentStats.duelPoints || 0) + earnedPoints;
      const currentRank = getArenaRank(newDuelPoints);

      const updatedStats: ArenaStats = {
        matchesPlayed: currentStats.matchesPlayed + 1,
        wins: currentStats.wins + (isWinner ? 1 : 0),
        losses: currentStats.losses + (isWinner ? 0 : 1),
        highestWpm: Math.max(currentStats.highestWpm, highestWpm),
        duelPoints: newDuelPoints,
        currentRankId: currentRank.id
      };

      const updatedCosmetics = {
        ...currentCosmetics,
        levelTokens: (currentCosmetics.levelTokens || 0) + earnedLevelTokens,
        duelTokens: (currentCosmetics.duelTokens || 0) + earnedDuelTokens
      };

      const newState: GameState = {
        ...prev,
        arenaStats: updatedStats,
        cosmetics: updatedCosmetics
      };

      if (user) {
        saveState(newState, user.uid);
      }
      return newState;
    });

    if (isWinner) {
      spawnFloatingText(`🏆 VITÓRIA NA ARENA! +2 Tokens`, 'level');
    } else {
      spawnFloatingText(`⚔️ DUELO CONCLUÍDO! +1 Token`, 'bonus');
    }
  }, [user, spawnFloatingText]);

  // Sincroniza o som equipado e master on/off no sintetizador
  useEffect(() => {
    sound.setEnabled(state.soundEnabled);
    audioSynthesizer.setMuted(!state.soundEnabled);
    if (state.cosmetics?.equippedSound) {
      sound.setSoundTheme(state.cosmetics.equippedSound);
    }
  }, [state.soundEnabled, state.cosmetics?.equippedSound]);

  const handleUpdateCosmetics = useCallback((newCosmetics: PlayerCosmetics) => {
    setState(prev => {
      const next = {
        ...prev,
        cosmetics: newCosmetics
      };
      saveState(next, auth.currentUser?.uid);
      return next;
    });
  }, []);

  const handleAdminUpdateGameState = useCallback((updatedState: GameState) => {
    setState(updatedState);
    saveState(updatedState, auth.currentUser?.uid);
    if (auth.currentUser) {
      saveProgressToCloud(updatedState).catch(console.error);
    }
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0e1013] text-zinc-100 flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
        <h2 className="text-xl font-bold">Carregando Jogo...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0e1013] text-zinc-100 flex flex-col items-center justify-center font-sans p-6">
        <div className="bg-[#12151c] border border-zinc-800 p-8 rounded-3xl flex flex-col items-center text-center max-w-md w-full shadow-2xl">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">TypeClicker</h1>
          <h2 className="text-sm font-bold text-emerald-400 mb-6">Colégio Leopoldina</h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Para jogar e salvar o seu progresso automaticamente na nuvem, você precisa entrar com seu @escola.
          </p>
          <button
            onClick={async () => {
              const loggedIn = await loginWithGoogle();
              if (loggedIn) {
                // state update is handled by the subscription
              }
            }}
            className="flex items-center gap-3 bg-white text-zinc-900 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-zinc-200 transition cursor-pointer shadow-lg shadow-white/5 active:scale-95 w-full justify-center"
          >
            Entrar com @escola
          </button>
        </div>
      </div>
    );
  }

  const currentCosmetics = sanitizeCosmetics(state.cosmetics);
  const activeTheme = TERMINAL_THEMES[currentCosmetics.equippedTheme || 'matrix'] || TERMINAL_THEMES.matrix;

  return (
    <>
      <GameLayoutWrapper
        layoutId={currentCosmetics.equippedLayout || 'default_terminal'}
        appBgClass={activeTheme.classes.appBg}
        overlays={
          <>
            <LevelUpOverlay
              data={levelUpData}
              equippedAnimation={currentCosmetics.equippedAnimation || 'confetti_classic'}
            />
            <PauseOverlay
              isOpen={isPaused}
              onResume={handleResumeGame}
              studentName={state.studentNickname || state.studentName}
              selectedCategory={state.selectedCategory}
              onSelectCategory={handleSelectCategory}
              playerRankLevel={playerRank.level}
            />
          </>
        }
        header={
          <Header
            state={state}
            isPaused={isPaused}
            isAdmin={isAdmin}
            isSuperAdmin={checkIsSuperAdmin(user)}
            onTogglePause={handleTogglePause}
            onToggleSound={() => setState((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
            onOpenMetrics={() => setIsMetricsOpen(true)}
            onOpenPrestige={() => setIsPrestigeOpen(true)}
            onOpenStudentModal={() => setIsStudentModalOpen(true)}
            onOpenLevels={() => setIsLevelsModalOpen(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onOpenCosmetics={() => setIsCosmeticsOpen(true)}
            onOpenArena={() => setIsArenaOpen(true)}
            onResetGame={handleResetGame}
            isSaving={isSyncing}
            isOnline={isOnline}
            hasPendingChanges={hasPendingChanges}
            onSaveProgress={handleTriggerCloudSave}
          />
        }
        sidebar={
          <StatsSidebar
            state={state}
            isAdmin={isAdmin}
            isSuperAdmin={checkIsSuperAdmin(user)}
            onOpenStudentModal={() => setIsStudentModalOpen(true)}
            onOpenPrestige={() => setIsPrestigeOpen(true)}
            onOpenLevels={() => setIsLevelsModalOpen(true)}
          />
        }
        arena={
          <TypingArena
            playerRankLevel={playerRank.level}
            currentWord={currentWord}
            charIndex={charIndex}
            isErrorShaking={isErrorShaking}
            comboStreak={state.comboStreak}
            multiplier={state.multiplier}
            maxCombo={state.maxCombo}
            selectedCategory={state.selectedCategory}
            onSelectCategory={handleSelectCategory}
            floatingTexts={floatingTexts}
            pendingAccent={pendingAccent}
            onTypeChar={handleTypeChar}
            onDeadKey={handleDeadKey}
            onClearPendingAccent={handleClearPendingAccent}
            inputRef={typingInputRef}
            recentWordComplete={recentWordComplete}
            recentUpgradeBought={recentUpgradeBought}
            focusBufferSeconds={focusBufferSeconds}
            maxFocusBuffer={maxFocusBuffer}
            isDraining={isDraining}
            consecutiveErrors={consecutiveErrors}
            isOverloaded={isOverloaded}
            isOverheating={isOverloaded || isDraining}
            drainRatePerSec={Math.max(1, Math.round(state.bytesPerChar * 1.2) + Math.round(state.bytes * 0.003))}
            isPaused={isPaused}
            onResume={handleResumeGame}
            onPause={handlePauseGame}
            equippedSkin={currentCosmetics.equippedSkin || 'classic'}
            equippedTheme={currentCosmetics.equippedTheme || 'matrix'}
            equippedAnimation={currentCosmetics.equippedAnimation || 'confetti_classic'}
            onOpenCosmetics={() => setIsCosmeticsOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenArena={() => setIsArenaOpen(true)}
            onOpenConverter={() => setIsConverterOpen(true)}
            levelTokens={state.cosmetics?.levelTokens ?? 0}
            quantumFragments={state.cosmetics?.quantumFragments ?? 0}
            isAdmin={isAdmin}
          />
        }
        shop={
          <ShopPanel
            state={state}
            onBuyUpgrade={handleBuyUpgrade}
            onOpenPrestige={() => setIsPrestigeOpen(true)}
            isPaused={isPaused}
            equippedAnimation={currentCosmetics.equippedAnimation || 'confetti_classic'}
          />
        }
        footer={
          <FooterHelpBar onOpenHelp={() => setIsHelpOpen(true)} />
        }
      />

      {/* Pedagogical Metrics & Teacher Scorecard Modal */}
      <MetricsModal
        isOpen={isMetricsOpen}
        onClose={() => setIsMetricsOpen(false)}
        state={state}
      />

      {/* Prestige Reboot Modal */}
      <PrestigeModal
        isOpen={isPrestigeOpen}
        onClose={() => setIsPrestigeOpen(false)}
        state={state}
        onConfirmPrestige={handleConfirmPrestige}
      />

      {/* Student Credentials Onboarding Modal (Required at the start) */}
      <StudentModal
        isOpen={isStudentModalOpen}
        user={user}
        state={state}
        currentAvatar={state.studentAvatar || '🐧'}
        currentNickname={state.studentNickname}
        currentClass={state.studentClass}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudentCredentials}
        onImportState={handleImportState}
        onLogout={async () => {
          if (user) {
            try {
              await syncNow('session_end');
            } catch (e) {}
          }
          await logoutUser();
        }}
      />

      {/* Levels 1 to 100 Progression Modal */}
      <LevelsModal
        isOpen={isLevelsModalOpen}
        onClose={() => setIsLevelsModalOpen(false)}
        currentRank={calculatePlayerRank(state.totalBytesEarned)}
        totalBytesEarned={state.totalBytesEarned}
        studentName={state.studentNickname || state.studentName}
        studentAvatar={state.studentAvatar}
      />

      {/* Teacher Help & Pedagogical Guidelines Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Global Ranking Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentUserId={user?.uid}
        currentUserClass={state.studentClass}
      />

      {/* Mini-game Challenge */}
      {activeChallengeLevel !== null && (
        <ChallengeArena
          level={activeChallengeLevel}
          isOpen={true}
          reducedAlerts={isReducedAlerts}
          onSuccess={handleChallengeSuccess}
          onFail={handleChallengeFail}
        />
      )}

      {/* Loja de Cosméticos do Terminal */}
      <CosmeticsShopModal
        isOpen={isCosmeticsOpen}
        onClose={() => setIsCosmeticsOpen(false)}
        cosmetics={currentCosmetics}
        onUpdateCosmetics={handleUpdateCosmetics}
        isAdmin={isAdmin}
      />

      {/* Arena 1x1 Multiplayer Modal (Nível 100 ou Administrador) */}
      <ArenaModal
        isOpen={isArenaOpen}
        onClose={() => setIsArenaOpen(false)}
        currentLevel={playerRank.level}
        isMaxLevel={playerRank.isMaxLevel}
        playerRank={playerRank}
        currentUser={user}
        studentName={state.studentName}
        studentNickname={state.studentNickname}
        studentClass={state.studentClass}
        studentAvatar={state.studentAvatar}
        equippedAnimation={currentCosmetics.equippedAnimation || 'confetti_classic'}
        equippedSound={currentCosmetics.equippedSound || 'mechanical'}
        soundEnabled={state.soundEnabled}
        arenaStats={state.arenaStats}
        duelTokens={currentCosmetics.duelTokens ?? 0}
        isAdmin={isAdmin}
        onMatchReward={handleArenaReward}
      />

      {/* Forja Quântica (Conversão de Bytes para 3ª Moeda • Nível 100) */}
      <QuantumConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
        playerRankLevel={playerRank.level}
        currentBytes={state.bytes}
        quantumFragments={currentCosmetics.quantumFragments ?? 0}
        onConvertBytes={handleConvertBytesToFragments}
        isAdmin={isAdmin}
      />

      {/* Admin Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isSuperAdmin={checkIsSuperAdmin(user)}
        gameState={state}
        onUpdateGameState={handleAdminUpdateGameState}
        userEmail={user?.email}
        onOpenArena={() => setIsArenaOpen(true)}
        onOpenCosmetics={() => setIsCosmeticsOpen(true)}
        onTriggerChallenge={(lvl) => setActiveChallengeLevel(lvl || 10)}
      />

      {/* Session Lock Overlay */}
      <SessionLockOverlay
        isLocked={isAppLocked && !isAdmin}
        isLoading={isVerifyingLock}
        onUnlock={handleUnlockCode}
      />
    </>
  );
}

