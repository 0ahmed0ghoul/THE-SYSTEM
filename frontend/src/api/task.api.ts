import apiClient from '../services/api.client';
import type { Task } from '../store/taskStore';

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await apiClient.get('/tasks');
    return response.data.data;
  },
  
  create: async (task: Partial<Task>) => {
    const response = await apiClient.post('/tasks', task);
    return response.data.data;
  },
  
  update: async (id: number, task: Partial<Task>) => {
    const response = await apiClient.put(`/tasks/${id}`, task);
    return response.data.data;
  },
  
  delete: async (id: number) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },
  
  getById: async (id: number): Promise<Task> => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data.data;
  },
};