import { api } from "../../../services/api";
import type { Project } from "../types";

export const getProjects = async (): Promise<Project[]> => {
  const res = await api.get("/projects");
  return res.data;
};

export const createProject = async (data: {
  name: string;
  description?: string;
}) => {
  const res = await api.post("/projects", data);
  return res.data;
};