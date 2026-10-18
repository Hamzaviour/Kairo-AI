import React from 'react';
import { 
  Search, Plus, Bell, Sparkles, FileSpreadsheet, 
  LogOut, Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onQuickCreate: () => void;
  onOpenAI: () => void;
  onOpenExcel: () => void;
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  unreadNotificationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onQuickCreate,
  onOpenAI,
  onOpenExcel,
  onOpenSearch,
  onOpenMenu,
  unreadNotificationsCount = 0,
}) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="h-14 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-3 px-3 sm:px-6">
      <div className="flex items-center gap-2 flex-1 min-w-0 max-w-md">
        <button
          onClick={onOpenMenu}
          className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex-1 min-w-0 flex items-center justify-between gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200/60"
          aria-label="Search tasks and commands"
        >
          <span className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">Search tasks, projects, actions…</span>
          </span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium bg-white text-slate-500 rounded border border-slate-200 shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Copilot Button */}
        <button
          onClick={onOpenAI}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-lg transition-all shadow-2xs group"
          title="Open AI Task Copilot"
          aria-label="Open AI Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-semibold">AI Copilot</span>
        </button>

        {/* Excel Center Button */}
        <button
          onClick={onOpenExcel}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
          title="Excel Import & Export Data Center"
          aria-label="Open Excel Hub"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Excel Hub</span>
        </button>

        {/* Quick Create Task */}
        <button
          onClick={onQuickCreate}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors"
          aria-label="New task"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            className="hidden sm:block p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>
        </div>

        {/* User avatar & logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 shrink-0">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs ring-1 ring-indigo-200">
            {user?.name?.slice(0, 2).toUpperCase() || 'U'}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight flex items-center gap-1">
              {user?.name}
              {isAdmin && (
                <span className="text-[10px] bg-purple-100 text-purple-700 px-1 py-0.2 rounded font-bold">
                  ADMIN
                </span>
              )}
            </span>
            <span className="hidden lg:block text-[11px] text-slate-500 leading-none">{user?.email}</span>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
