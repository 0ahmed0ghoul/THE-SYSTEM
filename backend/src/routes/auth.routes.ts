import { Router } from "express";
import {
  loginHandler,
  meHandler,
  registerHandler,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authRouter = Router();

authRouter.post("/register", asyncHandler(registerHandler));
authRouter.post("/login", asyncHandler(loginHandler));

// Protected routes
authRouter.get('/me', authMiddleware, meHandler);
// authRouter.get("/me", authMiddleware, asyncHandler(meHandler));
