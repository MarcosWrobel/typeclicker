import type { Monaco } from '@monaco-editor/react';

let isRegistered = false;

/**
 * Registers rich, intelligent autocomplete providers and snippets
 * for Python, JavaScript, HTML, CSS, and SQL in Monaco Editor.
 */
export function registerAutocompleteProviders(monaco: Monaco) {
  if (isRegistered) return;
  isRegistered = true;

  // ----------------------------------------------------
  // 1. PYTHON AUTOCOMPLETE & SNIPPETS
  // ----------------------------------------------------
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        // Control flow & keywords
        {
          label: 'def',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'def ${1:nome_funcao}(${2:parametros}):\n\t${3:return None}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Define uma nova função em Python',
          range,
        },
        {
          label: 'class',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'class ${1:NomeClasse}:\n\tdef __init__(self, ${2:parametros}):\n\t\tself.${3:atributo} = ${2:parametros}\n',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Cria uma nova classe com construtor __init__',
          range,
        },
        {
          label: 'if',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if ${1:condicao}:\n\t${2:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Estrutura condicional if',
          range,
        },
        {
          label: 'ifelse',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'if ${1:condicao}:\n\t${2:pass}\nelse:\n\t${3:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Estrutura condicional if / else',
          range,
        },
        {
          label: 'for',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'for ${1:item} in ${2:lista}:\n\t${3:print(${1:item})}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Laço de repetição for in',
          range,
        },
        {
          label: 'for_range',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'for ${1:i} in range(${2:10}):\n\t${3:print(${1:i})}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Laço for com range()',
          range,
        },
        {
          label: 'while',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'while ${1:condicao}:\n\t${2:pass}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Laço while',
          range,
        },
        {
          label: 'try_except',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'try:\n\t${1:operacao()}\nexcept Exception as ${2:erro}:\n\t${3:print(f"Erro: {${2:erro}}")}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Tratamento de exceções try / except',
          range,
        },
        {
          label: 'list_comprehension',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '[${1:x} for ${1:x} in ${2:iteravel} if ${3:True}]',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'List Comprehension (criação rápida de listas)',
          range,
        },
        {
          label: 'dict_comprehension',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '{${1:k}: ${2:v} for ${1:k}, ${2:v} in ${3:iteravel}}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Dictionary Comprehension',
          range,
        },

        // Common Built-in Functions
        {
          label: 'print',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'print(${1:objeto})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Imprime valores no console ou terminal',
          range,
        },
        {
          label: 'len',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'len(${1:objeto})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Retorna a quantidade de itens de uma lista, string ou dicionário',
          range,
        },
        {
          label: 'range',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'range(${1:inicio}, ${2:fim})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Gera uma sequência de números',
          range,
        },
        {
          label: 'round',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'round(${1:numero}, ${2:2})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Arredonda um número float para casas decimais',
          range,
        },
        {
          label: 'sum',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'sum(${1:lista})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Soma todos os elementos de uma lista numérica',
          range,
        },
        {
          label: 'type',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'type(${1:objeto})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Retorna o tipo de dado do objeto',
          range,
        },
        {
          label: 'isinstance',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'isinstance(${1:objeto}, ${2:tipo})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Verifica se o objeto é uma instância do tipo',
          range,
        },

        // API & Web Snippets
        {
          label: 'json.dumps',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: 'json.dumps(${1:dados}, indent=2)',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Serializa um dicionário/lista Python para texto JSON',
          range,
        },
        {
          label: 'json.loads',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: 'json.loads(${1:texto_json})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Decodifica uma string JSON para dicionário Python',
          range,
        },
        {
          label: 'import json',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'import json\n',
          documentation: 'Importa a biblioteca nativa JSON de Python',
          range,
        },
        {
          label: 'import math',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'import math\n',
          documentation: 'Importa funções matemáticas avançadas',
          range,
        },
        {
          label: 'import random',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'import random\n',
          documentation: 'Importa gerador de números aleatórios',
          range,
        },

        // Booleans & Constants
        { label: 'True', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'True', range },
        { label: 'False', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'False', range },
        { label: 'None', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'None', range },
        { label: 'return', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'return ', range },
        { label: 'append', kind: monaco.languages.CompletionItemKind.Method, insertText: 'append(${1:item})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
        { label: 'startswith', kind: monaco.languages.CompletionItemKind.Method, insertText: 'startswith("${1:Bearer }")', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
        { label: 'split', kind: monaco.languages.CompletionItemKind.Method, insertText: 'split("${1: }")', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
      ];

      return { suggestions };
    },
  });

  // ----------------------------------------------------
  // 2. JAVASCRIPT AUTOCOMPLETE & SNIPPETS
  // ----------------------------------------------------
  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        {
          label: 'clg',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'console.log(${1:item});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'console.log() atalho rápido',
          range,
        },
        {
          label: 'fun',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'function ${1:nomeFuncao}(${2:params}) {\n\t${3:return true;}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Declaração de função tradicional',
          range,
        },
        {
          label: 'arrow',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'const ${1:nome} = (${2:params}) => {\n\t${3}\n};',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Declaração de Arrow Function ES6',
          range,
        },
        {
          label: 'async_fn',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'async function ${1:nome}(${2:params}) {\n\ttry {\n\t\tconst res = await ${3:promise};\n\t\treturn res;\n\t} catch (err) {\n\t\tconsole.error(err);\n\t}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Função assíncrona async/await',
          range,
        },
        {
          label: 'getElementById',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: 'document.getElementById("${1:id}")',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Busca um elemento do DOM pelo ID',
          range,
        },
        {
          label: 'querySelector',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: 'document.querySelector("${1:.classe}")',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Busca o primeiro elemento que bate com o seletor CSS',
          range,
        },
        {
          label: 'addEventListener',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: '${1:elemento}.addEventListener("${2:click}", (evento) => {\n\t${3}\n});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Escuta eventos (click, submit, change, etc.)',
          range,
        },
        {
          label: 'map',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: '${1:array}.map((${2:item}) => ${3:${2:item}})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Transforma cada elemento de um array',
          range,
        },
        {
          label: 'filter',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: '${1:array}.filter((${2:item}) => ${3:condicao})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Filtra os elementos de um array',
          range,
        },
        {
          label: 'reduce',
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: '${1:array}.reduce((acum, atual) => {\n\treturn acum + atual;\n}, 0)',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Reduz o array para um único valor',
          range,
        },
        {
          label: 'fetch_api',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'fetch("${1:https://api.site.com/dados}")\n\t.then(res => res.json())\n\t.then(data => console.log(data))\n\t.catch(err => console.error(err));',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Requisição HTTP com a API fetch()',
          range,
        },
      ];

      return { suggestions };
    },
  });

  // ----------------------------------------------------
  // 3. HTML AUTOCOMPLETE & SNIPPETS
  // ----------------------------------------------------
  monaco.languages.registerCompletionItemProvider('html', {
    provideCompletionItems: (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        {
          label: 'html5',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n\t<meta charset="UTF-8">\n\t<title>${1:Título}</title>\n</head>\n<body>\n\t<h1>${2:Olá Mundo}</h1>\n</body>\n</html>',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Estrutura inicial completa de HTML5',
          range,
        },
        {
          label: 'button',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '<button id="${1:btn}" class="${2:btn-primary}">${3:Clique Aqui}</button>',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Elemento de botão clicável',
          range,
        },
        {
          label: 'div_card',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '<div class="card">\n\t<h2>${1:Título do Card}</h2>\n\t<p>${2:Descrição do produto ou conteúdo}</p>\n\t<button>${3:Acessar}</button>\n</div>',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Card component HTML',
          range,
        },
        {
          label: 'nav',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '<nav class="navbar">\n\t<a href="#">${1:Logo}</a>\n\t<ul>\n\t\t<li><a href="#inicio">Início</a></li>\n\t\t<li><a href="#sobre">Sobre</a></li>\n\t</ul>\n</nav>',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Barra de navegação semântica',
          range,
        },
      ];

      return { suggestions };
    },
  });

  // ----------------------------------------------------
  // 4. CSS AUTOCOMPLETE & SNIPPETS
  // ----------------------------------------------------
  monaco.languages.registerCompletionItemProvider('css', {
    provideCompletionItems: (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        {
          label: 'flex_center',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'display: flex;\njustify-content: center;\nalign-items: center;',
          documentation: 'Centralização perfeita com Flexbox',
          range,
        },
        {
          label: 'flex_between',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'display: flex;\njustify-content: space-between;\nalign-items: center;',
          documentation: 'Flexbox com espaçamento de navbar (extremos)',
          range,
        },
        {
          label: 'grid_3_cols',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngap: ${1:16px};',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Grade CSS com 3 colunas fluidas',
          range,
        },
        {
          label: 'glassmorphism',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'background: rgba(255, 255, 255, 0.1);\nbackdrop-filter: blur(10px);\nborder: 1px solid rgba(255, 255, 255, 0.2);\nborder-radius: 12px;',
          documentation: 'Efeito de vidro translúcido moderno',
          range,
        },
      ];

      return { suggestions };
    },
  });

  // ----------------------------------------------------
  // 5. SQL AUTOCOMPLETE & SNIPPETS
  // ----------------------------------------------------
  monaco.languages.registerCompletionItemProvider('sql', {
    provideCompletionItems: (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        {
          label: 'SELECT_ALL',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'SELECT * FROM ${1:tabela} WHERE ${2:condicao};',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Consulta todos os registros de uma tabela',
          range,
        },
        {
          label: 'INSERT_INTO',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'INSERT INTO ${1:tabela} (${2:col1}, ${3:col2}) VALUES (${4:val1}, ${5:val2});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Insere uma nova linha na tabela',
          range,
        },
        {
          label: 'CREATE_TABLE',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'CREATE TABLE ${1:tabela} (\n\tid INT PRIMARY KEY,\n\t${2:nome} VARCHAR(100) NOT NULL,\n\t${3:preco} DECIMAL(10, 2)\n);',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Cria uma nova tabela relacional',
          range,
        },
        {
          label: 'INNER_JOIN',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'SELECT ${1:t1.col}, ${2:t2.col}\nFROM ${3:tabela1} t1\nINNER JOIN ${4:tabela2} t2 ON t1.${5:id} = t2.${6:t1_id};',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Junção de tabelas INNER JOIN',
          range,
        },
      ];

      return { suggestions };
    },
  });
}
