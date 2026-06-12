import { useState, useEffect, useRef } from 'react';
import { SNIPPETS, highlightText } from '../data/codeSnippets';

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
      className="relative z-20 w-[500px] max-w-[90vw] bg-ink/80 backdrop-blur-sm border border-haze/20 rounded-lg shadow-2xl overflow-hidden cursor-text pointer-events-auto group transition-all"
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
      <div className="p-6 h-[300px] font-mono text-sm overflow-y-auto relative z-20 flex flex-col justify-end">
        {mode === 'idle' ? (
          <div className="text-phosphor/90 drop-shadow-[0_0_8px_rgba(159,232,141,0.3)]">
            <span dangerouslySetInnerHTML={highlightText(displayText)} />
            <span className="animate-pulse">_</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
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
                placeholder="type 'help'..."
                spellCheck="false"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
