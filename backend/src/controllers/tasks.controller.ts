import type { Request, Response } from "express";
import { HttpError } from "../utils/httpError.js";
import {
  createTask,
  deleteTaskByIdAndUserId,
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

  const tasks = await getTasksByProjectIdAndUserId(projectId, userId);
  return res.json(tasks);
}

export async function createTaskHandler(req: Request, res: Response) {
  const userId = req.userId!;
  const payload = createTaskSchema.parse(req.body);

  const task = await createTask({
    title: payload.title,
    projectId: payload.projectId,
    userId,
    assignedTo: payload.assignedTo,
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
