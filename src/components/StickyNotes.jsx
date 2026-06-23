import { motion, useDragControls, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Plus, X, Pin, PinOff, StickyNote, GripVertical } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

// ─── Individual floating pinned note ───────────────────────────────
function PinnedNote({ note, onUnpin, onRemove, onUpdatePosition }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: note.rotate || 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 30 }}
      drag
      dragMomentum={false}
      onDragEnd={(e, info) => {
        onUpdatePosition(note.id, {
          x: (note.position?.x || 0) + info.offset.x,
          y: (note.position?.y || 0) + info.offset.y,
        });
      }}
      style={{
        position: 'fixed',
        left: note.position?.x || 200,
        top: note.position?.y || 200,
        zIndex: 50,
        touchAction: 'none',
      }}
      className="group pointer-events-auto"
    >
      <div
        className="w-48 min-h-[100px] rounded-xl shadow-2xl backdrop-blur-md border border-white/10 flex flex-col overflow-hidden cursor-grab active:cursor-grabbing"
        style={{
          background: `linear-gradient(135deg, ${note.color}30, ${note.color}15)`,
          borderTop: `3px solid ${note.color}`,
          boxShadow: `0 8px 32px ${note.color}20, 0 2px 8px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Drag handle + actions */}
        <div className="flex items-center justify-between px-2 pt-1.5 pb-0.5">
          <GripVertical size={12} className="text-haze/30" />
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onUnpin(note.id); }}
              className="p-1 text-haze/60 hover:text-lamp transition-colors"
              title="Unpin — move back to panel"
            >
              <PinOff size={12} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(note.id); }}
              className="p-1 text-haze/60 hover:text-red-400 transition-colors"
              title="Delete note"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* Note content */}
        <div className="px-3 pb-3 pt-1">
          <p className="text-sm text-haze break-words leading-relaxed font-mono">{note.text}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Always-visible pinned notes layer (rendered in App) ───────────
export function PinnedNotesLayer({ notesState }) {
  const { notes, unpinNote, removeNote, updatePosition } = notesState;
  const pinnedNotes = notes.filter(n => n.pinned);

  if (pinnedNotes.length === 0) return null;

  return (
    <AnimatePresence>
      {pinnedNotes.map(note => (
        <PinnedNote
          key={note.id}
          note={note}
          onUnpin={unpinNote}
          onRemove={removeNote}
          onUpdatePosition={updatePosition}
        />
      ))}
    </AnimatePresence>
  );
}

// ─── Sticky Notes Panel (toggled via toolbar) ──────────────────────
export default function StickyNotes({ onClose, notesState }) {
  const controls = useDragControls();
  const isMobile = useIsMobile();
  const { notes, addNote, removeNote, pinNote } = notesState;
  const [newNote, setNewNote] = useState('');

  const unpinnedNotes = notes.filter(n => !n.pinned);
  const pinnedCount = notes.filter(n => n.pinned).length;

  const handleAdd = (e) => {
    if (e?.preventDefault) e.preventDefault();
    addNote(newNote);
    setNewNote('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      drag={!isMobile}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      className="absolute top-32 md:top-24 left-4 md:left-8 w-[calc(100vw-32px)] md:w-72 max-w-sm bg-dusk/40 backdrop-blur-md rounded-xl border border-haze/10 shadow-2xl overflow-hidden z-40"
    >
      <div
        onPointerDown={(e) => controls.start(e)}
        className="bg-ink/50 p-3 flex justify-between items-center border-b border-haze/10 cursor-grab active:cursor-grabbing"
      >
        <h3 className="text-lamp font-serif italic flex items-center gap-2"><StickyNote size={14} /> Sticky Notes</h3>
        <div className="flex items-center gap-1">
          {pinnedCount > 0 && (
            <span className="text-[10px] font-mono text-phosphor/60 mr-1">{pinnedCount} pinned</span>
          )}
          <button onClick={onClose} className="text-haze hover:text-lamp transition-colors"><X size={16} /></button>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3 max-h-[300px] overflow-y-auto">
        {unpinnedNotes.map(n => (
          <div
            key={n.id}
            className="relative group rounded-lg p-3 transition-colors hover:bg-white/5"
            style={{ backgroundColor: n.color + '20', borderLeft: `3px solid ${n.color}` }}
          >
            <p className="text-sm text-haze break-words pr-12">{n.text}</p>
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => pinNote(n.id)}
                className="text-haze hover:text-lamp transition-colors"
                title="Pin to screen — drag anywhere"
              >
                <Pin size={14} />
              </button>
              <button
                onClick={() => removeNote(n.id)}
                className="text-haze hover:text-red-400 transition-colors"
                title="Delete note"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        {unpinnedNotes.length === 0 && pinnedCount === 0 && (
          <p className="text-xs text-haze/50 italic text-center py-4">No notes yet. Jot something down.</p>
        )}
        {unpinnedNotes.length === 0 && pinnedCount > 0 && (
          <p className="text-xs text-haze/50 italic text-center py-4">All notes pinned to screen ✨</p>
        )}
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
        <button onClick={handleAdd} className="text-haze hover:text-lamp transition-colors"><Plus size={18} /></button>
      </div>
    </motion.div>
  );
}
