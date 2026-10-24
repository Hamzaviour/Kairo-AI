import React from 'react';
import { TaskStatus, TaskPriority } from '../../types';

interface BadgeProps {
  type: 'status' | 'priority' | 'role';
  value: string;
  className?: string;
}

// State colours keep fixed meanings; saffron is reserved for the brand moment, so "High" is orange
const STATUS: Record<TaskStatus, { tone: string; dot: string; label: string }> = {
  backlog: { tone: 'bg-slate-100 text-slate-600', dot: 'bg-slate-300', label: 'Backlog' },
  todo: { tone: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400', label: 'To Do' },
  in_progress: { tone: 'bg-sky-50 text-sky-800', dot: 'bg-sky-500', label: 'In Progress' },
  in_review: { tone: 'bg-violet-50 text-violet-700', dot: 'bg-violet-500', label: 'In Review' },
  blocked: { tone: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500', label: 'Blocked' },
  completed: { tone: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', label: 'Completed' },
};

const PRIORITY: Record<TaskPriority, { tone: string; bars: number; label: string }> = {
  low: { tone: 'text-slate-500', bars: 1, label: 'Low' },
  medium: { tone: 'text-sky-700', bars: 2, label: 'Medium' },
  high: { tone: 'text-orange-700', bars: 3, label: 'High' },
  urgent: { tone: 'text-rose-700', bars: 4, label: 'Urgent' },
};

export const Badge: React.FC<BadgeProps> = ({ type, value, className = '' }) => {
  if (type === 'status') {
    const config = STATUS[value as TaskStatus] || { tone: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400', label: value };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap ${config.tone} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
        {config.label}
      </span>
    );
  }

  if (type === 'priority') {
    const config = PRIORITY[value as TaskPriority] || { tone: 'text-slate-600', bars: 0, label: value };
    // Signal-strength bars: priority reads at a glance without another coloured pill
    return (
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold whitespace-nowrap ${config.tone} ${className}`}>
        <span className="flex items-end gap-[2px] h-2.5" aria-hidden="true">
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className={`w-[3px] rounded-sm ${n <= config.bars ? 'bg-current' : 'bg-slate-200'}`}
              style={{ height: `${n * 25}%` }}
            />
          ))}
        </span>
        {config.label}
      </span>
    );
  }

  const isAdmin = value === 'admin';
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
        isAdmin ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
      } ${className}`}
    >
      {isAdmin && <span className="w-1 h-1 rounded-full bg-brand-400" aria-hidden="true" />}
      {value}
    </span>
  );
};
