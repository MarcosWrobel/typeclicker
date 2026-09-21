import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Swords,
  Shield,
  Timer,
  Trophy,
  Flame,
  Zap,
  Users,
  CheckCircle2,
  X,
  Sparkles,
  AlertTriangle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClassroomRaid, RaidParticipant } from '../types/raid';
import { RpgClassType, RPG_CLASSES } from '../types/rpgClass';
import { submitRaidContribution } from '../services/raidService';
import { sound } from '../utils/audio';
import { formatBytes } from '../utils/formatting';
import { combineAccent, isAccentKey, resolveDeadKey, getAccentDisplayName } from '../utils/keyboardAccents';
import { getRandomWord } from '../data/words';

interface ClassroomRaidArenaProps {
  isOpen: boolean;
  raid: ClassroomRaid;
  studentName: string;
  studentNickname?: string;
  studentAvatar?: string;
  studentClass: string;
  rpgClass?: RpgClassType;
  userId: string;
  isAdmin?: boolean;
  onClose: () => void;
  onClaimVictory: (prizeBytes: number, stats: { damage: number; words: number; wpm: number }) => void;
}

interface DamagePopup {
  id: number;
  text: string;
  x: number;
  y: number;
  isCrit: boolean;
}

export const ClassroomRaidArena: React.FC<ClassroomRaidArenaProps> = ({
  isOpen,
  raid,
  studentName,
  studentNickname,
  studentAvatar = '👾',
  studentClass,
  rpgClass,
  userId,
  isAdmin = false,
  onClose,
  onClaimVictory
}) => {
  const activeRpgClass: RpgClassType = rpgClass || 'warrior';
  // Palavra atual a ser digitada
  const [currentWord, setCurrentWord] = useState<string>(() => getRandomWord('medio'));
  const [charIndex, setCharIndex] = useState<number>(0);
  const [pendingAccent, setPendingAccent] = useState<string | null>(null);
  const [wrongKeyStrike, setWrongKeyStrike] = useState<boolean>(false);
  const [comboStreak, setComboStreak] = useState<number>(0);

  // Telemetria local do aluno na Raid
  const [localDamageDealt, setLocalDamageDealt] = useState<number>(0);
  const [localWordsTyped, setLocalWordsTyped] = useState<number>(0);
  const [correctKeyCount, setCorrectKeyCount] = useState<number>(0);
  const [startTimeMs, setStartTimeMs] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    return Math.max(0, Math.round((raid.expiresAtMs - Date.now()) / 1000));
  });

  // Recompensa resgatada
  const [prizeClaimed, setPrizeClaimed] = useState<boolean>(false);

  // Popups de Dano Flutuante
  const [damagePopups, setDamagePopups] = useState<DamagePopup[]>([]);
  const popupIdRef = useRef<number>(0);

  // Buffer de dano pendente para sincronização eficiente (economiza gravações no Firestore)
  const pendingDamageRef = useRef<number>(0);
  const pendingWordsRef = useRef<number>(0);
  const lastSyncTimeRef = useRef<number>(Date.now());
  const isWordCleanRef = useRef<boolean>(true);

  // Refs de estado para callbacks ininterruptos
  const charIndexRef = useRef<number>(0);
  const pendingAccentRef = useRef<string | null>(null);
  const currentWordRef = useRef<string>(currentWord);
  const inputRef = useRef<HTMLInputElement>(null);
  const elapsedSecondsRef = useRef<number>(0);
  const correctKeyCountRef = useRef<number>(0);

  // Sincroniza refs com states
  charIndexRef.current = charIndex;
  pendingAccentRef.current = pendingAccent;
  currentWordRef.current = currentWord;
  elapsedSecondsRef.current = elapsedSeconds;
  correctKeyCountRef.current = correctKeyCount;

  // Início da sessão e foco contínuo
  useEffect(() => {
    if (!isOpen || raid.status !== 'in_progress') return;

    setStartTimeMs(Date.now());

    const focusInput = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    };

    focusInput();
    const interval = setInterval(focusInput, 600);
    return () => clearInterval(interval);
  }, [isOpen, raid.status]);

  // Spawn de texto flutuante de dano
  const spawnDamage = useCallback((amount: number, isCrit: boolean = false, customText?: string) => {
    const id = ++popupIdRef.current;
    const text = customText || `-${amount} HP`;
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 40 + 30;

    setDamagePopups((prev) => [...prev.slice(-10), { id, text, x, y, isCrit }]);
    setTimeout(() => {
      setDamagePopups((prev) => prev.filter((p) => p.id !== id));
    }, 900);
  }, []);

  // Timer regressivo da Raid
  useEffect(() => {
    if (!isOpen || raid.status !== 'in_progress') return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((raid.expiresAtMs - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, raid.expiresAtMs, raid.status]);

  // Função de flush do dano acumulado para o Firestore
  const flushPendingDamage = useCallback(async () => {
    const dmg = pendingDamageRef.current;
    const words = pendingWordsRef.current;
    if (dmg <= 0) return;

    pendingDamageRef.current = 0;
    pendingWordsRef.current = 0;
    lastSyncTimeRef.current = Date.now();

    const currentActiveSeconds = Math.max(1, elapsedSecondsRef.current);
    const calculatedWpm = Math.round((correctKeyCountRef.current / 5) / (currentActiveSeconds / 60));

    try {
      await submitRaidContribution(
        raid.id,
        {
          uid: userId,
          nome: studentName,
          apelido: studentNickname || studentName,
          avatar: studentAvatar,
          turma: studentClass,
          rpgClass: activeRpgClass
        },
        dmg,
        words,
        calculatedWpm
      );
    } catch (e) {
      console.warn('Erro ao sincronizar contribuição de raid:', e);
    }
  }, [raid.id, userId, studentName, studentNickname, studentAvatar, studentClass, activeRpgClass]);

  // Intervalo periódico de sincronização atômica de dano (a cada 2.5s se houver dano pendente)
  useEffect(() => {
    if (!isOpen || raid.status !== 'in_progress') return;

    const syncInterval = setInterval(() => {
      if (pendingDamageRef.current > 0) {
        flushPendingDamage();
      }
    }, 2500);

    return () => {
      clearInterval(syncInterval);
      if (pendingDamageRef.current > 0) {
        flushPendingDamage();
      }
    };
  }, [isOpen, raid.status, flushPendingDamage]);

  // Celebração de vitória com confetes
  useEffect(() => {
    if (raid.status === 'victory') {
      sound.playChallengeSuccess();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    } else if (raid.status === 'defeat') {
      sound.playChallengeFail();
    }
  }, [raid.status]);

  // Processa caractere final digitado (com suporte a acentuação ABNT2 e composição IME)
  const processChar = useCallback(
    (rawChar: string) => {
      if (raid.status !== 'in_progress' || secondsRemaining <= 0) return;

      let finalChar = rawChar;
      const currentPending = pendingAccentRef.current;

      // Se havia acento pendente, combina com a vogal (ou cedilha)
      if (currentPending) {
        finalChar = combineAccent(currentPending, rawChar);
        setPendingAccent(null);
        pendingAccentRef.current = null;
      }

      const word = currentWordRef.current;
      const idx = charIndexRef.current;
      const expectedChar = word[idx];
      if (!expectedChar) return;

      const typedLower = finalChar.toLocaleLowerCase('pt-BR');
      const expectedLower = expectedChar.toLocaleLowerCase('pt-BR');

      if (typedLower === expectedLower) {
        // Tecla correta!
        const nextIdx = idx + 1;
        charIndexRef.current = nextIdx;
        setCharIndex(nextIdx);
        setCorrectKeyCount((prev) => prev + 1);

        const nextCombo = comboStreak + 1;
        setComboStreak(nextCombo);
        sound.playKeyStroke(nextCombo);

        // Cálculo de Dano por Caractere
        let charDamage = 15;

        // Passiva Arqueiro: se combo alto, inflige mais dano base
        if (activeRpgClass === 'archer' && nextCombo >= 15) {
          charDamage = Math.round(charDamage * 1.25);
        }

        pendingDamageRef.current += charDamage;
        setLocalDamageDealt((prev) => prev + charDamage);

        // Conclusão da palavra
        if (nextIdx >= word.length) {
          sound.playWordComplete();

          let wordDamage = Math.round(word.length * 35);

          // Passiva do Guerreiro Veloz: se digitando em alta cadência, bônus de impacto motor
          const activeSec = Math.max(1, elapsedSecondsRef.current);
          const currentWpm = Math.round((correctKeyCountRef.current / 5) / (activeSec / 60));
          if (activeRpgClass === 'warrior' && currentWpm >= 55) {
            wordDamage = Math.round(wordDamage * 1.30);
            spawnDamage(wordDamage, true, '⚡ ÍMPETO MOTOR (+30%)!');
          } else if (activeRpgClass === 'mage' && isWordCleanRef.current) {
            wordDamage = Math.round(wordDamage * 1.25);
            spawnDamage(wordDamage, true, '✨ EXPLOSÃO ARCANA (+25%)!');
          } else {
            spawnDamage(wordDamage, true);
          }

          pendingDamageRef.current += wordDamage;
          pendingWordsRef.current += 1;
          setLocalDamageDealt((prev) => prev + wordDamage);
          setLocalWordsTyped((prev) => prev + 1);

          // Sorteia próxima palavra
          const nextWord = getRandomWord('medio', word);
          setCurrentWord(nextWord);
          currentWordRef.current = nextWord;
          setCharIndex(0);
          charIndexRef.current = 0;
          setPendingAccent(null);
          pendingAccentRef.current = null;
          isWordCleanRef.current = true;

          // Se acumulou bastante dano ou concluiu palavra, verifica flush
          if (pendingDamageRef.current >= 200 || Date.now() - lastSyncTimeRef.current > 2000) {
            flushPendingDamage();
          }
        }
      } else {
        // Tecla errada
        sound.playError();
        setWrongKeyStrike(true);
        setTimeout(() => setWrongKeyStrike(false), 140);
        isWordCleanRef.current = false;
        setComboStreak(0);
      }
    },
    [
      raid.status,
      secondsRemaining,
      comboStreak,
      activeRpgClass,
      spawnDamage,
      flushPendingDamage
    ]
  );

  // Processa caracteres digitados no input nativo (suporte a IME e digitação direta)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;

    for (const ch of val) {
      if (isAccentKey(ch)) {
        setPendingAccent(ch);
        pendingAccentRef.current = ch;
      } else {
        processChar(ch);
      }
    }
    // Esvazia para a próxima combinação de teclas
    e.target.value = '';
  };

  // Captura teclas mortas (Dead), acentos isolados e atalhos de navegação
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (raid.status !== 'in_progress' || secondsRemaining <= 0) return;

    if (e.key === 'Escape') {
      if (pendingAccentRef.current) {
        e.preventDefault();
        setPendingAccent(null);
        pendingAccentRef.current = null;
        return;
      }
      return;
    }

    if (e.key === 'Backspace') {
      if (pendingAccentRef.current) {
        e.preventDefault();
        setPendingAccent(null);
        pendingAccentRef.current = null;
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      return;
    }

    // Teclas mortas (Dead) e acentuação gráfica
    if (e.key === 'Dead' || isAccentKey(e.key)) {
      e.preventDefault();
      const word = currentWordRef.current;
      const idx = charIndexRef.current;
      const expectedChar = word[idx];
      const resolved = resolveDeadKey(e.nativeEvent, expectedChar);
      if (resolved) {
        setPendingAccent(resolved);
        pendingAccentRef.current = resolved;
      }
      return;
    }
  };

  // Lista de participantes ordenada por contribuição de dano
  const sortedParticipants = useMemo(() => {
    const list = Object.values(raid.participants || {}) as RaidParticipant[];
    return list.sort((a, b) => b.damageDealt - a.damageDealt);
  }, [raid.participants]);

  // Porcentagem de vida do Boss
  const hpPercent = Math.max(0, Math.min(100, Math.round((raid.currentHp / raid.maxHp) * 100)));

  // Formatação de minutos:segundos
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleClaim = () => {
    if (prizeClaimed) return;
    setPrizeClaimed(true);

    const activeSec = Math.max(1, elapsedSeconds);
    const calculatedWpm = Math.round((correctKeyCount / 5) / (activeSec / 60));

    onClaimVictory(raid.prizeBytes, {
      damage: localDamageDealt,
      words: localWordsTyped,
      wpm: calculatedWpm
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 overflow-hidden select-none"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      {/* Input invisível para captura permanente de teclado físico e virtual com suporte ABNT2/IME */}
      <input
        ref={inputRef}
        id="classroom-raid-input"
        type="text"
        value=""
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className="opacity-0 absolute -left-[9999px] top-0 w-1 h-1 pointer-events-auto"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        aria-label="Terminal de Digitação da Raid Coletiva"
      />

      {/* TOP HEADER: Status do Chefe e Tempo Restante */}
      <div className="w-full max-w-5xl bg-zinc-950/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Glow de fundo temático */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Dados do Chefe */}
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border-2 border-rose-500/50 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-pulse">
              {raid.bossIcon || '👹'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
                  Raid Coletiva
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  Turma: <strong className="text-zinc-200 uppercase">{raid.targetTurma}</strong>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-mono flex items-center gap-2">
                {raid.bossName}
              </h2>
              <p className="text-xs text-zinc-400 font-mono">{raid.bossSubtitle}</p>
            </div>
          </div>

          {/* Cronômetro e Botão de Saída */}
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono border ${
                secondsRemaining <= 30
                  ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 animate-pulse'
                  : 'bg-zinc-900/80 border-zinc-700/60 text-amber-300'
              }`}
            >
              <Timer className="w-5 h-5" />
              <span className="text-lg sm:text-xl font-black tracking-wider">
                {formatTime(secondsRemaining)}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/60 transition-colors"
              title="Sair da Raid"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BARRA DE HP GIGANTE DO BOSS */}
        <div className="mt-5">
          <div className="flex justify-between items-center text-xs sm:text-sm font-mono mb-1.5">
            <span className="text-rose-400 font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
              INTEGRIDADE DO CHEFE
            </span>
            <span className="text-zinc-300 font-mono">
              <strong className="text-white text-base sm:text-lg">
                {raid.currentHp.toLocaleString()}
              </strong>{' '}
              / {raid.maxHp.toLocaleString()} HP ({hpPercent}%)
            </span>
          </div>

          <div className="w-full h-5 sm:h-6 rounded-full bg-zinc-900 overflow-hidden border border-rose-950/80 p-0.5 shadow-inner">
            <motion.div
              animate={{ width: `${hpPercent}%` }}
              transition={{ duration: 0.3 }}
              className={`h-full rounded-full transition-all ${
                hpPercent > 50
                  ? 'bg-gradient-to-r from-rose-600 via-amber-500 to-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                  : hpPercent > 20
                  ? 'bg-gradient-to-r from-rose-600 to-amber-500 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.8)]'
                  : 'bg-gradient-to-r from-red-700 to-rose-600 animate-pulse shadow-[0_0_25px_rgba(225,29,72,1)]'
              }`}
            />
          </div>
        </div>
      </div>

      {/* ÁREA CENTRAL DE COMBATE E DIGITAÇÃO */}
      <div className="w-full max-w-5xl flex-1 flex flex-col md:flex-row items-center gap-4 sm:gap-6 my-4 min-h-0">
        {/* Painel Esquerdo / Central: Digitação Ativa e Popups */}
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center relative bg-zinc-950/60 border border-zinc-800/60 rounded-2xl p-6 sm:p-10 shadow-xl overflow-hidden">
          {/* Popups de dano flutuante */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {damagePopups.map((p) => (
              <div
                key={p.id}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className={`absolute font-mono font-black text-sm sm:text-base pointer-events-none animate-float-fade ${
                  p.isCrit
                    ? 'text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)] scale-125'
                    : 'text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]'
                }`}
              >
                {p.text}
              </div>
            ))}
          </div>

          {/* Dica de Classe RPG Ativa */}
          <div className="mb-4 flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${RPG_CLASSES[activeRpgClass].badgeBg} ${RPG_CLASSES[activeRpgClass].badgeBorder} ${RPG_CLASSES[activeRpgClass].badgeText}`}
            >
              <span>{RPG_CLASSES[activeRpgClass].icon}</span>
              <span>{RPG_CLASSES[activeRpgClass].name}</span>
            </span>
            {comboStreak >= 5 && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold animate-pulse">
                🔥 Combo: {comboStreak}
              </span>
            )}
          </div>

          {/* PALAVRA ALVO A SER DIGITADA */}
          <div className="text-center my-6">
            <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-2">
              Digite a palavra para desferir golpes coletivos:
            </div>
            <div
              className={`inline-block px-8 py-4 rounded-2xl font-mono text-3xl sm:text-5xl font-black tracking-wider transition-all shadow-inner ${
                wrongKeyStrike
                  ? 'bg-rose-950/70 border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-shake'
                  : 'bg-zinc-900/90 border-2 border-zinc-700'
              }`}
            >
              {currentWord.split('').map((char, i) => {
                let colorClass = 'text-zinc-500';
                if (i < charIndex) {
                  colorClass = 'text-emerald-400';
                } else if (i === charIndex) {
                  colorClass = 'text-amber-300 underline underline-offset-8 decoration-amber-400 animate-pulse';
                }
                return (
                  <span key={i} className={colorClass}>
                    {char}
                  </span>
                );
              })}
            </div>

            {pendingAccent && (
              <div className="mt-2 text-xs font-mono text-amber-300 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-lg inline-flex items-center gap-1.5 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                <span>⌨️</span>
                <span>{getAccentDisplayName(pendingAccent)} (digite a vogal)</span>
              </div>
            )}
          </div>

          {/* Estatísticas Pessoais na Batalha */}
          <div className="flex items-center gap-6 sm:gap-10 text-xs sm:text-sm font-mono text-zinc-400 mt-2">
            <div>
              Seu Dano:{' '}
              <strong className="text-rose-400 text-base sm:text-lg">
                {localDamageDealt.toLocaleString()} HP
              </strong>
            </div>
            <div>
              Palavras:{' '}
              <strong className="text-cyan-400 text-base sm:text-lg">{localWordsTyped}</strong>
            </div>
            <div>
              Cadência:{' '}
              <strong className="text-amber-300 text-base sm:text-lg">
                {Math.round((correctKeyCount / 5) / (Math.max(1, elapsedSeconds) / 60))} PPM
              </strong>
            </div>
          </div>
        </div>

        {/* Painel Direito: Placar de Contribuição dos Colegas da Turma */}
        <div className="w-full md:w-80 h-full max-h-72 md:max-h-full bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 flex flex-col shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
            <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              SALA DE BATALHA ({sortedParticipants.length})
            </span>
            <span className="text-[10px] font-mono text-zinc-500">DANO TOTAL</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {sortedParticipants.length === 0 ? (
              <div className="text-center py-8 text-xs font-mono text-zinc-500">
                Aguardando os primeiros golpes dos alunos...
              </div>
            ) : (
              sortedParticipants.map((p, index) => {
                const isMe = p.userId === userId;
                const dmgPercent =
                  raid.totalDamageDealt > 0
                    ? Math.round((p.damageDealt / raid.totalDamageDealt) * 100)
                    : 0;

                return (
                  <div
                    key={p.userId}
                    className={`p-2.5 rounded-xl border font-mono transition-all ${
                      isMe
                        ? 'bg-indigo-950/40 border-indigo-500/60 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                        : 'bg-zinc-900/60 border-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-zinc-500 w-4 text-center">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
                        </span>
                        <span className="text-base">{p.avatar || '⚡'}</span>
                        <span className="font-bold text-zinc-200 truncate">
                          {p.apelido || p.nome}
                        </span>
                        {isMe && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 font-bold">
                            VOCÊ
                          </span>
                        )}
                      </div>
                      <span className="text-rose-400 font-bold whitespace-nowrap">
                        {p.damageDealt.toLocaleString()}
                      </span>
                    </div>

                    {/* Barra de porcentagem de contribuição */}
                    <div className="mt-1.5 w-full bg-zinc-800/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          index === 0
                            ? 'bg-amber-400'
                            : isMe
                            ? 'bg-indigo-400'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, dmgPercent)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* FOOTER: Dicas de Cooperação */}
      <div className="w-full max-w-5xl text-center text-[11px] font-mono text-zinc-500">
        💡 O HP do Chefe é compartilhado em tempo real por todos os alunos da sala. Unam a velocidade dos Guerreiros, a precisão dos Arqueiros e o poder dos Magos!
      </div>

      {/* TELA DE VITÓRIA: BOSS DERROTADO */}
      <AnimatePresence>
        {raid.status === 'victory' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-xl bg-zinc-950 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.3)]">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center text-4xl mb-4 animate-bounce">
                🏆
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold tracking-widest uppercase">
                Vitória Coletiva!
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-white font-mono mt-3">
                {raid.bossName} FOI DERROTADO!
              </h3>
              <p className="text-sm text-zinc-400 font-mono mt-1">
                A união da turma quebrou os nós corrompidos do sistema escolar.
              </p>

              {/* Destaque do MVP */}
              {raid.mvp && (
                <div className="my-6 p-4 rounded-2xl bg-zinc-900/90 border border-amber-500/40 text-left flex items-center gap-4">
                  <div className="text-3xl">👑</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                      Maior Contribuinte (MVP da Batalha)
                    </div>
                    <div className="text-base font-bold text-white font-mono truncate flex items-center gap-2">
                      <span>{raid.mvp.avatar}</span>
                      <span>{raid.mvp.apelido || raid.mvp.nome}</span>
                      <span className="text-xs text-zinc-400">({raid.mvp.turma})</span>
                    </div>
                    <div className="text-xs font-mono text-rose-400 mt-0.5">
                      Dano Total: <strong>{raid.mvp.damageDealt.toLocaleString()} HP</strong> ({raid.mvp.wpm} PPM)
                    </div>
                  </div>
                </div>
              )}

              {/* Estatísticas Pessoais */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 font-mono text-center my-4">
                <div>
                  <div className="text-[10px] text-zinc-500">Seu Dano</div>
                  <div className="text-base font-bold text-rose-400">
                    {localDamageDealt.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500">Palavras</div>
                  <div className="text-base font-bold text-cyan-400">{localWordsTyped}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500">Recompensa</div>
                  <div className="text-base font-bold text-amber-400">
                    +{formatBytes(raid.prizeBytes)}
                  </div>
                </div>
              </div>

              {/* Botão de Resgate */}
              <button
                onClick={handleClaim}
                disabled={prizeClaimed}
                className={`w-full py-4 rounded-xl font-mono font-black text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
                  prizeClaimed
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 cursor-default'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 shadow-[0_0_25px_rgba(245,158,11,0.5)]'
                }`}
              >
                {prizeClaimed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> RECOMPENSA RESGATADA!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> RESGATAR +{formatBytes(raid.prizeBytes)}!
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="mt-3 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Fechar Arena
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TELA DE DERROTA: TEMPO ESGOTADO */}
      <AnimatePresence>
        {raid.status === 'defeat' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-zinc-950 border-2 border-rose-600/60 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(225,29,72,0.3)]">
              <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/20 border-2 border-rose-500/60 flex items-center justify-center text-4xl mb-4">
                ☠️
              </div>

              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold tracking-widest uppercase">
                Tempo Esgotado!
              </span>

              <h3 className="text-2xl font-black text-white font-mono mt-3">
                O CHEFE RESISTIU AO ATAQUE!
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-2">
                O tempo limite terminou antes do HP chegar a zero. Reúnam a turma e tentem novamente com maior cadência e coordenação de classes!
              </p>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 font-mono text-center my-5">
                <div className="text-xs text-zinc-400">Dano que sua turma causou:</div>
                <div className="text-xl font-black text-rose-400 mt-1">
                  {(raid.totalDamageDealt || 0).toLocaleString()} / {raid.maxHp.toLocaleString()} HP
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold text-sm transition-colors"
              >
                Voltar ao Terminal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
