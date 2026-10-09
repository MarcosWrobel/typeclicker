import React,{ useState } from 'react';
import {
Terminal as TerminalIcon,
AlertCircle,
Trash2,
X,
Maximize2,
Minimize2,
CheckCircle2
} from 'lucide-react';
import { EditorSettings } from '../types';
import { THEMES } from '../constants/themes';
import { PythonTerminal } from './PythonTerminal';

export interface LogEntry {
  type: 'log' | 'error' | 'warn' | 'info' | 'success';
  content: string;
  timestamp: string;
}

interface OutputPanelProps {
  logs: LogEntry[];
  isOpen: boolean;
  onClose: () => void;
  onClearLogs: () => void;
  settings: EditorSettings;
  isDoorOpen?: boolean;
  currentCode?: string;
  isPythonCourse?: boolean;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  logs,
  isOpen,
  onClose,
  onClearLogs,
  settings,
  isDoorOpen = false,
  currentCode,
  isPythonCourse = false,
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'python' | 'problems'>(
    isPythonCourse ? 'console' : 'console'
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const activeTheme = THEMES[settings.theme] || THEMES['vs-dark-modern'];

  if (!isOpen) return null;

  const errorCount = logs.filter((l) => l.type === 'error').length;

  return (
    <div
      id="vscode-output-panel"
      className={`border-t flex flex-col transition-all duration-200 z-10 select-none ${
        isExpanded ? 'h-80' : activeTab === 'python' ? 'h-64' : 'h-48'
      }`}
      style={{
        backgroundColor: activeTheme.ui.editorBg,
        borderColor: activeTheme.ui.border,
      }}
    >
      {/* Panel Tab Header */}
      <div 
        className="h-8 px-3 flex items-center justify-between border-b text-xs shrink-0"
        style={{
          backgroundColor: activeTheme.ui.tabBarBg,
          borderColor: activeTheme.ui.border,
        }}
      >
        <div className="flex items-center gap-1 h-full">
          {/* Terminal / Console Tab */}
          <button
            id="tab-output-console"
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 px-2.5 h-full border-b-2 cursor-pointer transition-colors ${
              activeTab === 'console'
                ? 'border-blue-500 text-white font-medium'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terminal de Execução</span>
            {logs.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                {logs.length}
              </span>
            )}
          </button>

          {/* Python Terminal (REPL) Tab */}
          <button
            id="tab-output-python"
            onClick={() => setActiveTab('python')}
            className={`flex items-center gap-1.5 px-2.5 h-full border-b-2 cursor-pointer transition-colors ${
              activeTab === 'python'
                ? 'border-yellow-400 text-yellow-300 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>🐍</span>
            <span>Terminal Python</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-yellow-400/20 text-yellow-300 font-mono">
              REPL
            </span>
          </button>

          {/* Problems Tab */}
          <button
            id="tab-output-problems"
            onClick={() => setActiveTab('problems')}
            className={`flex items-center gap-1.5 px-2.5 h-full border-b-2 cursor-pointer transition-colors ${
              activeTab === 'problems'
                ? 'border-blue-500 text-white font-medium'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <AlertCircle className={`w-3.5 h-3.5 ${errorCount > 0 ? 'text-red-400' : 'text-neutral-400'}`} />
            <span>Problemas</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              errorCount > 0 ? 'bg-red-950 text-red-300' : 'bg-neutral-800 text-neutral-400'
            }`}>
              {errorCount}
            </span>
          </button>
        </div>

        {/* Header controls: clear, expand, close */}
        <div className="flex items-center gap-1 text-neutral-400">
          {activeTab === 'console' && (
            <button
              id="btn-clear-logs"
              onClick={onClearLogs}
              className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
              title="Limpar Terminal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            id="btn-toggle-expand-output"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
            title={isExpanded ? 'Reduzir Painel' : 'Expandir Painel'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            id="btn-close-output-panel"
            onClick={onClose}
            className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Fechar Painel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto p-2 font-mono text-xs select-text">
        {activeTab === 'console' && (
          <div className="space-y-1">
            {logs.length === 0 ? (
              <div className="text-neutral-500 flex items-center gap-2 py-3 px-2 select-none">
                <TerminalIcon className="w-4 h-4 opacity-50" />
                <span>Nenhuma execução recente. Altere o código e clique em &quot;Executar Código&quot; (Ctrl+Enter).</span>
              </div>
            ) : (
              logs.map((log, index) => (
                <div 
                  key={index}
                  className={`flex items-start gap-2 py-0.5 px-1.5 rounded transition-colors leading-relaxed font-mono ${
                    log.type === 'error'
                      ? 'text-red-400 bg-red-950/20'
                      : log.type === 'warn'
                      ? 'text-amber-300 bg-amber-950/20'
                      : log.type === 'success'
                      ? 'text-emerald-400 bg-emerald-950/30 font-semibold'
                      : 'text-neutral-300'
                  }`}
                >
                  <span className="text-[10px] text-neutral-500 select-none shrink-0 pt-0.5">
                    {log.timestamp}
                  </span>
                  <span className="shrink-0 select-none text-[11px] font-bold">
                    {log.type === 'error' ? '✖' : log.type === 'warn' ? '⚠' : log.type === 'success' ? '✔' : '›'}
                  </span>
                  <pre className="whitespace-pre-wrap break-all font-mono text-xs flex-1 m-0">
                    {log.content}
                  </pre>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'python' && (
          <div className="h-full">
            <PythonTerminal 
              currentCode={currentCode}
              height="100%"
            />
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="p-3 text-neutral-400 select-none">
            {errorCount > 0 ? (
              <div className="space-y-1 text-red-300">
                {logs
                  .filter((l) => l.type === 'error')
                  .map((err, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      <span>{err.content}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Nenhum erro de sintaxe. Pronto para execução.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
