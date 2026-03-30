import { Router } from "express";
import {
  createProjectHandler,
  deleteProjectHandler,
  getProjectByIdHandler,
  getProjectsHandler,
  updateProjectHandler,
} from "../controllers/projects.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const projectsRouter = Router();

projectsRouter.use(authMiddleware);

projectsRouter.get("/", asyncHandler(getProjectsHandler));
projectsRouter.post("/", asyncHandler(createProjectHandler));
projectsRouter.get("/:id", asyncHandler(getProjectByIdHandler));
projectsRouter.patch("/:id", asyncHandler(updateProjectHandler));
projectsRouter.delete("/:id", asyncHandler(deleteProjectHandler));
