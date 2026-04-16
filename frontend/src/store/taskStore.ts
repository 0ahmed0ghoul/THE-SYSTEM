import { create } from "zustand";
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTaskById,
  getTasks,
  updateTask as updateTaskRequest,
  type ApiTask,
  type ApiTaskStatus,
} from "../features/tasks/services/tasks.api";

export type TaskStatus = "todo" | "inprogress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface SubTask {
  id: number;
  title: string;
  completed: boolean;
}

export interface Attachment {
  id: number;
  name: string;
  size: string;
  url: string;
}

export interface Comment {
  id: number;
  taskId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: number;
  projectName?: string;
  assignee?: {
    id: number;
    name: string;
    email: string;
  };
  dueDate?: string;
  tags?: string[];
  subtasks?: SubTask[];
  attachments?: Attachment[];
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export const getStatusDisplay = (status: TaskStatus): string => {
  const statusMap: Record<TaskStatus, string> = {
    todo: "To Do",
    inprogress: "In Progress",
    done: "Done",
  };
  return statusMap[status];
};

export const getStatusIcon = (status: TaskStatus): string => {
  const iconMap: Record<TaskStatus, string> = {
    todo: "📋",
    inprogress: "🔄",
    done: "✅",
  };
  return iconMap[status];
};

export const getStatusColor = (status: TaskStatus): string => {
  const colorMap: Record<TaskStatus, string> = {
    todo: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    inprogress: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400",
    done: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
  };
  return colorMap[status];
};

export const getPriorityDisplay = (priority: TaskPriority): string => {
  const priorityMap: Record<TaskPriority, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };
  return priorityMap[priority];
};

export const getPriorityColor = (priority: TaskPriority): string => {
  const colorMap: Record<TaskPriority, string> = {
    low: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
    medium: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400",
    high: "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400",
    urgent: "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400",
  };
  return colorMap[priority];
};

export const getPriorityIcon = (priority: TaskPriority): string => {
  const iconMap: Record<TaskPriority, string> = {
    low: "🔵",
    medium: "🟡",
    high: "🟠",
    urgent: "🔴",
  };
  return iconMap[priority];
};

export const COLUMNS: { id: TaskStatus; title: string; icon: string }[] = [
  { id: "todo", title: "To Do", icon: "📋" },
  { id: "inprogress", title: "In Progress", icon: "🔄" },
  { id: "done", title: "Done", icon: "✅" },
];

interface TaskStore {
  tasks: Task[];
  isLoaded: boolean;
  loadTasks: (projectId?: number) => Promise<void>;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  getTaskById: (id: number) => Task | undefined;
  getProjectTasks: (projectId: number) => Task[];
  addComment: (taskId: number, comment: Comment) => void;
  toggleSubtask: (taskId: number, subtaskId: number) => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  getTaskStats: () => {
    total: number;
    todo: number;
    inprogress: number;
    done: number;
    highPriority: number;
    urgent: number;
  };
  clearTasks: () => void;
}

function toUiStatus(status: ApiTaskStatus): TaskStatus {
  if (status === "in-progress") {
    return "inprogress";
  }
  return status;
}

function toApiStatus(status: TaskStatus): ApiTaskStatus {
  if (status === "inprogress") {
    return "in-progress";
  }
  return status;
}

function toUiTask(task: ApiTask): Task {
  return {
    id: Number(task.id),
    title: task.title,
    status: toUiStatus(task.status),
    priority: "medium",
    projectId: Number(task.project_id),
    dueDate: task.due_date ?? undefined,
    assignee: task.assigned_to
      ? {
          id: Number(task.assigned_to),
          name: `User ${task.assigned_to}`,
          email: "",
        }
      : undefined,
    tags: [],
    subtasks: [],
    attachments: [],
    comments: [],
    createdAt: task.created_at,
    updatedAt: task.created_at,
  };
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoaded: false,

  loadTasks: async (projectId?: number) => {
    const tasks = await getTasks(projectId);
    set({ tasks: tasks.map(toUiTask), isLoaded: true });
  },

  addTask: async (task) => {
    const created = await createTaskRequest({
      title: task.title,
      projectId: task.projectId,
      assignedTo: task.assignee?.id,
      dueDate: task.dueDate,
    });

    const createdTask: Task = {
      ...toUiTask(created),
      ...task,
      title: created.title,
      projectId: Number(created.project_id),
      status: toUiStatus(created.status),
      createdAt: created.created_at,
      updatedAt: created.created_at,
    };

    set((state) => ({ tasks: [...state.tasks, createdTask] }));
  },

  updateTask: async (id, updates) => {
    const previous = get().tasks;

    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task,
      ),
    }));

    try {
      const payload: {
        title?: string;
        status?: ApiTaskStatus;
        assignedTo?: number | null;
        dueDate?: string | null;
        position?: number;
      } = {};

      if (updates.title !== undefined) {
        payload.title = updates.title;
      }
      if (updates.status !== undefined) {
        payload.status = toApiStatus(updates.status);
      }
      if (updates.assignee !== undefined) {
        payload.assignedTo = updates.assignee?.id ?? null;
      }
      if (updates.dueDate !== undefined) {
        payload.dueDate = updates.dueDate ?? null;
      }

      if (Object.keys(payload).length > 0) {
        const updated = await updateTaskRequest(id, payload);
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  title: updated.title,
                  status: toUiStatus(updated.status),
                  projectId: Number(updated.project_id),
                  dueDate: updated.due_date ?? undefined,
                  updatedAt: new Date().toISOString(),
                }
              : task,
          ),
        }));
      }
    } catch (error) {
      set({ tasks: previous });
      throw error;
    }
  },

  deleteTask: async (id) => {
    await deleteTaskRequest(id);
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
  },

  getTaskById: (id) => {
    const localTask = get().tasks.find((task) => task.id === id);
    if (localTask) {
      return localTask;
    }

    getTaskById(id)
      .then((task) => {
        set((state) => {
          const exists = state.tasks.some((existingTask) => existingTask.id === task.id);
          if (exists) {
            return state;
          }

          return { tasks: [...state.tasks, toUiTask(task)] };
        });
      })
      .catch(() => {
        // Ignore background lookup failures; route-level UI handles missing task.
      });

    return undefined;
  },

  getProjectTasks: (projectId) => {
    return get().tasks.filter((task) => task.projectId === projectId);
  },

  getTasksByStatus: (status) => {
    return get().tasks.filter((task) => task.status === status);
  },

  getTasksByPriority: (priority) => {
    return get().tasks.filter((task) => task.priority === priority);
  },

  getTaskStats: () => {
    const tasks = get().tasks;
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inprogress: tasks.filter((t) => t.status === "inprogress").length,
      done: tasks.filter((t) => t.status === "done").length,
      highPriority: tasks.filter((t) => t.priority === "high").length,
      urgent: tasks.filter((t) => t.priority === "urgent").length,
    };
  },

  addComment: (taskId, comment) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, comments: [...(task.comments || []), comment] } : task,
      ),
    }));
  },

  toggleSubtask: (taskId, subtaskId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId && task.subtasks
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask,
              ),
            }
          : task,
      ),
    }));
  },

  clearTasks: () => {
    set({ tasks: [], isLoaded: false });
  },
}));
