import AtmosphereLayer from './components/AtmosphereLayer';

function App() {
  return (
    <div className="relative w-full h-screen bg-ink text-haze font-sans overflow-hidden">
      <AtmosphereLayer />
      
      {/* Container for UI */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
        <h1 className="font-serif italic text-4xl text-lamp">Drift FM</h1>
        <p className="font-mono mt-2 text-sm text-phosphor">Initializing...</p>
      </div>
    </div>
  );
}

export default App;
