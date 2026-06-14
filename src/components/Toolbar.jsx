import { Palette, Timer, StickyNote, ListTodo, Maximize, Minimize, Zap, ZapOff, Image as ImageIcon, ImageOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

export default function Toolbar({ radioState, themeState, toggleSticky, toggleTimer, toggleTodo, glitchEnabled, toggleGlitch, showScenes, toggleScenes }) {
  const { isPlaying, togglePlay } = radioState;
  const { theme, setTheme } = themeState;
  const themes = ['lamplight', 'vaporwave', 'matrix', 'dawn', 'void', 'ocean', 'neon', 'crimson'];
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

  const isMobile = useIsMobile();
  const iconSize = isMobile ? 16 : 20;

  return (
    <div className="fixed top-4 left-4 md:top-8 md:left-8 z-30 flex flex-col gap-2 md:gap-4 pointer-events-auto overflow-y-auto max-h-[calc(100vh-32px)] no-scrollbar">
      <button onClick={cycleTheme} className="p-2 md:p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative flex-shrink-0" title={`Cycle Theme (${theme})`}>
        <Palette size={iconSize} />
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-ink/90 border border-haze/20 rounded font-mono text-[10px] text-lamp opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block z-50">
          Theme: {theme}
        </span>
      </button>
      <button onClick={toggleTimer} className="p-2 md:p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative flex-shrink-0" title="Pomodoro Timer">
        <Timer size={iconSize} />
      </button>
      <button onClick={toggleSticky} className="p-2 md:p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative flex-shrink-0" title="Sticky Notes">
        <StickyNote size={iconSize} />
      </button>
      <button onClick={toggleTodo} className="p-2 md:p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative flex-shrink-0" title="To-Do List">
        <ListTodo size={iconSize} />
      </button>
      <button onClick={toggleGlitch} className={`p-2 md:p-3 backdrop-blur-md border rounded-xl transition-colors group relative flex-shrink-0 ${glitchEnabled ? 'bg-dusk/50 border-haze/10 hover:bg-haze/20 text-lamp hover:text-lamp' : 'bg-dusk/30 border-haze/5 text-haze/30 hover:text-haze/60 hover:bg-haze/10'}`} title={glitchEnabled ? 'Glitch: ON' : 'Glitch: OFF'}>
        {glitchEnabled ? <Zap size={iconSize} /> : <ZapOff size={iconSize} />}
      </button>
      <button onClick={toggleScenes} className={`p-2 md:p-3 backdrop-blur-md border rounded-xl transition-colors group relative flex-shrink-0 ${showScenes ? 'bg-dusk/50 border-haze/10 hover:bg-haze/20 text-lamp hover:text-lamp' : 'bg-dusk/30 border-haze/5 text-haze/30 hover:text-haze/60 hover:bg-haze/10'}`} title={showScenes ? 'Animated Scenes: ON' : 'Animated Scenes: OFF'}>
        {showScenes ? <ImageIcon size={iconSize} /> : <ImageOff size={iconSize} />}
      </button>
      <button onClick={toggleFullscreen} className="p-2 md:p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative flex-shrink-0 md:mt-auto" title="Toggle Fullscreen">
        {isFullscreen ? <Minimize size={iconSize} /> : <Maximize size={iconSize} />}
      </button>
    </div>
  );
}
