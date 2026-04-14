// frontend/src/features/projects/store/projectStore.ts
import { create } from "zustand";
import { useAuthStore } from "../features/auth/store/authStore";
import axios from "axios";
import { projectsApi } from "../api/projects.api";

export const statsData = {
  totalProjects: 10,
  activeProjects: 6,
  completedTasks: 48,
  totalTasks: 75,
  pendingTasks: 27,
  teamMembers: 12
};

export interface Project {
  id:number;
  name: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  status?: "planning" | "active" | "onHold" | "completed" | "archived";
  category?: string;
  progress?: number;
  estimatedHours?: number;
  budget?: number;
  projectLead?: string;
  clientName?: string;
  teamMembers?: Array<string | { name: string; email: string; role?: string }>;
  tags?: string[];
  goals?: string[];
  visibility?: "private" | "team" | "public";
  requiresApproval?: boolean;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStats {
  total: number;
  active: number;
  planning: number;
  completed: number;
  onHold: number;
  archived: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  avg_progress: number;
}

interface ProjectStore {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  addProject: (projectData: Omit<Project, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => void;
  removeProject: (id: number) => void;
  updateProject: (id: number, updates: Partial<Project>) => void;
  updateProjectStatus: (id: number, status: Project["status"]) => void;
  updateProjectProgress: (id: number, progress: number) => void;
  getProjectById: (id: number) => Project | undefined;
  getUserProjects: () => Project[];
  getProjectsByStatus: (status: Project["status"]) => Project[];
  getProjectsByPriority: (priority: Project["priority"]) => Project[];
  getProjectStats: () => {
    total: number;
    active: number;
    completed: number;
    planning: number;
    onHold: number;
    archived: number;
  };
  // Add these new methods
  fetchProjects: () => Promise<void>;
  getActiveProjects: () => Project[];
  getHighPriorityProjects: () => Project[];
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,
  
  // Add fetch projects method
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectsApi.getAll();
      set({ projects, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      set({ error: 'Failed to fetch projects', isLoading: false });
    }
  },
  
  // Add getActiveProjects method
  getActiveProjects: () => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    return get().projects.filter(p => p.ownerId === user.id && p.status === "active");
  },
  
  // Add getHighPriorityProjects method
  getHighPriorityProjects: () => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    return get().projects.filter(p => 
      p.ownerId === user.id && 
      (p.priority === "high" || p.priority === "urgent")
    );
  },
  
  // Keep your existing methods
  addProject: async (projectData) => {
    try {
      const response = await axios.post('/api/projects', {
        name: projectData.name,
        description: projectData.description,
        startDate: projectData.startDate,
        dueDate: projectData.dueDate,
        priority: projectData.priority,
        status: projectData.status,
        progress: projectData.progress,
        visibility: projectData.visibility,
        requiresApproval: projectData.requiresApproval,
      });
      
      set((state) => ({
        projects: [...state.projects, response.data],
      }));
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  },
  
  removeProject: (id: number) => {
    set((state) => ({ projects: state.projects.filter((project) => project.id !== id) }));
  },
  
  updateProject: (id: number, updates: Partial<Project>) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id 
          ? { ...project, ...updates, updatedAt: new Date().toISOString() } 
          : project
      ),
    }));
  },
  
  updateProjectStatus: (id: number, status: Project["status"]) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id 
          ? { ...project, status, updatedAt: new Date().toISOString() } 
          : project
      ),
    }));
  },
  
  updateProjectProgress: (id: number, progress: number) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id 
          ? { ...project, progress, updatedAt: new Date().toISOString() } 
          : project
      ),
    }));
  },
  
  getProjectById: (id: number) => {
    return get().projects.find(project => project.id === id);
  },
  
  getUserProjects: () => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    return get().projects.filter(p => p.ownerId === user.id);
  },
  
  getProjectsByStatus: (status: Project["status"]) => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    return get().projects.filter(p => p.ownerId === user.id && p.status === status);
  },
  
  getProjectsByPriority: (priority: Project["priority"]) => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    return get().projects.filter(p => p.ownerId === user.id && p.priority === priority);
  },
  
  getProjectStats: () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      return {
        total: 0,
        active: 0,
        completed: 0,
        planning: 0,
        onHold: 0,
        archived: 0,
      };
    }
    
    const userProjects = get().projects.filter(p => p.ownerId === user.id);
    
    return {
      total: userProjects.length,
      active: userProjects.filter(p => p.status === "active").length,
      completed: userProjects.filter(p => p.status === "completed").length,
      planning: userProjects.filter(p => p.status === "planning").length,
      onHold: userProjects.filter(p => p.status === "onHold").length,
      archived: userProjects.filter(p => p.status === "archived").length,
    };
  },
}));


