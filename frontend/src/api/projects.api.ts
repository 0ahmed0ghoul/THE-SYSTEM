import apiClient from "../services/api.client";
import type { Project, ProjectStats } from "../store/projectStore";


export const projectsApi = {
  // Get all projects
  getAll: async (): Promise<Project[]> => {
    const response = await apiClient.get('/projects');
    return response.data.data;
  },
  
  // Get project by ID
  getById: async (id: number): Promise<Project> => {
    console.log('Fetching project with ID:', id);
    const response = await apiClient.get(`/projects/${id}`);
    console.log('Project fetch response:', response);
    return response.data.data;
  },
  
  // Create new project
  create: async (data: Partial<Project>): Promise<Project> => {
    const response = await apiClient.post('/projects', data);
    return response.data.data;
  },
  
  // Update project
  update: async (id: number, data: Partial<Project>): Promise<Project> => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data.data;
  },
  
  // Delete project
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
  
  // Get project statistics
  getStats: async (): Promise<ProjectStats> => {
    const response = await apiClient.get('/projects/stats');
    return response.data.data;
  },
};