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

/**
 * Priority Distribution Routes
 */
// Get priority distribution with advanced filtering
dashboardRouter.get('/priority-distribution', DashboardController.getPriorityDistribution);

// Compare priority distribution between two periods
dashboardRouter.get('/priority-distribution/compare', DashboardController.getPriorityDistributionComparison);

// Get priority distribution trends over time
dashboardRouter.get('/priority-distribution/trends', DashboardController.getPriorityDistributionTrends);

// Get priority distribution by entity (projects/tasks separately)
dashboardRouter.get('/priority-distribution/by-entity', DashboardController.getPrpZEAWYtiB6bJ16NuLbGCc6CZ6jJdKfb63);

// Get priority distribution insights and recommendations
dashboardRouter.get('/priority-distribution/insights', DashboardController.getPriorityDistributionInsights);

export default dashboardRouter;