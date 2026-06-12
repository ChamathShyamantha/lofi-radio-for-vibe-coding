import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Plus, X, Check } from 'lucide-react';

export default function StickyNotes({ onClose }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('drift_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('drift_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <motion.div drag dragMomentum={false} className="pointer-events-auto w-64 bg-[#fef08a] text-[#854d0e] p-4 rounded-md shadow-[4px_4px_15px_rgba(0,0,0,0.2)] border border-[#fde047] cursor-grab active:cursor-grabbing font-sans">
      <div className="flex justify-between items-center mb-4 border-b border-[#fde047] pb-2" onPointerDown={e => e.stopPropagation()}>
        <h3 className="font-serif font-bold text-lg">To-Do</h3>
        <button onClick={onClose} className="hover:text-black transition-colors"><X size={16} /></button>
      </div>

      <ul className="flex flex-col gap-2 mb-4 max-h-[300px] overflow-y-auto" onPointerDown={e => e.stopPropagation()}>
        {tasks.map(t => (
          <li key={t.id} className="flex items-start gap-2 group">
            <button onClick={() => toggleTask(t.id)} className={`mt-1 min-w-4 w-4 h-4 rounded border flex items-center justify-center transition-colors ${t.done ? 'bg-[#854d0e] border-[#854d0e] text-[#fef08a]' : 'border-[#854d0e]'}`}>
              {t.done && <Check size={12} />}
            </button>
            <span className={`flex-1 text-sm ${t.done ? 'line-through opacity-60' : ''} break-words`}>{t.text}</span>
            <button onClick={() => removeTask(t.id)} className="opacity-0 group-hover:opacity-100 hover:text-black transition-opacity"><X size={14} /></button>
          </li>
        ))}
        {tasks.length === 0 && <p className="text-xs opacity-60 italic text-center py-4">No active tasks. Take a breath.</p>}
      </ul>

      <form onSubmit={addTask} onPointerDown={e => e.stopPropagation()} className="flex gap-2">
        <input 
          type="text" 
          value={newTask} 
          onChange={e => setNewTask(e.target.value)}
          placeholder="New task..."
          className="w-full bg-transparent border-b border-[#854d0e]/30 focus:border-[#854d0e] outline-none text-sm placeholder:text-[#854d0e]/50"
        />
        <button type="submit" className="hover:text-black"><Plus size={18} /></button>
      </form>
    </motion.div>
  );
}
