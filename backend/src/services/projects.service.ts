import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db.js";

export interface Project {
  id: number;
  name: string;
  description: string | null;
  user_id: number;
  created_at: string;
}

export async function createProject(input: {
  name: string;
  description?: string;
  userId: number;
}): Promise<Project> {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)`,
    [input.name, input.description ?? null, input.userId],
  );

  const [rows] = await db.execute<(Project & RowDataPacket)[]>(
    `SELECT id, name, description, user_id, created_at FROM projects WHERE id = ? LIMIT 1`,
    [result.insertId],
  );

  return rows[0];
}

export async function getProjectsByUserId(userId: number): Promise<Project[]> {
  const [rows] = await db.execute<(Project & RowDataPacket)[]>(
    `SELECT id, name, description, user_id, created_at
     FROM projects
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId],
  );

  return rows;
}

export async function getProjectByIdAndUserId(
  id: number,
  userId: number,
): Promise<Project | null> {
  const [rows] = await db.execute<(Project & RowDataPacket)[]>(
    `SELECT id, name, description, user_id, created_at
     FROM projects
     WHERE id = ? AND user_id = ?
     LIMIT 1`,
    [id, userId],
  );

  return rows[0] ?? null;
}

export async function deleteProjectByIdAndUserId(
  id: number,
  userId: number,
): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    `DELETE FROM projects WHERE id = ? AND user_id = ?`,
    [id, userId],
  );

  return result.affectedRows > 0;
}

export async function updateProjectByIdAndUserId(input: {
  id: number;
  userId: number;
  name?: string;
  description?: string;
}): Promise<Project | null> {
  const updates: string[] = [];
  const values: Array<number | string | null> = [];

  if (input.name !== undefined) {
    updates.push("name = ?");
    values.push(input.name);
  }

  if (input.description !== undefined) {
    updates.push("description = ?");
    values.push(input.description || null);
  }

  if (updates.length === 0) {
    return getProjectByIdAndUserId(input.id, input.userId);
  }

  values.push(input.id, input.userId);

  const [result] = await db.execute<ResultSetHeader>(
    `UPDATE projects
     SET ${updates.join(", ")}
     WHERE id = ? AND user_id = ?`,
    values,
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getProjectByIdAndUserId(input.id, input.userId);
}
