// backend/src/services/auth.service.ts

import { db } from "../config/db.js";
import bcrypt from "bcrypt";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { HttpError } from "../utils/httpError.js";

/**
 * =========================
 * TYPES
 * =========================
 */

export interface UserRow extends RowDataPacket {
  id: number;
  name: string | null;
  email: string;
  password_hash: string | null;
  bio?: string;
  avatar?: string;
  phone?: string;
  role?: string;
  is_profile_complete: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * =========================
 * FIND USER
 * =========================
 */
export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const [rows] = await db.execute<UserRow[]>(
    `SELECT * FROM users WHERE email = ? LIMIT 1`,
    [email.toLowerCase()]
  );

  return rows.length ? rows[0] : null;
}

export async function findUserById(id: number): Promise<UserRow | null> {
  const [rows] = await db.execute<UserRow[]>(
    `SELECT * FROM users WHERE id = ? LIMIT 1`,
    [id]
  );

  return rows.length ? rows[0] : null;
}

/**
 * =========================
 * CREATE USER (FIXED)
 * =========================
 */
export async function createUser(input: {
  name?: string;
  email: string;
  password?: string | null;
}): Promise<UserRow> {
  const email = input.email.toLowerCase();

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new HttpError(409, "Email already exists");
  }

  const passwordHash =
    input.password ? await bcrypt.hash(input.password, 10) : null;

  const [result] = await db.execute<ResultSetHeader>(
    `
    INSERT INTO users (name, email, password_hash, is_profile_complete)
    VALUES (?, ?, ?, 0)
    `,
    [input.name || null, email, passwordHash]
  );

  const user = await findUserById(result.insertId);

  if (!user) {
    throw new HttpError(500, "User creation failed");
  }

  return user;
}

/**
 * =========================
 * LOGIN USER
 * =========================
 */
export async function loginUser(input: {
  email: string;
  password: string;
}) {
  const user = await findUserByEmail(input.email);

  if (!user || !user.password_hash) {
    throw new HttpError(401, "Invalid credentials");
  }

  const isValid = await bcrypt.compare(
    input.password,
    user.password_hash
  );

  if (!isValid) {
    throw new HttpError(401, "Invalid credentials");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || "user",
    is_profile_complete: user.is_profile_complete,
  };
}

/**
 * =========================
 * COMPLETE PROFILE (FIXED)
 * =========================
 */
export async function completeProfileService(input: {
  userId: number;
  name?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
}) {
  const user = await findUserById(input.userId);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  const updates: string[] = [];
  const values: any[] = [];

  if (input.name !== undefined) {
    updates.push("name = ?");
    values.push(input.name);
  }

  if (input.bio !== undefined) {
    updates.push("bio = ?");
    values.push(input.bio);
  }

  if (input.avatar !== undefined) {
    updates.push("avatar = ?");
    values.push(input.avatar);
  }

  if (input.phone !== undefined) {
    updates.push("phone = ?");
    values.push(input.phone);
  }

  updates.push("is_profile_complete = 1");

  values.push(input.userId);

  await db.execute(
    `
    UPDATE users
    SET ${updates.join(", ")}
    WHERE id = ?
    `,
    values
  );

  const updated = await findUserById(input.userId);

  return updated;
}