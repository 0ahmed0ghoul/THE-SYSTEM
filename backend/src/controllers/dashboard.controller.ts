// backend/src/controllers/dashboardController.ts
import { Request, Response } from 'express';
import { GetDashboardOptions, PriorityDistributionFilters } from '../types/dashboard.types.js';
import { DashboardService } from '../services/dashboard.Service.js';



export class DashboardController {
  /**
   * Get complete dashboard data
   * GET /api/dashboard
   */
  static async getDashboardData(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      const { timeframe = 'week', limit = 8 } = req.query;

      const options: GetDashboardOptions = {
        userId,
        timeframe: timeframe as string,
        limit: parseInt(limit as string)
      };

      const dashboardData = await DashboardService.getDashboardData(options);

      return res.status(200).json({
        success: true,
        data: dashboardData
      });

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  /**
   * Get dashboard stats only (lightweight)
   * GET /api/dashboard/stats
   */
  static async getStats(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      const stats = await DashboardService.getStats(userId);

      return res.status(200).json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Stats fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch stats'
      });
    }
  }

  static async getRecentProjects(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      const limit = parseInt(req.query.limit as string) || 6;
      const status = req.query.status as string;

      const projects = await DashboardService.getRecentProjects(userId, limit, status);

      return res.status(200).json({
        success: true,
        data: projects
      });

    } catch (error) {
      console.error('Recent projects fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch recent projects'
      });
    }
  }

  static async getUpcomingTasks(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      const limit = parseInt(req.query.limit as string) || 8;

      const tasks = await DashboardService.getUpcomingTasks(userId, limit);

      return res.status(200).json({
        success: true,
        data: tasks
      });

    } catch (error) {
      console.error('Upcoming tasks fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch upcoming tasks'
      });
    }
  }


  static async getActivityFeed(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      const limit = parseInt(req.query.limit as string) || 10;

      const activities = await DashboardService.getActivityFeed(userId, limit);

      return res.status(200).json({
        success: true,
        data: activities
      });

    } catch (error) {
      console.error('Activity feed fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch activity feed'
      });
    }
  }

  static async getChartData(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      const type = req.query.type as string;
      const timeframe = req.query.timeframe as string || 'week';

      const chartData = await DashboardService.getChartData(userId, type, timeframe);

      return res.status(200).json({
        success: true,
        data: chartData
      });

    } catch (error) {
      console.error('Chart data fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch chart data'
      });
    }
  }

  static async getPriorityDistribution(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      const { 
        timeframe = 'all', 
        includeDetails = 'false',
        entityType = 'both'
      } = req.query;

      const filters: PriorityDistributionFilters = {
        userId,
        timeframe: timeframe as any,
        includeDetails: includeDetails === 'true',
        entityType: entityType as any
      };

      let result;

      if (filters.includeDetails) {
        // Get detailed priority distribution with metadata
        const distribution = await DashboardService.getPriorityDistributionWithDetails(filters);
        result = distribution;
      } else {
        // Get simple priority distribution
        const distribution = await DashboardService.getPriorityDistribution(
          filters.userId,
          filters.timeframe,
          filters.entityType
        );
        result = distribution;
      }

      return res.status(200).json({
        success: true,
        data: result,
        metadata: {
          timeframe: filters.timeframe,
          entityType: filters.entityType,
          userId: filters.userId || 'all',
          timestamp: new Date().toISOString(),
          total: result.reduce((sum: number, item: any) => sum + item.value, 0)        }
      });

    } catch (error) {
      console.error('Priority distribution fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch priority distribution data',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  static async getPriorityDistributionComparison(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      const { period1 = 'week', period2 = 'month' } = req.query;

      const comparison = await DashboardService.comparePriorityDistribution(
        userId,
        period1 as string,
        period2 as string
      );

      return res.status(200).json({
        success: true,
        data: comparison,
        metadata: {
          period1,
          period2,
          userId: userId || 'all',
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Priority distribution comparison error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch priority distribution comparison'
      });
    }
  }

  static async getPriorityDistributionTrends(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      const { timeframe = 'month', interval = 'day' } = req.query;

      const trends = await DashboardService.getPriorityDistributionTrends(
        userId,
        timeframe as string,
        interval as string
      );

      return res.status(200).json({
        success: true,
        data: trends,
        metadata: {
          timeframe,
          interval,
          userId: userId || 'all',
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Priority distribution trends fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch priority distribution trends'
      });
    }
  }

  static async getPrpZEAWYtiB6bJ16NuLbGCc6CZ6jJdKfb63(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      const { timeframe = 'all' } = req.query;

      const [projects, tasks] = await Promise.all([
        DashboardService.getPriorityDistribution(userId, timeframe as string, 'projects'),
        DashboardService.getPriorityDistribution(userId, timeframe as string, 'tasks')
      ]);

      return res.status(200).json({
        success: true,
        data: {
          projects,
          tasks,
          combined: await DashboardService.getPriorityDistribution(userId, timeframe as string, 'both')
        },
        metadata: {
          timeframe,
          userId: userId || 'all',
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Priority distribution by entity fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch priority distribution by entity'
      });
    }
  }

  static async getPriorityDistributionInsights(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.id;
      const { timeframe = 'month' } = req.query;

      const distribution = await DashboardService.getPriorityDistribution(
        userId,
        timeframe as string,
        'both'
      );

      const insights = this.generatePriorityInsights(distribution, timeframe as string);

      return res.status(200).json({
        success: true,
        data: insights,
        metadata: {
          timeframe,
          userId: userId || 'all',
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Priority distribution insights fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch priority distribution insights'
      });
    }
  }

  private static generatePriorityInsights(
    distribution: Array<{ name: string; value: number; color: string }>,
    timeframe: string
  ): any {
    const total = distribution.reduce((sum, item) => sum + item.value, 0);
    const sRank = distribution.find(d => d.name === 'S-Rank')?.value || 0;
    const aRank = distribution.find(d => d.name === 'A-Rank')?.value || 0;
    const bRank = distribution.find(d => d.name === 'B-Rank')?.value || 0;
    const cRank = distribution.find(d => d.name === 'C-Rank')?.value || 0;

    const highPriorityTotal = sRank + aRank;
    const highPriorityPercentage = total > 0 ? (highPriorityTotal / total) * 100 : 0;

    const insights = [];

    if (highPriorityPercentage > 30) {
      insights.push({
        type: 'warning',
        title: 'High Priority Load',
        description: `${highPriorityPercentage.toFixed(1)}% of items are S-Rank or A-Rank priority. Consider resource reallocation.`,
        severity: 'high'
      });
    }

    if (sRank > aRank) {
      insights.push({
        type: 'critical',
        title: 'S-Rank Overload',
        description: `S-Rank items (${sRank}) exceed A-Rank items (${aRank}). Immediate attention required.`,
        severity: 'critical'
      });
    }

    if (cRank > bRank && total > 0) {
      insights.push({
        type: 'info',
        title: 'Low Priority Distribution',
        description: `C-Rank items (${cRank}) represent ${((cRank / total) * 100).toFixed(1)}% of total. Good opportunity for quick wins.`,
        severity: 'low'
      });
    }

    const recommendation = this.generateRecommendation(sRank, aRank, bRank, cRank, total);

    return {
      distribution,
      total,
      percentages: {
        sRank: total > 0 ? (sRank / total) * 100 : 0,
        aRank: total > 0 ? (aRank / total) * 100 : 0,
        bRank: total > 0 ? (bRank / total) * 100 : 0,
        cRank: total > 0 ? (cRank / total) * 100 : 0,
        highPriority: highPriorityPercentage
      },
      counts: { sRank, aRank, bRank, cRank, total },
      insights,
      recommendation,
      timeframe
    };
  }

  private static generateRecommendation(
    sRank: number,
    aRank: number,
    bRank: number,
    cRank: number,
    total: number
  ): string {
    if (sRank > 5) {
      return 'Immediate: Schedule emergency review for all S-Rank items. Consider team expansion or deadline extensions.';
    }
    
    if (aRank > 10) {
      return 'Urgent: Prioritize A-Rank items in next sprint. Review team capacity and redistribute workload.';
    }
    
    if (bRank > total * 0.5) {
      return 'Balanced: Maintain current velocity. Consider upskilling team to handle higher priority items.';
    }
    
    if (cRank > total * 0.6) {
      return 'Opportunity: Quick wins available. Knock out C-Rank items to reduce backlog and boost morale.';
    }
    
    return 'Monitor: Distribution appears balanced. Continue current prioritization strategy.';
  }
}