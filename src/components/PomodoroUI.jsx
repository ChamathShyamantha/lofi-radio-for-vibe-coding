import { motion } from 'motion/react';
import { Square, X } from 'lucide-react';

export default function PomodoroUI({ timerState, onClose }) {
  const { timeString, startTimer, stopTimer, isActive } = timerState;

  return (
    <motion.div drag dragMomentum={false} className="pointer-events-auto bg-dusk/80 backdrop-blur-md border border-ember/20 p-4 rounded-xl shadow-2xl flex flex-col items-center gap-4 cursor-grab active:cursor-grabbing min-w-[200px]">
      <div className="w-full flex justify-between" onPointerDown={e => e.stopPropagation()}>
        <span className="text-xs font-mono text-ember uppercase tracking-widest">Focus</span>
        <button onClick={onClose} className="text-haze hover:text-ember"><X size={14} /></button>
      </div>

      <div className="text-4xl font-serif text-ember drop-shadow-[0_0_8px_var(--theme-ember)]">
        {timeString || "25:00"}
      </div>

      <div className="flex gap-2 w-full justify-center" onPointerDown={e => e.stopPropagation()}>
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
