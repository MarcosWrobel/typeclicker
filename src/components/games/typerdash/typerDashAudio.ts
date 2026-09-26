/**
 * TyperDash Dynamic Audio Engine
 * Trilha sonora eletrônica e SFX 100% procedurais via Web Audio API nativo.
 * Zero assets externos (.mp3/.wav).
 */

export type TyperDashMusicStage = 'intro' | 'bass' | 'buildup' | 'drop' | 'climax';

class TyperDashAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7;
  private sequencerTimer: number | null = null;
  private nextStepTime: number = 0;
  private currentStep: number = 0; // 0 a 15 (16th notes por compasso)
  private currentBpm: number = 130;
  private isRunning: boolean = false;
  private stage: TyperDashMusicStage = 'intro';
  private isMage: boolean = false;
  private isSnareRolling: boolean = false;

  // Escala Pentatônica Maior em Dó para os combos (C4 a C6)
  private readonly pentatonicScale = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
    1046.50 // C6
  ];

  // Linhas de Baixo Eletrônicas em Frequências Sub (C2, D#2, F2, G#1)
  private readonly basslineNotes = [
    65.41, 65.41, 65.41, 77.78, // C2
    51.91, 51.91, 51.91, 58.27, // G#1
    87.31, 87.31, 87.31, 77.78, // F2
    58.27, 58.27, 65.41, 73.42  // A#1
  ];

  // Arpejos Eletrônicos Sintetizados (C4, D#4, G4, A#4)
  private readonly arpNotes = [
    261.63, 311.13, 392.00, 466.16,
    523.25, 466.16, 392.00, 311.13,
    261.63, 311.13, 392.00, 523.25,
    622.25, 523.25, 466.16, 392.00
  ];

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx || this.ctx.state === 'closed') {
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

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setStage(stage: TyperDashMusicStage): void {
    this.stage = stage;
  }

  public setBpm(bpm: number): void {
    this.currentBpm = Math.max(90, Math.min(240, bpm));
  }

  public triggerSnareRoll(durationMs: number = 1800): void {
    this.isSnareRolling = true;
    setTimeout(() => {
      this.isSnareRolling = false;
    }, durationMs);
  }

  public startMetronome(isMage: boolean = false): void {
    this.startMusic(isMage, this.stage);
  }

  public stopMetronome(): void {
    this.stopMusic();
  }

  // ─────────────────────────────────────────────────────────────
  // 1. Sequenciador Eletrônico Dinâmico em 16 Steps
  // ─────────────────────────────────────────────────────────────

  public startMusic(isMage: boolean = false, initialStage: TyperDashMusicStage = 'intro'): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopMusic();
    this.isRunning = true;
    this.isMage = isMage;
    this.stage = initialStage;
    this.currentStep = 0;
    this.currentBpm = 130;
    this.nextStepTime = ctx.currentTime + 0.05;

    const schedule = () => {
      if (!this.isRunning || !this.ctx || this.ctx.state === 'closed') return;

      const secondsPerStep = (60.0 / this.currentBpm) / 4; // 16th note (~0.115s a 130 BPM)

      while (this.nextStepTime < this.ctx.currentTime + 0.12) {
        this.playSequencerStep(this.nextStepTime, this.currentStep);
        this.nextStepTime += secondsPerStep;
        this.currentStep = (this.currentStep + 1) % 16;
      }

      this.sequencerTimer = window.setTimeout(schedule, 25);
    };

    schedule();
  }

  public stopMusic(): void {
    this.stopGrindLoop();
    this.isRunning = false;
    if (this.sequencerTimer !== null) {
      window.clearTimeout(this.sequencerTimer);
      this.sequencerTimer = null;
    }
  }

  private playSequencerStep(time: number, step: number): void {
    if (this.isMuted || !this.ctx) return;

    const isBeat = step % 4 === 0; // Tempos 1, 2, 3, 4
    const isOffbeat = step % 2 === 0;

    // ── CAMADA 1: BATERIA ELETRÔNICA ──
    // Kick no tempo forte (1 e 3) ou four-on-the-floor nos drops
    if (this.stage === 'drop' || this.stage === 'climax') {
      if (isBeat) this.playKick(time);
    } else {
      if (step === 0 || step === 8) this.playKick(time);
    }

    // Snare nos tempos 2 e 4 (steps 4 e 12)
    if (step === 4 || step === 12) {
      this.playSnare(time);
    }

    // Snare roll acelerado antes dos Drops
    if (this.isSnareRolling && isOffbeat) {
      this.playSnare(time, 0.45);
    }

    // Hi-hats contínuos
    if (this.stage !== 'intro' || step % 2 === 0) {
      this.playHiHat(time, step % 4 === 2);
    }

    // ── CAMADA 2: BASSLINE ELETRÔNICA PULSANTE ──
    if (this.stage === 'bass' || this.stage === 'drop' || this.stage === 'climax') {
      const bassFreq = this.basslineNotes[step];
      const isDucking = isBeat; // Sidechain no kick
      this.playBass(time, bassFreq, isDucking);
    }

    // ── CAMADA 3: ARPEJADOR SINTETIZADO LEAD ──
    if (this.stage === 'drop' || this.stage === 'climax') {
      if (step % 2 === 0) {
        const arpFreq = this.arpNotes[step];
        this.playArp(time, arpFreq);
      }
    }
  }

  // ── SÍNTESE DO KICK ELETRÔNICO (SUB BASS PUNCH) ──
  private playKick(time: number): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(this.isMage ? 180 : 150, time);
      osc.frequency.exponentialRampToValueAtTime(36, time + 0.09);

      const kickVol = (this.isMage ? 0.38 : 0.30) * this.volume;
      gain.gain.setValueAtTime(kickVol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.11);
    } catch {}
  }

  // ── SÍNTESE DA CAIXA / SNARE (PUNCH + NOISE) ──
  private playSnare(time: number, customGain?: number): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, time);
      osc.frequency.exponentialRampToValueAtTime(110, time + 0.08);

      const baseVol = (customGain ?? 0.22) * this.volume;
      oscGain.gain.setValueAtTime(baseVol * 0.7, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.08);

      // Camada de Ruído Branco Filtrado
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000, time);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(baseVol, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(time);
      noise.stop(time + 0.11);
    } catch {}
  }

  // ── SÍNTESE DO HI-HAT (CRISP METALLIC) ──
  private playHiHat(time: number, isOpen: boolean): void {
    if (!this.ctx) return;
    try {
      const dur = isOpen ? 0.08 : 0.035;
      const bufferSize = Math.floor(this.ctx.sampleRate * dur);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7500, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.volume * (isOpen ? 0.14 : 0.08), time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(time);
      noise.stop(time + dur);
    } catch {}
  }

  // ── SÍNTESE DA LINHA DE BAIXO (PUMPING SAWTOOTH + FILTER) ──
  private playBass(time: number, freq: number, isDucking: boolean): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isDucking ? 300 : 700, time);
      filter.frequency.exponentialRampToValueAtTime(180, time + 0.1);

      const targetGain = (isDucking ? 0.08 : 0.22) * this.volume;
      gain.gain.setValueAtTime(targetGain, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.12);
    } catch {}
  }

  // ── SÍNTESE DO ARPEJADOR LEAD (NEON PLUCK) ──
  private playArp(time: number, freq: number): void {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(this.volume * 0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.1);
    } catch {}
  }

  // ─────────────────────────────────────────────────────────────
  // 2. Efeitos Sonoros de Portais & Jump Orbs
  // ─────────────────────────────────────────────────────────────

  public playPortalSound(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.28);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.28);

      gain.gain.setValueAtTime(this.volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch {}
  }

  public playOrbSound(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.18); // B5

      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(1318.5, now);

      gain.gain.setValueAtTime(this.volume * 0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      overtone.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      overtone.start(now);
      osc.stop(now + 0.22);
      overtone.stop(now + 0.22);
    } catch {}
  }

  // ─────────────────────────────────────────────────────────────
  // 3. Acertos, Saltos e Impactos
  // ─────────────────────────────────────────────────────────────

  public playHitSound(isPerfect: boolean, combo: number): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const noteIndex = combo % this.pentatonicScale.length;
      const freq = this.pentatonicScale[noteIndex];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isPerfect ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const baseVolume = isPerfect ? this.volume * 0.45 : this.volume * 0.35;
      gain.gain.setValueAtTime(baseVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isPerfect ? 0.35 : 0.22));

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + (isPerfect ? 0.35 : 0.22));

      if (isPerfect) {
        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();

        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(freq * 2, now);

        overtoneGain.gain.setValueAtTime(this.volume * 0.25, now);
        overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        overtone.connect(overtoneGain);
        overtoneGain.connect(ctx.destination);
        overtone.start(now);
        overtone.stop(now + 0.28);
      }
    } catch {}
  }

  public playJumpSound(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

      gain.gain.setValueAtTime(this.volume * 0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  public playShieldBreakSound(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(this.volume * 0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  public playCrashSound(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

      oscGain.gain.setValueAtTime(this.volume * 0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);

      const bufferSize = Math.floor(ctx.sampleRate * 0.25);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.25);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(this.volume * 0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.25);
    } catch {}
  }

  // ─────────────────────────────────────────────────────────────
  // 5. Efeitos Sonoros Denshattack! (Grind, Trick Combo, Dismount)
  // ─────────────────────────────────────────────────────────────
  private grindGainNode: GainNode | null = null;
  private grindOscNode: OscillatorNode | null = null;
  private grindNoiseNode: AudioBufferSourceNode | null = null;
  private isGrindingSoundActive: boolean = false;

  public startGrindLoop(): void {
    if (this.isMuted || this.isGrindingSoundActive) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      this.isGrindingSoundActive = true;
      const now = ctx.currentTime;

      // 1. Zumbido elétrico de fricção
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);

      // 2. Ruído de faíscas metálicas
      const bufferSize = Math.floor(ctx.sampleRate * 0.5);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.Q.setValueAtTime(3.5, now);

      const masterGrindGain = ctx.createGain();
      masterGrindGain.gain.setValueAtTime(0.001, now);
      masterGrindGain.gain.exponentialRampToValueAtTime(this.volume * 0.28, now + 0.05);

      osc.connect(masterGrindGain);
      noise.connect(filter);
      filter.connect(masterGrindGain);
      masterGrindGain.connect(ctx.destination);

      osc.start(now);
      noise.start(now);

      this.grindOscNode = osc;
      this.grindNoiseNode = noise;
      this.grindGainNode = masterGrindGain;
    } catch {}
  }

  public stopGrindLoop(): void {
    if (!this.isGrindingSoundActive) return;
    this.isGrindingSoundActive = false;
    const ctx = this.ctx;
    if (!ctx || !this.grindGainNode) return;

    try {
      const now = ctx.currentTime;
      this.grindGainNode.gain.cancelScheduledValues(now);
      this.grindGainNode.gain.setValueAtTime(this.grindGainNode.gain.value, now);
      this.grindGainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      const osc = this.grindOscNode;
      const noise = this.grindNoiseNode;
      setTimeout(() => {
        try {
          osc?.stop();
          osc?.disconnect();
          noise?.stop();
          noise?.disconnect();
        } catch {}
      }, 70);
    } catch {}
    this.grindGainNode = null;
    this.grindOscNode = null;
    this.grindNoiseNode = null;
  }

  public playTrickStep(stepIndex: number): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Notas ascendentes estilo arcade arpeggio
      const trickPitches = [392.00, 523.25, 659.25, 783.99, 1046.50];
      const pitch = trickPitches[stepIndex % trickPitches.length];

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.08, now + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  public playPerfectDismount(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Sub-boom punch
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(180, now);
      sub.frequency.exponentialRampToValueAtTime(40, now + 0.28);
      subGain.gain.setValueAtTime(this.volume * 0.6, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.28);

      // 2. Fanfarra de brilho (synth fanfare chord)
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const chordOsc = ctx.createOscillator();
        const chordGain = ctx.createGain();
        chordOsc.type = 'triangle';
        chordOsc.frequency.setValueAtTime(freq, now + idx * 0.03);

        chordGain.gain.setValueAtTime(this.volume * 0.22, now + idx * 0.03);
        chordGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        chordOsc.connect(chordGain);
        chordGain.connect(ctx.destination);
        chordOsc.start(now + idx * 0.03);
        chordOsc.stop(now + 0.35);
      });
    } catch {}
  }

  public dispose(): void {
    this.stopMusic();
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {}
      this.ctx = null;
    }
  }
}

export const typerDashAudio = new TyperDashAudioEngine();
