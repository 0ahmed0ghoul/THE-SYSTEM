// backend/src/types/dashboard.types.ts

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
  
  /**
   * Priority distribution item
   */
  export interface PriorityDistributionItem {
    name: string;
    value: number;
    color: string;
    rank: string;
    order: number;
    percentage?: number;
    trend?: number;
    total?: number;
  }

  export interface PrpZEAWYtiB6bJ16NuLbGCc6CZ6jJdKfb63 {
    /** Distribution data array */
    data: PriorityDistributionItem[];
    
    /** Total count across all priorities */
    total: number;
    
    /** Percentages by priority name */
    percentages: Record<string, number>;
    
    /** Rank mapping by priority name */
    ranks: Record<string, string>;
    
    /** Priority mapping with counts */
    counts: Record<string, number>;
    
    /** Highest priority type */
    highestPriority: string;
    
    /** Lowest priority type */
    lowestPriority: string;
    
    /** Average priority score (1-4, where 1 is highest) */
    averagePriorityScore: number;
  }
  
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
    /** Timeline points */
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
   * Priority distribution insights
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
  
  /**
   * Dashboard statistics
   */
  export interface DashboardStats {
    totalProjects: number;
    activeProjects: number;
    planningProjects: number;
    completedProjects: number;
    onHoldProjects: number;
    archivedProjects: number;
    urgentProjects: number;
    highPriorityProjects: number;
    totalTasks: number;
    activeTasks: number;
    inProgressTasks: number;
    reviewTasks: number;
    completedTasks: number;
    completionRate: number;
  }
  
  /**
   * Project summary
   */
  export interface ProjectSummary {
    id: number;
    name: string;
    description: string;
    status: string;
    priority: string;
    progress: number;
    dueDate: string | null;
    teamMembers: string[];
    clientName: string | null;
    projectLead: string | null;
    category: string | null;
    tags: string[];
  }
  
  /**
   * Task summary
   */
  export interface TaskSummary {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string | null;
    projectId: number;
    projectName: string;
    assignedTo: string[];
    estimatedHours: number | null;
  }
  
  /**
   * Activity item
   */
  export interface ActivityItem {
    id: number;
    type: 'project' | 'task';
    action: string;
    description: string;
    timestamp: Date;
    userId: string | null;
    userName: string | null;
    metadata: Record<string, any>;
  }
  
  /**
   * Dashboard metrics
   */
  export interface DashboardMetrics {
    completionRate: number;
    avgProjectProgress: number;
    totalEstimatedHours: number;
    totalTeamMembers: number;
    highPriorityCount: number;
    overdueCount: number;
  }
  
  /**
   * Chart data
   */
  export interface ChartData {
    projectStatusDistribution: Array<{ name: string; value: number; color: string }>;
    priorityDistribution: PriorityDistributionItem[];
    weeklyProgress: Array<{ day: string; projects: number; tasks: number }>;
    projectProgressTrend: Array<{ date: string; completed: number; created: number }>;
  }
  
  /**
   * Complete dashboard data
   */
  export interface DashboardData {
    stats: DashboardStats;
    recentProjects: ProjectSummary[];
    upcomingTasks: TaskSummary[];
    recentActivity: ActivityItem[];
    metrics: DashboardMetrics;
    chartData: ChartData;
  }
  
  /**
   * Get dashboard options
   */
  export interface GetDashboardOptions {
    userId?: number  ;
    timeframe?: string;
    limit?: number;
    status?: string;
  }
  
  /**
   * Priority distribution API response
   */
  export interface PriorityDistributionApiResponse {
      success: boolean;
      data: PriorityDistributionItem[];
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
  export interface Prio {
    success: boolean;
    data: PriorityDistributionComparison;
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
  export interface PriorityDistributionTrendResponse {
      success: boolean;
      data: PriorityDistributionTrend;
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
  export interface PriorityDistributionInsightsResponse {
    success: boolean;
    data: PriorityDistributionInsights;
    metadata: {
      timeframe: string;
      userId: string | number;
      timestamp: string;
    };
  }
  
  /**
   * Priority distribution by entity response
   */
  export interface PriorpZEAWYtiB6bJ16NuLbGCc6CZ6jJdKfb63 {
    success: boolean;
    data: {
      projects: PriorityDistributionItem[];
      tasks: PriorityDistributionItem[];
      combined: PriorityDistributionItem[];
    };
    metadata: {
      timeframe: string;
      userId: string | number;
      timestamp: string;
    };
  }
  
  /**
   * Priority score mapping
   */
  export interface PriorityScoreMap {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  }
  
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
   * Priority distribution query result
   */
  export interface PriorityDistributionQueryResult {
    priority: string;
    count: number;
    percentage?: number;
  }
  
  /**
   * Priority distribution trend point
   */
  export interface TrendPoint {
    date: Date;
    value: number;
    priority: string;
  }