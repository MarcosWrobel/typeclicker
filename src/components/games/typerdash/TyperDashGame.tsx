import React,{ useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
Play,
RotateCcw,
Volume2,
VolumeX,
Pause,
Shield,
Crosshair,
Zap,
Trophy,
ArrowLeft,
Flame,
Award,
Check,
Sparkles,
Flag,
Target,Timer
} from 'lucide-react';
import { GamePluginProps, GameExitPayload } from '../../../types/gamePlugin';
import { BytezinhoSkinId } from '../../../types/cosmetics';
import { TyperDashStats } from '../../../types';
import { LeaderboardMetric } from '../../LeaderboardModal';
import { BYTEZINHO_SKINS } from '../../../constants/themes';
import { BytezinhoAvatar } from '../../BytezinhoAvatar';
import { typerDashAudio, TyperDashMusicStage } from './typerDashAudio';
import {
TyperDashCanvas,
renderTyperDash,
DashCubeState,
DashObstacle,
DashParticle,
DashFloatingText,
DashGhostTrail,
DashDenshaPopup
} from './TyperDashCanvas';

// Teclas Pedagógicas: Mão Esquerda (Solo/Espinhos)
const LEFT_HAND_KEYS = ['A', 'S', 'D', 'F'];
// Teclas Pedagógicas: Mão Direita e Superiores (Jump Orbs e Plataformas)
const AIR_KEYS = ['J', 'K', 'L', 'E', 'I'];
// Linha Guia Básica
const HOME_ROW_KEYS = ['A', 'S', 'D', 'F', 'J', 'K', 'L'];
// Cascades / Rolls para fases de alta velocidade
const CASCADE_PATTERNS = [
  ['A', 'S', 'D'],
  ['S', 'D', 'F'],
  ['J', 'K', 'L'],
  ['K', 'L', 'J']
];

// Sequências Direcionais e Simétricas de Varredura para Rampas de Manobras (Denshattack!)
const DIRECTIONAL_SWEEPS = [
  { sequence: ['A', 'S', 'D'], name: 'RAIL SLIDE', subtitle: 'LEFT SWEEP' },
  { sequence: ['D', 'S', 'A'], name: 'REVERSE DRIFT', subtitle: 'INWARD SWEEP' },
  { sequence: ['S', 'D', 'F'], name: 'TURBO KICK', subtitle: 'FORWARD DRIVE' },
  { sequence: ['F', 'D', 'S'], name: 'BACK-FLIP', subtitle: 'RETRO ROLL' },
  { sequence: ['J', 'K', 'L'], name: '360 AIR SPIN', subtitle: 'RIGHT SWEEP' },
  { sequence: ['L', 'K', 'J'], name: 'NEON TAILSLIDE', subtitle: 'RIGHT REVERSE' }
];

const GRIND_KEYS = ['F', 'J', 'D', 'K', 'S'];

const CLASS_OPTIONS = [
  {
    id: 'warrior' as const,
    name: 'Guerreiro',
    tagline: 'Sobrevivência & Escudo',
    keyNumber: '1',
    themeColor: '#10b981',
    borderClass: 'border-emerald-500',
    ringClass: 'ring-emerald-400',
    bgGradient: 'from-emerald-950/50 via-zinc-900/90 to-zinc-950',
    accentText: 'text-emerald-400',
    activeGlow: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
    icon: Shield,
    passiveTitle: 'Escudo Rúnico (Aegis)',
    passiveDesc: 'Absorve a 1ª colisão letal sem morrer! Concede 1.5s de invulnerabilidade e protege seu combo.',
    focusText: 'Mão Esquerda (Linha Guia A, S, D, F)',
    stats: [
      { label: 'Defesa', score: 5 },
      { label: 'Tolerância', score: 5 },
      { label: 'Dificuldade', score: 1 }
    ]
  },
  {
    id: 'archer' as const,
    name: 'Arqueiro',
    tagline: 'Precisão Cirúrgica & Score',
    keyNumber: '2',
    themeColor: '#f59e0b',
    borderClass: 'border-amber-500',
    ringClass: 'ring-amber-400',
    bgGradient: 'from-amber-950/50 via-zinc-900/90 to-zinc-950',
    accentText: 'text-amber-400',
    activeGlow: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]',
    badgeBg: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
    icon: Crosshair,
    passiveTitle: 'Foco do Atirador (+28% Perfect)',
    passiveDesc: 'Janela de timing do PERFECT ampliada para 160ms. Multiplicador de combo acelera +50% mais rápido.',
    focusText: 'Orbs e Saltos Aéreos (J, K, L, E, I)',
    stats: [
      { label: 'Pontuação', score: 5 },
      { label: 'Precisão', score: 5 },
      { label: 'Dificuldade', score: 4 }
    ]
  },
  {
    id: 'mage' as const,
    name: 'Mago',
    tagline: 'Metrônomo Arcano 130 BPM',
    keyNumber: '3',
    themeColor: '#06b6d4',
    borderClass: 'border-cyan-500',
    ringClass: 'ring-cyan-400',
    bgGradient: 'from-cyan-950/50 via-zinc-900/90 to-zinc-950',
    accentText: 'text-cyan-400',
    activeGlow: 'shadow-[0_0_25px_rgba(6,182,212,0.35)]',
    badgeBg: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300',
    icon: Zap,
    passiveTitle: 'Sintonia Rítmica Audiovisual',
    passiveDesc: 'Metrônomo sonoro contínuo pulsando nos 4 tempos do compasso, marcando o timing exato para tocar as teclas.',
    focusText: 'Coordenação Rítmica e Alternância',
    stats: [
      { label: 'Ritmo', score: 5 },
      { label: 'Sincronia', score: 5 },
      { label: 'Dificuldade', score: 3 }
    ]
  },
  {
    id: 'rogue' as const,
    name: 'Ladino',
    tagline: 'Overdrive Turbo & Frenesi',
    keyNumber: '4',
    themeColor: '#f43f5e',
    borderClass: 'border-rose-500',
    ringClass: 'ring-rose-400',
    bgGradient: 'from-rose-950/50 via-zinc-900/90 to-zinc-950',
    accentText: 'text-rose-400',
    activeGlow: 'shadow-[0_0_25px_rgba(244,63,94,0.35)]',
    badgeBg: 'bg-rose-500/20 border-rose-500/50 text-rose-300',
    icon: Flame,
    passiveTitle: 'Adrenalina Turbo (+50% Tricks)',
    passiveDesc: 'Multiplicador acelerado de frenesi. Concede +50% de bônus em Manobras Aéreas e Grinds perfeitos.',
    focusText: 'Agilidade Motora e Trocas Rápidas',
    stats: [
      { label: 'Velocidade', score: 5 },
      { label: 'Frenesi', score: 5 },
      { label: 'Dificuldade', score: 4 }
    ]
  }
];

const getSkinDisplayName = (skin: string) => {
  switch (skin) {
    case 'golden_king': return 'Rei Dourado';
    case 'demon_slayer': return 'Caçador de Demônios';
    case 'blindfolded_sorcerer': return 'Feiticeiro das Sombras';
    case 'cyber': return 'Cyber Ninja';
    case 'ninja': return 'Mestre Shinobi';
    default: return 'Bytezinho Clássico';
  }
};

const BPM = 130;
const BEAT_DURATION_SEC = 60 / BPM; // ~0.4615s
const SPEED_PIXELS_PER_SEC = 420;
const GROUND_Y = 430;
const CUBE_SIZE = 42;
const JUDGMENT_LINE_X = 140;

// Constantes de Salto
const JUMP_VELOCITY = -650;
const GRAVITY = 1750;

export interface TyperDashGameProps extends GamePluginProps {
  equippedSkin?: BytezinhoSkinId;
  unlockedSkins?: BytezinhoSkinId[];
  onEquipSkin?: (skin: BytezinhoSkinId) => void;
  onOpenLeaderboardTab?: (metric: LeaderboardMetric) => void;
  dashStats?: TyperDashStats;
}

export const TyperDashGame: React.FC<TyperDashGameProps> = ({
  studentClass,
  difficultyMultiplier = 1.0,
  onExitToHub,
  equippedSkin = 'classic',
  unlockedSkins = ['classic'],
  onEquipSkin,
  onOpenLeaderboardTab,
  dashStats
}) => {
  // Seleção de Classe Pré-Run (Válida exclusivamente para a Run ativa)
  const [selectedClass, setSelectedClass] = useState<'warrior' | 'archer' | 'mage' | 'rogue'>(
    (studentClass as 'warrior' | 'archer' | 'mage' | 'rogue') || 'warrior'
  );

  const isWarrior = selectedClass === 'warrior';
  const isArcher = selectedClass === 'archer';
  const isMage = selectedClass === 'mage';
  const isRogue = selectedClass === 'rogue';

  // Cosmético equipado do Bytezinho (sincronizado com perfil e selecionável na partida)
  const [activeSkin, setActiveSkin] = useState<BytezinhoSkinId>(equippedSkin);

  useEffect(() => {
    setActiveSkin(equippedSkin);
  }, [equippedSkin]);

  const handleSelectSkin = (skinId: BytezinhoSkinId) => {
    setActiveSkin(skinId);
    onEquipSkin?.(skinId);
    typerDashAudio.playHitSound(true, 1);
  };

  // Estados de Jogo
  const [gameState, setGameState] = useState<'class_select' | 'countdown' | 'playing' | 'paused' | 'game_over'>('class_select');
  const [countdown, setCountdown] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [perfectHits, setPerfectHits] = useState<number>(0);
  const [goodHits, setGoodHits] = useState<number>(0);
  const [misses, setMisses] = useState<number>(0);
  const [distanceMeters, setDistanceMeters] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [hasShield, setHasShield] = useState<boolean>(isWarrior);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(() => {
    if (dashStats?.highScore) return dashStats.highScore;
    try {
      return Number(localStorage.getItem('typerdash_highscore') || '0');
    } catch {
      return 0;
    }
  });

  // Sincronizar com estatísticas do Hub
  useEffect(() => {
    if (dashStats?.highScore && dashStats.highScore > highScore) {
      setHighScore(dashStats.highScore);
    }
  }, [dashStats?.highScore]);

  // Atualizar recorde arcade persistente
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('typerdash_highscore', String(score));
      } catch {}
    }
  }, [score, highScore]);

  // Formatador de Pontuação Arcade (ex: 004,820)
  const formatArcadeScore = (val: number) => {
    return String(val).padStart(6, '0');
  };

  // Formatador de Tempo Arcade (ex: 01:24)
  const formatArcadeTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Classificação de Desempenho Arcade (Ranking S+, S, A, B, C)
  const getArcadeRank = (acc: number, pts: number) => {
    if (acc >= 95 && pts >= 1200) return { rank: 'S+', title: 'CYBER LEGEND', color: 'text-amber-300', border: 'border-amber-400', glow: 'shadow-[0_0_35px_rgba(251,191,36,0.6)]' };
    if (acc >= 90 && pts >= 750) return { rank: 'S', title: 'RHYTHM MASTER', color: 'text-purple-300', border: 'border-purple-400', glow: 'shadow-[0_0_30px_rgba(192,132,252,0.5)]' };
    if (acc >= 80) return { rank: 'A', title: 'ARCADE PRO', color: 'text-cyan-300', border: 'border-cyan-400', glow: 'shadow-[0_0_25px_rgba(34,211,238,0.4)]' };
    if (acc >= 70) return { rank: 'B', title: 'RUNNER', color: 'text-emerald-300', border: 'border-emerald-400', glow: 'shadow-[0_0_20px_rgba(52,211,153,0.3)]' };
    return { rank: 'C', title: 'TRAINEE', color: 'text-zinc-300', border: 'border-zinc-500', glow: 'shadow-[0_0_15px_rgba(161,161,170,0.2)]' };
  };

  // Refs de Simulação Física e Renderização
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const lastElapsedSecondRef = useRef<number>(0);
  const distanceRef = useRef<number>(0);
  const hueRef = useRef<number>(180);
  const screenShakeRef = useRef<number>(0);
  const invulnerableUntilRef = useRef<number>(0);
  const hasShieldRef = useRef<boolean>(isWarrior);
  const metronomePulseRef = useRef<number>(0);
  const lastBeatTimeRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const gameStateRef = useRef<'class_select' | 'countdown' | 'playing' | 'paused' | 'game_over'>('class_select');

  // Refs da Máquina de Fases & Geometry Dash FX
  const ghostTrailRef = useRef<DashGhostTrail[]>([]);
  const ghostFrameCounterRef = useRef<number>(0);
  const speedLinesActiveRef = useRef<boolean>(false);
  const zoomPulseRef = useRef<number>(0);
  const stageNameRef = useRef<string>('Fase 1: Entrada Solo');
  const currentStageRef = useRef<TyperDashMusicStage>('intro');
  const speedMultiplierRef = useRef<number>(1.0);
  const hasTriggeredSnareRollRef = useRef<boolean>(false);
  const cascadeQueueRef = useRef<Array<{ type: DashObstacle['type']; letter: string; spacing: number }>>([]);

  // Estado Físico do Cubo
  const cubeRef = useRef<DashCubeState>({
    x: JUDGMENT_LINE_X - CUBE_SIZE / 2,
    y: GROUND_Y - CUBE_SIZE,
    size: CUBE_SIZE,
    rotation: 0,
    isJumping: false,
    isGrounded: true,
    targetRotation: 0
  });
  const cubeVyRef = useRef<number>(0);

  const [heldKeys, setHeldKeys] = useState<Set<string>>(new Set());
  const heldKeysRef = useRef<Set<string>>(new Set());

  // Coleções de Entidades do Canvas
  const obstaclesRef = useRef<DashObstacle[]>([]);
  const particlesRef = useRef<DashParticle[]>([]);
  const floatingTextsRef = useRef<DashFloatingText[]>([]);
  const denshaPopupsRef = useRef<DashDenshaPopup[]>([]);
  const nextSpawnDistanceRef = useRef<number>(500);

  // Estados de Gameplay Denshattack!
  const activeGrindRef = useRef<{
    railId: string;
    railX: number;
    railWidth: number;
    elevation: number;
    key: string;
    inSweetSpot: boolean;
    progress: number;
  } | null>(null);

  const activeTrickRef = useRef<{
    rampId: string;
    sequence: string[];
    currentIndex: number;
    name: string;
    expiresAt: number;
    durationMs: number;
  } | null>(null);

  // Referência do Canvas e Otimizações de Renderização
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastMetersRef = useRef<number>(0);
  const comboRef = useRef<number>(0);

  // Sincronizar refs com estado para listeners
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    hasShieldRef.current = hasShield;
  }, [hasShield]);

  // Função pura de desenho na tela em 60 FPS
  const drawCurrentFrame = useCallback((paused: boolean = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderTyperDash(ctx, 960, 540, {
      cube: cubeRef.current,
      ghostTrail: ghostTrailRef.current,
      speedLinesActive: speedLinesActiveRef.current,
      zoomPulse: zoomPulseRef.current,
      stageName: stageNameRef.current,
      obstacles: obstaclesRef.current,
      particles: particlesRef.current,
      floatingTexts: floatingTextsRef.current,
      denshaPopups: denshaPopupsRef.current,
      activeGrind: activeGrindRef.current ? {
        x: cubeRef.current.x + CUBE_SIZE / 2,
        y: cubeRef.current.y,
        progress: activeGrindRef.current.progress,
        key: activeGrindRef.current.key,
        inSweetSpot: activeGrindRef.current.inSweetSpot
      } : null,
      activeTrick: activeTrickRef.current ? {
        sequence: activeTrickRef.current.sequence,
        currentIndex: activeTrickRef.current.currentIndex,
        name: activeTrickRef.current.name,
        timeRemainingRatio: Math.max(0, (activeTrickRef.current.expiresAt - Date.now()) / activeTrickRef.current.durationMs)
      } : null,
      judgmentLineX: JUDGMENT_LINE_X,
      currentHue: hueRef.current,
      groundY: GROUND_Y,
      parallaxOffset: distanceRef.current,
      isInvulnerable: Date.now() < invulnerableUntilRef.current,
      hasShield: hasShieldRef.current,
      isArcher,
      isMage,
      combo: comboRef.current,
      screenShake: screenShakeRef.current,
      metronomePulse: metronomePulseRef.current,
      isPaused: paused,
      bytezinhoSkin: activeSkin
    });
  }, [isArcher, isMage, activeSkin]);

  // Iniciar contagem com classe selecionada (Run individual)
  const startCountdownWithClass = useCallback((cls?: 'warrior' | 'archer' | 'mage' | 'rogue') => {
    const targetClass = cls || selectedClass;
    setSelectedClass(targetClass);
    const withShield = targetClass === 'warrior';
    setHasShield(withShield);
    hasShieldRef.current = withShield;
    setGameState('countdown');
    setCountdown(3);
    setScore(0);
    setCombo(0);
    comboRef.current = 0;
    distanceRef.current = 0;
    lastMetersRef.current = 0;
    obstaclesRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    denshaPopupsRef.current = [];
    activeGrindRef.current = null;
    activeTrickRef.current = null;
    nextSpawnDistanceRef.current = 500;
    speedMultiplierRef.current = 1.0;
    cascadeQueueRef.current = [];
    cubeVyRef.current = 0;
    cubeRef.current.y = GROUND_Y - CUBE_SIZE;
    cubeRef.current.isGrounded = true;
    cubeRef.current.isJumping = false;
    cubeRef.current.rotation = 0;
    cubeRef.current.targetRotation = 0;
    typerDashAudio.playHitSound(true, 1);
  }, [selectedClass]);

  // Helper para adicionar popups no estilo quadrinho urbano (Denshattack!)
  const addDenshaPopup = useCallback((title: string, subtitle?: string, color: string = '#facc15') => {
    denshaPopupsRef.current.push({
      id: `dp_${Date.now()}_${Math.random()}`,
      x: 480,
      y: 200,
      title,
      subtitle,
      color,
      alpha: 1.0,
      scale: 1.25,
      rotation: (Math.random() - 0.5) * 8 - 4
    });
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Emissão de Partículas
  // ─────────────────────────────────────────────────────────────
  const spawnSparks = useCallback((x: number, y: number, color: string, count: number = 14) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) + Math.PI; // Para cima
      const speed = 120 + Math.random() * 260;
      particlesRef.current.push({
        id: `p_${Date.now()}_${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color,
        alpha: 1.0,
        life: 0,
        maxLife: 0.4 + Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 8,
        shape: Math.random() > 0.5 ? 'square' : 'circle'
      });
    }
  }, []);

  const spawnCubeShatter = useCallback((x: number, y: number) => {
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 160 + Math.random() * 420;
      particlesRef.current.push({
        id: `shatter_${Date.now()}_${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 150,
        size: 5 + Math.random() * 7,
        color: i % 2 === 0 ? '#38bdf8' : '#f43f5e',
        alpha: 1.0,
        life: 0,
        maxLife: 0.7 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 14,
        shape: 'shard'
      });
    }
  }, []);

  const addFloatingText = useCallback((text: string, color: string, scale: number = 1.0) => {
    floatingTextsRef.current.push({
      id: `ft_${Date.now()}_${Math.random()}`,
      x: JUDGMENT_LINE_X,
      y: GROUND_Y - CUBE_SIZE - 45,
      text,
      color,
      alpha: 1.0,
      scale,
      vy: -90
    });
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Disparo do Salto do Cubo (Rotação exata de 90°)
  // ─────────────────────────────────────────────────────────────
  const triggerJump = useCallback(() => {
    if (!cubeRef.current.isGrounded) {
      // Salto estendido em ritmo
      cubeVyRef.current = JUMP_VELOCITY * 0.9;
    } else {
      cubeVyRef.current = JUMP_VELOCITY;
      cubeRef.current.isGrounded = false;
      cubeRef.current.isJumping = true;
    }
    // Adicionar 90 graus (PI / 2) à rotação alvo
    cubeRef.current.targetRotation += Math.PI / 2;
    typerDashAudio.playJumpSound();
    spawnSparks(cubeRef.current.x + CUBE_SIZE / 2, GROUND_Y, '#38bdf8', 6);
  }, [spawnSparks]);

  // ─────────────────────────────────────────────────────────────
  // Game Over
  // ─────────────────────────────────────────────────────────────
  const handleCrash = useCallback(() => {
    typerDashAudio.playCrashSound();
    typerDashAudio.stopMetronome();
    screenShakeRef.current = 24;
    spawnCubeShatter(cubeRef.current.x + CUBE_SIZE / 2, cubeRef.current.y + CUBE_SIZE / 2);
    setGameState('game_over');
  }, [spawnCubeShatter]);

  // ─────────────────────────────────────────────────────────────
  // Captura de Teclas & Timing Windows
  // ─────────────────────────────────────────────────────────────
  const handleKeyPress = useCallback((pressedKey: string) => {
    if (gameStateRef.current !== 'playing') return;

    const key = pressedKey.toUpperCase();

    // Procurar o obstáculo mais próximo da Judgment Line (que ainda não foi superado)
    let closestObstacle: DashObstacle | null = null;
    let closestDist = Infinity;

    for (const obs of obstaclesRef.current) {
      if (obs.cleared) continue;
      const obsCenter = obs.x + obs.width / 2;
      const dist = Math.abs(obsCenter - JUDGMENT_LINE_X);
      if (dist < closestDist) {
        closestDist = dist;
        closestObstacle = obs;
      }
    }

    if (!closestObstacle || closestObstacle.type === 'portal') return;

    // Verificar se a tecla digitada confere com a letra do obstáculo
    const isKeyCorrect = closestObstacle.letter.toUpperCase() === key;
    const perfectWindow = isArcher ? 36 : 28; // Janela estendida para o Arqueiro
    const goodWindow = 75;

    if (isKeyCorrect && closestDist <= goodWindow) {
      // Acerto Válido!
      closestObstacle.cleared = true;
      const isPerfect = closestDist <= perfectWindow;

      // ── CASO 1: JUMP ORB (Impulso Aéreo Instantâneo) ──
      if (closestObstacle.type === 'orb') {
        cubeVyRef.current = JUMP_VELOCITY * 0.95;
        cubeRef.current.isGrounded = false;
        cubeRef.current.isJumping = true;
        cubeRef.current.targetRotation += Math.PI / 2;
        typerDashAudio.playOrbSound();

        const orbCenterX = closestObstacle.x + closestObstacle.width / 2;
        const orbCenterY = closestObstacle.y + closestObstacle.height / 2;
        spawnSparks(orbCenterX, orbCenterY, '#ec4899', 20);

        setCombo((prevCombo) => {
          const nextCombo = prevCombo + 1;
          comboRef.current = nextCombo;
          setMaxCombo((prevMax) => Math.max(prevMax, nextCombo));
          const comboMultiplier = isArcher ? 1 + nextCombo * 0.15 : isRogue ? 1 + nextCombo * 0.13 : 1 + nextCombo * 0.1;
          const pointsAwarded = Math.round(150 * comboMultiplier);
          setScore((s) => s + pointsAwarded);
          return nextCombo;
        });

        if (isPerfect) {
          setPerfectHits((p) => p + 1);
          addFloatingText('ORB PERFECT!', '#f472b6', 1.3);
        } else {
          setGoodHits((g) => g + 1);
          addFloatingText('ORB BOOST!', '#38bdf8', 1.1);
        }
        return;
      }

      // ── CASO 2: PLATAFORMAS OU ESPINHOS DE SOLO ──
      setCombo((prevCombo) => {
        const nextCombo = prevCombo + 1;
        comboRef.current = nextCombo;
        setMaxCombo((prevMax) => Math.max(prevMax, nextCombo));

        // Bônus de combo: Arqueiro +1.5x, Ladino +1.3x
        const comboMultiplier = isArcher ? 1 + nextCombo * 0.15 : isRogue ? 1 + nextCombo * 0.13 : 1 + nextCombo * 0.1;
        const baseScore = isPerfect ? 100 : 50;
        const pointsAwarded = Math.round(baseScore * comboMultiplier);

        setScore((prevScore) => prevScore + pointsAwarded);
        typerDashAudio.playHitSound(isPerfect, nextCombo);
        return nextCombo;
      });

      if (isPerfect) {
        setPerfectHits((p) => p + 1);
        addFloatingText('PERFECT!', '#fde047', 1.25);
        spawnSparks(closestObstacle.x + closestObstacle.width / 2, closestObstacle.y, '#fde047', 18);
      } else {
        setGoodHits((g) => g + 1);
        addFloatingText('GOOD!', '#34d399', 1.05);
        spawnSparks(closestObstacle.x + closestObstacle.width / 2, closestObstacle.y, '#34d399', 10);
      }

      triggerJump();
    } else if (closestDist <= goodWindow + 30) {
      // Tecla errada no momento do obstáculo: QUEBRA DE COMBO
      comboRef.current = 0;
      setCombo(0);
      setMisses((m) => m + 1);
      addFloatingText('MISS!', '#f43f5e', 0.95);
    }
  }, [isArcher, triggerJump, addFloatingText, spawnSparks]);

  // ─────────────────────────────────────────────────────────────
  // Listeners de Teclado
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      // 0. Seleção de Classes Pré-Run (Lobby)
      if (gameStateRef.current === 'class_select') {
        if (key === '1') {
          e.preventDefault();
          setSelectedClass('warrior');
          setHasShield(true);
          hasShieldRef.current = true;
          typerDashAudio.playHitSound(true, 1);
          return;
        }
        if (key === '2') {
          e.preventDefault();
          setSelectedClass('archer');
          setHasShield(false);
          hasShieldRef.current = false;
          typerDashAudio.playHitSound(true, 2);
          return;
        }
        if (key === '3') {
          e.preventDefault();
          setSelectedClass('mage');
          setHasShield(false);
          hasShieldRef.current = false;
          typerDashAudio.playHitSound(true, 3);
          return;
        }
        if (key === '4') {
          e.preventDefault();
          setSelectedClass('rogue');
          setHasShield(false);
          hasShieldRef.current = false;
          typerDashAudio.playHitSound(true, 4);
          return;
        }
        if (key === 'Enter' || key === ' ') {
          e.preventDefault();
          startCountdownWithClass();
          return;
        }
        return;
      }

      // Pausa e Despausa pelo Teclado
      if (key === 'Escape' || key === 'Tab' || key === 'p' || key === 'P') {
        e.preventDefault();
        if (gameStateRef.current === 'playing') {
          setGameState('paused');
          isPausedRef.current = true;
          typerDashAudio.stopMetronome();
          typerDashAudio.stopGrindLoop();
        } else if (gameStateRef.current === 'paused') {
          setGameState('playing');
          isPausedRef.current = false;
          typerDashAudio.startMetronome(isMage);
        }
        return;
      }

      // Se pausado e pressionar Espaço/Enter: retoma
      if (gameStateRef.current === 'paused' && (key === ' ' || key === 'Enter')) {
        e.preventDefault();
        setGameState('playing');
        isPausedRef.current = false;
        typerDashAudio.startMetronome(isMage);
        return;
      }

      // Durante a corrida: capturar teclas de jogo
      if (gameStateRef.current === 'playing') {
        if (key.length === 1 && /[a-zA-Z]/.test(key)) {
          e.preventDefault();
          const upperKey = key.toUpperCase();

          // Registrar tecla pressionada no Fightstick Footer
          if (!heldKeysRef.current.has(upperKey)) {
            heldKeysRef.current.add(upperKey);
            setHeldKeys(new Set(heldKeysRef.current));
          }

          // 1. Se estiver executando combo de manobra aérea (Trick Ramp)
          if (activeTrickRef.current) {
            const trick = activeTrickRef.current;
            const expectedKey = trick.sequence[trick.currentIndex];
            if (upperKey === expectedKey) {
              trick.currentIndex++;
              typerDashAudio.playTrickStep(trick.currentIndex);
              spawnSparks(cubeRef.current.x + CUBE_SIZE / 2, cubeRef.current.y, '#f472b6', 10);

              if (trick.currentIndex >= trick.sequence.length) {
                // Manobra completada!
                typerDashAudio.playHitSound(true, comboRef.current + 6);
                screenShakeRef.current = 12;
                const trickBonus = isRogue ? 2250 : 1500;
                addDenshaPopup(trick.name, isRogue ? '+2,250 OVERDRIVE TRICK!' : '+1,500 TRICK COMBO!', '#ec4899');
                setScore((s) => s + trickBonus);
                setCombo((prevCombo) => {
                  const nextCombo = prevCombo + 3;
                  comboRef.current = nextCombo;
                  setMaxCombo((m) => Math.max(m, nextCombo));
                  return nextCombo;
                });
                spawnSparks(cubeRef.current.x + CUBE_SIZE / 2, cubeRef.current.y + CUBE_SIZE / 2, '#ec4899', 30);
                cubeRef.current.targetRotation += Math.PI * 2;
                activeTrickRef.current = null;
              }
              return;
            }
          }

          // 2. Se estiver se aproximando do início de um Trilho de Grind
          const nearRail = obstaclesRef.current.find(
            (o) => o.type === 'rail' && !o.cleared && Math.abs(o.x - JUDGMENT_LINE_X) < 70
          );
          if (nearRail && nearRail.letter.toUpperCase() === upperKey) {
            nearRail.cleared = true;
            nearRail.isGrinding = true;
            activeGrindRef.current = {
              railId: nearRail.id,
              railX: nearRail.x,
              railWidth: nearRail.width,
              elevation: nearRail.elevation || 64,
              key: upperKey,
              inSweetSpot: false,
              progress: 0
            };
            typerDashAudio.startGrindLoop();
            spawnSparks(cubeRef.current.x + CUBE_SIZE / 2, GROUND_Y - (nearRail.elevation || 64), '#38bdf8', 16);
            addDenshaPopup('RAIL GRIND!', 'HOLD THE KEY!', '#38bdf8');
            return;
          }

          handleKeyPress(key);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (heldKeysRef.current.has(key)) {
        heldKeysRef.current.delete(key);
        setHeldKeys(new Set(heldKeysRef.current));
      }

      // Se soltar a tecla do Trilho de Grind ativo
      if (activeGrindRef.current && activeGrindRef.current.key === key) {
        const grind = activeGrindRef.current;
        typerDashAudio.stopGrindLoop();
        activeGrindRef.current = null;

        if (grind.inSweetSpot) {
          // PERFECT DISMOUNT! Acrobacia e impulso aéreo
          typerDashAudio.playPerfectDismount();
          cubeVyRef.current = JUMP_VELOCITY * 1.15;
          cubeRef.current.isGrounded = false;
          cubeRef.current.isJumping = true;
          cubeRef.current.targetRotation += Math.PI * 2;
          screenShakeRef.current = 10;
          const dismountBonus = isRogue ? 1800 : 1200;
          addDenshaPopup('PERFECT DISMOUNT!', isRogue ? '+1,800 ROGUE BOOST!' : '+1,200 PTS // BOOST', '#facc15');
          setScore((s) => s + dismountBonus);
          setPerfectHits((p) => p + 1);
          setCombo((prevCombo) => {
            const nextCombo = prevCombo + 2;
            comboRef.current = nextCombo;
            setMaxCombo((m) => Math.max(m, nextCombo));
            return nextCombo;
          });
          spawnSparks(cubeRef.current.x + CUBE_SIZE / 2, cubeRef.current.y + CUBE_SIZE, '#fde047', 28);
        } else if (grind.progress < 0.8) {
          // Soltou prematuramente antes do sweet spot
          cubeRef.current.isGrounded = false;
          cubeVyRef.current = 60;
          addFloatingText('EARLY DISMOUNT', '#94a3b8', 1.0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [handleKeyPress, isMage, addDenshaPopup, addFloatingText, spawnSparks]);

  // ─────────────────────────────────────────────────────────────
  // Contagem Regressiva Inicial (3, 2, 1, GO!)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'countdown') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('playing');
          startTimeRef.current = Date.now();
          lastTimeRef.current = performance.now();
          typerDashAudio.startMetronome(isMage);
          return 0;
        }
        typerDashAudio.playHitSound(false, 3 - prev);
        return prev - 1;
      });
    }, BEAT_DURATION_SEC * 1000);

    return () => clearInterval(timer);
  }, [gameState, isMage]);

  // ─────────────────────────────────────────────────────────────
  // Geração Procedural de Obstáculos e Fases Rítmicas
  // ─────────────────────────────────────────────────────────────
  const maybeSpawnObstacle = useCallback((canvasWidth: number) => {
    if (distanceRef.current < nextSpawnDistanceRef.current) return;

    const meters = Math.floor(distanceRef.current / 40);
    const speedMult = speedMultiplierRef.current;
    const beatDistance = (SPEED_PIXELS_PER_SEC * speedMult) * BEAT_DURATION_SEC;

    // Se houver obstáculos na fila de cascata (Rolls rápidos da Fase 3 e Fase 5)
    if (cascadeQueueRef.current.length > 0) {
      const nextItem = cascadeQueueRef.current.shift()!;
      nextSpawnDistanceRef.current = distanceRef.current + beatDistance * nextItem.spacing;

      obstaclesRef.current.push({
        id: `obs_${Date.now()}_${Math.random()}`,
        x: canvasWidth + 50,
        y: nextItem.type === 'orb' ? GROUND_Y - 95 : GROUND_Y - 36,
        type: nextItem.type,
        letter: nextItem.letter,
        width: nextItem.type === 'orb' ? 38 : 36,
        height: nextItem.type === 'orb' ? 38 : 36,
        cleared: false
      });
      return;
    }

    // ── GERAÇÃO POR FASE ──
    if (meters < 300) {
      // FASE 1: ENTRADA SOLO (0-300m) - Mão esquerda pura (A, S, D, F)
      const beatMult = Math.random() > 0.6 ? 2.4 : 1.8;
      nextSpawnDistanceRef.current = distanceRef.current + beatDistance * beatMult;

      const letter = LEFT_HAND_KEYS[Math.floor(Math.random() * LEFT_HAND_KEYS.length)];
      const rand = Math.random();
      const type: DashObstacle['type'] = rand > 0.75 ? 'double' : rand > 0.45 ? 'tall' : 'single';
      const width = type === 'double' ? 64 : 36;
      const height = type === 'tall' ? 48 : 36;

      obstaclesRef.current.push({
        id: `obs_${Date.now()}_${Math.random()}`,
        x: canvasWidth + 50,
        y: GROUND_Y - height,
        type,
        letter,
        width,
        height,
        cleared: false
      });
    } else if (meters < 700) {
      // FASE 2: ESFERAS AÉREAS & TRILHOS DE DESLIZE (300-700m)
      if (meters >= 670 && !hasTriggeredSnareRollRef.current) {
        hasTriggeredSnareRollRef.current = true;
        typerDashAudio.triggerSnareRoll(1600);
        // Spawn do Portal de Aceleração
        obstaclesRef.current.push({
          id: `portal_${Date.now()}`,
          x: canvasWidth + 120,
          y: GROUND_Y - 140,
          type: 'portal',
          letter: ' ',
          width: 36,
          height: 140,
          cleared: false,
          portalType: 'speed2x'
        });
        nextSpawnDistanceRef.current = distanceRef.current + beatDistance * 3.2;
        return;
      }

      const roll2 = Math.random();
      if (roll2 > 0.65) {
        // Trilho de Deslize (Hold-to-Grind Denshattack!)
        const railKey = GRIND_KEYS[Math.floor(Math.random() * GRIND_KEYS.length)];
        const railWidth = 260;
        nextSpawnDistanceRef.current = distanceRef.current + beatDistance * 3.6;
        obstaclesRef.current.push({
          id: `rail_${Date.now()}_${Math.random()}`,
          x: canvasWidth + 50,
          y: GROUND_Y - 64,
          type: 'rail',
          letter: railKey,
          width: railWidth,
          height: 14,
          elevation: 64,
          cleared: false
        });
      } else if (roll2 > 0.3) {
        const letter = AIR_KEYS[Math.floor(Math.random() * AIR_KEYS.length)];
        nextSpawnDistanceRef.current = distanceRef.current + beatDistance * 1.8;
        obstaclesRef.current.push({
          id: `orb_${Date.now()}_${Math.random()}`,
          x: canvasWidth + 50,
          y: GROUND_Y - 95,
          type: 'orb',
          letter,
          width: 38,
          height: 38,
          cleared: false
        });
      } else {
        const letter = LEFT_HAND_KEYS[Math.floor(Math.random() * LEFT_HAND_KEYS.length)];
        nextSpawnDistanceRef.current = distanceRef.current + beatDistance * 1.6;
        obstaclesRef.current.push({
          id: `obs_${Date.now()}_${Math.random()}`,
          x: canvasWidth + 50,
          y: GROUND_Y - 36,
          type: 'single',
          letter,
          width: 36,
          height: 36,
          cleared: false
        });
      }
    } else if (meters < 1200) {
      // FASE 3: DROP SUPERSÔNICO (2X SPEED, CASCADES & TRICK RAMPS) (700-1200m)
      const roll3 = Math.random();
      if (roll3 > 0.7) {
        // Rampa de Manobras Aéreas (Trick Ramp)
        const rampWidth = 64;
        const rampHeight = 44;
        nextSpawnDistanceRef.current = distanceRef.current + beatDistance * 3.6;
        obstaclesRef.current.push({
          id: `ramp_${Date.now()}_${Math.random()}`,
          x: canvasWidth + 50,
          y: GROUND_Y - rampHeight,
          type: 'ramp',
          letter: ' ',
          width: rampWidth,
          height: rampHeight,
          cleared: false
        });
      } else {
        const pattern = CASCADE_PATTERNS[Math.floor(Math.random() * CASCADE_PATTERNS.length)];
        cascadeQueueRef.current = [
          { type: 'single', letter: pattern[1], spacing: 0.65 },
          { type: 'orb', letter: AIR_KEYS[Math.floor(Math.random() * AIR_KEYS.length)], spacing: 1.3 }
        ];

        nextSpawnDistanceRef.current = distanceRef.current + beatDistance * 0.65;
        obstaclesRef.current.push({
          id: `obs_${Date.now()}_${Math.random()}`,
          x: canvasWidth + 50,
          y: GROUND_Y - 36,
          type: 'single',
          letter: pattern[0],
          width: 36,
          height: 36,
          cleared: false
        });
      }
    } else if (meters < 1800) {
      // FASE 4: PLATAFORMAS SUSPENSAS, TRILHOS E RAMPAS (1200-1800m)
      const roll4 = Math.random();
      if (roll4 > 0.65) {
        const letter = AIR_KEYS[Math.floor(Math.random() * AIR_KEYS.length)];
        const platWidth = 160;
        const platHeight = 80;
        nextSpawnDistanceRef.current = distanceRef.current + beatDistance * 2.8;

        obstaclesRef.current.push({
          id: `plat_${Date.now()}_${Math.random()}`,
          x: canvasWidth + 50,
          y: GROUND_Y - platHeight,
          type: 'platform',
          letter,
          width: platWidth,
          height: platHeight,
          cleared: false
        });
      } else if (roll4 > 0.35) {
        // Trilho de Deslize Elevado
        const railKey = GRIND_KEYS[Math.floor(Math.random() * GRIND_KEYS.length)];
        const railWidth = 280;
        nextSpawnDistanceRef.current = distanceRef.current + beatDistance * 3.6;
        obstaclesRef.current.push({
          id: `rail_${Date.now()}_${Math.random()}`,
          x: canvasWidth + 50,
          y: GROUND_Y - 75,
          type: 'rail',
          letter: railKey,
          width: railWidth,
          height: 14,
          elevation: 75,
          cleared: false
        });
      } else {
        const isRamp = Math.random() > 0.5;
        if (isRamp) {
          nextSpawnDistanceRef.current = distanceRef.current + beatDistance * 3.5;
          obstaclesRef.current.push({
            id: `ramp_${Date.now()}_${Math.random()}`,
            x: canvasWidth + 50,
            y: GROUND_Y - 44,
            type: 'ramp',
            letter: ' ',
            width: 64,
            height: 44,
            cleared: false
          });
        } else {
          const letter = AIR_KEYS[Math.floor(Math.random() * AIR_KEYS.length)];
          nextSpawnDistanceRef.current = distanceRef.current + beatDistance * 1.8;
          obstaclesRef.current.push({
            id: `orb_${Date.now()}_${Math.random()}`,
            x: canvasWidth + 50,
            y: GROUND_Y - 95,
            type: 'orb',
            letter,
            width: 38,
            height: 38,
            cleared: false
          });
        }
      }
    } else {
      // FASE 5: OVERDRIVE CLIMAX (1800m+)
      const choice = Math.random();
      if (choice > 0.65) {
        const pattern = CASCADE_PATTERNS[Math.floor(Math.random() * CASCADE_PATTERNS.length)];
        cascadeQueueRef.current = [
          { type: 'orb', letter: AIR_KEYS[Math.floor(Math.random() * AIR_KEYS.length)], spacing: 1.1 }
        ];
        nextSpawnDistanceRef.current = distanceRef.current + beatDistance * 0.6;
        obstaclesRef.current.push({
          id: `obs_${Date.now()}_${Math.random()}`,
          x: canvasWidth + 50,
          y: GROUND_Y - 36,
          type: 'single',
          letter: pattern[0],
          width: 36,
          height: 36,
          cleared: false
        });
      } else if (choice > 0.4) {
        const railKey = GRIND_KEYS[Math.floor(Math.random() * GRIND_KEYS.length)];
        nextSpawnDistanceRef.current = distanceRef.current + beatDistance * 3.2;
        obstaclesRef.current.push({
          id: `rail_${Date.now()}_${Math.random()}`,
          x: canvasWidth + 50,
          y: GROUND_Y - 70,
          type: 'rail',
          letter: railKey,
          width: 270,
          height: 14,
          elevation: 70,
          cleared: false
        });
      } else if (choice > 0.2) {
        nextSpawnDistanceRef.current = distanceRef.current + beatDistance * 3.2;
        obstaclesRef.current.push({
          id: `ramp_${Date.now()}_${Math.random()}`,
          x: canvasWidth + 50,
          y: GROUND_Y - 44,
          type: 'ramp',
          letter: ' ',
          width: 64,
          height: 44,
          cleared: false
        });
      } else {
        const letter = AIR_KEYS[Math.floor(Math.random() * AIR_KEYS.length)];
        nextSpawnDistanceRef.current = distanceRef.current + beatDistance * 1.6;
        obstaclesRef.current.push({
          id: `orb_${Date.now()}_${Math.random()}`,
          x: canvasWidth + 50,
          y: GROUND_Y - 95,
          type: 'orb',
          letter,
          width: 38,
          height: 38,
          cleared: false
        });
      }
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Loop de Física a 60 FPS (requestAnimationFrame)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.08); // Clamp dt
      lastTimeRef.current = currentTime;

      // 1. Atualizar Distância & Progressão de Fases
      const speedMult = speedMultiplierRef.current;
      const deltaX = SPEED_PIXELS_PER_SEC * speedMult * dt * difficultyMultiplier;
      distanceRef.current += deltaX;

      const newMeters = Math.floor(distanceRef.current / 40);
      if (newMeters !== lastMetersRef.current) {
        lastMetersRef.current = newMeters;
        setDistanceMeters(newMeters);

        // Atualização da Máquina de Fases
        let stage: TyperDashMusicStage = 'intro';
        let stageTitle = 'Fase 1: Entrada Solo';
        let nextSpeedMult = 1.0;
        let speedLinesOn = false;

        if (newMeters < 300) {
          stage = 'intro';
          stageTitle = 'Fase 1: Entrada Solo';
          nextSpeedMult = 1.0;
          speedLinesOn = false;
        } else if (newMeters < 700) {
          stage = 'bass';
          stageTitle = 'Fase 2: Esferas Aéreas (Jump Orbs)';
          nextSpeedMult = 1.05;
          speedLinesOn = false;
        } else if (newMeters < 1200) {
          stage = 'drop';
          stageTitle = 'Fase 3: Drop Supersônico (2X)';
          nextSpeedMult = 1.45;
          speedLinesOn = true;
        } else if (newMeters < 1800) {
          stage = 'climax';
          stageTitle = 'Fase 4: Plataformas Suspensas';
          nextSpeedMult = 1.15;
          speedLinesOn = false;
        } else {
          stage = 'climax';
          stageTitle = 'Fase 5: Overdrive Climax';
          nextSpeedMult = 1.5;
          speedLinesOn = true;
        }

        speedMultiplierRef.current = nextSpeedMult;
        speedLinesActiveRef.current = speedLinesOn;
        stageNameRef.current = stageTitle;

        if (currentStageRef.current !== stage) {
          currentStageRef.current = stage;
          typerDashAudio.setStage(stage);
        }
      }

      // Atualização do Cronômetro Arcade (apenas 1x por segundo, 0 overhead de re-render)
      const currentSecs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (currentSecs !== lastElapsedSecondRef.current) {
        lastElapsedSecondRef.current = currentSecs;
        setElapsedSeconds(currentSecs);
      }

      hueRef.current = (hueRef.current + dt * 25) % 360;

      // 2. Pulso de Câmera (Zoom Pulse) & Metrônomo do Mago
      const timeInSeconds = currentTime / 1000;
      const currentBpm = speedMult > 1.2 ? 160 : 130;
      const beatPeriod = 60 / currentBpm;
      const beatProgress = (timeInSeconds % beatPeriod) / beatPeriod;
      zoomPulseRef.current = Math.max(0, 1 - beatProgress * 3.5) * (speedMult > 1.2 ? 0.045 : 0.03);

      if (isMage) {
        metronomePulseRef.current = Math.max(0, 1 - beatProgress * 2.5);
      }

      // 3. Screen Shake Decay
      if (screenShakeRef.current > 0) {
        screenShakeRef.current = Math.max(0, screenShakeRef.current - dt * 45);
      }

      // 4. Ghost Trail (Rastro Futurista)
      ghostFrameCounterRef.current++;
      if (ghostFrameCounterRef.current % 2 === 0) {
        ghostTrailRef.current.unshift({
          x: cubeRef.current.x,
          y: cubeRef.current.y,
          rotation: cubeRef.current.rotation,
          alpha: 0.95
        });
        if (ghostTrailRef.current.length > 5) {
          ghostTrailRef.current.pop();
        }
      }
      for (let g = 0; g < ghostTrailRef.current.length; g++) {
        ghostTrailRef.current[g].alpha = Math.max(0, ghostTrailRef.current[g].alpha - dt * 2.8);
      }

      // 5. Física do Salto & Aterrissagem em Plataformas / Trilhos (Denshattack!)
      const cube = cubeRef.current;
      let landedOnPlatform = false;

      // 5.1 Atualização de Grind Ativo (Trilho de Deslize)
      if (activeGrindRef.current) {
        const currentGrind = activeGrindRef.current;
        const rail = obstaclesRef.current.find((o) => o.id === currentGrind.railId);

        if (rail && rail.x + rail.width >= cube.x - 20) {
          const elev = currentGrind.elevation;
          cube.y = GROUND_Y - elev - CUBE_SIZE;
          cube.isGrounded = true;
          cube.isJumping = false;
          cubeVyRef.current = 0;
          cube.rotation = cube.targetRotation;
          landedOnPlatform = true;

          // Calcular progresso no trilho (0.0 a 1.0+)
          const progress = Math.max(0, (cube.x - rail.x) / rail.width);
          currentGrind.progress = progress;
          currentGrind.inSweetSpot = progress >= 0.8 && progress <= 1.05;

          // Pontos de fricção contínuos
          setScore((s) => s + 1);

          // Faíscas elétricas de trilho sob o cubo
          if (Math.random() > 0.35) {
            spawnSparks(cube.x + CUBE_SIZE / 2, GROUND_Y - elev, '#38bdf8', 2);
          }

          // Segurou além do final sem soltar no Sweet Spot: Overheat / Tropeço
          if (progress > 1.05) {
            typerDashAudio.stopGrindLoop();
            activeGrindRef.current = null;
            cube.isGrounded = false;
            cubeVyRef.current = 140;
            screenShakeRef.current = 9;
            addDenshaPopup('OVERHEAT!', 'TROPEÇO NO FIM', '#f43f5e');
            spawnSparks(cube.x + CUBE_SIZE / 2, GROUND_Y - elev, '#f43f5e', 16);
          }
        } else {
          // Saiu do trilho
          typerDashAudio.stopGrindLoop();
          activeGrindRef.current = null;
          cube.isGrounded = false;
        }
      }

      for (const obs of obstaclesRef.current) {
        if (obs.type === 'platform') {
          const platLeft = obs.x - 6;
          const platRight = obs.x + obs.width + 6;
          if (cube.x + cube.size >= platLeft && cube.x <= platRight) {
            const platTop = obs.y;
            if (cube.y + cube.size >= platTop - 12 && cube.y + cube.size <= platTop + 20 && cubeVyRef.current >= 0) {
              cube.y = platTop - cube.size;
              cube.isGrounded = true;
              cube.isJumping = false;
              cubeVyRef.current = 0;
              cube.rotation = cube.targetRotation;
              landedOnPlatform = true;
              break;
            }
          }
        }
      }

      if (!landedOnPlatform) {
        if (!cube.isGrounded) {
          cubeVyRef.current += GRAVITY * dt;
          cube.y += cubeVyRef.current * dt;

          const rotDiff = cube.targetRotation - cube.rotation;
          cube.rotation += rotDiff * Math.min(1, dt * 14);

          // Chão padrão
          if (cube.y >= GROUND_Y - CUBE_SIZE) {
            cube.y = GROUND_Y - CUBE_SIZE;
            cube.isGrounded = true;
            cube.isJumping = false;
            cubeVyRef.current = 0;
            cube.rotation = cube.targetRotation;
            spawnSparks(cube.x + CUBE_SIZE / 2, GROUND_Y, '#38bdf8', 4);
          }
        } else {
          // Se estava grounded numa plataforma e correu para fora dela no ar
          if (cube.y < GROUND_Y - CUBE_SIZE) {
            cube.isGrounded = false;
            cubeVyRef.current = 100;
          }
        }
      }

      // 6. Mover e Verificar Obstáculos
      maybeSpawnObstacle(960);
      const remainingObstacles: DashObstacle[] = [];
      const now = Date.now();
      const isInvulnerable = now < invulnerableUntilRef.current;

      for (const obs of obstaclesRef.current) {
        obs.x -= deltaX;

        // Ativação do Portal de Velocidade
        if (obs.type === 'portal' && !obs.cleared) {
          if (cube.x + cube.size >= obs.x) {
            obs.cleared = true;
            typerDashAudio.playPortalSound();
            screenShakeRef.current = 14;
            spawnSparks(obs.x, GROUND_Y - 70, '#facc15', 25);
            addFloatingText('SPEED BOOST [2X]!', '#facc15', 1.3);
          }
        }

        // Ativação da Rampa de Manobras (Trick Ramp)
        if (obs.type === 'ramp' && !obs.cleared) {
          if (cube.x + cube.size >= obs.x && cube.x <= obs.x + obs.width) {
            obs.cleared = true;
            typerDashAudio.playOrbSound();
            cubeVyRef.current = JUMP_VELOCITY * 1.35;
            cube.isGrounded = false;
            cube.isJumping = true;
            cube.targetRotation += Math.PI * 2;
            screenShakeRef.current = 8;

            const trick = DIRECTIONAL_SWEEPS[Math.floor(Math.random() * DIRECTIONAL_SWEEPS.length)];
            activeTrickRef.current = {
              rampId: obs.id,
              sequence: trick.sequence,
              currentIndex: 0,
              name: trick.name,
              expiresAt: Date.now() + 2000,
              durationMs: 2000
            };

            addDenshaPopup('TRICK LAUNCH!', trick.name, '#ec4899');
            spawnSparks(obs.x + obs.width / 2, GROUND_Y - obs.height, '#ec4899', 24);
          }
        }

        // Detecção de Colisão Fatal com o Cubo (apenas espinhos e plataforma frontal)
        if (!obs.cleared && !isInvulnerable) {
          const cubeLeft = cube.x + 6;
          const cubeRight = cube.x + cube.size - 6;
          const cubeBottom = cube.y + cube.size;

          if (obs.type === 'platform') {
            // Colisão com a parede frontal da plataforma
            const isHittingFrontWall = cubeRight >= obs.x + 4 && cubeLeft <= obs.x + 20 && cubeBottom > obs.y + 12;
            // Colisão com os espinhos no solo embaixo da plataforma
            const isHittingGroundSpikes = cubeBottom >= GROUND_Y - 6 && cubeRight >= obs.x + 4 && cubeLeft <= obs.x + obs.width - 4;

            if (isHittingFrontWall || isHittingGroundSpikes) {
              if (hasShieldRef.current) {
                hasShieldRef.current = false;
                setHasShield(false);
                invulnerableUntilRef.current = now + 1400;
                obs.cleared = true;
                typerDashAudio.playShieldBreakSound();
                screenShakeRef.current = 14;
                spawnSparks(cube.x + CUBE_SIZE / 2, cube.y + CUBE_SIZE / 2, '#34d399', 24);
                addFloatingText('ESCUDO DEFLETIDO!', '#34d399', 1.2);
                continue;
              } else {
                handleCrash();
                return;
              }
            }
          } else if (obs.type === 'single' || obs.type === 'double' || obs.type === 'tall') {
            const obsLeft = obs.x + 4;
            const obsRight = obs.x + obs.width - 4;
            const obsTop = GROUND_Y - obs.height + 4;

            const isCollidingX = cubeRight >= obsLeft && cubeLeft <= obsRight;
            const isCollidingY = cubeBottom >= obsTop;

            if (isCollidingX && isCollidingY) {
              if (hasShieldRef.current) {
                hasShieldRef.current = false;
                setHasShield(false);
                invulnerableUntilRef.current = now + 1400;
                obs.cleared = true;
                typerDashAudio.playShieldBreakSound();
                screenShakeRef.current = 14;
                spawnSparks(cube.x + CUBE_SIZE / 2, cube.y + CUBE_SIZE / 2, '#34d399', 24);
                addFloatingText('ESCUDO DEFLETIDO!', '#34d399', 1.2);
                continue;
              } else {
                handleCrash();
                return;
              }
            }
          }

          // Se passou da linha sem ser limpo
          if (obs.x + obs.width < JUDGMENT_LINE_X - 35 && !obs.cleared) {
            obs.cleared = true;
            if (obs.type !== 'portal' && obs.type !== 'ramp' && obs.type !== 'rail') {
              comboRef.current = 0;
              setCombo(0);
              setMisses((m) => m + 1);
              addFloatingText('MISS!', '#f43f5e', 0.9);
            }
          }
        }

        // Manter obstáculos visíveis na tela
        if (obs.x + obs.width > -100) {
          remainingObstacles.push(obs);
        }
      }
      obstaclesRef.current = remainingObstacles;

      // 6.5 Expirar combo de manobra se o tempo acabar
      if (activeTrickRef.current && Date.now() > activeTrickRef.current.expiresAt) {
        activeTrickRef.current = null;
      }

      // 7. Atualizar Partículas
      const remainingParticles: DashParticle[] = [];
      for (const p of particlesRef.current) {
        p.life += dt;
        if (p.life < p.maxLife) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 450 * dt;
          p.rotation += p.vRot * dt;
          p.alpha = 1 - p.life / p.maxLife;
          remainingParticles.push(p);
        }
      }
      particlesRef.current = remainingParticles;

      // 8. Atualizar Textos Flutuantes
      const remainingTexts: DashFloatingText[] = [];
      for (const ft of floatingTextsRef.current) {
        ft.y += ft.vy * dt;
        ft.alpha -= dt * 1.5;
        if (ft.alpha > 0) {
          remainingTexts.push(ft);
        }
      }
      floatingTextsRef.current = remainingTexts;

      // 8.5 Atualizar Popups Denshattack! (Onomatopeias e Manobras)
      const remainingPopups: DashDenshaPopup[] = [];
      for (const dp of denshaPopupsRef.current) {
        dp.y -= 14 * dt;
        dp.alpha -= dt * 0.95;
        if (dp.alpha > 0) {
          remainingPopups.push(dp);
        }
      }
      denshaPopupsRef.current = remainingPopups;

      // 9. Renderizar no Canvas em 60 FPS real
      drawCurrentFrame(false);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [
    gameState,
    difficultyMultiplier,
    isMage,
    maybeSpawnObstacle,
    handleCrash,
    addFloatingText,
    spawnSparks,
    drawCurrentFrame
  ]);

  // Renderizar o frame estático inicial ou durante a pausa / seleção
  useEffect(() => {
    if (gameState === 'class_select' || gameState === 'countdown' || gameState === 'paused') {
      drawCurrentFrame(gameState === 'paused' || gameState === 'class_select');
    }
  }, [gameState, drawCurrentFrame, countdown]);

  // ─────────────────────────────────────────────────────────────
  // Limpeza de Ciclo de Vida do Áudio ao Desmontar
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      typerDashAudio.dispose();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Disparo de Confetti ao Finalizar Partida de Alto Desempenho
  // ─────────────────────────────────────────────────────────────
  const totalAttempts = perfectHits + goodHits + misses;
  const accuracyPercentage = totalAttempts > 0 
    ? Math.round(((perfectHits + goodHits) / totalAttempts) * 100) 
    : 100;

  useEffect(() => {
    if (gameState === 'game_over' && accuracyPercentage >= 80 && score > 300) {
      try {
        confetti({
          particleCount: 65,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [gameState, accuracyPercentage, score]);

  // ─────────────────────────────────────────────────────────────
  // Reiniciar Partida
  // ─────────────────────────────────────────────────────────────
  const handleRestart = () => {
    obstaclesRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    cubeRef.current = {
      x: JUDGMENT_LINE_X - CUBE_SIZE / 2,
      y: GROUND_Y - CUBE_SIZE,
      size: CUBE_SIZE,
      rotation: 0,
      isJumping: false,
      isGrounded: true,
      targetRotation: 0
    };
    cubeVyRef.current = 0;
    distanceRef.current = 0;
    nextSpawnDistanceRef.current = 500;
    screenShakeRef.current = 0;
    invulnerableUntilRef.current = 0;
    comboRef.current = 0;
    lastMetersRef.current = 0;

    speedMultiplierRef.current = 1.0;
    speedLinesActiveRef.current = false;
    hasTriggeredSnareRollRef.current = false;
    ghostTrailRef.current = [];
    cascadeQueueRef.current = [];
    currentStageRef.current = 'intro';
    stageNameRef.current = 'Fase 1: Entrada Solo';
    typerDashAudio.setStage('intro');

    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setPerfectHits(0);
    setGoodHits(0);
    setMisses(0);
    setDistanceMeters(0);
    lastElapsedSecondRef.current = 0;
    setElapsedSeconds(0);
    setHasShield(isWarrior);
    hasShieldRef.current = isWarrior;
    setCountdown(3);
    setGameState('countdown');
  };

  // ─────────────────────────────────────────────────────────────
  // Saída Unificada para o Hub (GameExitPayload)
  // ─────────────────────────────────────────────────────────────
  const handleExit = () => {
    typerDashAudio.dispose();

    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const suggestedBytes = Math.floor(score * 0.15);
    const levelTokensEarned = accuracyPercentage >= 80 && distanceMeters >= 50 ? 1 : 0;

    const payload: GameExitPayload = {
      bytesEarned: suggestedBytes,
      levelTokensEarned,
      sessionStats: {
        score,
        accuracyPercentage,
        timeSpentSeconds,
        correctAnswers: perfectHits + goodHits,
        wrongAnswers: misses,
        levelReached: Math.floor(distanceMeters / 50) + 1,
        extraMetrics: {
          perfectHits,
          goodHits,
          maxCombo,
          distanceMeters,
          studentClass: selectedClass
        }
      }
    };

    onExitToHub(payload);
  };

  // Alternar Mute
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    typerDashAudio.setMuted(nextMuted);
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-zinc-100 flex flex-col font-sans relative select-none overflow-hidden">
      {/* ─────────────────────────────────────────────────────────
          Header Tático / HUD Cel-Shaded Manga Pop-ups
      ───────────────────────────────────────────────────────── */}
      <header className="border-b-2 border-zinc-800 bg-[#090d16]/95 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 z-30 shadow-[0_4px_25px_rgba(0,0,0,0.8)] backdrop-blur-md">
        {/* Lado Esquerdo: Botão Sair, Logo Manga & Mascote */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExit}
            className="p-2 sm:p-2.5 rounded-xl bg-zinc-900 hover:bg-rose-950/70 border-2 border-zinc-700 hover:border-rose-500 text-zinc-300 hover:text-rose-300 transition-all cursor-pointer group shadow-xs"
            title="Sair para o Hub"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 p-0.5 shadow-[0_3px_0_#b45309] flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-amber-400 font-black">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-mono text-base font-black tracking-widest bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent uppercase">
                  TYPERDASH
                </h1>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 font-extrabold uppercase">
                  MANGA DASH
                </span>
              </div>
              <p className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                130 BPM • {BYTEZINHO_SKINS[activeSkin]?.name || getSkinDisplayName(activeSkin)}
              </p>
            </div>
          </div>
        </div>

        {/* Telemetria Central: Painéis Cel-Shaded de Alta Voltagem */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Painel PONTOS (Dourado / Âmbar) */}
          <div className="relative rounded-xl px-3 py-1 bg-zinc-950/90 border-2 border-amber-500/80 shadow-[0_3px_0_rgba(245,158,11,0.35)] flex flex-col items-center min-w-[105px] sm:min-w-[120px]">
            <span className="text-[9px] font-mono font-black tracking-widest text-amber-400 uppercase flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> PONTOS <Sparkles className="w-2.5 h-2.5" />
            </span>
            <span className="font-mono text-lg sm:text-xl font-black text-amber-300 tracking-wider">
              {formatArcadeScore(score)}
            </span>
            <div className="text-[8px] font-mono font-bold text-amber-400/80 tracking-widest">
              HI: {formatArcadeScore(highScore)}
            </div>
          </div>

          {/* Painel TEMPO (Ciano Elétrico) */}
          <div className="relative rounded-xl px-3 py-1 bg-zinc-950/90 border-2 border-cyan-500/80 shadow-[0_3px_0_rgba(6,182,212,0.35)] flex flex-col items-center min-w-[90px] sm:min-w-[100px]">
            <span className="text-[9px] font-mono font-black tracking-widest text-cyan-400 uppercase flex items-center gap-1">
              <Timer className="w-2.5 h-2.5" /> TEMPO
            </span>
            <span className="font-mono text-lg sm:text-xl font-black text-cyan-300 tracking-wider">
              {formatArcadeTime(elapsedSeconds)}
            </span>
            <div className="text-[8px] font-mono font-bold text-cyan-400/80 tracking-widest">
              130 BPM
            </div>
          </div>

          {/* Painel COMBO (Fúcsia Neon) */}
          <div className="relative rounded-xl px-3 py-1 bg-zinc-950/90 border-2 border-fuchsia-500/80 shadow-[0_3px_0_rgba(217,70,239,0.35)] flex flex-col items-center min-w-[90px] sm:min-w-[100px]">
            <span className="text-[9px] font-mono font-black tracking-widest text-fuchsia-400 uppercase flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> COMBO
            </span>
            <span className={`font-mono text-lg sm:text-xl font-black tracking-wider ${
              combo >= 20 ? 'text-rose-400 animate-pulse' : combo >= 10 ? 'text-fuchsia-300' : 'text-fuchsia-400'
            }`}>
              x{combo}
            </span>
            <div className="text-[8px] font-mono font-bold uppercase tracking-widest">
              {combo >= 20 ? (
                <span className="text-rose-400 font-black animate-pulse flex items-center gap-1">
                  <Flame className="w-2.5 h-2.5 inline" /> OVERDRIVE
                </span>
              ) : combo >= 10 ? (
                <span className="text-fuchsia-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 inline" /> FRENZY
                </span>
              ) : (
                <span className="text-zinc-500">MAX: x{maxCombo}</span>
              )}
            </div>
          </div>

          {/* Painel DISTÂNCIA (Esmeralda) */}
          <div className="hidden sm:flex relative rounded-xl px-3 py-1 bg-zinc-950/90 border-2 border-emerald-500/80 shadow-[0_3px_0_rgba(16,185,129,0.35)] flex flex-col items-center min-w-[95px]">
            <span className="text-[9px] font-mono font-black tracking-widest text-emerald-400 uppercase flex items-center gap-1">
              <Flag className="w-2.5 h-2.5" /> SETOR
            </span>
            <span className="font-mono text-lg sm:text-xl font-black text-emerald-300 tracking-wider">
              {distanceMeters}m
            </span>
            <div className="text-[8px] font-mono font-bold text-emerald-400/80 tracking-widest">
              FASE {Math.min(5, Math.floor(distanceMeters / 300) + 1)}/5
            </div>
          </div>

          {/* Painel PRECISÃO (Azul Elétrico) */}
          <div className="hidden md:flex relative rounded-xl px-3 py-1 bg-zinc-950/90 border-2 border-sky-500/80 shadow-[0_3px_0_rgba(14,165,233,0.35)] flex flex-col items-center min-w-[90px]">
            <span className="text-[9px] font-mono font-black tracking-widest text-sky-400 uppercase flex items-center gap-1">
              <Target className="w-2.5 h-2.5" /> MIRA
            </span>
            <span className="font-mono text-lg sm:text-xl font-black text-sky-300 tracking-wider">
              {accuracyPercentage}%
            </span>
            <div className="text-[8px] font-mono font-bold text-sky-400/80 tracking-widest">
              {perfectHits}P • {goodHits}G
            </div>
          </div>
        </div>

        {/* Lado Direito: Badge da Classe Ativa, Áudio & Pausa */}
        <div className="flex items-center gap-2">
          {/* Badge Interativo da Classe Ativa da Run */}
          <button
            type="button"
            onClick={() => {
              if (gameState !== 'playing') {
                setGameState('class_select');
              }
            }}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border-2 transition-all shadow-[0_3px_0_rgba(0,0,0,0.5)] ${
              isWarrior 
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
                : isArcher 
                ? 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]' 
                : isMage
                ? 'bg-cyan-950/90 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-rose-950/90 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
            }`}
            title={gameState === 'playing' ? 'Classe Ativa na Run' : 'Clique para alterar a classe'}
          >
            {isWarrior && <Shield className="w-4 h-4 text-emerald-400" />}
            {isArcher && <Crosshair className="w-4 h-4 text-amber-400" />}
            {isMage && <Zap className="w-4 h-4 text-cyan-400" />}
            {isRogue && <Flame className="w-4 h-4 text-rose-400" />}
            <div className="flex flex-col text-left">
              <span className="uppercase text-[11px] leading-tight font-black">
                {isWarrior ? 'Guerreiro' : isArcher ? 'Arqueiro' : isMage ? 'Mago' : 'Ladino'}
              </span>
              <span className="text-[9px] text-zinc-400 leading-tight">
                {isWarrior ? (hasShield ? 'Escudo [1/1]' : 'Escudo Quebrado') : isArcher ? 'Mira +28%' : isMage ? '130 BPM' : 'Overdrive'}
              </span>
            </div>
          </button>

          {/* Botão de Ranking Oficial */}
          {onOpenLeaderboardTab && (
            <button
              type="button"
              onClick={() => onOpenLeaderboardTab('dash')}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 border-2 border-amber-500/70 text-amber-300 font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_3px_0_rgba(180,83,9,0.4)] hover:scale-105 active:scale-95"
              title="Abrir Ranking do TyperDash"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">RANKING</span>
            </button>
          )}

          {/* Mute Button */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 sm:p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.5)]"
            title={isMuted ? 'Ativar Áudio' : 'Mutar Áudio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Pause Button */}
          <button
            type="button"
            onClick={() => {
              if (gameState === 'playing') {
                setGameState('paused');
                isPausedRef.current = true;
                typerDashAudio.stopMetronome();
              } else if (gameState === 'paused') {
                setGameState('playing');
                isPausedRef.current = false;
                typerDashAudio.startMetronome(isMage);
              }
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-zinc-900 hover:bg-amber-950/60 border-2 border-zinc-700 hover:border-amber-500 text-zinc-300 hover:text-amber-300 transition-all cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.5)]"
            title="Pausar Partida [ESC / TAB]"
          >
            {gameState === 'paused' ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────
          Área Principal do Canvas
      ───────────────────────────────────────────────────────── */}
      <main className="flex-1 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        <TyperDashCanvas canvasRef={canvasRef} />

        {/* ─────────────────────────────────────────────────────────
            Lobby Pré-Run: Seleção de Classe (Estilo Cel-Shaded Manga)
        ───────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {gameState === 'class_select' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-40 bg-[#080b11]/92 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 overflow-y-auto"
            >
              {/* Cabeçalho do Lobby Pré-Run */}
              <div className="flex flex-col items-center text-center max-w-2xl my-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/60 text-amber-300 text-xs font-mono font-black uppercase tracking-wider mb-2 shadow-[0_0_12px_rgba(251,191,36,0.3)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PREPARAÇÃO DE RUN • VALIDADE POR PARTIDA</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-mono font-black text-white tracking-wider uppercase drop-shadow-[0_4px_0_rgba(0,0,0,0.9)]">
                  ESCOLHA SUA CLASSE
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
                  Selecione sua vantagem tática para esta corrida. Você pode trocar de classe a qualquer momento após o Game Over.
                </p>
                {/* Seletor & Preview Interativo do Bytezinho */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-2xl bg-zinc-950/85 border-2 border-zinc-800 shadow-md max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700/80 p-0.5 flex items-center justify-center shadow-inner shrink-0">
                      <BytezinhoAvatar skin={activeSkin} size="sm" mood="happy" interactive />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-mono font-black text-white">
                          {BYTEZINHO_SKINS[activeSkin]?.icon} {BYTEZINHO_SKINS[activeSkin]?.name || 'Bytezinho'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold uppercase">
                          {BYTEZINHO_SKINS[activeSkin]?.tag || 'Corredor'}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        Mascote Ativo na Corrida • {unlockedSkins.length} skin{unlockedSkins.length > 1 ? 's' : ''} disponível{unlockedSkins.length > 1 ? 'is' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Carrossel / Botões Rápidos de Skins Desbloqueadas */}
                  {unlockedSkins.length > 1 && (
                    <div className="flex items-center gap-1.5 flex-wrap justify-center py-0.5">
                      {unlockedSkins.map((sId) => {
                        const isEquipped = activeSkin === sId;
                        const skinConf = BYTEZINHO_SKINS[sId];
                        return (
                          <button
                            key={sId}
                            type="button"
                            onClick={() => handleSelectSkin(sId)}
                            className={`px-2 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                              isEquipped
                                ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.6)] font-black scale-105'
                                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500'
                            }`}
                            title={skinConf?.name || sId}
                          >
                            <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                              <BytezinhoAvatar skin={sId as any} size="xs" />
                            </div>
                            <span className="text-[11px]">{skinConf?.name || sId}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Badge de Recorde Pessoal & Acesso ao Ranking */}
                <div className="mt-2.5 flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-zinc-950/80 border border-amber-500/40 text-xs font-mono shadow-xs">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Seu Recorde: <strong className="text-white font-black">{highScore.toLocaleString()} pts</strong></span>
                    {dashStats?.maxDistance ? (
                      <span className="text-zinc-400 hidden sm:inline">• {dashStats.maxDistance}m</span>
                    ) : null}
                  </div>
                  {onOpenLeaderboardTab && (
                    <button
                      type="button"
                      onClick={() => onOpenLeaderboardTab('dash')}
                      className="ml-1 px-2.5 py-0.5 rounded-md bg-amber-400 hover:bg-amber-300 text-black font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                    >
                      Ver Ranking
                    </button>
                  )}
                </div>
              </div>

              {/* Grid dos 4 Cards de Classe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-5xl my-3">
                {CLASS_OPTIONS.map((cls) => {
                  const isSelected = selectedClass === cls.id;
                  const Icon = cls.icon;

                  return (
                    <motion.div
                      key={cls.id}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedClass(cls.id);
                        if (cls.id === 'warrior') {
                          setHasShield(true);
                          hasShieldRef.current = true;
                        } else {
                          setHasShield(false);
                          hasShieldRef.current = false;
                        }
                        typerDashAudio.playHitSound(true, Number(cls.keyNumber));
                      }}
                      className={`relative rounded-2xl border-3 transition-all cursor-pointer p-4 flex flex-col justify-between select-none ${
                        isSelected
                          ? `border-white ring-4 ${cls.ringClass} ${cls.activeGlow} bg-gradient-to-b ${cls.bgGradient} -translate-y-1`
                          : 'border-zinc-800 bg-zinc-950/80 hover:border-zinc-600 hover:bg-zinc-900/60'
                      }`}
                    >
                      {/* Tecla Rápida (1, 2, 3, 4) */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-7 h-7 rounded-lg bg-black border-2 border-zinc-700 flex items-center justify-center font-mono font-black text-xs text-white shadow-xs">
                          {cls.keyNumber}
                        </span>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider border flex items-center gap-1 ${
                          isSelected ? cls.badgeBg : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                        }`}>
                          {isSelected ? (
                            <>
                              <Check className="w-2.5 h-2.5" />
                              <span>ATIVA</span>
                            </>
                          ) : (
                            'SELECIONAR'
                          )}
                        </div>
                      </div>

                      {/* Ícone e Título da Classe */}
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-14 h-14 rounded-2xl p-0.5 flex items-center justify-center mb-2.5 shadow-md ${
                          isSelected ? 'bg-gradient-to-br from-white to-zinc-400' : 'bg-zinc-800'
                        }`}>
                          <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                            <Icon className={`w-7 h-7 ${cls.accentText}`} />
                          </div>
                        </div>

                        <h3 className={`font-mono text-lg font-black tracking-wider uppercase ${cls.accentText}`}>
                          {cls.name}
                        </h3>
                        <p className="text-[11px] font-mono text-zinc-400 font-bold uppercase mt-0.5">
                          {cls.tagline}
                        </p>
                      </div>

                      {/* Descrição da Habilidade Passiva */}
                      <div className="my-3.5 p-2.5 rounded-xl bg-black/60 border border-zinc-800/80 text-left">
                        <div className="text-[10px] font-mono font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>{cls.passiveTitle}</span>
                        </div>
                        <p className="text-[11px] font-mono text-zinc-400 leading-snug">
                          {cls.passiveDesc}
                        </p>
                      </div>

                      {/* Barra de Atributos & Foco Pedagógico */}
                      <div className="space-y-1.5 border-t border-zinc-800/80 pt-2.5 text-left font-mono">
                        {cls.stats.map((st) => (
                          <div key={st.label} className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-400 uppercase">{st.label}</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((idx) => (
                                <span
                                  key={idx}
                                  className={`w-2 h-2 rounded-xs ${
                                    idx <= st.score ? cls.badgeBg.split(' ')[0] : 'bg-zinc-800'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                        <p className="text-[9px] text-zinc-500 font-bold truncate pt-1">
                          {cls.focusText}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Botão de Iniciar Corrida */}
              <div className="flex flex-col items-center gap-2 mt-auto my-auto">
                <button
                  type="button"
                  onClick={() => startCountdownWithClass()}
                  className="px-8 sm:px-12 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-black font-mono font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_5px_0_#b45309] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.02]"
                >
                  <Play className="w-5 h-5 fill-black" />
                  <span>INICIAR COM {selectedClass.toUpperCase()} [ESPAÇO]</span>
                </button>
                <p className="text-[11px] font-mono text-zinc-400">
                  Teclas <strong className="text-white">[1, 2, 3, 4]</strong> para escolher • <strong className="text-white">[ENTER / ESPAÇO]</strong> para iniciar
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay de Contagem Regressiva 3, 2, 1 */}
        <AnimatePresence>
          {gameState === 'countdown' && (
            <motion.div
              key={countdown}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1.15, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40 bg-black/40 backdrop-blur-xs"
            >
              <span className="font-mono text-7xl sm:text-9xl font-black text-amber-400 drop-shadow-[0_0_40px_#f59e0b]">
                {countdown > 0 ? countdown : 'GO!'}
              </span>
              <p className="text-zinc-300 font-mono text-sm sm:text-base font-bold mt-4 tracking-widest uppercase">
                {countdown > 0 ? 'Prepare as mãos na Linha Guia (A S D F J K L)' : 'MANTENHA O RITMO!'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ─────────────────────────────────────────────────────────
          Rodapé Tático Cel-Shaded Manga / Guia de Teclas
      ───────────────────────────────────────────────────────── */}
      <footer className="border-t-2 border-zinc-800 bg-[#090d16]/95 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 z-20 text-xs font-mono text-zinc-400 shadow-[0_-4px_25px_rgba(0,0,0,0.7)]">
        {/* Mão Esquerda (Solo) */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/50">
            ◄ SOLO (ESQ)
          </span>
          <div className="flex items-center gap-1.5">
            {LEFT_HAND_KEYS.map((k) => {
              const isHeld = heldKeys.has(k);
              const isGrindingThis = activeGrindRef.current?.key === k;
              return (
                <kbd
                  key={k}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg font-black transition-all duration-75 select-none ${
                    isGrindingThis
                      ? 'bg-amber-400 text-black border-2 border-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.9)] scale-110'
                      : isHeld
                      ? 'bg-cyan-400 text-black border-2 border-white shadow-[0_0_12px_rgba(6,182,212,0.9)] scale-105'
                      : 'bg-zinc-900 border-2 border-cyan-500/60 text-cyan-200'
                  }`}
                >
                  {k}
                </kbd>
              );
            })}
          </div>
        </div>

        {/* Status Central Dinâmico */}
        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
          {gameState === 'class_select' ? (
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              LOBBY DE PREPARAÇÃO // TECLAS [1, 2, 3, 4] PARA ESCOLHER
            </span>
          ) : activeGrindRef.current ? (
            <span className={`flex items-center gap-1.5 font-bold ${activeGrindRef.current.inSweetSpot ? 'text-amber-300 animate-pulse' : 'text-cyan-300'}`}>
              <span className={`w-2 h-2 rounded-full ${activeGrindRef.current.inSweetSpot ? 'bg-amber-400 animate-ping' : 'bg-cyan-400'}`} />
              <Zap className="w-3.5 h-3.5 text-amber-400 inline" />
              <span>SEGURE [{activeGrindRef.current.key}] // {activeGrindRef.current.inSweetSpot ? 'SOLTE AGORA! (SWEET SPOT)' : 'GRINDING...'}</span>
            </span>
          ) : activeTrickRef.current ? (
            <span className="flex items-center gap-1.5 text-fuchsia-300 font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
              <Flame className="w-3.5 h-3.5 text-fuchsia-400 inline" />
              <span>MANOBRA: {activeTrickRef.current.name} [{activeTrickRef.current.sequence.join(' ')}]</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              130 BPM RHYTHM LOCK
            </span>
          )}
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="text-zinc-400 hidden sm:inline">
            PAUSA: <strong className="text-zinc-200 px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700">[ESC / TAB]</strong>
          </span>
        </div>

        {/* Mão Direita & Aéreos (Jump Orbs / Plataformas) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {AIR_KEYS.map((k) => {
              const isHeld = heldKeys.has(k);
              const isGrindingThis = activeGrindRef.current?.key === k;
              return (
                <kbd
                  key={k}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg font-black transition-all duration-75 select-none ${
                    isGrindingThis
                      ? 'bg-amber-400 text-black border-2 border-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.9)] scale-110'
                      : isHeld
                      ? 'bg-fuchsia-400 text-black border-2 border-white shadow-[0_0_12px_rgba(217,70,239,0.9)] scale-105'
                      : 'bg-zinc-900 border-2 border-fuchsia-500/60 text-fuchsia-200'
                  }`}
                >
                  {k}
                </kbd>
              );
            })}
          </div>
          <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-wider bg-fuchsia-950/70 px-2 py-0.5 rounded border border-fuchsia-500/50">
            ORBS / AR (DIR)
          </span>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────
          Modal de Game Over / Relatório Cel-Shaded Manga & Ranking
      ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {gameState === 'game_over' && (() => {
          const rankInfo = getArcadeRank(accuracyPercentage, score);
          const isNewHigh = score >= highScore && score > 0;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.88, opacity: 0, y: 25 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="w-full max-w-lg bg-[#0a0e17]/98 border-3 border-amber-500/70 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(245,158,11,0.25)] flex flex-col items-center text-center font-mono relative overflow-hidden"
              >
                {/* Iluminação decorativa de fundo */}
                <div className="absolute -top-24 -left-24 w-52 h-52 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

                {/* Banner de Novo Recorde */}
                {isNewHigh && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-3 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-pulse flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>NOVO RECORDE PESSOAL!</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </motion.div>
                )}

                {/* Emblema de Rank */}
                <div className={`w-20 h-20 rounded-2xl bg-zinc-950 border-2 ${rankInfo.border} ${rankInfo.glow} flex flex-col items-center justify-center mb-3 relative`}>
                  <span className={`text-3xl font-black ${rankInfo.color}`}>
                    {rankInfo.rank}
                  </span>
                  <span className="text-[8px] font-black text-zinc-400 tracking-tighter uppercase">
                    RANK
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-widest uppercase">
                  {rankInfo.title}
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Relatório oficial de ritmo, tempo e acurácia motora.
                </p>

                {/* Grid de Estatísticas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full my-5">
                  <div className="bg-gradient-to-b from-amber-950/30 to-zinc-950 border border-amber-500/40 rounded-xl p-3 flex flex-col items-center">
                    <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">Pontuação</span>
                    <span className="text-lg font-black text-white">{formatArcadeScore(score)}</span>
                  </div>

                  <div className="bg-gradient-to-b from-cyan-950/30 to-zinc-950 border border-cyan-500/40 rounded-xl p-3 flex flex-col items-center">
                    <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider">Tempo</span>
                    <span className="text-lg font-black text-cyan-300">{formatArcadeTime(elapsedSeconds)}</span>
                  </div>

                  <div className="bg-gradient-to-b from-fuchsia-950/30 to-zinc-950 border border-fuchsia-500/40 rounded-xl p-3 flex flex-col items-center">
                    <span className="text-[9px] text-fuchsia-400 font-bold uppercase tracking-wider">Maior Combo</span>
                    <span className="text-lg font-black text-fuchsia-300">x{maxCombo}</span>
                  </div>

                  <div className="bg-gradient-to-b from-emerald-950/30 to-zinc-950 border border-emerald-500/40 rounded-xl p-3 flex flex-col items-center">
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Distância</span>
                    <span className="text-lg font-black text-emerald-300">{distanceMeters}m</span>
                  </div>
                </div>

                {/* Breakdown de Timing (Perfect vs Good vs Miss) */}
                <div className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 flex items-center justify-around text-xs mb-5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]" />
                    <span className="text-zinc-400">Perfect:</span>
                    <strong className="text-yellow-300 font-bold">{perfectHits}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    <span className="text-zinc-400">Good:</span>
                    <strong className="text-emerald-300 font-bold">{goodHits}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                    <span className="text-zinc-400">Miss:</span>
                    <strong className="text-rose-400 font-bold">{misses}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-400">Acurácia:</span>
                    <strong className={`font-bold ${accuracyPercentage >= 80 ? 'text-emerald-300' : 'text-amber-300'}`}>
                      {accuracyPercentage}%
                    </strong>
                  </div>
                </div>

                {/* Recompensa de Bytes */}
                <div className="w-full bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 flex items-center justify-between mb-5 shadow-[inset_0_0_15px_rgba(245,158,11,0.15)]">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span className="text-xs text-zinc-300 font-bold">Bytes Conquistados:</span>
                  </div>
                  <span className="text-lg font-black text-amber-300">
                    +{Math.floor(score * 0.15)} Bytes
                  </span>
                </div>

                {/* Botão Ver Ranking */}
                {onOpenLeaderboardTab && (
                  <button
                    type="button"
                    onClick={() => onOpenLeaderboardTab('dash')}
                    className="w-full mb-3 py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border-2 border-amber-500/60 text-amber-300 font-mono font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all cursor-pointer hover:scale-[1.01] active:scale-95"
                  >
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>VER RANKING GERAL</span>
                  </button>
                )}

                {/* Ações: Repetir Corrida, Trocar Classe, Sair */}
                <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-black font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_0_#b45309] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 stroke-[3]" />
                    <span>JOGAR NOVAMENTE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      typerDashAudio.stopMetronome();
                      typerDashAudio.stopGrindLoop();
                      setGameState('class_select');
                    }}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_0_#0369a1] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    <Shield className="w-4 h-4" />
                    <span>TROCAR CLASSE</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExit}
                    className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border-2 border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-zinc-400" />
                    <span>SAIR</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
