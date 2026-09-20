import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Swords,
  Trophy,
  Users,
  Lock,
  Bot,
  Zap,
  RotateCcw,
  Check,
  Copy,
  Clock,
  X,
  Sparkles,
  Award,
  Flame,
  ArrowRight,
  ShieldCheck,
  Coins
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  ArenaRoom,
  ArenaPlayer,
  ArenaStats,
  ArenaAiDifficulty,
  getArenaRank,
  getNextArenaRank
} from '../types/arena';
import { PlayerRank } from '../data/levels';
import { AnimationEffectId, KeySoundThemeId } from '../types/cosmetics';
import {
  AI_BOT_PROFILES,
  ARENA_WORDS_PER_MATCH,
  createArenaRoom,
  findOpenArenaRoom,
  joinArenaRoomByCode,
  setPlayerReady,
  startArenaGame,
  updatePlayerArenaProgress,
  abandonArenaRoom,
  listenToArenaRoom,
  createLocalAiRoom
} from '../services/arenaService';
import { sound } from '../utils/audio';
import { triggerLevelUpCelebrationVfx } from '../services/fxEngine';
import { formatTime } from '../utils/formatting';
import {
  resolveDeadKey,
  combineAccent,
  isAccentKey,
  getAccentDisplayName
} from '../utils/keyboardAccents';

interface ArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  isMaxLevel: boolean;
  playerRank: PlayerRank;
  currentUser: User | null;
  studentName: string;
  studentNickname: string;
  studentClass: string;
  studentAvatar: string;
  equippedAnimation?: AnimationEffectId;
  equippedSound?: KeySoundThemeId;
  soundEnabled?: boolean;
  arenaStats?: ArenaStats;
  duelTokens?: number;
  isAdmin?: boolean;
  onMatchReward?: (
    isWinner: boolean,
    highestWpm: number,
    earnedPoints: number,
    earnedDuelTokens: number,
    earnedLevelTokens: number
  ) => void;
}

type ArenaView = 'locked' | 'lobby' | 'waiting_room' | 'in_game' | 'finished';

export const ArenaModal: React.FC<ArenaModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  isMaxLevel,
  playerRank,
  currentUser,
  studentName,
  studentNickname,
  studentClass,
  studentAvatar,
  equippedAnimation = 'confetti_classic',
  equippedSound = 'mechanical',
  soundEnabled = true,
  arenaStats = { matchesPlayed: 0, wins: 0, losses: 0, highestWpm: 0, duelPoints: 0, currentRankId: 'recruta' },
  duelTokens = 0,
  isAdmin = false,
  onMatchReward
}) => {
  // Controle de visão (ADM tem acesso irrestrito para testes)
  const isEligible = currentLevel >= 100 || isMaxLevel || isAdmin;
  const [view, setView] = useState<ArenaView>('lobby');

  // Estado da Sala
  const [currentRoom, setCurrentRoom] = useState<ArenaRoom | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isAiMatch, setIsAiMatch] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState<ArenaAiDifficulty>('grao_mestre');

  // Estado de Formulário de Entrada
  const [inputCode, setInputCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Estado da Corrida / Gameplay
  const [countdown, setCountdown] = useState<number | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [wrongChars, setWrongChars] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentWpm, setCurrentWpm] = useState(0);
  const [lastMatchRewards, setLastMatchRewards] = useState<{ points: number; duelTokens: number; levelTokens: number } | null>(null);

  // Suporte a Acentuação ABNT2 e Teclas Mortas (Dead Keys)
  const [pendingAccent, setPendingAccent] = useState<string | null>(null);
  const pendingAccentRef = useRef<string | null>(null);
  pendingAccentRef.current = pendingAccent;

  const wordIndexRef = useRef(wordIndex);
  wordIndexRef.current = wordIndex;

  const charIndexRef = useRef(charIndex);
  charIndexRef.current = charIndex;

  const currentRoomRef = useRef(currentRoom);
  currentRoomRef.current = currentRoom;

  const isAiMatchRef = useRef(isAiMatch);
  isAiMatchRef.current = isAiMatch;

  // Referências
  const inputRef = useRef<HTMLInputElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const aiIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const rewardHandledRef = useRef<boolean>(false);

  // Inicializa visão ao abrir
  useEffect(() => {
    if (isOpen) {
      rewardHandledRef.current = false;
      setLastMatchRewards(null);
      if (!isEligible) {
        setView('locked');
      } else {
        setView('lobby');
      }
    } else {
      cleanupRoom();
    }
  }, [isOpen, isEligible]);

  // Limpeza de assinaturas e salas ao fechar
  const cleanupRoom = () => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    if (aiIntervalRef.current) {
      clearInterval(aiIntervalRef.current);
      aiIntervalRef.current = null;
    }
    setCurrentRoom(null);
    setIsAiMatch(false);
    setCountdown(null);
    setWordIndex(0);
    setCharIndex(0);
    setCorrectChars(0);
    setWrongChars(0);
    setElapsedSeconds(0);
    setCurrentWpm(0);
    setPendingAccent(null);
    pendingAccentRef.current = null;
  };

  // Jogador atual encapsulado
  const mePlayer: ArenaPlayer = useMemo(() => ({
    uid: currentUser?.uid || `guest_${Date.now()}`,
    name: studentName || 'Mestre Leopoldina',
    nickname: studentNickname || studentName || 'Lenda #100',
    turma: studentClass || 'Lendas Leopoldina',
    avatar: studentAvatar || '👑',
    ready: false,
    progress: 0,
    wpm: 0,
    accuracy: 100,
    wordsCompleted: 0
  }), [currentUser, studentName, studentNickname, studentClass, studentAvatar]);

  // Listener para sincronização da sala em tempo real
  useEffect(() => {
    if (!currentRoom?.id || isAiMatch) return;

    const unsub = listenToArenaRoom(currentRoom.id, (room) => {
      if (!room) {
        setFeedbackMsg('A sala foi encerrada ou o oponente desconectou.');
        cleanupRoom();
        setView('lobby');
        return;
      }

      setCurrentRoom(room);

      // Tratamento de contagem regressiva
      if (room.status === 'countdown' && view !== 'in_game') {
        setView('waiting_room');
      }

      // Início do jogo
      if (room.status === 'in_progress' && view !== 'in_game') {
        setView('in_game');
        setGameStartTime(room.gameStartedAt || Date.now());
      }

      // Fim de jogo
      if (room.status === 'finished') {
        setView('finished');
      }
    });

    unsubscribeRef.current = unsub;
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [currentRoom?.id, isAiMatch]);

  // Efeito de contagem regressiva 3, 2, 1, JÁ!
  useEffect(() => {
    if (currentRoom?.status === 'countdown' && currentRoom.countdownStartedAt) {
      const interval = setInterval(() => {
        const diff = Date.now() - (currentRoom.countdownStartedAt || 0);
        const count = 3 - Math.floor(diff / 1000);

        if (count > 0) {
          setCountdown(count);
        } else if (count === 0) {
          setCountdown(0);
        } else {
          clearInterval(interval);
          setCountdown(null);
          if (isHost && !isAiMatch) {
            startArenaGame(currentRoom.id);
          } else if (isAiMatch) {
            setCurrentRoom(prev => prev ? { ...prev, status: 'in_progress', gameStartedAt: Date.now() } : null);
            setView('in_game');
            setGameStartTime(Date.now());
          }
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [currentRoom?.status, currentRoom?.countdownStartedAt, isHost, isAiMatch]);

  // Efeito de Cronômetro e WPM em jogo
  useEffect(() => {
    if (view !== 'in_game' || !gameStartTime) return;

    inputRef.current?.focus();

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.max(1, (now - gameStartTime) / 1000);
      setElapsedSeconds(Math.floor(elapsed));

      // PPM = (caracteres corretos / 5) / (minutos decorridos)
      const minutes = elapsed / 60;
      const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
      setCurrentWpm(wpm);
    }, 500);

    return () => clearInterval(timer);
  }, [view, gameStartTime, correctChars]);

  // Loop de Simulação da IA (Treino contra Bytezinho Cibernético)
  useEffect(() => {
    if (!isAiMatch || view !== 'in_game' || !currentRoom) return;

    const bot = AI_BOT_PROFILES[aiDifficulty];
    const totalWords = currentRoom.words.length;
    // O bot avança progressivamente de acordo com seu targetWpm
    // Caracteres por segundo = (targetWpm * 5) / 60
    const charsPerSecond = (bot.targetWpm * 5) / 60;
    const totalChars = currentRoom.words.join('').length;

    let botProgress = 0;
    const intervalTimeMs = 600;

    aiIntervalRef.current = setInterval(() => {
      const addedProgress = ((charsPerSecond * (intervalTimeMs / 1000)) / totalChars) * 100;
      botProgress = Math.min(100, botProgress + addedProgress);

      const wordsCompleted = Math.min(totalWords, Math.floor((botProgress / 100) * totalWords));

      setCurrentRoom(prev => {
        if (!prev) return null;
        const isBotWinner = botProgress >= 100 && prev.status === 'in_progress';
        return {
          ...prev,
          status: isBotWinner ? 'finished' : prev.status,
          winnerUid: isBotWinner ? prev.player2?.uid : prev.winnerUid,
          player2: prev.player2 ? {
            ...prev.player2,
            progress: botProgress,
            wpm: bot.targetWpm + Math.floor((Math.random() - 0.5) * 6),
            wordsCompleted,
            finishedAt: isBotWinner ? Date.now() : prev.player2.finishedAt
          } : undefined
        };
      });

      if (botProgress >= 100) {
        if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);
      }
    }, intervalTimeMs);

    return () => {
      if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);
    };
  }, [isAiMatch, view, aiDifficulty]);

  // Recompensa e comemoração ao finalizar partida
  useEffect(() => {
    if (view === 'finished' && currentRoom && !rewardHandledRef.current) {
      rewardHandledRef.current = true;
      const isWinner = currentRoom.winnerUid === mePlayer.uid;
      const isAi = isAiMatch || currentRoom.player2?.isBot;

      if (isWinner) {
        sound.playPrestige();
        triggerLevelUpCelebrationVfx(equippedAnimation);
      } else {
        sound.playWordComplete();
      }

      // Recompensas balanceadas:
      // Pontos de Duelo: Vitória PvP 30 pts, Vitória IA 15 pts, Derrota PvP 10 pts, Derrota IA 5 pts
      const earnedPoints = isWinner ? (isAi ? 15 : 30) : (isAi ? 5 : 10);
      // Moedas de Duelo: Vitória PvP 5, Vitória IA 3, Derrota PvP 2, Derrota IA 1
      const earnedDuelTokens = isWinner ? (isAi ? 3 : 5) : (isAi ? 1 : 2);
      // Level Tokens: Vitória 2, Derrota 1
      const earnedLevelTokens = isWinner ? 2 : 1;

      setLastMatchRewards({
        points: earnedPoints,
        duelTokens: earnedDuelTokens,
        levelTokens: earnedLevelTokens
      });

      if (onMatchReward) {
        onMatchReward(isWinner, currentWpm, earnedPoints, earnedDuelTokens, earnedLevelTokens);
      }
    }
  }, [view, currentRoom, mePlayer.uid, onMatchReward, currentWpm, equippedAnimation, isAiMatch]);

  // Processamento unificado de caractere digitado (com suporte a acentuação ABNT2 e dead keys)
  const processTypedChar = useCallback((rawChar: string) => {
    if (view !== 'in_game' || !currentRoomRef.current) return;

    let finalChar = rawChar;
    const currentPending = pendingAccentRef.current;

    // Se havia acento pendente, combina com a vogal (ou c para ç)
    if (currentPending) {
      finalChar = combineAccent(currentPending, rawChar);
      setPendingAccent(null);
      pendingAccentRef.current = null;
    }

    const room = currentRoomRef.current;
    const currentWordIndex = wordIndexRef.current;
    const currentCharIndex = charIndexRef.current;

    const currentWord = room.words[currentWordIndex];
    if (!currentWord) return;

    const expectedChar = currentWord[currentCharIndex];
    if (!expectedChar) return;

    // Compara em minúsculas para compatibilidade total ABNT2/Linux
    const typedLower = finalChar.toLocaleLowerCase('pt-BR');
    const expectedLower = expectedChar.toLocaleLowerCase('pt-BR');

    if (typedLower === expectedLower) {
      // Acerto
      sound.playKeyStroke(currentCharIndex + 1, (equippedSound || 'mechanical') as KeySoundThemeId);
      setCorrectChars(prev => prev + 1);

      if (currentCharIndex + 1 >= currentWord.length) {
        // Palavra concluída!
        sound.playWordComplete();
        const nextWordIndex = currentWordIndex + 1;
        setWordIndex(nextWordIndex);
        wordIndexRef.current = nextWordIndex;
        setCharIndex(0);
        charIndexRef.current = 0;
        setPendingAccent(null);
        pendingAccentRef.current = null;

        const totalWords = room.words.length;
        const progress = Math.min(100, Math.round((nextWordIndex / totalWords) * 100));
        const isFinished = nextWordIndex >= totalWords;

        const totalCorrect = correctChars + 1;
        const accuracy = Math.round((totalCorrect / (totalCorrect + wrongChars)) * 100);

        if (isAiMatchRef.current) {
          setCurrentRoom(prev => {
            if (!prev) return null;
            return {
              ...prev,
              status: isFinished ? 'finished' : prev.status,
              winnerUid: isFinished && !prev.winnerUid ? mePlayer.uid : prev.winnerUid,
              player1: {
                ...prev.player1,
                progress,
                wpm: currentWpm,
                accuracy,
                wordsCompleted: nextWordIndex,
                finishedAt: isFinished ? Date.now() : undefined
              }
            };
          });
        } else {
          updatePlayerArenaProgress(
            room.id,
            isHost ? 1 : 2,
            progress,
            currentWpm,
            accuracy,
            nextWordIndex,
            isFinished
          );
        }

        if (isFinished) {
          setView('finished');
        }
      } else {
        const nextCharIndex = currentCharIndex + 1;
        setCharIndex(nextCharIndex);
        charIndexRef.current = nextCharIndex;
      }
    } else {
      // Erro
      sound.playGlitch();
      setWrongChars(prev => prev + 1);
    }
  }, [view, equippedSound, correctChars, wrongChars, currentWpm, isHost, mePlayer.uid]);

  // Processa caracteres digitados no input nativo (suporta composição IME, acentos e digitação direta)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;

    for (const ch of val) {
      if (isAccentKey(ch)) {
        setPendingAccent(ch);
        pendingAccentRef.current = ch;
      } else {
        processTypedChar(ch);
      }
    }
    e.target.value = '';
  };

  // Captura teclas mortas (Dead), acentos isolados e atalhos de cancelamento
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tecla Backspace ou Escape: se houver acento pendente, cancela o acento
    if (e.key === 'Backspace' || e.key === 'Escape') {
      if (pendingAccentRef.current) {
        e.preventDefault();
        setPendingAccent(null);
        pendingAccentRef.current = null;
        return;
      }
    }

    // Se o teclado emitir 'Dead' ou tecla de acento isolada
    if (e.key === 'Dead' || isAccentKey(e.key)) {
      const word = currentRoomRef.current?.words[wordIndexRef.current];
      const targetChar = word ? word[charIndexRef.current] : undefined;
      const resolved = resolveDeadKey(e.nativeEvent, targetChar);
      if (resolved) {
        setPendingAccent(resolved);
        pendingAccentRef.current = resolved;
      }
    }
  };

  // Foco contínuo e captura global de teclas durante a partida da Arena
  useEffect(() => {
    if (view !== 'in_game') return;

    const focusInput = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    };

    focusInput();
    const focusInterval = setInterval(focusInput, 800);

    const handleWindowKeyDown = (e: KeyboardEvent) => {
      // Se já está focado no input invisível da arena, o onKeyDown/onChange do próprio input trata
      if (e.target === inputRef.current) return;

      // Não intercepta se o usuário estiver digitando em outro input (ex: código de sala)
      const targetElement = e.target as HTMLElement | null;
      const tag = targetElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || targetElement?.isContentEditable) {
        return;
      }

      // Devolve foco ao input
      inputRef.current?.focus({ preventScroll: true });

      // Teclas mortas (Dead) ou acentos isolados
      if (e.key === 'Dead' || isAccentKey(e.key)) {
        e.preventDefault();
        const word = currentRoomRef.current?.words[wordIndexRef.current];
        const targetChar = word ? word[charIndexRef.current] : undefined;
        const resolved = resolveDeadKey(e, targetChar);
        if (resolved) {
          setPendingAccent(resolved);
          pendingAccentRef.current = resolved;
        }
        return;
      }

      // Backspace ou Escape para cancelar acento pendente
      if (e.key === 'Backspace' || e.key === 'Escape') {
        if (pendingAccentRef.current) {
          e.preventDefault();
          setPendingAccent(null);
          pendingAccentRef.current = null;
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
      if (e.key.length === 1 || e.key === 'Space') {
        e.preventDefault();
        const ch = e.key === 'Space' ? ' ' : e.key;
        processTypedChar(ch);
      }
    };

    window.addEventListener('keydown', handleWindowKeyDown);

    return () => {
      clearInterval(focusInterval);
      window.removeEventListener('keydown', handleWindowKeyDown);
    };
  }, [view, processTypedChar]);

  // Ações do Lobby
  const handleCreateRoom = async () => {
    setIsLoading(true);
    setFeedbackMsg(null);
    try {
      const { roomId, roomCode } = await createArenaRoom(mePlayer);
      setIsHost(true);
      setIsAiMatch(false);
      setCurrentRoom({
        id: roomId,
        roomCode,
        createdBy: mePlayer.uid,
        createdAt: Date.now(),
        status: 'waiting',
        words: [],
        player1: mePlayer
      });
      setView('waiting_room');
    } catch (err) {
      console.error(err);
      setFeedbackMsg('Erro ao criar sala. Verifique a conexão do laboratório.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinByCode = async () => {
    if (!inputCode.trim()) {
      setFeedbackMsg('Digite o código da sala de 5 dígitos.');
      return;
    }
    setIsLoading(true);
    setFeedbackMsg(null);
    try {
      const room = await joinArenaRoomByCode(inputCode, mePlayer);
      if (!room) {
        setFeedbackMsg('Sala não encontrada, já cheia ou expirada.');
        return;
      }
      setIsHost(false);
      setIsAiMatch(false);
      setCurrentRoom(room);
      setView('waiting_room');
    } catch (err) {
      console.error(err);
      setFeedbackMsg('Erro ao ingressar na sala. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickMatch = async () => {
    setIsLoading(true);
    setFeedbackMsg(null);
    try {
      const openRoom = await findOpenArenaRoom(mePlayer.uid);
      if (openRoom) {
        const joined = await joinArenaRoomByCode(openRoom.roomCode, mePlayer);
        if (joined) {
          setIsHost(false);
          setIsAiMatch(false);
          setCurrentRoom(joined);
          setView('waiting_room');
          return;
        }
      }
      // Se não encontrou nenhuma aberta, cria uma e aguarda
      await handleCreateRoom();
    } catch (err) {
      console.error(err);
      setFeedbackMsg('Falha ao buscar partida rápida. Criando sala nova...');
      await handleCreateRoom();
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAiMatch = (difficulty: ArenaAiDifficulty) => {
    setAiDifficulty(difficulty);
    setIsAiMatch(true);
    setIsHost(true);
    const { room } = createLocalAiRoom(mePlayer, difficulty);
    setCurrentRoom(room);
    setView('waiting_room');
  };

  const handleToggleReady = async () => {
    if (!currentRoom) return;
    const playerNum = isHost ? 1 : 2;
    const currentReady = isHost ? currentRoom.player1.ready : (currentRoom.player2?.ready ?? false);
    const nextReady = !currentReady;

    if (isAiMatch) {
      // Na IA, ao clicar pronto, contagem já dispara
      setCurrentRoom(prev => prev ? {
        ...prev,
        status: 'countdown',
        countdownStartedAt: Date.now(),
        player1: { ...prev.player1, ready: true }
      } : null);
    } else {
      await setPlayerReady(currentRoom.id, playerNum, nextReady);
    }
  };

  const handleCopyCode = () => {
    if (currentRoom?.roomCode) {
      navigator.clipboard.writeText(currentRoom.roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleExitRoom = async () => {
    if (currentRoom && !isAiMatch) {
      await abandonArenaRoom(currentRoom.id, isHost ? 1 : 2);
    }
    cleanupRoom();
    setView('lobby');
  };

  if (!isOpen) return null;

  // Renderização da Visão: BLOQUEADO (Nível < 100)
  if (view === 'locked') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="w-full max-w-lg bg-[#0c1017] border border-amber-500/40 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col relative"
          >
            {/* Header de Bloqueio */}
            <div className="p-6 border-b border-amber-500/20 bg-gradient-to-b from-amber-950/40 to-transparent flex flex-col items-center text-center relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] mb-4">
                <Lock className="w-8 h-8" />
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase mb-2">
                Acesso Restrito: Nível 100
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                Coliseu dos Mestres (Arena 1x1)
              </h2>
            </div>

            {/* Conteúdo Pedagógico e Progresso */}
            <div className="p-6 space-y-5 text-center">
              <p className="text-sm text-zinc-300 leading-relaxed">
                A Arena 1x1 é reservada exclusivamente para os digitadores de elite que alcançaram a patente suprema de{' '}
                <strong className="text-amber-400">Lenda Leopoldina (Nível 100)</strong>.
              </p>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-left space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-mono">Seu Progresso Atual:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    Nível {currentLevel} de 100 ({currentLevel}%)
                  </span>
                </div>

                <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(2, currentLevel))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-1">
                  <span>Nv. {currentLevel} ({playerRank.title})</span>
                  <span>Faltam {Math.max(0, 100 - currentLevel)} Níveis</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400">
                Continue praticando suas técnicas na fileira central (ASDF / JKLÇ), compre novos processadores e dispute os rankings da sua turma para ingressar no Coliseu!
              </p>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black text-sm transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
              >
                Entendido, vou continuar treinando!
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setView('lobby')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Swords className="w-4 h-4" />
                  <span>Acessar Arena como Administrador (wrobel.marcos@gmail.com)</span>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Renderização do Modal Principal (Nível 100 Desbloqueado)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="w-full max-w-4xl max-h-[92vh] bg-[#0c1017] border border-red-500/40 rounded-2xl shadow-[0_0_60px_rgba(239,68,68,0.2)] overflow-hidden flex flex-col"
        >
          {/* Top Bar da Arena */}
          <div className="flex-shrink-0 px-4 sm:px-6 py-3.5 border-b border-white/10 bg-gradient-to-r from-red-950/60 via-zinc-900 to-black flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <Swords className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-1.5">
                    Arena 1x1 <span className="text-red-400">Multiplayer</span>
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold uppercase hidden sm:inline">
                    Lendas Leopoldina
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono">
                  {view === 'lobby' && 'Escolha um oponente ou desafie um colega com código de sala'}
                  {view === 'waiting_room' && `Sala ${currentRoom?.roomCode || 'TREINO'} • Aguardando ambos confirmarem`}
                  {view === 'in_game' && 'Duelo em andamento • Digite as 15 palavras com precisão máxima!'}
                  {view === 'finished' && 'Duelo concluído • Resultados e Recompensas'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (view === 'in_game') {
                  if (confirm('Deseja realmente abandonar o duelo em andamento?')) {
                    handleExitRoom();
                    onClose();
                  }
                } else {
                  handleExitRoom();
                  onClose();
                }
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback temporário */}
          {feedbackMsg && (
            <div className="px-6 py-2 bg-red-950/80 border-b border-red-500/40 text-xs text-red-300 font-mono flex items-center justify-between">
              <span>{feedbackMsg}</span>
              <button onClick={() => setFeedbackMsg(null)} className="text-red-400 hover:text-white font-bold ml-2">
                ✕
              </button>
            </div>
          )}

          {/* Corpo do Modal: Alternância de Visões */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* VIEW: LOBBY */}
            {view === 'lobby' && (
              <div className="space-y-6">
                {/* Banner de Administrador */}
                {isAdmin && (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-3 text-xs font-mono shadow-sm">
                    <div className="flex items-center gap-2 text-amber-300">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 font-bold flex items-center gap-1">
                        👑 ADM: wrobel.marcos@gmail.com
                      </span>
                      <span className="hidden sm:inline text-zinc-300">
                        Acesso irrestrito a duelos PvP e treino contra robôs para testes pedagógicos.
                      </span>
                    </div>
                  </div>
                )}

                {/* Card de Patente de Gladiador e Moedas de Duelo */}
                {(() => {
                  const duelPts = arenaStats.duelPoints ?? 0;
                  const rank = getArenaRank(duelPts);
                  const nextInfo = getNextArenaRank(duelPts);

                  return (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-purple-950/30 to-black border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.15)] space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${rank.bgColor} border ${rank.borderColor} shadow-lg flex-shrink-0`}>
                            {rank.badge}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`text-base font-black ${rank.color}`}>
                                {rank.name}
                              </h3>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
                                {rank.tier}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 font-mono mt-0.5">
                              {rank.description}
                            </p>
                          </div>
                        </div>

                        {/* Moedas e Pontos */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-red-500/30 text-rose-300 font-mono font-bold text-xs">
                            <Swords className="w-4 h-4 text-rose-400" />
                            <span>{duelTokens}</span>
                            <span className="text-zinc-400 font-normal hidden sm:inline">Moedas</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs">
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                            <span>{duelPts}</span>
                            <span className="text-zinc-400 font-normal hidden sm:inline">Pontos</span>
                          </div>
                        </div>
                      </div>

                      {/* Barra de Progresso para a Próxima Patente */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                          <span>
                            {nextInfo.nextRank
                              ? `Rumo a ${nextInfo.nextRank.badge} ${nextInfo.nextRank.name}`
                              : 'Patente Máxima Alcançada!'}
                          </span>
                          <span className="font-bold text-zinc-300">
                            {nextInfo.nextRank
                              ? `${nextInfo.pointsRemaining} pts restantes (${nextInfo.progressPercent}%)`
                              : 'Lenda Imortal'}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-400 transition-all duration-500 rounded-full"
                            style={{ width: `${nextInfo.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Stats do Aluno em Duelos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col">
                    <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" /> Vitórias
                    </span>
                    <span className="text-xl font-mono font-black text-amber-300 mt-1">
                      {arenaStats.wins}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col">
                    <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 flex items-center gap-1">
                      <Swords className="w-3.5 h-3.5 text-red-400" /> Duelos
                    </span>
                    <span className="text-xl font-mono font-black text-white mt-1">
                      {arenaStats.matchesPlayed}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col">
                    <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-sky-400" /> Recorde PPM
                    </span>
                    <span className="text-xl font-mono font-black text-sky-400 mt-1">
                      {arenaStats.highestWpm} PPM
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col">
                    <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-400" /> Aproveitamento
                    </span>
                    <span className="text-xl font-mono font-black text-emerald-400 mt-1">
                      {arenaStats.matchesPlayed > 0
                        ? Math.round((arenaStats.wins / arenaStats.matchesPlayed) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>

                {/* Grid de Modos de Entrada */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card: Desafiar Colega com Código */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121622] to-black border border-white/10 hover:border-red-500/40 transition flex flex-col justify-between space-y-4 shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                          ⚔️
                        </div>
                        <h3 className="font-bold text-white text-base">Desafiar Colega no Laboratório</h3>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Crie uma sala privada e compartilhe o código de 5 dígitos com o colega ao lado, ou entre na sala criada por ele.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <button
                        onClick={handleCreateRoom}
                        disabled={isLoading}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                      >
                        <Swords className="w-4 h-4" />
                        Criar Nova Sala (Gerar Código)
                      </button>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                          placeholder="Ex: LEO42"
                          className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono font-bold text-center text-sm uppercase focus:outline-none focus:border-red-500 transition"
                        />
                        <button
                          onClick={handleJoinByCode}
                          disabled={isLoading}
                          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                        >
                          Entrar
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card: Partida Rápida (Fila Automática) */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121622] to-black border border-white/10 hover:border-sky-500/40 transition flex flex-col justify-between space-y-4 shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                          ⚡
                        </div>
                        <h3 className="font-bold text-white text-base">Partida Rápida (Colégio)</h3>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Procura instantaneamente por outro aluno Nível 100 online esperando no colégio. Se não houver ninguém, abre uma sala pública.
                      </p>
                    </div>

                    <button
                      onClick={handleQuickMatch}
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.25)]"
                    >
                      <Users className="w-4 h-4" />
                      Buscar Oponente Online
                    </button>
                  </div>
                </div>

                {/* Seção de Treino contra IA (Bytezinho Cibernético) */}
                <div className="p-5 rounded-2xl bg-[#0a0d14] border border-purple-500/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">Treino contra IA: Bytezinho Cibernético</h3>
                        <p className="text-[11px] text-zinc-400">
                          Nenhum colega online agora? Teste seus limites contra a inteligência artificial do laboratório!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {(Object.keys(AI_BOT_PROFILES) as ArenaAiDifficulty[]).map((diff) => {
                      const bot = AI_BOT_PROFILES[diff];
                      return (
                        <button
                          key={diff}
                          onClick={() => handleStartAiMatch(diff)}
                          className="p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-purple-500/60 hover:bg-purple-950/20 transition-all text-left flex flex-col justify-between group cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl">{bot.avatar}</span>
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold">
                              {bot.targetWpm} PPM
                            </span>
                          </div>
                          <span className="font-bold text-white text-xs group-hover:text-purple-300 transition-colors">
                            {bot.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {bot.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: SALA DE ESPERA / PRE-GAME */}
            {view === 'waiting_room' && currentRoom && (
              <div className="space-y-6 max-w-2xl mx-auto text-center py-4">
                {/* Código de Compartilhamento */}
                <div className="p-4 rounded-2xl bg-black/60 border border-red-500/40 inline-flex flex-col items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                    Código de Sala (Compartilhe com seu colega):
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black font-mono tracking-widest text-red-400 bg-red-950/40 px-4 py-1 rounded-xl border border-red-500/30">
                      {currentRoom.roomCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition cursor-pointer"
                      title="Copiar Código"
                    >
                      {copiedCode ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Cards dos Jogadores Lado a Lado */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Jogador 1 (Host / Você) */}
                  <div className="p-5 rounded-2xl bg-[#121622] border border-white/10 flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-3xl select-none">
                      {currentRoom.player1.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{currentRoom.player1.nickname}</h4>
                      <p className="text-[10px] text-zinc-400 font-mono">{currentRoom.player1.turma}</p>
                    </div>
                    {currentRoom.player1.ready ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold font-mono flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> PRONTO
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold font-mono">
                        Aguardando...
                      </span>
                    )}
                  </div>

                  {/* Jogador 2 (Desafiante ou Bot) */}
                  <div className="p-5 rounded-2xl bg-[#121622] border border-white/10 flex flex-col items-center space-y-3">
                    {currentRoom.player2 ? (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border-2 border-sky-500/50 flex items-center justify-center text-3xl select-none">
                          {currentRoom.player2.avatar}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{currentRoom.player2.nickname}</h4>
                          <p className="text-[10px] text-zinc-400 font-mono">{currentRoom.player2.turma}</p>
                        </div>
                        {currentRoom.player2.ready ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold font-mono flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> PRONTO
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold font-mono">
                            Aguardando...
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center py-6 text-zinc-500 space-y-2">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center animate-spin">
                          <Clock className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-mono">Aguardando oponente...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contagem Regressiva em Destaque */}
                {countdown !== null && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-4"
                  >
                    <span className="text-5xl sm:text-6xl font-black font-mono text-amber-400 tracking-wider">
                      {countdown > 0 ? countdown : 'DIGITE!'}
                    </span>
                  </motion.div>
                )}

                {/* Ações de Confirmação */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <button
                    onClick={handleExitRoom}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition cursor-pointer"
                  >
                    Sair da Sala
                  </button>

                  <button
                    onClick={handleToggleReady}
                    disabled={!currentRoom.player2}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm transition shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {((isHost ? currentRoom.player1.ready : currentRoom.player2?.ready) ?? false)
                      ? 'Desmarcar Pronto'
                      : 'ESTOU PRONTO!'}
                  </button>
                </div>
              </div>
            )}

            {/* VIEW: GAMEPLAY (CORRIDA 1x1 AO VIVO) */}
            {view === 'in_game' && currentRoom && (
              <div className="space-y-6">
                {/* Pista de Corrida Superior com os 2 Avatares */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      Tempo: <strong className="text-white">{formatTime(elapsedSeconds)}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Seu PPM: <strong className="text-amber-300">{currentWpm}</strong>
                    </span>
                  </div>

                  {/* Pista do Jogador 1 (Você) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <span>{currentRoom.player1.avatar}</span>
                        <span>{currentRoom.player1.nickname} (Você)</span>
                      </span>
                      <span className="font-mono font-bold text-white text-xs">
                        {Math.round(currentRoom.player1.progress)}% • {currentRoom.player1.wpm || currentWpm} PPM
                      </span>
                    </div>

                    <div className="relative w-full h-5 bg-zinc-900 rounded-full overflow-hidden border border-white/10 p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-300 flex items-center justify-end pr-1"
                        style={{ width: `${Math.max(4, Math.min(100, currentRoom.player1.progress))}%` }}
                      >
                        <span className="text-[10px]">🏃</span>
                      </div>
                    </div>
                  </div>

                  {/* Pista do Jogador 2 (Oponente / Bot) */}
                  {currentRoom.player2 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-sky-400 flex items-center gap-1.5">
                          <span>{currentRoom.player2.avatar}</span>
                          <span>{currentRoom.player2.nickname}</span>
                        </span>
                        <span className="font-mono font-bold text-white text-xs">
                          {Math.round(currentRoom.player2.progress)}% • {currentRoom.player2.wpm} PPM
                        </span>
                      </div>

                      <div className="relative w-full h-5 bg-zinc-900 rounded-full overflow-hidden border border-white/10 p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full transition-all duration-300 flex items-center justify-end pr-1"
                          style={{ width: `${Math.max(4, Math.min(100, currentRoom.player2.progress))}%` }}
                        >
                          <span className="text-[10px]">🏎️</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terminal Central de Digitação */}
                <div
                  onClick={() => inputRef.current?.focus()}
                  className="p-6 sm:p-8 rounded-2xl bg-[#090d14] border-2 border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.15)] flex flex-col items-center justify-center space-y-6 cursor-text relative"
                >
                  <input
                    ref={inputRef}
                    id="arena-typing-input"
                    type="text"
                    value=""
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    className="opacity-0 absolute -left-[9999px] top-0 w-1 h-1 pointer-events-auto"
                    aria-label="Área de digitação da Arena com suporte ABNT2"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    autoFocus
                  />

                  {/* Progresso de Palavras (ex: Palavra 4 de 15) */}
                  <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono font-bold">
                    Palavra {Math.min(currentRoom.words.length, wordIndex + 1)} de {currentRoom.words.length}
                  </span>

                  {/* Indicador Pedagógico de Acento Pendente (ABNT2 Dead Key Feedback) */}
                  {pendingAccent && (
                    <div className="px-3 py-1.5 rounded-full bg-sky-500/20 border border-sky-500/50 text-sky-300 text-xs font-mono font-bold flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      <span>{getAccentDisplayName(pendingAccent)} ativo! Digite a vogal agora...</span>
                    </div>
                  )}

                  {/* Palavra Atual com Letras Coloridas */}
                  {currentRoom.words[wordIndex] && (
                    <div className="flex flex-wrap justify-center items-center gap-1 font-mono text-3xl sm:text-5xl font-black tracking-wider py-4 select-none">
                      {currentRoom.words[wordIndex].split('').map((ch, idx) => {
                        const isTyped = idx < charIndex;
                        const isCurrent = idx === charIndex;
                        return (
                          <span
                            key={idx}
                            className={`px-1 rounded-md transition-colors ${
                              isTyped
                                ? 'text-emerald-400 font-bold'
                                : isCurrent
                                ? 'text-white border-b-4 border-red-400 bg-red-500/20 animate-pulse'
                                : 'text-zinc-600'
                            }`}
                          >
                            {ch}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Próximas Palavras na Fila */}
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 select-none max-w-full overflow-hidden truncate">
                    <span>A seguir:</span>
                    {currentRoom.words.slice(wordIndex + 1, wordIndex + 4).map((w, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400">
                        {w}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-zinc-500 font-mono text-center">
                    Clique aqui caso o foco do teclado se perca. Digite sem pausas para bater seu recorde de PPM!
                  </p>
                </div>
              </div>
            )}

            {/* VIEW: RESULTADO & PÓDIO */}
            {view === 'finished' && currentRoom && (
              <div className="space-y-6 max-w-xl mx-auto text-center py-4">
                {/* Banner de Vitória / Segundo Lugar */}
                {currentRoom.winnerUid === mePlayer.uid ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-950/60 to-black border-2 border-amber-500/60 shadow-[0_0_40px_rgba(245,158,11,0.3)] space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center text-4xl mx-auto text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)]">
                      🏆
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                      VITÓRIA ÉPICA!
                    </h3>
                    <p className="text-xs text-amber-300 font-mono">
                      Você cruzou a linha de chegada em primeiro lugar com honras das Lendas Leopoldina!
                    </p>

                    {/* Recompensas de Vitória */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                      <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold shadow-sm">
                        <Swords className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>+{lastMatchRewards?.duelTokens ?? 0} Moedas ⚔️</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold shadow-sm">
                        <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>+{lastMatchRewards?.points ?? 0} Pts Duelo</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 text-xs font-mono font-bold shadow-sm">
                        <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
                        <span>+{lastMatchRewards?.levelTokens ?? 0} Level Tokens</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-white/10 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-3xl mx-auto text-zinc-300">
                      🥈
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                      Duelo Concluído!
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono">
                      Excelente disputa! Sua bravura e velocidade renderam honras de combate.
                    </p>

                    {/* Recompensas de Conclusão */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                      <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold shadow-sm">
                        <Swords className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>+{lastMatchRewards?.duelTokens ?? 0} Moedas ⚔️</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold shadow-sm">
                        <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>+{lastMatchRewards?.points ?? 0} Pts Duelo</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-xs font-mono font-bold shadow-sm">
                        <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
                        <span>+{lastMatchRewards?.levelTokens ?? 0} Level Token</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estatísticas Comparadas */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 text-left">
                  <h4 className="text-xs uppercase font-mono font-bold text-zinc-400 border-b border-white/10 pb-2">
                    Resumo do Duelo:
                  </h4>

                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-400">Sua Velocidade Final:</span>
                    <span className="font-bold text-emerald-400 text-sm">{currentWpm} PPM</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-400">Tempo de Prova:</span>
                    <span className="font-bold text-white text-sm">{formatTime(elapsedSeconds)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-400">Palavras Completadas:</span>
                    <span className="font-bold text-sky-400 text-sm">
                      {Math.min(currentRoom.words.length, wordIndex)} de {currentRoom.words.length}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação Final */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      cleanupRoom();
                      setView('lobby');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition cursor-pointer"
                  >
                    Voltar ao Lobby
                  </button>

                  <button
                    onClick={() => {
                      cleanupRoom();
                      if (isAiMatch) {
                        handleStartAiMatch(aiDifficulty);
                      } else {
                        handleQuickMatch();
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Jogar Novamente
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
