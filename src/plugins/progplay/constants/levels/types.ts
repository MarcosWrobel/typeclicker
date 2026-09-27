export type GameLanguageId = 'javascript' | 'python' | 'css' | 'html' | 'sql';

export interface GameLanguageCard {
  id: GameLanguageId;
  name: string;
  badge: string;
  color: string;
  bgColor: string;
  borderColor: string;
  tag: string;
  extension: string;
  description: string;
  monacoLang: string;
  totalLevels: number;
}

export type LevelThemeCategory = 'door' | 'web-builder';

export interface GameLevel {
  id: number;
  title: string;
  themeStyle: 'wooden' | 'iron' | 'vault' | 'scifi' | 'portal' | 'web-component' | 'web-layout' | 'web-api' | 'web-fullstack';
  themeCategory?: LevelThemeCategory;
  targetObjective: string;
  puzzleDescription: string;
  initialCode: string;
  hints: string[];
  expectedConditionText: string;
  previewType?: 'door' | 'site-component' | 'terminal' | 'database-table';
  previewMeta?: {
    componentTitle?: string;
    previewSnippet?: string;
    successBadge?: string;
    actionLabel?: string;
  };
  validate: (rawCode: string, scope?: Record<string, any>) => {
    success: boolean;
    message: string;
    doorState: boolean;
  };
}
