import type { Task } from "./types";

export const initialTasks: Task[] = [
  { id: 1, title: "Setup project", status: "todo", position: 1, projectId: "project-1" },
  { id: 2, title: "Build auth", status: "in-progress", position: 2, projectId: "project-1" },
  { id: 3, title: "Design UI", status: "done", position: 3, projectId: "project-1" },
];