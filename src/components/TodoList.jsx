import { motion, useDragControls } from 'motion/react';
import { useState, useEffect } from 'react';
import { Plus, X, Check, ListTodo, Trash2 } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

export default function TodoList({ onClose }) {
  const controls = useDragControls();
  const isMobile = useIsMobile();
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('drift_todo_list') || '[]');
    } catch { return []; }
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('drift_todo_list', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), text: newTask.trim(), done: false }]);
    setNewTask('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTask(e);
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const clearDone = () => {
    setTasks(prev => prev.filter(t => !t.done));
  };

  const pending = tasks.filter(t => !t.done).length;
  const done = tasks.filter(t => t.done).length;

  return (
    <motion.div 
      drag={!isMobile}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      className="absolute top-32 md:top-24 right-4 md:right-80 w-[calc(100vw-32px)] md:w-72 max-w-sm bg-dusk/40 backdrop-blur-md rounded-xl border border-haze/10 shadow-2xl overflow-hidden z-40"
    >
      <div 
        onPointerDown={(e) => controls.start(e)}
        className="bg-ink/50 p-3 flex justify-between items-center border-b border-haze/10 cursor-grab active:cursor-grabbing"
      >
        <h3 className="text-lamp font-serif italic flex items-center gap-2"><ListTodo size={14} /> To-Do</h3>
        <div className="flex items-center gap-2">
          {done > 0 && (
            <button onClick={clearDone} className="text-haze/50 hover:text-ember transition-colors" title="Clear completed">
              <Trash2 size={14} />
            </button>
          )}
          <button onClick={onClose} className="text-haze hover:text-lamp transition-colors"><X size={16} /></button>
        </div>
      </div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <div className="px-3 pt-3">
          <div className="flex justify-between text-xs text-haze/50 mb-1">
            <span>{pending} remaining</span>
            <span>{done}/{tasks.length} done</span>
          </div>
          <div className="h-1 bg-ink/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-phosphor/70 rounded-full transition-all duration-500" 
              style={{ width: `${tasks.length > 0 ? (done / tasks.length) * 100 : 0}%` }} 
            />
          </div>
        </div>
      )}

      <ul className="flex flex-col gap-1 p-3 max-h-[280px] overflow-y-auto">
        {tasks.map(t => (
          <li key={t.id} className="flex items-start gap-2 group py-1">
            <button 
              onClick={() => toggleTask(t.id)} 
              className={`mt-0.5 min-w-5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                t.done 
                  ? 'bg-phosphor/80 border-phosphor text-ink' 
                  : 'border-haze/30 hover:border-lamp/60'
              }`}
            >
              {t.done && <Check size={12} strokeWidth={3} />}
            </button>
            <span className={`flex-1 text-sm transition-all duration-200 ${t.done ? 'line-through text-haze/40' : 'text-haze'} break-words`}>{t.text}</span>
            <button onClick={() => removeTask(t.id)} className="opacity-0 group-hover:opacity-100 text-haze/40 hover:text-ember transition-all mt-0.5"><X size={14} /></button>
          </li>
        ))}
        {tasks.length === 0 && (
          <p className="text-xs text-haze/50 italic text-center py-6">All clear. What's on your mind?</p>
        )}
      </ul>

      <div className="flex gap-2 p-3 border-t border-haze/10">
        <input 
          type="text" 
          value={newTask} 
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="flex-1 bg-transparent border-b border-haze/20 focus:border-lamp outline-none text-sm text-haze placeholder:text-haze/30 py-1"
        />
        <button onClick={addTask} className="text-haze hover:text-lamp transition-colors"><Plus size={18} /></button>
      </div>
    </motion.div>
  );
}
