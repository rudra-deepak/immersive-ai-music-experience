import { AudioAnalysisData } from '../types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private audioEl: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;
  
  // Synthetic synth engine for instant rich playback when custom audio is loading/mocked
  private synthInterval: number | null = null;
  private isSynthPlaying: boolean = false;
  private synthGain: GainNode | null = null;
  
  private dataArray: Uint8Array | null = null;
  private beatThreshold: number = 0.65;
  private isMuted: boolean = false;
  private currentVolume: number = 0.8;
  private playbackRate: number = 1.0;

  public initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = this.currentVolume;

      this.analyser.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    return this.ctx;
  }

  public loadAudioUrl(url: string, onEnded?: () => void): HTMLAudioElement {
    this.initContext();
    this.stopSynth();

    if (!this.audioEl) {
      this.audioEl = new Audio();
      this.audioEl.crossOrigin = 'anonymous';
    }

    this.audioEl.src = url;
    this.audioEl.volume = this.isMuted ? 0 : this.currentVolume;
    this.audioEl.playbackRate = this.playbackRate;

    if (onEnded) {
      this.audioEl.onended = onEnded;
    }

    if (this.ctx && this.analyser && !this.mediaSource) {
      try {
        this.mediaSource = this.ctx.createMediaElementSource(this.audioEl);
        this.mediaSource.connect(this.analyser);
      } catch (err) {
        console.warn('AudioSource connection notice:', err);
      }
    }

    return this.audioEl;
  }

  public playAudio(): Promise<void> | void {
    this.initContext();
    if (this.audioEl && this.audioEl.src && !this.audioEl.src.startsWith('data:synth')) {
      return this.audioEl.play().catch((err) => {
        console.warn('HTML5 Audio play deferred, starting synth fallback:', err);
        this.startSynth();
      });
    } else {
      this.startSynth();
    }
  }

  public pauseAudio() {
    if (this.audioEl) {
      this.audioEl.pause();
    }
    this.stopSynth();
  }

  public seek(seconds: number) {
    if (this.audioEl) {
      this.audioEl.currentTime = seconds;
    }
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.gainNode) {
      this.gainNode.gain.value = this.isMuted ? 0 : this.currentVolume;
    }
    if (this.audioEl) {
      this.audioEl.volume = this.isMuted ? 0 : this.currentVolume;
    }
    if (this.synthGain) {
      this.synthGain.gain.value = this.isMuted ? 0 : this.currentVolume * 0.3;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.setVolume(this.currentVolume);
    return this.isMuted;
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.audioEl) {
      this.audioEl.playbackRate = rate;
    }
  }

  public getAudioElement(): HTMLAudioElement | null {
    return this.audioEl;
  }

  public getAnalysis(): AudioAnalysisData {
    if (!this.analyser || !this.dataArray) {
      const fallbackArray: number[] = [];
      for (let i = 0; i < 128; i++) fallbackArray.push(0);
      return {
        bass: 0,
        mid: 0,
        treble: 0,
        amplitude: 0,
        kickDetected: false,
        frequencyData: fallbackArray
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.analyser.getByteFrequencyData(this.dataArray as any);

    const length = this.dataArray.length;
    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;
    let totalSum = 0;

    const bassEnd = Math.floor(length * 0.15);
    const midEnd = Math.floor(length * 0.6);

    const freqArray: number[] = [];

    for (let i = 0; i < length; i++) {
      const val = this.dataArray[i] / 255;
      freqArray.push(this.dataArray[i]);
      totalSum += val;
      if (i <= bassEnd) {
        bassSum += val;
      } else if (i <= midEnd) {
        midSum += val;
      } else {
        trebleSum += val;
      }
    }

    const bass = bassEnd > 0 ? bassSum / bassEnd : 0;
    const mid = (midEnd - bassEnd) > 0 ? midSum / (midEnd - bassEnd) : 0;
    const treble = (length - midEnd) > 0 ? trebleSum / (length - midEnd) : 0;
    const amplitude = length > 0 ? totalSum / length : 0;
    const kickDetected = bass > this.beatThreshold;

    return {
      bass,
      mid,
      treble,
      amplitude,
      kickDetected,
      frequencyData: freqArray
    };
  }

  public startSynth() {
    if (this.isSynthPlaying) return;
    this.initContext();
    if (!this.ctx || !this.analyser) return;

    this.isSynthPlaying = true;
    this.synthGain = this.ctx.createGain();
    this.synthGain.gain.value = this.isMuted ? 0 : this.currentVolume * 0.35;
    this.synthGain.connect(this.analyser);

    const chords = [
      [130.81, 164.81, 196.00],
      [110.00, 138.59, 164.81],
      [146.83, 174.61, 220.00],
      [174.61, 220.00, 261.63]
    ];

    let chordIdx = 0;

    const playPulse = () => {
      if (!this.isSynthPlaying || !this.ctx || !this.synthGain) return;

      const now = this.ctx.currentTime;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 3.5);

        oscGain.gain.setValueAtTime(0, now);
        oscGain.gain.linearRampToValueAtTime(0.15, now + 0.4);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.synthGain!);

        osc.start(now);
        osc.stop(now + 4);
      });

      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(65, now);
      bassOsc.frequency.exponentialRampToValueAtTime(32, now + 0.3);

      bassGain.gain.setValueAtTime(0.3, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      bassOsc.connect(bassGain);
      bassGain.connect(this.synthGain);

      bassOsc.start(now);
      bassOsc.stop(now + 0.6);
    };

    playPulse();
    this.synthInterval = window.setInterval(playPulse, 4000);
  }

  public stopSynth() {
    this.isSynthPlaying = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public destroy() {
    this.stopSynth();
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.src = '';
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
    }
  }
}

export const audioEngine = new AudioEngine();
