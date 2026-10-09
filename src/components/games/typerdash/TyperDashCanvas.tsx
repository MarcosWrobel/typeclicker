import React from 'react';
import { generateBytezinhoSvgMarkup } from '../../../utils/bytezinhoSvg';

// Cache de Sprites do Bytezinho em memória para Canvas 2D
const bytezinhoSpriteCache = new Map<string, HTMLImageElement>();

export function getBytezinhoCanvasSprite(
  skin: string = 'classic',
  mood: 'normal' | 'happy' | 'fire' | 'oops' | 'upgrade' | 'glitch' | 'warning' | 'leak' = 'normal',
  isBlinking: boolean = false,
  isCombo: boolean = false
): HTMLImageElement | null {
  const cacheKey = `${skin}_${mood}_${isBlinking ? '1' : '0'}_${isCombo ? '1' : '0'}`;
  let img = bytezinhoSpriteCache.get(cacheKey);
  if (!img) {
    const svgMarkup = generateBytezinhoSvgMarkup({
      skin,
      mood,
      isBlinking,
      isCombo,
      comboCount: isCombo ? 10 : 0
    });
    img = new Image();
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;
    bytezinhoSpriteCache.set(cacheKey, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : null;
}

export interface DashObstacle {
  id: string;
  x: number;
  y: number;
  type: 'single' | 'double' | 'tall' | 'orb' | 'platform' | 'portal' | 'rail' | 'ramp';
  letter: string;
  width: number;
  height: number;
  cleared: boolean;
  elevation?: number;
  portalType?: 'speed2x' | 'normal';
  // Propriedades Denshattack!
  railKey?: string;
  railLength?: number;
  isGrinding?: boolean;
  trickSequence?: string[];
  trickStep?: number;
  trickName?: string;
}

export interface DashGhostTrail {
  x: number;
  y: number;
  rotation: number;
  alpha: number;
}

export interface DashParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
  shape?: 'square' | 'circle' | 'shard';
}

export interface DashFloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
  vy: number;
}

export interface DashDenshaPopup {
  id: string;
  x: number;
  y: number;
  title: string;
  subtitle?: string;
  color: string;
  alpha: number;
  scale: number;
  rotation: number;
}

export interface DashCubeState {
  x: number;
  y: number;
  size: number;
  rotation: number;
  isJumping: boolean;
  isGrounded: boolean;
  targetRotation: number;
}

export interface DashActiveGrindState {
  x: number;
  y: number;
  progress: number; // 0.0 a 1.0
  key: string;
  inSweetSpot: boolean;
}

export interface DashActiveTrickState {
  sequence: string[];
  currentIndex: number;
  name: string;
  timeRemainingRatio: number;
}

export interface DashRenderState {
  cube: DashCubeState;
  ghostTrail?: DashGhostTrail[];
  speedLinesActive?: boolean;
  zoomPulse?: number;
  stageName?: string;
  obstacles: DashObstacle[];
  particles: DashParticle[];
  floatingTexts: DashFloatingText[];
  denshaPopups?: DashDenshaPopup[];
  activeGrind?: DashActiveGrindState | null;
  activeTrick?: DashActiveTrickState | null;
  judgmentLineX: number;
  currentHue: number;
  groundY: number;
  parallaxOffset: number;
  isInvulnerable: boolean;
  hasShield?: boolean;
  isArcher?: boolean;
  isMage?: boolean;
  combo: number;
  screenShake: number;
  metronomePulse: number;
  isPaused: boolean;
  bytezinhoSkin?: string;
  progressRatio?: number;
}

/**
 * Função de renderização pura em 60 FPS para Canvas 2D.
 * Totalmente desacoplada de re-renders do React para máxima fluidez e 0 overhead de GC.
 */
export function renderTyperDash(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: DashRenderState
): void {
  const {
    cube,
    ghostTrail = [],
    speedLinesActive = false,
    zoomPulse = 0,
    stageName,
    obstacles,
    particles,
    floatingTexts,
    denshaPopups = [],
    activeGrind = null,
    activeTrick = null,
    judgmentLineX,
    currentHue,
    groundY,
    parallaxOffset,
    isInvulnerable,
    hasShield,
    isArcher,
    isMage,
    combo,
    screenShake,
    metronomePulse,
    isPaused,
    bytezinhoSkin = 'classic'
  } = state;

  ctx.save();

  // ─────────────────────────────────────────────────────────
  // Screen Shake & Camera Zoom Pulse (Kick Beat Impact)
  // ─────────────────────────────────────────────────────────
  if (screenShake > 0) {
    const shakeX = (Math.random() - 0.5) * screenShake * 1.2;
    const shakeY = (Math.random() - 0.5) * screenShake * 1.2;
    ctx.translate(shakeX, shakeY);
  }

  if (zoomPulse > 0.001) {
    const scale = 1.0 + Math.min(zoomPulse, 0.08);
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-width / 2, -height / 2);
  }

  // ─────────────────────────────────────────────────────────
  // 1. Fundo Dinâmico com Hue Cycling Contínuo
  // ─────────────────────────────────────────────────────────
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, `hsl(${currentHue}, 65%, 7%)`);
  bgGradient.addColorStop(0.65, `hsl(${(currentHue + 25) % 360}, 75%, 4%)`);
  bgGradient.addColorStop(1, '#05070a');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // ─────────────────────────────────────────────────────────
  // 2. Grid Sci-Fi em Paralaxe (Batched Path para Alta Performance)
  // ─────────────────────────────────────────────────────────
  const gridSize = 50;
  const gridOffsetX = (parallaxOffset * 0.4) % gridSize;

  ctx.beginPath();
  // Linhas Verticais
  for (let x = -gridOffsetX; x < width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, groundY);
  }
  // Linhas Horizontais
  for (let y = 0; y < groundY; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.strokeStyle = `hsla(${currentHue}, 70%, 55%, 0.12)`;
  ctx.lineWidth = 1;
  ctx.stroke();

  // ─────────────────────────────────────────────────────────
  // 3. Linha de Chão Neon com Reflexo
  // ─────────────────────────────────────────────────────────
  const neonColor = `hsl(${currentHue}, 90%, 55%)`;

  // Reflexo do solo
  const floorGradient = ctx.createLinearGradient(0, groundY, 0, height);
  floorGradient.addColorStop(0, `hsla(${currentHue}, 80%, 25%, 0.35)`);
  floorGradient.addColorStop(0.35, `hsla(${currentHue}, 80%, 15%, 0.15)`);
  floorGradient.addColorStop(1, '#030508');
  ctx.fillStyle = floorGradient;
  ctx.fillRect(0, groundY, width, height - groundY);

  // Grid vertical do subsolo (batched)
  const groundGridOffset = parallaxOffset % gridSize;
  ctx.beginPath();
  for (let x = -groundGridOffset; x < width; x += gridSize) {
    ctx.moveTo(x, groundY);
    ctx.lineTo(x, height);
  }
  ctx.strokeStyle = `hsla(${currentHue}, 80%, 60%, 0.08)`;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Linha do topo do solo (bloom sutil otimizado)
  ctx.save();
  ctx.shadowBlur = 10;
  ctx.shadowColor = neonColor;
  ctx.strokeStyle = neonColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(width, groundY);
  ctx.stroke();
  ctx.restore();

  // Linha de reflexo interna branca
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, groundY + 1);
  ctx.lineTo(width, groundY + 1);
  ctx.stroke();

  // ─────────────────────────────────────────────────────────
  // 3.5 Speed Lines (Aceleração Supersônica)
  // ─────────────────────────────────────────────────────────
  if (speedLinesActive) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 22; i++) {
      const lineY = 25 + ((i * 29 + (parallaxOffset * 0.15)) % (groundY - 45));
      const lineLen = 80 + ((i * 47) % 240);
      const lineX = width - (((parallaxOffset * 3.2) + i * 115) % (width + lineLen + 150));
      const alpha = 0.2 + ((i % 5) * 0.14);
      ctx.strokeStyle = i % 2 === 0 ? `rgba(250, 204, 21, ${alpha})` : `rgba(56, 189, 248, ${alpha})`;
      ctx.beginPath();
      ctx.moveTo(lineX, lineY);
      ctx.lineTo(lineX + lineLen, lineY);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────
  // 4. Judgment Line (Linha de Mira Neon em X = 140)
  // ─────────────────────────────────────────────────────────
  const aimGlow = isArcher ? '#38bdf8' : '#f59e0b';

  // Feixe vertical
  const beamGradient = ctx.createLinearGradient(judgmentLineX - 20, 0, judgmentLineX + 20, 0);
  beamGradient.addColorStop(0, 'rgba(0,0,0,0)');
  beamGradient.addColorStop(0.5, isArcher ? 'rgba(56, 189, 248, 0.16)' : 'rgba(245, 158, 11, 0.12)');
  beamGradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = beamGradient;
  ctx.fillRect(judgmentLineX - 25, 0, 50, groundY);

  // Linha central tracejada
  ctx.save();
  ctx.shadowBlur = 8;
  ctx.shadowColor = aimGlow;
  ctx.strokeStyle = aimGlow;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(judgmentLineX, 0);
  ctx.lineTo(judgmentLineX, groundY);
  ctx.stroke();
  ctx.restore();

  // Marcador de Colchetes da Janela
  const targetY = groundY - cube.size / 2;
  const bracketSize = isArcher ? 36 : 28;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(judgmentLineX - bracketSize, targetY - 14);
  ctx.lineTo(judgmentLineX - bracketSize, targetY + 14);
  ctx.moveTo(judgmentLineX + bracketSize, targetY - 14);
  ctx.lineTo(judgmentLineX + bracketSize, targetY + 14);
  ctx.stroke();

  // Tag Superior de Mira
  ctx.fillStyle = aimGlow;
  ctx.font = 'bold 9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MIRA', judgmentLineX, 22);
  if (isArcher) {
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('[+JANELA]', judgmentLineX, 34);
  }

  // ─────────────────────────────────────────────────────────
  // 5. Metrônomo Visual do Mago
  // ─────────────────────────────────────────────────────────
  if (isMage) {
    const pulseSize = 10 + metronomePulse * 8;
    ctx.save();
    ctx.fillStyle = `rgba(192, 132, 252, ${0.4 + metronomePulse * 0.6})`;
    ctx.beginPath();
    ctx.arc(width / 2, 20, pulseSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f3e8ff';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('130 BPM // METRÔNOMO ATIVO', width / 2, 38);
    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────
  // 6. Obstáculos (Espinhos Triangulares Neon e Badges de Tecla)
  // ─────────────────────────────────────────────────────────
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    if (obs.x + obs.width < -50 || obs.x > width + 50) continue;

    if (obs.type === 'orb') {
      // ───────────────────────────────────────────────────────
      // JUMP ORB (Esfera Aérea)
      // ───────────────────────────────────────────────────────
      const cx = obs.x + obs.width / 2;
      const cy = obs.y + obs.height / 2;
      const orbColor = obs.cleared ? '#34d399' : '#ec4899';

      ctx.save();
      ctx.shadowBlur = obs.cleared ? 6 : 14;
      ctx.shadowColor = orbColor;

      const pulse = obs.cleared ? 1 : 1 + Math.sin(Date.now() / 90) * 0.12;
      const r = (obs.width / 2) * pulse;

      // Glow radial
      const radGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 1.3);
      radGrad.addColorStop(0, obs.cleared ? 'rgba(52, 211, 153, 0.6)' : 'rgba(236, 72, 153, 0.7)');
      radGrad.addColorStop(0.65, obs.cleared ? 'rgba(16, 185, 129, 0.2)' : 'rgba(219, 39, 119, 0.2)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Anel externo
      ctx.strokeStyle = orbColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Notches rotativos
      const orbAngle = (Date.now() / 250) % (Math.PI * 2);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(orbAngle);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      for (let k = 0; k < 4; k++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(r - 4, 0);
        ctx.lineTo(r + 4, 0);
        ctx.stroke();
      }
      ctx.restore();
      ctx.restore();

      // Badge flutuante acima da esfera
      const distToCube = obs.x - (cube.x + cube.size);
      const inJumpZone = distToCube >= -20 && distToCube <= 260 && !obs.cleared;

      const badgeY = cy - r - 25;
      const badgeW = inJumpZone ? 38 : 32;
      const badgeH = inJumpZone ? 38 : 32;

      ctx.save();
      if (inJumpZone) {
        ctx.shadowBlur = 18;
        ctx.shadowColor = '#f472b6';
      }
      ctx.fillStyle = obs.cleared ? 'rgba(6, 78, 59, 0.98)' : inJumpZone ? 'rgba(88, 28, 135, 0.98)' : 'rgba(10, 14, 26, 0.98)';
      ctx.strokeStyle = obs.cleared ? '#34d399' : inJumpZone ? '#f472b6' : '#ec4899';
      ctx.lineWidth = inJumpZone ? 3 : 2.2;
      ctx.beginPath();
      ctx.roundRect(cx - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 9);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = obs.cleared ? '#6ee7b7' : inJumpZone ? '#ffffff' : '#fbcfe8';
      ctx.font = inJumpZone ? '900 22px "JetBrains Mono", monospace' : '900 18px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obs.letter.toUpperCase(), cx, badgeY);
      ctx.restore();

      // Haste
      ctx.strokeStyle = obs.cleared ? 'rgba(52, 211, 153, 0.4)' : inJumpZone ? 'rgba(244, 114, 182, 0.8)' : 'rgba(244, 114, 182, 0.4)';
      ctx.lineWidth = inJumpZone ? 2 : 1.2;
      ctx.beginPath();
      ctx.moveTo(cx, badgeY + badgeH / 2);
      ctx.lineTo(cx, cy - r);
      ctx.stroke();
      continue;
    }

    if (obs.type === 'platform') {
      // ───────────────────────────────────────────────────────
      // PLATAFORMA ELEVADA (Solid Tech Block)
      // ───────────────────────────────────────────────────────
      const platColor = obs.cleared ? '#34d399' : '#0284c7';
      ctx.save();
      ctx.shadowBlur = 8;
      ctx.shadowColor = platColor;

      // Corpo escuro
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

      ctx.strokeStyle = platColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

      // Topo luminoso (superfície de aterrissagem)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(obs.x, obs.y);
      ctx.lineTo(obs.x + obs.width, obs.y);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(obs.x + 2, obs.y + 1);
      ctx.lineTo(obs.x + obs.width - 2, obs.y + 1);
      ctx.stroke();

      // Espinhos letais no chão embaixo da plataforma
      const spikeCount = Math.floor(obs.width / 24);
      for (let s = 0; s < spikeCount; s++) {
        const sx = obs.x + s * 24;
        const sw = 22;
        const sh = 18;
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.moveTo(sx, groundY);
        ctx.lineTo(sx + sw / 2, groundY - sh);
        ctx.lineTo(sx + sw, groundY);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Badge de salto na entrada da plataforma
      const badgeCenterX = obs.x + 30;
      const badgeY = obs.y - 25;
      const badgeW = 34;
      const badgeH = 34;

      ctx.fillStyle = obs.cleared ? 'rgba(6, 78, 59, 0.98)' : 'rgba(10, 14, 26, 0.98)';
      ctx.strokeStyle = obs.cleared ? '#34d399' : '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(badgeCenterX - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = obs.cleared ? '#6ee7b7' : '#ffffff';
      ctx.font = '900 19px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obs.letter.toUpperCase(), badgeCenterX, badgeY);

      // Haste
      ctx.strokeStyle = obs.cleared ? 'rgba(52, 211, 153, 0.4)' : 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(badgeCenterX, badgeY + badgeH / 2);
      ctx.lineTo(badgeCenterX, obs.y);
      ctx.stroke();
      continue;
    }

    if (obs.type === 'portal') {
      // ───────────────────────────────────────────────────────
      // PORTAL DE ACELERAÇÃO (Speed Portal 2x)
      // ───────────────────────────────────────────────────────
      ctx.save();
      const portalHeight = 150;
      const portalTop = groundY - portalHeight;
      const portalColor = '#facc15';
      ctx.shadowBlur = 16;
      ctx.shadowColor = portalColor;

      // Arco exterior
      ctx.strokeStyle = portalColor;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(obs.x + obs.width / 2, portalTop + portalHeight / 2, obs.width / 2, portalHeight / 2, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Vórtice de aceleração
      const portalGrad = ctx.createLinearGradient(obs.x, portalTop, obs.x + obs.width, portalTop + portalHeight);
      portalGrad.addColorStop(0, 'rgba(250, 204, 21, 0.25)');
      portalGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.55)');
      portalGrad.addColorStop(1, 'rgba(234, 179, 8, 0.25)');
      ctx.fillStyle = portalGrad;
      ctx.beginPath();
      ctx.ellipse(obs.x + obs.width / 2, portalTop + portalHeight / 2, obs.width / 2 - 3, portalHeight / 2 - 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Badge superior do portal
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = portalColor;
      ctx.lineWidth = 1.8;
      const tagW = 92;
      const tagH = 22;
      ctx.beginPath();
      ctx.roundRect(obs.x + obs.width / 2 - tagW / 2, portalTop - 30, tagW, tagH, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = '900 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SPEED BOOST [2X]', obs.x + obs.width / 2, portalTop - 19);

      ctx.restore();
      continue;
    }

    if (obs.type === 'rail') {
      // ───────────────────────────────────────────────────────
      // TRILHO DE DESLIZE (Hold-to-Grind Rail - Denshattack!)
      // ───────────────────────────────────────────────────────
      const railH = obs.elevation || 64;
      const railY = groundY - railH;
      const railLen = obs.width;
      const sweetStart = railLen * 0.8;

      ctx.save();
      // 1. Postes de sustentação estrutural
      const pylonCount = Math.max(2, Math.floor(railLen / 90));
      for (let p = 0; p <= pylonCount; p++) {
        const px = obs.x + (railLen / pylonCount) * p;
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px, groundY);
        ctx.lineTo(px, railY + 4);
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px - 5, groundY - 5, 10, 5);
      }

      // 2. Viga do trilho (estrutura sólida)
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(obs.x, railY);
      ctx.lineTo(obs.x + railLen, railY);
      ctx.stroke();

      // 3. Feixe elétrico superior (Trilho condutor)
      ctx.shadowBlur = obs.isGrinding ? 16 : 8;
      ctx.shadowColor = obs.isGrinding ? '#38bdf8' : '#0284c7';
      ctx.strokeStyle = obs.isGrinding ? '#67e8f9' : '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(obs.x, railY);
      ctx.lineTo(obs.x + sweetStart, railY);
      ctx.stroke();

      // 4. Zona Sweet Spot de Desmonte (Final do trilho: 80% a 100%)
      const sweetPulse = Math.sin(Date.now() / 100) * 0.25 + 0.75;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#facc15';
      ctx.strokeStyle = `rgba(250, 204, 21, ${sweetPulse})`;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(obs.x + sweetStart, railY);
      ctx.lineTo(obs.x + railLen, railY);
      ctx.stroke();

      // 5. Marcador no Sweet Spot
      ctx.fillStyle = '#fde047';
      ctx.fillRect(obs.x + railLen - 3, railY - 14, 3, 14);
      ctx.font = '900 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fef08a';
      ctx.fillText('RELEASE!', obs.x + sweetStart + (railLen - sweetStart) / 2, railY - 10);

      // 6. Badge flutuante de entrada do trilho [HOLD TECLA]
      const badgeX = obs.x + 36;
      const badgeY = railY - 24;
      const badgeW = 74;
      const badgeH = 26;
      ctx.fillStyle = obs.cleared ? 'rgba(6, 78, 59, 0.95)' : 'rgba(15, 23, 42, 0.96)';
      ctx.strokeStyle = obs.cleared ? '#34d399' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(badgeX - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = obs.cleared ? '#6ee7b7' : '#ffffff';
      ctx.font = '900 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`HOLD ${obs.letter.toUpperCase()}`, badgeX, badgeY);

      ctx.restore();
      continue;
    }

    if (obs.type === 'ramp') {
      // ───────────────────────────────────────────────────────
      // RAMPA DE MANOBRAS AÉREAS (Trick Ramp - Denshattack!)
      // ───────────────────────────────────────────────────────
      const rampW = obs.width || 60;
      const rampH = obs.height || 42;
      ctx.save();
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#ec4899';

      // Cunha inclinada da rampa
      const rampGrad = ctx.createLinearGradient(obs.x, groundY, obs.x + rampW, groundY - rampH);
      rampGrad.addColorStop(0, '#1e1b4b');
      rampGrad.addColorStop(0.5, '#4c1d95');
      rampGrad.addColorStop(1, '#ec4899');
      ctx.fillStyle = rampGrad;
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(obs.x, groundY);
      ctx.lineTo(obs.x + rampW, groundY - rampH);
      ctx.lineTo(obs.x + rampW, groundY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Chevrons de impulso rápidos (>>)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      for (let c = 0; c < 2; c++) {
        const cx = obs.x + 18 + c * 18;
        const cy = groundY - rampH / 2 + c * 3;
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy + 6);
        ctx.lineTo(cx + 4, cy);
        ctx.lineTo(cx - 5, cy - 6);
        ctx.stroke();
      }

      // Tag aérea de Manobra
      const tagX = obs.x + rampW / 2;
      const tagY = groundY - rampH - 14;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(tagX - 44, tagY - 10, 88, 20, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f472b6';
      ctx.font = '900 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TRICK RAMP', tagX, tagY);

      ctx.restore();
      continue;
    }

    const spikeColor = obs.cleared ? '#10b981' : '#f43f5e';

    // 1. Desenho do Triângulo (Espinho)
    ctx.save();
    ctx.shadowBlur = obs.cleared ? 4 : 8;
    ctx.shadowColor = spikeColor;

    if (obs.type === 'single' || obs.type === 'tall') {
      const topY = groundY - obs.height;
      const grad = ctx.createLinearGradient(obs.x, topY, obs.x, groundY);
      grad.addColorStop(0, spikeColor);
      grad.addColorStop(1, '#180509');

      ctx.fillStyle = grad;
      ctx.strokeStyle = spikeColor;
      ctx.lineWidth = 2.2;

      ctx.beginPath();
      ctx.moveTo(obs.x, groundY);
      ctx.lineTo(obs.x + obs.width / 2, topY);
      ctx.lineTo(obs.x + obs.width, groundY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (obs.type === 'double') {
      const halfWidth = obs.width / 2;
      const topY = groundY - obs.height;

      for (let j = 0; j < 2; j++) {
        const startX = obs.x + j * halfWidth;
        const grad = ctx.createLinearGradient(startX, topY, startX, groundY);
        grad.addColorStop(0, spikeColor);
        grad.addColorStop(1, '#180509');

        ctx.fillStyle = grad;
        ctx.strokeStyle = spikeColor;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(startX, groundY);
        ctx.lineTo(startX + halfWidth / 2, topY);
        ctx.lineTo(startX + halfWidth, groundY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();

    // 2. Pílula / Badge Flutuante da Tecla Única
    const distToCube = obs.x - (cube.x + cube.size);
    const inJumpZone = distToCube >= -15 && distToCube <= 260 && !obs.cleared;

    const badgeY = groundY - obs.height - 26;
    const badgeCenterX = obs.x + obs.width / 2;
    const badgeW = inJumpZone ? 38 : 32;
    const badgeH = inJumpZone ? 38 : 32;
    const badgeRadius = 9;

    ctx.save();
    if (inJumpZone) {
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#facc15';
    }
    ctx.fillStyle = obs.cleared ? 'rgba(6, 78, 59, 0.98)' : inJumpZone ? 'rgba(120, 53, 15, 0.98)' : 'rgba(8, 12, 22, 0.98)';
    ctx.strokeStyle = obs.cleared ? '#34d399' : inJumpZone ? '#fde047' : '#f59e0b';
    ctx.lineWidth = inJumpZone ? 3 : 2.2;

    ctx.beginPath();
    ctx.roundRect(badgeCenterX - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, badgeRadius);
    ctx.fill();
    ctx.stroke();

    // Letra
    ctx.fillStyle = obs.cleared ? '#6ee7b7' : inJumpZone ? '#ffffff' : '#fef08a';
    ctx.font = inJumpZone ? '900 22px "JetBrains Mono", monospace' : '900 18px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(obs.letter.toUpperCase(), badgeCenterX, badgeY);
    ctx.restore();

    // Haste estética
    ctx.strokeStyle = obs.cleared ? 'rgba(52, 211, 153, 0.4)' : inJumpZone ? 'rgba(250, 204, 21, 0.85)' : 'rgba(253, 224, 71, 0.4)';
    ctx.lineWidth = inJumpZone ? 2 : 1.2;
    ctx.beginPath();
    ctx.moveTo(badgeCenterX, badgeY + badgeH / 2);
    ctx.lineTo(badgeCenterX, groundY - obs.height);
    ctx.stroke();
  }

  // ─────────────────────────────────────────────────────────
  // 7. Partículas Neon (Aceleração por Additive Blending / Lighter)
  // ─────────────────────────────────────────────────────────
  if (particles.length > 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; // Glow nativo sem custo de shadowBlur
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.alpha <= 0) continue;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      ctx.translate(p.x, p.y);
      if (p.rotation) {
        ctx.rotate(p.rotation);
      }

      if (p.shape === 'square') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else if (p.shape === 'shard') {
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size / 2, p.size);
        ctx.lineTo(-p.size / 2, p.size);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────
  // 7.5 Ghost Trail (Rastro Neon do Bytezinho Atrás do Corredor)
  // ─────────────────────────────────────────────────────────
  if (ghostTrail && ghostTrail.length > 0) {
    ctx.save();
    const ghostSprite = getBytezinhoCanvasSprite(bytezinhoSkin, 'normal', false, false);
    const drawSize = cube.size * 1.35;

    for (let i = 0; i < ghostTrail.length; i++) {
      const ghost = ghostTrail[i];
      if (ghost.alpha <= 0.02) continue;
      ctx.save();
      const halfSize = cube.size / 2;
      ctx.translate(ghost.x + halfSize, ghost.y + halfSize);
      ctx.rotate(ghost.rotation);
      ctx.globalAlpha = ghost.alpha * 0.45;

      if (ghostSprite) {
        ctx.drawImage(ghostSprite, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
      } else {
        ctx.fillStyle = `hsl(${(currentHue + i * 20) % 360}, 85%, 60%)`;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.roundRect(-halfSize, -halfSize, cube.size, cube.size, 6);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────
  // 8. Mascote Oficial Bytezinho (Fiel ao BytezinhoAvatar 1:1)
  // ─────────────────────────────────────────────────────────
  if (!isInvulnerable || Math.floor(Date.now() / 80) % 2 === 0) {
    ctx.save();
    const cubeCenterX = cube.x + cube.size / 2;
    const cubeCenterY = cube.y + cube.size / 2;

    ctx.translate(cubeCenterX, cubeCenterY);
    ctx.rotate(cube.rotation);

    const isBlinkingNow = (Date.now() % 3800) < 160;
    const isHotCombo = combo >= 8;
    const mood: 'normal' | 'happy' | 'fire' | 'oops' = 
      isInvulnerable ? 'oops' :
      (cube.isJumping || activeGrind || activeTrick) ? 'happy' :
      isHotCombo ? 'fire' :
      'normal';

    const sprite = getBytezinhoCanvasSprite(bytezinhoSkin, mood, isBlinkingNow, isHotCombo);
    const drawSize = cube.size * 1.42;

    // Sombra / Aura Cel-Shaded de acordo com o estado do Geometry Dash
    if (isHotCombo) {
      ctx.shadowBlur = 22;
      ctx.shadowColor = '#f59e0b';
    } else if (cube.isJumping) {
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#06b6d4';
    } else {
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
    }

    if (sprite) {
      ctx.drawImage(sprite, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
    } else {
      // Fallback estético inicial enquanto o sprite SVG compila em milissegundos
      const halfSize = cube.size / 2;
      ctx.fillStyle = '#1c2230';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-halfSize, -halfSize, cube.size, cube.size, 8);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────
  // 9. Escudo de Força do Guerreiro (se ativo)
  // ─────────────────────────────────────────────────────────
  if (hasShield) {
    ctx.save();
    const shieldCenterX = cube.x + cube.size / 2;
    const shieldCenterY = cube.y + cube.size / 2;
    const shieldRadius = cube.size * 0.85;

    ctx.shadowBlur = 12;
    ctx.shadowColor = '#34d399';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.2;

    ctx.beginPath();
    ctx.arc(shieldCenterX, shieldCenterY, shieldRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(52, 211, 153, 0.12)';
    ctx.fill();

    const rotAngle = (Date.now() / 400) % (Math.PI * 2);
    ctx.setLineDash([12, 10]);
    ctx.strokeStyle = 'rgba(110, 231, 183, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(shieldCenterX, shieldCenterY, shieldRadius + 4, rotAngle, rotAngle + Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────
  // 10. Textos Flutuantes (PERFECT / GOOD / MISS / SHIELD)
  // ─────────────────────────────────────────────────────────
  for (let i = 0; i < floatingTexts.length; i++) {
    const ft = floatingTexts[i];
    if (ft.alpha <= 0) continue;

    ctx.save();
    ctx.globalAlpha = Math.max(0, ft.alpha);
    ctx.fillStyle = ft.color;
    ctx.font = `900 ${Math.round(18 * ft.scale)}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────
  // 10.2 Feedback Visual Denshattack! (Hold Gauge & Air Trick HUD)
  // ─────────────────────────────────────────────────────────
  if (activeGrind) {
    ctx.save();
    const cx = activeGrind.x;
    const cy = activeGrind.y - 28;
    const barW = 86;
    const barH = 11;

    // Fundo do medidor de hold
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = activeGrind.inSweetSpot ? '#facc15' : '#38bdf8';
    ctx.lineWidth = 2;
    ctx.shadowBlur = activeGrind.inSweetSpot ? 16 : 8;
    ctx.shadowColor = activeGrind.inSweetSpot ? '#facc15' : '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(cx - barW / 2, cy - barH / 2, barW, barH, 5);
    ctx.fill();
    ctx.stroke();

    // Barra de progresso do Hold
    const fillW = Math.max(0, Math.min(barW - 4, (barW - 4) * activeGrind.progress));
    const fillGrad = ctx.createLinearGradient(cx - barW / 2 + 2, 0, cx - barW / 2 + 2 + fillW, 0);
    fillGrad.addColorStop(0, '#0284c7');
    fillGrad.addColorStop(1, activeGrind.inSweetSpot ? '#fde047' : '#38bdf8');
    ctx.fillStyle = fillGrad;
    ctx.beginPath();
    ctx.roundRect(cx - barW / 2 + 2, cy - barH / 2 + 2, fillW, barH - 4, 3);
    ctx.fill();

    // Sweet Spot Zone (últimos 20%)
    const sweetSpotX = cx + barW / 2 - barW * 0.2;
    ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
    ctx.fillRect(sweetSpotX, cy - barH / 2 + 2, barW * 0.2 - 2, barH - 4);

    // Texto de instrução
    ctx.font = '900 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (activeGrind.inSweetSpot) {
      const pulse = Math.sin(Date.now() / 60) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(254, 240, 138, ${pulse})`;
      ctx.fillText('RELEASE NOW! // SWEET SPOT', cx, cy - 15);
    } else {
      ctx.fillStyle = '#67e8f9';
      ctx.fillText(`HOLDING [${activeGrind.key}]...`, cx, cy - 15);
    }
    ctx.restore();
  }

  if (activeTrick) {
    ctx.save();
    const trickHUDX = width / 2;
    const trickHUDY = 56;

    // Painel do Combo de Manobra Aérea
    ctx.shadowBlur = 16;
    ctx.shadowColor = '#ec4899';
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 2.5;

    const panelW = 290;
    const panelH = 50;
    ctx.beginPath();
    ctx.roundRect(trickHUDX - panelW / 2, trickHUDY - panelH / 2, panelW, panelH, 10);
    ctx.fill();
    ctx.stroke();

    // Título da Manobra
    ctx.font = '900 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f472b6';
    ctx.fillText(`AIR TRICK // ${activeTrick.name}`, trickHUDX, trickHUDY - 12);

    // Sequência de Teclas
    const seq = activeTrick.sequence;
    const keySpacing = 44;
    const startX = trickHUDX - ((seq.length - 1) * keySpacing) / 2;

    for (let s = 0; s < seq.length; s++) {
      const kx = startX + s * keySpacing;
      const ky = trickHUDY + 11;
      const isDone = s < activeTrick.currentIndex;
      const isNext = s === activeTrick.currentIndex;

      ctx.fillStyle = isDone ? '#10b981' : isNext ? '#facc15' : '#334155';
      ctx.strokeStyle = isDone ? '#34d399' : isNext ? '#fef08a' : '#475569';
      ctx.lineWidth = isNext ? 2.5 : 1.5;

      ctx.beginPath();
      ctx.roundRect(kx - 14, ky - 11, 28, 22, 5);
      ctx.fill();
      ctx.stroke();

      if (isDone) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(kx - 5, ky);
        ctx.lineTo(kx - 1, ky + 4);
        ctx.lineTo(kx + 5, ky - 4);
        ctx.stroke();
      } else {
        ctx.font = '900 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isNext ? '#0f172a' : '#94a3b8';
        ctx.fillText(seq[s].toUpperCase(), kx, ky);
      }

      // Seta indicativa entre as teclas
      if (s < seq.length - 1) {
        ctx.fillStyle = isDone ? '#34d399' : '#64748b';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('→', kx + keySpacing / 2, ky);
      }
    }
    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────
  // 10.5 Popups Estilo Denshattack! (Onomatopeias e Manobras)
  // ─────────────────────────────────────────────────────────
  for (let i = 0; i < denshaPopups.length; i++) {
    const p = denshaPopups[i];
    if (p.alpha <= 0) continue;

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.scale(p.scale, p.scale);

    const bannerW = 230;
    const bannerH = 48;

    // Sombra cel-shaded preta espessa
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(-bannerW / 2 + 5, -bannerH / 2 + 5, bannerW, bannerH, 6);
    ctx.fill();

    // Corpo do Banner
    ctx.fillStyle = p.color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-bannerW / 2, -bannerH / 2, bannerW, bannerH, 6);
    ctx.fill();
    ctx.stroke();

    // Texto de Título em Estilo Quadrinho Slanted
    ctx.fillStyle = '#000000';
    ctx.font = 'italic 900 17px "JetBrains Mono", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.title, 0, p.subtitle ? -7 : 0);

    if (p.subtitle) {
      ctx.fillStyle = '#1e1b4b';
      ctx.font = '900 11px "JetBrains Mono", monospace';
      ctx.fillText(p.subtitle, 0, 11);
    }

    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────
  // 10.6 Moldura Estilizada Central da Próxima Tecla (Target Key HUD)
  // ─────────────────────────────────────────────────────────
  if (!activeTrick && obstacles.length > 0) {
    const cubeFront = cube.x + cube.size;
    let targetObs: DashObstacle | null = null;
    let minTargetDist = Infinity;

    for (let i = 0; i < obstacles.length; i++) {
      const obs = obstacles[i];
      if (obs.cleared || obs.type === 'portal') continue;
      const dist = obs.x - cubeFront;
      if (dist >= -25 && dist < 680) {
        if (dist < minTargetDist) {
          minTargetDist = dist;
          targetObs = obs;
        }
      }
    }

    if (targetObs) {
      ctx.save();
      const inJumpZone = minTargetDist >= -20 && minTargetDist <= 260;
      const isOrb = targetObs.type === 'orb';
      const isRail = targetObs.type === 'rail';

      const hudCenterX = width / 2;
      const hudCenterY = stageName ? 86 : 72;
      const frameW = 138;
      const frameH = 94;

      // Animação de pulso rítmico quando estiver na Jump Zone
      const pulseScale = inJumpZone ? 1.0 + Math.sin(Date.now() / 60) * 0.05 : 1.0;
      ctx.translate(hudCenterX, hudCenterY);
      ctx.scale(pulseScale, pulseScale);

      // 1. Sombra Cel-Shaded Mangá (Offset +4px)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(-frameW / 2 + 4, -frameH / 2 + 4, frameW, frameH, 12);
      ctx.fill();

      // 2. Fundo da Moldura Principal com Gradiente Tecnológico
      const frameGrad = ctx.createLinearGradient(0, -frameH / 2, 0, frameH / 2);
      if (inJumpZone) {
        frameGrad.addColorStop(0, isOrb ? 'rgba(88, 28, 135, 0.96)' : 'rgba(120, 53, 15, 0.96)');
        frameGrad.addColorStop(1, 'rgba(8, 12, 22, 0.98)');
      } else {
        frameGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
        frameGrad.addColorStop(1, 'rgba(5, 7, 14, 0.98)');
      }
      ctx.fillStyle = frameGrad;

      // Borda Neon Glow
      const neonColor = inJumpZone
        ? isOrb ? '#f472b6' : '#facc15'
        : isOrb ? '#ec4899' : '#38bdf8';
      ctx.shadowBlur = inJumpZone ? 24 : 10;
      ctx.shadowColor = neonColor;
      ctx.strokeStyle = neonColor;
      ctx.lineWidth = inJumpZone ? 3.2 : 2.2;

      ctx.beginPath();
      ctx.roundRect(-frameW / 2, -frameH / 2, frameW, frameH, 12);
      ctx.fill();
      ctx.stroke();

      // 3. Cantoneiras Táticas de Mira (Target Brackets)
      ctx.shadowBlur = 0;
      ctx.strokeStyle = inJumpZone ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      const bLen = 9;
      const bx = frameW / 2 - 3;
      const by = frameH / 2 - 3;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(-bx + bLen, -by);
      ctx.lineTo(-bx, -by);
      ctx.lineTo(-bx, -by + bLen);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(bx - bLen, -by);
      ctx.lineTo(bx, -by);
      ctx.lineTo(bx, -by + bLen);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(-bx, by - bLen);
      ctx.lineTo(-bx, by);
      ctx.lineTo(-bx + bLen, by);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(bx, by - bLen);
      ctx.lineTo(bx, by);
      ctx.lineTo(bx - bLen, by);
      ctx.stroke();

      // 4. Etiqueta Superior do Tipo de Obstáculo
      const tagText = isOrb
        ? '▲ JUMP ORB'
        : isRail
        ? '⚡ HOLD RAIL'
        : targetObs.type === 'platform'
        ? '◄ PLATAFORMA'
        : '◄ SALTO SOLO';

      ctx.font = '900 9.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = inJumpZone
        ? isOrb ? '#fbcfe8' : '#fef08a'
        : isOrb ? '#f472b6' : '#38bdf8';
      ctx.fillText(tagText, 0, -frameH / 2 + 13);

      // 5. Letra GIGANTE Central com Contorno Cel-Shaded de Alto Contraste
      const letter = targetObs.letter.toUpperCase();
      ctx.font = inJumpZone
        ? '900 48px "JetBrains Mono", monospace'
        : '900 44px "JetBrains Mono", monospace';

      // Contorno preto pesado (stroke cel-shaded) para leitura instantânea
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.lineJoin = 'miter';
      ctx.strokeText(letter, 0, 1);

      // Preenchimento de alto contraste
      ctx.fillStyle = inJumpZone
        ? '#ffffff'
        : isOrb ? '#fbcfe8' : '#fde047';
      ctx.fillText(letter, 0, 1);

      // 6. Rodapé: Pílula "SALTE AGORA!" ou Barra de Aproximação
      if (inJumpZone) {
        // Pílula Dourada/Rosa Neon Pulsante
        const pillW = 100;
        const pillH = 17;
        const pillY = frameH / 2 - 14;

        ctx.fillStyle = isOrb ? '#ec4899' : '#facc15';
        ctx.beginPath();
        ctx.roundRect(-pillW / 2, pillY - pillH / 2, pillW, pillH, 5);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.font = '900 10px "JetBrains Mono", monospace';
        ctx.fillText(isRail ? 'SEGURE TECLA!' : '⚡ SALTE AGORA!', 0, pillY);
      } else {
        // Barra de Aproximação Progressiva até a Jump Zone (dist: 680px -> 260px)
        const approachRatio = Math.max(0, Math.min(1, (680 - minTargetDist) / (680 - 260)));
        const barW = 88;
        const barH = 5;
        const barY = frameH / 2 - 17;

        // Fundo da barra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.roundRect(-barW / 2, barY - barH / 2, barW, barH, 2.5);
        ctx.fill();

        // Preenchimento
        const fillW = Math.max(3, barW * approachRatio);
        ctx.fillStyle = isOrb ? '#ec4899' : '#38bdf8';
        ctx.beginPath();
        ctx.roundRect(-barW / 2, barY - barH / 2, fillW, barH, 2.5);
        ctx.fill();

        // Texto "APROXIMANDO..."
        ctx.fillStyle = '#94a3b8';
        ctx.font = '900 8.5px "JetBrains Mono", monospace';
        ctx.fillText('APROXIMANDO...', 0, frameH / 2 - 8);
      }

      ctx.restore();
    }
  }

  // ─────────────────────────────────────────────────────────
  // 11. Overlay de Pausa
  // ─────────────────────────────────────────────────────────
  if (isPaused) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 30px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSA // TYPERDASH', width / 2, height / 2 - 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText('Pressione [ESC], [TAB] ou [ESPAÇO] para Retomar', width / 2, height / 2 + 22);
    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────
  // 12. HUD Indicador de Fase / Stage
  // ─────────────────────────────────────────────────────────
  if (stageName) {
    ctx.save();
    ctx.fillStyle = 'rgba(10, 15, 30, 0.88)';
    ctx.strokeStyle = `hsl(${currentHue}, 85%, 60%)`;
    ctx.lineWidth = 1.5;
    const badgeW = 230;
    const badgeH = 26;
    ctx.beginPath();
    ctx.roundRect(width / 2 - badgeW / 2, 8, badgeW, badgeH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stageName.toUpperCase(), width / 2, 21);
    ctx.restore();
  }

  ctx.restore();
}

interface TyperDashCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const TyperDashCanvas: React.FC<TyperDashCanvasProps> = ({ canvasRef }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden p-1 sm:p-3">
      {/* Moldura Panorâmica Moderna Geometry Dash + Mangá */}
      <div className="relative w-full max-w-[1200px] max-h-[640px] aspect-[16/9] rounded-2xl p-1 bg-gradient-to-b from-slate-900/90 via-black to-slate-950 border border-slate-700/60 shadow-[0_0_50px_rgba(0,0,0,0.85),0_0_20px_rgba(56,189,248,0.15)] flex items-center justify-center overflow-hidden">
        {/* Canvas de Renderização em 60 FPS */}
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-contain rounded-xl bg-black"
        />
      </div>
    </div>
  );
};
