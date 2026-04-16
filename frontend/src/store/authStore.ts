import { create } from "zustand";
import { useProjectStore } from "./projectStore";
import { useTaskStore } from "./taskStore";

const AUTH_TOKEN_KEY = "auth_token";

export interface User {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  position?: string;
  department?: string;
  bio?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  avatar?: string; // Added avatar property
  id?: number; // Added id property
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    useProjectStore.getState().clearProjects();
    useTaskStore.getState().clearTasks();
    set({ user: null });
  },
}));

