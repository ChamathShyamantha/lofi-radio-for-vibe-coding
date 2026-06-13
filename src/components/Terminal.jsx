import { useState, useEffect, useRef } from 'react';
import { SNIPPETS, highlightText } from '../data/codeSnippets';

let audioCtx = null;

function playKeySound() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const t = audioCtx.currentTime;

    // 1. Switch stem hitting housing (High frequency snap)
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(800 + Math.random() * 100, t);
    osc1.frequency.exponentialRampToValueAtTime(200, t + 0.015);

    const gain1 = audioCtx.createGain();
    gain1.gain.setValueAtTime(0.2, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
    
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);

    // 2. Keyboard plate resonance (Deep, creamy thock)
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(110 + Math.random() * 10, t);
    osc2.frequency.exponentialRampToValueAtTime(40, t + 0.05);

    const gain2 = audioCtx.createGain();
    gain2.gain.setValueAtTime(0.6, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.02);
    osc2.stop(t + 0.06);
  } catch (e) {
    // Ignore audio errors
  }
}

export default function Terminal({ onCommand }) {
  const [mode, setMode] = useState('idle'); // 'idle' | 'input'
  const [displayText, setDisplayText] = useState('');
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [log, setLog] = useState([]);
  
  const inputRef = useRef(null);
  const typeTimeoutRef = useRef(null);

  // Typewriter effect
  useEffect(() => {
    if (mode !== 'idle') return;

    let isTyping = true;
    let charIndex = 0;
    const currentSnippet = SNIPPETS[snippetIndex];

    const typeChar = () => {
      if (charIndex <= currentSnippet.length) {
        setDisplayText(currentSnippet.slice(0, charIndex));
        charIndex++;
        typeTimeoutRef.current = setTimeout(typeChar, 80 + Math.random() * 50);
      } else {
        isTyping = false;
        typeTimeoutRef.current = setTimeout(() => {
          setSnippetIndex((prev) => (prev + 1) % SNIPPETS.length);
        }, 3000); // pause before next snippet
      }
    };

    typeTimeoutRef.current = setTimeout(typeChar, 1000);

    return () => clearTimeout(typeTimeoutRef.current);
  }, [snippetIndex, mode]);

  const handleContainerClick = () => {
    if (mode === 'idle') {
      clearTimeout(typeTimeoutRef.current);
      setMode('input');
    }
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const handleKeyDown = (e) => {
    // Play mechanical thock on key press
    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
      playKeySound();
    }

    if (e.key === 'Enter') {
      if (inputValue.trim()) {
        const response = onCommand(inputValue);
        setLog([...log, { cmd: inputValue, res: response }]);
        setInputValue('');
      }
    } else if (e.key === 'Escape') {
      setMode('idle');
      setInputValue('');
      setSnippetIndex(0);
    }
  };

  return (
    <div 
      className="relative z-20 w-[500px] max-w-[calc(100vw-80px)] md:max-w-full bg-ink/80 backdrop-blur-sm border border-haze/20 rounded-lg shadow-2xl overflow-hidden cursor-text pointer-events-auto group transition-all"
      onClick={handleContainerClick}
    >
      {/* CRT Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 z-10"></div>
      
      {/* Header */}
      <div className="h-8 bg-dusk flex items-center px-4 gap-2 border-b border-haze/10 relative z-20">
        <div className="w-3 h-3 rounded-full bg-ember/80"></div>
        <div className="w-3 h-3 rounded-full bg-lamp/80"></div>
        <div className="w-3 h-3 rounded-full bg-phosphor/80"></div>
        <div className="ml-auto text-[10px] text-haze/50 font-mono">bash</div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 md:p-6 h-[200px] md:h-[300px] font-mono text-[10px] md:text-sm overflow-y-auto relative z-20 flex flex-col justify-end">
        {mode === 'idle' ? (
          <div className="text-phosphor/90 drop-shadow-[0_0_8px_rgba(159,232,141,0.3)]">
            <span dangerouslySetInnerHTML={highlightText(displayText)} />
            <span className="animate-pulse">_</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {log.length === 0 && (
              <div className="text-haze/80 mb-2 leading-relaxed">
                Welcome to <span className="text-lamp">VibeOS v1.0</span><br/>
                Type <span className="text-phosphor">'help'</span> to see a list of available commands.<br/>
                <span className="opacity-50">-------------------------------------------</span>
              </div>
            )}
            {log.map((entry, i) => (
              <div key={i} className="flex flex-col">
                <div className="text-phosphor"><span className="text-lamp mr-2">{'>'}</span>{entry.cmd}</div>
                {entry.res && <div className="text-haze opacity-80 pl-4">{entry.res}</div>}
              </div>
            ))}
            <div className="flex items-center text-phosphor mt-2">
              <span className="text-lamp mr-2">{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => { if (!inputValue) setMode('idle'); }}
                className="bg-transparent border-none outline-none flex-1 text-phosphor placeholder-haze/30"
                placeholder="try typing 'rain' or 'help'..."
                spellCheck="false"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
