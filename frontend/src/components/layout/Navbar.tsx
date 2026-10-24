import React from 'react';
import {
  Search, Plus, Bell, Sparkles, FileSpreadsheet,
  LogOut, Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { KairoMark } from '../brand/KairoLogo';

interface NavbarProps {
  onQuickCreate: () => void;
  onOpenAI: () => void;
  onOpenExcel: () => void;
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  unreadNotificationsCount?: number;
}

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

export const Navbar: React.FC<NavbarProps> = ({
  onQuickCreate,
  onOpenAI,
  onOpenExcel,
  onOpenSearch,
  onOpenMenu,
  unreadNotificationsCount = 0,
}) => {
  const { user, logout, isAdmin } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? '';
  const initials = (user?.name ?? 'U').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <header className="h-14 glass-panel !border-x-0 !border-t-0 sticky top-0 z-20 flex items-center justify-between gap-3 px-3 sm:px-6">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onOpenMenu}
          className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <KairoMark size={24} className="lg:hidden shrink-0" />

        <p className="hidden xl:block text-[13px] text-slate-500 whitespace-nowrap">
          {greeting()}, <span className="font-medium text-slate-900">{firstName}</span>
        </p>

        <button
          onClick={onOpenSearch}
          className="flex-1 min-w-0 max-w-sm flex items-center justify-between gap-2 pl-3 pr-1.5 py-1.5 text-[13px] text-slate-500 bg-white hover:border-slate-300 rounded-lg transition-colors border border-slate-200 xl:ml-4"
          aria-label="Search tasks and commands"
        >
          <span className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Search or jump to…</span>
          </span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium bg-slate-50 text-slate-500 rounded border border-slate-200 font-mono">
            Ctrl K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onOpenAI}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open Copilot"
        >
          <Sparkles className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
          <span className="hidden sm:inline">Copilot</span>
        </button>

        <button
          onClick={onOpenExcel}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open Excel sync"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
          <span className="hidden md:inline">Excel</span>
        </button>

        <button
          onClick={onQuickCreate}
          className="flex items-center gap-1.5 pl-2 pr-2.5 sm:pr-3 py-1.5 text-[13px] font-medium text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-lg shadow-xs transition-colors"
          aria-label="New task"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New task</span>
        </button>

        <button
          className="hidden sm:flex p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" strokeWidth={1.75} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-400 rounded-full ring-2 ring-white" />
          )}
        </button>

        <div className="flex items-center gap-2 pl-2 sm:pl-3 ml-0.5 border-l border-slate-200 shrink-0">
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-medium text-[11px] tracking-wide">
              {initials}
            </div>
            {isAdmin && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand-400 ring-2 ring-white" title="Administrator" />
            )}
          </div>
          <div className="hidden md:flex flex-col text-left leading-tight">
            <span className="text-[13px] font-medium text-slate-900">{user?.name}</span>
            <span className="text-[11px] text-slate-500">{isAdmin ? 'Administrator' : 'Member'}</span>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
};
