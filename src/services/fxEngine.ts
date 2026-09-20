import confetti from 'canvas-confetti';
import { AnimationEffectId } from '../types/cosmetics';

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

    switch (style) {
      case 'confetti_classic':
        confetti({
          particleCount: Math.round(25 * countMultiplier),
          spread: 55,
          origin: { x, y },
          colors: ['#10b981', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
          startVelocity: isMilestone ? 45 : 30,
        });
        break;

      case 'golden_coins':
        confetti({
          particleCount: Math.round(22 * countMultiplier),
          spread: 45,
          origin: { x, y },
          shapes: ['circle', 'star'],
          colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a', '#ffffff'],
          startVelocity: isMilestone ? 42 : 28,
          gravity: 0.85,
          scalar: 1.25,
        });
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
          particleCount: Math.round(35 * countMultiplier),
          spread: 360,
          origin: { x, y },
          shapes: ['circle', 'star'],
          colors: ['#c084fc', '#a855f7', '#38bdf8', '#e0e7ff', '#ffffff'],
          startVelocity: isMilestone ? 35 : 22,
          decay: 0.92,
          scalar: 1.1,
        });
        break;

      case 'tesla_lightning':
        confetti({
          particleCount: Math.round(26 * countMultiplier),
          spread: 75,
          origin: { x, y },
          shapes: ['square'],
          colors: ['#38bdf8', '#0ea5e9', '#60a5fa', '#ffffff', '#e0f2fe'],
          startVelocity: isMilestone ? 55 : 38,
          decay: 0.87,
          gravity: 0.45,
          scalar: 0.85,
        });
        break;

      case 'volcano_flame':
        confetti({
          particleCount: Math.round(32 * countMultiplier),
          spread: 35,
          angle: 90,
          origin: { x, y },
          shapes: ['circle', 'square'],
          colors: ['#ef4444', '#f97316', '#fbbf24', '#b91c1c', '#ea580c'],
          startVelocity: isMilestone ? 50 : 36,
          gravity: 0.9,
          scalar: 1.1,
        });
        break;

      case 'cyber_neon':
        confetti({
          particleCount: Math.round(26 * countMultiplier),
          spread: 60,
          origin: { x, y },
          shapes: ['square', 'circle'],
          colors: ['#ec4899', '#06b6d4', '#f43f5e', '#67e8f9', '#ffffff'],
          startVelocity: isMilestone ? 44 : 30,
          scalar: 1.15,
        });
        break;

      case 'pixel_retro':
        confetti({
          particleCount: Math.round(28 * countMultiplier),
          spread: 60,
          origin: { x, y },
          shapes: ['square'],
          colors: ['#22c55e', '#eab308', '#3b82f6', '#ef4444', '#a855f7', '#f97316'],
          startVelocity: isMilestone ? 42 : 28,
          gravity: 1.1,
          scalar: 1.45,
        });
        break;

      case 'fireworks_show':
        confetti({
          particleCount: Math.round(30 * countMultiplier),
          spread: 120,
          origin: { x, y },
          shapes: ['circle', 'star'],
          colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#ffffff'],
          startVelocity: isMilestone ? 40 : 26,
          scalar: 1.05,
        });
        break;

      case 'bubble_magic':
        confetti({
          particleCount: Math.round(22 * countMultiplier),
          spread: 65,
          angle: 90,
          origin: { x, y },
          shapes: ['circle'],
          colors: ['#67e8f9', '#c084fc', '#fbcfe8', '#a7f3d0', '#e0e7ff'],
          startVelocity: isMilestone ? 25 : 16,
          gravity: -0.22,
          scalar: 1.35,
          ticks: 140,
        });
        break;

      case 'hyperspace_warp':
        confetti({
          particleCount: Math.round(35 * countMultiplier),
          spread: 35,
          origin: { x, y },
          shapes: ['circle'],
          colors: ['#38bdf8', '#0284c7', '#ffffff', '#e0f2fe'],
          startVelocity: isMilestone ? 55 : 38,
          gravity: 0.5,
          scalar: 1.1,
        });
        break;

      case 'kamehameha_energy':
        confetti({
          particleCount: Math.round(32 * countMultiplier),
          spread: 360,
          origin: { x, y },
          shapes: ['circle', 'star'],
          colors: ['#eab308', '#facc15', '#38bdf8', '#ffffff'],
          startVelocity: isMilestone ? 42 : 28,
          gravity: 0.7,
          scalar: 1.3,
        });
        break;

      case 'diamond_rain':
        confetti({
          particleCount: Math.round(26 * countMultiplier),
          spread: 60,
          origin: { x, y },
          shapes: ['square'],
          colors: ['#06b6d4', '#22c55e', '#67e8f9', '#bbf7d0', '#ffffff'],
          startVelocity: isMilestone ? 38 : 25,
          gravity: 1.0,
          scalar: 1.25,
        });
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
    switch (style) {
    case 'confetti_classic': {
      // Canhão duplo lateral
      confetti({
        particleCount: 75,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.8 },
        colors: ['#10b981', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
      });
      confetti({
        particleCount: 75,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.8 },
        colors: ['#10b981', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 100,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#10b981', '#38bdf8', '#fbbf24'],
        });
      }, 350);
      break;
    }

    case 'golden_coins': {
      // Chuva de moedas e estrelas em 3 ondas do topo
      const drops = [0.25, 0.5, 0.75];
      drops.forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 45,
            spread: 50,
            angle: 270,
            origin: { x: posX, y: 0.05 },
            shapes: ['circle', 'star'],
            colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a', '#ffffff'],
            startVelocity: 30,
            gravity: 0.95,
            scalar: 1.35,
          });
        }, idx * 250);
      });
      break;
    }

    case 'matrix_stream': {
      // Cortina Matrix caindo por 4 colunas
      const columns = [0.15, 0.38, 0.62, 0.85];
      columns.forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 40,
            spread: 25,
            angle: 270,
            origin: { x: posX, y: 0 },
            shapes: ['square'],
            colors: ['#22c55e', '#16a34a', '#86efac', '#15803d', '#4ade80'],
            startVelocity: 38,
            gravity: 0.8,
            ticks: 180,
            scalar: 1.0,
          });
        }, idx * 180);
      });
      break;
    }

    case 'supernova_burst': {
      // Explosão supernova central com estrelas cadentes
      confetti({
        particleCount: 90,
        spread: 360,
        origin: { x: 0.5, y: 0.45 },
        shapes: ['circle', 'star'],
        colors: ['#c084fc', '#a855f7', '#38bdf8', '#e0e7ff', '#ffffff'],
        startVelocity: 42,
        decay: 0.93,
        scalar: 1.25,
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 360,
          origin: { x: 0.5, y: 0.45 },
          shapes: ['star'],
          colors: ['#ffffff', '#38bdf8', '#c084fc'],
          startVelocity: 25,
          decay: 0.9,
        });
      }, 300);
      break;
    }

    case 'tesla_lightning': {
      // Flashes de alta voltagem pelos cantos superiores
      confetti({
        particleCount: 50,
        spread: 90,
        angle: 300,
        origin: { x: 0.2, y: 0.1 },
        shapes: ['square'],
        colors: ['#38bdf8', '#0ea5e9', '#60a5fa', '#ffffff'],
        startVelocity: 55,
        decay: 0.88,
        gravity: 0.5,
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 90,
          angle: 240,
          origin: { x: 0.8, y: 0.1 },
          shapes: ['square'],
          colors: ['#38bdf8', '#0ea5e9', '#60a5fa', '#ffffff'],
          startVelocity: 55,
          decay: 0.88,
          gravity: 0.5,
        });
      }, 200);
      break;
    }

    case 'volcano_flame': {
      // Erupção vulcânica disparando do rodapé para o alto
      confetti({
        particleCount: 90,
        spread: 45,
        angle: 90,
        origin: { x: 0.5, y: 1.0 },
        shapes: ['circle', 'square'],
        colors: ['#ef4444', '#f97316', '#fbbf24', '#b91c1c', '#ea580c'],
        startVelocity: 65,
        gravity: 1.0,
        scalar: 1.2,
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 60,
          angle: 90,
          origin: { x: 0.5, y: 0.9 },
          shapes: ['circle'],
          colors: ['#f97316', '#fbbf24', '#ffffff'],
          startVelocity: 50,
          gravity: 0.9,
        });
      }, 250);
      break;
    }

    case 'cyber_neon': {
      // Cruzamento laser synthwave
      confetti({
        particleCount: 60,
        spread: 50,
        angle: 45,
        origin: { x: 0.1, y: 0.85 },
        shapes: ['square', 'circle'],
        colors: ['#ec4899', '#f43f5e', '#ffffff'],
        startVelocity: 50,
        scalar: 1.2,
      });
      confetti({
        particleCount: 60,
        spread: 50,
        angle: 135,
        origin: { x: 0.9, y: 0.85 },
        shapes: ['square', 'circle'],
        colors: ['#06b6d4', '#67e8f9', '#ffffff'],
        startVelocity: 50,
        scalar: 1.2,
      });
      break;
    }

    case 'pixel_retro': {
      // Chuva arcade de cubos pixel
      confetti({
        particleCount: 75,
        spread: 80,
        angle: 90,
        origin: { x: 0.5, y: 0.7 },
        shapes: ['square'],
        colors: ['#22c55e', '#eab308', '#3b82f6', '#ef4444', '#a855f7', '#f97316'],
        startVelocity: 45,
        gravity: 1.15,
        scalar: 1.6,
      });
      break;
    }

    case 'fireworks_show': {
      // Salva de fogos pirotécnicos em 3 momentos
      const fireworks = [
        { x: 0.3, y: 0.35, colors: ['#f43f5e', '#fbbf24', '#ffffff'] },
        { x: 0.7, y: 0.3, colors: ['#38bdf8', '#a855f7', '#ffffff'] },
        { x: 0.5, y: 0.22, colors: ['#fbbf24', '#f59e0b', '#ffffff'] },
      ];
      fireworks.forEach((fw, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 55,
            spread: 360,
            origin: { x: fw.x, y: fw.y },
            shapes: ['circle', 'star'],
            colors: fw.colors,
            startVelocity: 28,
            decay: 0.92,
            scalar: 1.1,
          });
        }, idx * 250);
      });
      break;
    }

    case 'bubble_magic': {
      // Centenas de bolhas ascendentes flutuando
      [0.2, 0.4, 0.6, 0.8].forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 30,
            spread: 50,
            angle: 90,
            origin: { x: posX, y: 1.0 },
            shapes: ['circle'],
            colors: ['#67e8f9', '#c084fc', '#fbcfe8', '#a7f3d0', '#e0e7ff'],
            startVelocity: 22,
            gravity: -0.28,
            ticks: 180,
            scalar: 1.4,
          });
        }, idx * 150);
      });
      break;
    }

    case 'hyperspace_warp': {
      // Salto no hiperespaço: feixes estelares do centro para as bordas
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          confetti({
            particleCount: 65,
            spread: 360,
            origin: { x: 0.5, y: 0.5 },
            shapes: ['circle'],
            colors: ['#38bdf8', '#0284c7', '#ffffff', '#e0f2fe'],
            startVelocity: 55 + i * 10,
            gravity: 0.2,
            scalar: 1.2,
          });
        }, i * 200);
      }
      break;
    }

    case 'kamehameha_energy': {
      // Explosão de energia Ki dourada/celeste
      confetti({
        particleCount: 90,
        spread: 100,
        angle: 90,
        origin: { x: 0.5, y: 0.8 },
        shapes: ['circle', 'star'],
        colors: ['#eab308', '#facc15', '#38bdf8', '#ffffff'],
        startVelocity: 60,
        gravity: 0.7,
        scalar: 1.4,
      });
      setTimeout(() => {
        confetti({
          particleCount: 70,
          spread: 360,
          origin: { x: 0.5, y: 0.4 },
          shapes: ['star'],
          colors: ['#fef08a', '#38bdf8', '#ffffff'],
          startVelocity: 40,
        });
      }, 300);
      break;
    }

    case 'diamond_rain': {
      // Chuva intensa de diamantes do topo da tela
      [0.2, 0.4, 0.6, 0.8].forEach((posX, idx) => {
        setTimeout(() => {
          confetti({
            particleCount: 35,
            spread: 45,
            angle: 270,
            origin: { x: posX, y: 0 },
            shapes: ['square'],
            colors: ['#06b6d4', '#22c55e', '#67e8f9', '#a7f3d0', '#ffffff'],
            startVelocity: 35,
            gravity: 1.1,
            scalar: 1.3,
          });
        }, idx * 120);
      });
      break;
    }

    default:
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.5, y: 0.6 },
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
      default:
        return '';
    }
  }

  return '';
}
