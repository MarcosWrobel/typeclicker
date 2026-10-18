// ─────────────────────────────────────────────────────────────
// Gerenciador de Sprites & Texturas — ByteQuest (PixiJS v8)
// Suporta tanto Texturas Procedurais de alta fidelidade quanto
// Carregamento de Spritesheets (Aseprite / TexturePacker JSON + PNG)
// ─────────────────────────────────────────────────────────────

import { Application, Assets, Container, Graphics, Sprite, Texture, AnimatedSprite } from 'pixi.js';
import { RpgClassType } from '../../../types/rpgClass';
import { CombatEnemy, HeroLoadout } from '../../../types/byteQuest';

export interface EntityAnimationSet {
  idle: Texture[];
  walk: Texture[];
  attack?: Texture[];
  hurt?: Texture[];
}

export class ByteQuestSpriteManager {
  private app: Application;
  private proceduralTextures: Map<string, Texture> = new Map();
  private loadedSpritesheets: Map<string, any> = new Map();

  constructor(app: Application) {
    this.app = app;
  }

  /**
   * Inicializa e pré-gera texturas procedurais básicas para garantir que o jogo
   * funcione imediatamente com 0 ms de carregamento, mesmo antes de spritesheets externos.
   */
  public async initialize(): Promise<void> {
    this.generateProceduralGems();
    this.generateProceduralProjectiles();
  }

  /**
   * Carrega um Spritesheet (Aseprite / TexturePacker JSON) dinamicamente
   * Ex: loadSpritesheet('hero_warrior', '/assets/bytequest/warrior.json')
   */
  public async loadSpritesheet(alias: string, jsonUrl: string): Promise<boolean> {
    try {
      const sheet = await Assets.load(jsonUrl);
      if (sheet) {
        this.loadedSpritesheets.set(alias, sheet);
        return true;
      }
    } catch (err) {
      console.warn(`[ByteQuestSpriteManager] Spritesheet ${alias} não encontrado em ${jsonUrl}. Usando fallback procedural.`);
    }
    return false;
  }

  /**
   * Obtém um AnimatedSprite para uma entidade com base no estado e na classe
   */
  public getEnemyTextures(enemyType: string): EntityAnimationSet {
    // Se temos um spritesheet externo carregado
    const sheet = this.loadedSpritesheets.get(enemyType);
    if (sheet && sheet.animations) {
      return {
        idle: sheet.animations.idle || [sheet.textures[Object.keys(sheet.textures)[0]]],
        walk: sheet.animations.walk || sheet.animations.run || [sheet.textures[Object.keys(sheet.textures)[0]]],
        attack: sheet.animations.attack,
        hurt: sheet.animations.hurt
      };
    }

    // Fallback para texturas geradas proceduralmente no Pixi
    return this.getProceduralEnemyTextures(enemyType);
  }

  /**
   * Gera texturas procedurais para inimigos utilizando Graphics do Pixi
   */
  private getProceduralEnemyTextures(enemyType: string): EntityAnimationSet {
    const key = `enemy_${enemyType}`;
    if (!this.proceduralTextures.has(key)) {
      const g = new Graphics();
      if (enemyType === 'goblin') {
        g.circle(0, 0, 16);
        g.fill({ color: 0x22C55E });
        g.circle(-5, -3, 3);
        g.circle(5, -3, 3);
        g.fill({ color: 0xDC2626 });
      } else if (enemyType === 'skeleton') {
        g.roundRect(-14, -16, 28, 32, 6);
        g.fill({ color: 0xE2E8F0 });
        g.rect(-6, -6, 4, 6);
        g.rect(2, -6, 4, 6);
        g.fill({ color: 0x0F172A });
      } else if (enemyType === 'slime') {
        g.ellipse(0, 4, 18, 12);
        g.fill({ color: 0x38BDF8 });
        g.circle(-4, 0, 2.5);
        g.circle(4, 0, 2.5);
        g.fill({ color: 0xFFFFFF });
      } else if (enemyType === 'magma_golem') {
        g.roundRect(-20, -22, 40, 44, 8);
        g.fill({ color: 0x7F1D1D });
        g.rect(-10, -6, 20, 4);
        g.fill({ color: 0xF97316 });
      } else if (enemyType === 'quantum_orb') {
        g.circle(0, 0, 18);
        g.fill({ color: 0x7C3AED, alpha: 0.8 });
        g.circle(0, 0, 8);
        g.fill({ color: 0xC084FC });
      } else {
        // Boss / Miniboss fallback
        g.star(0, 0, 6, 24, 14);
        g.fill({ color: 0xF59E0B });
      }

      const tex = this.app.renderer.generateTexture(g);
      this.proceduralTextures.set(key, tex);
      g.destroy();
    }

    const baseTex = this.proceduralTextures.get(key)!;
    return {
      idle: [baseTex],
      walk: [baseTex]
    };
  }

  /**
   * Gera textura procedural de projéteis
   */
  private generateProceduralProjectiles(): void {
    const pG = new Graphics();
    pG.circle(0, 0, 6);
    pG.fill({ color: 0x34D399 });
    pG.stroke({ color: 0xFFFFFF, width: 1.5 });
    this.proceduralTextures.set('projectile_arrow', this.app.renderer.generateTexture(pG));
    pG.destroy();

    const mG = new Graphics();
    mG.circle(0, 0, 8);
    mG.fill({ color: 0xC084FC });
    mG.circle(0, 0, 4);
    mG.fill({ color: 0xFFFFFF });
    this.proceduralTextures.set('projectile_orb', this.app.renderer.generateTexture(mG));
    mG.destroy();
  }

  /**
   * Gera texturas procedurais das gemas de XP
   */
  private generateProceduralGems(): void {
    const g = new Graphics();
    g.poly([
      { x: 0, y: -8 },
      { x: 7, y: 0 },
      { x: 0, y: 8 },
      { x: -7, y: 0 }
    ]);
    g.fill({ color: 0x38BDF8 });
    g.stroke({ color: 0xFFFFFF, width: 1 });
    this.proceduralTextures.set('gem_blue', this.app.renderer.generateTexture(g));
    g.destroy();
  }

  public getTexture(key: string): Texture | undefined {
    return this.proceduralTextures.get(key);
  }

  public destroy(): void {
    this.proceduralTextures.forEach((tex) => tex.destroy(true));
    this.proceduralTextures.clear();
    this.loadedSpritesheets.clear();
  }
}
