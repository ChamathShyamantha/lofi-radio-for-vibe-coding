import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

export function useToneAmbient() {
  const [volumes, setVolumes] = useState(() => {
    const saved = localStorage.getItem('drift_ambient_v2');
    return saved ? JSON.parse(saved) : { rain: 0, crackle: 0, fire: 0, synth: 0 };
  });

  const synthsRef = useRef({});
  const isStarted = useRef(false);

  useEffect(() => {
    localStorage.setItem('drift_ambient_v2', JSON.stringify(volumes));
  }, [volumes]);

  const initSynths = async () => {
    if (synthsRef.current.rain) return;

    // Rain: Pink Noise through a lowpass filter
    const rainFilter = new Tone.Filter(800, "lowpass").toDestination();
    const rainNoise = new Tone.Noise("pink").connect(rainFilter);
    rainNoise.volume.value = -Infinity;
    synthsRef.current.rain = rainNoise;

    // Crackle: Vinyl crackle simulation using Highpass Brown noise + impulses
    const crackleFilter = new Tone.Filter(4000, "highpass").toDestination();
    const crackleNoise = new Tone.Noise("brown").connect(crackleFilter);
    crackleNoise.volume.value = -Infinity;
    synthsRef.current.crackle = crackleNoise;

    // Fire: Warm rumble with tremolo
    const fireFilter = new Tone.Filter(200, "lowpass").toDestination();
    const fireTremolo = new Tone.Tremolo(14, 0.8).connect(fireFilter).start();
    const fireNoise = new Tone.Noise("pink").connect(fireTremolo);
    fireNoise.volume.value = -Infinity;
    synthsRef.current.fire = fireNoise;

    // Generative Synth: PolySynth with massive reverb
    const reverb = new Tone.Reverb(8).toDestination();
    const delay = new Tone.FeedbackDelay("8n", 0.4).connect(reverb);
    const synth = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 0.5,
      modulationIndex: 1.2,
      oscillator: { type: "sine" },
      envelope: { attack: 2, decay: 2, sustain: 1, release: 4 }
    }).connect(delay);
    synth.volume.value = -Infinity;
    
    const chords = [
      ["C4", "E4", "G4", "B4"],
      ["A3", "C4", "E4", "G4"],
      ["F3", "A3", "C4", "E4"],
      ["D3", "F3", "A3", "C4"],
      ["G3", "B3", "D4", "F#4"]
    ];
    let step = 0;
    
    const loop = new Tone.Loop(time => {
      // Only play if volume > 0 to save CPU
      if (synth.volume.value > -60) {
        const chord = chords[step % chords.length];
        synth.triggerAttackRelease(chord, "1m", time);
        step++;
      }
    }, "2m");
    
    Tone.Transport.bpm.value = 60;
    Tone.Transport.start();
    loop.start(0);

    synthsRef.current.synth = {
      volume: synth.volume,
      start: () => {},
      state: "started"
    };

    // Apply initial volumes
    Object.keys(volumes).forEach(id => {
      if (volumes[id] > 0) {
        const db = Tone.gainToDb(volumes[id] / 100);
        synthsRef.current[id].volume.value = db;
        if (synthsRef.current[id].start && synthsRef.current[id].state !== "started") {
          synthsRef.current[id].start();
        }
      }
    });
  };

  const setLoopVolume = async (id, val, initAudio = true) => {
    if (initAudio && !isStarted.current) {
      await Tone.start();
      isStarted.current = true;
      await initSynths();
    }
    
    setVolumes(prev => ({ ...prev, [id]: val }));
    
    if (isStarted.current && synthsRef.current[id]) {
      const db = val === 0 ? -Infinity : Tone.gainToDb(val / 100);
      synthsRef.current[id].volume.rampTo(db, 0.5);
      
      if (val > 0 && synthsRef.current[id].start && synthsRef.current[id].state !== "started") {
         synthsRef.current[id].start();
      }
    }
  };

  return { volumes, setLoopVolume };
}
