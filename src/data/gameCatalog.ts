import { GameId } from '../types/gamePlugin';

export type GameCategory = 'Oficiais' | 'Alunos' | 'Comunidade';
export type GameSubject = 'Educação Digital' | 'Matemática' | 'História' | 'Geografia' | 'Ciências' | 'Português' | 'Inglês' | 'Outros';
export type GameGenre = 'Digitação' | 'Quiz' | 'Lógica' | 'Arcade' | 'RPG' | 'Simulação' | 'Outros';

export interface GameMetadata {
  id: GameId;
  title: string;
  description: string;
  author: string;
  category: GameCategory;
  subject: GameSubject;
  genre: GameGenre;
  coverGradient: string;
  icon: string;
  isNew?: boolean;
  releaseDate?: string;
}

export const INITIAL_GAME_CATALOG: GameMetadata[] = [
  {
    id: 'typeclicker',
    title: 'TypeClicker Classic',
    description: 'O modo original. Digite palavras, ganhe bytes e suba de nível.',
    author: 'Professor',
    category: 'Oficiais',
    subject: 'Educação Digital',
    genre: 'Digitação',
    coverGradient: 'from-emerald-500/20 to-teal-900/40',
    icon: 'Terminal',
  },
  {
    id: 'type_radar',
    title: 'Type: Radar',
    description: 'Defenda o núcleo contra ondas de vírus. Precisão é tudo.',
    author: 'Professor',
    category: 'Oficiais',
    subject: 'Educação Digital',
    genre: 'Arcade',
    coverGradient: 'from-cyan-500/20 to-blue-900/40',
    icon: 'Radar',
  }
];
