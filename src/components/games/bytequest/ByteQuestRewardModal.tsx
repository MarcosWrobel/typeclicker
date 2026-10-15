// ─────────────────────────────────────────────────────────────
// Tela de Recompensas e Conclusão — ByteQuest
// Resumo de Telemetria, Abertura de Baú de Loot e Retorno
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Skull, Package, ArrowRight, RotateCcw, Home, Sparkles } from 'lucide-react';
import { EngineStats } from './byteQuestEngine';
import { RpgItem, RARITY_CONFIG } from '../../../types/byteQuest';
import { BYTE_QUEST_ITEMS } from '../../../data/byteQuestItems';
import { byteQuestAudio } from './byteQuestAudio';

export interface ByteQuestRewardModalProps {
  isVictory: boolean;
  stats: EngineStats;
  bytesEarned: number;
  onContinueInfinite?: () => void;
  onGoToLobby: (lootItem?: RpgItem) => void;
  onExitToHub: (lootItem?: RpgItem) => void;
}

export const ByteQuestRewardModal: React.FC<ByteQuestRewardModalProps> = ({
  isVictory,
  stats,
  bytesEarned,
  onContinueInfinite,
  onGoToLobby,
  onExitToHub
}) => {
  const [chestOpened, setChestOpened] = useState(false);
  const [lootItem, setLootItem] = useState<RpgItem | null>(null);

  const accuracy = stats.keysTyped > 0 ? Math.round((stats.keysCorrect / stats.keysTyped) * 100) : 100;
  const minutes = Math.max(0.1, stats.timeSurvivedSeconds / 60);
  const wordsTyped = stats.wordsTypedCount;
  const approxWpm = Math.round(wordsTyped / minutes);

  const handleOpenChest = () => {
    if (chestOpened) return;
    setChestOpened(true);
    byteQuestAudio.playChestOpen();

    // Sorteia um item do catálogo baseado no desempenho
    const candidates = isVictory
      ? BYTE_QUEST_ITEMS.filter((i) => i.rarity === 'rare' || i.rarity === 'epic' || i.rarity === 'quantum')
      : BYTE_QUEST_ITEMS.filter((i) => i.rarity === 'common' || i.rarity === 'rare');

    const randomItem = candidates[Math.floor(Math.random() * candidates.length)] || BYTE_QUEST_ITEMS[0];
    setLootItem(randomItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl bg-zinc-950 border border-violet-500/50 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-5"
      >
        {/* Cabeçalho */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div
            className={`p-3 rounded-2xl border ${
              isVictory
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                : 'bg-rose-500/20 border-rose-500/50 text-rose-400'
            }`}
          >
            {isVictory ? <Trophy className="w-8 h-8" /> : <Skull className="w-8 h-8" />}
          </div>
          <h2 className="text-2xl font-black text-white font-mono tracking-wide">
            {isVictory ? 'MASMORRA CONQUISTADA!' : 'QUEDA HEROICA'}
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            {isVictory
              ? 'Você sobreviveu a todas as hordas e derrotou o Guardião Supremo!'
              : 'Você lutou bravamente nas catacumbas do castelo.'}
          </p>
        </div>

        {/* Grade de Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full font-mono text-center">
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-[10px] text-zinc-400 block">TEMPO</span>
            <span className="text-base font-bold text-amber-400">
              {Math.floor(stats.timeSurvivedSeconds / 60)}m {Math.floor(stats.timeSurvivedSeconds % 60)}s
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-[10px] text-zinc-400 block">ABATES</span>
            <span className="text-base font-bold text-violet-400">{stats.enemiesDefeated}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-[10px] text-zinc-400 block">ACURÁCIA</span>
            <span className="text-base font-bold text-emerald-400">{accuracy}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-[10px] text-zinc-400 block">BYTES</span>
            <span className="text-base font-bold text-cyan-400">+{bytesEarned}</span>
          </div>
        </div>

        {/* Baú de Recompensa */}
        <div className="w-full flex flex-col items-center p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 gap-3">
          {!chestOpened ? (
            <button
              onClick={handleOpenChest}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-zinc-950 font-mono font-bold text-sm shadow-lg shadow-amber-950/40 hover:scale-105 transition-all"
            >
              <Package className="w-5 h-5" />
              <span>ABRIR BAÚ DE RECOMPENSA</span>
            </button>
          ) : lootItem ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border ${
                RARITY_CONFIG[lootItem.rarity].bg
              } ${RARITY_CONFIG[lootItem.rarity].border}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                  <Sparkles className={`w-6 h-6 ${RARITY_CONFIG[lootItem.rarity].color}`} />
                </div>
                <div className="flex flex-col text-left">
                  <span className={`font-mono text-sm font-bold ${RARITY_CONFIG[lootItem.rarity].color}`}>
                    {lootItem.name}
                  </span>
                  <span className="font-mono text-xs text-zinc-400">
                    Slot: {lootItem.slot.toUpperCase()} • {RARITY_CONFIG[lootItem.rarity].name}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/40">
                NOVO ITEM!
              </span>
            </motion.div>
          ) : null}
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full font-mono text-xs">
          {isVictory && onContinueInfinite && (
            <button
              onClick={onContinueInfinite}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>MODO INFINITO</span>
            </button>
          )}

          <button
            onClick={() => onGoToLobby(lootItem || undefined)}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center gap-2 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>IR PARA O LOBBY / FORJA</span>
          </button>

          <button
            onClick={() => onExitToHub(lootItem || undefined)}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-300 border border-zinc-700 flex items-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>RETORNAR AO HUB</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
