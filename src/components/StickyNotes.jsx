import { motion, useDragControls } from 'motion/react';
import { useState, useEffect } from 'react';
import { Plus, X, Check, StickyNote } from 'lucide-react';

export default function StickyNotes({ onClose }) {
  const controls = useDragControls();
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('drift_sticky_notes') || '[]');
    } catch { return []; }
  });
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    localStorage.setItem('drift_sticky_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newNote.trim()) return;
    setNotes(prev => [...prev, { id: Date.now().toString(), text: newNote.trim(), color: COLORS[Math.floor(Math.random() * COLORS.length)] }]);
    setNewNote('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addNote(e);
  };

  const removeNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <motion.div 
      drag
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      className="absolute top-24 left-8 w-72 bg-dusk/40 backdrop-blur-md rounded-xl border border-haze/10 shadow-2xl overflow-hidden z-40"
    >
      <div 
        onPointerDown={(e) => controls.start(e)}
        className="bg-ink/50 p-3 flex justify-between items-center border-b border-haze/10 cursor-grab active:cursor-grabbing"
      >
        <h3 className="text-lamp font-serif italic flex items-center gap-2"><StickyNote size={14} /> Sticky Notes</h3>
        <button onClick={onClose} className="text-haze hover:text-lamp transition-colors"><X size={16} /></button>
      </div>

      <div className="flex flex-col gap-2 p-3 max-h-[300px] overflow-y-auto">
        {notes.map(n => (
          <div key={n.id} className="relative group rounded-lg p-3" style={{ backgroundColor: n.color + '20', borderLeft: `3px solid ${n.color}` }}>
            <p className="text-sm text-haze break-words pr-5">{n.text}</p>
            <button onClick={() => removeNote(n.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-haze hover:text-lamp transition-opacity"><X size={14} /></button>
          </div>
        ))}
        {notes.length === 0 && <p className="text-xs text-haze/50 italic text-center py-4">No notes yet. Jot something down.</p>}
      </div>

      <div className="flex gap-2 p-3 border-t border-haze/10">
        <input 
          type="text" 
          value={newNote} 
          onChange={e => setNewNote(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New note..."
          className="flex-1 bg-transparent border-b border-haze/20 focus:border-lamp outline-none text-sm text-haze placeholder:text-haze/30 py-1"
        />
        <button onClick={addNote} className="text-haze hover:text-lamp transition-colors"><Plus size={18} /></button>
      </div>
    </motion.div>
  );
}

const COLORS = ['#FFB454', '#E8606B', '#9FE88D', '#c77dff', '#00f5d4', '#f4a261'];
