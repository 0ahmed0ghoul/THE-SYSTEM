import { api } from "../../../services/api";
import type { Project } from "../types";

export const getProjects = async (): Promise<Project[]> => {
  const res = await api.get("/projects");
  return res.data;
};

export const createProject = async (data: {
  name: string;
  description?: string;
}): Promise<Project> => {
  const res = await api.post("/projects", data);
  return res.data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const res = await api.get(`/projects/${id}`);
  return res.data;
};

export const updateProject = async (
  id: number,
  data: { name?: string; description?: string },
): Promise<Project> => {
  const res = await api.patch(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
};