import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { ydoc } from '../App';

export default function StickyNotes({ onClose }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const yTasks = ydoc.getArray('global-tasks');
    const updateTasks = () => setTasks(yTasks.toArray());
    
    yTasks.observe(updateTasks);
    updateTasks();
    
    return () => yTasks.unobserve(updateTasks);
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const yTasks = ydoc.getArray('global-tasks');
    yTasks.push([{ id: Date.now().toString(), text: newTask.trim(), done: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    const yTasks = ydoc.getArray('global-tasks');
    const arr = yTasks.toArray();
    const index = arr.findIndex(t => t.id === id);
    if (index !== -1) {
      const task = arr[index];
      yTasks.delete(index, 1);
      yTasks.insert(index, [{ ...task, done: !task.done }]);
    }
  };

  const removeTask = (id) => {
    const yTasks = ydoc.getArray('global-tasks');
    const index = yTasks.toArray().findIndex(t => t.id === id);
    if (index !== -1) yTasks.delete(index, 1);
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      className="absolute top-24 right-8 w-64 bg-dusk/40 backdrop-blur-md rounded-xl border border-haze/10 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing z-40"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="bg-ink/50 p-3 flex justify-between items-center border-b border-haze/10">
        <h3 className="text-lamp font-serif italic flex items-center gap-2"><Globe size={14} /> Global Notes</h3>
        <button onClick={onClose} className="hover:text-black transition-colors"><X size={16} /></button>
      </div>

      <ul className="flex flex-col gap-2 p-4 max-h-[300px] overflow-y-auto" onPointerDown={e => e.stopPropagation()}>
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
