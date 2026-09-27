// ─────────────────────────────────────────────────────────────
// Definições de Tipos — ScratchBot: Logic Quest
// ─────────────────────────────────────────────────────────────

export type BlockCategory = 'events' | 'motion' | 'control' | 'actions';

export type BlockType =
  | 'when_flag_clicked'
  | 'move_forward'
  | 'turn_left'
  | 'turn_right'
  | 'repeat'
  | 'collect_gem';

export interface ScratchBlock {
  id: string;
  type: BlockType;
  category: BlockCategory;
  paramValue?: number; // Para repita N vezes ou passos
  children?: ScratchBlock[]; // Blocos aninhados dentro do laço de repetição
}

export type RobotDirection = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';

export interface GridCoord {
  x: number;
  y: number;
}

export interface LevelItem {
  id: string;
  coord: GridCoord;
  collected?: boolean;
}

export interface ScratchLevelDef {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tip?: string;
  gridSize: { width: number; height: number };
  startPos: GridCoord;
  startDir: RobotDirection;
  targetPos: GridCoord;
  obstacles: GridCoord[];
  gems?: GridCoord[];
  maxBlocksFor3Stars: number;
  maxBlocksFor2Stars: number;
  baseRewardBytes: number;
  availableBlockTypes: BlockType[];
}

export interface ScratchBotSaveData {
  completedLevels: Record<number, { stars: number; bestBlocks: number }>;
  infiniteBestStreak: number;
  totalGemsCollected: number;
}
