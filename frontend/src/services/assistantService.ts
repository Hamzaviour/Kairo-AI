import { apiClient } from './api';

export interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AssistantAction {
  tool: string;
  ok: boolean;
  write: boolean;
}

export interface AssistantReply {
  reply: string;
  actions: AssistantAction[];
  data_changed: boolean;
  model: string;
}

export const assistantService = {
  // Admins talk to the organization-wide assistant; everyone else gets the scoped one
  async chat(messages: AssistantMessage[], admin: boolean): Promise<AssistantReply> {
    const response = await apiClient.post(admin ? '/ai/admin-assistant' : '/ai/assistant', { messages });
    return response.data.data;
  },
};
