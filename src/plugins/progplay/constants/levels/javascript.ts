import { GameLevel } from './types';
import { JAVASCRIPT_EXTRA_LEVELS } from './javascript_extra';

const JAVASCRIPT_BASE_LEVELS: GameLevel[] = [
  // ==========================================
  // CAPÍTULO 1: O ENIGMA DA PORTA (FASES 1 A 10)
  // ==========================================
  {
    id: 1,
    title: 'Fase 1: O Sinal Booleano',
    themeStyle: 'wooden',
    themeCategory: 'door',
    targetObjective: 'Mude porta_aberta para true',
    puzzleDescription: 'A grande porta de carvalho aguarda um sinal afirmativo no circuito.',
    initialCode: `// A porta de madeira está bloqueada por uma trava lógica.
// Altere o estado do sinal para liberar a fechadura:

let porta_aberta = false;
`,
    hints: [
      'A variável armazena um valor booleano.',
      'Em JavaScript, verdadeiro é escrito com letras minúsculas: "true".',
      'Troque o valor "false" por "true".',
    ],
    expectedConditionText: 'porta_aberta === true',
    validate: (rawCode, scope) => {
      const isTrue = scope?.porta_aberta === true || /porta_aberta\s*=\s*(true|True)\b/i.test(rawCode);
      if (isTrue) {
        return {
          success: true,
          doorState: true,
          message: 'Sinal afirmativo recebido! A porta de madeira destrancou!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A porta continua fechada. Altere porta_aberta para true.',
      };
    },
  },
  {
    id: 2,
    title: 'Fase 2: A Chave Mecânica',
    themeStyle: 'iron',
    themeCategory: 'door',
    targetObjective: 'Colete a chave dourada',
    puzzleDescription: 'O mecanismo da porta de ferro requer que você possua a chave.',
    initialCode: `// A fechadura de ferro só gira se tem_chave for verdadeiro.
let tem_chave = false;
let porta_aberta = tem_chave;
`,
    hints: [
      'A porta depende do valor da variável tem_chave.',
      'Altere "tem_chave" para true.',
      'A linha seguinte atribuirá o valor positivo a porta_aberta.',
    ],
    expectedConditionText: 'tem_chave === true',
    validate: (rawCode, scope) => {
      const hasKey = scope?.tem_chave === true || /tem_chave\s*=\s*(true|True)\b/i.test(rawCode);
      if (hasKey) {
        return {
          success: true,
          doorState: true,
          message: 'Chave inserida! O trinco girou e a porta de ferro se abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Você ainda não pegou a chave. Mude tem_chave para true.',
      };
    },
  },
  {
    id: 3,
    title: 'Fase 3: O Teclado Numérico',
    themeStyle: 'vault',
    themeCategory: 'door',
    targetObjective: 'Digite o código numérico 777',
    puzzleDescription: 'O cofre reforçado aceita apenas uma combinação numérica sagrada.',
    initialCode: `// A combinação deste cofre é 777.
// Digite a senha correta no teclado digital:
let senha_correta = 777;
let senha_digitada = 0;

let porta_aberta = (senha_digitada === senha_correta);
`,
    hints: [
      'A senha_digitada atual é 0.',
      'Altere o número 0 para 777.',
      'A comparação === retornará true quando forem idênticos.',
    ],
    expectedConditionText: 'senha_digitada === 777',
    validate: (rawCode, scope) => {
      const pass = scope?.senha_digitada === 777 || /senha_digitada\s*=\s*777\b/.test(rawCode);
      if (pass) {
        return {
          success: true,
          doorState: true,
          message: 'Código 777 aceito! As engrenagens do cofre se recolheram!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Senha incorreta! Digite exatamente 777 em senha_digitada.',
      };
    },
  },
  {
    id: 4,
    title: 'Fase 4: Dois Interruptores (AND)',
    themeStyle: 'scifi',
    themeCategory: 'door',
    targetObjective: 'Ligue ambos os interruptores (A && B)',
    puzzleDescription: 'O portal sci-fi necessita de energia simultânea de duas fontes.',
    initialCode: `// Ambos os interruptores precisam estar ligados (true).
let interruptor_A = true;
let interruptor_B = false;

let porta_aberta = interruptor_A && interruptor_B;
`,
    hints: [
      'O operador && (AND) só é verdadeiro se ambos os lados forem true.',
      'Atualmente interruptor_B está como false.',
      'Mude interruptor_B para true.',
    ],
    expectedConditionText: 'interruptor_A && interruptor_B',
    validate: (rawCode, scope) => {
      const a = scope?.interruptor_A === true || /interruptor_A\s*=\s*true\b/.test(rawCode);
      const b = scope?.interruptor_B === true || /interruptor_B\s*=\s*true\b/.test(rawCode);
      if (a && b) {
        return {
          success: true,
          doorState: true,
          message: 'Circuito duplo energizado! O portal sci-fi se abriu!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Falta energia! Ligue também o interruptor_B (coloque true).',
      };
    },
  },
  {
    id: 5,
    title: 'Fase 5: O Palíndromo Místico',
    themeStyle: 'portal',
    themeCategory: 'door',
    targetObjective: 'Pronuncie a palavra secreta "abracadabra"',
    puzzleDescription: 'O portal mágico só reage a palavras de poder.',
    initialCode: `// O portal mágico responde apenas ao encantamento correto:
let encantamento = "silencio";

let porta_aberta = (encantamento === "abracadabra");
`,
    hints: [
      'A variável encantamento deve receber o texto exato "abracadabra".',
      'Use aspas duplas ou simples para strings: "abracadabra".',
    ],
    expectedConditionText: 'encantamento === "abracadabra"',
    validate: (rawCode, scope) => {
      const match = scope?.encantamento === 'abracadabra' || /encantamento\s*=\s*["']abracadabra["']/.test(rawCode);
      if (match) {
        return {
          success: true,
          doorState: true,
          message: 'Encantamento ressoou pelo salão! O vórtice do portal foi ativado!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'O portal não reagiu. Defina encantamento como "abracadabra".',
      };
    },
  },
  {
    id: 6,
    title: 'Fase 6: O Altar dos Cristais',
    themeStyle: 'portal',
    themeCategory: 'door',
    targetObjective: 'Insira 3 cristais mágicos na lista',
    puzzleDescription: 'O pedestal requer exatamente 3 cristais no array para equilibrar o feitiço.',
    initialCode: `// O pedestal exige uma lista com exatamente 3 cristais de poder:
let cristais = ["rubi"];

let porta_aberta = (cristais.length === 3);
`,
    hints: [
      'Arrays são listas delimitadas por colchetes [].',
      'Adicione mais 2 elementos separados por vírgula, ex: ["rubi", "safira", "esmeralda"].',
    ],
    expectedConditionText: 'cristais.length === 3',
    validate: (rawCode, scope) => {
      const isThree = (Array.isArray(scope?.cristais) && scope.cristais.length === 3) ||
        /cristais\s*=\s*\[[^\]]+,[^\]]+,[^\]]+\]/.test(rawCode);
      if (isThree) {
        return {
          success: true,
          doorState: true,
          message: '3 cristais alinhados! A ressonância abriu a passagem mística!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'São necessários exatamente 3 cristais na lista para abrir a passagem.',
      };
    },
  },
  {
    id: 7,
    title: 'Fase 7: O Gerador de Tensão',
    themeStyle: 'scifi',
    themeCategory: 'door',
    targetObjective: 'Ajuste a voltagem para pelo menos 100V',
    puzzleDescription: 'A porta blindada necessita de pelo menos 100 volts para destravar.',
    initialCode: `// A voltagem precisa ser maior ou igual a 100 para desarmar a trava:
let voltagem = 45;

let porta_aberta = (voltagem >= 100);
`,
    hints: [
      'A voltagem atual de 45 é insuficiente.',
      'Defina voltagem com um valor de 100 ou superior (ex: 100 ou 120).',
    ],
    expectedConditionText: 'voltagem >= 100',
    validate: (rawCode, scope) => {
      const volt = typeof scope?.voltagem === 'number' ? scope.voltagem : 0;
      if (volt >= 100 || /voltagem\s*=\s*([1-9]\d{2,})\b/.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Tensão suficiente! Os eletroímãs liberaram a porta pesada!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Voltagem insuficiente! Configure voltagem >= 100.',
      };
    },
  },
  {
    id: 8,
    title: 'Fase 8: A Negação Lógica (NOT)',
    themeStyle: 'vault',
    themeCategory: 'door',
    targetObjective: 'Desative a trava com false',
    puzzleDescription: 'O sistema inverte o sinal: a porta abre quando a trava é desligada.',
    initialCode: `// O operador ! inverte o valor booleano.
// Para que !trava_bloqueada seja true, ela deve estar desligada:
let trava_bloqueada = true;

let porta_aberta = !trava_bloqueada;
`,
    hints: [
      'A trava_bloqueada está atualmente como true.',
      'Altere trava_bloqueada para false.',
      'O operador ! (NOT) transformará false em true!',
    ],
    expectedConditionText: '!trava_bloqueada === true',
    validate: (rawCode, scope) => {
      const off = scope?.trava_bloqueada === false || /trava_bloqueada\s*=\s*(false|False)\b/i.test(rawCode);
      if (off) {
        return {
          success: true,
          doorState: true,
          message: 'Trava de segurança desativada! O portão se abriu suavemente!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A trava ainda está ativa! Mude trava_bloqueada para false.',
      };
    },
  },
  {
    id: 9,
    title: 'Fase 9: A Chave do Objeto',
    themeStyle: 'iron',
    themeCategory: 'door',
    targetObjective: 'Configure o objeto portal com desbloqueado: true',
    puzzleDescription: 'O terminal decodifica as propriedades do objeto de configuração do portal.',
    initialCode: `// Configure a propriedade desbloqueado do objeto portal para true:
let portal = {
  nome: "Norte",
  desbloqueado: false
};

let porta_aberta = portal.desbloqueado;
`,
    hints: [
      'Dentro do objeto portal, localize "desbloqueado: false".',
      'Mude para "desbloqueado: true".',
    ],
    expectedConditionText: 'portal.desbloqueado === true',
    validate: (rawCode, scope) => {
      const ok = scope?.portal?.desbloqueado === true || /desbloqueado\s*:\s*true\b/.test(rawCode);
      if (ok) {
        return {
          success: true,
          doorState: true,
          message: 'Propriedade verificada no objeto! O acesso foi concedido!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'O portal permanece trancado. Altere portal.desbloqueado para true.',
      };
    },
  },
  {
    id: 10,
    title: 'Fase 10: O Gatilho da Função',
    themeStyle: 'wooden',
    themeCategory: 'door',
    targetObjective: 'Faça a função destravar() retornar true',
    puzzleDescription: 'A fechadura de mola responde à invocação de um procedimento mestre.',
    initialCode: `// Complete a função destravar para que ela retorne true:
function destravar() {
  return false;
}

let porta_aberta = destravar();
`,
    hints: [
      'A instrução return define o que a função entrega ao ser executada.',
      'Troque "return false;" por "return true;".',
    ],
    expectedConditionText: 'destravar() === true',
    validate: (rawCode, scope) => {
      let fnReturn = false;
      try {
        if (typeof scope?.destravar === 'function') {
          fnReturn = scope.destravar() === true;
        }
      } catch {}
      if (fnReturn || /return\s+true\b/.test(rawCode)) {
        return {
          success: true,
          doorState: true,
          message: 'Função executada com sucesso! Você conquistou o Capítulo 1 das Portas!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'A função retornou false. Altere o corpo para "return true;".',
      };
    },
  },

  // =======================================================
  // CAPÍTULO 2: CONSTRUÇÃO DE SITES REAIS (FASES 11 A 20)
  // =======================================================
  {
    id: 11,
    title: 'Fase 11: Manipulação do DOM - O Título do Site',
    themeStyle: 'web-component',
    themeCategory: 'web-builder',
    targetObjective: 'Altere o textContent do elemento #site-title para "Meu Site Incrível"',
    puzzleDescription: 'No desenvolvimento web real, usamos JavaScript para interagir e modificar elementos do HTML dinamicamente.',
    initialCode: `// Selecione o elemento pelo ID e modifique o texto:
const elementoTitulo = document.getElementById("site-title");

// Defina o título do site para "Meu Site Incrível":
elementoTitulo.textContent = "Título Antigo";
`,
    hints: [
      'Em JavaScript para web, document.getElementById busca elementos na página.',
      'Atribua "Meu Site Incrível" na propriedade textContent.',
    ],
    expectedConditionText: 'elementoTitulo.textContent === "Meu Site Incrível"',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Header da Landing Page',
      previewSnippet: '<h1 id="site-title" class="text-2xl font-bold text-blue-400">Meu Site Incrível</h1>',
      successBadge: 'DOM Atualizado',
    },
    validate: (rawCode) => {
      const match = /textContent\s*=\s*["']Meu Site Incr[íi]vel["']/.test(rawCode);
      if (match) {
        return {
          success: true,
          doorState: true,
          message: 'Elemento DOM atualizado com sucesso! O título do site foi alterado!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Defina elementoTitulo.textContent = "Meu Site Incrível".',
      };
    },
  },
  {
    id: 12,
    title: 'Fase 12: Eventos Web - Botão de Modo Escuro',
    themeStyle: 'web-component',
    themeCategory: 'web-builder',
    targetObjective: 'Adicione um ouvinte de clique ao botão para alternar a classe "dark"',
    puzzleDescription: 'Sites modernos respondem às ações dos usuários com addEventListener para cliques, toques e digitação.',
    initialCode: `const botaoTema = document.getElementById("theme-btn");

// Adicione o evento de clique 'click' que alterna a classe 'dark':
botaoTema.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
`,
    hints: [
      'O método addEventListener recebe dois argumentos: o tipo de evento ("click") e a função callback.',
      'Verifique se o evento está definido como "click" e a classe como "dark".',
    ],
    expectedConditionText: 'addEventListener("click", ...) com classList.toggle("dark")',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Seletor de Modo Escuro',
      previewSnippet: '<button class="px-4 py-2 bg-neutral-800 text-white rounded-lg">🌙 Alternar Modo Escuro</button>',
      successBadge: 'Evento Vinculado',
    },
    validate: (rawCode) => {
      const hasListener = /addEventListener\s*\(\s*["']click["']/.test(rawCode);
      const hasToggle = /classList\.toggle\s*\(\s*["']dark["']\s*\)/.test(rawCode);
      if (hasListener && hasToggle) {
        return {
          success: true,
          doorState: true,
          message: 'Evento de clique configurado com perfeição! O botão de Dark Mode está funcional!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Configure addEventListener("click", ...) com document.body.classList.toggle("dark").',
      };
    },
  },
  {
    id: 13,
    title: 'Fase 13: Estado Reativo - Contador Interativo',
    themeStyle: 'web-component',
    themeCategory: 'web-builder',
    targetObjective: 'Crie a função incrementar() que soma 1 ao contador e atualiza a tela',
    puzzleDescription: 'Componentes como carrinhos, contadores de likes e placares dependem de gerenciar variáveis de estado.',
    initialCode: `let contador = 0;
const display = document.getElementById("contador-valor");

function incrementar() {
  // Incremente o contador em 1:
  contador = contador + 1;
  display.innerText = contador;
}
`,
    hints: [
      'Você pode somar 1 usando: contador = contador + 1 ou contador++.',
      'Certifique-se de que a função incrementar existe e incrementa a variável.',
    ],
    expectedConditionText: 'incrementar() soma 1 a contador',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Componente Contador de Vendas',
      previewSnippet: '<div class="flex items-center gap-3"><button class="btn">+</button><span class="text-xl font-bold">1 item</span></div>',
      successBadge: 'Estado Reativo OK',
    },
    validate: (rawCode) => {
      const hasInc = /(contador\s*\+\+|contador\s*=\s*contador\s*\+\s*1|\+\+contador)/.test(rawCode);
      const hasFunc = /function\s+incrementar/.test(rawCode) || /const\s+incrementar\s*=/.test(rawCode);
      if (hasInc && hasFunc) {
        return {
          success: true,
          doorState: true,
          message: 'Lógica do contador implementada! O componente web reage aos cliques!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Implemente a função incrementar() somando 1 à variável contador.',
      };
    },
  },
  {
    id: 14,
    title: 'Fase 14: Validação de Formulário de Cadastro',
    themeStyle: 'web-component',
    themeCategory: 'web-builder',
    targetObjective: 'Valide se o email contém "@" e se a senha tem pelo menos 6 caracteres',
    puzzleDescription: 'Antes de enviar dados a um servidor, sites profissionais validam os inputs no cliente.',
    initialCode: `function validarCadastro(email, senha) {
  // Verifique se email contém "@" e se senha possui tamanho >= 6:
  const emailValido = email.includes("@");
  const senhaValida = senha.length >= 6;

  return emailValido && senhaValida;
}
`,
    hints: [
      'email.includes("@") retorna true se o caractere @ estiver presente.',
      'senha.length >= 6 garante o tamanho mínimo de segurança.',
    ],
    expectedConditionText: 'validarCadastro(email, senha) valida @ e tamanho >= 6',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Formulário de Cadastro do Usuário',
      previewSnippet: '<input placeholder="seu@email.com" class="input" /> <span class="text-xs text-emerald-400">✓ Válido</span>',
      successBadge: 'Formulário Seguro',
    },
    validate: (rawCode) => {
      const hasEmailCheck = /email\.(includes\s*\(\s*["']@["']\s*\)|indexOf\s*\(\s*["']@["']\s*\)\s*!==\s*-1)/.test(rawCode);
      const hasPassCheck = /senha\.length\s*>=\s*6/.test(rawCode);
      if (hasEmailCheck && hasPassCheck) {
        return {
          success: true,
          doorState: true,
          message: 'Validador de formulário aprovado! Evita envios incorretos no site!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Verifique se email.includes("@") e senha.length >= 6 estão implementados.',
      };
    },
  },
  {
    id: 15,
    title: 'Fase 15: Renderização de Lista (.map)',
    themeStyle: 'web-component',
    themeCategory: 'web-builder',
    targetObjective: 'Use o método .map() para transformar o array de produtos em cards HTML',
    puzzleDescription: 'No React e JavaScript moderno, usamos .map() para transformar listas de dados em elementos visuais de e-commerce.',
    initialCode: `const produtos = ["Notebook", "Mouse Gamer", "Teclado RGB"];

// Use produtos.map para gerar os elementos <li> de cada produto:
const listaCards = produtos.map((item) => {
  return \`<li>\${item}</li>\`;
});
`,
    hints: [
      'O método .map itera sobre cada item e retorna um novo array transformado.',
      'Mantenha produtos.map(...) retornando a string HTML do produto.',
    ],
    expectedConditionText: 'produtos.map((item) => `<li>${item}</li>`)',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Grid de Produtos da Loja',
      previewSnippet: '<ul class="space-y-1"><li>💻 Notebook</li><li>🖱️ Mouse Gamer</li><li>⌨️ Teclado RGB</li></ul>',
      successBadge: 'Renderização Dinâmica',
    },
    validate: (rawCode) => {
      const hasMap = /produtos\.map\s*\(/.test(rawCode);
      const hasReturn = /return\s+[`"']<li/.test(rawCode) || /=>\s*[`"']<li/.test(rawCode);
      if (hasMap && hasReturn) {
        return {
          success: true,
          doorState: true,
          message: 'Cards de produtos renderizados dinamicamente a partir dos dados!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Utilize produtos.map(...) retornando a tag <li> para cada item.',
      };
    },
  },
  {
    id: 16,
    title: 'Fase 16: Consumo de API Assíncrona (Async/Await)',
    themeStyle: 'web-component',
    themeCategory: 'web-builder',
    targetObjective: 'Crie uma função async que faz fetch("/api/produtos") e retorna response.json()',
    puzzleDescription: 'Sites integram dados em tempo real conectando-se a APIs REST usando a função fetch e async/await.',
    initialCode: `// Implemente a função assíncrona para buscar dados da API:
async function carregarProdutos() {
  const resposta = await fetch("/api/produtos");
  const dados = await resposta.json();
  return dados;
}
`,
    hints: [
      'A palavra-chave async antes da função permite usar await dentro dela.',
      'await fetch("/api/produtos") aguarda a resposta do servidor.',
      'await resposta.json() converte a resposta em objeto JavaScript.',
    ],
    expectedConditionText: 'async function com await fetch e await resposta.json()',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Conexão REST API',
      previewSnippet: '<div class="text-xs font-mono text-emerald-400">GET /api/produtos → 200 OK (3 itens carregados)</div>',
      successBadge: 'API Conectada',
    },
    validate: (rawCode) => {
      const hasAsync = /async\s+function/.test(rawCode) || /const\s+\w+\s*=\s*async\s*\(/.test(rawCode);
      const hasFetch = /await\s+fetch\s*\(\s*["']\/api\/produtos["']\s*\)/.test(rawCode);
      const hasJson = /await\s+\w+\.json\s*\(\s*\)/.test(rawCode);
      if (hasAsync && hasFetch && hasJson) {
        return {
          success: true,
          doorState: true,
          message: 'Requisição assíncrona perfeita! Seus sites agora recebem dados de qualquer servidor na web!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Implemente async function com await fetch("/api/produtos") e await resposta.json().',
      };
    },
  },
  {
    id: 17,
    title: 'Fase 17: Carrinho de E-commerce (.reduce)',
    themeStyle: 'web-component',
    themeCategory: 'web-builder',
    targetObjective: 'Calcule o subtotal multiplicando preco * quantidade e aplicando cupom de desconto',
    puzzleDescription: 'Todo e-commerce calcula o total do carrinho somando os preços e subtraindo cupons de desconto.',
    initialCode: `const itensCarrinho = [
  { nome: "Camiseta Dev", preco: 50, quantidade: 2 },
  { nome: "Caneca JS", preco: 30, quantidade: 1 }
];

// Calcule o total (preco * quantidade):
const total = itensCarrinho.reduce((acumulador, item) => {
  return acumulador + (item.preco * item.quantidade);
}, 0);
`,
    hints: [
      'O método .reduce reduz um array a um único valor final.',
      'Multiplique item.preco * item.quantidade e some ao acumulador.',
      'O valor inicial do acumulador é 0.',
    ],
    expectedConditionText: 'itensCarrinho.reduce somando item.preco * item.quantidade',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Checkout do E-commerce',
      previewSnippet: '<div class="flex justify-between font-bold"><span>Total a Pagar:</span><span class="text-emerald-400">R$ 130,00</span></div>',
      successBadge: 'Cálculo de Pedido OK',
    },
    validate: (rawCode) => {
      const hasReduce = /itensCarrinho\.reduce\s*\(/.test(rawCode);
      const hasFormula = /(item\.preco\s*\*\s*item\.quantidade|item\.quantidade\s*\*\s*item\.preco)/.test(rawCode);
      if (hasReduce && hasFormula) {
        return {
          success: true,
          doorState: true,
          message: 'Cálculo financeiro de carrinho de compras concluído com exatidão!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Utilize itensCarrinho.reduce multiplicando item.preco * item.quantidade.',
      };
    },
  },
  {
    id: 18,
    title: 'Fase 18: Armazenamento Local (localStorage)',
    themeStyle: 'web-component',
    themeCategory: 'web-builder',
    targetObjective: 'Salve a preferência do usuário no localStorage com setItem',
    puzzleDescription: 'Para que as configurações do site não se percam ao recarregar a página, usamos o LocalStorage do navegador.',
    initialCode: `// Salve o tema escolhido pelo usuário no LocalStorage:
function salvarPreferencia(tema) {
  localStorage.setItem("tema_escolhido", tema);
}

// Chame a função salvando o tema "dark":
salvarPreferencia("dark");
`,
    hints: [
      'localStorage.setItem recebe a chave como primeiro parâmetro e o valor como segundo.',
      'Verifique se você chamou salvarPreferencia("dark").',
    ],
    expectedConditionText: 'localStorage.setItem("tema_escolhido", tema)',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Persistência no Navegador',
      previewSnippet: '<div class="font-mono text-xs text-blue-400">localStorage.getItem("tema_escolhido") → "dark"</div>',
      successBadge: 'Persistência Concluída',
    },
    validate: (rawCode) => {
      const hasSet = /localStorage\.setItem\s*\(\s*["']tema_escolhido["']/.test(rawCode);
      const hasCall = /salvarPreferencia\s*\(\s*["']dark["']\s*\)/.test(rawCode);
      if (hasSet && hasCall) {
        return {
          success: true,
          doorState: true,
          message: 'Dados persistidos no navegador! As preferências agora sobrevivem ao refresh da página!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Configure localStorage.setItem("tema_escolhido", tema) e invoque salvarPreferencia("dark").',
      };
    },
  },
  {
    id: 19,
    title: 'Fase 19: Modal Interativo de Detalhes',
    themeStyle: 'web-component',
    themeCategory: 'web-builder',
    targetObjective: 'Crie as funções abrirModal() e fecharModal() alterando style.display',
    puzzleDescription: 'Janelas pop-up, modais de login e caixas de confirmação são essenciais em qualquer aplicação web.',
    initialCode: `const modal = document.getElementById("meu-modal");

function abrirModal() {
  modal.style.display = "flex";
}

function fecharModal() {
  modal.style.display = "none";
}
`,
    hints: [
      'Para exibir o modal, defina modal.style.display = "flex" ou "block".',
      'Para ocultar o modal, defina modal.style.display = "none".',
    ],
    expectedConditionText: 'abrirModal() define display="flex" e fecharModal() define display="none"',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Janela Modal de Confirmação',
      previewSnippet: '<div class="p-4 bg-neutral-900 border rounded-xl shadow-2xl"><h3>Tem certeza?</h3><div class="mt-2 flex gap-2"><button class="btn">Sim</button></div></div>',
      successBadge: 'Modal Web Funcional',
    },
    validate: (rawCode) => {
      const hasOpen = /modal\.style\.display\s*=\s*["'](flex|block)["']/.test(rawCode);
      const hasClose = /modal\.style\.display\s*=\s*["']none["']/.test(rawCode);
      if (hasOpen && hasClose) {
        return {
          success: true,
          doorState: true,
          message: 'Controle de modal interativo aprovado! Pronto para alertas e caixas de diálogo!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Defina abrirModal com modal.style.display = "flex" e fecharModal com display = "none".',
      };
    },
  },
  {
    id: 20,
    title: 'Fase 20: Roteador de SPA (Single Page Application)',
    themeStyle: 'web-component',
    themeCategory: 'web-builder',
    targetObjective: 'Crie a função navegar(rota) para carregar telas dinamicamente sem recarregar o navegador',
    puzzleDescription: 'Sites modernos como Netflix, GitHub e Spotify são SPAs: mudam de tela instantaneamente sem dar refresh no navegador!',
    initialCode: `// Roteador client-side de página única:
const rotas = {
  home: "Bem-vindo à Página Inicial!",
  produtos: "Confira nosso catálogo de produtos!",
  contato: "Fale conosco pelo formulário."
};

function navegar(rotaEscolhida) {
  const container = document.getElementById("app-view");
  // Defina o conteúdo com base na rota selecionada:
  container.innerHTML = rotas[rotaEscolhida] || "Página 404 Não Encontrada";
  return true;
}

// Navegue para a página inicial:
navegar("home");
`,
    hints: [
      'A função navegar acessa o objeto rotas usando rotas[rotaEscolhida].',
      'O conteúdo do container é atualizado instantaneamente.',
      'Chame navegar("home") para iniciar na Home.',
    ],
    expectedConditionText: 'navegar(rotaEscolhida) atualiza o container com rotas[rotaEscolhida]',
    previewType: 'site-component',
    previewMeta: {
      componentTitle: 'Single Page Application Router',
      previewSnippet: '<nav class="flex gap-2 mb-2"><span class="badge active">Home</span><span class="badge">Produtos</span><span class="badge">Contato</span></nav><p class="text-sm">Bem-vindo à Página Inicial!</p>',
      successBadge: 'Mestre em JavaScript Web',
    },
    validate: (rawCode) => {
      const hasRouter = /rotas\[rotaEscolhida\]/.test(rawCode) || /rotas\[rota\]/.test(rawCode);
      const hasCall = /navegar\s*\(\s*["']home["']\s*\)/.test(rawCode);
      if (hasRouter && hasCall) {
        return {
          success: true,
          doorState: true,
          message: '🏆 ESPETACULAR! Você dominou o desenvolvimento JavaScript e agora cria SPAs completas sozinho!',
        };
      }
      return {
        success: false,
        doorState: false,
        message: 'Complete a função navegar atualizando o container com rotas[rotaEscolhida] e chame navegar("home").',
      };
    },
  },
];

export const JAVASCRIPT_LEVELS: GameLevel[] = [...JAVASCRIPT_BASE_LEVELS, ...JAVASCRIPT_EXTRA_LEVELS];
