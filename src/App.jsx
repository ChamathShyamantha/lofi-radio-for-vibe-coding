import AtmosphereLayer from './components/AtmosphereLayer';
import PhysicsCanvas from './components/PhysicsCanvas';
import Player from './components/Player';
import Terminal from './components/Terminal';
import AmbientMixer from './components/AmbientMixer';
import { useRadio } from './hooks/useRadio';
import { useCommands } from './hooks/useCommands';
import { useAmbient } from './hooks/useAmbient';
import { useShortcuts } from './hooks/useShortcuts';
import { useClock } from './hooks/useClock';
import { useTimer } from './hooks/useTimer';

function App() {
  const radioState = useRadio();
  const ambientState = useAmbient();
  const { timeString, greeting } = useClock();
  const timerState = useTimer();
  
  const { parseCommand } = useCommands({ radioState, ambientState, timerState });
  useShortcuts({ radioState });

  return (
    <div className="relative w-full h-screen bg-ink text-haze font-sans overflow-hidden">
      <AtmosphereLayer />
      <PhysicsCanvas getAudioData={radioState.getAudioData} />
      
      <AmbientMixer ambientState={ambientState} />
      
      {/* Top right Clock & Timer */}
      <div className="absolute top-8 right-8 z-20 pointer-events-none text-right flex flex-col gap-4">
        <div>
          <h2 className="font-serif text-3xl text-lamp">{timeString}</h2>
          <p className="font-mono text-xs text-phosphor">{greeting}</p>
        </div>
        {timerState.timeString && (
          <div>
            <h3 className="font-serif text-2xl text-ember">{timerState.timeString}</h3>
            <p className="font-mono text-xs text-haze">focus mode</p>
          </div>
        )}
      </div>
      
      {/* Container for UI */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full pointer-events-none">
        <h1 className="font-serif italic text-6xl text-lamp drop-shadow-lg mb-8 pointer-events-none">Drift FM</h1>
        
        <div className="pointer-events-auto">
          <Terminal onCommand={parseCommand} />
        </div>
      </div>

      <Player {...radioState} />
    </div>
  );
}

export default App;
