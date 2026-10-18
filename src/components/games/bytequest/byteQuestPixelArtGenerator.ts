// ─────────────────────────────────────────────────────────────
// Gerador Procedural de Spritesheets & Tilesets Pixel Art (32x32)
// Gera texturas nítidas em canvas offscreen (Pixel Perfect)
// e registra automaticamente no ByteQuestSpriteEngine
// ─────────────────────────────────────────────────────────────

import { byteQuestSpriteEngine, SpriteSheetConfig } from './byteQuestSpriteEngine';

export class ByteQuestPixelArtGenerator {
  private static isInitialized = false;

  public static initializeAll(): void {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // 1. Gera Spritesheet do Herói Bytezinho (32x32, 6 frames)
    this.generateHeroSpriteSheet();

    // 2. Gera Spritesheets dos Inimigos (32x32)
    this.generateSlimeSpriteSheet();
    this.generateGoblinSpriteSheet();
    this.generateSkeletonSpriteSheet();

    // 3. Gera Tilesets dos Biomas (32x32, 4 tiles cada)
    this.generateBiomeTilesets();
  }

  /**
   * Bytezinho Herói (6 frames de 32x32):
   * 0: idle | 1: walk_1 | 2: walk_2 | 3: attack_prep | 4: attack_hit | 5: hurt
   */
  private static generateHeroSpriteSheet(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 32 * 6;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    for (let f = 0; f < 6; f++) {
      const ox = f * 32;
      const legOffset = f === 1 ? -2 : f === 2 ? 2 : 0;
      const armSwing = f === 3 ? -4 : f === 4 ? 6 : 0;
      const isHurt = f === 5;

      // Sombra
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(ox + 8, 28, 16, 3);

      // Botinhas
      ctx.fillStyle = '#18181B';
      ctx.fillRect(ox + 10 + legOffset, 24, 4, 5);
      ctx.fillRect(ox + 18 - legOffset, 24, 4, 5);

      // Tronco Robótico
      ctx.fillStyle = isHurt ? '#FFFFFF' : '#16A34A';
      ctx.fillRect(ox + 11, 17, 10, 8);
      ctx.fillStyle = '#EF4444'; // LED Peitoral
      ctx.fillRect(ox + 15, 20, 2, 2);

      // Braço Esquerdo
      ctx.fillStyle = '#15803D';
      ctx.fillRect(ox + 8, 18, 3, 6);

      // Braço Direito (Arma)
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(ox + 21 + armSwing, 18, 3, 6);

      // Monitor CRT Verde (Cabeça)
      ctx.fillStyle = isHurt ? '#FFFFFF' : '#22C55E';
      ctx.fillRect(ox + 7, 4, 18, 14);
      ctx.fillStyle = '#15803D'; // Contorno CRT
      ctx.strokeRect(ox + 7.5, 4.5, 17, 13);

      // Tela CRT Escura
      ctx.fillStyle = isHurt ? '#DC2626' : '#052E16';
      ctx.fillRect(ox + 10, 7, 12, 8);

      // Olhos de LED
      ctx.fillStyle = isHurt ? '#FFFFFF' : f === 4 ? '#FACC15' : '#6EE7B7';
      if (f === 4) {
        // Olhar afiado de ataque
        ctx.fillRect(ox + 11, 9, 3, 2);
        ctx.fillRect(ox + 18, 9, 3, 2);
      } else {
        ctx.fillRect(ox + 12, 9, 2, 4);
        ctx.fillRect(ox + 18, 9, 2, 4);
      }

      // Sorriso no monitor
      if (!isHurt && f !== 4) {
        ctx.fillStyle = '#4ADE80';
        ctx.fillRect(ox + 14, 13, 4, 1);
      }
    }

    const config: SpriteSheetConfig = {
      frameWidth: 32,
      frameHeight: 32,
      framesPerRow: 6,
      animations: {
        idle: { startFrame: 0, endFrame: 0, fps: 1 },
        walk: { startFrame: 0, endFrame: 2, fps: 8, loop: true },
        attack: { startFrame: 3, endFrame: 4, fps: 10, loop: false },
        hurt: { startFrame: 5, endFrame: 5, fps: 6, loop: false }
      }
    };

    byteQuestSpriteEngine.registerImageCanvas('hero_base', canvas, config);
  }

  /**
   * Slime de Dados (3 frames de 32x32):
   * 0: idle | 1: squish | 2: bounce
   */
  private static generateSlimeSpriteSheet(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 32 * 3;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // Frame 0: Idle normal
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(16, 18, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#047857';
    ctx.strokeRect(6.5, 9.5, 19, 17);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(12, 14, 2, 3);
    ctx.fillRect(18, 14, 2, 3);

    // Frame 1: Squish achatado
    const ox1 = 32;
    ctx.fillStyle = '#10B981';
    ctx.fillRect(ox1 + 4, 18, 24, 10);
    ctx.fillStyle = '#047857';
    ctx.strokeRect(ox1 + 4.5, 18.5, 23, 9);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(ox1 + 10, 20, 3, 2);
    ctx.fillRect(ox1 + 19, 20, 3, 2);

    // Frame 2: Bounce esticado
    const ox2 = 64;
    ctx.fillStyle = '#10B981';
    ctx.fillRect(ox2 + 9, 8, 14, 20);
    ctx.fillStyle = '#047857';
    ctx.strokeRect(ox2 + 9.5, 8.5, 13, 19);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(ox2 + 12, 12, 2, 4);
    ctx.fillRect(ox2 + 18, 12, 2, 4);

    const config: SpriteSheetConfig = {
      frameWidth: 32,
      frameHeight: 32,
      framesPerRow: 3,
      animations: {
        idle: { startFrame: 0, endFrame: 0, fps: 1 },
        walk: { startFrame: 0, endFrame: 2, fps: 6, loop: true }
      }
    };

    byteQuestSpriteEngine.registerImageCanvas('slime', canvas, config);
  }

  /**
   * Goblin Cibernético (4 frames de 32x32):
   * 0: idle | 1: run1 | 2: run2 | 3: attack
   */
  private static generateGoblinSpriteSheet(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 32 * 4;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    for (let f = 0; f < 4; f++) {
      const ox = f * 32;
      const runStep = f === 1 ? -2 : f === 2 ? 2 : 0;
      const isAttack = f === 3;

      // Sombra
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(ox + 8, 28, 16, 3);

      // Pernas
      ctx.fillStyle = '#78350F';
      ctx.fillRect(ox + 10 + runStep, 23, 4, 6);
      ctx.fillRect(ox + 18 - runStep, 23, 4, 6);

      // Tronco e armadura rústica
      ctx.fillStyle = '#047857';
      ctx.fillRect(ox + 11, 15, 10, 9);
      ctx.fillStyle = '#B45309';
      ctx.fillRect(ox + 10, 19, 12, 3);

      // Cabeça verde com orelhas pontudas
      ctx.fillStyle = '#10B981';
      ctx.fillRect(ox + 10, 6, 12, 10);
      // Orelha esquerda
      ctx.fillRect(ox + 5, 7, 5, 4);
      // Orelha direita
      ctx.fillRect(ox + 22, 7, 5, 4);

      // Olhos vermelhos cibernéticos
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(ox + 12, 9, 3, 2);
      ctx.fillRect(ox + 17, 9, 3, 2);

      // Lâmina / Adaga de sucata
      ctx.fillStyle = '#94A3B8';
      if (isAttack) {
        ctx.fillRect(ox + 23, 14, 8, 3);
        ctx.fillRect(ox + 29, 12, 2, 7);
      } else {
        ctx.fillRect(ox + 21, 16, 6, 2);
      }
    }

    const config: SpriteSheetConfig = {
      frameWidth: 32,
      frameHeight: 32,
      framesPerRow: 4,
      animations: {
        idle: { startFrame: 0, endFrame: 0, fps: 1 },
        walk: { startFrame: 0, endFrame: 2, fps: 8, loop: true },
        attack: { startFrame: 3, endFrame: 3, fps: 6, loop: false }
      }
    };

    byteQuestSpriteEngine.registerImageCanvas('goblin', canvas, config);
  }

  /**
   * Esqueleto Robótico (4 frames de 32x32):
   * 0: idle | 1: walk1 | 2: walk2 | 3: shoot
   */
  private static generateSkeletonSpriteSheet(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 32 * 4;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    for (let f = 0; f < 4; f++) {
      const ox = f * 32;
      const step = f === 1 ? -2 : f === 2 ? 2 : 0;
      const isShoot = f === 3;

      // Sombra
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(ox + 8, 28, 16, 3);

      // Pernas mecânicas
      ctx.fillStyle = '#64748B';
      ctx.fillRect(ox + 11 + step, 22, 3, 7);
      ctx.fillRect(ox + 18 - step, 22, 3, 7);

      // Coluna e Costelas de Titânio
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(ox + 14, 15, 4, 8);
      ctx.fillRect(ox + 10, 16, 12, 2);
      ctx.fillRect(ox + 11, 19, 10, 2);

      // Crânio Angular de Aço
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(ox + 9, 5, 14, 10);
      ctx.fillStyle = '#0F172A'; // Mandíbula
      ctx.fillRect(ox + 11, 12, 10, 3);

      // Visor Laser Ciano
      ctx.fillStyle = isShoot ? '#FACC15' : '#38BDF8';
      ctx.fillRect(ox + 11, 8, 10, 2);

      // Canhão / Braço Atirador
      if (isShoot) {
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(ox + 23, 14, 8, 4);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(ox + 29, 15, 2, 2);
      }
    }

    const config: SpriteSheetConfig = {
      frameWidth: 32,
      frameHeight: 32,
      framesPerRow: 4,
      animations: {
        idle: { startFrame: 0, endFrame: 0, fps: 1 },
        walk: { startFrame: 0, endFrame: 2, fps: 6, loop: true },
        attack: { startFrame: 3, endFrame: 3, fps: 6, loop: false }
      }
    };

    byteQuestSpriteEngine.registerImageCanvas('skeleton', canvas, config);
  }

  /**
   * Tilesets dos 3 Biomas (Cripta, Forja, Núcleo Quântico)
   * Cada um tem 4 tiles de 32x32:
   * 0: Piso base homogêneo e limpo (90% do mapa)
   * 1: Variação suave de pedra/aço/silício (8%)
   * 2: Detalhe sutil e discreto (2%)
   * 3: Variação complementar suave (1%)
   */
  private static generateBiomeTilesets(): void {
    // ─── 1. CRIPTA SOMBRIA (tileset_crypt) ───
    const cryptCanvas = document.createElement('canvas');
    cryptCanvas.width = 128;
    cryptCanvas.height = 32;
    const cCtx = cryptCanvas.getContext('2d');
    if (cCtx) {
      cCtx.imageSmoothingEnabled = false;

      // Tile 0: Lajota limpa e padronizada de pedra escura
      cCtx.fillStyle = '#0a0d14';
      cCtx.fillRect(0, 0, 32, 32);
      cCtx.fillStyle = '#0f1420';
      cCtx.fillRect(1, 1, 30, 30);
      cCtx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      cCtx.strokeRect(0.5, 0.5, 31, 31);

      // Tile 1: Lajota com leve chanfro de profundidade
      cCtx.fillStyle = '#0a0d14';
      cCtx.fillRect(32, 0, 32, 32);
      cCtx.fillStyle = '#111726';
      cCtx.fillRect(33, 1, 30, 30);
      cCtx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
      cCtx.strokeRect(32.5, 0.5, 31, 31);
      cCtx.fillStyle = 'rgba(2, 6, 23, 0.4)';
      cCtx.fillRect(33, 30, 30, 1);

      // Tile 2: Runa antiga apagada / sulco sutil
      cCtx.fillStyle = '#0a0d14';
      cCtx.fillRect(64, 0, 32, 32);
      cCtx.fillStyle = '#0f1420';
      cCtx.fillRect(65, 1, 30, 30);
      cCtx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      cCtx.strokeRect(64.5, 0.5, 31, 31);
      cCtx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
      cCtx.lineWidth = 1;
      cCtx.strokeRect(74.5, 10.5, 11, 11);

      // Tile 3: Pequeno musgo escuro no canto
      cCtx.fillStyle = '#0a0d14';
      cCtx.fillRect(96, 0, 32, 32);
      cCtx.fillStyle = '#0f1420';
      cCtx.fillRect(97, 1, 30, 30);
      cCtx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      cCtx.strokeRect(96.5, 0.5, 31, 31);
      cCtx.fillStyle = 'rgba(6, 78, 59, 0.3)';
      cCtx.fillRect(100, 22, 6, 5);

      byteQuestSpriteEngine.registerTileset('crypt', cryptCanvas, 32);
    }

    // ─── 2. FORJA DO CAOS (tileset_forge) ───
    const forgeCanvas = document.createElement('canvas');
    forgeCanvas.width = 128;
    forgeCanvas.height = 32;
    const fCtx = forgeCanvas.getContext('2d');
    if (fCtx) {
      fCtx.imageSmoothingEnabled = false;

      // Tile 0: Chapa de aço escovado escuro padronizada
      fCtx.fillStyle = '#140808';
      fCtx.fillRect(0, 0, 32, 32);
      fCtx.fillStyle = '#1c0d0d';
      fCtx.fillRect(1, 1, 30, 30);
      fCtx.strokeStyle = 'rgba(69, 10, 10, 0.4)';
      fCtx.strokeRect(0.5, 0.5, 31, 31);
      // Rebites discretos
      fCtx.fillStyle = '#2d1212';
      fCtx.fillRect(3, 3, 2, 2);
      fCtx.fillRect(27, 3, 2, 2);
      fCtx.fillRect(3, 27, 2, 2);
      fCtx.fillRect(27, 27, 2, 2);

      // Tile 1: Chapa metálica com ranhura discreta
      fCtx.fillStyle = '#140808';
      fCtx.fillRect(32, 0, 32, 32);
      fCtx.fillStyle = '#1e0e0e';
      fCtx.fillRect(33, 1, 30, 30);
      fCtx.strokeStyle = 'rgba(69, 10, 10, 0.4)';
      fCtx.strokeRect(32.5, 0.5, 31, 31);
      fCtx.fillStyle = 'rgba(124, 45, 18, 0.25)';
      fCtx.fillRect(38, 15, 20, 2);

      // Tile 2: Grelha térmica com calor suave
      fCtx.fillStyle = '#140808';
      fCtx.fillRect(64, 0, 32, 32);
      fCtx.fillStyle = '#1c0d0d';
      fCtx.fillRect(65, 1, 30, 30);
      fCtx.strokeStyle = 'rgba(69, 10, 10, 0.4)';
      fCtx.strokeRect(64.5, 0.5, 31, 31);
      fCtx.fillStyle = 'rgba(234, 88, 12, 0.2)';
      fCtx.fillRect(72, 8, 16, 2);
      fCtx.fillRect(72, 14, 16, 2);
      fCtx.fillRect(72, 20, 16, 2);

      // Tile 3: Placa de aço reforçada
      fCtx.fillStyle = '#140808';
      fCtx.fillRect(96, 0, 32, 32);
      fCtx.fillStyle = '#221111';
      fCtx.fillRect(97, 1, 30, 30);
      fCtx.strokeStyle = 'rgba(120, 53, 15, 0.35)';
      fCtx.strokeRect(98.5, 2.5, 27, 27);

      byteQuestSpriteEngine.registerTileset('forge', forgeCanvas, 32);
    }

    // ─── 3. NÚCLEO QUÂNTICO (tileset_quantum) ───
    const quantumCanvas = document.createElement('canvas');
    quantumCanvas.width = 128;
    quantumCanvas.height = 32;
    const qCtx = quantumCanvas.getContext('2d');
    if (qCtx) {
      qCtx.imageSmoothingEnabled = false;

      // Tile 0: Placa de silício negro limpa
      qCtx.fillStyle = '#070410';
      qCtx.fillRect(0, 0, 32, 32);
      qCtx.fillStyle = '#0d081e';
      qCtx.fillRect(1, 1, 30, 30);
      qCtx.strokeStyle = 'rgba(46, 16, 101, 0.4)';
      qCtx.strokeRect(0.5, 0.5, 31, 31);

      // Tile 1: Bloco de substrato com chanfro sutil
      qCtx.fillStyle = '#070410';
      qCtx.fillRect(32, 0, 32, 32);
      qCtx.fillStyle = '#0f0a22';
      qCtx.fillRect(33, 1, 30, 30);
      qCtx.strokeStyle = 'rgba(46, 16, 101, 0.4)';
      qCtx.strokeRect(32.5, 0.5, 31, 31);
      qCtx.fillStyle = 'rgba(30, 27, 75, 0.3)';
      qCtx.fillRect(35, 35, 26, 1);

      // Tile 2: Trilha tênue de nanofibra ótica
      qCtx.fillStyle = '#070410';
      qCtx.fillRect(64, 0, 32, 32);
      qCtx.fillStyle = '#0d081e';
      qCtx.fillRect(65, 1, 30, 30);
      qCtx.strokeStyle = 'rgba(46, 16, 101, 0.4)';
      qCtx.strokeRect(64.5, 0.5, 31, 31);
      qCtx.strokeStyle = 'rgba(192, 132, 252, 0.18)';
      qCtx.lineWidth = 1;
      qCtx.beginPath();
      qCtx.moveTo(64, 16);
      qCtx.lineTo(76, 16);
      qCtx.lineTo(82, 10);
      qCtx.lineTo(96, 10);
      qCtx.stroke();

      // Tile 3: Conector de microchip discreto
      qCtx.fillStyle = '#070410';
      qCtx.fillRect(96, 0, 32, 32);
      qCtx.fillStyle = '#0d081e';
      qCtx.fillRect(97, 1, 30, 30);
      qCtx.strokeStyle = 'rgba(46, 16, 101, 0.4)';
      qCtx.strokeRect(96.5, 0.5, 31, 31);
      qCtx.fillStyle = 'rgba(124, 58, 237, 0.2)';
      qCtx.fillRect(108, 12, 8, 8);

      byteQuestSpriteEngine.registerTileset('quantum_core', quantumCanvas, 32);
    }
  }
}
