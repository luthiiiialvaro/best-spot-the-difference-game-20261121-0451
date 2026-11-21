// Cari Bedanya! — all sounds are synthesized with WebAudio, no audio files.
// The context is created lazily on the first user gesture so browsers allow it.

let ctx = null;
let master = null;
let muted = false;

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
  if (master) master.gain.value = muted ? 0 : 0.5;
}

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq, at, dur, type = 'sine', vol = 0.5) {
  const ac = ensureCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ac.currentTime + at);
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
  osc.connect(gain);
  gain.connect(master);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.05);
}

// A bright two-note chime when a difference is found.
export function playFind() {
  tone(660, 0, 0.18, 'sine', 0.5);
  tone(880, 0.09, 0.28, 'sine', 0.5);
  tone(1320, 0.09, 0.16, 'triangle', 0.18);
}

// A dull buzz when the player clicks empty picture.
export function playMiss() {
  tone(140, 0, 0.22, 'sawtooth', 0.25);
  tone(110, 0.05, 0.2, 'sawtooth', 0.2);
}

// A soft blip when a hint is spent.
export function playHint() {
  tone(520, 0, 0.12, 'triangle', 0.35);
  tone(780, 0.08, 0.16, 'triangle', 0.3);
}

// A short rising arpeggio when a scene is cleared.
export function playWin() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.4));
}

// A sad little fall when time runs out.
export function playLose() {
  [392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.3, 'sine', 0.35));
}

// A tick for the last seconds of the countdown.
export function playTick() {
  tone(1000, 0, 0.06, 'square', 0.12);
}

export function playClick() {
  tone(440, 0, 0.06, 'sine', 0.2);
}
