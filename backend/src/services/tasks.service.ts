import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/db.js";

export interface Task {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "done";
  project_id: number;
  assigned_to: number | null;
  position: number;
  created_at: string;
}

export async function getTasksByProjectIdAndUserId(
  projectId: number,
  userId: number,
): Promise<Task[]> {
  const [rows] = await db.execute<(Task & RowDataPacket)[]>(
    `SELECT t.id, t.title, t.status, t.project_id, t.assigned_to, t.position, t.created_at
     FROM tasks t
     INNER JOIN projects p ON p.id = t.project_id
     WHERE t.project_id = ? AND p.user_id = ?
     ORDER BY FIELD(t.status, 'todo', 'in-progress', 'done'), t.position ASC, t.created_at ASC`,
    [projectId, userId],
  );

  return rows;
}

export async function createTask(input: {
  title: string;
  projectId: number;
  userId: number;
  assignedTo?: number;
}): Promise<Task | null> {
  const [result] = await db.execute<ResultSetHeader>(
    `INSERT INTO tasks (title, status, project_id, assigned_to, position)
     SELECT ?, 'todo', p.id, ?,
       COALESCE(
         (
           SELECT MAX(t.position) + 1
           FROM tasks t
           WHERE t.project_id = p.id AND t.status = 'todo'
         ),
         0
       )
     FROM projects p
     WHERE p.id = ? AND p.user_id = ?`,
    [input.title, input.assignedTo ?? null, input.projectId, input.userId],
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const [rows] = await db.execute<(Task & RowDataPacket)[]>(
    `SELECT id, title, status, project_id, assigned_to, position, created_at
     FROM tasks
     WHERE id = ?
     LIMIT 1`,
    [result.insertId],
  );

  return rows[0] ?? null;
}

export async function updateTaskByIdAndUserId(input: {
  id: number;
  userId: number;
  title?: string;
  status?: "todo" | "in-progress" | "done";
  assignedTo?: number | null;
  position?: number;
}): Promise<Task | null> {
  const updates: string[] = [];
  const values: Array<number | string | null> = [];

  if (input.title !== undefined) {
    updates.push("t.title = ?");
    values.push(input.title);
  }

  if (input.status !== undefined) {
    updates.push("t.status = ?");
    values.push(input.status);
  }

  if (input.assignedTo !== undefined) {
    updates.push("t.assigned_to = ?");
    values.push(input.assignedTo);
  }

  if (input.position !== undefined) {
    updates.push("t.position = ?");
    values.push(input.position);
  }

  if (updates.length === 0) {
    return getTaskByIdAndUserId(input.id, input.userId);
  }

  values.push(input.id, input.userId);

  const [result] = await db.execute<ResultSetHeader>(
    `UPDATE tasks t
     INNER JOIN projects p ON p.id = t.project_id
     SET ${updates.join(", ")}
     WHERE t.id = ? AND p.user_id = ?`,
    values,
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getTaskByIdAndUserId(input.id, input.userId);
}

export async function deleteTaskByIdAndUserId(
  id: number,
  userId: number,
): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    `DELETE t
     FROM tasks t
     INNER JOIN projects p ON p.id = t.project_id
     WHERE t.id = ? AND p.user_id = ?`,
    [id, userId],
  );

  return result.affectedRows > 0;
}

async function getTaskByIdAndUserId(
  id: number,
  userId: number,
): Promise<Task | null> {
  const [rows] = await db.execute<(Task & RowDataPacket)[]>(
    `SELECT t.id, t.title, t.status, t.project_id, t.assigned_to, t.position, t.created_at
     FROM tasks t
     INNER JOIN projects p ON p.id = t.project_id
     WHERE t.id = ? AND p.user_id = ?
     LIMIT 1`,
    [id, userId],
  );

  return rows[0] ?? null;
}
