import React, { useState, useEffect } from 'react';
import { Search, Plus, Sparkles, FileSpreadsheet, Kanban, Calendar, Users, X } from 'lucide-react';
import { Task } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onQuickCreate: () => void;
  onOpenAI: () => void;
  onOpenExcel: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tasks,
  onSelectTask,
  onQuickCreate,
  onOpenAI,
  onOpenExcel,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="w-4 h-4 text-slate-400 mr-2.5" />
          <input
            type="text"
            placeholder="Type a command or search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-slate-400 text-slate-800"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-2 border-b border-slate-100 bg-slate-50/50">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-2 py-1">
            Quick Actions
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => {
                onClose();
                onQuickCreate();
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white hover:shadow-2xs transition-all border border-transparent hover:border-slate-200"
            >
              <Plus className="w-3.5 h-3.5 text-brand-700" />
              <span>New Task</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAI();
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-brand-800 hover:bg-white hover:shadow-2xs transition-all border border-transparent hover:border-brand-100"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-700" />
              <span>Ask AI Copilot</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenExcel();
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 hover:bg-white hover:shadow-2xs transition-all border border-transparent hover:border-emerald-100"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excel Export</span>
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-72 overflow-y-auto p-2">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-2 py-1">
            Matching Tasks ({filteredTasks.length})
          </div>
          {filteredTasks.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No tasks matching "{query}"
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredTasks.slice(0, 8).map((task) => (
                <button
                  key={task.id}
                  onClick={() => {
                    onClose();
                    onSelectTask(task);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-left rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-brand-400 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{task.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 capitalize shrink-0 ml-2">
                    {task.status.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigation: <kbd className="font-mono bg-white px-1 py-0.5 rounded border">Esc</kbd> to close</span>
          <span>Fast Search Mode</span>
        </div>
      </div>
    </div>
  );
};
