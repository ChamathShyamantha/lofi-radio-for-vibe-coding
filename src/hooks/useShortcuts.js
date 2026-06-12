import { useEffect } from 'react';

export function useShortcuts({ radioState }) {
  const { togglePlay, nextStation, prevStation, volume, setVolume } = radioState;

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in terminal
      if (document.activeElement.tagName === 'INPUT') return;

      switch(e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          nextStation();
          break;
        case 'ArrowLeft':
          prevStation();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.05));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.05));
          break;
        case 'm':
        case 'M':
          setVolume(volume > 0 ? 0 : 0.5);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, nextStation, prevStation, volume, setVolume]);
}
