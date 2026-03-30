import type { NextFunction, Request, Response } from "express";
import { verifyUserToken } from "../utils/jwt.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("authorization") ?? "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = verifyUserToken(token);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
