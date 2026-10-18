import React from 'react';
import { 
  Search, Plus, Bell, Sparkles, FileSpreadsheet, 
  User as UserIcon, LogOut, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onQuickCreate: () => void;
  onOpenAI: () => void;
  onOpenExcel: () => void;
  onOpenSearch: () => void;
  unreadNotificationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onQuickCreate,
  onOpenAI,
  onOpenExcel,
  onOpenSearch,
  unreadNotificationsCount = 0,
}) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="h-14 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
      {/* Search trigger */}
      <div className="flex items-center gap-3 w-72 sm:w-96">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200/60"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search tasks, projects, actions...</span>
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
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-semibold">AI Copilot</span>
        </button>

        {/* Excel Center Button */}
        <button
          onClick={onOpenExcel}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
          title="Excel Import & Export Data Center"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Excel Hub</span>
        </button>

        {/* Quick Create Task */}
        <button
          onClick={onQuickCreate}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-lg shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>
        </div>

        {/* User avatar & logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
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
            <span className="text-[11px] text-slate-400 leading-none">{user?.email}</span>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
