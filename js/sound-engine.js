/**
 * sound-engine.js
 * 100% Web Audio API Procedural Anime Sound Synthesizer
 * Zero external MP3s, zero network requests, 100% offline & instantaneous.
 */

class AnimeSoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.chargeOsc = null;
    this.chargeGain = null;
    this.chargeFilter = null;
    this.initialized = false;
    this.voices = [];
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        try {
          this.voices = window.speechSynthesis.getVoices() || [];
        } catch (e) {}
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  init() {
    if (this.initialized && this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.initialized = true;
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.chargeGain) {
      this.stopAirCannonCharge();
    }
    return this.isMuted;
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    if (this.isMuted && this.chargeGain) {
      this.stopAirCannonCharge();
    }
  }

  // --- 1. Paper Tear Crinkle ---
  playPaperTear() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Crackle bursts + white noise
      const crackle = Math.random() > 0.88 ? (Math.random() * 2 - 1) * 1.5 : (Math.random() * 2 - 1) * 0.3;
      data[i] = crackle * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1600, t);
    filter.frequency.exponentialRampToValueAtTime(700, t + 0.35);
    filter.Q.value = 3.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  // --- 2. Golden Bell Ring ---
  playCollarBell() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const freqs = [2093, 2489, 3136, 4186]; // High bright bell harmonics

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq + (Math.random() * 10 - 5), t);

      const amp = 0.18 / (idx + 1);
      gain.gain.setValueAtTime(amp, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2 + idx * 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 1.6);
    });
  }

  // --- 3. Anime Sparkle Chime ---
  playChime() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const t = now + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  // --- 4. Air Cannon Turbine Charge ---
  startAirCannonCharge() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    if (this.chargeOsc) {
      this.stopAirCannonCharge();
    }

    const t = this.ctx.currentTime;
    this.chargeOsc = this.ctx.createOscillator();
    this.chargeOsc.type = "sawtooth";
    this.chargeOsc.frequency.setValueAtTime(110, t);

    this.chargeFilter = this.ctx.createBiquadFilter();
    this.chargeFilter.type = "lowpass";
    this.chargeFilter.frequency.setValueAtTime(300, t);
    this.chargeFilter.Q.value = 8;

    this.chargeGain = this.ctx.createGain();
    this.chargeGain.gain.setValueAtTime(0.05, t);

    // LFO vibrato
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(14, t);
    lfoGain.gain.setValueAtTime(25, t);
    lfo.connect(this.chargeOsc.frequency);
    lfo.start(t);
    this.chargeLfo = lfo;

    this.chargeOsc.connect(this.chargeFilter);
    this.chargeFilter.connect(this.chargeGain);
    this.chargeGain.connect(this.ctx.destination);

    this.chargeOsc.start(t);
  }

  updateAirCannonCharge(progress) {
    if (!this.ctx || !this.chargeOsc || !this.chargeFilter || !this.chargeGain) return;
    const t = this.ctx.currentTime;
    const clamped = Math.max(0, Math.min(1, progress));

    // Pitch rises dramatically from 110Hz to 750Hz
    this.chargeOsc.frequency.setTargetAtTime(110 + clamped * 640, t, 0.05);
    // Filter opens up for piercing energy hum
    this.chargeFilter.frequency.setTargetAtTime(300 + clamped * 2800, t, 0.05);
    // Volume swells
    this.chargeGain.gain.setTargetAtTime(0.05 + clamped * 0.25, t, 0.05);
  }

  stopAirCannonCharge() {
    if (this.chargeOsc) {
      try {
        const t = this.ctx ? this.ctx.currentTime : 0;
        if (this.chargeGain && this.ctx) {
          this.chargeGain.gain.setTargetAtTime(0.001, t, 0.04);
        }
        if (this.chargeOsc) this.chargeOsc.stop(t + 0.06);
        if (this.chargeLfo) this.chargeLfo.stop(t + 0.06);
      } catch (e) {
        // Already stopped
      }
      this.chargeOsc = null;
      this.chargeGain = null;
      this.chargeFilter = null;
      this.chargeLfo = null;
    }
  }

  // --- 5. Air Cannon Shockwave DOKAN Blast ---
  playAirCannonBlast() {
    this.stopAirCannonCharge();
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Sub-bass heavy thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(180, t);
    subOsc.frequency.exponentialRampToValueAtTime(28, t + 0.6);

    subGain.gain.setValueAtTime(0.7, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.75);

    // Blast noise shockwave
    const bufferSize = this.ctx.sampleRate * 0.65;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(2400, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(180, t + 0.6);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.65, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(t);

    // Comic laser ring ping
    const ping = this.ctx.createOscillator();
    const pingGain = this.ctx.createGain();
    ping.type = "triangle";
    ping.frequency.setValueAtTime(880, t);
    ping.frequency.exponentialRampToValueAtTime(110, t + 0.35);

    pingGain.gain.setValueAtTime(0.3, t);
    pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    ping.connect(pingGain);
    pingGain.connect(this.ctx.destination);
    ping.start(t);
    ping.stop(t + 0.4);
  }

  // --- 6. Sad Trombone (Nobita's 0-point test) ---
  playSadTrombone() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [
      { f: 293.66, dur: 0.35 }, // D4
      { f: 277.18, dur: 0.35 }, // C#4
      { f: 261.63, dur: 0.35 }, // C4
      { f: 246.94, dur: 0.85, slideTo: 196.00 } // B3 sliding to G3
    ];

    let start = this.ctx.currentTime;
    notes.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";

      osc.frequency.setValueAtTime(note.f, start);
      if (note.slideTo) {
        osc.frequency.exponentialRampToValueAtTime(note.slideTo, start + note.dur);
      }

      // Filter for muted brass wah sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(650, start);
      filter.frequency.exponentialRampToValueAtTime(320, start + note.dur);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + note.dur);
      start += note.dur + 0.05;
    });
  }

  // --- 7. Gian's Recital "BOE~~!" Voice ---
  playGianSinging() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Detuned loud dual oscillators with harsh wobble
    [320, 335, 470].forEach((baseFreq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(baseFreq, t);

      // Heavy comically painful vibrato
      const vib = this.ctx.createOscillator();
      const vibGain = this.ctx.createGain();
      vib.frequency.setValueAtTime(6.5, t);
      vibGain.gain.setValueAtTime(35, t);
      vib.connect(osc.frequency);
      vib.start(t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 1.2);
      vib.stop(t + 1.2);
    });
  }

  // --- 8. Dorami's Melon Pan Sparkle ---
  playMelonPanSparkle() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const pitches = [1318.5, 1567.98, 1975.53, 2093.0, 2637.02];
    const now = this.ctx.currentTime;
    pitches.forEach((freq, idx) => {
      const t = now + idx * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  // --- 9. Golf Swing Whoosh & Crack ---
  playGolfSwing() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Whoosh
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(250, t);
    filter.frequency.exponentialRampToValueAtTime(1400, t + 0.22);
    filter.Q.value = 2;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);

    // Ball impact click "TOCK"
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = "triangle";
    click.frequency.setValueAtTime(2200, t + 0.22);
    click.frequency.exponentialRampToValueAtTime(300, t + 0.28);

    clickGain.gain.setValueAtTime(0, t);
    clickGain.gain.setValueAtTime(0.45, t + 0.22);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    click.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    click.start(t + 0.22);
    click.stop(t + 0.38);
  }

  // --- 10. Polaroid Flip / Card Snap ---
  playPolaroidFlip() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.12);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  // --- 11. Poke Pop ---
  playPoke() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(950, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  // --- 12. Mini-Dora Voice ("Dorara~!") ---
  playMiniDora() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const tones = [880, 1174, 987, 1318];
    const now = this.ctx.currentTime;
    tones.forEach((freq, idx) => {
      const t = now + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    });
  }

  // --- 13. Screen Shake Rumble (Mom's lecture) ---
  playRumble() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.linearRampToValueAtTime(55, t + 0.8);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.85);
  }

  // --- 14. Character Voice Synthesis (Greetings & Anime Lines) ---
  speakCharacter(charId) {
    if (this.isMuted) return;
    this.ensureContext();

    const SCRIPTS = {
      shizuka: {
        ja: "こんにちは、のび太さん！",
        en: "Hello, Nobita-san!",
        pitch: 1.45,
        rate: 1.05,
        toneNotes: [523.25, 659.25, 783.99],
        wave: "sine"
      },
      gian: {
        ja: "おれはジャイアン！こんにちは！",
        en: "I am Gian! What's yours is mine!",
        pitch: 0.65,
        rate: 0.95,
        toneNotes: [146.83, 196.00, 220.00],
        wave: "sawtooth"
      },
      suneo: {
        ja: "やあ、のび太！スネ夫だよ！",
        en: "Hey Nobita! Look at my new toy!",
        pitch: 1.3,
        rate: 1.2,
        toneNotes: [440.00, 554.37, 659.25],
        wave: "triangle"
      },
      dekisugi: {
        ja: "こんにちは、のび太くん！一緒に勉強しよう！",
        en: "Hello Nobita-kun! Let's study together!",
        pitch: 1.08,
        rate: 1.0,
        toneNotes: [392.00, 493.88, 587.33],
        wave: "sine"
      },
      doraemon: {
        ja: "ぼく、ドラえもん！こんにちは！",
        en: "Hello! I am Doraemon!",
        pitch: 1.25,
        rate: 1.1,
        toneNotes: [440.00, 523.25, 659.25],
        wave: "sine"
      },
      nobita: {
        ja: "ドラえも〜ん！助けてよ〜！",
        en: "Doraemon! Help me out!",
        pitch: 1.12,
        rate: 0.95,
        toneNotes: [329.63, 392.00, 329.63],
        wave: "triangle"
      },
      dorami: {
        ja: "こんにちは！ドラミだよ！",
        en: "Hello! I am Dorami!",
        pitch: 1.48,
        rate: 1.12,
        toneNotes: [587.33, 698.46, 880.00],
        wave: "sine"
      },
      tamako: {
        ja: "のび太！また０点取ったのね！",
        en: "Nobita! Did you get another zero?!",
        pitch: 0.92,
        rate: 1.05,
        toneNotes: [261.63, 293.66, 329.63],
        wave: "sawtooth"
      },
      nobisuke: {
        ja: "わっはっは！のび太、元気かい？",
        en: "Hahaha! Nobita, how are you doing?",
        pitch: 0.72,
        rate: 0.92,
        toneNotes: [130.81, 164.81, 196.00],
        wave: "sine"
      }
    };

    const cfg = SCRIPTS[charId];
    if (!cfg) return;

    // A. Procedural melodic character voice chord
    if (this.ctx) {
      const now = this.ctx.currentTime;
      cfg.toneNotes.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = cfg.wave || "sine";
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.26);
      });
    }

    // B. Native browser speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        if (!this.voices || this.voices.length === 0) {
          this.voices = window.speechSynthesis.getVoices() || [];
        }
        const jaVoice = this.voices.find(v => v.lang && (v.lang.startsWith("ja") || v.lang.includes("JP")));
        const text = jaVoice ? cfg.ja : cfg.en;
        const utter = new SpeechSynthesisUtterance(text);
        if (jaVoice) {
          utter.voice = jaVoice;
          utter.lang = "ja-JP";
        } else {
          utter.lang = "en-US";
        }
        utter.pitch = cfg.pitch;
        utter.rate = cfg.rate;
        utter.volume = 1;
        window.speechSynthesis.speak(utter);
      } catch (err) {
        console.warn("Speech synthesis error", err);
      }
    }
  }
}

// Global singleton instance
window.soundEngine = new AnimeSoundEngine();
