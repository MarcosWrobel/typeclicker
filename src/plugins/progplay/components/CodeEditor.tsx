import React from 'react';
import Editor,{ OnMount } from '@monaco-editor/react';
import { EditorSettings, CursorPosition } from '../types';
import { THEMES } from '../constants/themes';
import { registerAutocompleteProviders } from '../utils/monacoAutocomplete';

interface CodeEditorProps {
  code: string;
  language?: string;
  settings: EditorSettings;
  onChange: (value: string) => void;
  onCursorChange?: (pos: CursorPosition) => void;
  onRunCode: () => void;
  editorRef: React.MutableRefObject<any>;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language = 'javascript',
  settings,
  onChange,
  onCursorChange,
  onRunCode,
  editorRef,
}) => {
  const activeTheme = THEMES[settings.theme] || THEMES['vs-dark-modern'];

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register intelligent autocomplete & snippet providers
    registerAutocompleteProviders(monaco);

    // Track cursor movement
    editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange({
          lineNumber: e.position.lineNumber,
          column: e.position.column,
        });
      }
    });

    // Custom Keybinding: Ctrl+Enter / Cmd+Enter to Run Code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunCode();
    });

    // Focus editor
    editor.focus();
  };

  const monacoTheme = settings.theme === 'light' ? 'light' : 'vs-dark';

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: activeTheme.ui.editorBg }}
    >
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={code}
        theme={monacoTheme}
        onChange={(val) => onChange(val ?? '')}
        onMount={handleEditorDidMount}
        loading={
          <div 
            className="w-full h-full flex flex-col justify-center items-center gap-3 select-none text-neutral-400"
            style={{ backgroundColor: activeTheme.ui.editorBg }}
          >
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono">Carregando editor VS Code...</span>
          </div>
        }
        options={{
          fontSize: settings.fontSize,
          tabSize: settings.tabSize,
          wordWrap: settings.wordWrap ? 'on' : 'off',
          minimap: {
            enabled: settings.minimap,
            renderCharacters: true,
            maxColumn: 100,
          },
          lineNumbers: settings.lineNumbers ? 'on' : 'off',
          lineNumbersMinChars: 3,
          fontFamily: "'Cascadia Code', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
          fontLigatures: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          bracketPairColorization: {
            enabled: true,
          },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderLineHighlight: 'all',
          renderWhitespace: 'selection',
          guides: {
            indentation: true,
            bracketPairs: true,
          },
          padding: {
            top: 12,
            bottom: 16,
          },
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,

          // Rich Autocomplete & IntelliSense Settings
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true,
          },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          wordBasedSuggestions: 'allDocuments',
          parameterHints: {
            enabled: true,
            cycle: true,
          },
          snippetSuggestions: 'top',
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showFunctions: true,
            showVariables: true,
            showClasses: true,
            showMethods: true,
            showProperties: true,
            showEvents: true,
            showOperators: true,
            showWords: true,
            filterGraceful: true,
            snippetsPreventQuickSuggestions: false,
          },
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          autoClosingDelete: 'always',
          autoClosingOvertype: 'always',
          autoSurround: 'languageDefined',
          formatOnType: true,
          formatOnPaste: true,
        }}
      />
    </div>
  );
};
