/**
 * Python Execution Engine & Interactive REPL
 * Supports:
 * 1. Fast, offline resilient JavaScript-based Python emulator for immediate execution & REPL
 * 2. Background async loading of Pyodide (CPython in WebAssembly) when network is available
 */

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<any>;
    pyodide?: any;
  }
}

export interface PythonExecutionResult {
  stdout: string;
  stderr: string;
  result?: any;
  success: boolean;
  engine: 'pyodide' | 'emulator';
}

class PythonRunnerService {
  private pyodideInstance: any = null;
  private isPyodideLoading = false;
  private pyodideLoadPromise: Promise<any> | null = null;
  
  // Persistent REPL state for the interactive terminal emulator
  private replScope: Record<string, any> = {
    sys: { version: '3.12.0 (ProgPlay Web Emulator)' },
    math: {
      pi: Math.PI,
      e: Math.E,
      sqrt: Math.sqrt,
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      floor: Math.floor,
      ceil: Math.ceil,
      pow: Math.pow,
      log: Math.log,
      abs: Math.abs,
    },
    json: {
      dumps: (obj: any, indent?: number) => JSON.stringify(obj, null, indent || 2),
      loads: (str: string) => JSON.parse(str),
    },
    random: {
      randint: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
      random: () => Math.random(),
      choice: (arr: any[]) => arr[Math.floor(Math.random() * arr.length)],
    },
  };

  constructor() {
    this.preloadPyodide();
  }

  /**
   * Preload Pyodide asynchronously in the background.
   */
  public preloadPyodide() {
    if (typeof window === 'undefined' || this.pyodideInstance || this.isPyodideLoading) {
      return;
    }

    this.isPyodideLoading = true;
    this.pyodideLoadPromise = new Promise(async (resolve) => {
      try {
        if (!window.loadPyodide) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js';
          script.async = true;
          document.head.appendChild(script);

          await new Promise<void>((res, rej) => {
            script.onload = () => res();
            script.onerror = () => rej(new Error('Falha ao carregar script do Pyodide'));
            // Timeout after 8 seconds so we don't hang
            setTimeout(() => res(), 8000);
          });
        }

        if (window.loadPyodide) {
          const py = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
          });
          this.pyodideInstance = py;
          window.pyodide = py;
          resolve(py);
        } else {
          resolve(null);
        }
      } catch (err) {
        console.warn('Pyodide CDN indisponível ou offline. Usando emulador nativo de Python.', err);
        resolve(null);
      } finally {
        this.isPyodideLoading = false;
      }
    });
  }

  public isPyodideReady(): boolean {
    return !!this.pyodideInstance;
  }

  /**
   * Reset the interactive REPL state
   */
  public resetReplScope() {
    this.replScope = {
      sys: { version: '3.12.0 (ProgPlay Web Emulator)' },
      math: {
        pi: Math.PI,
        e: Math.E,
        sqrt: Math.sqrt,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        floor: Math.floor,
        ceil: Math.ceil,
        pow: Math.pow,
        log: Math.log,
        abs: Math.abs,
      },
      json: {
        dumps: (obj: any, indent?: number) => JSON.stringify(obj, null, indent || 2),
        loads: (str: string) => JSON.parse(str),
      },
      random: {
        randint: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
        random: () => Math.random(),
        choice: (arr: any[]) => arr[Math.floor(Math.random() * arr.length)],
      },
    };

    if (this.pyodideInstance) {
      try {
        this.pyodideInstance.runPython('import sys; globals().clear()');
      } catch {}
    }
  }

  /**
   * Execute full Python code
   */
  public async execute(code: string): Promise<PythonExecutionResult> {
    if (this.pyodideInstance) {
      return this.executeWithPyodide(code);
    }
    return this.executeWithEmulator(code, false);
  }

  /**
   * Execute a single interactive line in the REPL (maintains state across lines)
   */
  public async executeReplLine(line: string): Promise<PythonExecutionResult> {
    const trimmed = line.trim();
    if (!trimmed) {
      return { stdout: '', stderr: '', success: true, engine: this.pyodideInstance ? 'pyodide' : 'emulator' };
    }

    if (trimmed === 'clear' || trimmed === 'cls') {
      return { stdout: '__CLEAR__', stderr: '', success: true, engine: 'emulator' };
    }

    if (trimmed === 'reset' || trimmed === 'reset()') {
      this.resetReplScope();
      return { stdout: 'Ambiente Python reiniciado.', stderr: '', success: true, engine: 'emulator' };
    }

    if (trimmed === 'help' || trimmed === 'help()') {
      const helpText = `Comandos do Terminal Python:
• Digite qualquer expressão: >>> 2 + 2, >>> [x**2 for x in range(5)]
• Defina variáveis: >>> nome = "Dev"
• Funções e imports: >>> import math; math.sqrt(64)
• 'clear': limpa a tela do terminal
• 'reset()': reseta as variáveis do terminal
• 'help()': exibe esta mensagem de ajuda`;
      return { stdout: helpText, stderr: '', success: true, engine: 'emulator' };
    }

    if (trimmed === 'license' || trimmed === 'license()' || trimmed === 'credits') {
      return { stdout: 'Python 3.12 - ProgPlay Web Terminal', stderr: '', success: true, engine: 'emulator' };
    }

    if (this.pyodideInstance) {
      return this.executeWithPyodide(line, true);
    }

    return this.executeWithEmulator(line, true);
  }

  /**
   * Execute using Pyodide (WASM CPython)
   */
  private async executeWithPyodide(code: string, isRepl: boolean = false): Promise<PythonExecutionResult> {
    try {
      const setupCode = `
import sys
from io import StringIO
__sys_stdout_backup = sys.stdout
__sys_stderr_backup = sys.stderr
__captured_stdout = StringIO()
__captured_stderr = StringIO()
sys.stdout = __captured_stdout
sys.stderr = __captured_stderr
`;
      this.pyodideInstance.runPython(setupCode);

      let evalResult: any = undefined;
      let errorOccurred = false;
      let errorMsg = '';

      try {
        if (isRepl && !code.includes('\n') && !code.trim().startsWith('import') && !code.trim().startsWith('def ') && !code.includes('=')) {
          // If it's an expression in REPL, evaluate it so return value is shown
          evalResult = this.pyodideInstance.runPython(code);
        } else {
          this.pyodideInstance.runPython(code);
        }
      } catch (e: any) {
        errorOccurred = true;
        errorMsg = e?.message || String(e);
      }

      const finishCode = `
sys.stdout = __sys_stdout_backup
sys.stderr = __sys_stderr_backup
__out = __captured_stdout.getvalue()
__err = __captured_stderr.getvalue()
`;
      this.pyodideInstance.runPython(finishCode);
      const stdout = this.pyodideInstance.globals.get('__out') || '';
      const stderr = this.pyodideInstance.globals.get('__err') || '';

      if (errorOccurred) {
        return {
          stdout,
          stderr: errorMsg || stderr,
          success: false,
          engine: 'pyodide',
        };
      }

      let formattedResult = '';
      if (evalResult !== undefined && evalResult !== null) {
        try {
          formattedResult = String(evalResult);
        } catch {
          formattedResult = '';
        }
      }

      return {
        stdout: stdout || (formattedResult ? formattedResult : ''),
        stderr,
        result: evalResult,
        success: true,
        engine: 'pyodide',
      };
    } catch (err: any) {
      return {
        stdout: '',
        stderr: err?.message || String(err),
        success: false,
        engine: 'pyodide',
      };
    }
  }

  /**
   * Resilient, offline JavaScript-based Python emulator
   */
  private executeWithEmulator(code: string, isRepl: boolean = false): PythonExecutionResult {
    const stdoutLines: string[] = [];
    const stderrLines: string[] = [];
    let expressionResult: any = undefined;

    // Python built-in helpers
    const customPrint = (...args: any[]) => {
      const formatted = args.map((arg) => {
        if (typeof arg === 'boolean') return arg ? 'True' : 'False';
        if (arg === null || arg === undefined) return 'None';
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2)
              .replace(/"([^"]+)":/g, "'$1':")
              .replace(/"/g, "'")
              .replace(/: true/g, ': True')
              .replace(/: false/g, ': False')
              .replace(/: null/g, ': None');
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');
      stdoutLines.push(formatted);
    };

    const pythonLen = (obj: any): number => {
      if (!obj) return 0;
      if (typeof obj.length === 'number') return obj.length;
      if (typeof obj === 'object') return Object.keys(obj).length;
      return 0;
    };

    const pythonRange = (a: number, b?: number, step: number = 1): number[] => {
      const start = b === undefined ? 0 : a;
      const end = b === undefined ? a : b;
      const res: number[] = [];
      if (step > 0) {
        for (let i = start; i < end; i += step) res.push(i);
      } else if (step < 0) {
        for (let i = start; i > end; i += step) res.push(i);
      }
      return res;
    };

    const pythonType = (val: any): string => {
      if (val === null || val === undefined) return "<class 'NoneType'>";
      if (typeof val === 'boolean') return "<class 'bool'>";
      if (typeof val === 'number') return Number.isInteger(val) ? "<class 'int'>" : "<class 'float'>";
      if (typeof val === 'string') return "<class 'str'>";
      if (Array.isArray(val)) return "<class 'list'>";
      if (typeof val === 'object') return "<class 'dict'>";
      return `<class '${typeof val}'>`;
    };

    const pythonSum = (arr: any[]): number => {
      if (!Array.isArray(arr)) return 0;
      return arr.reduce((acc, v) => acc + (Number(v) || 0), 0);
    };

    const pythonRound = (val: number, decimals: number = 0): number => {
      const f = Math.pow(10, decimals);
      return Math.round(val * f) / f;
    };

    try {
      // Transpile simple Python syntax to safe JavaScript execution
      let jsCode = code;

      // Handle simple comments
      const lines = jsCode.split('\n').map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('#')) return '';
        // Handle in-line print()
        return line;
      });
      jsCode = lines.join('\n');

      // Python keywords and operators
      jsCode = jsCode
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false')
        .replace(/\bNone\b/g, 'null')
        .replace(/\band\b/g, '&&')
        .replace(/\bor\b/g, '||')
        .replace(/\bnot\s+/g, '!')
        .replace(/\.append\s*\(/g, '.push(');

      // Handle f-strings: f"hello {x}" -> `hello ${x}`
      jsCode = jsCode.replace(/f(["'])(.*?)\1/g, (_, quote, content) => {
        const interpolated = content.replace(/\{([^}]+)\}/g, '${$1}');
        return `\`${interpolated}\``;
      });

      // Handle "import math", "import json", "import random"
      jsCode = jsCode.replace(/import\s+json\b/g, '// import json');
      jsCode = jsCode.replace(/import\s+math\b/g, '// import math');
      jsCode = jsCode.replace(/import\s+random\b/g, '// import random');
      jsCode = jsCode.replace(/import\s+sys\b/g, '// import sys');

      // Create environment
      const context = {
        ...this.replScope,
        print: customPrint,
        len: pythonLen,
        range: pythonRange,
        type: pythonType,
        sum: pythonSum,
        max: Math.max,
        min: Math.min,
        abs: Math.abs,
        round: pythonRound,
        str: String,
        int: (v: any) => parseInt(v, 10),
        float: (v: any) => parseFloat(v),
        sorted: (arr: any[]) => [...arr].sort(),
      };

      // Wrap in sandbox
      const contextKeys = Object.keys(context);
      const contextValues = Object.values(context);

      let runnerBody = '';
      if (isRepl && !jsCode.includes('\n') && !jsCode.includes('=')) {
        // Evaluate single expression
        runnerBody = `return (${jsCode});`;
      } else {
        runnerBody = `
          ${jsCode}
        `;
      }

      const fn = new Function(...contextKeys, runnerBody);
      expressionResult = fn(...contextValues);

      // In REPL, if an expression returned a value and didn't just print, show it
      if (isRepl && expressionResult !== undefined && stdoutLines.length === 0) {
        if (typeof expressionResult === 'boolean') {
          stdoutLines.push(expressionResult ? 'True' : 'False');
        } else if (expressionResult === null) {
          stdoutLines.push('None');
        } else if (typeof expressionResult === 'object') {
          stdoutLines.push(JSON.stringify(expressionResult).replace(/"/g, "'"));
        } else {
          stdoutLines.push(String(expressionResult));
        }
      }

      // If in REPL and variable assignment happened, extract variables into replScope
      if (isRepl && jsCode.includes('=')) {
        const varMatch = jsCode.match(/^\s*([a-zA-Z_]\w*)\s*=/);
        if (varMatch) {
          const varName = varMatch[1];
          try {
            const extractFn = new Function(...contextKeys, `${jsCode}; return ${varName};`);
            this.replScope[varName] = extractFn(...contextValues);
          } catch {}
        }
      }

      return {
        stdout: stdoutLines.join('\n'),
        stderr: stderrLines.join('\n'),
        result: expressionResult,
        success: true,
        engine: 'emulator',
      };
    } catch (err: any) {
      return {
        stdout: stdoutLines.join('\n'),
        stderr: `Traceback (most recent call last):\n  File "<stdin>", line 1\nSyntaxError: ${err?.message || 'Erro ao interpretar código Python'}`,
        success: false,
        engine: 'emulator',
      };
    }
  }
}

export const pythonRunner = new PythonRunnerService();
