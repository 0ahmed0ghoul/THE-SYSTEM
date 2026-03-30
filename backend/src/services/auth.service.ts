import bcrypt from "bcryptjs";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db.js";
import { HttpError } from "../utils/httpError.js";

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password_hash: string;
}

export interface PublicUser {
  id: number;
  email: string;
}

export async function registerUser(input: {
  email: string;
  password: string;
}): Promise<PublicUser> {
  const email = input.email.trim().toLowerCase();

  const [existingRows] = await db.execute<UserRow[]>(
    `SELECT id, email, password_hash FROM users WHERE email = ? LIMIT 1`,
    [email],
  );

  if (existingRows.length > 0) {
    throw new HttpError(409, "Email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO users (email, password_hash) VALUES (?, ?)`,
    [email, passwordHash],
  );

  return {
    id: Number(result.insertId),
    email,
  };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<PublicUser> {
  const email = input.email.trim().toLowerCase();

  const [rows] = await db.execute<UserRow[]>(
    `SELECT id, email, password_hash FROM users WHERE email = ? LIMIT 1`,
    [email],
  );

  const user = rows[0];

  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const matches = await bcrypt.compare(input.password, user.password_hash);

  if (!matches) {
    throw new HttpError(401, "Invalid credentials");
  }

  return {
    id: user.id,
    email: user.email,
  };
}

export async function getUserById(id: number): Promise<PublicUser | null> {
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT id, email FROM users WHERE id = ? LIMIT 1`,
    [id],
  );

  if (rows.length === 0) {
    return null;
  }

  return {
    id: Number(rows[0].id),
    email: String(rows[0].email),
  };
}
