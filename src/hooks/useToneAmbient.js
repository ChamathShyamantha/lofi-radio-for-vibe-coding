import { useEffect, useRef, useState, useCallback } from 'react';
import * as Tone from 'tone';
import { Howl } from 'howler';

// ── Audio file-based loops (Howler) ──
// Place your audio files in public/audio/
// Recommended: CC0-licensed loops from opengameart.org, freesound.org, etc.
const AUDIO_LOOPS = {
  rain: '/audio/rain.mp3',
  fire: '/audio/fire.mp3',
};

export function useToneAmbient() {
  const [volumes, setVolumes] = useState(() => {
    const saved = localStorage.getItem('drift_ambient_v3');
    return saved ? JSON.parse(saved) : { rain: 0, crackle: 0, fire: 0, synth: 0 };
  });

  const synthsRef = useRef({});   // Tone.js synths (crackle, synth)
  const howlsRef = useRef({});    // Howler instances (rain, fire)
  const isStarted = useRef(false);
  const isInitializing = useRef(false);

  useEffect(() => {
    localStorage.setItem('drift_ambient_v3', JSON.stringify(volumes));
  }, [volumes]);

  // ── Initialize Howler-based audio loops ──
  const initHowl = (id) => {
    if (howlsRef.current[id]) return;
    const src = AUDIO_LOOPS[id];
    if (!src) return;

    howlsRef.current[id] = new Howl({
      src: [src],
      loop: true,
      volume: 0,
      preload: true,
      onloaderror: (_, msg) => console.warn(`[ambient] Failed to load ${id}: ${msg}`),
    });
  };

  // ── Initialize Tone.js synths (crackle + generative chords) ──
  const initSynths = async () => {
    if (synthsRef.current.crackle || isInitializing.current) return;
    isInitializing.current = true;

    try {
      // ── Crackle: Vinyl crackle (synthesized — works great) ──
      const crackleFilter = new Tone.Filter(4000, "highpass").toDestination();
      const crackleNoise = new Tone.Noise("brown").connect(crackleFilter);
      crackleNoise.volume.value = -Infinity;
      crackleNoise.start();
      synthsRef.current.crackle = crackleNoise;

      // ── Generative Synth: PolySynth with reverb ──
      const reverb = new Tone.Reverb({ decay: 8, wet: 1 }).toDestination();
      await reverb.generate();
      const delay = new Tone.FeedbackDelay("8n", 0.4).connect(reverb);
      const synth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 0.5,
        modulationIndex: 1.2,
        oscillator: { type: "sine" },
        envelope: { attack: 2, decay: 2, sustain: 1, release: 4 },
        volume: -Infinity
      }).connect(delay);

      const chords = [
        ["C4", "E4", "G4", "B4"],
        ["A3", "C4", "E4", "G4"],
        ["F3", "A3", "C4", "E4"],
        ["D3", "F3", "A3", "C4"],
        ["G3", "B3", "D4", "F#4"]
      ];
      let step = 0;

      const loop = new Tone.Loop(time => {
        if (synth.volume.value > -60) {
          const chord = chords[step % chords.length];
          synth.triggerAttackRelease(chord, "1m", time);
          step++;
        }
      }, "2m");

      Tone.getTransport().bpm.value = 60;
      Tone.getTransport().start();
      loop.start(0);

      synthsRef.current.synth = {
        volume: synth.volume,
        dispose: () => {
          loop.stop(); loop.dispose();
          synth.dispose(); delay.dispose(); reverb.dispose();
        }
      };

      // Apply saved volumes for Tone.js synths
      ['crackle', 'synth'].forEach(id => {
        if (volumes[id] > 0 && synthsRef.current[id]) {
          const db = Tone.gainToDb(volumes[id]);
          synthsRef.current[id].volume.value = db;
        }
      });
    } catch (err) {
      console.error('Failed to initialize ambient synths:', err);
    } finally {
      isInitializing.current = false;
    }
  };

  const setLoopVolume = useCallback(async (id, val, initAudio = true) => {
    // Normalize: if val > 1, treat as percentage (0-100 → 0-1)
    const normalizedVal = val > 1 ? val / 100 : val;
    const clampedVal = Math.max(0, Math.min(1, normalizedVal));

    // ── Howler-based sounds (rain, fire) ──
    if (AUDIO_LOOPS[id]) {
      if (initAudio) {
        initHowl(id);
      }

      setVolumes(prev => ({ ...prev, [id]: clampedVal }));

      const howl = howlsRef.current[id];
      if (howl) {
        howl.volume(clampedVal);
        if (clampedVal > 0 && !howl.playing()) {
          howl.play();
        } else if (clampedVal === 0 && howl.playing()) {
          howl.pause();
        }
      }
      return;
    }

    // ── Tone.js-based sounds (crackle, synth) ──
    if (initAudio && !isStarted.current) {
      await Tone.start();
      isStarted.current = true;
      await initSynths();
    }

    setVolumes(prev => ({ ...prev, [id]: clampedVal }));

    if (isStarted.current && synthsRef.current[id]) {
      const node = synthsRef.current[id];
      const db = clampedVal === 0 ? -Infinity : Tone.gainToDb(clampedVal);
      node.volume.rampTo(db, 0.5);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Dispose Tone.js nodes
      Object.values(synthsRef.current).forEach(node => {
        try {
          if (node && typeof node.dispose === 'function') {
            node.stop?.();
            node.dispose();
          }
        } catch (e) { /* ignore */ }
      });
      synthsRef.current = {};

      // Unload Howler instances
      Object.values(howlsRef.current).forEach(howl => {
        try { howl.unload(); } catch (e) { /* ignore */ }
      });
      howlsRef.current = {};

      isStarted.current = false;
    };
  }, []);

  return { volumes, setLoopVolume };
}
