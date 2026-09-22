import { CurricularTrackConfig } from '../../types';

export const WEB_TRACK: CurricularTrackConfig = {
  id: 'web',
  name: 'Educação Digital (Programação Web)',
  discipline: 'Educação Digital',
  targetAudience: '1º e 2º Anos (EM)',
  icon: '🌐',
  badgeColor: 'sky',
  description: 'Desenvolvimento Web moderno: HTML5 semântico, estilização com CSS3 e interatividade com JavaScript.',
  categories: [
    {
      id: 'iniciante',
      name: 'Iniciante',
      badge: 'Nível 1',
      levelNumber: 1,
      bonusMultiplier: 1.0,
      bonusLabel: '1.0x (Padrão)',
      themeColor: 'emerald',
      description: 'Tags essenciais de 3 a 5 letras: HTML, CSS, atributos fundamentais e seletores primários.',
      words: [
        'html', 'css', 'tag', 'div', 'span', 'head', 'body', 'link', 'meta', 'img',
        'src', 'href', 'alt', 'form', 'input', 'main', 'nav', 'font', 'color', 'bold',
        'width', 'auto', 'flex', 'grid', 'root', 'item', 'text', 'size', 'line', 'card',
        'menu', 'page', 'site', 'view', 'icon', 'logo', 'path', 'code', 'data', 'base',
        'left', 'open', 'box', 'rows', 'cols', 'flow', 'self', 'wrap', 'none', 'sans',
        'pico', 'area', 'fill', 'drop', 'edit', 'host', 'port', 'json', 'post', 'load',
        'push', 'node', 'mode', 'type', 'true', 'even', 'calc', 'clip', 'dark', 'font'
      ]
    },
    {
      id: 'facil',
      name: 'Fácil',
      badge: 'Nível 2',
      levelNumber: 2,
      bonusMultiplier: 1.25,
      bonusLabel: '+25% Bônus (1.25x)',
      themeColor: 'sky',
      description: 'Estruturas CSS e elementos de página (5 a 7 letras): box model, botões, formulários e posicionamento.',
      words: [
        'script', 'style', 'header', 'footer', 'margin', 'border', 'padding', 'display',
        'block', 'inline', 'button', 'select', 'option', 'radius', 'shadow', 'cursor',
        'center', 'height', 'weight', 'column', 'target', 'action', 'method', 'hidden',
        'canvas', 'figure', 'strong', 'active', 'focus', 'hover', 'bottom', 'fixed',
        'static', 'zindex', 'opacity', 'filter', 'linear', 'solid', 'dashed', 'dotted',
        'family', 'letter', 'italic', 'normal', 'middle', 'hidden', 'smooth', 'scroll',
        'align', 'anchor', 'branch', 'client', 'commit', 'device', 'dialog', 'events',
        'filter', 'gap-px', 'iframe', 'import', 'insert', 'italic', 'layout', 'module',
        'native', 'number', 'output', 'params', 'parser', 'pixels', 'plugin', 'render',
        'resize', 'return', 'routes', 'server', 'source', 'status', 'string', 'switch'
      ]
    },
    {
      id: 'medio',
      name: 'Médio',
      badge: 'Nível 3',
      levelNumber: 3,
      bonusMultiplier: 1.5,
      bonusLabel: '+50% Bônus (1.5x)',
      themeColor: 'amber',
      description: 'Lógica em JavaScript e estilização avançada (6 a 9 letras): funções, arrays, eventos e manipulação de DOM.',
      words: [
        'function', 'objeto', 'string', 'number', 'return', 'console', 'prompt', 'alerta',
        'section', 'article', 'rounded', 'backdrop', 'elemento', 'atributo', 'seletor',
        'pseudo', 'flexbox', 'relative', 'absolute', 'overflow', 'position', 'content',
        'variável', 'constante', 'parâmetro', 'argumento', 'booleano', 'condição',
        'executar', 'declaração', 'operador', 'iteração', 'contador', 'validação',
        'cadastro', 'dinâmico', 'estilizado', 'transform', 'transição', 'animação',
        'intervalo', 'temporizador', 'recarregar', 'interface', 'semântica', 'acessível',
        'callback', 'classes', 'database', 'debugger', 'document', 'download', 'endpoint',
        'eventos', 'executor', 'feedback', 'frontend', 'gradient', 'listener', 'metadata',
        'mutation', 'pesquisa', 'protocol', 'registro', 'repositório', 'resolução', 'roteador',
        'seletores', 'sintaxe', 'terminal', 'viewport', 'visualizar', 'webdesign'
      ]
    },
    {
      id: 'avancado',
      name: 'Avançado',
      badge: 'Nível 4',
      levelNumber: 4,
      bonusMultiplier: 2.0,
      bonusLabel: '+100% Bônus (2.0x)',
      themeColor: 'purple',
      description: 'Termos de engenharia web (8 a 13 letras): manipulação do DOM, eventos assíncronos e responsividade.',
      words: [
        'javascript', 'responsivo', 'keyframes', 'localstorage', 'manipulação',
        'desestruturação', 'comutação', 'interatividade', 'acessibilidade',
        'sincronização', 'arquitetura', 'navegabilidade', 'estruturação',
        'programação', 'especificidade', 'encapsulamento', 'modularização',
        'componentes', 'renderização', 'compatibilidade', 'otimização',
        'produtividade', 'funcionalidade', 'visibilidade', 'alinhamento',
        'autenticação', 'carregamento', 'configuração', 'desenvolvimento',
        'dispositivos', 'documentação', 'especificação', 'flexibilidade',
        'gerenciamento', 'interoperável', 'microserviços', 'multiplataforma',
        'padronização', 'parametrização', 'persistência', 'processamento',
        'reutilização', 'segurança-web', 'sincronismo', 'transformação'
      ]
    },
    {
      id: 'expert',
      name: 'Expert',
      badge: 'Nível 5',
      levelNumber: 5,
      bonusMultiplier: 2.5,
      bonusLabel: '+150% Bônus (2.5x)',
      themeColor: 'rose',
      description: 'Arquitetura e ecossistema web moderno (11 a 18 letras): single-page apps, TypeScript e performance.',
      words: [
        'assincronicidade', 'componentização', 'retrocompatibilidade', 'interoperabilidade',
        'desenvolvimento-web', 'arquitetura-software', 'responsividade-telas',
        'otimização-performance', 'acessibilidade-digital', 'manipulação-documento',
        'gerenciamento-estado', 'programação-reativa', 'padronização-código',
        'segurança-aplicações', 'internacionalização', 'modularização-sistemas',
        'computação-distribuída', 'processamento-assíncrono', 'infraestrutura-nuvem',
        'interatividade-dinâmica', 'renderização-servidor', 'balanceamento-carga',
        'virtualização-componentes', 'refatoração-estrutural'
      ]
    }
  ]
};
