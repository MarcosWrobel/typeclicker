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
  Lock,
  Clock
} from 'lucide-react';
import { RpgFloorData, DungeonState, RpgActiveStatusEffect } from '../types/quests';
import { RpgClassType, RPG_CLASSES } from '../types/rpgClass';
import { sound } from '../utils/audio';
import { formatBytes } from '../utils/formatting';
import { combineAccent, isAccentKey, resolveDeadKey, getAccentDisplayName } from '../utils/keyboardAccents';

interface RpgChronicleArenaProps {
  isOpen: boolean;
  floorData: RpgFloorData;
  dungeon?: DungeonState;
  rpgClass?: RpgClassType;
  onVictory: (floorData: RpgFloorData) => void;
  onClose: () => void;
  onNextFloor?: () => void;
  availableKeys?: number;
  onConsumeKey?: () => boolean;
  isAdmin?: boolean;
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
  rpgClass,
  onVictory,
  onClose,
  onNextFloor,
  availableKeys,
  onConsumeKey,
  isAdmin
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

  // Gestão de Chaves de Expedição para Reiniciar após Derrota
  const keysCount = availableKeys ?? dungeon?.keys ?? 0;
  const hasKeysToRetry = isAdmin || keysCount > 0;

  // Mecânica de Minigame QTE: Sobrecarga do Núcleo do Boss aos 50% de HP
  const [overloadTriggered, setOverloadTriggered] = useState(false);
  const [overloadActive, setOverloadActive] = useState(false);
  const [overloadSequence, setOverloadSequence] = useState<string[]>([]);
  const [overloadIndex, setOverloadIndex] = useState(0);

  // Efeitos de Controle de Grupo (Crowd Control de RPG: Blind, Fear, Hold)
  const [activeStatusEffect, setActiveStatusEffect] = useState<RpgActiveStatusEffect | null>(null);
  const activeStatusEffectRef = useRef<RpgActiveStatusEffect | null>(null);
  const [debuffSecondsLeft, setDebuffSecondsLeft] = useState<number>(0);
  const debuffSecondsLeftRef = useRef<number>(0);
  const [blindTriggered, setBlindTriggered] = useState(false);
  const [fearTriggered, setFearTriggered] = useState(false);
  const [holdTriggered, setHoldTriggered] = useState(false);

  // Guards síncronos via useRef para evitar disparos duplicados durante digitação rápida
  const blindTriggeredRef = useRef(false);
  const fearTriggeredRef = useRef(false);
  const holdTriggeredRef = useRef(false);

  // Estados de Splash Central (Aparece 1 único aviso central e depois volta ao topo)
  const [showCenterDebuff, setShowCenterDebuff] = useState(false);
  const centerDebuffTimeoutRef = useRef<number | null>(null);

  // Refs para prevenir race conditions e closures desatualizadas na digitação veloz
  const charIndexRef = useRef(0);
  const bossHpRef = useRef(floorData.boss.maxHp);
  const statusRef = useRef<'playing' | 'victory' | 'defeat'>('playing');
  const pendingAccentRef = useRef<string | null>(null);
  const overloadTriggeredRef = useRef(false);
  const overloadActiveRef = useRef(false);
  const overloadIndexRef = useRef(0);
  const overloadSequenceRef = useRef<string[]>([]);
  const wordCleanRef = useRef<boolean>(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const currentSpanRef = useRef<HTMLSpanElement>(null);

  // Mecânica de Ataque Iminente (Boss Cast Bar) e Modo de Fúria (< 30% HP)
  const [bossChargeProgress, setBossChargeProgress] = useState(0);
  const bossChargeProgressRef = useRef(0);
  const [isEnraged, setIsEnraged] = useState(false);
  const isEnragedRef = useRef(false);

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
  useEffect(() => {
    bossChargeProgressRef.current = bossChargeProgress;
  }, [bossChargeProgress]);
  useEffect(() => {
    isEnragedRef.current = isEnraged;
  }, [isEnraged]);

  // Limpa debuffs ativos e timers associados
  const clearDebuff = useCallback(() => {
    if (centerDebuffTimeoutRef.current) {
      clearTimeout(centerDebuffTimeoutRef.current);
      centerDebuffTimeoutRef.current = null;
    }
    setShowCenterDebuff(false);
    setActiveStatusEffect(null);
    activeStatusEffectRef.current = null;
    setDebuffSecondsLeft(0);
    debuffSecondsLeftRef.current = 0;
  }, []);

  // Limpeza no ciclo de desmontagem do componente
  useEffect(() => {
    return () => {
      if (centerDebuffTimeoutRef.current) clearTimeout(centerDebuffTimeoutRef.current);
    };
  }, []);

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

  // Conjura um debuff de RPG no jogador com 1 aviso único e ultralegível centralizado que migra para o topo
  const castStatusEffect = useCallback((effect: RpgActiveStatusEffect) => {
    setActiveStatusEffect(effect);
    activeStatusEffectRef.current = effect;
    setDebuffSecondsLeft(effect.durationSeconds);
    debuffSecondsLeftRef.current = effect.durationSeconds;
    setShowCenterDebuff(true);
    sound.playChallengeFail();

    if (centerDebuffTimeoutRef.current) {
      clearTimeout(centerDebuffTimeoutRef.current);
    }
    // O aviso central fica em destaque por 2.2s e depois recolhe suavemente para o banner permanente no topo
    centerDebuffTimeoutRef.current = window.setTimeout(() => {
      setShowCenterDebuff(false);
    }, 2200);
  }, []);

  // Temporizador regressivo em tempo real com punição direta se esgotar
  useEffect(() => {
    if (!activeStatusEffect) {
      setDebuffSecondsLeft(0);
      debuffSecondsLeftRef.current = 0;
      return;
    }

    const interval = setInterval(() => {
      setDebuffSecondsLeft((prev) => {
        const next = Math.max(0, parseFloat((prev - 0.1).toFixed(1)));
        debuffSecondsLeftRef.current = next;

        if (next <= 0) {
          clearInterval(interval);
          // O tempo esgotou sem cumprir a condição!
          // Aplica punição direta: Dano pesado no escudo!
          const hardeningLevel = dungeon?.perks?.shieldHardening ?? 0;
          const dmgMitigation = Math.min(0.4, hardeningLevel * 0.035);
          const directDmg = Math.max(10, Math.round(25 * (1 - dmgMitigation)));

          sound.playChallengeFail();
          setIsErrorShaking(true);
          setTimeout(() => setIsErrorShaking(false), 400);
          spawnDamage(directDmg, false, `💥 TEMPO ESGOTADO! -${directDmg} DIRETO!`);

          setPlayerShield((shieldPrev) => {
            const nextShield = Math.max(0, shieldPrev - directDmg);
            if (nextShield <= 0) {
              statusRef.current = 'defeat';
              setStatus('defeat');
            }
            return nextShield;
          });

          clearDebuff();
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStatusEffect, clearDebuff, dungeon, spawnDamage]);

  // Temporizador de Carga de Ataque Iminente do Chefe (Boss Cast Bar)
  useEffect(() => {
    if (!isOpen || status !== 'playing') {
      return;
    }

    const intervalMs = 100;
    const timer = setInterval(() => {
      if (statusRef.current !== 'playing') return;
      // Pausa a carga se estiver em fase QTE de Sobrecarga
      if (overloadActiveRef.current) return;

      const currentFloor = floorData.floor;
      const baseSec = Math.max(4.2, 7.5 - currentFloor * 0.25);
      const speedMult = isEnragedRef.current ? 1.4 : 1.0;
      const effectiveSec = baseSec / speedMult;
      const incrementPerTick = (100 / effectiveSec) * (intervalMs / 1000);

      const currentProg = bossChargeProgressRef.current;
      const nextProg = currentProg + incrementPerTick;

      if (nextProg >= 100) {
        // Golpe autônomo do Boss dispara!
        bossChargeProgressRef.current = 0;
        setBossChargeProgress(0);

        const enraged = isEnragedRef.current;
        const rawStrikeDmg = Math.round((14 + currentFloor * 1.5) * (enraged ? 1.4 : 1.0));
        const hardeningLevel = dungeon?.perks?.shieldHardening ?? 0;
        const dmgMitigation = Math.min(0.4, hardeningLevel * 0.035);
        const actualStrikeDmg = Math.max(8, Math.round(rawStrikeDmg * (1 - dmgMitigation)));

        sound.playChallengeFail();
        setIsErrorShaking(true);
        setTimeout(() => setIsErrorShaking(false), 400);
        spawnDamage(actualStrikeDmg, false, `💥 GOLPE DO CHEFE! -${actualStrikeDmg} DIRETO!`);

        setPlayerShield((prevShield) => {
          const nextShield = Math.max(0, prevShield - actualStrikeDmg);
          if (nextShield <= 0) {
            statusRef.current = 'defeat';
            setStatus('defeat');
            sound.playChallengeFail();
          }
          return nextShield;
        });
      } else {
        bossChargeProgressRef.current = nextProg;
        setBossChargeProgress(nextProg);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, status, floorData.floor, dungeon, spawnDamage]);

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
      overloadTriggeredRef.current = false;
      setOverloadActive(false);
      overloadActiveRef.current = false;
      setOverloadSequence([]);
      overloadSequenceRef.current = [];
      setOverloadIndex(0);
      overloadIndexRef.current = 0;
      setBossChargeProgress(0);
      bossChargeProgressRef.current = 0;
      setIsEnraged(false);
      isEnragedRef.current = false;
      clearDebuff();
      setBlindTriggered(false);
      blindTriggeredRef.current = false;
      setFearTriggered(false);
      fearTriggeredRef.current = false;
      setHoldTriggered(false);
      holdTriggeredRef.current = false;
      wordCleanRef.current = true;
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 80);
    }
  }, [isOpen, floorData, maxShield, clearDebuff]);

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

  // Mantém o cursor visível no scroll (modo 'auto' instantâneo evita layout thrashing na digitação veloz)
  useEffect(() => {
    if (currentSpanRef.current) {
      currentSpanRef.current.scrollIntoView({
        behavior: 'auto',
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
            clearDebuff();
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

            // Checagem de Fúria do Boss (< 30% HP)
            const enrageThreshold = floorData.boss.maxHp * 0.3;
            if (nextHp <= enrageThreshold && nextHp > 0 && !isEnragedRef.current) {
              isEnragedRef.current = true;
              setIsEnraged(true);
              sound.playChallengeFail();
              spawnDamage(0, true, '🔥 PROTOCOLO DE FÚRIA ATIVADO!');
            }

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
            clearDebuff();
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

          // Atordoamento Crítico: Empurra a Carga de Ataque do Boss (-25%)!
          bossChargeProgressRef.current = Math.max(0, bossChargeProgressRef.current - 25);
          setBossChargeProgress(bossChargeProgressRef.current);
          spawnDamage(0, false, '⚡ INTERRUPÇÃO! (-25% Carga)');

          // Perk: Vampirismo de Fraqueza
          const vampLevel = dungeon?.perks?.weaknessVampirism ?? 0;
          if (vampLevel > 0) {
            const healAmount = Math.max(1, Math.floor(vampLevel * 0.6));
            setPlayerShield((prev) => Math.min(maxShield, prev + healAmount));
          }
        } else {
          // Teclas comuns atrasam ligeiramente a carga do Boss (-2.5%)
          bossChargeProgressRef.current = Math.max(0, bossChargeProgressRef.current - 2.5);
          setBossChargeProgress(bossChargeProgressRef.current);

          // Teclas comuns sofrem mitigação da armadura natural do Boss
          const armor = floorData.boss.armorPercent || 0;
          if (armor > 0) {
            baseDamage = Math.max(1, Math.round(baseDamage * (1 - armor / 100)));
          }
        }

        // Passiva de Classe: Guerreiro Veloz causa +25% de dano base
        if (rpgClass === 'warrior') {
          baseDamage = Math.max(1, Math.round(baseDamage * 1.25));
        }

        // Passiva de Classe: Mago dos Bytes regenera escudo ao acertar fraqueza
        if (rpgClass === 'mage' && isWeakness) {
          setPlayerShield((prev) => Math.min(maxShield, prev + 3));
        }

        // Boss ferido momentaneamente
        setIsBossHurt(true);
        setTimeout(() => setIsBossHurt(false), 80);

        // Verificação de palavra concluída (espaço ou fim do texto)
        let wordBonusDamage = 0;
        if (expectedChar === ' ' || nextIndex >= floorData.text.length) {
          if (wordCleanRef.current) {
            // Atordoamento de Palavra Limpa: Empurra a Carga do Boss (-30%)!
            bossChargeProgressRef.current = Math.max(0, bossChargeProgressRef.current - 30);
            setBossChargeProgress(bossChargeProgressRef.current);

            // Se sob efeito de Pavor (Fear), concluir uma palavra limpa restaura a coragem
            if (activeStatusEffectRef.current?.type === 'fear') {
              sound.playUpgrade();
              spawnDamage(0, false, '✨ CORAGEM RESTAURADA!');
              clearDebuff();
            }

            // Passiva de Classe: Mago dos Bytes restaura +10 de Escudo em palavra limpa
            if (rpgClass === 'mage') {
              setPlayerShield((prev) => Math.min(maxShield, prev + 10));
              spawnDamage(0, false, '✨ Barreira Arcana (+10 Escudo)!');
            }

            // Perk: Combo Crítico
            const comboLevel = dungeon?.perks?.criticalCombo ?? 0;
            const comboMultiplier = 1 + comboLevel * 0.05;
            wordBonusDamage = Math.round((8 + floorData.floor * 2) * comboMultiplier);

            // Passiva de Classe: Arqueiro amplia o bônus de palavra limpa (+30%)
            if (rpgClass === 'archer') {
              wordBonusDamage = Math.round(wordBonusDamage * 1.30);
            }
            // Passiva de Classe: Guerreiro desfere impacto motor na palavra limpa (+25%)
            if (rpgClass === 'warrior') {
              wordBonusDamage = Math.round(wordBonusDamage * 1.25);
            }

            spawnDamage(wordBonusDamage, true);
          }
          wordCleanRef.current = true;
        }

        const totalDamage = baseDamage + wordBonusDamage;
        const nextHp = Math.max(0, bossHpRef.current - totalDamage);
        bossHpRef.current = nextHp;
        setBossHp(nextHp);

        // Checagem de Fúria do Boss (< 30% HP)
        const enrageThreshold = floorData.boss.maxHp * 0.3;
        if (nextHp <= enrageThreshold && nextHp > 0 && !isEnragedRef.current) {
          isEnragedRef.current = true;
          setIsEnraged(true);
          sound.playChallengeFail();
          spawnDamage(0, true, '🔥 PROTOCOLO DE FÚRIA ATIVADO!');
        }

        // Gatilhos de Crowd Control (Debuffs) e QTE por porcentagem de HP do Boss
        const hpPct = Math.round((nextHp / floorData.boss.maxHp) * 100);

        // 1. Cegueira Digital (~70% HP)
        if (!blindTriggeredRef.current && hpPct <= 70 && hpPct > 58) {
          blindTriggeredRef.current = true;
          setBlindTriggered(true);
          castStatusEffect({
            type: 'blind',
            label: 'CEGUEIRA DIGITAL',
            description: 'Visão ofuscada! Digite 4 teclas corretas pela memória motora!',
            icon: '👁️',
            durationSeconds: 8,
            progress: 0,
            maxProgress: 4,
            breakInstruction: 'Digite 4 teclas pela memória motora!',
            penaltyDescription: 'Se zerar: -25 DIRETO no escudo! Erros custam 2x mais!'
          });
        }

        // 2. Paralisia de Buffer (~55% HP nos andares 3+)
        if (!holdTriggeredRef.current && floorData.floor >= 3 && hpPct <= 55 && hpPct > 48) {
          holdTriggeredRef.current = true;
          setHoldTriggered(true);
          castStatusEffect({
            type: 'hold',
            label: 'PARALISIA DE BUFFER (GELO)',
            description: 'Cursor congelado! Pressione a barra de [ESPAÇO] 3x para quebrar o gelo!',
            icon: '❄️',
            durationSeconds: 8,
            progress: 0,
            maxProgress: 3,
            breakInstruction: 'Golpeie a barra de [ESPAÇO] 3 vezes!',
            penaltyDescription: 'Se zerar: -25 DIRETO no escudo! Erros custam 2x mais!'
          });
        }

        // 3. Onda de Pavor (~32% HP nos andares 2+)
        if (!fearTriggeredRef.current && floorData.floor >= 2 && hpPct <= 32 && hpPct > 18) {
          fearTriggeredRef.current = true;
          setFearTriggered(true);
          castStatusEffect({
            type: 'fear',
            label: 'ONDA DE PAVOR (INTERFERÊNCIA)',
            description: 'Tremor no sistema! Conclua 1 palavra inteira com 100% de perfeição!',
            icon: '😱',
            durationSeconds: 7,
            progress: 0,
            maxProgress: 1,
            breakInstruction: 'Conclua a palavra atual sem cometer nenhum erro!',
            penaltyDescription: 'Se zerar: -25 DIRETO no escudo! Erros custam 2x mais!'
          });
        }

        // 4. Sobrecarga do Núcleo QTE (<= 50% HP)
        const halfHp = floorData.boss.maxHp * 0.5;
        if (!overloadTriggeredRef.current && nextHp <= halfHp && nextHp > 0) {
          overloadTriggeredRef.current = true;
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

        // Erro acelera o ataque iminente do Boss (+10% Carga)!
        bossChargeProgressRef.current = Math.min(100, bossChargeProgressRef.current + 10);
        setBossChargeProgress(bossChargeProgressRef.current);

        // Dano de erro escalonado pela profundidade do andar
        const isUnderDebuff = !!activeStatusEffectRef.current;
        const isEnraged = isEnragedRef.current;
        let baseDmg = 7 + Math.floor(floorData.floor * 1.4);
        if (isUnderDebuff) baseDmg *= 2;
        if (isEnraged) baseDmg = Math.round(baseDmg * 1.5);

        // Reduz o escudo do jogador com mitigação de armadura (Perk Endurecimento de Escudo)
        const hardeningLevel = dungeon?.perks?.shieldHardening ?? 0;
        const dmgMitigation = Math.min(0.4, hardeningLevel * 0.035); // 3.5% por nível
        const actualDmgTaken = Math.max(isUnderDebuff ? 6 : 3, Math.round(baseDmg * (1 - dmgMitigation)));

        if (isUnderDebuff && isEnraged) {
          spawnDamage(actualDmgTaken, false, `💥 ERRO CRÍTICO NA FÚRIA! -${actualDmgTaken} (3X DANO)`);
        } else if (isUnderDebuff) {
          spawnDamage(actualDmgTaken, false, `💥 ERRO SOB DEBUFF! -${actualDmgTaken} (2X DANO)`);
        } else if (isEnraged) {
          spawnDamage(actualDmgTaken, false, `🔥 ERRO NA FÚRIA! -${actualDmgTaken} (+50% DANO)`);
        }

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

  const handleRestartFight = useCallback(() => {
    setCharIndex(0);
    charIndexRef.current = 0;
    setBossHp(floorData.boss.maxHp);
    bossHpRef.current = floorData.boss.maxHp;
    setPlayerShield(maxShield);
    setPendingAccent(null);
    pendingAccentRef.current = null;
    setOverloadTriggered(false);
    overloadTriggeredRef.current = false;
    setOverloadActive(false);
    overloadActiveRef.current = false;
    setOverloadSequence([]);
    overloadSequenceRef.current = [];
    setOverloadIndex(0);
    overloadIndexRef.current = 0;
    setBossChargeProgress(0);
    bossChargeProgressRef.current = 0;
    setIsEnraged(false);
    isEnragedRef.current = false;
    clearDebuff();
    setBlindTriggered(false);
    blindTriggeredRef.current = false;
    setFearTriggered(false);
    fearTriggeredRef.current = false;
    setHoldTriggered(false);
    holdTriggeredRef.current = false;
    setStatus('playing');
    statusRef.current = 'playing';
    wordCleanRef.current = true;
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
  }, [clearDebuff, floorData, maxShield]);

  if (!isOpen) return null;

  const totalChars = floorData.text.length;
  const progressPercent = Math.min(100, Math.round((charIndex / totalChars) * 100));
  const hpPercent = Math.min(100, Math.max(0, Math.round((bossHp / floorData.boss.maxHp) * 100)));

  const baseChargeTime = Math.max(4.2, 7.5 - floorData.floor * 0.25);
  const effectiveChargeTime = isEnraged ? baseChargeTime / 1.4 : baseChargeTime;
  const chargeSecondsRemaining = Math.max(0, ((100 - bossChargeProgress) / 100) * effectiveChargeTime);

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
          className={`relative w-full max-w-6xl h-[92vh] max-h-[94vh] flex flex-col bg-gradient-to-b from-[#111624] via-[#0d121c] to-[#080b12] border-2 rounded-2xl overflow-hidden text-zinc-100 transition-all duration-300 ${
            isEnraged
              ? 'border-red-500 shadow-[0_0_90px_rgba(239,68,68,0.45)]'
              : 'border-cyan-500/50 shadow-[0_0_70px_rgba(6,182,212,0.25)]'
          }`}
        >

          {/* Splash Central de Instrução do Debuff (Destaque Central -> Volta ao Topo) */}
          <AnimatePresence>
            {showCenterDebuff && activeStatusEffect && (
              <motion.div
                key="center-debuff"
                initial={{ scale: 0.6, y: 40, opacity: 0 }}
                animate={{ scale: [0.6, 1.05, 1], y: 0, opacity: 1 }}
                exit={{ scale: 0.75, y: -220, opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="absolute inset-0 z-50 flex items-center justify-center p-4 pointer-events-none select-none bg-black/50 backdrop-blur-[3px]"
              >
                <div
                  className={`relative w-full max-w-md sm:max-w-lg p-6 sm:p-8 rounded-3xl border-4 shadow-2xl flex flex-col items-center text-center font-mono ${
                    activeStatusEffect.type === 'hold'
                      ? 'bg-gradient-to-b from-[#0e2238] via-[#091524] to-[#040a12] border-cyan-400 shadow-[0_0_90px_rgba(6,182,212,0.7)] text-cyan-100'
                      : activeStatusEffect.type === 'fear'
                      ? 'bg-gradient-to-b from-[#2b0c38] via-[#1a0724] to-[#0a0212] border-purple-400 shadow-[0_0_90px_rgba(168,85,247,0.7)] text-purple-100 animate-pulse'
                      : 'bg-gradient-to-b from-[#381c08] via-[#241105] to-[#120802] border-amber-400 shadow-[0_0_90px_rgba(245,158,11,0.7)] text-amber-100'
                  }`}
                >
                  <div className="w-20 h-20 rounded-2xl bg-black/70 border-2 border-current flex items-center justify-center text-5xl mb-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-bounce">
                    {activeStatusEffect.icon}
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-black mb-2 animate-pulse">
                    ⚠️ DEBUFF ATIVO!
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-1">
                    {activeStatusEffect.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 mb-4 max-w-sm">
                    {activeStatusEffect.description}
                  </p>

                  <div className="w-full bg-black/85 rounded-2xl p-4 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] mb-4">
                    <span className="text-[11px] font-black text-amber-300 uppercase tracking-widest block mb-1">
                      👉 COMO QUEBRAR:
                    </span>
                    <span className="text-base sm:text-lg font-black text-white leading-snug block">
                      {activeStatusEffect.breakInstruction}
                    </span>

                    {activeStatusEffect.type === 'hold' && (
                      <div className="mt-2 text-sm font-bold text-cyan-300">
                        [ESPAÇO] pressionado: <strong className="text-white text-base">{activeStatusEffect.progress || 0}</strong> / {activeStatusEffect.maxProgress}
                      </div>
                    )}
                    {activeStatusEffect.type === 'blind' && (
                      <div className="mt-2 text-sm font-bold text-amber-300">
                        Acertos pela memória motora: <strong className="text-white text-base">{activeStatusEffect.progress || 0}</strong> / {activeStatusEffect.maxProgress}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between w-full text-xs font-bold pt-2 border-t border-white/10">
                    <span className="flex items-center gap-1.5 text-amber-300">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>TEMPO: {debuffSecondsLeft.toFixed(1)}s</span>
                    </span>
                    <span className="text-rose-400">⚠️ -25 Dano Direto se zerar!</span>
                  </div>

                  <div className="mt-3 text-[11px] text-zinc-400 font-bold flex items-center gap-1.5 animate-pulse">
                    <span>⬆️</span>
                    <span>Fixando no painel superior...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                    : isEnraged
                    ? 'bg-red-950/90 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.85)] animate-pulse'
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
                  {isEnraged ? (
                    <span className="text-[10px] font-mono text-red-300 font-black bg-red-950/90 px-2 py-0.5 rounded border border-red-500/70 animate-pulse flex items-center gap-1 shadow-sm">
                      <Flame className="w-3 h-3 text-red-400 fill-current" />
                      FÚRIA DO CHEFE ATIVA (+40% VELOCIDADE)
                    </span>
                  ) : overloadTriggered ? (
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

                {/* Barra de Carga de Ataque Iminente do Boss */}
                <div className="mt-2.5 w-52 sm:w-72 md:w-80">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
                    <span
                      className={`flex items-center gap-1.5 ${
                        isEnraged
                          ? 'text-red-400 animate-pulse'
                          : bossChargeProgress > 70
                          ? 'text-amber-400'
                          : 'text-zinc-300'
                      }`}
                    >
                      <Zap className={`w-3 h-3 ${isEnraged ? 'text-red-400 fill-current' : 'text-amber-400'}`} />
                      <span>{isEnraged ? '🔥 ATAQUE EM FÚRIA' : '⚡ ATAQUE IMINENTE'}</span>
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        bossChargeProgress > 75 ? 'text-rose-300 animate-pulse' : 'text-zinc-400'
                      }`}
                    >
                      {bossChargeProgress.toFixed(0)}% • {chargeSecondsRemaining.toFixed(1)}s
                    </span>
                  </div>
                  <div className="relative w-full h-2.5 sm:h-3 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800 p-0.5 shadow-inner">
                    <motion.div
                      animate={{ width: `${Math.min(100, Math.max(0, bossChargeProgress))}%` }}
                      transition={{ duration: 0.1, ease: 'linear' }}
                      className={`h-full rounded-full transition-all ${
                        bossChargeProgress > 75
                          ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.9)]'
                          : bossChargeProgress > 45
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                          : 'bg-gradient-to-r from-cyan-400 to-amber-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 mt-0.5">
                    <span>Digite teclas / fraquezas p/ interromper</span>
                    {isEnraged && <span className="text-red-400 font-bold animate-pulse">+40% VELOCIDADE</span>}
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
                        🩸 Nv.{dungeon.perks.weaknessVampirism}/10
                      </span>
                    )}
                    {dungeon.perks.criticalCombo > 0 && (
                      <span className="text-cyan-400" title="Bônus em Combo Perfeito">
                        ⚡ Nv.{dungeon.perks.criticalCombo}/10
                      </span>
                    )}
                    {dungeon.perks.shieldHardening > 0 && (
                      <span className="text-indigo-400" title="Mitigação de Escudo">
                        🛡️ Nv.{dungeon.perks.shieldHardening}/10
                      </span>
                    )}
                    {rpgClass && RPG_CLASSES[rpgClass] && (
                      <span
                        className={`px-1.5 py-0.5 rounded border text-[9px] font-bold flex items-center gap-1 ${RPG_CLASSES[rpgClass].badgeBg} ${RPG_CLASSES[rpgClass].badgeBorder} ${RPG_CLASSES[rpgClass].badgeText}`}
                        title={RPG_CLASSES[rpgClass].passives.map(p => `${p.title}: ${p.description}`).join(' | ')}
                      >
                        <span>{RPG_CLASSES[rpgClass].icon}</span>
                        <span>{RPG_CLASSES[rpgClass].name}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* Banner de Efeito de Status Ativo (Ultra Visível com Timer Regressivo & Instrução de Quebra) */}
          {activeStatusEffect && (
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`px-6 py-3.5 border-b-4 flex flex-col gap-2.5 font-mono z-30 transition-all ${
                activeStatusEffect.type === 'hold'
                  ? 'bg-gradient-to-r from-cyan-950 via-[#0a1b2d] to-cyan-950 border-cyan-400 text-cyan-100 shadow-[0_0_40px_rgba(6,182,212,0.5)]'
                  : activeStatusEffect.type === 'fear'
                  ? 'bg-gradient-to-r from-purple-950 via-[#1e0a2d] to-purple-950 border-purple-400 text-purple-100 shadow-[0_0_40px_rgba(168,85,247,0.5)] animate-pulse'
                  : 'bg-gradient-to-r from-amber-950 via-[#261505] to-amber-950 border-amber-400 text-amber-100 shadow-[0_0_40px_rgba(245,158,11,0.5)]'
              }`}
            >
              {/* Linha Superior: Ícone, Nome, Status e Temporizador */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-black/60 border-2 border-current flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                    {activeStatusEffect.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm sm:text-base tracking-wider uppercase text-white">
                        {activeStatusEffect.label}
                      </span>
                      <span className="text-[10px] bg-rose-600 text-black font-black px-2 py-0.5 rounded animate-pulse">
                        DEBUFF ATIVO
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-0.5">{activeStatusEffect.description}</p>
                  </div>
                </div>

                {/* Temporizador Regressivo em Segundos e Barra */}
                <div className="w-full sm:w-60 bg-black/70 px-3.5 py-1.5 rounded-xl border border-white/20 shadow-inner flex flex-col justify-center">
                  <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                    <span className="flex items-center gap-1 text-amber-300">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>TEMPO RESTANTE:</span>
                    </span>
                    <span className={`text-sm ${debuffSecondsLeft <= 2.5 ? 'text-rose-400 animate-bounce' : 'text-white'}`}>
                      {debuffSecondsLeft.toFixed(1)}s
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-white/10">
                    <div
                      style={{
                        width: `${Math.min(100, Math.max(0, (debuffSecondsLeft / activeStatusEffect.durationSeconds) * 100))}%`
                      }}
                      className={`h-full transition-all duration-100 ${
                        debuffSecondsLeft <= 2.5
                          ? 'bg-rose-500 animate-pulse'
                          : debuffSecondsLeft <= 4.5
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Linha Inferior: Caixa de Instrução Destacada & Alerta de Penalidade */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-white/10">
                <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-amber-400/60 w-full sm:w-auto">
                  <Zap className="w-4 h-4 text-amber-300 flex-shrink-0 animate-bounce" />
                  <span className="text-xs font-black text-amber-200">
                    👉 COMO QUEBRAR: {activeStatusEffect.breakInstruction}
                  </span>
                  {activeStatusEffect.type === 'hold' && (
                    <span className="ml-auto text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-400/50">
                      {activeStatusEffect.progress || 0} / {activeStatusEffect.maxProgress}
                    </span>
                  )}
                  {activeStatusEffect.type === 'blind' && (
                    <span className="ml-auto text-xs font-mono font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-400/50">
                      {activeStatusEffect.progress || 0} / {activeStatusEffect.maxProgress}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-rose-300 font-bold bg-rose-950/60 px-3 py-1 rounded-lg border border-rose-500/40 w-full sm:w-auto justify-center">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span>PENALIDADE: -25 de DANO DIRETO se zerar! Erros causam 2x mais dano!</span>
                </div>
              </div>
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
              className="absolute inset-0 bg-black/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-rose-950/80 border-2 border-rose-500/80 flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(244,63,94,0.6)] mb-3 animate-pulse">
                💀
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-rose-300">ESCUDO ROMPIDO!</h2>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-md">
                O guardião quebrou sua concentração motora. A incursão esgotou sua chave de expedição.
              </p>

              {/* Status de Chaves de Expedição */}
              <div className="my-4 px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700/80 flex items-center gap-3">
                <span className="text-2xl">🔑</span>
                <div className="text-left font-mono">
                  <div className="text-xs font-bold text-zinc-300">
                    Chaves de Expedição Restantes:{' '}
                    <strong className={keysCount > 0 ? 'text-amber-400' : 'text-rose-400'}>
                      {isAdmin ? 'Ilimitadas (Admin)' : `${keysCount} / ${dungeon?.maxKeys ?? 5}`}
                    </strong>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {hasKeysToRetry
                      ? 'Reiniciar a luta consumirá 1 Chave de Expedição.'
                      : 'Você esgotou todas as chaves de expedição.'}
                  </div>
                </div>
              </div>

              {!hasKeysToRetry && (
                <div className="mb-4 max-w-md px-4 py-3 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs font-mono text-left space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-rose-300">
                    <Lock className="w-4 h-4" />
                    <span>SEM CHAVES PARA REINICIAR</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    Para sintetizar novas chaves, retorne ao Terminal Principal e digite mais 15 palavras ou conclua um{' '}
                    <strong className="text-amber-300">Treino Corretivo Adaptativo</strong>!
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
                <button
                  disabled={!hasKeysToRetry}
                  onClick={() => {
                    if (!hasKeysToRetry) return;
                    sound.playClick();
                    if (onConsumeKey) {
                      const success = onConsumeKey();
                      if (!success && !isAdmin) return;
                    }
                    handleRestartFight();
                  }}
                  className={`px-5 py-3 rounded-xl font-black text-xs sm:text-sm font-mono transition shadow-lg flex items-center gap-2 ${
                    hasKeysToRetry
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-black cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                      : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{hasKeysToRetry ? 'TENTAR NOVAMENTE (-1 Chave 🔑)' : 'SEM CHAVES RESTANTES'}</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold text-xs sm:text-sm font-mono transition border border-zinc-700 cursor-pointer"
                >
                  Voltar ao Terminal
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
