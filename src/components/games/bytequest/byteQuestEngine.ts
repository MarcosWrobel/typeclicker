// ─────────────────────────────────────────────────────────────
// Motor de Simulação — ByteQuest: Masmorra de Sobrevivência
// Classes Distintas:
//   - Guerreiro: Ataque Melee em arco frontal, Lento (200 px/s), Robusto (140 HP)
//   - Arqueiro: Flechas perfurantes rápidas, Mais Rápido (300 px/s), Frágil (90 HP)
//   - Mago: Magia elemental à distância, Lento (225 px/s), Muito Frágil (75 HP)
// Curva de Ondas Dinâmica: Começa desafiador, facilita com upgrades, escala novamente
// Minions com poderes especiais (tiros, investidas) e Chefes
// ─────────────────────────────────────────────────────────────

import {
  CombatEnemy,
  CombatProjectile,
  EnemyProjectile,
  CombatGem,
  FloatingDamageText,
  RunUpgradeCard,
  HeroLoadout,
  EnemyType,
  UpgradeEffectType,
  getClassSpells,
  SpellDefinition,
  DungeonObstacle,
  ShockwaveEffect
} from '../../../types/byteQuest';
import { RpgClassType } from '../../../types/rpgClass';
import { getWordForDifficulty } from '../../../data/byteQuestWords';
import { byteQuestAudio } from './byteQuestAudio';

export interface CombatParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface EngineStats {
  hp: number;
  maxHp: number;
  shieldHp: number;
  shieldDuration: number;
  freezeDuration: number;
  energy: number;
  maxEnergy: number;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  timeSurvivedSeconds: number;
  enemiesDefeated: number;
  wordsTypedCount: number;
  criticalHits: number;
  damageDealt: number;
  totalDamageTaken: number;
  keysTyped: number;
  keysCorrect: number;
}

export interface UpgradeState {
  damageBonus: number;
  speedBonus: number;
  critRateBonus: number;
  maxHpBonus: number;
  orbitalCount: number;
  chainLightningLevel: number;
  magnetRadius: number;
  typingCritMultiplier: number;
  rageBuffTimer: number; // Buff de fúria do guerreiro
  speedBuffTimer: number; // Buff de velocidade do arqueiro
}

export class ByteQuestSimulation {
  public heroX: number = 300;
  public heroY: number = 240;
  public heroVx: number = 0;
  public heroVy: number = 0;
  public heroFacing: 'left' | 'right' = 'right';
  public heroRadius: number = 24;
  public runCycle: number = 0;
  public worldSpeed: number = 100;
  public keysPressed: Record<string, boolean> = {};

  // Efeito de corte corpo-a-corpo do Guerreiro
  public meleeSlashTimer: number = 0;
  public meleeSlashAngle: number = 0;

  // Animações de ataque do herói em 360°
  public heroAttackTimer: number = 0;
  public heroAttackDuration: number = 0.22;
  public heroAttackAngle: number = 0;

  // Game Feel: Screen Shake, Shockwaves e Partículas de Combate
  public screenShake = {
    intensity: 0,
    timer: 0,
    offsetX: 0,
    offsetY: 0
  };
  public shockwaves: ShockwaveEffect[] = [];
  public particles: CombatParticle[] = [];

  public enemies: CombatEnemy[] = [];
  public projectiles: CombatProjectile[] = [];
  public enemyProjectiles: EnemyProjectile[] = [];
  public gems: CombatGem[] = [];
  public obstacles: DungeonObstacle[] = [];
  public damageTexts: FloatingDamageText[] = [];

  public lockedEnemyId: string | null = null;
  public spellBuffer: string = '';

  public stats: EngineStats;
  public upgrades: UpgradeState;
  public spellCooldowns: Record<string, number> = {};

  private autoAttackCooldown: number = 0;
  private enemySpawnTimer: number = 0;
  private invulnerabilityTimer: number = 0;
  public orbitalAngle: number = 0;

  public isBossSpawned: boolean = false;
  public isMiniBossSpawned: boolean = false;
  public isEndlessMode: boolean = false;
  public isVictoryAchieved: boolean = false;

  public rpgClass: RpgClassType;
  public loadout: HeroLoadout;
  public availableSpells: SpellDefinition[];

  public onLevelUp?: () => void;
  public onVictory?: () => void;
  public onGameOver?: () => void;

  constructor(rpgClass: RpgClassType = 'warrior', loadout: HeroLoadout = {}) {
    this.rpgClass = rpgClass;
    this.loadout = loadout;
    this.availableSpells = getClassSpells(rpgClass);

    // Atributos base calculados com rigor por arquétipo
    let baseHp = 100;
    if (rpgClass === 'warrior') {
      baseHp = 140 + (loadout.chest?.stats.health || 0); // Robusto
    } else if (rpgClass === 'archer') {
      baseHp = 90 + (loadout.chest?.stats.health || 0); // Médio
    } else {
      baseHp = 75 + (loadout.chest?.stats.health || 0); // Mago: Frágil
    }

    this.stats = {
      hp: baseHp,
      maxHp: baseHp,
      shieldHp: 0,
      shieldDuration: 0,
      freezeDuration: 0,
      energy: 40,
      maxEnergy: 100,
      level: 1,
      currentXp: 0,
      nextLevelXp: 14,
      timeSurvivedSeconds: 0,
      enemiesDefeated: 0,
      wordsTypedCount: 0,
      criticalHits: 0,
      damageDealt: 0,
      totalDamageTaken: 0,
      keysTyped: 0,
      keysCorrect: 0
    };

    this.upgrades = {
      damageBonus: (loadout.weapon?.stats.damage || 8) + (loadout.accessory?.stats.damage || 0),
      speedBonus: (loadout.weapon?.stats.speedBps || 2) + (loadout.accessory?.stats.speedBps || 0),
      critRateBonus: (loadout.weapon?.stats.critRate || 5) + (loadout.accessory?.stats.critRate || 0),
      maxHpBonus: 0,
      orbitalCount: rpgClass === 'mage' ? 2 : 0, // Mago inicia com 2 orbes passivos
      chainLightningLevel: 0,
      magnetRadius: 220,
      typingCritMultiplier: 3.0,
      rageBuffTimer: 0,
      speedBuffTimer: 0
    };

    // Inicializa cooldowns dos feitiços do arquétipo
    this.availableSpells.forEach((spell) => {
      this.spellCooldowns[spell.id] = 0;
    });
  }

  /**
   * Velocidade de locomoção adaptada ao arquétipo
   */
  public getHeroMoveSpeed(): number {
    let speed = 230;
    if (this.rpgClass === 'archer') {
      speed = 300; // Arqueiro: Mais rápido de todos
    } else if (this.rpgClass === 'warrior') {
      speed = 200; // Guerreiro: Mais lento de todos
    } else {
      speed = 225; // Mago: Lento
    }

    if (this.upgrades.speedBuffTimer > 0) {
      speed *= 1.45; // Buff temporário
    }
    return speed;
  }

  public addScreenShake(intensity: number, duration: number) {
    this.screenShake.intensity = Math.max(this.screenShake.intensity, intensity);
    this.screenShake.timer = Math.max(this.screenShake.timer, duration);
  }

  public addShockwave(x: number, y: number, maxRadius: number, color: string, lineWidth: number = 3) {
    this.shockwaves.push({
      id: `sw_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      x,
      y,
      radius: 4,
      maxRadius,
      color,
      alpha: 0.9,
      lineWidth
    });
  }

  public spawnHitParticles(x: number, y: number, color: string, count: number = 6, speed: number = 180) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (0.4 + Math.random() * 0.6) * speed;
      this.particles.push({
        id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        size: 2 + Math.random() * 3,
        alpha: 1,
        life: 0.25 + Math.random() * 0.15,
        maxLife: 0.35
      });
    }
  }

  /**
   * Gera obstáculos simétricos e balanceados na arena
   */
  public generateObstacles(arenaWidth: number, arenaHeight: number) {
    this.obstacles = [
      {
        id: 'obs_1',
        x: Math.round(arenaWidth * 0.28),
        y: Math.round(arenaHeight * 0.32),
        radius: 28,
        type: 'pillar',
        runeColor: '#38BDF8'
      },
      {
        id: 'obs_2',
        x: Math.round(arenaWidth * 0.72),
        y: Math.round(arenaHeight * 0.32),
        radius: 28,
        type: 'pillar',
        runeColor: '#A855F7'
      },
      {
        id: 'obs_3',
        x: Math.round(arenaWidth * 0.28),
        y: Math.round(arenaHeight * 0.70),
        radius: 28,
        type: 'obelisk',
        runeColor: '#34D399'
      },
      {
        id: 'obs_4',
        x: Math.round(arenaWidth * 0.72),
        y: Math.round(arenaHeight * 0.70),
        radius: 28,
        type: 'obelisk',
        runeColor: '#F59E0B'
      },
      {
        id: 'obs_center',
        x: Math.round(arenaWidth * 0.50),
        y: Math.round(arenaHeight * 0.50),
        radius: 32,
        type: 'monolith',
        runeColor: '#F43F5E'
      }
    ];
  }

  /**
   * Ciclo de atualização física e combate a 60 FPS
   */
  public update(dt: number, arenaWidth: number, arenaHeight: number) {
    if (this.stats.hp <= 0) return;

    // Inicialização tardia de obstáculos com base nas dimensões reais
    if (this.obstacles.length === 0 && arenaWidth > 200 && arenaHeight > 200) {
      this.generateObstacles(arenaWidth, arenaHeight);
    }

    this.stats.timeSurvivedSeconds += dt;
    this.runCycle += dt * (this.getHeroMoveSpeed() / 25);

    // Screen Shake dinâmico
    if (this.screenShake.timer > 0) {
      this.screenShake.timer = Math.max(0, this.screenShake.timer - dt);
      const intensity = this.screenShake.intensity * Math.min(1, this.screenShake.timer / 0.15);
      this.screenShake.offsetX = (Math.random() - 0.5) * 2 * intensity;
      this.screenShake.offsetY = (Math.random() - 0.5) * 2 * intensity;
      if (this.screenShake.timer <= 0) {
        this.screenShake.intensity = 0;
        this.screenShake.offsetX = 0;
        this.screenShake.offsetY = 0;
      }
    } else {
      this.screenShake.offsetX = 0;
      this.screenShake.offsetY = 0;
    }

    // Timer de pose de ataque do herói
    if (this.heroAttackTimer > 0) {
      this.heroAttackTimer = Math.max(0, this.heroAttackTimer - dt);
    }

    // Regeneração passiva de energia para conjuração de feitiços
    const passiveRegen = (this.rpgClass === 'mage' ? 3.2 : 2.0) * dt;
    this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + passiveRegen);

    // Atualização de Buffs temporários
    if (this.upgrades.rageBuffTimer > 0) {
      this.upgrades.rageBuffTimer = Math.max(0, this.upgrades.rageBuffTimer - dt);
    }
    if (this.upgrades.speedBuffTimer > 0) {
      this.upgrades.speedBuffTimer = Math.max(0, this.upgrades.speedBuffTimer - dt);
    }
    if (this.meleeSlashTimer > 0) {
      this.meleeSlashTimer = Math.max(0, this.meleeSlashTimer - dt);
    }

    // Movimentação do herói com teclas direcionais (Setas e WASD)
    let targetVx = 0;
    let targetVy = 0;
    const moveSpeed = this.getHeroMoveSpeed();

    if (this.keysPressed['ArrowUp'] || this.keysPressed['w'] || this.keysPressed['W']) targetVy -= moveSpeed;
    if (this.keysPressed['ArrowDown'] || this.keysPressed['s'] || this.keysPressed['S']) targetVy += moveSpeed;
    if (this.keysPressed['ArrowLeft'] || this.keysPressed['a'] || this.keysPressed['A']) {
      targetVx -= moveSpeed;
      this.heroFacing = 'left';
    }
    if (this.keysPressed['ArrowRight'] || this.keysPressed['d'] || this.keysPressed['D']) {
      targetVx += moveSpeed;
      this.heroFacing = 'right';
    }

    this.heroVx += (targetVx - this.heroVx) * 14 * dt;
    this.heroVy += (targetVy - this.heroVy) * 14 * dt;

    this.heroX += this.heroVx * dt;
    this.heroY += this.heroVy * dt;

    // Limites de locomoção ampla na tela toda
    this.heroX = Math.max(35, Math.min(arenaWidth - 35, this.heroX));
    this.heroY = Math.max(50, Math.min(arenaHeight - 65, this.heroY));

    // Colisão do Herói com os Obstáculos da Arena
    for (const obs of this.obstacles) {
      const dx = this.heroX - obs.x;
      const dy = this.heroY - obs.y;
      const dist = Math.hypot(dx, dy);
      const minDist = this.heroRadius + obs.radius;
      if (dist < minDist && dist > 0.001) {
        const overlap = minDist - dist;
        this.heroX += (dx / dist) * overlap;
        this.heroY += (dy / dist) * overlap;
      }
    }

    // Cooldowns de feitiços e congelamento
    if (this.stats.freezeDuration > 0) {
      this.stats.freezeDuration = Math.max(0, this.stats.freezeDuration - dt);
    }
    if (this.stats.shieldDuration > 0) {
      this.stats.shieldDuration = Math.max(0, this.stats.shieldDuration - dt);
      if (this.stats.shieldDuration === 0) {
        this.stats.shieldHp = 0;
      }
    }
    if (this.invulnerabilityTimer > 0) {
      this.invulnerabilityTimer = Math.max(0, this.invulnerabilityTimer - dt);
    }

    Object.keys(this.spellCooldowns).forEach((id) => {
      if (this.spellCooldowns[id] > 0) {
        this.spellCooldowns[id] = Math.max(0, this.spellCooldowns[id] - dt);
      }
    });

    // Orbes orbitais (Mago e upgrades)
    if (this.upgrades.orbitalCount > 0) {
      this.orbitalAngle += dt * 3.5;
      this.checkOrbitalCollisions();
    }

    // Ataque automático do arquétipo
    this.autoAttackCooldown -= dt;
    if (this.autoAttackCooldown <= 0) {
      this.performArchetypeAttack();
      let rate = 0.55 - this.upgrades.speedBonus * 0.035;
      if (this.rpgClass === 'archer') rate = 0.35 - this.upgrades.speedBonus * 0.025; // Arqueiro atira mais rápido
      if (this.upgrades.rageBuffTimer > 0) rate *= 0.5; // Fúria dobra a velocidade
      this.autoAttackCooldown = Math.max(0.18, rate);
    }

    // Spawner com Curva de Dificuldade Ondular
    this.updateSpawning(dt, arenaWidth, arenaHeight);

    // Movimentação e Poderes dos Inimigos em 360° em direção ao herói
    const isFrozen = this.stats.freezeDuration > 0;
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      if (enemy.hitFlashTimer && enemy.hitFlashTimer > 0) {
        enemy.hitFlashTimer = Math.max(0, enemy.hitFlashTimer - dt);
      }
      if (!isFrozen) {
        const dx = this.heroX - enemy.x;
        const dy = this.heroY - enemy.y;
        const dist = Math.hypot(dx, dy);

        // Perseguição ativa em 360 graus
        if (dist > 5) {
          enemy.x += (dx / dist) * enemy.speed * dt;
          enemy.y += (dy / dist) * enemy.speed * dt;
        }

        // Colisão de inimigos com obstáculos
        for (const obs of this.obstacles) {
          const edx = enemy.x - obs.x;
          const edy = enemy.y - obs.y;
          const edist = Math.hypot(edx, edy);
          const eMinDist = enemy.width * 0.45 + obs.radius;
          if (edist < eMinDist && edist > 0.001) {
            const eOverlap = eMinDist - edist;
            enemy.x += (edx / edist) * eOverlap;
            enemy.y += (edy / edist) * eOverlap;
          }
        }

        // Poder especial: Inimigo Atirador de Plasma (Esqueletos, Elites e Chefes)
        if (enemy.specialPower === 'shoot') {
          enemy.shootTimer = (enemy.shootTimer || 0) - dt;
          if (enemy.shootTimer <= 0) {
            this.enemyShootProjectile(enemy);
            enemy.shootTimer = enemy.isBoss ? 2.2 : 3.5;
          }
        }

        // Colisão com o herói
        if (dist < this.heroRadius + enemy.width / 2) {
          this.handleHeroHit(enemy.damage);
        }
      }
    }

    // Atualização de Projéteis do Herói
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      let hit = false;
      for (const enemy of this.enemies) {
        if (Math.hypot(p.x - enemy.x, p.y - enemy.y) < p.radius + enemy.width / 2) {
          this.damageEnemy(enemy, p.damage, p.isCrit);
          this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + 3.0);
          p.pierceCount--;
          hit = true;
          if (p.pierceCount <= 0) break;
        }
      }

      if (hit && p.pierceCount <= 0) {
        this.projectiles.splice(i, 1);
      } else if (p.x > arenaWidth + 60 || p.x < -60 || p.y > arenaHeight + 60 || p.y < -60) {
        this.projectiles.splice(i, 1);
      }
    }

    // Atualização de Projéteis Inimigos (cobertura tática nos obstáculos)
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const ep = this.enemyProjectiles[i];
      ep.x += ep.vx * dt;
      ep.y += ep.vy * dt;

      // Colisão com Obstáculos (absorção do tiro)
      let blocked = false;
      for (const obs of this.obstacles) {
        if (Math.hypot(ep.x - obs.x, ep.y - obs.y) < obs.radius + ep.radius) {
          blocked = true;
          this.addFloatingText(ep.x, ep.y, 'ESCUDO', '#64748B');
          break;
        }
      }
      if (blocked) {
        this.enemyProjectiles.splice(i, 1);
        continue;
      }

      // Colisão com o herói
      if (Math.hypot(ep.x - this.heroX, ep.y - this.heroY) < ep.radius + this.heroRadius) {
        this.handleHeroHit(ep.damage);
        this.enemyProjectiles.splice(i, 1);
        continue;
      }

      if (ep.x < -40 || ep.x > arenaWidth + 40 || ep.y < -40 || ep.y > arenaHeight + 40) {
        this.enemyProjectiles.splice(i, 1);
      }
    }

    // Gemas de XP atraídas magneticamente pelo herói
    for (let i = this.gems.length - 1; i >= 0; i--) {
      const gem = this.gems[i];
      const dx = this.heroX - gem.x;
      const dy = this.heroY - gem.y;
      const dist = Math.hypot(dx, dy);

      if (dist < this.upgrades.magnetRadius) {
        const pullSpeed = 480 * Math.max(0.3, 1 - dist / (this.upgrades.magnetRadius + 10));
        gem.x += (dx / dist) * pullSpeed * dt;
        gem.y += (dy / dist) * pullSpeed * dt;
      }

      if (dist < this.heroRadius + 18) {
        this.addXp(gem.xpValue);
        byteQuestAudio.playXpGem();
        this.gems.splice(i, 1);
      }
    }

    // Textos flutuantes
    for (let i = this.damageTexts.length - 1; i >= 0; i--) {
      const dtText = this.damageTexts[i];
      dtText.y += dtText.vy * dt;
      dtText.alpha -= dt * 1.5;
      if (dtText.alpha <= 0) {
        this.damageTexts.splice(i, 1);
      }
    }

    // Atualização de Partículas de Impacto
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.92;
      p.vy *= 0.92;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Atualização de Shockwaves expansivas
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += (sw.maxRadius - sw.radius) * 14 * dt;
      sw.alpha -= dt * 2.5;
      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius * 0.98) {
        this.shockwaves.splice(i, 1);
      }
    }

    // Verificação de vitória (5 minutos + chefão derrotado)
    if (!this.isEndlessMode && this.stats.timeSurvivedSeconds >= 300 && this.isBossSpawned && this.enemies.filter(e => e.isBoss).length === 0) {
      if (!this.isVictoryAchieved) {
        this.isVictoryAchieved = true;
        byteQuestAudio.playVictory();
        this.onVictory?.();
      }
    }
  }

  /**
   * ATAQUE ESPECÍFICO DO ARQUÉTIPO COM DANO REBALANCEADO E GERAÇÃO DE ENERGIA
   */
  private performArchetypeAttack() {
    if (this.enemies.length === 0) return;

    if (this.rpgClass === 'warrior') {
      // ─── GUERREIRO: ATAQUE MELEE EM ARCO DIRECIONAL COM GOLPE E EMPURRÃO ───
      const reach = this.upgrades.rageBuffTimer > 0 ? 150 : 120;
      const baseDmg = (18 + this.upgrades.damageBonus) * (this.upgrades.rageBuffTimer > 0 ? 1.6 : 1.0);
      const isCrit = Math.random() * 100 < this.upgrades.critRateBonus;
      const finalDmg = Math.round(isCrit ? baseDmg * 1.7 : baseDmg);

      // Localiza inimigo mais próximo no alcance corpo a corpo
      let targetAngle = this.heroFacing === 'right' ? 0 : Math.PI;
      const nearestMelee = this.enemies
        .map((e) => ({ e, dist: Math.hypot(e.x - this.heroX, e.y - this.heroY) }))
        .sort((a, b) => a.dist - b.dist)[0];

      if (nearestMelee && nearestMelee.dist <= reach * 1.35) {
        targetAngle = Math.atan2(nearestMelee.e.y - this.heroY, nearestMelee.e.x - this.heroX);
        this.heroFacing = Math.cos(targetAngle) >= 0 ? 'right' : 'left';
      }

      this.heroAttackAngle = targetAngle;
      this.heroAttackTimer = 0.22;
      this.heroAttackDuration = 0.22;
      this.meleeSlashTimer = 0.22;
      this.meleeSlashAngle = targetAngle;

      let hitAny = false;
      for (const enemy of this.enemies) {
        const dx = enemy.x - this.heroX;
        const dy = enemy.y - this.heroY;
        const dist = Math.hypot(dx, dy);

        if (dist <= reach) {
          const enemyAngle = Math.atan2(dy, dx);
          let angleDiff = Math.abs(enemyAngle - targetAngle);
          while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

          // Arco de 150 graus de alcance de corte frontal
          if (angleDiff <= 1.35) {
            this.damageEnemy(enemy, finalDmg, isCrit);
            this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + 3.0);
            // Empurrão físico na direção do golpe
            const pushDist = 34;
            enemy.x += Math.cos(targetAngle) * pushDist;
            enemy.y += Math.sin(targetAngle) * pushDist;
            hitAny = true;
          }
        }
      }

      byteQuestAudio.playAttack('blade');
    } else if (this.rpgClass === 'archer') {
      // ─── ARQUEIRO: MIRA E DISPARA FLECHAS EM 360° COM RECUO ───
      const target = this.getPriorityEnemy();
      if (!target) return;

      const dx = target.x - this.heroX;
      const dy = target.y - this.heroY;
      const dist = Math.hypot(dx, dy) || 1;
      const angle = Math.atan2(dy, dx);
      const speed = 680;

      this.heroFacing = dx < 0 ? 'left' : 'right';
      this.heroAttackAngle = angle;
      this.heroAttackTimer = 0.18;
      this.heroAttackDuration = 0.18;

      const isCrit = Math.random() * 100 < this.upgrades.critRateBonus;
      const baseDmg = 13 + this.upgrades.damageBonus;
      const finalDmg = Math.round(isCrit ? baseDmg * 1.9 : baseDmg);

      this.projectiles.push({
        id: `arrow_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        x: this.heroX + Math.cos(angle) * 18,
        y: this.heroY + Math.sin(angle) * 18,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        damage: finalDmg,
        color: '#34D399',
        radius: isCrit ? 6.5 : 4.5,
        pierceCount: 2,
        isCrit
      });

      // Partículas de vento do disparo
      this.spawnHitParticles(
        this.heroX + Math.cos(angle) * 18,
        this.heroY + Math.sin(angle) * 18,
        '#6EE7B7',
        4,
        85
      );

      byteQuestAudio.playAttack('bow');
    } else {
      // ─── MAGO: MIRA E CONJURA ELEMENTOS EM 360° COM CÍRCULO RÚNICO ───
      const target = this.getPriorityEnemy();
      if (!target) return;

      const dx = target.x - this.heroX;
      const dy = target.y - this.heroY;
      const dist = Math.hypot(dx, dy) || 1;
      const angle = Math.atan2(dy, dx);
      const speed = 460;

      this.heroFacing = dx < 0 ? 'left' : 'right';
      this.heroAttackAngle = angle;
      this.heroAttackTimer = 0.24;
      this.heroAttackDuration = 0.24;

      const isCrit = Math.random() * 100 < this.upgrades.critRateBonus;
      const baseDmg = 16 + this.upgrades.damageBonus;
      const finalDmg = Math.round(isCrit ? baseDmg * 1.8 : baseDmg);

      this.projectiles.push({
        id: `orb_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        x: this.heroX + Math.cos(angle) * 22,
        y: this.heroY + Math.sin(angle) * 22,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        damage: finalDmg,
        color: '#A855F7',
        radius: isCrit ? 8.5 : 6,
        pierceCount: 1,
        isCrit
      });

      // Partículas arcanas no cajado
      this.spawnHitParticles(
        this.heroX + Math.cos(angle) * 22,
        this.heroY + Math.sin(angle) * 22,
        '#C084FC',
        5,
        110
      );

      byteQuestAudio.playAttack('staff');
    }
  }

  private getPriorityEnemy(): CombatEnemy | null {
    if (this.enemies.length === 0) return null;
    return this.enemies
      .slice()
      .sort((a, b) => Math.hypot(a.x - this.heroX, a.y - this.heroY) - Math.hypot(b.x - this.heroX, b.y - this.heroY))[0];
  }

  /**
   * Disparo de Projétil Inimigo de Plasma
   */
  private enemyShootProjectile(enemy: CombatEnemy) {
    const dx = this.heroX - enemy.x;
    const dy = this.heroY - enemy.y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 160;

    this.enemyProjectiles.push({
      id: `ep_${Date.now()}_${Math.random()}`,
      x: enemy.x,
      y: enemy.y,
      vx: (dx / dist) * speed,
      vy: (dy / dist) * speed,
      damage: Math.round(enemy.damage * 0.8),
      color: '#EC4899',
      radius: 6
    });
  }

  /**
   * Sistema de Spawn com Ondas e surgimento em 360° por todas as bordas
   */
  private updateSpawning(dt: number, arenaWidth: number, arenaHeight: number) {
    this.enemySpawnTimer -= dt;
    const phase = this.getCurrentPhase();

    // Spawna Mini-Boss aos 120s
    if (this.stats.timeSurvivedSeconds >= 120 && !this.isMiniBossSpawned) {
      this.isMiniBossSpawned = true;
      this.spawnMiniBoss(arenaWidth, arenaHeight);
    }

    // Spawna Boss Supremo aos 270s
    if (this.stats.timeSurvivedSeconds >= 270 && !this.isBossSpawned) {
      this.isBossSpawned = true;
      this.spawnMainBoss(arenaWidth, arenaHeight);
    }

    if (this.enemySpawnTimer <= 0) {
      const maxEnemies = Math.min(26, 8 + phase * 4);
      if (this.enemies.length < maxEnemies) {
        this.spawnRandomEnemy(phase, arenaWidth, arenaHeight);
      }
      this.enemySpawnTimer = Math.max(0.4, 1.6 - phase * 0.22);
    }
  }

  public getCurrentPhase(): number {
    const s = this.stats.timeSurvivedSeconds;
    if (s < 45) return 1;
    if (s < 90) return 2;
    if (s < 160) return 3;
    if (s < 240) return 4;
    return 5;
  }

  /**
   * Spawna inimigo em 360 graus por qualquer uma das 4 bordas da tela
   * Minions comuns NÃO possuem palavras (sem digitação).
   * Inimigos Elites possuem aura e palavras para digitação crítica.
   */
  private spawnRandomEnemy(phase: number, arenaWidth: number, arenaHeight: number) {
    const side = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    if (side === 0) { // Top
      x = Math.random() * arenaWidth;
      y = -40;
    } else if (side === 1) { // Right
      x = arenaWidth + 40;
      y = Math.random() * arenaHeight;
    } else if (side === 2) { // Bottom
      x = Math.random() * arenaWidth;
      y = arenaHeight + 40;
    } else { // Left
      x = -40;
      y = Math.random() * arenaHeight;
    }

    const isElite = phase >= 2 && Math.random() < 0.28;

    if (isElite) {
      // ─── INIMIGO ELITE (TEM PALAVRA PARA DIGITAÇÃO CRÍTICA) ───
      const isRanged = Math.random() < 0.5;
      const type: EnemyType = isRanged ? 'skeleton' : 'gargoyle';
      const hp = 260 + phase * 45;
      const speed = isRanged ? 65 : 85;
      const damage = 18 + phase * 3;
      const word = getWordForDifficulty(Math.min(4, phase + 1));

      this.enemies.push({
        id: `elite_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type,
        name: isRanged ? 'Comandante de Plasma (Elite)' : 'Gárgula Alfa (Elite)',
        x,
        y,
        width: 50,
        height: 50,
        speed,
        maxHp: hp,
        hp,
        damage,
        xpValue: 12,
        word,
        wordTyped: '',
        isBoss: false,
        isElite: true,
        color: isRanged ? '#38BDF8' : '#A855F7',
        glowColor: isRanged ? 'rgba(56, 189, 248, 0.7)' : 'rgba(168, 85, 247, 0.7)',
        specialPower: isRanged ? 'shoot' : 'dash',
        shootTimer: 2.5
      });
      return;
    }

    // ─── MINION COMUM (SEM PALAVRA — DERROTADO COM ATAQUES BÁSICOS) ───
    let type: EnemyType = 'slime';
    let hp = 45 + phase * 16;
    let speed = 65 + Math.random() * 20;
    let damage = 9 + phase * 2;
    let width = 36;
    let height = 36;
    let color = '#34D399';
    let glowColor = 'rgba(52, 211, 153, 0.4)';

    if (phase >= 3 && Math.random() < 0.35) {
      type = 'gargoyle';
      hp = 75 + phase * 18;
      speed = 90 + Math.random() * 25;
      damage = 14 + phase * 3;
      width = 40;
      height = 40;
      color = '#C084FC';
      glowColor = 'rgba(192, 132, 252, 0.4)';
    } else if (phase >= 2 && Math.random() < 0.45) {
      type = 'skeleton';
      hp = 60 + phase * 16;
      speed = 60 + Math.random() * 15;
      damage = 11 + phase * 2;
      width = 38;
      height = 38;
      color = '#38BDF8';
      glowColor = 'rgba(56, 189, 248, 0.4)';
    }

    this.enemies.push({
      id: `minion_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      name: type === 'gargoyle' ? 'Gárgula Minion' : type === 'skeleton' ? 'Esqueleto Minion' : 'Slime de Dados',
      x,
      y,
      width,
      height,
      speed,
      maxHp: hp,
      hp,
      damage,
      xpValue: type === 'gargoyle' ? 4 : type === 'skeleton' ? 3 : 2,
      word: '', // Sem palavra para minions comuns!
      wordTyped: '',
      isBoss: false,
      isElite: false,
      color,
      glowColor
    });
  }

  private spawnMiniBoss(arenaWidth: number, arenaHeight: number) {
    const word = getWordForDifficulty(3);
    const hp = 950 + this.getCurrentPhase() * 150;
    this.enemies.push({
      id: `miniboss_${Date.now()}`,
      type: 'miniboss',
      name: 'Gárgula Alfa Cibernética (Mini-Chefe)',
      x: arenaWidth + 50,
      y: arenaHeight / 2,
      width: 66,
      height: 66,
      speed: 48,
      maxHp: hp,
      hp,
      damage: 28,
      xpValue: 30,
      word,
      wordTyped: '',
      isBoss: true,
      isElite: true,
      color: '#EC4899',
      glowColor: 'rgba(236, 72, 153, 0.75)',
      specialPower: 'shoot',
      shootTimer: 1.8
    });
    this.addFloatingText(arenaWidth / 2, 80, '⚠️ MINI-CHEFE SURGIU!', '#EC4899', true);
  }

  private spawnMainBoss(arenaWidth: number, arenaHeight: number) {
    const word = getWordForDifficulty(4);
    const hp = 3200;
    this.enemies.push({
      id: `boss_${Date.now()}`,
      type: 'boss',
      name: 'Guardião Rúnico do Castelo (Chefe Supremo)',
      x: arenaWidth + 70,
      y: arenaHeight / 2,
      width: 86,
      height: 86,
      speed: 38,
      maxHp: hp,
      hp,
      damage: 42,
      xpValue: 80,
      word,
      wordTyped: '',
      isBoss: true,
      isElite: true,
      color: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.85)',
      specialPower: 'shoot',
      shootTimer: 1.4
    });
    this.addFloatingText(arenaWidth / 2, 80, '⚔️ CHEFÃO SUPREMO DESPERTOU!', '#F59E0B', true);
  }

  /**
   * Checagem de contato dos orbes orbitais mágicos
   */
  private checkOrbitalCollisions() {
    const orbitRadius = 65;
    for (let i = 0; i < this.upgrades.orbitalCount; i++) {
      const angle = this.orbitalAngle + (i * Math.PI * 2) / this.upgrades.orbitalCount;
      const orbX = this.heroX + Math.cos(angle) * orbitRadius;
      const orbY = this.heroY + Math.sin(angle) * orbitRadius;

      for (const enemy of this.enemies) {
        if (Math.hypot(orbX - enemy.x, orbY - enemy.y) < 14 + enemy.width / 2) {
          const orbDmg = 9 + Math.round(this.upgrades.damageBonus * 0.4);
          this.damageEnemy(enemy, orbDmg, false);
        }
      }
    }
  }

  /**
   * Atualiza o estado das teclas direcionais (Setas) para movimentação suave
   */
  public handleDirectionKey(key: string, isDown: boolean) {
    this.keysPressed[key] = isDown;
  }

  /**
   * Resolução da entrada de digitação do jogador
   */
  public handleKeyPress(key: string): boolean {
    if (this.stats.hp <= 0) return false;

    this.stats.keysTyped++;

    // Verifica modo de comando de feitiço com '/'
    if (key === '/' || this.spellBuffer.length > 0) {
      if (key === 'Backspace') {
        this.spellBuffer = this.spellBuffer.slice(0, -1);
        return true;
      }
      if (key === 'Escape') {
        this.spellBuffer = '';
        return true;
      }
      if (key.length === 1) {
        this.spellBuffer += key.toLowerCase();
        // Checa se corresponde a um feitiço do arquétipo
        const matchedSpell = this.availableSpells.find(
          (s) => s.command.toLowerCase() === this.spellBuffer.toLowerCase()
        );
        if (matchedSpell) {
          this.castSpell(matchedSpell.id);
          this.spellBuffer = '';
          return true;
        }
      }
      return true;
    }

    // Se temos um alvo travado
    if (this.lockedEnemyId) {
      const target = this.enemies.find((e) => e.id === this.lockedEnemyId);
      if (target) {
        const expectedNextChar = target.word[target.wordTyped.length]?.toLowerCase();
        if (key.toLowerCase() === expectedNextChar) {
          this.stats.keysCorrect++;
          target.wordTyped += target.word[target.wordTyped.length];
          byteQuestAudio.playTypeHit();

          if (target.wordTyped.length >= target.word.length) {
            this.executeCriticalWordKill(target);
          }
          return true;
        } else {
          return false;
        }
      } else {
        this.lockedEnemyId = null;
      }
    }

    // Procura novo alvo que comece com a tecla digitada
    const candidate = this.enemies
      .filter((e) => e.word.length > 0 && e.word[0].toLowerCase() === key.toLowerCase())
      .sort((a, b) => Math.hypot(a.x - this.heroX, a.y - this.heroY) - Math.hypot(b.x - this.heroX, b.y - this.heroY))[0];

    if (candidate) {
      this.stats.keysCorrect++;
      this.lockedEnemyId = candidate.id;
      candidate.wordTyped = candidate.word[0];
      byteQuestAudio.playTypeHit();

      if (candidate.wordTyped.length >= candidate.word.length) {
        this.executeCriticalWordKill(candidate);
      }
      return true;
    }

    return false;
  }

  private executeCriticalWordKill(enemy: CombatEnemy) {
    this.stats.wordsTypedCount++;
    this.stats.criticalHits++;
    this.lockedEnemyId = null;

    // Dano crítico devastador ao digitar a palavra do Elite ou Chefe
    const critDmg = Math.round((240 + this.upgrades.damageBonus * 6) * this.upgrades.typingCritMultiplier);
    this.addScreenShake(6.5, 0.24);
    this.addShockwave(enemy.x, enemy.y, 110, '#FACC15', 4);
    this.spawnHitParticles(enemy.x, enemy.y, '#FACC15', 18, 260);

    this.damageEnemy(enemy, critDmg, true);
    byteQuestAudio.playCriticalWordKill();

    if (enemy.hp > 0 && (enemy.isBoss || enemy.isElite)) {
      enemy.word = getWordForDifficulty(enemy.isBoss ? 4 : 3);
      enemy.wordTyped = '';
    }
  }

  public damageEnemy(enemy: CombatEnemy, amount: number, isCrit: boolean = false) {
    enemy.hp -= amount;
    enemy.hitFlash = Date.now();
    enemy.hitFlashTimer = 0.12;
    this.stats.damageDealt += amount;

    // Partículas dinâmicas de impacto correspondentes à classe
    const sparkColor = isCrit
      ? '#FACC15'
      : this.rpgClass === 'mage'
      ? '#C084FC'
      : this.rpgClass === 'archer'
      ? '#34D399'
      : '#EF4444';

    this.spawnHitParticles(enemy.x, enemy.y, sparkColor, isCrit ? 9 : 5, isCrit ? 220 : 140);
    byteQuestAudio.playHitCrunch(isCrit);

    if (isCrit) {
      this.stats.criticalHits++;
      this.addScreenShake(3.5, 0.16);
      byteQuestAudio.playCritHit();
    }

    this.addFloatingText(enemy.x, enemy.y - 15, `${amount}${isCrit ? '!' : ''}`, isCrit ? '#FACC15' : '#FFFFFF', isCrit);

    if (enemy.hp <= 0) {
      this.killEnemy(enemy);
    }
  }

  private killEnemy(enemy: CombatEnemy) {
    const idx = this.enemies.indexOf(enemy);
    if (idx !== -1) {
      this.enemies.splice(idx, 1);
    }
    this.stats.enemiesDefeated++;
    byteQuestAudio.playEnemyDeath();

    // Efeito de explosão e shockwave na morte
    this.spawnHitParticles(
      enemy.x,
      enemy.y,
      enemy.isBoss ? '#F59E0B' : enemy.isElite ? '#C084FC' : '#38BDF8',
      enemy.isBoss ? 24 : 10,
      210
    );
    if (enemy.isElite || enemy.isBoss) {
      this.addScreenShake(enemy.isBoss ? 7.5 : 4.2, 0.22);
      this.addShockwave(
        enemy.x,
        enemy.y,
        enemy.isBoss ? 160 : 85,
        enemy.isBoss ? '#F59E0B' : '#C084FC',
        4
      );
    }

    // Geração de Energia ao Abater Inimigos
    const energyGained = enemy.isBoss ? 35 : enemy.isElite ? 22 : 6;
    this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + energyGained);

    if (this.lockedEnemyId === enemy.id) {
      this.lockedEnemyId = null;
    }

    const gemCount = enemy.isBoss ? 10 : enemy.isElite ? 4 : 1;
    for (let i = 0; i < gemCount; i++) {
      const offsetX = (Math.random() - 0.5) * 30;
      const offsetY = (Math.random() - 0.5) * 30;
      this.gems.push({
        id: `gem_${Date.now()}_${Math.random()}`,
        x: enemy.x + offsetX,
        y: enemy.y + offsetY,
        xpValue: enemy.xpValue / gemCount,
        color: enemy.isBoss ? '#F59E0B' : enemy.isElite ? '#C084FC' : '#38BDF8'
      });
    }

    if (this.upgrades.chainLightningLevel > 0) {
      this.triggerChainLightning(enemy.x, enemy.y, this.upgrades.chainLightningLevel);
    }
  }

  private triggerChainLightning(originX: number, originY: number, count: number) {
    const nearby = this.enemies
      .slice()
      .sort((a, b) => Math.hypot(a.x - originX, a.y - originY) - Math.hypot(b.x - originX, b.y - originY))
      .slice(0, count);

    nearby.forEach((target) => {
      this.damageEnemy(target, 24 + this.upgrades.damageBonus, true);
    });
  }

  /**
   * CONJURAÇÃO DE FEITIÇOS ESPECÍFICOS POR CLASSE COM CUSTO DE ENERGIA E COOLDOWN
   */
  public castSpell(spellId: string) {
    const spell = this.availableSpells.find((s) => s.id === spellId);
    if (!spell) return;

    if (this.stats.energy < spell.energyCost) {
      this.addFloatingText(this.heroX, this.heroY - 40, `SEM ENERGIA (${Math.round(this.stats.energy)}/${spell.energyCost})`, '#38BDF8');
      return;
    }

    if ((this.spellCooldowns[spellId] || 0) > 0) {
      this.addFloatingText(this.heroX, this.heroY - 40, 'EM RECARGA', '#94A3B8');
      return;
    }

    // Consome energia e aplica cooldown
    this.stats.energy -= spell.energyCost;
    this.spellCooldowns[spellId] = spell.cooldownSeconds;
    byteQuestAudio.playSpellCast(spellId);

    // Efeitos globais de conjuração de magia
    this.addScreenShake(spellId === 'mage_meteor' ? 8.5 : spellId === 'warrior_cyclone' ? 5.5 : 4.0, 0.26);
    this.addShockwave(this.heroX, this.heroY, spellId === 'mage_meteor' ? 220 : 130, spell.color || '#A855F7', 4);
    this.spawnHitParticles(this.heroX, this.heroY, spell.color || '#A855F7', 14, 220);

    // ─── PODERES DO GUERREIRO ───
    if (spellId === 'warrior_rage') {
      this.upgrades.rageBuffTimer = 7.0;
      this.addFloatingText(this.heroX, this.heroY - 45, 'FÚRIA ATIVA! +100% MELEE', '#EF4444', true);
    } else if (spellId === 'warrior_cyclone') {
      // Corte em 360° em volta do Bytezinho
      this.enemies.slice().forEach((e) => {
        if (Math.hypot(e.x - this.heroX, e.y - this.heroY) < 155) {
          this.damageEnemy(e, 85 + this.upgrades.damageBonus * 2, true);
          const ang = Math.atan2(e.y - this.heroY, e.x - this.heroX);
          e.x += Math.cos(ang) * 50;
          e.y += Math.sin(ang) * 50;
        }
      });
      this.addFloatingText(this.heroX, this.heroY - 45, 'GOLPE CICLONE 360°!', '#F97316', true);
    } else if (spellId === 'warrior_charge') {
      // Investida frontal com escudo na direção do herói
      const chargeDir = this.heroFacing === 'right' ? 1 : -1;
      this.heroX = Math.max(40, Math.min(800, this.heroX + chargeDir * 160));
      this.enemies.slice().forEach((e) => {
        if (Math.hypot(e.x - this.heroX, e.y - this.heroY) < 100) {
          this.damageEnemy(e, 65, true);
          e.x += chargeDir * 60;
        }
      });
      this.addFloatingText(this.heroX, this.heroY - 45, 'INVESTIDA ESMAGADORA!', '#EAB308', true);
    } else if (spellId === 'warrior_shield') {
      this.stats.shieldDuration = 6;
      this.stats.shieldHp = 110 + this.upgrades.maxHpBonus * 0.6;
      this.addFloatingText(this.heroX, this.heroY - 45, 'FORTITUDE DE AÇO!', '#38BDF8', true);
    }

    // ─── PODERES DO ARQUEIRO ───
    else if (spellId === 'archer_arrow_rain') {
      // Chuva de flechas em tela
      this.enemies.slice().forEach((e) => {
        this.damageEnemy(e, 70 + this.upgrades.damageBonus, true);
      });
      this.addFloatingText(this.heroX + 100, this.heroY - 80, 'CHUVA DE FLECHAS!', '#10B981', true);
    } else if (spellId === 'archer_pierce_volley') {
      // Salva de 5 flechas em leque orientado na direção de mira em 360°
      const baseAng = this.heroAttackAngle;
      for (let angOffset = -0.32; angOffset <= 0.32; angOffset += 0.16) {
        const finalAng = baseAng + angOffset;
        this.projectiles.push({
          id: `arrow_v_${Date.now()}_${angOffset}`,
          x: this.heroX + Math.cos(finalAng) * 20,
          y: this.heroY + Math.sin(finalAng) * 20,
          vx: Math.cos(finalAng) * 660,
          vy: Math.sin(finalAng) * 660,
          damage: 45 + this.upgrades.damageBonus,
          color: '#34D399',
          radius: 5.5,
          pierceCount: 4,
          isCrit: true
        });
      }
      this.addFloatingText(this.heroX, this.heroY - 45, 'RAJADA PERFURANTE!', '#34D399', true);
    } else if (spellId === 'archer_trap') {
      // Paralisação em área
      this.enemies.forEach((e) => {
        if (Math.hypot(e.x - this.heroX, e.y - this.heroY) < 250) {
          e.speed = 0;
          setTimeout(() => {
            e.speed = 65;
          }, 4000);
        }
      });
      this.addFloatingText(this.heroX, this.heroY - 45, 'ARMADILHA ATIVADA!', '#F59E0B', true);
    } else if (spellId === 'archer_evasion') {
      this.invulnerabilityTimer = 2.5;
      this.upgrades.speedBuffTimer = 4.0;
      this.addFloatingText(this.heroX, this.heroY - 45, 'PASSO FANTASMA!', '#6EE7B7', true);
    }

    // ─── PODERES DO MAGO ───
    else if (spellId === 'mage_meteor') {
      this.enemies.slice().forEach((e) => {
        this.damageEnemy(e, 140 + this.upgrades.damageBonus * 2, true);
      });
      this.addFloatingText(this.heroX + 100, this.heroY - 80, 'METEORO ARCANO!', '#F97316', true);
    } else if (spellId === 'mage_blizzard') {
      this.stats.freezeDuration = 4.5;
      this.enemies.forEach((e) => this.damageEnemy(e, 35, false));
      this.addFloatingText(this.heroX, this.heroY - 45, 'NEVASCA GÉLIDA!', '#A78BFA', true);
    } else if (spellId === 'mage_thunder') {
      this.triggerChainLightning(this.heroX, this.heroY, 7);
      this.addFloatingText(this.heroX, this.heroY - 45, 'TROVOADA EM CADEIA!', '#FACC15', true);
    } else if (spellId === 'mage_barrier') {
      this.stats.shieldDuration = 6;
      this.stats.shieldHp = 80;
      this.addFloatingText(this.heroX, this.heroY - 45, 'BARREIRA ELEMENTAL!', '#38BDF8', true);
    }
  }

  public handleHeroHit(rawDamage: number) {
    if (this.invulnerabilityTimer > 0) return;

    let dmg = rawDamage;
    // Guerreiro tem 20% de redução passiva de dano
    if (this.rpgClass === 'warrior') {
      dmg = Math.max(1, Math.round(dmg * 0.8));
    }

    if (this.stats.shieldHp > 0) {
      const absorbed = Math.min(this.stats.shieldHp, dmg);
      this.stats.shieldHp -= absorbed;
      dmg -= absorbed;
      this.addFloatingText(this.heroX, this.heroY - 25, `BLOCKED ${absorbed}`, '#38BDF8');
    }

    if (dmg > 0) {
      this.stats.hp = Math.max(0, this.stats.hp - dmg);
      this.stats.totalDamageTaken += dmg;
      this.invulnerabilityTimer = 0.55;
      byteQuestAudio.playHeroHurt();
      this.addFloatingText(this.heroX, this.heroY - 20, `-${dmg}`, '#EF4444', true);

      if (this.stats.hp <= 0) {
        this.onGameOver?.();
      }
    }
  }

  public addXp(amount: number) {
    this.stats.currentXp += amount;
    if (this.stats.currentXp >= this.stats.nextLevelXp) {
      this.stats.currentXp -= this.stats.nextLevelXp;
      this.stats.level++;
      this.stats.nextLevelXp = Math.round(14 + this.stats.level * 10);
      byteQuestAudio.playLevelUp();
      this.onLevelUp?.();
    }
  }

  public applyUpgrade(effect: UpgradeEffectType, value: number) {
    switch (effect) {
      case 'damage':
        this.upgrades.damageBonus += value;
        break;
      case 'speed':
        this.upgrades.speedBonus += value;
        break;
      case 'crit':
        this.upgrades.critRateBonus += value;
        break;
      case 'max_hp':
        this.stats.maxHp += value;
        this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + value);
        break;
      case 'shield':
        this.stats.shieldHp += value;
        this.stats.shieldDuration = 10;
        break;
      case 'orbitals':
        this.upgrades.orbitalCount += 1;
        break;
      case 'lightning':
        this.upgrades.chainLightningLevel += 1;
        break;
      case 'magnet':
        this.upgrades.magnetRadius += value;
        break;
      case 'typing_power':
        this.upgrades.typingCritMultiplier += 0.8;
        break;
    }
  }

  private addFloatingText(x: number, y: number, text: string, color: string, isCrit: boolean = false) {
    this.damageTexts.push({
      id: `text_${Date.now()}_${Math.random()}`,
      x,
      y,
      text,
      color,
      alpha: 1.0,
      vy: -35,
      isCrit
    });
  }
}
