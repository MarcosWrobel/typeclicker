import { GameLevel } from './types';

export const CSS_EXTRA_LEVELS: GameLevel[] = [
  {
    id: 21,
    title: "Fase 21: CSS Grid: grid-template-columns auto-fit",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma grade responsiva com repeat(auto-fit, minmax(250px, 1fr))",
    puzzleDescription: "O layout mais flexível e responsivo para catálogos modernos. Neste desafio prático você irá dominar CSS Grid: grid-template-columns auto-fit aplicando código profissional.",
    initialCode: `.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}`,
    hints: ["auto-fit preenche as colunas adaptando à largura da tela.","minmax(250px, 1fr) impede que fiquem menores que 250px.","Dispensam media queries para grids de cards."],
    expectedConditionText: "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CSS Grid: grid-template-columns auto-fit","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CSS Grid: grid-template-columns auto-fit</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /repeat\s*\(\s*auto-fit\s*,\s*minmax\s*\(\s*250px/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
      };
    },
  },
  {
    id: 22,
    title: "Fase 22: Variáveis CSS (Custom Properties)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Declare variáveis globais no :root e use com var()",
    puzzleDescription: "Base de todos os design systems modernos e modos escuro/claro. Neste desafio prático você irá dominar Variáveis CSS (Custom Properties) aplicando código profissional.",
    initialCode: `:root {
  --cor-primaria: #3b82f6;
  --espacamento-padrao: 16px;
}
.botao {
  background-color: var(--cor-primaria);
  padding: var(--espacamento-padrao);
}`,
    hints: ["Variáveis iniciam com dois hifens (--nome).","Declare no :root para escopo global.","Consuma usando var(--nome)."],
    expectedConditionText: "var(--cor-primaria)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Variáveis CSS (Custom Properties)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Variáveis CSS (Custom Properties)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /var\s*\(\s*--cor-primaria\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: var(--cor-primaria)',
      };
    },
  },
  {
    id: 23,
    title: "Fase 23: Backdrop Filter (Glassmorphism)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Aplique efeito de vidro translúcido com backdrop-filter: blur",
    puzzleDescription: "A estética visual mais requisitada em interfaces de sistemas modernos. Neste desafio prático você irá dominar Backdrop Filter (Glassmorphism) aplicando código profissional.",
    initialCode: `.cartao-vidro {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}`,
    hints: ["backdrop-filter desfoca o fundo atrás do elemento.","Combine com fundo semi-transparente rgba().","Adicione borda fina sutil para o efeito de vidro perfeito."],
    expectedConditionText: "backdrop-filter: blur(12px)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Backdrop Filter (Glassmorphism)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Backdrop Filter (Glassmorphism)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /backdrop-filter:\s*blur\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: backdrop-filter: blur(12px)',
      };
    },
  },
  {
    id: 24,
    title: "Fase 24: Animações com @keyframes & transform",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma animação de pulsação suave usando @keyframes",
    puzzleDescription: "Micro-interações fluidas e de alta taxa de quadros (60fps) na GPU. Neste desafio prático você irá dominar Animações com @keyframes & transform aplicando código profissional.",
    initialCode: `@keyframes pulsar {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.badge-ativo {
  animation: pulsar 2s infinite ease-in-out;
}`,
    hints: ["@keyframes define os estágios da animação.","transform: scale() altera a escala sem causar reflow.","Aplique na classe com a propriedade animation."],
    expectedConditionText: "@keyframes pulsar e animation: pulsar",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Animações com @keyframes & transform","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Animações com @keyframes & transform</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@keyframes\s+pulsar[\s\S]*animation:\s*pulsar/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @keyframes pulsar e animation: pulsar',
      };
    },
  },
  {
    id: 25,
    title: "Fase 25: Pseudo-classes Modernas: :has()",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o formulário quando contiver um campo inválido usando :has()",
    puzzleDescription: "Permite selecionar elementos pais com base no estado de seus filhos. Neste desafio prático você irá dominar Pseudo-classes Modernas: :has() aplicando código profissional.",
    initialCode: `form:has(input:invalid) {
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}`,
    hints: [":has() é o seletor de pai tão esperado no CSS.","form:has(input:invalid) aplica estilo no form se houver erro interno.","Revolucionou a escrita de CSS sem JavaScript."],
    expectedConditionText: "form:has(input:invalid)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Pseudo-classes Modernas: :has()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Pseudo-classes Modernas: :has()</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /form:has\s*\(\s*input:invalid\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: form:has(input:invalid)',
      };
    },
  },
  {
    id: 26,
    title: "Fase 26: Scroll Snap para Carrossel",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Configure rolagem magnética suave com scroll-snap-type",
    puzzleDescription: "Experiência tátil perfeita para galerias de imagens e stories mobile. Neste desafio prático você irá dominar Scroll Snap para Carrossel aplicando código profissional.",
    initialCode: `.carrossel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.carrossel-item {
  scroll-snap-align: center;
  flex-shrink: 0;
}`,
    hints: ["scroll-snap-type no contêiner define o eixo de travamento.","scroll-snap-align no filho define onde o item para (start/center).","Cria carrosséis nativos lisos em mobile."],
    expectedConditionText: "scroll-snap-type: x mandatory e scroll-snap-align: center",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Scroll Snap para Carrossel","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Scroll Snap para Carrossel</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /scroll-snap-type:\s*x\s+mandatory/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: scroll-snap-type: x mandatory e scroll-snap-align: center',
      };
    },
  },
  {
    id: 27,
    title: "Fase 27: Função clamp() para Tipografia Fluida",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie título com tamanho adaptável dinamicamente com clamp()",
    puzzleDescription: "Tipografia responsiva contínua que escala perfeitamente de relógios a TVs 4K. Neste desafio prático você irá dominar Função clamp() para Tipografia Fluida aplicando código profissional.",
    initialCode: `.titulo-hero {
  font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);
}`,
    hints: ["clamp() recebe valor mínimo, ideal e máximo.","Calcula o tamanho com base na largura da viewport.","Dispensa dezenas de media queries para fontes."],
    expectedConditionText: "font-size: clamp(minimo, ideal, maximo)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função clamp() para Tipografia Fluida","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função clamp() para Tipografia Fluida</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /font-size:\s*clamp\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: font-size: clamp(minimo, ideal, maximo)',
      };
    },
  },
  {
    id: 28,
    title: "Fase 28: Container Queries (@container)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o card com base na largura do seu contêiner pai",
    puzzleDescription: "Componentes verdadeiramente modulares independentes da tela global. Neste desafio prático você irá dominar Container Queries (@container) aplicando código profissional.",
    initialCode: `.container-card {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card-conteudo {
    display: flex;
    gap: 1rem;
  }
}`,
    hints: ["Container queries adaptam componentes ao espaço onde estão inseridos.","Defina container-type: inline-size no pai.","Escreva regras @container para os filhos."],
    expectedConditionText: "@container (min-width: ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Container Queries (@container)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Container Queries (@container)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@container\s*\(\s*min-width/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @container (min-width: ...)',
      };
    },
  },
  {
    id: 29,
    title: "Fase 29: Gradientes Cônicos e Efeitos de Borda",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie borda com gradiente arco-íris giratório usando conic-gradient",
    puzzleDescription: "Estilo cyber-moderno para avatares ativos e itens lendários. Neste desafio prático você irá dominar Gradientes Cônicos e Efeitos de Borda aplicando código profissional.",
    initialCode: `.borda-glow {
  background: conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  border-radius: 12px;
  padding: 2px;
}`,
    hints: ["conic-gradient gira as cores ao redor de um centro.","Perfeito para anéis de carregamento e bordas brilhantes.","Combine com animação de rotação para brilho ativo."],
    expectedConditionText: "conic-gradient(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Gradientes Cônicos e Efeitos de Borda","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Gradientes Cônicos e Efeitos de Borda</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /conic-gradient\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: conic-gradient(...)',
      };
    },
  },
  {
    id: 30,
    title: "Fase 30: Mix Blend Mode & Filtros",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Mescle texto sobre imagens usando mix-blend-mode: difference",
    puzzleDescription: "Design editorial avançado e tipografia artística interativa. Neste desafio prático você irá dominar Mix Blend Mode & Filtros aplicando código profissional.",
    initialCode: `.texto-contraste {
  mix-blend-mode: difference;
  color: #ffffff;
  font-weight: 800;
}`,
    hints: ["mix-blend-mode define como o elemento se mistura com o que está atrás.","difference inverte as cores gerando contraste perfeito.","Texto fica legível em qualquer fundo sem sombra."],
    expectedConditionText: "mix-blend-mode: difference",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Mix Blend Mode & Filtros","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Mix Blend Mode & Filtros</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /mix-blend-mode:\s*difference/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: mix-blend-mode: difference',
      };
    },
  },
  {
    id: 31,
    title: "Fase 31: CSS Grid: grid-template-columns auto-fit (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma grade responsiva com repeat(auto-fit, minmax(250px, 1fr)) com rigor de produção",
    puzzleDescription: "O layout mais flexível e responsivo para catálogos modernos. Neste desafio prático você irá dominar CSS Grid: grid-template-columns auto-fit aplicando código profissional.",
    initialCode: `.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}`,
    hints: ["auto-fit preenche as colunas adaptando à largura da tela.","minmax(250px, 1fr) impede que fiquem menores que 250px.","Dispensam media queries para grids de cards."],
    expectedConditionText: "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CSS Grid: grid-template-columns auto-fit","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CSS Grid: grid-template-columns auto-fit</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /repeat\s*\(\s*auto-fit\s*,\s*minmax\s*\(\s*250px/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
      };
    },
  },
  {
    id: 32,
    title: "Fase 32: Variáveis CSS (Custom Properties) (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Declare variáveis globais no :root e use com var() com rigor de produção",
    puzzleDescription: "Base de todos os design systems modernos e modos escuro/claro. Neste desafio prático você irá dominar Variáveis CSS (Custom Properties) aplicando código profissional.",
    initialCode: `:root {
  --cor-primaria: #3b82f6;
  --espacamento-padrao: 16px;
}
.botao {
  background-color: var(--cor-primaria);
  padding: var(--espacamento-padrao);
}`,
    hints: ["Variáveis iniciam com dois hifens (--nome).","Declare no :root para escopo global.","Consuma usando var(--nome)."],
    expectedConditionText: "var(--cor-primaria)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Variáveis CSS (Custom Properties)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Variáveis CSS (Custom Properties)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /var\s*\(\s*--cor-primaria\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: var(--cor-primaria)',
      };
    },
  },
  {
    id: 33,
    title: "Fase 33: Backdrop Filter (Glassmorphism) (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Aplique efeito de vidro translúcido com backdrop-filter: blur com rigor de produção",
    puzzleDescription: "A estética visual mais requisitada em interfaces de sistemas modernos. Neste desafio prático você irá dominar Backdrop Filter (Glassmorphism) aplicando código profissional.",
    initialCode: `.cartao-vidro {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}`,
    hints: ["backdrop-filter desfoca o fundo atrás do elemento.","Combine com fundo semi-transparente rgba().","Adicione borda fina sutil para o efeito de vidro perfeito."],
    expectedConditionText: "backdrop-filter: blur(12px)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Backdrop Filter (Glassmorphism)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Backdrop Filter (Glassmorphism)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /backdrop-filter:\s*blur\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: backdrop-filter: blur(12px)',
      };
    },
  },
  {
    id: 34,
    title: "Fase 34: Animações com @keyframes & transform (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma animação de pulsação suave usando @keyframes com rigor de produção",
    puzzleDescription: "Micro-interações fluidas e de alta taxa de quadros (60fps) na GPU. Neste desafio prático você irá dominar Animações com @keyframes & transform aplicando código profissional.",
    initialCode: `@keyframes pulsar {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.badge-ativo {
  animation: pulsar 2s infinite ease-in-out;
}`,
    hints: ["@keyframes define os estágios da animação.","transform: scale() altera a escala sem causar reflow.","Aplique na classe com a propriedade animation."],
    expectedConditionText: "@keyframes pulsar e animation: pulsar",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Animações com @keyframes & transform","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Animações com @keyframes & transform</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@keyframes\s+pulsar[\s\S]*animation:\s*pulsar/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @keyframes pulsar e animation: pulsar',
      };
    },
  },
  {
    id: 35,
    title: "Fase 35: Pseudo-classes Modernas: :has() (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o formulário quando contiver um campo inválido usando :has() com rigor de produção",
    puzzleDescription: "Permite selecionar elementos pais com base no estado de seus filhos. Neste desafio prático você irá dominar Pseudo-classes Modernas: :has() aplicando código profissional.",
    initialCode: `form:has(input:invalid) {
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}`,
    hints: [":has() é o seletor de pai tão esperado no CSS.","form:has(input:invalid) aplica estilo no form se houver erro interno.","Revolucionou a escrita de CSS sem JavaScript."],
    expectedConditionText: "form:has(input:invalid)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Pseudo-classes Modernas: :has()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Pseudo-classes Modernas: :has()</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /form:has\s*\(\s*input:invalid\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: form:has(input:invalid)',
      };
    },
  },
  {
    id: 36,
    title: "Fase 36: Scroll Snap para Carrossel (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Configure rolagem magnética suave com scroll-snap-type com rigor de produção",
    puzzleDescription: "Experiência tátil perfeita para galerias de imagens e stories mobile. Neste desafio prático você irá dominar Scroll Snap para Carrossel aplicando código profissional.",
    initialCode: `.carrossel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.carrossel-item {
  scroll-snap-align: center;
  flex-shrink: 0;
}`,
    hints: ["scroll-snap-type no contêiner define o eixo de travamento.","scroll-snap-align no filho define onde o item para (start/center).","Cria carrosséis nativos lisos em mobile."],
    expectedConditionText: "scroll-snap-type: x mandatory e scroll-snap-align: center",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Scroll Snap para Carrossel","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Scroll Snap para Carrossel</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /scroll-snap-type:\s*x\s+mandatory/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: scroll-snap-type: x mandatory e scroll-snap-align: center',
      };
    },
  },
  {
    id: 37,
    title: "Fase 37: Função clamp() para Tipografia Fluida (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie título com tamanho adaptável dinamicamente com clamp() com rigor de produção",
    puzzleDescription: "Tipografia responsiva contínua que escala perfeitamente de relógios a TVs 4K. Neste desafio prático você irá dominar Função clamp() para Tipografia Fluida aplicando código profissional.",
    initialCode: `.titulo-hero {
  font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);
}`,
    hints: ["clamp() recebe valor mínimo, ideal e máximo.","Calcula o tamanho com base na largura da viewport.","Dispensa dezenas de media queries para fontes."],
    expectedConditionText: "font-size: clamp(minimo, ideal, maximo)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função clamp() para Tipografia Fluida","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função clamp() para Tipografia Fluida</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /font-size:\s*clamp\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: font-size: clamp(minimo, ideal, maximo)',
      };
    },
  },
  {
    id: 38,
    title: "Fase 38: Container Queries (@container) (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o card com base na largura do seu contêiner pai com rigor de produção",
    puzzleDescription: "Componentes verdadeiramente modulares independentes da tela global. Neste desafio prático você irá dominar Container Queries (@container) aplicando código profissional.",
    initialCode: `.container-card {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card-conteudo {
    display: flex;
    gap: 1rem;
  }
}`,
    hints: ["Container queries adaptam componentes ao espaço onde estão inseridos.","Defina container-type: inline-size no pai.","Escreva regras @container para os filhos."],
    expectedConditionText: "@container (min-width: ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Container Queries (@container)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Container Queries (@container)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@container\s*\(\s*min-width/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @container (min-width: ...)',
      };
    },
  },
  {
    id: 39,
    title: "Fase 39: Gradientes Cônicos e Efeitos de Borda (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Crie borda com gradiente arco-íris giratório usando conic-gradient com rigor de produção",
    puzzleDescription: "Estilo cyber-moderno para avatares ativos e itens lendários. Neste desafio prático você irá dominar Gradientes Cônicos e Efeitos de Borda aplicando código profissional.",
    initialCode: `.borda-glow {
  background: conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  border-radius: 12px;
  padding: 2px;
}`,
    hints: ["conic-gradient gira as cores ao redor de um centro.","Perfeito para anéis de carregamento e bordas brilhantes.","Combine com animação de rotação para brilho ativo."],
    expectedConditionText: "conic-gradient(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Gradientes Cônicos e Efeitos de Borda","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Gradientes Cônicos e Efeitos de Borda</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /conic-gradient\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: conic-gradient(...)',
      };
    },
  },
  {
    id: 40,
    title: "Fase 40: Mix Blend Mode & Filtros (Nível Avançado 2)",
    themeStyle: "web-component",
    themeCategory: 'web-builder',
    targetObjective: "Mescle texto sobre imagens usando mix-blend-mode: difference com rigor de produção",
    puzzleDescription: "Design editorial avançado e tipografia artística interativa. Neste desafio prático você irá dominar Mix Blend Mode & Filtros aplicando código profissional.",
    initialCode: `.texto-contraste {
  mix-blend-mode: difference;
  color: #ffffff;
  font-weight: 800;
}`,
    hints: ["mix-blend-mode define como o elemento se mistura com o que está atrás.","difference inverte as cores gerando contraste perfeito.","Texto fica legível em qualquer fundo sem sombra."],
    expectedConditionText: "mix-blend-mode: difference",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Mix Blend Mode & Filtros","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Mix Blend Mode & Filtros</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /mix-blend-mode:\s*difference/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: mix-blend-mode: difference',
      };
    },
  },
  {
    id: 41,
    title: "Fase 41: CSS Grid: grid-template-columns auto-fit (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma grade responsiva com repeat(auto-fit, minmax(250px, 1fr)) com rigor de produção",
    puzzleDescription: "O layout mais flexível e responsivo para catálogos modernos. Neste desafio prático você irá dominar CSS Grid: grid-template-columns auto-fit aplicando código profissional.",
    initialCode: `.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}`,
    hints: ["auto-fit preenche as colunas adaptando à largura da tela.","minmax(250px, 1fr) impede que fiquem menores que 250px.","Dispensam media queries para grids de cards."],
    expectedConditionText: "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CSS Grid: grid-template-columns auto-fit","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CSS Grid: grid-template-columns auto-fit</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /repeat\s*\(\s*auto-fit\s*,\s*minmax\s*\(\s*250px/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
      };
    },
  },
  {
    id: 42,
    title: "Fase 42: Variáveis CSS (Custom Properties) (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Declare variáveis globais no :root e use com var() com rigor de produção",
    puzzleDescription: "Base de todos os design systems modernos e modos escuro/claro. Neste desafio prático você irá dominar Variáveis CSS (Custom Properties) aplicando código profissional.",
    initialCode: `:root {
  --cor-primaria: #3b82f6;
  --espacamento-padrao: 16px;
}
.botao {
  background-color: var(--cor-primaria);
  padding: var(--espacamento-padrao);
}`,
    hints: ["Variáveis iniciam com dois hifens (--nome).","Declare no :root para escopo global.","Consuma usando var(--nome)."],
    expectedConditionText: "var(--cor-primaria)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Variáveis CSS (Custom Properties)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Variáveis CSS (Custom Properties)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /var\s*\(\s*--cor-primaria\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: var(--cor-primaria)',
      };
    },
  },
  {
    id: 43,
    title: "Fase 43: Backdrop Filter (Glassmorphism) (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Aplique efeito de vidro translúcido com backdrop-filter: blur com rigor de produção",
    puzzleDescription: "A estética visual mais requisitada em interfaces de sistemas modernos. Neste desafio prático você irá dominar Backdrop Filter (Glassmorphism) aplicando código profissional.",
    initialCode: `.cartao-vidro {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}`,
    hints: ["backdrop-filter desfoca o fundo atrás do elemento.","Combine com fundo semi-transparente rgba().","Adicione borda fina sutil para o efeito de vidro perfeito."],
    expectedConditionText: "backdrop-filter: blur(12px)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Backdrop Filter (Glassmorphism)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Backdrop Filter (Glassmorphism)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /backdrop-filter:\s*blur\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: backdrop-filter: blur(12px)',
      };
    },
  },
  {
    id: 44,
    title: "Fase 44: Animações com @keyframes & transform (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma animação de pulsação suave usando @keyframes com rigor de produção",
    puzzleDescription: "Micro-interações fluidas e de alta taxa de quadros (60fps) na GPU. Neste desafio prático você irá dominar Animações com @keyframes & transform aplicando código profissional.",
    initialCode: `@keyframes pulsar {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.badge-ativo {
  animation: pulsar 2s infinite ease-in-out;
}`,
    hints: ["@keyframes define os estágios da animação.","transform: scale() altera a escala sem causar reflow.","Aplique na classe com a propriedade animation."],
    expectedConditionText: "@keyframes pulsar e animation: pulsar",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Animações com @keyframes & transform","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Animações com @keyframes & transform</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@keyframes\s+pulsar[\s\S]*animation:\s*pulsar/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @keyframes pulsar e animation: pulsar',
      };
    },
  },
  {
    id: 45,
    title: "Fase 45: Pseudo-classes Modernas: :has() (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o formulário quando contiver um campo inválido usando :has() com rigor de produção",
    puzzleDescription: "Permite selecionar elementos pais com base no estado de seus filhos. Neste desafio prático você irá dominar Pseudo-classes Modernas: :has() aplicando código profissional.",
    initialCode: `form:has(input:invalid) {
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}`,
    hints: [":has() é o seletor de pai tão esperado no CSS.","form:has(input:invalid) aplica estilo no form se houver erro interno.","Revolucionou a escrita de CSS sem JavaScript."],
    expectedConditionText: "form:has(input:invalid)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Pseudo-classes Modernas: :has()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Pseudo-classes Modernas: :has()</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /form:has\s*\(\s*input:invalid\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: form:has(input:invalid)',
      };
    },
  },
  {
    id: 46,
    title: "Fase 46: Scroll Snap para Carrossel (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Configure rolagem magnética suave com scroll-snap-type com rigor de produção",
    puzzleDescription: "Experiência tátil perfeita para galerias de imagens e stories mobile. Neste desafio prático você irá dominar Scroll Snap para Carrossel aplicando código profissional.",
    initialCode: `.carrossel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.carrossel-item {
  scroll-snap-align: center;
  flex-shrink: 0;
}`,
    hints: ["scroll-snap-type no contêiner define o eixo de travamento.","scroll-snap-align no filho define onde o item para (start/center).","Cria carrosséis nativos lisos em mobile."],
    expectedConditionText: "scroll-snap-type: x mandatory e scroll-snap-align: center",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Scroll Snap para Carrossel","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Scroll Snap para Carrossel</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /scroll-snap-type:\s*x\s+mandatory/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: scroll-snap-type: x mandatory e scroll-snap-align: center',
      };
    },
  },
  {
    id: 47,
    title: "Fase 47: Função clamp() para Tipografia Fluida (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie título com tamanho adaptável dinamicamente com clamp() com rigor de produção",
    puzzleDescription: "Tipografia responsiva contínua que escala perfeitamente de relógios a TVs 4K. Neste desafio prático você irá dominar Função clamp() para Tipografia Fluida aplicando código profissional.",
    initialCode: `.titulo-hero {
  font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);
}`,
    hints: ["clamp() recebe valor mínimo, ideal e máximo.","Calcula o tamanho com base na largura da viewport.","Dispensa dezenas de media queries para fontes."],
    expectedConditionText: "font-size: clamp(minimo, ideal, maximo)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função clamp() para Tipografia Fluida","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função clamp() para Tipografia Fluida</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /font-size:\s*clamp\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: font-size: clamp(minimo, ideal, maximo)',
      };
    },
  },
  {
    id: 48,
    title: "Fase 48: Container Queries (@container) (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o card com base na largura do seu contêiner pai com rigor de produção",
    puzzleDescription: "Componentes verdadeiramente modulares independentes da tela global. Neste desafio prático você irá dominar Container Queries (@container) aplicando código profissional.",
    initialCode: `.container-card {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card-conteudo {
    display: flex;
    gap: 1rem;
  }
}`,
    hints: ["Container queries adaptam componentes ao espaço onde estão inseridos.","Defina container-type: inline-size no pai.","Escreva regras @container para os filhos."],
    expectedConditionText: "@container (min-width: ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Container Queries (@container)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Container Queries (@container)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@container\s*\(\s*min-width/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @container (min-width: ...)',
      };
    },
  },
  {
    id: 49,
    title: "Fase 49: Gradientes Cônicos e Efeitos de Borda (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie borda com gradiente arco-íris giratório usando conic-gradient com rigor de produção",
    puzzleDescription: "Estilo cyber-moderno para avatares ativos e itens lendários. Neste desafio prático você irá dominar Gradientes Cônicos e Efeitos de Borda aplicando código profissional.",
    initialCode: `.borda-glow {
  background: conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  border-radius: 12px;
  padding: 2px;
}`,
    hints: ["conic-gradient gira as cores ao redor de um centro.","Perfeito para anéis de carregamento e bordas brilhantes.","Combine com animação de rotação para brilho ativo."],
    expectedConditionText: "conic-gradient(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Gradientes Cônicos e Efeitos de Borda","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Gradientes Cônicos e Efeitos de Borda</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /conic-gradient\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: conic-gradient(...)',
      };
    },
  },
  {
    id: 50,
    title: "Fase 50: Mix Blend Mode & Filtros (Nível Avançado 3)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Mescle texto sobre imagens usando mix-blend-mode: difference com rigor de produção",
    puzzleDescription: "Design editorial avançado e tipografia artística interativa. Neste desafio prático você irá dominar Mix Blend Mode & Filtros aplicando código profissional.",
    initialCode: `.texto-contraste {
  mix-blend-mode: difference;
  color: #ffffff;
  font-weight: 800;
}`,
    hints: ["mix-blend-mode define como o elemento se mistura com o que está atrás.","difference inverte as cores gerando contraste perfeito.","Texto fica legível em qualquer fundo sem sombra."],
    expectedConditionText: "mix-blend-mode: difference",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Mix Blend Mode & Filtros","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Mix Blend Mode & Filtros</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /mix-blend-mode:\s*difference/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: mix-blend-mode: difference',
      };
    },
  },
  {
    id: 51,
    title: "Fase 51: CSS Grid: grid-template-columns auto-fit (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma grade responsiva com repeat(auto-fit, minmax(250px, 1fr)) com rigor de produção",
    puzzleDescription: "O layout mais flexível e responsivo para catálogos modernos. Neste desafio prático você irá dominar CSS Grid: grid-template-columns auto-fit aplicando código profissional.",
    initialCode: `.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}`,
    hints: ["auto-fit preenche as colunas adaptando à largura da tela.","minmax(250px, 1fr) impede que fiquem menores que 250px.","Dispensam media queries para grids de cards."],
    expectedConditionText: "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CSS Grid: grid-template-columns auto-fit","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CSS Grid: grid-template-columns auto-fit</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /repeat\s*\(\s*auto-fit\s*,\s*minmax\s*\(\s*250px/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
      };
    },
  },
  {
    id: 52,
    title: "Fase 52: Variáveis CSS (Custom Properties) (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Declare variáveis globais no :root e use com var() com rigor de produção",
    puzzleDescription: "Base de todos os design systems modernos e modos escuro/claro. Neste desafio prático você irá dominar Variáveis CSS (Custom Properties) aplicando código profissional.",
    initialCode: `:root {
  --cor-primaria: #3b82f6;
  --espacamento-padrao: 16px;
}
.botao {
  background-color: var(--cor-primaria);
  padding: var(--espacamento-padrao);
}`,
    hints: ["Variáveis iniciam com dois hifens (--nome).","Declare no :root para escopo global.","Consuma usando var(--nome)."],
    expectedConditionText: "var(--cor-primaria)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Variáveis CSS (Custom Properties)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Variáveis CSS (Custom Properties)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /var\s*\(\s*--cor-primaria\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: var(--cor-primaria)',
      };
    },
  },
  {
    id: 53,
    title: "Fase 53: Backdrop Filter (Glassmorphism) (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Aplique efeito de vidro translúcido com backdrop-filter: blur com rigor de produção",
    puzzleDescription: "A estética visual mais requisitada em interfaces de sistemas modernos. Neste desafio prático você irá dominar Backdrop Filter (Glassmorphism) aplicando código profissional.",
    initialCode: `.cartao-vidro {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}`,
    hints: ["backdrop-filter desfoca o fundo atrás do elemento.","Combine com fundo semi-transparente rgba().","Adicione borda fina sutil para o efeito de vidro perfeito."],
    expectedConditionText: "backdrop-filter: blur(12px)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Backdrop Filter (Glassmorphism)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Backdrop Filter (Glassmorphism)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /backdrop-filter:\s*blur\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: backdrop-filter: blur(12px)',
      };
    },
  },
  {
    id: 54,
    title: "Fase 54: Animações com @keyframes & transform (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma animação de pulsação suave usando @keyframes com rigor de produção",
    puzzleDescription: "Micro-interações fluidas e de alta taxa de quadros (60fps) na GPU. Neste desafio prático você irá dominar Animações com @keyframes & transform aplicando código profissional.",
    initialCode: `@keyframes pulsar {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.badge-ativo {
  animation: pulsar 2s infinite ease-in-out;
}`,
    hints: ["@keyframes define os estágios da animação.","transform: scale() altera a escala sem causar reflow.","Aplique na classe com a propriedade animation."],
    expectedConditionText: "@keyframes pulsar e animation: pulsar",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Animações com @keyframes & transform","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Animações com @keyframes & transform</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@keyframes\s+pulsar[\s\S]*animation:\s*pulsar/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @keyframes pulsar e animation: pulsar',
      };
    },
  },
  {
    id: 55,
    title: "Fase 55: Pseudo-classes Modernas: :has() (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o formulário quando contiver um campo inválido usando :has() com rigor de produção",
    puzzleDescription: "Permite selecionar elementos pais com base no estado de seus filhos. Neste desafio prático você irá dominar Pseudo-classes Modernas: :has() aplicando código profissional.",
    initialCode: `form:has(input:invalid) {
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}`,
    hints: [":has() é o seletor de pai tão esperado no CSS.","form:has(input:invalid) aplica estilo no form se houver erro interno.","Revolucionou a escrita de CSS sem JavaScript."],
    expectedConditionText: "form:has(input:invalid)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Pseudo-classes Modernas: :has()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Pseudo-classes Modernas: :has()</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /form:has\s*\(\s*input:invalid\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: form:has(input:invalid)',
      };
    },
  },
  {
    id: 56,
    title: "Fase 56: Scroll Snap para Carrossel (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Configure rolagem magnética suave com scroll-snap-type com rigor de produção",
    puzzleDescription: "Experiência tátil perfeita para galerias de imagens e stories mobile. Neste desafio prático você irá dominar Scroll Snap para Carrossel aplicando código profissional.",
    initialCode: `.carrossel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.carrossel-item {
  scroll-snap-align: center;
  flex-shrink: 0;
}`,
    hints: ["scroll-snap-type no contêiner define o eixo de travamento.","scroll-snap-align no filho define onde o item para (start/center).","Cria carrosséis nativos lisos em mobile."],
    expectedConditionText: "scroll-snap-type: x mandatory e scroll-snap-align: center",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Scroll Snap para Carrossel","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Scroll Snap para Carrossel</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /scroll-snap-type:\s*x\s+mandatory/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: scroll-snap-type: x mandatory e scroll-snap-align: center',
      };
    },
  },
  {
    id: 57,
    title: "Fase 57: Função clamp() para Tipografia Fluida (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie título com tamanho adaptável dinamicamente com clamp() com rigor de produção",
    puzzleDescription: "Tipografia responsiva contínua que escala perfeitamente de relógios a TVs 4K. Neste desafio prático você irá dominar Função clamp() para Tipografia Fluida aplicando código profissional.",
    initialCode: `.titulo-hero {
  font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);
}`,
    hints: ["clamp() recebe valor mínimo, ideal e máximo.","Calcula o tamanho com base na largura da viewport.","Dispensa dezenas de media queries para fontes."],
    expectedConditionText: "font-size: clamp(minimo, ideal, maximo)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função clamp() para Tipografia Fluida","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função clamp() para Tipografia Fluida</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /font-size:\s*clamp\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: font-size: clamp(minimo, ideal, maximo)',
      };
    },
  },
  {
    id: 58,
    title: "Fase 58: Container Queries (@container) (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o card com base na largura do seu contêiner pai com rigor de produção",
    puzzleDescription: "Componentes verdadeiramente modulares independentes da tela global. Neste desafio prático você irá dominar Container Queries (@container) aplicando código profissional.",
    initialCode: `.container-card {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card-conteudo {
    display: flex;
    gap: 1rem;
  }
}`,
    hints: ["Container queries adaptam componentes ao espaço onde estão inseridos.","Defina container-type: inline-size no pai.","Escreva regras @container para os filhos."],
    expectedConditionText: "@container (min-width: ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Container Queries (@container)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Container Queries (@container)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@container\s*\(\s*min-width/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @container (min-width: ...)',
      };
    },
  },
  {
    id: 59,
    title: "Fase 59: Gradientes Cônicos e Efeitos de Borda (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie borda com gradiente arco-íris giratório usando conic-gradient com rigor de produção",
    puzzleDescription: "Estilo cyber-moderno para avatares ativos e itens lendários. Neste desafio prático você irá dominar Gradientes Cônicos e Efeitos de Borda aplicando código profissional.",
    initialCode: `.borda-glow {
  background: conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  border-radius: 12px;
  padding: 2px;
}`,
    hints: ["conic-gradient gira as cores ao redor de um centro.","Perfeito para anéis de carregamento e bordas brilhantes.","Combine com animação de rotação para brilho ativo."],
    expectedConditionText: "conic-gradient(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Gradientes Cônicos e Efeitos de Borda","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Gradientes Cônicos e Efeitos de Borda</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /conic-gradient\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: conic-gradient(...)',
      };
    },
  },
  {
    id: 60,
    title: "Fase 60: Mix Blend Mode & Filtros (Nível Avançado 4)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Mescle texto sobre imagens usando mix-blend-mode: difference com rigor de produção",
    puzzleDescription: "Design editorial avançado e tipografia artística interativa. Neste desafio prático você irá dominar Mix Blend Mode & Filtros aplicando código profissional.",
    initialCode: `.texto-contraste {
  mix-blend-mode: difference;
  color: #ffffff;
  font-weight: 800;
}`,
    hints: ["mix-blend-mode define como o elemento se mistura com o que está atrás.","difference inverte as cores gerando contraste perfeito.","Texto fica legível em qualquer fundo sem sombra."],
    expectedConditionText: "mix-blend-mode: difference",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Mix Blend Mode & Filtros","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Mix Blend Mode & Filtros</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /mix-blend-mode:\s*difference/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: mix-blend-mode: difference',
      };
    },
  },
  {
    id: 61,
    title: "Fase 61: CSS Grid: grid-template-columns auto-fit (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma grade responsiva com repeat(auto-fit, minmax(250px, 1fr)) com rigor de produção",
    puzzleDescription: "O layout mais flexível e responsivo para catálogos modernos. Neste desafio prático você irá dominar CSS Grid: grid-template-columns auto-fit aplicando código profissional.",
    initialCode: `.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}`,
    hints: ["auto-fit preenche as colunas adaptando à largura da tela.","minmax(250px, 1fr) impede que fiquem menores que 250px.","Dispensam media queries para grids de cards."],
    expectedConditionText: "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CSS Grid: grid-template-columns auto-fit","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CSS Grid: grid-template-columns auto-fit</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /repeat\s*\(\s*auto-fit\s*,\s*minmax\s*\(\s*250px/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
      };
    },
  },
  {
    id: 62,
    title: "Fase 62: Variáveis CSS (Custom Properties) (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Declare variáveis globais no :root e use com var() com rigor de produção",
    puzzleDescription: "Base de todos os design systems modernos e modos escuro/claro. Neste desafio prático você irá dominar Variáveis CSS (Custom Properties) aplicando código profissional.",
    initialCode: `:root {
  --cor-primaria: #3b82f6;
  --espacamento-padrao: 16px;
}
.botao {
  background-color: var(--cor-primaria);
  padding: var(--espacamento-padrao);
}`,
    hints: ["Variáveis iniciam com dois hifens (--nome).","Declare no :root para escopo global.","Consuma usando var(--nome)."],
    expectedConditionText: "var(--cor-primaria)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Variáveis CSS (Custom Properties)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Variáveis CSS (Custom Properties)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /var\s*\(\s*--cor-primaria\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: var(--cor-primaria)',
      };
    },
  },
  {
    id: 63,
    title: "Fase 63: Backdrop Filter (Glassmorphism) (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Aplique efeito de vidro translúcido com backdrop-filter: blur com rigor de produção",
    puzzleDescription: "A estética visual mais requisitada em interfaces de sistemas modernos. Neste desafio prático você irá dominar Backdrop Filter (Glassmorphism) aplicando código profissional.",
    initialCode: `.cartao-vidro {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}`,
    hints: ["backdrop-filter desfoca o fundo atrás do elemento.","Combine com fundo semi-transparente rgba().","Adicione borda fina sutil para o efeito de vidro perfeito."],
    expectedConditionText: "backdrop-filter: blur(12px)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Backdrop Filter (Glassmorphism)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Backdrop Filter (Glassmorphism)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /backdrop-filter:\s*blur\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: backdrop-filter: blur(12px)',
      };
    },
  },
  {
    id: 64,
    title: "Fase 64: Animações com @keyframes & transform (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma animação de pulsação suave usando @keyframes com rigor de produção",
    puzzleDescription: "Micro-interações fluidas e de alta taxa de quadros (60fps) na GPU. Neste desafio prático você irá dominar Animações com @keyframes & transform aplicando código profissional.",
    initialCode: `@keyframes pulsar {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.badge-ativo {
  animation: pulsar 2s infinite ease-in-out;
}`,
    hints: ["@keyframes define os estágios da animação.","transform: scale() altera a escala sem causar reflow.","Aplique na classe com a propriedade animation."],
    expectedConditionText: "@keyframes pulsar e animation: pulsar",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Animações com @keyframes & transform","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Animações com @keyframes & transform</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@keyframes\s+pulsar[\s\S]*animation:\s*pulsar/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @keyframes pulsar e animation: pulsar',
      };
    },
  },
  {
    id: 65,
    title: "Fase 65: Pseudo-classes Modernas: :has() (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o formulário quando contiver um campo inválido usando :has() com rigor de produção",
    puzzleDescription: "Permite selecionar elementos pais com base no estado de seus filhos. Neste desafio prático você irá dominar Pseudo-classes Modernas: :has() aplicando código profissional.",
    initialCode: `form:has(input:invalid) {
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}`,
    hints: [":has() é o seletor de pai tão esperado no CSS.","form:has(input:invalid) aplica estilo no form se houver erro interno.","Revolucionou a escrita de CSS sem JavaScript."],
    expectedConditionText: "form:has(input:invalid)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Pseudo-classes Modernas: :has()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Pseudo-classes Modernas: :has()</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /form:has\s*\(\s*input:invalid\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: form:has(input:invalid)',
      };
    },
  },
  {
    id: 66,
    title: "Fase 66: Scroll Snap para Carrossel (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Configure rolagem magnética suave com scroll-snap-type com rigor de produção",
    puzzleDescription: "Experiência tátil perfeita para galerias de imagens e stories mobile. Neste desafio prático você irá dominar Scroll Snap para Carrossel aplicando código profissional.",
    initialCode: `.carrossel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.carrossel-item {
  scroll-snap-align: center;
  flex-shrink: 0;
}`,
    hints: ["scroll-snap-type no contêiner define o eixo de travamento.","scroll-snap-align no filho define onde o item para (start/center).","Cria carrosséis nativos lisos em mobile."],
    expectedConditionText: "scroll-snap-type: x mandatory e scroll-snap-align: center",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Scroll Snap para Carrossel","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Scroll Snap para Carrossel</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /scroll-snap-type:\s*x\s+mandatory/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: scroll-snap-type: x mandatory e scroll-snap-align: center',
      };
    },
  },
  {
    id: 67,
    title: "Fase 67: Função clamp() para Tipografia Fluida (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie título com tamanho adaptável dinamicamente com clamp() com rigor de produção",
    puzzleDescription: "Tipografia responsiva contínua que escala perfeitamente de relógios a TVs 4K. Neste desafio prático você irá dominar Função clamp() para Tipografia Fluida aplicando código profissional.",
    initialCode: `.titulo-hero {
  font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);
}`,
    hints: ["clamp() recebe valor mínimo, ideal e máximo.","Calcula o tamanho com base na largura da viewport.","Dispensa dezenas de media queries para fontes."],
    expectedConditionText: "font-size: clamp(minimo, ideal, maximo)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função clamp() para Tipografia Fluida","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função clamp() para Tipografia Fluida</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /font-size:\s*clamp\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: font-size: clamp(minimo, ideal, maximo)',
      };
    },
  },
  {
    id: 68,
    title: "Fase 68: Container Queries (@container) (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o card com base na largura do seu contêiner pai com rigor de produção",
    puzzleDescription: "Componentes verdadeiramente modulares independentes da tela global. Neste desafio prático você irá dominar Container Queries (@container) aplicando código profissional.",
    initialCode: `.container-card {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card-conteudo {
    display: flex;
    gap: 1rem;
  }
}`,
    hints: ["Container queries adaptam componentes ao espaço onde estão inseridos.","Defina container-type: inline-size no pai.","Escreva regras @container para os filhos."],
    expectedConditionText: "@container (min-width: ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Container Queries (@container)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Container Queries (@container)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@container\s*\(\s*min-width/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @container (min-width: ...)',
      };
    },
  },
  {
    id: 69,
    title: "Fase 69: Gradientes Cônicos e Efeitos de Borda (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Crie borda com gradiente arco-íris giratório usando conic-gradient com rigor de produção",
    puzzleDescription: "Estilo cyber-moderno para avatares ativos e itens lendários. Neste desafio prático você irá dominar Gradientes Cônicos e Efeitos de Borda aplicando código profissional.",
    initialCode: `.borda-glow {
  background: conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  border-radius: 12px;
  padding: 2px;
}`,
    hints: ["conic-gradient gira as cores ao redor de um centro.","Perfeito para anéis de carregamento e bordas brilhantes.","Combine com animação de rotação para brilho ativo."],
    expectedConditionText: "conic-gradient(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Gradientes Cônicos e Efeitos de Borda","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Gradientes Cônicos e Efeitos de Borda</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /conic-gradient\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: conic-gradient(...)',
      };
    },
  },
  {
    id: 70,
    title: "Fase 70: Mix Blend Mode & Filtros (Nível Avançado 5)",
    themeStyle: "web-layout",
    themeCategory: 'web-builder',
    targetObjective: "Mescle texto sobre imagens usando mix-blend-mode: difference com rigor de produção",
    puzzleDescription: "Design editorial avançado e tipografia artística interativa. Neste desafio prático você irá dominar Mix Blend Mode & Filtros aplicando código profissional.",
    initialCode: `.texto-contraste {
  mix-blend-mode: difference;
  color: #ffffff;
  font-weight: 800;
}`,
    hints: ["mix-blend-mode define como o elemento se mistura com o que está atrás.","difference inverte as cores gerando contraste perfeito.","Texto fica legível em qualquer fundo sem sombra."],
    expectedConditionText: "mix-blend-mode: difference",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Mix Blend Mode & Filtros","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Mix Blend Mode & Filtros</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /mix-blend-mode:\s*difference/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: mix-blend-mode: difference',
      };
    },
  },
  {
    id: 71,
    title: "Fase 71: CSS Grid: grid-template-columns auto-fit (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma grade responsiva com repeat(auto-fit, minmax(250px, 1fr)) com rigor de produção",
    puzzleDescription: "O layout mais flexível e responsivo para catálogos modernos. Neste desafio prático você irá dominar CSS Grid: grid-template-columns auto-fit aplicando código profissional.",
    initialCode: `.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}`,
    hints: ["auto-fit preenche as colunas adaptando à largura da tela.","minmax(250px, 1fr) impede que fiquem menores que 250px.","Dispensam media queries para grids de cards."],
    expectedConditionText: "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CSS Grid: grid-template-columns auto-fit","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CSS Grid: grid-template-columns auto-fit</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /repeat\s*\(\s*auto-fit\s*,\s*minmax\s*\(\s*250px/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
      };
    },
  },
  {
    id: 72,
    title: "Fase 72: Variáveis CSS (Custom Properties) (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Declare variáveis globais no :root e use com var() com rigor de produção",
    puzzleDescription: "Base de todos os design systems modernos e modos escuro/claro. Neste desafio prático você irá dominar Variáveis CSS (Custom Properties) aplicando código profissional.",
    initialCode: `:root {
  --cor-primaria: #3b82f6;
  --espacamento-padrao: 16px;
}
.botao {
  background-color: var(--cor-primaria);
  padding: var(--espacamento-padrao);
}`,
    hints: ["Variáveis iniciam com dois hifens (--nome).","Declare no :root para escopo global.","Consuma usando var(--nome)."],
    expectedConditionText: "var(--cor-primaria)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Variáveis CSS (Custom Properties)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Variáveis CSS (Custom Properties)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /var\s*\(\s*--cor-primaria\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: var(--cor-primaria)',
      };
    },
  },
  {
    id: 73,
    title: "Fase 73: Backdrop Filter (Glassmorphism) (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Aplique efeito de vidro translúcido com backdrop-filter: blur com rigor de produção",
    puzzleDescription: "A estética visual mais requisitada em interfaces de sistemas modernos. Neste desafio prático você irá dominar Backdrop Filter (Glassmorphism) aplicando código profissional.",
    initialCode: `.cartao-vidro {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}`,
    hints: ["backdrop-filter desfoca o fundo atrás do elemento.","Combine com fundo semi-transparente rgba().","Adicione borda fina sutil para o efeito de vidro perfeito."],
    expectedConditionText: "backdrop-filter: blur(12px)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Backdrop Filter (Glassmorphism)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Backdrop Filter (Glassmorphism)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /backdrop-filter:\s*blur\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: backdrop-filter: blur(12px)',
      };
    },
  },
  {
    id: 74,
    title: "Fase 74: Animações com @keyframes & transform (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma animação de pulsação suave usando @keyframes com rigor de produção",
    puzzleDescription: "Micro-interações fluidas e de alta taxa de quadros (60fps) na GPU. Neste desafio prático você irá dominar Animações com @keyframes & transform aplicando código profissional.",
    initialCode: `@keyframes pulsar {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.badge-ativo {
  animation: pulsar 2s infinite ease-in-out;
}`,
    hints: ["@keyframes define os estágios da animação.","transform: scale() altera a escala sem causar reflow.","Aplique na classe com a propriedade animation."],
    expectedConditionText: "@keyframes pulsar e animation: pulsar",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Animações com @keyframes & transform","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Animações com @keyframes & transform</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@keyframes\s+pulsar[\s\S]*animation:\s*pulsar/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @keyframes pulsar e animation: pulsar',
      };
    },
  },
  {
    id: 75,
    title: "Fase 75: Pseudo-classes Modernas: :has() (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o formulário quando contiver um campo inválido usando :has() com rigor de produção",
    puzzleDescription: "Permite selecionar elementos pais com base no estado de seus filhos. Neste desafio prático você irá dominar Pseudo-classes Modernas: :has() aplicando código profissional.",
    initialCode: `form:has(input:invalid) {
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}`,
    hints: [":has() é o seletor de pai tão esperado no CSS.","form:has(input:invalid) aplica estilo no form se houver erro interno.","Revolucionou a escrita de CSS sem JavaScript."],
    expectedConditionText: "form:has(input:invalid)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Pseudo-classes Modernas: :has()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Pseudo-classes Modernas: :has()</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /form:has\s*\(\s*input:invalid\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: form:has(input:invalid)',
      };
    },
  },
  {
    id: 76,
    title: "Fase 76: Scroll Snap para Carrossel (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Configure rolagem magnética suave com scroll-snap-type com rigor de produção",
    puzzleDescription: "Experiência tátil perfeita para galerias de imagens e stories mobile. Neste desafio prático você irá dominar Scroll Snap para Carrossel aplicando código profissional.",
    initialCode: `.carrossel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.carrossel-item {
  scroll-snap-align: center;
  flex-shrink: 0;
}`,
    hints: ["scroll-snap-type no contêiner define o eixo de travamento.","scroll-snap-align no filho define onde o item para (start/center).","Cria carrosséis nativos lisos em mobile."],
    expectedConditionText: "scroll-snap-type: x mandatory e scroll-snap-align: center",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Scroll Snap para Carrossel","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Scroll Snap para Carrossel</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /scroll-snap-type:\s*x\s+mandatory/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: scroll-snap-type: x mandatory e scroll-snap-align: center',
      };
    },
  },
  {
    id: 77,
    title: "Fase 77: Função clamp() para Tipografia Fluida (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie título com tamanho adaptável dinamicamente com clamp() com rigor de produção",
    puzzleDescription: "Tipografia responsiva contínua que escala perfeitamente de relógios a TVs 4K. Neste desafio prático você irá dominar Função clamp() para Tipografia Fluida aplicando código profissional.",
    initialCode: `.titulo-hero {
  font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);
}`,
    hints: ["clamp() recebe valor mínimo, ideal e máximo.","Calcula o tamanho com base na largura da viewport.","Dispensa dezenas de media queries para fontes."],
    expectedConditionText: "font-size: clamp(minimo, ideal, maximo)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função clamp() para Tipografia Fluida","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função clamp() para Tipografia Fluida</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /font-size:\s*clamp\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: font-size: clamp(minimo, ideal, maximo)',
      };
    },
  },
  {
    id: 78,
    title: "Fase 78: Container Queries (@container) (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o card com base na largura do seu contêiner pai com rigor de produção",
    puzzleDescription: "Componentes verdadeiramente modulares independentes da tela global. Neste desafio prático você irá dominar Container Queries (@container) aplicando código profissional.",
    initialCode: `.container-card {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card-conteudo {
    display: flex;
    gap: 1rem;
  }
}`,
    hints: ["Container queries adaptam componentes ao espaço onde estão inseridos.","Defina container-type: inline-size no pai.","Escreva regras @container para os filhos."],
    expectedConditionText: "@container (min-width: ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Container Queries (@container)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Container Queries (@container)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@container\s*\(\s*min-width/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @container (min-width: ...)',
      };
    },
  },
  {
    id: 79,
    title: "Fase 79: Gradientes Cônicos e Efeitos de Borda (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie borda com gradiente arco-íris giratório usando conic-gradient com rigor de produção",
    puzzleDescription: "Estilo cyber-moderno para avatares ativos e itens lendários. Neste desafio prático você irá dominar Gradientes Cônicos e Efeitos de Borda aplicando código profissional.",
    initialCode: `.borda-glow {
  background: conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  border-radius: 12px;
  padding: 2px;
}`,
    hints: ["conic-gradient gira as cores ao redor de um centro.","Perfeito para anéis de carregamento e bordas brilhantes.","Combine com animação de rotação para brilho ativo."],
    expectedConditionText: "conic-gradient(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Gradientes Cônicos e Efeitos de Borda","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Gradientes Cônicos e Efeitos de Borda</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /conic-gradient\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: conic-gradient(...)',
      };
    },
  },
  {
    id: 80,
    title: "Fase 80: Mix Blend Mode & Filtros (Nível Avançado 6)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Mescle texto sobre imagens usando mix-blend-mode: difference com rigor de produção",
    puzzleDescription: "Design editorial avançado e tipografia artística interativa. Neste desafio prático você irá dominar Mix Blend Mode & Filtros aplicando código profissional.",
    initialCode: `.texto-contraste {
  mix-blend-mode: difference;
  color: #ffffff;
  font-weight: 800;
}`,
    hints: ["mix-blend-mode define como o elemento se mistura com o que está atrás.","difference inverte as cores gerando contraste perfeito.","Texto fica legível em qualquer fundo sem sombra."],
    expectedConditionText: "mix-blend-mode: difference",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Mix Blend Mode & Filtros","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Mix Blend Mode & Filtros</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /mix-blend-mode:\s*difference/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: mix-blend-mode: difference',
      };
    },
  },
  {
    id: 81,
    title: "Fase 81: CSS Grid: grid-template-columns auto-fit (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma grade responsiva com repeat(auto-fit, minmax(250px, 1fr)) com rigor de produção",
    puzzleDescription: "O layout mais flexível e responsivo para catálogos modernos. Neste desafio prático você irá dominar CSS Grid: grid-template-columns auto-fit aplicando código profissional.",
    initialCode: `.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}`,
    hints: ["auto-fit preenche as colunas adaptando à largura da tela.","minmax(250px, 1fr) impede que fiquem menores que 250px.","Dispensam media queries para grids de cards."],
    expectedConditionText: "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CSS Grid: grid-template-columns auto-fit","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CSS Grid: grid-template-columns auto-fit</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /repeat\s*\(\s*auto-fit\s*,\s*minmax\s*\(\s*250px/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
      };
    },
  },
  {
    id: 82,
    title: "Fase 82: Variáveis CSS (Custom Properties) (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Declare variáveis globais no :root e use com var() com rigor de produção",
    puzzleDescription: "Base de todos os design systems modernos e modos escuro/claro. Neste desafio prático você irá dominar Variáveis CSS (Custom Properties) aplicando código profissional.",
    initialCode: `:root {
  --cor-primaria: #3b82f6;
  --espacamento-padrao: 16px;
}
.botao {
  background-color: var(--cor-primaria);
  padding: var(--espacamento-padrao);
}`,
    hints: ["Variáveis iniciam com dois hifens (--nome).","Declare no :root para escopo global.","Consuma usando var(--nome)."],
    expectedConditionText: "var(--cor-primaria)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Variáveis CSS (Custom Properties)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Variáveis CSS (Custom Properties)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /var\s*\(\s*--cor-primaria\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: var(--cor-primaria)',
      };
    },
  },
  {
    id: 83,
    title: "Fase 83: Backdrop Filter (Glassmorphism) (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Aplique efeito de vidro translúcido com backdrop-filter: blur com rigor de produção",
    puzzleDescription: "A estética visual mais requisitada em interfaces de sistemas modernos. Neste desafio prático você irá dominar Backdrop Filter (Glassmorphism) aplicando código profissional.",
    initialCode: `.cartao-vidro {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}`,
    hints: ["backdrop-filter desfoca o fundo atrás do elemento.","Combine com fundo semi-transparente rgba().","Adicione borda fina sutil para o efeito de vidro perfeito."],
    expectedConditionText: "backdrop-filter: blur(12px)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Backdrop Filter (Glassmorphism)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Backdrop Filter (Glassmorphism)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /backdrop-filter:\s*blur\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: backdrop-filter: blur(12px)',
      };
    },
  },
  {
    id: 84,
    title: "Fase 84: Animações com @keyframes & transform (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma animação de pulsação suave usando @keyframes com rigor de produção",
    puzzleDescription: "Micro-interações fluidas e de alta taxa de quadros (60fps) na GPU. Neste desafio prático você irá dominar Animações com @keyframes & transform aplicando código profissional.",
    initialCode: `@keyframes pulsar {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.badge-ativo {
  animation: pulsar 2s infinite ease-in-out;
}`,
    hints: ["@keyframes define os estágios da animação.","transform: scale() altera a escala sem causar reflow.","Aplique na classe com a propriedade animation."],
    expectedConditionText: "@keyframes pulsar e animation: pulsar",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Animações com @keyframes & transform","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Animações com @keyframes & transform</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@keyframes\s+pulsar[\s\S]*animation:\s*pulsar/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @keyframes pulsar e animation: pulsar',
      };
    },
  },
  {
    id: 85,
    title: "Fase 85: Pseudo-classes Modernas: :has() (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o formulário quando contiver um campo inválido usando :has() com rigor de produção",
    puzzleDescription: "Permite selecionar elementos pais com base no estado de seus filhos. Neste desafio prático você irá dominar Pseudo-classes Modernas: :has() aplicando código profissional.",
    initialCode: `form:has(input:invalid) {
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}`,
    hints: [":has() é o seletor de pai tão esperado no CSS.","form:has(input:invalid) aplica estilo no form se houver erro interno.","Revolucionou a escrita de CSS sem JavaScript."],
    expectedConditionText: "form:has(input:invalid)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Pseudo-classes Modernas: :has()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Pseudo-classes Modernas: :has()</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /form:has\s*\(\s*input:invalid\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: form:has(input:invalid)',
      };
    },
  },
  {
    id: 86,
    title: "Fase 86: Scroll Snap para Carrossel (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Configure rolagem magnética suave com scroll-snap-type com rigor de produção",
    puzzleDescription: "Experiência tátil perfeita para galerias de imagens e stories mobile. Neste desafio prático você irá dominar Scroll Snap para Carrossel aplicando código profissional.",
    initialCode: `.carrossel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.carrossel-item {
  scroll-snap-align: center;
  flex-shrink: 0;
}`,
    hints: ["scroll-snap-type no contêiner define o eixo de travamento.","scroll-snap-align no filho define onde o item para (start/center).","Cria carrosséis nativos lisos em mobile."],
    expectedConditionText: "scroll-snap-type: x mandatory e scroll-snap-align: center",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Scroll Snap para Carrossel","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Scroll Snap para Carrossel</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /scroll-snap-type:\s*x\s+mandatory/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: scroll-snap-type: x mandatory e scroll-snap-align: center',
      };
    },
  },
  {
    id: 87,
    title: "Fase 87: Função clamp() para Tipografia Fluida (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie título com tamanho adaptável dinamicamente com clamp() com rigor de produção",
    puzzleDescription: "Tipografia responsiva contínua que escala perfeitamente de relógios a TVs 4K. Neste desafio prático você irá dominar Função clamp() para Tipografia Fluida aplicando código profissional.",
    initialCode: `.titulo-hero {
  font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);
}`,
    hints: ["clamp() recebe valor mínimo, ideal e máximo.","Calcula o tamanho com base na largura da viewport.","Dispensa dezenas de media queries para fontes."],
    expectedConditionText: "font-size: clamp(minimo, ideal, maximo)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função clamp() para Tipografia Fluida","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função clamp() para Tipografia Fluida</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /font-size:\s*clamp\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: font-size: clamp(minimo, ideal, maximo)',
      };
    },
  },
  {
    id: 88,
    title: "Fase 88: Container Queries (@container) (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o card com base na largura do seu contêiner pai com rigor de produção",
    puzzleDescription: "Componentes verdadeiramente modulares independentes da tela global. Neste desafio prático você irá dominar Container Queries (@container) aplicando código profissional.",
    initialCode: `.container-card {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card-conteudo {
    display: flex;
    gap: 1rem;
  }
}`,
    hints: ["Container queries adaptam componentes ao espaço onde estão inseridos.","Defina container-type: inline-size no pai.","Escreva regras @container para os filhos."],
    expectedConditionText: "@container (min-width: ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Container Queries (@container)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Container Queries (@container)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@container\s*\(\s*min-width/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @container (min-width: ...)',
      };
    },
  },
  {
    id: 89,
    title: "Fase 89: Gradientes Cônicos e Efeitos de Borda (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie borda com gradiente arco-íris giratório usando conic-gradient com rigor de produção",
    puzzleDescription: "Estilo cyber-moderno para avatares ativos e itens lendários. Neste desafio prático você irá dominar Gradientes Cônicos e Efeitos de Borda aplicando código profissional.",
    initialCode: `.borda-glow {
  background: conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  border-radius: 12px;
  padding: 2px;
}`,
    hints: ["conic-gradient gira as cores ao redor de um centro.","Perfeito para anéis de carregamento e bordas brilhantes.","Combine com animação de rotação para brilho ativo."],
    expectedConditionText: "conic-gradient(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Gradientes Cônicos e Efeitos de Borda","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Gradientes Cônicos e Efeitos de Borda</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /conic-gradient\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: conic-gradient(...)',
      };
    },
  },
  {
    id: 90,
    title: "Fase 90: Mix Blend Mode & Filtros (Nível Avançado 7)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Mescle texto sobre imagens usando mix-blend-mode: difference com rigor de produção",
    puzzleDescription: "Design editorial avançado e tipografia artística interativa. Neste desafio prático você irá dominar Mix Blend Mode & Filtros aplicando código profissional.",
    initialCode: `.texto-contraste {
  mix-blend-mode: difference;
  color: #ffffff;
  font-weight: 800;
}`,
    hints: ["mix-blend-mode define como o elemento se mistura com o que está atrás.","difference inverte as cores gerando contraste perfeito.","Texto fica legível em qualquer fundo sem sombra."],
    expectedConditionText: "mix-blend-mode: difference",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Mix Blend Mode & Filtros","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Mix Blend Mode & Filtros</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /mix-blend-mode:\s*difference/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: mix-blend-mode: difference',
      };
    },
  },
  {
    id: 91,
    title: "Fase 91: CSS Grid: grid-template-columns auto-fit (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma grade responsiva com repeat(auto-fit, minmax(250px, 1fr)) com rigor de produção",
    puzzleDescription: "O layout mais flexível e responsivo para catálogos modernos. Neste desafio prático você irá dominar CSS Grid: grid-template-columns auto-fit aplicando código profissional.",
    initialCode: `.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}`,
    hints: ["auto-fit preenche as colunas adaptando à largura da tela.","minmax(250px, 1fr) impede que fiquem menores que 250px.","Dispensam media queries para grids de cards."],
    expectedConditionText: "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CSS Grid: grid-template-columns auto-fit","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CSS Grid: grid-template-columns auto-fit</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /repeat\s*\(\s*auto-fit\s*,\s*minmax\s*\(\s*250px/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
      };
    },
  },
  {
    id: 92,
    title: "Fase 92: Variáveis CSS (Custom Properties) (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Declare variáveis globais no :root e use com var() com rigor de produção",
    puzzleDescription: "Base de todos os design systems modernos e modos escuro/claro. Neste desafio prático você irá dominar Variáveis CSS (Custom Properties) aplicando código profissional.",
    initialCode: `:root {
  --cor-primaria: #3b82f6;
  --espacamento-padrao: 16px;
}
.botao {
  background-color: var(--cor-primaria);
  padding: var(--espacamento-padrao);
}`,
    hints: ["Variáveis iniciam com dois hifens (--nome).","Declare no :root para escopo global.","Consuma usando var(--nome)."],
    expectedConditionText: "var(--cor-primaria)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Variáveis CSS (Custom Properties)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Variáveis CSS (Custom Properties)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /var\s*\(\s*--cor-primaria\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: var(--cor-primaria)',
      };
    },
  },
  {
    id: 93,
    title: "Fase 93: Backdrop Filter (Glassmorphism) (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Aplique efeito de vidro translúcido com backdrop-filter: blur com rigor de produção",
    puzzleDescription: "A estética visual mais requisitada em interfaces de sistemas modernos. Neste desafio prático você irá dominar Backdrop Filter (Glassmorphism) aplicando código profissional.",
    initialCode: `.cartao-vidro {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}`,
    hints: ["backdrop-filter desfoca o fundo atrás do elemento.","Combine com fundo semi-transparente rgba().","Adicione borda fina sutil para o efeito de vidro perfeito."],
    expectedConditionText: "backdrop-filter: blur(12px)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Backdrop Filter (Glassmorphism)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Backdrop Filter (Glassmorphism)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /backdrop-filter:\s*blur\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: backdrop-filter: blur(12px)',
      };
    },
  },
  {
    id: 94,
    title: "Fase 94: Animações com @keyframes & transform (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma animação de pulsação suave usando @keyframes com rigor de produção",
    puzzleDescription: "Micro-interações fluidas e de alta taxa de quadros (60fps) na GPU. Neste desafio prático você irá dominar Animações com @keyframes & transform aplicando código profissional.",
    initialCode: `@keyframes pulsar {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.badge-ativo {
  animation: pulsar 2s infinite ease-in-out;
}`,
    hints: ["@keyframes define os estágios da animação.","transform: scale() altera a escala sem causar reflow.","Aplique na classe com a propriedade animation."],
    expectedConditionText: "@keyframes pulsar e animation: pulsar",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Animações com @keyframes & transform","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Animações com @keyframes & transform</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@keyframes\s+pulsar[\s\S]*animation:\s*pulsar/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @keyframes pulsar e animation: pulsar',
      };
    },
  },
  {
    id: 95,
    title: "Fase 95: Pseudo-classes Modernas: :has() (Nível Avançado 8)",
    themeStyle: "web-api",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o formulário quando contiver um campo inválido usando :has() com rigor de produção",
    puzzleDescription: "Permite selecionar elementos pais com base no estado de seus filhos. Neste desafio prático você irá dominar Pseudo-classes Modernas: :has() aplicando código profissional.",
    initialCode: `form:has(input:invalid) {
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}`,
    hints: [":has() é o seletor de pai tão esperado no CSS.","form:has(input:invalid) aplica estilo no form se houver erro interno.","Revolucionou a escrita de CSS sem JavaScript."],
    expectedConditionText: "form:has(input:invalid)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Pseudo-classes Modernas: :has()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Pseudo-classes Modernas: :has()</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /form:has\s*\(\s*input:invalid\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: form:has(input:invalid)',
      };
    },
  },
  {
    id: 96,
    title: "Fase 96: Scroll Snap para Carrossel (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Configure rolagem magnética suave com scroll-snap-type com rigor de produção",
    puzzleDescription: "Experiência tátil perfeita para galerias de imagens e stories mobile. Neste desafio prático você irá dominar Scroll Snap para Carrossel aplicando código profissional.",
    initialCode: `.carrossel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.carrossel-item {
  scroll-snap-align: center;
  flex-shrink: 0;
}`,
    hints: ["scroll-snap-type no contêiner define o eixo de travamento.","scroll-snap-align no filho define onde o item para (start/center).","Cria carrosséis nativos lisos em mobile."],
    expectedConditionText: "scroll-snap-type: x mandatory e scroll-snap-align: center",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Scroll Snap para Carrossel","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Scroll Snap para Carrossel</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /scroll-snap-type:\s*x\s+mandatory/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: scroll-snap-type: x mandatory e scroll-snap-align: center',
      };
    },
  },
  {
    id: 97,
    title: "Fase 97: Função clamp() para Tipografia Fluida (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie título com tamanho adaptável dinamicamente com clamp() com rigor de produção",
    puzzleDescription: "Tipografia responsiva contínua que escala perfeitamente de relógios a TVs 4K. Neste desafio prático você irá dominar Função clamp() para Tipografia Fluida aplicando código profissional.",
    initialCode: `.titulo-hero {
  font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);
}`,
    hints: ["clamp() recebe valor mínimo, ideal e máximo.","Calcula o tamanho com base na largura da viewport.","Dispensa dezenas de media queries para fontes."],
    expectedConditionText: "font-size: clamp(minimo, ideal, maximo)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função clamp() para Tipografia Fluida","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função clamp() para Tipografia Fluida</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /font-size:\s*clamp\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: font-size: clamp(minimo, ideal, maximo)',
      };
    },
  },
  {
    id: 98,
    title: "Fase 98: Container Queries (@container) (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o card com base na largura do seu contêiner pai com rigor de produção",
    puzzleDescription: "Componentes verdadeiramente modulares independentes da tela global. Neste desafio prático você irá dominar Container Queries (@container) aplicando código profissional.",
    initialCode: `.container-card {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card-conteudo {
    display: flex;
    gap: 1rem;
  }
}`,
    hints: ["Container queries adaptam componentes ao espaço onde estão inseridos.","Defina container-type: inline-size no pai.","Escreva regras @container para os filhos."],
    expectedConditionText: "@container (min-width: ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Container Queries (@container)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Container Queries (@container)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@container\s*\(\s*min-width/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @container (min-width: ...)',
      };
    },
  },
  {
    id: 99,
    title: "Fase 99: Gradientes Cônicos e Efeitos de Borda (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie borda com gradiente arco-íris giratório usando conic-gradient com rigor de produção",
    puzzleDescription: "Estilo cyber-moderno para avatares ativos e itens lendários. Neste desafio prático você irá dominar Gradientes Cônicos e Efeitos de Borda aplicando código profissional.",
    initialCode: `.borda-glow {
  background: conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  border-radius: 12px;
  padding: 2px;
}`,
    hints: ["conic-gradient gira as cores ao redor de um centro.","Perfeito para anéis de carregamento e bordas brilhantes.","Combine com animação de rotação para brilho ativo."],
    expectedConditionText: "conic-gradient(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Gradientes Cônicos e Efeitos de Borda","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Gradientes Cônicos e Efeitos de Borda</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /conic-gradient\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: conic-gradient(...)',
      };
    },
  },
  {
    id: 100,
    title: "Fase 100: Mix Blend Mode & Filtros (Nível Avançado 8)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Mescle texto sobre imagens usando mix-blend-mode: difference com rigor de produção",
    puzzleDescription: "Design editorial avançado e tipografia artística interativa. Neste desafio prático você irá dominar Mix Blend Mode & Filtros aplicando código profissional.",
    initialCode: `.texto-contraste {
  mix-blend-mode: difference;
  color: #ffffff;
  font-weight: 800;
}`,
    hints: ["mix-blend-mode define como o elemento se mistura com o que está atrás.","difference inverte as cores gerando contraste perfeito.","Texto fica legível em qualquer fundo sem sombra."],
    expectedConditionText: "mix-blend-mode: difference",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Mix Blend Mode & Filtros","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Mix Blend Mode & Filtros</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /mix-blend-mode:\s*difference/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: mix-blend-mode: difference',
      };
    },
  },
  {
    id: 101,
    title: "Fase 101: CSS Grid: grid-template-columns auto-fit (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma grade responsiva com repeat(auto-fit, minmax(250px, 1fr)) com rigor de produção",
    puzzleDescription: "O layout mais flexível e responsivo para catálogos modernos. Neste desafio prático você irá dominar CSS Grid: grid-template-columns auto-fit aplicando código profissional.",
    initialCode: `.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}`,
    hints: ["auto-fit preenche as colunas adaptando à largura da tela.","minmax(250px, 1fr) impede que fiquem menores que 250px.","Dispensam media queries para grids de cards."],
    expectedConditionText: "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CSS Grid: grid-template-columns auto-fit","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CSS Grid: grid-template-columns auto-fit</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /repeat\s*\(\s*auto-fit\s*,\s*minmax\s*\(\s*250px/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
      };
    },
  },
  {
    id: 102,
    title: "Fase 102: Variáveis CSS (Custom Properties) (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Declare variáveis globais no :root e use com var() com rigor de produção",
    puzzleDescription: "Base de todos os design systems modernos e modos escuro/claro. Neste desafio prático você irá dominar Variáveis CSS (Custom Properties) aplicando código profissional.",
    initialCode: `:root {
  --cor-primaria: #3b82f6;
  --espacamento-padrao: 16px;
}
.botao {
  background-color: var(--cor-primaria);
  padding: var(--espacamento-padrao);
}`,
    hints: ["Variáveis iniciam com dois hifens (--nome).","Declare no :root para escopo global.","Consuma usando var(--nome)."],
    expectedConditionText: "var(--cor-primaria)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Variáveis CSS (Custom Properties)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Variáveis CSS (Custom Properties)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /var\s*\(\s*--cor-primaria\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: var(--cor-primaria)',
      };
    },
  },
  {
    id: 103,
    title: "Fase 103: Backdrop Filter (Glassmorphism) (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Aplique efeito de vidro translúcido com backdrop-filter: blur com rigor de produção",
    puzzleDescription: "A estética visual mais requisitada em interfaces de sistemas modernos. Neste desafio prático você irá dominar Backdrop Filter (Glassmorphism) aplicando código profissional.",
    initialCode: `.cartao-vidro {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}`,
    hints: ["backdrop-filter desfoca o fundo atrás do elemento.","Combine com fundo semi-transparente rgba().","Adicione borda fina sutil para o efeito de vidro perfeito."],
    expectedConditionText: "backdrop-filter: blur(12px)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Backdrop Filter (Glassmorphism)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Backdrop Filter (Glassmorphism)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /backdrop-filter:\s*blur\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: backdrop-filter: blur(12px)',
      };
    },
  },
  {
    id: 104,
    title: "Fase 104: Animações com @keyframes & transform (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma animação de pulsação suave usando @keyframes com rigor de produção",
    puzzleDescription: "Micro-interações fluidas e de alta taxa de quadros (60fps) na GPU. Neste desafio prático você irá dominar Animações com @keyframes & transform aplicando código profissional.",
    initialCode: `@keyframes pulsar {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.badge-ativo {
  animation: pulsar 2s infinite ease-in-out;
}`,
    hints: ["@keyframes define os estágios da animação.","transform: scale() altera a escala sem causar reflow.","Aplique na classe com a propriedade animation."],
    expectedConditionText: "@keyframes pulsar e animation: pulsar",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Animações com @keyframes & transform","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Animações com @keyframes & transform</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@keyframes\s+pulsar[\s\S]*animation:\s*pulsar/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @keyframes pulsar e animation: pulsar',
      };
    },
  },
  {
    id: 105,
    title: "Fase 105: Pseudo-classes Modernas: :has() (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o formulário quando contiver um campo inválido usando :has() com rigor de produção",
    puzzleDescription: "Permite selecionar elementos pais com base no estado de seus filhos. Neste desafio prático você irá dominar Pseudo-classes Modernas: :has() aplicando código profissional.",
    initialCode: `form:has(input:invalid) {
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}`,
    hints: [":has() é o seletor de pai tão esperado no CSS.","form:has(input:invalid) aplica estilo no form se houver erro interno.","Revolucionou a escrita de CSS sem JavaScript."],
    expectedConditionText: "form:has(input:invalid)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Pseudo-classes Modernas: :has()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Pseudo-classes Modernas: :has()</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /form:has\s*\(\s*input:invalid\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: form:has(input:invalid)',
      };
    },
  },
  {
    id: 106,
    title: "Fase 106: Scroll Snap para Carrossel (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Configure rolagem magnética suave com scroll-snap-type com rigor de produção",
    puzzleDescription: "Experiência tátil perfeita para galerias de imagens e stories mobile. Neste desafio prático você irá dominar Scroll Snap para Carrossel aplicando código profissional.",
    initialCode: `.carrossel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.carrossel-item {
  scroll-snap-align: center;
  flex-shrink: 0;
}`,
    hints: ["scroll-snap-type no contêiner define o eixo de travamento.","scroll-snap-align no filho define onde o item para (start/center).","Cria carrosséis nativos lisos em mobile."],
    expectedConditionText: "scroll-snap-type: x mandatory e scroll-snap-align: center",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Scroll Snap para Carrossel","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Scroll Snap para Carrossel</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /scroll-snap-type:\s*x\s+mandatory/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: scroll-snap-type: x mandatory e scroll-snap-align: center',
      };
    },
  },
  {
    id: 107,
    title: "Fase 107: Função clamp() para Tipografia Fluida (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie título com tamanho adaptável dinamicamente com clamp() com rigor de produção",
    puzzleDescription: "Tipografia responsiva contínua que escala perfeitamente de relógios a TVs 4K. Neste desafio prático você irá dominar Função clamp() para Tipografia Fluida aplicando código profissional.",
    initialCode: `.titulo-hero {
  font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);
}`,
    hints: ["clamp() recebe valor mínimo, ideal e máximo.","Calcula o tamanho com base na largura da viewport.","Dispensa dezenas de media queries para fontes."],
    expectedConditionText: "font-size: clamp(minimo, ideal, maximo)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função clamp() para Tipografia Fluida","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função clamp() para Tipografia Fluida</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /font-size:\s*clamp\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: font-size: clamp(minimo, ideal, maximo)',
      };
    },
  },
  {
    id: 108,
    title: "Fase 108: Container Queries (@container) (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o card com base na largura do seu contêiner pai com rigor de produção",
    puzzleDescription: "Componentes verdadeiramente modulares independentes da tela global. Neste desafio prático você irá dominar Container Queries (@container) aplicando código profissional.",
    initialCode: `.container-card {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card-conteudo {
    display: flex;
    gap: 1rem;
  }
}`,
    hints: ["Container queries adaptam componentes ao espaço onde estão inseridos.","Defina container-type: inline-size no pai.","Escreva regras @container para os filhos."],
    expectedConditionText: "@container (min-width: ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Container Queries (@container)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Container Queries (@container)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@container\s*\(\s*min-width/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @container (min-width: ...)',
      };
    },
  },
  {
    id: 109,
    title: "Fase 109: Gradientes Cônicos e Efeitos de Borda (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie borda com gradiente arco-íris giratório usando conic-gradient com rigor de produção",
    puzzleDescription: "Estilo cyber-moderno para avatares ativos e itens lendários. Neste desafio prático você irá dominar Gradientes Cônicos e Efeitos de Borda aplicando código profissional.",
    initialCode: `.borda-glow {
  background: conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  border-radius: 12px;
  padding: 2px;
}`,
    hints: ["conic-gradient gira as cores ao redor de um centro.","Perfeito para anéis de carregamento e bordas brilhantes.","Combine com animação de rotação para brilho ativo."],
    expectedConditionText: "conic-gradient(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Gradientes Cônicos e Efeitos de Borda","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Gradientes Cônicos e Efeitos de Borda</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /conic-gradient\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: conic-gradient(...)',
      };
    },
  },
  {
    id: 110,
    title: "Fase 110: Mix Blend Mode & Filtros (Nível Avançado 9)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Mescle texto sobre imagens usando mix-blend-mode: difference com rigor de produção",
    puzzleDescription: "Design editorial avançado e tipografia artística interativa. Neste desafio prático você irá dominar Mix Blend Mode & Filtros aplicando código profissional.",
    initialCode: `.texto-contraste {
  mix-blend-mode: difference;
  color: #ffffff;
  font-weight: 800;
}`,
    hints: ["mix-blend-mode define como o elemento se mistura com o que está atrás.","difference inverte as cores gerando contraste perfeito.","Texto fica legível em qualquer fundo sem sombra."],
    expectedConditionText: "mix-blend-mode: difference",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Mix Blend Mode & Filtros","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Mix Blend Mode & Filtros</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /mix-blend-mode:\s*difference/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: mix-blend-mode: difference',
      };
    },
  },
  {
    id: 111,
    title: "Fase 111: CSS Grid: grid-template-columns auto-fit (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma grade responsiva com repeat(auto-fit, minmax(250px, 1fr)) com rigor de produção",
    puzzleDescription: "O layout mais flexível e responsivo para catálogos modernos. Neste desafio prático você irá dominar CSS Grid: grid-template-columns auto-fit aplicando código profissional.",
    initialCode: `.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}`,
    hints: ["auto-fit preenche as colunas adaptando à largura da tela.","minmax(250px, 1fr) impede que fiquem menores que 250px.","Dispensam media queries para grids de cards."],
    expectedConditionText: "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))",
    previewType: "site-component",
    previewMeta: {"componentTitle":"CSS Grid: grid-template-columns auto-fit","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">CSS Grid: grid-template-columns auto-fit</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /repeat\s*\(\s*auto-fit\s*,\s*minmax\s*\(\s*250px/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))',
      };
    },
  },
  {
    id: 112,
    title: "Fase 112: Variáveis CSS (Custom Properties) (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Declare variáveis globais no :root e use com var() com rigor de produção",
    puzzleDescription: "Base de todos os design systems modernos e modos escuro/claro. Neste desafio prático você irá dominar Variáveis CSS (Custom Properties) aplicando código profissional.",
    initialCode: `:root {
  --cor-primaria: #3b82f6;
  --espacamento-padrao: 16px;
}
.botao {
  background-color: var(--cor-primaria);
  padding: var(--espacamento-padrao);
}`,
    hints: ["Variáveis iniciam com dois hifens (--nome).","Declare no :root para escopo global.","Consuma usando var(--nome)."],
    expectedConditionText: "var(--cor-primaria)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Variáveis CSS (Custom Properties)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Variáveis CSS (Custom Properties)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /var\s*\(\s*--cor-primaria\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: var(--cor-primaria)',
      };
    },
  },
  {
    id: 113,
    title: "Fase 113: Backdrop Filter (Glassmorphism) (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Aplique efeito de vidro translúcido com backdrop-filter: blur com rigor de produção",
    puzzleDescription: "A estética visual mais requisitada em interfaces de sistemas modernos. Neste desafio prático você irá dominar Backdrop Filter (Glassmorphism) aplicando código profissional.",
    initialCode: `.cartao-vidro {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}`,
    hints: ["backdrop-filter desfoca o fundo atrás do elemento.","Combine com fundo semi-transparente rgba().","Adicione borda fina sutil para o efeito de vidro perfeito."],
    expectedConditionText: "backdrop-filter: blur(12px)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Backdrop Filter (Glassmorphism)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Backdrop Filter (Glassmorphism)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /backdrop-filter:\s*blur\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: backdrop-filter: blur(12px)',
      };
    },
  },
  {
    id: 114,
    title: "Fase 114: Animações com @keyframes & transform (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie uma animação de pulsação suave usando @keyframes com rigor de produção",
    puzzleDescription: "Micro-interações fluidas e de alta taxa de quadros (60fps) na GPU. Neste desafio prático você irá dominar Animações com @keyframes & transform aplicando código profissional.",
    initialCode: `@keyframes pulsar {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
.badge-ativo {
  animation: pulsar 2s infinite ease-in-out;
}`,
    hints: ["@keyframes define os estágios da animação.","transform: scale() altera a escala sem causar reflow.","Aplique na classe com a propriedade animation."],
    expectedConditionText: "@keyframes pulsar e animation: pulsar",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Animações com @keyframes & transform","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Animações com @keyframes & transform</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@keyframes\s+pulsar[\s\S]*animation:\s*pulsar/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @keyframes pulsar e animation: pulsar',
      };
    },
  },
  {
    id: 115,
    title: "Fase 115: Pseudo-classes Modernas: :has() (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o formulário quando contiver um campo inválido usando :has() com rigor de produção",
    puzzleDescription: "Permite selecionar elementos pais com base no estado de seus filhos. Neste desafio prático você irá dominar Pseudo-classes Modernas: :has() aplicando código profissional.",
    initialCode: `form:has(input:invalid) {
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}`,
    hints: [":has() é o seletor de pai tão esperado no CSS.","form:has(input:invalid) aplica estilo no form se houver erro interno.","Revolucionou a escrita de CSS sem JavaScript."],
    expectedConditionText: "form:has(input:invalid)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Pseudo-classes Modernas: :has()","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Pseudo-classes Modernas: :has()</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /form:has\s*\(\s*input:invalid\s*\)/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: form:has(input:invalid)',
      };
    },
  },
  {
    id: 116,
    title: "Fase 116: Scroll Snap para Carrossel (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Configure rolagem magnética suave com scroll-snap-type com rigor de produção",
    puzzleDescription: "Experiência tátil perfeita para galerias de imagens e stories mobile. Neste desafio prático você irá dominar Scroll Snap para Carrossel aplicando código profissional.",
    initialCode: `.carrossel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.carrossel-item {
  scroll-snap-align: center;
  flex-shrink: 0;
}`,
    hints: ["scroll-snap-type no contêiner define o eixo de travamento.","scroll-snap-align no filho define onde o item para (start/center).","Cria carrosséis nativos lisos em mobile."],
    expectedConditionText: "scroll-snap-type: x mandatory e scroll-snap-align: center",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Scroll Snap para Carrossel","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Scroll Snap para Carrossel</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /scroll-snap-type:\s*x\s+mandatory/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: scroll-snap-type: x mandatory e scroll-snap-align: center',
      };
    },
  },
  {
    id: 117,
    title: "Fase 117: Função clamp() para Tipografia Fluida (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie título com tamanho adaptável dinamicamente com clamp() com rigor de produção",
    puzzleDescription: "Tipografia responsiva contínua que escala perfeitamente de relógios a TVs 4K. Neste desafio prático você irá dominar Função clamp() para Tipografia Fluida aplicando código profissional.",
    initialCode: `.titulo-hero {
  font-size: clamp(1.5rem, 4vw + 1rem, 3.5rem);
}`,
    hints: ["clamp() recebe valor mínimo, ideal e máximo.","Calcula o tamanho com base na largura da viewport.","Dispensa dezenas de media queries para fontes."],
    expectedConditionText: "font-size: clamp(minimo, ideal, maximo)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Função clamp() para Tipografia Fluida","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Função clamp() para Tipografia Fluida</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /font-size:\s*clamp\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: font-size: clamp(minimo, ideal, maximo)',
      };
    },
  },
  {
    id: 118,
    title: "Fase 118: Container Queries (@container) (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Estilize o card com base na largura do seu contêiner pai com rigor de produção",
    puzzleDescription: "Componentes verdadeiramente modulares independentes da tela global. Neste desafio prático você irá dominar Container Queries (@container) aplicando código profissional.",
    initialCode: `.container-card {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card-conteudo {
    display: flex;
    gap: 1rem;
  }
}`,
    hints: ["Container queries adaptam componentes ao espaço onde estão inseridos.","Defina container-type: inline-size no pai.","Escreva regras @container para os filhos."],
    expectedConditionText: "@container (min-width: ...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Container Queries (@container)","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Container Queries (@container)</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /@container\s*\(\s*min-width/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: @container (min-width: ...)',
      };
    },
  },
  {
    id: 119,
    title: "Fase 119: Gradientes Cônicos e Efeitos de Borda (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Crie borda com gradiente arco-íris giratório usando conic-gradient com rigor de produção",
    puzzleDescription: "Estilo cyber-moderno para avatares ativos e itens lendários. Neste desafio prático você irá dominar Gradientes Cônicos e Efeitos de Borda aplicando código profissional.",
    initialCode: `.borda-glow {
  background: conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  border-radius: 12px;
  padding: 2px;
}`,
    hints: ["conic-gradient gira as cores ao redor de um centro.","Perfeito para anéis de carregamento e bordas brilhantes.","Combine com animação de rotação para brilho ativo."],
    expectedConditionText: "conic-gradient(...)",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Gradientes Cônicos e Efeitos de Borda","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Gradientes Cônicos e Efeitos de Borda</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /conic-gradient\s*\(/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: conic-gradient(...)',
      };
    },
  },
  {
    id: 120,
    title: "Fase 120: Mix Blend Mode & Filtros (Nível Avançado 10)",
    themeStyle: "web-fullstack",
    themeCategory: 'web-builder',
    targetObjective: "Mescle texto sobre imagens usando mix-blend-mode: difference com rigor de produção",
    puzzleDescription: "Design editorial avançado e tipografia artística interativa. Neste desafio prático você irá dominar Mix Blend Mode & Filtros aplicando código profissional.",
    initialCode: `.texto-contraste {
  mix-blend-mode: difference;
  color: #ffffff;
  font-weight: 800;
}`,
    hints: ["mix-blend-mode define como o elemento se mistura com o que está atrás.","difference inverte as cores gerando contraste perfeito.","Texto fica legível em qualquer fundo sem sombra."],
    expectedConditionText: "mix-blend-mode: difference",
    previewType: "site-component",
    previewMeta: {"componentTitle":"Mix Blend Mode & Filtros","previewSnippet":"<div class=\"p-2 border rounded font-mono text-xs\"><span class=\"text-blue-400 font-bold\">Mix Blend Mode & Filtros</span>: Pronto para validação.</div>","successBadge":"Especialista CSS"},
    validate: (rawCode) => {
      const passed = /mix-blend-mode:\s*difference/i.test(rawCode);
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
        message: 'A lógica precisa atender a condição esperada: mix-blend-mode: difference',
      };
    },
  },
];
