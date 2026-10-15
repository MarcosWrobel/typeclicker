// ─────────────────────────────────────────────────────────────
// Lobby e Forja do Masmorreiro — ByteQuest
// Gestão de Equipamento, Pré-visualização do Herói e Forja com Bytes
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { Shield, Swords, Sparkles, Anvil, Play, Home, Check, RefreshCw } from 'lucide-react';
import { HeroLoadout, RpgItem, EquipmentSlot, RARITY_CONFIG } from '../../../types/byteQuest';
import { RpgClassType } from '../../../types/rpgClass';
import { ByteQuestHeroCanvas } from './ByteQuestHeroCanvas';
import { BYTE_QUEST_ITEMS } from '../../../data/byteQuestItems';

export interface ByteQuestLobbyProps {
  rpgClass: RpgClassType;
  equipped: HeroLoadout;
  inventory: RpgItem[];
  availableBytes: number;
  onSelectClass: (newClass: RpgClassType) => void;
  onEquipItem: (item: RpgItem) => void;
  onUnequipSlot: (slot: EquipmentSlot) => void;
  onForgeItem: (cost: number) => boolean;
  onStartRun: () => void;
  onExitToHub: () => void;
}

export const ByteQuestLobby: React.FC<ByteQuestLobbyProps> = ({
  rpgClass,
  equipped,
  inventory,
  availableBytes,
  onSelectClass,
  onEquipItem,
  onUnequipSlot,
  onForgeItem,
  onStartRun,
  onExitToHub
}) => {
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<EquipmentSlot | 'all'>('all');
  const [forgeSuccessMessage, setForgeSuccessMessage] = useState<string | null>(null);

  // Itens restritos estritamente ao arquétipo selecionado
  const filteredInventory = inventory.filter((item) => {
    if (item.requiredClass && item.requiredClass !== rpgClass) return false;
    return selectedSlotFilter === 'all' ? true : item.slot === selectedSlotFilter;
  });

  const handleForge = () => {
    const cost = 400; // Custo de 400 Bytes por forja
    if (availableBytes < cost) {
      alert(`Você precisa de pelo menos ${cost} Bytes para forjar um equipamento.`);
      return;
    }
    const success = onForgeItem(cost);
    if (success) {
      setForgeSuccessMessage('Novo item forjado para seu arquétipo!');
      setTimeout(() => setForgeSuccessMessage(null), 3000);
    }
  };

  const getSlotItem = (slot: EquipmentSlot): RpgItem | undefined => {
    return equipped[slot];
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 p-4 select-none">
      {/* ─── CABEÇALHO DO LOBBY COM SELEÇÃO DE ARQUÉTIPO ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/90 border border-violet-900/40 shadow-xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-950/80 border border-violet-500/40 text-violet-300 font-mono text-xs font-bold uppercase tracking-wider">
              Quartel da Masmorra
            </span>
            <span className="text-zinc-500 text-xs font-mono">• Bytezinho RPG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wide">
            SELEÇÃO DE CLASSE & FORJA
          </h1>
        </div>

        {/* SELETOR DE ARQUÉTIPO (GUERREIRO / ARQUEIRO / MAGO) */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-zinc-900/90 rounded-2xl border border-zinc-800">
          {[
            { id: 'warrior' as const, label: 'Guerreiro', icon: Swords, color: 'text-red-400', desc: 'Melee • 140 HP' },
            { id: 'archer' as const, label: 'Arqueiro', icon: Shield, color: 'text-emerald-400', desc: 'Flechas • Rápido' },
            { id: 'mage' as const, label: 'Mago', icon: Sparkles, color: 'text-purple-400', desc: 'Magia • Frágil' }
          ].map((c) => {
            const isSelected = rpgClass === c.id;
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => onSelectClass(c.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-950/60 ring-1 ring-violet-400'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : c.color}`} />
                <div className="flex flex-col text-left">
                  <span>{c.label}</span>
                  <span className="text-[9px] font-normal opacity-80">{c.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-2">
            <span className="text-xs text-zinc-400">SALDO:</span>
            <span className="text-sm font-bold text-cyan-400">{availableBytes.toLocaleString()} Bytes</span>
          </div>

          <button
            onClick={onStartRun}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-950/50 hover:scale-105 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>ENTRAR NA MASMORRA</span>
          </button>

          <button
            onClick={onExitToHub}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/60 transition-colors"
            title="Voltar ao Hub"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ─── CORPO PRINCIPAL: HERÓI + SLOTS + FORJA + INVENTÁRIO ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Esquerdo: Visual do Herói e Slots Equipados (5 colunas) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex flex-col items-center gap-4 relative overflow-hidden">
            {/* Fundo de brilho suave */}
            <div className="absolute inset-0 bg-radial from-violet-900/10 via-transparent to-transparent pointer-events-none" />

            <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Equipamento Ativo do Herói
            </h3>

            {/* Canvas do Herói */}
            <div className="my-2">
              <ByteQuestHeroCanvas loadout={equipped} rpgClass={rpgClass} size={200} />
            </div>

            {/* Slots de Equipamento (Arma, Peitoral, Elmo, Acessório) */}
            <div className="grid grid-cols-2 gap-3 w-full font-mono text-xs">
              {(['weapon', 'chest', 'head', 'accessory'] as EquipmentSlot[]).map((slot) => {
                const item = getSlotItem(slot);
                return (
                  <div
                    key={slot}
                    className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
                      item
                        ? `${RARITY_CONFIG[item.rarity].bg} ${RARITY_CONFIG[item.rarity].border}`
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 uppercase">
                      <span>{slot === 'weapon' ? 'Arma' : slot === 'chest' ? 'Peitoral' : slot === 'head' ? 'Elmo' : 'Acessório'}</span>
                      {item && (
                        <button
                          onClick={() => onUnequipSlot(slot)}
                          className="hover:text-rose-400 cursor-pointer"
                          title="Desequipar"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {item ? (
                      <div className="flex flex-col">
                        <span className={`font-bold truncate ${RARITY_CONFIG[item.rarity].color}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {item.stats.damage ? `+${item.stats.damage} Dano ` : ''}
                          {item.stats.defense ? `+${item.stats.defense} Def ` : ''}
                          {item.stats.health ? `+${item.stats.health} HP ` : ''}
                          {item.stats.speedBps ? `+${item.stats.speedBps} Vel ` : ''}
                        </span>
                      </div>
                    ) : (
                      <span className="italic text-zinc-600">Vazio</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Forja com Bytes */}
          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-amber-900/30 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Anvil className="w-4 h-4" />
              <span>Forja do Masmorreiro</span>
            </div>
            <p className="text-xs font-mono text-zinc-400">
              Forje equipamentos aleatórios forjados com o poder dos seus Bytes acumulados.
            </p>
            {forgeSuccessMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{forgeSuccessMessage}</span>
              </div>
            )}
            <button
              onClick={handleForge}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>FORJAR EQUIPAMENTO (400 BYTES)</span>
            </button>
          </div>
        </div>

        {/* Painel Direito: Inventário de Itens (7 colunas) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex flex-col gap-4 h-full">
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-zinc-200 font-bold">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>INVENTÁRIO DE ITENS ({inventory.length})</span>
              </div>

              {/* Filtro por Slot */}
              <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                {(['all', 'weapon', 'chest', 'head', 'accessory'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedSlotFilter(filter)}
                    className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-colors cursor-pointer ${
                      selectedSlotFilter === filter
                        ? 'bg-violet-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {filter === 'all' ? 'Todos' : filter === 'weapon' ? 'Armas' : filter === 'chest' ? 'Peitorais' : filter === 'head' ? 'Elmos' : 'Anéis'}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Itens do Inventário */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[460px] pr-1">
              {filteredInventory.map((item) => {
                const isEquipped = Object.values(equipped).some((e) => e?.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex flex-col gap-2 transition-all ${
                      RARITY_CONFIG[item.rarity].bg
                    } ${RARITY_CONFIG[item.rarity].border} ${isEquipped ? 'ring-2 ring-violet-500/60' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className={`font-mono text-xs font-bold ${RARITY_CONFIG[item.rarity].color}`}>
                          {item.name}
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400 uppercase">
                          {item.slot} • {RARITY_CONFIG[item.rarity].name}
                        </span>
                      </div>
                      {isEquipped ? (
                        <span className="text-[10px] font-mono text-violet-300 font-bold bg-violet-950/80 px-2 py-0.5 rounded border border-violet-500/40">
                          EQUIPADO
                        </span>
                      ) : (
                        <button
                          onClick={() => onEquipItem(item)}
                          className="text-[10px] font-mono text-zinc-200 hover:text-white bg-zinc-800 hover:bg-violet-600 px-2.5 py-1 rounded transition-colors cursor-pointer"
                        >
                          Equipar
                        </button>
                      )}
                    </div>

                    <p className="font-mono text-[11px] text-zinc-400 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto font-mono text-[10px] text-zinc-300">
                      {item.stats.damage && <span className="text-rose-400 font-bold">+{item.stats.damage} Dano</span>}
                      {item.stats.defense && <span className="text-sky-400 font-bold">+{item.stats.defense} Defesa</span>}
                      {item.stats.health && <span className="text-emerald-400 font-bold">+{item.stats.health} HP</span>}
                      {item.stats.speedBps && <span className="text-amber-400 font-bold">+{item.stats.speedBps} Vel</span>}
                      {item.stats.critRate && <span className="text-orange-400 font-bold">+{item.stats.critRate}% Crítico</span>}
                    </div>
                  </div>
                );
              })}
              {filteredInventory.length === 0 && (
                <div className="col-span-2 py-12 text-center text-zinc-500 font-mono text-xs">
                  Nenhum item encontrado nesta categoria. Derrote chefes na masmorra ou forje novos itens!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
