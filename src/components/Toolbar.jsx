import { Palette, Timer, StickyNote, Play, Pause, ListTodo } from 'lucide-react';

export default function Toolbar({ radioState, themeState, toggleSticky, toggleTimer, toggleTodo }) {
  const { isPlaying, togglePlay } = radioState;
  const { theme, setTheme } = themeState;
  const themes = ['lamplight', 'vaporwave', 'matrix', 'dawn'];

  const cycleTheme = () => {
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <div className="fixed top-8 left-8 z-30 flex flex-col md:flex-row gap-4 pointer-events-auto">
      <button onClick={togglePlay} className="p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative" title="Play/Pause">
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <button onClick={cycleTheme} className="p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative" title="Cycle Theme">
        <Palette size={20} />
      </button>
      <button onClick={toggleTimer} className="p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative" title="Pomodoro Timer">
        <Timer size={20} />
      </button>
      <button onClick={toggleSticky} className="p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative" title="Sticky Notes">
        <StickyNote size={20} />
      </button>
      <button onClick={toggleTodo} className="p-3 bg-dusk/50 backdrop-blur-md border border-haze/10 rounded-xl hover:bg-haze/20 text-haze hover:text-lamp transition-colors group relative" title="To-Do List">
        <ListTodo size={20} />
      </button>
    </div>
  );
}
