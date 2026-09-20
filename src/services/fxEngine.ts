import confetti from 'canvas-confetti';
import { AnimationEffectId } from '../types/cosmetics';

// Cache para formas customizadas (ImageBitmap / Emojis de alta resolução) via canvas-confetti
let cachedShapes: Record<string, confetti.Shape> | null = null;

function getShapes(): Record<string, confetti.Shape> {
  if (cachedShapes) return cachedShapes;

  const createEmojiShape = (
    text: string,
    scalar: number = 2.4,
    fallback: confetti.Shape = 'circle'
  ): confetti.Shape => {
    try {
      if (typeof window !== 'undefined' && typeof confetti.shapeFromText === 'function') {
        return confetti.shapeFromText({ text, scalar });
      }
    } catch (err) {
      console.warn(`[fxEngine] shapeFromText failed for "${text}":`, err);
    }
    return fallback;
  };

  cachedShapes = {
    bat: createEmojiShape('🦇', 2.5, 'circle'),
    skull: createEmojiShape('💀', 2.4, 'circle'),
    bone: createEmojiShape('🦴', 2.4, 'square'),
    lightning: createEmojiShape('⚡', 2.4, 'star'),
    ring: createEmojiShape('💍', 2.3, 'circle'),
    goldCoin: createEmojiShape('🪙', 2.4, 'circle'),
    diamond: createEmojiShape('💎', 2.4, 'square'),
    flame: createEmojiShape('🔥', 2.4, 'circle'),
    fist: createEmojiShape('👊', 2.7, 'square'),
    explosion: createEmojiShape('💥', 2.7, 'star'),
    steam: createEmojiShape('💨', 2.4, 'circle'),
    waterWave: createEmojiShape('🌊', 2.4, 'circle'),
    eye: createEmojiShape('👁️', 2.4, 'circle'),
    spiral: createEmojiShape('🌀', 2.4, 'circle'),
    ghost: createEmojiShape('👻', 2.4, 'circle'),
    sword: createEmojiShape('🗡️', 2.4, 'star'),
    pixelMonster: createEmojiShape('👾', 2.4, 'square'),
    pixelHeart: createEmojiShape('❤️', 2.4, 'square'),
    rocket: createEmojiShape('🚀', 2.4, 'star'),
    star: createEmojiShape('⭐', 2.4, 'star'),
    bubble: createEmojiShape('🫧', 2.4, 'circle'),
    sparkles: createEmojiShape('✨', 2.4, 'star'),
    firework: createEmojiShape('🎆', 2.4, 'star'),
    binaryOne: createEmojiShape('1', 2.1, 'square'),
    binaryZero: createEmojiShape('0', 2.1, 'square'),
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
        confetti({
          particleCount: Math.round(24 * countMultiplier),
          spread: 100,
          origin: { x, y },
          shapes: [shapes.skull, shapes.bone],
          flat: true,
          scalar: 2.4,
          colors: ['#06b6d4', '#ffffff', '#e0f2fe'],
          startVelocity: isMilestone ? 42 : 28,
          gravity: 0.55,
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
        confetti({
          particleCount: Math.round(24 * countMultiplier),
          spread: 120,
          origin: { x, y },
          shapes: [shapes.fist, shapes.explosion],
          flat: true,
          scalar: 2.8,
          colors: ['#ef4444', '#fca5a5', '#ffffff'],
          startVelocity: isMilestone ? 48 : 32,
          gravity: 0.65,
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
        confetti({
          particleCount: Math.round(22 * countMultiplier),
          spread: 90,
          angle: 90,
          origin: { x, y },
          shapes: [shapes.bat],
          flat: true,
          scalar: 2.5,
          colors: ['#111827', '#374151', '#f59e0b'],
          startVelocity: isMilestone ? 38 : 24,
          gravity: 0.35,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(245, 158, 11, 0.65)', 190);
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
      default:
        return '';
    }
  }

  return '';
}
