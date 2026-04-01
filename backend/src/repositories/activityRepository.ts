// backend/src/repositories/activityRepository.ts
import { RowDataPacket } from 'mysql2';
import { db } from '../config/db.js';

export class ActivityRepository {
  static async getRecentActivities(userId?: number, limit: number = 10): Promise<any[]> {
    const query = `
      SELECT * FROM activity_logs
      ${userId ? 'WHERE user_id = ?' : ''}
      ORDER BY created_at DESC
      LIMIT ?
    `;
    
    const values: any[] = [];
    if (userId) values.push(userId);
    values.push(limit);
    
    const [rows] = await db.query<RowDataPacket[]>(query, values);
    return rows;
  }
}