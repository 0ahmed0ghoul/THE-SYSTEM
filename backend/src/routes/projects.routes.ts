import { Router } from "express";
import { ProjectsController } from "../controllers/projects.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const projectsRouter = Router();

// Create controller instance
const projectsController = new ProjectsController();

// Protect all routes
projectsRouter.use(authMiddleware);

// Routes
projectsRouter.get(
  "/",
  asyncHandler(projectsController.getAllProjects)
);

projectsRouter.post(
  "/",
  asyncHandler(projectsController.createProject)
);

projectsRouter.get(
  "/:id",
  asyncHandler(projectsController.getProjectById)
);

projectsRouter.patch(
  "/:id",
  asyncHandler(projectsController.updateProject)
);

projectsRouter.delete(
  "/:id",
  asyncHandler(projectsController.deleteProject)
);

// Optional: stats route
projectsRouter.get(
  "/stats/overview",
  asyncHandler(projectsController.getProjectStats)
);