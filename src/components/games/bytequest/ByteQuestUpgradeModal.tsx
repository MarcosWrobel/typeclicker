// ─────────────────────────────────────────────────────────────
// Modal de Escolha de Upgrades — ByteQuest
// 3 Cartas Procedurais ao Subir de Nível (Pausa o Canvas)
// ─────────────────────────────────────────────────────────────

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Swords, Zap, Shield, Heart, Orbit, Magnet, Sparkles, Flame, Wind, FastForward, Timer, Crosshair, Disc, Cpu, Sun, Rocket } from 'lucide-react';
import { RunUpgradeCard, UpgradeEffectType } from '../../../types/byteQuest';
import { RpgClassType } from '../../../types/rpgClass';

export interface ByteQuestUpgradeModalProps {
  currentLevel: number;
  rpgClass?: RpgClassType;
  upgradeLevels?: Record<string, number>;
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
  },
  {
    title: 'Passo Dimensional',
    description: '+75px de alcance na ação de mobilidade (Espaço).',
    effectType: 'mobility_distance',
    value: 75,
    maxLevel: 4,
    icon: 'Wind',
    rarity: 'rare'
  },
  {
    title: 'Bateria Cinética',
    description: '+1 carga máxima de mobilidade (Espaço).',
    effectType: 'mobility_charges',
    value: 1,
    maxLevel: 3,
    icon: 'FastForward',
    rarity: 'epic'
  },
  {
    title: 'Reflexo Acelerado',
    description: '-25% no tempo de recarga da mobilidade (Espaço).',
    effectType: 'mobility_cooldown',
    value: 0.25,
    maxLevel: 3,
    icon: 'Timer',
    rarity: 'rare'
  },
  // ─── ARMAS SECUNDÁRIAS AUTÔNOMAS (EVOLUÇÃO SUPREMA NO NÍVEL 5) ───
  {
    title: 'Chakram de Dados (Bumerangue)',
    description: 'Lança lâminas bumerangue que perfuram hordas e retornam ao herói. (Nv 5: Estrela da Morte Quântica)',
    effectType: 'weapon_boomerang',
    value: 1,
    maxLevel: 5,
    icon: 'Disc',
    rarity: 'epic'
  },
  {
    title: 'Torreta Sentinela Auto-Compiler',
    description: 'Implanta torretas automáticas na arena que metralham inimigos. (Nv 5: Canhão Railgun Orbital)',
    effectType: 'weapon_turret',
    value: 1,
    maxLevel: 5,
    icon: 'Cpu',
    rarity: 'epic'
  },
  {
    title: 'Reator de Plasma (Aura Solar)',
    description: 'Emite um anel térmico permanente ao redor do herói que queima inimigos próximos. (Nv 5: Supernova Solar)',
    effectType: 'weapon_fire_aura',
    value: 1,
    maxLevel: 5,
    icon: 'Sun',
    rarity: 'epic'
  },
  {
    title: 'Enxame de Micro-Mísseis',
    description: 'Dispara mísseis teleguiados que perseguem alvos automaticamente. (Nv 5: Enxame Valquíria Explosivo)',
    effectType: 'weapon_homing_missiles',
    value: 1,
    maxLevel: 5,
    icon: 'Rocket',
    rarity: 'epic'
  },
  // ─── UPGRADES EXCLUSIVOS POR CLASSE ───
  {
    title: 'Lâmina Sísmica (Guerreiro)',
    description: 'Golpes críticos e palavras finalizadas emitem uma onda sísmica em área.',
    effectType: 'class_warrior_quake',
    value: 1,
    maxLevel: 3,
    icon: 'Flame',
    rarity: 'epic',
    requiredClass: 'warrior'
  },
  {
    title: 'Vórtice de Aço (Guerreiro)',
    description: 'Aumenta o raio, duração (+0.65s) e dano da magia Ciclone.',
    effectType: 'class_warrior_spin',
    value: 1,
    maxLevel: 3,
    icon: 'Wind',
    rarity: 'epic',
    requiredClass: 'warrior'
  },
  {
    title: 'Disparo Multiflecha (Arqueiro)',
    description: 'Adiciona +2 flechas extras em cone a cada disparo básico do arco.',
    effectType: 'class_archer_multishot',
    value: 1,
    maxLevel: 3,
    icon: 'Crosshair',
    rarity: 'epic',
    requiredClass: 'archer'
  },
  {
    title: 'Ponta Explosiva (Arqueiro)',
    description: 'Flechas críticas explodem no impacto causando dano em área.',
    effectType: 'class_archer_explosive',
    value: 1,
    maxLevel: 3,
    icon: 'Flame',
    rarity: 'epic',
    requiredClass: 'archer'
  },
  {
    title: 'Supernova no Teleporte (Mago)',
    description: 'Usar o Teleporte (Espaço) detona uma explosão arcana na partida e na chegada.',
    effectType: 'class_mage_nova',
    value: 1,
    maxLevel: 3,
    icon: 'Sparkles',
    rarity: 'epic',
    requiredClass: 'mage'
  },
  {
    title: 'Condutor Elemental (Mago)',
    description: 'Seus orbes arcanos eletrocutam um inimigo próximo extra no impacto.',
    effectType: 'class_mage_conductor',
    value: 1,
    maxLevel: 3,
    icon: 'Zap',
    rarity: 'epic',
    requiredClass: 'mage'
  }
];

const SUPREME_EVOLUTION_TITLES: Partial<Record<UpgradeEffectType, { title: string; desc: string }>> = {
  weapon_boomerang: {
    title: '★ ESTRELA DA MORTE QUÂNTICA',
    desc: 'EVOLUÇÃO SUPREMA: Dispara 4 lâminas colossais em cruz que dilaceram a tela inteira com dano dobrado!'
  },
  weapon_turret: {
    title: '★ CANHÃO RAILGUN ORBITAL',
    desc: 'EVOLUÇÃO SUPREMA: Suas torretas disparam feixes de plasma hipervelozes com cadência extrema!'
  },
  weapon_fire_aura: {
    title: '★ SUPERNOVA SOLAR',
    desc: 'EVOLUÇÃO SUPREMA: Raio imenso de incineração que derrete hordas e aplica lentidão térmica!'
  },
  weapon_homing_missiles: {
    title: '★ ENXAME VALQUÍRIA',
    desc: 'EVOLUÇÃO SUPREMA: Salva massiva de 6 mísseis teleguiados que explodem em área no impacto!'
  }
};

export const ByteQuestUpgradeModal: React.FC<ByteQuestUpgradeModalProps> = ({
  currentLevel,
  rpgClass = 'warrior',
  upgradeLevels = {},
  onSelectUpgrade
}) => {
  // Filtra upgrades compatíveis com a classe e que ainda não atingiram o nível máximo
  const choices = useMemo(() => {
    const eligible = UPGRADE_POOL.filter((item) => {
      if (item.requiredClass && item.requiredClass !== rpgClass) return false;
      const currentLvl = upgradeLevels[item.effectType] || 0;
      return currentLvl < item.maxLevel;
    });
    const poolToUse = eligible.length >= 3 ? eligible : UPGRADE_POOL.filter((i) => !i.requiredClass || i.requiredClass === rpgClass);
    const shuffled = [...poolToUse].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map((item, idx) => {
      const nextLevel = (upgradeLevels[item.effectType] || 0) + 1;
      const supreme = nextLevel === 5 ? SUPREME_EVOLUTION_TITLES[item.effectType] : undefined;
      return {
        ...item,
        id: `upgrade_${item.effectType}_${idx}`,
        level: nextLevel,
        title: supreme ? supreme.title : item.title,
        description: supreme ? supreme.desc : item.description
      };
    });
  }, [rpgClass, upgradeLevels]);

  const getIcon = (effect: UpgradeEffectType) => {
    switch (effect) {
      case 'damage':
        return <Swords className="w-8 h-8 text-rose-400" />;
      case 'speed':
      case 'class_mage_conductor':
        return <Zap className="w-8 h-8 text-amber-400" />;
      case 'crit':
      case 'class_warrior_quake':
      case 'class_archer_explosive':
        return <Flame className="w-8 h-8 text-orange-400" />;
      case 'max_hp':
        return <Heart className="w-8 h-8 text-emerald-400" />;
      case 'shield':
        return <Shield className="w-8 h-8 text-sky-400" />;
      case 'orbitals':
        return <Orbit className="w-8 h-8 text-purple-400" />;
      case 'lightning':
      case 'class_mage_nova':
        return <Sparkles className="w-8 h-8 text-yellow-400" />;
      case 'magnet':
        return <Magnet className="w-8 h-8 text-blue-400" />;
      case 'typing_power':
        return <Swords className="w-8 h-8 text-cyan-400" />;
      case 'mobility_distance':
      case 'class_warrior_spin':
        return <Wind className="w-8 h-8 text-teal-400" />;
      case 'mobility_charges':
        return <FastForward className="w-8 h-8 text-cyan-400" />;
      case 'mobility_cooldown':
        return <Timer className="w-8 h-8 text-indigo-400" />;
      case 'class_archer_multishot':
        return <Crosshair className="w-8 h-8 text-emerald-400" />;
      case 'weapon_boomerang':
        return <Disc className="w-8 h-8 text-cyan-400" />;
      case 'weapon_turret':
        return <Cpu className="w-8 h-8 text-amber-400" />;
      case 'weapon_fire_aura':
        return <Sun className="w-8 h-8 text-orange-400" />;
      case 'weapon_homing_missiles':
        return <Rocket className="w-8 h-8 text-rose-400" />;
    }
  };

  // Atalhos de teclado para selecionar os cards com números 1, 2 e 3
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let selectedIndex = -1;
      if (e.key === '1' || e.code === 'Numpad1' || e.code === 'Digit1') selectedIndex = 0;
      else if (e.key === '2' || e.code === 'Numpad2' || e.code === 'Digit2') selectedIndex = 1;
      else if (e.key === '3' || e.code === 'Numpad3' || e.code === 'Digit3') selectedIndex = 2;

      if (selectedIndex !== -1 && choices[selectedIndex]) {
        e.preventDefault();
        e.stopPropagation();
        onSelectUpgrade(choices[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [choices, onSelectUpgrade]);

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
            Escolha uma melhoria clicando ou pressionando as teclas <span className="text-amber-400 font-bold">[1]</span>, <span className="text-amber-400 font-bold">[2]</span> ou <span className="text-amber-400 font-bold">[3]</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {choices.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => onSelectUpgrade(card)}
              className={`group relative flex flex-col items-center p-5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/90 border transition-all duration-150 text-center gap-3 shadow-lg hover:shadow-violet-950/50 hover:-translate-y-1 cursor-pointer ${
                card.requiredClass
                  ? 'border-amber-500/60 hover:border-amber-400'
                  : 'border-zinc-700/60 hover:border-violet-400'
              }`}
            >
              {/* Badge de Nível Real da Carta */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-zinc-950/90 border border-zinc-700 text-[10px] font-mono font-bold text-amber-300">
                Nível {card.level}/{card.maxLevel}
              </div>

              {/* Badge da tecla de atalho numérico */}
              <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-lg bg-zinc-950 border border-zinc-700 group-hover:border-violet-400 group-hover:bg-violet-950 text-zinc-300 group-hover:text-amber-300 flex items-center justify-center font-mono font-black text-xs shadow">
                {idx + 1}
              </div>

              <div className="p-3 mt-3 rounded-xl bg-zinc-950/80 border border-zinc-800 group-hover:scale-110 transition-transform">
                {getIcon(card.effectType)}
              </div>
              <div className="flex flex-col gap-1">
                {card.requiredClass && (
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400">
                    ★ Exclusivo de Classe
                  </span>
                )}
                <span className="font-mono text-sm font-bold text-zinc-100 group-hover:text-violet-300">
                  {card.title}
                </span>
                <span className="font-mono text-xs text-zinc-400 line-clamp-3">
                  {card.description}
                </span>
              </div>
              <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest mt-auto">
                Tecla [{idx + 1}] ou Clique
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
