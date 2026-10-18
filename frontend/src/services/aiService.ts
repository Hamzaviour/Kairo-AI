import { apiClient } from './api';
import { ParsedTaskDTO } from '../types';

export interface AIPriorityResult {
  recommended_priority: 'low' | 'medium' | 'high' | 'urgent';
  confidence: number;
  factors: Record<string, any>;
  explanation: string;
}

export interface AISmartScheduleItem {
  time_slot: string;
  task_id: string;
  task_title: string;
  priority: string;
  estimated_minutes: number;
  reason: string;
}

export const aiService = {
  async parseTask(text: string): Promise<ParsedTaskDTO> {
    const response = await apiClient.post('/ai/parse-task', { text });
    return response.data.data;
  },

  async breakdownTask(title: string, description?: string): Promise<string[]> {
    const response = await apiClient.post('/ai/breakdown', {
      task_title: title,
      task_description: description,
    });
    return response.data.data.subtasks;
  },

  async prioritizeTask(taskId: string): Promise<AIPriorityResult> {
    const response = await apiClient.post('/ai/prioritize', { task_id: taskId });
    return response.data.data;
  },

  async smartSchedule(targetDate?: string): Promise<{ schedule: AISmartScheduleItem[]; summary: string }> {
    const response = await apiClient.post('/ai/smart-schedule', { target_date: targetDate });
    return response.data.data;
  },

  async chat(message: string, contextTaskId?: string): Promise<{ reply: string; suggested_actions?: any[] }> {
    const response = await apiClient.post('/ai/chat', {
      message,
      context_task_id: contextTaskId,
    });
    return response.data.data;
  },
};
