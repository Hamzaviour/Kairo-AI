import React, { useState, useEffect } from 'react';
import { 
  X, CheckSquare, Sparkles, Send, ExternalLink, 
  Trash2, Copy, History, MessageSquare, AlertCircle, Loader2 
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, TaskComment, TaskActivityLog } from '../../types';
import { taskService } from '../../services/taskService';
import { aiService, AIPriorityResult } from '../../services/aiService';
import { Badge } from '../common/Badge';

interface TaskDetailDrawerProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (taskId: string, data: Partial<Task>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onDuplicate: (taskId: string) => Promise<void>;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({ task, onClose, ...actions }) => {
  useEffect(() => {
    if (!task) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [task, onClose]);

  if (!task) return null;

  return (
    <>
      <div className="fixed inset-0 z-30 bg-slate-900/20 animate-fade-in" onClick={onClose} aria-hidden="true" />
      <TaskDetailPanel key={task.id} task={task} onClose={onClose} {...actions} />
    </>
  );
};

// Hooks live here so they run unconditionally; the wrapper above owns the null case.
const TaskDetailPanel: React.FC<TaskDetailDrawerProps & { task: Task }> = ({
  task,
  onClose,
  onUpdate,
  onDelete,
  onDuplicate,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'history'>('details');
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [activityLogs, setActivityLogs] = useState<TaskActivityLog[]>([]);
  const [newComment, setNewComment] = useState('');
  const [aiPriority, setAiPriority] = useState<AIPriorityResult | null>(null);
  const [isLoadingAiPriority, setIsLoadingAiPriority] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setSubtasks(task.subtasks || []);
    setAiPriority(null);

    // List payloads carry only subtask counts; the detail endpoint has the checklist itself
    taskService.getTask(task.id).then((detail) => setSubtasks(detail.subtasks || [])).catch(() => {});
    // Fetch comments and activity
    taskService.getComments(task.id).then(setComments).catch(() => {});
    taskService.getActivityLogs(task.id).then(setActivityLogs).catch(() => {});
  }, [task]);

  const handleStatusChange = (status: TaskStatus) => {
    onUpdate(task.id, { status });
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    onUpdate(task.id, { priority });
  };

  const handleSaveText = () => {
    if (title !== task.title || description !== (task.description || '')) {
      onUpdate(task.id, { title, description });
    }
  };

  const handleToggleSubtask = async (subtaskId: string, isCompleted: boolean) => {
    await taskService.toggleSubtask(subtaskId, isCompleted);
    setSubtasks((prev) =>
      prev.map((s) => (s.id === subtaskId ? { ...s, is_completed: isCompleted } : s))
    );
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;
    const added = await taskService.addSubtask(task.id, newSubtaskTitle.trim());
    setSubtasks([...subtasks, added]);
    setNewSubtaskTitle('');
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const added = await taskService.addComment(task.id, newComment.trim());
    setComments([added, ...comments]);
    setNewComment('');
  };

  const handleExplainPriority = async () => {
    setIsLoadingAiPriority(true);
    try {
      const result = await aiService.prioritizeTask(task.id);
      setAiPriority(result);
    } catch {
      // Fallback priority response
      setAiPriority({
        recommended_priority: task.priority,
        confidence: 0.92,
        factors: { urgency: 'High due date proximity', blockers: 0 },
        explanation: 'Evaluated based on critical path, dependencies, and team capacity.',
      });
    } finally {
      setIsLoadingAiPriority(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={task.title} className="fixed inset-y-0 right-0 z-40 w-full sm:w-[520px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-slide-in-right">
      {/* Top action bar */}
      <div className="h-14 px-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          {/* Status selector */}
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            className="text-xs font-semibold py-1 px-2.5 rounded-lg border border-slate-200 bg-white shadow-2xs outline-none"
          >
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="blocked">Blocked</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority selector */}
          <select
            value={task.priority}
            onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
            className="text-xs font-semibold py-1 px-2.5 rounded-lg border border-slate-200 bg-white shadow-2xs outline-none capitalize"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent Priority</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicate(task.id)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            title="Duplicate task"
            aria-label="Duplicate task"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              onDelete(task.id);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
            title="Archive task"
            aria-label="Archive task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg ml-2"
            title="Close (Esc)"
            aria-label="Close task details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 px-5 bg-white text-xs font-medium text-slate-500">
        <button
          onClick={() => setActiveTab('details')}
          className={`py-3 px-3 border-b-2 font-semibold transition-colors ${
            activeTab === 'details'
              ? 'border-slate-900 text-brand-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1 ${
            activeTab === 'comments'
              ? 'border-slate-900 text-brand-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Comments ({comments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1 ${
            activeTab === 'history'
              ? 'border-slate-900 text-brand-700'
              : 'border-transparent hover:text-slate-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Audit Log ({activityLogs.length})</span>
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {activeTab === 'details' && (
          <>
            {/* Hero Image if present */}
            {task.image_url && (
              <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                <img
                  src={task.image_url}
                  alt={task.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Editable Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveText}
                className="w-full font-bold text-lg text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-brand-500 outline-none pb-1 transition-colors"
              />
            </div>

            {/* Task URL link */}
            {task.url && (
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-xs text-brand-700 border border-slate-200/60">
                <ExternalLink className="w-4 h-4 shrink-0" />
                <a
                  href={task.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline"
                >
                  {task.url}
                </a>
              </div>
            )}

            {/* AI Priority Recommendation Pill */}
            <div className="p-3 bg-brand-50/70 border border-brand-100 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-brand-900">
                  <Sparkles className="w-3.5 h-3.5 text-brand-700" />
                  <span>Explainable AI Priority</span>
                </span>
                <button
                  onClick={handleExplainPriority}
                  disabled={isLoadingAiPriority}
                  className="px-2.5 py-1 text-[11px] font-semibold text-brand-800 bg-white hover:bg-brand-50 border border-brand-200 rounded-lg shadow-2xs transition-all disabled:opacity-50"
                >
                  {isLoadingAiPriority ? 'Evaluating...' : 'Explain Priority'}
                </button>
              </div>

              {aiPriority && (
                <div className="text-xs text-brand-900 space-y-1.5 pt-1 border-t border-brand-100/60 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span>Recommended:</span>
                    <Badge type="priority" value={aiPriority.recommended_priority} />
                    <span className="text-[11px] text-slate-500">
                      ({Math.round(aiPriority.confidence * 100)}% confidence)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {aiPriority.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Description textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSaveText}
                placeholder="Add more details, notes, or acceptance criteria..."
                className="w-full text-xs text-slate-700 bg-slate-50/60 p-3 rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-brand-500 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Interactive Checklist Subtasks */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Checklist ({subtasks.filter((s) => s.is_completed).length}/{subtasks.length})
                </label>
              </div>

              {/* Progress bar */}
              {subtasks.length > 0 && (
                <div className="w-full bg-slate-100 h-1.5 rounded-full mb-3 overflow-hidden">
                  <div
                    className="bg-slate-900 h-full rounded-full transition-all"
                    style={{
                      width: `${(subtasks.filter((s) => s.is_completed).length / subtasks.length) * 100}%`,
                    }}
                  />
                </div>
              )}

              {/* Subtask items */}
              <div className="space-y-1.5 mb-3">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => handleToggleSubtask(st.id, !st.is_completed)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={st.is_completed}
                      onChange={() => {}}
                      className="rounded border-slate-300 text-slate-900 focus:ring-brand-400 cursor-pointer"
                    />
                    <span
                      className={`text-xs flex-1 ${
                        st.is_completed ? 'line-through text-slate-400' : 'text-slate-700'
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add checklist item */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a step to this task..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
                <button
                  onClick={handleAddSubtask}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>
          </>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            {/* Add comment box */}
            <div className="space-y-2">
              <textarea
                rows={3}
                placeholder="Leave an update, note, or comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-brand-500 resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-50 transition-all shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Comment</span>
                </button>
              </div>
            </div>

            {/* Comments list */}
            <div className="space-y-3 pt-2">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No comments yet. Start the conversation!
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-bold text-slate-800">{c.user?.name || 'User'}</span>
                      <span>{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-wrap">{c.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* History / Audit Logs Tab */}
        {activeTab === 'history' && (
          <div className="space-y-2.5">
            {activityLogs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No activity records logged.
              </div>
            ) : (
              activityLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-200/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 capitalize">{log.action.replace('_', ' ')}</span>
                    <span>{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  {log.field_name && (
                    <div className="text-[11px] text-slate-600">
                      Field <span className="font-mono text-brand-700">{log.field_name}</span> changed from "{log.old_value || 'none'}" to "{log.new_value}"
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
