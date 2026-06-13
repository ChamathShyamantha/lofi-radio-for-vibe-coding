import { motion, useDragControls } from 'motion/react';
import { Square, X } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

export default function PomodoroUI({ timerState, onClose }) {
  const { timeString, startTimer, stopTimer, isActive } = timerState;
  const controls = useDragControls();
  const isMobile = useIsMobile();

  return (
    <motion.div drag={!isMobile} dragControls={controls} dragListener={false} dragMomentum={false} className="absolute top-32 md:top-24 right-4 md:right-8 pointer-events-auto bg-dusk/80 backdrop-blur-md border border-ember/20 rounded-xl shadow-2xl flex flex-col gap-4 w-[calc(100vw-32px)] md:w-auto md:min-w-[200px] max-w-sm z-40 overflow-hidden pb-4">
      <div 
        className="w-full flex justify-between p-3 bg-ink/50 border-b border-ember/10 cursor-grab active:cursor-grabbing" 
        onPointerDown={e => controls.start(e)}
      >
        <span className="text-xs font-mono text-ember uppercase tracking-widest">Focus</span>
        <button onClick={onClose} className="text-haze hover:text-ember"><X size={14} /></button>
      </div>

      <div className="text-4xl font-serif text-ember drop-shadow-[0_0_8px_var(--theme-ember)] text-center">
        {timeString || "25:00"}
      </div>

      <div className="flex gap-2 w-full justify-center px-4">
        {!isActive ? (
          <>
            <button onClick={() => startTimer(25)} className="flex-1 py-1 bg-ember/20 text-ember border border-ember/30 rounded-md text-sm hover:bg-ember hover:text-ink transition-colors font-mono">25m</button>
            <button onClick={() => startTimer(5)} className="flex-1 py-1 bg-phosphor/20 text-phosphor border border-phosphor/30 rounded-md text-sm hover:bg-phosphor hover:text-ink transition-colors font-mono">5m</button>
          </>
        ) : (
          <button onClick={stopTimer} className="w-full py-1 bg-ember text-ink rounded-md hover:scale-105 transition-transform flex justify-center items-center gap-2 font-mono text-sm">
            <Square size={14} fill="currentColor" /> Stop
          </button>
        )}
      </div>
    </motion.div>
  );
}
