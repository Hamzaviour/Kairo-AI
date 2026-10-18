import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Plus, MoreHorizontal } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';

interface TaskKanbanViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onQuickCreateWithStatus: (status: TaskStatus) => void;
}

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  badgeBg: string;
  badgeText: string;
}

const COLUMNS: ColumnConfig[] = [
  { id: 'backlog', title: 'Backlog', badgeBg: 'bg-slate-100', badgeText: 'text-slate-700' },
  { id: 'todo', title: 'To Do', badgeBg: 'bg-gray-100', badgeText: 'text-gray-800' },
  { id: 'in_progress', title: 'In Progress', badgeBg: 'bg-blue-100', badgeText: 'text-blue-800' },
  { id: 'in_review', title: 'In Review', badgeBg: 'bg-purple-100', badgeText: 'text-purple-800' },
  { id: 'blocked', title: 'Blocked', badgeBg: 'bg-red-100', badgeText: 'text-red-800' },
  { id: 'completed', title: 'Completed', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-800' },
];

export const TaskKanbanView: React.FC<TaskKanbanViewProps> = ({
  tasks,
  onSelectTask,
  onStatusChange,
  onQuickCreateWithStatus,
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      onStatusChange(taskId, targetStatus);
      if (targetStatus === 'completed') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
    }
    setDraggedTaskId(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start min-h-[calc(100vh-180px)] snap-x snap-mandatory sm:snap-none">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="w-[85vw] sm:w-80 snap-start shrink-0 bg-slate-100/70 border border-slate-200/80 rounded-xl p-3 flex flex-col max-h-[calc(100vh-170px)] transition-colors hover:bg-slate-100"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-slate-800 tracking-tight">
                  {col.title}
                </span>
                <span
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${col.badgeBg} ${col.badgeText}`}
                >
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => onQuickCreateWithStatus(col.id)}
                className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                title={`Add task to ${col.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task Cards Stack */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {columnTasks.length === 0 ? (
                <div className="h-28 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 text-xs text-center px-4">
                  <span>Drop task here</span>
                  <button
                    onClick={() => onQuickCreateWithStatus(col.id)}
                    className="text-[11px] text-indigo-600 hover:underline mt-1"
                  >
                    + Add task
                  </button>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <TaskCard
                      task={task}
                      onClick={() => onSelectTask(task)}
                      onStatusChange={onStatusChange}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
