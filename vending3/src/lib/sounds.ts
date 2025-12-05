// Vanilla JavaScript sound effects using Web Audio API
class SoundEffects {
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize on user interaction to comply with browser autoplay policies
    if (typeof window !== 'undefined') {
      document.addEventListener('click', () => this.init(), { once: true });
    }
  }

  private init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  coinInsert() {
    // Metallic clink sound
    this.playTone(800, 0.1, 'square');
    setTimeout(() => this.playTone(600, 0.1, 'square'), 50);
  }

  buttonClick() {
    // Click sound
    this.playTone(400, 0.05, 'square');
  }

  purchase() {
    // Success chime
    this.playTone(523.25, 0.15, 'sine'); // C
    setTimeout(() => this.playTone(659.25, 0.15, 'sine'), 100); // E
    setTimeout(() => this.playTone(783.99, 0.3, 'sine'), 200); // G
  }

  error() {
    // Error buzz
    this.playTone(200, 0.2, 'sawtooth');
  }

  refund() {
    // Coin return sound
    for (let i = 0; i < 3; i++) {
      setTimeout(() => this.playTone(700 - i * 100, 0.08, 'square'), i * 60);
    }
  }
}

export const soundEffects = new SoundEffects();
