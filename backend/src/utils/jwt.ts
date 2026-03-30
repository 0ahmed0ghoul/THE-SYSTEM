import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

interface JwtPayload {
  sub: number;
  email: string;
}

export function signUserToken(user: { id: number; email: string }) {
  const expiresIn = env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"];

  return jwt.sign(
    { sub: user.id, email: user.email },
    env.JWT_SECRET,
    { expiresIn },
  );
}

export function verifyUserToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded !== "object" || !decoded) {
    throw new Error("Invalid token payload");
  }

  const sub = Number(decoded.sub);
  const email = String(decoded.email ?? "");

  if (Number.isNaN(sub) || sub <= 0 || !email) {
    throw new Error("Invalid token payload");
  }

  return { sub, email };
}
