import { GameLevel } from './types';

export const HTML_EXTRA_LEVELS: GameLevel[] = [
  {
    id: 21,
    title: "Fase 21: Elemento <dialog> Nativo",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie um modal acessível nativo usando a tag <dialog>",
    puzzleDescription: "Modais acessíveis sem precisar de bibliotecas pesadas de terceiros. Neste desafio prático você irá dominar Elemento <dialog> Nativo aplicando código profissional.",
    initialCode: `<dialog id="modalAviso">
  <h2>Alerta do Sistema</h2>
  <p>Operação concluída com sucesso!</p>
  <button onclick="this.closest('dialog').close()">Fechar</button>
</dialog>`,
    hints: ["<dialog> é o componente nativo de modais do HTML5.","Possui suporte a foco automático e tecla ESC nativo.","Abra com dialog.showModal() e feche com dialog.close()."],
    expectedConditionText: "<dialog id=\"modalAviso\">...</dialog>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <dialog> Nativo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <dialog> Nativo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<dialog[\s\S]*<\/dialog>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <dialog id="modalAviso">...</dialog>',
      };
    },
  },
  {
    id: 22,
    title: "Fase 22: Elemento <picture> Responsivo",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Forneça formatos modernos (WebP/AVIF) com tag <picture>",
    puzzleDescription: "Redução de até 80% no peso de imagens melhorando velocidade e SEO. Neste desafio prático você irá dominar Elemento <picture> Responsivo aplicando código profissional.",
    initialCode: `<picture>
  <source srcset="banner.avif" type="image/avif">
  <source srcset="banner.webp" type="image/webp">
  <img src="banner.jpg" alt="Banner Principal ProgPlay" loading="lazy">
</picture>`,
    hints: ["<picture> escolhe o formato mais leve suportado pelo navegador.","Use <source srcset=\"...\" type=\"...\">.","Finalize com a tag <img> de fallback obrigatória."],
    expectedConditionText: "<picture> com <source> e <img>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <picture> Responsivo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <picture> Responsivo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<picture>[\s\S]*<source[\s\S]*<img/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <picture> com <source> e <img>',
      };
    },
  },
  {
    id: 23,
    title: "Fase 23: Validação de Formulários com Regex Pattern",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Valide código de cupom com atributo pattern no <input>",
    puzzleDescription: "Validação nativa instantânea na digitação sem gastar banda de rede. Neste desafio prático você irá dominar Validação de Formulários com Regex Pattern aplicando código profissional.",
    initialCode: `<form>
  <label for="cupom">Cupom:</label>
  <input type="text" id="cupom" name="cupom" pattern="[A-Z]{4}-[0-9]{4}" placeholder="ABCD-1234" required>
  <button type="submit">Aplicar</button>
</form>`,
    hints: ["O atributo pattern valida com regex antes do envio.","[A-Z]{4} exige 4 letras maiúsculas.","[0-9]{4} exige 4 números separados por traço."],
    expectedConditionText: "pattern=\"[A-Z]{4}-[0-9]{4}\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Validação de Formulários com Regex Pattern","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Validação de Formulários com Regex Pattern</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /pattern="\[A-Z\]\{4\}-\[0-9\]\{4\}"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: pattern="[A-Z]{4}-[0-9]{4}"',
      };
    },
  },
  {
    id: 24,
    title: "Fase 24: Lista de Sugestões com <datalist>",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Associe um campo de busca a uma lista com <datalist>",
    puzzleDescription: "Auto-complete amigável para formulários em desktop e smartphones. Neste desafio prático você irá dominar Lista de Sugestões com <datalist> aplicando código profissional.",
    initialCode: `<label for="linguagem">Escolha a linguagem:</label>
<input list="linguagens" id="linguagem" name="linguagem">
<datalist id="linguagens">
  <option value="JavaScript">
  <option value="Python">
  <option value="CSS">
  <option value="HTML">
  <option value="SQL">
</datalist>`,
    hints: ["O input aponta para o datalist pelo atributo list=\"id\".","O datalist contém as opções com tag <option value=\"...\">.","Funciona como um select pesquisável nativo."],
    expectedConditionText: "<datalist id=\"linguagens\"> com <option>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Lista de Sugestões com <datalist>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Lista de Sugestões com <datalist></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<datalist\s+id="linguagens">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <datalist id="linguagens"> com <option>',
      };
    },
  },
  {
    id: 25,
    title: "Fase 25: Elementos <details> e <summary>",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma seção retrátil (accordion) nativa",
    puzzleDescription: "Componentes de FAQ e acordions acessíveis e sem scripts. Neste desafio prático você irá dominar Elementos <details> e <summary> aplicando código profissional.",
    initialCode: `<details>
  <summary>O que é a ProgPlay?</summary>
  <p>A ProgPlay é uma plataforma gamificada para dominar programação através de desafios práticos!</p>
</details>`,
    hints: ["<details> expande e recolhe sem nenhum JavaScript.","<summary> define o título clicável visível.","Coloque o conteúdo explicativo abaixo do summary."],
    expectedConditionText: "<details><summary>...</summary>...</details>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elementos <details> e <summary>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elementos <details> e <summary></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<details>[\s\S]*<summary>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <details><summary>...</summary>...</details>',
      };
    },
  },
  {
    id: 26,
    title: "Fase 26: Metatags OpenGraph para Redes Sociais",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Configure cards sociais de compartilhamento com tags og:",
    puzzleDescription: "Aumenta cliques e atratividade visual em links compartilhados. Neste desafio prático você irá dominar Metatags OpenGraph para Redes Sociais aplicando código profissional.",
    initialCode: `<head>
  <meta property="og:title" content="ProgPlay - Aprenda Programando">
  <meta property="og:description" content="Plataforma gamificada com mais de 600 fases de programação.">
  <meta property="og:image" content="https://progplay.dev/og-cover.png">
</head>`,
    hints: ["OpenGraph gera os cards ao compartilhar links no WhatsApp e Twitter.","og:title define o título em destaque.","og:image especifica a imagem de capa."],
    expectedConditionText: "<meta property=\"og:title\" content=\"...\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Metatags OpenGraph para Redes Sociais","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Metatags OpenGraph para Redes Sociais</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<meta\s+property="og:title"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <meta property="og:title" content="...">',
      };
    },
  },
  {
    id: 27,
    title: "Fase 27: Dados Estruturados JSON-LD (Schema.org)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Insira metadados estruturados para o Google com <script type=\"application/ld+json\">",
    puzzleDescription: "Otimização máxima de SEO e indexação em mecanismos de busca. Neste desafio prático você irá dominar Dados Estruturados JSON-LD (Schema.org) aplicando código profissional.",
    initialCode: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Programação Web",
  "description": "Aprenda desenvolvimento web do zero ao profissional."
}
</script>`,
    hints: ["JSON-LD é o formato recomendado pelo Google para SEO rico.","Especifica tipo Course, Produto, Artigo ou Organização.","Permite que seu site apareça com estrelas e detalhes nas buscas."],
    expectedConditionText: "<script type=\"application/ld+json\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dados Estruturados JSON-LD (Schema.org)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dados Estruturados JSON-LD (Schema.org)</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /type="application\/ld\+json"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <script type="application/ld+json">',
      };
    },
  },
  {
    id: 28,
    title: "Fase 28: Acessibilidade: ARIA Live Regions",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie área de notificação anunciada por leitores de tela",
    puzzleDescription: "Acessibilidade (a11y) indispensável para conformidade WCAG e governos. Neste desafio prático você irá dominar Acessibilidade: ARIA Live Regions aplicando código profissional.",
    initialCode: `<div role="status" aria-live="polite" class="notificacao">
  Item salvo com sucesso!
</div>`,
    hints: ["aria-live avisa leitores de tela quando o conteúdo da div mudar.","polite espera o leitor terminar a frase antes de falar.","Garante inclusão para deficientes visuais."],
    expectedConditionText: "role=\"status\" aria-live=\"polite\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Acessibilidade: ARIA Live Regions","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Acessibilidade: ARIA Live Regions</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /aria-live="polite"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: role="status" aria-live="polite"',
      };
    },
  },
  {
    id: 29,
    title: "Fase 29: Web Components: <template> & <slot>",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Declare um modelo reutilizável que não é renderizado na carga inicial",
    puzzleDescription: "Reutilização de fragmentos de interface sem framework. Neste desafio prático você irá dominar Web Components: <template> & <slot> aplicando código profissional.",
    initialCode: `<template id="card-usuario">
  <div class="card">
    <h3><slot name="nome">Nome Padrão</slot></h3>
    <p><slot name="bio">Biografia</slot></p>
  </div>
</template>`,
    hints: ["<template> guarda HTML inativo para clonagem via JavaScript.","<slot> define pontos de injeção de conteúdo customizado.","Base dos Web Components nativos do navegador."],
    expectedConditionText: "<template id=\"card-usuario\"> com <slot>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Components: <template> & <slot>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Components: <template> & <slot></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<template\s+id="card-usuario">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <template id="card-usuario"> com <slot>',
      };
    },
  },
  {
    id: 30,
    title: "Fase 30: Controles de Mídia: <video> com <track>",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Adicione vídeo com legendas acessíveis usando a tag <track>",
    puzzleDescription: "Mídia profissional com legenda e suporte a acessibilidade auditiva. Neste desafio prático você irá dominar Controles de Mídia: <video> com <track> aplicando código profissional.",
    initialCode: `<video controls width="640">
  <source src="aula.mp4" type="video/mp4">
  <track src="legendas-pt.vtt" kind="subtitles" srclang="pt" label="Português">
  Seu navegador não suporta vídeos.
</video>`,
    hints: ["<track> vincula arquivos .vtt de legendas e audiodescrição.","kind=\"subtitles\" habilita legendas.","srclang=\"pt\" especifica o idioma português."],
    expectedConditionText: "<track src=\"...\" kind=\"subtitles\" srclang=\"pt\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Controles de Mídia: <video> com <track>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Controles de Mídia: <video> com <track></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<track[\s\S]*kind="subtitles"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <track src="..." kind="subtitles" srclang="pt">',
      };
    },
  },
  {
    id: 31,
    title: "Fase 31: Elemento <dialog> Nativo (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie um modal acessível nativo usando a tag <dialog> com rigor de produção",
    puzzleDescription: "Modais acessíveis sem precisar de bibliotecas pesadas de terceiros. Neste desafio prático você irá dominar Elemento <dialog> Nativo aplicando código profissional.",
    initialCode: `<dialog id="modalAviso">
  <h2>Alerta do Sistema</h2>
  <p>Operação concluída com sucesso!</p>
  <button onclick="this.closest('dialog').close()">Fechar</button>
</dialog>`,
    hints: ["<dialog> é o componente nativo de modais do HTML5.","Possui suporte a foco automático e tecla ESC nativo.","Abra com dialog.showModal() e feche com dialog.close()."],
    expectedConditionText: "<dialog id=\"modalAviso\">...</dialog>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <dialog> Nativo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <dialog> Nativo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<dialog[\s\S]*<\/dialog>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <dialog id="modalAviso">...</dialog>',
      };
    },
  },
  {
    id: 32,
    title: "Fase 32: Elemento <picture> Responsivo (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Forneça formatos modernos (WebP/AVIF) com tag <picture> com rigor de produção",
    puzzleDescription: "Redução de até 80% no peso de imagens melhorando velocidade e SEO. Neste desafio prático você irá dominar Elemento <picture> Responsivo aplicando código profissional.",
    initialCode: `<picture>
  <source srcset="banner.avif" type="image/avif">
  <source srcset="banner.webp" type="image/webp">
  <img src="banner.jpg" alt="Banner Principal ProgPlay" loading="lazy">
</picture>`,
    hints: ["<picture> escolhe o formato mais leve suportado pelo navegador.","Use <source srcset=\"...\" type=\"...\">.","Finalize com a tag <img> de fallback obrigatória."],
    expectedConditionText: "<picture> com <source> e <img>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <picture> Responsivo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <picture> Responsivo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<picture>[\s\S]*<source[\s\S]*<img/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <picture> com <source> e <img>',
      };
    },
  },
  {
    id: 33,
    title: "Fase 33: Validação de Formulários com Regex Pattern (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Valide código de cupom com atributo pattern no <input> com rigor de produção",
    puzzleDescription: "Validação nativa instantânea na digitação sem gastar banda de rede. Neste desafio prático você irá dominar Validação de Formulários com Regex Pattern aplicando código profissional.",
    initialCode: `<form>
  <label for="cupom">Cupom:</label>
  <input type="text" id="cupom" name="cupom" pattern="[A-Z]{4}-[0-9]{4}" placeholder="ABCD-1234" required>
  <button type="submit">Aplicar</button>
</form>`,
    hints: ["O atributo pattern valida com regex antes do envio.","[A-Z]{4} exige 4 letras maiúsculas.","[0-9]{4} exige 4 números separados por traço."],
    expectedConditionText: "pattern=\"[A-Z]{4}-[0-9]{4}\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Validação de Formulários com Regex Pattern","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Validação de Formulários com Regex Pattern</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /pattern="\[A-Z\]\{4\}-\[0-9\]\{4\}"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: pattern="[A-Z]{4}-[0-9]{4}"',
      };
    },
  },
  {
    id: 34,
    title: "Fase 34: Lista de Sugestões com <datalist> (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Associe um campo de busca a uma lista com <datalist> com rigor de produção",
    puzzleDescription: "Auto-complete amigável para formulários em desktop e smartphones. Neste desafio prático você irá dominar Lista de Sugestões com <datalist> aplicando código profissional.",
    initialCode: `<label for="linguagem">Escolha a linguagem:</label>
<input list="linguagens" id="linguagem" name="linguagem">
<datalist id="linguagens">
  <option value="JavaScript">
  <option value="Python">
  <option value="CSS">
  <option value="HTML">
  <option value="SQL">
</datalist>`,
    hints: ["O input aponta para o datalist pelo atributo list=\"id\".","O datalist contém as opções com tag <option value=\"...\">.","Funciona como um select pesquisável nativo."],
    expectedConditionText: "<datalist id=\"linguagens\"> com <option>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Lista de Sugestões com <datalist>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Lista de Sugestões com <datalist></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<datalist\s+id="linguagens">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <datalist id="linguagens"> com <option>',
      };
    },
  },
  {
    id: 35,
    title: "Fase 35: Elementos <details> e <summary> (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma seção retrátil (accordion) nativa com rigor de produção",
    puzzleDescription: "Componentes de FAQ e acordions acessíveis e sem scripts. Neste desafio prático você irá dominar Elementos <details> e <summary> aplicando código profissional.",
    initialCode: `<details>
  <summary>O que é a ProgPlay?</summary>
  <p>A ProgPlay é uma plataforma gamificada para dominar programação através de desafios práticos!</p>
</details>`,
    hints: ["<details> expande e recolhe sem nenhum JavaScript.","<summary> define o título clicável visível.","Coloque o conteúdo explicativo abaixo do summary."],
    expectedConditionText: "<details><summary>...</summary>...</details>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elementos <details> e <summary>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elementos <details> e <summary></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<details>[\s\S]*<summary>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <details><summary>...</summary>...</details>',
      };
    },
  },
  {
    id: 36,
    title: "Fase 36: Metatags OpenGraph para Redes Sociais (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Configure cards sociais de compartilhamento com tags og: com rigor de produção",
    puzzleDescription: "Aumenta cliques e atratividade visual em links compartilhados. Neste desafio prático você irá dominar Metatags OpenGraph para Redes Sociais aplicando código profissional.",
    initialCode: `<head>
  <meta property="og:title" content="ProgPlay - Aprenda Programando">
  <meta property="og:description" content="Plataforma gamificada com mais de 600 fases de programação.">
  <meta property="og:image" content="https://progplay.dev/og-cover.png">
</head>`,
    hints: ["OpenGraph gera os cards ao compartilhar links no WhatsApp e Twitter.","og:title define o título em destaque.","og:image especifica a imagem de capa."],
    expectedConditionText: "<meta property=\"og:title\" content=\"...\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Metatags OpenGraph para Redes Sociais","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Metatags OpenGraph para Redes Sociais</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<meta\s+property="og:title"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <meta property="og:title" content="...">',
      };
    },
  },
  {
    id: 37,
    title: "Fase 37: Dados Estruturados JSON-LD (Schema.org) (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Insira metadados estruturados para o Google com <script type=\"application/ld+json\"> com rigor de produção",
    puzzleDescription: "Otimização máxima de SEO e indexação em mecanismos de busca. Neste desafio prático você irá dominar Dados Estruturados JSON-LD (Schema.org) aplicando código profissional.",
    initialCode: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Programação Web",
  "description": "Aprenda desenvolvimento web do zero ao profissional."
}
</script>`,
    hints: ["JSON-LD é o formato recomendado pelo Google para SEO rico.","Especifica tipo Course, Produto, Artigo ou Organização.","Permite que seu site apareça com estrelas e detalhes nas buscas."],
    expectedConditionText: "<script type=\"application/ld+json\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dados Estruturados JSON-LD (Schema.org)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dados Estruturados JSON-LD (Schema.org)</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /type="application\/ld\+json"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <script type="application/ld+json">',
      };
    },
  },
  {
    id: 38,
    title: "Fase 38: Acessibilidade: ARIA Live Regions (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie área de notificação anunciada por leitores de tela com rigor de produção",
    puzzleDescription: "Acessibilidade (a11y) indispensável para conformidade WCAG e governos. Neste desafio prático você irá dominar Acessibilidade: ARIA Live Regions aplicando código profissional.",
    initialCode: `<div role="status" aria-live="polite" class="notificacao">
  Item salvo com sucesso!
</div>`,
    hints: ["aria-live avisa leitores de tela quando o conteúdo da div mudar.","polite espera o leitor terminar a frase antes de falar.","Garante inclusão para deficientes visuais."],
    expectedConditionText: "role=\"status\" aria-live=\"polite\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Acessibilidade: ARIA Live Regions","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Acessibilidade: ARIA Live Regions</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /aria-live="polite"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: role="status" aria-live="polite"',
      };
    },
  },
  {
    id: 39,
    title: "Fase 39: Web Components: <template> & <slot> (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Declare um modelo reutilizável que não é renderizado na carga inicial com rigor de produção",
    puzzleDescription: "Reutilização de fragmentos de interface sem framework. Neste desafio prático você irá dominar Web Components: <template> & <slot> aplicando código profissional.",
    initialCode: `<template id="card-usuario">
  <div class="card">
    <h3><slot name="nome">Nome Padrão</slot></h3>
    <p><slot name="bio">Biografia</slot></p>
  </div>
</template>`,
    hints: ["<template> guarda HTML inativo para clonagem via JavaScript.","<slot> define pontos de injeção de conteúdo customizado.","Base dos Web Components nativos do navegador."],
    expectedConditionText: "<template id=\"card-usuario\"> com <slot>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Components: <template> & <slot>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Components: <template> & <slot></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<template\s+id="card-usuario">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <template id="card-usuario"> com <slot>',
      };
    },
  },
  {
    id: 40,
    title: "Fase 40: Controles de Mídia: <video> com <track> (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Adicione vídeo com legendas acessíveis usando a tag <track> com rigor de produção",
    puzzleDescription: "Mídia profissional com legenda e suporte a acessibilidade auditiva. Neste desafio prático você irá dominar Controles de Mídia: <video> com <track> aplicando código profissional.",
    initialCode: `<video controls width="640">
  <source src="aula.mp4" type="video/mp4">
  <track src="legendas-pt.vtt" kind="subtitles" srclang="pt" label="Português">
  Seu navegador não suporta vídeos.
</video>`,
    hints: ["<track> vincula arquivos .vtt de legendas e audiodescrição.","kind=\"subtitles\" habilita legendas.","srclang=\"pt\" especifica o idioma português."],
    expectedConditionText: "<track src=\"...\" kind=\"subtitles\" srclang=\"pt\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Controles de Mídia: <video> com <track>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Controles de Mídia: <video> com <track></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<track[\s\S]*kind="subtitles"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <track src="..." kind="subtitles" srclang="pt">',
      };
    },
  },
  {
    id: 41,
    title: "Fase 41: Elemento <dialog> Nativo (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie um modal acessível nativo usando a tag <dialog> com rigor de produção",
    puzzleDescription: "Modais acessíveis sem precisar de bibliotecas pesadas de terceiros. Neste desafio prático você irá dominar Elemento <dialog> Nativo aplicando código profissional.",
    initialCode: `<dialog id="modalAviso">
  <h2>Alerta do Sistema</h2>
  <p>Operação concluída com sucesso!</p>
  <button onclick="this.closest('dialog').close()">Fechar</button>
</dialog>`,
    hints: ["<dialog> é o componente nativo de modais do HTML5.","Possui suporte a foco automático e tecla ESC nativo.","Abra com dialog.showModal() e feche com dialog.close()."],
    expectedConditionText: "<dialog id=\"modalAviso\">...</dialog>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <dialog> Nativo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <dialog> Nativo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<dialog[\s\S]*<\/dialog>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <dialog id="modalAviso">...</dialog>',
      };
    },
  },
  {
    id: 42,
    title: "Fase 42: Elemento <picture> Responsivo (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Forneça formatos modernos (WebP/AVIF) com tag <picture> com rigor de produção",
    puzzleDescription: "Redução de até 80% no peso de imagens melhorando velocidade e SEO. Neste desafio prático você irá dominar Elemento <picture> Responsivo aplicando código profissional.",
    initialCode: `<picture>
  <source srcset="banner.avif" type="image/avif">
  <source srcset="banner.webp" type="image/webp">
  <img src="banner.jpg" alt="Banner Principal ProgPlay" loading="lazy">
</picture>`,
    hints: ["<picture> escolhe o formato mais leve suportado pelo navegador.","Use <source srcset=\"...\" type=\"...\">.","Finalize com a tag <img> de fallback obrigatória."],
    expectedConditionText: "<picture> com <source> e <img>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <picture> Responsivo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <picture> Responsivo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<picture>[\s\S]*<source[\s\S]*<img/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <picture> com <source> e <img>',
      };
    },
  },
  {
    id: 43,
    title: "Fase 43: Validação de Formulários com Regex Pattern (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Valide código de cupom com atributo pattern no <input> com rigor de produção",
    puzzleDescription: "Validação nativa instantânea na digitação sem gastar banda de rede. Neste desafio prático você irá dominar Validação de Formulários com Regex Pattern aplicando código profissional.",
    initialCode: `<form>
  <label for="cupom">Cupom:</label>
  <input type="text" id="cupom" name="cupom" pattern="[A-Z]{4}-[0-9]{4}" placeholder="ABCD-1234" required>
  <button type="submit">Aplicar</button>
</form>`,
    hints: ["O atributo pattern valida com regex antes do envio.","[A-Z]{4} exige 4 letras maiúsculas.","[0-9]{4} exige 4 números separados por traço."],
    expectedConditionText: "pattern=\"[A-Z]{4}-[0-9]{4}\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Validação de Formulários com Regex Pattern","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Validação de Formulários com Regex Pattern</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /pattern="\[A-Z\]\{4\}-\[0-9\]\{4\}"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: pattern="[A-Z]{4}-[0-9]{4}"',
      };
    },
  },
  {
    id: 44,
    title: "Fase 44: Lista de Sugestões com <datalist> (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Associe um campo de busca a uma lista com <datalist> com rigor de produção",
    puzzleDescription: "Auto-complete amigável para formulários em desktop e smartphones. Neste desafio prático você irá dominar Lista de Sugestões com <datalist> aplicando código profissional.",
    initialCode: `<label for="linguagem">Escolha a linguagem:</label>
<input list="linguagens" id="linguagem" name="linguagem">
<datalist id="linguagens">
  <option value="JavaScript">
  <option value="Python">
  <option value="CSS">
  <option value="HTML">
  <option value="SQL">
</datalist>`,
    hints: ["O input aponta para o datalist pelo atributo list=\"id\".","O datalist contém as opções com tag <option value=\"...\">.","Funciona como um select pesquisável nativo."],
    expectedConditionText: "<datalist id=\"linguagens\"> com <option>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Lista de Sugestões com <datalist>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Lista de Sugestões com <datalist></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<datalist\s+id="linguagens">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <datalist id="linguagens"> com <option>',
      };
    },
  },
  {
    id: 45,
    title: "Fase 45: Elementos <details> e <summary> (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma seção retrátil (accordion) nativa com rigor de produção",
    puzzleDescription: "Componentes de FAQ e acordions acessíveis e sem scripts. Neste desafio prático você irá dominar Elementos <details> e <summary> aplicando código profissional.",
    initialCode: `<details>
  <summary>O que é a ProgPlay?</summary>
  <p>A ProgPlay é uma plataforma gamificada para dominar programação através de desafios práticos!</p>
</details>`,
    hints: ["<details> expande e recolhe sem nenhum JavaScript.","<summary> define o título clicável visível.","Coloque o conteúdo explicativo abaixo do summary."],
    expectedConditionText: "<details><summary>...</summary>...</details>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elementos <details> e <summary>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elementos <details> e <summary></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<details>[\s\S]*<summary>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <details><summary>...</summary>...</details>',
      };
    },
  },
  {
    id: 46,
    title: "Fase 46: Metatags OpenGraph para Redes Sociais (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Configure cards sociais de compartilhamento com tags og: com rigor de produção",
    puzzleDescription: "Aumenta cliques e atratividade visual em links compartilhados. Neste desafio prático você irá dominar Metatags OpenGraph para Redes Sociais aplicando código profissional.",
    initialCode: `<head>
  <meta property="og:title" content="ProgPlay - Aprenda Programando">
  <meta property="og:description" content="Plataforma gamificada com mais de 600 fases de programação.">
  <meta property="og:image" content="https://progplay.dev/og-cover.png">
</head>`,
    hints: ["OpenGraph gera os cards ao compartilhar links no WhatsApp e Twitter.","og:title define o título em destaque.","og:image especifica a imagem de capa."],
    expectedConditionText: "<meta property=\"og:title\" content=\"...\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Metatags OpenGraph para Redes Sociais","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Metatags OpenGraph para Redes Sociais</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<meta\s+property="og:title"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <meta property="og:title" content="...">',
      };
    },
  },
  {
    id: 47,
    title: "Fase 47: Dados Estruturados JSON-LD (Schema.org) (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Insira metadados estruturados para o Google com <script type=\"application/ld+json\"> com rigor de produção",
    puzzleDescription: "Otimização máxima de SEO e indexação em mecanismos de busca. Neste desafio prático você irá dominar Dados Estruturados JSON-LD (Schema.org) aplicando código profissional.",
    initialCode: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Programação Web",
  "description": "Aprenda desenvolvimento web do zero ao profissional."
}
</script>`,
    hints: ["JSON-LD é o formato recomendado pelo Google para SEO rico.","Especifica tipo Course, Produto, Artigo ou Organização.","Permite que seu site apareça com estrelas e detalhes nas buscas."],
    expectedConditionText: "<script type=\"application/ld+json\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dados Estruturados JSON-LD (Schema.org)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dados Estruturados JSON-LD (Schema.org)</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /type="application\/ld\+json"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <script type="application/ld+json">',
      };
    },
  },
  {
    id: 48,
    title: "Fase 48: Acessibilidade: ARIA Live Regions (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie área de notificação anunciada por leitores de tela com rigor de produção",
    puzzleDescription: "Acessibilidade (a11y) indispensável para conformidade WCAG e governos. Neste desafio prático você irá dominar Acessibilidade: ARIA Live Regions aplicando código profissional.",
    initialCode: `<div role="status" aria-live="polite" class="notificacao">
  Item salvo com sucesso!
</div>`,
    hints: ["aria-live avisa leitores de tela quando o conteúdo da div mudar.","polite espera o leitor terminar a frase antes de falar.","Garante inclusão para deficientes visuais."],
    expectedConditionText: "role=\"status\" aria-live=\"polite\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Acessibilidade: ARIA Live Regions","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Acessibilidade: ARIA Live Regions</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /aria-live="polite"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: role="status" aria-live="polite"',
      };
    },
  },
  {
    id: 49,
    title: "Fase 49: Web Components: <template> & <slot> (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Declare um modelo reutilizável que não é renderizado na carga inicial com rigor de produção",
    puzzleDescription: "Reutilização de fragmentos de interface sem framework. Neste desafio prático você irá dominar Web Components: <template> & <slot> aplicando código profissional.",
    initialCode: `<template id="card-usuario">
  <div class="card">
    <h3><slot name="nome">Nome Padrão</slot></h3>
    <p><slot name="bio">Biografia</slot></p>
  </div>
</template>`,
    hints: ["<template> guarda HTML inativo para clonagem via JavaScript.","<slot> define pontos de injeção de conteúdo customizado.","Base dos Web Components nativos do navegador."],
    expectedConditionText: "<template id=\"card-usuario\"> com <slot>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Components: <template> & <slot>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Components: <template> & <slot></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<template\s+id="card-usuario">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <template id="card-usuario"> com <slot>',
      };
    },
  },
  {
    id: 50,
    title: "Fase 50: Controles de Mídia: <video> com <track> (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Adicione vídeo com legendas acessíveis usando a tag <track> com rigor de produção",
    puzzleDescription: "Mídia profissional com legenda e suporte a acessibilidade auditiva. Neste desafio prático você irá dominar Controles de Mídia: <video> com <track> aplicando código profissional.",
    initialCode: `<video controls width="640">
  <source src="aula.mp4" type="video/mp4">
  <track src="legendas-pt.vtt" kind="subtitles" srclang="pt" label="Português">
  Seu navegador não suporta vídeos.
</video>`,
    hints: ["<track> vincula arquivos .vtt de legendas e audiodescrição.","kind=\"subtitles\" habilita legendas.","srclang=\"pt\" especifica o idioma português."],
    expectedConditionText: "<track src=\"...\" kind=\"subtitles\" srclang=\"pt\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Controles de Mídia: <video> com <track>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Controles de Mídia: <video> com <track></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<track[\s\S]*kind="subtitles"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <track src="..." kind="subtitles" srclang="pt">',
      };
    },
  },
  {
    id: 51,
    title: "Fase 51: Elemento <dialog> Nativo (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie um modal acessível nativo usando a tag <dialog> com rigor de produção",
    puzzleDescription: "Modais acessíveis sem precisar de bibliotecas pesadas de terceiros. Neste desafio prático você irá dominar Elemento <dialog> Nativo aplicando código profissional.",
    initialCode: `<dialog id="modalAviso">
  <h2>Alerta do Sistema</h2>
  <p>Operação concluída com sucesso!</p>
  <button onclick="this.closest('dialog').close()">Fechar</button>
</dialog>`,
    hints: ["<dialog> é o componente nativo de modais do HTML5.","Possui suporte a foco automático e tecla ESC nativo.","Abra com dialog.showModal() e feche com dialog.close()."],
    expectedConditionText: "<dialog id=\"modalAviso\">...</dialog>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <dialog> Nativo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <dialog> Nativo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<dialog[\s\S]*<\/dialog>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <dialog id="modalAviso">...</dialog>',
      };
    },
  },
  {
    id: 52,
    title: "Fase 52: Elemento <picture> Responsivo (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Forneça formatos modernos (WebP/AVIF) com tag <picture> com rigor de produção",
    puzzleDescription: "Redução de até 80% no peso de imagens melhorando velocidade e SEO. Neste desafio prático você irá dominar Elemento <picture> Responsivo aplicando código profissional.",
    initialCode: `<picture>
  <source srcset="banner.avif" type="image/avif">
  <source srcset="banner.webp" type="image/webp">
  <img src="banner.jpg" alt="Banner Principal ProgPlay" loading="lazy">
</picture>`,
    hints: ["<picture> escolhe o formato mais leve suportado pelo navegador.","Use <source srcset=\"...\" type=\"...\">.","Finalize com a tag <img> de fallback obrigatória."],
    expectedConditionText: "<picture> com <source> e <img>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <picture> Responsivo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <picture> Responsivo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<picture>[\s\S]*<source[\s\S]*<img/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <picture> com <source> e <img>',
      };
    },
  },
  {
    id: 53,
    title: "Fase 53: Validação de Formulários com Regex Pattern (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Valide código de cupom com atributo pattern no <input> com rigor de produção",
    puzzleDescription: "Validação nativa instantânea na digitação sem gastar banda de rede. Neste desafio prático você irá dominar Validação de Formulários com Regex Pattern aplicando código profissional.",
    initialCode: `<form>
  <label for="cupom">Cupom:</label>
  <input type="text" id="cupom" name="cupom" pattern="[A-Z]{4}-[0-9]{4}" placeholder="ABCD-1234" required>
  <button type="submit">Aplicar</button>
</form>`,
    hints: ["O atributo pattern valida com regex antes do envio.","[A-Z]{4} exige 4 letras maiúsculas.","[0-9]{4} exige 4 números separados por traço."],
    expectedConditionText: "pattern=\"[A-Z]{4}-[0-9]{4}\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Validação de Formulários com Regex Pattern","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Validação de Formulários com Regex Pattern</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /pattern="\[A-Z\]\{4\}-\[0-9\]\{4\}"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: pattern="[A-Z]{4}-[0-9]{4}"',
      };
    },
  },
  {
    id: 54,
    title: "Fase 54: Lista de Sugestões com <datalist> (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Associe um campo de busca a uma lista com <datalist> com rigor de produção",
    puzzleDescription: "Auto-complete amigável para formulários em desktop e smartphones. Neste desafio prático você irá dominar Lista de Sugestões com <datalist> aplicando código profissional.",
    initialCode: `<label for="linguagem">Escolha a linguagem:</label>
<input list="linguagens" id="linguagem" name="linguagem">
<datalist id="linguagens">
  <option value="JavaScript">
  <option value="Python">
  <option value="CSS">
  <option value="HTML">
  <option value="SQL">
</datalist>`,
    hints: ["O input aponta para o datalist pelo atributo list=\"id\".","O datalist contém as opções com tag <option value=\"...\">.","Funciona como um select pesquisável nativo."],
    expectedConditionText: "<datalist id=\"linguagens\"> com <option>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Lista de Sugestões com <datalist>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Lista de Sugestões com <datalist></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<datalist\s+id="linguagens">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <datalist id="linguagens"> com <option>',
      };
    },
  },
  {
    id: 55,
    title: "Fase 55: Elementos <details> e <summary> (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma seção retrátil (accordion) nativa com rigor de produção",
    puzzleDescription: "Componentes de FAQ e acordions acessíveis e sem scripts. Neste desafio prático você irá dominar Elementos <details> e <summary> aplicando código profissional.",
    initialCode: `<details>
  <summary>O que é a ProgPlay?</summary>
  <p>A ProgPlay é uma plataforma gamificada para dominar programação através de desafios práticos!</p>
</details>`,
    hints: ["<details> expande e recolhe sem nenhum JavaScript.","<summary> define o título clicável visível.","Coloque o conteúdo explicativo abaixo do summary."],
    expectedConditionText: "<details><summary>...</summary>...</details>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elementos <details> e <summary>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elementos <details> e <summary></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<details>[\s\S]*<summary>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <details><summary>...</summary>...</details>',
      };
    },
  },
  {
    id: 56,
    title: "Fase 56: Metatags OpenGraph para Redes Sociais (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Configure cards sociais de compartilhamento com tags og: com rigor de produção",
    puzzleDescription: "Aumenta cliques e atratividade visual em links compartilhados. Neste desafio prático você irá dominar Metatags OpenGraph para Redes Sociais aplicando código profissional.",
    initialCode: `<head>
  <meta property="og:title" content="ProgPlay - Aprenda Programando">
  <meta property="og:description" content="Plataforma gamificada com mais de 600 fases de programação.">
  <meta property="og:image" content="https://progplay.dev/og-cover.png">
</head>`,
    hints: ["OpenGraph gera os cards ao compartilhar links no WhatsApp e Twitter.","og:title define o título em destaque.","og:image especifica a imagem de capa."],
    expectedConditionText: "<meta property=\"og:title\" content=\"...\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Metatags OpenGraph para Redes Sociais","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Metatags OpenGraph para Redes Sociais</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<meta\s+property="og:title"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <meta property="og:title" content="...">',
      };
    },
  },
  {
    id: 57,
    title: "Fase 57: Dados Estruturados JSON-LD (Schema.org) (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Insira metadados estruturados para o Google com <script type=\"application/ld+json\"> com rigor de produção",
    puzzleDescription: "Otimização máxima de SEO e indexação em mecanismos de busca. Neste desafio prático você irá dominar Dados Estruturados JSON-LD (Schema.org) aplicando código profissional.",
    initialCode: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Programação Web",
  "description": "Aprenda desenvolvimento web do zero ao profissional."
}
</script>`,
    hints: ["JSON-LD é o formato recomendado pelo Google para SEO rico.","Especifica tipo Course, Produto, Artigo ou Organização.","Permite que seu site apareça com estrelas e detalhes nas buscas."],
    expectedConditionText: "<script type=\"application/ld+json\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dados Estruturados JSON-LD (Schema.org)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dados Estruturados JSON-LD (Schema.org)</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /type="application\/ld\+json"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <script type="application/ld+json">',
      };
    },
  },
  {
    id: 58,
    title: "Fase 58: Acessibilidade: ARIA Live Regions (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie área de notificação anunciada por leitores de tela com rigor de produção",
    puzzleDescription: "Acessibilidade (a11y) indispensável para conformidade WCAG e governos. Neste desafio prático você irá dominar Acessibilidade: ARIA Live Regions aplicando código profissional.",
    initialCode: `<div role="status" aria-live="polite" class="notificacao">
  Item salvo com sucesso!
</div>`,
    hints: ["aria-live avisa leitores de tela quando o conteúdo da div mudar.","polite espera o leitor terminar a frase antes de falar.","Garante inclusão para deficientes visuais."],
    expectedConditionText: "role=\"status\" aria-live=\"polite\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Acessibilidade: ARIA Live Regions","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Acessibilidade: ARIA Live Regions</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /aria-live="polite"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: role="status" aria-live="polite"',
      };
    },
  },
  {
    id: 59,
    title: "Fase 59: Web Components: <template> & <slot> (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Declare um modelo reutilizável que não é renderizado na carga inicial com rigor de produção",
    puzzleDescription: "Reutilização de fragmentos de interface sem framework. Neste desafio prático você irá dominar Web Components: <template> & <slot> aplicando código profissional.",
    initialCode: `<template id="card-usuario">
  <div class="card">
    <h3><slot name="nome">Nome Padrão</slot></h3>
    <p><slot name="bio">Biografia</slot></p>
  </div>
</template>`,
    hints: ["<template> guarda HTML inativo para clonagem via JavaScript.","<slot> define pontos de injeção de conteúdo customizado.","Base dos Web Components nativos do navegador."],
    expectedConditionText: "<template id=\"card-usuario\"> com <slot>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Components: <template> & <slot>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Components: <template> & <slot></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<template\s+id="card-usuario">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <template id="card-usuario"> com <slot>',
      };
    },
  },
  {
    id: 60,
    title: "Fase 60: Controles de Mídia: <video> com <track> (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Adicione vídeo com legendas acessíveis usando a tag <track> com rigor de produção",
    puzzleDescription: "Mídia profissional com legenda e suporte a acessibilidade auditiva. Neste desafio prático você irá dominar Controles de Mídia: <video> com <track> aplicando código profissional.",
    initialCode: `<video controls width="640">
  <source src="aula.mp4" type="video/mp4">
  <track src="legendas-pt.vtt" kind="subtitles" srclang="pt" label="Português">
  Seu navegador não suporta vídeos.
</video>`,
    hints: ["<track> vincula arquivos .vtt de legendas e audiodescrição.","kind=\"subtitles\" habilita legendas.","srclang=\"pt\" especifica o idioma português."],
    expectedConditionText: "<track src=\"...\" kind=\"subtitles\" srclang=\"pt\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Controles de Mídia: <video> com <track>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Controles de Mídia: <video> com <track></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<track[\s\S]*kind="subtitles"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <track src="..." kind="subtitles" srclang="pt">',
      };
    },
  },
  {
    id: 61,
    title: "Fase 61: Elemento <dialog> Nativo (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie um modal acessível nativo usando a tag <dialog> com rigor de produção",
    puzzleDescription: "Modais acessíveis sem precisar de bibliotecas pesadas de terceiros. Neste desafio prático você irá dominar Elemento <dialog> Nativo aplicando código profissional.",
    initialCode: `<dialog id="modalAviso">
  <h2>Alerta do Sistema</h2>
  <p>Operação concluída com sucesso!</p>
  <button onclick="this.closest('dialog').close()">Fechar</button>
</dialog>`,
    hints: ["<dialog> é o componente nativo de modais do HTML5.","Possui suporte a foco automático e tecla ESC nativo.","Abra com dialog.showModal() e feche com dialog.close()."],
    expectedConditionText: "<dialog id=\"modalAviso\">...</dialog>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <dialog> Nativo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <dialog> Nativo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<dialog[\s\S]*<\/dialog>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <dialog id="modalAviso">...</dialog>',
      };
    },
  },
  {
    id: 62,
    title: "Fase 62: Elemento <picture> Responsivo (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Forneça formatos modernos (WebP/AVIF) com tag <picture> com rigor de produção",
    puzzleDescription: "Redução de até 80% no peso de imagens melhorando velocidade e SEO. Neste desafio prático você irá dominar Elemento <picture> Responsivo aplicando código profissional.",
    initialCode: `<picture>
  <source srcset="banner.avif" type="image/avif">
  <source srcset="banner.webp" type="image/webp">
  <img src="banner.jpg" alt="Banner Principal ProgPlay" loading="lazy">
</picture>`,
    hints: ["<picture> escolhe o formato mais leve suportado pelo navegador.","Use <source srcset=\"...\" type=\"...\">.","Finalize com a tag <img> de fallback obrigatória."],
    expectedConditionText: "<picture> com <source> e <img>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <picture> Responsivo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <picture> Responsivo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<picture>[\s\S]*<source[\s\S]*<img/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <picture> com <source> e <img>',
      };
    },
  },
  {
    id: 63,
    title: "Fase 63: Validação de Formulários com Regex Pattern (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Valide código de cupom com atributo pattern no <input> com rigor de produção",
    puzzleDescription: "Validação nativa instantânea na digitação sem gastar banda de rede. Neste desafio prático você irá dominar Validação de Formulários com Regex Pattern aplicando código profissional.",
    initialCode: `<form>
  <label for="cupom">Cupom:</label>
  <input type="text" id="cupom" name="cupom" pattern="[A-Z]{4}-[0-9]{4}" placeholder="ABCD-1234" required>
  <button type="submit">Aplicar</button>
</form>`,
    hints: ["O atributo pattern valida com regex antes do envio.","[A-Z]{4} exige 4 letras maiúsculas.","[0-9]{4} exige 4 números separados por traço."],
    expectedConditionText: "pattern=\"[A-Z]{4}-[0-9]{4}\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Validação de Formulários com Regex Pattern","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Validação de Formulários com Regex Pattern</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /pattern="\[A-Z\]\{4\}-\[0-9\]\{4\}"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: pattern="[A-Z]{4}-[0-9]{4}"',
      };
    },
  },
  {
    id: 64,
    title: "Fase 64: Lista de Sugestões com <datalist> (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Associe um campo de busca a uma lista com <datalist> com rigor de produção",
    puzzleDescription: "Auto-complete amigável para formulários em desktop e smartphones. Neste desafio prático você irá dominar Lista de Sugestões com <datalist> aplicando código profissional.",
    initialCode: `<label for="linguagem">Escolha a linguagem:</label>
<input list="linguagens" id="linguagem" name="linguagem">
<datalist id="linguagens">
  <option value="JavaScript">
  <option value="Python">
  <option value="CSS">
  <option value="HTML">
  <option value="SQL">
</datalist>`,
    hints: ["O input aponta para o datalist pelo atributo list=\"id\".","O datalist contém as opções com tag <option value=\"...\">.","Funciona como um select pesquisável nativo."],
    expectedConditionText: "<datalist id=\"linguagens\"> com <option>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Lista de Sugestões com <datalist>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Lista de Sugestões com <datalist></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<datalist\s+id="linguagens">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <datalist id="linguagens"> com <option>',
      };
    },
  },
  {
    id: 65,
    title: "Fase 65: Elementos <details> e <summary> (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma seção retrátil (accordion) nativa com rigor de produção",
    puzzleDescription: "Componentes de FAQ e acordions acessíveis e sem scripts. Neste desafio prático você irá dominar Elementos <details> e <summary> aplicando código profissional.",
    initialCode: `<details>
  <summary>O que é a ProgPlay?</summary>
  <p>A ProgPlay é uma plataforma gamificada para dominar programação através de desafios práticos!</p>
</details>`,
    hints: ["<details> expande e recolhe sem nenhum JavaScript.","<summary> define o título clicável visível.","Coloque o conteúdo explicativo abaixo do summary."],
    expectedConditionText: "<details><summary>...</summary>...</details>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elementos <details> e <summary>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elementos <details> e <summary></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<details>[\s\S]*<summary>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <details><summary>...</summary>...</details>',
      };
    },
  },
  {
    id: 66,
    title: "Fase 66: Metatags OpenGraph para Redes Sociais (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Configure cards sociais de compartilhamento com tags og: com rigor de produção",
    puzzleDescription: "Aumenta cliques e atratividade visual em links compartilhados. Neste desafio prático você irá dominar Metatags OpenGraph para Redes Sociais aplicando código profissional.",
    initialCode: `<head>
  <meta property="og:title" content="ProgPlay - Aprenda Programando">
  <meta property="og:description" content="Plataforma gamificada com mais de 600 fases de programação.">
  <meta property="og:image" content="https://progplay.dev/og-cover.png">
</head>`,
    hints: ["OpenGraph gera os cards ao compartilhar links no WhatsApp e Twitter.","og:title define o título em destaque.","og:image especifica a imagem de capa."],
    expectedConditionText: "<meta property=\"og:title\" content=\"...\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Metatags OpenGraph para Redes Sociais","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Metatags OpenGraph para Redes Sociais</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<meta\s+property="og:title"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <meta property="og:title" content="...">',
      };
    },
  },
  {
    id: 67,
    title: "Fase 67: Dados Estruturados JSON-LD (Schema.org) (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Insira metadados estruturados para o Google com <script type=\"application/ld+json\"> com rigor de produção",
    puzzleDescription: "Otimização máxima de SEO e indexação em mecanismos de busca. Neste desafio prático você irá dominar Dados Estruturados JSON-LD (Schema.org) aplicando código profissional.",
    initialCode: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Programação Web",
  "description": "Aprenda desenvolvimento web do zero ao profissional."
}
</script>`,
    hints: ["JSON-LD é o formato recomendado pelo Google para SEO rico.","Especifica tipo Course, Produto, Artigo ou Organização.","Permite que seu site apareça com estrelas e detalhes nas buscas."],
    expectedConditionText: "<script type=\"application/ld+json\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dados Estruturados JSON-LD (Schema.org)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dados Estruturados JSON-LD (Schema.org)</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /type="application\/ld\+json"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <script type="application/ld+json">',
      };
    },
  },
  {
    id: 68,
    title: "Fase 68: Acessibilidade: ARIA Live Regions (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie área de notificação anunciada por leitores de tela com rigor de produção",
    puzzleDescription: "Acessibilidade (a11y) indispensável para conformidade WCAG e governos. Neste desafio prático você irá dominar Acessibilidade: ARIA Live Regions aplicando código profissional.",
    initialCode: `<div role="status" aria-live="polite" class="notificacao">
  Item salvo com sucesso!
</div>`,
    hints: ["aria-live avisa leitores de tela quando o conteúdo da div mudar.","polite espera o leitor terminar a frase antes de falar.","Garante inclusão para deficientes visuais."],
    expectedConditionText: "role=\"status\" aria-live=\"polite\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Acessibilidade: ARIA Live Regions","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Acessibilidade: ARIA Live Regions</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /aria-live="polite"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: role="status" aria-live="polite"',
      };
    },
  },
  {
    id: 69,
    title: "Fase 69: Web Components: <template> & <slot> (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Declare um modelo reutilizável que não é renderizado na carga inicial com rigor de produção",
    puzzleDescription: "Reutilização de fragmentos de interface sem framework. Neste desafio prático você irá dominar Web Components: <template> & <slot> aplicando código profissional.",
    initialCode: `<template id="card-usuario">
  <div class="card">
    <h3><slot name="nome">Nome Padrão</slot></h3>
    <p><slot name="bio">Biografia</slot></p>
  </div>
</template>`,
    hints: ["<template> guarda HTML inativo para clonagem via JavaScript.","<slot> define pontos de injeção de conteúdo customizado.","Base dos Web Components nativos do navegador."],
    expectedConditionText: "<template id=\"card-usuario\"> com <slot>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Components: <template> & <slot>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Components: <template> & <slot></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<template\s+id="card-usuario">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <template id="card-usuario"> com <slot>',
      };
    },
  },
  {
    id: 70,
    title: "Fase 70: Controles de Mídia: <video> com <track> (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Adicione vídeo com legendas acessíveis usando a tag <track> com rigor de produção",
    puzzleDescription: "Mídia profissional com legenda e suporte a acessibilidade auditiva. Neste desafio prático você irá dominar Controles de Mídia: <video> com <track> aplicando código profissional.",
    initialCode: `<video controls width="640">
  <source src="aula.mp4" type="video/mp4">
  <track src="legendas-pt.vtt" kind="subtitles" srclang="pt" label="Português">
  Seu navegador não suporta vídeos.
</video>`,
    hints: ["<track> vincula arquivos .vtt de legendas e audiodescrição.","kind=\"subtitles\" habilita legendas.","srclang=\"pt\" especifica o idioma português."],
    expectedConditionText: "<track src=\"...\" kind=\"subtitles\" srclang=\"pt\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Controles de Mídia: <video> com <track>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Controles de Mídia: <video> com <track></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<track[\s\S]*kind="subtitles"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <track src="..." kind="subtitles" srclang="pt">',
      };
    },
  },
  {
    id: 71,
    title: "Fase 71: Elemento <dialog> Nativo (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie um modal acessível nativo usando a tag <dialog> com rigor de produção",
    puzzleDescription: "Modais acessíveis sem precisar de bibliotecas pesadas de terceiros. Neste desafio prático você irá dominar Elemento <dialog> Nativo aplicando código profissional.",
    initialCode: `<dialog id="modalAviso">
  <h2>Alerta do Sistema</h2>
  <p>Operação concluída com sucesso!</p>
  <button onclick="this.closest('dialog').close()">Fechar</button>
</dialog>`,
    hints: ["<dialog> é o componente nativo de modais do HTML5.","Possui suporte a foco automático e tecla ESC nativo.","Abra com dialog.showModal() e feche com dialog.close()."],
    expectedConditionText: "<dialog id=\"modalAviso\">...</dialog>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <dialog> Nativo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <dialog> Nativo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<dialog[\s\S]*<\/dialog>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <dialog id="modalAviso">...</dialog>',
      };
    },
  },
  {
    id: 72,
    title: "Fase 72: Elemento <picture> Responsivo (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Forneça formatos modernos (WebP/AVIF) com tag <picture> com rigor de produção",
    puzzleDescription: "Redução de até 80% no peso de imagens melhorando velocidade e SEO. Neste desafio prático você irá dominar Elemento <picture> Responsivo aplicando código profissional.",
    initialCode: `<picture>
  <source srcset="banner.avif" type="image/avif">
  <source srcset="banner.webp" type="image/webp">
  <img src="banner.jpg" alt="Banner Principal ProgPlay" loading="lazy">
</picture>`,
    hints: ["<picture> escolhe o formato mais leve suportado pelo navegador.","Use <source srcset=\"...\" type=\"...\">.","Finalize com a tag <img> de fallback obrigatória."],
    expectedConditionText: "<picture> com <source> e <img>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <picture> Responsivo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <picture> Responsivo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<picture>[\s\S]*<source[\s\S]*<img/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <picture> com <source> e <img>',
      };
    },
  },
  {
    id: 73,
    title: "Fase 73: Validação de Formulários com Regex Pattern (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Valide código de cupom com atributo pattern no <input> com rigor de produção",
    puzzleDescription: "Validação nativa instantânea na digitação sem gastar banda de rede. Neste desafio prático você irá dominar Validação de Formulários com Regex Pattern aplicando código profissional.",
    initialCode: `<form>
  <label for="cupom">Cupom:</label>
  <input type="text" id="cupom" name="cupom" pattern="[A-Z]{4}-[0-9]{4}" placeholder="ABCD-1234" required>
  <button type="submit">Aplicar</button>
</form>`,
    hints: ["O atributo pattern valida com regex antes do envio.","[A-Z]{4} exige 4 letras maiúsculas.","[0-9]{4} exige 4 números separados por traço."],
    expectedConditionText: "pattern=\"[A-Z]{4}-[0-9]{4}\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Validação de Formulários com Regex Pattern","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Validação de Formulários com Regex Pattern</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /pattern="\[A-Z\]\{4\}-\[0-9\]\{4\}"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: pattern="[A-Z]{4}-[0-9]{4}"',
      };
    },
  },
  {
    id: 74,
    title: "Fase 74: Lista de Sugestões com <datalist> (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Associe um campo de busca a uma lista com <datalist> com rigor de produção",
    puzzleDescription: "Auto-complete amigável para formulários em desktop e smartphones. Neste desafio prático você irá dominar Lista de Sugestões com <datalist> aplicando código profissional.",
    initialCode: `<label for="linguagem">Escolha a linguagem:</label>
<input list="linguagens" id="linguagem" name="linguagem">
<datalist id="linguagens">
  <option value="JavaScript">
  <option value="Python">
  <option value="CSS">
  <option value="HTML">
  <option value="SQL">
</datalist>`,
    hints: ["O input aponta para o datalist pelo atributo list=\"id\".","O datalist contém as opções com tag <option value=\"...\">.","Funciona como um select pesquisável nativo."],
    expectedConditionText: "<datalist id=\"linguagens\"> com <option>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Lista de Sugestões com <datalist>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Lista de Sugestões com <datalist></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<datalist\s+id="linguagens">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <datalist id="linguagens"> com <option>',
      };
    },
  },
  {
    id: 75,
    title: "Fase 75: Elementos <details> e <summary> (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma seção retrátil (accordion) nativa com rigor de produção",
    puzzleDescription: "Componentes de FAQ e acordions acessíveis e sem scripts. Neste desafio prático você irá dominar Elementos <details> e <summary> aplicando código profissional.",
    initialCode: `<details>
  <summary>O que é a ProgPlay?</summary>
  <p>A ProgPlay é uma plataforma gamificada para dominar programação através de desafios práticos!</p>
</details>`,
    hints: ["<details> expande e recolhe sem nenhum JavaScript.","<summary> define o título clicável visível.","Coloque o conteúdo explicativo abaixo do summary."],
    expectedConditionText: "<details><summary>...</summary>...</details>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elementos <details> e <summary>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elementos <details> e <summary></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<details>[\s\S]*<summary>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <details><summary>...</summary>...</details>',
      };
    },
  },
  {
    id: 76,
    title: "Fase 76: Metatags OpenGraph para Redes Sociais (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Configure cards sociais de compartilhamento com tags og: com rigor de produção",
    puzzleDescription: "Aumenta cliques e atratividade visual em links compartilhados. Neste desafio prático você irá dominar Metatags OpenGraph para Redes Sociais aplicando código profissional.",
    initialCode: `<head>
  <meta property="og:title" content="ProgPlay - Aprenda Programando">
  <meta property="og:description" content="Plataforma gamificada com mais de 600 fases de programação.">
  <meta property="og:image" content="https://progplay.dev/og-cover.png">
</head>`,
    hints: ["OpenGraph gera os cards ao compartilhar links no WhatsApp e Twitter.","og:title define o título em destaque.","og:image especifica a imagem de capa."],
    expectedConditionText: "<meta property=\"og:title\" content=\"...\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Metatags OpenGraph para Redes Sociais","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Metatags OpenGraph para Redes Sociais</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<meta\s+property="og:title"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <meta property="og:title" content="...">',
      };
    },
  },
  {
    id: 77,
    title: "Fase 77: Dados Estruturados JSON-LD (Schema.org) (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Insira metadados estruturados para o Google com <script type=\"application/ld+json\"> com rigor de produção",
    puzzleDescription: "Otimização máxima de SEO e indexação em mecanismos de busca. Neste desafio prático você irá dominar Dados Estruturados JSON-LD (Schema.org) aplicando código profissional.",
    initialCode: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Programação Web",
  "description": "Aprenda desenvolvimento web do zero ao profissional."
}
</script>`,
    hints: ["JSON-LD é o formato recomendado pelo Google para SEO rico.","Especifica tipo Course, Produto, Artigo ou Organização.","Permite que seu site apareça com estrelas e detalhes nas buscas."],
    expectedConditionText: "<script type=\"application/ld+json\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dados Estruturados JSON-LD (Schema.org)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dados Estruturados JSON-LD (Schema.org)</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /type="application\/ld\+json"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <script type="application/ld+json">',
      };
    },
  },
  {
    id: 78,
    title: "Fase 78: Acessibilidade: ARIA Live Regions (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie área de notificação anunciada por leitores de tela com rigor de produção",
    puzzleDescription: "Acessibilidade (a11y) indispensável para conformidade WCAG e governos. Neste desafio prático você irá dominar Acessibilidade: ARIA Live Regions aplicando código profissional.",
    initialCode: `<div role="status" aria-live="polite" class="notificacao">
  Item salvo com sucesso!
</div>`,
    hints: ["aria-live avisa leitores de tela quando o conteúdo da div mudar.","polite espera o leitor terminar a frase antes de falar.","Garante inclusão para deficientes visuais."],
    expectedConditionText: "role=\"status\" aria-live=\"polite\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Acessibilidade: ARIA Live Regions","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Acessibilidade: ARIA Live Regions</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /aria-live="polite"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: role="status" aria-live="polite"',
      };
    },
  },
  {
    id: 79,
    title: "Fase 79: Web Components: <template> & <slot> (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Declare um modelo reutilizável que não é renderizado na carga inicial com rigor de produção",
    puzzleDescription: "Reutilização de fragmentos de interface sem framework. Neste desafio prático você irá dominar Web Components: <template> & <slot> aplicando código profissional.",
    initialCode: `<template id="card-usuario">
  <div class="card">
    <h3><slot name="nome">Nome Padrão</slot></h3>
    <p><slot name="bio">Biografia</slot></p>
  </div>
</template>`,
    hints: ["<template> guarda HTML inativo para clonagem via JavaScript.","<slot> define pontos de injeção de conteúdo customizado.","Base dos Web Components nativos do navegador."],
    expectedConditionText: "<template id=\"card-usuario\"> com <slot>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Components: <template> & <slot>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Components: <template> & <slot></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<template\s+id="card-usuario">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <template id="card-usuario"> com <slot>',
      };
    },
  },
  {
    id: 80,
    title: "Fase 80: Controles de Mídia: <video> com <track> (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Adicione vídeo com legendas acessíveis usando a tag <track> com rigor de produção",
    puzzleDescription: "Mídia profissional com legenda e suporte a acessibilidade auditiva. Neste desafio prático você irá dominar Controles de Mídia: <video> com <track> aplicando código profissional.",
    initialCode: `<video controls width="640">
  <source src="aula.mp4" type="video/mp4">
  <track src="legendas-pt.vtt" kind="subtitles" srclang="pt" label="Português">
  Seu navegador não suporta vídeos.
</video>`,
    hints: ["<track> vincula arquivos .vtt de legendas e audiodescrição.","kind=\"subtitles\" habilita legendas.","srclang=\"pt\" especifica o idioma português."],
    expectedConditionText: "<track src=\"...\" kind=\"subtitles\" srclang=\"pt\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Controles de Mídia: <video> com <track>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Controles de Mídia: <video> com <track></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<track[\s\S]*kind="subtitles"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <track src="..." kind="subtitles" srclang="pt">',
      };
    },
  },
  {
    id: 81,
    title: "Fase 81: Elemento <dialog> Nativo (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie um modal acessível nativo usando a tag <dialog> com rigor de produção",
    puzzleDescription: "Modais acessíveis sem precisar de bibliotecas pesadas de terceiros. Neste desafio prático você irá dominar Elemento <dialog> Nativo aplicando código profissional.",
    initialCode: `<dialog id="modalAviso">
  <h2>Alerta do Sistema</h2>
  <p>Operação concluída com sucesso!</p>
  <button onclick="this.closest('dialog').close()">Fechar</button>
</dialog>`,
    hints: ["<dialog> é o componente nativo de modais do HTML5.","Possui suporte a foco automático e tecla ESC nativo.","Abra com dialog.showModal() e feche com dialog.close()."],
    expectedConditionText: "<dialog id=\"modalAviso\">...</dialog>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <dialog> Nativo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <dialog> Nativo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<dialog[\s\S]*<\/dialog>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <dialog id="modalAviso">...</dialog>',
      };
    },
  },
  {
    id: 82,
    title: "Fase 82: Elemento <picture> Responsivo (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Forneça formatos modernos (WebP/AVIF) com tag <picture> com rigor de produção",
    puzzleDescription: "Redução de até 80% no peso de imagens melhorando velocidade e SEO. Neste desafio prático você irá dominar Elemento <picture> Responsivo aplicando código profissional.",
    initialCode: `<picture>
  <source srcset="banner.avif" type="image/avif">
  <source srcset="banner.webp" type="image/webp">
  <img src="banner.jpg" alt="Banner Principal ProgPlay" loading="lazy">
</picture>`,
    hints: ["<picture> escolhe o formato mais leve suportado pelo navegador.","Use <source srcset=\"...\" type=\"...\">.","Finalize com a tag <img> de fallback obrigatória."],
    expectedConditionText: "<picture> com <source> e <img>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <picture> Responsivo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <picture> Responsivo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<picture>[\s\S]*<source[\s\S]*<img/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <picture> com <source> e <img>',
      };
    },
  },
  {
    id: 83,
    title: "Fase 83: Validação de Formulários com Regex Pattern (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Valide código de cupom com atributo pattern no <input> com rigor de produção",
    puzzleDescription: "Validação nativa instantânea na digitação sem gastar banda de rede. Neste desafio prático você irá dominar Validação de Formulários com Regex Pattern aplicando código profissional.",
    initialCode: `<form>
  <label for="cupom">Cupom:</label>
  <input type="text" id="cupom" name="cupom" pattern="[A-Z]{4}-[0-9]{4}" placeholder="ABCD-1234" required>
  <button type="submit">Aplicar</button>
</form>`,
    hints: ["O atributo pattern valida com regex antes do envio.","[A-Z]{4} exige 4 letras maiúsculas.","[0-9]{4} exige 4 números separados por traço."],
    expectedConditionText: "pattern=\"[A-Z]{4}-[0-9]{4}\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Validação de Formulários com Regex Pattern","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Validação de Formulários com Regex Pattern</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /pattern="\[A-Z\]\{4\}-\[0-9\]\{4\}"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: pattern="[A-Z]{4}-[0-9]{4}"',
      };
    },
  },
  {
    id: 84,
    title: "Fase 84: Lista de Sugestões com <datalist> (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Associe um campo de busca a uma lista com <datalist> com rigor de produção",
    puzzleDescription: "Auto-complete amigável para formulários em desktop e smartphones. Neste desafio prático você irá dominar Lista de Sugestões com <datalist> aplicando código profissional.",
    initialCode: `<label for="linguagem">Escolha a linguagem:</label>
<input list="linguagens" id="linguagem" name="linguagem">
<datalist id="linguagens">
  <option value="JavaScript">
  <option value="Python">
  <option value="CSS">
  <option value="HTML">
  <option value="SQL">
</datalist>`,
    hints: ["O input aponta para o datalist pelo atributo list=\"id\".","O datalist contém as opções com tag <option value=\"...\">.","Funciona como um select pesquisável nativo."],
    expectedConditionText: "<datalist id=\"linguagens\"> com <option>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Lista de Sugestões com <datalist>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Lista de Sugestões com <datalist></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<datalist\s+id="linguagens">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <datalist id="linguagens"> com <option>',
      };
    },
  },
  {
    id: 85,
    title: "Fase 85: Elementos <details> e <summary> (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma seção retrátil (accordion) nativa com rigor de produção",
    puzzleDescription: "Componentes de FAQ e acordions acessíveis e sem scripts. Neste desafio prático você irá dominar Elementos <details> e <summary> aplicando código profissional.",
    initialCode: `<details>
  <summary>O que é a ProgPlay?</summary>
  <p>A ProgPlay é uma plataforma gamificada para dominar programação através de desafios práticos!</p>
</details>`,
    hints: ["<details> expande e recolhe sem nenhum JavaScript.","<summary> define o título clicável visível.","Coloque o conteúdo explicativo abaixo do summary."],
    expectedConditionText: "<details><summary>...</summary>...</details>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elementos <details> e <summary>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elementos <details> e <summary></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<details>[\s\S]*<summary>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <details><summary>...</summary>...</details>',
      };
    },
  },
  {
    id: 86,
    title: "Fase 86: Metatags OpenGraph para Redes Sociais (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Configure cards sociais de compartilhamento com tags og: com rigor de produção",
    puzzleDescription: "Aumenta cliques e atratividade visual em links compartilhados. Neste desafio prático você irá dominar Metatags OpenGraph para Redes Sociais aplicando código profissional.",
    initialCode: `<head>
  <meta property="og:title" content="ProgPlay - Aprenda Programando">
  <meta property="og:description" content="Plataforma gamificada com mais de 600 fases de programação.">
  <meta property="og:image" content="https://progplay.dev/og-cover.png">
</head>`,
    hints: ["OpenGraph gera os cards ao compartilhar links no WhatsApp e Twitter.","og:title define o título em destaque.","og:image especifica a imagem de capa."],
    expectedConditionText: "<meta property=\"og:title\" content=\"...\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Metatags OpenGraph para Redes Sociais","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Metatags OpenGraph para Redes Sociais</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<meta\s+property="og:title"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <meta property="og:title" content="...">',
      };
    },
  },
  {
    id: 87,
    title: "Fase 87: Dados Estruturados JSON-LD (Schema.org) (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Insira metadados estruturados para o Google com <script type=\"application/ld+json\"> com rigor de produção",
    puzzleDescription: "Otimização máxima de SEO e indexação em mecanismos de busca. Neste desafio prático você irá dominar Dados Estruturados JSON-LD (Schema.org) aplicando código profissional.",
    initialCode: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Programação Web",
  "description": "Aprenda desenvolvimento web do zero ao profissional."
}
</script>`,
    hints: ["JSON-LD é o formato recomendado pelo Google para SEO rico.","Especifica tipo Course, Produto, Artigo ou Organização.","Permite que seu site apareça com estrelas e detalhes nas buscas."],
    expectedConditionText: "<script type=\"application/ld+json\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dados Estruturados JSON-LD (Schema.org)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dados Estruturados JSON-LD (Schema.org)</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /type="application\/ld\+json"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <script type="application/ld+json">',
      };
    },
  },
  {
    id: 88,
    title: "Fase 88: Acessibilidade: ARIA Live Regions (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie área de notificação anunciada por leitores de tela com rigor de produção",
    puzzleDescription: "Acessibilidade (a11y) indispensável para conformidade WCAG e governos. Neste desafio prático você irá dominar Acessibilidade: ARIA Live Regions aplicando código profissional.",
    initialCode: `<div role="status" aria-live="polite" class="notificacao">
  Item salvo com sucesso!
</div>`,
    hints: ["aria-live avisa leitores de tela quando o conteúdo da div mudar.","polite espera o leitor terminar a frase antes de falar.","Garante inclusão para deficientes visuais."],
    expectedConditionText: "role=\"status\" aria-live=\"polite\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Acessibilidade: ARIA Live Regions","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Acessibilidade: ARIA Live Regions</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /aria-live="polite"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: role="status" aria-live="polite"',
      };
    },
  },
  {
    id: 89,
    title: "Fase 89: Web Components: <template> & <slot> (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Declare um modelo reutilizável que não é renderizado na carga inicial com rigor de produção",
    puzzleDescription: "Reutilização de fragmentos de interface sem framework. Neste desafio prático você irá dominar Web Components: <template> & <slot> aplicando código profissional.",
    initialCode: `<template id="card-usuario">
  <div class="card">
    <h3><slot name="nome">Nome Padrão</slot></h3>
    <p><slot name="bio">Biografia</slot></p>
  </div>
</template>`,
    hints: ["<template> guarda HTML inativo para clonagem via JavaScript.","<slot> define pontos de injeção de conteúdo customizado.","Base dos Web Components nativos do navegador."],
    expectedConditionText: "<template id=\"card-usuario\"> com <slot>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Components: <template> & <slot>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Components: <template> & <slot></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<template\s+id="card-usuario">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <template id="card-usuario"> com <slot>',
      };
    },
  },
  {
    id: 90,
    title: "Fase 90: Controles de Mídia: <video> com <track> (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Adicione vídeo com legendas acessíveis usando a tag <track> com rigor de produção",
    puzzleDescription: "Mídia profissional com legenda e suporte a acessibilidade auditiva. Neste desafio prático você irá dominar Controles de Mídia: <video> com <track> aplicando código profissional.",
    initialCode: `<video controls width="640">
  <source src="aula.mp4" type="video/mp4">
  <track src="legendas-pt.vtt" kind="subtitles" srclang="pt" label="Português">
  Seu navegador não suporta vídeos.
</video>`,
    hints: ["<track> vincula arquivos .vtt de legendas e audiodescrição.","kind=\"subtitles\" habilita legendas.","srclang=\"pt\" especifica o idioma português."],
    expectedConditionText: "<track src=\"...\" kind=\"subtitles\" srclang=\"pt\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Controles de Mídia: <video> com <track>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Controles de Mídia: <video> com <track></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<track[\s\S]*kind="subtitles"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <track src="..." kind="subtitles" srclang="pt">',
      };
    },
  },
  {
    id: 91,
    title: "Fase 91: Elemento <dialog> Nativo (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie um modal acessível nativo usando a tag <dialog> com rigor de produção",
    puzzleDescription: "Modais acessíveis sem precisar de bibliotecas pesadas de terceiros. Neste desafio prático você irá dominar Elemento <dialog> Nativo aplicando código profissional.",
    initialCode: `<dialog id="modalAviso">
  <h2>Alerta do Sistema</h2>
  <p>Operação concluída com sucesso!</p>
  <button onclick="this.closest('dialog').close()">Fechar</button>
</dialog>`,
    hints: ["<dialog> é o componente nativo de modais do HTML5.","Possui suporte a foco automático e tecla ESC nativo.","Abra com dialog.showModal() e feche com dialog.close()."],
    expectedConditionText: "<dialog id=\"modalAviso\">...</dialog>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <dialog> Nativo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <dialog> Nativo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<dialog[\s\S]*<\/dialog>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <dialog id="modalAviso">...</dialog>',
      };
    },
  },
  {
    id: 92,
    title: "Fase 92: Elemento <picture> Responsivo (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Forneça formatos modernos (WebP/AVIF) com tag <picture> com rigor de produção",
    puzzleDescription: "Redução de até 80% no peso de imagens melhorando velocidade e SEO. Neste desafio prático você irá dominar Elemento <picture> Responsivo aplicando código profissional.",
    initialCode: `<picture>
  <source srcset="banner.avif" type="image/avif">
  <source srcset="banner.webp" type="image/webp">
  <img src="banner.jpg" alt="Banner Principal ProgPlay" loading="lazy">
</picture>`,
    hints: ["<picture> escolhe o formato mais leve suportado pelo navegador.","Use <source srcset=\"...\" type=\"...\">.","Finalize com a tag <img> de fallback obrigatória."],
    expectedConditionText: "<picture> com <source> e <img>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <picture> Responsivo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <picture> Responsivo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<picture>[\s\S]*<source[\s\S]*<img/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <picture> com <source> e <img>',
      };
    },
  },
  {
    id: 93,
    title: "Fase 93: Validação de Formulários com Regex Pattern (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Valide código de cupom com atributo pattern no <input> com rigor de produção",
    puzzleDescription: "Validação nativa instantânea na digitação sem gastar banda de rede. Neste desafio prático você irá dominar Validação de Formulários com Regex Pattern aplicando código profissional.",
    initialCode: `<form>
  <label for="cupom">Cupom:</label>
  <input type="text" id="cupom" name="cupom" pattern="[A-Z]{4}-[0-9]{4}" placeholder="ABCD-1234" required>
  <button type="submit">Aplicar</button>
</form>`,
    hints: ["O atributo pattern valida com regex antes do envio.","[A-Z]{4} exige 4 letras maiúsculas.","[0-9]{4} exige 4 números separados por traço."],
    expectedConditionText: "pattern=\"[A-Z]{4}-[0-9]{4}\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Validação de Formulários com Regex Pattern","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Validação de Formulários com Regex Pattern</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /pattern="\[A-Z\]\{4\}-\[0-9\]\{4\}"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: pattern="[A-Z]{4}-[0-9]{4}"',
      };
    },
  },
  {
    id: 94,
    title: "Fase 94: Lista de Sugestões com <datalist> (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Associe um campo de busca a uma lista com <datalist> com rigor de produção",
    puzzleDescription: "Auto-complete amigável para formulários em desktop e smartphones. Neste desafio prático você irá dominar Lista de Sugestões com <datalist> aplicando código profissional.",
    initialCode: `<label for="linguagem">Escolha a linguagem:</label>
<input list="linguagens" id="linguagem" name="linguagem">
<datalist id="linguagens">
  <option value="JavaScript">
  <option value="Python">
  <option value="CSS">
  <option value="HTML">
  <option value="SQL">
</datalist>`,
    hints: ["O input aponta para o datalist pelo atributo list=\"id\".","O datalist contém as opções com tag <option value=\"...\">.","Funciona como um select pesquisável nativo."],
    expectedConditionText: "<datalist id=\"linguagens\"> com <option>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Lista de Sugestões com <datalist>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Lista de Sugestões com <datalist></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<datalist\s+id="linguagens">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <datalist id="linguagens"> com <option>',
      };
    },
  },
  {
    id: 95,
    title: "Fase 95: Elementos <details> e <summary> (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma seção retrátil (accordion) nativa com rigor de produção",
    puzzleDescription: "Componentes de FAQ e acordions acessíveis e sem scripts. Neste desafio prático você irá dominar Elementos <details> e <summary> aplicando código profissional.",
    initialCode: `<details>
  <summary>O que é a ProgPlay?</summary>
  <p>A ProgPlay é uma plataforma gamificada para dominar programação através de desafios práticos!</p>
</details>`,
    hints: ["<details> expande e recolhe sem nenhum JavaScript.","<summary> define o título clicável visível.","Coloque o conteúdo explicativo abaixo do summary."],
    expectedConditionText: "<details><summary>...</summary>...</details>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elementos <details> e <summary>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elementos <details> e <summary></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<details>[\s\S]*<summary>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <details><summary>...</summary>...</details>',
      };
    },
  },
  {
    id: 96,
    title: "Fase 96: Metatags OpenGraph para Redes Sociais (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Configure cards sociais de compartilhamento com tags og: com rigor de produção",
    puzzleDescription: "Aumenta cliques e atratividade visual em links compartilhados. Neste desafio prático você irá dominar Metatags OpenGraph para Redes Sociais aplicando código profissional.",
    initialCode: `<head>
  <meta property="og:title" content="ProgPlay - Aprenda Programando">
  <meta property="og:description" content="Plataforma gamificada com mais de 600 fases de programação.">
  <meta property="og:image" content="https://progplay.dev/og-cover.png">
</head>`,
    hints: ["OpenGraph gera os cards ao compartilhar links no WhatsApp e Twitter.","og:title define o título em destaque.","og:image especifica a imagem de capa."],
    expectedConditionText: "<meta property=\"og:title\" content=\"...\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Metatags OpenGraph para Redes Sociais","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Metatags OpenGraph para Redes Sociais</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<meta\s+property="og:title"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <meta property="og:title" content="...">',
      };
    },
  },
  {
    id: 97,
    title: "Fase 97: Dados Estruturados JSON-LD (Schema.org) (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Insira metadados estruturados para o Google com <script type=\"application/ld+json\"> com rigor de produção",
    puzzleDescription: "Otimização máxima de SEO e indexação em mecanismos de busca. Neste desafio prático você irá dominar Dados Estruturados JSON-LD (Schema.org) aplicando código profissional.",
    initialCode: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Programação Web",
  "description": "Aprenda desenvolvimento web do zero ao profissional."
}
</script>`,
    hints: ["JSON-LD é o formato recomendado pelo Google para SEO rico.","Especifica tipo Course, Produto, Artigo ou Organização.","Permite que seu site apareça com estrelas e detalhes nas buscas."],
    expectedConditionText: "<script type=\"application/ld+json\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dados Estruturados JSON-LD (Schema.org)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dados Estruturados JSON-LD (Schema.org)</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /type="application\/ld\+json"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <script type="application/ld+json">',
      };
    },
  },
  {
    id: 98,
    title: "Fase 98: Acessibilidade: ARIA Live Regions (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie área de notificação anunciada por leitores de tela com rigor de produção",
    puzzleDescription: "Acessibilidade (a11y) indispensável para conformidade WCAG e governos. Neste desafio prático você irá dominar Acessibilidade: ARIA Live Regions aplicando código profissional.",
    initialCode: `<div role="status" aria-live="polite" class="notificacao">
  Item salvo com sucesso!
</div>`,
    hints: ["aria-live avisa leitores de tela quando o conteúdo da div mudar.","polite espera o leitor terminar a frase antes de falar.","Garante inclusão para deficientes visuais."],
    expectedConditionText: "role=\"status\" aria-live=\"polite\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Acessibilidade: ARIA Live Regions","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Acessibilidade: ARIA Live Regions</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /aria-live="polite"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: role="status" aria-live="polite"',
      };
    },
  },
  {
    id: 99,
    title: "Fase 99: Web Components: <template> & <slot> (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Declare um modelo reutilizável que não é renderizado na carga inicial com rigor de produção",
    puzzleDescription: "Reutilização de fragmentos de interface sem framework. Neste desafio prático você irá dominar Web Components: <template> & <slot> aplicando código profissional.",
    initialCode: `<template id="card-usuario">
  <div class="card">
    <h3><slot name="nome">Nome Padrão</slot></h3>
    <p><slot name="bio">Biografia</slot></p>
  </div>
</template>`,
    hints: ["<template> guarda HTML inativo para clonagem via JavaScript.","<slot> define pontos de injeção de conteúdo customizado.","Base dos Web Components nativos do navegador."],
    expectedConditionText: "<template id=\"card-usuario\"> com <slot>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Components: <template> & <slot>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Components: <template> & <slot></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<template\s+id="card-usuario">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <template id="card-usuario"> com <slot>',
      };
    },
  },
  {
    id: 100,
    title: "Fase 100: Controles de Mídia: <video> com <track> (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Adicione vídeo com legendas acessíveis usando a tag <track> com rigor de produção",
    puzzleDescription: "Mídia profissional com legenda e suporte a acessibilidade auditiva. Neste desafio prático você irá dominar Controles de Mídia: <video> com <track> aplicando código profissional.",
    initialCode: `<video controls width="640">
  <source src="aula.mp4" type="video/mp4">
  <track src="legendas-pt.vtt" kind="subtitles" srclang="pt" label="Português">
  Seu navegador não suporta vídeos.
</video>`,
    hints: ["<track> vincula arquivos .vtt de legendas e audiodescrição.","kind=\"subtitles\" habilita legendas.","srclang=\"pt\" especifica o idioma português."],
    expectedConditionText: "<track src=\"...\" kind=\"subtitles\" srclang=\"pt\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Controles de Mídia: <video> com <track>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Controles de Mídia: <video> com <track></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<track[\s\S]*kind="subtitles"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <track src="..." kind="subtitles" srclang="pt">',
      };
    },
  },
  {
    id: 101,
    title: "Fase 101: Elemento <dialog> Nativo (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie um modal acessível nativo usando a tag <dialog> com rigor de produção",
    puzzleDescription: "Modais acessíveis sem precisar de bibliotecas pesadas de terceiros. Neste desafio prático você irá dominar Elemento <dialog> Nativo aplicando código profissional.",
    initialCode: `<dialog id="modalAviso">
  <h2>Alerta do Sistema</h2>
  <p>Operação concluída com sucesso!</p>
  <button onclick="this.closest('dialog').close()">Fechar</button>
</dialog>`,
    hints: ["<dialog> é o componente nativo de modais do HTML5.","Possui suporte a foco automático e tecla ESC nativo.","Abra com dialog.showModal() e feche com dialog.close()."],
    expectedConditionText: "<dialog id=\"modalAviso\">...</dialog>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <dialog> Nativo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <dialog> Nativo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<dialog[\s\S]*<\/dialog>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <dialog id="modalAviso">...</dialog>',
      };
    },
  },
  {
    id: 102,
    title: "Fase 102: Elemento <picture> Responsivo (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Forneça formatos modernos (WebP/AVIF) com tag <picture> com rigor de produção",
    puzzleDescription: "Redução de até 80% no peso de imagens melhorando velocidade e SEO. Neste desafio prático você irá dominar Elemento <picture> Responsivo aplicando código profissional.",
    initialCode: `<picture>
  <source srcset="banner.avif" type="image/avif">
  <source srcset="banner.webp" type="image/webp">
  <img src="banner.jpg" alt="Banner Principal ProgPlay" loading="lazy">
</picture>`,
    hints: ["<picture> escolhe o formato mais leve suportado pelo navegador.","Use <source srcset=\"...\" type=\"...\">.","Finalize com a tag <img> de fallback obrigatória."],
    expectedConditionText: "<picture> com <source> e <img>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <picture> Responsivo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <picture> Responsivo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<picture>[\s\S]*<source[\s\S]*<img/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <picture> com <source> e <img>',
      };
    },
  },
  {
    id: 103,
    title: "Fase 103: Validação de Formulários com Regex Pattern (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Valide código de cupom com atributo pattern no <input> com rigor de produção",
    puzzleDescription: "Validação nativa instantânea na digitação sem gastar banda de rede. Neste desafio prático você irá dominar Validação de Formulários com Regex Pattern aplicando código profissional.",
    initialCode: `<form>
  <label for="cupom">Cupom:</label>
  <input type="text" id="cupom" name="cupom" pattern="[A-Z]{4}-[0-9]{4}" placeholder="ABCD-1234" required>
  <button type="submit">Aplicar</button>
</form>`,
    hints: ["O atributo pattern valida com regex antes do envio.","[A-Z]{4} exige 4 letras maiúsculas.","[0-9]{4} exige 4 números separados por traço."],
    expectedConditionText: "pattern=\"[A-Z]{4}-[0-9]{4}\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Validação de Formulários com Regex Pattern","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Validação de Formulários com Regex Pattern</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /pattern="\[A-Z\]\{4\}-\[0-9\]\{4\}"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: pattern="[A-Z]{4}-[0-9]{4}"',
      };
    },
  },
  {
    id: 104,
    title: "Fase 104: Lista de Sugestões com <datalist> (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Associe um campo de busca a uma lista com <datalist> com rigor de produção",
    puzzleDescription: "Auto-complete amigável para formulários em desktop e smartphones. Neste desafio prático você irá dominar Lista de Sugestões com <datalist> aplicando código profissional.",
    initialCode: `<label for="linguagem">Escolha a linguagem:</label>
<input list="linguagens" id="linguagem" name="linguagem">
<datalist id="linguagens">
  <option value="JavaScript">
  <option value="Python">
  <option value="CSS">
  <option value="HTML">
  <option value="SQL">
</datalist>`,
    hints: ["O input aponta para o datalist pelo atributo list=\"id\".","O datalist contém as opções com tag <option value=\"...\">.","Funciona como um select pesquisável nativo."],
    expectedConditionText: "<datalist id=\"linguagens\"> com <option>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Lista de Sugestões com <datalist>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Lista de Sugestões com <datalist></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<datalist\s+id="linguagens">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <datalist id="linguagens"> com <option>',
      };
    },
  },
  {
    id: 105,
    title: "Fase 105: Elementos <details> e <summary> (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma seção retrátil (accordion) nativa com rigor de produção",
    puzzleDescription: "Componentes de FAQ e acordions acessíveis e sem scripts. Neste desafio prático você irá dominar Elementos <details> e <summary> aplicando código profissional.",
    initialCode: `<details>
  <summary>O que é a ProgPlay?</summary>
  <p>A ProgPlay é uma plataforma gamificada para dominar programação através de desafios práticos!</p>
</details>`,
    hints: ["<details> expande e recolhe sem nenhum JavaScript.","<summary> define o título clicável visível.","Coloque o conteúdo explicativo abaixo do summary."],
    expectedConditionText: "<details><summary>...</summary>...</details>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elementos <details> e <summary>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elementos <details> e <summary></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<details>[\s\S]*<summary>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <details><summary>...</summary>...</details>',
      };
    },
  },
  {
    id: 106,
    title: "Fase 106: Metatags OpenGraph para Redes Sociais (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Configure cards sociais de compartilhamento com tags og: com rigor de produção",
    puzzleDescription: "Aumenta cliques e atratividade visual em links compartilhados. Neste desafio prático você irá dominar Metatags OpenGraph para Redes Sociais aplicando código profissional.",
    initialCode: `<head>
  <meta property="og:title" content="ProgPlay - Aprenda Programando">
  <meta property="og:description" content="Plataforma gamificada com mais de 600 fases de programação.">
  <meta property="og:image" content="https://progplay.dev/og-cover.png">
</head>`,
    hints: ["OpenGraph gera os cards ao compartilhar links no WhatsApp e Twitter.","og:title define o título em destaque.","og:image especifica a imagem de capa."],
    expectedConditionText: "<meta property=\"og:title\" content=\"...\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Metatags OpenGraph para Redes Sociais","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Metatags OpenGraph para Redes Sociais</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<meta\s+property="og:title"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <meta property="og:title" content="...">',
      };
    },
  },
  {
    id: 107,
    title: "Fase 107: Dados Estruturados JSON-LD (Schema.org) (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Insira metadados estruturados para o Google com <script type=\"application/ld+json\"> com rigor de produção",
    puzzleDescription: "Otimização máxima de SEO e indexação em mecanismos de busca. Neste desafio prático você irá dominar Dados Estruturados JSON-LD (Schema.org) aplicando código profissional.",
    initialCode: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Programação Web",
  "description": "Aprenda desenvolvimento web do zero ao profissional."
}
</script>`,
    hints: ["JSON-LD é o formato recomendado pelo Google para SEO rico.","Especifica tipo Course, Produto, Artigo ou Organização.","Permite que seu site apareça com estrelas e detalhes nas buscas."],
    expectedConditionText: "<script type=\"application/ld+json\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dados Estruturados JSON-LD (Schema.org)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dados Estruturados JSON-LD (Schema.org)</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /type="application\/ld\+json"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <script type="application/ld+json">',
      };
    },
  },
  {
    id: 108,
    title: "Fase 108: Acessibilidade: ARIA Live Regions (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie área de notificação anunciada por leitores de tela com rigor de produção",
    puzzleDescription: "Acessibilidade (a11y) indispensável para conformidade WCAG e governos. Neste desafio prático você irá dominar Acessibilidade: ARIA Live Regions aplicando código profissional.",
    initialCode: `<div role="status" aria-live="polite" class="notificacao">
  Item salvo com sucesso!
</div>`,
    hints: ["aria-live avisa leitores de tela quando o conteúdo da div mudar.","polite espera o leitor terminar a frase antes de falar.","Garante inclusão para deficientes visuais."],
    expectedConditionText: "role=\"status\" aria-live=\"polite\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Acessibilidade: ARIA Live Regions","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Acessibilidade: ARIA Live Regions</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /aria-live="polite"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: role="status" aria-live="polite"',
      };
    },
  },
  {
    id: 109,
    title: "Fase 109: Web Components: <template> & <slot> (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Declare um modelo reutilizável que não é renderizado na carga inicial com rigor de produção",
    puzzleDescription: "Reutilização de fragmentos de interface sem framework. Neste desafio prático você irá dominar Web Components: <template> & <slot> aplicando código profissional.",
    initialCode: `<template id="card-usuario">
  <div class="card">
    <h3><slot name="nome">Nome Padrão</slot></h3>
    <p><slot name="bio">Biografia</slot></p>
  </div>
</template>`,
    hints: ["<template> guarda HTML inativo para clonagem via JavaScript.","<slot> define pontos de injeção de conteúdo customizado.","Base dos Web Components nativos do navegador."],
    expectedConditionText: "<template id=\"card-usuario\"> com <slot>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Components: <template> & <slot>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Components: <template> & <slot></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<template\s+id="card-usuario">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <template id="card-usuario"> com <slot>',
      };
    },
  },
  {
    id: 110,
    title: "Fase 110: Controles de Mídia: <video> com <track> (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Adicione vídeo com legendas acessíveis usando a tag <track> com rigor de produção",
    puzzleDescription: "Mídia profissional com legenda e suporte a acessibilidade auditiva. Neste desafio prático você irá dominar Controles de Mídia: <video> com <track> aplicando código profissional.",
    initialCode: `<video controls width="640">
  <source src="aula.mp4" type="video/mp4">
  <track src="legendas-pt.vtt" kind="subtitles" srclang="pt" label="Português">
  Seu navegador não suporta vídeos.
</video>`,
    hints: ["<track> vincula arquivos .vtt de legendas e audiodescrição.","kind=\"subtitles\" habilita legendas.","srclang=\"pt\" especifica o idioma português."],
    expectedConditionText: "<track src=\"...\" kind=\"subtitles\" srclang=\"pt\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Controles de Mídia: <video> com <track>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Controles de Mídia: <video> com <track></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<track[\s\S]*kind="subtitles"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <track src="..." kind="subtitles" srclang="pt">',
      };
    },
  },
  {
    id: 111,
    title: "Fase 111: Elemento <dialog> Nativo (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie um modal acessível nativo usando a tag <dialog> com rigor de produção",
    puzzleDescription: "Modais acessíveis sem precisar de bibliotecas pesadas de terceiros. Neste desafio prático você irá dominar Elemento <dialog> Nativo aplicando código profissional.",
    initialCode: `<dialog id="modalAviso">
  <h2>Alerta do Sistema</h2>
  <p>Operação concluída com sucesso!</p>
  <button onclick="this.closest('dialog').close()">Fechar</button>
</dialog>`,
    hints: ["<dialog> é o componente nativo de modais do HTML5.","Possui suporte a foco automático e tecla ESC nativo.","Abra com dialog.showModal() e feche com dialog.close()."],
    expectedConditionText: "<dialog id=\"modalAviso\">...</dialog>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <dialog> Nativo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <dialog> Nativo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<dialog[\s\S]*<\/dialog>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <dialog id="modalAviso">...</dialog>',
      };
    },
  },
  {
    id: 112,
    title: "Fase 112: Elemento <picture> Responsivo (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Forneça formatos modernos (WebP/AVIF) com tag <picture> com rigor de produção",
    puzzleDescription: "Redução de até 80% no peso de imagens melhorando velocidade e SEO. Neste desafio prático você irá dominar Elemento <picture> Responsivo aplicando código profissional.",
    initialCode: `<picture>
  <source srcset="banner.avif" type="image/avif">
  <source srcset="banner.webp" type="image/webp">
  <img src="banner.jpg" alt="Banner Principal ProgPlay" loading="lazy">
</picture>`,
    hints: ["<picture> escolhe o formato mais leve suportado pelo navegador.","Use <source srcset=\"...\" type=\"...\">.","Finalize com a tag <img> de fallback obrigatória."],
    expectedConditionText: "<picture> com <source> e <img>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elemento <picture> Responsivo","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elemento <picture> Responsivo</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<picture>[\s\S]*<source[\s\S]*<img/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <picture> com <source> e <img>',
      };
    },
  },
  {
    id: 113,
    title: "Fase 113: Validação de Formulários com Regex Pattern (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Valide código de cupom com atributo pattern no <input> com rigor de produção",
    puzzleDescription: "Validação nativa instantânea na digitação sem gastar banda de rede. Neste desafio prático você irá dominar Validação de Formulários com Regex Pattern aplicando código profissional.",
    initialCode: `<form>
  <label for="cupom">Cupom:</label>
  <input type="text" id="cupom" name="cupom" pattern="[A-Z]{4}-[0-9]{4}" placeholder="ABCD-1234" required>
  <button type="submit">Aplicar</button>
</form>`,
    hints: ["O atributo pattern valida com regex antes do envio.","[A-Z]{4} exige 4 letras maiúsculas.","[0-9]{4} exige 4 números separados por traço."],
    expectedConditionText: "pattern=\"[A-Z]{4}-[0-9]{4}\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Validação de Formulários com Regex Pattern","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Validação de Formulários com Regex Pattern</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /pattern="\[A-Z\]\{4\}-\[0-9\]\{4\}"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: pattern="[A-Z]{4}-[0-9]{4}"',
      };
    },
  },
  {
    id: 114,
    title: "Fase 114: Lista de Sugestões com <datalist> (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Associe um campo de busca a uma lista com <datalist> com rigor de produção",
    puzzleDescription: "Auto-complete amigável para formulários em desktop e smartphones. Neste desafio prático você irá dominar Lista de Sugestões com <datalist> aplicando código profissional.",
    initialCode: `<label for="linguagem">Escolha a linguagem:</label>
<input list="linguagens" id="linguagem" name="linguagem">
<datalist id="linguagens">
  <option value="JavaScript">
  <option value="Python">
  <option value="CSS">
  <option value="HTML">
  <option value="SQL">
</datalist>`,
    hints: ["O input aponta para o datalist pelo atributo list=\"id\".","O datalist contém as opções com tag <option value=\"...\">.","Funciona como um select pesquisável nativo."],
    expectedConditionText: "<datalist id=\"linguagens\"> com <option>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Lista de Sugestões com <datalist>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Lista de Sugestões com <datalist></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<datalist\s+id="linguagens">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <datalist id="linguagens"> com <option>',
      };
    },
  },
  {
    id: 115,
    title: "Fase 115: Elementos <details> e <summary> (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma seção retrátil (accordion) nativa com rigor de produção",
    puzzleDescription: "Componentes de FAQ e acordions acessíveis e sem scripts. Neste desafio prático você irá dominar Elementos <details> e <summary> aplicando código profissional.",
    initialCode: `<details>
  <summary>O que é a ProgPlay?</summary>
  <p>A ProgPlay é uma plataforma gamificada para dominar programação através de desafios práticos!</p>
</details>`,
    hints: ["<details> expande e recolhe sem nenhum JavaScript.","<summary> define o título clicável visível.","Coloque o conteúdo explicativo abaixo do summary."],
    expectedConditionText: "<details><summary>...</summary>...</details>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Elementos <details> e <summary>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Elementos <details> e <summary></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<details>[\s\S]*<summary>/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <details><summary>...</summary>...</details>',
      };
    },
  },
  {
    id: 116,
    title: "Fase 116: Metatags OpenGraph para Redes Sociais (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Configure cards sociais de compartilhamento com tags og: com rigor de produção",
    puzzleDescription: "Aumenta cliques e atratividade visual em links compartilhados. Neste desafio prático você irá dominar Metatags OpenGraph para Redes Sociais aplicando código profissional.",
    initialCode: `<head>
  <meta property="og:title" content="ProgPlay - Aprenda Programando">
  <meta property="og:description" content="Plataforma gamificada com mais de 600 fases de programação.">
  <meta property="og:image" content="https://progplay.dev/og-cover.png">
</head>`,
    hints: ["OpenGraph gera os cards ao compartilhar links no WhatsApp e Twitter.","og:title define o título em destaque.","og:image especifica a imagem de capa."],
    expectedConditionText: "<meta property=\"og:title\" content=\"...\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Metatags OpenGraph para Redes Sociais","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Metatags OpenGraph para Redes Sociais</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<meta\s+property="og:title"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <meta property="og:title" content="...">',
      };
    },
  },
  {
    id: 117,
    title: "Fase 117: Dados Estruturados JSON-LD (Schema.org) (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Insira metadados estruturados para o Google com <script type=\"application/ld+json\"> com rigor de produção",
    puzzleDescription: "Otimização máxima de SEO e indexação em mecanismos de busca. Neste desafio prático você irá dominar Dados Estruturados JSON-LD (Schema.org) aplicando código profissional.",
    initialCode: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Curso de Programação Web",
  "description": "Aprenda desenvolvimento web do zero ao profissional."
}
</script>`,
    hints: ["JSON-LD é o formato recomendado pelo Google para SEO rico.","Especifica tipo Course, Produto, Artigo ou Organização.","Permite que seu site apareça com estrelas e detalhes nas buscas."],
    expectedConditionText: "<script type=\"application/ld+json\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Dados Estruturados JSON-LD (Schema.org)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Dados Estruturados JSON-LD (Schema.org)</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /type="application\/ld\+json"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <script type="application/ld+json">',
      };
    },
  },
  {
    id: 118,
    title: "Fase 118: Acessibilidade: ARIA Live Regions (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie área de notificação anunciada por leitores de tela com rigor de produção",
    puzzleDescription: "Acessibilidade (a11y) indispensável para conformidade WCAG e governos. Neste desafio prático você irá dominar Acessibilidade: ARIA Live Regions aplicando código profissional.",
    initialCode: `<div role="status" aria-live="polite" class="notificacao">
  Item salvo com sucesso!
</div>`,
    hints: ["aria-live avisa leitores de tela quando o conteúdo da div mudar.","polite espera o leitor terminar a frase antes de falar.","Garante inclusão para deficientes visuais."],
    expectedConditionText: "role=\"status\" aria-live=\"polite\"",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Acessibilidade: ARIA Live Regions","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Acessibilidade: ARIA Live Regions</span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /aria-live="polite"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: role="status" aria-live="polite"',
      };
    },
  },
  {
    id: 119,
    title: "Fase 119: Web Components: <template> & <slot> (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Declare um modelo reutilizável que não é renderizado na carga inicial com rigor de produção",
    puzzleDescription: "Reutilização de fragmentos de interface sem framework. Neste desafio prático você irá dominar Web Components: <template> & <slot> aplicando código profissional.",
    initialCode: `<template id="card-usuario">
  <div class="card">
    <h3><slot name="nome">Nome Padrão</slot></h3>
    <p><slot name="bio">Biografia</slot></p>
  </div>
</template>`,
    hints: ["<template> guarda HTML inativo para clonagem via JavaScript.","<slot> define pontos de injeção de conteúdo customizado.","Base dos Web Components nativos do navegador."],
    expectedConditionText: "<template id=\"card-usuario\"> com <slot>",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Web Components: <template> & <slot>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Web Components: <template> & <slot></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<template\s+id="card-usuario">/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <template id="card-usuario"> com <slot>',
      };
    },
  },
  {
    id: 120,
    title: "Fase 120: Controles de Mídia: <video> com <track> (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Adicione vídeo com legendas acessíveis usando a tag <track> com rigor de produção",
    puzzleDescription: "Mídia profissional com legenda e suporte a acessibilidade auditiva. Neste desafio prático você irá dominar Controles de Mídia: <video> com <track> aplicando código profissional.",
    initialCode: `<video controls width="640">
  <source src="aula.mp4" type="video/mp4">
  <track src="legendas-pt.vtt" kind="subtitles" srclang="pt" label="Português">
  Seu navegador não suporta vídeos.
</video>`,
    hints: ["<track> vincula arquivos .vtt de legendas e audiodescrição.","kind=\"subtitles\" habilita legendas.","srclang=\"pt\" especifica o idioma português."],
    expectedConditionText: "<track src=\"...\" kind=\"subtitles\" srclang=\"pt\">",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Controles de Mídia: <video> com <track>","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Controles de Mídia: <video> com <track></span>: Pronto para validação.</div>","successBadge":"Especialista HTML"},
    validate: (rawCode) => {
      const passed = /<track[\s\S]*kind="subtitles"/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: <track src="..." kind="subtitles" srclang="pt">',
      };
    },
  },
];
