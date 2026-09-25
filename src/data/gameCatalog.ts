import { useState, useMemo } from 'react';
import { GameId } from '../types/gamePlugin';

export type CatalogGameId = GameId | 'time_attack' | 'dungeon' | string;

export type GameCategory = 'Oficiais' | 'Alunos' | 'Comunidade';
export type GameSubject = 
  | 'Educação Digital' 
  | 'Matemática' 
  | 'História' 
  | 'Geografia' 
  | 'Ciências' 
  | 'Português' 
  | 'Inglês' 
  | 'Outros';

export type GameGenre = 
  | 'Digitação' 
  | 'Quiz' 
  | 'Lógica' 
  | 'Arcade' 
  | 'RPG' 
  | 'Simulação' 
  | 'Outros';

export interface GameMetadata {
  id: CatalogGameId;
  title: string;
  description: string;
  author: string;
  category: GameCategory;
  subject: GameSubject;
  genre: GameGenre;
  coverGradient: string;
  borderColor: string;
  glowColor: string;
  badgeTag: string;
  icon: string;
  isNew?: boolean;
  status?: 'playable' | 'coming_soon' | 'beta';
  tags?: string[];
  releaseDate?: string;
}

export const INITIAL_GAME_CATALOG: GameMetadata[] = [
  {
    id: 'typeclicker',
    title: 'TypeClicker Classic',
    description: 'Modo original de digitação tática. Digite termos de programação, ganhe bytes, construa sua rig de mineração e suba até o nível 100.',
    author: 'Prof. Marcos Wrobel',
    category: 'Oficiais',
    subject: 'Educação Digital',
    genre: 'Digitação',
    coverGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    glowColor: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
    badgeTag: 'MODO PRINCIPAL',
    icon: 'Keyboard',
    status: 'playable',
    tags: ['Idle & Digitação', 'Hardware Shop', 'Conquistas', 'RPG']
  },
  {
    id: 'type_radar',
    title: 'Type: Radar',
    description: 'Defesa Cibernética & Roguelike de Digitação. Trave a mira nos mísseis digitando palavras, ative poderes /nuke e /freeze e escolha cartas entre ondas.',
    author: 'Prof. Marcos Wrobel',
    category: 'Oficiais',
    subject: 'Educação Digital',
    genre: 'Arcade',
    coverGradient: 'from-cyan-500/20 via-teal-500/10 to-transparent',
    borderColor: 'border-cyan-500/50 hover:border-cyan-400',
    glowColor: 'bg-cyan-500/10 group-hover:bg-cyan-500/20',
    badgeTag: 'NOVO STANDALONE',
    icon: 'Radar',
    isNew: true,
    status: 'playable',
    tags: ['Trava de Mira', 'Comandos /NUKE', 'Cartas Roguelike']
  },
  {
    id: 'time_attack',
    title: 'Sprint Time Attack',
    description: 'Teste seus limites de digitação pura contra o cronômetro. Escolha entre 30s, 60s ou 120s e conquiste o maior WPM da sua turma.',
    author: 'Prof. Marcos Wrobel',
    category: 'Oficiais',
    subject: 'Educação Digital',
    genre: 'Digitação',
    coverGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    glowColor: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    badgeTag: 'SPRINT RÁPIDO',
    icon: 'Timer',
    status: 'playable',
    tags: ['30s / 60s / 120s', 'WPM & Precisão', 'Medalhas']
  },
  {
    id: 'dungeon',
    title: 'Cyber Dungeon RPG',
    description: 'Avance pelos andares de uma masmorra cibernética enfrentando Bosses com sua classe RPG. Use itens, poções e derrote chefes a cada 10 andares.',
    author: 'Prof. Marcos Wrobel',
    category: 'Oficiais',
    subject: 'Educação Digital',
    genre: 'RPG',
    coverGradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
    borderColor: 'border-purple-500/40 hover:border-purple-400',
    glowColor: 'bg-purple-500/10 group-hover:bg-purple-500/20',
    badgeTag: 'PVE DUNGEON',
    icon: 'Swords',
    status: 'playable',
    tags: ['Classes RPG', 'Boss Fights', 'Loja do Andar']
  },
  {
    id: 'race',
    title: 'Corrida Sincronizada',
    description: 'Disputa de digitação em tempo real na sala de aula. Todos os alunos largam no mesmo instante ao comando do professor.',
    author: 'Prof. Marcos Wrobel',
    category: 'Oficiais',
    subject: 'Educação Digital',
    genre: 'Digitação',
    coverGradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    glowColor: 'bg-amber-500/10 group-hover:bg-amber-500/20',
    badgeTag: 'MODO SALA DE AULA',
    icon: 'Flag',
    status: 'playable',
    tags: ['Turma Toda', 'Pódio da Aula', 'Tempo Real']
  },
  {
    id: 'raid',
    title: 'Raid Coletiva da Sala',
    description: 'Batalha cooperativa contra chefão do sistema. Todos os alunos combinam seu dano de digitação para derrotar o invasor.',
    author: 'Prof. Marcos Wrobel',
    category: 'Oficiais',
    subject: 'Educação Digital',
    genre: 'RPG',
    coverGradient: 'from-rose-500/20 via-red-500/10 to-transparent',
    borderColor: 'border-rose-500/40 hover:border-rose-400',
    glowColor: 'bg-rose-500/10 group-hover:bg-rose-500/20',
    badgeTag: 'COOPERATIVO',
    icon: 'Swords',
    status: 'playable',
    tags: ['Dano Coletivo', 'Chefão', 'Recompensas']
  },
  {
    id: 'byte_logic',
    title: 'Byte Logic',
    description: 'Desvende enigmas lógicos, portas binárias (AND, OR, XOR, NOT) e circuitos digitais para restaurar a energia do mainframe.',
    author: 'Prof. Marcos Wrobel',
    category: 'Oficiais',
    subject: 'Educação Digital',
    genre: 'Lógica',
    coverGradient: 'from-indigo-500/20 via-blue-500/10 to-transparent',
    borderColor: 'border-indigo-500/40 hover:border-indigo-400',
    glowColor: 'bg-indigo-500/10 group-hover:bg-indigo-500/20',
    badgeTag: 'EM BREVE',
    icon: 'Cpu',
    isNew: true,
    status: 'coming_soon',
    tags: ['Portas Lógicas', 'Circuitos', 'Tabela Verdade']
  },
  {
    id: 'math_storm',
    title: 'Math Storm',
    description: 'Tempestade de cálculos matemáticos! Resolva equações, frações e desafios numéricos antes que a sobrecarga atinja 100%.',
    author: 'Prof. Marcos Wrobel',
    category: 'Oficiais',
    subject: 'Matemática',
    genre: 'Quiz',
    coverGradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    glowColor: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
    badgeTag: 'EM BREVE',
    icon: 'Calculator',
    isNew: true,
    status: 'coming_soon',
    tags: ['Cálculo Rápido', 'Multiplicadores', 'Equações']
  },
  {
    id: 'syntax_maze',
    title: 'Syntax Maze',
    description: 'Navegue por um labirinto onde cada porta exige corrigir um bug de sintaxe em linguagens como JavaScript, Python e HTML.',
    author: 'Prof. Marcos Wrobel',
    category: 'Oficiais',
    subject: 'Educação Digital',
    genre: 'RPG',
    coverGradient: 'from-rose-500/20 via-red-500/10 to-transparent',
    borderColor: 'border-rose-500/40 hover:border-rose-400',
    glowColor: 'bg-rose-500/10 group-hover:bg-rose-500/20',
    badgeTag: 'EM BREVE',
    icon: 'Code',
    isNew: true,
    status: 'coming_soon',
    tags: ['Debug', 'Python & JS', 'Monaco Editor']
  }
];

export function useGameCatalog() {
  const [catalog] = useState<GameMetadata[]>(INITIAL_GAME_CATALOG);

  const categories = useMemo(() => {
    return ['Todos', 'Oficiais', 'Alunos', 'Novidades'] as const;
  }, []);

  const subjects = useMemo(() => {
    const set = new Set<GameSubject>();
    catalog.forEach(g => set.add(g.subject));
    return ['Todas', ...Array.from(set)] as const;
  }, [catalog]);

  const genres = useMemo(() => {
    const set = new Set<GameGenre>();
    catalog.forEach(g => set.add(g.genre));
    return ['Todos', ...Array.from(set)] as const;
  }, [catalog]);

  return {
    catalog,
    categories,
    subjects,
    genres
  };
}
