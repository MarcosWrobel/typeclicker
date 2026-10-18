// ─────────────────────────────────────────────────────────────
// Renderizador Gráfico GPU (PixiJS v8) — ByteQuest Arena
// Suporta Sprites, AnimatedSprites, Shaders e Gráficos Híbridos
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Text, TextStyle, BlurFilter } from 'pixi.js';
import { ByteQuestSimulation } from './byteQuestEngine';
import { RpgClassType } from '../../../types/rpgClass';
import { HeroLoadout, BIOMES_DATA } from '../../../types/byteQuest';
import { ByteQuestSpriteManager } from './ByteQuestSpriteManager';

export interface ByteQuestPixiArenaProps {
  simulation: ByteQuestSimulation;
  rpgClass: RpgClassType;
  loadout: HeroLoadout;
  isPaused?: boolean;
}

export const ByteQuestPixiArena: React.FC<ByteQuestPixiArenaProps> = ({
  simulation,
  rpgClass,
  loadout,
  isPaused = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const spriteManagerRef = useRef<ByteQuestSpriteManager | null>(null);

  useEffect(() => {
    let isMounted = true;
    let app: Application | null = null;

    const initPixi = async () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const initialWidth = container.clientWidth || 1000;
      const initialHeight = container.clientHeight || 640;

      app = new Application();
      await app.init({
        width: initialWidth,
        height: initialHeight,
        backgroundColor: 0x07080c,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        antialias: true
      });

      if (!isMounted) {
        app.destroy(true, { children: true });
        return;
      }

      appRef.current = app;
      container.appendChild(app.canvas);

      // Inicializa o Gerenciador de Sprites
      const spriteManager = new ByteQuestSpriteManager(app);
      await spriteManager.initialize();
      spriteManagerRef.current = spriteManager;

      // ─── HIERARQUIA DE CAMADAS NO SCENE GRAPH ───
      const stage = app.stage;

      // Container do Mundo (sujeito à câmera e screen shake)
      const worldContainer = new Container();
      stage.addChild(worldContainer);

      // Camadas internas do mundo
      const bgGraphics = new Graphics();
      worldContainer.addChild(bgGraphics);

      const shockwaveGraphics = new Graphics();
      worldContainer.addChild(shockwaveGraphics);

      const obstacleGraphics = new Graphics();
      worldContainer.addChild(obstacleGraphics);

      const gemGraphics = new Graphics();
      worldContainer.addChild(gemGraphics);

      const enemyContainer = new Container();
      worldContainer.addChild(enemyContainer);

      const projectileGraphics = new Graphics();
      worldContainer.addChild(projectileGraphics);

      const slashGraphics = new Graphics();
      worldContainer.addChild(slashGraphics);

      const heroGraphics = new Graphics();
      worldContainer.addChild(heroGraphics);

      const particleGraphics = new Graphics();
      worldContainer.addChild(particleGraphics);

      const textGraphics = new Graphics();
      worldContainer.addChild(textGraphics);

      // Camada de HUD estático na tela (Bússola de Borda)
      const uiGraphics = new Graphics();
      stage.addChild(uiGraphics);

      // Cache de textos flutuantes dos inimigos
      const enemyTextMap = new Map<string, Text>();

      // ─── TICKER PRINCIPAL DE RENDERIZAÇÃO GPU ───
      let lastTime = performance.now();

      app.ticker.add(() => {
        if (!isMounted) return;

        const now = performance.now();
        const dt = Math.min(0.1, (now - lastTime) / 1000);
        lastTime = now;

        const curWidth = container.clientWidth || 1000;
        const curHeight = container.clientHeight || 640;

        if (app && (app.screen.width !== curWidth || app.screen.height !== curHeight)) {
          app.renderer.resize(curWidth, curHeight);
        }

        // Se pausado, não atualiza simulação
        if (!isPaused) {
          simulation.update(dt, curWidth, curHeight);
        }

        // 1. Aplica Câmera com interpolação e Screen Shake
        const camX = simulation.cameraX - (simulation.screenShake?.offsetX || 0);
        const camY = simulation.cameraY - (simulation.screenShake?.offsetY || 0);
        worldContainer.x = -camX;
        worldContainer.y = -camY;

        // 2. Renderiza Bioma e Grid do Mundo
        bgGraphics.clear();
        const biome = BIOMES_DATA[simulation.currentBiome];
        bgGraphics.rect(0, 0, simulation.worldWidth, simulation.worldHeight);
        bgGraphics.fill({ color: Number(biome.floorColor.replace('#', '0x')) });

        // Grade sutil do bioma
        const gridSize = 80;
        const gridColor = Number(biome.runeColor.replace('#', '0x'));
        for (let x = 0; x <= simulation.worldWidth; x += gridSize) {
          bgGraphics.moveTo(x, 0);
          bgGraphics.lineTo(x, simulation.worldHeight);
          bgGraphics.stroke({ color: gridColor, width: 1, alpha: 0.35 });
        }
        for (let y = 0; y <= simulation.worldHeight; y += gridSize) {
          bgGraphics.moveTo(0, y);
          bgGraphics.lineTo(simulation.worldWidth, y);
          bgGraphics.stroke({ color: gridColor, width: 1, alpha: 0.35 });
        }

        // Borda do Mundo
        bgGraphics.rect(0, 0, simulation.worldWidth, simulation.worldHeight);
        bgGraphics.stroke({ color: Number(biome.runeColor.replace('#', '0x')), width: 4, alpha: 0.7 });

        // Portal do Bioma (se ativo)
        if (simulation.biomePortal && simulation.biomePortal.active) {
          const bp = simulation.biomePortal;
          const pulse = (Math.sin(now * 0.005) + 1) * 0.5;
          bgGraphics.circle(bp.x, bp.y, bp.radius + pulse * 6);
          bgGraphics.stroke({ color: 0x38bdf8, width: 3 });
          bgGraphics.circle(bp.x, bp.y, bp.radius * 0.6);
          bgGraphics.fill({ color: 0x0284c7, alpha: 0.5 });
        }

        // 3. Shockwaves
        shockwaveGraphics.clear();
        for (const sw of simulation.shockwaves) {
          shockwaveGraphics.circle(sw.x, sw.y, Math.max(1, sw.radius));
          shockwaveGraphics.stroke({
            color: Number(sw.color.replace('#', '0x')),
            width: sw.lineWidth,
            alpha: Math.max(0, sw.alpha)
          });
        }

        // 4. Obstáculos procedurais do Bioma
        obstacleGraphics.clear();
        for (const obs of simulation.obstacles) {
          obstacleGraphics.circle(obs.x, obs.y + 4, obs.radius);
          obstacleGraphics.fill({ color: 0x000000, alpha: 0.4 }); // Sombra
          obstacleGraphics.circle(obs.x, obs.y, obs.radius);
          obstacleGraphics.fill({ color: 0x1e293b });
          obstacleGraphics.stroke({ color: Number(biome.runeColor.replace('#', '0x')), width: 2, alpha: 0.8 });
        }

        // 5. Gemas de XP
        gemGraphics.clear();
        for (const gem of simulation.gems) {
          gemGraphics.poly([
            { x: gem.x, y: gem.y - 6 },
            { x: gem.x + 5, y: gem.y },
            { x: gem.x, y: gem.y + 6 },
            { x: gem.x - 5, y: gem.y }
          ]);
          gemGraphics.fill({ color: 0x38bdf8 });
          gemGraphics.stroke({ color: 0xffffff, width: 1 });
        }

        // 6. Inimigos & Palavras de Digitação
        // Limpa e redesenha na camada de inimigos
        enemyContainer.removeChildren();
        const enemyG = new Graphics();
        enemyContainer.addChild(enemyG);

        for (const enemy of simulation.enemies) {
          const isLocked = simulation.lockedEnemyId === enemy.id;
          const isFlashing = enemy.hitFlashTimer && enemy.hitFlashTimer > 0;
          const eColor = isFlashing ? 0xffffff : Number(enemy.color.replace('#', '0x'));

          // Sombra do inimigo
          enemyG.ellipse(enemy.x, enemy.y + enemy.height * 0.4, enemy.width * 0.4, 6);
          enemyG.fill({ color: 0x000000, alpha: 0.45 });

          // Corpo do inimigo
          if (enemy.isBoss) {
            enemyG.star(enemy.x, enemy.y, 6, enemy.width * 0.5, enemy.width * 0.3);
            enemyG.fill({ color: eColor });
            enemyG.stroke({ color: isLocked ? 0xfacc15 : 0xf59e0b, width: 3 });
          } else if (enemy.type === 'slime') {
            enemyG.circle(enemy.x, enemy.y, enemy.width * 0.45);
            enemyG.fill({ color: eColor });
            enemyG.circle(enemy.x - 4, enemy.y - 2, 2.5);
            enemyG.circle(enemy.x + 4, enemy.y - 2, 2.5);
            enemyG.fill({ color: 0xdc2626 });
          } else if (enemy.type === 'skeleton') {
            enemyG.roundRect(enemy.x - enemy.width * 0.35, enemy.y - enemy.height * 0.4, enemy.width * 0.7, enemy.height * 0.8, 4);
            enemyG.fill({ color: eColor });
          } else {
            enemyG.circle(enemy.x, enemy.y, enemy.width * 0.45);
            enemyG.fill({ color: eColor });
          }

          // Barra de Vida
          const hpRatio = Math.max(0, enemy.hp / enemy.maxHp);
          const barW = Math.max(30, enemy.width);
          const barY = enemy.y - enemy.height * 0.5 - 10;
          enemyG.rect(enemy.x - barW / 2, barY, barW, 4);
          enemyG.fill({ color: 0x000000, alpha: 0.7 });
          enemyG.rect(enemy.x - barW / 2, barY, barW * hpRatio, 4);
          enemyG.fill({ color: enemy.isBoss ? 0xf59e0b : 0xef4444 });

          // Palavra Flutuante de Digitação
          if (enemy.word) {
            let label = enemyTextMap.get(enemy.id);
            if (!label) {
              label = new Text({
                text: enemy.word,
                style: new TextStyle({
                  fontFamily: 'monospace',
                  fontSize: isLocked ? 14 : 12,
                  fontWeight: 'bold',
                  fill: isLocked ? 0xfacc15 : 0xffffff,
                  stroke: { color: 0x000000, width: 3 }
                })
              });
              label.anchor.set(0.5, 1);
              enemyTextMap.set(enemy.id, label);
            }
            label.text = enemy.word;
            label.style.fill = isLocked ? 0xfacc15 : 0xffffff;
            label.x = enemy.x;
            label.y = barY - 4;
            enemyContainer.addChild(label);
          }
        }

        // Limpa palavras de inimigos derrotados do cache
        for (const [id, textNode] of enemyTextMap.entries()) {
          if (!simulation.enemies.some((e) => e.id === id)) {
            textNode.destroy();
            enemyTextMap.delete(id);
          }
        }

        // 7. Projéteis
        projectileGraphics.clear();
        for (const p of simulation.projectiles) {
          projectileGraphics.circle(p.x, p.y, p.radius);
          projectileGraphics.fill({ color: Number(p.color.replace('#', '0x')) });
          projectileGraphics.stroke({ color: 0xffffff, width: 1.5 });
        }

        for (const ep of simulation.enemyProjectiles) {
          projectileGraphics.circle(ep.x, ep.y, ep.radius);
          projectileGraphics.fill({ color: Number(ep.color.replace('#', '0x')) });
          projectileGraphics.stroke({ color: 0xffffff, width: 1.5 });
        }

        // 8. Corte Melee do Guerreiro
        slashGraphics.clear();
        if (simulation.meleeSlashTimer > 0) {
          const progress = 1 - simulation.meleeSlashTimer / 0.22;
          const angle = simulation.meleeSlashAngle;
          slashGraphics.arc(simulation.heroX, simulation.heroY, 70, angle - 0.9, angle + 0.9);
          slashGraphics.stroke({
            color: 0xfacc15,
            width: 8 * (1 - progress),
            alpha: 1 - progress
          });
        }

        // 9. Herói Bytezinho com Animações Dinâmicas de Ataque
        heroGraphics.clear();
        const { heroX, heroY, heroRadius, runCycle } = simulation;
        const isAttacking = simulation.heroAttackTimer > 0;
        const attackProgress = isAttacking ? 1 - simulation.heroAttackTimer / (simulation.heroAttackDuration || 0.22) : 0;
        const facingSign = simulation.heroFacing === 'left' ? -1 : 1;

        let lungeX = 0;
        let lungeY = 0;
        if (isAttacking) {
          if (rpgClass === 'warrior') {
            lungeX = facingSign * 14 * Math.sin(attackProgress * Math.PI);
          } else if (rpgClass === 'archer') {
            lungeX = -facingSign * 6 * Math.sin(attackProgress * Math.PI);
          } else {
            lungeY = -10 * Math.sin(attackProgress * Math.PI);
          }
        }

        const bobY = Math.sin(runCycle * 2) * 3 + lungeY;
        const hX = heroX + lungeX;
        const hY = heroY;

        // Sombra do herói
        heroGraphics.ellipse(hX, hY + 22, heroRadius * 0.9, 6);
        heroGraphics.fill({ color: 0x000000, alpha: 0.5 });

        // Aura de Classe ou Quântica
        const auraColor = loadout.weapon?.rarity === 'quantum' ? 0xc084fc : rpgClass === 'mage' ? 0x8b5cf6 : rpgClass === 'archer' ? 0x10b981 : 0xef4444;
        heroGraphics.circle(hX, hY + bobY, heroRadius);
        heroGraphics.stroke({ color: auraColor, width: 2, alpha: 0.65 });

        // Tronco do Bytezinho
        heroGraphics.roundRect(hX - 9, hY + 4 + bobY, 18, 15, 3);
        heroGraphics.fill({ color: 0x16a34a });

        // Monitor CRT da Cabeça
        heroGraphics.roundRect(hX - 15, hY - 17 + bobY, 30, 22, 5);
        heroGraphics.fill({ color: 0x22c55e });
        heroGraphics.stroke({ color: 0x15803d, width: 2 });

        // Tela CRT Escura
        heroGraphics.roundRect(hX - 12, hY - 14 + bobY, 24, 16, 3);
        heroGraphics.fill({ color: 0x052e16 });

        // Olhos de LED
        const eyeColor = isAttacking ? 0xfacc15 : 0x6ee7b7;
        heroGraphics.rect(hX - 6, hY - 8 + bobY, 3, 5);
        heroGraphics.rect(hX + 3, hY - 8 + bobY, 3, 5);
        heroGraphics.fill({ color: eyeColor });

        // 10. Partículas
        particleGraphics.clear();
        for (const p of simulation.particles) {
          particleGraphics.circle(p.x, p.y, p.size);
          particleGraphics.fill({ color: Number(p.color.replace('#', '0x')), alpha: Math.max(0, p.alpha) });
        }

        // 11. Bússola de Borda de Tela (HUD)
        uiGraphics.clear();
        for (const enemy of simulation.enemies) {
          if (enemy.isBoss || simulation.lockedEnemyId === enemy.id) {
            const screenX = enemy.x - camX;
            const screenY = enemy.y - camY;
            const pad = 24;

            if (screenX < pad || screenX > curWidth - pad || screenY < pad || screenY > curHeight - pad) {
              const edgeX = Math.max(pad, Math.min(curWidth - pad, screenX));
              const edgeY = Math.max(pad, Math.min(curHeight - pad, screenY));
              uiGraphics.circle(edgeX, edgeY, enemy.isBoss ? 8 : 5);
              uiGraphics.fill({ color: enemy.isBoss ? 0xf59e0b : 0xfacc15 });
              uiGraphics.stroke({ color: 0xffffff, width: 1.5 });
            }
          }
        }
      });
    };

    initPixi();

    return () => {
      isMounted = false;
      if (spriteManagerRef.current) {
        spriteManagerRef.current.destroy();
        spriteManagerRef.current = null;
      }
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [simulation, rpgClass, loadout, isPaused]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[580px] max-h-[820px] bg-[#07080c] overflow-hidden rounded-xl border border-violet-900/40 shadow-2xl"
    />
  );
};
