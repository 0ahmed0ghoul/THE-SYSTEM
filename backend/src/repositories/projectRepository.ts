// backend/src/repositories/projectRepository.ts
import { RowDataPacket } from 'mysql2';
import { db } from '../config/db.js';

export class ProjectRepository {
  static async getStats(userId?: number): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_projects,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_projects,
        SUM(CASE WHEN status = 'planning' THEN 1 ELSE 0 END) as planning_projects,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects,
        SUM(CASE WHEN status = 'onHold' THEN 1 ELSE 0 END) as on_hold_projects,
        SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived_projects,
        SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent_projects,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority_projects
      FROM projects
      ${userId ? 'WHERE user_id = ?' : ''}
    `;
    
    const values: any[] = [];
    if (userId) values.push(userId);
    
    const [rows] = await db.query<RowDataPacket[]>(query, values);
    return rows[0];
  }

  static async getPriorityDistribution(userId?: number): Promise<any[]> {
    const query = `
      SELECT priority, COUNT(*) as count
      FROM projects
      ${userId ? 'WHERE user_id = ?' : ''}
      GROUP BY priority
    `;
    
    const values: any[] = [];
    if (userId) values.push(userId);
    
    const [rows] = await db.query<RowDataPacket[]>(query, values);
    return rows;
  }

  static async getRecentProjects(userId?: number, limit: number = 6, status?: string): Promise<any[]> {
    let query = `
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT pt.tag_name) as tags,
        GROUP_CONCAT(DISTINCT tm.member_name) as team_members
      FROM projects p
      LEFT JOIN project_tags pt ON p.id = pt.project_id
      LEFT JOIN project_team_members tm ON p.id = tm.project_id
    `;
    
    const conditions: string[] = [];
    const values: any[] = [];
    
    if (userId) {
      conditions.push('p.user_id = ?');
      values.push(userId);
    }
    
    if (status && status !== 'all') {
      conditions.push('p.status = ?');
      values.push(status);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' GROUP BY p.id ORDER BY p.updated_at DESC LIMIT ?';
    values.push(limit);
    
    const [rows] = await db.query<RowDataPacket[]>(query, values);
    return rows;
  }

  static async getMetrics(userId?: number): Promise<any> {
    const query = `
      SELECT 
        AVG(progress) as avg_progress,
        SUM(estimated_hours) as total_estimated_hours,
        COUNT(DISTINCT tm.member_name) as total_team_members,
        SUM(CASE WHEN priority IN ('urgent', 'high') THEN 1 ELSE 0 END) as high_priority_count,
        SUM(CASE WHEN due_date < CURDATE() AND status NOT IN ('completed', 'archived') THEN 1 ELSE 0 END) as overdue_count
      FROM projects p
      LEFT JOIN project_team_members tm ON p.id = tm.project_id
      ${userId ? 'WHERE p.user_id = ?' : ''}
    `;
    
    const values: any[] = [];
    if (userId) values.push(userId);
    
    const [rows] = await db.query<RowDataPacket[]>(query, values);
    return rows[0];
  }

  static async getCompletionRate(userId?: number): Promise<number> {
    const query = `
      SELECT 
        (SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*)) * 100 as completion_rate
      FROM projects
      ${userId ? 'WHERE user_id = ?' : ''}
    `;
    
    const values: any[] = [];
    if (userId) values.push(userId);
    
    const [rows] = await db.query<RowDataPacket[]>(query, values);
    return rows[0]?.completion_rate || 0;
  }

  static async getStatusDistribution(userId?: number): Promise<any[]> {
    const query = `
      SELECT status, COUNT(*) as count
      FROM projects
      ${userId ? 'WHERE user_id = ?' : ''}
      GROUP BY status
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
        COUNT(*) as projects_created
      FROM projects
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      ${userId ? 'AND user_id = ?' : ''}
      GROUP BY DATE(created_at)
    `;
    
    const values: any[] = [days];
    if (userId) values.push(userId);
    
    const [rows] = await db.query<RowDataPacket[]>(query, values);
    return rows;
  }

  static async getProjectTrend(userId?: number, days: number = 7): Promise<any[]> {
    const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as created,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM projects
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