import AtmosphereLayer from './components/AtmosphereLayer';
import PhysicsCanvas from './components/PhysicsCanvas';
import Player from './components/Player';
import Terminal from './components/Terminal';
import AmbientMixer from './components/AmbientMixer';
import Toolbar from './components/Toolbar';
import PomodoroUI from './components/PomodoroUI';
import StickyNotes from './components/StickyNotes';
import { useRadio } from './hooks/useRadio';
import { useCommands } from './hooks/useCommands';
import { useAmbient } from './hooks/useAmbient';
import { useShortcuts } from './hooks/useShortcuts';
import { useClock } from './hooks/useClock';
import { useTimer } from './hooks/useTimer';
import { useTheme } from './hooks/useTheme';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

function App() {
  const radioState = useRadio();
  const ambientState = useAmbient();
  const { timeString, greeting } = useClock();
  const timerState = useTimer();
  const themeState = useTheme();

  const [showSticky, setShowSticky] = useState(() => localStorage.getItem('drift_sticky') === 'true');
  const [showTimerUI, setShowTimerUI] = useState(() => localStorage.getItem('drift_timer_ui') === 'true');

  useEffect(() => { localStorage.setItem('drift_sticky', showSticky); }, [showSticky]);
  useEffect(() => { localStorage.setItem('drift_timer_ui', showTimerUI); }, [showTimerUI]);
  
  const { parseCommand } = useCommands({ radioState, ambientState, timerState, themeState, setShowSticky, setShowTimerUI });
  useShortcuts({ radioState });

  return (
    <div className="relative w-full h-screen bg-ink text-haze font-sans overflow-hidden">
      {/* CRT Effects */}
      <div className="absolute inset-0 crt-overlay opacity-40 pointer-events-none"></div>
      <div className="absolute inset-0 crt-vignette"></div>

      <AtmosphereLayer />
      <PhysicsCanvas getAudioData={radioState.getAudioData} />

      <Toolbar 
        radioState={radioState} 
        themeState={themeState} 
        toggleSticky={() => setShowSticky(prev => !prev)} 
        toggleTimer={() => setShowTimerUI(prev => !prev)} 
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
