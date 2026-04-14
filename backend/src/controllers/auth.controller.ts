// backend/src/controllers/auth.controller.ts
import type { Request, Response } from "express";
import { HttpError } from "../utils/httpError.js";
import { completeProfileService, loginUser, createUser } from "../services/auth.service.js";
import { loginSchema, registerSchema } from "../validators/auth.validators.js";
import { signUserToken } from "../utils/jwt.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

type CompleteProfileBody = {
  name?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
};

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  is_profile_complete: number;
}



export async function registerHandler(req: Request, res: Response) {
  try {
    // ✅ Validate input
    const payload = registerSchema.parse(req.body);

    // ✅ Create user (returns { id, email })
    const user = await createUser({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });

    // ✅ Generate token
    const token = signUserToken(user);

    // ✅ Clean response (no sensitive data)
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      token,
    });

  } catch (err: any) {
    // ✅ Zod validation errors
    if (err.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.errors,
      });
    }

    // ✅ Custom HTTP errors (like email exists)
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    // ❌ Unknown error (don't expose details)
    console.error("Register Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    // ✅ Validate input
    const payload = loginSchema.parse(req.body);

    // ✅ Authenticate user (returns { id, email })
    const user = await loginUser({
      email: payload.email,
      password: payload.password,
    });

    // ✅ Generate token
    const token = signUserToken(user);

    // ✅ Return response
    return res.json({
      success: true,
      message: "Login successful",
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
        success: false,
        message: "Validation failed",
        errors: err.errors,
      });
    }

    // ✅ Custom HTTP errors (like invalid credentials)
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    // ❌ Unknown error
    console.error("Login Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function completeProfileHandler(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new HttpError(401, "Unauthorized");
    }

    const body = req.body as CompleteProfileBody;

    const user = await completeProfileService({
      userId,
      ...body,
    });

    return res.json({
      success: true,
      message: "Profile completed successfully",
      user,
    });
  } catch (err: any) {
    console.error("Complete Profile Error:", err);

    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
// Optional: Get current user handler
export async function meHandler(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // You would fetch full user details here if needed
    return res.json({
      success: true,
      user: {
        id: userId,
        email: (req as any).userEmail
      }
    });

  } catch (err: any) {
    console.error("Me Handler Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}