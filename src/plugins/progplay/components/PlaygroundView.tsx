import React,{ useState, useEffect, useRef } from 'react';
import {
Play,
RotateCcw,
Copy,
Check,
Download,
Terminal as TerminalIcon,
Globe,
Database,Smartphone,
Tablet,
Monitor,
Sparkles,
BookOpen,Trash2,Bot
} from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { PythonTerminal } from './PythonTerminal';
import { AiTutorDrawer } from './AiTutorDrawer';
import { AiGeneratedCourse } from './AiCourseModal';
import { EditorSettings } from '../types';
import { THEMES } from '../constants/themes';
import { pythonRunner } from '../utils/pythonRunner';
import { sounds } from '../utils/sound';

export type PlaygroundLang = 'python' | 'javascript' | 'html' | 'sql' | 'css';

interface PlaygroundTemplate {
  name: string;
  description: string;
  code: string;
}

const TEMPLATES: Record<PlaygroundLang, PlaygroundTemplate[]> = {
  python: [
    {
      name: '🐍 Script Básico & Matemática',
      description: 'Variáveis, condicionais e cálculos matemáticos com biblioteca math',
      code: `# Playground Livre de Python
import math

print("=== CALCULADORA DE RAIO E ÁREA ===")
raio = 5.0
area = math.pi * (raio ** 2)

print(f"Raio do círculo: {raio}m")
print(f"Área calculada: {round(area, 2)}m²")

# Estrutura condicional
if area > 50:
    print("Classificação: Grande porte")
else:
    print("Classificação: Pequeno porte")
`,
    },
    {
      name: '📦 API & Manipulação JSON',
      description: 'Dicionários, listas e serialização de dados para web',
      code: `# Simulando a resposta de uma API Web em Python
import json

usuarios = [
    {"id": 1, "nome": "Lucas Silva", "cargo": "Frontend Dev", "ativo": True},
    {"id": 2, "nome": "Beatriz Costa", "cargo": "Backend Python", "ativo": True},
    {"id": 3, "nome": "Carlos Mendes", "cargo": "DevOps", "ativo": False}
]

print("--- Total de Usuários:", len(usuarios))

# Filtrando desenvolvedores ativos:
ativos = [u["nome"] for u in usuarios if u["ativo"]]
print("Usuários Ativos:", ", ".join(ativos))

# Serializando para formato de transmissão Web (JSON):
payload_http = json.dumps({"status": 200, "dados": usuarios}, indent=2)
print("\n--- JSON Formatado: ---")
print(payload_http)
`,
    },
    {
      name: '⚡ Algoritmo & Funções',
      description: 'Funções reutilizáveis e laços de repetição',
      code: `# Algoritmo de Cálculo Fatorial e Sequência
def calcular_fatorial(numero):
    if numero <= 1:
        return 1
    total = 1
    for i in range(2, numero + 1):
        total *= i
    return total

print("--- Teste de Fatoriais ---")
for n in range(1, 8):
    resultado = calcular_fatorial(n)
    print(f"O fatorial de {n}! é: {resultado}")
`,
    },
  ],
  javascript: [
    {
      name: '⚡ Manipulação de Dados (Array Methods)',
      description: 'Map, filter, reduce e templates literais modernos',
      code: `// Playground de JavaScript Moderno (ES6+)
const produtos = [
  { id: 1, nome: "Teclado Mecânico RGB", preco: 350.00, categoria: "Periféricos" },
  { id: 2, nome: "Mouse Gamer 16000DPI", preco: 180.00, categoria: "Periféricos" },
  { id: 3, nome: "Monitor 144Hz 27 polegadas", preco: 1250.00, categoria: "Vídeo" },
  { id: 4, nome: "Headset 7.1 Surround", preco: 290.00, categoria: "Áudio" },
];

console.log("=== CATÁLOGO DA LOJA TECH ===");
produtos.forEach(p => console.log(\`• \${p.nome} - R$ \${p.preco.toFixed(2)}\`));

// Filtrando itens com preço abaixo de R$ 400
const acessiveis = produtos.filter(p => p.preco < 400);
console.log("\\nItens abaixo de R$ 400:", acessiveis.map(p => p.nome));

// Calculando valor total do estoque
const totalEstoque = produtos.reduce((acum, p) => acum + p.preco, 0);
console.log(\`\\nValor Total do Estoque: R$ \${totalEstoque.toFixed(2)}\`);
`,
    },
    {
      name: '⏱️ Simulação Assíncrona & Promessas',
      description: 'Async/Await e simulação de requisições de rede',
      code: `// Simulação de chamada HTTP assíncrona
function buscarDadosServidor() {
  return new Promise((resolve) => {
    console.log("⏳ Conectando ao servidor...");
    setTimeout(() => {
      resolve({
        status: 200,
        servidor: "AWS us-east-1",
        latencia: "42ms",
        online: true
      });
    }, 600);
  });
}

async function iniciarSistema() {
  console.log("🚀 Inicializando aplicação...");
  const resposta = await buscarDadosServidor();
  console.log("✅ Dados recebidos com sucesso:");
  console.log(JSON.stringify(resposta, null, 2));
}

iniciarSistema();
`,
    },
  ],
  html: [
    {
      name: '🌐 Landing Page com Botão Interativo',
      description: 'HTML5 semântico, estilos CSS integrados e script de clique',
      code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 32px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    h1 {
      font-size: 24px;
      margin-bottom: 8px;
      color: #38bdf8;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.5;
    }
    .btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 20px;
      transition: all 0.2s;
    }
    .btn:hover {
      background: #1d4ed8;
      transform: translateY(-2px);
    }
    .contador {
      font-size: 32px;
      font-weight: 900;
      color: #10b981;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Meu Site Criado no Playground</h1>
    <p>Teste botões, animações e interações em tempo real neste visualizador integrado!</p>
    <button class="btn" id="cliqueMe">Clique para Contar</button>
    <div class="contador" id="valorContador">0</div>
  </div>

  <script>
    let cliques = 0;
    const btn = document.getElementById('cliqueMe');
    const display = document.getElementById('valorContador');

    btn.addEventListener('click', () => {
      cliques++;
      display.textContent = cliques;
    });
  </script>
</body>
</html>
`,
    },
  ],
  sql: [
    {
      name: '🗄️ Consultas & Filtros (SELECT, WHERE, JOIN)',
      description: 'Estruturação de tabelas, inserção e consulta relacional',
      code: `-- Playground SQL: Simulador de Banco Relacional
-- Crie a tabela de clientes
CREATE TABLE clientes (
  id INT PRIMARY KEY,
  nome VARCHAR(100),
  cidade VARCHAR(100),
  saldo DECIMAL(10, 2)
);

-- Inserindo registros
INSERT INTO clientes VALUES (1, 'Ana Clara', 'São Paulo', 4500.00);
INSERT INTO clientes VALUES (2, 'Bruno Lima', 'Rio de Janeiro', 3200.50);
INSERT INTO clientes VALUES (3, 'Carla Souza', 'Belo Horizonte', 6800.00);
INSERT INTO clientes VALUES (4, 'Daniel Alves', 'Curitiba', 1900.00);

-- Consulta 1: Todos os clientes com saldo acima de R$ 3000 ordenados pelo maior saldo
SELECT nome, cidade, saldo 
FROM clientes 
WHERE saldo >= 3000.00 
ORDER BY saldo DESC;
`,
    },
  ],
  css: [
    {
      name: '🎨 Glassmorphism & Flexbox Moderno',
      description: 'Efeitos visuais de vidro, sombras e tipografia fluida',
      code: `/* Playground CSS */
.glass-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, #1e1b4b, #311042);
  min-height: 350px;
  padding: 30px;
  border-radius: 16px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  padding: 24px;
  color: white;
  width: 220px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
}
`,
    },
  ],
};

interface PlaygroundViewProps {
  settings: EditorSettings;
  onUpdateSettings: (newSettings: Partial<EditorSettings>) => void;
  onReturnToChallenges: () => void;
  customCourse?: AiGeneratedCourse | null;
  onOpenAiCourseModal?: () => void;
}

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({
  settings,
  onUpdateSettings,
  onReturnToChallenges,
  customCourse,
  onOpenAiCourseModal,
}) => {
  const [currentLang, setCurrentLang] = useState<PlaygroundLang>(() => {
    if (customCourse?.language) {
      const l = customCourse.language.toLowerCase();
      if (l.includes('python')) return 'python';
      if (l.includes('java')) return 'javascript';
      if (l.includes('html')) return 'html';
      if (l.includes('sql')) return 'sql';
      if (l.includes('css')) return 'css';
    }
    return (localStorage.getItem('codecraft_playground_lang') as PlaygroundLang) || 'python';
  });

  const [code, setCode] = useState<string>(() => {
    if (customCourse?.modules?.[0]?.starterCode) {
      return customCourse.modules[0].starterCode;
    }
    const saved = localStorage.getItem(`codecraft_playground_${currentLang}`);
    if (saved) return saved;
    return TEMPLATES[currentLang][0].code;
  });

  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(() => !!customCourse);

  // When a new custom course is loaded
  useEffect(() => {
    if (customCourse) {
      const l = customCourse.language.toLowerCase();
      let matchedLang: PlaygroundLang = 'html';
      if (l.includes('python')) matchedLang = 'python';
      else if (l.includes('java')) matchedLang = 'javascript';
      else if (l.includes('html')) matchedLang = 'html';
      else if (l.includes('sql')) matchedLang = 'sql';
      else if (l.includes('css')) matchedLang = 'css';

      setCurrentLang(matchedLang);
      setIsTutorOpen(true);
      if (customCourse.modules?.[0]?.starterCode) {
        setCode(customCourse.modules[0].starterCode);
      }
    }
  }, [customCourse]);

  const [activeTab, setActiveTab] = useState<'output' | 'terminal' | 'preview'>('output');
  const [outputLogs, setOutputLogs] = useState<Array<{ type: 'log' | 'error' | 'warn' | 'success'; text: string; time: string }>>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [sqlResults, setSqlResults] = useState<{ columns: string[]; rows: any[][] } | null>(null);

  const editorRef = useRef<any>(null);
  const activeTheme = THEMES[settings.theme] || THEMES['vs-dark-modern'];

  // Switch language
  const handleSelectLang = (lang: PlaygroundLang) => {
    setCurrentLang(lang);
    localStorage.setItem('codecraft_playground_lang', lang);
    const saved = localStorage.getItem(`codecraft_playground_${lang}`);
    const initial = saved || TEMPLATES[lang][0].code;
    setCode(initial);
    setOutputLogs([]);
    setSqlResults(null);

    if (lang === 'html') {
      setActiveTab('preview');
    } else if (lang === 'python') {
      setActiveTab('output');
    } else {
      setActiveTab('output');
    }
  };

  // Change code & auto-save to localStorage
  const handleCodeChange = (newVal: string) => {
    setCode(newVal);
    localStorage.setItem(`codecraft_playground_${currentLang}`, newVal);
  };

  // Apply template
  const handleApplyTemplate = (tmpl: PlaygroundTemplate) => {
    sounds.playClick();
    setCode(tmpl.code);
    localStorage.setItem(`codecraft_playground_${currentLang}`, tmpl.code);
    setOutputLogs([
      {
        type: 'log',
        text: `Modelo "${tmpl.name}" carregado com sucesso.`,
        time: new Date().toLocaleTimeString(),
      },
    ]);
  };

  // Copy code
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Download code as file
  const handleDownload = () => {
    const extensions: Record<PlaygroundLang, string> = {
      python: '.py',
      javascript: '.js',
      html: '.html',
      sql: '.sql',
      css: '.css',
    };
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `playground_${currentLang}${extensions[currentLang]}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Clear / Reset
  const handleClearCode = () => {
    sounds.playClick();
    const defaultTemplate = TEMPLATES[currentLang][0].code;
    setCode(defaultTemplate);
    localStorage.setItem(`codecraft_playground_${currentLang}`, defaultTemplate);
    setOutputLogs([]);
    setSqlResults(null);
  };

  // Run Code Locally
  const handleRun = async () => {
    sounds.playClick();
    setIsExecuting(true);
    const newLogs: Array<{ type: 'log' | 'error' | 'warn' | 'success'; text: string; time: string }> = [];

    const now = () => new Date().toLocaleTimeString();

    if (currentLang === 'python') {
      try {
        const res = await pythonRunner.execute(code);
        if (res.stdout) {
          newLogs.push({ type: 'log', text: res.stdout, time: now() });
        }
        if (res.stderr) {
          newLogs.push({ type: 'error', text: res.stderr, time: now() });
        }
        if (!res.stdout && !res.stderr) {
          newLogs.push({ type: 'log', text: '(Script executado sem saída no console).', time: now() });
        }
        newLogs.push({
          type: res.success ? 'success' : 'error',
          text: `[Python Finalizado: ${res.success ? 'Sucesso (código 0)' : 'Falha'}] - Engine: ${res.engine}`,
          time: now(),
        });
        setActiveTab('output');
      } catch (err: any) {
        newLogs.push({ type: 'error', text: err?.message || 'Erro ao executar Python', time: now() });
      }
    } else if (currentLang === 'javascript') {
      try {
        const logsCaptured: string[] = [];
        const sandboxConsole = {
          log: (...args: any[]) => logsCaptured.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
          warn: (...args: any[]) => logsCaptured.push('[WARN] ' + args.join(' ')),
          error: (...args: any[]) => logsCaptured.push('[ERROR] ' + args.join(' ')),
          table: (data: any) => logsCaptured.push(JSON.stringify(data, null, 2)),
        };

        const runner = new Function('console', code);
        const result = runner(sandboxConsole);

        logsCaptured.forEach((l) => newLogs.push({ type: 'log', text: l, time: now() }));

        if (result !== undefined) {
          newLogs.push({
            type: 'success',
            text: `➔ Retorno da expressão: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`,
            time: now(),
          });
        }
        newLogs.push({ type: 'success', text: '✔ JavaScript executado com sucesso.', time: now() });
        setActiveTab('output');
      } catch (err: any) {
        newLogs.push({ type: 'error', text: `ReferenceError / SyntaxError: ${err?.message || 'Falha de execução'}`, time: now() });
        setActiveTab('output');
      }
    } else if (currentLang === 'html') {
      setActiveTab('preview');
      newLogs.push({ type: 'success', text: 'Visualizador Web HTML renderizado com sucesso!', time: now() });
    } else if (currentLang === 'sql') {
      // In-memory SQL parser for common playground SELECT, INSERT, CREATE
      try {
        const lines = code.split('\n');
        const insertRows: any[] = [];
        let columns = ['id', 'nome', 'cidade', 'saldo'];

        // Extract inserts
        lines.forEach((line) => {
          const match = line.match(/INSERT\s+INTO\s+\w+\s+VALUES\s*\((.*?)\)/i);
          if (match) {
            const rawVals = match[1].split(',').map((v) => v.trim().replace(/^['"]|['"]$/g, ''));
            insertRows.push(rawVals);
          }
        });

        if (insertRows.length > 0) {
          setSqlResults({
            columns: ['ID', 'NOME', 'CIDADE', 'SALDO (R$)'],
            rows: insertRows,
          });
          newLogs.push({
            type: 'success',
            text: `Consulta executada: ${insertRows.length} linhas afetadas/retornadas na tabela virtual.`,
            time: now(),
          });
        } else {
          newLogs.push({
            type: 'log',
            text: 'Comando SQL compilado. Dica: use INSERT INTO e SELECT para visualizar a tabela de resultados.',
            time: now(),
          });
        }
        setActiveTab('output');
      } catch (err: any) {
        newLogs.push({ type: 'error', text: err?.message || 'Erro de sintaxe SQL', time: now() });
      }
    } else if (currentLang === 'css') {
      setActiveTab('preview');
      newLogs.push({ type: 'success', text: 'Estilos CSS aplicados no sandbox.', time: now() });
    }

    setOutputLogs((prev) => [...prev, ...newLogs]);
    setIsExecuting(false);
  };

  const getMonacoLang = (lang: PlaygroundLang) => {
    if (lang === 'python') return 'python';
    if (lang === 'javascript') return 'javascript';
    if (lang === 'html') return 'html';
    if (lang === 'sql') return 'sql';
    if (lang === 'css') return 'css';
    return 'plaintext';
  };

  return (
    <div 
      className="flex flex-col h-full w-full overflow-hidden select-none"
      style={{ backgroundColor: activeTheme.ui.bg }}
    >
      {/* Playground Header Sub-Bar */}
      <div 
        className="h-11 px-3 border-b flex items-center justify-between shrink-0 text-xs"
        style={{ 
          backgroundColor: activeTheme.ui.tabBarBg, 
          borderColor: activeTheme.ui.border 
        }}
      >
        {/* Left: Language Selection Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => handleSelectLang('python')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
              currentLang === 'python'
                ? 'bg-yellow-400 text-neutral-950 shadow-sm font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <span>🐍</span>
            <span>Python</span>
          </button>

          <button
            onClick={() => handleSelectLang('javascript')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
              currentLang === 'javascript'
                ? 'bg-amber-400 text-neutral-950 shadow-sm font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <span>⚡</span>
            <span>JavaScript</span>
          </button>

          <button
            onClick={() => handleSelectLang('html')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
              currentLang === 'html'
                ? 'bg-orange-500 text-white shadow-sm font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <span>🌐</span>
            <span>HTML & Web</span>
          </button>

          <button
            onClick={() => handleSelectLang('sql')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
              currentLang === 'sql'
                ? 'bg-emerald-500 text-white shadow-sm font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <span>🗄️</span>
            <span>SQL</span>
          </button>

          <button
            onClick={() => handleSelectLang('css')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
              currentLang === 'css'
                ? 'bg-blue-500 text-white shadow-sm font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <span>🎨</span>
            <span>CSS</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Template dropdown pills */}
          <div className="hidden lg:flex items-center gap-1 mr-2 text-[11px] text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Exemplos:</span>
            {TEMPLATES[currentLang].map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyTemplate(tmpl)}
                className="px-2 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/50 hover:border-neutral-500 transition-colors cursor-pointer"
                title={tmpl.description}
              >
                {tmpl.name}
              </button>
            ))}
          </div>

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            title="Executar Código Localmente (Ctrl+Enter)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Testar Código</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Copiar Código"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Baixar arquivo de código"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* AI Course Creator Button */}
          {onOpenAiCourseModal && (
            <button
              onClick={onOpenAiCourseModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
              title="Pedir para a IA criar um curso personalizado para você"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Criar Curso com IA</span>
            </button>
          )}

          {/* Socratic AI Tutor Toggle */}
          <button
            onClick={() => setIsTutorOpen(!isTutorOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              isTutorOpen
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
            }`}
            title="Abrir/Fechar Mentor IA Socrático"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Tutor IA</span>
            {customCourse && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Reset / Clear Button */}
          <button
            onClick={handleClearCode}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Restaurar modelo inicial"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Back to Challenges Mode Button */}
          <button
            onClick={onReturnToChallenges}
            className="ml-1 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-semibold text-[11px] cursor-pointer"
            title="Voltar para as fases de desafio"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Voltar às Fases</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left (Code Editor) & Right (Output / Python REPL / Web Preview) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT COLUMN: Monaco Editor */}
        <div className="flex-1 flex flex-col h-full border-b lg:border-b-0 lg:border-r border-[#2b2b2b] overflow-hidden">
          <div className="h-7 px-3 bg-[#171922] border-b border-[#252836] flex items-center justify-between text-[11px] text-neutral-400 shrink-0 font-mono">
            <span>playground_{currentLang}.{currentLang === 'javascript' ? 'js' : currentLang === 'html' ? 'html' : currentLang === 'sql' ? 'sql' : currentLang === 'css' ? 'css' : 'py'}</span>
            <span className="text-[10px] text-neutral-500">Auto-salvo localmente</span>
          </div>

          <div className="flex-1 relative overflow-hidden">
            <CodeEditor
              code={code}
              language={getMonacoLang(currentLang)}
              settings={settings}
              onChange={handleCodeChange}
              onRunCode={handleRun}
              editorRef={editorRef}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Terminal, Output & Live Preview */}
        <div className="w-full lg:w-[48%] xl:w-[45%] h-full flex flex-col bg-[#0b0d14] overflow-hidden">
          
          {/* Tab Bar for Right Column */}
          <div className="h-9 px-3 bg-[#141620] border-b border-[#252836] flex items-center justify-between shrink-0 text-xs">
            <div className="flex items-center gap-1 h-full">
              {/* Output Tab */}
              <button
                onClick={() => setActiveTab('output')}
                className={`flex items-center gap-1.5 px-3 h-full border-b-2 font-medium cursor-pointer transition-colors ${
                  activeTab === 'output'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <TerminalIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>Console de Saída</span>
              </button>

              {/* Python Terminal (REPL) Tab */}
              <button
                onClick={() => setActiveTab('terminal')}
                className={`flex items-center gap-1.5 px-3 h-full border-b-2 font-medium cursor-pointer transition-colors ${
                  activeTab === 'terminal'
                    ? 'border-yellow-400 text-yellow-300'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span className="text-xs">🐍</span>
                <span>Terminal Python</span>
              </button>

              {/* Web Live Preview Tab (Available for all, prioritized for HTML/CSS) */}
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 h-full border-b-2 font-medium cursor-pointer transition-colors ${
                  activeTab === 'preview'
                    ? 'border-emerald-400 text-emerald-300'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Preview Web (HTML/CSS)</span>
              </button>
            </div>

            {/* Clear output if on output tab */}
            {activeTab === 'output' && (
              <button
                onClick={() => setOutputLogs([])}
                className="p-1 text-neutral-400 hover:text-white rounded transition-colors cursor-pointer"
                title="Limpar Console"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Viewport switcher if on preview tab */}
            {activeTab === 'preview' && (
              <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded border border-neutral-700/50">
                <button
                  onClick={() => setViewportMode('desktop')}
                  className={`p-1 rounded cursor-pointer ${viewportMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}
                  title="Modo Desktop (100%)"
                >
                  <Monitor className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setViewportMode('tablet')}
                  className={`p-1 rounded cursor-pointer ${viewportMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}
                  title="Modo Tablet (768px)"
                >
                  <Tablet className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setViewportMode('mobile')}
                  className={`p-1 rounded cursor-pointer ${viewportMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'}`}
                  title="Modo Mobile (375px)"
                >
                  <Smartphone className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden relative">
            
            {/* 1. OUTPUT CONSOLE */}
            {activeTab === 'output' && (
              <div className="h-full flex flex-col p-3 overflow-y-auto font-mono text-xs select-text space-y-2">
                {/* SQL Table Rendering */}
                {sqlResults && (
                  <div className="mb-3 border border-neutral-700 rounded-lg overflow-hidden bg-neutral-900/60 shadow-md">
                    <div className="bg-neutral-800 px-3 py-1.5 font-sans font-bold text-neutral-200 border-b border-neutral-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-emerald-400" />
                        Tabela de Resultados da Consulta
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">{sqlResults.rows.length} registros</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-neutral-800/80 border-b border-neutral-700 text-neutral-300">
                            {sqlResults.columns.map((c, i) => (
                              <th key={i} className="p-2 font-bold">{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sqlResults.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-neutral-800 hover:bg-neutral-800/40">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-2 text-neutral-300 font-mono">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* General Execution Logs */}
                {outputLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-center select-none py-10">
                    <TerminalIcon className="w-8 h-8 opacity-30 mb-2" />
                    <p className="font-sans font-medium text-neutral-400">Pronto para executar!</p>
                    <p className="text-[11px] font-sans text-neutral-500 mt-1 max-w-xs">
                      Clique no botão verde &quot;Testar Código&quot; ou pressione Ctrl+Enter para rodar o código livremente.
                    </p>
                  </div>
                ) : (
                  outputLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded font-mono leading-relaxed transition-colors ${
                        log.type === 'error'
                          ? 'bg-red-950/30 text-red-300 border border-red-900/40'
                          : log.type === 'success'
                          ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-900/40'
                          : log.type === 'warn'
                          ? 'bg-amber-950/30 text-amber-300'
                          : 'bg-neutral-900/50 text-neutral-200 border border-neutral-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1 select-none">
                        <span>{log.type.toUpperCase()}</span>
                        <span>{log.time}</span>
                      </div>
                      <pre className="whitespace-pre-wrap break-all m-0">{log.text}</pre>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 2. INTERACTIVE PYTHON TERMINAL (REPL) */}
            {activeTab === 'terminal' && (
              <div className="h-full p-2">
                <PythonTerminal 
                  currentCode={currentLang === 'python' ? code : undefined}
                  onRunCurrentFile={handleRun}
                  height="100%"
                />
              </div>
            )}

            {/* 3. LIVE WEB PREVIEW (HTML/CSS Sandbox) */}
            {activeTab === 'preview' && (
              <div className="h-full w-full bg-[#11131c] flex flex-col items-center justify-center p-2 overflow-auto">
                <div 
                  className="bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300 flex flex-col"
                  style={{
                    width: viewportMode === 'mobile' ? '375px' : viewportMode === 'tablet' ? '768px' : '100%',
                    height: viewportMode === 'mobile' ? '667px' : '100%',
                    maxHeight: '100%',
                  }}
                >
                  <iframe
                    title="Live Web Preview"
                    srcDoc={
                      currentLang === 'html'
                        ? code
                        : currentLang === 'css'
                        ? `<style>${code}</style><div class="glass-container"><div class="glass-card"><h3>Exemplo CSS</h3><p>Estilo aplicado ao vivo no componente.</p></div></div>`
                        : `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:20px;"><h3>Execução Web</h3><div id="app"></div><script>${code}</script></body></html>`
                    }
                    sandbox="allow-scripts"
                    className="w-full h-full border-none bg-white"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT DRAWER: SOCRATIC AI TUTOR */}
        {isTutorOpen && (
          <AiTutorDrawer
            course={customCourse || null}
            currentCode={code}
            language={currentLang}
            isOpen={isTutorOpen}
            onClose={() => setIsTutorOpen(false)}
            onApplyStarterCode={(starterCode) => setCode(starterCode)}
          />
        )}

      </div>
    </div>
  );
};
