import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../config/db.js';

export interface Project {
  id: number;
  name: string;
  description?: string;
  start_date?: Date;
  due_date?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'planning' | 'active' | 'onHold' | 'completed' | 'archived';
  category?: string;
  progress: number;
  estimated_hours?: number;
  budget?: number;
  project_lead?: string;
  client_name?: string;
  visibility: 'private' | 'public';
  requires_approval: boolean;
  user_id: number;
  team_members?: any;
  tags?: any;
  goals?: any;
  created_at: Date;
  updated_at: Date;
}

export class ProjectsService {
  
  // Get all projects for a user
  async getAllProjects(userId: number): Promise<Project[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT 
        p.*,
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as total_tasks,
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'done') as completed_tasks
      FROM projects p 
      WHERE p.user_id = ? OR p.visibility = 'public'
      ORDER BY 
        FIELD(p.priority, 'urgent', 'high', 'medium', 'low'),
        p.due_date ASC,
        p.created_at DESC`,
      [userId]
    );
    return rows as Project[];
  }

  // Get project by ID with related data
  async getProjectById(id: number, userId: number): Promise<any | null> {
    // First, get the main project
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT 
        p.*,
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as total_tasks,
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'done') as completed_tasks
      FROM projects p 
      WHERE p.id = ?`,
      [id]
    );
    
    if (rows.length === 0) return null;
    
    const project = rows[0];
    
    // Get recent tasks separately (without JSON_ARRAYAGG)
    const [recentTasks] = await db.execute<RowDataPacket[]>(
      `SELECT 
        id, 
        title, 
        status, 
        priority, 
        due_date 
      FROM tasks 
      WHERE project_id = ? 
      ORDER BY created_at DESC 
      LIMIT 5`,
      [id]
    );
    project.recent_tasks = recentTasks;
    
    // Get team members from junction table
    const [teamMembers] = await db.execute<RowDataPacket[]>(
      `SELECT member_name as name, role FROM project_team_members WHERE project_id = ?`,
      [id]
    );
    project.team_members = teamMembers;
    
    // Get tags from junction table
    const [tags] = await db.execute<RowDataPacket[]>(
      `SELECT tag_name FROM project_tags WHERE project_id = ?`,
      [id]
    );
    project.tags = tags.map(t => t.tag_name);
    
    // Get goals
    const [goals] = await db.execute<RowDataPacket[]>(
      `SELECT id, goal_text as text, completed FROM project_goals WHERE project_id = ?`,
      [id]
    );
    project.goals = goals;
    
    return project;
  }

  // Create new project
  async createProject(projectData: any): Promise<number> {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      const {
        name,
        description,
        start_date,
        due_date,
        priority = 'medium',
        status = 'planning',
        category,
        progress = 0,
        estimated_hours,
        budget,
        project_lead,
        client_name,
        visibility = 'private',
        requires_approval = false,
        user_id,
        team_members = [],
        tags = [],
        goals = []
      } = projectData;
      
      // Insert main project
      const [result] = await connection.execute<ResultSetHeader>(
        `INSERT INTO projects (
          name, description, start_date, due_date, priority, status, 
          category, progress, estimated_hours, budget, project_lead, 
          client_name, visibility, requires_approval, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name, description, start_date, due_date, priority, status,
          category, progress, estimated_hours, budget, project_lead,
          client_name, visibility, requires_approval, user_id
        ]
      );
      
      const projectId = result.insertId;
      
      // Insert team members
      if (team_members && team_members.length > 0) {
        for (const member of team_members) {
          await connection.execute(
            `INSERT INTO project_team_members (project_id, member_name, role) VALUES (?, ?, ?)`,
            [projectId, member.name, member.role || null]
          );
        }
      }
      
      // Insert tags
      if (tags && tags.length > 0) {
        for (const tag of tags) {
          await connection.execute(
            `INSERT INTO project_tags (project_id, tag_name) VALUES (?, ?)`,
            [projectId, tag]
          );
        }
      }
      
      // Insert goals
      if (goals && goals.length > 0) {
        for (const goal of goals) {
          await connection.execute(
            `INSERT INTO project_goals (project_id, goal_text, completed) VALUES (?, ?, ?)`,
            [projectId, goal.text, goal.completed || false]
          );
        }
      }
      
      await connection.commit();
      return projectId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Update project
  async updateProject(id: number, updateData: any, userId: number): Promise<boolean> {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      // Check if project exists and belongs to user
      const [projects] = await connection.execute<RowDataPacket[]>(
        `SELECT id FROM projects WHERE id = ? AND user_id = ?`,
        [id, userId]
      );
      
      if (projects.length === 0) {
        return false;
      }
      
      // Build dynamic update query
      const fields: string[] = [];
      const values: any[] = [];
      
      const allowedFields = [
        'name', 'description', 'start_date', 'due_date', 'priority', 'status',
        'category', 'progress', 'estimated_hours', 'budget', 'project_lead',
        'client_name', 'visibility', 'requires_approval'
      ];
      
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          fields.push(`${field} = ?`);
          values.push(updateData[field]);
        }
      }
      
      if (fields.length > 0) {
        values.push(id);
        await connection.execute(
          `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`,
          values
        );
      }
      
      // Update team members if provided
      if (updateData.team_members !== undefined) {
        await connection.execute(`DELETE FROM project_team_members WHERE project_id = ?`, [id]);
        if (updateData.team_members && updateData.team_members.length > 0) {
          for (const member of updateData.team_members) {
            await connection.execute(
              `INSERT INTO project_team_members (project_id, member_name, role) VALUES (?, ?, ?)`,
              [id, member.name, member.role || null]
            );
          }
        }
      }
      
      // Update tags if provided
      if (updateData.tags !== undefined) {
        await connection.execute(`DELETE FROM project_tags WHERE project_id = ?`, [id]);
        if (updateData.tags && updateData.tags.length > 0) {
          for (const tag of updateData.tags) {
            await connection.execute(
              `INSERT INTO project_tags (project_id, tag_name) VALUES (?, ?)`,
              [id, tag]
            );
          }
        }
      }
      
      // Update goals if provided
      if (updateData.goals !== undefined) {
        await connection.execute(`DELETE FROM project_goals WHERE project_id = ?`, [id]);
        if (updateData.goals && updateData.goals.length > 0) {
          for (const goal of updateData.goals) {
            await connection.execute(
              `INSERT INTO project_goals (project_id, goal_text, completed) VALUES (?, ?, ?)`,
              [id, goal.text, goal.completed || false]
            );
          }
        }
      }
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete project
  async deleteProject(id: number, userId: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM projects WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
    return result.affectedRows > 0;
  }

  // Get project statistics
  async getProjectStats(userId: number): Promise<any> {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'planning' THEN 1 ELSE 0 END) as planning,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'onHold' THEN 1 ELSE 0 END) as onHold,
        SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived,
        SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high,
        SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) as medium,
        SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) as low,
        ROUND(AVG(progress), 2) as avg_progress
      FROM projects 
      WHERE user_id = ? OR visibility = 'public'`,
      [userId]
    );
    
    return rows[0];
  }

  // Get projects by status
  async getProjectsByStatus(status: string, userId: number): Promise<Project[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM projects 
       WHERE (user_id = ? OR visibility = 'public') AND status = ?
       ORDER BY due_date ASC`,
      [userId, status]
    );
    return rows as Project[];
  }

  // Get projects by priority
  async getProjectsByPriority(priority: string, userId: number): Promise<Project[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT * FROM projects 
       WHERE (user_id = ? OR visibility = 'public') AND priority = ?
       ORDER BY due_date ASC`,
      [userId, priority]
    );
    return rows as Project[];
  }
}