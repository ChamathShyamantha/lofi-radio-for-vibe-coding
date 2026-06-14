import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ListMusic, X } from 'lucide-react';
import { STATIONS } from '../data/stations';
import { motion, AnimatePresence } from 'motion/react';

export default function Player({ station, currentStationIndex, setCurrentStationIndex, isPlaying, volume, setVolume, togglePlay, nextStation, prevStation, getAudioData }) {
  const [isListOpen, setIsListOpen] = useState(false);
  const canvasRef = useRef(null);
  const peaksRef = useRef([]);
  const activeItemRef = useRef(null);

  // Auto-scroll to active channel when list opens
  useEffect(() => {
    if (isListOpen && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isListOpen]);

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
    <div 
      className="relative bg-dusk/50 backdrop-blur-md rounded-2xl border border-haze/10 shadow-2xl w-[calc(100vw-80px)] md:w-[420px] max-w-lg overflow-hidden min-h-[180px]"
      onClick={() => { if (isListOpen) setIsListOpen(false); }}
    >
      {/* Background Retro Visualizer always present */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0" />
      
      <AnimatePresence mode="wait">
        {!isListOpen ? (
          <motion.div
            key="player-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex flex-col items-center gap-3 p-5"
          >
            {/* Station Info */}
            <div className="flex flex-col gap-1 w-full items-center">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isPlaying ? 'bg-phosphor shadow-[0_0_8px_var(--color-phosphor)]' : 'bg-ember'}`} />
                <div className="text-center">
                  <h2 className="font-serif italic text-xl text-lamp">{station.name}</h2>
                  <p className="font-mono text-xs text-haze">{station.vibe}</p>
                </div>
              </div>
            </div>

            {/* Transport Controls */}
            <div className="flex items-center gap-6 mt-1">
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

            {/* Volume & Channels Toggle */}
            <div className="flex items-center justify-between w-full px-3 mt-1 gap-4">
              <div className="flex items-center gap-2 flex-grow">
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
              
              <button 
                onClick={(e) => { e.stopPropagation(); setIsListOpen(true); }}
                onPointerDown={(e) => e.stopPropagation()}
                className="text-haze hover:text-lamp transition-colors flex items-center justify-center bg-haze/5 hover:bg-haze/10 p-2 rounded-lg border border-haze/10"
                title="Browse Channels"
              >
                <ListMusic size={16} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex flex-col w-full h-[220px] p-4 bg-dusk/80 backdrop-blur-md"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="text-[10px] font-mono text-haze/60 uppercase tracking-widest pl-1">Select Channel</div>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsListOpen(false); }}
                onPointerDown={(e) => e.stopPropagation()}
                className="text-haze hover:text-lamp transition-colors bg-haze/5 hover:bg-haze/10 p-1 rounded-md"
              >
                <X size={14} />
              </button>
            </div>
            
            <div 
              className="flex flex-col gap-2 overflow-y-auto pr-1 h-full scroll-smooth"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-haze) transparent' }}
              onPointerDown={(e) => e.stopPropagation()} // allows scrolling without dragging the player
            >
              {STATIONS.map((s, i) => {
                const isActive = i === currentStationIndex;
                return (
                  <button
                    key={s.id}
                    ref={isActive ? activeItemRef : null}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentStationIndex(i);
                      setIsListOpen(false);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={[
                      'flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 text-left cursor-pointer flex-shrink-0',
                      isActive
                        ? 'border-lamp/60 bg-lamp/10 shadow-[0_0_10px_var(--color-lamp)]'
                        : 'border-haze/10 bg-haze/5 hover:border-haze/30 hover:bg-haze/10',
                    ].join(' ')}
                  >
                    <div className="flex flex-col">
                      <span className={`font-mono text-[11px] font-semibold leading-tight ${isActive ? 'text-lamp' : 'text-haze'}`}>
                        {s.name}
                      </span>
                      <span className="font-mono text-[9px] text-haze/50 leading-tight mt-0.5">
                        {s.vibe}
                      </span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-lamp shadow-[0_0_5px_var(--color-lamp)]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
