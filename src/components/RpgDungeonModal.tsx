import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Swords,
  Sparkles,
  Coins,
  Layers,
  X,
  Target,
  Trophy,
  Flame,
  Shield,
  Compass,
  Key,
  Lock,
  ArrowUpCircle,
  Zap,
  Heart,
  Gift
} from 'lucide-react';
import { GameState } from '../types';
import { DungeonPerks } from '../types/quests';
import { generateRpgFloor, syncQuestsState, syncDungeonState } from '../services/questsEngine';
import { formatBytes } from '../utils/formatting';
import { sound } from '../utils/audio';

interface RpgDungeonModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
  playerRankLevel: number;
  onStartBattle: (floor: number) => void;
  onUpgradeEquipment: (slot: 'weapon' | 'shield' | 'relic') => void;
  onUpgradePerk: (perk: keyof DungeonPerks) => void;
  onOpenChestMinigame?: () => void;
}

export const RpgDungeonModal: React.FC<RpgDungeonModalProps> = ({
  isOpen,
  onClose,
  state,
  playerRankLevel,
  onStartBattle,
  onUpgradeEquipment,
  onUpgradePerk,
  onOpenChestMinigame
}) => {
  const [activeTab, setActiveTab] = useState<'expedition' | 'arsenal'>('expedition');

  // Tecla ESC para fechar
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

  if (!isOpen) return null;

  const quests = syncQuestsState(state.quests);
  const dungeon = syncDungeonState(quests.dungeon);
  const floorData = generateRpgFloor(quests.rpgDungeonFloor, state.keyTelemetry);

  const isLevelUnlocked = playerRankLevel >= 3;
  const hasKeys = dungeon.keys > 0;
  const isChestAvailable = floorData.floor % 3 === 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#181122] via-[#10131e] to-[#090b12] border-2 border-rose-500/50 rounded-2xl shadow-[0_0_60px_rgba(244,63,94,0.25)] overflow-hidden text-zinc-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-[#161220]/90 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/30 via-red-600/25 to-amber-500/20 border border-rose-400/60 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                ⚔️
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>MASMORRA DE DIGITAÇÃO • CRÔNICAS RPG</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40">
                    ANDAR {floorData.floor}
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Economia integrada ao terminal • Reabilitação motora e progressão contínua
                </p>
              </div>
            </div>

            {/* Painel Superior de Chaves & Fechar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold shadow-sm">
                <span>🔑</span>
                <span>{dungeon.keys}/{dungeon.maxKeys} Chaves</span>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
                title="Fechar (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Abas Internas da Masmorra */}
          <div className="flex items-center gap-2 px-5 py-2.5 border-b border-zinc-800/60 bg-[#0c0f17]">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('expedition');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'expedition'
                  ? 'bg-gradient-to-r from-rose-950/90 to-amber-950/80 text-amber-200 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
              }`}
            >
              <Swords className="w-4 h-4 text-rose-400" />
              <span>Expedição do Andar</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('arsenal');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'arsenal'
                  ? 'bg-gradient-to-r from-indigo-950/90 to-purple-950/80 text-purple-200 border border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
              }`}
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Arsenal & Perks ({quests.rpgDungeonXp} XP)</span>
            </button>

            {/* Atalho de Baú Criptográfico quando disponível */}
            {isChestAvailable && onOpenChestMinigame && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenChestMinigame();
                }}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold transition-all animate-bounce cursor-pointer"
              >
                <span>🔐</span>
                <span>BAÚ DISPONÍVEL!</span>
              </button>
            )}
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
            {activeTab === 'expedition' ? (
              <>
                {/* Cartão do Andar Atual & Chefe */}
                <div className="relative rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#1c1224] via-[#121622] to-[#0a0d15] border-2 border-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.15)] flex flex-col md:flex-row items-center gap-6">
                  {/* Avatar do Chefe */}
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-rose-950/80 via-red-950/60 to-purple-950/80 border-2 border-rose-400/60 flex flex-col items-center justify-center text-5xl sm:text-6xl select-none flex-shrink-0 shadow-[0_0_25px_rgba(244,63,94,0.35)] relative"
                  >
                    <span>{floorData.boss.avatar}</span>
                    <span className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-md bg-black/90 border border-rose-400/60 text-[10px] font-mono font-bold text-rose-300">
                      Nv. {floorData.floor}
                    </span>
                  </motion.div>

                  {/* Informações do Andar & Boss */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/50 text-xs font-mono font-bold">
                        Andar {floorData.floor}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/50 text-xs font-mono font-bold">
                        Guardião: {floorData.boss.name}
                      </span>
                      <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-rose-400" />
                        HP: <strong className="text-rose-400">{floorData.boss.maxHp}</strong>
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">
                      {floorData.chapterTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
                      {floorData.boss.lore}
                    </p>

                    {/* Teclas de Fraqueza Adaptativa */}
                    {floorData.boss.weaknessKeys && floorData.boss.weaknessKeys.length > 0 && (
                      <div className="flex items-center justify-center md:justify-start gap-2 mt-3 flex-wrap">
                        <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" />
                          <span>Fraquezas Ativas (Motor de Erro):</span>
                        </span>
                        {floorData.boss.weaknessKeys.map((k) => (
                          <span
                            key={k}
                            className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/60 text-amber-300 text-xs font-mono font-black uppercase shadow-sm"
                          >
                            [{k}]
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Recompensas do Andar */}
                    <div className="flex items-center justify-center md:justify-start gap-2.5 mt-3.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-xs font-mono font-black text-emerald-300">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        +{formatBytes(floorData.rewardBytes)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-500/50 text-xs font-mono font-black text-amber-300">
                        <Coins className="w-3 h-3 text-amber-400" />
                        +{floorData.rewardTokens} Fichas
                      </span>
                      {floorData.rewardFragments && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-xs font-mono font-black text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                          <Layers className="w-3 h-3 text-cyan-400" />
                          +{floorData.rewardFragments} Frag. Quânticos
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Validação de Acesso / Chaves de Expedição */}
                {!isLevelUnlocked ? (
                  /* Requer Nível 3 */
                  <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-amber-400 font-mono font-bold text-sm">
                      <Lock className="w-4 h-4" />
                      <span>MASMORRA BLOQUEADA • REQUER NÍVEL 3 (DIGITADOR APRENDIZ)</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Você está no Nível {playerRankLevel}/3. Continue digitando palavras no terminal principal para desbloquear as expedições da Masmorra!
                    </p>
                  </div>
                ) : !hasKeys ? (
                  /* Sem Chaves: Bloqueado com Progresso Simbiótico */
                  <div className="p-5 rounded-2xl bg-amber-950/40 border-2 border-amber-500/50 text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-amber-300 font-mono font-bold text-sm">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span>SEM CHAVES DE EXPEDIÇÃO QUÂNTICA DISPONÍVEIS (0/5)</span>
                    </div>

                    <div className="max-w-md mx-auto">
                      <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1">
                        <span>Progresso p/ Nova Chave:</span>
                        <span className="font-bold text-amber-300">{dungeon.wordsProgress} / {dungeon.wordsTarget} Palavras</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (dungeon.wordsProgress / dungeon.wordsTarget) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 max-w-lg mx-auto leading-relaxed">
                      💡 <strong>Como recarregar:</strong> Digite mais {dungeon.wordsTarget - dungeon.wordsProgress} palavras no Terminal Principal ou conclua um <strong>Treino Corretivo Adaptativo</strong> para forjar novas chaves imediatamente!
                    </p>

                    <button
                      onClick={() => {
                        sound.playClick();
                        onClose();
                      }}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black font-mono text-xs tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      VOLTAR E PRATICAR NO TERMINAL
                    </button>
                  </div>
                ) : (
                  /* Botão Principal de Iniciar Expedição */
                  <div className="flex flex-col items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        sound.playClick();
                        onClose();
                        onStartBattle(quests.rpgDungeonFloor);
                      }}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-base font-mono tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_35px_rgba(244,63,94,0.5)] cursor-pointer flex items-center justify-center gap-3 border border-rose-400/50"
                    >
                      <Swords className="w-5 h-5 animate-pulse" />
                      <span>
                        {floorData.isProcedural
                          ? `DESAFIAR ANDAR INFINITO ${floorData.floor} (CUSTO: 1 🔑)`
                          : `ENTRAR NO COMBATE DO ANDAR ${floorData.floor} (CUSTO: 1 🔑)`}
                      </span>
                    </button>
                    <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-cyan-400" />
                        Escudo: {100 + dungeon.shield.bonusShield} HP
                      </span>
                      <span>•</span>
                      <span>Dano Base: +{dungeon.weapon.bonusDmg}</span>
                      <span>•</span>
                      <span>{dungeon.keys} Chaves Restantes</span>
                    </div>
                  </div>
                )}

                {/* Estatísticas do Aventureiro */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-xl bg-[#121520] border border-zinc-800 text-center">
                    <span className="text-zinc-400 text-xs font-mono flex items-center justify-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      Andar Mais Alto
                    </span>
                    <h4 className="text-2xl font-black text-white font-mono mt-1">
                      Andar {quests.highestRpgFloor}
                    </h4>
                  </div>
                  <div className="p-4 rounded-xl bg-[#121520] border border-zinc-800 text-center">
                    <span className="text-zinc-400 text-xs font-mono flex items-center justify-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" />
                      XP de Aventureiro
                    </span>
                    <h4 className="text-2xl font-black text-cyan-300 font-mono mt-1">
                      {quests.rpgDungeonXp} XP
                    </h4>
                  </div>
                  <div className="p-4 rounded-xl bg-[#121520] border border-zinc-800 text-center">
                    <span className="text-zinc-400 text-xs font-mono flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Quests Cumpridas
                    </span>
                    <h4 className="text-2xl font-black text-amber-300 font-mono mt-1">
                      {quests.totalQuestsCompleted}
                    </h4>
                  </div>
                </div>
              </>
            ) : (
              /* Aba 2: Arsenal de Equipamentos & Árvore de Perks */
              <div className="space-y-6">
                {/* Banner de XP Disponível */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-950/50 via-[#131622] to-indigo-950/50 border border-purple-500/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-xl">
                      🔮
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Laboratório & Arsenal do Aventureiro</h4>
                      <p className="text-xs text-zinc-400">
                        Invista o XP conquistado nas masmorras para fortalecer seus atributos permanentes.
                      </p>
                    </div>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/50 font-mono text-purple-300 font-black text-sm">
                    {quests.rpgDungeonXp} XP Disponível
                  </div>
                </div>

                {/* Equipamentos (Arma, Escudo, Relíquia) */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Equipamentos de Combate (Permanentes)</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* ARMA */}
                    <div className="p-4 rounded-2xl bg-[#121622] border border-zinc-800 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{dungeon.weapon.icon}</span>
                          <span className="px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-500/40 font-mono text-xs font-bold">
                            Nv. {dungeon.weapon.level}/{dungeon.weapon.maxLevel}
                          </span>
                        </div>
                        <h5 className="font-bold text-white text-sm mt-2">{dungeon.weapon.name}</h5>
                        <p className="text-xs text-zinc-400 mt-1 leading-snug">{dungeon.weapon.effectDesc}</p>
                        <div className="flex items-center gap-2 mt-2 font-mono text-[11px] text-amber-300">
                          <span>+{dungeon.weapon.bonusDmg} Dano/tecla</span>
                          <span>•</span>
                          <span>+{dungeon.weapon.bonusWeaknessDmgPercent}% Fraquezas</span>
                        </div>
                      </div>

                      {dungeon.weapon.level < dungeon.weapon.maxLevel ? (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onUpgradeEquipment('weapon');
                          }}
                          disabled={quests.rpgDungeonXp < dungeon.weapon.upgradeCostXp}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition"
                        >
                          <ArrowUpCircle className="w-3.5 h-3.5" />
                          <span>Evoluir ({dungeon.weapon.upgradeCostXp} XP)</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-zinc-500 font-bold text-center py-1">Nível Máximo</span>
                      )}
                    </div>

                    {/* ESCUDO */}
                    <div className="p-4 rounded-2xl bg-[#121622] border border-zinc-800 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{dungeon.shield.icon}</span>
                          <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold">
                            Nv. {dungeon.shield.level}/{dungeon.shield.maxLevel}
                          </span>
                        </div>
                        <h5 className="font-bold text-white text-sm mt-2">{dungeon.shield.name}</h5>
                        <p className="text-xs text-zinc-400 mt-1 leading-snug">{dungeon.shield.effectDesc}</p>
                        <div className="flex items-center gap-2 mt-2 font-mono text-[11px] text-cyan-300">
                          <span>+{dungeon.shield.bonusShield} Escudo Máximo</span>
                        </div>
                      </div>

                      {dungeon.shield.level < dungeon.shield.maxLevel ? (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onUpgradeEquipment('shield');
                          }}
                          disabled={quests.rpgDungeonXp < dungeon.shield.upgradeCostXp}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition"
                        >
                          <ArrowUpCircle className="w-3.5 h-3.5" />
                          <span>Evoluir ({dungeon.shield.upgradeCostXp} XP)</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-zinc-500 font-bold text-center py-1">Nível Máximo</span>
                      )}
                    </div>

                    {/* RELÍQUIA */}
                    {dungeon.relic && (
                      <div className="p-4 rounded-2xl bg-[#121622] border border-zinc-800 flex flex-col justify-between gap-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{dungeon.relic.icon}</span>
                            <span className="px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-500/40 font-mono text-xs font-bold">
                              Nv. {dungeon.relic.level}/{dungeon.relic.maxLevel}
                            </span>
                          </div>
                          <h5 className="font-bold text-white text-sm mt-2">{dungeon.relic.name}</h5>
                          <p className="text-xs text-zinc-400 mt-1 leading-snug">{dungeon.relic.effectDesc}</p>
                          <div className="flex items-center gap-2 mt-2 font-mono text-[11px] text-purple-300">
                            <span>+{dungeon.relic.bonusDmg} Dano</span>
                            <span>•</span>
                            <span>+{dungeon.relic.bonusShield} Escudo</span>
                          </div>
                        </div>

                        {dungeon.relic.level < dungeon.relic.maxLevel ? (
                          <button
                            onClick={() => {
                              sound.playClick();
                              onUpgradeEquipment('relic');
                            }}
                            disabled={quests.rpgDungeonXp < dungeon.relic.upgradeCostXp}
                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition"
                          >
                            <ArrowUpCircle className="w-3.5 h-3.5" />
                            <span>Evoluir ({dungeon.relic.upgradeCostXp} XP)</span>
                          </button>
                        ) : (
                          <span className="text-xs font-mono text-zinc-500 font-bold text-center py-1">Nível Máximo</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Árvore de Perks da Masmorra */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Árvore de Perks de Sobrevivência & Combate</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Perk 1: Foco Crítico */}
                    <div className="p-3.5 rounded-xl bg-[#121622] border border-zinc-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <h6 className="font-bold text-white text-xs">Foco Crítico</h6>
                          <span className="text-[10px] font-mono text-amber-300">Nv.{dungeon.perks.criticalCombo}/5</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          +{dungeon.perks.criticalCombo * 10}% de dano adicional em combos longos sem erro.
                        </p>
                      </div>

                      {dungeon.perks.criticalCombo < 5 ? (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onUpgradePerk('criticalCombo');
                          }}
                          disabled={quests.rpgDungeonXp < (dungeon.perks.criticalCombo + 1) * 80}
                          className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-mono text-[11px] font-bold cursor-pointer whitespace-nowrap"
                        >
                          +1 ({(dungeon.perks.criticalCombo + 1) * 80} XP)
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">MAX</span>
                      )}
                    </div>

                    {/* Perk 2: Vampirismo de Fraqueza */}
                    <div className="p-3.5 rounded-xl bg-[#121622] border border-zinc-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-rose-400" />
                          <h6 className="font-bold text-white text-xs">Regeneração em Fraquezas</h6>
                          <span className="text-[10px] font-mono text-rose-300">Nv.{dungeon.perks.weaknessVampirism}/5</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Acertar teclas de fraqueza do chefe restaura +{dungeon.perks.weaknessVampirism * 2} de Escudo.
                        </p>
                      </div>

                      {dungeon.perks.weaknessVampirism < 5 ? (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onUpgradePerk('weaknessVampirism');
                          }}
                          disabled={quests.rpgDungeonXp < (dungeon.perks.weaknessVampirism + 1) * 80}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-mono text-[11px] font-bold cursor-pointer whitespace-nowrap"
                        >
                          +1 ({(dungeon.perks.weaknessVampirism + 1) * 80} XP)
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">MAX</span>
                      )}
                    </div>

                    {/* Perk 3: Síntese de Bytes */}
                    <div className="p-3.5 rounded-xl bg-[#121622] border border-zinc-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Coins className="w-3.5 h-3.5 text-amber-400" />
                          <h6 className="font-bold text-white text-xs">Síntese de Bytes</h6>
                          <span className="text-[10px] font-mono text-amber-300">Nv.{dungeon.perks.rewardMultiplier}/5</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          +{dungeon.perks.rewardMultiplier * 15}% de Bytes adicionais ao derrotar qualquer chefe.
                        </p>
                      </div>

                      {dungeon.perks.rewardMultiplier < 5 ? (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onUpgradePerk('rewardMultiplier');
                          }}
                          disabled={quests.rpgDungeonXp < (dungeon.perks.rewardMultiplier + 1) * 80}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-mono text-[11px] font-bold cursor-pointer whitespace-nowrap"
                        >
                          +1 ({(dungeon.perks.rewardMultiplier + 1) * 80} XP)
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">MAX</span>
                      )}
                    </div>

                    {/* Perk 4: Endurecimento de Escudo */}
                    <div className="p-3.5 rounded-xl bg-[#121622] border border-zinc-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-cyan-400" />
                          <h6 className="font-bold text-white text-xs">Endurecimento de Escudo</h6>
                          <span className="text-[10px] font-mono text-cyan-300">Nv.{dungeon.perks.shieldHardening}/5</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Reduz o desgaste do escudo em {dungeon.perks.shieldHardening * 15}% contra erros comuns.
                        </p>
                      </div>

                      {dungeon.perks.shieldHardening < 5 ? (
                        <button
                          onClick={() => {
                            sound.playClick();
                            onUpgradePerk('shieldHardening');
                          }}
                          disabled={quests.rpgDungeonXp < (dungeon.perks.shieldHardening + 1) * 80}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono text-[11px] font-bold cursor-pointer whitespace-nowrap"
                        >
                          +1 ({(dungeon.perks.shieldHardening + 1) * 80} XP)
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">MAX</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
