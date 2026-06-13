import { AMBIENT_LOOPS } from '../data/ambientLoops';
import { CloudRain, Disc, Flame, Music } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { motion, AnimatePresence } from 'motion/react';

const ICONS = {
  rain: <CloudRain size={16} />,
  crackle: <Disc size={16} />,
  fire: <Flame size={16} />,
  synth: <Music size={16} />
};

export default function AmbientMixer({ ambientState }) {
  const { volumes, setLoopVolume } = ambientState;
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!isMobile) setExpanded(true);
    else setExpanded(false);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !expanded) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isMobile, expanded]);

  return (
    <div ref={ref} className="bg-dusk/30 backdrop-blur-md p-4 rounded-2xl border border-haze/10 shadow-2xl flex flex-col items-center pointer-events-auto">
      <AnimatePresence mode="wait">
        {(!isMobile || expanded) ? (
          <motion.div 
            key="expanded"
            initial={isMobile ? { height: 0, opacity: 0 } : false}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6 overflow-hidden"
          >
            {AMBIENT_LOOPS.map((loop) => (
              <div key={loop.id} className="flex flex-col items-center gap-2 group relative">
                <button 
                  onClick={() => setLoopVolume(loop.id, volumes[loop.id] > 0 ? 0 : 0.5)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className={`transition-colors ${volumes[loop.id] > 0 ? 'text-lamp' : 'text-haze group-hover:text-lamp'}`}
                >
                  {ICONS[loop.id]}
                </button>
                <div className="h-24 w-1 flex items-end bg-ink/50 rounded-full relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volumes[loop.id]}
                    onChange={(e) => setLoopVolume(loop.id, parseFloat(e.target.value))}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute w-24 h-4 -left-11 top-[40px] -rotate-90 appearance-none bg-transparent cursor-pointer opacity-0 z-10"
                  />
                  <div 
                    className="w-full bg-lamp rounded-full pointer-events-none transition-all duration-100" 
                    style={{ height: `${volumes[loop.id] * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4 cursor-pointer"
            onClick={() => setExpanded(true)}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {AMBIENT_LOOPS.map((loop) => (
              <div key={loop.id} className={`transition-colors ${volumes[loop.id] > 0 ? 'text-lamp' : 'text-haze'}`}>
                {ICONS[loop.id]}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
