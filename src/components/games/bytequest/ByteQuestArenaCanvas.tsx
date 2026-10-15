// ─────────────────────────────────────────────────────────────
// Renderizador em Canvas 2D — ByteQuest Arena (60 FPS)
// Cenário Procedural: Castelo Sombrio com Runas e Néon Mágico
// Zero Emojis de Sistema — 100% Primitivas Vetoriais e Canvas
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import { ByteQuestSimulation } from './byteQuestEngine';
import { HeroLoadout, DungeonObstacle } from '../../../types/byteQuest';
import { RpgClassType } from '../../../types/rpgClass';

export interface ByteQuestArenaCanvasProps {
  simulation: ByteQuestSimulation;
  rpgClass?: RpgClassType;
  loadout?: HeroLoadout;
  isPaused?: boolean;
}

export const ByteQuestArenaCanvas: React.FC<ByteQuestArenaCanvasProps> = ({
  simulation,
  rpgClass = 'warrior',
  loadout = {},
  isPaused = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const bgScrollXRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;

    // Ajusta resolução do canvas para dispositivo de alta densidade de pixels
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const renderLoop = (currentTime: number) => {
      if (!isMounted) return;

      const dt = Math.max(0, Math.min(0.05, (currentTime - lastTimeRef.current) / 1000));
      lastTimeRef.current = currentTime;

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // Atualiza a simulação física se não estiver pausado
      if (!isPaused) {
        simulation.update(dt, width, height);
        bgScrollXRef.current += dt * 45; // Rolagem de fundo do castelo
      }

      // ─── DESENHO DA CENA COM SCREEN SHAKE ───
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      if (simulation.screenShake && (simulation.screenShake.offsetX || simulation.screenShake.offsetY)) {
        ctx.translate(simulation.screenShake.offsetX, simulation.screenShake.offsetY);
      }

      // 1. Fundo do Castelo Medieval Sombrio (Parallax)
      drawCastleBackground(ctx, width, height, bgScrollXRef.current);

      // 2. Chão com Runas Criptográficas
      drawDungeonFloor(ctx, width, height, bgScrollXRef.current);

      // 2.2. Shockwaves expansivas no chão
      drawShockwaves(ctx, simulation.shockwaves);

      // 2.5. Obstáculos de Arena (Pilares / Monólitos com Cobertura Tática)
      drawObstacles(ctx, simulation.obstacles);

      // 3. Orbes de XP no chão
      drawXpGems(ctx, simulation.gems);

      // 4. Inimigos e suas Palavras Flutuantes
      drawEnemies(ctx, simulation.enemies, simulation.lockedEnemyId);

      // 5. Orbes Orbitais Mágicos
      drawOrbitals(ctx, simulation);

      // 6. Projéteis do Herói (Flechas aerodinâmicas e Esferas arcanas)
      drawProjectiles(ctx, simulation.projectiles);

      // 6.1. Projéteis dos Inimigos
      drawEnemyProjectiles(ctx, simulation.enemyProjectiles);

      // 6.2. Corte Melee Direcional 360° do Guerreiro
      if (simulation.meleeSlashTimer > 0) {
        drawMeleeSlash(
          ctx,
          simulation.heroX,
          simulation.heroY,
          simulation.meleeSlashTimer,
          simulation.meleeSlashAngle
        );
      }

      // 7. Herói (Bytezinho RPG com animações de ataque em 360°)
      drawHero(ctx, simulation, rpgClass, loadout);

      // 7.5. Partículas de Combate (faíscas, lascas de vento, brasas arcanas)
      drawCombatParticles(ctx, simulation.particles);

      // 8. Textos de Dano Flutuante
      drawDamageTexts(ctx, simulation.damageTexts);

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    lastTimeRef.current = performance.now();
    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isMounted = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [simulation, isPaused, rpgClass, loadout]);

  return (
    <div className="relative w-full h-full min-h-[480px] max-h-[680px] bg-[#090b10] overflow-hidden rounded-xl border border-violet-900/40 shadow-2xl">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Sub-rotinas procedurais de renderização Canvas 2D
// ─────────────────────────────────────────────────────────────

function drawCastleBackground(ctx: CanvasRenderingContext2D, width: number, height: number, scrollX: number) {
  // Gradiente sombrio da abóbada
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#0a0914');
  grad.addColorStop(0.5, '#120f24');
  grad.addColorStop(1, '#08080f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Pilares do castelo ao fundo (parallax 0.3x)
  const pillarSpacing = 160;
  const pOffset = (scrollX * 0.3) % pillarSpacing;
  ctx.fillStyle = '#17142b';
  for (let x = -pOffset; x < width + pillarSpacing; x += pillarSpacing) {
    ctx.fillRect(x, 40, 28, height - 120);

    // Arcos góticos superiores entre os pilares
    ctx.beginPath();
    ctx.arc(x + pillarSpacing / 2, 70, pillarSpacing / 2.4, Math.PI, 0);
    ctx.strokeStyle = '#1e1a38';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Tochas neon nos pilares
    const torchY = 160;
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(x + 14, torchY, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Brilho da tocha
    ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
    ctx.beginPath();
    ctx.arc(x + 14, torchY, 26, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDungeonFloor(ctx: CanvasRenderingContext2D, width: number, height: number, scrollX: number) {
  const floorY = height - 90;

  // Laje de pedra
  ctx.fillStyle = '#0f111a';
  ctx.fillRect(0, floorY, width, 90);

  // Borda superior da laje com destaque luminoso
  ctx.strokeStyle = '#7C3AED';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, floorY);
  ctx.lineTo(width, floorY);
  ctx.stroke();

  // Linhas de blocos de pedra deslizando
  const blockSize = 80;
  const blockOffset = (scrollX * 0.8) % blockSize;
  ctx.strokeStyle = '#1e2235';
  ctx.lineWidth = 1;
  for (let x = -blockOffset; x < width + blockSize; x += blockSize) {
    ctx.beginPath();
    ctx.moveTo(x, floorY);
    ctx.lineTo(x, height);
    ctx.stroke();

    // Runas cibernéticas gravadas no chão a cada 2 blocos
    if (Math.floor((x + scrollX) / blockSize) % 2 === 0) {
      ctx.fillStyle = 'rgba(167, 139, 250, 0.35)';
      ctx.font = '10px monospace';
      ctx.fillText('<BYTE//RUNA>', x + 8, floorY + 35);
    }
  }
}

function drawXpGems(ctx: CanvasRenderingContext2D, gems: ByteQuestSimulation['gems']) {
  for (const gem of gems) {
    ctx.save();
    ctx.translate(gem.x, gem.y);

    // Losango de cristal
    ctx.fillStyle = gem.color;
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(5, 0);
    ctx.lineTo(0, 6);
    ctx.lineTo(-5, 0);
    ctx.closePath();
    ctx.fill();

    // Brilho interno
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }
}

function drawEnemies(
  ctx: CanvasRenderingContext2D,
  enemies: ByteQuestSimulation['enemies'],
  lockedEnemyId: string | null
) {
  for (const enemy of enemies) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    const isLocked = enemy.id === lockedEnemyId;
    const isFlashing = enemy.hitFlash && Date.now() - enemy.hitFlash < 90;

    // Sombra elíptica
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, enemy.height / 2 + 4, enemy.width / 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Aura e Crista para Inimigos Elites
    if (enemy.isElite) {
      ctx.save();
      ctx.strokeStyle = '#C084FC';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(192, 132, 252, 0.8)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(0, enemy.height / 2 + 4, enemy.width * 0.7, 9, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Coroa / Crista Dourada de Elite
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.moveTo(-7, -enemy.height / 2 - 16);
      ctx.lineTo(-3, -enemy.height / 2 - 21);
      ctx.lineTo(0, -enemy.height / 2 - 17);
      ctx.lineTo(3, -enemy.height / 2 - 21);
      ctx.lineTo(7, -enemy.height / 2 - 16);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Corpo do Inimigo baseado no tipo
    ctx.fillStyle = isFlashing ? '#FFFFFF' : enemy.color;
    ctx.strokeStyle = isLocked ? '#FACC15' : enemy.color;
    ctx.lineWidth = isLocked ? 2.5 : 1.5;

    if (enemy.type === 'slime') {
      // Slime arredondado
      ctx.beginPath();
      ctx.ellipse(0, 0, enemy.width / 2, enemy.height / 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Olhos cibernéticos
      ctx.fillStyle = '#064E3B';
      ctx.fillRect(-6, -4, 4, 4);
      ctx.fillRect(2, -4, 4, 4);
    } else if (enemy.type === 'skeleton') {
      // Esqueleto com elmo angular
      ctx.beginPath();
      ctx.roundRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height, 4);
      ctx.fill();
      ctx.stroke();

      // Fenda visual neon
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(-10, -3, 20, 3);
    } else if (enemy.type === 'gargoyle') {
      // Gárgula alada com pontas
      ctx.beginPath();
      ctx.moveTo(0, -enemy.height / 2);
      ctx.lineTo(enemy.width / 2, enemy.height / 3);
      ctx.lineTo(0, enemy.height / 2);
      ctx.lineTo(-enemy.width / 2, enemy.height / 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Olhos rubros
      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.arc(-5, -4, 2, 0, Math.PI * 2);
      ctx.arc(5, -4, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Boss / Miniboss — Escudo hexagonal imponente
      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const ang = (a * Math.PI) / 3;
        const r = enemy.width / 2;
        const px = Math.cos(ang) * r;
        const py = Math.sin(ang) * r;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Núcleo pulsante do Boss
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Barra de Vida do Inimigo
    const hpBarW = Math.max(34, enemy.width);
    const hpBarH = 4;
    const hpRatio = Math.max(0, enemy.hp / enemy.maxHp);
    const barY = -enemy.height / 2 - 12;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(-hpBarW / 2, barY, hpBarW, hpBarH);

    ctx.fillStyle = enemy.isBoss ? '#F59E0B' : '#EF4444';
    ctx.fillRect(-hpBarW / 2, barY, hpBarW * hpRatio, hpBarH);

    // Palavra de Digitação Flutuante sobre o Monstro
    if (enemy.word) {
      const textY = barY - 8;
      ctx.font = isLocked ? 'bold 14px monospace' : '12px monospace';
      ctx.textAlign = 'center';

      const typedPart = enemy.wordTyped || '';
      const remainingPart = enemy.word.slice(typedPart.length);

      // Caixa de fundo para legibilidade
      const totalWidth = ctx.measureText(enemy.word).width;
      ctx.fillStyle = isLocked ? 'rgba(0, 0, 0, 0.85)' : 'rgba(15, 23, 42, 0.75)';
      ctx.roundRect(-totalWidth / 2 - 4, textY - 12, totalWidth + 8, 16, 3);
      ctx.fill();
      if (isLocked) {
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Desenho das letras digitadas em verde/dourado e restantes em branco
      ctx.textAlign = 'left';
      const startX = -totalWidth / 2;

      ctx.fillStyle = '#4ADE80'; // Verde brilhante para letras acertadas
      ctx.fillText(typedPart, startX, textY);

      const typedWidth = ctx.measureText(typedPart).width;
      ctx.fillStyle = isLocked ? '#FDE047' : '#E2E8F0'; // Restante
      ctx.fillText(remainingPart, startX + typedWidth, textY);
    }

    ctx.restore();
  }
}

function drawOrbitals(ctx: CanvasRenderingContext2D, simulation: ByteQuestSimulation) {
  if (simulation.upgrades.orbitalCount <= 0) return;

  const orbitRadius = 65;
  for (let i = 0; i < simulation.upgrades.orbitalCount; i++) {
    // Calculado no simulation
    const angle = (simulation as any).orbitalAngle + (i * Math.PI * 2) / simulation.upgrades.orbitalCount;
    const ox = simulation.heroX + Math.cos(angle) * orbitRadius;
    const oy = simulation.heroY + Math.sin(angle) * orbitRadius;

    ctx.save();
    ctx.translate(ox, oy);

    // Orbe de energia mágica
    ctx.fillStyle = '#8B5CF6';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#DDD6FE';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }
}

function drawProjectiles(ctx: CanvasRenderingContext2D, projectiles: ByteQuestSimulation['projectiles']) {
  for (const p of projectiles) {
    ctx.save();
    ctx.translate(p.x, p.y);

    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
    ctx.fill();

    // Rastro traçante do projétil
    const len = 12;
    const norm = Math.hypot(p.vx, p.vy) || 1;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo((-p.vx / norm) * len, (-p.vy / norm) * len);
    ctx.stroke();

    ctx.restore();
  }
}

function drawShockwaves(ctx: CanvasRenderingContext2D, shockwaves: ByteQuestSimulation['shockwaves']) {
  if (!shockwaves || shockwaves.length === 0) return;
  for (const sw of shockwaves) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, sw.alpha);
    ctx.strokeStyle = sw.color;
    ctx.lineWidth = sw.lineWidth;
    ctx.shadowColor = sw.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(sw.x, sw.y, Math.max(1, sw.radius), 0, Math.PI * 2);
    ctx.stroke();

    // Anel interno sutil
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sw.x, sw.y, Math.max(1, sw.radius * 0.82), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawCombatParticles(ctx: CanvasRenderingContext2D, particles: ByteQuestSimulation['particles']) {
  if (!particles || particles.length === 0) return;
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawMeleeSlash(ctx: CanvasRenderingContext2D, heroX: number, heroY: number, timer: number, angle: number = 0) {
  ctx.save();
  ctx.translate(heroX, heroY);
  ctx.rotate(angle);

  const progress = 1 - timer / 0.22; // 0 to 1
  const startAngle = -Math.PI / 2.5 + progress * 0.4;
  const endAngle = Math.PI / 2.5;

  const grad = ctx.createLinearGradient(0, -60, 130, 60);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.3, '#FACC15');
  grad.addColorStop(0.7, '#EF4444');
  grad.addColorStop(1, 'transparent');

  // Onda de corte curva
  ctx.strokeStyle = grad;
  ctx.lineWidth = 14 * (1 - progress * 0.7);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(20, 0, 85, startAngle, endAngle);
  ctx.stroke();

  // Núcleo branco afiado do corte
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(20, 0, 85, startAngle + 0.1, endAngle - 0.1);
  ctx.stroke();

  // Faíscas de impacto
  for (let i = 0; i < 5; i++) {
    const sparkX = 75 + Math.random() * 30;
    const sparkY = (Math.random() - 0.5) * 80;
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(sparkX, sparkY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawEnemyProjectiles(ctx: CanvasRenderingContext2D, enemyProjectiles: ByteQuestSimulation['enemyProjectiles']) {
  for (const ep of enemyProjectiles) {
    ctx.save();
    ctx.translate(ep.x, ep.y);

    // Orbe de plasma rosa/rubro
    ctx.fillStyle = ep.color;
    ctx.beginPath();
    ctx.arc(0, 0, ep.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Rastro luminoso
    const norm = Math.hypot(ep.vx, ep.vy) || 1;
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.45)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo((-ep.vx / norm) * 16, (-ep.vy / norm) * 16);
    ctx.stroke();

    ctx.restore();
  }
}

function drawHero(
  ctx: CanvasRenderingContext2D,
  simulation: ByteQuestSimulation,
  rpgClass: RpgClassType,
  _loadout: HeroLoadout
) {
  const { heroX, heroY, heroRadius, stats, runCycle } = simulation;
  const bobY = Math.sin(runCycle * 2) * 3.5;
  const classColor = rpgClass === 'mage' ? '#8B5CF6' : rpgClass === 'archer' ? '#10B981' : '#EF4444';
  const eyeColor = rpgClass === 'mage' ? '#C4B5FD' : rpgClass === 'archer' ? '#6EE7B7' : '#FCA5A5';

  ctx.save();
  ctx.translate(heroX, heroY);

  // Espelhamento horizontal para olhar na direção da marcha ou do ataque
  if (simulation.heroFacing === 'left') {
    ctx.scale(-1, 1);
  }

  // Sombra dinâmica no chão que pulsa com a passada
  const shadowScale = 1 - Math.abs(Math.sin(runCycle)) * 0.15;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(0, 26, heroRadius * shadowScale, 7 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Partículas de poeira da corrida atrás das botas
  if (Math.abs(Math.sin(runCycle)) > 0.75) {
    ctx.fillStyle = 'rgba(167, 139, 250, 0.4)';
    ctx.beginPath();
    ctx.arc(-18 - Math.random() * 8, 24 + Math.random() * 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 1. Pernas em Movimento Contínuo de Corrida
  const legCycle = runCycle;
  const leftLegX = Math.sin(legCycle) * 13;
  const leftLegY = 22 + Math.max(0, -Math.cos(legCycle) * 8);
  const rightLegX = -Math.sin(legCycle) * 13;
  const rightLegY = 22 + Math.max(0, Math.cos(legCycle) * 8);

  // Perna Esquerda
  ctx.strokeStyle = '#16A34A';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-4, 10 + bobY);
  ctx.lineTo(-4 + leftLegX, leftLegY);
  ctx.stroke();
  ctx.fillStyle = classColor;
  ctx.fillRect(-6 + leftLegX, leftLegY - 2, 7, 5);

  // Perna Direita
  ctx.beginPath();
  ctx.moveTo(4, 10 + bobY);
  ctx.lineTo(4 + rightLegX, rightLegY);
  ctx.stroke();
  ctx.fillStyle = classColor;
  ctx.fillRect(2 + rightLegX, rightLegY - 2, 7, 5);

  // 2. Capa da Classe Ondulando ao Vento
  const capeWave = Math.sin(runCycle * 1.5) * 6;
  ctx.fillStyle = rpgClass === 'warrior' ? '#991B1B' : rpgClass === 'archer' ? '#065F46' : '#4C1D95';
  ctx.beginPath();
  ctx.moveTo(-10, -6 + bobY);
  ctx.quadraticCurveTo(-24, 6 + bobY + capeWave, -28, 18 + capeWave);
  ctx.lineTo(-12, 14 + bobY);
  ctx.closePath();
  ctx.fill();

  // 3. Escudo / Barreira Ativa
  if (stats.shieldHp > 0) {
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([7, 4]);
    ctx.beginPath();
    ctx.arc(0, bobY, heroRadius + 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 4. Aura de Classe
  ctx.strokeStyle = classColor;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, bobY, heroRadius, 0, Math.PI * 2);
  ctx.stroke();

  // 5. Tronquinho Robótico do Bytezinho
  ctx.fillStyle = '#16A34A';
  ctx.beginPath();
  ctx.roundRect(-10, 4 + bobY, 20, 16, 4);
  ctx.fill();
  // LED de Energia no peitoral
  ctx.fillStyle = classColor;
  ctx.beginPath();
  ctx.arc(0, 12 + bobY, 3, 0, Math.PI * 2);
  ctx.fill();

  // 6. CABEÇA DO BYTEZINHO (MONITOR CRT VERDE CLÁSSICO)
  ctx.fillStyle = '#22C55E';
  ctx.strokeStyle = '#15803D';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-16, -18 + bobY, 32, 24, 6);
  ctx.fill();
  ctx.stroke();

  // Tela Escura do Monitor CRT
  ctx.fillStyle = '#052E16';
  ctx.beginPath();
  ctx.roundRect(-13, -15 + bobY, 26, 18, 4);
  ctx.fill();

  // Reflexo de Vidro CRT
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.moveTo(-12, -14 + bobY);
  ctx.lineTo(2, -14 + bobY);
  ctx.lineTo(-8, 1 + bobY);
  ctx.lineTo(-12, 1 + bobY);
  ctx.closePath();
  ctx.fill();

  // Olhos Expressivos de LED do Bytezinho
  ctx.fillStyle = eyeColor;
  ctx.fillRect(-3, -9 + bobY, 4, 6);
  ctx.fillRect(5, -9 + bobY, 4, 6);
  // Brilho da pupila
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-2, -9 + bobY, 2, 2);
  ctx.fillRect(6, -9 + bobY, 2, 2);

  // Sorriso do Bytezinho
  ctx.strokeStyle = '#4ADE80';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(3, -2 + bobY, 3, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // 7. ADORNO / CHAPÉU DA CLASSE NO MONITOR
  if (rpgClass === 'warrior') {
    // Elmo com Crista Vermelha
    ctx.fillStyle = '#4B5563';
    ctx.fillRect(-15, -21 + bobY, 30, 4);
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(-3, -21 + bobY);
    ctx.lineTo(3, -21 + bobY);
    ctx.lineTo(2, -31 + bobY);
    ctx.lineTo(-2, -31 + bobY);
    ctx.closePath();
    ctx.fill();
  } else if (rpgClass === 'archer') {
    // Capuz de Caçador com Pena
    ctx.fillStyle = '#065F46';
    ctx.beginPath();
    ctx.arc(0, -18 + bobY, 17, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(8, -21 + bobY);
    ctx.lineTo(15, -30 + bobY);
    ctx.lineTo(11, -19 + bobY);
    ctx.fill();
  } else {
    // Chapéu Cônico de Mago com Fivela
    ctx.fillStyle = '#5B21B6';
    ctx.beginPath();
    ctx.moveTo(-17, -18 + bobY);
    ctx.lineTo(17, -18 + bobY);
    ctx.lineTo(10, -35 + bobY);
    ctx.lineTo(-8, -32 + bobY);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(-4, -21 + bobY, 8, 3.5);
  }

  // 8. ARMA DA CLASSE COM BALANÇO DE MOVIMENTO
  ctx.save();
  ctx.translate(14, 2 + bobY);
  const weaponSway = Math.sin(runCycle) * 0.18;
  ctx.rotate(weaponSway);

  if (rpgClass === 'warrior') {
    // Espada Larga Neon do Guerreiro
    ctx.fillStyle = classColor;
    ctx.fillRect(0, -3, 24, 5);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(2, -2, 20, 2);
    ctx.fillStyle = '#3F3F46';
    ctx.fillRect(-2, -6, 4, 11);
  } else if (rpgClass === 'archer') {
    // Arco Curvo de Precisão do Arqueiro
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(4, 0, 13, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(4, -13);
    ctx.lineTo(4, 13);
    ctx.stroke();
  } else {
    // Cajado Arcano com Cristal do Mago
    ctx.fillStyle = '#71717A';
    ctx.fillRect(0, -16, 3, 30);
    ctx.fillStyle = '#A78BFA';
    ctx.beginPath();
    ctx.arc(1.5, -18, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(1.5, -18, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.restore();
}

function drawDamageTexts(ctx: CanvasRenderingContext2D, damageTexts: ByteQuestSimulation['damageTexts']) {
  for (const dt of damageTexts) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, dt.alpha);
    ctx.font = dt.isCrit ? 'bold 16px monospace' : '13px monospace';
    ctx.fillStyle = dt.color;
    ctx.textAlign = 'center';
    ctx.fillText(dt.text, dt.x, dt.y);
    ctx.restore();
  }
}

function drawObstacles(ctx: CanvasRenderingContext2D, obstacles: DungeonObstacle[]) {
  if (!obstacles || obstacles.length === 0) return;

  for (const obs of obstacles) {
    ctx.save();

    // Sombra projetada no chão
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(obs.x, obs.y + obs.radius * 0.55, obs.radius * 1.15, obs.radius * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Base de Pedra do Pilar
    ctx.fillStyle = '#1e1b2e';
    ctx.strokeStyle = '#3b3254';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Anel de pedra intermediário com relevo
    ctx.fillStyle = '#2d2842';
    ctx.beginPath();
    ctx.arc(obs.x, obs.y - 3, obs.radius * 0.75, 0, Math.PI * 2);
    ctx.fill();

    // Topo facetado da coluna
    const grad = ctx.createLinearGradient(obs.x - obs.radius, obs.y - obs.radius, obs.x + obs.radius, obs.y + obs.radius);
    grad.addColorStop(0, '#3e375c');
    grad.addColorStop(1, '#1a162b');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(obs.x, obs.y - 6, obs.radius * 0.55, 0, Math.PI * 2);
    ctx.fill();

    // Runa Neon Mágica no centro do pilar
    const runeColor = obs.runeColor || '#38BDF8';
    ctx.shadowColor = runeColor;
    ctx.shadowBlur = 10;
    ctx.fillStyle = runeColor;
    ctx.beginPath();
    ctx.moveTo(obs.x, obs.y - 14);
    ctx.lineTo(obs.x + 6, obs.y - 6);
    ctx.lineTo(obs.x, obs.y + 2);
    ctx.lineTo(obs.x - 6, obs.y - 6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
