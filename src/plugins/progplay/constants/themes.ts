import { EditorThemeId } from '../types';

export interface ThemeConfig {
  id: EditorThemeId;
  name: string;
  monacoTheme: string;
  ui: {
    bg: string;
    editorBg: string;
    tabBarBg: string;
    activeTabBg: string;
    inactiveTabBg: string;
    tabText: string;
    activeTabText: string;
    border: string;
    breadcrumbsBg: string;
    statusBarBg: string;
    statusBarText: string;
    hoverBg: string;
    lineHighlight: string;
  };
}

export const THEMES: Record<EditorThemeId, ThemeConfig> = {
  'vs-dark-modern': {
    id: 'vs-dark-modern',
    name: 'Dark Modern (VS Code)',
    monacoTheme: 'vs-dark',
    ui: {
      bg: '#181818',
      editorBg: '#1f1f1f',
      tabBarBg: '#181818',
      activeTabBg: '#1f1f1f',
      inactiveTabBg: '#181818',
      tabText: '#9d9d9d',
      activeTabText: '#ffffff',
      border: '#2b2b2b',
      breadcrumbsBg: '#1f1f1f',
      statusBarBg: '#0078d4',
      statusBarText: '#ffffff',
      hoverBg: '#2a2d2e',
      lineHighlight: '#282828',
    },
  },
  'vs-dark': {
    id: 'vs-dark',
    name: 'Dark+ (Classic)',
    monacoTheme: 'vs-dark',
    ui: {
      bg: '#1e1e1e',
      editorBg: '#1e1e1e',
      tabBarBg: '#252526',
      activeTabBg: '#1e1e1e',
      inactiveTabBg: '#2d2d2d',
      tabText: '#969696',
      activeTabText: '#ffffff',
      border: '#333333',
      breadcrumbsBg: '#1e1e1e',
      statusBarBg: '#007acc',
      statusBarText: '#ffffff',
      hoverBg: '#37373d',
      lineHighlight: '#282828',
    },
  },
  'monokai': {
    id: 'monokai',
    name: 'Monokai',
    monacoTheme: 'vs-dark',
    ui: {
      bg: '#1e1f1c',
      editorBg: '#272822',
      tabBarBg: '#1e1f1c',
      activeTabBg: '#272822',
      inactiveTabBg: '#1e1f1c',
      tabText: '#75715e',
      activeTabText: '#f8f8f2',
      border: '#3e3d32',
      breadcrumbsBg: '#272822',
      statusBarBg: '#75715e',
      statusBarText: '#f8f8f2',
      hoverBg: '#3e3d32',
      lineHighlight: '#3e3d32',
    },
  },
  'github-dark': {
    id: 'github-dark',
    name: 'GitHub Dark',
    monacoTheme: 'vs-dark',
    ui: {
      bg: '#010409',
      editorBg: '#0d1117',
      tabBarBg: '#010409',
      activeTabBg: '#0d1117',
      inactiveTabBg: '#010409',
      tabText: '#8b949e',
      activeTabText: '#f0f6fc',
      border: '#30363d',
      breadcrumbsBg: '#0d1117',
      statusBarBg: '#1f242c',
      statusBarText: '#f0f6fc',
      hoverBg: '#161b22',
      lineHighlight: '#161b22',
    },
  },
  'light': {
    id: 'light',
    name: 'Light Modern',
    monacoTheme: 'light',
    ui: {
      bg: '#f3f3f3',
      editorBg: '#ffffff',
      tabBarBg: '#f3f3f3',
      activeTabBg: '#ffffff',
      inactiveTabBg: '#ececec',
      tabText: '#616161',
      activeTabText: '#333333',
      border: '#e5e5e5',
      breadcrumbsBg: '#ffffff',
      statusBarBg: '#007acc',
      statusBarText: '#ffffff',
      hoverBg: '#e8e8e8',
      lineHighlight: '#f7f7f7',
    },
  },
};
