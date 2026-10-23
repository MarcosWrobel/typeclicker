// ─────────────────────────────────────────────────────────────
// HUD de Combate — ByteQuest (Sobrevivência em Tempo Real)
// Indicadores de Vida, XP, Cronômetro, Spells e Digitação Tática
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { Shield, Zap, Sparkles, Volume2, VolumeX, LogOut, Flame, Snowflake, Skull, Crosshair, Wind, Feather, Disc, Pause, Play, Cpu, Sun, Rocket, Orbit, MousePointer } from 'lucide-react';
import { ByteQuestSimulation } from './byteQuestEngine';
import { BYTE_QUEST_SPELLS } from '../../../types/byteQuest';
import { CapsLockWarning } from '../../common/CapsLockWarning';
import { getAccentDisplayName } from '../../../utils/keyboardAccents';

export interface ByteQuestHUDProps {
  simulation: ByteQuestSimulation;
  isMuted: boolean;
  isPaused: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onExit: () => void;
  pendingAccent?: string | null;
}

export const ByteQuestHUD: React.FC<ByteQuestHUDProps> = ({
  simulation,
  isMuted,
  isPaused,
  onToggleMute,
  onTogglePause,
  onExit,
  pendingAccent
}) => {
  // Sincronização reativa contínua a 60 FPS com a simulação (corrige o relógio parado)
  const [, setTick] = useState<number>(0);
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setTick(Date.now());
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const { stats, spellCooldowns, lockedEnemyId, lockedShrineId, spellBuffer, enemies, shrines } = simulation;

  const hpRatio = Math.max(0, Math.min(1, stats.hp / stats.maxHp));
  const xpRatio = Math.max(0, Math.min(1, stats.currentXp / stats.nextLevelXp));
  const focusRatio = Math.max(0, Math.min(1, simulation.focusStamina / simulation.maxFocusStamina));

  const minutes = Math.floor(stats.timeSurvivedSeconds / 60);
  const seconds = Math.floor(stats.timeSurvivedSeconds % 60);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const lockedEnemy = enemies.find((e) => e.id === lockedEnemyId);
  const lockedShrine = shrines?.find((s) => s.id === lockedShrineId && s.active);

  const nearPortal = simulation.chamberPortals?.find(
    (p) => p.active && Math.hypot(p.x - simulation.heroX, p.y - simulation.heroY) <= p.radius + 120
  );
  const nearTerminal = simulation.chamberTerminal?.active &&
    Math.hypot(simulation.chamberTerminal.x - simulation.heroX, simulation.chamberTerminal.y - simulation.heroY) <= simulation.chamberTerminal.radius + 120
    ? simulation.chamberTerminal
    : null;

  const getSpellIcon = (spellId: string) => {
    switch (spellId) {
      // Guerreiro
      case 'warrior_rage':
      case 'spell_warrior_fury':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'warrior_cyclone':
      case 'spell_warrior_cyclone':
        return <Wind className="w-4 h-4 text-orange-400" />;
      case 'warrior_charge':
      case 'spell_warrior_charge':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'warrior_shield':
      case 'spell_warrior_shield':
      case 'spell_shield':
        return <Shield className="w-4 h-4 text-sky-400" />;

      // Arqueiro
      case 'archer_arrow_rain':
      case 'spell_archer_rain':
        return <Crosshair className="w-4 h-4 text-emerald-400" />;
      case 'archer_pierce_volley':
      case 'spell_archer_burst':
        return <Zap className="w-4 h-4 text-teal-400" />;
      case 'archer_trap':
      case 'spell_archer_trap':
        return <Disc className="w-4 h-4 text-amber-400" />;
      case 'archer_evasion':
      case 'spell_archer_dodge':
        return <Feather className="w-4 h-4 text-cyan-400" />;

      // Mago
      case 'mage_fireball':
      case 'mage_meteor':
      case 'spell_mage_meteor':
      case 'spell_meteor':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'mage_blizzard':
      case 'spell_mage_blizzard':
      case 'spell_freeze':
        return <Snowflake className="w-4 h-4 text-purple-400" />;
      case 'mage_thunder':
      case 'spell_mage_thunder':
      case 'spell_lightning':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'mage_barrier':
      case 'spell_mage_barrier':
        return <Shield className="w-4 h-4 text-indigo-400" />;

      default:
        return <Sparkles className="w-4 h-4 text-violet-400" />;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 select-none">
      {/* ─── BARRA SUPERIOR ─── */}
      <div className="flex items-center justify-between gap-3 pointer-events-auto">
        {/* HP, Escudo, Energia, Foco Tático & Medidor de Combo */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2.5 bg-zinc-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-zinc-800/80 shadow-lg">
            <div className="flex flex-col gap-1.5 w-44 sm:w-56">
              {/* Barra de HP */}
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    HP
                    {stats.shieldHp > 0 && (
                      <span className="text-sky-400 text-[10px] flex items-center">
                        <Shield className="w-3 h-3 inline mr-0.5" />+{stats.shieldHp}
                      </span>
                    )}
                  </span>
                  <span className="text-zinc-300">
                    {stats.hp} / {stats.maxHp}
                  </span>
                </div>
                <div className="relative w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-700/50">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-150"
                    style={{ width: `${hpRatio * 100}%` }}
                  />
                  {stats.shieldHp > 0 && (
                    <div
                      className="absolute inset-y-0 left-0 bg-sky-400/40 border-r border-sky-300"
                      style={{ width: `${Math.min(100, (stats.shieldHp / stats.maxHp) * 100)}%` }}
                    />
                  )}
                </div>
              </div>

              {/* Barra de Energia */}
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 inline" /> ENERGIA
                  </span>
                  <span className="text-zinc-400">
                    {Math.round(stats.energy)} / {stats.maxEnergy}
                  </span>
                </div>
                <div className="relative w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-700/50">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-100"
                    style={{ width: `${Math.max(0, Math.min(100, (stats.energy / stats.maxEnergy) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Barra de Foco Tático (Bullet Time) */}
              <div className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className={`font-bold flex items-center gap-1 ${simulation.focusTimeScale < 0.85 ? 'text-sky-300 animate-pulse' : 'text-indigo-400'}`}>
                    ⏱️ FOCO TÁTICO {simulation.focusTimeScale < 0.85 ? '(BULLET TIME)' : ''}
                  </span>
                  <span className="text-zinc-400">{Math.round(simulation.focusStamina)}%</span>
                </div>
                <div className="relative w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-sky-300 transition-all duration-75"
                    style={{ width: `${focusRatio * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Medidor de Combo / Overclock Tático (Separado da Barra do Boss) */}
          {(simulation.typingCombo > 0 || simulation.overclockTimer > 0) && (
            <div
              className={`flex flex-col items-center px-3 py-1.5 rounded-xl border font-mono shadow-xl transition-all ${
                simulation.overclockTimer > 0
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-amber-950/60 ring-1 ring-amber-400/50 animate-pulse'
                  : 'bg-zinc-950/90 border-violet-500/50 text-violet-200'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-base font-black tracking-tight text-amber-300">
                  {simulation.typingCombo}x
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-300">
                  COMBO
                </span>
              </div>
              {simulation.overclockTimer > 0 ? (
                <span className="text-[9px] font-bold text-amber-300 flex items-center gap-0.5">
                  ⚡ OVERCLOCK {simulation.overclockTimer.toFixed(1)}s
                </span>
              ) : (
                <span className="text-[9px] text-zinc-400">
                  Overclock em {15 - (simulation.typingCombo % 15)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Cronômetro Central, Bioma Ativo & Indicador de Modo (Solo / PvP 1v1) */}
        <div className="flex flex-col items-center bg-zinc-950/85 backdrop-blur-md px-4 py-1.5 rounded-xl border border-violet-900/40 shadow-lg">
          {'pvpPhase' in simulation ? (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg sm:text-xl font-black text-amber-300 tracking-wider">
                  {(simulation as any).pvpPhase === 'farm'
                    ? `${Math.max(0, Math.ceil(120 - (simulation as any).matchTimer))}s`
                    : 'DUELO PVP'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    (simulation as any).pvpPhase === 'farm'
                      ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300'
                      : 'bg-rose-950/80 border border-rose-500/60 text-rose-300 animate-pulse'
                  }`}
                >
                  {(simulation as any).pvpPhase === 'farm' ? '🌾 FASE DE FARM' : '⚔️ LOCKDOWN ATIVO'}
                </span>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                {(simulation as any).pvpPhase === 'farm'
                  ? `Tempestade: Raio ${Math.round((simulation as any).stormRadius)}m`
                  : 'Fogo Amigo Liberado! Digite o código do Rival!'}
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg sm:text-xl font-black text-amber-300 tracking-wider">
                  {formattedTime}
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-violet-950/60 border border-violet-500/40 text-[10px] font-mono font-bold text-violet-200">
                  <span>CÂMARA {simulation.chamberNumber}/4</span>
                  {simulation.chamberIsPurged ? (
                    <span className="text-emerald-400 font-black animate-pulse">✓ PURGADA</span>
                  ) : simulation.chamberType === 'boss' ? (
                    <span className="text-rose-400 font-black animate-pulse">🔥 CHEFE</span>
                  ) : (
                    <span className="text-amber-400 font-mono text-[9px]">
                      {Math.max(0, Math.ceil(simulation.chamberTargetDuration - simulation.chamberTimeSurvived))}s
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 font-bold">
                {simulation.currentBiome === 'forge' ? (
                  <span className="text-orange-400">🔥 FORJA DE SILÍCIO</span>
                ) : simulation.currentBiome === 'quantum_core' ? (
                  <span className="text-purple-400">🌌 NÚCLEO QUÂNTICO</span>
                ) : (
                  <span className="text-cyan-400">🏛️ CRIPTA DE DADOS</span>
                )}
                <span className="text-zinc-600">•</span>
                <span className="text-violet-300">{simulation.getChamberTitle(simulation.chamberType)}</span>
                {simulation.corruptionTier > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[9px]">
                    ☠️ TORMENTO {simulation.corruptionTier}
                  </span>
                )}
              </span>
            </>
          )}
        </div>

        {/* Nível da Corrida & Controles */}
        <div className="flex items-center gap-2">
          {/* Nível e XP */}
          <div className="bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600/30 border border-violet-500/50 flex items-center justify-center font-mono font-black text-xs text-violet-300">
              {stats.level}
            </div>
            <div className="flex flex-col w-20 sm:w-28 gap-0.5">
              <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                <span>XP</span>
                <span>{Math.round(stats.currentXp)}/{stats.nextLevelXp}</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 transition-all duration-150"
                  style={{ width: `${xpRatio * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Alternador de Esquema de Movimento: Mouse Guia + Setas vs Apenas Setas */}
          <button
            onClick={() => {
              const nextState = !simulation.mouseMoveEnabled;
              simulation.setMouseMoveEnabled(nextState);
              try {
                localStorage.setItem('bytequest_mouse_control', nextState ? 'true' : 'false');
              } catch (_) {}
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer shadow-md ${
              simulation.mouseMoveEnabled
                ? 'bg-cyan-950/70 border-cyan-500/70 text-cyan-200 hover:bg-cyan-900/60 shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                : 'bg-zinc-900/80 border-zinc-700/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
            title={
              simulation.mouseMoveEnabled
                ? 'Movimento: Mouse Guia + Setas ativas (Clique para usar Apenas Setas)'
                : 'Movimento: Apenas Setas do Teclado (Clique para ativar Guia por Mouse)'
            }
          >
            <MousePointer className={`w-3.5 h-3.5 ${simulation.mouseMoveEnabled ? 'text-cyan-400 animate-pulse' : 'text-zinc-500'}`} />
            <span className="hidden sm:inline text-[10px]">
              {simulation.mouseMoveEnabled ? 'Mouse + Setas' : 'Apenas Setas'}
            </span>
          </button>

          {/* Botão Pausar / Continuar */}
          <button
            onClick={onTogglePause}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isPaused
                ? 'bg-amber-600 text-white border-amber-400 hover:bg-amber-500 shadow-lg shadow-amber-900/50'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-700/50'
            }`}
            title={isPaused ? 'Continuar Partida' : 'Pausar Jogo'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Botão de Áudio */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors cursor-pointer"
            title={isMuted ? 'Ativar Áudio' : 'Desativar Áudio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
          </button>

          {/* Botão Sair */}
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-300 border border-zinc-700/50 hover:border-rose-700/50 transition-colors cursor-pointer"
            title="Sair para o Hub"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── BANNER DE EVENTOS DINÂMICOS (SUB-BARRA SUPERIOR) ─── */}
      {(simulation.activeEventBanner || simulation.siegeEventTimer > 0) && !simulation.enemies.some((e) => e.isBoss) && (
        <div className="flex justify-center pointer-events-none mt-1">
          <div className="px-4 py-1.5 rounded-full bg-amber-950/90 border border-amber-400/70 text-amber-200 font-mono text-xs font-black tracking-wide shadow-lg animate-bounce">
            {simulation.activeEventBanner?.text || `⚠️ CERCO DE INVASÃO ATIVO (${Math.ceil(simulation.siegeEventTimer)}s) — RECOMPENSA EM DOBRO!`}
          </div>
        </div>
      )}

      {/* Espaçador flexível para empurrar o rodapé para a base */}
      <div className="flex-1" />

      {/* ─── BARRA INFERIOR: SPELLS, ARSENAL E PROMPT DE DIGITAÇÃO DE ALVOS ─── */}
      <div className="flex flex-col items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <CapsLockWarning variant="badge" />
          {pendingAccent && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/90 border border-amber-400 text-amber-200 font-mono text-xs font-bold animate-pulse shadow-lg">
              <span>Acento: {getAccentDisplayName(pendingAccent)}</span>
              <span className="text-[10px] text-zinc-400 font-normal">(digite a vogal)</span>
            </div>
          )}
        </div>

        {/* Indicador de Alvo Travado, Santuário Travado, Portal ou Terminal (Apenas quando ativo) */}
        {(spellBuffer || lockedShrine || lockedEnemy || nearPortal || nearTerminal) && (
          <div className="bg-zinc-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-violet-500/40 shadow-xl flex items-center gap-3">
            {spellBuffer ? (
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-zinc-400">CONJURANDO:</span>
                <span className="text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/40">
                  {spellBuffer}
                </span>
                <span className="text-zinc-500 text-xs">(Pressione ESC para cancelar)</span>
              </div>
            ) : nearPortal ? (
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-cyan-400 font-bold">🌀 PORTAL DE SALTO:</span>
                <span className="bg-zinc-900 px-2.5 py-0.5 rounded border border-cyan-500/50 tracking-wider">
                  <span className="text-green-400 font-bold">{nearPortal.activationProgress}</span>
                  <span className="text-zinc-200">{nearPortal.activationWord.slice(nearPortal.activationProgress.length)}</span>
                </span>
                <span className="text-xs text-cyan-300">Destino: {nearPortal.label}</span>
              </div>
            ) : nearTerminal ? (
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-amber-400 font-bold">🪙 {nearTerminal.title}:</span>
                <span className="text-xs text-zinc-300">Aproxime-se e digite a palavra da oferta desejada!</span>
              </div>
            ) : lockedShrine ? (
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-cyan-400 font-bold">🏛️ SANTUÁRIO TRAVADO:</span>
                <span className="bg-zinc-900 px-2.5 py-0.5 rounded border border-cyan-500/50 tracking-wider">
                  <span className="text-green-400 font-bold">{lockedShrine.wordTyped}</span>
                  <span className="text-zinc-200">{lockedShrine.word.slice(lockedShrine.wordTyped.length)}</span>
                </span>
                <span className="text-xs text-cyan-300/80">✨ Digite para decodificar!</span>
              </div>
            ) : lockedEnemy ? (
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-amber-400 font-bold">
                  {lockedEnemy.firewallActiveTimer && lockedEnemy.firewallActiveTimer > 0
                    ? '🛡️ QUEBRANDO FIREWALL:'
                    : 'ALVO TRAVADO:'}
                </span>
                <span className="bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-700 tracking-wider">
                  <span className="text-green-400 font-bold">{lockedEnemy.wordTyped}</span>
                  <span className="text-zinc-200">{lockedEnemy.word.slice(lockedEnemy.wordTyped.length)}</span>
                </span>
                <span className="text-xs text-amber-300/80">💥 Digite para Golpe Crítico!</span>
              </div>
            ) : null}
          </div>
        )}

        {/* ─── ARSENAL AUTÔNOMO & DRONES ALIADOS (LOGO ACIMA DA BARRA DE HABILIDADES) ─── */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* DRONES ALIADOS ATIVOS */}
          {simulation.allyDrones && simulation.allyDrones.length > 0 && (
            <div className="flex items-center gap-1.5 bg-zinc-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-sky-900/50 shadow-md">
              <span className="text-[9px] font-mono text-sky-400 uppercase mr-1 font-bold">Drones:</span>
              {simulation.allyDrones.map((drone) => (
                <div
                  key={drone.id}
                  className="flex items-center gap-1 px-2 py-0.5 rounded border bg-zinc-900 text-[10px] font-mono font-bold"
                  style={{ borderColor: `${drone.color}60`, color: drone.color }}
                  title={`${drone.name} Nível ${drone.level}`}
                >
                  <span>{drone.model === 'combat' ? '🤖' : drone.model === 'medic' ? '💚' : '💜'}</span>
                  <span>{drone.name.split(' ')[0]}</span>
                  <span className="text-zinc-400 text-[9px]">★{drone.level}</span>
                </div>
              ))}
            </div>
          )}

          {/* ARSENAL AUTÔNOMO */}
          {(simulation.upgrades.weaponBoomerangLevel > 0 ||
            simulation.upgrades.weaponTurretLevel > 0 ||
            simulation.upgrades.weaponFireAuraLevel > 0 ||
            simulation.upgrades.weaponHomingMissilesLevel > 0 ||
            simulation.upgrades.orbitalCount > 0) && (
            <div className="flex items-center gap-1.5 bg-zinc-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-zinc-800 shadow-md">
              <span className="text-[9px] font-mono text-zinc-400 uppercase mr-1 font-bold">Arsenal:</span>
              {simulation.upgrades.weaponBoomerangLevel > 0 && (
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${simulation.upgrades.weaponBoomerangLevel >= 5 ? 'bg-rose-950/80 border-rose-400 text-rose-200' : 'bg-zinc-900 border-cyan-500/40 text-cyan-300'}`}>
                  <Disc className="w-3 h-3" />
                  <span>{simulation.upgrades.weaponBoomerangLevel >= 5 ? '★ SUPREMA' : `Nv.${simulation.upgrades.weaponBoomerangLevel}`}</span>
                </div>
              )}
              {simulation.upgrades.weaponTurretLevel > 0 && (
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${simulation.upgrades.weaponTurretLevel >= 5 ? 'bg-sky-950/80 border-sky-400 text-sky-200' : 'bg-zinc-900 border-amber-500/40 text-amber-300'}`}>
                  <Cpu className="w-3 h-3" />
                  <span>{simulation.upgrades.weaponTurretLevel >= 5 ? '★ RAILGUN' : `Nv.${simulation.upgrades.weaponTurretLevel}`}</span>
                </div>
              )}
              {simulation.upgrades.weaponFireAuraLevel > 0 && (
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${simulation.upgrades.weaponFireAuraLevel >= 5 ? 'bg-orange-950/80 border-amber-400 text-amber-200' : 'bg-zinc-900 border-orange-500/40 text-orange-300'}`}>
                  <Sun className="w-3 h-3" />
                  <span>{simulation.upgrades.weaponFireAuraLevel >= 5 ? '★ SUPERNOVA' : `Nv.${simulation.upgrades.weaponFireAuraLevel}`}</span>
                </div>
              )}
              {simulation.upgrades.weaponHomingMissilesLevel > 0 && (
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${simulation.upgrades.weaponHomingMissilesLevel >= 5 ? 'bg-rose-950/80 border-amber-400 text-amber-200' : 'bg-zinc-900 border-rose-500/40 text-rose-300'}`}>
                  <Rocket className="w-3 h-3" />
                  <span>{simulation.upgrades.weaponHomingMissilesLevel >= 5 ? '★ VALQUÍRIA' : `Nv.${simulation.upgrades.weaponHomingMissilesLevel}`}</span>
                </div>
              )}
              {simulation.upgrades.orbitalCount > 0 && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded border bg-zinc-900 border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold">
                  <Orbit className="w-3 h-3" />
                  <span>x{simulation.upgrades.orbitalCount}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hotbar de Ação de Mobilidade e Feitiços do Arquétipo */}
        <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 shadow-lg">
          {/* Botão / Indicador de Mobilidade (ESPAÇO) */}
          <div
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all ${
              simulation.mobilityCharges > 0
                ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 shadow-sm shadow-cyan-950/50'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 opacity-60'
            }`}
            title={`Mobilidade (${simulation.rpgClass === 'mage' ? 'Teleporte' : simulation.rpgClass === 'archer' ? 'Dash Longo' : 'Investida'}) • Tecla ESPAÇO`}
          >
            <Wind className={`w-4 h-4 ${simulation.mobilityCharges > 0 ? 'text-cyan-400 animate-pulse' : 'text-zinc-600'}`} />
            <div className="flex flex-col items-start leading-tight">
              <span className="font-bold text-[11px] text-zinc-200">
                {simulation.rpgClass === 'mage' ? 'TELEPORTE' : simulation.rpgClass === 'archer' ? 'DASH' : 'INVESTIDA'}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-cyan-400 font-bold">ESPAÇO</span>
                <span className="text-[9px] text-zinc-400 font-bold">
                  ({simulation.mobilityCharges}/{simulation.maxMobilityCharges})
                </span>
              </div>
            </div>
            {simulation.mobilityCooldownTimer > 0 && simulation.mobilityCharges === 0 && (
              <span className="absolute inset-0 bg-black/75 backdrop-blur-xs rounded-lg flex items-center justify-center font-bold text-cyan-400 text-xs">
                {simulation.mobilityCooldownTimer.toFixed(1)}s
              </span>
            )}
          </div>

          <div className="w-[1px] h-6 bg-zinc-800 mx-1" />
          {(simulation.availableSpells && simulation.availableSpells.length > 0 ? simulation.availableSpells : BYTE_QUEST_SPELLS).map((spell) => {
            const cd = Math.ceil(spellCooldowns[spell.id] || 0);
            const isOnCd = cd > 0;
            const hasEnergy = stats.energy >= (spell.energyCost || 0);

            return (
              <div
                key={spell.id}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                  isOnCd
                    ? 'bg-zinc-900/60 border-zinc-800 text-zinc-500 opacity-60'
                    : !hasEnergy
                    ? 'bg-zinc-900/80 border-cyan-950/60 text-zinc-400 opacity-75'
                    : 'bg-zinc-900/90 border-zinc-700 text-zinc-200 hover:border-violet-500'
                }`}
                title={`${spell.description} • Custo: ${spell.energyCost || 0} Energia`}
              >
                {getSpellIcon(spell.id)}
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-bold">{spell.command}</span>
                  <span className={`text-[9px] ${hasEnergy ? 'text-cyan-400' : 'text-red-400'}`}>
                    {spell.energyCost || 0} EN
                  </span>
                </div>
                {isOnCd && (
                  <span className="absolute inset-0 bg-black/75 backdrop-blur-xs rounded-lg flex items-center justify-center font-bold text-amber-400 text-xs">
                    {cd}s
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
