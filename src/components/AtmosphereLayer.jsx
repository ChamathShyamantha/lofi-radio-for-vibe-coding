export default function AtmosphereLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-ink z-0">
      {/* The warm lamp glow */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px] animate-lamp-pulse will-change-transform"
        style={{
          background: 'radial-gradient(circle, var(--color-lamp) 0%, transparent 60%)',
          top: '-10%',
          right: '-10%',
          opacity: 0.15,
        }}
      />

      {/* The monitor blue-green glow */}
      <div
        className="absolute w-[900px] h-[900px] rounded-full blur-[140px] animate-monitor-drift will-change-transform"
        style={{
          background: 'radial-gradient(circle, var(--color-phosphor) 0%, transparent 70%)',
          bottom: '-20%',
          left: '-10%',
          opacity: 0.08,
        }}
      />
    </div>
  );
}
