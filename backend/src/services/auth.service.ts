import bcrypt from "bcryptjs";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db.js";
import { HttpError } from "../utils/httpError.js";

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password_hash: string;
}

export interface AuthResponse {
  message?: string;
  user: User;
  token: string;
}

export interface PublicUser {
  user: {
    id: number;
    email: string;
  }
  message?: string;
}

export interface User {
  id: number;
  email: string;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  const [existingRows] = await db.execute<UserRow[]>(
    `SELECT id, email, password_hash FROM users WHERE email = ? LIMIT 1`,
    [email],
  );

  if (existingRows.length > 0) {
    throw new HttpError(409, "Email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`,
    [name, email, passwordHash],
  );

  // Return ONLY the user object without message wrapper
  return {
    id: Number(result.insertId),
    email,
  };
}
export async function loginUser() {

}

export async function getUserById(){

}
