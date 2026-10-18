import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CheckSquare, Kanban, Calendar, BarChart3, 
  FolderKanban, Users, ShieldAlert, Sparkles, FileSpreadsheet,
  CheckCircle2, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
  const navItemClass = (isActive: boolean) =>
    `w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
      isActive ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
    }`;

  const navItems = [
    {
      id: 'my_tasks' as ActiveTab,
      label: 'Task List',
      icon: CheckSquare,
      badge: taskCounts.total,
    },
    {
      id: 'kanban' as ActiveTab,
      label: 'Kanban Board',
      icon: Kanban,
      badge: taskCounts.in_progress,
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'calendar' as ActiveTab,
      label: 'Calendar & Deadlines',
      icon: Calendar,
    },
    {
      id: 'projects' as ActiveTab,
      label: 'Projects',
      icon: FolderKanban,
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Productivity Analytics',
      icon: BarChart3,
    },
  ];

  return (
    <>
    {isMobileOpen && (
      <div className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden animate-fade-in" onClick={onMobileClose} aria-hidden="true" />
    )}
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 lg:w-60 lg:static lg:z-auto lg:translate-x-0 bg-slate-900 text-slate-300 flex flex-col h-screen shrink-0 select-none border-r border-slate-800 transition-transform duration-200 ease-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-label="Primary navigation"
    >
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center gap-2.5 border-b border-slate-800/80">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-white leading-tight">
            HCCDI TaskPilot
          </span>
          <span className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider">
            AI Work Platform
          </span>
        </div>
        <button
          onClick={onMobileClose}
          className="ml-auto p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg lg:hidden"
          aria-label="Close navigation"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Workspaces
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={navItemClass(isActive)}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span
                      className={`tabular px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                        isActive
                          ? 'bg-indigo-800/80 text-white'
                          : item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI & Excel Quick Triggers */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Intelligence & Data
          </div>
          <div className="space-y-1">
            <button
              onClick={openAndClose(onOpenAI)}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-800/40 transition-colors group"
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
                <span>AI Copilot Chat</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
            </button>

            <button
              onClick={openAndClose(onOpenExcel)}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-950/30 hover:bg-emerald-950/70 border border-emerald-800/40 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Excel Sync &amp; Export</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Admin Governance Section */}
        {isAdmin && (
          <div>
            <div className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
              <span>Admin Center</span>
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => go('admin_users')}
                aria-current={activeTab === 'admin_users' ? 'page' : undefined}
                className={`${navItemClass(activeTab === 'admin_users')} !justify-start gap-2.5`}
              >
                <Users className="w-4 h-4" />
                <span>Team &amp; Roles</span>
              </button>

              <button
                onClick={() => go('admin_logs')}
                aria-current={activeTab === 'admin_logs' ? 'page' : undefined}
                className={`${navItemClass(activeTab === 'admin_logs')} !justify-start gap-2.5`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Audit Trail</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5" role="status">
            <span
              className={`w-2 h-2 rounded-full ${
                dbHealth === 'connected' ? 'bg-emerald-500' : dbHealth === 'degraded' ? 'bg-rose-500' : 'bg-slate-500'
              }`}
            />
            <span>
              {dbHealth === 'connected' ? 'Database connected' : dbHealth === 'degraded' ? 'Database unreachable' : 'Checking database…'}
            </span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">v1.0.0</span>
        </div>
      </div>
    </aside>
    </>
  );
};
