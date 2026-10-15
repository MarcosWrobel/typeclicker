// ─────────────────────────────────────────────────────────────
// HUD de Combate — ByteQuest (Sobrevivência em Tempo Real)
// Indicadores de Vida, XP, Cronômetro, Spells e Digitação Tática
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { Shield, Zap, Sparkles, Volume2, VolumeX, LogOut, Flame, Snowflake, Skull, Crosshair, Wind, Feather, Disc } from 'lucide-react';
import { ByteQuestSimulation } from './byteQuestEngine';
import { BYTE_QUEST_SPELLS } from '../../../types/byteQuest';
import { CapsLockWarning } from '../../common/CapsLockWarning';

export interface ByteQuestHUDProps {
  simulation: ByteQuestSimulation;
  isMuted: boolean;
  onToggleMute: () => void;
  onExit: () => void;
}

export const ByteQuestHUD: React.FC<ByteQuestHUDProps> = ({
  simulation,
  isMuted,
  onToggleMute,
  onExit
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

  const { stats, spellCooldowns, lockedEnemyId, spellBuffer, enemies } = simulation;

  const hpRatio = Math.max(0, Math.min(1, stats.hp / stats.maxHp));
  const xpRatio = Math.max(0, Math.min(1, stats.currentXp / stats.nextLevelXp));

  const minutes = Math.floor(stats.timeSurvivedSeconds / 60);
  const seconds = Math.floor(stats.timeSurvivedSeconds % 60);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentPhase = simulation.getCurrentPhase();
  const lockedEnemy = enemies.find((e) => e.id === lockedEnemyId);

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
        {/* HP, Escudo e Energia */}
        <div className="flex items-center gap-2.5 bg-zinc-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-zinc-800/80 shadow-lg">
          <div className="flex flex-col gap-1.5 w-40 sm:w-52">
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
              <div className="relative w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-700/50">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-100"
                  style={{ width: `${Math.max(0, Math.min(100, (stats.energy / stats.maxEnergy) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cronômetro Central e Fase */}
        <div className="flex items-center gap-3 bg-zinc-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-violet-900/40 shadow-lg">
          <div className="flex flex-col items-center">
            <span className="font-mono text-lg sm:text-xl font-black text-amber-300 tracking-wider">
              {formattedTime}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              {currentPhase === 4 ? (
                <span className="text-rose-400 font-bold flex items-center gap-0.5">
                  <Skull className="w-3 h-3" /> FÚRIA DO CHEFE
                </span>
              ) : (
                `ONDA ${currentPhase} / 3`
              )}
            </span>
          </div>
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

          {/* Botão de Áudio */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/50 transition-colors"
            title={isMuted ? 'Ativar Áudio' : 'Desativar Áudio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />}
          </button>

          {/* Botão Sair */}
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-zinc-900/80 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-300 border border-zinc-700/50 hover:border-rose-700/50 transition-colors"
            title="Sair para o Hub"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── BARRA INFERIOR: SPELLS E PROMPT DE DIGITAÇÃO ─── */}
      <div className="flex flex-col items-center gap-2 pointer-events-auto">
        <CapsLockWarning variant="badge" />

        {/* Indicador de Alvo Travado ou Comando em Digitação */}
        <div className="bg-zinc-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-violet-500/40 shadow-xl flex items-center gap-3">
          {spellBuffer ? (
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="text-zinc-400">CONJURANDO:</span>
              <span className="text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/40">
                {spellBuffer}
              </span>
              <span className="text-zinc-500 text-xs">(Pressione ESC para cancelar)</span>
            </div>
          ) : lockedEnemy ? (
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="text-amber-400 font-bold">ALVO TRAVADO:</span>
              <span className="bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-700 tracking-wider">
                <span className="text-green-400 font-bold">{lockedEnemy.wordTyped}</span>
                <span className="text-zinc-200">{lockedEnemy.word.slice(lockedEnemy.wordTyped.length)}</span>
              </span>
              <span className="text-xs text-amber-300/80">💥 Digite para Golpe Crítico!</span>
            </div>
          ) : (
            <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Use <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-violet-300 border border-zinc-700">Setas / WASD</kbd> para caminhar • Digite para golpear Elites e Chefes • <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded text-amber-300 border border-zinc-700">/</kbd> para conjurar</span>
            </div>
          )}
        </div>

        {/* Hotbar de Feitiços do Arquétipo com Custo de Energia e Recarga */}
        <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 shadow-lg">
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
