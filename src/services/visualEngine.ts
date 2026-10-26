import { AudioAnalysisData, VisualProfile, VisualMode } from '../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

export class VisualEngineCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animId: number | null = null;
  private width: number = 0;
  private height: number = 0;
  private currentProfile: VisualProfile;
  private isReducedMotion: boolean = false;

  constructor(canvas: HTMLCanvasElement, profile: VisualProfile, isReducedMotion: boolean = false) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context not available');
    this.ctx = context;
    this.currentProfile = profile;
    this.isReducedMotion = isReducedMotion;

    this.resize();
    this.initParticles();
  }

  public updateProfile(profile: VisualProfile, isReducedMotion?: boolean) {
    this.currentProfile = profile;
    if (isReducedMotion !== undefined) {
      this.isReducedMotion = isReducedMotion;
    }
    this.initParticles();
  }

  public resize() {
    this.width = this.canvas.clientWidth || window.innerWidth;
    this.height = this.canvas.clientHeight || window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  private initParticles() {
    this.particles = [];
    const count = this.isReducedMotion ? 15 : 60;
    const style = this.currentProfile.particleStyle;

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(style));
    }
  }

  private createParticle(style: string): Particle {
    const x = Math.random() * this.width;
    const y = Math.random() * this.height;
    let vx = (Math.random() - 0.5) * 0.5;
    let vy = (Math.random() - 0.5) * 0.5;
    let size = Math.random() * 3 + 1;
    const alpha = Math.random() * 0.6 + 0.2;

    if (style === 'rain') {
      vy = Math.random() * 4 + 2;
      vx = -0.5;
      size = Math.random() * 1.5 + 0.5;
    } else if (style === 'embers') {
      vy = -(Math.random() * 2 + 1);
      vx = (Math.random() - 0.5) * 1.5;
      size = Math.random() * 4 + 1.5;
    } else if (style === 'stars') {
      vx = 0;
      vy = 0;
      size = Math.random() * 2.5 + 0.5;
    } else if (style === 'geometric') {
      vx = (Math.random() - 0.5) * 2;
      vy = (Math.random() - 0.5) * 2;
      size = Math.random() * 6 + 2;
    }

    return {
      x,
      y,
      vx,
      vy,
      size,
      alpha,
      color: this.currentProfile.accentColor || '#e4e2dd',
      life: Math.random() * 200,
      maxLife: 200 + Math.random() * 100
    };
  }

  public render(audio: AudioAnalysisData, activeMode?: VisualMode) {
    const mode = activeMode || this.currentProfile.visualMode;
    const { bass, mid, treble, kickDetected, frequencyData } = audio;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Environmental Background Fill
    this.renderEnvironment(mode, bass);

    // 2. Audio Waveform Spectrum Grid
    this.renderSpectrumWave(frequencyData, mode, bass, treble);

    // 3. Dynamic Audio Particles & Light Rays
    this.renderParticles(bass, mid, kickDetected);

    // 4. Mode Specific Overlays (Film Grain, Cinema Letterbox, Vignette)
    if (mode === 'ARCHIVE') {
      this.renderArchiveTexture();
    } else if (mode === 'CINEMA') {
      this.renderCinematicVignette();
    } else if (mode === 'RAW') {
      this.renderRawMonochromeGrid(kickDetected);
    }
  }

  private renderEnvironment(mode: VisualMode, bass: number) {
    const primary = this.currentProfile.primaryColor || '#090a0f';
    const secondary = this.currentProfile.secondaryColor || '#18181b';
    const accent = this.currentProfile.accentColor || '#e4e2dd';

    const grad = this.ctx.createRadialGradient(
      this.width / 2,
      this.height / 2,
      20,
      this.width / 2,
      this.height / 2,
      Math.max(this.width, this.height) * (0.8 + bass * 0.2)
    );

    if (mode === 'VOID') {
      this.ctx.fillStyle = '#050507';
      this.ctx.fillRect(0, 0, this.width, this.height);
      return;
    }

    if (mode === 'DREAM') {
      grad.addColorStop(0, `${accent}25`);
      grad.addColorStop(0.5, `${secondary}33`);
      grad.addColorStop(1, primary);
    } else if (mode === 'RAW') {
      grad.addColorStop(0, '#1c1c1e');
      grad.addColorStop(1, '#08080a');
    } else {
      grad.addColorStop(0, `${secondary}44`);
      grad.addColorStop(0.6, `${primary}aa`);
      grad.addColorStop(1, '#050608');
    }

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Subtle center glow pulse
    if (bass > 0.3 && !this.isReducedMotion) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(this.width / 2, this.height / 2, 180 + bass * 120, 0, Math.PI * 2);
      this.ctx.fillStyle = `${accent}${Math.floor(bass * 25).toString(16).padStart(2, '0')}`;
      this.ctx.filter = 'blur(40px)';
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  private renderSpectrumWave(freqData: number[], mode: VisualMode, bass: number, treble: number) {
    if (!freqData || freqData.length === 0) return;

    const bars = Math.min(64, freqData.length);
    const accent = this.currentProfile.accentColor || '#e4e2dd';

    this.ctx.save();

    if (mode === 'TYPOGRAPHIC' || mode === 'PARTICLE') {
      // Circular spectrum wave
      const centerX = this.width / 2;
      const centerY = this.height / 2;
      const baseRadius = Math.min(this.width, this.height) * 0.22 + bass * 30 + treble * 10;

      this.ctx.beginPath();
      this.ctx.strokeStyle = `${accent}66`;
      this.ctx.lineWidth = 1.5;

      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2;
        const amplitude = (freqData[i] / 255) * 60;
        const r = baseRadius + amplitude;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.closePath();
      this.ctx.stroke();

    } else {
      // Editorial bottom mirror audio waveform
      const barWidth = (this.width * 0.7) / bars;
      const startX = (this.width - barWidth * bars) / 2;
      const bottomY = this.height - 40;

      for (let i = 0; i < bars; i++) {
        const height = (freqData[i] / 255) * 80 * (1 + bass * 0.5);
        const x = startX + i * barWidth;

        this.ctx.fillStyle = i % 2 === 0 ? `${accent}88` : `${this.currentProfile.secondaryColor}aa`;
        this.ctx.fillRect(x, bottomY - height, barWidth - 2, height);
      }
    }

    this.ctx.restore();
  }

  private renderParticles(bass: number, mid: number, kick: boolean) {
    const accent = this.currentProfile.accentColor || '#e4e2dd';

    this.particles.forEach((p) => {
      const speed = this.isReducedMotion ? 0.2 : 1 + bass * 2.5 + mid * 0.5;
      p.x += p.vx * speed;
      p.y += p.vy * speed;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      this.ctx.save();
      this.ctx.globalAlpha = Math.min(1, p.alpha * (1 + bass * 0.5));
      this.ctx.fillStyle = p.color;

      if (this.currentProfile.particleStyle === 'rain') {
        this.ctx.fillRect(p.x, p.y, p.size, p.size * 12);
      } else if (this.currentProfile.particleStyle === 'geometric') {
        this.ctx.strokeRect(p.x, p.y, p.size * (1 + bass), p.size * (1 + bass));
        this.ctx.strokeStyle = accent;
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * (kick ? 1.5 : 1), 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    });
  }

  private renderArchiveTexture() {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    const scanY = (Date.now() / 20) % this.height;
    this.ctx.fillRect(0, scanY, this.width, 2);
    this.ctx.restore();
  }

  private renderCinematicVignette() {
    this.ctx.save();
    const grad = this.ctx.createRadialGradient(
      this.width / 2,
      this.height / 2,
      this.width * 0.3,
      this.width / 2,
      this.height / 2,
      this.width * 0.75
    );
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.75)');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.restore();
  }

  private renderRawMonochromeGrid(kick: boolean) {
    if (!kick) return;
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    this.ctx.lineWidth = 1;
    const step = 80;
    for (let x = 0; x < this.width; x += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  public destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
    }
  }
}
