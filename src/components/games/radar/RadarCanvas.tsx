import React, { useRef, useEffect } from 'react';
import { 
  RadarEnemy, 
  RadarLaser, 
  RadarParticle, 
  RadarFloatingText, 
  RadarShockwave 
} from '../../../services/radarEngine';

interface RadarCanvasProps {
  enemies: RadarEnemy[];
  lasers: RadarLaser[];
  particles: RadarParticle[];
  floatingTexts?: RadarFloatingText[];
  shockwaves?: RadarShockwave[];
  activeTargetId: string | null;
  shield: number;
  maxShield: number;
  health: number;
  maxHealth: number;
  freezeActive: boolean;
  shockwaveActive: boolean;
  screenShakeIntensity?: number;
  isPaused: boolean;
}

interface PhosphorDust {
  r: number;
  angle: number;
  size: number;
  alpha: number;
  decay: number;
}

interface OrbitalParticle {
  r: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
  baseAlpha: number;
}

export const RadarCanvas: React.FC<RadarCanvasProps> = ({
  enemies,
  lasers,
  particles,
  floatingTexts = [],
  shockwaves = [],
  activeTargetId,
  shield,
  maxShield,
  health,
  maxHealth,
  freezeActive,
  shockwaveActive,
  screenShakeIntensity = 0,
  isPaused
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sweepAngleRef = useRef<number>(0);
  const coreRotationRef = useRef<number>(0);
  const dustParticlesRef = useRef<PhosphorDust[]>([]);
  const orbitalRingRef = useRef<OrbitalParticle[]>([]);

  // Inicializar anel orbital de poeira cósmica ciano/esmeralda (idêntico à imagem de referência)
  if (orbitalRingRef.current.length === 0) {
    const list: OrbitalParticle[] = [];
    for (let i = 0; i < 90; i++) {
      list.push({
        r: 155 + Math.random() * 95,
        angle: Math.random() * Math.PI * 2,
        speed: (Math.random() < 0.5 ? 1 : -1) * (0.04 + Math.random() * 0.12),
        size: 1.2 + Math.random() * 2.4,
        color: Math.random() < 0.65 ? '#38bdf8' : '#34d399',
        baseAlpha: 0.25 + Math.random() * 0.55
      });
    }
    orbitalRingRef.current = list;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(width, height) / 2 - 32;

      if (!isPaused) {
        // Velocidade da varredura do radar
        const sweepSpeed = freezeActive ? 0.8 : 2.2;
        sweepAngleRef.current = (sweepAngleRef.current + sweepSpeed * dt) % (Math.PI * 2);
        coreRotationRef.current = (coreRotationRef.current + 1.2 * dt) % (Math.PI * 2);

        // Movimento do anel orbital
        orbitalRingRef.current.forEach((op) => {
          op.angle = (op.angle + op.speed * dt) % (Math.PI * 2);
        });

        // Gerar poeira fosforescente ao longo do feixe de varredura
        if (Math.random() < 0.7) {
          const randR = 30 + Math.random() * (maxR - 35);
          dustParticlesRef.current.push({
            r: randR,
            angle: sweepAngleRef.current - Math.random() * 0.15,
            size: 1 + Math.random() * 2.5,
            alpha: 0.85 + Math.random() * 0.15,
            decay: 0.9 + Math.random() * 0.8
          });
        }
      }

      // Atualizar e decair partículas fosforescentes
      dustParticlesRef.current = dustParticlesRef.current
        .map((p) => ({ ...p, alpha: p.alpha - p.decay * dt }))
        .filter((p) => p.alpha > 0);

      ctx.save();

      // Screen Shake (Tremor de Impacto ao sofrer dano ou usar /NUKE)
      if (screenShakeIntensity > 0) {
        const shakeX = (Math.random() - 0.5) * screenShakeIntensity;
        const shakeY = (Math.random() - 0.5) * screenShakeIntensity;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Limpar Fundo Radar CRT
      ctx.fillStyle = '#05080d';
      ctx.fillRect(0, 0, width, height);

      // Fundo fosforescente com gradiente radial
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, maxR);
      bgGrad.addColorStop(0, freezeActive ? 'rgba(6, 182, 212, 0.15)' : 'rgba(16, 185, 129, 0.1)');
      bgGrad.addColorStop(0.65, 'rgba(4, 18, 22, 0.85)');
      bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0.98)');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.fill();

      // 2. Anel Cósmico Orbital de Poeira (Efeito Nebular idêntico à imagem de referência)
      orbitalRingRef.current.forEach((op) => {
        const ox = cx + Math.cos(op.angle) * op.r;
        const oy = cy + Math.sin(op.angle) * op.r;
        ctx.save();
        ctx.globalAlpha = op.baseAlpha;
        ctx.fillStyle = op.color;
        ctx.shadowColor = op.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(ox, oy, op.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3. Anéis Concéntricos de Alcance Militar (100m, 200m, 300m, 400m)
      const ringSteps = [0.25, 0.5, 0.75, 1.0];
      const ringDistances = ['100m', '200m', '300m', '400m'];

      ringSteps.forEach((step, idx) => {
        const r = maxR * step;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 0 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.25)';
        ctx.lineWidth = idx === 0 ? 1.8 : 1;
        if (idx === 0) {
          ctx.setLineDash([5, 4]); // Zona crítica tracejada
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();

        // Rótulos de Distância Tática
        ctx.fillStyle = idx === 0 ? 'rgba(248, 113, 113, 0.8)' : 'rgba(16, 185, 129, 0.6)';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(ringDistances[idx], cx + 8, cy - r + 12);
      });
      ctx.setLineDash([]);

      // 4. Eixos Cruzados & Ticks Angulares
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.16)';
      ctx.lineWidth = 1;
      ctx.stroke();

      for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
        const isMajor = Math.round((a / (Math.PI / 6))) === a / (Math.PI / 6);
        const tickLen = isMajor ? 9 : 5;
        const x1 = cx + Math.cos(a) * (maxR - tickLen);
        const y1 = cy + Math.sin(a) * (maxR - tickLen);
        const x2 = cx + Math.cos(a) * maxR;
        const y2 = cy + Math.sin(a) * maxR;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isMajor ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.22)';
        ctx.stroke();
      }

      // 5. Varredura do Radar (Sweep Beam Denso com Rastro e Bloom)
      const sweepAngle = sweepAngleRef.current;
      const trailAngle = 0.58;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, sweepAngle - trailAngle, sweepAngle, false);
      ctx.closePath();

      const sweepGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxR);
      sweepGrad.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
      sweepGrad.addColorStop(0.6, freezeActive ? 'rgba(6, 182, 212, 0.26)' : 'rgba(16, 185, 129, 0.2)');
      sweepGrad.addColorStop(1, freezeActive ? 'rgba(6, 182, 212, 0.05)' : 'rgba(16, 185, 129, 0.04)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Linha de cabeçalho do feixe com brilho intenso (Bloom)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * maxR, cy + Math.sin(sweepAngle) * maxR);
      ctx.strokeStyle = freezeActive ? '#67e8f9' : '#6ee7b7';
      ctx.lineWidth = 2.4;
      ctx.shadowColor = freezeActive ? '#06b6d4' : '#10b981';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.restore();

      // 6. Partículas Fosforescentes de Poeira
      dustParticlesRef.current.forEach((dust) => {
        const dx = cx + Math.cos(dust.angle) * dust.r;
        const dy = cy + Math.sin(dust.angle) * dust.r;
        ctx.save();
        ctx.globalAlpha = Math.max(0, dust.alpha);
        ctx.fillStyle = freezeActive ? '#67e8f9' : '#34d399';
        ctx.shadowColor = freezeActive ? '#06b6d4' : '#10b981';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(dx, dy, dust.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 7. Shockwaves em Anéis de Impacto
      shockwaves.forEach((sw) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, sw.life);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // 8. Partículas de Explosão & Detonações
      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 9;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 9. Feixes de Laser Disparados
      lasers.forEach((laser) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, laser.life);
        ctx.strokeStyle = laser.color;
        ctx.lineWidth = 4;
        ctx.shadowColor = laser.color;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.moveTo(laser.startX, laser.startY);
        ctx.lineTo(laser.endX, laser.endY);
        ctx.stroke();

        // Muzzle flash no início do laser
        ctx.beginPath();
        ctx.arc(laser.startX, laser.startY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      });

      // 10. Renderização dos Inimigos como Hologramas Táticos 3D
      enemies.forEach((enemy) => {
        const ex = cx + Math.cos(enemy.angle) * enemy.distance;
        const ey = cy + Math.sin(enemy.angle) * enemy.distance;
        const isTarget = enemy.id === activeTargetId;
        const isCriticalZone = enemy.distance < maxR * 0.25;

        // Traçador do feixe de perigo apontando para o bunker
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = isTarget
          ? 'rgba(56, 189, 248, 0.45)'
          : isCriticalZone
          ? 'rgba(239, 68, 68, 0.38)'
          : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = isTarget ? 1.8 : 1;
        ctx.setLineDash(isTarget ? [] : [3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Rotação da nave apontando para o centro
        const angleTowardsCenter = Math.atan2(cy - ey, cx - ex);
        ctx.save();
        ctx.translate(ex, ey);
        ctx.rotate(angleTowardsCenter);

        // Cores táticas
        let primaryColor = '#10b981';
        let accentColor = '#34d399';
        if (enemy.type === 'boss') {
          primaryColor = '#f43f5e';
          accentColor = '#fda4af';
        } else if (enemy.type === 'tank') {
          primaryColor = '#f59e0b';
          accentColor = '#fbbf24';
        } else if (enemy.type === 'glitch') {
          primaryColor = '#a855f7';
          accentColor = '#c084fc';
        } else if (enemy.type === 'scout') {
          primaryColor = '#ef4444';
          accentColor = '#f87171';
        }
        if (isTarget) {
          primaryColor = '#38bdf8';
          accentColor = '#7dd3fc';
        }

        ctx.strokeStyle = primaryColor;
        ctx.fillStyle = primaryColor;
        ctx.shadowColor = primaryColor;
        ctx.shadowBlur = isTarget ? 18 : enemy.type === 'boss' ? 22 : 8;
        ctx.lineWidth = enemy.type === 'boss' ? 2.4 : 1.8;

        // --- Holograma 3D Wireframe ampliado para visibilidade Full HD ---
        if (enemy.type === 'boss') {
          // BOSS: Dreadnought Colossal Classe Ômega (3x escala)
          ctx.beginPath();
          ctx.moveTo(34, 0); // Proa dianteira
          ctx.lineTo(24, -14);
          ctx.lineTo(12, -26); // Asa esquerda
          ctx.lineTo(-14, -28);
          ctx.lineTo(-24, -18);
          ctx.lineTo(-28, -8);
          ctx.lineTo(-28, 8);
          ctx.lineTo(-24, 18);
          ctx.lineTo(-14, 28); // Asa direita
          ctx.lineTo(12, 26);
          ctx.lineTo(24, 14);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

          // Reator de plasma central pulsante
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fillStyle = '#f43f5e';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Escudo rotativo ao redor do núcleo
          ctx.beginPath();
          ctx.arc(0, 0, 18, coreRotationRef.current, coreRotationRef.current + Math.PI * 1.4);
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Turbinas quádruplas na popa
          [[-28, -12], [-28, -4], [-28, 4], [-28, 12]].forEach(([tx, ty]) => {
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(tx - 14 - Math.random() * 8, ty);
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 2.5;
            ctx.stroke();
          });
        } else if (enemy.type === 'scout') {
          // SCOUT: Caça Interceptor supersônico
          ctx.beginPath();
          ctx.moveTo(16, 0); // Nariz
          ctx.lineTo(-8, -9); // Asa esquerda
          ctx.lineTo(-5, -2);
          ctx.lineTo(-12, -1.5);
          ctx.lineTo(-12, 1.5);
          ctx.lineTo(-5, 2);
          ctx.lineTo(-8, 9); // Asa direita
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(6, -3.5);
          ctx.lineTo(0, 0);
          ctx.lineTo(6, 3.5);
          ctx.strokeStyle = accentColor;
          ctx.stroke();
        } else if (enemy.type === 'drone') {
          // DRONE: Drone tático quad-rotor
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(-10, -10);
          ctx.lineTo(10, 10);
          ctx.moveTo(-10, 10);
          ctx.lineTo(10, -10);
          ctx.stroke();

          [[-10, -10], [10, 10], [-10, 10], [10, -10]].forEach(([rx, ry]) => {
            ctx.beginPath();
            ctx.arc(rx, ry, 4, 0, Math.PI * 2);
            ctx.stroke();
          });
        } else if (enemy.type === 'tank') {
          // TANK: Cruzador Encouraçado Pesado
          ctx.beginPath();
          ctx.moveTo(18, -4);
          ctx.lineTo(18, -2);
          ctx.lineTo(13, -2);
          ctx.lineTo(10, -10);
          ctx.lineTo(-12, -11);
          ctx.lineTo(-15, -4);
          ctx.lineTo(-15, 4);
          ctx.lineTo(-12, 11);
          ctx.lineTo(10, 10);
          ctx.lineTo(13, 2);
          ctx.lineTo(18, 2);
          ctx.lineTo(18, 4);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(0, -7);
          ctx.lineTo(6, 0);
          ctx.lineTo(0, 7);
          ctx.lineTo(-7, 0);
          ctx.closePath();
          ctx.strokeStyle = accentColor;
          ctx.stroke();
        } else {
          // GLITCH: Anomalia Cibernética fragmentada
          ctx.beginPath();
          ctx.moveTo(12, 0);
          ctx.lineTo(6, -10);
          ctx.lineTo(-8, -8);
          ctx.lineTo(-12, 2);
          ctx.lineTo(-5, 10);
          ctx.lineTo(7, 7);
          ctx.closePath();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-6, -6);
          ctx.lineTo(5, 5);
          ctx.moveTo(5, -6);
          ctx.lineTo(-6, 5);
          ctx.strokeStyle = accentColor;
          ctx.stroke();
        }

        // Rastro de fogo propulsor ativo
        ctx.beginPath();
        ctx.moveTo(-11, 0);
        ctx.lineTo(-20 - Math.random() * 9, 0);
        ctx.strokeStyle = isCriticalZone ? '#f87171' : '#fbbf24';
        ctx.lineWidth = 2.8;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.stroke();

        ctx.restore();

        // 11. Caixa de Palavra Tática Flutuante com Brackets [ type-lock ]
        ctx.save();
        ctx.font = 'bold 13px monospace';
        const textWidth = ctx.measureText(enemy.word).width;
        const boxPadX = 10;
        const boxPadY = 5;
        const boxW = Math.max(textWidth + boxPadX * 2, 70);
        const boxH = 26;
        const boxX = ex - boxW / 2;
        const boxY = ey - 36;

        // Fundo com visual de visor holográfico
        ctx.fillStyle = isTarget
          ? 'rgba(7, 22, 42, 0.95)'
          : isCriticalZone
          ? 'rgba(68, 10, 10, 0.94)'
          : 'rgba(9, 14, 22, 0.9)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 6);
        ctx.fill();

        // Borda tática sci-fi chanfrada
        ctx.strokeStyle = isTarget
          ? '#38bdf8'
          : isCriticalZone
          ? '#ef4444'
          : 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = isTarget ? 2.2 : 1.2;
        ctx.shadowColor = isTarget ? '#38bdf8' : 'transparent';
        ctx.shadowBlur = isTarget ? 12 : 0;
        ctx.stroke();

        // Rótulo de status no topo da palavra
        if (enemy.type === 'boss') {
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = '#f43f5e';
          const bossBadge = `[ CHEFÃO: FASE ${enemy.bossHp || 1}/${enemy.bossMaxHp || 3} ]`;
          ctx.fillText(bossBadge, boxX + (boxW - ctx.measureText(bossBadge).width) / 2, boxY - 6);
        } else if (isTarget) {
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('[ TYPE-LOCK ]', boxX + (boxW - ctx.measureText('[ TYPE-LOCK ]').width) / 2, boxY - 5);

          // Marcador de mira reticular
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(boxX - 5, boxY + 5);
          ctx.lineTo(boxX - 5, boxY - 3);
          ctx.lineTo(boxX + 5, boxY - 3);

          ctx.moveTo(boxX + boxW + 5, boxY + boxH - 5);
          ctx.lineTo(boxX + boxW + 5, boxY + boxH + 3);
          ctx.lineTo(boxX + boxW - 5, boxY + boxH + 3);
          ctx.stroke();
        }

        // Renderização das letras digitadas vs restantes
        ctx.font = 'bold 13px monospace';
        const typedPart = enemy.word.slice(0, enemy.typedLength);
        const remainingPart = enemy.word.slice(enemy.typedLength);

        let currX = boxX + (boxW - textWidth) / 2;
        const textBaselineY = boxY + 17;

        if (typedPart.length > 0) {
          ctx.fillStyle = '#34d399';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 12;
          ctx.fillText(typedPart, currX, textBaselineY);
          currX += ctx.measureText(typedPart).width;
        }

        ctx.fillStyle = isTarget ? '#ffffff' : '#94a3b8';
        ctx.shadowBlur = 0;
        ctx.fillText(remainingPart, currX, textBaselineY);

        ctx.restore();
      });

      // 12. Base Central do Operador (Reator Cibernético)
      ctx.save();
      const rot = coreRotationRef.current;

      // Anel de Escudo Defensivo Rotativo Exterior
      if (shield > 0) {
        const shieldRatio = shield / maxShield;
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0, Math.PI * 2 * shieldRatio);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 16;
        ctx.stroke();
      }

      // Anel Segmentado Rotativo do Reator
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, 24, (i * Math.PI) / 2 + 0.15, ((i + 1) * Math.PI) / 2 - 0.15);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }
      ctx.restore();

      // Anel Interno Contra-Rotativo
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-rot * 1.5);
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, 18, (i * 2 * Math.PI) / 3 + 0.2, ((i + 1) * 2 * Math.PI) / 3 - 0.2);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.65)';
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }
      ctx.restore();

      // Núcleo Central de Integridade (HP)
      const hpRatio = Math.max(0, health / maxHealth);
      const coreColor = hpRatio > 0.5 ? '#10b981' : hpRatio > 0.25 ? '#f59e0b' : '#ef4444';

      ctx.beginPath();
      ctx.arc(cx, cy, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#090d14';
      ctx.fill();
      ctx.strokeStyle = coreColor;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Íris central pulsante
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = coreColor;
      ctx.shadowColor = coreColor;
      ctx.shadowBlur = hpRatio < 0.25 ? 20 : 14;
      ctx.fill();

      // Crosshairs táticas no núcleo
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy);
      ctx.lineTo(cx + 10, cy);
      ctx.moveTo(cx, cy - 10);
      ctx.lineTo(cx, cy + 10);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Bracket tático ao lado do reator (como na imagem de referência)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('[ BASE ]', cx + 38, cy - 10);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.font = '7px monospace';
      ctx.fillText('STATUS: OK', cx + 38, cy);
      ctx.fillText('NÚCLEO: ATIVO', cx + 38, cy + 9);

      ctx.restore();

      // 13. Textos Flutuantes (XP / PTS / BYTES / COMBO)
      floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.life);
        ctx.font = `bold ${ft.size || 14}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillStyle = ft.color;
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 12;
        ctx.fillText(ft.text, ft.x, ft.y);

        if (ft.subText) {
          ctx.font = 'bold 11px monospace';
          ctx.fillStyle = '#34d399';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 10;
          ctx.fillText(ft.subText, ft.x, ft.y + 15);
        }
        ctx.restore();
      });

      // 13.5. Barra Tática Superior do Chefe (quando houver chefão ativo)
      const activeBoss = enemies.find((e) => e.type === 'boss');
      if (activeBoss) {
        ctx.save();
        const barW = 340;
        const barH = 12;
        const barX = cx - barW / 2;
        const barY = 32;

        // Container escuro do Boss HUD
        ctx.fillStyle = 'rgba(15, 5, 10, 0.92)';
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.roundRect(barX - 16, barY - 18, barW + 32, 40, 8);
        ctx.fill();
        ctx.stroke();

        // Rótulo do Chefe e Contagem de Fases
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#fda4af';
        ctx.textAlign = 'left';
        ctx.fillText('🚨 CHEFÃO // DREADNOUGHT CLASSE ÔMEGA', barX - 6, barY - 5);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#f43f5e';
        const bossHp = activeBoss.bossHp || 1;
        const bossMaxHp = activeBoss.bossMaxHp || 3;
        ctx.fillText(`FASE ${bossHp}/${bossMaxHp}`, barX + barW + 6, barY - 5);

        // Trilho da Barra
        ctx.fillStyle = '#270d14';
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, barH, 4);
        ctx.fill();

        // Preenchimento de Vida / Fases
        const bossRatio = Math.max(0, bossHp / bossMaxHp);
        const fillW = Math.max(6, barW * bossRatio);
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(barX, barY, fillW, barH, 4);
        ctx.fill();

        // Divisores de fase
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.lineWidth = 2;
        for (let i = 1; i < bossMaxHp; i++) {
          const divX = barX + (barW / bossMaxHp) * i;
          ctx.beginPath();
          ctx.moveTo(divX, barY);
          ctx.lineTo(divX, barY + barH);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 14. Flash Militar de Detonação (/NUKE)
      if (shockwaveActive) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // 15. Linhas CRT Scanlines Raster
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1);
      }

      ctx.restore(); // Restaura transform do Screen Shake

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    enemies, 
    lasers, 
    particles, 
    floatingTexts, 
    shockwaves, 
    activeTargetId, 
    shield, 
    maxShield, 
    health, 
    maxHealth, 
    freezeActive, 
    shockwaveActive, 
    screenShakeIntensity, 
    isPaused
  ]);

  return (
    <div className="relative flex items-center justify-center p-0.5 sm:p-1 w-full">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="w-full max-h-[min(660px,65vh)] aspect-square max-w-[660px] rounded-3xl border-2 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.25),inset_0_0_20px_rgba(0,0,0,0.8)] bg-[#05080d]"
      />
    </div>
  );
};
