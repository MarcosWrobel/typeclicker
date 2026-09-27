import { GameLevel } from './types';
import { CSS_EXTRA_LEVELS } from './css_extra';

const CSS_BASE_LEVELS: GameLevel[] = [
  // ==========================================
  // CAPÍTULO 1: O ENIGMA DA PORTA (FASES 1 A 10)
  // ==========================================
  {
    id: 1,
    title: 'Fase 1: O Display Oculto',
    themeStyle: 'wooden',
    themeCategory: 'door',
    targetObjective: 'Mude display: none para display: block',
    puzzleDescription: 'A porta existe na estrutura, mas está oculta pelo display.',
    initialCode: `/* A porta está oculta e invisível no fluxo: */
.porta {
  display: none;
}
`,
    hints: [
      'A propriedade display define como o elemento é renderizado.',
      'Troque "none" por "block" ou "flex".',
      'Assim que a porta for exibida, ela se abrirá.',
    ],
    expectedConditionText: 'display: block',
    validate: (rawCode) => {
      if (/display\s*:\s*(block|flex|grid|inline-block)\b/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Display ativado! A porta agora existe e foi aberta!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A porta continua com display: none. Altere para display: block.',
      };
    },
  },
  {
    id: 2,
    title: 'Fase 2: Opacidade Total',
    themeStyle: 'iron',
    themeCategory: 'door',
    targetObjective: 'Defina opacity: 1 para materializar a porta',
    puzzleDescription: 'A porta de ferro está transparente com opacidade zero.',
    initialCode: `/* A porta de ferro está totalmente transparente: */
.porta-ferro {
  opacity: 0;
}
`,
    hints: [
      'Valores de opacity vão de 0 (invisível) a 1 (totalmente visível).',
      'Altere opacity: 0 para opacity: 1.',
    ],
    expectedConditionText: 'opacity: 1',
    validate: (rawCode) => {
      if (/opacity\s*:\s*1\b/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Opacidade em 100%! A porta de ferro solidificou e abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A porta continua transparente. Configure opacity: 1.',
      };
    },
  },
  {
    id: 3,
    title: 'Fase 3: Rotação da Chave (transform)',
    themeStyle: 'vault',
    themeCategory: 'door',
    targetObjective: 'Gire a chave com transform: rotate(90deg)',
    puzzleDescription: 'A tranca do cofre precisa de uma rotação de 90 graus para destravar os pinos.',
    initialCode: `/* Gire a chave de 0deg para 90deg: */
.chave-mecanica {
  transform: rotate(0deg);
}
`,
    hints: [
      'A função rotate(90deg) realiza a rotação em graus.',
      'Troque 0deg por 90deg.',
    ],
    expectedConditionText: 'transform: rotate(90deg)',
    validate: (rawCode) => {
      if (/transform\s*:\s*rotate\s*\(\s*90deg\s*\)/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Chave girada a 90 graus! Os pinos do cofre cederam e abriram a porta!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A chave precisa girar 90 graus. Use transform: rotate(90deg).',
      };
    },
  },
  {
    id: 4,
    title: 'Fase 4: Abertura em Perspectiva (rotateY)',
    themeStyle: 'wooden',
    themeCategory: 'door',
    targetObjective: 'Abra a folha da porta com transform: rotateY(-85deg)',
    puzzleDescription: 'Portas no mundo 3D giram no eixo vertical Y para revelar a passagem.',
    initialCode: `/* Abra o batente da porta girando no eixo Y: */
.folha-porta {
  transform: rotateY(0deg);
}
`,
    hints: [
      'Use um ângulo entre -60deg e -90deg (ex: rotateY(-85deg)).',
      'Isso projeta a porta aberta em direção ao usuário.',
    ],
    expectedConditionText: 'rotateY(-85deg)',
    validate: (rawCode) => {
      if (/rotateY\s*\(\s*-[6-9]\ddeg\s*\)/i.test(rawCode) || /rotateY\s*\(\s*-85deg\s*\)/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Folha girada no eixo 3D! O portal se escancarou para frente!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Gire a porta no eixo Y usando transform: rotateY(-85deg).',
      };
    },
  },
  {
    id: 5,
    title: 'Fase 5: A Camada Superior (z-index)',
    themeStyle: 'scifi',
    themeCategory: 'door',
    targetObjective: 'Traga a porta para frente com z-index: 10',
    puzzleDescription: 'Uma parede ilusória está cobrindo a porta sci-fi com z-index menor.',
    initialCode: `/* Aumente o z-index para trazer a porta acima dos obstáculos: */
.painel-portal {
  position: relative;
  z-index: 0;
}
`,
    hints: [
      'Elementos com maior z-index ficam sobrepostos na frente.',
      'Altere z-index: 0 para z-index: 10 ou mais.',
    ],
    expectedConditionText: 'z-index: 10',
    validate: (rawCode) => {
      if (/z-index\s*:\s*([1-9]\d*)\b/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'z-index elevado! O portal sci-fi emergiu da barreira e abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Eleve a camada definindo z-index: 10.',
      };
    },
  },
  {
    id: 6,
    title: 'Fase 6: Alinhamento Central (Flexbox)',
    themeStyle: 'portal',
    themeCategory: 'door',
    targetObjective: 'Centralize a energia com justify-content: center',
    puzzleDescription: 'O núcleo mágico precisa estar alinhado no centro exato para abrir o vórtice.',
    initialCode: `/* Alinhe o núcleo mágico no centro do eixo horizontal: */
.portal-magico {
  display: flex;
  justify-content: flex-start;
}
`,
    hints: [
      'Altere "flex-start" para "center".',
      'O Flexbox centralizará o feixe de energia.',
    ],
    expectedConditionText: 'justify-content: center',
    validate: (rawCode) => {
      if (/justify-content\s*:\s*center\b/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Energia perfeitamente centralizada com justify-content: center!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Centralize horizontalmente usando justify-content: center.',
      };
    },
  },
  {
    id: 7,
    title: 'Fase 7: Deslocamento da Barra (translateX)',
    themeStyle: 'vault',
    themeCategory: 'door',
    targetObjective: 'Recolha o trinco com transform: translateX(100px)',
    puzzleDescription: 'A barra de aço que trava a porta precisa deslizar 100px para o lado.',
    initialCode: `/* Deslize a barra de aço para a direita para destravar: */
.barra-aco {
  transform: translateX(0px);
}
`,
    hints: [
      'A função translateX(100px) move o elemento 100 pixels no eixo X.',
      'Substitua 0px por 100px.',
    ],
    expectedConditionText: 'transform: translateX(100px)',
    validate: (rawCode) => {
      if (/translateX\s*\(\s*100px\s*\)/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Trinco de aço recolhido com sucesso em 100px! O cofre abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Mova a barra com transform: translateX(100px).',
      };
    },
  },
  {
    id: 8,
    title: 'Fase 8: A Escala do Portal (scale)',
    themeStyle: 'scifi',
    themeCategory: 'door',
    targetObjective: 'Expanda o portal para scale(1)',
    puzzleDescription: 'O portal dimensional está encolhido com scale(0). Expanda-o para o tamanho total.',
    initialCode: `/* Expanda o portal do tamanho 0 para 1: */
.escotilha-quantica {
  transform: scale(0);
}
`,
    hints: [
      'scale(1) restaura o tamanho original do elemento.',
      'Substitua 0 por 1 dentro do scale().',
    ],
    expectedConditionText: 'transform: scale(1)',
    validate: (rawCode) => {
      if (/scale\s*\(\s*1\s*\)/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Escotilha expandida para scale(1)! O portal quântico abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Aumente o portal definindo transform: scale(1).',
      };
    },
  },
  {
    id: 9,
    title: 'Fase 9: A Cor de Liberação (background-color)',
    themeStyle: 'wooden',
    themeCategory: 'door',
    targetObjective: 'Mude a cor do sensor para "green" ou "#22c55e"',
    puzzleDescription: 'O leitor óptico da fechadura só libera a trava sob a frequência de luz verde.',
    initialCode: `/* Mude a luz de red para green: */
.sensor-fechadura {
  background-color: red;
}
`,
    hints: [
      'Altere "red" para "green" ou o código hexadecimal "#22c55e".',
    ],
    expectedConditionText: 'background-color: green',
    validate: (rawCode) => {
      if (/background(-color)?\s*:\s*(green|#22c55e|#10b981|#00ff00)\b/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Luz verde confirmada no sensor óptico! Fechadura liberada!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'O sensor continua vermelho. Altere para background-color: green.',
      };
    },
  },
  {
    id: 10,
    title: 'Fase 10: O Estado Aberto (.porta.aberta)',
    themeStyle: 'portal',
    themeCategory: 'door',
    targetObjective: 'Adicione a classe .aberta ao seletor CSS',
    puzzleDescription: 'Defina a regra CSS da porta quando combinada com a classe .aberta.',
    initialCode: `/* Complete o seletor para que a regra aplique quando a porta tiver a classe .aberta: */
.porta {
  filter: brightness(2) drop-shadow(0 0 20px #38bdf8);
}
`,
    hints: [
      'Altere o seletor para ".porta.aberta" ou adicione ".aberta".',
    ],
    expectedConditionText: '.porta.aberta',
    validate: (rawCode) => {
      if (/\.porta\.aberta\b/i.test(rawCode) || /\.aberta\b/i.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Regra de estado ativada! Você conquistou o Capítulo 1 das Portas em CSS!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Ajuste o seletor para .porta.aberta.',
      };
    },
  },

  // =======================================================
  // CAPÍTULO 2: CONSTRUÇÃO DE SITES REAIS (FASES 11 A 20)
  // =======================================================
  {
    id: 11,
    title: 'Fase 11: Flexbox Navbar (display: flex)',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Alinhe a barra de navegação com display: flex, justify-content: space-between e align-items: center',
    puzzleDescription: 'A estrutura padrão de ouro em 99% das barras de navegação web modernas: logo à esquerda e links à direita.',
    initialCode: `/* Estilize a barra de navegação moderna: */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}
`,
    hints: [
      'display: flex ativa o modelo flexível.',
      'justify-content: space-between empurra o logo para a esquerda e o menu para a direita.',
      'align-items: center centraliza ambos verticalmente.',
    ],
    expectedConditionText: 'display: flex com justify-content: space-between e align-items: center',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Barra de Navegação Flexbox',
      previewSnippet: '<div class="flex justify-between items-center p-2 bg-neutral-900 border rounded"><strong>Logo</strong><div class="flex gap-2 text-xs"><span>Links</span></div></div>',
      successBadge: 'Flexbox Navbar OK',
    },
    validate: (rawCode) => {
      const hasFlex = /display\s*:\s*flex\b/i.test(rawCode);
      const hasBetween = /justify-content\s*:\s*space-between\b/i.test(rawCode);
      const hasAlign = /align-items\s*:\s*center\b/i.test(rawCode);
      if (hasFlex && hasBetween && hasAlign) {
        return {
          success: true,
          doorState: true,
          message: 'Navbar flexbox alinhada com perfeição!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Inclua display: flex, justify-content: space-between e align-items: center.',
      };
    },
  },
  {
    id: 12,
    title: 'Fase 12: CSS Grid de Produtos (repeat(3, 1fr))',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Crie um grid de 3 colunas iguais com display: grid e grid-template-columns: repeat(3, 1fr)',
    puzzleDescription: 'CSS Grid é a forma mais poderosa de dispor cartões de catálogo de e-commerce e galerias de fotos.',
    initialCode: `/* Crie um grid com 3 colunas e espaçamento de 20px: */
.grid-produtos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
`,
    hints: [
      'display: grid ativa o sistema de linhas e colunas.',
      'repeat(3, 1fr) cria 3 colunas de proporção idêntica.',
      'gap: 20px define o espaço entre os cartões.',
    ],
    expectedConditionText: 'display: grid com grid-template-columns: repeat(3, 1fr) e gap',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Vitrine em Grid 3 Colunas',
      previewSnippet: '<div class="grid grid-cols-3 gap-1 text-[10px] text-center"><div class="border p-1 bg-neutral-900">Card 1</div><div class="border p-1 bg-neutral-900">Card 2</div><div class="border p-1 bg-neutral-900">Card 3</div></div>',
      successBadge: 'CSS Grid OK',
    },
    validate: (rawCode) => {
      const hasGrid = /display\s*:\s*grid\b/i.test(rawCode);
      const hasCols = /grid-template-columns\s*:\s*(repeat\s*\(\s*3\s*,\s*1fr\s*\)|1fr\s+1fr\s+1fr)\b/i.test(rawCode);
      const hasGap = /gap\s*:\s*\d+px/i.test(rawCode);
      if (hasGrid && hasCols && hasGap) {
        return {
          success: true,
          doorState: true,
          message: 'Grid responsivo de 3 colunas perfeitamente configurado!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Defina display: grid, grid-template-columns: repeat(3, 1fr) e gap.',
      };
    },
  },
  {
    id: 13,
    title: 'Fase 13: Card com Elevação & Hover 3D',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Adicione efeito de elevação no hover com transform: translateY(-8px) e box-shadow',
    puzzleDescription: 'Microinterações elevam a percepção de qualidade do site, dando sensação tátil ao passar o mouse sobre os cards.',
    initialCode: `/* Adicione a transição suave e a elevação no hover: */
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
}
`,
    hints: [
      'translateY(-8px) move o card 8 pixels para cima.',
      'box-shadow projeta uma sombra profunda dando a ilusão de profundidade física.',
    ],
    expectedConditionText: '.card:hover com translateY(-8px) e box-shadow',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Card com Interação Tátil',
      previewSnippet: '<div class="p-3 bg-neutral-800 rounded-lg shadow-xl -translate-y-1 transition-transform border border-blue-500/40 text-xs">✨ Card Elevado no Hover</div>',
      successBadge: 'Hover Effect OK',
    },
    validate: (rawCode) => {
      const hasHover = /\.card:hover\b/i.test(rawCode);
      const hasTranslate = /translateY\s*\(\s*-\d+px\s*\)/i.test(rawCode);
      const hasShadow = /box-shadow\s*:/i.test(rawCode);
      if (hasHover && hasTranslate && hasShadow) {
        return {
          success: true,
          doorState: true,
          message: 'Microinteração 3D de elevação implementada com maestria!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Configure .card:hover com transform: translateY(-8px) e box-shadow.',
      };
    },
  },
  {
    id: 14,
    title: 'Fase 14: Variáveis CSS Globais (:root)',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Declare as variáveis globais --primary-color e --bg-color no seletor :root',
    puzzleDescription: 'Variáveis CSS (Custom Properties) são o coração de Design Systems e sistemas de Dark/Light Mode.',
    initialCode: `/* Defina os tokens visuais globais no :root: */
:root {
  --primary-color: #3b82f6;
  --bg-color: #0f172a;
}

body {
  background-color: var(--bg-color);
  color: var(--primary-color);
}
`,
    hints: [
      'Variáveis CSS começam sempre com dois hífens (--nome-da-variavel).',
      'Elas são consumidas com a função var(--nome).',
    ],
    expectedConditionText: ':root com --primary-color e --bg-color consumidas com var()',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Design System & Tokens',
      previewSnippet: '<div class="flex gap-2 text-xs"><span class="px-2 py-0.5 rounded bg-blue-500 text-white font-mono">--primary</span><span class="px-2 py-0.5 rounded bg-slate-900 border text-white font-mono">--bg-color</span></div>',
      successBadge: 'Tokens CSS OK',
    },
    validate: (rawCode) => {
      const hasRoot = /:root\s*\{[\s\S]*--primary-color[\s\S]*--bg-color/i.test(rawCode);
      const hasVar = /var\s*\(\s*--(primary-color|bg-color)\s*\)/i.test(rawCode);
      if (hasRoot && hasVar) {
        return {
          success: true,
          doorState: true,
          message: 'Tokens de design centralizados no :root com sucesso!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Declare --primary-color e --bg-color em :root e use com var().',
      };
    },
  },
  {
    id: 15,
    title: 'Fase 15: Botão Gradiente Neon',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Estilize um botão moderno com linear-gradient e border-radius: 9999px',
    puzzleDescription: 'Botões chamativos com gradientes suaves aumentam as conversões de compras e cadastros em landing pages.',
    initialCode: `/* Botão estilo moderno com gradiente e borda arredondada: */
.btn-gradiente {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 9999px;
  color: #ffffff;
  padding: 12px 28px;
  border: none;
}
`,
    hints: [
      'linear-gradient combina duas ou mais cores em um ângulo.',
      'border-radius: 9999px produz o formato pílula perfeito.',
    ],
    expectedConditionText: 'linear-gradient e border-radius: 9999px',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Botão de Alta Conversão',
      previewSnippet: '<button class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-bold shadow-lg">Quero Assinar Agora →</button>',
      successBadge: 'Gradiente Criado',
    },
    validate: (rawCode) => {
      const hasGrad = /linear-gradient\s*\(/i.test(rawCode);
      const hasRadius = /border-radius\s*:\s*(9999px|\d+px)/i.test(rawCode);
      if (hasGrad && hasRadius) {
        return {
          success: true,
          doorState: true,
          message: 'Botão de alta conversão estilizado com gradiente moderno!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Utilize background: linear-gradient(...) e border-radius.',
      };
    },
  },
  {
    id: 16,
    title: 'Fase 16: Efeito de Vidro (Glassmorphism)',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Crie o efeito de vidro fosco com backdrop-filter: blur(12px) e fundo translúcido',
    puzzleDescription: 'A tendência estética dos sistemas operacionais e sites mais sofisticados (Apple, Windows 11, Linear).',
    initialCode: `/* Card translúcido com desfoque de fundo (Glassmorphism): */
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
}
`,
    hints: [
      'backdrop-filter: blur(12px) desfoca o que está atrás do elemento.',
      'O fundo deve ser semi-transparente usando rgba().',
    ],
    expectedConditionText: 'backdrop-filter: blur(12px) com background rgba',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Efeito Vidro Fosco',
      previewSnippet: '<div class="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs">💎 Glassmorphism Ativo</div>',
      successBadge: 'Glassmorphism OK',
    },
    validate: (rawCode) => {
      const hasBlur = /backdrop-filter\s*:\s*blur\s*\(\s*\d+px\s*\)/i.test(rawCode);
      const hasRgba = /rgba\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0?\.\d+\s*\)/i.test(rawCode);
      if (hasBlur && hasRgba) {
        return {
          success: true,
          doorState: true,
          message: 'Efeito Glassmorphism de vidro translúcido aplicado com perfeição!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Aplique backdrop-filter: blur(...) e background com rgba().',
      };
    },
  },
  {
    id: 17,
    title: 'Fase 17: Animações Fluídas (@keyframes)',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Crie a animação pulsar com @keyframes alterando transform: scale(1) para scale(1.08)',
    puzzleDescription: 'Animações CSS leves dão vida a selos de novidade, botões de compra e spinners de carregamento.',
    initialCode: `/* Crie a animação suave de pulsação: */
@keyframes pulsar {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

.badge-novo {
  animation: pulsar 2s infinite ease-in-out;
}
`,
    hints: [
      '@keyframes define os quadros-chave da animação ao longo do tempo.',
      'scale(1) no início/fim e scale(1.08) no meio criam o efeito de respiração.',
    ],
    expectedConditionText: '@keyframes pulsar com transform: scale',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Animação de Atenção Visual',
      previewSnippet: '<span class="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs animate-pulse">🔥 Novidade Exclusiva</span>',
      successBadge: 'Keyframes OK',
    },
    validate: (rawCode) => {
      const hasKeyframes = /@keyframes\s+pulsar/i.test(rawCode);
      const hasScale = /scale\s*\(/i.test(rawCode);
      const hasAnim = /animation\s*:\s*pulsar/i.test(rawCode);
      if (hasKeyframes && hasScale && hasAnim) {
        return {
          success: true,
          doorState: true,
          message: 'Animação fluída com @keyframes renderizando a 60fps no navegador!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Defina @keyframes pulsar com scale e atribua animation: pulsar.',
      };
    },
  },
  {
    id: 18,
    title: 'Fase 18: Layout Responsivo Mobile (@media)',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Adicione a media query @media (max-width: 768px) para empilhar o menu verticalmente com flex-direction: column',
    puzzleDescription: 'Mais de 60% do tráfego da internet é mobile. Media queries adaptam o visual para telas de celulares e tablets.',
    initialCode: `/* Ajuste o menu para telas pequenas: */
@media (max-width: 768px) {
  .menu {
    flex-direction: column;
    gap: 12px;
  }
}
`,
    hints: [
      '@media (max-width: 768px) aplica as regras apenas em dispositivos menores que 768px.',
      'flex-direction: column empilha os itens um embaixo do outro.',
    ],
    expectedConditionText: '@media (max-width: 768px) com flex-direction: column',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Adaptação para Celular',
      previewSnippet: '<div class="p-2 border rounded text-xs text-center"><div class="text-[10px] text-emerald-400">📱 Mobile Viewport (< 768px)</div><div class="mt-1 flex flex-col gap-1"><span>Menu Item 1</span><span>Menu Item 2</span></div></div>',
      successBadge: 'Mobile First OK',
    },
    validate: (rawCode) => {
      const hasMedia = /@media\s*\(\s*max-width\s*:\s*768px\s*\)/i.test(rawCode);
      const hasCol = /flex-direction\s*:\s*column\b/i.test(rawCode);
      if (hasMedia && hasCol) {
        return {
          success: true,
          doorState: true,
          message: 'Responsividade mobile aprovada! O layout agora se adapta a qualquer celular!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Inclua @media (max-width: 768px) com flex-direction: column.',
      };
    },
  },
  {
    id: 19,
    title: 'Fase 19: Cabeçalho Fixo na Rolagem (position: sticky)',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Fixe o header no topo durante a rolagem com position: sticky, top: 0 e z-index: 50',
    puzzleDescription: 'O menu fixo permite que o usuário navegue pelo site sem precisar rolar tudo de volta até o topo.',
    initialCode: `/* Mantenha o cabeçalho sempre visível no topo da página: */
.header-fixo {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(8px);
}
`,
    hints: [
      'position: sticky cola o elemento na coordenada indicada (top: 0).',
      'z-index: 50 garante que ele passe por cima de todos os textos da página.',
    ],
    expectedConditionText: 'position: sticky com top: 0 e z-index: 50',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Header Flutuante Sticky',
      previewSnippet: '<div class="p-2 bg-neutral-900 border-b border-blue-500/40 text-xs flex justify-between font-mono"><span>📌 [Sticky Header Top: 0]</span><span class="text-blue-400">Z-Index: 50</span></div>',
      successBadge: 'Sticky Header OK',
    },
    validate: (rawCode) => {
      const hasSticky = /position\s*:\s*(sticky|fixed)\b/i.test(rawCode);
      const hasTop = /top\s*:\s*0\b/i.test(rawCode);
      const hasZ = /z-index\s*:\s*50\b/i.test(rawCode);
      if (hasSticky && hasTop && hasZ) {
        return {
          success: true,
          doorState: true,
          message: 'Cabeçalho sticky fixado com sucesso no topo!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Configure position: sticky, top: 0 e z-index: 50.',
      };
    },
  },
  {
    id: 20,
    title: 'Fase 20: Design System de um Site Completo',
    themeStyle: 'web-layout',
    themeCategory: 'web-builder',
    targetObjective: 'Combine tipografia, cores, botões, espaçamentos e sombras na folha de estilo definitiva',
    puzzleDescription: 'A consagração do designer frontend: unir todas as propriedades para criar uma identidade visual completa e elegante.',
    initialCode: `/* Design System completo da aplicação: */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
  background-color: #0b0f19;
  color: #f8fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
`,
    hints: [
      'box-sizing: border-box garante que paddings não quebrem as larguras dos elementos.',
      'max-width: 1200px e margin: 0 auto centralizam o site em monitores widescreen.',
    ],
    expectedConditionText: 'box-sizing: border-box com reset e container centralizado',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Design System Master',
      previewSnippet: '<div class="p-3 bg-neutral-900 border border-emerald-500/40 rounded-xl text-center"><div class="text-xs font-bold text-emerald-400">🎨 Folha de Estilo Completa</div><div class="text-[11px] text-neutral-400">Tipografia, Reset, Containers e Grid Harmônicos</div></div>',
      successBadge: 'Mestre em CSS & UI',
    },
    validate: (rawCode) => {
      const hasBox = /box-sizing\s*:\s*border-box/i.test(rawCode);
      const hasContainer = /\.container\b[\s\S]*max-width[\s\S]*margin\s*:\s*0\s+auto/i.test(rawCode);
      if (hasBox && hasContainer) {
        return {
          success: true,
          doorState: true,
          message: '🏆 EXTRAORDINÁRIO! Você dominou o CSS e agora cria interfaces modernas e responsivas para qualquer projeto!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Inclua box-sizing: border-box e a classe .container com max-width e margin: 0 auto.',
      };
    },
  },
];

export const CSS_LEVELS: GameLevel[] = [...CSS_BASE_LEVELS, ...CSS_EXTRA_LEVELS];
