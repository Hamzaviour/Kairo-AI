import React, { useState } from 'react';
import { 
  X, Sparkles, Plus, Trash2, Calendar, Link as LinkIcon, 
  Image as ImageIcon, Loader2 
} from 'lucide-react';
import { TaskStatus, TaskPriority, TaskCreateInput } from '../../types';
import { aiService } from '../../services/aiService';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskCreateInput) => Promise<void>;
  initialStatus?: TaskStatus;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialStatus = 'todo',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, newSubtask.trim()]);
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleAIBreakdown = async () => {
    if (!title.trim()) return;
    setIsGeneratingSubtasks(true);
    try {
      const generated = await aiService.breakdownTask(title, description);
      setSubtasks([...subtasks, ...generated]);
    } catch {
      // Fallback subtasks
      setSubtasks([
        ...subtasks,
        `Review architecture requirements for ${title}`,
        `Implement core logic and data models`,
        `Write automated integration tests`,
        `Deploy and verify in staging environment`,
      ]);
    } finally {
      setIsGeneratingSubtasks(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description: description.trim() || undefined,
        url: url.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
        status,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
        subtasks: subtasks.length > 0 ? subtasks : undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-base text-slate-800">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Task Heading */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Heading *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement User Authentication"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-brand-500 transition-colors"
              autoFocus
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide context, acceptance criteria, or execution notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-brand-500 transition-colors resize-none"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Task Status Dropdown
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-700 focus:bg-white focus:border-brand-500"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Task Priority Dropdown
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-700 focus:bg-white focus:border-brand-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* URL & Image Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Task URL</span>
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Task Image URL</span>
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-brand-500"
              />
            </div>
          </div>

          {/* Image preview */}
          {imageUrl && (
            <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => ((e.currentTarget as HTMLElement).style.display = 'none')}
              />
            </div>
          )}

          {/* Due date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Due Date</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-brand-500"
            />
          </div>

          {/* Subtasks Section with AI Breakdown */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Checklist Subtasks ({subtasks.length})
              </label>

              <button
                type="button"
                onClick={handleAIBreakdown}
                disabled={!title.trim() || isGeneratingSubtasks}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-brand-800 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors disabled:opacity-50"
              >
                {isGeneratingSubtasks ? (
                  <Loader2 className="w-3 h-3 animate-spin text-brand-700" />
                ) : (
                  <Sparkles className="w-3 h-3 text-brand-700" />
                )}
                <span>AI Breakdown</span>
              </button>
            </div>

            {/* Subtask list */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto mb-2">
              {subtasks.map((st, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-1.5 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200/60"
                >
                  <span className="truncate">{st}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(i)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add subtask input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add subtask checklist item..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-98 rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
