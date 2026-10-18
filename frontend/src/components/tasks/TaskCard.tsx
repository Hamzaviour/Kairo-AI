import React from 'react';
import { 
  CheckSquare, ExternalLink, Image as ImageIcon, 
  Calendar, MoreVertical, Copy, Trash2, ArrowRight
} from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { Badge } from '../common/Badge';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onDuplicate?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  onStatusChange,
  onDuplicate,
  onDelete,
}) => {
  const completedSubtasks = task.subtasks?.filter((s) => s.is_completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-slate-200/90 hover:border-indigo-300 p-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col gap-2.5"
    >
      {/* Top row: Priority & External URL */}
      <div className="flex items-center justify-between gap-2">
        <Badge type="priority" value={task.priority} />

        <div className="flex items-center gap-1.5">
          {task.image_url && (
            <span title="Has hero image" className="text-slate-400 hover:text-slate-600">
              <ImageIcon className="w-3.5 h-3.5" />
            </span>
          )}
          {task.url && (
            <a
              href={task.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-indigo-500 hover:text-indigo-700 p-0.5 rounded transition-colors"
              title="Open linked URL"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Task Image thumbnail preview if present */}
      {task.image_url && (
        <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/60">
          <img
            src={task.image_url}
            alt={task.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Task Heading */}
      <h3 className="font-semibold text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
        {task.title}
      </h3>

      {/* Task Description snippet */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Checklist Progress if subtasks exist */}
      {totalSubtasks > 0 && (
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all"
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            {completedSubtasks}/{totalSubtasks}
          </span>
        </div>
      )}

      {/* Bottom meta row */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100/80">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] flex items-center justify-center border border-indigo-200">
            {task.assignee?.name?.slice(0, 1) || 'U'}
          </div>
          <span className="text-[11px] text-slate-600 truncate max-w-[90px]">
            {task.assignee?.name || 'Unassigned'}
          </span>
        </div>

        {task.due_date && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>
    </div>
  );
};
