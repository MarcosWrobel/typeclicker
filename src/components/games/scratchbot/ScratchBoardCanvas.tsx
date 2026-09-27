import React from 'react';
import { motion } from 'motion/react';
import { GridCoord, RobotDirection } from '../../../types/scratchBot';

interface ScratchBoardCanvasProps {
  gridSize: { width: number; height: number };
  robotPos: GridCoord;
  robotDir: RobotDirection;
  targetPos: GridCoord;
  obstacles: GridCoord[];
  gems?: GridCoord[];
  collectedGems: Set<string>;
  hasCollided?: boolean;
  hasReachedTarget?: boolean;
  pathHistory?: GridCoord[];
}

export const ScratchBoardCanvas: React.FC<ScratchBoardCanvasProps> = ({
  gridSize,
  robotPos,
  robotDir,
  targetPos,
  obstacles,
  gems = [],
  collectedGems,
  hasCollided = false,
  hasReachedTarget = false,
  pathHistory = [],
}) => {
  const isObstacle = (x: number, y: number) => {
    return obstacles.some((o) => o.x === x && o.y === y);
  };

  const isTarget = (x: number, y: number) => {
    return targetPos.x === x && targetPos.y === y;
  };

  const isGem = (x: number, y: number) => {
    const key = `${x},${y}`;
    return gems.some((g) => g.x === x && g.y === y) && !collectedGems.has(key);
  };

  const isRobot = (x: number, y: number) => {
    return robotPos.x === x && robotPos.y === y;
  };

  const isPathTrail = (x: number, y: number) => {
    return pathHistory.some((p) => p.x === x && p.y === y);
  };

  const getRotationDegrees = (dir: RobotDirection) => {
    switch (dir) {
      case 'UP':
        return 0;
      case 'RIGHT':
        return 90;
      case 'DOWN':
        return 180;
      case 'LEFT':
        return 270;
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-3 sm:p-5 bg-[#0b0d14] rounded-2xl border border-zinc-800 shadow-2xl relative select-none">
      {/* Grid de Células */}
      <div
        className="grid gap-1.5 sm:gap-2 p-2 bg-[#121520] border-2 border-zinc-700/80 rounded-2xl shadow-inner max-w-full"
        style={{
          gridTemplateColumns: `repeat(${gridSize.width}, minmax(0, 1fr))`,
          aspectRatio: `${gridSize.width} / ${gridSize.height}`,
          width: `${Math.min(540, gridSize.width * 72)}px`,
        }}
      >
        {Array.from({ length: gridSize.height }).map((_, y) =>
          Array.from({ length: gridSize.width }).map((_, x) => {
            const obstacle = isObstacle(x, y);
            const target = isTarget(x, y);
            const gem = isGem(x, y);
            const robot = isRobot(x, y);
            const path = isPathTrail(x, y);

            return (
              <div
                key={`${x}-${y}`}
                className={`relative rounded-xl flex items-center justify-center text-center transition-colors duration-200 overflow-hidden ${
                  obstacle
                    ? 'bg-zinc-800/90 border border-zinc-700 shadow-inner'
                    : target
                    ? 'bg-emerald-950/60 border-2 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse'
                    : 'bg-[#181b28] border border-zinc-800/80'
                }`}
                style={{ aspectRatio: '1 / 1' }}
              >
                {/* Rastro de passos suaves */}
                {path && !robot && !obstacle && (
                  <div className="w-2 h-2 rounded-full bg-sky-500/30 animate-pulse pointer-events-none" />
                )}

                {/* Obstáculo / Firewall */}
                {obstacle && (
                  <div className="flex flex-col items-center justify-center text-zinc-500 font-mono text-[10px]">
                    <span className="text-xl sm:text-2xl filter drop-shadow">🧱</span>
                  </div>
                )}

                {/* Portal / Meta */}
                {target && !robot && (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl filter drop-shadow animate-bounce">🎯</span>
                    <span className="text-[9px] font-black font-mono text-emerald-400 uppercase tracking-wider">
                      Portal
                    </span>
                  </div>
                )}

                {/* Gema de Dados Coletável */}
                {gem && !robot && (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <span className="text-xl sm:text-2xl filter drop-shadow">💎</span>
                  </motion.div>
                )}

                {/* Robô Bytezinho */}
                {robot && (
                  <motion.div
                    layout
                    initial={false}
                    animate={{
                      rotate: getRotationDegrees(robotDir),
                      scale: hasCollided ? [1, 1.25, 0.95, 1] : hasReachedTarget ? [1, 1.3, 1] : 1,
                    }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className={`relative w-4/5 h-4/5 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer ${
                      hasCollided
                        ? 'bg-rose-600 shadow-rose-600/50'
                        : hasReachedTarget
                        ? 'bg-emerald-500 shadow-emerald-500/50'
                        : 'bg-gradient-to-tr from-sky-600 to-indigo-500 shadow-sky-500/40'
                    }`}
                  >
                    {/* Indicador direcional de frente (triângulo no topo) */}
                    <div className="absolute -top-1 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-yellow-300 drop-shadow" />

                    <span className="text-xl sm:text-2xl">🤖</span>
                  </motion.div>
                )}

                {/* Notação de Coordenada sutil */}
                <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-zinc-700 pointer-events-none select-none">
                  {x},{y}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Legenda dos Elementos */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 mt-3 sm:mt-4 text-xs font-mono text-zinc-400 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span>🤖</span>
          <span>Bytezinho</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🎯</span>
          <span>Portal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🧱</span>
          <span>Obstáculo</span>
        </div>
        {gems.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span>💎</span>
            <span>Gema ({collectedGems.size}/{gems.length})</span>
          </div>
        )}
      </div>
    </div>
  );
};
