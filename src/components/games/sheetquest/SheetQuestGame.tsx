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
  ArrowRight
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
  equippedSkin = 'classic'
}) => {
  // ─────────────────────────────────────────────────────────────
  // 1. Estado de Navegação, Modos de Jogo e Tutorial
  // ─────────────────────────────────────────────────────────────
  const [gameMode, setGameMode] = useState<SheetGameMode>('campaign');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [currentBugLevelIndex, setCurrentBugLevelIndex] = useState<number>(0);
  const [infiniteSeed, setInfiniteSeed] = useState<number>(1);
  const [infiniteStreak, setInfiniteStreak] = useState<number>(0);

  // Áudio
  const [isMuted, setIsMuted] = useState<boolean>(() => sheetAudio.getMuted());

  // Modais de Ajuda
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Pop-up focado de Demanda (Briefing inicial que desliza para a lateral)
  const [isDemandModalOpen, setIsDemandModalOpen] = useState<boolean>(true);

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
  useEffect(() => {
    if (!isTutorialActive) {
      setIsDemandModalOpen(true);
    }
  }, [activeLevelDef.id, gameMode, isTutorialActive]);

  // Permite fechar o briefing e começar imediatamente com a tecla Enter
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isDemandModalOpen && e.key === 'Enter') {
        setIsDemandModalOpen(false);
        sheetAudio.playCellClick();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isDemandModalOpen]);

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
      {/* ─── TOPO: BARRA DE NAVEGAÇÃO, CARREIRA & MODOS ───────────── */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-4 py-3 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-[1680px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Lado Esquerdo: Voltar & Identificação do Jogo */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExitGame}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all shadow"
              title="Voltar para o Menu Principal"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>HUB</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-wide text-white flex items-center gap-1.5">
                  SheetQuest <span className="text-emerald-400 font-mono text-xs">2.0</span>
                </h1>
                <p className="text-[11px] text-slate-400">ByteCorp Data Studio • Fórmulas PT-BR</p>
              </div>
            </div>
          </div>

          {/* Centro: Modos de Jogo & Tutorial */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-semibold gap-1">
            <button
              onClick={() => {
                setIsTutorialActive(true);
                setTutorialStep(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                isTutorialActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
                  : 'text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Tutorial Prático</span>
            </button>

            <button
              onClick={() => {
                setIsTutorialActive(false);
                setGameMode('campaign');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                !isTutorialActive && gameMode === 'campaign'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Demandas ({SHEET_CAMPAIGN_LEVELS.length})</span>
            </button>

            <button
              onClick={() => {
                setIsTutorialActive(false);
                setGameMode('bug_hunter');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                !isTutorialActive && gameMode === 'bug_hunter'
                  ? 'bg-rose-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>Auditoria ({SHEET_BUG_HUNTER_LEVELS.length})</span>
            </button>

            <button
              onClick={() => {
                setIsTutorialActive(false);
                setGameMode('infinite');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                !isTutorialActive && gameMode === 'infinite'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <InfinityIcon className="w-3.5 h-3.5" />
              <span>Infinito</span>
            </button>
          </div>

          {/* Lado Direito: Crachá de Carreira & Áudio */}
          <div className="flex items-center gap-3">
            {/* Crachá ByteCorp do Aluno */}
            <div className="hidden md:flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-base">{currentRank.badge}</span>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">CARGO ATUAL</span>
                <span className="text-emerald-400 font-bold text-xs truncate max-w-[150px] block">
                  {currentRank.title}
                </span>
              </div>
              <div className="ml-1 pl-2 border-l border-slate-800 flex items-center gap-1 text-amber-400 font-mono font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{totalStars}</span>
              </div>
            </div>

            <button
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-all shadow"
              title="Guia Rápido de Fórmulas e Atalhos"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Guia Fórmulas</span>
            </button>

            <button
              onClick={() => {
                const nextMute = sheetAudio.toggleMute();
                setIsMuted(nextMute);
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all"
              title={isMuted ? 'Desmutar Áudio' : 'Mutar Áudio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── CORPO PRINCIPAL EXPANDIDO (WIDESCREEN 1680px) ─────────── */}
      <main className="max-w-[1680px] w-full mx-auto p-3 sm:p-5 flex-1 flex flex-col gap-4">
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

        {/* Faixa de Seleção de Demandas (Campanha) */}
        {!isTutorialActive && gameMode === 'campaign' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
            {SHEET_CAMPAIGN_LEVELS.map((lvl, idx) => {
              const record = saveData.completedLevels[lvl.id];
              const isCurrent = idx === currentLevelIndex;
              const isLocked = idx > 0 && !saveData.completedLevels[SHEET_CAMPAIGN_LEVELS[idx - 1].id];

              return (
                <button
                  key={lvl.id}
                  disabled={isLocked}
                  onClick={() => setCurrentLevelIndex(idx)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isCurrent
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-400/50'
                      : record
                      ? 'bg-slate-900 border-emerald-800/60 text-slate-300 hover:bg-slate-850'
                      : isLocked
                      ? 'bg-slate-950/60 border-slate-900 text-slate-600 cursor-not-allowed opacity-50'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-mono text-[11px] font-bold text-emerald-400">
                    TK-{String(lvl.id).padStart(2, '0')}
                  </span>
                  <span className="truncate max-w-[120px]">{lvl.title}</span>
                  {record && (
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: record.stars }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Faixa de Seleção de Nível (Auditoria de Erros) */}
        {!isTutorialActive && gameMode === 'bug_hunter' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
            {SHEET_BUG_HUNTER_LEVELS.map((lvl, idx) => {
              const isCurrent = idx === currentBugLevelIndex;
              const isSolved = saveData.completedBugLevels[lvl.id];

              return (
                <button
                  key={lvl.id}
                  onClick={() => setCurrentBugLevelIndex(idx)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isCurrent
                      ? 'bg-rose-500/20 border-rose-400 text-white shadow-lg ring-1 ring-rose-400/50'
                      : isSolved
                      ? 'bg-slate-900 border-emerald-800/60 text-slate-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-mono text-[11px] font-bold text-rose-400">
                    {lvl.errorCode}
                  </span>
                  <span className="truncate max-w-[130px]">{lvl.title}</span>
                  {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Status Modo Infinito */}
        {!isTutorialActive && gameMode === 'infinite' && (
          <div className="flex items-center justify-between bg-cyan-950/40 border border-cyan-800/40 px-4 py-2.5 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-cyan-300">
              <InfinityIcon className="w-4 h-4 text-cyan-400" />
              <span>Sequência de Demandas: <strong className="text-white font-mono text-sm">{infiniteStreak}</strong></span>
            </div>
            <div className="text-slate-400">
              Recorde Corporativo: <strong className="text-cyan-400 font-mono">{saveData.infiniteBestStreak}</strong>
            </div>
          </div>
        )}

        {/* ─── WORKSPACE EXPANDIDO: PLANILHA LIGHT + PAINEL DO GERENTE ─ */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Coluna Principal: Planilha em Fundo Branco (8 de 12 colunas em telas xl) */}
          <div className="xl:col-span-8 2xl:col-span-9 flex flex-col gap-3">
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

            {/* Balão do Assistente Bytezinho */}
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                byteFeedback.type === 'error'
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  : byteFeedback.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-xl shadow-inner">
                🤖
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    Bytezinho <span className="text-[10px] text-emerald-400 font-normal">Assistente de BI</span>
                  </span>
                  {activeLevelDef.tipTitle && (
                    <span className="text-[11px] text-cyan-300 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-cyan-400" />
                      {activeLevelDef.tipTitle}
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed">{byteFeedback.text}</p>
                {activeLevelDef.tipContent && byteFeedback.type === 'error' && (
                  <p className="text-[11px] text-amber-300 mt-1.5 bg-amber-950/40 p-2 rounded border border-amber-800/40">
                    💡 <strong>Diagnóstico:</strong> {activeLevelDef.tipContent}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Coluna Lateral: Central de Demandas & Storytelling do Gerente (4 de 12 colunas) */}
          <div className="xl:col-span-4 2xl:col-span-3 flex flex-col gap-3">
            {/* Cartão de Ticket Corporativo Docked */}
            <motion.div
              layout
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-mono font-bold text-emerald-400">
                    #{String(activeLevelDef.id).padStart(2, '0')}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Ticket de Demanda
                    </span>
                    <span className="text-xs font-bold text-white truncate block">
                      {activeLevelDef.worldName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsDemandModalOpen(true);
                      sheetAudio.playCellClick();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-emerald-400 font-semibold border border-slate-700 transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Expandir chamado em pop-up focado"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Expandir</span>
                  </button>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    Alta
                  </span>
                </div>
              </div>

              {/* Solicitante / Cliente */}
              <div className="flex items-center gap-3 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                  {activeLevelDef.clientAvatar}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-white truncate">{activeLevelDef.clientName}</h3>
                  <p className="text-[10px] text-slate-400 truncate">{activeLevelDef.clientRole}</p>
                  <span className="text-[10px] font-mono text-emerald-400 truncate block">
                    {activeLevelDef.scenario}
                  </span>
                </div>
              </div>

              {/* Mensagem do Gerente de Operações */}
              <div className="text-xs text-slate-300 leading-relaxed mb-4 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] mb-1">
                  <span>👔 Gerente Marco:</span>
                </div>
                <p className="italic text-slate-300">"{activeLevelDef.briefing}"</p>
              </div>

              {/* Lista de Metas (Células-Alvo a Calcular) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    Metas do Chamado
                  </h4>
                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                    {solvedCoords.length}/{activeLevelDef.targets.length} Concluídas
                  </span>
                </div>

                {activeLevelDef.targets.map((tgt) => {
                  const isSolved = solvedCoords.includes(tgt.coord);
                  const isSelected = selectedCoord === tgt.coord;

                  return (
                    <div
                      key={tgt.coord}
                      onClick={() => handleSelectCoord(tgt.coord)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSolved
                          ? 'bg-emerald-950/30 border-emerald-600/50 text-emerald-200'
                          : isSelected
                          ? 'bg-amber-950/40 border-amber-500 text-amber-100 shadow-md ring-1 ring-amber-400/40'
                          : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-inner ${
                            isSolved
                              ? 'bg-emerald-500 text-slate-950'
                              : isSelected
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {tgt.coord}
                        </div>
                        <div className="truncate text-xs">
                          <span className="font-semibold block truncate">{tgt.label}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{tgt.hint}</span>
                        </div>
                      </div>

                      <div>
                        {isSolved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Target className="w-4 h-4 text-amber-400 animate-pulse" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botão de Resetar Planilha */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => resetLevelState(activeLevelDef, gameMode === 'bug_hunter')}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Planilha</span>
                </button>

                {activeLevelDef.cheatSheetFormula && (
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-[170px]" title={activeLevelDef.cheatSheetFormula}>
                    Ref: {activeLevelDef.cheatSheetFormula}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* ─── MODAL FOCADO DE DEMANDA (BRIEFING INICIAL COM SLIDE) ─── */}
      <AnimatePresence>
        {isDemandModalOpen && !isTutorialActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.65,
                x: 480,
                y: -60,
                transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] }
              }}
              className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Glow decorativo */}
              <div className="absolute top-0 right-0 w-80 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Cabeçalho do Ticket */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs font-mono font-bold text-emerald-400 shadow-inner">
                    #{String(activeLevelDef.id).padStart(2, '0')}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">
                      NOVO CHAMADO DE DEMANDA
                    </span>
                    <h2 className="text-sm font-bold text-white truncate">
                      {activeLevelDef.worldName} — {activeLevelDef.title}
                    </h2>
                  </div>
                </div>

                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Prioridade Alta
                </span>
              </div>

              {/* Solicitante / Cliente */}
              <div className="flex items-center gap-3.5 mb-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                  {activeLevelDef.clientAvatar}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white truncate">{activeLevelDef.clientName}</h3>
                  <p className="text-xs text-slate-400 truncate">{activeLevelDef.clientRole}</p>
                  <span className="text-xs font-mono text-emerald-400 truncate block mt-0.5">
                    Cenário: {activeLevelDef.scenario}
                  </span>
                </div>
              </div>

              {/* Mensagem do Gerente de Operações */}
              <div className="text-xs text-slate-200 leading-relaxed mb-4 bg-slate-950/90 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-1.5">
                  <span>👔 Mensagem do Gerente Marco Silva:</span>
                </div>
                <p className="italic text-slate-300 text-xs sm:text-sm">"{activeLevelDef.briefing}"</p>
              </div>

              {/* Metas da Demanda */}
              <div className="mb-5 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-amber-400" />
                  Metas a Entregar ({activeLevelDef.targets.length} meta{activeLevelDef.targets.length > 1 ? 's' : ''}):
                </h4>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                  {activeLevelDef.targets.map((tgt) => (
                    <div
                      key={tgt.coord}
                      className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded bg-amber-400 text-slate-950 font-mono font-bold flex items-center justify-center text-xs">
                          {tgt.coord}
                        </span>
                        <div>
                          <span className="font-semibold text-slate-200 block">{tgt.label}</span>
                          <span className="text-[11px] text-slate-400 block">{tgt.hint}</span>
                        </div>
                      </div>
                      {tgt.requiredFunction && (
                        <span className="font-mono text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                          ={tgt.requiredFunction}()
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão de Ação / Iniciar */}
              <button
                onClick={() => {
                  setIsDemandModalOpen(false);
                  sheetAudio.playCellClick();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
              >
                <span>Entendido, Iniciar Demanda! 🚀</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
    </div>
  );
};

export default SheetQuestGame;
