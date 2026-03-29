// frontend/src/store/taskStore.ts
import { create } from "zustand";
import { useAuthStore } from "./authStore";

// ✅ Single source of truth
export type TaskStatus = "todo" | "inprogress" | "done";

export interface Task {
  assignedTo: unknown;
  id: number;
  projectId: number;
  title: string;
  description?: string;
  status: TaskStatus;
  ownerId: number;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
}

type TaskStore = {
  tasks: Task[];

  // CRUD
  addTask: (
    projectId: number,
    title: string,
    description?: string,
    priority?: "low" | "medium" | "high",
    status?: TaskStatus
  ) => void;

  updateTaskStatus: (taskId: number, status: TaskStatus) => void;

  updateTask: (taskId: number, data: Partial<Task>) => void;

  removeTask: (taskId: number) => void;

  // Selectors
  getProjectTasks: (projectId: number) => Task[];
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  // ✅ CREATE
  addTask: (
    projectId,
    title,
    description,
    priority = "medium",
    status = "todo"
  ) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const newTask: Task = {
      id: Date.now(), // simple unique id
      projectId,
      title,
      description,
      status,
      ownerId: user.id ?? 0, // Default to 0 or handle undefined appropriately
      assignedTo: null, // Default value for assignedTo
      priority,
      dueDate: undefined,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
  },

  // ✅ UPDATE STATUS (drag & drop)
  updateTaskStatus: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status } : t
      ),
    }));
  },

  // ✅ UPDATE FULL TASK (edit modal)
  updateTask: (taskId, data) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...data } : t
      ),
    }));
  },

  // ✅ DELETE
  removeTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    }));
  },

  // ✅ SELECTOR (per project + user)
  getProjectTasks: (projectId) => {
    const user = useAuthStore.getState().user;
    if (!user) return [];

    return get().tasks.filter(
      (t) => t.projectId === projectId && t.ownerId === user.id
    );
  },
}));