import type { Request, Response } from "express";
import { HttpError } from "../utils/httpError.js";
import { signUserToken } from "../utils/jwt.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import { loginSchema, registerSchema } from "../validators/auth.validators.js";

export async function registerHandler(req: Request, res: Response) {
  try {
    // ✅ Validate input
    const payload = registerSchema.parse(req.body);

    // ✅ Create user
    const user = await registerUser(payload);

    // ✅ Generate token
    const token = signUserToken(user);

    // ✅ Clean response (no sensitive data)
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email
      },
      token,
    });

  } catch (err: any) {
    // ✅ Zod validation errors
    if (err.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }

    // ✅ Custom HTTP errors (like email exists)
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        message: err.message,
      });
    }

    // ❌ Unknown error (don't expose details)
    console.error("Register Error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function loginHandler(req: Request, res: Response) {
  const payload = loginSchema.parse(req.body);
  const user = await loginUser(payload);
  const token = signUserToken(user);

  return res.json({ user, token });
}

// export async function meHandler(req: Request, res: Response) {
//   const userId = req.userId!;
//   const user = await getUserById(userId);

//   if (!user) {
//     throw new HttpError(404, "User not found");
//   }

//   return res.json({ user });
// }
