import { KeySoundThemeId } from '../types/cosmetics';

/**
 * Sintetizador de Áudio Nativo via Web Audio API
 * 100% Offline, sem dependência de downloads de arquivos .mp3 ou .wav.
 * Sintetiza formas de onda puras (triangular, quadrada, dente de serra e senoidal) em tempo real.
 */
class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public async resumeContext(): Promise<void> {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Toca o som de digitação equipado pelo aluno.
   * Suporta variação de pitch sutil baseada no combo do aluno.
   */
  public playKeySound(soundTheme: KeySoundThemeId = 'mechanical', combo: number = 0, forcePlay: boolean = false): void {
    if (this.isMuted && !forcePlay) return;

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const pitchOffset = Math.min(combo * 10, 300);

      switch (soundTheme) {
        case 'mechanical': {
          // Tom percussivo rápido em onda triangular com decaimento exponencial
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          const baseFreq = 460 + pitchOffset;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.05);

          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }

        case 'retro_beep': {
          // Beep agudo 8-bit em onda quadrada (Chiptune clássico)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'square';
          // Notas clássicas de arcade com pitch levemente modulado
          const baseFreq = 640 + pitchOffset * 0.8;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.setValueAtTime(baseFreq * 1.25, now + 0.025);

          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }

        case 'typewriter': {
          // Estalo encorpado com onda dente de serra + clique percussivo
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          const baseFreq = 220 + (pitchOffset % 80);
          osc.frequency.setValueAtTime(baseFreq * 1.8, now);
          osc.frequency.linearRampToValueAtTime(baseFreq * 0.5, now + 0.07);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.085);
          break;
        }

        case 'soft_click': {
          // Clique suave e aveludado em onda senoidal de curta duração
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          const baseFreq = 380 + pitchOffset * 0.5;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.04);

          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.055);
          break;
        }

        case 'lightsaber_clash': {
          // Zumbido de sabre de luz laser (dente de serra descendente rápido com ressonância)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          const baseFreq = 750 + pitchOffset;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.07);

          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case 'pixel_block_jump': {
          // Salto e quebra de bloco estilo arcade 8-bit
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'square';
          const baseFreq = 300 + pitchOffset * 0.6;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.04);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }

        case 'ki_blast': {
          // Impacto e disparo de energia Ki cósmica
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          const baseFreq = 580 + pitchOffset;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.09);
          break;
        }

        // ==============================================================
        // NOVOS SONS QUÂNTICOS DE ENDGAME (SÍNTESE NATIVA WEB AUDIO API)
        // Attack ultrarrápido (< 5ms), Decay seco (< 60ms) para 150+ WPM
        // ==============================================================

        case 'void_pulse': {
          // Pulso dimensional senoidal com decaimento exponencial rápido (Attack 2ms, Decay 48ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const baseFreq = 720 + pitchOffset;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.048);

          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.052);
          break;
        }

        case 'rubber_gatling': {
          // Impacto elástico de borracha vulcanizada (Attack 2ms, Decay 42ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          const baseFreq = 340 + pitchOffset;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.015);
          osc.frequency.exponentialRampToValueAtTime(110, now + 0.042);

          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.048);
          break;
        }

        case 'gaster_blaster': {
          // Laser chiptune 8-bit com ruído de onda quadrada (Attack 1.5ms, Decay 44ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          const baseFreq = 960 + pitchOffset;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(130, now + 0.044);

          gain.gain.setValueAtTime(0.11, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.046);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.048);
          break;
        }

        case 'sandevistan_click': {
          // Estalo hi-tech metálico percussivo neural (Attack 1ms, Decay 38ms)
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          const baseFreq = 1600 + pitchOffset;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(260, now + 0.038);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(2400, now);
          filter.Q.setValueAtTime(3.5, now);

          gain.gain.setValueAtTime(0.13, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.042);
          break;
        }

        case 'water_slash': {
          // Lâmina fluida com harmônicos senoidais (Attack 2ms, Decay 48ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const baseFreq = 620 + pitchOffset;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, now + 0.048);

          gain.gain.setValueAtTime(0.13, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.052);
          break;
        }

        case 'thunder_spark': {
          // Arco elétrico com micro-arpejo de alta voltagem (Attack 1ms, Decay 36ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          const baseFreq = 1400 + pitchOffset;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(420, now + 0.036);

          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        case 'serious_strike': {
          // Transiente sub-grave seco e potente (Attack 2ms, Decay 50ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const baseFreq = 180 + Math.min(pitchOffset * 0.4, 80);
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(42, now + 0.05);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.052);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.054);
          break;
        }

        case 'soul_nail': {
          // Agulha metálica cristalina pura (Attack 1.5ms, Decay 48ms)
          const osc = ctx.createOscillator();
          const overtone = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          const baseFreq = 1080 + pitchOffset;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.048);

          overtone.type = 'triangle';
          overtone.frequency.setValueAtTime(baseFreq * 2.1, now);
          overtone.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.03);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc.connect(gain);
          overtone.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          overtone.start(now);
          osc.stop(now + 0.052);
          overtone.stop(now + 0.035);
          break;
        }

        case 'spin_dash': {
          // Arpejo supersônico ultra veloz ascendente (Attack 1.5ms, Decay 45ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          const baseFreq = 440 + pitchOffset;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.8, now + 0.045);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.048);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }

        case 'sonar_batarang': {
          // Chirp aerodinâmico afiado com eco tático (Attack 2ms, Decay 44ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const baseFreq = 880 + pitchOffset;
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.044);

          gain.gain.setValueAtTime(0.13, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.046);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.048);
          break;
        }

        default:
          break;
      }
    } catch {
      // Ignora restrições transitórias de AudioContext
    }
  }

  /**
   * Prévia de som para a Loja de Cosméticos (sempre toca mesmo se o jogo estiver silenciado).
   */
  public previewSound(soundTheme: KeySoundThemeId): void {
    this.playKeySound(soundTheme, 5, true);
  }

  /**
   * Fanfarra sutil de desbloqueio de item cosmético na loja.
   */
  public playUnlockJingle(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6 (triunfal)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.22);
      });
    } catch {
      // Ignora erro
    }
  }
}

export const audioSynthesizer = new AudioSynthesizer();
