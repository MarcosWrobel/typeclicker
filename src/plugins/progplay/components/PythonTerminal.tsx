import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { 
  Terminal as TerminalIcon, 
  Trash2, 
  RotateCcw, 
  Play, 
  Sparkles, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { pythonRunner, PythonExecutionResult } from '../utils/pythonRunner';

interface TerminalLine {
  id: string;
  type: 'prompt' | 'stdout' | 'stderr' | 'system' | 'result';
  text: string;
}

interface PythonTerminalProps {
  currentCode?: string;
  onRunCurrentFile?: () => void;
  className?: string;
  height?: string;
}

export const PythonTerminal: React.FC<PythonTerminalProps> = ({
  currentCode,
  onRunCurrentFile,
  className = '',
  height = '100%',
}) => {
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'Python 3.12.0 (ProgPlay Web REPL, interactive shell)',
    },
    {
      id: 'init-2',
      type: 'system',
      text: 'Digite expressões, variáveis ou comandos (ex: print("Olá"), 2+2, help()).',
    },
  ]);

  const [inputVal, setInputVal] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on output
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Keep input focused when clicking inside terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setHistory([]);
  };

  const handleReset = () => {
    pythonRunner.resetReplScope();
    setHistory([
      {
        id: 'reset-1',
        type: 'system',
        text: 'Python 3.12 - Sessão e variáveis reiniciadas.',
      },
    ]);
  };

  const submitLine = async (lineText: string) => {
    const trimmed = lineText.trim();
    if (!trimmed) return;

    // Add to command history
    setCommandHistory((prev) => [...prev, lineText]);
    setHistoryIndex(-1);

    // Add user prompt to screen
    const promptEntry: TerminalLine = {
      id: 'cmd-' + Date.now(),
      type: 'prompt',
      text: `>>> ${lineText}`,
    };

    setHistory((prev) => [...prev, promptEntry]);
    setInputVal('');
    setIsRunning(true);

    try {
      const res: PythonExecutionResult = await pythonRunner.executeReplLine(lineText);

      if (res.stdout === '__CLEAR__') {
        setHistory([]);
        setIsRunning(false);
        return;
      }

      const newOutputs: TerminalLine[] = [];

      if (res.stdout) {
        newOutputs.push({
          id: 'out-' + Math.random(),
          type: 'stdout',
          text: res.stdout,
        });
      }

      if (res.stderr) {
        newOutputs.push({
          id: 'err-' + Math.random(),
          type: 'stderr',
          text: res.stderr,
        });
      }

      setHistory((prev) => [...prev, ...newOutputs]);
    } catch (err: any) {
      setHistory((prev) => [
        ...prev,
        {
          id: 'err-' + Math.random(),
          type: 'stderr',
          text: `Traceback (most recent call last):\n  ${err?.message || 'Erro inesperado'}`,
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitLine(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistory[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx] || '');
      }
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      handleClear();
    }
  };

  // Run full script in terminal
  const handleRunFullFile = async () => {
    if (!currentCode) return;
    setIsRunning(true);

    setHistory((prev) => [
      ...prev,
      {
        id: 'run-' + Date.now(),
        type: 'system',
        text: `\n$ python3 script.py\n---------------------------------`,
      },
    ]);

    try {
      const res = await pythonRunner.execute(currentCode);
      const newOutputs: TerminalLine[] = [];

      if (res.stdout) {
        newOutputs.push({
          id: 'out-' + Math.random(),
          type: 'stdout',
          text: res.stdout,
        });
      }

      if (res.stderr) {
        newOutputs.push({
          id: 'err-' + Math.random(),
          type: 'stderr',
          text: res.stderr,
        });
      }

      if (!res.stdout && !res.stderr) {
        newOutputs.push({
          id: 'out-empty',
          type: 'system',
          text: '(O script foi executado com sucesso e não produziu saída com print()).',
        });
      }

      newOutputs.push({
        id: 'done-' + Date.now(),
        type: 'system',
        text: `---------------------------------\n[Processo finalizado com status ${res.success ? '0' : '1'}]`,
      });

      setHistory((prev) => [...prev, ...newOutputs]);
    } catch (err: any) {
      setHistory((prev) => [
        ...prev,
        {
          id: 'err-' + Math.random(),
          type: 'stderr',
          text: `Erro de execução: ${err?.message || 'Falha no script'}`,
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const insertSnippet = (snippet: string) => {
    setInputVal(snippet);
    inputRef.current?.focus();
  };

  return (
    <div 
      className={`flex flex-col bg-[#0f111a] text-neutral-200 border border-[#252836] rounded-xl overflow-hidden shadow-2xl font-mono text-xs select-text ${className}`}
      style={{ height }}
      onClick={handleTerminalClick}
    >
      {/* Terminal Title Bar */}
      <div className="h-9 px-3 bg-[#161824] border-b border-[#252836] flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5 opacity-80">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block" />
          </div>

          <div className="h-3 w-[1px] bg-neutral-700/50 mx-1" />

          <div className="flex items-center gap-1.5 font-bold text-neutral-300 text-[11px]">
            <TerminalIcon className="w-3.5 h-3.5 text-yellow-400" />
            <span>Terminal Python (REPL)</span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20 text-[10px] text-yellow-300 font-sans font-semibold">
            Python 3.12
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {currentCode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onRunCurrentFile) onRunCurrentFile();
                else handleRunFullFile();
              }}
              disabled={isRunning}
              className="flex items-center gap-1 px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 rounded text-[11px] font-sans font-medium transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              title="Executar script atual no terminal (python3 script.py)"
            >
              <Play className="w-3 h-3 fill-current" />
              <span className="hidden md:inline">Executar Arquivo</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            className="p-1 hover:text-white hover:bg-white/10 rounded text-neutral-400 transition-colors cursor-pointer"
            title="Resetar Sessão Python (reset())"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="p-1 hover:text-white hover:bg-white/10 rounded text-neutral-400 transition-colors cursor-pointer"
            title="Limpar Tela (Ctrl+L ou clear)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Snippets Bar */}
      <div className="px-3 py-1.5 bg-[#12141f] border-b border-[#212433] flex items-center gap-1.5 overflow-x-auto text-[10px] shrink-0 no-scrollbar select-none">
        <span className="text-neutral-500 font-sans flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          Atalhos:
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            insertSnippet('print("Olá, ProgPlay!")');
          }}
          className="px-2 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/50 transition-colors cursor-pointer whitespace-nowrap"
        >
          print("Olá!")
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            insertSnippet('[x**2 for x in range(6)]');
          }}
          className="px-2 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/50 transition-colors cursor-pointer whitespace-nowrap"
        >
          [x**2 for x in range(6)]
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            insertSnippet('import math; math.sqrt(144)');
          }}
          className="px-2 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/50 transition-colors cursor-pointer whitespace-nowrap"
        >
          math.sqrt(144)
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            insertSnippet('len({"nome": "Alice", "nivel": 10})');
          }}
          className="px-2 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/50 transition-colors cursor-pointer whitespace-nowrap"
        >
          len(dicionario)
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            insertSnippet('help()');
          }}
          className="px-2 py-0.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/50 transition-colors cursor-pointer whitespace-nowrap"
        >
          help()
        </button>
      </div>

      {/* Terminal Output Log Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1.5 leading-relaxed">
        {history.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap break-all font-mono">
            {line.type === 'system' && (
              <span className="text-neutral-500 italic select-none">{line.text}</span>
            )}

            {line.type === 'prompt' && (
              <span className="text-yellow-400 font-semibold">{line.text}</span>
            )}

            {line.type === 'stdout' && (
              <span className="text-emerald-300">{line.text}</span>
            )}

            {line.type === 'stderr' && (
              <span className="text-red-400 bg-red-950/20 px-1 py-0.5 rounded inline-block">
                {line.text}
              </span>
            )}

            {line.type === 'result' && (
              <span className="text-cyan-300">{line.text}</span>
            )}
          </div>
        ))}

        {/* Active Input Line */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-yellow-400 font-bold select-none shrink-0 font-mono">
            &gt;&gt;&gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isRunning}
            placeholder={history.length <= 2 ? 'Digite aqui (ex: 2 + 2 ou print("Python!"))' : ''}
            className="flex-1 bg-transparent border-none outline-none text-neutral-100 font-mono text-xs caret-yellow-400 placeholder:text-neutral-600"
            autoFocus
          />
          {isRunning && (
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping shrink-0" />
          )}
        </div>

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
