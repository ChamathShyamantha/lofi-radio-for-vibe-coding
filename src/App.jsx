import AtmosphereLayer from './components/AtmosphereLayer';
import PhysicsCanvas from './components/PhysicsCanvas';
import Player from './components/Player';
import Terminal from './components/Terminal';
import AmbientMixer from './components/AmbientMixer';
import { useRadio } from './hooks/useRadio';
import { useCommands } from './hooks/useCommands';
import { useAmbient } from './hooks/useAmbient';

function App() {
  const radioState = useRadio();
  const ambientState = useAmbient();
  // Pass both to commands so terminal can control them
  const { parseCommand } = useCommands({ radioState, ambientState });

  return (
    <div className="relative w-full h-screen bg-ink text-haze font-sans overflow-hidden">
      <AtmosphereLayer />
      <PhysicsCanvas getAudioData={radioState.getAudioData} />
      
      <AmbientMixer ambientState={ambientState} />
      
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
