import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Swords,
  Shield,
  Heart,
  Sparkles,
  Coins,
  Layers,
  X,
  RotateCcw,
  ChevronRight,
  Trophy,
  AlertCircle,
  Flame,
  Target,
  Zap,
  Eye,
  EyeOff,
  Snowflake,
  Skull,
  Activity,
  Lock
} from 'lucide-react';
import { RpgFloorData, DungeonState, RpgActiveStatusEffect } from '../types/quests';
import { sound } from '../utils/audio';
import { formatBytes } from '../utils/formatting';
import { combineAccent, isAccentKey, resolveDeadKey, getAccentDisplayName } from '../utils/keyboardAccents';

interface RpgChronicleArenaProps {
  isOpen: boolean;
  floorData: RpgFloorData;
  dungeon?: DungeonState;
  onVictory: (floorData: RpgFloorData) => void;
  onClose: () => void;
  onNextFloor?: () => void;
}

interface DamagePopup {
  id: number;
  text: string;
  x: number;
  y: number;
  isCrit: boolean;
}

export const RpgChronicleArena: React.FC<RpgChronicleArenaProps> = ({
  isOpen,
  floorData,
  dungeon,
  onVictory,
  onClose,
  onNextFloor
}) => {
  const maxShield = 100 + (dungeon?.shield?.bonusShield ?? 0) + (dungeon?.relic?.bonusShield ?? 0);
  const [charIndex, setCharIndex] = useState(0);
  const [bossHp, setBossHp] = useState(floorData.boss.maxHp);
  const [playerShield, setPlayerShield] = useState(maxShield);
  const [isErrorShaking, setIsErrorShaking] = useState(false);
  const [status, setStatus] = useState<'playing' | 'victory' | 'defeat'>('playing');
  const [damagePopups, setDamagePopups] = useState<DamagePopup[]>([]);
  const [pendingAccent, setPendingAccent] = useState<string | null>(null);
  const [isBossHurt, setIsBossHurt] = useState(false);

  // Mecânica de Minigame QTE: Sobrecarga do Núcleo do Boss aos 50% de HP
  const [overloadTriggered, setOverloadTriggered] = useState(false);
  const [overloadActive, setOverloadActive] = useState(false);
  const [overloadSequence, setOverloadSequence] = useState<string[]>([]);
  const [overloadIndex, setOverloadIndex] = useState(0);

  // Efeitos de Controle de Grupo (Crowd Control de RPG: Blind, Fear, Hold)
  const [activeStatusEffect, setActiveStatusEffect] = useState<RpgActiveStatusEffect | null>(null);
  const activeStatusEffectRef = useRef<RpgActiveStatusEffect | null>(null);
  const [telegraphSpell, setTelegraphSpell] = useState<{ label: string; icon: string } | null>(null);
  const [blindTriggered, setBlindTriggered] = useState(false);
  const [fearTriggered, setFearTriggered] = useState(false);
  const [holdTriggered, setHoldTriggered] = useState(false);

  // Refs para prevenir race conditions e closures desatualizadas na digitação veloz
  const charIndexRef = useRef(0);
  const bossHpRef = useRef(floorData.boss.maxHp);
  const statusRef = useRef<'playing' | 'victory' | 'defeat'>('playing');
  const pendingAccentRef = useRef<string | null>(null);
  const overloadActiveRef = useRef(false);
  const overloadIndexRef = useRef(0);
  const overloadSequenceRef = useRef<string[]>([]);
  const wordCleanRef = useRef<boolean>(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const currentSpanRef = useRef<HTMLSpanElement>(null);

  // Sincroniza refs com states
  useEffect(() => {
    charIndexRef.current = charIndex;
  }, [charIndex]);
  useEffect(() => {
    bossHpRef.current = bossHp;
  }, [bossHp]);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  useEffect(() => {
    pendingAccentRef.current = pendingAccent;
  }, [pendingAccent]);
  useEffect(() => {
    overloadActiveRef.current = overloadActive;
  }, [overloadActive]);
  useEffect(() => {
    overloadIndexRef.current = overloadIndex;
  }, [overloadIndex]);
  useEffect(() => {
    overloadSequenceRef.current = overloadSequence;
  }, [overloadSequence]);
  useEffect(() => {
    activeStatusEffectRef.current = activeStatusEffect;
  }, [activeStatusEffect]);

  // Telegrafa e conjura um debuff de RPG no jogador
  const castStatusEffect = useCallback((effect: RpgActiveStatusEffect) => {
    setTelegraphSpell({ label: effect.label, icon: effect.icon });
    sound.playGlitch();

    setTimeout(() => {
      setTelegraphSpell(null);
      setActiveStatusEffect(effect);
      activeStatusEffectRef.current = effect;
      sound.playChallengeFail();
    }, 1500);
  }, []);

  // Temporizador de expiração de segurança dos efeitos de status
  useEffect(() => {
    if (!activeStatusEffect) return;
    const timer = setTimeout(() => {
      setActiveStatusEffect(null);
      activeStatusEffectRef.current = null;
    }, (activeStatusEffect.durationSeconds || 8) * 1000);
    return () => clearTimeout(timer);
  }, [activeStatusEffect]);

  // Reinicia o estado ao abrir um novo andar
  useEffect(() => {
    if (isOpen) {
      setCharIndex(0);
      charIndexRef.current = 0;
      setBossHp(floorData.boss.maxHp);
      bossHpRef.current = floorData.boss.maxHp;
      setPlayerShield(maxShield);
      setStatus('playing');
      statusRef.current = 'playing';
      setPendingAccent(null);
      pendingAccentRef.current = null;
      setOverloadTriggered(false);
      setOverloadActive(false);
      overloadActiveRef.current = false;
      setOverloadSequence([]);
      overloadSequenceRef.current = [];
      setOverloadIndex(0);
      overloadIndexRef.current = 0;
      setActiveStatusEffect(null);
      activeStatusEffectRef.current = null;
      setTelegraphSpell(null);
      setBlindTriggered(false);
      setFearTriggered(false);
      setHoldTriggered(false);
      wordCleanRef.current = true;
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 80);
    }
  }, [isOpen, floorData, maxShield]);

  // Mantém foco ininterrupto no input de digitação durante a batalha
  useEffect(() => {
    if (!isOpen || status !== 'playing') return;

    const focusInput = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    };

    focusInput();
    const interval = setInterval(focusInput, 600);
    return () => clearInterval(interval);
  }, [isOpen, status]);

  // Mantém o cursor visível com scroll suave
  useEffect(() => {
    if (currentSpanRef.current) {
      currentSpanRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [charIndex]);

  // Tecla ESC para fechar ou desistir se o foco estiver na janela
  useEffect(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleWindowKeyDown);
    return () => window.removeEventListener('keydown', handleWindowKeyDown);
  }, [isOpen, onClose]);

  // Spawna número flutuante de dano RPG
  const spawnDamage = useCallback((amount: number, isCrit: boolean, label?: string) => {
    const id = Date.now() + Math.random();
    const x = 50 + (Math.random() * 20 - 10);
    const y = 35 + (Math.random() * 15 - 7);
    const text = label ? label : isCrit ? `💥 -${amount} CRÍTICO!` : `-${amount}`;
    setDamagePopups((prev) => [...prev.slice(-6), { id, text, x, y, isCrit }]);

    setTimeout(() => {
      setDamagePopups((prev) => prev.filter((p) => p.id !== id));
    }, 850);
  }, []);

  // Processa o caractere final após composição de acentos (ABNT2 / IME / Teclas Mortas)
  const processTypedChar = useCallback(
    (rawChar: string) => {
      if (statusRef.current !== 'playing') return;

      // 1. Se estiver sob efeito HOLD (Buffer congelado)
      if (activeStatusEffectRef.current?.type === 'hold') {
        if (rawChar === ' ') {
          sound.playType();
          const nextProgress = (activeStatusEffectRef.current.progress || 0) + 1;
          if (nextProgress >= activeStatusEffectRef.current.maxProgress) {
            // Gelo quebrado!
            sound.playChallengeSuccess();
            spawnDamage(0, false, '❄️ GELO ESTILHAÇADO!');
            setActiveStatusEffect(null);
            activeStatusEffectRef.current = null;
          } else {
            const updated = { ...activeStatusEffectRef.current, progress: nextProgress };
            activeStatusEffectRef.current = updated;
            setActiveStatusEffect(updated);
            spawnDamage(0, false, `❄️ GELO TRINCANDO! (${nextProgress}/3)`);
          }
        } else {
          // Bloqueado pelo gelo!
          sound.playGlitch();
          setIsErrorShaking(true);
          setTimeout(() => setIsErrorShaking(false), 200);
        }
        return;
      }

      // 2. Se estiver em modo QTE de Sobrecarga do Núcleo
      if (overloadActiveRef.current) {
        const pressedKey = rawChar.toUpperCase();
        const seq = overloadSequenceRef.current;
        const qteIdx = overloadIndexRef.current;
        const targetKey = seq[qteIdx];

        if (pressedKey === targetKey) {
          sound.playType();
          const nextQteIdx = qteIdx + 1;
          if (nextQteIdx >= seq.length) {
            sound.playChallengeSuccess();
            const burstDmg = Math.max(25, Math.round(floorData.boss.maxHp * 0.25));
            spawnDamage(burstDmg, true, `⚡ SOBRECARGA! -${burstDmg}`);
            const nextHp = Math.max(0, bossHpRef.current - burstDmg);
            bossHpRef.current = nextHp;
            setBossHp(nextHp);
            overloadActiveRef.current = false;
            setOverloadActive(false);

            if (nextHp <= 0) {
              statusRef.current = 'victory';
              setStatus('victory');
              onVictory(floorData);
            }
          } else {
            overloadIndexRef.current = nextQteIdx;
            setOverloadIndex(nextQteIdx);
          }
        } else {
          sound.playError();
          overloadActiveRef.current = false;
          setOverloadActive(false);
        }
        return;
      }

      const currentIndex = charIndexRef.current;
      const expectedChar = floorData.text[currentIndex];
      if (!expectedChar) return;

      let finalChar = rawChar;
      const currentPending = pendingAccentRef.current;

      // Se havia acento pendente, combina com a letra digitada
      if (currentPending) {
        finalChar = combineAccent(currentPending, rawChar);
        setPendingAccent(null);
        pendingAccentRef.current = null;
      }

      // Compara o caractere digitado com o esperado no texto
      if (finalChar === expectedChar) {
        // Acerto!
        sound.playType();
        const nextIndex = currentIndex + 1;
        charIndexRef.current = nextIndex;
        setCharIndex(nextIndex);

        // Se sob efeito de Cegueira (Blind), dissipa progressivamente a cada acerto
        if (activeStatusEffectRef.current?.type === 'blind') {
          const nextProg = (activeStatusEffectRef.current.progress || 0) + 1;
          if (nextProg >= activeStatusEffectRef.current.maxProgress) {
            sound.playUpgrade();
            spawnDamage(0, false, '👁️ VISÃO RESTAURADA!');
            setActiveStatusEffect(null);
            activeStatusEffectRef.current = null;
          } else {
            const updated = { ...activeStatusEffectRef.current, progress: nextProg };
            activeStatusEffectRef.current = updated;
            setActiveStatusEffect(updated);
          }
        }

        // Bônus de Equipamento (Arma e Relíquia)
        const weaponBonusDmg = (dungeon?.weapon?.bonusDmg ?? 0) + (dungeon?.relic?.bonusDmg ?? 0);
        const isWeakness = floorData.boss.weaknessKeys?.includes(finalChar.toLowerCase());

        let baseDamage = 1 + weaponBonusDmg;
        if (isWeakness) {
          // Teclas de Fraqueza PERFURAM 100% da armadura do Boss e causam dano crítico!
          const weaknessBonusPercent = dungeon?.weapon?.bonusWeaknessDmgPercent ?? 0;
          baseDamage = Math.round((2 + weaponBonusDmg) * (1 + weaknessBonusPercent / 100));

          // Perk: Vampirismo de Fraqueza
          const vampLevel = dungeon?.perks?.weaknessVampirism ?? 0;
          if (vampLevel > 0) {
            const healAmount = vampLevel * 2;
            setPlayerShield((prev) => Math.min(maxShield, prev + healAmount));
          }
        } else {
          // Teclas comuns sofrem mitigação da armadura natural do Boss
          const armor = floorData.boss.armorPercent || 0;
          if (armor > 0) {
            baseDamage = Math.max(1, Math.round(baseDamage * (1 - armor / 100)));
          }
        }

        // Boss ferido momentaneamente
        setIsBossHurt(true);
        setTimeout(() => setIsBossHurt(false), 80);

        // Verificação de palavra concluída (espaço ou fim do texto)
        let wordBonusDamage = 0;
        if (expectedChar === ' ' || nextIndex >= floorData.text.length) {
          if (wordCleanRef.current) {
            // Se sob efeito de Pavor (Fear), concluir uma palavra limpa restaura a coragem
            if (activeStatusEffectRef.current?.type === 'fear') {
              sound.playUpgrade();
              spawnDamage(0, false, '✨ CORAGEM RESTAURADA!');
              setActiveStatusEffect(null);
              activeStatusEffectRef.current = null;
            }

            // Perk: Combo Crítico
            const comboLevel = dungeon?.perks?.criticalCombo ?? 0;
            const comboMultiplier = 1 + comboLevel * 0.15;
            wordBonusDamage = Math.round((8 + floorData.floor * 2) * comboMultiplier);
            spawnDamage(wordBonusDamage, true);
          }
          wordCleanRef.current = true;
        }

        const totalDamage = baseDamage + wordBonusDamage;
        const nextHp = Math.max(0, bossHpRef.current - totalDamage);
        bossHpRef.current = nextHp;
        setBossHp(nextHp);

        // Gatilhos de Crowd Control (Debuffs) e QTE por porcentagem de HP do Boss
        const hpPct = Math.round((nextHp / floorData.boss.maxHp) * 100);

        // 1. Cegueira Digital (~70% HP)
        if (!blindTriggered && hpPct <= 70 && hpPct > 58) {
          setBlindTriggered(true);
          castStatusEffect({
            type: 'blind',
            label: 'CEGUEIRA DIGITAL',
            description: 'Visão ofuscada! Digite 4 teclas corretas para dissipar a névoa!',
            icon: '👁️',
            durationSeconds: 8,
            progress: 0,
            maxProgress: 4
          });
        }

        // 2. Paralisia de Buffer (~55% HP nos andares 3+)
        if (!holdTriggered && floorData.floor >= 3 && hpPct <= 55 && hpPct > 48) {
          setHoldTriggered(true);
          castStatusEffect({
            type: 'hold',
            label: 'PARALISIA DE BUFFER',
            description: 'Cursor congelado! Pressione [ESPAÇO] 3x para quebrar o gelo!',
            icon: '❄️',
            durationSeconds: 9,
            progress: 0,
            maxProgress: 3
          });
        }

        // 3. Onda de Pavor (~32% HP nos andares 2+)
        if (!fearTriggered && floorData.floor >= 2 && hpPct <= 32 && hpPct > 18) {
          setFearTriggered(true);
          castStatusEffect({
            type: 'fear',
            label: 'ONDA DE PAVOR',
            description: 'Tremor no sistema! Conclua 1 palavra inteira sem errar!',
            icon: '😱',
            durationSeconds: 6,
            progress: 0,
            maxProgress: 1
          });
        }

        // 4. Sobrecarga do Núcleo QTE (<= 50% HP)
        const halfHp = floorData.boss.maxHp * 0.5;
        if (!overloadTriggered && nextHp <= halfHp && nextHp > 0) {
          setOverloadTriggered(true);
          const pool =
            floorData.boss.weaknessKeys && floorData.boss.weaknessKeys.length > 0
              ? floorData.boss.weaknessKeys
              : ['f', 'j', 'd', 'k', 's', 'l', 'a'];
          const qteSeq = Array.from({ length: 4 }, () => pool[Math.floor(Math.random() * pool.length)].toUpperCase());
          overloadSequenceRef.current = qteSeq;
          setOverloadSequence(qteSeq);
          overloadIndexRef.current = 0;
          setOverloadIndex(0);
          overloadActiveRef.current = true;
          setOverloadActive(true);
        }

        // Vitória ao concluir o texto ou esgotar a vida do Boss
        if (nextIndex >= floorData.text.length || nextHp <= 0) {
          statusRef.current = 'victory';
          setStatus('victory');
          sound.playChallengeSuccess();
          onVictory(floorData);
        }
      } else {
        // Erro!
        sound.playError();
        wordCleanRef.current = false;
        setIsErrorShaking(true);
        setTimeout(() => setIsErrorShaking(false), 200);

        // Reduz o escudo do jogador com mitigação de armadura (Perk Endurecimento de Escudo)
        const hardeningLevel = dungeon?.perks?.shieldHardening ?? 0;
        const dmgMitigation = Math.min(0.5, hardeningLevel * 0.08); // 8% por nível
        const actualDmgTaken = Math.max(2, Math.round(6 * (1 - dmgMitigation)));

        setPlayerShield((prev) => {
          const nextShield = Math.max(0, prev - actualDmgTaken);
          if (nextShield <= 0) {
            statusRef.current = 'defeat';
            setStatus('defeat');
            sound.playChallengeFail();
          }
          return nextShield;
        });
      }
    },
    [
      blindTriggered,
      castStatusEffect,
      dungeon,
      fearTriggered,
      floorData,
      holdTriggered,
      maxShield,
      onVictory,
      overloadTriggered,
      spawnDamage
    ]
  );

  // Processa caracteres digitados no input nativo (suporte robusto a acentuação ABNT2 e composição IME)
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
    // Esvazia para a próxima combinação de teclas
    e.target.value = '';
  };

  // Captura teclas mortas (Dead), atalhos, Hold e QTE diretamente no teclado
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (statusRef.current !== 'playing') return;

    if (e.key === 'Escape') {
      if (pendingAccentRef.current) {
        e.preventDefault();
        setPendingAccent(null);
        pendingAccentRef.current = null;
        return;
      }
      e.preventDefault();
      onClose();
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

    // Se estiver sob efeito HOLD (Gelo), a tecla Espaço quebra o gelo diretamente
    if (activeStatusEffectRef.current?.type === 'hold') {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        processTypedChar(' ');
      } else if (e.key.length === 1) {
        e.preventDefault();
        sound.playGlitch();
        setIsErrorShaking(true);
        setTimeout(() => setIsErrorShaking(false), 200);
      }
      return;
    }

    // Se estiver em modo QTE de Sobrecarga, processa o golpe diretamente no keydown
    if (overloadActiveRef.current) {
      if (e.key.length === 1 || e.key.startsWith('Key')) {
        e.preventDefault();
        processTypedChar(e.key);
      }
      return;
    }

    // Identificação de teclas mortas (Dead) ou acentos isolados ('´', '~', '^', '`', "'")
    if (e.key === 'Dead' || isAccentKey(e.key)) {
      e.preventDefault();
      const targetChar = floorData.text[charIndexRef.current];
      const resolved = resolveDeadKey(e.nativeEvent, targetChar);
      if (resolved) {
        setPendingAccent(resolved);
        pendingAccentRef.current = resolved;
      }
      return;
    }
  };

  if (!isOpen) return null;

  const totalChars = floorData.text.length;
  const progressPercent = Math.min(100, Math.round((charIndex / totalChars) * 100));
  const hpPercent = Math.min(100, Math.max(0, Math.round((bossHp / floorData.boss.maxHp) * 100)));

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none"
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
      >
        <input
          ref={inputRef}
          id="rpg-chronicle-input"
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
          aria-label="Terminal de Digitação da Masmorra"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-6xl h-[92vh] max-h-[94vh] flex flex-col bg-gradient-to-b from-[#111624] via-[#0d121c] to-[#080b12] border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_70px_rgba(6,182,212,0.25)] overflow-hidden text-zinc-100"
        >
          {/* Header Superior */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800/80 bg-[#121826]/90">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono font-bold text-xs sm:text-sm shadow-sm">
                Andar {floorData.floor}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white truncate">{floorData.chapterTitle}</h3>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
              title="Abandonar Expedição (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Painel de Combate RPG (Boss HUD & Escudo do Jogador) */}
          <div className="relative px-6 py-4 bg-gradient-to-r from-rose-950/20 via-[#101522] to-cyan-950/20 border-b border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* Boss Status */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <motion.div
                animate={isBossHurt ? { x: [-6, 6, -6, 6, 0], scale: [1, 0.92, 1.08, 1] } : {}}
                transition={{ duration: 0.2 }}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 flex items-center justify-center text-4xl sm:text-5xl select-none flex-shrink-0 shadow-xl transition-all ${
                  isBossHurt
                    ? 'bg-rose-950 border-rose-400 shadow-[0_0_35px_rgba(244,63,94,0.7)]'
                    : 'bg-zinc-900/90 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
                }`}
              >
                {floorData.boss.avatar}
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base sm:text-lg font-black text-white truncate">{floorData.boss.name}</h4>
                  <span className="text-[10px] font-mono text-rose-300 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/50 shadow-sm">
                    BOSS
                  </span>
                  {overloadTriggered ? (
                    <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/50 animate-pulse">
                      ⚡ SOBRECARGA ATIVA
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-700/60">
                      FASE 1: NORMAL
                    </span>
                  )}
                  {floorData.boss.armorPercent && floorData.boss.armorPercent > 0 && (
                    <span
                      className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/50 flex items-center gap-1 shadow-sm"
                      title="Redução passiva de dano normal. Acerte teclas de fraqueza para ignorar 100% da armadura!"
                    >
                      <Shield className="w-2.5 h-2.5" />
                      ARMADURA: {floorData.boss.armorPercent}%
                    </span>
                  )}
                </div>

                {/* Barra de Vida do Monstro */}
                <div className="mt-2 w-52 sm:w-72 md:w-80">
                  <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                    <span className="flex items-center gap-1.5 text-rose-300">
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
                      <span>Vida do Guardião</span>
                    </span>
                    <span className="text-rose-200">
                      {bossHp} / {floorData.boss.maxHp} ({hpPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-3 sm:h-4 rounded-full bg-zinc-950 overflow-hidden border border-rose-900/70 p-0.5 shadow-inner">
                    <motion.div
                      animate={{ width: `${hpPercent}%` }}
                      transition={{ duration: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Números de Dano Flutuantes */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {damagePopups.map((p) => (
                <div
                  key={p.id}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  className={`absolute font-mono font-black text-sm sm:text-base animate-float-up px-2.5 py-1 rounded-lg shadow-lg backdrop-blur-sm z-30 ${
                    p.isCrit
                      ? 'bg-amber-500 text-black border border-amber-300 text-base sm:text-lg animate-bounce shadow-[0_0_15px_rgba(245,158,11,0.7)]'
                      : 'bg-rose-950/90 text-rose-200 border border-rose-500/70'
                  }`}
                >
                  {p.text}
                </div>
              ))}
            </div>

            {/* Escudo do Jogador */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 text-xs sm:text-sm font-mono text-cyan-300 font-bold">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>
                    Escudo: {playerShield} / {maxShield}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      playerShield / maxShield > 0.4
                        ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300'
                        : 'bg-rose-950 border border-rose-500/70 text-rose-300 animate-pulse'
                    }`}
                  >
                    {playerShield / maxShield > 0.4 ? 'INTEGRIDADE OK' : 'PERIGO CRÍTICO!'}
                  </span>
                </div>
                <div className="mt-2 w-44 sm:w-56 md:w-64 h-3 sm:h-4 rounded-full bg-zinc-950 overflow-hidden border border-cyan-900/70 p-0.5 shadow-inner ml-auto">
                  <motion.div
                    animate={{ width: `${Math.min(100, Math.max(0, Math.round((playerShield / maxShield) * 100)))}%` }}
                    transition={{ duration: 0.2 }}
                    className={`h-full rounded-full transition-all ${
                      playerShield / maxShield > 0.4
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                        : 'bg-gradient-to-r from-rose-500 to-amber-500 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.8)]'
                    }`}
                  />
                </div>

                {/* Bônus de Equipamento & Perks em Combate */}
                {dungeon && (
                  <div className="flex items-center justify-end gap-2.5 mt-2 text-[10px] font-mono text-zinc-400">
                    {dungeon.weapon.bonusDmg > 0 && (
                      <span className="text-amber-300 flex items-center gap-0.5 font-bold" title="Bônus de Dano da Arma">
                        <Swords className="w-3 h-3" />+{dungeon.weapon.bonusDmg} Dano
                      </span>
                    )}
                    {dungeon.perks.weaknessVampirism > 0 && (
                      <span className="text-rose-400" title="Vampirismo em Fraquezas">
                        🩸 Nv.{dungeon.perks.weaknessVampirism}
                      </span>
                    )}
                    {dungeon.perks.criticalCombo > 0 && (
                      <span className="text-cyan-400" title="Bônus em Combo Perfeito">
                        ⚡ Nv.{dungeon.perks.criticalCombo}
                      </span>
                    )}
                    {dungeon.perks.shieldHardening > 0 && (
                      <span className="text-indigo-400" title="Mitigação de Escudo">
                        🛡️ Nv.{dungeon.perks.shieldHardening}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Banner de Telegrafia de Magia do Boss */}
          {telegraphSpell && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-900 via-purple-900 to-rose-900 border-b-2 border-rose-400 flex items-center justify-center gap-3 text-rose-100 font-mono font-bold text-xs sm:text-sm animate-pulse shadow-[0_0_30px_rgba(244,63,94,0.6)] z-20"
            >
              <AlertCircle className="w-5 h-5 text-rose-300 animate-bounce flex-shrink-0" />
              <span>
                ⚠️ ALERTA: {floorData.boss.name} ESTÁ CONJURANDO{' '}
                <strong className="text-amber-300 uppercase underline decoration-amber-400 tracking-wide">
                  [{telegraphSpell.icon} {telegraphSpell.label}]
                </strong>
                ! PREPARE-SE!
              </span>
            </motion.div>
          )}

          {/* Banner de Efeito de Status Ativo (Crowd Control de RPG) */}
          {activeStatusEffect && (
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`px-6 py-2.5 border-b-2 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono z-20 ${
                activeStatusEffect.type === 'hold'
                  ? 'bg-gradient-to-r from-cyan-950 via-blue-950 to-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                  : activeStatusEffect.type === 'fear'
                  ? 'bg-gradient-to-r from-purple-950 via-rose-950 to-purple-950 border-purple-400 text-purple-200 shadow-[0_0_25px_rgba(168,85,247,0.4)] animate-pulse'
                  : 'bg-gradient-to-r from-zinc-900 via-amber-950/70 to-zinc-900 border-amber-400 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeStatusEffect.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs sm:text-sm tracking-wider uppercase">
                      {activeStatusEffect.label}
                    </span>
                    <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded border border-white/20 font-bold">
                      DEBUFF ATIVO
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90">{activeStatusEffect.description}</p>
                </div>
              </div>

              {activeStatusEffect.type === 'hold' && (
                <div className="flex items-center gap-2 bg-black/70 px-3.5 py-1.5 rounded-xl border border-cyan-400/60 shadow-inner">
                  <Snowflake className="w-4 h-4 text-cyan-300 animate-spin" />
                  <span className="text-xs font-bold text-cyan-300">
                    PRESSIONE [ESPAÇO]: {activeStatusEffect.progress || 0} / {activeStatusEffect.maxProgress}
                  </span>
                </div>
              )}

              {activeStatusEffect.type === 'blind' && (
                <div className="flex items-center gap-2 bg-black/70 px-3.5 py-1.5 rounded-xl border border-amber-400/60 shadow-inner">
                  <EyeOff className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold text-amber-300">
                    ACERTOS RESTANTES: {(activeStatusEffect.maxProgress || 4) - (activeStatusEffect.progress || 0)}
                  </span>
                </div>
              )}

              {activeStatusEffect.type === 'fear' && (
                <div className="flex items-center gap-2 bg-black/70 px-3.5 py-1.5 rounded-xl border border-purple-400/60 shadow-inner">
                  <Activity className="w-4 h-4 text-purple-300 animate-pulse" />
                  <span className="text-xs font-bold text-purple-300">
                    DIGITE A PALAVRA SEM ERROS
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {/* Banner de Minigame QTE: Sobrecarga do Núcleo */}
          {overloadActive && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-6 py-3 bg-gradient-to-r from-amber-950 via-rose-950 to-amber-950 border-b-2 border-amber-400 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_30px_rgba(245,158,11,0.5)] z-20"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400 animate-bounce" />
                <div>
                  <span className="font-mono font-black text-amber-300 text-xs sm:text-sm tracking-wider uppercase">
                    ⚠️ SOBRECARGA DO NÚCLEO DO BOSS!
                  </span>
                  <p className="text-[11px] text-amber-200/80 font-mono">
                    Pressione as teclas na ordem para atordoar o guardião e causar dano crítico massivo:
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {overloadSequence.map((key, idx) => {
                  const isDone = idx < overloadIndex;
                  const isCurrent = idx === overloadIndex;
                  return (
                    <motion.span
                      key={idx}
                      animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-base border-2 shadow-lg transition-all ${
                        isDone
                          ? 'bg-emerald-500 text-black border-emerald-300 shadow-emerald-500/50'
                          : isCurrent
                          ? 'bg-amber-400 text-black border-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.8)] scale-110'
                          : 'bg-black/60 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {key}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Fraquezas de Tecla do Boss */}
          {floorData.boss.weaknessKeys && floorData.boss.weaknessKeys.length > 0 && (
            <div className="px-6 py-2.5 bg-[#0c1018] border-b border-zinc-800/80 flex items-center gap-2.5 text-xs font-mono text-zinc-400">
              <Target className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="font-bold text-zinc-300">Fraquezas do Guardião:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {floorData.boss.weaknessKeys.map((k) => (
                  <span
                    key={k}
                    className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/60 text-amber-300 font-bold uppercase text-xs shadow-[0_0_8px_rgba(245,158,11,0.25)]"
                  >
                    [{k}]
                  </span>
                ))}
              </div>
              <span className="text-amber-400/90 ml-auto text-[11px] hidden sm:inline font-semibold">
                ⚡ Ignoram 100% da Armadura + Dano Crítico Massivo!
              </span>
            </div>
          )}

          {/* Área de Digitação do Texto Completo Literário */}
          <div
            ref={textContainerRef}
            className={`relative flex-1 overflow-y-auto p-6 sm:p-10 font-mono leading-relaxed tracking-wide text-lg sm:text-xl md:text-2xl select-none custom-scrollbar transition-all ${
              isErrorShaking ? 'animate-shake' : ''
            } ${
              activeStatusEffect?.type === 'fear'
                ? 'animate-pulse shadow-[inset_0_0_50px_rgba(168,85,247,0.25)] bg-[#0e0a16]'
                : ''
            } ${
              activeStatusEffect?.type === 'hold'
                ? 'shadow-[inset_0_0_50px_rgba(6,182,212,0.25)] bg-[#070e1a]'
                : ''
            }`}
          >
            {/* Aviso de Hold diretamente dentro da área de texto */}
            {activeStatusEffect?.type === 'hold' && (
              <div className="sticky top-0 z-10 mb-4 px-4 py-2.5 rounded-xl bg-cyan-950/90 border-2 border-cyan-400 text-cyan-200 text-center font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.5)] backdrop-blur-md flex items-center justify-center gap-3">
                <Snowflake className="w-5 h-5 text-cyan-300 animate-spin" />
                <span>
                  MEMÓRIA CONGELADA! Pressione a barra de [ESPAÇO] para estilhaçar o gelo ({activeStatusEffect.progress || 0}/3)
                </span>
              </div>
            )}

            {pendingAccent && (
              <div className="inline-block px-3 py-1.5 mb-3 rounded-lg bg-amber-500/25 text-amber-300 border border-amber-500/50 text-xs font-bold font-mono animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                ⌨️ {getAccentDisplayName(pendingAccent)} (digite a vogal correspondente)
              </div>
            )}

            <div className="break-words whitespace-pre-wrap">
              {floorData.text.split('').map((char, idx) => {
                const isDone = idx < charIndex;
                const isCurrent = idx === charIndex;
                const isBlindMuffled =
                  activeStatusEffect?.type === 'blind' && idx >= charIndex && idx < charIndex + 6;

                if (isDone) {
                  return (
                    <span key={idx} className="text-emerald-400 font-semibold">
                      {char}
                    </span>
                  );
                }

                if (isCurrent) {
                  return (
                    <span
                      key={idx}
                      ref={currentSpanRef}
                      className={`relative px-0.5 rounded font-black ${
                        activeStatusEffect?.type === 'hold'
                          ? 'bg-blue-600/40 text-cyan-200 border-b-2 border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.8)]'
                          : isBlindMuffled
                          ? 'bg-amber-500/30 text-amber-200 blur-[2px]'
                          : 'bg-cyan-400/30 text-white underline decoration-cyan-400 decoration-2 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                      }`}
                    >
                      {isBlindMuffled ? '?' : char}
                      <span className="absolute -bottom-1 left-0 right-0 h-1 bg-cyan-400 animate-pulse rounded-full" />
                    </span>
                  );
                }

                if (isBlindMuffled) {
                  return (
                    <span key={idx} className="text-zinc-600 blur-[4px] select-none">
                      ?
                    </span>
                  );
                }

                return (
                  <span key={idx} className="text-zinc-500">
                    {char}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Barra de Progresso do Texto */}
          <div className="px-6 py-3 bg-[#0a0d14] border-t border-zinc-800/80 flex items-center justify-between gap-3 text-xs sm:text-sm font-mono">
            <span className="text-zinc-400">
              Progresso do Capítulo: <strong className="text-white">{progressPercent}%</strong> ({charIndex} /{' '}
              {totalChars} caracteres)
            </span>
            <span className="text-cyan-400 text-xs hidden sm:inline">
              Mantenha o ritmo! Acerte acentos e pontuações para amplificar o dano.
            </span>
          </div>

          {/* Overlay de Vitória */}
          {status === 'victory' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/30 to-emerald-500/20 border-2 border-amber-400/80 flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(245,158,11,0.5)] animate-bounce mb-3">
                🏆
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">ANDAR {floorData.floor} CONQUISTADO!</h2>
              <p className="text-sm text-zinc-300 mt-1 max-w-md">
                Você derrotou <strong className="text-amber-400">{floorData.boss.name}</strong> e restaurou o código
                deste setor do Mainframe!
              </p>

              {/* Recompensas Conquistadas */}
              <div className="flex items-center gap-3 mt-4 flex-wrap justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 font-mono font-bold text-emerald-300 text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  +{formatBytes(floorData.rewardBytes)}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/50 font-mono font-bold text-amber-300 text-sm">
                  <Coins className="w-4 h-4 text-amber-400" />
                  +{floorData.rewardTokens} Fichas
                </span>
                {floorData.rewardFragments && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 font-mono font-bold text-cyan-300 text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    +{floorData.rewardFragments} Frag. Quânticos
                  </span>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
                {onNextFloor && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onNextFloor();
                    }}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs sm:text-sm font-mono tracking-wider transition shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer"
                  >
                    <span>AVANÇAR PARA O ANDAR {floorData.floor + 1}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold text-xs sm:text-sm font-mono transition border border-zinc-700 cursor-pointer"
                >
                  Voltar ao Terminal
                </button>
              </div>
            </motion.div>
          )}

          {/* Overlay de Derrota */}
          {status === 'defeat' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border-2 border-rose-500/80 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(244,63,94,0.5)] mb-3">
                💀
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-rose-300">ESCUDO ROMPIDO!</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-md">
                O guardião quebrou sua concentração motora. Não se preocupe: você pode reiniciar a qualquer momento sem
                nenhuma perda de progresso!
              </p>

              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={() => {
                    sound.playClick();
                    setCharIndex(0);
                    charIndexRef.current = 0;
                    setBossHp(floorData.boss.maxHp);
                    bossHpRef.current = floorData.boss.maxHp;
                    setPlayerShield(maxShield);
                    setPendingAccent(null);
                    pendingAccentRef.current = null;
                    setOverloadTriggered(false);
                    setOverloadActive(false);
                    overloadActiveRef.current = false;
                    setOverloadSequence([]);
                    overloadSequenceRef.current = [];
                    setOverloadIndex(0);
                    overloadIndexRef.current = 0;
                    setStatus('playing');
                    statusRef.current = 'playing';
                    wordCleanRef.current = true;
                    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-black font-black text-xs font-mono transition shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>TENTAR NOVAMENTE</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold text-xs font-mono transition border border-zinc-700 cursor-pointer"
                >
                  Sair
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
