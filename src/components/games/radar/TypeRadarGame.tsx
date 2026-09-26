import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Heart, 
  Zap, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  LayoutGrid, 
  Sparkles, 
  AlertTriangle,
  RotateCcw,
  Terminal,
  Crosshair,
  Activity,
  Smartphone,
  Trophy,
  X
} from 'lucide-react';
import { CurricularTrackId } from '../../../types';
import { 
  RadarEnemy, 
  RadarLaser, 
  RadarParticle, 
  RadarUpgrade, 
  RadarRunState, 
  RadarFloatingText,
  RadarShockwave,
  RadarWaveType,
  createInitialRadarState, 
  spawnRadarEnemy, 
  spawnBossEnemy,
  getWaveType,
  getRandomUpgradeCards,
  calculateCurrentWpm,
  calculateFinalBytes,
  getWorstKey
} from '../../../services/radarEngine';
import { RADAR_COMMANDS, charMatches } from '../../../data/radarWords';
import { radarAudio } from '../../../services/radarAudio';
import { RadarCanvas } from './RadarCanvas';
import { RadarUpgradesModal } from './RadarUpgradesModal';
import { RadarGameOverModal } from './RadarGameOverModal';
import { RadarDishIcon } from './RadarIcons';
import { CockpitFrame } from './CockpitFrame';
import { PassivesPanel } from './PassivesPanel';
import { TriggerDeck } from './TriggerDeck';
import { formatBytes } from '../../../utils/formatting';
import { CapsLockWarning } from '../../common/CapsLockWarning';
import { checkCaseMismatch } from '../../../utils/keyboardCase';
import { BytezinhoAvatar } from '../../BytezinhoAvatar';
import { BytezinhoSkinId } from '../../../types/cosmetics';
import { LeaderboardMetric } from '../../LeaderboardModal';

const RADAR_BYTEZINHO_TIPS = [
  "Bora operador! Digite a 1ª letra de uma nave para travar a mira nela! 🎯",
  "Pressione / para abrir o console e disparar comandos militares! ⚡",
  "Destrua alvos longe do núcleo para ganhar bônus de pontuação! 🚀",
  "Aperte ESC ou Backspace para destravar a mira se quiser trocar de alvo! 🔄",
  "O comando /freeze congela temporariamente todos os mísseis da tela! ❄️",
  "O comando /nuke detona todas as naves da tela instantaneamente! 💥",
  "O comando /shockwave gera um pulso de empuxo que afasta as naves! 🌊",
  "Não deixe os mísseis tocarem o núcleo para poupar o escudo! 🛡️",
  "Acerte palavras completas sem errar para manter seu combo crescendo! 🔥",
  "Mantenha os dedos na fileira guia A S D F / J K L Ç para máxima velocidade! ⌨️"
];

export interface RadarEndStats {
  bestWave: number;
  score: number;
  maxWpm: number;
  bytesEarned: number;
  enemiesDefeated: number;
}

export interface TypeRadarGameProps {
  studentName?: string;
  activeTrack?: CurricularTrackId | null;
  equippedSkin?: BytezinhoSkinId;
  onExitToHub: (bytesEarned: number, endStats?: RadarEndStats) => void;
  onOpenLeaderboardTab?: (metric: LeaderboardMetric) => void;
}

export const TypeRadarGame: React.FC<TypeRadarGameProps> = ({
  studentName = 'Operador',
  activeTrack = null,
  equippedSkin = 'classic',
  onExitToHub,
  onOpenLeaderboardTab
}) => {
  const [gameState, setGameState] = useState<RadarRunState>(() => createInitialRadarState());
  const [enemies, setEnemies] = useState<RadarEnemy[]>([]);
  const [lasers, setLasers] = useState<RadarLaser[]>([]);
  const [particles, setParticles] = useState<RadarParticle[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<RadarFloatingText[]>([]);
  const [shockwaves, setShockwaves] = useState<RadarShockwave[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Alerta móvel / touch
  const [showMobileWarning, setShowMobileWarning] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0);
  });

  // Controle de onda e upgrades
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [caseWarning, setCaseWarning] = useState<string | null>(null);
  const [upgradeCards, setUpgradeCards] = useState<RadarUpgrade[]>([]);
  const enemiesSpawnedThisWaveRef = useRef<number>(0);
  const hasSpawnedBossRef = useRef<boolean>(false);

  // Quota da onda conforme o tipo de desafio
  const currentWaveType = gameState.waveType || getWaveType(gameState.wave);
  const maxEnemiesPerWave = currentWaveType === 'boss'
    ? 6 + gameState.wave * 2
    : currentWaveType === 'swarm'
    ? 18 + gameState.wave * 4
    : 12 + gameState.wave * 4;

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const enemiesRef = useRef(enemies);
  enemiesRef.current = enemies;

  const lastPerimeterAlarmRef = useRef<number>(0);

  // Feedback de XP da Onda e Transição de Energia
  const [xpFlash, setXpFlash] = useState<boolean>(false);
  const prevEnergyRef = useRef<number>(gameState.energy);
  const [comboBanner, setComboBanner] = useState<{ title: string; subtitle: string; color: string } | null>(null);
  const [waveAlertBanner, setWaveAlertBanner] = useState<{ title: string; subtitle: string; color: string } | null>(null);

  // Alerta de Erro de Tecla
  const [wrongCharAlert, setWrongCharAlert] = useState<boolean>(false);

  // Mascote Bytezinho Co-Piloto Tático no Canto Inferior Direito
  const [bytezinhoCustomMessage, setBytezinhoCustomMessage] = useState<string | null>(null);
  const [bytezinhoTipIndex, setBytezinhoTipIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBytezinhoTipIndex((prev) => (prev + 1) % RADAR_BYTEZINHO_TIPS.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const handleBytezinhoClick = useCallback(() => {
    radarAudio.playComboMilestone();
    const clickResponses = [
      "Bip-bup! Sistemas táticos em 100%! Cobrindo seus flancos, operador! 🤖",
      "Colégio Leopoldina: Defesa Cibernética de ponta nos laboratórios! 🏫✨",
      "Dica de ouro: use as duas mãos com os dedos na fileira guia A S D F / J K L Ç! ⌨️",
      "Bora quebrar o recorde da turma no ranking do Type: Radar! 🏆",
      "Mira laser calibrada! Vamos defender esse núcleo juntos! 🎯"
    ];
    const chosen = clickResponses[Math.floor(Math.random() * clickResponses.length)];
    setBytezinhoCustomMessage(chosen);
    setTimeout(() => setBytezinhoCustomMessage(null), 3500);
  }, []);

  const bytezinhoMessage = bytezinhoCustomMessage || (
    wrongCharAlert
      ? "Opa! Letra errada! Respira e foca na palavra do míssil! 💪"
      : gameState.health < 35
      ? "🚨 ALERTA VERMELHO! Casco crítico! Destrua as naves próximas! 🛡️"
      : gameState.energy >= 100
      ? "⚡ ENERGIA 100%! Digite / para acionar o poder militar! 🚀"
      : currentWaveType === 'boss'
      ? "🚨 ALERTA DE CHEFÃO! Concentre todos os disparos no líder inimigo! 👑"
      : currentWaveType === 'swarm'
      ? "⚠️ HORDA DE DRONES! Digite rápido ou use /freeze se apertar! 🐝"
      : gameState.combo >= 25
      ? `🔥 RITMO LENDÁRIO x${gameState.combo}! Você tá voando no radar! ⚡`
      : gameState.combo >= 10
      ? `✨ Super combo x${gameState.combo}! Mantenha o ritmo de digitação! 🎯`
      : gameState.activeTargetId
      ? "🎯 Alvo travado! Complete as letras restantes para pulverizar!"
      : RADAR_BYTEZINHO_TIPS[bytezinhoTipIndex]
  );

  const bytezinhoMood: 'normal' | 'happy' | 'fire' | 'oops' | 'glitch' | 'warning' =
    gameState.health < 35
      ? 'glitch'
      : wrongCharAlert
      ? 'oops'
      : gameState.combo >= 20
      ? 'fire'
      : gameState.combo >= 10 || gameState.energy >= 100
      ? 'happy'
      : 'normal';

  const bytezinhoState: 'idle' | 'typing' | 'combo' | 'error' | 'overload' =
    gameState.health < 35
      ? 'overload'
      : wrongCharAlert
      ? 'error'
      : gameState.combo >= 10
      ? 'combo'
      : gameState.activeTargetId
      ? 'typing'
      : 'idle';

  // Monitorar início de nova onda e disparar desafios (Enxame / Chefão)
  useEffect(() => {
    hasSpawnedBossRef.current = false;
    const wType = getWaveType(gameState.wave);
    setGameState((prev) => (prev.waveType !== wType ? { ...prev, waveType: wType } : prev));

    if (wType === 'boss') {
      radarAudio.playBossAlarm();
      setWaveAlertBanner({
        title: '🚨 ALERTA DE CHEFÃO // CLASSE ÔMEGA 🚨',
        subtitle: 'DREADNOUGHT COLOSSAL DETECTADO EM ROTA DE COLISÃO',
        color: '#f43f5e'
      });
      const t = setTimeout(() => setWaveAlertBanner(null), 3200);
      return () => clearTimeout(t);
    } else if (wType === 'swarm') {
      radarAudio.playSwarmAlert();
      setWaveAlertBanner({
        title: '⚠️ ALERTA DE ENXAME // INVASÃO MASSIVA ⚠️',
        subtitle: 'RAJADA DE DRONES EM ALTA VELOCIDADE (+25% VELOCIDADE)',
        color: '#f59e0b'
      });
      const t = setTimeout(() => setWaveAlertBanner(null), 2800);
      return () => clearTimeout(t);
    } else {
      radarAudio.playRadarPing();
      setWaveAlertBanner({
        title: `ONDA ${gameState.wave} // DEFESA CIBERNÉTICA ATIVA`,
        subtitle: gameState.wave === 1 ? 'SISTEMA OPERACIONAL • DIGITE PARA INTERCEPTAR' : 'AMEAÇAS CIBERNÉTICAS DETECTADAS NO PERÍMETRO',
        color: '#10b981'
      });
      const t = setTimeout(() => setWaveAlertBanner(null), 2400);
      return () => clearTimeout(t);
    }
  }, [gameState.wave]);

  // Monitorar transição para 100% de Energia com efeito sonoro
  useEffect(() => {
    const prev = prevEnergyRef.current;
    const curr = gameState.energy;
    if (prev < 100 && curr >= 100) {
      radarAudio.playEnergyFull();
    }
    prevEnergyRef.current = curr;
  }, [gameState.energy]);

  const triggerXpFlash = useCallback((duration = 350) => {
    setXpFlash(true);
    setTimeout(() => setXpFlash(false), duration);
  }, []);

  const handleComboMilestone = useCallback((comboVal: number) => {
    if (comboVal === 10) {
      radarAudio.playComboMilestone();
      setComboBanner({ title: 'COMBO x10!', subtitle: 'RITMO ACELERADO ✨', color: '#34d399' });
      setTimeout(() => setComboBanner(null), 1500);
    } else if (comboVal === 20) {
      radarAudio.playComboMilestone();
      setComboBanner({ title: 'COMBO x20!', subtitle: 'CADÊNCIA FURIOSA 🔥', color: '#fbbf24' });
      setTimeout(() => setComboBanner(null), 1500);
    } else if (comboVal === 30) {
      radarAudio.playComboMilestone();
      setComboBanner({ title: 'COMBO x30!', subtitle: 'HIPER VELOCIDADE ⚡', color: '#f43f5e' });
      setTimeout(() => setComboBanner(null), 1500);
    } else if (comboVal === 50) {
      radarAudio.playComboMilestone();
      setComboBanner({ title: 'COMBO x50!', subtitle: 'DEUS DA DIGITAÇÃO 👑', color: '#ec4899' });
      setTimeout(() => setComboBanner(null), 1800);
    }
  }, []);

  // Toggle do som
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    radarAudio.setEnabled(next);
  };

  // Spawna partículas de explosão
  const createExplosion = useCallback((x: number, y: number, color: string = '#10b981', count: number = 18) => {
    const fresh: RadarParticle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 120;
      fresh.push({
        id: `p_${Date.now()}_${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2 + Math.random() * 3.5,
        life: 1.0,
        decay: 1.8 + Math.random() * 1.5
      });
    }
    setParticles((prev) => [...prev.slice(-70), ...fresh]);
  }, []);

  // Fogo a laser da base até o alvo
  const fireLaserAt = useCallback((targetX: number, targetY: number, color: string = '#38bdf8') => {
    const canvasSize = 800;
    const cx = canvasSize / 2;
    const cy = canvasSize / 2;
    setLasers((prev) => [
      ...prev,
      {
        id: `laser_${Date.now()}_${Math.random()}`,
        startX: cx,
        startY: cy,
        endX: targetX,
        endY: targetY,
        color,
        life: 0.2
      }
    ]);
  }, []);

  // Loop de Game Mechanics a 60 FPS
  useEffect(() => {
    let lastTime = performance.now();
    let spawnTimer = 0;
    let pingTimer = 0;

    const interval = setInterval(() => {
      if (isPaused || isUpgradeModalOpen || gameStateRef.current.isGameOver) return;

      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const current = gameStateRef.current;
      const isFrozen = now < current.freezeUntilMs;

      // 1. Spawner de Inimigos com DDA, Enxame e Chefão
      spawnTimer += dt;
      const isSwarm = current.waveType === 'swarm';
      const isBossWave = current.waveType === 'boss';
      const baseInterval = isSwarm ? 0.85 : Math.max(1.1, 3.1 - current.wave * 0.22);
      const spawnInterval = isSwarm ? Math.max(0.6, baseInterval - current.wave * 0.04) : baseInterval;

      const totalKeys = current.correctChars + current.wrongChars;
      const currentAccuracy = totalKeys > 0 ? (current.correctChars / totalKeys) * 100 : 100;

      if (isBossWave && !hasSpawnedBossRef.current) {
        hasSpawnedBossRef.current = true;
        enemiesSpawnedThisWaveRef.current += 1;
        const bossEnemy = spawnBossEnemy(current.wave, activeTrack);
        setEnemies((prev) => [bossEnemy, ...prev]);
        enemiesRef.current = [bossEnemy, ...enemiesRef.current];
      } else if (enemiesSpawnedThisWaveRef.current === 0) {
        // Spawna imediatamente as primeiras ameaças no início da onda
        spawnTimer = 0;
        const initialCount = isSwarm ? 3 : 2;
        const initialEnemies: RadarEnemy[] = [];
        let accEnemies = [...enemiesRef.current];
        for (let i = 0; i < initialCount && enemiesSpawnedThisWaveRef.current < maxEnemiesPerWave; i++) {
          enemiesSpawnedThisWaveRef.current += 1;
          const newEnemy = spawnRadarEnemy(current.wave, activeTrack, accEnemies, currentAccuracy, isSwarm);
          accEnemies.push(newEnemy);
          initialEnemies.push(newEnemy);
        }
        setEnemies((prev) => [...prev, ...initialEnemies]);
        enemiesRef.current = [...enemiesRef.current, ...initialEnemies];
      } else if (spawnTimer >= spawnInterval && enemiesSpawnedThisWaveRef.current < maxEnemiesPerWave) {
        spawnTimer = 0;
        enemiesSpawnedThisWaveRef.current += 1;
        const newEnemy = spawnRadarEnemy(current.wave, activeTrack, enemiesRef.current, currentAccuracy, isSwarm);
        setEnemies((prev) => [...prev, newEnemy]);
        enemiesRef.current = [...enemiesRef.current, newEnemy];
      }

      // Sonar Ping periódico
      pingTimer += dt;
      if (pingTimer >= (isFrozen ? 6 : 3.5)) {
        pingTimer = 0;
        radarAudio.playRadarPing();
      }

      // Alarme de Perímetro Crítico (inimigo < 110px do centro)
      const hasCloseThreat = enemiesRef.current.some((e) => e.distance < 110);
      if (hasCloseThreat && now - lastPerimeterAlarmRef.current > 1200) {
        lastPerimeterAlarmRef.current = now;
        radarAudio.playPerimeterAlarm();
      }

      // 2. Movimento dos Inimigos em Direção ao Centro
      const canvasSize = 800;
      const cx = canvasSize / 2;
      const cy = canvasSize / 2;
      let damageTaken = 0;
      let enemyReachedBase = false;

      const currentEnemies = enemiesRef.current;
      const nextList: RadarEnemy[] = [];

      currentEnemies.forEach((enemy) => {
        if (enemy.isParalyzedUntilMs && now < enemy.isParalyzedUntilMs) {
          nextList.push(enemy);
          return;
        }

        let effectiveSpeed = enemy.speed;
        if (current.upgrades.cryo_dampeners) effectiveSpeed *= 0.85;
        if (isFrozen) effectiveSpeed *= 0.25;

        const newDistance = enemy.distance - effectiveSpeed * dt;

        if (newDistance <= 28) {
          enemyReachedBase = true;
          const hitDamage = enemy.type === 'boss' ? 55 : enemy.type === 'tank' ? 35 : 18;
          damageTaken += hitDamage;
          const ex = cx + Math.cos(enemy.angle) * 28;
          const ey = cy + Math.sin(enemy.angle) * 28;
          createExplosion(ex, ey, '#ef4444', 32);
        } else {
          nextList.push({ ...enemy, distance: newDistance });
        }
      });

      setEnemies(nextList);
      enemiesRef.current = nextList;

      // Aplica dano à base, reseta combo e ativa Screen Shake
      if (enemyReachedBase && damageTaken > 0) {
        radarAudio.playExplosion();
        setGameState((prev) => {
          let currentShield = prev.shield;
          let currentHealth = prev.health;

          if (currentShield > 0) {
            if (currentShield >= damageTaken) {
              currentShield -= damageTaken;
            } else {
              const remainingDamage = damageTaken - currentShield;
              currentShield = 0;
              currentHealth = Math.max(0, currentHealth - remainingDamage);
            }
          } else {
            currentHealth = Math.max(0, currentHealth - damageTaken);
          }

          const isOver = currentHealth <= 0;
          return {
            ...prev,
            shield: currentShield,
            health: currentHealth,
            combo: 0,
            screenShakeIntensity: Math.min(25, prev.screenShakeIntensity + 18),
            isGameOver: isOver
          };
        });
      }

      // Decaimento de Screen Shake
      if (current.screenShakeIntensity > 0) {
        setGameState((prev) => ({
          ...prev,
          screenShakeIntensity: Math.max(0, prev.screenShakeIntensity - dt * 25)
        }));
      }

      // 3. Atualiza Fading de Lasers
      setLasers((prev) => 
        prev
          .map((l) => ({ ...l, life: l.life - dt * 4 }))
          .filter((l) => l.life > 0)
      );

      // 4. Atualiza Partículas
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt,
            life: p.life - p.decay * dt
          }))
          .filter((p) => p.life > 0)
      );

      // 5. Atualiza Textos Flutuantes (XP / PTS / BYTES)
      setFloatingTexts((prev) =>
        prev
          .map((ft) => ({
            ...ft,
            y: ft.y + ft.vy * dt,
            life: ft.life - ft.decay * dt
          }))
          .filter((ft) => ft.life > 0)
      );

      // 6. Atualiza Shockwaves em Expansão
      setShockwaves((prev) =>
        prev
          .map((sw) => ({
            ...sw,
            radius: sw.radius + (sw.maxRadius - sw.radius) * 9 * dt,
            life: sw.life - sw.decay * dt
          }))
          .filter((sw) => sw.life > 0)
      );

      // 7. Verificação de Conclusão da Onda
      if (
        enemiesSpawnedThisWaveRef.current >= maxEnemiesPerWave &&
        enemiesRef.current.length === 0 &&
        !isUpgradeModalOpen &&
        !current.isGameOver
      ) {
        setIsUpgradeModalOpen(true);
        setUpgradeCards(getRandomUpgradeCards(current.upgrades));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [isPaused, isUpgradeModalOpen, maxEnemiesPerWave, activeTrack, createExplosion]);

  // Execução de Comandos de Terminal (/NUKE, /FREEZE, /SHIELD, /EMP)
  const executeCommand = useCallback((cmdKeyword: string) => {
    const cmd = RADAR_COMMANDS.find((c) => c.keyword === cmdKeyword.toUpperCase());
    if (!cmd) return;

    const current = gameStateRef.current;
    let actualCost = cmd.energyCost;
    if (cmd.keyword === '/NUKE' && current.upgrades.nuke_frequency) actualCost = 75;

    if (current.energy < actualCost) {
      radarAudio.playAlarm();
      return;
    }

    const canvasSize = 800;
    const cx = canvasSize / 2;
    const cy = canvasSize / 2;

    switch (cmd.keyword) {
      case '/NUKE': {
        radarAudio.playNuke();
        const defeatedCount = enemiesRef.current.length;
        const scoreGained = defeatedCount * 60;
        const bytesGained = defeatedCount * 12;

        enemiesRef.current.forEach((enemy) => {
          const ex = cx + Math.cos(enemy.angle) * enemy.distance;
          const ey = cy + Math.sin(enemy.angle) * enemy.distance;
          createExplosion(ex, ey, '#fbbf24', 22);

          // Shockwave em cada inimigo
          setShockwaves((prev) => [
            ...prev.slice(-12),
            {
              id: `sw_${Date.now()}_${Math.random()}`,
              x: ex,
              y: ey,
              radius: 8,
              maxRadius: 40,
              color: '#fbbf24',
              life: 1.0,
              decay: 3.0
            }
          ]);
        });

        // Texto flutuante central do Nuke
        setFloatingTexts((prev) => [
          ...prev.slice(-15),
          {
            id: `ft_nuke_${Date.now()}`,
            x: cx,
            y: cy - 40,
            text: `+${scoreGained} PTS // NUKE`,
            subText: `+${bytesGained} BYTES`,
            color: '#fbbf24',
            life: 1.2,
            decay: 0.9,
            vy: -40,
            size: 18
          }
        ]);

        triggerXpFlash(500);
        setEnemies([]);
        setGameState((prev) => ({
          ...prev,
          energy: prev.energy - actualCost,
          score: prev.score + scoreGained,
          bytesEarned: prev.bytesEarned + bytesGained,
          enemiesDefeated: prev.enemiesDefeated + defeatedCount,
          waveEnemiesDefeated: prev.waveEnemiesDefeated + defeatedCount,
          activeTargetId: null,
          shockwaveActiveUntilMs: Date.now() + 300,
          screenShakeIntensity: 24
        }));
        break;
      }

      case '/FREEZE': {
        radarAudio.playFreeze();
        const duration = current.upgrades.terminal_overclock ? 8000 : 5000;
        setGameState((prev) => ({
          ...prev,
          energy: prev.energy - actualCost,
          freezeUntilMs: Date.now() + duration
        }));
        break;
      }

      case '/SHIELD': {
        radarAudio.playShieldUp();
        setGameState((prev) => ({
          ...prev,
          energy: prev.energy - actualCost,
          shield: Math.min(prev.maxShield, prev.shield + 50)
        }));
        break;
      }

      case '/EMP': {
        radarAudio.playFreeze();
        setEnemies((prev) => {
          const sorted = [...prev].sort((a, b) => a.distance - b.distance);
          const paralyzedIds = new Set(sorted.slice(0, 3).map((e) => e.id));
          return prev.map((e) =>
            paralyzedIds.has(e.id) ? { ...e, isParalyzedUntilMs: Date.now() + 6000 } : e
          );
        });
        setGameState((prev) => ({
          ...prev,
          energy: prev.energy - actualCost
        }));
        break;
      }
    }
  }, [createExplosion]);

  // Gerenciador de Entrada de Teclado
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isPaused || isUpgradeModalOpen || gameStateRef.current.isGameOver) return;

    const key = e.key;

    if (key === '/' || key === "'" || key === ' ' || key === 'Tab') {
      e.preventDefault();
    }

    // 1. Limpeza de Mira e Cancelamento (Backspace ou Escape)
    if (key === 'Escape' || key === 'Backspace') {
      e.preventDefault();
      const current = gameStateRef.current;

      if (current.isCommandMode || current.commandBuffer) {
        if (key === 'Escape') {
          setGameState((prev) => ({ ...prev, commandBuffer: '', isCommandMode: false }));
          return;
        }
        if (key === 'Backspace') {
          const nextBuf = current.commandBuffer.slice(0, -1);
          setGameState((prev) => ({
            ...prev,
            commandBuffer: nextBuf,
            isCommandMode: nextBuf.length > 0
          }));
          return;
        }
      }

      if (current.activeTargetId) {
        const targetId = current.activeTargetId;
        setEnemies((prev) =>
          prev.map((enemy) => (enemy.id === targetId ? { ...enemy, typedLength: 0 } : enemy))
        );
        setGameState((prev) => ({ ...prev, activeTargetId: null }));
        return;
      }
      return;
    }

    // 2. Ativação do Modo Terminal ao teclar '/'
    if (key === '/' && !gameStateRef.current.isCommandMode) {
      e.preventDefault();
      setGameState((prev) => ({
        ...prev,
        isCommandMode: true,
        commandBuffer: '/',
        activeTargetId: null
      }));
      return;
    }

    // 3. Digitação dentro do Buffer de Comandos do Terminal
    if (gameStateRef.current.isCommandMode || gameStateRef.current.commandBuffer.startsWith('/')) {
      e.preventDefault();
      if (key === 'Enter') {
        const cmd = gameStateRef.current.commandBuffer.toUpperCase();
        executeCommand(cmd);
        setGameState((prev) => ({ ...prev, commandBuffer: '', isCommandMode: false }));
        return;
      }

      if (key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        let nextBuf = gameStateRef.current.commandBuffer;
        if (!nextBuf.startsWith('/')) {
          nextBuf = '/' + (key === '/' ? '' : key.toUpperCase());
        } else if (key !== '/') {
          nextBuf = (nextBuf + key).toUpperCase();
        }

        setGameState((prev) => ({ ...prev, commandBuffer: nextBuf }));

        if (['/NUKE', '/FREEZE', '/SHIELD', '/EMP'].includes(nextBuf)) {
          executeCommand(nextBuf);
          setGameState((prev) => ({ ...prev, commandBuffer: '', isCommandMode: false }));
        }
        return;
      }
      return;
    }

    // 4. Modo de Combate / Digitação de Inimigos
    if (key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;
    e.preventDefault();

    const currentEnemies = enemiesRef.current;
    let target = currentEnemies.find((e) => e.id === gameStateRef.current.activeTargetId);

    // Se não há alvo travado: Algoritmo de Desambiguação de Alvos (Target Lock)
    if (!target) {
      const candidates = currentEnemies.filter((e) =>
        charMatches(e.word.charAt(0), key, false)
      );

      if (candidates.length > 0) {
        candidates.sort((a, b) => a.distance - b.distance);
        target = candidates[0];

        const nextTyped = 1;
        const isWordComplete = nextTyped >= target.word.length;
        radarAudio.playTargetHit(nextTyped);

        let energyGain = 4;
        if (gameStateRef.current.upgrades.kinetic_capacitor) energyGain = 6;
        const liveWpm = calculateCurrentWpm(gameStateRef.current.correctChars + 1, gameStateRef.current.startTimeMs);

        const nextCombo = gameStateRef.current.combo + 1;
        const nextMaxCombo = Math.max(gameStateRef.current.maxCombo, nextCombo);

        const canvasSize = 800;
        const cx = canvasSize / 2;
        const cy = canvasSize / 2;
        const ex = cx + Math.cos(target.angle) * target.distance;
        const ey = cy + Math.sin(target.angle) * target.distance;

        if (isWordComplete) {
          const isBossMultiPhase = target.type === 'boss' && (target.bossHp || 1) > 1;

          if (isBossMultiPhase) {
            const remainingHp = (target.bossHp || 1) - 1;
            const nextStageIndex = (target.bossCurrentStageIndex || 0) + 1;
            const nextWord = target.bossStages?.[nextStageIndex] || 'EXTERMINIO';

            radarAudio.playBossPhaseHit();
            createExplosion(ex, ey, '#f43f5e', 36);
            triggerXpFlash(400);

            setShockwaves((prev) => [
              ...prev.slice(-10),
              {
                id: `sw_boss_${Date.now()}`,
                x: ex,
                y: ey,
                radius: 12,
                maxRadius: 65,
                color: '#f43f5e',
                life: 1.0,
                decay: 2.8
              }
            ]);

            setFloatingTexts((prev) => [
              ...prev.slice(-15),
              {
                id: `ft_boss_${Date.now()}`,
                x: ex,
                y: ey - 15,
                text: `FASE DESTRUÍDA! [RESTAM ${remainingHp}]`,
                subText: `PRÓXIMO: ${nextWord}`,
                color: '#f43f5e',
                life: 1.2,
                decay: 0.9,
                vy: -40,
                size: 16
              }
            ]);

            setEnemies((prev) =>
              prev.map((e) =>
                e.id === target!.id
                  ? {
                      ...e,
                      word: nextWord,
                      typedLength: 0,
                      bossHp: remainingHp,
                      bossCurrentStageIndex: nextStageIndex
                    }
                  : e
              )
            );

            setGameState((prev) => ({
              ...prev,
              activeTargetId: null,
              correctChars: prev.correctChars + 1,
              combo: nextCombo + 4,
              maxCombo: Math.max(nextMaxCombo, nextCombo + 4),
              peakWpm: Math.max(prev.peakWpm, liveWpm),
              energy: Math.min(prev.maxEnergy, prev.energy + 25),
              screenShakeIntensity: 20
            }));
          } else {
            if (target.type === 'boss') {
              radarAudio.playNuke();
              radarAudio.playExplosion();
              createExplosion(ex, ey, '#f43f5e', 55);
              triggerXpFlash(600);
            } else {
              radarAudio.playLaserBlast();
              radarAudio.playExplosion();
              fireLaserAt(ex, ey, target.type === 'tank' ? '#f59e0b' : '#38bdf8');
              createExplosion(ex, ey, target.type === 'tank' ? '#f59e0b' : '#10b981', 28);
            }

            // Shockwave de impacto
            setShockwaves((prev) => [
              ...prev.slice(-10),
              {
                id: `sw_${Date.now()}_${Math.random()}`,
                x: ex,
                y: ey,
                radius: 6,
                maxRadius: target.type === 'boss' ? 70 : target.type === 'tank' ? 44 : 30,
                color: target.type === 'boss' ? '#f43f5e' : target.type === 'tank' ? '#f59e0b' : '#38bdf8',
                life: 1.0,
                decay: 3.4
              }
            ]);

            let scoreBonus = target.scoreValue;
            let bytesBonus = target.byteValue;

            const comboMultiplier = 1 + Math.min(1.0, nextCombo * 0.02);
            scoreBonus = Math.round(scoreBonus * comboMultiplier);

            if (gameStateRef.current.upgrades.laser_overcharge) {
              scoreBonus = Math.round(scoreBonus * 1.35);
              bytesBonus = Math.round(bytesBonus * 1.35);
            }
            if (gameStateRef.current.upgrades.byte_multiplier) {
              bytesBonus = Math.round(bytesBonus * 2.0);
            }

            // Texto Flutuante de XP / Pontos e Bytes
            setFloatingTexts((prev) => [
              ...prev.slice(-15),
              {
                id: `ft_${Date.now()}_${Math.random()}`,
                x: ex,
                y: ey - 10,
                text: `+${scoreBonus} PTS` + (target.type === 'boss' ? ' // CHEFÃO DERROTADO!' : ''),
                subText: `+${bytesBonus} BYTES` + (nextCombo >= 5 ? ` [COMBO x${nextCombo}]` : ''),
                color: target.type === 'boss' ? '#f43f5e' : nextCombo >= 10 ? '#f59e0b' : '#38bdf8',
                life: 1.2,
                decay: 0.9,
                vy: -48,
                size: target.type === 'boss' ? 18 : nextCombo >= 10 ? 16 : 14
              }
            ]);

            triggerXpFlash(350);
            handleComboMilestone(nextCombo + 3);

            setEnemies((prev) => prev.filter((e) => e.id !== target!.id));
            setGameState((prev) => ({
              ...prev,
              activeTargetId: null,
              score: prev.score + scoreBonus,
              bytesEarned: prev.bytesEarned + bytesBonus,
              enemiesDefeated: prev.enemiesDefeated + 1,
              waveEnemiesDefeated: prev.waveEnemiesDefeated + 1,
              wordsTyped: prev.wordsTyped + 1,
              correctChars: prev.correctChars + 1,
              combo: nextCombo + 3,
              maxCombo: Math.max(nextMaxCombo, nextCombo + 3),
              peakWpm: Math.max(prev.peakWpm, liveWpm),
              energy: Math.min(prev.maxEnergy, prev.energy + energyGain * 2)
            }));
          }
        } else {
          // Centelha de acerto no míssil
          createExplosion(ex, ey, '#34d399', 4);
          handleComboMilestone(nextCombo);

          setEnemies((prev) =>
            prev.map((e) => (e.id === target!.id ? { ...e, typedLength: nextTyped } : e))
          );
          setGameState((prev) => ({
            ...prev,
            activeTargetId: target!.id,
            correctChars: prev.correctChars + 1,
            combo: nextCombo,
            maxCombo: nextMaxCombo,
            peakWpm: Math.max(prev.peakWpm, liveWpm),
            energy: Math.min(prev.maxEnergy, prev.energy + energyGain)
          }));
        }
      } else {
        radarAudio.playAlarm();
        setWrongCharAlert(true);
        setTimeout(() => setWrongCharAlert(false), 800);
        const errChar = key.toUpperCase();
        setGameState((prev) => ({
          ...prev,
          wrongChars: prev.wrongChars + 1,
          combo: 0,
          errorHeatmap: {
            ...prev.errorHeatmap,
            [errChar]: (prev.errorHeatmap[errChar] || 0) + 1
          }
        }));
      }
      return;
    }

    // Alvo já travado na mira
    const expectedChar = target.word.charAt(target.typedLength);
    const isMatch = charMatches(expectedChar, key, false);

    const canvasSize = 800;
    const cx = canvasSize / 2;
    const cy = canvasSize / 2;
    const ex = cx + Math.cos(target.angle) * target.distance;
    const ey = cy + Math.sin(target.angle) * target.distance;

    if (isMatch) {
      setCaseWarning(null);
      const nextTyped = target.typedLength + 1;
      const isWordComplete = nextTyped >= target.word.length;

      radarAudio.playTargetHit(nextTyped);

      let energyGain = 4;
      if (gameStateRef.current.upgrades.kinetic_capacitor) energyGain = 6;
      const liveWpm = calculateCurrentWpm(gameStateRef.current.correctChars + 1, gameStateRef.current.startTimeMs);

      const nextCombo = gameStateRef.current.combo + 1;
      const nextMaxCombo = Math.max(gameStateRef.current.maxCombo, nextCombo);

      if (isWordComplete) {
        const isBossMultiPhase = target.type === 'boss' && (target.bossHp || 1) > 1;

        if (isBossMultiPhase) {
          const remainingHp = (target.bossHp || 1) - 1;
          const nextStageIndex = (target.bossCurrentStageIndex || 0) + 1;
          const nextWord = target.bossStages?.[nextStageIndex] || 'EXTERMINIO';

          radarAudio.playBossPhaseHit();
          createExplosion(ex, ey, '#f43f5e', 36);
          triggerXpFlash(400);

          setShockwaves((prev) => [
            ...prev.slice(-10),
            {
              id: `sw_boss_${Date.now()}`,
              x: ex,
              y: ey,
              radius: 12,
              maxRadius: 65,
              color: '#f43f5e',
              life: 1.0,
              decay: 2.8
            }
          ]);

          setFloatingTexts((prev) => [
            ...prev.slice(-15),
            {
              id: `ft_boss_${Date.now()}`,
              x: ex,
              y: ey - 15,
              text: `FASE DESTRUÍDA! [RESTAM ${remainingHp}]`,
              subText: `PRÓXIMO: ${nextWord}`,
              color: '#f43f5e',
              life: 1.2,
              decay: 0.9,
              vy: -40,
              size: 16
            }
          ]);

          setEnemies((prev) =>
            prev.map((e) =>
              e.id === target!.id
                ? {
                    ...e,
                    word: nextWord,
                    typedLength: 0,
                    bossHp: remainingHp,
                    bossCurrentStageIndex: nextStageIndex
                  }
                : e
            )
          );

          setGameState((prev) => ({
            ...prev,
            activeTargetId: null,
            correctChars: prev.correctChars + 1,
            combo: nextCombo + 4,
            maxCombo: Math.max(nextMaxCombo, nextCombo + 4),
            peakWpm: Math.max(prev.peakWpm, liveWpm),
            energy: Math.min(prev.maxEnergy, prev.energy + 25),
            screenShakeIntensity: 20
          }));
        } else {
          if (target.type === 'boss') {
            radarAudio.playNuke();
            radarAudio.playExplosion();
            createExplosion(ex, ey, '#f43f5e', 55);
            triggerXpFlash(600);
          } else {
            radarAudio.playLaserBlast();
            radarAudio.playExplosion();
            fireLaserAt(ex, ey, target.type === 'tank' ? '#f59e0b' : '#38bdf8');
            createExplosion(ex, ey, target.type === 'tank' ? '#f59e0b' : '#10b981', 28);
          }

          // Shockwave de impacto
          setShockwaves((prev) => [
            ...prev.slice(-10),
            {
              id: `sw_${Date.now()}_${Math.random()}`,
              x: ex,
              y: ey,
              radius: 6,
              maxRadius: target.type === 'boss' ? 70 : target.type === 'tank' ? 44 : 30,
              color: target.type === 'boss' ? '#f43f5e' : target.type === 'tank' ? '#f59e0b' : '#38bdf8',
              life: 1.0,
              decay: 3.4
            }
          ]);

          let scoreBonus = target.scoreValue;
          let bytesBonus = target.byteValue;

          const comboMultiplier = 1 + Math.min(1.0, nextCombo * 0.02);
          scoreBonus = Math.round(scoreBonus * comboMultiplier);

          if (gameStateRef.current.upgrades.laser_overcharge) {
            scoreBonus = Math.round(scoreBonus * 1.35);
            bytesBonus = Math.round(bytesBonus * 1.35);
          }
          if (gameStateRef.current.upgrades.byte_multiplier) {
            bytesBonus = Math.round(bytesBonus * 2.0);
          }

          // Texto Flutuante de XP / Pontos e Bytes
          setFloatingTexts((prev) => [
            ...prev.slice(-15),
            {
              id: `ft_${Date.now()}_${Math.random()}`,
              x: ex,
              y: ey - 10,
              text: `+${scoreBonus} PTS` + (target.type === 'boss' ? ' // CHEFÃO DERROTADO!' : ''),
              subText: `+${bytesBonus} BYTES` + (nextCombo >= 5 ? ` [COMBO x${nextCombo}]` : ''),
              color: target.type === 'boss' ? '#f43f5e' : nextCombo >= 10 ? '#f59e0b' : '#38bdf8',
              life: 1.2,
              decay: 0.9,
              vy: -48,
              size: target.type === 'boss' ? 18 : nextCombo >= 10 ? 16 : 14
            }
          ]);

          triggerXpFlash(350);
          handleComboMilestone(nextCombo + 3);

          setEnemies((prev) => prev.filter((e) => e.id !== target!.id));
          setGameState((prev) => ({
            ...prev,
            activeTargetId: null,
            score: prev.score + scoreBonus,
            bytesEarned: prev.bytesEarned + bytesBonus,
            enemiesDefeated: prev.enemiesDefeated + 1,
            waveEnemiesDefeated: prev.waveEnemiesDefeated + 1,
            wordsTyped: prev.wordsTyped + 1,
            correctChars: prev.correctChars + 1,
            combo: nextCombo + 3,
            maxCombo: Math.max(nextMaxCombo, nextCombo + 3),
            peakWpm: Math.max(prev.peakWpm, liveWpm),
            energy: Math.min(prev.maxEnergy, prev.energy + energyGain * 2)
          }));
        }
      } else {
        // Centelha de acerto no míssil
        createExplosion(ex, ey, '#34d399', 4);
        handleComboMilestone(nextCombo);

        setEnemies((prev) =>
          prev.map((e) => (e.id === target!.id ? { ...e, typedLength: nextTyped } : e))
        );
        setGameState((prev) => ({
          ...prev,
          correctChars: prev.correctChars + 1,
          combo: nextCombo,
          maxCombo: nextMaxCombo,
          peakWpm: Math.max(prev.peakWpm, liveWpm),
          energy: Math.min(prev.maxEnergy, prev.energy + energyGain)
        }));
      }
    } else {
      radarAudio.playAlarm();
      setWrongCharAlert(true);
      setTimeout(() => setWrongCharAlert(false), 800);
      const caseResult = checkCaseMismatch(key, expectedChar);
      if (caseResult.isMismatch) {
        setCaseWarning(caseResult.message || null);
      } else {
        setCaseWarning(null);
      }
      const missedKey = expectedChar.toUpperCase();
      setGameState((prev) => ({
        ...prev,
        wrongChars: prev.wrongChars + 1,
        combo: 0,
        errorHeatmap: {
          ...prev.errorHeatmap,
          [missedKey]: (prev.errorHeatmap[missedKey] || 0) + 1
        }
      }));
    }
  }, [isPaused, isUpgradeModalOpen, executeCommand, fireLaserAt, createExplosion]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [handleKeyDown]);

  // Escolha de Upgrade Roguelike
  const handleSelectUpgrade = (upgrade: RadarUpgrade) => {
    setGameState((prev) => {
      const nextUpgrades = {
        ...prev.upgrades,
        [upgrade.id]: (prev.upgrades[upgrade.id] || 0) + 1
      };

      let newHealth = prev.health;
      let newShield = prev.shield;
      let newMaxShield = prev.maxShield;

      if (upgrade.id === 'nano_repair') {
        newHealth = Math.min(prev.maxHealth, prev.health + 25);
      }
      if (upgrade.id === 'shield_generator') {
        newMaxShield += 30;
        newShield = Math.min(newMaxShield, prev.shield + 20);
      }

      return {
        ...prev,
        wave: prev.wave + 1,
        waveEnemiesDefeated: 0,
        health: newHealth,
        shield: newShield,
        maxShield: newMaxShield,
        upgrades: nextUpgrades
      };
    });

    enemiesSpawnedThisWaveRef.current = 0;
    hasSpawnedBossRef.current = false;
    enemiesRef.current = [];
    setEnemies([]);
    setIsUpgradeModalOpen(false);
  };

  // Reiniciar Partida
  const handleRestart = () => {
    enemiesSpawnedThisWaveRef.current = 0;
    hasSpawnedBossRef.current = false;
    lastPerimeterAlarmRef.current = 0;
    enemiesRef.current = [];
    setEnemies([]);
    setLasers([]);
    setParticles([]);
    setFloatingTexts([]);
    setShockwaves([]);
    setGameState(createInitialRadarState());
  };

  const currentWpm = calculateCurrentWpm(gameState.correctChars, gameState.startTimeMs);
  const wavePercent = maxEnemiesPerWave > 0 ? Math.min(100, Math.round((gameState.waveEnemiesDefeated / maxEnemiesPerWave) * 100)) : 0;

  return (
    <div className="min-h-screen bg-[#07090c] text-zinc-100 flex flex-col font-sans relative select-none overflow-hidden">
      {/* Banner de Aviso para Dispositivos Móveis / Touch */}
      {showMobileWarning && (
        <div className="bg-amber-950/80 border-b border-amber-500/40 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-between gap-2 z-40">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Aviso de Compatibilidade:</strong> Dispositivo touchscreen detectado. Recomendamos fortemente o uso de um <strong>teclado físico</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowMobileWarning(false)}
            className="p-1 hover:bg-amber-900/50 rounded-lg text-amber-300 transition cursor-pointer"
            title="Fechar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* HUD Superior / Console Militar Integrado */}
      <header className="border-b-2 border-zinc-800/90 bg-[#0c0f16]/98 px-3 sm:px-6 py-2.5 z-30 flex items-center justify-between gap-3 flex-wrap shadow-xl">
        
        {/* Identificação do Operador */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 font-mono shadow-[0_0_18px_rgba(16,185,129,0.35)]">
            <RadarDishIcon size={24} color="#34d399" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg text-white tracking-tight">Type: Radar</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/50 text-[11px] font-mono font-black">
                ONDA {gameState.wave}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Operador: <strong className="text-emerald-300">{studentName}</strong>
            </p>
          </div>
        </div>

        {/* Console Central de Status Integrados com VU-Meter LED */}
        <div className="flex flex-col items-center bg-[#0e131d] border-2 border-zinc-700/85 rounded-2xl px-4 sm:px-6 py-2 shadow-[0_6px_28px_rgba(0,0,0,0.85)]">
          {/* Fileira de Pods de Status */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 flex-wrap">
            {/* Integridade (HP) */}
            <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-zinc-800 shadow-inner">
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold leading-none">INTEGRIDADE</span>
                <div className="w-20 sm:w-24 h-2 bg-zinc-800 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-red-500 transition-all duration-200"
                    style={{ width: `${(gameState.health / gameState.maxHealth) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-xs sm:text-sm font-mono font-black text-red-400 ml-1">
                {Math.max(0, gameState.health)}
              </span>
            </div>

            {/* Escudo Defensivo */}
            <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-zinc-800 shadow-inner">
              <Shield className="w-4 h-4 text-sky-400" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold leading-none">ESCUDO</span>
                <div className="w-16 sm:w-20 h-2 bg-zinc-800 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-sky-400 transition-all duration-200"
                    style={{ width: `${(gameState.shield / gameState.maxShield) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-xs sm:text-sm font-mono font-black text-sky-400 ml-1">
                {gameState.shield}
              </span>
            </div>

            {/* Energia Cibernética com Efeito de Carga Máxima (100%) */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 shadow-inner ${
              gameState.energy >= 100
                ? 'bg-amber-950/70 border-amber-400 shadow-[0_0_22px_rgba(251,191,36,0.65)] animate-pulse'
                : 'bg-black/60 border-zinc-800'
            }`}>
              <Zap className={`w-4 h-4 fill-current ${
                gameState.energy >= 100 ? 'text-amber-300 animate-bounce' : 'text-amber-400'
              }`} />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold leading-none">
                  {gameState.energy >= 100 ? '⚡ SOBRECARGA' : 'ENERGIA'}
                </span>
                <div className="w-16 sm:w-20 h-2 bg-zinc-800 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full transition-all duration-200 ${
                      gameState.energy >= 100
                        ? 'bg-amber-300 shadow-[0_0_10px_#f59e0b]'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${(gameState.energy / gameState.maxEnergy) * 100}%` }}
                  />
                </div>
              </div>
              <span className={`text-xs sm:text-sm font-mono font-black ml-1 ${
                gameState.energy >= 100 ? 'text-amber-200' : 'text-amber-400'
              }`}>
                {Math.round(gameState.energy)}%
              </span>
            </div>

            {/* Medidor Live WPM */}
            <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-zinc-800 shadow-inner">
              <Activity className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-zinc-400 uppercase font-bold leading-none">WPM REAL</span>
                <span className="text-xs sm:text-sm font-mono font-black text-emerald-400 mt-0.5">
                  {currentWpm}
                </span>
              </div>
            </div>
          </div>

          {/* Barra VU-Meter LED Simulando Frequência do Console */}
          <div className="flex items-center gap-1 mt-2 opacity-85">
            {Array.from({ length: 24 }).map((_, i) => {
              const activeCount = Math.round((gameState.energy / 100) * 24);
              const isActive = i <= activeCount;
              const isHigh = i > 18;
              const isMid = i > 12;
              const ledColor = isHigh
                ? 'bg-red-500 shadow-[0_0_5px_#ef4444]'
                : isMid
                ? 'bg-amber-400 shadow-[0_0_5px_#fbbf24]'
                : 'bg-emerald-400 shadow-[0_0_5px_#34d399]';

              return (
                <div
                  key={i}
                  className={`w-1 sm:w-1.5 h-2.5 rounded-full transition-all duration-150 ${
                    isActive ? ledColor : 'bg-zinc-800/80'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Indicador de Combo, Pontuação e Botões de Controle */}
        <div className="flex items-center gap-3">
          {/* Indicador de Combo com Feedback de Animação */}
          <motion.div
            key={gameState.combo}
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 bg-[#121622] px-3.5 py-1.5 rounded-xl border-2 border-zinc-700/90 shadow-md"
          >
            <span className="text-[10px] font-mono text-zinc-400 font-black uppercase tracking-wider">
              COMBO
            </span>
            <span
              className={`text-base font-mono font-black ${
                gameState.combo >= 20
                  ? 'text-amber-400 animate-pulse drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]'
                  : gameState.combo >= 10
                  ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                  : gameState.combo > 0
                  ? 'text-sky-300'
                  : 'text-zinc-500'
              }`}
            >
              {gameState.combo}
            </span>
          </motion.div>

          {/* Pontos */}
          <div className="text-right hidden lg:block">
            <div className="text-[10px] text-zinc-400 font-mono font-semibold">PONTUAÇÃO</div>
            <div className="text-base font-black text-amber-300 font-mono">
              {gameState.score.toLocaleString()}
            </div>
          </div>

          {/* Bytes Ganhos */}
          <div className="text-right">
            <div className="text-[10px] text-zinc-400 font-mono font-semibold">BYTES GANHOS</div>
            <div className="text-base font-black text-emerald-400 font-mono">
              +{formatBytes(gameState.bytesEarned)}
            </div>
          </div>

          {/* Som on/off */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition cursor-pointer"
            title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Áudio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          {/* Pausa */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
              isPaused ? 'bg-amber-500 text-black border-amber-400' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
            title="Pausar Radar"
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Voltar ao Hub */}
          <button
            type="button"
            onClick={() => {
              const totalKeys = gameState.correctChars + gameState.wrongChars;
              const acc = totalKeys > 0 ? (gameState.correctChars / totalKeys) * 100 : 100;
              const calculatedBytes = calculateFinalBytes(
                gameState.score,
                acc,
                gameState.wave,
                !!gameState.upgrades.byte_multiplier
              );
              const finalBytes = Math.max(gameState.bytesEarned, calculatedBytes);
              const currentWpm = calculateCurrentWpm(gameState.correctChars, gameState.startTimeMs);
              onExitToHub(finalBytes, {
                bestWave: gameState.wave,
                score: gameState.score,
                maxWpm: gameState.peakWpm || currentWpm,
                bytesEarned: finalBytes,
                enemiesDefeated: gameState.enemiesDefeated
              });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/50 text-xs font-bold transition cursor-pointer shadow-sm"
            title="Sair da partida e salvar os Bytes conquistados"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hub</span>
          </button>

          {/* Ranking do Type: Radar */}
          {onOpenLeaderboardTab && (
            <button
              type="button"
              onClick={() => {
                setIsPaused(true);
                onOpenLeaderboardTab('radar');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/50 text-xs font-bold transition cursor-pointer shadow-sm active:scale-95"
              title="Ver Ranking Escolar do Type: Radar"
            >
              <Trophy className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Ranking</span>
            </button>
          )}
        </div>

      </header>

      {/* Área Central Envolvida pelo CockpitFrame */}
      <CockpitFrame wave={gameState.wave} enemiesCount={enemies.length}>
        <div className="relative flex items-center justify-center w-full max-w-7xl mx-auto gap-3 lg:gap-5 px-1 sm:px-3">
          
          {/* Painel Tático Lateral Esquerdo: Passivas Ativas */}
          <div className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 z-20">
            <PassivesPanel upgrades={gameState.upgrades} />
          </div>

          {/* Coluna Central de Combate */}
          <div className="relative flex flex-col items-center justify-center flex-1 max-w-3xl gap-1.5 sm:gap-2 pb-1">
            
            {/* 1. Barra de XP de Interceptação da Onda Centralizada */}
            <div className="w-full max-w-xl sm:max-w-2xl px-4 py-0.5 flex flex-col gap-1 z-20">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full animate-ping ${
                    currentWaveType === 'boss' ? 'bg-rose-500' : currentWaveType === 'swarm' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  <span className="font-bold text-zinc-200">
                    {currentWaveType === 'boss' ? '🚨 ONDA DE CHEFÃO' : currentWaveType === 'swarm' ? '⚠️ ONDA DE ENXAME' : `ONDA ${gameState.wave}`}
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                    [XP DA ONDA]
                  </span>
                </div>
                <span className="font-mono font-black text-emerald-400 text-xs">
                  {gameState.waveEnemiesDefeated} / {maxEnemiesPerWave} Ameaças ({wavePercent}%)
                </span>
              </div>

              {/* Trilho da Barra com Flash de Abate */}
              <div className="w-full h-3 sm:h-3.5 bg-black/90 rounded-full border border-zinc-700/80 p-0.5 shadow-inner relative overflow-hidden">
                {/* Divisórias táticas aos 25%, 50%, 75% */}
                <div className="absolute inset-y-0 left-1/4 w-[1px] bg-zinc-700/60 z-10 pointer-events-none" />
                <div className="absolute inset-y-0 left-2/4 w-[1px] bg-zinc-700/60 z-10 pointer-events-none" />
                <div className="absolute inset-y-0 left-3/4 w-[1px] bg-zinc-700/60 z-10 pointer-events-none" />

                {/* Preenchimento Dinâmico com Flash em Abates */}
                <div
                  className={`h-full rounded-full transition-all duration-300 relative ${
                    xpFlash
                      ? 'bg-white shadow-[0_0_24px_#38bdf8] scale-y-125'
                      : currentWaveType === 'boss'
                      ? 'bg-gradient-to-r from-rose-600 via-pink-500 to-amber-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-400 to-sky-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                  }`}
                  style={{ width: `${Math.max(2, wavePercent)}%` }}
                >
                  {/* Efeito de brilho fluído constante */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  {/* Faísca líder na ponta */}
                  <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#38bdf8]" />
                </div>
              </div>
            </div>

            {/* Alertas de Teclado: Caps Lock e Case Mismatch */}
            <CapsLockWarning className="w-full max-w-xl mx-auto my-1" />

            {caseWarning && (
              <div className="w-full max-w-xl mx-auto my-1 py-1 px-3 rounded-lg bg-amber-500/25 border border-amber-400 text-amber-200 font-mono text-xs font-bold animate-pulse text-center shadow-lg shadow-amber-950/40">
                {caseWarning}
              </div>
            )}

            {/* 2. Container Central do Radar com Combo Arcade, Mira, Buffer e Banners */}
            <div className="relative flex items-center justify-center">
              {/* Canvas do Radar */}
              <RadarCanvas
                enemies={enemies}
                lasers={lasers}
                particles={particles}
                floatingTexts={floatingTexts}
                shockwaves={shockwaves}
                activeTargetId={gameState.activeTargetId}
                shield={gameState.shield}
                maxShield={gameState.maxShield}
                health={gameState.health}
                maxHealth={gameState.maxHealth}
                freezeActive={Date.now() < gameState.freezeUntilMs}
                shockwaveActive={Date.now() < gameState.shockwaveActiveUntilMs}
                screenShakeIntensity={gameState.screenShakeIntensity}
                isPaused={isPaused}
              />

              {/* Banner de Alerta de Onda Especial (Chefão / Enxame) */}
              <AnimatePresence>
                {waveAlertBanner && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, y: -25 }}
                    animate={{ opacity: 1, scale: 1.05, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    className="absolute top-8 z-30 pointer-events-none px-6 py-2.5 rounded-2xl bg-black/95 border-2 font-mono text-center shadow-2xl backdrop-blur-md"
                    style={{ borderColor: waveAlertBanner.color, boxShadow: `0 0 35px ${waveAlertBanner.color}` }}
                  >
                    <p className="text-sm sm:text-base font-black tracking-wider animate-pulse" style={{ color: waveAlertBanner.color }}>
                      {waveAlertBanner.title}
                    </p>
                    <p className="text-[11px] text-zinc-300 font-bold mt-0.5">{waveAlertBanner.subtitle}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Banner de Marco de Combo (10, 20, 30, 50...) */}
              <AnimatePresence>
                {comboBanner && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, y: -20 }}
                    animate={{ opacity: 1, scale: 1.1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -15 }}
                    className="absolute top-12 z-30 pointer-events-none px-6 py-2.5 rounded-2xl bg-black/90 border-2 font-mono text-center shadow-2xl backdrop-blur-md"
                    style={{ borderColor: comboBanner.color, boxShadow: `0 0 35px ${comboBanner.color}` }}
                  >
                    <p className="text-base sm:text-lg font-black tracking-wider" style={{ color: comboBanner.color }}>
                      {comboBanner.title}
                    </p>
                    <p className="text-xs text-zinc-300 font-bold">{comboBanner.subtitle}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Display de Combo Arcade em Destaque Tático (Top-Right do Radar) */}
              {gameState.combo > 0 && (
                <motion.div
                  key={gameState.combo}
                  initial={{ scale: 1.45, y: -4 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className={`absolute top-4 right-4 sm:top-5 sm:right-5 z-20 pointer-events-none flex flex-col items-end backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 shadow-2xl transition-colors duration-200 ${
                    gameState.combo >= 30
                      ? 'bg-rose-950/85 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.85)]'
                      : gameState.combo >= 20
                      ? 'bg-amber-950/85 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.75)]'
                      : gameState.combo >= 10
                      ? 'bg-emerald-950/85 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                      : 'bg-sky-950/85 border-sky-400/80 shadow-[0_0_15px_rgba(56,189,248,0.45)]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400">
                      COMBO
                    </span>
                    <span
                      className={`text-2xl sm:text-3xl font-mono font-black leading-none ${
                        gameState.combo >= 30
                          ? 'text-rose-400 animate-pulse drop-shadow-[0_0_10px_#f43f5e]'
                          : gameState.combo >= 20
                          ? 'text-amber-400 animate-pulse drop-shadow-[0_0_10px_#fbbf24]'
                          : gameState.combo >= 10
                          ? 'text-emerald-400 drop-shadow-[0_0_8px_#34d399]'
                          : 'text-sky-300'
                      }`}
                    >
                      x{gameState.combo}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`text-[9px] font-mono font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md ${
                        gameState.combo >= 30
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : gameState.combo >= 20
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : gameState.combo >= 10
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      }`}
                    >
                      {gameState.combo >= 30
                        ? '⚡ OVERDRIVE'
                        : gameState.combo >= 20
                        ? '🔥 FÚRIA PURA'
                        : gameState.combo >= 10
                        ? '✨ HIPER RITMO'
                        : 'EMBALO'}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400 font-bold">
                      +{Math.min(100, Math.round(gameState.combo * 2))}% PTS
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Indicador de Mira Ativa */}
              {gameState.activeTargetId && (
                <div className="absolute top-3 px-3.5 py-1.5 rounded-full bg-sky-950/90 border border-sky-500/60 text-[11px] font-mono text-sky-300 flex items-center gap-2 shadow-lg backdrop-blur-sm z-30">
                  <Crosshair className="w-4 h-4 text-sky-400" />
                  <span>ALVO TRAVADO • [ESC / BACKSPACE: Desbloquear]</span>
                </div>
              )}

              {/* Buffer de Comando Ativo em Digitação */}
              {(gameState.isCommandMode || gameState.commandBuffer) && (
                <div className="absolute bottom-20 px-4 py-2 rounded-xl bg-black/95 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.7)] font-mono text-base font-black text-emerald-300 flex items-center gap-2.5 animate-pulse z-30">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  <span>COMANDO: {gameState.commandBuffer || '/'}</span>
                  <span className="text-xs text-zinc-400 font-normal ml-2">[ESC para cancelar]</span>
                </div>
              )}
            </div>

            {/* 3. Painel Centralizado de Gatilhos de Comandos Militares */}
            <TriggerDeck
              currentEnergy={gameState.energy}
              onExecuteCommand={executeCommand}
              nukeDiscount={!!gameState.upgrades.nuke_frequency}
              className="w-full max-w-xl sm:max-w-2xl z-20"
            />
          </div>

          {/* Painel Lateral Direito: Mascote Bytezinho Co-Piloto Tático no Canto Inferior */}
          <div className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 z-20 justify-end self-end pb-1">
            <div className="w-full p-3.5 rounded-2xl bg-[#0a0e17]/95 border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col gap-2.5 relative overflow-hidden backdrop-blur-md">
              {/* Header com Tag Tática */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-[10px] font-black tracking-wider text-emerald-300 uppercase">
                    CO-PILOTO // TÁTICO
                  </span>
                </div>
                <span className="text-[9px] font-mono text-zinc-500 font-bold">RADAR-AI</span>
              </div>

              {/* Balão de Comunicação de Rádio Tático */}
              <div className="relative bg-zinc-950/85 border border-emerald-500/30 rounded-xl p-2.5 shadow-inner min-h-[64px] flex items-center">
                <p className="text-[11px] text-zinc-200 font-mono font-medium leading-relaxed">
                  {bytezinhoMessage}
                </p>
              </div>

              {/* Avatar do Bytezinho Interativo */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleBytezinhoClick}
                  className="relative cursor-pointer focus:outline-none group hover:scale-105 active:scale-95 transition-transform"
                  title="Clique no Bytezinho para uma dica do co-piloto!"
                >
                  <BytezinhoAvatar
                    skin={equippedSkin || 'classic'}
                    mood={bytezinhoMood}
                    state={bytezinhoState}
                    size="md"
                    isOverloaded={gameState.health < 35}
                    isOverheating={gameState.shield <= 0}
                    isTyping={Boolean(gameState.activeTargetId || gameState.commandBuffer)}
                    comboCount={gameState.combo}
                  />
                </button>
                <div className="flex flex-col items-end text-right font-mono">
                  <span className="text-xs font-black text-emerald-400">Bytezinho</span>
                  <span className="text-[9px] text-zinc-400">Mascote Oficial</span>
                  <span className="text-[9px] text-emerald-500/80 font-bold mt-0.5">[Clique p/ Dica]</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mascote Bytezinho no Canto Inferior Direito (Telas Menores / Mobile) */}
          <div className="lg:hidden absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-30">
            <button
              type="button"
              onClick={handleBytezinhoClick}
              className="relative p-1.5 rounded-2xl bg-zinc-950/95 border border-emerald-500/50 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5"
              title={bytezinhoMessage}
            >
              <BytezinhoAvatar
                skin={equippedSkin || 'classic'}
                mood={bytezinhoMood}
                state={bytezinhoState}
                size="sm"
                isOverloaded={gameState.health < 35}
                isOverheating={gameState.shield <= 0}
                isTyping={Boolean(gameState.activeTargetId || gameState.commandBuffer)}
                comboCount={gameState.combo}
              />
            </button>
          </div>
        </div>
      </CockpitFrame>

      {/* Modal de Escolha de Upgrades Roguelike entre Ondas */}
      <RadarUpgradesModal
        isOpen={isUpgradeModalOpen}
        wave={gameState.wave}
        cards={upgradeCards}
        onSelectUpgrade={handleSelectUpgrade}
      />

      {/* Modal de Game Over / Relatório Pedagógico */}
      {(() => {
        const finalWpm = calculateCurrentWpm(gameState.correctChars, gameState.startTimeMs);
        const totalKeys = gameState.correctChars + gameState.wrongChars;
        const accuracy = totalKeys > 0 ? Math.round((gameState.correctChars / totalKeys) * 100) : 100;
        const calculatedBytes = calculateFinalBytes(
          gameState.score,
          accuracy,
          gameState.wave,
          !!gameState.upgrades.byte_multiplier
        );
        const finalBytesEarned = Math.max(gameState.bytesEarned, calculatedBytes);
        const worstKey = getWorstKey(gameState.errorHeatmap);

        return (
          <RadarGameOverModal
            isOpen={gameState.isGameOver}
            wave={gameState.wave}
            score={gameState.score}
            bytesEarned={finalBytesEarned}
            enemiesDefeated={gameState.enemiesDefeated}
            correctChars={gameState.correctChars}
            wrongChars={gameState.wrongChars}
            wpm={finalWpm}
            peakWpm={gameState.peakWpm}
            worstKey={worstKey}
            onRestart={handleRestart}
            onOpenLeaderboard={() => onOpenLeaderboardTab?.('radar')}
            onExitToHub={() =>
              onExitToHub(finalBytesEarned, {
                bestWave: gameState.wave,
                score: gameState.score,
                maxWpm: gameState.peakWpm || finalWpm,
                bytesEarned: finalBytesEarned,
                enemiesDefeated: gameState.enemiesDefeated
              })
            }
          />
        );
      })()}
    </div>
  );
};
