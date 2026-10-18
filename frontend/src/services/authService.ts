import { apiClient } from './api';
import { AuthResponse, User, UserPreferences } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data.data;
  },

  async register(name: string, email: string, password: string, role: string = 'user'): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', { name, email, password, role });
    return response.data.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },

  async updateMe(data: Partial<User>): Promise<User> {
    const response = await apiClient.put('/auth/me', data);
    return response.data.data;
  },

  async updatePreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
    const response = await apiClient.put('/auth/preferences', prefs);
    return response.data.data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refresh_token: refreshToken });
      }
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.clear();
    }
  },
};
