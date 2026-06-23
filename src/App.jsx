import AtmosphereLayer from './components/AtmosphereLayer';
import PhysicsCanvas from './components/PhysicsCanvas';
import Player from './components/Player';
import Terminal from './components/Terminal';
import AmbientMixer from './components/AmbientMixer';
import Toolbar from './components/Toolbar';
import PomodoroUI from './components/PomodoroUI';
import StickyNotes, { PinnedNotesLayer } from './components/StickyNotes';
import TodoList from './components/TodoList';
import Journal from './components/Journal';
import VibePet from './components/VibePet';
import ShortcutOverlay from './components/ShortcutOverlay';
import { useRadio } from './hooks/useRadio';
import { useCommands } from './hooks/useCommands';
import { useToneAmbient } from './hooks/useToneAmbient';
import { useShortcuts } from './hooks/useShortcuts';
import { useClock } from './hooks/useClock';
import { useTimer } from './hooks/useTimer';
import { useTheme } from './hooks/useTheme';
import { useWeatherSync } from './hooks/useWeatherSync';
import { useSleepTimer } from './hooks/useSleepTimer';
import { useStickyNotes } from './hooks/useStickyNotes';
import { useMidi } from './hooks/useMidi';
import { useNowPlaying } from './hooks/useNowPlaying';
import { motion, AnimatePresence } from 'motion/react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { useIsMobile } from './hooks/useIsMobile';

export const ydoc = new Y.Doc();
export const provider = new WebrtcProvider('drift-fm-global-room', ydoc);
import { useState, useEffect } from 'react';

function App() {
  const radioState = useRadio();
  const ambientState = useToneAmbient();
  const { timeString, greeting } = useClock();
  const timerState = useTimer();
  const themeState = useTheme();
  const sleepTimerState = useSleepTimer(radioState);
  const isMobile = useIsMobile();
  const notesState = useStickyNotes();
  
  const [showNotes, setShowNotes] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showTodo, setShowTodo] = useState(() => localStorage.getItem('drift_todo_ui') === 'true');
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchEnabled, setGlitchEnabled] = useState(() => localStorage.getItem('drift_glitch') !== 'false');
  const [showScenes, setShowScenes] = useState(() => localStorage.getItem('drift_scenes') === 'true');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const nowPlaying = useNowPlaying(radioState.station);

  useWeatherSync(ambientState, themeState);
  useMidi();

  useEffect(() => { localStorage.setItem('drift_glitch', glitchEnabled); }, [glitchEnabled]);
  useEffect(() => { localStorage.setItem('drift_scenes', showScenes); }, [showScenes]);

  // Sync theme when station changes
  useEffect(() => {
    if (radioState.station?.defaultTheme) {
      themeState.setTheme(radioState.station.defaultTheme);
    }
    
    // Trigger intentional retro glitch effect on channel change (if enabled)
    if (glitchEnabled) {
      setIsGlitching(true);
      const timer = setTimeout(() => setIsGlitching(false), 400);
      return () => clearTimeout(timer);
    }
  }, [radioState.station?.id]);

  // Check alarm
  useEffect(() => {
    const interval = setInterval(() => {
      const alarm = localStorage.getItem('drift_alarm');
      if (alarm) {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        if (timeStr === alarm) {
          localStorage.removeItem('drift_alarm');
          themeState.setTheme('dawn');
          radioState.setIsPlaying(true);
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [themeState, radioState]);

  const [showSticky, setShowSticky] = useState(() => localStorage.getItem('drift_sticky') === 'true');
  const [showTimerUI, setShowTimerUI] = useState(() => localStorage.getItem('drift_timer_ui') === 'true');

  const { parseCommand } = useCommands({
    radioState,
    ambientState,
    timerState,
    themeState,
    sleepTimerState,
    setShowSticky,
    setShowTimerUI,
    setShowJournal
  });

  useEffect(() => { localStorage.setItem('drift_sticky', showSticky); }, [showSticky]);
  useEffect(() => { localStorage.setItem('drift_timer_ui', showTimerUI); }, [showTimerUI]);
  useEffect(() => { localStorage.setItem('drift_todo_ui', showTodo); }, [showTodo]);
  
  useShortcuts({ radioState });

  // Shortcut overlay toggle
  useEffect(() => {
    const handleKey = (e) => {
      if (document.activeElement.tagName === 'INPUT') return;
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      } else if (e.key === 'Escape' && showShortcuts) {
        setShowShortcuts(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showShortcuts]);

  const [cursors, setCursors] = useState([]);
  useEffect(() => {
    const handlePointerMove = (e) => {
      provider.awareness.setLocalStateField('cursor', {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    const updateCursors = () => {
      const states = Array.from(provider.awareness.getStates().entries());
      setCursors(states.filter(([id, state]) => id !== provider.awareness.clientID && state.cursor));
    };
    
    window.addEventListener('pointermove', handlePointerMove);
    provider.awareness.on('change', updateCursors);
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      provider.awareness.off('change', updateCursors);
    };
  }, []);

  return (
    <div className={`relative w-full h-[100dvh] overflow-hidden ${themeState.theme} transition-colors duration-1000 ${isGlitching ? 'crt-glitch' : ''}`}>
      {/* CRT Effects */}
      <div className="absolute inset-0 crt-overlay opacity-40 pointer-events-none"></div>
      <div className="absolute inset-0 crt-vignette"></div>

      {showJournal && <Journal onClose={() => setShowJournal(false)} />}
      
      {cursors.map(([id, state]) => (
        <motion.div
          key={id}
          className="fixed w-4 h-4 rounded-full bg-lamp/50 blur-sm pointer-events-none z-[100]"
          animate={{ x: state.cursor.x * window.innerWidth, y: state.cursor.y * window.innerHeight }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        />
      ))}

      <AtmosphereLayer rainVolume={ambientState.volumes.rain || 0} theme={themeState.theme} showScenes={showScenes} />
      <PhysicsCanvas getAudioData={radioState.getAudioData} isPlaying={radioState.isPlaying} />

      {/* Pinned sticky notes — always visible */}
      <PinnedNotesLayer notesState={notesState} />

      <Toolbar 
        radioState={radioState} 
        themeState={themeState} 
        toggleSticky={() => setShowSticky(prev => !prev)} 
        toggleTimer={() => setShowTimerUI(prev => !prev)}
        toggleTodo={() => setShowTodo(prev => !prev)}
        glitchEnabled={glitchEnabled}
        toggleGlitch={() => setGlitchEnabled(prev => !prev)}
        showScenes={showScenes}
        toggleScenes={() => setShowScenes(prev => !prev)}
      />
      
      {/* Ambient Mixer Container */}
      <div className="absolute top-4 right-4 md:inset-y-0 md:right-8 z-20 pointer-events-none flex items-start md:items-center">
        <motion.div drag={!isMobile} dragMomentum={false} className="pointer-events-auto cursor-grab active:cursor-grabbing">
          <AmbientMixer ambientState={ambientState} />
        </motion.div>
      </div>
      
      {/* Top Clock */}
      <div className="absolute top-4 inset-x-0 flex flex-col items-center md:inset-x-auto md:top-8 md:right-8 md:items-end z-20 pointer-events-none gap-1 md:gap-4">
        <div className="text-center md:text-right">
          <h2 className="font-serif text-2xl md:text-3xl text-lamp">{timeString}</h2>
          <p className="font-mono text-[10px] md:text-xs text-phosphor">{greeting}</p>
        </div>
      </div>

      {/* Popout Windows */}
      <AnimatePresence>
        {showTimerUI && <PomodoroUI timerState={timerState} onClose={() => setShowTimerUI(false)} key="timer" />}
        {showSticky && <StickyNotes onClose={() => setShowSticky(false)} notesState={notesState} key="sticky" />}
        {showTodo && <TodoList onClose={() => setShowTodo(false)} key="todo" />}
      </AnimatePresence>
      
      {/* Title */}
      <div className="absolute top-20 md:top-[15%] inset-x-0 z-20 flex flex-col items-center w-full px-12 md:px-0 pointer-events-none">
        <h1 className="font-serif italic text-5xl md:text-6xl text-lamp drop-shadow-lg mb-0 pointer-events-none select-none tracking-tight text-center leading-[0.9] md:leading-normal">
          VibeCode<span className="block md:inline mt-1 md:mt-0"> FM</span>
        </h1>
        <p className="font-mono text-[10px] md:text-xs text-haze/60 mt-2 pointer-events-none select-none text-center">the ultimate environment for vibe coders</p>
      </div>
        
      {/* Terminal */}
      <div className="absolute top-[42%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex justify-center w-[calc(100vw-80px)] md:w-auto">
        <motion.div drag={!isMobile} dragMomentum={false} className="pointer-events-auto cursor-grab active:cursor-grabbing">
          <Terminal onCommand={parseCommand} />
        </motion.div>
      </div>

      {/* Player Container */}
      <div className="absolute inset-x-0 bottom-10 md:bottom-8 z-20 pointer-events-none flex justify-center">
        <motion.div drag={!isMobile} dragMomentum={false} className="pointer-events-auto cursor-grab active:cursor-grabbing">
          <Player {...radioState} nowPlaying={nowPlaying} />
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute inset-x-0 bottom-2 md:inset-x-auto md:left-8 md:bottom-8 z-20 flex flex-row md:flex-col justify-center md:justify-start items-center md:items-start gap-4 md:gap-1 pointer-events-auto scale-75 md:scale-100 origin-bottom md:origin-bottom-left">
        <span className="text-haze/30 text-[10px] md:text-xs font-mono">built by Dr.Psycho</span>
        <a 
          href="https://buymeacoffee.com/drpsycho" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 bg-[#FFDD00]/10 hover:bg-[#FFDD00]/20 border border-[#FFDD00]/20 rounded-lg text-[#FFDD00] font-mono text-xs transition-colors"
        >
          ☕ buy me a coffee
        </a>
      </div>

      <AnimatePresence>
        {showShortcuts && <ShortcutOverlay onClose={() => setShowShortcuts(false)} key="shortcuts" />}
      </AnimatePresence>

      <VibePet />
    </div>
  );
}

export default App;
