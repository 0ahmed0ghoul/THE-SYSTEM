import { api } from "../../../services/api";

export type ApiTaskStatus = "todo" | "in-progress" | "done";

export interface ApiTask {
  id: number;
  title: string;
  status: ApiTaskStatus;
  project_id: number;
  assigned_to: number | null;
  due_date: string | null;
  position: number;
  created_at: string;
}

export const getTasks = async (projectId?: number): Promise<ApiTask[]> => {
  const res = await api.get("/tasks", {
    params: projectId ? { projectId } : undefined,
  });

  return res.data;
};

export const getTaskById = async (id: number): Promise<ApiTask> => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

export const createTask = async (data: {
  title: string;
  projectId: number;
  assignedTo?: number;
  dueDate?: string;
}): Promise<ApiTask> => {
  const res = await api.post("/tasks", data);
  return res.data;
};

export const updateTask = async (
  id: number,
  data: {
    title?: string;
    status?: ApiTaskStatus;
    assignedTo?: number | null;
    dueDate?: string | null;
    position?: number;
  },
): Promise<ApiTask> => {
  const res = await api.patch(`/tasks/${id}`, data);
  return res.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
