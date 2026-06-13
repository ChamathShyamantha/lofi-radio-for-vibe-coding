import AtmosphereLayer from './components/AtmosphereLayer';
import PhysicsCanvas from './components/PhysicsCanvas';
import Player from './components/Player';
import Terminal from './components/Terminal';
import AmbientMixer from './components/AmbientMixer';
import Toolbar from './components/Toolbar';
import PomodoroUI from './components/PomodoroUI';
import StickyNotes from './components/StickyNotes';
import TodoList from './components/TodoList';
import Journal from './components/Journal';
import { useRadio } from './hooks/useRadio';
import { useCommands } from './hooks/useCommands';
import { useToneAmbient } from './hooks/useToneAmbient';
import { useShortcuts } from './hooks/useShortcuts';
import { useClock } from './hooks/useClock';
import { useTimer } from './hooks/useTimer';
import { useTheme } from './hooks/useTheme';
import { useWeatherSync } from './hooks/useWeatherSync';
import { useMidi } from './hooks/useMidi';
import { motion } from 'motion/react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

export const ydoc = new Y.Doc();
export const provider = new WebrtcProvider('drift-fm-global-room', ydoc);
import { useState, useEffect } from 'react';

function App() {
  const radioState = useRadio();
  const ambientState = useToneAmbient();
  const { timeString, greeting } = useClock();
  const timerState = useTimer();
  const themeState = useTheme();
  
  const [showNotes, setShowNotes] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showTodo, setShowTodo] = useState(() => localStorage.getItem('drift_todo_ui') === 'true');
  
  useWeatherSync(ambientState, themeState);
  useMidi();

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

  const commandState = useCommands({
    radioState,
    ambientState,
    timerState,
    themeState,
    setShowSticky,
    setShowTimerUI,
    setShowJournal
  });

  useEffect(() => { localStorage.setItem('drift_sticky', showSticky); }, [showSticky]);
  useEffect(() => { localStorage.setItem('drift_timer_ui', showTimerUI); }, [showTimerUI]);
  useEffect(() => { localStorage.setItem('drift_todo_ui', showTodo); }, [showTodo]);
  
  const { parseCommand } = useCommands({ radioState, ambientState, timerState, themeState, setShowSticky, setShowTimerUI });
  useShortcuts({ radioState });

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
    <div className={`relative w-full h-screen overflow-hidden ${themeState.theme} transition-colors duration-1000`}>
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

      <AtmosphereLayer />
      <PhysicsCanvas getAudioData={radioState.getAudioData} isPlaying={radioState.isPlaying} />

      <Toolbar 
        radioState={radioState} 
        themeState={themeState} 
        toggleSticky={() => setShowSticky(prev => !prev)} 
        toggleTimer={() => setShowTimerUI(prev => !prev)}
        toggleTodo={() => setShowTodo(prev => !prev)}
      />
      
      {/* Ambient Mixer Container */}
      <div className="absolute inset-y-0 right-8 z-20 pointer-events-none flex items-center">
        <motion.div drag dragMomentum={false} className="pointer-events-auto cursor-grab active:cursor-grabbing">
          <AmbientMixer ambientState={ambientState} />
        </motion.div>
      </div>
      
      {/* Top right Clock */}
      <div className="absolute top-8 right-8 z-20 pointer-events-none text-right flex flex-col gap-4">
        <div>
          <h2 className="font-serif text-3xl text-lamp">{timeString}</h2>
          <p className="font-mono text-xs text-phosphor">{greeting}</p>
        </div>
      </div>

      {/* Popout Windows */}
      {showTimerUI && (
        <div className="absolute top-24 right-8 z-30 pointer-events-none">
          <PomodoroUI timerState={timerState} onClose={() => setShowTimerUI(false)} />
        </div>
      )}

      {showSticky && (
        <div className="absolute top-24 left-8 z-30 pointer-events-none">
          <StickyNotes onClose={() => setShowSticky(false)} />
        </div>
      )}

      {showTodo && (
        <div className="absolute top-24 left-80 z-30 pointer-events-none">
          <TodoList onClose={() => setShowTodo(false)} />
        </div>
      )}
      
      {/* Container for UI */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full pointer-events-none pb-40">
        <h1 className="font-serif italic text-6xl text-lamp drop-shadow-lg mb-8 pointer-events-none select-none">Drift FM</h1>
        
        <motion.div drag dragMomentum={false} className="pointer-events-auto cursor-grab active:cursor-grabbing">
          <Terminal onCommand={parseCommand} />
        </motion.div>
      </div>

      {/* Player Container */}
      <div className="absolute inset-x-0 bottom-8 z-20 pointer-events-none flex justify-center">
        <motion.div drag dragMomentum={false} className="pointer-events-auto cursor-grab active:cursor-grabbing">
          <Player {...radioState} />
        </motion.div>
      </div>
    </div>
  );
}

export default App;
