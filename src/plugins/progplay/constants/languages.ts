import { SupportedLanguage, EditorFile } from '../types';

export interface LanguageInfo {
  id: SupportedLanguage;
  name: string;
  extension: string;
  monacoLang: string;
  iconColor: string;
  badge: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { id: 'javascript', name: 'JavaScript', extension: '.js', monacoLang: 'javascript', iconColor: '#f7df1e', badge: 'JS' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts', monacoLang: 'typescript', iconColor: '#3178c6', badge: 'TS' },
  { id: 'html', name: 'HTML', extension: '.html', monacoLang: 'html', iconColor: '#e34f26', badge: '<>' },
  { id: 'css', name: 'CSS', extension: '.css', monacoLang: 'css', iconColor: '#1572b6', badge: '#' },
  { id: 'python', name: 'Python', extension: '.py', monacoLang: 'python', iconColor: '#3776ab', badge: 'PY' },
  { id: 'json', name: 'JSON', extension: '.json', monacoLang: 'json', iconColor: '#cbcb41', badge: '{}' },
  { id: 'markdown', name: 'Markdown', extension: '.md', monacoLang: 'markdown', iconColor: '#083fa1', badge: 'M↓' },
  { id: 'sql', name: 'SQL', extension: '.sql', monacoLang: 'sql', iconColor: '#e38c00', badge: 'SQL' },
  { id: 'cpp', name: 'C++', extension: '.cpp', monacoLang: 'cpp', iconColor: '#00599c', badge: 'C++' },
  { id: 'rust', name: 'Rust', extension: '.rs', monacoLang: 'rust', iconColor: '#dea584', badge: 'RS' },
  { id: 'go', name: 'Go', extension: '.go', monacoLang: 'go', iconColor: '#00add8', badge: 'GO' },
  { id: 'php', name: 'PHP', extension: '.php', monacoLang: 'php', iconColor: '#777bb4', badge: 'PHP' },
];

export const INITIAL_FILES: EditorFile[] = [
  {
    id: 'file-1',
    name: 'main.js',
    language: 'javascript',
    content: `// ⚡ Bem-vindo ao ProgPlay
// Digite ou cole seus códigos aqui com suporte completo a sintaxe,
// autocompletar (IntelliSense), atalhos e execução instantânea.

function calcularFibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  
  const sequencia = [0, 1];
  for (let i = 2; i < n; i++) {
    sequencia.push(sequencia[i - 1] + sequencia[i - 2]);
  }
  return sequencia;
}

const resultado = calcularFibonacci(10);
console.log("Sequência de Fibonacci (10 termos):", resultado);

// Exemplo com classes modernas
class Desenvolvedor {
  constructor(nome, linguagemFavorita) {
    this.nome = nome;
    this.linguagemFavorita = linguagemFavorita;
  }

  saudar() {
    return \`Olá! Sou \${this.nome} e programo em \${this.linguagemFavorita}.\`;
  }
}

const dev = new Desenvolvedor("Você", "JavaScript");
console.log(dev.saudar());
`,
  },
  {
    id: 'file-2',
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Minha Página Web</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div class="container">
      <h1>Olá, Mundo!</h1>
      <p>Este código HTML pode ser editado livremente.</p>
      <button onclick="alert('Botão clicado!')">Clique Aqui</button>
    </div>
  </body>
</html>
`,
  },
  {
    id: 'file-3',
    name: 'style.css',
    language: 'css',
    content: `/* Estilos Modernos para a Página */
:root {
  --primary-color: #007acc;
  --bg-dark: #1e1e1e;
  --text-light: #f3f3f3;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-dark);
  color: var(--text-light);
  display: grid;
  place-items: center;
  min-height: 100vh;
}

.container {
  padding: 2.5rem;
  border-radius: 12px;
  background: #252526;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  text-align: center;
}

button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

button:hover {
  opacity: 0.9;
}
`,
  },
  {
    id: 'file-4',
    name: 'app.py',
    language: 'python',
    content: `# Script em Python
import math

def calcular_estatisticas(dados):
    """Calcula média e desvio padrão de uma lista de números."""
    if not dados:
        return {"media": 0, "desvio_padrao": 0}
    
    media = sum(dados) / len(dados)
    variancia = sum((x - media) ** 2 for x in dados) / len(dados)
    desvio = math.sqrt(variancia)
    
    return {
        "total_itens": len(dados),
        "media": round(media, 2),
        "desvio_padrao": round(desvio, 2)
    }

numeros = [12, 15, 23, 42, 55, 68, 89]
resultado = calcular_estatisticas(numeros)
print(f"Estatísticas: {resultado}")
`,
  },
];

export function getLanguageForFilename(filename: string): SupportedLanguage {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  switch (ext) {
    case '.ts':
    case '.tsx':
      return 'typescript';
    case '.html':
    case '.htm':
      return 'html';
    case '.css':
      return 'css';
    case '.py':
      return 'python';
    case '.json':
      return 'json';
    case '.md':
    case '.markdown':
      return 'markdown';
    case '.sql':
      return 'sql';
    case '.cpp':
    case '.cc':
    case '.h':
      return 'cpp';
    case '.rs':
      return 'rust';
    case '.go':
      return 'go';
    case '.php':
      return 'php';
    case '.js':
    case '.jsx':
    default:
      return 'javascript';
  }
}
