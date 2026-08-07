import React from 'react';
import { ClipboardList, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Task } from '../../types';

interface TasksViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TasksView: React.FC<TasksViewProps> = ({ tasks, setTasks }) => {
  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'completed' ? 'todo' : 'completed' } : t
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-[#5B8CFF]" /> Operations & Staff Task Board
        </h1>
        <p className="text-xs text-white/50 mt-1">
          Assign tasks to instructors, staff, and accountants for daily airport pickups, equipment prep, and wire verifications.
        </p>
      </div>

      <div className="bg-[#16161F] border border-white/10 rounded-2xl p-6 space-y-3">
        {tasks.map((t) => (
          <div
            key={t.id}
            onClick={() => toggleTaskStatus(t.id)}
            className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
              t.status === 'completed'
                ? 'bg-[#111118]/60 border-white/5 opacity-60'
                : 'bg-[#111118] border-white/10 hover:border-[#5B8CFF]/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  t.status === 'completed' ? 'bg-[#34D399] border-[#34D399] text-black' : 'border-white/30'
                }`}
              >
                {t.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
              </button>
              <div>
                <p className={`text-xs font-bold text-white ${t.status === 'completed' ? 'line-through text-white/50' : ''}`}>
                  {t.title}
                </p>
                <p className="text-[10px] text-white/50">
                  Assignee: {t.assignee} ({t.role}) • Camp: {t.campName}
                </p>
              </div>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                t.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/70'
              }`}
            >
              {t.priority} priority
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
