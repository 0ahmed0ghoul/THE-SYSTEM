import type { Request, Response } from "express";
import { HttpError } from "../utils/httpError.js";
import { signUserToken } from "../utils/jwt.js";
import { loginUser, registerUser, getUserById } from "../services/auth.service.js";
import { loginSchema, registerSchema } from "../validators/auth.validators.js";

export async function registerHandler(req: Request, res: Response) {
  const payload = registerSchema.parse(req.body);
  const user = await registerUser(payload);
  const token = signUserToken(user);

  return res.status(201).json({ user, token });
}

export async function loginHandler(req: Request, res: Response) {
  const payload = loginSchema.parse(req.body);
  const user = await loginUser(payload);
  const token = signUserToken(user);

  return res.json({ user, token });
}

export async function meHandler(req: Request, res: Response) {
  const userId = req.userId!;
  const user = await getUserById(userId);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return res.json({ user });
}
