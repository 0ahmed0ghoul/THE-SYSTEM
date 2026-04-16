import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskByIdHandler,
  getTasksHandler,
  updateTaskHandler,
} from "../controllers/tasks.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const tasksRouter = Router();

tasksRouter.use(authMiddleware);

tasksRouter.get("/", asyncHandler(getTasksHandler));
tasksRouter.post("/", asyncHandler(createTaskHandler));
tasksRouter.get("/:id", asyncHandler(getTaskByIdHandler));
tasksRouter.patch("/:id", asyncHandler(updateTaskHandler));
tasksRouter.delete("/:id", asyncHandler(deleteTaskHandler));
