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
  Zap
} from 'lucide-react';
import { RpgFloorData, DungeonState } from '../types/quests';
import { sound } from '../utils/audio';
import { formatBytes } from '../utils/formatting';
import { combineAccent, isAccentKey, resolveDeadKey } from '../utils/keyboardAccents';

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

  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const currentSpanRef = useRef<HTMLSpanElement>(null);
  const wordCleanRef = useRef<boolean>(true);

  // Reinicia o estado ao abrir um novo andar
  useEffect(() => {
    if (isOpen) {
      setCharIndex(0);
      setBossHp(floorData.boss.maxHp);
      setPlayerShield(maxShield);
      setStatus('playing');
      setPendingAccent(null);
      setOverloadTriggered(false);
      setOverloadActive(false);
      setOverloadSequence([]);
      setOverloadIndex(0);
      wordCleanRef.current = true;
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, floorData, maxShield]);

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

  // Tecla ESC para fechar ou desistir
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  // Processa a digitação com suporte a teclas mortas (acentos) e QTE
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (status !== 'playing') return;

    if (e.key === 'Tab' || e.key === 'Escape') {
      return;
    }

    // Se estiver em modo QTE de Sobrecarga do Núcleo
    if (overloadActive) {
      e.preventDefault();
      const pressedKey = e.key.toUpperCase();
      const targetKey = overloadSequence[overloadIndex];

      if (pressedKey === targetKey) {
        sound.playType();
        const nextQteIdx = overloadIndex + 1;
        if (nextQteIdx >= overloadSequence.length) {
          // Concluiu o QTE com perfeição!
          sound.playChallengeSuccess();
          const burstDmg = Math.max(20, Math.round(floorData.boss.maxHp * 0.25));
          spawnDamage(burstDmg, true, `⚡ SOBRECARGA! -${burstDmg}`);
          const nextHp = Math.max(0, bossHp - burstDmg);
          setBossHp(nextHp);
          setOverloadActive(false);

          if (nextHp <= 0) {
            setStatus('victory');
            onVictory(floorData);
          }
        } else {
          setOverloadIndex(nextQteIdx);
        }
      } else {
        // Erro no QTE - dissipa o atordoamento sem causar dano bônus
        sound.playError();
        setOverloadActive(false);
      }
      return;
    }

    if (isAccentKey(e.key)) {
      e.preventDefault();
      const dead = resolveDeadKey(e.key);
      setPendingAccent(dead);
      return;
    }

    let typedChar = e.key;

    if (pendingAccent) {
      e.preventDefault();
      typedChar = combineAccent(pendingAccent, typedChar);
      setPendingAccent(null);
    }

    if (typedChar.length !== 1) {
      return;
    }

    e.preventDefault();

    const expectedChar = floorData.text[charIndex];
    if (!expectedChar) return;

    if (typedChar === expectedChar) {
      // Acerto!
      sound.playType();
      const nextIndex = charIndex + 1;
      setCharIndex(nextIndex);

      // Bônus de Equipamento (Arma e Relíquia)
      const weaponBonusDmg = (dungeon?.weapon?.bonusDmg ?? 0) + (dungeon?.relic?.bonusDmg ?? 0);
      const isWeakness = floorData.boss.weaknessKeys?.includes(typedChar.toLowerCase());
      
      let baseDamage = 1 + weaponBonusDmg;
      if (isWeakness) {
        const weaknessBonusPercent = dungeon?.weapon?.bonusWeaknessDmgPercent ?? 0;
        baseDamage = Math.round((2 + weaponBonusDmg) * (1 + weaknessBonusPercent / 100));

        // Perk: Vampirismo de Fraqueza
        const vampLevel = dungeon?.perks?.weaknessVampirism ?? 0;
        if (vampLevel > 0) {
          const healAmount = vampLevel * 2;
          setPlayerShield((prev) => Math.min(maxShield, prev + healAmount));
        }
      }

      // Boss ferido momentaneamente
      setIsBossHurt(true);
      setTimeout(() => setIsBossHurt(false), 80);

      // Verificação de palavra concluída (espaço ou fim do texto)
      let wordBonusDamage = 0;
      if (expectedChar === ' ' || nextIndex >= floorData.text.length) {
        if (wordCleanRef.current) {
          // Perk: Combo Crítico
          const comboLevel = dungeon?.perks?.criticalCombo ?? 0;
          const comboMultiplier = 1 + (comboLevel * 0.15);
          wordBonusDamage = Math.round((8 + (floorData.floor * 2)) * comboMultiplier);
          spawnDamage(wordBonusDamage, true);
        }
        wordCleanRef.current = true;
      }

      const totalDamage = baseDamage + wordBonusDamage;
      const nextHp = Math.max(0, bossHp - totalDamage);
      setBossHp(nextHp);

      // Ativa QTE Sobrecarga quando o Boss chega a <= 50% HP pela primeira vez
      const halfHp = floorData.boss.maxHp * 0.5;
      if (!overloadTriggered && nextHp <= halfHp && nextHp > 0) {
        setOverloadTriggered(true);
        const pool = floorData.boss.weaknessKeys && floorData.boss.weaknessKeys.length > 0 
          ? floorData.boss.weaknessKeys 
          : ['f', 'j', 'd', 'k', 's', 'l', 'a'];
        const qteSeq = Array.from({ length: 4 }, () => pool[Math.floor(Math.random() * pool.length)].toUpperCase());
        setOverloadSequence(qteSeq);
        setOverloadIndex(0);
        setOverloadActive(true);
      }

      // Vitória ao concluir o texto ou esgotar a vida do Boss
      if (nextIndex >= floorData.text.length || nextHp <= 0) {
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
          setStatus('defeat');
          sound.playChallengeFail();
        }
        return nextShield;
      });
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
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none w-0 h-0"
          autoFocus
          onKeyDown={handleKeyDown}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#111624] via-[#0d121c] to-[#080b12] border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden text-zinc-100"
        >
          {/* Header Superior */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/80 bg-[#121826]/90">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono font-bold text-xs">
                Andar {floorData.floor}
              </span>
              <h3 className="text-sm sm:text-base font-black text-white truncate">{floorData.chapterTitle}</h3>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
              title="Abandonar Expedição (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Painel de Combate RPG (Boss HUD & Escudo do Jogador) */}
          <div className="relative px-5 py-4 bg-gradient-to-r from-rose-950/20 via-[#101522] to-cyan-950/20 border-b border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Boss Status */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <motion.div
                animate={isBossHurt ? { x: [-5, 5, -5, 5, 0], scale: [1, 0.9, 1.05, 1] } : {}}
                transition={{ duration: 0.2 }}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-3xl select-none flex-shrink-0 shadow-lg ${
                  isBossHurt
                    ? 'bg-rose-950 border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.6)]'
                    : 'bg-zinc-900 border-rose-500/50'
                }`}
              >
                {floorData.boss.avatar}
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white truncate">{floorData.boss.name}</h4>
                  <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/70 px-1.5 py-0.2 rounded border border-rose-500/40">
                    BOSS
                  </span>
                </div>

                {/* Barra de Vida do Monstro */}
                <div className="mt-1 w-44 sm:w-56">
                  <div className="flex items-center justify-between text-[10px] font-mono text-rose-300 font-bold mb-0.5">
                    <span className="flex items-center gap-1">
                      <Heart className="w-2.5 h-2.5 text-rose-400 fill-current" />
                      <span>Vida do Boss</span>
                    </span>
                    <span>
                      {bossHp} / {floorData.boss.maxHp}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden border border-rose-900/60">
                    <motion.div
                      animate={{ width: `${hpPercent}%` }}
                      transition={{ duration: 0.2 }}
                      className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-400"
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
                  className={`absolute font-mono font-black text-sm sm:text-base animate-float-up px-2 py-0.5 rounded shadow-lg backdrop-blur-sm z-30 ${
                    p.isCrit
                      ? 'bg-amber-500/90 text-black border border-amber-300 text-base sm:text-lg animate-bounce'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-500/60'
                  }`}
                >
                  {p.text}
                </div>
              ))}
            </div>

            {/* Escudo do Jogador */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5 text-[11px] font-mono text-cyan-300 font-bold">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    Escudo: {playerShield} / {maxShield}
                  </span>
                </div>
                <div className="mt-1 w-36 sm:w-44 h-2 rounded-full bg-zinc-950 overflow-hidden border border-cyan-900/60 ml-auto">
                  <motion.div
                    animate={{ width: `${Math.min(100, Math.max(0, Math.round((playerShield / maxShield) * 100)))}%` }}
                    transition={{ duration: 0.2 }}
                    className={`h-full ${
                      (playerShield / maxShield) > 0.4
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                        : 'bg-gradient-to-r from-rose-500 to-amber-500 animate-pulse'
                    }`}
                  />
                </div>

                {/* Bônus de Equipamento & Perks em Combate */}
                {dungeon && (
                  <div className="flex items-center justify-end gap-2 mt-1.5 text-[10px] font-mono text-zinc-400">
                    {dungeon.weapon.bonusDmg > 0 && (
                      <span className="text-amber-300 flex items-center gap-0.5" title="Bônus de Dano da Arma">
                        <Swords className="w-2.5 h-2.5" />+{dungeon.weapon.bonusDmg}
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

          {/* Banner de Minigame QTE: Sobrecarga do Núcleo */}
          {overloadActive && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-5 py-3 bg-gradient-to-r from-amber-950 via-rose-950 to-amber-950 border-b-2 border-amber-400 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_30px_rgba(245,158,11,0.5)] z-20"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400 animate-bounce" />
                <div>
                  <span className="font-mono font-black text-amber-300 text-xs sm:text-sm tracking-wider uppercase">
                    ⚠️ SOBRECARGA DO NÚCLEO DO BOSS!
                  </span>
                  <p className="text-[11px] text-amber-200/80 font-mono">
                    Pressione as teclas para atordoar o guardião e causar dano crítico massivo:
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
            <div className="px-5 py-2 bg-[#0d111a] border-b border-zinc-800/60 flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Fraqueza ativa:</span>
              <div className="flex items-center gap-1">
                {floorData.boss.weaknessKeys.map((k) => (
                  <span
                    key={k}
                    className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold uppercase text-[10px]"
                  >
                    [{k}]
                  </span>
                ))}
              </div>
              <span className="text-zinc-500 ml-auto text-[10px] hidden sm:inline">
                +Dano ao acertar essas teclas!
              </span>
            </div>
          )}

          {/* Área de Digitação do Texto Completo Literário */}
          <div
            ref={textContainerRef}
            className={`flex-1 overflow-y-auto p-6 sm:p-8 font-mono leading-relaxed tracking-wide text-base sm:text-lg select-none custom-scrollbar transition-all ${
              isErrorShaking ? 'animate-shake' : ''
            }`}
          >
            {pendingAccent && (
              <div className="inline-block px-2 py-0.5 mb-2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono">
                Acento pendente: {pendingAccent}
              </div>
            )}

            <div className="break-words whitespace-pre-wrap">
              {floorData.text.split('').map((char, idx) => {
                const isDone = idx < charIndex;
                const isCurrent = idx === charIndex;

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
                      className="relative bg-cyan-400/30 text-white font-black underline decoration-cyan-400 decoration-2 shadow-[0_0_8px_rgba(6,182,212,0.8)] px-0.5 rounded"
                    >
                      {char}
                      <span className="absolute -bottom-1 left-0 right-0 h-1 bg-cyan-400 animate-pulse rounded-full" />
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
          <div className="px-5 py-2.5 bg-[#0a0d14] border-t border-zinc-800/80 flex items-center justify-between gap-3 text-xs font-mono">
            <span className="text-zinc-400">
              Progresso do Capítulo: <strong className="text-white">{progressPercent}%</strong> ({charIndex} /{' '}
              {totalChars} caracteres)
            </span>
            <span className="text-cyan-400 text-[11px] hidden sm:inline">
              Digite com atenção aos pontos, vírgulas e acentos!
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
                    setBossHp(floorData.boss.maxHp);
                    setPlayerShield(maxShield);
                    setOverloadTriggered(false);
                    setOverloadActive(false);
                    setOverloadSequence([]);
                    setOverloadIndex(0);
                    setStatus('playing');
                    wordCleanRef.current = true;
                    setTimeout(() => inputRef.current?.focus(), 100);
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
