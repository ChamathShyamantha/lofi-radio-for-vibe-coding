import { motion } from 'motion/react';

const SHORTCUTS = [
  { key: 'Space', action: 'Play / Pause' },
  { key: '←', action: 'Previous station' },
  { key: '→', action: 'Next station' },
  { key: '↑', action: 'Volume up' },
  { key: '↓', action: 'Volume down' },
  { key: 'M', action: 'Mute / Unmute' },
  { key: '?', action: 'Toggle this overlay' },
];

export default function ShortcutOverlay({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/70 backdrop-blur-sm cursor-pointer"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-dusk/90 backdrop-blur-md border border-haze/20 rounded-2xl p-6 shadow-2xl max-w-xs w-full cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif italic text-lg text-lamp mb-4">Keyboard Shortcuts</h3>
        <div className="flex flex-col gap-2.5">
          {SHORTCUTS.map((s) => (
            <div key={s.key} className="flex items-center justify-between">
              <kbd className="px-2 py-0.5 bg-ink/60 border border-haze/20 rounded text-[11px] font-mono text-lamp min-w-[40px] text-center">
                {s.key}
              </kbd>
              <span className="font-mono text-xs text-haze/80">{s.action}</span>
            </div>
          ))}
        </div>
        <p className="font-mono text-[9px] text-haze/30 mt-4 text-center">Press ? or click outside to close</p>
      </motion.div>
    </motion.div>
  );
}
