// backend/src/controllers/dashboardController.ts
import { Request, Response } from 'express';
import { GetDashboardOptions, PriorityDistributionFilters } from '../types/dashboard.types.js';
import { DashboardService } from '../services/dashboard.Service.js';



export class DashboardController {

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
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

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

}