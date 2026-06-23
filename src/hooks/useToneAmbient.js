import { useEffect, useRef, useState, useCallback } from 'react';
import * as Tone from 'tone';

export function useToneAmbient() {
  const [volumes, setVolumes] = useState(() => {
    const saved = localStorage.getItem('drift_ambient_v3');
    return saved ? JSON.parse(saved) : { rain: 0, crackle: 0, fire: 0, synth: 0 };
  });

  const synthsRef = useRef({});
  const isStarted = useRef(false);
  const isInitializing = useRef(false);

  useEffect(() => {
    localStorage.setItem('drift_ambient_v3', JSON.stringify(volumes));
  }, [volumes]);

  const initSynths = async () => {
    // Prevent double initialization
    if (synthsRef.current.rain || isInitializing.current) return;
    isInitializing.current = true;

    try {
      // ── Rain: Gentle light rain ──
      // White noise → bandpass (airy pitter-patter) → slow tremolo for natural variation
      const rainGain = new Tone.Gain(1).toDestination();
      const rainLowpass = new Tone.Filter(3500, "lowpass").connect(rainGain);
      const rainHighpass = new Tone.Filter(1200, "highpass").connect(rainLowpass);
      const rainTremolo = new Tone.Tremolo({ frequency: 0.3, depth: 0.25, spread: 180 }).connect(rainHighpass).start();
      const rainNoise = new Tone.Noise("white").connect(rainTremolo);
      rainNoise.volume.value = -Infinity;
      rainNoise.start();
      // Wrap with gain node for unified volume control; apply -8dB offset for gentle level
      synthsRef.current.rain = {
        volume: rainNoise.volume,
        _offset: -8,
        dispose: () => { rainNoise.dispose(); rainTremolo.dispose(); rainHighpass.dispose(); rainLowpass.dispose(); rainGain.dispose(); }
      };

      // ── Crackle: Vinyl crackle ──
      const crackleFilter = new Tone.Filter(4000, "highpass").toDestination();
      const crackleNoise = new Tone.Noise("brown").connect(crackleFilter);
      crackleNoise.volume.value = -Infinity;
      crackleNoise.start();
      synthsRef.current.crackle = crackleNoise;

      // ── Fire: Realistic crackling fireplace (two layers) ──
      const fireGain = new Tone.Gain(1).toDestination();

      // Layer 1: Warm hearth rumble — brown noise, lowpass, slow irregular tremolo
      const fireRumbleFilter = new Tone.Filter(300, "lowpass").connect(fireGain);
      const fireRumbleTremolo = new Tone.Tremolo({ frequency: 0.8, depth: 0.4 }).connect(fireRumbleFilter).start();
      const fireRumble = new Tone.Noise("brown").connect(fireRumbleTremolo);
      fireRumble.volume.value = -Infinity;
      fireRumble.start();

      // Layer 2: Crackle pops — white noise, tight bandpass ~3kHz, fast irregular tremolo
      const fireCrackleHigh = new Tone.Filter(5000, "lowpass").connect(fireGain);
      const fireCrackleLow = new Tone.Filter(2000, "highpass").connect(fireCrackleHigh);
      const fireCrackleTremolo = new Tone.Tremolo({ frequency: 6, depth: 0.95 }).connect(fireCrackleLow).start();
      const fireCrackle = new Tone.Noise("white").connect(fireCrackleTremolo);
      fireCrackle.volume.value = -Infinity;
      fireCrackle.start();

      // Expose unified volume control for fire
      synthsRef.current.fire = {
        volume: { 
          value: -Infinity,
          rampTo: (db, time) => {
            // Rumble is main layer, crackle pops are -6dB quieter
            fireRumble.volume.rampTo(db, time);
            fireCrackle.volume.rampTo(db === -Infinity ? -Infinity : db - 6, time);
          }
        },
        dispose: () => {
          fireRumble.dispose(); fireRumbleTremolo.dispose(); fireRumbleFilter.dispose();
          fireCrackle.dispose(); fireCrackleTremolo.dispose(); fireCrackleLow.dispose(); fireCrackleHigh.dispose();
          fireGain.dispose();
        }
      };

      // Generative Synth: PolySynth with reverb
      const reverb = new Tone.Reverb({ decay: 8, wet: 1 }).toDestination();
      await reverb.generate(); // Must await reverb IR generation
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
        // Only play if volume is audible to save CPU
        if (synth.volume.value > -60) {
          const chord = chords[step % chords.length];
          synth.triggerAttackRelease(chord, "1m", time);
          step++;
        }
      }, "2m");

      Tone.getTransport().bpm.value = 60;
      Tone.getTransport().start();
      loop.start(0);

      // Wrap synth to expose a consistent volume interface
      synthsRef.current.synth = {
        volume: synth.volume,
        // No start/stop needed — the loop handles triggering
        dispose: () => {
          loop.stop();
          loop.dispose();
          synth.dispose();
          delay.dispose();
          reverb.dispose();
        }
      };

      // Apply any saved volumes from localStorage
      Object.keys(volumes).forEach(id => {
        if (volumes[id] > 0 && synthsRef.current[id]) {
          const node = synthsRef.current[id];
          const offset = node._offset || 0;
          const db = Tone.gainToDb(volumes[id]) + offset;
          node.volume.value = db;
        }
      });
    } catch (err) {
      console.error('Failed to initialize ambient synths:', err);
    } finally {
      isInitializing.current = false;
    }
  };

  const setLoopVolume = useCallback(async (id, val, initAudio = true) => {
    // Normalize: if val > 1, treat it as a percentage (0-100 → 0-1)
    const normalizedVal = val > 1 ? val / 100 : val;
    const clampedVal = Math.max(0, Math.min(1, normalizedVal));

    if (initAudio && !isStarted.current) {
      await Tone.start();
      isStarted.current = true;
      await initSynths();
    }

    setVolumes(prev => ({ ...prev, [id]: clampedVal }));

    if (isStarted.current && synthsRef.current[id]) {
      const node = synthsRef.current[id];
      const offset = node._offset || 0;
      const db = clampedVal === 0 ? -Infinity : Tone.gainToDb(clampedVal) + offset;
      node.volume.rampTo(db, 0.5);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(synthsRef.current).forEach(node => {
        try {
          if (node && typeof node.dispose === 'function') {
            node.stop?.();
            node.dispose();
          }
        } catch (e) {
          // Ignore disposal errors
        }
      });
      synthsRef.current = {};
      isStarted.current = false;
    };
  }, []);

  return { volumes, setLoopVolume };
}
