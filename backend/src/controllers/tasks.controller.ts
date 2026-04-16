import type { Request, Response } from "express";
import { HttpError } from "../utils/httpError.js";
import {
  createTask,
  deleteTaskByIdAndUserId,
  getTaskByIdAndUserIdPublic,
  getTasksByUserId,
  getTasksByProjectIdAndUserId,
  updateTaskByIdAndUserId,
} from "../services/tasks.service.js";
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskIdParamSchema,
  updateTaskSchema,
} from "../validators/task.validators.js";

export async function getTasksHandler(req: Request, res: Response) {
  const userId = req.userId!;
  const { projectId } = listTasksQuerySchema.parse(req.query);

  const tasks = projectId
    ? await getTasksByProjectIdAndUserId(projectId, userId)
    : await getTasksByUserId(userId);

  return res.json(tasks);
}

export async function getTaskByIdHandler(req: Request, res: Response) {
  const userId = req.userId!;
  const { id } = taskIdParamSchema.parse(req.params);

  const task = await getTaskByIdAndUserIdPublic(id, userId);

  if (!task) {
    throw new HttpError(404, "Task not found");
  }

  return res.json(task);
}

export async function createTaskHandler(req: Request, res: Response) {
  const userId = req.userId!;
  const payload = createTaskSchema.parse(req.body);

  const task = await createTask({
    title: payload.title,
    projectId: payload.projectId,
    userId,
    assignedTo: payload.assignedTo,
    dueDate: payload.dueDate,
  });

  if (!task) {
    throw new HttpError(404, "Project not found");
  }

  return res.status(201).json(task);
}

export async function updateTaskHandler(req: Request, res: Response) {
  const userId = req.userId!;
  const { id } = taskIdParamSchema.parse(req.params);
  const payload = updateTaskSchema.parse(req.body);

  const task = await updateTaskByIdAndUserId({
    id,
    userId,
    title: payload.title,
    status: payload.status,
    assignedTo: payload.assignedTo,
    dueDate: payload.dueDate,
    position: payload.position,
  });

  if (!task) {
    throw new HttpError(404, "Task not found");
  }

  return res.json(task);
}

export async function deleteTaskHandler(req: Request, res: Response) {
  const userId = req.userId!;
  const { id } = taskIdParamSchema.parse(req.params);

  const deleted = await deleteTaskByIdAndUserId(id, userId);

  if (!deleted) {
    throw new HttpError(404, "Task not found");
  }

  return res.status(204).send();
}
