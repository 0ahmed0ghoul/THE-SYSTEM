// backend/src/utils/formatters.ts

import { ActivityItem, PriorityDistributionItem, ProjectSummary, TaskSummary } from "../types/dashboard.types.js";

export class DashboardFormatter {
  static formatProjects(rows: any[]): ProjectSummary[] {
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description || '',
      status: row.status,
      priority: row.priority,
      progress: row.progress || 0,
      dueDate: row.due_date ? new Date(row.due_date).toISOString() : null,
      teamMembers: row.team_members ? row.team_members.split(',') : [],
      clientName: row.client_name || null,
      projectLead: row.project_lead || null,
      category: row.category || null,
      tags: row.tags ? row.tags.split(',') : []
    }));
  }

  static formatTasks(rows: any[]): TaskSummary[] {
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      status: row.status,
      priority: row.priority,
      dueDate: row.due_date ? new Date(row.due_date).toISOString() : null,
      projectId: row.project_id,
      projectName: row.project_name || 'Unassigned',
      assignedTo: row.assigned_to ? JSON.parse(row.assigned_to) : [],
      estimatedHours: row.estimated_hours || null
    }));
  }

  static formatActivities(rows: any[]): ActivityItem[] {
    return rows.map(row => ({
      id: row.id,
      type: row.type,
      action: row.action,
      description: row.description,
      timestamp: row.created_at,
      userId: row.user_id,
      userName: row.user_name,
      metadata: row.metadata ? JSON.parse(row.metadata) : {}
    }));
  }

  static formatStatusDistribution(rows: any[]): Array<{ name: string; value: number; color: string }> {
    const colorMap: Record<string, string> = {
      active: '#4fc3f7',
      planning: '#ffd54f',
      onHold: '#ff6b6b',
      completed: '#4fe6a0',
      archived: '#6c757d'
    };
    
    const nameMap: Record<string, string> = {
      active: 'Active Gates',
      planning: 'Planning',
      onHold: 'On Hold',
      completed: 'Cleared',
      archived: 'Archived'
    };
    
    return rows.map(row => ({
      name: nameMap[row.status] || row.status,
      value: row.count,
      color: colorMap[row.status] || '#4fc3f7'
    }));
  }

  static formatPriorityDistribution(
    projectRows: any[], 
    taskRows: any[]
  ): PriorityDistributionItem[] {
    const priorityMap: Record<string, { 
      count: number; 
      name: string; 
      color: string;
      rank: string;
      order: number;
    }> = {
      urgent: { 
        count: 0, 
        name: 'S-Rank', 
        color: '#ff6b6b',
        rank: 'S',
        order: 1
      },
      high: { 
        count: 0, 
        name: 'A-Rank', 
        color: '#ffb347',
        rank: 'A',
        order: 2
      },
      medium: { 
        count: 0, 
        name: 'B-Rank', 
        color: '#4fc3f7',
        rank: 'B',
        order: 3
      },
      low: { 
        count: 0, 
        name: 'C-Rank', 
        color: '#4fe6a0',
        rank: 'C',
        order: 4
      }
    };
    
    // Add project counts
    projectRows.forEach((row: any) => {
      const priority = row.priority?.toLowerCase();
      if (priorityMap[priority]) {
        priorityMap[priority].count += row.count;
      }
    });
    
    // Add task counts
    taskRows.forEach((row: any) => {
      const priority = row.priority?.toLowerCase();
      if (priorityMap[priority]) {
        priorityMap[priority].count += row.count;
      }
    });
    
    // Convert to PriorityDistributionItem array
    const result: PriorityDistributionItem[] = Object.entries(priorityMap)
      .map(([key, value]) => ({
        name: value.name,
        value: value.count,
        color: value.color,
        rank: value.rank,
        order: value.order
      }))
      .sort((a, b) => a.order - b.order);
    
    return result;
  }

  static formatWeeklyProgress(projectRows: any[], taskRows: any[], days: number): Array<{ day: string; projects: number; tasks: number }> {
    const result = [];
    
    const projectMap = new Map();
    projectRows.forEach((row: any) => {
      projectMap.set(row.date.toISOString().split('T')[0], row.projects_created);
    });
    
    const taskMap = new Map();
    taskRows.forEach((row: any) => {
      taskMap.set(row.date.toISOString().split('T')[0], row.tasks_created);
    });
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      
      result.push({
        day: dayStr,
        projects: projectMap.get(dayStr) || 0,
        tasks: taskMap.get(dayStr) || 0
      });
    }
    
    return result;
  }

  static formatProjectTrend(rows: any[], days: number): Array<{ date: string; completed: number; created: number }> {
    const result = [];
    const dataMap = new Map();
    
    rows.forEach((row: any) => {
      dataMap.set(row.date.toISOString().split('T')[0], {
        created: row.created,
        completed: row.completed
      });
    });
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      const data = dataMap.get(dayStr) || { created: 0, completed: 0 };
      
      result.push({
        date: dayStr,
        created: data.created,
        completed: data.completed
      });
    }
    
    return result;
  }

  static formatChartData(data: any): any {
    return {
      projectStatusDistribution: this.formatStatusDistribution(data.statusDistribution),
      priorityDistribution: this.formatPriorityDistribution(data.projectPriorityDist, data.taskPriorityDist),
      weeklyProgress: this.formatWeeklyProgress(data.projectWeeklyProgress, data.taskWeeklyProgress, data.days),
      projectProgressTrend: this.formatProjectTrend(data.projectTrend, data.days)
    };
  }
}