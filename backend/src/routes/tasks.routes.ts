import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createTaskHandler,
  deleteTaskHandler,
  getTasksHandler,
  updateTaskHandler,
} from "../controllers/tasks.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const tasksRouter = Router();

tasksRouter.use(authMiddleware);

tasksRouter.get("/", asyncHandler(getTasksHandler));
tasksRouter.post("/", asyncHandler(createTaskHandler));
tasksRouter.patch("/:id", asyncHandler(updateTaskHandler));
tasksRouter.delete("/:id", asyncHandler(deleteTaskHandler));
