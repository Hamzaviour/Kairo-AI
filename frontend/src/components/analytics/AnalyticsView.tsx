import React from 'react';
import { 
  BarChart3, CheckCircle2, Clock, Flame, 
  Users, TrendingUp, AlertCircle 
} from 'lucide-react';
import { UserAnalytics, AdminAnalytics } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface AnalyticsViewProps {
  userAnalytics?: UserAnalytics;
  adminAnalytics?: AdminAnalytics;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  userAnalytics = {
    total_assigned: 3,
    completed_tasks: 1,
    in_progress_tasks: 1,
    blocked_tasks: 0,
    overdue_tasks: 0,
    completion_rate_pct: 33.3,
    total_focus_minutes: 120,
    active_streak_days: 4,
  },
  adminAnalytics,
}) => {
  const { isAdmin } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-800">Productivity &amp; Velocity Analytics</h2>
        <p className="text-xs text-slate-500">
          Personal performance, execution velocity, and organization workload metrics
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Assigned
            </span>
            <div className="text-2xl font-bold text-slate-800 mt-0.5">
              {userAnalytics.total_assigned}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Completed Tasks
            </span>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5">
              {userAnalytics.completed_tasks}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Productivity Streak
            </span>
            <div className="text-2xl font-bold text-amber-600 mt-0.5 flex items-center gap-1">
              <span>{userAnalytics.active_streak_days}</span>
              <span className="text-xs font-medium text-slate-400">days</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Focus Time
            </span>
            <div className="text-2xl font-bold text-indigo-600 mt-0.5 flex items-center gap-1">
              <span>{Math.round(userAnalytics.total_focus_minutes / 60)}</span>
              <span className="text-xs font-medium text-slate-400">hours</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Completion rate bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Sprint Completion Rate</span>
          <span className="font-bold text-indigo-600">{userAnalytics.completion_rate_pct}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all"
            style={{ width: `${userAnalytics.completion_rate_pct}%` }}
          />
        </div>
      </div>

      {/* Admin Executive Overview (if Admin) */}
      {isAdmin && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-800">
              Organization Workload Distribution (Admin Overview)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Alexander Wright (Executive Admin)</span>
                <span className="text-indigo-600">2 Tasks</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-[66%]" />
              </div>
              <span className="text-[11px] text-slate-400">1 In Progress, 1 To Do</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Sarah Jenkins (Core Contributor)</span>
                <span className="text-emerald-600">1 Task</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[100%]" />
              </div>
              <span className="text-[11px] text-slate-400">1 Completed</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
