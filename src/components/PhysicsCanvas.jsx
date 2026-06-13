import { useRef, useEffect } from 'react';
import { useMatter } from '../hooks/useMatter';

export default function PhysicsCanvas({ getAudioData, isPlaying }) {
  const containerRef = useRef(null);
  const { engine } = useMatter(containerRef, getAudioData, isPlaying);

  useEffect(() => {
    const handleDrop = (e) => {
      e.preventDefault();
      for (const file of e.dataTransfer.files) {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          if (engine?.spawnItem) {
            engine.spawnItem(e.clientX, e.clientY, url);
          }
        }
      }
    };
    const handleDragOver = (e) => e.preventDefault();
    
    window.addEventListener('drop', handleDrop);
    window.addEventListener('dragover', handleDragOver);
    
    return () => {
      window.removeEventListener('drop', handleDrop);
      window.removeEventListener('dragover', handleDragOver);
    };
  }, [engine]);

  const handleClick = (e) => {
    // Apply a water drop ripple force to physics items
    if (engine && engine.waterDrop) {
      engine.waterDrop(e.clientX, e.clientY);
    }
  };

  return (
    <div 
      ref={containerRef} 
      onPointerDown={handleClick}
      className="absolute inset-0 z-10 pointer-events-auto"
    />
  );
}
