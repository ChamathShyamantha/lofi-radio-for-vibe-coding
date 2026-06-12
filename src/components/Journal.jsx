import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { X } from 'lucide-react';

export default function Journal({ onClose }) {
  const [text, setText] = useState(() => localStorage.getItem('drift_journal') || '');
  const clickSynth = useRef(null);

  useEffect(() => {
    localStorage.setItem('drift_journal', text);
  }, [text]);

  const handleKeyDown = () => {
    if (!clickSynth.current) {
      clickSynth.current = new Tone.MembraneSynth({
        pitchDecay: 0.01,
        octaves: 1.5,
        oscillator: { type: "sine" },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
      }).toDestination();
      clickSynth.current.volume.value = -15;
    }
    
    // Play a mechanical clack
    clickSynth.current.triggerAttackRelease("C2", "32n");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-3xl flex flex-col items-center justify-center pointer-events-auto"
    >
      <button onClick={onClose} className="absolute top-8 right-8 text-haze hover:text-lamp transition-colors">
        <X size={32} />
      </button>
      
      <div className="w-full max-w-4xl h-[80vh] flex flex-col">
        <h2 className="font-serif italic text-3xl text-lamp mb-8 text-center opacity-50">Distraction-Free Journal</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          className="flex-1 w-full bg-transparent outline-none text-haze font-mono text-xl resize-none leading-relaxed custom-scrollbar p-8 border border-haze/10 rounded-2xl focus:border-lamp/30 transition-colors shadow-2xl"
          placeholder="Start typing... (clack clack)"
        />
      </div>
    </motion.div>
  );
}
