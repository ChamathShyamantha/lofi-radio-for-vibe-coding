import { useRef } from 'react';
import { useMatter } from '../hooks/useMatter';

export default function PhysicsCanvas({ getAudioData }) {
  const containerRef = useRef(null);
  useMatter(containerRef, getAudioData);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-10 pointer-events-auto"
    />
  );
}
