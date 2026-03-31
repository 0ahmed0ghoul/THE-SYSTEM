// auth.service.ts
import { db } from '../config/db.js';
import bcrypt from 'bcrypt';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { HttpError } from '../utils/httpError.js';

export interface User {
  id: number
  email: string;
}

// Extend RowDataPacket for SELECT queries
interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password_hash: string;
  name?: string;
}

// ✅ Login user
export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<User> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required");
  }

  // ✅ Properly type the SELECT query result
  const [rows] = await db.execute<UserRow[]>(
    `SELECT id, email, password_hash FROM users WHERE email = ? LIMIT 1`,
    [email]
  );

  if (rows.length === 0) {
    throw new HttpError(401, "Invalid email or password");
  }

  const user = rows[0];
  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new HttpError(401, "Invalid email or password");
  }

  return {
    id: user.id,
    email: user.email,
  };
}

// ✅ Register user
export async function registerUser(input: {
  name?: string;
  email: string;
  password: string;
}): Promise<User> {
  const email = input.email.trim().toLowerCase();
  const name = input.name?.trim() || null;

  // ✅ Properly type the SELECT query result
  const [existingRows] = await db.execute<UserRow[]>(
    `SELECT id, email, password_hash FROM users WHERE email = ? LIMIT 1`,
    [email]
  );

  if (existingRows.length > 0) {
    throw new HttpError(409, "Email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  let query: string;
  let params: any[];

  if (name) {
    query = `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`;
    params = [name, email, passwordHash];
  } else {
    query = `INSERT INTO users (email, password_hash) VALUES (?, ?)`;
    params = [email, passwordHash];
  }

  // ✅ Properly type the INSERT query result
  const [result] = await db.execute<ResultSetHeader>(query, params);

  return {
    id: result.insertId,
    email,
  };
}