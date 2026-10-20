import React,{ useState, useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
RotateCcw,
Flag,
Square,
ArrowLeft,
Trophy,
Sparkles,Star,Lightbulb,
Layers,
Infinity as InfinityIcon,Bot,
ArrowUp,
RotateCw,
Repeat,
Diamond,
ArrowRight,
StepForward,
Compass,
Bug
} from 'lucide-react';
import { BaseGameProps, GameExitPayload } from '../../../types/gamePlugin';
import { BytezinhoSkinId } from '../../../types/cosmetics';
import {
ScratchBlock,
BlockType,
GridCoord,
RobotDirection,
ScratchLevelDef,
ScratchBotSaveData
} from '../../../types/scratchBot';
import { PEDAGOGICAL_LEVELS } from './levelsData';
import { BUG_HUNTER_LEVELS } from './bugHunterLevels';
import { generateProceduralLevel } from './proceduralGenerator';
import { ScratchBlockItem } from './ScratchBlockItem';
import { ScratchBoardCanvas } from './ScratchBoardCanvas';
import { scratchAudio } from './scratchAudio';

const SAVE_KEY = 'scratchbot_progress_v1';

export interface ScratchBotGameProps extends BaseGameProps {
  equippedSkin?: BytezinhoSkinId;
}

export const ScratchBotGame: React.FC<ScratchBotGameProps> = ({
  onExitToHub,
  difficultyMultiplier = 1.0,
  studentClass = 'warrior',
  equippedSkin = 'classic',
}) => {
  // ─────────────────────────────────────────────────────────────
  // 1. Estado da Trilha e Modo de Jogo
  // ─────────────────────────────────────────────────────────────
  const [gameMode, setGameMode] = useState<'campaign' | 'bughunter' | 'infinite'>('campaign');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [currentBugLevelIndex, setCurrentBugLevelIndex] = useState<number>(0);
  const [infiniteSeed, setInfiniteSeed] = useState<number>(1);
  const [infiniteStreak, setInfiniteStreak] = useState<number>(0);

  // Persistência local de fases e recordes
  const [saveData, setSaveData] = useState<ScratchBotSaveData>(() => {
    try {
      const stored = localStorage.getItem(SAVE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      completedLevels: {},
      completedBugLevels: {},
      infiniteBestStreak: 0,
      totalGemsCollected: 0,
    };
  });

  const saveToStorage = useCallback((data: ScratchBotSaveData) => {
    setSaveData(data);
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch {}
  }, []);

  // Nível atual com base no modo (memorizado para estabilidade)
  const activeLevel: ScratchLevelDef = useMemo(() => {
    if (gameMode === 'campaign') {
      return PEDAGOGICAL_LEVELS[currentLevelIndex] || PEDAGOGICAL_LEVELS[0];
    }
    if (gameMode === 'bughunter') {
      return BUG_HUNTER_LEVELS[currentBugLevelIndex] || BUG_HUNTER_LEVELS[0];
    }
    return generateProceduralLevel(infiniteSeed);
  }, [gameMode, currentLevelIndex, currentBugLevelIndex, infiniteSeed]);

  // ─────────────────────────────────────────────────────────────
  // 2. Estado do Tabuleiro e Robô
  // ─────────────────────────────────────────────────────────────
  const [robotPos, setRobotPos] = useState<GridCoord>(activeLevel.startPos);
  const [robotDir, setRobotDir] = useState<RobotDirection>(activeLevel.startDir);
  const [collectedGems, setCollectedGems] = useState<Set<string>>(new Set());
  const [unlockedGates, setUnlockedGates] = useState<Set<string>>(new Set());
  const [pathHistory, setPathHistory] = useState<GridCoord[]>([activeLevel.startPos]);
  const [hasCollided, setHasCollided] = useState<boolean>(false);
  const [hasReachedTarget, setHasReachedTarget] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [errorBlockId, setErrorBlockId] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────
  // 3. Área de Scripts (Workspace)
  // ─────────────────────────────────────────────────────────────
  const [scriptBlocks, setScriptBlocks] = useState<ScratchBlock[]>([
    { id: 'flag-start', type: 'when_flag_clicked', category: 'events' },
  ]);

  const [activeStepBlockId, setActiveStepBlockId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isStepMode, setIsStepMode] = useState<boolean>(false);
  const stepResolverRef = useRef<(() => void) | null>(null);
  const [execSpeed, setExecSpeed] = useState<number>(350); // ms por passo

  // Métricas acumuladas da sessão
  const sessionStartTime = useRef<number>(Date.now());
  const [totalEarnedBytes, setTotalEarnedBytes] = useState<number>(0);
  const [stagesWonCount, setStagesWonCount] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);

  // Modal de Vitória
  const [victoryModalOpen, setVictoryModalOpen] = useState<boolean>(false);
  const [earnedStarsThisLevel, setEarnedStarsThisLevel] = useState<number>(3);

  // Limpeza de timers e áudio
  const isExecutingRef = useRef<boolean>(false);
  const stopRequestedRef = useRef<boolean>(false);

  // Contagem de blocos em uso por tipo (para limites de estoque pedagógicos)
  const usedBlocksByType = useMemo(() => {
    const counts: Partial<Record<BlockType, number>> = {};
    const traverse = (blocks: ScratchBlock[]) => {
      for (const b of blocks) {
        if (b.type !== 'when_flag_clicked') {
          counts[b.type] = (counts[b.type] || 0) + 1;
        }
        if (b.children) traverse(b.children);
      }
    };
    traverse(scriptBlocks);
    return counts;
  }, [scriptBlocks]);

  useEffect(() => {
    return () => {
      stopRequestedRef.current = true;
      if (stepResolverRef.current) {
        stepResolverRef.current();
        stepResolverRef.current = null;
      }
      scratchAudio.cleanup();
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 4. Reinicialização de Fase
  // ─────────────────────────────────────────────────────────────
  const resetRobotToStart = useCallback(() => {
    stopRequestedRef.current = true;
    if (stepResolverRef.current) {
      stepResolverRef.current();
      stepResolverRef.current = null;
    }
    setIsRunning(false);
    setIsStepMode(false);
    setActiveStepBlockId(null);
    setErrorBlockId(null);
    setRobotPos(activeLevel.startPos);
    setRobotDir(activeLevel.startDir);
    setCollectedGems(new Set());
    setUnlockedGates(new Set());
    setPathHistory([activeLevel.startPos]);
    setHasCollided(false);
    setHasReachedTarget(false);
    setFeedbackMessage('');
  }, [activeLevel]);

  // Ao mudar de nível, reinicia
  useEffect(() => {
    resetRobotToStart();
    if (gameMode === 'bughunter' && activeLevel.initialScript) {
      // Clona o script com novos IDs para permitir manipulação fluida e isolada
      const cloneScript = (blocks: ScratchBlock[]): ScratchBlock[] =>
        blocks.map((b) => ({
          ...b,
          id: b.id === 'flag-start' ? 'flag-start' : `bug-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          children: b.children ? cloneScript(b.children) : undefined,
        }));
      setScriptBlocks(cloneScript(activeLevel.initialScript));
    } else {
      setScriptBlocks([{ id: 'flag-start', type: 'when_flag_clicked', category: 'events' }]);
    }
  }, [currentLevelIndex, currentBugLevelIndex, gameMode, infiniteSeed, resetRobotToStart, activeLevel.initialScript]);

  // ─────────────────────────────────────────────────────────────
  // 5. Adição e Remoção de Blocos
  // ─────────────────────────────────────────────────────────────
  const addBlockToWorkspace = (type: BlockType, parentId?: string) => {
    // Validação de estoque pedagógico da fase
    if (activeLevel.blockLimits && activeLevel.blockLimits[type] !== undefined) {
      const used = usedBlocksByType[type] || 0;
      const maxAllowed = activeLevel.blockLimits[type] || 0;
      if (used >= maxAllowed) {
        setFeedbackMessage(`Estoque esgotado! Esta fase permite no máximo ${maxAllowed} bloco(s) deste tipo.`);
        return;
      }
    }

    scratchAudio.playBlockSnap();

    const categoryMap: Record<BlockType, ScratchBlock['category']> = {
      when_flag_clicked: 'events',
      move_forward: 'motion',
      turn_left: 'motion',
      turn_right: 'motion',
      repeat: 'control',
      collect_gem: 'actions',
      if_path_ahead: 'control',
      if_on_gem: 'control',
    };

    const isContainer = type === 'repeat' || type === 'if_path_ahead' || type === 'if_on_gem';
    const newBlock: ScratchBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      category: categoryMap[type],
      paramValue: type === 'repeat' ? 2 : undefined,
      children: isContainer ? [] : undefined,
    };

    if (parentId) {
      const appendChildRecursive = (blocks: ScratchBlock[]): ScratchBlock[] => {
        return blocks.map((b) => {
          if (b.id === parentId && (b.type === 'repeat' || b.type === 'if_path_ahead' || b.type === 'if_on_gem')) {
            return { ...b, children: [...(b.children || []), newBlock] };
          }
          if (b.children) {
            return { ...b, children: appendChildRecursive(b.children) };
          }
          return b;
        });
      };
      setScriptBlocks((prev) => appendChildRecursive(prev));
    } else {
      setScriptBlocks((prev) => [...prev, newBlock]);
    }
  };

  const removeBlock = (id: string) => {
    scratchAudio.playBlockSnap();
    setScriptBlocks((prev) => {
      const { remaining } = extractBlock(prev, id);
      return remaining;
    });
  };

  const removeChildBlock = (parentId: string, childId: string) => {
    scratchAudio.playBlockSnap();
    const removeRecursive = (list: ScratchBlock[]): ScratchBlock[] => {
      return list.map((b) => {
        if (b.id === parentId && b.children) {
          return { ...b, children: b.children.filter((c) => c.id !== childId) };
        }
        if (b.children && b.children.length > 0) {
          return { ...b, children: removeRecursive(b.children) };
        }
        return b;
      });
    };
    setScriptBlocks((prev) => removeRecursive(prev));
  };

  const updateBlockParam = (id: string, value: number) => {
    const updateRecursive = (list: ScratchBlock[]): ScratchBlock[] => {
      return list.map((b) => {
        if (b.id === id) return { ...b, paramValue: value };
        if (b.children && b.children.length > 0) {
          return { ...b, children: updateRecursive(b.children) };
        }
        return b;
      });
    };
    setScriptBlocks((prev) => updateRecursive(prev));
  };

  // ─────────────────────────────────────────────────────────────
  // 5.1 Reordenação e Movimentação de Blocos (estilo Scratch)
  // ─────────────────────────────────────────────────────────────

  // Mover bloco relativo (para cima ou para baixo via botões)
  const moveBlockRelative = (id: string, direction: -1 | 1, parentId?: string) => {
    scratchAudio.playBlockSnap();
    if (!parentId) {
      setScriptBlocks((prev) => {
        const index = prev.findIndex((b) => b.id === id);
        if (index === -1) return prev;
        const targetIndex = index + direction;
        // Não pode ir antes da bandeira verde (índice 0) ou fora dos limites
        if (targetIndex < 1 || targetIndex >= prev.length) return prev;
        const next = [...prev];
        const [moved] = next.splice(index, 1);
        next.splice(targetIndex, 0, moved);
        return next;
      });
    } else {
      const moveInParentRecursive = (list: ScratchBlock[]): ScratchBlock[] => {
        return list.map((b) => {
          if (b.id === parentId && b.children) {
            const index = b.children.findIndex((c) => c.id === id);
            if (index === -1) return b;
            const targetIndex = index + direction;
            if (targetIndex < 0 || targetIndex >= b.children.length) return b;
            const nextChildren = [...b.children];
            const [moved] = nextChildren.splice(index, 1);
            nextChildren.splice(targetIndex, 0, moved);
            return { ...b, children: nextChildren };
          }
          if (b.children && b.children.length > 0) {
            return { ...b, children: moveInParentRecursive(b.children) };
          }
          return b;
        });
      };
      setScriptBlocks((prev) => moveInParentRecursive(prev));
    }
  };

  // Extrai recursivamente um bloco da árvore
  const extractBlock = (
    blocks: ScratchBlock[],
    id: string
  ): { extracted: ScratchBlock | null; remaining: ScratchBlock[] } => {
    let extracted: ScratchBlock | null = null;
    const remaining: ScratchBlock[] = [];

    for (const b of blocks) {
      if (b.id === id) {
        extracted = b;
      } else {
        if (b.children && b.children.length > 0) {
          const res = extractBlock(b.children, id);
          if (res.extracted) {
            extracted = res.extracted;
            remaining.push({ ...b, children: res.remaining });
          } else {
            remaining.push(b);
          }
        } else {
          remaining.push(b);
        }
      }
    }
    return { extracted, remaining };
  };

  // Insere um bloco na árvore relativa a um target
  const insertBlockIntoTree = (
    blocks: ScratchBlock[],
    blockToInsert: ScratchBlock,
    targetId: string,
    position: 'before' | 'after' | 'inside',
    targetParentId?: string
  ): ScratchBlock[] => {
    // 1. Caso 'inside': insere como filho direto do bloco contêiner targetId (independente de ter pai)
    if (position === 'inside') {
      const insertInsideRecursive = (list: ScratchBlock[]): ScratchBlock[] => {
        return list.map((b) => {
          if (b.id === targetId && (b.type === 'repeat' || b.type === 'if_path_ahead' || b.type === 'if_on_gem')) {
            return { ...b, children: [...(b.children || []), blockToInsert] };
          }
          if (b.children && b.children.length > 0) {
            return {
              ...b,
              children: insertInsideRecursive(b.children),
            };
          }
          return b;
        });
      };
      return insertInsideRecursive(blocks);
    }

    // 2. Caso 'before' ou 'after' com pai específico definido
    if (targetParentId) {
      const insertInParentRecursive = (list: ScratchBlock[]): ScratchBlock[] => {
        return list.map((b) => {
          if (b.id === targetParentId && b.children) {
            const idx = b.children.findIndex((c) => c.id === targetId);
            if (idx !== -1) {
              const insertIdx = position === 'before' ? idx : idx + 1;
              const nextChildren = [...b.children];
              nextChildren.splice(insertIdx, 0, blockToInsert);
              return { ...b, children: nextChildren };
            }
          }
          if (b.children && b.children.length > 0) {
            return {
              ...b,
              children: insertInParentRecursive(b.children),
            };
          }
          return b;
        });
      };
      return insertInParentRecursive(blocks);
    }

    // 3. Caso o target esteja na raiz de blocks
    const rootIdx = blocks.findIndex((b) => b.id === targetId);
    if (rootIdx !== -1) {
      let insertIdx = position === 'before' ? rootIdx : rootIdx + 1;
      if (targetId === 'flag-start' || position === 'before') {
        insertIdx = Math.max(1, insertIdx);
      }
      const next = [...blocks];
      next.splice(insertIdx, 0, blockToInsert);
      return next;
    }

    // 4. Se não encontrou na raiz e não tem targetParentId, procura recursivamente nos filhos
    return blocks.map((b) => {
      if (b.children && b.children.length > 0) {
        const childIdx = b.children.findIndex((c) => c.id === targetId);
        if (childIdx !== -1) {
          const insertIdx = position === 'before' ? childIdx : childIdx + 1;
          const nextChildren = [...b.children];
          nextChildren.splice(insertIdx, 0, blockToInsert);
          return { ...b, children: nextChildren };
        }
        return {
          ...b,
          children: insertBlockIntoTree(b.children, blockToInsert, targetId, position),
        };
      }
      return b;
    });
  };

  // Reordenação ou Inserção por Drop em bloco específico
  const handleDropOnBlock = (
    e: React.DragEvent,
    targetId: string,
    position: 'before' | 'after' | 'inside',
    targetParentId?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const rawData = e.dataTransfer.getData('text/plain');
    if (!rawData) return;

    scratchAudio.playBlockSnap();

    let dragData:
      | { source: 'palette'; type: BlockType }
      | { source: 'workspace'; blockId: string; parentId?: string };

    try {
      dragData = JSON.parse(rawData);
    } catch {
      dragData = { source: 'palette', type: rawData as BlockType };
    }

    // Caso 1: Bloco vindo da Paleta inserido exatamente na posição
    if (dragData.source === 'palette') {
      if (activeLevel.blockLimits && activeLevel.blockLimits[dragData.type] !== undefined) {
        const used = usedBlocksByType[dragData.type] || 0;
        const maxAllowed = activeLevel.blockLimits[dragData.type] || 0;
        if (used >= maxAllowed) {
          setFeedbackMessage(`Estoque esgotado! Esta fase permite no máximo ${maxAllowed} bloco(s) deste tipo.`);
          return;
        }
      }

      const categoryMap: Record<BlockType, ScratchBlock['category']> = {
        when_flag_clicked: 'events',
        move_forward: 'motion',
        turn_left: 'motion',
        turn_right: 'motion',
        repeat: 'control',
        collect_gem: 'actions',
        if_path_ahead: 'control',
        if_on_gem: 'control',
      };
      const isContainer =
        dragData.type === 'repeat' || dragData.type === 'if_path_ahead' || dragData.type === 'if_on_gem';
      const newBlock: ScratchBlock = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: dragData.type,
        category: categoryMap[dragData.type],
        paramValue: dragData.type === 'repeat' ? 2 : undefined,
        children: isContainer ? [] : undefined,
      };

      setScriptBlocks((prev) => insertBlockIntoTree(prev, newBlock, targetId, position, targetParentId));
      return;
    }

    // Caso 2: Bloco existente no workspace sendo reposicionado
    if (dragData.source === 'workspace') {
      const { blockId: sourceId } = dragData;
      if (sourceId === targetId) return; // Não faz nada se soltar nele mesmo
      if (sourceId === 'flag-start') return; // A bandeira verde não se move

      setScriptBlocks((prev) => {
        const { extracted, remaining } = extractBlock(prev, sourceId);
        if (!extracted) return prev;
        return insertBlockIntoTree(remaining, extracted, targetId, position, targetParentId);
      });
    }
  };

  // Contagem recursiva de blocos para estrelas
  const countBlocks = (blocks: ScratchBlock[]): number => {
    let count = 0;
    for (const b of blocks) {
      count++;
      if (b.children && b.children.length > 0) {
        count += countBlocks(b.children);
      }
    }
    return count;
  };

  const totalUsedBlocks = countBlocks(scriptBlocks);

  // ─────────────────────────────────────────────────────────────
  // 6. Interpretador Passo a Passo com Novas Mecânicas
  // ─────────────────────────────────────────────────────────────
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const turnDirection = (current: RobotDirection, side: 'left' | 'right'): RobotDirection => {
    const dirs: RobotDirection[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
    const idx = dirs.indexOf(current);
    if (side === 'left') {
      return dirs[(idx + 3) % 4];
    }
    return dirs[(idx + 1) % 4];
  };

  const getForwardCoord = (pos: GridCoord, dir: RobotDirection): GridCoord => {
    switch (dir) {
      case 'UP':
        return { x: pos.x, y: pos.y - 1 };
      case 'RIGHT':
        return { x: pos.x + 1, y: pos.y };
      case 'DOWN':
        return { x: pos.x, y: pos.y + 1 };
      case 'LEFT':
        return { x: pos.x - 1, y: pos.y };
    }
  };

  // Disparo centralizado de Vitória e Recompensas
  const triggerVictory = (collectedGemsCount: number) => {
    setHasReachedTarget(true);
    scratchAudio.playVictory();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Cálculo Justo de Estrelas
    let stars = 1;
    if (totalUsedBlocks <= activeLevel.maxBlocksFor3Stars) {
      stars = 3;
    } else if (totalUsedBlocks <= activeLevel.maxBlocksFor2Stars) {
      stars = 2;
    }
    setEarnedStarsThisLevel(stars);

    const earnedBytes = Math.round(activeLevel.baseRewardBytes * (stars / 3) * difficultyMultiplier);
    setTotalEarnedBytes((prev) => prev + earnedBytes);
    setStagesWonCount((prev) => prev + 1);

    if (gameMode === 'campaign') {
      const currentBest = saveData.completedLevels[activeLevel.id]?.stars || 0;
      const updatedLevels = {
        ...saveData.completedLevels,
        [activeLevel.id]: {
          stars: Math.max(currentBest, stars),
          bestBlocks: Math.min(
            saveData.completedLevels[activeLevel.id]?.bestBlocks || 999,
            totalUsedBlocks
          ),
        },
      };
      saveToStorage({
        ...saveData,
        completedLevels: updatedLevels,
        totalGemsCollected: saveData.totalGemsCollected + collectedGemsCount,
      });
    } else if (gameMode === 'bughunter') {
      const currentBest = saveData.completedBugLevels?.[activeLevel.id]?.stars || 0;
      const updatedBugLevels = {
        ...(saveData.completedBugLevels || {}),
        [activeLevel.id]: {
          stars: Math.max(currentBest, stars),
          bestBlocks: Math.min(
            saveData.completedBugLevels?.[activeLevel.id]?.bestBlocks || 999,
            totalUsedBlocks
          ),
        },
      };
      saveToStorage({
        ...saveData,
        completedBugLevels: updatedBugLevels,
        totalGemsCollected: saveData.totalGemsCollected + collectedGemsCount,
      });
    } else {
      const newStreak = infiniteStreak + 1;
      setInfiniteStreak(newStreak);
      saveToStorage({
        ...saveData,
        infiniteBestStreak: Math.max(saveData.infiniteBestStreak, newStreak),
        totalGemsCollected: saveData.totalGemsCollected + collectedGemsCount,
      });
    }

    setFeedbackMessage('Parabéns! Algoritmo executado com perfeição!');
    setTimeout(() => {
      setVictoryModalOpen(true);
    }, 600);
  };

  const runCode = async (stepMode: boolean = false) => {
    if (isRunning && !stepMode) return;

    if (!isRunning) {
      resetRobotToStart();
      await sleep(50);
      setIsRunning(true);
      setIsStepMode(stepMode);
      isExecutingRef.current = true;
      stopRequestedRef.current = false;
      setErrorBlockId(null);
    } else if (stepMode) {
      // Se já está rodando em modo passo, avança o próximo bloco
      if (stepResolverRef.current) {
        stepResolverRef.current();
        stepResolverRef.current = null;
      }
      return;
    }

    let curPos = { ...activeLevel.startPos };
    let curDir = activeLevel.startDir;
    let localCollected = new Set<string>();
    let localUnlockedGates = new Set<string>();
    let victoryAchieved = false;

    const waitStep = async () => {
      if (stepMode || isStepMode) {
        await new Promise<void>((resolve) => {
          stepResolverRef.current = resolve;
        });
        stepResolverRef.current = null;
      } else {
        await sleep(execSpeed);
      }
    };

    const executeBlockList = async (blocks: ScratchBlock[]): Promise<boolean> => {
      for (const block of blocks) {
        if (stopRequestedRef.current || victoryAchieved) return false;

        setActiveStepBlockId(block.id);

        if (block.type === 'move_forward') {
          const next = getForwardCoord(curPos, curDir);

          // Checa limite da grade
          if (
            next.x < 0 ||
            next.x >= activeLevel.gridSize.width ||
            next.y < 0 ||
            next.y >= activeLevel.gridSize.height
          ) {
            scratchAudio.playCollision();
            setHasCollided(true);
            setErrorBlockId(block.id);
            setFeedbackMessage('O Bytezinho tentou sair do circuito!');
            setTotalErrors((prev) => prev + 1);
            return false;
          }

          // Checa obstáculo fixo (Firewall)
          if (activeLevel.obstacles.some((o) => o.x === next.x && o.y === next.y)) {
            scratchAudio.playCollision();
            setHasCollided(true);
            setErrorBlockId(block.id);
            setFeedbackMessage('Colisão com uma parede de firewall!');
            setTotalErrors((prev) => prev + 1);
            return false;
          }

          // Checa portão a laser fechado
          const hitGate = activeLevel.gates?.find((g) => g.gateCoord.x === next.x && g.gateCoord.y === next.y);
          if (hitGate && !localUnlockedGates.has(`${hitGate.gateCoord.x},${hitGate.gateCoord.y}`)) {
            scratchAudio.playCollision();
            setHasCollided(true);
            setErrorBlockId(block.id);
            setFeedbackMessage('O portão a laser está trancado! Encontre a chave primeiro.');
            setTotalErrors((prev) => prev + 1);
            return false;
          }

          curPos = next;
          setRobotPos({ ...curPos });
          setPathHistory((prev) => [...prev, { ...curPos }]);
          scratchAudio.playStep();
          await waitStep();

          // 1. Interação com Chave Criptográfica (Passiva OnTileEnter)
          const hitKey = activeLevel.gates?.find((g) => g.keyCoord.x === curPos.x && g.keyCoord.y === curPos.y);
          if (hitKey) {
            const gateKeyStr = `${hitKey.gateCoord.x},${hitKey.gateCoord.y}`;
            if (!localUnlockedGates.has(gateKeyStr)) {
              localUnlockedGates.add(gateKeyStr);
              setUnlockedGates(new Set(localUnlockedGates));
              scratchAudio.playUnlockGate();
              setFeedbackMessage('Chave de acesso criptográfica ativada! O portão a laser abriu.');
            }
          }

          // 2. Interação com Teletransportador Quântico (Warp Pad) - estritamente unidirecional from -> to
          const hitTeleport = activeLevel.teleporters?.find((t) => t.from.x === curPos.x && t.from.y === curPos.y);
          if (hitTeleport) {
            scratchAudio.playTeleport();
            curPos = { ...hitTeleport.to };
            setRobotPos({ ...curPos });
            setPathHistory((prev) => [...prev, { ...curPos }]);
            setFeedbackMessage('Salto quântico realizado com sucesso!');
            await waitStep();
          }

          // 3. Interação com Esteira de Aceleração (Conveyor Belt) - OnTileEnter com cascata segura
          let conveyorHops = 0;
          while (conveyorHops < 4) {
            const hitConveyor = activeLevel.conveyors?.find((c) => c.coord.x === curPos.x && c.coord.y === curPos.y);
            if (!hitConveyor) break;

            const pushedNext = getForwardCoord(curPos, hitConveyor.direction);
            const isInside = pushedNext.x >= 0 && pushedNext.x < activeLevel.gridSize.width &&
                             pushedNext.y >= 0 && pushedNext.y < activeLevel.gridSize.height;
            const isObstacle = activeLevel.obstacles.some((o) => o.x === pushedNext.x && o.y === pushedNext.y);
            const isLockedGate = activeLevel.gates?.some((g) => g.gateCoord.x === pushedNext.x && g.gateCoord.y === pushedNext.y && !localUnlockedGates.has(`${g.gateCoord.x},${g.gateCoord.y}`));

            if (!isInside || isObstacle || isLockedGate) {
              scratchAudio.playCollision();
              setHasCollided(true);
              setErrorBlockId(block.id);
              setFeedbackMessage('A esteira impulsionou o Bytezinho contra um obstáculo!');
              setTotalErrors((prev) => prev + 1);
              return false;
            }

            scratchAudio.playConveyor();
            curPos = pushedNext;
            setRobotPos({ ...curPos });
            setPathHistory((prev) => [...prev, { ...curPos }]);
            setFeedbackMessage('A esteira de aceleração impulsionou o Bytezinho!');
            await waitStep();
            conveyorHops++;

            // Chave atingida via esteira
            const pushedKey = activeLevel.gates?.find((g) => g.keyCoord.x === curPos.x && g.keyCoord.y === curPos.y);
            if (pushedKey) {
              const gateKeyStr = `${pushedKey.gateCoord.x},${pushedKey.gateCoord.y}`;
              if (!localUnlockedGates.has(gateKeyStr)) {
                localUnlockedGates.add(gateKeyStr);
                setUnlockedGates(new Set(localUnlockedGates));
                scratchAudio.playUnlockGate();
                setFeedbackMessage('Chave ativada pelo impulso da esteira!');
              }
            }
          }

          // 4. Verificação de Vitória Imediata OnTileEnter (Interrompe o código restante)
          const isAtTarget = curPos.x === activeLevel.targetPos.x && curPos.y === activeLevel.targetPos.y;
          const allGemsGathered =
            !activeLevel.gems ||
            activeLevel.gems.length === 0 ||
            activeLevel.gems.every((g) => localCollected.has(`${g.x},${g.y}`));
          if (isAtTarget && allGemsGathered) {
            victoryAchieved = true;
            triggerVictory(localCollected.size);
            return true;
          }

        } else if (block.type === 'turn_left') {
          // Regra Rigorosa EMP: Ação sobre piso de choque causa curto-circuito
          if (activeLevel.hazards?.some((h) => h.x === curPos.x && h.y === curPos.y)) {
            scratchAudio.playShock();
            setHasCollided(true);
            setErrorBlockId(block.id);
            setFeedbackMessage('Sobrecarga elétrica! O Bytezinho realizou uma manobra sobre um piso EMP.');
            setTotalErrors((prev) => prev + 1);
            return false;
          }

          curDir = turnDirection(curDir, 'left');
          setRobotDir(curDir);
          scratchAudio.playTurn();
          await waitStep();

        } else if (block.type === 'turn_right') {
          // Regra Rigorosa EMP: Ação sobre piso de choque causa curto-circuito
          if (activeLevel.hazards?.some((h) => h.x === curPos.x && h.y === curPos.y)) {
            scratchAudio.playShock();
            setHasCollided(true);
            setErrorBlockId(block.id);
            setFeedbackMessage('Sobrecarga elétrica! O Bytezinho realizou uma manobra sobre um piso EMP.');
            setTotalErrors((prev) => prev + 1);
            return false;
          }

          curDir = turnDirection(curDir, 'right');
          setRobotDir(curDir);
          scratchAudio.playTurn();
          await waitStep();

        } else if (block.type === 'collect_gem') {
          // Regra Rigorosa EMP: Ação sobre piso de choque causa curto-circuito
          if (activeLevel.hazards?.some((h) => h.x === curPos.x && h.y === curPos.y)) {
            scratchAudio.playShock();
            setHasCollided(true);
            setErrorBlockId(block.id);
            setFeedbackMessage('Sobrecarga elétrica! O Bytezinho tentou minerar sobre um piso EMP.');
            setTotalErrors((prev) => prev + 1);
            return false;
          }

          const key = `${curPos.x},${curPos.y}`;
          const isRegularGem = activeLevel.gems?.some((g) => g.x === curPos.x && g.y === curPos.y);
          const isOptionalGem = activeLevel.optionalGems?.some((g) => g.x === curPos.x && g.y === curPos.y);
          if ((isRegularGem || isOptionalGem) && !localCollected.has(key)) {
            localCollected.add(key);
            setCollectedGems(new Set(localCollected));
            scratchAudio.playCollect();
            if (isOptionalGem) {
              setFeedbackMessage('⭐ Gema Estelar Coletada!');
            }
          } else {
            setFeedbackMessage('Não há gema nesta posição para coletar.');
          }
          await waitStep();

          // Checa se coletar a última gema sobre o portal concluiu a fase
          const isAtTarget = curPos.x === activeLevel.targetPos.x && curPos.y === activeLevel.targetPos.y;
          const allGemsGathered =
            !activeLevel.gems ||
            activeLevel.gems.length === 0 ||
            activeLevel.gems.every((g) => localCollected.has(`${g.x},${g.y}`));
          if (isAtTarget && allGemsGathered) {
            victoryAchieved = true;
            triggerVictory(localCollected.size);
            return true;
          }

        } else if (block.type === 'repeat') {
          const times = block.paramValue || 2;
          const children = block.children || [];
          for (let i = 0; i < times; i++) {
            if (stopRequestedRef.current || victoryAchieved) return false;
            const ok = await executeBlockList(children);
            if (!ok || victoryAchieved) return false;

            // Regra Rigorosa EMP: Repouso no final de cada iteração do laço causa curto-circuito
            if (activeLevel.hazards?.some((h) => h.x === curPos.x && h.y === curPos.y)) {
              scratchAudio.playShock();
              setHasCollided(true);
              setErrorBlockId(block.id);
              setFeedbackMessage('Sobrecarga elétrica! O Bytezinho repousou sobre um piso EMP no fim da repetição.');
              setTotalErrors((prev) => prev + 1);
              return false;
            }
          }

        } else if (block.type === 'if_path_ahead') {
          const next = getForwardCoord(curPos, curDir);
          const isInside =
            next.x >= 0 &&
            next.x < activeLevel.gridSize.width &&
            next.y >= 0 &&
            next.y < activeLevel.gridSize.height;
          const isObstacle = activeLevel.obstacles.some((o) => o.x === next.x && o.y === next.y);
          const hitGate = activeLevel.gates?.find((g) => g.gateCoord.x === next.x && g.gateCoord.y === next.y);
          const isLockedGate = hitGate && !localUnlockedGates.has(`${hitGate.gateCoord.x},${hitGate.gateCoord.y}`);
          const pathClear = isInside && !isObstacle && !isLockedGate;

          if (pathClear && block.children && block.children.length > 0) {
            const ok = await executeBlockList(block.children);
            if (!ok || victoryAchieved) return false;
          }

        } else if (block.type === 'if_on_gem') {
          const key = `${curPos.x},${curPos.y}`;
          const isHere =
            (activeLevel.gems?.some((g) => g.x === curPos.x && g.y === curPos.y) ||
              activeLevel.optionalGems?.some((g) => g.x === curPos.x && g.y === curPos.y)) &&
            !localCollected.has(key);

          if (isHere && block.children && block.children.length > 0) {
            const ok = await executeBlockList(block.children);
            if (!ok || victoryAchieved) return false;
          }
        }
      }
      return true;
    };

    const scriptToRun = scriptBlocks.filter((b) => b.type !== 'when_flag_clicked');
    const successExec = await executeBlockList(scriptToRun);

    setActiveStepBlockId(null);
    setIsRunning(false);
    setIsStepMode(false);
    isExecutingRef.current = false;

    if (!stopRequestedRef.current && successExec && !victoryAchieved) {
      // Checa se Bytezinho encerrou o programa sobre um piso de sobrecarga elétrica (EMP)
      const isOverHazard = activeLevel.hazards?.some((h) => h.x === curPos.x && h.y === curPos.y);
      if (isOverHazard) {
        scratchAudio.playShock();
        setHasCollided(true);
        setErrorBlockId(scriptToRun[scriptToRun.length - 1]?.id || null);
        setFeedbackMessage('Sobrecarga elétrica! O Bytezinho encerrou o programa sobre um piso EMP.');
        setTotalErrors((prev) => prev + 1);
        return;
      }

      const isAtTarget = curPos.x === activeLevel.targetPos.x && curPos.y === activeLevel.targetPos.y;
      const allGemsGathered =
        !activeLevel.gems ||
        activeLevel.gems.length === 0 ||
        activeLevel.gems.every((g) => localCollected.has(`${g.x},${g.y}`));

      if (isAtTarget && allGemsGathered) {
        triggerVictory(localCollected.size);
      } else if (isAtTarget && !allGemsGathered) {
        setFeedbackMessage('Você alcançou o portal, mas esqueceu de coletar todas as gemas!');
        setTotalErrors((prev) => prev + 1);
      } else {
        setFeedbackMessage('A execução terminou antes do Bytezinho alcançar o portal.');
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 7. Saída Oficial do Plug-in via BaseGameProps
  // ─────────────────────────────────────────────────────────────
  const handleExitGame = () => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - sessionStartTime.current) / 1000));
    const totalAttempts = stagesWonCount + totalErrors;
    const accuracy = totalAttempts > 0 ? Math.round((stagesWonCount / totalAttempts) * 100) : 100;

    const payload: GameExitPayload = {
      bytesEarned: totalEarnedBytes,
      levelTokensEarned: earnedStarsThisLevel === 3 && stagesWonCount >= 1 ? 1 : 0,
      sessionStats: {
        score: totalEarnedBytes,
        accuracyPercentage: accuracy,
        timeSpentSeconds: elapsedSeconds,
        correctAnswers: stagesWonCount,
        wrongAnswers: totalErrors,
        levelReached: gameMode === 'campaign' ? currentLevelIndex + 1 : infiniteSeed,
        extraMetrics: {
          gameMode,
          infiniteStreak,
          studentClass,
        },
      },
    };

    onExitToHub(payload);
  };

  // Drag and Drop Nativo da Paleta
  const handleDragStartPalette = (e: React.DragEvent, type: BlockType) => {
    const payload = JSON.stringify({ source: 'palette', type });
    e.dataTransfer.setData('text/plain', payload);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDropWorkspace = (e: React.DragEvent) => {
    e.preventDefault();
    const rawData = e.dataTransfer.getData('text/plain');
    if (!rawData) return;

    scratchAudio.playBlockSnap();

    let dragData:
      | { source: 'palette'; type: BlockType }
      | { source: 'workspace'; blockId: string; parentId?: string };

    try {
      dragData = JSON.parse(rawData);
    } catch {
      dragData = { source: 'palette', type: rawData as BlockType };
    }

    if (dragData.source === 'palette') {
      addBlockToWorkspace(dragData.type);
    } else if (dragData.source === 'workspace') {
      const { blockId: sourceId } = dragData;
      if (sourceId === 'flag-start') return;

      setScriptBlocks((prev) => {
        const { extracted, remaining } = extractBlock(prev, sourceId);
        if (!extracted) return prev;
        return [...remaining, extracted];
      });
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0c12] text-zinc-100 font-sans select-none">
      {/* ── BARRA SUPERIOR DE CABEÇALHO ── */}
      <header className="h-14 px-4 bg-[#10131d] border-b border-zinc-800 flex items-center justify-between shrink-0 gap-3 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExitGame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 font-bold text-xs transition cursor-pointer"
            title="Salvar progresso e retornar ao Hub"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Hub</span>
          </button>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-400" />
            <div>
              <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                <span>ScratchBot: Logic Quest</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  gameMode === 'campaign'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : gameMode === 'bughunter'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                }`}>
                  {gameMode === 'campaign'
                    ? `Fase ${activeLevel.id}`
                    : gameMode === 'bughunter'
                    ? `Bug #${activeLevel.id}`
                    : `Infinito #${infiniteSeed}`}
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Alternador de Modo: Trilha Pedagógica vs Caça aos Bugs vs Modo Infinito */}
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900/90 border border-zinc-800 p-0.5 rounded-xl flex items-center text-xs font-mono font-bold flex-wrap">
            <button
              type="button"
              onClick={() => {
                setGameMode('campaign');
                resetRobotToStart();
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                gameMode === 'campaign'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Trilha ({PEDAGOGICAL_LEVELS.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setGameMode('bughunter');
                resetRobotToStart();
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                gameMode === 'bughunter'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>Bugs ({BUG_HUNTER_LEVELS.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setGameMode('infinite');
                resetRobotToStart();
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                gameMode === 'infinite'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <InfinityIcon className="w-3.5 h-3.5" />
              <span>Infinito</span>
            </button>
          </div>

          {/* Saldo de Bytes ganhos na sessão */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/40 border border-emerald-500/30 font-mono text-xs text-emerald-400 font-bold">
            <span>+{totalEarnedBytes} Bytes</span>
          </div>
        </div>
      </header>

      {/* ── CORPO PRINCIPAL COM 3 COLUNAS ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* COLUNA 1: PALETA DE BLOCOS (COMPACTA) */}
        <div className="w-full lg:w-56 bg-[#0d0f17] border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col shrink-0 p-3 overflow-y-auto">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Paleta de Blocos
            </span>
            <span className="text-[9px] text-zinc-500 font-mono">Arraste ou clique</span>
          </div>

          <div className="space-y-1.5">
            {activeLevel.availableBlockTypes.map((type) => {
              const labelMap: Record<BlockType, { title: string; color: string; icon: React.ReactNode }> = {
                when_flag_clicked: { title: 'Quando bandeira', color: 'bg-amber-500', icon: <Flag className="w-3 h-3 fill-current" /> },
                move_forward: { title: 'Mova 1 passo', color: 'bg-sky-500', icon: <ArrowUp className="w-3 h-3" /> },
                turn_left: { title: 'Gire esquerda', color: 'bg-sky-500', icon: <RotateCcw className="w-3 h-3" /> },
                turn_right: { title: 'Gire direita', color: 'bg-sky-500', icon: <RotateCw className="w-3 h-3" /> },
                repeat: { title: 'Repita N vezes', color: 'bg-orange-500', icon: <Repeat className="w-3 h-3" /> },
                collect_gem: { title: 'Coletar Gema', color: 'bg-purple-500', icon: <Diamond className="w-3 h-3" /> },
                if_path_ahead: { title: 'Se caminho à frente', color: 'bg-amber-600', icon: <Compass className="w-3 h-3" /> },
                if_on_gem: { title: 'Se sobre gema', color: 'bg-amber-600', icon: <Diamond className="w-3 h-3" /> },
              };
              const item = labelMap[type];
              const limit = activeLevel.blockLimits?.[type];
              const used = usedBlocksByType[type] || 0;
              const isExhausted = limit !== undefined && used >= limit;

              return (
                <div
                  key={type}
                  draggable={!isExhausted}
                  onDragStart={(e) => !isExhausted && handleDragStartPalette(e, type)}
                  onClick={() => !isExhausted && addBlockToWorkspace(type)}
                  className={`px-2.5 py-2 rounded-xl text-white font-mono text-xs font-bold shadow-md transition-all flex items-center justify-between border border-white/10 ${
                    isExhausted
                      ? 'bg-zinc-800 text-zinc-500 border-zinc-700/50 opacity-50 cursor-not-allowed'
                      : `cursor-grab active:cursor-grabbing hover:scale-[1.02] ${item.color}`
                  }`}
                  title={isExhausted ? `Limite de ${limit} blocos deste tipo atingido nesta fase.` : undefined}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span>{item.icon}</span>
                    <span className="text-[11px] truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {limit !== undefined && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                        isExhausted ? 'bg-rose-950 text-rose-400 border border-rose-500/40' : 'bg-black/30 text-white/90'
                      }`}>
                        {limit - used} rest.
                      </span>
                    )}
                    <span className="text-white/60 text-xs font-black">+</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dica da Fase */}
          {activeLevel.tip && (
            <div className="mt-auto pt-3">
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">{activeLevel.tip}</p>
              </div>
            </div>
          )}
        </div>

        {/* COLUNA 2: WORKSPACE DE BLOCOS (SCRIPTS - LARGURA FIXA OTIMIZADA) */}
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropWorkspace}
          className="w-full lg:w-80 xl:w-96 bg-[#121520] border-b lg:border-b-0 lg:border-r border-zinc-800 flex flex-col shrink-0 overflow-hidden"
        >
          {/* Barra de Ações do Workspace */}
          <div className="p-2.5 bg-[#151926] border-b border-zinc-800 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              {/* Botão Bandeira Verde (Executar) */}
              <button
                type="button"
                disabled={isRunning && !isStepMode}
                onClick={() => runCode(false)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black font-mono text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer active:scale-95"
              >
                <Flag className="w-3.5 h-3.5 fill-current text-black" />
                <span>EXECUTAR</span>
              </button>

              {/* Botão Passo a Passo (Debug) */}
              <button
                type="button"
                onClick={() => runCode(true)}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold font-mono text-xs flex items-center gap-1 transition cursor-pointer active:scale-95"
                title="Executar próximo bloco (Passo a Passo / Debug)"
              >
                <StepForward className="w-3.5 h-3.5" />
                <span>PASSO</span>
              </button>

              {/* Botão Parar / Resetar */}
              <button
                type="button"
                onClick={resetRobotToStart}
                className="p-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-400 transition cursor-pointer active:scale-95"
                title="Parar e resetar posição do Bytezinho"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* Contador de Blocos & Meta de Estrelas */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 border border-zinc-800 text-[11px]">
                <span className="text-zinc-400">Blocos:</span>
                <span className={`font-bold ${
                  totalUsedBlocks <= activeLevel.maxBlocksFor3Stars
                    ? 'text-emerald-400'
                    : totalUsedBlocks <= activeLevel.maxBlocksFor2Stars
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}>
                  {totalUsedBlocks}
                </span>
                <span className="text-zinc-500 flex items-center gap-0.5">
                  / 3 <Sparkles className="w-2.5 h-2.5 text-amber-400 inline" />: ≤{activeLevel.maxBlocksFor3Stars}
                </span>
              </div>
            </div>
          </div>

          {/* Pilha de Blocos */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2">
            {scriptBlocks.map((block, index) => (
              <ScratchBlockItem
                key={block.id}
                block={block}
                index={index}
                totalInGroup={scriptBlocks.length}
                activeBlockId={activeStepBlockId}
                errorBlockId={errorBlockId}
                onRemove={removeBlock}
                onUpdateParam={updateBlockParam}
                onRemoveChild={removeChildBlock}
                onAddChild={(parentId, type) => addBlockToWorkspace(type, parentId)}
                onMoveRelative={moveBlockRelative}
                onDropOnBlock={handleDropOnBlock}
                availableBlockTypes={activeLevel.availableBlockTypes}
              />
            ))}

            {scriptBlocks.length === 1 && (
              <div className="p-5 border-2 border-dashed border-zinc-700/60 rounded-2xl text-center text-zinc-500 text-xs font-mono">
                Arraste blocos da paleta à esquerda ou clique neles para montar seu código!
              </div>
            )}
          </div>
        </div>

        {/* COLUNA 3: STAGE DO BYTEZINHO (PALCO EXPANDIDO - MAIOR ÁREA DA TELA) */}
        <div className="flex-1 min-w-0 bg-[#0d0f17] flex flex-col p-4 sm:p-6 overflow-y-auto">
          {/* Card Especial de Depuração no Modo Bug Hunter */}
          {gameMode === 'bughunter' && activeLevel.bugDescription && (
            <div className="mb-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-start gap-2.5 shadow-lg animate-fade-in max-w-3xl">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                <Bug className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                  <span>Missão de Depuração: Encontre e Corrija o Bug</span>
                </span>
                <p className="text-xs text-amber-100 font-mono mt-0.5 leading-relaxed">
                  {activeLevel.bugDescription}
                </p>
              </div>
            </div>
          )}

          {/* Descrição da Fase */}
          <div className="mb-3 max-w-3xl">
            <h2 className="text-base font-bold text-white flex items-center justify-between">
              <span>{activeLevel.title}</span>
              <span className="text-xs font-mono text-zinc-400">{activeLevel.subtitle}</span>
            </h2>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              {activeLevel.description}
            </p>
          </div>

          {/* Feedback ou Erro de Execução */}
          {feedbackMessage && (
            <div className={`p-2.5 rounded-xl border text-xs font-mono mb-3 max-w-3xl animate-fade-in ${
              hasCollided 
                ? 'bg-rose-950/50 border-rose-500/50 text-rose-300' 
                : hasReachedTarget
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-blue-950/50 border-blue-500/50 text-blue-300'
            }`}>
              {feedbackMessage}
            </div>
          )}

          {/* Canvas da Grade - Centralizado e com escala máxima */}
          <div className="flex-1 flex items-center justify-center min-h-[360px] py-2">
            <ScratchBoardCanvas
              gridSize={activeLevel.gridSize}
              robotPos={robotPos}
              robotDir={robotDir}
              targetPos={activeLevel.targetPos}
              obstacles={activeLevel.obstacles}
              gems={activeLevel.gems}
              optionalGems={activeLevel.optionalGems}
              hazards={activeLevel.hazards}
              teleporters={activeLevel.teleporters}
              conveyors={activeLevel.conveyors}
              gates={activeLevel.gates}
              unlockedGates={unlockedGates}
              collectedGems={collectedGems}
              hasCollided={hasCollided}
              hasReachedTarget={hasReachedTarget}
              pathHistory={pathHistory}
              equippedSkin={equippedSkin}
            />
          </div>

          {/* Seletor de Fases da Campanha */}
          {gameMode === 'campaign' && (
            <div className="mt-4 pt-3 border-t border-zinc-800/80 max-w-3xl">
              <span className="text-[11px] font-mono text-zinc-400 block mb-2 font-bold uppercase">
                Trilha de Fases
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {PEDAGOGICAL_LEVELS.map((lvl, idx) => {
                  const isCur = idx === currentLevelIndex;
                  const stars = saveData.completedLevels[lvl.id]?.stars || 0;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setCurrentLevelIndex(idx)}
                      className={`p-1.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center transition cursor-pointer ${
                        isCur
                          ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                          : stars > 0
                          ? 'bg-zinc-800/80 border-emerald-500/40 text-emerald-300 hover:bg-zinc-700'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>{lvl.id}</span>
                      <span className="text-[9px] text-amber-300 flex items-center justify-center gap-0.5">
                        {stars > 0 ? (
                          Array.from({ length: stars }).map((_, i) => (
                            <Star key={i} className="w-2 h-2 fill-amber-400 text-amber-400" />
                          ))
                        ) : (
                          '•'
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Seletor de Níveis do Modo Caça aos Bugs */}
          {gameMode === 'bughunter' && (
            <div className="mt-4 pt-3 border-t border-zinc-800/80 max-w-3xl">
              <span className="text-[11px] font-mono text-amber-400 block mb-2 font-bold uppercase flex items-center gap-1.5">
                <Bug className="w-3.5 h-3.5" />
                <span>Níveis de Depuração (Bug Hunter)</span>
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {BUG_HUNTER_LEVELS.map((lvl, idx) => {
                  const isCur = idx === currentBugLevelIndex;
                  const stars = saveData.completedBugLevels?.[lvl.id]?.stars || 0;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setCurrentBugLevelIndex(idx)}
                      className={`p-1.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center transition cursor-pointer ${
                        isCur
                          ? 'bg-amber-600 border-amber-400 text-white shadow-md'
                          : stars > 0
                          ? 'bg-zinc-800/80 border-amber-500/40 text-amber-300 hover:bg-zinc-700'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>Bug {lvl.id}</span>
                      <span className="text-[9px] text-amber-300 flex items-center justify-center gap-0.5">
                        {stars > 0 ? (
                          Array.from({ length: stars }).map((_, i) => (
                            <Star key={i} className="w-2 h-2 fill-amber-400 text-amber-400" />
                          ))
                        ) : (
                          '•'
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ── MODAL DE VITÓRIA / PRÓXIMA FASE ── */}
      {victoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#131622] border-2 border-emerald-500/60 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
              <Trophy className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white font-mono">
                {gameMode === 'campaign'
                  ? 'FASE CONCLUÍDA!'
                  : gameMode === 'bughunter'
                  ? 'BUG DEPURADO COM SUCESSO!'
                  : 'CIRCUITO SUPERADO!'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {gameMode === 'bughunter'
                  ? 'Você encontrou e corrigiu a falha lógica no algoritmo!'
                  : 'O Bytezinho alcançou o portal de dados com sucesso!'}
              </p>
            </div>

            {/* Estrelas */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-7 h-7 ${s <= earnedStarsThisLevel ? 'fill-amber-400 text-amber-400 drop-shadow' : 'text-zinc-700'}`}
                />
              ))}
            </div>

            <div className="w-full py-2.5 px-4 rounded-xl bg-black/40 border border-zinc-800 font-mono text-xs flex items-center justify-between">
              <span className="text-zinc-400">Blocos Utilizados:</span>
              <span className="text-white font-bold">{totalUsedBlocks}</span>
            </div>

            <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 font-mono text-xs flex items-center justify-between">
              <span className="text-emerald-300">Recompensa:</span>
              <span className="text-emerald-400 font-bold">
                +{Math.round(activeLevel.baseRewardBytes * (earnedStarsThisLevel / 3) * difficultyMultiplier)} Bytes
              </span>
            </div>

            <div className="flex items-center gap-3 w-full mt-2">
              <button
                type="button"
                onClick={() => setVictoryModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold transition cursor-pointer"
              >
                Revisar
              </button>

              <button
                type="button"
                onClick={() => {
                  setVictoryModalOpen(false);
                  if (gameMode === 'campaign') {
                    if (currentLevelIndex < PEDAGOGICAL_LEVELS.length - 1) {
                      setCurrentLevelIndex((prev) => prev + 1);
                    }
                  } else if (gameMode === 'bughunter') {
                    if (currentBugLevelIndex < BUG_HUNTER_LEVELS.length - 1) {
                      setCurrentBugLevelIndex((prev) => prev + 1);
                    }
                  } else {
                    setInfiniteSeed((prev) => prev + 1);
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-black transition cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
              >
                <span>Próxima Fase</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScratchBotGame;
