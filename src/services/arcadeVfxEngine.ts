/**
 * Micro-motor procedural cinemático de alta performance (Arcade VFX Engine)
 *
 * Características de nível de console/arcade:
 * - Canvas fixo singleton com auto-pause (0% de CPU e bateria em repouso).
 * - Suporte a telas Retina e High-DPI (devicePixelRatio dinâmico com teto de 2.0).
 * - Fusão aditiva de luz (globalCompositeOperation = 'lighter') gerando núcleos incandescentes.
 * - Alinhamento tangencial ao vetor de velocidade instantânea: θ = atan2(vy, vx).
 * - Deformação elástica por velocidade (Kinetic Smear / Squash & Stretch com conservação de volume).
 * - Reciclagem de memória O(1) via Swap & Pop e teto de saturação contra lag em 150+ WPM.
 */

export interface KineticParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  shape?: Path2D;
  alignToVelocity: boolean;
  smearMultiplier: number;
  gravity: number;
  friction: number;
}

export interface BurstConfig {
  x: number;               // Posição x em pixels de tela
  y: number;               // Posição y em pixels de tela
  color: string;           // Cor principal em HEX ou RGBA
  particleCount?: number;  // Quantidade de partículas (padrão: 8 a 14)
  pathShape?: Path2D;      // Vetor Path2D opcional
  spreadRad?: number;      // Abertura do arco em radianos (padrão: 2*PI)
  baseAngle?: number;      // Ângulo central em radianos
  baseSpeed?: number;      // Velocidade de dispersão
  gravity?: number;        // Gravidade local (padrão: 0.12)
  friction?: number;       // Coeficiente de atrito (padrão: 0.94)
  size?: number;           // Tamanho customizado
}

class ArcadeVfxEngine {
  private static instance: ArcadeVfxEngine;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: KineticParticle[] = [];
  private animFrameId: number | null = null;
  private dpr: number = 1;
  private resizeHandler: (() => void) | null = null;
  private readonly MAX_ACTIVE_PARTICLES = 160;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initCanvas();
    }
  }

  public static getInstance(): ArcadeVfxEngine {
    if (!ArcadeVfxEngine.instance) {
      ArcadeVfxEngine.instance = new ArcadeVfxEngine();
    }
    return ArcadeVfxEngine.instance;
  }

  private initCanvas(): void {
    if (typeof document === 'undefined') return;

    // Reutiliza elemento existente caso o HMR do Vite recarregue o módulo
    const existing = document.getElementById('typeclicker-vfx-overlay') as HTMLCanvasElement | null;
    if (existing) {
      this.canvas = existing;
    } else {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'typeclicker-vfx-overlay';
      this.canvas.style.position = 'fixed';
      this.canvas.style.inset = '0';
      this.canvas.style.width = '100vw';
      this.canvas.style.height = '100vh';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '9999';
      document.body.appendChild(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.handleResize();

    this.resizeHandler = () => this.handleResize();
    window.addEventListener('resize', this.resizeHandler, { passive: true });
  }

  private handleResize(): void {
    if (!this.canvas || !this.ctx || typeof window === 'undefined') return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /**
   * Dispara um impacto cinemático de partículas com brilho aditivo e alinhamento
   */
  public emitBurst(config: BurstConfig): void {
    if (!this.ctx || !this.canvas) return;

    // Teto de saturação: evita sobrecarga em digitações extremas acima de 150 WPM
    if (this.particles.length >= this.MAX_ACTIVE_PARTICLES) return;

    const count = Math.min(config.particleCount ?? 10, this.MAX_ACTIVE_PARTICLES - this.particles.length);
    const shape = config.pathShape;
    const baseSpeed = config.baseSpeed ?? 7.5;
    const spreadRad = config.spreadRad ?? Math.PI * 2;
    const baseAngle = config.baseAngle ?? 0;
    const gravity = config.gravity ?? 0.14;
    const friction = config.friction ?? 0.94;

    for (let i = 0; i < count; i++) {
      let angle = 0;
      if (spreadRad >= Math.PI * 1.95) {
        // Dispersão omnidirecional 360 uniforme com micro-jitter
        angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
      } else {
        // Dispersão em leque angular (ex: 45° a 90°)
        angle = baseAngle - spreadRad / 2 + (spreadRad * i) / Math.max(1, count - 1) + (Math.random() - 0.5) * 0.2;
      }

      const speed = baseSpeed * (0.65 + Math.random() * 0.7);

      this.particles.push({
        x: config.x,
        y: config.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: Math.round(20 + Math.random() * 16), // ~300ms a 60 FPS
        size: config.size ? config.size : shape ? 14 + Math.random() * 6 : 3 + Math.random() * 2.5,
        color: config.color,
        shape: shape,
        alignToVelocity: true,
        smearMultiplier: shape ? 0.08 : 0.16,
        gravity,
        friction,
      });
    }

    // Inicia o loop de animação sob demanda se estiver inativo
    if (this.animFrameId === null) {
      this.tick();
    }
  }

  /**
   * Loop de renderização com cancelamento automático quando a fila de partículas zera
   */
  private tick = (): void => {
    if (!this.ctx || !this.canvas) return;

    // AUTO-PAUSE: Quando não há partículas, limpa o buffer e dorme (0% CPU)
    if (this.particles.length === 0) {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.animFrameId = null;
      return;
    }

    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // FUSÃO ADITIVA: Sobreposição de partículas gera incandescência brilhante
    this.ctx.globalCompositeOperation = 'lighter';

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;

      // Remoção em O(1) com Swap & Pop (zero realocações de array a 60 FPS)
      if (p.life >= p.maxLife) {
        const last = this.particles.pop();
        if (i < this.particles.length && last) {
          this.particles[i] = last;
        }
        continue;
      }

      // Cinemática com atrito e gravidade
      p.vx *= p.friction;
      p.vy = p.vy * p.friction + p.gravity;
      p.x += p.vx;
      p.y += p.vy;

      const progress = p.life / p.maxLife;
      // Curva quadrática suave de esmaecimento
      const alpha = Math.max(0, 1 - progress * progress);
      const speed = Math.hypot(p.vx, p.vy);

      // KINETIC SMEAR: alongamento no vetor de velocidade conservando área
      const smear = 1 + Math.min(speed * p.smearMultiplier, 2.4);
      const crossScale = 1 / Math.sqrt(smear);

      this.ctx.save();
      this.ctx.translate(p.x, p.y);

      // ALINHAMENTO TANGENCIAL: Aponta para a direção do deslocamento
      if (p.alignToVelocity && speed > 0.15) {
        this.ctx.rotate(Math.atan2(p.vy, p.vx));
      }

      this.ctx.scale(smear, crossScale);
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = p.color;

      if (p.shape) {
        // Renderiza o vetor Path2D normalizado 24x24 centralizado
        const s = p.size / 24;
        this.ctx.scale(s, s);
        this.ctx.translate(-12, -12);
        this.ctx.fill(p.shape);
      } else {
        // Micro-debris / Faísca esférica de energia
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    this.animFrameId = requestAnimationFrame(this.tick);
  };

  /**
   * Limpeza de recursos para HMR ou desmontagem
   */
  public destroy(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.resizeHandler && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
      this.ctx = null;
    }
    this.particles = [];
  }
}

export const arcadeVfx = ArcadeVfxEngine.getInstance();
