import React from 'react';
import { motion } from 'motion/react';
import { GridCoord, RobotDirection, TeleporterPair, ConveyorBelt, LaserGate } from '../../../types/scratchBot';
import { BytezinhoAvatar } from '../../BytezinhoAvatar';
import { BytezinhoSkinId } from '../../../types/cosmetics';

interface ScratchBoardCanvasProps {
  gridSize: { width: number; height: number };
  robotPos: GridCoord;
  robotDir: RobotDirection;
  targetPos: GridCoord;
  obstacles: GridCoord[];
  gems?: GridCoord[];
  hazards?: GridCoord[];
  teleporters?: TeleporterPair[];
  conveyors?: ConveyorBelt[];
  gates?: LaserGate[];
  unlockedGates?: Set<string>;
  collectedGems: Set<string>;
  hasCollided?: boolean;
  hasReachedTarget?: boolean;
  pathHistory?: GridCoord[];
  equippedSkin?: BytezinhoSkinId;
}

// ─────────────────────────────────────────────────────────────
// Sprites Vetoriais Originais da Plataforma (Alta Definição)
// ─────────────────────────────────────────────────────────────

/** Sprite do Portal Quântico de Destino */
const CyberPortalSprite: React.FC = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none">
    <div className="absolute inset-1 rounded-full border border-emerald-400/40 animate-ping" />
    <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
      <svg viewBox="0 0 40 40" className="w-full h-full animate-[spin_6s_linear_infinite]">
        <defs>
          <linearGradient id="portalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="16" stroke="url(#portalGrad)" strokeWidth="2.5" fill="none" strokeDasharray="6, 3" />
        <circle cx="20" cy="20" r="11" stroke="#34d399" strokeWidth="1.5" fill="#064e3b" fillOpacity="0.6" />
      </svg>
      <div className="absolute w-3.5 h-3.5 rounded-full bg-emerald-300 shadow-[0_0_12px_#34d399] animate-pulse" />
    </div>
    <span className="text-[8px] font-black font-mono text-emerald-400 uppercase tracking-widest mt-0.5">
      PORTAL
    </span>
  </div>
);

/** Sprite do Obstáculo Firewall Cibernético */
const CyberObstacleSprite: React.FC = () => (
  <div className="relative w-full h-full flex items-center justify-center p-1 pointer-events-none">
    <div className="w-full h-full rounded-xl bg-zinc-900 border border-rose-500/40 shadow-inner flex flex-col items-center justify-center overflow-hidden relative">
      <div 
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'linear-gradient(#f43f5e 1px, transparent 1px), linear-gradient(90deg, #f43f5e 1px, transparent 1px)',
          backgroundSize: '8px 8px'
        }}
      />
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-rose-400 drop-shadow relative z-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="8" y1="11" x2="16" y2="11" />
      </svg>
      <span className="text-[7px] font-mono text-rose-300/80 font-bold uppercase tracking-wider relative z-10">
        FIREWALL
      </span>
    </div>
  </div>
);

/** Sprite do Piso de Sobrecarga Elétrica (EMP Hazard) */
const EmpHazardSprite: React.FC = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-1 pointer-events-none">
    <div className="w-full h-full rounded-xl bg-amber-950/40 border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-yellow-500/10 animate-pulse" />
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400 animate-bounce" fill="currentColor">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
      <span className="text-[7px] font-black font-mono text-amber-300 uppercase tracking-wider relative z-10">
        EMP⚡
      </span>
    </div>
  </div>
);

/** Sprite do Teletransportador Quântico (Warp Pad) */
const WarpPadSprite: React.FC<{ label: string; isSource: boolean }> = ({ label, isSource }) => (
  <div className="relative w-full h-full flex flex-col items-center justify-center p-1 pointer-events-none">
    <div className={`w-full h-full rounded-full border-2 ${
      isSource ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_14px_#22d3ee]' : 'border-indigo-400 bg-indigo-950/40 shadow-[0_0_14px_#818cf8]'
    } flex flex-col items-center justify-center relative overflow-hidden`}>
      <svg viewBox="0 0 32 32" className="w-6 h-6 animate-spin [animation-duration:8s]">
        <circle cx="16" cy="16" r="12" stroke={isSource ? '#22d3ee' : '#818cf8'} strokeWidth="2" strokeDasharray="4, 3" fill="none" />
      </svg>
      <span className="absolute text-[9px] font-black font-mono text-white">
        {label}
      </span>
    </div>
  </div>
);

/** Sprite de Porta a Laser */
const LaserGateSprite: React.FC<{ isUnlocked: boolean }> = ({ isUnlocked }) => (
  <div className="relative w-full h-full flex items-center justify-center p-1 pointer-events-none">
    <div className={`w-full h-full rounded-xl border flex flex-col items-center justify-center transition-all ${
      isUnlocked 
        ? 'border-emerald-500/30 bg-emerald-950/20' 
        : 'border-rose-500 bg-rose-950/50 shadow-[0_0_14px_rgba(244,63,94,0.4)]'
    }`}>
      {isUnlocked ? (
        <span className="text-[8px] font-mono text-emerald-400 font-bold">ABERTO</span>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-[7px] font-mono text-rose-300 font-bold uppercase mt-0.5">PORTÃO</span>
        </>
      )}
    </div>
  </div>
);

/** Sprite de Chave / Terminal Criptográfico */
const GateKeySprite: React.FC<{ isCollected: boolean }> = ({ isCollected }) => (
  <div className="relative w-full h-full flex items-center justify-center p-1 pointer-events-none">
    {!isCollected ? (
      <motion.div 
        animate={{ y: [0, -2, 0], rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="w-full h-full rounded-xl bg-amber-950/60 border border-amber-400/80 shadow-[0_0_10px_#f59e0b] flex flex-col items-center justify-center"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-300 drop-shadow" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="7.5" cy="15.5" r="4.5" />
          <path d="M21 2l-9.6 9.6" />
          <path d="M15.5 7.5l3 3" />
        </svg>
        <span className="text-[7px] font-mono text-amber-200 font-black">CHAVE</span>
      </motion.div>
    ) : (
      <div className="w-2 h-2 rounded-full bg-amber-400/20" />
    )}
  </div>
);

/** Sprite de Esteira de Aceleração (Conveyor Belt) */
const ConveyorSprite: React.FC<{ dir: RobotDirection }> = ({ dir }) => {
  const getRotation = () => {
    switch (dir) {
      case 'UP': return -90;
      case 'RIGHT': return 0;
      case 'DOWN': return 90;
      case 'LEFT': return 180;
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-1 pointer-events-none">
      <div className="w-full h-full rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex items-center justify-center overflow-hidden">
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 text-cyan-400 drop-shadow animate-pulse"
          style={{ transform: `rotate(${getRotation()}deg)` }}
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
};

/** Sprite da Gema de Dados Coletável */
const CyberGemSprite: React.FC = () => (
  <motion.div
    animate={{ scale: [1, 1.1, 1], y: [0, -2, 0] }}
    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    className="relative w-full h-full flex items-center justify-center p-1 pointer-events-none"
  >
    <div className="relative w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center">
      <svg viewBox="0 0 32 32" className="w-full h-full filter drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
        <defs>
          <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
        </defs>
        <polygon points="16,2 28,10 16,30 4,10" fill="url(#gemGrad)" stroke="#f3e8ff" strokeWidth="1" />
        <polygon points="16,2 22,10 16,16 10,10" fill="#f5d0fe" fillOpacity="0.7" />
        <line x1="16" y1="16" x2="16" y2="30" stroke="#f3e8ff" strokeWidth="1" opacity="0.6" />
        <line x1="10" y1="10" x2="16" y2="30" stroke="#581c87" strokeWidth="0.8" opacity="0.8" />
        <line x1="22" y1="10" x2="16" y2="30" stroke="#581c87" strokeWidth="0.8" opacity="0.8" />
      </svg>
      <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-white opacity-80" />
    </div>
  </motion.div>
);

export const ScratchBoardCanvas: React.FC<ScratchBoardCanvasProps> = ({
  gridSize,
  robotPos,
  robotDir,
  targetPos,
  obstacles,
  gems = [],
  hazards = [],
  teleporters = [],
  conveyors = [],
  gates = [],
  unlockedGates = new Set(),
  collectedGems,
  hasCollided = false,
  hasReachedTarget = false,
  pathHistory = [],
  equippedSkin = 'classic',
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

  const isHazard = (x: number, y: number) => {
    return hazards.some((h) => h.x === x && h.y === y);
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

  const getTeleporter = (x: number, y: number) => {
    for (let i = 0; i < teleporters.length; i++) {
      const tp = teleporters[i];
      if (tp.from.x === x && tp.from.y === y) {
        return { label: `W${i + 1}A`, isSource: true };
      }
      if (tp.to.x === x && tp.to.y === y) {
        return { label: `W${i + 1}B`, isSource: false };
      }
    }
    return null;
  };

  const getConveyor = (x: number, y: number) => {
    return conveyors.find((c) => c.coord.x === x && c.coord.y === y);
  };

  const getGate = (x: number, y: number) => {
    return gates.find((g) => g.gateCoord.x === x && g.gateCoord.y === y);
  };

  const getKey = (x: number, y: number) => {
    return gates.find((g) => g.keyCoord.x === x && g.keyCoord.y === y);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-5 bg-[#0b0d14] rounded-2xl border border-zinc-800 shadow-2xl relative select-none">
      {/* Grid de Células */}
      <div
        className="grid gap-1.5 sm:gap-2.5 p-2.5 bg-[#121520] border-2 border-zinc-700/80 rounded-2xl shadow-inner max-w-full max-h-[75vh]"
        style={{
          gridTemplateColumns: `repeat(${gridSize.width}, minmax(0, 1fr))`,
          aspectRatio: `${gridSize.width} / ${gridSize.height}`,
          width: `${Math.min(680, gridSize.width * 84)}px`,
        }}
      >
        {Array.from({ length: gridSize.height }).map((_, y) =>
          Array.from({ length: gridSize.width }).map((_, x) => {
            const obstacle = isObstacle(x, y);
            const target = isTarget(x, y);
            const gem = isGem(x, y);
            const robot = isRobot(x, y);
            const path = isPathTrail(x, y);
            const hazard = isHazard(x, y);
            const teleporter = getTeleporter(x, y);
            const conveyor = getConveyor(x, y);
            const gate = getGate(x, y);
            const gateKey = getKey(x, y);
            const isGateUnlocked = gate ? unlockedGates.has(`${gate.gateCoord.x},${gate.gateCoord.y}`) : false;
            const isKeyCollected = gateKey ? unlockedGates.has(`${gateKey.gateCoord.x},${gateKey.gateCoord.y}`) : false;

            return (
              <div
                key={`${x}-${y}`}
                className={`relative rounded-xl flex items-center justify-center text-center transition-colors duration-200 overflow-hidden ${
                  obstacle
                    ? 'bg-zinc-800/90 border border-zinc-700 shadow-inner'
                    : target
                    ? 'bg-emerald-950/60 border-2 border-emerald-500/80 shadow-[0_0_24px_rgba(16,185,129,0.35)]'
                    : hazard
                    ? 'bg-amber-950/30 border border-amber-600/40'
                    : teleporter
                    ? 'bg-cyan-950/30 border border-cyan-500/30'
                    : conveyor
                    ? 'bg-sky-950/20 border border-sky-500/30'
                    : 'bg-[#181b28] border border-zinc-800/80'
                }`}
                style={{ aspectRatio: '1 / 1' }}
              >
                {/* Rastro de passos suaves */}
                {path && !robot && !obstacle && !hazard && (
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500/40 animate-pulse pointer-events-none" />
                )}

                {/* Obstáculo / Firewall */}
                {obstacle && <CyberObstacleSprite />}

                {/* Piso de Sobrecarga Elétrica (EMP) */}
                {hazard && !robot && <EmpHazardSprite />}

                {/* Teletransportador Quântico (Warp Pad) */}
                {teleporter && !robot && <WarpPadSprite label={teleporter.label} isSource={teleporter.isSource} />}

                {/* Esteira de Aceleração */}
                {conveyor && !robot && <ConveyorSprite dir={conveyor.direction} />}

                {/* Porta a Laser */}
                {gate && !robot && <LaserGateSprite isUnlocked={isGateUnlocked} />}

                {/* Chave de Segurança */}
                {gateKey && !robot && <GateKeySprite isCollected={isKeyCollected} />}

                {/* Portal / Meta */}
                {target && !robot && <CyberPortalSprite />}

                {/* Gema de Dados Coletável */}
                {gem && !robot && <CyberGemSprite />}

                {/* Robô Bytezinho com Skin Oficial */}
                {robot && (
                  <motion.div
                    layout
                    initial={false}
                    animate={{
                      scale: hasCollided ? [1, 1.25, 0.95, 1] : hasReachedTarget ? [1, 1.3, 1] : 1,
                    }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className={`relative w-[90%] h-[90%] rounded-2xl flex items-center justify-center shadow-lg cursor-pointer ${
                      hasCollided
                        ? 'bg-rose-950/80 border-2 border-rose-500 shadow-rose-600/50'
                        : hasReachedTarget
                        ? 'bg-emerald-950/80 border-2 border-emerald-400 shadow-emerald-500/50'
                        : 'bg-zinc-900/90 border-2 border-sky-400/80 shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                    }`}
                  >
                    {/* Bússola / Indicador direcional de mira */}
                    <motion.div 
                      animate={{ rotate: getRotationDegrees(robotDir) }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute inset-0 flex items-start justify-center pointer-events-none"
                    >
                      <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-yellow-400 drop-shadow-[0_0_6px_#facc15] -mt-1.5" />
                    </motion.div>

                    {/* Mascote Oficial Bytezinho */}
                    <div className="w-full h-full flex items-center justify-center p-0.5">
                      <BytezinhoAvatar
                        skin={equippedSkin}
                        size="sm"
                        mood={hasCollided ? 'oops' : hasReachedTarget ? 'happy' : 'normal'}
                      />
                    </div>
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

      {/* Legenda dos Elementos com Sprites Oficiais */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 mt-4 text-[11px] font-mono text-zinc-400 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full border border-sky-400/40 bg-zinc-900 flex items-center justify-center overflow-hidden">
            <BytezinhoAvatar skin={equippedSkin} size="sm" className="scale-50" />
          </div>
          <span>Bytezinho</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span>Portal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-rose-500/80 border border-rose-400" />
          <span>Firewall</span>
        </div>
        {hazards.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500/80 text-black text-[8px] flex items-center justify-center font-bold">⚡</span>
            <span>EMP</span>
          </div>
        )}
        {teleporters.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-cyan-400 bg-cyan-950 text-[7px] text-cyan-300 flex items-center justify-center">W</span>
            <span>Warp</span>
          </div>
        )}
        {conveyors.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-sky-950 border border-sky-400 text-[8px] text-sky-300 flex items-center justify-center">➔</span>
            <span>Esteira</span>
          </div>
        )}
        {gates.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded border border-rose-500 text-[8px] text-rose-300 flex items-center justify-center">🔒</span>
            <span>Portão/Chave</span>
          </div>
        )}
        {gems.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-purple-400 shadow-[0_0_6px_#c084fc] rotate-45" />
            <span>Gemas ({collectedGems.size}/{gems.length})</span>
          </div>
        )}
      </div>
    </div>
  );
};
