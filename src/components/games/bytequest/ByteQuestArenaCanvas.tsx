// ─────────────────────────────────────────────────────────────
// Renderizador em Canvas 2D — ByteQuest Arena (60 FPS)
// Cenário Procedural: Castelo Sombrio com Runas e Néon Mágico
// Zero Emojis de Sistema — 100% Primitivas Vetoriais e Canvas
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import { ByteQuestSimulation } from './byteQuestEngine';
import { HeroLoadout, DungeonObstacle, BIOMES_DATA } from '../../../types/byteQuest';
import { RpgClassType } from '../../../types/rpgClass';
import { byteQuestSpriteEngine } from './byteQuestSpriteEngine';
import { ByteQuestPixelArtGenerator } from './byteQuestPixelArtGenerator';

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

    // Inicializa o gerador de spritesheets e tilesets em pixel art (canvas offscreen)
    ByteQuestPixelArtGenerator.initializeAll();

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
        bgScrollXRef.current += dt * 45;
      }

      // ─── DESENHO DA CENA COM CÂMERA E SCREEN SHAKE ───
      ctx.clearRect(0, 0, width, height);

      ctx.save();

      // Aplica Screen Shake
      if (simulation.screenShake && (simulation.screenShake.offsetX || simulation.screenShake.offsetY)) {
        ctx.translate(simulation.screenShake.offsetX, simulation.screenShake.offsetY);
      }

      // ─── TRANSFORMAÇÃO DE CÂMERA DO MUNDO EXPANDIDO ───
      ctx.save();
      ctx.translate(-simulation.cameraX, -simulation.cameraY);

      // 1. Chão e Iluminação do Bioma Ativo (2400x1800)
      drawBiomeWorld(ctx, simulation);

      // 1.5. Iluminação Radial Top-Down (Luz da CRT do Herói e Projéteis)
      drawDynamicLighting(ctx, simulation);

      // 1.8. Barreira Rúnica de Contenção da Câmara do Chefe
      if (simulation.bossArenaBarrier?.active) {
        drawBossArenaBarrier(ctx, simulation.bossArenaBarrier);
      }

      // 2. Shockwaves expansivas no chão do mundo
      drawShockwaves(ctx, simulation.shockwaves);

      // 2.2. Zonas de Perigo Telegrafadas de Bosses e Elites (Red Zones)
      if (simulation.hazardZones && simulation.hazardZones.length > 0) {
        drawHazardZones(ctx, simulation.hazardZones);
      }

      // 2.3. Trilhas de Magma (Botas Passada de Magma) e Aura Solar Permanente
      if (simulation.fireTrails && simulation.fireTrails.length > 0) {
        drawFireTrails(ctx, simulation.fireTrails);
      }
      if (simulation.upgrades.weaponFireAuraLevel > 0) {
        drawFireAura(ctx, simulation);
      }

      // 2.5. Obstáculos procedurais do Bioma (Pilares e Monólitos)
      drawObstacles(ctx, simulation.obstacles);

      // 2.6. Santuários de Código Interativos (Code Shrines)
      if (simulation.shrines && simulation.shrines.length > 0) {
        drawCodeShrines(
          ctx,
          simulation.shrines,
          simulation.lockedShrineId,
          simulation.heroX,
          simulation.heroY
        );
      }

      // 2.8. Portal Rúnico de Transição de Bioma (se ativo)
      if (simulation.biomePortal) {
        drawBiomePortal(ctx, simulation.biomePortal);
      }

      // 2.9. Portais Holográficos de Salto entre Câmaras (Rotas Escolhidas)
      if (simulation.chamberPortals && simulation.chamberPortals.length > 0) {
        drawChamberPortals(ctx, simulation.chamberPortals, simulation.heroX, simulation.heroY);
      }

      // 2.95. Terminal Híbrido da Câmara (Mercante / Drones / Reparo)
      if (simulation.chamberTerminal && simulation.chamberTerminal.active) {
        drawChamberTerminal(ctx, simulation.chamberTerminal, simulation.heroX, simulation.heroY);
      }

      // 3. Orbes de XP e Drops Táticos (Pickups & Baús) no chão
      drawXpGems(ctx, simulation.gems);
      if (simulation.pickups && simulation.pickups.length > 0) {
        drawCombatPickups(ctx, simulation.pickups);
      }

      // 3.5. Torretas Sentinelas Auto-Compiler implantadas na arena
      if (simulation.turrets && simulation.turrets.length > 0) {
        drawTurrets(ctx, simulation.turrets);
      }

      // 4. Inimigos e suas Palavras Flutuantes
      drawEnemies(ctx, simulation.enemies, simulation.lockedEnemyId, simulation.heroX);

      // 5. Orbes Orbitais Mágicos e Bumerangues Chakram
      drawOrbitals(ctx, simulation);
      if (simulation.boomerangs && simulation.boomerangs.length > 0) {
        drawBoomerangs(ctx, simulation.boomerangs);
      }

      // 6. Projéteis do Herói
      drawProjectiles(ctx, simulation.projectiles);

      // 6.1. Projéteis dos Inimigos
      drawEnemyProjectiles(ctx, simulation.enemyProjectiles);

      // 6.15. Lasers Teleguiados do Chefe Supremo
      if (simulation.bossLaserTelegraphs && simulation.bossLaserTelegraphs.length > 0) {
        drawBossLasers(ctx, simulation.bossLaserTelegraphs);
      }

      // 6.2. Ondas de Choque e Cortes de Espada (Slash Waves)
      if (simulation.slashWaves && simulation.slashWaves.length > 0) {
        drawSlashWaves(ctx, simulation.slashWaves);
      }

      // 6.3. Corte Melee Direcional 360° Imediato do Guerreiro
      if (simulation.meleeSlashTimer > 0) {
        drawMeleeSlash(
          ctx,
          simulation.heroX,
          simulation.heroY,
          simulation.meleeSlashTimer,
          simulation.meleeSlashAngle
        );
      }

      // 6.4. Armadilhas Rúnicas no Chão (Arqueiro)
      if (simulation.groundTraps && simulation.groundTraps.length > 0) {
        drawGroundTraps(ctx, simulation.groundTraps);
      }

      // 6.5. Descargas de Raio em Cadeia (Mago)
      if (simulation.chainLightningBolts && simulation.chainLightningBolts.length > 0) {
        drawChainLightningBolts(ctx, simulation.chainLightningBolts);
      }

      // 6.6. Chuva de Flechas Caindo do Céu (Arqueiro)
      if (simulation.arrowRainEffects && simulation.arrowRainEffects.length > 0) {
        drawArrowRainEffects(ctx, simulation.arrowRainEffects);
      }

      // 6.7. Ciclone de Espadas Giratórias 360° (Guerreiro)
      if (simulation.cycloneEffects && simulation.cycloneEffects.length > 0) {
        drawCycloneEffects(ctx, simulation, simulation.cycloneEffects);
      }

      // 7. Herói (Bytezinho RPG com animações de ataque em 360°)
      // Efeito de Múltiplos Rastros Fantasmas Fluídos (Dash Deslizante / Investida)
      if (simulation.mobilityGhostPositions && simulation.mobilityGhostPositions.length > 0) {
        const trailColor = rpgClass === 'mage' ? '#C084FC' : rpgClass === 'archer' ? '#34D399' : '#F59E0B';
        for (const ghost of simulation.mobilityGhostPositions) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(0.45, ghost.alpha));
          ctx.shadowColor = trailColor;
          ctx.shadowBlur = 12;
          // Desenha cópia fantasma na posição percorrida
          const ghostSim = {
            ...simulation,
            heroX: ghost.x,
            heroY: ghost.y,
            heroFacing: ghost.facing,
            heroAttackTimer: 0
          } as ByteQuestSimulation;
          drawHero(ctx, ghostSim, rpgClass, loadout);
          ctx.restore();
        }
      } else if (simulation.mobilityTrailTimer > 0 && rpgClass === 'mage') {
        // Efeito residual simples para o Teleporte do Mago
        const trailAlpha = Math.min(0.5, simulation.mobilityTrailTimer);
        ctx.save();
        ctx.globalAlpha = trailAlpha;
        ctx.shadowColor = '#C084FC';
        ctx.shadowBlur = 14;
        const trailOffset = simulation.heroFacing === 'right' ? -20 : 20;
        ctx.translate(trailOffset, 0);
        drawHero(ctx, simulation, rpgClass, loadout);
        ctx.restore();
      }

      // Aura de Overclock (Flow State) sob o herói
      if (simulation.overclockTimer > 0) {
        ctx.save();
        ctx.translate(simulation.heroX, simulation.heroY);
        const ocSpin = Date.now() * 0.008;
        ctx.rotate(ocSpin);
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#FACC15';
        ctx.shadowBlur = 14;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, 38 + Math.sin(Date.now() * 0.015) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      drawHero(ctx, simulation, rpgClass, loadout);

      // 7.2. Drones Aliados Especialistas orbitando o Herói
      if (simulation.allyDrones && simulation.allyDrones.length > 0) {
        drawAllyDrones(ctx, simulation.allyDrones, simulation.heroX, simulation.heroY);
      }

      // 7.5. Partículas de Combate
      drawCombatParticles(ctx, simulation.particles);

      // 8. Textos de Dano Flutuante
      drawDamageTexts(ctx, simulation.damageTexts);

      ctx.restore(); // Fecha o espaço de coordenadas da câmera do mundo

      // ─── 8.5. VINHETA TÁTICA DE BULLET TIME (FOCUS MODE) ───
      if (simulation.focusTimeScale < 0.85) {
        const focusAlpha = Math.min(0.38, (1 - simulation.focusTimeScale) * 0.65);
        const vigGrad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          Math.min(width, height) * 0.28,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.72
        );
        vigGrad.addColorStop(0, 'rgba(14, 165, 233, 0)');
        vigGrad.addColorStop(1, `rgba(14, 165, 233, ${focusAlpha})`);
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // ─── 8.8. EFEITO DE SALTO HIPERESPACIAL ENTRE CÂMARAS ───
      if (simulation.hyperspaceTransitionTimer > 0) {
        drawHyperspaceWarp(ctx, width, height, simulation.hyperspaceTransitionTimer);
      }

      // ─── 9. BÚSSOLA DIRECIONAL NA BORDA DO VIEWPORT (HUD DA TELA) ───
      drawScreenEdgeCompass(ctx, width, height, simulation);

      // ─── 9.5. RADAR TÁTICO MINIMAPA (VISÃO DO MUNDO EXPANDIDO 5000x3600) ───
      drawTacticalRadarMinimap(ctx, width, height, simulation);

      // ─── 9.8. BARRA DE HP DO CHEFE SUPREMO & BANNER DE ALERTA (HUD SUPERIOR) ───
      drawEpicBossHealthBar(ctx, width, height, simulation);
      drawBossWarningBanner(ctx, width, height, simulation);

      ctx.restore(); // Fecha o Screen Shake

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
    <div className="relative w-full h-full bg-[#090b10] overflow-hidden rounded-xl border border-violet-900/40 shadow-2xl">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Sub-rotinas procedurais de renderização Canvas 2D
// ─────────────────────────────────────────────────────────────

function drawBiomeWorld(ctx: CanvasRenderingContext2D, sim: ByteQuestSimulation) {
  const biome = BIOMES_DATA[sim.currentBiome];
  const w = sim.worldWidth;
  const h = sim.worldHeight;

  // 1. Tenta renderizar o piso usando o Tileset Pixel Art do Bioma
  const tilesDrawn = byteQuestSpriteEngine.drawBiomeTiles(
    ctx,
    sim.currentBiome,
    sim.cameraX,
    sim.cameraY,
    sim.viewportWidth,
    sim.viewportHeight,
    w,
    h
  );

  // Fallback para fundo sólido e grade se tileset ainda não estiver pronto
  if (!tilesDrawn) {
    ctx.fillStyle = biome.floorColor;
    ctx.fillRect(0, 0, w, h);

    // Grade rúnica sutil de lajotas (tamanho 120x120)
    const tileSize = 120;
    ctx.strokeStyle = biome.gridLineColor;
    ctx.lineWidth = 1.2;

    const startX = Math.floor(Math.max(0, sim.cameraX - tileSize) / tileSize) * tileSize;
    const endX = Math.min(w, sim.cameraX + sim.viewportWidth + tileSize);
    const startY = Math.floor(Math.max(0, sim.cameraY - tileSize) / tileSize) * tileSize;
    const endY = Math.min(h, sim.cameraY + sim.viewportHeight + tileSize);

    ctx.beginPath();
    for (let x = startX; x <= endX; x += tileSize) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += tileSize) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();
  }

  // 3. Efeitos atmosféricos sutis de bioma no piso
  const cx = w / 2;
  const cy = h / 2;
  if (sim.currentBiome === 'forge') {
    // Fissuras de lava subterrâneas sutis com baixa opacidade
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 700, cy - 600);
    ctx.lineTo(cx - 350, cy - 300);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + 400, cy + 300);
    ctx.lineTo(cx + 800, cy + 700);
    ctx.stroke();
  } else if (sim.currentBiome === 'quantum_core') {
    // Anéis de circuito cósmico discretos no piso
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 450, 0, Math.PI * 2);
    ctx.arc(cx, cy, 850, 0, Math.PI * 2);
    ctx.arc(cx, cy, 1400, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 4. Fronteira Externa Rúnica Inviolável do Mundo
  ctx.strokeStyle = biome.runeColor;
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, w - 12, h - 12);

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, w - 24, h - 24);
}

function drawBiomePortal(ctx: CanvasRenderingContext2D, portal: import('../../../types/byteQuest').BiomePortal) {
  const targetBiome = BIOMES_DATA[portal.targetBiome];
  ctx.save();
  ctx.translate(portal.x, portal.y);

  // Vórtice giratório externo
  const rot = portal.pulseTimer;
  ctx.rotate(rot);

  // Anel externo pulsante
  ctx.fillStyle = targetBiome.ambientLight;
  ctx.beginPath();
  ctx.arc(0, 0, portal.radius * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Pétalas cósmicas do vórtice
  for (let i = 0; i < 6; i++) {
    const ang = (i * Math.PI) / 3;
    ctx.strokeStyle = targetBiome.runeColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(Math.cos(ang) * 22, Math.sin(ang) * 22, 26, 12, ang, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Núcleo brilhante do portal
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, 18 + Math.sin(portal.pulseTimer * 3) * 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Texto descritivo acima do portal no mundo
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`PORTAL: ${targetBiome.name.toUpperCase()}`, portal.x, portal.y - portal.radius - 16);
}

function drawScreenEdgeCompass(
  ctx: CanvasRenderingContext2D,
  viewWidth: number,
  viewHeight: number,
  sim: ByteQuestSimulation
) {
  const targets: { x: number; y: number; label: string; color: string; isBoss?: boolean }[] = [];

  // Se houver portal ativo, aponta para ele
  if (sim.biomePortal) {
    targets.push({
      x: sim.biomePortal.x,
      y: sim.biomePortal.y,
      label: 'PORTAL',
      color: BIOMES_DATA[sim.biomePortal.targetBiome].runeColor
    });
  }

  // Chefões, Mini-Chefes e Goblin do Tesouro fora da tela
  sim.enemies
    .filter((e) => e.isBoss || e.type === 'treasure_goblin')
    .forEach((boss) => {
      targets.push({
        x: boss.x,
        y: boss.y,
        label: boss.type === 'treasure_goblin' ? 'GOBLIN DE OURO' : boss.type === 'boss' ? 'CHEFÃO' : 'MINI-CHEFE',
        color: boss.color,
        isBoss: true
      });
    });

  // Santuários de Código ativos fora da tela
  if (sim.shrines) {
    sim.shrines
      .filter((s) => s.active)
      .forEach((shrine) => {
        targets.push({
          x: shrine.x,
          y: shrine.y,
          label: 'SANTUÁRIO',
          color: shrine.color
        });
      });
  }

  // Baús de Relíquia Ancestrais fora da tela
  if (sim.pickups) {
    sim.pickups
      .filter((p) => p.pickupType === 'loot_chest')
      .forEach((chest) => {
        targets.push({
          x: chest.x,
          y: chest.y,
          label: 'BAÚ',
          color: '#FACC15'
        });
      });
  }

  const margin = 32;

  targets.forEach((target) => {
    // Posição do alvo em coordenadas de tela
    const screenX = target.x - sim.cameraX;
    const screenY = target.y - sim.cameraY;

    // Se já estiver visível dentro da tela com folga, não precisa da bússola de borda
    if (screenX >= margin && screenX <= viewWidth - margin && screenY >= margin && screenY <= viewHeight - margin) {
      return;
    }

    // Calcula o ângulo a partir do centro da tela
    const centerX = viewWidth / 2;
    const centerY = viewHeight / 2;
    const angle = Math.atan2(target.y - sim.heroY, target.x - sim.heroX);

    // Interseção com o retângulo da tela
    const clampedX = Math.max(margin, Math.min(viewWidth - margin, centerX + Math.cos(angle) * (viewWidth / 2 - margin)));
    const clampedY = Math.max(margin, Math.min(viewHeight - margin, centerY + Math.sin(angle) * (viewHeight / 2 - margin)));

    const distMeters = Math.round(Math.hypot(target.x - sim.heroX, target.y - sim.heroY) / 10);

    ctx.save();
    ctx.translate(clampedX, clampedY);

    // Seta apontando na direção do alvo
    ctx.rotate(angle);
    ctx.fillStyle = target.color;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-8, -8);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-8, 8);
    ctx.closePath();
    ctx.fill();

    // Contorno brilhante
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // Rótulo de texto com distância em metros
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${target.label} ${distMeters}m`, clampedX, clampedY + 16);
  });
}

function drawTacticalRadarMinimap(
  ctx: CanvasRenderingContext2D,
  viewWidth: number,
  viewHeight: number,
  sim: ByteQuestSimulation
) {
  // Posicionamento no canto superior direito abaixo dos botões do HUD
  const rw = 148;
  const rh = 106;
  const rx = viewWidth - rw - 14;
  const ry = 62;

  ctx.save();

  // Fundo translúcido com estilo rúnico sci-fi
  ctx.fillStyle = 'rgba(10, 14, 23, 0.82)';
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(rx, ry, rw, rh, 8);
  ctx.fill();
  ctx.stroke();

  // Cabeçalho do Radar
  ctx.fillStyle = '#C084FC';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('📡 RADAR (5000x3600)', rx + 8, ry + 11);

  // Área interna do minimapa
  const mx = rx + 6;
  const my = ry + 15;
  const mw = rw - 12;
  const mh = rh - 21;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
  ctx.lineWidth = 1;
  ctx.fillRect(mx, my, mw, mh);
  ctx.strokeRect(mx, my, mw, mh);

  // Escala de coordenadas mundiais para o radar
  const scaleX = mw / Math.max(1, sim.worldWidth);
  const scaleY = mh / Math.max(1, sim.worldHeight);

  // Linhas sutis de grade / quadrantes do mundo
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(mx + mw / 2, my);
  ctx.lineTo(mx + mw / 2, my + mh);
  ctx.moveTo(mx, my + mh / 2);
  ctx.lineTo(mx + mw, my + mh / 2);
  ctx.stroke();

  // 1. Obstáculos e Marcos Principais
  ctx.fillStyle = 'rgba(100, 116, 139, 0.4)';
  for (const obs of sim.obstacles) {
    const ox = mx + obs.x * scaleX;
    const oy = my + obs.y * scaleY;
    ctx.fillRect(ox - 1, oy - 1, 2.5, 2.5);
  }

  // 2. Santuários Rúnicos
  if (sim.shrines) {
    for (const shrine of sim.shrines) {
      const sx = mx + shrine.x * scaleX;
      const sy = my + shrine.y * scaleY;
      ctx.fillStyle = shrine.active ? shrine.color : '#64748B';
      ctx.beginPath();
      ctx.arc(sx, sy, shrine.active ? 2.5 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 3. Baús de Tesouro Ancestrais
  if (sim.pickups) {
    for (const pk of sim.pickups) {
      if (pk.pickupType === 'loot_chest') {
        const cx = mx + pk.x * scaleX;
        const cy = my + pk.y * scaleY;
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(cx - 1.5, cy - 1.5, 3, 3);
      }
    }
  }

  // 4. Inimigos Especiais (Chefões e Goblins)
  for (const en of sim.enemies) {
    if (en.isBoss || en.type === 'treasure_goblin') {
      const ex = mx + en.x * scaleX;
      const ey = my + en.y * scaleY;
      ctx.fillStyle = en.type === 'treasure_goblin' ? '#FACC15' : '#EF4444';
      ctx.beginPath();
      ctx.arc(ex, ey, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 5. Portal do Bioma (se aberto)
  if (sim.biomePortal && sim.biomePortal.active) {
    const px = mx + sim.biomePortal.x * scaleX;
    const py = my + sim.biomePortal.y * scaleY;
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Viewport da Câmera (Retângulo de Visão do Jogador)
  const camX = Math.max(mx, Math.min(mx + mw, mx + sim.cameraX * scaleX));
  const camY = Math.max(my, Math.min(my + mh, my + sim.cameraY * scaleY));
  const camW = Math.min(mw - (camX - mx), sim.viewportWidth * scaleX);
  const camH = Math.min(mh - (camY - my), sim.viewportHeight * scaleY);

  ctx.fillStyle = 'rgba(56, 189, 248, 0.1)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
  ctx.lineWidth = 1;
  ctx.fillRect(camX, camY, camW, camH);
  ctx.strokeRect(camX, camY, camW, camH);

  // 7. Posição do Herói (Ponto Verde Neon com Direcional)
  const hx = mx + sim.heroX * scaleX;
  const hy = my + sim.heroY * scaleY;

  ctx.fillStyle = '#4ADE80';
  ctx.shadowColor = '#4ADE80';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(hx, hy, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Indicador de orientação
  const dirOffset = sim.heroFacing === 'right' ? 3.5 : -3.5;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(hx, hy);
  ctx.lineTo(hx + dirOffset, hy);
  ctx.stroke();

  ctx.restore();
}

function drawHazardZones(
  ctx: CanvasRenderingContext2D,
  hazardZones: ByteQuestSimulation['hazardZones']
) {
  for (const hz of hazardZones) {
    ctx.save();
    ctx.translate(hz.x, hz.y);

    // Círculo externo de perigo (Red Zone)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.14)';
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, hz.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Círculo interno que cresce até a borda indicando o momento exato do impacto
    const innerR = Math.max(4, hz.radius * Math.min(1, hz.progress));
    ctx.fillStyle = 'rgba(239, 68, 68, 0.32)';
    ctx.beginPath();
    ctx.arc(0, 0, innerR, 0, Math.PI * 2);
    ctx.fill();

    // Rótulo de alerta piscante quando falta pouco para detonar
    if (hz.progress > 0.55) {
      ctx.fillStyle = '#FCA5A5';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('! IMPACTO [ESPAÇO] !', 0, 4);
    }

    ctx.restore();
  }
}

function drawCodeShrines(
  ctx: CanvasRenderingContext2D,
  shrines: ByteQuestSimulation['shrines'],
  lockedShrineId: string | null,
  heroX: number,
  heroY: number
) {
  const timeSec = Date.now() / 1000;

  for (const shrine of shrines) {
    ctx.save();
    ctx.translate(shrine.x, shrine.y);

    const isLocked = shrine.id === lockedShrineId;
    const dist = Math.hypot(shrine.x - heroX, shrine.y - heroY);
    const isNear = dist <= 260;

    // Base octogonal rúnica no chão
    ctx.fillStyle = shrine.active ? '#0F172A' : '#1E293B';
    ctx.strokeStyle = shrine.active ? shrine.color : '#475569';
    ctx.lineWidth = isLocked ? 3.5 : 2.5;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const ang = (i * Math.PI) / 4;
      const rx = Math.cos(ang) * shrine.radius;
      const ry = Math.sin(ang) * shrine.radius;
      if (i === 0) ctx.moveTo(rx, ry);
      else ctx.lineTo(rx, ry);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (shrine.active) {
      // Halo pulsante quando o herói está no alcance de digitação
      if (isNear) {
        ctx.save();
        ctx.strokeStyle = shrine.color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, shrine.radius + 16 + Math.sin(timeSec * 5) * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // Cristal central flutuante do Santuário
      const floatOffset = Math.sin(timeSec * 4) * 4;
      ctx.save();
      ctx.translate(0, floatOffset);
      ctx.shadowColor = shrine.color;
      ctx.shadowBlur = 14;
      ctx.fillStyle = shrine.color;
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(11, 0);
      ctx.lineTo(0, 16);
      ctx.lineTo(-11, 0);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Nome do Santuário
      ctx.fillStyle = shrine.color;
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText((shrine.name || 'SANTUÁRIO').toUpperCase(), 0, shrine.radius + 16);

      // Se o herói estiver próximo (< 260px), exibe a Palavra de Ativação!
      if (isNear && shrine.word) {
        const hasErrorShake = (shrine.errorShakeTimer || 0) > 0;
        const shakeOffsetX = hasErrorShake ? (Math.random() - 0.5) * 9 : 0;
        const textY = -shrine.radius - 14;
        ctx.font = isLocked ? 'bold 14px monospace' : 'bold 12px monospace';
        const typedPart = shrine.wordTyped || '';
        const remainingPart = shrine.word.slice(typedPart.length);
        const totalWidth = ctx.measureText(shrine.word).width;

        ctx.fillStyle = hasErrorShake ? 'rgba(127, 29, 29, 0.92)' : 'rgba(2, 6, 23, 0.92)';
        ctx.strokeStyle = hasErrorShake ? '#EF4444' : isLocked ? '#FACC15' : shrine.color;
        ctx.lineWidth = isLocked || hasErrorShake ? 2 : 1.5;
        ctx.beginPath();
        ctx.roundRect(shakeOffsetX - totalWidth / 2 - 8, textY - 13, totalWidth + 16, 19, 4);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'left';
        const startX = shakeOffsetX - totalWidth / 2;
        ctx.fillStyle = '#4ADE80';
        ctx.fillText(typedPart, startX, textY);

        const typedW = ctx.measureText(typedPart).width;
        ctx.fillStyle = hasErrorShake ? '#FCA5A5' : isLocked ? '#FDE047' : '#FFFFFF';
        ctx.fillText(remainingPart, startX + typedW, textY);
      }
    } else {
      // Santuário já decodificado
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DECODIFICADO', 0, 4);
    }

    ctx.restore();
  }
}

function drawCombatPickups(
  ctx: CanvasRenderingContext2D,
  pickups: ByteQuestSimulation['pickups']
) {
  const timeSec = Date.now() / 1000;
  for (const pk of pickups) {
    ctx.save();
    ctx.translate(pk.x, pk.y + Math.sin(timeSec * 6) * 3);

    if (pk.pickupType === 'loot_chest') {
      // 🎁 BAÚ DE LOOT RÚNICO DOURADO
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#451A03';
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-14, -10, 28, 20, 4);
      ctx.fill();
      ctx.stroke();

      // Faixa e fechadura dourada
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(-14, -2, 28, 3);
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FEF08A';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('BAÚ', 0, -14);
      ctx.restore();
      continue;
    }

    const color =
      pk.pickupType === 'health_battery'
        ? '#10B981'
        : pk.pickupType === 'global_magnet'
        ? '#38BDF8'
        : '#C084FC';

    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, pk.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    const symbol = pk.pickupType === 'health_battery' ? '+HP' : pk.pickupType === 'global_magnet' ? 'ÍMÃ' : '+EN';
    ctx.fillText(symbol, 0, 4);

    ctx.restore();
  }
}

function drawFireTrails(
  ctx: CanvasRenderingContext2D,
  fireTrails: ByteQuestSimulation['fireTrails']
) {
  for (const patch of fireTrails) {
    ctx.save();
    ctx.translate(patch.x, patch.y);
    const alpha = Math.max(0, Math.min(0.65, patch.life / patch.maxLife));
    ctx.globalAlpha = alpha;

    const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, patch.radius);
    grad.addColorStop(0, '#FEF08A');
    grad.addColorStop(0.5, '#F97316');
    grad.addColorStop(1, 'rgba(220, 38, 38, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, patch.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawFireAura(ctx: CanvasRenderingContext2D, sim: ByteQuestSimulation) {
  const lvl = sim.upgrades.weaponFireAuraLevel;
  if (lvl <= 0) return;
  const isSupreme = lvl >= 5;
  const radius = isSupreme ? 185 : 95 + lvl * 16;
  const timeSec = Date.now() / 1000;

  ctx.save();
  ctx.translate(sim.heroX, sim.heroY);

  // Pulso térmico radial
  const auraGrad = ctx.createRadialGradient(0, 0, radius * 0.25, 0, 0, radius);
  auraGrad.addColorStop(0, 'rgba(251, 146, 60, 0)');
  auraGrad.addColorStop(0.75, isSupreme ? 'rgba(249, 115, 22, 0.14)' : 'rgba(249, 115, 22, 0.08)');
  auraGrad.addColorStop(1, isSupreme ? 'rgba(250, 204, 21, 0.32)' : 'rgba(239, 68, 68, 0.22)');

  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // Anel rúnico solar giratório
  ctx.rotate(timeSec * (isSupreme ? 1.8 : 0.9));
  ctx.strokeStyle = isSupreme ? 'rgba(250, 204, 21, 0.65)' : 'rgba(249, 115, 22, 0.45)';
  ctx.lineWidth = isSupreme ? 2.5 : 1.5;
  ctx.setLineDash([12, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawTurrets(
  ctx: CanvasRenderingContext2D,
  turrets: ByteQuestSimulation['turrets']
) {
  const timeSec = Date.now() / 1000;
  for (const t of turrets) {
    ctx.save();
    ctx.translate(t.x, t.y);

    // Alcance sutil
    ctx.strokeStyle = t.isEvolved ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, Math.PI * 2);
    ctx.stroke();

    // Base mecânica octogonal
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = t.isEvolved ? '#38BDF8' : '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Canhão giratório
    ctx.rotate(timeSec * (t.isEvolved ? 5 : 2.5));
    ctx.fillStyle = t.isEvolved ? '#38BDF8' : '#FACC15';
    ctx.fillRect(0, -3, 18, 6);

    // Núcleo de energia
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // Barra de duração da torreta
    const lifeRatio = Math.max(0, t.life / t.maxLife);
    ctx.rotate(-timeSec * (t.isEvolved ? 5 : 2.5));
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(-12, 18, 24, 3);
    ctx.fillStyle = t.isEvolved ? '#38BDF8' : '#FACC15';
    ctx.fillRect(-12, 18, 24 * lifeRatio, 3);

    ctx.restore();
  }
}

function drawBoomerangs(
  ctx: CanvasRenderingContext2D,
  boomerangs: ByteQuestSimulation['boomerangs']
) {
  for (const b of boomerangs) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle);

    ctx.shadowColor = b.isEvolved ? '#F43F5E' : '#38BDF8';
    ctx.shadowBlur = 14;

    // Anel externo cortante do Chakram
    ctx.strokeStyle = b.isEvolved ? '#FDA4AF' : '#7DD3FC';
    ctx.lineWidth = b.isEvolved ? 4 : 3;
    ctx.beginPath();
    ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Lâminas internas em estrela
    ctx.fillStyle = b.isEvolved ? '#F43F5E' : '#0284C7';
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.lineTo(b.radius + 4, 0);
      ctx.lineTo(0, 4);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
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
  lockedEnemyId: string | null,
  heroX: number = 1200
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

    // ─── TENTA RENDERIZAR COM SPRITESHEET (PNG + ATLAS) ───
    if (!(enemy as any)._animState) {
      (enemy as any)._animState = byteQuestSpriteEngine.createAnimState('walk');
    }
    const animState = (enemy as any)._animState;
    byteQuestSpriteEngine.updateAnimState(animState, enemy.type, 'walk', 0.016);

    const spriteDrawn = byteQuestSpriteEngine.drawSprite(
      ctx,
      enemy.type,
      animState,
      0,
      0,
      {
        destWidth: enemy.width,
        destHeight: enemy.height,
        flashWhite: isFlashing,
        flipX: enemy.x > heroX
      }
    );

    if (!spriteDrawn) {
      // ─── SPRITES VETORIAIS REFINADOS POR TIPO DE INIMIGO (FALLBACK IMEDIATO) ───
      const timeSec = Date.now() / 1000;
      const pulse = Math.sin(timeSec * 5 + (enemy.x % 10));

      if (enemy.type === 'slime') {
      // 🧪 SLIME DE DADOS: Corpo gelatinoso translúcido com bolhas de dados e reflexos
      const squishX = 1 + Math.sin(timeSec * 6) * 0.08;
      const squishY = 1 - Math.sin(timeSec * 6) * 0.08;

      ctx.save();
      ctx.scale(squishX, squishY);

      // Camada externa gelatinosa
      const slimeGrad = ctx.createRadialGradient(-3, -5, 2, 0, 0, enemy.width / 2);
      slimeGrad.addColorStop(0, '#6EE7B7');
      slimeGrad.addColorStop(0.6, isFlashing ? '#FFFFFF' : '#10B981');
      slimeGrad.addColorStop(1, '#047857');
      ctx.fillStyle = slimeGrad;
      ctx.strokeStyle = isLocked ? '#FACC15' : '#059669';
      ctx.lineWidth = isLocked ? 3 : 2;

      ctx.beginPath();
      ctx.moveTo(0, -enemy.height * 0.45);
      ctx.bezierCurveTo(enemy.width * 0.45, -enemy.height * 0.4, enemy.width * 0.55, enemy.height * 0.2, enemy.width * 0.4, enemy.height * 0.45);
      ctx.bezierCurveTo(enemy.width * 0.2, enemy.height * 0.52, -enemy.width * 0.2, enemy.height * 0.52, -enemy.width * 0.4, enemy.height * 0.45);
      ctx.bezierCurveTo(-enemy.width * 0.55, enemy.height * 0.2, -enemy.width * 0.45, -enemy.height * 0.4, 0, -enemy.height * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Reflexo brilhante de topo (Specularity)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.ellipse(-6, -9, 6, 2.5, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Núcleo de dados e Olhos digitais
      ctx.fillStyle = '#064E3B';
      ctx.fillRect(-7, -2, 4, 5);
      ctx.fillRect(3, -2, 4, 5);
      ctx.fillStyle = '#A7F3D0';
      ctx.fillRect(-6, -1, 2, 2);
      ctx.fillRect(4, -1, 2, 2);
      ctx.restore();

    } else if (enemy.type === 'skeleton') {
      // 💀 ESQUELETO CIBERNÉTICO: Crânio mecânico angular, elmo de titânio e visor laser
      ctx.fillStyle = isFlashing ? '#FFFFFF' : '#1E293B';
      ctx.strokeStyle = isLocked ? '#FACC15' : '#38BDF8';
      ctx.lineWidth = 2;

      // Elmo / Cabeça
      ctx.beginPath();
      ctx.moveTo(-12, -14);
      ctx.lineTo(12, -14);
      ctx.lineTo(14, 2);
      ctx.lineTo(8, 12);
      ctx.lineTo(-8, 12);
      ctx.lineTo(-14, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Mandíbula e dentes metálicos
      ctx.fillStyle = '#334155';
      ctx.fillRect(-6, 6, 12, 5);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(-4, 7, 2, 3);
      ctx.fillRect(2, 7, 2, 3);

      // Visor de plasma ciano com pulso
      ctx.fillStyle = '#38BDF8';
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 6;
      ctx.fillRect(-9, -4, 18, 3.5);
      ctx.shadowBlur = 0;

    } else if (enemy.type === 'gargoyle') {
      // 🦇 GÁRGULA DIGITAL: Asas morcegoides abertas, chifres pontiagudos e olhos rubros
      const wingFlap = Math.sin(timeSec * 8) * 8;

      // Asas biomecânicas
      ctx.fillStyle = isFlashing ? '#FFFFFF' : '#4C1D95';
      ctx.strokeStyle = isLocked ? '#FACC15' : '#8B5CF6';
      ctx.lineWidth = 2;

      // Asa Esquerda
      ctx.beginPath();
      ctx.moveTo(-6, -4);
      ctx.lineTo(-24, -18 + wingFlap);
      ctx.lineTo(-16, 4 + wingFlap);
      ctx.lineTo(-6, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Asa Direita
      ctx.beginPath();
      ctx.moveTo(6, -4);
      ctx.lineTo(24, -18 + wingFlap);
      ctx.lineTo(16, 4 + wingFlap);
      ctx.lineTo(6, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tronco e Cabeça
      ctx.fillStyle = isFlashing ? '#FFFFFF' : '#2E1065';
      ctx.beginPath();
      ctx.ellipse(0, 0, 11, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Chifres de gárgula
      ctx.fillStyle = '#C084FC';
      ctx.beginPath();
      ctx.moveTo(-7, -12);
      ctx.lineTo(-11, -21);
      ctx.lineTo(-4, -14);
      ctx.moveTo(7, -12);
      ctx.lineTo(11, -21);
      ctx.lineTo(4, -14);
      ctx.fill();

      // Olhos rubros demoníacos
      ctx.fillStyle = '#EF4444';
      ctx.shadowColor = '#EF4444';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(-4, -3, 2.5, 0, Math.PI * 2);
      ctx.arc(4, -3, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

    } else if (enemy.type === 'fire_elemental') {
      // 🔥 ELEMENTAL DE FOGO (FORJA): Núcleo incandescente com labaredas de plasma rodopiando
      const flameGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, enemy.width * 0.55);
      flameGrad.addColorStop(0, '#FEF08A');
      flameGrad.addColorStop(0.4, '#F97316');
      flameGrad.addColorStop(0.8, '#EF4444');
      flameGrad.addColorStop(1, 'rgba(185, 28, 28, 0.1)');
      ctx.fillStyle = flameGrad;

      // Labaredas dinâmicas
      ctx.beginPath();
      const points = 7;
      for (let p = 0; p < points; p++) {
        const ang = (p * Math.PI * 2) / points + timeSec * 3;
        const dist = enemy.width * 0.45 + Math.sin(timeSec * 10 + p) * 5;
        const fx = Math.cos(ang) * dist;
        const fy = Math.sin(ang) * dist;
        if (p === 0) ctx.moveTo(fx, fy);
        else ctx.lineTo(fx, fy);
      }
      ctx.closePath();
      ctx.fill();

      // Olhos em brasa
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-5, -3, 3, 4);
      ctx.fillRect(2, -3, 3, 4);

    } else if (enemy.type === 'magma_golem') {
      // 🪨 GOLEM DE MAGMA (FORJA): Placas de rocha vulcânica com fissuras incandescentes
      ctx.fillStyle = isFlashing ? '#FFFFFF' : '#1C1917';
      ctx.strokeStyle = isLocked ? '#FACC15' : '#F97316';
      ctx.lineWidth = 2.5;

      // Placa Peitoral Maciça
      ctx.beginPath();
      ctx.roundRect(-enemy.width * 0.42, -enemy.height * 0.42, enemy.width * 0.84, enemy.height * 0.84, 8);
      ctx.fill();
      ctx.stroke();

      // Fissuras de lava internas
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, -8);
      ctx.lineTo(0, 2);
      ctx.lineTo(-6, 12);
      ctx.moveTo(8, -10);
      ctx.lineTo(2, 0);
      ctx.lineTo(8, 10);
      ctx.stroke();

      // Ombros rochosos
      ctx.fillStyle = '#292524';
      ctx.fillRect(-enemy.width * 0.55, -enemy.height * 0.35, 7, 14);
      ctx.fillRect(enemy.width * 0.55 - 7, -enemy.height * 0.35, 7, 14);

      // Olhos de lava
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(-6, -6, 4, 3);
      ctx.fillRect(2, -6, 4, 3);

    } else if (enemy.type === 'quantum_orb') {
      // ⚛️ ORBE QUÂNTICO (NÚCLEO): Esfera de singularidade com anéis gravitacionais giratórios
      ctx.save();
      ctx.rotate(timeSec * 2);

      // Anéis gravitacionais orbitais
      ctx.strokeStyle = '#C084FC';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, enemy.width * 0.52, enemy.height * 0.22, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#818CF8';
      ctx.beginPath();
      ctx.ellipse(0, 0, enemy.width * 0.22, enemy.height * 0.52, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Núcleo de matéria escura
      const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, enemy.width * 0.35);
      coreGrad.addColorStop(0, '#FFFFFF');
      coreGrad.addColorStop(0.3, '#A855F7');
      coreGrad.addColorStop(1, '#3B0764');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.width * 0.34, 0, Math.PI * 2);
      ctx.fill();

    } else if (enemy.type === 'void_wraith') {
      // 👻 ESPECTRO DO VAZIO (NÚCLEO): Fantasma cósmico flutuante com capuz e olhos estelares
      const floatY = Math.sin(timeSec * 5) * 4;
      ctx.save();
      ctx.translate(0, floatY);

      // Manto etéreo com cauda espectral ondulando
      ctx.fillStyle = isFlashing ? '#FFFFFF' : '#1E1B4B';
      ctx.strokeStyle = isLocked ? '#FACC15' : '#818CF8';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.bezierCurveTo(14, -14, 16, 2, 10, 14);
      ctx.lineTo(4, 8);
      ctx.lineTo(0, 16);
      ctx.lineTo(-4, 8);
      ctx.lineTo(-10, 14);
      ctx.bezierCurveTo(-16, 2, -14, -14, 0, -18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Olhos cósmicos brilhantes
      ctx.fillStyle = '#A78BFA';
      ctx.shadowColor = '#C084FC';
      ctx.shadowBlur = 8;
      ctx.fillRect(-5, -6, 3, 3);
      ctx.fillRect(2, -6, 3, 3);
      ctx.shadowBlur = 0;
      ctx.restore();

    } else if (enemy.type === 'miniboss') {
      // 👾 MINI-CHEFE: Gárgula Alfa Blindada com cristais e armadura espinhosa
      ctx.fillStyle = isFlashing ? '#FFFFFF' : '#4A044E';
      ctx.strokeStyle = isLocked ? '#FACC15' : '#EC4899';
      ctx.lineWidth = 3;

      // Carapaça blindada
      ctx.beginPath();
      ctx.moveTo(0, -enemy.height * 0.5);
      ctx.lineTo(enemy.width * 0.45, -enemy.height * 0.2);
      ctx.lineTo(enemy.width * 0.35, enemy.height * 0.4);
      ctx.lineTo(0, enemy.height * 0.5);
      ctx.lineTo(-enemy.width * 0.35, enemy.height * 0.4);
      ctx.lineTo(-enemy.width * 0.45, -enemy.height * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Olho cibernético central gigante
      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.arc(0, -4, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(0, -4, 4, 0, Math.PI * 2);
      ctx.fill();

    } else if (enemy.type === 'treasure_goblin') {
      // 💰 GOBLIN DO TESOURO DOURADO (RARO)
      ctx.save();
      ctx.shadowColor = '#FACC15';
      ctx.shadowBlur = 16;

      // Saco de ouro nas costas
      ctx.fillStyle = '#B45309';
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-8, -4 + pulse * 2, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Corpo dourado do Goblin
      ctx.fillStyle = isFlashing ? '#FFFFFF' : '#FACC15';
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-10, -12, 20, 24, 6);
      ctx.fill();
      ctx.stroke();

      // Olhos cobiçosos brilhantes
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(-5, -6, 4, 4);
      ctx.fillRect(3, -6, 4, 4);

      // Contador de fuga acima do Goblin
      if (enemy.escapeTimer !== undefined) {
        ctx.fillStyle = '#FEF08A';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`FOGE EM ${Math.ceil(enemy.escapeTimer)}s!`, 0, enemy.height / 2 + 18);
      }
      ctx.restore();
    } else {
      // 👑 CHEFÃO SUPREMO: Guardião Rúnico Titânico com Escudo Rúnico e Joia Central
      const rotRing = timeSec * 1.5;
      ctx.save();
      ctx.rotate(rotRing);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let a = 0; a < 8; a++) {
        const ang = (a * Math.PI) / 4;
        const r = enemy.width * 0.52;
        const px = Math.cos(ang) * r;
        const py = Math.sin(ang) * r;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Placa central do Boss
      ctx.fillStyle = isFlashing ? '#FFFFFF' : '#27173E';
      ctx.strokeStyle = isLocked ? '#FACC15' : '#F59E0B';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const ang = (a * Math.PI) / 3;
        const r = enemy.width * 0.44;
        const px = Math.cos(ang) * r;
        const py = Math.sin(ang) * r;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Joia Rúnica Central Pulsante com Olho Titânico
      const jewelGrad = ctx.createRadialGradient(0, 0, 3, 0, 0, 16);
      jewelGrad.addColorStop(0, '#FEF08A');
      jewelGrad.addColorStop(0.6, '#F59E0B');
      jewelGrad.addColorStop(1, '#DC2626');
      ctx.fillStyle = jewelGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 14 + pulse * 2, 0, Math.PI * 2);
      ctx.fill();

      // Fenda dimensional do olho
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.ellipse(0, 0, 3.5, 9 + pulse, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    }

    // Escudo Hexagonal Ciano de Firewall Criptográfico (Boss Phase)
    if (enemy.firewallActiveTimer && enemy.firewallActiveTimer > 0) {
      ctx.save();
      ctx.rotate(Date.now() * 0.003);
      ctx.strokeStyle = '#38BDF8';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 14;
      const fwR = enemy.width * 0.68;
      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const hAng = (h * Math.PI) / 3;
        const hx = Math.cos(hAng) * fwR;
        const hy = Math.sin(hAng) * fwR;
        if (h === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Indicador de Atordoamento (após quebrar Firewall)
    if (enemy.stunTimer && enemy.stunTimer > 0) {
      ctx.fillStyle = '#FACC15';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ ATORDOADO ⚡', 0, enemy.height / 2 + 18);
    }

    // Barra de Vida do Inimigo
    const hpBarW = Math.max(34, enemy.width);
    const hpBarH = 4;
    const hpRatio = Math.max(0, enemy.hp / enemy.maxHp);
    const barY = -enemy.height / 2 - 12;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(-hpBarW / 2, barY, hpBarW, hpBarH);

    ctx.fillStyle =
      enemy.firewallActiveTimer && enemy.firewallActiveTimer > 0
        ? '#38BDF8'
        : enemy.isBoss
        ? '#F59E0B'
        : '#EF4444';
    ctx.fillRect(-hpBarW / 2, barY, hpBarW * hpRatio, hpBarH);

    // Palavra de Digitação Flutuante sobre o Monstro (com Glitch Shake ao errar letra)
    if (enemy.word) {
      const hasErrorShake = (enemy.wordErrorShakeTimer || 0) > 0;
      const shakeOffsetX = hasErrorShake ? (Math.random() - 0.5) * 9 : 0;
      const textY = barY - 8;
      ctx.font = isLocked ? 'bold 14px monospace' : '12px monospace';
      ctx.textAlign = 'center';

      const typedPart = enemy.wordTyped || '';
      const remainingPart = enemy.word.slice(typedPart.length);

      // Caixa de fundo para legibilidade
      const totalWidth = ctx.measureText(enemy.word).width;
      ctx.fillStyle = hasErrorShake
        ? 'rgba(127, 29, 29, 0.92)'
        : isLocked
        ? 'rgba(0, 0, 0, 0.85)'
        : 'rgba(15, 23, 42, 0.75)';
      ctx.beginPath();
      ctx.roundRect(shakeOffsetX - totalWidth / 2 - 4, textY - 12, totalWidth + 8, 16, 3);
      ctx.fill();
      if (isLocked || hasErrorShake) {
        ctx.strokeStyle = hasErrorShake ? '#EF4444' : '#FACC15';
        ctx.lineWidth = hasErrorShake ? 2 : 1;
        ctx.stroke();
      }

      // Desenho das letras digitadas em verde/dourado e restantes em branco
      ctx.textAlign = 'left';
      const startX = shakeOffsetX - totalWidth / 2;

      ctx.fillStyle = '#4ADE80'; // Verde brilhante para letras acertadas
      ctx.fillText(typedPart, startX, textY);

      const typedWidth = ctx.measureText(typedPart).width;
      ctx.fillStyle = hasErrorShake ? '#FCA5A5' : isLocked ? '#FDE047' : '#E2E8F0'; // Restante
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

    const angle = Math.atan2(p.vy, p.vx);
    ctx.rotate(angle);

    if (p.id.startsWith('arrow')) {
      // 🏹 FLECHA LUMINOSA PERFURANTE (ARQUEIRO)
      const arrowLength = p.isCrit ? 26 : 20;

      // 1. Rastro de vento e luz de precisão
      const trailGrad = ctx.createLinearGradient(-arrowLength * 1.5, 0, 0, 0);
      trailGrad.addColorStop(0, 'rgba(52, 211, 153, 0)');
      trailGrad.addColorStop(1, p.isCrit ? 'rgba(250, 204, 21, 0.7)' : 'rgba(52, 211, 153, 0.6)');
      ctx.strokeStyle = trailGrad;
      ctx.lineWidth = p.isCrit ? 4.5 : 3;
      ctx.beginPath();
      ctx.moveTo(-arrowLength * 1.5, 0);
      ctx.lineTo(0, 0);
      ctx.stroke();

      // 2. Haste de madeira reforçada / liga leve
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-arrowLength, 0);
      ctx.lineTo(4, 0);
      ctx.stroke();

      // 3. Empenagem da flecha (penas traseiras)
      ctx.fillStyle = p.isCrit ? '#FACC15' : '#10B981';
      ctx.beginPath();
      ctx.moveTo(-arrowLength, 0);
      ctx.lineTo(-arrowLength - 4, -4);
      ctx.lineTo(-arrowLength + 2, 0);
      ctx.lineTo(-arrowLength - 4, 4);
      ctx.closePath();
      ctx.fill();

      // 4. Ponta da Flecha Afiada de Energia (Arrowhead)
      ctx.save();
      ctx.shadowColor = p.isCrit ? '#FACC15' : '#34D399';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(0, -4.5);
      ctx.lineTo(2, 0);
      ctx.lineTo(0, 4.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

    } else if (p.projectileType === 'fireball') {
      // 🔥 BOLA DE FOGO COLOSSAL (MAGO)
      // 1. Rastro de cauda flamejante
      const tailLen = 38;
      const tailGrad = ctx.createLinearGradient(-tailLen, 0, 0, 0);
      tailGrad.addColorStop(0, 'rgba(239, 68, 68, 0)');
      tailGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.6)');
      tailGrad.addColorStop(1, 'rgba(254, 240, 138, 0.9)');
      ctx.fillStyle = tailGrad;
      ctx.beginPath();
      ctx.moveTo(p.radius * 0.8, -p.radius * 0.7);
      ctx.lineTo(-tailLen, 0);
      ctx.lineTo(p.radius * 0.8, p.radius * 0.7);
      ctx.closePath();
      ctx.fill();

      // 2. Halo de calor e luz externa incandescente
      ctx.save();
      ctx.shadowColor = '#F97316';
      ctx.shadowBlur = 24;
      const auraGrad = ctx.createRadialGradient(0, 0, p.radius * 0.3, 0, 0, p.radius * 1.3);
      auraGrad.addColorStop(0, '#FEF08A');
      auraGrad.addColorStop(0.4, '#F97316');
      auraGrad.addColorStop(0.8, '#EF4444');
      auraGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, p.radius * 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Esfera de magma principal com labaredas orbitando
      ctx.fillStyle = '#F97316';
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // 4. Labaredas dinâmicas ao redor da bola de fogo
      const spin = Date.now() * 0.012;
      ctx.fillStyle = '#FEF08A';
      for (let s = 0; s < 5; s++) {
        const sAng = spin + (s * Math.PI * 2) / 5;
        const sx = Math.cos(sAng) * (p.radius * 0.8);
        const sy = Math.sin(sAng) * (p.radius * 0.8);
        ctx.beginPath();
        ctx.arc(sx, sy, p.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Núcleo branco fervente
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, p.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();

    } else if (p.projectileType === 'homing_missile') {
      // 🚀 MÍSSIL TELEGUIADO / VALQUÍRIA
      ctx.save();
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;

      // Rastro propulsor
      const jetGrad = ctx.createLinearGradient(-22, 0, 0, 0);
      jetGrad.addColorStop(0, 'rgba(249, 115, 22, 0)');
      jetGrad.addColorStop(1, '#FACC15');
      ctx.strokeStyle = jetGrad;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-22, 0);
      ctx.lineTo(-4, 0);
      ctx.stroke();

      // Corpo do míssil
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(9, 0);
      ctx.lineTo(-5, -4.5);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-5, 4.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(3, 0, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } else if (p.projectileType === 'spirit_wisp') {
      // 👻 ESPÍRITO COMPILADO (CÓDICE NECRO-BYTE)
      ctx.save();
      ctx.shadowColor = '#34D399';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ECFDF5';
      ctx.beginPath();
      ctx.arc(1, -1, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } else {
      // 🔮 ORBE DE ENERGIA ARCANO (MAGO)
      ctx.save();
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.isCrit ? 14 : 8;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Núcleo branco estelar
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, p.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Rastro do cometa
      const len = 16;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.radius * 0.8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-len, 0);
      ctx.stroke();
      ctx.restore();
    }

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

function drawSlashWaves(ctx: CanvasRenderingContext2D, waves: ByteQuestSimulation['slashWaves']) {
  if (!waves || waves.length === 0) return;

  for (const wave of waves) {
    ctx.save();
    ctx.translate(wave.x, wave.y);
    ctx.rotate(wave.angle);

    const progress = wave.progress; // 0 a 1
    const alpha = Math.max(0, 1 - progress);
    const r = wave.radius * (0.65 + progress * 0.45);
    const span = Math.PI * 0.75;
    const startAngle = -span / 2;
    const endAngle = span / 2;

    ctx.globalAlpha = alpha;

    // 1. ONDA DE CHOQUE LUNAR SÓLIDA PREENCHIDA (CRESCENT BLADE BODY)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const crescentGrad = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 1.15);
    if (wave.isCrit) {
      crescentGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      crescentGrad.addColorStop(0.3, 'rgba(250, 204, 21, 0.85)');
      crescentGrad.addColorStop(0.7, 'rgba(249, 115, 22, 0.5)');
      crescentGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    } else {
      crescentGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      crescentGrad.addColorStop(0.25, 'rgba(248, 113, 113, 0.8)');
      crescentGrad.addColorStop(0.65, 'rgba(220, 38, 38, 0.45)');
      crescentGrad.addColorStop(1, 'rgba(153, 27, 27, 0)');
    }

    // Desenha o corpo em forma de meia-lua cheia
    ctx.fillStyle = crescentGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, startAngle, endAngle);
    // Arco interno retornando para fechar o crescente
    ctx.arc(0, 0, r * 0.45, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 2. FIO DE LÂMINA CORTANTE LASER (NÚCLEO BRANCO AFISSO)
    ctx.save();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4 * (1 - progress * 0.6);
    ctx.shadowColor = wave.isCrit ? '#FACC15' : '#EF4444';
    ctx.shadowBlur = 16 * (1 - progress * 0.5);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, r, startAngle + 0.05, endAngle - 0.05);
    ctx.stroke();
    ctx.restore();

    // 3. SEGUNDO ARCO DE ARRASTO DE VENTO (DISSIPAÇÃO TÁTIL)
    ctx.save();
    ctx.strokeStyle = wave.isCrit ? 'rgba(254, 240, 138, 0.5)' : 'rgba(252, 165, 165, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.75, startAngle + 0.12, endAngle - 0.12);
    ctx.stroke();
    ctx.restore();

    // 4. FAÍSCAS EXPLOSIVAS PROJETADAS PARA FORA DO CORTE
    const sparkCount = wave.isCrit ? 10 : 6;
    for (let i = 0; i < sparkCount; i++) {
      const sAng = startAngle + (i / sparkCount) * span;
      const sDist = r + Math.sin(progress * 8 + i) * 18 + i * 2;
      const sx = Math.cos(sAng) * sDist;
      const sy = Math.sin(sAng) * sDist;

      ctx.fillStyle = wave.isCrit ? (i % 2 === 0 ? '#FFFFFF' : '#FACC15') : (i % 2 === 0 ? '#FFFFFF' : '#F87171');
      ctx.beginPath();
      ctx.arc(sx, sy, (2.5 + Math.random() * 2) * (1 - progress * 0.7), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function drawMeleeSlash(ctx: CanvasRenderingContext2D, heroX: number, heroY: number, timer: number, angle: number = 0) {
  ctx.save();
  ctx.translate(heroX, heroY);
  ctx.rotate(angle);

  const progress = 1 - timer / 0.24; // 0 a 1
  const slashRadius = 96;
  const startAngle = -Math.PI * 0.65 + progress * 0.45;
  const endAngle = Math.PI * 0.55;

  // 1. AURA DE ENERGIA EXTERNA (BLUR NEON)
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.shadowColor = '#F59E0B';
  ctx.shadowBlur = 20 * (1 - progress * 0.4);
  const outerGrad = ctx.createRadialGradient(0, 0, slashRadius * 0.5, 0, 0, slashRadius * 1.25);
  outerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  outerGrad.addColorStop(0.3, 'rgba(250, 204, 21, 0.85)');
  outerGrad.addColorStop(0.7, 'rgba(239, 68, 68, 0.55)');
  outerGrad.addColorStop(1, 'transparent');

  ctx.strokeStyle = outerGrad;
  ctx.lineWidth = 18 * (1 - progress * 0.65);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(15, 0, slashRadius, startAngle, endAngle);
  ctx.stroke();

  // Núcleo afiado da lâmina
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4 * (1 - progress * 0.5);
  ctx.beginPath();
  ctx.arc(15, 0, slashRadius, startAngle + 0.05, endAngle);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

// ─── EFEITOS VISUAIS COERENTES DAS SKILLS ESPECIAIS ───

/**
 * 🌀 CICLONE DE ESPADAS (GUERREIRO)
 * A espada gira a 360° com ondas concêntricas de vento fatiando e repelindo os monstros
 */
function drawCycloneEffects(ctx: CanvasRenderingContext2D, simulation: ByteQuestSimulation, cyclones: ByteQuestSimulation['cycloneEffects']) {
  if (!cyclones || cyclones.length === 0) return;

  for (const cyc of cyclones) {
    ctx.save();
    ctx.translate(simulation.heroX, simulation.heroY);

    const alpha = Math.min(1.0, cyc.life / 0.3);
    ctx.globalAlpha = alpha;

    // 1. Vórtice de Vento Fatiante Externo (Turbulência circular)
    ctx.save();
    ctx.rotate(cyc.angle);
    ctx.strokeStyle = 'rgba(254, 215, 170, 0.5)';
    ctx.lineWidth = 3;
    ctx.setLineDash([14, 8, 22, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, cyc.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
    ctx.lineWidth = 5;
    ctx.setLineDash([20, 12, 10, 10]);
    ctx.beginPath();
    ctx.arc(0, 0, cyc.radius * 0.75, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 2. Dupla de Lâminas Incandescentes em Rotação ao Redor do Corpo
    const bladeCount = 3;
    for (let b = 0; b < bladeCount; b++) {
      const bAng = cyc.angle + (b * Math.PI * 2) / bladeCount;
      ctx.save();
      ctx.rotate(bAng);

      // Arco de arrasto da lâmina
      const trailGrad = ctx.createLinearGradient(0, 0, cyc.radius, 0);
      trailGrad.addColorStop(0, 'transparent');
      trailGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.4)');
      trailGrad.addColorStop(1, 'rgba(254, 240, 138, 0.9)');
      ctx.strokeStyle = trailGrad;
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, cyc.radius * 0.85, -0.7, 0);
      ctx.stroke();

      // Corpo de aço da espada girando
      ctx.translate(cyc.radius * 0.85, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 14;
      ctx.fillRect(-3, -22, 6, 44);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-6, 8, 12, 4);
      ctx.restore();
    }

    ctx.restore();
  }
}

/**
 * 🏹 CHUVA DE FLECHAS (ARQUEIRO)
 * Sequência de flechas de plasma e vento que caem do céu com linhas de arrasto sobre os alvos
 */
function drawArrowRainEffects(ctx: CanvasRenderingContext2D, rains: ByteQuestSimulation['arrowRainEffects']) {
  if (!rains || rains.length === 0) return;

  for (const rain of rains) {
    ctx.save();

    // Indicador circular sutil da zona de bombardeio no chão
    ctx.save();
    ctx.globalAlpha = Math.min(0.25, rain.life * 0.15);
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.arc(rain.centerX, rain.centerY, rain.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Desenha cada flecha caindo diagonalmente do céu
    for (const arrow of rain.arrows) {
      const curX = arrow.startX + (arrow.targetX - arrow.startX) * arrow.progress;
      const curY = arrow.startY + (arrow.targetY - arrow.startY) * arrow.progress;
      const ang = Math.atan2(arrow.targetY - arrow.startY, arrow.targetX - arrow.startX);

      ctx.save();
      ctx.translate(curX, curY);
      ctx.rotate(ang);

      // Rastro de vento da descida
      const trailGrad = ctx.createLinearGradient(-35, 0, 0, 0);
      trailGrad.addColorStop(0, 'transparent');
      trailGrad.addColorStop(1, 'rgba(52, 211, 153, 0.85)');
      ctx.strokeStyle = trailGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-35, 0);
      ctx.lineTo(0, 0);
      ctx.stroke();

      // Haste da flecha de luz
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(2, 0);
      ctx.stroke();

      // Ponta iluminada
      ctx.fillStyle = '#6EE7B7';
      ctx.beginPath();
      ctx.arc(2, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }
}

/**
 * 🕸️ ARMADILHAS DE ESPINHOS NO CHÃO (ARQUEIRO)
 */
function drawGroundTraps(ctx: CanvasRenderingContext2D, traps: ByteQuestSimulation['groundTraps']) {
  if (!traps || traps.length === 0) return;

  for (const trap of traps) {
    ctx.save();
    ctx.translate(trap.x, trap.y);
    const alpha = Math.min(0.85, trap.life / 0.5);
    ctx.globalAlpha = alpha;

    // Círculo rúnico com espinhos metálicos
    ctx.strokeStyle = trap.active ? '#F59E0B' : '#78716C';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, trap.radius * 0.7, 0, Math.PI * 2);
    ctx.stroke();

    // Espinhos pontiagudos
    const spikeCount = 6;
    ctx.fillStyle = trap.active ? '#FBBF24' : '#57534E';
    for (let s = 0; s < spikeCount; s++) {
      const sAng = (s * Math.PI * 2) / spikeCount;
      ctx.save();
      ctx.rotate(sAng);
      ctx.beginPath();
      ctx.moveTo(trap.radius * 0.6, -3);
      ctx.lineTo(trap.radius * 1.05, 0);
      ctx.lineTo(trap.radius * 0.6, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }
}

/**
 * ⚡ DESCARGA DE RAIO EM CADEIA PROCEDURAL (MAGO)
 */
function drawChainLightningBolts(ctx: CanvasRenderingContext2D, bolts: ByteQuestSimulation['chainLightningBolts']) {
  if (!bolts || bolts.length === 0) return;

  for (const bolt of bolts) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1.0, bolt.alpha));

    // Brilho elétrico externo
    ctx.shadowColor = '#FACC15';
    ctx.shadowBlur = 14;
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    bolt.points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // Núcleo branco ultra-brilhante
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    bolt.points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    ctx.restore();
  }
}

function drawEnemyProjectiles(ctx: CanvasRenderingContext2D, enemyProjectiles: ByteQuestSimulation['enemyProjectiles']) {
  for (const ep of enemyProjectiles) {
    ctx.save();
    ctx.translate(ep.x, ep.y);

    if (ep.isHoming) {
      // 🚀 MÍSSIL TELEGUIADO DO CHEFE SUPREMO
      const angle = Math.atan2(ep.vy, ep.vx);
      ctx.rotate(angle);

      // Labareda e fumaça na cauda do míssil
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.moveTo(-10, -4);
      ctx.lineTo(-18 - Math.random() * 8, 0);
      ctx.lineTo(-10, 4);
      ctx.closePath();
      ctx.fill();

      // Corpo pontiagudo e aerodinâmico do míssil
      ctx.fillStyle = ep.color;
      ctx.shadowColor = ep.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(-8, -6);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-8, 6);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Núcleo branco energizado
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(2, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      continue;
    }

    // Projétil de plasma padrão
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

function drawBossArenaBarrier(
  ctx: CanvasRenderingContext2D,
  barrier: NonNullable<ByteQuestSimulation['bossArenaBarrier']>
) {
  ctx.save();
  const width = barrier.maxX - barrier.minX;
  const height = barrier.maxY - barrier.minY;

  // Campo de força de contenção
  const alpha = 0.45 + Math.sin(barrier.pulseTimer * 3) * 0.15;
  ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
  ctx.lineWidth = 4;
  ctx.shadowColor = '#EF4444';
  ctx.shadowBlur = 16;
  ctx.setLineDash([16, 8]);
  ctx.strokeRect(barrier.minX, barrier.minY, width, height);
  ctx.setLineDash([]);

  // Pilares de força nos 4 cantos da barreira
  const corners = [
    { x: barrier.minX, y: barrier.minY },
    { x: barrier.maxX, y: barrier.minY },
    { x: barrier.minX, y: barrier.maxY },
    { x: barrier.maxX, y: barrier.maxY }
  ];
  for (const c of corners) {
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Avisos de contenção rúnica nas bordas
  ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ BARREIRA DE CONTENÇÃO DO CHEFE ⚡', (barrier.minX + barrier.maxX) / 2, barrier.minY - 10);
  ctx.fillText('⚡ BARREIRA DE CONTENÇÃO DO CHEFE ⚡', (barrier.minX + barrier.maxX) / 2, barrier.maxY + 18);

  ctx.restore();
}

function drawBossLasers(
  ctx: CanvasRenderingContext2D,
  lasers: import('../../../types/byteQuest').BossLaserTelegraph[]
) {
  for (const laser of lasers) {
    ctx.save();
    const endX = laser.startX + Math.cos(laser.angle) * laser.length;
    const endY = laser.startY + Math.sin(laser.angle) * laser.length;

    if (laser.chargeTimer > 0) {
      // 1. Mira Telegrafada: Linha vermelha pulsante fina de rastreamento
      const chargeRatio = 1 - laser.chargeTimer / laser.duration;
      const pulseAlpha = 0.35 + Math.sin(Date.now() * 0.02) * 0.3 + chargeRatio * 0.35;
      ctx.strokeStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
      ctx.lineWidth = 2 + chargeRatio * 2;
      ctx.setLineDash([12, 6]);
      ctx.beginPath();
      ctx.moveTo(laser.startX, laser.startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ponto de foco no final da mira
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(endX, endY, 6 + chargeRatio * 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (laser.firingTimer && laser.firingTimer > 0) {
      // 2. Disparo Ativo: Raio Laser Devastador de Energia!
      ctx.save();
      // Brilho externo vermelho
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = laser.width * 1.8;
      ctx.beginPath();
      ctx.moveTo(laser.startX, laser.startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Feixe principal rubro
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = laser.width;
      ctx.shadowColor = '#EF4444';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.moveTo(laser.startX, laser.startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Núcleo branco incandescente
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = laser.width * 0.4;
      ctx.beginPath();
      ctx.moveTo(laser.startX, laser.startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      ctx.restore();
    }
    ctx.restore();
  }
}

function drawEpicBossHealthBar(
  ctx: CanvasRenderingContext2D,
  viewWidth: number,
  viewHeight: number,
  sim: ByteQuestSimulation
) {
  const boss = sim.enemies.find((e) => e.isBoss);
  if (!boss) return;

  ctx.save();
  const barW = Math.min(560, Math.max(340, viewWidth - 440));
  const barH = 18;
  const barX = (viewWidth - barW) / 2;
  const barY = 84;

  // Fundo escuro do painel do Chefe
  ctx.fillStyle = 'rgba(9, 11, 18, 0.9)';
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(barX - 12, barY - 22, barW + 24, barH + 34, 8);
  ctx.fill();
  ctx.stroke();

  // Nome do Boss + Indicador de Fase
  const phaseLabel = boss.bossPhase === 3 ? '🔥 FASE 3: MODO ENFURECIDO' : boss.bossPhase === 2 ? '⚡ FASE 2: LASER RASTREADOR' : '⚔️ FASE 1: MÍSSEIS TELEGUIADOS';
  ctx.fillStyle = boss.bossPhase === 3 ? '#F87171' : '#FDE047';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`☠️ ${boss.name.toUpperCase()}`, barX, barY - 7);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#A78BFA';
  ctx.font = 'bold 10px monospace';
  ctx.fillText(phaseLabel, barX + barW, barY - 7);

  // Barra de fundo (vazia)
  ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 4);
  ctx.fill();

  // Barra de HP preenchida
  const hpRatio = Math.max(0, Math.min(1, boss.hp / boss.maxHp));
  const fillW = barW * hpRatio;
  const hpGrad = ctx.createLinearGradient(barX, barY, barX + barW, barY);
  if (boss.bossPhase === 3) {
    hpGrad.addColorStop(0, '#B91C1C');
    hpGrad.addColorStop(1, '#EF4444');
  } else {
    hpGrad.addColorStop(0, '#D97706');
    hpGrad.addColorStop(1, '#F59E0B');
  }
  ctx.fillStyle = hpGrad;
  ctx.beginPath();
  ctx.roundRect(barX, barY, fillW, barH, 4);
  ctx.fill();

  // Se o Firewall Criptográfico estiver ativo, desenha overlay de escudo reluzente
  if (boss.firewallActiveTimer && boss.firewallActiveTimer > 0) {
    const shieldPulse = 0.55 + Math.sin(Date.now() * 0.01) * 0.25;
    ctx.fillStyle = `rgba(56, 189, 248, ${shieldPulse})`;
    ctx.fillRect(barX, barY, fillW, barH);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barW, barH);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🛡️ FIREWALL ATIVO — DIGITE A PALAVRA PARA QUEBRAR!', barX + barW / 2, barY + 13);
  } else {
    // Marcador numérico de HP
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.ceil(boss.hp)} / ${boss.maxHp} HP`, barX + barW / 2, barY + 13);
  }

  // Divisores visuais das 3 Fases (em 70% e 35%)
  const mark1X = barX + barW * 0.7;
  const mark2X = barX + barW * 0.35;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(mark1X, barY - 2);
  ctx.lineTo(mark1X, barY + barH + 2);
  ctx.moveTo(mark2X, barY - 2);
  ctx.lineTo(mark2X, barY + barH + 2);
  ctx.stroke();

  ctx.restore();
}

function drawBossWarningBanner(
  ctx: CanvasRenderingContext2D,
  viewWidth: number,
  viewHeight: number,
  sim: ByteQuestSimulation
) {
  if (!sim.bossWarningMessage) return;

  const msg = sim.bossWarningMessage;
  ctx.save();
  const bannerW = Math.min(500, viewWidth - 80);
  const bannerH = 46;
  const bx = (viewWidth - bannerW) / 2;
  const by = 126;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
  ctx.strokeStyle = msg.color;
  ctx.lineWidth = 2.5;
  ctx.shadowColor = msg.color;
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.roundRect(bx, by, bannerW, bannerH, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = msg.color;
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(msg.text, viewWidth / 2, by + 19);

  ctx.fillStyle = '#FEF08A';
  ctx.font = 'bold 10px monospace';
  ctx.fillText(msg.subtext, viewWidth / 2, by + 35);

  ctx.restore();
}

function drawChamberPortals(
  ctx: CanvasRenderingContext2D,
  portals: import('../../../types/byteQuest').ChamberPortal[],
  heroX: number,
  heroY: number
) {
  for (const portal of portals) {
    if (!portal.active) continue;

    const dist = Math.hypot(portal.x - heroX, portal.y - heroY);
    const isNearby = dist <= portal.radius + 120;
    const spin = Date.now() * 0.002;

    ctx.save();
    ctx.translate(portal.x, portal.y);

    // 1. Resplendor de energia no chão (Círculo de Salto)
    const radGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, portal.radius * 1.4);
    radGrad.addColorStop(0, portal.color);
    radGrad.addColorStop(0.5, `${portal.color}55`);
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(0, 0, portal.radius * 1.4, 0, Math.PI * 2);
    ctx.fill();

    // 2. Anéis rúnicos rotativos
    ctx.save();
    ctx.rotate(spin);
    ctx.strokeStyle = portal.color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = portal.color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(0, 0, portal.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Glifos nos 4 quadrantes
    for (let a = 0; a < 4; a++) {
      const gAngle = (a * Math.PI) / 2;
      const gx = Math.cos(gAngle) * portal.radius;
      const gy = Math.sin(gAngle) * portal.radius;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(gx - 3, gy - 3, 6, 6);
    }
    ctx.restore();

    // Anel interno contra-rotativo tracejado
    ctx.save();
    ctx.rotate(-spin * 1.5);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, portal.radius * 0.65, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Feixe vertical de luz ascendente
    const beamGrad = ctx.createLinearGradient(0, 0, 0, -90);
    beamGrad.addColorStop(0, `${portal.color}88`);
    beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(16, 0);
    ctx.lineTo(6, -90);
    ctx.lineTo(-6, -90);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // 3. Painel Holográfico Flutuante com Ícone e Palavra de Ativação
    ctx.save();
    const badgeY = portal.y - portal.radius - 44;
    const bw = 175;
    const bh = 54;

    ctx.fillStyle = 'rgba(9, 11, 18, 0.9)';
    ctx.strokeStyle = portal.color;
    ctx.lineWidth = isNearby ? 2.5 : 1.5;
    ctx.shadowColor = portal.color;
    ctx.shadowBlur = isNearby ? 16 : 8;
    ctx.beginPath();
    ctx.roundRect(portal.x - bw / 2, badgeY, bw, bh, 8);
    ctx.fill();
    ctx.stroke();

    // Título e Ícone
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`${portal.icon} ${portal.label}`, portal.x, badgeY + 16);

    // Subtítulo
    ctx.fillStyle = '#94A3B8';
    ctx.font = '9px monospace';
    ctx.fillText(portal.sublabel, portal.x, badgeY + 28);

    // Palavra de Ativação com destaque
    const boxW = Math.max(90, portal.activationWord.length * 11 + 20);
    const boxH = 16;
    const boxX = portal.x - boxW / 2;
    const boxY = badgeY + 33;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = isNearby ? '#10B981' : '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 4);
    ctx.fill();
    ctx.stroke();

    // Letras digitadas vs restantes
    const typed = portal.activationProgress.toUpperCase();
    const full = portal.activationWord.toUpperCase();
    const remain = full.slice(typed.length);
    ctx.font = 'bold 10px monospace';

    if (typed.length === 0) {
      ctx.textAlign = 'center';
      ctx.fillStyle = isNearby ? '#FDE047' : '#CBD5E1';
      ctx.fillText(full, portal.x, boxY + 12);
    } else {
      const totalW = ctx.measureText(full).width;
      const startX = portal.x - totalW / 2;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#4ADE80';
      ctx.fillText(typed, startX, boxY + 12);
      const typedW = ctx.measureText(typed).width;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(remain, startX + typedW, boxY + 12);
    }

    ctx.restore();
  }
}

function drawChamberTerminal(
  ctx: CanvasRenderingContext2D,
  terminal: import('../../../types/byteQuest').ChamberTerminal,
  heroX: number,
  heroY: number
) {
  if (!terminal.active) return;

  const dist = Math.hypot(terminal.x - heroX, terminal.y - heroY);
  const isNearby = dist <= terminal.radius + 120;

  ctx.save();
  // 1. Base pedestal no chão
  ctx.translate(terminal.x, terminal.y);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#38BDF8';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Núcleo holográfico pulsante
  const pulse = 0.5 + Math.sin(Date.now() * 0.006) * 0.3;
  ctx.fillStyle = `rgba(56, 189, 248, ${pulse})`;
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Banner de Cabeçalho do Terminal
  ctx.save();
  const headerY = terminal.y - 120;
  ctx.fillStyle = 'rgba(9, 11, 18, 0.94)';
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(terminal.x - 130, headerY, 260, 34, 8);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 11px monospace';
  ctx.fillText(terminal.title, terminal.x, headerY + 15);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '8px monospace';
  ctx.fillText(terminal.subtitle, terminal.x, headerY + 27);

  // 3. Ofertas Flutuantes
  const cardW = 125;
  const cardH = 78;
  const spacing = 135;
  const startX = terminal.x - ((terminal.offers.length - 1) * spacing) / 2;

  terminal.offers.forEach((offer, idx) => {
    const cx = startX + idx * spacing;
    const cy = terminal.y - 70;

    ctx.save();
    ctx.fillStyle = offer.purchased ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = offer.purchased ? '#10B981' : isNearby ? offer.color : 'rgba(100, 116, 139, 0.7)';
    ctx.lineWidth = isNearby && !offer.purchased ? 2 : 1.5;
    ctx.shadowColor = offer.color;
    ctx.shadowBlur = isNearby && !offer.purchased ? 10 : 4;
    ctx.beginPath();
    ctx.roundRect(cx - cardW / 2, cy, cardW, cardH, 6);
    ctx.fill();
    ctx.stroke();

    // Título
    ctx.textAlign = 'center';
    ctx.fillStyle = offer.color;
    ctx.font = 'bold 9px monospace';
    ctx.fillText(offer.title, cx, cy + 14);

    // Preço em Bytes
    ctx.fillStyle = offer.byteCost === 0 ? '#34D399' : '#FDE047';
    ctx.font = 'bold 8px monospace';
    ctx.fillText(offer.byteCost === 0 ? 'GRÁTIS' : `🪙 ${offer.byteCost} BYTES`, cx, cy + 26);

    // Descrição curta (quebrada)
    ctx.fillStyle = '#94A3B8';
    ctx.font = '7px monospace';
    ctx.fillText(offer.description.slice(0, 22), cx, cy + 39);
    if (offer.description.length > 22) {
      ctx.fillText(offer.description.slice(22, 44), cx, cy + 49);
    }

    // Botão / Palavra de Ativação
    const bw = 90;
    const bh = 15;
    const by = cy + 56;
    ctx.fillStyle = offer.purchased ? 'rgba(16, 185, 129, 0.3)' : 'rgba(0, 0, 0, 0.8)';
    ctx.strokeStyle = offer.purchased ? '#10B981' : '#F59E0B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(cx - bw / 2, by, bw, bh, 3);
    ctx.fill();
    ctx.stroke();

    if (offer.purchased) {
      ctx.fillStyle = '#4ADE80';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('✓ ADQUIRIDO', cx, by + 11);
    } else {
      const full = offer.activationWord.toUpperCase();
      const typed = offer.activationWordTyped.toUpperCase();
      const remain = full.slice(typed.length);

      if (typed.length === 0) {
        ctx.fillStyle = '#FDE047';
        ctx.font = 'bold 8px monospace';
        ctx.fillText(`DIGITE: ${full}`, cx, by + 11);
      } else {
        ctx.font = 'bold 8px monospace';
        const totalW = ctx.measureText(full).width;
        const sx = cx - totalW / 2;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#4ADE80';
        ctx.fillText(typed, sx, by + 11);
        const tw = ctx.measureText(typed).width;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(remain, sx + tw, by + 11);
      }
    }

    ctx.restore();
  });

  ctx.restore();
}

function drawAllyDrones(
  ctx: CanvasRenderingContext2D,
  drones: import('../../../types/byteQuest').AllyDrone[],
  heroX: number,
  heroY: number
) {
  for (const drone of drones) {
    const droneX = heroX + Math.cos(drone.orbitAngle) * drone.orbitDistance;
    const droneY = heroY + Math.sin(drone.orbitAngle) * (drone.orbitDistance * 0.7);

    ctx.save();
    ctx.translate(droneX, droneY);

    // 1. Sombra e propulsor
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 16, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rastro de fogo de propulsão
    ctx.fillStyle = drone.color;
    ctx.shadowColor = drone.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 6, 3 + Math.sin(Date.now() * 0.02) * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // 2. Chassi do Drone (Hexágono Cyber)
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = drone.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI) / 3;
      const x = Math.cos(ang) * 11;
      const y = Math.sin(ang) * 11;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Núcleo de energia
    ctx.fillStyle = drone.color;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // Detalhe de Modelo
    if (drone.model === 'combat') {
      // Mini-canhão Railgun
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(4, -2, 8, 4);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(10, -1, 3, 2);
    } else if (drone.model === 'medic') {
      // Cruz médica verde
      ctx.fillStyle = '#34D399';
      ctx.fillRect(-1.5, -6, 3, 12);
      ctx.fillRect(-6, -1.5, 12, 3);
    } else {
      // Antena de Hacker
      ctx.strokeStyle = '#C084FC';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(0, -17);
      ctx.arc(0, -17, 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Nível do Drone
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`★${drone.level}`, 0, -14);

    ctx.restore();
  }
}

function drawHyperspaceWarp(
  ctx: CanvasRenderingContext2D,
  viewWidth: number,
  viewHeight: number,
  timer: number
) {
  const alpha = Math.min(1, timer * 2.2);
  const cx = viewWidth / 2;
  const cy = viewHeight / 2;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Flash de fundo
  ctx.fillStyle = `rgba(14, 165, 233, ${alpha * 0.45})`;
  ctx.fillRect(0, 0, viewWidth, viewHeight);

  // Linhas de dobra radial hiperespacial
  const rayCount = 28;
  const spin = Date.now() * 0.004;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2.5;

  for (let i = 0; i < rayCount; i++) {
    const angle = (i * Math.PI * 2) / rayCount + spin;
    const len = 400 + Math.sin(i * 3 + Date.now() * 0.01) * 200;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 30, cy + Math.sin(angle) * 30);
    ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
    ctx.stroke();
  }

  // Texto de transição
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ SALTO HIPERESPACIAL EM CURSO...', cx, cy - 20);

  ctx.restore();
}

function drawHero(
  ctx: CanvasRenderingContext2D,
  simulation: ByteQuestSimulation,
  rpgClass: RpgClassType,
  loadout: HeroLoadout
) {
  const { heroX, heroY, heroRadius, stats, runCycle } = simulation;
  const isAttacking = simulation.heroAttackTimer > 0;
  const attackDuration = Math.max(0.01, simulation.heroAttackDuration || 0.22);
  const attackProgress = isAttacking ? 1 - Math.max(0, simulation.heroAttackTimer) / attackDuration : 0;

  const isHurt = simulation.heroHurtTimer > 0;
  const hurtProgress = isHurt ? 1 - simulation.heroHurtTimer / 0.22 : 0;

  // ─── CÁLCULOS DINÂMICOS DE CINEMÁTICA DE COMBATE SUAVIZADA ───
  let lungeX = 0;
  let lungeY = 0;
  let bodyTilt = 0;
  let squashX = 1;
  let squashY = 1;
  let weaponAngle = 0;
  let weaponOffsetX = 12;
  let weaponOffsetY = 2;
  let leftArmAngle = 0;

  // Bobbing de corrida suave e orgânico
  const isMoving = Math.hypot(simulation.heroVx, simulation.heroVy) > 5;
  const isDashing = simulation.isDashing || simulation.mobilitySlideTimer > 0;
  const baseBobY = isDashing ? 3 : isMoving ? Math.sin(runCycle * 2) * 2.2 : Math.sin(Date.now() * 0.003) * 1.2;
  let bobY = baseBobY;

  // Postura aerodinâmica de deslize/investida durante o dash
  if (isDashing) {
    bodyTilt = (simulation.heroFacing === 'right' ? 1 : -1) * 0.22;
    squashX = 1.15; // Estica na horizontal na direção do deslize
    squashY = 0.88; // Abaixa o centro de massa
    weaponAngle = (simulation.heroFacing === 'right' ? 1 : -1) * -0.4;
    leftArmAngle = 0.5;
  }

  // REAÇÃO FÍSICA DE DANO (HURT KNOCKBACK & FLINCH SUAVIZADOS)
  if (isHurt) {
    const hurtDir = simulation.heroFacing === 'right' ? -1 : 1;
    const smoothHurt = Math.sin(hurtProgress * Math.PI);
    lungeX = hurtDir * 6 * smoothHurt;
    bobY = baseBobY - 3 * smoothHurt;
    bodyTilt = hurtDir * -0.12 * smoothHurt;
    squashX = 1 - 0.08 * smoothHurt;
    squashY = 1 + 0.08 * smoothHurt;
    leftArmAngle = 0.4 * smoothHurt;
    weaponAngle = -0.3 * smoothHurt;
  } else if (isAttacking) {
    // Curva de ataque unificada suave (Hermite / Smoothstep contínuo)
    if (rpgClass === 'warrior') {
      // GUERREIRO: Movimento fluído com arco limpo sem saltos bruscos
      // Antecipação suave (0 -> 0.25) -> Corte em arco (0.25 -> 0.7) -> Retorno suave (0.7 -> 1.0)
      if (attackProgress < 0.25) {
        const t = attackProgress / 0.25;
        const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
        lungeX = -4 * ease;
        bodyTilt = -0.1 * ease;
        weaponAngle = -1.1 * ease;
        weaponOffsetX = 12 - 2 * ease;
        weaponOffsetY = 2 - 3 * ease;
        leftArmAngle = 0.3 * ease;
      } else if (attackProgress < 0.72) {
        const t = (attackProgress - 0.25) / 0.47;
        const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
        lungeX = -4 + 12 * Math.sin(t * Math.PI);
        bodyTilt = -0.1 + 0.22 * Math.sin(t * Math.PI);
        squashX = 1 + 0.08 * Math.sin(t * Math.PI);
        squashY = 1 - 0.06 * Math.sin(t * Math.PI);
        weaponAngle = -1.1 + t * 2.6; // Arco contínuo sem saltos
        weaponOffsetX = 10 + 6 * Math.sin(t * Math.PI);
        weaponOffsetY = -1 + 4 * Math.sin(t * Math.PI);
        leftArmAngle = 0.3 - 0.5 * Math.sin(t * Math.PI);
      } else {
        const t = (attackProgress - 0.72) / 0.28;
        const ease = 0.5 + 0.5 * Math.cos(t * Math.PI); // Decai suavemente de 1 para 0
        lungeX = 3 * ease;
        bodyTilt = 0.06 * ease;
        weaponAngle = 1.5 * ease;
        leftArmAngle = -0.2 * ease;
      }
    } else if (rpgClass === 'archer') {
      // ARQUEIRO: Tensão da corda fluída -> Soltura ágil -> Retorno suave
      if (attackProgress < 0.32) {
        const t = attackProgress / 0.32;
        const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
        lungeX = -2 * ease;
        bodyTilt = -0.05 * ease;
        weaponOffsetX = 12 - 2 * ease;
        leftArmAngle = -0.25 * ease;
      } else if (attackProgress < 0.70) {
        const t = (attackProgress - 0.32) / 0.38;
        const snap = Math.sin(t * Math.PI);
        lungeX = -2 - 3 * snap;
        bodyTilt = -0.05 - 0.06 * snap;
        weaponOffsetX = 10 - 3 * snap;
        leftArmAngle = 0.25 * snap;
      } else {
        const t = (attackProgress - 0.70) / 0.30;
        const ease = 0.5 + 0.5 * Math.cos(t * Math.PI);
        lungeX = -1.5 * ease;
      }
    } else {
      // MAGO: Levitação e Canalização Arcana suave
      const levitate = Math.sin(attackProgress * Math.PI);
      bobY = baseBobY - 6 * levitate;
      bodyTilt = -0.04 * levitate;
      weaponOffsetY = 2 - 6 * levitate;
      weaponAngle = -0.4 * levitate;
      leftArmAngle = -0.35 * levitate;
      squashX = 1 + 0.05 * levitate;
      squashY = 1 - 0.04 * levitate;
    }
  } else {
    // Balanço orgânico suave de corrida ou respiração idle
    weaponAngle = isMoving ? Math.sin(runCycle) * 0.12 : Math.sin(Date.now() * 0.0025) * 0.06;
  }

  const classColor = rpgClass === 'mage' ? '#8B5CF6' : rpgClass === 'archer' ? '#10B981' : '#EF4444';
  const eyeColor = rpgClass === 'mage' ? '#C4B5FD' : rpgClass === 'archer' ? '#6EE7B7' : '#FCA5A5';

  ctx.save();
  ctx.translate(heroX, heroY);

  // Espelhamento horizontal para olhar na direção da marcha ou do ataque
  if (simulation.heroFacing === 'left') {
    ctx.scale(-1, 1);
  }

  // Deslocamento de lunge / recuo aplicado ao centro
  ctx.translate(lungeX, lungeY);
  ctx.rotate(bodyTilt);
  ctx.scale(squashX, squashY);

  // Sombra dinâmica no chão que deforma suavemente com a passada
  const shadowBob = isMoving ? (1 - Math.abs(Math.sin(runCycle)) * 0.1) : 1.0;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 25, heroRadius * shadowBob, 6.5 * shadowBob, 0, 0, Math.PI * 2);
  ctx.fill();

  // Partículas de poeira sutis apenas ao se mover rápido
  if (isMoving && Math.abs(Math.sin(runCycle)) > 0.88) {
    ctx.fillStyle = isAttacking ? 'rgba(250, 204, 21, 0.35)' : 'rgba(167, 139, 250, 0.3)';
    ctx.beginPath();
    ctx.arc(-14 - Math.random() * 4, 23 + Math.random() * 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 1. Pernas Articuladas com Flexão Natural no Passo
  const legCycle = isMoving ? runCycle : 0;
  const leftLegX = isMoving ? Math.sin(legCycle) * 9 : -2;
  const leftLegY = isMoving ? 21 + Math.max(0, -Math.cos(legCycle) * 5) : 21;
  const rightLegX = isMoving ? -Math.sin(legCycle) * 9 : 2;
  const rightLegY = isMoving ? 21 + Math.max(0, Math.cos(legCycle) * 5) : 21;

  // Perna Esquerda com dobra
  ctx.strokeStyle = '#16A34A';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-4, 10 + bobY);
  ctx.quadraticCurveTo(-5 + leftLegX * 0.4, 16 + bobY, -4 + leftLegX, leftLegY);
  ctx.stroke();
  ctx.fillStyle = classColor;
  ctx.fillRect(-6 + leftLegX, leftLegY - 2, 6, 4.5);

  // Perna Direita com dobra
  ctx.beginPath();
  ctx.moveTo(4, 10 + bobY);
  ctx.quadraticCurveTo(3 + rightLegX * 0.4, 16 + bobY, 4 + rightLegX, rightLegY);
  ctx.stroke();
  ctx.fillStyle = classColor;
  ctx.fillRect(2 + rightLegX, rightLegY - 2, 6, 4.5);

  // 2. Capa da Classe Ondulando com Vento e Ataque
  const capeWave = isMoving
    ? Math.sin(runCycle * 1.4) * 4 + (isAttacking ? Math.sin(attackProgress * Math.PI) * 6 : 0)
    : Math.sin(Date.now() * 0.003) * 2;
  ctx.fillStyle = rpgClass === 'warrior' ? '#991B1B' : rpgClass === 'archer' ? '#065F46' : '#4C1D95';
  ctx.beginPath();
  ctx.moveTo(-10, -6 + bobY);
  ctx.quadraticCurveTo(-24, 6 + bobY + capeWave, -28 - (isAttacking ? 8 : 0), 18 + capeWave);
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

  // 4. Aura de Classe / Equipamento Quântico
  const hasQuantumAura = loadout.weapon?.rarity === 'quantum' || loadout.chest?.rarity === 'quantum' || loadout.head?.rarity === 'quantum';
  ctx.strokeStyle = hasQuantumAura ? '#C084FC' : classColor;
  ctx.lineWidth = hasQuantumAura ? 2.5 : 1.8;
  if (hasQuantumAura) {
    ctx.setLineDash([6, 3]);
  }
  ctx.beginPath();
  ctx.arc(0, bobY, heroRadius + (isAttacking ? 2 : 0), 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4.5. ACESSÓRIO FLUTUANTE (MATRIZ QUÂNTICA OU ANEL DE CLOCK)
  const accKey = loadout.accessory?.visualAssetKey;
  if (accKey === 'quantum_matrix') {
    const orbitAngle = runCycle * 1.6 + (isAttacking ? attackProgress * 4 : 0);
    const orbX = Math.cos(orbitAngle) * (heroRadius + 14);
    const orbY = Math.sin(orbitAngle) * (heroRadius + 8) + bobY;
    ctx.fillStyle = '#C084FC';
    ctx.fillRect(orbX - 4, orbY - 4, 8, 8);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1;
    ctx.strokeRect(orbX - 4, orbY - 4, 8, 8);
  } else if (accKey === 'ring_quartz') {
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(-13, 10 + bobY, isAttacking ? 4.5 : 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4.8. BRAÇO ESQUERDO ARTICULADO (ACOMPANHA O MOVIMENTO DO COMBATE)
  ctx.save();
  ctx.translate(-10, 8 + bobY);
  ctx.rotate(leftArmAngle);
  ctx.fillStyle = '#16A34A';
  ctx.fillRect(-3, 0, 6, 14);
  ctx.fillStyle = classColor;
  ctx.beginPath();
  ctx.arc(0, 14, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 5. TRONCO DO BYTEZINHO (CUSTOMIZADO PELO PEITORAL / CHEST)
  const chestKey = loadout.chest?.visualAssetKey;
  if (chestKey === 'chest_antistatic') {
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#0EA5E9';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-10, 4 + bobY, 20, 16, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(-8, 9 + bobY, 16, 2);
    ctx.fillRect(-8, 14 + bobY, 16, 2);
  } else if (chestKey === 'plate_titan') {
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-11, 3 + bobY, 22, 17, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(0, 6 + bobY);
    ctx.lineTo(5, 12 + bobY);
    ctx.lineTo(0, 17 + bobY);
    ctx.lineTo(-5, 12 + bobY);
    ctx.closePath();
    ctx.fill();
  } else if (chestKey === 'robe_arcane') {
    ctx.fillStyle = '#4C1D95';
    ctx.strokeStyle = '#A78BFA';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-10, 4 + bobY, 20, 18, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(0, 12 + bobY, 3.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (chestKey === 'aegis_quantum') {
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#C084FC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-11, 3 + bobY, 22, 18, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(0, 12 + bobY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 12 + bobY, 1.8, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#16A34A';
    ctx.beginPath();
    ctx.roundRect(-10, 4 + bobY, 20, 16, 4);
    ctx.fill();
    ctx.fillStyle = classColor;
    ctx.beginPath();
    ctx.arc(0, 12 + bobY, 3, 0, Math.PI * 2);
    ctx.fill();
  }

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

  // 6.2. OLHOS EXPRESSIVOS DE LED (REATIVOS AO MODO DE COMBATE E DANO)
  if (isHurt) {
    // Expressão de Dano / Flinch (Olhos cerrados em "><" e faísca de impacto)
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2.2;
    // Olho esquerdo em "X"
    ctx.beginPath();
    ctx.moveTo(-5, -10 + bobY);
    ctx.lineTo(0, -5 + bobY);
    ctx.moveTo(0, -10 + bobY);
    ctx.lineTo(-5, -5 + bobY);
    // Olho direito em "X"
    ctx.moveTo(4, -10 + bobY);
    ctx.lineTo(9, -5 + bobY);
    ctx.moveTo(9, -10 + bobY);
    ctx.lineTo(4, -5 + bobY);
    ctx.stroke();

    // Faísca de curto-circuito na tela CRT
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(2, -7 + bobY, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (isAttacking) {
    if (rpgClass === 'warrior') {
      // Olhar Afiado / Focado de Fúria em Combate
      ctx.fillStyle = '#FACC15';
      ctx.beginPath();
      ctx.moveTo(-4, -11 + bobY);
      ctx.lineTo(1, -7 + bobY);
      ctx.lineTo(-1, -4 + bobY);
      ctx.lineTo(-5, -6 + bobY);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(4, -11 + bobY);
      ctx.lineTo(9, -7 + bobY);
      ctx.lineTo(7, -4 + bobY);
      ctx.lineTo(3, -6 + bobY);
      ctx.closePath();
      ctx.fill();

      // Pupila com faísca incandescente
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-2, -7 + bobY, 2, 2);
      ctx.fillRect(6, -7 + bobY, 2, 2);
    } else if (rpgClass === 'archer') {
      // Olho esquerdo com mira telescópica cibernética HUD
      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-4, -11 + bobY, 6, 7);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(-2, -9 + bobY, 2, 3);
      // Olho direito piscando focado na pontaria
      ctx.strokeStyle = '#6EE7B7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(5, -6 + bobY);
      ctx.lineTo(9, -6 + bobY);
      ctx.stroke();
    } else {
      // Mago: Olhos incandescentes de pura magia cósmica
      ctx.fillStyle = '#C084FC';
      ctx.shadowColor = '#C084FC';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(-1, -7 + bobY, 4, 0, Math.PI * 2);
      ctx.arc(7, -7 + bobY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-1, -7 + bobY, 2, 0, Math.PI * 2);
      ctx.arc(7, -7 + bobY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Olhos Expressivos normais do Bytezinho
    ctx.fillStyle = eyeColor;
    ctx.fillRect(-3, -9 + bobY, 4, 6);
    ctx.fillRect(5, -9 + bobY, 4, 6);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-2, -9 + bobY, 2, 2);
    ctx.fillRect(6, -9 + bobY, 2, 2);
  }

  // Sorriso do Bytezinho (ou boca determinada em ataque / dor)
  ctx.strokeStyle = isHurt ? '#EF4444' : '#4ADE80';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  if (isHurt) {
    // Boca em "O" de susto / impacto
    ctx.arc(2, -2 + bobY, 2.5, 0, Math.PI * 2);
  } else if (isAttacking) {
    ctx.moveTo(1, -2 + bobY);
    ctx.lineTo(7, -3 + bobY);
  } else {
    ctx.arc(3, -2 + bobY, 3, 0.2, Math.PI - 0.2);
  }
  ctx.stroke();

  // 7. ADORNO / ELMO EQUIPADO NO MONITOR (HEAD)
  const headKey = loadout.head?.visualAssetKey;
  if (headKey === 'head_visor') {
    ctx.fillStyle = 'rgba(14, 165, 233, 0.6)';
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.fillRect(-14, -12 + bobY, 28, 8);
    ctx.strokeRect(-14, -12 + bobY, 28, 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-13, -8 + bobY, 26, 1);
  } else if (headKey === 'head_helm') {
    ctx.fillStyle = '#334155';
    ctx.fillRect(-17, -22 + bobY, 34, 6);
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(-16, -20 + bobY, 32, 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(-3, -27 + bobY, 6, 7);
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(-14, -11 + bobY, 28, 4);
  } else if (headKey === 'quantum_visor') {
    ctx.fillStyle = 'rgba(192, 132, 252, 0.65)';
    ctx.strokeStyle = '#C084FC';
    ctx.lineWidth = 1.5;
    ctx.fillRect(-14, -12 + bobY, 28, 9);
    ctx.strokeRect(-14, -12 + bobY, 28, 9);
    ctx.strokeStyle = '#C084FC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(15, -16 + bobY);
    ctx.lineTo(21, -26 + bobY);
    ctx.stroke();
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.arc(21, -26 + bobY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    if (rpgClass === 'warrior') {
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
  }

  // 8. ARMA EQUIPADA COM CINEMÁTICA DE GOLPE, RECUO E RASTRO DE LUZ
  ctx.save();
  ctx.translate(weaponOffsetX, weaponOffsetY + bobY);
  ctx.rotate(weaponAngle);

  // 8.1. Rastro de luz translúcido da lâmina durante o corte do Guerreiro
  if (isAttacking && rpgClass === 'warrior' && attackProgress > 0.3 && attackProgress < 0.7) {
    const trailGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, 32);
    trailGrad.addColorStop(0, 'rgba(254, 240, 138, 0.7)');
    trailGrad.addColorStop(0.6, 'rgba(239, 68, 68, 0.4)');
    trailGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = trailGrad;
    ctx.beginPath();
    ctx.arc(10, 0, 26, -0.6, 1.4);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();
  }

  // 8.2. Pulso de flash mágico no ápice do ataque do Mago
  if (isAttacking && rpgClass === 'mage' && attackProgress > 0.45 && attackProgress < 0.75) {
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(2, -22, 14 * Math.sin((attackProgress - 0.45) / 0.3 * Math.PI), 0, Math.PI * 2);
    ctx.stroke();
  }

  const weaponKey = loadout.weapon?.visualAssetKey;
  if (weaponKey === 'blade_iron') {
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(0, -2.5, 22, 5);
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(2, -1.5, 18, 1.5);
    ctx.fillStyle = '#334155';
    ctx.fillRect(-2, -5, 4, 10);
  } else if (weaponKey === 'blade_thermal') {
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(0, -3, 25, 6);
    ctx.fillStyle = '#FEF08A';
    ctx.fillRect(2, -1.5, 20, 3);
    ctx.fillStyle = '#F97316';
    ctx.fillRect(-2, -6, 5, 12);
  } else if (weaponKey === 'blade_quantum') {
    ctx.fillStyle = '#C084FC';
    ctx.fillRect(0, -4, 26, 3);
    ctx.fillRect(0, 1, 26, 3);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(3, -1, 20, 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(-2, -7, 5, 14);
  } else if (weaponKey === 'bow_fiber') {
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(4, 0, 13, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.strokeStyle = '#6EE7B7';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(4, -13);
    ctx.lineTo(4, 13);
    ctx.stroke();
  } else if (weaponKey === 'bow_plasma') {
    ctx.strokeStyle = '#EC4899';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(2, -15);
    ctx.lineTo(9, 0);
    ctx.lineTo(2, 15);
    ctx.stroke();
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(8, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (weaponKey === 'staff_compiler') {
    ctx.fillStyle = '#64748B';
    ctx.fillRect(0, -16, 3.5, 30);
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(1.5, -18, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1;
    ctx.strokeRect(-2, -22, 7, 8);
  } else if (weaponKey === 'staff_singularity') {
    ctx.fillStyle = '#4338CA';
    ctx.fillRect(0, -18, 4, 32);
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(2, -20, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#C084FC';
    ctx.beginPath();
    ctx.arc(2, -20, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-4, -26, 12, 12);
  } else {
    if (rpgClass === 'warrior') {
      ctx.fillStyle = classColor;
      ctx.fillRect(0, -3, 24, 5);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(2, -2, 20, 2);
      ctx.fillStyle = '#3F3F46';
      ctx.fillRect(-2, -6, 4, 11);
    } else if (rpgClass === 'archer') {
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

  const timeSec = Date.now() / 1000;

  for (const obs of obstacles) {
    ctx.save();
    ctx.translate(obs.x, obs.y);

    const r = obs.radius;
    const runeColor = obs.runeColor || '#38BDF8';
    const structType = obs.structureType || 'pillar';

    // ─── 1. SOMBRA PROJETADA NO CHÃO ───
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.45, r * 1.15, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    if (structType === 'altar') {
      // 🏛️ SANTUÁRIO / ALTAR MÁSTICO CENTRAL (Cripta)
      // Base octogonal de granito polido
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        const px = Math.cos(ang) * r;
        const py = Math.sin(ang) * (r * 0.7);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Disco rúnico interno
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.65, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cristal de dados flutuante no centro do altar
      const floatY = -14 + Math.sin(timeSec * 2.5) * 5;
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, floatY - 16);
      ctx.lineTo(11, floatY);
      ctx.lineTo(0, floatY + 16);
      ctx.lineTo(-11, floatY);
      ctx.closePath();
      ctx.fill();

      // Núcleo brilhante do cristal
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, floatY - 9);
      ctx.lineTo(5, floatY);
      ctx.lineTo(0, floatY + 9);
      ctx.lineTo(-5, floatY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

    } else if (structType === 'magma_crucible') {
      // 🌋 CADINHO DE MAGMA PRIMORDIAL (Forja)
      // Anel de contenção em aço escovado reforçado
      ctx.fillStyle = '#1c0a0a';
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Borda com rebites de titânio
      ctx.fillStyle = '#450a0a';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.78, 0, Math.PI * 2);
      ctx.fill();

      // Poço de Magma Incandescente pulsante
      const lavaPulse = Math.sin(timeSec * 3) * 3;
      const lavaGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, r * 0.65);
      lavaGrad.addColorStop(0, '#fef08a');
      lavaGrad.addColorStop(0.5, '#f97316');
      lavaGrad.addColorStop(0.85, '#dc2626');
      lavaGrad.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = lavaGrad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.6 + lavaPulse, 0, Math.PI * 2);
      ctx.fill();

      // Bolhas de plasma estourando
      const bubbleAng = timeSec * 4;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(Math.cos(bubbleAng) * 14, Math.sin(bubbleAng) * 14, 3, 0, Math.PI * 2);
      ctx.fill();

    } else if (structType === 'quantum_resonator') {
      // ⚛️ RESSONADOR QUÂNTICO (Núcleo Quântico)
      // Esfera de singularidade negra central com anéis de luz orbitais
      ctx.fillStyle = '#0a0618';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Anéis de confinamento em rotação contínua
      ctx.save();
      ctx.rotate(timeSec * 1.5);
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.95, r * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate(-timeSec * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.95, r * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Núcleo de Singularidade Violeta
      ctx.fillStyle = '#c084fc';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

    } else if (structType === 'wall_segment') {
      // 🧱 SEGMENTO DE MURALHA FORTIFICADA (Alvenaria / Chapa contígua)
      const w = r * 1.7;
      const h = r * 1.3;

      // Bloco de sustentação
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeRect(-w / 2, -h / 2, w, h);

      // Topo chanfrado iluminado
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-w / 2 + 3, -h / 2 + 3, w - 6, h * 0.45);

      // Ranhura rúnica central sutil de reforço
      ctx.strokeStyle = runeColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 6, 2);
      ctx.lineTo(w / 2 - 6, 2);
      ctx.stroke();

    } else if (structType === 'data_terminal') {
      // 💻 TERMINAL DE DADOS / PAINEL TÁTICO
      const w = r * 1.4;
      const h = r * 1.4;

      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeRect(-w / 2, -h / 2, w, h);

      // Tela ciano do monitor de dados
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(-w / 2 + 4, -h / 2 + 4, w - 8, h * 0.5);

      // Linhas de código / osciloscópio
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 7, -h / 2 + 10);
      ctx.lineTo(w / 2 - 7, -h / 2 + 10);
      ctx.moveTo(-w / 2 + 7, -h / 2 + 16);
      ctx.lineTo(w / 2 - 12, -h / 2 + 16);
      ctx.stroke();

    } else {
      // 🏛️ PILAR CLÁSSICO DE SUSTENTAÇÃO
      ctx.fillStyle = '#1e1b2e';
      ctx.strokeStyle = '#3b3254';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Topo facetado da coluna
      const grad = ctx.createLinearGradient(-r, -r, r, r);
      grad.addColorStop(0, '#3e375c');
      grad.addColorStop(1, '#1a162b');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, -3, r * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Runa neon mágica
      ctx.shadowColor = runeColor;
      ctx.shadowBlur = 8;
      ctx.fillStyle = runeColor;
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(5, -4);
      ctx.lineTo(0, 3);
      ctx.lineTo(-5, -4);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Rótulo textual do marco (se houver, ex: Santuário de Memória)
    if (obs.label) {
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 6;
      ctx.fillText(obs.label, 0, -r - 12);
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }
}

function drawDynamicLighting(ctx: CanvasRenderingContext2D, sim: ByteQuestSimulation) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  // 1. Luz radial principal ao redor do herói (brilho da tela CRT e aura)
  const heroLightRadius = 240 + Math.sin(Date.now() * 0.004) * 15;
  const heroGrad = ctx.createRadialGradient(
    sim.heroX,
    sim.heroY,
    10,
    sim.heroX,
    sim.heroY,
    heroLightRadius
  );
  heroGrad.addColorStop(0, 'rgba(74, 222, 128, 0.22)');
  heroGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.12)');
  heroGrad.addColorStop(0.7, 'rgba(139, 92, 246, 0.05)');
  heroGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = heroGrad;
  ctx.beginPath();
  ctx.arc(sim.heroX, sim.heroY, heroLightRadius, 0, Math.PI * 2);
  ctx.fill();

  // 2. Pontos de luz suaves sobre orbes orbitais
  if (sim.upgrades.orbitalCount > 0) {
    const orbitRadius = 65;
    for (let i = 0; i < sim.upgrades.orbitalCount; i++) {
      const angle = (sim as any).orbitalAngle + (i * Math.PI * 2) / sim.upgrades.orbitalCount;
      const ox = sim.heroX + Math.cos(angle) * orbitRadius;
      const oy = sim.heroY + Math.sin(angle) * orbitRadius;

      const orbGrad = ctx.createRadialGradient(ox, oy, 2, ox, oy, 40);
      orbGrad.addColorStop(0, 'rgba(192, 132, 252, 0.3)');
      orbGrad.addColorStop(1, 'rgba(192, 132, 252, 0)');
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(ox, oy, 40, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 3. Brilho dos projéteis especiais no chão
  for (let i = 0; i < Math.min(12, sim.projectiles.length); i++) {
    const p = sim.projectiles[i];
    const pGrad = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, 35);
    pGrad.addColorStop(0, 'rgba(250, 204, 21, 0.25)');
    pGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 35, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
