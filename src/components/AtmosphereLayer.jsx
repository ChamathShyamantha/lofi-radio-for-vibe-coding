import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function AtmosphereLayer({ rainVolume = 0, theme = 'lamplight', showScenes = false }) {
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
      <AnimatePresence>
        {showScenes && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            {theme === 'lamplight' && <LamplightScene />}
            {theme === 'vaporwave' && <VaporwaveScene />}
            {theme === 'matrix' && <MatrixScene />}
            {theme === 'dawn' && <DawnScene />}
            {theme === 'void' && <VoidScene />}
            {theme === 'ocean' && <OceanScene />}
            {theme === 'neon' && <NeonScene />}
            {theme === 'crimson' && <CrimsonScene />}
          </motion.div>
        )}
      </AnimatePresence>

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

/* --- Animated Scenes --- */

function LamplightScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#FFB454]/40 rounded-full blur-[1px]"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + Math.random() * 200,
            opacity: 0
          }}
          animate={{
            y: -100,
            x: `calc(${Math.random() * 100}vw + ${Math.random() * 100 - 50}px)`,
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            delay: Math.random() * 15,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

function VaporwaveScene() {
  return (
    <div className="absolute inset-0 overflow-hidden perspective-[1000px]">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#FF71CE]/20 to-transparent"></div>
      <motion.div 
        className="absolute inset-x-0 bottom-[-50%] h-[150%] origin-bottom"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(11,211,211,0.2) 1px, transparent 1px), linear-gradient(to top, rgba(11,211,211,0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'rotateX(75deg)'
        }}
        animate={{ backgroundPositionY: ['0px', '40px'] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-b from-[#FF71CE] to-[#01CDFE] opacity-40 blur-sm shadow-[0_0_100px_rgba(255,113,206,0.6)]"></div>
    </div>
  );
}

function MatrixScene() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 text-[#9FE88D] font-mono text-xs text-center break-all leading-3 mix-blend-screen"
          style={{ left: `${(i / 20) * 100}%` }}
          initial={{ y: '-100%' }}
          animate={{ y: '100vh' }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
        >
          {Array.from({ length: 30 }).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join('\n')}
        </motion.div>
      ))}
    </div>
  );
}

function DawnScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#FFB454]/10 to-transparent"></div>
      <motion.div 
        className="absolute bottom-0 w-full h-[60%] bg-gradient-to-t from-[#FFB454]/20 via-[#E8606B]/10 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function VoidScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            width: Math.random() * 2 + 1 + 'px',
            height: Math.random() * 2 + 1 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%'
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.8, 0.1],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

function OceanScene() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#59C2FF]/5">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-[-20%] w-[150%] h-[50%] bg-[#59C2FF]/10 blur-3xl transform -rotate-12"
          style={{ left: '-25%' }}
          animate={{
            y: [0, 50, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

function NeonScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-[#01CDFE]/5"
        animate={{ opacity: [0, 0.2, 0, 0.1, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "steps(10)" }}
      />
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-0.5 bg-[#FF71CE]/40 shadow-[0_0_8px_#FF71CE]"
          style={{ width: 40 + Math.random() * 100 + 'px' }}
          initial={{ x: '-100%', y: Math.random() * 100 + 'vh' }}
          animate={{ x: '100vw' }}
          transition={{
            duration: 1 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

function CrimsonScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-[#E8606B]/20 to-transparent"></div>
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#E8606B]/60 rounded-full blur-[2px] shadow-[0_0_10px_#E8606B]"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            y: -50,
            x: `calc(${Math.random() * 100}vw + ${Math.random() * 50 - 25}px)`,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeIn"
          }}
        />
      ))}
    </div>
  );
}
