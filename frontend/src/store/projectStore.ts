import { create } from "zustand";
import { useAuthStore } from "./authStore";

export interface Project {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
}

export const useProjectStore = create<{
  projects: Project[];
  addProject: (name: string, description?: string) => void;
  removeProject: (id: number) => void;
  getUserProjects: () => Project[];
}>((set, get) => ({
  projects: [],
  
  addProject: (name, description) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const newProject: Project = {
      id: get().projects.length + 1,
      name,
      description,
      ownerId: user.id,
    };

    set((state) => ({ projects: [...state.projects, newProject] }));
  },

  removeProject: (id) => {
    set((state) => ({ projects: state.projects.filter(p => p.id !== id) }));
  },

  getUserProjects: () => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    return get().projects.filter(p => p.ownerId === user.id);
  }
}));