import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Volume2,
  VolumeX,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Scale,
  PlusCircle,
  MapPin,
  Target,
  Scissors,
  PieChart,
  GitCommit,
  Boxes,
  Zap
} from 'lucide-react';
import { BaseGameProps, GameExitPayload } from '../../../types/gamePlugin';
import {
  BALANCE_LEVELS,
  FRACTION_LEVELS,
  NUMBERLINE_LEVELS,
  BASETEN_LEVELS,
  BalanceLevel,
  FractionLevel,
  NumberLineLevel,
  BaseTenLevel,
  WeightItem
} from './mathStormLevels';
import { BalanceScaleCanvas } from './manipulatives/BalanceScaleCanvas';
import { FractionSlicerCanvas } from './manipulatives/FractionSlicerCanvas';
import { NumberLineJumperCanvas, JumpRecord } from './manipulatives/NumberLineJumperCanvas';
import { BaseTenBlocksCanvas } from './manipulatives/BaseTenBlocksCanvas';
import { StormBossArcadeCanvas } from './manipulatives/StormBossArcadeCanvas';
import { mathStormAudio } from './mathStormAudio';
import {
  CupheadStormIslandMap,
  StormIslandNode,
  StormDistrictId
} from './map/CupheadStormIslandMap';
import { CupheadFilter } from './map/CupheadFilter';

export interface MathStormGameProps extends BaseGameProps {
  initialLevelIndex?: number;
}

export const MathStormGame: React.FC<MathStormGameProps> = ({
  studentClass,
  difficultyMultiplier = 1.0,
  onExitToHub,
  initialLevelIndex = 0
}) => {
  // Modo de exibição: 'map' (Ilha Estilo Cuphead) ou 'gameplay'
  const [viewMode, setViewMode] = useState<'map' | 'gameplay'>('map');
  const [activeDistrict, setActiveDistrict] = useState<StormDistrictId>('balance');

  // Índice da fase dentro do distrito ativo
  const [currentLevelIndex, setCurrentLevelIndex] = useState(
    Math.min(Math.max(0, initialLevelIndex), BALANCE_LEVELS.length - 1)
  );

  // Registro de estrelas conquistadas por nó (id do nó -> 0..3)
  const [nodeStars, setNodeStars] = useState<Record<string, number>>({});

  // ==========================================================================
  // ESTADOS DOS MANIPULATIVOS
  // ==========================================================================

  // 1. Balança Quântica
  const [leftItems, setLeftItems] = useState<WeightItem[]>([]);
  const [rightItems, setRightItems] = useState<WeightItem[]>([]);
  const [userGuessInput, setUserGuessInput] = useState<string>('');

  // 2. Padaria das Frações
  const [currentDenominator, setCurrentDenominator] = useState<number>(4);
  const [selectedSlices, setSelectedSlices] = useState<number>(0);

  // 3. Ferrovia Numérica
  const [trainPosition, setTrainPosition] = useState<number>(0);
  const [jumpHistory, setJumpHistory] = useState<JumpRecord[]>([]);

  // 4. Fábrica Base 10
  const [hundreds, setHundreds] = useState<number>(0);
  const [tens, setTens] = useState<number>(0);
  const [units, setUnits] = useState<number>(0);

  // Estado geral de áudio e feedback
  const [isMuted, setIsMuted] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [isLevelSolved, setIsLevelSolved] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [solvedLevelsCount, setSolvedLevelsCount] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // ==========================================================================
  // CATÁLOGO COMPLETO DE NÓS DA ILHA (5 DISTRITOS)
  // ==========================================================================
  const islandNodes: StormIslandNode[] = [
    // DISTRITO 1: BALANÇA DE LATÃO
    ...BALANCE_LEVELS.map((lvl, idx) => ({
      id: `balance-${idx}`,
      district: 'balance' as StormDistrictId,
      levelIndex: idx,
      mode: 'balance' as StormDistrictId,
      title: lvl.title.replace(/^Fase \d+:\s*/, ''),
      subtitle: `${lvl.bnccCode} • Álgebra`,
      actName: `Ato ${idx + 1}: Equação`,
      x: [20, 35, 52, 68, 82][idx] || 50,
      y: [66, 42, 56, 38, 28][idx] || 50,
      stars: nodeStars[`balance-${idx}`] || 0,
      isUnlocked: true
    })),

    // DISTRITO 2: PADARIA DAS FRAÇÕES
    ...FRACTION_LEVELS.map((lvl, idx) => ({
      id: `fractions-${idx}`,
      district: 'fractions' as StormDistrictId,
      levelIndex: idx,
      mode: 'fractions' as StormDistrictId,
      title: lvl.title.replace(/^Padaria \d+:\s*/, ''),
      subtitle: `${lvl.bnccCode} • Frações`,
      actName: `Receita ${idx + 1}: ${lvl.targetEquation}`,
      x: [22, 42, 62, 80][idx] || 50,
      y: [65, 42, 55, 30][idx] || 50,
      stars: nodeStars[`fractions-${idx}`] || 0,
      isUnlocked: true
    })),

    // DISTRITO 3: FERROVIA NUMÉRICA
    ...NUMBERLINE_LEVELS.map((lvl, idx) => ({
      id: `numberline-${idx}`,
      district: 'numberline' as StormDistrictId,
      levelIndex: idx,
      mode: 'numberline' as StormDistrictId,
      title: lvl.title.replace(/^Ferrovia \d+:\s*/, ''),
      subtitle: `${lvl.bnccCode} • Reta`,
      actName: `Estação ${idx + 1}`,
      x: [22, 42, 62, 80][idx] || 50,
      y: [64, 40, 56, 30][idx] || 50,
      stars: nodeStars[`numberline-${idx}`] || 0,
      isUnlocked: true
    })),

    // DISTRITO 4: FÁBRICA BASE 10
    ...BASETEN_LEVELS.map((lvl, idx) => ({
      id: `baseten-${idx}`,
      district: 'baseten' as StormDistrictId,
      levelIndex: idx,
      mode: 'baseten' as StormDistrictId,
      title: lvl.title.replace(/^Fábrica \d+:\s*/, ''),
      subtitle: `${lvl.bnccCode} • Base 10`,
      actName: `Carga ${idx + 1}: ${lvl.targetValue}`,
      x: [22, 42, 62, 80][idx] || 50,
      y: [64, 40, 56, 30][idx] || 50,
      stars: nodeStars[`baseten-${idx}`] || 0,
      isUnlocked: true
    })),

    // DISTRITO 5: VÓRTICE CHEFÃO
    {
      id: 'boss-0',
      district: 'boss',
      levelIndex: 0,
      mode: 'boss',
      title: 'Senhor Cumulonimbus',
      subtitle: 'EF07MA18 • Cálculo Rápido',
      actName: 'Grande Batalha Final!',
      x: 52,
      y: 46,
      stars: nodeStars['boss-0'] || 0,
      isUnlocked: true,
      boss: true
    }
  ];

  // Obtém dados da fase ativa de acordo com o distrito
  const currentBalanceLevel: BalanceLevel =
    BALANCE_LEVELS[Math.min(currentLevelIndex, BALANCE_LEVELS.length - 1)];
  const currentFractionLevel: FractionLevel =
    FRACTION_LEVELS[Math.min(currentLevelIndex, FRACTION_LEVELS.length - 1)];
  const currentNumberLineLevel: NumberLineLevel =
    NUMBERLINE_LEVELS[Math.min(currentLevelIndex, NUMBERLINE_LEVELS.length - 1)];
  const currentBaseTenLevel: BaseTenLevel =
    BASETEN_LEVELS[Math.min(currentLevelIndex, BASETEN_LEVELS.length - 1)];

  const getDistrictLevelsCount = (dist: StormDistrictId) => {
    if (dist === 'balance') return BALANCE_LEVELS.length;
    if (dist === 'fractions') return FRACTION_LEVELS.length;
    if (dist === 'numberline') return NUMBERLINE_LEVELS.length;
    if (dist === 'baseten') return BASETEN_LEVELS.length;
    return 1;
  };

  // Carrega ou reinicia a fase atual do distrito ativo
  const loadCurrentStage = (dist: StormDistrictId, idx: number) => {
    setIsLevelSolved(false);
    setValidationError(null);

    if (dist === 'balance') {
      const lvl = BALANCE_LEVELS[Math.min(idx, BALANCE_LEVELS.length - 1)];
      setLeftItems(JSON.parse(JSON.stringify(lvl.initialLeftItems)));
      setRightItems(JSON.parse(JSON.stringify(lvl.initialRightItems)));
      setUserGuessInput('');
    } else if (dist === 'fractions') {
      const lvl = FRACTION_LEVELS[Math.min(idx, FRACTION_LEVELS.length - 1)];
      setCurrentDenominator(lvl.initialCutter);
      setSelectedSlices(0);
    } else if (dist === 'numberline') {
      const lvl = NUMBERLINE_LEVELS[Math.min(idx, NUMBERLINE_LEVELS.length - 1)];
      setTrainPosition(lvl.startPosition);
      setJumpHistory([]);
    } else if (dist === 'baseten') {
      const lvl = BASETEN_LEVELS[Math.min(idx, BASETEN_LEVELS.length - 1)];
      setHundreds(lvl.initialHundreds);
      setTens(lvl.initialTens);
      setUnits(lvl.initialUnits);
    }
  };

  useEffect(() => {
    loadCurrentStage(activeDistrict, currentLevelIndex);
  }, [activeDistrict, currentLevelIndex]);

  useEffect(() => {
    return () => {
      mathStormAudio.dispose();
    };
  }, []);

  // Registra vitória na fase atual
  const markStageSolved = () => {
    setValidationError(null);
    mathStormAudio.playBalancedChord();
    setIsLevelSolved(true);
    setSolvedLevelsCount((prev) => prev + 1);

    const nodeId = `${activeDistrict}-${currentLevelIndex}`;
    const earnedStars = wrongAttempts === 0 ? 3 : wrongAttempts === 1 ? 2 : 1;
    setNodeStars((prev) => ({
      ...prev,
      [nodeId]: Math.max(prev[nodeId] || 0, earnedStars)
    }));
  };

  // ==========================================================================
  // HANDLERS POR MODO
  // ==========================================================================

  // --- MODO 1: BALANÇA ---
  const handleRemoveItem = (side: 'left' | 'right', itemId: string) => {
    mathStormAudio.playRemoveWeight();
    if (side === 'left') {
      setLeftItems((prev) => prev.filter((it) => it.id !== itemId));
    } else {
      setRightItems((prev) => prev.filter((it) => it.id !== itemId));
    }
  };

  const handleAddWeight = (side: 'left' | 'right', weightValue: number) => {
    mathStormAudio.playPlaceWeight(weightValue);
    const newItem: WeightItem = {
      id: `${side}-k-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type: 'known',
      value: weightValue,
      label: `${weightValue}kg`
    };
    if (side === 'left') {
      setLeftItems((prev) => [...prev, newItem]);
    } else {
      setRightItems((prev) => [...prev, newItem]);
    }
  };

  const handleSubtractFromBothSides = (amount: number) => {
    const leftTotalKnown = leftItems
      .filter((i) => i.type === 'known')
      .reduce((acc, i) => acc + i.value, 0);
    const rightTotalKnown = rightItems
      .filter((i) => i.type === 'known')
      .reduce((acc, i) => acc + i.value, 0);

    if (leftTotalKnown < amount || rightTotalKnown < amount) {
      setValidationError(`Não é possível subtrair ${amount}kg de ambos os pratos ao mesmo tempo.`);
      return;
    }

    setValidationError(null);
    mathStormAudio.playLightningShock();

    let remainingLeft = amount;
    const newLeft: WeightItem[] = [];
    for (const it of leftItems) {
      if (it.type === 'known' && remainingLeft >= it.value) {
        remainingLeft -= it.value;
      } else {
        newLeft.push(it);
      }
    }

    let remainingRight = amount;
    const newRight: WeightItem[] = [];
    for (const it of rightItems) {
      if (it.type === 'known' && remainingRight >= it.value) {
        remainingRight -= it.value;
      } else {
        newRight.push(it);
      }
    }

    setLeftItems(newLeft);
    setRightItems(newRight);
  };

  const handleSubtractUnknownFromBoth = () => {
    const leftUnknowns = leftItems.filter((i) => i.type === 'unknown');
    const rightUnknowns = rightItems.filter((i) => i.type === 'unknown');

    if (leftUnknowns.length === 0 || rightUnknowns.length === 0) {
      setValidationError('É necessário haver caixas x em ambos os pratos para subtrair.');
      return;
    }

    setValidationError(null);
    mathStormAudio.playLightningShock();

    let removedLeft = false;
    const newLeft = leftItems.filter((it) => {
      if (!removedLeft && it.type === 'unknown') {
        removedLeft = true;
        return false;
      }
      return true;
    });

    let removedRight = false;
    const newRight = rightItems.filter((it) => {
      if (!removedRight && it.type === 'unknown') {
        removedRight = true;
        return false;
      }
      return true;
    });

    setLeftItems(newLeft);
    setRightItems(newRight);
  };

  // --- MODO 3: FERROVIA NUMÉRICA ---
  const handleTrainJump = (step: number) => {
    const nextPos = Number((trainPosition + step).toFixed(2));
    if (nextPos < currentNumberLineLevel.minVal || nextPos > currentNumberLineLevel.maxVal) {
      setValidationError('⚠️ Esse salto sairia para fora dos limites do trilho!');
      return;
    }
    setValidationError(null);
    mathStormAudio.playJumpSound(step > 0);
    setJumpHistory((prev) => [...prev, { from: trainPosition, to: nextPos, step }]);
    setTrainPosition(nextPos);
  };

  const handleUndoJump = () => {
    if (jumpHistory.length === 0) return;
    mathStormAudio.playRemoveWeight();
    const last = jumpHistory[jumpHistory.length - 1];
    setTrainPosition(last.from);
    setJumpHistory((prev) => prev.slice(0, -1));
  };

  // --- MODO 4: FÁBRICA BASE 10 ---
  const handleFuseTenUnits = () => {
    if (units < 10) return;
    mathStormAudio.playBlockFuseSound();
    setUnits((u) => u - 10);
    setTens((t) => t + 1);
  };

  const handleBreakOneTen = () => {
    if (tens < 1) return;
    mathStormAudio.playSliceSound();
    setTens((t) => t - 1);
    setUnits((u) => u + 10);
  };

  // ==========================================================================
  // VALIDAÇÃO GERAL DE CONFIRMAÇÃO
  // ==========================================================================
  const handleValidateCurrentStage = () => {
    if (activeDistrict === 'balance') {
      const num = parseInt(userGuessInput.trim(), 10);
      if (isNaN(num)) {
        setValidationError('Por favor, digite um número no campo x = [ ? ].');
        return;
      }
      if (num === currentBalanceLevel.unknownValue) {
        markStageSolved();
      } else {
        setWrongAttempts((prev) => prev + 1);
        setValidationError(
          `Ainda não! Com x = ${num}kg, os pratos não se equilibrariam. Veja a balança ou use a dica!`
        );
      }
    } else if (activeDistrict === 'fractions') {
      const ratio = selectedSlices / currentDenominator;
      const targetRatio =
        currentFractionLevel.targetNumerator / currentFractionLevel.targetDenominator;
      const denomOk =
        !currentFractionLevel.requiredDenominator ||
        currentDenominator === currentFractionLevel.requiredDenominator;

      if (Math.abs(ratio - targetRatio) < 0.001 && denomOk) {
        markStageSolved();
      } else if (!denomOk) {
        setWrongAttempts((prev) => prev + 1);
        setValidationError(
          `Esta missão exige usar o cortador de ÷${currentFractionLevel.requiredDenominator} fatias!`
        );
      } else {
        setWrongAttempts((prev) => prev + 1);
        setValidationError(
          `A bandeja tem ${selectedSlices}/${currentDenominator}, mas o pedido é ${currentFractionLevel.targetNumerator}/${currentFractionLevel.targetDenominator}!`
        );
      }
    } else if (activeDistrict === 'numberline') {
      if (Math.abs(trainPosition - currentNumberLineLevel.targetPosition) < 0.001) {
        markStageSolved();
      } else {
        setWrongAttempts((prev) => prev + 1);
        setValidationError(
          `A locomotiva está no marco ${trainPosition}, mas a bandeira de chegada fica em ${currentNumberLineLevel.targetPosition}!`
        );
      }
    } else if (activeDistrict === 'baseten') {
      const total = hundreds * 100 + tens * 10 + units;
      const canonicalOk = !currentBaseTenLevel.requireCanonicalForm || (units < 10 && tens < 10);
      if (total === currentBaseTenLevel.targetValue && canonicalOk) {
        markStageSolved();
      } else if (total === currentBaseTenLevel.targetValue && !canonicalOk) {
        setValidationError(
          `Você formou ${total}, mas há ${units} unidades soltas! Clique em "FUNDIR 10 UNIDADES → 1 DEZENA" para organizar!`
        );
      } else {
        setWrongAttempts((prev) => prev + 1);
        setValidationError(
          `A bancada tem ${total}, mas a encomenda pede exatamente ${currentBaseTenLevel.targetValue}!`
        );
      }
    }
  };

  // Avançar para a próxima fase ou distrito
  const handleNextLevel = () => {
    const count = getDistrictLevelsCount(activeDistrict);
    if (currentLevelIndex < count - 1) {
      setCurrentLevelIndex((prev) => prev + 1);
    } else {
      setIsLevelSolved(false);
      setViewMode('map');
    }
  };

  // Encerrar e voltar ao Hub
  const handleFinishGame = () => {
    const timeSpent = Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
    const baseBytes = solvedLevelsCount * 120 + 50;

    const payload: GameExitPayload = {
      bytesEarned: baseBytes,
      levelTokensEarned: solvedLevelsCount >= 3 ? 1 : 0,
      sessionStats: {
        score: solvedLevelsCount * 250,
        accuracyPercentage: Math.max(
          40,
          Math.round((solvedLevelsCount / (solvedLevelsCount + wrongAttempts || 1)) * 100)
        ),
        timeSpentSeconds: timeSpent,
        correctAnswers: solvedLevelsCount,
        wrongAnswers: wrongAttempts,
        levelReached: currentLevelIndex + 1,
        extraMetrics: {
          district: activeDistrict
        }
      }
    };

    onExitToHub(payload);
  };

  // ==========================================================================
  // DETECÇÃO DE META ATINGIDA NA BANCADA (PARA ACENDER O PAINEL INFERIOR)
  // ==========================================================================
  const leftTotalWeight = leftItems.reduce((acc, it) => acc + it.value, 0);
  const rightTotalWeight = rightItems.reduce((acc, it) => acc + it.value, 0);
  const isScaleBalanced = leftTotalWeight === rightTotalWeight && leftTotalWeight > 0;
  const leftOnlyUnknowns = leftItems.length > 0 && leftItems.every((i) => i.type === 'unknown');
  const rightOnlyKnowns = rightItems.length > 0 && rightItems.every((i) => i.type === 'known');
  const isBalanceReady = leftOnlyUnknowns && rightOnlyKnowns && isScaleBalanced;

  const isFractionReady =
    Math.abs(
      selectedSlices / currentDenominator -
        currentFractionLevel.targetNumerator / currentFractionLevel.targetDenominator
    ) < 0.001 &&
    (!currentFractionLevel.requiredDenominator ||
      currentDenominator === currentFractionLevel.requiredDenominator);

  const isNumberLineReady =
    Math.abs(trainPosition - currentNumberLineLevel.targetPosition) < 0.001;

  const isBaseTenReady =
    hundreds * 100 + tens * 10 + units === currentBaseTenLevel.targetValue &&
    (!currentBaseTenLevel.requireCanonicalForm || (units < 10 && tens < 10));

  const isGoalReady =
    activeDistrict === 'balance'
      ? isBalanceReady
      : activeDistrict === 'fractions'
      ? isFractionReady
      : activeDistrict === 'numberline'
      ? isNumberLineReady
      : activeDistrict === 'baseten'
      ? isBaseTenReady
      : false;

  const hasUnknownOnBothSides =
    leftItems.some((i) => i.type === 'unknown') && rightItems.some((i) => i.type === 'unknown');

  const totalStars = Object.values(nodeStars).reduce((acc, v) => acc + v, 0);
  const maxStars = islandNodes.length * 3;

  // Metadados ativos para o cabeçalho, banner e modal de dica
  const activeMeta =
    activeDistrict === 'balance'
      ? {
          districtTitle: 'A BALANÇA DE LATÃO',
          title: currentBalanceLevel.title,
          subtitle: currentBalanceLevel.subtitle,
          targetEquation: currentBalanceLevel.targetEquation,
          bnccCode: currentBalanceLevel.bnccCode,
          hint: currentBalanceLevel.pedagogicalHint,
          steps: currentBalanceLevel.scaffoldingSteps,
          solvedText: `x = ${currentBalanceLevel.unknownValue} kg`
        }
      : activeDistrict === 'fractions'
      ? {
          districtTitle: 'A PADARIA DAS FRAÇÕES',
          title: currentFractionLevel.title,
          subtitle: currentFractionLevel.subtitle,
          targetEquation: currentFractionLevel.targetEquation,
          bnccCode: currentFractionLevel.bnccCode,
          hint: currentFractionLevel.pedagogicalHint,
          steps: currentFractionLevel.scaffoldingSteps,
          solvedText: `${selectedSlices} / ${currentDenominator} servido!`
        }
      : activeDistrict === 'numberline'
      ? {
          districtTitle: 'FERROVIA DOS SALTOS',
          title: currentNumberLineLevel.title,
          subtitle: currentNumberLineLevel.subtitle,
          targetEquation: currentNumberLineLevel.targetEquation,
          bnccCode: currentNumberLineLevel.bnccCode,
          hint: currentNumberLineLevel.pedagogicalHint,
          steps: currentNumberLineLevel.scaffoldingSteps,
          solvedText: `Estação ${currentNumberLineLevel.targetPosition} alcançada!`
        }
      : activeDistrict === 'baseten'
      ? {
          districtTitle: 'FÁBRICA DE BLOCOS BASE 10',
          title: currentBaseTenLevel.title,
          subtitle: currentBaseTenLevel.subtitle,
          targetEquation: currentBaseTenLevel.targetEquation,
          bnccCode: currentBaseTenLevel.bnccCode,
          hint: currentBaseTenLevel.pedagogicalHint,
          steps: currentBaseTenLevel.scaffoldingSteps,
          solvedText: `Carga ${currentBaseTenLevel.targetValue} despachada!`
        }
      : {
          districtTitle: 'VÓRTICE DA TEMPESTADE',
          title: 'A Grande Batalha contra o Senhor Cumulonimbus',
          subtitle: 'Neutralize os 5 raios matemáticos para vencer o Chefão da Ilha!',
          targetEquation: '5 RAIOS',
          bnccCode: 'EF07MA18',
          hint: 'Resolva o cálculo mental exibido e clique no para-raios correspondente!',
          steps: ['Leia a operação no raio.', 'Clique no botão com o resultado exato!'],
          solvedText: 'CHEFÃO DERROTADO!'
        };

  // ==========================================================================
  // MODO MAPA DA ILHA
  // ==========================================================================
  if (viewMode === 'map') {
    return (
      <CupheadStormIslandMap
        nodes={islandNodes}
        activeDistrict={activeDistrict}
        onSelectDistrict={(dist) => setActiveDistrict(dist)}
        totalStars={totalStars}
        maxStars={maxStars}
        onSelectNode={(node) => {
          setActiveDistrict(node.district);
          setCurrentLevelIndex(node.levelIndex);
          setViewMode('gameplay');
        }}
        onExit={handleFinishGame}
      />
    );
  }

  // ==========================================================================
  // MODO GAMEPLAY (TODOS OS 5 DISTRITOS NA ESTÉTICA CUPHEAD)
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#f7eed4] text-[#24140b] flex flex-col justify-between font-sans relative selection:bg-[#ffd95a] selection:text-black overflow-x-hidden">
      <CupheadFilter id="gameplay-cuphead-fx" />

      {/* TEXTURA DE PAPEL E FILME ANTIGO 1930s */}
      <div className="absolute inset-0 bg-[radial-gradient(#8c5828_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute inset-0 bg-[#d49742]/10 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(69,26,3,0.35)_100%)] pointer-events-none z-30" />

      {/* HEADER SUPERIOR EXPANDIDO */}
      <header className="relative z-40 px-6 sm:px-10 py-3.5 bg-[#fdf5df] border-b-5 border-[#24140b] shadow-[0_6px_0_#24140b] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode('map')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#ffd95a] hover:bg-[#ffe58f] text-[#24140b] font-serif font-black text-sm border-4 border-[#24140b] shadow-[0_4px_0_#24140b] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <MapPin className="w-5 h-5" />
            <span>MAPA DA ILHA</span>
          </button>

          <button
            onClick={handleFinishGame}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#fdf5df] hover:bg-[#faeac4] text-[#24140b] font-serif font-black text-sm border-3 border-[#24140b] shadow-[0_3px_0_#24140b] active:translate-y-1 transition-all cursor-pointer"
          >
            <span>HUB</span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l-3 border-[#24140b]/30">
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-wide text-[#24140b] font-serif uppercase">
                {activeMeta.districtTitle}
              </h1>
              <p className="text-xs sm:text-sm font-serif font-black text-[#7f5326]">
                MANIPULATIVO CONCRETO • BNCC {activeMeta.bnccCode}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-5 py-2 rounded-2xl bg-[#fdf5df] border-4 border-[#24140b] font-serif text-sm sm:text-base font-black text-[#24140b] shadow-[0_4px_0_#24140b]">
            FASE {currentLevelIndex + 1} DE {getDistrictLevelsCount(activeDistrict)}
          </div>

          <button
            onClick={() => {
              const muted = mathStormAudio.toggleMute();
              setIsMuted(muted);
            }}
            className="p-2.5 rounded-2xl bg-[#fdf5df] hover:bg-[#faeac4] text-[#24140b] border-3 border-[#24140b] shadow-[0_3px_0_#24140b] transition-all cursor-pointer"
            title={isMuted ? 'Ativar Som' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-6 h-6 text-red-600" /> : <Volume2 className="w-6 h-6 text-[#24140b]" />}
          </button>

          <button
            onClick={() => setShowHintModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#ffd95a] hover:bg-[#ffe58f] text-[#24140b] border-4 border-[#24140b] shadow-[0_4px_0_#24140b] text-sm font-serif font-black transition-all cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" />
            <span>DICA</span>
          </button>
        </div>
      </header>

      {/* ÁREA CENTRAL DO JOGO */}
      <main className="relative z-30 flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6 flex flex-col justify-center gap-4">
        {/* BANNER DESPOLUÍDO COM EQUAÇÃO/META EM LINHA ÚNICA (SEM QUEBRAS) */}
        <div className="bg-[#fdf5df] border-5 border-[#24140b] rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_8px_0_#24140b]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ffd95a] border-3 border-[#24140b] flex items-center justify-center shadow-[0_3px_0_#24140b] shrink-0">
              <Target className="w-7 h-7 text-[#24140b]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-serif font-black text-[#7f5326] uppercase tracking-wider block">
                {activeMeta.title}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#24140b] uppercase">
                {activeMeta.subtitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-[#faeac4] border-4 border-[#24140b] shadow-[0_4px_0_#24140b] min-w-[260px] justify-center">
            <span className="text-xs sm:text-sm font-serif font-black text-[#7f5326] uppercase">META:</span>
            <span className="text-3xl sm:text-4xl font-serif font-black text-[#24140b] tracking-wider whitespace-nowrap">
              {activeMeta.targetEquation}
            </span>
          </div>
        </div>

        {/* ====================================================================
            RENDERIZAÇÃO DO MANIPULATIVO ATIVO + BANCADA DE FERRAMENTAS
           ==================================================================== */}

        {/* 1. BALANÇA QUÂNTICA */}
        {activeDistrict === 'balance' && (
          <>
            <BalanceScaleCanvas
              leftItems={leftItems}
              rightItems={rightItems}
              onRemoveItem={handleRemoveItem}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#fdf5df] border-4 border-[#24140b] rounded-3xl p-3.5 flex flex-col gap-2 shadow-[0_5px_0_#24140b]">
                <span className="text-xs sm:text-sm font-serif font-black text-[#24140b] uppercase flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  Adicionar no Prato Esquerdo
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentBalanceLevel.availableInventory.knownWeights.map((w) => (
                    <button
                      key={`add-left-${w}`}
                      onClick={() => handleAddWeight('left', w)}
                      className="px-3.5 py-1.5 rounded-2xl bg-[#2ecc71] hover:bg-[#27ae60] border-3 border-[#24140b] text-[#24140b] text-sm font-serif font-black shadow-[0_3px_0_#24140b] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                    >
                      +{w}kg
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#fdf5df] border-4 border-[#24140b] rounded-3xl p-3.5 flex flex-col gap-2 shadow-[0_5px_0_#24140b]">
                <span className="text-xs sm:text-sm font-serif font-black text-[#24140b] uppercase flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#e67e22]" />
                  Propriedade da Igualdade (Ambos)
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSubtractFromBothSides(1)}
                    className="px-3.5 py-1.5 rounded-2xl bg-[#ffd95a] hover:bg-[#ffe58f] border-3 border-[#24140b] text-[#24140b] text-xs sm:text-sm font-serif font-black shadow-[0_3px_0_#24140b] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                  >
                    -1kg de ambos
                  </button>
                  <button
                    onClick={() => handleSubtractFromBothSides(2)}
                    className="px-3.5 py-1.5 rounded-2xl bg-[#ffd95a] hover:bg-[#ffe58f] border-3 border-[#24140b] text-[#24140b] text-xs sm:text-sm font-serif font-black shadow-[0_3px_0_#24140b] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                  >
                    -2kg de ambos
                  </button>
                  {hasUnknownOnBothSides && (
                    <button
                      onClick={handleSubtractUnknownFromBoth}
                      className="px-3.5 py-1.5 rounded-2xl bg-[#9b59b6] hover:bg-[#8e44ad] border-3 border-[#24140b] text-white text-xs sm:text-sm font-serif font-black shadow-[0_3px_0_#24140b] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                    >
                      -1 caixa [x] de ambos
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-[#fdf5df] border-4 border-[#24140b] rounded-3xl p-3.5 flex flex-col gap-2 shadow-[0_5px_0_#24140b]">
                <span className="text-xs sm:text-sm font-serif font-black text-[#24140b] uppercase flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  Adicionar no Prato Direito
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentBalanceLevel.availableInventory.knownWeights.map((w) => (
                    <button
                      key={`add-right-${w}`}
                      onClick={() => handleAddWeight('right', w)}
                      className="px-3.5 py-1.5 rounded-2xl bg-[#2ecc71] hover:bg-[#27ae60] border-3 border-[#24140b] text-[#24140b] text-sm font-serif font-black shadow-[0_3px_0_#24140b] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                    >
                      +{w}kg
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* 2. PADARIA DAS FRAÇÕES */}
        {activeDistrict === 'fractions' && (
          <>
            <FractionSlicerCanvas
              level={currentFractionLevel}
              currentDenominator={currentDenominator}
              selectedSlices={selectedSlices}
              onChangeDenominator={(d) => {
                mathStormAudio.playSliceSound();
                setCurrentDenominator(d);
                setSelectedSlices(0);
              }}
              onChangeSelectedSlices={(s) => setSelectedSlices(s)}
            />

            <div className="bg-[#fdf5df] border-4 border-[#24140b] rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-[0_5px_0_#24140b]">
              <span className="text-sm sm:text-base font-serif font-black text-[#24140b] uppercase flex items-center gap-2">
                <Scissors className="w-5 h-5 text-[#e67e22]" />
                ESCOLHA O CORTADOR DE FATIAS (DENOMINADOR):
              </span>
              <div className="flex flex-wrap gap-3">
                {currentFractionLevel.availableCutters.map((cutter) => (
                  <button
                    key={`cutter-${cutter}`}
                    onClick={() => {
                      mathStormAudio.playSliceSound();
                      setCurrentDenominator(cutter);
                      setSelectedSlices(0);
                    }}
                    className={`px-5 py-2 rounded-2xl border-3 border-[#24140b] font-serif font-black text-base transition-all cursor-pointer ${
                      currentDenominator === cutter
                        ? 'bg-[#e67e22] text-white shadow-[0_4px_0_#24140b] -translate-y-0.5'
                        : 'bg-[#faeac4] hover:bg-[#ffd95a] text-[#24140b] shadow-[0_3px_0_#24140b]'
                    }`}
                  >
                    ÷{cutter} Fatias
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 3. FERROVIA DOS SALTOS */}
        {activeDistrict === 'numberline' && (
          <>
            <NumberLineJumperCanvas
              level={currentNumberLineLevel}
              currentPosition={trainPosition}
              jumpHistory={jumpHistory}
              onUndoJump={handleUndoJump}
            />

            <div className="bg-[#fdf5df] border-4 border-[#24140b] rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-[0_5px_0_#24140b]">
              <span className="text-sm sm:text-base font-serif font-black text-[#24140b] uppercase flex items-center gap-2">
                🚂 CARTÕES DE PROPULSÃO (CLIQUE PARA SALTAR NA RETA):
              </span>
              <div className="flex flex-wrap gap-3">
                {currentNumberLineLevel.availableJumps.map((jmp) => {
                  const isPos = jmp > 0;
                  return (
                    <button
                      key={`jump-btn-${jmp}`}
                      onClick={() => handleTrainJump(jmp)}
                      className={`px-6 py-2.5 rounded-2xl border-3 border-[#24140b] font-serif font-black text-lg shadow-[0_4px_0_#24140b] active:translate-y-1 active:shadow-none transition-all cursor-pointer ${
                        isPos
                          ? 'bg-[#2ecc71] hover:bg-[#27ae60] text-[#24140b]'
                          : 'bg-[#e74c3c] hover:bg-[#c0392b] text-white'
                      }`}
                    >
                      {isPos ? `+${jmp}` : jmp}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* 4. FÁBRICA BASE 10 */}
        {activeDistrict === 'baseten' && (
          <>
            <BaseTenBlocksCanvas
              level={currentBaseTenLevel}
              hundreds={hundreds}
              tens={tens}
              units={units}
              onRemoveHundred={() => {
                mathStormAudio.playRemoveWeight();
                setHundreds((h) => Math.max(0, h - 1));
              }}
              onRemoveTen={() => {
                mathStormAudio.playRemoveWeight();
                setTens((t) => Math.max(0, t - 1));
              }}
              onRemoveUnit={() => {
                mathStormAudio.playRemoveWeight();
                setUnits((u) => Math.max(0, u - 1));
              }}
              onFuseTenUnits={handleFuseTenUnits}
              onBreakOneTen={handleBreakOneTen}
            />

            <div className="bg-[#fdf5df] border-4 border-[#24140b] rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-[0_5px_0_#24140b]">
              <span className="text-sm sm:text-base font-serif font-black text-[#24140b] uppercase flex items-center gap-2">
                🧱 ADICIONAR BLOCOS NA BANCADA:
              </span>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    mathStormAudio.playPlaceWeight(10);
                    setHundreds((h) => h + 1);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-[#9b59b6] hover:bg-[#8e44ad] border-3 border-[#24140b] text-white font-serif font-black text-sm sm:text-base shadow-[0_4px_0_#24140b] active:translate-y-1 cursor-pointer"
                >
                  +1 Centena (+100)
                </button>
                <button
                  onClick={() => {
                    mathStormAudio.playPlaceWeight(5);
                    setTens((t) => t + 1);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-[#ffd95a] hover:bg-[#ffe58f] border-3 border-[#24140b] text-[#24140b] font-serif font-black text-sm sm:text-base shadow-[0_4px_0_#24140b] active:translate-y-1 cursor-pointer"
                >
                  +1 Dezena (+10)
                </button>
                <button
                  onClick={() => {
                    mathStormAudio.playPlaceWeight(1);
                    setUnits((u) => u + 1);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-[#2ecc71] hover:bg-[#27ae60] border-3 border-[#24140b] text-[#24140b] font-serif font-black text-sm sm:text-base shadow-[0_4px_0_#24140b] active:translate-y-1 cursor-pointer"
                >
                  +1 Unidade (+1)
                </button>
              </div>
            </div>
          </>
        )}

        {/* 5. VÓRTICE CHEFÃO */}
        {activeDistrict === 'boss' && (
          <StormBossArcadeCanvas
            onBossDefeated={() => markStageSolved()}
            onWrongAnswer={() => setWrongAttempts((w) => w + 1)}
          />
        )}

        {/* PAINEL DE OBJETIVO E RESOLUÇÃO: CLARO, INTUITIVO E REATIVO (EXCETO NO BOSS QUE É AUTOMÁTICO) */}
        {activeDistrict !== 'boss' && (
          <div
            className={`border-5 border-[#24140b] rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-500 shadow-[0_8px_0_#24140b] ${
              isGoalReady ? 'bg-[#ffd95a] ring-4 ring-emerald-500' : 'bg-[#fdf5df]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-[#9b59b6] border-4 border-[#24140b] flex items-center justify-center font-serif font-black text-2xl text-white shadow-[0_4px_0_#24140b] shrink-0">
                {activeDistrict === 'balance'
                  ? 'x'
                  : activeDistrict === 'fractions'
                  ? '🥧'
                  : activeDistrict === 'numberline'
                  ? '🚂'
                  : '🧱'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-serif font-black uppercase px-2.5 py-0.5 rounded-full bg-[#faeac4] border-2 border-[#24140b] text-[#7f5326]">
                    OBJETIVO FINAL DA FASE
                  </span>
                  {isGoalReady && (
                    <span className="text-xs font-serif font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-600 text-white border-2 border-[#24140b] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> PRONTO PARA CONFIRMAR!
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-black uppercase text-[#24140b] mt-0.5">
                  {activeDistrict === 'balance'
                    ? isGoalReady
                      ? 'A caixa [X] está isolada! Digite o peso descoberto e confirme:'
                      : 'Descubra quanto pesa a Caixa Misteriosa [x]'
                    : isGoalReady
                    ? 'Meta atingida na bancada! Clique em CONFIRMAR para concluir!'
                    : 'Manipule as peças acima até atingir a meta e clique em CONFIRMAR'}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {activeDistrict === 'balance' && (
                <div
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border-4 border-[#24140b] shadow-[0_4px_0_#24140b] transition-colors ${
                    isGoalReady ? 'bg-white ring-2 ring-[#24140b]' : 'bg-[#faeac4]'
                  }`}
                >
                  <span className="font-serif text-xl sm:text-2xl text-[#24140b] font-black">x =</span>
                  <input
                    type="number"
                    value={userGuessInput}
                    onChange={(e) => setUserGuessInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleValidateCurrentStage()}
                    placeholder="?"
                    className="w-18 bg-transparent text-2xl sm:text-3xl font-serif font-black text-[#24140b] focus:outline-none text-center"
                  />
                  <span className="font-serif text-sm font-black text-[#7f5326]">kg</span>
                </div>
              )}

              <button
                onClick={handleValidateCurrentStage}
                className={`px-8 py-3.5 rounded-2xl border-4 border-[#24140b] text-[#24140b] font-serif font-black text-base shadow-[0_5px_0_#24140b] active:translate-y-1 active:shadow-none transition-all cursor-pointer uppercase tracking-wider ${
                  isGoalReady
                    ? 'bg-emerald-400 hover:bg-emerald-300 scale-105'
                    : 'bg-[#ffd95a] hover:bg-[#ffe58f]'
                }`}
              >
                CONFIRMAR
              </button>

              <button
                onClick={() => loadCurrentStage(activeDistrict, currentLevelIndex)}
                className="p-3 rounded-2xl bg-[#faeac4] hover:bg-[#edd49e] text-[#24140b] border-3 border-[#24140b] shadow-[0_3px_0_#24140b] transition-all cursor-pointer"
                title="Reiniciar esta fase para a posição inicial"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* MENSAGEM DE ERRO PEDAGÓGICA (ANDAIME) */}
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-[#fcdbd7] border-4 border-[#c0392b] text-[#962d22] text-sm sm:text-base font-serif font-black shadow-[0_4px_0_#c0392b] flex items-center justify-between"
          >
            <span>💡 {validationError}</span>
            <button
              onClick={() => setValidationError(null)}
              className="text-[#962d22] hover:text-[#24140b] font-black ml-4 text-xl"
            >
              ×
            </button>
          </motion.div>
        )}
      </main>

      {/* MODAL DE DICA PEDAGÓGICA DO BYTEZINHO */}
      <AnimatePresence>
        {showHintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-lg w-full bg-[#fdf5df] border-6 border-[#24140b] rounded-3xl p-6 sm:p-8 shadow-[0_12px_0_#24140b] text-[#24140b]"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-3xl bg-[#ffd95a] border-4 border-[#24140b] shadow-[0_4px_0_#24140b] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 fill-[#e67e22] text-[#24140b]" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-black uppercase text-[#24140b]">
                    Dica do Bytezinho!
                  </h3>
                  <p className="text-xs sm:text-sm font-serif font-black text-[#7f5326]">
                    Habilidade BNCC {activeMeta.bnccCode}
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#faeac4] border-4 border-[#24140b] text-sm sm:text-base font-serif font-bold text-[#452815] leading-relaxed mb-5 shadow-inner">
                {activeMeta.hint}
              </div>

              <div className="space-y-3 mb-6">
                <span className="text-xs sm:text-sm font-serif uppercase tracking-wider font-black text-[#7f5326]">
                  Passo a passo sugerido:
                </span>
                {activeMeta.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm sm:text-base font-serif text-[#24140b]">
                    <span className="w-6 h-6 rounded-full bg-[#ffd95a] border-2 border-[#24140b] text-[#24140b] font-serif font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {idx + 1}
                    </span>
                    <span className="font-bold">{step}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowHintModal(false)}
                className="w-full py-4 rounded-2xl bg-[#ffd95a] hover:bg-[#ffe58f] border-4 border-[#24140b] text-[#24140b] font-serif font-black text-base uppercase shadow-[0_5px_0_#24140b] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                ENTENDI, VAMOS NESSA!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE SUCESSO / FASE CONCLUÍDA */}
      <AnimatePresence>
        {isLevelSolved && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="max-w-lg w-full bg-[#fdf5df] border-7 border-[#24140b] rounded-3xl p-6 sm:p-8 shadow-[0_14px_0_#24140b] text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#ffd95a] border-5 border-[#24140b] shadow-[0_5px_0_#24140b] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-700" />
              </div>

              <span className="px-4 py-1.5 rounded-full bg-[#faeac4] border-3 border-[#24140b] text-xs font-serif font-black text-[#7f5326] uppercase tracking-wider mb-2">
                ATO CONCLUÍDO COM SUCESSO!
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#24140b] uppercase">
                {activeMeta.solvedText}
              </h2>
              <p className="text-sm font-serif font-bold text-[#5c3e21] mt-2 max-w-sm">
                Excelente raciocínio matemático! A Inkwell Isle celebra sua conquista!
              </p>

              <div className="my-6 w-full p-4 rounded-2xl bg-[#faeac4] border-4 border-[#24140b] shadow-[0_4px_0_#24140b] flex items-center justify-around font-serif text-sm">
                <div>
                  <span className="text-[#7f5326] block text-xs font-black uppercase">RECOMPENSA</span>
                  <span className="text-[#24140b] font-black text-lg">+120 Bytes</span>
                </div>
                <div className="h-10 w-px bg-[#24140b]/30" />
                <div>
                  <span className="text-[#7f5326] block text-xs font-black uppercase">HABILIDADE</span>
                  <span className="text-indigo-800 font-black text-lg">{activeMeta.bnccCode}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full">
                <button
                  onClick={() => {
                    setIsLevelSolved(false);
                    setViewMode('map');
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-[#faeac4] hover:bg-[#edd49e] border-4 border-[#24140b] text-[#24140b] font-serif font-black text-sm uppercase shadow-[0_5px_0_#24140b] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  MAPA DA ILHA 🗺️
                </button>
                <button
                  onClick={handleNextLevel}
                  className="flex-1 py-3.5 rounded-2xl bg-[#ffd95a] hover:bg-[#ffe58f] border-4 border-[#24140b] text-[#24140b] font-serif font-black text-sm uppercase shadow-[0_5px_0_#24140b] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  {currentLevelIndex < getDistrictLevelsCount(activeDistrict) - 1
                    ? 'PRÓXIMA FASE ▶'
                    : 'VOLTAR À ILHA 🏆'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MathStormGame;
