import { RowDataPacket, ResultSetHeader } from "mysql2";
import {
  DashboardData,
  GetDashboardOptions,
  DashboardStats,
  DashboardMetrics,
  ProjectSummary,
  TaskSummary,
  ActivityItem,
  ChartData,
  PriorityDistributionItem,
  PriorityDistributionFilters,
  PriorityDistributionComparison,
  PriorityDistributionTrend,
} from "../types/dashboard.types.js";
import { db } from "../config/db.js";

// Define interfaces for query results
interface ProjectStatsRow extends RowDataPacket {
  total_projects: number;
  active_projects: number;
  planning_projects: number;
  completed_projects: number;
  on_hold_projects: number;
  archived_projects: number;
  urgent_projects: number;
  high_priority_projects: number;
}

interface TaskStatsRow extends RowDataPacket {
  total_tasks: number;
  active_tasks: number;
  in_progress_tasks: number;
  review_tasks: number;
  completed_tasks: number;
}

interface MetricsRow extends RowDataPacket {
  avg_progress: number;
  total_estimated_hours: number;
  total_team_members: number;
  high_priority_count: number;
  overdue_count: number;
}

interface CompletionRateRow extends RowDataPacket {
  completion_rate: number;
}

interface ProjectRow extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  status: string;
  priority: string;
  progress: number;
  dueDate: Date | null;
  clientName: string | null;
  projectLead: string | null;
  category: string | null;
  tags: string | null;
  teamMembers: string | null;
}

interface TaskRow extends RowDataPacket {
  id: number;
  title: string;
  user_Id: number;
  description: string;
  status: string;
  priority: string;
  dueDate: Date | null;
  projectId: number;
  estimatedHours: number | null;
  assignedTo: string | null;
  projectName: string | null;
}

interface ActivityRow extends RowDataPacket {
  id: number;
  type: "project" | "task";
  action: string;
  description: string;
  timestamp: Date;
  userId: string | null;
  userName: string | null;
  metadata: string | null;
}

interface StatusRow extends RowDataPacket {
  status: string;
  count: number;
}

interface PriorityRow extends RowDataPacket {
  priority: string;
  count: number;
}

interface WeeklyRow extends RowDataPacket {
  date: Date;
  count: number;
}

interface TrendRow extends RowDataPacket {
  date: Date;
  created: number;
  completed: number;
}

export class DashboardService {
  static async getDashboardData(
    options: GetDashboardOptions
  ): Promise<DashboardData> {
    if (!options.userId) {
      throw new Error("userId is required");
    }
    const [
      stats,
      recentProjects,
      upcomingTasks,
      recentActivity,
      metrics,
      chartData,
    ] = await Promise.all([
      this.getStats(options.userId),
      this.getRecentProjects(options.userId, options.limit),
      this.getUpcomingTasks(options.userId, options.limit),
      this.getActivityFeed(options.userId, options.limit),
      this.getMetrics(options.userId),
      this.getChartData(options.userId, undefined, options.timeframe),
    ]);

    return {
      stats,
      recentProjects,
      upcomingTasks,
      recentActivity,
      metrics,
      chartData,
    };
  }

  /**
   * Get dashboard stats only
   */
  static async getStats(userId?: number): Promise<DashboardStats> {
    const projectStatsQuery = `
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
            ${userId ? "WHERE user_id = ?" : ""}
        `;

        const taskStatsQuery = `
        SELECT 
          COUNT(*) as total_tasks,
          SUM(CASE WHEN t.status NOT IN ('done') THEN 1 ELSE 0 END) as active_tasks,
          SUM(CASE WHEN t.status = 'inprogress' THEN 1 ELSE 0 END) as in_progress_tasks,
          SUM(CASE WHEN t.status = 'review' THEN 1 ELSE 0 END) as review_tasks,
          SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) as completed_tasks
        FROM tasks t
        LEFT JOIN projects p ON t.project_id = p.id
        WHERE t.user_id = ? OR p.user_id = ?
      `;
      const values = [userId, userId];

    const [projectRows] = await db.query<ProjectStatsRow[]>(
      projectStatsQuery,
      values
    );
    const [taskRows] = await db.query<TaskStatsRow[]>(taskStatsQuery, values);

    const projectStats = projectRows[0];
    const taskStats = taskRows[0];

    const totalProjects = projectStats.total_projects || 0;
    const completedProjects = projectStats.completed_projects || 0;

    return {
      totalProjects,
      activeProjects: projectStats.active_projects || 0,
      planningProjects: projectStats.planning_projects || 0,
      completedProjects,
      onHoldProjects: projectStats.on_hold_projects || 0,
      archivedProjects: projectStats.archived_projects || 0,
      urgentProjects: projectStats.urgent_projects || 0,
      highPriorityProjects: projectStats.high_priority_projects || 0,
      totalTasks: taskStats.total_tasks || 0,
      activeTasks: taskStats.active_tasks || 0,
      inProgressTasks: taskStats.in_progress_tasks || 0,
      reviewTasks: taskStats.review_tasks || 0,
      completedTasks: taskStats.completed_tasks || 0,
      completionRate:
        totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0,
    };
  }

  /**
   * Get dashboard metrics
   */
  static async getMetrics(userId?: number): Promise<DashboardMetrics> {
    const metricsQuery = `
            SELECT 
                AVG(progress) as avg_progress,
                SUM(estimated_hours) as total_estimated_hours,
                COUNT(DISTINCT tm.member_name) as total_team_members,
                SUM(CASE WHEN priority IN ('urgent', 'high') THEN 1 ELSE 0 END) as high_priority_count,
                SUM(CASE WHEN due_date < CURDATE() AND status NOT IN ('completed', 'archived') THEN 1 ELSE 0 END) as overdue_count
            FROM projects p
            LEFT JOIN project_team_members tm ON p.id = tm.project_id
            ${userId ? "WHERE p.user_id = ?" : ""}
        `;

    const completionRateQuery = `
            SELECT 
                (SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*)) * 100 as completion_rate
            FROM projects
            ${userId ? "WHERE user_id = ?" : ""}
        `;

    const values = userId ? [userId] : [];

    const [metricsRows] = await db.query<MetricsRow[]>(metricsQuery, values);
    const [rateRows] = await db.query<CompletionRateRow[]>(
      completionRateQuery,
      values
    );

    const metrics = metricsRows[0];

    return {
      completionRate: rateRows[0]?.completion_rate || 0,
      avgProjectProgress: Math.round(metrics.avg_progress || 0),
      totalEstimatedHours: metrics.total_estimated_hours || 0,
      totalTeamMembers: metrics.total_team_members || 0,
      highPriorityCount: metrics.high_priority_count || 0,
      overdueCount: metrics.overdue_count || 0,
    };
  }

  /**
   * Get recent projects
   */
  static async getRecentProjects(
    userId?: number,
    limit: number = 6,
    status?: string
  ): Promise<ProjectSummary[]> {
    let query = `
            SELECT 
                p.id,
                p.name,
                p.description,
                p.status,
                p.priority,
                p.progress,
                p.due_date as dueDate,
                p.client_name as clientName,
                p.project_lead as projectLead,
                p.category,
                GROUP_CONCAT(DISTINCT pt.tag_name) as tags,
                GROUP_CONCAT(DISTINCT tm.member_name) as teamMembers
            FROM projects p
            LEFT JOIN project_tags pt ON p.id = pt.project_id
            LEFT JOIN project_team_members tm ON p.id = tm.project_id
        `;

    const conditions: string[] = [];
    const values: any[] = [];

    if (userId) {
      conditions.push("p.user_id = ?");
      values.push(userId);
    }

    if (status && status !== "all") {
      conditions.push("p.status = ?");
      values.push(status);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " GROUP BY p.id ORDER BY p.updated_at DESC LIMIT ?";
    values.push(limit);

    const [rows] = await db.query<ProjectRow[]>(query, values);

    return rows.map((row: ProjectRow) => ({
      id: row.id,
      name: row.name,
      description: row.description || "",
      status: row.status,
      priority: row.priority,
      progress: row.progress || 0,
      dueDate: row.dueDate ? new Date(row.dueDate).toISOString() : null,
      teamMembers: row.teamMembers ? row.teamMembers.split(",") : [],
      clientName: row.clientName || null,
      projectLead: row.projectLead || null,
      category: row.category || null,
      tags: row.tags ? row.tags.split(",") : [],
    }));
  }

  /**
   * Get upcoming tasks
   */
  static async getUpcomingTasks(
    userId: number,
    limit: number = 8
  ): Promise<TaskSummary[]> {
    const query = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.due_date as dueDate,
        t.project_id as projectId,
        t.estimated_hours as estimatedHours,
        t.assigned_to as assignedTo,
        COALESCE(p.name, 'Unassigned') as projectName
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.status IN ('todo', 'inprogress', 'review')
        AND (
          t.user_id = ?           -- tasks assigned directly to user
          OR p.user_id = ?        -- tasks from projects owned by user
        )
      ORDER BY t.due_date ASC, 
        CASE t.priority 
          WHEN 'urgent' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'low' THEN 4 
        END ASC
      LIMIT ?
    `;

    const values: any[] = [userId, userId, limit];
    const [rows] = await db.query<TaskRow[]>(query, values);

    console.log(`📋 Found ${rows.length} upcoming tasks for user ${userId}`);

    return rows.map((row: TaskRow) => ({
      id: row.id,
      title: row.title,
      description: row.description || "",
      status: row.status,
      priority: row.priority,
      dueDate: row.dueDate ? new Date(row.dueDate).toISOString() : null,
      projectId: row.projectId,
      projectName: row.projectName || "Unassigned",
      assignedTo: row.assignedTo ? JSON.parse(row.assignedTo) : [],
      estimatedHours: row.estimatedHours || null,
    }));
  }

  /**
   * Get activity feed
   */
  static async getActivityFeed(
    userId?: number,
    limit: number = 10
  ): Promise<ActivityItem[]> {
    const query = `
            SELECT 
                id,
                type,
                action,
                description,
                created_at as timestamp,
                user_id as userId,
                user_name as userName,
                metadata
            FROM activity_logs
            ${userId ? "WHERE user_id = ?" : ""}
            ORDER BY created_at DESC
            LIMIT ?
        `;

    const values: any[] = [];
    if (userId) values.push(userId);
    values.push(limit);

    const [rows] = await db.query<ActivityRow[]>(query, values);

    return rows.map((row: ActivityRow) => ({
      id: row.id,
      type: row.type,
      action: row.action,
      description: row.description,
      timestamp: row.timestamp,
      userId: row.userId,
      userName: row.userName,
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
    }));
  }

  /**
   * Get chart data for visualizations
   */
  static async getChartData(
    userId?: number,
    type?: string,
    timeframe: string = "week"
  ): Promise<ChartData> {
    const days = timeframe === "month" ? 30 : 7;

    // Status distribution
    const statusQuery = `
            SELECT status, COUNT(*) as count
            FROM projects
            ${userId ? "WHERE user_id = ?" : ""}
            GROUP BY status
        `;

    // Priority distribution
    const priorityQuery = `
            SELECT priority, COUNT(*) as count
            FROM projects
            ${userId ? "WHERE user_id = ?" : ""}
            GROUP BY priority
        `;

    // Weekly progress
    const weeklyQuery = `
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as count
            FROM projects
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            ${userId ? "AND user_id = ?" : ""}
            GROUP BY DATE(created_at)
        `;

    // Project trend
    const trendQuery = `
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as created,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
            FROM projects
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
            ${userId ? "AND user_id = ?" : ""}
            GROUP BY DATE(created_at)
        `;

    const values = userId ? [userId] : [];

    const [statusRows] = await db.query<StatusRow[]>(statusQuery, values);
    const [priorityRows] = await db.query<PriorityRow[]>(priorityQuery, values);
    const [weeklyRows] = await db.query<WeeklyRow[]>(weeklyQuery, [
      days,
      ...(userId ? [userId] : []),
    ]);
    const [trendRows] = await db.query<TrendRow[]>(trendQuery, [
      days,
      ...(userId ? [userId] : []),
    ]);

    // Format status distribution
    const statusMap: Record<string, { name: string; color: string }> = {
      active: { name: "Active Gates", color: "#4fc3f7" },
      planning: { name: "Planning", color: "#ffd54f" },
      onHold: { name: "On Hold", color: "#ff6b6b" },
      completed: { name: "Cleared", color: "#4fe6a0" },
      archived: { name: "Archived", color: "#6c757d" },
    };

    const statusDistribution = statusRows.map((row: StatusRow) => ({
      name: statusMap[row.status]?.name || row.status,
      value: row.count,
      color: statusMap[row.status]?.color || "#4fc3f7",
    }));

    // Format priority distribution
    const priorityColorMap: Record<string, string> = {
      urgent: "#ff6b6b",
      high: "#ffb347",
      medium: "#4fc3f7",
      low: "#4fe6a0",
    };

    const priorityDistribution = priorityRows.map((row: PriorityRow) => ({
      name:
        row.priority === "urgent"
          ? "S-Rank"
          : row.priority === "high"
          ? "A-Rank"
          : row.priority === "medium"
          ? "B-Rank"
          : "C-Rank",
      value: row.count,
      color: priorityColorMap[row.priority],
      rank:
        row.priority === "urgent"
          ? "S"
          : row.priority === "high"
          ? "A"
          : row.priority === "medium"
          ? "B"
          : "C",
      order:
        row.priority === "urgent"
          ? 1
          : row.priority === "high"
          ? 2
          : row.priority === "medium"
          ? 3
          : 4,
    }));

    // Format weekly progress
    const weeklyMap = new Map<string, number>();
    weeklyRows.forEach((row: WeeklyRow) => {
      const dateStr = row.date.toISOString().split("T")[0];
      weeklyMap.set(dateStr, row.count);
    });

    const weeklyProgress = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split("T")[0];
      weeklyProgress.push({
        day: dayStr,
        projects: weeklyMap.get(dayStr) || 0,
        tasks: 0,
      });
    }

    // Format project trend
    const trendMap = new Map<string, { created: number; completed: number }>();
    trendRows.forEach((row: TrendRow) => {
      const dateStr = row.date.toISOString().split("T")[0];
      trendMap.set(dateStr, {
        created: row.created,
        completed: row.completed,
      });
    });

    const projectProgressTrend = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split("T")[0];
      const data = trendMap.get(dayStr) || { created: 0, completed: 0 };
      projectProgressTrend.push({
        date: dayStr,
        created: data.created,
        completed: data.completed,
      });
    }

    return {
      projectStatusDistribution: statusDistribution,
      priorityDistribution,
      weeklyProgress,
      projectProgressTrend,
    };
  }

  /**
   * Get simple priority distribution
   */
  static async getPriorityDistribution(
    userId?: number,
    timeframe: string = "all",
    entityType: "projects" | "tasks" | "both" = "both"
  ): Promise<PriorityDistributionItem[]> {
    const priorityMap: Record<
      string,
      {
        count: number;
        name: string;
        color: string;
        rank: string;
        order: number;
      }
    > = {
      urgent: {
        count: 0,
        name: "S-Rank",
        color: "#ff6b6b",
        rank: "S",
        order: 1,
      },
      high: { count: 0, name: "A-Rank", color: "#ffb347", rank: "A", order: 2 },
      medium: {
        count: 0,
        name: "B-Rank",
        color: "#4fc3f7",
        rank: "B",
        order: 3,
      },
      low: { count: 0, name: "C-Rank", color: "#4fe6a0", rank: "C", order: 4 },
    };

    const dateFilter =
      timeframe !== "all"
        ? `AND created_at >= DATE_SUB(CURDATE(), INTERVAL ${
            timeframe === "week" ? 7 : timeframe === "month" ? 30 : 365
          } DAY)`
        : "";

    if (entityType === "projects" || entityType === "both") {
      const query = `
                SELECT priority, COUNT(*) as count
                FROM projects
                WHERE 1=1
                ${userId ? "AND user_id = ?" : ""}
                ${dateFilter}
                GROUP BY priority
            `;

      const values = userId ? [userId] : [];
      const [rows] = await db.query<PriorityRow[]>(query, values);

      rows.forEach((row: PriorityRow) => {
        if (priorityMap[row.priority]) {
          priorityMap[row.priority].count += row.count;
        }
      });
    }

    if (entityType === "tasks" || entityType === "both") {
      const query = `
                SELECT priority, COUNT(*) as count
                FROM tasks
                WHERE 1=1
                ${userId ? "AND user_id = ?" : ""}
                ${dateFilter}
                GROUP BY priority
            `;

      const values = userId ? [userId] : [];
      const [rows] = await db.query<PriorityRow[]>(query, values);

      rows.forEach((row: PriorityRow) => {
        if (priorityMap[row.priority]) {
          priorityMap[row.priority].count += row.count;
        }
      });
    }

    return Object.values(priorityMap).map((p) => ({
      name: p.name,
      value: p.count,
      color: p.color,
      rank: p.rank,
      order: p.order,
    }));
  }

  /**
   * Get priority distribution with details
   */
  static async getPriorityDistributionWithDetails(
    filters: PriorityDistributionFilters
  ): Promise<any> {
    const distribution = await this.getPriorityDistribution(
      filters.userId,
      filters.timeframe,
      filters.entityType
    );

    const total = distribution.reduce((sum, item) => sum + item.value, 0);
    const percentages: Record<string, number> = {};
    const counts: Record<string, number> = {};
    const ranks: Record<string, string> = {};

    distribution.forEach((item) => {
      percentages[item.name] = total > 0 ? (item.value / total) * 100 : 0;
      counts[item.name] = item.value;
      ranks[item.name] = item.rank;
    });

    return {
      data: distribution,
      total,
      percentages,
      ranks,
      counts,
      highestPriority: distribution.find((d) => d.value > 0)?.name || "None",
      lowestPriority:
        [...distribution].reverse().find((d) => d.value > 0)?.name || "None",
      averagePriorityScore: this.calculateAveragePriorityScore(
        distribution,
        total
      ),
    };
  }

  private static calculateAveragePriorityScore(
    distribution: PriorityDistributionItem[],
    total: number
  ): number {
    const priorityScores: Record<string, number> = {
      "S-Rank": 1,
      "A-Rank": 2,
      "B-Rank": 3,
      "C-Rank": 4,
    };

    let totalScore = 0;
    distribution.forEach((item) => {
      const score = priorityScores[item.name];
      if (score) {
        totalScore += score * item.value;
      }
    });

    return total > 0 ? totalScore / total : 0;
  }

  /**
   * Compare priority distribution between two periods
   */
  static async comparePriorityDistribution(
    userId?: number,
    period1: string = "week",
    period2: string = "month"
  ): Promise<PriorityDistributionComparison> {
    const [distribution1, distribution2] = await Promise.all([
      this.getPriorityDistribution(userId, period1, "both"),
      this.getPriorityDistribution(userId, period2, "both"),
    ]);

    const total1 = distribution1.reduce((sum, item) => sum + item.value, 0);
    const total2 = distribution2.reduce((sum, item) => sum + item.value, 0);

    const trends = distribution1.map((item) => {
      const current = item.value;
      const previous =
        distribution2.find((d) => d.name === item.name)?.value || 0;
      const change = current - previous;
      const percentageChange =
        previous > 0 ? (change / previous) * 100 : current > 0 ? 100 : 0;

      let trend: "up" | "down" | "stable" = "stable";
      if (change > 0) trend = "up";
      if (change < 0) trend = "down";

      return {
        priority: item.name,
        current,
        previous,
        change,
        percentageChange: Math.round(percentageChange * 100) / 100,
        trend,
      };
    });

    const totalChange = total1 - total2;
    const totalPercentageChange =
      total2 > 0 ? (totalChange / total2) * 100 : total1 > 0 ? 100 : 0;

    let direction: "increase" | "decrease" | "stable" = "stable";
    if (totalChange > 0) direction = "increase";
    if (totalChange < 0) direction = "decrease";

    return {
      period1: {
        timeframe: period1,
        distribution: distribution1,
        total: total1,
        timestamp: new Date(),
      },
      period2: {
        timeframe: period2,
        distribution: distribution2,
        total: total2,
        timestamp: new Date(),
      },
      trends,
      overallChange: {
        totalChange,
        totalPercentageChange: Math.round(totalPercentageChange * 100) / 100,
        direction,
      },
    };
  }

  /**
   * Get priority distribution trends over time
   */
  static async getPriorityDistributionTrends(
    userId?: number,
    timeframe: string = "month",
    interval: string = "day"
  ): Promise<PriorityDistributionTrend> {
    const days = timeframe === "week" ? 7 : timeframe === "month" ? 30 : 90;
    const intervals = days;
    const timeline: any[] = [];
    const priorityTrendsMap = new Map<
      string,
      Array<{ date: Date; value: number }>
    >();

    const priorities = ["S-Rank", "A-Rank", "B-Rank", "C-Rank"];
    priorities.forEach((priority) => {
      priorityTrendsMap.set(priority, []);
    });

    for (let i = intervals - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const distribution = await this.getPriorityDistributionForDateRange(
        userId,
        startDate,
        endDate
      );

      timeline.push({
        date,
        label: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        distribution,
        total: distribution.reduce((sum, item) => sum + item.value, 0),
      });

      distribution.forEach((item: PriorityDistributionItem) => {
        const trendData = priorityTrendsMap.get(item.name) || [];
        trendData.push({ date, value: item.value });
        priorityTrendsMap.set(item.name, trendData);
      });

      priorities.forEach((priority) => {
        const trendData = priorityTrendsMap.get(priority) || [];
        if (
          !distribution.find(
            (d: PriorityDistributionItem) => d.name === priority
          )
        ) {
          trendData.push({ date, value: 0 });
          priorityTrendsMap.set(priority, trendData);
        }
      });
    }

    const priorityTrends = Array.from(priorityTrendsMap.entries()).map(
      ([priority, values]) => {
        const trend = this.calculateTrend(values.map((v) => v.value));
        const forecast = this.calculateForecast(values.map((v) => v.value));

        const colorMap: Record<string, string> = {
          "S-Rank": "#ff6b6b",
          "A-Rank": "#ffb347",
          "B-Rank": "#4fc3f7",
          "C-Rank": "#4fe6a0",
        };

        return {
          priority: priority.split("-")[0],
          name: priority,
          color: colorMap[priority] || "#4fc3f7",
          values,
          trend,
          forecast,
        };
      }
    );

    const highestGrowth = priorityTrends.reduce((highest, current) => {
      return current.trend > highest.trend ? current : highest;
    }, priorityTrends[0]);

    const highestDecline = priorityTrends.reduce((highest, current) => {
      return current.trend < highest.trend ? current : highest;
    }, priorityTrends[0]);

    const averageGrowth =
      priorityTrends.reduce((sum, current) => sum + current.trend, 0) /
      priorityTrends.length;

    const mostStable = priorityTrends.reduce((most, current) => {
      const variance = this.calculateVariance(
        current.values.map((v) => v.value)
      );
      const mostVariance = this.calculateVariance(
        most.values.map((v) => v.value)
      );
      return variance < mostVariance ? current : most;
    }, priorityTrends[0]);

    return {
      timeline,
      priorityTrends,
      summary: {
        highestGrowth: highestGrowth.name,
        highestDecline: highestDecline.name,
        averageGrowth,
        mostStable: mostStable.name,
      },
    };
  }

  private static async getPriorityDistributionForDateRange(
    userId?: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<PriorityDistributionItem[]> {
    const query = `
            SELECT priority, COUNT(*) as count
            FROM projects
            WHERE 1=1
            ${userId ? "AND user_id = ?" : ""}
            ${startDate ? "AND created_at >= ?" : ""}
            ${endDate ? "AND created_at <= ?" : ""}
            GROUP BY priority
        `;

    const values: any[] = [];
    if (userId) values.push(userId);
    if (startDate) values.push(startDate);
    if (endDate) values.push(endDate);

    const [rows] = await db.query<PriorityRow[]>(query, values);

    const priorityMap: Record<
      string,
      {
        count: number;
        name: string;
        color: string;
        rank: string;
        order: number;
      }
    > = {
      urgent: {
        count: 0,
        name: "S-Rank",
        color: "#ff6b6b",
        rank: "S",
        order: 1,
      },
      high: { count: 0, name: "A-Rank", color: "#ffb347", rank: "A", order: 2 },
      medium: {
        count: 0,
        name: "B-Rank",
        color: "#4fc3f7",
        rank: "B",
        order: 3,
      },
      low: { count: 0, name: "C-Rank", color: "#4fe6a0", rank: "C", order: 4 },
    };

    rows.forEach((row: PriorityRow) => {
      if (priorityMap[row.priority]) {
        priorityMap[row.priority].count += row.count;
      }
    });

    return Object.values(priorityMap).map((p) => ({
      name: p.name,
      value: p.count,
      color: p.color,
      rank: p.rank,
      order: p.order,
    }));
  }

  private static calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumX2 += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  private static calculateForecast(values: number[]): number {
    const trend = this.calculateTrend(values);
    const lastValue = values[values.length - 1] || 0;
    return Math.max(0, lastValue + trend);
  }

  private static calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }
}
