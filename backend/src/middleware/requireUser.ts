import type { NextFunction, Request, Response } from "express";

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const raw = req.header("x-user-id");
  const userId = Number(raw);

  if (!raw || Number.isNaN(userId) || userId <= 0) {
    return res.status(401).json({
      message: "Unauthorized. Send x-user-id header with a valid numeric user id.",
    });
  }

  req.userId = userId;
  return next();
}
