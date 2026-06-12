import { AMBIENT_LOOPS } from '../data/ambientLoops';
import { CloudRain, Disc, Flame, Coffee } from 'lucide-react';

const ICONS = {
  rain: <CloudRain size={16} />,
  crackle: <Disc size={16} />,
  fire: <Flame size={16} />,
  cafe: <Coffee size={16} />
};

export default function AmbientMixer({ ambientState }) {
  const { volumes, setLoopVolume } = ambientState;

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20 pointer-events-auto bg-dusk/30 backdrop-blur-md p-4 rounded-2xl border border-haze/10 shadow-2xl">
      {AMBIENT_LOOPS.map((loop) => (
        <div key={loop.id} className="flex flex-col items-center gap-2 group relative">
          <div className={`transition-colors ${volumes[loop.id] > 0 ? 'text-lamp' : 'text-haze group-hover:text-lamp'}`}>
            {ICONS[loop.id]}
          </div>
          <div className="h-24 w-1 flex items-end bg-ink/50 rounded-full relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volumes[loop.id]}
              onChange={(e) => setLoopVolume(loop.id, parseFloat(e.target.value))}
              className="absolute w-24 h-4 -left-11 top-[40px] -rotate-90 appearance-none bg-transparent cursor-pointer opacity-0 z-10"
            />
            <div 
              className="w-full bg-lamp rounded-full pointer-events-none transition-all duration-100" 
              style={{ height: `${volumes[loop.id] * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
