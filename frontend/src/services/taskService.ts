import { apiClient } from './api';
import { Task, Subtask, TaskComment, TaskActivityLog, Project, NotificationItem, TaskCreateInput } from '../types';

export interface TaskFilterParams {
  status?: string;
  priority?: string;
  project_id?: string;
  assignee_id?: string;
  search?: string;
  skip?: number;
  limit?: number;
}

export const taskService = {
  async getTasks(params?: TaskFilterParams): Promise<{ items: Task[]; total: number }> {
    const response = await apiClient.get('/tasks', { params });
    return response.data.data;
  },

  async getTask(id: string): Promise<Task> {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data.data;
  },

  async createTask(data: TaskCreateInput): Promise<Task> {
    const response = await apiClient.post('/tasks', data);
    return response.data.data;
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const response = await apiClient.put(`/tasks/${id}`, data);
    return response.data.data;
  },

  async updateTaskStatus(id: string, status: string, position?: number): Promise<Task> {
    const response = await apiClient.patch(`/tasks/${id}/status`, { status, position });
    return response.data.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async duplicateTask(id: string): Promise<Task> {
    const response = await apiClient.post(`/tasks/${id}/duplicate`);
    return response.data.data;
  },

  async bulkUpdate(taskIds: string[], status?: string, priority?: string): Promise<number> {
    const response = await apiClient.post('/tasks/bulk', {
      task_ids: taskIds,
      status,
      priority,
    });
    return response.data.data.updated_count;
  },

  // Subtasks
  async addSubtask(taskId: string, title: string): Promise<Subtask> {
    const response = await apiClient.post(`/tasks/${taskId}/subtasks`, { title });
    return response.data.data;
  },

  async toggleSubtask(subtaskId: string, isCompleted: boolean): Promise<Subtask> {
    const response = await apiClient.patch(`/subtasks/${subtaskId}`, { is_completed: isCompleted });
    return response.data.data;
  },

  // Comments
  async getComments(taskId: string): Promise<TaskComment[]> {
    const response = await apiClient.get(`/tasks/${taskId}/comments`);
    return response.data.data;
  },

  async addComment(taskId: string, content: string): Promise<TaskComment> {
    const response = await apiClient.post(`/tasks/${taskId}/comments`, { content });
    return response.data.data;
  },

  // Activity logs
  async getActivityLogs(taskId: string): Promise<TaskActivityLog[]> {
    const response = await apiClient.get(`/tasks/${taskId}/activity`);
    return response.data.data;
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.get('/projects');
    return response.data.data;
  },

  async createProject(name: string, description?: string, color?: string): Promise<Project> {
    const response = await apiClient.post('/projects', { name, description, color });
    return response.data.data;
  },

  // Notifications
  async getNotifications(unreadOnly: boolean = false): Promise<NotificationItem[]> {
    const response = await apiClient.get('/notifications', { params: { unread_only: unreadOnly } });
    return response.data.data;
  },

  async markNotificationRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },
};
