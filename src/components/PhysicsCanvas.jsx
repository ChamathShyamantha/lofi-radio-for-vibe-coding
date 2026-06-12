import { useRef } from 'react';
import { useMatter } from '../hooks/useMatter';

export default function PhysicsCanvas({ getAudioData }) {
  const containerRef = useRef(null);
  const { engine } = useMatter(containerRef, getAudioData);

  const handleClick = (e) => {
    // Avoid spawning if we're clicking an existing body
    // The mouse constraint will handle dragging. We just spawn if clicking empty space.
    if (engine && engine.spawnItem) {
      // Just spawn at click location
      engine.spawnItem(e.clientX, e.clientY);
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
