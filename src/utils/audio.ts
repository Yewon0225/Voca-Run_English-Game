// Web Audio API synthesizer for instant zero-dependency sound effects & adaptive BGM
class SoundController {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  // BGM Synthesizer engine state
  private isBgmPlaying: boolean = false;
  private isFeverBgm: boolean = false;
  private bgmIntervalId: NodeJS.Timeout | null = null;
  private bgmGain: GainNode | null = null;
  private bgmNextNoteTime: number = 0;
  private bgmStep: number = 0;
  private isDucked: boolean = false;

  constructor() {
    // Lazy AudioContext initialization on first user interaction
    const savedMute = localStorage.getItem('vocarun_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  private getContext(): AudioContext | null {
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

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('vocarun_muted', String(this.isMuted));
    this.updateBgmGain();
    return this.isMuted;
  }

  private updateBgmGain(): void {
    if (!this.bgmGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.isMuted || !this.isBgmPlaying) {
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.setValueAtTime(0, now);
    } else {
      const targetGain = this.isDucked ? 0.025 : (this.isFeverBgm ? 0.075 : 0.06);
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.linearRampToValueAtTime(targetGain, now + 0.1);
    }
  }

  public duckBgm(duck: boolean): void {
    this.isDucked = duck;
    this.updateBgmGain();
  }

  // Chime sound for correct answers (+10 pts or +20 pts in fever)
  public playCorrect(isFever = false): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = isFever
      ? [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98] // C5, E5, G5, C6, E6, G6 (Sparkling)
      : [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isFever ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.32);
    });
  }

  // Gentle buzz sound for incorrect answers
  public playWrong(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.setValueAtTime(185, now + 0.12); // F#3

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // Whoosh / Jump sound when moving character between lanes
  public playLaneSwitch(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.1);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Fanfare for quiz completion
  public playFanfare(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const arpeggio = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    arpeggio.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.18, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.45);
    });
  }

  // Exhilarating Fever Start fanfare!
  public playFeverStart(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fanfareNotes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];
    fanfareNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.38);
    });
  }

  // Gentle slide when fever streak breaks
  public playFeverEnd(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(293.66, now + 0.28); // D4

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // Button click tap
  public playClick(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // -------------------------------------------------------------
  // SYNTHESIZER BGM: Adaptive Running Music & Fast Fever Beat
  // -------------------------------------------------------------
  public startBgm(fever = false): void {
    this.isBgmPlaying = true;
    this.isFeverBgm = fever;

    const ctx = this.getContext();
    if (!ctx) return;

    if (!this.bgmGain) {
      this.bgmGain = ctx.createGain();
      this.bgmGain.connect(ctx.destination);
    }
    this.updateBgmGain();

    if (this.bgmIntervalId) {
      return; // already scheduling
    }

    this.bgmNextNoteTime = ctx.currentTime + 0.05;
    this.bgmStep = 0;

    // Schedule ahead timer (lookahead scheduler pattern)
    this.bgmIntervalId = setInterval(() => {
      this.scheduleBgmNotes();
    }, 35);
  }

  public setFeverMode(fever: boolean): void {
    if (this.isFeverBgm === fever) return;
    this.isFeverBgm = fever;
    this.updateBgmGain();
  }

  public stopBgm(): void {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    if (this.bgmGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.bgmGain.gain.cancelScheduledValues(now);
      this.bgmGain.gain.setValueAtTime(0, now);
    }
  }

  private scheduleBgmNotes(): void {
    if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

    const lookAheadTime = 0.12; // schedule up to 120ms ahead
    const stepDuration = this.isFeverBgm ? 0.096 : 0.125; // 156 BPM vs 120 BPM

    while (this.bgmNextNoteTime < this.ctx.currentTime + lookAheadTime) {
      this.playBgmStep(this.bgmNextNoteTime, this.bgmStep, this.isFeverBgm);
      this.bgmNextNoteTime += stepDuration;
      this.bgmStep = (this.bgmStep + 1) % 32;
    }
  }

  private playBgmStep(time: number, step: number, isFever: boolean): void {
    if (!this.ctx || !this.bgmGain || this.isMuted) return;

    // Normal chords (C - G - Am - F) over 32 steps (8 steps each chord)
    // Fever chords (C - Em - Am - F) faster and brighter
    const chordIndex = Math.floor(step / 8) % 4;
    const subStep = step % 8;

    if (!isFever) {
      // NORMAL BGM: 120 BPM, friendly walking / jogging rhythm
      // Bass on step 0, 4, 6
      const bassFreqs = [130.81, 98.0, 110.0, 87.31]; // C3, G2, A2, F2
      if (subStep === 0 || subStep === 4 || subStep === 6) {
        this.synthBass(time, bassFreqs[chordIndex], 0.18, 'triangle', 0.14);
      }

      // Melody arpeggios on even steps
      const arpNotes = [
        [261.63, 329.63, 392.0, 523.25], // C4, E4, G4, C5
        [196.0, 246.94, 293.66, 392.0],  // G3, B3, D4, G4
        [220.0, 261.63, 329.63, 440.0],  // A3, C4, E4, A4
        [174.61, 220.0, 261.63, 349.23]  // F3, A3, C4, F4
      ];
      if (subStep % 2 === 0) {
        const noteIdx = (subStep / 2) % 4;
        const noteFreq = arpNotes[chordIndex][noteIdx];
        this.synthPluck(time, noteFreq, 0.1, 'sine', 0.08);
      }

      // Soft percussive hat on steps 2, 6
      if (subStep === 2 || subStep === 6) {
        this.synthHat(time, 0.03);
      }
    } else {
      // FEVER BGM: 156 BPM, energetic, exciting, disco arcade groove!
      // Octave bouncing synth bass on every 8th step (0, 2, 4, 6)
      const feverBass = [
        [130.81, 261.63], // C3 - C4
        [164.81, 329.63], // E3 - E4
        [110.0, 220.0],   // A2 - A3
        [174.61, 349.23]  // F3 - F4
      ];
      if (subStep % 2 === 0) {
        const octaveIdx = (subStep / 2) % 2;
        this.synthBass(time, feverBass[chordIndex][octaveIdx], 0.12, 'sawtooth', 0.12);
      }

      // Fast, glittering 16th-note arpeggios
      const feverArp = [
        [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 783.99, 1046.5], // C5 - C6
        [659.25, 783.99, 987.77, 1318.51, 987.77, 783.99, 987.77, 1318.51], // E5 - E6
        [440.0, 523.25, 659.25, 880.0, 659.25, 523.25, 659.25, 880.0], // A4 - A5
        [349.23, 440.0, 523.25, 698.46, 523.25, 440.0, 523.25, 698.46] // F4 - F5
      ];
      const feverNote = feverArp[chordIndex][subStep];
      this.synthPluck(time, feverNote, 0.08, 'triangle', 0.11);

      // Driving hi-hat ticks on every 16th step, accented on offbeats
      this.synthHat(time, subStep % 2 === 1 ? 0.05 : 0.025);

      // Snappy snare tap on steps 2 and 6
      if (subStep === 2 || subStep === 6) {
        this.synthSnare(time, 0.06);
      }
    }
  }

  private synthBass(time: number, freq: number, duration: number, type: OscillatorType, gainVal: number): void {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  private synthPluck(time: number, freq: number, duration: number, type: OscillatorType, gainVal: number): void {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(gainVal, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration + 0.02);
  }

  private synthHat(time: number, gainVal: number): void {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(3200, time);
    osc.frequency.exponentialRampToValueAtTime(7000, time + 0.03);

    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + 0.035);
  }

  private synthSnare(time: number, gainVal: number): void {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, time);
    osc.frequency.exponentialRampToValueAtTime(90, time + 0.07);

    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + 0.075);
  }
}

export const soundManager = new SoundController();

// Native browser TTS pronunciation for English words and sentences with end callback
export function speakEnglish(text: string, onEnd?: () => void): void {
  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    soundManager.duckBgm(true);

    const cleanText = text.replace(/_+/g, 'blank');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 0.88; // Slightly clear & deliberate for middle schoolers
    utterance.pitch = 1.05;

    let hasEnded = false;
    const handleEnd = () => {
      if (!hasEnded) {
        hasEnded = true;
        soundManager.duckBgm(false);
        if (onEnd) onEnd();
      }
    };

    utterance.onend = handleEnd;
    utterance.onerror = () => {
      handleEnd();
    };

    // Safety timeout in case browser TTS event doesn't fire or is delayed
    const wordCount = cleanText.trim().split(/\s+/).length;
    const safetyTimeoutMs = Math.max(1400, wordCount * 650 + 600);
    setTimeout(() => {
      handleEnd();
    }, safetyTimeoutMs);

    // Pick an English voice if available
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('US')));
    if (enVoice) {
      utterance.voice = enVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('TTS error:', e);
    soundManager.duckBgm(false);
    if (onEnd) onEnd();
  }
}
