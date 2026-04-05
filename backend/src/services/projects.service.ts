// backend/src/services/projects.service.ts

import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db.js";

export interface Project {
  id: number;
  name: string;
  description: string | null;
  start_date: string | null;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'planning' | 'active' | 'onHold' | 'completed' | 'archived';
  progress: number;
  visibility: 'private' | 'public';
  requires_approval: boolean;
  user_id: string | number;
  created_at: string;
  updated_at: string;
}

export async function createProject(input: {
  name: string;
  description?: string;
  startDate?: string | null;
  dueDate?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'planning' | 'active' | 'onHold' | 'completed' | 'archived';
  progress?: number;
  visibility?: 'private' | 'public';
  requiresApproval?: boolean;
  userId: number;
}): Promise<Project> {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO projects (
      name, description, start_date, due_date, priority, 
      status, progress, visibility, requires_approval, user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name,
      input.description ?? null,
      input.startDate ?? null,
      input.dueDate ?? null,
      input.priority ?? 'medium',
      input.status ?? 'planning',
      input.progress ?? 0,
      input.visibility ?? 'private',
      input.requiresApproval ?? false,
      input.userId,
    ],
  );

  const [rows] = await db.execute<(Project & RowDataPacket)[]>(
    `SELECT 
      id, name, description, start_date, due_date, priority,
      status, progress, visibility, requires_approval, 
      user_id, created_at, updated_at
    FROM projects WHERE id = ? LIMIT 1`,
    [result.insertId],
  );

  return rows[0];
}

export async function getProjectsByUserId(userId: number): Promise<Project[]> {
  const [rows] = await db.execute<(Project & RowDataPacket)[]>(
    `SELECT 
      id, name, description, start_date, due_date, priority,
      status, progress, visibility, requires_approval,
      user_id, created_at, updated_at
    FROM projects WHERE user_id = ? ORDER BY created_at DESC`,
    [userId],
  );
  return rows;
}

export async function getProjectByIdAndUserId(id: number, userId: number): Promise<Project | null> {
  const [rows] = await db.execute<(Project & RowDataPacket)[]>(
    `SELECT 
      id, name, description, start_date, due_date, priority,
      status, progress, visibility, requires_approval,
      user_id, created_at, updated_at
    FROM projects WHERE id = ? AND user_id = ? LIMIT 1`,
    [id, userId],
  );
  return rows[0] || null;
}

export async function updateProjectByIdAndUserId(input: {
  id: number;
  userId: number;
  name?: string;
  description?: string;
}): Promise<Project | null> {
  const updates: string[] = [];
  const values: any[] = [];

  if (input.name !== undefined) {
    updates.push("name = ?");
    values.push(input.name);
  }
  if (input.description !== undefined) {
    updates.push("description = ?");
    values.push(input.description);
  }

  if (updates.length === 0) {
    return getProjectByIdAndUserId(input.id, input.userId);
  }

  values.push(input.id, input.userId);
  await db.execute(
    `UPDATE projects SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
    values,
  );

  return getProjectByIdAndUserId(input.id, input.userId);
}

export async function deleteProjectByIdAndUserId(id: number, userId: number): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    `DELETE FROM projects WHERE id = ? AND user_id = ?`,
    [id, userId],
  );
  return result.affectedRows > 0;
}