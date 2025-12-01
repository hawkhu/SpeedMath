
/**
 * Simple audio synthesizer for game sound effects using Web Audio API.
 * This avoids the need for external asset loading.
 */

let audioContext: AudioContext | null = null;

export const playGameSound = (type: 'correct' | 'wrong') => {
  // Initialize AudioContext on first user interaction to comply with browser autoplay policies
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }

  if (!audioContext) return;

  // Resume context if suspended (common in some browsers until interaction)
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }

  const ctx = audioContext;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === 'correct') {
    // Pleasant "Ding" - High pitch sine wave
    osc.type = 'sine';
    
    // Quick ascending arpeggio effect
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.1); // C6
    
    // Envelope: sharp attack, smooth decay
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.start(now);
    osc.stop(now + 0.5);

  } else {
    // "Buzz" / "Bonk" - Low pitch sawtooth wave
    osc.type = 'sawtooth';
    
    // Descending pitch
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.2);
    
    // Envelope: short and abrupt
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.25);
  }
};
