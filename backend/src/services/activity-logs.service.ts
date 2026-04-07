import { ResultSetHeader } from 'mysql2';
import { db } from '../config/db.js';

export interface CreateActivityLog {
    type: 'project' | 'task';
    action: string;
    description: string;
    user_id?: number;
    user_name?: string;
    metadata: any;
  }
  export interface ActivityLog extends CreateActivityLog {
    id: number;
    created_at?: Date;
  }

export class ActivityLogsService {
  
  async createLog(logData: CreateActivityLog): Promise<number> {
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO activity_logs (type, action, description, user_id, user_name, metadata) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        logData.type,
        logData.action,
        logData.description,
        logData.user_id || null,
        logData.user_name || null,
        logData.metadata ? JSON.stringify(logData.metadata) : null
      ]
    );

    return result.insertId;
  }
  
  async getRecentLogs(limit: number = 10): Promise<ActivityLog[]> {
    const [rows] = await db.execute(
      `SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ?`,
      [limit]
    );

    return rows as ActivityLog[]; // ✅ FIX
  }
  
  async getLogsByProject(projectId: number, limit: number = 20): Promise<ActivityLog[]> {
    const [rows] = await db.execute(
      `SELECT * FROM activity_logs 
       WHERE JSON_EXTRACT(metadata, '$.project_id') = ? 
       ORDER BY created_at DESC LIMIT ?`,
      [projectId, limit]
    );

    return rows as ActivityLog[]; // ✅ FIX
  }
}