import confetti from 'canvas-confetti';
import { AnimationEffectId } from '../types/cosmetics';

// Cache para formas vetoriais SVG customizadas via canvas-confetti
let cachedShapes: Record<string, confetti.Shape> | null = null;

function getShapes(): Record<string, confetti.Shape> {
  if (cachedShapes) return cachedShapes;

  const createShape = (path: string, fallback: 'circle' | 'square' | 'star' = 'circle'): confetti.Shape => {
    try {
      if (typeof window !== 'undefined' && typeof Path2D === 'function' && typeof confetti.shapeFromPath === 'function') {
        return confetti.shapeFromPath({ path });
      }
    } catch {
      // Fallback gracioso para ambientes sem suporte a Path2D
    }
    return fallback;
  };

  cachedShapes = {
    lightning: createShape('M 12 0 L 2 13 L 9 13 L 3 24 L 18 10 L 11 10 Z', 'star'),
    bat: createShape('M 0 10 Q 7 0 14 6 Q 21 0 28 10 Q 24 16 14 18 Q 4 16 0 10 Z', 'circle'),
    ring: createShape('M 12 2 A 10 10 0 1 0 12 22 A 10 10 0 1 0 12 2 Z M 12 6 A 6 6 0 1 1 12 18 A 6 6 0 1 1 12 6 Z', 'circle'),
    bone: createShape('M 6 4 C 4 2 2 4 4 6 C 2 8 4 10 6 8 L 18 8 C 20 10 22 8 20 6 C 24 4 22 2 20 4 Z', 'square'),
    diamond: createShape('M 6 0 L 22 0 L 28 8 L 14 26 L 0 8 Z', 'square'),
    flame: createShape('M 10 0 C 14 6 18 10 16 16 C 14 22 8 26 10 30 C 6 26 2 20 4 14 C 5 10 8 4 10 0 Z', 'circle'),
    water: createShape('M 10 0 C 14 8 18 14 18 20 C 18 26 14 30 10 30 C 6 30 2 26 2 20 C 2 14 6 8 10 0 Z', 'circle'),
    starburst: createShape('M 12 0 Q 12 9 3 12 Q 12 15 12 24 Q 15 15 24 12 Q 15 9 12 0 Z', 'star'),
    pixelHeart: createShape('M 10 3 L 13 0 L 19 0 L 22 3 L 22 9 L 11 20 L 0 9 L 0 3 L 3 0 L 9 0 Z', 'square'),
    coin: createShape('M 12 2 A 10 10 0 1 0 12 22 A 10 10 0 1 0 12 2 Z M 12 5 A 7 7 0 1 1 12 19 A 7 7 0 1 1 12 5 Z', 'circle'),
    voidEye: createShape('M 12 0 A 12 12 0 1 0 12 24 A 12 12 0 1 0 12 0 Z M 12 8 A 4 4 0 1 1 12 16 A 4 4 0 1 1 12 8 Z', 'circle'),
    steam: createShape('M 8 16 A 6 6 0 0 1 14 10 A 8 8 0 0 1 24 11 A 5 5 0 0 1 28 16 A 6 6 0 0 1 22 22 L 8 22 A 6 6 0 0 1 8 16 Z', 'circle'),
    vessel: createShape('M 14 28 C 10 24 6 18 6 12 C 4 8 2 2 0 0 C 4 4 8 8 10 10 C 12 6 14 2 14 2 C 14 2 16 6 18 10 C 20 8 24 4 28 0 C 26 2 24 8 22 12 C 22 18 18 24 14 28 Z', 'star'),
    hyperspace: createShape('M 1 0 L 4 0 L 5 30 L 0 30 Z', 'square'),
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
          particleCount: Math.round(24 * countMultiplier),
          spread: 50,
          origin: { x, y },
          shapes: [shapes.coin, 'star'],
          colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a', '#ffffff'],
          startVelocity: isMilestone ? 42 : 28,
          gravity: 0.9,
          scalar: 1.3,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(251, 191, 36, 0.7)', 180);
        }
        break;

      case 'matrix_stream':
        confetti({
          particleCount: Math.round(30 * countMultiplier),
          spread: 28,
          angle: 90,
          origin: { x, y },
          shapes: ['square'],
          colors: ['#22c55e', '#16a34a', '#86efac', '#15803d', '#4ade80'],
          startVelocity: isMilestone ? 48 : 34,
          gravity: 0.65,
          ticks: 120,
          scalar: 0.95,
        });
        break;

      case 'supernova_burst':
        confetti({
          particleCount: Math.round(36 * countMultiplier),
          spread: 360,
          origin: { x, y },
          shapes: [shapes.starburst, 'circle'],
          colors: ['#c084fc', '#a855f7', '#38bdf8', '#e0e7ff', '#ffffff'],
          startVelocity: isMilestone ? 36 : 24,
          decay: 0.92,
          scalar: 1.2,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(168, 85, 247, 0.8)', 240);
          triggerScreenFlashVfx('rgba(168, 85, 247, 0.25)');
        }
        break;

      case 'tesla_lightning':
        confetti({
          particleCount: Math.round(28 * countMultiplier),
          spread: 85,
          origin: { x, y },
          shapes: [shapes.lightning, 'star'],
          colors: ['#38bdf8', '#0ea5e9', '#60a5fa', '#ffffff', '#e0f2fe'],
          startVelocity: isMilestone ? 55 : 38,
          decay: 0.86,
          gravity: 0.45,
          scalar: 1.15,
        });
        if (isMilestone) {
          triggerScreenFlashVfx('rgba(56, 189, 248, 0.35)');
          triggerShockwaveVfx(x, y, 'rgba(56, 189, 248, 0.75)', 190);
        }
        break;

      case 'volcano_flame':
        confetti({
          particleCount: Math.round(34 * countMultiplier),
          spread: 40,
          angle: 90,
          origin: { x, y },
          shapes: [shapes.flame, 'circle'],
          colors: ['#ef4444', '#f97316', '#fbbf24', '#b91c1c', '#ea580c'],
          startVelocity: isMilestone ? 52 : 36,
          gravity: 0.95,
          scalar: 1.2,
        });
        if (isMilestone) {
          triggerScreenShakeVfx();
          triggerShockwaveVfx(x, y, 'rgba(239, 68, 68, 0.75)', 200);
        }
        break;

      case 'cyber_neon':
        confetti({
          particleCount: Math.round(28 * countMultiplier),
          spread: 65,
          origin: { x, y },
          shapes: ['square', shapes.starburst],
          colors: ['#ec4899', '#06b6d4', '#f43f5e', '#67e8f9', '#ffffff'],
          startVelocity: isMilestone ? 44 : 30,
          scalar: 1.2,
        });
        break;

      case 'pixel_retro':
        confetti({
          particleCount: Math.round(30 * countMultiplier),
          spread: 60,
          origin: { x, y },
          shapes: [shapes.pixelHeart, 'square'],
          colors: ['#22c55e', '#eab308', '#3b82f6', '#ef4444', '#a855f7', '#f97316'],
          startVelocity: isMilestone ? 42 : 28,
          gravity: 1.1,
          scalar: 1.4,
        });
        break;

      case 'fireworks_show':
        confetti({
          particleCount: Math.round(32 * countMultiplier),
          spread: 120,
          origin: { x, y },
          shapes: [shapes.starburst, 'circle', 'star'],
          colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#ffffff'],
          startVelocity: isMilestone ? 42 : 28,
          scalar: 1.1,
        });
        break;

      case 'bubble_magic':
        confetti({
          particleCount: Math.round(24 * countMultiplier),
          spread: 65,
          angle: 90,
          origin: { x, y },
          shapes: [shapes.water, 'circle'],
          colors: ['#67e8f9', '#c084fc', '#fbcfe8', '#a7f3d0', '#e0e7ff'],
          startVelocity: isMilestone ? 25 : 16,
          gravity: -0.24,
          scalar: 1.35,
          ticks: 140,
        });
        break;

      case 'hyperspace_warp':
        confetti({
          particleCount: Math.round(36 * countMultiplier),
          spread: 360,
          origin: { x, y },
          shapes: [shapes.hyperspace, 'circle'],
          colors: ['#38bdf8', '#0284c7', '#ffffff', '#e0f2fe'],
          startVelocity: isMilestone ? 58 : 40,
          gravity: 0.2,
          scalar: 1.25,
        });
        if (isMilestone) {
          triggerScreenFlashVfx('rgba(56, 189, 248, 0.25)');
          triggerShockwaveVfx(x, y, 'rgba(56, 189, 248, 0.8)', 220);
        }
        break;

      case 'kamehameha_energy':
        confetti({
          particleCount: Math.round(34 * countMultiplier),
          spread: 360,
          origin: { x, y },
          shapes: [shapes.starburst, 'circle'],
          colors: ['#eab308', '#facc15', '#38bdf8', '#ffffff'],
          startVelocity: isMilestone ? 44 : 30,
          gravity: 0.6,
          scalar: 1.35,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(250, 204, 21, 0.85)', 250);
          triggerScreenFlashVfx('rgba(250, 204, 21, 0.3)');
        }
        break;

      case 'diamond_rain':
        confetti({
          particleCount: Math.round(28 * countMultiplier),
          spread: 60,
          origin: { x, y },
          shapes: [shapes.diamond, 'square'],
          colors: ['#06b6d4', '#22c55e', '#67e8f9', '#bbf7d0', '#ffffff'],
          startVelocity: isMilestone ? 40 : 26,
          gravity: 1.0,
          scalar: 1.3,
        });
        break;

      case 'infinite_void_burst':
        confetti({
          particleCount: Math.round(40 * countMultiplier),
          spread: 360,
          origin: { x, y },
          shapes: [shapes.voidEye, shapes.starburst, 'circle'],
          colors: ['#38bdf8', '#a78bfa', '#e0f2fe', '#ffffff', '#1e293b'],
          startVelocity: isMilestone ? 36 : 24,
          gravity: 0.2,
          decay: 0.91,
          scalar: 1.3,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(167, 139, 250, 0.85)', 270);
          triggerScreenFlashVfx('rgba(167, 139, 250, 0.28)');
        }
        break;

      case 'gear_second_steam':
        confetti({
          particleCount: Math.round(36 * countMultiplier),
          spread: 55,
          angle: 90,
          origin: { x, y },
          shapes: [shapes.steam, shapes.flame],
          colors: ['#fb7185', '#f43f5e', '#fca5a5', '#fef2f2', '#fbbf24'],
          startVelocity: isMilestone ? 44 : 29,
          gravity: 0.65,
          scalar: 1.3,
        });
        break;

      case 'gaster_bone_barrage':
        confetti({
          particleCount: Math.round(32 * countMultiplier),
          spread: 100,
          origin: { x, y },
          shapes: [shapes.bone, 'circle'],
          colors: ['#06b6d4', '#ffffff', '#e0f2fe', '#94a3b8', '#0f172a'],
          startVelocity: isMilestone ? 42 : 28,
          gravity: 0.55,
          scalar: 1.25,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(6, 182, 212, 0.8)', 210);
        }
        break;

      case 'sandevistan_afterimage':
        confetti({
          particleCount: Math.round(38 * countMultiplier),
          spread: 85,
          origin: { x, y },
          shapes: [shapes.lightning, shapes.hyperspace, 'square'],
          colors: ['#facc15', '#38bdf8', '#fef9c3', '#ffffff', '#0f172a'],
          startVelocity: isMilestone ? 50 : 34,
          gravity: 0.4,
          scalar: 1.3,
        });
        if (isMilestone) {
          triggerScreenShakeVfx();
          triggerScreenFlashVfx('rgba(250, 204, 21, 0.3)');
        }
        break;

      case 'water_flame_dragon':
        confetti({
          particleCount: Math.round(36 * countMultiplier),
          spread: 90,
          origin: { x, y },
          shapes: [shapes.flame, shapes.water],
          colors: ['#38bdf8', '#f97316', '#fbbf24', '#e0f2fe', '#0284c7'],
          startVelocity: isMilestone ? 46 : 32,
          gravity: 0.78,
          scalar: 1.25,
        });
        break;

      case 'thunder_storm_vfx':
        confetti({
          particleCount: Math.round(36 * countMultiplier),
          spread: 75,
          origin: { x, y },
          shapes: [shapes.lightning, shapes.starburst],
          colors: ['#facc15', '#38bdf8', '#fef08a', '#e0f2fe', '#ffffff'],
          startVelocity: isMilestone ? 55 : 38,
          gravity: 0.48,
          scalar: 1.25,
        });
        if (isMilestone) {
          triggerScreenFlashVfx('rgba(250, 204, 21, 0.35)');
          triggerShockwaveVfx(x, y, 'rgba(250, 204, 21, 0.8)', 220);
        }
        break;

      case 'serious_shockwave':
        confetti({
          particleCount: Math.round(42 * countMultiplier),
          spread: 120,
          origin: { x, y },
          shapes: [shapes.starburst, 'circle'],
          colors: ['#ef4444', '#fca5a5', '#ffffff', '#fbbf24', '#7f1d1d'],
          startVelocity: isMilestone ? 48 : 32,
          gravity: 0.7,
          scalar: 1.35,
        });
        triggerShockwaveVfx(x, y, 'rgba(239, 68, 68, 0.85)', isMilestone ? 320 : 190);
        triggerScreenShakeVfx();
        if (isMilestone) {
          triggerScreenFlashVfx('rgba(239, 68, 68, 0.3)');
        }
        break;

      case 'soul_vessel_burst':
        confetti({
          particleCount: Math.round(34 * countMultiplier),
          spread: 110,
          origin: { x, y },
          shapes: [shapes.vessel, shapes.water, 'circle'],
          colors: ['#dbeafe', '#7dd3fc', '#e0f2fe', '#93c5fd', '#1e293b'],
          startVelocity: isMilestone ? 28 : 18,
          gravity: 0.28,
          scalar: 1.38,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(125, 211, 252, 0.75)', 200);
        }
        break;

      case 'golden_ring_burst':
        confetti({
          particleCount: Math.round(32 * countMultiplier),
          spread: 120,
          origin: { x, y },
          shapes: [shapes.ring, shapes.starburst],
          colors: ['#fde047', '#fbbf24', '#fef9c3', '#ffffff', '#d97706'],
          startVelocity: isMilestone ? 40 : 26,
          gravity: 0.65,
          scalar: 1.4,
        });
        if (isMilestone) {
          triggerShockwaveVfx(x, y, 'rgba(253, 224, 71, 0.8)', 220);
        }
        break;

      case 'bat_swarm_vfx':
        confetti({
          particleCount: Math.round(30 * countMultiplier),
          spread: 90,
          origin: { x, y },
          shapes: [shapes.bat, 'circle'],
          colors: ['#111827', '#1f2937', '#f59e0b', '#fef3c7', '#d97706'],
          startVelocity: isMilestone ? 34 : 22,
          gravity: 0.4,
          scalar: 1.3,
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
      // Chuva em 3 colunas de moedas cunhadas e estrelas + shockwave dourada
      triggerShockwaveVfx(0.5, 0.4, 'rgba(251, 191, 36, 0.85)', 300);
      const drops = [0.25, 0.5, 0.75];
      drops.forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 45,
            spread: 55,
            angle: 270,
            origin: { x: posX, y: 0.05 },
            shapes: [shapes.coin, 'star'],
            colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a', '#ffffff'],
            startVelocity: 32,
            gravity: 0.95,
            scalar: 1.4,
          });
        }, idx * 220);
      });
      break;
    }

    case 'matrix_stream': {
      // Cortina de dados Matrix caindo por 4 colunas
      const columns = [0.15, 0.38, 0.62, 0.85];
      columns.forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 42,
            spread: 25,
            angle: 270,
            origin: { x: posX, y: 0 },
            shapes: ['square'],
            colors: ['#22c55e', '#16a34a', '#86efac', '#15803d', '#4ade80'],
            startVelocity: 38,
            gravity: 0.8,
            ticks: 180,
            scalar: 1.05,
          });
        }, idx * 180);
      });
      break;
    }

    case 'supernova_burst': {
      // Detonação cósmica com shockwave roxa e clarão de estrela
      triggerScreenFlashVfx('rgba(168, 85, 247, 0.35)');
      triggerShockwaveVfx(0.5, 0.45, 'rgba(168, 85, 247, 0.9)', 350);
      confetti({
        particleCount: 95,
        spread: 360,
        origin: { x: 0.5, y: 0.45 },
        shapes: [shapes.starburst, 'circle'],
        colors: ['#c084fc', '#a855f7', '#38bdf8', '#e0e7ff', '#ffffff'],
        startVelocity: 42,
        decay: 0.93,
        scalar: 1.3,
      });
      setTimeout(() => {
        confetti({
          particleCount: 55,
          spread: 360,
          origin: { x: 0.5, y: 0.45 },
          shapes: [shapes.starburst, 'star'],
          colors: ['#ffffff', '#38bdf8', '#c084fc'],
          startVelocity: 26,
          decay: 0.9,
        });
      }, 300);
      break;
    }

    case 'tesla_lightning': {
      // Descargas de raios cruzados dos cantos superiores com clarão elétrico
      triggerScreenFlashVfx('rgba(56, 189, 248, 0.4)');
      triggerShockwaveVfx(0.5, 0.35, 'rgba(56, 189, 248, 0.85)', 300);
      confetti({
        particleCount: 55,
        spread: 90,
        angle: 300,
        origin: { x: 0.2, y: 0.1 },
        shapes: [shapes.lightning, 'star'],
        colors: ['#38bdf8', '#0ea5e9', '#60a5fa', '#ffffff'],
        startVelocity: 55,
        decay: 0.88,
        gravity: 0.45,
        scalar: 1.25,
      });
      setTimeout(() => {
        confetti({
          particleCount: 55,
          spread: 90,
          angle: 240,
          origin: { x: 0.8, y: 0.1 },
          shapes: [shapes.lightning, 'star'],
          colors: ['#38bdf8', '#0ea5e9', '#60a5fa', '#ffffff'],
          startVelocity: 55,
          decay: 0.88,
          gravity: 0.45,
          scalar: 1.25,
        });
      }, 200);
      break;
    }

    case 'volcano_flame': {
      // Erupção de magma vulcânico disparando do rodapé para o alto
      triggerScreenShakeVfx();
      triggerShockwaveVfx(0.5, 0.95, 'rgba(239, 68, 68, 0.85)', 340);
      confetti({
        particleCount: 95,
        spread: 45,
        angle: 90,
        origin: { x: 0.5, y: 1.0 },
        shapes: [shapes.flame, 'circle'],
        colors: ['#ef4444', '#f97316', '#fbbf24', '#b91c1c', '#ea580c'],
        startVelocity: 65,
        gravity: 0.95,
        scalar: 1.3,
      });
      setTimeout(() => {
        confetti({
          particleCount: 65,
          spread: 60,
          angle: 90,
          origin: { x: 0.5, y: 0.9 },
          shapes: [shapes.flame, 'circle'],
          colors: ['#f97316', '#fbbf24', '#ffffff'],
          startVelocity: 50,
          gravity: 0.9,
          scalar: 1.2,
        });
      }, 250);
      break;
    }

    case 'cyber_neon': {
      // Cruzamento laser synthwave com estrelas de neon
      triggerShockwaveVfx(0.5, 0.5, 'rgba(236, 72, 153, 0.85)', 310);
      confetti({
        particleCount: 65,
        spread: 50,
        angle: 45,
        origin: { x: 0.1, y: 0.85 },
        shapes: ['square', shapes.starburst],
        colors: ['#ec4899', '#f43f5e', '#ffffff'],
        startVelocity: 50,
        scalar: 1.25,
      });
      confetti({
        particleCount: 65,
        spread: 50,
        angle: 135,
        origin: { x: 0.9, y: 0.85 },
        shapes: ['square', shapes.starburst],
        colors: ['#06b6d4', '#67e8f9', '#ffffff'],
        startVelocity: 50,
        scalar: 1.25,
      });
      break;
    }

    case 'pixel_retro': {
      // Chuva arcade de corações e cubos pixel 8-bit
      confetti({
        particleCount: 80,
        spread: 80,
        angle: 90,
        origin: { x: 0.5, y: 0.7 },
        shapes: [shapes.pixelHeart, 'square'],
        colors: ['#22c55e', '#eab308', '#3b82f6', '#ef4444', '#a855f7', '#f97316'],
        startVelocity: 45,
        gravity: 1.15,
        scalar: 1.6,
      });
      break;
    }

    case 'fireworks_show': {
      // Salva de fogos pirotécnicos em 3 momentos com starbursts
      const fireworks = [
        { x: 0.3, y: 0.35, colors: ['#f43f5e', '#fbbf24', '#ffffff'] },
        { x: 0.7, y: 0.3, colors: ['#38bdf8', '#a855f7', '#ffffff'] },
        { x: 0.5, y: 0.22, colors: ['#fbbf24', '#f59e0b', '#ffffff'] },
      ];
      fireworks.forEach((fw, idx) => {
        setTimeout(() => {
          triggerShockwaveVfx(fw.x, fw.y, 'rgba(251, 191, 36, 0.75)', 190);
          confetti({
            particleCount: 55,
            spread: 360,
            origin: { x: fw.x, y: fw.y },
            shapes: [shapes.starburst, 'circle', 'star'],
            colors: fw.colors,
            startVelocity: 28,
            decay: 0.92,
            scalar: 1.15,
          });
        }, idx * 250);
      });
      break;
    }

    case 'bubble_magic': {
      // Centenas de bolhas arcanas e gotas d'água ascendentes
      [0.2, 0.4, 0.6, 0.8].forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 32,
            spread: 50,
            angle: 90,
            origin: { x: posX, y: 1.0 },
            shapes: [shapes.water, 'circle'],
            colors: ['#67e8f9', '#c084fc', '#fbcfe8', '#a7f3d0', '#e0e7ff'],
            startVelocity: 22,
            gravity: -0.28,
            ticks: 180,
            scalar: 1.45,
          });
        }, idx * 150);
      });
      break;
    }

    case 'hyperspace_warp': {
      // Salto no hiperespaço: feixes estelares do centro para as bordas + flash
      triggerScreenFlashVfx('rgba(56, 189, 248, 0.35)');
      triggerShockwaveVfx(0.5, 0.5, 'rgba(56, 189, 248, 0.85)', 340);
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          confetti({
            particleCount: 65,
            spread: 360,
            origin: { x: 0.5, y: 0.5 },
            shapes: [shapes.hyperspace, 'circle'],
            colors: ['#38bdf8', '#0284c7', '#ffffff', '#e0f2fe'],
            startVelocity: 55 + i * 10,
            gravity: 0.2,
            scalar: 1.3,
          });
        }, i * 200);
      }
      break;
    }

    case 'kamehameha_energy': {
      // Explosão de energia Ki dourada/celeste com aura shockwave
      triggerScreenFlashVfx('rgba(250, 204, 21, 0.38)');
      triggerShockwaveVfx(0.5, 0.45, 'rgba(250, 204, 21, 0.9)', 350);
      confetti({
        particleCount: 95,
        spread: 100,
        angle: 90,
        origin: { x: 0.5, y: 0.8 },
        shapes: [shapes.starburst, 'circle'],
        colors: ['#eab308', '#facc15', '#38bdf8', '#ffffff'],
        startVelocity: 60,
        gravity: 0.65,
        scalar: 1.45,
      });
      setTimeout(() => {
        confetti({
          particleCount: 75,
          spread: 360,
          origin: { x: 0.5, y: 0.4 },
          shapes: [shapes.starburst, 'star'],
          colors: ['#fef08a', '#38bdf8', '#ffffff'],
          startVelocity: 40,
        });
      }, 300);
      break;
    }

    case 'diamond_rain': {
      // Chuva intensa de diamantes facetados do topo da tela
      [0.2, 0.4, 0.6, 0.8].forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 38,
            spread: 45,
            angle: 270,
            origin: { x: posX, y: 0 },
            shapes: [shapes.diamond, 'square'],
            colors: ['#06b6d4', '#22c55e', '#67e8f9', '#a7f3d0', '#ffffff'],
            startVelocity: 35,
            gravity: 1.1,
            scalar: 1.35,
          });
        }, idx * 120);
      });
      break;
    }

    case 'infinite_void_burst': {
      // Expansão do Vazio Infinito: olhos singulares e shockwave cósmica
      triggerScreenFlashVfx('rgba(167, 139, 250, 0.35)');
      triggerShockwaveVfx(0.5, 0.5, 'rgba(167, 139, 250, 0.9)', 380);
      confetti({
        particleCount: 110,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
        shapes: [shapes.voidEye, shapes.starburst, 'circle'],
        colors: ['#38bdf8', '#a78bfa', '#e0f2fe', '#ffffff', '#1e293b'],
        startVelocity: 36,
        gravity: 0.18,
        decay: 0.88,
        scalar: 1.4,
      });
      break;
    }

    case 'gear_second_steam': {
      // Jatos ascendentes de vapor Gear Second com chamas de espírito de luta
      [0.2, 0.5, 0.8].forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 55,
            spread: 60,
            angle: 90,
            origin: { x: posX, y: 0.9 },
            shapes: [shapes.steam, shapes.flame],
            colors: ['#fb7185', '#f43f5e', '#fca5a5', '#fef2f2', '#fbbf24'],
            startVelocity: 44,
            gravity: 0.7,
            scalar: 1.35,
          });
        }, idx * 200);
      });
      break;
    }

    case 'gaster_bone_barrage': {
      // Barragem cruzada de ossos de Sans com brilho blaster
      triggerShockwaveVfx(0.5, 0.5, 'rgba(6, 182, 212, 0.85)', 300);
      [0.2, 0.5, 0.8].forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 46,
            spread: 90,
            origin: { x: posX, y: 0.2 },
            shapes: [shapes.bone, 'circle'],
            colors: ['#06b6d4', '#ffffff', '#e0f2fe', '#94a3b8', '#0f172a'],
            startVelocity: 38,
            gravity: 0.58,
            scalar: 1.25,
          });
        }, idx * 180);
      });
      break;
    }

    case 'sandevistan_afterimage': {
      // Rastro ultra veloz de Sandevistan com relâmpagos e micro-shake
      triggerScreenShakeVfx();
      triggerScreenFlashVfx('rgba(250, 204, 21, 0.32)');
      triggerShockwaveVfx(0.5, 0.42, 'rgba(250, 204, 21, 0.85)', 310);
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { x: 0.5, y: 0.42 },
        shapes: [shapes.lightning, shapes.hyperspace, 'square'],
        colors: ['#facc15', '#38bdf8', '#fef9c3', '#ffffff', '#0f172a'],
        startVelocity: 42,
        decay: 0.9,
        gravity: 0.42,
        scalar: 1.35,
      });
      break;
    }

    case 'water_flame_dragon': {
      // Fusão espiral da Dança do Dragão de Fogo e Água
      [0.25, 0.5, 0.75].forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 50,
            spread: 90,
            origin: { x: posX, y: 0.75 },
            shapes: [shapes.flame, shapes.water],
            colors: ['#38bdf8', '#f97316', '#fbbf24', '#e0f2fe', '#0284c7'],
            startVelocity: 44,
            gravity: 0.82,
            scalar: 1.28,
          });
        }, idx * 200);
      });
      break;
    }

    case 'thunder_storm_vfx': {
      // Tempestade furiosa de relâmpagos amarelos com clarões
      triggerScreenFlashVfx('rgba(250, 204, 21, 0.4)');
      triggerShockwaveVfx(0.5, 0.35, 'rgba(250, 204, 21, 0.9)', 340);
      confetti({
        particleCount: 95,
        spread: 120,
        origin: { x: 0.5, y: 0.3 },
        shapes: [shapes.lightning, shapes.starburst],
        colors: ['#facc15', '#38bdf8', '#fef08a', '#e0f2fe', '#0f172a'],
        startVelocity: 52,
        gravity: 0.48,
        scalar: 1.3,
      });
      break;
    }

    case 'serious_shockwave': {
      // Impacto cataclísmico do Soco Sério de Saitama
      triggerShockwaveVfx(0.5, 0.5, 'rgba(239, 68, 68, 0.95)', 420);
      triggerScreenShakeVfx();
      triggerScreenFlashVfx('rgba(239, 68, 68, 0.4)');
      confetti({
        particleCount: 110,
        spread: 180,
        origin: { x: 0.5, y: 0.55 },
        shapes: [shapes.starburst, 'circle'],
        colors: ['#ef4444', '#fca5a5', '#ffffff', '#fbbf24', '#7f1d1d'],
        startVelocity: 48,
        gravity: 0.7,
        scalar: 1.38,
      });
      break;
    }

    case 'soul_vessel_burst': {
      // Libertação etérea de máscaras de alma e gotas luminescentes
      triggerShockwaveVfx(0.5, 0.5, 'rgba(125, 211, 252, 0.8)', 280);
      confetti({
        particleCount: 95,
        spread: 140,
        origin: { x: 0.5, y: 0.5 },
        shapes: [shapes.vessel, shapes.water, 'circle'],
        colors: ['#dbeafe', '#7dd3fc', '#e0f2fe', '#93c5fd', '#1e293b'],
        startVelocity: 28,
        gravity: 0.28,
        scalar: 1.4,
      });
      break;
    }

    case 'golden_ring_burst': {
      // Dispersão supersônica de anéis do Sonic em 3 ondas radiais
      triggerShockwaveVfx(0.5, 0.5, 'rgba(253, 224, 71, 0.9)', 320);
      [0.2, 0.5, 0.8].forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 48,
            spread: 120,
            origin: { x: posX, y: 0.4 },
            shapes: [shapes.ring, shapes.starburst],
            colors: ['#fde047', '#fbbf24', '#fef9c3', '#ffffff', '#d97706'],
            startVelocity: 36,
            gravity: 0.65,
            scalar: 1.45,
          });
        }, idx * 180);
      });
      break;
    }

    case 'bat_swarm_vfx': {
      // Revoada de morcegos saindo das sombras góticas
      triggerShockwaveVfx(0.5, 0.6, 'rgba(245, 158, 11, 0.7)', 260);
      confetti({
        particleCount: 90,
        spread: 120,
        origin: { x: 0.5, y: 0.65 },
        shapes: [shapes.bat, 'circle'],
        colors: ['#111827', '#1f2937', '#f59e0b', '#fef3c7', '#d97706'],
        startVelocity: 34,
        gravity: 0.45,
        scalar: 1.35,
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
