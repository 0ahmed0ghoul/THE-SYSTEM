// frontend/src/types/dashboard.ts

// ============================================
// Base Types
// ============================================

/**
 * Priority distribution item for charts
 */
export interface PriorityDistributionItem {
    /** Display name (e.g., "S-Rank", "A-Rank") */
    name: string;
    
    /** Count of items with this priority */
    value: number;
    
    /** Hex color code for chart visualization */
    color: string;
    
    /** Short rank identifier */
    rank: string;
    
    /** Sort order (1-4) */
    order: number;
    
    /** Percentage of total (optional) */
    percentage?: number;
    
    /** Trend compared to previous period (optional) */
    trend?: number;
  }
  
  /**
   * Priority distribution filters for API requests
   */
  export interface PriorityDistributionFilters {
    /** User ID for filtering (optional) */
    userId?: number;
    
    /** Timeframe for data filtering */
    timeframe?: 'day' | 'week' | 'month' | 'year' | 'all';
    
    /** Whether to include detailed metadata in response */
    includeDetails?: boolean;
    
    /** Entity type to filter by */
    entityType?: 'projects' | 'tasks' | 'both';
    
    /** Start date for custom date range */
    startDate?: Date;
    
    /** End date for custom date range */
    endDate?: Date;
    
    /** Limit number of results */
    limit?: number;
    
    /** Sort order */
    sortBy?: 'count' | 'priority' | 'name';
    
    /** Sort direction */
    sortDirection?: 'ASC' | 'DESC';
  }
  
  // ============================================
  // Dashboard Statistics
  // ============================================
  
  /**
   * Dashboard statistics
   */
  export interface DashboardStats {
    /** Total number of projects */
    totalProjects: number;
    
    /** Active projects count */
    activeProjects: number;
    
    /** Planning phase projects */
    planningProjects: number;
    
    /** Completed projects */
    completedProjects: number;
    
    /** On hold projects */
    onHoldProjects: number;
    
    /** Archived projects */
    archivedProjects: number;
    
    /** Urgent priority projects */
    urgentProjects: number;
    
    /** High priority projects */
    highPriorityProjects: number;
    
    /** Total tasks count */
    totalTasks: number;
    
    /** Active tasks (not completed) */
    activeTasks: number;
    
    /** Tasks in progress */
    inProgressTasks: number;
    
    /** Tasks under review */
    reviewTasks: number;
    
    /** Completed tasks */
    completedTasks: number;
    
    /** Overall completion rate percentage */
    completionRate: number;
  }
  
  /**
   * Dashboard metrics
   */
  export interface DashboardMetrics {
    /** Overall completion rate */
    completionRate: number;
    
    /** Average project progress percentage */
    avgProjectProgress: number;
    
    /** Total estimated hours across all tasks */
    totalEstimatedHours: number;
    
    /** Total unique team members */
    totalTeamMembers: number;
    
    /** Count of high priority items */
    highPriorityCount: number;
    
    /** Count of overdue items */
    overdueCount: number;
  }
  
  // ============================================
  // Project Types
  // ============================================
  
  /**
   * Project summary
   */
  export interface ProjectSummary {
    /** Project ID */
    id: number;
    
    /** Project name */
    name: string;
    
    /** Project description */
    description: string;
    
    /** Project status */
    status: 'planning' | 'active' | 'onHold' | 'completed' | 'archived';
    
    /** Priority level */
    priority: 'low' | 'medium' | 'high' | 'urgent';
    
    /** Completion progress percentage */
    progress: number;
    
    /** Due date ISO string */
    dueDate: string | null;
    
    /** Team member names */
    teamMembers: string[];
    
    /** Client/Sponsor name */
    clientName: string | null;
    
    /** Project lead name */
    projectLead: string | null;
    
    /** Project category */
    category: string | null;
    
    /** Project tags */
    tags: string[];
  }
  
  // ============================================
  // Task Types
  // ============================================
  
  /**
   * Task summary
   */
  export interface TaskSummary {
    /** Task ID */
    id: number;
    
    /** Task title */
    title: string;
    
    /** Task description */
    description: string;
    
    /** Task status */
    status: 'todo' | 'inprogress' | 'review' | 'done';
    
    /** Priority level */
    priority: 'low' | 'medium' | 'high' | 'urgent';
    
    /** Due date ISO string */
    dueDate: string | null;
    
    /** Associated project ID */
    projectId: number;
    
    /** Associated project name */
    projectName: string;
    
    /** Assigned users */
    assignedTo: string[];
    
    /** Estimated hours for completion */
    estimatedHours: number | null;
  }
  
  // ============================================
  // Activity Types
  // ============================================
  
  /**
   * Activity item
   */
  export interface ActivityItem {
    /** Activity ID */
    id: number;
    
    /** Activity type */
    type: 'project' | 'task';
    
    /** Action performed */
    action: string;
    
    /** Activity description */
    description: string;
    
    /** Timestamp of activity */
    timestamp: Date;
    
    /** User ID who performed action */
    userId: string | null;
    
    /** User name who performed action */
    userName: string | null;
    
    /** Additional metadata */
    metadata: Record<string, any>;
  }
  
  // ============================================
  // Chart Data Types
  // ============================================
  
  /**
   * Chart data for visualizations
   */
  export interface ChartData {
    /** Project status distribution */
    projectStatusDistribution: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    
    /** Priority distribution data */
    priorityDistribution: PriorityDistributionItem[];
    
    /** Weekly progress data */
    weeklyProgress: Array<{
      day: string;
      projects: number;
      tasks: number;
    }>;
    
    /** Project progress trend over time */
    projectProgressTrend: Array<{
      date: string;
      completed: number;
      created: number;
    }>;
  }
  
  // ============================================
  // Priority Distribution Extended Types
  // ============================================
  
  /**
   * Priority distribution comparison between two periods
   */
  export interface PriorityDistributionComparison {
    /** First period distribution */
    period1: {
      timeframe: string;
      distribution: PriorityDistributionItem[];
      total: number;
      timestamp: Date;
    };
    
    /** Second period distribution */
    period2: {
      timeframe: string;
      distribution: PriorityDistributionItem[];
      total: number;
      timestamp: Date;
    };
    
    /** Trends between periods */
    trends: Array<{
      priority: string;
      current: number;
      previous: number;
      change: number;
      percentageChange: number;
      trend: 'up' | 'down' | 'stable';
    }>;
    
    /** Overall change metrics */
    overallChange: {
      totalChange: number;
      totalPercentageChange: number;
      direction: 'increase' | 'decrease' | 'stable';
    };
  }
  
  /**
   * Priority distribution trend over time
   */
  export interface PriorityDistributionTrend {
    /** Timeline points with distribution data */
    timeline: Array<{
      date: Date;
      label: string;
      distribution: PriorityDistributionItem[];
      total: number;
    }>;
    
    /** Priority-specific trends */
    priorityTrends: Array<{
      priority: string;
      name: string;
      color: string;
      values: Array<{ date: Date; value: number }>;
      trend: number;
      forecast: number;
    }>;
    
    /** Summary statistics */
    summary: {
      highestGrowth: string;
      highestDecline: string;
      averageGrowth: number;
      mostStable: string;
    };
  }
  
  /**
   * Priority distribution insights with recommendations
   */
  export interface PriorityDistributionInsights {
    /** Raw distribution data */
    distribution: PriorityDistributionItem[];
    
    /** Total count */
    total: number;
    
    /** Percentage breakdown */
    percentages: {
      sRank: number;
      aRank: number;
      bRank: number;
      cRank: number;
      highPriority: number;
    };
    
    /** Count breakdown */
    counts: {
      sRank: number;
      aRank: number;
      bRank: number;
      cRank: number;
      total: number;
    };
    
    /** Generated insights */
    insights: Array<{
      type: 'critical' | 'warning' | 'info' | 'success';
      title: string;
      description: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
      action?: string;
    }>;
    
    /** Actionable recommendation */
    recommendation: string;
    
    /** Timeframe analyzed */
    timeframe: string;
    
    /** Health score (0-100) */
    healthScore: number;
    
    /** Risk level */
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
  }
  
  // ============================================
  // Main Dashboard Data
  // ============================================
  
  /**
   * Complete dashboard data
   */
  export interface DashboardData {
    /** Dashboard statistics */
    stats: DashboardStats;
    
    /** Recent projects list */
    recentProjects: ProjectSummary[];
    
    /** Upcoming tasks list */
    upcomingTasks: TaskSummary[];
    
    /** Recent activity feed */
    recentActivity: ActivityItem[];
    
    /** Dashboard metrics */
    metrics: DashboardMetrics;
    
    /** Chart data for visualizations */
    chartData: ChartData;
  }
  
  // ============================================
  // API Response Types
  // ============================================
  
  /**
   * API response wrapper
   */
  export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
  }
  
  /**
   * Priority distribution API response
   */
  export interface PriorityDistributionApiResponse extends ApiResponse<PriorityDistributionItem[]> {
    metadata: {
      timeframe: string;
      entityType: string;
      userId: string | number;
      timestamp: string;
      total: number;
      filters?: PriorityDistributionFilters;
    };
  }
  
  /**
   * Priority distribution comparison response
   */
  export interface Prio extends ApiResponse<PriorityDistributionComparison> {
    metadata: {
      period1: string;
      period2: string;
      userId: string | number;
      timestamp: string;
    };
  }
  
  /**
   * Priority distribution trends response
   */
  export interface PrpZEAWYtiB6bJ16NuLbGCc6CZ6jJdKfb63 extends ApiResponse<PriorityDistributionTrend> {
    metadata: {
      timeframe: string;
      interval: string;
      userId: string | number;
      timestamp: string;
    };
  }
  
  /**
   * Priority distribution insights response
   */
  export interface PriorityDistributionInsightsResponse extends ApiResponse<PriorityDistributionInsights> {
    metadata: {
      timeframe: string;
      userId: string | number;
      timestamp: string;
    };
  }
  
  /**
   * Priority distribution by entity response
   */
  export interface PriorpZEAWYtiB6bJ16NuLbGCc6CZ6jJdKfb63 extends ApiResponse<{
    projects: PriorityDistributionItem[];
    tasks: PriorityDistributionItem[];
    combined: PriorityDistributionItem[];
  }> {
    metadata: {
      timeframe: string;
      userId: string | number;
      timestamp: string;
    };
  }
  
  // ============================================
  // Helper Types
  // ============================================
  
  /**
   * Priority rank mapping
   */
  export interface PriorityRankMap {
    urgent: 'S';
    high: 'A';
    medium: 'B';
    low: 'C';
  }
  
  /**
   * Priority color mapping
   */
  export interface PriorityColorMap {
    urgent: string;
    high: string;
    medium: string;
    low: string;
  }
  
  /**
   * Priority display name mapping
   */
  export interface PriorityNameMap {
    urgent: string;
    high: string;
    medium: string;
    low: string;
  }
  
  /**
   * Status color mapping
   */
  export interface StatusColorMap {
    active: string;
    planning: string;
    onHold: string;
    completed: string;
    archived: string;
  }
  
  /**
   * Status name mapping
   */
  export interface StatusNameMap {
    active: string;
    planning: string;
    onHold: string;
    completed: string;
    archived: string;
  }
  
  // ============================================
  // Dashboard Options
  // ============================================
  
  /**
   * Get dashboard options
   */
  export interface GetDashboardOptions {
    /** User ID for filtering */
    userId?: number;
    
    /** Timeframe for data */
    timeframe?: string;
    
    /** Limit number of results */
    limit?: number;
    
    /** Status filter */
    status?: string;
  }
  
  /**
   * Chart data options
   */
  export interface ChartDataOptions {
    /** Chart type */
    type?: 'status' | 'priority' | 'weekly' | 'trend';
    
    /** Timeframe for data */
    timeframe?: 'week' | 'month';
    
    /** User ID for filtering */
    userId?: number;
  }
  

