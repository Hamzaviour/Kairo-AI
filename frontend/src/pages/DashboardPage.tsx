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
import { ChatAssistantWidget } from '../components/ai/ChatAssistantWidget';
import { ExcelCenterModal } from '../components/excel/ExcelCenterModal';
import { AnalyticsView } from '../components/analytics/AnalyticsView';
import { AdminUserManagement } from '../components/admin/AdminUserManagement';
import { taskService } from '../services/taskService';
import { Task, TaskStatus, TaskCreateInput } from '../types';
import { useAuth } from '../context/AuthContext';
import { ProjectsView } from '../components/projects/ProjectsView';
import { AuditTrailView } from '../components/admin/AuditTrailView';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global ⌘K / Ctrl+K shortcut toggles the command palette from anywhere in the workspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        isMobileOpen={isSidebarOpen}
        onMobileClose={() => setIsSidebarOpen(false)}
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
          onOpenMenu={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-3 sm:p-6">
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

          {activeTab === 'projects' && <ProjectsView />}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'admin_users' && <AdminUserManagement />}

          {activeTab === 'admin_logs' && <AuditTrailView />}
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

      {/* Floating chat assistant (admin and user personas) */}
      <ChatAssistantWidget key={user?.id} onDataChanged={fetchTasks} />

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
