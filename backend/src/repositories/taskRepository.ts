// backend/src/repositories/taskRepository.ts
import { RowDataPacket } from 'mysql2';
import { db } from '../config/db.js';

export class TaskRepository {
  static async getStats(userId?: number): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status NOT IN ('done', 'completed') THEN 1 ELSE 0 END) as active_tasks,
        SUM(CASE WHEN status = 'inprogress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN status = 'review' THEN 1 ELSE 0 END) as review_tasks,
        SUM(CASE WHEN status IN ('done', 'completed') THEN 1 ELSE 0 END) as completed_tasks
      FROM tasks
      ${userId ? 'WHERE user_id = ?' : ''}
    `;
    
    const values: any[] = [];
    if (userId) values.push(userId);
    
    const [rows] = await db.query<RowDataPacket[]>(query, values);
    return rows[0];
  }

  static async getUpcomingTasks(userId?: number, limit: number = 8): Promise<any[]> {
    const query = `
      SELECT 
        t.*,
        p.name as project_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.status IN ('todo', 'inprogress', 'review')
      ${userId ? 'AND t.user_id = ?' : ''}
      ORDER BY t.due_date ASC, t.priority = 'urgent' DESC, t.priority = 'high' DESC
      LIMIT ?
    `;
    
    const values: any[] = [];
    if (userId) values.push(userId);
    values.push(limit);
    
    const [rows] = await db.query<RowDataPacket[]>(query, values);
    return rows;
  }

  static async getPriorityDistribution(userId?: number): Promise<any[]> {
    const query = `
      SELECT priority, COUNT(*) as count
      FROM tasks
      ${userId ? 'WHERE user_id = ?' : ''}
      GROUP BY priority
    `;
    
    const values: any[] = [];
    if (userId) values.push(userId);
    
    const [rows] = await db.query<RowDataPacket[]>(query, values);
    return rows;
  }

  static async getWeeklyProgress(userId?: number, days: number = 7): Promise<any[]> {
    const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as tasks_created
      FROM tasks
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      ${userId ? 'AND user_id = ?' : ''}
      GROUP BY DATE(created_at)
    `;
    
    const values: any[] = [days];
    if (userId) values.push(userId);
    
    const [rows] = await db.query<RowDataPacket[]>(query, values);
    return rows;
  }
}