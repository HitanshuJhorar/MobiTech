import api from './api';
import { isAxiosError } from 'axios';
import { Admin } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<void> {
    await api.post('/auth/login', { email, password });
  },

  async getCurrentAdmin(): Promise<Admin | null> {
    try {
      const { data } = await api.get('/auth/me');
      return data.data.admin;
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        return null;
      }
      throw err;
    }
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
