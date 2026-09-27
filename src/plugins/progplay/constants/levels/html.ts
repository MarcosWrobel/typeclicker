import { GameLevel } from './types';
import { HTML_EXTRA_LEVELS } from './html_extra';

const HTML_BASE_LEVELS: GameLevel[] = [
  // ==========================================
  // CAPÍTULO 1: O ENIGMA DA PORTA (FASES 1 A 10)
  // ==========================================
  {
    id: 1,
    title: 'Fase 1: A Classe da Porta',
    themeStyle: 'wooden',
    themeCategory: 'door',
    targetObjective: 'Troque a classe "trancada" por "aberta"',
    puzzleDescription: 'A porta de madeira responde às classes de estilo aplicadas a ela.',
    initialCode: `<!-- Altere a classe no elemento da porta: -->
<div class="porta trancada">
  <span class="trinco"></span>
</div>
`,
    hints: [
      'Veja o atributo class="porta trancada".',
      'Troque a palavra "trancada" por "aberta".',
      'Exemplo: <div class="porta aberta">.',
    ],
    expectedConditionText: 'class="porta aberta"',
    validate: (rawCode) => {
      if (/class\s*=\s*["'][^"']*\baberta\b[^"']*["']/i.test(rawCode) && !/trancada/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Classe "aberta" aplicada! O batente de madeira cedeu e abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A porta ainda possui a classe trancada. Troque por class="porta aberta".',
      };
    },
  },
  {
    id: 2,
    title: 'Fase 2: Desbloquear o Botão (disabled)',
    themeStyle: 'iron',
    themeCategory: 'door',
    targetObjective: 'Remova o atributo disabled do botão de abertura',
    puzzleDescription: 'O botão de liberação da porta de ferro está desabilitado.',
    initialCode: `<!-- Remova o atributo que bloqueia o clique no botão: -->
<div class="painel-ferro">
  <button id="btn-abrir" disabled>Destrancar Portão</button>
</div>
`,
    hints: [
      'O atributo "disabled" impede qualquer interação com o botão.',
      'Delete a palavra "disabled" de dentro da tag <button>.',
      'Exemplo: <button id="btn-abrir">Destrancar Portão</button>.',
    ],
    expectedConditionText: '<button id="btn-abrir"> sem o atributo disabled',
    validate: (rawCode) => {
      if (/<button[^>]*id\s*=\s*["']btn-abrir["'][^>]*>/i.test(rawCode) && !/<button[^>]*disabled/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Atributo disabled removido! O botão foi acionado e a porta abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'O botão continua com disabled. Remova a palavra "disabled" da tag <button>.',
      };
    },
  },
  {
    id: 3,
    title: 'Fase 3: O Atributo Hidden',
    themeStyle: 'vault',
    themeCategory: 'door',
    targetObjective: 'Remova o atributo hidden da passagem secreta',
    puzzleDescription: 'O acesso ao cofre foi ocultado pelos construtores no HTML.',
    initialCode: `<!-- Remova o atributo hidden para tornar o cofre visível: -->
<section id="cofre-forte" hidden>
  <div class="porta-blindada"></div>
</section>
`,
    hints: [
      'O atributo booleano hidden esconde o elemento visualmente na página.',
      'Delete a palavra "hidden" da tag <section>.',
    ],
    expectedConditionText: '<section id="cofre-forte"> sem hidden',
    validate: (rawCode) => {
      if (/<section[^>]*id\s*=\s*["']cofre-forte["'][^>]*>/i.test(rawCode) && !/<section[^>]*hidden/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Atributo hidden removido! A câmara blindada apareceu e se abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A tag section ainda está escondida. Remova o atributo "hidden".',
      };
    },
  },
  {
    id: 4,
    title: 'Fase 4: O Input de Senha',
    themeStyle: 'scifi',
    themeCategory: 'door',
    targetObjective: 'Configure value="cyber777" no campo de senha',
    puzzleDescription: 'O teclado holográfico do portal sci-fi precisa do valor digitado no input.',
    initialCode: `<!-- Preencha o campo de senha com value="cyber777": -->
<div class="terminal-acesso">
  <input type="password" id="senha" value="" />
</div>
`,
    hints: [
      'Coloque o valor dentro do atributo value: value="cyber777".',
    ],
    expectedConditionText: 'value="cyber777"',
    validate: (rawCode) => {
      if (/value\s*=\s*["']cyber777["']/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Valor cyber777 inserido no input! O portal holográfico abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Preencha o atributo value com o valor exato "cyber777".',
      };
    },
  },
  {
    id: 5,
    title: 'Fase 5: O Checkbox Marcado',
    themeStyle: 'portal',
    themeCategory: 'door',
    targetObjective: 'Adicione o atributo checked ao checkbox de ativação',
    puzzleDescription: 'A passagem mágica precisa que o interruptor HTML esteja marcado.',
    initialCode: `<!-- Adicione o atributo checked ao input checkbox: -->
<label class="ativador">
  <input type="checkbox" id="ativar-portal" />
  Ativar Portal
</label>
`,
    hints: [
      'Em inputs do tipo checkbox, "checked" marca a caixa por padrão.',
      'Insira a palavra checked dentro da tag do input: <input type="checkbox" id="ativar-portal" checked />.',
    ],
    expectedConditionText: '<input type="checkbox" ... checked />',
    validate: (rawCode) => {
      if (/<input[^>]*id\s*=\s*["']ativar-portal["'][^>]*\bchecked\b/i.test(rawCode) || /<input[^>]*\bchecked\b[^>]*id\s*=\s*["']ativar-portal["']/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Checkbox checked! O circuito mágico fechou e abriu a passagem!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Adicione o atributo "checked" dentro da tag <input>.',
      };
    },
  },
  {
    id: 6,
    title: 'Fase 6: O Atributo data-status',
    themeStyle: 'scifi',
    themeCategory: 'door',
    targetObjective: 'Altere data-status de "locked" para "unlocked"',
    puzzleDescription: 'Sensores lêem os atributos de dados customizados (data-*) da comporta.',
    initialCode: `<!-- Mude o atributo data-status para "unlocked": -->
<div class="comporta-espacial" data-status="locked">
  <div class="escotilha"></div>
</div>
`,
    hints: [
      'Atributos data-* são padrão no HTML5 para guardar metadados.',
      'Altere de data-status="locked" para data-status="unlocked".',
    ],
    expectedConditionText: 'data-status="unlocked"',
    validate: (rawCode) => {
      if (/data-status\s*=\s*["']unlocked["']/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'data-status alterado para "unlocked"! A comporta espacial abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'O status ainda está locked. Altere para data-status="unlocked".',
      };
    },
  },
  {
    id: 7,
    title: 'Fase 7: O Diálogo Aberto (<dialog open>)',
    themeStyle: 'vault',
    themeCategory: 'door',
    targetObjective: 'Adicione o atributo open à tag <dialog>',
    puzzleDescription: 'A tag nativa de diálogo do HTML5 só exibe seu conteúdo quando possui o atributo open.',
    initialCode: `<!-- Adicione o atributo open à tag <dialog>: -->
<dialog id="portal-dialog">
  <h2>Passagem Secreta Revelada</h2>
</dialog>
`,
    hints: [
      'A tag <dialog> do HTML5 suporta o atributo booleano "open".',
      'Escreva: <dialog id="portal-dialog" open>.',
    ],
    expectedConditionText: '<dialog ... open>',
    validate: (rawCode) => {
      if (/<dialog[^>]*\bopen\b[^>]*>/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Atributo open inserido no <dialog>! O cofre modal abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Insira o atributo "open" na tag <dialog>.',
      };
    },
  },
  {
    id: 8,
    title: 'Fase 8: A Lista dos 3 Selos',
    themeStyle: 'wooden',
    themeCategory: 'door',
    targetObjective: 'Crie uma lista <ul> com 3 itens <li>',
    puzzleDescription: 'A porta ancestral necessita de exatamente 3 itens <li> dentro da tag <ul>.',
    initialCode: `<!-- Complete a lista com 3 elementos <li>: -->
<ul class="selos-runicos">
  <li>Selo do Fogo</li>
</ul>
`,
    hints: [
      'Adicione mais duas linhas contendo tags <li>Texto</li>.',
      'A lista precisa conter exatamente 3 tags <li>.',
    ],
    expectedConditionText: '3 elementos <li> dentro de <ul>',
    validate: (rawCode) => {
      const lis = rawCode.match(/<li\b[^>]*>.*?<\/li>/gi);
      if (lis && lis.length === 3) {
        return {
          success: true,
          doorState: true,
          message: 'Os 3 selos estão presentes na lista! O portão rúnico abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: `Atualmente há ${lis ? lis.length : 0} tags <li>. São necessárias exatamente 3.`,
      };
    },
  },
  {
    id: 9,
    title: 'Fase 9: O Link de Teleporte (href)',
    themeStyle: 'portal',
    themeCategory: 'door',
    targetObjective: 'Configure o link para href="#portal-aberto"',
    puzzleDescription: 'A âncora de navegação precisa apontar para a coordenada correta.',
    initialCode: `<!-- Altere o destino do link para href="#portal-aberto": -->
<a href="#" class="portal-link">
  Entrar no Vórtice
</a>
`,
    hints: [
      'Altere o atributo href="#" para href="#portal-aberto".',
    ],
    expectedConditionText: 'href="#portal-aberto"',
    validate: (rawCode) => {
      if (/href\s*=\s*["']#portal-aberto["']/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Destino ancorado em #portal-aberto! O túnel dimensional abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Defina o atributo com href="#portal-aberto".',
      };
    },
  },
  {
    id: 10,
    title: 'Fase 10: O Botão com Ação (type="submit")',
    themeStyle: 'iron',
    themeCategory: 'door',
    targetObjective: 'Troque o type="button" por type="submit" no formulário da porta',
    puzzleDescription: 'O formulário mestre só destranca quando o gatilho é de envio oficial.',
    initialCode: `<!-- Altere o type para "submit" no botão do formulário: -->
<form id="form-porta">
  <button type="button" class="destravar">Abrir Portão Principal</button>
</form>
`,
    hints: [
      'Botoes em formulários HTML disparam a submissão com type="submit".',
      'Troque type="button" por type="submit".',
    ],
    expectedConditionText: 'type="submit"',
    validate: (rawCode) => {
      if (/type\s*=\s*["']submit["']/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Formulário submetido com type="submit"! Você concluiu o Capítulo 1 das Portas!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Altere o atributo para type="submit".',
      };
    },
  },

  // =======================================================
  // CAPÍTULO 2: CONSTRUÇÃO DE SITES REAIS (FASES 11 A 20)
  // =======================================================
  {
    id: 11,
    title: 'Fase 11: Header Semântico com Logotipo e Nav',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Monte o <header> semântico contendo o logotipo e a tag <nav> com os links do site',
    puzzleDescription: 'Todo site profissional começa com um cabeçalho semântico claro para navegação e acessibilidade.',
    initialCode: `<!-- Estruture o cabeçalho semântico do site: -->
<header class="site-header">
  <div class="logo">MinhaMarca</div>
  <nav class="site-nav">
    <a href="#home">Início</a>
    <a href="#sobre">Sobre</a>
    <a href="#contato">Contato</a>
  </nav>
</header>
`,
    hints: [
      'A tag <header> agrupa a identidade visual e o menu.',
      'A tag <nav> informa aos navegadores que este é o menu principal.',
      'Mantenha as tags <header>, <nav> e os 3 links <a>.',
    ],
    expectedConditionText: '<header> com <nav> e links <a>',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Navegação Principal do Site',
      previewSnippet: '<div class="flex justify-between p-3 bg-neutral-900 border rounded-lg"><strong>MinhaMarca</strong><span class="text-xs text-blue-400">Início • Sobre • Contato</span></div>',
      successBadge: 'Header Semântico OK',
    },
    validate: (rawCode) => {
      const hasHeader = /<header\b[^>]*>[\s\S]*<\/header>/i.test(rawCode);
      const hasNav = /<nav\b[^>]*>[\s\S]*<\/nav>/i.test(rawCode);
      const links = rawCode.match(/<a\b[^>]*>.*?<\/a>/gi);
      if (hasHeader && hasNav && links && links.length >= 3) {
        return {
          success: true,
          doorState: true,
          message: 'Cabeçalho e navegação semântica criados com perfeição!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Certifique-se de incluir a tag <header>, a tag <nav> e pelo menos 3 links <a>.',
      };
    },
  },
  {
    id: 12,
    title: 'Fase 12: Hero Section com CTA (Call to Action)',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Crie uma <section class="hero"> com <h1>, <p> explicativo e <button class="cta">',
    puzzleDescription: 'A seção Hero é a vitrine principal de qualquer Landing Page: impacta o visitante nos primeiros 3 segundos.',
    initialCode: `<!-- Seção principal de destaque do site: -->
<section class="hero">
  <h1>Construa Sites Incríveis do Zero</h1>
  <p>Aprenda desenvolvimento web moderno na prática com desafios reais.</p>
  <button class="cta-btn">Começar Agora</button>
</section>
`,
    hints: [
      'Use a tag <section class="hero">.',
      'Inclua o título principal na tag <h1>.',
      'Adicione a chamada para ação com um <button>.',
    ],
    expectedConditionText: '<section class="hero"> com <h1>, <p> e <button>',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Hero Section de Alta Conversão',
      previewSnippet: '<div class="text-center p-6 bg-gradient-to-b from-blue-900/40 to-neutral-900 rounded-xl"><h2 class="text-xl font-bold">Construa Sites Incríveis</h2><button class="mt-3 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">Começar Agora</button></div>',
      successBadge: 'Hero Section OK',
    },
    validate: (rawCode) => {
      const hasSection = /<section\b[^>]*class\s*=\s*["'][^"']*\bhero\b[^"']*["']/i.test(rawCode);
      const hasH1 = /<h1\b[^>]*>.*?<\/h1>/i.test(rawCode);
      const hasBtn = /<button\b[^>]*>.*?<\/button>/i.test(rawCode);
      if (hasSection && hasH1 && hasBtn) {
        return {
          success: true,
          doorState: true,
          message: 'Hero Section estruturada! Pronta para capturar a atenção de clientes!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Inclua uma <section class="hero"> com tags <h1> e <button>.',
      };
    },
  },
  {
    id: 13,
    title: 'Fase 13: Grid de Benefícios (<article>)',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Crie uma <section class="features"> contendo 3 tags <article> com <h3> e <p>',
    puzzleDescription: 'A tag <article> é a tag semântica ideal para blocos independentes como cards de serviços, produtos e posts.',
    initialCode: `<!-- Grid de recursos com tags semânticas article: -->
<section class="features">
  <article class="card">
    <h3>Design Responsivo</h3>
    <p>Funciona em celulares, tablets e computadores.</p>
  </article>
  <article class="card">
    <h3>Alta Performance</h3>
    <p>Carregamento ultra-rápido otimizado para SEO.</p>
  </article>
  <article class="card">
    <h3>Código Limpo</h3>
    <p>Estruturado com as melhores práticas da web.</p>
  </article>
</section>
`,
    hints: [
      'Utilize 3 tags <article> dentro de <section class="features">.',
      'Cada article deve conter um <h3> e um parágrafo <p>.',
    ],
    expectedConditionText: '3 tags <article> com <h3> e <p>',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Grade de Vantagens e Recursos',
      previewSnippet: '<div class="grid grid-cols-3 gap-2 text-center text-xs"><div class="p-2 bg-neutral-800 rounded">📱 Responsivo</div><div class="p-2 bg-neutral-800 rounded">⚡ Rápido</div><div class="p-2 bg-neutral-800 rounded">✨ Limpo</div></div>',
      successBadge: 'Grid Semântico OK',
    },
    validate: (rawCode) => {
      const articles = rawCode.match(/<article\b[^>]*>[\s\S]*?<\/article>/gi);
      if (articles && articles.length >= 3) {
        return {
          success: true,
          doorState: true,
          message: 'Cards semânticos configurados com perfeição!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Crie pelo menos 3 elementos <article> com <h3> e <p>.',
      };
    },
  },
  {
    id: 14,
    title: 'Fase 14: Tabela de Preços & Planos (<table>)',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Monte uma <table> semântica com <thead>, <th>, <tbody>, <tr> e <td>',
    puzzleDescription: 'Tabelas HTML organizam dados tabulares como planos de assinatura, especificações técnicas e comparativos.',
    initialCode: `<!-- Tabela comparativa de planos: -->
<table class="tabela-precos">
  <thead>
    <tr>
      <th>Plano</th>
      <th>Preço Mensal</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Básico</td>
      <td>R$ 29/mês</td>
    </tr>
    <tr>
      <td>Profissional</td>
      <td>R$ 79/mês</td>
    </tr>
  </tbody>
</table>
`,
    hints: [
      'A tag <thead> agrupa os cabeçalhos com células <th>.',
      'A tag <tbody> agrupa as linhas de dados com células <td>.',
    ],
    expectedConditionText: '<table> com <thead>, <tbody>, <tr>, <th> e <td>',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Tabela de Assinaturas',
      previewSnippet: '<table class="w-full text-xs text-left"><tr class="border-b"><th>Plano</th><th>Preço</th></tr><tr><td>Profissional</td><td class="text-emerald-400">R$ 79</td></tr></table>',
      successBadge: 'Tabela Semântica OK',
    },
    validate: (rawCode) => {
      const hasTable = /<table\b/i.test(rawCode);
      const hasThead = /<thead\b/i.test(rawCode);
      const hasTbody = /<tbody\b/i.test(rawCode);
      const hasTh = /<th\b/i.test(rawCode);
      const hasTd = /<td\b/i.test(rawCode);
      if (hasTable && hasThead && hasTbody && hasTh && hasTd) {
        return {
          success: true,
          doorState: true,
          message: 'Tabela HTML perfeitamente estruturada para exibir planos de preços!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Inclua todas as tags: <table>, <thead>, <tbody>, <th> e <td>.',
      };
    },
  },
  {
    id: 15,
    title: 'Fase 15: Formulário de Contato Completo',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Crie um <form> com input type="email" required, input type="text" e textarea',
    puzzleDescription: 'Formulários são a principal porta de entrada para leads, orçamentos e mensagens de clientes no site.',
    initialCode: `<!-- Formulário de contato com validação HTML5 nativa: -->
<form class="form-contato" action="/enviar" method="POST">
  <label for="nome">Seu Nome:</label>
  <input type="text" id="nome" name="nome" required />

  <label for="email">Seu E-mail:</label>
  <input type="email" id="email" name="email" required />

  <label for="msg">Mensagem:</label>
  <textarea id="msg" name="mensagem" required></textarea>

  <button type="submit">Enviar Mensagem</button>
</form>
`,
    hints: [
      'O atributo required impede o envio se o campo estiver vazio.',
      'type="email" valida automaticamente o formato do endereço de email.',
      'Mantenha as tags <form>, <input type="email">, <textarea> e <button type="submit">.',
    ],
    expectedConditionText: '<form> com input email required, textarea e button submit',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Formulário de Contato & Orçamento',
      previewSnippet: '<div class="space-y-1.5"><input placeholder="Nome" class="input"/><input placeholder="Email" class="input"/><button class="btn w-full">Enviar</button></div>',
      successBadge: 'Formulário Válido',
    },
    validate: (rawCode) => {
      const hasForm = /<form\b/i.test(rawCode);
      const hasEmail = /<input[^>]*type\s*=\s*["']email["'][^>]*required/i.test(rawCode);
      const hasTextarea = /<textarea\b[^>]*required/i.test(rawCode);
      const hasSubmit = /<button[^>]*type\s*=\s*["']submit["']/i.test(rawCode) || /<input[^>]*type\s*=\s*["']submit["']/i.test(rawCode);
      if (hasForm && hasEmail && hasTextarea && hasSubmit) {
        return {
          success: true,
          doorState: true,
          message: 'Formulário de contato seguro com validação nativa do HTML5!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Inclua <form>, <input type="email" required>, <textarea required> e <button type="submit">.',
      };
    },
  },
  {
    id: 16,
    title: 'Fase 16: Diálogo Nativo (<dialog>)',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Configure a tag moderna <dialog> com método de fechamento semântico',
    puzzleDescription: 'A tag nativa <dialog> elimina a necessidade de bibliotecas pesadas para caixas de diálogo e modais.',
    initialCode: `<!-- Modal pop-up nativo do HTML5: -->
<dialog id="modal-promocao">
  <h2>Oferta Especial de Lançamento!</h2>
  <p>Ganhe 20% de desconto na primeira compra usando o cupom DEV20.</p>
  <form method="dialog">
    <button>Fechar</button>
  </form>
</dialog>
`,
    hints: [
      '<form method="dialog"> fecha automaticamente a janela ao clicar no botão, sem precisar de JS.',
      'Mantenha a tag <dialog> com o <form method="dialog">.',
    ],
    expectedConditionText: '<dialog> com <form method="dialog">',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Caixa de Diálogo Nativa',
      previewSnippet: '<div class="p-3 bg-neutral-900 border rounded-lg text-center"><span class="font-bold">🎉 Cupom DEV20 Ativo</span></div>',
      successBadge: 'HTML5 Dialog OK',
    },
    validate: (rawCode) => {
      const hasDialog = /<dialog\b[\s\S]*<\/dialog>/i.test(rawCode);
      const hasMethod = /method\s*=\s*["']dialog["']/i.test(rawCode);
      if (hasDialog && hasMethod) {
        return {
          success: true,
          doorState: true,
          message: 'Tag <dialog> moderna implementada conforme os padrões web da W3C!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Implemente a tag <dialog> contendo <form method="dialog">.',
      };
    },
  },
  {
    id: 17,
    title: 'Fase 17: Imagens Otimizadas com <figure> e <figcaption>',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Estruture uma imagem com <figure>, <img alt="..." loading="lazy"> e <figcaption>',
    puzzleDescription: 'Sites modernos utilizam figure e figcaption para enriquecer imagens com legendas acessíveis e loading="lazy" para economia de banda.',
    initialCode: `<!-- Imagem semântica otimizada para web: -->
<figure class="card-foto">
  <img src="dashboard.webp" alt="Interface do sistema administrativo" loading="lazy" />
  <figcaption>Visão geral do painel de controle do usuário</figcaption>
</figure>
`,
    hints: [
      '<figure> agrupa a mídia visual e sua descrição semântica.',
      '<figcaption> provê a legenda oficial indexada por leitores de tela e Google.',
      'loading="lazy" adia o download até que a imagem se aproxime da tela.',
    ],
    expectedConditionText: '<figure> com <img alt="..." loading="lazy"> e <figcaption>',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Mídia e Legenda Acessível',
      previewSnippet: '<div class="border rounded p-2 text-center text-xs bg-neutral-900">🖼️ [Imagem Otimizada WebP]<div class="text-[10px] text-neutral-400 mt-1">Legenda: Painel de Controle</div></div>',
      successBadge: 'Mídia Acessível OK',
    },
    validate: (rawCode) => {
      const hasFigure = /<figure\b[\s\S]*<\/figure>/i.test(rawCode);
      const hasLazy = /loading\s*=\s*["']lazy["']/i.test(rawCode);
      const hasAlt = /alt\s*=\s*["'][^"']+["']/i.test(rawCode);
      const hasFigcaption = /<figcaption\b[\s\S]*<\/figcaption>/i.test(rawCode);
      if (hasFigure && hasLazy && hasAlt && hasFigcaption) {
        return {
          success: true,
          doorState: true,
          message: 'Imagem otimizada com tags semânticas, acessibilidade e carregamento lazy!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Inclua <figure>, <img loading="lazy" alt="..."> e <figcaption>.',
      };
    },
  },
  {
    id: 18,
    title: 'Fase 18: Seção FAQ com Accordion Nativo (<details>)',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Crie uma lista de perguntas frequentes usando as tags nativas <details> e <summary>',
    puzzleDescription: 'As tags <details> e <summary> criam sanfonas interativas de perguntas e respostas sem precisar de uma única linha de JavaScript!',
    initialCode: `<!-- Sanfona nativa de perguntas frequentes: -->
<section class="faq-section">
  <details>
    <summary>O site é seguro e possui certificado SSL?</summary>
    <p>Sim, todas as conexões são criptografadas com protocolo HTTPS ponta a ponta.</p>
  </details>
  <details>
    <summary>Quais são as formas de pagamento aceitas?</summary>
    <p>Aceitamos Pix, cartão de crédito em até 12x e boleto bancário.</p>
  </details>
</section>
`,
    hints: [
      '<summary> define o título clicável que abre e fecha o conteúdo.',
      '<p> dentro de <details> é o texto que se revela ao clique.',
    ],
    expectedConditionText: '<section> com pelo menos 2 tags <details> e <summary>',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Accordion FAQ Nativo',
      previewSnippet: '<div class="space-y-1 text-xs"><div class="p-1.5 bg-neutral-800 rounded font-semibold cursor-pointer">▶ Como funciona o suporte?</div></div>',
      successBadge: 'FAQ Interativo OK',
    },
    validate: (rawCode) => {
      const detailsCount = (rawCode.match(/<details\b[\s\S]*?<\/details>/gi) || []).length;
      const hasSummary = /<summary\b/i.test(rawCode);
      if (detailsCount >= 2 && hasSummary) {
        return {
          success: true,
          doorState: true,
          message: 'FAQ nativo com tags <details> e <summary> funcionando perfeitamente!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Crie pelo menos 2 blocos de <details> contendo a tag <summary>.',
      };
    },
  },
  {
    id: 19,
    title: 'Fase 19: Rodapé Semântico com Direitos e Links',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Crie um <footer> com copyright, links legais e tag <address>',
    puzzleDescription: 'O rodapé encerra a página com informações institucionais, dados de contato e direitos autorais.',
    initialCode: `<!-- Rodapé semântico profissional: -->
<footer class="site-footer">
  <div class="footer-links">
    <a href="/termos">Termos de Uso</a>
    <a href="/privacidade">Privacidade</a>
  </div>
  <address class="contato">
    São Paulo, Brasil • contato@meusite.com
  </address>
  <p class="copyright">&copy; 2026 MeuSite. Todos os direitos reservados.</p>
</footer>
`,
    hints: [
      '<address> é a tag semântica específica para informações de contato e localização.',
      '&copy; produz o caractere oficial de copyright ©.',
      'Mantenha as tags <footer>, <address> e os links <a>.',
    ],
    expectedConditionText: '<footer> com <address>, links e texto copyright',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Rodapé Institucional',
      previewSnippet: '<footer class="p-3 text-center text-[10px] text-neutral-400 border-t">© 2026 MeuSite • Termos & Privacidade</footer>',
      successBadge: 'Footer Semântico OK',
    },
    validate: (rawCode) => {
      const hasFooter = /<footer\b[\s\S]*<\/footer>/i.test(rawCode);
      const hasAddress = /<address\b[\s\S]*<\/address>/i.test(rawCode);
      const hasCopy = /(&copy;|©|direitos reservados)/i.test(rawCode);
      if (hasFooter && hasAddress && hasCopy) {
        return {
          success: true,
          doorState: true,
          message: 'Rodapé institucional semântico pronto para publicação!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Inclua <footer>, a tag <address> e a menção de direitos reservados.',
      };
    },
  },
  {
    id: 20,
    title: 'Fase 20: Estrutura Completa de Landing Page & SEO',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Monte o documento HTML5 completo com DOCTYPE, html lang="pt-BR", head, meta viewport e title',
    puzzleDescription: 'A estrutura primordial de todo website na internet. Sem ela, o Google não indexa e o design quebra no celular.',
    initialCode: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page Oficial - Meu Site</title>
</head>
<body>
  <header><h1>Meu Site Completo</h1></header>
  <main><p>Conteúdo de alto valor publicado!</p></main>
</body>
</html>
`,
    hints: [
      '<!DOCTYPE html> avisa o navegador para renderizar no modo padrão moderno do HTML5.',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0"> garante a responsividade em celulares.',
      '<title> define o nome na aba do navegador e nos resultados de busca.',
    ],
    expectedConditionText: '<!DOCTYPE html> com <html lang="pt-BR">, <head>, <meta charset>, <meta viewport>, <title> e <body>',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Documento Web HTML5 Completo',
      previewSnippet: '<div class="p-3 bg-neutral-900 border rounded text-xs"><span class="text-emerald-400">✓ DOCTYPE HTML5</span> • <span class="text-blue-400">SEO Meta Tags</span> • <span class="text-purple-400">Mobile Viewport</span></div>',
      successBadge: 'Mestre em Estrutura Web',
    },
    validate: (rawCode) => {
      const hasDoc = /<!DOCTYPE\s+html>/i.test(rawCode);
      const hasLang = /<html[^>]*lang\s*=\s*["']pt-BR["']/i.test(rawCode);
      const hasHead = /<head\b[\s\S]*<\/head>/i.test(rawCode);
      const hasViewport = /<meta[^>]*name\s*=\s*["']viewport["']/i.test(rawCode);
      const hasTitle = /<title\b[\s\S]*<\/title>/i.test(rawCode);
      const hasBody = /<body\b[\s\S]*<\/body>/i.test(rawCode);
      if (hasDoc && hasLang && hasHead && hasViewport && hasTitle && hasBody) {
        return {
          success: true,
          doorState: true,
          message: '🏆 PARABÉNS! Você dominou o HTML5 e agora é capaz de estruturar qualquer website profissional!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Monte o esqueleto HTML5 completo com <!DOCTYPE html>, <html lang="pt-BR">, <head>, <meta viewport>, <title> e <body>.',
      };
    },
  },
];

export const HTML_LEVELS: GameLevel[] = [...HTML_BASE_LEVELS, ...HTML_EXTRA_LEVELS];
