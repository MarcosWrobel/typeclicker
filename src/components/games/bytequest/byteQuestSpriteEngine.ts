// ─────────────────────────────────────────────────────────────
// Motor de Spritesheets & Animações 2D — ByteQuest
// Suporte a Spritesheets PNG, Aseprite JSON e Recortes de Grade
// Funciona com Zero Latência e Fallback Gracioso Procedural
// ─────────────────────────────────────────────────────────────

export interface AnimationDef {
  startFrame: number;
  endFrame: number;
  fps: number;
  loop?: boolean;
}

export interface SpriteSheetConfig {
  frameWidth: number;
  frameHeight: number;
  framesPerRow?: number;
  animations: Record<string, AnimationDef>;
}

export interface SpriteAnimState {
  currentAnim: string;
  frameIndex: number;
  elapsedTime: number;
}

class ByteQuestSpriteEngine {
  private images: Map<string, HTMLImageElement> = new Map();
  private configs: Map<string, SpriteSheetConfig> = new Map();
  private loadingPromises: Map<string, Promise<boolean>> = new Map();

  /**
   * Registra e inicia o carregamento assíncrono de um Spritesheet
   */
  public registerSpriteSheet(
    name: string,
    imageUrl: string,
    config: SpriteSheetConfig
  ): Promise<boolean> {
    if (this.images.has(name)) {
      return Promise.resolve(true);
    }

    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name)!;
    }

    const promise = new Promise<boolean>((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.images.set(name, img);
        this.configs.set(name, config);
        resolve(true);
      };
      img.onerror = () => {
        // Fallback silencioso: o jogo continuará usando os desenhos vetoriais procedurais
        console.warn(`[ByteQuestSpriteEngine] Spritesheet '${name}' não encontrado em '${imageUrl}'. Usando renderizador procedural.`);
        resolve(false);
      };
      img.src = imageUrl;
    });

    this.loadingPromises.set(name, promise);
    return promise;
  }

  /**
   * Cria um estado inicial de animação para uma entidade
   */
  public createAnimState(defaultAnim: string = 'idle'): SpriteAnimState {
    return {
      currentAnim: defaultAnim,
      frameIndex: 0,
      elapsedTime: 0
    };
  }

  /**
   * Atualiza o estado da animação com base no delta time
   */
  public updateAnimState(state: SpriteAnimState, sheetName: string, targetAnim: string, dt: number): void {
    const config = this.configs.get(sheetName);
    if (!config || !config.animations[targetAnim]) return;

    if (state.currentAnim !== targetAnim) {
      state.currentAnim = targetAnim;
      state.frameIndex = config.animations[targetAnim].startFrame;
      state.elapsedTime = 0;
      return;
    }

    const anim = config.animations[targetAnim];
    const frameDuration = 1 / Math.max(1, anim.fps);
    state.elapsedTime += dt;

    if (state.elapsedTime >= frameDuration) {
      state.elapsedTime -= frameDuration;
      state.frameIndex++;

      if (state.frameIndex > anim.endFrame) {
        if (anim.loop !== false) {
          state.frameIndex = anim.startFrame;
        } else {
          state.frameIndex = anim.endFrame;
        }
      }
    }
  }

  /**
   * Renderiza o quadro atual do Spritesheet no Canvas 2D
   * Retorna `true` se desenhou com sucesso, ou `false` se deve usar o fallback procedural
   */
  public drawSprite(
    ctx: CanvasRenderingContext2D,
    sheetName: string,
    state: SpriteAnimState,
    x: number,
    y: number,
    options: {
      destWidth?: number;
      destHeight?: number;
      flipX?: boolean;
      rotation?: number;
      alpha?: number;
      flashWhite?: boolean;
    } = {}
  ): boolean {
    const img = this.images.get(sheetName);
    const config = this.configs.get(sheetName);

    if (!img || !config) {
      return false; // Fallback procedural
    }

    const anim = config.animations[state.currentAnim] || Object.values(config.animations)[0];
    if (!anim) return false;

    const frameW = config.frameWidth;
    const frameH = config.frameHeight;
    const cols = config.framesPerRow || Math.max(1, Math.floor(img.width / frameW));

    const currentFrame = Math.max(anim.startFrame, Math.min(anim.endFrame, state.frameIndex));
    const col = currentFrame % cols;
    const row = Math.floor(currentFrame / cols);

    const sx = col * frameW;
    const sy = row * frameH;
    const dw = options.destWidth || frameW;
    const dh = options.destHeight || frameH;

    ctx.save();
    ctx.translate(x, y);

    if (options.rotation) {
      ctx.rotate(options.rotation);
    }

    if (options.flipX) {
      ctx.scale(-1, 1);
    }

    if (options.alpha !== undefined) {
      ctx.globalAlpha = Math.max(0, Math.min(1, options.alpha));
    }

    // Configuração de renderização Pixel Art nítida
    ctx.imageSmoothingEnabled = false;

    if (options.flashWhite) {
      // Efeito de Flash de Dano usando composição visual
      ctx.drawImage(img, sx, sy, frameW, frameH, -dw / 2, -dh / 2, dw, dh);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(-dw / 2, -dh / 2, dw, dh);
    } else {
      ctx.drawImage(img, sx, sy, frameW, frameH, -dw / 2, -dh / 2, dw, dh);
    }

    ctx.restore();
    return true;
  }

  /**
   * Registra um Spritesheet a partir de um Canvas offscreen diretamente
   */
  public registerImageCanvas(
    name: string,
    canvas: HTMLCanvasElement,
    config: SpriteSheetConfig
  ): void {
    const img = new Image();
    img.src = canvas.toDataURL();
    img.onload = () => {
      this.images.set(name, img);
      this.configs.set(name, config);
    };
  }

  private tilesets: Map<string, { img: HTMLImageElement; tileSize: number }> = new Map();

  /**
   * Registra um Tileset de Bioma (4 tiles de 32x32 em linha)
   */
  public registerTileset(biomeId: string, canvas: HTMLCanvasElement, tileSize: number = 32): void {
    const img = new Image();
    img.src = canvas.toDataURL();
    img.onload = () => {
      this.tilesets.set(biomeId, { img, tileSize });
    };
  }

  /**
   * Renderiza os tiles de piso do bioma na área visível da câmera (Viewport Culling)
   */
  public drawBiomeTiles(
    ctx: CanvasRenderingContext2D,
    biomeId: string,
    cameraX: number,
    cameraY: number,
    viewportW: number,
    viewportH: number,
    worldW: number,
    worldH: number
  ): boolean {
    const tileset = this.tilesets.get(biomeId);
    if (!tileset) return false;

    const { img, tileSize } = tileset;
    const scale = 2; // Escala 2x para pixel art 32x32 -> 64x64 no mundo
    const effectiveTile = tileSize * scale;

    const startCol = Math.max(0, Math.floor(cameraX / effectiveTile));
    const endCol = Math.min(Math.ceil(worldW / effectiveTile), Math.ceil((cameraX + viewportW) / effectiveTile) + 1);

    const startRow = Math.max(0, Math.floor(cameraY / effectiveTile));
    const endRow = Math.min(Math.ceil(worldH / effectiveTile), Math.ceil((cameraY + viewportH) / effectiveTile) + 1);

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    for (let r = startRow; r < endRow; r++) {
      for (let c = startCol; c < endCol; c++) {
        // Seleção determinística do tile: 88% piso base, 8% variação leve, 4% detalhes raros
        const hash = (c * 73 + r * 179 + (c ^ r) * 13) % 100;
        let tileIndex = 0; // Piso base homogêneo e limpo (88% das lajotas)
        if (hash > 88 && hash <= 96) tileIndex = 1; // Variação suave de pedra/chapa (8%)
        else if (hash === 97 || hash === 98) tileIndex = 2; // Runa/Grelha discreta (2%)
        else if (hash === 99) tileIndex = 3; // Detalhe raro (1%)

        const sx = tileIndex * tileSize;
        const dx = c * effectiveTile;
        const dy = r * effectiveTile;

        ctx.drawImage(img, sx, 0, tileSize, tileSize, dx, dy, effectiveTile, effectiveTile);
      }
    }

    ctx.restore();
    return true;
  }

  /**
   * Verifica se um spritesheet já foi carregado
   */
  public hasSpriteSheet(name: string): boolean {
    return this.images.has(name);
  }
}

export const byteQuestSpriteEngine = new ByteQuestSpriteEngine();
