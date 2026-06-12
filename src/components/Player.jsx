import { useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

export default function Player({ station, isPlaying, volume, setVolume, togglePlay, nextStation, prevStation, getAudioData }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!getAudioData) return;
    
    let animationId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      if (isPlaying) {
        const data = getAudioData();
        if (data) {
          const barWidth = 4;
          const gap = 2;
          const numBars = Math.floor(width / (barWidth + gap));
          
          for (let i = 0; i < numBars; i++) {
            const dataIndex = Math.floor(i * (data.length / numBars));
            const value = data[dataIndex] || 0;
            const barHeight = (value / 255) * height;
            
            ctx.fillStyle = 'var(--color-phosphor)';
            ctx.fillRect(i * (barWidth + gap), height - barHeight, barWidth, barHeight);
          }
        }
      } else {
         ctx.fillStyle = 'var(--color-haze)';
         ctx.globalAlpha = 0.3;
         ctx.fillRect(0, height / 2, width, 1);
         ctx.globalAlpha = 1.0;
      }
    };
    
    draw();
    
    return () => cancelAnimationFrame(animationId);
  }, [getAudioData, isPlaying]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-auto bg-dusk/50 backdrop-blur-md p-6 rounded-2xl border border-haze/10 shadow-2xl min-w-[320px]">
      
      <div className="flex flex-col gap-1 w-full items-center">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-phosphor shadow-[0_0_8px_var(--color-phosphor)]' : 'bg-ember'}`} />
          <div className="text-center">
            <h2 className="font-serif italic text-xl text-lamp">{station.name}</h2>
            <p className="font-mono text-xs text-haze">{station.vibe}</p>
          </div>
        </div>
        <canvas ref={canvasRef} width="160" height="24" className="mx-auto mt-2 opacity-80" />
      </div>

      <div className="flex items-center gap-6 mt-2">
        <button onClick={prevStation} className="text-haze hover:text-lamp transition-colors">
          <SkipBack size={20} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-lamp text-ink flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,180,84,0.3)]"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>

        <button onClick={nextStation} className="text-haze hover:text-lamp transition-colors">
          <SkipForward size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 w-full mt-2 px-4">
        <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)} className="text-haze hover:text-lamp">
          {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-haze/20 rounded-lg appearance-none cursor-pointer accent-lamp"
        />
      </div>
    </div>
  );
}
