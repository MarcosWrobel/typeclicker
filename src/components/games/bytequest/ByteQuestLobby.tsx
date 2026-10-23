// ─────────────────────────────────────────────────────────────
// Lobby do Masmorreiro — ByteQuest 2.0 (Interface Didática & Intuitiva)
// Visão Central: Herói + 6 Slots + Inventário
// Menus Flutuantes Sobrepostos: Forja, Talentos/Subclasse, Chips de IA, Tormento e Conquistas
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Swords,
  Sparkles,
  Anvil,
  Play,
  Home,
  Check,
  RefreshCw,
  Trash2,
  Cpu,
  Trophy,
  Skull,
  Zap,
  Award,
  X,
  Compass,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  HeroLoadout,
  RpgItem,
  EquipmentSlot,
  RARITY_CONFIG,
  HeroSubclassId,
  SUBCLASS_DEFS,
  TalentId,
  TALENT_DEFS,
  AiChipId,
  AI_CHIP_DEFS,
  CORRUPTION_TIERS,
  ACHIEVEMENT_DEFS,
  BiomeId,
  BIOMES_DATA
} from '../../../types/byteQuest';
import { RpgClassType } from '../../../types/rpgClass';
import { ByteQuestHeroCanvas } from './ByteQuestHeroCanvas';
import { ByteQuestItemIcon } from './ByteQuestItemIcon';
import { getItemDismantleValue } from '../../../data/byteQuestItems';

export interface ByteQuestLobbyProps {
  rpgClass: RpgClassType;
  equipped: HeroLoadout;
  inventory: RpgItem[];
  availableBytes: number;
  selectedSubclass: HeroSubclassId;
  talents: Partial<Record<TalentId, number>>;
  unlockedAiChips: AiChipId[];
  activeAiChips: AiChipId[];
  corruptionTier: number;
  startingBiome: BiomeId;
  unlockedAchievements: string[];
  onSelectClass: (newClass: RpgClassType) => void;
  onSelectSubclass: (subclass: HeroSubclassId) => void;
  onUpgradeTalent: (talentId: TalentId) => void;
  onToggleAiChip: (chipId: AiChipId) => void;
  onSelectCorruptionTier: (tier: number) => void;
  onSelectStartingBiome: (biome: BiomeId) => void;
  onEquipItem: (item: RpgItem) => void;
  onUnequipSlot: (slot: EquipmentSlot) => void;
  onUpgradeItem?: (slot: EquipmentSlot) => void;
  onForgeItem: (cost: number) => { success: boolean; item?: RpgItem; rarity?: string };
  onDismantleItem: (item: RpgItem) => void;
  onStartRun: () => void;
  onStartPvP?: () => void;
  onExitToHub: () => void;
}

const SLOT_LABELS: Record<EquipmentSlot, string> = {
  weapon: 'Arma',
  chest: 'Peitoral',
  head: 'Elmo',
  boots: 'Botas',
  accessory: 'Anel',
  relic: 'Relíquia'
};

type ActiveModal = 'none' | 'forge' | 'talents' | 'ai_chips' | 'campaign' | 'achievements';

export const ByteQuestLobby: React.FC<ByteQuestLobbyProps> = ({
  rpgClass,
  equipped,
  inventory,
  availableBytes,
  selectedSubclass,
  talents,
  unlockedAiChips,
  activeAiChips,
  corruptionTier,
  startingBiome,
  unlockedAchievements,
  onSelectClass,
  onSelectSubclass,
  onUpgradeTalent,
  onToggleAiChip,
  onSelectCorruptionTier,
  onSelectStartingBiome,
  onEquipItem,
  onUnequipSlot,
  onUpgradeItem,
  onForgeItem,
  onDismantleItem,
  onStartRun,
  onStartPvP,
  onExitToHub
}) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<EquipmentSlot | 'all'>('all');
  const [forgeSuccessMessage, setForgeSuccessMessage] = useState<string | null>(null);

  const filteredInventory = inventory.filter((item) => {
    if (item.requiredClass && item.requiredClass !== rpgClass) return false;
    return selectedSlotFilter === 'all' ? true : item.slot === selectedSlotFilter;
  });

  const classSubclasses = SUBCLASS_DEFS.filter((sc) => sc.rpgClass === rpgClass);
  const currentSubclassDef = SUBCLASS_DEFS.find((sc) => sc.id === selectedSubclass);
  const currentCorruption = CORRUPTION_TIERS.find((c) => c.tier === corruptionTier) || CORRUPTION_TIERS[0];
  const currentBiomeData = BIOMES_DATA[startingBiome];

  const handleForge = () => {
    const cost = 400;
    if (availableBytes < cost) {
      alert(`Você precisa de pelo menos ${cost} Bytes para forjar um equipamento.`);
      return;
    }
    const result = onForgeItem(cost);
    if (result.success && result.item) {
      const rarityLabel = RARITY_CONFIG[result.item.rarity]?.name || 'Item';
      setForgeSuccessMessage(`Forjado: ${result.item.name} (${rarityLabel})!`);
      setTimeout(() => setForgeSuccessMessage(null), 4000);
    }
  };

  const getSlotItem = (slot: EquipmentSlot): RpgItem | undefined => {
    return equipped[slot];
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 p-4 select-none relative">
      {/* ─── 1. BARRA SUPERIOR PRINCIPAL ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/90 border border-violet-900/40 shadow-xl backdrop-blur-md">
        {/* Identificação e Subclasse */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-950 border border-violet-500/40 flex items-center justify-center text-violet-300 shadow">
            {rpgClass === 'warrior' ? <Swords className="w-5 h-5 text-red-400" /> : rpgClass === 'archer' ? <Shield className="w-5 h-5 text-emerald-400" /> : <Sparkles className="w-5 h-5 text-purple-400" />}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-black text-white tracking-wide">
                QUARTEL DO BYTEZINHO
              </span>
              <span className="px-2 py-0.5 rounded-full bg-violet-950/80 border border-violet-500/40 text-violet-300 font-mono text-[10px] font-bold">
                {currentSubclassDef?.name}
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              Prepare seus equipamentos, talentos e automações antes de descer à masmorra
            </span>
          </div>
        </div>

        {/* Seletor de Arquétipo com Destaque Intuitivo */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800">
          {[
            { id: 'warrior' as const, label: 'Guerreiro', icon: Swords, color: 'text-red-400' },
            { id: 'archer' as const, label: 'Arqueiro', icon: Shield, color: 'text-emerald-400' },
            { id: 'mage' as const, label: 'Mago', icon: Sparkles, color: 'text-purple-400' }
          ].map((c) => {
            const isSelected = rpgClass === c.id;
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => onSelectClass(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-950/60 ring-1 ring-violet-400'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
                title={`Trocar classe para ${c.label}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : c.color}`} />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Saldo de Bytes & Voltar ao Hub */}
        <div className="flex items-center gap-2 font-mono">
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900/90 border border-cyan-500/30 flex items-center gap-2 shadow-inner">
            <span className="text-[11px] text-zinc-400 font-bold">SALDO:</span>
            <span className="text-sm font-black text-cyan-400">{availableBytes.toLocaleString()} B</span>
          </div>

          <button
            onClick={onExitToHub}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/60 transition-colors cursor-pointer"
            title="Voltar ao Hub de Jogos"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── 2. BARRA DE MENUS FLUTUANTES / MODAIS (DESTAQUE DIDÁTICO) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono">
        {/* Botão Forja */}
        <button
          onClick={() => setActiveModal('forge')}
          className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 hover:bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 transition-all shadow-md group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
              <Anvil className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-amber-300">Forja Mágica</span>
              <span className="text-[9px] text-zinc-400">Criar & Refinar</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-amber-500/60 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Botão Talentos & Subclasse */}
        <button
          onClick={() => setActiveModal('talents')}
          className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 hover:bg-violet-950/40 border border-violet-500/40 hover:border-violet-400 transition-all shadow-md group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-violet-300">Talentos</span>
              <span className="text-[9px] text-zinc-400">Subclasse & Perks</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-violet-500/60 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Botão Chips de IA */}
        <button
          onClick={() => setActiveModal('ai_chips')}
          className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 hover:bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-md group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-cyan-300">Chips de IA</span>
              <span className="text-[9px] text-zinc-400">{activeAiChips.length}/2 Ativos</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-500/60 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Botão Estágio & Tormento */}
        <button
          onClick={() => setActiveModal('campaign')}
          className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 hover:bg-rose-950/40 border border-rose-500/40 hover:border-rose-400 transition-all shadow-md group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
              <Skull className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-rose-300">Dificuldade</span>
              <span className="text-[9px] text-zinc-400">Tormento {corruptionTier}</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-rose-500/60 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Botão Conquistas */}
        <button
          onClick={() => setActiveModal('achievements')}
          className="col-span-2 sm:col-span-1 flex items-center justify-between p-3 rounded-xl bg-zinc-950/80 hover:bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-md group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-emerald-300">Conquistas</span>
              <span className="text-[9px] text-zinc-400">{unlockedAchievements.length}/{ACHIEVEMENT_DEFS.length}</span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-500/60 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* ─── 3. CORPO CENTRAL: HERÓI (6 SLOTS) & INVENTÁRIO VISUAL ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Painel Esquerdo: Visual do Bytezinho + 6 Slots ao Redor (5 colunas) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex flex-col items-center gap-3 relative shadow-xl">
            <div className="flex items-center justify-between w-full font-mono text-xs">
              <span className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-violet-400" />
                Equipamento Ativo
              </span>
              <span className="text-[10px] text-zinc-500">6 Slots de Combate</span>
            </div>

            {/* Vitrine do Bytezinho no Centro */}
            <div className="relative flex items-center justify-center py-1">
              <div className="absolute inset-0 bg-radial from-violet-600/15 via-transparent to-transparent blur-md pointer-events-none" />
              <ByteQuestHeroCanvas loadout={equipped} rpgClass={rpgClass} size={160} />
            </div>

            {/* Grid dos 6 Slots de Equipamento */}
            <div className="grid grid-cols-2 gap-2 w-full font-mono text-xs">
              {(['weapon', 'chest', 'head', 'boots', 'accessory', 'relic'] as EquipmentSlot[]).map((slot) => {
                const item = getSlotItem(slot);
                const upgLvl = item?.upgradeLevel || 0;
                const statMult = 1 + upgLvl * 0.15;
                const nextUpgCost = 200 * (upgLvl + 1);

                return (
                  <div
                    key={slot}
                    className={`p-2.5 rounded-xl border flex flex-col gap-1 transition-all ${
                      item
                        ? `${RARITY_CONFIG[item.rarity].bg} ${RARITY_CONFIG[item.rarity].border} shadow-sm`
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 uppercase font-bold">
                      <span>{SLOT_LABELS[slot]}</span>
                      {item && (
                        <button
                          onClick={() => onUnequipSlot(slot)}
                          className="hover:text-rose-400 cursor-pointer text-xs"
                          title="Desequipar para o inventário"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {item ? (
                      <>
                        <div className="flex items-center gap-2">
                          <ByteQuestItemIcon assetKey={item.visualAssetKey} rarity={item.rarity} size={32} className="shrink-0" />
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className={`font-bold truncate text-[10px] ${RARITY_CONFIG[item.rarity].color}`}>
                              {item.name} {upgLvl > 0 ? `+${upgLvl}` : ''}
                            </span>
                            <span className="text-[9px] text-zinc-300 truncate">
                              {item.stats.damage ? `+${Math.round(item.stats.damage * statMult)} Dano ` : ''}
                              {item.stats.defense ? `+${Math.round(item.stats.defense * statMult)} Def ` : ''}
                              {item.stats.health ? `+${Math.round(item.stats.health * statMult)} HP ` : ''}
                              {item.stats.speedBps ? `+${Math.round(item.stats.speedBps * statMult)} Vel ` : ''}
                              {item.stats.critRate ? `+${Math.round(item.stats.critRate * statMult)}% Crit ` : ''}
                            </span>
                          </div>
                        </div>

                        {onUpgradeItem && upgLvl < 5 && (
                          <button
                            onClick={() => onUpgradeItem(slot)}
                            disabled={availableBytes < nextUpgCost}
                            className={`mt-0.5 py-0.5 px-2 rounded text-[9px] font-bold flex items-center justify-between transition-colors ${
                              availableBytes >= nextUpgCost
                                ? 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 border border-amber-500/40 cursor-pointer'
                                : 'bg-zinc-900/50 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                            }`}
                            title="Refinar item (+15% em todos os atributos)"
                          >
                            <span>🔨 Refinar +{upgLvl + 1}</span>
                            <span>{nextUpgCost} B</span>
                          </button>
                        )}
                        {upgLvl >= 5 && (
                          <span className="mt-0.5 py-0.5 text-center rounded bg-amber-500/20 text-amber-300 text-[8px] font-bold border border-amber-500/30">
                            ★ REFINO MÁXIMO (+5)
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="italic text-zinc-600 text-[10px] py-1">Vazio</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Painel Direito: Inventário com Filtros Rápidos (7 colunas) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex flex-col gap-3 h-full shadow-xl">
            {/* Cabeçalho do Inventário e Filtros */}
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="font-bold text-zinc-200">INVENTÁRIO ({inventory.length} ITENS)</span>
              </div>

              {/* Filtro por Slot */}
              <div className="flex flex-wrap items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                {(['all', 'weapon', 'chest', 'head', 'boots', 'accessory', 'relic'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedSlotFilter(filter)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition-colors cursor-pointer ${
                      selectedSlotFilter === filter
                        ? 'bg-violet-600 text-white shadow'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {filter === 'all' ? 'Todos' : SLOT_LABELS[filter]}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid dos Itens no Inventário */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto max-h-[380px] pr-1">
              {filteredInventory.map((item) => {
                const isEquipped = Object.values(equipped).some((e) => e?.id === item.id);
                const recycleBytes = getItemDismantleValue(item.rarity);

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                      RARITY_CONFIG[item.rarity].bg
                    } ${RARITY_CONFIG[item.rarity].border} ${isEquipped ? 'ring-2 ring-violet-500/60' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <ByteQuestItemIcon assetKey={item.visualAssetKey} rarity={item.rarity} size={34} className="shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className={`font-mono text-xs font-bold truncate ${RARITY_CONFIG[item.rarity].color}`}>
                            {item.name}
                          </span>
                          <span className="font-mono text-[9px] text-zinc-400 uppercase">
                            {SLOT_LABELS[item.slot]} • {RARITY_CONFIG[item.rarity].name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isEquipped ? (
                          <span className="text-[9px] font-mono text-violet-300 font-bold bg-violet-950/80 px-2 py-0.5 rounded border border-violet-500/40">
                            EQUIPADO
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => onEquipItem(item)}
                              className="text-[10px] font-mono text-zinc-200 hover:text-white bg-zinc-800 hover:bg-violet-600 px-2.5 py-1 rounded transition-colors cursor-pointer"
                            >
                              Equipar
                            </button>
                            <button
                              onClick={() => onDismantleItem(item)}
                              className="text-[10px] font-mono text-zinc-400 hover:text-amber-300 bg-zinc-900/90 hover:bg-amber-950/60 border border-zinc-800 hover:border-amber-700/60 px-2 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer"
                              title={`Desmantelar item para recuperar ${recycleBytes} Bytes`}
                            >
                              <Trash2 className="w-3 h-3 text-amber-400" />
                              <span>+{recycleBytes}</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="font-mono text-[10px] text-zinc-400 line-clamp-2">
                      {item.description}
                    </p>

                    {item.passiveAbility && (
                      <div className="p-1.5 rounded-lg bg-amber-950/30 border border-amber-500/30 flex flex-col gap-0.5">
                        <span className="font-mono text-[9px] font-bold text-amber-300">
                          ✨ {item.passiveAbility.name}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-auto font-mono text-[9px] text-zinc-300">
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
                  Nenhum item encontrado nesta categoria. Abra a Forja Mágica ou vença incursões!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. BARRA DE STATUS INFERIOR & BOTÃO GIGANTE DE ENTRADA ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/90 border border-violet-900/40 shadow-xl backdrop-blur-md font-mono">
        {/* Resumo da Próxima Incursão */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Compass className="w-4 h-4 text-violet-400" />
            <span>Bioma: <strong className="text-white">{currentBiomeData.name}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Skull className="w-4 h-4 text-rose-400" />
            <span>Tormento: <strong className="text-rose-300">{corruptionTier} ({currentCorruption.bytesMultiplier}x B)</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Subclasse: <strong className="text-amber-300">{currentSubclassDef?.name}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Botão Duelo 1v1 Battle Royale */}
          {onStartPvP && (
            <button
              onClick={onStartPvP}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-black text-xs font-mono uppercase tracking-wider shadow-xl shadow-amber-950/70 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-amber-400/50"
              title="Duelo 1v1 Battle Royale por Recursos com Classes Espelho e Arena Encolhendo"
            >
              <Swords className="w-4 h-4" />
              <span>DUELO 1V1 (PVP)</span>
            </button>
          )}

          {/* Botão de Destaque Máximo (Solo) */}
          <button
            onClick={onStartRun}
            className="flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-black text-sm shadow-xl shadow-violet-950/80 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-violet-400/50"
          >
            <Play className="w-5 h-5 fill-current" />
            <span className="tracking-wider">ENTRAR NA MASMORRA</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. MENUS FLUTUANTES / MODAIS SOBREPOSTOS (OVERLAYS)
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModal !== 'none' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-zinc-950 border border-violet-500/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-hidden"
            >
              {/* Cabeçalho do Modal */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2 font-mono">
                  {activeModal === 'forge' && <Anvil className="w-5 h-5 text-amber-400" />}
                  {activeModal === 'talents' && <Zap className="w-5 h-5 text-violet-400" />}
                  {activeModal === 'ai_chips' && <Cpu className="w-5 h-5 text-cyan-400" />}
                  {activeModal === 'campaign' && <Skull className="w-5 h-5 text-rose-400" />}
                  {activeModal === 'achievements' && <Trophy className="w-5 h-5 text-emerald-400" />}
                  <h2 className="text-lg font-black text-white">
                    {activeModal === 'forge' && 'FORJA DO MASMORREIRO'}
                    {activeModal === 'talents' && 'SUBCLASSES & ÁRVORE DE TALENTOS'}
                    {activeModal === 'ai_chips' && 'CHIPS DE AUTOMAÇÃO TÁTICA (IA)'}
                    {activeModal === 'campaign' && 'MAPA DE BIOMA & PROTOCOLO DE TORMENTO'}
                    {activeModal === 'achievements' && 'QUADRO DE CONQUISTAS & RECOMPENSAS'}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveModal('none')}
                  className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Conteúdo do Modal: FORJA */}
              {activeModal === 'forge' && (
                <div className="flex flex-col gap-4 font-mono text-xs overflow-y-auto pr-1">
                  <p className="text-zinc-400 leading-relaxed">
                    Utilize seus Bytes para forjar novos equipamentos aleatórios para qualquer um dos 6 slots (Arma, Peitoral, Elmo, Botas, Anel ou Relíquia).
                  </p>

                  <div className="grid grid-cols-4 gap-2 p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 text-center text-[10px]">
                    <div className="flex flex-col"><span className="text-zinc-400 font-bold">Comum</span><span className="text-zinc-300">65%</span></div>
                    <div className="flex flex-col"><span className="text-sky-400 font-bold">Raro</span><span className="text-zinc-300">24%</span></div>
                    <div className="flex flex-col"><span className="text-pink-400 font-bold">Épico</span><span className="text-zinc-300">8.5%</span></div>
                    <div className="flex flex-col"><span className="text-purple-400 font-bold">Quântico</span><span className="text-zinc-300">2.5%</span></div>
                  </div>

                  {forgeSuccessMessage && (
                    <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{forgeSuccessMessage}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex flex-col">
                      <span className="text-zinc-300 font-bold">Custo da Forja:</span>
                      <span className="text-[10px] text-zinc-500">Garante 1 item para sua classe ativa</span>
                    </div>
                    <span className="text-sm font-black text-amber-400">400 Bytes</span>
                  </div>

                  <button
                    onClick={handleForge}
                    className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-lg transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>FORJAR EQUIPAMENTO AGORA</span>
                  </button>
                </div>
              )}

              {/* Conteúdo do Modal: TALENTOS & SUBCLASSE */}
              {activeModal === 'talents' && (
                <div className="flex flex-col gap-4 font-mono text-xs overflow-y-auto pr-1 max-h-[65vh]">
                  {/* Seletor de Subclasse */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-amber-300 uppercase">
                      1. Especialização da Classe ({rpgClass === 'warrior' ? 'Guerreiro' : rpgClass === 'archer' ? 'Arqueiro' : 'Mago'})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {classSubclasses.map((sc) => {
                        const isSel = selectedSubclass === sc.id;
                        return (
                          <button
                            key={sc.id}
                            onClick={() => onSelectSubclass(sc.id)}
                            className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                              isSel
                                ? 'bg-violet-950/60 border-violet-400 ring-2 ring-violet-500/40'
                                : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{sc.name}</span>
                              {isSel && <span className="px-1.5 py-0.5 rounded bg-violet-600 text-[9px] font-bold text-white">ATIVA</span>}
                            </div>
                            <span className="text-[10px] font-bold text-amber-300">★ {sc.tagline}</span>
                            <p className="text-[10px] text-zinc-400 leading-relaxed">{sc.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Árvore de 8 Talentos */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-cyan-300 uppercase">
                      2. Talentos Permanentes (Aplicam-se a todas as Classes)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {TALENT_DEFS.map((talent) => {
                        const lvl = talents[talent.id] || 0;
                        const isMax = lvl >= talent.maxLevel;
                        const cost = talent.baseCost + lvl * talent.costStep;
                        const canAfford = availableBytes >= cost && !isMax;

                        return (
                          <div
                            key={talent.id}
                            className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between gap-1.5"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-zinc-100">{talent.name}</span>
                                <span className="text-[10px] font-bold text-amber-400">Nv. {lvl}/{talent.maxLevel}</span>
                              </div>
                              <p className="text-[9px] text-zinc-400">{talent.description}</p>
                            </div>

                            {isMax ? (
                              <div className="py-0.5 text-center rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold">
                                ★ NÍVEL MÁXIMO
                              </div>
                            ) : (
                              <button
                                onClick={() => onUpgradeTalent(talent.id)}
                                disabled={!canAfford}
                                className={`py-1 px-2.5 rounded text-[9px] font-bold flex items-center justify-between transition-all ${
                                  canAfford ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                }`}
                              >
                                <span>Aprimorar</span>
                                <span>{cost} Bytes</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Conteúdo do Modal: CHIPS DE IA */}
              {activeModal === 'ai_chips' && (
                <div className="flex flex-col gap-3 font-mono text-xs overflow-y-auto pr-1 max-h-[65vh]">
                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-[11px] text-cyan-200">
                    <strong>Protocolos de Automação (Auto-Cast):</strong> Equipe até <strong>2 Chips de IA</strong> simultaneamente. Eles reagem e executam ações automaticamente nas batalhas quando a condição é atingida!
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {AI_CHIP_DEFS.map((chip) => {
                      const isUnlocked = unlockedAiChips.includes(chip.id);
                      const isEquipped = activeAiChips.includes(chip.id);
                      const canAfford = availableBytes >= chip.unlockCost;

                      return (
                        <div
                          key={chip.id}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                            isEquipped ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/50' : 'bg-zinc-900/80 border-zinc-800'
                          }`}
                        >
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <Cpu className={`w-4 h-4 ${isEquipped ? 'text-cyan-400' : 'text-zinc-400'}`} />
                              <span className="text-xs font-bold text-white">{chip.name}</span>
                              <span className="px-2 py-0.2 rounded bg-zinc-950 border border-zinc-700 text-[9px] text-amber-300 font-bold">
                                {chip.conditionLabel}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-300">{chip.description}</p>
                          </div>

                          <button
                            onClick={() => onToggleAiChip(chip.id)}
                            disabled={!isUnlocked && !canAfford}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
                              isEquipped
                                ? 'bg-rose-600/80 hover:bg-rose-500 text-white cursor-pointer'
                                : isUnlocked
                                ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer'
                                : canAfford
                                ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 cursor-pointer'
                                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            }`}
                          >
                            {isEquipped ? 'Desativar' : isUnlocked ? 'Equipar' : `Desbloquear (${chip.unlockCost} B)`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Conteúdo do Modal: ESTÁGIO & TORMENTO */}
              {activeModal === 'campaign' && (
                <div className="flex flex-col gap-4 font-mono text-xs overflow-y-auto pr-1 max-h-[65vh]">
                  {/* Bioma Inicial */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-violet-300 uppercase">1. Bioma Inicial da Incursão</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {(['crypt', 'forge', 'quantum_core'] as BiomeId[]).map((bKey) => {
                        const bData = BIOMES_DATA[bKey];
                        const isSel = startingBiome === bKey;
                        return (
                          <button
                            key={bKey}
                            onClick={() => onSelectStartingBiome(bKey)}
                            className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                              isSel ? 'bg-violet-950/60 border-violet-400 ring-2 ring-violet-500/40' : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <span className="text-xs font-bold text-white">{bData.name}</span>
                            <span className="text-[10px] text-zinc-400">
                              {bKey === 'crypt' ? 'Estágio I • Cripta Cibernética' : bKey === 'forge' ? 'Estágio II • Magma & Engrenagens' : 'Estágio III • Singularidade'}
                            </span>
                            {isSel && <span className="text-[9px] font-bold text-violet-300 uppercase mt-1">✓ Selecionado</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Níveis de Tormento */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-rose-400 uppercase">2. Protocolo de Tormento (Dificuldade)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {CORRUPTION_TIERS.map((cTier) => {
                        const isSel = corruptionTier === cTier.tier;
                        return (
                          <button
                            key={cTier.tier}
                            onClick={() => onSelectCorruptionTier(cTier.tier)}
                            className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                              isSel ? 'bg-rose-950/50 border-rose-400 ring-2 ring-rose-500/40' : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{cTier.name}</span>
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-bold">
                                {cTier.bytesMultiplier}x Bytes
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-300">{cTier.subtitle} • HP Monstros: {Math.round(cTier.enemyHpMult * 100)}%</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Conteúdo do Modal: CONQUISTAS */}
              {activeModal === 'achievements' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs overflow-y-auto pr-1 max-h-[65vh]">
                  {ACHIEVEMENT_DEFS.map((ach) => {
                    const isDone = unlockedAchievements.includes(ach.id);
                    return (
                      <div
                        key={ach.id}
                        className={`p-3 rounded-xl border flex flex-col justify-between gap-1.5 ${
                          isDone ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-zinc-900/50 border-zinc-800 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <Award className={`w-4 h-4 shrink-0 ${isDone ? 'text-emerald-400' : 'text-zinc-500'}`} />
                            <span className="text-xs font-bold text-white">{ach.title}</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[9px] font-bold shrink-0">
                            +{ach.rewardBytes} B
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400">{ach.description}</p>
                        <span className={`text-[9px] font-bold uppercase ${isDone ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {isDone ? '✓ CONQUISTADA' : '🔒 BLOQUEADA'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


