// Clash of Clans Village Audio Engine (Official Home Music Part 3)

class VillageAudioManager {
  private musicAudio: HTMLAudioElement | null = null;
  private tapAudio: HTMLAudioElement | null = null;
  private goldAudio: HTMLAudioElement | null = null;
  private hornAudio: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;
  private sfxEnabled: boolean = true;
  private musicVolume: number = 0.3; // Balanced ambient background level
  private fadeInterval: number | null = null;
  private listeners: Set<(playing: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private initAudio() {
    try {
      // Official Supercell Clash of Clans Home Music Part 3
      this.musicAudio = new Audio('/audio/village_theme.mp3');
      this.musicAudio.loop = true;
      this.musicAudio.preload = 'auto';
      this.musicAudio.volume = this.musicVolume;

      // Event listener to ensure seamless gapless looping
      this.musicAudio.addEventListener('timeupdate', () => {
        if (!this.musicAudio) return;
        // Near end loop adjustment: when within 0.2s of ending, restart smoothly
        if (this.musicAudio.duration && this.musicAudio.currentTime > this.musicAudio.duration - 0.2) {
          this.musicAudio.currentTime = 0.1;
        }
      });

      // Sound Effects
      this.tapAudio = new Audio('/audio/tap.wav');
      this.tapAudio.volume = 0.4;

      this.goldAudio = new Audio('/audio/gold.wav');
      this.goldAudio.volume = 0.45;

      this.hornAudio = new Audio('/audio/horn.wav');
      this.hornAudio.volume = 0.5;
    } catch {
      // Audio not supported in this environment
    }
  }

  public subscribe(callback: (playing: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this.isMusicPlaying);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isMusicPlaying));
  }

  private fadeIn(targetVolume: number, durationMs = 500) {
    if (!this.musicAudio) return;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    this.musicAudio.volume = 0;
    const steps = 20;
    const stepTime = durationMs / steps;
    const stepDelta = targetVolume / steps;
    let current = 0;

    this.fadeInterval = window.setInterval(() => {
      current += stepDelta;
      if (this.musicAudio) {
        if (current >= targetVolume) {
          this.musicAudio.volume = targetVolume;
          if (this.fadeInterval) clearInterval(this.fadeInterval);
        } else {
          this.musicAudio.volume = current;
        }
      }
    }, stepTime);
  }

  private fadeOut(callback: () => void, durationMs = 400) {
    if (!this.musicAudio) {
      callback();
      return;
    }
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const startVol = this.musicAudio.volume;
    const steps = 16;
    const stepTime = durationMs / steps;
    const stepDelta = startVol / steps;
    let current = startVol;

    this.fadeInterval = window.setInterval(() => {
      current -= stepDelta;
      if (this.musicAudio) {
        if (current <= 0) {
          this.musicAudio.volume = 0;
          if (this.fadeInterval) clearInterval(this.fadeInterval);
          callback();
        } else {
          this.musicAudio.volume = current;
        }
      }
    }, stepTime);
  }

  public async toggleMusic(): Promise<boolean> {
    if (!this.musicAudio) {
      this.initAudio();
    }
    if (!this.musicAudio) return false;

    if (this.isMusicPlaying) {
      this.fadeOut(() => {
        if (this.musicAudio) {
          this.musicAudio.pause();
          this.isMusicPlaying = false;
          this.notify();
        }
      });
      this.isMusicPlaying = false;
    } else {
      try {
        // Skip any tiny leading silence for immediate downbeat
        if (this.musicAudio.currentTime === 0) {
          this.musicAudio.currentTime = 0.08;
        }
        await this.musicAudio.play();
        this.isMusicPlaying = true;
        this.fadeIn(this.musicVolume);
      } catch (err) {
        console.warn('Autoplay blocked. User gesture required:', err);
        this.isMusicPlaying = false;
      }
    }
    this.notify();
    return this.isMusicPlaying;
  }

  public async startMusic(): Promise<boolean> {
    if (!this.musicAudio) {
      this.initAudio();
    }
    if (!this.musicAudio || this.isMusicPlaying) return this.isMusicPlaying;

    try {
      if (this.musicAudio.currentTime === 0) {
        this.musicAudio.currentTime = 0.08;
      }
      await this.musicAudio.play();
      this.isMusicPlaying = true;
      this.fadeIn(this.musicVolume);
      this.notify();
      return true;
    } catch {
      return false;
    }
  }

  public stopMusic() {
    if (this.musicAudio && this.isMusicPlaying) {
      this.fadeOut(() => {
        if (this.musicAudio) {
          this.musicAudio.pause();
          this.isMusicPlaying = false;
          this.notify();
        }
      });
    }
  }

  public setVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicAudio) {
      this.musicAudio.volume = this.musicVolume;
    }
  }

  public getVolume(): number {
    return this.musicVolume;
  }

  public getIsPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public toggleSfx(): boolean {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  public getSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public playTap() {
    if (!this.sfxEnabled) return;
    if (!this.tapAudio) this.initAudio();
    if (this.tapAudio) {
      this.tapAudio.currentTime = 0;
      this.tapAudio.play().catch(() => {});
    }
  }

  public playGold() {
    if (!this.sfxEnabled) return;
    if (!this.goldAudio) this.initAudio();
    if (this.goldAudio) {
      this.goldAudio.currentTime = 0;
      this.goldAudio.play().catch(() => {});
    }
  }

  public playHorn() {
    if (!this.sfxEnabled) return;
    if (!this.hornAudio) this.initAudio();
    if (this.hornAudio) {
      this.hornAudio.currentTime = 0;
      this.hornAudio.play().catch(() => {});
    }
  }
}

export const villageAudio = new VillageAudioManager();
