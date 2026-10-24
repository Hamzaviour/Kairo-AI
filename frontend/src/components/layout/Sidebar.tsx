import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ListChecks, Kanban, CalendarDays, BarChart3,
  FolderKanban, Users, ShieldCheck, Sparkles, FileSpreadsheet, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { KairoLockup } from '../brand/KairoLogo';

export type ActiveTab = 'my_tasks' | 'kanban' | 'calendar' | 'projects' | 'analytics' | 'admin_users' | 'admin_logs';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  taskCounts: {
    total: number;
    in_progress: number;
    completed: number;
  };
  onOpenAI: () => void;
  onOpenExcel: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

type DbHealth = 'checking' | 'connected' | 'degraded';

const GroupLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-2.5 mb-1.5 text-[11px] font-medium text-slate-400">{children}</div>
);

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  taskCounts,
  onOpenAI,
  onOpenExcel,
  isMobileOpen,
  onMobileClose,
}) => {
  const { isAdmin } = useAuth();
  const [dbHealth, setDbHealth] = useState<DbHealth>('checking');

  useEffect(() => {
    axios
      .get('/api/health')
      .then(({ data }) => setDbHealth(data.database?.status === 'connected' ? 'connected' : 'degraded'))
      .catch(() => setDbHealth('degraded'));
  }, []);

  // On small screens the sidebar is an overlay, so picking a destination dismisses it
  const go = (tab: ActiveTab) => {
    setActiveTab(tab);
    onMobileClose();
  };
  const openAndClose = (open: () => void) => () => {
    open();
    onMobileClose();
  };

  const navItems: { id: ActiveTab; label: string; icon: typeof ListChecks; badge?: number }[] = [
    { id: 'my_tasks', label: 'Tasks', icon: ListChecks, badge: taskCounts.total },
    { id: 'kanban', label: 'Board', icon: Kanban, badge: taskCounts.in_progress },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'analytics', label: 'Insights', icon: BarChart3 },
  ];
  const adminItems: { id: ActiveTab; label: string; icon: typeof ListChecks }[] = [
    { id: 'admin_users', label: 'Team & roles', icon: Users },
    { id: 'admin_logs', label: 'Audit trail', icon: ShieldCheck },
  ];

  // Current place: a white sheet lifted off the rail, with the saffron moment beside it
  const itemClass = (isActive: boolean) =>
    `group relative w-full flex items-center justify-between gap-2 px-2.5 py-[7px] rounded-lg text-[13px] transition-colors ${
      isActive
        ? 'bg-white text-slate-900 font-medium shadow-xs ring-1 ring-slate-200/80'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
    }`;

  const renderNav = ({ id, label, icon: Icon, badge }: { id: ActiveTab; label: string; icon: typeof ListChecks; badge?: number }) => {
    const isActive = activeTab === id;
    return (
      <button key={id} onClick={() => go(id)} aria-current={isActive ? 'page' : undefined} className={itemClass(isActive)}>
        {isActive && <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-400" aria-hidden="true" />}
        <span className="flex items-center gap-2.5">
          <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} strokeWidth={1.75} />
          {label}
        </span>
        {badge !== undefined && badge > 0 && (
          <span className={`tabular text-[11px] ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>{badge}</span>
        )}
      </button>
    );
  };

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden animate-fade-in" onClick={onMobileClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 lg:w-60 lg:static lg:z-auto lg:translate-x-0 bg-slate-100/80 lg:bg-slate-100/70 flex flex-col h-screen shrink-0 select-none border-r border-slate-200 transition-transform duration-200 ease-out ${
          isMobileOpen ? 'translate-x-0 bg-slate-100' : '-translate-x-full'
        }`}
        aria-label="Primary navigation"
      >
        <div className="h-14 px-5 flex items-center">
          <KairoLockup size={24} />
          <button
            onClick={onMobileClose}
            className="ml-auto p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pt-3 pb-4 space-y-6">
          <nav className="space-y-0.5 pl-0" aria-label="Workspace">
            {navItems.map(renderNav)}
          </nav>

          <div>
            <GroupLabel>Assist</GroupLabel>
            <div className="space-y-0.5">
              <button onClick={openAndClose(onOpenAI)} className={itemClass(false)}>
                <span className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
                  Copilot
                </span>
                <kbd className="text-[10px] font-medium text-slate-400">AI</kbd>
              </button>
              <button onClick={openAndClose(onOpenExcel)} className={itemClass(false)}>
                <span className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                  Excel sync
                </span>
              </button>
            </div>
          </div>

          {isAdmin && (
            <div>
              <GroupLabel>Admin</GroupLabel>
              <nav className="space-y-0.5" aria-label="Admin">
                {adminItems.map(renderNav)}
              </nav>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5" role="status">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                dbHealth === 'connected' ? 'bg-emerald-500' : dbHealth === 'degraded' ? 'bg-rose-500' : 'bg-slate-400'
              }`}
            />
            {dbHealth === 'connected' ? 'All systems normal' : dbHealth === 'degraded' ? 'Database unreachable' : 'Checking…'}
          </span>
          <span className="font-mono text-[10px] text-slate-400">v1.1</span>
        </div>
      </aside>
    </>
  );
};
