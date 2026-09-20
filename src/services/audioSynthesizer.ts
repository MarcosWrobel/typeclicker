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
