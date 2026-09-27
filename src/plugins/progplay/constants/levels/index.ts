import { GameLanguageCard, GameLanguageId, GameLevel } from './types';
import { JAVASCRIPT_LEVELS } from './javascript';
import { PYTHON_LEVELS } from './python';
import { CSS_LEVELS } from './css';
import { HTML_LEVELS } from './html';
import { SQL_LEVELS } from './sql';

export * from './types';

export const GAME_LANGUAGES: GameLanguageCard[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    badge: 'JS',
    color: '#f7df1e',
    bgColor: 'rgba(247, 223, 30, 0.12)',
    borderColor: 'rgba(247, 223, 30, 0.4)',
    tag: 'Web & Interatividade',
    extension: '.js',
    description: 'Do enigma da porta até DOM, APIs assíncronas, eventos e carrinho de e-commerce real.',
    monacoLang: 'javascript',
    totalLevels: 120,
  },
  {
    id: 'python',
    name: 'Python',
    badge: 'PY',
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
    tag: 'Back-end & Servidores',
    extension: '.py',
    description: 'De variáveis booleanas até roteamento de rotas HTTP, validação de payloads e APIs REST.',
    monacoLang: 'python',
    totalLevels: 120,
  },
  {
    id: 'css',
    name: 'CSS3',
    badge: '#',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    tag: 'Design & Interfaces',
    extension: '.css',
    description: 'De cores e rotação até Flexbox Navbar, CSS Grid de produtos, responsividade e Glassmorphism.',
    monacoLang: 'css',
    totalLevels: 120,
  },
  {
    id: 'html',
    name: 'HTML5',
    badge: '</>',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: 'rgba(249, 115, 22, 0.4)',
    tag: 'Estrutura & Semântica',
    extension: '.html',
    description: 'De tags fundamentais até Landing Pages completas, formulários validados, tabelas e SEO.',
    monacoLang: 'html',
    totalLevels: 120,
  },
  {
    id: 'sql',
    name: 'SQL',
    badge: 'SQL',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    tag: 'Banco de Dados',
    extension: '.sql',
    description: 'De SELECT e UPDATE até criação de tabelas, INNER JOINs de clientes/pedidos e views de dashboards.',
    monacoLang: 'sql',
    totalLevels: 120,
  },
];

export const LEVELS_BY_LANGUAGE: Record<GameLanguageId, GameLevel[]> = {
  javascript: JAVASCRIPT_LEVELS,
  python: PYTHON_LEVELS,
  css: CSS_LEVELS,
  html: HTML_LEVELS,
  sql: SQL_LEVELS,
};
