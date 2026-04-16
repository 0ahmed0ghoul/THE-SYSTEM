import { create } from "zustand";
import { useAuthStore } from "./authStore";
import {
  createProject as createProjectRequest,
  deleteProject as deleteProjectRequest,
  getProjects,
  updateProject as updateProjectRequest,
} from "../features/projects/services/projects.api";
import type { Project as ApiProject } from "../features/projects/types";

export const statsData = {
  totalProjects: 10,
  activeProjects: 6,
  completedTasks: 48,
  totalTasks: 75,
  pendingTasks: 27,
  teamMembers: 12,
};

export interface Project {
  id: number;
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

interface ProjectStore {
  projects: Project[];
  isLoaded: boolean;
  loadProjects: () => Promise<void>;
  addProject: (projectData: Omit<Project, "id" | "ownerId" | "createdAt" | "updatedAt">) => Promise<void>;
  removeProject: (id: number) => Promise<void>;
  updateProject: (id: number, updates: Partial<Project>) => Promise<void>;
  updateProjectStatus: (id: number, status: Project["status"]) => Promise<void>;
  updateProjectProgress: (id: number, progress: number) => Promise<void>;
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
  clearProjects: () => void;
}

function toUiProject(project: ApiProject): Project {
  return {
    id: Number(project.id),
    name: project.name,
    description: project.description ?? "",
    status: "planning",
    priority: "medium",
    progress: 0,
    visibility: "private",
    requiresApproval: false,
    teamMembers: [],
    tags: [],
    goals: [],
    ownerId: Number(project.user_id),
    startDate: project.created_at,
    createdAt: project.created_at,
    updatedAt: project.created_at,
  };
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  isLoaded: false,

  loadProjects: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      set({ projects: [], isLoaded: true });
      return;
    }

    const projects = await getProjects();
    set({ projects: projects.map(toUiProject), isLoaded: true });
  },

  addProject: async (projectData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const created = await createProjectRequest({
      name: projectData.name,
      description: projectData.description,
    });

    const createdProject = {
      ...toUiProject(created),
      ...projectData,
      name: created.name,
      description: created.description ?? "",
      ownerId: Number(created.user_id),
      createdAt: created.created_at,
      updatedAt: created.created_at,
    };

    set((state) => ({ projects: [...state.projects, createdProject] }));
  },

  removeProject: async (id: number) => {
    await deleteProjectRequest(id);
    set((state) => ({ projects: state.projects.filter((project) => project.id !== id) }));
  },

  updateProject: async (id: number, updates: Partial<Project>) => {
    const before = get().projects;

    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project,
      ),
    }));

    try {
      const payload: { name?: string; description?: string } = {};
      if (updates.name !== undefined) {
        payload.name = updates.name;
      }
      if (updates.description !== undefined) {
        payload.description = updates.description;
      }

      if (Object.keys(payload).length > 0) {
        const updated = await updateProjectRequest(id, payload);
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? {
                  ...project,
                  name: updated.name,
                  description: updated.description ?? "",
                  updatedAt: new Date().toISOString(),
                }
              : project,
          ),
        }));
      }
    } catch (error) {
      set({ projects: before });
      throw error;
    }
  },

  updateProjectStatus: async (id: number, status: Project["status"]) => {
    await get().updateProject(id, { status });
  },

  updateProjectProgress: async (id: number, progress: number) => {
    await get().updateProject(id, { progress });
  },

  getProjectById: (id: number) => {
    return get().projects.find((project) => project.id === id);
  },

  getUserProjects: () => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    return get().projects.filter((p) => p.ownerId === user.id);
  },

  getProjectsByStatus: (status: Project["status"]) => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    return get().projects.filter((p) => p.ownerId === user.id && p.status === status);
  },

  getProjectsByPriority: (priority: Project["priority"]) => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    return get().projects.filter((p) => p.ownerId === user.id && p.priority === priority);
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

    const userProjects = get().projects.filter((p) => p.ownerId === user.id);

    return {
      total: userProjects.length,
      active: userProjects.filter((p) => p.status === "active").length,
      completed: userProjects.filter((p) => p.status === "completed").length,
      planning: userProjects.filter((p) => p.status === "planning").length,
      onHold: userProjects.filter((p) => p.status === "onHold").length,
      archived: userProjects.filter((p) => p.status === "archived").length,
    };
  },

  clearProjects: () => {
    set({ projects: [], isLoaded: false });
  },
}));
