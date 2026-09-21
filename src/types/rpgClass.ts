export type RpgClassType = 'warrior' | 'archer' | 'mage';

export interface RpgClassConfig {
  id: RpgClassType;
  name: string;
  title: string;
  tagline: string;
  icon: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentColor: string;
  passives: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export const RPG_CLASSES: Record<RpgClassType, RpgClassConfig> = {
  warrior: {
    id: 'warrior',
    name: 'Guerreiro Veloz',
    title: 'Guerreiro do Teclado',
    tagline: 'Foco em alta velocidade (PPM) e dano de impacto motor',
    icon: '⚔️',
    badgeBg: 'bg-red-500/20',
    badgeBorder: 'border-red-500/50',
    badgeText: 'text-red-300',
    accentColor: 'text-red-400',
    passives: [
      {
        title: 'Ímpeto Motor',
        description: 'Ao digitar com velocidade acima de 55 PPM, ganha +25% de bytes por palavra e bônus de dano na Masmorra.',
        icon: '⚡'
      },
      {
        title: 'Fúria da Cadência',
        description: 'Cada palavra digitada em alta cadência desfere golpes críticos nos Chefes de Masmorra e Raids.',
        icon: '💥'
      }
    ]
  },
  archer: {
    id: 'archer',
    name: 'Arqueiro do Combo',
    title: 'Atirador de Precisão',
    tagline: 'Foco em ritmo inabalável, sequências sem erro e combos longos',
    icon: '🏹',
    badgeBg: 'bg-emerald-500/20',
    badgeBorder: 'border-emerald-500/50',
    badgeText: 'text-emerald-300',
    accentColor: 'text-emerald-400',
    passives: [
      {
        title: 'Concentração de Precisão',
        description: 'A cada 20 acertos seguidos sem errar nenhuma tecla, o multiplicador de bytes ganha +0.2x extra.',
        icon: '🎯'
      },
      {
        title: 'Rede de Segurança',
        description: 'Possui 50% de chance de perdoar o primeiro erro cometido, salvando a sequência de combo sem zerar.',
        icon: '🛡️'
      }
    ]
  },
  mage: {
    id: 'mage',
    name: 'Mago dos Bytes',
    title: 'Arcano Quântico',
    tagline: 'Foco em geração passiva, núcleos arcanos e escudos elementais',
    icon: '🧙',
    badgeBg: 'bg-purple-500/20',
    badgeBorder: 'border-purple-500/50',
    badgeText: 'text-purple-300',
    accentColor: 'text-purple-400',
    passives: [
      {
        title: 'Ressonância Quântica',
        description: '+25% de produção automática passiva de bytes por segundo (alimenta os upgrades de servidor).',
        icon: '🌌'
      },
      {
        title: 'Escudo Elemental',
        description: 'Ao digitar palavras com acentos ou fraquezas elementais na Masmorra, regenera o escudo arcano.',
        icon: '✨'
      }
    ]
  }
};
