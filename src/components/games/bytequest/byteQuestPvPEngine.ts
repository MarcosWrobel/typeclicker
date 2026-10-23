// ─────────────────────────────────────────────────────────────
// Motor Especializado — ByteQuest 1v1 Battle Royale (PvP)
// Lógica de Ring de Tempestade Digital, Farm Competitivo,
// Balanceamento de Dano Anti-Burst e Duelo com Palavra de Hack
// ─────────────────────────────────────────────────────────────

import { ByteQuestSimulation } from './byteQuestEngine';
import { RpgClassType } from '../../../types/rpgClass';
import { ByteQuestPvPPhase, PvPPlayerSyncPayload } from '../../../types/byteQuestPvP';
import { getWordForDifficulty } from '../../../data/byteQuestWords';
import { byteQuestAudio } from './byteQuestAudio';

export class ByteQuestPvPSimulation extends ByteQuestSimulation {
  // ─── FASE E CRONÔMETRO BATTLE ROYALE ───
  public pvpPhase: ByteQuestPvPPhase = 'farm';
  public matchTimer: number = 0;
  public readonly farmDuration: number = 120.0; // 120s (2 minutos)
  public stormAnnounced: boolean = false;
  public pvpTransitionTriggered: boolean = false;

  // ─── ANEL DE TEMPESTADE DIGITAL (STORM RING) ───
  public stormCenterX: number = 2500;
  public stormCenterY: number = 1800;
  public stormRadius: number = 1600;
  public readonly initialStormRadius: number = 1600;
  public readonly minStormRadius: number = 380;
  public isOutsideStorm: boolean = false;
  public stormDamageTimer: number = 0;

  // ─── OPONENTE REMOTO EM TEMPO REAL ───
  public remoteOpponent: PvPPlayerSyncPayload | null = null;
  public opponentWord: string = '';
  public opponentWordTyped: string = '';
  public isTargetingOpponent: boolean = false;

  // ─── PROTEÇÃO ANTI-BURST & ESCUDO DE DUELO ───
  public pvpIFrameTimer: number = 0;
  public pvpDuelShieldGranted: boolean = false;

  // ─── CONFIGURAÇÃO DE JOGADOR E REDE ───
  public localUid: string = '';
  public isHost: boolean = false;
  public onBroadcastSend?: (event: string, payload: any) => void;
  public onPvPVictory?: (winnerUid: string) => void;
  public onPvPDefeat?: () => void;

  constructor(
    sharedClass: RpgClassType,
    localUid: string,
    isHost: boolean
  ) {
    // 100% Neutro: sem itens, sem talentos externos, sem chips de IA
    super(sharedClass, {}, {
      talents: {},
      activeAiChips: [],
      corruptionTier: 0,
      startingBiome: 'crypt'
    });

    this.localUid = localUid;
    this.isHost = isHost;

    // Posições iniciais opostas na arena central
    if (isHost) {
      this.heroX = 2200;
      this.heroY = 1800;
    } else {
      this.heroX = 2800;
      this.heroY = 1800;
    }

    // Palavra inicial que o oponente precisa digitar para hackear
    this.opponentWord = getWordForDifficulty(2);
    this.opponentWordTyped = '';
  }

  /**
   * Atualização contínua do ciclo de Battle Royale e Duelo PvP
   */
  public updatePvP(dt: number, viewportWidth: number, viewportHeight: number) {
    if (this.stats.hp <= 0) return;

    // Atualiza a simulação física padrão do ByteQuest
    super.update(dt, viewportWidth, viewportHeight);

    this.matchTimer += dt;

    if (this.pvpIFrameTimer > 0) {
      this.pvpIFrameTimer = Math.max(0, this.pvpIFrameTimer - dt);
    }

    // ─── 1. ENCOLHIMENTO DO ANEL DE TEMPESTADE DIGITAL ───
    // O círculo começa a encolher aos 25s até os 120s de partida
    if (this.matchTimer >= 25.0 && this.matchTimer <= this.farmDuration) {
      const shrinkProgress = (this.matchTimer - 25.0) / (this.farmDuration - 25.0);
      this.stormRadius = this.initialStormRadius - shrinkProgress * (this.initialStormRadius - this.minStormRadius);
    } else if (this.matchTimer > this.farmDuration) {
      this.stormRadius = this.minStormRadius;
    }

    // Verificação de permanência fora da área segura
    const distFromCenter = Math.hypot(this.heroX - this.stormCenterX, this.heroY - this.stormCenterY);
    this.isOutsideStorm = distFromCenter > this.stormRadius;

    if (this.isOutsideStorm) {
      this.stormDamageTimer += dt;
      if (this.stormDamageTimer >= 1.0) {
        this.stormDamageTimer = 0;
        // Dano de radiação da tempestade: 8% do HP máximo
        const stormDmg = Math.max(5, Math.round(this.stats.maxHp * 0.08));
        this.stats.hp -= stormDmg;
        this.addScreenShake(3.5, 0.15);
        this.spawnHitParticles(this.heroX, this.heroY, '#A855F7', 6, 120);
        this.addFloatingText(this.heroX, this.heroY - 45, `⚠️ TEMPESTADE DIGITAL! (-${stormDmg})`, '#C084FC', true);
        byteQuestAudio.playHeroHurt();

        if (this.stats.hp <= 0) {
          this.stats.hp = 0;
          this.onPvPDefeat?.();
        }
      }
    } else {
      this.stormDamageTimer = 0;
    }

    // ─── 2. TRANSIÇÃO PARA A FASE PVP (LOCKDOWN CENTRAL AOS 120s) ───
    if (this.matchTimer >= this.farmDuration && !this.pvpTransitionTriggered) {
      this.pvpTransitionTriggered = true;
      this.pvpPhase = 'pvp';

      // Concede o Escudo Rúnico de Gladiador (+300 Escudo) para absorver o impacto inicial
      this.stats.shieldHp = Math.min(600, this.stats.shieldHp + 300);
      this.invulnerabilityTimer = 2.0; // 2s de trégua para posicionamento

      // Efeito visual e sonoro espetacular de transição
      this.addScreenShake(10.0, 0.5);
      this.addShockwave(this.stormCenterX, this.stormCenterY, this.minStormRadius, '#EF4444', 8);
      this.addFloatingText(this.heroX, this.heroY - 60, '⚔️ LOCKDOWN ATIVO! PROTOCOLO PVP LIBERADO!', '#EF4444', true);
      byteQuestAudio.playOverclock();

      // Dissipa os monstros comuns da arena
      this.enemies = [];
    }

    // ─── 3. COLISÃO DE ATAQUES CONTRA O OPONENTE NA FASE PVP ───
    if (this.pvpPhase === 'pvp' && this.remoteOpponent && this.remoteOpponent.hp > 0) {
      this.checkLocalAttacksAgainstOpponent();
    }
  }

  /**
   * Fórmula de compressão logarítmica de dano em PvP (Garante lutas de 20 a 50s, sem One-Shot)
   */
  public calculatePvPDamage(rawDamage: number, isCrit: boolean): number {
    const compressed = Math.round(8 + (rawDamage / 9) + (this.upgrades.damageBonus * 0.18));
    const finalDmg = isCrit ? Math.round(compressed * 1.35) : compressed;
    return Math.max(5, Math.min(85, finalDmg));
  }

  /**
   * Testa colisão de projéteis e golpes físicos locais contra as coordenadas do oponente
   */
  private checkLocalAttacksAgainstOpponent() {
    if (!this.remoteOpponent) return;
    const oppX = this.remoteOpponent.x;
    const oppY = this.remoteOpponent.y;
    const hitRadius = 32;

    // A. Projéteis em voo
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const dist = Math.hypot(p.x - oppX, p.y - oppY);
      if (dist <= p.radius + hitRadius) {
        const pvpDmg = this.calculatePvPDamage(p.damage, p.isCrit);
        this.projectiles.splice(i, 1);
        this.spawnHitParticles(oppX, oppY, '#EF4444', 8, 160);
        this.addShockwave(oppX, oppY, 45, '#EF4444', 2);
        this.addFloatingText(oppX, oppY - 40, `💥 -${pvpDmg}`, '#EF4444', p.isCrit);
        byteQuestAudio.playHitCrunch(p.isCrit);

        // Notifica o oponente via Broadcast
        this.onBroadcastSend?.('pvp_hit', {
          attackerUid: this.localUid,
          targetUid: this.remoteOpponent.uid,
          damage: pvpDmg,
          isCrit: p.isCrit
        });
      }
    }

    // B. Lâmina Melee Direcional do Guerreiro
    if (this.rpgClass === 'warrior' && this.meleeSlashTimer > 0.28) {
      const dist = Math.hypot(this.heroX - oppX, this.heroY - oppY);
      if (dist <= 110) {
        const rawDmg = 28 + Math.round(this.upgrades.damageBonus * 0.7);
        const pvpDmg = this.calculatePvPDamage(rawDmg, false);
        this.spawnHitParticles(oppX, oppY, '#F59E0B', 6, 150);
        this.addFloatingText(oppX, oppY - 40, `⚔️ -${pvpDmg}`, '#F59E0B');

        this.onBroadcastSend?.('pvp_hit', {
          attackerUid: this.localUid,
          targetUid: this.remoteOpponent.uid,
          damage: pvpDmg,
          isCrit: false
        });
      }
    }
  }

  /**
   * Resolução da entrada de digitação para hackear a palavra do oponente
   */
  public handlePvPTypingKey(key: string): boolean {
    if (this.pvpPhase !== 'pvp' || !this.remoteOpponent || this.remoteOpponent.hp <= 0) {
      return false;
    }

    const nextCharIndex = this.opponentWordTyped.length;
    if (nextCharIndex < this.opponentWord.length) {
      const expectedChar = this.opponentWord[nextCharIndex].toLowerCase();
      if (key.toLowerCase() === expectedChar) {
        this.opponentWordTyped += this.opponentWord[nextCharIndex];
        byteQuestAudio.playTypeHit();

        // Se completou a palavra do oponente: Quebra de Escudo + Atordoamento
        if (this.opponentWordTyped.length >= this.opponentWord.length) {
          const hackDmg = Math.round(55 + this.upgrades.damageBonus * 0.4);
          this.addScreenShake(8.0, 0.3);
          this.addShockwave(this.remoteOpponent.x, this.remoteOpponent.y, 140, '#38BDF8', 5);
          this.spawnHitParticles(this.remoteOpponent.x, this.remoteOpponent.y, '#38BDF8', 20, 220);
          this.addFloatingText(this.remoteOpponent.x, this.remoteOpponent.y - 50, `⚡ HACKEADO! ATORDOADO! (-${hackDmg})`, '#38BDF8', true);
          byteQuestAudio.playCriticalWordKill();

          this.onBroadcastSend?.('pvp_hit', {
            attackerUid: this.localUid,
            targetUid: this.remoteOpponent.uid,
            damage: hackDmg,
            isCrit: true,
            isWordBreak: true
          });

          // Nova palavra sorteada para o oponente
          this.opponentWord = getWordForDifficulty(3);
          this.opponentWordTyped = '';
        }
        return true;
      }
    }
    return false;
  }

  /**
   * Aplica dano recebido vindo do oponente remoto
   */
  public receivePvPHit(damage: number, isCrit: boolean, isWordBreak: boolean = false) {
    if (this.pvpIFrameTimer > 0 || this.stats.hp <= 0) return;

    this.pvpIFrameTimer = 0.32; // 320ms de I-Frame para evitar rajadas instantâneas
    this.addScreenShake(isCrit ? 6.5 : 3.5, 0.2);
    byteQuestAudio.playHeroHurt();

    let remainingDmg = damage;
    if (this.stats.shieldHp > 0) {
      if (isWordBreak) {
        // Quebra de palavra destrói imediatamente 40% do escudo
        const shieldLoss = Math.round(this.stats.shieldHp * 0.4);
        this.stats.shieldHp = Math.max(0, this.stats.shieldHp - shieldLoss);
      }
      if (this.stats.shieldHp >= remainingDmg) {
        this.stats.shieldHp -= remainingDmg;
        remainingDmg = 0;
      } else {
        remainingDmg -= this.stats.shieldHp;
        this.stats.shieldHp = 0;
      }
    }

    if (remainingDmg > 0) {
      this.stats.hp = Math.max(0, this.stats.hp - remainingDmg);
    }

    this.spawnHitParticles(this.heroX, this.heroY, isCrit ? '#EF4444' : '#F59E0B', isCrit ? 10 : 5, 150);
    this.addFloatingText(this.heroX, this.heroY - 45, `-${damage} HP`, '#EF4444', isCrit);

    if (this.stats.hp <= 0) {
      this.stats.hp = 0;
      this.onPvPDefeat?.();
    }
  }

  /**
   * Atualiza os dados sincronizados do adversário remoto
   */
  public handleRemoteSync(payload: PvPPlayerSyncPayload) {
    this.remoteOpponent = payload;
  }
}
