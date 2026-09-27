import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  Flag, 
  Square, 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Star, 
  ChevronRight, 
  Lightbulb, 
  Layers,
  Infinity as InfinityIcon,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award
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
  const [gameMode, setGameMode] = useState<'campaign' | 'infinite'>('campaign');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
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
    return gameMode === 'campaign'
      ? PEDAGOGICAL_LEVELS[currentLevelIndex] || PEDAGOGICAL_LEVELS[0]
      : generateProceduralLevel(infiniteSeed);
  }, [gameMode, currentLevelIndex, infiniteSeed]);

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

  // ─────────────────────────────────────────────────────────────
  // 3. Área de Scripts (Workspace)
  // ─────────────────────────────────────────────────────────────
  const [scriptBlocks, setScriptBlocks] = useState<ScratchBlock[]>([
    { id: 'flag-start', type: 'when_flag_clicked', category: 'events' },
  ]);

  const [activeStepBlockId, setActiveStepBlockId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
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

  useEffect(() => {
    return () => {
      stopRequestedRef.current = true;
      scratchAudio.cleanup();
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 4. Reinicialização de Fase
  // ─────────────────────────────────────────────────────────────
  const resetRobotToStart = useCallback(() => {
    stopRequestedRef.current = true;
    setIsRunning(false);
    setActiveStepBlockId(null);
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
    setScriptBlocks([{ id: 'flag-start', type: 'when_flag_clicked', category: 'events' }]);
  }, [currentLevelIndex, gameMode, infiniteSeed, resetRobotToStart]);

  // ─────────────────────────────────────────────────────────────
  // 5. Adição e Remoção de Blocos
  // ─────────────────────────────────────────────────────────────
  const addBlockToWorkspace = (type: BlockType, parentId?: string) => {
    scratchAudio.playBlockSnap();

    const categoryMap: Record<BlockType, ScratchBlock['category']> = {
      when_flag_clicked: 'events',
      move_forward: 'motion',
      turn_left: 'motion',
      turn_right: 'motion',
      repeat: 'control',
      collect_gem: 'actions',
    };

    const newBlock: ScratchBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      category: categoryMap[type],
      paramValue: type === 'repeat' ? 2 : undefined,
      children: type === 'repeat' ? [] : undefined,
    };

    if (parentId) {
      setScriptBlocks((prev) =>
        prev.map((b) => {
          if (b.id === parentId && b.type === 'repeat') {
            return { ...b, children: [...(b.children || []), newBlock] };
          }
          return b;
        })
      );
    } else {
      setScriptBlocks((prev) => [...prev, newBlock]);
    }
  };

  const removeBlock = (id: string) => {
    scratchAudio.playBlockSnap();
    setScriptBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const removeChildBlock = (parentId: string, childId: string) => {
    scratchAudio.playBlockSnap();
    setScriptBlocks((prev) =>
      prev.map((b) => {
        if (b.id === parentId && b.children) {
          return { ...b, children: b.children.filter((c) => c.id !== childId) };
        }
        return b;
      })
    );
  };

  const updateBlockParam = (id: string, value: number) => {
    setScriptBlocks((prev) =>
      prev.map((b) => {
        if (b.id === id) return { ...b, paramValue: value };
        if (b.children) {
          return {
            ...b,
            children: b.children.map((c) => (c.id === id ? { ...c, paramValue: value } : c)),
          };
        }
        return b;
      })
    );
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

  const runCode = async () => {
    if (isRunning) return;

    resetRobotToStart();
    await sleep(50);

    setIsRunning(true);
    isExecutingRef.current = true;
    stopRequestedRef.current = false;

    let curPos = { ...activeLevel.startPos };
    let curDir = activeLevel.startDir;
    let localCollected = new Set<string>();
    let localUnlockedGates = new Set<string>();

    const executeBlockList = async (blocks: ScratchBlock[]): Promise<boolean> => {
      for (const block of blocks) {
        if (stopRequestedRef.current) return false;

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
            setFeedbackMessage('💥 O Bytezinho tentou sair do circuito!');
            setTotalErrors((prev) => prev + 1);
            return false;
          }

          // Checa obstáculo fixo (Firewall)
          if (activeLevel.obstacles.some((o) => o.x === next.x && o.y === next.y)) {
            scratchAudio.playCollision();
            setHasCollided(true);
            setFeedbackMessage('🧱 Colisão com uma parede de firewall!');
            setTotalErrors((prev) => prev + 1);
            return false;
          }

          // Checa portão a laser fechado
          const hitGate = activeLevel.gates?.find((g) => g.gateCoord.x === next.x && g.gateCoord.y === next.y);
          if (hitGate && !localUnlockedGates.has(`${hitGate.gateCoord.x},${hitGate.gateCoord.y}`)) {
            scratchAudio.playCollision();
            setHasCollided(true);
            setFeedbackMessage('🔒 O portão a laser está trancado! Encontre a chave primeiro.');
            setTotalErrors((prev) => prev + 1);
            return false;
          }

          curPos = next;
          setRobotPos({ ...curPos });
          setPathHistory((prev) => [...prev, { ...curPos }]);
          scratchAudio.playStep();
          await sleep(execSpeed);

          // 1. Interação com Chave Criptográfica
          const hitKey = activeLevel.gates?.find((g) => g.keyCoord.x === curPos.x && g.keyCoord.y === curPos.y);
          if (hitKey) {
            const gateKeyStr = `${hitKey.gateCoord.x},${hitKey.gateCoord.y}`;
            if (!localUnlockedGates.has(gateKeyStr)) {
              localUnlockedGates.add(gateKeyStr);
              setUnlockedGates(new Set(localUnlockedGates));
              scratchAudio.playUnlockGate();
              setFeedbackMessage('🔓 Chave de acesso criptográfica ativada! O portão a laser abriu.');
              await sleep(150);
            }
          }

          // 2. Interação com Teletransportador Quântico (Warp Pad)
          const hitTeleport = activeLevel.teleporters?.find((t) => t.from.x === curPos.x && t.from.y === curPos.y);
          if (hitTeleport) {
            scratchAudio.playTeleport();
            curPos = { ...hitTeleport.to };
            setRobotPos({ ...curPos });
            setPathHistory((prev) => [...prev, { ...curPos }]);
            setFeedbackMessage('🌀 Salto quântico realizado com sucesso!');
            await sleep(execSpeed);
          }

          // 3. Interação com Esteira de Aceleração (Conveyor Belt)
          const hitConveyor = activeLevel.conveyors?.find((c) => c.coord.x === curPos.x && c.coord.y === curPos.y);
          if (hitConveyor) {
            const pushedNext = getForwardCoord(curPos, hitConveyor.direction);
            // Verifica limites e obstáculos na saída da esteira
            const isInside = pushedNext.x >= 0 && pushedNext.x < activeLevel.gridSize.width &&
                             pushedNext.y >= 0 && pushedNext.y < activeLevel.gridSize.height;
            const isObstacle = activeLevel.obstacles.some((o) => o.x === pushedNext.x && o.y === pushedNext.y);
            if (isInside && !isObstacle) {
              scratchAudio.playConveyor();
              curPos = pushedNext;
              setRobotPos({ ...curPos });
              setPathHistory((prev) => [...prev, { ...curPos }]);
              setFeedbackMessage('💨 A esteira de aceleração impulsionou o Bytezinho!');
              await sleep(execSpeed);
            }
          }

        } else if (block.type === 'turn_left') {
          curDir = turnDirection(curDir, 'left');
          setRobotDir(curDir);
          scratchAudio.playTurn();
          await sleep(execSpeed);
        } else if (block.type === 'turn_right') {
          curDir = turnDirection(curDir, 'right');
          setRobotDir(curDir);
          scratchAudio.playTurn();
          await sleep(execSpeed);
        } else if (block.type === 'collect_gem') {
          const key = `${curPos.x},${curPos.y}`;
          const isHere = activeLevel.gems?.some((g) => g.x === curPos.x && g.y === curPos.y);
          if (isHere && !localCollected.has(key)) {
            localCollected.add(key);
            setCollectedGems(new Set(localCollected));
            scratchAudio.playCollect();
          } else {
            setFeedbackMessage('⚠️ Não há gema nesta posição para coletar.');
          }
          await sleep(execSpeed);
        } else if (block.type === 'repeat') {
          const times = block.paramValue || 2;
          const children = block.children || [];
          for (let i = 0; i < times; i++) {
            if (stopRequestedRef.current) return false;
            const ok = await executeBlockList(children);
            if (!ok) return false;
          }
        }
      }
      return true;
    };

    const scriptToRun = scriptBlocks.filter((b) => b.type !== 'when_flag_clicked');
    const successExec = await executeBlockList(scriptToRun);

    setActiveStepBlockId(null);
    setIsRunning(false);
    isExecutingRef.current = false;

    if (!stopRequestedRef.current && successExec) {
      // Checa se Bytezinho parou sobre um piso de sobrecarga elétrica (EMP)
      const isOverHazard = activeLevel.hazards?.some((h) => h.x === curPos.x && h.y === curPos.y);
      if (isOverHazard) {
        scratchAudio.playShock();
        setHasCollided(true);
        setFeedbackMessage('⚡ Sobrecarga elétrica! O Bytezinho parou sobre um piso EMP energizado.');
        setTotalErrors((prev) => prev + 1);
        return;
      }

      const isAtTarget =
        curPos.x === activeLevel.targetPos.x && curPos.y === activeLevel.targetPos.y;
      const allGemsGathered =
        !activeLevel.gems || activeLevel.gems.length === 0 || localCollected.size === activeLevel.gems.length;

      if (isAtTarget && allGemsGathered) {
        // Vitória!
        setHasReachedTarget(true);
        scratchAudio.playVictory();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Cálculo de Estrelas
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

        // Atualiza saveData
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
            totalGemsCollected: saveData.totalGemsCollected + localCollected.size,
          });
        } else {
          const newStreak = infiniteStreak + 1;
          setInfiniteStreak(newStreak);
          saveToStorage({
            ...saveData,
            infiniteBestStreak: Math.max(saveData.infiniteBestStreak, newStreak),
            totalGemsCollected: saveData.totalGemsCollected + localCollected.size,
          });
        }

        setFeedbackMessage('🎉 Parabéns! Algoritmo executado com perfeição!');
        setVictoryModalOpen(true);
      } else if (isAtTarget && !allGemsGathered) {
        setFeedbackMessage('⚠️ Você alcançou o portal, mas esqueceu de coletar todas as gemas!');
        setTotalErrors((prev) => prev + 1);
      } else {
        setFeedbackMessage('🏁 A execução terminou antes do Bytezinho alcançar o portal.');
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

  // Drag and Drop Nativo
  const handleDragStartPalette = (e: React.DragEvent, type: BlockType) => {
    e.dataTransfer.setData('text/plain', type);
  };

  const handleDropWorkspace = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain') as BlockType;
    if (type) {
      addBlockToWorkspace(type);
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
            <span className="text-xl">🤖</span>
            <div>
              <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                <span>ScratchBot: Logic Quest</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold">
                  {gameMode === 'campaign' ? `Fase ${activeLevel.id}` : `Infinito #${infiniteSeed}`}
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Alternador de Modo: Trilha Pedagógica vs Modo Infinito */}
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900/90 border border-zinc-800 p-0.5 rounded-xl flex items-center text-xs font-mono font-bold">
            <button
              type="button"
              onClick={() => {
                setGameMode('campaign');
                resetRobotToStart();
              }}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                gameMode === 'campaign'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Trilha (1 a 8)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setGameMode('infinite');
                resetRobotToStart();
              }}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                gameMode === 'infinite'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <InfinityIcon className="w-3.5 h-3.5" />
              <span>Desafio Infinito</span>
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
              const labelMap: Record<BlockType, { title: string; color: string; icon: string }> = {
                when_flag_clicked: { title: 'Quando ⚑ clicado', color: 'bg-amber-500', icon: '⚑' },
                move_forward: { title: 'Mova 1 passo', color: 'bg-sky-500', icon: '⬆' },
                turn_left: { title: 'Gire ↺ esquerda', color: 'bg-sky-500', icon: '↺' },
                turn_right: { title: 'Gire ↻ direita', color: 'bg-sky-500', icon: '↻' },
                repeat: { title: 'Repita N vezes', color: 'bg-orange-500', icon: '🔁' },
                collect_gem: { title: 'Coletar Gema', color: 'bg-purple-500', icon: '💎' },
              };
              const item = labelMap[type];

              return (
                <div
                  key={type}
                  draggable
                  onDragStart={(e) => handleDragStartPalette(e, type)}
                  onClick={() => addBlockToWorkspace(type)}
                  className={`px-2.5 py-2 rounded-xl text-white font-mono text-xs font-bold shadow-md cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform flex items-center justify-between border border-white/10 ${item.color}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{item.icon}</span>
                    <span className="text-[11px]">{item.title}</span>
                  </div>
                  <span className="text-white/60 text-xs font-black">+</span>
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
                disabled={isRunning}
                onClick={runCode}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black font-mono text-xs flex items-center gap-1.5 shadow-lg transition cursor-pointer active:scale-95"
              >
                <Flag className="w-3.5 h-3.5 fill-current text-black" />
                <span>EXECUTAR</span>
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
                <span className="text-zinc-500">/ 3★: ≤{activeLevel.maxBlocksFor3Stars}</span>
              </div>
            </div>
          </div>

          {/* Pilha de Blocos */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2">
            {scriptBlocks.map((block) => (
              <ScratchBlockItem
                key={block.id}
                block={block}
                activeBlockId={activeStepBlockId}
                onRemove={removeBlock}
                onUpdateParam={updateBlockParam}
                onRemoveChild={removeChildBlock}
                onAddChild={(parentId, type) => addBlockToWorkspace(type, parentId)}
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
                      <span className="text-[9px] text-amber-300">
                        {stars > 0 ? '★'.repeat(stars) : '•'}
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
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
              🏆
            </div>

            <div>
              <h3 className="text-2xl font-black text-white font-mono">
                {gameMode === 'campaign' ? 'FASE CONCLUÍDA!' : 'CIRCUITO SUPERADO!'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                O Bytezinho alcançou o portal de dados com sucesso!
              </p>
            </div>

            {/* Estrelas */}
            <div className="flex items-center gap-2 text-3xl">
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  className={s <= earnedStarsThisLevel ? 'text-amber-400 drop-shadow' : 'text-zinc-700'}
                >
                  ★
                </span>
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
                  } else {
                    setInfiniteSeed((prev) => prev + 1);
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-black transition cursor-pointer shadow-lg"
              >
                Próxima Fase ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScratchBotGame;
