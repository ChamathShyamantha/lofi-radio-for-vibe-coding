import { useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { STATIONS } from '../data/stations';

export default function Player({ station, currentStationIndex, setCurrentStationIndex, isPlaying, volume, setVolume, togglePlay, nextStation, prevStation, getAudioData }) {
  const canvasRef = useRef(null);
  const peaksRef = useRef([]);
  const activeChipRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Auto-scroll active channel chip into view whenever station changes
  useEffect(() => {
    if (activeChipRef.current && scrollContainerRef.current) {
      activeChipRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentStationIndex]);

  // Visualizer canvas
  useEffect(() => {
    if (!getAudioData) return;
    
    let animationId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      const width = canvas.width;
      const height = canvas.height;
      const time = Date.now() / 1000;
      ctx.clearRect(0, 0, width, height);
      
      if (isPlaying) {
        const barWidth = 8;
        const gap = 4;
        const numBars = Math.floor(width / (barWidth + gap));
        if (peaksRef.current.length !== numBars) {
          peaksRef.current = new Array(numBars).fill(0);
        }
        for (let i = 0; i < numBars; i++) {
          const noise = Math.random() * 0.5 + 0.5;
          const wave = Math.sin(time * 2 + i * 0.1) * 0.5 + 0.5;
          const beat = Math.pow(Math.sin(time * 3.14 * (80 / 60)), 4); // 80 bpm
          const simulatedValue = (wave * 0.3 + noise * 0.4 + beat * 0.3) * 255;
          const barHeight = (simulatedValue / 255) * (height * 0.8);
          
          ctx.fillStyle = 'var(--color-phosphor)';
          ctx.globalAlpha = 0.5;
          ctx.fillRect(i * (barWidth + gap), height - barHeight, barWidth, barHeight);
          
          if (barHeight > peaksRef.current[i]) {
            peaksRef.current[i] = barHeight;
          } else {
            peaksRef.current[i] -= 1.5; // gravity
            if (peaksRef.current[i] < 0) peaksRef.current[i] = 0;
          }
          ctx.globalAlpha = 1.0;
          ctx.fillStyle = 'var(--color-lamp)';
          ctx.fillRect(i * (barWidth + gap), height - peaksRef.current[i] - 2, barWidth, 2);
        }
      } else {
        ctx.fillStyle = 'var(--color-haze)';
        ctx.globalAlpha = 0.1;
        ctx.fillRect(0, height / 2, width, 1);
        ctx.globalAlpha = 1.0;
      }
    };
    draw();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [getAudioData, isPlaying]);

  return (
    <div className="relative flex flex-col items-center gap-3 bg-dusk/50 backdrop-blur-md p-5 rounded-2xl border border-haze/10 shadow-2xl w-[calc(100vw-80px)] md:w-[420px] max-w-lg overflow-hidden">
      
      {/* Background Retro Visualizer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0" />
      
      {/* Station Info */}
      <div className="relative z-10 flex flex-col gap-1 w-full items-center">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isPlaying ? 'bg-phosphor shadow-[0_0_8px_var(--color-phosphor)]' : 'bg-ember'}`} />
          <div className="text-center">
            <h2 className="font-serif italic text-xl text-lamp">{station.name}</h2>
            <p className="font-mono text-xs text-haze">{station.vibe}</p>
          </div>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="relative z-10 flex items-center gap-6 mt-1">
        <button
          onClick={prevStation}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-haze hover:text-lamp transition-colors"
        >
          <SkipBack size={20} />
        </button>
        
        <button
          onClick={togglePlay}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-12 h-12 rounded-full bg-lamp text-ink flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,180,84,0.3)]"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>

        <button
          onClick={nextStation}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-haze hover:text-lamp transition-colors"
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Volume */}
      <div className="relative z-10 flex items-center gap-2 w-full px-3">
        <button
          onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-haze hover:text-lamp flex-shrink-0"
        >
          {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-full h-1 bg-haze/20 rounded-lg appearance-none cursor-pointer accent-lamp"
        />
      </div>

      {/* ── Channel Strip ── */}
      <div className="relative z-10 w-full">
        <div className="text-[9px] font-mono text-haze/40 uppercase tracking-widest mb-1.5 px-1">channels</div>
        <div
          ref={scrollContainerRef}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth' }}
        >
          {STATIONS.map((s, i) => {
            const isActive = i === currentStationIndex;
            return (
              <button
                key={s.id}
                ref={isActive ? activeChipRef : null}
                onClick={() => setCurrentStationIndex(i)}
                onPointerDown={(e) => e.stopPropagation()}
                className={[
                  'flex-shrink-0 flex flex-col items-start px-3 py-1.5 rounded-lg border transition-all duration-200 text-left cursor-pointer',
                  isActive
                    ? 'border-lamp/60 bg-lamp/10 shadow-[0_0_10px_var(--color-lamp)] scale-[1.03]'
                    : 'border-haze/10 bg-haze/5 hover:border-haze/30 hover:bg-haze/10',
                ].join(' ')}
              >
                <span className={`font-mono text-[11px] font-semibold leading-tight ${isActive ? 'text-lamp' : 'text-haze'}`}>
                  {s.name}
                </span>
                <span className="font-mono text-[9px] text-haze/50 leading-tight mt-0.5 max-w-[90px] truncate">
                  {s.vibe}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
