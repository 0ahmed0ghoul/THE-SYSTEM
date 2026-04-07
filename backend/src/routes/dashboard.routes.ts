// backend/src/routes/dashboard.routes.ts
import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const dashboardRouter = Router();

// All dashboard routes require authentication
dashboardRouter.use(authMiddleware);

/**
 * Dashboard Overview Routes
 */
// Get complete dashboard data
dashboardRouter.get('/', DashboardController.getDashboardData);

// Get dashboard stats only (lightweight)
dashboardRouter.get('/stats', DashboardController.getStats);

// Get recent projects with optional filters
dashboardRouter.get('/recent-projects', DashboardController.getRecentProjects);

// Get upcoming tasks
dashboardRouter.get('/upcoming-tasks', DashboardController.getUpcomingTasks);

// Get activity feed
dashboardRouter.get('/activity', DashboardController.getActivityFeed);

// Get chart data for visualizations
dashboardRouter.get('/charts', DashboardController.getChartData);


export default dashboardRouter;