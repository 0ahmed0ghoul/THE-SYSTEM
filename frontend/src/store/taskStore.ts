// frontend/src/features/store/taskStore.ts
import { create } from "zustand";

// ✅ Task Status Type - Export this for use across the app
export type TaskStatus = "todo" | "inprogress" | "done";

// ✅ Task Priority Type
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
  status: TaskStatus;  // ✅ Use TaskStatus type
  priority: TaskPriority;  // ✅ Use TaskPriority type
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

// ✅ Helper function to get status display text
export const getStatusDisplay = (status: TaskStatus): string => {
  const statusMap: Record<TaskStatus, string> = {
    todo: "To Do",
    inprogress: "In Progress",
    done: "Done",
  };
  return statusMap[status];
};

// ✅ Helper function to get status icon
export const getStatusIcon = (status: TaskStatus): string => {
  const iconMap: Record<TaskStatus, string> = {
    todo: "📋",
    inprogress: "🔄",
    done: "✅",
  };
  return iconMap[status];
};

// ✅ Helper function to get status color classes
export const getStatusColor = (status: TaskStatus): string => {
  const colorMap: Record<TaskStatus, string> = {
    todo: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    inprogress: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400",
    done: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
  };
  return colorMap[status];
};

// ✅ Helper function to get priority display text
export const getPriorityDisplay = (priority: TaskPriority): string => {
  const priorityMap: Record<TaskPriority, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };
  return priorityMap[priority];
};

// ✅ Helper function to get priority color classes
export const getPriorityColor = (priority: TaskPriority): string => {
  const colorMap: Record<TaskPriority, string> = {
    low: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400",
    medium: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400",
    high: "bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400",
    urgent: "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400",
  };
  return colorMap[priority];
};

// ✅ Helper function to get priority icon
export const getPriorityIcon = (priority: TaskPriority): string => {
  const iconMap: Record<TaskPriority, string> = {
    low: "🔵",
    medium: "🟡",
    high: "🟠",
    urgent: "🔴",
  };
  return iconMap[priority];
};

// ✅ Column configuration for Kanban board
export const COLUMNS: { id: TaskStatus; title: string; icon: string }[] = [
  { id: "todo", title: "To Do", icon: "📋" },
  { id: "inprogress", title: "In Progress", icon: "🔄" },
  { id: "done", title: "Done", icon: "✅" },
];

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  getTaskById: (id: number) => Task | undefined;
  getProjectTasks: (projectId: number) => Task[];
  addComment: (taskId: number, comment: Comment) => void;
  toggleSubtask: (taskId: number, subtaskId: number) => void;
  // ✅ Additional useful methods
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
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [
    // Sample tasks
    {
      id: 1,
      title: "Complete API documentation",
      description: "Write comprehensive API documentation for the new endpoints",
      status: "inprogress",
      priority: "high",
      projectId: 3,
      projectName: "API Integration",
      assignee: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      },
      dueDate: "2026-04-15",
      tags: ["api", "documentation"],
      subtasks: [
        { id: 1, title: "Review existing docs", completed: true },
        { id: 2, title: "Write endpoint descriptions", completed: false },
        { id: 3, title: "Add code examples", completed: false },
      ],
      attachments: [
        { id: 1, name: "api-spec.pdf", size: "2.3 MB", url: "#" },
      ],
      comments: [
        {
          id: 1,
          taskId: 1,
          userId: 2,
          userName: "Jane Smith",
          content: "Don't forget to include authentication details",
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Design system components",
      description: "Create reusable React components for buttons, modals, and forms",
      status: "todo",
      priority: "medium",
      projectId: 10,
      projectName: "Design System",
      assignee: {
        id: 3,
        name: "Mike Johnson",
        email: "mike@example.com",
      },
      dueDate: "2026-04-20",
      tags: ["design", "ui", "components"],
      subtasks: [
        { id: 4, title: "Design button variants", completed: false },
        { id: 5, title: "Create modal component", completed: false },
      ],
      attachments: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "User testing session",
      description: "Conduct user testing for the mobile app redesign",
      status: "done",
      priority: "high",
      projectId: 2,
      projectName: "Mobile App Redesign",
      assignee: {
        id: 4,
        name: "Sarah Williams",
        email: "sarah@example.com",
      },
      dueDate: "2026-04-10",
      tags: ["testing", "ux"],
      subtasks: [
        { id: 6, title: "Recruit participants", completed: true },
        { id: 7, title: "Create test scenarios", completed: true },
        { id: 8, title: "Run testing sessions", completed: true },
      ],
      attachments: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  
  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
      ),
    }));
  },
  
  deleteTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
  },
  
  getTaskById: (id) => {
    return get().tasks.find((task) => task.id === id);
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
      todo: tasks.filter(t => t.status === "todo").length,
      inprogress: tasks.filter(t => t.status === "inprogress").length,
      done: tasks.filter(t => t.status === "done").length,
      highPriority: tasks.filter(t => t.priority === "high").length,
      urgent: tasks.filter(t => t.priority === "urgent").length,
    };
  },
  
  addComment: (taskId, comment) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, comments: [...(task.comments || []), comment] }
          : task
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
                  : subtask
              ),
            }
          : task
      ),
    }));
  },
}));