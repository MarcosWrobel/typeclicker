export type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'html'
  | 'css'
  | 'python'
  | 'json'
  | 'markdown'
  | 'sql'
  | 'cpp'
  | 'rust'
  | 'go'
  | 'php';

export interface EditorFile {
  id: string;
  name: string;
  language: SupportedLanguage;
  content: string;
  isModified?: boolean;
}

export type EditorThemeId = 'vs-dark' | 'vs-dark-modern' | 'monokai' | 'github-dark' | 'light';

export interface EditorSettings {
  theme: EditorThemeId;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
}

export interface CursorPosition {
  lineNumber: number;
  column: number;
  selectionLength?: number;
}
