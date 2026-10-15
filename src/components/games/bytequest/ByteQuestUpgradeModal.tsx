// ─────────────────────────────────────────────────────────────
// Modal de Escolha de Upgrades — ByteQuest
// 3 Cartas Procedurais ao Subir de Nível (Pausa o Canvas)
// ─────────────────────────────────────────────────────────────

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Swords, Zap, Shield, Heart, Orbit, Magnet, Sparkles, Flame } from 'lucide-react';
import { RunUpgradeCard, UpgradeEffectType } from '../../../types/byteQuest';

export interface ByteQuestUpgradeModalProps {
  currentLevel: number;
  onSelectUpgrade: (upgrade: RunUpgradeCard) => void;
}

const UPGRADE_POOL: Array<Omit<RunUpgradeCard, 'id' | 'level'>> = [
  {
    title: 'Gume Energizado',
    description: '+12 de dano em todos os ataques automáticos.',
    effectType: 'damage',
    value: 12,
    maxLevel: 5,
    icon: 'Swords',
    rarity: 'rare'
  },
  {
    title: 'Sobrecarga de Frequência',
    description: '+25% de velocidade de ataque contínuo.',
    effectType: 'speed',
    value: 4,
    maxLevel: 5,
    icon: 'Zap',
    rarity: 'common'
  },
  {
    title: 'Foco Letal',
    description: '+10% de chance de acerto crítico.',
    effectType: 'crit',
    value: 10,
    maxLevel: 5,
    icon: 'Flame',
    rarity: 'rare'
  },
  {
    title: 'Vitalidade do Titã',
    description: '+40 de Vida Máxima e cura instantânea.',
    effectType: 'max_hp',
    value: 40,
    maxLevel: 5,
    icon: 'Heart',
    rarity: 'common'
  },
  {
    title: 'Orbe Orbital Protetor',
    description: '+1 orbe arcano giratório que causa dano em contato.',
    effectType: 'orbitals',
    value: 1,
    maxLevel: 4,
    icon: 'Orbit',
    rarity: 'epic'
  },
  {
    title: 'Descarga em Cadeia',
    description: 'Inimigos derrotados liberam choques elétricos nos monstros próximos.',
    effectType: 'lightning',
    value: 2,
    maxLevel: 3,
    icon: 'Sparkles',
    rarity: 'epic'
  },
  {
    title: 'Campo Magnético',
    description: '+60px de alcance para atrair gemas de XP automaticamente.',
    effectType: 'magnet',
    value: 60,
    maxLevel: 4,
    icon: 'Magnet',
    rarity: 'common'
  },
  {
    title: 'Golpe de Teclado Fatal',
    description: 'Palavras digitadas causam +80% de dano crítico supremo.',
    effectType: 'typing_power',
    value: 0.8,
    maxLevel: 5,
    icon: 'Swords',
    rarity: 'rare'
  },
  {
    title: 'Barreira Reativa',
    description: '+60 de escudo protetor temporário.',
    effectType: 'shield',
    value: 60,
    maxLevel: 5,
    icon: 'Shield',
    rarity: 'common'
  }
];

export const ByteQuestUpgradeModal: React.FC<ByteQuestUpgradeModalProps> = ({
  currentLevel,
  onSelectUpgrade
}) => {
  // Sorteia 3 opções sem repetição
  const choices = useMemo(() => {
    const shuffled = [...UPGRADE_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map((item, idx) => ({
      ...item,
      id: `upgrade_${item.effectType}_${idx}`,
      level: 1
    }));
  }, []);

  const getIcon = (effect: UpgradeEffectType) => {
    switch (effect) {
      case 'damage':
        return <Swords className="w-8 h-8 text-rose-400" />;
      case 'speed':
        return <Zap className="w-8 h-8 text-amber-400" />;
      case 'crit':
        return <Flame className="w-8 h-8 text-orange-400" />;
      case 'max_hp':
        return <Heart className="w-8 h-8 text-emerald-400" />;
      case 'shield':
        return <Shield className="w-8 h-8 text-sky-400" />;
      case 'orbitals':
        return <Orbit className="w-8 h-8 text-purple-400" />;
      case 'lightning':
        return <Sparkles className="w-8 h-8 text-yellow-400" />;
      case 'magnet':
        return <Magnet className="w-8 h-8 text-blue-400" />;
      case 'typing_power':
        return <Swords className="w-8 h-8 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-zinc-950 border border-violet-500/50 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-6"
      >
        <div className="flex flex-col items-center gap-1">
          <div className="px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/40 text-violet-300 font-mono text-xs font-bold tracking-wider uppercase">
            Subiu de Nível!
          </div>
          <h2 className="text-2xl font-black text-white font-mono tracking-wide">
            NÍVEL {currentLevel} ATINGIDO
          </h2>
          <p className="text-xs text-zinc-400 font-mono text-center">
            Escolha uma melhoria para evoluir os poderes do herói na masmorra
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {choices.map((card) => (
            <button
              key={card.id}
              onClick={() => onSelectUpgrade(card)}
              className="group relative flex flex-col items-center p-5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-700/60 hover:border-violet-400 transition-all duration-150 text-center gap-3 shadow-lg hover:shadow-violet-950/50 hover:-translate-y-1"
            >
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 group-hover:scale-110 transition-transform">
                {getIcon(card.effectType)}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-sm font-bold text-zinc-100 group-hover:text-violet-300">
                  {card.title}
                </span>
                <span className="font-mono text-xs text-zinc-400 line-clamp-3">
                  {card.description}
                </span>
              </div>
              <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest mt-auto">
                Clique para Equipar
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
