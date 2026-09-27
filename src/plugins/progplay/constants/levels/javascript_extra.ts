import { GameLevel } from './types';

export const JAVASCRIPT_EXTRA_LEVELS: GameLevel[] = [
  {
    id: 21,
    title: "Fase 21: Array map()",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Use .map() para dobrar os preços dos produtos",
    puzzleDescription: "O método map() é essencial no JavaScript moderno para transformar coleções de dados sem alterar o array original. Neste desafio prático você irá dominar Array map() aplicando código profissional.",
    initialCode: `const precos = [10, 25, 40, 80];
// Use map para dobrar cada valor:
const precosDobrados = precos.map(p => p * 2);`,
    hints: ["O método map cria um novo array aplicando uma função a cada item.","Use precos.map(p => p * 2).","Verifique se precosDobrados contém os valores multiplicados."],
    expectedConditionText: "precos.map(p => p * 2)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array map()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array map()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /precos\.map\s*\(\s*(p|item|preco|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 21!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: precos.map(p => p * 2)',
      };
    },
  },
  {
    id: 22,
    title: "Fase 22: Array filter()",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Filtre apenas usuários ativos do sistema",
    puzzleDescription: "Com filter(), extraímos subconjuntos de registros para listagens, buscas e permissões de acesso. Neste desafio prático você irá dominar Array filter() aplicando código profissional.",
    initialCode: `const usuarios = [
  { nome: "Ana", ativo: true },
  { nome: "Beto", ativo: false },
  { nome: "Carla", ativo: true }
];
// Filtre apenas quem está ativo:
const ativos = usuarios.filter(u => u.ativo === true);`,
    hints: ["O filter recebe uma função que retorna verdadeiro ou falso.","Use usuarios.filter(u => u.ativo).","O resultado conterá apenas os objetos com ativo true."],
    expectedConditionText: "usuarios.filter(u => u.ativo)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array filter()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array filter()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /usuarios\.filter\s*\(\s*(u|user|usuario|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 22!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: usuarios.filter(u => u.ativo)',
      };
    },
  },
  {
    id: 23,
    title: "Fase 23: Array reduce() Totalizador",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Calcule o valor total do carrinho de compras com .reduce()",
    puzzleDescription: "O reduce é o coração do cálculo financeiro e agregação de dados em aplicações web. Neste desafio prático você irá dominar Array reduce() Totalizador aplicando código profissional.",
    initialCode: `const itens = [29.9, 49.9, 15.0, 99.0];
// Some todos os valores do carrinho:
const totalCarrinho = itens.reduce((acumulador, item) => acumulador + item, 0);`,
    hints: ["Reduce acumula valores iterando sobre a lista.","Passe 0 como valor inicial do acumulador.","Retorne acumulador + item."],
    expectedConditionText: "itens.reduce((acc, curr) => acc + curr, 0)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array reduce() Totalizador","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array reduce() Totalizador</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /itens\.reduce\s*\(\s*\([^)]*\)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 23!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: itens.reduce((acc, curr) => acc + curr, 0)',
      };
    },
  },
  {
    id: 24,
    title: "Fase 24: Array find() & findIndex()",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Localize o produto específico pelo ID com .find()",
    puzzleDescription: "Localizar objetos pontuais por identificador único é operação diária em interfaces de detalhes. Neste desafio prático você irá dominar Array find() & findIndex() aplicando código profissional.",
    initialCode: `const catalogo = [
  { id: 101, nome: "Teclado" },
  { id: 102, nome: "Mouse" },
  { id: 103, nome: "Monitor" }
];
// Encontre o produto de id 102:
const produtoBuscado = catalogo.find(p => p.id === 102);`,
    hints: ["find() retorna o primeiro elemento correspondente.","Compare p.id === 102.","Se não encontrar, retornará undefined."],
    expectedConditionText: "catalogo.find(p => p.id === 102)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array find() & findIndex()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array find() & findIndex()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /catalogo\.find\s*\(\s*(p|item|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 24!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: catalogo.find(p => p.id === 102)',
      };
    },
  },
  {
    id: 25,
    title: "Fase 25: Array some() e every()",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Valide se todos os campos obrigatórios estão preenchidos",
    puzzleDescription: "Validações pré-envio de formulários garantem que requisições ao servidor cheguem completas. Neste desafio prático você irá dominar Array some() e every() aplicando código profissional.",
    initialCode: `const campos = ["nome", "email", "senha"];
const form = { nome: "João", email: "j@email.com", senha: "123" };
// Verifique se todos os campos têm valor:
const todosPreenchidos = campos.every(c => Boolean(form[c]));`,
    hints: ["every() retorna true se todos os itens satisfizerem a condição.","Acesse form[c] para cada campo.","Garanta que a verificação retorne booleano."],
    expectedConditionText: "campos.every(c => Boolean(form[c]))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array some() e every()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array some() e every()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /campos\.every\s*\(\s*(c|campo|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 25!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: campos.every(c => Boolean(form[c]))',
      };
    },
  },
  {
    id: 26,
    title: "Fase 26: Array flatMap()",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Achate e transforme listas aninhadas com flatMap",
    puzzleDescription: "Processamento de listas aninhadas e categorização de posts/produtos. Neste desafio prático você irá dominar Array flatMap() aplicando código profissional.",
    initialCode: `const pedidos = [
  { tags: ["urgente", "web"] },
  { tags: ["frontend", "urgente"] }
];
// Extraia todas as tags em um único array:
const todasTags = pedidos.flatMap(p => p.tags);`,
    hints: ["flatMap mapeia e aplaina em profundidade 1.","Retorne p.tags no callback.","O resultado é um array simples com todas as tags."],
    expectedConditionText: "pedidos.flatMap(p => p.tags)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array flatMap()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array flatMap()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /pedidos\.flatMap\s*\(\s*(p|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 26!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: pedidos.flatMap(p => p.tags)',
      };
    },
  },
  {
    id: 27,
    title: "Fase 27: Desestruturação & Rest/Spread",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Clone e mescle objetos usando o operador Spread (...)",
    puzzleDescription: "Padrão moderno para gerenciamento de configurações e estados imutáveis. Neste desafio prático você irá dominar Desestruturação & Rest/Spread aplicando código profissional.",
    initialCode: `const configPadrao = { tema: "escuro", som: true };
const configUsuario = { som: false, zoom: 1.2 };
// Mescle as configurações com spread:
const configFinal = { ...configPadrao, ...configUsuario };`,
    hints: ["O operador ... espalha as propriedades de um objeto.","Propriedades posteriores sobrescrevem as anteriores.","Crie o objeto final combinando ambos."],
    expectedConditionText: "{ ...configPadrao, ...configUsuario }",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Desestruturação & Rest/Spread","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Desestruturação & Rest/Spread</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /\.\.\.configPadrao/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 27!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: { ...configPadrao, ...configUsuario }',
      };
    },
  },
  {
    id: 28,
    title: "Fase 28: Set para Valores Únicos",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Remova valores duplicados da lista usando new Set()",
    puzzleDescription: "Eliminação instantânea de redundâncias em arrays de alta performance. Neste desafio prático você irá dominar Set para Valores Únicos aplicando código profissional.",
    initialCode: `const tagsComDuplicatas = ["html", "css", "html", "js", "css"];
// Crie um array sem duplicatas usando Set:
const tagsUnicas = [...new Set(tagsComDuplicatas)];`,
    hints: ["A estrutura Set só armazena valores únicos.","Converta de volta para array usando [...new Set()].","Ótimo para filtros de tags e categorias."],
    expectedConditionText: "[...new Set(tagsComDuplicatas)]",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Set para Valores Únicos","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Set para Valores Únicos</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+Set\s*\(\s*tagsComDuplicatas\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 28!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: [...new Set(tagsComDuplicatas)]',
      };
    },
  },
  {
    id: 29,
    title: "Fase 29: Estrutura Map para Cache",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Armazene pares chave-valor no objeto Map()",
    puzzleDescription: "Cache em memória para evitar chamadas de rede repetitivas. Neste desafio prático você irá dominar Estrutura Map para Cache aplicando código profissional.",
    initialCode: `const cache = new Map();
// Salve a rota com set e recupere com get:
cache.set("usuario:1", { nome: "Lucas" });
const usuarioCached = cache.get("usuario:1");`,
    hints: ["Map permite chaves de qualquer tipo e mantém ordem de inserção.","Use cache.set(chave, valor).","Recupere com cache.get(chave)."],
    expectedConditionText: "cache.set(\"usuario:1\", ...) e cache.get(\"usuario:1\")",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Estrutura Map para Cache","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Estrutura Map para Cache</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /cache\.set\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 29!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: cache.set("usuario:1", ...) e cache.get("usuario:1")',
      };
    },
  },
  {
    id: 30,
    title: "Fase 30: Recursão: Fatorial & Busca",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função recursiva que calcula o fatorial de n",
    puzzleDescription: "Recursão é o alicerce para percorrer árvores DOM, estruturas de pastas e dados hierárquicos. Neste desafio prático você irá dominar Recursão: Fatorial & Busca aplicando código profissional.",
    initialCode: `function fatorial(n) {
  // Caso base: se n <= 1 retorne 1
  if (n <= 1) return 1;
  // Chamada recursiva:
  return n * fatorial(n - 1);
}`,
    hints: ["Toda função recursiva precisa de um caso base para não entrar em loop infinito.","Se n <= 1 retorne 1.","Retorne n * fatorial(n - 1)."],
    expectedConditionText: "fatorial(n) com caso base e n * fatorial(n - 1)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Recursão: Fatorial & Busca","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Recursão: Fatorial & Busca</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /return\s+n\s*\*\s*fatorial\s*\(\s*n\s*-\s*1\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 30!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: fatorial(n) com caso base e n * fatorial(n - 1)',
      };
    },
  },
  {
    id: 31,
    title: "Fase 31: Promises Básicas",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma Promise resolvida com dados de um usuário",
    puzzleDescription: "O padrão fundamental para lidar com operações assíncronas em JavaScript. Neste desafio prático você irá dominar Promises Básicas aplicando código profissional.",
    initialCode: `function buscarUsuario() {
  return new Promise((resolve) => {
    resolve({ id: 1, nome: "Dev ProgPlay" });
  });
}`,
    hints: ["Promises representam valores disponíveis no futuro.","Recebem uma função com resolve e reject.","Chame resolve com o dado retornado."],
    expectedConditionText: "new Promise((resolve) => resolve(...))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Promises Básicas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Promises Básicas</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+Promise\s*\(\s*\(\s*resolve/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 31!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: new Promise((resolve) => resolve(...))',
      };
    },
  },
  {
    id: 32,
    title: "Fase 32: Async / Await Moderno",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função async que aguarda a resolução dos dados",
    puzzleDescription: "Sintaxe limpa e sem callback hell para comunicação de rede. Neste desafio prático você irá dominar Async / Await Moderno aplicando código profissional.",
    initialCode: `async function carregarPerfil() {
  const dados = await buscarUsuario();
  return dados.nome;
}`,
    hints: ["A palavra async antes da função permite o uso de await.","Await pausa a execução da função até a Promise resolver.","Torna código assíncrono legível como síncrono."],
    expectedConditionText: "async function e await buscarUsuario()",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Async / Await Moderno","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Async / Await Moderno</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /async\s+function|const\s+dados\s*=\s*await/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 32!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: async function e await buscarUsuario()',
      };
    },
  },
  {
    id: 33,
    title: "Fase 33: Promise.all Concorrente",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Carregue múltiplos recursos em paralelo com Promise.all",
    puzzleDescription: "Otimização essencial de performance em telas com múltiplos dados (dashboards). Neste desafio prático você irá dominar Promise.all Concorrente aplicando código profissional.",
    initialCode: `async function carregarTudo() {
  // Execute as duas buscas em paralelo:
  const [posts, perfil] = await Promise.all([
    buscarPosts(),
    buscarUsuario()
  ]);
  return { posts, perfil };
}`,
    hints: ["Promise.all dispara todas as requisições simultaneamente.","Reduz drasticamente o tempo total de carregamento.","Retorna array com todas as respostas resolvidas."],
    expectedConditionText: "Promise.all([buscarPosts(), buscarUsuario()])",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Promise.all Concorrente","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Promise.all Concorrente</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /Promise\.all\s*\(\s*\[/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 33!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: Promise.all([buscarPosts(), buscarUsuario()])',
      };
    },
  },
  {
    id: 34,
    title: "Fase 34: Promise.race com Timeout",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie um timeout com Promise.race para evitar requisições infinitas",
    puzzleDescription: "Proteção contra lentidão de rede e timeouts controlados. Neste desafio prático você irá dominar Promise.race com Timeout aplicando código profissional.",
    initialCode: `function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject("Tempo esgotado"), ms));
}
// Corra a busca contra o timeout:
const resultado = Promise.race([buscarUsuario(), timeout(3000)]);`,
    hints: ["Promise.race resolve ou rejeita com a primeira Promise que terminar.","Útil para cancelar requisições lentas de internet instável.","Passe array de promessas."],
    expectedConditionText: "Promise.race([requisicao, timeout(3000)])",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Promise.race com Timeout","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Promise.race com Timeout</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /Promise\.race\s*\(\s*\[/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 34!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: Promise.race([requisicao, timeout(3000)])',
      };
    },
  },
  {
    id: 35,
    title: "Fase 35: Tratamento com Try / Catch / Finally",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Capture erros de rede e finalize o indicador de carregamento",
    puzzleDescription: "Mecanismo robusto para manter a consistência da UI durante falhas. Neste desafio prático você irá dominar Tratamento com Try / Catch / Finally aplicando código profissional.",
    initialCode: `let carregando = true;
try {
  const resp = await carregarDados();
} catch (erro) {
  console.error("Falha:", erro);
} finally {
  // Sempre executado para desligar o loader:
  carregando = false;
}`,
    hints: ["O bloco finally roda sempre, ocorrendo erro ou não.","Ideal para resetar spinners e fechar conexões.","Defina carregando = false no finally."],
    expectedConditionText: "finally { carregando = false; }",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Tratamento com Try / Catch / Finally","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Tratamento com Try / Catch / Finally</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /finally\s*\{\s*carregando\s*=\s*false;?\s*\}/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 35!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: finally { carregando = false; }',
      };
    },
  },
  {
    id: 36,
    title: "Fase 36: Padrão Singleton",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Garanta que exista apenas uma instância do gerenciador de sessão",
    puzzleDescription: "Usado em conexões de banco, gerenciadores de autenticação e logs globais. Neste desafio prático você irá dominar Padrão Singleton aplicando código profissional.",
    initialCode: `class GerenciadorSessao {
  static instancia = null;
  static getInstancia() {
    if (!this.instancia) {
      this.instancia = new GerenciadorSessao();
    }
    return this.instancia;
  }
}`,
    hints: ["Singleton restringe a criação da classe a um único objeto.","Armazene em static instancia.","Retorne a mesma instância em chamadas subsequentes."],
    expectedConditionText: "Singleton com static getInstancia()",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Padrão Singleton","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Padrão Singleton</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /getInstancia\s*\(\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 36!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: Singleton com static getInstancia()',
      };
    },
  },
  {
    id: 37,
    title: "Fase 37: Padrão Observer / PubSub",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie um sistema de eventos com subscribe e emit",
    puzzleDescription: "Arquitetura reativa base de bibliotecas modernas como Redux e Node EventEmitter. Neste desafio prático você irá dominar Padrão Observer / PubSub aplicando código profissional.",
    initialCode: `class EventEmitter {
  constructor() { this.eventos = {}; }
  on(evento, callback) {
    (this.eventos[evento] = this.eventos[evento] || []).push(callback);
  }
  emit(evento, dados) {
    (this.eventos[evento] || []).forEach(cb => cb(dados));
  }
}`,
    hints: ["O Observer desacopla componentes que precisam reagir a mudanças.","on() cadastra ouvintes.","emit() notifica todos os inscritos."],
    expectedConditionText: "EventEmitter com on(evento, cb) e emit(evento, dados)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Padrão Observer / PubSub","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Padrão Observer / PubSub</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /emit\s*\(\s*evento/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 37!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: EventEmitter com on(evento, cb) e emit(evento, dados)',
      };
    },
  },
  {
    id: 38,
    title: "Fase 38: Padrão Factory",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Construa uma fábrica para criar diferentes tipos de botões UI",
    puzzleDescription: "Design systems e criação flexível de componentes visuais. Neste desafio prático você irá dominar Padrão Factory aplicando código profissional.",
    initialCode: `class BotaoFactory {
  static criar(tipo, texto) {
    if (tipo === "perigo") return { classe: "btn-red", texto };
    return { classe: "btn-blue", texto };
  }
}`,
    hints: ["Factory encapsula a lógica de instanciação complexa.","Recebe parâmetros e decide qual objeto retornar.","Facilita expansão futura sem quebrar código chamador."],
    expectedConditionText: "BotaoFactory.criar(tipo, texto)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Padrão Factory","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Padrão Factory</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /static\s+criar\s*\(\s*tipo/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 38!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: BotaoFactory.criar(tipo, texto)',
      };
    },
  },
  {
    id: 39,
    title: "Fase 39: Padrão Strategy",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Calcule frete flexível com diferentes estratégias de entrega",
    puzzleDescription: "Elimina ifs aninhados gigantes e torna as regras de negócio modulares. Neste desafio prático você irá dominar Padrão Strategy aplicando código profissional.",
    initialCode: `const freteEstrategias = {
  economico: peso => peso * 5,
  expresso: peso => peso * 12 + 10,
};
function calcularFrete(tipo, peso) {
  return freteEstrategias[tipo](peso);
}`,
    hints: ["Strategy substitui múltiplos ifs por um mapa de algoritmos.","Adicionar nova forma de frete é só adicionar uma chave.","Invoque a estratégia selecionada passando o peso."],
    expectedConditionText: "freteEstrategias[tipo](peso)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Padrão Strategy","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Padrão Strategy</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /freteEstrategias\[tipo\]/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 39!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: freteEstrategias[tipo](peso)',
      };
    },
  },
  {
    id: 40,
    title: "Fase 40: Currying & Funções de Alta Ordem",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função curried para aplicar descontos pré-fixados",
    puzzleDescription: "Poderoso conceito funcional para criar funções pré-configuradas. Neste desafio prático você irá dominar Currying & Funções de Alta Ordem aplicando código profissional.",
    initialCode: `const criarDesconto = taxa => valor => valor - (valor * taxa);
// Crie um desconto fixo de 10% (0.10):
const desconto10 = criarDesconto(0.10);`,
    hints: ["Currying transforma uma função de vários argumentos em funções encadeadas.","criarDesconto(0.10) retorna uma nova função especialista.","Permite reutilização elegante de regras."],
    expectedConditionText: "const desconto10 = criarDesconto(0.10)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Currying & Funções de Alta Ordem","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Currying & Funções de Alta Ordem</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /criarDesconto\s*\(\s*0\.1/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 40!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: const desconto10 = criarDesconto(0.10)',
      };
    },
  },
  {
    id: 41,
    title: "Fase 41: Função Debounce",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Implemente debounce para limitar chamadas de busca no campo de pesquisa",
    puzzleDescription: "Economiza centenas de requisições desnecessárias a servidores em inputs de busca. Neste desafio prático você irá dominar Função Debounce aplicando código profissional.",
    initialCode: `function debounce(funcao, delay) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => funcao(...args), delay);
  };
}`,
    hints: ["Debounce aguarda o usuário parar de digitar para disparar a ação.","Cancela o timeout anterior com clearTimeout.","Dispara apenas após o delay especificado."],
    expectedConditionText: "debounce com clearTimeout e setTimeout",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função Debounce","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função Debounce</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /clearTimeout\s*\(\s*temporizador\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 41!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: debounce com clearTimeout e setTimeout',
      };
    },
  },
  {
    id: 42,
    title: "Fase 42: Função Throttle",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Implemente throttle para limitar eventos de scroll a cada X milissegundos",
    puzzleDescription: "Mantém 60fps constantes mesmo em eventos contínuos pesados. Neste desafio prático você irá dominar Função Throttle aplicando código profissional.",
    initialCode: `function throttle(fn, limite) {
  let aguardando = false;
  return (...args) => {
    if (!aguardando) {
      fn(...args);
      aguardando = true;
      setTimeout(() => aguardando = false, limite);
    }
  };
}`,
    hints: ["Throttle garante que a função execute no máximo uma vez no intervalo.","Excelente para barras de progresso de scroll e redimensionamento.","A variável aguardando controla a permissão."],
    expectedConditionText: "throttle com trava de tempo",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função Throttle","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função Throttle</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /aguardando\s*=\s*true/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 42!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: throttle com trava de tempo',
      };
    },
  },
  {
    id: 43,
    title: "Fase 43: Memoization / Cache de Função",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Armazene resultados de cálculos caros para retorno instantâneo",
    puzzleDescription: "Acelera processamento de dados e renderização de dashboards. Neste desafio prático você irá dominar Memoization / Cache de Função aplicando código profissional.",
    initialCode: `function memoize(fn) {
  const cache = {};
  return arg => {
    if (arg in cache) return cache[arg];
    return (cache[arg] = fn(arg));
  };
}`,
    hints: ["Memoization salva os retornos indexados pelos parâmetros.","Se o cálculo com aquele número já foi feito, responde em 0ms.","Guarda no objeto cache."],
    expectedConditionText: "memoize checando arg in cache",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Memoization / Cache de Função","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Memoization / Cache de Função</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /if\s*\(\s*arg\s+in\s+cache\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 43!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: memoize checando arg in cache',
      };
    },
  },
  {
    id: 44,
    title: "Fase 44: Intersection Observer",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie observador para lazy loading de imagens ao entrar na viewport",
    puzzleDescription: "Pilar do Core Web Vitals e carregamento ultra-rápido de páginas. Neste desafio prático você irá dominar Intersection Observer aplicando código profissional.",
    initialCode: `const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (e.isIntersecting) {
      e.target.src = e.target.dataset.src;
      observador.unobserve(e.target);
    }
  });
});`,
    hints: ["IntersectionObserver monitora visibilidade de elementos na tela.","isIntersecting avisa quando o elemento apareceu no scroll.","Carrega a imagem real apenas quando necessário."],
    expectedConditionText: "new IntersectionObserver com isIntersecting",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Intersection Observer","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Intersection Observer</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+IntersectionObserver/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 44!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: new IntersectionObserver com isIntersecting',
      };
    },
  },
  {
    id: 45,
    title: "Fase 45: AbortController para Cancelamento",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Cancele requisições obsoletas quando o usuário trocar de aba",
    puzzleDescription: "Prevenção de respostas desatualizadas sobrescrevendo a tela. Neste desafio prático você irá dominar AbortController para Cancelamento aplicando código profissional.",
    initialCode: `const controlador = new AbortController();
// Passe o signal na chamada fetch:
fetch("/api/dados", { signal: controlador.signal });
// Cancele a requisição:
controlador.abort();`,
    hints: ["AbortController permite interromper fetches em andamento.","Evita race conditions quando o usuário clica rápido em filtros.","Chame abort() para cancelar."],
    expectedConditionText: "controlador.abort()",
    previewType: "site-component",
    previewMeta: {"componentTitle":"AbortController para Cancelamento","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">AbortController para Cancelamento</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /controlador\.abort\s*\(\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 45!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: controlador.abort()',
      };
    },
  },
  {
    id: 46,
    title: "Fase 46: Web Storage API (localStorage)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Persista o token de autenticação de forma segura",
    puzzleDescription: "Manutenção de sessões e preferências de usuários offline. Neste desafio prático você irá dominar Web Storage API (localStorage) aplicando código profissional.",
    initialCode: `function salvarToken(token) {
  localStorage.setItem("authToken", token);
}
function obterToken() {
  return localStorage.getItem("authToken");
}`,
    hints: ["localStorage armazena pares texto entre recarregamentos.","Use setItem(chave, valor).","Recupere com getItem(chave)."],
    expectedConditionText: "localStorage.setItem e getItem",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Storage API (localStorage)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Storage API (localStorage)</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /localStorage\.setItem\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 46!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: localStorage.setItem e getItem',
      };
    },
  },
  {
    id: 47,
    title: "Fase 47: Web Workers para Multi-threading",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Envie cálculo pesado para segundo plano sem travar a interface",
    puzzleDescription: "Processamento de áudio, vídeo, criptografia e IA no navegador. Neste desafio prático você irá dominar Web Workers para Multi-threading aplicando código profissional.",
    initialCode: `const worker = new Worker("worker.js");
// Envie os dados para o worker processar:
worker.postMessage({ dados: [1, 2, 3] });
worker.onmessage = (e) => console.log("Resultado:", e.data);`,
    hints: ["Workers rodam em threads separadas sem congelar a UI.","Comunique via postMessage.","Escute respostas no evento onmessage."],
    expectedConditionText: "worker.postMessage({ dados: ... })",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Workers para Multi-threading","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Workers para Multi-threading</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /worker\.postMessage/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 47!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: worker.postMessage({ dados: ... })',
      };
    },
  },
  {
    id: 48,
    title: "Fase 48: WebSocket em Tempo Real",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Conecte a um canal WebSocket bidirecional para chat ao vivo",
    puzzleDescription: "Comunicação full-duplex de baixa latência em milissegundos. Neste desafio prático você irá dominar WebSocket em Tempo Real aplicando código profissional.",
    initialCode: `const socket = new WebSocket("wss://chat.progplay.dev");
socket.onopen = () => {
  socket.send(JSON.stringify({ tipo: "entrar", sala: "geral" }));
};`,
    hints: ["WebSockets mantêm conexão TCP aberta e instantânea.","Ideal para jogos multiplayer e chats.","Envie mensagens com socket.send()."],
    expectedConditionText: "new WebSocket com socket.send",
    previewType: "site-component",
    previewMeta: {"componentTitle":"WebSocket em Tempo Real","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">WebSocket em Tempo Real</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+WebSocket/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 48!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: new WebSocket com socket.send',
      };
    },
  },
  {
    id: 49,
    title: "Fase 49: Validador de Schemas JSON",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie função de validação de payload com regras de campos",
    puzzleDescription: "Camada de proteção de integridade de dados e contratos de APIs. Neste desafio prático você irá dominar Validador de Schemas JSON aplicando código profissional.",
    initialCode: `function validarPayload(dados, schema) {
  for (const campo of Object.keys(schema)) {
    if (schema[campo].obrigatorio && !(campo in dados)) return false;
  }
  return true;
}`,
    hints: ["Percorra os campos do schema.","Verifique se campos obrigatórios estão ausentes.","Retorne booleano indicando validade."],
    expectedConditionText: "validação iterando chaves do schema",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Validador de Schemas JSON","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Validador de Schemas JSON</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /for\s*\(\s*const\s+campo\s+of\s+Object\.keys/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 49!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: validação iterando chaves do schema',
      };
    },
  },
  {
    id: 50,
    title: "Fase 50: Proxy Reativo (Mini Vue/MobX)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie um objeto reativo usando Proxy que escuta mutações",
    puzzleDescription: "Como frameworks modernos detectam mudanças de estado e re-renderizam a tela. Neste desafio prático você irá dominar Proxy Reativo (Mini Vue/MobX) aplicando código profissional.",
    initialCode: `function criarReativo(alvo, aoMudar) {
  return new Proxy(alvo, {
    set(obj, prop, valor) {
      obj[prop] = valor;
      aoMudar(prop, valor);
      return true;
    }
  });
}`,
    hints: ["Proxy intercepta operações fundamentais de objetos.","O trap set é acionado toda vez que uma propriedade é alterada.","Dispara automaticamente o callback aoMudar."],
    expectedConditionText: "new Proxy(alvo, { set(...) })",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Proxy Reativo (Mini Vue/MobX)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Proxy Reativo (Mini Vue/MobX)</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+Proxy\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 50!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: new Proxy(alvo, { set(...) })',
      };
    },
  },
  {
    id: 51,
    title: "Fase 51: Array map() (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Use .map() para dobrar os preços dos produtos com rigor de produção",
    puzzleDescription: "O método map() é essencial no JavaScript moderno para transformar coleções de dados sem alterar o array original. Neste desafio prático você irá dominar Array map() aplicando código profissional.",
    initialCode: `const precos = [10, 25, 40, 80];
// Use map para dobrar cada valor:
const precosDobrados = precos.map(p => p * 2);`,
    hints: ["O método map cria um novo array aplicando uma função a cada item.","Use precos.map(p => p * 2).","Verifique se precosDobrados contém os valores multiplicados."],
    expectedConditionText: "precos.map(p => p * 2)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array map()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array map()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /precos\.map\s*\(\s*(p|item|preco|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 51!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: precos.map(p => p * 2)',
      };
    },
  },
  {
    id: 52,
    title: "Fase 52: Array filter() (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Filtre apenas usuários ativos do sistema com rigor de produção",
    puzzleDescription: "Com filter(), extraímos subconjuntos de registros para listagens, buscas e permissões de acesso. Neste desafio prático você irá dominar Array filter() aplicando código profissional.",
    initialCode: `const usuarios = [
  { nome: "Ana", ativo: true },
  { nome: "Beto", ativo: false },
  { nome: "Carla", ativo: true }
];
// Filtre apenas quem está ativo:
const ativos = usuarios.filter(u => u.ativo === true);`,
    hints: ["O filter recebe uma função que retorna verdadeiro ou falso.","Use usuarios.filter(u => u.ativo).","O resultado conterá apenas os objetos com ativo true."],
    expectedConditionText: "usuarios.filter(u => u.ativo)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array filter()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array filter()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /usuarios\.filter\s*\(\s*(u|user|usuario|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 52!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: usuarios.filter(u => u.ativo)',
      };
    },
  },
  {
    id: 53,
    title: "Fase 53: Array reduce() Totalizador (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Calcule o valor total do carrinho de compras com .reduce() com rigor de produção",
    puzzleDescription: "O reduce é o coração do cálculo financeiro e agregação de dados em aplicações web. Neste desafio prático você irá dominar Array reduce() Totalizador aplicando código profissional.",
    initialCode: `const itens = [29.9, 49.9, 15.0, 99.0];
// Some todos os valores do carrinho:
const totalCarrinho = itens.reduce((acumulador, item) => acumulador + item, 0);`,
    hints: ["Reduce acumula valores iterando sobre a lista.","Passe 0 como valor inicial do acumulador.","Retorne acumulador + item."],
    expectedConditionText: "itens.reduce((acc, curr) => acc + curr, 0)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array reduce() Totalizador","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array reduce() Totalizador</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /itens\.reduce\s*\(\s*\([^)]*\)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 53!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: itens.reduce((acc, curr) => acc + curr, 0)',
      };
    },
  },
  {
    id: 54,
    title: "Fase 54: Array find() & findIndex() (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Localize o produto específico pelo ID com .find() com rigor de produção",
    puzzleDescription: "Localizar objetos pontuais por identificador único é operação diária em interfaces de detalhes. Neste desafio prático você irá dominar Array find() & findIndex() aplicando código profissional.",
    initialCode: `const catalogo = [
  { id: 101, nome: "Teclado" },
  { id: 102, nome: "Mouse" },
  { id: 103, nome: "Monitor" }
];
// Encontre o produto de id 102:
const produtoBuscado = catalogo.find(p => p.id === 102);`,
    hints: ["find() retorna o primeiro elemento correspondente.","Compare p.id === 102.","Se não encontrar, retornará undefined."],
    expectedConditionText: "catalogo.find(p => p.id === 102)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array find() & findIndex()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array find() & findIndex()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /catalogo\.find\s*\(\s*(p|item|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 54!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: catalogo.find(p => p.id === 102)',
      };
    },
  },
  {
    id: 55,
    title: "Fase 55: Array some() e every() (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Valide se todos os campos obrigatórios estão preenchidos com rigor de produção",
    puzzleDescription: "Validações pré-envio de formulários garantem que requisições ao servidor cheguem completas. Neste desafio prático você irá dominar Array some() e every() aplicando código profissional.",
    initialCode: `const campos = ["nome", "email", "senha"];
const form = { nome: "João", email: "j@email.com", senha: "123" };
// Verifique se todos os campos têm valor:
const todosPreenchidos = campos.every(c => Boolean(form[c]));`,
    hints: ["every() retorna true se todos os itens satisfizerem a condição.","Acesse form[c] para cada campo.","Garanta que a verificação retorne booleano."],
    expectedConditionText: "campos.every(c => Boolean(form[c]))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array some() e every()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array some() e every()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /campos\.every\s*\(\s*(c|campo|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 55!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: campos.every(c => Boolean(form[c]))',
      };
    },
  },
  {
    id: 56,
    title: "Fase 56: Array flatMap() (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Achate e transforme listas aninhadas com flatMap com rigor de produção",
    puzzleDescription: "Processamento de listas aninhadas e categorização de posts/produtos. Neste desafio prático você irá dominar Array flatMap() aplicando código profissional.",
    initialCode: `const pedidos = [
  { tags: ["urgente", "web"] },
  { tags: ["frontend", "urgente"] }
];
// Extraia todas as tags em um único array:
const todasTags = pedidos.flatMap(p => p.tags);`,
    hints: ["flatMap mapeia e aplaina em profundidade 1.","Retorne p.tags no callback.","O resultado é um array simples com todas as tags."],
    expectedConditionText: "pedidos.flatMap(p => p.tags)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array flatMap()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array flatMap()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /pedidos\.flatMap\s*\(\s*(p|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 56!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: pedidos.flatMap(p => p.tags)',
      };
    },
  },
  {
    id: 57,
    title: "Fase 57: Desestruturação & Rest/Spread (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Clone e mescle objetos usando o operador Spread (...) com rigor de produção",
    puzzleDescription: "Padrão moderno para gerenciamento de configurações e estados imutáveis. Neste desafio prático você irá dominar Desestruturação & Rest/Spread aplicando código profissional.",
    initialCode: `const configPadrao = { tema: "escuro", som: true };
const configUsuario = { som: false, zoom: 1.2 };
// Mescle as configurações com spread:
const configFinal = { ...configPadrao, ...configUsuario };`,
    hints: ["O operador ... espalha as propriedades de um objeto.","Propriedades posteriores sobrescrevem as anteriores.","Crie o objeto final combinando ambos."],
    expectedConditionText: "{ ...configPadrao, ...configUsuario }",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Desestruturação & Rest/Spread","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Desestruturação & Rest/Spread</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /\.\.\.configPadrao/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 57!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: { ...configPadrao, ...configUsuario }',
      };
    },
  },
  {
    id: 58,
    title: "Fase 58: Set para Valores Únicos (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Remova valores duplicados da lista usando new Set() com rigor de produção",
    puzzleDescription: "Eliminação instantânea de redundâncias em arrays de alta performance. Neste desafio prático você irá dominar Set para Valores Únicos aplicando código profissional.",
    initialCode: `const tagsComDuplicatas = ["html", "css", "html", "js", "css"];
// Crie um array sem duplicatas usando Set:
const tagsUnicas = [...new Set(tagsComDuplicatas)];`,
    hints: ["A estrutura Set só armazena valores únicos.","Converta de volta para array usando [...new Set()].","Ótimo para filtros de tags e categorias."],
    expectedConditionText: "[...new Set(tagsComDuplicatas)]",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Set para Valores Únicos","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Set para Valores Únicos</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+Set\s*\(\s*tagsComDuplicatas\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 58!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: [...new Set(tagsComDuplicatas)]',
      };
    },
  },
  {
    id: 59,
    title: "Fase 59: Estrutura Map para Cache (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Armazene pares chave-valor no objeto Map() com rigor de produção",
    puzzleDescription: "Cache em memória para evitar chamadas de rede repetitivas. Neste desafio prático você irá dominar Estrutura Map para Cache aplicando código profissional.",
    initialCode: `const cache = new Map();
// Salve a rota com set e recupere com get:
cache.set("usuario:1", { nome: "Lucas" });
const usuarioCached = cache.get("usuario:1");`,
    hints: ["Map permite chaves de qualquer tipo e mantém ordem de inserção.","Use cache.set(chave, valor).","Recupere com cache.get(chave)."],
    expectedConditionText: "cache.set(\"usuario:1\", ...) e cache.get(\"usuario:1\")",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Estrutura Map para Cache","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Estrutura Map para Cache</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /cache\.set\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 59!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: cache.set("usuario:1", ...) e cache.get("usuario:1")',
      };
    },
  },
  {
    id: 60,
    title: "Fase 60: Recursão: Fatorial & Busca (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função recursiva que calcula o fatorial de n com rigor de produção",
    puzzleDescription: "Recursão é o alicerce para percorrer árvores DOM, estruturas de pastas e dados hierárquicos. Neste desafio prático você irá dominar Recursão: Fatorial & Busca aplicando código profissional.",
    initialCode: `function fatorial(n) {
  // Caso base: se n <= 1 retorne 1
  if (n <= 1) return 1;
  // Chamada recursiva:
  return n * fatorial(n - 1);
}`,
    hints: ["Toda função recursiva precisa de um caso base para não entrar em loop infinito.","Se n <= 1 retorne 1.","Retorne n * fatorial(n - 1)."],
    expectedConditionText: "fatorial(n) com caso base e n * fatorial(n - 1)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Recursão: Fatorial & Busca","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Recursão: Fatorial & Busca</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /return\s+n\s*\*\s*fatorial\s*\(\s*n\s*-\s*1\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 60!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: fatorial(n) com caso base e n * fatorial(n - 1)',
      };
    },
  },
  {
    id: 61,
    title: "Fase 61: Promises Básicas (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma Promise resolvida com dados de um usuário com rigor de produção",
    puzzleDescription: "O padrão fundamental para lidar com operações assíncronas em JavaScript. Neste desafio prático você irá dominar Promises Básicas aplicando código profissional.",
    initialCode: `function buscarUsuario() {
  return new Promise((resolve) => {
    resolve({ id: 1, nome: "Dev ProgPlay" });
  });
}`,
    hints: ["Promises representam valores disponíveis no futuro.","Recebem uma função com resolve e reject.","Chame resolve com o dado retornado."],
    expectedConditionText: "new Promise((resolve) => resolve(...))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Promises Básicas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Promises Básicas</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+Promise\s*\(\s*\(\s*resolve/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 61!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: new Promise((resolve) => resolve(...))',
      };
    },
  },
  {
    id: 62,
    title: "Fase 62: Async / Await Moderno (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função async que aguarda a resolução dos dados com rigor de produção",
    puzzleDescription: "Sintaxe limpa e sem callback hell para comunicação de rede. Neste desafio prático você irá dominar Async / Await Moderno aplicando código profissional.",
    initialCode: `async function carregarPerfil() {
  const dados = await buscarUsuario();
  return dados.nome;
}`,
    hints: ["A palavra async antes da função permite o uso de await.","Await pausa a execução da função até a Promise resolver.","Torna código assíncrono legível como síncrono."],
    expectedConditionText: "async function e await buscarUsuario()",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Async / Await Moderno","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Async / Await Moderno</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /async\s+function|const\s+dados\s*=\s*await/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 62!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: async function e await buscarUsuario()',
      };
    },
  },
  {
    id: 63,
    title: "Fase 63: Promise.all Concorrente (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Carregue múltiplos recursos em paralelo com Promise.all com rigor de produção",
    puzzleDescription: "Otimização essencial de performance em telas com múltiplos dados (dashboards). Neste desafio prático você irá dominar Promise.all Concorrente aplicando código profissional.",
    initialCode: `async function carregarTudo() {
  // Execute as duas buscas em paralelo:
  const [posts, perfil] = await Promise.all([
    buscarPosts(),
    buscarUsuario()
  ]);
  return { posts, perfil };
}`,
    hints: ["Promise.all dispara todas as requisições simultaneamente.","Reduz drasticamente o tempo total de carregamento.","Retorna array com todas as respostas resolvidas."],
    expectedConditionText: "Promise.all([buscarPosts(), buscarUsuario()])",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Promise.all Concorrente","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Promise.all Concorrente</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /Promise\.all\s*\(\s*\[/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 63!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: Promise.all([buscarPosts(), buscarUsuario()])',
      };
    },
  },
  {
    id: 64,
    title: "Fase 64: Promise.race com Timeout (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie um timeout com Promise.race para evitar requisições infinitas com rigor de produção",
    puzzleDescription: "Proteção contra lentidão de rede e timeouts controlados. Neste desafio prático você irá dominar Promise.race com Timeout aplicando código profissional.",
    initialCode: `function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject("Tempo esgotado"), ms));
}
// Corra a busca contra o timeout:
const resultado = Promise.race([buscarUsuario(), timeout(3000)]);`,
    hints: ["Promise.race resolve ou rejeita com a primeira Promise que terminar.","Útil para cancelar requisições lentas de internet instável.","Passe array de promessas."],
    expectedConditionText: "Promise.race([requisicao, timeout(3000)])",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Promise.race com Timeout","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Promise.race com Timeout</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /Promise\.race\s*\(\s*\[/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 64!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: Promise.race([requisicao, timeout(3000)])',
      };
    },
  },
  {
    id: 65,
    title: "Fase 65: Tratamento com Try / Catch / Finally (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Capture erros de rede e finalize o indicador de carregamento com rigor de produção",
    puzzleDescription: "Mecanismo robusto para manter a consistência da UI durante falhas. Neste desafio prático você irá dominar Tratamento com Try / Catch / Finally aplicando código profissional.",
    initialCode: `let carregando = true;
try {
  const resp = await carregarDados();
} catch (erro) {
  console.error("Falha:", erro);
} finally {
  // Sempre executado para desligar o loader:
  carregando = false;
}`,
    hints: ["O bloco finally roda sempre, ocorrendo erro ou não.","Ideal para resetar spinners e fechar conexões.","Defina carregando = false no finally."],
    expectedConditionText: "finally { carregando = false; }",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Tratamento com Try / Catch / Finally","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Tratamento com Try / Catch / Finally</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /finally\s*\{\s*carregando\s*=\s*false;?\s*\}/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 65!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: finally { carregando = false; }',
      };
    },
  },
  {
    id: 66,
    title: "Fase 66: Padrão Singleton (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Garanta que exista apenas uma instância do gerenciador de sessão com rigor de produção",
    puzzleDescription: "Usado em conexões de banco, gerenciadores de autenticação e logs globais. Neste desafio prático você irá dominar Padrão Singleton aplicando código profissional.",
    initialCode: `class GerenciadorSessao {
  static instancia = null;
  static getInstancia() {
    if (!this.instancia) {
      this.instancia = new GerenciadorSessao();
    }
    return this.instancia;
  }
}`,
    hints: ["Singleton restringe a criação da classe a um único objeto.","Armazene em static instancia.","Retorne a mesma instância em chamadas subsequentes."],
    expectedConditionText: "Singleton com static getInstancia()",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Padrão Singleton","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Padrão Singleton</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /getInstancia\s*\(\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 66!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: Singleton com static getInstancia()',
      };
    },
  },
  {
    id: 67,
    title: "Fase 67: Padrão Observer / PubSub (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie um sistema de eventos com subscribe e emit com rigor de produção",
    puzzleDescription: "Arquitetura reativa base de bibliotecas modernas como Redux e Node EventEmitter. Neste desafio prático você irá dominar Padrão Observer / PubSub aplicando código profissional.",
    initialCode: `class EventEmitter {
  constructor() { this.eventos = {}; }
  on(evento, callback) {
    (this.eventos[evento] = this.eventos[evento] || []).push(callback);
  }
  emit(evento, dados) {
    (this.eventos[evento] || []).forEach(cb => cb(dados));
  }
}`,
    hints: ["O Observer desacopla componentes que precisam reagir a mudanças.","on() cadastra ouvintes.","emit() notifica todos os inscritos."],
    expectedConditionText: "EventEmitter com on(evento, cb) e emit(evento, dados)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Padrão Observer / PubSub","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Padrão Observer / PubSub</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /emit\s*\(\s*evento/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 67!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: EventEmitter com on(evento, cb) e emit(evento, dados)',
      };
    },
  },
  {
    id: 68,
    title: "Fase 68: Padrão Factory (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Construa uma fábrica para criar diferentes tipos de botões UI com rigor de produção",
    puzzleDescription: "Design systems e criação flexível de componentes visuais. Neste desafio prático você irá dominar Padrão Factory aplicando código profissional.",
    initialCode: `class BotaoFactory {
  static criar(tipo, texto) {
    if (tipo === "perigo") return { classe: "btn-red", texto };
    return { classe: "btn-blue", texto };
  }
}`,
    hints: ["Factory encapsula a lógica de instanciação complexa.","Recebe parâmetros e decide qual objeto retornar.","Facilita expansão futura sem quebrar código chamador."],
    expectedConditionText: "BotaoFactory.criar(tipo, texto)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Padrão Factory","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Padrão Factory</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /static\s+criar\s*\(\s*tipo/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 68!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: BotaoFactory.criar(tipo, texto)',
      };
    },
  },
  {
    id: 69,
    title: "Fase 69: Padrão Strategy (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Calcule frete flexível com diferentes estratégias de entrega com rigor de produção",
    puzzleDescription: "Elimina ifs aninhados gigantes e torna as regras de negócio modulares. Neste desafio prático você irá dominar Padrão Strategy aplicando código profissional.",
    initialCode: `const freteEstrategias = {
  economico: peso => peso * 5,
  expresso: peso => peso * 12 + 10,
};
function calcularFrete(tipo, peso) {
  return freteEstrategias[tipo](peso);
}`,
    hints: ["Strategy substitui múltiplos ifs por um mapa de algoritmos.","Adicionar nova forma de frete é só adicionar uma chave.","Invoque a estratégia selecionada passando o peso."],
    expectedConditionText: "freteEstrategias[tipo](peso)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Padrão Strategy","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Padrão Strategy</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /freteEstrategias\[tipo\]/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 69!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: freteEstrategias[tipo](peso)',
      };
    },
  },
  {
    id: 70,
    title: "Fase 70: Currying & Funções de Alta Ordem (Nível Avançado 2)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função curried para aplicar descontos pré-fixados com rigor de produção",
    puzzleDescription: "Poderoso conceito funcional para criar funções pré-configuradas. Neste desafio prático você irá dominar Currying & Funções de Alta Ordem aplicando código profissional.",
    initialCode: `const criarDesconto = taxa => valor => valor - (valor * taxa);
// Crie um desconto fixo de 10% (0.10):
const desconto10 = criarDesconto(0.10);`,
    hints: ["Currying transforma uma função de vários argumentos em funções encadeadas.","criarDesconto(0.10) retorna uma nova função especialista.","Permite reutilização elegante de regras."],
    expectedConditionText: "const desconto10 = criarDesconto(0.10)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Currying & Funções de Alta Ordem","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Currying & Funções de Alta Ordem</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /criarDesconto\s*\(\s*0\.1/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 70!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: const desconto10 = criarDesconto(0.10)',
      };
    },
  },
  {
    id: 71,
    title: "Fase 71: Função Debounce (Nível Avançado 2)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Implemente debounce para limitar chamadas de busca no campo de pesquisa com rigor de produção",
    puzzleDescription: "Economiza centenas de requisições desnecessárias a servidores em inputs de busca. Neste desafio prático você irá dominar Função Debounce aplicando código profissional.",
    initialCode: `function debounce(funcao, delay) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => funcao(...args), delay);
  };
}`,
    hints: ["Debounce aguarda o usuário parar de digitar para disparar a ação.","Cancela o timeout anterior com clearTimeout.","Dispara apenas após o delay especificado."],
    expectedConditionText: "debounce com clearTimeout e setTimeout",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função Debounce","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função Debounce</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /clearTimeout\s*\(\s*temporizador\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 71!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: debounce com clearTimeout e setTimeout',
      };
    },
  },
  {
    id: 72,
    title: "Fase 72: Função Throttle (Nível Avançado 2)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Implemente throttle para limitar eventos de scroll a cada X milissegundos com rigor de produção",
    puzzleDescription: "Mantém 60fps constantes mesmo em eventos contínuos pesados. Neste desafio prático você irá dominar Função Throttle aplicando código profissional.",
    initialCode: `function throttle(fn, limite) {
  let aguardando = false;
  return (...args) => {
    if (!aguardando) {
      fn(...args);
      aguardando = true;
      setTimeout(() => aguardando = false, limite);
    }
  };
}`,
    hints: ["Throttle garante que a função execute no máximo uma vez no intervalo.","Excelente para barras de progresso de scroll e redimensionamento.","A variável aguardando controla a permissão."],
    expectedConditionText: "throttle com trava de tempo",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função Throttle","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função Throttle</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /aguardando\s*=\s*true/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 72!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: throttle com trava de tempo',
      };
    },
  },
  {
    id: 73,
    title: "Fase 73: Memoization / Cache de Função (Nível Avançado 2)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Armazene resultados de cálculos caros para retorno instantâneo com rigor de produção",
    puzzleDescription: "Acelera processamento de dados e renderização de dashboards. Neste desafio prático você irá dominar Memoization / Cache de Função aplicando código profissional.",
    initialCode: `function memoize(fn) {
  const cache = {};
  return arg => {
    if (arg in cache) return cache[arg];
    return (cache[arg] = fn(arg));
  };
}`,
    hints: ["Memoization salva os retornos indexados pelos parâmetros.","Se o cálculo com aquele número já foi feito, responde em 0ms.","Guarda no objeto cache."],
    expectedConditionText: "memoize checando arg in cache",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Memoization / Cache de Função","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Memoization / Cache de Função</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /if\s*\(\s*arg\s+in\s+cache\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 73!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: memoize checando arg in cache',
      };
    },
  },
  {
    id: 74,
    title: "Fase 74: Intersection Observer (Nível Avançado 2)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie observador para lazy loading de imagens ao entrar na viewport com rigor de produção",
    puzzleDescription: "Pilar do Core Web Vitals e carregamento ultra-rápido de páginas. Neste desafio prático você irá dominar Intersection Observer aplicando código profissional.",
    initialCode: `const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (e.isIntersecting) {
      e.target.src = e.target.dataset.src;
      observador.unobserve(e.target);
    }
  });
});`,
    hints: ["IntersectionObserver monitora visibilidade de elementos na tela.","isIntersecting avisa quando o elemento apareceu no scroll.","Carrega a imagem real apenas quando necessário."],
    expectedConditionText: "new IntersectionObserver com isIntersecting",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Intersection Observer","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Intersection Observer</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+IntersectionObserver/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 74!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: new IntersectionObserver com isIntersecting',
      };
    },
  },
  {
    id: 75,
    title: "Fase 75: AbortController para Cancelamento (Nível Avançado 2)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Cancele requisições obsoletas quando o usuário trocar de aba com rigor de produção",
    puzzleDescription: "Prevenção de respostas desatualizadas sobrescrevendo a tela. Neste desafio prático você irá dominar AbortController para Cancelamento aplicando código profissional.",
    initialCode: `const controlador = new AbortController();
// Passe o signal na chamada fetch:
fetch("/api/dados", { signal: controlador.signal });
// Cancele a requisição:
controlador.abort();`,
    hints: ["AbortController permite interromper fetches em andamento.","Evita race conditions quando o usuário clica rápido em filtros.","Chame abort() para cancelar."],
    expectedConditionText: "controlador.abort()",
    previewType: "site-component",
    previewMeta: {"componentTitle":"AbortController para Cancelamento","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">AbortController para Cancelamento</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /controlador\.abort\s*\(\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 75!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: controlador.abort()',
      };
    },
  },
  {
    id: 76,
    title: "Fase 76: Web Storage API (localStorage) (Nível Avançado 2)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Persista o token de autenticação de forma segura com rigor de produção",
    puzzleDescription: "Manutenção de sessões e preferências de usuários offline. Neste desafio prático você irá dominar Web Storage API (localStorage) aplicando código profissional.",
    initialCode: `function salvarToken(token) {
  localStorage.setItem("authToken", token);
}
function obterToken() {
  return localStorage.getItem("authToken");
}`,
    hints: ["localStorage armazena pares texto entre recarregamentos.","Use setItem(chave, valor).","Recupere com getItem(chave)."],
    expectedConditionText: "localStorage.setItem e getItem",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Storage API (localStorage)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Storage API (localStorage)</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /localStorage\.setItem\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 76!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: localStorage.setItem e getItem',
      };
    },
  },
  {
    id: 77,
    title: "Fase 77: Web Workers para Multi-threading (Nível Avançado 2)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Envie cálculo pesado para segundo plano sem travar a interface com rigor de produção",
    puzzleDescription: "Processamento de áudio, vídeo, criptografia e IA no navegador. Neste desafio prático você irá dominar Web Workers para Multi-threading aplicando código profissional.",
    initialCode: `const worker = new Worker("worker.js");
// Envie os dados para o worker processar:
worker.postMessage({ dados: [1, 2, 3] });
worker.onmessage = (e) => console.log("Resultado:", e.data);`,
    hints: ["Workers rodam em threads separadas sem congelar a UI.","Comunique via postMessage.","Escute respostas no evento onmessage."],
    expectedConditionText: "worker.postMessage({ dados: ... })",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Workers para Multi-threading","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Workers para Multi-threading</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /worker\.postMessage/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 77!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: worker.postMessage({ dados: ... })',
      };
    },
  },
  {
    id: 78,
    title: "Fase 78: WebSocket em Tempo Real (Nível Avançado 2)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Conecte a um canal WebSocket bidirecional para chat ao vivo com rigor de produção",
    puzzleDescription: "Comunicação full-duplex de baixa latência em milissegundos. Neste desafio prático você irá dominar WebSocket em Tempo Real aplicando código profissional.",
    initialCode: `const socket = new WebSocket("wss://chat.progplay.dev");
socket.onopen = () => {
  socket.send(JSON.stringify({ tipo: "entrar", sala: "geral" }));
};`,
    hints: ["WebSockets mantêm conexão TCP aberta e instantânea.","Ideal para jogos multiplayer e chats.","Envie mensagens com socket.send()."],
    expectedConditionText: "new WebSocket com socket.send",
    previewType: "site-component",
    previewMeta: {"componentTitle":"WebSocket em Tempo Real","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">WebSocket em Tempo Real</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+WebSocket/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 78!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: new WebSocket com socket.send',
      };
    },
  },
  {
    id: 79,
    title: "Fase 79: Validador de Schemas JSON (Nível Avançado 2)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie função de validação de payload com regras de campos com rigor de produção",
    puzzleDescription: "Camada de proteção de integridade de dados e contratos de APIs. Neste desafio prático você irá dominar Validador de Schemas JSON aplicando código profissional.",
    initialCode: `function validarPayload(dados, schema) {
  for (const campo of Object.keys(schema)) {
    if (schema[campo].obrigatorio && !(campo in dados)) return false;
  }
  return true;
}`,
    hints: ["Percorra os campos do schema.","Verifique se campos obrigatórios estão ausentes.","Retorne booleano indicando validade."],
    expectedConditionText: "validação iterando chaves do schema",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Validador de Schemas JSON","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Validador de Schemas JSON</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /for\s*\(\s*const\s+campo\s+of\s+Object\.keys/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 79!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: validação iterando chaves do schema',
      };
    },
  },
  {
    id: 80,
    title: "Fase 80: Proxy Reativo (Mini Vue/MobX) (Nível Avançado 2)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie um objeto reativo usando Proxy que escuta mutações com rigor de produção",
    puzzleDescription: "Como frameworks modernos detectam mudanças de estado e re-renderizam a tela. Neste desafio prático você irá dominar Proxy Reativo (Mini Vue/MobX) aplicando código profissional.",
    initialCode: `function criarReativo(alvo, aoMudar) {
  return new Proxy(alvo, {
    set(obj, prop, valor) {
      obj[prop] = valor;
      aoMudar(prop, valor);
      return true;
    }
  });
}`,
    hints: ["Proxy intercepta operações fundamentais de objetos.","O trap set é acionado toda vez que uma propriedade é alterada.","Dispara automaticamente o callback aoMudar."],
    expectedConditionText: "new Proxy(alvo, { set(...) })",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Proxy Reativo (Mini Vue/MobX)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Proxy Reativo (Mini Vue/MobX)</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+Proxy\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 80!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: new Proxy(alvo, { set(...) })',
      };
    },
  },
  {
    id: 81,
    title: "Fase 81: Array map() (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Use .map() para dobrar os preços dos produtos com rigor de produção",
    puzzleDescription: "O método map() é essencial no JavaScript moderno para transformar coleções de dados sem alterar o array original. Neste desafio prático você irá dominar Array map() aplicando código profissional.",
    initialCode: `const precos = [10, 25, 40, 80];
// Use map para dobrar cada valor:
const precosDobrados = precos.map(p => p * 2);`,
    hints: ["O método map cria um novo array aplicando uma função a cada item.","Use precos.map(p => p * 2).","Verifique se precosDobrados contém os valores multiplicados."],
    expectedConditionText: "precos.map(p => p * 2)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array map()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array map()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /precos\.map\s*\(\s*(p|item|preco|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 81!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: precos.map(p => p * 2)',
      };
    },
  },
  {
    id: 82,
    title: "Fase 82: Array filter() (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Filtre apenas usuários ativos do sistema com rigor de produção",
    puzzleDescription: "Com filter(), extraímos subconjuntos de registros para listagens, buscas e permissões de acesso. Neste desafio prático você irá dominar Array filter() aplicando código profissional.",
    initialCode: `const usuarios = [
  { nome: "Ana", ativo: true },
  { nome: "Beto", ativo: false },
  { nome: "Carla", ativo: true }
];
// Filtre apenas quem está ativo:
const ativos = usuarios.filter(u => u.ativo === true);`,
    hints: ["O filter recebe uma função que retorna verdadeiro ou falso.","Use usuarios.filter(u => u.ativo).","O resultado conterá apenas os objetos com ativo true."],
    expectedConditionText: "usuarios.filter(u => u.ativo)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array filter()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array filter()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /usuarios\.filter\s*\(\s*(u|user|usuario|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 82!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: usuarios.filter(u => u.ativo)',
      };
    },
  },
  {
    id: 83,
    title: "Fase 83: Array reduce() Totalizador (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Calcule o valor total do carrinho de compras com .reduce() com rigor de produção",
    puzzleDescription: "O reduce é o coração do cálculo financeiro e agregação de dados em aplicações web. Neste desafio prático você irá dominar Array reduce() Totalizador aplicando código profissional.",
    initialCode: `const itens = [29.9, 49.9, 15.0, 99.0];
// Some todos os valores do carrinho:
const totalCarrinho = itens.reduce((acumulador, item) => acumulador + item, 0);`,
    hints: ["Reduce acumula valores iterando sobre a lista.","Passe 0 como valor inicial do acumulador.","Retorne acumulador + item."],
    expectedConditionText: "itens.reduce((acc, curr) => acc + curr, 0)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array reduce() Totalizador","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array reduce() Totalizador</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /itens\.reduce\s*\(\s*\([^)]*\)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 83!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: itens.reduce((acc, curr) => acc + curr, 0)',
      };
    },
  },
  {
    id: 84,
    title: "Fase 84: Array find() & findIndex() (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Localize o produto específico pelo ID com .find() com rigor de produção",
    puzzleDescription: "Localizar objetos pontuais por identificador único é operação diária em interfaces de detalhes. Neste desafio prático você irá dominar Array find() & findIndex() aplicando código profissional.",
    initialCode: `const catalogo = [
  { id: 101, nome: "Teclado" },
  { id: 102, nome: "Mouse" },
  { id: 103, nome: "Monitor" }
];
// Encontre o produto de id 102:
const produtoBuscado = catalogo.find(p => p.id === 102);`,
    hints: ["find() retorna o primeiro elemento correspondente.","Compare p.id === 102.","Se não encontrar, retornará undefined."],
    expectedConditionText: "catalogo.find(p => p.id === 102)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array find() & findIndex()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array find() & findIndex()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /catalogo\.find\s*\(\s*(p|item|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 84!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: catalogo.find(p => p.id === 102)',
      };
    },
  },
  {
    id: 85,
    title: "Fase 85: Array some() e every() (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Valide se todos os campos obrigatórios estão preenchidos com rigor de produção",
    puzzleDescription: "Validações pré-envio de formulários garantem que requisições ao servidor cheguem completas. Neste desafio prático você irá dominar Array some() e every() aplicando código profissional.",
    initialCode: `const campos = ["nome", "email", "senha"];
const form = { nome: "João", email: "j@email.com", senha: "123" };
// Verifique se todos os campos têm valor:
const todosPreenchidos = campos.every(c => Boolean(form[c]));`,
    hints: ["every() retorna true se todos os itens satisfizerem a condição.","Acesse form[c] para cada campo.","Garanta que a verificação retorne booleano."],
    expectedConditionText: "campos.every(c => Boolean(form[c]))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array some() e every()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array some() e every()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /campos\.every\s*\(\s*(c|campo|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 85!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: campos.every(c => Boolean(form[c]))',
      };
    },
  },
  {
    id: 86,
    title: "Fase 86: Array flatMap() (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Achate e transforme listas aninhadas com flatMap com rigor de produção",
    puzzleDescription: "Processamento de listas aninhadas e categorização de posts/produtos. Neste desafio prático você irá dominar Array flatMap() aplicando código profissional.",
    initialCode: `const pedidos = [
  { tags: ["urgente", "web"] },
  { tags: ["frontend", "urgente"] }
];
// Extraia todas as tags em um único array:
const todasTags = pedidos.flatMap(p => p.tags);`,
    hints: ["flatMap mapeia e aplaina em profundidade 1.","Retorne p.tags no callback.","O resultado é um array simples com todas as tags."],
    expectedConditionText: "pedidos.flatMap(p => p.tags)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array flatMap()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array flatMap()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /pedidos\.flatMap\s*\(\s*(p|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 86!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: pedidos.flatMap(p => p.tags)',
      };
    },
  },
  {
    id: 87,
    title: "Fase 87: Desestruturação & Rest/Spread (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Clone e mescle objetos usando o operador Spread (...) com rigor de produção",
    puzzleDescription: "Padrão moderno para gerenciamento de configurações e estados imutáveis. Neste desafio prático você irá dominar Desestruturação & Rest/Spread aplicando código profissional.",
    initialCode: `const configPadrao = { tema: "escuro", som: true };
const configUsuario = { som: false, zoom: 1.2 };
// Mescle as configurações com spread:
const configFinal = { ...configPadrao, ...configUsuario };`,
    hints: ["O operador ... espalha as propriedades de um objeto.","Propriedades posteriores sobrescrevem as anteriores.","Crie o objeto final combinando ambos."],
    expectedConditionText: "{ ...configPadrao, ...configUsuario }",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Desestruturação & Rest/Spread","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Desestruturação & Rest/Spread</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /\.\.\.configPadrao/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 87!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: { ...configPadrao, ...configUsuario }',
      };
    },
  },
  {
    id: 88,
    title: "Fase 88: Set para Valores Únicos (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Remova valores duplicados da lista usando new Set() com rigor de produção",
    puzzleDescription: "Eliminação instantânea de redundâncias em arrays de alta performance. Neste desafio prático você irá dominar Set para Valores Únicos aplicando código profissional.",
    initialCode: `const tagsComDuplicatas = ["html", "css", "html", "js", "css"];
// Crie um array sem duplicatas usando Set:
const tagsUnicas = [...new Set(tagsComDuplicatas)];`,
    hints: ["A estrutura Set só armazena valores únicos.","Converta de volta para array usando [...new Set()].","Ótimo para filtros de tags e categorias."],
    expectedConditionText: "[...new Set(tagsComDuplicatas)]",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Set para Valores Únicos","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Set para Valores Únicos</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+Set\s*\(\s*tagsComDuplicatas\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 88!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: [...new Set(tagsComDuplicatas)]',
      };
    },
  },
  {
    id: 89,
    title: "Fase 89: Estrutura Map para Cache (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Armazene pares chave-valor no objeto Map() com rigor de produção",
    puzzleDescription: "Cache em memória para evitar chamadas de rede repetitivas. Neste desafio prático você irá dominar Estrutura Map para Cache aplicando código profissional.",
    initialCode: `const cache = new Map();
// Salve a rota com set e recupere com get:
cache.set("usuario:1", { nome: "Lucas" });
const usuarioCached = cache.get("usuario:1");`,
    hints: ["Map permite chaves de qualquer tipo e mantém ordem de inserção.","Use cache.set(chave, valor).","Recupere com cache.get(chave)."],
    expectedConditionText: "cache.set(\"usuario:1\", ...) e cache.get(\"usuario:1\")",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Estrutura Map para Cache","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Estrutura Map para Cache</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /cache\.set\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 89!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: cache.set("usuario:1", ...) e cache.get("usuario:1")',
      };
    },
  },
  {
    id: 90,
    title: "Fase 90: Recursão: Fatorial & Busca (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função recursiva que calcula o fatorial de n com rigor de produção",
    puzzleDescription: "Recursão é o alicerce para percorrer árvores DOM, estruturas de pastas e dados hierárquicos. Neste desafio prático você irá dominar Recursão: Fatorial & Busca aplicando código profissional.",
    initialCode: `function fatorial(n) {
  // Caso base: se n <= 1 retorne 1
  if (n <= 1) return 1;
  // Chamada recursiva:
  return n * fatorial(n - 1);
}`,
    hints: ["Toda função recursiva precisa de um caso base para não entrar em loop infinito.","Se n <= 1 retorne 1.","Retorne n * fatorial(n - 1)."],
    expectedConditionText: "fatorial(n) com caso base e n * fatorial(n - 1)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Recursão: Fatorial & Busca","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Recursão: Fatorial & Busca</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /return\s+n\s*\*\s*fatorial\s*\(\s*n\s*-\s*1\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 90!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: fatorial(n) com caso base e n * fatorial(n - 1)',
      };
    },
  },
  {
    id: 91,
    title: "Fase 91: Promises Básicas (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma Promise resolvida com dados de um usuário com rigor de produção",
    puzzleDescription: "O padrão fundamental para lidar com operações assíncronas em JavaScript. Neste desafio prático você irá dominar Promises Básicas aplicando código profissional.",
    initialCode: `function buscarUsuario() {
  return new Promise((resolve) => {
    resolve({ id: 1, nome: "Dev ProgPlay" });
  });
}`,
    hints: ["Promises representam valores disponíveis no futuro.","Recebem uma função com resolve e reject.","Chame resolve com o dado retornado."],
    expectedConditionText: "new Promise((resolve) => resolve(...))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Promises Básicas","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Promises Básicas</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+Promise\s*\(\s*\(\s*resolve/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 91!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: new Promise((resolve) => resolve(...))',
      };
    },
  },
  {
    id: 92,
    title: "Fase 92: Async / Await Moderno (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função async que aguarda a resolução dos dados com rigor de produção",
    puzzleDescription: "Sintaxe limpa e sem callback hell para comunicação de rede. Neste desafio prático você irá dominar Async / Await Moderno aplicando código profissional.",
    initialCode: `async function carregarPerfil() {
  const dados = await buscarUsuario();
  return dados.nome;
}`,
    hints: ["A palavra async antes da função permite o uso de await.","Await pausa a execução da função até a Promise resolver.","Torna código assíncrono legível como síncrono."],
    expectedConditionText: "async function e await buscarUsuario()",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Async / Await Moderno","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Async / Await Moderno</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /async\s+function|const\s+dados\s*=\s*await/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 92!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: async function e await buscarUsuario()',
      };
    },
  },
  {
    id: 93,
    title: "Fase 93: Promise.all Concorrente (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Carregue múltiplos recursos em paralelo com Promise.all com rigor de produção",
    puzzleDescription: "Otimização essencial de performance em telas com múltiplos dados (dashboards). Neste desafio prático você irá dominar Promise.all Concorrente aplicando código profissional.",
    initialCode: `async function carregarTudo() {
  // Execute as duas buscas em paralelo:
  const [posts, perfil] = await Promise.all([
    buscarPosts(),
    buscarUsuario()
  ]);
  return { posts, perfil };
}`,
    hints: ["Promise.all dispara todas as requisições simultaneamente.","Reduz drasticamente o tempo total de carregamento.","Retorna array com todas as respostas resolvidas."],
    expectedConditionText: "Promise.all([buscarPosts(), buscarUsuario()])",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Promise.all Concorrente","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Promise.all Concorrente</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /Promise\.all\s*\(\s*\[/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 93!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: Promise.all([buscarPosts(), buscarUsuario()])',
      };
    },
  },
  {
    id: 94,
    title: "Fase 94: Promise.race com Timeout (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie um timeout com Promise.race para evitar requisições infinitas com rigor de produção",
    puzzleDescription: "Proteção contra lentidão de rede e timeouts controlados. Neste desafio prático você irá dominar Promise.race com Timeout aplicando código profissional.",
    initialCode: `function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject("Tempo esgotado"), ms));
}
// Corra a busca contra o timeout:
const resultado = Promise.race([buscarUsuario(), timeout(3000)]);`,
    hints: ["Promise.race resolve ou rejeita com a primeira Promise que terminar.","Útil para cancelar requisições lentas de internet instável.","Passe array de promessas."],
    expectedConditionText: "Promise.race([requisicao, timeout(3000)])",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Promise.race com Timeout","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Promise.race com Timeout</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /Promise\.race\s*\(\s*\[/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 94!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: Promise.race([requisicao, timeout(3000)])',
      };
    },
  },
  {
    id: 95,
    title: "Fase 95: Tratamento com Try / Catch / Finally (Nível Avançado 3)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Capture erros de rede e finalize o indicador de carregamento com rigor de produção",
    puzzleDescription: "Mecanismo robusto para manter a consistência da UI durante falhas. Neste desafio prático você irá dominar Tratamento com Try / Catch / Finally aplicando código profissional.",
    initialCode: `let carregando = true;
try {
  const resp = await carregarDados();
} catch (erro) {
  console.error("Falha:", erro);
} finally {
  // Sempre executado para desligar o loader:
  carregando = false;
}`,
    hints: ["O bloco finally roda sempre, ocorrendo erro ou não.","Ideal para resetar spinners e fechar conexões.","Defina carregando = false no finally."],
    expectedConditionText: "finally { carregando = false; }",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Tratamento com Try / Catch / Finally","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Tratamento com Try / Catch / Finally</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /finally\s*\{\s*carregando\s*=\s*false;?\s*\}/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 95!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: finally { carregando = false; }',
      };
    },
  },
  {
    id: 96,
    title: "Fase 96: Padrão Singleton (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Garanta que exista apenas uma instância do gerenciador de sessão com rigor de produção",
    puzzleDescription: "Usado em conexões de banco, gerenciadores de autenticação e logs globais. Neste desafio prático você irá dominar Padrão Singleton aplicando código profissional.",
    initialCode: `class GerenciadorSessao {
  static instancia = null;
  static getInstancia() {
    if (!this.instancia) {
      this.instancia = new GerenciadorSessao();
    }
    return this.instancia;
  }
}`,
    hints: ["Singleton restringe a criação da classe a um único objeto.","Armazene em static instancia.","Retorne a mesma instância em chamadas subsequentes."],
    expectedConditionText: "Singleton com static getInstancia()",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Padrão Singleton","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Padrão Singleton</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /getInstancia\s*\(\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 96!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: Singleton com static getInstancia()',
      };
    },
  },
  {
    id: 97,
    title: "Fase 97: Padrão Observer / PubSub (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie um sistema de eventos com subscribe e emit com rigor de produção",
    puzzleDescription: "Arquitetura reativa base de bibliotecas modernas como Redux e Node EventEmitter. Neste desafio prático você irá dominar Padrão Observer / PubSub aplicando código profissional.",
    initialCode: `class EventEmitter {
  constructor() { this.eventos = {}; }
  on(evento, callback) {
    (this.eventos[evento] = this.eventos[evento] || []).push(callback);
  }
  emit(evento, dados) {
    (this.eventos[evento] || []).forEach(cb => cb(dados));
  }
}`,
    hints: ["O Observer desacopla componentes que precisam reagir a mudanças.","on() cadastra ouvintes.","emit() notifica todos os inscritos."],
    expectedConditionText: "EventEmitter com on(evento, cb) e emit(evento, dados)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Padrão Observer / PubSub","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Padrão Observer / PubSub</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /emit\s*\(\s*evento/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 97!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: EventEmitter com on(evento, cb) e emit(evento, dados)',
      };
    },
  },
  {
    id: 98,
    title: "Fase 98: Padrão Factory (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Construa uma fábrica para criar diferentes tipos de botões UI com rigor de produção",
    puzzleDescription: "Design systems e criação flexível de componentes visuais. Neste desafio prático você irá dominar Padrão Factory aplicando código profissional.",
    initialCode: `class BotaoFactory {
  static criar(tipo, texto) {
    if (tipo === "perigo") return { classe: "btn-red", texto };
    return { classe: "btn-blue", texto };
  }
}`,
    hints: ["Factory encapsula a lógica de instanciação complexa.","Recebe parâmetros e decide qual objeto retornar.","Facilita expansão futura sem quebrar código chamador."],
    expectedConditionText: "BotaoFactory.criar(tipo, texto)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Padrão Factory","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Padrão Factory</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /static\s+criar\s*\(\s*tipo/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 98!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: BotaoFactory.criar(tipo, texto)',
      };
    },
  },
  {
    id: 99,
    title: "Fase 99: Padrão Strategy (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Calcule frete flexível com diferentes estratégias de entrega com rigor de produção",
    puzzleDescription: "Elimina ifs aninhados gigantes e torna as regras de negócio modulares. Neste desafio prático você irá dominar Padrão Strategy aplicando código profissional.",
    initialCode: `const freteEstrategias = {
  economico: peso => peso * 5,
  expresso: peso => peso * 12 + 10,
};
function calcularFrete(tipo, peso) {
  return freteEstrategias[tipo](peso);
}`,
    hints: ["Strategy substitui múltiplos ifs por um mapa de algoritmos.","Adicionar nova forma de frete é só adicionar uma chave.","Invoque a estratégia selecionada passando o peso."],
    expectedConditionText: "freteEstrategias[tipo](peso)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Padrão Strategy","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Padrão Strategy</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /freteEstrategias\[tipo\]/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 99!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: freteEstrategias[tipo](peso)',
      };
    },
  },
  {
    id: 100,
    title: "Fase 100: Currying & Funções de Alta Ordem (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função curried para aplicar descontos pré-fixados com rigor de produção",
    puzzleDescription: "Poderoso conceito funcional para criar funções pré-configuradas. Neste desafio prático você irá dominar Currying & Funções de Alta Ordem aplicando código profissional.",
    initialCode: `const criarDesconto = taxa => valor => valor - (valor * taxa);
// Crie um desconto fixo de 10% (0.10):
const desconto10 = criarDesconto(0.10);`,
    hints: ["Currying transforma uma função de vários argumentos em funções encadeadas.","criarDesconto(0.10) retorna uma nova função especialista.","Permite reutilização elegante de regras."],
    expectedConditionText: "const desconto10 = criarDesconto(0.10)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Currying & Funções de Alta Ordem","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Currying & Funções de Alta Ordem</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /criarDesconto\s*\(\s*0\.1/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 100!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: const desconto10 = criarDesconto(0.10)',
      };
    },
  },
  {
    id: 101,
    title: "Fase 101: Função Debounce (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Implemente debounce para limitar chamadas de busca no campo de pesquisa com rigor de produção",
    puzzleDescription: "Economiza centenas de requisições desnecessárias a servidores em inputs de busca. Neste desafio prático você irá dominar Função Debounce aplicando código profissional.",
    initialCode: `function debounce(funcao, delay) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => funcao(...args), delay);
  };
}`,
    hints: ["Debounce aguarda o usuário parar de digitar para disparar a ação.","Cancela o timeout anterior com clearTimeout.","Dispara apenas após o delay especificado."],
    expectedConditionText: "debounce com clearTimeout e setTimeout",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função Debounce","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função Debounce</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /clearTimeout\s*\(\s*temporizador\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 101!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: debounce com clearTimeout e setTimeout',
      };
    },
  },
  {
    id: 102,
    title: "Fase 102: Função Throttle (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Implemente throttle para limitar eventos de scroll a cada X milissegundos com rigor de produção",
    puzzleDescription: "Mantém 60fps constantes mesmo em eventos contínuos pesados. Neste desafio prático você irá dominar Função Throttle aplicando código profissional.",
    initialCode: `function throttle(fn, limite) {
  let aguardando = false;
  return (...args) => {
    if (!aguardando) {
      fn(...args);
      aguardando = true;
      setTimeout(() => aguardando = false, limite);
    }
  };
}`,
    hints: ["Throttle garante que a função execute no máximo uma vez no intervalo.","Excelente para barras de progresso de scroll e redimensionamento.","A variável aguardando controla a permissão."],
    expectedConditionText: "throttle com trava de tempo",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função Throttle","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função Throttle</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /aguardando\s*=\s*true/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 102!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: throttle com trava de tempo',
      };
    },
  },
  {
    id: 103,
    title: "Fase 103: Memoization / Cache de Função (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Armazene resultados de cálculos caros para retorno instantâneo com rigor de produção",
    puzzleDescription: "Acelera processamento de dados e renderização de dashboards. Neste desafio prático você irá dominar Memoization / Cache de Função aplicando código profissional.",
    initialCode: `function memoize(fn) {
  const cache = {};
  return arg => {
    if (arg in cache) return cache[arg];
    return (cache[arg] = fn(arg));
  };
}`,
    hints: ["Memoization salva os retornos indexados pelos parâmetros.","Se o cálculo com aquele número já foi feito, responde em 0ms.","Guarda no objeto cache."],
    expectedConditionText: "memoize checando arg in cache",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Memoization / Cache de Função","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Memoization / Cache de Função</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /if\s*\(\s*arg\s+in\s+cache\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 103!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: memoize checando arg in cache',
      };
    },
  },
  {
    id: 104,
    title: "Fase 104: Intersection Observer (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie observador para lazy loading de imagens ao entrar na viewport com rigor de produção",
    puzzleDescription: "Pilar do Core Web Vitals e carregamento ultra-rápido de páginas. Neste desafio prático você irá dominar Intersection Observer aplicando código profissional.",
    initialCode: `const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(e => {
    if (e.isIntersecting) {
      e.target.src = e.target.dataset.src;
      observador.unobserve(e.target);
    }
  });
});`,
    hints: ["IntersectionObserver monitora visibilidade de elementos na tela.","isIntersecting avisa quando o elemento apareceu no scroll.","Carrega a imagem real apenas quando necessário."],
    expectedConditionText: "new IntersectionObserver com isIntersecting",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Intersection Observer","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Intersection Observer</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+IntersectionObserver/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 104!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: new IntersectionObserver com isIntersecting',
      };
    },
  },
  {
    id: 105,
    title: "Fase 105: AbortController para Cancelamento (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Cancele requisições obsoletas quando o usuário trocar de aba com rigor de produção",
    puzzleDescription: "Prevenção de respostas desatualizadas sobrescrevendo a tela. Neste desafio prático você irá dominar AbortController para Cancelamento aplicando código profissional.",
    initialCode: `const controlador = new AbortController();
// Passe o signal na chamada fetch:
fetch("/api/dados", { signal: controlador.signal });
// Cancele a requisição:
controlador.abort();`,
    hints: ["AbortController permite interromper fetches em andamento.","Evita race conditions quando o usuário clica rápido em filtros.","Chame abort() para cancelar."],
    expectedConditionText: "controlador.abort()",
    previewType: "site-component",
    previewMeta: {"componentTitle":"AbortController para Cancelamento","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">AbortController para Cancelamento</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /controlador\.abort\s*\(\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 105!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: controlador.abort()',
      };
    },
  },
  {
    id: 106,
    title: "Fase 106: Web Storage API (localStorage) (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Persista o token de autenticação de forma segura com rigor de produção",
    puzzleDescription: "Manutenção de sessões e preferências de usuários offline. Neste desafio prático você irá dominar Web Storage API (localStorage) aplicando código profissional.",
    initialCode: `function salvarToken(token) {
  localStorage.setItem("authToken", token);
}
function obterToken() {
  return localStorage.getItem("authToken");
}`,
    hints: ["localStorage armazena pares texto entre recarregamentos.","Use setItem(chave, valor).","Recupere com getItem(chave)."],
    expectedConditionText: "localStorage.setItem e getItem",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Storage API (localStorage)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Storage API (localStorage)</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /localStorage\.setItem\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 106!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: localStorage.setItem e getItem',
      };
    },
  },
  {
    id: 107,
    title: "Fase 107: Web Workers para Multi-threading (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Envie cálculo pesado para segundo plano sem travar a interface com rigor de produção",
    puzzleDescription: "Processamento de áudio, vídeo, criptografia e IA no navegador. Neste desafio prático você irá dominar Web Workers para Multi-threading aplicando código profissional.",
    initialCode: `const worker = new Worker("worker.js");
// Envie os dados para o worker processar:
worker.postMessage({ dados: [1, 2, 3] });
worker.onmessage = (e) => console.log("Resultado:", e.data);`,
    hints: ["Workers rodam em threads separadas sem congelar a UI.","Comunique via postMessage.","Escute respostas no evento onmessage."],
    expectedConditionText: "worker.postMessage({ dados: ... })",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Workers para Multi-threading","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Workers para Multi-threading</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /worker\.postMessage/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 107!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: worker.postMessage({ dados: ... })',
      };
    },
  },
  {
    id: 108,
    title: "Fase 108: WebSocket em Tempo Real (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Conecte a um canal WebSocket bidirecional para chat ao vivo com rigor de produção",
    puzzleDescription: "Comunicação full-duplex de baixa latência em milissegundos. Neste desafio prático você irá dominar WebSocket em Tempo Real aplicando código profissional.",
    initialCode: `const socket = new WebSocket("wss://chat.progplay.dev");
socket.onopen = () => {
  socket.send(JSON.stringify({ tipo: "entrar", sala: "geral" }));
};`,
    hints: ["WebSockets mantêm conexão TCP aberta e instantânea.","Ideal para jogos multiplayer e chats.","Envie mensagens com socket.send()."],
    expectedConditionText: "new WebSocket com socket.send",
    previewType: "site-component",
    previewMeta: {"componentTitle":"WebSocket em Tempo Real","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">WebSocket em Tempo Real</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+WebSocket/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 108!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: new WebSocket com socket.send',
      };
    },
  },
  {
    id: 109,
    title: "Fase 109: Validador de Schemas JSON (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie função de validação de payload com regras de campos com rigor de produção",
    puzzleDescription: "Camada de proteção de integridade de dados e contratos de APIs. Neste desafio prático você irá dominar Validador de Schemas JSON aplicando código profissional.",
    initialCode: `function validarPayload(dados, schema) {
  for (const campo of Object.keys(schema)) {
    if (schema[campo].obrigatorio && !(campo in dados)) return false;
  }
  return true;
}`,
    hints: ["Percorra os campos do schema.","Verifique se campos obrigatórios estão ausentes.","Retorne booleano indicando validade."],
    expectedConditionText: "validação iterando chaves do schema",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Validador de Schemas JSON","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Validador de Schemas JSON</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /for\s*\(\s*const\s+campo\s+of\s+Object\.keys/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 109!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: validação iterando chaves do schema',
      };
    },
  },
  {
    id: 110,
    title: "Fase 110: Proxy Reativo (Mini Vue/MobX) (Nível Avançado 3)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie um objeto reativo usando Proxy que escuta mutações com rigor de produção",
    puzzleDescription: "Como frameworks modernos detectam mudanças de estado e re-renderizam a tela. Neste desafio prático você irá dominar Proxy Reativo (Mini Vue/MobX) aplicando código profissional.",
    initialCode: `function criarReativo(alvo, aoMudar) {
  return new Proxy(alvo, {
    set(obj, prop, valor) {
      obj[prop] = valor;
      aoMudar(prop, valor);
      return true;
    }
  });
}`,
    hints: ["Proxy intercepta operações fundamentais de objetos.","O trap set é acionado toda vez que uma propriedade é alterada.","Dispara automaticamente o callback aoMudar."],
    expectedConditionText: "new Proxy(alvo, { set(...) })",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Proxy Reativo (Mini Vue/MobX)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Proxy Reativo (Mini Vue/MobX)</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+Proxy\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 110!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: new Proxy(alvo, { set(...) })',
      };
    },
  },
  {
    id: 111,
    title: "Fase 111: Array map() (Nível Avançado 4)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Use .map() para dobrar os preços dos produtos com rigor de produção",
    puzzleDescription: "O método map() é essencial no JavaScript moderno para transformar coleções de dados sem alterar o array original. Neste desafio prático você irá dominar Array map() aplicando código profissional.",
    initialCode: `const precos = [10, 25, 40, 80];
// Use map para dobrar cada valor:
const precosDobrados = precos.map(p => p * 2);`,
    hints: ["O método map cria um novo array aplicando uma função a cada item.","Use precos.map(p => p * 2).","Verifique se precosDobrados contém os valores multiplicados."],
    expectedConditionText: "precos.map(p => p * 2)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array map()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array map()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /precos\.map\s*\(\s*(p|item|preco|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 111!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: precos.map(p => p * 2)',
      };
    },
  },
  {
    id: 112,
    title: "Fase 112: Array filter() (Nível Avançado 4)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Filtre apenas usuários ativos do sistema com rigor de produção",
    puzzleDescription: "Com filter(), extraímos subconjuntos de registros para listagens, buscas e permissões de acesso. Neste desafio prático você irá dominar Array filter() aplicando código profissional.",
    initialCode: `const usuarios = [
  { nome: "Ana", ativo: true },
  { nome: "Beto", ativo: false },
  { nome: "Carla", ativo: true }
];
// Filtre apenas quem está ativo:
const ativos = usuarios.filter(u => u.ativo === true);`,
    hints: ["O filter recebe uma função que retorna verdadeiro ou falso.","Use usuarios.filter(u => u.ativo).","O resultado conterá apenas os objetos com ativo true."],
    expectedConditionText: "usuarios.filter(u => u.ativo)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array filter()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array filter()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /usuarios\.filter\s*\(\s*(u|user|usuario|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 112!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: usuarios.filter(u => u.ativo)',
      };
    },
  },
  {
    id: 113,
    title: "Fase 113: Array reduce() Totalizador (Nível Avançado 4)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Calcule o valor total do carrinho de compras com .reduce() com rigor de produção",
    puzzleDescription: "O reduce é o coração do cálculo financeiro e agregação de dados em aplicações web. Neste desafio prático você irá dominar Array reduce() Totalizador aplicando código profissional.",
    initialCode: `const itens = [29.9, 49.9, 15.0, 99.0];
// Some todos os valores do carrinho:
const totalCarrinho = itens.reduce((acumulador, item) => acumulador + item, 0);`,
    hints: ["Reduce acumula valores iterando sobre a lista.","Passe 0 como valor inicial do acumulador.","Retorne acumulador + item."],
    expectedConditionText: "itens.reduce((acc, curr) => acc + curr, 0)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array reduce() Totalizador","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array reduce() Totalizador</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /itens\.reduce\s*\(\s*\([^)]*\)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 113!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: itens.reduce((acc, curr) => acc + curr, 0)',
      };
    },
  },
  {
    id: 114,
    title: "Fase 114: Array find() & findIndex() (Nível Avançado 4)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Localize o produto específico pelo ID com .find() com rigor de produção",
    puzzleDescription: "Localizar objetos pontuais por identificador único é operação diária em interfaces de detalhes. Neste desafio prático você irá dominar Array find() & findIndex() aplicando código profissional.",
    initialCode: `const catalogo = [
  { id: 101, nome: "Teclado" },
  { id: 102, nome: "Mouse" },
  { id: 103, nome: "Monitor" }
];
// Encontre o produto de id 102:
const produtoBuscado = catalogo.find(p => p.id === 102);`,
    hints: ["find() retorna o primeiro elemento correspondente.","Compare p.id === 102.","Se não encontrar, retornará undefined."],
    expectedConditionText: "catalogo.find(p => p.id === 102)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array find() & findIndex()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array find() & findIndex()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /catalogo\.find\s*\(\s*(p|item|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 114!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: catalogo.find(p => p.id === 102)',
      };
    },
  },
  {
    id: 115,
    title: "Fase 115: Array some() e every() (Nível Avançado 4)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Valide se todos os campos obrigatórios estão preenchidos com rigor de produção",
    puzzleDescription: "Validações pré-envio de formulários garantem que requisições ao servidor cheguem completas. Neste desafio prático você irá dominar Array some() e every() aplicando código profissional.",
    initialCode: `const campos = ["nome", "email", "senha"];
const form = { nome: "João", email: "j@email.com", senha: "123" };
// Verifique se todos os campos têm valor:
const todosPreenchidos = campos.every(c => Boolean(form[c]));`,
    hints: ["every() retorna true se todos os itens satisfizerem a condição.","Acesse form[c] para cada campo.","Garanta que a verificação retorne booleano."],
    expectedConditionText: "campos.every(c => Boolean(form[c]))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array some() e every()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array some() e every()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /campos\.every\s*\(\s*(c|campo|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 115!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: campos.every(c => Boolean(form[c]))',
      };
    },
  },
  {
    id: 116,
    title: "Fase 116: Array flatMap() (Nível Avançado 4)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Achate e transforme listas aninhadas com flatMap com rigor de produção",
    puzzleDescription: "Processamento de listas aninhadas e categorização de posts/produtos. Neste desafio prático você irá dominar Array flatMap() aplicando código profissional.",
    initialCode: `const pedidos = [
  { tags: ["urgente", "web"] },
  { tags: ["frontend", "urgente"] }
];
// Extraia todas as tags em um único array:
const todasTags = pedidos.flatMap(p => p.tags);`,
    hints: ["flatMap mapeia e aplaina em profundidade 1.","Retorne p.tags no callback.","O resultado é um array simples com todas as tags."],
    expectedConditionText: "pedidos.flatMap(p => p.tags)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Array flatMap()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Array flatMap()</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /pedidos\.flatMap\s*\(\s*(p|\w+)\s*=>/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 116!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: pedidos.flatMap(p => p.tags)',
      };
    },
  },
  {
    id: 117,
    title: "Fase 117: Desestruturação & Rest/Spread (Nível Avançado 4)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Clone e mescle objetos usando o operador Spread (...) com rigor de produção",
    puzzleDescription: "Padrão moderno para gerenciamento de configurações e estados imutáveis. Neste desafio prático você irá dominar Desestruturação & Rest/Spread aplicando código profissional.",
    initialCode: `const configPadrao = { tema: "escuro", som: true };
const configUsuario = { som: false, zoom: 1.2 };
// Mescle as configurações com spread:
const configFinal = { ...configPadrao, ...configUsuario };`,
    hints: ["O operador ... espalha as propriedades de um objeto.","Propriedades posteriores sobrescrevem as anteriores.","Crie o objeto final combinando ambos."],
    expectedConditionText: "{ ...configPadrao, ...configUsuario }",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Desestruturação & Rest/Spread","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Desestruturação & Rest/Spread</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /\.\.\.configPadrao/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 117!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: { ...configPadrao, ...configUsuario }',
      };
    },
  },
  {
    id: 118,
    title: "Fase 118: Set para Valores Únicos (Nível Avançado 4)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Remova valores duplicados da lista usando new Set() com rigor de produção",
    puzzleDescription: "Eliminação instantânea de redundâncias em arrays de alta performance. Neste desafio prático você irá dominar Set para Valores Únicos aplicando código profissional.",
    initialCode: `const tagsComDuplicatas = ["html", "css", "html", "js", "css"];
// Crie um array sem duplicatas usando Set:
const tagsUnicas = [...new Set(tagsComDuplicatas)];`,
    hints: ["A estrutura Set só armazena valores únicos.","Converta de volta para array usando [...new Set()].","Ótimo para filtros de tags e categorias."],
    expectedConditionText: "[...new Set(tagsComDuplicatas)]",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Set para Valores Únicos","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Set para Valores Únicos</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /new\s+Set\s*\(\s*tagsComDuplicatas\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 118!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: [...new Set(tagsComDuplicatas)]',
      };
    },
  },
  {
    id: 119,
    title: "Fase 119: Estrutura Map para Cache (Nível Avançado 4)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Armazene pares chave-valor no objeto Map() com rigor de produção",
    puzzleDescription: "Cache em memória para evitar chamadas de rede repetitivas. Neste desafio prático você irá dominar Estrutura Map para Cache aplicando código profissional.",
    initialCode: `const cache = new Map();
// Salve a rota com set e recupere com get:
cache.set("usuario:1", { nome: "Lucas" });
const usuarioCached = cache.get("usuario:1");`,
    hints: ["Map permite chaves de qualquer tipo e mantém ordem de inserção.","Use cache.set(chave, valor).","Recupere com cache.get(chave)."],
    expectedConditionText: "cache.set(\"usuario:1\", ...) e cache.get(\"usuario:1\")",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Estrutura Map para Cache","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Estrutura Map para Cache</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /cache\.set\s*\(/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 119!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: cache.set("usuario:1", ...) e cache.get("usuario:1")',
      };
    },
  },
  {
    id: 120,
    title: "Fase 120: Recursão: Fatorial & Busca (Nível Avançado 4)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma função recursiva que calcula o fatorial de n com rigor de produção",
    puzzleDescription: "Recursão é o alicerce para percorrer árvores DOM, estruturas de pastas e dados hierárquicos. Neste desafio prático você irá dominar Recursão: Fatorial & Busca aplicando código profissional.",
    initialCode: `function fatorial(n) {
  // Caso base: se n <= 1 retorne 1
  if (n <= 1) return 1;
  // Chamada recursiva:
  return n * fatorial(n - 1);
}`,
    hints: ["Toda função recursiva precisa de um caso base para não entrar em loop infinito.","Se n <= 1 retorne 1.","Retorne n * fatorial(n - 1)."],
    expectedConditionText: "fatorial(n) com caso base e n * fatorial(n - 1)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Recursão: Fatorial & Busca","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Recursão: Fatorial & Busca</span>: Pronto para validação.</div>","successBadge":"Especialista JAVASCRIPT"},
    validate: (rawCode) => {
      const passed = /return\s+n\s*\*\s*fatorial\s*\(\s*n\s*-\s*1\s*\)/i.test(rawCode);
      if (passed) {
        return {
          success: true,
          doorState: true,
          message: '🏆 Excelente! Objetivo concluído com sucesso na Fase 120!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A lógica precisa atender a condição esperada: fatorial(n) com caso base e n * fatorial(n - 1)',
      };
    },
  },
];
