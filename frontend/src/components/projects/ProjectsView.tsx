import React, { useEffect, useState } from 'react';
import { FolderKanban, Plus, Loader2, AlertCircle } from 'lucide-react';
import { taskService } from '../../services/taskService';
import { Project } from '../../types';

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const load = () => {
    setState('loading');
    taskService
      .getProjects()
      .then((data) => {
        setProjects(data);
        setState('ready');
      })
      .catch(() => setState('error'));
  };

  useEffect(load, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await taskService.createProject(name.trim(), description.trim() || undefined);
    setName('');
    setDescription('');
    setIsCreating(false);
    load();
  };

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Projects</h2>
          <p className="text-xs text-slate-500">Group related tasks so teams can track a body of work together.</p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 animate-fade-in">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold text-slate-700">
              <span>Project name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Q4 Finance Close"
                className="w-full px-3 py-2 text-sm font-normal rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
                autoFocus
                required
              />
            </label>
            <label className="space-y-1 text-xs font-semibold text-slate-700">
              <span>Description (optional)</span>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What this project delivers"
                className="w-full px-3 py-2 text-sm font-normal rounded-lg border border-slate-200 bg-slate-50 focus:bg-white"
              />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900">
              Cancel
            </button>
            <button type="submit" disabled={!name.trim()} className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg">
              Create Project
            </button>
          </div>
        </form>
      )}

      {state === 'loading' && (
        <div className="flex items-center gap-2 p-6 text-xs text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading projects…
        </div>
      )}

      {state === 'error' && (
        <div className="flex items-center justify-between gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
          <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Projects could not be loaded.</span>
          <button onClick={load} className="font-semibold underline underline-offset-2">Try again</button>
        </div>
      )}

      {state === 'ready' && projects.length === 0 && !isCreating && (
        <div className="p-8 bg-white rounded-xl border border-dashed border-slate-300 text-center space-y-2">
          <FolderKanban className="w-6 h-6 mx-auto text-slate-400" />
          <p className="text-sm font-semibold text-slate-800">No projects yet</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create a project for each initiative, then assign tasks to it from the task form to see progress roll up here.
          </p>
        </div>
      )}

      {state === 'ready' && projects.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {projects.map((p) => {
            const total = p.tasks_count ?? 0;
            const done = p.completed_tasks_count ?? 0;
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <li key={p.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color || '#6366f1' }} />
                  <span className="font-bold text-sm text-slate-800 truncate">{p.name}</span>
                </div>
                {p.description && <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>}
                <div className="pt-1 space-y-1">
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-brand-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="tabular text-[11px] text-slate-500">
                    {done} of {total} tasks completed
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
