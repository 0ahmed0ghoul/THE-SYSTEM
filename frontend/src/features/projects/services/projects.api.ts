import apiClient from "../../../services/api.client";
import type { Project } from "../../../store/projectStore";

export const getProjects = async (): Promise<Project[]> => {
  const res = await apiClient.get("/projects");
  return res.data;
};

export const createProject = async (data: {
  name: string;
  description?: string;
}) => {
  const res = await apiClient.post("/projects", data);
  return res.data;
};