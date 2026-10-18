import React from 'react';
import { TaskStatus, TaskPriority } from '../../types';

interface BadgeProps {
  type: 'status' | 'priority' | 'role';
  value: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, value, className = '' }) => {
  if (type === 'status') {
    const statusMap: Record<TaskStatus, { bg: string; text: string; label: string; dot: string }> = {
      backlog: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Backlog', dot: 'bg-slate-400' },
      todo: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'To Do', dot: 'bg-gray-400' },
      in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'In Progress', dot: 'bg-blue-500' },
      in_review: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'In Review', dot: 'bg-purple-500' },
      blocked: { bg: 'bg-red-50', text: 'text-red-700', label: 'Blocked', dot: 'bg-red-500' },
      completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Completed', dot: 'bg-emerald-500' },
    };

    const config = statusMap[value as TaskStatus] || {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      label: value,
      dot: 'bg-slate-400',
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent ${config.bg} ${config.text} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  }

  if (type === 'priority') {
    const priorityMap: Record<TaskPriority, { bg: string; text: string; label: string; dot: string }> = {
      low: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Low', dot: 'bg-slate-400' },
      medium: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Medium', dot: 'bg-blue-500' },
      high: { bg: 'bg-amber-50', text: 'text-amber-800', label: 'High', dot: 'bg-amber-500' },
      urgent: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Urgent', dot: 'bg-rose-600' },
    };

    const config = priorityMap[value as TaskPriority] || {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      label: value,
      dot: 'bg-slate-400',
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold ${config.bg} ${config.text} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  }

  // Role
  const isAdmin = value === 'admin';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
        isAdmin ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-slate-100 text-slate-700'
      } ${className}`}
    >
      {value}
    </span>
  );
};
