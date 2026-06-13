import { useEffect, useRef } from 'react';

export default function AtmosphereLayer({ rainVolume = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (rainVolume <= 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationId;
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Re-init particles based on volume and screen size
      const count = Math.floor(rainVolume * (canvas.width / 4));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 10 + Math.random() * 15,
        length: 10 + Math.random() * 20,
        opacity: 0.1 + Math.random() * 0.3
      }));
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const draw = () => {
      animationId = requestAnimationFrame(draw);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = 'var(--color-haze)';
      ctx.lineWidth = 1.5;
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.length * 0.1, p.y + p.length);
        ctx.globalAlpha = p.opacity;
        ctx.stroke();
        
        p.y += p.speed;
        p.x += p.speed * 0.1; // slight wind
        
        if (p.y > canvas.height) {
          p.y = -p.length;
          p.x = Math.random() * canvas.width;
        }
      });
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [rainVolume]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-ink z-0">
      {/* Rain Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 z-10 pointer-events-none" />

      {/* The warm lamp glow */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-3xl animate-lamp-pulse will-change-transform z-0"
        style={{
          background: 'radial-gradient(circle, var(--theme-lamp) 0%, transparent 60%)',
          top: '-10%',
          right: '-10%',
          opacity: 0.15,
        }}
      />

      {/* The monitor blue-green glow */}
      <div
        className="absolute w-[900px] h-[900px] rounded-full blur-3xl animate-monitor-drift will-change-transform z-0"
        style={{
          background: 'radial-gradient(circle, var(--theme-phosphor) 0%, transparent 70%)',
          bottom: '-20%',
          left: '-10%',
          opacity: 0.08,
        }}
      />
    </div>
  );
}
