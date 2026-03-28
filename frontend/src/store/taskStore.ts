// frontend/src/store/taskStore.ts
import { create } from "zustand";
import { useAuthStore } from "./authStore";

export type TaskStatus = "todo" | "inprogress" | "done";

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  status: TaskStatus;
  ownerId: number;
  priority?: "low" | "medium" | "high";
  isDragging?: boolean;
  dueDate?: string; // ISO date string
  createdAt: string; // Added createdAt property
}

export const useTaskStore = create<{
  tasks: Task[];
  addTask: (projectId: number, title: string, description?: string, priority?: "low" | "medium" | "high") => void;
  updateTaskStatus: (taskId: number, status: TaskStatus) => void;
  removeTask: (taskId: number) => void;
  getProjectTasks: (projectId: number) => Task[];
}>((set, get) => ({
  tasks: [],

  addTask: (projectId, title, description, priority = "medium") => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const newTask: Task = {
      id: Date.now(), // Better than tasks.length + 1 for unique IDs
      projectId,
      title,
      description,
      status: "todo",
      ownerId: user.id,
      priority, // Add priority from parameter
      createdAt: new Date().toISOString(), // Add createdAt timestamp
    };

    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  updateTaskStatus: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map(t =>
        t.id === taskId ? { ...t, status } : t
      ),
    }));
  },

  removeTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter(t => t.id !== taskId),
    }));
  },

  getProjectTasks: (projectId) => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    return get().tasks.filter(
      t => t.projectId === projectId && t.ownerId === user.id
    );
  }
}));