import { useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import { AMBIENT_LOOPS } from '../data/ambientLoops';

export function useAmbient() {
  const [volumes, setVolumes] = useState(() => {
    try {
      const saved = localStorage.getItem('drift_ambient');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return AMBIENT_LOOPS.reduce((acc, loop) => ({ ...acc, [loop.id]: 0 }), {});
  });
  const howlsRef = useRef({});

  useEffect(() => { localStorage.setItem('drift_ambient', JSON.stringify(volumes)); }, [volumes]);

  const setLoopVolume = (id, vol) => {
    setVolumes(prev => ({ ...prev, [id]: vol }));
    
    if (vol > 0 && !howlsRef.current[id]) {
      const loopDef = AMBIENT_LOOPS.find(l => l.id === id);
      howlsRef.current[id] = new Howl({
        src: [loopDef.url],
        loop: true,
        volume: vol,
        onloaderror: (id, msg) => console.log(`Audio loop error: ${loopDef.url}`, msg)
      });
      howlsRef.current[id].play();
    } else if (howlsRef.current[id]) {
      howlsRef.current[id].volume(vol);
      if (vol === 0) {
        howlsRef.current[id].pause();
      } else if (!howlsRef.current[id].playing()) {
        howlsRef.current[id].play();
      }
    }
  };

  return { volumes, setLoopVolume };
}
