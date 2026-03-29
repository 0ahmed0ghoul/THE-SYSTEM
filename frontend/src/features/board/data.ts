import type { Task } from "./types";

export const initialTasks: Task[] = [
  { id: 1, title: "Setup project", status: "todo", position: 1, projectId: 1, priority: "medium" },
  { id: 2, title: "Build auth", status: "in-progress", position: 2, projectId: 1, priority: "medium" },
  { id: 3, title: "Design UI", status: "done", position: 3, projectId: 1 , priority: "medium" },
];