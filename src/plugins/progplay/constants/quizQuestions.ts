export interface QuizQuestion {
  id: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
}

export const QUIZ_QUESTIONS_BY_LANGUAGE: Record<string, QuizQuestion[]> = {
  html: [
    {
      id: 1,
      question: 'Qual tag HTML5 é semanticamente correta para agrupar links de navegação principal?',
      codeSnippet: '<div class="menu">\n  <a href="/">Home</a>\n</div>',
      options: ['<menu-bar>', '<navigation>', '<nav>', '<section-nav>'],
      correctAnswer: 2,
      explanation: 'A tag <nav> é o elemento semântico oficial do HTML5 para representar blocos de navegação.',
    },
    {
      id: 2,
      question: 'Qual atributo é indispensável para acessibilidade e leitores de tela na tag <img>?',
      codeSnippet: '<img src="foto.jpg" ???="Descrição da foto">',
      options: ['title', 'alt', 'desc', 'aria-image'],
      correctAnswer: 1,
      explanation: 'O atributo "alt" fornece texto alternativo essencial para leitores de tela e SEO.',
    },
    {
      id: 3,
      question: 'Qual é o tipo correto de <input> para que no celular abra o teclado numérico de telefone?',
      options: ['type="number"', 'type="tel"', 'type="phone"', 'type="digits"'],
      correctAnswer: 1,
      explanation: 'input type="tel" é otimizado para números de telefone em dispositivos móveis.',
    },
    {
      id: 4,
      question: 'Como abrir um link <a> em uma nova aba do navegador com segurança?',
      codeSnippet: '<a href="https://site.com" target="_blank" rel="???">',
      options: ['rel="noopener noreferrer"', 'rel="external"', 'rel="new-window"', 'rel="safe"'],
      correctAnswer: 0,
      explanation: 'target="_blank" com rel="noopener noreferrer" previne vulnerabilidades de segurança (tabnabbing).',
    },
    {
      id: 5,
      question: 'O que a tag <meta name="viewport" content="width=device-width, initial-scale=1.0"> faz?',
      options: [
        'Acelera o carregamento das fontes',
        'Garante a responsividade adaptando o zoom à largura real do dispositivo',
        'Impede que o usuário dê scroll na página',
        'Ativa o modo escuro automático',
      ],
      correctAnswer: 1,
      explanation: 'A meta viewport é o alicerce do design responsivo em dispositivos móveis.',
    },
  ],
  javascript: [
    {
      id: 1,
      question: 'Qual será a saída de typeof NaN em JavaScript?',
      codeSnippet: 'console.log(typeof NaN);',
      options: ['"undefined"', '"number"', '"NaN"', '"object"'],
      correctAnswer: 1,
      explanation: 'Em JavaScript, NaN (Not-a-Number) é formalmente um valor numérico inválido do tipo "number".',
    },
    {
      id: 2,
      question: 'Qual será o resultado da comparação abaixo?',
      codeSnippet: 'console.log([] == ![]);',
      options: ['true', 'false', 'TypeError', 'undefined'],
      correctAnswer: 0,
      explanation: '![] se torna false (0). [] se converte para "" (0). Logo 0 == 0 é true devido à coerção.',
    },
    {
      id: 3,
      question: 'Qual método de Array cria um novo array contendo apenas os itens que atendem a uma condição?',
      codeSnippet: 'const resultado = itens.???(item => item.preco > 50);',
      options: ['map()', 'filter()', 'reduce()', 'find()'],
      correctAnswer: 1,
      explanation: 'O método filter() retorna um novo array com todos os elementos que retornam true no predicado.',
    },
    {
      id: 4,
      question: 'Como funciona a diferença fundamental entre var e let/const?',
      options: [
        'var possui escopo de bloco e let escopo de função',
        'let e const possuem escopo de bloco, enquanto var possui escopo de função',
        'const pode ser reatribuído normalmente',
        'Não há diferença de escopo no JavaScript moderno',
      ],
      correctAnswer: 1,
      explanation: 'let e const respeitam as chaves {} de blocos (if, for), evitando vazamentos de escopo.',
    },
    {
      id: 5,
      question: 'O que o método Promise.all() retorna se uma das promessas falhar (reject)?',
      options: [
        'Retorna as promessas que deram certo',
        'Rejeita imediatamente com o erro da primeira promessa que falhou',
        'Espera todas terminarem e depois joga um aviso',
        'Retorna null',
      ],
      correctAnswer: 1,
      explanation: 'Promise.all falha rápido (fail-fast): ao primeiro reject, toda a operação é rejeitada.',
    },
  ],
  python: [
    {
      id: 1,
      question: 'Qual será a saída deste fatiamento (slice) em Python?',
      codeSnippet: 'texto = "PYTHON"\nprint(texto[::-1])',
      options: ['"PYTHON"', '"NOHTYP"', '"P"', '"IndexError"'],
      correctAnswer: 1,
      explanation: '[::-1] inverte a string com passo negativo de -1.',
    },
    {
      id: 2,
      question: 'Qual é a estrutura de dados imutável em Python?',
      options: ['Lista (list)', 'Dicionário (dict)', 'Tupla (tuple)', 'Conjunto (set)'],
      correctAnswer: 2,
      explanation: 'Tuplas são sequências imutáveis; uma vez criadas, seus itens não podem ser alterados.',
    },
    {
      id: 3,
      question: 'O que a expressão abaixo gera em Python?',
      codeSnippet: 'quadrados = [x**2 for x in range(4)]',
      options: ['[0, 1, 4, 9]', '[1, 4, 9, 16]', '[0, 2, 4, 6]', '(0, 1, 4, 9)'],
      correctAnswer: 0,
      explanation: 'range(4) gera 0, 1, 2, 3. Ao elevar ao quadrado: [0, 1, 4, 9].',
    },
    {
      id: 4,
      question: 'Como se define os parâmetros padrão de uma função com tipagem opcional em Python 3?',
      codeSnippet: 'def somar(a: int, b: int = 10) -> int:',
      options: [
        'O valor padrão de b será 10 se não for informado',
        'A função causa erro de sintaxe com tipagem',
        'b é obrigatório ser 10 sempre',
        'O retorno é convertido forçadamente para float',
      ],
      correctAnswer: 0,
      explanation: 'b: int = 10 define 10 como valor padrão e -> int é a anotação de tipo de retorno.',
    },
    {
      id: 5,
      question: 'Qual método é executado automaticamente quando instanciamos um novo objeto de uma classe?',
      options: ['__start__', '__new__', '__init__', '__main__'],
      correctAnswer: 2,
      explanation: '__init__ é o método inicializador/construtor padrão das classes em Python.',
    },
  ],
  css: [
    {
      id: 1,
      question: 'No Flexbox, qual propriedade alinha os itens no eixo principal (main axis)?',
      options: ['align-items', 'justify-content', 'align-content', 'flex-direction'],
      correctAnswer: 1,
      explanation: 'justify-content alinha ao longo do eixo principal (horizontal por padrão em flex-direction: row).',
    },
    {
      id: 2,
      question: 'O que faz a propriedade CSS box-sizing: border-box?',
      options: [
        'Adiciona uma borda preta em todas as divs',
        'Inclui o padding e a borda no cálculo da largura e altura total do elemento',
        'Remove todas as margens do elemento',
        'Obriga o elemento a se comportar como tabela',
      ],
      correctAnswer: 1,
      explanation: 'border-box impede que padding e border estourem a largura definida para o elemento.',
    },
    {
      id: 3,
      question: 'Qual seletor tem a maior especificidade em CSS?',
      options: [
        'div.card p',
        '#menu-principal',
        '.header .nav ul li a',
        'body div span',
      ],
      correctAnswer: 1,
      explanation: 'IDs (#menu-principal) possuem especificidade 0-1-0-0, superando qualquer combinação de classes e tags.',
    },
  ],
  sql: [
    {
      id: 1,
      question: 'Qual cláusula SQL é utilizada para filtrar resultados baseados em funções de agregação como COUNT() ou AVG()?',
      codeSnippet: 'SELECT departamento, COUNT(*) FROM funcionarios GROUP BY departamento ??? COUNT(*) > 5;',
      options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'],
      correctAnswer: 1,
      explanation: 'HAVING filtra os grupos gerados por GROUP BY após o cálculo das funções agregadas.',
    },
    {
      id: 2,
      question: 'Qual tipo de JOIN retorna todas as linhas da tabela esquerda mesmo quando não houver correspondência na direita?',
      options: ['INNER JOIN', 'LEFT JOIN (ou LEFT OUTER JOIN)', 'RIGHT JOIN', 'CROSS JOIN'],
      correctAnswer: 1,
      explanation: 'LEFT JOIN preserva todos os registros da tabela da esquerda e preenche com NULL os da direita ausentes.',
    },
  ],
};
