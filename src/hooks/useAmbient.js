import { useState, useRef } from 'react';
import { Howl } from 'howler';
import { AMBIENT_LOOPS } from '../data/ambientLoops';

export function useAmbient() {
  const [volumes, setVolumes] = useState(
    AMBIENT_LOOPS.reduce((acc, loop) => ({ ...acc, [loop.id]: 0 }), {})
  );
  const howlsRef = useRef({});

  const setLoopVolume = (id, vol) => {
    setVolumes(prev => ({ ...prev, [id]: vol }));
    
    if (vol > 0 && !howlsRef.current[id]) {
      const loopDef = AMBIENT_LOOPS.find(l => l.id === id);
      howlsRef.current[id] = new Howl({
        src: [loopDef.url],
        loop: true,
        volume: vol,
        html5: true,
        // Optional: gracefully ignore errors since files are missing
        onloaderror: () => console.log(`Missing loop asset: ${loopDef.url}`)
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
