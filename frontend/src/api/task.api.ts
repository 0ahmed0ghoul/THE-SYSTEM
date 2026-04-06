// frontend/src/api/task.api.ts
import apiClient from '../services/api.client';
import type { Task } from '../store/taskStore';

export const taskApi = {
  create: async (task: Partial<Task>) => {
    const response = await apiClient.post('/tasks', task);
    return response.data.data;
  },
};