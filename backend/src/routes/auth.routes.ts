import { Router } from "express";
import {
  completeProfileHandler,
  loginHandler,
  meHandler,
  registerHandler,
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import passport from "passport";
import { signUserToken } from "../utils/jwt.js";
import {
  createUser,
  findUserByEmail,
} from "../services/auth.service.js";

export const authRouter = Router();

/**
 * =========================
 * GOOGLE LOGIN
 * =========================
 */
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const googleUser = req.user as any;

      if (!googleUser?.email) {
        return res.redirect("http://localhost:5173/login");
      }

      // 1. Check if user exists in DB
      let dbUser = await findUserByEmail(googleUser.email);

      // 2. Create user if not exists
      if (!dbUser) {
        dbUser = await createUser({
          name: googleUser.name || "Google User",
          email: googleUser.email,
          password: null, // OAuth user
        });
      }

      if (!dbUser) {
        throw new Error("Failed to create or retrieve user");
      }

      // 3. IMPORTANT: sign token using DB user ID
      const token = signUserToken({
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role || "user",
      });

      // 4. Redirect to frontend
      return res.redirect(
        `http://localhost:5173/auth/google-success?token=${token}`
      );
    } catch (err) {
      console.error("Google callback error:", err);
      return res.redirect("http://localhost:5173/login");
    }
  }
);

/**
 * =========================
 * AUTH ROUTES
 * =========================
 */
authRouter.post("/register", asyncHandler(registerHandler));
authRouter.post("/login", asyncHandler(loginHandler));

authRouter.put(
  "/profile",
  authMiddleware,
  asyncHandler(completeProfileHandler)
);

/**
 * =========================
 * PROTECTED
 * =========================
 */
authRouter.get("/me", authMiddleware, meHandler);