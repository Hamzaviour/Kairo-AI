import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar, ActiveTab } from '../components/layout/Sidebar';
import { CommandPalette } from '../components/layout/CommandPalette';
import { TaskListView } from '../components/tasks/TaskListView';
import { TaskKanbanView } from '../components/tasks/TaskKanbanView';
import { TaskCalendarView } from '../components/tasks/TaskCalendarView';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
import { AICopilotDrawer } from '../components/ai/AICopilotDrawer';
import { ExcelCenterModal } from '../components/excel/ExcelCenterModal';
import { AnalyticsView } from '../components/analytics/AnalyticsView';
import { AdminUserManagement } from '../components/admin/AdminUserManagement';
import { taskService } from '../services/taskService';
import { Task, TaskStatus, TaskCreateInput } from '../types';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('my_tasks');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Modals & Drawers state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialStatus, setCreateInitialStatus] = useState<TaskStatus>('todo');
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data.items);
    } catch {
      // In case server is loading
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (data: TaskCreateInput) => {
    await taskService.createTask(data);
    await fetchTasks();
  };

  const handleUpdateTask = async (taskId: string, data: Partial<Task>) => {
    await taskService.updateTask(taskId, data);
    await fetchTasks();
    if (selectedTask?.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, ...data } : null));
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    await taskService.updateTaskStatus(taskId, status);
    await fetchTasks();
    if (selectedTask?.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await taskService.deleteTask(taskId);
    await fetchTasks();
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  const handleDuplicateTask = async (taskId: string) => {
    await taskService.duplicateTask(taskId);
    await fetchTasks();
  };

  const handleBulkUpdate = async (taskIds: string[], status?: string, priority?: string) => {
    await taskService.bulkUpdate(taskIds, status, priority);
    await fetchTasks();
  };

  const taskCounts = {
    total: tasks.length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        taskCounts={taskCounts}
        onOpenAI={() => setIsAIDrawerOpen(true)}
        onOpenExcel={() => setIsExcelModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onQuickCreate={() => {
            setCreateInitialStatus('todo');
            setIsCreateModalOpen(true);
          }}
          onOpenAI={() => setIsAIDrawerOpen(true)}
          onOpenExcel={() => setIsExcelModalOpen(true)}
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'my_tasks' && (
            <TaskListView
              tasks={tasks}
              onSelectTask={setSelectedTask}
              onStatusChange={handleStatusChange}
              onDuplicate={handleDuplicateTask}
              onDelete={handleDeleteTask}
              onBulkUpdate={handleBulkUpdate}
            />
          )}

          {activeTab === 'kanban' && (
            <TaskKanbanView
              tasks={tasks}
              onSelectTask={setSelectedTask}
              onStatusChange={handleStatusChange}
              onQuickCreateWithStatus={(status) => {
                setCreateInitialStatus(status);
                setIsCreateModalOpen(true);
              }}
            />
          )}

          {activeTab === 'calendar' && (
            <TaskCalendarView tasks={tasks} onSelectTask={setSelectedTask} />
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Projects Hub</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800">Core Engineering</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  </div>
                  <p className="text-xs text-slate-500">Database schema, auth token rotation, and API services</p>
                  <div className="pt-2 text-[11px] font-semibold text-indigo-600">3 Active Tasks</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'admin_users' && <AdminUserManagement />}

          {activeTab === 'admin_logs' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800">Organizational Audit Logs</h2>
              </div>
              <div className="p-6 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="font-semibold text-slate-800">Database Schema Verified:</span> 19 tables, 20 indexes active on Neon PostgreSQL.
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="font-semibold text-slate-800">Excel Data Sync:</span> Alexander Wright and Sarah Jenkins records seeded with bcrypt security.
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        initialStatus={createInitialStatus}
      />

      {/* Slide-over Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onDuplicate={handleDuplicateTask}
      />

      {/* AI Task Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        onTaskCreatedFromAI={handleCreateTask}
      />

      {/* Excel Data Hub Modal */}
      <ExcelCenterModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onImportComplete={fetchTasks}
      />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tasks={tasks}
        onSelectTask={setSelectedTask}
        onQuickCreate={() => {
          setCreateInitialStatus('todo');
          setIsCreateModalOpen(true);
        }}
        onOpenAI={() => setIsAIDrawerOpen(true)}
        onOpenExcel={() => setIsExcelModalOpen(true)}
      />
    </div>
  );
};
