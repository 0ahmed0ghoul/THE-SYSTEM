// backend/src/handlers/projectHandler.ts
import type { Request, Response } from "express";
import {
  createProject,
  deleteProjectByIdAndUserId,
  getProjectByIdAndUserId,
  getProjectsByUserId,
  updateProjectByIdAndUserId,
} from "../services/projects.service.js";
import { HttpError } from "../utils/httpError.js";
import {
  createProjectSchema,
  projectIdParamSchema,
  updateProjectSchema,
} from "../validators/project.validators.js";

export async function createProjectHandler(req: Request, res: Response) {
  const userId = req.userId!;
  const payload = createProjectSchema.parse(req.body);

  const project = await createProject({
    name: payload.name,
    description: payload.description,
    startDate: payload.startDate,
    dueDate: payload.dueDate,
    priority: payload.priority,
    status: payload.status,
    progress: payload.progress,
    visibility: payload.visibility,
    requiresApproval: payload.requiresApproval,
    userId,
  });

  return res.status(201).json(project);
}

export async function getProjectsHandler(req: Request, res: Response) {
  const userId = req.userId!;
  const projects = await getProjectsByUserId(userId);
  return res.json(projects);
}

export async function getProjectByIdHandler(req: Request, res: Response) {
  const userId = req.userId!;
  const { id } = projectIdParamSchema.parse(req.params);

  const project = await getProjectByIdAndUserId(id, userId);

  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  return res.json(project);
}

export async function deleteProjectHandler(req: Request, res: Response) {
  const userId = req.userId!;
  const { id } = projectIdParamSchema.parse(req.params);

  const deleted = await deleteProjectByIdAndUserId(id, userId);

  if (!deleted) {
    throw new HttpError(404, "Project not found");
  }

  return res.status(204).send();
}

export async function updateProjectHandler(req: Request, res: Response) {
  const userId = req.userId!;
  const { id } = projectIdParamSchema.parse(req.params);
  const payload = updateProjectSchema.parse(req.body);

  const project = await updateProjectByIdAndUserId({
    id,
    userId,
    name: payload.name,
    description: payload.description,
  });

  if (!project) {
    throw new HttpError(404, "Project not found");
  }

  return res.json(project);
}