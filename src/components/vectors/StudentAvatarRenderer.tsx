import React from 'react';
import {
  TuxVector,
  RobotVector,
  NinjaVector,
  GamerVector,
  LightningVector,
  CatCoderVector,
  FoxVector,
  RocketVector,
  WizardVector,
  LionTechVector,
  PixelAlienVector,
  CyberDragonVector,
  PandaVector,
  TigerVector,
  TRexVector,
  UnicornVector,
  DevGirlVector,
  TeacherVector,
  AvatarVectorProps
} from './avatars';

export interface CanonicalAvatarOption {
  id: string;
  name: string;
  legacyEmoji: string;
  Component: React.FC<AvatarVectorProps>;
}

export const CANONICAL_AVATAR_LIST: CanonicalAvatarOption[] = [
  { id: 'tux', name: 'Tux Linux', legacyEmoji: '🐧', Component: TuxVector },
  { id: 'robot', name: 'Robô Byte', legacyEmoji: '🤖', Component: RobotVector },
  { id: 'ninja', name: 'Ninja', legacyEmoji: '🥷', Component: NinjaVector },
  { id: 'gamer', name: 'Gamer Pro', legacyEmoji: '🎮', Component: GamerVector },
  { id: 'lightning', name: 'Raio Turbo', legacyEmoji: '⚡', Component: LightningVector },
  { id: 'cat', name: 'Gato Coder', legacyEmoji: '🐱', Component: CatCoderVector },
  { id: 'fox', name: 'Raposa', legacyEmoji: '🦊', Component: FoxVector },
  { id: 'rocket', name: 'Foguete', legacyEmoji: '🚀', Component: RocketVector },
  { id: 'wizard', name: 'Mago Geek', legacyEmoji: '🧙', Component: WizardVector },
  { id: 'lion', name: 'Leão Tech', legacyEmoji: '🦁', Component: LionTechVector },
  { id: 'pixel', name: 'Pixel Alien', legacyEmoji: '👾', Component: PixelAlienVector },
  { id: 'dragon', name: 'Dragão', legacyEmoji: '🐉', Component: CyberDragonVector },
  { id: 'panda', name: 'Panda', legacyEmoji: '🐼', Component: PandaVector },
  { id: 'tiger', name: 'Tigre', legacyEmoji: '🐯', Component: TigerVector },
  { id: 'trex', name: 'T-Rex', legacyEmoji: '🦖', Component: TRexVector },
  { id: 'unicorn', name: 'Unicórnio', legacyEmoji: '🦄', Component: UnicornVector },
  { id: 'devgirl', name: 'Dev Girl', legacyEmoji: '👩‍💻', Component: DevGirlVector },
  { id: 'teacher', name: 'Professor', legacyEmoji: '👨‍🏫', Component: TeacherVector },
];

// Mapa rápido por ID canônico e por Emoji legado
const AVATAR_MAP = new Map<string, React.FC<AvatarVectorProps>>();

CANONICAL_AVATAR_LIST.forEach((opt) => {
  AVATAR_MAP.set(opt.id.toLowerCase(), opt.Component);
  AVATAR_MAP.set(opt.legacyEmoji, opt.Component);
});

// Sinônimos e variações legadas adicionais
AVATAR_MAP.set('🧙‍♂️', WizardVector);
AVATAR_MAP.set('⚡️', LightningVector);
AVATAR_MAP.set('💻', RobotVector);
AVATAR_MAP.set('staff', TeacherVector);
AVATAR_MAP.set('professor', TeacherVector);

export interface StudentAvatarRendererProps {
  avatar?: string | null;
  className?: string;
  size?: number | string;
  title?: string;
}

/**
 * Renderizador central de avatares com suporte à nova arquitetura vetorial (Zero Emojis).
 * Fornece retrocompatibilidade perfeita para contas de alunos que ainda possuem emojis
 * salvos no banco de dados, convertendo-os em componentes SVG nativos de alta fidelidade.
 */
export const StudentAvatarRenderer: React.FC<StudentAvatarRendererProps> = ({
  avatar,
  className = "w-full h-full",
  size,
  title
}) => {
  const cleanKey = (avatar || '').trim();
  const lowerKey = cleanKey.toLowerCase();

  const MatchedComponent = AVATAR_MAP.get(cleanKey) || AVATAR_MAP.get(lowerKey) || TuxVector;

  return <MatchedComponent className={className} size={size} title={title || cleanKey || 'Avatar'} />;
};
