import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  Sparkles,
  Star,
  Lightbulb,
  Bug,
  Infinity as InfinityIcon,
  Volume2,
  VolumeX,
  CheckCircle2,
  FileSpreadsheet,
  ChevronRight,
  BookOpen,
  Target,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Clock,
  Maximize2,
  ArrowRight,
  X
} from 'lucide-react';
import { BaseGameProps, GameExitPayload } from '../../../types/gamePlugin';
import { BytezinhoSkinId } from '../../../types/cosmetics';
import {
  SheetLevel,
  SheetGridData,
  SheetGameMode
} from '../../../types/sheetQuest';
import { SHEET_CAMPAIGN_LEVELS } from './sheetLevelsData';
import { SHEET_BUG_HUNTER_LEVELS } from './sheetBugHunterLevels';
import { generateProceduralSheetLevel } from './sheetProceduralGenerator';
import { SheetGridCanvas } from './SheetGridCanvas';
import { SheetTutorialOverlay, TUTORIAL_STEPS_DEF } from './SheetTutorialOverlay';
import {
  validateTargetCell,
  evaluateFormula,
  TargetValidationResult
} from './formulaEngine';
import { sheetAudio } from './sheetAudio';

const SAVE_KEY = 'sheetquest_progress_v1';

export interface SheetQuestSaveData {
  completedLevels: Record<number, { stars: number; bestFormula?: string }>;
  completedBugLevels: Record<number, boolean>;
  infiniteBestStreak: number;
  totalSheetsBalanced: number;
  hasSeenTutorial?: boolean;
}

export interface SheetQuestGameProps extends BaseGameProps {
  equippedSkin?: BytezinhoSkinId;
  isAdmin?: boolean;
  initialLevelIndex?: number;
}

// ─────────────────────────────────────────────────────────────
// Escala de Cargos na ByteCorp Studio
// ─────────────────────────────────────────────────────────────
export interface CareerRank {
  title: string;
  badge: string;
  minStars: number;
  nextThreshold: number;
}

const CAREER_RANKS: CareerRank[] = [
  { title: 'Estagiário de Planilhas', badge: '📋', minStars: 0, nextThreshold: 6 },
  { title: 'Analista Júnior de Dados', badge: '💻', minStars: 6, nextThreshold: 16 },
  { title: 'Especialista em Automação', badge: '⚡', minStars: 16, nextThreshold: 31 },
  { title: 'Arquiteto de BI', badge: '📊', minStars: 31, nextThreshold: 46 },
  { title: 'Diretor de Dados & Analytics', badge: '👑', minStars: 46, nextThreshold: 999 }
];

export const SheetQuestGame: React.FC<SheetQuestGameProps> = ({
  onExitToHub,
  difficultyMultiplier = 1.0,
  studentClass = 'warrior',
  equippedSkin = 'classic',
  isAdmin = false,
  initialLevelIndex = 0
}) => {
  // ─────────────────────────────────────────────────────────────
  // 1. Estado de Navegação, Modos de Jogo e Tutorial
  // ─────────────────────────────────────────────────────────────
  const [gameMode, setGameMode] = useState<SheetGameMode>('campaign');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(() => {
    if (typeof initialLevelIndex === 'number' && initialLevelIndex >= 0 && initialLevelIndex < SHEET_CAMPAIGN_LEVELS.length) {
      return initialLevelIndex;
    }
    return 0;
  });
  const [currentBugLevelIndex, setCurrentBugLevelIndex] = useState<number>(0);
  const [infiniteSeed, setInfiniteSeed] = useState<number>(1);
  const [infiniteStreak, setInfiniteStreak] = useState<number>(0);
  const [isAdminLevelPickerOpen, setIsAdminLevelPickerOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof initialLevelIndex === 'number' && initialLevelIndex >= 0 && initialLevelIndex < SHEET_CAMPAIGN_LEVELS.length) {
      setCurrentLevelIndex(initialLevelIndex);
    }
  }, [initialLevelIndex]);

  const isUnlockedByAdmin = isAdmin || (typeof window !== 'undefined' && localStorage.getItem('admin_unlock_all_levels') === 'true');

  // Áudio
  const [isMuted, setIsMuted] = useState<boolean>(() => sheetAudio.getMuted());

  // Modais de Ajuda
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Persistência local
  const [saveData, setSaveData] = useState<SheetQuestSaveData>(() => {
    try {
      const stored = localStorage.getItem(SAVE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      completedLevels: {},
      completedBugLevels: {},
      infiniteBestStreak: 0,
      totalSheetsBalanced: 0,
      hasSeenTutorial: false
    };
  });

  const updateSaveData = useCallback((updater: (prev: SheetQuestSaveData) => SheetQuestSaveData) => {
    setSaveData((prev) => {
      const updated = updater(prev);
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 2. Tutorial Interativo (Passo a Passo)
  // ─────────────────────────────────────────────────────────────
  const [isTutorialActive, setIsTutorialActive] = useState<boolean>(() => {
    // Abre automaticamente no 1º acesso
    return !saveData.hasSeenTutorial && Object.keys(saveData.completedLevels).length === 0;
  });
  const [tutorialStep, setTutorialStep] = useState<number>(1);

  // ─────────────────────────────────────────────────────────────
  // 3. Estado do Nível Atual e Grade
  // ─────────────────────────────────────────────────────────────
  const campaignLevel = SHEET_CAMPAIGN_LEVELS[currentLevelIndex] || SHEET_CAMPAIGN_LEVELS[0];
  const bugLevel = SHEET_BUG_HUNTER_LEVELS[currentBugLevelIndex] || SHEET_BUG_HUNTER_LEVELS[0];

  const proceduralLevel = useMemo(() => {
    if (gameMode !== 'infinite') return null;
    return generateProceduralSheetLevel(infiniteSeed);
  }, [gameMode, infiniteSeed]);

  // Se o tutorial estiver no passo 4, garante que a fase carregada seja o Nível 4 (com SOMA)
  const activeLevelDef = useMemo(() => {
    if (isTutorialActive) {
      if (tutorialStep >= 4) {
        return SHEET_CAMPAIGN_LEVELS[3]; // Nível 4: =SOMA(B2:B6)
      }
      return SHEET_CAMPAIGN_LEVELS[0]; // Nível 1: B2+B3
    }

    if (gameMode === 'campaign') return campaignLevel;
    if (gameMode === 'bug_hunter') {
      return {
        id: bugLevel.id,
        world: 99,
        worldName: 'Auditoria de Erros',
        title: bugLevel.title,
        scenario: bugLevel.scenario,
        clientName: bugLevel.clientName,
        clientRole: 'Auditor Sênior',
        clientAvatar: '🔍',
        briefing: bugLevel.briefing,
        tipTitle: `Corrija o erro ${bugLevel.errorCode}`,
        tipContent: bugLevel.tip,
        cheatSheetFormula: '',
        numColumns: bugLevel.numColumns,
        numRows: bugLevel.numRows,
        initialGrid: bugLevel.initialGrid,
        targets: [bugLevel.target]
      } as SheetLevel;
    }
    return proceduralLevel!;
  }, [gameMode, campaignLevel, bugLevel, proceduralLevel, isTutorialActive, tutorialStep]);

  // Grade mutável da sessão
  const [grid, setGrid] = useState<SheetGridData>(() => ({ ...activeLevelDef.initialGrid }));

  // Célula selecionada na grade
  const [selectedCoord, setSelectedCoord] = useState<string>(() => {
    return activeLevelDef.targets[0]?.coord || 'A1';
  });

  // Texto na barra de fórmulas fx
  const [formulaInput, setFormulaInput] = useState<string>(() => {
    if (gameMode === 'bug_hunter') {
      return bugLevel.initialBuggyFormula;
    }
    const cell = activeLevelDef.initialGrid[activeLevelDef.targets[0]?.coord || 'A1'];
    return cell?.raw ? String(cell.raw) : '';
  });

  // Metas resolvidas
  const [solvedCoords, setSolvedCoords] = useState<string[]>([]);

  // Feedback do Mascote Bytezinho
  const [byteFeedback, setByteFeedback] = useState<{
    text: string;
    type: 'neutral' | 'success' | 'error' | 'hint';
  }>({
    text: activeLevelDef.briefing,
    type: 'neutral'
  });

  // Modal de Vitória
  const [victoryModal, setVictoryModal] = useState<{
    isOpen: boolean;
    stars: number;
    title: string;
    message: string;
    bytesEarned: number;
  }>({
    isOpen: false,
    stars: 0,
    title: '',
    message: '',
    bytesEarned: 0
  });

  // Métricas de sessão para envio ao Hub
  const sessionStatsRef = useRef({
    formulasEvaluated: 0,
    formulasCorrect: 0,
    totalBytesEarned: 0,
    levelsCompleted: 0,
    startTime: Date.now()
  });

  // ─────────────────────────────────────────────────────────────
  // 4. Cálculo do Cargo do Aluno (Carreira ByteCorp)
  // ─────────────────────────────────────────────────────────────
  const totalStars = useMemo(() => {
    return Object.values(saveData.completedLevels).reduce((acc, lvl) => acc + (lvl.stars || 0), 0);
  }, [saveData.completedLevels]);

  const currentRank = useMemo(() => {
    for (let i = CAREER_RANKS.length - 1; i >= 0; i--) {
      if (totalStars >= CAREER_RANKS[i].minStars) {
        return CAREER_RANKS[i];
      }
    }
    return CAREER_RANKS[0];
  }, [totalStars]);

  // ─────────────────────────────────────────────────────────────
  // 5. Reinicialização de Fase
  // ─────────────────────────────────────────────────────────────
  const resetLevelState = useCallback((level: SheetLevel, isBugMode: boolean = false) => {
    setGrid({ ...level.initialGrid });
    const firstTarget = level.targets[0]?.coord || 'A1';
    setSelectedCoord(firstTarget);

    if (isBugMode && 'initialBuggyFormula' in level) {
      setFormulaInput((level as any).initialBuggyFormula);
    } else {
      const cell = level.initialGrid[firstTarget];
      setFormulaInput(cell?.raw ? String(cell.raw) : '=');
    }

    setSolvedCoords([]);
    setByteFeedback({
      text: level.briefing,
      type: 'neutral'
    });
    setVictoryModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Recarregar quando muda de nível, modo ou etapa do tutorial
  useEffect(() => {
    resetLevelState(activeLevelDef, gameMode === 'bug_hunter');
  }, [activeLevelDef, gameMode, resetLevelState]);

  // Abre o pop-up focado de briefing a cada nova demanda (exceto no tutorial)
  // Quando o jogador clica em outra célula, sincroniza a barra fx
  const handleSelectCoord = useCallback(
    (coord: string) => {
      setSelectedCoord(coord);
      const cell = grid[coord];
      if (cell) {
        setFormulaInput(cell.raw !== undefined ? String(cell.raw) : '');
      } else {
        setFormulaInput('');
      }
    },
    [grid]
  );

  // ─────────────────────────────────────────────────────────────
  // 6. Verificação do Tutorial em Tempo Real
  // ─────────────────────────────────────────────────────────────
  const isCurrentTutorialStepCompleted = useMemo(() => {
    if (!isTutorialActive) return false;
    switch (tutorialStep) {
      case 1:
        return selectedCoord === 'B2';
      case 2:
        return selectedCoord === 'B4' && formulaInput.startsWith('=');
      case 3:
        return solvedCoords.includes('B4');
      case 4:
        return solvedCoords.includes('B7');
      case 5:
        return true;
      default:
        return false;
    }
  }, [isTutorialActive, tutorialStep, selectedCoord, formulaInput, solvedCoords]);

  const handleNextTutorialStep = () => {
    if (tutorialStep < 5) {
      setTutorialStep((prev) => prev + 1);
      sheetAudio.playStarChime(tutorialStep % 3);
    } else {
      // Concluiu o tutorial
      setIsTutorialActive(false);
      updateSaveData((prev) => ({ ...prev, hasSeenTutorial: true }));
      confetti({ particleCount: 80, spread: 60 });
      sheetAudio.playLevelComplete();
    }
  };

  const handleSkipTutorial = () => {
    setIsTutorialActive(false);
    updateSaveData((prev) => ({ ...prev, hasSeenTutorial: true }));
  };

  // ─────────────────────────────────────────────────────────────
  // 7. Validação e Execução da Fórmula (Enter / Calcular)
  // ─────────────────────────────────────────────────────────────
  const handleCalculateFormula = () => {
    const targetRule = activeLevelDef.targets.find((t) => t.coord === selectedCoord);

    // Se não for célula-alvo, apenas calcula e atualiza o display no grid
    if (!targetRule) {
      const evalRes = evaluateFormula(formulaInput, grid, selectedCoord);
      setGrid((prev) => ({
        ...prev,
        [selectedCoord]: {
          ...prev[selectedCoord],
          raw: formulaInput,
          display: evalRes.error ? evalRes.error : evalRes.value
        }
      }));
      if (evalRes.error) {
        sheetAudio.playFormulaError();
        setByteFeedback({
          text: `A célula ${selectedCoord} retornou o erro ${evalRes.error}: ${evalRes.errorMessage || 'Verifique a sintaxe.'}`,
          type: 'error'
        });
      } else {
        sheetAudio.playFormulaSuccess();
        setByteFeedback({
          text: `Célula ${selectedCoord} calculada: ${evalRes.value}. Selecione uma célula com o alvo 🎯 para avançar!`,
          type: 'neutral'
        });
      }
      return;
    }

    sessionStatsRef.current.formulasEvaluated += 1;

    // Validação estrita da regra do objetivo com suporte anti-hardcode
    const validation: TargetValidationResult = validateTargetCell(
      formulaInput,
      grid,
      targetRule,
      activeLevelDef.mutationTest
    );

    // Atualiza célula na grade
    setGrid((prev) => ({
      ...prev,
      [selectedCoord]: {
        ...prev[selectedCoord],
        raw: formulaInput,
        display: validation.evalResult.error ? validation.evalResult.error : validation.evalResult.value
      }
    }));

    if (!validation.valid) {
      sheetAudio.playFormulaError();
      setByteFeedback({
        text: validation.message,
        type: 'error'
      });
      return;
    }

    // Acertou o alvo!
    sessionStatsRef.current.formulasCorrect += 1;
    sheetAudio.playFormulaSuccess();

    const newSolved = solvedCoords.includes(selectedCoord)
      ? solvedCoords
      : [...solvedCoords, selectedCoord];
    setSolvedCoords(newSolved);

    // Se estiver no tutorial, não dispara o modal de vitória padrão
    if (isTutorialActive) {
      return;
    }

    // Verifica se completou todos os alvos do nível
    const allTargetsSolved = activeLevelDef.targets.every((t) => newSolved.includes(t.coord));

    if (allTargetsSolved) {
      handleCompleteLevel(validation.stars);
    } else {
      // Avança foco para o próximo alvo pendente
      const nextPendingTarget = activeLevelDef.targets.find((t) => !newSolved.includes(t.coord));
      if (nextPendingTarget) {
        setSelectedCoord(nextPendingTarget.coord);
        setFormulaInput('=');
        setByteFeedback({
          text: `Excelente! Alvo ${targetRule.coord} concluído. Agora calcule a próxima meta: ${nextPendingTarget.label} em ${nextPendingTarget.coord}!`,
          type: 'success'
        });
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 8. Conclusão de Nível & Estrelas
  // ─────────────────────────────────────────────────────────────
  const handleCompleteLevel = (stars: number) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    sheetAudio.playLevelComplete();

    setTimeout(() => sheetAudio.playStarChime(0), 400);
    if (stars >= 2) setTimeout(() => sheetAudio.playStarChime(1), 750);
    if (stars >= 3) setTimeout(() => sheetAudio.playStarChime(2), 1100);

    let bytesForLevel = 0;
    if (gameMode === 'campaign') {
      bytesForLevel = stars * 50;
      updateSaveData((prev) => ({
        ...prev,
        completedLevels: {
          ...prev.completedLevels,
          [activeLevelDef.id]: {
            stars: Math.max(prev.completedLevels[activeLevelDef.id]?.stars || 0, stars),
            bestFormula: formulaInput
          }
        },
        totalSheetsBalanced: prev.totalSheetsBalanced + 1
      }));
    } else if (gameMode === 'bug_hunter') {
      bytesForLevel = 100;
      updateSaveData((prev) => ({
        ...prev,
        completedBugLevels: {
          ...prev.completedBugLevels,
          [bugLevel.id]: true
        },
        totalSheetsBalanced: prev.totalSheetsBalanced + 1
      }));
    } else {
      const newStreak = infiniteStreak + 1;
      setInfiniteStreak(newStreak);
      bytesForLevel = 35 + newStreak * 5;
      updateSaveData((prev) => ({
        ...prev,
        infiniteBestStreak: Math.max(prev.infiniteBestStreak, newStreak),
        totalSheetsBalanced: prev.totalSheetsBalanced + 1
      }));
    }

    sessionStatsRef.current.totalBytesEarned += bytesForLevel;
    sessionStatsRef.current.levelsCompleted += 1;

    setVictoryModal({
      isOpen: true,
      stars,
      title: gameMode === 'bug_hunter' ? 'Ticket de Auditoria Concluído!' : 'Demanda Aprovada pelo Cliente!',
      message:
        stars === 3
          ? 'Fórmula perfeita! O cliente aprovou os cálculos com padrão profissional do Google Sheets.'
          : 'Meta atingida! Para alcançar 3 estrelas, use funções dinâmicas de intervalo (ex: SOMA, MÉDIA).',
      bytesEarned: bytesForLevel
    });
  };

  // ─────────────────────────────────────────────────────────────
  // 9. Próxima Fase
  // ─────────────────────────────────────────────────────────────
  const handleNextLevel = () => {
    if (gameMode === 'campaign') {
      if (currentLevelIndex < SHEET_CAMPAIGN_LEVELS.length - 1) {
        setCurrentLevelIndex((prev) => prev + 1);
      } else {
        setByteFeedback({
          text: 'Parabéns! Você resolveu todas as demandas corporativas da ByteCorp!',
          type: 'success'
        });
      }
    } else if (gameMode === 'bug_hunter') {
      if (currentBugLevelIndex < SHEET_BUG_HUNTER_LEVELS.length - 1) {
        setCurrentBugLevelIndex((prev) => prev + 1);
      } else {
        setByteFeedback({
          text: 'Incrível! Você concluiu todas as auditorias de erro!',
          type: 'success'
        });
      }
    } else {
      setInfiniteSeed((prev) => prev + 1);
    }
    setVictoryModal((prev) => ({ ...prev, isOpen: false }));
  };

  // ─────────────────────────────────────────────────────────────
  // 10. Saída Limpa para o Hub
  // ─────────────────────────────────────────────────────────────
  const handleExitGame = () => {
    const accuracy =
      sessionStatsRef.current.formulasEvaluated > 0
        ? Math.round(
            (sessionStatsRef.current.formulasCorrect / sessionStatsRef.current.formulasEvaluated) * 100
          )
        : 100;
    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - sessionStatsRef.current.startTime) / 1000));

    const payload: GameExitPayload = {
      bytesEarned: sessionStatsRef.current.totalBytesEarned,
      sessionStats: {
        score: sessionStatsRef.current.totalBytesEarned,
        accuracyPercentage: accuracy,
        timeSpentSeconds,
        correctAnswers: sessionStatsRef.current.formulasCorrect,
        wrongAnswers: Math.max(0, sessionStatsRef.current.formulasEvaluated - sessionStatsRef.current.formulasCorrect),
        levelReached: currentLevelIndex + 1,
        extraMetrics: {
          formulasEvaluated: sessionStatsRef.current.formulasEvaluated,
          levelsCompleted: sessionStatsRef.current.levelsCompleted,
          completedQuests: sessionStatsRef.current.levelsCompleted,
          gameMode,
          rank: currentRank.title
        }
      }
    };
    onExitToHub(payload);
  };

  // Lista de coordenadas alvo do nível ativo
  const targetCoords = useMemo(() => {
    return activeLevelDef.targets.map((t) => t.coord);
  }, [activeLevelDef]);

  // Spotlight do tutorial
  const tutorialHighlightCoord = isTutorialActive
    ? TUTORIAL_STEPS_DEF[tutorialStep - 1]?.highlightCoord
    : undefined;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* ─── TOPO: HEADER ULTRA-ENXUTO ───────────── */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-3 sm:px-4 py-2 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-[1680px] mx-auto flex items-center justify-between gap-3">
          {/* Lado Esquerdo: HUB + Identificação Limpa */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExitGame}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all shadow-sm cursor-pointer"
              title="Voltar para o Menu Principal"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>HUB</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                SheetQuest
              </span>
              <span className="text-slate-600">|</span>
              {gameMode === 'campaign' && !isTutorialActive && (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                    TK-{String(activeLevelDef.id).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-slate-300 font-medium hidden sm:inline truncate max-w-[200px]">
                    {activeLevelDef.title}
                  </span>
                </div>
              )}
              {gameMode === 'bug_hunter' && !isTutorialActive && (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-800/40 px-1.5 py-0.5 rounded">
                    {bugLevel?.errorCode || 'AUDIT'}
                  </span>
                  <span className="text-xs text-slate-300 font-medium hidden sm:inline truncate max-w-[200px]">
                    {activeLevelDef.title}
                  </span>
                </div>
              )}
              {gameMode === 'infinite' && !isTutorialActive && (
                <span className="text-xs text-cyan-300 font-medium">
                  Sequência: <strong className="text-white font-mono">{infiniteStreak}</strong> (Recorde: {saveData.infiniteBestStreak})
                </span>
              )}
            </div>
          </div>

          {/* Centro: Modos e Navegador de Nível Compacto */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => {
                  setIsTutorialActive(false);
                  setGameMode('campaign');
                }}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  !isTutorialActive && gameMode === 'campaign'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Demandas
              </button>
              <button
                onClick={() => {
                  setIsTutorialActive(false);
                  setGameMode('bug_hunter');
                }}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  !isTutorialActive && gameMode === 'bug_hunter'
                    ? 'bg-rose-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Auditoria
              </button>
              <button
                onClick={() => {
                  setIsTutorialActive(false);
                  setGameMode('infinite');
                }}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  !isTutorialActive && gameMode === 'infinite'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Infinito
              </button>
              <button
                onClick={() => {
                  setIsTutorialActive(true);
                  setTutorialStep(1);
                }}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  isTutorialActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                Tutorial
              </button>
            </div>

            {/* Navegador [←] N/Total [→] */}
            {!isTutorialActive && gameMode === 'campaign' && (
              <div className="flex items-center bg-slate-950/80 rounded-lg border border-slate-800 p-0.5 text-xs font-mono">
                <button
                  disabled={currentLevelIndex <= 0}
                  onClick={() => setCurrentLevelIndex((prev) => Math.max(0, prev - 1))}
                  className="px-2 py-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 cursor-pointer"
                  title="Demanda anterior"
                >
                  ←
                </button>
                <span className="px-2 font-bold text-emerald-400">
                  {String(currentLevelIndex + 1).padStart(2, '0')}/{SHEET_CAMPAIGN_LEVELS.length}
                </span>
                <button
                  disabled={
                    currentLevelIndex >= SHEET_CAMPAIGN_LEVELS.length - 1 ||
                    (!isUnlockedByAdmin && !saveData.completedLevels[SHEET_CAMPAIGN_LEVELS[currentLevelIndex].id])
                  }
                  onClick={() =>
                    setCurrentLevelIndex((prev) =>
                      Math.min(SHEET_CAMPAIGN_LEVELS.length - 1, prev + 1)
                    )
                  }
                  className="px-2 py-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 cursor-pointer"
                  title={isUnlockedByAdmin ? "Próxima demanda (Modo ADM: Desbloqueado)" : "Próxima demanda"}
                >
                  →
                </button>
                {isUnlockedByAdmin && (
                  <button
                    onClick={() => setIsAdminLevelPickerOpen(true)}
                    className="ml-1 px-1.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold transition cursor-pointer"
                    title="Menu ADM: Selecionar qualquer fase de 1 a 48"
                  >
                    ⚡ Fases
                  </button>
                )}
              </div>
            )}

            {!isTutorialActive && gameMode === 'bug_hunter' && (
              <div className="flex items-center bg-slate-950/80 rounded-lg border border-slate-800 p-0.5 text-xs font-mono">
                <button
                  disabled={currentBugLevelIndex <= 0}
                  onClick={() => setCurrentBugLevelIndex((prev) => Math.max(0, prev - 1))}
                  className="px-2 py-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 cursor-pointer"
                  title="Auditoria anterior"
                >
                  ←
                </button>
                <span className="px-2 font-bold text-rose-400">
                  {String(currentBugLevelIndex + 1).padStart(2, '0')}/{SHEET_BUG_HUNTER_LEVELS.length}
                </span>
                <button
                  disabled={currentBugLevelIndex >= SHEET_BUG_HUNTER_LEVELS.length - 1}
                  onClick={() =>
                    setCurrentBugLevelIndex((prev) =>
                      Math.min(SHEET_BUG_HUNTER_LEVELS.length - 1, prev + 1)
                    )
                  }
                  className="px-2 py-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 cursor-pointer"
                  title="Próxima auditoria"
                >
                  →
                </button>
              </div>
            )}
          </div>

          {/* Lado Direito: Ações Essenciais */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-all shadow-sm cursor-pointer"
              title="Guia Rápido de Fórmulas e Atalhos"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">Guia</span>
            </button>

            <button
              onClick={() => {
                const nextMute = sheetAudio.toggleMute();
                setIsMuted(nextMute);
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all cursor-pointer"
              title={isMuted ? 'Desmutar Áudio' : 'Mutar Áudio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── CORPO PRINCIPAL LIMPO E WIDESCREEN ─────────── */}
      <main className="max-w-[1680px] w-full mx-auto p-3 sm:p-4 flex-1 flex flex-col gap-3">
        {/* Banner do Tutorial Interativo (quando ativo) */}
        {isTutorialActive && (
          <SheetTutorialOverlay
            currentStep={tutorialStep}
            onNextStep={handleNextTutorialStep}
            onSkipTutorial={handleSkipTutorial}
            selectedCoord={selectedCoord}
            formulaInput={formulaInput}
            isCurrentStepCompleted={isCurrentTutorialStepCompleted}
          />
        )}

        {/* ─── FAIXA INTEGRADA DE OBJETIVO E METAS (ACIMA DA PLANILHA) ─── */}
        {!isTutorialActive && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
            {/* Lado Esquerdo: Objetivo do Chamado */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5 flex-shrink-0">
                <Target className="w-4 h-4 text-amber-400" />
                Objetivo:
              </span>
              <p className="text-xs text-slate-200 truncate" title={activeLevelDef.briefing}>
                {activeLevelDef.briefing}
              </p>
            </div>

            {/* Centro: Pílulas de Metas Clicáveis */}
            <div className="flex items-center gap-2 flex-wrap">
              {activeLevelDef.targets.map((tgt) => {
                const isSolved = solvedCoords.includes(tgt.coord);
                const isSelected = selectedCoord === tgt.coord;

                return (
                  <button
                    key={tgt.coord}
                    onClick={() => handleSelectCoord(tgt.coord)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isSolved
                        ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-300'
                        : isSelected
                        ? 'bg-amber-950/60 border-amber-400 text-amber-200 ring-1 ring-amber-400'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                    title={`${tgt.label} - ${tgt.hint}`}
                  >
                    <span
                      className={`font-mono font-bold text-[11px] px-1 rounded ${
                        isSolved
                          ? 'bg-emerald-500 text-slate-950'
                          : isSelected
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {tgt.coord}
                    </span>
                    <span className="truncate max-w-[140px]">{tgt.label}</span>
                    {isSolved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Target className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Lado Direito: Ações Úteis */}
            <div className="flex items-center gap-3">
              {activeLevelDef.cheatSheetFormula && activeLevelDef.id <= 15 && (
                <span className="text-[11px] font-mono text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800 hidden lg:inline">
                  Ref: {activeLevelDef.cheatSheetFormula}
                </span>
              )}
              <button
                onClick={() => resetLevelState(activeLevelDef, gameMode === 'bug_hunter')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                title="Restaurar a planilha para o estado inicial da fase"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Restaurar</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── PLANILHA EXPANDIDA (LARGURA TOTAL) ─── */}
        <div className="w-full">
          <SheetGridCanvas
            grid={grid}
            numColumns={activeLevelDef.numColumns}
            numRows={activeLevelDef.numRows}
            selectedCoord={selectedCoord}
            onSelectCoord={handleSelectCoord}
            formulaInput={formulaInput}
            onFormulaInputChange={setFormulaInput}
            onFormulaSubmit={handleCalculateFormula}
            targetCoords={targetCoords}
            solvedCoords={solvedCoords}
            tutorialHighlightCoord={tutorialHighlightCoord}
            sheetTabTitle={activeLevelDef.title.replace(/\s+/g, '_').substring(0, 20)}
          />
        </div>

        {/* ─── BARRA DE FEEDBACK CONCISA (APENAS QUANDO RELEVANTE) ─── */}
        {byteFeedback.text && (
          <div
            className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
              byteFeedback.type === 'error'
                ? 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                : byteFeedback.type === 'success'
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs">
              <span className="text-base">
                {byteFeedback.type === 'error' ? '❌' : byteFeedback.type === 'success' ? '✅' : '💡'}
              </span>
              <p className="leading-snug">{byteFeedback.text}</p>
              {activeLevelDef.tipContent && byteFeedback.type === 'error' && (
                <span className="text-amber-300 text-[11px] font-medium hidden md:inline ml-2 pl-2 border-l border-rose-800/60">
                  Dica: {activeLevelDef.tipContent}
                </span>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ─── MODAL DE VITÓRIA (LEVEL COMPLETE) ────────────────────── */}
      {victoryModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl mb-4 text-emerald-400 shadow-inner">
              📊
            </div>

            <h2 className="text-xl font-black text-white mb-1">{victoryModal.title}</h2>
            <p className="text-xs text-slate-400 mb-4">{victoryModal.message}</p>

            {gameMode === 'campaign' && (
              <div className="flex items-center justify-center gap-2 mb-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                      i < victoryModal.stars
                        ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-lg scale-110'
                        : 'bg-slate-800 border-slate-700 text-slate-600'
                    }`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        i < victoryModal.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="bg-emerald-950/50 border border-emerald-500/30 px-4 py-2 rounded-xl mb-6 flex items-center gap-2 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>+{victoryModal.bytesEarned} Bytes creditados na sua conta!</span>
            </div>

            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setVictoryModal((prev) => ({ ...prev, isOpen: false }))}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                Revisar Planilha
              </button>

              <button
                onClick={handleNextLevel}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Próxima Demanda</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL GUIA DE FÓRMULAS & ATALHOS ─────────────────────── */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Manual do Google Planilhas (PT-BR)</h2>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 text-xs text-slate-300 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
              <div className="bg-emerald-950/50 border border-emerald-500/40 p-3 rounded-xl">
                <h4 className="font-bold text-emerald-300 text-xs mb-1">
                  ⭐ Regras Fundamentais de Sintaxe:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-emerald-100">
                  <li>
                    Separador de argumentos: <strong>SEMPRE ponto e vírgula (<code className="font-mono text-emerald-300">;</code>)</strong>. Ex: <code className="font-mono text-white">=SE(B2&gt;=70; "Sim"; "Não")</code>.
                  </li>
                  <li>
                    A vírgula comum (<code className="font-mono text-emerald-300">,</code>) é reservada exclusivamente para <strong>casas decimais</strong> (ex: <code className="font-mono text-white">10,5</code>).
                  </li>
                  <li>
                    Dois pontos (<code className="font-mono text-emerald-300">:</code>) definem um <strong>intervalo contínuo</strong> (ex: <code className="font-mono text-white">B2:B6</code> abrange da linha 2 até a 6).
                  </li>
                  <li>
                    O cifrão (<code className="font-mono text-emerald-300">$</code>) cria uma <strong>referência absoluta</strong> para travar células ao arrastar (ex: <code className="font-mono text-white">$B$2</code>).
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs mb-2">Funções Essenciais do Jogo:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-mono font-bold text-emerald-400">=SOMA(B2:B6)</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Soma todos os números no intervalo.</p>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-mono font-bold text-emerald-400">=MÉDIA(C2:C5)</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Média aritmética dos valores.</p>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-mono font-bold text-emerald-400">=MÁXIMO(...) / =MÍNIMO(...)</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Maior e menor valor do intervalo.</p>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-mono font-bold text-emerald-400">=CONT.SE(C2:C10; "&gt;=70")</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Conta células que atendem à condição.</p>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-mono font-bold text-emerald-400">=SE(teste; valor_v; valor_f)</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Decisão lógica condicional.</p>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-mono font-bold text-emerald-400">=SOMASE(cat_rng; "Meta"; val_rng)</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Soma condicional baseada em critério.</p>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 md:col-span-2">
                    <span className="font-mono font-bold text-emerald-400">=PROCV(chave; tabela; coluna; FALSO)</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Busca vertical na primeira coluna e retorna o dado correspondente da coluna indicada.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Entendi, voltar à planilha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL SELETOR RÁPIDO DE FASES (MODO ADM / PROFESSOR) ─── */}
      {isAdminLevelPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-base font-bold shadow-inner">
                  ⚡
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    Sandbox de Fases — Modo Professor / ADM
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] border border-amber-500/40">
                      Bypass de Progressão
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Selecione qualquer uma das 48 demandas ou 12 auditorias para testar na hora sem restrições.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const allLevels: Record<number, { stars: number; solvedAt: string }> = {};
                    SHEET_CAMPAIGN_LEVELS.forEach((lvl) => {
                      allLevels[lvl.id] = { stars: 3, solvedAt: new Date().toISOString() };
                    });
                    const updated = { ...saveData, completedLevels: allLevels };
                    setSaveData(updated);
                    localStorage.setItem('sheetquest_save', JSON.stringify(updated));
                    sheetAudio.playLevelComplete();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-600/50 text-[11px] font-bold transition cursor-pointer"
                  title="Concede 3 estrelas em todas as fases no save local"
                >
                  ★ Desbloquear Tudo (3 Estrelas)
                </button>
                <button
                  onClick={() => setIsAdminLevelPickerOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid de Fases */}
            <div className="overflow-y-auto pr-1 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 flex-1">
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Demandas da Campanha ({SHEET_CAMPAIGN_LEVELS.length} Fases):
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {SHEET_CAMPAIGN_LEVELS.map((lvl, idx) => {
                    const isCur = gameMode === 'campaign' && idx === currentLevelIndex;
                    const record = saveData.completedLevels[lvl.id];

                    return (
                      <button
                        key={lvl.id}
                        onClick={() => {
                          setGameMode('campaign');
                          setCurrentLevelIndex(idx);
                          setIsAdminLevelPickerOpen(false);
                          sheetAudio.playCellClick();
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isCur
                            ? 'bg-emerald-500/30 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-400'
                            : record
                            ? 'bg-slate-950/80 border-emerald-800/60 text-slate-200 hover:bg-slate-800'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-xs text-emerald-400">
                            TK-{String(lvl.id).padStart(2, '0')}
                          </span>
                          <span className="text-[10px] text-amber-400 font-mono">
                            {record ? '★'.repeat(record.stars) : 'M' + lvl.world}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold leading-tight line-clamp-2">
                          {lvl.title}
                        </span>
                        <span className="text-[9px] text-slate-500 truncate block mt-1">
                          {lvl.worldName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Bug className="w-3.5 h-3.5" />
                  Auditoria de Erros ({SHEET_BUG_HUNTER_LEVELS.length} Fases):
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {SHEET_BUG_HUNTER_LEVELS.map((lvl, idx) => {
                    const isCur = gameMode === 'bug_hunter' && idx === currentBugLevelIndex;
                    const isSolved = saveData.completedBugLevels[lvl.id];

                    return (
                      <button
                        key={lvl.id}
                        onClick={() => {
                          setGameMode('bug_hunter');
                          setCurrentBugLevelIndex(idx);
                          setIsAdminLevelPickerOpen(false);
                          sheetAudio.playCellClick();
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isCur
                            ? 'bg-rose-500/30 border-rose-400 text-white shadow-lg ring-1 ring-rose-400'
                            : isSolved
                            ? 'bg-slate-950/80 border-emerald-800/60 text-slate-200 hover:bg-slate-800'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-xs text-rose-400">
                            {lvl.errorCode}
                          </span>
                          {isSolved && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        </div>
                        <span className="text-[11px] font-semibold leading-tight line-clamp-2">
                          {lvl.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SheetQuestGame;
