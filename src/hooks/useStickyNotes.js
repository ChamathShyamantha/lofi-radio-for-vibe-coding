import { useState, useEffect, useCallback } from 'react';

const COLORS = ['#FFB454', '#E8606B', '#9FE88D', '#c77dff', '#00f5d4', '#f4a261'];

export function useStickyNotes() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('drift_sticky_notes_v2') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('drift_sticky_notes_v2', JSON.stringify(notes));
  }, [notes]);

  const addNote = useCallback((text) => {
    if (!text.trim()) return;
    setNotes(prev => [...prev, {
      id: Date.now().toString(),
      text: text.trim(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pinned: false,
      position: null,
      rotate: (Math.random() - 0.5) * 6,
    }]);
  }, []);

  const removeNote = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const pinNote = useCallback((id) => {
    const x = Math.floor(100 + Math.random() * (window.innerWidth - 300));
    const y = Math.floor(80 + Math.random() * (window.innerHeight - 250));
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, pinned: true, position: n.position || { x, y } } : n
    ));
  }, []);

  const unpinNote = useCallback((id) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, pinned: false } : n
    ));
  }, []);

  const updatePosition = useCallback((id, pos) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, position: pos } : n
    ));
  }, []);

  return { notes, addNote, removeNote, pinNote, unpinNote, updatePosition };
}
