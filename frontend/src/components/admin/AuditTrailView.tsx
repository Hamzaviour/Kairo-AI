import React, { useEffect, useState } from 'react';
import { ShieldAlert, Loader2, AlertCircle, History } from 'lucide-react';
import { format } from 'date-fns';
import { apiClient } from '../../services/api';
import { TaskActivityLog } from '../../types';

const ACTION_LABELS: Record<string, string> = {
  created: 'created a task',
  edited: 'edited',
  status_changed: 'changed status',
  reassigned: 'reassigned',
  archived: 'archived a task',
  duplicated: 'duplicated a task',
};

const describe = (log: TaskActivityLog) => {
  const verb = ACTION_LABELS[log.action] || log.action.replace(/_/g, ' ');
  if (log.action === 'status_changed' && log.old_value && log.new_value) {
    return `${verb} from ${log.old_value.replace(/_/g, ' ')} to ${log.new_value.replace(/_/g, ' ')}`;
  }
  if (log.action === 'edited' && log.field_name) return `${verb} ${log.field_name.replace(/_/g, ' ')}`;
  if (log.action === 'created' && log.new_value) return `${verb}: ${log.new_value}`;
  return verb;
};

export const AuditTrailView: React.FC = () => {
  const [logs, setLogs] = useState<TaskActivityLog[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = () => {
    setState('loading');
    apiClient
      .get('/admin/audit-logs', { params: { limit: 100 } })
      .then((res) => {
        setLogs(res.data.data);
        setState('ready');
      })
      .catch(() => setState('error'));
  };

  useEffect(load, []);

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-indigo-600" />
        <div>
          <h2 className="text-lg font-bold text-slate-800">Audit Trail</h2>
          <p className="text-xs text-slate-500">Immutable, organisation-wide record of task changes. Most recent first.</p>
        </div>
      </div>

      {state === 'loading' && (
        <div className="flex items-center gap-2 p-6 text-xs text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading audit trail…
        </div>
      )}

      {state === 'error' && (
        <div className="flex items-center justify-between gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
          <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4" /> The audit trail could not be loaded.</span>
          <button onClick={load} className="font-semibold underline underline-offset-2">Try again</button>
        </div>
      )}

      {state === 'ready' && logs.length === 0 && (
        <div className="p-8 bg-white rounded-xl border border-dashed border-slate-300 text-center space-y-2">
          <History className="w-6 h-6 mx-auto text-slate-400" />
          <p className="text-sm font-semibold text-slate-800">No activity recorded yet</p>
          <p className="text-xs text-slate-500">Creating, editing, reassigning or completing a task adds an entry here.</p>
        </div>
      )}

      {state === 'ready' && logs.length > 0 && (
        <ol className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {logs.map((log) => (
            <li key={log.id} className="flex items-start justify-between gap-4 px-4 py-3 text-xs">
              <span className="text-slate-700">
                <span className="font-semibold text-slate-900">{log.user?.name || 'System'}</span> {describe(log)}
              </span>
              <time className="tabular shrink-0 text-slate-500" dateTime={log.created_at}>
                {format(new Date(log.created_at), 'MMM d, HH:mm')}
              </time>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
