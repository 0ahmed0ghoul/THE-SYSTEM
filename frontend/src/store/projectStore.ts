import { create } from "zustand";
import { useAuthStore } from "./authStore";

export interface Project {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  status: "active" | "completed" | "archived";
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

interface ProjectStore {
  projects: Project[];
  addProject: (name: string, description?: string, dueDate?: string) => void;
  removeProject: (id: number) => void;
  updateProject: (id: number, name: string) => void;
  updateProjectStatus: (id: number, status: Project["status"]) => void;
  getProjectById: (id: number) => Project | undefined;
  getUserProjects: () => Project[];
  getProjectsByStatus: (status: Project["status"]) => Project[];
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  
  addProject: (name: string, description?: string, dueDate?: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    
    const newProject: Project = { 
      id: Date.now(), 
      name, 
      description, 
      dueDate,
      ownerId: user.id!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active",
      priority: "medium"
    };
    set((state) => ({ projects: [...state.projects, newProject] }));
  },
  
  removeProject: (id: number) => {
    set((state) => ({ projects: state.projects.filter((project) => project.id !== id) }));
  },
  
  updateProject: (id: number, name: string) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, name, updatedAt: new Date().toISOString() } : project
      ),
    }));
  },

  updateProjectStatus: (id: number, status: Project["status"]) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, status, updatedAt: new Date().toISOString() } : project
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
  }
}));