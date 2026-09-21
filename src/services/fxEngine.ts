import confetti from 'canvas-confetti';
import { AnimationEffectId } from '../types/cosmetics';
import { VECTOR_SHAPES } from '../constants/vectorShapes';
import { arcadeVfx } from './arcadeVfxEngine';

export interface TintOptions {
  scalar?: number;
  color?: string | [string, string];
  fallback?: confetti.Shape;
}

/**
 * Renderiza uma forma (Path2D nativo ou glifo) com mascaramento de canal Alfa
 * e preenchimento de cor semântica sólida ou gradiente espectral via Canvas 2D.
 */
export function createTintedShape(
  textOrPath: string | Path2D,
  options: TintOptions = {}
): confetti.Shape {
  if (typeof window === 'undefined') return options.fallback || 'circle';

  const scalar = options.scalar ?? 2.5;
  const fontSize = Math.round(12 * scalar);
  const padding = 4;
  const width = fontSize + padding * 2;
  const height = fontSize + padding * 2;

  try {
    let canvas: OffscreenCanvas | HTMLCanvasElement;
    let ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null = null;

    if (typeof OffscreenCanvas !== 'undefined') {
      canvas = new OffscreenCanvas(width, height);
      ctx = canvas.getContext('2d');
    } else {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext('2d');
    }

    if (!ctx) return options.fallback || 'circle';

    // 1. Desenha a forma base como máscara de opacidade/alfa
    if (typeof textOrPath === 'string') {
      ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textOrPath, width / 2, height / 2);
    } else {
      ctx.save();
      ctx.translate(padding, padding);
      ctx.scale(fontSize / 24, fontSize / 24);
      ctx.fill(textOrPath);
      ctx.restore();
    }

    // 2. Aplica mascaramento de Alfa: mantém apenas a silhueta desenhada
    ctx.globalCompositeOperation = 'source-in';

    // 3. Preenche com cor sólida ou gradiente temático
    if (Array.isArray(options.color)) {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, options.color[0]);
      grad.addColorStop(1, options.color[1]);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = options.color || '#38bdf8';
    }
    ctx.fillRect(0, 0, width, height);

    // 4. Converte para ImageBitmap compatível com canvas-confetti
    const scale = 1 / scalar;
    const bitmap =
      'transferToImageBitmap' in canvas && typeof canvas.transferToImageBitmap === 'function'
        ? canvas.transferToImageBitmap()
        : (canvas as HTMLCanvasElement);

    return {
      type: 'bitmap',
      bitmap: bitmap as unknown as ImageBitmap,
      matrix: [scale, 0, 0, scale, (-width * scale) / 2, (-height * scale) / 2],
    } as unknown as confetti.Shape;
  } catch (err) {
    console.warn('[fxEngine] createTintedShape error:', err);
    return options.fallback || 'circle';
  }
}

// Cache para formas customizadas via canvas-confetti
let cachedShapes: Record<string, confetti.Shape> | null = null;

function getShapes(): Record<string, confetti.Shape> {
  if (cachedShapes) return cachedShapes;

  cachedShapes = {
    bat: createTintedShape(VECTOR_SHAPES.bat, { scalar: 2.8, color: ['#fbbf24', '#78350f'], fallback: 'circle' }),
    skull: createTintedShape(VECTOR_SHAPES.skull, { scalar: 2.8, color: ['#e0f2fe', '#06b6d4'], fallback: 'circle' }),
    bone: createTintedShape(VECTOR_SHAPES.bone, { scalar: 2.6, color: ['#ffffff', '#38bdf8'], fallback: 'square' }),
    lightning: createTintedShape(VECTOR_SHAPES.lightning, { scalar: 2.6, color: ['#fef08a', '#eab308'], fallback: 'star' }),
    ring: createTintedShape(VECTOR_SHAPES.ring, { scalar: 2.6, color: ['#fef9c3', '#f59e0b'], fallback: 'circle' }),
    diamond: createTintedShape(VECTOR_SHAPES.diamond, { scalar: 2.6, color: ['#a5f3fc', '#06b6d4'], fallback: 'square' }),
    flame: createTintedShape(VECTOR_SHAPES.flame, { scalar: 2.6, color: ['#fef08a', '#ea580c'], fallback: 'circle' }),
    fist: createTintedShape(VECTOR_SHAPES.fist, { scalar: 3.0, color: ['#fca5a5', '#dc2626'], fallback: 'square' }),
    sword: createTintedShape(VECTOR_SHAPES.sword, { scalar: 2.6, color: ['#e0f2fe', '#0284c7'], fallback: 'star' }),
    star: createTintedShape(VECTOR_SHAPES.star, { scalar: 2.6, color: ['#fef08a', '#c084fc'], fallback: 'star' }),
    steam: createTintedShape(VECTOR_SHAPES.steam, { scalar: 2.6, color: ['#ffffff', '#fb7185'], fallback: 'circle' }),
    spiral: createTintedShape(VECTOR_SHAPES.spiral, { scalar: 2.6, color: ['#38bdf8', '#a855f7'], fallback: 'circle' }),
    goldCoin: createTintedShape('🪙', { scalar: 2.6, color: ['#fef08a', '#d97706'], fallback: 'circle' }),
    bubble: createTintedShape('🫧', { scalar: 2.6, color: ['#a5f3fc', '#c084fc'], fallback: 'circle' }),
    pixelMonster: createTintedShape('👾', { scalar: 2.6, color: ['#a855f7', '#22c55e'], fallback: 'square' }),
    pixelHeart: createTintedShape('❤️', { scalar: 2.6, color: ['#fca5a5', '#dc2626'], fallback: 'square' }),
    rocket: createTintedShape('🚀', { scalar: 2.6, color: ['#e0f2fe', '#0284c7'], fallback: 'star' }),
    sparkles: createTintedShape('✨', { scalar: 2.6, color: ['#fef08a', '#f59e0b'], fallback: 'star' }),
    firework: createTintedShape('🎆', { scalar: 2.6, color: ['#f43f5e', '#38bdf8'], fallback: 'star' }),
    binaryOne: createTintedShape('1', { scalar: 2.2, color: ['#86efac', '#16a34a'], fallback: 'square' }),
    binaryZero: createTintedShape('0', { scalar: 2.2, color: ['#86efac', '#16a34a'], fallback: 'square' }),
    explosion: createTintedShape('💥', { scalar: 2.8, color: ['#fef08a', '#ea580c'], fallback: 'star' }),
    eye: createTintedShape('👁️', { scalar: 2.6, color: ['#a5f3fc', '#38bdf8'], fallback: 'circle' }),
    ghost: createTintedShape('👻', { scalar: 2.6, color: ['#dbeafe', '#7dd3fc'], fallback: 'circle' }),
    waterWave: createTintedShape('🌊', { scalar: 2.6, color: ['#e0f2fe', '#0284c7'], fallback: 'circle' }),
    // Formas de Apps Populares
    chatBubble: createTintedShape('💬', { scalar: 2.6, color: ['#25d366', '#128c7e'], fallback: 'circle' }),
    checkMark: createTintedShape('✔️', { scalar: 2.4, color: ['#53bdeb', '#25d366'], fallback: 'circle' }),
    heartGlow: createTintedShape('💖', { scalar: 2.6, color: ['#f43f5e', '#e1306c'], fallback: 'circle' }),
    playButton: createTintedShape('▶️', { scalar: 2.6, color: ['#ff0000', '#b91c1c'], fallback: 'circle' }),
    musicNote: createTintedShape('🎵', { scalar: 2.6, color: ['#00f2fe', '#fe2c55'], fallback: 'circle' }),
    blockCube: createTintedShape('🧱', { scalar: 2.6, color: ['#e2231a', '#f59e0b'], fallback: 'square' }),
  };

  return cachedShapes;
}

// Controle de concorrência e ciclo de vida de nós do DOM
const activeShockwaves: HTMLElement[] = [];
const MAX_CONCURRENT_SHOCKWAVES = 5;

let activeFlashEl: HTMLElement | null = null;
let flashCleanupTimeout: ReturnType<typeof setTimeout> | null = null;

let rumbleTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Dispara uma onda de choque circular procedural que se expande a partir de uma coordenada relativa (0..1)
 */
export function triggerShockwaveVfx(
  originX: number = 0.5,
  originY: number = 0.5,
  color: string = 'rgba(56, 189, 248, 0.8)',
  size: number = 220
) {
  if (typeof document === 'undefined') return;
  try {
    // Limita concorrência descartando as mais antigas caso o aluno digite/clique em altíssima velocidade
    while (activeShockwaves.length >= MAX_CONCURRENT_SHOCKWAVES) {
      const oldest = activeShockwaves.shift();
      if (oldest && oldest.parentNode) {
        oldest.parentNode.removeChild(oldest);
      }
    }

    const wave = document.createElement('div');
    wave.className = 'animate-fx-shockwave pointer-events-none fixed rounded-full z-[9999] border border-solid';
    wave.style.left = `${originX * 100}vw`;
    wave.style.top = `${originY * 100}vh`;
    wave.style.width = `${size}px`;
    wave.style.height = `${size}px`;
    wave.style.borderColor = color;
    wave.style.boxShadow = `0 0 25px ${color}, inset 0 0 15px ${color}`;

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      const idx = activeShockwaves.indexOf(wave);
      if (idx !== -1) activeShockwaves.splice(idx, 1);
      if (wave.parentNode) {
        wave.parentNode.removeChild(wave);
      }
    };

    wave.addEventListener('animationend', cleanup, { once: true });
    setTimeout(cleanup, 500);

    activeShockwaves.push(wave);
    document.body.appendChild(wave);
  } catch (err) {
    console.warn('triggerShockwaveVfx error:', err);
  }
}

/**
 * Dispara um clarão / flash de luz suave em tela cheia (vinheta de pulso luminescente)
 * Reutiliza o elemento existente para evitar empilhamento excessivo de opacidade.
 */
export function triggerScreenFlashVfx(color: string = 'rgba(56, 189, 248, 0.25)') {
  if (typeof document === 'undefined') return;
  try {
    if (flashCleanupTimeout) {
      clearTimeout(flashCleanupTimeout);
      flashCleanupTimeout = null;
    }

    if (!activeFlashEl || !activeFlashEl.parentNode) {
      activeFlashEl = document.createElement('div');
      activeFlashEl.className = 'pointer-events-none fixed inset-0 z-[9998]';
      document.body.appendChild(activeFlashEl);
    }

    // Reinicia a animação CSS com a cor requisitada
    activeFlashEl.style.background = `radial-gradient(circle at center, ${color} 0%, transparent 80%)`;
    activeFlashEl.classList.remove('animate-fx-flash');
    // Força reflow para reiniciar animação instantaneamente
    void activeFlashEl.offsetWidth;
    activeFlashEl.classList.add('animate-fx-flash');

    flashCleanupTimeout = setTimeout(() => {
      if (activeFlashEl && activeFlashEl.parentNode) {
        activeFlashEl.parentNode.removeChild(activeFlashEl);
      }
      activeFlashEl = null;
      flashCleanupTimeout = null;
    }, 350);
  } catch (err) {
    console.warn('triggerScreenFlashVfx error:', err);
  }
}

/**
 * Dispara um micro-tremor de tela (screen shake) para impactos intensos com debounce seguro
 */
export function triggerScreenShakeVfx() {
  if (typeof document === 'undefined') return;
  try {
    const root = document.getElementById('root') || document.body;
    if (rumbleTimeout) {
      clearTimeout(rumbleTimeout);
      rumbleTimeout = null;
    }

    root.classList.add('animate-screen-rumble');
    rumbleTimeout = setTimeout(() => {
      root.classList.remove('animate-screen-rumble');
      rumbleTimeout = null;
    }, 250);
  } catch (err) {
    console.warn('triggerScreenShakeVfx error:', err);
  }
}

/**
 * Disparado em tempo real na digitação de teclas e combos no terminal
 * Opera via ArcadeVfxEngine com fusão aditiva (lighter), Kinetic Smear e 0% CPU em repouso
 */
export function triggerKeystrokeImpact(
  xPx: number,
  yPx: number,
  color: string = '#38bdf8',
  effectId: AnimationEffectId | string = 'confetti_classic',
  isWordComplete: boolean = false
): void {
  let pathShape: Path2D | undefined;
  const multiplier = isWordComplete ? 2.2 : 1;
  const particleCount = Math.round((isWordComplete ? 14 : 5) * (multiplier > 1 ? 1.2 : 1));
  const baseSpeed = isWordComplete ? 9.5 : 5.5;

  switch (effectId) {
    case 'gaster_bone_barrage':
      pathShape = VECTOR_SHAPES.bone;
      break;
    case 'bat_swarm_vfx':
      pathShape = VECTOR_SHAPES.bat;
      break;
    case 'tesla_lightning':
    case 'thunder_storm_vfx':
    case 'sandevistan_afterimage':
      pathShape = VECTOR_SHAPES.lightning;
      break;
    case 'golden_ring_burst':
      pathShape = VECTOR_SHAPES.ring;
      break;
    case 'diamond_rain':
      pathShape = VECTOR_SHAPES.diamond;
      break;
    case 'volcano_flame':
    case 'gear_second_steam':
    case 'water_flame_dragon':
      pathShape = VECTOR_SHAPES.flame;
      break;
    case 'serious_shockwave':
      pathShape = VECTOR_SHAPES.fist;
      break;
    case 'soul_vessel_burst':
      pathShape = VECTOR_SHAPES.sword;
      break;
    case 'supernova_burst':
    case 'hyperspace_warp':
      pathShape = VECTOR_SHAPES.star;
      break;
    default:
      break;
  }

  arcadeVfx.emitBurst({
    x: xPx,
    y: yPx,
    color,
    pathShape,
    particleCount,
    baseSpeed,
  });
}

/**
 * Dispara o efeito visual de compra de upgrade de acordo com o estilo equipado
 */
export function triggerUpgradePurchaseVfx(
  style: AnimationEffectId | string = 'confetti_classic',
  originRect?: DOMRect | null,
  isMilestone: boolean = false
) {
  try {
    let x = 0.5;
    let y = 0.5;
    if (originRect && typeof window !== 'undefined' && window.innerWidth > 0 && window.innerHeight > 0) {
      x = Math.max(0.05, Math.min(0.95, (originRect.left + originRect.width / 2) / window.innerWidth));
      y = Math.max(0.05, Math.min(0.95, (originRect.top + originRect.height / 2) / window.innerHeight));
    }
    const countMultiplier = isMilestone ? 2 : 1;
    const shapes = getShapes();

    // Burst tátil instantâneo no ponto do clique via ArcadeVfx (zero latência)
    if (typeof window !== 'undefined') {
      const screenXPx = x * window.innerWidth;
      const screenYPx = y * window.innerHeight;
      arcadeVfx.emitBurst({
        x: screenXPx,
        y: screenYPx,
        color: '#ffffff',
        particleCount: isMilestone ? 14 : 7,
        baseSpeed: 6.5,
      });
    }

    switch (style) {
      case 'confetti_classic':
        confetti({
          particleCount: Math.round(25 * countMultiplier),
          spread: 55,
          origin: { x, y },
          shapes: ['circle', 'square'],
          colors: ['#10b981', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
          startVelocity: isMilestone ? 45 : 30,
        });
        break;

      case 'golden_coins':
        confetti({
          particleCount: Math.round(22 * countMultiplier),
          spread: 55,
          origin: { x, y },
          shapes: [shapes.goldCoin],
          flat: true,
          scalar: 2.4,
          colors: ['#fbbf24', '#f59e0b', '#d97706'],
          startVelocity: isMilestone ? 42 : 28,
          gravity: 0.9,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(251, 191, 36, 0.7)', 180);
        }
        break;

      case 'matrix_stream':
        confetti({
          particleCount: Math.round(26 * countMultiplier),
          spread: 28,
          angle: 90,
          origin: { x, y },
          shapes: [shapes.binaryOne, shapes.binaryZero],
          flat: true,
          scalar: 2.1,
          colors: ['#22c55e', '#16a34a', '#86efac'],
          startVelocity: isMilestone ? 48 : 34,
          gravity: 0.65,
          ticks: 120,
        });
        break;

      case 'supernova_burst':
        confetti({
          particleCount: Math.round(26 * countMultiplier),
          spread: 360,
          origin: { x, y },
          shapes: [shapes.star, shapes.explosion],
          flat: true,
          scalar: 2.4,
          colors: ['#c084fc', '#a855f7', '#38bdf8', '#ffffff'],
          startVelocity: isMilestone ? 36 : 24,
          decay: 0.92,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(168, 85, 247, 0.8)', 240);
          triggerScreenFlashVfx('rgba(168, 85, 247, 0.25)');
        }
        break;

      case 'tesla_lightning':
        confetti({
          particleCount: Math.round(22 * countMultiplier),
          spread: 85,
          origin: { x, y },
          shapes: [shapes.lightning],
          flat: true,
          scalar: 2.4,
          colors: ['#38bdf8', '#0ea5e9', '#60a5fa', '#ffffff'],
          startVelocity: isMilestone ? 55 : 38,
          decay: 0.86,
          gravity: 0.45,
        });
        if (isMilestone) {
          triggerScreenFlashVfx('rgba(56, 189, 248, 0.35)');
          triggerShockwaveVfx(x, y, 'rgba(56, 189, 248, 0.75)', 190);
        }
        break;

      case 'volcano_flame':
        confetti({
          particleCount: Math.round(24 * countMultiplier),
          spread: 45,
          angle: 90,
          origin: { x, y },
          shapes: [shapes.flame],
          flat: true,
          scalar: 2.4,
          colors: ['#ef4444', '#f97316', '#fbbf24'],
          startVelocity: isMilestone ? 52 : 36,
          gravity: 0.85,
        });
        if (isMilestone) {
          triggerScreenShakeVfx();
          triggerShockwaveVfx(x, y, 'rgba(239, 68, 68, 0.75)', 200);
        }
        break;

      case 'cyber_neon':
        confetti({
          particleCount: Math.round(24 * countMultiplier),
          spread: 65,
          origin: { x, y },
          shapes: [shapes.sparkles, shapes.lightning],
          flat: true,
          scalar: 2.4,
          colors: ['#ec4899', '#06b6d4', '#f43f5e'],
          startVelocity: isMilestone ? 44 : 30,
        });
        break;

      case 'pixel_retro':
        confetti({
          particleCount: Math.round(22 * countMultiplier),
          spread: 60,
          origin: { x, y },
          shapes: [shapes.pixelMonster, shapes.pixelHeart],
          flat: true,
          scalar: 2.4,
          colors: ['#22c55e', '#eab308', '#ef4444', '#a855f7'],
          startVelocity: isMilestone ? 42 : 28,
          gravity: 1.0,
        });
        break;

      case 'fireworks_show':
        confetti({
          particleCount: Math.round(24 * countMultiplier),
          spread: 120,
          origin: { x, y },
          shapes: [shapes.firework, shapes.sparkles],
          flat: true,
          scalar: 2.4,
          colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#ffffff'],
          startVelocity: isMilestone ? 42 : 28,
        });
        break;

      case 'bubble_magic':
        confetti({
          particleCount: Math.round(20 * countMultiplier),
          spread: 65,
          angle: 90,
          origin: { x, y },
          shapes: [shapes.bubble],
          flat: true,
          scalar: 2.4,
          colors: ['#67e8f9', '#c084fc', '#fbcfe8', '#a7f3d0'],
          startVelocity: isMilestone ? 25 : 16,
          gravity: -0.22,
          ticks: 140,
        });
        break;

      case 'hyperspace_warp':
        confetti({
          particleCount: Math.round(26 * countMultiplier),
          spread: 360,
          origin: { x, y },
          shapes: [shapes.rocket, shapes.star],
          flat: true,
          scalar: 2.4,
          colors: ['#38bdf8', '#0284c7', '#ffffff'],
          startVelocity: isMilestone ? 58 : 40,
          gravity: 0.2,
        });
        if (isMilestone) {
          triggerScreenFlashVfx('rgba(56, 189, 248, 0.25)');
          triggerShockwaveVfx(x, y, 'rgba(56, 189, 248, 0.8)', 220);
        }
        break;

      case 'kamehameha_energy':
        confetti({
          particleCount: Math.round(28 * countMultiplier),
          spread: 360,
          origin: { x, y },
          shapes: [shapes.lightning, shapes.explosion, shapes.sparkles],
          flat: true,
          scalar: 2.4,
          colors: ['#eab308', '#facc15', '#38bdf8', '#ffffff'],
          startVelocity: isMilestone ? 44 : 30,
          gravity: 0.5,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(250, 204, 21, 0.85)', 250);
          triggerScreenFlashVfx('rgba(250, 204, 21, 0.3)');
        }
        break;

      case 'diamond_rain':
        confetti({
          particleCount: Math.round(22 * countMultiplier),
          spread: 60,
          origin: { x, y },
          shapes: [shapes.diamond],
          flat: true,
          scalar: 2.4,
          colors: ['#06b6d4', '#67e8f9', '#ffffff'],
          startVelocity: isMilestone ? 40 : 26,
          gravity: 1.0,
        });
        break;

      case 'infinite_void_burst':
        confetti({
          particleCount: Math.round(26 * countMultiplier),
          spread: 360,
          origin: { x, y },
          shapes: [shapes.eye, shapes.spiral],
          flat: true,
          scalar: 2.4,
          colors: ['#38bdf8', '#a78bfa', '#e0f2fe', '#ffffff'],
          startVelocity: isMilestone ? 36 : 24,
          gravity: 0.2,
          decay: 0.91,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(167, 139, 250, 0.85)', 270);
          triggerScreenFlashVfx('rgba(167, 139, 250, 0.28)');
        }
        break;

      case 'gear_second_steam':
        confetti({
          particleCount: Math.round(26 * countMultiplier),
          spread: 55,
          angle: 90,
          origin: { x, y },
          shapes: [shapes.steam, shapes.flame],
          flat: true,
          scalar: 2.4,
          colors: ['#fb7185', '#f43f5e', '#ffffff'],
          startVelocity: isMilestone ? 44 : 29,
          gravity: 0.55,
        });
        break;

      case 'gaster_bone_barrage':
        // 1. Entidades Primárias (Heróis): 3 ossos e caveiras grandes e nítidos
        confetti({
          particleCount: Math.round(3 * countMultiplier),
          spread: 70,
          origin: { x, y },
          shapes: [shapes.skull, shapes.bone],
          flat: true,
          scalar: 3.0,
          startVelocity: isMilestone ? 42 : 28,
          gravity: 0.5,
        });
        // 2. Micro-debris de plasma ciano velozes (dissipação em 300ms)
        confetti({
          particleCount: Math.round(20 * countMultiplier),
          spread: 110,
          origin: { x, y },
          shapes: ['circle'],
          colors: ['#06b6d4', '#67e8f9', '#ffffff'],
          scalar: 0.45,
          startVelocity: isMilestone ? 54 : 36,
          gravity: 0.7,
          ticks: 55,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(6, 182, 212, 0.8)', 210);
        }
        break;

      case 'sandevistan_afterimage':
        confetti({
          particleCount: Math.round(26 * countMultiplier),
          spread: 85,
          origin: { x, y },
          shapes: [shapes.lightning, shapes.steam],
          flat: true,
          scalar: 2.4,
          colors: ['#facc15', '#38bdf8', '#ffffff'],
          startVelocity: isMilestone ? 50 : 34,
          gravity: 0.4,
        });
        if (isMilestone) {
          triggerScreenShakeVfx();
          triggerScreenFlashVfx('rgba(250, 204, 21, 0.3)');
        }
        break;

      case 'water_flame_dragon':
        confetti({
          particleCount: Math.round(26 * countMultiplier),
          spread: 90,
          origin: { x, y },
          shapes: [shapes.waterWave, shapes.flame],
          flat: true,
          scalar: 2.4,
          colors: ['#38bdf8', '#f97316', '#fbbf24', '#ffffff'],
          startVelocity: isMilestone ? 46 : 32,
          gravity: 0.75,
        });
        break;

      case 'thunder_storm_vfx':
        confetti({
          particleCount: Math.round(24 * countMultiplier),
          spread: 75,
          origin: { x, y },
          shapes: [shapes.lightning, shapes.sparkles],
          flat: true,
          scalar: 2.4,
          colors: ['#facc15', '#38bdf8', '#ffffff'],
          startVelocity: isMilestone ? 55 : 38,
          gravity: 0.45,
        });
        if (isMilestone) {
          triggerScreenFlashVfx('rgba(250, 204, 21, 0.35)');
          triggerShockwaveVfx(x, y, 'rgba(250, 204, 21, 0.8)', 220);
        }
        break;

      case 'serious_shockwave':
        // 1. Entidades Primárias: 2 punhos gigantes e explosão cataclísmica
        confetti({
          particleCount: Math.round(2 * countMultiplier),
          spread: 80,
          origin: { x, y },
          shapes: [shapes.fist, shapes.explosion],
          flat: true,
          scalar: 3.4,
          startVelocity: isMilestone ? 46 : 30,
          gravity: 0.6,
        });
        // 2. Micro-debris de impacto
        confetti({
          particleCount: Math.round(24 * countMultiplier),
          spread: 160,
          origin: { x, y },
          shapes: ['circle'],
          colors: ['#ef4444', '#fca5a5', '#ffffff'],
          scalar: 0.45,
          startVelocity: isMilestone ? 58 : 38,
          gravity: 0.7,
          ticks: 50,
        });
        triggerShockwaveVfx(x, y, 'rgba(239, 68, 68, 0.85)', isMilestone ? 320 : 190);
        triggerScreenShakeVfx();
        if (isMilestone) {
          triggerScreenFlashVfx('rgba(239, 68, 68, 0.3)');
        }
        break;

      case 'soul_vessel_burst':
        confetti({
          particleCount: Math.round(22 * countMultiplier),
          spread: 110,
          origin: { x, y },
          shapes: [shapes.ghost, shapes.sword],
          flat: true,
          scalar: 2.4,
          colors: ['#dbeafe', '#7dd3fc', '#ffffff'],
          startVelocity: isMilestone ? 28 : 18,
          gravity: 0.28,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(125, 211, 252, 0.75)', 200);
        }
        break;

      case 'golden_ring_burst':
        confetti({
          particleCount: Math.round(22 * countMultiplier),
          spread: 120,
          origin: { x, y },
          shapes: [shapes.ring, shapes.goldCoin],
          flat: true,
          scalar: 2.4,
          colors: ['#fde047', '#fbbf24', '#ffffff'],
          startVelocity: isMilestone ? 40 : 26,
          gravity: 0.65,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(253, 224, 71, 0.8)', 220);
        }
        break;

      case 'bat_swarm_vfx':
        // 1. Entidades Primárias (Heróis): 3 morcegos grandes em ascensão
        confetti({
          particleCount: Math.round(3 * countMultiplier),
          spread: 60,
          angle: 90,
          origin: { x, y },
          shapes: [shapes.bat],
          flat: true,
          scalar: 3.2,
          startVelocity: isMilestone ? 40 : 26,
          gravity: 0.3,
        });
        // 2. Micro-debris sombrios e faíscas âmbar
        confetti({
          particleCount: Math.round(18 * countMultiplier),
          spread: 100,
          origin: { x, y },
          shapes: ['circle'],
          colors: ['#fbbf24', '#f59e0b', '#18181b'],
          scalar: 0.4,
          startVelocity: isMilestone ? 46 : 30,
          gravity: 0.6,
          ticks: 55,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(245, 158, 11, 0.65)', 190);
        }
        break;

      case 'whatsapp_bubbles_burst':
        confetti({
          particleCount: Math.round(5 * countMultiplier),
          spread: 60,
          angle: 90,
          origin: { x, y },
          shapes: [shapes.chatBubble, shapes.checkMark],
          flat: true,
          scalar: 2.8,
          startVelocity: isMilestone ? 42 : 28,
          gravity: 0.5,
        });
        confetti({
          particleCount: Math.round(20 * countMultiplier),
          spread: 80,
          origin: { x, y },
          shapes: ['circle'],
          colors: ['#25d366', '#53bdeb', '#005c4b', '#ffffff'],
          scalar: 0.5,
          startVelocity: isMilestone ? 44 : 26,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(37, 211, 102, 0.65)', 200);
        }
        break;

      case 'instagram_hearts_glow':
        confetti({
          particleCount: Math.round(6 * countMultiplier),
          spread: 70,
          angle: 90,
          origin: { x, y },
          shapes: [shapes.heartGlow],
          flat: true,
          scalar: 2.8,
          startVelocity: isMilestone ? 44 : 30,
          gravity: 0.45,
        });
        confetti({
          particleCount: Math.round(22 * countMultiplier),
          spread: 90,
          origin: { x, y },
          shapes: ['circle', 'star'],
          colors: ['#e1306c', '#f77737', '#fa7e1e', '#c13584'],
          scalar: 0.5,
          startVelocity: isMilestone ? 45 : 28,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(225, 48, 108, 0.65)', 210);
        }
        break;

      case 'youtube_play_spark':
        confetti({
          particleCount: Math.round(5 * countMultiplier),
          spread: 60,
          angle: 90,
          origin: { x, y },
          shapes: [shapes.playButton],
          flat: true,
          scalar: 3.0,
          startVelocity: isMilestone ? 45 : 32,
          gravity: 0.5,
        });
        confetti({
          particleCount: Math.round(24 * countMultiplier),
          spread: 85,
          origin: { x, y },
          shapes: ['square', 'circle'],
          colors: ['#ff0000', '#ffffff', '#991b1b', '#fca5a5'],
          scalar: 0.5,
          startVelocity: isMilestone ? 46 : 30,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(255, 0, 0, 0.65)', 210);
        }
        break;

      case 'tiktok_music_glitch':
        confetti({
          particleCount: Math.round(6 * countMultiplier),
          spread: 65,
          angle: 90,
          origin: { x, y },
          shapes: [shapes.musicNote],
          flat: true,
          scalar: 2.8,
          startVelocity: isMilestone ? 44 : 30,
          gravity: 0.4,
        });
        confetti({
          particleCount: Math.round(24 * countMultiplier),
          spread: 100,
          origin: { x, y },
          shapes: ['square'],
          colors: ['#00f2fe', '#fe2c55', '#ffffff', '#010101'],
          scalar: 0.5,
          startVelocity: isMilestone ? 48 : 32,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(0, 242, 254, 0.7)', 220);
        }
        break;

      case 'roblox_blocks_fall':
        confetti({
          particleCount: Math.round(6 * countMultiplier),
          spread: 75,
          angle: 90,
          origin: { x, y },
          shapes: [shapes.blockCube],
          flat: true,
          scalar: 3.0,
          startVelocity: isMilestone ? 42 : 28,
          gravity: 0.6,
        });
        confetti({
          particleCount: Math.round(22 * countMultiplier),
          spread: 80,
          origin: { x, y },
          shapes: ['square'],
          colors: ['#e2231a', '#00a2ff', '#fbbf24', '#22c55e', '#ffffff'],
          scalar: 0.6,
          startVelocity: isMilestone ? 45 : 30,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(226, 35, 26, 0.65)', 200);
        }
        break;

      default:
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { x, y },
          colors: ['#10b981', '#38bdf8', '#fbbf24']
        });
        break;
    }
  } catch (err) {
    console.warn('triggerUpgradePurchaseVfx error (silenced):', err);
  }
}


/**
 * Dispara a celebração visual em tela cheia quando o aluno sobe de nível
 */
export function triggerLevelUpCelebrationVfx(style: AnimationEffectId | string = 'confetti_classic') {
  try {
    const shapes = getShapes();

    switch (style) {
    case 'confetti_classic': {
      // Canhão duplo lateral + explosão festiva central
      confetti({
        particleCount: 75,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.8 },
        shapes: ['circle', 'square'],
        colors: ['#10b981', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
      });
      confetti({
        particleCount: 75,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.8 },
        shapes: ['circle', 'square'],
        colors: ['#10b981', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 55,
          spread: 100,
          origin: { x: 0.5, y: 0.5 },
          shapes: ['circle', 'star'],
          colors: ['#10b981', '#38bdf8', '#fbbf24'],
        });
      }, 350);
      break;
    }

    case 'golden_coins': {
      // Chuva em 3 colunas de moedas cunhadas 🪙 + shockwave dourada
      triggerShockwaveVfx(0.5, 0.4, 'rgba(251, 191, 36, 0.85)', 300);
      const drops = [0.25, 0.5, 0.75];
      drops.forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 35,
            spread: 55,
            angle: 270,
            origin: { x: posX, y: 0.05 },
            shapes: [shapes.goldCoin],
            flat: true,
            scalar: 2.4,
            colors: ['#fbbf24', '#f59e0b', '#d97706'],
            startVelocity: 32,
            gravity: 0.95,
          });
        }, idx * 220);
      });
      break;
    }

    case 'matrix_stream': {
      // Cortina de dados binários Matrix (1s e 0s) caindo por 4 colunas
      const columns = [0.15, 0.38, 0.62, 0.85];
      columns.forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 36,
            spread: 25,
            angle: 270,
            origin: { x: posX, y: 0 },
            shapes: [shapes.binaryOne, shapes.binaryZero],
            flat: true,
            scalar: 2.2,
            colors: ['#22c55e', '#16a34a', '#86efac'],
            startVelocity: 38,
            gravity: 0.8,
            ticks: 180,
          });
        }, idx * 180);
      });
      break;
    }

    case 'supernova_burst': {
      // Detonação cósmica com shockwave roxa, estrelas ⭐ e explosão 💥
      triggerScreenFlashVfx('rgba(168, 85, 247, 0.35)');
      triggerShockwaveVfx(0.5, 0.45, 'rgba(168, 85, 247, 0.9)', 350);
      confetti({
        particleCount: 55,
        spread: 360,
        origin: { x: 0.5, y: 0.45 },
        shapes: [shapes.star, shapes.explosion],
        flat: true,
        scalar: 2.5,
        colors: ['#c084fc', '#a855f7', '#38bdf8', '#ffffff'],
        startVelocity: 42,
        decay: 0.93,
      });
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 360,
          origin: { x: 0.5, y: 0.45 },
          shapes: [shapes.star, shapes.sparkles],
          flat: true,
          scalar: 2.4,
          colors: ['#ffffff', '#38bdf8', '#c084fc'],
          startVelocity: 26,
          decay: 0.9,
        });
      }, 300);
      break;
    }

    case 'tesla_lightning': {
      // Descargas de relâmpagos cruzados ⚡ dos cantos superiores com clarão elétrico
      triggerScreenFlashVfx('rgba(56, 189, 248, 0.4)');
      triggerShockwaveVfx(0.5, 0.35, 'rgba(56, 189, 248, 0.85)', 300);
      confetti({
        particleCount: 35,
        spread: 90,
        angle: 300,
        origin: { x: 0.2, y: 0.1 },
        shapes: [shapes.lightning],
        flat: true,
        scalar: 2.5,
        colors: ['#38bdf8', '#0ea5e9', '#60a5fa', '#ffffff'],
        startVelocity: 55,
        decay: 0.88,
        gravity: 0.45,
      });
      setTimeout(() => {
        confetti({
          particleCount: 35,
          spread: 90,
          angle: 240,
          origin: { x: 0.8, y: 0.1 },
          shapes: [shapes.lightning],
          flat: true,
          scalar: 2.5,
          colors: ['#38bdf8', '#0ea5e9', '#60a5fa', '#ffffff'],
          startVelocity: 55,
          decay: 0.88,
          gravity: 0.45,
        });
      }, 200);
      break;
    }

    case 'volcano_flame': {
      // Erupção de chamas vulcânicas 🔥 disparando do rodapé para o alto
      triggerScreenShakeVfx();
      triggerShockwaveVfx(0.5, 0.95, 'rgba(239, 68, 68, 0.85)', 340);
      confetti({
        particleCount: 60,
        spread: 50,
        angle: 90,
        origin: { x: 0.5, y: 1.0 },
        shapes: [shapes.flame],
        flat: true,
        scalar: 2.5,
        colors: ['#ef4444', '#f97316', '#fbbf24'],
        startVelocity: 65,
        gravity: 0.9,
      });
      setTimeout(() => {
        confetti({
          particleCount: 45,
          spread: 60,
          angle: 90,
          origin: { x: 0.5, y: 0.9 },
          shapes: [shapes.flame],
          flat: true,
          scalar: 2.4,
          colors: ['#f97316', '#fbbf24', '#ffffff'],
          startVelocity: 50,
          gravity: 0.85,
        });
      }, 250);
      break;
    }

    case 'cyber_neon': {
      // Cruzamento laser synthwave com faíscas ✨ e relâmpagos neon ⚡
      triggerShockwaveVfx(0.5, 0.5, 'rgba(236, 72, 153, 0.85)', 310);
      confetti({
        particleCount: 45,
        spread: 50,
        angle: 45,
        origin: { x: 0.1, y: 0.85 },
        shapes: [shapes.sparkles, shapes.lightning],
        flat: true,
        scalar: 2.4,
        colors: ['#ec4899', '#f43f5e', '#ffffff'],
        startVelocity: 50,
      });
      confetti({
        particleCount: 45,
        spread: 50,
        angle: 135,
        origin: { x: 0.9, y: 0.85 },
        shapes: [shapes.sparkles, shapes.lightning],
        flat: true,
        scalar: 2.4,
        colors: ['#06b6d4', '#67e8f9', '#ffffff'],
        startVelocity: 50,
      });
      break;
    }

    case 'pixel_retro': {
      // Chuva arcade de space invaders 👾 e corações pixelados ❤️
      confetti({
        particleCount: 50,
        spread: 80,
        angle: 90,
        origin: { x: 0.5, y: 0.7 },
        shapes: [shapes.pixelMonster, shapes.pixelHeart],
        flat: true,
        scalar: 2.5,
        colors: ['#22c55e', '#eab308', '#ef4444', '#a855f7'],
        startVelocity: 45,
        gravity: 1.0,
      });
      break;
    }

    case 'fireworks_show': {
      // Salva de fogos pirotécnicos 🎆 em 3 momentos com centelhas ✨
      const fireworks = [
        { x: 0.3, y: 0.35, colors: ['#f43f5e', '#fbbf24', '#ffffff'] },
        { x: 0.7, y: 0.3, colors: ['#38bdf8', '#a855f7', '#ffffff'] },
        { x: 0.5, y: 0.22, colors: ['#fbbf24', '#f59e0b', '#ffffff'] },
      ];
      fireworks.forEach((fw, idx) => {
        setTimeout(() => {
          triggerShockwaveVfx(fw.x, fw.y, 'rgba(251, 191, 36, 0.75)', 190);
          confetti({
            particleCount: 35,
            spread: 360,
            origin: { x: fw.x, y: fw.y },
            shapes: [shapes.firework, shapes.sparkles],
            flat: true,
            scalar: 2.4,
            colors: fw.colors,
            startVelocity: 28,
            decay: 0.92,
          });
        }, idx * 250);
      });
      break;
    }

    case 'bubble_magic': {
      // Bolhas arcanas 🫧 ascendentes por toda a tela
      [0.2, 0.4, 0.6, 0.8].forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 24,
            spread: 50,
            angle: 90,
            origin: { x: posX, y: 1.0 },
            shapes: [shapes.bubble],
            flat: true,
            scalar: 2.5,
            colors: ['#67e8f9', '#c084fc', '#fbcfe8', '#a7f3d0'],
            startVelocity: 22,
            gravity: -0.25,
            ticks: 180,
          });
        }, idx * 150);
      });
      break;
    }

    case 'hyperspace_warp': {
      // Salto no hiperespaço: foguetes 🚀 e estrelas ⭐ do centro para as bordas + flash
      triggerScreenFlashVfx('rgba(56, 189, 248, 0.35)');
      triggerShockwaveVfx(0.5, 0.5, 'rgba(56, 189, 248, 0.85)', 340);
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          confetti({
            particleCount: 45,
            spread: 360,
            origin: { x: 0.5, y: 0.5 },
            shapes: [shapes.rocket, shapes.star],
            flat: true,
            scalar: 2.4,
            colors: ['#38bdf8', '#0284c7', '#ffffff'],
            startVelocity: 55 + i * 10,
            gravity: 0.2,
          });
        }, i * 200);
      }
      break;
    }

    case 'kamehameha_energy': {
      // Explosão de energia Ki dourada/celeste com raios ⚡, explosão 💥 e aura ✨
      triggerScreenFlashVfx('rgba(250, 204, 21, 0.38)');
      triggerShockwaveVfx(0.5, 0.45, 'rgba(250, 204, 21, 0.9)', 350);
      confetti({
        particleCount: 65,
        spread: 100,
        angle: 90,
        origin: { x: 0.5, y: 0.8 },
        shapes: [shapes.lightning, shapes.explosion, shapes.sparkles],
        flat: true,
        scalar: 2.5,
        colors: ['#eab308', '#facc15', '#38bdf8', '#ffffff'],
        startVelocity: 60,
        gravity: 0.55,
      });
      setTimeout(() => {
        confetti({
          particleCount: 45,
          spread: 360,
          origin: { x: 0.5, y: 0.4 },
          shapes: [shapes.lightning, shapes.sparkles],
          flat: true,
          scalar: 2.4,
          colors: ['#fef08a', '#38bdf8', '#ffffff'],
          startVelocity: 40,
        });
      }, 300);
      break;
    }

    case 'diamond_rain': {
      // Chuva intensa de diamantes facetados 💎 do topo da tela
      [0.2, 0.4, 0.6, 0.8].forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 28,
            spread: 45,
            angle: 270,
            origin: { x: posX, y: 0 },
            shapes: [shapes.diamond],
            flat: true,
            scalar: 2.4,
            colors: ['#06b6d4', '#22c55e', '#67e8f9', '#ffffff'],
            startVelocity: 35,
            gravity: 1.1,
          });
        }, idx * 120);
      });
      break;
    }

    case 'infinite_void_burst': {
      // Expansão do Vazio Infinito: olhos singulares 👁️ e espirais do domínio 🌀
      triggerScreenFlashVfx('rgba(167, 139, 250, 0.35)');
      triggerShockwaveVfx(0.5, 0.5, 'rgba(167, 139, 250, 0.9)', 380);
      confetti({
        particleCount: 60,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
        shapes: [shapes.eye, shapes.spiral],
        flat: true,
        scalar: 2.5,
        colors: ['#38bdf8', '#a78bfa', '#e0f2fe', '#ffffff'],
        startVelocity: 36,
        gravity: 0.2,
        decay: 0.9,
      });
      break;
    }

    case 'gear_second_steam': {
      // Jatos ascendentes de vapor 💨 Gear Second com chamas de espírito de luta 🔥
      [0.2, 0.5, 0.8].forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 40,
            spread: 60,
            angle: 90,
            origin: { x: posX, y: 0.9 },
            shapes: [shapes.steam, shapes.flame],
            flat: true,
            scalar: 2.4,
            colors: ['#fb7185', '#f43f5e', '#ffffff'],
            startVelocity: 44,
            gravity: 0.6,
          });
        }, idx * 200);
      });
      break;
    }

    case 'gaster_bone_barrage': {
      // Barragem cruzada de crânios 💀 e ossos 🦴 de Sans
      triggerShockwaveVfx(0.5, 0.5, 'rgba(6, 182, 212, 0.85)', 300);
      [0.2, 0.5, 0.8].forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 32,
            spread: 90,
            origin: { x: posX, y: 0.2 },
            shapes: [shapes.skull, shapes.bone],
            flat: true,
            scalar: 2.4,
            colors: ['#06b6d4', '#ffffff', '#e0f2fe'],
            startVelocity: 38,
            gravity: 0.58,
          });
        }, idx * 180);
      });
      break;
    }

    case 'sandevistan_afterimage': {
      // Rastro ultra veloz de Sandevistan com relâmpagos ⚡ e esteira de vapor 💨
      triggerScreenShakeVfx();
      triggerScreenFlashVfx('rgba(250, 204, 21, 0.32)');
      triggerShockwaveVfx(0.5, 0.42, 'rgba(250, 204, 21, 0.85)', 310);
      confetti({
        particleCount: 65,
        spread: 120,
        origin: { x: 0.5, y: 0.42 },
        shapes: [shapes.lightning, shapes.steam],
        flat: true,
        scalar: 2.4,
        colors: ['#facc15', '#38bdf8', '#ffffff'],
        startVelocity: 44,
        decay: 0.9,
        gravity: 0.42,
      });
      break;
    }

    case 'water_flame_dragon': {
      // Fusão espiral da Dança do Dragão de Fogo 🔥 e Ondas de Água 🌊
      [0.25, 0.5, 0.75].forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 36,
            spread: 90,
            origin: { x: posX, y: 0.75 },
            shapes: [shapes.waterWave, shapes.flame],
            flat: true,
            scalar: 2.4,
            colors: ['#38bdf8', '#f97316', '#fbbf24', '#ffffff'],
            startVelocity: 44,
            gravity: 0.78,
          });
        }, idx * 200);
      });
      break;
    }

    case 'thunder_storm_vfx': {
      // Tempestade furiosa de relâmpagos ⚡ amarelos com clarões
      triggerScreenFlashVfx('rgba(250, 204, 21, 0.4)');
      triggerShockwaveVfx(0.5, 0.35, 'rgba(250, 204, 21, 0.9)', 340);
      confetti({
        particleCount: 60,
        spread: 120,
        origin: { x: 0.5, y: 0.3 },
        shapes: [shapes.lightning],
        flat: true,
        scalar: 2.5,
        colors: ['#facc15', '#38bdf8', '#ffffff'],
        startVelocity: 52,
        gravity: 0.48,
      });
      break;
    }

    case 'serious_shockwave': {
      // Impacto cataclísmico do Soco Sério de Saitama (Punho 👊 e Explosão 💥)
      triggerShockwaveVfx(0.5, 0.5, 'rgba(239, 68, 68, 0.95)', 420);
      triggerScreenShakeVfx();
      triggerScreenFlashVfx('rgba(239, 68, 68, 0.4)');
      confetti({
        particleCount: 65,
        spread: 180,
        origin: { x: 0.5, y: 0.55 },
        shapes: [shapes.fist, shapes.explosion],
        flat: true,
        scalar: 3.0,
        colors: ['#ef4444', '#fca5a5', '#ffffff'],
        startVelocity: 48,
        gravity: 0.65,
      });
      break;
    }

    case 'soul_vessel_burst': {
      // Libertação etérea de sombras 👻 e agulha pura 🗡️
      triggerShockwaveVfx(0.5, 0.5, 'rgba(125, 211, 252, 0.8)', 280);
      confetti({
        particleCount: 50,
        spread: 140,
        origin: { x: 0.5, y: 0.5 },
        shapes: [shapes.ghost, shapes.sword],
        flat: true,
        scalar: 2.4,
        colors: ['#dbeafe', '#7dd3fc', '#ffffff'],
        startVelocity: 28,
        gravity: 0.28,
      });
      break;
    }

    case 'golden_ring_burst': {
      // Dispersão supersônica de anéis dourados 💍 e moedas 🪙 em 3 ondas
      triggerShockwaveVfx(0.5, 0.5, 'rgba(253, 224, 71, 0.9)', 320);
      [0.2, 0.5, 0.8].forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 32,
            spread: 120,
            origin: { x: posX, y: 0.4 },
            shapes: [shapes.ring, shapes.goldCoin],
            flat: true,
            scalar: 2.4,
            colors: ['#fde047', '#fbbf24', '#ffffff'],
            startVelocity: 36,
            gravity: 0.65,
          });
        }, idx * 180);
      });
      break;
    }

    case 'bat_swarm_vfx': {
      // Revoada de morcegos góticos 🦇 saindo das sombras em ascensão
      triggerShockwaveVfx(0.5, 0.6, 'rgba(245, 158, 11, 0.7)', 260);
      confetti({
        particleCount: 55,
        spread: 110,
        angle: 90,
        origin: { x: 0.5, y: 0.75 },
        shapes: [shapes.bat],
        flat: true,
        scalar: 2.6,
        colors: ['#111827', '#374151', '#f59e0b'],
        startVelocity: 42,
        gravity: 0.3,
      });
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 90,
          angle: 90,
          origin: { x: 0.5, y: 0.8 },
          shapes: [shapes.bat],
          flat: true,
          scalar: 2.5,
          colors: ['#111827', '#1f2937', '#f59e0b'],
          startVelocity: 36,
          gravity: 0.25,
        });
      }, 200);
      break;
    }

    case 'whatsapp_bubbles_burst': {
      triggerShockwaveVfx(0.5, 0.4, 'rgba(37, 211, 102, 0.85)', 320);
      confetti({
        particleCount: 50,
        spread: 80,
        angle: 90,
        origin: { x: 0.5, y: 0.7 },
        shapes: [shapes.chatBubble, shapes.checkMark],
        flat: true,
        scalar: 3.2,
        startVelocity: 44,
        gravity: 0.4,
      });
      confetti({
        particleCount: 70,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        shapes: ['circle'],
        colors: ['#25d366', '#53bdeb', '#005c4b', '#ffffff'],
        scalar: 0.8,
        startVelocity: 42,
      });
      break;
    }

    case 'instagram_hearts_glow': {
      triggerShockwaveVfx(0.5, 0.4, 'rgba(225, 48, 108, 0.85)', 320);
      confetti({
        particleCount: 55,
        spread: 85,
        angle: 90,
        origin: { x: 0.5, y: 0.65 },
        shapes: [shapes.heartGlow],
        flat: true,
        scalar: 3.2,
        startVelocity: 46,
        gravity: 0.35,
      });
      confetti({
        particleCount: 75,
        spread: 110,
        origin: { x: 0.5, y: 0.5 },
        shapes: ['circle', 'star'],
        colors: ['#e1306c', '#f77737', '#fa7e1e', '#c13584'],
        scalar: 0.8,
        startVelocity: 44,
      });
      break;
    }

    case 'youtube_play_spark': {
      triggerShockwaveVfx(0.5, 0.4, 'rgba(255, 0, 0, 0.85)', 320);
      confetti({
        particleCount: 50,
        spread: 75,
        angle: 90,
        origin: { x: 0.5, y: 0.65 },
        shapes: [shapes.playButton],
        flat: true,
        scalar: 3.4,
        startVelocity: 48,
        gravity: 0.45,
      });
      confetti({
        particleCount: 80,
        spread: 105,
        origin: { x: 0.5, y: 0.5 },
        shapes: ['square', 'circle'],
        colors: ['#ff0000', '#ffffff', '#991b1b', '#fca5a5'],
        scalar: 0.8,
        startVelocity: 46,
      });
      break;
    }

    case 'tiktok_music_glitch': {
      triggerShockwaveVfx(0.5, 0.4, 'rgba(0, 242, 254, 0.9)', 340);
      confetti({
        particleCount: 55,
        spread: 80,
        angle: 90,
        origin: { x: 0.5, y: 0.65 },
        shapes: [shapes.musicNote],
        flat: true,
        scalar: 3.2,
        startVelocity: 48,
        gravity: 0.35,
      });
      confetti({
        particleCount: 80,
        spread: 115,
        origin: { x: 0.5, y: 0.5 },
        shapes: ['square'],
        colors: ['#00f2fe', '#fe2c55', '#ffffff'],
        scalar: 0.8,
        startVelocity: 50,
      });
      break;
    }

    case 'roblox_blocks_fall': {
      triggerShockwaveVfx(0.5, 0.4, 'rgba(226, 35, 26, 0.85)', 320);
      confetti({
        particleCount: 55,
        spread: 85,
        angle: 90,
        origin: { x: 0.5, y: 0.65 },
        shapes: [shapes.blockCube],
        flat: true,
        scalar: 3.4,
        startVelocity: 46,
        gravity: 0.55,
      });
      confetti({
        particleCount: 75,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        shapes: ['square'],
        colors: ['#e2231a', '#00a2ff', '#fbbf24', '#22c55e', '#ffffff'],
        scalar: 0.9,
        startVelocity: 45,
      });
      break;
    }

    default:
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.5, y: 0.6 },
        shapes: ['circle', 'square'],
        colors: ['#10b981', '#38bdf8', '#fbbf24'],
      });
      break;
    }
  } catch (err) {
    console.warn('triggerLevelUpCelebrationVfx error (silenced):', err);
  }
}

/**
 * Retorna as classes CSS dinâmicas aplicadas às letras do terminal de digitação
 */
export function getLetterVfxClasses(
  style: AnimationEffectId | string = 'confetti_classic',
  isDone: boolean,
  isCurrent: boolean,
  isJustTyped: boolean
): string {
  if (isJustTyped) {
    switch (style) {
      case 'confetti_classic':
        return 'animate-letter-confetti text-emerald-400';
      case 'golden_coins':
        return 'animate-letter-gold text-amber-300 font-black';
      case 'matrix_stream':
        return 'animate-letter-matrix text-green-400';
      case 'supernova_burst':
        return 'animate-letter-supernova text-purple-300';
      case 'tesla_lightning':
        return 'animate-letter-tesla text-sky-300';
      case 'volcano_flame':
        return 'animate-letter-volcano text-orange-400 font-black';
      case 'cyber_neon':
        return 'animate-letter-neon text-pink-400';
      case 'pixel_retro':
        return 'animate-letter-pixel text-yellow-300 font-bold';
      case 'fireworks_show':
        return 'animate-letter-fireworks text-rose-300';
      case 'bubble_magic':
        return 'animate-letter-bubble text-cyan-300';
      case 'hyperspace_warp':
        return 'animate-letter-neon text-sky-200 font-bold';
      case 'kamehameha_energy':
        return 'animate-letter-volcano text-amber-300 font-extrabold';
      case 'diamond_rain':
        return 'animate-letter-pixel text-cyan-300 font-bold';
      case 'infinite_void_burst':
        return 'animate-letter-supernova text-cyan-200 font-bold';
      case 'gear_second_steam':
        return 'animate-letter-volcano text-rose-300 font-black';
      case 'gaster_bone_barrage':
        return 'animate-letter-matrix text-cyan-300';
      case 'sandevistan_afterimage':
        return 'animate-letter-neon text-yellow-200 font-bold';
      case 'water_flame_dragon':
        return 'animate-letter-volcano text-orange-300 font-black';
      case 'thunder_storm_vfx':
        return 'animate-letter-tesla text-yellow-200 font-bold';
      case 'serious_shockwave':
        return 'animate-letter-volcano text-red-300 font-black';
      case 'soul_vessel_burst':
        return 'animate-letter-bubble text-sky-200';
      case 'golden_ring_burst':
        return 'animate-letter-gold text-yellow-200 font-black';
      case 'bat_swarm_vfx':
        return 'animate-letter-neon text-amber-200 font-bold';
      default:
        return 'animate-letter-confetti';
    }
  }

  if (isDone) {
    switch (style) {
      case 'golden_coins':
        return 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]';
      case 'matrix_stream':
        return 'text-emerald-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.45)]';
      case 'supernova_burst':
        return 'text-purple-300 drop-shadow-[0_0_6px_rgba(168,85,247,0.45)]';
      case 'tesla_lightning':
        return 'text-sky-300 drop-shadow-[0_0_6px_rgba(14,165,233,0.45)]';
      case 'volcano_flame':
        return 'text-orange-400 drop-shadow-[0_0_6px_rgba(249,115,22,0.45)]';
      case 'cyber_neon':
        return 'text-pink-400 drop-shadow-[0_0_6px_rgba(236,72,153,0.45)]';
      case 'pixel_retro':
        return 'text-yellow-300 drop-shadow-[1px_1px_0_#000]';
      case 'fireworks_show':
        return 'text-rose-300 drop-shadow-[0_0_6px_rgba(244,63,94,0.45)]';
      case 'bubble_magic':
        return 'text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]';
      case 'hyperspace_warp':
        return 'text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]';
      case 'kamehameha_energy':
        return 'text-amber-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.55)]';
      case 'diamond_rain':
        return 'text-cyan-300 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]';
      case 'infinite_void_burst':
        return 'text-cyan-200 drop-shadow-[0_0_8px_rgba(56,189,248,0.55)]';
      case 'gear_second_steam':
        return 'text-rose-300 drop-shadow-[0_0_8px_rgba(251,113,133,0.55)]';
      case 'gaster_bone_barrage':
        return 'text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.55)]';
      case 'sandevistan_afterimage':
        return 'text-yellow-200 drop-shadow-[0_0_8px_rgba(250,204,21,0.55)]';
      case 'water_flame_dragon':
        return 'text-orange-300 drop-shadow-[0_0_8px_rgba(249,115,22,0.55)]';
      case 'thunder_storm_vfx':
        return 'text-yellow-200 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]';
      case 'serious_shockwave':
        return 'text-red-300 drop-shadow-[0_0_8px_rgba(239,68,68,0.55)]';
      case 'soul_vessel_burst':
        return 'text-sky-200 drop-shadow-[0_0_8px_rgba(125,211,252,0.55)]';
      case 'golden_ring_burst':
        return 'text-yellow-200 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]';
      case 'bat_swarm_vfx':
        return 'text-amber-200 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]';
      case 'whatsapp_bubbles_burst':
        return 'text-[#25d366] drop-shadow-[0_0_8px_rgba(37,211,102,0.55)]';
      case 'instagram_hearts_glow':
        return 'text-[#e1306c] drop-shadow-[0_0_8px_rgba(225,48,108,0.55)]';
      case 'youtube_play_spark':
        return 'text-[#ff3333] drop-shadow-[0_0_8px_rgba(255,0,0,0.6)]';
      case 'tiktok_music_glitch':
        return 'text-[#00f2fe] drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]';
      case 'roblox_blocks_fall':
        return 'text-[#00a2ff] drop-shadow-[0_0_8px_rgba(0,162,255,0.6)]';
      default:
        return '';
    }
  }

  if (isCurrent) {
    switch (style) {
      case 'golden_coins':
        return 'ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
      case 'matrix_stream':
        return 'ring-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
      case 'supernova_burst':
        return 'ring-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.45)]';
      case 'tesla_lightning':
        return 'ring-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.45)]';
      case 'volcano_flame':
        return 'ring-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.45)]';
      case 'cyber_neon':
        return 'ring-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]';
      case 'pixel_retro':
        return 'ring-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]';
      case 'fireworks_show':
        return 'ring-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.45)]';
      case 'bubble_magic':
        return 'ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]';
      case 'hyperspace_warp':
        return 'ring-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]';
      case 'kamehameha_energy':
        return 'ring-amber-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]';
      case 'diamond_rain':
        return 'ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]';
      case 'infinite_void_burst':
        return 'ring-cyan-300 shadow-[0_0_18px_rgba(56,189,248,0.55)]';
      case 'gear_second_steam':
        return 'ring-rose-400 shadow-[0_0_18px_rgba(244,63,94,0.55)]';
      case 'gaster_bone_barrage':
        return 'ring-cyan-400 shadow-[0_0_18px_rgba(103,232,249,0.6)]';
      case 'sandevistan_afterimage':
        return 'ring-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.6)]';
      case 'water_flame_dragon':
        return 'ring-orange-400 shadow-[0_0_18px_rgba(249,115,22,0.58)]';
      case 'thunder_storm_vfx':
        return 'ring-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.6)]';
      case 'serious_shockwave':
        return 'ring-red-400 shadow-[0_0_18px_rgba(239,68,68,0.6)]';
      case 'soul_vessel_burst':
        return 'ring-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.6)]';
      case 'golden_ring_burst':
        return 'ring-yellow-300 shadow-[0_0_18px_rgba(253,224,71,0.6)]';
      case 'bat_swarm_vfx':
        return 'ring-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.55)]';
      case 'whatsapp_bubbles_burst':
        return 'ring-[#25d366] shadow-[0_0_18px_rgba(37,211,102,0.55)]';
      case 'instagram_hearts_glow':
        return 'ring-[#f77737] shadow-[0_0_18px_rgba(225,48,108,0.55)]';
      case 'youtube_play_spark':
        return 'ring-[#ff0000] shadow-[0_0_18px_rgba(255,0,0,0.6)]';
      case 'tiktok_music_glitch':
        return 'ring-[#fe2c55] shadow-[0_0_18px_rgba(254,44,85,0.6)]';
      case 'roblox_blocks_fall':
        return 'ring-[#e2231a] shadow-[0_0_18px_rgba(226,35,26,0.6)]';
      default:
        return '';
    }
  }

  return '';
}
