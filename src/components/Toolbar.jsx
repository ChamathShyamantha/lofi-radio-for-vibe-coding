import { Palette, Timer, StickyNote, Play, Pause, ListTodo, Maximize, Minimize } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Toolbar({ radioState, themeState, toggleSticky, toggleTimer, toggleTodo }) {
  const { isPlaying, togglePlay } = radioState;
  const { theme, setTheme } = themeState;
  const themes = ['lamplight', 'vaporwave', 'matrix', 'dawn'];
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const cycleTheme = () => {
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="fixed top-4 left-4 md:top-8 md:left-8 z-30 flex flex-col gap-2 md:gap-4 pointer-events-auto overflow-y-auto max-h-[calc(100vh-32px)] no-scrollbar">
      <button onClick={togglePlay} className="p-2 md:p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative flex-shrink-0" title="Play/Pause">
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <button onClick={cycleTheme} className="p-2 md:p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative flex-shrink-0" title="Cycle Theme">
        <Palette size={20} />
      </button>
      <button onClick={toggleTimer} className="p-2 md:p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative flex-shrink-0" title="Pomodoro Timer">
        <Timer size={20} />
      </button>
      <button onClick={toggleSticky} className="p-2 md:p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative flex-shrink-0" title="Sticky Notes">
        <StickyNote size={20} />
      </button>
      <button onClick={toggleTodo} className="p-2 md:p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative flex-shrink-0" title="To-Do List">
        <ListTodo size={20} />
      </button>
      <button onClick={toggleFullscreen} className="p-2 md:p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative flex-shrink-0 md:mt-auto" title="Toggle Fullscreen">
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>
    </div>
  );
}
