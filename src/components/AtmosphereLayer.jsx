import { motion } from 'motion/react';

export default function AtmosphereLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-ink z-0">
      {/* The warm lamp glow */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, var(--color-lamp) 0%, transparent 60%)',
          top: '-10%',
          right: '-10%',
          opacity: 0.15,
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.18, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* The monitor blue-green glow */}
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full blur-[140px]"
        style={{
          background: 'radial-gradient(circle, var(--color-phosphor) 0%, transparent 70%)',
          bottom: '-20%',
          left: '-10%',
          opacity: 0.08,
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
